# Clawdvania — project audit

Fresh review of `index.html` (1512 lines) at `02f1e02`. Every finding below was
verified by running the code, not by reading it: a headless replica of the physics
(`updatePlayer` / `moveAxis` extracted verbatim) for simulation and reachability,
and Chromium via Playwright for rendering and state-machine probes.

**Verdict:** the game is in good shape. The feel layer is well built — derived jump
physics, coyote/buffer forgiveness, fixed timestep with an accumulator, a camera with
deadzone and lookahead — and the art holds up. The level is fully solvable. Two real
defects are worth fixing, both in the "the walk breaks" category rather than the
"crashes" category.

---

## What was verified as sound

Stated up front because it's most of the file.

| Check | Method | Result |
|---|---|---|
| Level integrity | parse all rows | 26 rows, all exactly 112 chars |
| Wisp reachability | BFS over 16,054 grounded states | **12/12 reachable**, including both secret-ledge wisps |
| Bench sit-trigger | same BFS | reachable |
| Cottage door / ending trigger | same BFS | reachable |
| Collision resolver correctness | 12,696,380 brute-forced resolutions from every legal position at every realistic speed, compared against a nearest-blocking-tile reference | **0 disagreements** |
| Anti-tunneling | `maxFallSpeed` 300 → 5px/step; `runMax` 140 → 2.3px/step vs `TILE` 16 | safe margin |
| Load health | Chromium console + `pageerror` | no errors, no warnings |
| Audio autoplay policy | `AudioContext` constructed inside a user-gesture handler | correct |
| Low-framerate behaviour | forced ~4.5 FPS (software render) | degrades to slow-motion, no spiral of death |
| Security surface | no external requests, no `eval`, no dynamic `innerHTML` | nothing to flag; works from `file://` |

`moveAxis` deserves a specific note: it keeps iterating candidate tiles after
resolving a hit instead of breaking, which *looks* like it could snap the player to
the wrong tile. It cannot, in this level, at these speeds — the hitbox (14×10) can
only ever span two tiles per axis, and the brute-force sweep above found zero cases
where it differs from a correct nearest-tile resolver. It is worth a comment, not a
rewrite.

---

## Findings

### 1. The three floor gaps are invisible-floored traps — not holes · **high** · ✅ FIXED

> **Resolved.** The level gained a fully solid bottom row, so the gaps now bottom out in drawn
> earth two tiles down and read as ditches. Collision is byte-identical (the player still rests
> at `y = 406`); what changed is that there is now terrain under him and 16px more camera
> headroom (`cam.y` clamps to 144 instead of 128). The `y > ROOM_H + 64` respawn is still
> unreachable, but that is now correct rather than a gap — the world is floored everywhere.
> Kept below for the record.


`solidAt` treats everything below the room as solid (`index.html:155`), and the level
has three gaps in the floor rows (`index.html:138-139`) at columns 20–23, 46–49 and
68–72. Nothing is drawn below row 25, so Clawd falls 32px through what looks like a
hole and lands on invisible geometry at `y = 406` — feet at exactly `y = 416` = `ROOM_H`
— pinned to the very bottom edge of the frame with parallax hills visible behind him.

The first of these is **17 tiles from spawn**. Simulating "hold Right, never jump" from
spawn: falls in at t≈2s, then sits wedged against the pit's right wall at `x = 370`
indefinitely.

Two aggravating details:

- The safety net at `index.html:630` (`if (player.y > ROOM_H + 64) resetPlayer()`) is
  **dead code**. `y` tops out at 406, so it can never fire.
- It isn't a soft-lock — a jump escapes in 0.45s — so it reads purely as a graphical
  fault rather than a hazard.

**Fix options**, cheapest first:

- Return `false` for `py >= ROOM_H` in `solidAt` and let the existing respawn catch it.
  Turns the gaps into a gentle reset. Costs the game its no-fail-state feel.
- Bake earth below the floor rows so the gaps read as shallow ditches you hop out of.
  Preserves the tone; the jump distance already supports it (a 4-tile gap needs ~64px,
  a full-speed jump carries ~79px).
- Fill the gaps and move the challenge to the platforms above.

The middle option best matches "none of the combat, all of the atmosphere".

### 2. `R` after the ending leaves the game unfinishable until reload · **high** · ✅ FIXED

> **Resolved.** `resetPlayer()` is now position-only (still what the out-of-bounds net wants) and
> `R` calls a new `resetRun()` that also restores `game.state`/`ended`/`endT`, zeroes `wispCount`,
> resets `playT`, and returns every wisp to `idle` at its home spot. Verified in-browser: collect
> 3 wisps → reach the door → ending fires → `R` → `{state: "play", ended: false, endT: 0,
> wispCount: 0, 12 idle, player at [49, 374]}`, and walking back to the door fires the ending a
> second time (`canReplayEnding` went from `false` to `true`). Kept below for the record.


`resetPlayer` (`index.html:546-556`) resets the player and camera and nothing else.
After the ending has fired, pressing `R` leaves `game.state === "ending"`,
`game.ended === true`, `game.endT` still counting, `wispCount` un-zeroed, and every
collected wisp still in `orbit` or `lantern` state.

Verified in-browser: after `R`, Clawd returns to spawn while already-delivered wisps
stay parked at the cottage eave, and walking back to the door does **not** re-trigger
the ending (guard at `index.html:660`). The player replays the entire walk with no
ending, no window-lighting and no swell.

The README documents `R` as "Reset to spawn", which is literally accurate — the bug is
that after the ending, resetting the player alone isn't a coherent state.

**Fix:** split `resetPlayer()` (position only, used by the pit safety net) from a
`resetRun()` that also restores `game.state`/`ended`/`endT`, zeroes `wispCount`, and
returns every wisp to `idle` at its home spot. Bind `R` to `resetRun`.

### 3. Room boundary walls render as dark pillars in the sky · **medium** · ✅ FIXED

> **Resolved, with a correction to the fix below.** Blanking *every* row, as originally written,
> was wrong on two counts once the ditches and the cling had landed:
>
> - The bottom three rows are floor. Blanking those would open a one-tile-wide, three-tile-deep
>   well at each end of the world, escapable only by a pixel-perfect jump (48px needed against a
>   49.3px apex). Cols 0 and 111 are now empty in the **sky rows only** (0–23); the floor rows
>   keep theirs.
> - `wallAt` probes `player.x - 1`, and `solidAt` returns `true` for anything outside the room —
>   so the cling grabbed the *invisible* boundary. Simulated: 6 kick-offs put the player at
>   `y = -41`, above the top of the room, hanging on nothing. Blanking the tiles alone would have
>   made this worse, not better, by removing the thing you appeared to be holding. `wallAt` now
>   returns `false` for `px < 0 || px >= ROOM_W`.
>
> Verified after: BFS still finds **12/12 wisps**, the bench and the door (16,237 states, up from
> 16,054 — the extra states are the reclaimed tile at each end); running into either edge stops at
> `x = 0` / `x = 1778` still grounded; and a cling probe swept across the whole room at sky height
> finds nothing to hang from. Kept below for the record.


Columns 0 and 111 are `#` in all 26 rows, so they bake into `tileCv` as full-height
earth columns. Both are on-camera: `cam.x` clamps to `[0, 1264]`, and column 0 is
visible **at spawn** — it's in frame on the title screen as an unexplained dark strip
running floor to sky.

They're also redundant. `solidAt` already returns `true` for `px < 0 || px >= ROOM_W`
(`index.html:153`), so the room is bounded whether or not those tiles exist.

**Fix:** change the first and last character of every `LEVEL` row to `.`. Collision is
unchanged (verified: the player still snaps at `x = 0` and `x = ROOM_W - w`) and it
reclaims a tile of walkable space at each end.

### 4. Fractional render scale makes Clawd's pixels uneven · **low**

`S = Math.min(pw / VIEW_W, ph / VIEW_H)` (`index.html:1181`) is fractional at
essentially every common resolution — 2.5 at 1280×720, 3.75 at 1920×1080 — and the
sprite is drawn with `imageSmoothingEnabled = false` at that scale
(`index.html:1326-1332`).

Measured directly from the rendered canvas at S=2.5: the same 1-px eye feature
rasterizes **2 device px wide at one sub-pixel phase and 3 px at another**. Since the
phase shifts as Clawd walks, his eyes visibly change width while moving.

**Fix:** draw the sprite at `Math.round(S)` (or pre-scale the baked frames by an integer
factor) and position it on a whole device pixel, while leaving the painterly world on
the fractional scale. The deliberate crisp-mascot-against-smooth-world contrast is the
right call; it just needs an integer scale to actually land.

### 5. `devicePixelRatio` is uncapped · **low**

`screen.width = Math.round(innerWidth * dpr)` (`index.html:1173-1174`) has no ceiling,
and `render()` performs roughly a dozen full-viewport composite passes per frame (sky,
stars, three parallax layers, tiles, dusk fill, foreground, vignette). On a 4K panel at
`dpr` 2 that is ~33 Mpx × ~12 ≈ 400 Mpx of fill per frame, ~24 Gpx/s at 60Hz — enough
to cost frames on integrated graphics.

The source art is 512×288 and is upscaled regardless, so past roughly 2× there is no
detail to recover. `dpr = Math.min(window.devicePixelRatio || 1, 2)` is close to free.
Tradeoff: HUD text is drawn at native resolution (`index.html:1394-1395`), so a cap
softens it slightly.

---

## Smaller notes

- ~~**`wispCount >= 12` is hardcoded** in the end card (`index.html:1469`). Should be
  `WISP_SPOTS.length` — add a thirteenth wisp and the "every last wisp" line silently
  stops being reachable.~~ ✅ **Fixed** — now reads `WISP_SPOTS.length`.
- **Gameplay state lives in the render pass.** `updateWisps` (`index.html:1335`) sets
  `wispCount` and gates the ending, but runs from `render()` on variable `dt` rather
  than in the fixed-step loop. The margin is comfortable today (~7px of player movement
  per render frame at 20 FPS against a 15px pickup radius), but collection is
  framerate-dependent, which the rest of the sim carefully isn't.
- **`render()` mutates `game.t`, `playT`, `game.tfade`, `game.endT`.** Documented and
  coherent, but the sim/render split is leakier than the comments imply.
- **`const screen` shadows `window.screen`** (`index.html:1165`). There's already a
  comment and a `window.screen` workaround at the orientation lock — rename it (`cvs`)
  rather than keep working around it.
- **After the ending you can walk right past the cottage** to the boundary wall.
- **No `prefers-reduced-motion` handling.** The whole game is motion, so a full
  accommodation isn't realistic, but the title card's `tilt` keyframe animation and the
  drifting leaves are cheap to gate.
- **No LICENSE file** on a public repo.
- **No favicon**, so anything serving this over HTTP takes a 404 per load. A one-line
  emoji data-URI keeps the zero-assets promise intact.

---

## Suggested order

1. ~~Finding 2 (`resetRun`) — smallest diff, removes a dead-end state.~~ ✅ done
2. ~~Finding 1 (the pits) — biggest impact on first-play impression; needs an art call.~~ ✅ done
3. ~~Finding 3 (boundary columns) — one-line edit to the level strings.~~ ✅ done (it was not
   a one-line edit — see the correction above)
4. Findings 4 and 5 — polish, best done together in the resize/draw path. **Still open.**

## Still open

- **Finding 4** — fractional render scale makes Clawd's pixels uneven.
- **Finding 5** — `devicePixelRatio` is uncapped.
- The smaller notes above that aren't struck through.
- **The cling has nowhere to matter.** With the boundary columns gone, the tallest grabbable
  faces in the level are the two-column tower at 44–45 and the platform edges, all three tiles
  or less. Measured climb rate is **24.5px of net gain per kick-off** (the arc peaks 47.3px up,
  but you spend the back half falling as you return to the wall), so a wall needs to be four
  tiles or more before a climb takes more than one cycle. That's a level-design change, not a
  fix, and it's the obvious next thing if the ability is meant to be used rather than owned.
