# Master Skill Routing Contract

When a slash command or workflow requires a capability, load the matching skill from `.cursor/skills/`.
Skills are SDD-compliant, token-optimized, and enforce hardlocks.
Never execute skills out of sequence. Always validate gates.

## Wave 2 wiring

- Command routing: `slash-command-router`
- Gate validation: `sdd-hardlock-manager`
- Context/token controls: `context-window-manager`, `token-budget-manager`, `context-compressor`
- Output quality loop: `reflection-loop-engine`
- QA safety net: `regression-detector`
- UI/UX pipeline:
  - `user-flow-mapper`
  - `wireframe-to-spec-converter`
  - `design-system-builder`
  - `micro-interaction-designer`

## Command-to-skill intent map

- `/PLAN flow` -> `user-flow-mapper`
- `/PLAN design` -> `wireframe-to-spec-converter` + `design-md`
- `/PLAN system` -> `design-system-builder`
- `/PLAN motion` -> `micro-interaction-designer`
- `/DEVELOP test` -> `regression-detector`
- high-impact final reviews -> `reflection-loop-engine`

