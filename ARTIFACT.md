# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` / `day.html` / `play.html` / `board.html` / `end.html`
  - `js/{sync-config,sync,catalog,game,ui}.js` / `css/site.css`
  - `data/trivia/<subject>.json` · `data/trivia-subjects.json` · `data/identify.json` · `data/music.json`
  - `assets/logo.png` · `finish.png` · `modes.png` · `icon-{trivia,identify,music}.png`
  - `scripts/smoke-pass9-grade.mjs` · `scripts/smoke-pass11-deck.mjs`
- **how_to_run:** `python3 -m http.server 4173 --directory /workspace/nightdeck` → http://127.0.0.1:4173/
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** no
- **pass:** 11
- **notes:** |
  Pass 11: shared day deck — create picks fixed pack indices (`deck`), each
  player shuffles order only so contestants get the same questions out of order.
  Lazy migrate for old days missing deck. ready_for_quality=no until Quality.
