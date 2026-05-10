# NEZAM — Documentation Hub

> Central index for all NEZAM workspace documentation.  
> Start here. Everything links from here.

---

## Getting Started

| Resource | Path | Description |
|---|---|---|
| Quick start | [../README.md](../README.md) | Repo overview + setup |
| Onboarding guide | [START.md](START.md) | Step-by-step onboarding |
| PRD | [prd/PRD.md](prd/PRD.md) | What NEZAM is and why |
| Wiki home | [wiki/Home.md](wiki/Home.md) | Full knowledge base (sidebar/footer via [wiki/README.md](wiki/README.md) + `pnpm docs:wiki`) |

---

## Core Documentation

### Memory (AI Durable Context)

> All files the AI reads to understand current state, decisions, and protocols.

| File | Purpose |
|---|---|
| [memory/MEMORY.md](memory/MEMORY.md) | Stack decisions, ADRs, design locks, agent scorecards |
| [memory/CONTEXT.md](memory/CONTEXT.md) | Current phase, priorities, blockers |
| [memory/PHASE_HANDOFF.md](memory/PHASE_HANDOFF.md) | Briefing for next agent/session at phase boundary |
| [memory/WORKSPACE_INDEX.md](memory/WORKSPACE_INDEX.md) | Static workspace capability map |
| [memory/DECISIONS.md](memory/DECISIONS.md) | Plain-language decision log |
| [memory/MEMORY_ARCHITECTURE.md](memory/MEMORY_ARCHITECTURE.md) | 4-layer memory system explained |
| [memory/MCP_REGISTRY.md](memory/MCP_REGISTRY.md) | MCP tool registry |
| [memory/MULTI_TOOL_INDEX.md](memory/MULTI_TOOL_INDEX.md) | Cross-tool capability map |
| [memory/AGENT_COMM_PROTOCOL.md](memory/AGENT_COMM_PROTOCOL.md) | Inter-agent communication standards |
| [memory/ORCHESTRATION_ALIASES.md](memory/ORCHESTRATION_ALIASES.md) | Command and alias routing |
| [memory/ERROR_HANDLING_PROTOCOL.md](memory/ERROR_HANDLING_PROTOCOL.md) | Error classification and response |
| [memory/CLI_TOOLS_CONTEXT.md](memory/CLI_TOOLS_CONTEXT.md) | CLI tool reference |
| [memory/SKILL_CHANGELOG.md](memory/SKILL_CHANGELOG.md) | Skill addition/change history |
| [memory/AGENT_AUDIT.md](memory/AGENT_AUDIT.md) | Agent coverage and gap analysis |
| [memory/SWARM_DECISION_LOG.md](memory/SWARM_DECISION_LOG.md) | Swarm-level decision log |

---

### Product & Architecture

| File | Purpose |
|---|---|
| [prd/PRD.md](prd/PRD.md) | Full Product Requirements Document |
| [architecture/decisions/](architecture/decisions/) | Architecture Decision Records (ADRs) |
| [architecture/diagrams/](architecture/diagrams/) | System diagrams (Mermaid) |
| [design/DESIGN_PHILOSOPHY.md](design/DESIGN_PHILOSOPHY.md) | Brand + design philosophy |
| [specs/TECH_STACK.md](specs/TECH_STACK.md) | Developer tech stack reference 2026 |

---

### Execution (SDD Pipeline)

| Resource | Purpose |
|---|---|
| [plans/INDEX.md](plans/INDEX.md) | Phase execution index (MT/PT task IDs) |
| [plans/MASTER_TASKS.md](plans/MASTER_TASKS.md) | Master task list |
| [plans/00-define/](plans/00-define/) | Phase 00: Define |
| [plans/01-research/](plans/01-research/) | Phase 01: Research / SEO |
| [plans/02-design/](plans/02-design/) | Phase 02: Design |
| [plans/03-content/](plans/03-content/) | Phase 03: Content |
| [plans/04-build/](plans/04-build/) | Phase 04: Build |
| [plans/05-harden/](plans/05-harden/) | Phase 05: Harden |
| [plans/06-ship/](plans/06-ship/) | Phase 06: Ship |
| [plans/gates/GITHUB_GATE_MATRIX.json](plans/gates/GITHUB_GATE_MATRIX.json) | Gate matrix |

---

### Wiki (GitHub Wiki Source)

| Page | Purpose |
|---|---|
| [wiki/Home.md](wiki/Home.md) | Wiki home + navigation |
| [wiki/Architecture.md](wiki/Architecture.md) | System architecture |
| [wiki/SDD-Pipeline.md](wiki/SDD-Pipeline.md) | SDD phases + commands |
| [wiki/Agent-Map.md](wiki/Agent-Map.md) | Full agent hierarchy |
| [wiki/Design-System.md](wiki/Design-System.md) | Design governance |
| [wiki/Commands.md](wiki/Commands.md) | Slash commands reference |
| [wiki/Memory-System.md](wiki/Memory-System.md) | Memory system explained |
| [wiki/Contributing.md](wiki/Contributing.md) | How to contribute |
| [wiki/Deployment.md](wiki/Deployment.md) | CI/CD + deployment |

---

### Reports (CI-Generated)

| Report | Path |
|---|---|
| Progress | [reports/progress/PROGRESS_REPORT.latest.md](reports/progress/PROGRESS_REPORT.latest.md) |
| Test matrix | [reports/tests/TEST_MATRIX.md](reports/tests/TEST_MATRIX.md) |
| Token audit | [reports/perf/TOKEN_AUDIT.latest.md](reports/perf/TOKEN_AUDIT.latest.md) |
| Skill audits | [reports/audits/](reports/audits/) |
| A11y | [reports/a11y/](reports/a11y/) |
| Security | [reports/security/](reports/security/) |
| Lighthouse | [reports/lighthouse/](reports/lighthouse/) |

---

### Templates

| Category | Path |
|---|---|
| AI client templates | [templates/ai-client/](templates/ai-client/) |
| Plan + gate templates | [templates/plan/](templates/plan/) |
| SDD templates | [templates/sdd/](templates/sdd/) |
| Feature spec templates | [templates/specs/](templates/specs/) |
| UI/UX templates | [templates/ui-ux/](templates/ui-ux/) |

---

## Folder Map

```
docs/
├── README.md              ← You are here
├── START.md               ← Onboarding guide
├── assets/                ← Brand images and static assets
├── memory/                ← Durable AI memory (15 files)
├── prd/                   ← Product Requirements
│   └── PRD.md
├── architecture/          ← ADRs + system diagrams
│   ├── decisions/
│   └── diagrams/
├── design/                ← Design philosophy + contracts
├── specs/                 ← Feature specs + SDD artifacts
├── plans/                 ← Phase execution plans
│   ├── 00-define/
│   ├── 01-research/
│   ├── 02-design/
│   ├── 03-content/
│   ├── 04-build/
│   ├── 05-harden/
│   ├── 06-ship/
│   └── gates/
├── reports/               ← CI-generated reports
│   ├── audits/
│   ├── progress/
│   ├── tests/
│   ├── perf/
│   ├── a11y/
│   ├── security/
│   ├── coverage/
│   └── lighthouse/
├── templates/             ← Reusable doc templates
│   ├── ai-client/
│   ├── plan/
│   ├── sdd/
│   ├── specs/
│   └── ui-ux/
└── wiki/                  ← GitHub Wiki source pages
    ├── Home.md
    ├── Architecture.md
    ├── SDD-Pipeline.md
    ├── Agent-Map.md
    ├── Design-System.md
    ├── Commands.md
    ├── Memory-System.md
    ├── Contributing.md
    └── Deployment.md
```

---

## Canonical Path Rules

| What | Canonical Location |
|---|---|
| PRD | `docs/prd/PRD.md` |
| Memory / decisions | `docs/memory/` |
| Phase plans | `docs/plans/` |
| Templates | `docs/templates/` |
| Wiki source | `docs/wiki/` |
| Design profiles | `.cursor/design/<brand>/design.md` |
| Active design contract | `DESIGN.md` (repo root) |
| Agents | `.cursor/agents/` (synced to all clients) |
| Rules | `.cursor/rules/` |

> **Rule:** When in doubt, check `docs/memory/WORKSPACE_INDEX.md` for the capability map, and `docs/memory/MEMORY.md` for the latest decisions.
