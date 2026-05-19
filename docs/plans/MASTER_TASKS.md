# MASTER TASKS — Nezam Design Server · Ultimate UI Suite

> **Source:** PRD v2.0.0 · Feature Specs F-001 to F-008 · SPEC-DS-CANVAS-001
> **Planning complete:** 2026-05-18
> **Current Phase:** 01-Build (Phase 1 — P0 features)

---

## Phase 0 — Scaffold & Foundation

| ID | Task | Owner | Status | Spec | Depends on |
|---|---|---|---|---|---|
| T-000-001 | Run `bash scripts/scaffold.sh` to create all stub files | devops | ⬜ | scaffold/PROJECT_SCAFFOLD.md | — |
| T-000-002 | Implement `src/store/session.store.ts` (Zustand + persist) | frontend-lead | ✅ | ARCHITECTURE.md §3 | T-000-001 |
| T-000-003 | Implement `src/store/tokens.store.ts` (Zustand + persist) | frontend-lead | ✅ | ARCHITECTURE.md §3 | T-000-001 |
| T-000-004 | Implement `src/lib/token-injection.ts` (CSS setProperty) | frontend-lead | ✅ | ARCHITECTURE.md §6 | T-000-002 |
| T-000-005 | Configure `globals.css` + `src/styles/tokens.css` with `--ds-*` and `--dv-*` variables | design-lead | ⬜ | DESIGN.md | T-000-001 |
| T-000-006 | Implement `app/layout.tsx` — ThemeProvider, RTL dir, font injection | frontend-lead | ⬜ | IA_CONTENT.md §10 | T-000-002 |
| T-000-007 | `npx tsc --noEmit` → 0 errors baseline | qa-test-lead | ✅ | — | T-000-006 |

---

## Phase 1A — Token Studio (F-001, F-002, F-003, F-004)

### F-001: Design Profile Persistence Layer

| ID | Task | Owner | Status | AC | Depends on |
|---|---|---|---|---|---|
| T-F001-001 | Implement `GET /api/presets` — list from localStorage + disk | backend-lead | ✅ | AC-001 | T-000-007 |
| T-F001-002 | Implement `POST /api/presets/save` — validation + save + collision check | backend-lead | ✅ | AC-002, AC-004 | T-F001-001 |
| T-F001-003 | Implement `POST /api/presets/sync-to-disk` — write to `.nezam/design/` | backend-lead | ✅ | AC-003 | T-F001-002 |
| T-F001-004 | Build `ProfileCard.tsx` — system/custom badge, apply/edit buttons | frontend-lead | ✅ | AC-005 | T-000-006 |
| T-F001-005 | Build `ProfileSelector.tsx` — 2-col grid, collapsible sections | frontend-lead | ✅ | AC-001 | T-F001-004 |
| T-F001-006 | Connect `useTokenStore.loadPreset()` to ProfileSelector | frontend-lead | ✅ | AC-001 | T-F001-005 |
| T-F001-007 | Build save preset modal — name input, collision warning, overwrite confirm | frontend-lead | ✅ | AC-002, AC-004 | T-F001-006 |
| T-F001-008 | Unit test: `tokens.store.ts` — loadPreset, savePreset, syncToDisk | qa-test-lead | ✅ | — | T-F001-007 |

### F-002: CSS Sync Status Indicators

| ID | Task | Owner | Status | AC | Depends on |
|---|---|---|---|---|---|
| T-F002-001 | Build `SyncStatusPill.tsx` — 4 states (synced/syncing/failed/offline) | frontend-lead | ✅ | AC-001, AC-002 | T-000-006 |
| T-F002-002 | Implement `useSyncStatus.ts` — debounce 100ms, state machine | frontend-lead | ✅ | AC-003 | T-F002-001 |
| T-F002-003 | Wire SyncStatusPill to disk write API response | frontend-lead | ✅ | AC-002, AC-004 | T-F002-002 |
| T-F002-004 | Implement retry button on failed state | frontend-lead | ✅ | AC-004 | T-F002-003 |
| T-F002-005 | Test: offline state persists pill in offline mode | qa-test-lead | ✅ | AC-005 | T-F002-004 |

### F-003: Border Radius Custom Token Editors

| ID | Task | Owner | Status | AC | Depends on |
|---|---|---|---|---|---|
| T-F003-001 | Build `BorderRadiusEditor.tsx` — range slider (0–64px) + numeric input | frontend-lead | ✅ | AC-001 | T-000-006 |
| T-F003-002 | Implement token grid — 6 standard tokens (XS→Full) with active highlight | frontend-lead | ✅ | AC-002 | T-F003-001 |
| T-F003-003 | Wire live preview: buttons, cards, dialogs update within 16ms | frontend-lead | ✅ | AC-003 | T-F003-002 |
| T-F003-004 | Input validation: block invalid CSS units with error message | frontend-lead | ✅ | AC-004 | T-F003-003 |
| T-F003-005 | Keyboard: slider arrow keys ±1px, inputs Enter/Tab to commit | frontend-lead | ✅ | AC-005 | T-F003-004 |

### F-004: Typography Scale Visualizer Grid

| ID | Task | Owner | Status | AC | Depends on |
|---|---|---|---|---|---|
| T-F004-001 | Build `TypographyScaleGrid.tsx` — 8-step grid XS→2XL with clamp() formulas | frontend-lead | ✅ | AC-001 | T-000-006 |
| T-F004-002 | Implement hover tooltip showing computed px metrics | frontend-lead | ✅ | AC-002 | T-F004-001 |
| T-F004-003 | Implement font family selector + scale ratio controls | frontend-lead | ✅ | AC-003 | T-F004-002 |
| T-F004-004 | Build Arabic preview mode toggle — line-height ≥ 1.4× enforcement | frontend-lead | ✅ | AC-004 | T-F004-003 |
| T-F004-005 | Block fixed px/rem font-size inputs — show clamp() error | frontend-lead | ✅ | AC-005 | T-F004-004 |

---

## Phase 1B — Infinity Canvas (F-005)

| ID | Task | Owner | Status | AC | Depends on |
|---|---|---|---|---|---|
| T-F005-001 | Build `CanvasWorkspace.tsx` — CSS matrix transform, pan/zoom, dot grid | frontend-lead | ✅ | AC-001 | T-000-007 |
| T-F005-002 | Implement `useCanvasViewport.ts` — screenToCanvas, canvasToScreen, scroll zoom | frontend-lead | ✅ | AC-001 | T-F005-001 |
| T-F005-003 | Build `CanvasNode.tsx` — full LOD (scale ≥ 0.4): 180×80px, 6px radius, port handles | frontend-lead | ✅ | AC-005 | T-F005-002 |
| T-F005-004 | Implement simplified LOD (0.1–0.4): colored rect + title only | frontend-lead | ✅ | AC-005 | T-F005-003 |
| T-F005-005 | Implement dot LOD (< 0.1): 8px colored circle | frontend-lead | ✅ | AC-006 | T-F005-004 |
| T-F005-006 | Implement wiring mode (W key) — crosshair cursor, visible ports | frontend-lead | ✅ | AC-002 | T-F005-003 |
| T-F005-007 | Build `BezierWire.tsx` — SVG path + dash-flow animation + wire type colors | frontend-lead | ✅ | AC-003 | T-F005-006 |
| T-F005-008 | Implement RTL coordinate mirroring — negate deltaX, swap port X | rtl-specialist | ✅ | AC-004 | T-F005-007 |
| T-F005-009 | Implement `GET /api/canvas` and `POST /api/canvas/node` | backend-lead | ✅ | — | T-000-007 |
| T-F005-010 | Implement `src/lib/canvas-math.ts` — bezier control point formulas | frontend-lead | ✅ | AC-003 | T-F005-007 |
| T-F005-011 | Build `WireInspector.tsx` — wire type selector, drop zone, directives textarea | frontend-lead | ✅ | AC-007 | T-F005-007 |
| T-F005-012 | Implement `VisionGateBadge.tsx` and `POST /api/ai/vision-gate` route | backend-lead | ⬜ | AC-008 | T-F005-011 |
| T-F005-013 | Implement `HardlockOverlay.tsx` — orange border + failure badges | frontend-lead | ⬜ | AC-009 | T-F005-012 |
| T-F005-014 | Implement `GenerateButton.tsx` with generation state machine | frontend-lead | ⬜ | AC-008 | T-F005-013 |
| T-F005-015 | Implement `POST /api/ai/generate-node` — context → LLM → node update | backend-lead | ⬜ | AC-008 | T-F005-014 |
| T-F005-016 | Implement `src/lib/context-compression.ts` — 3-tier compression ≤ 32k | backend-lead | ⬜ | — | T-F005-015 |
| T-F005-017 | Measure 60fps @ 50 nodes via RAF profiler, document in `docs/reports/perf/` | qa-test-lead | ⬜ | AC-001 | T-F005-005 |
| T-F005-018 | Canvas empty state — "Add your first page" centered prompt node | frontend-lead | ✅ | — | T-F005-001 |

---

## Phase 1C — Property Inspector (F-007)

| ID | Task | Owner | Status | AC | Depends on |
|---|---|---|---|---|---|
| T-F007-001 | Build `PropertyInspector.tsx` — 4 tabs, 320px, keyboard navigation | frontend-lead | ⬜ | AC-005 | T-000-007 |
| T-F007-002 | Implement `BoxModelFields.tsx` — all 4 logical property groups | frontend-lead | ⬜ | AC-001 | T-F007-001 |
| T-F007-003 | Implement `TypographyFields.tsx` — font/weight/size(clamp)/leading | frontend-lead | ⬜ | — | T-F007-002 |
| T-F007-004 | Implement `A11yTab.tsx` — live contrast ratio badge + ARIA + tab order | a11y-performance-auditor | ⬜ | AC-004 | T-F007-003 |
| T-F007-005 | Implement `HardlockError.tsx` — inline blocked input messages | frontend-lead | ⬜ | AC-003 | T-F007-002 |
| T-F007-006 | Implement `src/lib/hardlock-check.ts` — block directional CSS at input level | frontend-lead | ⬜ | AC-003 | T-F007-005 |
| T-F007-007 | Wire canvas node selection → PropertyInspector right dock open | frontend-lead | ⬜ | — | T-F007-001 |
| T-F007-008 | Live preview: node CSS updates within 16ms of input change | frontend-lead | ⬜ | AC-002 | T-F007-007 |
| T-F007-009 | Multiple-node selection: show "(multiple selected)" + shared props | frontend-lead | ⬜ | — | T-F007-008 |
| T-F007-010 | RTL context: `margin-inline-start` label shows correct side annotation | rtl-specialist | ⬜ | AC-006 | T-F007-008 |

---

## Phase 2A — Motion Studio (F-006) [P1]

| ID | Task | Owner | Status | Depends on |
|---|---|---|---|---|
| T-F006-001 | Build `MotionStudio.tsx` — collapsible bottom dock, 240px default height | frontend-lead | ⬜ | Phase 1 complete |
| T-F006-002 | Build `Timeline.tsx` — ruler + keyframe grid, 0.1s tick marks | frontend-lead | ⬜ | T-F006-001 |
| T-F006-003 | Build `TrackList.tsx` — property rows (opacity/translateY/scale/stagger) | frontend-lead | ⬜ | T-F006-002 |
| T-F006-004 | Build `KeyframeDiamond.tsx` — ◆ drag handle, draggable on ruler | frontend-lead | ⬜ | T-F006-003 |
| T-F006-005 | Build `EasingSelector.tsx` — dropdown + cubic-bezier SVG preview | animation-motion-specialist | ⬜ | T-F006-004 |
| T-F006-006 | Implement `useReducedMotion.ts` — prefers-reduced-motion listener | frontend-lead | ⬜ | T-F006-001 |
| T-F006-007 | Build `ReducedMotionBanner.tsx` — orange inline notice when active | frontend-lead | ⬜ | T-F006-006 |
| T-F006-008 | Implement scrub playhead — cyan 1px line tracking mouse X | frontend-lead | ⬜ | T-F006-002 |

---

## Phase 2B — Asset Browser (F-008) [P1]

| ID | Task | Owner | Status | Depends on |
|---|---|---|---|---|
| T-F008-001 | Build `AssetBrowser.tsx` — left dock tab, toolbar + grid | frontend-lead | ⬜ | Phase 1 complete |
| T-F008-002 | Build `DropZone.tsx` — dashed border drag-over, extension list | frontend-lead | ⬜ | T-F008-001 |
| T-F008-003 | Build `AssetCard.tsx` — thumbnail + name + mime badge + rejected overlay | frontend-lead | ⬜ | T-F008-002 |
| T-F008-004 | Build `UploadProgress.tsx` — per-file animated progress bar | frontend-lead | ⬜ | T-F008-003 |
| T-F008-005 | Implement `POST /api/assets/upload` — MIME check + SVG sanitize + WebP convert | backend-lead | ⬜ | T-F008-001 |
| T-F008-006 | Implement `src/lib/svg-sanitizer.ts` — recursive `<text>` detection | backend-lead | ⬜ | T-F008-005 |
| T-F008-007 | Implement `src/lib/asset-optimizer.ts` — sharp → WebP, altText extraction | backend-lead | ⬜ | T-F008-006 |
| T-F008-008 | Async Vision Gate trigger on image assets post-upload | backend-lead | ⬜ | T-F008-007 |

---

## Phase 3 — Quality, Hardlock Verification, RTL Audit

| ID | Task | Owner | Status | Spec | Depends on |
|---|---|---|---|---|---|
| T-Q-001 | Axe-core CI scan — all screens WCAG AA | a11y-performance-auditor | ⬜ | PRD §10.2 | Phase 2 complete |
| T-Q-002 | Manual RTL audit — all panels, canvas, inspector in `dir="rtl"` | rtl-specialist | ⬜ | PRD §10.2 | T-Q-001 |
| T-Q-003 | Canvas RAF profiler report @ 50 nodes | qa-test-lead | ⬜ | PRD §10.1 | T-Q-001 |
| T-Q-004 | Integration tests — all API routes | qa-test-lead | ⬜ | ARCHITECTURE.md §12 | Phase 2 complete |
| T-Q-005 | Unit test coverage report → target: stores 90%, lib 90% | qa-test-lead | ⬜ | — | T-Q-004 |
| T-Q-006 | Zero-text SVG ingestion attack test | security-auditor | ⬜ | PRD §10.4 | T-F008-006 |
| T-Q-007 | CSS injection test via color input | security-auditor | ⬜ | PRD §10.4 | Phase 1 complete |
| T-Q-008 | Context overflow test — 32k+ token context → graceful error | qa-test-lead | ⬜ | F-005 §6 | T-F005-016 |
| T-Q-009 | Hardlock gate tests — RTL + WCAG block generation | qa-test-lead | ⬜ | SPEC-DS-CANVAS-001 §8 | T-F005-013 |

---

## Phase 4 — Ship

| ID | Task | Owner | Status | Depends on |
|---|---|---|---|---|
| T-S-001 | Update `HANDOFF_QUEUE.yaml` — set HO-CANVAS-001 to `complete` | PM-01 | ⬜ | Phase 3 complete |
| T-S-002 | Tag release `v1.0.0` | gitops-engineer | ⬜ | T-S-001 |
| T-S-003 | Update NEZAM CHANGELOG.md | docs-hygiene | ⬜ | T-S-002 |

---

## Summary

| Phase | Tasks | P0 | P1 | Status |
|---|---|---|---|---|
| 0 — Foundation | 7 | 7 | 0 | 🔄 3/7 done |
| 1A — Token Studio | 20 | 20 | 0 | ✅ 20/20 · all P0 features complete |
| 1B — Infinity Canvas | 18 | 18 | 0 | ⬜ |
| 1C — Property Inspector | 10 | 10 | 0 | ⬜ |
| 2A — Motion Studio | 8 | 0 | 8 | ⬜ |
| 2B — Asset Browser | 8 | 0 | 8 | ⬜ |
| 3 — Quality | 9 | 9 | 0 | ⬜ |
| 4 — Ship | 3 | 3 | 0 | ⬜ |
| **TOTAL** | **83** | **67** | **16** | |

---

## Already Implemented (from prior sessions)

| File | Status |
|---|---|
| `.nezam/design-server/src/store/canvas-graph.store.ts` | ✅ Complete — SPEC-DS-CANVAS-001 v1.0.0 |
| `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md` | ✅ Complete |
| `docs/architecture/GENERATIVE_PROPAGATION_FLOW.md` | ✅ Complete |
| `DESIGN.md` (nezam-obsidian-cyan-orange) | ✅ Complete |
| `docs/plans/00-define/01-product/PRD.md` | ✅ Locked v2.0.0 |
| `docs/plans/00-define/01-product/PROJECT_PROMPT.md` | ✅ Complete |
| `docs/plans/00-define/specs/F-001 to F-005, F-007` | ✅ Complete |

---

*Generated: 2026-05-18 | Source: PRD v2.0.0 · Feature Specs · SPEC-DS-CANVAS-001*
