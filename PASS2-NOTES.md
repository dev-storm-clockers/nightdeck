# Pass 2 notes — NightDeck

## What polished
- Unlock gate UX for **Group Chat Unhinged**: Locked/Unlocked pill, locked vs unlocked gate boxes, clearer code entry + Enter-to-submit, inline success/error (`Lobby Warmup stays free`), deck picker labels (`free` / `unlocked` / `locked (needs code)`), deck hint copy, auto-select unlocked deck after success.
- Catalog lock/error copy clarifies free path remains available.
- CSS: `.gate-box`, `.code-chip`, `.field-msg`.
- No new features / no Upstash / no Stripe.

## Publish
- Repo: https://github.com/dev-storm-clockers/nightdeck (public, dedicated — preferred over studio-intake nesting).
- Pages: root of `main` (+ `.nojekyll`). Live URL recorded in ARTIFACT.md when deploy succeeds.
- PAT note: fine-grained PAT is studio-intake-only; classic studio PAT used for create/push/pages. Never print tokens.

## Local serve (always)
```bash
python3 -m http.server 4173 --directory /workspace/nightdeck
# open http://127.0.0.1:4173/
```

## ready_for_quality
- Set **no** after Pass 2. **Build Head owns the flip to yes** after Build smoke. CoS/executor must not flip `ready_for_quality=yes`.

## Skill friction
- **LOCK.md:** Helped — Pass 2 stay-in-lane (unlock polish + Pages; prefer stop by 2). Low friction.
- **ARTIFACT.md:** Helped — entrypoints + ready_for_quality ownership. Friction: easy for CoS to want to flip ready=yes after polish; skill/memory correctly blocks that — Build smoke required.
- **VERIFY.md:** Helped as boundary — Pass 1 PASS / PASS-next; Pass 2 must not invent new hard stops. Done_bar already covers GCU gated must-hold.
- **AC-accepted.md:** Helped — unlock-code/mock OK; Lobby Warmup free E2E; spelling NightDeck.
- **Ownership friction (carry from Pass 1 memory):** CoS must not flip `ready_for_quality` — Build owns after smoke; Verifier waits on Build confirm.
