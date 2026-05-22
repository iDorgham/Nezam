# Feature Spec — F-001: Design Profile Persistence Layer

> **Agents must read this entire file before writing a single line of code for this feature.**

---

## Meta

| Field | Value |
|---|---|
| Feature ID | F-001 |
| Feature Name | Design Profile Persistence Layer |
| Priority | P0 |
| Personas affected | Amina, Tarek |
| PRD section | Section 4, Row 1 |
| Status | approved |
| Last updated | 2026-05-18 |

---

## 1. User Story

**As a** frontend engineer,
**I want to** save and reload named design presets across sessions,
**so that** I never lose a custom brand configuration and can switch between client themes instantly.

### 1.1 Detailed Narrative

Currently the design server holds token values only in memory — a page reload loses all customizations. Amina frequently switches between three client brand profiles during a single work session. Tarek prototypes 2–3 aesthetic variants before settling on one. Both need instant named preset persistence with zero data loss on reload.

---

## 2. Acceptance Criteria

- [ ] **AC-001:** Given a configured token set, when the user enters a preset name and clicks "Save Preset", then the preset is written to localStorage and appears in the sidebar preset list within 200ms.
- [ ] **AC-002:** Given a saved preset exists, when the page is reloaded, then the last active preset is restored automatically with all token values intact.
- [ ] **AC-003:** Given a preset is selected from the sidebar, when the user clicks "Apply", then all token values update within 50ms with no visual flash.
- [ ] **AC-004:** Given the user clicks "Sync to Disk", when the write succeeds, then the preset is saved to `.nezam/design/<preset-slug>/design.md` and a success toast appears.
- [ ] **AC-005:** Given the user submits an empty preset name, when validation runs, then the name input shows `border-ds-destructive` and "Preset name required" error inline.
- [ ] **AC-006:** Given a preset name collision, when the user saves, then a "Overwrite existing preset?" modal appears before proceeding.

### 2.1 Out of Scope

- ❌ Cloud preset sync — tracked as v2 feature
- ❌ Preset sharing between team members — tracked as v2

---

## 3. UI Specification

### 3.1 Screens Involved

| Screen | Route | Type |
|---|---|---|
| Token Studio Dashboard | `/` | Modified |
| Preset sidebar panel | `/` (left dock) | New |

### 3.2 Component: PresetSidebar

```
┌────────────────────────────────────┐
│ DESIGN PROFILES                    │
├────────────────────────────────────┤
│ ● Default System       [Apply]     │
│ ● Agentic              [Apply]     │
│ ● Sahel Sunset  ←active [Apply]   │
├────────────────────────────────────┤
│ [+ Save Current as Preset]         │
│   Name: [________________]         │
│   [Save]  [Sync to Disk]          │
└────────────────────────────────────┘
```

**States:** Default / Saving (spinner on button) / Save error (red border + message) / Sync success (green toast)

---

## 4. Data

- Storage: `localStorage` key `nezam-ds:presets` — array of `DesignPreset`
- Disk path: `.nezam/design/<slugified-name>/design.md`
- API: `GET /api/presets`, `POST /api/presets/save`, `POST /api/presets/sync-to-disk`

---

## 5. Edge Cases

- Preset name with special characters → slugify before disk write
- localStorage quota exceeded → show "Storage full" error
- Disk write permission denied → show "Sync failed: Permission denied" toast with retry
- 50+ presets → virtualize sidebar list (react-virtual or similar)

---

## 6. Definition of Done

- [ ] PresetSidebar renders with system + custom presets
- [ ] Save flow: validates name → writes localStorage → updates sidebar
- [ ] Reload restores last active preset
- [ ] Sync-to-disk writes `.nezam/design/<slug>/design.md`
- [ ] All AC pass with Jest/Playwright tests in `docs/reports/tests/`
- [ ] No hardcoded hex values in component markup
- [ ] Logical properties only — no `margin-left` etc.
- [ ] WCAG AA contrast verified
