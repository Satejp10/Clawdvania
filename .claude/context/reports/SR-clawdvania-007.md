**FOR CLAUDE.AI:** This is a status report generated inside Claude Code for the project below. Read it fully, update your stored memory for this project from Section 6, then reply with a short confirmation of what changed plus answers to any of Section 3's open questions you can address. Do not restate the report back to me. Treat Section 2 as current truth and anything you remembered previously as superseded.

---

```yaml
report_id: SR-clawdvania-007
project: Clawdvania
repo: https://github.com/Satejp10/Clawdvania
branch: claude/ecstatic-planck-givssa (draft PR Satejp10/Clawdvania#20; main is at 06c6e1e)
generated_utc: 2026-11-23T19:43Z
surface: claude code web
session_id: session_01JgeXKBvjUdS4xLZyn5dDWu
project_started: 2026-07-13
days_active: 15 (git dates PR #19's merge commit 2026-11-24 because of the time zone it was recorded in; in UTC everything since report 006 happened on 2026-11-23)
total_commits: 59 (58 on main, plus the v0.2 commit on this branch)
commits_since_last_report: 2
previous_report: SR-clawdvania-006 (2026-11-23)
previous_report_delivered_to_chat: unknown
supersedes: SR-clawdvania-006
standalone: true
```

---

# TLDR

- **What:** Clawdvania is a five-minute browser walk home at dusk, drawn with Canvas 2D in one HTML file. Clawd, a pixel crab, gathers wisps and reaches a cottage. No combat. Live at https://satejp10.github.io/Clawdvania/ (capital C).
- **Status:** v0.2, the "poster pass", is built and waiting in draft PR Satejp10/Clawdvania#20, with every check passing. v0.1 stays live until that PR merges.
- **Changed since SR-clawdvania-006:** The owner merged the plan (PR #19) and said "build v0.2". It was built from the plan with no new logic: a sky like the posters, the home cottage visible from the first screen, lights that win the night, a new title and an ending that closes and offers the walk again. Audit findings 4 and 5 are closed.
- **Blocked:** Only on the owner playing it once and merging.
- **Next:** The owner downloads PR #20's `index.html`, plays it, and merges it if it's right. Then a phone check on the live site.
- **Needs a decision from you:** Does v0.2 look and feel right? Judge the sky's warmth, the ending's timing and Clawd's size, which now shifts a little with the window size (1.2× his old size in a 1280×720 window).

---

# 1. Delta since SR-clawdvania-006

**Merged:** PR Satejp10/Clawdvania#19, the v0.2 plan and report 006, at `06c6e1e`. It didn't touch `index.html`, so the live site is still v0.1. `[verified: git log; curl of the live page, SHA-1 b7414f33 equals main's index.html]`

**Built (in a PR, not live):** v0.2 in draft PR Satejp10/Clawdvania#20, commit `0e5c0cd`. `[verified: git log; PR created this session]`
- `git apply` of the plan's patch on `main` gave exactly the checked prototype (SHA-1 `69fd3234`). Then the version label went to v0.2. No logic was written by hand. `[verified: sha1sum]`
- Sky: deep indigo overhead, an amber glow on the horizon and a third, hazy range of hills. The god rays and the pale top-right sun are gone.
- Home: the far-hill cottage is on screen from the first frame, with lit windows and chimney smoke, and fades out before the real cottage appears. The real cottage has smoke too.
- Lights: the night tint now goes under the wisps, the lantern and the lit window, so night darkens the world but not the lights. Wisps are warm gold, the lantern glow is capped, and Clawd has a soft contact shadow.
- Title: "CLAWDVANIA" and "A WALK HOME AT DUSK" in spaced capitals on open sky. The prompt sits on the dark earth.
- Ending: at the door Clawd stops and input is ignored. About 4 s in he steps inside as the doorway glows. A closing card reads "CLAWDVANIA / thanks for walking home", and after 11 s any key or tap starts the walk again. R still restarts at any time.
- Audit finding 4: Clawd is drawn at a whole number of device pixels per sprite pixel. Audit finding 5: `devicePixelRatio` is capped at 2.
- Docs in the same PR: the README's "Look:" and Status lines, a new README image and link-preview image (retaken with the plan's `check.js`, re-saved losslessly), AUDIT, the plan's status, LOG.

**Changed direction:** Nothing reversed. Report 006's proposals (the poster pass first, as v0.2, and the new ending) became decisions when the owner said "build v0.2".

**New problems:** One, a side effect the plan didn't spell out. Drawing Clawd at a whole-number scale `k = round(S)` makes his size against the world depend on the window: `k / S`, which is 1.2× his old size in a 1280×720 window and 1.07× at 1920×1080. It's the price of even pixels, and it's flagged in the PR and in AUDIT for the playtest. `[verified: the sprite draw in index.html; check.js measures 3 device px per sprite pixel at S = 2.5]`

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
- No package manager, no CI, no `.github` folder, so no PR template. The tools are `tools/verify.js` (plain Node) and, since the poster pass, `.claude/context/plans/poster-pass/check.js` (Playwright). `[verified: ls; git ls-files]`
- GitHub Pages serves `main` only. A branch is not live until its PR merges. `[verified: the live page's SHA-1 equals main's index.html]`

## 2.2 Timeline

- Started: **2026-07-13** (`130d0a4`, "Phase 1: movement greybox with Ori-inspired procedural theming"). `[verified: git log --reverse]`
- **59 commits** on this branch (58 on `main`), across **15 active days** by git's dates (see the header for why one is 2026-11-24). `[verified: facts block]`
- Sessions logged: **10**. The v0.2 build is part of session 10. `[verified: LOG.md]`
- Milestones:
  - 2026-07-13: movement greybox. `[verified: git log]`
  - 2026-08-01: scope set: five-minute vignette, one optional ravine, portfolio piece. `[logged]`
  - 2026-09-27: V3 poster added to the README. A raised-wall ravine was drafted as PR #12. `[logged]`
  - 2026-11-12: ravine re-decided as an optional pocket. `tools/verify.js` added. `[logged]`
  - 2026-11-16: PR #12 merged by mistake and was undone. The ravine was built in PR #15. `[logged; verified: git log]`
  - 2026-11-18: PR #15 merged. The ravine and the v0.1 label went live. Report 005 proposed a Canvas 2D poster pass. `[verified: git log d86870f; logged]`
  - 2026-11-23: the owner played v0.1 to the ending. The poster pass was planned and checked (PR #19, merged), then built as v0.2 in draft PR Satejp10/Clawdvania#20. `[verified: git log; logged: session 10]`
- This report: **2026-11-23T19:43Z**.

## 2.3 Where the code is

**Stack:** Vanilla JavaScript and Canvas 2D in `index.html`. No framework, library, bundler or package manager. The checkers are plain Node, and `check.js` uses the Playwright that the environment provides. `[verified: index.html; git ls-files]`

**Entry point:** `index.html`, the whole game. On this branch (v0.2): 1,936 lines, 87,856 bytes. On `main` (v0.1): 1,807 lines, 80,746 bytes. `[verified: wc; v0.1 figures logged 2026-11-23]`

**Working in v0.2 (this branch, PR #20):**
- The walk plays exactly as v0.1: `node tools/verify.js index.html --baseline <v0.1>` passes all 6 checks. Lockstep: 0 tiles differ; 400 random runs, 674,462 ticks compared, 0 differences. `[verified: ran it, 41.2 s]`
- Reach by ability set: plain running and jumping gets wisps 1–13, the double jump adds 14 and the cling adds 15. The door and the bench are reachable in every set. `[verified: same run]`
- No soft-locks: from all 714 places Clawd can stand, plain running and jumping gets home, still true at 85% jump height and run speed. `[verified: same run]`
- Camera: Clawd stays on screen through 7 trips in and out of the ravine. Worst case: feet at 274 of 288. `[verified: same run]`
- The ending: holding right into the door, Clawd slides 5 px and stops 4.5 px left of its centre. A jump is ignored. A key at 5 s does nothing. A key after 11 s starts the walk again from x 49 with every wisp returned and no stale jump. R restarts during the ending. `[verified: check.js, 9 of 9, 47.4 s]`
- Clawd's pixels: at scale 2.5, every eye pixel is 3 device px wide. On v0.1 they were 2 or 3. `[verified: check.js]`
- No page errors in any scene. `[verified: check.js]`
- The look as described in Section 1: sky, far cottage and smoke, lights over the night tint, title. `[verified: screenshots today of the title, walk, bench, door, closing card and ravine, plus the two README framings]`
- `devicePixelRatio` is capped at 2 (line 1487). `[verified: grep]`
- Version label v0.2 in `#build-version` (line 77, hidden on touch screens) and in the README's Status line. `[verified: grep; zoomed screenshot]`

**Live on `main` (v0.1):** the live page equals `main`'s `index.html`, SHA-1 `b7414f33`. `[verified: curl, HTTP 200, today]`

**Broken or incomplete:**
- v0.2 isn't live: it waits on the owner's playtest and merge. `[verified: PR #20 is a draft]`
- Clawd's size against the world now depends on the window size (`k / S`): 1.2× in a 1280×720 window, 1.07× at 1920×1080. A deliberate trade-off for even pixels, not yet judged by the owner. `[verified: index.html sprite draw; check.js]`
- Real-device performance is untried. v0.2 costs about 15% more per frame in headless software rendering. The `devicePixelRatio` cap more than offsets that on 3× phones, but not on 2× laptops. `[logged: 2026-11-23]`
- The `air` pose is a single frame, so Clawd looks the same at the apex as in freefall (pose at line 336, hold at 435). `[verified: grep]`
- The ravine's back is open sky, because the parallax layers only move sideways (`drawParallax(cv, factor, cx)`, line 1502). The V2 poster shows roots and moss there. `[verified: grep]`
- On phones, Clawd starts under the right-arrow touch button. `[inferred: emulated phone screenshot of the prototype on 2026-11-23; spawn and buttons are unchanged in v0.2]`
- Smaller notes still open: `updateWisps` runs on the render pass's variable `dt` (called at line 1743); `const screen` shadows `window.screen` (line 1477, worked around at 671); no reduced-motion handling; no LICENSE; no favicon. `[verified: grep; ls]`
- `Resources/Clawdvania_Poster_V3_Wisps_cropped.png` is referenced only in the log and reports. `[verified: git grep]`

**Uncommitted work in progress:** clean tree. This branch has one commit that isn't on `main` (`0e5c0cd`, v0.2), in draft PR #20. This report adds a second. `[verified: git status; git log]`

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
| The look is fixed with Canvas 2D first (the poster pass); WebGL only if it falls short | Proposed 2026-11-18; owner said "build v0.2" 2026-11-23 | The game already draws glow in Canvas, and the gaps were Canvas-sized. It's the cheapest test of whether WebGL is needed | WebGL first (about four sessions by a rough guess, GPU risk); a 3D rewrite (a different game) | Cheap |
| The poster pass ships as v0.2, before the rest of the "stable" list | 2026-11-23 | Polish beats content, and it closes audit findings 4 and 5 on the way | Doing the `air` poses and smaller notes first | Cheap |
| The ending ignores input at the door; Clawd steps inside; closing card; walk again after 11 s | 2026-11-23, approved with "build v0.2"; judged in the playtest | A closing sequence needs Clawd to stay put, and it fixes walking on past the house | Leaving the ending open-ended | Cheap: one block of the change |
| The far cottage is small and hazy, under the platforms, and fades out while the camera moves from x 860 to 1060 | 2026-11-23 | At full size it read as a house in the playfield. The fade keeps two cottages from being on screen together (the real one appears at x 1094) | A 30 px cottage; keeping both on screen | Cheap |
| No god rays; the sun's glow sits on the horizon | 2026-11-23 | The posters light the scene from the horizon | The top-right sun with rays | Cheap |
| The haze is baked into the farthest hill layer | 2026-11-23 | It doesn't change sideways, so it costs nothing as part of that layer. A pass of its own made frames about 30% slower instead of 15% | A separate full-screen haze pass | Cheap |
| Clawd is drawn at `k = round(S)` device px per sprite pixel; the world keeps the fractional scale | 2026-11-23 (audit's suggested fix) | Even pixels: his eyes no longer change width as he walks. Keeps the crisp-crab-on-a-smooth-world contrast | Drawing him at the fractional scale (uneven pixels) | Cheap, one line; the size side effect needs the owner's eye |
| `devicePixelRatio` capped at 2 | 2026-11-23 (audit's suggested fix) | The art is 512×288 upscaled, so past 2× there's no detail to gain, only fill cost | Uncapped | Cheap |

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
- The version label lives in two places: `#build-version` in `index.html` and the README's Status line. Change both together.
- GitHub Pages serves `main` only.
- `LOG.md` is append-only. Corrections go in new entries.
- Suggestions are flagged as suggestions and not built unless the owner asks (`CLAUDE.md`).
- Every chat response ends with a TLDR: state, recommendation, why (`CLAUDE.md`).
- The live URL has a capital C.

## 2.7 Known issues and debt

- Performance can't be judged headless. It needs one try on the owner's slowest device.
- Previews: Pages serves `main` only, so to try a PR the owner downloads its `index.html` ("Download raw file" on GitHub). That's awkward on a phone, so the phone check happens on the live site after merging.
- Log conflicts: two branches appending to `LOG.md` conflict at the tail. It happened on 2026-11-16.
- Repo size: about 32 MB of images (`Resources` 31 MB, `docs` 1.4 MB, including the new 733 KB README image and 595 KB link preview), plus 308 KB for the poster-pass plan folder. Deliberate. `[verified: du -sh]`
- Box: `poster-pass-plan-2026-11-23.md` in Claude/Clawdvania is a stub uploaded by mistake (a placeholder line instead of the plan). It has a comment saying so, and the real copy, `poster-pass-plan.md`, sits beside it. The owner can delete the stub. The Box copy of the plan still says "not built"; this report supersedes it.
- The `project-status` skill's template tells the reader to answer "Section 5's open questions"; they are in Section 3. This report uses Section 3. The skill lives outside this repo.

---

# 3. Open questions for you

1. After playing PR #20's `index.html`: does v0.2 look and feel right? In particular the sky's warmth, whether you notice the far cottage fading, the ending's timing, and Clawd's size. Blocks: merging v0.2.
2. Should the closing card carry a credit line, and if so, what should it say? It reads "CLAWDVANIA / thanks for walking home". Not blocking: v0.2 can ship without one.
3. Do you accept the four-item "stable" list? The items: (1) the ravine, done; (2) per-frame durations, done, then 2–3 `air` poses; (3) audit findings 4 and 5, done in v0.2; (4) the smaller notes. Blocks: the `air` poses.
4. Do you confirm "no fail state, no timer or score, no backtracking", or reject any of them? Blocks: any work that would add one.

---

# 4. Next actions

1. **The owner plays PR #20 once on a computer, and it merges if it's right.** It's the only thing between v0.2 and the live site. Any tuning from that play goes into the same PR first. Acceptance: PR #20 merged; the live page's SHA-1 equals `main`'s `index.html`; the corner reads v0.2.
2. **A phone check on the live site.** Acceptance: it runs smoothly on the owner's phone, and the title is clear of the touch buttons.
3. **The rest of the "stable" list, if question 3 is yes:** the `air` poses, then the smaller notes. Acceptance: `--baseline` shows 0 physics differences.
4. **A WebGL prototype, only if v0.2 still falls short of the posters.** Acceptance: a one-screen comparison the owner judges against the posters.

---

# 5. Verification ledger

**Ran this session (2026-11-23), since report 006:**
- Facts block at `0e5c0cd`: clean tree, 59 commits (58 on `main`), 15 active days by git's dates, 2 commits since report 006.
- `git apply .claude/context/plans/poster-pass/index.patch` on `main` at `06c6e1e` (`index.html` SHA-1 `b7414f33` before): SHA-1 `69fd3234` after, as the plan expected.
- `node tools/verify.js index.html --baseline <v0.1>`: PASS (6 checks) in 41.3 s after the patch and 41.2 s after the version bump. Lockstep: 0 tiles differ; 400 random runs, 674,462 ticks compared, 0 differences.
- `node .claude/context/plans/poster-pass/check.js index.html <outdir>`: PASS (9 checks) in 49.3 s after the patch and 47.4 s after the version bump.
- Looked at both README framings (1536×864 and 1200×750) and zoomed the version label: it reads v0.2. Compared the top-left corner with the old README image: the dark shape there is a foreground branch, in both.
- Re-saved both README images losslessly with Python's PIL: pixels identical, 1,191 KB to 733 KB and 933 KB to 595 KB.
- `git log` and `git show origin/main:index.html | sha1sum`: PR #19 merged at `06c6e1e`; `main`'s `index.html` is `b7414f33`.
- `curl` of the live page: HTTP 200, SHA-1 `b7414f33`, equal to `main`.
- GitHub: no open PRs before PR #20, which was created as a draft.
- `wc`; `du -sh`; grep and `git grep` for every line and file cited in 2.3; `ls` for LICENSE.
- Earlier the same day, for report 006: the prototype and v0.1 checks, frame timing in headless Chromium, and an emulated phone screenshot. `[logged: session 10]`

**Read this session:** `.claude/context/LOG.md`; `SR-clawdvania-006.md`; `.claude/context/plans/poster-pass.md`; `poster-pass/check.js`; `README.md`; `AUDIT.md`; `CLAUDE.md`; the report template.

**Not verified:**
- Real-device performance. Headless rendering is software-only.
- How v0.2 feels: the sky's warmth, the ending's timing, Clawd's size. Only a person can judge these.
- Touch play on a real phone. Only an emulated phone screenshot was taken, of the prototype.
- Audio. v0.2 doesn't change it, and it was not listened to.
- `--deep` was not run. The physics are unchanged (0 lockstep differences), and PR #15 logged it passing on 2026-11-16. `[logged]`
- The V2 Ravine poster was not viewed this session.
- History before 2026-07-28 is reconstructed from git and code, because no log existed then. `[logged]`

---

# 6. Memory block (for Claude.ai to store)

- Clawdvania is a five-minute browser walk home at dusk, in one HTML file drawn with Canvas 2D. Clawd is a pixel crab. No combat. Repo: https://github.com/Satejp10/Clawdvania. Live: https://satejp10.github.io/Clawdvania/ (capital C), served from `main` only.
- Stack: vanilla JavaScript and Canvas 2D. No engine, no build step, no runtime assets, no package manager, no CI. Runs from `file://`.
- `tools/verify.js` is a plain-Node movement checker that runs the game's own physics headlessly. `--baseline old.html` checks the walk is unchanged; `--deep` runs a dense search.
- `.claude/context/plans/poster-pass/check.js` is a browser check (Playwright) for the ending and Clawd's pixel scale. It also takes the README images.
- Started 2026-07-13. v0.1 is live. v0.2, the Canvas 2D "poster pass", is built in PR Satejp10/Clawdvania#20 and waits on the owner's playtest.
- Decided: portfolio piece. When polish and content compete, polish wins.
- Decided: five-minute vignette, with one optional ravine pocket under the third ditch. Nothing gates the walk home.
- Decided: 15 wisps. Wisp 13 is free, wisp 14 needs the double jump, wisp 15 needs the cling.
- Decided: one file, no build, no runtime assets. Data URIs are fine.
- Decided: the claude-works submission waits until the project is "stable." The four-item definition is unconfirmed.
- Decided: the look is improved with Canvas 2D first (v0.2); WebGL only if that falls short.
- Decided: the ending: Clawd stays at the door and steps inside, a closing card follows, and after 11 s any key or tap starts the walk again. R restarts at any time.
- Decided: Clawd is drawn at a whole number of device pixels per sprite pixel, and `devicePixelRatio` is capped at 2. His size against the world now varies a little with window size.
- Constraint: jump physics are derived from apex and time-to-apex; movement constants live in `TUNING`; the simulation is a fixed 60 Hz step, kept apart from rendering.
- Constraint: the world is bounded by `solidAt`, not by boundary tiles.
- Constraint: when the level or wisps change on purpose, update `EXPECT` in `tools/verify.js` in the same commit.
- Constraint: `tools/verify.js` can't see the ending; ending behaviour is checked in a browser.
- Constraint: the version label lives in `#build-version` in `index.html` and in the README's Status line.
- Do not: suggest a 3D rewrite as the look fix. It is a different game.
- Do not: trust a hand-written physics replica for reachability. Use `tools/verify.js`.
- Do not: put the ravine back as a raised wall at the third ditch.
- Proposed, not confirmed: no fail state, no timer or score, no backtracking.
- Planning notes and status reports are saved in Box under Claude/Clawdvania.
- Currently blocked on: the owner's playtest of v0.2 (PR #20).
- Next: play PR #20's `index.html`, merge it if it's right, then check it on a phone on the live site.

---

# 7. Appendix

**Commands:** check movement `node tools/verify.js [file] [--baseline old.html] [--deep]` (about 40 s plain) · check the ending and pixel scale in a browser `node .claude/context/plans/poster-pass/check.js [file] [outdir]` (about 50 s) · build: none · run: open `index.html` · deploy: merge to `main` (GitHub Pages).

**v0.2 files in PR #20:** `index.html` (the poster pass and the v0.2 label) · `docs/screenshot.png` and `docs/thumbnail.png` (retaken; the thumbnail is the link-preview image) · `README.md` · `AUDIT.md` · `.claude/context/plans/poster-pass.md` (status: built) · `.claude/context/LOG.md`.

**To play a PR build before it merges:** open `index.html` on the PR's branch on GitHub, click "Download raw file", and open the downloaded file in a browser.
