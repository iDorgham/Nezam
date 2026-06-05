# NEZAM — RICE Prioritized Backlog
**Generated:** 2026-06-05  
**Task:** T-P1-003 (`/plan prioritize`)  
**Scope:** All open v3.2 backlog items — P1, P2, ROADMAP phases  
**Formula:** `RICE = (Reach × Impact × Confidence) / Effort`

> **Effort scale:** XS=0.5, S=1, M=2, L=4, XL=8  
> **Reach:** active developers/agents benefiting (1–10)  
> **Impact:** value delivered (1=minimal, 3=significant, 5=massive)  
> **Confidence:** likelihood estimate lands as scoped (0.5–1.0)

---

## Tier 1 — Do Now (RICE ≥ 10)

| Rank | ID | Task | R | I | C | E | RICE | Owner | Status |
|------|-----|------|---|---|---|---|------|-------|--------|
| 1 | **T-P1-001** | `design:tokens:emit` — auto-emit design tokens from `DESIGN.md` into CSS vars + TS types | 10 | 3 | 0.9 | 2 | **13.5** | design-systems-token-architect | ✅ Done |
| 2 | **T-P1-004** | Design excellence audit `--strict` on Design Hub | 10 | 3 | 0.85 | 2 | **12.75** | design-excellence-lead | ⚪ Open |
| 3 | **T-P0-003** | SDD gate enforcement — `check-onboarding-readiness.sh`, `wireframes_locked.json` CI validation | 10 | 3 | 0.85 | 2 | **12.75** | swarm-leader + lead-qa-architect | ✅ Done |
| 4 | **T-P0-002** | AI mirror sync integrity — pre-commit hook, `pnpm ai:sync` / `ai:check` CI | 10 | 3 | 0.95 | 2 | **14.25** | devops-manager | ✅ Done |
| 5 | **ROAD-4.1** | Wireframe server integration — Design Hub live preview bridge | 8 | 3 | 0.75 | 4 | **4.5** | design-lead + frontend-lead | ⚪ Open |
| 6 | **ROAD-4.2** | Design tokens + motion budget enforcement (CI gate) | 8 | 3 | 0.80 | 2 | **9.6** | design-systems-token-architect | ⚪ Open |

---

## Tier 2 — Do Next (RICE 5–10)

| Rank | ID | Task | R | I | C | E | RICE | Owner | Status |
|------|-----|------|---|---|---|---|------|-------|--------|
| 7 | **ROAD-2.2** | Performance budget instrumentation — Lighthouse CI + RSC guard | 8 | 3 | 0.80 | 4 | **4.8** | frontend-performance-manager | ⚪ Open |
| 8 | **ROAD-3.1** | Security baselines + SAST automation (CodeQL, secret scanning) | 8 | 3 | 0.85 | 4 | **5.1** | lead-security-officer | ⚪ Open |
| 9 | **ROAD-5.1** | SEO/AEO content framework + structured data schema | 7 | 3 | 0.75 | 4 | **3.9** | content-strategist + seo-specialist | ⚪ Open |
| 10 | **ROAD-5.2** | Analytics + observability — perf dashboards + alerting | 7 | 3 | 0.75 | 4 | **3.9** | analytics-engineer | ⚪ Open |
| 11 | **T-P1-002** | Public docs site from `.nezam/core/plans/03-content/` | 6 | 3 | 0.70 | 4 | **3.15** | content-strategist + frontend-lead | ⚪ Open |
| 12 | **ROAD-6.1** | Documentation completeness — API docs, runbooks, README refresh | 8 | 2 | 0.90 | 2 | **7.2** | docs-hygiene | ⚪ Open |

---

## Tier 3 — Backlog / Plan (RICE < 5)

| Rank | ID | Task | R | I | C | E | RICE | Owner | Status |
|------|-----|------|---|---|---|---|------|-------|--------|
| 13 | **ROAD-2.1** | Full CI pipeline validation + weekly health report | 8 | 2 | 0.85 | 4 | **3.4** | devops + sre | ⚪ Open |
| 14 | **ROAD-6.2** | Team training + certification (agent onboarding guide) | 6 | 2 | 0.80 | 2 | **4.8** | swarm-leader | ⚪ Open |
| 15 | **ROAD-6.3** | Final QA + release prep (v3.2 tag) | 8 | 3 | 0.85 | 4 | **5.1** | lead-qa-architect | ⚪ Open |
| 16 | **T-P2-001** | Arabic/MENA SEO brief (Egyptian Arabic, Sahel context) | 5 | 3 | 0.70 | 2 | **5.25** | masri-content-specialist | ⚪ Open (conditional) |
| 17 | **T-P2-002** | Plugin marketplace for NEZAM commands | 4 | 2 | 0.50 | 8 | **0.5** | community | ⚪ Deferred |
| 18 | **T-P0-004** | Wireframe lock export path — `wireframes_locked.json` at repo root | 6 | 3 | 0.75 | 2 | **6.75** | design-hub-wireframe | ⚪ Open |

---

## Already Complete (reference)

| ID | Task | Completed |
|----|------|-----------|
| T-P0-001 | Design Hub dev/build green (all 6 phases) | ✅ 2026-06-03 |
| T-P0-002 | AI mirror sync integrity | ✅ 2026-06-03 |
| T-P0-003 | SDD gate enforcement | ✅ 2026-06-03 |
| T-P0-005 | Planning artifacts complete | ✅ 2026-05-29 |
| T-P1-003 | RICE prioritize full backlog | ✅ 2026-06-05 (this task) |
| T-Q-001–009 | Quality, RTL, security, hardlock tests | ✅ 2026-06-03 |
| T-P4-001–003 | Polish, a11y Radix, Lighthouse, UX states | ✅ 2026-06-03 |
| T-P5-001–004 | Hardening + CVE audit | ✅ 2026-06-03 |
| T-P6-001–004 | Ship prep, CHANGELOG, release branch, PR | ✅ 2026-06-03 |
| C1–C4 (R1) | Path unification, plan migration, skill dedup | ✅ 2026-06-05 |
| R2 Perf | References tree externalized, watcher excludes, mirror pruning | ✅ 2026-06-05 |

---

## Recommended Sprint Order

Based on RICE + dependency sequencing:

```
Sprint 1 (this week):
  1. T-P1-001  — design:tokens:emit  (RICE 13.5, unblocks ROAD-4.2)
  2. T-P1-004  — design excellence audit --strict  (RICE 12.75)
  3. T-P0-004  — wireframe lock export path  (RICE 6.75, unblocks ROAD-4.1)

Sprint 2 (next week):
  4. ROAD-4.1  — wireframe server integration  (depends T-P0-004)
  5. ROAD-4.2  — design token + motion CI gate  (depends T-P1-001)
  6. ROAD-3.1  — security baselines + SAST

Sprint 3:
  7. ROAD-2.2  — Lighthouse CI + RSC guard
  8. ROAD-5.1  — SEO/AEO content framework
  9. T-P1-002  — public docs site
 10. ROAD-6.1  — docs completeness
```

---

## Notes

- **T-P2-001** (Arabic/MENA SEO) activates when `target_market` includes MENA — confirm with product owner before scheduling.
- **T-P2-002** (plugin marketplace) deferred to community phase; too low confidence at current team size.
- **ROAD-6.3** (final QA + v3.2 tag) is a gate — schedule only after all Tier 1 + Tier 2 items clear.
- RICE scores use week-relative Reach (10 = all current active developers/agents). Revisit after team grows.
