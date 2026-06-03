---
spec_id: SPEC-PERF-001
feature: Performance budget gate (Lighthouse CI config + RSC boundary guard)
status: approved
spec_version: 0.1.0
phase: phase_4
owner: frontend-performance-manager
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: A test validates .lighthouserc.json is well-formed and asserts the Core Web Vitals budget thresholds exist and are within sane bounds (LCP/FCP <= 2500ms, CLS <= 0.1, TBT <= 200ms, performance minScore >= 0.8).
  - id: AC-002
    description: A perf:lhci script is wired (lhci added as a devDependency) so the budget runs in CI against a built static dist; the spec documents that the full Lighthouse run requires headless Chrome and executes in CI, not necessarily in the local test sandbox.
  - id: AC-003
    description: An RSC-boundary guard test asserts route entrypoints (app/*/page.tsx, app/layout.tsx) are server components by default (no unnecessary top-level 'use client'), preventing client-bundle regressions.
---

# T-P4-002 — Performance budget gate

## Context
`.lighthouserc.json` already defines a Core Web Vitals budget but `lhci` is not installed and the
collect dir is a stub. Phase 4 makes the budget enforceable in CI and adds a locally-verifiable
guard against client-bundle bloat. The real Lighthouse run needs headless Chrome (CI), so the
locally-runnable verification is the config-validation + RSC-boundary tests.

## Target files
- `.lighthouserc.json`
- `package.json` (add `lhci` devDep + `perf:lhci` script)
- New: `src/test/perf-budget.test.ts` (config validation + RSC boundary guard)

## Test plan
1. Parse `.lighthouserc.json`; assert budget thresholds present and within bounds.
2. Scan `app/*/page.tsx` + `app/layout.tsx`; assert no unnecessary top-level `'use client'`.
3. Document `perf:lhci` for CI; note headless-Chrome requirement.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | budget config valid | .lighthouserc.json |
| AC-002 | CI-runnable gate | package.json perf:lhci |
| AC-003 | no client-bundle creep | app route entrypoints |
