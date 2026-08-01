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
