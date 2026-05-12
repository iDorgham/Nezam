# Plan Templates

This folder provides reusable plan-construction references for new projects.

Use:

- `PLAN_CONSTRUCTION_GUIDE.md` for the full methodology and phase rules.
- `PHASE_TEMPLATE.md` to scaffold each phase.
- `SUBPHASE_TEMPLATE.md` to scaffold each sub-phase under a phase.
- `PROMPT_SCHEMA.template.json` for required `prompt.json` metadata.
- `SPEC_PROMPT.template.md` and `SUBPHASE_PROMPT.template.md` for copy-ready prompt artifacts.
- `GITHUB_GATE_MATRIX_SCHEMA.template.json` and GitHub gate checklist templates for hardlock enforcement.

Non-negotiable default phase order:

1. SEO, Menus, Content Creation
2. UI/UX Design
3. Development

Sub-phases are intentionally flexible and should be derived from:

- `docs/prd/PROJECT_PROMPT.md`
- `docs/specs/prd/PRD.md`
- active planning constraints and risk profile

## Mandatory Prompt Artifacts Per Sub-Phase

Each `docs/workspace/plans/<phase>/<sub-phase>/` directory must include:

1. `prompt.json` (structured artifact using `PROMPT_SCHEMA.template.json`)
2. `PROMPT.md` (copy-ready prompt using `SUBPHASE_PROMPT.template.md`)

`/DEVELOP` remains hardlocked until every active sub-phase has both artifacts.

## Gate Manifest Source of Truth

Use `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json` as the canonical gate contract for:

- start/end gate checks
- pre-merge and post-merge responsibilities
- silent automation taxonomy + severity/SLA handling
- nightly automation self-test and bypass-ban rules
