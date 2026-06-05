---
spec_id: SPEC-SHIP-003
feature: Fix release tooling to target the real default branch
status: approved
spec_version: 0.1.0
phase: phase_6
owner: gitops-engineer
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: release.config.cjs `branches` is set to ['Master'] (the repo's actual default branch per origin/HEAD), not ['main'], so semantic-release does not no-op.
  - id: AC-002
    description: .github/workflows/release.yml workflow_dispatch `target` input defaults to 'Master' instead of 'main' so manual release cuts tag the correct branch.
  - id: AC-003
    description: No untrusted input is interpolated into workflow run steps as part of this change (static default value only).
---

# T-P6-003 — Release branch fix

## Context
`release.config.cjs` targeted `branches: ['main']` and `release.yml` defaulted `target: main`,
but the repository default branch is `Master` (no `main` branch exists). Left unfixed,
semantic-release would no-op and manual cuts would fail to resolve the target.

## Target files
- `release.config.cjs`
- `.github/workflows/release.yml`

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | semantic-release branch | release.config.cjs |
| AC-002 | manual cut target | release.yml |
| AC-003 | no injection introduced | release.yml |
