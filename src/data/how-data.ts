/**
 * Copy for /using-data-to-build-with-ai (S13, Sep 2026; recut S13b on
 * Gabriel's lede; cut by a quarter in S14, then his S14 copy notes). The page
 * renders this file; edit copy here, never in the .astro. Rules that the page
 * enforces at build: no numeral in a paragraph other than a four-digit year
 * unless the paragraph is flagged numerals: "dated-fact" and names its source
 * file (the site law: traffic numbers come from the snapshot or the live API,
 * never typed). Counts in prose are written as words. Headings carry no
 * commas. The one live number in prose is rendered by the page from
 * getBcStats(), in the loop section.
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
  title: "Using data to build with AI",
  lede:
    "birthday-cards.ai started as a fun way to make cards for friends and family. I built it end to end with AI, and its analytics connect to the same AI system in Claude Code that builds it. The numbers decide what gets built next. That is the 2026 model I work in. AI does as much as it can, and a person sets the direction.",
  description:
    "How birthday-cards.ai grew from a card maker for friends into a product built end to end with AI, run on its own analytics, from the command line in Claude Code.",
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
    id: "start",
    heading: "How it started",
    paragraphs: [
      "I built it because I wanted to use it myself, and for about two months I was the only user. Then I shared it with family and friends. A few search visitors showed up, so I kept improving it and adding analytics until search traffic picked up. There was no big moment. People loved the cards, and I wanted to learn how to build a product end to end with Claude Code. I write SQL but I am not a full stack developer, so this was my test. It shaped how I see the future: integrated systems where building, measuring, and designing all run from one command line."
    ]
  },
  {
    id: "build",
    heading: "Building it with Claude Code",
    paragraphs: [
      "Claude Code is my build partner. It handled the design, the code, the email delivery, the search pages, and the tracking, across several models, with OpenAI drawing the cards and helping with QA. Next.js and TypeScript on Vercel.",
      "We work under a doc system: a briefing, a state file rewritten every session, a session log, and an archive that fills before anything is deleted. Every change passes types, lint, tests, and the build, and I review all of it before it ships."
    ],
    chips: ["Next.js", "TypeScript", "Vercel", "OpenAI", "Gemini", "Resend", "Airtable", "Upstash", "Claude Code"]
  },
  {
    id: "loop",
    heading: "How the analytics connect",
    paragraphs: [
      "The app sends an event to Vercel for every step a person takes. Google Search Console and Bing cover search. Airtable holds the leads. Claude Code reads each one through its API.",
      "Once a week it pulls everything together, compares it to the week before, and tells me in plain words what moved. If a number rests on fewer than twenty visitors, we skip it. I decide what to change, Claude builds it, and I test it on my phone."
    ]
  },
  {
    id: "instrument",
    heading: "Setting up analytics",
    paragraphs: [
      "The tracking went in before the first search visitor arrived. About sixty custom events, written so a finished card counts apart from a click. Test traffic is filtered out of every query. On a small site the owner is the traffic, so every read asks one question first: was any of this me?"
    ]
  },
  {
    id: "decisions",
    heading: "What the numbers changed",
    paragraphs: [
      "Three times the numbers changed what I built.",
      {
        text: "Bing ranks the plain exact-match page at position 4 for its head term. Google puts it at 10 and ranks the themed pages instead. So I stopped building new pages around that same term, and the milestone-age page shipped the next night.",
        numerals: "dated-fact",
        source: "Claude Fun/LEARNINGS.md, section 2 (S242, 9/8/26)"
      },
      {
        text: "In the 30 days to September 11, search visitors who landed on a themed page made a card 43% of the time. On the homepage it was 19%. So the homepage was not the problem, and the work went to six pages that had no search visitors yet.",
        numerals: "dated-fact",
        source: "Claude Fun/analytics/analyses/2026-09-12-seo-vs-homepage/SEO_VS_HOMEPAGE_2026-09-12.md"
      },
      {
        text: "17 of 330 renders failed in a 31 day window, and one morning the model refused my own photo four times in a row. Now a render never just fails. If a guard trips, a backup design with the typed details runs instead, and no photo prompt ships until eight or more real photos pass with zero refusals.",
        numerals: "dated-fact",
        source: "Claude Fun/FABLE_AUDIT_2026-09-04.md, section 2a; PROMPT_AUDIT_2026-06-27.md, section 21 (9/10/26)"
      }
    ]
  },
  {
    id: "command-line",
    heading: "How I work with Claude Code",
    paragraphs: [
      "Claude and I work as a team. It drafts the plan, builds, and verifies. I review every plan and weigh the costs and benefits before anything ships, and the release goes out from GitHub Desktop after that review."
    ]
  },
  {
    id: "for-a-business",
    heading: "Doing this for a business",
    paragraphs: [
      "A business already has the sources: orders, web, ads, support, finance. Connect them, fix the definitions before the first dashboard, and build the system so it keeps working as the business grows. Then AI reads the pipe, drafts the read, and builds what gets picked, with a person deciding and owning every change."
    ]
  }
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
