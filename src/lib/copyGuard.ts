/*
  Build-time copy guards for site pages (S33, 9/28/26). One home for the kill
  list (the shared core of /style-and-tone plus the glfanalytics.com adds). A
  page calls assertClean() in its frontmatter with the copy objects it renders;
  a hit throws, so the build fails instead of the page shipping the tell.
  The planner page keeps its own older inline checks; new pages use this.
*/

export const KILL_LIST = [
  "leverage",
  "robust",
  "seamless",
  "comprehensive",
  "crucial",
  "pivotal",
  "delve",
  "utilize",
  "foster",
  "showcase",
  "underscore",
  "meticulous",
  "streamline",
  "furthermore",
  "additionally",
  "moreover",
  "at its core",
  "it is important to note",
  "it is worth mentioning",
  "going forward",
  "moving forward",
  "in summary",
  "actually",
  "unlock",
  "transform",
  "empower",
  "supercharge",
  "game-changer",
  "revolutionize",
  "at scale",
  "proof",
  "solo",
  "alone",
  "without a team"
];

const walk = (v: unknown, out: string[]): void => {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => walk(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => walk(x, out));
};

/** Every string inside `copy`: no em or en dash, no exclamation point, no kill-list word, and no comma in a heading. */
export function assertClean(label: string, copy: unknown, headings: string[] = []): { words: number } {
  const strings: string[] = [];
  walk(copy, strings);
  const text = strings.join("\n");
  if (/[–—]/.test(text)) throw new Error(`[${label}] em or en dash in the copy`);
  if (/!/.test(text)) throw new Error(`[${label}] exclamation point in the copy`);
  for (const word of KILL_LIST) {
    const re = new RegExp(`\\b${word.replace(/[-\s]/g, "[-\\s]")}\\b`, "i");
    if (re.test(text)) throw new Error(`[${label}] kill-list word "${word}" in the copy`);
  }
  for (const h of headings) if (h.includes(",")) throw new Error(`[${label}] comma in a heading: "${h}"`);
  return { words: text.split(/\s+/).filter(Boolean).length };
}
