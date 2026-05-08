**Gate rule:** The phase passes when the final gate PT-XX-GATE isdone.

## Phase automation (Git)

Non-interactive baseline for work in this phase. Branch names and commit shapes follow [`docs/workspace/plans/commit-conventions.md`](../commit-conventions.md).

**START**

1. `git fetch origin --quiet` and `git pull --rebase origin main --quiet` when the tree is clean enough to rebase safely.
2. Create or checkout `feature/<topic>` (or the branch pattern required by active slice).
3. Record baseline SHA with `git rev-parse HEAD`.

**END**

1. Run `/SAVE`-style checkpoint updates (`docs/workspace/context`, `docs/reports` when applicable).
2. Commit with prefixes aligned to task rows below and [`docs/workspace/plans/commit-conventions.md`](../commit-conventions.md).
3. Push after verification; keep Git hooks enabled unless resolving an emergency.
4. Tag/version bump only per [`docs/workspace/plans/tag-version-plan.md`](../tag-version-plan.md); CI must stay green per [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
5. Update [`docs/workspace/plans/INDEX.md`](../INDEX.md) STATUS for completed PT rows.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-02-01-GATE | All tasks in sub-phase 01-tokens are done | Sub-phase 01-tokens complete | All PT-02-01-* tasks are done | PT-02-01-001, PT-02-01-002 | feat(design) | not started | MT-003 |
| PT-02-02-GATE | All tasks in sub-phase 02-flows are done | Sub-phase 02-flows complete | All PT-02-02-* tasks are done | PT-02-01-GATE | feat(design) | not started | MT-003 |
| PT-02-03-GATE | All tasks in sub-phase 03-ui-kit are done | Sub-phase 03-ui-kit complete | All PT-02-03-* tasks are done | PT-02-02-GATE | feat(design) | not started | MT-003 |
| PT-02-04-GATE | All tasks in sub-phase 04-pages are done | Sub-phase 04-pages complete | All PT-02-04-* tasks are done | PT-02-03-GATE | feat(design) | not started | MT-003 |
| PT-02-GATE | Phase 02-design complete and ready for phase 3 | Phase gate approval recorded | PT-02-04-GATE done | PT-02-04-GATE | feat(design) | not started | MT-003 |
