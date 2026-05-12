# AGENT_AUDIT — NEZAM `.cursor/agents/` tier classification

**Auditor persona:** PM-01 (`swarm-leader`).  
**Date:** 2026-05-10  
**Scope:** Classification only — **no agent files renamed, deleted, or edited** during this audit pass (per swarm FIX 03 instructions).

---

## Methodology

| Tier | Definition |
|------|-------------|
| **TIER 1 — Core** | Directly surfaced by SDD **`Agent Routing by Phase`** in `.cursor/rules/sdd-pipeline-v2.mdc`, **and/or** **`README.md` Swarm Core / Deputy / Controller**, **and/or** explicit mentions in `.cursor/commands/*.md` for default scaffold routing. Alias rows in SDD (`a11y-auditor`, `a11y-perf-auditor`) map to file `a11y-performance-auditor.md`. |
| **TIER 2 — Specialist** | **All other** tracked agent files (default on-demand via PM-01 / handoff / vertical slice). |
| **TIER 3 — Dormant** | No occurrence of the agent slug in `.cursor/commands/`, `.cursor/rules/`, **or** SDD routing table / plan scaffold examples — **and** not in README core row. These are **archive candidates** until an activation trigger is added. |

**Counts (including new `EVAL_FRAMEWORK.md` doc):** Tier 1 **31** · Tier 2 **76** · Tier 3 **18** · **Total 125** agent markdown files (excluding `README.md`).

---

## Tier 1 — Core (activation + reference)

| Agent file | Primary activation source | Output / contract |
|------------|---------------------------|-------------------|
| `swarm-leader.md` | SDD routing “PM-01”; all commands implicitly | Footer in file; hardlock posture |
| `deputy-swarm-leader.md` | Cross-swarm cadence (`deputy-orchestrator` alias in controller) | Daily sync memo; conflict memo |
| `subagent-controller.md` | Phase handoffs; multi-swarm bundles | Routing map + bundles + FAST PATH |
| `project-architect.md` | Scaffold phase + ARCH-01 | Structure + scaffold alignment |
| `design-lead.md` | README Swarm Core; `/PLAN design` lineage | DESIGN.md governance lens |
| `frontend-lead.md` | README; plan scaffold `[Phase 2 · frontend-lead]` | FE delivery |
| `backend-lead.md` | README Swarm Core | API / data slices |
| `product-officer.md` | SDD Idea phase | Problem framing |
| `business-analyst.md` | SDD Idea / Research | Requirements / market framing |
| `requirements-analysis-manager.md` | SDD Idea support | RACI-ready requirements |
| `technical-feasibility-analyst.md` | SDD Validate | Risk/feasibility |
| `seo-specialist.md` | SDD Research / IA / Content; `/founder.md` lineage | Keywords & intent |
| `aeo-specialist.md` | SDD Research support | Answer-engine surfaces |
| `content-strategist.md` | SDD Research / IA / Content | Narrative + IA cohesion |
| `lead-solution-architect.md` | SDD Architecture lead | SYSTEM arch |
| `lead-backend-architect.md` | SDD Architecture support | Backend arch |
| `lead-database-architect.md` | SDD Architecture support; plan `[Database · …]` | Data layer |
| `lead-uiux-designer.md` | SDD IA / Design | UX + IA (app paths) |
| `ux-research-strategy-manager.md` | SDD IA support | Research-backed flows |
| `design-systems-token-architect.md` | SDD Design support | Tokens / DS |
| `a11y-performance-auditor.md` | SDD Design (`a11y-auditor`); SDD Harden (`a11y-perf-auditor`) | a11y + perf evidence |
| `arabic-content-master.md` | SDD Content (MENA lane) | Arabic content |
| `lead-qa-architect.md` | SDD Harden lead | QA gate |
| `security-auditor.md` | SDD Harden support | SECURITY evidence |
| `lead-devops-performance.md` | SDD Ship lead | Release + ops |
| `gitops-engineer.md` | SDD Ship support | Deploy graph |
| `ci-automation.md` | SDD Ship support | CI truth |
| `auth-security-manager.md` | `.cursor/commands/plan.md` scaffold | Auth shells |
| `react-component-lead.md` | Plan scaffold `[Design System · …]` | Component API |
| `code-generation-supervisor.md` | `subagent-controller` escalation roster | Tier 1 eval operator per `EVAL_FRAMEWORK.md` |
| `EVAL_FRAMEWORK.md` | Documented Tier 1 eval path | Defines scorecard |

**Verifier note:** Tier 1 rows **must** keep `Activation Triggers` / charter sections in-file; routing truth is **`sdd-pipeline-v2.mdc`** plus command mentions above.

---

## Tier 3 — Dormant (recommended `ARCHIVE` until promoted)

Single-line rationales — **promote** by adding explicit trigger text to `.cursor/commands/*.md`, `.cursor/rules/*.mdc`, or SDD routing table row.

| Agent | Recommendation |
|-------|----------------|
| `android-engineer.md` | **ARCHIVE** — no command/rule/pipeline reference; **PROMOTE** when `/PLAN` or `/DEVELOP` gains an `android` / `kotlin` facet. |
| `dependency-update-specialist.md` | **ARCHIVE** — dormant; **PROMOTE** under `/FIX` or `/SCAN deps` docs. |
| `executive-director.md` | **ARCHIVE** — narrative-only role unused in SDD tooling; optional exec briefings later. |
| `feature-flags-specialist.md` | **ARCHIVE**; **PROMOTE** with `/DEPLOY rc` preflight checklist. |
| `mena-payments-specialist.md` | **ARCHIVE** duplicate of narrower `payments-lead`; fold or PROMOTE via regional ADR checklist. |
| `mobile-offline-sync-specialist.md` | **ARCHIVE**; **PROMOTE** when mobile/offline HARDLOCK fires in active plan. |
| `mobile-push-notifications-specialist.md` | **ARCHIVE**; **PROMOTE** with push HARDEN slice template. |
| `observability-specialist.md` | **ARCHIVE**; **PROMOTE** under `/DEPLOY verify` instrumentation section. |
| `performance-engineer.md` | **ARCHIVE**; overlaps `lead-devops-performance` / auditor — PROMOTE via `/SCAN perf` routing table row. |
| `product-manager.md` | **ARCHIVE** duplicate of lighter `product-officer` for IDEA; unify or PROMOTE RACI-heavy programs. |
| `real-time-streaming-specialist.md` | **ARCHIVE**; **PROMOTE** when PRD mandates WebSockets/events. |
| `refactoring-specialist.md` | **ARCHIVE**; **PROMOTE** `/FIX refactor` routing. |
| `risk-assessment-specialist.md` | **ARCHIVE**; **PROMOTE** Validate phase optional row. |
| `technology-evaluator.md` | **ARCHIVE**; **PROMOTE** Research phase tooling bake-off appendix. |
| `threat-modeling-specialist.md` | **ARCHIVE**; **PROMOTE** `/SCAN security` deep path. |
| `time-series-specialist.md` | **ARCHIVE**; **PROMOTE** Analytics vertical SPEC template. |
| `vector-store-specialist.md` | **ARCHIVE**; **PROMOTE** ML/RAG roadmap row. |
| `white-label-theming-specialist.md` | **ARCHIVE**; **PROMOTE** SaaS DESIGN extension checklist. |

---

## Tier 2 — Specialist bulk (implicit activation)

Tier 2 is **everything not listed in Tier 1 or Tier 3** (~75 agents). Invocation default: PM-01 delegates by slice, swarm lane, or `PHASE_HANDOFF.md` coordination.

Maintain this split by rerun:

```bash
# heuristic: dormant = slug absent from commands, rules (all .mdc), and sdd routing table excerpt
grep -Eho '[a-z0-9]+(-[a-z0-9]+)+' .cursor/rules/sdd-pipeline-v2.mdc | sort -u
```

---

## Promoted-trigger backlog (recommended text inserts)

| Target | Draft activation trigger |
|--------|---------------------------|
| `performance-engineer` | Add `/SCAN perf deep` subsection routing to Performance engineer when **Lighthouse fails gate** (`design-gates`). |
| `observability-specialist` | Add `/DEPLOY verify` bullet: OTel/SLO verification path. |
| `threat-modeling-specialist` | Add `/SCAN security`: STRIDE appendix option. |

---

## Next revision

- After first **quarterly** scorecard review per `.cursor/agents/EVAL_FRAMEWORK.md`, reconcile Tier movement here.
- When retiring dormant agents, use a **git-tracked** rename or removal in a dedicated PR (no silent deletion); keep a one-line pointer in this audit log if humans need to find the old prompt.
