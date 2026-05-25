# DESIGN.md v2 (Impeccable++)

## Intent
*Brief generated via /DESIGN intent — source: .nezam/core/plans/05-design/DESIGN_BRIEF_<page>.md*

## Tokens
*W3C DTCG format + framework bindings*
- OKLCH color definitions (>= 80% of palette)
- Tinted neutrals for all backgrounds (>= 90%)
- Fluid type scale with optical sizing

## Components
*Spec with a11y props, RTL logic, test hooks*

## Motion
*Animation specs with perf budgets + fallback chains*
- Entrance: <=350ms cubic-bezier(0.25, 0.1, 0.25, 1.0)
- Update: <=200ms
- Exit: <=150ms
- Reduced motion: instant snap or opacity crossfade

## Accessibility
*WCAG 2.2 AA compliance report + MENA screen-reader notes*

## RTL Parity
*LTR/RTL comparison notes + mirror snapshot links*

## Cultural Context
*Dialect-specific validation report (khaleeji|masri|levantine|maghrebi|msa)*

## Anti-Pattern Checklist
- [ ] No Inter/Arial default
- [ ] No purple-to-blue gradients
- [ ] No gray-on-color text (>= 4.5:1)
- [ ] No cards in cards
- [ ] No pure black
- [ ] No bounce easing
- [ ] No arbitrary spacing
- [ ] No hardcoded hex values
- [ ] No missing RTL layout

## Handoff Checklist
- [ ] Tokens synced to frameworks
- [ ] RTL layout tested in CI
- [ ] A11y props implemented
- [ ] Motion perf budget verified
- [ ] Cultural validation passed
- [ ] /DESIGN audit --strict passed
- [ ] sdd-gate-validator: PASS
