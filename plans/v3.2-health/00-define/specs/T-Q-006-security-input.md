---
spec_id: SPEC-QA-006
feature: Security tests for untrusted input — SVG sanitization and upload validation
status: approved
spec_version: 0.1.0
phase: phase_3
owner: app-security-manager
assigned_tool: claude
security: true
acceptance_criteria:
  - id: AC-001
    description: "Tests for src/lib/svg-sanitizer.ts assert that script tags, on* event handlers, javascript: URLs, and foreignObject are stripped from untrusted SVG while safe shapes/paths are preserved."
  - id: AC-002
    description: The asset upload route (app/api/assets/upload/route.ts) rejects disallowed MIME types and oversized payloads with a 4xx, and never persists unsanitized SVG markup.
  - id: AC-003
    description: A regression fixture set of known-malicious SVG payloads is checked, and the test fails if any executable vector survives sanitization.
---

# T-Q-006 — Security: untrusted input sanitization

## Context
Design-hub ingests user-supplied SVG assets. `src/lib/svg-sanitizer.ts` is the trust boundary;
`app/api/assets/upload/route.ts` is the ingress. Both need adversarial coverage so XSS vectors
cannot survive into stored assets or rendered previews.

## Target files
- `src/lib/svg-sanitizer.ts`
- `app/api/assets/upload/route.ts`
- New: `src/test/svg-sanitizer.security.test.ts`,
  `tests/integration/api/assets-upload.security.test.ts`

## Test plan
1. Feed a fixture set of malicious SVGs (script, onload, javascript: href, foreignObject).
2. Assert all executable vectors are removed; safe geometry retained.
3. Drive the upload route with bad MIME/size and assert 4xx + no persistence.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | XSS vectors stripped | svg-sanitizer.ts |
| AC-002 | upload validation | assets/upload route |
| AC-003 | malicious fixtures fail closed | security fixtures |
