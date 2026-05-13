<div align="center">

<br/>

```
                                                                     
         ,--.                   ,----,                        ____   
       ,--.'|    ,---,.       .'   .`|  ,---,               ,'  , `. 
   ,--,:  : |  ,'  .' |    .'   .'   ; '  .' \           ,-+-,.' _ | 
,`--.'`|  ' :,---.'   |  ,---, '    .'/  ;    '.      ,-+-. ;   , || 
|   :  :  | ||   |   .'  |   :     ./:  :       \    ,--.'|'   |  ;| 
:   |   \ | ::   :  |-,  ;   | .'  / :  |   /\   \  |   |  ,', |  ': 
|   : '  '; |:   |  ;/|  `---' /  ;  |  :  ' ;.   : |   | /  | |  || 
'   ' ;.    ;|   :   .'    /  ;  /   |  |  ;/  \   \'   | :  | :  |, 
|   | | \   ||   |  |-,   ;  /  /--, '  :  | \  \ ,';   . |  ; |--'  
'   : |  ; .''   :  ;/|  /  /  / .`| |  |  '  '--'  |   : |  | ,     
|   | '`--'  |   |    \./__;       : |  :  :        |   : '  |/      
'   : |      |   :   .'|   :     .'  |  | ,'        ;   | |`-'       
;   |.'      |   | ,'  ;   |  .'     `--''          |   ;/           
'---'        `----'    `---'                        '---'            
                                                                     
```

**The operating system for AI-native software development.**

*One canonical source. Eight clients synced. Zero guesswork.*

<br/>

[![CI](https://img.shields.io/github/actions/workflow/status/iDorgham/Nezam/ci.yml?branch=main&label=CI&logo=github&style=for-the-badge)](https://github.com/iDorgham/Nezam/actions/workflows/ci.yml)
[![Design Gates](https://img.shields.io/github/actions/workflow/status/iDorgham/Nezam/design-gates.yml?branch=main&label=design%20gates&logo=github&style=for-the-badge)](https://github.com/iDorgham/Nezam/actions/workflows/design-gates.yml)
[![SDD](https://img.shields.io/badge/SDD-spec--driven-1f6feb?style=for-the-badge)](.nezam/workspace/prd/PRD.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?logo=conventionalcommits&logoColor=fff&style=for-the-badge)](https://www.conventionalcommits.org/)
[![Version](https://img.shields.io/badge/version-0.1.0-555555?style=for-the-badge)](docs/core/VERSIONING.md)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-f69220?logo=pnpm&logoColor=fff&style=for-the-badge)](https://pnpm.io/)
[![Node](https://img.shields.io/badge/Node-20-339933?logo=nodedotjs&logoColor=fff&style=for-the-badge)](package.json)

<br/>

<sub>AI CLIENTS</sub>

[![Cursor](https://img.shields.io/static/v1?label=Cursor&message=canonical&color=141321&logo=cursor&logoColor=fff&style=flat-square)](https://cursor.com/)
[![Claude](https://img.shields.io/static/v1?label=Claude&message=synced&color=cc785c&style=flat-square)](CLAUDE.md)
[![Gemini](https://img.shields.io/static/v1?label=Gemini&message=synced&color=4285f4&style=flat-square)](GEMINI.md)
[![OpenCode](https://img.shields.io/static/v1?label=OpenCode&message=synced&color=24292f&style=flat-square)](.opencode/)
[![Codex](https://img.shields.io/static/v1?label=Codex&message=synced&color=10a37f&style=flat-square)](AGENTS.md)
[![Qwen](https://img.shields.io/static/v1?label=Qwen&message=synced&color=6b21a8&style=flat-square)](QWEN.md)
[![Antigravity](https://img.shields.io/static/v1?label=Antigravity&message=synced&color=336699&style=flat-square)](.antigravity/)
[![Kilocode](https://img.shields.io/static/v1?label=Kilocode&message=synced&color=e06c75&style=flat-square)](.kilocode/)

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<br/>

[**Docs**](docs/README.md) · [**PRD**](.nezam/workspace/prd/PRD.md) · [**Quick Start**](#quick-start) · [**Commands**](docs/wiki/Commands.md) · [**Agents**](docs/wiki/Agent-Map.md) · [**Wiki**](https://github.com/iDorgham/Nezam/wiki)

</div>

---

## What is NEZAM?

NEZAM is a workspace orchestration kit that gives every AI assistant a shared contract — a strict, specification-driven delivery spine that carries your project from idea to production without drift, hallucination, or lost context between sessions.

Every phase is gated. Every decision is persisted. Every AI client reads from the same source of truth.

| Without NEZAM | With NEZAM |
|---|---|
| AI skips planning and jumps straight to code | Phase gates block implementation until spec and design are approved |
| Context vanishes on session reset | 4-layer memory system persists all decisions to git |
| Different AI tools disagree and drift | Single canonical source (`.cursor/`) synced to 8 clients via `pnpm ai:sync` |
| No traceability from spec to production | SDD pipeline with phase IDs, task gates, and CI enforcement |
| Swarm agents have no coordination layer | `swarm-leader` → `subagent-controller` → 150+ specialized agents |
| Design changes silently break layout | Token-first design contracts with CI gate enforcement |

---

## How It Works

NEZAM enforces a seven-phase **Specification-Driven Development (SDD)** pipeline. Phases are hardlocked — implementation cannot begin until upstream gates pass. This prevents AI agents from hallucinating scope or skipping foundational decisions.

**Pipeline overview:**

```
[00 Define] → [01 Research] → [02 Design 🔒] → [03 Content] → [04 Build 🔒] → [05 Harden] → [06 Ship]
```

> **🔒 Gated phases** require automated checks to pass before the next phase unlocks.
> Design (02) requires `DESIGN.md` approval + `check-design-tokens.sh`.
> Build (04) requires approved feature specs + CI green.

### Slash Commands

Every phase has a command. Type it in any synced AI client to orient the agent and load the correct context.

| Command | Phase | What it does |
|---|---|---|
| `/START` | Initialize | Load workspace state, check prerequisites, orient the AI |
| `/PLAN` | Plan | Build phase plans, populate `TASKS.md` files |
| `/START design` | Design | Apply a design profile to `DESIGN.md` |
| `/DEVELOP` | Build | Start a gated feature slice |
| `/CHECK` | Any | Run all workspace readiness checks |
| `/FIX` | Any | Diagnose and repair workspace issues |
| `/SCAN` | Any | Full workspace health report |
| `/GIT` | Any | Conventional commit + PR workflow |
| `/DEPLOY` | Ship | Trigger the release pipeline |

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

# 4. Open in Cursor and start
/START
```

`/START` reads your workspace state and tells you exactly what to do next — no manual orientation required.

---

## Architecture

**Sync model:** `.cursor/` is the single canonical source. `pnpm ai:sync` propagates every change to all 8 AI clients with zero drift.

```
.cursor/  (canonical)
  └─ pnpm ai:sync ──→  CLAUDE.md / .claude/
                   ──→  GEMINI.md / .gemini/
                   ──→  .opencode/
                   ──→  AGENTS.md / .codex/
                   ──→  QWEN.md / .qwen/
                   ──→  .antigravity/
                   ──→  .kilocode/
```

> **Rule:** Never edit synced folders directly. Always edit `.cursor/` and run `pnpm ai:sync` to propagate with zero drift.

**Directory overview:**

```
.cursor/            ← Canonical source (agents, commands, skills, rules, design)
.nezam/             ← Workspace state (memory, specs, scripts, evals, gates)
docs/               ← Reports, plans, architecture, wiki pages
.github/workflows/  ← CI/CD gate enforcement
```

---

## Agent Swarm

150+ specialized agents organized in a lazy-loaded hierarchy. The orchestration layer routes tasks to the right specialist automatically — no manual agent selection required.

<details>
<summary><strong>View swarm hierarchy</strong></summary>

```
executive-director
  └─ swarm-leader
       └─ deputy-swarm-leader
            └─ subagent-controller
                 ├─ Lead Architects   (backend · frontend · mobile · infra · security · analytics)
                 ├─ Backend           (api-logic · database · sql · nosql · pipeline · real-time)
                 ├─ Frontend          (react · design-systems · performance · motion)
                 ├─ Mobile            (ios · flutter · cross-platform)
                 ├─ Infra & DevOps    (docker-k8s · gitops · sre)
                 ├─ Security          (auth · encryption · compliance)
                 ├─ Product & Content (cms · seo · aeo · crm)
                 ├─ Quality           (qa-lead · testing · a11y · rtl)
                 └─ Arabic / MENA     (khaleeji · levantine · masri · maghrebi · msa-formal)
```

</details>

Agents are lazy-loaded via `agent-lazy-load.mdc`. Full details in the [Agent Map](docs/wiki/Agent-Map.md).

---

## Multi-Client Sync

All 8 AI clients derive their configuration from `.cursor/`. One sync command, no drift.

```bash
pnpm ai:sync    # Propagate .cursor/ changes to all clients
pnpm ai:status  # Show sync status per client
pnpm ai:check   # Verify no drift between clients
```

| Client | Entry Point | Sync Folder |
|---|---|---|
| **Cursor** | `.cursor/` | — (canonical, never synced) |
| **Claude** | `CLAUDE.md` | `.claude/` |
| **Gemini** | `GEMINI.md` | `.gemini/` |
| **OpenCode** | — | `.opencode/` |
| **Codex** | `AGENTS.md` | `.codex/` |
| **Qwen** | `QWEN.md` | `.qwen/` |
| **Antigravity** | — | `.antigravity/` |
| **Kilocode** | — | `.kilocode/` |

---

## Memory System

Decisions survive session resets through a four-layer persistence architecture.

<details>
<summary><strong>View memory layers</strong></summary>

| Layer | Scope | Location |
|---|---|---|
| **0 — Session** | Ephemeral chat context | Active AI window |
| **1 — Project** | Durable decisions + plans | `.nezam/memory/` |
| **2 — Team** | Agent + rule contracts | `.cursor/agents/`, `.cursor/rules/` |
| **3 — Workspace** | Root governance | `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` |

**Key memory files:**

| File | Purpose |
|---|---|
| `.nezam/memory/MEMORY.md` | Stack decisions, ADRs, design locks, scorecards |
| `docs/memory/CONTEXT.md` | Current phase, priorities, blockers |
| `docs/memory/PHASE_HANDOFF.md` | Briefing for the next agent or session |
| `docs/memory/DECISIONS.md` | Plain-language decision log |
| `docs/memory/MCP_REGISTRY.md` | MCP tool registry |
| `.nezam/memory/MULTI_TOOL_INDEX.md` | Cross-tool capability map |

</details>

---

## Design System

Token-first governance. Design gates block development until tokens are approved and validated.

<details>
<summary><strong>View design governance</strong></summary>

```bash
# Apply a design profile
pnpm run design:apply -- minimal
pnpm run design:apply -- brand

# Validate tokens
pnpm run check:tokens
```

**What gets locked and enforced:**

- Color primitives + semantic tokens
- Typography scale (family, size, weight, line-height)
- Spacing grid (base unit + scale)
- Border radius + shadow system
- Motion and animation tokens
- Dark mode parity (required for all tokens)
- RTL layout support

Design profiles live in `.cursor/design/<brand>/design.md`.

</details>

---

## CI/CD Gates

| Workflow | Trigger | Checks |
|---|---|---|
| `ci.yml` | Push / PR | Onboarding, AI sync drift, design tokens, tests |
| `design-gates.yml` | Design file changes | Token validity, dark mode parity, RTL coverage |
| `release.yml` | Push to `main` | Semantic release, CHANGELOG, GitHub Release |

Gate matrix: [`docs/plans/gates/GITHUB_GATE_MATRIX.json`](docs/plans/gates/GITHUB_GATE_MATRIX.json)

---

## MENA / Arabic Stack

NEZAM ships with dedicated Arabic language and MENA-region support built into the agent layer.

- **Content agents:** `arabic-content-master`, `arabic-seo-aeo-specialist`
- **Dialect specialists:** Khaleeji, Levantine (Shami), Egyptian (Masri), Maghrebi, MSA Formal
- **RTL design tokens** and layout rules in all design profiles
- **Localization pipeline** via `i18n-engineer` + `localization-lead`
- **MENA payments:** dedicated `mena-payments-specialist` agent

---

## Key Scripts

| Script | Purpose |
|---|---|
| `pnpm ai:sync` | Sync `.cursor/` to all AI client folders |
| `pnpm ai:status` | Show per-client sync status |
| `pnpm ai:check` | Verify no drift between clients |
| `pnpm run check:onboarding` | Validate workspace setup |
| `pnpm run check:tokens` | Validate design tokens |
| `pnpm run check:specs` | Validate spec version consistency |
| `pnpm run check:agent-bus` | Check agent bus configuration |
| `pnpm run check:all` | Run every check in sequence |
| `pnpm run design:apply -- <brand>` | Apply a design profile |
| `pnpm run skills:registry` | Regenerate skills registry |
| `pnpm run skills:normalize` | Normalize skill IDs |
| `pnpm run report:swarm-cost` | Generate swarm cost report |
| `pnpm run prd:roadmap` | Refresh release roadmap from JSON |
| `pnpm continual-learning:on` | Enable continual-learning mode |
| `pnpm continual-learning:prepare` | Prepare continual-learning index |
| `pnpm continual-learning:benchmark` | Run continual-learning benchmark |

---

## Documentation

| Resource | Path | Description |
|---|---|---|
| Docs Hub | [`docs/README.md`](docs/README.md) | Master documentation index |
| PRD | [`.nezam/workspace/prd/PRD.md`](.nezam/workspace/prd/PRD.md) | Full product requirements |
| Wiki | [`docs/wiki/Home.md`](docs/wiki/Home.md) | Architecture, agents, design, CI |
| Memory | [`.nezam/memory/`](.nezam/memory/) | All durable memory files |
| Plans | [`docs/plans/`](docs/plans/) | Phase execution plans |
| Architecture | [`.nezam/workspace/architecture/`](.nezam/workspace/architecture/) | ADRs + system diagrams |
| Templates | [`.nezam/templates/`](.nezam/templates/) | Reusable doc templates |
| Reports | [`docs/reports/`](docs/reports/) | CI-generated reports |

---

## Troubleshooting

<details>
<summary><strong>AI check fails after editing <code>.cursor/</code></strong></summary>

```bash
pnpm ai:sync    # Re-sync all clients
pnpm ai:check   # Verify no drift remains
```
</details>

<details>
<summary><strong>Design gate fails in CI</strong></summary>

```bash
pnpm run design:apply -- minimal   # Re-apply the profile
pnpm run check:tokens              # Validate tokens locally
```
</details>

<details>
<summary><strong>Onboarding check fails</strong></summary>

Check which required file is missing:

- `.nezam/workspace/prd/PRD.md`
- `docs/memory/CONTEXT.md`
- `docs/plans/INDEX.md`
- `.cursor/agents/swarm-leader.md`

Create missing files from templates in `.nezam/templates/`.
</details>

<details>
<summary><strong>Agent not responding or behaving incorrectly</strong></summary>

```
/FIX agents
```

Or review `docs/memory/AGENT_COMM_PROTOCOL.md` for inter-agent communication standards.
</details>

<details>
<summary><strong>Spec version drift detected</strong></summary>

```bash
pnpm run check:specs   # Show which specs are out of sync
pnpm ai:sync           # Re-sync if agents were edited
```
</details>

---

## Versioning

NEZAM follows [Semantic Versioning](https://semver.org/) with [Conventional Commits](https://www.conventionalcommits.org/).
Current: `v0.1.0` — Workspace Kit baseline.

Roadmap is maintained in [`.nezam/workspace/prd/release-roadmap.json`](.nezam/workspace/prd/release-roadmap.json) — edit milestones there, then run `pnpm prd:roadmap` to refresh the rendered table in the PRD.

---

## License

MIT — see [LICENSE](LICENSE), or fork freely as a template.

---

<div align="center">

Built with discipline. Governed with intent. Shipped with confidence.

**[Start building →](.cursor/commands/start.md)**

</div>
