---
name: {{SKILL_NAME}}
description: One-line description of when to load this skill and what it produces.
license: Optional upstream license label
source: Optional upstream source URL
---

# {{SKILL_DISPLAY_NAME}}

## Purpose

Single-responsibility statement for this skill.

## Inputs

- Required documents/sections (`DESIGN.md`, specs, token draft, etc.).
- Constraints (SEO, performance, accessibility, platform limits).

## Step-by-Step Workflow

1. Deterministic step with clear input/output.
2. Deterministic step with file-safe boundaries.
3. Deterministic step with verification expectation.

## Examples

```bash
# Example invocation or workflow step
```

## Validation & Metrics

- 60fps target for motion-heavy flows.
- LCP < 2.5s, CLS < 0.1, INP < 200ms for web surfaces.
- WCAG 2.2 AA checks for semantic and visual accessibility.

## Output Format

- Structured artifacts (token JSON, spec tables, checklists, stubs).

## Integration Hooks

- Related slash commands (`/PLAN`, `/DEVELOP`, `/SCAN`, `/FIX`).
- CI or quality-gate touchpoints.
