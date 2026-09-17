/**
 * Copy for /using-data-to-build-with-ai (S13, Sep 2026; recut S13b on
 * Gabriel's lede; cut by a quarter in S14; SECOND HALF REDESIGNED S28, 9/17/26:
 * the seven prose sections became four beats, each a mono eyebrow, one heading,
 * at most two sentences and one visual). The page renders this file; edit copy
 * here, never in the .astro. Rules that the page enforces at build: no numeral
 * in any rendered text other than a four-digit year unless the field is flagged
 * numerals: "dated-fact" and names its source file (the site law: traffic
 * numbers come from the snapshot or the live API, never typed). Counts in prose
 * are written as words. Headings carry no commas. The one live number in prose
 * is rendered by the page from getBcStats(), under the system beat. Chart data
 * (the method rows, the growth markers) carries a source per record; sources
 * are build-time provenance and never render.
 */

export type Paragraph =
  | string
  | { text: string; numerals: "dated-fact"; source: string };

export type Beat = {
  id: string;
  eyebrow: string;
  heading: string;
  sentences: Paragraph[];
};

export const meta = {
  eyebrow: "Something I built with AI",
  title: "Using data to build with AI",
  lede:
    "birthday-cards.ai started as a fun way to make cards for friends and family. I built it end to end with AI, and its analytics connect to the same AI system in Claude Code that builds it. The numbers decide what gets built next. That is the 2026 model I work in. AI does as much as it can, and a person sets the direction.",
  description:
    "How birthday-cards.ai grew from a card maker for friends into a product built end to end with AI, run on its own analytics, from the command line in Claude Code.",
  published: "2026-09-13",
  // Bumped once per copy change (S28 redesign), never per rebuild.
  modified: "2026-09-17"
};

// Product names that carry a digit. The page strips these before the numeral
// guard runs; they are names, not counts.
export const namedTokens = ["gpt-image-2", "GPT-4o"];

export const sources = [
  "Vercel Web Analytics",
  "Google Search Console",
  "Bing Webmaster",
  "Airtable",
  "Vercel runtime logs",
  "Claude Code"
];

/* The four beats of the second half, in page order. Each renders as a mono
   eyebrow, a heading, the sentences, then its visual (see the page). */
export const beats: Beat[] = [
  {
    id: "loop",
    eyebrow: "The system",
    heading: "Everything runs from one command line",
    sentences: [
      "The app sends an event for every step a person takes and Claude Code reads every source through MCP. A weekly read tells me what moved and I decide what gets built."
    ]
  },
  {
    id: "decisions",
    eyebrow: "One question",
    heading: "Which making method do people keep",
    sentences: [
      "A search visitor made five cards and saved one Surprise Me so I asked the data. Every group is under twenty people so the order is the finding and the rates are not."
    ]
  },
  {
    id: "start",
    eyebrow: "How it grew",
    heading: "Two months as the only user then search found it",
    sentences: ["Nothing was paid and nothing was sent. The three marks are the work that moved the line."]
  },
  {
    id: "for-a-business",
    eyebrow: "What this is",
    heading: "From idea to product with full visibility",
    sentences: []
  }
];

/* The systems loop, in loop order. Rendered by SystemsLoop.astro as an ordered
   list in three lanes. `person` marks the one node a person owns. */
export type SystemNode = {
  id: string;
  lane: "sources" | "read" | "build";
  role: string;
  label: string;
  sub?: string[];
  person?: boolean;
};

export const systemLanes: { id: SystemNode["lane"]; label: string }[] = [
  { id: "sources", label: "Sources" },
  { id: "read", label: "Read" },
  { id: "build", label: "Decide and build" }
];

export const systems: SystemNode[] = [
  { id: "app", lane: "sources", role: "The product", label: "The app sends an event for every step a person takes" },
  { id: "vercel", lane: "sources", role: "Source", label: "Vercel Web Analytics" },
  { id: "gsc", lane: "sources", role: "Source", label: "Google Search Console" },
  { id: "bing", lane: "sources", role: "Source", label: "Bing Webmaster" },
  { id: "airtable", lane: "sources", role: "Source", label: "Airtable holds the leads" },
  { id: "reads", lane: "read", role: "Claude Code", label: "Reads each source through MCP and its API" },
  {
    id: "dashboard",
    lane: "read",
    role: "One dashboard",
    label: "Every number reconciles before the page builds",
    sub: ["Four checks run on each refresh", "A mismatch stops the build"]
  },
  {
    id: "weekly",
    lane: "read",
    role: "Weekly read",
    label: "What moved since last week in plain words",
    sub: ["Was any of this me?", "Nothing under twenty arrivals counts"]
  },
  { id: "decide", lane: "build", role: "A person", label: "I decide what changes and what waits", person: true },
  { id: "build", lane: "build", role: "Claude Code", label: "Builds what was picked" },
  { id: "gates", lane: "build", role: "Gates", label: "Types lint tests and the build", sub: ["Screenshots at phone and desktop widths"] },
  { id: "push", lane: "build", role: "Release", label: "I review and push from GitHub Desktop" },
  { id: "live", lane: "build", role: "Live", label: "The next event starts the loop again" }
];

/* The worked example (9/17/26). Numbers are counts of people from the search
   cohort August 26 to September 17; the figure draws one dot per maker and
   fills the dot when that maker saved, downloaded, emailed or shared. No
   percentage anywhere: every group is under twenty people. */
export type MethodRow = { method: string; makers: number; acted: number; cards: number };

export const methodCase = {
  date: "2026-09-17",
  question: "Which making method do people keep?",
  rows: [
    { method: "Build from scratch", makers: 18, acted: 6, cards: 48 },
    { method: "Transform a photo", makers: 11, acted: 7, cards: 41 },
    { method: "Funny premade", makers: 8, acted: 2, cards: 12 },
    { method: "Surprise me", makers: 5, acted: 3, cards: 10 }
  ] as MethodRow[],
  caption: "Search visitors from late August to mid September. A filled dot is a maker who saved, downloaded, emailed or shared.",
  source: "Claude Fun/analytics/analyses/2026-09-17-flow-mix/README.md"
};

export const decisions: { label: string; text: Paragraph }[] = [
  {
    label: "Decided: nothing",
    text: "Every group is under twenty people. Instead of moving anything on the page I wrote it down as a test with a read date."
  },
  {
    label: "Decided: one line",
    text: {
      text: "The same read found 44 completed shares and zero arrivals that could be traced back. The share link now carries a tag. Live the same afternoon and read in fourteen days.",
      numerals: "dated-fact",
      source: "Claude Fun/analytics/analyses/2026-09-17-flow-mix/README.md; Claude Fun/SESSION_LOG.md S274 (9/17/26)"
    }
  }
];

/* The growth chart's three work markers. `month` places the tick; `when` and
   `label` render in the key under the chart. Each carries its source. */
export type GrowthMarker = { month: string; when: string; label: string; source: string };

export const growthMarkers: GrowthMarker[] = [
  {
    month: "2026-07",
    when: "July",
    label: "One indexing fix. Every search signal had pointed at the wrong host.",
    source: "Claude Fun/SESSION_LOG.md S56 (7/19/26); Claude Fun/LEARNINGS.md sec 2"
  },
  {
    month: "2026-08",
    when: "August",
    label: "The analytics pipe went live and the first weekly read ran.",
    source: "Claude Fun/audits/ANALYTICS_SETUP_PLAN_2026-08-28.md; analytics/SESSION_LOG.md S1 to S2"
  },
  {
    month: "2026-09",
    when: "September",
    label: "Thirteen pages built around one intent each from one page machine.",
    source: "Claude Fun/SESSION_LOG.md S225 to S253; Claude Fun/audits/GROWTH_ARC_2026-09-17.md sec 5"
  }
];

/* The closing grid. Plain nouns, one line each. */
export const takeaways: { label: string; line: string }[] = [
  { label: "Built", line: "End to end with AI and every function live" },
  { label: "Measured", line: "About sixty events and one dashboard that reconciles" },
  { label: "Decided", line: "A person picks and Claude builds" },
  { label: "Tested", line: "Read on a date and changed on the numbers" }
];

export const faq: { q: string; a: string }[] = [
  {
    q: "Where do the numbers on this page come from?",
    a: "From Vercel Web Analytics on birthday-cards.ai, read when this site builds. Test traffic is filtered out."
  },
  {
    q: "Who makes the decisions?",
    a: "A person does. Claude thinks through each trade-off with me, builds what we pick, and verifies it. The release goes out after my review."
  }
];
