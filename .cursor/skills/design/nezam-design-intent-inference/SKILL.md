---
skill_id: nezam-design-intent-inference
name: "nezam-Design Intent Inference"
tier: 2
description: Parse PRD + research to produce a structured design brief with acceptance criteria
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- `docs/prd/PRD.md` (required)
- `docs/research/user-personas.md` (optional)
- `docs/research/user-flows.md` (optional)

## Workflow
1. Extract user goals, success metrics, constraints from PRD
2. Map to design dimensions: layout, typography, color, motion, a11y, RTL
3. Generate testable acceptance criteria per dimension
4. Output brief to `.nezam/core/plans/05-design/DESIGN_BRIEF_<page>.md`

## Validation
- All PRD requirements mapped to >= 1 design dimension
- Acceptance criteria are pass/fail testable
- Cultural context identified if PRD mentions MENA

## Output Format
Returns a structured brief with fields: brief_id, source_prd, design_dimensions (layout, typography, color, motion, a11y, rtl), cultural_context.

## Example
Invoked by: `/DESIGN intent dashboard` or `/PLAN design intent dashboard`
