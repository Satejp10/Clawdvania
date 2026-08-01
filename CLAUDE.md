# Working on Clawdvania

## How to end every response

**Finish every response with a TLDR.** Not a recap of what you just said — a
standalone executive summary. Someone who reads *only* the TLDR should come away
with the full picture and be able to make a decision from it.

It needs three things:

1. **State** — where things actually stand right now.
2. **Recommendation** — the single next step you'd take, named plainly.
3. **Why** — the reasoning, plus rough cost and risk, so the recommendation can
   be accepted or overruled on its merits.

Write it the way an engineer briefs an executive: decision-complete, not
exhaustive. Detail that wouldn't change the decision belongs in the body of the
response, not the TLDR. Have an opinion and say it — when there's a genuine
trade-off, recommend one option and note the fallback rather than laying out a
menu. Suggestions beyond what was asked are welcome, as long as they're flagged
as suggestions and don't get built unasked.

## The project

A single self-contained `index.html` — vanilla JS + Canvas 2D, no engine, no
build step, no asset files, runs from `file://`. Everything lives in that one
file; there is nothing to install and no test suite to run.

Live at https://satejp10.github.io/Clawdvania/ (GitHub Pages, served from
`main`). Note the capital C — the lowercase path 404s.

**Scope, decided 2026-08-01:** it's a **portfolio piece**, so when polish and content
compete, polish wins. It stays a **five-minute vignette** — the agreed vertical addition
is *one* ravine, not a second area. "One file" is locked, but data URIs satisfy it, so
that constraint doesn't block asset-shaped work. Proposed and not yet confirmed: no fail
state, no timer or score, no backtracking.

Things worth knowing before changing it:

- **Movement constants live in the `TUNING` object** at the top of the file.
  Jump physics are *derived* from an intended apex and time-to-apex rather than
  hand-set, so change the intent and the gravity/velocity follow.
- **The simulation is fixed-timestep at 60Hz** with an accumulator. Rendering is
  separate and runs on whatever `dt` the browser gives. Don't move physics into
  the render pass.
- **Verify movement changes by simulation, not by eye.** Extracting `LEVEL` and
  `TUNING` and running a headless replica of the physics — then a reachability
  search over it — catches things playtesting misses, like a platform that
  quietly became unreachable or a wall that became climbable when it shouldn't be.
- **Headless browser rendering is very slow** (single-digit FPS). To test game
  logic in a browser, drive the update function synchronously inside
  `page.evaluate` so the render loop can't interleave and make results
  nondeterministic.
- **The world is bounded by code, not by tiles.** Solidity outside the room is
  handled in `solidAt`; don't add boundary tiles to `LEVEL` to compensate.

`AUDIT.md` tracks known issues and what's still open.
