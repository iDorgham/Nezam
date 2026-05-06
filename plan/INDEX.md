# Plan Index and Traceability


| MT-ID  | PT-ID        | SPEC file (if any)                                   | STATUS      | Phase Gate    |
| ------ | ------------ | ---------------------------------------------------- | ----------- | ------------- |
| MT-001 | PT-01-01-001 | `plan/01-content-foundation/01-research/keywords.md` | not started | PT-01-01-GATE |
| MT-001 | PT-01-02-001 | `plan/01-content-foundation/02-strategy/plan.md`     | not started | PT-01-02-GATE |
| MT-002 | PT-01-03-001 | `plan/01-content-foundation/03-create/pages.md`      | not started | PT-01-03-GATE |
| MT-002 | PT-01-04-001 | `plan/01-content-foundation/04-compliance/legal.md`  | not started | PT-01-04-GATE |
| MT-003 | PT-02-01-001 | `plan/02-design-system/01-tokens/tokens.md`          | not started | PT-02-01-GATE |
| MT-003 | PT-02-02-001 | `plan/02-design-system/02-flows/flows.md`            | not started | PT-02-02-GATE |
| MT-003 | PT-02-03-001 | `plan/02-design-system/03-ui-kit/components.md`      | not started | PT-02-03-GATE |
| MT-003 | PT-02-04-001 | `plan/02-design-system/04-pages/layouts.md`          | not started | PT-02-04-GATE |
| MT-004 | PT-03-02-001 | `plan/03-build/02-backend/api.md`                    | not started | PT-03-02-GATE |
| MT-005 | PT-03-04-001 | `plan/03-build/04-features/slices.md`                | not started | PT-03-04-GATE |
| MT-006 | PT-04-001    | `plan/04-harden/perf.md`                             | not started | PT-04-GATE    |
| MT-006 | PT-05-001    | `plan/05-ship/release.md`                            | not started | PT-05-GATE    |


## Phase Gates

- `01-content-foundation`: gate passes when PT-01-04-GATE is done and PT-01-GATE is done.
- `02-design-system`: gate passes when PT-02-04-GATE is done and PT-02-GATE is done.
- `03-build`: gate passes when PT-03-06-GATE is done and PT-03-GATE is done.
- `04-harden`: gate passes when all PT-04-* tasks are done and PT-04-GATE is done.
- `05-ship`: gate passes when all PT-05-* tasks are done and PT-05-GATE is done.

## Update Instructions

Update this file whenever a `TASKS.md` item changes status, add new PT rows for newly scoped tasks, and keep each PT row mapped to the current phase gate that controls advancement.