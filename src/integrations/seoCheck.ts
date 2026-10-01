/*
  S36 (9/30/26): the post-build SEO check. Runs after the sitemap is written
  (it is listed after sitemap() in astro.config.ts) and reads the built files,
  so it checks what ships, not what the source meant. Any failure throws and
  the build fails. It prints one line when everything holds:
    [seo] N pages: sitemap = llms.txt = page-sources, canonicals, titles, descriptions, lastmod ok

  The invariants:
  1. The sitemap, llms.txt and src/data/page-sources.ts list the same routes.
  2. Every sitemap URL has a <lastmod>, a built page, no noindex, one <h1>,
     a canonical equal to its own sitemap URL, and JSON-LD that parses.
  3. Titles: 60 characters or fewer and no comma (his S5 law). Descriptions:
     50 to 160 characters.
  4. No internal link ends in a slash (the site is trailingSlash "never";
     /x/ answers with a 308 to /x).

  S37 (10/1/26), the second pass:
  5. No two pages share a title or a description.
  6. Every page's share image is a file in the build, a PNG of 1200 by 630.
  7. Every internal link lands on a built page or file.
  8. Every image a page names exists, and its bytes match its extension (two
     case-study backgrounds shipped as .jpg while being AVIF and WebP).
  9. Every Article and BlogPosting carries datePublished and dateModified.
  10. The homepage shows each ProfessionalService serviceType as a card title.
*/
import type { AstroIntegration } from "astro";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { allPageSources } from "../lib/pageDates";

const TITLE_MAX = 60;
const DESC_MIN = 50;
const DESC_MAX = 160;

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const attr = (html: string, re: RegExp) => {
  const m = html.match(re);
  return m ? decode(m[1]) : undefined;
};

/** Does the file's first bytes match what its extension says? svg and ico are not checked. */
const typeMatches = (file: string): boolean => {
  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  const b = readFileSync(file).subarray(0, 12);
  const text = (from: number, to: number) => b.subarray(from, to).toString("latin1");
  if (ext === "png") return b[0] === 0x89 && text(1, 4) === "PNG";
  if (ext === "jpg" || ext === "jpeg") return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  if (ext === "webp") return text(0, 4) === "RIFF" && text(8, 12) === "WEBP";
  if (ext === "avif") return text(4, 8) === "ftyp" && /^avi[fs]$/.test(text(8, 12));
  return true;
};

const pngSize = (file: string) => {
  const b = readFileSync(file).subarray(0, 24);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};

/** Every JSON-LD node on a page, with @graph and arrays flattened. */
const ldNodes = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) return value.flatMap(ldNodes);
  if (!value || typeof value !== "object") return [];
  const node = value as Record<string, unknown>;
  return [node, ...ldNodes(node["@graph"])];
};

export default function seoCheck(site: string): AstroIntegration {
  return {
    name: "glf-seo-check",
    hooks: {
      "astro:build:done": ({ dir }) => {
        const out = fileURLToPath(dir);
        const errors: string[] = [];
        const fail = (msg: string) => errors.push(msg);

        // 1. The three route lists.
        const sitemapFiles = readdirSync(out).filter((f) => /^sitemap-\d+\.xml$/.test(f));
        const entries: { loc: string; lastmod?: string }[] = [];
        for (const f of sitemapFiles) {
          const xml = readFileSync(join(out, f), "utf8");
          for (const u of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
            entries.push({ loc: attr(u, /<loc>([^<]+)<\/loc>/) ?? "", lastmod: attr(u, /<lastmod>([^<]+)<\/lastmod>/) });
          }
        }
        const toPath = (url: string) => url.replace(site, "") || "/";
        const sitemapPaths = new Set(entries.map((e) => toPath(e.loc)));
        const registryPaths = new Set(allPageSources().map((p) => p.path));
        const llmsFile = join(out, "llms.txt");
        const llms = existsSync(llmsFile) ? readFileSync(llmsFile, "utf8") : "";
        if (!llms) fail("llms.txt was not built");
        const llmsPaths = new Set([...llms.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)].map((m) => toPath(m[1])));
        const diff = (a: Set<string>, b: Set<string>) => [...a].filter((x) => !b.has(x));
        for (const [name, a, bName, b] of [
          ["sitemap", sitemapPaths, "page-sources", registryPaths],
          ["page-sources", registryPaths, "sitemap", sitemapPaths],
          ["sitemap", sitemapPaths, "llms.txt", llmsPaths],
          ["llms.txt", llmsPaths, "sitemap", sitemapPaths]
        ] as const) {
          for (const p of diff(a, b)) fail(`${p} is in ${name} but not in ${bName}`);
        }

        // A root-relative path is in the build when it is a page folder or a file.
        const built = (p: string) => {
          const clean = decodeURI(p).replace(/^\//, "");
          return clean === "" || existsSync(join(out, clean, "index.html")) || (existsSync(join(out, clean)) && !clean.endsWith("/"));
        };
        const titles = new Map<string, string>();
        const descriptions = new Map<string, string>();

        // 2 and 3. Every page in the sitemap.
        for (const { loc, lastmod } of entries) {
          const path = toPath(loc);
          if (!lastmod) fail(`${path}: no <lastmod> in the sitemap`);
          const file = join(out, path === "/" ? "index.html" : `${path.slice(1)}/index.html`);
          if (!existsSync(file)) {
            fail(`${path}: no built page at ${file}`);
            continue;
          }
          const html = readFileSync(file, "utf8");
          const title = attr(html, /<title>([^<]*)<\/title>/) ?? "";
          const desc = attr(html, /<meta name="description" content="([^"]*)"/) ?? "";
          const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
          // The root is the one URL where the slash is the same address (the sitemap
          // prints https://glfanalytics.com, the canonical https://glfanalytics.com/).
          const same = path === "/" ? canonical?.replace(/\/$/, "") === loc.replace(/\/$/, "") : canonical === loc;
          if (!same) fail(`${path}: canonical ${canonical} is not the sitemap URL ${loc}`);
          if (/<meta name="robots" content="[^"]*noindex/.test(html)) fail(`${path}: noindex but in the sitemap`);
          const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
          if (h1s !== 1) fail(`${path}: ${h1s} <h1> elements`);
          if (title.length > TITLE_MAX) fail(`${path}: title is ${title.length} characters (max ${TITLE_MAX}): "${title}"`);
          if (title.includes(",")) fail(`${path}: comma in the title: "${title}"`);
          if (desc.length < DESC_MIN || desc.length > DESC_MAX) fail(`${path}: description is ${desc.length} characters (${DESC_MIN} to ${DESC_MAX})`);
          const nodes: Record<string, unknown>[] = [];
          for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
            try {
              nodes.push(...ldNodes(JSON.parse(m[1])));
            } catch {
              fail(`${path}: JSON-LD does not parse`);
            }
          }
          // 4. Internal links without the trailing slash.
          for (const m of html.matchAll(/href="(\/[^"?#]+\/)(?:[?#][^"]*)?"/g)) fail(`${path}: internal link ends in a slash: ${m[1]}`);

          // 5. One title and one description per page.
          for (const [kind, seen, value] of [["title", titles, title], ["description", descriptions, desc]] as const) {
            const other = seen.get(value);
            if (other) fail(`${path}: same ${kind} as ${other}`);
            else seen.set(value, path);
          }

          // 6. The share image.
          const og = attr(html, /<meta property="og:image" content="([^"]*)"/) ?? "";
          const ogFile = join(out, og.replace(site, "").replace(/^\//, ""));
          if (!og.startsWith(`${site}/`) || !existsSync(ogFile)) fail(`${path}: og:image ${og} is not a file in the build`);
          else if (!og.endsWith(".png") || !typeMatches(ogFile)) fail(`${path}: og:image ${og} is not a PNG`);
          else {
            const { width, height } = pngSize(ogFile);
            if (width !== 1200 || height !== 630) fail(`${path}: og:image ${og} is ${width}x${height}, not 1200x630`);
          }

          // 7. Internal links land on something built (API routes are functions, not files).
          for (const m of html.matchAll(/href="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
            if (m[1].startsWith("/api/") || m[1].startsWith("/_")) continue;
            if (!built(m[1])) fail(`${path}: link to ${m[1]}, which is not in the build`);
          }

          // 8. Images the page names: present, and the bytes match the extension.
          const images = new Set([...html.matchAll(/(?:["'(=]|&#39;|&quot;)(?:https:\/\/glfanalytics\.com)?(\/images\/[^"'()\s&?#]+\.(?:png|jpe?g|webp|avif|svg))/g)].map((m) => m[1]));
          for (const img of images) {
            const file = join(out, decodeURI(img).replace(/^\//, ""));
            if (!existsSync(file)) fail(`${path}: image ${img} is not in the build`);
            else if (!typeMatches(file)) fail(`${path}: image ${img} is not the type its extension says`);
          }

          // 9. Dated articles.
          for (const n of nodes) {
            if (n["@type"] !== "Article" && n["@type"] !== "BlogPosting") continue;
            for (const key of ["datePublished", "dateModified"]) {
              if (!/^\d{4}-\d{2}-\d{2}/.test(String(n[key] ?? ""))) fail(`${path}: ${n["@type"]} has no ${key}`);
            }
          }

          // 10. The service names in the schema are the card titles on the homepage.
          if (path === "/") {
            const cards = new Set([...html.matchAll(/<h3[^>]*>\s*([^<]+?)\s*<\/h3>/g)].map((m) => decode(m[1])));
            const service = nodes.find((n) => n["@type"] === "ProfessionalService");
            for (const s of (service?.serviceType as string[] | undefined) ?? []) {
              if (!cards.has(s)) fail(`/: serviceType "${s}" is not a card title on the homepage`);
            }
          }
        }

        if (errors.length) throw new Error(`[seo] ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
        console.log(
          `[seo] ${entries.length} pages: sitemap = llms.txt = page-sources, canonicals, titles, descriptions, lastmod, share images, links, images, dates ok`
        );
      }
    }
  };
}
