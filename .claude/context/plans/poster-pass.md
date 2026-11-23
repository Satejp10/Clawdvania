# v0.2 poster pass: build plan

**Status (2026-11-23): built as v0.2.** The owner said "build v0.2" the same day, which
covers the plan as written, new ending included. It was built from this plan with no new
logic: the patch applied cleanly and gave `69fd3234…`, both checks gave the expected
results, the README images were retaken from Step 3's output, and the docs changed in the
same PR. The rest of this file is the plan as it was written, kept for the record.

The plan was made against v0.1. `poster-pass/index.patch` turns v0.1's `index.html` into a
checked scratch copy byte for byte (checked with `git apply` on a clean copy), so building it
meant applying the patch, running the two checks, updating the docs and opening a PR, with no
new logic to write.

It assumed the answer to question 3 of report SR-clawdvania-005 is "the poster pass goes
first, before the rest of the stable list", and it changes how the ending behaves (Clawd stays
at the door and goes inside), which was the owner's call.

Before and after, side by side: `poster-pass/before-after.jpg` (title, mid-walk, the bench as
night falls, and 13 s after reaching the door).

## Why

The game looks flatter and greyer than its own posters in `Resources/`. Report 005 proposed
closing that gap with Canvas 2D first, because it's the cheapest test of whether WebGL is
needed at all. This is that pass. It also closes audit findings 4 and 5, which sit in the
same drawing code.

## What changes

All drawing, except one small input change at the ending.

1. **A sky like the posters.** Deep indigo overhead and a warm amber band low down, where the
   sun has just set behind the hills. A third, farthest range of hills sits half lost in warm
   haze. The old sun was a pale blob in the top-right corner with god rays. Both are gone.
2. **Home on screen from the first frame.** The far-hill cottage was already drawn, but at a
   spot the camera never shows (0 of 1,281 camera positions). It now stands on a crest at the
   right of the first screen, small and hazy, with two lit windows and chimney smoke, and it
   drifts toward the middle as you walk. It fades out while the camera moves from x 860 to
   1060, before the real cottage's roof comes into view at x 1094, so two cottages are never
   on screen together. The real cottage gets chimney smoke too.
3. **Lights win the night.** The night tint used to be painted over everything, so it dimmed
   the wisps, Clawd's lantern and the lit window too. It now goes under them: the world
   darkens and the lights don't. Wisps are warm gold, not white. The lantern glow is capped
   and warmer (at 10 wisps it used to wash Clawd out in a pale haze). Clawd gets a soft
   contact shadow.
4. **The title on open sky.** "CLAWDVANIA" and "A WALK HOME AT DUSK" in letter-spaced
   capitals like the posters, up in the open sky. "press any key to begin" sits on the dark
   earth at the bottom. Before, the title overlapped a ledge and the prompt sat on a platform.
5. **An ending that closes.** At the door Clawd stops, and input is ignored from then on. The
   window lights, the wisps settle on the eave, and about 4 s in Clawd steps inside: he fades
   as the doorway glows. When the welcome card has faded, night settles and a closing card
   reads "CLAWDVANIA / thanks for walking home". After 11 s any key or tap starts the walk
   again. R still restarts at any time. Before, the card faded and nothing followed, and Clawd
   could walk on past the house.
6. **Audit findings 4 and 5.** Clawd is drawn at a whole number of device pixels per sprite
   pixel, so his eyes no longer change width as he walks (finding 4). `devicePixelRatio` is
   capped at 2 (finding 5).

## Already decided: don't reopen without the owner

| Decision | Why |
|---|---|
| Canvas 2D, no WebGL | The cheapest test of whether WebGL is needed (report 005). Judge this pass before going further. |
| No physics, level or camera changes | The walk must play exactly as before. `--baseline` proves it: 0 differences. |
| One input change: ignore input once the ending starts | A closing sequence needs Clawd to stay put. It also fixes "you can walk right past the cottage" (AUDIT smaller notes). |
| Two cottages are never on screen together | The far one fades out before the real one appears. |
| The far cottage is small, hazy and drawn under the platforms | At full size and colour it read as a house in the playfield, next to the floating ledges. |
| No names on the closing card | Nobody has asked for a credits line. The owner can add one. |
| The haze is baked into the farthest hill layer | It doesn't change sideways, so it scrolls with that layer for free instead of costing a full-screen pass of its own. |

## Cost

The headless browser renders in software, so its frame times mean nothing for real hardware,
only the ratio does. The planned build costs about 15% more per frame than today's (walk scene
at 1280x720: 51.9 ms against 59.2 ms; at devicePixelRatio 2: 211 ms against 254 ms). That's
one more full-screen layer, the farthest hills. The cap on `devicePixelRatio` more than pays
for it on phones, where 3x screens drop to 2x (less than half the pixels). On a 2x laptop
nothing offsets it. If a real device stutters, bake the farthest range into the sky canvas:
it loses its slight parallax but drops the extra pass.

## Before you start

1. Start from a clean tree on a new branch off `main`.
2. Check `index.html` is the file this plan was made against:
   `sha1sum index.html` must give `b7414f3347111c0c16216b19addc9c445ddf13e8` (main at
   `1d4e412`, which is v0.1). If it doesn't, the patch may not apply. Stop and re-plan the
   parts that fail rather than forcing it.

## Step 1: apply the patch

```bash
git apply .claude/context/plans/poster-pass/index.patch
```

```bash
sha1sum index.html
```

Expected: `69fd3234590b059e5f96b510c7428cc713c7c568`. The patch adds 206 lines and removes 77,
all in `index.html`.

## Step 2: the movement checker

```bash
git show HEAD:index.html > /tmp/v0.1.html
```

```bash
node tools/verify.js index.html --baseline /tmp/v0.1.html
```

Expected, about 45 s: `RESULT: PASS (6 checks)`. Reach 13 / 14 / 15 / 15 with door and bench
for every set; soft-lock 0 of 714; handicap 0 of 714 stuck; camera worst case feet at 274 of
288; lockstep `0 tiles differ; 400 random runs, 674,462 ticks compared, 0 differences`.

The checker can't see the ending's input change: its driver resets the ending after every
tick. Step 3 tests that in a browser instead.

## Step 3: the browser check

```bash
node .claude/context/plans/poster-pass/check.js index.html /tmp/pp-shots
```

Expected, about 50 s: `RESULT: PASS (9 checks)`.

- Holding right into the door, Clawd stops 4.5 px left of its centre after sliding 5 px.
- A jump press is ignored.
- A key at 5 s does nothing.
- A key after 11 s starts the walk again (back at x 49, wisps returned).
- No stale jump fires on the first ticks of the new walk.
- R still restarts during the ending.
- At scale 2.5 every eye pixel is 3 device px wide.
- No page errors.

On today's build the same script fails 4 of these: Clawd slides 146 px past the door, a jump
goes up, there is no walk-again, and his eye pixels come out 2 or 3 px wide. That shows it is
testing the change.

Then look at the screenshots in `/tmp/pp-shots` next to `poster-pass/before-after.jpg`.

## Step 4: version and docs, in the same PR

- `#build-version` in `index.html` and the README's Status line: `v0.1` becomes `v0.2`. Change
  both together.
- README "Look:" sentence: it lists god rays, which are gone. Describe the horizon glow and
  the far cottage instead. Mention that the ending now closes and offers the walk again.
- `docs/screenshot.png` (1536x864) and `docs/thumbnail.png` (1200x750): replace them with
  `docs-screenshot.png` and `docs-thumbnail.png` from Step 3's output folder, after looking at
  them. They're framed like the current ones and include the far cottage.
- `AUDIT.md`: mark findings 4 and 5 fixed, with one line each on how. Strike "After the ending
  you can walk right past the cottage" as fixed. Update "Still open".
- This file's status line: built.
- `LOG.md`: an entry for the session.

## Step 5: PR, then the owner plays it once

Open a draft PR. Pages serves `main` only, so the owner downloads the PR's `index.html` and
plays it once, on a phone too if possible. Only a person can judge these:

- whether the sky is too warm or not warm enough;
- whether the far cottage's fade is noticeable;
- the ending's timing;
- smoothness on their slowest device.

## Pitfalls (each came up while prototyping)

- **Don't call a page helper `S`.** The game has a global `S` (its render scale), which hides
  a `window.S` from code run in the page. The check script uses `H`.
- **Load-time code may only use what `tools/verify.js` stubs** (`document`, `window`,
  `matchMedia`, ...). Something like `Path2D` or `OffscreenCanvas` at load time throws a
  ReferenceError in the checker. Inside `render()` is fine: the checker never calls it.
- **Draw the far cottage's windows and smoke right after the far hills, not after the night
  tint.** Drawn after the tint like the other lights, they would show on top of platforms
  passing in front of the cottage: for example the ledge at columns 34–36 when the camera is
  near x 97. That was worked out from the geometry and avoided, not seen on screen.
- **The curve in the ravine's gorge is the far hill's crest,** seen through the slot. Hiding
  the far layer removes it, and it was there in v0.1 too, so it's not a bug. (It was first
  blamed on the new farthest range, which was lowered for it. That diagnosis was wrong, but
  the lower range still looks right, so it stayed.)
- **The far cottage's position is in the far layer's own coordinates.** Its screen x is
  `471 - 0.25 * cam.x`. 471 is a crest of that layer that is on screen at camera x 0.
- **Ending timeline** (seconds after reaching the door): card in 2.2–3.2, Clawd fades
  3.6–4.2, door glow peaks at 4.1, card out 8.5–10, closing card 10–12, walk again after 11.

## Not in this job (suggestions only; don't build unless the owner asks)

- Depth in the ravine: vertical parallax, and roots and moss like the V2 poster.
- 2–3 `air` poses (item 2 of the stable list).
- Out-of-focus autumn leaves in the bottom corners, like the posters.
- On phones, Clawd starts under the right-arrow touch button.
- Reduced-motion handling, a LICENSE and a favicon (AUDIT smaller notes).
