# NEZAM Swarm Workflow — 6-Phase Lifecycle

> Canonical reference for the 6-phase swarm execution lifecycle.
> Referenced by `subagent-controller.md` and `sdd-pipeline-v2.mdc`.

---

## Phase Lifecycle Overview

```
INTAKE → PLANNING/DESIGN → SPRINT DEVELOPMENT → INTEGRATION/TESTING → DEPLOY/LAUNCH → MAINTENANCE
  P0         P1–P2               P3                    P4                  P5              P6
```

---

## Phase Definitions

### Phase 0 — INTAKE
**Entry gate:** None (session start)
**Owner:** PM-01 (swarm-leader)
**Actions:** Read all state YAMLs, detect build mode, announce session context card, route to correct phase
**Exit gate:** `onboarding.yaml:prd_locked = true`

### Phase 1 — PLANNING
**Entry gate:** PRD locked
**Owner:** S1 Architecture + S8 Analytics + S2 Design
**Actions:** SEO research, IA taxonomy, content modeling, architecture ADR, DESIGN.md lock
**Exit gate:** `plan_progress.yaml:planning_complete = true`, all phase flags true

### Phase 2 — DESIGN
**Entry gate:** `plan_progress.yaml:design_wireframes = false → true`
**Owner:** S2 UI/UX Design
**Actions:** Wireframes, component API, token system, design-to-code handoff
**Exit gate:** `onboarding.yaml:design_locked = true`, DESIGN.md approved

### Phase 3 — SPRINT DEVELOPMENT
**Entry gate:** Design locked, architecture ADR approved
**Owner:** S3 Frontend / S4 Backend / S5 Data / S6 Mobile (per type)
**Actions:** Feature slices per SPEC.md, spec-writer contract required for each slice
**Exit gate:** All feature slices done, `develop_phases.phase_3.testing_passed = true`

### Phase 4 — INTEGRATION + TESTING
**Entry gate:** Phase 3 complete
**Owner:** S11 QA + S9 Security + S10 DevOps
**Actions:** E2E tests, security hardening, performance audit, a11y pass, regression detection
**Exit gate:** `/check output` ≥ 70%, zero P0 issues, `develop_phases.phase_4.testing_passed = true`

### Phase 5 — DEPLOY + LAUNCH
**Entry gate:** Phase 4 complete, CPO go/no-go
**Owner:** S10 DevOps + S9 Security
**Actions:** CI/CD pipeline, staging smoke tests, production deploy, monitoring baseline
**Exit gate:** All smoke tests pass, error rate < 0.1%, monitoring active

### Phase 6 — MAINTENANCE
**Entry gate:** Phase 5 complete
**Owner:** S12 Maintenance
**Actions:** Dependency updates, tech debt sprints, incident response, knowledge updates
**Exit gate:** Ongoing — cycles back to Phase 1 for new features

---

## Swarm Assignment by Phase

| Phase | Primary Swarm | Supporting Swarms |
|---|---|---|
| P0 Intake | S1 Architecture | — |
| P1 Planning | S1 Architecture | S8 Analytics, S13 Ethics |
| P2 Design | S2 UI/UX | S3 Frontend, S8 Analytics |
| P3 Development | S3/S4/S5/S6 | S7 CMS/SaaS (if applicable) |
| P4 Testing | S11 QA | S9 Security, S10 DevOps |
| P5 Deploy | S10 DevOps | S9 Security |
| P6 Maintenance | S12 Maintenance | All (as needed) |

---

## Ethics Auto-Trigger (S13)

S13 (`lead-ai-ethics-officer`) is mandatory pre-gate before P3 Development for:
- Any AI feature, agent behavior, or model integration
- Sensitive data collection or inference
- Autonomous decision automation

Ethics sign-off must appear in `PHASE_HANDOFF.md` and `MEMORY.md` before phase go.

---

## Mode Execution Depth by Phase

| Phase | MODE A capable | MODE B capable | MODE C required |
|---|---|---|---|
| P0 | ✓ | — | — |
| P1 | — | ✓ | ✓ (full planning) |
| P2 | — | ✓ | — |
| P3 | ✓ (single slice) | ✓ (multi-slice) | ✓ (monorepo) |
| P4 | — | ✓ | ✓ |
| P5 | — | — | ✓ |
| P6 | ✓ | ✓ | — |
