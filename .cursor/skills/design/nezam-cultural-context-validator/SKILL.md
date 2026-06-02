---
skill_id: nezam-cultural-context-validator
name: "nezam-Cultural Context Validator"
tier: 2
description: Validate design against MENA cultural norms per dialect
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- Design specs or component library
- Target dialect and market
- PRD cultural requirements

## Workflow
1. Check color semantics (green=positive KSA, red=caution Levant)
2. Validate typography (Noto Sans Arabic vs Tajawal per dialect)
3. Check layout alignment (right-aligned CTAs Khaleeji, center Masri)
4. Review iconography (avoid sensitive hand gestures)
5. Verify calendar awareness (Ramadan mode, Hijri dates)

## Validation
- Zero culturally insensitive icons/colors
- Dialect-specific font pair enforced
- Calendar components support Hijri if date inputs present

## Example
Invoked by: `/DESIGN localize --dialect=khaleeji`
