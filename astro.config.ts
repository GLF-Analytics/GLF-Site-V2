import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import { siteUrl } from "./src/config/site.ts";

// Unlisted pages: built and reachable by URL, kept out of the sitemap (and
// noindex on the page) until Gabriel links them.
const UNLISTED = ["/design-your-data-warehouse"];

export default defineConfig({
  site: siteUrl,
  // Hybrid (S15, 9/14/26): every page is still prerendered at build time; only
  // routes that export `prerender = false` (src/pages/api/warehouse-suggest.ts)
  // run as a Vercel function.
  output: "hybrid",
  adapter: vercel({ maxDuration: 60 }),
  integrations: [tailwind(), sitemap({ filter: (page) => !UNLISTED.some((path) => page.includes(path)) })]
});
