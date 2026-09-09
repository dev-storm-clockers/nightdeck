# PASS 9 — Grade fix + better trivia content

## Bug (confirmed)
Reveal UI called `Game.matchesAccept(opt, item)` for every music/identify option.
`matchesAccept` used `answer.includes(g) || g.includes(answer)` **and** the same loose
`includes` against each `accept` alias.

So for music answer `Hello — Adele` with accept `["hello","adele"]`, options like
`Someone Like You — Adele` and `Rolling in the Deep — Adele` all matched via
substring/`adele`. Same pattern for Queen / Beyoncé / U2 / Whitney / Katy Perry
mono-artist rows. Identify had milder cases (`cup` ⊂ `Paper cup`, `headset` ⊂ accept).

Trivia MCQ was mostly fine (exact `opt === item.answer`) but options were never
shuffled — correct letter was sticky across runs.

## Fix
1. **`js/game.js`**
   - `matchesAccept`: exact normalize on answer + each accept alias; optional
     multi-word consecutive containment for **typed** guesses only. No loose
     single-token `includes` that lights sibling MCQs.
   - `isOptionCorrect(item, opt, idx)`: `idx === correctIndex` OR exact normalize
     to `answer` — never accept-list / includes across options.
   - `gradeAnswer`: trivia = exact normalize to snapshot answer; identify/music =
     exact option match to answer, else `matchesAccept` for typed.
   - `snapshotItem`: **shuffle options**, recompute `correct` / `correctIndex` /
     `answer` so A–D order varies per run.
2. **`play.html` reveal**: `isCorrect = Game.isOptionCorrect(item, opt, idx)` only.
3. **Music**: diversified same-artist distractors; tightened accept lists (song
   phrases; no bare artist that was only useful for broken reveal).
4. **Identify**: tightened mug / headphones accepts + options.

## Smoke
`node scripts/smoke-pass9-grade.mjs`

| Pack | Items | reveal-isCorrect === 1 |
|------|------:|------------------------|
| trivia/general | 24 | 24 |
| trivia/pop | 24 | 24 |
| trivia/movies | 24 | 24 |
| trivia/science | 24 | 24 |
| trivia/geo | 24 | 24 |
| trivia/food | 24 | 24 |
| trivia/decades | 24 | 24 |
| trivia/mixed | 24 | 24 |
| identify | 22 | 22 |
| music | 22 | 22 |
| **Total** | **236** | **236 / 236** |

## Trivia content
Rewrote all 8 subject packs (24 each, 14 easy / 7 medium / 3 hard) toward pub /
staff-night bar: adult-recognizable easy (not Paris/H2O/7-continents gimmes),
satisfying medium, one fair hard brag per pack. Stronger same-domain distractors.
Mixed curated across subjects. Workplace-clean; original phrasing.

## Ready
`ARTIFACT ready_for_quality=no` — Quality owns the flip. Do not ping Phil.
