---
name: "nezam-reflection-loop-engine"
description: Run bounded self-review loops to reduce mistakes before finalizing outputs.
version: 1.0.0
updated: 2026-05-08
changelog: []
---
# Reflection Loop Engine

Use for non-trivial outputs (plans, gate decisions, cross-domain changes, high-impact recommendations).

## Loop contract

- Max loops: 3
- Exit early if no material improvement
- Track confidence and unresolved risks each loop

## Loop steps

1. Check requirement alignment (did we solve the requested outcome?).
2. Check policy alignment (hardlocks, sequencing, constraints).
3. Check correctness/completeness gaps.
4. Revise output.
5. Re-score confidence.

## Output contract

```yaml
loop_count: 1
confidence: 0.0-1.0
issues_found:
  - "issue"
issues_fixed:
  - "fix"
residual_risks:
  - "risk"
```

## Core rules

- Do not claim completion with unresolved critical risks.
- Prefer concrete fixes over generic caveats.
- Keep confidence justified by evidence, not optimism.

## Dependencies

- `context-window-manager` (includes Compression Mode — former `context-compressor`)

