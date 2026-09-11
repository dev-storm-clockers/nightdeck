# NightDeck Pass 12 — Music harder + visual

**When:** Phil YES 2026-09-11 — Music round too easy (everyone ~8).  
**Live:** https://dev-storm-clockers.github.io/nightdeck/  
**Owner implement:** Build Head. Product owns this AC.  
**Budget:** one pass → Pages → STOP-GO. Prefer STOP.  
**Lilly / CF:** Pages-first. Flag CoS if Cloudflare host needed beyond Pages. No Lilly unless Phil yes.  
**Untouched:** Payment HOLD · Dungeon Dad · Surface Lab/Meridian · Trivia/Identify playable.

## Goal
Make **Music mode** harder and more visual so a mixed staff table doesn’t all max the round. Kill famous lyric gimmes.

## Hard stops (Verifier)
1. **`data/music.json` purged of famous lyric gimmes** — no Bohemian / Don’t Stop Believin’ / Happy / Rickroll-style “everyone knows the line” items (and peers of that ease).
2. **Harder cue mix** across the bank (majority of items):
   - short obscure / deep-cut lyric fragments, **and/or**
   - name-the-album (or era) from a description **without** the song title in the cue, **and/or**
   - year/decade questions without giving the title away in the prompt
3. **Visual prompts:** Music items can show an **image on the cue** (album-style card). Prefer **original illustrated / abstract stand-in** covers we own under `assets/` — **do not** scrape or hotlink commercial album art without rights.
4. **Distractors:** same-era / same-artist / near-miss wrong answers so guessing isn’t free.
5. **Score spread intent:** a mixed staff table should not all max Music in a normal round (Verifier: spot-check that remaining cues aren’t radio-ubiquitous openers).
6. **Keep:** Trivia + Identify playable; Pass 9 grading exactness; NightDeck spelling/brand; Upstash board path intact if already live.
7. **ARTIFACT.md** notes Music changes + any new asset paths.

## Must-holds
- Enough Music items for a full staff round (don’t shrink the bank empty).
- Mobile-readable image cards; `prefers-reduced-motion` OK (static image fine).
- Accept strings still grade cleanly (Pass 9).

## Out of scope
Audio playback / Spotify · licensed commercial cover scans · payment · Dungeon Dad · Surface Lab · Lilly · CF migrate unless CoS/Phil asks

## Success
Music feels like a real quiz round, not a sing-along. Prefer STOP after Quality GO.
