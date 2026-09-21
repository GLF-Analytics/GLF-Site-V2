/*
  /everything: the long list. Everything Gabriel has done since 2017, in
  order (Mindshare first, this month last; the page never says it is
  chronological). S20 (9/15/26): consolidated from forty bullets to fewer,
  longer ones. S31 (9/21/26), his brief: shorter and weighted to what a
  homepage visitor came for (growing revenue, running leaner, building data
  systems, AI inside an organization). Every project keeps its run; sibling
  bullets merged, chips capped at five, no fact added. The bullets and facts
  that came out are listed in archive/2026-09-21-s31-everything-consolidated.
  Each bullet names its project; consecutive bullets with the same project
  render under one mono heading on the page. The word cloud is CURATED since
  S31: each term carries a weight from 1 to 5 that sets its size (his call:
  the words that sell him best, not a count). The one guard left: a term that
  no longer appears in any bullet or chip throws at build. Rules that govern
  this file: first person implied, no prices, no client performance numbers
  unless they are already on this site or in the resume, the construction
  client is always "a construction management firm in LA", no em or en dashes.
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
    text: "Ran brand lift studies for Facebook at Mindshare and presented the reads to the client. Built the ETL and the database behind that client's reporting, with Tableau dashboards on top.",
    tools: ["marketing research", "paid social", "SQL", "ETL", "Tableau"]
  },
  {
    project: "Your Super",
    text: "First data hire at Your Super. Built the data warehouse and the reporting the business ran on as revenue passed $60 million, with one definition of an order, a subscriber, and a refund in every report.",
    tools: ["SQL", "data warehouse", "reporting", "data modeling"]
  },
  {
    project: "Your Super",
    text: "Built the forecasting models operations used day to day, from inventory projections to demand for new products, and the retention reporting behind a growing subscription program.",
    tools: ["forecasting", "Excel", "SQL", "analytics"]
  },
  {
    project: "GLF Analytics",
    text: "Started GLF Analytics in 2021, hired and managed six US-based contractors, and built a sales process that has run on referrals since.",
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
    text: "Brought UCAN's acquisition costs down over a year and a half as digital strategist, growing the paid social, influencer, podcast, and sampling channels.",
    tools: ["paid social", "influencer marketing", "growth strategy"]
  },
  {
    project: "Gotham Goods",
    text: "Tech lead for Gotham through the launch of its first retail store in the Bowery. Gotham did more than $5 million in revenue in year one. Managed the agency that built the custom-coded site and set up GA4, Google Tag Manager, Klaviyo email, loyalty, and point of sale from day one.",
    tools: ["web development", "eCommerce", "GA4", "Google Tag Manager", "Klaviyo"]
  },
  {
    project: "Haven's Kitchen",
    text: "Launched direct-to-consumer eCommerce for Haven's Kitchen, a brand that had only sold through retail and Amazon, managing the three engineers who built it. Then integrated Amazon Buy with Prime and ran the Aioli line launch with new product pages and Google Ads.",
    tools: ["eCommerce", "web development", "Amazon", "Google Ads", "growth marketing"]
  },
  {
    project: "Super Teeth",
    text: "Built a complete database and reporting system for Super Teeth in six weeks, then trained the team to run it on their own.",
    tools: ["BigQuery", "Looker Studio", "GA4", "training"]
  },
  {
    project: "Fox Fodder Flowers",
    text: "Sales at Fox Fodder Flowers grew 20% in a year. Ran the technical SEO audit, then built its Google Ads account from nothing and kept it profitable on brand and non-brand terms.",
    tools: ["SEO audit", "Google Ads", "paid search", "growth"]
  },
  {
    project: "bartaco",
    text: "Led digital marketing and growth for bartaco across 34 markets: email, loyalty, paid media, website, and app. Ran the email program to more than 500,000 subscribers and built an AI-assisted creative workflow that turns a concept into a finished Klaviyo campaign.",
    tools: ["Klaviyo", "email marketing", "loyalty", "paid media", "Claude"]
  },
  {
    project: "bartaco",
    text: "Moved Uber Eats and DoorDash onto a market-by-market profitability framework, with a keep or remove call on every market each month taken to the CEO and CFO. Delivery is measured on payout dollars, not platform-reported sales. Automated the month close in Python, from payout exports to a year-over-year Google Sheet with an executive overview.",
    tools: ["Uber Eats", "DoorDash", "growth strategy", "Python", "Google Sheets"]
  },
  {
    project: "bartaco",
    text: "Ran the QR dine-in ordering rollout across 30 locations with multiple vendors and more than 50 people.",
    tools: ["project management", "product", "Olo", "OneDine"]
  },
  {
    project: "bartaco",
    text: "Built the monthly operations reporting for 31 markets in Python. It found the cost sat in missing items on bundled orders and turned a menu debate into a packing checklist. Added a knowledge base regional managers question directly in Claude and a competitor pricing study of more than 1,200 sourced price points.",
    tools: ["Python", "operations analytics", "knowledge base", "Claude", "pricing analysis"]
  },
  {
    project: "A construction management firm in LA",
    text: "Built a weekly report generator for a construction management firm in LA on Power Automate and the Claude API: a form and a contractor PDF in, a branded report out. No new software for the team and a named human reviewer on every workflow. The same build compares bids, and one review showed a $1.3M headline gap between two bids was misleading.",
    tools: ["Power Automate", "Claude API", "SharePoint", "Excel", "automation"]
  },
  {
    project: "A construction management firm in LA",
    text: "Ran eight rounds of AI training at that firm, built Copilot agents and a prompt library the team maintains, and wrote the firm's voice as a rules register so every document reads the same.",
    tools: ["Microsoft 365 Copilot", "training", "prompt library", "brand voice"]
  },
  {
    project: "birthday-cards.ai",
    text: "Designed, built, and launched birthday-cards.ai with Claude Code, from the Next.js front end to the OpenAI and Gemini image models behind it. It runs on its own analytics, and people arrive from Google, Bing, DuckDuckGo, and ChatGPT and make cards.",
    tools: ["Claude Code", "Next.js", "OpenAI", "Airtable", "SEO"]
  },
  {
    project: "birthday-cards.ai",
    text: "Hardened it for real traffic with rate limits, spend caps with alerts, and a test suite before every deploy. Then forked the code into custom-cards.ai, a white-label card page for shops, and makemeabook.ai, an illustrated book from one name and one idea.",
    tools: ["security", "reliability", "Vitest", "white-label", "product"]
  },
  {
    project: "AI on every project",
    text: "Built .md note systems for AI on every project: a briefing file, a state file rewritten each session, an append-only log, and archive-before-delete. Wrote Claude Code skills on top, each validated before use.",
    tools: ["Claude Code", "markdown", "context engineering", "skills"]
  },
  {
    project: "glfanalytics.com",
    text: "Audited and rebuilt glfanalytics.com in Astro on Vercel with a live stats block that reads the Vercel Web Analytics API at build time.",
    tools: ["Astro", "Tailwind", "Vercel", "web development"]
  }
];

/*
  The cloud vocabulary (curated since S31). `label` is what the page shows;
  `weight` sets the size and tone: 5 is the one gold word, 1 the smallest.
  Change a word's size by changing its number. `pattern` is only the presence
  check against every bullet's text and tools (default = the label as a
  prefix at a word boundary, so "audit" also matches "audited"). Build throws
  if a term matches nothing, so the cloud never names a word the list dropped.
*/
export type CloudTerm = { label: string; weight: 1 | 2 | 3 | 4 | 5; pattern?: RegExp };

export const cloudTerms: CloudTerm[] = [
  { label: "data", weight: 5 },

  { label: "growth", weight: 4, pattern: /\bgrow/gi },
  { label: "reporting", weight: 4, pattern: /\breport(ing|s)?\b/gi },
  { label: "AI", weight: 4, pattern: /\bAI\b/g },

  { label: "SQL", weight: 3, pattern: /\bSQL\b/g },
  { label: "BigQuery", weight: 3 },
  { label: "analytics", weight: 3, pattern: /(?<!GLF )\banalytic/gi },
  { label: "strategy", weight: 3, pattern: /\bstrateg/gi },
  { label: "forecasting", weight: 3, pattern: /\bforecast/gi },
  { label: "automation", weight: 3, pattern: /\bautomat/gi },
  { label: "marketing", weight: 3 },
  { label: "Claude Code", weight: 3 },

  { label: "email", weight: 2 },
  { label: "SEO", weight: 2, pattern: /\bSEO\b/g },
  { label: "paid media", weight: 2, pattern: /\bpaid (media|social|search)\b/gi },
  { label: "eCommerce", weight: 2, pattern: /\becommerce\b/gi },
  { label: "training", weight: 2, pattern: /\btrain/gi },
  { label: "Python", weight: 2 },
  { label: "Klaviyo", weight: 2 },
  { label: "Snowflake", weight: 2 },
  { label: "Looker Studio", weight: 2 },
  { label: "Power Automate", weight: 2 },
  { label: "Uber Eats", weight: 2 },
  { label: "DoorDash", weight: 2 },
  { label: "operations", weight: 2, pattern: /\boperation/gi },
  { label: "audit", weight: 2 },

  { label: "GA4", weight: 1, pattern: /\bGA4\b/g },
  { label: "Google Tag Manager", weight: 1 },
  { label: "Google Ads", weight: 1 },
  { label: "Amazon", weight: 1 },
  { label: "Tableau", weight: 1 },
  { label: "Excel", weight: 1 },
  { label: "Google Sheets", weight: 1, pattern: /\bGoogle Sheet/gi },
  { label: "Copilot", weight: 1 },
  { label: "Vercel", weight: 1 },
  { label: "Next.js", weight: 1, pattern: /\bNext\.js/g },
  { label: "Astro", weight: 1, pattern: /\bAstro\b/g },
  { label: "Airtable", weight: 1 },
  { label: "OpenAI", weight: 1 },
  { label: "Gemini", weight: 1 },
  { label: "knowledge base", weight: 1 },
  { label: "product", weight: 1 },
  { label: "brand", weight: 1, pattern: /(?<!non-)\bbrand\b(?! lift)/gi },
  { label: "design", weight: 1, pattern: /\bdesign/gi },
  { label: "integrations", weight: 1, pattern: /\bintegrat/gi }
];
