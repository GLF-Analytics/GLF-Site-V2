import { defineCollection, z } from "astro:content";

const work = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    clientType: z.string(),
    summary: z.string(),
    challenge: z.string(),
    solution: z.string(),
    outcomes: z.union([z.string(), z.array(z.string())]),
    tags: z.array(z.string()),
    featured: z.boolean(),
    order: z.number(),
    duration: z.string(),
    url: z.string().optional(),
    logo: z.string().optional(),
    testimonial: z.string().optional(),
    testimonialAuthor: z.string().optional(),
    backgroundImage: z.string().optional(),
    backgroundImageTablet: z.string().optional(),
    backgroundImageMobile: z.string().optional(),
    companyDescription: z.string().optional(),
    outcome: z.string().optional(),
    tools: z.array(z.string()).optional(),
    functions: z.array(z.string()).optional(),
    showLiveStats: z.boolean().optional(),
    // S36 (9/30/26): the search-result title and description. The page's h1 and
    // summary stay as they are; these fall back to `title` and `summary`.
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    // S37 (10/1/26): the "Related work" row at the bottom of the page. Slugs of
    // other case studies, or a page path from RELATED_PAGES in [slug].astro.
    related: z.array(z.string()).optional()
  })
});

export const collections = { work };
