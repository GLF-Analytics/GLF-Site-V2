/*
  POST /api/warehouse-suggest: the one server route on the site (hybrid output,
  S15 9/14/26). Body: { answers }. Always answers with a priced stack.

  Wallet gate (the minimum before a key goes in; the full /app-hardening pass is
  owed before the page is linked anywhere):
  - kill switch: no AI call unless WAREHOUSE_AI_ENABLED === "true" and a key is set
  - strict enum validation + a note cap (parseAnswers) + a body size cap
  - a per-instance rate limit per IP
  - the model call has a timeout, no retries, and effort low
  - the real ceiling is the monthly spend limit on the provider workspace
  Fail open: any AI problem returns the rules pick with source "rules".
  The key is read from process.env at request time and never leaves this file.
*/
import type { APIRoute } from "astro";
import { parseAnswers, priceStack, recommendByRules, sanitizePicks, type Answers, type Picks } from "../../lib/warehouseCalc";
import { readWithAI, type Mentioned } from "../../lib/warehouseAI";

export const prerender = false;

const BODY_MAX_BYTES = 4_000;
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT = 5;
const hits = new Map<string, number[]>();

function overLimit(ip: string, now: number): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > RATE_LIMIT;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", "x-robots-tag": "noindex" }
  });

function payload(source: "ai" | "rules", a: Answers, picks: Picks, reasons: Record<string, string> = {}, summary = "", mentioned: Mentioned[] = []) {
  return { source, picks, reasons, summary, mentioned, stack: priceStack(picks, a) };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > BODY_MAX_BYTES) return json({ error: "too large" }, 413);

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > BODY_MAX_BYTES) return json({ error: "too large" }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad json" }, 400);
  }

  const answers = parseAnswers((body as { answers?: unknown } | null)?.answers);
  if (!answers) return json({ error: "bad answers" }, 400);

  const rules = recommendByRules(answers);
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (process.env.WAREHOUSE_AI_ENABLED !== "true" || !apiKey) return json(payload("rules", answers, rules));

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || clientAddress || "unknown";
  if (overLimit(ip, Date.now())) return json(payload("rules", answers, rules), 429);

  try {
    const read = await readWithAI(answers, { apiKey, model: process.env.WAREHOUSE_AI_MODEL });
    const { picks, replaced } = sanitizePicks(read.picks, answers);
    const reasons = Object.fromEntries(Object.entries(read.reasons).filter(([layer, r]) => r && !replaced.includes(layer as never)));
    return json(payload("ai", answers, picks, reasons, read.summary, read.mentioned));
  } catch (err) {
    // Log the class of failure only: never the key, never the visitor's note.
    console.error("[warehouse-suggest] AI read failed, rules used:", err instanceof Error ? err.name + " " + err.message.slice(0, 80) : "unknown");
    return json(payload("rules", answers, rules));
  }
};

export const ALL: APIRoute = () => json({ error: "method not allowed" }, 405);
