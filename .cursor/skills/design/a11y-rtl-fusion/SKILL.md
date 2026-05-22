---
tier: 2
name: a11y-rtl-fusion
description: Merge accessibility + RTL logic for MENA-native UX
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- Component or chart specs
- Target dialect (khaleeji, masri, levantine, maghrebi, msa)
- WCAG level (AA/AAA)

## Workflow
1. Generate ARIA labels in Arabic per dialect
2. Define RTL focus order (tab > arrow > escape)
3. Create screen-reader data tables for charts
4. Validate color contrast for all states (hover, focus, active, disabled)
5. Document keyboard navigation paths

## Validation
- WCAG AA contrast >= 4.5:1 text, >= 3:1 UI components
- All interactive elements have defined focus order
- Screen-reader tables provided for all data viz

## Example
Invoked by: `/DESIGN audit --strict`, `/DESIGN harden`
