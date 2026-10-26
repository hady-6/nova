# NOVA public frontend ↔ backend integration prep (local, reversible, nothing deployed)

## Backend changes (`/home/sandbox/videodl-oss/server/app.py`, pre-patch backup at `app.py.bak-prepatch`)
1. Trial gate bypass list now also opens `/api/extract` and `/api/rating` (counters were already open).
2. CORS `allow_methods` GET → GET,POST (counters/ratings POSTs come cross-origin from GitHub Pages).
3. `/api/extract` rate-limited 30/min/IP (it fans out to external fetches).
4. HLS fallback fix: `_extract_video_list` now matches both `"video_list"` and `"v_hlsv4_video_list"` page variants (Pinterest serves both; previously one variant parsed to nothing and the pin degraded to a thumbnail image). Media build simplified: keep real .mp4 rows, else derive `/hls/…m3u8` → `/720p/…mp4` and keep only if HEAD 200.
5. Titles HTML-entity-decoded in `finalize`.
Verified live (local uvicorn, gate ON): `pin.it/3ZDGfYJBL` → 720p MP4, size 8,684,261 bytes; visit dedup (new:true then new:false); `/api/download` and `/api/convert` still 401 without session; CORS preflight from https://hady-6.github.io returns allow-methods GET, POST.

## Frontend changes (`/home/sandbox/integration-prep/frontend/`, copy of live v44 + wiring)
- `NOVA_BACKEND` const at top of app.js. Empty = zero behavior change (proven: no network calls, short links still show the original error, stats element untouched).
- When set: pin.it short links resolve via `GET /api/extract`; widgets-API "novideo" pins fall back to `/api/extract`; counters: anonymous UUID cid in localStorage → `POST /api/visit` once per device, `GET /api/stats/public` → footer stats line (new `<p id="stats-line" hidden>` + CSS, locale key `stats_line` in all 6 languages).
- Verified via node DOM-stub harness: all 3 flows render correctly; flag-off is byte-behavior-identical to live.

## Open decisions (need user/main before activation)
1. **Privacy copy conflict**: approved site copy says links/data never leave the device (rate note, about section). Setting NOVA_BACKEND sends the pasted link + a visit ping to our backend. Copy must be updated first - not done here.
2. **Ratings stay local-only** in this prep. Public rating wiring exists server-side (`/api/rating` opened) but the visible "your rating stays on your device" promise contradicts it. Decide copy change or keep local.
3. **Download proxy + convert stay gated** publicly (terms/bandwidth risk). Users still open pinimg URLs in a new tab as today. True one-tap downloads need `/api/download` opened, which needs a host whose terms allow media proxying.
4. Activation step once hosted: set `NOVA_BACKEND` to the backend URL in app.js, commit. Fully reversible by clearing the const.

## Addendum 2026-10-26 (visual QA pass)
- All localStorage access now goes through a storage-safe `LS` helper: private-mode / storage-blocked browsers no longer kill the whole script (previously one unguarded read at lang init aborted everything below it). The live frontend has the same latent fragility; fixing it there is a separate frozen-area decision - not done.
- Visual QA completed in a real cloud browser (not just DOM stubs): flag-off build renders pixel-identical to the live site; flag-on build (stubbed backend responses) renders the short-link result card ("720p · MP4" row, real pinimg href) and the footer stats line correctly in light theme; zero console errors after the storage fix.
