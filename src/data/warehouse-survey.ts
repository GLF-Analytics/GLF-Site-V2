/*
  Copy for /design-your-data-warehouse. Edit words here only; the page, the
  client script, and the report email read this file. Voice on THIS page (S23,
  9/15/26, Gabriel's call): GLF Analytics "we", the company voice, never a
  headcount claim; the page names Gabriel at the bottom. The rest of the site
  register still holds: plain nouns, no commas in headings or question titles,
  no em or en dashes, no exclamation points, no credibility labels, no prices
  for GLF work. Tool prices never live here; they live in warehouse-catalog.ts
  with a source.

  S17 (9/15/26): one question per screen, in data language, plus the budget.
  Option values are unchanged from S15 so shared links and scenarios still work.

  S25 (9/15/26, Gabriel's read: "too much text by a lot"): the page copy cut by
  about 40%. Four slides instead of six, no layer-by-layer reveal (one GLF
  sentence instead), the result is one dashboard. The strings the report email
  still needs but the page no longer shows live under `report`. The build
  prints the word count of the page copy and fails above the cap.
*/
import type { Answers } from "../lib/warehouseCalc";
import type { Layer } from "./warehouse-catalog";

export const meta = {
  slug: "design-your-data-warehouse",
  eyebrow: "Free tool",
  title: "Design your data warehouse",
  description:
    "A free tool from GLF Analytics. Answer ten questions and get a data warehouse and reporting stack with the monthly cost at list price. No sign-up.",
  lede: "Answer ten questions about your data. We suggest the tools for a warehouse and reporting stack and add up the monthly cost at list price.",
  promise: "Two minutes. No sign-up. Swap any layer and the total moves."
};

type Choice<V extends string> = { value: V; label: string };
type SingleKey = "readers" | "size" | "systems" | "runner" | "ecosystem" | "freshness" | "askAi" | "budget";

export type SingleQuestion = { type: "single"; key: SingleKey; title: string; hint?: string; choices: Choice<string>[] };
export type MultiQuestion = { type: "multi"; key: "kinds"; title: string; hint: string; choices: Choice<Answers["kinds"][number]>[] };
export type NotesQuestion = { type: "notes"; key: "notes"; title: string; hint: string; placeholder: string };
export type Question = SingleQuestion | MultiQuestion | NotesQuestion;

export const questions: Question[] = [
  {
    type: "single",
    key: "readers",
    title: "How many data users?",
    hint: "People who open reports or dashboards.",
    choices: [
      { value: "1-5", label: "1 to 5" },
      { value: "6-15", label: "6 to 15" },
      { value: "16-50", label: "16 to 50" },
      { value: "50+", label: "More than 50" }
    ]
  },
  {
    type: "single",
    key: "size",
    title: "How many locations or business units send data?",
    choices: [
      { value: "1", label: "One" },
      { value: "2-10", label: "2 to 10" },
      { value: "11-50", label: "11 to 50" },
      { value: "50+", label: "More than 50" }
    ]
  },
  {
    type: "single",
    key: "systems",
    title: "How many data sources?",
    hint: "Your store, accounting, ad accounts, CRM.",
    choices: [
      { value: "1-3", label: "1 to 3" },
      { value: "4-6", label: "4 to 6" },
      { value: "7-10", label: "7 to 10" },
      { value: "10+", label: "More than 10" }
    ]
  },
  {
    type: "multi",
    key: "kinds",
    title: "What kinds of data sources?",
    hint: "Optional.",
    choices: [
      { value: "pos", label: "Point of sale" },
      { value: "store", label: "Ecommerce platform" },
      { value: "marketplaces", label: "Marketplaces" },
      { value: "accounting", label: "Accounting and ERP" },
      { value: "payroll", label: "Payroll and HR" },
      { value: "ads", label: "Ad platforms" },
      { value: "crm", label: "CRM and email" },
      { value: "reviews", label: "Surveys and reviews" },
      { value: "spreadsheets", label: "Spreadsheets and files" }
    ]
  },
  {
    type: "single",
    key: "runner",
    title: "Who maintains the data stack after launch?",
    choices: [
      { value: "none", label: "No technical team" },
      { value: "analyst", label: "A data analyst who writes SQL" },
      { value: "engineer", label: "A data engineer" },
      { value: "ai", label: "AI coding tools like Claude Code or Codex" }
    ]
  },
  {
    type: "single",
    key: "ecosystem",
    title: "Which cloud does your team already use?",
    choices: [
      { value: "google", label: "Google Workspace or Google Cloud" },
      { value: "microsoft", label: "Microsoft 365 or Azure" },
      { value: "neither", label: "Neither or not sure" }
    ]
  },
  {
    type: "single",
    key: "freshness",
    title: "How fresh does the data need to be?",
    choices: [
      { value: "daily", label: "As of yesterday (daily refresh)" },
      { value: "hourly", label: "Within the hour (hourly refresh)" },
      { value: "realtime", label: "Real time (streaming)" }
    ]
  },
  {
    type: "single",
    key: "askAi",
    title: "Do you want to connect your data to an LLM?",
    hint: "Ask a question in plain English and get the answer.",
    choices: [
      { value: "no", label: "Not now" },
      { value: "few", label: "For a few analysts or leaders" },
      { value: "everyone", label: "For every data user" }
    ]
  },
  {
    type: "single",
    key: "budget",
    title: "What is your monthly budget for tools?",
    hint: "Tool subscriptions only.",
    choices: [
      { value: "under100", label: "Under $100" },
      { value: "100-500", label: "$100 to $500" },
      { value: "500-2000", label: "$500 to $2,000" },
      { value: "2000+", label: "More than $2,000" },
      { value: "unsure", label: "Not sure yet" }
    ]
  },
  {
    type: "notes",
    key: "notes",
    title: "Anything else we should know?",
    hint: "Tools you already pay for. Anything we missed. Optional.",
    placeholder: "We already pay for Google Workspace and want one weekly number per location."
  }
];

export const ui = {
  next: "Next",
  back: "Back",
  submit: "Suggest my stack",
  restart: "Start over",
  edit: "Edit answers",
  pickToContinue: "Pick one to continue",
  questionOf: (n: number, total: number) => `Question ${n} of ${total}`,
  loading: "Adding up the monthly cost",
  loadingNote: "About 30 seconds.",
  credit: "A free tool from GLF Analytics",
  skip: "Skip to the result",
  noScript: "This planner needs JavaScript to add up a stack."
};

/**
 * The wait (S23, cut S25). While the AI reads, one slide every six seconds
 * says what is being assembled. When the picks land, one sentence about GLF
 * Analytics, then the result. No layer-by-layer preview any more: the result
 * is the reveal. The skip button is on screen once the picks are in hand.
 */
export const sequence = {
  waitLabel: "While the AI reads your answers",
  slides: [
    { title: "Reading your answers", text: "Your answers set the size of the data, who reads it, and who runs it." },
    { title: "Loading and modeling", text: "Every source lands in one database on a schedule. SQL turns it into clean metrics." },
    { title: "Monitoring and AI", text: "Tests run on every load. AI writes the SQL and a person reviews every change." },
    { title: "Checking list prices", text: "Every price is a public list price with a source and a date." }
  ],
  closingLabel: "Your stack is ready",
  closing: { title: "Built by GLF Analytics", text: "Since 2017 we have built the reporting that CEOs and their teams plan against." }
};

/** The result: one dashboard (S25). */
export const result = {
  heading: "Your stack",
  perMonth: "a month at list price",
  notNeeded: "Not needed",
  budget: {
    fits: "Fits your monthly budget.",
    stretch: "The low end fits your budget. The high end runs above it.",
    over: "Above your monthly budget. Swap a layer to bring it down."
  },
  smallStack: "At this size a spreadsheet and one report may be enough for a while. This is the smallest step up.",
  runs: {
    none: "Nobody on your team writes code, so the loads and the fixes need a partner or an AI seat with a person reviewing.",
    analyst: "Your analyst owns the SQL, so the loading and scheduling layers stay simple.",
    engineer: "Your engineer owns every layer. Code-first tools fit.",
    ai: "An AI coding seat writes the SQL and the scripts. A person reviews every change."
  },
  mentioned: {
    missing: (name: string) => `You mentioned ${name}. It is not in our catalog yet, so we priced the closest option. Ask for the report and we will run the numbers with ${name}.`,
    kept: (name: string) => `You mentioned ${name}, so we kept it in the stack.`,
    swappedOut: (name: string, picked: string) => `You mentioned ${name}. We priced ${picked} instead. Swap it back if you would rather.`
  },
  swapHint: "Tap any tool to swap it. The total moves.",
  swapLabel: "Swap",
  needsPick: "Needs another pick",
  noteAi: "Picked by AI from your answers. Every price is a public list price with a source below.",
  noteRules: "Picked by rules from your answers. Every price is a public list price with a source below.",
  notePending: "Picked by rules for now. The AI read lands in about 30 seconds.",
  swapped: (n: number) => (n === 1 ? "You swapped one layer." : `You swapped ${n} layers.`),
  estimateNote: "Lines marked est. depend on how much data you move.",
  unpricedNote: (names: string) => `Not in the total because the vendor does not publish a price: ${names}.`,
  downloadCard: "Download the card",
  utilities: {
    copyLink: "Copy link",
    copyMd: "Copy as Markdown",
    copyClaude: "Copy a CLAUDE.md",
    openClaude: "Open in Claude",
    copied: "Copied"
  },
  reportLink: "Get this stack as an email report",
  sourcesHeading: "Where the prices come from",
  emailLabel: "Email us this stack",
  emailSubject: "My data warehouse stack",
  closing: "Want help building it?"
};

/** Strings the report email still uses and the page no longer shows (S25). */
export const report = {
  totalLabel: "Estimated tool cost",
  financeHeading: "For the finance read",
  finance: {
    seats: (amount: string) => `Grows with people: ${amount} a month in seats.`,
    usage: (amount: string) => `Grows with data: ${amount} a month in usage.`,
    flat: (amount: string) => `Flat: ${amount} a month.`,
    openSource: (n: number, total: number) => `Open source layers: ${n} of ${total}. Those stay yours if you stop paying a vendor.`,
    upkeep: (lo: number, hi: number) => `Upkeep: about ${lo} to ${hi} hours a week once it runs. Our estimate from your sources, refresh, and data size.`
  },
  movesHeading: "What moves this number",
  moves: [
    "Seats. Reports and LLM tools bill per user, so data users are usually the biggest line.",
    "Data size. Usage based databases and loaders grow with rows and refreshes.",
    "Freshness. Hourly or real time data costs more to load and to query."
  ],
  listPriceNote:
    "These are public list prices for the tools, checked on the dates below. They are not a quote. Building the warehouse and running it is a separate conversation."
};

/** The delayed offer (S23): ten seconds after the result, once a session, dismissable. */
export const offer = {
  label: "Your stack report",
  line: "We will email you this stack with the tradeoffs and what to build first.",
  emailLabel: "Email",
  placeholder: "you@company.com",
  send: "Send the report",
  sending: "Sending",
  consent: "One email with the report. No list unless you tick the box.",
  optIn: "Occasional notes on data stack costs and tools",
  dismiss: "No thanks",
  close: "Close",
  sent: "Sent. Check your inbox in a minute.",
  sentDuplicate: "Already on its way. Check your inbox.",
  badEmail: "Check the address.",
  rate: "Too many sends from this connection. Try again in a few minutes.",
  failed: "We could not send it just now. Email us and we will send it by hand.",
  purposeQuestion: "One more thing if you like. What is this stack for?",
  purposes: [
    { value: "deciding", label: "Deciding on a build" },
    { value: "replacing", label: "Replacing tools we have" },
    { value: "diy", label: "Building it ourselves" },
    { value: "curious", label: "Just curious" }
  ],
  purposeThanks: "Noted. Thank you."
};

/** Under the tool: how a stack like this runs, who we are, the questions people ask. */
export const learn = {
  heading: "How a stack like this runs",
  lines: [
    "Every source loads into one database on a schedule and the reports read from there.",
    "AI writes the SQL and the scripts. A person reviews every change before it ships and owns the metric definitions.",
    "You keep the code, the runbook, and the credentials. Your team runs it. We stay on call if you want us to."
  ]
};

export const who = {
  heading: "Who we are",
  text: "GLF Analytics is Gabriel Freeman's practice in Los Angeles. Since 2017 we have built the reporting and forecasts that CEOs and their teams plan against. Every report request from this page comes to Gabriel."
};

export const faq = [
  {
    q: "Is this free?",
    a: "Yes. No sign-up, no trial, no card. The result and the card are yours to keep."
  },
  {
    q: "Does GLF earn anything from the tools it suggests?",
    a: "No. There are no affiliate links and no vendor pays to appear. We earn our living building and running stacks like these for clients."
  },
  {
    q: "How accurate are the prices?",
    a: "Every price is a public list price with its source and the date we checked it. Usage based lines are estimates and say so. They are not a quote, so read the source before you buy."
  }
];

export const traitLabels = {
  openSource: "Open source",
  mcp: "Claude Code and Codex ready",
  browserEdit: "Edit tables in the browser",
  rowSecurity: "Row level security",
  codeFirst: "Lives in code"
} as const;

/** `short` (S25) is the tile label on the dashboard where the full name wraps; the report and the Markdown use `name`. */
export const layerCopy: Record<Layer, { name: string; what: string; short?: string }> = {
  warehouse: { name: "Database", what: "Where every data source lands and the reports read from." },
  ingestion: { name: "Data loading", what: "How data gets from each source into the database." },
  modeling: { name: "Modeling", what: "The SQL that turns raw tables into clean metrics." },
  bi: { name: "Reports", what: "The dashboards your data users open." },
  observability: { name: "Monitoring", what: "Tests and alerts that catch a broken load before a bad number." },
  orchestration: { name: "Scheduling", what: "What runs the loads and the models on time." },
  ai: { name: "LLM and natural language queries", short: "LLM questions", what: "Ask a question about your data in plain English and get the answer." },
  build: { name: "Build and maintain with AI", short: "AI build seat", what: "The coding seat that writes and updates the SQL and scripts." }
};
