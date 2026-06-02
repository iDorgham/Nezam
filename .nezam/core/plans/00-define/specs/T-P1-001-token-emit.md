---
feature_id: T-P1-001
spec_version: 0.1.0
status: approved
built_at_version: "[Unreleased]"
owner: design-systems-token-architect
created: "2026-06-02"
last_updated: "2026-06-02"
---

# Feature Spec — T-P1-001: Token Emit Script

## Meta

| Field | Value |
|---|---|
| Task ID | T-P1-001 |
| Feature Name | `design:tokens:emit` — DESIGN.md → CSS/JSON token pipeline |
| Phase | Phase 2 (P1) |
| Effort | M |
| Priority | P1 |
| Status | approved |

## Problem

DESIGN.md is the single source of truth for design decisions, but its values exist only as prose.
Components that need tokens must either duplicate values or hardcode hex/px primitives — both violate the Zero-Primitive gate.

## Solution

A Node.js script (`emit-tokens.js`) that parses DESIGN.md and emits:
1. `.nezam/design-hub/src/styles/tokens.css` — CSS custom properties (`--ds-*`)
2. `.nezam/design-hub/design/tokens.json` — Structured JSON for tooling

Registered as `pnpm design:tokens:emit` in the root workspace.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | `pnpm design:tokens:emit` exits 0 |
| AC-2 | `tokens.css` contains `--ds-color-primary`, `--ds-color-secondary`, `--ds-color-accent`, and all other DESIGN.md colors |
| AC-3 | `tokens.json` is valid JSON with `color`, `typography`, and `spacing` keys |
| AC-4 | Re-running the script is idempotent — output is identical on repeated runs |
| AC-5 | If `DESIGN.md` is absent, script exits non-zero with a clear error message |

## Implementation

- Script: `.nezam/design-hub/scripts/emit-tokens.js`
- Root entry: `package.json` → `"design:tokens:emit": "node .nezam/design-hub/scripts/emit-tokens.js"`
- Output 1: `.nezam/design-hub/src/styles/tokens.css`
- Output 2: `.nezam/design-hub/design/tokens.json`

## Test coverage

- `src/test/emit-tokens.test.ts` — vitest unit test covering AC-1 through AC-5
