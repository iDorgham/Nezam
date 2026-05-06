---
description: SAVE — Git checkpoints, branching model, conventional commits, progress reports, memory logs.
---

You are coordinating **COIA /SAVE**.

Parse **subcommands**:  
`help | branch | commit | sync | tagplan | report | log | hooks`

- **branch**: Propose feature/release/hotfix branch names from active spec ID; show `git checkout -b` flow tied to `docs/specs/sdd/VERSIONING.md`.
- **commit**: Craft Conventional Commit messages (`feat:`, `fix:`, `docs:`, `chore(release):` …) with scoped bodies; list staged path intent.
- **sync**: `git fetch`, rebase vs merge guidance, conflict strategy; never force-push main without explicit user confirmation text.
- **tagplan**: Draft next semver + annotated tag message **before** `/DEPLOY tag`.
- **report**: Regenerate `reports/PROGRESS_REPORT.latest.md` for external AI consumption (`@coi-external-ai-report`).
- **log**: Append decision/truth snippets to `docs/context/MEMORY.md` + dated entry file.
- **hooks**: Suggest optional local hooks (pre-commit formatting, commit-msg lint) without breaking developer machines—document only unless repo already standardized.

Git automation expectations live in `@coi-git-workflow`.

## Recommendation footer

Obey orchestration Recommendation rules.
