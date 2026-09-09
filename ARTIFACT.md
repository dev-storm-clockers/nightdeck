# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` / `day.html` / `play.html` / `board.html` / `end.html`
  - `js/{sync-config,sync,catalog,game,ui}.js` / `css/site.css`
  - `data/trivia/<subject>.json` · `data/trivia-subjects.json` · `data/identify.json` · `data/music.json`
- **how_to_run:** `python3 -m http.server 4173 --directory /workspace/nightdeck` → http://127.0.0.1:4173/
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** no
- **pass:** 8
- **notes:** |
  Pass 8 trivia subjects: 8 subject packs × 24 factual MCQs; subject
  cards required before Create for Trivia; day.subject on Upstash;
  play loads subject pack; board/end show subject; Pass 7 HUD kept.
  ready_for_quality=no until Quality.
