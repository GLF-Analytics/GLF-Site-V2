/*
  /everything: the long list. Everything Gabriel has done since 2017, in
  order (Mindshare first, this month last; the page never says it is
  chronological). S20 (9/15/26): consolidated from forty bullets to fewer,
  longer ones (bartaco five, birthday-cards.ai three) with no fact dropped. Each bullet names its project; consecutive bullets with the
  same project render under one mono heading on the page, so a run of bartaco
  bullets reads as one block. Each bullet is one or two plain sentences plus
  the tools it used. The word cloud on the page is COMPUTED from this text at build time,
  so editing a bullet re-sizes the cloud. Rules that govern this file:
  first person implied, no prices, no client performance numbers unless they
  are already on this site or in the resume, the construction client is
  always "a construction management firm in LA", no em or en dashes.
*/

export type Bullet = { project: string; text: string; tools: string[] };

export const intro = {
  eyebrow: "Since 2017",
  title: "The long list",
  lead: "My career has twists and turns and I keep picking up new skills. This is everything I would put on my resume if it did not have to fit on one page."
};

export const bullets: Bullet[] = [
  {
    project: "Mindshare",
    text: "Ran brand lift studies for Facebook at Mindshare, measuring whether live campaigns moved anything, and presented the reads to the client. Supported media optimization across programmatic, display, video, paid social, and search.",
    tools: ["marketing research", "paid social", "paid search", "programmatic"]
  },
  {
    project: "Mindshare",
    text: "Built the ETL and the database behind that client's reporting, with Tableau dashboards on top.",
    tools: ["SQL", "ETL", "Tableau"]
  },
  {
    project: "Your Super",
    text: "Joined Your Super as its first data hire and built the data warehouse and the reporting the business ran on as revenue passed $60 million. The SQL tables carried the business logic, so every report used the same definition of an order, a subscriber, and a refund.",
    tools: ["SQL", "data warehouse", "reporting", "data modeling"]
  },
  {
    project: "Your Super",
    text: "Built the forecasting models operations used day to day, inventory projections and demand for new products, and the retention reporting behind a growing subscription program.",
    tools: ["forecasting", "Excel", "SQL", "analytics"]
  },
  {
    project: "GLF Analytics",
    text: "Started GLF Analytics in 2021, set up the business, hired and managed six US-based contractors, and built a sales process that has run on referrals since.",
    tools: ["business operations", "sales"]
  },
  {
    project: "Unilever",
    text: "Built a BigQuery data warehouse for Liquid I.V. and Onnit in four months that became the source of truth for decisions at Unilever corporate.",
    tools: ["BigQuery", "SQL", "data integration"]
  },
  {
    project: "Make Music",
    text: "Worked in a Snowflake warehouse for Make Music, writing the SQL behind its reporting.",
    tools: ["Snowflake", "SQL"]
  },
  {
    project: "UCAN",
    text: "Built UCAN's data stack on BigQuery, Looker Studio, and Google Sheets, with automated performance reports the team used for daily decisions.",
    tools: ["BigQuery", "Looker Studio", "Google Sheets", "reporting"]
  },
  {
    project: "UCAN",
    text: "Stayed on at UCAN as digital strategist for a year and a half, growing paid social, influencer, podcast, and sampling channels and bringing acquisition costs down.",
    tools: ["paid social", "influencer marketing", "growth strategy"]
  },
  {
    project: "Gotham Goods",
    text: "Tech lead for Gotham through the launch of its first retail store in the Bowery, managing the agency that built the custom-coded site. Gotham did more than $5 million in revenue in year one.",
    tools: ["web development", "agency management", "eCommerce"]
  },
  {
    project: "Gotham Goods",
    text: "Set up Gotham's tagging and analytics from day one in GA4 and Google Tag Manager, built its email program in Klaviyo, and ran loyalty and point-of-sale software through the store launch.",
    tools: ["GA4", "Google Tag Manager", "Klaviyo", "email marketing", "loyalty", "POS"]
  },
  {
    project: "Haven's Kitchen",
    text: "Launched direct-to-consumer eCommerce for Haven's Kitchen, a brand that had only sold through retail and Amazon, managing the three engineers who built it. Then integrated Amazon Buy with Prime and ran the Aioli line launch with new product pages, Google Ads, and the weekly strategy call.",
    tools: ["eCommerce", "web development", "Amazon", "Buy with Prime", "Google Ads", "growth marketing"]
  },
  {
    project: "Super Teeth",
    text: "Built a complete database and reporting system for Super Teeth in six weeks, then trained the team to run it on their own.",
    tools: ["BigQuery", "Looker Studio", "GA4", "training"]
  },
  {
    project: "Fox Fodder Flowers",
    text: "Ran a technical SEO audit for Fox Fodder Flowers, canonical tags to sitemap to internal linking, then built its Google Ads account from nothing and kept it profitable on brand and non-brand terms. Sales grew 20% that year.",
    tools: ["SEO audit", "Google Ads", "paid search", "growth"]
  },
  {
    project: "bartaco",
    text: "Led digital marketing and growth for bartaco across 34 markets: email, loyalty, paid media, website, app, and takeout. Ran the email program to more than 500,000 subscribers and built an AI-assisted creative workflow that turns a concept into a finished Klaviyo campaign.",
    tools: ["Klaviyo", "paid media", "loyalty", "Olo", "growth marketing", "email marketing", "lifecycle", "Adobe Firefly", "Claude", "brand"]
  },
  {
    project: "bartaco",
    text: "Ran the QR dine-in ordering rollout across 30 locations with multiple vendors and more than 50 people, and the ezCater catering listings in seven markets: sponsored budgets, commission bids that set search rank, a store-by-store audit of the return.",
    tools: ["Olo", "OneDine", "project management", "product", "ezCater", "marketplace advertising"]
  },
  {
    project: "bartaco",
    text: "Moved Uber Eats and DoorDash onto a market-by-market profitability framework: a keep or remove call on every market each month, taken to the CEO and CFO. Delivery is measured on payout dollars, not platform-reported sales, which gave the two platforms two jobs: one wins new customers, the other keeps them.",
    tools: ["Uber Eats", "DoorDash", "growth strategy", "delivery marketing", "analytics", "customer acquisition", "Loop"]
  },
  {
    project: "bartaco",
    text: "Built the delivery reporting in Python: an automated month close (payout exports in, a year-over-year Google Sheet with an executive overview out) and a monthly operations pipeline for missing items, wrong orders, and cancellations across 31 markets, cut for the CEO, regional managers, and GMs. It found the cost sat in missing items on bundled orders and turned a menu debate into a packing checklist.",
    tools: ["Python", "pandas", "Google Sheets API", "Claude Code", "openpyxl", "Excel", "operations analytics"]
  },
  {
    project: "bartaco",
    text: "Audited the data before reading it: a DoorDash denominator that halved error rates, a mismatched Uber Eats export window, a customer undercount that would have inflated a growth story. Built a self-serve operations knowledge base regional managers upload to Claude and question directly, sixteen versions with a privacy scrub on each, and ran a five-channel competitor pricing study across ten brands, more than 1,200 price points traceable to their sources.",
    tools: ["data audit", "data integrity", "pandas", "Claude", "Python", "knowledge base", "markdown", "Claude Code", "headless Edge", "Excel", "pricing analysis"]
  },
  {
    project: "A construction management firm in LA",
    text: "Built a weekly report generator for a construction management firm in LA: a form and a contractor PDF in, a branded report out, on Power Automate, the Claude API, and Azure Document Intelligence. No new software for the team and a named human reviewer on every workflow.",
    tools: ["Power Automate", "Claude API", "Azure Document Intelligence", "SharePoint"]
  },
  {
    project: "A construction management firm in LA",
    text: "Reused that architecture for a general document generator and a bid comparison analyzer that turns a folder of bids into an Excel scoreboard. One review showed a $1.3M headline gap between two bids was misleading.",
    tools: ["Power Automate", "Claude API", "Excel", "automation"]
  },
  {
    project: "A construction management firm in LA",
    text: "Ran eight rounds of AI training at that firm, built Copilot agents and a prompt library the team maintains, and wrote the firm's voice as a rules register so every document reads the same.",
    tools: ["Microsoft 365 Copilot", "Box AI", "training", "prompt library", "brand voice"]
  },
  {
    project: "birthday-cards.ai",
    text: "Designed, built, and launched birthday-cards.ai with Claude Code, from the Next.js front end to the OpenAI and Gemini image models behind it. Built the brand with it: a style guide, accessible color tokens, line icons, a typing demo, storytelling on every page.",
    tools: ["Claude Code", "Next.js", "TypeScript", "Tailwind", "Vercel", "OpenAI", "Gemini", "Airtable", "Resend", "Upstash", "brand", "design", "storytelling", "style guide"]
  },
  {
    project: "birthday-cards.ai",
    text: "Wrote the tracking, about 60 events, so a delivered card counts apart from a click, and built the search and AI-answer page machine: landing pages with canonicals, JSON-LD, an image sitemap, llms.txt. People arrive from Google, Bing, DuckDuckGo, and ChatGPT and make cards.",
    tools: ["Vercel Web Analytics", "Google Search Console", "Bing Webmaster", "IndexNow", "analytics", "SEO", "GEO", "JSON-LD", "llms.txt"]
  },
  {
    project: "birthday-cards.ai",
    text: "Hardened it for real traffic: per-IP rate limits, a daily render budget, spend caps with alerts, one-send email idempotency, a test suite before every deploy. Then forked the code into custom-cards.ai, a white-label card page for shops, and makemeabook.ai, a five-page illustrated book from one name and one idea.",
    tools: ["Upstash", "Vitest", "security", "reliability", "Next.js", "Gemini", "OpenAI", "white-label", "product"]
  },
  {
    project: "AI on every project",
    text: "Built .md note systems for AI on every project: a briefing file, a state file rewritten each session, an append-only log, and archive-before-delete, more than 240 sessions deep on one product. Wrote twelve Claude Code skills on top, each validated before use.",
    tools: ["Claude Code", "markdown", "context engineering", "skills"]
  },
  {
    project: "glfanalytics.com",
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
