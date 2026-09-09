# Pass 3 notes — NightDeck (staff-night cut)

## What shipped
1. **Workplace-clean Lobby Warmup** — original office-safe prompts/answers (meetings, Slack, staff hang humor). Default free path only.
2. **12 seats** — `MAX_PLAYERS = 12` enforced on join; lobby shows seat count.
3. **Short rounds / long judge** — hand size 4 for faster submit; judge phase has **no auto-advance**; soft 60-minute window messaging (pause-friendly for ~5h hang).
4. **Solo demo** — host “Solo demo (fill bots)” seats bots to min 3; bots auto-submit / bot-judge auto-picks. Optional “Pad seats to 12”.
5. **Visual refresh** — clearer hierarchy (kickers, primary cards), nicer prompt/answer cards, lobby/end polish, mobile tweaks.
6. **GCU de-emphasized** — collapsed under “More packs (optional) — not needed for staff night”; still unlock-gated; not featured.

## Kept
- NightDeck spelling
- localStorage + BroadcastChannel rooms
- Shareable end
- Rotating judge + scores

## Publish
- Repo: https://github.com/dev-storm-clockers/nightdeck
- Pages: root of `main` · **Live:** https://dev-storm-clockers.github.io/nightdeck/
- PAT: classic studio token via env for push — never printed.

## How host runs a staff night
1. Open https://dev-storm-clockers.github.io/nightdeck/ on a laptop (same browser profile for mock sync, or one shared machine with tabs).
2. Create room with **Lobby Warmup** (default). Copy the room code.
3. Up to **12** people join with the code (new tab each, same browser for this mock — or pad with bots for rehearsal).
4. Host hits **Start NightDeck**. Players submit quickly each round; **judge takes as long as needed** (step away OK).
5. Host **End night** anytime (or after round cap) → shareable results.

**Solo test:** Create room → **Solo demo (fill bots)** → Start → play full loop alone.

## ready_for_quality
- Set **no**. Build Head owns flip to yes after Build smoke.

## Skill friction
- **LOCK.md / AC-accepted staff note:** Helped — clean deck, 12 seats, short/long timing, solo, hide GCU. Low friction.
- **ARTIFACT.md:** Helped — pass=3 + ready_for_quality ownership reminder.
- **AC-change-solo-visual.md:** Helped — solo hard stops + visual must-holds without new mechanics sprawl.
