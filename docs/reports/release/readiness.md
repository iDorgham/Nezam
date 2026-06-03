# Release Readiness — NEZAM (Phase 6 / Ship)

| Field | Value |
|---|---|
| Task | T-P6-001 (SPEC-SHIP-001) |
| Date | 2026-06-03 |
| Branch | `feature/phase4-5-hardening-polish` (pushed to origin) |
| Target version | 0.2.0 |

## Go / No-Go checklist

| Gate | Status | Notes |
|---|---|---|
| Test suite green | ✅ GO | 180 passed · 1 skipped · 0 failed (`pnpm --filter design-hub test`) |
| Type-check clean | ✅ GO | `tsc --noEmit` → 0 errors |
| a11y gate (WCAG 2.2 AA) | ✅ GO | `check:gate-5-a11y` → 14 tests; primitives + Radix covered |
| SDD sync / drift | ✅ GO | pre-commit `ai:check` passed on both phase commits |
| Spec validation | ✅ GO | all SPEC-* validate against schema |
| CHANGELOG | ✅ GO | `[0.2.0] - 2026-06-03` finalized |
| Release config branch | ✅ GO | `release.config.cjs` / `release.yml` now target `Master` (was `main`) |
| Dependency CVEs | ⚠️ CONDITIONAL | 2 moderate (postcss `<8.5.10` → next). Remediation documented; override needs CI install+build verify before a production cut. Not release-blocking for staging. |
| Deploy config in repo | ⚠️ N/A | No `vercel.json`/`vercel.ts` committed. A live deploy requires Vercel project linking + production env/secrets — out of scope for this phase; deferred to an explicit, human-confirmed deploy step. |

## Recommendation

**GO for tagging `v0.2.0` and opening a PR**; **HOLD on production deploy** until:
1. the postcss `>=8.5.10` override is applied and verified by CI (`pnpm install` + build), and
2. a deploy target (Vercel link + env/secrets) is configured and explicitly approved.

## Release procedure (when approved)

1. Merge `feature/phase4-5-hardening-polish` → `Master` via PR.
2. Trigger `release.yml` (workflow_dispatch) with `version=0.2.0`, `target=Master`
   — or run `semantic-release.yml` (now configured for `Master`).
3. Verify the generated GitHub release notes; confirm tag `v0.2.0`.
4. Deploy: configure the Vercel project for `.nezam/design-hub` + `.nezam/docs-site`,
   set env (incl. `ANTHROPIC_API_KEY`), and promote to production **only** after staging QA sign-off.
