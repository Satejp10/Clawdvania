"use strict";
/*
 * The scripted run for the side-by-side video. A list of steps (hold these keys until this
 * happens), played through the game's own physics headlessly, gives a key tape: which keys
 * are down on every tick. The recorder plays the same tape into both builds, so they walk
 * the same route to the pixel (verify.js --baseline proves the physics is the same).
 *
 *   node route.js <game.html>        prints the route and where each wisp is picked up
 *
 * The route: up onto the first ledge (wisp 2), across to the second (wisp 3), up to the
 * hidden ledge (11, 12), off its left side and back under it through wisp 4 into the
 * ditch, out, over the block, onward. Wisp 1 is left glowing on the ground below.
 */
const fs = require("fs");

// Loads the game script the way tools/verify.js does: browser globals are stubs that
// swallow everything, so the physics runs in plain Node.
function sink() {
  const f = function () { return p; };
  const p = new Proxy(f, {
    get(t, k) { return k === Symbol.toPrimitive ? () => 0 : p; },
    set() { return true; }, apply() { return p; }, construct() { return p; },
  });
  return p;
}
function loadGame(htmlPath, core, opts) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const src = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const env = {
    document: sink(), navigator: sink(), localStorage: sink(), location: sink(),
    window: { devicePixelRatio: 1, screen: sink() },
    addEventListener() {}, matchMedia: () => ({ matches: false }),
    requestAnimationFrame() {}, setTimeout() {}, setInterval() {},
    performance: { now: () => 0 }, innerWidth: 1536, innerHeight: 864,
  };
  const names = Object.keys(env);
  const run = new Function(...names, "__opts", src + "\n;return (" + core.toString() + ")(__opts);");
  return run(...names.map((n) => env[n]), opts);
}

// Each step holds keys until `until` is true (checked before each tick), at most `max`
// ticks. `press` presses jump on the step's first tick (a fresh press, so a second press in
// the air is the double jump); `jump` in keys holds it, for the full height.
const STEPS = [
  { name: "run",                  keys: { right: 1 },          until: (p) => p.x >= 66 },
  { name: "jump to ledge 1",      keys: { right: 1, jump: 1 }, press: 1, until: (p, t) => t > 4 && p.grounded },
  { name: "along ledge 1",        keys: { right: 1 },          until: (p) => p.x >= 162 },
  { name: "jump to ledge 2",      keys: { right: 1, jump: 1 }, press: 1, until: (p, t) => t > 4 && p.grounded },
  { name: "along ledge 2",        keys: { right: 1 },          until: (p) => p.x >= 272 },
  { name: "jump to hidden ledge", keys: { right: 1, jump: 1 }, press: 1, until: (p, t) => t > 4 && p.grounded },
  { name: "along it",             keys: { right: 1 },          until: (p) => p.x >= 352 },
  { name: "stop and look",        keys: {},                    until: (p, t) => t >= 50 },
  { name: "walk off its left",    keys: { left: 1 },           until: (p) => !p.grounded },
  { name: "clear the ledge",      keys: {},                    until: (p) => p.y + p.h > 290 },
  { name: "under it, wisp 4",     keys: { right: 1 },          until: (p) => p.x >= 336 },
  { name: "land in the ditch",    keys: {},                    until: (p) => p.grounded },
  { name: "breathe",              keys: {},                    until: (p, t) => t >= 24 },
  { name: "jump out",             keys: { right: 1, jump: 1 }, press: 1, until: (p, t) => t > 4 && p.grounded },
  { name: "to the block",         keys: { right: 1 },          until: (p) => p.x >= 450 },
  { name: "hop the block",        keys: { right: 1, jump: 1 }, press: 1, until: (p, t) => t > 4 && p.grounded },
  { name: "onward",               keys: { right: 1 },          until: (p, t) => t >= 110 },
];

// Runs inside the game's scope (sees player, input, updatePlayer, ...).
function core(opts) {
  const tape = [], log = [];
  const near = [];                       // first tick Clawd's centre comes within reach of each wisp
  for (let i = 0; i < opts.idle; i++) { updatePlayer(STEP); updateCamera(); }   // the title, before any key
  startGame();
  let tick = 0;
  for (const step of opts.steps) {
    const until = new Function("return " + step.until)();
    let t = 0;
    for (; t < (step.max || 600); t++) {
      if (until(player, t)) break;
      const k = step.keys;
      input.left = !!k.left; input.right = !!k.right;
      input.jumpHeld = !!k.jump;
      if (step.press && t === 0) input.jumpPressed = true;
      tape.push((input.left ? 1 : 0) | (input.right ? 2 : 0) | (input.jumpHeld ? 4 : 0) | (input.jumpPressed ? 8 : 0));
      updatePlayer(STEP); updateCamera();
      tick++;
      const pcx = player.x + player.w / 2, pcy = player.y + player.h / 2 - 2;
      WISP_SPOTS.forEach(([x, y], i) => {
        if (near[i] === undefined && (x - pcx) ** 2 + (y - pcy) ** 2 < 11 * 11) near[i] = tick;
      });
    }
    log.push(step.name.padEnd(22) + " ticks " + String(t).padStart(3) + "  at " + player.x.toFixed(1) + ", " +
      player.y.toFixed(1) + (player.grounded ? " grounded" : " air") + (t >= (step.max || 600) ? "  TIMED OUT" : ""));
  }
  return { tape, log, near, cam: [cam.x, cam.y] };
}

// idle: ticks spent on the title before the first key, as the recorder spends them
function planRoute(htmlPath, idle) {
  return loadGame(htmlPath, core, { idle: idle || 0, steps: STEPS.map((s) => ({ ...s, until: s.until.toString() })) });
}
module.exports = { planRoute };

if (require.main === module) {
  const r = planRoute(process.argv[2]);
  console.log(r.log.join("\n"));
  console.log("ticks", r.tape.length, "(" + (r.tape.length / 60).toFixed(1) + " s)  camera ends at", r.cam.map((v) => v.toFixed(0)).join(", "));
  console.log("wisps reached (tick):", r.near.map((t, i) => t === undefined ? null : (i + 1) + "@" + t).filter(Boolean).join("  "));
}
