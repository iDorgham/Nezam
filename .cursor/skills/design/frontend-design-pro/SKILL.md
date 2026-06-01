---
name: frontend-design-pro
tier: 3
description: Apply high-quality frontend design patterns with token-first implementation rules and NEZAM gate compliance.
version: 2.0.0
updated: 2026-05-28
changelog:
  - "2.0.0 — 2026-05-28: Upgraded to utilize design-intelligence plugins, open-design style selector, and strict anti-slop gating."
breaking_changes: false
---

# Purpose
Turn `docs/DESIGN.md` intent into production-grade frontend design direction while avoiding generic UI output and gate violations.

# Step-by-Step Workflow
1. **Reflex Check**: Intercept request and map to product or brand register.
2. **Consult References**: Load matching `open-design` style pack and brand `DESIGN.md` rules.
3. **Choose Preset**: Apply a `theme-factory` preset.
4. **Anti-Slop test**: Filter styling choices through `anti-slop-validator` (no raw pixel bypasses).
5. **Handoff validation**: Verify LCP < 2.5s and WCAG AA compliance.
