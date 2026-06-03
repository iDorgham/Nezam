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

**Status: ✅ complete 2026-06-03** — all in-scope T-Q tasks done; 124 tests green; deferred feature-module unit tests tracked separately.

---

## Phase 4 — Polish & Optimization (T-P4-*)

Gate: `develop_phases.phase_4`. Surface: `.nezam/design-hub`. Specs in `00-define/specs/`.

| ID | Task | Spec | Owner | Surface |
|---|---|---|---|---|
| T-P4-001 | a11y coverage for complex Radix components | SPEC-AX-001 | a11y-performance-auditor | `src/components/ui/{dialog,select,tabs,dropdown-menu,tooltip}.tsx` |
| T-P4-002 | Performance budget gate (Lighthouse CI + RSC guard) | SPEC-PERF-001 | frontend-performance-manager | `.lighthouserc.json`, `app/*/page.tsx` |
| T-P4-003 | UX states (loading / error / not-found) | SPEC-UX-001 | lead-uiux-designer | `app/{loading,error,not-found}.tsx`, UX primitives |

**Selected scope:** a11y deepening, Performance/Lighthouse, UX states. **Deferred:** per-route SEO metadata (not selected this phase).
**Runtime note:** the full Lighthouse run requires headless Chrome and executes in CI; the locally-verifiable T-P4-002 surface is the budget-config validation + RSC-boundary guard.

Exit criteria: T-P4 suites green under `pnpm --filter design-hub test`; a11y gate passes incl. Radix components; no new hex/px primitives; `develop review` satisfied before `develop complete phase_4`.

**Status: ✅ complete 2026-06-03** — all T-P4 tasks done; 137 tests green; type-check clean; a11y gate 14 tests.

---

## Phase 5 — Hardening (T-P5-*)

Gate: `develop_phases.phase_5`. Surface: `.nezam/design-hub` + root deps. Specs in `00-define/specs/`.

| ID | Task | Spec | Owner | Surface |
|---|---|---|---|---|
| T-P5-001 | Path-traversal regression tests | SPEC-SEC-001 | app-security-manager | `app/api/pages/[pageId]` |
| T-P5-002 | Dependency CVE audit + CI wiring | SPEC-SEC-002 | lead-security-officer | root `package.json`, `docs/reports/security/` |
| T-P5-003 | Error/secret-leakage sweep | SPEC-SEC-003 | lead-security-officer | `app/api/{context,lock,ai}` |
| T-P5-004 | Edge-case fuzz of security modules | SPEC-SEC-004 | app-security-manager | `src/lib/{svg-sanitizer,context-compression,hardlock-check}.ts` |

**Builds on Phase 3:** extends T-Q-006/007 (no duplication). **Audit note:** `pnpm audit` is unavailable on the configured mirror; `npm audit` against the public registry surfaced 2 moderate CVEs (postcss <8.5.10 → next), documented in `docs/reports/security/dependency-audit.md`.

Exit criteria: T-P5 suites green; CVE findings documented + remediation planned; no TODO/FIXME; `develop review` satisfied before `develop complete phase_5`.

**Status: ✅ complete 2026-06-03** — all T-P5 tasks done; 180 tests green; type-check clean; committed on `feature/phase4-5-hardening-polish`.

---

## Phase 6 — Ship (T-P6-*)

Gate: `develop_phases.phase_6`. Release-prep only — **no live deploy** (human-gated).

| ID | Task | Spec | Owner | Surface |
|---|---|---|---|---|
| T-P6-001 | Release-readiness go/no-go report | SPEC-SHIP-001 | devops-manager | `docs/reports/release/readiness.md` |
| T-P6-002 | Finalize CHANGELOG (0.2.0) | SPEC-SHIP-002 | docs-hygiene | `CHANGELOG.md` |
| T-P6-003 | Fix release tooling branch (main→Master) | SPEC-SHIP-003 | gitops-engineer | `release.config.cjs`, `.github/workflows/release.yml` |
| T-P6-004 | Open PR for the branch | SPEC-SHIP-004 | ci-automation | GitHub PR |

**Deploy deferred:** no `vercel.json`/`vercel.ts` in repo; a live staging/production deploy requires Vercel linking + env/secrets + explicit human approval (see readiness report). **CVE hold:** postcss `>=8.5.10` override must be CI-verified before a production cut.

Exit criteria: readiness GO for tag+PR; CHANGELOG 0.2.0 finalized; release config targets `Master`; PR opened; `develop review` satisfied before `develop complete phase_6`.

**Status: ✅ complete 2026-06-03** — ship-prep done (PR #41). Production deploy deferred (human-gated). **All 6 develop phases complete.**

---

## Traceability

| AC-ID | Spec | Implementation target |
|---|---|---|
| F-001-AC-1 | F-001 | `.nezam/design-hub/` |
| F-002-AC-1 | F-002 | `.nezam/core/scripts/sync/` |
| F-003-AC-1 | F-003 | `.nezam/core/scripts/checks/` |
| SPEC-QA-001..009 | T-Q-001..009 | `.nezam/design-hub/{src,app,tests}` |
| SPEC-AX/PERF/UX-001 | T-P4-001..003 | `.nezam/design-hub/{app,src}` |

---

## Next legal command

```
/develop start
```

Prerequisites: `planning_complete: true`, `PROJECT_SCAFFOLD.md` confirmed, `wireframes_locked.json` present.
