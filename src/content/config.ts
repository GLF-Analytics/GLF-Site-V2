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
    backgroundImage: z.string().optional()
  })
});

export const collections = { work };
