---
name: nezam-ui-ux-design
description: User flows, interaction states, microcopy, and WCAG 2.2 AA mapping for product UX before /DEVELOP.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose

Translate user intent into deterministic flows, interaction states, and copy that meet WCAG 2.2 AA — before any visual styling or component code lands. Single-responsibility: UX flow + copy + a11y mapping.

# Inputs

- Personas + jobs-to-be-done from `docs/specs/prd/PRD.md`.
- IA + URL hierarchy from `@.cursor/skills/nezam-ia-taxonomy/SKILL.md`.
- `docs/DESIGN.md` example pages and interaction states.
- Brand voice from `docs/prd/PROJECT_PROMPT.md`.

# Step-by-Step Workflow

1. Document primary user flows step-by-step: trigger → goal → screens → success/error → recovery.
2. Enumerate interaction states per component: default, hover, focus, focus-visible, active, disabled, loading, empty, error, success.
3. Author microcopy per state: button labels (verb-led), inline help, errors (cause + remedy), empty states (next action).
4. Map each flow step to WCAG 2.2 AA criteria: perceivable, operable, understandable, robust; record success criteria IDs (e.g., 1.4.3, 2.4.7, 2.5.7).
5. Identify keyboard paths; specify focus order and visible focus rings.
6. Define motion behavior with reduced-motion variants per flow.
7. Run cognitive walkthrough; record blockers and copy iterations.

# Validation & Metrics

- 100% of priority flows have all interaction states defined.
- WCAG 2.2 AA mapping covers each step; failures recorded with remediation.
- Microcopy passes plain-language test (Hemingway Grade 8 or simpler unless domain demands).
- Focus order matches reading order; no keyboard traps.
- Error states surface cause + remedy in ≤ 2 sentences.

# Output Format

- `docs/specs/UX_FLOWS.md` (flow diagrams, states, copy, a11y mapping).
- Microcopy library (markdown table).
- Cognitive walkthrough notes.
- WCAG 2.2 AA mapping matrix per flow.

# Integration Hooks

- `/PLAN design` and `/PLAN content` consume flows.
- `/DEVELOP` builds against state + copy spec.
- `/SCAN a11y` validates against WCAG mapping.
- Pairs with `@.cursor/skills/nezam-ia-taxonomy/SKILL.md`, `@.cursor/skills/nezam-component-library-api/SKILL.md`, `@.cursor/skills/nezam-a11y-automation/SKILL.md`.
- Honors `[.cursor/rules/design-dev-gates.mdc](.cursor/rules/design-dev-gates.mdc)` Gate 6.

# Anti-Patterns

- "Click here" / "Submit" buttons without verb-led, intent-clear labels.
- Error toasts that fade before screen readers can announce them.
- Missing empty/loading states; only happy-path designed.
- Focus rings removed by `outline: none` without replacement.
- Reduced-motion variants treated as optional.

# External Reference

- WCAG 2.2 (https://www.w3.org/TR/WCAG22/) — current.
- WAI-ARIA Authoring Practices 1.2+ (current).
- Nielsen Norman Group heuristics (current).
- Material 3 / Apple HIG interaction states references (current).
- Closest skills.sh/official analog: ux-flows / interaction-design.
