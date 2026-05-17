# NEZAM Design Server — Improvement Plan (Phase 1 & 2)

> Refactoring the design server for industrial-grade design-to-code reliability.

## Phase 1: Foundation Repair

- [ ] **Task 1: Tighten tokens.store.ts**
    - Ensure all tokens from `globals.css` are represented in the store.
    - Implement `syncTokensToCss` logic (writing to `globals.css` :root).
- [ ] **Task 2: Robust profile.parser.ts**
    - Replace loose regex with a more structured block-based parser.
    - Ensure all 20+ color tokens are inferred or defaulted.
- [ ] **Task 3: Dogfood Sidebar & UI**
    - Replace hardcoded hex values (`#FF5701`) with CSS variables (`var(--ds-primary)`).
- [ ] **Task 4: Improved export-design.ts**
    - Generate a beautiful `DESIGN.md` with tables and CSS code blocks.

## Phase 2: Feature Completion

- [ ] **Task 5: Lock Validation Logic**
    - Block export if P0 pages (Home, Auth, Dashboard) are missing wireframes.
- [ ] **Task 6: Real AI Route Hardening**
    - Add error handling and retry logic for the Anthropic API.
- [ ] **Task 7: Layout Designer Connectivity**
    - Ensure the layout designer actually updates the sitemap state.

---

## Phase 3: The Infinity Canvas (Next Step)

- [ ] Initialize React Flow in `CanvasWorkspace.tsx`.
- [ ] Map Sitemap nodes to React Flow nodes.
- [ ] Implement bi-directional sync with `world.json`.
