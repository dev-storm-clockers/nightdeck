# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` / `day.html` / `play.html` / `board.html` / `end.html`
  - `js/{sync-config,sync,catalog,game,ui}.js` / `css/site.css`
  - `data/trivia.json` · `data/identify.json` · `data/music.json`
- **how_to_run:** `python3 -m http.server 4173 --directory /workspace/nightdeck` → http://127.0.0.1:4173/
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** no
- **pass:** 7
- **notes:** |
  Pass 7 game-night UI + mobile lock-in: tap option = lock for MCQ;
  fixed bottom Next bar with safe-area; concise Jackbox-style cards;
  Upstash day sync unchanged; ready_for_quality=no until Quality.
