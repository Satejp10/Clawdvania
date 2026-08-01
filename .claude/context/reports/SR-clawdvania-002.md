**FOR CLAUDE.AI:** This is a status report generated inside Claude Code for the project below. Read it fully, update your stored memory for this project from Section 6, then reply with a short confirmation of what changed plus answers to any of Section 3's open questions you can address. Do not restate the report back to me. Treat Section 2 as current truth and anything you remembered previously as superseded.

---

```yaml
report_id: SR-clawdvania-002
project: Clawdvania
repo: https://github.com/Satejp10/Clawdvania
branch: claude/project-audit-nreywo (all work merged to main)
generated_utc: 2026-08-01T15:51Z
surface: claude code web
session_id: session_01P9gYNKPpJ6DGj4Hw71kQgY
project_started: 2026-07-13
days_active: 7
total_commits: 19
commits_since_last_report: 4
previous_report: SR-clawdvania-001 (2026-08-01)
previous_report_delivered_to_chat: yes
supersedes: SR-clawdvania-001
standalone: true
```

---

# TLDR

- **What:** A single-file browser platformer — Clawd the pixel crab walks home at dusk. Vanilla JS + Canvas 2D, no engine, no build step, no asset files.
- **Status:** Shipped and stable. Live at https://satejp10.github.io/Clawdvania/ — verified this session that the deployed build is byte-for-byte identical to `main` (74207 bytes both) and boots with zero page errors.
- **Changed since SR-clawdvania-001:** All four open questions from that report were answered and are now recorded decisions. Open Graph link previews and a 1200×750 thumbnail shipped and are confirmed live. The claude-works submission is **paused** by your instruction.
- **Blocked:** Nothing technically. One process gate: "stable state" is the condition for unpausing claude-works, and it currently has no agreed definition.
- **Next:** Build the ravine — one PR of level data plus a reachability re-run.
- **Needs a decision from you:** Confirm or amend the proposed four-item definition of "stable". Without it the pause you set has no end condition.

---

# 1. Delta since SR-clawdvania-001

**Shipped:**
- Open Graph and Twitter card meta tags, a meta description, and a `theme-color` in `index.html`. `[verified: 15 og:/twitter: meta tags served on the live page this session]`
- `docs/thumbnail.png` at 1200×750, serving both the link preview and a future external submission. `[verified: HTTP 200, image/png, 377379 bytes from the live host]`
- Scope decisions written into `CLAUDE.md` so they survive session loss. `[verified: read CLAUDE.md]`
- Two log entries recording the scope answers and the claude-works pause. `[verified: read .claude/context/LOG.md]`

**Changed direction:**
- **The four open questions from SR-001 are answered** and have moved from questions to decisions: stays a five-minute vignette with *one* ravine; "one file" is locked but satisfied by data URIs; audience is a portfolio piece, so polish outranks content; and — recorded as *proposed, not confirmed* — no fail state, no timer or score, no backtracking.
- **claude-works submission paused** until the project reaches a stable state. Parked, not blocked: the thumbnail it required is already built and live.

**New problems:** None in the project. Two defects were found and fixed in the `project-status` skill itself, which lives outside this repo: its template told the reading assistant to answer "Section 5's open questions" when those are Section 3, and `SKILL.md` separately called decisions "Section 3" when the template puts them at 2.4. The first was reported by the chat assistant; the second was found while checking for others of the same kind. `[verified: read and edited both files]`

**Dropped:** Nothing abandoned.

---

# 2. Full state (standalone)

## 2.1 What this is and why

**Clawdvania is a five-minute browser platformer**: Clawd, an orange pixel crab, walks home across autumn hills at dusk, gathering wisps that orbit him and light his path, resting at a bench overlook, and reaching a cottage before dark. It is explicitly *Ori* and *Hollow Knight* atmosphere with **none of the combat**. `[verified: read README.md]`

**It is a portfolio piece.** When polish and content compete, polish wins. `[logged: 2026-08-01]`

**What it must not become:** a combat game; and it must not grow past a five-minute vignette — the agreed vertical addition is *one* ravine, not a second area. `[logged: 2026-08-01]` Proposed but not yet confirmed by the author: no fail state, no timer or score, no backtracking.

**Hard constraints:**
- **One self-contained `index.html`.** No engine, no build step, no asset files loaded by the game. Must run from `file://`. "One file" is locked, but **data URIs satisfy it**, so asset-shaped work is not blocked. `[logged: 2026-08-01]`
- No test suite, no CI, no package manager. `[verified: no package.json, no .github directory]`
- Deployed via GitHub Pages from `main`. The URL is case-sensitive — the lowercase path 404s. `[verified: curl of both casings, earlier this session]`

## 2.2 Timeline

- Started: **2026-07-13** (`130d0a4` "Phase 1: movement greybox with Ori-inspired procedural theming") `[verified: facts block]`
- **19 commits across 7 active days**; 15 in the last 14 days. `[verified: facts block]`
- Last commit: **2026-08-01** (`f971602`) `[verified: facts block]`
- Eight pull requests merged: audit → ditches + wall cling → run-restart + edge guard → double jump → README play link → status report 001 → link previews → claude-works pause. `[verified: git log]`
- This report: **2026-08-01T15:51Z**

## 2.3 Where the code is

**Stack:** Vanilla JavaScript + Canvas 2D. No framework, no libraries, no bundler. `[verified: read index.html]`
**Entry point:** `index.html` — 74207 bytes, the entire game. `[verified: wc -c]`

**Working:**
- Boots clean to the title state with **zero console or page errors**. `[verified: headless Chromium against file://index.html this session]`
- Live deployment is **byte-for-byte identical** to local `index.html` (74207 bytes both). `[verified: curl vs wc -c this session]`
- **Link previews are live end to end** — 15 `og:`/`twitter:` tags served on the deployed page, and the image they point at returns HTTP 200 as `image/png`. `[verified: curl this session]`
- Fixed-timestep simulation at 60Hz with an accumulator; rendering separate, on browser `dt`. `[verified: read index.html]`
- Derived jump physics: `APEX_PX` 52px, `JUMP_VEL` 325 px/s, `GRAV_RISE` ≈1015.6 px/s² (`index.html:138`), from `jumpApexTiles: 3.25` and `timeToApex: 0.32`. Measured apex 49.31px — discretisation from the fixed timestep. `[unverified: computed earlier this session, not re-run today]`
- Asymmetric gravity, `fallGravityMult: 1.7` (`index.html:93`) → rise 0.320s, fall 0.245s. `[unverified: computed earlier this session]`
- Wall cling, double jump (`airJumps: 1`, `airJumpMult: 0.86`), coyote 100ms, jump buffer 120ms, variable jump height. `[unverified: read earlier this session]`
- HiDPI: canvas backed by physical pixels so the browser never bilinear-stretches the frame. `[unverified: read earlier this session]`
- Sprite poses: `idle` 2 frames, `scuttle` 3, `air` **1**, `cling` **1**; sprite grid 16×12 (`index.html:213`). `[verified: parsed BODY this session]`

**Broken or incomplete:** Nothing broken. Incomplete by design — see 2.7.

**Uncommitted work in progress:** Clean tree. `[verified: git status --porcelain empty]`

## 2.4 Decisions

| Decision | Date | Why | Rejected | Reversible? |
|---|---|---|---|---|
| One self-contained `index.html`, zero loaded assets | 2026-07-13 | Runs from `file://`; nothing to install or build | An engine or bundler — adds a toolchain to a project whose appeal is having none | **Locked in** |
| Data URIs count as satisfying "one file" | 2026-08-01 | Unblocks asset-shaped work without breaking the constraint | Treating "one file" as banning all binary-derived content | Cheap |
| Stays a five-minute vignette; **one** ravine | 2026-08-01 | Bounds the vertical addition so it can't drift into a second area | Growing a second area | Cheap now, expensive once built |
| Audience is a portfolio piece | 2026-08-01 | Settles the polish-vs-content tie-break in favour of polish | Treating it as a game for players, which would favour content | Cheap |
| claude-works submission paused | 2026-08-01 | Author's call — settle the project first | Pursuing it now while the game is still changing | Cheap; nothing stranded, the thumbnail is already built |
| Jump physics *derived* from apex + time-to-apex | ~2026-07-13 `[inferred]` | Change design intent and gravity/velocity follow | Hand-set gravity and velocity | Cheap |
| Fixed-timestep 60Hz sim, separate from render | ~2026-07-13 `[inferred]` | Determinism; physics must not vary with frame rate | Physics in the render pass on variable `dt` | Expensive |
| Fractional render scale, not integer pixel-doubling | ~2026-07-14 `[inferred]` | Painterly world should be smooth; crisp-mascot-vs-smooth-world contrast is deliberate | Integer scale — letterboxes more at some sizes | Cheap, with a known cost (finding 4) |
| Gaps are ditches, not pits | 2026-07-28 `[inferred]` | They read as invisible-floored traps on first play | Real pits with death — wrong for a no-combat walk | Cheap |
| Blank level boundary columns in **sky rows only** | 2026-07-28 | Blanking all rows opens a one-tile well at each end and leaves the invisible boundary clingable | Blanking every row (the original, wrong fix) | Cheap |
| All three jump kinds own their `fx` flag and sound | 2026-07-28 | A shared `vy`-threshold detector fired twice on wall jumps and couldn't tell jump kinds apart | Keeping the inferred detector | Cheap |
| Screenshots captured at an integer scale (1536×864 = 3× design space) | 2026-07-29 | Every sprite pixel maps to a clean 3×3 block; fractional scale leaves a ragged outline in a still | Rendering at the target size directly | Cheap |
| Full-colour PNGs, not 256-colour | 2026-07-29 | Quantising shifts 11% of pixels, peak error 51, landing in the dusk gradient the images exist to show | Palette PNGs (334KB smaller) | Cheap |
| OG image URL is absolute | 2026-08-01 | A crawler resolves it against its own host, not the page, so a relative path breaks previews | Relative path | Cheap |
| `CLAUDE.md` in the repo | 2026-07-29 | Response format and verification practices were evaporating each ephemeral session | Restating them every session | Cheap |

## 2.5 Dead ends

- **Blanking boundary columns 0/111 in every `LEVEL` row** — abandoned 2026-07-28. Opens a one-tile-wide, three-tile-deep well at each end, escapable only by a 48px jump against a measured 49.3px apex; and leaves the cling grabbing the invisible boundary, since `solidAt` returns true outside the room while `wallAt` probes `player.x - 1`. Proven by simulation: 6 kick-offs to `y = -41.1` at `x = 0`. **Do not retry** without also adding the room-edge guard in `wallAt`.
- **Inferring "a jump happened" from velocity** (`player.vy < -JUMP_VEL * 0.8 && fx.prevVy >= -JUMP_VEL * 0.8`) — removed 2026-07-28. Double-fired on wall kick-offs and couldn't distinguish ground / wall / air jumps.
- **Driving headless browser tests through the rAF render loop** — abandoned. Headless software rendering runs ~4.5 FPS and the render loop interleaves, making results nondeterministic. Drive the update function synchronously inside `page.evaluate` instead.
- **Placing a cling test subject on a partial-height wall** — abandoned. The player slid onto an adjacent floor tile mid-test and became grounded, silently ending the cling. Use the full-height boundary column.
- **Converting reference GIFs to video for analysis** — rejected 2026-08-01. Video cannot be read at all; GIF frames and their per-frame timing extract directly.

## 2.6 Invariants (do not break)

- **One file; nothing loaded at runtime; must run from `file://`.** Images in `docs/` are documentation and link-preview material, never fetched by the game.
- **Movement constants live in `TUNING`.** Jump physics are derived, not hand-set.
- **Physics stays in the fixed-timestep 60Hz pass.** Never move it into render.
- **The world is bounded by `solidAt`, not by tiles.** Do not add boundary tiles to `LEVEL`.
- **Verify movement changes by simulation and reachability search, not by eye.**
- **Every response ends with a TLDR** — state, recommendation, and why, written as an engineer briefing an executive. Recorded in `CLAUDE.md`.
- **The live URL has a capital C.**

## 2.7 Known issues and debt

- **The abilities have nowhere to matter.** Tallest grabbable faces are three tiles or less; measured cling climb **24.5px net per kick-off**; the double jump clears **85.5px** against a 49.3px single jump, yet a BFS with it enabled stands on **exactly the same nine surface rows** as one without. Both abilities are complete and correct — the level is what's missing. Level design, not a defect. `[unverified: measured in earlier sessions, not re-run today]`
- **Sprite frame timing is a single scalar `fps` per pose set** — `frameIdx = ((player.animTime * fps_) | 0) % set.length` (`index.html:1423`), with `idleFps: 3` and `scuttleFps: 10`. Every frame in a set displays for an identical duration *by construction*, so uneven holds cannot be expressed. This gates all queued animation work. `[verified: read index.html this session]`
- **Audit finding 4 — fractional render scale makes Clawd's pixels uneven.** `S = Math.min(pw / VIEW_W, ph / VIEW_H)` (`index.html:1341`). At S=2.5 the same 1px eye feature rasterises 2 device px wide at one sub-pixel phase and 3 at another, so his eyes change width as he walks. Deliberate trade, open.
- **Audit finding 5 — `devicePixelRatio` is uncapped** (`index.html:1333`). ~12 full-viewport composite passes per frame; on a 4K panel at dpr 2 that is roughly 400 Mpx of fill per frame. A cap of 2 is nearly free but slightly softens HUD text. Open.
- **`updateWisps` runs on variable `dt` from the render pass** rather than the fixed timestep. The smaller audit note with the most teeth. Open.
- **`const screen` shadows the global.** Cosmetic. Open.
- **No LICENSE, no favicon.** Open.
- **Repo carries ~900KB of PNGs** against a 74KB source file. Deliberate — the images exist to show the art, and quantising them would band the dusk gradient.

---

# 3. Open questions for you

1. **Do you accept the four-item definition of "stable"** — (1) the ravine, (2) per-frame sprite durations then an anticipation frame and 2–3 `air` poses, (3) audit findings 4 and 5, (4) the smaller notes — or would you add or cut something? This is the condition you set for unpausing claude-works, so without an answer that pause has no end.
2. **Confirm or reject the proposal of no fail state, no timer or score, no backtracking.** It is recorded as a proposal only; promoting it to an invariant needs your word.
3. **Should the ravine be gated or optional?** i.e. must the player descend it to finish the walk, or is it an optional pocket holding a wisp? This changes whether a player who ignores it can still reach the cottage.

---

# 4. Next actions

1. **Build the ravine.** First because it is the only queued item that changes how the game plays, and it retires the one substantive gap: two headline mechanics a reachability search proves are decorative. Acceptance: a reachability search shows at least one wisp or platform reachable *only* with the cling or the double jump, and the existing 12 wisps + bench + door all remain reachable.
2. **Swap the sprite system's scalar `fps` for per-frame durations,** then add one anticipation frame and take `air` from 1 frame to 3. Acceptance: a pose set can specify per-frame display durations, and `air` cycles rather than freezing.
3. **Audit findings 4 and 5 together** in the resize/draw path. Acceptance: sprite drawn at an integer scale on whole device pixels; `dpr` capped at 2.
4. **The smaller notes** — move `updateWisps` onto the fixed timestep; rename the `screen` shadow; add a LICENSE and a favicon.

---

# 5. Verification ledger

**Ran this session:** headless Chromium boot of `file://index.html` → `state=title, S=3, no page errors` · `curl https://satejp10.github.io/Clawdvania/` → `http 200, 74207b`, matching local `wc -c` · `curl .../docs/thumbnail.png` → `http 200, image/png, 377379b` · counted `og:`/`twitter:` tags on the live page → 15 · `git status --porcelain` → empty · `git rev-list --count 3805010..HEAD` → 4 · `git ls-files` → 8 files · re-parsed `BODY` pose frame counts · grepped current line numbers for every `index.html` citation in this report.

**Read this session:** `index.html` (TUNING, BODY, frame selection, onResize), `CLAUDE.md`, `.claude/context/LOG.md`, `.claude/context/reports/SR-clawdvania-001.md`.

**Not verified:** The measured movement figures — 24.5px cling climb, 85.5px double jump, nine surface rows, 49.3px apex, rise/fall 0.320s/0.245s — come from earlier sessions and `AUDIT.md` and were **not** re-run today; they are tagged `[unverified]` above. Mobile touch controls, the ending sequence, and audio were not exercised this session. Pre-2026-07-28 decision attribution remains `[inferred]` from git subject lines and code comments, since no written log existed before then.

---

# 6. Memory block (for Claude.ai to store)

- Clawdvania is a single-file browser platformer — Clawd the pixel crab walks home at dusk — at https://github.com/Satejp10/Clawdvania, deployed to https://satejp10.github.io/Clawdvania/ (capital C; lowercase 404s).
- Stack: vanilla JavaScript + Canvas 2D in one `index.html`. No engine, no build step, no runtime assets, no tests, no CI. Runs from `file://`.
- Started 2026-07-13; shipped and stable. 19 commits over 7 active days, eight PRs merged.
- Decided: it is a portfolio piece — when polish and content compete, polish wins.
- Decided: it stays a five-minute vignette; the vertical addition is one ravine, not a second area.
- Decided: "one file" is locked but data URIs satisfy it, so asset-shaped work is not blocked.
- Decided: the claude-works submission is paused until the project reaches a stable state. Do not raise it again until the author reopens it.
- Decided: jump physics are derived from an intended apex and time-to-apex, so changing design intent updates gravity and velocity automatically.
- Decided: fixed-timestep 60Hz simulation kept separate from rendering, for determinism.
- Constraint: the world is bounded by code in `solidAt`, never by boundary tiles in `LEVEL`.
- Constraint: movement changes are verified by headless simulation and reachability search, not by playtesting.
- Constraint: every response ends with a TLDR giving state, a recommendation, and the reasoning — recorded in `CLAUDE.md`.
- Do not: blank the level's boundary columns in every row — it opens an inescapable one-tile well and makes the invisible room edge clingable.
- Do not: infer "a jump happened" from velocity crossing a threshold — it double-fires on wall jumps.
- Do not: drive headless browser tests through the rAF render loop — drive the update function synchronously inside `page.evaluate`.
- Do not: convert reference GIFs to video for analysis — video cannot be read; GIF frames and their timing extract directly.
- Known gap: the wall cling and double jump are decorative — a reachability search puts the double jump on exactly the same nine surface rows as no double jump. Level design, not a bug.
- Known limit: sprite frame timing is one scalar fps per pose set, so uneven frame holds cannot be expressed. This gates all queued animation work.
- Proposed, not confirmed: no fail state, no timer or score, no backtracking.
- Next: build the ravine, then per-frame sprite durations.

---

# 7. Appendix

**File inventory:**
- `index.html` — the entire game, 74207 bytes — shipped
- `AUDIT.md` — verified audit; findings 1–3 fixed, 4–5 open — current
- `README.md` — play link, screenshot, controls, feel notes — current
- `CLAUDE.md` — response format, project scope, codebase invariants — current
- `docs/screenshot.png` — README hero, 1536×864 — current
- `docs/thumbnail.png` — link preview + external submission, 1200×750 — current
- `.claude/context/LOG.md` — append-only session log — current
- `.claude/context/reports/` — status reports 001, 002 — current

**Commands:** build *none* · test *none* · run *open `index.html` in a browser* · deploy *push to `main`; GitHub Pages serves it*

**Environment:** No runtime dependencies. Verification tooling used from the container: Node 22, Playwright 1.56.1, Chromium at `/opt/pw-browsers/chromium-1194/`, Python 3 + Pillow. No environment variables required.
