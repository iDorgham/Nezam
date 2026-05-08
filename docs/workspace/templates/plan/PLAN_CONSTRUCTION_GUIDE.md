# Plan Construction Guide

Use this guide as the canonical reference for creating project plans.  
It defines a stable top-level phase order while allowing sub-phases to change per project.

## Inputs Before Planning

Collect these before drafting:

- `docs/core/required/prd/PRD.md`
- `docs/core/required/PROJECT_PROMPT.md`
- applicable constraints (timeline, compliance, team capacity)
- relevant technical context (architecture, integrations, deployment model)

## Required Top-Level Phase Order

Every project plan must follow this order:

1. **Phase 01 - SEO, Menus, Content Creation**
2. **Phase 02 - UI/UX Design**
3. **Phase 03 - Development**

Do not reorder these phases.  
You may add optional supporting phases after Development (for example Hardening or Release), but only when needed.

## Sub-Phase Policy (Flexible by Project)

Sub-phases are project-specific and should be derived from PRD and prompt context.  
Examples:

- Phase 01 can include keyword research, IA/menus, content map, editorial drafts, legal/compliance content review.
- Phase 02 can include flows, page structures, component inventory, token strategy, design QA criteria.
- Phase 03 can include environment setup, backend, frontend, feature slices, testing, deployment prep.

Sub-phase count and naming may change per project.

## Planning Rules

- Keep each sub-phase outcome measurable.
- Include explicit exit criteria for every sub-phase.
- Keep dependencies clear (what must finish before what starts).
- Prefer vertical slices for development scope.
- Add risk notes and fallback options for high-impact sub-phases.

## Minimum Artifacts to Produce

When drafting a new plan, create or update:

- `docs/workspace/plans/MASTER_TASKS.md`
- `docs/workspace/plans/INDEX.md`
- one `TASKS.md` per phase and sub-phase folder

Each task should include:

- task ID
- owner (or role)
- status
- dependency
- acceptance criteria

## Recommended Directory Shape

```text
docs/workspace/plans/
  01-seo-menus-content/
    01-research/
    02-ia-menus/
    03-content/
  02-ui-ux-design/
    01-flows/
    02-design/
    03-pages/
  03-development/
    01-setup/
    02-backend/
    03-frontend/
    04-testing/
```

You may rename sub-phase folders, but keep the three top-level phases in sequence.

## Quality Checklist

- PRD requirements are mapped to tasks.
- Menu/IA decisions exist before UI implementation.
- Design outputs exist before development implementation.
- Development tasks include test and verification criteria.
- `docs/workspace/plans/INDEX.md` maps all active tasks and gate progression.
