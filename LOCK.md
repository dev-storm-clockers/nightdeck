# LOCK — NightDeck (Pass 9 grade fix + better trivia)

- **name:** NightDeck
- **spelling_notes:** NightDeck one word
- **slug:** nightdeck
- **demo_vs_sku:** sku
- **in_scope:**
  - **BUG FIX (hard):** Reveal/grading must mark **exactly one** correct option. No substring/`includes` matching that lights up every Adele/Queen option. Trivia uses option index; Identify/Music exact normalized answer (plus explicit accept list only for typed guesses).
  - Shuffle options at run start; keep correct index aligned.
  - **Better trivia content:** replace thin/too-easy or dull items; keep 8 subjects × ≥20 (prefer 24); sellable bar; workplace-clean factual MCQ; stronger distractors; mix of “aha” and accessible — not only grade-school gimmes (Paris/H2O) and not niche traps.
  - Keep subject picker, day link, Upstash, Pass 7 mobile HUD.
- **out_of_scope:** Politics/NSFW; copying quiz banks verbatim; rushing.
- **landing:** github-pages
- **hard_stop_passes:** 2 on this fix+content
- **phil_ok:** 2026-09-09 yes — “some felt like all answers showed right”; “make this better content”; sellable
