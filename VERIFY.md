# VERIFY — nightdeck

- **lock_ref:** /workspace/nightdeck/LOCK.md
- **artifact_ref:** /workspace/nightdeck/ARTIFACT.md
- **ac_ref:** /workspace/nightdeck/AC-accepted.md
- **done_bar:** |
  Pass 1 hard stops (fail pass if any miss) — regression-check after Pass 2 polish:
  1. Lobby/join — host creates room + code; second client joins; start disabled until ≥3 players
  2. Draw+submit — 1 prompt + answers from Lobby Warmup; blind submit (judge no owners before pick)
  3. Judge+score — rotating judge picks winner; shown; score increments; judge rotates
  4. Shareable end — host end or round cap → shareable results/end (copy or on-page card)
  Must-holds: Lobby Warmup free E2E; Group Chat Unhinged gated (NIGHTDECK-GCU; not dumped on free path); original decks only (no CAH); mobile-usable; UI spelling **NightDeck**
  Pass 2 polish focus (not new hard stops): unlock UX works; live Pages serves app
- **browser_required:** yes
- **evidence_owner:** Verifier
- **evidence_paths:** /tmp/verify-this/nightdeck-pass2/ (NOTES.md; 01-host-lobby-1player-start-disabled.png … 12-gcu-unlocked-via-code.png)
- **pass_n_result:** PASS
- **fail_list:**
  - none
- **quality_head_decision:** STOP-GO
- **notes:** |
  Pass 2 FINAL verify PASS. Live URL used: https://dev-storm-clockers.github.io/nightdeck/ (multi-tab isolatedContext nightdeck-pass2; room E5Z47). All Done-bar hard stops + must-holds green (regression vs Pass 1). Unlock UX works (Locked→NIGHTDECK-GCU→Unlocked + auto-select); Pages HTTP 200 on index/play/end/css/js/decks. Polish nits non-blocking only: shared localStorage session across tabs; static paid JSON path if known; CDP click quirk on answer cards (DOM click OK). Stopped digging after green Done bar. quality_head_decision left pending (Verifier does not recommend STOP/GO).
