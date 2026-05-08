# Workspace AI Instructions

This file is generated from `.cursor/` governance.

## Canonical source of truth

- Commands: `.cursor/commands/`
- Agents: `.cursor/agents/`
- Skills: `.cursor/skills/`
- Rules: `.cursor/rules/`

Do not edit generated per-tool files directly.
Update `.cursor/` and run `pnpm ai:sync`.

## Core pipeline

Planning -> SEO -> IA -> Content -> Design (`docs/DESIGN.md`) -> Development -> Hardening -> Ship.

## SDD hardlock

Do not proceed to development unless all exist:

- `docs/core/required/prd/PRD.md`
- `docs/core/required/PROJECT_PROMPT.md`
- `docs/DESIGN.md` (UI scopes)
- `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`
- `docs/workspace/plans/<phase>/<subphase>/{prompt.json,PROMPT.md}`

## Learned User Preferences

- When implementing an attached plan, do not modify the plan file; reuse existing todo items and advance them from in_progress through completed in order instead of recreating them.
- For plan-driven execution, stay within stated scope and constraints, run verification steps the plan lists, and finish with a concise change report that includes touched files and verification outputs.
- For high-impact AI releases, default mandatory approvers to CTO or engineering head, legal or compliance, responsible AI or ethics lead, and security or privacy lead unless the user supplies a different sign-off map.
- When changing agents, commands, rules, or skills, edit `.cursor/` as canonical and run `pnpm ai:sync`; avoid hand-editing generated mirrors for those assets.
- When expanding swarm-style orchestration in this repo, align leadership with PM-01, ARCH-01, DESIGN-01, FE-01, and BE-01 as the primary authorities over specialist agents.

## Learned Workspace Facts

- Concrete execution plans are commonly referenced from `.cursor/plans/` (for example `*.plan.md`) as a source of truth alongside `docs/workspace/plans/`.
- AI ethics audit outputs and companion operational templates belong under `docs/reports/audits/` per the docs reports placement policy.
