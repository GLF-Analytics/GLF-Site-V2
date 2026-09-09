/**
 * world-dots.mjs
 *
 * Generates src/data/world-dots.json: the dot-grid world map behind the
 * "Cards made in N countries" panel on the homepage. Run it only when the
 * projection, grid step, or dot radius changes:
 *
 *   npm run map:dots
 *
 * Data: Natural Earth 4.1.0 via world-atlas (countries-50m, public domain data,
 * ISC package). Antarctica is dropped. Every land dot carries the ISO 3166-1
 * alpha-2 code of the country containing it, and every country carries a
 * display name and a projected centroid so a country too small for the grid
 * (Singapore, Seychelles) still gets one gold dot at build time.
 *
 * The site build never imports d3, topojson, or the atlas. Only this script does.
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { geoNaturalEarth1, geoPath, geoContains } from "d3-geo";
import { feature } from "topojson-client";
import iso from "i18n-iso-countries";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../src/data/world-dots.json");

// Grid contract. Change these, rerun, commit the JSON.
const WIDTH = 960;
const STEP = 6; // grid spacing in viewBox units (hex offset rows)
const RADIUS = 1.3; // dot radius in viewBox units
const ANTARCTICA = "010";

// Natural Earth marks disputed areas with id -99. Give their dots to the parent
// so the map has no holes; Kosovo gets its own code because Vercel can report XK.
const DISPUTED = { Kosovo: "XK", "N. Cyprus": "CY", Somaliland: "SO", "Indian Ocean Ter.": "AU", "Siachen Glacier": "IN" };

// ICU spellings that read better plain on the site.
const NAME_OVERRIDES = {
  US: "United States",
  GB: "United Kingdom",
  RU: "Russia",
  KR: "South Korea",
  KP: "North Korea",
  VN: "Vietnam",
  TR: "Turkey",
  LA: "Laos",
  SY: "Syria",
  IR: "Iran",
  BO: "Bolivia",
  TZ: "Tanzania",
  VE: "Venezuela",
  MD: "Moldova",
  FM: "Micronesia",
  CD: "DR Congo",
  CG: "Congo",
  HK: "Hong Kong",
  MO: "Macao",
  PS: "Palestine",
  XK: "Kosovo"
};

const display = new Intl.DisplayNames(["en"], { type: "region" });
const nameFor = (code) => {
  if (NAME_OVERRIDES[code]) return NAME_OVERRIDES[code];
  try {
    return (display.of(code) ?? code).replace(" & ", " and ");
  } catch {
    return code;
  }
};

const topo = require("world-atlas/countries-50m.json");
const all = feature(topo, topo.objects.countries).features;

const projection = geoNaturalEarth1().fitWidth(WIDTH, { type: "Sphere" });
const path = geoPath(projection);
const [[, sphereTop], [, sphereBottom]] = path.bounds({ type: "Sphere" });

const features = [];
const unmapped = [];
for (const f of all) {
  if (f.id === ANTARCTICA) continue;
  let code;
  if (f.id === "-99" || f.id === undefined) {
    code = DISPUTED[f.properties?.name];
  } else {
    code = iso.numericToAlpha2(String(f.id).padStart(3, "0"));
  }
  if (!code) {
    unmapped.push(`${f.id} ${f.properties?.name}`);
    continue;
  }
  features.push({ code, f, bounds: path.bounds(f), centroid: path.centroid(f) });
}
if (unmapped.length) {
  throw new Error(`Unmapped atlas features (add to DISPUTED or fix the id): ${unmapped.join("; ")}`);
}

// Countries table: one entry per code (a code can own several features only via DISPUTED merges).
const countries = {};
for (const { code, centroid } of features) {
  if (countries[code]) continue;
  countries[code] = { name: nameFor(code), cx: round(centroid[0]), cy: round(centroid[1]) };
}

// The grid, walked in screen space so the spacing is even on the page.
const dots = [];
const perCountry = {};
let row = 0;
for (let y = sphereTop + STEP / 2; y <= sphereBottom; y += STEP, row++) {
  const offset = row % 2 ? STEP / 2 : 0;
  for (let x = offset + STEP / 2; x <= WIDTH; x += STEP) {
    const ll = projection.invert([x, y]);
    if (!ll || !Number.isFinite(ll[0]) || !Number.isFinite(ll[1])) continue;
    if (Math.abs(ll[0]) > 180 || Math.abs(ll[1]) > 90) continue;
    const back = projection(ll);
    if (!back || Math.hypot(back[0] - x, back[1] - y) > 0.5) continue; // outside the globe

    for (const { code, f, bounds } of features) {
      const [[x0, y0], [x1, y1]] = bounds;
      if (x < x0 || x > x1 || y < y0 || y > y1) continue;
      if (!geoContains(f, ll)) continue;
      dots.push([round(x), round(y), code]);
      perCountry[code] = (perCountry[code] ?? 0) + 1;
      break;
    }
  }
}

// Sanity rails: a reversed ring would hand the ocean to one country.
const share = Object.entries(perCountry).map(([c, n]) => [c, n / dots.length]).sort((a, b) => b[1] - a[1]);
if (dots.length < 1200) throw new Error(`Only ${dots.length} land dots; the grid or projection is wrong`);
if (share[0][1] > 0.25) throw new Error(`${share[0][0]} owns ${(share[0][1] * 100).toFixed(1)}% of dots; check ring winding`);
for (const must of ["US", "RU", "CA", "BR", "AU", "CN"]) {
  if (!perCountry[must]) throw new Error(`${must} has no dots`);
}

const height = Math.ceil(Math.max(...dots.map((d) => d[1])) + STEP / 2);
const zero = Object.keys(countries).filter((c) => !perCountry[c]).sort();

const out = {
  generated: new Date().toISOString().slice(0, 10),
  source: "Natural Earth 4.1.0 via world-atlas 2 (countries-50m), Antarctica dropped",
  projection: "naturalEarth1",
  w: WIDTH,
  h: height,
  step: STEP,
  r: RADIUS,
  dots,
  countries
};
writeFileSync(OUT, JSON.stringify(out));

console.log(`[world-dots] ${dots.length} land dots, ${Object.keys(countries).length} countries, viewBox 0 0 ${WIDTH} ${height}`);
console.log(`[world-dots] biggest: ${share.slice(0, 6).map(([c, s]) => `${c} ${(s * 100).toFixed(1)}%`).join(", ")}`);
console.log(`[world-dots] ${zero.length} countries with no grid dot (centroid fallback): ${zero.join(" ")}`);
console.log(`[world-dots] wrote ${OUT}`);

function round(n) {
  return Math.round(n * 10) / 10;
}
