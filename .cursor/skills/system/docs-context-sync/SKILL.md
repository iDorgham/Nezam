---
name: coi-docs-context-sync
description: Deterministic documentation lifecycle workflow for syncing context docs, workspace index, and plan artifacts after repository changes.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose
Keep `docs/workspace/context/`, `WORKSPACE_INDEX.md`, and `docs/workspace/plans/` artifacts synchronized so project memory and navigation remain current across SDD phases.

# Inputs
- Changed file list from current branch.
- `docs/workspace/context/` files (`CONTEXT.md`, `MEMORY.md`, `WORKSPACE_INDEX.md`, `MEMORY_ARCHITECTURE.md`).
- Plan artifacts (`docs/workspace/plans/INDEX.md`, phase `TASKS.md` files).
- Maintenance script: `scripts/context/update-context-docs.py`.

# Step-by-Step Workflow
1. Identify docs-impacting changes (new commands, skills, agents, workflows, scripts, structural moves).
2. Update `docs/workspace/context/WORKSPACE_INDEX.md` tables and references for added/removed capabilities.
3. Refresh `docs/workspace/context/CONTEXT.md` and `docs/workspace/context/MEMORY_ARCHITECTURE.md` summaries for current scope and state.
4. Log durable decisions and milestones in `docs/workspace/context/MEMORY.md`.
5. Sync active execution metadata in `docs/workspace/plans/INDEX.md` and related phase task boards.
6. Run context maintenance script if available:
   - `python scripts/context/update-context-docs.py`
7. Run `/SCAN docs` to detect stale links, missing references, or outdated sections.
8. Apply `/FIX docs` for any drift found during scan.
9. Close with `/SAVE log` including what changed and why.

# Validation & Metrics
- Context freshness score (all touched capabilities indexed and referenced).
- Link integrity pass rate in updated docs.
- Plan-state accuracy (index reflects current task status).
- Memory update completeness (major decisions logged).

# Output Format
- Updated `docs/workspace/context/*` files and `docs/workspace/plans/INDEX.md` changes.
- Doc sync report: changed files, reason, verification results.
- Outstanding documentation debt list with owner.

# Integration Hooks
- Trigger after `/DEVELOP`, `/SCAN`, and `/FIX` when artifacts change.
- Required before `/SAVE` when tooling/workflow/docs were modified.
- Optional CI doc-check job can enforce link and index integrity.

# Anti-Patterns
- Merging workflow/tool changes without updating index/context docs.
- Treating session chat as durable memory without writing docs.
- Updating memory/index without verifying changed file reality.
- Leaving plan state stale after major fixes.

# External Reference
- [Diataxis documentation framework](https://diataxis.fr/)
- [GitHub Docs style and structure guidance](https://docs.github.com/en/contributing/writing-for-github-docs/style-guide-and-content-model/style-guide)
