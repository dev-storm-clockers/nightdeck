# PASS11-NOTES — shared day deck (same questions, shuffled order)

## Phil ask
Questions weren’t the same for each contestant in the same game. Align them but out of order.

## Bug
`Game.startRun` did `shuffle(all indices).slice(0, 8)` per player → different question sets.

## Fix
1. **Day deck:** At create time, `Catalog.loadPack` + `Game.pickDeck(pack, 8)` → fixed index list stored on the day as `deck: number[]`.
2. **Per player:** `startRun({ deck })` uses exactly those indices, shuffles **order** only. A–D options still shuffled per snapshot.
3. **createDay / createSoloDay:** accept and persist `deck`.
4. **index.html:** builds deck before create / solo create.
5. **play.html boot:** loads day (Upstash or `session.day` for solo); reads `day.deck`; passes into `startRun`. Old days missing `deck` → generate once, `setDay` (lazy migrate) so late joiners align after first lock.
6. **day.html / session:** stores `deck` on session when joining.

## Helpers
- `Game.pickDeck(pack, total)` — fixed set for the day
- `Game.startRun({ …, deck })` — same set, new order (fallback if no deck)

## Verify
- `node scripts/smoke-pass11-deck.mjs` — same deck → sorted index sets equal; order often differs; fallback still works.
- Pass 9 grading smoke still green (`smoke-pass9-grade.mjs`).

## Out of scope / not flipped
- Subject picker / Upstash / Pass 9 grading / Pass 10 graphics unchanged in behavior.
- `ready_for_quality` left **no**.
