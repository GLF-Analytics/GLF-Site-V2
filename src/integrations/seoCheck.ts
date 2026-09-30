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
          for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
            try {
              JSON.parse(m[1]);
            } catch {
              fail(`${path}: JSON-LD does not parse`);
            }
          }
          // 4. Internal links without the trailing slash.
          for (const m of html.matchAll(/href="(\/[^"?#]+\/)(?:[?#][^"]*)?"/g)) fail(`${path}: internal link ends in a slash: ${m[1]}`);
        }

        if (errors.length) throw new Error(`[seo] ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
        console.log(
          `[seo] ${entries.length} pages: sitemap = llms.txt = page-sources, canonicals, titles, descriptions, lastmod ok`
        );
      }
    }
  };
}
