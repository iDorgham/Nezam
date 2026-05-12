# Plan index and traceability

Master tasks live in **[MASTER_TASKS.md](MASTER_TASKS.md)**. This file maps representative phase artifacts to the **six-phase** layout under `docs/plans/`.

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

## Traceability matrix

| MT-ID | Phase | Spec / artifact | Status | Phase gate |
|-------|-------|-------------------|--------|------------|
| MT-000 | 0 Define | `docs/plans/00-define/TASKS.md` | not started | Phase 0 complete when define tasks pass |
| MT-001 | 1 Research | `docs/plans/01-research/01-seo/SPEC.md` | not started | Research gate |
| MT-002 | 2 Design | `docs/plans/02-design/01-tokens/SPEC.md` | not started | Design gate |
| MT-003 | 3 Content | `docs/plans/03-content/01-strategy/SPEC.md` | not started | Content gate |
| MT-004 | 4 Build | `docs/plans/04-build/01-backend/SPEC.md` | approved | Build gate |
| MT-005 | 5 Harden | `docs/plans/05-harden/01-security/SPEC.md` | approved | Harden gate |
| MT-006 | 6 Ship | `docs/plans/06-ship/02-production/SPEC.md` | not started | Ship gate |
| MT-007 | 5 Harden | `docs/plans/05-harden/02-performance/SPEC.md` | approved | Harden gate |
| MT-008 | 5 Harden | `docs/plans/05-harden/03-a11y/SPEC.md` | approved | Harden gate |
| MT-009 | 5 Harden | `docs/plans/05-harden/04-qa/SPEC.md` | approved | Harden gate |

_Add or split rows as you scope work. Keep paths aligned to real files under `docs/plans/`._

## Hardlock artifacts

Development remains hardlocked until workspace orchestration rules are satisfied (PRD, design contracts, architecture, gate matrix, and sub-phase `prompt.json` + `PROMPT.md` where required). See `.cursor/rules/workspace-orchestration.mdc` and **[gates/GITHUB_GATE_MATRIX.json](gates/GITHUB_GATE_MATRIX.json)**.

## Update instructions

Update this file when `TASKS.md` scopes change, when you add PT rows for new work, or when phase gates move.

