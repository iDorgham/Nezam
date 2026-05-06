**Gate rule:** The phase passes when the final gate PT-XX-GATE isdone.

## Phase automation (Git)

Non-interactive baseline for work in this phase. Branch names and commit shapes follow [`plan/commit-conventions.md`](../commit-conventions.md).

**START**

1. `git fetch origin --quiet` and `git pull --rebase origin main --quiet` when the tree is clean enough to rebase safely.
2. Create or checkout `feature/<topic>` (or the branch pattern required by active slice).
3. Record baseline SHA with `git rev-parse HEAD`.

**END**

1. Run `/SAVE`-style checkpoint updates (`docs/context`, `docs/reports` when applicable).
2. Commit with prefixes aligned to task rows below and [`plan/commit-conventions.md`](../commit-conventions.md).
3. Push after verification; keep Git hooks enabled unless resolving an emergency.
4. Tag/version bump only per [`plan/tag-version-plan.md`](../tag-version-plan.md); CI must stay green per [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
5. Update [`plan/INDEX.md`](../INDEX.md) STATUS for completed PT rows.

| PT-ID | Description | Outcome | Metric | Dependencies | Commit Prefix | Status | Linked MT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PT-04-001 | Optimize performance bottlenecks from audit | Reduced runtime latency and payload cost | >=20% improvement in key performance metrics | PT-03-GATE | fix(harden) | not started | MT-006 |
| PT-04-002 | Apply security hardening controls | Critical security risks mitigated | 0 high-severity vulnerabilities open | PT-03-GATE | fix(harden) | not started | MT-006 |
| PT-04-003 | Complete accessibility remediation pass | Product meets baseline WCAG criteria | 0 critical accessibility blockers open | PT-03-GATE | fix(harden) | not started | MT-006 |
| PT-04-GATE | Phase 04-harden complete and ready for phase 5 | Hardening gate approved | All PT-04-* tasks are done | PT-04-001, PT-04-002, PT-04-003 | fix(harden) | not started | MT-006 |
