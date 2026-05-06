**Gate rule:** This sub-phase is complete only when all tasks are markeddone.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-03-06-001 | Generate release notes and changelog draft | Release documentation prepared | Changelog includes 100% merged features/fixes | PT-03-05-003 | chore(release) | not started | MT-006 |
| PT-03-06-002 | Deploy to staging and run smoke tests | Staging candidate validated | 0 critical smoke test failures | PT-03-06-001 | chore(release) | not started | MT-006 |
| PT-03-06-003 | Approve build release candidate | Candidate approved for hardening | Staging sign-off complete | PT-03-06-002 | chore(release) | not started | MT-006 |
