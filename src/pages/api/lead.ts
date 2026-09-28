/*
  POST /api/lead (S33, 9/28/26): the contact form behind /contact.

  Body: { name, email, company?, intent, message, website (honeypot), source?, page? }

  Gates, in order: size, JSON, honeypot (200 and nothing written), the three
  required fields, the email, the intent allowlist (unknown = "other"), the
  kill switch, the per-instance limiter, the dedupe. Then, awaited together
  with timeouts (Vercel freezes a function after it answers): the Airtable row,
  the notification to Gabriel, the confirmation to the visitor. The response is
  ok when the row OR the notification landed (the lead exists in one place at
  least); 502 when both failed, so the page shows the mailto fallback with the
  message already in it.

  Off (LEAD_CAPTURE_ENABLED != "true" or no RESEND_API_KEY): 503 { reason: "off" }.
  Dev only: LEAD_DRY_RUN=true skips every network call and writes .dry-run/lead.txt.
  Never logs an address, a message, or a key: only status codes and error types.

  The visitor's words are not passed through clean(): a message may carry a
  budget or a dash and both belong to the visitor. They are trimmed and capped.
*/
import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import { DEFAULT_INTENT, intents, mail, type Intent } from "../../data/contact";
import { byteLength, EMAIL_RE } from "../../lib/text";
import { airtable, airtableUrl, clientIp, createLimiter, DEV, env, gabriel, json, postal, sendMail, writeLead } from "../../lib/leadCapture";

export const prerender = false;

const BODY_MAX_BYTES = 8_000;
const RATE_LIMIT = 3;
const NAME_MAX = 120;
const COMPANY_MAX = 120;
const MESSAGE_MAX = 2_000;
const REF_MAX = 100;
const INTENTS = new Set<string>(intents.map((i) => i.value));
const limiter = createLimiter(RATE_LIMIT);

type Body = { name?: unknown; email?: unknown; company?: unknown; intent?: unknown; message?: unknown; website?: unknown; source?: unknown; page?: unknown };

const line = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const block = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, max) : "";

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

  // A filled honeypot answers success and writes nothing.
  if (typeof b.website === "string" && b.website.trim() !== "") return json({ ok: true, stored: true, notified: true });

  const name = line(b.name, NAME_MAX);
  const email = typeof b.email === "string" ? b.email.trim().slice(0, 254) : "";
  const company = line(b.company, COMPANY_MAX);
  const message = block(b.message, MESSAGE_MAX);
  const intent: Intent = typeof b.intent === "string" && INTENTS.has(b.intent) ? (b.intent as Intent) : DEFAULT_INTENT;
  const source = line(b.source, REF_MAX);
  const pageRaw = line(b.page, REF_MAX);
  const page = pageRaw.startsWith("/") ? pageRaw : "";

  if (!name || !message) return json({ ok: false, reason: "missing" }, 400);
  if (!EMAIL_RE.test(email)) return json({ ok: false, reason: "email" }, 400);

  const now = Date.now();
  const ip = clientIp(request, clientAddress);
  const on = env("LEAD_CAPTURE_ENABLED") === "true" && Boolean(env("RESEND_API_KEY"));
  const dryRun = DEV && env("LEAD_DRY_RUN") === "true";
  const booking = env("BOOKING_URL") || undefined;

  // Company, page and source ride at the bottom of the message: the table has five fields on purpose (9/28/26).
  const stored = [message, "", company ? `Company: ${company}` : "", page ? `From: ${page}` : "", source ? `Source: ${source}` : ""].filter((l, i) => i < 2 || l).join("\n").trim();
  const notifyText = mail.notify({ name, email, company, intent, message, page, source });
  const confirmText = mail.confirm({ name, booking, postal: postal() });

  if (dryRun) {
    try {
      const fs = await import("node:fs/promises");
      await fs.mkdir(".dry-run", { recursive: true });
      await fs.writeFile(
        ".dry-run/lead.txt",
        [`AIRTABLE ROW`, JSON.stringify({ email, name, intent, message: stored }, null, 2), "", `NOTIFY ${gabriel()}: ${mail.notifySubject(intent, name)}`, notifyText, "", `CONFIRM ${email}: ${mail.confirmSubject}`, confirmText].join("\n")
      );
    } catch (err) {
      console.warn("[lead] dry run write failed:", err instanceof Error ? err.name : "unknown");
    }
    return json({ ok: true, stored: true, notified: true, dryRun: true, id: "recDRYRUN000000000" });
  }

  if (!on) return json({ ok: false, reason: "off" }, 503);
  if (limiter.overLimit(ip, now)) return json({ ok: false, reason: "rate" }, 429);

  const key = createHash("sha256").update(`${email.toLowerCase()}|${message}`).digest("hex");
  if (limiter.seenRecently(key, now)) return json({ ok: true, stored: true, notified: true, duplicate: true });

  let id: string | null = null;
  const [row, notify, confirm] = await Promise.allSettled([
    writeLead({ email, name, intent, message: stored }, "lead").then((r) => (id = r)),
    sendMail({ to: gabriel(), subject: mail.notifySubject(intent, name), text: notifyText, replyTo: email, idempotencyKey: `${key}-notify` }, "site_contact"),
    sendMail({ to: email, subject: mail.confirmSubject, text: confirmText, idempotencyKey: `${key}-confirm` }, "site_contact_confirm")
  ]);
  for (const r of [row, notify, confirm]) if (r.status === "rejected") console.warn("[lead] step failed:", r.reason instanceof Error ? r.reason.name : "unknown");

  const storedOk = row.status === "fulfilled" && id !== null;
  const notifiedOk = notify.status === "fulfilled" && notify.value.ok;
  if (!storedOk && !notifiedOk) {
    limiter.forget(key);
    console.error("[lead] nothing landed:", notify.status === "fulfilled" ? notify.value.status : "threw");
    return json({ ok: false, reason: "send" }, 502);
  }
  return json({ ok: true, id, stored: storedOk, notified: notifiedOk, confirmed: confirm.status === "fulfilled" && confirm.value.ok });
};

/*
  GET ?_check=1 (S34, 9/28/26): the config check for a phone, no secrets. Which
  switches are set, and a read probe of the Airtable table (one record) so the
  status and Airtable's error type name the fault: 403 = the token cannot see
  the base or the base id is off, 404 = the table name, 401 = the key.
*/
export const GET: APIRoute = async ({ url }) => {
  if (url.searchParams.get("_check") !== "1") return json({ ok: false, reason: "method" }, 405);
  const base = env("AIRTABLE_BASE_ID") || "";
  const table = env("AIRTABLE_LEADS_TABLE") || "Leads";
  let probe: { status: number; type: string } = { status: 0, type: "unconfigured" };
  if (airtableUrl()) {
    try {
      const r = await airtable("GET", "?maxRecords=1", undefined);
      probe = { status: r.status, type: r.ok ? "ok" : ((r.data as { error?: { type?: string } } | null)?.error?.type ?? "unknown") };
    } catch (err) {
      probe = { status: 0, type: err instanceof Error ? err.name : "threw" };
    }
  }
  return json({
    on: env("LEAD_CAPTURE_ENABLED") === "true" && Boolean(env("RESEND_API_KEY")),
    resend: { configured: Boolean(env("RESEND_API_KEY")) },
    airtable: { configured: Boolean(airtableUrl()), base: base ? `${base.slice(0, 6)}... (${base.length} chars)` : "unset", table, ...probe },
    booking: Boolean(env("BOOKING_URL"))
  });
};

export const ALL: APIRoute = () => json({ ok: false, reason: "method" }, 405);
