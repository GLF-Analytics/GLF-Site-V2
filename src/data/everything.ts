/*
  /everything: the long list. Forty things Gabriel has done since 2017, in
  order (Mindshare first, this month last; the page never says it is
  chronological). Each bullet is one or two plain sentences plus the tools it
  used. The word cloud on the page is COMPUTED from this text at build time,
  so editing a bullet re-sizes the cloud. Rules that govern this file:
  first person implied, no prices, no client performance numbers unless they
  are already on this site or in the resume, the construction client is
  always "a construction management firm in LA", no em or en dashes.
*/

export type Bullet = { text: string; tools: string[] };

export const intro = {
  eyebrow: "Since 2017",
  title: "The long list",
  lead: "My career has twists and turns and I keep picking up new skills. This is everything I would put on my resume if it did not have to fit on one page."
};

export const bullets: Bullet[] = [
  {
    text: "Ran brand lift studies for Facebook at Mindshare, measuring whether live campaigns moved anything, and presented the reads to the client. Supported media optimization across programmatic, display, video, paid social, and search.",
    tools: ["marketing research", "paid social", "paid search", "programmatic"]
  },
  {
    text: "Built the ETL and the database behind that client's reporting, with Tableau dashboards on top.",
    tools: ["SQL", "ETL", "Tableau"]
  },
  {
    text: "Joined a DTC brand as its first data hire and built the data warehouse and the reporting the business ran on as revenue passed $60 million.",
    tools: ["SQL", "data warehouse", "reporting"]
  },
  {
    text: "Wrote the SQL tables that carried the business logic, so every report ran on the same data and the same definition of an order, a subscriber, and a refund.",
    tools: ["SQL", "data modeling"]
  },
  {
    text: "Built the forecasting models operations used day to day, inventory projections and demand for new products, and the retention reporting behind a growing subscription program.",
    tools: ["forecasting", "Excel", "SQL", "analytics"]
  },
  {
    text: "Started GLF Analytics in 2021, set up the business, hired and managed six US-based contractors, and built a sales process that has run on referrals since.",
    tools: ["business operations", "sales"]
  },
  {
    text: "Built a BigQuery data warehouse for Liquid I.V. and Onnit in four months that became the source of truth for decisions at Unilever corporate.",
    tools: ["BigQuery", "SQL", "data integration"]
  },
  {
    text: "Worked in a Snowflake warehouse for Make Music, writing the SQL behind its reporting.",
    tools: ["Snowflake", "SQL"]
  },
  {
    text: "Built UCAN's data stack on BigQuery, Looker Studio, and Google Sheets, with automated performance reports the team used for daily decisions.",
    tools: ["BigQuery", "Looker Studio", "Google Sheets", "reporting"]
  },
  {
    text: "Stayed on at UCAN as digital strategist for a year and a half, growing paid social, influencer, podcast, and sampling channels and bringing acquisition costs down.",
    tools: ["paid social", "influencer marketing", "growth strategy"]
  },
  {
    text: "Served as tech lead for Gotham through the launch of its first retail store in the Bowery, managing the agency that built the custom-coded site. Gotham did more than $5 million in revenue in year one.",
    tools: ["web development", "agency management", "eCommerce"]
  },
  {
    text: "Set up Gotham's tagging and analytics from day one in GA4 and Google Tag Manager, then built its email program from the ground up in Klaviyo and ran loyalty and point-of-sale software through the store launch.",
    tools: ["GA4", "Google Tag Manager", "Klaviyo", "email marketing", "loyalty", "POS"]
  },
  {
    text: "Launched direct-to-consumer eCommerce for Haven's Kitchen, a brand that had only sold through retail and Amazon, managing the three engineers who built it.",
    tools: ["eCommerce", "web development"]
  },
  {
    text: "Integrated Amazon Buy with Prime for Haven's Kitchen, a new channel and a new piece of software for the brand, and ran the Aioli line launch with new product pages, Google Ads, and the weekly strategy call.",
    tools: ["Amazon", "Buy with Prime", "Google Ads", "growth marketing"]
  },
  {
    text: "Built a complete database and reporting system for Super Teeth in six weeks, then trained the team to run it without me.",
    tools: ["BigQuery", "Looker Studio", "GA4", "training"]
  },
  {
    text: "Ran a full technical SEO audit for Fox Fodder Flowers: canonical tags, duplicate content, the XML sitemap, internal linking.",
    tools: ["SEO audit"]
  },
  {
    text: "Built Fox Fodder's Google Ads account from nothing and kept it profitable on brand and non-brand terms. Sales grew 20% that year.",
    tools: ["Google Ads", "paid search", "growth"]
  },
  {
    text: "Led digital marketing and growth for bartaco across 34 markets: email, loyalty, paid media, website, app, and the takeout experience.",
    tools: ["Klaviyo", "paid media", "loyalty", "Olo", "growth marketing"]
  },
  {
    text: "Managed bartaco's email marketing to a list of more than 500,000 subscribers.",
    tools: ["Klaviyo", "email marketing", "lifecycle"]
  },
  {
    text: "Ran the QR dine-in ordering rollout across 30 bartaco locations, a project with multiple vendors and more than 50 people on it.",
    tools: ["Olo", "OneDine", "project management", "product"]
  },
  {
    text: "Took over Uber Eats and DoorDash for bartaco and replaced a spend-everywhere ad program with a market-by-market profitability framework. Every market gets a keep, remove, or candidate call each month, taken to the CEO and CFO.",
    tools: ["Uber Eats", "DoorDash", "growth strategy", "delivery marketing"]
  },
  {
    text: "Measured delivery on payout dollars instead of platform-reported sales, and read markets with ad money against markets without it. That split the two platforms into two jobs: one brings new customers in, the other keeps them.",
    tools: ["analytics", "customer acquisition", "Loop"]
  },
  {
    text: "Built the automated month close in Python: Uber Eats and DoorDash payout exports in, a Google Sheet with year-over-year tabs and an executive overview out, with a runbook the team keeps.",
    tools: ["Python", "pandas", "Google Sheets API", "Claude Code"]
  },
  {
    text: "Built the 3PD operations analysis: a monthly pipeline for missing items, wrong orders, and cancellations across 31 markets on both platforms, cut three ways for the CEO, regional managers, and GMs. It showed that missing items on bundled orders, not wrong orders, drove most of the cost, which turned a menu debate into a packing checklist.",
    tools: ["Python", "openpyxl", "Excel", "operations analytics"]
  },
  {
    text: "Audited the data before reading it: a DoorDash denominator that made error rates look halved, an Uber Eats export window that mismatched numerator and denominator, and a customer-count undercount that would have inflated a growth story.",
    tools: ["data audit", "data integrity", "pandas"]
  },
  {
    text: "Built a self-serve operations knowledge base that regional managers upload to Claude and ask questions of directly, rebuilt by script through sixteen versions with a privacy scrub on every build.",
    tools: ["Claude", "Python", "knowledge base", "markdown"]
  },
  {
    text: "Ran a five-channel competitor pricing study across ten restaurant brands: more than 1,200 price points collected with Claude Code sub-agents and headless browser scraping, every price traceable to its source.",
    tools: ["Claude Code", "Python", "headless Edge", "Excel", "pricing analysis"]
  },
  {
    text: "Ran bartaco's catering listings on ezCater across seven markets: weekly sponsored budgets, commission bids that set search rank, and a store-by-store audit of what each returned.",
    tools: ["ezCater", "marketplace advertising"]
  },
  {
    text: "Built an AI-assisted email creative workflow for bartaco's designer: concept, copy, and image prompts in, finished Klaviyo campaigns out, inside a documented brand system.",
    tools: ["Klaviyo", "email marketing", "Adobe Firefly", "Claude", "brand"]
  },
  {
    text: "Built a weekly report generator for a construction management firm in LA: an employee submits a form with a contractor PDF and gets back a branded report. Power Automate, the Claude API, and Azure Document Intelligence, with no new software for the team and a named human reviewer on every workflow.",
    tools: ["Power Automate", "Claude API", "Azure Document Intelligence", "SharePoint"]
  },
  {
    text: "Reused that architecture for a general document generator and a bid comparison analyzer that turns a folder of bids into an Excel scoreboard. One review showed a $1.3M headline gap between two bids was misleading.",
    tools: ["Power Automate", "Claude API", "Excel", "automation"]
  },
  {
    text: "Ran eight rounds of AI training at that firm, built Copilot agents and a prompt library the team maintains, and wrote the firm's voice as a rules register with a style-check skill so every document reads the same no matter who wrote it.",
    tools: ["Microsoft 365 Copilot", "Box AI", "training", "prompt library", "brand voice"]
  },
  {
    text: "Designed, built, and launched birthday-cards.ai alone with Claude Code: Next.js, TypeScript, Tailwind, Vercel, OpenAI and Gemini image models, Airtable, Resend, Vercel Blob, Upstash, pdf-lib.",
    tools: ["Claude Code", "Next.js", "TypeScript", "Tailwind", "Vercel", "OpenAI", "Gemini", "Airtable", "Resend", "Upstash"]
  },
  {
    text: "Built the brand along with the product: a design language with its own style guide, accessible color tokens, line icons, a typing demo, and the storytelling on every page.",
    tools: ["brand", "design", "storytelling", "style guide"]
  },
  {
    text: "Wrote the event tracking myself, about 60 events, so a delivered card counts apart from a click, and read the data weekly through Vercel Web Analytics, Google Search Console, and Bing.",
    tools: ["Vercel Web Analytics", "Google Search Console", "Bing Webmaster", "IndexNow", "analytics"]
  },
  {
    text: "Built the search and AI-answer page machine: a set of landing pages with canonicals, JSON-LD, an image sitemap, and llms.txt. People arrive from Google, Bing, DuckDuckGo, and ChatGPT and make cards.",
    tools: ["SEO", "GEO", "JSON-LD", "llms.txt"]
  },
  {
    text: "Hardened it for real traffic: per-IP rate limits, a daily render budget, spend caps with alerts, one-send email idempotency, and a test suite that runs before every deploy.",
    tools: ["Upstash", "Vitest", "security", "reliability"]
  },
  {
    text: "Forked the codebase into custom-cards.ai, a white-label card page for shops, and makemeabook.ai, a five-page illustrated book from one name and one idea.",
    tools: ["Next.js", "Gemini", "OpenAI", "white-label", "product"]
  },
  {
    text: "Built .md note systems and harnesses for AI on every project: a briefing file, a state file rewritten each session, an append-only log, a learnings file, and archive-before-delete, more than 240 sessions deep on one product. Authored twelve custom Claude Code skills on top of it, each validated in isolation before use.",
    tools: ["Claude Code", "markdown", "context engineering", "skills"]
  },
  {
    text: "Audited and rebuilt glfanalytics.com in Astro on Vercel with a live stats block that reads the Vercel Web Analytics API at build time, and this page.",
    tools: ["Astro", "Tailwind", "Vercel", "TypeScript", "web development"]
  }
];

/*
  The cloud vocabulary. `label` is what the page shows; `pattern` is the
  regex counted against every bullet's text and tools (case-insensitive
  unless the pattern says otherwise). Default = the label as a prefix at a
  word boundary, so "audit" also counts "audited" and "audits", and "data"
  counts "database" and "datasets". Build throws if any term scores zero.
*/
export type CloudTerm = { label: string; pattern?: RegExp };

export const cloudTerms: CloudTerm[] = [
  { label: "data" },
  { label: "analytics", pattern: /(?<!GLF )\banalytic/gi },
  { label: "marketing" },
  { label: "growth", pattern: /\bgrow/gi },
  { label: "audit" },
  { label: "reporting", pattern: /\breport(ing|s)?\b/gi },
  { label: "strategy", pattern: /\bstrateg/gi },
  { label: "forecasting", pattern: /\bforecast/gi },
  { label: "email" },
  { label: "SEO", pattern: /\bSEO\b/g },
  { label: "paid media", pattern: /\bpaid (media|social|search)\b/gi },
  { label: "AI", pattern: /\bAI\b/g },
  { label: "automation", pattern: /\bautomat/gi },
  { label: "design", pattern: /\bdesign/gi },
  { label: "brand", pattern: /(?<!non-)\bbrand\b(?! lift)/gi },
  { label: "storytelling" },
  { label: "product" },
  { label: "training", pattern: /\btrain/gi },
  { label: "eCommerce", pattern: /\becommerce\b/gi },
  { label: "integrations", pattern: /\bintegrat/gi },
  { label: "knowledge base" },
  { label: "delivery", pattern: /\bdeliver/gi },
  { label: "operations", pattern: /\boperation/gi },
  { label: "SQL", pattern: /\bSQL\b/g },
  { label: "BigQuery" },
  { label: "Snowflake" },
  { label: "Looker Studio" },
  { label: "Tableau" },
  { label: "GA4", pattern: /\bGA4\b/g },
  { label: "Google Tag Manager" },
  { label: "Klaviyo" },
  { label: "Google Ads" },
  { label: "Amazon" },
  { label: "Uber Eats" },
  { label: "DoorDash" },
  { label: "Olo", pattern: /\bOlo\b/g },
  { label: "ezCater" },
  { label: "Python" },
  { label: "pandas" },
  { label: "Excel" },
  { label: "Google Sheets" },
  { label: "Claude Code" },
  { label: "Claude API" },
  { label: "Claude", pattern: /\bClaude\b(?! Code| API)/g },
  { label: "Power Automate" },
  { label: "Azure" },
  { label: "Copilot" },
  { label: "Next.js", pattern: /\bNext\.js/g },
  { label: "TypeScript" },
  { label: "Tailwind" },
  { label: "Vercel" },
  { label: "Airtable" },
  { label: "Resend" },
  { label: "Upstash" },
  { label: "OpenAI" },
  { label: "Gemini" },
  { label: "Astro", pattern: /\bAstro\b/g },
  { label: "markdown", pattern: /\b(markdown|\.md)\b/gi }
];
