# S38 (10/2/26): honest tags and the spam screen

## What changed and why
On 10/2 two `contact_submit` events fired with nothing in Airtable or the inbox. Before this change, the hidden trap field (named `website`) answered OK and kept nothing, and the page fired `contact_submit` on any OK. The field could also be filled by Chrome autofill or a password manager, so a real visitor could be silently dropped.

- `src/lib/screen.ts` (new): the trap name `hp_field_7`, the 3 s minimum, `screen()` returning `trap`, `fast` or `noclock`.
- `src/pages/api/lead.ts`: a screened submit emails Gabriel with a `[possible spam: reason]` subject (no row, no confirmation). Every OK names its `outcome`. One `[lead] outcome=...` log line.
- `src/pages/api/warehouse-report.ts`: the same screen. A screened request sends NO report to the posted address and writes no row; Gabriel gets a flagged note. `[warehouse-report] outcome=...` log line.
- `src/layouts/BaseLayout.astro`: `window.glfTrack`, the one way an event is sent (drops `navigator.webdriver`, prints in dev). The click listener uses it.
- `ContactForm.astro`, `design-your-data-warehouse.astro`: the renamed trap with autofill and password-manager ignore attributes, `elapsed` sent with each post, `contact_submit` / `report_sent` only on a landed lead, new `contact_suspect` / `report_suspect`. `planner_start` no longer fires on a restored draft.
- `LoopVideo.astro`: `video_play` (fired on muted autoplay, every view) replaced by `video_seen` (playing and half on screen).
- `src/data/contact.ts`: `mail.suspectSubject`, `mail.suspectNote`.
- `contact.astro`: `booking_click` through `glfTrack`.

## Kept working
All other events, names and properties; the first-touch source; the kill switch, limiter and dedupe; the clean path of both routes (row, notification, confirmation, report) is unchanged. The routes still treat a filled `website` key as the trap, so old cached pages and old bots are caught.

## Restore
`before/` holds the pre-S38 copies of the eight tracked files. Or, from the repo root: `git apply -R --exclude=src/lib/screen.ts archive/2026-10-02-s38-honest-tags/s38-forward.patch` and delete `src/lib/screen.ts`.
