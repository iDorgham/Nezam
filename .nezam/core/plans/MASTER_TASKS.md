# MASTER TASKS — NEZAM (Planning synthesis)

| Field | Value |
|---|---|
| Document | MASTER_TASKS.md |
| Status | Active |
| Source | PRD P0/P1 + specs F-001..F-003 + `.nezam/core/plans/MASTER_TASKS.md` |
| Last updated | 2026-06-05 |
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
| **AC-1** | `.nezam/core/plans/01-research/SEO_RESEARCH.md` |
| **AC-2** | `.nezam/core/plans/02-ia/IA_CONTENT.md` |
| **AC-3** | `.nezam/core/plans/03-content/CONTENT_MAP.md` |
| **AC-4** | `.nezam/core/plans/scaffold/PROJECT_SCAFFOLD.md` |

---

## P1 tasks (important)

| ID | Task | Owner | Effort |
|---|---|---|---|
| T-P1-001 | Token emit script `design:tokens:emit` from DESIGN.md | design-systems-token-architect | M |
| T-P1-002 | Public docs site from `.nezam/core/plans/03-content/` | content-strategist + frontend-lead | L |
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

## v3.2 — Health 100/100 (T-V32-*)

> Added 2026-06-05. Target: 2026-06-25. Source: `ROADMAP_v3.2_HEALTH_100.md` + ADR-0002..0005.
> Gate: all v3.2 tasks complete before `v3.2` tag. Critical path: P1 + P2 (done by 2026-06-14).

### Phase map (v3.2)

| Phase | Focus | Target window | Status |
|---|---|---|---|
| **v3.2-P1** | Foundation: sync, state, Husky | 2026-06-04 → 2026-06-07 | ⏳ |
| **v3.2-P2** | CI/CD pipeline validation | 2026-06-08 → 2026-06-14 | 🔒 |
| **v3.2-P3** | Security scanning automation | 2026-06-08 → 2026-06-14 | 🔒 |
| **v3.2-P4** | Design system + wireframe bridge | 2026-06-10 → 2026-06-16 | 🔒 |
| **v3.2-P5** | Content ops + observability | 2026-06-12 → 2026-06-18 | 🔒 |
| **v3.2-P6** | Integration, docs, QA, release | 2026-06-16 → 2026-06-21 | 🔒 |

---

### v3.2-P1 — Foundation: Sync & State (T-V32-1-*)

Gate: all v3.2-P1 tasks done → v3.2-P2 unlocked. Owner: DevOps Lead.

| ID | Task | ADR | Owner | Surface | AC |
|---|---|---|---|---|---|
| T-V32-1-001 | Run `pnpm ai:sync` + `pnpm ai:check`; zero drift baseline | — | devops-manager | `.cursor/` → mirrors | `ai:check` exits 0; drift < 0.5% |
| T-V32-1-002 | Audit + remove orphaned skills; update registry | — | devops-manager | `.cursor/skills/archive/` | 0 orphaned skills in registry |
| T-V32-1-003 | Run `pnpm verify:yaml` on all state files; fix parse errors | — | devops-manager | `.cursor/state/*.yaml` | `verify:yaml` exits 0 |
| T-V32-1-004 | Extend `agent-status.yaml`: `last_sync`, `certified_agents`, `versioning`, `sync_drift_threshold` | — | deputy-swarm-leader | `.cursor/state/agent-status.yaml` | Schema valid; no missing fields |
| T-V32-1-005 | Add weekly drift detection to CI (`sync-drift-check.yml` promoted to blocking) | ADR-0002 | devops-manager | `.github/workflows/sync-drift-check.yml` | Workflow runs on schedule; Slack alert if drift > 1% |
| T-V32-1-006 | Write sync runbook | — | docs-hygiene | `.nezam/core/docs/SYNC_RUNBOOK.md` | File exists; covers recovery + rollback |
| T-V32-1-007 | Verify Husky pre-commit on all dev machines; add to CONTRIBUTING.md | ADR-0002 | devops-manager | `.husky/pre-commit`, `CONTRIBUTING.md` | Hook runs `pnpm ai:sync` on `.cursor/` stage |

**assigned_tool:** cursor  
**Exit criteria:** drift = 0, YAML clean, runbook written, Husky enforced.

---

### v3.2-P2 — CI/CD Pipeline (T-V32-2-*)

Gate: v3.2-P1 complete. Depends on ADR-0002. Owner: DevOps Lead + SRE.

| ID | Task | ADR | Owner | Surface | AC |
|---|---|---|---|---|---|
| T-V32-2-001 | Test full Tier-1 CI pipeline end-to-end on feature branch | ADR-0002 | devops-manager | `.github/workflows/nezam-pr-gates.yml` | All 7 design gates + lint + typecheck green on test PR |
| T-V32-2-002 | Validate release workflow targets `Master`; test tag creation | ADR-0002 | gitops-engineer | `.github/workflows/release.yml` | Release runs, tag created, rollback step present |
| T-V32-2-003 | Add `codeql-analysis.yml`; set critical/high threshold | ADR-0003 | app-security-manager | `.github/workflows/codeql-analysis.yml` | CodeQL runs on PR; critical findings block merge |
| T-V32-2-004 | Add `lhci` perf budget step to nightly workflow | ADR-0004 | frontend-performance-manager | `.github/workflows/nezam-nightly.yml` | LCP < 2.5s · CLS < 0.1 · INP < 200ms gated |
| T-V32-2-005 | Create `ci-health-check.yml` weekly summary | ADR-0004 | devops-manager | `.github/workflows/ci-health-check.yml` | Runs every Monday; summary posted to Actions |
| T-V32-2-006 | Write `CI_FAILURE_GUIDE.md` covering all gate failure modes | ADR-0002 | docs-hygiene | `.nezam/core/docs/CI_FAILURE_GUIDE.md` | 20+ failure scenarios documented; rollback steps per stage |

**assigned_tool:** cursor  
**Exit criteria:** Tier-1 gates green on test PR; release workflow tested; CI failure guide written.

---

### v3.2-P3 — Security Scanning (T-V32-3-*)

Gate: v3.2-P1 complete. Parallel with P2. Depends on ADR-0003. Owner: Security Officer.

| ID | Task | ADR | Owner | Surface | AC | security |
|---|---|---|---|---|---|---|
| T-V32-3-001 | Enable GitHub CodeQL; configure JS/TS; test on feature branch | ADR-0003 | lead-security-officer | `.github/workflows/codeql-analysis.yml` | Critical/high block PR merge | true |
| T-V32-3-002 | Enable GitHub DependaBot; weekly pnpm; major = manual | ADR-0003 | lead-security-officer | `.github/dependabot.yml` | Auto-PR for patch/minor lands weekly | true |
| T-V32-3-003 | Enable GitHub secret scanning + push protection | ADR-0003 | lead-security-officer | GitHub repo settings | Push blocked on known secret patterns | true |
| T-V32-3-004 | Run `/scan security`; document findings in `SECURITY_AUDIT_v3.2.md` | ADR-0003 | lead-security-officer | `docs/reports/security/` | All findings categorized by severity; remediation plan |true |
| T-V32-3-005 | Define secrets rotation schedule; document in runbook | ADR-0003 | lead-security-officer | `.nezam/core/docs/SECURITY_RUNBOOK.md` | Auth0 quarterly; GitHub tokens on team change; in runbook | true |
| T-V32-3-006 | Capture `SECURITY_BASELINE.md` snapshot | ADR-0003 | lead-security-officer | `.nezam/core/meta/SECURITY_BASELINE.md` | CodeQL status + DependaBot status + scan results recorded | true |

**assigned_tool:** cursor (security: true tasks stay on primary reasoning lane)  
**Exit criteria:** All 3 GitHub scanning tools enabled; audit complete; runbook written; baseline captured.

---

### v3.2-P4 — Design System + Wireframe Bridge (T-V32-4-*)

Gate: v3.2-P1 complete. Parallel with P2/P3. Depends on ADR-0005. Owner: Design Lead + Frontend Lead.

| ID | Task | ADR | Owner | Surface | AC |
|---|---|---|---|---|---|
| T-V32-4-001 | Fix empty blocks in `block_registry.json`; add `pnpm design:validate-blocks` | ADR-0005 | design-hub-specialist | `.nezam/design-hub/` | `validate-blocks` exits 0; no empty `properties` arrays |
| T-V32-4-002 | Bump `wireframes_locked.json` schema to v2.0 | ADR-0005 | frontend-lead | `wireframes_locked.json` | Schema includes `block_count`, `figma_synced`, `figma_frame_ids` |
| T-V32-4-003 | Add `GATE-WF-02` to `GITHUB_GATE_MATRIX.json` | ADR-0005 | devops-manager | `.nezam/core/gates/GITHUB_GATE_MATRIX.json` | Gate fails if `block_registry.json` has empty properties |
| T-V32-4-004 | Test lock→unlock cycle on 3 project types | ADR-0005 | design-hub-specialist | Design Hub wireframe session | All 3 project types lock/unlock without data loss |
| T-V32-4-005 | Provision Figma MCP auth (optional); document token setup | ADR-0005 | design-lead | `.env.local`, `.nezam/core/docs/WIREFRAME_RUNBOOK.md` | Token documented; sync script (`design:figma:sync`) implemented |
| T-V32-4-006 | Write `DESIGN_TO_CODE.md` workflow | ADR-0005 | docs-hygiene | `.nezam/core/docs/DESIGN_TO_CODE.md` | Covers lock→implement flow; no pixel-guessing required |
| T-V32-4-007 | Design token audit: verify no raw hex/px in governed CSS paths | ADR-0004 | lead-styling-theming-architect | `.nezam/design-hub/src/` | `check:tokens` exits 0; all 7 design gates green |

**assigned_tool:** cursor  
**Exit criteria:** Empty blocks resolved; lock schema v2.0; GATE-WF-02 active; design-to-code workflow documented.

---

### v3.2-P5 — Observability + Content Ops (T-V32-5-*)

Gate: v3.2-P2 complete. Parallel with P4. Depends on ADR-0004. Owner: Frontend Performance Lead + Analytics Engineer + Content Strategist.

| ID | Task | ADR | Owner | Surface | AC |
|---|---|---|---|---|---|
| T-V32-5-001 | Add `@sentry/nextjs` to Design Hub; upload source maps on build | ADR-0004 | frontend-performance-manager | `.nezam/design-hub/` | Sentry captures errors in production; source maps resolve |
| T-V32-5-002 | Instrument `web-vitals` reporting (LCP, CLS, INP) in Design Hub | ADR-0004 | frontend-performance-manager | `.nezam/design-hub/app/layout.tsx` | Vitals reported; values meet perf budget thresholds |
| T-V32-5-003 | Document perf baseline in `PERF_BASELINE.md` | ADR-0004 | frontend-performance-manager | `.nezam/core/reports/PERF_BASELINE.md` | LCP/CLS/INP per route; bundle size gzipped; API p50+p99 |
| T-V32-5-004 | Write `OBSERVABILITY_RUNBOOK.md` | ADR-0004 | docs-hygiene | `.nezam/core/docs/OBSERVABILITY_RUNBOOK.md` | Covers: debug with Sentry, investigate perf, escalation |
| T-V32-5-005 | Run `/plan seo` on first real project; validate SEO/AEO baseline | — | arabic-seo-aeo-specialist | `.nezam/core/reports/SEO_BASELINE.md` | SEO strategy documented; AEO tested on ≥ 2 AI engines |
| T-V32-5-006 | Create content templates (blog, product page, hub page, landing page) | — | content-strategist | `.nezam/templates/content/` | 4 templates with embedded SEO + AEO checklist |
| T-V32-5-007 | Write `CONTENT_OPS.md` workflow | — | content-strategist | `.nezam/core/docs/CONTENT_OPS.md` | Covers: intake → outline → draft → review → publish |

**assigned_tool:** cursor  
**Exit criteria:** Sentry live; vitals reported; perf baseline documented; SEO/AEO baseline established.

---

### v3.2-P6 — Integration, Docs, QA + Release (T-V32-6-*)

Gate: v3.2-P1..P5 all complete. Owner: Technical Writer + Swarm Leader + QA Lead.

| ID | Task | ADR | Owner | Surface | AC |
|---|---|---|---|---|---|
| T-V32-6-001 | Index all v3.2 runbooks in `RUNBOOKS.md` | — | docs-hygiene | `.nezam/core/docs/RUNBOOKS.md` | 6+ runbooks indexed; each has current status |
| T-V32-6-002 | Write `TROUBLESHOOTING.md` (20+ scenarios) | — | docs-hygiene | `.nezam/core/docs/TROUBLESHOOTING.md` | FAQ format; links to runbooks; escalation path |
| T-V32-6-003 | Write `ONBOARDING.md` for new developers | — | docs-hygiene | `.nezam/core/docs/ONBOARDING.md` | Covers: Husky setup, first commit, first PR, CI gates |
| T-V32-6-004 | Full system regression: plan → develop → scan → fix | — | lead-qa-architect | Full workspace | No regressions vs v3.1; all 6 develop phases still pass |
| T-V32-6-005 | Load test CI: 5 simultaneous PRs; verify no race conditions | ADR-0002 | devops-manager | `.github/workflows/nezam-pr-gates.yml` | All 5 PRs complete; no timeouts; no gate flakes |
| T-V32-6-006 | Production readiness checklist: all systems > 90% | — | swarm-leader | `.nezam/core/reports/v3.2_RELEASE_APPROVAL.md` | Checklist 100%; each role lead sign-off captured |
| T-V32-6-007 | Update README + CHANGELOG with v3.2 features + release notes | — | docs-hygiene | `README.md`, `CHANGELOG.md` | v3.2 section in CHANGELOG; README health table updated |
| T-V32-6-008 | Tag `v3.2.0` on Master; trigger release workflow | ADR-0002 | gitops-engineer | GitHub / `release.yml` | Tag created; release artifact generated; deploy-deferred note in release |

**assigned_tool:** cursor  
**Exit criteria:** All runbooks indexed; regression clean; release approval documented; v3.2.0 tagged.

---

## Traceability (extended for v3.2)

| AC-ID | Spec | Implementation target |
|---|---|---|
| F-001-AC-1 | F-001 | `.nezam/design-hub/` |
| F-002-AC-1 | F-002 | `.nezam/core/scripts/sync/` |
| F-003-AC-1 | F-003 | `.nezam/core/scripts/checks/` |
| SPEC-QA-001..009 | T-Q-001..009 | `.nezam/design-hub/{src,app,tests}` |
| SPEC-AX/PERF/UX-001 | T-P4-001..003 | `.nezam/design-hub/{app,src}` |
| ADR-0002 | T-V32-2-001..006 | `.github/workflows/`, `.nezam/core/docs/` |
| ADR-0003 | T-V32-3-001..006 | `.github/`, `.nezam/core/{docs,meta,reports}/` |
| ADR-0004 | T-V32-5-001..004 | `.nezam/design-hub/`, `.nezam/core/reports/` |
| ADR-0005 | T-V32-4-001..006 | `.nezam/design-hub/`, `.nezam/core/gates/`, `wireframes_locked.json` |

---

## Next legal command

```
/develop start   # begin v3.2-P1 (Foundation hardening)
```

Prerequisites: `planning_complete: true`, `PROJECT_SCAFFOLD.md` confirmed, `wireframes_locked.json` present.
