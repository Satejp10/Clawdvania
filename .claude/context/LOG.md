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
