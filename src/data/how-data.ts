/**
 * Copy for /how-data-grows-a-product (S13, Sep 2026). The page renders this
 * file; edit copy here, never in the .astro. Rules that the page enforces at
 * build: no numeral in a paragraph other than a four-digit year unless the
 * paragraph is flagged numerals: "dated-fact" and names its source file
 * (the site law: traffic numbers come from the snapshot or the live API,
 * never typed). Counts in prose are written as words. Headings carry no
 * commas. The one live number in prose is rendered by the page from
 * getBcStats(), in the sources section.
 */

export type Paragraph =
  | string
  | { text: string; numerals: "dated-fact"; source: string };

export type Section = {
  id: string;
  heading: string;
  paragraphs: Paragraph[];
  chips?: string[];
};

export const meta = {
  eyebrow: "Something I built with AI",
  title: "How data builds and grows a product",
  lede:
    "birthday-cards.ai is the example. It runs on its own data from the first event to the last decision. AI reads that data and builds on it. I make the calls. Every number on this page is read from its analytics.",
  description:
    "How birthday-cards.ai runs on its own data: sixty events, connected sources, a weekly read, AI that builds, and one person making the calls.",
  published: "2026-09-13"
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

export const sections: Section[] = [
  {
    id: "loop",
    heading: "The loop",
    paragraphs: [
      "The app sends an event for every step a person takes. Vercel keeps those events. Google Search Console and Bing Webmaster hold the search side. Airtable holds the leads.",
      "Once a week Claude Code pulls all of it into a dated snapshot, diffs it against the week before, and writes a short memo. I read the memo and decide what changes. Claude builds the change, verifies it, and hands me a test list for my phone. Then the numbers move and the loop runs again.",
      "This site reads the same pipe when it builds. Nothing above was typed in. A person sits in the loop at two points: the decision and the push."
    ]
  },
  {
    id: "instrument",
    heading: "Instrument before you grow",
    paragraphs: [
      "The tracking went in before the first search visitor arrived. About sixty custom events, written so a finished card is counted apart from a click and a delivered email apart from a sent one. Test surfaces carry a marker and every query filters them out.",
      "Definitions came before rates. On a small site the owner is the traffic, so every read asks the same question first: was any of this me? The homepage conversion rate once counted people who had walked in from another page. The fix was a range with the pass-through subtracted, not a bigger number. The denominator is where most of the work is."
    ]
  },
  {
    id: "sources",
    heading: "Connected sources",
    paragraphs: [
      "Vercel Web Analytics is read through its MCP server. Search Console through a service account. Bing through its API. Airtable holds the leads. The Vercel runtime logs are the first stop when something breaks. Credentials live outside the working folder and never enter a repo.",
      "A skill runs the weekly ritual in one pass: pull, snapshot, diff, memo. Each memo names the window, the cohort, and the number of people behind every rate. A rate built on fewer than twenty visitors is called unreadable rather than quoted."
    ]
  },
  {
    id: "decisions",
    heading: "Reads that changed the product",
    paragraphs: [
      "Three reads from the memos. Each one is a number, a call, and what shipped.",
      {
        text: "Bing ranks the plain exact-match page at position 4 for its head term. Google puts that same page at 10 and ranks the themed pages instead. The call: never clone the head term. Build a new intent. The milestone-age page shipped the next night.",
        numerals: "dated-fact",
        source: "Claude Fun/LEARNINGS.md, section 2 (S242, 9/8/26)"
      },
      {
        text: "In the 30 days to September 11, search visitors who landed on a themed page made a card 43% of the time. On the homepage it was 19%. The call: the homepage was never the problem. Six pages had no search visitors at all, and that is where the work went.",
        numerals: "dated-fact",
        source: "Claude Fun/analytics/analyses/2026-09-12-seo-vs-homepage/SEO_VS_HOMEPAGE_2026-09-12.md"
      },
      {
        text: "17 of 330 renders failed in a 31 day window, and one morning the model refused my own photo four times in a row. The call: a render never fails closed. If a guard trips, a fallback concept carrying the typed details runs instead. And no prompt on a photo path ships until eight or more real photos pass at zero refusals.",
        numerals: "dated-fact",
        source: "Claude Fun/FABLE_AUDIT_2026-09-04.md, section 2a; PROMPT_AUDIT_2026-06-27.md, section 21 (9/10/26)"
      }
    ]
  },
  {
    id: "build",
    heading: "The build side",
    paragraphs: [
      "Next.js and TypeScript on Vercel. gpt-image-2 draws the card. GPT-4o writes the prompt. Gemini is the second engine. Resend sends the email, Vercel Blob holds the share and gift links, Airtable takes the leads, Upstash runs the rate limits, and pdf-lib makes the printable.",
      "Claude Code runs the codebase under a doc system: a briefing, a state file rewritten every session, a session log, a learnings file, and an archive that fills before anything is deleted. More than two hundred and fifty sessions so far. Every change passes the same gates before I see it: types, lint, the test suite, the build. Then a headless screenshot lands on my phone."
    ],
    chips: ["Next.js", "TypeScript", "Vercel", "OpenAI", "Gemini", "Resend", "Airtable", "Upstash", "Claude Code"]
  },
  {
    id: "human",
    heading: "A person in the loop",
    paragraphs: [
      "I ask the question and read the memo on my phone. Every trade-off gets framed by Claude and called by me. The push comes from GitHub Desktop, by hand, and Claude never commits.",
      "Prompt changes go live one page at a time with my approval on each. Site-wide changes ship on one page first. I look, then the sweep runs. The system is connected end to end and none of it acts on its own."
    ]
  },
  {
    id: "for-a-business",
    heading: "The same loop on a business",
    paragraphs: [
      "A business already has the sources: orders, web, ads, support, finance. Connect them into one warehouse and fix the definitions before the first dashboard. Then let AI read the pipe and draft the read, with a person deciding and owning every change."
    ]
  }
];

export const faq: { q: string; a: string }[] = [
  {
    q: "Where do the numbers on this page come from?",
    a: "From Vercel Web Analytics on birthday-cards.ai, read when this site builds. Test traffic is filtered out. The refreshed date under the dashboard is the date of the last read."
  },
  {
    q: "What is connected to what?",
    a: "The app sends events to Vercel. Google Search Console and Bing hold the search side. Airtable holds the leads. Claude Code reads all of them through their APIs, writes the weekly memo, and builds the changes. This site reads the same analytics at build time."
  },
  {
    q: "Who makes the decisions?",
    a: "I do. Claude frames each trade-off, builds what I pick, and verifies it. I review on my phone and push the release myself."
  }
];
