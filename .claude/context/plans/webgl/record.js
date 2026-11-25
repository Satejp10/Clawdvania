#!/usr/bin/env node
"use strict";
/*
 * The side-by-side video: v0.3 on top, the WebGL prototype below, through the same run.
 *
 *   node record.js <v0.3.html> <prototype.html> <outdir>
 *
 * Both builds are driven by hand, the way the review scripts drive the game: the browser's
 * frame loop is stubbed out, Math.random is seeded the same in both, and every tick is
 * called directly. Each video frame is two physics ticks (60 Hz) and one render (30 fps).
 * The keys come from route.js. After every frame the two builds' positions and cameras
 * are compared, so the video also shows the physics is the same: any drift stops the run.
 *
 * Writes <outdir>/side-by-side.mp4, a smaller side-by-side.gif for the pull request, and
 * stills (title.jpg, play.jpg) comparing the two at chosen moments. The preview is a GIF
 * because the tool that writes pull request text rewrote a .webp image and a .mp4 link
 * into broken text (2026-11-25), while .png and .jpg images came through.
 */
const { chromium } = require("playwright");
const { spawn, execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { planRoute } = require("./route.js");

const [oldArg, newArg, outArg] = process.argv.slice(2);
if (!outArg) { console.error("usage: node record.js <v0.3.html> <prototype.html> <outdir>"); process.exit(1); }
const builds = [["v0.3 (live now)", path.resolve(oldArg)], ["WebGL prototype", path.resolve(newArg)]];
const out = path.resolve(outArg);
fs.mkdirSync(out, { recursive: true });

const FPS = 30, W = 1280, H = 720;
const TITLE_F = 3 * FPS;              // frames on the title before the first key
const TAIL_F = 1 * FPS;               // standing still at the end
const STILLS = { title: 75, play: null };   // frame numbers; play is picked once the route is known

const route = planRoute(builds[0][1], TITLE_F * 2);
const tape = route.tape.slice();
if (tape.length % 2) tape.push(0);
const PLAY_F = tape.length / 2;
const TOTAL = Math.min(TITLE_F + PLAY_F + TAIL_F, +(process.env.LIMIT || Infinity));   // LIMIT: a short test run
STILLS.play = TITLE_F + Math.round(PLAY_F * 0.44);
console.log("route:", route.tape.length, "ticks;", TOTAL, "frames,", (TOTAL / FPS).toFixed(1), "s");

async function open(browser, file) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => { console.error(path.basename(file) + ": " + e.message); process.exitCode = 1; });
  await page.addInitScript(() => {
    window.__capture = true;                       // the WebGL build keeps its frame for screenshots
    window.requestAnimationFrame = () => 0;        // no loop of its own: every frame is driven from here
    let s = 7;
    Math.random = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  });
  await page.goto("file://" + file);
  await page.evaluate(() => {
    // one video frame: two ticks with these keys (bit 1 left, 2 right, 4 jump held, 8 jump
    // pressed; null = keep the keys as they are), then one render
    window.__frame = (keys, start) => {
      if (start) startGame();
      for (const b of keys) {
        if (b !== null) {
          input.left = !!(b & 1); input.right = !!(b & 2); input.jumpHeld = !!(b & 4);
          if (b & 8) input.jumpPressed = true;
        }
        updatePlayer(STEP); updateCamera();
      }
      render(60, 1 / 30);
      return [player.x, player.y, player.vx, player.vy, cam.x, cam.y].map((v) => +v.toFixed(4)).join(",");
    };
  });
  return page;
}

// one ffmpeg per build, fed JPEG frames on stdin, so no frames pile up on disk
function encoder(file) {
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg",
    "-i", "-", "-c:v", "libx264", "-crf", "12", "-preset", "fast", "-pix_fmt", "yuv420p", file], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => (c ? rej(new Error("ffmpeg " + c)) : res())));
  return { write: (buf) => new Promise((res) => (ff.stdin.write(buf) ? res() : ff.stdin.once("drain", res))), end: () => { ff.stdin.end(); return done; } };
}

(async () => {
  const browser = await chromium.launch();
  const pages = [];
  for (const [, file] of builds) pages.push(await open(browser, file));
  const parts = builds.map((_, i) => path.join(out, "part" + i + ".mp4"));
  const enc = parts.map(encoder);
  const t0 = Date.now();
  for (let f = 0; f < TOTAL; f++) {
    const playF = f - TITLE_F;
    const keys = playF < 0 ? [null, null] : playF < PLAY_F ? [tape[playF * 2], tape[playF * 2 + 1]] : [0, 0];
    const states = [];
    for (const page of pages) states.push(await page.evaluate(([k, s]) => __frame(k, s), [keys, playF === 0]));
    if (states[0] !== states[1]) throw new Error("the builds drifted apart at frame " + f + ": " + states.join("  vs  "));
    for (let i = 0; i < pages.length; i++) {
      const jpg = await pages[i].screenshot({ type: "jpeg", quality: 95 });
      await enc[i].write(jpg);
      for (const [name, at] of Object.entries(STILLS)) if (at === f) fs.writeFileSync(path.join(out, name + "-" + i + ".jpg"), jpg);
    }
    if (f % 30 === 0) console.log("frame", f, "/", TOTAL, ((Date.now() - t0) / 1000).toFixed(0) + "s", states[0]);
  }
  await Promise.all(enc.map((e) => e.end()));
  await browser.close();

  // stack them, labelled, then a smaller GIF for the pull request (kept under 5 MB, so
  // GitHub's image proxy will show it)
  const font = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
  const label = (t) => "drawtext=fontfile=" + font + ":text='" + t +   // no commas or colons in t
    "':x=18:y=16:fontsize=26:fontcolor=white@0.92:box=1:boxcolor=black@0.45:boxborderw=10";
  const mp4 = path.join(out, "side-by-side.mp4");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", parts[0], "-i", parts[1], "-filter_complex",
    "[0]" + label(builds[0][0]) + "[a];[1]" + label(builds[1][0]) + "[b];[a][b]vstack",
    "-c:v", "libx264", "-crf", "21", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", mp4, "-vf",
    "fps=8,scale=400:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=160:stats_mode=diff[p];" +
    "[b][p]paletteuse=dither=bayer:bayer_scale=2:diff_mode=rectangle", "-loop", "0", path.join(out, "side-by-side.gif")]);
  for (const name of Object.keys(STILLS)) {
    if (!fs.existsSync(path.join(out, name + "-1.jpg"))) continue;
    execFileSync("montage", [path.join(out, name + "-0.jpg"), path.join(out, name + "-1.jpg"), "-tile", "1x", "-geometry", "+0+6",
      "-background", "#000", "-quality", "90", path.join(out, name + ".jpg")]);
    for (let i = 0; i < 2; i++) fs.unlinkSync(path.join(out, name + "-" + i + ".jpg"));
  }
  for (const p of parts) fs.unlinkSync(p);
  for (const f of ["side-by-side.mp4", "side-by-side.gif", "title.jpg", "play.jpg"]) if (fs.existsSync(path.join(out, f)))
    console.log(f, (fs.statSync(path.join(out, f)).size / 1e6).toFixed(2) + " MB");
  console.log("done in", ((Date.now() - t0) / 1000).toFixed(0) + "s");
})().catch((e) => { console.error(e); process.exit(1); });
