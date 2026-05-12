# Project constitution — {{PROJECT_NAME}}

Non-negotiable principles for architecture, quality, and security. Amend via dated decision in `docs/nezam/memory/MEMORY.md` and linked spec appendix.

## Architecture principles

- Primary patterns:
- Tech stack constraints:
- Data boundaries (what leaves the browser vs stays server-side):

## Quality gates

| Gate          | Target / rule                              |
| ------------- | ------------------------------------------ |
| Tests         | Coverage >= __% for critical paths (adjust) |
| Lint / format | Required on CI / pre-commit                |
| Type safety   | Strictness policy (if applicable)          |
| Security scan | Frequency + scope (deps, SAST, secrets)    |
| Accessibility | WCAG 2.2 AA + keyboard/focus/reduced-motion checks |
| Web vitals    | LCP `< 2.5s`, CLS `< 0.1`, INP `< 200ms`   |
| Design gates  | Token-only styling, fluid `clamp()` type, 3D fallback chain |

## Invariants

Rules that must not be violated without explicit stakeholder approval:

## Change procedure

1. Propose change in a spec or `docs/nezam/memory/MEMORY.md` with date and rationale.
2. Update affected acceptance criteria and `VERSIONING.md` if release-impacting.
3. Run `/PLAN` or `/SCAN` as appropriate before merge.

## Review & sign-off

| Role  | Name | Date |
| ----- | ---- | ---- |
| Owner |      |      |
| Tech  |      |      |
