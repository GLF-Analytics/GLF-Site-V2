/*
  S37 (10/1/26): the share images, one 1200x630 card per case study plus the
  site default, in the same look as og-using-data.png (mono eyebrow, Geist
  headline, mono line, the domain in gold on the flat ground).

    npm run og            every card
    npm run og -- ucan    one card (a case-study slug, or "default")

  Every word on a card is read from the page it belongs to, never typed here:
  a case study gives its clientType, title and summary (src/content/work/*.md);
  the default card gives the homepage title and description (src/config/site.ts).
  Output: public/images/og/<slug>.png and public/images/og/default.png. A text
  change on a page means running this again and committing the PNG.

  How it draws: it writes one HTML file per card to the Windows temp folder and
  screenshots it with Edge headless, the same method as the video frames. So it
  runs on Gabriel's machine from WSL (Edge at the path below, wslpath on PATH);
  it is not part of the site build and Vercel never runs it.
*/
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const EDGE = "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const WORK = "src/content/work";
const OUT = "public/images/og";
const FONT = "https://cdn.jsdelivr.net/npm/geist@1.2.0/dist/fonts";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const field = (text, key) => {
  const m = text.match(new RegExp(`^${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*$`, "m"));
  if (!m) throw new Error(`[og] no ${key} found`);
  return m[1].replace(/\\"/g, '"');
};
const constant = (text, name) => {
  const m = text.match(new RegExp(`export const ${name} =\\s*\\n?\\s*"([^"]+)"`));
  if (!m) throw new Error(`[og] no ${name} in src/config/site.ts`);
  return m[1];
};

function cards() {
  const site = readFileSync("src/config/site.ts", "utf8");
  const [siteName, headline] = constant(site, "defaultTitle").split(" | ");
  const list = [{ slug: "default", eyebrow: siteName, title: `${headline}.`, line: constant(site, "defaultDescription"), wide: true }];
  for (const f of readdirSync(WORK).filter((f) => f.endsWith(".md")).sort()) {
    const md = readFileSync(join(WORK, f), "utf8");
    list.push({ slug: f.replace(/\.md$/, ""), eyebrow: field(md, "clientType"), title: field(md, "title"), line: field(md, "summary") });
  }
  return list;
}

const html = (c) => `<!doctype html>
<html><head><meta charset="utf-8">
<style>
@font-face { font-family: "Geist"; font-weight: 500; src: url("${FONT}/geist-sans/Geist-Medium.woff2") format("woff2"); }
@font-face { font-family: "Geist Mono"; font-weight: 400; src: url("${FONT}/geist-mono/GeistMono-Regular.woff2") format("woff2"); }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; background: #050505; }
body { position: relative; padding: 96px 80px 0; font-family: "Geist Mono", ui-monospace, monospace; }
.eyebrow { font-size: 15px; letter-spacing: 0.22em; text-transform: uppercase; color: #8a8a8a; }
h1 { margin-top: 44px; max-width: ${c.wide ? 900 : 1000}px; font-family: "Geist", system-ui, sans-serif; font-weight: 500; font-size: ${c.title.length > 30 ? 62 : 76}px; line-height: 1.08; letter-spacing: -0.025em; color: #fafafa; text-wrap: balance; }
p { margin-top: 44px; max-width: ${c.wide ? 900 : 760}px; font-size: 21px; line-height: 1.55; color: #8a8a8a; text-wrap: balance; }
.domain { position: absolute; left: 80px; bottom: 56px; font-size: 18px; letter-spacing: 0.04em; color: #D4A853; }
</style></head>
<body>
<div class="eyebrow">${esc(c.eyebrow)}</div>
<h1>${esc(c.title)}</h1>
<p>${esc(c.line)}</p>
<div class="domain">glfanalytics.com</div>
</body></html>
`;

const only = process.argv.slice(2);
const todo = cards().filter((c) => !only.length || only.includes(c.slug));
if (!todo.length) throw new Error(`[og] nothing matches ${only.join(", ")}`);

const winTemp = execFileSync("cmd.exe", ["/c", "echo %TEMP%"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const tmpWin = `${winTemp}\\glf-og`;
const tmp = execFileSync("wslpath", ["-u", tmpWin], { encoding: "utf8" }).trim();
mkdirSync(tmp, { recursive: true });
mkdirSync(OUT, { recursive: true });

for (const c of todo) {
  writeFileSync(join(tmp, `${c.slug}.html`), html(c));
  execFileSync(
    EDGE,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      "--virtual-time-budget=10000",
      `--screenshot=${tmpWin}\\${c.slug}.png`,
      `file:///${tmpWin.replace(/\\/g, "/")}/${c.slug}.html`
    ],
    { stdio: "ignore" }
  );
  copyFileSync(join(tmp, `${c.slug}.png`), join(OUT, `${c.slug}.png`));
  console.log(`[og] ${OUT}/${c.slug}.png  "${c.title}"`);
}
rmSync(tmp, { recursive: true, force: true });
