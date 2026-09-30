// S36 (9/30/26): IndexNow for glfanalytics.com. Tells Bing (and through it
// ChatGPT search, DuckDuckGo, Copilot) and Yandex that pages changed, so they
// recrawl in hours instead of weeks. The birthday-cards.ai script, one change:
// the URL list is read from the LIVE sitemap, so there is no second list to
// keep in sync.
//
// Run after a push is live on Vercel:   npm run indexnow
// Or name pages:                        npm run indexnow -- https://glfanalytics.com/contact
//
// The key is public by design: it must be served at https://glfanalytics.com/<KEY>.txt
// (public/622263e28eb22a088e183cd540cc00c1.txt). A new key = a new file there + this constant.

const HOST = "glfanalytics.com";
const KEY = "622263e28eb22a088e183cd540cc00c1";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function sitemapUrls() {
  const index = await (await fetch(`https://${HOST}/sitemap-index.xml`)).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const map of maps) {
    const xml = await (await fetch(map)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

const keyCheck = await fetch(KEY_LOCATION);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`The key file is not live at ${KEY_LOCATION} yet. Push, wait for the Vercel deploy, then run this again.`);
  process.exit(1);
}

const cliUrls = process.argv.slice(2).filter((a) => a.startsWith("http"));
const urlList = cliUrls.length > 0 ? cliUrls : await sitemapUrls();

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList })
});

// 200 = accepted, 202 = accepted and the key is still being checked. Anything else is a problem.
const text = await res.text();
console.log(`IndexNow -> ${res.status} ${res.statusText}`);
console.log(`Submitted ${urlList.length} URL(s):`);
for (const u of urlList) console.log(`  ${u}`);
if (text.trim()) console.log(`Response body: ${text.trim()}`);
if (res.status !== 200 && res.status !== 202) process.exit(1);
console.log("\nAccepted. The crawl is queued; indexing still takes its own time.");
