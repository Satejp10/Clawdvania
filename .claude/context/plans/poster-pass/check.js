#!/usr/bin/env node
"use strict";
/*
 * Poster-pass browser check (v0.2; the pose check came with v0.3). Runs the real game in
 * headless Chromium and drives it synchronously: requestAnimationFrame is stubbed out, so
 * the render loop can't interleave and every result is repeatable.
 *
 *   node .claude/context/plans/poster-pass/check.js [index.html] [outdir]
 *
 * What it checks (exit code 0 when all pass):
 *   ending    at the door Clawd stops and ignores input; a key before WALK_AGAIN_T does
 *             nothing; a key after it starts the walk over; R still restarts during the
 *             ending; no stale jump fires on the first tick of the new walk
 *   pixels    at a fractional scale (2.5) every sprite pixel of Clawd is the same whole
 *             number of device pixels wide
 *   poses     a full jump is drawn as the launch for its first 3 ticks, then the rise, the
 *             top and the fall, in that order, and then he lands (read from the frames the
 *             real render() draws, not worked out separately)
 *   errors    no page errors anywhere
 *
 * What it writes to outdir (default ./poster-pass-shots), for a person to look at:
 *   title, walk, bench, door, closing, ravine .png   at 1280x720
 *   docs-screenshot.png  (1536x864) and docs-thumbnail.png (1200x750), framed like the
 *   README's current docs/screenshot.png and docs/thumbnail.png. Copy them over by hand
 *   once you've looked at them.
 *
 * Headless rendering is software-only and slow (each screenshot can take a while), and its
 * frame times say nothing about real hardware.
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const file = path.resolve(process.argv[2] || "index.html");
const outDir = path.resolve(process.argv[3] || "poster-pass-shots");
fs.mkdirSync(outDir, { recursive: true });

const results = [];
function report(ok, text) { results.push(ok); console.log((ok ? "PASS  " : "FAIL  ") + text); }

// Moments to photograph. Each runs inside the page with the helper H (see setup below).
// Positions are design px: Clawd's hitbox top-left.
const SCENES = {
  title:   () => { H.frames(30, 1 / 60); },
  walk:    () => { H.begin(); H.put(900, 374); H.ticks(200); H.collect(7); H.frames(40, 1 / 60); },
  bench:   () => { H.begin(); H.collect(10); H.put(1378, 262); H.ticks(400); H.frames(60, 1 / 60); },
  door:    () => { H.begin(); H.collect(10); H.put(1641, 374); H.ticks(3); H.frames(39, 0.1); },
  closing: () => { H.begin(); H.collect(10); H.put(1641, 374); H.ticks(3); H.frames(130, 0.1); },
  ravine:  () => { H.begin(); H.collect(5); H.put(1100, 560); H.ticks(300); H.frames(40, 1 / 60); },
};

async function openPage(browser, w, h, errors) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 0;                       // we drive every frame
    let s = 7;                                                    // same leaves and blinks every run
    Math.random = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  });
  return page;
}

// NB: the game already has a global named S (its render scale), which would shadow a
// window.S, so the helper is called H.
async function load(page) {
  await page.goto("file://" + file);
  await page.evaluate(() => {
    window.H = {
      begin() { game.state = "play"; game.tfade = 1; playT = 10; },
      put(x, y) {
        resetPlayer(); player.x = x; player.y = y;
        cam.x = clamp(player.x + player.w / 2 - VIEW_W / 2, 0, ROOM_W - VIEW_W);
        cam.y = clamp(player.y + player.h / 2 - VIEW_H / 2, 0, SURFACE_H - VIEW_H);
        cam.fx = player.x + player.w / 2; cam.fy = player.y + player.h / 2;
      },
      ticks(n) { for (let i = 0; i < n; i++) { updatePlayer(STEP); updateCamera(); } },
      collect(n) {
        for (let i = 0; i < n; i++) {
          const w = wisps[i];
          if (w.state === "idle") { w.state = "orbit"; wispCount++; w.x = player.x; w.y = player.y; }
        }
      },
      frames(n, dt) { for (let i = 0; i < n; i++) render(60, dt); },
    };
  });
}

async function checkEnding(page) {
  const run = (f) => page.evaluate(f);
  await load(page);
  await page.keyboard.press("KeyX");                                // any key leaves the title
  const started = await run(() => game.state);
  await run(() => { H.put(1600, 374); H.ticks(60); });
  await page.keyboard.down("ArrowRight");                           // walk into the door, keep holding
  const reach = await run(() => {
    let t = 0;
    while (game.state !== "ending" && t < 600) { updatePlayer(STEP); updateCamera(); t++; }
    return { state: game.state, t };
  });
  const held = await run(() => {
    const x0 = player.x;
    for (let i = 0; i < 300; i++) { updatePlayer(STEP); updateCamera(); render(60, STEP); }
    return { moved: player.x - x0, vx: player.vx, off: player.x + player.w / 2 - HOME.doorX };
  });
  await page.keyboard.press("Space");
  // a tapped jump is a short hop that lands within 30 ticks, so watch the height every tick
  const jump = await run(() => {
    const y0 = player.y; let rose = 0;
    for (let i = 0; i < 30; i++) { updatePlayer(STEP); updateCamera(); rose = Math.max(rose, y0 - player.y); }
    return { rose, grounded: player.grounded };
  });
  await page.keyboard.up("ArrowRight");
  await page.keyboard.press("KeyX");                                // too early to walk again
  const early = await run(() => ({ state: game.state, endT: game.endT,
    at: typeof WALK_AGAIN_T !== "undefined" ? WALK_AGAIN_T : 11 }));   // builds before v0.2 have none
  await run(() => H.frames(70, 0.1));                               // past WALK_AGAIN_T
  await page.keyboard.press("KeyX");
  const again = await run(() => ({ state: game.state, ended: game.ended, wisps: wispCount, x: player.x, endT: game.endT }));
  const first = await run(() => { for (let i = 0; i < 5; i++) updatePlayer(STEP); return { vy: player.vy }; });
  await run(() => { H.put(1641, 374); updatePlayer(STEP); });     // R during the ending
  const rBefore = await run(() => game.state);
  await page.keyboard.press("KeyR");
  const rAfter = await run(() => ({ state: game.state, ended: game.ended }));

  report(started === "play" && reach.state === "ending", "ending: reached the door in " + reach.t + " ticks holding right");
  report(Math.abs(held.moved) < 8 && held.vx === 0 && Math.abs(held.off) < 11,
    "ending: Clawd stays at the door while right is held (slid " + held.moved.toFixed(1) + "px, " +
    held.off.toFixed(1) + "px from the door's centre)");
  report(jump.rose === 0 && jump.grounded, "ending: a jump press is ignored (rose " + jump.rose.toFixed(1) + "px)");
  report(early.state === "ending", "ending: a key at " + early.endT.toFixed(1) + "s (before " + early.at + "s) does nothing");
  report(again.state === "play" && !again.ended && again.wisps === 0 && again.endT === 0,
    "ending: a key after " + early.at + "s starts the walk again (back at x " + again.x + ", wisps returned)");
  report(first.vy === 0, "ending: no stale jump on the first ticks of the new walk");
  report(rBefore === "ending" && rAfter.state === "play" && !rAfter.ended, "ending: R still restarts during the ending");
}

async function checkPixels(page) {
  await load(page);
  const at = await page.evaluate(() => {
    H.begin(); H.put(49, 374); H.ticks(30); render(60, STEP);
    const k = Math.max(1, Math.round(S));
    const fx = Math.round(offX + (Math.round(player.x - Math.round(cam.x)) + player.w / 2) * S);
    const fy = Math.round(offY + (Math.round(player.y - Math.round(cam.y)) + player.h) * S);
    // read back exactly the sprite's box and measure the eye pixels (palette "b", #1d130e)
    const img = sctx.getImageData(fx - 8 * k, fy - 12 * k, 16 * k, 12 * k);
    const runs = new Set();
    for (let y = 0; y < img.height; y++) {
      let run = 0;
      for (let x = 0; x <= img.width; x++) {
        const i = (y * img.width + x) * 4;
        const dark = x < img.width && img.data[i] < 60 && img.data[i + 1] < 40 && img.data[i + 2] < 40;
        if (dark) run++; else if (run) { runs.add(run); run = 0; }
      }
    }
    return { S, k, runs: [...runs] };
  });
  report(at.runs.length === 1 && at.runs[0] === at.k,
    "pixels: at scale " + at.S + " every eye pixel is " + at.runs.join("/") + " device px wide (want " + at.k + ")");
}

// Which frame render() draws Clawd in, tick by tick through one full jump from flat ground.
// The sprite is the only drawImage call placed at (-SPR_W / 2, -SPR_H); the image it draws
// is looked up in BAKED to get its pose set and frame.
async function checkPoses(page) {
  await load(page);
  const drawn = await page.evaluate(() => {
    const names = new Map();
    for (const [set, frames] of Object.entries(BAKED))
      frames.forEach((f, i) => { for (const e of Object.values(f)) { names.set(e.right, set + " " + i); names.set(e.left, set + " " + i); } });
    const realDraw = sctx.drawImage;
    let last = null;
    sctx.drawImage = function (img, x, y) {
      if (arguments.length === 3 && x === -SPR_W / 2 && y === -SPR_H) last = names.get(img) || "?";
      return realDraw.apply(this, arguments);
    };
    H.begin(); H.put(900, 374); H.ticks(60);
    input.jumpPressed = true; input.jumpHeld = true;              // held: a full jump
    const out = [];
    for (let t = 0; t < 40; t++) { updatePlayer(STEP); updateCamera(); last = null; render(60, STEP); out.push(last); }
    input.jumpHeld = false;
    sctx.drawImage = realDraw;
    return out;
  });
  const runs = [];                                                 // [pose, ticks] in order
  for (const p of drawn) { if (runs.length && runs[runs.length - 1][0] === p) runs[runs.length - 1][1]++; else runs.push([p, 1]); }
  const order = runs.map((r) => r[0]);
  const ok = order.length >= 5 && order.slice(0, 4).join() === "jump 0,jump 1,top 0,fall 0" &&
    runs[0][1] === 3 && runs.slice(1, 4).every((r) => r[1] >= 2) &&
    order.slice(4).every((p) => p === "idle 0" || p === "idle 1");
  report(ok, "poses: a full jump is drawn as " + runs.map((r) => r[0] + " x" + r[1]).join(", ") +
    " (want the launch, jump 0, for 3 ticks, then jump 1, top 0, fall 0, then idle)");
}

async function shoot(browser, errors) {
  const page = await openPage(browser, 1280, 720, errors);
  for (const [name, scene] of Object.entries(SCENES)) {
    await load(page);
    await page.evaluate(scene);
    await page.screenshot({ path: path.join(outDir, name + ".png"), timeout: 180000 });
  }
  await page.close();
  // README framings: the title screen at 1536x864, and a 1200x750 crop out of a 1334x750 frame
  for (const [name, w, h, clip] of [["docs-screenshot", 1536, 864, null],
                                    ["docs-thumbnail", 1334, 750, { x: 67, y: 0, width: 1200, height: 750 }]]) {
    const p = await openPage(browser, w, h, errors);
    await load(p);
    await p.evaluate(SCENES.title);
    await p.screenshot({ path: path.join(outDir, name + ".png"), timeout: 180000, ...(clip ? { clip } : {}) });
    await p.close();
  }
}

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const t0 = Date.now();
  try {
    await checkEnding(await openPage(browser, 1280, 720, errors));
    await checkPixels(await openPage(browser, 1280, 720, errors));
    await checkPoses(await openPage(browser, 1280, 720, errors));
    await shoot(browser, errors);
  } catch (e) {
    errors.push(String(e && e.stack || e));
  }
  report(errors.length === 0, "errors: " + (errors.length ? errors.join("; ") : "none"));
  await browser.close();
  const ok = results.every(Boolean);
  console.log("RESULT: " + (ok ? "PASS" : "FAIL") + " (" + results.length + " checks)  in " +
    ((Date.now() - t0) / 1000).toFixed(1) + "s; screenshots in " + outDir);
  process.exit(ok ? 0 : 1);
})();
