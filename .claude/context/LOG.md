# Project log: Clawdvania

Append-only. Newest entries at the bottom. Never edit or delete a past entry;
corrections go in a new entry as `- correction: ...`.
One entry per working session. `/project-status` builds its reports from this file
plus live git facts, so anything not written here is likely to be lost.

Entry format:

## YYYY-MM-DD | session N | <cli | web | desktop>
- did: <what actually changed>
- decided: <decision> because <reason>
- rejected: <alternative> because <reason>
- broke/fixed: <symptom, and resolution if any>
- open: <unresolved question>
- next: <intended next action>

---

## 2026-08-01 | session 1 | web
- did: bootstrapped this log and generated the first status report,
  `.claude/context/reports/SR-clawdvania-001.md`. No log or prior report existed, so
  project history before 2026-07-28 is reconstructed from git, `AUDIT.md`, `README.md`
  and the code, and is tagged `[inferred]` in the report.
- did: verified current state rather than asserting it — headless Chromium boot of
  `index.html` reaches the title state with zero page errors; the GitHub Pages build is
  byte-for-byte identical to local `index.html` (72352 bytes both); working tree clean;
  repo is 5 tracked files with no build, no tests and no CI.
- decided: keep `docs/screenshot.png` as a full-colour PNG (532KB) rather than a
  256-colour one (198KB) because quantising shifts 11% of pixels with a peak error of 51,
  and that error lands in the dusk gradient the image exists to show off.
- decided: capture the README screenshot at 1536x864 — exactly 3x the 512x288 design
  space — because an integer scale maps every sprite pixel to a clean 3x3 block, while
  the fractional scale used at arbitrary window sizes leaves Clawd with a ragged outline
  in a still image.
- decided: add `CLAUDE.md` to the repo because the response format and the verification
  practices were evaporating with each ephemeral cloud session.
- rejected: converting reference GIFs to mp4 for analysis, because video cannot be read
  at all whereas GIF frames and their per-frame timing can be extracted directly.
- broke/fixed: nothing broken this session. Confirmed the earlier duplicated wall-jump
  sound fix is still in place and that all three jump kinds own their own sound.
- open: whether Clawdvania stays a five-minute vignette or grows; whether "one file,
  zero assets" is a hard rule or a convenience; what else besides combat it must never
  become; and who the audience is.
- open: the wall cling and double jump remain decorative — a reachability search shows
  the double jump stands on exactly the same nine surface rows as no double jump. This
  is level design, not a defect.
- next: replace the sprite system's single scalar `fps` per pose set with per-frame
  durations. Uneven holds are currently inexpressible by construction, which blocks
  every queued animation improvement.

## 2026-08-01 | session 2 | web
- did: delivered SR-clawdvania-001 to chat; answers came back and are recorded below as
  decisions rather than open questions.
- decided: Clawdvania stays a five-minute vignette and gets **one** ravine, not a second
  area. Scopes the vertical section to a single addition instead of open-ended growth.
- decided: "one file" is locked, but data URIs satisfy it, so asset-shaped work is not
  blocked by the constraint. Clawd's sprites are inline pixel arrays and need nothing.
- decided: audience is a **portfolio piece**, which argues polish over content when the
  two compete. This reorders the backlog: presentation work outranks new level content.
- proposed (not yet confirmed by the author): no fail state, no timer or score, no
  backtracking. Recorded as a proposal, not an invariant, until the author confirms.
- did: added Open Graph and Twitter card meta tags to `index.html`, plus a meta
  description and theme-color. Crawlers only — the game never fetches the image, so it
  still runs from `file://` with nothing to load. The image URL is absolute because a
  crawler resolves it against its own host, not the page.
- did: generated `docs/thumbnail.png` at 1200x750 for both the link preview and the
  claude-works submission. Rendered at 1536x864 (S=3, an integer scale so sprite pixels
  stay uniform) and cropped, rather than rendered at 1200x750 directly, because that
  size forces a fractional scale of 2.34 and a ragged sprite outline.
- broke/fixed: fixed two section-numbering errors in the `project-status` skill. The
  template header told the reading assistant to answer "Section 5's open questions" when
  open questions are Section 3 and Section 5 is the verification ledger; `SKILL.md`
  separately called decisions "Section 3" when the template puts them at 2.4. The first
  was reported by the chat assistant, the second found while checking for more of the
  same. Note: these live in the user's skill directory, outside this repo, so the fix is
  not carried by this commit.
- correction: SR-clawdvania-001 as merged still carries the stale "Section 5" pointer in
  its header. Harmless — delivery already succeeded — and left as-is rather than
  rewriting a delivered artifact. Reports from 002 on will be correct.
- open: what "claude-works" requires beyond a 1200x750 thumbnail. The "external-work
  path" was named but not described, and nothing in this repo defines it.
- next: the ravine. Scope is now settled at one, and it is the only queued item that
  changes how the game plays.

## 2026-08-01 | session 3 | web
- decided: **claude-works submission is paused** until the project reaches a stable
  state. Supersedes the open question from session 2 about the external-work path —
  it is parked, not blocked, and should not be raised again until the author reopens it.
  The 1200x750 thumbnail is already built, committed and verified live, so nothing is
  lost by waiting.
- did: confirmed the PR #7 deploy end to end after merge. `docs/thumbnail.png` serves
  HTTP 200 as `image/png` at 377379 bytes, and the `og:*` / `twitter:*` tags are live
  on the deployed page — so link previews work against the real host, not just in source.
- proposed (not yet confirmed by the author): a definition of "stable" so the remaining
  work has a finish line rather than an open-ended polish loop. Four items, in order —
  (1) the ravine, so the cling and double jump stop being decorative; (2) per-frame
  sprite durations, then an anticipation frame and 2-3 `air` poses; (3) audit findings
  4 and 5 together in the resize/draw path; (4) the smaller notes, of which only
  `updateWisps` running on variable `dt` from the render pass has real teeth.
- next: the ravine, unchanged. Every blocker on it is cleared — scope is settled at one,
  and the presentation work that "polish over content" prioritised is shipped.
- did: generated status report SR-clawdvania-002 and verified state rather than recalling
  it — headless boot reaches the title with zero page errors; the live build is
  byte-for-byte identical to local `index.html` (74207 bytes both); the thumbnail serves
  HTTP 200 as image/png at 377379 bytes; 15 og:/twitter: tags are live on the deployed
  page; tree clean; 4 commits since report 001.
- did: recorded that SR-clawdvania-001 was delivered to chat and confirmed — the four
  open questions it raised came back answered, which is why they appear as decisions in
  report 002 rather than as questions.
- open: report 002 asks three questions — whether the four-item definition of "stable"
  is accepted; whether "no fail state / no timer / no backtracking" is confirmed rather
  than merely proposed; and whether the ravine is gated or optional (must the player
  descend it to finish the walk, or is it a pocket holding a wisp?).
- did: replaced the sprite frame picker with per-frame durations. Selection was
  `((animTime * fps_) | 0) % set.length` — one scalar fps per pose set, so an uneven
  frame hold was inexpressible by construction. Now each set has a baseline rate
  (`ANIM_FPS`) and any frame may override it with `hold: <seconds>`; cumulative frame
  end-times are built once at boot into `TIMING`, and `frameAt(name, time)` walks them.
  This is the first half of item (2) of the proposed definition of stable.
- decided: ship the mechanism with **no frame setting a `hold` yet**, so the change is a
  behavioural no-op. The author explicitly likes the current animations, so which frames
  get uneven timing is a taste call that stays theirs; building the capability without
  spending it keeps the two decisions separate and the diff reviewable on its own terms.
- did: verified the no-op by simulation rather than by eye. 944,000-sample sweep (60Hz to
  600s plus a dense 0.0001s sweep) across all four sets: 6,448 mismatches, **every one at
  distance exactly 0 from a true frame boundary**, zero mid-hold disagreements — the two
  pickers agree mathematically and round opposite ways on exact ties. Frame-*change*
  counts are identical (scuttle 6000/6000, idle 1800/1800 over 600s), which is what
  matters because `sndStep()` fires on frame change; no doubled or dropped footsteps.
  Headless boot: no page errors, all four sets reach every frame they declare over three
  full cycles, game reaches `play` and walks.
- broke/fixed: incidental — the old `| 0` was a 32-bit truncation, so frame selection
  would have broken after `animTime` passed ~2^31/fps seconds (~6.8 years of scuttling).
  Not reachable in practice; the replacement has no such ceiling.
- open: two scheduled routines belonging to *other* sessions, surfaced while cleaning up
  this project's triggers and reported to the author but not acted on — a duplicated
  "run /doctor" reminder that will fire twice on 2026-08-05, and a "Daily build log" cron
  whose next run is 2026-07-13, i.e. stalled. Not this repo's, so left alone.
- next: unchanged — the ravine, once the gated-or-optional question is answered. The
  cheapest first use of per-frame holds is the `air` set, which is a single pose today,
  so Clawd looks the same at jump apex as in freefall.

## 2026-09-27 | session 4 | web
- did: added the V3 Wisps poster to the top of the README, above the title, linked to the
  game and capped at 480px wide because it is a 1536x2304 portrait. The author first asked
  for it to replace the title-screen screenshot, then changed that to "put it at the top",
  so the screenshot stays. Merged as PR #11.
- broke/fixed: **the ravine was lost once.** It was built and verified after session 3, but
  plan mode was switched back on before it could be committed, and the container was
  reclaimed before plan mode lifted. Nothing had been pushed. Rebuilt today to the same
  layout and committed and pushed *before* any testing. Rule from here: in a cloud session,
  push a change as soon as it exists, then verify it.
- did: built the ravine. The third ditch (cols 68-72) keeps its floor, and its far side is
  built up: col 73 is a 64px face from the ditch floor (y=416) to its top (y=352), with a
  plateau at y=320 behind it that joins the platform at cols 80-83. Only LEVEL rows 20-23
  and the comment above LEVEL change; ROOM_H, the camera clamps, solidAt, wallAt, TUNING
  and WISP_SPOTS are untouched.
- decided: **built up, not dug down.** Only three rows exist below the walking surface, so
  digging would mean growing ROOM_H and reworking the camera clamps, parallax and drawn
  earth. Raising looks the same from the player's side. Cheap to reverse: four LEVEL rows.
- decided: **gated.** The bench, the cottage door and the last two wisps are past it, so
  reaching the ending needs the cling or the double jump. This was the stated assumption in
  the plan the author approved. Making it optional instead (so a player can walk past) is a
  one-row change.
- did: verified with the headless physics replica and reachability search, then in the
  browser. A single jump (measured apex 49.3px) can't cross; the double jump alone and the
  cling alone each can. Whole level: with abilities, 12/12 wisps plus the bench and the door;
  without, 10/12 wisps (the ravine wisp and the bench wisp are missing) and neither the bench
  nor the door. Row 17, the vista perch, is now reachable only with an ability, where before,
  abilities on and off stood on the same nine rows. Nobody is stranded: all 42 reachable
  states in the ditch climb back out to the left with no abilities. In the browser: no page
  errors, ROOM_H 432 and camera max 144 unchanged, and the ending still fires at the door.
- broke/fixed: a bug in the test harness, not the game. The first version let go of the jump
  button a few ticks after the first press, which cut every wall kick-off to 40% height and
  made the cling route look impossible. Traced it frame by frame, fixed the harness and
  re-ran. The level was never the problem.
- open: whether the ravine should stay gated (see above).
- open: `Resources/Clawdvania_Poster_V3_Wisps_cropped.png` (1536x1684, close to square) was
  uploaded and isn't referenced anywhere yet. It may have been meant as a shorter README
  poster; not acted on because nobody asked.
- next: the rest of the proposed "stable" list, which the author still hasn't confirmed:
  2-3 `air` poses using the per-frame holds, then audit findings 4 and 5 together in the
  resize/draw path.

## 2026-11-12 | session 5 | web
- note: session 4 (2026-09-27) worked on branch `claude/project-audit-nreywo`. Its README
  poster change merged as PR #11, but its log entry sits in draft PR #12, unmerged,
  together with a different ravine (see open).
- decided: the ravine is an **optional side pocket** under the third ditch (cols 68-72),
  not part of the way home, because the walk stays a five-minute walk and the pocket
  rewards curiosity. This answers report 002's gated-or-optional question; the author
  approved it in chat. It conflicts with draft PR #12 (see open).
- did: planned the ravine step by step in `.claude/context/plans/ravine.md`, with the
  exact tested code for every edit, and prototyped it in a scratch copy that is not
  committed. Applying the plan's edits to `index.html` reproduces the tested prototype
  byte for byte (checked mechanically). `index.html` itself is unchanged.
- did: added `tools/verify.js`, a movement checker in plain Node. It runs the game's own
  `updatePlayer` / `updateCamera` with the browser stubbed out and checks level
  integrity, reach per ability set against an `EXPECT` table, soft-locks over the whole
  level, an 85% jump-and-run handicap, the ravine camera, and optionally (`--baseline`)
  tick-for-tick lockstep against an older build and (`--deep`) a dense every-input
  search inside the ravine's hollows. Today's `index.html`: PASS, 12/12 wisps for every
  ability set, 655 places to stand, 0 stuck.
- decided: wisp 13 is free (the lure, visible from the surface), 14 needs the double jump,
  15 needs the cling, so each ability gets exactly one thing it's for. On the prototype:
  base 13/15, double jump 14/15, cling 15/15; soft-lock 0 of 714; the deep search gets no
  closer than 32px to wisp 14 without the double jump and 44px to wisp 15 without the
  cling, against a 15px pickup.
- decided: one fixed camera frame for the whole ravine with a 0.5s tilt, because a
  follow camera sways with the lookahead during wall kicks and lets Clawd drop off the
  bottom of the screen in a plunge. Feet stay at or above 274 of 288; a 0.7s tilt
  already puts them off screen.
- decided: the way out uses only plain jumps (one-tile rungs every 32px on alternating
  walls, under open sky), because an optional pocket must never trap a player who lacks
  a skill. Still true with jump and run at 85%.
- rejected: leaving the roofed cells see-through like the open gorge, because the
  hollows then read as floating slabs of ground. They get a dark rock back wall
  (`#120e1c`, picked by eye from four candidates).
- correction: earlier in this session the author was told the ravine "costs one pull
  request of level data plus a reachability check". That was too low. It also needs a
  camera zone (with the surface clamp kept separate from the taller room), a back wall
  for roofed cells, a fix so the leaves keep their density, three wisps and doc updates.
  Still one pull request.
- open: **which ravine.** Draft PR #12 (2026-09-27, unmerged) raises the far side of the
  same ditch into a 64px wall, which gates the bench, the door and the last two wisps
  behind the double jump or the cling. This plan digs an optional pocket instead. Only one
  can ship. Recommended: build this plan and close #12, because the author's latest call
  is optional, the pocket matches the V2 poster, and a gated ending walls out anyone who
  never finds the double jump. The author decides; nobody closes #12 unasked.
- next: the author picks between this plan and PR #12. If it's this plan, close #12, build
  per the plan in the next session, then the author plays it once in a real browser,
  since a feel check is the one thing the checker can't do.

## 2026-11-16 | session 6 | web
- note: PR #12 (session 4's raised wall) and PR #13 (session 5's plan and checker) were both
  merged on 2026-11-16, a minute apart, so `main` shipped the wall while its docs described
  the pocket. The author then chose the pocket ("build the pocket"), which settles it.
- correction: session 4's ravine claims were wrong. With no ability, a running jump pressed 2
  to 6 frames after leaving the left ledge (inside the 100ms coyote window) lands on the corner
  of col 73 and carries on to the bench and the door. So "A single jump (measured apex 49.3px)
  can't cross" and "without, 10/12 wisps ... and neither the bench nor the door" were false:
  the wall hid a five-frame trick instead of gating anything. `tools/verify.js` caught it (base
  reached 12 of 12, and the handicap check failed with 438 of 632 places stuck), and a sweep of
  jump timings through the game's own `updatePlayer` in Chromium confirmed it. Session 4's
  search ran a hand-written copy of the physics and never found that jump, and its one browser
  spot-check jumped too early. Verify with the checker, which runs the game's own code.
- rejected: keeping a gate and fixing the wall so it really gates, because that reverses the
  author's 2026-11-12 call, and the checker's soft-lock rule counts a gated ending as a failure.
- did: took the wall out by reverting 31f503c, which restores `index.html` byte for byte to the
  file the plan was tested against, then built the pocket from `.claude/context/plans/ravine.md`
  steps 1-5. A script applied every edit straight from the plan's own Find/Replace blocks (each
  had to match exactly once), so nothing was retyped. One commit per step, each pushed before
  its check ran.
- did: verified. Every checker gate matched the plan's expected output to the digit: step 1
  (112 x 38 tiles, 714 places to stand), step 2 (camera worst case feet at 274 of 288; lockstep
  674,462 ticks, 0 differences), step 3 (base 13, double jump 14, cling 15). The full
  `--baseline --deep` run passed all 8 checks in 272s: deep base 12,850,287 states, no
  closer than 32px to wisp 14; deep dj 72,841,913 states, no closer than 44px to
  wisp 15. Screenshots of both builds (plan step 7), 0 page errors: the surface is unchanged
  apart from the slot, the top rung and wisp 13 at the bottom edge; the ravine frame shows both
  lips, sky through the gorge, dark hollows with no seams and turf on the rungs.
- did: plan step 8 docs. README (wisp count, ditches, status line), AUDIT.md (the ravine note
  now carries the pocket's numbers and corrects session 4's), CLAUDE.md (the ravine is built)
  and the plan's status line (built).
- correction: merging PR #13 left the session-5 entry above session 4's, with no blank line
  between them. Moved session 4's entry back above it, as the plan asked; neither entry's
  wording changed.
- open: the feel check only the author can do. Play it once in a real browser: drop in, take
  wisp 13, climb out by the rungs. The tilt should feel like a glance down, not a cut.
- next: the ravine was item 1 of the proposed, still unconfirmed, "stable" list, and per-frame
  durations were half of item 2. Left: 2-3 `air` poses using the per-frame holds, then audit
  findings 4 and 5 together in the resize/draw path.

## 2026-11-16 | session 7 | web
- note: session 6 (the separate session that built the ravine) logged its entry in PR #15,
  which isn't merged yet, so on `main` this entry follows the misordered session 4. PR #15
  puts session 4 back in its place.
- did: found that PR #12 was merged by mistake a minute before PR #13 (the author confirmed
  it in chat), and that its wall doesn't gate. The checker reaches 12/12 wisps, the bench and
  the door with no abilities, and a replay through the game's own `updatePlayer` pins down
  the route: a jump pressed 1-5 ticks after running off the platform at cols 62-65 lands on
  top of the wall. Session 6 found the same thing independently.
- did: opened PR #14 to undo the wall. The author closed it unmerged, because PR #15 has the
  same revert plus the ravine.
- did: checked PR #15 ahead of the author's merge. Its `index.html` is byte-identical to the
  prototype verified on 2026-11-12, it boots with 0 page errors, and the checker passes
  (5 checks) with the plan's numbers.
- did: generated status report SR-clawdvania-003.
- broke/fixed: the `project-status` skill's synced template again tells the reading assistant
  to answer "Section 5's open questions" (they're Section 3). Session 2's fix to the skill
  didn't last. The report uses Section 3. The skill lives outside this repo, so it isn't
  fixed here.
- next: the author play-tests and merges PR #15, then 2-3 `air` poses using the per-frame
  holds.

## 2026-11-18 | session 8 | web
- note: Satejp10/Clawdvania#15 was merged into `main` at 07:39 UTC (merge `d86870f`). The live
  page now matches `main` (SHA-1 `b7414f33…`) and shows the v0.1 label. Pages serves `main`
  only, so the branch's own page showed the old build until the merge. The author downloaded
  the branch's `index.html` to see v0.1 first.
- did: the author played the ravine and said it "seems to be working" [logged: 2026-11-18].
- did: re-ran `node tools/verify.js` on the merged file: PASS (5 checks), 70.7 s.
- did: generated status report SR-clawdvania-004. It supersedes SR-clawdvania-003, whose
  acceptance SHA (`f58a71e2…`) is stale. `main` is `b7414f33…`.
- decided: the version label is a hand-edited constant in two places, `#build-version` in
  `index.html` and the README's Status line, because there is no build step to stamp it.
- rejected: a generated version stamp, because the project has no build step.
- decided: hide the label on touch-capable devices, because the touch jump button sits in the
  same corner.
- rejected: showing the label on touch screens, because it covers the jump button. Side
  effect: touch-screen laptops also hide it.
- broke/fixed: nothing broken.
- open: the four-item "stable" list is unconfirmed. So are "no fail state, no timer or score,
  no backtracking", and the purpose of `Resources/Clawdvania_Poster_V3_Wisps_cropped.png`,
  which nothing references.
- next: the author decides the "stable" list. If it is accepted, build item 2: 2–3 `air`
  poses on the per-frame holds.

## 2026-11-18 | session 9 | web
- did: researched recent Claude-made browser demos: a GitHub list of about 2,800 posted works (480 of them games), plus a few game write-ups. The videos were not watched. Notes saved to Box under Claude/Clawdvania, not to the repo. No game code changed.
- did: checked before writing: `node tools/verify.js` PASS (5 checks, 52.3 s); the live page's SHA-1 equals `main`'s `index.html`; no open pull requests.
- did: generated status report `.claude/context/reports/SR-clawdvania-005.md`, which supersedes SR-clawdvania-004.
- decided: proposed, not yet confirmed by the author. The first visual step is a Canvas 2D poster pass, and WebGL only if that falls short. The game already draws glow in Canvas and the poster gaps are Canvas-sized, so this is the cheapest test of whether WebGL is needed.
- rejected: a WebGL rewrite as the first step, because it is the most expensive path and the Canvas route has not been tried. Also rejected: a 3D rewrite in the style of the viral demos, because it would be a different game (no painted world, no pixel crab).
- correction: the chat answer today said most of the demos are WebGL/GLSL and called one tip "widely shared." The first was a guess from titles, not a count, and the tip came from one post. The Box overhaul note repeats both; report 005 supersedes it.
- correction: the chat answer said Canvas 2D "can only fake light." The game already uses additive Canvas glow, so that was too strong.
- broke/fixed: nothing broken.
- open: whether the author accepts the four-item "stable" list; whether "no fail state, no timer or score, no backtracking" is confirmed; whether the poster pass goes in before "stable".
- next: the author answers the three questions in report 005. If the poster pass is approved, build it as one change, checked with `--baseline` against `ae83d91`. If not, the air poses wait on the stable list.

## 2026-11-23 | session 10 | web
- did: the author played v0.1 through to the ending ("so far so good", 10 wisps) and asked for the next step, and for a plan if there wasn't one. The next step was report 005's Canvas 2D poster pass, which had an outline but no build plan. Wrote one: `.claude/context/plans/poster-pass.md`, with the exact change as `poster-pass/index.patch`, a browser check `poster-pass/check.js` and `poster-pass/before-after.jpg`. `index.html` is untouched.
- did: prototyped the pass in a scratch copy of `index.html` and checked it. `node tools/verify.js <prototype> --baseline <v0.1>`: PASS (6 checks) in 41.9 s; lockstep compared 674,462 ticks with 0 differences. `check.js`: 9 of 9 on the prototype. On v0.1 it fails 4: Clawd slides 146 px past the door, a jump rises 7.3 px, there is no walk-again, and his eye pixels come out 2 or 3 px wide (audit finding 4, now measured). The patch applies to v0.1 (SHA-1 `b7414f33…`) and gives the prototype byte for byte (`69fd3234…`).
- did: measured cost in headless Chromium, which renders in software, so only the ratio means anything: about 15% more per frame (walk at 1280x720: 51.9 ms against 59.2 ms). It was about 30% until the haze was baked into the farthest hill layer instead of being its own full-screen pass.
- decided: proposed, needs the author's yes: the poster pass goes before the rest of the "stable" list (question 3 of report 005), and as v0.2.
- decided: proposed, needs the author's yes: the ending ignores input once Clawd reaches the door. He steps inside about 4 s in, a closing card follows, and after 11 s any key or tap starts the walk again. A closing sequence needs him to stay put, and it fixes walking on past the house (AUDIT smaller notes).
- decided: the far-hill cottage stands on the layer's crest at x 471, small and hazy, and fades out while the camera moves from x 860 to 1060, before the real cottage appears at 1094, because two cottages on screen at once would be confusing.
- rejected: the far cottage at its old size (30 px), because it read as a house in the playfield next to the floating ledges.
- rejected: drawing the far cottage's windows after the night tint like the other lights, because they would show on top of platforms that pass in front of it (worked out from the geometry, not seen).
- rejected: keeping the god rays and the top-right sun, because the posters light the scene from the horizon.
- correction: while prototyping, a curve in the ravine's gorge was blamed on the new farthest hill range, which was lowered for it. The curve is the far hill's crest seen through the slot, and it was there in v0.1 too. The lower range stayed because it still looks right.
- broke/fixed: nothing broken in the game.
- open: the author's yes on the poster pass and on the new ending; the closing card's wording (it has no credit line); questions 1 and 2 of report 005 are still unanswered.
- next: if the author says yes, build it from the plan (apply, both checks, docs, v0.2, draft PR), then the author plays it once, on a phone too.
- did: generated status report `.claude/context/reports/SR-clawdvania-006.md`, which supersedes SR-clawdvania-005. Checked for it: `node tools/verify.js` on today's `index.html` PASS (5 checks, 40.6 s); the live page's SHA-1 equals `main`'s `index.html` (`b7414f33…`).
- broke/fixed: the plan's first Box upload (`poster-pass-plan-2026-11-23.md`) went out with a placeholder line instead of the plan text, and the Box tools in this session can't delete or overwrite a file. Left a comment on it saying so and uploaded the full plan beside it as `poster-pass-plan.md`. The stub can be deleted by hand.
- did: the author merged PR #19 (the plan) and said "build v0.2". Built it from the plan with no new logic: `git apply` of `poster-pass/index.patch` gave `69fd3234…` as expected, then `#build-version` and the README went to v0.2.
- did: checked the final `index.html`: `node tools/verify.js index.html --baseline <v0.1>` PASS (6 checks) in 41.2 s, lockstep 674,462 ticks with 0 differences; `poster-pass/check.js` 9 of 9 in 47.4 s. Both match the plan's expected output.
- did: retook `docs/screenshot.png` and `docs/thumbnail.png` with `check.js` after the version bump (the first take still said v0.1 in the corner) and re-saved them losslessly: pixels identical, 1,191 KB to 733 KB and 933 KB to 595 KB. The dark shape at the top left of the README image is a foreground branch; the old image has it too.
- did: README "Look:" line (no god rays; the horizon glow, the far cottage, up to 2×, Clawd on whole pixels) and Status (v0.2, the new ending); AUDIT findings 4 and 5 and the walk-past note marked fixed; the plan's status set to built.
- correction: the plan said Clawd is drawn at a whole number of device pixels per sprite pixel, but not that this changes his size against the world. He's drawn at `k / S` of his old size: 1.2× in a 1280×720 window, 1.07× at 1920×1080. Noted in AUDIT and in the PR, for the playtest.
- open: the author plays the PR's `index.html` once (the sky's warmth, the far cottage's fade, the ending's timing, Clawd's size, smoothness on their slowest device); the closing card's wording; questions 1 and 2 of report 005.
- next: if the playtest is good, merge, and the live site shows v0.2. If not, tune from the author's notes in the same PR.
- did: generated status report `.claude/context/reports/SR-clawdvania-007.md`, which supersedes SR-clawdvania-006. Checked for it: the live page's SHA-1 equals `main`'s `index.html` (`b7414f33…`, still v0.1); every line and file cited in its section 2.3 re-checked with grep.
- note: the author merged Satejp10/Clawdvania#20 (v0.2) at 20:02 UTC, merge `769fff0`. Checked: the live page's SHA-1 equals `main`'s `index.html` (`86dace47…`) and its corner reads v0.2, so report 007's next action 1 is done. Stopped watching the PR, cancelled the check-in, restarted this branch from `main`, and left a comment on SR-clawdvania-007 in Box saying it merged.
- did: added `.claude/context/FEATURES.md`, one list of every feature: built, planned, ideas and ruled out. The author asked whether one existed. It didn't: features were spread across the README, this log, `AUDIT.md`, the plans, the reports and two Box notes. `CLAUDE.md` now says to update it in the same commit as the feature. A copy is in Box as `features-2026-11-23.md`.
- decided: the list lives in `.claude/context/` beside this log and the plans, not in the README, because it's working memory for building the game, not something players read.
- did: logged the author's idea of breakable floors and a downward slash (like Hollow Knight's Desolate Dive) under Ideas in `FEATURES.md`. Floors crumble when walked on but hold; the slash breaks them and opens a secret area. Five questions to settle before planning are listed with it: slash or slam (the game has no combat), how big the secret areas are (scope), controls (Down is unused on keys; phones have no down button), there from the start or found, and safety (a plain-jump way out, floors that reset, `tools/verify.js`). Nothing built.
- open: the author's phone check on the live site (planned for tomorrow); questions 2–4 of report 007: a credit line on the closing card, the stable list, and "no fail state, no timer or score, no backtracking".
- next: the phone check. Then, if the stable list is accepted, the jump poses.
- did: generated status report `.claude/context/reports/SR-clawdvania-008.md`, which supersedes SR-clawdvania-007. Checked for it on `main` at `d93c121`: `node tools/verify.js index.html --baseline <v0.1>` PASS (6 checks) in 58.8 s, lockstep 674,462 ticks with 0 differences; `poster-pass/check.js` PASS (9 checks) in 62.7 s; the live page's SHA-1 equals `main`'s `index.html` (`86dace47…`) and reads v0.2; no open pull requests. A copy is in Box.

## 2026-11-24 | session 11 | web
- decided: the owner accepted the four-item "stable" list as written (question 1 of report 008). Items 1 and 3 and the first half of item 2 are built. Left: the jump poses (v0.3), then the smaller notes. When those are built the game is "stable", which is what the claude-works submission waits on.
- decided: confirmed by the owner: no fail state, no timer or score, and no backtracking. Backtracking means returning to earlier areas; a local trip like the ravine is fine. This was a proposal from session 2 until now. Recorded in `CLAUDE.md` and under Ruled out in `FEATURES.md`.
- decided: the closing card gets a credit line, in the owner's words: "by Satej Patil · made with Claude Code" (question 3).
- decided: breakable floors stay under Ideas as a possible mechanic, not planned (question 5). If they're ever planned: a slam, not a slash; small pockets, not a second area; and Clawd has the move from the start. Controls and safety are still open.
- open: the phone check. The owner's message kept the template's placeholder ("[all fine / what felt off]") where the result would go, so nothing was fixed for it.
