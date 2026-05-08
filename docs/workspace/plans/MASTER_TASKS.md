# Master Tasks — COIA Project

> Source of truth for all project tasks. Updated by /PLAN tasks and /CREATE task.
> Do not edit manually — use /CREATE task or /GIT log to add entries.

## Task Status Legend
| Status | Meaning |
|---|---|
| 🔲 not-started | Work not yet begun |
| 🔄 in-progress | Currently being worked on |
| 🔍 in-review | Complete, awaiting review |
| ✅ done | Verified complete |
| ❌ blocked | Cannot proceed — see Blocked By |
| ⏸ deferred | Intentionally postponed |

## Priority Legend
| Priority | Meaning |
|---|---|
| P0 | Blocker — must be done before anything else in this phase |
| P1 | High — required for phase gate to pass |
| P2 | Medium — important but not blocking |
| P3 | Low — nice to have, can slip to next phase |

---

## Phase 0 — Define

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-000-001 | Write and approve PRD | P0 | 🔲 not-started | founder | 00-define/01-product | PRD non-template, approved | — |
| T-000-002 | Write PROJECT_PROMPT | P0 | 🔲 not-started | PM-01 | 00-define/01-product | Aligned with PRD scope | T-000-001 |
| T-000-003 | Define ARCHITECTURE.md | P1 | 🔲 not-started | ARCH-01 | 00-define/02-architecture | Tech stack documented | T-000-001 |
| T-000-004 | Create ROADMAP.md | P1 | 🔲 not-started | PM-01 | 00-define/03-roadmap | Milestones + SemVer defined | T-000-001 |

## Phase 1 — Research

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-001-001 | SEO keyword research | P0 | 🔲 not-started | seo-specialist | 01-research/01-seo | ≥50 keywords clustered | T-000-001 |
| T-001-002 | SERP intent mapping | P1 | 🔲 not-started | seo-specialist | 01-research/01-seo | Intent mapped per cluster | T-001-001 |
| T-001-003 | User persona definition | P1 | 🔲 not-started | ux-researcher | 01-research/02-audience | 2-3 personas documented | T-000-001 |
| T-001-004 | Competitive analysis | P2 | 🔲 not-started | business-analyst | 01-research/03-competitive | 3+ competitors analyzed | T-000-001 |

## Phase 2 — Design

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-002-001 | Define design tokens | P0 | 🔲 not-started | design-token-architect | 02-design/01-tokens | All primitives tokenized, no hardcoded values | T-000-001 |
| T-002-002 | Create user flow maps | P1 | 🔲 not-started | ux-designer | 02-design/02-flows | All core journeys documented | T-001-003 |
| T-002-003 | Define component APIs | P1 | 🔲 not-started | frontend-lead | 02-design/03-components | All core components spec'd | T-002-001 |
| T-002-004 | Design page layouts | P1 | 🔲 not-started | ui-designer | 02-design/04-pages | All pages × breakpoints spec'd | T-002-003 |
| T-002-005 | Define motion contracts | P2 | 🔲 not-started | motion-designer | 02-design/05-motion | Duration/easing tokens defined | T-002-001 |
| T-002-006 | Approve DESIGN.md | P0 | 🔲 not-started | DESIGN-01 | 02-design | DESIGN.md signed off | T-002-004 |

## Phase 3 — Content

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-003-001 | IA and navigation plan | P0 | 🔲 not-started | ia-architect | 03-content/01-strategy | IA_CONTENT.md complete | T-001-001 |
| T-003-002 | Page copy writing | P1 | 🔲 not-started | content-writer | 03-content/02-copy | All pages in CONTENT_MAP.md | T-003-001 |
| T-003-003 | SEO meta + structured data | P1 | 🔲 not-started | seo-specialist | 03-content/03-seo-content | All pages have meta + schema | T-003-002 |
| T-003-004 | Legal and compliance copy | P1 | 🔲 not-started | compliance-manager | 03-content/04-compliance | Privacy policy, ToS drafted | T-003-002 |

## Phase 4 — Build

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-004-001 | Backend API implementation | P0 | 🔲 not-started | BE-01 | 04-build/01-backend | All CRUD endpoints + auth tested | T-000-003, T-002-006 |
| T-004-002 | Frontend implementation | P0 | 🔲 not-started | FE-01 | 04-build/02-frontend | All pages built, token-compliant | T-002-006 |
| T-004-003 | Feature slices | P1 | 🔲 not-started | FE-01 + BE-01 | 04-build/03-features | Priority journeys demoable | T-004-001, T-004-002 |
| T-004-004 | Third-party integrations | P2 | 🔲 not-started | integration-specialist | 04-build/04-integrations | All integrations tested | T-004-001 |
| T-004-005 | Test suite | P1 | 🔲 not-started | qa-lead | 04-build/05-tests | ≥80% coverage on core paths | T-004-003 |

## Phase 5 — Harden

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-005-001 | Security audit | P0 | 🔲 not-started | security-auditor | 05-harden/01-security | Zero P0/P1 findings | T-004-005 |
| T-005-002 | Performance optimization | P0 | 🔲 not-started | performance-lead | 05-harden/02-performance | LCP<2.5s, CLS<0.1, INP<200ms | T-004-005 |
| T-005-003 | Accessibility audit | P0 | 🔲 not-started | a11y-auditor | 05-harden/03-a11y | WCAG 2.2 AA compliant | T-004-005 |
| T-005-004 | QA sign-off | P0 | 🔲 not-started | qa-lead | 05-harden/04-qa | All acceptance criteria met | T-005-001, T-005-002, T-005-003 |

## Phase 6 — Ship

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-006-001 | Staging deployment | P0 | 🔲 not-started | devops-lead | 06-ship/01-staging | Staging smoke tests pass | T-005-004 |
| T-006-002 | Production deployment | P0 | 🔲 not-started | devops-lead | 06-ship/02-production | Zero deploy errors | T-006-001 |
| T-006-003 | Monitoring setup | P1 | 🔲 not-started | devops-lead | 06-ship/03-monitoring | Error alerts + uptime monitoring active | T-006-002 |

---

## How to add a task
Run: /CREATE task
Or append a row manually following the table format above.

## How to update task status
Run: /GIT log   → prompts for status update
Or edit the Status column directly.
