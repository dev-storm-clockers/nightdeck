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
- **pass:** 13
- **notes:** |
  **Pass 13 — Trivia harder:** All 8 `data/trivia/*.json` rewritten (24 each) — pub-quiz gimmes purged; majority `hard`, rest `medium`; no `easy`. Near-miss distractors. Pass 9 grading / `game.js` schema intact. Music Pass 12 bank untouched (22 items). Trivia + Identify playable. Files: general, pop, movies, science, geo, food, decades, mixed. See PASS13-NOTES.md. Prefer STOP after Quality GO — `ready_for_quality: yes` live smoke PASS @ `6fd18e5`.
