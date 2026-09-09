# PASS10-NOTES — plain finish + graphics

## Phil ask
Clean up the landing page for when they finish, to plain and we need graphics.

## Done
- **end.html:** stripped share-box `<pre>`, trophy ★, type heading, day/name pills.
  Layout is logo → finish.png hero → big score X / Y → one meta line
  (`game type · subject · name · day code`) → Leaderboard · Copy score · New day.
  Copy uses a short one-line `shareText`.
- **Brand:** replaced `.brand-mark` ND text with `assets/logo.png` (`.brand-logo`)
  on index, day, play, board, end + `ui.js` `brandHtml`.
- **Mode icons:** create cards use `icon-trivia.png`, `icon-identify.png`,
  `icon-music.png` (accessible labels via button text; images alt="").
- **CSS:** `.brand-logo`, `.brand-end`, `.finish-hero`, `.mode-icon`, plain end card;
  hide legacy `.trophy` / `.share-box`.
- Assets committed under `assets/` (logo, finish, modes, three icons).

## Out of scope / not flipped
- No new game modes or content rewrite.
- `ready_for_quality` left **no**.

## Verify
- Live Pages should show logo in header and plain end with finish graphic.
