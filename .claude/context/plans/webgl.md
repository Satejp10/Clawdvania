# WebGL prototype: the look and the animation, judged against v0.3

**Status: built 2026-11-25, waiting on the owner's verdict.** The live game is untouched.

The owner said "go" on 2026-11-25 to the proposal in `FEATURES.md` (Ideas): rebuild one
screen, the title and the first stretch of the walk, with real light, a world that moves and
Clawd animated properly, in a separate file with the game logic untouched, and judge it as a
side-by-side video with v0.3.

## What's here

| File | What it is |
|---|---|
| `webgl/prototype.html` | The prototype. One file, opens from `file://` like the game. |
| `webgl/route.js` | The scripted run used for the video, checked in the game's own physics. |
| `webgl/record.js` | Records v0.3 and the prototype through that run, frame for frame. |
| `../review/webgl-prototype/` | The video (`side-by-side.mp4`, a smaller `.gif`) and two stills. |

`prototype.html` is v0.3's `index.html` with its drawing swapped out. Everything from the
top of the script down to the wisps and particles is v0.3's code as it was: the tuning, the
level, the physics, the camera, the input, the sounds, the wisps' rules. Dropped: v0.3's
baked canvases (sky, hills, mist, tiles, vignette, stars, foreground) and its `render()`.
Added in their place: the WebGL2 renderer, and v0.3's HUD code, unchanged, drawn on a
transparent canvas on top, so the title, hints and cards are exactly v0.3's.

It plays the whole walk, ravine and ending included, so it can be played end to end. The
polish went into the first screen; the rest works but hasn't been looked at as closely.

`?q=low` and `?q=high` pick the quality. Phones get low by default: the scene is drawn at up
to 2.5 instead of 4 px per design px, the sky at a third instead of half, the light at half,
and the bloom has 4 levels instead of 6.

## How a frame is drawn

All in one file, inline GLSL, into a float buffer so light can go brighter than white:

1. **Sky and hills**, at half resolution, which also reads as depth of field. v0.3's sky
   stops and sun glow, plus drifting clouds lit from below, stars that come out with the
   dusk, three ranges of hills from v0.3's seeds with light along their crests, the trees
   (from the same seeds) with painted leaf masses that sway, the far cottage with lit
   windows and smoke, and mist.
2. **Light.** Every wisp, Clawd's lantern, a wisp's flash when it's picked up and the
   cottage's window and door are lights. For each point on screen, each light's ray is
   checked against a distance field of the level, so earth casts shadows and the light only
   sinks a few px into it.
3. **Terrain**, drawn from that distance field: turf, earth that darkens with depth, strata,
   pebbles, moss, roots hanging under ledges, the glow behind the hills catching edges that
   face it, and the light from step 2. The cottage and the bench stump are drawn here too.
4. **Grass**: about 3,100 blades along every top edge, swaying in gusts that roll across the
   screen, pushed aside by Clawd and flattened outward when he lands (springs, on the CPU).
5. **Clawd**: still pixel art on whole screen pixels, but built each frame from parts
   instead of picked from flip-book frames, and lit per pixel by the same lights.
6. **Sprites**: the wisps (bright orbs while wild, small embers once they follow Clawd),
   their trails and sparks, leaves, dust, fireflies, motes that show only where there's
   light, and big out-of-focus leaves in the bottom corners like the posters.
7. **Bloom, then the grade**: highlights roll off to white, shadows lean indigo, a vignette,
   and grain.

### Clawd's animation

Built from his state every frame, in whole pixels:

- **Walking**: the four legs step one after another, front to back, each lifting a pixel and
  reaching forward; the gait speeds up with his speed. The arms swing in turn, the body bobs
  at a slow walk and leans into a hard start or stop. Footstep sounds come from the steps.
- **Standing**: he breathes, and his eyes go to the nearest wisp and wander between them.
- **In the air**: v0.3's crouch at launch, then rising (arms down, legs trailing, eyes up),
  the top (legs splayed), falling (arms up, legs reaching, eyes down); a tuck on the double
  jump.
- **Landing**: squashed wide by a pixel or two, legs splayed, for a beat.
- **Clinging**: v0.3's cling pose; his eyes look up the wall, and down when he slides.
- Expressions (blink, ouch, happy) follow v0.3's rules.

### Keeping the video honest

New effects draw their randomness from their own seeded generators, never `Math.random`, so
the particles v0.3 makes from `Math.random` come out the same in both builds. `record.js`
plays the same keys into both, two physics ticks per video frame, and compares their
positions and cameras after every frame; it stops if they ever differ.

## Checked

- `node tools/verify.js .claude/context/plans/webgl/prototype.html --baseline index.html`:
  PASS (6 checks), lockstep 674,462 ticks with 0 differences.
- The recording: 365 frames (12.2 s at 30 fps). After every frame both builds' positions and
  cameras were identical. No page errors.
- After the recording, the prototype gained a fallback for phones that offer only half-float
  render targets. The browser asks for that only when full float targets are missing. They
  weren't missing on the recording machine (checked), so the video shows the committed file.
- The first screen, the walk past the middle, the ravine, the bench and the ending, as stills
  in headless Chromium (software WebGL).

**Not checked: speed on real hardware.** Headless Chromium here draws WebGL on the CPU, so
its frame times say nothing about a laptop or a phone. The owner's phone is the real test.

## Known gaps

- The ravine still looks blocky: its hollows are plain rectangles.
- With many wisps following him late in the walk, the swarm of embers around Clawd gets busy.
- Browsers without WebGL2 get a message instead of the game.

## Open, for the owner

1. **The verdict**: roll it out, change it, or drop it.
2. Clawd: stay pixel art, or go smooth?
3. If it's rolled out: the renderer replaces v0.3's in `index.html` (one file still); the
   smaller notes that touch drawing (`const screen`, reduced motion) are done as part of it;
   `poster-pass/check.js`, which reads v0.3's canvas, needs redoing; the README stops saying
   "vanilla Canvas 2D"; and a fallback for browsers without WebGL2 is decided.
