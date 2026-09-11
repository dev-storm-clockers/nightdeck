# PASS13-NOTES — Trivia harder

## Phil ask
Trivia still too easy after Pass 12 Music. Harden all subjects; purge pub-quiz gimmes.

## Changes
1. **Rewrote all 8** `data/trivia/<subject>.json` banks toward medium–hard (no `easy`).
2. **Counts:** 24 items each (stay ≥20). Majority `hard`; remainder `medium`.
3. **Gimmes purged:** yen/Japan, Iron Man, Nile, GPS, Central Perk, Finding Nemo, boiling point, I Want It That Way title-giveaways, etc.
4. **Distractors:** same-era / adjacent / near-miss options (e.g. Trianon vs Versailles; Naughty Dog peers; Pinot vs Cabernet Burgundy).
5. **Schema unchanged:** `{ q, options[4], correct:index, difficulty }` — Pass 9 grading path in `game.js` untouched.
6. **Untouched:** Payment HOLD · DD · SL/Meridian · Music Pass 12 (`data/music.json` 22 items) · Identify · Lilly · brand/UI.

## Per-subject counts (hard / medium)
| Subject | n | hard | medium |
|---------|---|------|--------|
| general | 24 | 16 | 8 |
| pop | 24 | 16 | 8 |
| movies | 24 | 19 | 5 |
| science | 24 | 15 | 9 |
| geo | 24 | 14 | 10 |
| food | 24 | 14 | 10 |
| decades | 24 | 17 | 7 |
| mixed | 24 | 19 | 5 |

## Sample hard Qs
- General: Which treaty formally ended World War I for Germany in 1919? → Versailles
- Pop: Virgil Abloh was artistic director of menswear at which house until 2021? → Louis Vuitton
- Movies: In “Mad Men,” Don Draper’s birth name is? → Dick Whitman
- Science: CRISPR-Cas systems originated as bacterial defenses primarily against? → Bacteriophages
- Geo: The Durand Line forms much of Afghanistan’s border with? → Pakistan
- Food: Traditional béarnaise is distinguished from hollandaise mainly by which herb? → Tarragon
- Decades: Which 1997 album includes “Paranoid Android” and “No Surprises”? → OK Computer
- Mixed: Umami was linked to which compound isolated from kombu? → Glutamate / MSG

## Smoke
- Serve: `python3 -m http.server 5180 --directory /workspace/nightdeck`
- URL: http://127.0.0.1:5180/
- Confirm Trivia subjects load; spot-check no famous gimmes; Music still Pass 12.

## ready_for_quality
**no** — Build holds flip until smoke/spot-check; Prefer STOP after Quality GO.
