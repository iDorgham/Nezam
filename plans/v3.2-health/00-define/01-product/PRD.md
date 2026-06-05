# NEZAM — Product Requirements Document

| Field | Value |
|---|---|
| Document | PRD v2.1 |
| Status | Active |
| Owner | Dorgham (Founder) |
| Last Updated | 2026-05-29 |
| Repository | [iDorgham/Nezam](https://github.com/iDorgham/Nezam) |
| Companion Docs | `.nezam/core/memory/CONTEXT.md` · `.nezam/core/plans/` · `DESIGN.md` · `wireframes_locked.json` |

---

## 1. Vision

**NEZAM is the governance backbone for AI-native software development.**

It transforms chaotic AI-assisted workflows into a deterministic, traceable, repeatable delivery system. Every feature, design decision, and architectural choice flows through a structured pipeline — from spec to ship — with zero reliance on memory or tribal knowledge.

> *"Specification-driven delivery for builders who think in systems."*

---

## 2. Problem Statement

### The Core Problem

AI coding assistants (Cursor, Claude, Gemini, Codex, OpenCode) are powerful but ungoverned. Without a shared contract:

- Agents skip planning and jump to code, creating irreversible architectural drift
- Design decisions made in chat don't survive session resets
- No traceability between requirements → specs → implementation → tests
- Multi-agent swarms have no coordination layer — output is inconsistent and unreviewable
- Onboarding a new AI tool means re-explaining the entire context from scratch

### Why Existing Solutions Fall Short

| Approach | Limitation |
|---|---|
| Raw Cursor rules | No execution pipeline, no memory, no multi-tool sync |
| Ad-hoc prompt libraries | Not versioned, not governed, drifts over time |
| Project management tools | No AI-native integration, no swarm coordination |
| README-driven development | Static, not machine-readable, no enforcement |

---

## 3. Target Users

### Primary: AI-Native Solo Founder / Indie Builder

- Builds product alone or with a small team using AI as the primary dev force
- Uses Cursor as the main IDE; may also use Claude Code, OpenCode, Gemini
- Needs structure but can't afford heavyweight process overhead
- Values: speed, quality, traceability, zero rework

**JTBD:** *"I want to build with AI without losing control of architecture, design, and delivery timeline."*

### Secondary: Technical Lead Managing AI Swarms

- Runs multi-agent workflows across a development team
- Needs consistent behavioral contracts across all AI clients
- Requires audit trails for decisions and handoffs between agents
- Values: governance, reproducibility, team alignment

**JTBD:** *"I need every agent in my swarm to follow the same spec, design contract, and delivery gates — regardless of which AI tool they're using."*

### Tertiary: Workspace Template Adopter

- Forks NEZAM as a starter template for new projects
- Wants a pre-configured, opinionated, production-ready workspace
- Values: instant setup, clear conventions, extensibility

**JTBD:** *"Give me a workspace where the AI starts in the right posture the moment I fork it."*

---

## 4. Goals & Non-Goals

### In Scope

- Canonical SDD pipeline: Planning → SEO → IA → Content → Design → Development → Release (product-type aware)
- Slash commands (`/START`, `/PLAN`, `/DEVELOP`, `/CHECK`, `/DEPLOY`, `/FIX`, `/SCAN`, `/WIREFRAME`, `/DESIGN`)
- **Design Hub** (`.nezam/design-hub/`): architecture tree, wireframe editor, theme studio, profile browser, export hub → `DESIGN.md` + `wireframes_locked.json`
- Multi-AI client sync: Cursor (canonical), Claude, Gemini, OpenCode, Codex, Qwen, Antigravity, Kilocode, Windsurf, VS Code mirrors
- Swarm agent system: 150+ specialized agents with lazy-load routing
- Skill library: domain skill packs under `.cursor/skills/` with registry + `pnpm ai:check` frontmatter validation
- Memory system: 4-layer durable memory (session → project → team → workspace contracts)
- Design governance: token-first CSS, fluid type/grid, motion budget, wireframe lock before `/DEVELOP`
- GitHub automation: CI for onboarding, AI sync drift, design tokens, wireframe schema validation
- Hardlock system: `.nezam/core/gates/hardlock-paths.json` + `.cursor/state/onboarding.yaml` gate `/plan` and `/develop`

### Out of Scope

- Full production application code (NEZAM governs the workspace, not the app)
- Hosting/infrastructure provisioning
- Consumer-facing product UI
- SaaS billing or multi-tenancy (unless added as a separate `apps/` package)

---

## 5. Requirements

### P0 — Critical

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-01 | PRD + project context exist and pass CI onboarding check | `scripts/checks/check-onboarding-readiness.sh` exits 0 |
| R-02 | All AI clients read from the same canonical agent/rule/command source | `.cursor/` is canonical; synced clients pass `pnpm ai:check` |
| R-03 | SDD pipeline enforces phase order — no skipping | Hardlock system blocks execution if prerequisites unmet |
| R-04 | Memory system persists decisions across session resets | `.nezam/core/memory/MEMORY.md` updated at each phase gate |
| R-05 | Swarm leader + subagent controller route tasks deterministically | All invocations route through `swarm-leader.md` or `subagent-controller.md` |

### P1 — Important

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-06 | Design contract exists before implementation begins | Root `DESIGN.md` passes `.nezam/core/scripts/checks/check-design-tokens.sh` |
| R-06b | Wireframe lock exists for UI work | `wireframes_locked.json` (repo root or `.session/`) validates in CI |
| R-07 | Test matrix defined before test code is written | `docs/reports/tests/TEST_MATRIX.md` maps ACs to plan PT-IDs |
| R-08 | GitHub gate matrix enforces phase transitions | `.nezam/core/gates/GITHUB_GATE_MATRIX.json` covers all phases |
| R-09 | Multi-tool sync keeps all AI clients aligned | `pnpm ai:sync` completes without diff errors |
| R-10 | Skill packs cover all major development domains | 10 domain skill packs each with `SKILL.md` entry point |

### P2 — Nice to Have

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-11 | Agent evaluation framework with confidence thresholds | `EVAL_FRAMEWORK.md` defines tier-1 and tier-2 criteria |
| R-12 | Semantic release automation on tag push | `release.config.cjs` + CI produces CHANGELOG on tag |
| R-13 | Continual learning pipeline for skill optimization | `scripts/continual-learning/` benchmarks agent outputs |
| R-14 | Arabic/RTL content and localization support | Dedicated Arabic agents + RTL design tokens present |

---

## 6. Architecture Overview

```
NEZAM Workspace
├── .cursor/                    ← Canonical (agents, commands, skills, rules) — edit here only
├── .claude/ · .gemini/ · .codex/ · .opencode/ · .qwen/ · .antigravity/ · .kilocode/  ← pnpm ai:sync mirrors
├── .nezam/
│   ├── core/
│   │   ├── prd/                ← PRD (this file), release-roadmap.json
│   │   ├── plans/              ← SDD phase plans + feature specs
│   │   ├── gates/              ← hardlock-paths.json, GITHUB_GATE_MATRIX.json
│   │   ├── memory/             ← MEMORY.md, CONTEXT.md, decision logs
│   │   ├── architecture/       ← ARCHITECTURE.md, ADRs
│   │   └── scripts/            ← sync, checks, design:apply, continual-learning
│   ├── design-hub/             ← Next.js Design Hub (localhost:4000)
│   └── design/                 ← Brand profile catalog
├── docs/
│   ├── plan/ · docs/reports/   ← User project plans + generated reports
│   └── start/                ← Onboarding intake (PRD drop zone)
├── .cursor/state/              ← onboarding.yaml, agent-bus, plan progress
├── DESIGN.md                   ← Active design contract (root)
├── wireframes_locked.json      ← Human-approved layout contract (root)
├── CLAUDE.md · AGENTS.md · GEMINI.md   ← Generated client entrypoints
└── README.md                   ← Public GitHub documentation
```

### SDD Pipeline

```
/START → /PLAN → research · IA · content → DESIGN + wireframes → /DEVELOP → harden → /DEPLOY
   ↓       ↓              ↓                    ↓ (Design Hub)        ↓
 PRD    plans/         SEO/IA docs         DESIGN.md +            feature slices
 lock   INDEX.md                         wireframes_locked.json
```

**Hardlock sources:** `.nezam/core/gates/hardlock-paths.json`, `.cursor/state/onboarding.yaml`, design-hub + design-gates rules.

---

## 7. Memory System

NEZAM uses a 4-layer memory architecture to ensure decisions survive session resets:

| Layer | What | Where |
|---|---|---|
| Layer 0 | Session runtime (ephemeral) | Cursor chat, open buffers |
| Layer 1 | Project SDD truth (durable) | `.nezam/core/memory/MEMORY.md`, `.nezam/core/plans/`, specs |
| Layer 2 | Team behavior contracts | `.cursor/agents/`, `.cursor/rules/` |
| Layer 3 | Workspace-level governance | `CLAUDE.md`, `AGENTS.md`, `.nezam/core/memory/MEMORY_ARCHITECTURE.md` |

**Capture protocol:** Agents must persist to Layer 1+ before ending any phase gate reply.

---

## 8. Agent Swarm System

NEZAM includes 100+ specialized agents organized in a swarm hierarchy:

```
executive-director
└── swarm-leader
    └── deputy-swarm-leader
        └── subagent-controller
            ├── Lead Architects (backend, frontend, mobile, infra, security, AI ethics)
            ├── Domain Specialists (100+ agents by function)
            └── Arabic/MENA Specialists (Khaleeji, Levantine, Masri, Maghrebi, MSA)
```

All agents are lazy-loaded via `agent-lazy-load.mdc`. Only agents needed for the active task enter context.

---

## 9. Success Metrics / KPIs

| Metric | Target | Measurement |
|---|---|---|
| Onboarding CI pass rate | 100% | `check-onboarding-readiness.sh` on main branch |
| Phase gate compliance | 0 skipped gates | GitHub gate matrix JSON audit |
| Memory retention across resets | 100% of P0 decisions | Manual audit of `.nezam/core/memory/MEMORY.md` |
| Multi-client sync drift | 0 diffs | `pnpm ai:check` output |
| Test coverage (when app added) | ≥ 80% critical paths | TEST_MATRIX.md coverage vs. code |
| Lighthouse score (when app added) | ≥ 90 all categories | `.lighthouserc.json` CI run |

---

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Context overload from large agent/doc count | High | High | Agent lazy-load; alias tables; PRD-scoped ingest |
| Drift between `.cursor/` and synced AI clients | Med | High | `pnpm ai:sync` + `pnpm ai:check` in CI |
| Hardlock blocking valid fast-path work | Low | Med | `/FIX` command override with audit trail |
| Arabic agent outputs not reviewed by native speaker | Med | Med | Specialist agents + review flag in AGENT_COMM_PROTOCOL |
| Design-implementation drift post-gate | Med | Med | `check-design-tokens.sh` in CI; gate matrix enforcement |

---

## 11. Release Roadmap

**Source:** [`release-roadmap.json`](./release-roadmap.json). **Regenerate:** `pnpm prd:roadmap`. CI verifies the table matches JSON (`pnpm prd:roadmap:check`).

<!-- NEZAM_RELEASE_ROADMAP_TABLE_START -->

| Milestone | Version | Scope |
|---|---|---|
| Workspace Kit baseline | `0.1.0` | Onboarding gates green, DESIGN.md + TEST_MATRIX.md |
| Full SDD pipeline | `0.2.0` | All phase plans populated, gate matrix active |
| Multi-client parity | `0.3.0` | All 8 AI clients synced, `ai:check` passes |
| Memory v2 | `0.4.0` | 4-layer memory operational, capture protocol enforced |
| Swarm v1 | `0.5.0` | 100+ agents, lazy-load, eval framework live |
| Template release | `1.0.0` | Fully forkable, documented, production-ready |

<!-- NEZAM_RELEASE_ROADMAP_TABLE_END -->

---

## 12. Design Hub (product surface)

The Design Hub is a first-class NEZAM deliverable — not optional tooling.

| Module | Purpose | Output |
|--------|---------|--------|
| Architecture | App → menu → page tree; service rack; API wiring | `project_context.json`, arch page IDs |
| Wireframes | Block canvas per architecture page; layout shells | `.session/pages/{archPageId}.json` → `wireframes_locked.json` |
| Theme / design system | Tokens, light/dark, typography, grid | Root `DESIGN.md` via `pnpm run design:apply` or export |
| Components | shadcn registry browse | Implementation reference for `/DEVELOP` |
| Export | 12 formats (routes, nav, Mermaid, full context) | Planning handoff artifacts |

**Run:** `pnpm design-hub` (port **4000**). **Gate:** no implementation-oriented `/DEVELOP` until `wireframes_locked.json` exists.

---

## 13. Open Questions

- [ ] Should monorepo `apps/*` use the full SDD pipeline or a lighter variant per app?
- [ ] Standardize `.session/` wireframe sessions vs repo-root lock only?
- [ ] Publish NEZAM as `create-nezam` scaffolding CLI?
- [x] Design Hub wireframe lock as hard gate — **implemented** (`design-hub-gates.mdc`, CI wireframe validation)

---

## 14. Appendix

- [Architecture](../architecture/ARCHITECTURE.md)
- [Memory Architecture](../memory/MEMORY_ARCHITECTURE.md)
- [SDD Phase Plans](../plans/)
- [Design Hub overview](../docs/design-hub.md) · [Design Hub app](../../design-hub/)
- [Gate matrix](../gates/GITHUB_GATE_MATRIX.json)
- [Hardlock paths](../gates/hardlock-paths.json)
- [Agent Eval Framework](../../../.cursor/agents/EVAL_FRAMEWORK.md)
