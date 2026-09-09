# VERIFY — nightdeck

- **lock_ref:** /workspace/nightdeck/LOCK.md
- **artifact_ref:** /workspace/nightdeck/ARTIFACT.md
- **ac_ref:** /workspace/nightdeck/AC-accepted.md
- **done_bar:** |
  Pass 1 hard stops (fail pass if any miss):
  1. Lobby/join — host creates room + code; second client joins; start disabled until ≥3 players
  2. Draw+submit — 1 prompt + answers from Lobby Warmup; blind submit (judge no owners before pick)
  3. Judge+score — rotating judge picks winner; shown; score increments; judge rotates
  4. Shareable end — host end or round cap → shareable results/end (copy or on-page card)
  Must-holds: Lobby Warmup free E2E; Group Chat Unhinged gated (not dumped on free path); original decks only (no CAH); mobile-usable; UI spelling **NightDeck**
- **browser_required:** yes
- **evidence_owner:** Verifier
- **evidence_paths:** /tmp/verify-this/nightdeck-pass1/ (NOTES.md; 01-host-lobby-1player-start-disabled.png; 02-bob-joined-2of3-start-disabled.png; 03-three-players-ready-waiting-host.png; 04-host-ready-start-enabled.png; 05-round1-prompt-hand-submit.png; 06-blind-sealed-1of2.png; 07-judge-blind-no-owners.png; 08-reveal-bob-score1.png; 09-round2-judge-rotated-bob.png; 10-shareable-end.png; 11-index-mobile-375-gcu-locked.png; 12-gcu-unlocked-via-code.png)
- **pass_n_result:** PASS
- **fail_list:** - none
- **quality_head_decision:** PASS-next
- **notes:** |
  Pass 1 live multi-tab verify 2026-09-08 ~23:00–23:20 ADT. Serve: reused python3 http.server on :4173 → http://127.0.0.1:4173/. Browser: Chrome DevTools MCP, isolatedContext=nightdeck-pass1 (shared localStorage+BroadcastChannel), viewport 375×812 mobile.

  Hard stops: (1) HostAlice created room NQPSQ; Bob/Carol joined other tabs; Start disabled until 3/3, then host-enabled. (2) Round 1 Lobby Warmup prompt + hands; blind sealed submissions (no owners until judge). (3) Judge HostAlice picked Bob → score 1; Next round → judge rotated to Bob (R2). (4) Host End night → end.html ranking + share card + Copy results.

  Must-holds: Lobby Warmup free E2E without unlock; GCU option locked + loadDeck throws until NIGHTDECK-GCU; no GCU card bodies in free UI/JS; no CAH/third-party in product assets; NightDeck spelling (no “Night Deck”); mobile-ok at ~375px.

  Non-blocking nits: single localStorage session key shared across tabs (identity can collide on play.html reload — Pass 1 mock); paid pack JSON is a static /data/ file (client gate only); CDP click flaky on answer-card buttons (page .click() worked).
