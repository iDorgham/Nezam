**Gate rule:** The phase passes when the final gate PT-XX-GATE isdone.

## Phase automation (Git)

Non-interactive baseline for work in this phase. Branch names and commit shapes follow [`docs/workspace/plans/commit-conventions.md`](../commit-conventions.md).

**START**

1. `git fetch origin --quiet` and `git pull --rebase origin main --quiet` when the tree is clean enough to rebase safely.
2. Create or checkout `feature/<topic>` or `release/<semver>` per active slice.
3. Record baseline SHA with `git rev-parse HEAD`.

**END**

1. Run `/SAVE`-style checkpoint updates (`docs/workspace/context`, `docs/reports` when applicable).
2. Commit with prefixes aligned to task rows below and [`docs/workspace/plans/commit-conventions.md`](../commit-conventions.md).
3. Push after verification; keep Git hooks enabled unless resolving an emergency.
4. Tag/version bump only per [`docs/workspace/plans/tag-version-plan.md`](../tag-version-plan.md); CI must stay green per [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
5. Update [`docs/workspace/plans/INDEX.md`](../INDEX.md) STATUS for completed PT rows.


| PT-ID      | Description                                       | Outcome                        | Metric                                          | Dependencies                    | Commit Prefix | Status      | Linked MT |
| ---------- | ------------------------------------------------- | ------------------------------ | ----------------------------------------------- | ------------------------------- | ------------- | ----------- | --------- |
| PT-05-001  | Final QA sign-off                                 | Release readiness confirmed    | 0 release-blocking defects open                 | PT-04-GATE                      | docs(release) | not started | MT-006    |
| PT-05-002  | Production deployment execution                   | Version deployed to production | Deployment completed with no critical incidents | PT-05-001                       | docs(release) | not started | MT-006    |
| PT-05-003  | Post-release monitoring and validation            | Stability verified post-launch | 24h monitoring shows no blocker alerts          | PT-05-002                       | docs(release) | not started | MT-006    |
| PT-05-GATE | Phase 05-ship complete and final release approved | Final release gate approved    | All PT-05-* tasks are done                      | PT-05-001, PT-05-002, PT-05-003 | docs(release) | not started | MT-006    |


