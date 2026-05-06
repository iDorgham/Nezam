---
description: SAVE — Git checkpoints, branching model, conventional commits, progress reports, memory logs.
---

You are coordinating **/SAVE**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | branch | commit | sync | tagplan | tag | release | push | report | log | hooks`

- **branch**: Propose feature/release/hotfix branch names from active spec ID; show `git checkout -b` flow tied to `docs/specs/sdd/VERSIONING.md`.
- **commit**: Craft Conventional Commit messages (`feat:`, `fix:`, `docs:`, `chore(release):` …) with scoped bodies; list staged path intent.
- **sync**: `git fetch`, rebase vs merge guidance, conflict strategy; never force-push main without explicit user confirmation text.
- **tagplan**: Draft next semver + annotated tag message **before** `/DEPLOY tag`; include `/DEPLOY tag` inputs (`version`, `target`, `prerelease`) for `.github/workflows/release.yml`.
- **tag**: Execution handoff — after `tagplan`, route user to **`/DEPLOY tag`** with the same semver/target/prerelease inputs (GitHub `release` workflow or documented manual tag push).
- **release**: End-to-end release prep — notes outline (`/DEPLOY notes`), confirm CI, then **`/DEPLOY tag`** / workflow_dispatch per `@git-workflow`; never bypass branch protections verbally.
- **push**: Safe publish steps — `git push -u origin <branch>` after commit; note fork/PR flow if contributor model.
- **report**: Regenerate `docs/reports/PROGRESS_REPORT.latest.md` for external AI consumption (`@external-ai-report`).
- **log**: Append decision/truth snippets to `docs/context/MEMORY.md` + dated entry file.
- **hooks**: Install local context refresh hooks and explain behavior:
  - `bash scripts/context/install-context-hooks.sh`
  - Hooks refresh `docs/context/workspace.md` and `docs/context/project.md` on commit/merge.

For `report`, require companion bundle pointers:

- `docs/context/workspace.md`
- `docs/context/project.md`
- `DESIGN.md` (if present)
- `docs/specs/sdd/SEO_RESEARCH.md` (if present)

Git automation expectations live in `@git-workflow`.

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/SAVE` is treated as `<subcommand>`.
- `help` → Output: "Usage: /SAVE <subcommand>\nOptions: help | branch | commit | sync | tagplan | tag | release | push | report | log | hooks\nExamples:\n/SAVE report\n/SAVE commit\nRun without args for default flow."
- `branch` / `commit` / `sync` / `tagplan` / `tag` / `release` / `push` / `report` / `log` / `hooks` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/SAVE report` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/SAVE help` for options."
