---
owner: qa-test-lead + lead-qa-architect
version: 1.0.0
status: active
updated: 2026-05-29
phase: 01-foundation
references:
  - docs/plan/MASTER_TASKS.md
  - .nezam/design-hub/vitest.config.ts
  - DESIGN.md
---

# Test Matrix — Phase 01 Foundation

> AC ↔ test file ↔ status mapping. Updated as tests land. Failing/missing tests block `/develop review`.

## Conventions

| Symbol | Meaning |
|---|---|
| ✅ | Test exists and passes locally |
| 🟡 | Test exists but is incomplete or flagged `.skip` |
| ❌ | No test yet — AC not covered |
| ⏭️ | Out of phase scope (deferred) |
| PT-* | Test plan ID (matches GitHub Actions step name) |

Test paths are relative to `.nezam/design-hub/src/test/` unless otherwise noted.

## Phase 01 — P0 task coverage

### T-P0-001 Design Hub dev/build green

| AC | Acceptance criterion | Test file | Test name | PT-ID | Status |
|---|---|---|---|---|---|
| AC-1 | `pnpm dev` boots on port 4000 | manual — design-hub README | dev server smoke | PT-F-001 | ✅ verified 2026-05-29 |
| AC-2 | `pnpm build` exits 0 | CI workflow `ci.yml` | build job | PT-F-002 | ✅ verified 2026-05-29 (Next.js 15.3.2, 2.6min) |
| AC-3 | `archPageId` 1:1 binding | `lock-session-resolution.test.ts` | "prefers arch_page_id and falls back to legacy PAGE-xxx id" | PT-F-003 | ✅ |
| AC-3 | `archPageId` deterministic mapping | `build-lock-payload.test.ts` | "payload.sitemap.map(p => p.arch_page_id)" | PT-F-004 | ✅ |

### T-P0-002 AI sync integrity

| AC | Acceptance criterion | Test file | Test name | PT-ID | Status |
|---|---|---|---|---|---|
| AC-1 | `pnpm ai:sync` after `.cursor/` edit | `.nezam/core/scripts/sync/sync-ai-folders.js` | (script smoke — manual) | PT-F-005 | ✅ |
| AC-2 | `pnpm ai:check` passes in CI | `.github/workflows/sync-and-drift-check.yml` | drift-verify job | PT-F-006 | ✅ workflow rewritten verify-only |
| AC-3 | Pre-commit hook documented in README | `README.md` §6 | "Pre-commit guard" + "CI gate" sections | PT-F-007 | ✅ |

### T-P0-003 SDD gate enforcement

| AC | Acceptance criterion | Test file | Test name | PT-ID | Status |
|---|---|---|---|---|---|
| AC-1 | `check-onboarding-readiness.sh` exits 0 | `.nezam/core/scripts/checks/check-onboarding-readiness.sh` | bash script smoke | PT-F-008 | ✅ exit 0 verified 2026-05-29 |
| AC-2 | `wireframes_locked.json` validated in CI | `.github/workflows/wireframe-validation.yml` | lock-schema job | PT-F-009 | ✅ new validator at `.nezam/core/scripts/checks/check-wireframes-lock.js` |
| AC-2 | Lock schema structural test | `wireframes-locked-schema.test.ts` | lock schema parses | PT-F-010 | ✅ existing |
| AC-3 | `/plan` + `/develop` hardlocks documented | `.cursor/commands/plan.md`, `.cursor/commands/develop.md` | grep "Hardlock" + "prerequisite" | PT-F-011 | ✅ |

### T-P0-004 Wireframe lock export path

| AC | Acceptance criterion | Test file | Test name | PT-ID | Status |
|---|---|---|---|---|---|
| AC-1 | Export writes valid lock at root | `build-lock-payload.test.ts` | "payload structure" | PT-F-012 | ✅ |
| AC-2 | `arch_page_id` mapping documented | `docs/WIREFRAMES.md` | §2 mapping section | PT-F-013 | ✅ authored 2026-05-29 |
| AC-3 | `/develop` blocked without lock (manual) | manual recipe in `docs/WIREFRAMES.md` §3 | "Manual verification recipe" | PT-F-014 | ✅ recipe documented; live block test deferred to Phase 3 (T-Q-009) |

### T-P0-005 Planning artifacts complete

| AC | Acceptance criterion | Test file | Test name | PT-ID | Status |
|---|---|---|---|---|---|
| AC-1 | `SEO_RESEARCH.md` present | filesystem check | `ls docs/plan/01-research/SEO_RESEARCH.md` | PT-F-015 | ✅ |
| AC-2 | `IA_CONTENT.md` present | filesystem check | `ls docs/plan/02-ia/IA_CONTENT.md` | PT-F-016 | ✅ |
| AC-3 | `CONTENT_MAP.md` present | filesystem check | `ls docs/plan/03-content/CONTENT_MAP.md` | PT-F-017 | ✅ |
| AC-4 | `PROJECT_SCAFFOLD.md` present | filesystem check | `ls docs/plan/scaffold/PROJECT_SCAFFOLD.md` | PT-F-018 | ✅ |

## Auxiliary coverage (existing tests, not directly bound to a P0 AC)

| Test file | Covers | Status |
|---|---|---|
| `arch-add-node.test.ts` | Architecture tree mutation | ✅ |
| `arch-page-map.test.ts` | Page eligibility for lock export | ✅ |
| `block-preview-map.test.ts` | Block type ↔ preview component map | ✅ |
| `block-registry.test.ts` | Wireframe block registry | ✅ |
| `color-a11y.wcag.test.ts` | WCAG color contrast | ✅ (Phase 3 will deepen) |
| `premium-standards.test.ts` | Impeccable craft standards | ✅ |
| `preview-template-layers.test.ts` | Preview layer composition | ✅ |
| `seed-page-session.test.ts` | Initial page session seed | ✅ |
| `service-catalog.test.ts` | Service catalog types | ✅ |
| `ui-button.a11y.test.tsx` | Button a11y | ✅ |
| `validate-p0-wireframes.test.ts` | P0 wireframe constraints | ✅ |
| `wireframe-page-tree.test.ts` | Wireframe page tree | ✅ |

## Deferred — Phase 03 (Quality, Hardlock Verification, RTL Audit)

| Test plan | Owner | Scope |
|---|---|---|
| PT-Q-001 axe-core full sweep | qa-test-lead | All routes pass WCAG 2.2 AA |
| PT-Q-002 RTL parity audit | rtl-specialist | Every block renders correctly with `dir="rtl"` |
| PT-Q-003 RAF profiler | motion-performance-specialist | 60fps on hero animations |
| PT-Q-004 API integration tests | qa-test-lead | All `/api/*` routes happy + error paths |
| PT-Q-005 unit coverage threshold | qa-test-lead | ≥75% lines, ≥90% on token logic |
| PT-Q-006/007 security tests | security-auditor | Auth + input validation |
| PT-Q-008 context overflow | qa-test-lead | Long-form data renders without layout break |
| PT-Q-009 hardlock gate tests | swarm-leader | `/develop` refusals are correct + reversible |

## How to run

```bash
# Unit tests (vitest)
cd .nezam/design-hub && pnpm test

# Single file
cd .nezam/design-hub && pnpm test -- --testPathPattern=lock-session-resolution

# Watch mode
cd .nezam/design-hub && pnpm test -- --watch

# Coverage
cd .nezam/design-hub && pnpm test -- --coverage

# CI parity
pnpm ai:check && pnpm run check:tokens
```

## Update protocol

When adding a new test:

1. Add a row in the matching task table
2. Reference the AC by ID
3. Set status (✅ / 🟡 / ❌)
4. Bump the doc `updated` field in frontmatter
5. Run `pnpm ai:sync && pnpm ai:check` (this file is in `docs/`, not `.cursor/`, so sync is a no-op — but the integrity check still validates references)

When a test fails:

- Do **not** delete the row
- Change status to 🟡 with a `(BLOCKED: PT-ID)` annotation
- Open an issue tagged `phase-01-test-debt`
