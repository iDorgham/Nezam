# Feature Spec — F-003: Border Radius Custom Token Editors

---

## Meta

| Field | Value |
|---|---|
| Feature ID | F-003 |
| Feature Name | Border Radius Custom Token Editors |
| Priority | P0 |
| Personas affected | Tarek |
| PRD section | Section 4, Row 3 |
| Status | approved |
| spec_version | 0.1.0 |
| built_at_version | 3.1.0 |
| Last updated | 2026-05-18 |

---

## 1. User Story

**As a** creative director,
**I want to** drag a slider to control element corner roundness and see all components update live,
**so that** I can quickly prototype the brand's "sharpness spectrum" without touching any code.

---

## 2. Acceptance Criteria

- [ ] **AC-001:** Given the Shape Editor panel, when it loads, then a range slider labeled "Border Radius" is visible with current token value shown as `Xpx (token-name)`.
- [ ] **AC-002:** Given the slider is dragged from 4px to 16px, when input value changes, then all component previews (Button, Card, Dialog, Input) animate to the new corner radius within one animation frame (16ms).
- [ ] **AC-003:** Given the user types a value directly in the numeric input, when an invalid CSS unit is entered, then the input reverts to the previous value and shows "Invalid unit" inline.
- [ ] **AC-004:** Given the user sets a value, when the preset is saved, then border-radius is persisted as part of `DesignPreset.borderRadius`.
- [ ] **AC-005:** Given `prefers-reduced-motion: reduce`, when the slider moves, then preview updates are instant (no transition animation on previews).

### 2.1 Out of Scope

- ❌ Per-corner (top-left only) radius control — tracked as future enhancement

---

## 3. UI Specification

### 3.1 BorderRadiusEditor Component

```
┌──────────────────────────────────────────┐
│ ▽ SHAPE — BORDER RADIUS                  │
│                                          │
│  Sharp ●──────────────────○ Soft         │
│  4px                              32px   │
│                                          │
│  [ 8 ] px   (var: --ds-radius-md)        │
│                                          │
│  Preview:                                │
│  [  Button  ]  ╔══════╗  ┌──────┐       │
│                ║ Card ║  │Input │       │
│                ╚══════╝  └──────┘       │
└──────────────────────────────────────────┘
```

- Slider: range input, min=0, max=32, step=1
- Numeric input: 40px wide, mono font
- Preview block: 3 live component stubs, transitions gated on reduced-motion
- Token label: `var(--ds-text-muted)` size

---

## 4. Token Mapping

| Slider value | Token | CSS variable |
|---|---|---|
| 0–2px | `radius-none` | `--ds-radius-none` |
| 3–5px | `radius-sm` | `--ds-radius-sm` |
| 6–9px | `radius-md` | `--ds-radius-md` |
| 10–14px | `radius-lg` | `--ds-radius-lg` |
| 15–20px | `radius-xl` | `--ds-radius-xl` |
| 21–32px | `radius-2xl` | `--ds-radius-2xl` |

---

## 5. Edge Cases

- User enters `auto` → blocked; "auto is not a valid border-radius value"
- User enters negative number → clamp to 0
- Slider keyboard navigation: Arrow keys change by 1px, Shift+Arrow by 4px

---

## 6. Definition of Done

- [ ] `BorderRadiusEditor` renders in Shape & Typo tab
- [ ] Slider + numeric input are in sync (bidirectional)
- [ ] Component preview stubs update within 16ms
- [ ] Reduced-motion: instant updates, no CSS transition on previews
- [ ] Persisted in DesignPreset via save flow (F-001 integration)
- [ ] Input validation blocks invalid values
- [ ] Logical properties in component layout
