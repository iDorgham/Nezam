**Gate rule:** This sub-phase is complete only when all tasks are markeddone.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-01-01-001 | Identify 50 primary keywords | Keyword list documented in `keywords.md` | >=50 keywords captured | none | feat(seo) | not started | MT-001 |
| PT-01-01-002 | Analyze competitor keyword gaps | Gap report with ranked opportunities | >=20 high-value gaps identified | PT-01-01-001 | feat(seo) | not started | MT-001 |
| PT-01-01-003 | Prioritize keywords by intent and volume | Priority matrix for execution | 100% of primary keywords scored | PT-01-01-001, PT-01-01-002 | feat(seo) | not started | MT-001 |
