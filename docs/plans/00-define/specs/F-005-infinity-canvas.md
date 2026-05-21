# Feature Spec — F-005: Infinity Canvas & Sitemap Graph Shell

> See also: `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md` — full canvas architecture SDD.
> `src/store/canvas-graph.store.ts` — Zustand + Zod implementation.

---

## Meta

| Field | Value |
|---|---|
| Feature ID | F-005 |
| Feature Name | Infinity Canvas & Sitemap Graph Shell |
| Priority | P0 |
| Personas affected | Amina, Rami |
| PRD section | Section 4, Row 5 |
| Status | approved |
| spec_version | 0.1.0 |
| built_at_version | 3.1.0 |
| Last updated | 2026-05-18 |

---

## 1. User Story

**As a** frontend lead,
**I want to** visually map page relationships on an infinite canvas with bezier wire connections,
**so that** I can understand and communicate the full app information architecture spatially.

---

## 2. Acceptance Criteria

- [ ] **AC-001:** Given the canvas loads, when 50 nodes are present, then the frame rate is ≥ 60fps p95 (measured via RAF profiler).
- [ ] **AC-002:** Given the user presses W, when wiring mode activates, then cursor changes to crosshair and node ports become visible.
- [ ] **AC-003:** Given a wire is drawn from node A to node B, when added, then a bezier curve renders with correct port anchors and the wire type color (navigational = Electric Cyan).
- [ ] **AC-004:** Given RTL mode is enabled via toggle, when pan occurs, then pan delta X is negated; source/target port X positions are swapped.
- [ ] **AC-005:** Given scale < 0.4, when canvas renders, then nodes switch to simplified LOD (colored rectangle + title only, no port handles).
- [ ] **AC-006:** Given scale < 0.1, then nodes render as 8px colored dots only.
- [ ] **AC-007:** Given a wire is selected, when the Wire Inspector opens, then user can attach an image and type a directive for generation.
- [ ] **AC-008:** Given "Generate [Page B]" is clicked, when all hardlock gates pass, then the generation pipeline runs: Vision Gate → context compress → LLM → target node updated with `generationStatus: 'done'`.
- [ ] **AC-009:** Given a hardlock gate fails (RTL or WCAG), when generate is attempted, then the source node shows an orange border and an inline failure badge; generate is blocked.

### 2.1 Out of Scope

- ❌ WebGL rendering — Phase 3
- ❌ Multi-user collaborative canvas — v2
- ❌ Worker thread delta compression — Phase 3

---

## 3. UI Specification

### 3.1 Canvas Shell Layout

```
┌──────────────────────────────────────────────────────────────┐
│ TOP NAV                                           [RTL] [Sync]│
├────────────────┬─────────────────────────────────────────────┤
│ LEFT DOCK 240px│ CANVAS (full viewport, CSS affine transform) │
│                │                                             │
│ 📂 Pages       │   [node] ──bezier──▶ [node]                 │
│ 🧱 Widgets     │          ↑                                   │
│ 🔗 Services    │       dash-flow                              │
│                │       stroke: var(--dv-wire-navigational)    │
├────────────────┤                                             │
│ FLOATING BAR   │                                             │
│ [+] [zoom] [🔲]│                                             │
└────────────────┴─────────────────────────────────────────────┘
```

### 3.2 Node Visual Spec

- **Full LOD (scale ≥ 0.4):** Rounded rect (6px radius), 1px border `--ds-border`, `180×80px` default, title + type badge + port handles + hardlock overlays
- **Simplified LOD (0.1–0.4):** Colored rectangle + title only, no handles
- **Dot LOD (< 0.1):** 8px circle filled with node-type color

### 3.3 Wire Color Map

| Wire type | Stroke color | Token |
|---|---|---|
| navigational | Electric Cyan | `--dv-wire-navigational` |
| data | Blue | `--dv-wire-data` |
| auth | Purple | `--dv-wire-auth` |
| conditional | Yellow | `--dv-wire-conditional` |

---

## 4. Technical Architecture Summary

- **Rendering:** CSS `transform: translate(pan.x px, pan.y px) scale(scale)` on canvas div with `transform-origin: 0 0`
- **Coordinate math:** `screenToCanvas(x,y) = { x: (x - pan.x)/scale, y: (y - pan.y)/scale }`
- **RTL pan:** `deltaX = rtlMode ? -rawDeltaX : rawDeltaX`
- **Port anchor:** Source port = `{ x: node.x + node.width, y: node.y + node.height/2 }` in LTR; mirrored in RTL
- **Bezier:** `cp1 = { x: src.x + wire.cp1Offset.x, y: src.y }`, `cp2 = { x: tgt.x + wire.cp2Offset.x, y: tgt.y }`
- **State:** `useCanvasGraphStore` (Zustand + Zod) in `src/store/canvas-graph.store.ts`

---

## 5. Generation State Machine

```
idle → validating → compressing → generating → done
                 ↘           ↘             ↘
                  error        error         error
```

---

## 6. Edge Cases

- Wire from node to itself → blocked with "Cannot wire a node to itself"
- Wire already exists between A→B → warn "Wire already exists; select it to add context"
- Context payload > 32,000 tokens after all compression tiers → error state, user prompted to simplify
- Vision Gate timeout (> 3s) → retry once; on second fail → show "Vision Gate unavailable — retry"

---

## 7. Definition of Done

- [ ] Canvas renders nodes and bezier wires from `useCanvasGraphStore`
- [ ] Pan/zoom functional (mouse + scroll)
- [ ] Wiring mode (W key) creates typed wires
- [ ] LOD rendering at all 3 scale thresholds
- [ ] RTL mode mirrors coordinates correctly
- [ ] Wire Inspector panel opens on wire select
- [ ] Full generation pipeline: Vision Gate → compress → LLM → node update
- [ ] Hardlock gates block generation with visible error overlays
- [ ] 60fps verified at 50 nodes via RAF measurement in `docs/reports/perf/`
