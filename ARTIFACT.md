# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` — create/join, solo demo, pad-to-12, warm lobby copy
  - `play.html` — short submit + long judge window, game-night voice
  - `end.html` — shareable end
  - `js/catalog.js` / `js/room.js` / `js/game.js` / `js/ui.js`
  - `css/site.css` — ember/amber party-game visual
  - `data/lobby-warmup.json` — office-hang free deck (40/80)
  - `data/group-chat-unhinged.json` — gated, not staff default
- **how_to_run:** `python3 -m http.server 4173 --directory /workspace/nightdeck` → http://127.0.0.1:4173/
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** no
- **pass:** 4
- **notes:** |
  Pass 4: kill robot voice — warm host copy, full Lobby Warmup rewrite (40/80), party visual (less purple SaaS), game-night play prompts. Constraints held (office-safe, 12 seats, short submit / long judge, solo + multi ≥3, NightDeck, Pages, localStorage). Build owns ready_for_quality flip after smoke.
