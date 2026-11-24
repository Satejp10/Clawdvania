#!/usr/bin/env node
"use strict";
/*
 * Before/after images for the v0.3 pull request: one full jump (the launch, rising, the
 * top, falling) and the closing card, for two builds.
 *
 *   node .claude/context/review/v0.3/shots.js <before.html> <after.html> [outdir]
 *
 * Each build is driven the way check.js drives it (requestAnimationFrame stubbed out,
 * Math.random seeded, every tick called by hand), so both builds show the same moments.
 * The jump is a held jump from flat ground at x 900 with the camera held still, so the
 * crops share one background and show how high Clawd is. Writes jump.png and closing.jpg
 * to outdir (default: this folder).
 */
const { chromium } = require("playwright");
const path = require("path");

const [beforeArg, afterArg, outArg] = process.argv.slice(2);
if (!beforeArg || !afterArg) {
  console.error("usage: node shots.js <before.html> <after.html> [outdir]");
  process.exit(1);
}
const builds = [["before", path.resolve(beforeArg)], ["after", path.resolve(afterArg)]];
const outDir = path.resolve(outArg || __dirname);
const MOMENTS = [[2, "launch"], [9, "rising"], [19, "top"], [29, "falling"]];   // ticks into the jump

const errors = [];
async function openGame(browser, file, dsf) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: dsf });
  page.on("pageerror", (e) => errors.push(path.basename(file) + ": " + e));
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 0;
    let s = 7;
    Math.random = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  });
  await page.goto("file://" + file);
  return page;
}

async function jumpShots(browser, file) {
  const page = await openGame(browser, file, 2);
  const at = await page.evaluate(() => {
    game.state = "play"; game.tfade = 1; playT = 10;
    resetPlayer(); player.x = 900; player.y = 374;
    cam.x = clamp(player.x + player.w / 2 - VIEW_W / 2, 0, ROOM_W - VIEW_W);
    cam.y = clamp(player.y + player.h / 2 - VIEW_H / 2, 0, SURFACE_H - VIEW_H);
    cam.fx = player.x + player.w / 2; cam.fy = player.y + player.h / 2;
    for (let i = 0; i < 120; i++) { updatePlayer(STEP); updateCamera(); }
    for (let i = 0; i < 40; i++) render(60, 1 / 60);
    const cx = Math.round(cam.x), cy = Math.round(cam.y);
    return { x: (offX + (Math.round(player.x - cx) + player.w / 2) * S) / dpr,
             y: (offY + (Math.round(player.y - cy) + player.h) * S) / dpr, s: S / dpr };
  });
  const clip = { x: Math.round(at.x - 28 * at.s), y: Math.round(at.y - 74 * at.s),
                 width: Math.round(56 * at.s), height: Math.round(84 * at.s) };
  const shots = { version: await page.evaluate(() => document.getElementById("build-version").textContent) };
  for (let t = 1; t <= MOMENTS[MOMENTS.length - 1][0]; t++) {
    await page.evaluate((t) => {
      if (t === 1) { input.jumpPressed = true; input.jumpHeld = true; }
      updatePlayer(STEP);                     // no updateCamera: the frame holds still
      render(60, STEP);
    }, t);
    if (MOMENTS.some(([m]) => m === t)) shots[t] = (await page.screenshot({ clip, timeout: 180000 })).toString("base64");
  }
  await page.close();
  return shots;
}

async function closingShot(browser, file) {
  const page = await openGame(browser, file, 1);
  await page.evaluate(() => {                 // check.js's "closing" scene: 13 s into the ending
    game.state = "play"; game.tfade = 1; playT = 10;
    for (let i = 0; i < 10; i++) { const w = wisps[i]; if (w.state === "idle") { w.state = "orbit"; wispCount++; w.x = player.x; w.y = player.y; } }
    resetPlayer(); player.x = 1641; player.y = 374;
    cam.x = clamp(player.x + player.w / 2 - VIEW_W / 2, 0, ROOM_W - VIEW_W);
    cam.y = clamp(player.y + player.h / 2 - VIEW_H / 2, 0, SURFACE_H - VIEW_H);
    cam.fx = player.x + player.w / 2; cam.fy = player.y + player.h / 2;
    for (let i = 0; i < 3; i++) { updatePlayer(STEP); updateCamera(); }
    for (let i = 0; i < 130; i++) render(60, 0.1);
  });
  const png = (await page.screenshot({ timeout: 180000 })).toString("base64");
  await page.close();
  return png;
}

// Lay the shots out on a plain page and photograph it, so no image tools are needed.
async function compose(browser, html, file, type) {
  const page = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: 1 });
  await page.setContent("<!doctype html><meta charset=utf-8><style>body{margin:0;background:#15121f;color:#ffe9c4;" +
    "font:600 15px/1.3 system-ui,sans-serif}#c{display:inline-block;padding:14px 16px}td{padding:4px;vertical-align:middle}" +
    "th{font-weight:600;padding:2px 4px 6px;text-align:center}.k{color:#b9a9c9;font-weight:500;font-size:13px}img{display:block}" +
    ".row{padding-right:10px;text-align:right;white-space:nowrap}</style><div id=c>" + html + "</div>");
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  await page.locator("#c").screenshot({ path: file, type, ...(type === "jpeg" ? { quality: 90 } : {}) });
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();
  const jump = {}, closing = {};
  for (const [name, file] of builds) {
    jump[name] = await jumpShots(browser, file);
    closing[name] = await closingShot(browser, file);
  }
  const label = (name) => jump[name].version + "<br><span class=k>" + name + "</span>";
  // two device px per CSS px in the jump crops: show them at their own size
  let rows = "<tr><th></th>" + MOMENTS.map(([t, n]) => "<th>" + n + "<br><span class=k>tick " + t + "</span></th>").join("") + "</tr>";
  for (const [name] of builds)
    rows += "<tr><td class=row>" + label(name) + "</td>" +
      MOMENTS.map(([t]) => "<td><img src='data:image/png;base64," + jump[name][t] + "'></td>").join("") + "</tr>";
  await compose(browser, "<table>" + rows + "</table>", path.join(outDir, "jump.png"), "png");
  let card = "";
  for (const [name] of builds)
    card += "<tr><td class=row>" + label(name) + "</td><td><img src='data:image/png;base64," + closing[name] + "'></td></tr>";
  await compose(browser, "<table>" + card + "</table>", path.join(outDir, "closing.jpg"), "jpeg");
  await browser.close();
  if (errors.length) { console.error("page errors:\n  " + errors.join("\n  ")); process.exit(1); }
  console.log("wrote jump.png and closing.jpg to " + outDir + " in " + ((Date.now() - t0) / 1000).toFixed(1) + "s");
})();
