/*
  S36 (9/30/26): the last-modified date of every indexable route, for the
  sitemap's <lastmod> and the case studies' dateModified.

  A route's date = the newest git commit date among its source files
  (src/data/page-sources.ts); a source with uncommitted edits counts as today
  (Los Angeles), so a local build dates the change it is about to ship.

  Where it runs: a local build has the full history, computes the dates and
  rewrites src/data/lastmod.json when they changed (commit it with the page
  edit). Vercel clones shallow, where git dates are wrong, so there the build
  reads the committed json as is. No git at all = the json too.
*/
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { staticPages, WORK_DIR, WORK_TEMPLATE } from "../data/page-sources";

const SNAPSHOT = "src/data/lastmod.json";

export type PageSource = { path: string; sources: string[] };

/** Every indexable route with its source files: the static list plus one row per case study. */
export function allPageSources(root = process.cwd()): PageSource[] {
  const work = readdirSync(join(root, WORK_DIR))
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ path: `/${f.replace(/\.md$/, "")}`, sources: [`${WORK_DIR}/${f}`, WORK_TEMPLATE] }));
  const pages = [...staticPages.map(({ path, sources }) => ({ path, sources })), ...work];
  for (const p of pages) {
    for (const s of p.sources) {
      if (!existsSync(join(root, s))) throw new Error(`[lastmod] ${p.path}: source ${s} does not exist (src/data/page-sources.ts)`);
    }
  }
  return pages;
}

const git = (root: string, args: string[]) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

const todayLA = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());

function readSnapshot(root: string): Record<string, string> {
  const file = join(root, SNAPSHOT);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
}

/** Route path -> YYYY-MM-DD. Logs where the dates came from. */
export function pageDates(root = process.cwd()): Record<string, string> {
  const pages = allPageSources(root);
  let full = false;
  try {
    full = git(root, ["rev-parse", "--is-shallow-repository"]) === "false";
  } catch {
    full = false;
  }
  if (!full) {
    const snap = readSnapshot(root);
    console.log(`[lastmod] shallow or no git: ${Object.keys(snap).length} dates from ${SNAPSHOT}`);
    return snap;
  }

  const dates: Record<string, string> = {};
  for (const p of pages) {
    const dirty = git(root, ["status", "--porcelain", "--", ...p.sources]) !== "";
    dates[p.path] = dirty ? todayLA() : git(root, ["log", "-1", "--format=%cs", "--", ...p.sources]);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dates[p.path])) throw new Error(`[lastmod] ${p.path}: no git date for ${p.sources.join(", ")}`);
  }
  const next = JSON.stringify(dates, null, 2) + "\n";
  const file = join(root, SNAPSHOT);
  const changed = !existsSync(file) || readFileSync(file, "utf8") !== next;
  if (changed) writeFileSync(file, next);
  console.log(`[lastmod] ${pages.length} routes from git, newest ${Object.values(dates).sort().at(-1)}${changed ? `, ${SNAPSHOT} updated (commit it)` : ""}`);
  return dates;
}
