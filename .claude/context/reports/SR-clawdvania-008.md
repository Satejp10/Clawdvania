**FOR CLAUDE.AI:** This is a status report generated inside Claude Code for the project below. Read it fully, update your stored memory for this project from Section 6, then reply with a short confirmation of what changed plus answers to any of Section 3's open questions you can address. Do not restate the report back to me. Treat Section 2 as current truth and anything you remembered previously as superseded.

---

```yaml
report_id: SR-clawdvania-008
project: Clawdvania
repo: https://github.com/Satejp10/Clawdvania
branch: claude/ecstatic-planck-givssa (equal to main at d93c121 before this report, which reaches main through its own draft PR)
generated_utc: 2026-11-23T23:58Z
surface: claude code web
session_id: session_01JgeXKBvjUdS4xLZyn5dDWu
project_started: 2026-07-13
days_active: 15 (git dates the merges of PRs #19, #20 and #21 as 2026-11-24 because of the time zone they were recorded in; in UTC all three happened on 2026-11-23)
total_commits: 63 (this report adds the 64th)
commits_since_last_report: 3
previous_report: SR-clawdvania-007 (2026-11-23)
previous_report_delivered_to_chat: unknown
supersedes: SR-clawdvania-007
standalone: true
```

---

# TLDR

- **What:** Clawdvania is a five-minute browser walk home at dusk, drawn with Canvas 2D in one HTML file. Clawd, a pixel crab, gathers wisps and reaches a cottage. No combat. Live at https://satejp10.github.io/Clawdvania/ (capital C).
- **Status:** v0.2, the "poster pass", is merged and live, and every check passes on the live file. No feature work is in progress.
- **Changed since SR-clawdvania-007:** The owner merged v0.2 (PR #20). One list of every feature now exists, `.claude/context/FEATURES.md` (PR #21). The owner suggested breakable floors opened by a downward move; it's logged as an idea, not planned.
- **Blocked:** Nothing. The next build, more jump poses, waits on the owner's yes to the "stable" list.
- **Next:** The owner plays the live site once on a phone.
- **Needs a decision from you:** Accept or change the four-item "stable" list (question 1), so the jump poses can start after the phone check.

---

# 1. Delta since SR-clawdvania-007

**Shipped:**
- **v0.2 is live.** The owner merged PR Satejp10/Clawdvania#20 at 20:02 UTC on 2026-11-23 (merge `769fff0`). The live page is byte-identical to `main`'s `index.html` (SHA-1 `86dace47`), and its corner reads v0.2. `[verified: curl, HTTP 200; git show origin/main:index.html | sha1sum]`
- **One feature list.** `.claude/context/FEATURES.md` lists every feature in four parts: built, planned, ideas and ruled out. Before it, features were spread across the README, the log, `AUDIT.md`, the plans, the reports and two Box notes. `CLAUDE.md` now says to update it in the same commit whenever a feature changes state or the owner suggests one. Merged as PR Satejp10/Clawdvania#21 at 23:55 UTC (merge `d93c121`). `[verified: git log; both files read on main]`

**New idea (logged, not planned):** the owner's breakable floors. Some floors crack and crumble when Clawd walks on them but never give way. A downward move from the air, like the Desolate Dive in *Hollow Knight*, breaks them and opens a secret area. It sits under Ideas in `FEATURES.md` with five questions to settle before any plan (see Section 3, question 5). Nothing is built. `[verified: FEATURES.md]`

**Changed direction:** Nothing reversed. The owner merged v0.2 without written notes on it, so report 007's feel points (the sky's warmth, the ending's timing, Clawd's slightly larger size) are still unjudged. They fold into the phone check. `[logged: 2026-11-23]`

**New problems:** None found. `[verified: both checkers pass on the live file]`

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
- No package manager, no CI and no `.github` folder, so no PR template. The tools are `tools/verify.js` (plain Node) and `.claude/context/plans/poster-pass/check.js` (Playwright). `[verified: ls]`
- GitHub Pages serves `main` only. A branch isn't live until its PR merges. `[verified: the live page's SHA-1 equals main's index.html]`

## 2.2 Timeline

- Started: **2026-07-13** (`130d0a4`, "Phase 1: movement greybox with Ori-inspired procedural theming"). `[verified: git log --reverse]`
- **63 commits** across **15 active days** by git's dates (see the header for why one of them is 2026-11-24). `[verified: facts block]`
- Sessions logged: **10**. Session 10 planned, built and shipped v0.2, added the feature list, and produced reports 006, 007 and this one. `[verified: LOG.md]`
- Milestones:
  - 2026-07-13: movement greybox. `[verified: git log]`
  - 2026-08-01: scope set: five-minute vignette, one optional ravine, portfolio piece. `[logged]`
  - 2026-09-27: V3 poster added to the README. A raised-wall ravine was drafted as PR #12. `[logged]`
  - 2026-11-12: the ravine re-decided as an optional pocket. `tools/verify.js` added. `[logged]`
  - 2026-11-16: PR #12 merged by mistake and was undone. The ravine was built in PR #15. `[logged; verified: git log]`
  - 2026-11-18: PR #15 merged. The ravine and the v0.1 label went live. Report 005 proposed a Canvas 2D poster pass. `[verified: git log d86870f; logged]`
  - 2026-11-23: the owner played v0.1 to the ending. The poster pass was planned (PR #19), built as v0.2 (PR #20), and went live when PR #20 merged at 20:02 UTC. The feature list followed (PR #21, merged at 23:55 UTC). `[verified: git log; logged: session 10]`
- This report: **2026-11-23T23:58Z**.

## 2.3 Where the code is

**Stack:** vanilla JavaScript and Canvas 2D in `index.html`. No framework, library, bundler or package manager. The checkers are plain Node, and `check.js` uses the Playwright the environment provides. `[verified: index.html; ls]`

**Entry point:** `index.html`, the whole game (v0.2): 1,936 lines, 87,856 bytes. `[verified: wc]`

**Working (on `main`, which is what's live):**
- The walk plays exactly as v0.1 did: `node tools/verify.js index.html --baseline <v0.1>` passes all 6 checks in 58.8 s. Lockstep: 0 tiles differ; 400 random runs, 674,462 ticks compared, 0 differences. `[verified: ran it]`
- Reach by ability set: plain running and jumping gets wisps 1–13, the double jump adds 14 and the cling adds 15. The door and the bench are reachable in every set. `[verified: same run]`
- No soft-locks: from all 714 places Clawd can stand, plain running and jumping gets home. That still holds with jump height and run speed at 85%. `[verified: same run]`
- Camera: Clawd stays on screen through 7 trips in and out of the ravine. Worst case: feet at 274 of 288. `[verified: same run]`
- The ending: holding right into the door, Clawd slides 5 px and stops 4.5 px left of its centre. A jump is ignored, and a key at 5 s does nothing. A key after 11 s starts the walk again from x 49, with every wisp back and no stale jump. R restarts during the ending. `[verified: check.js, 9 of 9, 62.7 s]`
- Clawd's pixels: at scale 2.5, every eye pixel is 3 device px wide. `[verified: check.js]`
- No page errors. `[verified: check.js]`
- The look: an indigo sky with an amber horizon, three ranges of hills, the home cottage on the far hill from the first screen with lit windows and chimney smoke, gold wisps, and the title "CLAWDVANIA / A WALK HOME AT DUSK" on open sky. The closing card reads "CLAWDVANIA / thanks for walking home" over "press any key to walk again". `[verified: check.js screenshots of the title and the closing card, viewed this session]`
- `devicePixelRatio` is capped at 2 (line 1487). Clawd is drawn at `k = Math.max(1, Math.round(S))` device px per sprite pixel (line 1733). `[verified: grep]`
- The version label reads v0.2 in `#build-version` (line 77, hidden on touch screens) and in the README's Status section. `[verified: grep; the live page]`

**Broken or incomplete:**
- Real-device performance is untried. In headless software rendering, v0.2 costs about 15% more per frame than v0.1. `[logged: 2026-11-23]` The cap at 2× more than offsets that on 3× phones, where it draws 4/9 of the pixels, but not on 2× laptops. `[inferred: arithmetic]`
- Clawd's size against the world depends on the window size (`k / S`): 1.2× his old size in a 1280×720 window, 1.07× at 1920×1080. It's the price of even pixels, and the owner hasn't judged it yet. `[verified: line 1733; ratios logged 2026-11-23]`
- The `air` pose is a single frame at 1 fps (pose at line 336, rate at line 435), so Clawd looks the same rising, at the top and falling. `[verified: grep]`
- The ravine's back is open sky, because the parallax layers only move sideways (`drawParallax(cv, factor, cx)`, line 1502). The V2 poster shows roots and moss there. `[verified: grep]`
- On phones, Clawd may start under the right-arrow touch button. `[inferred: an emulated phone screenshot of the v0.2 prototype on 2026-11-23; the spawn and the buttons haven't changed since]`
- Smaller notes still open: `updateWisps` runs on the render pass's variable `dt` (called at line 1743); `const screen` shadows `window.screen` (line 1477, worked around at line 671); no reduced-motion handling; no LICENSE; no favicon. `[verified: grep; ls]`
- `Resources/Clawdvania_Poster_V3_Wisps_cropped.png` is referenced only in the log and the reports. `[verified: git grep]`

**Planned, waiting on the owner's yes to the "stable" list:** an anticipation frame before a jump and 2–3 `air` poses, then the smaller notes above. The claude-works submission is paused until "stable". `[verified: FEATURES.md]`

**Ideas, not planned:** breakable floors and a downward move (Section 1). Smaller ones: depth in the ravine (roots and moss, with the background moving up and down too); out-of-focus leaves in the bottom corners; a credit line on the closing card; moving Clawd's start on phones; a third octave of wisp chimes; a nudge toward the ravine; a different sound below the ravine's lip; and a WebGL lighting pass, on hold unless v0.2 falls short of the posters. `[verified: FEATURES.md]` Today the keyboard uses only left, right and jump (`KEYMAP`, lines 611–615), and phones have three buttons (lines 73–75), so a downward move would need a new key and a fourth button. `[verified: grep]`

**Uncommitted work in progress:** clean tree. Before this report, the branch equalled `main` at `d93c121`. This report adds one commit. `[verified: git status; git log]`

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
| The look is fixed with Canvas 2D first; WebGL only if it falls short | Proposed 2026-11-18; built and live as v0.2 on 2026-11-23 | The game already drew glow in Canvas, and the gaps were Canvas-sized. It's the cheapest test of whether WebGL is needed | WebGL first (about four sessions by a rough guess, plus GPU risk); a 3D rewrite (a different game) | Cheap |
| The poster pass ships as v0.2, before the rest of the "stable" list | 2026-11-23 | Polish beats content, and it closed audit findings 4 and 5 on the way | Doing the `air` poses and smaller notes first | Done |
| The ending: input ignored at the door; Clawd steps inside; closing card; walk again after 11 s | 2026-11-23, shipped in v0.2 | A closing sequence needs Clawd to stay put, and it fixed walking on past the house | An open-ended ending | Cheap: one block of code. The owner hasn't judged its timing yet |
| The far cottage is small and hazy, under the platforms, and fades out while the camera moves from x 860 to 1060 | 2026-11-23 | At full size it read as a house in the playfield. The fade keeps two cottages from being on screen together (the real one appears at x 1094) | A 30 px cottage; both on screen | Cheap |
| No god rays; the sun's glow sits on the horizon | 2026-11-23 | The posters light the scene from the horizon | The top-right sun with rays | Cheap |
| The haze is baked into the farthest hill layer | 2026-11-23 | It doesn't change sideways, so it costs nothing as part of that layer. A pass of its own made frames about 30% slower instead of 15% | A separate full-screen haze pass | Cheap |
| Clawd is drawn at `k = round(S)` device px per sprite pixel; the world keeps the fractional scale | 2026-11-23 (the audit's suggested fix) | Even pixels: his eyes no longer change width as he walks. It keeps the crisp-crab-on-a-smooth-world contrast | The fractional scale (uneven pixels) | Cheap, one line. The size side effect needs the owner's eye |
| `devicePixelRatio` capped at 2 | 2026-11-23 (the audit's suggested fix) | The art is 512×288 upscaled, so past 2× there's no detail to gain, only fill cost | Uncapped | Cheap |
| One feature list, `.claude/context/FEATURES.md`, updated in the same commit as any feature change or new owner suggestion | 2026-11-23 | The owner asked whether such a list existed. Features were spread over six places | Putting it in the README, which is for players while this is working memory; leaving it scattered | Cheap |

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
- `tools/verify.js` resets the ending after every tick, so it can't see anything the ending does. Check ending behaviour in a browser, with `check.js`.
- Two cottages are never on screen together: the far one has faded out before the real one appears.
- The version label lives in two places: `#build-version` in `index.html` and the README's Status section. Change both together.
- `.claude/context/FEATURES.md` changes in the same commit as any feature change, and gets an entry whenever the owner suggests a feature.
- GitHub Pages serves `main` only.
- `LOG.md` is append-only. Corrections go in new entries.
- Suggestions are flagged as suggestions and not built unless the owner asks (`CLAUDE.md`).
- Every chat response ends with a TLDR: state, recommendation, why (`CLAUDE.md`).
- The live URL has a capital C.

## 2.7 Known issues and debt

- Performance can't be judged headless. It needs one try on the owner's slowest device; the phone check is that try.
- Previews: Pages serves `main` only, so to try a PR before it merges, the owner downloads its `index.html` ("Download raw file" on GitHub). That's awkward on a phone, which is why the phone check happens on the live site.
- Log conflicts: two branches appending to `LOG.md` conflict at the tail. It happened on 2026-11-16.
- Repo size: about 32 MB of images (`Resources` 31 MB, `docs` 1.4 MB), plus 308 KB for the poster-pass plan folder. Deliberate. `[verified: du -sh]`
- Box (Claude/Clawdvania): `poster-pass-plan-2026-11-23.md` is a stub uploaded by mistake and flagged with a comment. The real plan, `poster-pass-plan.md`, sits beside it and predates the build. `features-2026-11-23.md` is a snapshot; the repo's `FEATURES.md` is the copy that gets updated. Claude Code's Box tools can't delete or overwrite files, so the owner can delete the stub by hand. `[logged: 2026-11-23]`
- The `project-status` skill's template still tells the reader to answer "Section 5's open questions". They're in Section 3, and this report's first line says so. The skill lives outside this repo. `[verified: template read this session]`

---

# 3. Open questions for you

1. Do you accept the four-item "stable" list? (1) the ravine, done; (2) per-frame durations, done, then an anticipation frame and 2–3 `air` poses; (3) audit findings 4 and 5, done in v0.2; (4) the smaller notes. Blocks: the jump poses.
2. After the phone check, does anything in v0.2 need tuning? For example smoothness, whether the title and Clawd's start clear the touch buttons, the ending's timing, or Clawd's size. Blocks nothing, but tuning would go before new work.
3. Should the closing card carry a credit line, and if so, what should it say? Today it reads "CLAWDVANIA / thanks for walking home". Not blocking.
4. Do you confirm "no fail state, no timer or score, no backtracking", or reject any of them? Blocks: any work that would add one.
5. Should breakable floors move from Ideas to Planned? If yes, two calls shape it most. First, a dive or slam rather than a slash, since the game has no combat. Second, whether a secret area may be more than a small pocket, since the scope allows one ravine and not a second area. Suggestion: give Clawd the move from the start. If he finds it partway, any cracked floor before that point invites backtracking, which question 4 would rule out. Not blocking.

---

# 4. Next actions

1. **The owner plays the live site once on a phone.** It's the one check v0.2 hasn't had, and a phone is where its extra drawing cost would show. Acceptance: smooth on the owner's phone; the title and Clawd's start clear the touch buttons; the ending reads right. Any tuning goes in one small PR, checked with both checkers.
2. **If question 1 is yes: the jump poses.** An anticipation frame and 2–3 `air` poses on the per-frame holds that already exist. Acceptance: `node tools/verify.js index.html --baseline <v0.2>` shows 0 physics differences, and the owner likes how Clawd looks in the air.
3. **Then the smaller notes** in `AUDIT.md`. Acceptance: both checkers pass.
4. **Breakable floors only after a yes to question 5, and then a plan before any code.** Acceptance: the plan answers the five questions in `FEATURES.md`, and `tools/verify.js` learns the new move and tiles.
5. **A WebGL prototype only if v0.2 still falls short of the posters.** Acceptance: a one-screen comparison the owner judges against the posters.

---

# 5. Verification ledger

**Ran this session, for this report (on `main` at `d93c121`):**
- The facts block: clean tree, 63 commits, 15 active days by git's dates, 3 commits since report 007.
- `git show 06c6e1e:index.html` as the v0.1 baseline: SHA-1 `b7414f33`, as logged for v0.1.
- `node tools/verify.js index.html --baseline <v0.1>`: PASS (6 checks) in 58.8 s. Lockstep: 0 tiles differ; 674,462 ticks, 0 differences.
- `node .claude/context/plans/poster-pass/check.js index.html <scratch dir>`: PASS (9 checks) in 62.7 s. Looked at its title and closing-card screenshots.
- `curl` of the live page: HTTP 200, 87,856 bytes, SHA-1 `86dace47`, equal to `git show origin/main:index.html`. `#build-version` reads v0.2.
- `git log`: PR #20 merged as `769fff0` and PR #21 as `d93c121`; the branch equals `origin/main`.
- GitHub: no open pull requests before this report's own.
- `wc`, `du -sh`, `grep` and `git grep` for every line and file cited in 2.3; `ls` for a LICENSE, a favicon and `.github`.
- Earlier in session 10 `[logged]`: the v0.2 build's checks, frame timing in headless Chromium, and an emulated phone screenshot of the prototype.

**Read this session:** `.claude/context/LOG.md`; `SR-clawdvania-007.md`; `.claude/context/FEATURES.md`; `CLAUDE.md`; the Status section of `README.md`; the header of `check.js`; the report template.

**Not verified:**
- Real-device performance. Headless rendering is software-only.
- Touch play on a real phone.
- How v0.2 feels: the sky's warmth, the ending's timing, Clawd's size. Only a person can judge these.
- Audio. It hasn't changed since v0.1 and was not listened to.
- `--deep` was not run. The physics are unchanged (0 lockstep differences), and it passed on 2026-11-16. `[logged]`
- History before 2026-07-28 is reconstructed from git and code, because no log existed then. `[logged]`

---

# 6. Memory block (for Claude.ai to store)

- Clawdvania is a five-minute browser walk home at dusk, in one HTML file drawn with Canvas 2D. Clawd is a pixel crab. No combat. Repo: https://github.com/Satejp10/Clawdvania. Live: https://satejp10.github.io/Clawdvania/ (capital C), served from `main` only.
- Stack: vanilla JavaScript and Canvas 2D. No engine, no build step, no runtime assets, no package manager, no CI. Runs from `file://`.
- `tools/verify.js` is a plain-Node movement checker that runs the game's own physics headlessly. `--baseline old.html` checks the walk is unchanged; `--deep` runs a dense search.
- `.claude/context/plans/poster-pass/check.js` is a browser check (Playwright) for the ending and Clawd's pixel scale. It also takes the README images.
- `.claude/context/FEATURES.md` is the index of every feature: built, planned, ideas and ruled out. It's updated in the same commit as any feature change or new owner suggestion.
- Started 2026-07-13. v0.2, the Canvas 2D "poster pass", has been live since 2026-11-23.
- Decided: portfolio piece. When polish and content compete, polish wins.
- Decided: five-minute vignette, with one optional ravine pocket under the third ditch. Nothing gates the walk home.
- Decided: 15 wisps. Wisp 13 is free, wisp 14 needs the double jump, wisp 15 needs the cling.
- Decided: one file, no build, no runtime assets. Data URIs are fine.
- Decided: the claude-works submission waits until the project is "stable". The four-item definition is unconfirmed.
- Decided: the look was improved with Canvas 2D (v0.2). WebGL only if that falls short.
- Decided: the ending. Clawd stays at the door and steps inside, a closing card follows, and after 11 s any key or tap starts the walk again. R restarts at any time.
- Decided: Clawd is drawn at a whole number of device pixels per sprite pixel, and `devicePixelRatio` is capped at 2. His size against the world varies a little with window size.
- Constraint: jump physics are derived from apex and time-to-apex; movement constants live in `TUNING`; the simulation is a fixed 60 Hz step, kept apart from rendering.
- Constraint: the world is bounded by `solidAt`, not by boundary tiles.
- Constraint: when the level or wisps change on purpose, update `EXPECT` in `tools/verify.js` in the same commit.
- Constraint: `tools/verify.js` can't see the ending; ending behaviour is checked in a browser.
- Constraint: the version label lives in `#build-version` in `index.html` and in the README's Status section.
- Idea, not planned: breakable floors that crumble but hold, opened by a downward move from the air (the owner's idea, 2026-11-23). Unsettled: slash or slam, how big a secret area may be, controls, found or there from the start, and safety.
- Do not: suggest a 3D rewrite as the look fix. It is a different game.
- Do not: trust a hand-written physics replica for reachability. Use `tools/verify.js`.
- Do not: put the ravine back as a raised wall at the third ditch.
- Proposed, not confirmed: no fail state, no timer or score, no backtracking.
- Planning notes and status reports are saved in Box under Claude/Clawdvania.
- Currently blocked on: nothing. The jump poses wait on the owner accepting the "stable" list.
- Next: the owner plays the live site on a phone; then the jump poses, if the "stable" list is accepted.

---

# 7. Appendix

**Commands:** check movement `node tools/verify.js [file] [--baseline old.html] [--deep]` (about 40–60 s without `--deep`) · check the ending and pixel scale in a browser `node .claude/context/plans/poster-pass/check.js [file] [outdir]` (about 50–65 s) · build: none · run: open `index.html` · deploy: merge to `main` (GitHub Pages).

**Where things live:** `index.html` (the game) · `tools/verify.js` · `README.md` · `AUDIT.md` (known issues) · `CLAUDE.md` (how to work on it) · `.claude/context/FEATURES.md` (every feature) · `.claude/context/LOG.md` (session history) · `.claude/context/plans/` (the ravine and poster-pass plans) · `.claude/context/reports/` (these reports) · `docs/` (the README image and the link-preview image) · `Resources/` (posters).

**To play a PR build before it merges:** open `index.html` on the PR's branch on GitHub, click "Download raw file", and open the downloaded file in a browser.
