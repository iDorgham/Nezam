**Gate rule:** This sub-phase is complete only when all tasks are markeddone.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-03-04-001 | Implement authentication slice end-to-end | Auth workflow fully integrated | Sign-up, sign-in, sign-out all pass QA | PT-03-03-003 | feat(features) | not started | MT-005 |
| PT-03-04-002 | Implement search/discovery slice end-to-end | Search workflow fully integrated | Query, filter, and result interactions pass QA | PT-03-04-001 | feat(features) | not started | MT-005 |
| PT-03-04-003 | Implement listing/management slice end-to-end | Listing workflow fully integrated | Create, edit, delete listing journey passes QA | PT-03-04-002 | feat(features) | not started | MT-005 |
