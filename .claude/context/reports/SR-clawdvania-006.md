**FOR CLAUDE.AI:** This is a status report generated inside Claude Code for the project below. Read it fully, update your stored memory for this project from Section 6, then reply with a short confirmation of what changed plus answers to any of Section 3's open questions you can address. Do not restate the report back to me. Treat Section 2 as current truth and anything you remembered previously as superseded.

---

```yaml
report_id: SR-clawdvania-006
project: Clawdvania
repo: https://github.com/Satejp10/Clawdvania
branch: claude/ecstatic-planck-givssa (draft PR Satejp10/Clawdvania#19; main is at 1d4e412)
generated_utc: 2026-11-23T19:07Z
surface: claude code web
session_id: session_01JgeXKBvjUdS4xLZyn5dDWu
project_started: 2026-07-13
days_active: 14
total_commits: 56 (55 on main, plus the plan commit on this branch)
commits_since_last_report: 2
previous_report: SR-clawdvania-005 (2026-11-18)
previous_report_delivered_to_chat: unknown
supersedes: SR-clawdvania-005
standalone: true
```

---

# TLDR

- **What:** Clawdvania is a five-minute browser walk home at dusk, drawn with Canvas 2D in one HTML file. Clawd, a pixel crab, gathers wisps and reaches a cottage. No combat. Live at https://satejp10.github.io/Clawdvania/ (capital C).
- **Status:** v0.1 is live and unchanged. The owner played it to the ending and said "so far so good." The next step, a Canvas 2D "poster pass" (v0.2), is now planned, prototyped and checked, but not built.
- **Changed since SR-clawdvania-005:** Draft PR Satejp10/Clawdvania#19 holds the build plan, the exact patch, a browser check and a before/after image. The prototype plays exactly like v0.1 (0 differences over 674,462 checker ticks) and passes all 9 browser checks.
- **Blocked:** Only on the owner's yes. Nothing technical.
- **Next:** If yes, apply the patch, run both checks, update the docs and open a v0.2 PR. Then the owner plays it once, on a phone too.
- **Needs a decision from you:** Build the poster pass now? It includes a new ending: Clawd stays at the door and steps inside, a closing card follows, and after 11 s any key starts the walk again.

---

# 1. Delta since SR-clawdvania-005

**Shipped:** Nothing in the game. `index.html` is the same file on `main` and on the live site (SHA-1 `b7414f33`). PR Satejp10/Clawdvania#18 merged report 005 (`1d4e412`). `[verified: git show origin/main:index.html | sha1sum; curl of the live page]`

**Planned and checked (not built):** the v0.2 poster pass, in draft PR Satejp10/Clawdvania#19. `index.html` is untouched there too. `[verified: git status; PR #19 file list]`
- `.claude/context/plans/poster-pass.md`: what changes and why, the decisions, the cost, the build steps with the output each should give, and pitfalls.
- `poster-pass/index.patch`: the exact change. It applies to v0.1 and gives the checked prototype byte for byte (SHA-1 `69fd3234`). `[verified: git apply on a clean copy, then cmp]`
- `poster-pass/check.js`: a browser check for the new ending and for Clawd's pixel scale. It also takes the screenshots and the two README images.
- `poster-pass/before-after.jpg`: title, mid-walk, the bench as night falls, and 13 s after the door, v0.1 against the prototype.

**Changed direction:** Nothing reversed. Report 005 proposed "Canvas 2D first, WebGL only if that falls short." This session turned that into a tested plan. Two choices were made along the way: the far cottage is small and hazy and fades out as the real one approaches, and the god rays are gone.

**New problems:** None in the game.
- Measured for the first time: audit finding 4 is real. At scale 2.5, Clawd's eye pixels come out 2 or 3 device px wide on v0.1. `[verified: check.js on v0.1]`
- The prototype costs about 15% more per frame in headless (software) rendering. `[verified: timing in headless Chromium]`
- A Box upload went out with a placeholder instead of the plan text, and the Box tools in this session can't delete it. It carries a comment saying so, and the full plan sits next to it.

**Corrections:** While prototyping, a curve in the ravine's gorge was blamed on the new farthest hill range. It is the far hill's crest seen through the slot, and it was there in v0.1 too. `[verified: hiding one layer at a time]`

**Dropped:** Nothing.

---

# 2. Full state (standalone)

## 2.1 What this is and why

Clawdvania is a five-minute browser walk home at dusk. Clawd, an orange pixel crab, crosses autumn hills, gathers wisps that light his path, rests at a bench overlook, and reaches a cottage before dark. Its atmosphere borrows from *Ori* and *Hollow Knight*, with none of the combat. `[logged: 2026-08-01]`

It is a portfolio piece. When polish and content compete, polish wins. `[logged: 2026-08-01]`

It must not become a combat game or anything longer than a five-minute vignette. The one vertical addition is the optional ravine, and nothing may gate the walk home. `[logged: 2026-08-01, 2026-11-12]`

Proposed, not yet confirmed by the owner: no fail state, no timer or score, no backtracking. `[logged: session 2]`

**Hard constraints:**
- One self-contained `index.html`: no engine, no build step, no runtime asset files, and it runs from `file://`. Data URIs count as one file. `[logged: 2026-08-01]`
- No package manager, no CI, no `.github` folder, so no PR template. The one tool is `tools/verify.js`, in plain Node. `[verified: ls; git ls-files]`
- GitHub Pages serves `main` only. A branch is not live until its PR merges. `[verified: live SHA-1 equals main's index.html]`

## 2.2 Timeline

- Started: **2026-07-13** (`130d0a4`, "Phase 1: movement greybox with Ori-inspired procedural theming"). `[verified: git log --reverse]`
- **56 commits** on this branch (55 on `main`), across **14 active days**. `[verified: facts block]`
- Sessions logged: **10**, including this one. `[verified: LOG.md]`
- Milestones:
  - 2026-07-13: movement greybox. `[verified: git log]`
  - 2026-08-01: scope set: five-minute vignette, one optional ravine, portfolio piece. `[logged]`
  - 2026-09-27: V3 poster added to the README. A raised-wall ravine was drafted as PR #12. `[logged]`
  - 2026-11-12: ravine re-decided as an optional pocket. `tools/verify.js` added. `[logged]`
  - 2026-11-16: PR #12 merged by mistake and was undone. The ravine was built in PR #15. `[logged; verified: git log]`
  - 2026-11-18: PR #15 merged. The ravine and the v0.1 label went live. Report 005 proposed a Canvas 2D poster pass. `[verified: git log d86870f; logged]`
  - 2026-11-23: the owner played v0.1 to the ending. The poster pass was planned and checked in draft PR Satejp10/Clawdvania#19. `[logged: session 10]`
- This report: **2026-11-23T19:07Z**.

## 2.3 Where the code is

**Stack:** Vanilla JavaScript and Canvas 2D in `index.html`. No framework, library, bundler or package manager. The checker is plain Node. `[verified: index.html; git ls-files]`

**Entry point:** `index.html`, the whole game: 1,807 lines, 80,746 bytes. `[verified: wc]`

**Working (live on `main`):**
- The checker passes all 5 checks on the current file: level 112 × 38 tiles, 15 wisps. `[verified: node tools/verify.js, exit 0, 40.6 s, today]`
- Reach by ability set: plain running and jumping gets wisps 1–13, the double jump adds 14 and the cling adds 15. The door and the bench are reachable in every set. `[verified: node tools/verify.js]`
- No soft-locks: from all 714 places Clawd can stand, plain running and jumping gets home. That still holds at 85% jump height and run speed. `[verified: node tools/verify.js]`
- Camera: Clawd stays on screen through 7 trips in and out of the ravine. Worst case: feet at 274 of 288. `[verified: node tools/verify.js]`
- The ending: at the door the window lights, the wisps fly to the eave, and the "welcome home" card shows the wisp count. `[verified: screenshots today]`
- Ravine: an optional pocket under the third ditch with three wisps. The owner said it "seems to be working." `[logged: 2026-11-18]`
- Version label `v0.1`, bottom right, hidden on touch screens. `[verified: index.html line 77; README]`
- The live site equals `main` (SHA-1 `b7414f33`). `[verified: curl, today]`

**Broken or incomplete (all visual; PR #19's plan fixes every item marked ✱):**
- ✱ The look is flatter and greyer than the owner's posters in `Resources/`: a dusty sky with the sun as a pale blob in the top-right corner, and only two hill layers. `[inferred: side-by-side images today]`
- ✱ The far-hill cottage is never on screen. It sits at x 940 of a layer that only ever shows x 0 to 832. `[verified: arithmetic from index.html lines 964, 1454–1458 and the camera clamp at 951]`
- ✱ The night tint is painted after the wisps, the lantern glow and Clawd, so night dims the lights too. `[verified: line order in render(), 1545–1675]`
- ✱ At 10 wisps the lantern glow washes Clawd out in a pale haze. `[verified: screenshot of the bench today]`
- ✱ The title overlaps a ledge, and "press any key to begin" sits on a platform. `[verified: screenshot today]`
- ✱ The ending doesn't close: the card fades and nothing follows. Clawd can walk on past the house: holding right, he slides 146 px past the door. `[verified: check.js on v0.1]`
- ✱ Audit finding 4: Clawd's sprite pixels are uneven at fractional scales, with eye pixels 2 or 3 device px wide at scale 2.5. `[verified: check.js on v0.1]`
- ✱ Audit finding 5: `devicePixelRatio` is uncapped (line 1439). `[verified: grep]`
- No chimney smoke and no shadow under Clawd. `[verified: grep]` (✱)
- The `air` pose is a single frame, so Clawd looks the same at the apex as in freefall. `[verified: lines 336–354, 435]`
- The ravine's back is open sky, because the parallax layers only move sideways. The V2 poster shows roots and moss there. `[verified: drawParallax, line 1454]`
- On phones, Clawd starts under the right-arrow touch button. `[inferred: emulated phone screenshot of the prototype, whose spawn and buttons are the same as v0.1]`
- Smaller notes still open: `updateWisps` runs on the render pass's variable `dt` (line 1628); `const screen` shadows `window.screen` (line 1431, worked around at 669); no reduced-motion handling; no LICENSE; no favicon. `[verified: grep; ls]`
- `Resources/Clawdvania_Poster_V3_Wisps_cropped.png` is referenced only in logs and reports. `[verified: git grep]`

**Uncommitted work in progress:** clean tree. This branch has one commit that isn't on `main` (`d54da36`, the plan), in draft PR #19. This report adds a second. `[verified: git status; git log]`

## 2.4 Decisions

| Decision | Date | Why | Rejected | Reversible? |
|---|---|---|---|---|
| One self-contained `index.html`: no build, no runtime assets, runs from `file://` | 2026-08-01 | The project's pitch: open the file and play | An engine or bundler | Locked in |
| Data URIs count as "one file" | 2026-08-01 | Keeps asset-shaped work possible | Banning binary-derived content | Cheap |
| Five-minute vignette, one optional ravine | 2026-08-01 | Stops the vertical addition growing into a second area | A second area | Expensive once built |
| Portfolio piece: polish beats content | 2026-08-01 | Tie-break for backlog order | Treating it as a content game | Cheap |
| Claude-works submission paused until "stable" | 2026-08-01 | The owner's call. "Stable" is defined only by an unconfirmed four-item list | Submitting while the game still changes | Cheap |
| The ravine is an optional pocket, never a gate | 2026-11-12 | Everyone finishes in five minutes; the pocket rewards curiosity | A raised wall at the third ditch (PR #12), reverted | Moderate |
| Wisps: 13 free, 14 needs the double jump, 15 needs the cling | 2026-11-12 | Each ability has exactly one thing it's for | Gating the bench or door behind an ability | Cheap: update `EXPECT` |
| Reachability is checked by `tools/verify.js`, which runs the game's own code | 2026-11-16 | A hand-written physics replica missed a coyote jump | Physics replicas; judging by eye | Cheap |
| The version label is a hand-edited constant in two places | 2026-11-18 | No build step to stamp it | A generated stamp | Cheap |
| Jump physics derived from apex and time-to-apex | Since the start `[inferred]` | Change the intent and gravity and velocity follow | Hand-set values | Cheap |
| Fixed 60 Hz simulation, separate from rendering | Since the start | Physics must not vary with frame rate | Physics in the render pass | Expensive |
| **Proposed:** the next step is a Canvas 2D poster pass; WebGL only if it falls short | 2026-11-18, planned 2026-11-23 | The game already draws glow in Canvas, and the gaps are Canvas-sized. It's the cheapest test of whether WebGL is needed | WebGL first (about four sessions by a rough guess, GPU risk); a 3D rewrite (a different game) | Cheap |
| **Proposed:** it ships as v0.2, before the rest of the "stable" list | 2026-11-23 | Polish beats content, and it closes audit findings 4 and 5 on the way | Doing the `air` poses and smaller notes first | Cheap |
| **Proposed:** the ending ignores input at the door; Clawd steps inside; closing card; walk again after 11 s | 2026-11-23 | A closing sequence needs Clawd to stay put, and it fixes walking on past the house | Leaving the ending open-ended | Cheap: one block of the patch |
| In the plan: the far cottage is small and hazy, under the platforms, and fades out while the camera moves from x 860 to 1060 | 2026-11-23 | At full size it read as a house in the playfield. The fade keeps two cottages from being on screen together (the real one appears at x 1094) | A 30 px cottage; keeping both on screen | Cheap |
| In the plan: no god rays; the sun's glow sits on the horizon | 2026-11-23 | The posters light the scene from the horizon | The top-right sun with rays | Cheap |
| In the plan: the haze is baked into the farthest hill layer | 2026-11-23 | It doesn't change sideways, so it costs nothing as part of that layer. A pass of its own made frames about 30% slower instead of 15% | A separate full-screen haze pass | Cheap |

## 2.5 Dead ends

- **A hand-written physics replica for reachability.** Abandoned 2026-11-16. It said a single jump couldn't clear a 64 px wall; the real code clears it with a coyote jump. Do not retry. Use `tools/verify.js`.
- **A raised wall at the third ditch as the ravine** (PR #12). Abandoned 2026-11-16. It gated nothing and contradicts "optional." Do not retry unless the owner reverses "optional."
- **A follow camera inside the ravine.** Rejected 2026-11-12. It sways during wall kicks and drops Clawd off-screen in a plunge.
- **Blanking the boundary columns in every `LEVEL` row.** Abandoned 2026-07-28. It opened one-tile wells and let the cling grab the invisible room edge.
- **Inferring "a jump happened" from a velocity threshold.** Removed: it double-fired on wall kick-offs.
- **Headless tests through the render loop.** Headless rendering is slow and interleaves. Stub `requestAnimationFrame` and call the update and render functions synchronously inside `page.evaluate`.
- **A page helper named `S`** in browser tests. The game has a global `S` (its render scale), which hides `window.S`. Use another name.
- **The far cottage at its old size (30 px), and a separate full-screen haze pass.** Both were tried in the prototype on 2026-11-23 and replaced; see 2.4.
- **A 3D rewrite as the look fix.** Rejected 2026-11-18. It would be a different game.

## 2.6 Invariants (do not break)

- One file. Nothing loaded at runtime. Runs from `file://`.
- Nothing gates the walk home. Plain running and jumping reach the bench and the door from every place Clawd can stand.
- Movement constants live in `TUNING`. Jump physics are derived, not hand-set.
- Physics stays in the fixed 60 Hz step. Never move it into rendering.
- The world is bounded by `solidAt`, not by boundary tiles in `LEVEL`.
- Movement changes are checked with `node tools/verify.js`, and `--baseline old.html` proves the unchanged walk plays the same. When the level or wisps change on purpose, update `EXPECT` in the same commit.
- Code that runs at load may only use browser globals that `tools/verify.js` stubs, or the checker fails to load the game.
- `tools/verify.js` resets the ending after every tick, so it can't see anything the ending does. Check ending behaviour in a browser.
- The version label lives in two places: `#build-version` in `index.html` and the README's Status line. Change both together.
- GitHub Pages serves `main` only.
- `LOG.md` is append-only. Corrections go in new entries.
- Suggestions are flagged as suggestions and not built unless the owner asks (`CLAUDE.md`).
- Every chat response ends with a TLDR: state, recommendation, why (`CLAUDE.md`).
- The live URL has a capital C.

## 2.7 Known issues and debt

- Performance can't be judged headless. The prototype costs about 15% more per frame there, but that's software rendering. It needs one try on the owner's slowest device.
- Previews: Pages serves `main` only, so to try a PR the owner downloads its `index.html`.
- Log conflicts: two branches appending to `LOG.md` conflict at the tail. It happened on 2026-11-16.
- Repo size: about 32 MB of images (`Resources` 31 MB, `docs` 912 KB), plus 308 KB for the poster-pass plan folder. Deliberate. `[verified: du -sh]`
- Box: `poster-pass-plan-2026-11-23.md` in Claude/Clawdvania is a stub uploaded by mistake (a placeholder line instead of the plan). It has a comment saying so. The real copy is `poster-pass-plan.md` beside it. The owner can delete the stub.
- The `project-status` skill's template still tells the reader to answer "Section 5's open questions"; they are in Section 3. This report uses Section 3. The skill lives outside this repo.

---

# 3. Open questions for you

1. Build the v0.2 poster pass now, before the rest of the "stable" list? Blocks: the build.
2. Is the new ending right? Clawd stays at the door and steps inside, a closing card reads "CLAWDVANIA / thanks for walking home", and after 11 s any key or tap starts the walk again. Blocks: that part of the patch (it can be dropped on its own).
3. Should the closing card carry a credit line, and if so, what should it say? Needed before v0.2 ships.
4. Do you accept the four-item "stable" list? The items: (1) the ravine, done; (2) per-frame durations, done, then 2–3 `air` poses; (3) audit findings 4 and 5, which v0.2 would close; (4) the smaller notes. Blocks: the `air` poses.
5. Do you confirm "no fail state, no timer or score, no backtracking", or reject any of them? Blocks: any work that would add one.

---

# 4. Next actions

1. **Build v0.2 from the plan, if question 1 is yes.** It is the biggest visible gap and it is fully prepared. Acceptance: `node tools/verify.js index.html --baseline <v0.1>` passes 6 checks with 0 lockstep differences; `check.js` passes 9 of 9; `#build-version` and the README say v0.2; the owner plays it once on a computer and once on a phone.
2. **The rest of the "stable" list, if question 4 is yes:** the `air` poses, then the smaller notes. Acceptance: `--baseline` shows 0 physics differences.
3. **A WebGL prototype, only if v0.2 still falls short of the posters.** Acceptance: a one-screen comparison the owner judges against the posters.

---

# 5. Verification ledger

**Ran this session (2026-11-23):**
- Facts block at `d54da36`: clean tree, 56 commits (55 on `main`), 14 active days, 2 commits since report 005.
- `node tools/verify.js` on today's `index.html`: PASS (5 checks), exit 0, 40.6 s.
- `node tools/verify.js <prototype> --baseline <v0.1>`: PASS (6 checks), 41.9 s. Lockstep: 0 tiles differ; 400 random runs, 674,462 ticks compared, 0 differences.
- `check.js` on the prototype: PASS (9 checks), 48.5 s. On v0.1: 4 of 9 fail (slides 146.5 px past the door, a jump rises 7.3 px, no walk-again, eye pixels 2 or 3 px wide).
- `git apply --check` and `git apply` of `index.patch` on a clean copy of v0.1: result identical to the prototype (SHA-1 `69fd3234`).
- `curl` of the live page: HTTP 200, SHA-1 `b7414f33`, equal to `main`'s `index.html`.
- Screenshots of v0.1 and the prototype (title, mid-walk, bench, door, closing, ravine, and the title on an emulated phone), 0 page errors.
- Frame timing in headless Chromium (software): walk at 1280×720 is 51.9 ms on v0.1 and 59.2 ms on the prototype; at devicePixelRatio 2, 211 ms and 254 ms.
- Hiding one layer at a time in the ravine frame: the gorge curve is the far hill, in both builds.
- `git grep` for the cropped poster; grep for the lines cited in 2.3; `du -sh`; `ls` for LICENSE and favicon.
- GitHub: no open PRs before PR #19.

**Read this session:** `.claude/context/LOG.md`; `SR-clawdvania-005.md`; `AUDIT.md`; `CLAUDE.md`; `README.md`; all of `index.html`; `tools/verify.js` (loader, driver, lockstep); the ravine plan's structure; Box notes `polish-ideas-2026-11-18.md` and `overhaul-direction-2026-11-18.md`; the posters (main, V1 Bench, V3 Wisps, V4 Character).

**Not verified:**
- Real-device performance. Headless rendering is software-only.
- How the new ending feels, and the sky's warmth. Only a person can judge these.
- Touch play on a real phone. Only an emulated phone screenshot was taken.
- Audio. Nothing in it changed, and it was not listened to.
- `--deep` was not run. PR #15 logged it passing on 2026-11-16, and the physics haven't changed since. `[logged]`
- The V2 Ravine poster was not viewed this session.
- History before 2026-07-28 is reconstructed from git and code, because no log existed then. `[logged]`

---

# 6. Memory block (for Claude.ai to store)

- Clawdvania is a five-minute browser walk home at dusk, in one HTML file drawn with Canvas 2D. Clawd is a pixel crab. No combat. Repo: https://github.com/Satejp10/Clawdvania. Live: https://satejp10.github.io/Clawdvania/ (capital C), served from `main` only.
- Stack: vanilla JavaScript and Canvas 2D. No engine, no build step, no runtime assets, no package manager, no CI. Runs from `file://`.
- `tools/verify.js` is a plain-Node movement checker that runs the game's own physics headlessly. `--baseline old.html` checks the walk is unchanged; `--deep` runs a dense search.
- Started 2026-07-13. v0.1 is live with the optional ravine.
- Decided: portfolio piece. When polish and content compete, polish wins.
- Decided: five-minute vignette, with one optional ravine pocket under the third ditch. Nothing gates the walk home.
- Decided: 15 wisps. Wisp 13 is free, wisp 14 needs the double jump, wisp 15 needs the cling.
- Decided: one file, no build, no runtime assets. Data URIs are fine.
- Decided: the claude-works submission waits until the project is "stable." The four-item definition is unconfirmed.
- Constraint: jump physics are derived from apex and time-to-apex; movement constants live in `TUNING`; the simulation is a fixed 60 Hz step, kept apart from rendering.
- Constraint: the world is bounded by `solidAt`, not by boundary tiles.
- Constraint: when the level or wisps change on purpose, update `EXPECT` in `tools/verify.js` in the same commit.
- Constraint: `tools/verify.js` can't see the ending; ending behaviour is checked in a browser.
- Do not: suggest a 3D rewrite as the look fix. It is a different game.
- Do not: trust a hand-written physics replica for reachability. Use `tools/verify.js`.
- Do not: put the ravine back as a raised wall at the third ditch.
- Proposed, not confirmed: no fail state, no timer or score, no backtracking.
- Planned, not built: the v0.2 "poster pass" (Canvas 2D). Its plan, patch and checks are in `.claude/context/plans/poster-pass*`, draft PR Satejp10/Clawdvania#19. WebGL only if it falls short.
- Planning notes and status reports are saved in Box under Claude/Clawdvania.
- Currently blocked on: the owner's yes to build v0.2 and to its new ending.
- Next: build v0.2 from the plan, then the owner plays it once on a computer and a phone.

---

# 7. Appendix

**Commands:** check movement `node tools/verify.js [file] [--baseline old.html] [--deep]` (about 40 s plain) · check the poster pass in a browser `node .claude/context/plans/poster-pass/check.js [file] [outdir]` (about 50 s) · build: none · run: open `index.html` · deploy: merge to `main` (GitHub Pages).

**Poster-pass plan files** (branch `claude/ecstatic-planck-givssa`): `.claude/context/plans/poster-pass.md` (the plan) · `poster-pass/index.patch` (206 lines added, 77 removed, all in `index.html`) · `poster-pass/check.js` · `poster-pass/before-after.jpg`.
