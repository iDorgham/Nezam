# SDD Pipeline

Specification-Driven Development (SDD) is the core delivery methodology in NEZAM. It enforces a strict phase order: you cannot start design until you have a spec; you cannot start development until you have an approved design.

## Phase Order

```
00-define → 01-research → 02-design → 03-content → 04-build → 05-harden → 06-ship
```

Each phase has:
- A `TASKS.md` listing all tasks for that phase
- Gate prerequisites that must be met before the next phase starts
- An entry in `docs/plans/gates/GITHUB_GATE_MATRIX.json`

## Phases in Detail

### 00 — Define
**Output:** `docs/prd/PRD.md` · `docs/memory/CONTEXT.md`

- Write or update the PRD
- Define success metrics and KPIs
- Lock the problem statement and target user
- **Gate:** PRD exists + passes `check-onboarding-readiness.sh`

### 01 — Research / SEO
**Output:** `docs/plans/01-research/01-seo/keywords.md`

- Keyword research and competitive analysis
- Information architecture planning
- Content strategy
- **Gate:** Keywords locked; IA approved

### 02 — Design
**Output:** `DESIGN.md` (root) · token files · component blueprints

- Apply a design profile: `pnpm run design:apply -- <brand>`
- Lock typography, color tokens, spacing, motion
- Create component blueprints and page layouts
- **Gate:** `check-design-tokens.sh` passes; DESIGN.md approved

### 03 — Content
**Output:** Copy files in `docs/plans/03-content/`

- Write all copy for pages, UI strings, meta
- Legal/compliance review
- Arabic/localization (if applicable)
- **Gate:** All copy approved; legal sign-off

### 04 — Build
**Output:** Feature slices in code

- Backend API + data models
- Frontend components + pages
- Feature flags + integrations
- **Gate:** All PT-IDs from TEST_MATRIX.md have corresponding tests

### 05 — Harden
**Output:** Passing CI suite

- Security audit
- Performance (Lighthouse ≥ 90)
- Accessibility (WCAG 2.1 AA)
- **Gate:** All checks pass; no blockers

### 06 — Ship
**Output:** Release tag + CHANGELOG

- Staging verification
- Production deploy
- Semantic-release tag
- **Gate:** Staging green; stakeholder sign-off

## Slash Commands

| Command | Phase | What it does |
|---|---|---|
| `/START` | 00-define | Initialize or resume the workspace |
| `/PLAN` | 00–01 | Build phase plan, populate TASKS |
| `/DEVELOP` | 04-build | Start a feature slice |
| `/CHECK` | Any | Run readiness checks |
| `/FIX` | Any | Diagnose and repair issues |
| `/SCAN` | Any | Audit workspace health |
| `/DEPLOY` | 06-ship | Trigger release pipeline |
| `/GIT` | Any | Conventional commit + PR workflow |

## Hardlock System

The hardlock system in `.cursor/rules/` prevents phase skipping. When a prerequisite is unmet, agents will refuse to execute the next phase and will explain exactly what's missing.

Hardlock paths are catalogued in `docs/core/hardlock-paths.json`.
