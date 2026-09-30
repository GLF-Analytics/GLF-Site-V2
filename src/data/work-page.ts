/*
  S36 (9/30/26): the /work title and description in one place, so the page
  and llms.txt (src/pages/llms.txt.ts) print the same words. The title matches
  the page's h1. The count is computed from the collection, never typed.
*/
export const workMeta = (count: number) => ({
  title: "All work since 2017",
  description: `Every GLF Analytics case study since 2017 in one list: ${count} engagements and products across restaurants, CPG, eCommerce, startups, and construction.`
});
