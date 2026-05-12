**Gate rule:** This sub-phase is complete only when all tasks are markeddone.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-03-02-001 | Define API contract and schema set | Contract-first API design complete | 100% core resources documented | PT-02-GATE | feat(backend) | not started | MT-004 |
| PT-03-02-002 | Implement authenticated CRUD endpoints | Functional backend services | All CRUD endpoints return expected responses | PT-03-02-001 | feat(backend) | not started | MT-004 |
| PT-03-02-003 | Add contract and integration tests for API | Backend verification suite complete | 100% critical API tests passing | PT-03-02-002 | feat(backend) | not started | MT-004 |
