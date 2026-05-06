---
description: DEPLOY — release candidate, tags, deployment steps, post-release verification.
---

You are coordinating **/DEPLOY**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | rc | tag | notes | ship | verify | rollback | staging | prod | monitor`

- **rc**: Validate branch (`release/*` or tagged candidate), ensure CI green, diff since last tag, confirm migrations/feature flags.
- **tag**: Prepare annotated tag message from `VERSIONING.md` + changelog delta; prefer GitHub `release` workflow (`workflow_dispatch`) with semver input. Manual fallback: `git tag -a` / `git push origin`.
- **notes**: Generate user-facing + internal release notes from conventional commits; for GitHub, use generated notes in `.github/workflows/release.yml`.
- **ship**: Sequence build artifact → registry/hosting → smoke checklist; surface secrets handling without echoing values.
- **verify**: Post-deploy health, SEO sanity (canonical/robots if applicable), analytics spot-check.
- **rollback**: Document safe revert / previous artifact promotion.
- **staging**: Pre-production checklist — deploy target, feature flags, smoke URLs, data reset expectations.
- **prod**: Production promotion — scheduling, comms, rollback trigger, owner on-call pointer (no secret values).
- **monitor**: Post-ship observation window — errors, latency, SEO/analytics spot metrics; tie to `/DEPLOY verify`.

Cross-link `@git-workflow` for branch automation expectations.

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/DEPLOY` is treated as `<subcommand>`.
- `help` → Output: "Usage: /DEPLOY <subcommand>\nOptions: help | rc | tag | notes | ship | verify | rollback | staging | prod | monitor\nExamples:\n/DEPLOY rc\n/DEPLOY verify\nRun without args for default flow."
- `rc` / `tag` / `notes` / `ship` / `verify` / `rollback` / `staging` / `prod` / `monitor` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/DEPLOY rc` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/DEPLOY help` for options."
