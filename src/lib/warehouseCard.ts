/*
  The stack card (S23, 9/15/26): one image of the stack with the monthly cost,
  the thing a data lead sends to a CFO. Pure string SVG, 1200 x 630 (the
  social image size), drawn from a priced stack. Used three ways:
  - inline on the results page (the page fonts apply);
  - serialized by the page script into a PNG through a canvas (system fonts,
    so nothing external has to load inside the image);
  - once at build for the example card and the static social image.
  No dependency, no client data, no dash characters (the site guard).
*/
import type { Layer } from "../data/warehouse-catalog";
import { financeRead, moneyRange, type Answers, type Stack } from "./warehouseCalc";

export type CardOpts = { names: Record<Layer, string>; url: string; answers?: Answers; example?: boolean; fontSans?: string; fontMono?: string };

const W = 1200;
const H = 630;
const BG = "#050505";
const GOLD = "#D4A853";
const INK = "#FAFAFA";
const MUTED = "#9a9a9a";
const LINE = "rgba(255,255,255,0.14)";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Wraps a name into at most `lines` lines of about `max` characters, on word boundaries. */
function wrap(text: string, max: number, lines = 3): string[] {
  const out: string[] = [];
  let rest = text.trim();
  while (rest && out.length < lines) {
    if (rest.length <= max || out.length === lines - 1) {
      out.push(rest.length > max ? rest.slice(0, max - 1).trimEnd() + "." : rest);
      break;
    }
    const words = rest.split(" ");
    let line = "";
    for (const w of words) {
      if ((line + " " + w).trim().length > max) break;
      line = (line + " " + w).trim();
    }
    if (!line) line = rest.slice(0, max);
    out.push(line);
    rest = rest.slice(line.length).trim();
  }
  return out;
}

export function stackCardSvg(stack: Stack, o: CardOpts): string {
  const sans = o.fontSans ?? "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const mono = o.fontMono ?? "'Geist Mono', Menlo, Consolas, monospace";
  const line = (layer: Layer) => stack.lines.find((l) => l.layer === layer)!;
  const cost = (layer: Layer) => {
    const l = line(layer);
    if (!l.tool) return "";
    return l.price.notPublished ? "not published" : `${moneyRange(l.price.low, l.price.high)}${l.price.estimate ? " est." : ""}`;
  };
  const tool = (layer: Layer) => line(layer).tool?.name ?? "Not needed";

  // Row one: the flow. Sources, then five layers left to right.
  const flow: { label: string; name: string; cost: string; dim?: boolean }[] = [
    { label: "Sources", name: "Your systems", cost: "" },
    { label: o.names.ingestion, name: tool("ingestion"), cost: cost("ingestion") },
    { label: o.names.warehouse, name: tool("warehouse"), cost: cost("warehouse") },
    { label: o.names.modeling, name: tool("modeling"), cost: cost("modeling") },
    { label: o.names.bi, name: tool("bi"), cost: cost("bi") },
    { label: "LLM questions", name: tool("ai"), cost: cost("ai"), dim: !line("ai").tool }
  ];
  // Row two: the layers that sit under the flow.
  const under: { label: string; name: string; cost: string }[] = [
    { label: o.names.observability, name: tool("observability"), cost: cost("observability") },
    { label: o.names.orchestration, name: tool("orchestration"), cost: cost("orchestration") },
    { label: "AI build seat", name: tool("build"), cost: cost("build") }
  ];

  const pad = 56;
  const boxW = 168;
  const gap = (W - pad * 2 - boxW * flow.length) / (flow.length - 1);
  const rowY = 168;
  const boxH = 150;
  const parts: string[] = [];

  parts.push(`<rect width="${W}" height="${H}" fill="${BG}"/>`);
  parts.push(`<text x="${pad}" y="${64}" font-family="${mono}" font-size="14" letter-spacing="3" fill="${GOLD}">${o.example ? "EXAMPLE STACK" : "DATA WAREHOUSE STACK"}</text>`);
  parts.push(`<text x="${pad}" y="${112}" font-family="${sans}" font-size="38" font-weight="500" fill="${INK}">${esc(moneyRange(stack.low, stack.high))} a month at list price</text>`);
  parts.push(`<text x="${W - pad}" y="${64}" text-anchor="end" font-family="${mono}" font-size="14" letter-spacing="3" fill="${MUTED}">GLF ANALYTICS</text>`);

  flow.forEach((b, i) => {
    const x = pad + i * (boxW + gap);
    const ink = b.dim ? MUTED : INK;
    parts.push(`<rect x="${x}" y="${rowY}" width="${boxW}" height="${boxH}" fill="none" stroke="${b.dim ? LINE : GOLD}" stroke-width="1"/>`);
    parts.push(`<text x="${x + 16}" y="${rowY + 30}" font-family="${mono}" font-size="11" letter-spacing="2" fill="${GOLD}">${esc(b.label.toUpperCase())}</text>`);
    wrap(b.name, 16).forEach((l, n) => {
      parts.push(`<text x="${x + 16}" y="${rowY + 62 + n * 23}" font-family="${sans}" font-size="18" font-weight="500" fill="${ink}">${esc(l)}</text>`);
    });
    if (b.cost) parts.push(`<text x="${x + 16}" y="${rowY + boxH - 20}" font-family="${mono}" font-size="14" fill="${MUTED}">${esc(b.cost)}</text>`);
    if (i < flow.length - 1) {
      const ax = x + boxW;
      const ay = rowY + boxH / 2;
      parts.push(`<line x1="${ax + 6}" y1="${ay}" x2="${ax + gap - 6}" y2="${ay}" stroke="${LINE}" stroke-width="1"/>`);
      parts.push(`<polyline points="${ax + gap - 12},${ay - 5} ${ax + gap - 6},${ay} ${ax + gap - 12},${ay + 5}" fill="none" stroke="${LINE}" stroke-width="1"/>`);
    }
  });

  const uy = rowY + boxH + 44;
  const uw = (W - pad * 2 - 24 * 2) / 3;
  parts.push(`<line x1="${pad}" y1="${uy - 20}" x2="${W - pad}" y2="${uy - 20}" stroke="${LINE}" stroke-width="1"/>`);
  under.forEach((b, i) => {
    const x = pad + i * (uw + 24);
    parts.push(`<text x="${x}" y="${uy + 8}" font-family="${mono}" font-size="11" letter-spacing="2" fill="${GOLD}">${esc(b.label.toUpperCase())}</text>`);
    const [l1] = wrap(b.name, 30, 1);
    parts.push(`<text x="${x}" y="${uy + 38}" font-family="${sans}" font-size="19" font-weight="500" fill="${INK}">${esc(l1)}</text>`);
    if (b.cost) parts.push(`<text x="${x}" y="${uy + 62}" font-family="${mono}" font-size="14" fill="${MUTED}">${esc(b.cost)}</text>`);
  });

  if (o.answers) {
    const fin = financeRead(stack, o.answers);
    const fy = uy + 118;
    const cells = [
      ["GROWS WITH PEOPLE", `${moneyRange(fin.seats[0], fin.seats[1])} a month`],
      ["GROWS WITH DATA", `${moneyRange(fin.usage[0], fin.usage[1])} a month`],
      ["OPEN SOURCE LAYERS", `${fin.openSource} of ${fin.layers}`],
      ["UPKEEP (OUR ESTIMATE)", `${fin.upkeep[0]} to ${fin.upkeep[1]} hours a week`]
    ];
    const cw = (W - pad * 2) / cells.length;
    parts.push(`<line x1="${pad}" y1="${fy - 22}" x2="${W - pad}" y2="${fy - 22}" stroke="${LINE}" stroke-width="1"/>`);
    cells.forEach(([label, value], i) => {
      const x = pad + i * cw;
      parts.push(`<text x="${x}" y="${fy + 6}" font-family="${mono}" font-size="11" letter-spacing="2" fill="${MUTED}">${esc(label)}</text>`);
      parts.push(`<text x="${x}" y="${fy + 34}" font-family="${sans}" font-size="18" font-weight="500" fill="${INK}">${esc(value)}</text>`);
    });
  }
  parts.push(`<line x1="${pad}" y1="${H - 88}" x2="${W - pad}" y2="${H - 88}" stroke="${LINE}" stroke-width="1"/>`);
  parts.push(`<text x="${pad}" y="${H - 52}" font-family="${sans}" font-size="15" fill="${MUTED}">Public list prices with sources and dates. Not a quote. Swap any layer and the total changes.</text>`);
  parts.push(`<text x="${W - pad}" y="${H - 52}" text-anchor="end" font-family="${mono}" font-size="13" fill="${GOLD}">${esc(o.url.replace(/^https?:\/\//, ""))}</text>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Stack card: ${esc(moneyRange(stack.low, stack.high))} a month at list price">${parts.join("")}</svg>`;
}
