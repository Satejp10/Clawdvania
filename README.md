# Clawdvania

A 2D browser metroidvania starring **Clawd**, the orange pixel-crab. Phase 1: a movement/game-feel prototype — one crab, one room, zero excuses.

**Single self-contained `index.html`.** Vanilla JS + Canvas 2D. No engine, no build step, no asset files — sprites are inline pixel arrays, the world is procedural. Open the file in a browser and play.

## Controls

| Key | Action |
|---|---|
| Arrows / A D | Move |
| Space / W / Up | Jump (tap = short hop, hold = full jump) |
| R | Reset to spawn |
| ` (backtick) | Debug overlay (pos, vel, coyote/buffer timers, FPS) |

## Feel

All movement constants live in the `TUNING` object at the top of `index.html`: run acceleration, jump apex/time, asymmetric gravity, variable jump height, **100ms coyote time**, **120ms jump buffer**, camera lerp/deadzone/lookahead. Fixed-timestep simulation at 60Hz.

## Status

Phase 1 (navigation greybox) — in feel-tuning. World, abilities, and everything else come later.
