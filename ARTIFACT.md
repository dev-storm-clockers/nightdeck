# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` / `day.html` / `play.html` / `board.html` / `end.html`
  - `js/{sync-config,sync,catalog,game,ui}.js` / `css/site.css`
  - `data/trivia/<subject>.json` · `data/trivia-subjects.json` · `data/identify.json` · `data/music.json`
  - `scripts/smoke-pass9-grade.mjs`
- **how_to_run:** `python3 -m http.server 4173 --directory /workspace/nightdeck` → http://127.0.0.1:4173/
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** no
- **pass:** 9
- **notes:** |
  Pass 9: fix reveal/grading (exactly one `.correct`); shuffle options + correctIndex;
  rewrite trivia packs to pub/staff bar; smoke 236/236; music/identify tightened.
  ready_for_quality=no until Quality.
