---
spec_id: SPEC-SEC-002
feature: Dependency vulnerability audit and CI wiring
status: approved
spec_version: 0.1.0
phase: phase_5
owner: lead-security-officer
assigned_tool: claude
security: true
acceptance_criteria:
  - id: AC-001
    description: A security audit report documents the current npm-audit findings (2 moderate as of 2026-06-03 — postcss <8.5.10 XSS GHSA-qx2v-qp2m-jg93 and the next transitive dependency) with severity, advisory link, and remediation.
  - id: AC-002
    description: A security:audit npm script is wired to run npm audit against the public registry (the local mirror lacks an audit endpoint), runnable in CI.
  - id: AC-003
    description: A remediation plan is recorded — a postcss >= 8.5.10 resolution override is proposed but flagged as requiring install + build verification before merge (not blindly applied).
---

# T-P5-002 — Dependency CVE audit

## Context
`pnpm audit` fails locally because the configured registry (`npmmirror.com`) has no audit
endpoint. Running `npm audit` against the public registry using the root `package-lock.json`
surfaces 2 moderate vulnerabilities: `postcss <8.5.10` (XSS via unescaped `</style>`) and `next`
(transitively depends on the vulnerable postcss).

## Target files
- New: `docs/reports/security/dependency-audit.md`
- `package.json` (root) — `security:audit` script; proposed `pnpm.overrides` postcss entry (documented, not auto-applied)

## Plan
1. Capture and document findings (severity, advisory, dependency path).
2. Wire `security:audit` → `npm audit --registry=https://registry.npmjs.org`.
3. Record remediation: postcss override `>=8.5.10`; verify via install + build in CI before applying.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | findings documented | dependency-audit.md |
| AC-002 | audit runnable in CI | package.json security:audit |
| AC-003 | remediation plan | dependency-audit.md |
