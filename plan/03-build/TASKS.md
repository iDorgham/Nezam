**Gate rule:** The phase passes when the final gate PT-XX-GATE isdone.

## Phase automation (Git)

Non-interactive baseline for work in this phase. Branch names and commit shapes follow [`plan/commit-conventions.md`](../commit-conventions.md).

**START**

1. `git fetch origin --quiet` and `git pull --rebase origin main --quiet` when the tree is clean enough to rebase safely.
2. Create or checkout `feature/<topic>` (or the branch pattern required by active slice).
3. Record baseline SHA with `git rev-parse HEAD`.

**END**

1. Run `/SAVE`-style checkpoint updates (`docs/context`, `docs/reports` when applicable).
2. Commit with prefixes aligned to task rows below and [`plan/commit-conventions.md`](../commit-conventions.md).
3. Push after verification; keep Git hooks enabled unless resolving an emergency.
4. Tag/version bump only per [`plan/tag-version-plan.md`](../tag-version-plan.md); CI must stay green per [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
5. Update [`plan/INDEX.md`](../INDEX.md) STATUS for completed PT rows.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-03-01-GATE | All tasks in sub-phase 01-env are done | Sub-phase 01-env complete | All PT-03-01-* tasks are done | PT-03-01-001, PT-03-01-002, PT-03-01-003 | chore(ci) | not started | MT-004 |
| PT-03-02-GATE | All tasks in sub-phase 02-backend are done | Sub-phase 02-backend complete | All PT-03-02-* tasks are done | PT-03-01-GATE | feat(backend) | not started | MT-004 |
| PT-03-03-GATE | All tasks in sub-phase 03-frontend are done | Sub-phase 03-frontend complete | All PT-03-03-* tasks are done | PT-03-02-GATE | feat(ui) | not started | MT-005 |
| PT-03-04-GATE | All tasks in sub-phase 04-features are done | Sub-phase 04-features complete | All PT-03-04-* tasks are done | PT-03-03-GATE | feat(features) | not started | MT-005 |
| PT-03-05-GATE | All tasks in sub-phase 05-test are done | Sub-phase 05-test complete | All PT-03-05-* tasks are done | PT-03-04-GATE | fix(tests) | not started | MT-005 |
| PT-03-06-GATE | All tasks in sub-phase 06-release are done | Sub-phase 06-release complete | All PT-03-06-* tasks are done | PT-03-05-GATE | chore(release) | not started | MT-006 |
| PT-03-GATE | Phase 03-build complete and ready for phase 4 | Phase gate approval recorded | PT-03-06-GATE done | PT-03-06-GATE | chore(release) | not started | MT-004, MT-005, MT-006 |
