---
name: "nezam-plan-full"
description: Full SDD planning spine — roadmap, phases, specs, docs scaffolding with acceptance criteria matrices.
version: 1.0.0
updated: 2026-05-08
changelog: []
---
# Full SD planning (Specification-Driven)

Use when `/PLAN sdd`, `/PLAN all`, or user requests comprehensive specs.

## Outputs (paths)

Create or evolve under `docs/specs/`:

1. `ROADMAP.md` — horizons, KPIs, risk register, stakeholder map.
2. `PHASES.md` — phase goals, exit criteria, dependencies, rough timeline.
3. `ARCHITECTURE.md` — contexts, integrations, deployment sketch, environments.
4. `DATA_MODEL.md` — entities/state if applicable.

Per feature/epic folder `docs/specs/features/<id>-<slug>/`:

- `SPEC.md` — scope, personas, UX acceptance, measurable NFR (perf/sec/privacy/analytics/CMS).
- `API.md` or `INTEGRATIONS.md` stubs.
- `TEST_PLAN.md` — happy paths + edge cases tied to measurable criteria tables.

Each spec includes **Decision Log** appendix for reversals/changes dated.

Link SEO document `SEO_RESEARCH.md` to nav + metadata tasks.
