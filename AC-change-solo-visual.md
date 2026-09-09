# Accepted change-note AC — NightDeck (solo demo + visual refresh)

**Source:** `/workspace/nightdeck/LOCK.md` scope open · Product Head accepted 2026-09-08 (no cuts)

**Adds only** (prior AC hard stops 1–4 in `AC-accepted.md` still stand for multi-human path):

## Hard stops (solo demo)

1. **Solo entry:** From the live site, one person can start **solo demo** (or equivalent) without needing a second human client.
2. **Seat fill:** Bots/auto-players fill so the room meets the ≥3 start rule; Start becomes available with one human + bots.
3. **Full Lobby Warmup loop:** That one human can complete draw → submit → judge → score → shareable end using Lobby Warmup (bots act as other seats; judge still rotates).
4. **Party mode unchanged:** Multi-human lobby still requires ≥3 real players to start (solo bots are demo-only, not a permanent 1-player party rules change).

## Must-holds (visual refresh)

- Clearer hierarchy on lobby, in-round, and end screens (host vs player actions obvious).
- Cards/lobby/end look polished vs pre-refresh; no new mechanics, decks, or paywall changes.
- Mobile viewport remains usable for host + solo-demo player flows.
- UI spelling stays **NightDeck**.

## Out of scope (this change-note)

- New paid packs
- Stripe
- Upstash/Neon sync
- Dorm After Dark
- Small-Town Main Street
- Changing real-party min players to 1

## Release intent (Product Head)

- Prefer stop by Pass 2


## Related deltas

- Staff-night Pass 3: `/workspace/nightdeck/AC-change-staff-night.md`
