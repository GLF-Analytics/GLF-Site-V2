/*
  The warehouse survey engine. Pure functions, no I/O: the page frontmatter, the
  client script, and the API route all import this file, so the server and the
  browser price a stack the same way.

  Law: every dollar figure on the page comes from priceStack() and the catalog.
  The AI (src/lib/warehouseAI.ts) only picks catalog ids and writes reasons.
*/
import { catalog, LAYERS, type Layer, type Tool } from "../data/warehouse-catalog";

export const OPTIONS = {
  readers: ["1-5", "6-15", "16-50", "50+"],
  size: ["1", "2-10", "11-50", "50+"],
  systems: ["1-3", "4-6", "7-10", "10+"],
  kinds: ["pos", "store", "marketplaces", "accounting", "payroll", "ads", "crm", "reviews", "spreadsheets"],
  runner: ["none", "analyst", "engineer", "ai"],
  ecosystem: ["google", "microsoft", "neither"],
  freshness: ["daily", "hourly", "realtime"],
  askAi: ["no", "few", "everyone"],
  budget: ["under100", "100-500", "500-2000", "2000+", "unsure"]
} as const;

type Opt<K extends keyof typeof OPTIONS> = (typeof OPTIONS)[K][number];

export type Answers = {
  readers: Opt<"readers">;
  size: Opt<"size">;
  systems: Opt<"systems">;
  kinds: Opt<"kinds">[];
  runner: Opt<"runner">;
  ecosystem: Opt<"ecosystem">;
  freshness: Opt<"freshness">;
  askAi: Opt<"askAi">;
  /** S17: informs the summary line and the AI read; the rules pick ignores it. */
  budget: Opt<"budget">;
  notes: string;
};

export const NOTES_MAX = 600;
const SINGLE_KEYS = ["readers", "size", "systems", "runner", "ecosystem", "freshness", "askAi", "budget"] as const;

/** Strict validation for anything that crosses a trust boundary (the API body, the URL). */
export function parseAnswers(input: unknown): Answers | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;
  const out: Partial<Answers> = {};
  for (const key of SINGLE_KEYS) {
    const v = o[key];
    if (typeof v !== "string" || !(OPTIONS[key] as readonly string[]).includes(v)) return null;
    (out as Record<string, unknown>)[key] = v;
  }
  const kinds = o.kinds ?? [];
  if (!Array.isArray(kinds) || kinds.length > OPTIONS.kinds.length) return null;
  if (!kinds.every((k) => typeof k === "string" && (OPTIONS.kinds as readonly string[]).includes(k))) return null;
  out.kinds = [...new Set(kinds as Opt<"kinds">[])];
  const notes = o.notes ?? "";
  if (typeof notes !== "string" || notes.length > NOTES_MAX) return null;
  out.notes = notes;
  return out as Answers;
}

export function toQuery(a: Answers): string {
  const p = new URLSearchParams();
  for (const key of SINGLE_KEYS) p.set(key, a[key]);
  if (a.kinds.length) p.set("kinds", a.kinds.join("."));
  return p.toString();
}

/** Free text never goes in the URL; a shared link restores the choices only. Links from before S17 carry no budget. */
export function fromQuery(search: string): Answers | null {
  const p = new URLSearchParams(search);
  const raw: Record<string, unknown> = { notes: "" };
  for (const key of SINGLE_KEYS) raw[key] = p.get(key);
  raw.budget = p.get("budget") ?? "unsure";
  raw.kinds = p.get("kinds") ? p.get("kinds")!.split(".") : [];
  return parseAnswers(raw);
}

// ---------- the numbers a tool is priced against ----------

export type Ctx = {
  readers: [number, number];
  aiSeats: [number, number];
  builders: [number, number];
  sources: [number, number];
  /** 0 small, 1 medium, 2 large, 3 very large */
  volume: number;
};

const READERS: Record<Opt<"readers">, [number, number]> = { "1-5": [1, 5], "6-15": [6, 15], "16-50": [16, 50], "50+": [50, 100] };
const SOURCES: Record<Opt<"systems">, [number, number]> = { "1-3": [1, 3], "4-6": [4, 6], "7-10": [7, 10], "10+": [10, 15] };

export function contextFor(a: Answers): Ctx {
  const readers = READERS[a.readers];
  const aiSeats: [number, number] =
    a.askAi === "no" ? [0, 0] : a.askAi === "few" ? [Math.min(2, readers[0]), Math.min(5, readers[1])] : readers;
  const volume = Math.min(3, OPTIONS.size.indexOf(a.size) + (a.freshness === "daily" ? 0 : 1));
  return { readers, aiSeats, builders: [1, 2], sources: SOURCES[a.systems], volume };
}

export const VOLUME_LABELS = ["small", "medium", "large", "very large"] as const;

// ---------- pricing one tool ----------

export type LinePrice = { low: number; high: number; estimate: boolean; notPublished: boolean; basis: string };

const seatWord = (basis: "readers" | "ai" | "builders") => (basis === "builders" ? "builder" : basis === "ai" ? "AI seat" : "user");
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
const rangeText = (lo: number, hi: number, w: string) => (lo === hi ? plural(hi, w) : `${lo} to ${plural(hi, w)}`);

function seatCost(n: number, tiers: Extract<Tool["price"], { kind: "seatTiers" }>["tiers"]): number | null {
  if (n <= 0) return 0;
  const tier = tiers.find((t) => n <= (t.maxSeats ?? Infinity));
  if (!tier) return null;
  const billed = Math.max(n, tier.minSeats ?? 0);
  return (tier.base ?? 0) + Math.max(0, billed - (tier.included ?? 0)) * tier.perSeat;
}

export function priceTool(tool: Tool, ctx: Ctx): LinePrice {
  const p = tool.price;
  switch (p.kind) {
    case "free":
      return { low: 0, high: 0, estimate: false, notPublished: false, basis: "Free" };
    case "flat":
      return { low: p.monthly, high: p.monthly, estimate: false, notPublished: false, basis: "Flat monthly" };
    case "seatTiers": {
      const [lo, hi] = ctx[p.basis === "ai" ? "aiSeats" : p.basis];
      const low = seatCost(lo, p.tiers);
      const high = seatCost(hi, p.tiers);
      if (low === null || high === null) return { low: 0, high: 0, estimate: false, notPublished: true, basis: "Custom pricing at this size" };
      return { low, high, estimate: false, notPublished: false, basis: rangeText(lo, hi, seatWord(p.basis)) };
    }
    case "volume": {
      const [low, high] = p.monthly[ctx.volume];
      return { low, high, estimate: true, notPublished: false, basis: `Estimate at a ${VOLUME_LABELS[ctx.volume]} data size` };
    }
    case "sources": {
      const tierFor = (n: number) => p.tiers.find((t) => n <= t.maxSources);
      const lo = tierFor(ctx.sources[0]);
      const hi = tierFor(ctx.sources[1]);
      if (!lo || !hi) return { low: 0, high: 0, estimate: false, notPublished: true, basis: "Custom pricing at this many sources" };
      return { low: lo.monthly, high: hi.monthly, estimate: false, notPublished: false, basis: rangeText(ctx.sources[0], ctx.sources[1], "source") };
    }
    case "included":
      return { low: 0, high: 0, estimate: false, notPublished: false, basis: `Included with ${p.with}` };
    case "notPublished":
      return { low: 0, high: 0, estimate: false, notPublished: true, basis: "Price not published" };
  }
}

// ---------- picking a stack ----------

export type Picks = Record<Layer, string | null>;

export const byId = new Map(catalog.map((t) => [t.id, t]));
export const toolsIn = (layer: Layer) => catalog.filter((t) => t.layer === layer);

/** A tool that only works on top of another (Gemini in BigQuery, Dataform) needs that pick. */
export function compatible(tool: Tool, picks: Partial<Picks>): boolean {
  if (!tool.requires) return true;
  const current = picks[tool.requires.layer];
  return current != null && tool.requires.ids.includes(current);
}

export function layerNeeded(layer: Layer, a: Answers): boolean {
  return !(layer === "ai" && a.askAi === "no");
}

function score(tool: Tool, a: Answers, ctx: Ctx, picks: Partial<Picks>): number {
  if (!compatible(tool, picks)) return -1000;
  const f = tool.fit;
  let s = 0;
  if (f.ecosystem?.includes(a.ecosystem)) s += 3;
  if (f.volume?.includes(ctx.volume)) s += 2;
  if (f.runner?.includes(a.runner)) s += 2;
  if (f.freshness?.includes(a.freshness)) s += 1;
  if (a.runner === "ai" && tool.traits.mcp) s += 1;
  if (a.runner === "ai" && tool.traits.codeFirst) s += 1;
  if (tool.price.kind === "notPublished") s -= 2;
  return s;
}

export function recommendByRules(a: Answers): Picks {
  const ctx = contextFor(a);
  const picks: Partial<Picks> = {};
  for (const layer of LAYERS) {
    if (!layerNeeded(layer, a)) {
      picks[layer] = null;
      continue;
    }
    const ranked = toolsIn(layer)
      .map((tool, order) => ({ tool, order, s: score(tool, a, ctx, picks), cost: priceTool(tool, ctx).high }))
      .sort((x, y) => y.s - x.s || x.cost - y.cost || x.order - y.order);
    picks[layer] = ranked[0].tool.id;
  }
  return picks as Picks;
}

/**
 * Keeps a proposed pick set honest: unknown ids, wrong layers, and incompatible
 * tools are replaced by the rules pick for that layer, in layer order.
 */
export function sanitizePicks(proposed: Partial<Record<string, unknown>>, a: Answers): { picks: Picks; replaced: Layer[] } {
  const rules = recommendByRules(a);
  const picks: Partial<Picks> = {};
  const replaced: Layer[] = [];
  for (const layer of LAYERS) {
    if (!layerNeeded(layer, a)) {
      picks[layer] = null;
      continue;
    }
    const id = proposed[layer];
    const tool = typeof id === "string" ? byId.get(id) : undefined;
    if (tool && tool.layer === layer && compatible(tool, picks)) {
      picks[layer] = tool.id;
    } else {
      const fallback = byId.get(rules[layer]!)!;
      picks[layer] = compatible(fallback, picks) ? fallback.id : firstCompatible(layer, picks);
      replaced.push(layer);
    }
  }
  return { picks: picks as Picks, replaced };
}

function firstCompatible(layer: Layer, picks: Partial<Picks>): string {
  return (toolsIn(layer).find((t) => compatible(t, picks)) ?? toolsIn(layer)[0]).id;
}

// ---------- pricing a stack ----------

export type Line = { layer: Layer; tool: Tool | null; price: LinePrice; compatible: boolean };
export type Stack = { lines: Line[]; low: number; high: number; unpriced: string[]; estimates: number };

export function priceStack(picks: Picks, a: Answers): Stack {
  const ctx = contextFor(a);
  const lines: Line[] = LAYERS.map((layer) => {
    const id = picks[layer];
    const tool = id ? byId.get(id) ?? null : null;
    const price = tool
      ? priceTool(tool, ctx)
      : { low: 0, high: 0, estimate: false, notPublished: false, basis: "Not needed" };
    return { layer, tool, price, compatible: tool ? compatible(tool, picks) : true };
  });
  const priced = lines.filter((l) => !l.price.notPublished);
  return {
    lines,
    low: priced.reduce((sum, l) => sum + l.price.low, 0),
    high: priced.reduce((sum, l) => sum + l.price.high, 0),
    unpriced: lines.filter((l) => l.price.notPublished && l.tool).map((l) => l.tool!.name),
    estimates: lines.filter((l) => l.price.estimate).length
  };
}

// ---------- the budget line (S17) ----------

const BUDGET_MAX: Record<Opt<"budget">, number | null> = { under100: 100, "100-500": 500, "500-2000": 2000, "2000+": Infinity, unsure: null };

export type BudgetFit = "fits" | "stretch" | "over" | "unsure";

/** Compares the priced total with the top of the chosen budget band. Unpublished lines are outside the total, as on the page. */
export function budgetFit(stack: Stack, a: Answers): BudgetFit {
  const max = BUDGET_MAX[a.budget];
  if (max === null) return "unsure";
  if (Math.round(stack.high) <= max) return "fits";
  if (Math.round(stack.low) <= max) return "stretch";
  return "over";
}

export type Alternative = { tool: Tool; price: LinePrice; deltaHigh: number; compatible: boolean };

export function alternatives(layer: Layer, picks: Picks, a: Answers): Alternative[] {
  const ctx = contextFor(a);
  const current = picks[layer] ? byId.get(picks[layer]!) : undefined;
  const currentHigh = current ? priceTool(current, ctx).high : 0;
  return toolsIn(layer).map((tool) => {
    const price = priceTool(tool, ctx);
    return { tool, price, deltaHigh: price.high - currentHigh, compatible: compatible(tool, { ...picks, [layer]: tool.id }) };
  });
}

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const moneyRange = (lo: number, hi: number) => (Math.round(lo) === Math.round(hi) ? money(hi) : `${money(lo)} to ${money(hi)}`);
