# S37 (10/1/26): measurement and the SEO second pass

**Why:** the site had never recorded a visit (Web Analytics was off on the Vercel project until 10/1), a lead
lost its source as soon as the visitor left the landing page, links to and from his own sites hid the referrer,
and the second SEO read found small gaps the 9/30 pass left: no links between case studies, no publish date on
the Article nodes, one shared share image, two images with the wrong extension.

**What changed (the forward patch is `s37-forward.patch`; `git apply -R` restores every tracked file):**

Measurement
- `BaseLayout.astro`: the first-touch source in `sessionStorage["glf-src"]` (utm or ref, else the referring
  host, the site's own host never), one click listener (`outbound_click`, `contact_click`, `email_click`,
  `planner_click`, two properties at most), the Speed Insights tag beside the Web Analytics one.
- `ContactForm.astro` + the planner page read that one key (the planner's own `wh-src` logic is gone).
- `ContactForm.astro`, `contact.ts`, `api/lead.ts`: one optional field, "How did you find me (optional)"; it
  rides in the message and the notification as `Found me:`.
- `site.ts` `outboundRel()`: links to birthday-cards.ai, glf-ai.com and custom-cards.ai are `noopener` (the
  referrer is sent); every other outside link stays `noreferrer`. The two internal links that open a new tab
  are `rel="opener"` so the tab inherits the source.

SEO
- `[slug].astro` + `content/config.ts` + each case study's `related:` line: a "Related work" row. The pairs
  follow the four cards on the homepage (data: Unilever, UCAN, each also links the planner; growth: bartaco,
  Fox Fodder Flowers; tech: Gotham Goods, bartaco; AI: the construction study, birthday-cards.ai). Labels are
  the titles those pages already carry.
- `everything.ts` + `everything.astro`: a "Case study" link on the seven project headings that have one.
- `pageDates.ts` + NEW `src/data/published.json`: `datePublished` on every case-study Article = the day its
  markdown first entered git. The data post's `dateModified` now reads `lastmod.json` like the sitemap.
- NEW `scripts/og-cards.mjs` (`npm run og`) + NEW `public/images/og/*.png`: one share image per case study
  and a new default, drawn from each page's own words. `Seo.astro`: the alt says what the image shows.
- `site.ts` + `JsonLd.astro`: the organization's description and founding year, the person's description,
  `sameAs` split (the person: LinkedIn, the newsletter, Medium; the organization: + glf-ai.com, GitHub), the
  four `serviceType` strings = the four card titles. The birthday-cards.ai study names the product with him
  as its creator.
- `seoCheck.ts`: six more checks (duplicate titles or descriptions, the share image, internal links, image
  types, dated articles, the service names).
- `llms.txt.ts`: the homepage line carries its title (was the word "Homepage").

**Copy edits, every one:**
1. `/contact` description. Before: "Tell Gabriel Freeman what you are working on. Every message gets a reply,
   or pick a time on the calendar." After: "Tell Gabriel Freeman what you are working on: marketing, database
   work, AI tooling or web development. Or pick a time on the calendar." (his S34 call: no reply promise).
2. NEW label on the form: "How did you find me (optional)".
3. NEW label on the case studies: "Related work". NEW link text on the long list: "Case study".
No other visible word changed (the text diff of all 14 built pages is in the session log).

**Replaced, kept on disk:**
- `public/images/og-default.png` (the S2 card: a serif headline and a line cut off at the right edge) is no
  longer referenced; the default is `public/images/og/default.png`. A copy is here as `og-default.before.png`.
  To go back: one line in `Seo.astro` (`defaultOgImage`).
- `public/images/work/gothamgoods.jpg` (really AVIF) and `public/images/work/ucan.jpg` (really WebP) stay;
  the pages now point at `gothamgoods.avif` and `ucan.webp`, byte-identical copies with the right extension.

**Kept, still working:** every existing event (the planner's, `contact_submit`, `booking_click`, `video_play`),
the five-field Airtable row, both lead routes, every guard line in the build output (only `[lastmod]` and
`[seo]` changed), the h1 and body copy of every page.
