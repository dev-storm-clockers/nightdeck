# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` / `day.html` / `play.html` / `board.html` / `end.html`
  - `js/{sync-config,sync,catalog,game,ui}.js` / `css/site.css`
  - `data/trivia/<subject>.json` · `data/trivia-subjects.json` · `data/identify.json` · `data/music.json`
  - `assets/logo.png` · `finish.png` · `modes.png` · `icon-{trivia,identify,music}.png`
  - `assets/music/card-*.svg` (Pass 12 original abstract album cards)
  - `scripts/smoke-pass9-grade.mjs` · `scripts/smoke-pass11-deck.mjs`
- **how_to_run:** `python3 -m http.server 5180 --directory /workspace/nightdeck` → http://127.0.0.1:5180/
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** yes
- **pass:** 12
- **notes:** |
  **Pass 12 — Music harder + visual:** `data/music.json` rebuilt (22 items) — famous lyric gimmes purged (no Bohemian / Don’t Stop Believin’ / Happy / Rickroll peers). Majority harder mix: deep-cut lyric fragments, name-the-album, decade/year without title giveaway. Optional `image` on items → original SVG cards under `assets/music/` (10 abstract cards; no scraped/hotlinked commercial art). `play.html` shows `.music-card` when `item.image` present; `game.js` snapshots `image`. Trivia + Identify + Pass 9 grading + brand + Upstash board untouched. Local smoke :5180. Prefer STOP after Quality GO — `ready_for_quality: yes` live smoke PASS @ `93eeeee`.
