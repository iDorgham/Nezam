# ADR-0002 — CI/CD Pipeline Architecture (v3.2)

| Field | Value |
|---|---|
| ID | ADR-0002 |
| Status | Accepted |
| Date | 2026-06-05 |
| Deciders | DevOps Lead, SRE |
| Supersedes | — |
| Related | ROADMAP_v3.2_HEALTH_100.md §Phase 2 |

---

## Context

v3.1 shipped with a partially validated CI pipeline (60% health). Key gaps:
- Not all 7 design gates were exercised end-to-end on PRs
- Release workflow untested post-branch-rename (`main` → `Master`)
- No rollback runbook; no CI health monitoring
- Performance budget enforcement existed but was not gated in CI

## Decision

Adopt a **layered gate model** across two pipeline tiers:

### Tier 1 — PR Gates (all PRs, fast — target < 4 min)

| Gate | Workflow | Failure action |
|---|---|---|
| Lint + format | `nezam-pr-gates.yml` | Block merge |
| TypeScript typecheck | `nezam-pr-gates.yml` | Block merge |
| Sync drift check | `sync-drift-check.yml` | Block merge |
| SDD gate enforcement | `sdd-gate-enforcement.yml` | Block merge |
| Design gates (7) | `design-gates.yml` | Block merge |

### Tier 2 — Nightly / Release Gates (extended — target < 15 min)

| Gate | Workflow | Failure action |
|---|---|---|
| Full test suite | `nezam-nightly.yml` | Alert + hold release |
| Performance budget (lhci) | `nezam-nightly.yml` | Alert + hold release |
| Security scan (CodeQL) | triggered by `release.yml` | Block release |
| Semantic release | `semantic-release.yml` | Manual fix required |
| Release artifact validation | `release.yml` | Block release |

### Rollback Contract

Every deploy step in `release.yml` must have a paired rollback step documented in `.nezam/core/docs/CI_FAILURE_GUIDE.md`. PR merges are rollback-safe via `git revert`; releases tag rollback ref before promotion.

### Branch strategy

```
feature/* → Master (PR + Tier-1 gates)
Master    → release/* (Tier-2 gates + human gate)
```

No direct push to `Master`. `release/*` branches are release-cut only.

## Consequences

**Good:**
- All 7 design gates enforced on every PR
- Performance regressions caught before merge
- Release process documented and testable on feature branches

**Bad / mitigated:**
- CI time increases ~2 min for Tier-1; acceptable tradeoff for gate coverage
- lhci requires pages to be buildable; mock-stub pages used when real data unavailable

## Files affected

- `.github/workflows/nezam-pr-gates.yml` — extend gate list
- `.github/workflows/release.yml` — add rollback steps + tested end-to-end
- `.github/workflows/sync-drift-check.yml` — promote to blocking PR gate
- `.nezam/core/docs/CI_FAILURE_GUIDE.md` — new
