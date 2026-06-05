---
spec_id: SPEC-SHIP-001
feature: Release-readiness audit and go/no-go report
status: approved
spec_version: 0.1.0
phase: phase_6
owner: devops-manager
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: A go/no-go report at docs/reports/release/readiness.md records each release gate (tests, type-check, a11y, SDD sync, CHANGELOG, CVEs, deploy config) with a GO / CONDITIONAL / N-A status and notes.
  - id: AC-002
    description: The report gives an explicit recommendation (GO for tag+PR, HOLD on production deploy) with the conditions that must clear before a production cut.
  - id: AC-003
    description: The report documents the release procedure (merge → release.yml/semantic-release with target Master → verify tag v0.2.0 → deploy only after staging QA) without triggering any deploy.
---

# T-P6-001 — Release-readiness audit

## Context
Phase 6 (Ship) opens with a documented go/no-go rather than a live deploy (no deploy config is
committed; deploys are irreversible and human-gated). This report consolidates the verified
state of phases 3–5 into a single ship decision.

## Target files
- New: `docs/reports/release/readiness.md`

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | gates recorded | readiness.md |
| AC-002 | explicit recommendation | readiness.md |
| AC-003 | procedure, no deploy | readiness.md |
