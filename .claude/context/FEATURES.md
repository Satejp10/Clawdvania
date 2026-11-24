# Clawdvania: features

Every feature in one place: what's built, what's planned, what's only an idea, and what's
been ruled out. The details live in the linked plans, [`LOG.md`](LOG.md) and
[`AUDIT.md`](../../AUDIT.md); this file is the index. When a feature changes state, or the
owner suggests a new one, update this file in the same commit.

Last updated 2026-11-24, for v0.3.

## Built

"v0.1" means everything up to 2026-11-18, when the version label was added.

| Feature | Version |
|---|---|
| **The walk home.** From the start to the cottage in about five minutes, over three ditches you can drop into and climb out of. A welcome-home card appears at the door. | v0.1 |
| **Movement.** Run and jump: tap for a hop, hold for a full jump. 100 ms of coyote time and a 120 ms jump buffer. Every movement number is in `TUNING`. | v0.1 |
| **Double jump.** One extra jump in the air, given back by landing or catching a wall. | v0.1 |
| **Wall cling.** In the air, hold toward a wall to hang on and slide slowly. Jump to kick off. | v0.1 |
| **15 wisps.** They circle Clawd, and his glow grows with each one. Two sit on a secret ledge. Plain running and jumping reach 13; the 14th needs the double jump and the 15th the cling. | v0.1 |
| **The ravine.** An optional pocket under the third ditch with three wisps, a fixed camera that tilts down, and rungs to climb out by with plain jumps. Nobody needs it to finish. Plan: [`plans/ravine.md`](plans/ravine.md). | v0.1 |
| **Dusk and the bench.** The light fades as you walk. Stand still on the bench and Clawd sits while the camera looks out over the meadow. | v0.1 |
| **Sound.** Wind, footsteps, a chime for each wisp and a swell at the end, all made in code with no sound files. M mutes. | v0.1 |
| **Phones.** Touch buttons for left, right and jump, and a prompt to turn the phone sideways. | v0.1 |
| **Restart and debug.** R restarts the walk with every wisp back in place. The backtick key shows a debug overlay. | v0.1 |
| **Version label** in the bottom-right corner, hidden on touch screens. | v0.1 |
| **The poster look.** An indigo sky with an amber horizon, three ranges of hills, the cottage on the far hill from the first screen, lights that stay bright as night falls, gold wisps, a soft shadow under Clawd, and the title on open sky. Plan: [`plans/poster-pass.md`](plans/poster-pass.md). | v0.2 |
| **An ending that closes.** Clawd stops at the door and steps inside, then a closing card appears. After 11 s any key or tap starts the walk again. | v0.2 |
| **Even pixels.** Clawd is drawn on whole screen pixels, and sharpness is capped at 2× to save work on phones (audit findings 4 and 5). | v0.2 |
| **Jump poses.** Clawd crouches for the first 3 ticks of a jump (the anticipation, shown while the jump is already under way, so it adds no delay), rises with his legs trailing and his eyes up, hangs at the top with his legs splayed (v0.2's one air pose), and falls with his arms flung up and his eyes on the ground. The pose follows his speed, so hops, wall kicks, the double jump and ledge drops all get it. Drawing only: the physics is unchanged. | v0.3 |
| **A credit line on the closing card:** "by Satej Patil · made with Claude Code", the owner's wording. | v0.3 |

## Planned

The owner accepted the four-item "stable" list on 2026-11-24: (1) the ravine, (2) per-frame
durations, then an anticipation frame and 2–3 `air` poses, (3) audit findings 4 and 5, and
(4) the smaller notes. Items 1–3 are built; item 2's poses came in v0.3. Only the smaller
notes are left, and once they're built the game is "stable".

| Feature | When |
|---|---|
| **The open smaller notes in `AUDIT.md`.** Count wisp pickups in the fixed 60 Hz step instead of the render pass, rename `const screen`, respect the reduced-motion setting, and add a LICENSE and a favicon. | After v0.3 merges. The last item on the "stable" list. |
| **The claude-works submission.** | Paused until the game is "stable" (the owner's call, 2026-08-01). |

## Ideas

Not agreed and not planned. Each one needs the owner's yes, then a plan.

### Breakable floors and a downward slam

*The owner's idea, 2026-11-23. On 2026-11-24 the owner kept it as an idea: a possible
mechanic, not planned.*

- Some floors crack and crumble when Clawd walks on them, but they never give way. That
  hints that something is underneath.
- A new move from the air: Clawd drives straight down, like Hollow Knight's Desolate Dive,
  and a cracked floor breaks under him to open a secret area.

Settled by the owner, 2026-11-24, for if it's ever planned:

- **A slam, not a slash.** The game has no combat.
- **Small pockets, not a second area,** like the ravine's hollows.
- **Clawd has the move from the start,** like the double jump and the cling.

Still to settle before planning (suggestions):

- **Controls.** Down isn't used on the keyboard today, so Down in the air could trigger it.
  Phones only have left, right and jump, so they'd need a fourth button.
- **Safety.** Every secret area needs a way out with plain jumps. Broken floors come back on
  R and on "walk again". `tools/verify.js` has to learn the new move and the new tiles.

### Smaller ideas

- **Depth in the ravine.** The background moves up and down too, with roots and moss like
  the V2 poster. From the poster-pass plan.
- **Out-of-focus leaves** in the bottom corners, like the posters. From the poster-pass plan.
- **Move Clawd's start on phones.** He seems to start under the right-arrow button. That was
  seen on an emulated phone, not a real one, so check it in the phone playtest.
- **A third octave of wisp chimes.** Wisps 13–15 repeat the notes of 7–9. From the ravine
  plan.
- **A nudge toward the ravine** for players who never look down. Wisp 13 is the only lure.
  From the ravine plan.
- **A different sound below the ravine's lip,** such as muffled wind or a drip. From the
  ravine plan.
- **A WebGL lighting pass:** real light, a moving sky, bloom. On hold, and only if v0.2 still
  falls short of the posters. Notes: Box, `overhaul-direction-2026-11-18.md`.

## Ruled out

Don't bring these back unless the owner reopens them.

- **A second area.** The game is a five-minute walk with one optional ravine (2026-08-01).
- **Combat.** The README promises "none of the combat".
- **Gating the walk home behind a move,** like the raised wall of Satejp10/Clawdvania#12
  (2026-11-16).
- **A 3D rewrite** (2026-11-18). It would be a different game.
- **A fail state, a timer or score, or backtracking.** Proposed on 2026-08-01, confirmed by
  the owner on 2026-11-24. Backtracking means returning to earlier areas; a local trip like
  the ravine is fine.
