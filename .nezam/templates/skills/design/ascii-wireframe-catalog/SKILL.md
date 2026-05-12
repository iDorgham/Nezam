---
name: ascii-wireframe-catalog
description: Generates implementation-ready ASCII wireframes with interaction specs, RTL parity, and framework routing maps during /PLAN design.
version: "2.0.0"
updated: "2026-05-13T00:00:00Z"
changelog: ["1.0.0: Initial release", "2.0.0: Extended 24-canvas catalog, MENA/RTL parity gates, framework routing maps, SDD hardlocks"]
category: design
---
# ASCII Wireframe Catalog
## Purpose
Generates precise, high-fidelity ASCII wireframes as implementation contracts during `/PLAN design`. Ensures layout, interaction, accessibility, and MENA/RTL considerations are locked before `/DEVELOP`.

## Inputs
- `.cursor/state/plan_progress.yaml`
- `docs/prd/PRD.md`
- `@.nezam/templates/design/wireframe-base/SKILL.md`
- `@.cursor/agents/lead-uiux-designer.md`

## Step-by-Step Workflow
### Phase 1: Gate Validation
1. Verify `plan_progress.yaml.design_contract: true` via `sdd-gate-validator`
2. Load active swarm agents via `agent-lazy-load.mdc`
3. Check `HANDOFF_QUEUE.yaml` for pending wireframe requests

### Phase 2: Execution
1. Select target canvas from `wireframe_catalog.md` (24+ templates)
2. Generate ASCII layout with grid-aligned components, breakpoints, and state variants
3. Append interaction specs: drag constraints, keyboard nav, focus traps, undo/redo hooks
4. Inject MENA/RTL parity rules: mirrored layouts, bidi text zones, numeral system toggles
5. Map framework routing: Next.js App Router / Vue SFC / Astro / SvelteKit trees
6. Define data density tiers: Executive / Manager / Developer / Ops views

### Phase 3: Validation
1. Run `pnpm ai:check` for drift
2. Verify ASCII grid alignment (monospace-safe, 4px baseline)
3. Validate RTL parity: `rtl-mirror-score ≥ 0.95`
4. Flip `plan_progress.yaml.wireframes_approved: true`

### Phase 4: Handoff & Memory Archive
1. Output to `docs/plans/design/wireframes/`
2. Update `HANDOFF_QUEUE.yaml` → status: `ready_for_develop`
3. Archive spec + interaction logs to `@.nezam/memory/design-wireframes/<session-id>/`

## Validation & Metrics
- Completeness: 0 missing layout zones, 0 orphan components
- Correctness: 0 drift from PRD scope or `DESIGN.md` tokens
- Performance: ASCII parsing < 50ms, RTL mirror check < 200ms
- Accessibility: Focus order explicit, ARIA hints embedded in ASCII annotations

## Output Format
```tree
docs/plans/design/wireframes/
├── builder-canvas.md
├── node-graph-editor.md
├── crm-pipeline-board.md
└── ...
.nezam/memory/design-wireframes/
└── <session-id>/context.log
```

## Related Skills/Agents
- `@.cursor/agents/lead-uiux-designer.md`
- `@.cursor/agents/rtl-specialist.md`
- `@.nezam/templates/skills/design/design-md/SKILL.md`
- `@.cursor/rules/design-dev-gates.mdc`

## SDD Alignment
- Phase: `PLAN → DESIGN`
- Gate: `design_contract`
- Memory: `.nezam/memory/design-wireframes/`
