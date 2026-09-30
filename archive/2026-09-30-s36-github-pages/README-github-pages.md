# S36 (9/30/26): retiring the GitHub Pages deploy

**Why:** Vercel has served glfanalytics.com since 9/7/26 (S4). The Pages workflow still ran on every
push to main and daily at 09:17 UTC for the github.io address, which nothing uses. Since S15 (9/14) the
build writes to `.vercel/output/` and the workflow uploads `./dist`, so each run has had nothing current
to publish (not checked in the Actions tab). Any older copy still published there is a duplicate of the
site for search engines, and the daily run spends Actions minutes on nothing.

**Archived here (plain copies, byte for byte):**
- `deploy.yml.before` = `.github/workflows/deploy.yml`
- `CNAME.before` = `public/CNAME` (one line: `glfanalytics.com`)
- `nojekyll.before` = `public/.nojekyll` (empty)

**To remove (Gabriel's step; Claude's delete was blocked by the permission check, 9/30):** delete
those three files in the repo, then in GitHub: Settings, Pages, and unpublish the site / set the source
to None.

**Kept, still working:** everything Vercel serves. The site on Vercel never read any of the three files.
The daily rebuild went with the workflow; it only ever refreshed the Pages copy. A daily refresh on
Vercel needs a deploy hook (open loop in STATE.md), unchanged by this.

**To restore:** copy `deploy.yml.before` back to `.github/workflows/deploy.yml`, `CNAME.before` to
`public/CNAME`, `nojekyll.before` to `public/.nojekyll`, and set Pages back to GitHub Actions in the
repo settings. Note the workflow uploads `./dist`, which the Vercel adapter no longer writes (it builds
to `.vercel/output/`), so a restored workflow would publish nothing new until that path changes.

## The rest of S36 (the SEO foundation pass), same bundle

`s36-seo-forward.patch` = every edit S36 made to existing files (titles, descriptions, canonicals,
JSON-LD, the footer, robots.txt, two contact links). `git apply -R s36-seo-forward.patch` restores the
old lines. The new files S36 added are listed in the private audit doc
(`GLF Business Context/glf website/SEO_AUDIT_2026-09-30.md`); deleting them and applying the patch in reverse is
the full undo.
