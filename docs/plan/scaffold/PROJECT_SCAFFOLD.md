# Project Scaffold — NEZAM Workspace

| Field | Value |
|---|---|
| Document | PROJECT_SCAFFOLD.md |
| Status | Confirmed for planning gate |
| Product type | Open-source governance monorepo + Design Hub app |
| Scaffold script | `.nezam/core/scripts/scaffold.sh` |
| Last updated | 2026-05-29 |
| Owner confirmation | Pending user `yes` to run script |

---

## Annotated tree (governed paths)

```
NEZAM/                                          [Phase 0 · project-architect]
├── .cursor/                                    [Canonical — never edit mirrors first]
│   ├── agents/                                 [Swarm charters · lazy-load]
│   ├── commands/                               [/START /PLAN /DEVELOP …]
│   ├── skills/                                 [Domain SKILL.md packs]
│   ├── rules/                                  [workspace-orchestration, gates]
│   └── state/                                  [onboarding, plan_progress, agent-bus]
├── .nezam/
│   ├── core/
│   │   ├── architecture/                       [ARCHITECTURE.md, ADRs, mermaids]
│   │   ├── gates/                              [GITHUB_GATE_MATRIX.json, hardlock-paths]
│   │   ├── prd/PRD.md                          [Locked product definition]
│   │   ├── plans/                              [INDEX, MASTER_TASKS, phase specs]
│   │   ├── memory/                             [MEMORY.md, CONTEXT.md, handoffs]
│   │   └── scripts/                            [sync, checks, scaffold, hooks]
│   ├── design-hub/                             [Phase 1 · lead-frontend-architect]
│   │   ├── app/                                [Next.js App Router pages + API]
│   │   ├── src/                                [components, lib, hooks, store]
│   │   ├── components/                         [wireframe, arch, ui, preview]
│   │   ├── tests/                              [Vitest unit + integration]
│   │   └── package.json
│   └── design/                                 [Profile catalog design.md files]
├── .session/
│   └── pages/                                  [Per archPageId wireframe JSON]
├── docs/
│   ├── start/                                  [PRD, PROJECT_PROMPT intake]
│   ├── plan/                                   [SDD planning artifacts — this pipeline]
│   └── reports/                                [Generated only — a11y, lighthouse, …]
├── DESIGN.md                                   [Locked design contract · Phase design]
├── wireframes_locked.json                     [HITL lock export · Phase design]
├── CHANGELOG.md                                [SemVer · Phase ship]
├── package.json                                [Root scripts: ai:sync, design-hub]
├── pnpm-workspace.yaml
├── CLAUDE.md                                   [Generated · pnpm ai:sync]
├── AGENTS.md                                   [Generated · pnpm ai:sync]
└── .github/workflows/                          [CI gates · devops-manager]
```

---

## Design Hub — file inventory (P0)

| Path | Purpose | Owner | Phase |
|---|---|---|---|
| `app/page.tsx` | Section shell router | frontend-lead | Build |
| `app/layout.tsx` | Root layout + theme | frontend-lead | Build |
| `app/api/lock/route.ts` | Export wireframes_locked | api-logic-manager | Build |
| `app/api/context/route.ts` | Prompt context | api-logic-manager | Build |
| `app/api/pages/[pageId]/route.ts` | Page CRUD | api-logic-manager | Build |
| `src/components/arch/*` | Architecture section | design-hub-architecture | Build |
| `src/components/wireframes/*` | Wireframe editor | design-hub-wireframe | Build |
| `src/lib/wireframe/shadcn-block-previews.tsx` | Block previews | wireframe-renderer-agent | Build |
| `src/data/block_registry.json` | Block types | design-hub-components | Build |
| `tests/**/*.test.ts` | Vitest | testing-manager | Harden |

---

## Config inventory

| File | Purpose |
|---|---|
| `package.json` | Root scripts, workspaces |
| `pnpm-workspace.yaml` | `design-hub` package |
| `.nezam/design-hub/tailwind.config.ts` | `app-*` token mapping |
| `.nezam/design-hub/tsconfig.json` | TS strict |
| `.lighthouserc.json` | Perf gate (if present) |
| `.github/workflows/design-gates.yml` | Token + wireframe CI |
| `.github/workflows/ai-sync-check.yml` | Mirror drift |

---

## Database / migrations

**None for NEZAM kit.** Optional Neon only for user projects built with NEZAM (see MASTER_TASKS T-F-004 — defer until product app fork).

---

## Test mirror

```
.nezam/design-hub/tests/
├── unit/          mirrors src/lib, store
└── integration/   mirrors app/api routes
```

---

## Scaffold execution

```bash
# From repository root (idempotent)
bash .nezam/core/scripts/scaffold.sh
```

Legacy path (same script): `bash .nezam/core/scripts/maintenance/scaffold.sh`

---

## Confirmation

- [x] Tree reflects PRD + ARCHITECTURE + DESIGN + IA
- [x] Design Hub paths match `.nezam/design-hub/` layout
- [x] No `src/` product app at root (governance repo)
- [ ] User typed **YES** to run scaffold script (optional — dirs largely exist)

---

## Decision Amendments

| Date | Changed field | Previous | New | Reason | Approved by |
|---|---|---|---|---|---|
| 2026-05-29 | Initial scaffold doc | missing | This file | /plan all gate | PM-01 |
