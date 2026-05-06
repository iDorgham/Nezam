**Gate rule:** This sub-phase is complete only when all tasks are markeddone.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-03-05-001 | Build unit and integration test suites | Automated test coverage established | >=80% coverage on critical modules | PT-03-04-003 | fix(tests) | not started | MT-005 |
| PT-03-05-002 | Run E2E regression and fix blockers | Stable end-to-end flows | 100% priority journeys pass E2E | PT-03-05-001 | fix(tests) | not started | MT-005 |
| PT-03-05-003 | Validate a11y and performance budgets | Quality gates enforced | No critical a11y issues and budget pass | PT-03-05-002 | fix(tests) | not started | MT-005 |
