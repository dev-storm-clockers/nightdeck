# ARTIFACT — nightdeck

- **root:** /workspace/nightdeck
- **slug:** nightdeck
- **entrypoints:**
  - `index.html` — landing / create-or-join / lobby + solo demo + de-emphasized unlock
  - `play.html` — short submit rounds / long judge window / scores
  - `end.html` — shareable end state
  - `js/catalog.js` — deck load + unlock gate (GCU staff-hidden until unlocked)
  - `js/room.js` — room code create/join + localStorage/BroadcastChannel; MAX 12 seats; solo bots
  - `js/game.js` — draw, rotating judge, scores, bot turns, judge window helpers
  - `js/ui.js` — shared UI helpers
  - `css/site.css` — Pass 3 visual refresh
  - `data/lobby-warmup.json` — free **workplace-clean** starter
  - `data/group-chat-unhinged.json` — unlock `NIGHTDECK-GCU` (gated, not featured)
- **how_to_run:** `python3 -m http.server 4173 --directory /workspace/nightdeck` (or `npx --yes serve /workspace/nightdeck -p 4173`); open http://127.0.0.1:4173/ — multi-tab same browser for mock multiplayer
- **live_url:** https://dev-storm-clockers.github.io/nightdeck/
- **owner_agent:** Build Head
- **ready_for_quality:** no
- **pass:** 3
- **notes:** |
  **Pass 3 staff-night cut (2026-09-08 evening ADT):** Workplace-clean Lobby Warmup on default path; ≥12 seats; short submit (hand 4) + long/open judge window (60 min soft default, no auto-advance); solo demo bot seat-fill; visual refresh; GCU de-emphasized under “More packs”. Keep NightDeck spelling, localStorage+BroadcastChannel, shareable end, rotating judge+scores.

  **ready_for_quality=no** — Build owns flip after smoke. Verifier/CoS must not flip yes.

  **Pass 2 carry:** Pages from `main` `/`; unlock gate intact; no Upstash/Stripe.
