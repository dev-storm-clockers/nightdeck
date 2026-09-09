# PASS 5 — NightDeck quiz-night pivot (completed rebuild)

**Date:** 2026-09-09  
**Status:** completed rebuild

## What changed
- **Genre pivot:** Blank-fill / Cards-Against-style play removed as primary experience.
- **Staff Night:** Host-run mix of **Trivia**, **Identify**, and **Music** short rounds for ~12 people.
- **play.html:** Full rewrite to match `js/game.js` exports:
  - Host picker (`startRound` trivia|identify|music)
  - Players lock answers (`lockAnswer`)
  - Host reveal + scores (`revealRound`); host can `markCorrect` on Identify/Music
  - `backToPicker` / `endNight`
- **end.html:** Quiz-night podium + `shareText`; no deckSnapshot card-era copy.
- **Data:** `data/trivia.json`, `identify.json`, `music.json` (card packs deleted earlier in pivot).
- **index.html / room.js / catalog.js / game.js:** Already on Staff Night path; wired as-is.

## Smoke (logic)
- Create room → join second human → solo bots → `startNight`
- One Trivia + one Identify + one Music round → reveal → scores → `endNight` → share text
- Node stub smoke: **PASS**

## Artifacts
- `ARTIFACT.md` → pass=5, ready_for_quality=no, quiz data entrypoints, live Pages URL
- AC: `AC-pivot-quiznight.md` + `LOCK.md` genre_pivot

## Deploy
- Commit + push `main` → GitHub Pages https://dev-storm-clockers.github.io/nightdeck/
- Expect Staff Night lobby (“trivia, identify, music”), not “Deal the weirdest cards”.

## How to host a night
1. Open live URL → **Open a room** with your name.
2. Share the 5-char code; others **Join the table** (same browser for now).
3. Optional: **Solo demo (bots)** to dry-run alone.
4. **Start Staff Night** → on play screen pick Trivia / Identify / Music each round.
5. Players lock answers; host **Reveal** → scores update → **Next round** or **Call it a night** → podium.
