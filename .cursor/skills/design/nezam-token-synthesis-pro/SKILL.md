---
skill_id: nezam-token-synthesis-pro
name: "Token Synthesis Pro"
tier: 2
description: Generate W3C DTCG tokens + framework bindings with drift detection
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- `DESIGN_SYSTEM.md` token definitions
- Target frameworks (CSS, React, Vue, Flutter)
- Dark/light mode requirements

## Workflow
1. Parse DESIGN_SYSTEM.md for all token definitions
2. Generate W3C DTCG format JSON
3. Create framework-specific bindings (CSS variables, React theme, Vue, Dart)
4. Add TypeScript/Dart type definitions
5. Generate drift detection config for CI

## Validation
- Zero literal values in output — all values via token references
- Type-safe bindings generated
- Drift detection script included in output

## Example
Invoked by: `/DESIGN tokens --framework=react`
