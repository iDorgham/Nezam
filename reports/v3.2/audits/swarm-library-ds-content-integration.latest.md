# Swarm Library/DS/Content Integration Audit

Date: 2026-05-08

## Scope

Integrated the extended swarm prompt into canonical `.cursor` governance and added reusable UI/UX swarm artifacts aligned with leadership teams, specialist lanes, skills, and existing hardlock rules.

## Implemented changes

### Canonical governance rule

- Added `.cursor/rules/ui-ux-swarm-library-ds-content.mdc`
- Coverage includes:
  - leadership delegation model (`PM-01`, `ARCH-01`, `DESIGN-01`, `FE-01`, `BE-01`)
  - dynamic stack/library/design-system lookup protocol
  - content bridge/creator schema and guardrails
  - color/theme synchronization requirements
  - quality gates and rule-precedence constraints

### Swarm artifact templates

Added under `.nezam/workspace/templates/ui-ux/`:

- `SWARM_TASK.template.md`
- `SWARM_HANDOFF.template.md`
- `LIBRARY_DS_MAP.template.md`
- `COLOR_SYNC_REPORT.template.md`
- `SWARM_COMPLETE.template.md`

All templates include:

- strict RACI ownership alignment
- required metadata: `ownerTeam`, `requiredSkills`, `appliedRules`
- execution output structure: `DIFF`, `RATIONALE`, `VALIDATION`, `NEXT_TRIGGER`

### Command guidance updates

- Updated `.cursor/commands/plan.md`
  - added library/design-system/content swarm planning extension
  - added fallback routing behavior for inconclusive stack detection
- Updated `.cursor/commands/develop.md`
  - added swarm execution contract
  - added content pipeline sequencing and validation requirements
  - added `SWARM_COMPLETE` closure requirement

### Template index updates

- Updated `.nezam/workspace/templates/README.md`
  - `ui-ux` category description now includes swarm execution artifacts
  - added explicit list of new swarm templates and required metadata conventions

## Rule coverage matrix

- Prompt orchestration and role model -> `.cursor/rules/ui-ux-swarm-library-ds-content.mdc`
- RACI and ownership clarity -> `SWARM_*` / `LIBRARY_DS_MAP` / `COLOR_SYNC_REPORT` templates
- ContentSpec and word-limit constraints -> swarm rule + `SWARM_TASK` / `SWARM_COMPLETE` templates
- Color sync/contrast/rtl checks -> swarm rule + `COLOR_SYNC_REPORT.template.md`
- Agent output contract (`DIFF/RATIONALE/VALIDATION/NEXT_TRIGGER`) -> `SWARM_TASK` and `SWARM_HANDOFF` templates

## Swarm-team alignment status

- PM lane: covered
- ARCH lane: covered
- DESIGN lane: covered
- FE lane: covered
- BE lane: covered
- Specialist lanes: covered via required skills/rules metadata

## Validation steps

Run:

1. `pnpm ai:sync`
2. `pnpm ai:check`
3. Confirm report-output policy:
   - generated artifacts remain under `docs/reports/**`
4. Spot-check templates:
   - ownership metadata present
   - required skills/rules fields present
   - output contract fields present

## Remaining optional follow-ups

- Add `/CREATE` subcommand mappings for these swarm templates if you want first-class command generation.
- Add a dedicated short guide in `.nezam/workspace/` for common swarm runbooks and examples.
