# VERIFY — nightdeck

- **lock_ref:** /workspace/nightdeck/LOCK.md
- **artifact_ref:** /workspace/nightdeck/ARTIFACT.md
- **ac_ref:** /workspace/nightdeck/AC-accepted.md · /workspace/nightdeck/AC-change-solo-visual.md · /workspace/nightdeck/AC-change-staff-night.md
- **done_bar:** |
  Base multi-human hard stops (still stand):
  1. Lobby/join — host creates room + code; second client joins; start disabled until ≥3 real players (except solo demo)
  2. Draw+submit — 1 prompt + answers from Lobby Warmup; blind submit
  3. Judge+score — rotating judge picks winner; score increments; judge rotates
  4. Shareable end — host end or round cap → shareable results/end

  Solo demo (AC-change-solo-visual):
  5. Solo entry without second human
  6. Bots fill to ≥3; Start available with 1 human + bots
  7. Full Lobby Warmup loop with bots; party mode still ≥3 real when not solo
  8. Visual refresh — clearer hierarchy; polished cards/lobby/end; mobile-ok; no new mechanics

  Staff-night (AC-change-staff-night):
  9. Clean default — Lobby Warmup workplace-clean; GCU gated/hidden (not default)
  10. ~12 seats cap; start ≥3 real (or solo bots)
  11. Short submit/play window
  12. Long judge window (async-friendly)

  Must-holds: NightDeck spelling; no spicy default; no CAH; Pages live when Build ready
- **browser_required:** yes
- **evidence_owner:** Verifier
- **evidence_paths:** /tmp/verify-this/nightdeck-pass3/
- **pass_n_result:** pending
- **fail_list:**
- **quality_head_decision:** pending
- **notes:** Pass 3 staff-night + solo + visual. Prefer stop by 2 on this cut. Verifier only after Build smoke flips ready_for_quality=yes. Live https://dev-storm-clockers.github.io/nightdeck/ (or local :4173).
