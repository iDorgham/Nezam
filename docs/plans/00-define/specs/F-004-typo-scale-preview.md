# Feature Spec — F-004: Typography Scale Visualizer Grid

---

## Meta

| Field | Value |
|---|---|
| Feature ID | F-004 |
| Feature Name | Typography Scale Visualizer Grid |
| Priority | P0 |
| Personas affected | Tarek |
| PRD section | Section 4, Row 4 |
| Status | approved |
| spec_version | 0.1.0 |
| built_at_version | 3.1.0 |
| Last updated | 2026-05-18 |

---

## 1. User Story

**As a** creative director,
**I want to** see all typography scale steps rendered live as real text with their `clamp()` formulas,
**so that** I can evaluate typographic hierarchy without running a build.

---

## 2. Acceptance Criteria

- [ ] **AC-001:** Given the Typography tab is open, when it loads, then 8 scale steps (xs → 4xl) are rendered as live text rows with their `clamp()` formula and computed pixel size.
- [ ] **AC-002:** Given the user changes the font family dropdown, when a new font is selected, then all scale step previews update to the new font within one frame.
- [ ] **AC-003:** Given the user hovers over a scale step, when the tooltip appears, then it shows: token name, clamp formula, min px, preferred vw, max px.
- [ ] **AC-004:** Given Arabic preview mode is toggled, when active, then each step renders the Arabic sample string with `line-height: var(--ds-leading-arabic)` (≥ 1.6).
- [ ] **AC-005:** Given any scale step uses a fixed px/rem value instead of clamp(), when the grid renders, then that step shows a red "Non-fluid" badge.

### 2.1 Out of Scope

- ❌ Custom scale ratio input (modular scale) — tracked as F-004b

---

## 3. UI Specification

```
┌──────────────────────────────────────────────────────────────┐
│ ▽ TYPOGRAPHY SCALE                                           │
│   Font: [ Geist ▾ ]   Weight: [ 400 ▾ ]   [ AR Preview ]   │
├──────────────────────────────────────────────────────────────┤
│ xs    clamp(0.694rem, 1.5vw, 0.75rem)   →  12px             │
│       The quick brown fox jumps over…                        │
├──────────────────────────────────────────────────────────────┤
│ sm    clamp(0.833rem, 1.8vw, 0.875rem)  →  14px             │
│       The quick brown fox jumps over the lazy dog            │
├──────────────────────────────────────────────────────────────┤
│ base  clamp(1rem, 2vw, 1rem)            →  16px             │
│       The quick brown fox jumps over the lazy dog            │
│ …                                                            │
│ 4xl   clamp(1.875rem, 6vw, 2.25rem)     →  36px             │
│  Heading text at maximum scale                               │
└──────────────────────────────────────────────────────────────┘
```

Each row: token label (muted, mono) | formula (muted, mono, copyable) | rendered size (primary) | live text preview (secondary color)

---

## 4. Edge Cases

- Font not loaded → fallback to system sans, show "Font loading…" label
- Viewport resize → recompute clamp preferred values and update computed px display
- Arabic sample text: "الذكاء الاصطناعي يحول العالم" (AI is transforming the world)

---

## 5. Definition of Done

- [ ] `TypographyScaleGrid` renders all 8 steps
- [ ] Font family and weight dropdowns functional
- [ ] Hover tooltip shows full clamp breakdown
- [ ] Arabic preview mode works with correct line-height
- [ ] Non-fluid badge appears on fixed-size steps
- [ ] Grid is accessible: each row has appropriate ARIA role
- [ ] Component uses `clamp()` for its own spacing too
