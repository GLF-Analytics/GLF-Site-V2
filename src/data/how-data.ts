/**
 * Copy for /using-data-to-build-with-ai (S13, Sep 2026; recut S13b on
 * Gabriel's lede; cut by a quarter in S14; second half redesigned S28;
 * SECOND HALF REWRITTEN AS A BLOG POST S30, 9/21/26: his own dictation close
 * to word for word, plain headings, three simple graphics). The page renders
 * this file; edit copy here, never in the .astro. Rules that the page enforces
 * at build: no numeral in any paragraph, caption or heading other than a
 * four-digit year unless the paragraph is flagged numerals: "dated-fact" and
 * names its source file (the site law: traffic numbers come from the snapshot
 * or the live API, never typed). Counts in prose are written as words.
 * Headings carry no commas. The one live number in prose is rendered by the
 * page from getBcStats() (the searchLine block). The method mix is a dated
 * analysis fact: the card counts live here with their source and the page
 * computes the shares, so a percentage is never typed.
 */

export type Paragraph =
  | string
  | { text: string; numerals: "dated-fact"; source: string };

export type Figure = { figure: "tools" | "growth" | "searchLine" | "methods" | "video" | "map" };
export type Block = Paragraph | Figure;

export type PostSection = {
  id: string;
  heading: string;
  blocks: Block[];
};

export const meta = {
  eyebrow: "Something I built with AI",
  title: "Using data to build with AI",
  lede:
    "birthday-cards.ai started as a fun way to make cards for friends and family. I built it end to end with AI, and its analytics connect to the same AI system in Claude Code that builds it. The numbers decide what gets built next. That is the 2026 model I work in. AI does as much as it can, and a person sets the direction.",
  description:
    "How birthday-cards.ai grew from a card maker for friends into a product built end to end with AI, run on its own analytics, from the command line in Claude Code.",
  published: "2026-09-13",
  // Bumped once per copy change (S30 blog post), never per rebuild.
  modified: "2026-09-23"
};

// Product names that carry a digit. The page strips these before the numeral
// guard runs; they are names, not counts.
/* The clip in the growth section (S32, 9/23/26): built from the beat sheet in
   GLF Business Context/glf website/video/using-data-post/BEAT_SHEET.md, every
   number on its frames sourced there. Silent, captions burned in. */
export const video = {
  src: "/video/using-data-loop.mp4",
  poster: "/video/using-data-loop-poster.jpg",
  seconds: 44,
  uploadDate: "2026-09-23",
  name: "How one search page on birthday-cards.ai went from a guess to the best converter",
  description: "A silent 44 second clip: one page built for one search term in June, the search data read in Claude Code, where it grew on Bing, the tap that leaked, one fix, and the conversion read that became the rule for every page since."
};

export const namedTokens = ["gpt-image-2", "GPT-4o"];

export const sources = [
  "Vercel Web Analytics",
  "Google Search Console",
  "Bing Webmaster",
  "Airtable",
  "Vercel runtime logs",
  "Claude Code"
];

/* The tools of the post. One list drives two things: every mention of a name
   in a post paragraph renders bold, and ToolStrip.astro draws the rows. The
   page throws if a name here never appears in the post. */
export type Tool = { name: string; group: "Build" | "Host" | "Draw" | "Measure" | "Notes" };

export const toolGroups: Tool["group"][] = ["Build", "Host", "Draw", "Measure", "Notes"];

export const tools: Tool[] = [
  { name: "Claude Code", group: "Build" },
  { name: "GitHub", group: "Build" },
  { name: "command line", group: "Build" },
  { name: "Vercel", group: "Host" },
  { name: "OpenAI", group: "Draw" },
  { name: "Vercel Web Analytics", group: "Measure" },
  { name: "Google Search Console", group: "Measure" },
  { name: "Bing Webmaster", group: "Measure" },
  { name: "Airtable", group: "Measure" },
  { name: ".md notes", group: "Notes" }
];

/* The post, in page order (S30, 9/21/26). His dictation close to word for
   word; the edits are listed in archive/2026-09-21-s30-data-page-post. The
   last paragraph of the last section is the sign-off. */
export const post: PostSection[] = [
  {
    id: "start",
    heading: "How it started",
    blocks: [
      "My friend gave me a personalized gift made with AI. Personalized gift giving is already very popular, and I knew that with AI it will only grow.",
      "I also love giving cards and writing cards. It's one of the few times you have a good excuse to be vulnerable with someone and share how you feel.",
      "So I built birthday-cards.ai. I was the only user for a few months. Then a few friends and family tried it and I got good feedback. I was printing the cards at home on cardstock, and the cards I gave to people in real life were well received."
    ]
  },
  {
    id: "build",
    heading: "Getting set up",
    blocks: [
      "I write SQL. I'm not a full stack developer. So there was a learning curve. I had to get set up with GitHub, get comfortable on the command line, and learn Claude Code. Vercel hosts the site. OpenAI draws the cards. Airtable holds the emails.",
      "The piece that guides all of it is a system of .md notes. A briefing, a state file that gets rewritten every session, a session log, a style guide. Claude reads them before it writes any code.",
      { figure: "tools" }
    ]
  },
  {
    id: "growth",
    heading: "A few sessions from random places",
    blocks: [
      "Anyways, I saw a few sessions from random places. So I set up analytics further and kept working on this as a passion project.",
      { figure: "growth" },
      { figure: "searchLine" },
      "Three pieces of work moved those bars. In July, one indexing fix. Every search signal had been pointing at the wrong host. In August the analytics went live and the first weekly read ran. In September I built thirteen pages, each around one thing people search for.",
      { figure: "video" },
      "I can also see how people make their cards.",
      { figure: "methods" }
    ]
  },
  {
    id: "loop",
    heading: "A glimpse into the future",
    blocks: [
      "Once I got all the systems connected, it became really cool to see a glimpse into the future (or the now). Claude Code reads Vercel Web Analytics, Google Search Console and Bing Webmaster and provides the analysis. Then we work together to plan the next product development steps.",
      { figure: "map" },
      "AI is not doing all of it. It does the heavy lifting on the analysis, and it ties things together so nicely. We set rules on what works and what doesn't, so as we develop it learns about what worked and what didn't. We have brand guidelines and tone guidelines, and all of these things mean the project compounds knowledge.",
      "I'm sure there are some risks associated with this workflow. But I move slow and deliberately, or at least I try to."
    ]
  },
  {
    id: "ahead",
    heading: "Where it stands",
    blocks: [
      "It's all free now. It's my lead generator for GLF Analytics, to show what I can do. If it gets enough traffic, I might consider paid upgrades and ways to monetize.",
      "It's all new. So this is my test project, my passion project, my playground, and a utility that has saved me a lot on cards I would otherwise be buying from the store.",
      "-Gabe"
    ]
  }
];

export const captions = {
  tools: "The tools behind birthday-cards.ai.",
  growth: "Visitors from search by month.",
  methods: "More than half of the cards start with someone's photo.",
  video: "One page, from a guess in June to the best converting page on the site. Forty-four seconds, no sound, and it loops.",
  map: "The loop. Five sources feed Claude Code, a person decides, and the next build ships to the site."
};

/* How search visitors made their cards (9/17/26 analysis). Counts of cards by
   homepage method; `photo` marks the methods that start from a photo. The
   page computes every share from these counts. No keep rate appears anywhere:
   every per-method group of makers is under twenty people. */
export type MethodCount = { method: string; cards: number; photo: boolean };

export const methodMix = {
  date: "2026-09-17",
  headline: "of cards start with a photo",
  window: "Search visitors, August 26 to September 17",
  rows: [
    { method: "Build from scratch", cards: 48, photo: false },
    { method: "Transform a photo", cards: 41, photo: true },
    { method: "Funny premade", cards: 12, photo: true },
    { method: "Surprise me", cards: 10, photo: true }
  ] as MethodCount[],
  source: "Claude Fun/analytics/analyses/2026-09-17-flow-mix/README.md"
};

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
