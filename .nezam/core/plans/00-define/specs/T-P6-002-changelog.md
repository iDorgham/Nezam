---
spec_id: SPEC-SHIP-002
feature: Finalize CHANGELOG for the 0.2.0 release
status: approved
spec_version: 0.1.0
phase: phase_6
owner: docs-hygiene
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: CHANGELOG.md gains a [0.2.0] - 2026-06-03 entry summarizing phases 3–5 under Added/Changed/Fixed/Security, following Keep a Changelog + SemVer (minor bump from 0.1.0).
  - id: AC-002
    description: The [Unreleased] section is reset to empty Added/Changed/Fixed/Security scaffolding above the new version entry.
  - id: AC-003
    description: The entry references the governing specs (SPEC-QA-*, SPEC-AX/PERF/UX-*, SPEC-SEC-*) and the dependency-audit report for traceability.
---

# T-P6-002 — Finalize CHANGELOG

## Context
The Phase 3–5 work is ready to be versioned. A `0.2.0` entry (minor — new test infra, modules,
UX states, hardening; backward compatible) finalizes the changelog ahead of a tag.

## Target files
- `CHANGELOG.md`

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | 0.2.0 entry added | CHANGELOG.md |
| AC-002 | Unreleased reset | CHANGELOG.md |
| AC-003 | spec references | CHANGELOG.md |
