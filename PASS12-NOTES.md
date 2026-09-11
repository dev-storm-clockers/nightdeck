# PASS12-NOTES — Music harder + visual

## Phil ask
Music round too easy (everyone ~8). Make it harder + more visual.

## Changes
1. **Purged** `data/music.json` famous lyric gimmes (Bohemian / Don’t Stop Believin’ / Happy / Rickroll / I Gotta Feeling / peers). Bank rebuilt to **22 items**.
2. **Harder mix (majority):** obscure/deep-cut lyric fragments; name-the-album without song title in cue; decade/year without title giveaway.
3. **Visual cues:** optional `image` field → original abstract SVG album cards under `assets/music/` (10 cards, reused). No scraped/hotlinked commercial art.
4. **Distractors:** same-artist / same-era / near-miss wrong options.
5. **UI:** `play.html` + `css/site.css` — `.music-card` / `.music-card-img`; mobile-readable; desktop beside-cue layout; items without `image` still work.
6. **game.js:** music snapshot passes `image` through.
7. **Untouched:** Payment HOLD · Dungeon Dad · Surface Lab/Meridian · Lilly · Trivia + Identify · Pass 9 grading · Upstash board · NightDeck brand.

## Asset paths
- `assets/music/card-violet-grid.svg`
- `assets/music/card-amber-rings.svg`
- `assets/music/card-teal-prism.svg`
- `assets/music/card-crimson-slash.svg`
- `assets/music/card-indigo-wave.svg`
- `assets/music/card-lime-blocks.svg`
- `assets/music/card-magenta-orbit.svg`
- `assets/music/card-navy-stripe.svg`
- `assets/music/card-coral-burst.svg`
- `assets/music/card-slate-mosaic.svg`

## Sample cues
- “A heart that's full up like a landfill…” → Fake Plastic Trees — Radiohead
- Which Radiohead album includes Exit Music (For a Film) and No Surprises? → OK Computer
- In which decade did Talking Heads release Remain in Light? → 1980s
- Which Pixies album opens with Debaser? → Doolittle

## Smoke
- Serve: `python3 -m http.server 5180 --directory /workspace/nightdeck`
- URL: http://127.0.0.1:5180/
- Confirm Music mode loads harder bank + images.

## ready_for_quality
**no** — Build holds flip until smoke/spot-check; Prefer STOP after Quality GO.
