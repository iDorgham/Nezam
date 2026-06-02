# Feature Spec — F-003: SDD Slash Commands & Hardlock Gates

## Meta

| Field | Value |
|---|---|
| Feature ID | F-003 |
| Priority | P0 |
| Status | approved |
| Last updated | 2026-05-29 |

## 1. User Story

**As a** NEZAM user,
**I want** `/START`, `/PLAN`, and `/DEVELOP` to enforce prerequisites,
**so that** agents cannot skip planning or design before coding.

## 2. Acceptance Criteria

- [ ] **AC-001:** `/plan` blocked when `prd_locked: false` or `design_locked: false`.
- [ ] **AC-002:** `check-onboarding-readiness.sh` passes with aligned PRD and PROJECT_PROMPT.
- [ ] **AC-003:** `GITHUB_GATE_MATRIX.json` lists gates enforced in CI.

## 3. Definition of Done

- [ ] `onboarding.yaml` reflects lock state after `/START all`
- [ ] Gate failure messages cite unlock steps
