# Accepted AC — NightDeck

**Source:** `/workspace/nightdeck/LOCK.md` · Product Head accepted 2026-09-08 (no cuts)

**Product:** NightDeck (UI copy: one word, capital N/D; slug `nightdeck`). SKU, not demo.

**In scope:** Host-run party card nights · original curated decks only · free **Lobby Warmup** · first paid pack intent **Group Chat Unhinged** (mock/unlock-code OK) · play loop: create/join room (code), draw, rotating judge, scores, shareable end · mobile-ok · Pages + Neon/Upstash if claimed, else static/`localStorage` mock with clear upgrade path.

---

## Hard stops (≤4) — Verifier fails the pass if any miss

1. **Lobby / join:** Host creates a room and gets a room code; a second client joins with that code; start disabled until ≥3 players (or LOCK-equivalent minimum if UI states it — default ≥3).
2. **Draw + submit:** Each round draws 1 prompt + answer cards from the active curated deck; players submit blind (judge does not see owners before pick).
3. **Judge + score:** Rotating judge picks a winner; winner is shown; score increments; judge rotates for the next round.
4. **Shareable end:** Host can end (or reach round cap); players see a shareable results/end state (copy or on-page card).

---

## Must also hold

- Free deck **Lobby Warmup** playable end-to-end without paying.
- **Group Chat Unhinged** gated somehow (unlock code or clear mock paywall); free path must not dump the full paid pack.
- Original deck content only — no CAH / third-party titles, art, or scraped cards.
- Host + player flows usable on a mobile viewport.
- Spelling in UI: **NightDeck** (not "Night Deck").

---

## Out of scope

- Dorm After Dark
- Small-Town Main Street
- Real Stripe/accounts unless Build unlocks free-tier in-pass
- Harbour Glow–style marketing site as the product
- Lilly

---

## Release intent (Product Head)

- Pass 1 = Lobby Warmup loop shippable
- Prefer stop by Pass 2 after unlock gate
- Quality Done bar = these 4 hard stops + must-holds
