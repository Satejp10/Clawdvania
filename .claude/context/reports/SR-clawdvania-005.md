**FOR CLAUDE.AI:** This is a status report generated inside Claude Code for the project below. Read it fully, update your stored memory for this project from Section 6, then reply with a short confirmation of what changed plus answers to any of Section 3's open questions you can address. Do not restate the report back to me. Treat Section 2 as current truth and anything you remembered previously as superseded.

---

```yaml
report_id: SR-clawdvania-005
project: Clawdvania
repo: https://github.com/Satejp10/Clawdvania
branch: claude/affectionate-planck-buzx0p (this report's draft PR; main is at ae83d91)
generated_utc: 2026-11-18T08:25Z
surface: claude code web
session_id: session_01JgeXKDwuEgUjp9F6bZP6Lo
project_started: 2026-07-13
days_active: 13
total_commits: 53
commits_since_last_report: 2
previous_report: SR-clawdvania-004 (2026-11-18)
previous_report_delivered_to_chat: unknown
supersedes: SR-clawdvania-004
standalone: true
```

---

# TLDR

- **What:** Clawdvania is a five-minute browser walk home at dusk, drawn with Canvas 2D in one HTML file. Clawd, a pixel crab, gathers wisps and reaches a cottage. No combat. Live at https://satejp10.github.io/Clawdvania/ (capital C).
- **Status:** v0.1 is live on `main` with the optional ravine, and the movement checker passes. The owner said the ravine "seems to be working." The game looks flatter and greyer than its own posters.
- **Changed since SR-clawdvania-004:** No game code changed. PR #17, a docs fix to SR-004, merged. Research on recent Claude-made browser demos produced a polish list and an overhaul plan, saved to Box and not to the repo. The plan's first step is now a Canvas 2D pass, not WebGL.
- **Blocked:** Nothing technical. The next logged build item waits on the owner's decision about the "stable" list.
- **Next:** If the owner says yes, build the Canvas 2D poster pass as one change (v0.2 proposed): far cottage on screen, warmer sky, lights above the night tint, title on open sky, a real ending, and the devicePixelRatio cap. The checker must show the walk is unchanged.
- **Needs a decision from you:** Should the poster pass start now, before the "stable" list is confirmed? (Question 3 in Section 3.)

---

# 1. Delta since SR-clawdvania-004

**Shipped:** Nothing in the game. `index.html` is unchanged since PR #15. PR #17 merged (`ae83d91`), a docs fix to SR-004's PR references. `[verified: git log 6c1fe97..HEAD; git diff --stat d86870f HEAD -- index.html is empty]`

**Changed direction (proposed, not confirmed by the owner):** The first visual step is a Canvas 2D poster pass. WebGL comes only if that pass falls short. Earlier today the plan was a WebGL rewrite first. Reasons are in 2.4.

**Corrections to what was said in chat today:**
- "Most viral demos are WebGL/GLSL" was a guess from titles and write-ups. Many examples are 3D, but nobody counted them, and the videos were not watched. `[unverified]`
- "A widely shared tip" (name three.js or WebGPU in the prompt) came from one post, as quoted by a write-up. `[verified: write-up text]`
- "Canvas 2D can only fake light" was too strong. The game already draws glow with Canvas gradients and additive blending. `[verified: index.html lines 1511, 1548, 1634]`
- The checker proves movement and reach. It cannot see how the game looks. `[verified: tools/verify.js header, browser stubbed out]`

**New problems:** None found in the code. The checker passes.

**Dropped:** The WebGL-first start. The Box overhaul note from today still says WebGL first. This report replaces it.

---

# 2. Full state (standalone)

## 2.1 What this is and why

Clawdvania is a five-minute browser walk home at dusk. Clawd, an orange pixel crab, crosses autumn hills, gathers wisps that light his path, rests at a bench overlook, and reaches a cottage before dark. Its atmosphere borrows from *Ori* and *Hollow Knight*, with none of the combat. `[logged: 2026-08-01]`

It is a portfolio piece. When polish and content compete, polish wins. `[logged: 2026-08-01]`

It must not become a combat game or anything longer than a five-minute vignette. The one vertical addition is the optional ravine, and nothing may gate the walk home. `[logged: 2026-08-01, 2026-11-12]`

Proposed, not yet confirmed by the owner: no fail state, no timer or score, no backtracking. `[logged: session 2]`

**Hard constraints:**
- One self-contained `index.html`: no engine, no build step, no runtime asset files, and it runs from `file://`. Data URIs count as one file. `[logged: 2026-08-01]`
- No package manager (no `package.json`), no CI, no `.github` folder, so no PR template. The one tool is `tools/verify.js`, plain Node. `[verified: git ls-files; ls]`
- GitHub Pages serves `main` only. A branch is not live until its PR merges. `[verified: live SHA-1 equals main's index.html]`

## 2.2 Timeline

- Started: **2026-07-13** (`130d0a4`, "Phase 1: movement greybox with Ori-inspired procedural theming"). `[verified: git log --reverse]`
- **53 commits** on `main`, across **13 active days**. `[verified: facts block]`
- Sessions logged: **8** before this one. This is session 9. `[verified: LOG.md]`
- Milestones:
  - 2026-07-13: movement greybox. `[verified: git log]`
  - 2026-08-01: scope set: five-minute vignette, one optional ravine, portfolio piece. `[logged]`
  - 2026-09-27: V3 poster added to the top of the README. A raised-wall ravine was drafted as PR #12. `[logged]`
  - 2026-11-12: ravine re-decided as an optional pocket. `tools/verify.js` added. `[logged]`
  - 2026-11-16: PR #12 merged by mistake. PR #13 (the plan and checker) merged a minute later. The ravine was built in PR #15. `[logged; verified: git log]`
  - 2026-11-18, 07:39 UTC: PR #15 merged. The ravine and the v0.1 label went live. `[verified: git log d86870f]`
  - 2026-11-18: PR #17 merged (`ae83d91`), the SR-004 docs fix. `[verified: git log]`
  - 2026-11-18: research on recent demos. Polish list and overhaul plan saved to Box. This report. `[verified: Box file details; this session]`
- This report: **2026-11-18T08:25Z**.

## 2.3 Where the code is

**Stack:** Vanilla JavaScript and Canvas 2D in `index.html`. No framework, library, bundler or package manager. The checker is plain Node. `[verified: index.html; git ls-files]`
**Entry point:** `index.html`, the whole game: 1,807 lines, 80,746 bytes. `[verified: wc -l; git show HEAD:index.html | wc -c]`

**Working (live on `main`):**
- The checker passes all 5 checks on the current file: level 112 × 38 tiles, 15 wisps. `[verified: node tools/verify.js, exit 0, 52.3 s, today]`
- Reach by ability set: plain run and jump gets wisps 1–13. The double jump adds 14. The cling adds 15. The door and the bench are reachable in every set. `[verified: node tools/verify.js]`
- No soft-locks: from all 714 places Clawd can stand, plain running and jumping gets home. Still true at 85% jump height and run speed. `[verified: node tools/verify.js]`
- Camera: Clawd stays on screen through 7 trips in and out of the ravine. Worst case: feet at 274 of 288. `[verified: node tools/verify.js]`
- Jump physics derived from apex and time-to-apex (`JUMP_VEL` and `GRAV_RISE`, lines 146–147). `[verified: grep]`
- Ravine: an optional pocket under the third ditch, holding three wisps. The owner said it "seems to be working." `[logged: 2026-11-18]`
- Version label `v0.1`: `index.html` line 77 and README line 59. Hidden on touch screens (CSS, line 67). `[verified: grep]`
- Live site equals `main` (SHA-1 `b7414f33`). `[verified: curl; git show HEAD:index.html | sha1sum]`

**Broken or incomplete (visual; the look is the main gap):**
- The look is flatter and greyer than the owner's posters in `Resources/`. `[inferred: side-by-side image this session]`
- The far-layer cottage is never on screen. Across every camera position the game allows (0 to 1,280), 0 of 1,281 frames show its lit window. `[verified: cottage check, run earlier this session on this same 80,746-byte file; cottageX at line 964; camera clamp at lines 706 and 951]`
- The night tint is painted at line 1675, after the wisps' lantern glow (line 1545) and after Clawd's pose is chosen (line 1529). So the lights dim as it gets dark. `[verified: line order in render()]`
- Lantern glow stops growing at 10 wisps (`Math.min(10, wispCount)`, line 1545). At that count it hazes over Clawd. `[verified: line 1545; zoomed screenshot earlier this session]`
- Clawd has no shadow under him, and the cottage has no smoke. The only shadow in the file is a CSS `box-shadow` on a page element. `[verified: grep -i "shadow|smoke"]`
- The title sits over the ledges at spawn, and "press any key to begin" (line 1751) sits on a platform. `[verified: screenshot earlier this session; lines 1744, 1751]`
- The ending: the end card fades out by `endT` 10 (line 1758), and nothing else follows. Clawd can walk on past the cottage. `[verified: lines 1757–1758; AUDIT.md smaller notes]`
- The ravine's back is open sky. By plan, the open gorge shows sky, and the parallax moves only sideways (`drawParallax` takes no vertical offset, line 1454). The V2 poster shows roots and moss. Adding depth is the owner's call. `[verified: code; LOG 2026-11-12; poster viewed earlier this session]`
- The `air` pose is a single frame. The `air` set has one entry (lines 336–354), and `ANIM_FPS.air` is 1 (line 435). Clawd looks the same at the apex as in freefall. `[verified]`
- Audit finding 4 is open: the fractional render scale makes Clawd's pixels uneven at some window sizes. `[verified: AUDIT.md "Still open"]`
- Audit finding 5 is open: `devicePixelRatio` is uncapped (line 1439). `[verified: grep]`
- Smaller notes still open: `updateWisps` runs on variable `dt` from the render pass; `const screen` shadows `window.screen` (see the comment at line 669); no reduced-motion handling; no LICENSE; no favicon. `[verified: AUDIT.md; line 669]`
- `Resources/Clawdvania_Poster_V3_Wisps_cropped.png` is referenced only in logs and reports. The game and README don't use it. `[verified: git grep HEAD]`

**Uncommitted work in progress:** The tree was clean at the start. This session adds two files: this report and one LOG entry. `[verified: git status --short, empty at start]`

## 2.4 Decisions

| Decision | Date | Why | Rejected | Reversible? |
|---|---|---|---|---|
| One self-contained `index.html`: no build, no runtime assets, runs from `file://` | 2026-08-01 | The project's pitch: open the file and play | An engine or bundler | Locked in |
| Data URIs count as "one file" | 2026-08-01 | Asset-shaped work stays possible | Banning binary-derived content | Cheap |
| Five-minute vignette, one optional ravine | 2026-08-01 | Stops the vertical addition growing into a second area | A second area | Expensive once built |
| Portfolio piece: polish beats content | 2026-08-01 | Tie-break for backlog order | Treating it as a content game | Cheap |
| Claude-works submission paused until "stable" | 2026-08-01 | The owner's call. "Stable" is defined only by an unconfirmed four-item list, so "v1.0" is not a logged term | Submitting while the game still changes | Cheap |
| The ravine is an optional pocket, never a gate | 2026-11-12 (approved in chat); "seems to be working" 2026-11-18 | Everyone finishes in five minutes; the pocket rewards curiosity | A raised wall at the third ditch (PR #12), which gated the bench and door and was reverted | Moderate: level and camera code |
| Wisps: 13 free, 14 needs the double jump, 15 needs the cling | 2026-11-12 | Each ability has exactly one thing it's for | Gating the bench or door behind an ability | Cheap: update the `EXPECT` table |
| Reachability is checked by `tools/verify.js`, which runs the game's own code | 2026-11-16 | A hand-written physics replica missed a coyote jump that clears the wall | Physics replicas; judging by eye | Cheap |
| Version label is a hand-edited constant in two places | 2026-11-18 | No build step to stamp it | A generated stamp | Cheap |
| Label hidden on touch devices | 2026-11-18 | It would cover the touch jump button | Showing it on touch screens | Cheap |
| Per-frame sprite durations shipped with no holds set | 2026-08-01 | Keeps the mechanism separate from the taste call about which frames to hold | Shipping both at once | Cheap |
| Jump physics derived from apex and time-to-apex | Since start `[inferred]` | Change the intent and gravity and velocity follow | Hand-set values | Cheap |
| Fixed 60 Hz simulation, separate from render | Since start `[verified: CLAUDE.md]` | Physics must not vary with frame rate | Physics in the render pass | Expensive |
| **Proposed, not confirmed:** the first visual step is a Canvas 2D poster pass; WebGL only if it falls short | 2026-11-18 | The game already fakes glow in Canvas, and the poster gaps are Canvas-sized. This is the cheapest test of whether WebGL is needed | WebGL first: about four sessions by a rough estimate, GPU risk, needs a fallback | Cheap |
| **Proposed, not confirmed:** no 3D rewrite in the style of the viral demos | 2026-11-18 (Claude's assessment) | It would be a different game: it loses the painted world and the pixel crab | A 3D game built on an engine | Expensive once started |

## 2.5 Dead ends

- **A hand-written physics replica for reachability.** Abandoned 2026-11-16. A replica said a single jump couldn't clear a 64 px wall. The real code clears it with a coyote jump pressed 1–5 ticks after leaving a ledge. Do not retry. Use `tools/verify.js`.
- **A raised wall at the third ditch as the ravine** (PR #12). Abandoned 2026-11-16. It didn't gate anything, and it contradicts "optional." Do not retry without the owner reversing "optional."
- **A follow camera inside the ravine.** Rejected 2026-11-12. It sways during wall kicks and drops Clawd off-screen in a plunge.
- **Blanking the boundary columns in every `LEVEL` row.** Abandoned 2026-07-28. It opened one-tile wells and let the cling grab the invisible room edge. `[verified: AUDIT.md finding 3]`
- **Inferring "a jump happened" from a velocity threshold.** Removed: it double-fired on wall kick-offs. `[verified: AUDIT.md]`
- **Headless tests through the render loop.** Headless rendering runs at single-digit FPS and interleaves, so results are unreliable. Call the update functions synchronously inside `page.evaluate`.
- **Converting reference GIFs to video for analysis.** Rejected 2026-08-01: video can't be read, but GIF frames can. `[logged: session 1]`
- **A 3D rewrite as the look fix.** Rejected 2026-11-18 (Claude's assessment, not the owner's). See 2.4.

## 2.6 Invariants (do not break)

- One file. Nothing loaded at runtime. Runs from `file://`.
- Nothing gates the walk home. Plain running and jumping reach the bench and the door from every place Clawd can stand.
- Movement constants live in `TUNING`. Jump physics are derived, not hand-set.
- Physics stays in the fixed 60 Hz pass. Never move it into render.
- The world is bounded by `solidAt`, not by boundary tiles in `LEVEL`.
- Movement changes are checked with `node tools/verify.js`. Use `--baseline old.html` to prove the unchanged walk plays the same. When the level or wisps change on purpose, update `EXPECT` in the same commit.
- The version label lives in two places: `#build-version` in `index.html` and the README's Status line. Change both together.
- GitHub Pages serves `main` only.
- `LOG.md` is append-only. Corrections go in new entries.
- Every chat response ends with a TLDR: State, Recommendation, Why (from `CLAUDE.md`).
- The live URL has a capital C.

## 2.7 Known issues and debt

- Touch screens: the label is hidden on touch-screen laptops too. Low impact; it's a testing aid.
- Previews: Pages serves `main` only. To test a PR, download its `index.html`.
- Log conflicts: two branches appending to `LOG.md` conflict at the tail. This happened 2026-11-16. `[logged]`
- Repo size: about 32 MB of images (`Resources` 31 MB, `docs` 912 KB). Deliberate, since the posters show the art. `[verified: du -sh]`
- The Box overhaul note from today recommends WebGL first. This report supersedes it. `[verified: Box file]`

---

# 3. Open questions for you

1. Do you accept the four-item "stable" list, or would you change it? The list: (1) the ravine, done; (2) per-frame durations, done, then 2–3 `air` poses; (3) audit findings 4 and 5; (4) the smaller notes. **Blocks:** the `air` poses, which are next in the logged plan.
2. Do you confirm "no fail state, no timer or score, no backtracking," or reject any of them? **Blocks:** any work that would add one of them.
3. Should the Canvas 2D poster pass (the first visual step) go in before the "stable" list is done, or after? **Blocks:** starting the visual work.

---

# 4. Next actions

1. **Build the Canvas 2D poster pass as one change (v0.2, proposed), if you answer question 3 "before."** It is the cheapest test of whether the look gap closes without WebGL. Items, in order: (a) far cottage on screen; (b) warmer sky and haze between the far layers; (c) night tint painted under the lights, and wisps in warm gold; (d) title on open sky; (e) ending closes: fade, a short credits card, "walk again," and R still resets the run; (f) cap `devicePixelRatio` at 2 (audit finding 5), since the pass adds full-screen draws. **Acceptance:** `node tools/verify.js <new file> --baseline <main's index.html at ae83d91>` passes with 0 physics differences; screenshots of the title, first stretch, bench and ending sit next to the posters and today's build; you play it once.
2. **The `air` poses (stable item 2), only if question 1 is answered in favour.** **Acceptance:** the `air` set cycles through 2–3 frames, and `--baseline` against `main` shows 0 physics differences.
3. **A WebGL prototype, only if the poster pass falls short.** **Acceptance:** a one-screen comparison (title and first stretch) that you judge against the posters. Decide after step 1 is judged.

---

# 5. Verification ledger

**Ran this session (2026-11-18):**
- Facts block at `ae83d91` (HEAD matches `origin/main`): clean tree, 53 commits, 13 active days, 2 commits since SR-004.
- `node tools/verify.js`: PASS (5 checks), exit 0, 52.3 s. Reach 13 / 14 / 15 / 15. Soft-lock 0 of 714. Handicap 0 of 714 stuck. Camera worst case: feet at 274 of 288.
- `git show HEAD:index.html`: 80,746 bytes, SHA-1 `b7414f33`. Live page via `curl`: SHA-1 `b7414f33`. Equal.
- `git diff --stat d86870f HEAD -- index.html`: empty.
- Grep and line reads of `index.html`: label (63, 67, 77); cottage (964, 1076–1077, 1454, 1493); night tint (1674–1675); title (1744, 1751); ending (1502, 1535, 1757–1758); additive glow (1511, 1545, 1548, 1634); `devicePixelRatio` (1439); camera clamp (706, 951); `air` set (336–354, one frame; 435); jump constants (146–147); shadow and smoke search (none drawn).
- `git ls-files`: no `package.json`, no `.github` directory.
- `git grep` for the cropped poster: only in logs and reports.
- `du -sh Resources docs`: 31 MB and 912 KB.
- Box: `polish-ideas-2026-11-18.md` sits in `Claude/Clawdvania` (path checked).
- GitHub: no open pull requests before this report's PR.
- Cottage check (`cottage-check.js`, a throwaway script, not in the repo): 0 of 1,281 camera positions show the window. Run earlier this session on the same 80,746-byte file.

**Read this session:** `.claude/context/LOG.md`, `SR-clawdvania-004.md`, `AUDIT.md`, the report template, `CLAUDE.md` (in context), `README.md`, the header of `tools/verify.js`, and `index.html` by grep and line reads.

**Not verified:**
- `--baseline` and `--deep` were not re-run today. PR #15's description logs PASS (8 checks) for the same game code on 2026-11-16. `[logged]`
- No new screenshots today. The title, cottage and glow findings come from earlier this session.
- The look against the posters, and against the viral demos, is judgement. The demos were checked from titles and write-ups. The videos were not watched.
- Canvas or WebGL cost: not measured. Headless rendering runs at single-digit FPS, so it can't judge this.
- Touch devices, audio, and how the ending feels.
- History before 2026-07-28 is reconstructed from git and code, because no log existed then. `[logged]`

---

# 6. Memory block (for Claude.ai to store)

- Clawdvania is a five-minute browser walk home at dusk, in one HTML file drawn with Canvas 2D. Clawd, a pixel crab. No combat. Repo: https://github.com/Satejp10/Clawdvania. Live: https://satejp10.github.io/Clawdvania/ (capital C), served from `main` only.
- Stack: vanilla JavaScript and Canvas 2D. No engine, no build step, no runtime assets, no package manager, no CI. Runs from `file://`.
- `tools/verify.js` is a plain-Node movement checker. It runs the game's own physics headlessly. `--baseline old.html` checks the walk is unchanged. `--deep` runs a dense search.
- Started 2026-07-13. As of 2026-11-18, v0.1 is live on `main` with the optional ravine. The owner said the ravine "seems to be working."
- Decided: portfolio piece. When polish and content compete, polish wins.
- Decided: five-minute vignette, with one optional ravine pocket under the third ditch. Nothing gates the walk home.
- Decided: 15 wisps. Wisp 13 is free, wisp 14 needs the double jump, wisp 15 needs the cling.
- Decided: one file, no build, no runtime assets. Data URIs are fine.
- Decided: the claude-works submission is paused until the project is "stable." The four-item definition is unconfirmed.
- Constraint: jump physics are derived from apex and time-to-apex. Movement constants live in `TUNING`. The simulation is a fixed 60 Hz step, kept apart from rendering.
- Constraint: the world is bounded by `solidAt`, not by boundary tiles.
- Constraint: when the level or wisps change on purpose, update `EXPECT` in `tools/verify.js` in the same commit.
- Do not: re-suggest a 3D rewrite (Three.js style) as the look fix. It is a different game.
- Do not: trust a hand-written physics replica for reachability. Use `tools/verify.js`.
- Do not: put the ravine back as a raised wall at the third ditch.
- Proposed, not confirmed: no fail state, no timer or score, no backtracking.
- Proposed, not decided: the first visual step is a Canvas 2D poster pass. WebGL only if that falls short.
- Planning notes and status reports are saved in Box under Claude/Clawdvania.
- Currently blocked on: the owner's decisions about the "stable" list and about whether the poster pass comes first. Nothing technical.
- Next: if the poster pass is approved, build it as one change (v0.2 proposed), checked with `--baseline`.

---

# 7. Appendix

**Commands:** test `node tools/verify.js [file] [--baseline old.html] [--deep]` (about 52 s plain). Build: none. Run: open `index.html`. Deploy: merge to `main` (GitHub Pages).
