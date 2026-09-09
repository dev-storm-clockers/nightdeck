# Pass 4 notes — NightDeck (human voice + party feel)

## Intent (before → after)

Phil: “The game sucks… like a robot wrote it.” Pass 3 shipped the staff-night *mechanics* but the voice still read like product docs.

| Area | Before (Pass 3) | After (Pass 4) |
|------|-----------------|----------------|
| Landing | “Staff night · workplace-clean”, “Built for ~12 over a long hang”, Host/Player kickers, “mock multiplayer” | Host-friend tone: “Cards for the after-hours hang.” Hero punchline. Tips tucked under progressive disclosure. |
| Deck | LLM-ish office clichés (Roman Empire, circling back, fiscal year, main-character energy) | Full rewrite: **40 prompts / 80 answers** — weird, tender, chaotic office-hang energy; no HR-risk spicy; varied rhythm |
| Play UI | Workflow phrasing (“Judge window open”, “short submit · long judge”, phase = raw `submit`) | Game-night phrasing: “You're judging — take your time”, “Play this card”, “That's the winner”, human phase labels |
| Visual | Generic purple SaaS glow + form-stack | Warm ember/amber party palette, bigger prompt cards, clearer hierarchy, sealed-card treatment |

## What shipped
1. **UI copy** — index / play / end rewritten; fewer first-screen instructions; GCU still collapsed.
2. **Deck** — `data/lobby-warmup.json` full rewrite (40/80).
3. **Visual** — `css/site.css` amber/ember party identity; big prompt cards; judge banner clarity.
4. **Play flow** — judge/player prompts feel like a hang, not a workflow.
5. **ARTIFACT** — pass=4, ready_for_quality=no (Build owns flip).

## Kept hard constraints
- Office-safe default; GCU gated/hidden
- ≥12 seats, short submit, long/open judge window
- Solo demo + multi-human ≥3
- NightDeck spelling, Pages deploy, localStorage rooms

## Publish
- Live: https://dev-storm-clockers.github.io/nightdeck/
- Branch: `main` → GitHub Pages (root)

## ready_for_quality
- Set **no**. Build Head owns flip after smoke.
