/*
  S36 (9/30/26): the one list of indexable routes and the files each one is
  written from. It drives three things:
  - the sitemap's <lastmod> = the newest git date among a route's files
    (src/lib/pageDates.ts, snapshot in src/data/lastmod.json);
  - llms.txt (src/pages/llms.txt.ts), grouped by `section`;
  - the post-build SEO check (src/integrations/seoCheck.ts), which fails the
    build when the sitemap, llms.txt and this list disagree.
  A new page = one row here. Case studies are added automatically, one per
  markdown file in src/content/work/. Sources are files or folders; a missing
  one fails the build. Site-wide chrome (BaseLayout, Nav, Footer, global.css)
  is left out on purpose: a footer edit is not a new version of every page.
*/

export type LlmsSection = "Main pages" | "Free tool" | "Writing";

export const WORK_DIR = "src/content/work";
export const WORK_TEMPLATE = "src/pages/[slug].astro";

export const staticPages: { path: string; section: LlmsSection; sources: string[] }[] = [
  {
    path: "/",
    section: "Main pages",
    sources: [
      "src/pages/index.astro",
      "src/components/Hero.astro",
      "src/components/Capabilities.astro",
      "src/components/LiveStats.astro",
      "src/components/StatGrid.astro",
      "src/components/TypingDemo.astro",
      "src/components/CountryMap.astro",
      "src/components/SelectedWork.astro",
      "src/components/About.astro",
      "src/config/site.ts",
      "src/data/bc-stats.json",
      "src/data/bc-countries.json",
      WORK_DIR
    ]
  },
  {
    path: "/work",
    section: "Main pages",
    sources: ["src/pages/work.astro", WORK_DIR]
  },
  {
    path: "/everything",
    section: "Main pages",
    sources: ["src/pages/everything.astro", "src/data/everything.ts"]
  },
  {
    path: "/contact",
    section: "Main pages",
    sources: ["src/pages/contact.astro", "src/components/ContactForm.astro", "src/data/contact.ts"]
  },
  {
    path: "/design-your-data-warehouse",
    section: "Free tool",
    sources: ["src/pages/design-your-data-warehouse.astro", "src/data/warehouse-survey.ts", "src/data/warehouse-catalog.ts"]
  },
  {
    path: "/using-data-to-build-with-ai",
    section: "Writing",
    sources: [
      "src/pages/using-data-to-build-with-ai.astro",
      "src/data/how-data.ts",
      "src/data/bc-stats.json",
      "src/data/bc-monthly.json",
      "src/data/bc-countries.json"
    ]
  }
];
