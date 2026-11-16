#!/usr/bin/env node
"use strict";
/*
 * Clawdvania movement checker. Pure Node: nothing to install, no browser.
 *
 *   node tools/verify.js                        check ./index.html
 *   node tools/verify.js some/other.html        check another build
 *   node tools/verify.js --baseline old.html    also check the walk plays exactly as in old.html
 *   node tools/verify.js --deep                 also run the dense search inside the hollow
 *
 * How it works: it pulls the inline <script> out of the HTML file, runs it inside a plain
 * function with the browser stubbed out, and drives the game's real updatePlayer() and
 * updateCamera(). There is no copy of the physics in here to fall out of date.
 *
 * What it checks
 *   level      rows are one width, one spawn, known characters, no wisp inside rock
 *   reach      which wisps (plus the bench and the door) each ability set can get to,
 *              compared against the EXPECT table below:
 *                base  = run + jump            dj   = base + double jump
 *                cling = base + wall cling     both = everything
 *   soft-lock  from every place Clawd can stand, plain running and jumping still gets home
 *   handicap   the same with a weaker jump and run, so nothing required is a pixel-perfect jump
 *   camera     (builds with a RAVINE) Clawd stays on screen while the camera tilts into the
 *              ravine, the frame doesn't bob, and the surface framing comes back afterwards
 *   lockstep   (--baseline) fed the same random inputs, both builds agree on every tick for
 *              as long as Clawd is clear of terrain that differs between them
 *   deep       (--deep) every input on every tick inside the ravine's roofed hollow, to back
 *              the claims of the form "this wisp can NOT be reached without that ability"
 *
 * Exit code 0 when everything passes, 1 otherwise. A normal run takes about a minute.
 */
const fs = require("fs");
const path = require("path");

// How many wisps each ability set should collect, keyed by how many wisps the level has.
// A set that should collect n must collect exactly wisps 1..n (WISP_SPOTS order) and must
// not even come close to the others. If you change the level or the wisps on purpose,
// change this table in the same commit.
const EXPECT = {
  12: { base: 12, dj: 12, cling: 12, both: 12 },   // the walk, before the ravine
  15: { base: 13, dj: 14, cling: 15, both: 15 },   // + lure (13), double-jump wisp (14), cling wisp (15)
};
const HANDICAP = 0.85;        // jump height and run speed are scaled by this for the handicap check
const SCREEN_MARGIN = 4;      // px Clawd's hitbox must keep from the top and bottom of the screen

// ============================================================================
// Loading the game
// ============================================================================

// Stands in for anything the browser would provide: every property, call and `new` on it
// just returns it again, and in arithmetic it counts as 0.
function sink() {
  const f = function () { return p; };
  const p = new Proxy(f, {
    get(t, k) { return k === Symbol.toPrimitive ? () => 0 : p; },
    set() { return true; },
    apply() { return p; },
    construct() { return p; },
  });
  return p;
}

// Runs the game script, then `core` inside the same scope, so `core` can see the game's own
// names (player, input, updatePlayer, LEVEL, ...). `core` is passed as source text, so it
// must not use anything from this file except through `opts`.
// `scale` multiplies TUNING values in the source before it runs: { runMax: 0.85 }.
function loadGame(htmlPath, core, opts, scale) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error("no inline <script> found in " + htmlPath);
  let src = m[1];
  for (const [key, f] of Object.entries(scale || {})) {
    const re = new RegExp("(\\b" + key + ":\\s*)([-\\d.]+)");
    if (!re.test(src)) throw new Error("TUNING key not found: " + key);
    src = src.replace(re, (_, head, v) => head + parseFloat(v) * f);
  }
  const env = {
    document: sink(), navigator: sink(), localStorage: sink(), location: sink(),
    window: { devicePixelRatio: 1, screen: sink() },
    addEventListener() {}, matchMedia: () => ({ matches: false }),
    requestAnimationFrame() {}, setTimeout() {}, setInterval() {},
    performance: { now: () => 0 },
    innerWidth: 1536, innerHeight: 864,
  };
  const names = Object.keys(env);
  let run;
  try {
    run = new Function(...names, "__opts", src + "\n;return (" + core.toString() + ")(__opts);");
  } catch (e) {
    throw new Error("could not parse the game script in " + htmlPath + ": " + e.message);
  }
  try {
    return run(...names.map((n) => env[n]), opts || {});
  } catch (e) {
    if (e instanceof ReferenceError) {
      e.message += "  (if this is a browser global the game now uses, add a stub for it to `env` in tools/verify.js)";
    }
    throw e;
  }
}

// ============================================================================
// Reach search — runs inside the game's scope
// ============================================================================
// Two levels. Nodes are places Clawd can come to rest: on the ground (by position and
// speed), or hanging on a wall. Edges are airborne manoeuvres from a fixed family (jump
// held or tapped, a direction programme with at most one change, extra jump presses at
// chosen ticks), each one simulated tick by tick with the real updatePlayer.
//
// What it finds reachable IS reachable: every route is an actual simulated input sequence.
// What it doesn't find is only "not reachable by this family", which is why the claims that
// something can't be reached are backed separately by --deep.
function searchCore(opts) {
  const P = player, I = input, T = TUNING, W = WISP_SPOTS;
  const realWallAt = wallAt, realAirJumps = T.airJumps;
  // A wisp is picked up within 15px of where it currently is, and it bobs up to 5px away
  // from its spot. So within 10px of the spot is a certain pickup and beyond 20px is a
  // certain miss; in between depends on the bob, which a level should never rely on.
  const R_SURE = 10, R_MAYBE = 20;
  const TMAX = 170;                     // ticks before an airborne manoeuvre is abandoned
  const HOLDS = [1e9, 6];               // jump held to the apex, or tapped
  const SWITCH_T = [4, 8, 12, 16, 20, 24, 30, 36, 44];
  const PRESS_T = new Set([1, 2, 3, 5, 8, 11, 14, 17, 19, 21, 24, 28, 32, 37, 43, 50, 58, 68]);

  // coarse map: which wisps are worth a distance check from this 16px cell
  const NC = Math.ceil(ROOM_W / 16) + 4, NR = Math.ceil((ROOM_H + 128) / 16) + 4;
  const near = new Array(NC * NR).fill(null);
  for (let w = 0; w < W.length; w++) {
    const cx = Math.floor(W[w][0] / 16) + 2, cy = Math.floor((W[w][1] + 64) / 16) + 2;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const i = (cy + dy) * NC + cx + dx;
      if (i >= 0 && i < near.length) (near[i] || (near[i] = [])).push(w);
    }
  }

  let prevHeld = 0;
  function step(dir, held) {
    I.left = dir < 0; I.right = dir > 0;
    I.jumpHeld = !!held; I.jumpPressed = !!held && !prevHeld;
    prevHeld = held ? 1 : 0;
    updatePlayer(STEP);
  }
  function snap() {
    return [P.x, P.y, P.vx, P.vy, P.grounded, P.clinging, P.jumpCutDone, prevHeld,
      P.clingSide, P.airJumpsLeft, P.coyote, P.buffer, P.wallCoyote, P.wallLock];
  }
  function restore(s) {
    P.x = s[0]; P.y = s[1]; P.vx = s[2]; P.vy = s[3]; P.grounded = s[4]; P.clinging = s[5];
    P.jumpCutDone = s[6]; prevHeld = s[7]; P.clingSide = s[8]; P.airJumpsLeft = s[9];
    P.coyote = s[10]; P.buffer = s[11]; P.wallCoyote = s[12]; P.wallLock = s[13];
  }

  // One search = one ability set + one set of starting states.
  // stop(restKey) may return true to end the search early (used by the soft-lock check).
  function search(abil, seeds, stop) {
    wallAt = abil.cling ? realWallAt : function () { return false; };
    T.airJumps = abil.dj ? realAirJumps : 0;
    const vq = T.runMax / 4;
    const sure = new Array(W.length).fill(false), maybe = new Array(W.length).fill(false);
    const best = new Array(W.length).fill(1e9);        // closest approach to each wisp, squared
    const out = { sure, maybe, best, door: false, bench: false, nodes: 0, ticks: 0,
                  stopped: false, rest: new Map() };
    const gSeen = new Set(), cSeen = new Set();
    const queue = [];

    function track() {
      out.ticks++;
      if (game.ended) { out.door = true; game.ended = false; game.state = "play"; }
      if (fx.sitT > 0) { out.bench = true; fx.sitT = 0; }
      const pcx = P.x + P.w / 2, pcy = P.y + P.h / 2 - 2;
      const list = near[(Math.floor((pcy + 64) / 16) + 2) * NC + Math.floor(pcx / 16) + 2];
      if (list) for (let i = 0; i < list.length; i++) {
        const w = list[i]; if (sure[w]) continue;
        const dx = W[w][0] - pcx, dy = W[w][1] - pcy, d2 = dx * dx + dy * dy;
        if (d2 < best[w]) best[w] = d2;
        if (d2 < R_MAYBE * R_MAYBE) { maybe[w] = true; if (d2 < R_SURE * R_SURE) sure[w] = true; }
      }
    }
    function addGround() {
      const cls = Math.round(P.vx / vq);
      const k = (Math.floor(P.x / 2) * 2048 + Math.round(P.y + 64)) * 16 + cls + 8;
      if (gSeen.has(k)) return;
      gSeen.add(k);
      const s = snap(); s[7] = 0;                       // assume the jump key is up by the time we act
      queue.push(0, s, cls);
      if (cls === 0) {
        const rk = Math.floor(P.x / 4) * 4096 + Math.round(P.y + 64);
        if (!out.rest.has(rk)) out.rest.set(rk, [P.x, P.y]);
        if (stop && stop(rk)) out.stopped = true;
      }
    }
    function addCling() {
      const k = ((P.clingSide > 0 ? 1 : 0) * 4096 + Math.floor(P.x)) * 2048 + Math.floor((P.y + 64) / 2);
      if (cSeen.has(k)) return;
      cSeen.add(k);
      const s = snap(); s[7] = 0;
      queue.push(1, s, 0);
    }
    const ended = () => {
      if (P.grounded) { addGround(); return true; }
      if (P.clinging) { addCling(); return true; }
      return false;
    };

    // Airborne from the current state. dirOf(t) is the direction programme; the jump key is
    // held while t < heldUntil. Extra presses (air jump, coyote, wall-coyote) branch off at
    // the ticks in PRESS_T.
    function air(t, dirOf, heldUntil, depth, press) {
      for (; t < TMAX; t++) {
        const dir = dirOf(t);
        if (press && depth < 2 && PRESS_T.has(t) && (P.airJumpsLeft > 0 || P.coyote > 0 || P.wallCoyote > 0)) {
          const s = snap();
          for (let d3 = -2; d3 <= 1; d3++) {            // -2 = keep the programme
            restore(s);
            const f = d3 === -2 ? dirOf : () => d3;
            let tt = t, done = false;
            if (prevHeld) { step(f(tt), 0); track(); tt++; done = ended(); }
            if (!done) { step(f(tt), 1); track(); tt++; if (!ended()) air(tt, f, 1e9, depth + 1, true); }
          }
          restore(s);
        }
        step(dir, t < heldUntil ? 1 : 0); track();
        if (ended()) return;
      }
    }
    // every direction programme: hold d1, optionally switch to d2 at one of SWITCH_T
    function family(s, d1s, press0) {
      for (const hold of (press0 ? HOLDS : [0])) for (const d1 of d1s) {
        restore(s); air(0, () => d1, hold, 0, true);
        for (const ts of SWITCH_T) for (let d2 = -1; d2 <= 1; d2++) {
          if (d2 === d1) continue;
          restore(s); air(0, (t) => (t < ts ? d1 : d2), hold, 0, false);
        }
      }
    }

    for (const sd of seeds) {
      restore(sd); prevHeld = 0;
      if (P.grounded) addGround(); else if (P.clinging) addCling();
    }
    let qi = 0;
    while (qi < queue.length && !out.stopped) {
      const kind = queue[qi], s = queue[qi + 1], cls = queue[qi + 2]; qi += 3;
      out.nodes++;
      if (kind === 0) {
        for (let d = -1; d <= 1; d++) {                 // one tick along the ground
          restore(s); step(d, 0); track();
          if (P.grounded) addGround();
          else if (P.clinging) addCling();
          else {                                        // walked off an edge
            const a = snap(); family(a, [d], false);
            if (d !== 0) { restore(a); family(a, [0, -d], false); }
          }
        }
        if (cls === 0 || cls === 4 || cls === -4) family(s, [-1, 0, 1], true);   // jump: standing or flat out
      } else {
        const side = s[8];
        restore(s); step(side, 0); track(); step(side, 0); track();              // keep sliding
        if (!ended() && P.clinging) addCling();
        family(s, [-1, 0, 1], true);                                             // kick off
        restore(s); step(0, 0); track();                                         // let go
        if (!ended()) { const a = snap(); family(a, [-1, 0, 1], false); }
      }
    }
    out.restList = [...out.rest.entries()];
    return out;
  }

  function spawnSeed() {
    resetPlayer(); prevHeld = 0; game.state = "play";
    for (let i = 0; i < 30; i++) step(0, 0);
    game.ended = false; fx.sitT = 0;
    return snap();
  }
  function seedAt(x, y) {
    spawnSeed(); P.x = x; P.y = y; P.vx = 0; P.vy = 0;
    for (let i = 0; i < 60; i++) step(0, 0);
    game.ended = false; game.state = "play"; fx.sitT = 0;
    return snap();
  }

  const ABIL = {
    base: { dj: 0, cling: 0 }, dj: { dj: 1, cling: 0 },
    cling: { dj: 0, cling: 1 }, both: { dj: 1, cling: 1 },
  };
  const result = { wisps: W.length, sets: {} };
  const seed0 = spawnSeed();
  let restAll = null;
  for (const name of opts.sets) {
    const t0 = Date.now();
    const r = search(ABIL[name], [seed0]);
    result.sets[name] = { sure: r.sure, maybe: r.maybe, best: r.best.map(Math.sqrt),
      door: r.door, bench: r.bench, nodes: r.nodes, ticks: r.ticks, ms: Date.now() - t0 };
    if (name === "both" || !restAll) restAll = r.restList;
  }

  // Soft-lock: from every place the most able set can stand, can plain running and jumping
  // still get to the door? Cells are taken nearest the cottage first, and a search stops as
  // soon as it reaches a cell already known to be safe, so this is quick.
  if (opts.softlock) {
    const t0 = Date.now();
    const safe = new Set(), stuck = [];
    const cells = restAll.slice().sort((a, b) => b[1][0] - a[1][0]);
    for (const [rk, [x, y]] of cells) {
      if (safe.has(rk)) continue;
      const r = search(ABIL.base, [seedAt(x, y)], (k) => k !== rk && safe.has(k));
      if (r.door || r.stopped) { safe.add(rk); if (r.door) for (const [k] of r.restList) safe.add(k); }
      else stuck.push([Math.round(x), Math.round(y)]);
    }
    result.softlock = { cells: cells.length, stuck, ms: Date.now() - t0 };
  }
  wallAt = realWallAt; T.airJumps = realAirJumps;
  return result;
}

// ============================================================================
// Deep search — runs inside the game's scope
// ============================================================================
// Every one of the six inputs (left/none/right x jump up/down) on every tick, for as long
// as Clawd stays inside a region: between x0 and x1 and no higher than yMin. It starts from
// standing at `start`, and from every way of coming in across the region's open side: each
// height on the line x = lineX, at every horizontal and vertical speed, with the air jump
// unspent. Leaving the region and coming back is one of those, so nothing is lost by
// cutting a path off where it leaves. States are merged at 1px of position, 10px/s of
// horizontal speed and 12.5px/s of vertical speed, so this is dense rather than literally
// exhaustive, but unlike the reach search it does not depend on any choice of manoeuvres.
function deepCore(opts) {
  const P = player, I = input, T = TUNING, W = WISP_SPOTS;
  const VXB = 10, VYB = 12.5, R_SURE = 10, R_MAYBE = 20;
  const NY = Math.ceil(ROOM_H + 96) + 2;
  if (!opts.cling) wallAt = function () { return false; };
  if (!opts.dj) T.airJumps = 0;
  game.state = "play";

  let prevHeld = 0;
  function step(dir, held) {
    I.left = dir < 0; I.right = dir > 0;
    I.jumpHeld = !!held; I.jumpPressed = !!held && !prevHeld;
    prevHeld = held;
    updatePlayer(STEP);
  }
  const ticks = (s) => (s <= 0 ? 0 : Math.ceil(s * 60 - 1e-6));
  function keyOf() {
    let k = Math.floor(P.x) + 1;
    k = k * NY + Math.floor(P.y + 96);
    k = k * 34 + (Math.round(P.vx / VXB) + 17);
    k = k * 60 + (Math.round(P.vy / VYB) + 28);
    k = k * 64 + ((P.grounded ? 1 : 0) | (P.airJumpsLeft > 0 ? 2 : 0) | (P.clinging ? 4 : 0) |
                  (P.clingSide > 0 ? 8 : 0) | (P.jumpCutDone ? 16 : 0) | (prevHeld ? 32 : 0));
    k = k * 8 + ticks(P.coyote);
    k = k * 10 + ticks(P.buffer);
    k = k * 8 + ticks(P.wallCoyote);
    k = k * 10 + ticks(P.wallLock);
    return k;                                     // < 2^53, so exact in a double
  }
  // Visited set: far too many states for a JS Set (the double-jump search reaches about 73
  // million), so a Bloom filter over 2^32 bits (512MB) with four hashes. It can wrongly say
  // "seen" (never the reverse), which would prune a state; the chance of that is reported as
  // `filterError`, and the check refuses to vouch for a search where it got above 1 in 10,000.
  const BITS = 32, SIZE = 2 ** BITS, bitset = new Uint8Array(SIZE / 8);
  let bitsSet = 0;
  function mix(lo, hi, seed) {
    let h = Math.imul(lo ^ seed ^ Math.imul(hi | 0, 0x9E3779B1), 0x85EBCA6B);
    h ^= h >>> 15; h = Math.imul(h, 0xC2B2AE35); h ^= h >>> 13;
    h = Math.imul(h ^ (hi | 0), 0x27D4EB2F); h ^= h >>> 16;
    return h >>> 0;
  }
  function seen(k) {
    const lo = k % 4294967296, hi = (k - lo) / 4294967296;
    const a = mix(lo, hi, 0), b = mix(lo, hi, 0x5BD1E995) | 1;
    let all = true;
    for (let i = 0; i < 4; i++) {
      const idx = (a + i * b) % SIZE, byte = idx >>> 3, bit = 1 << (idx & 7);
      if (!(bitset[byte] & bit)) { all = false; bitset[byte] |= bit; bitsSet++; }
    }
    return all;
  }
  const N = 11;                                   // numbers per saved state
  function save(arr) {
    arr.push(P.x, P.y, P.vx, P.vy,
      (P.grounded ? 1 : 0) | (P.clinging ? 2 : 0) | (P.jumpCutDone ? 4 : 0) | (prevHeld ? 8 : 0),
      P.clingSide, P.airJumpsLeft, P.coyote, P.buffer, P.wallCoyote, P.wallLock);
  }
  function load(arr, i) {
    P.x = arr[i]; P.y = arr[i + 1]; P.vx = arr[i + 2]; P.vy = arr[i + 3];
    const f = arr[i + 4];
    P.grounded = !!(f & 1); P.clinging = !!(f & 2); P.jumpCutDone = !!(f & 4); prevHeld = (f & 8) ? 1 : 0;
    P.clingSide = arr[i + 5]; P.airJumpsLeft = arr[i + 6];
    P.coyote = arr[i + 7]; P.buffer = arr[i + 8]; P.wallCoyote = arr[i + 9]; P.wallLock = arr[i + 10];
  }

  const t0 = Date.now();
  const watch = [];                               // only wisps near the region matter
  for (let w = 0; w < W.length; w++) if (W[w][0] > opts.x0 - 32 && W[w][0] < opts.x1 + 32) watch.push(w);
  const sure = new Array(W.length).fill(false), maybe = new Array(W.length).fill(false);
  const best = new Array(W.length).fill(1e9);
  let states = 0, minY = 1e9;

  const stack = [];
  resetPlayer(); prevHeld = 0;
  P.x = opts.start[0]; P.y = opts.start[1]; P.vx = 0; P.vy = 0;
  for (let i = 0; i < 30; i++) step(0, 0);
  game.ended = false; game.state = "play"; fx.sitT = 0;
  save(stack); seen(keyOf());
  const fits = (x, y) => !solidAt(x, y) && !solidAt(x + P.w - 1, y) &&
                         !solidAt(x, y + P.h - 1) && !solidAt(x + P.w - 1, y + P.h - 1);
  let seeds = 0;
  for (let y = opts.yMin; y <= opts.yMax; y++) {
    if (!fits(opts.lineX, y)) continue;
    for (let vx = -T.runMax; vx <= T.runMax; vx += VXB) {
      for (let vy = -JUMP_VEL; vy <= T.maxFallSpeed; vy += VYB) {
        for (let held = 0; held <= (vy < 0 ? 1 : 0); held++) {     // rising: jump key still down, or not
          P.x = opts.lineX; P.y = y; P.vx = vx; P.vy = vy;
          P.grounded = false; P.clinging = false; P.clingSide = 0;
          P.jumpCutDone = !held; prevHeld = held;
          P.airJumpsLeft = T.airJumps; P.coyote = 0; P.buffer = 0; P.wallCoyote = 0; P.wallLock = 0;
          if (!seen(keyOf())) { save(stack); seeds++; }
        }
      }
    }
  }
  const cur = new Array(N);
  while (stack.length) {
    for (let j = N - 1; j >= 0; j--) cur[j] = stack.pop();
    states++;
    load(cur, 0);
    const pcx = P.x + P.w / 2, pcy = P.y + P.h / 2 - 2;
    if (P.y < minY) minY = P.y;
    for (let i = 0; i < watch.length; i++) {
      const w = watch[i]; if (sure[w]) continue;
      const dx = W[w][0] - pcx, dy = W[w][1] - pcy, d2 = dx * dx + dy * dy;
      if (d2 < best[w]) best[w] = d2;
      if (d2 < R_MAYBE * R_MAYBE) { maybe[w] = true; if (d2 < R_SURE * R_SURE) sure[w] = true; }
    }
    for (let a = 0; a < 6; a++) {
      load(cur, 0);
      step((a % 3) - 1, a >= 3 ? 1 : 0);
      if (game.ended) { game.ended = false; game.state = "play"; }
      fx.sitT = 0;
      if (P.x < opts.x0 || P.x > opts.x1 || P.y < opts.yMin) continue;
      if (!seen(keyOf())) save(stack);
    }
  }
  const filterError = Math.pow(bitsSet / SIZE, 4);
  return { sure, maybe, best: best.map(Math.sqrt), watch, states, seeds, minY, filterError, ms: Date.now() - t0 };
}

// ============================================================================
// Driver — runs inside the game's scope and hands back a small remote control
// ============================================================================
function driverCore() {
  let prevHeld = 0;
  game.state = "play";
  const SH = typeof SURFACE_H !== "undefined" ? SURFACE_H : ROOM_H;   // builds before the ravine have no SURFACE_H
  return {
    info() {
      return {
        level: LEVEL.slice(), tile: TILE, roomW: ROOM_W, roomH: ROOM_H, viewW: VIEW_W, viewH: VIEW_H,
        surfaceH: SH, wisps: WISP_SPOTS.map((w) => w.slice()), spawn: { x: SPAWN.x, y: SPAWN.y },
        ravine: typeof RAVINE !== "undefined" ? Object.assign({}, RAVINE) : null,
        hitW: player.w, hitH: player.h,
      };
    },
    // Back to spawn; with x (and y) given, moved there with the camera brought along.
    reset(x, y) {
      resetPlayer(); prevHeld = 0; game.state = "play"; game.ended = false; fx.sitT = 0; camBias = 0;
      if (x == null) return;
      player.x = x; if (y != null) player.y = y;
      cam.x = clamp(player.x + player.w / 2 - VIEW_W / 2, 0, ROOM_W - VIEW_W);
      cam.y = clamp(player.y + player.h / 2 - VIEW_H / 2, 0, SH - VIEW_H);
      cam.fx = player.x + player.w / 2; cam.fy = player.y + player.h / 2;
    },
    // Move Clawd without touching the camera, as if he had just got there.
    teleport(x, y) { player.x = x; player.y = y; player.vx = 0; player.vy = 0; },
    step(dir, held) {
      input.left = dir < 0; input.right = dir > 0;
      input.jumpHeld = !!held; input.jumpPressed = !!held && !prevHeld; prevHeld = held ? 1 : 0;
      updatePlayer(STEP); updateCamera();
      if (game.ended) { game.ended = false; game.state = "play"; }
      return [player.x, player.y, player.vx, player.vy, player.grounded ? 1 : 0, cam.x, cam.y, cam.dive || 0];
    },
  };
}

// ============================================================================
// Checks
// ============================================================================
const results = [];
function report(ok, text) {
  results.push(ok);
  console.log((ok ? "PASS  " : "FAIL  ") + text);
}
const note = (text) => console.log("      " + text);
const secs = (ms) => (ms / 1000).toFixed(1) + "s";
const big = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// [true, true, false, true] -> "1-2, 4"
function ranges(flags) {
  const out = [];
  for (let i = 0; i < flags.length; i++) {
    if (!flags[i]) continue;
    let j = i; while (j + 1 < flags.length && flags[j + 1]) j++;
    out.push(i === j ? String(i + 1) : (i + 1) + "-" + (j + 1));
    i = j;
  }
  return out.length ? out.join(", ") : "none";
}

function solidCell(info, r, c) {
  if (c < 0 || c >= info.level[0].length) return true;   // side walls
  if (r < 0) return false;                               // open sky
  if (r >= info.level.length) return true;               // solid below the room
  return info.level[r][c] === "#";
}

function checkLevel(info) {
  const L = info.level, T = info.tile, cols = L[0].length, problems = [];
  let spawns = 0;
  for (let r = 0; r < L.length; r++) {
    if (L[r].length !== cols) problems.push("row " + r + " is " + L[r].length + " wide, expected " + cols);
    for (const ch of L[r]) {
      if (ch === "P") spawns++;
      else if (ch !== "#" && ch !== "." && ch !== ":") problems.push("row " + r + " has an unknown character '" + ch + "'");
    }
  }
  if (spawns !== 1) problems.push("expected exactly one P (spawn), found " + spawns);
  if (/[^#]/.test(L[L.length - 1])) problems.push("the last row is not solid all the way across");
  info.wisps.forEach(([x, y], i) => {
    if (x < 0 || x >= info.roomW || y < 0 || y >= info.roomH) problems.push("wisp " + (i + 1) + " is outside the room");
    else if (solidCell(info, Math.floor(y / T), Math.floor(x / T))) problems.push("wisp " + (i + 1) + " is inside a solid tile");
  });

  const R = info.ravine;
  if (R) {
    const frameY = info.roomH - info.viewH;
    if (R.camX < 0 || R.camX > info.roomW - info.viewW) problems.push("RAVINE.camX is outside the room");
    if (R.x0 - T < R.camX || R.x1 + T > R.camX + info.viewW) problems.push("the ravine's fixed frame doesn't show both of its outer walls");
    if (R.lipY - frameY < T) problems.push("the ravine's fixed frame doesn't show the lip above it");
    for (let r = info.surfaceH / T; r < L.length; r++) for (let c = 0; c < cols; c++) {
      if (L[r][c] === "#") continue;
      if (c * T < R.x0 || (c + 1) * T > R.x1) problems.push("open cell at col " + c + ", row " + r + " is below the surface but outside RAVINE.x0..x1");
    }
    info.wisps.forEach(([x, y], i) => {
      if (y <= R.lipY) return;
      if (x < R.camX + 12 || x > R.camX + info.viewW - 12 || y < frameY + 12 || y > frameY + info.viewH - 12)
        problems.push("wisp " + (i + 1) + " is below the lip but not inside the ravine's fixed frame");
    });
  }
  report(problems.length === 0, "level: " + cols + " x " + L.length + " tiles, " + info.wisps.length + " wisps" +
    (R ? ", ravine " + (R.x1 - R.x0) / T + " tiles wide under row " + R.lipY / T : ", no ravine"));
  problems.slice(0, 12).forEach(note);
}

function checkReach(file, info) {
  const n = info.wisps.length, want = EXPECT[n];
  const sets = ["base", "dj", "cling", "both"];
  const t0 = Date.now();
  const r = loadGame(file, searchCore, { sets, softlock: true });
  console.log("      reach     wisps collected              door   bench  closest miss");
  for (const s of sets) {
    const v = r.sets[s];
    const misses = v.sure.map((ok, i) => (ok ? null : (i + 1) + ": " + (v.best[i] < 1e4 ? Math.round(v.best[i]) + "px" : "far")))
      .filter(Boolean).join(", ");
    console.log("      " + s.padEnd(10) + ranges(v.sure).padEnd(29) + (v.door ? "yes" : "NO").padEnd(7) +
      (v.bench ? "yes" : "NO").padEnd(7) + (misses || "-"));
  }
  if (!want) {
    report(false, "reach: no expectation for a level with " + n + " wisps. Add a row to EXPECT in tools/verify.js");
  } else {
    const wrong = [];
    for (const s of sets) {
      const v = r.sets[s];
      for (let i = 0; i < n; i++) {
        if (i < want[s] && !v.sure[i]) wrong.push(s + " should collect wisp " + (i + 1) + " and doesn't" + (v.maybe[i] ? " reliably" : ""));
        if (i >= want[s] && v.maybe[i]) wrong.push(s + " should not get wisp " + (i + 1) + " and comes within " + Math.round(v.best[i]) + "px of it");
      }
      if (!v.door) wrong.push(s + " can't reach the door");
      if (!v.bench) wrong.push(s + " can't sit on the bench");
    }
    report(wrong.length === 0, "reach: base " + want.base + ", double jump " + want.dj + ", cling " + want.cling +
      ", both " + want.both + " of " + n + " wisps; door and bench for all  (" + secs(Date.now() - t0) + ")");
    wrong.forEach(note);
  }
  const sl = r.softlock;
  report(sl.stuck.length === 0, "soft-lock: " + sl.cells + " places to stand, " + sl.stuck.length +
    " from which plain running and jumping can't get home");
  if (sl.stuck.length) note("stuck at (x, y): " + sl.stuck.slice(0, 10).map((p) => "(" + p + ")").join(" ") + (sl.stuck.length > 10 ? " ..." : ""));
}

function checkHandicap(file) {
  const t0 = Date.now();
  const r = loadGame(file, searchCore, { sets: ["base", "both"], softlock: true },
    { jumpApexTiles: HANDICAP, runMax: HANDICAP });
  const sl = r.softlock;
  const ok = r.sets.base.door && sl.stuck.length === 0;
  report(ok, "handicap: with jump height and run speed at " + Math.round(HANDICAP * 100) + "%, the door is " +
    (r.sets.base.door ? "still reachable" : "NOT reachable") + " and " + sl.stuck.length + " of " + sl.cells +
    " places to stand are stuck  (" + secs(Date.now() - t0) + ")");
  if (sl.stuck.length) note("stuck at (x, y): " + sl.stuck.slice(0, 10).map((p) => "(" + p + ")").join(" "));
}

// Scripted trips in and out of the ravine, watching where Clawd is on screen.
function checkCamera(api, info) {
  const R = info.ravine, T = info.tile, H = info.hitH, W = info.hitW;
  const frameY = info.roomH - info.viewH, surfY = info.surfaceH - info.viewH;
  const rep = (dir, held, n) => Array.from({ length: n }, () => [dir, held]);
  const problems = [];
  let worstFeet = -1e9, worstTop = 1e9;

  // the top rung: the highest solid tile inside the gorge with open air above it
  let rung = null;
  for (let r = R.lipY / T + 1; r < R.floorY / T && !rung; r++) {
    for (let c = R.gorgeX0 / T; c < R.gorgeX1 / T; c++) {
      if (solidCell(info, r, c) && !solidCell(info, r - 1, c)) { rung = { x: c * T + 1, y: r * T - H, col: c }; break; }
    }
  }

  function run(name, script, expect) {
    let dived = 0, lo = 1e9, hi = -1e9, s = null, settledAt = -1;
    for (let t = 0; t < script.length; t++) {
      s = api.step(script[t][0], script[t][1]);
      if (s[7] > 0) {
        const top = s[1] - s[6], feet = s[1] + H - s[6], left = s[0] - s[5];
        worstFeet = Math.max(worstFeet, feet); worstTop = Math.min(worstTop, top);
        if (top < SCREEN_MARGIN || feet > info.viewH - SCREEN_MARGIN)
          problems.push(name + ": Clawd is at screen y " + Math.round(top) + ".." + Math.round(feet) + " of " + info.viewH + " while the camera tilts (tick " + t + ")");
        if (left < 8 || left + W > info.viewW - 8) problems.push(name + ": Clawd is at screen x " + Math.round(left) + " while the camera tilts (tick " + t + ")");
      }
      dived = Math.max(dived, s[7]);
      if (s[7] === 1 && settledAt < 0) settledAt = t;
      if (settledAt >= 0 && t > settledAt + 45) { lo = Math.min(lo, s[6]); hi = Math.max(hi, s[6]); }
    }
    if (expect === "in") {
      if (s[7] !== 1) problems.push(name + ": the camera never settled in the ravine (dive " + s[7].toFixed(2) + ")");
      else if (Math.abs(s[5] - R.camX) > 0.5 || Math.abs(s[6] - frameY) > 0.5)
        problems.push(name + ": settled at " + s[5].toFixed(1) + ", " + s[6].toFixed(1) + " instead of the fixed frame " + R.camX + ", " + frameY);
    }
    if (expect === "steady" && (s[7] !== 1 || hi - lo > 0.5))
      problems.push(name + ": the frame bobbed by " + (hi - lo).toFixed(1) + "px (dive ended at " + s[7].toFixed(2) + ")");
    if (expect === "out") {
      if (dived < 1) problems.push(name + ": never got into the ravine, so leaving it wasn't tested");
      if (s[7] !== 0) problems.push(name + ": the camera is still tilted after leaving (dive " + s[7].toFixed(2) + ")");
      else if (Math.abs(s[6] - surfY) > 0.5) problems.push(name + ": camera y is " + s[6].toFixed(1) + " on the surface, expected " + surfY);
    }
    return s;
  }
  const standAt = (x) => { api.reset(x, R.lipY - H); for (let i = 0; i < 120; i++) api.step(0, 0); };

  // 1. walk off the left lip
  standAt(R.gorgeX0 - 40);
  run("walk off the left lip", [...rep(1, 0, 60), ...rep(0, 0, 140)], "in");
  // 2. a running jump that comes up short
  standAt(R.gorgeX0 - 90);
  run("running jump into the gap", [...rep(1, 0, 22), ...rep(1, 1, 10), ...rep(0, 0, 170)], "in");
  // 3. the fastest way down: dropped from as high as a double jump goes, straight down the middle
  standAt(R.gorgeX0 - 20);
  api.teleport((R.gorgeX0 + R.gorgeX1) / 2 - W / 2, R.lipY - H - 86);
  const landed = run("free fall down the middle", rep(0, 0, 200), "in");
  if (Math.abs(landed[1] + H - R.floorY) > 0.01) note("(free fall ended at feet y " + (landed[1] + H).toFixed(1) + ", not on the ravine floor at " + R.floorY + ")");
  if (rung) {
    // 4. stand on the top rung
    api.reset(rung.x, rung.y);
    run("standing on the top rung", rep(0, 0, 150), "in");
    // 5. hop on it: the frame must not bob
    run("hopping on the top rung", [...rep(0, 1, 20), ...rep(0, 0, 40), ...rep(0, 1, 20), ...rep(0, 0, 40), ...rep(0, 1, 20), ...rep(0, 0, 60)], "steady");
    // 6. a double jump straight up from it: the highest Clawd gets while the camera is down
    run("double jump from the top rung", [...rep(0, 1, 19), ...rep(0, 0, 1), ...rep(0, 1, 30), ...rep(0, 0, 120)], null);
    // 7. climb out and walk on
    api.reset(rung.x, rung.y);
    for (let i = 0; i < 150; i++) api.step(0, 0);
    const out = rung.col * T > (R.gorgeX0 + R.gorgeX1) / 2 ? 1 : -1;      // the lip nearest the rung
    run("climbing out", [...rep(out, 1, 30), ...rep(out, 0, 60), ...rep(0, 0, 150)], "out");
  } else {
    problems.push("found no rung inside the gorge to stand on");
  }
  report(problems.length === 0, "camera: " + (rung ? 7 : 3) + " trips in and out of the ravine; Clawd stays on screen (worst case: feet at " +
    Math.round(worstFeet) + " of " + info.viewH + ", head at " + Math.round(worstTop) + ")");
  [...new Set(problems.map((p) => p.replace(/ \(tick \d+\)$/, "")))].slice(0, 12).forEach(note);

  const below = info.wisps.map((w, i) => [i + 1, w]).filter(([, w]) => w[1] > R.lipY);
  const seen = below.filter(([, w]) => w[1] - surfY < info.viewH).map(([i, w]) => "wisp " + i + " (" + Math.round(info.viewH - (w[1] - surfY)) + "px above the bottom edge)");
  note("visible from the surface framing: " + (seen.length ? seen.join(", ") : "none of the ravine's wisps"));
}

// Same seeded random inputs into both builds; they must agree exactly until Clawd touches
// terrain that differs between them (or, in a build with a ravine, until the camera tilts).
function checkLockstep(file, baseFile, B, infoB) {
  const A = loadGame(baseFile, driverCore), infoA = A.info();
  const T = infoB.tile, cols = infoB.level[0].length;
  if (infoA.level[0].length !== cols || infoA.tile !== T) {
    report(false, "lockstep: the two builds have different level widths, so they can't be compared");
    return;
  }
  const rows = Math.max(infoA.level.length, infoB.level.length);
  const differs = (r, c) => solidCell(infoA, r, c) !== solidCell(infoB, r, c);
  let changed = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (differs(r, c)) changed++;
  const PAD = 6;       // furthest the physics looks past the hitbox in one tick, rounded up
  const touchesChange = (x, y) => {
    const c0 = Math.floor((x - PAD) / T), c1 = Math.floor((x + infoB.hitW + PAD) / T);
    const r0 = Math.floor((y - PAD) / T), r1 = Math.floor((y + infoB.hitH + PAD) / T);
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) if (differs(r, c)) return true;
    return false;
  };
  let seed = 12345;
  const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  let compared = 0, diffs = 0, left = 0, first = null;
  const RUNS = 400;
  for (let ep = 0; ep < RUNS; ep++) {
    const sx = ep % 4 === 0 ? null : Math.floor(rnd() * (infoB.roomW - 60)) + 20;
    A.reset(sx, sx == null ? null : 200); B.reset(sx, sx == null ? null : 200);
    let dir = 1, held = 0, hold = 0;
    for (let t = 0; t < 2500; t++) {
      if (hold-- <= 0) {
        const r = rnd();
        dir = r < 0.6 ? 1 : r < 0.85 ? -1 : 0; held = rnd() < 0.45 ? 1 : 0; hold = 2 + Math.floor(rnd() * 30);
      }
      const a = A.step(dir, held), b = B.step(dir, held);
      if (a[7] > 0 || b[7] > 0 || touchesChange(a[0], a[1]) || touchesChange(b[0], b[1])) { left++; break; }
      compared++;
      for (let i = 0; i < 7; i++) if (a[i] !== b[i]) { diffs++; if (!first) first = { ep, t, i, a, b }; break; }
    }
  }
  const ok = diffs === 0 && compared > 100000;
  report(ok, "lockstep vs " + path.basename(baseFile) + ": " + changed + " tiles differ; " + RUNS + " random runs, " + big(compared) +
    " ticks compared, " + big(diffs) + " differences (" + left + " runs ended on reaching the changed terrain)");
  if (first) {
    const what = ["x", "y", "vx", "vy", "grounded", "camera x", "camera y"][first.i];
    note("first difference: run " + first.ep + ", tick " + first.t + ", " + what + " is " + first.a[first.i] + " in the baseline and " + first.b[first.i] + " here");
  }
  if (compared <= 100000) note("too few ticks were compared for this to mean anything");
}

function checkDeep(file, info) {
  const R = info.ravine, n = info.wisps.length, want = EXPECT[n];
  if (!R || !want) { report(false, "deep: needs a build with a RAVINE and a row in EXPECT"); return; }
  // The region is the roofed part of the ravine: everything left of the open gorge, below
  // the lip. Its only open side is the door into the gorge, so paths are cut off where they
  // leave through it, and every way of coming back through it is a starting point.
  const region = {
    x0: R.x0 - 3, x1: R.gorgeX0 - 1, lineX: R.gorgeX0 - 1,
    yMin: R.lipY - info.hitH + 2, yMax: R.floorY - info.hitH,
    start: [R.gorgeX0 - 40, R.floorY - info.hitH],
  };
  for (const set of ["base", "dj"]) {
    const r = loadGame(file, deepCore, Object.assign({ dj: set === "dj", cling: false }, region));
    const denied = r.watch.filter((w) => w >= want[set]);
    const close = denied.filter((w) => r.maybe[w]);
    const trusted = r.filterError < 1e-4;
    report(close.length === 0 && trusted, "deep " + set + ": " + big(r.states) + " states inside the hollow; " +
      (denied.length ? "gets no closer than " + denied.map((w) => Math.round(r.best[w]) + "px to wisp " + (w + 1)).join(", ") : "nothing here is meant to be out of reach") +
      "  (" + secs(r.ms) + ")");
    close.forEach((w) => note("wisp " + (w + 1) + " should need more than '" + set + "' but was approached to " + Math.round(r.best[w]) + "px"));
    if (!trusted) note("the visited-state filter got too full to trust (error " + r.filterError.toExponential(1) + "); raise BITS in deepCore");
  }
}

// ============================================================================
// Main
// ============================================================================
function main() {
  const args = process.argv.slice(2);
  let file = null, baseline = null, deep = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--baseline") baseline = args[++i];
    else if (args[i] === "--deep") deep = true;
    else if (args[i] === "--help" || args[i] === "-h") {
      console.log("usage: node tools/verify.js [index.html] [--baseline old.html] [--deep]");
      return 0;
    } else if (args[i].startsWith("--")) { console.error("unknown option " + args[i]); return 1; }
    else file = args[i];
  }
  file = path.resolve(file || path.join(__dirname, "..", "index.html"));
  if (!fs.existsSync(file)) { console.error("no such file: " + file); return 1; }
  if (baseline) {
    baseline = path.resolve(baseline);
    if (!fs.existsSync(baseline)) { console.error("no such file: " + baseline); return 1; }
  }

  console.log("Clawdvania checker: " + file);
  const t0 = Date.now();
  const api = loadGame(file, driverCore), info = api.info();
  checkLevel(info);
  checkReach(file, info);
  checkHandicap(file);
  if (info.ravine) checkCamera(api, info);
  else note("camera: skipped, this build has no RAVINE");
  if (baseline) checkLockstep(file, baseline, api, info);
  if (deep) checkDeep(file, info);

  const failed = results.filter((ok) => !ok).length;
  console.log((failed ? "RESULT: FAIL (" + failed + " of " + results.length + " checks)" : "RESULT: PASS (" + results.length + " checks)") +
    "  in " + secs(Date.now() - t0));
  return failed ? 1 : 0;
}

process.exitCode = main();
