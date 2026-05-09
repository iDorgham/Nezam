# Plan index and traceability

Master tasks live in **[MASTER_TASKS.md](MASTER_TASKS.md)**. This file maps representative phase artifacts to the **six-phase** layout under `docs/workspace/plans/`.

## Phase layout

| Phase | Directory | Primary artifacts |
|-------|-----------|-------------------|
| 0 Define | `00-define/` | Product, architecture, roadmap tasks |
| 1 Research | `01-research/` | SEO, audience, competitive inputs |
| 2 Design | `02-design/` | Tokens, flows, components, pages |
| 3 Content | `03-content/` | IA, copy, SEO content, compliance |
| 4 Build | `04-build/` | Backend, frontend, features, integrations, tests |
| 5 Harden | `05-harden/` | Security, performance, accessibility |
| 6 Ship | `06-ship/` | Staging, production, monitoring |

## Example traceability rows

| MT-ID | PT-ID | Spec / artifact | Status | Phase gate |
|-------|-------|-------------------|--------|------------|
| MT-000 | — | `docs/workspace/plans/00-define/TASKS.md` | not started | Phase 0 complete when define tasks pass |
| MT-001 | — | `docs/workspace/plans/01-research/01-seo/keywords.md` | not started | Research gate |
| MT-002 | — | `docs/workspace/plans/02-design/01-tokens/tokens.md` | not started | Design gate |
| MT-003 | — | `docs/workspace/plans/03-content/01-strategy/plan.md` | not started | Content gate |
| MT-004 | — | `docs/workspace/plans/04-build/01-backend/api.md` | not started | Build gate |
| MT-005 | — | `docs/workspace/plans/05-harden/01-security/security.md` | not started | Harden gate |
| MT-006 | — | `docs/workspace/plans/06-ship/02-production/release.md` | not started | Ship gate |

_Add or split rows as you scope work. Keep paths aligned to real files under `docs/workspace/plans/`._

## Hardlock artifacts

Development remains hardlocked until workspace orchestration rules are satisfied (PRD, design contracts, architecture, gate matrix, and sub-phase `prompt.json` + `PROMPT.md` where required). See `.cursor/rules/workspace-orchestration.mdc` and **[gates/GITHUB_GATE_MATRIX.json](gates/GITHUB_GATE_MATRIX.json)**.

## Update instructions

Update this file when `TASKS.md` scopes change, when you add PT rows for new work, or when phase gates move.
