# MASTER TASKS — NEZAM Project

> **Current Phase:** 01 Foundation (Build P1)
> **Status:** 🟢 Active — phase_1 unlocked 2026-05-28T20:58:17Z
> **Source:** Auto-synthesized from `docs/start/PRD.md` + `.nezam/core/architecture/ARCHITECTURE.md` + `DESIGN.md` v3
> **Owner contract:** All swarm agents canonical at `.cursor/agents/`

---

## 🛠 Active Task List — Phase 01 Foundation

> Acceptance criteria are non-negotiable. Token-first mandate applies (`pnpm run check:tokens` must pass on every PR).

### [P0] T-F-001 — Design Hub scaffold sanity

| Field | Value |
|---|---|
| **Owner** | `lead-frontend-architect` + `nextjs-app-architect` |
| **Status** | ⚪️ Not Started |
| **Depends on** | — |
| **AC-1** | `pnpm --filter design-hub dev` boots on `localhost:4000` without error |
| **AC-2** | `pnpm --filter design-hub build` succeeds; bundle reports under 300 KB initial |
| **AC-3** | Next.js 14+ App Router confirmed; Node.js 24 LTS in `engines` |
| **AC-4** | Fluid Compute default — no edge-runtime declarations |
| **DoD** | Build green in CI, dev server screenshot in `.nezam/design-hub/_reports/p1-scaffold.md` |

### [P0] T-F-002 — Token CSS export from DESIGN.md

| Field | Value |
|---|---|
| **Owner** | `design-systems-token-architect` + `design-token-orchestrator` |
| **Status** | ⚪️ Not Started |
| **Depends on** | T-F-001 |
| **AC-1** | Script `pnpm run design:tokens:emit` parses DESIGN.md frontmatter → `src/tokens.css` |
| **AC-2** | Every semantic token from DESIGN.md §§2-5 exposed as `--ds-*` CSS variable |
| **AC-3** | `pnpm run check:tokens` passes Gate 1 (no hardcoded primitives in components) |
| **AC-4** | Light/Dark parity — both `:root` and `[data-theme="dark"]` blocks populated |
| **DoD** | Token export run in CI before any block build; diff committed if tokens change |

### [P0] T-F-003 — Block renderer base (6 v3 blocks)

| Field | Value |
|---|---|
| **Owner** | `wireframe-renderer-agent` (DS-RENDER-01) + `page-block-composer` (DS-BLOCK-01) |
| **Status** | ⚪️ Not Started |
| **Depends on** | T-F-002 |
| **AC-1** | All 6 v3 blocks implemented: `Nav_TopBar`, `Hero_Centered`, `Content_Logos`, `Content_Features`, `Content_CTA`, `Nav_Footer` |
| **AC-2** | Fixed-layout chrome pattern from DESIGN.md §7.4 (header/footer full-width, body `max-w-6xl`) |
| **AC-3** | Section vertical rhythm `py-14` enforced — verified via component test |
| **AC-4** | Every interactive element demos all 7 states (default/hover/focus/active/disabled/loading/error) |
| **DoD** | `pnpm --filter design-hub test -- --testPathPattern=blocks` green; visual screenshot in P1 report |

### [P0] T-F-004 — Database provisioning (Vercel Marketplace)

| Field | Value |
|---|---|
| **Owner** | `lead-database-architect` + `neon-database-architect` |
| **Status** | ⚪️ Not Started |
| **Depends on** | — |
| **AC-1** | Database provisioned via Vercel Marketplace (Neon Postgres recommended) |
| **AC-2** | `DATABASE_URL` configured via `vercel env` for `development`, `preview`, `production` |
| **AC-3** | Baseline migration created: `users`, `sessions`, `design_locks`, `wireframe_versions` tables |
| **AC-4** | RLS policies seeded if Supabase; otherwise application-layer authz design documented |
| **DoD** | Migration runs idempotently in CI; rollback path documented |

### [P0] T-F-005 — Auth flow scaffold

| Field | Value |
|---|---|
| **Owner** | `auth-security-manager` + `lead-security-officer` |
| **Status** | ⚪️ Not Started |
| **Depends on** | T-F-004 |
| **AC-1** | Auth provider chosen (Clerk preferred; otherwise Supabase Auth) |
| **AC-2** | Sign-in / sign-out / session refresh flows working in Design Hub |
| **AC-3** | Protected route group `(app)/*` gated by session check; redirects to sign-in |
| **AC-4** | OAuth/SSO via user-initiated flow only (per safety rules — Claude never creates accounts) |
| **DoD** | E2E test: sign-in → preview page → sign-out passes in Playwright |

### [P0] T-F-006 — Liveblocks real-time collab

| Field | Value |
|---|---|
| **Owner** | `react-server-components-expert` + `frontend-lead` |
| **Status** | ⚪️ Not Started |
| **Depends on** | T-F-003, T-F-005 |
| **AC-1** | Liveblocks room per page id (`wireframes_locked.json#pages[].page_id`) |
| **AC-2** | Cursor presence + selection sync on preview pane |
| **AC-3** | Comments resolve through `.nezam/design-hub/_reports/comments-<page>.md` log |
| **AC-4** | Graceful degradation: if Liveblocks env missing, app boots in solo mode |
| **DoD** | Two-tab test: edit in tab A appears in tab B within 500ms |

### [P0] T-F-007 — CI workflow: sync + check + tokens on PR

| Field | Value |
|---|---|
| **Owner** | `ci-automation` + `gitops-engineer` |
| **Status** | ⚪️ Not Started |
| **Depends on** | T-F-002 |
| **AC-1** | `.github/workflows/ci.yml` runs on every PR to `main` |
| **AC-2** | Steps: `pnpm install` → `pnpm ai:sync --check` → `pnpm ai:check` → `pnpm run check:tokens` → `pnpm --filter design-hub typecheck` → tests |
| **AC-3** | Failing token gate blocks merge (required status check) |
| **AC-4** | Cache: pnpm store + Next.js `.next/cache` |
| **DoD** | One PR runs end-to-end green; one PR with intentional hex code is blocked |

### [P0] T-F-008 — Test matrix scaffold

| Field | Value |
|---|---|
| **Owner** | `qa-test-lead` + `lead-qa-architect` |
| **Status** | ⚪️ Not Started |
| **Depends on** | T-F-001 |
| **AC-1** | `docs/reports/tests/TEST_MATRIX.md` created — table of AC ↔ test file ↔ PT-ID |
| **AC-2** | Vitest config in `.nezam/design-hub/` covers `src/**/*.{ts,tsx}` |
| **AC-3** | Playwright config covers preview pane E2E |
| **AC-4** | Coverage threshold 75% lines for components; 90% for token logic |
| **DoD** | `pnpm --filter design-hub test:coverage` reports above thresholds |

### [P0] T-F-009 — Base UI primitives (typography, Section, Button, Card)

| Field | Value |
|---|---|
| **Owner** | `lead-styling-theming-architect` + `ui-component-manager` |
| **Status** | ⚪️ Not Started |
| **Depends on** | T-F-002 |
| **AC-1** | Components: `Section`, `Button`, `Card`, `Heading`, `Text`, `Badge` |
| **AC-2** | Per DESIGN.md §5 — every component shows all 7 states (impeccable-wireframe-craft gate) |
| **AC-3** | RTL-safe — uses logical `ms-*` / `me-*`; no `ml-*` / `mr-*` |
| **AC-4** | Storybook (or equivalent) story per component with all states |
| **DoD** | `pnpm --filter design-hub lint -- --rule=block-shape` clean |

### [P0] T-F-010 — Hardlock CI gate (SDD prereq enforcement)

| Field | Value |
|---|---|
| **Owner** | `ci-automation` + `swarm-leader` |
| **Status** | ⚪️ Not Started |
| **Depends on** | T-F-007 |
| **AC-1** | `.github/workflows/sdd-hardlock.yml` checks all 10 SDD prerequisites on PR |
| **AC-2** | Reads `.nezam/core/gates/GATE_MATRIX.md` for required artifacts per phase |
| **AC-3** | Blocks merge if any required artifact is missing or `state.yaml` flags wrong |
| **AC-4** | Posts clear error comment on PR with exact unlock steps |
| **DoD** | A PR that deletes `DESIGN.md` is auto-blocked with actionable comment |

---

## 📦 Phase Summary

| Phase | Status | Task Range | Notes |
|---|---|---|---|
| **Phase 00 Define** | ✅ Complete | — | PRD + PROJECT_PROMPT locked |
| **Phase 01 Foundation** | 🟢 **Active** | T-F-001 → T-F-010 | This page |
| **Phase 02 Core Features** | 🔒 Locked | T-C-* (TBD) | Depends on Phase 01 complete + tested |
| **Phase 03 Quality** | 🔒 Locked | T-Q-001 → T-Q-009 | axe-core, RTL audit, RAF, integration/unit/security tests, context overflow, hardlock gate tests |
| **Phase 04 Polish** | 🔒 Locked | T-P-* | Perf, a11y, SEO refinement |
| **Phase 05 Hardening** | 🔒 Locked | T-H-* | Security audit, load test, monitoring |
| **Phase 06 Ship** | 🔒 Locked | T-S-* | Staging deploy, QA sign-off, prod release |

---

## 📉 Execution History

| Date | Event | Notes |
|---|---|---|
| 2026-05-27 | Wireframes locked (minimal profile) | Baseline for renderer pipeline |
| 2026-05-28 | Phase 02 Design complete | DESIGN.md v3 §§7-10 + 5 skills + 4 agents |
| 2026-05-28 | Phase 01 Foundation unlocked | All 10 SDD prerequisites satisfied |
| 2026-05-28 | MASTER_TASKS Phase 01 synthesized | 10 P0 foundation tasks authored from PRD + ARCHITECTURE |

---

## 🚦 WIP Limits (Scrumban V3)

- Max **3** tasks in `in_progress` globally
- Max **1** task per agent
- Blocked >2h: auto-move to `blocked`, notify `hybrid-pm-orchestrator`
- P0 blocked >1h: notify `swarm-leader`, flag `#alerts`

Current board state: see `.cursor/state/plan_progress.yaml:scrumban_board`.

---

**Recommended next:** start with **T-F-001** (scaffold sanity) and **T-F-004** (DB provisioning) in parallel — they have no dependencies and unblock the rest.
