# SWARM_HANDOFF

Use this template for deterministic handoff between leadership/specialist lanes.

## Metadata

- handoffId: `handoff-<date>-<slug>`
- fromLane: `<team|agent>`
- toLane: `<team|agent>`
- ownerTeam: `PM|ARCH|DESIGN|FE|BE`
- requiredSkills:
  - `context-window-manager`
  - `regression-detector`
- appliedRules:
  - `workspace-orchestration.mdc`
  - `design-dev-gates.mdc`

## RACI

- Responsible: receiving lane owner (`DESIGN-01` or `FE-01` default for UI)
- Accountable: `PM-01-Swarm-Leader`
- Consulted: `ARCH-01-Project-Architect`
- Informed: leadership roles and affected specialists

## Context summary

- objective: `<summary>`
- current-state: `<summary>`
- blockers: `<list>`

## Inputs

- files:
  - `<path>`
- decisions:
  - `<decision>`
- unresolved:
  - `<item>`

## Required actions for receiving lane

1. <action>
2. <action>

## Validation requirements

- [ ] Rule/hardlock compliance reconfirmed
- [ ] Token/theme/RTL constraints preserved
- [ ] Content constraints preserved (`minWords`/`maxWords`, tone, a11y context)
- [ ] Regression impact reviewed

## Output required from receiver

- DIFF
- RATIONALE
- VALIDATION
- NEXT_TRIGGER
