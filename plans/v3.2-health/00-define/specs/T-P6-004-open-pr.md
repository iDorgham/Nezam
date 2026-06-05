---
spec_id: SPEC-SHIP-004
feature: Open a pull request for the phase 4-5 branch
status: approved
spec_version: 0.1.0
phase: phase_6
owner: ci-automation
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: A pull request is opened via gh from feature/phase4-5-hardening-polish into Master with a title and body summarizing phases 3–5 and linking the readiness + dependency-audit reports.
  - id: AC-002
    description: The PR body lists the verification evidence (180 tests, type-check clean, a11y gate) and the known caveats (postcss CVE remediation pending, no live deploy).
  - id: AC-003
    description: The PR is a review artifact only — merging and any subsequent deploy remain explicit human-gated actions.
---

# T-P6-004 — Open PR

## Context
The Phase 4–5 commits are pushed. Opening a PR gives a reviewable surface (and a target for
`/code-review ultra`) before any merge/deploy decision.

## Target files
- GitHub PR (no repo files) — created with `gh pr create`.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | PR opened | GitHub |
| AC-002 | evidence + caveats | PR body |
| AC-003 | human-gated merge/deploy | process |
