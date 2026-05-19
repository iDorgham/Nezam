# Feature Spec — F-007: Property Inspector — CSS Layer Panel

---

## Meta

| Field | Value |
|---|---|
| Feature ID | F-007 |
| Feature Name | Property Inspector — CSS Layer Panel |
| Priority | P0 |
| Personas affected | Amina, Rami |
| PRD section | Section 4, Row 7 |
| Status | approved |
| Last updated | 2026-05-18 |

---

## 1. User Story

**As a** frontend lead,
**I want to** inspect and edit CSS properties of selected canvas nodes using logical property form,
**so that** I can verify and adjust spacing, typography, and accessibility without opening a code editor.

---

## 2. Acceptance Criteria

- [ ] **AC-001:** Given a canvas node is selected, when the inspector opens, then the Box Model tab shows `margin-inline-start`, `margin-inline-end`, `padding-block-start`, `padding-block-end` — never `margin-left` or `padding-right`.
- [ ] **AC-002:** Given a value is changed in the inspector, when input changes, then the canvas node updates live within 16ms.
- [ ] **AC-003:** Given the user attempts to enter `margin-left` in the raw CSS tab, when submitted, then the change is blocked with "Use logical properties: margin-inline-start" error message.
- [ ] **AC-004:** Given the A11y tab is active, when a node has a foreground/background contrast below 4.5:1, then a red "Contrast fail — X.X:1" badge appears with the suggested safe color.
- [ ] **AC-005:** Given no canvas node is selected, when the inspector renders, then it shows "Select a component to inspect" empty state.
- [ ] **AC-006:** Given RTL mode is active, when the inspector shows margin values, then `margin-inline-start` visually appears on the inline-start side (right side in RTL) — label context is correct.

### 2.1 Out of Scope

- ❌ SEO tab implementation — F-007b (tracked separately)
- ❌ Live DOM injection to external app — not in scope

---

## 3. UI Specification

```
┌────────────────────────────────────────────┐
│ PROPERTY INSPECTOR                         │
├────────────────────────────────────────────┤
│ [ Layers ][ Settings ][[ CSS ]][ A11y ]    │
├────────────────────────────────────────────┤
│ ▽ BOX MODEL                                │
│  Margin-Inline-Start:  [ 12 ] px (space.sm)│
│  Margin-Inline-End:    [ 12 ] px (space.sm)│
│  Padding-Block-Start:  [ 24 ] px (space.lg)│
│  Padding-Block-End:    [ 24 ] px (space.lg)│
├────────────────────────────────────────────┤
│ ▽ TYPOGRAPHY                               │
│  Font:   [ Geist Sans          ] ▾         │
│  Weight: [ 500 — Medium        ]           │
│  Size:   [ clamp(1rem,2vw,1rem)] (base)    │
│  Leading:[ 1.5                 ]           │
├────────────────────────────────────────────┤
│ A11y Tab                                   │
│  Contrast:  ✅ 7.2:1 (AA pass)             │
│  Tab Index: 3                              │
│  ARIA Role: region                         │
└────────────────────────────────────────────┘
```

### 3.2 Panel Behavior

- Fixed width: 320px (right dock)
- Tabs: keyboard navigable with arrow keys
- Property inputs: 80px width, mono font, debounce 100ms before committing

---

## 4. Hardlock Enforcement

These are blocked at the input level — user cannot commit the value:

| Blocked input | Error message |
|---|---|
| `margin-left`, `margin-right` | "Use logical: margin-inline-start / end" |
| `padding-left`, `padding-right` | "Use logical: padding-inline-start / end" |
| Fixed `px`/`rem` font-size | "Use clamp() for fluid type" |
| Contrast ratio < 4.5:1 in A11y tab | Red badge + safe color suggestion |

---

## 5. Edge Cases

- Multiple nodes selected → inspector shows "(multiple selected)" and only shows shared properties
- Node with no explicit CSS → shows inherited/default values as placeholders
- Clamp formula manually typed → validate syntax before committing

---

## 6. Definition of Done

- [ ] `PropertyInspector` right dock panel renders on canvas node select
- [ ] Box Model tab shows all 4 logical property groups
- [ ] Typography tab with font/weight/size/leading editors
- [ ] A11y tab with live contrast ratio badge
- [ ] Directional property inputs blocked with clear error message
- [ ] Live preview updates canvas node within 16ms
- [ ] Empty state when no node selected
- [ ] Full WCAG keyboard navigation across all tabs
- [ ] Logical properties used in inspector's own layout
