# DESIGN — {{PRODUCT_NAME}}

Status: Draft  
Owner:

This template mirrors NEZAM design-dev gates: token-first layout, fluid typography, motion budget, and progressive 3D fallbacks. Replace placeholders; do not delete numbered sections (CI asserts their presence).

---

## 1. Brand and intent

- 

## 2. Token sources

- Canonical CSS variables / token files:
- Forbidden: ad-hoc `px` / hex outside tokens (see design gates).

## 3. Layout and grid

- Macro layout (grid/flex) and spacing roles.

## 4. Color and elevation

- Semantic color roles and elevation levels.

## 5. Typography

### 5.1 Fluid type scale

| Role | clamp(min, preferred, max) | Token |
| ---- | --------------------------- | ----- |
| display |  |  |
| title |  |  |
| body |  |  |

### 5.2 Breakpoint and container-query matrix

| Breakpoint | Min width | Notes |
| ---------- | --------- | ----- |
| mobile |  |  |
| tablet |  |  |
| desktop |  |  |
| wide |  |  |

Component-level responsiveness: container queries where components are reused across layouts.

## 6. Components (summary)

- Link to component inventory / library map.

## 7. Motion and 3D

### 7.1 Motion tokens

- Presets (duration, easing) as tokens only.
- Animate `transform` and `opacity` by default; document exceptions.
- `prefers-reduced-motion: reduce` alternatives for every non-essential motion.

### 7.2 Loading and choreography

- Skeletons, stagger rules, focus management during transitions.

### 7.3 Progressive 3D fallback specification

- Primary: WebGL / R3F (if used).
- Fallback: SVG / Canvas / static illustration.
- Gate 3D behind capability + reduced-motion + low-power checks; `Suspense` for load paths.

## 8. Accessibility and performance budgets

- WCAG 2.2 AA, LCP / CLS / INP targets; link to hardening contract.

## 9. RTL / MENA (if applicable)

- `dir`, mirroring, bidirectional motion notes.

## 10. Decision amendments

| Date | Field | Previous | New | Reason | Approved by |
| ---- | ----- | -------- | --- | ------ | ----------- |
