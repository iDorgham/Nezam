---
spec_id: SPEC-SEC-001
feature: Path-traversal regression tests for filesystem-writing API routes
status: approved
spec_version: 0.1.0
phase: phase_5
owner: app-security-manager
assigned_tool: claude
security: true
acceptance_criteria:
  - id: AC-001
    description: A security test drives app/api/pages/[pageId] GET/POST with traversal payloads (../, ..%2f, absolute paths, dotfiles) and asserts a 400 'Invalid pageId' with no filesystem read/write outside the session dir.
  - id: AC-002
    description: Valid pageIds matching ^[A-Za-z0-9_-]+$ are accepted, confirming the sanitizePageId allowlist permits legitimate ids while rejecting traversal.
  - id: AC-003
    description: An audit assertion confirms the other fs-writing routes (context, lock) use fixed resolved paths from @/lib/paths and do not interpolate untrusted request input into file paths.
---

# T-P5-001 — Path-traversal hardening

## Context
`app/api/pages/[pageId]/route.ts` interpolates a user-supplied `pageId` into a filesystem path.
It already guards with `sanitizePageId` (`^[A-Za-z0-9_-]+$`), but the protection is untested —
Phase 5 locks it in with adversarial tests so the guard cannot silently regress. Other fs routes
(`context`, `lock`) use fixed paths from `@/lib/paths`; `profiles`/`session/save-page` are 501 stubs.

## Target files
- `app/api/pages/[pageId]/route.ts` (sanitizePageId)
- `app/api/context/route.ts`, `app/api/lock/route.ts` (fixed-path audit)
- New: `src/test/path-traversal.security.test.ts`

## Test plan
1. Call the pageId route with `../`, encoded, absolute, and dotfile payloads → expect 400.
2. Call with valid ids → expect non-400 (200/empty).
3. Assert the route never resolves a path outside `getPagesSessionDir()`.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | traversal rejected | pages/[pageId] |
| AC-002 | valid ids accepted | sanitizePageId |
| AC-003 | fixed-path routes | context, lock |
