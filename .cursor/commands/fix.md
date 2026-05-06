---
description: FIX — convert SCAN (or CI) findings into smallest safe remediation plan + patches.
---

You are coordinating **/FIX**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | triage | patch | verify | regressions | notes | auto | audit | security | perf | lint`

Workflow:

1. Ingest latest scan/report paths user references (default to most recent under `docs/reports/audit/`).
2. **triage**: Re-rank actionable vs noise; ask only blocking ambiguities.
3. **patch**: Implement minimal diffs per item; preserve public API unless spec allows break.
4. **verify**: Run targeted tests/lint; if unavailable, outline exact commands for user stack.
5. **regressions**: Call out risk zones + follow-up checks.
6. **notes**: Summarize fixes for commit body + optional `CHANGELOG` fragment.

Shorthand routes (same workflow, tighter scope):

- **auto**: Prefer automated fixes (formatter/linter autofix, safe dep bumps) after triage.
- **audit**: Pull aggregate findings from latest `/SCAN all` output then triage → patch.
- **security** / **perf** / **lint**: Scope triage+patch to that class of finding.

Prefer feature branch + `/SAVE commit` messaging.

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/FIX` is treated as `<subcommand>`.
- `help` → Output: "Usage: /FIX <subcommand>\nOptions: help | triage | patch | verify | regressions | notes | auto | audit | security | perf | lint\nExamples:\n/FIX triage\n/FIX verify\nRun without args for default flow."
- `triage` / `patch` / `verify` / `regressions` / `notes` / `auto` / `audit` / `security` / `perf` / `lint` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/FIX triage` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/FIX help` for options."
