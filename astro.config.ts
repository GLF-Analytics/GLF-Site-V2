import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import { siteUrl } from "./src/config/site.ts";
import { pageDates } from "./src/lib/pageDates.ts";
import seoCheck from "./src/integrations/seoCheck.ts";

// Unlisted pages: built and reachable by URL, kept out of the sitemap (and
// noindex on the page) until Gabriel links them. S23 (9/15/26): the warehouse
// planner is indexable now; the list stays for the next unlisted page.
const UNLISTED: string[] = [];

// S36 (9/30/26): the sitemap's <lastmod> per route (src/lib/pageDates.ts).
const dates = pageDates();

export default defineConfig({
  site: siteUrl,
  // S36 (9/30/26): one address per page, no trailing slash. The internal links
  // were already /x; the canonicals and the sitemap now match them, and the
  // Vercel adapter answers /x/ with a 308 to /x (its redirects for "never").
  trailingSlash: "never",
  // Hybrid (S15, 9/14/26): every page is still prerendered at build time; only
  // routes that export `prerender = false` (src/pages/api/warehouse-suggest.ts)
  // run as a Vercel function.
  output: "hybrid",
  adapter: vercel({ maxDuration: 60 }),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !UNLISTED.some((path) => page.includes(path)),
      serialize: (item) => ({ ...item, lastmod: dates[item.url.replace(siteUrl, "") || "/"] })
    }),
    // After sitemap(): it reads the sitemap the step above wrote.
    seoCheck(siteUrl)
  ]
});
