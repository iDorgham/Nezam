# LIBRARY_DS_MAP

Map active component/library usage to design-system principles and token contracts.

## Metadata

- mapId: `map-<date>-<slug>`
- ownerTeam: `DESIGN`
- requiredSkills:
  - `design-system-builder`
  - `wireframe-to-spec-converter`
  - `token-budget-manager`
- appliedRules:
  - `design-dev-gates.mdc`
  - `nezam-design-gates-pro.mdc`

## RACI

- Responsible: `DESIGN-01-UIUX-Lead`
- Accountable: `ARCH-01-Project-Architect`
- Consulted: `FE-01-Frontend-Lead` and domain specialists
- Informed: `PM-01-Swarm-Leader`, `BE-01-Backend-Lead`

## Stack detection context

- framework: `<nextjs|vite|other>`
- uiLibrary: `<name>`
- designSystem: `<name>`
- detectionSource: `<path|command>`

## Mapping entries

Repeat per component:

- component: `<name>`
- libraryPrimitive: `<name>`
- designPrinciple: `<spacing|typography|motion|a11y>`
- tokenBindings:
  - color: `<token>`
  - spacing: `<token>`
  - typography: `<token>`
  - motion: `<token>`
- rtlNotes: `<note>`
- a11yNotes: `<note>`
- bundleImpactNote: `<note>`

## Gaps and actions

- gap: `<description>`
- actionOwner: `<team>`
- dueBy: `<date|milestone>`
