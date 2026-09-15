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
*/
import type { Answers } from "../lib/warehouseCalc";
import type { Layer } from "./warehouse-catalog";

export const meta = {
  slug: "design-your-data-warehouse",
  eyebrow: "Free tool",
  title: "Design your data warehouse",
  description:
    "A free tool from GLF Analytics. Answer ten questions and get a data warehouse and reporting stack across eight layers with the monthly cost at list price. No sign-up.",
  lede:
    "Answer ten questions about your data. We suggest the tools for a data warehouse and reporting stack across eight layers and add up what they cost a month at list price. Swap any layer and the total changes.",
  promise: "Ten questions. About two minutes. No sign-up. The result is yours to keep.",
  independence:
    "No affiliate links and no vendor pays to appear. Every price is a public list price with its source and the date we checked it. GLF earns nothing from any tool on this page.",
  exampleLabel: "Example result",
  exampleNote: "A stack for a business with 6 to 15 data users and 4 to 6 sources. Your answers make your own."
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
    hint: "Stores, brands, regions, or entities. This sets how much data you move.",
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
    hint: "Any system with numbers you want in one place: your store, accounting, ad accounts, CRM.",
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
    hint: "Pick any that apply. Optional.",
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
    hint: "Natural language querying: ask a question about your data in plain English and get the answer.",
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
    hint: "Tool subscriptions only. Building it is separate.",
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
    hint: "The decision this should help you make. Tools you already pay for. Anything the questions missed. Optional.",
    placeholder: "We want one weekly number for every location and we already pay for Google Workspace."
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
  loading: ["Reading your answers", "Matching tools to your data", "Checking list prices", "Adding up the monthly cost"],
  loadingNote: "About 30 seconds.",
  credit: "A free tool from GLF Analytics",
  skip: "Skip to the summary",
  noScript: "This planner needs JavaScript to add up a stack."
};

/**
 * The reveal (S23). While the AI reads, one slide every five seconds says what is
 * being assembled. When the picks land, the same block shows each layer in turn
 * with its tool and reason, then the summary. Never a held result: the skip
 * button is on screen the whole time the picks are in hand.
 */
export const sequence = {
  waitLabel: "While the AI reads your answers",
  slides: [
    { title: "Reading your answers", text: "Your ten answers set the size of the data, who reads it, and who runs it after launch." },
    { title: "Data loading", text: "Every source lands in one database on a schedule. Nobody pastes a spreadsheet." },
    { title: "Modeling and reports", text: "SQL turns the raw tables into clean metrics. The dashboards read from those and never from the source." },
    { title: "Monitoring", text: "Tests run on every load. A broken number is caught before anyone sees it." },
    { title: "AI in the stack", text: "AI writes and updates the SQL. A person reviews every change before it ships." },
    { title: "Checking list prices", text: "Every price on the next screen is a public list price with a source and a date." }
  ],
  revealLabel: (n: number, total: number) => `Layer ${n} of ${total}`,
  notNeeded: "Not needed for your answers"
};

export const result = {
  summaryHeading: "Summary",
  detailsHeading: "Details",
  totalLabel: "Estimated tool cost",
  perMonth: "a month",
  notNeeded: "Not needed",
  budget: {
    fits: "Fits your monthly budget.",
    stretch: "The low end fits your budget. The high end runs above it.",
    over: "This stack runs above your monthly budget. Swap a layer in the details to bring it down."
  },
  sourceAi: "Picked by AI from your answers. Every price comes from the list below and not from the AI.",
  smallStack: "At this size a spreadsheet and one report may be enough for a while. This is the smallest step up.",
  runs: {
    none: "Who runs it: nobody on your team writes code, so the loads and the fixes need a partner or an AI seat with a person reviewing.",
    analyst: "Who runs it: your analyst owns the SQL. The loading and scheduling layers stay simple so one person can hold them.",
    engineer: "Who runs it: your engineer owns every layer. Code-first tools fit that team.",
    ai: "Who runs it: an AI coding seat writes and updates the SQL and scripts. A person reviews every change before it ships."
  },
  sourceRules: "Picked by rules from your answers.",
  sourcePending: "Picked by rules for now. The AI read is on its way, usually about 30 seconds.",
  swapped: (n: number) => (n === 1 ? "You swapped one layer." : `You swapped ${n} layers.`),
  swapLabel: "Swap",
  mentioned: {
    missing: (name: string) => `You mentioned ${name}. It is not in our catalog yet, so we priced the closest option. Ask for the report and we will run the numbers with ${name}.`,
    kept: (name: string) => `You mentioned ${name}, so we kept it in the stack.`,
    swappedOut: (name: string, picked: string) => `You mentioned ${name}. We priced ${picked} instead. Swap it back in the details if you would rather.`
  },
  tradeoffLabel: "Tradeoff",
  cardHeading: "Your stack card",
  cardNote: "One image of the stack with the monthly cost. Download it and send it on.",
  downloadCard: "Download the card",
  financeHeading: "For the finance read",
  finance: {
    seats: (amount: string) => `Grows with people: ${amount} a month in seats.`,
    usage: (amount: string) => `Grows with data: ${amount} a month in usage.`,
    flat: (amount: string) => `Flat: ${amount} a month.`,
    openSource: (n: number, total: number) => `Open source layers: ${n} of ${total}. Those stay yours if you stop paying a vendor.`,
    upkeep: (lo: number, hi: number) => `Upkeep: about ${lo} to ${hi} hours a week once it runs. Our estimate from your sources, refresh, and data size.`
  },
  utilities: {
    copyLink: "Copy link",
    copyMd: "Copy as Markdown",
    copyClaude: "Copy a CLAUDE.md",
    openClaude: "Open in Claude",
    copied: "Copied"
  },
  reportLink: "Get this stack as an email report",
  unpricedNote: (names: string) => `Not in the total because the vendor does not publish a price: ${names}.`,
  estimateNote: "Lines marked est. are usage based and depend on how much data you move.",
  movesHeading: "What moves this number",
  moves: [
    "Seats. Reports and LLM tools bill per user, so data users are usually the biggest line.",
    "Data size. Usage based databases and loaders grow with rows and refreshes.",
    "Freshness. Hourly or real time data costs more to load and to query."
  ],
  listPriceNote:
    "These are public list prices for the tools, checked on the dates below. They are not a quote. Building the warehouse and running it is a separate conversation.",
  sourcesHeading: "Where the prices come from",
  emailLabel: "Email us this stack",
  emailSubject: "My data warehouse stack",
  closing: "Want help building it?"
};

/** The delayed offer (S23): ten seconds after the result, once a session, dismissable. */
export const offer = {
  label: "Your stack report",
  line: "We will email this stack with the tradeoff on every layer, what to build first, the upkeep estimate, and how a team like ours would run it.",
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
    "AI writes the SQL and the scripts. Each change passes four gates before a person reads it: it compiles, the tests pass, a dry run completes, and the lineage holds. A failure goes back to the AI and not to your team.",
    "A person reviews every change and owns the metric definitions. The AI never writes to production on its own.",
    "The tests are part of the deliverable. A bad number is caught on the load and not in the meeting.",
    "You keep the code, the runbook, and the credentials. Your team runs it. We stay on call if you want us to."
  ]
};

export const who = {
  heading: "Who we are",
  text: "GLF Analytics is Gabriel Freeman's practice in Los Angeles. Since 2017 we have built the reporting and forecasts that CEOs and their teams plan against, and we bring in specialists when a build needs them. Every report request from this page comes to Gabriel."
};

export const faq = [
  {
    q: "Is this free?",
    a: "Yes. No sign-up, no trial, no card. The result, the stack card, and the files are yours to keep."
  },
  {
    q: "Does GLF earn anything from the tools it suggests?",
    a: "No. There are no affiliate links and no vendor pays to appear. We earn our living building and running stacks like these for clients."
  },
  {
    q: "How accurate are the prices?",
    a: "Every price is a public list price with its source and the date we checked it. Usage based lines are estimates for your data size and say so. They are not a quote and vendor pricing changes, so read the source before you buy."
  },
  {
    q: "Do I need a data warehouse at all?",
    a: "Not always. Under about five data users and three sources, a spreadsheet and one report can carry a business for a while. The planner says so when your answers land there."
  },
  {
    q: "What happens when I ask for the report?",
    a: "One email arrives with your stack, the tradeoffs, what to build first, and how we would build and run it. You are on no list unless you tick the box. Gabriel reads every request."
  }
];

export const traitLabels = {
  openSource: "Open source",
  mcp: "Claude Code and Codex ready",
  browserEdit: "Edit tables in the browser",
  rowSecurity: "Row level security",
  codeFirst: "Lives in code"
} as const;

export const layerCopy: Record<Layer, { name: string; what: string }> = {
  warehouse: { name: "Database", what: "Where every data source lands and the reports read from." },
  ingestion: { name: "Data loading", what: "How data gets from each source into the database." },
  modeling: { name: "Modeling", what: "The SQL that turns raw tables into clean metrics." },
  bi: { name: "Reports", what: "The dashboards your data users open." },
  observability: { name: "Monitoring", what: "Tests and alerts that catch a broken load before a bad number." },
  orchestration: { name: "Scheduling", what: "What runs the loads and the models on time." },
  ai: { name: "LLM and natural language queries", what: "Ask a question about your data in plain English and get the answer." },
  build: { name: "Build and maintain with AI", what: "The coding seat that writes and updates the SQL and scripts." }
};
