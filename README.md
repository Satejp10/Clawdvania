# Clawdvania

A 2D browser metroidvania starring **Clawd**, the orange pixel-crab. Phase 1: a movement/game-feel prototype — one crab, one room, zero excuses.

**Single self-contained `index.html`.** Vanilla JS + Canvas 2D. No engine, no build step, no asset files — Clawd is an inline pixel-array sprite and the world is entirely procedural. Open the file in a browser and play.

**Look:** a painterly *Autumn Dusk* atmosphere (gradient sky, god rays, parallax hills and trees, drifting leaves, soft turf) rendered smooth at the display's native resolution (HiDPI/`devicePixelRatio`-aware, so it's crisp — not pixelated — at any zoom). Clawd himself stays crisp pixel art as a deliberate contrast.

## Controls

| Key | Action |
|---|---|
| Arrows / A D | Move |
| Space / W / Up | Jump (tap = short hop, hold = full jump) |
| R | Reset to spawn |
| ` (backtick) | Debug overlay (pos, vel, coyote/buffer timers, FPS) |

**Mobile:** on-screen arrows + jump button appear automatically on touch devices (variable jump height works there too). The game plays in landscape — portrait shows a rotate prompt.

## Feel

All movement constants live in the `TUNING` object at the top of `index.html`: run acceleration, jump apex/time, asymmetric gravity, variable jump height, **100ms coyote time**, **120ms jump buffer**, camera lerp/deadzone/lookahead. Fixed-timestep simulation at 60Hz.

## Status

Phase 1 (navigation greybox) — smooth-HD Autumn Dusk visual pass done; in feel-tuning. Abilities, enemies, and everything else come later.
