/*
  The tool catalog for /design-your-data-warehouse. Every price is a public list
  price with its vendor page and the date it was read. The research record
  (with exact vendor wording, secondary sources, and what is not published)
  lives in the private docs: GLF Business Context/glf website/research/
  warehouse-tool-prices-2026-09.md. Update both together.

  Rules for this file:
  - Never estimate an unpublished price. Use { kind: "notPublished" }.
  - "volume" lines are usage based: the four [low, high] pairs are arithmetic on
    the published unit price for a small, medium, large, and very large
    business, and the note says how. The page labels them as estimates.
  - secondary: true when the number came from a third party because the vendor
    page would not show it. Recheck those in a browser before linking the page.
  - No client, lead, or brand from Gabriel's work appears here.
*/
import type { Answers } from "../lib/warehouseCalc";

export const LAYERS = ["warehouse", "ingestion", "modeling", "bi", "observability", "orchestration", "ai", "build"] as const;
export type Layer = (typeof LAYERS)[number];

export type SeatTier = { maxSeats?: number; base?: number; included?: number; perSeat: number; minSeats?: number };
type Pair = [number, number];

export type Price =
  | { kind: "free" }
  | { kind: "flat"; monthly: number }
  | { kind: "seatTiers"; basis: "readers" | "ai" | "builders"; tiers: SeatTier[] }
  | { kind: "volume"; monthly: [Pair, Pair, Pair, Pair]; note: string }
  | { kind: "sources"; tiers: { maxSources: number; monthly: number }[] }
  | { kind: "included"; with: string }
  | { kind: "notPublished" };

export type Tool = {
  id: string;
  layer: Layer;
  name: string;
  tier?: string;
  price: Price;
  source: string;
  checked: string;
  secondary?: boolean;
  why: string;
  tradeoff: string;
  traits: { openSource?: boolean; mcp?: boolean; browserEdit?: boolean; rowSecurity?: boolean; codeFirst?: boolean };
  fit: {
    ecosystem?: Answers["ecosystem"][];
    volume?: number[];
    runner?: Answers["runner"][];
    freshness?: Answers["freshness"][];
  };
  requires?: { layer: Layer; ids: string[] };
};

const ALL_VOLUMES = [0, 1, 2, 3];

export const catalog: Tool[] = [
  // ---------------- warehouse ----------------
  {
    id: "supabase",
    layer: "warehouse",
    name: "Supabase Postgres",
    tier: "Pro",
    price: {
      kind: "volume",
      monthly: [[25, 25], [25, 30], [30, 75], [75, 125]],
      note: "Pro $25 with a $10 compute credit. Micro compute is covered; Small $15, Medium $60, Large $110 less the credit."
    },
    source: "https://supabase.com/pricing",
    checked: "2026-09-11",
    why: "Plain Postgres with a table editor a non engineer can use and room to grow.",
    tradeoff: "Compute is a size you pick, so very large query loads mean a bigger instance.",
    traits: { openSource: true, mcp: true, browserEdit: true, rowSecurity: true, codeFirst: true },
    fit: { ecosystem: ["neither"], volume: [0, 1, 2], runner: ["none", "analyst", "ai"], freshness: ["daily", "hourly", "realtime"] }
  },
  {
    id: "bigquery",
    layer: "warehouse",
    name: "Google BigQuery",
    tier: "On demand",
    price: {
      kind: "volume",
      monthly: [[0, 0], [0, 5], [0, 25], [25, 100]],
      note: "First 1 TiB of queries and 10 GiB of storage free each month, then $6.25 per TiB scanned and about $0.023 per GiB of active storage."
    },
    source: "https://cloud.google.com/bigquery/pricing",
    checked: "2026-09-13",
    why: "Close to free at this size and it sits next to the Google tools your team already uses.",
    tradeoff: "No spreadsheet style editing in the console. Fixing a value means SQL.",
    traits: { mcp: true, rowSecurity: true, codeFirst: true },
    fit: { ecosystem: ["google"], volume: ALL_VOLUMES, runner: ["analyst", "engineer", "ai"], freshness: ["daily", "hourly"] }
  },
  {
    id: "snowflake",
    layer: "warehouse",
    name: "Snowflake",
    tier: "Standard",
    price: {
      kind: "volume",
      monthly: [[30, 60], [60, 120], [120, 360], [360, 1200]],
      note: "About $2 per credit on Standard (secondary). X-Small uses 1 credit an hour and Small 2 (vendor docs). Estimates run 15 to 60 warehouse hours a month for small and up to about 300 Small hours for very large."
    },
    source: "https://docs.snowflake.com/en/user-guide/warehouses-overview",
    checked: "2026-09-14",
    secondary: true,
    why: "Built for big data volumes and many teams querying at once.",
    tradeoff: "Usage billing adds up with every hour a warehouse runs, and it is more than a small team needs.",
    traits: { mcp: true, codeFirst: true },
    fit: { ecosystem: ["neither"], volume: [2, 3], runner: ["engineer"], freshness: ["hourly", "realtime"] }
  },
  {
    id: "motherduck",
    layer: "warehouse",
    name: "MotherDuck",
    tier: "Lite then Business",
    price: {
      kind: "volume",
      monthly: [[0, 0], [0, 25], [250, 300], [250, 500]],
      note: "Lite is $0 with 10 GB and 10 compute hours included, then $0.60 per compute hour and $0.04 per GB. Business is $250 a month plus usage for up to 10 users."
    },
    source: "https://motherduck.com/product/pricing/",
    checked: "2026-09-14",
    why: "Fast analytics on DuckDB with a free tier that covers a small business.",
    tradeoff: "A younger service. Past three users it moves to a $250 plan.",
    traits: { mcp: true, codeFirst: true },
    fit: { ecosystem: ["neither"], volume: [0], runner: ["analyst", "ai"], freshness: ["daily"] }
  },
  {
    id: "fabric",
    layer: "warehouse",
    name: "Microsoft Fabric",
    tier: "F2 pay as you go",
    price: {
      kind: "volume",
      monthly: [[263, 263], [263, 263], [263, 526], [526, 1051]],
      note: "$0.18 per capacity unit hour in US East (Microsoft price list). F2 is 2 units, about $263 a month always on; F4 and F8 double it. Pausing lowers it."
    },
    source: "https://learn.microsoft.com/en-us/fabric/enterprise/licenses",
    checked: "2026-09-14",
    why: "The warehouse that lives inside Microsoft 365 with Power BI on top.",
    tradeoff: "Below F64 every report viewer still needs a Power BI license.",
    traits: { rowSecurity: true },
    fit: { ecosystem: ["microsoft"], volume: [1, 2, 3], runner: ["analyst", "engineer"], freshness: ["daily", "hourly"] }
  },
  {
    id: "azuresql",
    layer: "warehouse",
    name: "Azure SQL Database",
    tier: "Basic to serverless",
    price: {
      kind: "volume",
      monthly: [[5, 15], [15, 15], [15, 190], [190, 381]],
      note: "Basic $0.161 a day and S0 $0.4839 a day (Microsoft price list). Serverless is $0.521758 per vCore hour, about $190 a month at half a vCore always on."
    },
    source: "https://azure.microsoft.com/en-us/pricing/details/azure-sql-database/single/",
    checked: "2026-09-14",
    why: "A small SQL Server database that fits a Microsoft shop without a capacity bill.",
    tradeoff: "It is a transactional database, so heavy reporting needs a bigger tier.",
    traits: { rowSecurity: true, codeFirst: true },
    fit: { ecosystem: ["microsoft"], volume: [0, 1], runner: ["analyst", "ai"], freshness: ["daily", "hourly"] }
  },

  // ---------------- ingestion ----------------
  {
    id: "scripts",
    layer: "ingestion",
    name: "Python scripts on GitHub Actions",
    tier: "Written with Claude Code or Codex",
    price: { kind: "free" },
    source: "https://github.com/pricing",
    checked: "2026-09-11",
    why: "Each source gets a small script you own, which fits systems no connector covers.",
    tradeoff: "No vendor to call when an API changes. Someone has to keep the scripts current.",
    traits: { mcp: true, codeFirst: true },
    fit: { volume: [0, 1, 2], runner: ["engineer", "ai"], freshness: ["daily", "hourly"] }
  },
  {
    id: "dlt",
    layer: "ingestion",
    name: "dlt",
    tier: "Open source library",
    price: { kind: "free" },
    source: "https://dlthub.com/pricing",
    checked: "2026-09-14",
    why: "A free Python library that handles paging, schema changes, and incremental loads.",
    tradeoff: "Still code. It needs somewhere to run and someone who reads Python.",
    traits: { openSource: true, codeFirst: true },
    fit: { volume: ALL_VOLUMES, runner: ["engineer", "ai"], freshness: ["daily", "hourly"] }
  },
  {
    id: "airbyte",
    layer: "ingestion",
    name: "Airbyte Cloud",
    price: {
      kind: "volume",
      monthly: [[10, 15], [15, 60], [60, 300], [300, 1500]],
      note: "$2.50 per credit and 6 credits per million API rows, so $15 per million rows, from $10 a month. Estimates run under 1 million rows a month for small and up to 100 million for very large."
    },
    source: "https://airbyte.com/pricing",
    checked: "2026-09-11",
    why: "Point and click connectors for common sources with no code to maintain.",
    tradeoff: "Niche systems may not have a connector, and the bill grows with rows.",
    traits: { openSource: true, mcp: true },
    fit: { volume: [0, 1, 2], runner: ["none", "analyst"], freshness: ["daily", "hourly"] }
  },
  {
    id: "fivetran",
    layer: "ingestion",
    name: "Fivetran",
    tier: "Standard",
    price: { kind: "notPublished" },
    source: "https://www.fivetran.com/pricing",
    checked: "2026-09-14",
    why: "The most complete managed connector catalog with little to maintain.",
    tradeoff: "Free up to 500,000 changed rows a month. Past that the per row rate is quoted, not listed.",
    traits: { mcp: true },
    fit: { volume: [2, 3], runner: ["none"], freshness: ["hourly", "realtime"] }
  },
  {
    id: "portable",
    layer: "ingestion",
    name: "Portable",
    price: { kind: "sources", tiers: [{ maxSources: 6, monthly: 1800 }, { maxSources: 15, monthly: 2800 }] },
    source: "https://portable.io/pricing",
    checked: "2026-09-11",
    why: "Managed connectors for long tail systems, built on request.",
    tradeoff: "A flat monthly fee that is several times the rest of a small stack.",
    traits: {},
    fit: { volume: [1, 2, 3], runner: ["none"], freshness: ["daily"] }
  },

  // ---------------- modeling ----------------
  {
    id: "dbtcore",
    layer: "modeling",
    name: "dbt Core",
    tier: "Open source",
    price: { kind: "free" },
    source: "https://www.getdbt.com/pricing",
    checked: "2026-09-11",
    why: "SQL models with tests and docs in your own repo, the standard way to define metrics once.",
    tradeoff: "You run it yourself, so scheduling and hosting are on you.",
    traits: { openSource: true, mcp: true, codeFirst: true },
    fit: { volume: ALL_VOLUMES, runner: ["analyst", "engineer", "ai"] }
  },
  {
    id: "dbtplatform",
    layer: "modeling",
    name: "dbt platform",
    tier: "Starter",
    price: { kind: "seatTiers", basis: "builders", tiers: [{ maxSeats: 5, perSeat: 100 }] },
    source: "https://www.getdbt.com/pricing",
    checked: "2026-09-11",
    why: "The same dbt models with a hosted editor, scheduler, and the semantic layer API.",
    tradeoff: "$100 per developer seat for things dbt Core plus a free scheduler can do.",
    traits: { mcp: true, codeFirst: true },
    fit: { volume: [1, 2, 3], runner: ["none", "analyst"] }
  },
  {
    id: "sqlmesh",
    layer: "modeling",
    name: "SQLMesh",
    tier: "Open source",
    price: { kind: "free" },
    source: "https://sqlmesh.readthedocs.io/en/stable/cloud/cloud_index/",
    checked: "2026-09-14",
    secondary: true,
    why: "Open source SQL modeling with built in change plans and column level lineage.",
    tradeoff: "A smaller community than dbt and fewer people who already know it.",
    traits: { openSource: true, codeFirst: true },
    fit: { volume: [2, 3], runner: ["engineer"] }
  },
  {
    id: "dataform",
    layer: "modeling",
    name: "Dataform",
    price: { kind: "free" },
    source: "https://cloud.google.com/dataform/pricing",
    checked: "2026-09-14",
    why: "Free SQL modeling built into BigQuery with nothing extra to host.",
    tradeoff: "Works with BigQuery only.",
    traits: { codeFirst: true },
    fit: { ecosystem: ["google"], volume: ALL_VOLUMES, runner: ["analyst", "engineer"] },
    requires: { layer: "warehouse", ids: ["bigquery"] }
  },
  {
    id: "cube",
    layer: "modeling",
    name: "Cube Cloud",
    tier: "Starter",
    price: { kind: "seatTiers", basis: "builders", tiers: [{ perSeat: 40 }] },
    source: "https://cube.dev/pricing",
    checked: "2026-09-11",
    why: "A semantic layer that serves one set of metric definitions to every tool and AI.",
    tradeoff: "A second modeling language next to your SQL.",
    traits: { openSource: true, rowSecurity: true, codeFirst: true },
    fit: { volume: [2, 3], runner: ["engineer"] }
  },

  // ---------------- bi ----------------
  {
    id: "metabase",
    layer: "bi",
    name: "Metabase Cloud",
    tier: "Starter then Pro",
    price: {
      kind: "seatTiers",
      basis: "readers",
      tiers: [
        { maxSeats: 40, base: 100, included: 5, perSeat: 6 },
        { base: 575, included: 10, perSeat: 12 }
      ]
    },
    source: "https://www.metabase.com/pricing/",
    checked: "2026-09-11",
    why: "Reports anyone can click through, with a question builder and an AI assistant.",
    tradeoff: "Per brand row permissions need Pro, which starts at $575 a month.",
    traits: { openSource: true, mcp: true, rowSecurity: true },
    fit: { ecosystem: ["neither"], volume: ALL_VOLUMES, runner: ["none", "analyst", "ai"] }
  },
  {
    id: "lookerstudio",
    layer: "bi",
    name: "Looker Studio",
    tier: "Free",
    price: { kind: "free" },
    source: "https://cloud.google.com/looker-studio",
    checked: "2026-09-13",
    why: "Free Google dashboards that anyone with a Google account can open.",
    tradeoff: "No team workspaces or support, and permissions live in the data source.",
    traits: {},
    fit: { ecosystem: ["google"], volume: [0, 1], runner: ["none", "analyst"] }
  },
  {
    id: "lookerstudiopro",
    layer: "bi",
    name: "Looker Studio Pro",
    price: { kind: "seatTiers", basis: "readers", tiers: [{ perSeat: 9 }] },
    source: "https://cloud.google.com/looker-studio",
    checked: "2026-09-13",
    why: "Google dashboards with team workspaces, support, and Gemini questions.",
    tradeoff: "Billed per user per project whether they log in or not.",
    traits: {},
    fit: { ecosystem: ["google"], volume: [1, 2, 3], runner: ["none", "analyst", "ai"] }
  },
  {
    id: "powerbi",
    layer: "bi",
    name: "Power BI",
    tier: "Pro",
    price: { kind: "seatTiers", basis: "readers", tiers: [{ perSeat: 14 }] },
    source: "https://www.microsoft.com/en-us/power-platform/products/power-bi/pricing",
    checked: "2026-09-14",
    why: "The report tool most Microsoft teams already know.",
    tradeoff: "Every viewer needs a license, and building reports means learning DAX.",
    traits: { rowSecurity: true },
    fit: { ecosystem: ["microsoft"], volume: ALL_VOLUMES, runner: ["none", "analyst"] }
  },
  {
    id: "tableau",
    layer: "bi",
    name: "Tableau Cloud",
    tier: "Standard",
    price: { kind: "seatTiers", basis: "readers", tiers: [{ base: 75, included: 1, perSeat: 15 }] },
    source: "https://www.tableau.com/pricing/teams-orgs",
    checked: "2026-09-14",
    secondary: true,
    why: "Deep visual analysis for analysts who build a lot of their own views.",
    tradeoff: "One Creator at $75 plus $15 per viewer adds up fast for a wide audience.",
    traits: { mcp: true, rowSecurity: true },
    fit: { volume: [2, 3], runner: ["analyst"] }
  },
  {
    id: "lightdash",
    layer: "bi",
    name: "Lightdash Cloud",
    tier: "Pro",
    price: { kind: "flat", monthly: 3000 },
    source: "https://www.lightdash.com/pricing",
    checked: "2026-09-11",
    why: "Reports built straight from your dbt models with unlimited users.",
    tradeoff: "A flat $3,000 a month only pays off with a large audience.",
    traits: { openSource: true, mcp: true, codeFirst: true },
    fit: { volume: [3], runner: ["engineer", "ai"] }
  },
  {
    id: "preset",
    layer: "bi",
    name: "Preset",
    tier: "Starter then Professional",
    price: { kind: "seatTiers", basis: "readers", tiers: [{ maxSeats: 5, perSeat: 0 }, { perSeat: 20 }] },
    source: "https://preset.io/pricing",
    checked: "2026-09-11",
    why: "Hosted Apache Superset, free for up to five users.",
    tradeoff: "$20 per user a month billed yearly past five, and a steeper editor than Metabase.",
    traits: { openSource: true, mcp: true, rowSecurity: true },
    fit: { volume: [0, 1], runner: ["analyst", "ai"] }
  },

  // ---------------- observability ----------------
  {
    id: "elementary",
    layer: "observability",
    name: "dbt tests and Elementary",
    tier: "Open source",
    price: { kind: "free" },
    source: "https://www.elementary-data.com/pricing",
    checked: "2026-09-11",
    why: "Tests, freshness checks, and Slack alerts that live next to your dbt models.",
    tradeoff: "Works with dbt only, and someone reads the alerts.",
    traits: { openSource: true, codeFirst: true },
    fit: { volume: ALL_VOLUMES, runner: ["analyst", "engineer", "ai"] },
    requires: { layer: "modeling", ids: ["dbtcore", "dbtplatform"] }
  },
  {
    id: "sodafree",
    layer: "observability",
    name: "Soda Cloud",
    tier: "Free",
    price: { kind: "free" },
    source: "https://www.soda.io/pricing",
    checked: "2026-09-14",
    why: "Data quality checks written in simple YAML, free with unlimited users.",
    tradeoff: "The no code features and bigger limits sit on the $750 Team plan.",
    traits: { openSource: true, codeFirst: true },
    fit: { volume: [0, 1, 2], runner: ["engineer", "ai"] }
  },
  {
    id: "sodateam",
    layer: "observability",
    name: "Soda Cloud",
    tier: "Team",
    price: { kind: "flat", monthly: 750 },
    source: "https://www.soda.io/pricing",
    checked: "2026-09-14",
    why: "No code data quality monitoring for a team that owns many pipelines.",
    tradeoff: "A flat $750 a month is a lot for a handful of tables.",
    traits: {},
    fit: { volume: [3], runner: ["none", "engineer"] }
  },
  {
    id: "metaplane",
    layer: "observability",
    name: "Metaplane",
    tier: "Free",
    price: { kind: "free" },
    source: "https://www.metaplane.dev/pricing",
    checked: "2026-09-14",
    why: "Automatic anomaly alerts on your most important tables with no code.",
    tradeoff: "Free covers 10 tables. Past that it bills per table at a rate it does not list.",
    traits: {},
    fit: { volume: [0, 1], runner: ["none", "analyst"] }
  },
  {
    id: "montecarlo",
    layer: "observability",
    name: "Monte Carlo",
    price: { kind: "notPublished" },
    source: "https://montecarlo.ai/pricing/",
    checked: "2026-09-14",
    why: "Enterprise data observability across many pipelines and teams.",
    tradeoff: "Credit based pricing on request, sized for large data teams.",
    traits: {},
    fit: { volume: [3], runner: ["none"] }
  },

  // ---------------- orchestration ----------------
  {
    id: "ghactions",
    layer: "orchestration",
    name: "GitHub Actions",
    price: { kind: "free" },
    source: "https://github.com/pricing",
    checked: "2026-09-11",
    why: "A nightly schedule in the same repo as the code, free for 2,000 minutes a month.",
    tradeoff: "A scheduler and not a full orchestrator. Complex backfills get manual.",
    traits: { mcp: true, codeFirst: true },
    fit: { volume: [0, 1, 2], runner: ["analyst", "engineer", "ai"], freshness: ["daily", "hourly"] }
  },
  {
    id: "cloudscheduler",
    layer: "orchestration",
    name: "Cloud Scheduler and Cloud Run",
    price: {
      kind: "volume",
      monthly: [[0, 0], [0, 1], [0, 2], [1, 5]],
      note: "Three scheduler jobs free, then $0.10 per job a month. Cloud Run jobs include 240,000 vCPU seconds free a month."
    },
    source: "https://cloud.google.com/scheduler/pricing",
    checked: "2026-09-13",
    why: "Google's own timer and job runner, inside the free tier at this size.",
    tradeoff: "More Google Cloud setup than a workflow file in a repo.",
    traits: { codeFirst: true },
    fit: { ecosystem: ["google"], volume: ALL_VOLUMES, runner: ["engineer", "ai"], freshness: ["daily", "hourly"] },
    requires: { layer: "warehouse", ids: ["bigquery"] }
  },
  {
    id: "dagster",
    layer: "orchestration",
    name: "Dagster+",
    tier: "Solo then Starter",
    price: {
      kind: "volume",
      monthly: [[10, 20], [10, 40], [100, 150], [100, 250]],
      note: "Solo $10 a month plus $0.040 per credit; Starter $100 plus $0.035 per credit for up to 3 users. Credit use is the estimate."
    },
    source: "https://dagster.io/pricing",
    checked: "2026-09-11",
    why: "A real orchestrator with lineage and backfills once pipelines multiply.",
    tradeoff: "More to learn than a schedule file, and credits grow with runs.",
    traits: { openSource: true, codeFirst: true },
    fit: { volume: [2, 3], runner: ["engineer"], freshness: ["hourly", "realtime"] }
  },
  {
    id: "prefect",
    layer: "orchestration",
    name: "Prefect Cloud",
    tier: "Hobby then Starter",
    price: {
      kind: "volume",
      monthly: [[0, 0], [0, 100], [100, 100], [100, 100]],
      note: "Hobby is free for 2 users and 5 deployments. Starter is $100 a month for 3 users and 20 deployments."
    },
    source: "https://www.prefect.io/pricing",
    checked: "2026-09-11",
    why: "Python workflows with retries and a hosted dashboard.",
    tradeoff: "The free tier caps deployments, so growth means $100 a month.",
    traits: { openSource: true, codeFirst: true },
    fit: { volume: [0, 1], runner: ["engineer"], freshness: ["hourly"] }
  },
  {
    id: "astronomer",
    layer: "orchestration",
    name: "Astronomer Astro",
    tier: "Developer",
    price: { kind: "flat", monthly: 256 },
    source: "https://www.astronomer.io/pricing/",
    checked: "2026-09-14",
    why: "Managed Apache Airflow for teams that already think in DAGs.",
    tradeoff: "About $256 a month for one always on deployment before workers.",
    traits: { openSource: true, mcp: true, codeFirst: true },
    fit: { volume: [3], runner: ["engineer"], freshness: ["hourly", "realtime"] }
  },

  // ---------------- ai ----------------
  {
    id: "claudeteam",
    layer: "ai",
    name: "Claude Team",
    tier: "Standard seats",
    price: { kind: "seatTiers", basis: "ai", tiers: [{ perSeat: 25, minSeats: 2 }] },
    source: "https://claude.com/pricing",
    checked: "2026-09-11",
    why: "Ask questions in a chat window connected read only to your modeled tables.",
    tradeoff: "A seat per person who asks, with a two seat minimum.",
    traits: { mcp: true },
    fit: { ecosystem: ["neither"], volume: ALL_VOLUMES, runner: ["analyst", "engineer", "ai"] }
  },
  {
    id: "chatgptbusiness",
    layer: "ai",
    name: "ChatGPT Business",
    price: { kind: "seatTiers", basis: "ai", tiers: [{ perSeat: 25, minSeats: 2 }] },
    source: "https://learn.chatgpt.com/docs/pricing",
    checked: "2026-09-14",
    why: "A chat workspace your team may already use, connected to your data.",
    tradeoff: "A seat per person at $25 billed monthly with a two seat minimum.",
    traits: {},
    fit: { volume: ALL_VOLUMES, runner: ["none", "analyst"] }
  },
  {
    id: "metabot",
    layer: "ai",
    name: "Metabot in Metabase",
    price: {
      kind: "volume",
      monthly: [[0, 0], [0, 5], [0, 15], [5, 40]],
      note: "Included on every Metabase plan. The Metabase AI service includes 1 million tokens then $3.75 per million."
    },
    source: "https://www.metabase.com/pricing/",
    checked: "2026-09-11",
    why: "Questions answered inside the reports, limited to what each person can already see.",
    tradeoff: "Only works inside Metabase.",
    traits: { rowSecurity: true },
    fit: { ecosystem: ["neither"], volume: ALL_VOLUMES, runner: ["none", "analyst", "ai"] },
    requires: { layer: "bi", ids: ["metabase"] }
  },
  {
    id: "gemini",
    layer: "ai",
    name: "Gemini in BigQuery",
    price: {
      kind: "volume",
      monthly: [[0, 0], [0, 10], [0, 20], [20, 100]],
      note: "SQL assist and data canvas at no charge on demand. Data agents bill $3 per million input tokens and $20 per million output after September 30, 2026; about 300 questions a month stays under $20."
    },
    source: "https://cloud.google.com/bigquery/pricing",
    checked: "2026-09-13",
    why: "Plain English questions and SQL help inside the Google console.",
    tradeoff: "Business users get it in dashboards only with Looker Studio Pro.",
    traits: { rowSecurity: true },
    fit: { ecosystem: ["google"], volume: ALL_VOLUMES, runner: ["none", "analyst", "ai"] },
    requires: { layer: "warehouse", ids: ["bigquery"] }
  },
  {
    id: "copilotpbi",
    layer: "ai",
    name: "Copilot in Power BI",
    price: { kind: "included", with: "the Fabric capacity" },
    source: "https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-enable-power-bi",
    checked: "2026-09-14",
    why: "Questions and report drafts inside Power BI for a Microsoft team.",
    tradeoff: "Needs a paid Fabric capacity, and heavy use can push you to a bigger one.",
    traits: { rowSecurity: true },
    fit: { ecosystem: ["microsoft"], volume: ALL_VOLUMES, runner: ["none", "analyst"] },
    requires: { layer: "warehouse", ids: ["fabric"] }
  },

  // ---------------- build ----------------
  {
    id: "claudepro",
    layer: "build",
    name: "Claude Pro with Claude Code",
    price: { kind: "seatTiers", basis: "builders", tiers: [{ perSeat: 20 }] },
    source: "https://claude.com/pricing",
    checked: "2026-09-11",
    why: "Enough Claude Code to write and update the SQL and scripts for a small stack.",
    tradeoff: "Usage limits can bite on long build days.",
    traits: { mcp: true },
    fit: { volume: [0, 1], runner: ["none", "analyst", "ai"] }
  },
  {
    id: "claudemax",
    layer: "build",
    name: "Claude Max with Claude Code",
    price: { kind: "seatTiers", basis: "builders", tiers: [{ perSeat: 100 }] },
    source: "https://claude.com/pricing",
    checked: "2026-09-11",
    why: "Higher Claude Code limits for building and maintaining a larger stack.",
    tradeoff: "From $100 per person a month.",
    traits: { mcp: true },
    fit: { volume: [2, 3], runner: ["engineer", "ai"] }
  },
  {
    id: "claudeteampremium",
    layer: "build",
    name: "Claude Team",
    tier: "Premium seats",
    price: { kind: "seatTiers", basis: "builders", tiers: [{ perSeat: 125, minSeats: 2 }] },
    source: "https://claude.com/pricing",
    checked: "2026-09-11",
    why: "Claude Code for a team with admin controls and shared connectors.",
    tradeoff: "$125 a seat monthly with a two seat minimum.",
    traits: { mcp: true },
    fit: { volume: [3], runner: ["engineer"] }
  },
  {
    id: "chatgptplus",
    layer: "build",
    name: "ChatGPT Plus with Codex",
    price: { kind: "seatTiers", basis: "builders", tiers: [{ perSeat: 20 }] },
    source: "https://learn.chatgpt.com/docs/pricing",
    checked: "2026-09-14",
    why: "Codex is included in every ChatGPT plan and handles SQL and script work.",
    tradeoff: "Usage limits scale with the plan.",
    traits: {},
    fit: { volume: [0, 1], runner: ["none", "analyst", "ai"] }
  },
  {
    id: "chatgptpro",
    layer: "build",
    name: "ChatGPT Pro with Codex",
    price: { kind: "seatTiers", basis: "builders", tiers: [{ perSeat: 100 }] },
    source: "https://learn.chatgpt.com/docs/pricing",
    checked: "2026-09-14",
    why: "Higher Codex limits for heavier build and maintenance work.",
    tradeoff: "From $100 per person a month.",
    traits: {},
    fit: { volume: [2, 3], runner: ["engineer", "ai"] }
  }
];

/**
 * Reference scenarios. The page build prices each with the rules engine and
 * throws if the total drifts from these numbers, so a price edit that changes
 * a total is a deliberate edit here too.
 */
export const scenarios: { name: string; answers: Answers; low: number; high: number }[] = [
  {
    name: "small",
    answers: { readers: "1-5", size: "1", systems: "1-3", kinds: ["store", "ads", "spreadsheets"], runner: "none", ecosystem: "google", freshness: "daily", askAi: "no", notes: "" },
    low: 30,
    high: 55
  },
  {
    name: "mid",
    answers: { readers: "6-15", size: "2-10", systems: "4-6", kinds: ["store", "marketplaces", "ads", "crm", "accounting"], runner: "ai", ecosystem: "neither", freshness: "daily", askAi: "few", notes: "" },
    low: 201,
    high: 355
  },
  {
    name: "large",
    answers: { readers: "50+", size: "50+", systems: "10+", kinds: ["pos", "store", "accounting", "payroll", "ads", "crm"], runner: "engineer", ecosystem: "microsoft", freshness: "hourly", askAi: "everyone", notes: "" },
    low: 1426,
    high: 2901
  }
];
