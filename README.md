<div align="center">

<br/>

```
███╗   ██╗███████╗███████╗ █████╗ ███╗   ███╗
████╗  ██║██╔════╝╚══███╔╝██╔══██╗████╗ ████║
██╔██╗ ██║█████╗    ███╔╝ ███████║██╔████╔██║
██║╚██╗██║██╔══╝   ███╔╝  ██╔══██║██║╚██╔╝██║
██║ ╚████║███████╗███████╗██║  ██║██║ ╚═╝ ██║
╚═╝  ╚═══╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
```

**AI Workspace Orchestration — Specification-Driven, Swarm-Ready, Multi-Client Synced**

*From `/START` to `/DEPLOY` — every step is traceable, gated, and repeatable.*

<br/>

[![CI](https://img.shields.io/github/actions/workflow/status/iDorgham/Nezam/ci.yml?branch=main&label=CI&logo=github&style=flat-square)](https://github.com/iDorgham/Nezam/actions/workflows/ci.yml)
[![Design Gates](https://img.shields.io/github/actions/workflow/status/iDorgham/Nezam/design-gates.yml?branch=main&label=design%20gates&logo=github&style=flat-square)](https://github.com/iDorgham/Nezam/actions/workflows/design-gates.yml)
[![SemVer](https://img.shields.io/badge/version-0.1.0-555555?style=flat-square)](docs/core/VERSIONING.md)
[![SDD](https://img.shields.io/badge/SDD-spec--driven-1f6feb?style=flat-square)](docs/prd/PRD.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow?style=flat-square)](https://www.conventionalcommits.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-f69220?logo=pnpm&logoColor=fff&style=flat-square)](https://pnpm.io/)
[![Node](https://img.shields.io/badge/Node-20-339933?logo=nodedotjs&logoColor=fff&style=flat-square)](package.json)
[![AI Clients Synced](https://img.shields.io/static/v1?label=AI%20clients&message=8%20synced&color=6e7681&style=flat-square)](docs/memory/MULTI_TOOL_INDEX.md)

<br/>

[![Cursor](https://img.shields.io/static/v1?label=Cursor&message=orchestration&color=141321&logo=cursor&logoColor=fff&style=flat-square)](https://cursor.com/)
[![Claude](https://img.shields.io/static/v1?label=Claude&message=synced&color=cc785c&style=flat-square)](CLAUDE.md)
[![Gemini](https://img.shields.io/static/v1?label=Gemini&message=synced&color=4285f4&style=flat-square)](GEMINI.md)
[![OpenCode](https://img.shields.io/static/v1?label=OpenCode&message=synced&color=24292f&style=flat-square)](.opencode/)
[![Codex](https://img.shields.io/static/v1?label=Codex&message=synced&color=10a37f&style=flat-square)](AGENTS.md)
[![Qwen](https://img.shields.io/static/v1?label=Qwen&message=synced&color=6b21a8&style=flat-square)](QWEN.md)

<br/>

[**Documentation Hub**](docs/README.md) · [**PRD**](docs/prd/PRD.md) · [**Wiki**](docs/wiki/Home.md) · [**Quick Start**](#quick-start) · [**Commands**](docs/wiki/Commands.md) · [**Agents**](docs/wiki/Agent-Map.md)

</div>

---

## What is NEZAM?

**NEZAM is a workspace orchestration kit for AI-native software development.**

It gives every AI assistant a shared contract — a strict delivery spine that goes from idea to production without drift, guesswork, or re-explaining context every session.

Think of it as the **operating system** for your AI development workflow:

| Problem | NEZAM Solution |
|---|---|
| AI skips planning and jumps to code | Hardlock system blocks implementation until spec + design gates pass |
| Decisions don't survive session resets | 4-layer memory system persists all decisions to git |
| Different AI tools disagree or drift | Single canonical source (`.cursor/`) synced to all 8 AI clients |
| No traceability from spec to ship | SDD pipeline with phase gates, task IDs, and CI enforcement |
| Swarm agents have no coordination | `swarm-leader` → `subagent-controller` → 100+ specialized agents |
| Design changes break layout silently | Token-first design contracts + CI gate checks |

---

## Architecture

```
.cursor/            ← CANONICAL SOURCE (never edit synced copies)
  agents/           ← 100+ specialized agent definitions
  commands/         ← Slash command definitions
  skills/           ← 10 domain skill packs
  rules/            ← Governance (hardlock, SDD, design gates)
  design/           ← Brand design profiles

docs/
  memory/           ← Durable AI memory (decisions, context, protocols)
  prd/              ← Product Requirements Document
  architecture/     ← ADRs + system diagrams
  design/           ← Design philosophy + contracts
  specs/            ← Feature specs + SDD artifacts
  plans/            ← Phase execution plans + gate matrix
  reports/          ← CI-generated reports
  templates/        ← Reusable doc templates
  wiki/             ← GitHub Wiki pages

.claude/            ← Claude sync  ┐
.gemini/            ← Gemini sync  │ All derived from .cursor/
.opencode/          ← OpenCode sync│ via: pnpm ai:sync
.codex/             ← Codex sync   ┘
.antigravity/       ← Antigravity sync
.kilocode/          ← Kilocode sync
.qwen/              ← Qwen sync

scripts/            ← Automation (checks, sync, design, release)
.github/workflows/  ← CI/CD gate enforcement
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/iDorgham/Nezam.git && cd Nezam

# 2. Install
pnpm install

# 3. Verify setup
pnpm run check:onboarding
pnpm ai:check

# 4. Open in Cursor and initialize
/START
```

That's it. The `/START` command reads your workspace state and tells you exactly what to do next.

---

## SDD Pipeline

NEZAM enforces a strict phase order. Phases are locked until prerequisites pass.

```
00-define ──► 01-research ──► 02-design ──► 03-content ──► 04-build ──► 05-harden ──► 06-ship
    │               │              │              │             │             │            │
  PRD.md        keywords       DESIGN.md       copy        features       tests       release
  CONTEXT.md    IA plan        tokens          legal        slices         CI          tag
                               (gated)                     (gated)        green
```

**Hardlock:** Implementation is blocked until `DESIGN.md` is approved + `check-design-tokens.sh` passes.

### Phase Commands

| Phase | Command | What It Does |
|---|---|---|
| Initialize | `/START` | Load context, check prerequisites, orient AI |
| Plan | `/PLAN` | Build phase plans, populate TASKS.md files |
| Design | `/START design` | Apply a design profile to `DESIGN.md` |
| Develop | `/DEVELOP` | Start a feature slice (gated) |
| Check | `/CHECK` | Run all workspace readiness checks |
| Fix | `/FIX` | Diagnose and repair issues |
| Audit | `/SCAN` | Full workspace health report |
| Deploy | `/DEPLOY` | Trigger release pipeline |
| Commit | `/GIT` | Conventional commit + PR workflow |

---

## Agent Swarm

100+ specialized agents organized in a lazy-loaded hierarchy.

<details>
<summary><strong>View Swarm Hierarchy</strong></summary>

```
executive-director
└── swarm-leader
    └── deputy-swarm-leader
        └── subagent-controller
            ├── Lead Architects
            │   backend · frontend · mobile · infra · security
            │   database · devops · solution · analytics · AI ethics
            │
            ├── Backend Domain
            │   api-logic · database-design · sql · nosql
            │   data-engineer · pipeline · real-time · vector-store
            │
            ├── Frontend Domain
            │   react-components · design-systems-tokens · ui-components
            │   frontend-performance · motion-3d · prototyping
            │
            ├── Mobile Domain
            │   ios · android · flutter · cross-platform · offline-sync
            │
            ├── Infrastructure & DevOps
            │   docker-k8s · gitops · observability · sre · performance
            │
            ├── Security & Compliance
            │   app-security · auth · infra-security · threat-modeling
            │   encryption · compliance · privacy
            │
            ├── Product & Content
            │   product-manager · content-strategist · cms · seo · aeo
            │
            ├── Quality & Testing
            │   qa-lead · testing · code-review · a11y · rtl
            │
            ├── AI & Ethics
            │   safety · sustainability · bias-fairness · explainability
            │
            └── Arabic / MENA Specialists
                arabic-content · arabic-seo · khaleeji · levantine
                masri · maghrebi · msa-formal
```

Agents are lazy-loaded via `agent-lazy-load.mdc`. See the full [Agent Map](docs/wiki/Agent-Map.md).

</details>

---

## Memory System

4-layer architecture ensuring decisions survive session resets.

<details>
<summary><strong>View Memory Layers</strong></summary>

| Layer | What | Where |
|---|---|---|
| **0** — Session | Ephemeral chat context | Cursor window |
| **1** — Project | Durable decisions + plans | `docs/memory/` |
| **2** — Team | Agent + rule contracts | `.cursor/agents/`, `.cursor/rules/` |
| **3** — Workspace | Root governance | `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` |

**Key memory files:**

| File | Purpose |
|---|---|
| `docs/memory/MEMORY.md` | Stack decisions, ADRs, design locks, scorecards |
| `docs/memory/CONTEXT.md` | Current phase, priorities, blockers |
| `docs/memory/PHASE_HANDOFF.md` | Briefing for next agent/session |
| `docs/memory/DECISIONS.md` | Plain-language decision log |
| `docs/memory/MCP_REGISTRY.md` | MCP tool registry |
| `docs/memory/MULTI_TOOL_INDEX.md` | Cross-tool capability map |

</details>

---

## Design System

Token-first governance. Design gates block development.

<details>
<summary><strong>View Design Governance</strong></summary>

**Apply a design profile:**
```bash
pnpm run design:apply -- minimal
# or: pnpm run design:apply -- brand
```

**Check tokens:**
```bash
pnpm run check:tokens
```

**What gets locked:**
- Color primitives + semantic tokens
- Typography scale (family, size, weight, line-height)
- Spacing grid (base unit + scale)
- Border radius + shadow system
- Motion/animation tokens
- Dark mode parity (required for all tokens)
- RTL layout support

Design profiles live in `.cursor/design/<brand>/design.md`.

</details>

---

## Multi-Client Sync

All 8 AI clients read from the same canonical source.

```bash
# After editing .cursor/ — always sync
pnpm ai:sync

# Verify no drift
pnpm ai:check
```

**Supported Clients:**

| Client | Config File | Sync Folder |
|---|---|---|
| Cursor | `.cursor/` | — (canonical) |
| Claude | `CLAUDE.md` | `.claude/` |
| Gemini | `GEMINI.md` | `.gemini/` |
| OpenCode | — | `.opencode/` |
| Codex | `AGENTS.md` | `.codex/` |
| Qwen | `QWEN.md` | `.qwen/` |
| Antigravity | — | `.antigravity/` |
| Kilocode | — | `.kilocode/` |

> **Rule:** Never edit `.claude/`, `.gemini/`, `.opencode/`, etc. directly. Always edit `.cursor/` and run `pnpm ai:sync`.

---

## Key Scripts

| Script | Purpose |
|---|---|
| `pnpm ai:sync` | Sync `.cursor/` to all AI client folders |
| `pnpm ai:check` | Verify no drift between clients |
| `pnpm run check:onboarding` | Validate workspace setup |
| `pnpm run check:tokens` | Validate design tokens |
| `pnpm run design:apply -- <brand>` | Apply a design profile |
| `pnpm continual-learning:on` | Enable continual-learning mode |

---

## CI/CD

| Workflow | Trigger | What It Checks |
|---|---|---|
| `ci.yml` | Push / PR | Onboarding, AI sync, design tokens, tests |
| `design-gates.yml` | Design changes | Token validity, dark mode parity, RTL coverage |
| `release.yml` | Push to main | Semantic release, CHANGELOG, GitHub Release |

Gate matrix: [`docs/plans/gates/GITHUB_GATE_MATRIX.json`](docs/plans/gates/GITHUB_GATE_MATRIX.json)

---

## MENA / Arabic Language Stack

NEZAM includes dedicated Arabic and MENA-region support:

- **Content agents:** `arabic-content-master`, `arabic-seo-aeo-specialist`
- **Dialect specialists:** Khaleeji, Levantine (Shami), Egyptian (Masri), Maghrebi, MSA Formal
- **RTL design tokens** and layout rules in all design profiles
- **Localization pipeline** via `i18n-engineer` + `localization-lead`
- **MENA payments:** dedicated `mena-payments-specialist` agent

---

## Documentation

| Resource | Path | Description |
|---|---|---|
| Docs Hub | [`docs/README.md`](docs/README.md) | Master documentation index |
| PRD | [`docs/prd/PRD.md`](docs/prd/PRD.md) | Full product requirements |
| Wiki | [`docs/wiki/Home.md`](docs/wiki/Home.md) | Architecture, agents, design, CI |
| Memory | [`docs/memory/`](docs/memory/) | All durable memory files |
| Plans | [`docs/plans/`](docs/plans/) | Phase execution plans |
| Architecture | [`docs/architecture/`](docs/architecture/) | ADRs + diagrams |
| Templates | [`docs/templates/`](docs/templates/) | Reusable doc templates |
| Reports | [`docs/reports/`](docs/reports/) | CI-generated reports |

---

## Troubleshooting

<details>
<summary><strong>AI check fails after editing .cursor/</strong></summary>

```bash
pnpm ai:sync    # Re-sync all clients
pnpm ai:check   # Verify
```
</details>

<details>
<summary><strong>Design gate fails in CI</strong></summary>

```bash
pnpm run design:apply -- minimal   # Re-apply profile
pnpm run check:tokens              # Verify tokens
```
</details>

<details>
<summary><strong>Onboarding check fails</strong></summary>

Check which file is missing. Required files:
- `docs/prd/PRD.md`
- `docs/memory/CONTEXT.md`
- `docs/plans/INDEX.md`
- `.cursor/agents/swarm-leader.md`

Create missing files using templates in `docs/templates/`.
</details>

<details>
<summary><strong>Agent not responding / wrong behavior</strong></summary>

```
/FIX agents
```

Or check `docs/memory/AGENT_COMM_PROTOCOL.md` for inter-agent communication standards.
</details>

---

## Versioning

NEZAM follows [Semantic Versioning](https://semver.org/) with [Conventional Commits](https://www.conventionalcommits.org/).

Current: `v0.1.0` — Workspace Kit baseline

Roadmap in [`docs/prd/PRD.md#release-roadmap`](docs/prd/PRD.md#11-release-roadmap).

---

## License

MIT — see [LICENSE](LICENSE) if present, or fork freely as a template.

---

<div align="center">

Built with discipline. Governed with intent. Shipped with confidence.

**[Start building →](.cursor/commands/start.md)**

</div>
