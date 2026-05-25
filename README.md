<div align="center">

<br/>

**The operating system for AI-native software development.**

*One canonical source. Eight clients synced. Zero guesswork.*

<br/>

[![CI](https://img.shields.io/github/actions/workflow/status/iDorgham/Nezam/ci.yml?branch=main&label=CI&logo=github&style=for-the-badge)](https://github.com/iDorgham/Nezam/actions/workflows/ci.yml)
[![Design Gates](https://img.shields.io/github/actions/workflow/status/iDorgham/Nezam/design-gates.yml?branch=main&label=design%20gates&logo=github&style=for-the-badge)](https://github.com/iDorgham/Nezam/actions/workflows/design-gates.yml)
[![Wireframe Lock](https://img.shields.io/github/actions/workflow/status/iDorgham/Nezam/wireframe-validation.yml?branch=main&label=wireframe%20lock&logo=github&style=for-the-badge)](https://github.com/iDorgham/Nezam/actions/workflows/wireframe-validation.yml)
[![DH](https://img.shields.io/badge/Design%20Hub-.nezam%2Fdesign--hub-1f6feb?style=for-the-badge)](.nezam/design-hub/)
[![SDD](https://img.shields.io/badge/SDD-spec--driven-1f6feb?style=for-the-badge)](.nezam/core/prd/PRD.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?logo=conventionalcommits&logoColor=fff&style=for-the-badge)](https://www.conventionalcommits.org/)
[![Version](https://img.shields.io/badge/version-0.1.0-555555?style=for-the-badge)](.nezam/core/specs/VERSIONING.md)
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

[**Docs**](.nezam/core/wiki/README.md) · [**PRD**](.nezam/core/prd/PRD.md) · [**Quick Start**](#quick-start) · [**Commands**](.nezam/core/wiki/Commands.md) · [**Agents**](.nezam/core/wiki/Agent-Map.md) · [**Wiki**](https://github.com/iDorgham/Nezam/wiki)

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
> Design (02) requires `DESIGN.md` approval + `check-design-tokens.sh` + **design-hub wireframe lock** (`wireframes_locked.json`).
> Build (04) requires approved feature specs + CI green.

### Slash Commands

Every phase has a command. Type it in any synced AI client to orient the agent and load the correct context.

| Command | Phase | What it does |
|---|---|---|
| `/START` | Initialize | Load workspace state, check prerequisites, orient the AI |
| `/PLAN` | Plan | Build phase plans, populate `TASKS.md` files |
| `/START design` | Design | Launch the Design Hub (port 4000) to configure tokens, sitemap, wireframes |
| `/DESIGN` | Design | Open the Design Hub dashboard for wireframing and design lock |
| `/DEVELOP` | Build | Start a gated feature slice |
| `/CHECK` | Any | Run all workspace readiness checks |
| `/FIX` | Any | Diagnose and repair workspace issues |
| `/SCAN` | Any | Full workspace health report |
| `/GIT` | Any | Conventional commit + PR workflow |
| `/DEPLOY` | Ship | Trigger the release pipeline |

---

## 🚀 Getting Started Flow

Follow this premium 5-step pipeline to initialize NEZAM, satisfy all hardlock phase gates, and unlock development execution:

```mermaid
flowchart LR
    A["1. Init Workspace"] --> B["2. Launch Design Hub"]
    B --> C["3. Run /START"]
    C --> D["4. Execute /PLAN"]
    D --> E["5. Verify via /SCAN"]
end
```

### 1. Initialize Workspace
Clone the repository, install dependencies, and run onboarding diagnostics:
```bash
# Clone the repository
git clone https://github.com/iDorgham/Nezam.git && cd Nezam

# Install pnpm workspace packages and hooks
pnpm install
pnpm run hooks:install
```

### 2. Launch the Design Hub Studio
Start the Next.js 15 Design Hub on `http://localhost:4000` to configure sitemaps, styling tokens, and layout wireframes:
```bash
# Boot the local design development environment
pnpm run design-hub
```

### 3. Run Session Onboarding (`/START`)
Boot your synced AI assistant (Cursor, Claude Code, Antigravity, or Gemini CLI) and run the onboarding router command:
```bash
/START
```
> **What happens?** The Swarm Leader reads `.cursor/state/onboarding.yaml`, initializes your build tone, and unlocks the strategic PRD and root `DESIGN.md` phase specs.

### 4. Scaffold the Project Specs (`/PLAN`)
Establish the foundational specification-driven architecture:
```bash
# Scaffold target phase specs (SEO, Architecture, APIs, etc.)
/PLAN all
```
> **What happens?** The AI automatically populates your `.nezam/core/plans/` phase maps, establishes the tasks backlog, and unlocks downstream gate checkers.

### 5. Run Verification & Diagnostics (`/SCAN`)
Perform structural diagnostics to confirm link integrity and swarm cost allocation:
```bash
# Verify link health and project score
/SCAN content

# View dense TUI metrics overview
pnpm run check:all
node scripts/ui/health-dashboard.js
```

---

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
.cursor/                ← Canonical source (agents, commands, skills, rules, design)
.nezam/                 ← Workspace state (memory, specs, scripts, evals, gates)
.nezam/design-hub/      ← Local design decision engine (Next.js 15, port 4000)
.nezam/design/          ← 100+ design profiles by brand
docs/                   ← Reports, plans, architecture, wiki pages
.github/workflows/      ← CI/CD gate enforcement
```

---

## Agent Swarm

NEZAM's intelligence spine is powered by a hierarchical swarm of **150+ specialized AI agents** organized in a multi-tiered, lazy-loaded orchestration model. Instead of overloaded context windows, only the exact agents needed for the current pipeline phase or technical domain are dynamically loaded into memory.

### Orchestration & Routing
Tasks are dispatched through a unified routing bus:
```
executive-director (Strategic Alignment)
  └─ swarm-leader (Orchestrator General & Conflict Resolver)
       └─ deputy-swarm-leader (Parallel Stream & Context Coordinator)
            └─ subagent-controller (Task Execution Supervisor)
                 ├─ Lead Architects (Guardrail & Domain Governance)
                 ├─ Specialists (Focus-domain Code & Schema Generation)
                 └─ Support Agents (CI, Localization, Doc Hygiene, Analytics)
```

### Agent Tiers
1. **Tier 1 — Lead Architects (Governance)**: Enforce design contracts, verify architecture decisions, and audit security (e.g., `lead-backend-architect`, `lead-frontend-architect`, `lead-security-officer`, `lead-ai-ethics-officer`).
2. **Tier 2 — Domain Specialists (Implementation)**: Highly technical code, database, and logic specialists (e.g., `react-component-lead`, `api-logic-manager`, `sql-expert`, `docker-k8s-specialist`).
3. **Tier 3 — Support & Dialects (Assistance & Context)**: Task automation, analytics, localization, and MENA dialect engines (e.g., `i18n-engineer`, `client-onboarding-agent`, `masri-content-specialist`, `khaleeji-specialist`).

<details>
<summary><strong>🔍 Click to browse the Swarm Directory</strong></summary>

| Domain | Key Specialized Agents | Focus Area |
|---|---|---|
| **Orchestration** | `swarm-leader` · `deputy-swarm-leader` · `subagent-controller` | Swarm routing, conflict resolution, parallel streams |
| **Architects** | `lead-backend-architect` · `lead-frontend-architect` · `lead-security-officer` | Cross-domain standards, structural sanity, gate review |
| **Backend** | `backend-lead` · `api-logic-manager` · `database-design-manager` · `sql-expert` | Next.js API, REST/GraphQL logic, Drizzle schemas, Neon DB |
| **Frontend** | `frontend-lead` · `react-server-components-expert` · `design-systems-token-architect` | React 19, CSS custom properties, responsive systems, animations |
| **Mobile** | `lead-mobile-architect` · `ios-engineer` · `flutter-specialist` | Native Swift, Flutter cross-platform, push notifications |
| **Infra & DevOps**| `infrastructure-manager` · `devops-manager` · `docker-k8s-specialist` · `sre-incident` | Docker, Kubernetes, GitHub Actions, observability, CDN |
| **Security** | `auth-security-manager` · `encryption-privacy-specialist` · `compliance-manager` | Clerk auth, JWT, encryption-at-rest, HIPAA/GDPR readiness |
| **Product** | `product-officer` · `business-analyst` · `content-workflow-manager` · `seo-specialist` | Sitemap routing, PRD mapping, headless CMS, AEO optimizations |
| **Quality** | `qa-test-lead` · `testing-manager` · `a11y-performance-auditor` · `rtl-specialist` | Jest/Cypress, keyboard access, color contrast, RTL layout locks |
| **MENA / Arabic**| `arabic-content-master` · `masri-content-specialist` · `khaleeji-specialist` | Egyptian (Masri) dialect, Gulf/Levant localization, Arabic SEO |

</details>

> 💡 **Lazy Loading Mechanism**: Guided by `.cursor/rules/agent-lazy-load.mdc`, the client reads agent definitions from `.cursor/agents/` on-demand based on prompt context, preventing token bloat and focusing LLM attention.

Full details are maintained in the [Agent Map](.nezam/core/wiki/Agent-Map.md).

---

## Skills & Tech Stack

NEZAM features **84+ active modular skills** categorized across 9 core architectural vectors. Each skill is defined as a standalone, self-documenting package under `.cursor/skills/` with strict input/output rules, step-by-step procedures, validation suites, and anti-patterns.

### Skill Categories

| Category | Purpose | Key Skills |
|---|---|---|
| **System** | Workspace governance and memory | `context-window-manager` · `workspace-gating` · `cli-orchestration` |
| **Research** | Analysis and SEO/AEO models | `competitive-analysis` · `seo-auditing` · `audience-mapping` |
| **Design** | Tokens and visual styling | `design-tokens` · `typography-studio` · `motion-design` |
| **Content** | Editorial and regional adapters | `content-modeling` · `arabic-copywriting` · `dialect-adaptation` |
| **Frontend** | Modern component architecture | `react-19` · `next-19-routing` · `responsive-containers` |
| **Backend** | Modern server/DB stack (v2) | `drizzle-orm` · `neon-postgres` · `background-jobs` · `vercel-ai-sdk` |
| **Infra** | Deployment, performance, & telemetry | `github-actions-ci` · `llm-observability` · `product-analytics` |
| **Quality** | Security, performance, & audits | `security-vulnerability-scan` · `a11y-screen-readers` · `lhci-audit` |
| **External** | Workspace Git & API integrations | `conventional-commits` · `openrouter-bus` · `slack-reporting` |

### 🚀 Modern Tech Stack (v2 Additions)
NEZAM's backend and logic layers are pre-configured with industry-leading modern tooling:
- **Drizzle ORM** (`backend/drizzle-orm`): Type-safe schema definition and high-performance SQL generation.
- **Neon Postgres** (`backend/neon-postgres`): Serverless Postgres integration with instant branching and scaling.
- **Background Jobs** (`backend/background-jobs`): Structured, queue-based background processing.
- **Vercel AI SDK** (`backend/vercel-ai-sdk`): Unified multi-model streaming interface with tool-calling capabilities.
- **Clerk Auth** (`backend/clerk-auth`): Premium user authentication and session management gates.
- **Resend Email** (`backend/resend-email`): Transactional email pipelines with React Email components.
- **Typesense Search** (`backend/typesense-search`): Instant typo-tolerant search and indexing.
- **OpenRouter API** (`backend/openrouter`): Resilient LLM fallback orchestration layer.
- **LLM Observability** (`infrastructure/llm-observability`): OpenTelemetry traces for LLM latency, cost, and tokens.

### Skill Management
To keep the AI swarm fully aligned, skills are registered in a machine-readable directory map:
```bash
# Add a new skill (creates folder with standard SKILL.md template)
/CREATE skill

# Normalize all skill IDs across folders
pnpm run skills:normalize

# Regenerate the canonical skills registry index
pnpm run skills:registry
```

---

## Multi-Client Sync

All 8 AI clients derive their configuration from the canonical `.cursor/` repository folder. A unified sync engine guarantees zero configuration drift or prompt divergence across IDEs and terminals.

```bash
pnpm ai:sync    # Propagate canonical .cursor/ config to all client mirrors
pnpm ai:status  # Display current sync status per client
pnpm ai:check   # Run drift-detection checks on rules, skills, and agents
```

| Client | Entry Point | Sync Folder | Design-Hub Control |
|---|---|---|---|
| **Cursor** | `.cursor/` | *(Canonical — never written over)* | Supported (4 agents) |
| **Claude** | `CLAUDE.md` | `.claude/` | Supported (4 agents) |
| **Gemini** | `GEMINI.md` | `.gemini/` | Supported (4 agents) |
| **OpenCode** | — | `.opencode/` | Supported (4 agents) |
| **Codex** | `AGENTS.md` | `.codex/` | Supported (4 agents) |
| **Qwen** | `QWEN.md` | `.qwen/` | Supported (4 agents) |
| **Antigravity** | — | `.antigravity/` | Supported (4 agents) |
| **Kilocode** | — | `.kilocode/` | Supported (4 agents) |

---

## Memory System

Decisions, ADRs, scorecards, and session context survive resets through a robust **four-layer persistence architecture**, ensuring every agent picks up exactly where the last one left off.

<details>
<summary><strong>🧠 View memory layers & schemas</strong></summary>

| Layer | Scope | Lifetime | Storage Location |
|---|---|---|---|
| **Layer 0 — Session** | Ephemeral context | Active chat session | LLM system instructions / active window |
| **Layer 1 — Project** | Dynamic tracking | Phase-to-phase | `.nezam/core/memory/` & `.nezam/core/context/` |
| **Layer 2 — Team** | System constraints | Long-term evolution | `.cursor/agents/` & `.cursor/rules/` |
| **Layer 3 — Workspace**| Root contract | Immutable baseline | Root Markdown files (`CLAUDE.md`, `GEMINI.md`) |

#### Active Memory Indexes:
* **Current Priorities**: [`.nezam/core/memory/CONTEXT.md`](.nezam/core/memory/CONTEXT.md) – Tracks active phase, milestones, and blockers.
* **Persistent Decision Log**: [`.nezam/core/memory/DECISIONS.md`](.nezam/core/memory/DECISIONS.md) – Plain-language audit of all design, database, and logic choices.
* **Handoff Briefing**: [`.nezam/core/memory/PHASE_HANDOFF.md`](.nezam/core/memory/PHASE_HANDOFF.md) – Automated transfer brief for subsequent agent loops.
* **System Scorecard**: [`.nezam/core/memory/MEMORY.md`](.nezam/core/memory/MEMORY.md) – Technical decisions, ADR hashes, and gate results.
* **Cross-Tool Capability Map**: [`.nezam/core/memory/MULTI_TOOL_INDEX.md`](.nezam/core/memory/MULTI_TOOL_INDEX.md) – Synchronized index of tool functions across clients.

</details>

---

## Design Hub & System

Token-first design governance backed by a **human-in-the-loop Design Hub** — a local Next.js 15 application (`.nezam/design-hub/`) running on port 4000. The hub sits between planning (PRD) and implementation, forcing the design contract to be visually verified and locked before any frontend code can be written.

### The Design Contract
The Design Hub outputs two highly structured, machine-readable contracts that gate the `/DEVELOP` build command:
1. **`DESIGN.md` (root)**: The complete styling contract — color primitives, typography scale, responsive breakpoints, borders, and motion custom properties.
2. **`wireframes_locked.json`**: Schema-validated layout contract specifying the exact order and type of visual sections per page.

### 5 Core Hub Modules
1. **Sitemap Builder (v2 Premium Upgraded)**: Featuring an enterprise-ready **5-Level Hierarchy** (`App` → `NavMenu` → `Page` → `Sub-page` → `Section`) with a vertical app canvas layout to prevent overlap. Integrates node-specific url routing, notes, and rich color-coded **Microservices & API Bindings** (`ServiceKind`). It draws active visual SVG connection lines (`ConnectionWires`) between pages and services, backed by an **Infrastructure Panel** (`InfraPanel`) for Git, Database, and Cloud integrations.
2. **Wireframe Editor**: Interactive block layout canvas (Hero, CTA, Cards, Features) per page.
3. **Theme & Design System Studio (v2 Premium Upgraded)**: Expanded into two highly customisable panels — `ThemePanel` (active custom styling, real-time Light/Dark mode token preview, shape presets) and `DesignSystemPanel` (custom CSS property mappings, responsive grid structures, typography hierarchy scales, fluid typography scales, and spacing multipliers).
4. **Profile Browser**: Browse and apply **100+ beautifully curated brand profiles** from `.nezam/design/` (e.g., *Stripe*, *Linear*, *Vercel*, *Bento*).
5. **Multi-Format Export Hub (v2 Premium New)**: Integrates an interactive `ExportModal` supporting live markdown/text previews and one-click copy/download of **12 distinct export formats** (including JSON v3 Schema, Folder Structure, URL Structure, Nav Menus, App Pages, RBAC Matrix, Roles & Permissions, Next.js Router, Routes list, Services List, Mermaid diagrams, and Full Context briefing).

<details>
<summary><strong>🎨 View Design Hub commands & agents</strong></summary>

```bash
# Install Design Hub dependencies
pnpm design-hub:install

# Launch the visual design engine (opens http://localhost:4000)
pnpm design-hub

# Build Design Hub for production deployment
pnpm design-hub:build

# Apply a pre-made design profile via CLI (fallback)
pnpm run design:apply -- linear-app
pnpm run design:apply -- minimal
```

#### Dedicated Design Swarm Agents
Four specialized visual agents operate and synchronize the design workspace:
* **`design-hub-specialist`**: Coordinates profile loading, custom templates, and lock file compilation.
* **`design-hub-wireframe`**: Validates the block schemas inside `wireframes_locked.json`.
* **`design-hub-tokens`**: Audits color contrast, dark mode parity, and custom properties.
* **`design-hub-sitemap`**: Translates sitemap trees to application route indexes.

#### Validation & Gate Enforcement
Any design modification triggers local gates:
- **`pnpm run check:tokens`**: Checks for hardcoded style primitives and enforces `--ds-*` variable usage.
- **`pnpm run check:all`**: Validates schema compliance, dark mode parity, and RTL support.

</details>

---

## CI/CD Gates

| Workflow | Trigger | Checks |
|---|---|---|
| `ci.yml` | Push / PR | Onboarding, AI sync drift, design tokens, design-hub build + wireframe lock validation, tests |
| `design-gates.yml` | Design file changes | Token validity (Gate 1), design-hub wireframe lock schema (Gate 4), dark mode parity, RTL coverage |
| `wireframe-validation.yml` | Design/plan changes | ASCII wireframe catalog validation, RTL parity, interaction specs |
| `release.yml` | Push to `main` | Semantic release, CHANGELOG, GitHub Release |

Gate matrix: [`.nezam/core/gates/GITHUB_GATE_MATRIX.json`](.nezam/core/gates/GITHUB_GATE_MATRIX.json)

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
| `pnpm design-hub` | Start the design hub (port 4000) |
| `pnpm design-hub:build` | Build the design hub for production |
| `pnpm design-hub:install` | Install design hub dependencies |
| `pnpm run design:apply -- <brand>` | Apply a design profile (CLI fallback) |
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
| Docs Hub | [`.nezam/core/wiki/README.md`](.nezam/core/wiki/README.md) | Master documentation index |
| PRD | [`.nezam/core/prd/PRD.md`](.nezam/core/prd/PRD.md) | Full product requirements |
| Wiki | [`.nezam/core/wiki/Home.md`](.nezam/core/wiki/Home.md) | Architecture, agents, design, CI |
| Memory | [`.nezam/core/memory/`](.nezam/core/memory/) | All durable memory files |
| Plans | [`.nezam/core/plans/`](.nezam/core/plans/) | Phase execution plans |
| Architecture | [`.nezam/core/architecture/`](.nezam/core/architecture/) | ADRs + system diagrams |
| Templates | [`.nezam/templates/`](.nezam/templates/) | Reusable doc templates |
| Reports | [`.nezam/core/reports/`](.nezam/core/reports/) | CI-generated reports |
| **Design Hub Docs** | [`.nezam/core/docs/design-hub.md`](.nezam/core/docs/design-hub.md) | Design Hub overview, modules, API |
| Design Hub Audit | [`.nezam/core/docs/design-hub-audit.md`](.nezam/core/docs/design-hub-audit.md) | Full Design Hub source audit + improvement plan |

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

- `.nezam/core/gates/GITHUB_GATE_MATRIX.json`
- `.nezam/core/specs/VERSIONING.md`
- `.nezam/core/plans/INDEX.md`
- `.cursor/agents/swarm-leader.md`

Create missing files from templates in `.nezam/templates/` or initialize via `/START`.
</details>

<details>
<summary><strong>Agent not responding or behaving incorrectly</strong></summary>

```
/FIX agents
```

Or review `.nezam/core/memory/AGENT_COMM_PROTOCOL.md` for inter-agent communication standards.
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

Roadmap is maintained in [`.nezam/core/prd/release-roadmap.json`](.nezam/core/prd/release-roadmap.json) — edit milestones there, then run `pnpm prd:roadmap` to refresh the rendered table in the PRD.

---

## License

MIT — see [LICENSE](LICENSE), or fork freely as a template.

---

<div align="center">

Built with discipline. Governed with intent. Shipped with confidence.

**[Start building →](.cursor/commands/start.md)**

</div>
