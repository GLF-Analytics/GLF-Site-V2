/*
  POST /api/warehouse-report (S23, 9/15/26): the stack report by email, the one
  trade on the planner page (an address for a report), and the lead row behind it.

  Body: { email, answers, picks, reasons?, summary?, mentioned?, source?, swapped?,
          notes?: boolean, website (honeypot), ref?, page? }
  Or:   { action: "purpose", id, purpose }   (the optional one-tap after a send)

  Gates, in order: size, JSON, honeypot (200 and nothing written), email,
  answers, picks (sanitized, then priced HERE: a posted total is never trusted),
  the kill switch, the per-instance limiter, the dedupe. Then: the visitor's
  email through Resend (awaited), then the Airtable row, the audience add, and
  the notification to Gabriel, all awaited together with timeouts because the
  Vercel runtime freezes a function after it answers. None of those three can
  fail the response.

  Off (LEAD_CAPTURE_ENABLED != "true" or no RESEND_API_KEY): 503 { ok: false,
  reason: "off" } and the page falls back to a mailto with the stack in it.
  Dev only: LEAD_DRY_RUN=true skips every network call and writes the rendered
  email to .dry-run/ (gitignored); GET ?_preview=1&scenario=mid renders it.
  Never logs an address, a note, or a key: only status codes and error types.
*/
import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import { LAYERS, scenarios, type Layer } from "../../data/warehouse-catalog";
import { layerCopy, offer } from "../../data/warehouse-survey";
import { orgInfo, siteUrl } from "../../config/site";
import { parseAnswers, priceStack, sanitizePicks, toQuery, type Answers } from "../../lib/warehouseCalc";
import { buildReport, type Mentioned } from "../../lib/warehouseReport";
import { byteLength, clean, EMAIL_RE } from "../../lib/text";

export const prerender = false;

const BODY_MAX_BYTES = 12_000;
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT = 3;
const REASON_MAX = 240;
const SUMMARY_MAX = 600;
const REF_MAX = 100;
const hits = new Map<string, number[]>();
const sent = new Map<string, number>();

// astro dev fills import.meta.env from .env; Vercel fills process.env. Read both.
const env = (k: string): string | undefined => process.env[k] ?? (import.meta.env as Record<string, string | undefined>)[k];
const DEV = import.meta.env.DEV;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", "x-robots-tag": "noindex" }
  });

function overLimit(ip: string, now: number): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > RATE_LIMIT;
}

function seenRecently(key: string, now: number): boolean {
  const at = sent.get(key);
  if (sent.size > 5_000) sent.clear();
  if (at && now - at < RATE_WINDOW_MS) return true;
  sent.set(key, now);
  return false;
}

const names = Object.fromEntries(LAYERS.map((l) => [l, layerCopy[l].name])) as Record<Layer, string>;
const today = () => new Date().toISOString().slice(0, 10);
const postal = () => env("GLF_POSTAL_ADDRESS") || `${orgInfo.address.city}, ${orgInfo.address.region}`;
const gabriel = () => env("GABRIEL_EMAIL") || orgInfo.email;

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let t: ReturnType<typeof setTimeout> | undefined;
  const timer = new Promise<never>((_, reject) => (t = setTimeout(() => reject(new Error("timeout")), ms)));
  try {
    return await Promise.race([p, timer]);
  } finally {
    if (t) clearTimeout(t);
  }
}

// ---------- Resend (plain REST, no SDK) ----------

type Mail = { to: string; subject: string; html?: string; text: string; replyTo?: string; idempotencyKey?: string; attachment?: { filename: string; content: string } };

async function sendMail(m: Mail): Promise<{ ok: boolean; status: number }> {
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
    tags: [{ name: "kind", value: "warehouse_report" }]
  };
  if (m.html) body.html = m.html;
  if (m.attachment) body.attachments = [{ filename: m.attachment.filename, content: Buffer.from(m.attachment.content, "utf8").toString("base64") }];
  const res = await withTimeout(fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify(body) }), 8_000);
  return { ok: res.ok, status: res.status };
}

async function addContact(email: string): Promise<void> {
  const key = env("RESEND_API_KEY");
  const audience = env("RESEND_AUDIENCE_ID");
  if (!key || !audience) {
    console.warn("[warehouse-report] opt-in ticked but RESEND_AUDIENCE_ID is unset");
    return;
  }
  const res = await withTimeout(
    fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false })
    }),
    5_000
  );
  if (!res.ok) console.warn("[warehouse-report] audience add failed:", res.status);
}

// ---------- Airtable (plain REST) ----------

function airtableUrl(): string | null {
  const base = env("AIRTABLE_BASE_ID");
  if (!env("AIRTABLE_API_KEY") || !base) return null;
  return `https://api.airtable.com/v0/${base}/${encodeURIComponent(env("AIRTABLE_LEADS_TABLE") || "Leads")}`;
}

async function airtable(method: string, path: string, body: unknown): Promise<{ ok: boolean; status: number; data: unknown }> {
  const url = airtableUrl();
  if (!url) return { ok: false, status: 0, data: null };
  const res = await withTimeout(
    fetch(url + path, { method, headers: { authorization: `Bearer ${env("AIRTABLE_API_KEY")}`, "content-type": "application/json" }, body: JSON.stringify(body) }),
    5_000
  );
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {}
  return { ok: res.ok, status: res.status, data };
}

/** The full row first, then email + intent, then email alone: a renamed column never loses the lead. */
async function writeLead(fields: Record<string, unknown>): Promise<string | null> {
  if (!airtableUrl()) {
    console.warn("[warehouse-report] Airtable unset; lead not stored");
    return null;
  }
  const attempts: Record<string, unknown>[] = [fields, { email: fields.email, intent: fields.intent }, { email: fields.email }];
  for (const f of attempts) {
    const r = await airtable("POST", "", { fields: f, typecast: true });
    if (r.ok) return ((r.data as { id?: string } | null)?.id ?? null);
    const type = (r.data as { error?: { type?: string } } | null)?.error?.type ?? "unknown";
    console.warn("[warehouse-report] Airtable create failed:", r.status, type, Object.keys(f).length, "fields");
  }
  return null;
}

// ---------- the report ----------

type Body = {
  action?: unknown;
  id?: unknown;
  purpose?: unknown;
  email?: unknown;
  answers?: unknown;
  picks?: unknown;
  reasons?: unknown;
  summary?: unknown;
  mentioned?: unknown;
  source?: unknown;
  swapped?: unknown;
  notes?: unknown;
  website?: unknown;
  ref?: unknown;
  page?: unknown;
};

const text = (v: unknown, max: number) => (typeof v === "string" ? clean(v, max) : "");

function readMentioned(raw: unknown): Mentioned[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && typeof m === "object" && typeof (m as { name?: unknown }).name === "string")
    .map((m) => ({ name: text((m as { name: string }).name, 40), id: typeof (m as { id?: unknown }).id === "string" ? ((m as { id: string }).id as string) : null }))
    .filter((m) => m.name)
    .slice(0, 5);
}

function assemble(b: Body, answers: Answers) {
  const { picks } = sanitizePicks((b.picks && typeof b.picks === "object" ? b.picks : {}) as Record<string, unknown>, answers);
  const stack = priceStack(picks, answers);
  const reasons: Partial<Record<Layer, string>> = {};
  if (b.reasons && typeof b.reasons === "object") {
    for (const layer of LAYERS) {
      const r = text((b.reasons as Record<string, unknown>)[layer], REASON_MAX);
      if (r) reasons[layer] = r;
    }
  }
  const summary = text(b.summary, SUMMARY_MAX);
  const mentioned = readMentioned(b.mentioned);
  const answersUrl = `${siteUrl}/design-your-data-warehouse?${toQuery(answers)}`;
  return { picks, stack, reasons, summary, mentioned, answersUrl };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > BODY_MAX_BYTES) return json({ ok: false, reason: "large" }, 413);

  let b: Body;
  try {
    const raw = await request.text();
    if (byteLength(raw) > BODY_MAX_BYTES) return json({ ok: false, reason: "large" }, 413);
    b = JSON.parse(raw);
    if (!b || typeof b !== "object") throw new Error("shape");
  } catch {
    return json({ ok: false, reason: "json" }, 400);
  }

  const now = Date.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || clientAddress || "unknown";
  const on = env("LEAD_CAPTURE_ENABLED") === "true" && Boolean(env("RESEND_API_KEY"));
  const dryRun = DEV && env("LEAD_DRY_RUN") === "true";

  // The optional one-tap after a send: appends the purpose to the lead's row.
  if (b.action === "purpose") {
    const id = typeof b.id === "string" && /^rec[A-Za-z0-9]{14,17}$/.test(b.id) ? b.id : null;
    const purpose = offer.purposes.find((p) => p.value === b.purpose)?.label;
    if (!id || !purpose) return json({ ok: true, stored: false });
    if (dryRun) return json({ ok: true, stored: true, dryRun: true });
    if (overLimit(ip, now)) return json({ ok: true, stored: false }, 429);
    try {
      const current = await airtable("GET", `/${id}`, undefined);
      const message = ((current.data as { fields?: { message?: string } } | null)?.fields?.message ?? "").slice(0, 4000);
      const r = await airtable("PATCH", `/${id}`, { fields: { message: `${message}\nPurpose: ${purpose}`.trim() } });
      return json({ ok: true, stored: r.ok });
    } catch (err) {
      console.warn("[warehouse-report] purpose update failed:", err instanceof Error ? err.name : "unknown");
      return json({ ok: true, stored: false });
    }
  }

  // A filled honeypot answers success and writes nothing.
  if (typeof b.website === "string" && b.website.trim() !== "") return json({ ok: true, sent: true });

  const email = typeof b.email === "string" ? b.email.trim().slice(0, 254) : "";
  if (!EMAIL_RE.test(email)) return json({ ok: false, reason: "email" }, 400);
  const answers = parseAnswers(b.answers);
  if (!answers) return json({ ok: false, reason: "answers" }, 400);

  const { stack, reasons, summary, mentioned, answersUrl } = assemble(b, answers);
  const optIn = b.notes === true;
  const ref = typeof b.ref === "string" ? b.ref.trim().slice(0, REF_MAX) : "";
  const page = typeof b.page === "string" ? b.page.trim().slice(0, REF_MAX) : "/design-your-data-warehouse";
  const report = buildReport({ answers, stack, reasons, summary, mentioned, answersUrl, postal: postal(), replyTo: gabriel(), sentOn: today() });

  if (dryRun) {
    try {
      const fs = await import("node:fs/promises");
      await fs.mkdir(".dry-run", { recursive: true });
      await fs.writeFile(".dry-run/report.html", report.html);
      await fs.writeFile(".dry-run/report.txt", report.text);
      await fs.writeFile(".dry-run/warehouse-stack.md", report.markdown);
    } catch (err) {
      console.warn("[warehouse-report] dry run write failed:", err instanceof Error ? err.name : "unknown");
    }
    return json({ ok: true, sent: true, dryRun: true, id: "recDRYRUN000000000", subject: report.subject, stack });
  }

  if (!on) return json({ ok: false, reason: "off" }, 503);
  if (overLimit(ip, now)) return json({ ok: false, reason: "rate" }, 429);

  const key = createHash("sha256").update(`${email.toLowerCase()}|${toQuery(answers)}`).digest("hex");
  if (seenRecently(key, now)) return json({ ok: true, sent: true, duplicate: true });

  let delivered: { ok: boolean; status: number };
  try {
    delivered = await sendMail({
      to: email,
      subject: report.subject,
      html: report.html,
      text: report.text,
      idempotencyKey: key,
      attachment: { filename: "warehouse-stack.md", content: report.markdown }
    });
  } catch (err) {
    console.error("[warehouse-report] send threw:", err instanceof Error ? err.name : "unknown");
    delivered = { ok: false, status: 0 };
  }
  if (!delivered.ok) {
    console.error("[warehouse-report] send failed:", delivered.status);
    sent.delete(key);
    return json({ ok: false, reason: "send" }, 502);
  }

  const message = [
    `Stack report sent ${today()}`,
    ...report.digest,
    `Picked by ${b.source === "ai" ? "ai" : "rules"}${typeof b.swapped === "number" && b.swapped > 0 ? `, ${b.swapped} swap${b.swapped === 1 ? "" : "s"}` : ""}. Newsletter opt-in: ${optIn ? "yes" : "no"}.`
  ].join("\n");

  let id: string | null = null;
  const after = await Promise.allSettled([
    writeLead({ email, intent: "report", source: ref, page, status: "New", message }).then((r) => (id = r)),
    optIn ? addContact(email) : Promise.resolve(),
    sendMail({ to: gabriel(), subject: `Stack report lead: ${email}`, text: [`Email: ${email}`, `Ref: ${ref || "none"}`, `Page: ${page}`, `Opt-in: ${optIn ? "yes" : "no"}`, "", ...report.digest].join("\n") })
  ]);
  for (const r of after) if (r.status === "rejected") console.warn("[warehouse-report] after-send step failed:", r.reason instanceof Error ? r.reason.name : "unknown");

  return json({ ok: true, sent: true, id, stack });
};

// Dev only: render the email for a catalog scenario so it can be screenshot without keys.
export const GET: APIRoute = async ({ url }) => {
  if (!DEV || url.searchParams.get("_preview") !== "1") return json({ ok: false, reason: "method" }, 405);
  const name = url.searchParams.get("scenario") || "mid";
  const s = scenarios.find((x) => x.name === name) ?? scenarios[1];
  const answers = { ...s.answers, notes: "We want one weekly number for every location and we already pay for Google Workspace." };
  const { stack, answersUrl } = assemble({ picks: {} }, answers);
  const report = buildReport({ answers, stack, reasons: {}, summary: "", mentioned: [{ name: "Google Workspace", id: null }], answersUrl, postal: postal(), replyTo: gabriel(), sentOn: today() });
  const format = url.searchParams.get("format");
  if (format === "text") return new Response(report.text, { headers: { "content-type": "text/plain; charset=utf-8" } });
  if (format === "md") return new Response(report.markdown, { headers: { "content-type": "text/markdown; charset=utf-8" } });
  return new Response(report.html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
};

export const ALL: APIRoute = () => json({ ok: false, reason: "method" }, 405);
