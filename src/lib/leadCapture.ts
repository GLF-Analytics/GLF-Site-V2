/*
  Shared lead-capture helpers (S33, 9/28/26): env reads, JSON responses,
  timeouts, the per-instance limiter and dedupe, Resend and Airtable over plain
  REST. Extracted from /api/warehouse-report so that route and /api/lead read
  one copy. Dependency-free on purpose: no SDK enters either function bundle.
  Never logs an address, a note, or a key: only status codes and error types.

  Resend (9/28/26): the dashboard has no Audiences any more; contacts are
  team-level and grouped by Segments. addContact() posts to /contacts and
  attaches the segment in RESEND_SEGMENT_ID (RESEND_AUDIENCE_ID is read as a
  fallback name). With neither set it does nothing, on purpose: a GLF opt-in
  must never land in the shared team list unsegmented.
*/
import { orgInfo } from "../config/site";

// astro dev fills import.meta.env from .env; Vercel fills process.env. Read both.
export const env = (k: string): string | undefined => process.env[k] ?? (import.meta.env as Record<string, string | undefined>)[k];
export const DEV = import.meta.env.DEV;

export const RATE_WINDOW_MS = 10 * 60_000;

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", "x-robots-tag": "noindex" }
  });

export const today = () => new Date().toISOString().slice(0, 10);
export const postal = () => env("GLF_POSTAL_ADDRESS") || `${orgInfo.address.city}, ${orgInfo.address.region}`;
export const gabriel = () => env("GABRIEL_EMAIL") || orgInfo.email;

export async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let t: ReturnType<typeof setTimeout> | undefined;
  const timer = new Promise<never>((_, reject) => (t = setTimeout(() => reject(new Error("timeout")), ms)));
  try {
    return await Promise.race([p, timer]);
  } finally {
    if (t) clearTimeout(t);
  }
}

/** One limiter per route: N hits per IP per window, plus a dedupe key with the same window. Per instance, so a fence and not a wall. */
export function createLimiter(limit: number) {
  const hits = new Map<string, number[]>();
  const seen = new Map<string, number>();
  return {
    overLimit(ip: string, now: number): boolean {
      const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
      recent.push(now);
      hits.set(ip, recent);
      if (hits.size > 5_000) hits.clear();
      return recent.length > limit;
    },
    seenRecently(key: string, now: number): boolean {
      const at = seen.get(key);
      if (seen.size > 5_000) seen.clear();
      if (at && now - at < RATE_WINDOW_MS) return true;
      seen.set(key, now);
      return false;
    },
    forget(key: string): void {
      seen.delete(key);
    }
  };
}

export const clientIp = (request: Request, clientAddress: string | undefined) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || clientAddress || "unknown";

// ---------- Resend (plain REST, no SDK) ----------

export type Mail = {
  to: string;
  subject: string;
  html?: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
  attachment?: { filename: string; content: string };
};

export async function sendMail(m: Mail, tag: string): Promise<{ ok: boolean; status: number }> {
  const key = env("RESEND_API_KEY");
  if (!key) return { ok: false, status: 0 };
  const from = env("RESEND_FROM") || `GLF Analytics <reports@glfanalytics.com>`;
  const headers: Record<string, string> = { authorization: `Bearer ${key}`, "content-type": "application/json" };
  if (m.idempotencyKey) headers["idempotency-key"] = m.idempotencyKey;
  const body: Record<string, unknown> = {
    from,
    to: [m.to],
    subject: m.subject,
    text: m.text,
    reply_to: m.replyTo ?? gabriel(),
    headers: { "List-Unsubscribe": `<mailto:${gabriel()}?subject=unsubscribe>` },
    tags: [{ name: "kind", value: tag }]
  };
  if (m.html) body.html = m.html;
  if (m.attachment) body.attachments = [{ filename: m.attachment.filename, content: Buffer.from(m.attachment.content, "utf8").toString("base64") }];
  const res = await withTimeout(fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify(body) }), 8_000);
  return { ok: res.ok, status: res.status };
}

/** A ticked opt-in: the contact goes into the GLF segment, or nowhere. */
export async function addContact(email: string, log: string): Promise<void> {
  const key = env("RESEND_API_KEY");
  const segment = env("RESEND_SEGMENT_ID") || env("RESEND_AUDIENCE_ID");
  if (!key || !segment) {
    console.warn(`[${log}] opt-in ticked but RESEND_SEGMENT_ID is unset; contact not added`);
    return;
  }
  const res = await withTimeout(
    fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false, segments: [{ id: segment }] })
    }),
    5_000
  );
  if (!res.ok) console.warn(`[${log}] contact add failed:`, res.status);
}

// ---------- Airtable (plain REST) ----------

export function airtableUrl(): string | null {
  const base = env("AIRTABLE_BASE_ID");
  if (!env("AIRTABLE_API_KEY") || !base) return null;
  return `https://api.airtable.com/v0/${base}/${encodeURIComponent(env("AIRTABLE_LEADS_TABLE") || "Leads")}`;
}

export async function airtable(method: string, path: string, body: unknown): Promise<{ ok: boolean; status: number; data: unknown }> {
  const url = airtableUrl();
  if (!url) return { ok: false, status: 0, data: null };
  const res = await withTimeout(
    fetch(url + path, {
      method,
      headers: { authorization: `Bearer ${env("AIRTABLE_API_KEY")}`, "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body)
    }),
    5_000
  );
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {}
  return { ok: res.ok, status: res.status, data };
}

/** The full row first, then email + intent, then email alone: a renamed column never loses the lead. */
export async function writeLead(fields: Record<string, unknown>, log: string): Promise<string | null> {
  if (!airtableUrl()) {
    console.warn(`[${log}] Airtable unset; lead not stored`);
    return null;
  }
  const attempts: Record<string, unknown>[] = [fields, { email: fields.email, intent: fields.intent }, { email: fields.email }];
  for (const f of attempts) {
    const r = await airtable("POST", "", { fields: f, typecast: true });
    if (r.ok) return (r.data as { id?: string } | null)?.id ?? null;
    const type = (r.data as { error?: { type?: string } } | null)?.error?.type ?? "unknown";
    console.warn(`[${log}] Airtable create failed:`, r.status, type, Object.keys(f).length, "fields");
  }
  return null;
}
