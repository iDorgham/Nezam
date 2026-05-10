# Master Skill Routing Contract

When a slash command or workflow requires a capability, load the matching skill from `.cursor/skills/`.
Skills are SDD-compliant, token-optimized, and enforce hardlocks.
Never execute skills out of sequence. Always validate gates.

## Wave 2 wiring

- Command routing: `slash-command-router`
- Gate validation: `sdd-hardlock-manager`
- Context/token controls: `context-window-manager` (includes Compression Mode), `token-budget-manager`
- Output quality loop: `reflection-loop-engine`
- QA safety net: `regression-detector`
- UI/UX pipeline:
  - `user-flow-mapper`
  - `wireframe-to-spec`
  - `design-tokens` (includes System Build + Frontend Integration modes — archived `design-system-builder`, `frontend-design-pro`)
  - `micro-interaction-designer`

## Command-to-skill intent map

- `/PLAN flow` -> `user-flow-mapper`
- `/PLAN design` -> `wireframe-to-spec` + `design-md`
- `/PLAN system` -> `design-tokens` (System Build Mode)
- `/PLAN motion` -> `micro-interaction-designer`
- `/DEVELOP test` -> `regression-detector`
- high-impact final reviews -> `reflection-loop-engine`

