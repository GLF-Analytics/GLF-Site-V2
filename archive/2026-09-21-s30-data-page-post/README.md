# S30 (9/21/26): the second half of /using-data-to-build-with-ai becomes a blog post in his words

**Why:** his 9/21 ask. Leave the top alone; below it, a standard blog post in the tone of his Substack
article, the tools told and shown, charts that are just charts, "so far" out (MTD), no complicated sections.

**Kept, untouched:** the hero and lede, the four numbers, the country map, the refreshed line, the source
chips, the two FAQ items, the closing row. **The one change above the post:** the monthly cards chart
labels the current month "Sep MTD" (was "Sep so far"; `<desc>` says "month to date").

**Removed:** the four S28 beats and their eyebrows; `SystemsLoop.astro` and `MethodDots.astro` (moved to
`archive/components/`); the two "Decided" cells; the "under twenty" worked example and the share-tag dated
fact; the 2x2 takeaway grid and its heading; the three numbered work markers on the search chart (their
content is now one paragraph); the CSS block "DATA PAGE SECOND HALF" (`before/global.css.data-page-second-half.css`).

**New:** `post` / `tools` / `captions` / `methodMix` in `how-data.ts`; `ToolStrip.astro` (five rows of
chips); `MethodMix.astro` (scorecards: 57% headline over 43 / 37 / 11 / 9, shares computed from 111 cards,
throws under a base of one hundred); `SearchGrowth.astro` redrawn as bars on the MonthlyCards geometry and
classes; every `tools` name bold wherever a post paragraph mentions it (11 mentions), a throw if a listed
tool is never mentioned. Post 494 words (band 450 to 650, throw above 700).

## Edits to his dictation (`his-dictation-2026-09-21.md` is the verbatim)

1. Spelling and sentence breaks throughout; dashes and "+" became periods or "and"; "its" to "It's".
2. "made by ai" to "made with AI".
3. "show case" to "show" ("showcase" is on the kill list; the S29 precedent).
4. "leader generator" to "lead generator".
5. "where i have claude code analytics site analytics, GSC, and bing webmaster, porvide analysis" to
   "Claude Code reads Vercel Web Analytics, Google Search Console and Bing Webmaster and provides the analysis."
6. "as we develop moving forward" to "as we develop" ("moving forward" is on the kill list).
7. "all these things that the project compounds knowledge" to "all of these things mean the project compounds knowledge."
8. "test project / passion project / playground / utility" to a comma list with "my".
9. "So I built birthday-cards.ai." added as the bridge sentence.

## Not from his dictation (from the page's earlier copy; his to keep or cut)

"I write SQL. I'm not a full stack developer. So there was a learning curve." / "Vercel hosts the site.
OpenAI draws the cards. Airtable holds the emails." / "A briefing, a state file that gets rewritten every
session, a session log, a style guide. Claude reads them before it writes any code." / the "Three pieces of
work moved those bars" paragraph (the S28 marker content) / "I can also see how people make their cards."
/ the three captions.

## Two flags he heard in the plan (his words stand)

"It's all free now" against the 9/19 never-brand-as-free rule: a dated statement that names paid upgrades
next, off the product and off the top of the page. "to show what I can do" sits near the no-announced-
credibility ban; fallback = end the sentence at "my lead generator for GLF Analytics".

## Restore

Copy `before/` back over the six paths (the two components return to `src/components/`), append the CSS
block to `global.css`, delete `ToolStrip.astro` and `MethodMix.astro`.
