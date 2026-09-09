# PASS 7 — NightDeck game-night + mobile lock-in

## Phil feedback addressed
- Lock-in failed on mobile (select then Lock, sticky dock covering controls).
- Wanted video-game-night quality: clear concise cards, not wordy website pages.

## Mobile lock-in fix
- **MCQ:** tapping an A–D option immediately locks + reveals (one gesture). Brief selected flash, then correct/wrong styling.
- **Typed path** (Identify/Music): input + Lock in kept; Lock `min-height: 48px`, full-width on narrow screens; `touch-action: manipulation`.
- Removed sticky play-dock over options. Primary **Next / Finish** lives in a **fixed bottom action bar** with `env(safe-area-inset-bottom)`. Play app has bottom padding so options never sit under the bar.
- Smoke mindset at ~390px: options ≥56px tall, no dock dead zone over choices.

## Presentation
- CSS rewrite: larger rounded cards, bold short labels, score chip, Q progress bar, glowing selected/correct/wrong states.
- Index: three game-type cards + name + Create (marketing paragraphs cut).
- Day: code + name + Start.
- Play: HUD chrome + prompt + options only.
- Board: ranked live list, short meta.
- End: podium score card + share.

## Unchanged
- Upstash sync (`sync.js` / `sync-config.js`), packs under `data/*.json`, game grading (`game.js`).
- `ready_for_quality` stays **no**.

## Verify
- Live Pages after push: https://dev-storm-clockers.github.io/nightdeck/
- Create day → join → tap options on phone-width → Next → board poll.
