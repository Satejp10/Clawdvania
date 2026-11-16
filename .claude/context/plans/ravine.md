# Ravine: build plan

**Status (2026-11-12):** designed, prototyped in a scratch copy of the game and verified by
simulation. **Not built.** `index.html` is untouched. This file is the hand-off: work through
it from top to bottom.

The code blocks below are the tested code, copied exactly. Applying every `index.html` edit in
order turns today's `index.html` into the tested prototype byte for byte (that was checked
mechanically before this plan was committed). If you find yourself writing new logic, stop:
something has drifted.

## Settle this first: draft PR #12

Draft PR #12 (branch `claude/project-audit-nreywo`, opened 2026-09-27, not merged) built a
*different* ravine at this same ditch. Instead of digging down, it raises the far side into a
64px wall, which makes the double jump or the cling **required** to reach the bench, the door
and the last two wisps. This plan and PR #12 can't both ship: the scope is one ravine, and
they disagree on whether it gates the ending.

The author approved this plan's optional pocket on 2026-11-12, after PR #12 was opened, but
PR #12 didn't come up at the time. **If PR #12 is still open when you start, ask the author
which ravine they want before building anything.** If it's this one, the author closes PR #12
(don't close it yourself). That branch's session-4 entry in `LOG.md` also records real
history (the README poster, and the lesson to push work before testing it), so copy that
entry into `LOG.md` as written, just above the session-5 entry. The session-5 entry already
supersedes its "gated" decision.

## What you're building

An optional side pocket cut down into the hill under the **third ditch** (cols 68–72). Step or
fall in, and the camera tilts down to one fixed frame that shows the whole pocket. Inside:

- an **open gorge** with one-tile ledges ("rungs") on alternating walls, 32px apart, that plain
  jumps climb back out by;
- through a low **door** on its left, two **roofed hollows**, a grotto and a narrow chimney,
  holding the two wisps that finally give the double jump and the wall cling something to do.

Three new wisps, 15 in all. The walk above doesn't change: same jumps, same camera framing.
The only visible difference on the surface is a slot in the third ditch's floor, a ledge at its
right side and a wisp glinting at the bottom edge of the screen.

It matches the V2 poster (`Resources/Clawdvania_Poster_V2_Ravine.png`): a see-through gorge
with the sunset and hills showing through the gap, and turf on the ledges.

## Already decided: don't reopen

| Decision | Why |
|---|---|
| Optional pocket, not on the way home | The walk stays a five-minute walk and the pocket rewards curiosity. The author approved this on 2026-11-12. |
| Under the third ditch, with rows added at the bottom of `LEVEL` | New rows below the old last row leave every existing coordinate where it is. |
| Dug down, not built up (PR #12's approach) | It matches the V2 poster, where Clawd goes down into the gorge, and it keeps the walk ungated. PR #12 avoided digging because of the camera clamps, the parallax and the drawn earth; Steps 2, 4 and 5 handle those, and the checker and screenshots confirm it. The parallax layers are drawn in screen space and needed no change. |
| One fixed camera frame for the whole ravine | Clawd can't drop out of view during a plunge, there's no lookahead sway while wall-kicking, and the way out is always on screen. |
| The way out needs only running and plain jumps | Nobody gets stuck. Rungs are 32px apart (a plain jump rises 49px), on alternating walls, under open sky. |
| Wisp 13 is free, 14 needs the double jump, 15 needs the cling | Each ability gets exactly one thing it's for. Proven by search in both directions (see Step 6). |
| Open gorge cells stay see-through; roofed cells get a dark rock back wall | The gorge looks like the poster; the hollows read as caves instead of floating slabs of ground. |
| No `TUNING` changes, no new mechanics, no fail state | Scope is one ravine. |

## The design

Cols 54–77, rows 22–37, after the change. `#` rock, `.` open (sky shows through), `:` hollow
(open, with rock painted behind it).

```
          555555666666666677777777
          456789012345678901234567
row 22    .....##.............####
row 23    .....##.................
row 24    ##############.....#####   surface floor; the ditch is cols 68-72
row 25    ##############.....#####
row 26    ##############....######   old ditch floor, now open at 68-71; (72,26) is the top rung
row 27    ####:::#######.....#####
row 28    ####:::########....#####   rung (68,28)
row 29    ####:::#######.....#####
row 30    ####:::#:::::#....######   rung (72,30)
row 31    ####:::#:::::#.....#####
row 32    ####:::#:::::##....#####   rung (68,32)
row 33    ####:::::::::#.....#####
row 34    ####::::::::::....######   door at col 67; rung stub (72,34-35)
row 35    ####::::::::::....######
row 36    ########################   ravine floor, y 576
row 37    ########################
```

The pieces, in design px (`TILE` = 16):

| Piece | Tiles | Pixels |
|---|---|---|
| Mouth (the third ditch) | cols 68–72, rows 24–25 | x 1088–1167, lip at y 384 |
| Gorge | cols 68–72, rows 26–35 | floor at y 576 |
| Rungs (standing tops) | (72,26) (68,28) (72,30) (68,32) (72,34) | y 416, 448, 480, 512, 544 |
| Fall line | cols 69–71 | clear from the lip to the floor |
| Door | col 67, rows 34–35 | 32px tall |
| Grotto | cols 62–66, rows 30–35 | ceiling at y 480 |
| Partition | col 61, rows 27–32 | open below |
| Chimney | cols 58–60, rows 27–35 | 48px wide, 144px tall |
| Outer walls | cols 57 and 73 | |

Row 26 stays solid everywhere except cols 68–71.

Wisps (centres in design px, in `WISP_SPOTS` order):

| # | Where | x, y | Needs | Why |
|---|---|---|---|---|
| 13 | in the mouth, 40px below the lip | 1128, 424 | nothing | The lure. From the surface it shows 8px above the bottom edge of the screen as you cross the ditch. |
| 14 | high in the grotto | 1032, 488 | double jump | 88px above the grotto floor. Plain jumps get no closer than 32px; a jump plus the double jump reaches it. |
| 15 | top of the chimney | 952, 440 | wall cling | 136px above the floor. The double jump gets no closer than 44px; kicking between the chimney's walls gets there. |

The camera: while Clawd is below the lip and between cols 58 and 72, the camera stops
following him and settles on x 792, y 320 (the bottom of the room). That frame shows the lip at
screen y 64 and the floor at screen y 256. It tilts in over 0.5s with an ease in and out, and
back out the same way.

## Before you start

1. Save a copy of today's `index.html` outside the repo (your scratchpad), for example as
   `before.html`. The lockstep check compares against it.
2. Run `node tools/verify.js`. Expect `RESULT: PASS (4 checks)` in about 50 seconds. If it
   fails before you've changed anything, stop and find out why.

`tools/verify.js` runs the game's own `updatePlayer` and `updateCamera` in Node with the browser
stubbed out, so there's no copy of the physics to drift. Its header comment says what each check
means; `--help` lists the options.

Commit after each step once its check passes.

## Step 1: the level rows

**Edit 1a, `index.html`: the comment above `LEVEL`.**

Find:
```js
// Level — array of strings, 1 char per tile. '#' solid, '.' empty, 'P' spawn.
// 112 wide x 27 tall. Cols 89-110: the homecoming meadow (cottage is drawn art,
// not tiles). Row 16 cols 20-23: secret ledge. Perch at 85-88 is the vista bench.
// The gaps in rows 24-25 are ditches, not pits: the last row is solid all the
// way across, so they bottom out in drawn earth two tiles down. Step in, hop out
// (or cling your way up the side).
```
Replace with:
```js
// Level — array of strings, 1 char per tile. '#' solid, '.' empty, 'P' spawn,
// ':' hollow (empty, but roofed: the baker paints rock behind it so the sky
// doesn't show through the hillside).
// 112 wide x 38 tall. The walk is rows 0-26; rows 26-37 are the ravine.
// Cols 89-110: the homecoming meadow (cottage is drawn art, not tiles).
// Row 16 cols 20-23: secret ledge. Perch at 85-88 is the vista bench.
// The first two gaps in rows 24-25 are ditches, not pits: row 26 is solid under
// them, so they bottom out in drawn earth two tiles down. Step in, hop out (or
// cling your way up the side).
// The third gap (cols 68-72) is the mouth of the ravine, an optional side pocket
// under the walk. The gorge drops to a floor at row 36, with one-tile rungs on
// alternating walls every two rows, so plain jumps climb back out. Off its left
// side, through a door at col 67 rows 34-35, are two roofed hollows: a grotto
// (cols 62-66) and a three-wide chimney (cols 58-60). See RAVINE below.
```

**Edit 1b, `index.html`: the last row of `LEVEL`.** The final all-`#` row becomes these 12
rows. Rows 0–25 don't change.

Find:
```js
  "################################################################################################################",
];
```
Replace with:
```js
  "####################################################################....########################################",
  "##########################################################:::#######.....#######################################",
  "##########################################################:::########....#######################################",
  "##########################################################:::#######.....#######################################",
  "##########################################################:::#:::::#....########################################",
  "##########################################################:::#:::::#.....#######################################",
  "##########################################################:::#:::::##....#######################################",
  "##########################################################:::::::::#.....#######################################",
  "##########################################################::::::::::....########################################",
  "##########################################################::::::::::....########################################",
  "################################################################################################################",
  "################################################################################################################",
];
```

**Check:** `node tools/verify.js` gives `RESULT: PASS (4 checks)`, with the level line reading
`112 x 38 tiles, 12 wisps, no ravine` and the soft-lock line `714 places to stand, 0 from which
...`. Don't use `--baseline` yet. Until step 2 the camera follows Clawd down into the new rows,
so the surface is framed 91px lower than before and the lockstep check fails on camera y (144
before, 235 now). That's expected at this point, and step 2 fixes it.

## Step 2: the camera

**Edit 2a, `index.html`: new constants, just above `let SPAWN`.**

Find:
```js
let SPAWN = { x: 3 * TILE, y: 13 * TILE };
```
Replace with:
```js
// The walk happens in the top 27 rows; everything below them is the ravine.
// The surface camera still clamps to SURFACE_H, so the walk is framed as it always was.
const SURFACE_H = 27 * TILE;
const RAVINE = {
  x0: 58 * TILE, x1: 73 * TILE,             // inside faces of its outer walls
  gorgeX0: 68 * TILE, gorgeX1: 73 * TILE,   // the open slot under the ditch
  lipY: 24 * TILE,                          // the surface line it is cut into
  floorY: 36 * TILE,                        // its floor
  panTime: 0.5,                             // s for the camera to tilt down into it, or back up
};
RAVINE.camX = (RAVINE.x0 + RAVINE.x1) / 2 - VIEW_W / 2;   // one fixed frame that shows all of it
let SPAWN = { x: 3 * TILE, y: 13 * TILE };
```

**Edit 2b, `index.html`: the `cam` object.**

Find:
```js
const cam = { x: 0, y: 0, fx: 0, fy: 0 }; // fx/fy = focus point
```
Replace with:
```js
const cam = { x: 0, y: 0, fx: 0, fy: 0, dive: 0, inRavine: false }; // fx/fy = focus point; dive = 0 on the surface, 1 settled in the ravine
```

**Edit 2c, `index.html`: in `resetPlayer`.**

Find:
```js
  cam.y = clamp(player.y + player.h / 2 - VIEW_H / 2, 0, ROOM_H - VIEW_H);
```
Replace with:
```js
  cam.y = clamp(player.y + player.h / 2 - VIEW_H / 2, 0, SURFACE_H - VIEW_H);
  cam.dive = 0; cam.inRavine = false;
```

**Edit 2d, `index.html`: in `updateCamera`.** The two lerp lines and the final clamps after
this stay as they are.

Find:
```js
  const targetX = clamp(cam.fx - VIEW_W / 2, 0, ROOM_W - VIEW_W);
  const targetY = clamp(cam.fy - VIEW_H / 2, 0, ROOM_H - VIEW_H);
```
Replace with:
```js
  // The ravine is a fixed-frame room. Below the lip and inside its footprint the camera
  // stops following and settles on one frame showing the whole pocket and the lips above
  // it. Leaving needs to be a little more decisive than entering (24px above the lip, or
  // standing on the surface), so a hop on the top rung doesn't make the frame bob.
  const pcx = player.x + player.w / 2, feet = player.y + player.h;
  const inside = pcx > RAVINE.x0 && pcx < RAVINE.x1;
  if (inside && feet > RAVINE.lipY + 1) cam.inRavine = true;
  else if (!inside || feet < RAVINE.lipY - 24 || (player.grounded && feet <= RAVINE.lipY)) cam.inRavine = false;
  cam.dive = clamp(cam.dive + (cam.inRavine ? STEP : -STEP) / RAVINE.panTime, 0, 1);
  const k = cam.dive * cam.dive * (3 - 2 * cam.dive);   // smoothstep; exactly 0 on the surface

  const surfX = clamp(cam.fx - VIEW_W / 2, 0, ROOM_W - VIEW_W);
  const surfY = clamp(cam.fy - VIEW_H / 2, 0, SURFACE_H - VIEW_H);
  const targetX = surfX + (RAVINE.camX - surfX) * k;
  const targetY = surfY + (ROOM_H - VIEW_H - surfY) * k;
```

**Check:** `node tools/verify.js --baseline before.html` (with your copy's real path) gives
`RESULT: PASS (6 checks)`:

```
Clawdvania checker: /home/user/Clawdvania/index.html
PASS  level: 112 x 38 tiles, 12 wisps, ravine 15 tiles wide under row 24
      reach     wisps collected              door   bench  closest miss
      base      1-12                         yes    yes    -
      dj        1-12                         yes    yes    -
      cling     1-12                         yes    yes    -
      both      1-12                         yes    yes    -
PASS  reach: base 12, double jump 12, cling 12, both 12 of 12 wisps; door and bench for all  (35.5s)
PASS  soft-lock: 714 places to stand, 0 from which plain running and jumping can't get home
PASS  handicap: with jump height and run speed at 85%, the door is still reachable and 0 of 714 places to stand are stuck  (20.1s)
PASS  camera: 7 trips in and out of the ravine; Clawd stays on screen (worst case: feet at 274 of 288, head at 17)
      visible from the surface framing: none of the ravine's wisps
PASS  lockstep vs before.html: 106 tiles differ; 400 random runs, 674,462 ticks compared, 0 differences (244 runs ended on reaching the changed terrain)
RESULT: PASS (6 checks)  in 56.2s
```

## Step 3: the three wisps

**Edit 3, `index.html`: `WISP_SPOTS`.**

Find:
```js
const WISP_SPOTS = [           // design px centers; last two live on the secret ledge
  [200, 368], [136, 323], [256, 291], [349, 344],
  [624, 275], [712, 320], [765, 357], [1016, 307],
  [1128, 352], [1408, 253],
  [336, 240], [365, 243],
];
```
Replace with:
```js
const WISP_SPOTS = [           // design px centers; 11-12 live on the secret ledge, 13-15 down the ravine
  [200, 368], [136, 323], [256, 291], [349, 344],
  [624, 275], [712, 320], [765, 357], [1016, 307],
  [1128, 352], [1408, 253],
  [336, 240], [365, 243],
  [1128, 424], [1032, 488], [952, 440],
];
```

Nothing else needs to know the count: the end card already compares against
`WISP_SPOTS.length`, and the checker picks its expectations from `EXPECT[15]`.

**Check:** `node tools/verify.js --baseline before.html` gives `RESULT: PASS (6 checks)`:

```
Clawdvania checker: /home/user/Clawdvania/index.html
PASS  level: 112 x 38 tiles, 15 wisps, ravine 15 tiles wide under row 24
      reach     wisps collected              door   bench  closest miss
      base      1-13                         yes    yes    14: 32px, 15: far
      dj        1-14                         yes    yes    15: far
      cling     1-15                         yes    yes    -
      both      1-15                         yes    yes    -
PASS  reach: base 13, double jump 14, cling 15, both 15 of 15 wisps; door and bench for all  (36.7s)
PASS  soft-lock: 714 places to stand, 0 from which plain running and jumping can't get home
PASS  handicap: with jump height and run speed at 85%, the door is still reachable and 0 of 714 places to stand are stuck  (20.3s)
PASS  camera: 7 trips in and out of the ravine; Clawd stays on screen (worst case: feet at 274 of 288, head at 17)
      visible from the surface framing: wisp 13 (8px above the bottom edge)
PASS  lockstep vs before.html: 106 tiles differ; 400 random runs, 674,462 ticks compared, 0 differences (244 runs ended on reaching the changed terrain)
RESULT: PASS (6 checks)  in 57.6s
```

## Step 4: the back wall for hollow cells

Art only, so the checker's results don't change. Step 7 is where you look at it.

**Edit 4a, `index.html`: a colour in `THEME`.**

Find:
```js
  rim: "#54455e", underShade: "#1a1526",
```
Replace with:
```js
  rim: "#54455e", underShade: "#1a1526",
  hollow: "#120e1c",        // rock behind the roofed parts of the ravine
```

**Edit 4b, `index.html`: the tile baker loop.** The `:` branch has to come before the `#` check.

Find:
```js
      if (LEVEL[ty][tx] !== "#") continue;
      const x = tx * TILE, y = ty * TILE;
      const rnd = mulberry32(tx * 971 + ty * 331);
```
Replace with:
```js
      const x = tx * TILE, y = ty * TILE;
      const rnd = mulberry32(tx * 971 + ty * 331);
      if (LEVEL[ty][tx] === ":") {
        // hollow: open to walk through, but roofed — paint the rock behind it so the
        // sky doesn't show through the hillside. Darker than the earth in front of it.
        c.fillStyle = THEME.hollow;
        c.fillRect(x, y, TILE, TILE);
        c.globalAlpha = 0.16;
        for (let i = 0; i < 2; i++) {
          c.fillStyle = rnd() < 0.5 ? THEME.earthBot : "#0d0a16";
          c.beginPath();
          c.arc(x + rnd() * TILE, y + rnd() * TILE, 3 + rnd() * 4, 0, 6.29);
          c.fill();
        }
        c.globalAlpha = 1;
        continue;
      }
      if (LEVEL[ty][tx] !== "#") continue;
```

`#120e1c` was picked by eye from four candidates (`#1c1629`, `#171226`, `#120e1c`, `#0d0a16`).
Lighter ones read as a flat panel; this one reads as depth while the wisps inside still pop.

## Step 5: leaves

Leaves used to be scattered over the whole room height. With the room 176px taller, the same 80
leaves would thin out on the surface and drift down through solid rock. After this change they
fall through the surface band exactly as before (same random sequence, same density), and only
the ones over the open gorge keep falling, down to the ravine floor.

**Edit 5a, `index.html`: where the leaves are made.**

Find:
```js
    x: rnd() * ROOM_W, y: rnd() * ROOM_H,
```
Replace with:
```js
    x: rnd() * ROOM_W, y: rnd() * SURFACE_H,
```

**Edit 5b, `index.html`: in `updateLeaves`.**

Find:
```js
    if (m.y > ROOM_H + 8) { m.y = -8; m.x = Math.random() * ROOM_W; }
```
Replace with:
```js
    // Leaves fall through the surface band. Below it only the ones over the open gorge
    // keep going, so they drift down the gap instead of across solid rock.
    const bottom = (m.x > RAVINE.gorgeX0 && m.x < RAVINE.gorgeX1) ? RAVINE.floorY : SURFACE_H;
    if (m.y > bottom + 8) { m.y = -8; m.x = Math.random() * ROOM_W; }
```

## Step 6: verify everything

`node tools/verify.js --baseline before.html --deep` takes about 4 minutes. Expected:

```
Clawdvania checker: /home/user/Clawdvania/index.html
PASS  level: 112 x 38 tiles, 15 wisps, ravine 15 tiles wide under row 24
      reach     wisps collected              door   bench  closest miss
      base      1-13                         yes    yes    14: 32px, 15: far
      dj        1-14                         yes    yes    15: far
      cling     1-15                         yes    yes    -
      both      1-15                         yes    yes    -
PASS  reach: base 13, double jump 14, cling 15, both 15 of 15 wisps; door and bench for all  (34.0s)
PASS  soft-lock: 714 places to stand, 0 from which plain running and jumping can't get home
PASS  handicap: with jump height and run speed at 85%, the door is still reachable and 0 of 714 places to stand are stuck  (19.0s)
PASS  camera: 7 trips in and out of the ravine; Clawd stays on screen (worst case: feet at 274 of 288, head at 17)
      visible from the surface framing: wisp 13 (8px above the bottom edge)
PASS  lockstep vs before.html: 106 tiles differ; 400 random runs, 674,462 ticks compared, 0 differences (244 runs ended on reaching the changed terrain)
PASS  deep base: 12,850,287 states inside the hollow; gets no closer than 32px to wisp 14, 80px to wisp 15  (29.9s)
PASS  deep dj: 72,841,913 states inside the hollow; gets no closer than 44px to wisp 15  (158.3s)
RESULT: PASS (8 checks)  in 241.6s
```

Timings vary by machine. What the lines prove:

- **reach:** plain running and jumping collects wisps 1–13, the double jump adds 14, the cling
  adds 15. Everyone reaches the door and the bench.
- **soft-lock:** from all 714 places Clawd can stand (found with every ability on), plain
  running and jumping still gets home.
- **handicap:** that stays true with jump height and run speed cut to 85%, so the way out never
  needs a precise jump.
- **camera:** seven scripted trips in and out. While the camera tilts, Clawd's feet never go
  lower than 274 of 288 on screen; hopping on the top rung doesn't make the frame bob; leaving
  restores the surface framing.
- **lockstep:** 400 random runs fed into both builds agree on every tick (position, speed and
  camera) until Clawd reaches terrain that changed. The walk is untouched.
- **deep:** every input on every tick inside the hollows. Without the double jump, nothing gets
  within 32px of wisp 14; without the cling, nothing gets within 44px of wisp 15. Pickup is
  15px.

## Step 7: look at it

The checker covers physics; looks need eyes. Playwright and Chromium are pre-installed
(`require('playwright')` works). Headless rendering is slow, so don't play in real time:
teleport, run the update functions synchronously, then render once.

```js
// node shots.js /abs/path/index.html /abs/out/dir
const { chromium } = require("playwright");
const [file, outDir] = process.argv.slice(2);
const SPOTS = [                      // name, x, y, facing
  ["a-surface-left", 1040, 374, 1],
  ["b-top-rung", 1153, 406, -1],
  ["c-gorge-floor", 1121, 566, -1],
  ["d-grotto", 1030, 566, -1],
  ["e-chimney", 944, 566, -1],
  ["f-surface-right", 1200, 374, -1],
];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("file://" + file);
  await page.waitForTimeout(500);
  await page.keyboard.press("Space");
  await page.waitForTimeout(200);
  for (const [name, x, y, facing] of SPOTS) {
    await page.evaluate(([x, y, facing]) => {
      game.state = "play"; game.tfade = 1; playT = 99;
      player.x = x; player.y = y; player.vx = 0; player.vy = 0; player.facing = facing;
      for (let i = 0; i < 300; i++) { updatePlayer(STEP); player.facing = facing; updateCamera(); }
      render(60, STEP);
    }, [x, y, facing]);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${outDir}/${name}.png` });
  }
  console.log("page errors:", errors.length, errors.slice(0, 3));
  await browser.close();
})();
```

What to look for:

- **Surface views (a, f):** the same as today apart from the slot in the ditch floor, the top
  rung at its right side and wisp 13 glinting at the bottom edge. No dark patches on the
  surface.
- **Ravine views (b–e):** both lips across the top of the frame and the whole pocket in view;
  sky and hills showing through the gorge; the hollows dark with rock behind them (no sky
  showing through) and no seams between hollow cells; turf on the rung tops.
- `page errors: 0`.

Then ask the author to play it once in a real browser: drop in, grab wisp 13, climb out by the
rungs. The tilt should feel like a glance down, not a cut.

## Step 8: docs

**Edit 8a, `README.md`: the wisp count.**

Find:
```md
There are **12 wisps** on the way home. Two are somewhere you'd only look if you were curious. Standing still in the right spot opens a view.
```
Replace with:
```md
There are **15 wisps** on the way home. Two are somewhere you'd only look if you were curious, and three are down the ravine under the third ditch: one for anybody, one for the double jump and one for the cling. Standing still in the right spot opens a view.
```

**Edit 8b, `README.md`: the ditches.**

Find:
```md
The gaps in the ground are **ditches, not pits** — they bottom out in earth two tiles down. Step in and hop out, or cling your way up the side.
```
Replace with:
```md
The gaps in the ground are **ditches, not pits**: the first two bottom out in earth two tiles down, so step in and hop out, or cling your way up the side. The third opens into a ravine with ledges to climb back out by, and nothing down there can trap you.
```

**Edit 8c, `README.md`: the status line.**

Find:
```md
The walk home is complete: title, wisps, deepening dusk, bench vista, ending, and fully synthesized audio
```
Replace with:
```md
The walk home is complete: title, wisps, an optional ravine, deepening dusk, bench vista, ending, and fully synthesized audio
```

**`AUDIT.md`:** under "Still open", strike through the bullet "The abilities have nowhere to
matter" and add a resolved note with the numbers from Step 6: base 13 of 15 wisps, double jump
14, cling 15, soft-lock 0 of 714, and the deep search's 32px and 44px margins.

**`CLAUDE.md`:** in the scope paragraph, say the ravine is built (with the date) as an optional
pocket under the third ditch.

**`.claude/context/LOG.md`:** append a new entry for the session. It's append-only, so never
edit an old entry.

## Step 9: commit and PR

Follow the session's git instructions for the branch and the pull request. Paste the Step 6
output into the PR description, along with what the screenshots showed.

## Pitfalls (each of these came up while prototyping)

- **Clamp the surface camera to `SURFACE_H`, not `ROOM_H`,** in both `updateCamera` and
  `resetPlayer`. Otherwise the whole walk is framed 91px lower.
- **Don't open row 26 anywhere except cols 68–71.** Row 26 is the bottom 16px of the surface
  view, so a hole there shows up on the surface as a gap in the ground.
- **No one-tile-wide holes in a floor Clawd runs across.** At full speed he falls into one only
  about 86% of the time, which reads as a bug.
- **Keep `RAVINE.panTime` at 0.6 or less.** At 0.5s (chosen), the checker's worst plunge puts
  Clawd's feet at 274 on a 288px-tall screen. An earlier measurement with a milder plunge put
  0.6s at 282 and 0.7s at 293, which is off the screen.
- **Only put rungs under open sky.** A rung under an overhang loses headroom, and the
  plain-jump way out stops working.
- **Keep every wisp clearly in reach or clearly out of it.** Pickup is 15px from a wisp that
  bobs up to 5px, so the checker treats within 10px of the spot as a sure pickup and within 20px
  as a maybe, and fails any maybe for an ability set that shouldn't get that wisp.
- **If you change the level or the wisps on purpose, update `EXPECT` in `tools/verify.js` in
  the same commit.**
- **Leave `updateWisps` where it is.** It runs in the render pass, which is an open note in
  `AUDIT.md`, but that's unrelated to this job.

## Not in this job (suggestions only, don't build unless the author asks)

- **A third chime octave.** `sndChime(n)` goes up an octave after six wisps and no further, so
  wisps 13–15 replay the notes of 7–9.
- **A nudge toward the ravine** for players who never look down. Wisp 13 is the only lure.
- **A change of sound below the lip,** such as muffled wind or a drip.
