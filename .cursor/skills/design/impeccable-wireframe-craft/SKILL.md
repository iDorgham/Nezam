---
skill_id: impeccable-wireframe-craft
name: "Impeccable Wireframe Craft"
tier: 3
description: "High-craft standards gate for wireframe renders. Enforces pixel discipline, state completeness (default/hover/focus/active/disabled/loading/error), motion budget, and the 'no missing states = not done' rule from impeccable-main."
version: 1.0.0
updated: 2026-05-28
changelog:
  - "1.0.0 — Initial release. Distills impeccable-main into a runnable gate."
references:
  - .cursor/design/references/impeccable-main/
  - DESIGN.md
breaking_changes: false
---

# Impeccable Wireframe Craft

## Charter

A wireframe render is not "done" until it passes this gate. Borrowed standards from `impeccable-main`: precision, restraint, complete state coverage, motion budget.

## The 7 craft clauses

### 1. State completeness

Every interactive element must demonstrate **all seven states**:

| State | Required? |
|---|---|
| default | ✅ |
| hover | ✅ |
| focus (with visible ring) | ✅ |
| active (pressed) | ✅ |
| disabled | ✅ |
| loading (skeleton or inline spinner) | ✅ |
| error | ✅ |

Missing one = not done.

### 2. Token-only colors

- No hex codes in component code
- No Tailwind arbitrary `bg-[#...]` values
- No `rgba(...)` literals — must be tokens
- See DESIGN.md §8 for full token mandate

### 3. Tonal layering (no shadows)

Hierarchy comes from surface tones (`--ds-surface-bg`, `--ds-surface-panel`, `--ds-surface-elevated`, `--ds-surface-inset`). Shadows used only for elevation under modals and toasts — never for buttons or cards.

### 4. Motion budget

- Easing: `cubic-bezier(0.32, 0.72, 0, 1)` standard, no bounce/elastic
- Properties: `opacity`, `transform` only — never `width`/`height`/`top`/`left`
- Duration: 120ms (micro), 200ms (default), 320ms (sheet/modal)
- `prefers-reduced-motion: reduce` MUST kill transitions and animations

### 5. Typography discipline

- One family across UI (Inter for Latin, Cairo for Masri)
- Emphasis via weight + size, never via color effects
- No gradient text (`background-clip: text`)
- Display fonts confined to hero/title slots, never UI labels

### 6. Standard affordances only

- Native scrollbars
- Native form controls (styled, not reinvented)
- No custom checkboxes/radios unless they hit all 7 states

### 7. Empty state discipline

Empty UI shows:
- A representation of what would go there
- A clear path to add the first item
- An optional illustration (`IllusEmpty`)

Blank pages are a defect.

## The gate (run after every render)

```bash
# Token compliance
pnpm run check:tokens

# State coverage (component tests must include all 7 states)
pnpm --filter design-hub test -- --testPathPattern=states

# Motion audit (no width/height/top/left transitions)
pnpm --filter design-hub lint -- --rule=motion-budget
```

## Anti-patterns (auto-fail)

- ❌ A button with only `default` and `hover` states demoed
- ❌ Glassmorphism (`backdrop-blur` on translucent panel)
- ❌ Side-stripe accent borders > 1px (sidebar active item is the only exception)
- ❌ Modal-first error handling (try inline + slide-over first)
- ❌ Bounce easing on any block
- ❌ Empty state rendered as literal blank `<div />`

## Output

A craft report — markdown summary listing each block, the states demoed, the tokens used, and any gate failures. Lives at `.nezam/design-hub/_reports/craft-<date>.md` after each render run.
