---
name: nezam-frontend-design-pro
description: Apply high-quality frontend design patterns with token-first implementation rules and NEZAM gate compliance.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose
Turn `docs/DESIGN.md` intent into production-grade frontend design direction while avoiding generic UI output and gate violations.

# Inputs
- `docs/DESIGN.md` full document.
- SEO/IA/content artifacts from SDD planning stages.
- Existing component constraints and brand priorities.

# Step-by-Step Workflow
1. Confirm phase readiness: SEO/IA/content artifacts exist before visual refinement.
2. Select a coherent design direction (tone, density, typography, color strategy).
3. Map typography and spacing to tokenized scales using `clamp()` and container-aware rules.
4. Define component-level visual patterns tied to variant APIs.
5. Attach motion guidance that follows composited-property and reduced-motion constraints.
6. Document anti-patterns and drift checks for implementation review.
7. Prepare handoff summary for `/DEVELOP` with explicit pass/fail gates.

# Validation & Metrics
- Visual decisions reference tokens, not ad-hoc values.
- LCP < 2.5s and CLS < 0.1 targets preserved in design choices.
- WCAG 2.2 AA contrast and focus visibility documented.
- Motion specs include reduced-motion parity.

# Output Format
- Design direction summary.
- Token-aligned component styling matrix.
- Handoff checklist with blocking/non-blocking findings.

# Integration Hooks
- `/PLAN design` as primary entry point.
- `/SCAN perf` + `/SCAN a11y` before phase transition.
- `/FIX` for any gate-breaking design regressions.
