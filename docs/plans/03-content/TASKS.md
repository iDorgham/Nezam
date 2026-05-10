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
| PT-01-01-GATE | All tasks in sub-phase 01-research are done | Sub-phase 01-research complete | All PT-01-01-* tasks are done | PT-01-01-001, PT-01-01-002, PT-01-01-003 | feat(seo) | not started | MT-001 |
| PT-01-02-GATE | All tasks in sub-phase 02-strategy are done | Sub-phase 02-strategy complete | All PT-01-02-* tasks are done | PT-01-01-GATE | feat(seo) | not started | MT-001 |
| PT-01-03-GATE | All tasks in sub-phase 03-create are done | Sub-phase 03-create complete | All PT-01-03-* tasks are done | PT-01-02-GATE | feat(content) | not started | MT-002 |
| PT-01-04-GATE | All tasks in sub-phase 04-compliance are done | Sub-phase 04-compliance complete | All PT-01-04-* tasks are done | PT-01-03-GATE | feat(legal) | not started | MT-002 |
| PT-01-GATE | Phase 01-content complete and ready for phase 2 | Phase gate approval recorded | PT-01-04-GATE done | PT-01-04-GATE | feat(legal) | not started | MT-001, MT-002 |

This phase is considered complete only when PT-01-GATE is done.
