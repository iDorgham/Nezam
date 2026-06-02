# MASTER TASKS — NEZAM (Planning synthesis)

| Field | Value |
|---|---|
| Document | MASTER_TASKS.md |
| Status | Active |
| Source | PRD P0/P1 + specs F-001..F-003 + `.nezam/core/plans/MASTER_TASKS.md` |
| Last updated | 2026-05-29 |
| Planning gate | `planning_complete: true` |

---

## Phase map

| Phase | Focus | Gate |
|---|---|---|
| **P0 Foundation** | Design Hub stability, sync, gates | `develop_phases.phase_1` |
| **P1 Hardening** | CI, docs site, token automation | Phase 2 |
| **P2 Ecosystem** | Plugins, templates, community | Phase 3+ |

---

## P0 tasks (launch-critical)

### T-P0-001 — Design Hub dev/build green

| Field | Value |
|---|---|
| **Spec** | F-001-design-hub |
| **Owner** | `lead-frontend-architect`, `design-hub-specialist` |
| **assigned_tool** | cursor |
| **AC-1** | `pnpm --filter design-hub dev` on port 4000 |
| **AC-2** | `pnpm --filter design-hub build` succeeds |
| **AC-3** | Architecture ↔ wireframe 1:1 `archPageId` binding |
| **RICE** | Reach 10 · Impact 3 · Confidence 0.9 · Effort 3 → **9.0** |

### T-P0-002 — AI mirror sync integrity

| Field | Value |
|---|---|
| **Spec** | F-002-ai-sync |
| **Owner** | `devops-manager`, `knowledge-update-manager` |
| **assigned_tool** | cursor |
| **AC-1** | `pnpm ai:sync` after `.cursor/` edit |
| **AC-2** | `pnpm ai:check` passes in CI |
| **AC-3** | Pre-commit hook documented in README |
| **RICE** | Reach 10 · Impact 3 · Confidence 0.95 · Effort 2 → **14.25** |

### T-P0-003 — SDD gate enforcement

| Field | Value |
|---|---|
| **Spec** | F-003-sdd-gates |
| **Owner** | `swarm-leader`, `lead-qa-architect` |
| **security** | true |
| **AC-1** | `check-onboarding-readiness.sh` exits 0 |
| **AC-2** | `wireframes_locked.json` validated in CI |
| **AC-3** | `/plan` and `/develop` hardlocks documented in commands |
| **RICE** | Reach 10 · Impact 3 · Confidence 0.85 · Effort 2 → **12.75** |

### T-P0-004 — Wireframe lock export path

| Field | Value |
|---|---|
| **Owner** | `design-hub-wireframe`, `masri-wireframe-specialist` (if MENA) |
| **Depends** | T-P0-001 |
| **AC-1** | Export writes valid `wireframes_locked.json` at repo root |
| **AC-2** | `arch_page_id` mapping documented in `WIREFRAMES.md` |
| **AC-3** | `/develop` blocked without lock (verified manually) |

### T-P0-005 — Planning artifacts complete

| Field | Value |
|---|---|
| **Owner** | `project-architect` |
| **Status** | ✅ Complete (2026-05-29) |
| **AC-1** | `docs/plan/01-research/SEO_RESEARCH.md` |
| **AC-2** | `docs/plan/02-ia/IA_CONTENT.md` |
| **AC-3** | `docs/plan/03-content/CONTENT_MAP.md` |
| **AC-4** | `docs/plan/scaffold/PROJECT_SCAFFOLD.md` |

---

## P1 tasks (important)

| ID | Task | Owner | Effort |
|---|---|---|---|
| T-P1-001 | Token emit script `design:tokens:emit` from DESIGN.md | design-systems-token-architect | M |
| T-P1-002 | Public docs site from `docs/plan/03-content/` | content-strategist + frontend-lead | L |
| T-P1-003 | RICE prioritize full backlog (`/plan prioritize`) | swarm-leader | S |
| T-P1-004 | Design excellence audit `--strict` | design-excellence-lead | M |

---

## P2 tasks (nice-to-have)

| ID | Task | Notes |
|---|---|---|
| T-P2-001 | Arabic/MENA SEO brief | If `target_market` includes mena |
| T-P2-002 | Plugin marketplace for NEZAM commands | Community |

---

## Phase 3 — Quality, Hardlock Verification, RTL Audit (T-Q-*)

Gate: `develop_phases.phase_3`. Surface: `.nezam/design-hub`. Specs in `00-define/specs/`.

| ID | Task | Spec | Owner | Surface |
|---|---|---|---|---|
| T-Q-001 | axe-core a11y coverage for UI primitives | SPEC-QA-001 | a11y-performance-auditor | `src/components/ui/*`, `src/lib/color-a11y.ts` |
| T-Q-002 | RTL rendering audit (logical properties) | SPEC-QA-002 | rtl-layout-specialist | `src/lib/wireframe/sidebar-shell-layout.ts`, `src/styles/*` |
| T-Q-003 | rAF / motion frame-budget profiler | SPEC-QA-003 | motion-performance-specialist | `src/lib/preview/schedule-idle.ts`, `Scrubber.tsx` |
| T-Q-004 | API route integration tests | SPEC-QA-004 | api-logic-manager | `app/api/{canvas,assets,presets,lock,context}` |
| T-Q-005 | Unit coverage (lib + stores) | SPEC-QA-005 | lead-qa-architect | `src/lib/{canvas-math,token-injection}.ts`, `src/store/*` |
| T-Q-006 | Security: SVG sanitization + upload validation | SPEC-QA-006 | app-security-manager | `src/lib/svg-sanitizer.ts`, `app/api/assets/upload` |
| T-Q-007 | Security: AI route hardening + secret hygiene | SPEC-QA-007 | lead-security-officer | `app/api/ai/*` |
| T-Q-008 | Context compression / overflow handling | SPEC-QA-008 | prompt-engineer | `src/lib/context-compression.ts`, `app/api/context` |
| T-Q-009 | Hardlock / SDD gate behavior tests | SPEC-QA-009 | lead-qa-architect | `src/lib/hardlock-check.ts`, gate scripts |

**In scope (build + test):** T-Q-006, T-Q-008, T-Q-009 modules are reserved `export {}` stubs and are being implemented as security/safety hardening, then tested.
**Test now (already real):** T-Q-001, T-Q-002, T-Q-003, and T-Q-005 (`session.store` only).
**Deferred to a feature phase (reserved stubs, not security-critical):** `canvas-math.ts`, `token-injection.ts`, `tokens.store.ts` — their T-Q-005 ACs are excluded from the phase-3 exit gate until the features are built.

Exit criteria: in-scope T-Q suites green under `pnpm --filter design-hub test`; a11y gate (WCAG 2.2 AA) passes; no TODO/FIXME in touched files; `develop review` checklist satisfied before `develop complete phase_3`.

---

## Traceability

| AC-ID | Spec | Implementation target |
|---|---|---|
| F-001-AC-1 | F-001 | `.nezam/design-hub/` |
| F-002-AC-1 | F-002 | `.nezam/core/scripts/sync/` |
| F-003-AC-1 | F-003 | `.nezam/core/scripts/checks/` |
| SPEC-QA-001..009 | T-Q-001..009 | `.nezam/design-hub/{src,app,tests}` |

---

## Next legal command

```
/develop start
```

Prerequisites: `planning_complete: true`, `PROJECT_SCAFFOLD.md` confirmed, `wireframes_locked.json` present.
