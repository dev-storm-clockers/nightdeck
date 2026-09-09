# PASS 6 — Day link + live board (white/blue)

**Date:** 2026-09-09 (America/Halifax)  
**Status:** Build complete — ready_for_quality=**no**

## What shipped
- **Theme:** Light white backgrounds, blue accents (#2563eb), slate text — SaaS staff-night, not nightclub.
- **Create day:** Host picks **Trivia | Identify | Music** once + name → permanent link `day.html?d=CODE`.
- **Join:** Open day link → enter name → Start → self-paced 8Q of that type only (no per-round type picker).
- **Live board:** `board.html?d=CODE` polls Upstash ~2s; scores appear as players finish.
- **Solo demo:** Local-only day (`&solo=1`) without Upstash.

## Sync
- Client REST to Upstash Redis (`js/sync.js` + `js/sync-config.js`).
- Key namespace: `nightdeck:day:<CODE>`
- Day JSON: `{ code, gameType, hostName, createdAt, players[{id,name,score,finishedAt}], status }`
- **Public token on Pages:** accepted for MVP (nicknames/scores only). One-line comment in `sync-config.js`.
- **Box-only copy:** `/home/box/agent-data/agents/37c5f7d0-3b9f-4c24-a102-0ada583787f4/nightdeck-sync-config.js` (chmod 600). Source claim file: `…/upstash-redis-claimable.txt`.

## How to try (two browsers)
1. Browser A: open live site → pick a game type → Create day → copy link.
2. Browser A: open **Live board** tab.
3. Browser B (or phone): open the day link → enter name → Start → answer → finish.
4. Board on A updates within ~2s with the new score.

## Smoke
- Upstash SET/GET: PASS (pass6 smoke key).
- createDay / getDay / joinDay / submitScore / listScores: exercised in Build smoke.

## Out of scope (held)
- Multi-type mix nights; Neon; Worker proxy; blank-fill.
