# COLOR_SYNC_REPORT

Document semantic color alignment and contrast validation across themes/direction modes.

## Metadata

- reportId: `color-sync-<date>-<slug>`
- ownerTeam: `DESIGN`
- requiredSkills:
  - `micro-interaction-designer`
- appliedRules:
  - `design-dev-gates.mdc`
  - `coia-design-gates-pro.mdc`
  - `docs-reports-policy.mdc`

## RACI

- Responsible: `DESIGN-01-UIUX-Lead`
- Accountable: `FE-01-Frontend-Lead`
- Consulted: accessibility/performance specialists and `ARCH-01`
- Informed: `PM-01`, `BE-01`

## Theme/token sources

- tokenFile: `<path>`
- lightThemeSource: `<path>`
- darkThemeSource: `<path>`
- dsSource: `<name>`

## Color mapping entries

Repeat per semantic role:

- role: `<text-primary|bg-surface|accent-primary|success|warning|danger>`
- hexLight: `#xxxxxx`
- hexDark: `#xxxxxx`
- oklchLight: `oklch(...)`
- oklchDark: `oklch(...)`
- usageScope: `<component|page|global>`
- contrast:
  - pair: `<fg/bg>`
  - ratioLight: `<n>`
  - ratioDark: `<n>`
  - passAA: `true|false`
  - passAAA: `true|false`
- rtlNote: `<icon/accent mirroring note>`

## Validation summary

- [ ] AA minimum met for required text contexts
- [ ] AAA targets documented for high-readability zones
- [ ] Light/dark parity validated
- [ ] RTL visuals validated
- [ ] `prefers-color-scheme` and explicit theme override validated

## Required follow-ups

- item: `<description>`
- owner: `<team>`
