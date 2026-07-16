# Clawdvania

**A five-minute walk home at dusk**, starring **Clawd**, the orange pixel-crab. Cross the autumn hills as the light fades, gather the wisps that drift along the way (they'll orbit you and light your path), rest on the bench at the overlook, and make it to the cottage before dark. Inspired by the quiet moments of *Ori* and *Hollow Knight* — none of the combat, all of the atmosphere.

**Single self-contained `index.html`.** Vanilla JS + Canvas 2D. No engine, no build step, no asset files — Clawd is an inline pixel-array sprite and the world is entirely procedural. Open the file in a browser and play.

**Look:** a painterly *Autumn Dusk* atmosphere (gradient sky, god rays, parallax hills and trees, drifting leaves, soft turf) rendered smooth at the display's native resolution (HiDPI/`devicePixelRatio`-aware, so it's crisp — not pixelated — at any zoom). Clawd himself stays crisp pixel art as a deliberate contrast.

## Controls

| Key | Action |
|---|---|
| Arrows / A D | Move |
| Space / W / Up | Jump (tap = short hop, hold = full jump) |
| R | Reset to spawn |
| M | Mute audio |
| ` (backtick) | Debug overlay (pos, vel, coyote/buffer timers, FPS) |

There are **12 wisps** on the way home. Two are somewhere you'd only look if you were curious. Standing still in the right spot opens a view.

**Mobile:** on-screen arrows + jump button appear automatically on touch devices (variable jump height works there too). The game plays in landscape — portrait shows a rotate prompt.

## Feel

All movement constants live in the `TUNING` object at the top of `index.html`: run acceleration, jump apex/time, asymmetric gravity, variable jump height, **100ms coyote time**, **120ms jump buffer**, camera lerp/deadzone/lookahead. Fixed-timestep simulation at 60Hz.

## Status

The walk home is complete: title, wisps, deepening dusk, bench vista, ending, and fully synthesized audio (wind, footsteps, pentatonic chimes, an ending swell) — still one file, zero assets. Feel-tuning continues; whatever comes after the walk comes later.
