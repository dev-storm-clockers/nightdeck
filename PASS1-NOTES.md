# Pass 1 notes — NightDeck

## What works
- Static tree: index / play / end + css + js + two decks
- Create room → code; join via code in another same-browser tab; start gated at ≥3 players
- Lobby Warmup free path end-to-end: prompt draw, hand submit, blind sealed cards, judge pick, score++, rotating judge, round cap or host End night → shareable results (copy)
- Group Chat Unhinged stub present; gated by `NIGHTDECK-GCU`; not required for happy path
- Dark mobile-ok CSS; NightDeck spelling exact

## Gaps (Pass 2)
- No real multiplayer backend / Pages URL yet
- Unlock polish (clearer paywall copy)
- play.html light poll as BroadcastChannel backup
- Cross-device rooms need Upstash (or similar)

## Skill friction
- **LOCK.md:** Helped — clear in/out, spelling, deck names, mock vs Stripe, landing pick. Low friction.
- **ARTIFACT.md:** Helped — frozen file layout + Pass 1 intent meant no inventing structure. Updating ready_for_quality without Quality STOP/GO was clear.
- **VERIFY.md:** Neutral/hurt slightly — still TBD done_bar; correctly says do not start until ready_for_quality=yes, so Build could ship without verifier conflict. Would help more once AC is mirrored into done_bar.
- **AC-accepted.md:** Helped most for hard stops (4) — implementer could map UI phases directly. Having it on disk beat hunting chat.
