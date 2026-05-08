# SWARM_TASK

Use this template to open a multi-agent UI/UX swarm task with unambiguous routing and constraints.

## Metadata

- taskId: `uiux-<date>-<slug>`
- priority: `p0|p1|p2|p3`
- ownerTeam: `PM|ARCH|DESIGN|FE|BE`
- manager: `PM-01-Swarm-Leader`
- accountable: `ARCH-01-Project-Architect`
- requiredSkills:
  - `slash-command-router`
  - `sdd-hardlock-manager`
  - `design-system-builder`
- appliedRules:
  - `workspace-orchestration.mdc`
  - `design-dev-gates.mdc`
  - `coia-design-gates-pro.mdc`
  - `docs-reports-policy.mdc`

## RACI

- Responsible: `PM-01-Swarm-Leader`
- Accountable: `ARCH-01-Project-Architect`
- Consulted: `DESIGN-01-UIUX-Lead`, `FE-01-Frontend-Lead`, `BE-01-Backend-Lead`
- Informed: assigned specialist lanes

## Objective

Describe the target outcome in one paragraph.

## Scope

- In-scope:
  - <item>
- Out-of-scope:
  - <item>

## Dependencies

- docs/spec dependencies:
  - <path>
- runtime/data dependencies:
  - <item>
- blocked-by:
  - <item>

## Library + Design System context

- selectedLibrary: `<name>`
- selectedDesignSystem: `<name>`
- rationale: `<brief>`

## Color and theme context

- tokenSource: `<path>`
- themeMode: `light|dark|both`
- rtlRequired: `true|false`

## Content constraints

- contentSpecRequired: `true|false`
- minWords: `<n>`
- maxWords: `<n>`
- tone: `professional|friendly|technical|marketing|neutral`

## Deliverables

- `LIBRARY_DS_MAP`
- `COLOR_SYNC_REPORT`
- `SWARM_HANDOFF`
- optional component content payloads

## Agent pass output contract

Each pass must include:

1. Agent Name & Focus
2. Files Modified
3. Code/Content Diffs
4. Rationale & Skills Applied
5. Validation Results
6. Next Agent Trigger
