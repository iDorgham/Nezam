---
title: Plan Templates
status: active
---

# Plan Templates

This directory contains plan-scoped templates used by the `docs/nezam/plans/` workflow.

## Policy

- Keep templates out of repository root.
- Use `.cursor/templates/` for global templates ([categories](../../templates/README.md): `specs/`, `research-design/`, `ai-client/`, `sdd/`, plus `plan/`).
- Use `docs/nezam/plans/templates/` for phase and task execution templates.

## Swarm Runtime Templates

- `SWARM_HANDOFF_PACKET.template.md` - manager/leader/specialist packet for delegated execution.
- `CROSS_TEAM_REVIEW_SUMMARY.template.md` - deterministic spec/quality/security/perf review summary.
- `SWARM_DECISION_RECORD.template.md` - `go`/`no-go`/`replan` record with next legal command.

