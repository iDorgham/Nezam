---
description: SCAN — security, dependency, quality, SEO/AEO/GEO, performance, accessibility sweeps.
---

You are coordinating **/SCAN**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | security | deps | dependencies | code | seo | a11y | perf | all | sast | container | seo-score | aeo | geo | audit`

- **security**: Secret scanning patterns, authZ/authN assumptions, OWASP-style quick pass appropriate to stack (no noisy false certainties). Write findings to `docs/reports/security/scan-security-<YYYYMMDD>-<HHMM>.md`.
- **deps** / **dependencies**: Same behavior — vulnerable dependency strategy, lockfile freshness, SBOM suggestion if warranted. Write to `docs/reports/security/scan-deps-<YYYYMMDD>-<HHMM>.md`.
- **code**: Lint/type/test gaps summarization prioritized by severity. Write to `docs/reports/tests/scan-code-<YYYYMMDD>-<HHMM>.md`.
- **seo**: Canonical + metadata completeness vs `SEO_RESEARCH.md`, internal linking cues, structured data stubs. Write to `docs/reports/audits/scan-seo-<YYYYMMDD>-<HHMM>.md`.
- **a11y**: Keyboard traps, landmarks, heading order, contrast spot checks referencing design tokens. Write to `docs/reports/a11y/scan-a11y-<YYYYMMDD>-<HHMM>.md`.
- **perf**: CLS/LCP suspects, bundle bloat cursory pass, caching headers if web app. Write to `docs/reports/perf/scan-perf-<YYYYMMDD>-<HHMM>.md`.
- **all**: Merge findings grouped by severity; produce human-readable SAR-style summary markdown under `docs/reports/audits/scan-all-<YYYYMMDD>-<HHMM>.md` (never overwrite without user acceptance if files tracked).
  - After `/SCAN all`, regenerate root `HEALTH.md` using `@coi-health-score` and include a short plain-language score summary in the response.
- **sast**: Static analysis posture — what exists in CI, gaps vs stack, safe next steps (no vendor-specific noise). Write to `docs/reports/security/scan-sast-<YYYYMMDD>-<HHMM>.md`.
- **container**: When Docker/K8s manifests exist — image hygiene, secrets mounting, least-privilege runtime hints. Write to `docs/reports/security/scan-container-<YYYYMMDD>-<HHMM>.md`.
- **seo-score**: Heuristic content/technical SEO checklist score-style summary (not a substitute for live rank tracking). Write to `docs/reports/lighthouse/scan-seo-score-<YYYYMMDD>-<HHMM>.md`.
- **aeo**: Answer-engine optimization — definitional blocks, FAQ alignment, snippet-oriented headings vs `SEO_RESEARCH.md`. Write to `docs/reports/audits/scan-aeo-<YYYYMMDD>-<HHMM>.md`.
- **geo**: Geographic/local signals if product requires them — locale pages, consistent NAP/data hints (scope appropriately). Write to `docs/reports/audits/scan-geo-<YYYYMMDD>-<HHMM>.md`.
- **audit**: Alias of **`all`** when user says `/SCAN audit`; keep output path rules identical (`docs/reports/audits/`).

Assume read-only diagnostics unless user asks for fixes (`/FIX`).

## Team-runtime routing

Map scan ownership to fixed teams:
- Security and cybersecurity scans -> `security` leader with `devops` and `qa` specialists.
- Code, a11y, and perf scans -> `qa` or `tech-lead` leader with FE/BE specialists.
- SEO/AEO/GEO scans -> `seo` leader with `content` and `designer` specialists.

For multi-domain audits, surface manager/leader/specialist ownership in findings and include `go` or `no-go` or `replan` recommendation with next legal command.

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/SCAN` is treated as `<subcommand>`.
- `help` → Output: "Usage: /SCAN <subcommand>\nOptions: help | security | deps | dependencies | code | seo | a11y | perf | all | sast | container | seo-score | aeo | geo | audit\nExamples:\n/SCAN all\n/SCAN code\nRun without args for default flow."
- `security` / `deps` / `dependencies` / `code` / `seo` / `a11y` / `perf` / `all` / `sast` / `container` / `seo-score` / `aeo` / `geo` / `audit` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/SCAN all` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/SCAN help` for options."
