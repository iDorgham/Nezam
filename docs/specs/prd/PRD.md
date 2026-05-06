# Product Requirements Document — COIA Workspace Kit

| Field                | Value |
| -------------------- | ----- |
| Owner                | Product |
| Status               | Draft |
| Repo                 | COIA (Cursor orchestration workspace) |
| Companion AI project | External AI handoff via `docs/prompts/` + `docs/reports/` |

## Problem & outcomes

- Teams need a **governed SDD workspace**: specs, plans, Cursor skills/agents/commands, and CI-ready onboarding checks without ad-hoc drift.
- Outcome: **repeatable** `/START` → `/PLAN` → `/DEVELOP` flow with traceability (`plan/INDEX.md`), design gates, and optional release automation.

## Audience & JTBD

- **Primary:** Builders and tech leads using Cursor + GitHub who want specification-driven delivery and token-first UI when an app is added.
- **JTBD:** “Initialize or align a repo so assistants follow the same PRD, prompts, DESIGN, and test matrix discipline.”

## Success metrics / KPIs

- Onboarding script [`scripts/checks/check-onboarding-readiness.sh`](../../../scripts/checks/check-onboarding-readiness.sh) passes in CI when PRD + project prompt exist.
- `plan/INDEX.md` MT/PT rows stay mapped to specs and gates through ship.
- When a product app exists: critical journeys covered by tests derived from an approved `TEST_MATRIX.md`.

## Constraints

- Regulatory / privacy: no PII in committed prompts; secrets via env / vault patterns only.
- Platforms & browsers: repo is toolkit-first; consumer browsers apply when an app package is introduced.
- Budget / timeline: favor incremental scaffolding over big-bang rewrites.

## Scope

### In

- Canonical docs: PRD, project prompt, context files, `plan/` execution tree.
- Cursor governance: `.cursor/rules`, skills, agents, commands.
- CI workflows for onboarding/readiness and optional semantic-release alignment with [`plan/tag-version-plan.md`](../../../plan/tag-version-plan.md).

### Out

- Full production application code (unless added under future `apps/` / package scope).
- Hosting-specific runtime configuration beyond documented patterns.

## Detailed requirements

*(Link to granular specs under `docs/specs/features/` as they split out.)*

| ID  | Requirement | Priority | Acceptance |
| --- | ----------- | -------- | ---------- |
| R1  | PRD + `PROJECT_PROMPT.md` exist and pass onboarding check | P0 | `scripts/checks/check-onboarding-readiness.sh` exits 0 |
| R2  | SDD pipeline artifacts discoverable: plan index, phase TASKS | P0 | `plan/INDEX.md` lists MT/PT rows with gate IDs |
| R3  | Design authority: root `DESIGN.md` + reference design sync when brand chosen | P1 | DESIGN documents tokens/IA/motion; no orphan UI rules |
| R4  | Test matrix before test code for scoped features | P1 | `TEST_MATRIX.md` maps AC + plan PT-IDs; blockers listed |

## Risks

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Reference library size (`docs/reference/`) overwhelms scoped work | Med | Med | PRD-scoped ingest; alias tables in `.cursor/` |
| Drift between prompt paths and repo conventions | Low | Med | Single source in `.cursor/commands/start.md` + CI script |

## Release roadmap tie-in

- Initial milestone: **0.1.0** — onboarding gates green, `DESIGN.md` + `TEST_MATRIX.md` baseline for workspace kit.
- Align tags with [`docs/specs/sdd/VERSIONING.md`](../sdd/VERSIONING.md) and [`plan/tag-version-plan.md`](../../../plan/tag-version-plan.md).
