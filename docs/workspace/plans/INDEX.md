# Plan Index and Traceability


| MT-ID  | PT-ID        | SPEC file (if any)                                   | STATUS      | Phase Gate    |
| ------ | ------------ | ---------------------------------------------------- | ----------- | ------------- |
| MT-001 | PT-01-01-001 | `docs/workspace/plans/01-content/01-research/keywords.md` | not started | PT-01-01-GATE |
| MT-001 | PT-01-02-001 | `docs/workspace/plans/01-content/02-strategy/plan.md`     | not started | PT-01-02-GATE |
| MT-002 | PT-01-03-001 | `docs/workspace/plans/01-content/03-create/pages.md`      | not started | PT-01-03-GATE |
| MT-002 | PT-01-04-001 | `docs/workspace/plans/01-content/04-compliance/legal.md`  | not started | PT-01-04-GATE |
| MT-003 | PT-02-01-001 | `docs/workspace/plans/02-design/01-tokens/tokens.md`          | not started | PT-02-01-GATE |
| MT-003 | PT-02-02-001 | `docs/workspace/plans/02-design/02-flows/flows.md`            | not started | PT-02-02-GATE |
| MT-003 | PT-02-03-001 | `docs/workspace/plans/02-design/03-ui-kit/components.md`      | not started | PT-02-03-GATE |
| MT-003 | PT-02-04-001 | `docs/workspace/plans/02-design/04-pages/layouts.md`          | not started | PT-02-04-GATE |
| MT-004 | PT-03-02-001 | `docs/workspace/plans/03-build/02-backend/api.md`                    | not started | PT-03-02-GATE |
| MT-005 | PT-03-04-001 | `docs/workspace/plans/03-build/04-features/slices.md`                | not started | PT-03-04-GATE |
| MT-006 | PT-04-001    | `docs/workspace/plans/04-harden/perf.md`                             | not started | PT-04-GATE    |
| MT-006 | PT-05-001    | `docs/workspace/plans/05-ship/release.md`                            | not started | PT-05-GATE    |


## Phase Gates

- `01-content`: gate passes when PT-01-04-GATE is done and PT-01-GATE is done.
- `02-design`: gate passes when PT-02-04-GATE is done and PT-02-GATE is done.
- `03-build`: gate passes when PT-03-06-GATE is done and PT-03-GATE is done.
- `04-harden`: gate passes when all PT-04-* tasks are done and PT-04-GATE is done.
- `05-ship`: gate passes when all PT-05-* tasks are done and PT-05-GATE is done.

## Hardlock Artifacts

Development remains hardlocked until:

- `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json` exists and is valid.
- Every sub-phase directory under `docs/workspace/plans/<phase>/<subphase>/` includes:
  - `prompt.json`
  - `PROMPT.md`

Gate evidence for start/end and pre/post-merge checks must align to the manifest.

## Update Instructions

Update this file whenever a `TASKS.md` item changes status, add new PT rows for newly scoped tasks, and keep each PT row mapped to the current phase gate that controls advancement.