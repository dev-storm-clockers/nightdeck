# PASS 8 — Trivia subjects (SKU content)

## Why
Phil: site good, trivia sucks. Old `data/trivia.json` was office-joke “gotchas” with opinion answers — not real trivia. Replaced entirely with research-backed subject packs + subject choice on create.

## Research note
Corporate / staff trivia guides (Quizado 2026 corporate quiz guide, Naboo trivia team-building, LearnClash / TriviaEverywhere work-event roundups) converge on the same broad-appeal set: **general knowledge, pop culture, movies/TV, science & nature, geography, food & drink**, plus a **nostalgia / decades** round and a **classic mixed** night so every table can score. Themed-only nights engage deeply but exclude; Mixed is the default “everyone contributes” mode. Difficulty ladder ~60% easy / 30% medium / 10% hard keeps first-timers scoring early.

## Subjects (shipped)
| id | Title | Items | Difficulty |
|----|-------|------:|------------|
| general | General Knowledge | 24 | 14 easy / 7 medium / 3 hard |
| pop | Pop Culture | 24 | 14 / 7 / 3 |
| movies | Movies & TV | 24 | 14 / 7 / 3 |
| science | Science & Nature | 24 | 14 / 7 / 3 |
| geo | Geography | 24 | 14 / 7 / 3 |
| food | Food & Drink | 24 | 14 / 7 / 3 |
| decades | Decades (90s/2000s) | 24 | 14 / 7 / 3 |
| mixed | Mixed Staff Night | 24 | 14 / 7 / 3 curated across all |

**Total:** 192 original factual MCQs. Format `{ q, options[4], correct, difficulty }`. Workplace-clean; no politics / religion / NSFW.

## File layout
- `data/trivia/<subject>.json` — `{ title, subject, items }`
- `data/trivia-subjects.json` — subject card metadata
- `Catalog.loadPack('trivia', subject)` loads the pack; Identify/Music unchanged

## Product wiring
1. **index:** After Trivia selected → subject grid (required before Create / Solo). Identify & Music hide subject step.
2. **Sync.createDay / createSoloDay:** day record stores `subject` (null for non-trivia).
3. **day / play / board / end:** show `Game.typeLine(gameType, subject)`; play loads subject pack; Pass 7 one-tap MCQ + HUD kept.
4. Old joke `data/trivia.json` removed.

## Content bar
- Original phrasing (not copied quiz-bank banks)
- Plausible same-domain distractors
- Spot-checked answers (e.g. Au, 1903 Wright, Parasite Oscar, O− donor, Wellington, Napster→Google/YouTube 2005, iPhone 2007)

## Ready
`ARTIFACT ready_for_quality=no` — Quality owns the flip.
