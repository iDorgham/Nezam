# Performance Hardening Contract — NEZAM V3

This document specifies the strict performance budgets, metrics, and implementation rules required for the NEZAM workspace and associated applications. All frontend development and builds must conform to these hard constraints.

---

## 1. Core Web Vitals Budgets

Our target budgets represent premium, instant user experiences. Any Pull Request that degrades these scores below the threshold will be blocked by the performance CI gate.

| Metric | Target (P95) | Hard Limit (P95) | Measurement Context |
|---|---|---|---|
| **Largest Contentful Paint (LCP)** | `≤ 1.2s` | `1.5s` | Desktop & high-end mobile |
| **Interaction to Next Paint (INP)** | `≤ 150ms` | `200ms` | High interactive charts & canvas |
| **Cumulative Layout Shift (CLS)** | `0.0` | `0.1` | During page transition & initial load |
| **First Contentful Paint (FCP)** | `≤ 0.8s` | `1.0s` | SSR / Static pre-rendering |

---

## 2. Rendering and Animation Budgets

Animations must be smooth and lag-free, prioritizing browser compositing layers.

- **Animation Target Frame Rate:** `60fps` constant (frame interval `~16.6ms`).
- **Duration Budgets:**
  - Micro-interactions (hovers, toggle pill switches): `≤ 150ms`.
  - Content entrance/fade-ins: `≤ 300ms`.
  - Route view transition macro sweeps: `≤ 450ms`.
- **Compositing Guardrails:**
  - Only animate `transform`, `opacity`, and `filter`.
  - Never animate layout-triggering properties (`width`, `height`, `margin`, `padding`, `top`, `left`) directly. Use CSS Transforms or scale tricks instead.
  - Apply `will-change` properties selectively to force GPU layer promotion without exhausting GPU memory.

---

## 3. Bundle Budgets

To keep loading speeds high, the build output must obey the following size budgets:

- **Token Bundle size (DTCG CSS/JS vars):** `≤ 15KB` gzipped.
- **Initial JS Chunk per page:** `≤ 50KB` gzipped.
- **Total Workspace JS Bundle:** `≤ 250KB` gzipped.
- **Dynamic Imports:** Standardize lazy load for heavy dependencies (e.g. D3, three.js/WebGL modules, rich charts).

---

## 4. Layout Stability Rules (Zero CLS)

To achieve `CLS = 0.0`:
1. **Explicit Dimensions:** All images, custom icons, and interactive elements must define explicit `aspect-ratio` or `width` & `height`.
2. **Skeleton Parity:** Loading skeleton states must match their populated UI counterpart sizes exactly (`±5px` variance max).
3. **No Dynamic Insertion:** Never insert layout items above the user's viewport once page rendering is active, unless triggered by an explicit user click.

---

## 5. Dialect-Specific and RTL Performance

- **Arabic Fonts Optimization:** Eagerly preload the selected font subsets (Tajawal, Noto Sans Arabic) to prevent Flash of Unstyled Text (FOUT) or Flash of Invisible Text (FOIT).
- **RTL Parity Rendering:** Double-check mirroring overhead. Use logical properties (`margin-inline-start`, `inset-inline-start`) instead of rebuilding separate LTR/RTL styles to keep CSS selectors small and rendering fast.
