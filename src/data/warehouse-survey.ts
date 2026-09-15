/*
  Copy for /design-your-data-warehouse. Edit words here only; the page and the
  client script read this file. Site register (POSITIONING.md): first person,
  plain nouns, no commas in headings or question titles, no em or en dashes.
  Prices never live here; they live in warehouse-catalog.ts with a source.
*/
import type { Answers } from "../lib/warehouseCalc";
import type { Layer } from "./warehouse-catalog";

export const meta = {
  slug: "design-your-data-warehouse",
  eyebrow: "Tool planner",
  title: "Design your data warehouse",
  description:
    "Answer a few questions about your business and get a suggested data warehouse and reporting stack with the monthly tool cost at list price.",
  lede:
    "Answer a few questions about your business. I'll suggest the tools for a data warehouse and reporting suite and what each one costs a month at list price. Swap any layer to see the tradeoff."
};

type Choice<V extends string> = { value: V; label: string };
type SingleQ<K extends keyof Answers> = { key: K; title: string; hint?: string; choices: Choice<Extract<Answers[K], string>>[] };

export const steps: {
  singles: SingleQ<"readers" | "size" | "systems" | "runner" | "ecosystem" | "freshness" | "askAi">[];
  kinds?: { title: string; hint: string; choices: Choice<Answers["kinds"][number]>[] };
}[] = [
  {
    singles: [
      {
        key: "readers",
        title: "How many people will read the reports?",
        choices: [
          { value: "1-5", label: "1 to 5" },
          { value: "6-15", label: "6 to 15" },
          { value: "16-50", label: "16 to 50" },
          { value: "50+", label: "More than 50" }
        ]
      },
      {
        key: "size",
        title: "How many locations or brands do you run?",
        choices: [
          { value: "1", label: "One" },
          { value: "2-10", label: "2 to 10" },
          { value: "11-50", label: "11 to 50" },
          { value: "50+", label: "More than 50" }
        ]
      }
    ]
  },
  {
    singles: [
      {
        key: "systems",
        title: "How many systems hold your data?",
        hint: "Count every tool with numbers you want in one place.",
        choices: [
          { value: "1-3", label: "1 to 3" },
          { value: "4-6", label: "4 to 6" },
          { value: "7-10", label: "7 to 10" },
          { value: "10+", label: "More than 10" }
        ]
      }
    ],
    kinds: {
      title: "Which kinds of systems?",
      hint: "Pick any that apply.",
      choices: [
        { value: "pos", label: "Point of sale" },
        { value: "store", label: "Online store" },
        { value: "marketplaces", label: "Marketplaces and delivery apps" },
        { value: "accounting", label: "Accounting" },
        { value: "payroll", label: "Payroll and scheduling" },
        { value: "ads", label: "Ads" },
        { value: "crm", label: "Email and CRM" },
        { value: "reviews", label: "Reviews and surveys" },
        { value: "spreadsheets", label: "Spreadsheets" }
      ]
    }
  },
  {
    singles: [
      {
        key: "runner",
        title: "Who runs it after launch?",
        choices: [
          { value: "none", label: "No one technical" },
          { value: "analyst", label: "An analyst who writes SQL" },
          { value: "engineer", label: "A data engineer" },
          { value: "ai", label: "AI tools like Claude Code or Codex" }
        ]
      },
      {
        key: "ecosystem",
        title: "What does your team already work in?",
        choices: [
          { value: "google", label: "Google Workspace" },
          { value: "microsoft", label: "Microsoft 365" },
          { value: "neither", label: "Neither or not sure" }
        ]
      }
    ]
  },
  {
    singles: [
      {
        key: "freshness",
        title: "How fresh do the numbers need to be?",
        choices: [
          { value: "daily", label: "Yesterday is fine" },
          { value: "hourly", label: "Every hour" },
          { value: "realtime", label: "As it happens" }
        ]
      },
      {
        key: "askAi",
        title: "Should people ask questions in plain English?",
        hint: "Type a question and get the number the reports show.",
        choices: [
          { value: "no", label: "Not needed" },
          { value: "few", label: "A few people" },
          { value: "everyone", label: "Everyone who reads reports" }
        ]
      }
    ]
  }
];

export const notesStep = {
  title: "Anything else I should know?",
  hint: "The decision this should help you make. Tools you already pay for. A budget. Optional.",
  placeholder: "We want one weekly number for every location and we already pay for Google Workspace."
};

export const ui = {
  next: "Next",
  back: "Back",
  submit: "Suggest my stack",
  restart: "Start over",
  stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
  loading: ["Reading your answers", "Matching tools to your team", "Checking list prices", "Adding up the monthly cost"],
  noScript: "This planner needs JavaScript to add up a stack. The questions are listed below."
};

export const result = {
  heading: "Your suggested stack",
  totalLabel: "Estimated monthly tool cost",
  sourceAi: "Picked by AI from your answers. Every price comes from the list below and not from the AI.",
  sourceRules: "Picked by rules from your answers.",
  swapLabel: "Swap",
  unpricedNote: (names: string) => `Not in the total because the vendor does not publish a price: ${names}.`,
  estimateNote: "Lines marked estimate are usage based and depend on how much data you move.",
  movesHeading: "What moves this number",
  moves: [
    "Seats. Reports and AI tools bill per person, so readers are usually the biggest line.",
    "Data size. Usage based databases and loaders grow with rows and refreshes.",
    "Freshness. Hourly or live data costs more to load and to query."
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
  warehouse: { name: "Database", what: "Where every source lands and the reports read from." },
  ingestion: { name: "Data loading", what: "How data gets from each system into the database." },
  modeling: { name: "Modeling", what: "The SQL that turns raw tables into clean metrics." },
  bi: { name: "Reports", what: "The dashboards your team opens." },
  observability: { name: "Monitoring", what: "Tests and alerts that catch a broken load before a bad number." },
  orchestration: { name: "Scheduling", what: "What runs the loads and the models on time." },
  ai: { name: "Plain English questions", what: "Ask a question and get the number the reports show." },
  build: { name: "Build and maintain with AI", what: "The coding seat that writes and updates the SQL and scripts." }
};
