**Gate rule:** This sub-phase is complete only when all tasks are markeddone.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-01-04-001 | Draft required legal disclaimers | Baseline legal copy available | 100% required disclaimer sections drafted | PT-01-03-001 | feat(legal) | not started | MT-002 |
| PT-01-04-002 | Legal and policy review | Reviewed legal language | All critical comments resolved | PT-01-04-001, PT-01-03-003 | feat(legal) | not started | MT-002 |
| PT-01-04-003 | Finalize compliance copy package | Implementation-ready compliance text | Formal approval from legal owner | PT-01-04-002 | feat(legal) | not started | MT-002 |
