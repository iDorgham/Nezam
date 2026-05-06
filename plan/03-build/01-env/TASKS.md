**Gate rule:** This sub-phase is complete only when all tasks are markeddone.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-03-01-001 | Define development environment baseline | Setup guide drafted | 100% required tooling documented | none | chore(ci) | not started | MT-004 |
| PT-03-01-002 | Configure linting and formatting in CI | Automated quality checks active | Lint and format checks run on all PRs | PT-03-01-001 | chore(ci) | not started | MT-004 |
| PT-03-01-003 | Add build/test pipeline jobs | Build pipeline operational | CI executes build and tests successfully | PT-03-01-002 | chore(ci) | not started | MT-004 |
