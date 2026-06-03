---
spec_id: SPEC-SEC-004
feature: Edge-case / fuzz hardening for security-critical modules
status: approved
spec_version: 0.1.0
phase: phase_5
owner: app-security-manager
assigned_tool: claude
security: true
acceptance_criteria:
  - id: AC-001
    description: "svg-sanitizer is fuzzed with nested/encoded/case-varied vectors (mixed-case <ScRiPt>, nested foreignObject, html-entity-encoded javascript:, data: URIs) and must strip every executable vector or fail closed (empty)."
  - id: AC-002
    description: context-compression is exercised with empty, whitespace, multibyte/unicode, and very large (>= 1e6 char) inputs and must always honor the cap and never throw.
  - id: AC-003
    description: hardlock-check is exercised with partial/garbage lock shapes (non-array blocks, null meta, wrong types) and must always fail closed with explicit violations rather than throwing.
---

# T-P5-004 — Edge-case fuzz of security modules

## Context
T-Q-006/008/009 established baseline tests for `svg-sanitizer`, `context-compression`, and
`hardlock-check`. Phase 5 deepens them with adversarial/boundary inputs to prove they fail closed
and never throw on malformed data.

## Target files
- `src/lib/svg-sanitizer.ts`, `src/lib/context-compression.ts`, `src/lib/hardlock-check.ts`
- New: `src/test/security-modules.fuzz.test.ts`

## Test plan
1. SVG: mixed-case tags, nested/encoded vectors, data:/vbscript: URIs → no executable survivor.
2. Compression: empty/whitespace/unicode/huge inputs → cap honored, no throw, monotonic.
3. Hardlock: partial/garbage shapes → fail closed with violations, no throw.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | XSS fail-closed | svg-sanitizer.ts |
| AC-002 | cap honored, no throw | context-compression.ts |
| AC-003 | hardlock fail-closed | hardlock-check.ts |
