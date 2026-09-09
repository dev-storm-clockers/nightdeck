# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` — landing / create-or-join room + unlock gate UX
  - `play.html` — draw / judge / scores loop
  - `end.html` — shareable end state
  - `js/catalog.js` — deck load + unlock gate
  - `js/room.js` — room code create/join + localStorage/BroadcastChannel sync
  - `js/game.js` — draw, rotating judge, scores
  - `js/ui.js` — shared UI helpers
  - `css/site.css`
  - `data/lobby-warmup.json` — free starter (30 prompts / 40 answers)
  - `data/group-chat-unhinged.json` — unlock `NIGHTDECK-GCU`
- **how_to_run:** `python3 -m http.server 4173 --directory /workspace/nightdeck` (or `npx --yes serve /workspace/nightdeck -p 4173`); open http://127.0.0.1:4173/ — multi-tab same browser for mock multiplayer
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** no
- **pass:** 2
- **notes:** |
  **Pass 2 polish (2026-09-08 ADT / published ~2026-09-09 02:03 UTC):** Unlock gate UX polished for Group Chat Unhinged (locked/unlocked states, code entry, success path); Lobby Warmup remains free. Live: https://dev-storm-clockers.github.io/nightdeck/ — repo https://github.com/dev-storm-clockers/nightdeck (Pages from `main` `/`). HTTP 200 verified on index/play/css/js/deck.

  **Build smoke required before Quality** — ready_for_quality left **no**; only Build Head flips to yes after smoke. CoS must not flip yes.

  **Pass 1 carry:** localStorage + BroadcastChannel mock (no Upstash). Skills under test: phil-lock-card, artifact-packet, verifier-gate-packet.
