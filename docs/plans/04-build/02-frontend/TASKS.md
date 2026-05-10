**Gate rule:** This sub-phase is complete only when all tasks are markeddone.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-03-03-001 | Implement app shell and route structure | Navigable frontend foundation | 100% key routes accessible | PT-03-02-003 | feat(ui) | not started | MT-005 |
| PT-03-03-002 | Build core UI screens with design system | Core pages rendered with tokens/components | 100% priority screens implemented | PT-03-03-001 | feat(ui) | not started | MT-005 |
| PT-03-03-003 | Integrate frontend state with backend APIs | UI-data integration complete | All core UI actions persist and fetch data | PT-03-03-002 | feat(ui) | not started | MT-005 |
