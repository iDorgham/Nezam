---
name: sdd-hardlock-manager
description: Validate SDD phase gates and block unsafe progression before plan/develop/test/release actions.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# SDD Hardlock Manager

Use this skill when a command can move project state (`/start`, `/plan`, `/develop`, `/test`, `/release`, phase transitions).

## Purpose

Provide one deterministic gate decision:
- `pass`
- `blocked`
- `replan-required`

## Required checks

Validate against workspace hardlocks before any implementation-oriented action:

1. Required project artifacts exist and are non-placeholder.
2. Planning-to-development sequencing is respected.
3. Active plan prompt artifacts are present where required.
4. Design prerequisite is satisfied (`DESIGN.md` or legacy path per rules).
5. Gate matrix source exists and is readable.

If any required check fails, return `blocked` with explicit unlock steps in strict order.

## Output contract

Return:

```yaml
gate_status: pass|blocked|replan-required
blocking_reasons:
  - "human-readable reason"
unlock_steps:
  - "ordered remediation step"
next_legal_command: "/START ... | /PLAN ... | /GUIDE ..."
```

## Core rules

- Never bypass hardlocks.
- Never silently downgrade a failing gate to warning.
- Keep unlock steps copy-ready and minimal.
- Prefer existing workspace rules over ad-hoc interpretations.

## Dependencies

- `slash-command-router`
- workspace rules under `.cursor/rules/*.mdc`

