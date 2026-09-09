# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` / `play.html` / `end.html`
  - `js/{catalog,room,game,ui}.js` / `css/site.css`
  - `data/trivia.json` · `data/identify.json` · `data/music.json`
- **how_to_run:** `python3 -m http.server 4173 --directory /workspace/nightdeck` → http://127.0.0.1:4173/
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** no
- **pass:** 5
- **notes:** |
  **Pass 5 quiz-pivot rebuild:** Dropped blank-fill / judge-pick card UI. Staff Night is host-run Trivia / Identify / Music.
  play.html rewritten to game.js API (picking → answering → reveal → backToPicker / endNight).
  end.html podium uses shareText + round mix. Card-era decks removed from entrypoints.
  Live Pages may lag deploy; verify Staff Night copy (not “Deal the weirdest cards”).
  ready_for_quality=no until Quality smoke on live Pages confirms pivot.
