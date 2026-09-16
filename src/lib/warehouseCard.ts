/*
  The stack card (S23, 9/15/26; simplified S25, 9/15/26): one image of the
  stack with the monthly cost, the thing a data lead sends to a CFO. Pure
  string SVG, 1200 x 630 (the social image size), drawn from a priced stack.
  Used two ways since S25:
  - serialized by the page script into a PNG through a canvas (system fonts,
    so nothing external has to load inside the image);
  - once, by hand, for the static social image (public/images/og-warehouse.png).
  S25 cut the flow row with arrows, the under-row and the finance strip: the
  card is now the total and a 4 x 2 grid of the eight layers, in type twice
  the size, so it reads at a phone width. No dependency, no client data, no
  dash characters (the site guard).
*/
import { LAYERS, type Layer } from "../data/warehouse-catalog";
import { moneyRange, type Stack } from "./warehouseCalc";

export type CardOpts = { names: Record<Layer, string>; url: string; example?: boolean; fontSans?: string; fontMono?: string };

const W = 1200;
const H = 630;
const BG = "#050505";
const GOLD = "#D4A853";
const INK = "#FAFAFA";
const MUTED = "#9a9a9a";
const LINE = "rgba(255,255,255,0.14)";

/** Short labels for the two long layer names, so every label fits one tile line. */
const SHORT: Partial<Record<Layer, string>> = { ai: "LLM questions", build: "AI build seat" };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Wraps a name into at most `lines` lines of about `max` characters, on word boundaries. */
function wrap(text: string, max: number, lines = 2): string[] {
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
  const cost = (l: Stack["lines"][number]) => {
    if (!l.tool) return "";
    return l.price.notPublished ? "price not published" : `${moneyRange(l.price.low, l.price.high)}${l.price.estimate ? " est." : ""}`;
  };

  const pad = 56;
  const cols = 4;
  const gap = 20;
  const tileW = (W - pad * 2 - gap * (cols - 1)) / cols;
  const tileH = 150;
  const gridY = 226;
  const parts: string[] = [];

  parts.push(`<rect width="${W}" height="${H}" fill="${BG}"/>`);
  parts.push(`<text x="${pad}" y="${66}" font-family="${mono}" font-size="16" letter-spacing="3" fill="${GOLD}">${o.example ? "EXAMPLE STACK" : "DATA WAREHOUSE STACK"}</text>`);
  parts.push(`<text x="${W - pad}" y="${66}" text-anchor="end" font-family="${mono}" font-size="16" letter-spacing="3" fill="${MUTED}">GLF ANALYTICS</text>`);
  parts.push(`<text x="${pad}" y="${146}" font-family="${sans}" font-size="64" font-weight="500" letter-spacing="-1.5" fill="${INK}">${esc(moneyRange(stack.low, stack.high))}</text>`);
  parts.push(`<text x="${pad}" y="${186}" font-family="${sans}" font-size="22" fill="${MUTED}">a month at list price</text>`);

  LAYERS.forEach((layer, i) => {
    const line = stack.lines.find((l) => l.layer === layer);
    if (!line) return;
    const x = pad + (i % cols) * (tileW + gap);
    const y = gridY + Math.floor(i / cols) * (tileH + gap);
    const off = !line.tool;
    parts.push(`<rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" fill="none" stroke="${off ? LINE : GOLD}" stroke-width="1"/>`);
    parts.push(`<text x="${x + 20}" y="${y + 34}" font-family="${mono}" font-size="13" letter-spacing="2" fill="${off ? MUTED : GOLD}">${esc((SHORT[layer] ?? o.names[layer]).toUpperCase())}</text>`);
    wrap(line.tool?.name ?? "Not needed", 18).forEach((t, n) => {
      parts.push(`<text x="${x + 20}" y="${y + 74 + n * 30}" font-family="${sans}" font-size="24" font-weight="500" fill="${off ? MUTED : INK}">${esc(t)}</text>`);
    });
    const c = cost(line);
    if (c) parts.push(`<text x="${x + 20}" y="${y + tileH - 22}" font-family="${mono}" font-size="17" fill="${MUTED}">${esc(c)}</text>`);
  });

  parts.push(`<line x1="${pad}" y1="${H - 62}" x2="${W - pad}" y2="${H - 62}" stroke="${LINE}" stroke-width="1"/>`);
  parts.push(`<text x="${pad}" y="${H - 28}" font-family="${sans}" font-size="16" fill="${MUTED}">Public list prices with sources and dates. Not a quote.</text>`);
  parts.push(`<text x="${W - pad}" y="${H - 28}" text-anchor="end" font-family="${mono}" font-size="15" fill="${GOLD}">${esc(o.url.replace(/^https?:\/\//, ""))}</text>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Stack card: ${esc(moneyRange(stack.low, stack.high))} a month at list price">${parts.join("")}</svg>`;
}
