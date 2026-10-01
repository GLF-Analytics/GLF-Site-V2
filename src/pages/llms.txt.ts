/*
  S36 (9/30/26): /llms.txt, the plain-text map of the site for AI answer
  engines (the llmstxt.org shape: a title, a one-paragraph summary, then
  sections of links with one line each). Every line comes from the meta the
  pages themselves print, so the words cannot drift from the titles and
  descriptions in search. The routes come from src/data/page-sources.ts plus
  the case-study collection; src/integrations/seoCheck.ts fails the build if
  this file and the sitemap list different pages.
*/
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { defaultDescription, defaultTitle, orgInfo, siteName, siteUrl } from "../config/site";
import { staticPages, type LlmsSection } from "../data/page-sources";
import { meta as contactMeta } from "../data/contact";
import { intro as everythingIntro } from "../data/everything";
import { meta as dataMeta } from "../data/how-data";
import { meta as warehouseMeta } from "../data/warehouse-survey";
import { workMeta } from "../data/work-page";

export const prerender = true;

export const GET: APIRoute = async () => {
  const work = (await getCollection("work")).sort((a, b) => a.data.order - b.data.order);

  const pageMeta: Record<string, { title: string; description: string }> = {
    // S37 (10/1/26): the homepage's own title (was the word "Homepage").
    "/": { title: defaultTitle.split(" | ")[1], description: "The four service areas, every case study, and live numbers from birthday-cards.ai" },
    "/work": workMeta(work.length),
    "/everything": { title: everythingIntro.title, description: everythingIntro.description },
    "/contact": contactMeta,
    "/design-your-data-warehouse": warehouseMeta,
    "/using-data-to-build-with-ai": dataMeta
  };

  const line = (path: string, title: string, description: string) =>
    `- [${title}](${siteUrl}${path === "/" ? "/" : path}): ${description.replace(/\.$/, "")}`;

  const sections: LlmsSection[] = ["Main pages", "Free tool", "Writing"];
  const body = sections.map((section) => {
    const rows = staticPages
      .filter((p) => p.section === section)
      .map((p) => {
        const m = pageMeta[p.path];
        if (!m) throw new Error(`[llms] no meta for ${p.path}: add it to src/pages/llms.txt.ts`);
        return line(p.path, m.title, m.description);
      });
    return `## ${section}\n\n${rows.join("\n")}`;
  });

  const caseStudies = work.map((w) =>
    line(`/${w.slug}`, w.data.seoTitle ?? w.data.title, w.data.metaDescription ?? w.data.summary)
  );

  const text = [
    `# ${siteName}`,
    `> ${defaultDescription}`,
    `${orgInfo.description} He works with brands, restaurant groups, startups, construction management firms and marketing agencies. Email: ${orgInfo.email}.`,
    ...body,
    `## Case studies\n\n${caseStudies.join("\n")}`
  ].join("\n\n");

  return new Response(text + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
