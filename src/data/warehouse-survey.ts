/*
  Copy for /design-your-data-warehouse. Edit words here only; the page and the
  client script read this file. Site register (POSITIONING.md): first person,
  plain nouns, no commas in headings or question titles, no em or en dashes.
  Prices never live here; they live in warehouse-catalog.ts with a source.

  S17 (9/15/26): one question per screen, in data language, plus the budget.
  Option values are unchanged from S15 so shared links and scenarios still work.
*/
import type { Answers } from "../lib/warehouseCalc";
import type { Layer } from "./warehouse-catalog";

export const meta = {
  slug: "design-your-data-warehouse",
  eyebrow: "Tool planner",
  title: "Design your data warehouse",
  description:
    "Answer a few questions about your data and get a suggested data warehouse and reporting stack with the monthly tool cost at list price.",
  lede:
    "Answer ten short questions about your data. I'll suggest the tools for a data warehouse and reporting suite and what each one costs a month at list price. Swap any layer to see the tradeoff."
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
    title: "Anything else I should know?",
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
  loadingNote: "The AI read usually takes about 30 seconds.",
  noScript: "This planner needs JavaScript to add up a stack."
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
  sourceRules: "Picked by rules from your answers.",
  sourcePending: "Picked by rules for now. The AI read is on its way, usually about 30 seconds.",
  swapped: (n: number) => (n === 1 ? "You swapped one layer." : `You swapped ${n} layers.`),
  swapLabel: "Swap",
  mentioned: {
    missing: (name: string) => `You mentioned ${name}. It is not in my catalog yet, so I priced the closest option. Email me and I will run the numbers with ${name}.`,
    kept: (name: string) => `You mentioned ${name}, so I kept it in the stack.`,
    swappedOut: (name: string, picked: string) => `You mentioned ${name}. I priced ${picked} instead. Swap it back in the details if you would rather.`
  },
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
  emailLabel: "Email me this stack",
  emailSubject: "My data warehouse stack",
  closing: "Want help building it?"
};

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
