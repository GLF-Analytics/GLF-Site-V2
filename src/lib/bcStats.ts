/**
 * birthday-cards.ai usage numbers for the homepage stats block.
 *
 * Runs at build time only. If VERCEL_ANALYTICS_TOKEN, VERCEL_TEAM_ID and
 * BC_PROJECT_ID are present, it queries the Vercel Web Analytics REST API
 * (https://vercel.com/docs/analytics/web-analytics-api). On any failure, or
 * with no token, it falls back to the committed snapshot in src/data.
 * The token never reaches the browser; only the four numbers do.
 */
import snapshot from "../data/bc-stats.json";

export type BcStats = {
  fetched_at: string;
  window_days: number;
  window_since: string;
  window_until: string;
  cards_30d: number;
  cards_since_launch: number;
  visitors_30d: number;
  search_visitors_30d: number;
  live: boolean;
};

const API = "https://api.vercel.com/v1/query/web-analytics";
const LAUNCH = "2026-03-01";
const SEARCH_HOSTS = new Set([
  "google.com",
  "bing.com",
  "duckduckgo.com",
  "search.yahoo.com",
  "ecosia.org",
  "com.google.android.googlequicksearchbox",
  "search.brave.com",
  "yandex.com"
]);
const NOT_BETA_EVENTS = "not startswith(eventData/surface, 'beta')";
const NOT_BETA_VISITS = "not startswith(requestPath, '/beta')";

const env = (key: string): string | undefined =>
  (typeof process !== "undefined" ? process.env[key] : undefined) ??
  (import.meta.env as Record<string, string | undefined>)[key];

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

async function query(
  path: string,
  params: Record<string, string>,
  token: string,
  teamId: string,
  projectId: string
) {
  const url = new URL(`${API}/${path}`);
  url.searchParams.set("teamId", teamId);
  url.searchParams.set("projectId", projectId);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
    return (await res.json()) as { data: any };
  } finally {
    clearTimeout(timer);
  }
}

function fromSnapshot(): BcStats {
  return { ...snapshot, live: false };
}

export async function getBcStats(): Promise<BcStats> {
  const token = env("VERCEL_ANALYTICS_TOKEN");
  const teamId = env("VERCEL_TEAM_ID");
  const projectId = env("BC_PROJECT_ID");

  if (!token || !teamId || !projectId) {
    console.warn("[bcStats] no analytics token in env; using committed snapshot from", snapshot.fetched_at);
    return fromSnapshot();
  }

  const until = new Date();
  const since = new Date(until.getTime() - 30 * 24 * 60 * 60 * 1000);
  const window = { since: isoDate(since), until: isoDate(until) };

  try {
    const [cards30, cardsAll, visits30, refs] = await Promise.all([
      query("events/count", { ...window, filter: `eventName eq 'card_generated' and ${NOT_BETA_EVENTS}` }, token, teamId, projectId),
      query("events/count", { since: LAUNCH, until: window.until, filter: `eventName eq 'card_generated' and ${NOT_BETA_EVENTS}` }, token, teamId, projectId),
      query("visits/count", { ...window, filter: NOT_BETA_VISITS }, token, teamId, projectId),
      query("visits/aggregate", { ...window, filter: NOT_BETA_VISITS, groupBy: "referrerHostname", limit: "50" }, token, teamId, projectId)
    ]);

    const rows: Array<{ referrerHostname?: string; visitors?: number }> = Array.isArray(refs.data) ? refs.data : [];
    const searchVisitors = rows
      .filter((r) => r.referrerHostname && SEARCH_HOSTS.has(r.referrerHostname))
      .reduce((sum, r) => sum + (r.visitors ?? 0), 0);

    const stats: BcStats = {
      fetched_at: window.until,
      window_days: 30,
      window_since: window.since,
      window_until: window.until,
      cards_30d: Number(cards30.data?.count ?? 0),
      cards_since_launch: Number(cardsAll.data?.count ?? 0),
      visitors_30d: Number(visits30.data?.visitors ?? 0),
      search_visitors_30d: searchVisitors,
      live: true
    };

    // A zero from the API is more likely a query problem than a real zero on a live product.
    if (stats.cards_since_launch < snapshot.cards_since_launch) {
      console.warn("[bcStats] live all-time count below the snapshot; using snapshot instead", stats);
      return fromSnapshot();
    }

    console.log("[bcStats] live numbers", stats);
    return stats;
  } catch (err) {
    console.warn("[bcStats] fetch failed; using committed snapshot from", snapshot.fetched_at, String(err));
    return fromSnapshot();
  }
}

/**
 * Countries where at least one card was generated (the homepage map). Same
 * live-or-snapshot pattern as getBcStats: one events/aggregate query grouped
 * by country since launch, beta surfaces excluded, limit 100 (the API default
 * of 10 would silently truncate the list). Every country counts once; the
 * map gives equal weight whether a country made 1 card or 700.
 */
import countriesSnapshot from "../data/bc-countries.json";

export type BcCountry = { code: string; visitors: number; cards: number };
export type BcCountries = {
  fetched_at: string;
  since: string;
  countries: BcCountry[];
  live: boolean;
};

function countriesFromSnapshot(): BcCountries {
  return {
    fetched_at: countriesSnapshot.fetched_at,
    since: countriesSnapshot.since,
    countries: countriesSnapshot.countries,
    live: false
  };
}

export async function getBcCountries(): Promise<BcCountries> {
  const token = env("VERCEL_ANALYTICS_TOKEN");
  const teamId = env("VERCEL_TEAM_ID");
  const projectId = env("BC_PROJECT_ID");

  if (!token || !teamId || !projectId) {
    console.warn("[bcStats] no analytics token in env; using committed countries snapshot from", countriesSnapshot.fetched_at);
    return countriesFromSnapshot();
  }

  const until = isoDate(new Date());

  try {
    const res = await query(
      "events/aggregate",
      { since: LAUNCH, until, filter: `eventName eq 'card_generated' and ${NOT_BETA_EVENTS}`, groupBy: "country", limit: "100" },
      token,
      teamId,
      projectId
    );
    const rows = Array.isArray(res.data) ? res.data : [];
    const countries: BcCountry[] = rows
      .filter((r) => typeof r.country === "string" && /^[A-Z]{2}$/.test(r.country))
      .map((r) => ({
        code: r.country as string,
        visitors: Number(r.visitors ?? 0),
        cards: Number(r.count ?? r.events ?? 0)
      }))
      .sort((a, b) => a.code.localeCompare(b.code));

    // Countries only accrue. A shorter live list means a query problem, not a real drop.
    if (countries.length < countriesSnapshot.countries.length) {
      console.warn("[bcStats] live country list shorter than the snapshot; using snapshot instead", countries.length);
      return countriesFromSnapshot();
    }

    console.log("[bcStats] live countries", countries.length);
    return { fetched_at: until, since: LAUNCH, countries, live: true };
  } catch (err) {
    console.warn("[bcStats] countries fetch failed; using committed snapshot from", countriesSnapshot.fetched_at, String(err));
    return countriesFromSnapshot();
  }
}
