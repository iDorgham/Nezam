---
name: "nezam-gate-orchestrator"
description: Unified Gate Orchestrator for NEZAM. Validates SDD phase gates, checks hardlocks, and blocks unsafe progression with aggressive refusal templates. Replaces sdd-gate-validator and sdd-hardlock-manager.
version: 2.0.0
updated: 2026-05-12
changelog:
  - 2.0.0: Merged sdd-gate-validator and sdd-hardlock-manager. Added aggressive refusal blocks.
---

# Gate Orchestrator Skill

## Purpose

The **Gate Orchestrator** is the single authoritative source for validating phase transitions, hardlocks, and state integrity across the workspace. It enforces the SDD pipeline by checking YAML states (`onboarding.yaml`, `plan_progress.yaml`, `develop_phases.yaml`, `HANDOFF_QUEUE.yaml`) and physically blocking development actions if preconditions are not met.

Every `/plan`, `/develop`, `/test`, `/release`, or `/check` command MUST route through this orchestrator before executing any implementation work.

## Pre-Gate: State File Validation

Before running any gate check, validate that the required state files exist and are parseable.
If any file is missing or unparseable, output a `STATE_ERROR` and halt immediately. Do not guess or hallucinate states.

```yaml
Required state files:
  - .cursor/state/onboarding.yaml     (required for gates 0→1 and up)
  - .cursor/state/plan_progress.yaml  (required for gate 1→2)
  - .cursor/state/develop_phases.yaml (required for gates N→N+1 and 5→6)
  - .cursor/state/HANDOFF_QUEUE.yaml  (required to verify session integrity)
```

On `STATE_ERROR`:
```text
❌ State file missing or corrupt: [filename]
→ Run: /FIX gates to attempt remediation.
→ Or restore from: .cursor/state/schemas/[filename without .yaml].schema.yaml defaults.
```

If a YAML file fails to parse:
1. Back up the corrupt file as `<filename>.bak`
2. Restore from schema defaults.
3. Warn the user that progress state was reset and must be re-verified.

## Hardlock Rules

Validate against workspace hardlocks before any implementation-oriented action:
1. Required project artifacts exist and are non-placeholder (`PRD.md`, `DESIGN.md`).
2. Planning-to-development sequencing is strictly respected.
3. Active plan prompt artifacts are present where required.
4. Gate matrix source (`GITHUB_GATE_MATRIX.json` or similar) exists and is readable.

**Aggressive Blocking & Refusal:**
If ANY check fails, you MUST refuse the operation using the explicit refusal template. Never bypass a hardlock or silently downgrade to a warning.

### Refusal Template
Use this exact language when refusing a prompt due to a gate violation:
> **HARDLOCK VIOLATION:** [Phase/Command] blocked. 
> **Missing:** [Specific file / YAML flag]. 
> **Required gate:** [Gate name]. 
> Run `/CHECK` for details or `/FIX gates` to attempt remediation.

## Gate Definitions

### Pre-Check: Handoff Queue
- [ ] `HANDOFF_QUEUE.yaml` does not contain any items with `status: pending` or `status: in_progress`. (Must be resolved or deferred).

### Gate 0 → 1: Onboarding → Planning
- [ ] `docs/prd/PRD.md` exists and >10 non-comment lines.
- [ ] `DESIGN.md` exists at repo root and is not a blank template.
- [ ] `.cursor/state/onboarding.yaml` → `prd_locked: true`
- [ ] `.cursor/state/onboarding.yaml` → `design_locked: true`

### Gate 1 → 2: Planning → Development
- [ ] `.cursor/state/plan_progress.yaml` → `planning_complete: true`
- [ ] All 6 plan artifacts exist (SEO, IA, Content, Arch, Design Choices/Wireframes, Scaffold).

### Gate N → N+1: Development Phase Transitions
- [ ] All tasks in `MASTER_TASKS.md` tagged `[phase_N]` have status: done.
- [ ] `/CHECK output` returns score ≥ 70%.
- [ ] Zero hardcoded design values (px literals, hex colors).
- [ ] `.cursor/state/develop_phases.yaml` → `phase_N.testing_passed: true`

### Gate 5 → 6: Hardening → Ship
- [ ] `docs/reports/security/SECURITY_AUDIT.md` exists and passes.
- [ ] Performance and A11Y audits exist and pass.

## Output Format

Return this structure upon execution:

```yaml
gate_status: pass|blocked|replan-required
blocking_reasons:
  - "Missing: docs/prd/PRD.md"
unlock_steps:
  - "Run /START to generate PRD"
next_legal_command: "/CHECK or /FIX gates"
```

If the result is `blocked`, prefix the output with the **HARDLOCK VIOLATION** refusal template shown above.
