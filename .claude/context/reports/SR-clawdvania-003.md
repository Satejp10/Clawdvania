**FOR CLAUDE.AI:** This is a status report generated inside Claude Code for the project below. Read it fully, update your stored memory for this project from Section 6, then reply with a short confirmation of what changed plus answers to any of Section 3's open questions you can address. Do not restate the report back to me. Treat Section 2 as current truth and anything you remembered previously as superseded.

---

```yaml
report_id: SR-clawdvania-003
project: Clawdvania
repo: https://github.com/Satejp10/Clawdvania
branch: claude/friendly-ritchie-27pbjk (this report only; main is at c46c247)
generated_utc: 2026-11-16T21:27Z
surface: claude code web
session_id: session_01JgeXKD2eCpPL1LkiLC2Zrx
project_started: 2026-07-13
days_active: 11
total_commits: 35
commits_since_last_report: 14
previous_report: SR-clawdvania-002 (2026-08-01)
previous_report_delivered_to_chat: unknown
supersedes: SR-clawdvania-002
standalone: true
```

---

# TLDR

- **What:** A five-minute browser platformer in one HTML file (vanilla JS + Canvas 2D): Clawd the pixel crab walks home at dusk. Metroidvania movement, no combat.
- **Status:** Live and playable. `main` currently carries a raised wall at the third ditch that was merged by mistake on 2026-11-16 (PR #12). The ravine that replaces it is built and verified in draft PR #15, waiting only on the author's play-test and merge.
- **Changed since SR-clawdvania-002:** The ravine was decided (an optional pocket, not a gate), planned step by step, and built in PR #15. A movement checker, `tools/verify.js`, now runs the game's own physics headlessly, and it showed that PR #12's "gate" never gated. Per-frame sprite durations shipped, and the README got the V3 Wisps poster.
- **Blocked:** Nothing technical. PR #15 waits on one browser play-test by the author.
- **Next:** Play PR #15 in a browser, then merge it. That removes the accidental wall and ships the ravine in one step.
- **Needs a decision from you:** Accept or amend the four-item definition of "stable". Item 1, the ravine, is about to land, and the rest of the work has no finish line until this is settled.

---

# 1. Delta since SR-clawdvania-002

**Shipped (on `main` and live):**
- Per-frame sprite durations (PR #10). Each pose set has a base rate, and any frame can override it with `hold: <seconds>`. No frame sets a hold yet, so the animation looks exactly as before. `[logged: 2026-08-01]`
- The V3 Wisps poster at the top of the README (PR #11). `[logged: 2026-09-27]`
- `tools/verify.js` (PR #13): a movement checker in plain Node that runs the game's own `updatePlayer` and `updateCamera` with the browser stubbed out. `[verified: ran it on main and on PR #15's game file this session]`
- `.claude/context/plans/ravine.md` (PR #13): the ravine's build plan, with the exact tested code for every edit. `[verified: read]`
- PR #12's raised wall at the third ditch. This was merged by mistake; see "New problems". `[verified: git log; diff of index.html]`

**Built, not yet merged:** the ravine, in draft PR #15 (branch `claude/project-audit-nreywo`), built by applying the plan's edits with a script. `[verified: PR #15's index.html is byte-identical to the prototype verified on 2026-11-12 (SHA-1 f58a71e2...)]`

**Changed direction:**
- **The ravine is optional, not gated.** The author approved this on 2026-11-12 and confirmed it on 2026-11-16 ("build the pocket"). It answers SR-002's question 3. Session 4 (2026-09-27) had built a gated version on the assumption that it should gate; that is superseded. `[logged: 2026-11-12, 2026-11-16]`
- **The ravine is dug down under the ditch, not built up beside it.** `[logged: 2026-11-12]`

**New problems:**
- **PR #12 was merged by mistake** on 2026-11-16, a minute before PR #13 (the author said so in chat). The live site has served its 64px wall since 16:23 UTC that day. `[verified: git log; Pages deploy run for 7f91f48; curl SHA-1 matches main]`
- **That wall never gated anything.** With neither ability, the checker reaches all 12 wisps, the bench and the door. A replay through the game's own `updatePlayer` pins down the route: run off the right end of the floating platform at cols 62-65 (row 20), press jump 1 to 5 ticks after leaving it (inside the 100ms coyote window), and Clawd lands on top of the wall. Jumping from the edge itself drops him into the ditch. Session 4's "10/12 without abilities" came from a hand-written replica of the physics that missed this jump. `[verified: node tools/verify.js on main; replay probe this session]` With jump height and run speed at 85%, the handicap check fails: the door is out of reach, and 438 of 632 places to stand can't get home. `[verified: node tools/verify.js on main, 299s; session 6 logged the same figure]`
- **The docs on `main` disagree with the game.** `AUDIT.md` repeats PR #12's false "10/12 wisps, neither the bench nor the door" claim, `CLAUDE.md` says the ravine is only planned, and `LOG.md` has session 4's entry below session 5's (left by the merge-conflict resolution). PR #15 fixes all three. `[verified: read main's files and PR #15's diff]`

**Dropped:**
- PR #12's gated-wall design. It was abandoned because it doesn't gate, and because it contradicts the optional decision. `[logged: 2026-11-16]`
- PR #14, a wall-only revert from this session, was closed unmerged on 2026-11-16, because PR #15 contains the same revert plus the ravine. `[verified: GitHub]`

---

# 2. Full state (standalone)

## 2.1 What this is and why

**Clawdvania is a five-minute browser platformer.** Clawd, an orange pixel crab, walks home across autumn hills at dusk. He gathers wisps that orbit him and light his path, rests at a bench overlook, and reaches a cottage before dark. The atmosphere borrows from *Ori* and *Hollow Knight*, with **none of the combat**. `[logged: 2026-08-01]`

**It is a portfolio piece.** When polish and content compete, polish wins. `[logged: 2026-08-01]`

**What it must not become:** a combat game, or anything longer than a five-minute vignette. The one agreed vertical addition is the ravine, an **optional** pocket under the third ditch, and nothing may gate the walk home. `[logged: 2026-08-01, 2026-11-12]` Proposed and not yet confirmed by the author: no fail state, no timer or score, no backtracking.

**Hard constraints:**
- **One self-contained `index.html`.** No engine, no build step, no asset files loaded by the game, and it must run from `file://`. "One file" is locked, but data URIs satisfy it. `[logged: 2026-08-01]`
- No package manager and no CI. The one tool is `tools/verify.js` (plain Node, nothing to install). `[verified: git ls-files; no package.json, no .github directory]`
- Deployed by GitHub Pages from `main`. The URL has a capital C. `[verified: curl of https://satejp10.github.io/Clawdvania/ → HTTP 200]` (that the lowercase path 404s: `[logged: 2026-08-01]`)

## 2.2 Timeline

- Started: **2026-07-13** (`130d0a4` "Phase 1: movement greybox with Ori-inspired procedural theming"). `[verified: facts block]`
- **35 commits across 11 active days**, 5 of them in the last 14 days. `[verified: facts block]`
- Sessions logged: 1 through 5 are on `main`. Session 6, which built the ravine, is logged in PR #15. This report is session 7. `[verified: read LOG.md on both branches]`
- Milestones:
  - 2026-07-13: movement greybox. `[verified: git log]`
  - By 2026-08-01: eight PRs (audit fixes, ditches, wall cling, double jump, link previews), SR-001, the scope decisions, and the claude-works pause. `[logged: 2026-08-01]`
  - 2026-08-01: SR-002, and per-frame sprite durations (PR #10, merged 2026-08-02). `[logged: 2026-08-01]`
  - 2026-09-27: README poster (PR #11), and a gated raised-wall ravine (PR #12, left as a draft). `[logged: 2026-09-27]`
  - 2026-11-12: the ravine re-decided as an optional pocket, with the plan and the checker written (PR #13). `[logged: 2026-11-12]`
  - 2026-11-16: PR #12 merged by mistake and PR #13 merged a minute later. The ravine was built per the plan in PR #15 (draft). PR #14 was closed as redundant. `[verified: git log; GitHub]`
- This report: **2026-11-16T21:27Z**.

## 2.3 Where the code is

**Stack:** Vanilla JavaScript + Canvas 2D in `index.html`. No framework, libraries or bundler. The checker is plain Node (v22 in the cloud container). `[verified: read index.html, tools/verify.js]`
**Entry point:** `index.html`, which is the entire game: 76,265 bytes on `main`, 80,189 bytes in PR #15. `[verified: wc -c]`

**Working (on `main`, which is what's live):**
- Boots to the title with **zero page errors**: 12 wisps, a 112×27-tile level. `[verified: headless Chromium (Playwright) this session]`
- The live site is **byte-identical to `main`** (76,265 bytes, same SHA-1). `[verified: curl + sha1sum this session]`
- Checker: `reach` PASS (12/12 wisps, door and bench for every ability set), and `soft-lock` PASS (632 places to stand, none stuck). `[verified: node tools/verify.js this session]`
- Movement: run, variable-height jump, coyote time (100ms), jump buffer (120ms), wall cling and kick-off, and one air jump (the double jump). Physics are derived from `jumpApexTiles: 3.25` and `timeToApex: 0.32`, giving `JUMP_VEL` 325 px/s and `GRAV_RISE` ≈1015.6 px/s². The measured single-jump apex is 49.3px. `[verified: read TUNING; apex measured by replay this session]`

**Built and waiting in PR #15:**
- **The ravine.** An open gorge under the third ditch (cols 68-72) goes down to a floor at row 36, with the level grown to 38 rows. One-tile rungs on alternating walls, 32px apart, let plain jumps climb out. A low door leads into two roofed hollows (a grotto and a chimney), which have a dark rock back wall (`#120e1c`). Three new wisps bring the total to 15: wisp 13 is free and visible from the surface as a lure, wisp 14 needs the double jump (or the cling), and wisp 15 needs the cling. A fixed camera frame covers the whole pocket, with a 0.5s tilt in and out. `[verified: read PR #15's description and diff]`
- Boots with zero page errors: 15 wisps, a 112×38-tile level. `[verified: headless Chromium this session]`
- Checker: PASS, 5 checks. Reach is base 13, double jump 14, cling 15, both 15, with door and bench for all. Soft-lock: 714 places, 0 stuck. Handicap at 85%: 0 of 714 stuck. Camera: worst case feet at 274 of 288 and head at 17, and wisp 13 shows 8px above the bottom edge of the surface view. `[verified: node tools/verify.js on PR #15's index.html this session]`
- The same file passed the full `--baseline --deep` run: 8 checks, including 674,462 ticks of lockstep against the old build with 0 differences, and dense searches showing that plain jumps get no closer than 32px to wisp 14, and the double jump alone no closer than 44px to wisp 15, against a 15px pickup radius. `[logged: 2026-11-12 on the prototype; 2026-11-16 in PR #15]`

**Broken or incomplete (on `main`):**
- **The accidental wall.** Getting past the third ditch without an ability now takes a 5-tick-window jump, and the 85%-handicap check fails (see Section 1). Nobody is stranded. PR #15 removes it. `[verified: checker + replay this session]`
- **The abilities are decorative.** On `main`, no wisp or route needs the cling or the double jump, because the wall doesn't gate. PR #15 gives each one a wisp. `[verified: checker reach table, 12/12 for every set]`
- **The docs disagree with the game** (`AUDIT.md`, `CLAUDE.md`, `LOG.md` order). PR #15 fixes them. `[verified: read]`

**Uncommitted work in progress:** Clean tree before this report. `[verified: git status --short empty]`

## 2.4 Decisions

| Decision | Date | Why | Rejected | Reversible? |
|---|---|---|---|---|
| One self-contained `index.html`, zero loaded assets | 2026-07-13 | Runs from `file://`, with nothing to install or build | An engine or bundler, which adds a toolchain to a project whose appeal is having none | **Locked in** |
| Data URIs count as "one file" | 2026-08-01 | Unblocks asset-shaped work without breaking the constraint | Banning all binary-derived content | Cheap |
| Five-minute vignette with **one** ravine | 2026-08-01 | Bounds the vertical addition so it can't drift into a second area | Growing a second area | Expensive once built |
| Portfolio piece: polish beats content | 2026-08-01 | Settles the tie-break | Treating it as a content game | Cheap |
| claude-works submission paused until "stable" | 2026-08-01 | The author's call: settle the project first. Don't raise it until the author reopens it. | Submitting while the game still changes | Cheap |
| The ravine is an **optional pocket**, never a gate | 2026-11-12, confirmed 2026-11-16 | The walk stays finishable by everyone in five minutes, the pocket rewards curiosity, and it matches the V2 Ravine poster | PR #12's gated wall, which walls out anyone who never finds the double jump (and its gate leaked anyway) | Moderate: one PR of level and camera code |
| Dug down, not built up | 2026-11-12 | Matches the poster, where Clawd goes down into the gorge. The camera, back wall and leaves are handled by plan steps 2, 4 and 5. | Raising the far side (PR #12), which avoided the camera work | Moderate |
| One wisp per ability: 13 free, 14 double jump, 15 cling | 2026-11-12 | Each ability gets exactly one thing it's for | Gating the bench or the door behind an ability | Cheap |
| One fixed camera frame for the ravine, with a 0.5s tilt | 2026-11-12 | A follow camera sways with the lookahead during wall kicks and lets Clawd drop off-screen in a plunge, and a 0.7s tilt already puts his feet off-screen | A follow camera | Cheap |
| The way out uses only plain jumps (rungs every 32px) | 2026-11-12 | An optional pocket must never trap a player who lacks a skill. Still true at 85% jump and run. | Requiring an ability to climb out | Cheap |
| Roofed cells get a dark rock back wall (`#120e1c`, picked by eye from four) | 2026-11-12 | See-through hollows read as floating slabs of ground | Leaving them see-through | Cheap |
| Reachability claims come from `tools/verify.js`, which runs the game's own code | 2026-11-12 | A hand-written replica reported PR #12's wall as a gate when a coyote jump clears it | Replicas of the physics; eyeballing | Cheap |
| The ravine's edits are applied by script from the plan's Find/Replace blocks | 2026-11-16 | Nothing gets retyped, and the result is byte-identical to the tested prototype | Retyping the code by hand | Cheap |
| Ship the wall removal through PR #15; close PR #14 | 2026-11-16 | #15 contains the same revert plus the ravine: one merge, no conflicts | Merging #14 first, which leaves two conflicts in #15 | Cheap |
| Per-frame sprite durations shipped with no holds set | 2026-08-01 | Keeps the mechanism separate from the taste call of which frames to hold | Shipping both together | Cheap |
| Jump physics derived from apex and time-to-apex | ~2026-07-13 `[inferred]` | Change the intent, and gravity and velocity follow | Hand-set gravity and velocity | Cheap |
| Fixed-timestep 60Hz simulation, separate from rendering | ~2026-07-13 `[inferred]` | Determinism: physics must not vary with frame rate | Physics in the render pass | Expensive |
| Fractional render scale, not integer pixel-doubling | ~2026-07-14 `[inferred]` | The painterly world should look smooth | Integer scale, which letterboxes more | Cheap, but costs audit finding 4 |
| Gaps are ditches, not pits | 2026-07-28 | Pits read as invisible-floored traps, and death is wrong for a no-combat walk | Real pits | Cheap |

## 2.5 Dead ends

- **Trusting a hand-written physics replica for reachability.** Abandoned 2026-11-16. Session 4's replica said a single jump couldn't clear a 64px wall, but the game's own code clears it with a coyote jump pressed 1-5 ticks after leaving a ledge. Do not retry. Use `tools/verify.js`, which runs the real `updatePlayer`.
- **A raised wall at the third ditch as the ravine** (PR #12). Abandoned 2026-11-16: it didn't gate, and it contradicts the optional decision. Do not retry without the author reversing "optional".
- **A follow camera inside the ravine.** Rejected 2026-11-12: it sways during wall kicks, and Clawd falls off-screen in a plunge.
- **Blanking boundary columns 0/111 in every `LEVEL` row.** Abandoned 2026-07-28: it opens an escapable-only-just one-tile well at each end, and lets the cling grab the invisible room edge. Do not retry without a room-edge guard in `wallAt`.
- **Inferring "a jump happened" from velocity crossing a threshold.** Removed 2026-07-28: it double-fired on wall kick-offs.
- **Driving headless browser tests through the rAF render loop.** Abandoned: headless rendering runs at single-digit FPS and interleaves. Drive the update function synchronously inside `page.evaluate`.
- **Converting reference GIFs to video for analysis.** Rejected 2026-08-01: video can't be read, while GIF frames and their timing extract directly.

## 2.6 Invariants (do not break)

- **One file; nothing loaded at runtime; must run from `file://`.**
- **Nothing gates the walk home.** Plain running and jumping must reach the bench and the door from every place you can stand. The checker's soft-lock check enforces this.
- **Movement constants live in `TUNING`**, and jump physics are derived, not hand-set.
- **Physics stays in the fixed-timestep 60Hz pass.** Never move it into render.
- **The world is bounded by `solidAt`**, not by boundary tiles in `LEVEL`.
- **Verify movement changes with `node tools/verify.js`**. Use `--baseline old.html` to prove the unchanged walk plays tick-for-tick the same. Update its `EXPECT` table in the same commit whenever the level or the wisps change on purpose.
- **`LOG.md` is append-only.** Corrections go in new entries.
- **Every response ends with a TLDR**: state, recommendation and why (from `CLAUDE.md`).
- **The live URL has a capital C.**

## 2.7 Known issues and debt

- On `main` only, fixed by PR #15: the accidental wall, the decorative abilities, and the docs that disagree with the game (see 2.3).
- **Audit finding 4:** the fractional render scale makes Clawd's pixels uneven (his eyes change width as he walks). A deliberate trade, and still open. `[verified: AUDIT.md "Still open"]`
- **Audit finding 5:** `devicePixelRatio` is uncapped, which means heavy fill on 4K panels. Open. `[verified: AUDIT.md]`
- **`updateWisps` runs on variable `dt` from the render pass,** so wisp collection depends on frame rate. Open, and it's the smaller note with the most teeth. `[verified: AUDIT.md]`
- `render()` mutates `game.t`, `playT`, `game.tfade` and `game.endT`. `const screen` shadows `window.screen`. After the ending you can walk past the cottage. There's no `prefers-reduced-motion` handling, no LICENSE and no favicon. All open. `[verified: AUDIT.md]`
- The `air` pose is a single frame, and per-frame holds exist but are unused. Open (item 2 of "stable"). `[logged: 2026-08-01]`
- `Resources/Clawdvania_Poster_V3_Wisps_cropped.png` (2.8MB) was uploaded but isn't referenced anywhere. `[verified: grep]`
- The repo carries ~32MB of PNGs: six posters in `Resources/`, plus `docs/`. This is deliberate, since the images show the art. `[verified: du]`

---

# 3. Open questions for you

1. **Does the ravine feel right in a real browser?** Drop in, grab wisp 13, climb out by the rungs; the tilt should feel like a glance down, not a cut. This blocks merging PR #15.
2. **Do you accept the four-item definition of "stable"?** The items are (1) the ravine, (2) per-frame durations (done) then an anticipation frame and 2-3 `air` poses, (3) audit findings 4 and 5, and (4) the smaller notes. Or would you add or cut something? This is needed before the project has a finish line.
3. **Confirm or reject: no fail state, no timer or score, no backtracking.** These are recorded as a proposal only. Needed before anything that would add one of them.
4. **What is `Resources/Clawdvania_Poster_V3_Wisps_cropped.png` for:** a shorter README poster, or nothing? Needed before any README polish.

---

# 4. Next actions

1. **Play PR #15 once in a browser, then merge it.** This comes first because it removes the accidental wall from the live site and ships the ravine in one step. Acceptance: `main`'s `index.html` has SHA-1 `f58a71e2e29212b924944aed735cc2295d0e0291`, the live page has 15 wisps, and `node tools/verify.js` on `main` reports base 13, double jump 14, cling 15.
2. **Add 2-3 `air` poses using the per-frame holds** (item 2 of "stable"). Acceptance: `air` cycles instead of holding one pose, and `node tools/verify.js --baseline` shows 0 physics differences.
3. **Fix audit findings 4 and 5 together** in the resize/draw path. Acceptance: Clawd is drawn at an integer scale on whole device pixels, and `devicePixelRatio` is capped at 2.
4. **The smaller notes:** move `updateWisps` onto the fixed step, rename `screen`, and add a LICENSE and a favicon.

---

# 5. Verification ledger

**Ran this session (2026-11-16):**
- `git fetch` + facts block → `main` at `c46c247`, 35 commits, clean tree
- `curl https://satejp10.github.io/Clawdvania/` → HTTP 200, 76,265 bytes, SHA-1 equal to `main`'s `index.html`
- Playwright boot of `main`'s and PR #15's `index.html` → both reach `title` with 0 page errors (12 wisps / 27 rows, and 15 wisps / 38 rows)
- `node tools/verify.js` on `main` → level PASS, reach PASS (12/12 for every set), soft-lock PASS (632 places, 0 stuck), handicap FAIL (at 85% jump and run the door is out of reach; 438 of 632 places stuck). RESULT: FAIL (1 of 4 checks) in 299.1s
- `node tools/verify.js` on PR #15's `index.html` → PASS (5 checks) in 40.8s, numbers as in 2.3
- A replay through the game's own `updatePlayer` with the cling and air jump disabled → a jump pressed 1-5 ticks after running off the cols 62-65 platform lands on the wall top (y=352), while one from the edge or 6+ ticks late lands in the ditch (y=416). Single-jump apex 49.3px.
- `sha1sum` → PR #15's `index.html` equals the 2026-11-12 prototype
- GitHub → PR #12 and PR #13 merged 2026-11-16, PR #14 closed unmerged, PR #15 open as a draft with a clean merge state and no CI checks (the repo has none)

**Read this session:** `.claude/context/LOG.md` (on `main` and on PR #15's branch), `SR-clawdvania-002.md`, `CLAUDE.md`, `AUDIT.md` (open items), `.claude/context/plans/ravine.md`, PR #15's description and diff summary, and `tools/verify.js` (search core).

**Not verified:**
- PR #15's `--baseline --deep` run and its screenshots. I didn't re-run `--deep` or view the images today. The identical file passed the same full run on 2026-11-12 (PASS, 8 checks, 241.6s). `[logged]`
- How the ravine *feels* in a real browser. Only the author can judge that.
- Mobile touch controls, audio, and the ending sequence were not exercised.
- History before 2026-07-28 is reconstructed from git and code (no log existed then).

---

# 6. Memory block (for Claude.ai to store)

- Clawdvania is a five-minute browser platformer in one HTML file (Clawd the pixel crab walks home at dusk; metroidvania movement, no combat) at https://github.com/Satejp10/Clawdvania, deployed by GitHub Pages from main to https://satejp10.github.io/Clawdvania/ (capital C).
- Stack: vanilla JavaScript + Canvas 2D in one index.html, with no engine, build step, runtime assets, package manager or CI. Runs from file://.
- Tool: tools/verify.js is a movement checker in plain Node that runs the game's own physics headlessly. It covers reach per ability set, soft-locks, an 85% handicap and the ravine camera, plus --baseline lockstep and a --deep search.
- Started 2026-07-13; the one planned content addition, the ravine, is built in PR #15 and awaiting the author's play-test and merge.
- Decided: it is a portfolio piece, so when polish and content compete, polish wins.
- Decided: it stays a five-minute vignette, and the one vertical addition is the ravine, an optional pocket dug under the third ditch.
- Decided: nothing gates the walk home; plain running and jumping must always reach the bench and the door.
- Decided: the ravine adds three wisps for 15 in all: wisp 13 is free, wisp 14 needs the double jump, wisp 15 needs the cling.
- Decided: "one file" is locked, but data URIs satisfy it.
- Decided: the claude-works submission is paused until the project is stable; don't raise it until the author reopens it.
- Decided: jump physics are derived from apex and time-to-apex, and the simulation is a fixed 60Hz step kept separate from rendering.
- Constraint: the world is bounded by code in solidAt, never by boundary tiles in LEVEL.
- Constraint: verify movement with tools/verify.js, and update its EXPECT table whenever the level or wisps change on purpose.
- Constraint: every response ends with a TLDR giving state, a recommendation and the reasoning.
- Do not: trust a hand-written physics replica for reachability; one reported a wall as a gate when a coyote jump clears it.
- Do not: turn the ravine into a raised wall at the third ditch (PR #12's design); it doesn't gate and it contradicts the optional decision.
- Do not: blank the level's boundary columns in every row; it opens a one-tile well and makes the room edge clingable.
- Do not: drive headless browser tests through the render loop; drive the update function synchronously inside page.evaluate.
- Proposed, not confirmed: no fail state, no timer or score, no backtracking; and a four-item definition of "stable".
- Next: play-test and merge PR #15, then 2-3 air poses using per-frame holds, then audit findings 4 and 5.

---

# 7. Appendix

**File inventory:**
- `index.html`: the entire game (76,265 bytes on `main`; 80,189 in PR #15)
- `tools/verify.js`: the movement checker (40,458 bytes)
- `AUDIT.md`: the audit, with findings 1-3 fixed and 4-5 open (on `main` it still carries PR #12's false ravine note; PR #15 corrects it)
- `README.md`: play link, poster, screenshot, controls
- `CLAUDE.md`: response format, scope, invariants
- `docs/screenshot.png`, `docs/thumbnail.png`: README hero and link preview
- `Resources/*.png`: six posters (original, V1 Bench, V2 Ravine, V3 Wisps plus an unused crop, V4 Character)
- `.claude/context/LOG.md`, `plans/ravine.md`, `reports/SR-clawdvania-00{1,2,3}.md`: project memory

**Commands:**
- build: *none*
- test: `node tools/verify.js [file] [--baseline old.html] [--deep]` (about 45s plain, about 4.5 min with both flags)
- run: open `index.html` in a browser
- deploy: merge to `main` (GitHub Pages)

**Environment:** Node 22 for the checker. The cloud container's preinstalled Playwright + Chromium is used for screenshots. No environment variables are needed.
