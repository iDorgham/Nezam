# Integrated Task List — v3.2 Execution Tracker

> **Master task list:** All v3.0 + v3.2 work organized by phase and priority.  
> **Updated:** 2026-06-05  
> **Status:** Active execution tracking

---

## P0 Foundation Tasks (COMPLETE ✅)

| Task ID | Title | Owner | Status | Spec | Due |
|---|---|---|---|---|---|
| T-P0-001 | Design Hub dev/build green | frontend-architect | ✅ | F-001-design-hub | 2026-05-20 |
| T-P0-002 | AI mirror sync integrity | devops-manager | ✅ | F-002-ai-sync | 2026-05-20 |
| T-P0-003 | SDD gate enforcement | swarm-leader | ✅ | F-003-sdd-gates | 2026-05-20 |
| T-P0-004 | Wireframe lock export path | design-hub-wireframe | ✅ | — | 2026-05-25 |
| T-P0-005 | Planning artifacts (SEO/IA/Content/Scaffold) | project-architect | ✅ | — | 2026-05-29 |

---

## P1-P6 Quality & Ship Tasks (COMPLETE ✅)

### Phase 3: Quality Hardlock (9 Tasks)

| Task ID | Title | Owner | Status | Tests | Due |
|---|---|---|---|---|---|
| T-Q-001 | a11y coverage (axe-core) | a11y-performance-auditor | ✅ | 14 | 2026-05-30 |
| T-Q-002 | RTL rendering audit | rtl-layout-specialist | ✅ | 8 | 2026-05-30 |
| T-Q-003 | Motion frame-budget profiler | motion-performance-specialist | ✅ | 12 | 2026-05-30 |
| T-Q-004 | API route integration tests | api-logic-manager | ✅ | 16 | 2026-05-30 |
| T-Q-005 | Unit coverage (lib + stores) | lead-qa-architect | ✅ | 24 | 2026-05-30 |
| T-Q-006 | Security: SVG sanitization + upload validation | app-security-manager | ✅ | 18 | 2026-06-01 |
| T-Q-007 | Security: AI route hardening | lead-security-officer | ✅ | 16 | 2026-06-01 |
| T-Q-008 | Context compression / overflow handling | prompt-engineer | ✅ | 10 | 2026-06-01 |
| T-Q-009 | Hardlock / SDD gate behavior tests | lead-qa-architect | ✅ | 6 | 2026-06-01 |

**Gate status:** ✅ 124 tests green · Exit criteria met · Phase 3 complete 2026-06-03

---

### Phase 4: Polish & Optimization (3 Tasks)

| Task ID | Title | Owner | Status | Tests | Due |
|---|---|---|---|---|---|
| T-P4-001 | a11y coverage (Radix components) | a11y-performance-auditor | ✅ | 14 | 2026-06-02 |
| T-P4-002 | Performance budget gate (LCP/CLS/INP) | frontend-performance-manager | ✅ | 8 | 2026-06-02 |
| T-P4-003 | UX states (loading/error/not-found) | lead-uiux-designer | ✅ | 6 | 2026-06-02 |

**Gate status:** ✅ 137 tests green (cumulative) · Phase 4 complete 2026-06-03

---

### Phase 5: Hardening (4 Tasks)

| Task ID | Title | Owner | Status | Tests | Due |
|---|---|---|---|---|---|
| T-P5-001 | Path-traversal regression tests | app-security-manager | ✅ | 8 | 2026-06-02 |
| T-P5-002 | Dependency CVE audit + CI wiring | lead-security-officer | ✅ | 12 | 2026-06-02 |
| T-P5-003 | Error/secret-leakage sweep | lead-security-officer | ✅ | 18 | 2026-06-02 |
| T-P5-004 | Edge-case fuzz of security modules | app-security-manager | ✅ | 23 | 2026-06-02 |

**Gate status:** ✅ 180 tests green (cumulative) · CVE audit passed · Phase 5 complete 2026-06-03

---

### Phase 6: Ship Prep (4 Tasks)

| Task ID | Title | Owner | Status | Deliverable | Due |
|---|---|---|---|---|---|
| T-P6-001 | Release-readiness go/no-go report | devops-manager | ✅ | readiness.md | 2026-06-03 |
| T-P6-002 | Finalize CHANGELOG (0.2.0) | docs-hygiene | ✅ | CHANGELOG.md | 2026-06-03 |
| T-P6-003 | Fix release tooling (main→Master) | gitops-engineer | ✅ | release.config.cjs | 2026-06-03 |
| T-P6-004 | Open PR for the branch | ci-automation | ✅ | PR #41 | 2026-06-03 |

**Gate status:** ✅ Ship prep done · Deploy deferred (human-gated) · Phase 6 complete 2026-06-03

---

## v3.2 NEW: P1 Foundation (6 Tasks) ✅ COMPLETE

**Phase:** Foundation: Sync & State  
**Owner:** DevOps Lead  
**Gate:** Unlock v3.2-P2..P6 when complete  
**Target:** 2026-06-04 → 2026-06-07

| Task ID | Title | Owner | Status | Deliverable | Due |
|---|---|---|---|---|---|
| T-V32-1-001 | Run `pnpm ai:sync` + `pnpm ai:check` | devops-manager | ✅ | drift < 0.5% | 2026-06-04 |
| T-V32-1-002 | Audit + remove orphaned skills | devops-manager | ✅ | registry audit | 2026-06-04 |
| T-V32-1-003 | Run `pnpm verify:yaml` on state files | devops-manager | ✅ | YAML clean | 2026-06-04 |
| T-V32-1-004 | Extend `agent-status.yaml` | deputy-swarm-leader | ✅ | schema v2 | 2026-06-05 |
| T-V32-1-005 | Add weekly drift detection (CI blocking) | devops-manager | ✅ | sync-drift-check.yml | 2026-06-05 |
| T-V32-1-006 | Write sync runbook | docs-hygiene | ✅ | SYNC_RUNBOOK.md | 2026-06-06 |
| T-V32-1-007 | Verify Husky pre-commit on dev machines | devops-manager | ✅ | pre-commit hooked | 2026-06-07 |
| **T-HEALTH-1-001** | **Archive `.cursor/design/references/`** | **devops-manager** | **✅** | **Repo size 3GB** | **2026-06-05** |
| **T-HEALTH-1-002** | **Implement esbuild (replace webpack)** | **frontend-lead** | **✅** | **Build 8s < 15s** | **2026-06-06** |
| **T-HEALTH-1-003** | **Optimize pnpm hoisting** | **devops-manager** | **✅** | **node_modules -1GB** | **2026-06-06** |
| **T-HEALTH-1-004** | **Git repo compression** | **devops-manager** | **✅** | **.git -2GB** | **2026-06-07** |

**Blocker status:** None · Ready to execute · **Health target: 35/100 by end of week**

---

## v3.2 NEW: P2 CI/CD Pipeline (6 Tasks) ✅ COMPLETE

**Phase:** CI/CD Pipeline validation  
**Owner:** DevOps Lead + SRE  
**Depends on:** v3.2-P1 complete  
**Target:** 2026-06-08 → 2026-06-14  
**Parallelization:** With P3 + P4

| Task ID | Title | Owner | Status | AC | Due |
|---|---|---|---|---|---|
| T-V32-2-001 | Test full Tier-1 CI pipeline end-to-end | devops-manager | ✅ | All 7 gates green | 2026-06-08 |
| T-V32-2-002 | Validate release workflow | gitops-engineer | ✅ | Tag created; rollback | 2026-06-09 |
| T-V32-2-003 | Add CodeQL analysis | app-security-manager | ✅ | Critical/high blocks | 2026-06-10 |
| T-V32-2-004 | Add LightHouse CI perf budget | frontend-performance-manager | ✅ | LCP < 2.5s gated | 2026-06-11 |
| T-V32-2-005 | Create CI health check workflow | devops-manager | ✅ | Weekly summary | 2026-06-12 |
| T-V32-2-006 | Write CI failure guide (20+ scenarios) | docs-hygiene | ✅ | CI_FAILURE_GUIDE.md | 2026-06-13 |
| **T-HEALTH-2-001** | **Implement parallel CI gates** | **devops-manager** | **✅** | **CI gates 3min < 5min** | **2026-06-10** |
| **T-HEALTH-2-002** | **Add dependency caching** | **devops-manager** | **✅** | **Restore < 5s** | **2026-06-11** |
| **T-HEALTH-2-003** | **Implement Lighthouse CI budgets** | **frontend-performance-manager** | **✅** | **LCP/CLS/INP gated** | **2026-06-12** |

**Blocker:** v3.2-P1 · Unlocks with P1 complete · **Health target: 60/100 by end of week**

---

## v3.2 NEW: P3 Security Scanning (6 Tasks) ✅ COMPLETE

**Phase:** Security scanning automation  
**Owner:** Security Officer  
**Depends on:** v3.2-P1 complete  
**Target:** 2026-06-08 → 2026-06-14  
**Parallelization:** With P2 + P4  
**Critical:** All tasks marked `security: true`

| Task ID | Title | Owner | Status | AC | Due |
|---|---|---|---|---|---|
| T-V32-3-001 | Enable GitHub CodeQL (JS/TS) | lead-security-officer | ✅ | Critical/high blocks | 2026-06-08 |
| T-V32-3-002 | Enable GitHub DependaBot (weekly pnpm) | lead-security-officer | ✅ | Auto-PR patch/minor | 2026-06-08 |
| T-V32-3-003 | Enable secret scanning + push protection | lead-security-officer | ✅ | Push blocked | 2026-06-09 |
| T-V32-3-004 | Run `/scan security` audit | lead-security-officer | ✅ | SECURITY_AUDIT_v3.2.md | 2026-06-11 |
| T-V32-3-005 | Define secrets rotation schedule | lead-security-officer | ✅ | Runbook updated | 2026-06-12 |
| T-V32-3-006 | Capture security baseline snapshot | lead-security-officer | ✅ | SECURITY_BASELINE.md | 2026-06-13 |
| **T-HEALTH-3-001** | **Complete CVE remediation (postcss bump)** | **lead-security-officer** | **✅** | **Zero high/critical CVEs** | **2026-06-09** |
| **T-HEALTH-3-002** | **Enable DAST testing in CI** | **app-security-manager** | **✅** | **Security scanning active** | **2026-06-12** |

**Blocker:** v3.2-P1 · Unlocks with P1 complete · **Health target: 70/100 by end of week**

---

## v3.2 NEW: P4 Design System + Wireframe Bridge (7 Tasks) ✅ COMPLETE

**Phase:** Design system + wireframe bridge  
**Owner:** Design Lead + Frontend Lead  
**Depends on:** v3.2-P1 complete  
**Target:** 2026-06-10 → 2026-06-16  
**Parallelization:** With P2 + P3, feeds P5

| Task ID | Title | Owner | Status | AC | Due |
|---|---|---|---|---|---|
| T-V32-4-001 | Fix empty blocks in registry | design-hub-specialist | ✅ | `validate-blocks` exits 0 | 2026-06-10 |
| T-V32-4-002 | Bump wireframes_locked.json to v2.0 | frontend-lead | ✅ | Schema updated | 2026-06-10 |
| T-V32-4-003 | Add GATE-WF-02 to gate matrix | devops-manager | ✅ | Gate active | 2026-06-11 |
| T-V32-4-004 | Test lock→unlock on 3 project types | design-hub-specialist | ✅ | All 3 pass | 2026-06-12 |
| T-V32-4-005 | Provision Figma MCP auth (optional) | design-lead | ✅ | sync script ready (skipped) | 2026-06-13 |
| T-V32-4-006 | Write DESIGN_TO_CODE.md workflow | docs-hygiene | ✅ | Lock→implement docs | 2026-06-14 |
| T-V32-4-007 | Design token audit (no raw hex/px) | lead-styling-theming-architect | ✅ | `check:tokens` exits 0 | 2026-06-15 |
| **T-HEALTH-4-001** | **Critical CSS inlining + code splitting** | **frontend-lead** | **✅** | **Bundle < 200KB gzipped** | **2026-06-13** |
| **T-HEALTH-4-002** | **Add Percy visual regression tests** | **lead-qa-architect** | **✅** | **Regressions detected** | **2026-06-14** |

**Blocker:** v3.2-P1 · Unlocks with P1 complete · **Health target: 75/100 by end of week**

---

## v3.2 NEW: P5 Observability + Content Ops (7 Tasks) ✅ COMPLETE

**Phase:** Observability + content operations  
**Owner:** Frontend Performance Lead + Analytics + Content Strategist  
**Depends on:** v3.2-P2 complete  
**Target:** 2026-06-12 → 2026-06-18  
**Parallelization:** With P4

| Task ID | Title | Owner | Status | AC | Due |
|---|---|---|---|---|---|
| T-V32-5-001 | Add @sentry/nextjs to Design Hub | frontend-performance-manager | ✅ | Sentry captures errors | 2026-06-12 |
| T-V32-5-002 | Instrument web-vitals (LCP/CLS/INP) | frontend-performance-manager | ✅ | Vitals reported | 2026-06-13 |
| T-V32-5-003 | Document perf baseline | frontend-performance-manager | ✅ | PERF_BASELINE.md | 2026-06-14 |
| T-V32-5-004 | Write observability runbook | docs-hygiene | ✅ | OBSERVABILITY_RUNBOOK.md | 2026-06-15 |
| T-V32-5-005 | Run `/plan seo` on first real project | arabic-seo-aeo-specialist | ✅ | SEO_BASELINE.md | 2026-06-16 |
| T-V32-5-006 | Create content templates (4 types) | content-strategist | ✅ | Templates + checklists | 2026-06-17 |
| T-V32-5-007 | Write CONTENT_OPS.md workflow | content-strategist | ✅ | Full workflow docs | 2026-06-18 |
| **T-HEALTH-5-001** | **Deploy Sentry error tracking** | **frontend-performance-manager** | **✅** | **Sentry live + alerts** | **2026-06-15** |
| **T-HEALTH-5-002** | **Build Grafana monitoring dashboard** | **devops-manager** | **✅** | **Dashboard live** | **2026-06-16** |
| **T-HEALTH-5-003** | **Implement structured logging** | **devops-manager** | **✅** | **JSON logs in prod** | **2026-06-17** |

**Blocker:** v3.2-P2 · Unlocks when P2 complete · **Health target: 85/100 by end of week**

---

## v3.2 NEW: P6 Integration + Release (8 Tasks) 🔒 LOCKED

**Phase:** Integration, docs, QA + release  
**Owner:** Technical Writer + Swarm Leader + QA Lead  
**Depends on:** v3.2-P1..P5 all complete  
**Target:** 2026-06-16 → 2026-06-21

| Task ID | Title | Owner | Status | AC | Due |
|---|---|---|---|---|---|
| T-V32-6-001 | Index all v3.2 runbooks | docs-hygiene | 🔒 | RUNBOOKS.md | 2026-06-16 |
| T-V32-6-002 | Write TROUBLESHOOTING.md (20+ scenarios) | docs-hygiene | 🔒 | FAQ + links | 2026-06-17 |
| T-V32-6-003 | Write ONBOARDING.md for developers | docs-hygiene | 🔒 | Full onboarding | 2026-06-18 |
| T-V32-6-004 | Full system regression (plan→dev→scan) | lead-qa-architect | 🔒 | No regressions | 2026-06-18 |
| T-V32-6-005 | Load test CI (5 simultaneous PRs) | devops-manager | 🔒 | No race conditions | 2026-06-19 |
| T-V32-6-006 | Production readiness checklist | swarm-leader | 🔒 | All > 90% | 2026-06-20 |
| T-V32-6-007 | Update README + CHANGELOG | docs-hygiene | 🔒 | Release notes | 2026-06-20 |
| T-V32-6-008 | Tag v3.2.0 on Master; release | gitops-engineer | 🔒 | Release artifact | 2026-06-21 |
| **T-HEALTH-6-001** | **Execute production readiness audit** | **swarm-leader** | **🔒** | **100% sign-off** | **2026-06-19** |
| **T-HEALTH-6-002** | **Conduct disaster recovery drill** | **devops-manager** | **🔒** | **Rollback tested** | **2026-06-20** |
| **T-HEALTH-6-003** | **Penetration test (security firm)** | **lead-security-officer** | **🔒** | **No critical findings** | **2026-06-20** |
| **T-HEALTH-6-004** | **Write deployment + rollback runbook** | **docs-hygiene** | **🔒** | **Runbook live** | **2026-06-20** |

**Blocker:** v3.2-P1..P5 · Final gate before v3.2 goes live · **Health target: 100/100 at release**

---

## Agent Build Tasks (Parallel with P1) 🔨 IN PROGRESS

**Phase:** Build 11 SDD automation agents  
**Owner:** Prompt Engineer + AI Orchestration Director  
**Target:** Week 1-2 (background during P1)  
**Integration:** Week 3 (wire into `/plan` command)

### Week 1: Planning Agents (Mon-Fri)

| Agent | Title | Owner | Status | Integration |
|---|---|---|---|---|
| Agent-1 | Problem-Statement-Generator | prompt-engineer | ⏳ | Input to Agent 2-5 |
| Agent-2 | ADR-Generator | prompt-engineer | ⏳ | `/decide` wiring |
| Agent-3 | Architecture-Diagram-Generator | solution-design-manager | ⏳ | Visual spec gen |
| Agent-4 | Spec-Generator | spec-writer | ⏳ | Core spec lock |
| Agent-5 | Dependency-Graph-Generator | task-resource-allocator | ⏳ | Parallel scheduling |

---

### Week 2: Content + Design + Release Agents (Mon-Fri)

| Agent | Title | Owner | Status | Integration |
|---|---|---|---|---|
| Agent-6 | SEO-Keyword-Mapper | arabic-seo-aeo-specialist | ⏳ | Content phase |
| Agent-7 | Sitemap-Generator | cms-content-modeling-specialist | ⏳ | IA phase |
| Agent-8 | Content-Brief-Generator | content-strategist | ⏳ | Content phase |
| Agent-9 | Design-System-Applier | lead-styling-theming-architect | ⏳ | Design phase |
| Agent-10 | Code-Generation-Supervisor | code-generation-supervisor | ⏳ | Dev skeleton |
| Agent-11 | Release-Plan-Generator | devops-manager | ⏳ | Release phase |

---

### Week 3: Integration (Mon-Fri)

| Task | Owner | Status | AC | Due |
|---|---|---|---|---|
| Wire agents 1-11 into `/plan` command | prompt-engineer | 🔒 | `/plan web-app` works end-to-end | 2026-06-16 |
| Test on single feature (password reset) | lead-qa-architect | 🔒 | Spec complete in 3h | 2026-06-17 |
| Refine + document | docs-hygiene | 🔒 | Integration guide written | 2026-06-18 |

---

## Deferred Tasks (Post-v3.2)

### v3.2-P1 Deferred

| Task ID | Title | Reason | Defer until |
|---|---|---|---|
| T-P1-001 | Token emit script `design:tokens:emit` | Build with agents, better context | Agent integration |
| T-P1-002 | Public docs site | Integrate with content agents | Agent integration |
| T-P1-003 | RICE prioritize backlog | After v3.2 agents ready | Post v3.2-P6 |
| T-P1-004 | Design excellence audit `--strict` | Full audit post-agent build | Post agent integration |

### Feature Phase (Future Releases)

| Task | Reason | Priority |
|---|---|---|
| MENA/RTL expansion | Cultural design + content | P2 |
| Plugin marketplace | Community contribution | P3 |
| Arabic/Khaleeji SEO | Regional market entry | P2 |

---

## Dashboard Summary

### Completion Status

| Phase | Tasks | Complete | In Progress | Locked | % Done |
|---|---|---|---|---|---|
| P0 Foundation | 5 | 5 | — | — | **100%** |
| P1-P6 Quality/Ship | 21 | 21 | — | — | **100%** |
| **v3.2-P1** | 7 | 7 | — | — | **100%** |
| **v3.2-P2** | 6 | 6 | — | — | **100%** |
| **v3.2-P3** | 6 | 6 | — | — | **100%** |
| **v3.2-P4** | 7 | 7 | — | — | **100%** |
| **v3.2-P5** | 7 | 7 | — | — | **100%** |
| **v3.2-P6** | 8 | — | 8 | — | **0%** (unlocked) |
| **Agent Build** | 11 | — | 11 | — | **0%** (parallel) |
| **Agent Integration** | 3 | — | — | 3 | **0%** (locked on agents) |
| **TOTAL** | **81** | **59** | **11** | **11** | **73%** |

### Critical Path (Wall Clock to v3.2 Release)

```
Week 1: v3.2-P1 (7 days) + Agents 1-5
Week 2: v3.2-P2 + v3.2-P3 + v3.2-P4 (parallel, 5 days) + Agents 6-11
Week 3: v3.2-P5 (parallel with P4, 4 days) + Agent integration
Week 4: v3.2-P6 (5 days) + Final QA + Release

Total: 21 days wall clock = 3 weeks (v3.2-P1-P6) + 1 week release = 4 weeks
```

---

## How to Track Progress

### Daily Standup Format

```
V3.2-P1 (Foundation):
  Completed:    [List T-V32-1-* tasks done today]
  In progress:  [Current task + % done]
  Blocker:      [Any issues]
  Next:         [Tomorrow's task]

Agent Build (Parallel):
  Completed:    [Agent X pseudocode reviewed]
  In progress:  [Agent Y implementation]
  Blocker:      [Any issues]
  Next:         [Next agent]
```

### Weekly Update Format

```
Week [N]:
  P[X] Progress:  [Task count complete / total]
  Agent Build:    [Agents complete / 11]
  Metrics:        [Any velocity notes]
  Blockers:       [If any]
  Next week:      [Target phases]
```

### Gate Progress

- When `v3.2-P1` tasks all show ✅ → unlock `v3.2-P2`, `v3.2-P3`, `v3.2-P4`
- When `v3.2-P2` tasks all show ✅ → unlock `v3.2-P5`
- When `v3.2-P1` + `v3.2-P3` + `v3.2-P4` show ✅ → unlock `v3.2-P6`
- When `v3.2-P1`–`v3.2-P5` show ✅ → unlock `v3.2-P6`
- When all phases show ✅ → release `v3.2.0`

---

## Resources

- **Plan reference:** `MASTER_PLAN_v3.2.md` (this project root)
- **Acceleration details:** `.COMPLETE_ACCELERATION_PLAN.md`
- **Flow system:** `.nezam/core/docs/ADAPTIVE_SDD_FLOW_SYSTEM.md`
- **SDD methodology:** `.nezam/core/docs/SDD_METHODOLOGY_ENHANCED.md`
- **Agent build plan:** `.nezam/SDD_AGENTS_BUILD_PLAN.md`

---

**Task list maintained by:** Project Architect  
**Last synchronized:** 2026-06-05  
**Next sync:** Daily (at standup)

