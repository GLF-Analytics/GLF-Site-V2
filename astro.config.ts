import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { siteUrl } from "./src/config/site.ts";

export default defineConfig({
  site: siteUrl,
  output: "static",
  integrations: [tailwind(), sitemap()]
});
