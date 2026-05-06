---
name: coi-multi-agent-handoff
description: Coordinate deterministic subagent handoffs across COIA SDD phases with explicit context packets and validation gates.
---

# Purpose
Standardize multi-agent orchestration so every handoff has clear scope, dependencies, and verification before advancing phases.

# Inputs
- Current phase and objective.
- Source artifacts: relevant specs, `DESIGN.md`, skill/rule dependencies.
- Blocking constraints and required metrics.

# Step-by-Step Workflow
1. Identify whether the task is single-agent or multi-agent and split by independent domains.
2. Create a handoff packet: objective, allowed files, constraints, expected outputs, validation command.
3. Assign specialized agent based on trigger (`/PLAN design`, component review, motion validation, hardening).
4. Require each subagent output to include findings, changed paths, and unresolved blockers.
5. Run spec-compliance review first, then quality/performance/a11y review.
6. Block phase transitions if validation evidence is missing or failing.
7. Publish final orchestrator summary with next legal command.

# Validation & Metrics
- Every handoff includes explicit acceptance checks.
- No phase skipping across Planning -> SEO/IA -> Content -> DESIGN -> Development -> Hardening.
- Verification evidence attached for all completion claims.
- Parallel tasks avoid overlapping write scope.

# Output Format
- Handoff packet template.
- Review loop status (spec review -> quality review -> gate status).
- Final go/no-go decision with next command.

# Integration Hooks
- `/PLAN all` for staged orchestration.
- `/SCAN` and `/FIX` loops before hardening closure.
- CI checks for gate-state consistency.
