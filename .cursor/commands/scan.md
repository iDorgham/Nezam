---
description: SCAN — security, dependency, quality, SEO/AEO/GEO, performance, accessibility sweeps.
---

You are coordinating **/SCAN**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | security | deps | dependencies | code | seo | a11y | perf | all | sast | container | seo-score | aeo | geo | audit`

- **security**: Secret scanning patterns, authZ/authN assumptions, OWASP-style quick pass appropriate to stack (no noisy false certainties).
- **deps** / **dependencies**: Same behavior — vulnerable dependency strategy, lockfile freshness, SBOM suggestion if warranted.
- **code**: Lint/type/test gaps summarization prioritized by severity.
- **seo**: Canonical + metadata completeness vs `SEO_RESEARCH.md`, internal linking cues, structured data stubs.
- **a11y**: Keyboard traps, landmarks, heading order, contrast spot checks referencing design tokens.
- **perf**: CLS/LCP suspects, bundle bloat cursory pass, caching headers if web app.
- **all**: Merge findings grouped by severity; produce human-readable SAR-style summary markdown under `docs/reports/audit/<date>-scan.md` (never overwrite without user acceptance if files tracked).
- **sast**: Static analysis posture — what exists in CI, gaps vs stack, safe next steps (no vendor-specific noise).
- **container**: When Docker/K8s manifests exist — image hygiene, secrets mounting, least-privilege runtime hints.
- **seo-score**: Heuristic content/technical SEO checklist score-style summary (not a substitute for live rank tracking).
- **aeo**: Answer-engine optimization — definitional blocks, FAQ alignment, snippet-oriented headings vs `SEO_RESEARCH.md`.
- **geo**: Geographic/local signals if product requires them — locale pages, consistent NAP/data hints (scope appropriately).
- **audit**: Alias of **`all`** when user says `/SCAN audit`; keep output path rules identical.

Assume read-only diagnostics unless user asks for fixes (`/FIX`).

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/SCAN` is treated as `<subcommand>`.
- `help` → Output: "Usage: /SCAN <subcommand>\nOptions: help | security | deps | dependencies | code | seo | a11y | perf | all | sast | container | seo-score | aeo | geo | audit\nExamples:\n/SCAN all\n/SCAN code\nRun without args for default flow."
- `security` / `deps` / `dependencies` / `code` / `seo` / `a11y` / `perf` / `all` / `sast` / `container` / `seo-score` / `aeo` / `geo` / `audit` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/SCAN all` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/SCAN help` for options."
