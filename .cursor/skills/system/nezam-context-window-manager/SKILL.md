---
name: "nezam-context-window-manager"
description: Build the minimal high-signal working context for each command/session.
version: 1.0.0
updated: 2026-05-08
changelog: []
---
# Context Window Manager

Use at session start, before heavy planning, and before complex multi-domain execution.

## Objective

Assemble a compact, high-signal context window that keeps:
- active objective
- governing constraints
- current phase/gates
- immediate files and validation commands

## Procedure

1. Load current objective and phase.
2. Pull governing rules and command contract.
3. Include only files directly tied to current step.
4. Attach cached summaries for previously completed analysis.
5. Emit a compact working-context manifest.

## Output contract

```yaml
objective: "current objective"
phase: "current phase"
must_keep:
  - "critical item"
nice_to_have:
  - "secondary item"
deferred:
  - "not needed now"
```

## Core rules

- Always keep hardlock and acceptance criteria in window.
- Defer unrelated domain context.
- Prefer machine-checkable lists over prose-heavy summaries.

## Dependencies

- `token-budget-manager`

## Compression Mode

> Merged from archived `context-compressor`: compress completed work into durable summaries without losing decisions.

Use on phase boundaries, handoffs, and before long or repeated workflows.

### Purpose

Convert verbose session state into compact, reusable artifacts without losing key decisions.

### Compression template

Capture:

1. Goal and scope completed.
2. Decisions made and rationale.
3. Files or artifacts changed.
4. Validation evidence.
5. Remaining risks and next legal command.

### Output contract

```yaml
summary_scope: "phase or feature"
decisions:
  - decision: "what"
    why: "rationale"
evidence:
  - "test/check/report reference"
next_step: "single next action"
```

### Compression rules

- Preserve decisions; prune narration.
- Keep unresolved blockers explicit.
- Write summaries in actionable language.
- Prefer appending to `docs/reports/**` progress paths over ad-hoc notes.

### Dependencies

- Reporting paths under `docs/reports/**`

