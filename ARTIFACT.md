# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` / `day.html` / `play.html` / `board.html` / `end.html`
  - `js/{sync-config,sync,catalog,game,ui}.js` / `css/site.css`
  - `data/trivia/<subject>.json` · `data/trivia-subjects.json` · `data/identify.json` · `data/music.json`
  - `assets/logo.png` · `finish.png` · `modes.png` · `icon-{trivia,identify,music}.png`
  - `scripts/smoke-pass9-grade.mjs`
- **how_to_run:** `python3 -m http.server 4173 --directory /workspace/nightdeck` → http://127.0.0.1:4173/
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** no
- **pass:** 10
- **notes:** |
  Pass 10: plain finish page (finish.png hero, big score, one meta line, Leaderboard /
  Copy score / New day); brand logo on all pages; mode icons on create cards.
  ready_for_quality=no until Quality.
