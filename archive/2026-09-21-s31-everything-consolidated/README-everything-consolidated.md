# S31 (9/21/26): the long list consolidated, the cloud curated, the data page in a new tab

## What changed

1. `/everything` bullets: 27 to 22, 986 words to 742. Every project keeps its run and its `#anchor` (15 groups before and after). Rule: lead with what the work did for the business, merge sibling bullets, chips capped at five. No fact was added; every sentence is a cut, a merge, or a reorder of words already on the page.
2. The word cloud is curated, not computed. Each term in `src/data/everything.ts` carries a `weight` from 1 to 5 that sets size and tone (5 = the one gold word). 58 terms to 45, top size 3.4rem to 2.7rem, box padding tightened, the caption "Sized by how often each word appears in the list below" removed. The one guard kept: a cloud word that no longer appears in any bullet or chip throws at build. A seeded shuffle (seed 20261081, picked because it lands one large word in each quarter) plus a pass that keeps two large words from sitting side by side.
3. The two homepage links to `/using-data-to-build-with-ai` open a new tab: "How I built it" in `LiveStats.astro` and the About module row (`newTab` flag on the row type in `About.astro`). The case-study link stays same-tab.

## Why

Gabriel's 9/21 brief: the page said "everything" more than it said value. Shorter, weighted to growing revenue, running leaner, building data systems and AI inside an organization; the format stays; the cloud a bit smaller, no caption, sized by the words that sell him best with more variation.

## To change a cloud word's size

Edit its `weight` number in `cloudTerms`. Sizes: 1 = 0.75rem, 2 = 0.95, 3 = 1.3, 4 = 1.9, 5 = 2.7 (the map is in `everything.astro`).

## Facts that came out (restore any by pasting it back from `before/everything.ts`)

- Mindshare: "measuring whether live campaigns moved anything"; media optimization across programmatic, display, video, paid social, and search.
- GLF Analytics: "set up the business".
- UCAN: no fact dropped (reordered to lead with acquisition costs).
- Gotham Goods: no fact dropped; chips email marketing, loyalty, POS, agency management.
- Haven's Kitchen: "the weekly strategy call"; chip Buy with Prime.
- Fox Fodder Flowers: "canonical tags to sitemap to internal linking".
- bartaco: takeout in the channel list; the ezCater catering listings in seven markets (sponsored budgets, commission bids, the store-by-store audit); "which gave the two platforms two jobs: one wins new customers, the other keeps them"; missing items, wrong orders, and cancellations as the named pipeline inputs; "cut for the CEO, regional managers, and GMs"; the three data audit findings (the DoorDash denominator, the Uber Eats export window, the customer undercount); "sixteen versions with a privacy scrub on each"; "five-channel" and "across ten brands" on the pricing study; chips Olo (kept on the rollout bullet), lifecycle, Adobe Firefly, brand, ezCater, marketplace advertising, delivery marketing, customer acquisition, Loop, pandas, Google Sheets API, openpyxl, data audit, data integrity, markdown, headless Edge.
- Construction firm: Azure Document Intelligence; the general document generator; "turns a folder of bids into an Excel scoreboard"; chip Box AI.
- birthday-cards.ai: the brand sentence (style guide, accessible color tokens, line icons, a typing demo, storytelling); "about 60 events, so a delivered card counts apart from a click"; the page machine detail (canonicals, JSON-LD, an image sitemap, llms.txt); per-IP, the daily render budget, one-send email idempotency; "five-page"; most chips.
- AI on every project: "more than 240 sessions deep on one product"; "twelve".
- glfanalytics.com: "and this page".

## Cloud words dropped

pandas, Olo, ezCater, Claude API, Claude, Azure, TypeScript, Tailwind, Resend, Upstash, markdown, storytelling, delivery.

## Verified

Build green (`[everything] 22 bullets, 15 groups`, the weights line, the order line). Built homepage diff against the prior build: only the two anchors (plus the CSS hash). Playwright 390 and 1440: 0 overflow, 0 page errors, caption gone, cloud 449px tall on the phone and 186px on desktop; both homepage links clicked and each opened a new tab with the homepage still open. Dashes 0, exclamation points 0, kill list 0, client scrub 0. Screens in `screens/`.

## Restore

`git apply archive/2026-09-21-s31-everything-consolidated/reverse.patch` from the repo root, or copy the four files in `before/` back over `src/`.

## Every bullet, before and after

### Mindshare

Before (2):
- Ran brand lift studies for Facebook at Mindshare, measuring whether live campaigns moved anything, and presented the reads to the client. Supported media optimization across programmatic, display, video, paid social, and search.
  chips: marketing research, paid social, paid search, programmatic
- Built the ETL and the database behind that client's reporting, with Tableau dashboards on top.
  chips: SQL, ETL, Tableau

After (1):
- Ran brand lift studies for Facebook at Mindshare and presented the reads to the client. Built the ETL and the database behind that client's reporting, with Tableau dashboards on top.
  chips: marketing research, paid social, SQL, ETL, Tableau

### Your Super

Before (2):
- Joined Your Super as its first data hire and built the data warehouse and the reporting the business ran on as revenue passed $60 million. The SQL tables carried the business logic, so every report used the same definition of an order, a subscriber, and a refund.
  chips: SQL, data warehouse, reporting, data modeling
- Built the forecasting models operations used day to day, inventory projections and demand for new products, and the retention reporting behind a growing subscription program.
  chips: forecasting, Excel, SQL, analytics

After (2):
- First data hire at Your Super. Built the data warehouse and the reporting the business ran on as revenue passed $60 million, with one definition of an order, a subscriber, and a refund in every report.
  chips: SQL, data warehouse, reporting, data modeling
- Built the forecasting models operations used day to day, from inventory projections to demand for new products, and the retention reporting behind a growing subscription program.
  chips: forecasting, Excel, SQL, analytics

### GLF Analytics

Before (1):
- Started GLF Analytics in 2021, set up the business, hired and managed six US-based contractors, and built a sales process that has run on referrals since.
  chips: business operations, sales

After (1):
- Started GLF Analytics in 2021, hired and managed six US-based contractors, and built a sales process that has run on referrals since.
  chips: business operations, sales

### Unilever

Before (1):
- Built a BigQuery data warehouse for Liquid I.V. and Onnit in four months that became the source of truth for decisions at Unilever corporate.
  chips: BigQuery, SQL, data integration

After (1):
- Built a BigQuery data warehouse for Liquid I.V. and Onnit in four months that became the source of truth for decisions at Unilever corporate.
  chips: BigQuery, SQL, data integration

### Make Music

Before (1):
- Worked in a Snowflake warehouse for Make Music, writing the SQL behind its reporting.
  chips: Snowflake, SQL

After (1):
- Worked in a Snowflake warehouse for Make Music, writing the SQL behind its reporting.
  chips: Snowflake, SQL

### UCAN

Before (2):
- Built UCAN's data stack on BigQuery, Looker Studio, and Google Sheets, with automated performance reports the team used for daily decisions.
  chips: BigQuery, Looker Studio, Google Sheets, reporting
- Stayed on at UCAN as digital strategist for a year and a half, growing paid social, influencer, podcast, and sampling channels and bringing acquisition costs down.
  chips: paid social, influencer marketing, growth strategy

After (2):
- Built UCAN's data stack on BigQuery, Looker Studio, and Google Sheets, with automated performance reports the team used for daily decisions.
  chips: BigQuery, Looker Studio, Google Sheets, reporting
- Brought UCAN's acquisition costs down over a year and a half as digital strategist, growing the paid social, influencer, podcast, and sampling channels.
  chips: paid social, influencer marketing, growth strategy

### Gotham Goods

Before (2):
- Tech lead for Gotham through the launch of its first retail store in the Bowery, managing the agency that built the custom-coded site. Gotham did more than $5 million in revenue in year one.
  chips: web development, agency management, eCommerce
- Set up Gotham's tagging and analytics from day one in GA4 and Google Tag Manager, built its email program in Klaviyo, and ran loyalty and point-of-sale software through the store launch.
  chips: GA4, Google Tag Manager, Klaviyo, email marketing, loyalty, POS

After (1):
- Tech lead for Gotham through the launch of its first retail store in the Bowery. Gotham did more than $5 million in revenue in year one. Managed the agency that built the custom-coded site and set up GA4, Google Tag Manager, Klaviyo email, loyalty, and point of sale from day one.
  chips: web development, eCommerce, GA4, Google Tag Manager, Klaviyo

### Haven's Kitchen

Before (1):
- Launched direct-to-consumer eCommerce for Haven's Kitchen, a brand that had only sold through retail and Amazon, managing the three engineers who built it. Then integrated Amazon Buy with Prime and ran the Aioli line launch with new product pages, Google Ads, and the weekly strategy call.
  chips: eCommerce, web development, Amazon, Buy with Prime, Google Ads, growth marketing

After (1):
- Launched direct-to-consumer eCommerce for Haven's Kitchen, a brand that had only sold through retail and Amazon, managing the three engineers who built it. Then integrated Amazon Buy with Prime and ran the Aioli line launch with new product pages and Google Ads.
  chips: eCommerce, web development, Amazon, Google Ads, growth marketing

### Super Teeth

Before (1):
- Built a complete database and reporting system for Super Teeth in six weeks, then trained the team to run it on their own.
  chips: BigQuery, Looker Studio, GA4, training

After (1):
- Built a complete database and reporting system for Super Teeth in six weeks, then trained the team to run it on their own.
  chips: BigQuery, Looker Studio, GA4, training

### Fox Fodder Flowers

Before (1):
- Ran a technical SEO audit for Fox Fodder Flowers, canonical tags to sitemap to internal linking, then built its Google Ads account from nothing and kept it profitable on brand and non-brand terms. Sales grew 20% that year.
  chips: SEO audit, Google Ads, paid search, growth

After (1):
- Sales at Fox Fodder Flowers grew 20% in a year. Ran the technical SEO audit, then built its Google Ads account from nothing and kept it profitable on brand and non-brand terms.
  chips: SEO audit, Google Ads, paid search, growth

### bartaco

Before (5):
- Led digital marketing and growth for bartaco across 34 markets: email, loyalty, paid media, website, app, and takeout. Ran the email program to more than 500,000 subscribers and built an AI-assisted creative workflow that turns a concept into a finished Klaviyo campaign.
  chips: Klaviyo, paid media, loyalty, Olo, growth marketing, email marketing, lifecycle, Adobe Firefly, Claude, brand
- Ran the QR dine-in ordering rollout across 30 locations with multiple vendors and more than 50 people, and the ezCater catering listings in seven markets: sponsored budgets, commission bids that set search rank, a store-by-store audit of the return.
  chips: Olo, OneDine, project management, product, ezCater, marketplace advertising
- Moved Uber Eats and DoorDash onto a market-by-market profitability framework: a keep or remove call on every market each month, taken to the CEO and CFO. Delivery is measured on payout dollars, not platform-reported sales, which gave the two platforms two jobs: one wins new customers, the other keeps them.
  chips: Uber Eats, DoorDash, growth strategy, delivery marketing, analytics, customer acquisition, Loop
- Built the delivery reporting in Python: an automated month close (payout exports in, a year-over-year Google Sheet with an executive overview out) and a monthly operations pipeline for missing items, wrong orders, and cancellations across 31 markets, cut for the CEO, regional managers, and GMs. It found the cost sat in missing items on bundled orders and turned a menu debate into a packing checklist.
  chips: Python, pandas, Google Sheets API, Claude Code, openpyxl, Excel, operations analytics
- Audited the data before reading it: a DoorDash denominator that halved error rates, a mismatched Uber Eats export window, a customer undercount that would have inflated a growth story. Built a self-serve operations knowledge base regional managers upload to Claude and question directly, sixteen versions with a privacy scrub on each, and ran a five-channel competitor pricing study across ten brands, more than 1,200 price points traceable to their sources.
  chips: data audit, data integrity, pandas, Claude, Python, knowledge base, markdown, Claude Code, headless Edge, Excel, pricing analysis

After (4):
- Led digital marketing and growth for bartaco across 34 markets: email, loyalty, paid media, website, and app. Ran the email program to more than 500,000 subscribers and built an AI-assisted creative workflow that turns a concept into a finished Klaviyo campaign.
  chips: Klaviyo, email marketing, loyalty, paid media, Claude
- Moved Uber Eats and DoorDash onto a market-by-market profitability framework, with a keep or remove call on every market each month taken to the CEO and CFO. Delivery is measured on payout dollars, not platform-reported sales. Automated the month close in Python, from payout exports to a year-over-year Google Sheet with an executive overview.
  chips: Uber Eats, DoorDash, growth strategy, Python, Google Sheets
- Ran the QR dine-in ordering rollout across 30 locations with multiple vendors and more than 50 people.
  chips: project management, product, Olo, OneDine
- Built the monthly operations reporting for 31 markets in Python. It found the cost sat in missing items on bundled orders and turned a menu debate into a packing checklist. Added a knowledge base regional managers question directly in Claude and a competitor pricing study of more than 1,200 sourced price points.
  chips: Python, operations analytics, knowledge base, Claude, pricing analysis

### A construction management firm in LA

Before (3):
- Built a weekly report generator for a construction management firm in LA: a form and a contractor PDF in, a branded report out, on Power Automate, the Claude API, and Azure Document Intelligence. No new software for the team and a named human reviewer on every workflow.
  chips: Power Automate, Claude API, Azure Document Intelligence, SharePoint
- Reused that architecture for a general document generator and a bid comparison analyzer that turns a folder of bids into an Excel scoreboard. One review showed a $1.3M headline gap between two bids was misleading.
  chips: Power Automate, Claude API, Excel, automation
- Ran eight rounds of AI training at that firm, built Copilot agents and a prompt library the team maintains, and wrote the firm's voice as a rules register so every document reads the same.
  chips: Microsoft 365 Copilot, Box AI, training, prompt library, brand voice

After (2):
- Built a weekly report generator for a construction management firm in LA on Power Automate and the Claude API: a form and a contractor PDF in, a branded report out. No new software for the team and a named human reviewer on every workflow. The same build compares bids, and one review showed a $1.3M headline gap between two bids was misleading.
  chips: Power Automate, Claude API, SharePoint, Excel, automation
- Ran eight rounds of AI training at that firm, built Copilot agents and a prompt library the team maintains, and wrote the firm's voice as a rules register so every document reads the same.
  chips: Microsoft 365 Copilot, training, prompt library, brand voice

### birthday-cards.ai

Before (3):
- Designed, built, and launched birthday-cards.ai with Claude Code, from the Next.js front end to the OpenAI and Gemini image models behind it. Built the brand with it: a style guide, accessible color tokens, line icons, a typing demo, storytelling on every page.
  chips: Claude Code, Next.js, TypeScript, Tailwind, Vercel, OpenAI, Gemini, Airtable, Resend, Upstash, brand, design, storytelling, style guide
- Wrote the tracking, about 60 events, so a delivered card counts apart from a click, and built the search and AI-answer page machine: landing pages with canonicals, JSON-LD, an image sitemap, llms.txt. People arrive from Google, Bing, DuckDuckGo, and ChatGPT and make cards.
  chips: Vercel Web Analytics, Google Search Console, Bing Webmaster, IndexNow, analytics, SEO, GEO, JSON-LD, llms.txt
- Hardened it for real traffic: per-IP rate limits, a daily render budget, spend caps with alerts, one-send email idempotency, a test suite before every deploy. Then forked the code into custom-cards.ai, a white-label card page for shops, and makemeabook.ai, a five-page illustrated book from one name and one idea.
  chips: Upstash, Vitest, security, reliability, Next.js, Gemini, OpenAI, white-label, product

After (2):
- Designed, built, and launched birthday-cards.ai with Claude Code, from the Next.js front end to the OpenAI and Gemini image models behind it. It runs on its own analytics, and people arrive from Google, Bing, DuckDuckGo, and ChatGPT and make cards.
  chips: Claude Code, Next.js, OpenAI, Airtable, SEO
- Hardened it for real traffic with rate limits, spend caps with alerts, and a test suite before every deploy. Then forked the code into custom-cards.ai, a white-label card page for shops, and makemeabook.ai, an illustrated book from one name and one idea.
  chips: security, reliability, Vitest, white-label, product

### AI on every project

Before (1):
- Built .md note systems for AI on every project: a briefing file, a state file rewritten each session, an append-only log, and archive-before-delete, more than 240 sessions deep on one product. Wrote twelve Claude Code skills on top, each validated before use.
  chips: Claude Code, markdown, context engineering, skills

After (1):
- Built .md note systems for AI on every project: a briefing file, a state file rewritten each session, an append-only log, and archive-before-delete. Wrote Claude Code skills on top, each validated before use.
  chips: Claude Code, markdown, context engineering, skills

### glfanalytics.com

Before (1):
- Audited and rebuilt glfanalytics.com in Astro on Vercel with a live stats block that reads the Vercel Web Analytics API at build time, and this page.
  chips: Astro, Tailwind, Vercel, TypeScript, web development

After (1):
- Audited and rebuilt glfanalytics.com in Astro on Vercel with a live stats block that reads the Vercel Web Analytics API at build time.
  chips: Astro, Tailwind, Vercel, web development
