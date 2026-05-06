# Master Tasks


| MT-ID  | Outcome                                             | Metric                                                  | SemVer Bump | Linked Phases                                                                                                        | Risk   |
| ------ | --------------------------------------------------- | ------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- | ------ |
| MT-001 | SEO keyword and gap research completed              | >=80% keyword coverage vs competitors                   | patch       | `01-content-foundation/01-research`, `01-content-foundation/02-strategy`                                             | low    |
| MT-002 | Content pages drafted and compliance-checked        | All required legal disclaimers present on planned pages | patch       | `01-content-foundation/03-create`, `01-content-foundation/04-compliance`                                             | medium |
| MT-003 | Design system tokenized and page templates approved | 100% of core components and layouts signed off          | minor       | `02-design-system/01-tokens`, `02-design-system/02-flows`, `02-design-system/03-ui-kit`, `02-design-system/04-pages` | low    |
| MT-004 | Backend API and data model operational              | All CRUD and auth contract tests pass in CI             | minor       | `03-build/02-backend`                                                                                                | medium |
| MT-005 | Vertical feature slices integrated end-to-end       | 3 priority user journeys complete and demoable          | minor       | `03-build/03-frontend`, `03-build/04-features`, `03-build/05-test`                                                   | high   |
| MT-006 | Release candidate hardened and shipped              | Zero known blockers and staging sign-off achieved       | major       | `04-harden`, `05-ship`                                                                                               | medium |
