<div align="center">

# NEZAM

**NEZAM is an essential orchestration layer for AI developers who want reliable, shippable output instead of chat-only progress.** It gives your agent workflow a strict delivery spine — planning, specs, design gates, implementation, and verification — so every step is traceable, repeatable, and production-ready. **If you build with AI in Cursor, this is the toolkit that keeps your project aligned, synced, and moving toward release.**


> **`/command` do everything.**

<p align="center"><em>Workspace orchestration kit — Cursor-first, multi-client synced.</em></p>

<p align="center">
  <a href="https://github.com/iDorgham/Nezam/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/iDorgham/Nezam/ci.yml?branch=main&amp;label=CI&amp;logo=github&amp;style=flat" alt="CI workflow status" /></a>
  &nbsp;
  <a href="https://github.com/iDorgham/Nezam/actions/workflows/design-gates.yml"><img src="https://img.shields.io/github/actions/workflow/status/iDorgham/Nezam/design-gates.yml?branch=main&amp;label=design%20gates&amp;logo=github&amp;style=flat" alt="Design gates workflow status" /></a>
</p>

<p align="center">
  <a href="https://github.com/iDorgham/Nezam#specification-driven-development-sdd"><img src="https://img.shields.io/badge/SDD-spec--driven-1f6feb?style=flat" alt="Specification-driven development" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/docs/core/VERSIONING.md"><img src="https://img.shields.io/badge/SemVer-0.1.0-555555?style=flat" alt="Semantic versioning" /></a>
  <a href="https://www.conventionalcommits.org/"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow?style=flat" alt="Conventional Commits" /></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-workspace-f69220?logo=pnpm&amp;logoColor=fff&amp;style=flat" alt="pnpm workspace" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/.github/workflows/design-gates.yml"><img src="https://img.shields.io/badge/Node-20-339933?logo=nodedotjs&amp;logoColor=fff&amp;style=flat" alt="Node.js 20" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/docs/workspace/context/MULTI_TOOL_INDEX.md"><img src="https://img.shields.io/static/v1?label=AI%20clients&amp;message=synced&amp;color=6e7681&amp;style=flat" alt="Multi-client AI sync" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/package.json"><img src="https://img.shields.io/static/v1?label=scripts&amp;message=ai%3Async%20%C2%B7%20ai%3Acheck&amp;color=24292f&amp;style=flat" alt="Workspace scripts ai:sync and ai:check" /></a>
</p>

<p align="center">
  <a href="https://github.com/iDorgham/Nezam/tree/main/.cursor/design"><img src="https://img.shields.io/static/v1?label=design%20profiles&amp;message=.cursor%2Fdesign&amp;color=ea580c&amp;style=flat" alt="Design profiles catalog" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/scripts/design/copy-profile-to-design-md.sh"><img src="https://img.shields.io/static/v1?label=design%3Aapply&amp;message=profile&amp;color=555555&amp;style=flat" alt="design:apply script" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/scripts/checks/check-design-tokens.sh"><img src="https://img.shields.io/static/v1?label=check%3Atokens&amp;message=design&amp;color=24292f&amp;style=flat" alt="Design token check script" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/scripts/checks/check-onboarding-readiness.sh"><img src="https://img.shields.io/static/v1?label=check%3Aonboarding&amp;message=readiness&amp;color=24292f&amp;style=flat" alt="Onboarding readiness check" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/.lighthouserc.json"><img src="https://img.shields.io/static/v1?label=Lighthouse&amp;message=.lighthouserc&amp;color=f45342&amp;style=flat" alt="Lighthouse configuration" /></a>
</p>

<p align="center">
  <a href="https://cursor.com/"><img src="https://img.shields.io/static/v1?label=Cursor&amp;message=orchestration&amp;color=141321&amp;logo=cursor&amp;logoColor=fff&amp;style=flat" alt="Cursor" /></a>
  <a href="https://github.com/iDorgham/Nezam/tree/main/.cursor/commands"><img src="https://img.shields.io/static/v1?label=slash&amp;message=commands&amp;color=24292f&amp;style=flat" alt="Slash commands (.cursor/commands)" /></a>
  <a href="https://github.com/iDorgham/Nezam/tree/main/.cursor/agents"><img src="https://img.shields.io/static/v1?label=agents&amp;message=.cursor%2Fagents&amp;color=6e7681&amp;style=flat" alt="Cursor agents" /></a>
  <a href="https://github.com/iDorgham/Nezam/tree/main/.cursor/skills"><img src="https://img.shields.io/static/v1?label=skills&amp;message=.cursor%2Fskills&amp;color=6e7681&amp;style=flat" alt="Cursor skills" /></a>
  <a href="https://github.com/iDorgham/Nezam/tree/main/.cursor/rules"><img src="https://img.shields.io/static/v1?label=rules&amp;message=.cursor%2Frules&amp;color=6e7681&amp;style=flat" alt="Cursor rules" /></a>
</p>

<p align="center">
  <a href="https://github.com/iDorgham/Nezam/blob/main/docs/reports/README.md"><img src="https://img.shields.io/static/v1?label=reports&amp;message=docs%20hub&amp;color=24292f&amp;style=flat" alt="Generated reports hub" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/docs/README.md"><img src="https://img.shields.io/static/v1?label=docs%20hub&amp;message=docs%2FREADME&amp;color=24292f&amp;style=flat" alt="Documentation hub" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/docs/START.md"><img src="https://img.shields.io/static/v1?label=start%20guide&amp;message=docs%2FSTART&amp;color=1f6feb&amp;style=flat" alt="Start guide" /></a>
  <a href="https://github.com/iDorgham/Nezam/blob/main/docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json"><img src="https://img.shields.io/static/v1?label=gate%20matrix&amp;message=GITHUB__GATE__MATRIX&amp;color=555555&amp;style=flat" alt="GitHub gate matrix JSON" /></a>
</p>

<p align="center">
  <a href="docs/README.md">Documentation hub</a> · <a href="docs/START.md">Start guide</a> · <a href=".cursor/commands/start.md"><code>/START</code> command</a> · <a href="docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json">Gate matrix</a>
</p>

</div>

---

## Overview

### Workspace upgrade status

The workspace v2 upgrade checklist is complete (PU-01 through PU-15), including:

- settings-driven routing and `/Settings` command wiring
- task tool-tagging and fallback/deactivation protocol
- end-to-end Phase 2 routing verification

Track details in [`docs/workspace/context/PENDING_UPGRADE_TASKS.md`](docs/workspace/context/PENDING_UPGRADE_TASKS.md).

### What NEZAM is

**NEZAM is a workspace playbook** for building software with AI assistants (like Cursor, Claude, or others). It does not replace your judgment — it **organizes** how ideas become shipped product.

Think of it like a **flight checklist** for a product:

- You agree **what** you are building (product intent and requirements).
- You agree **how it should look and behave** (design contract) before heavy coding.
- You use **slash commands** so every step has a name, a template, and a clear “done” definition.
- **Automation on GitHub** checks the same things every time, so surprises show up early — not on launch night.

If you are **not** a developer: you can still read the “story” of the project from the docs this repo expects (`PRD`, `DESIGN.md`, plans). Your builder (or future hire) uses NEZAM so work stays **traceable** and **reviewable**.

### Who it is for

Indie life often means **you are the PM, the designer, and the engineer** — sometimes on the same day. NEZAM helps by:

- Giving you a **single delivery spine** so AI does not “skip to code” and paint you into a corner.
- Providing **role-based agents** (“swarm”) so you can ask for architecture, UI, or QA points of view without inventing a process from scratch.
- Keeping **cross-tool parity**: edit canonical rules in `.cursor/`, then sync to other AI clients so everyone reads the same contract.
- Making **quality gates explicit** (tokens, typography, motion, accessibility, CI) so “ship fast” does not mean “ship blind”.

You do **not** need a big company process. You need **lightweight discipline** that survives busy weeks. NEZAM is that layer.

### Capabilities

| You want… | NEZAM provides… |
| --- | --- |
| A clear path from idea to release | Specification-Driven Development (SDD) sequencing + commands |
| Design that matches implementation | Root `DESIGN.md` contract + design gate checks |
| Repeatable AI collaboration | Slash commands with deterministic contracts (`/PLAN`, `/DEVELOP`, …) |
| Less drift between tools | `pnpm ai:sync` / `pnpm ai:check` from canonical `.cursor/` |
| Audit-friendly delivery | Plans under `docs/workspace/plans/`, gate matrix, CI workflows |

---

## Onboarding and START

1. **Open this repo in Cursor** (canonical orchestration surface).
2. Run **`/START`** subcommands in order, or **`/START all`** for repo → settings → docs → gates → design → companion in one pass. Command definitions live in [`.cursor/commands/start.md`](.cursor/commands/start.md) (synced to other clients via `pnpm ai:sync`).
3. Follow the human-readable checklist in **[`docs/START.md`](docs/START.md)** (PRD, prompts, gates, then planning).
4. **Continual Learning** (transcript mining into `AGENTS.md` templates) stays **off** until you opt in: **`/START continual-learning`** or `pnpm continual-learning:on`. Reset transcript index state only with `pnpm continual-learning:reset-memory`.

| `/START` shortcut | Purpose |
| --- | --- |
| `/START repo` | Link or initialize git remote |
| `/START settings` | Jump directly to `/Settings ai-tools setup` |
| `/START docs` | Required folders and context stubs |
| `/START gates` | Readiness checks (plain-language pass/fail) |
| `/START design` | Apply a design profile to root `DESIGN.md` |
| `/START companion` | Briefing for external AIs |
| `/START continual-learning` | Enable continual-learning (`pnpm continual-learning:on`) |

> **Badge note:** CI and design gates shields reflect the latest workflow runs on **`main`**. If a badge shows **failing**, open [Actions](https://github.com/iDorgham/Nezam/actions) for logs and fix forward on a `feature/*` branch so PR checks stay green.

---

## Table of contents

- [Overview](#overview)
- [Onboarding and START](#onboarding-and-start)
- [How to install](#how-to-install)
- [How to use](#how-to-use)
- [Delivery model](#delivery-model)
- [Specification-Driven Development (SDD)](#specification-driven-development-sdd)
- [Swarm teams (who does what)](#swarm-teams-who-does-what)
- [MENA language stack (agents, skills, RTL)](#mena-language-stack-agents-skills-rtl)
- [Am I ready to build with AI?](#am-i-ready-to-build-with-ai)
- [Deterministic GitHub automation](#deterministic-github-automation)
- [Command surface](#command-surface)
- [Most important pnpm commands](#most-important-pnpm-commands)
- [Quick start](#quick-start)
- [Prompt artifacts and gate contracts](#prompt-artifacts-and-gate-contracts)
- [Supported AI clients](#supported-ai-clients)
- [Context, memory, and reporting](#context-memory-and-reporting)
- [Directory map](#directory-map)
- [Daily operating loops](#daily-operating-loops)
- [Troubleshooting](#troubleshooting)
- [References](#references)

---

## How to install

**Prerequisites**

- **Node.js** 20 or newer (matches design-gate and typical CI images).  
- **pnpm** 9+ ([install pnpm](https://pnpm.io/installation)).  
- **Git** and a GitHub account if you plan to use Actions and PR checks.  
- **Cursor** (recommended) or another client listed under [Supported AI clients](#supported-ai-clients).

**Steps**

1. **Clone** this repository (or copy the kit into an existing project root).

   ```sh
   git clone https://github.com/iDorgham/Nezam.git
   cd Nezam
   ```

2. **Install** JavaScript dependencies from the repo root:

   ```sh
   pnpm install
   ```

3. **Validate** that the workspace scripts resolve (optional but useful on a fresh machine):

   ```sh
   pnpm run check:onboarding
   pnpm ai:check
   ```

4. **Optional:** install local context hooks if your team uses them (see [Context, memory, and reporting](#context-memory-and-reporting)).

This repo is a **workspace kit**, not a single deployable app: there may be no `pnpm dev` at the root unless your fork adds one. Use **`/START`** and the docs hub to scaffold product-specific apps or packages.

---

## How to use

1. **Open the folder in Cursor** so `.cursor/commands` and rules load as first-class slash commands.  
2. **Run onboarding** — follow [Onboarding and START](#onboarding-and-start): at minimum `/START repo` and `/START docs`, or `/START all` for the full sequence (continual-learning is opt-in separately).  
3. **Work in SDD order** — specs and `DESIGN.md` before `/DEVELOP start`; use [Delivery model](#delivery-model) and [Am I ready to build with AI?](#am-i-ready-to-build-with-ai) as guardrails.  
4. **Edit canonical AI config only under `.cursor/`** (commands, agents, skills, rules). After changes, regenerate mirrors:

   ```sh
   pnpm ai:sync
   pnpm ai:check
   ```

5. **Use slash commands** for day-to-day work — see [Command surface](#command-surface) and [Daily operating loops](#daily-operating-loops). When blocked, run **`/GUIDE`** for the next unblock step.

6. **MENA and RTL** — when building localized or RTL surfaces, follow [MENA language stack (agents, skills, RTL)](#mena-language-stack-agents-skills-rtl) and workspace **`/START mena`** where applicable.

For a minimal numbered path from empty repo to development, see **[Quick start](#quick-start)**.

---

## Delivery model

NEZAM separates **discovery**, **shaping**, **building**, and **shipping** so AI work stays reviewable. You can describe the same journey in two ways:

**Non-technical journey**

1. **Discover and decide** — clarify the idea and priorities.  
2. **Shape the product** — specs, content, information architecture, and a design system direction.  
3. **Build and prove** — implementation plus tests and scans (performance, accessibility, security as configured).  
4. **Ship with confidence** — release only after gates and checklists pass.

**Technical SDD order** (hard sequencing for implementation readiness)

1. **Planning** → **SEO and IA** → **Content** → **Design** (`DESIGN.md` and tokens) → **Development** → **Hardening** → **Release**.

GitHub Mermaid blocks here were removed on purpose: chained `flowchart LR` diagrams with subgraphs and special characters (for example slashes inside labels) are a common source of **“Unable to render rich display”** on github.com. The diagrams below are limited to **three** simple charts: **swarm hierarchy**, **MENA agents**, and **skills plus RTL**.

---

## Specification-Driven Development (SDD)

NEZAM enforces **Specification-Driven Development**: plan and scope work, complete SEO/IA/content and design artifacts, run design gates, then implement. That single spine keeps decisions **auditable** and outcomes **reproducible**.

**Hardlock prerequisites for development** (implementation stays locked until these exist):

1. `docs/core/required/prd/PRD.md`
2. `docs/core/required/PROJECT_PROMPT.md`
3. **`DESIGN.md` at repository root** — from the chosen catalog profile: `.cursor/design/<brand>/design.md` (see [`.cursor/design/README.md`](.cursor/design/README.md)). Use `/START design` or `pnpm run design:apply -- <brand>`.
4. `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`
5. Every active `docs/workspace/plans/<phase>/<subphase>/` includes both `prompt.json` and `PROMPT.md`

Repository note: PRD may also appear under `docs/reference/prd/PRD.md` during migration; treat `/GUIDE` and gate checks as the source of truth for readiness.

**Design-quality defaults** include token-first styling, fluid typography, responsive grids, accessibility and reduced-motion considerations, component API contracts before implementation, and measurable gates before merge/release.

---

## Swarm teams (who does what)

NEZAM supports a **swarm** pattern: specialized agents collaborate through **explicit handoffs** instead of vague “help me with everything” prompts. Specialists are **bounded roles** — useful when you prompt AI with “act as architect” versus “act as design lead”. Leadership stays narrow; execution stays traceable.

### Swarm hierarchy (primary roles)

```mermaid
flowchart TB
  PM[PM swarm leader]
  AR[Project architect]
  DS[Design UX lead]
  FE[Frontend lead]
  BE[Backend lead]
  PM --> AR
  PM --> DS
  AR --> FE
  AR --> BE
  DS --> FE
```

**Role IDs (canonical)**

- `PM-01-Swarm-Leader` — scope governance, prioritization, orchestration  
- `ARCH-01-Project-Architect` — architecture integrity and sequencing  
- `DESIGN-01-UIUX-Lead` — design-system and UX contract ownership  
- `FE-01-Frontend-Lead` — frontend implementation strategy and quality  
- `BE-01-Backend-Lead` — backend services and data contract ownership  

**Why swarms stay governable**

- Responsibilities are explicit → less duplicate or contradictory work  
- Each phase has an owner and acceptance criteria  
- Handoff artifacts (`prompt.json`, `PROMPT.md`, gate checklists) make transitions predictable  
- Parallel tracks stay bounded by the same gate matrix and `DESIGN.md` contracts  

Role index: [`.cursor/agents/README.md`](.cursor/agents/README.md).

---

## MENA language stack (agents, skills, RTL)

Regional language work is a **first-class** concern: dialect specialists, SEO and answer-engine patterns, RTL UI parity, and editorial workflows live beside the core swarm. Canonical agent files are under [`.cursor/agents/`](.cursor/agents/); Arabic-related content skills live under [`.cursor/skills/content/`](.cursor/skills/content/). Activate MENA and RTL workflows with **`/START mena`** (see workspace rules) when shipping localized product surfaces.

### MENA language agents

```mermaid
flowchart TB
  CM[arabic-content-master]
  SEO[arabic-seo-aeo-specialist]
  KH[khaleeji-specialist]
  LV[levantine-specialist]
  MS[masri-content-specialist]
  MG[maghrebi-specialist]
  MFA[msa-formal-specialist]
  RTL[rtl-specialist]
  I18[i18n-engineer]
  LOC[localization-lead]
  SEO --> CM
  KH --> CM
  LV --> CM
  MS --> CM
  MG --> CM
  MFA --> CM
  RTL --> CM
  I18 --> CM
  LOC --> CM
```

Dialect specialists feed the same **content owner** agent; **rtl-specialist**, **i18n-engineer**, and **localization-lead** cut across UI and copy so layout, routing, and strings stay consistent.

### Content skills and RTL

```mermaid
flowchart TB
  AR[arabic-content skill]
  EG[egyptian-arabic-content skill]
  EW[editorial-workflows skill]
  RTL[rtl-specialist]
  UI[DESIGN and frontend RTL checks]
  RTL --> AR
  RTL --> EG
  RTL --> UI
  AR --> EW
  EG --> EW
```

Skills package long-form prompts, dialect modules, and evaluation assets; **rtl-specialist** ties those contracts to **design gates** and UI implementation (for example `dir="rtl"`, mirrored layouts, and motion parity). Editorial workflows support SEO and AEO workstreams driven by **arabic-seo-aeo-specialist**.

---

## Am I ready to build with AI?

Use this as a **binary gate** before heavy coding:

| Gate | Question | If “no”, do this |
| --- | --- | --- |
| 1 | Are `PRD` and `PROJECT_PROMPT` aligned on scope? | `/CREATE` and `/GUIDE` until specs match |
| 2 | Is root `DESIGN.md` real (not a template), with plans and `GITHUB_GATE_MATRIX.json` present? | `/PLAN design`, `/START design` |
| 3 | Does every **active** plan subphase have `prompt.json` and `PROMPT.md`? | `/PLAN all` and fill plan prompts |
| 4 | Did `/START gates` and CI readiness pass on your branch? | `pnpm run check:onboarding`, fix listed paths |

When all rows are “yes”, run **`/DEVELOP start`** and keep changes scoped to the approved contracts.

---

## Deterministic GitHub automation

Automation is treated as a **deterministic system**: same inputs → same checks, with visible policy and guardrails.

**Key assets**

- `.github/workflows/ci.yml` — continuous integration and policy checks  
- `.github/workflows/design-gates.yml` — token, motion, accessibility, and related design gates  
- `.github/workflows/release.yml` — release choreography (as configured in this repo)  
- `scripts/checks/check-onboarding-readiness.sh` — readiness validation  
- `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json` — gate policy source of truth  

**Typical themes**

- Branch and commit hygiene  
- Onboarding and readiness validation  
- Plan artifacts and prompt contract checks  
- Gate matrix validation  
- Scheduled automation self-checks where enabled  

---

## Command surface

> **`/command` do everything** — meaningful workspace actions are slash commands with deterministic contracts (in Cursor; mirrored clients consume synced copies).

| Command | Purpose (plain language) |
| --- | --- |
| `/START` | Onboard the repo, initialize docs, verify readiness |
| `/PLAN` | Shape roadmap, phases, and specs in SDD order |
| `/DEVELOP` | Implement only from approved specs and `DESIGN.md` |
| `/GUIDE` | Explain what is blocked and the next unblock steps |
| `/CREATE` | Generate required docs from templates |
| `/SCAN` | Run quality, security, performance, or accessibility scans |
| `/FIX` | Triage and fix issues in a structured loop |
| `/SAVE` | Save progress: commits, reports, version hygiene |
| `/DEPLOY` | Release choreography and verification |

**Aliases:** `/st` `/pl` `/dv` `/gd` `/cr` `/sc` `/fx` `/sv` `/dp` (see command docs under `.cursor/commands/`).

---

## Most important pnpm commands

**Bootstrap and validate**

```sh
pnpm install
pnpm run check:onboarding
pnpm ai:check
```

**Keep AI surfaces in sync (after editing `.cursor/`)**

```sh
pnpm ai:sync
pnpm ai:check
```

**Optional workspace helpers** (if present in your fork)

```sh
pnpm run welcome
pnpm run tools:list
pnpm run tools:check
```

**Practical rhythm**

- After editing canonical `.cursor/` commands, agents, skills, or rules → `pnpm ai:sync` then `pnpm ai:check`  
- When hardlock status is unclear → `pnpm run check:onboarding`  

---

## Quick start

Prerequisites and dependency install: **[How to install](#how-to-install)**. Day-to-day command flow: **[How to use](#how-to-use)**.

1. Open the repository in **Cursor** (primary orchestration surface).
2. Onboard using **[Onboarding and START](#onboarding-and-start)** (e.g. `/START repo`, `/START docs`, or `/START all`).
3. Create core specs: `/CREATE prd`, `/CREATE prompt` (follow workspace templates).  
4. Ensure the gate manifest exists: `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`.  
5. Plan in SDD order: `/PLAN all`.  
6. For each active subphase, ensure `prompt.json` and `PROMPT.md` exist.  
7. When prerequisites pass: `/DEVELOP start`.  

Deep links: [`docs/README.md`](docs/README.md) · [`docs/START.md`](docs/START.md)

---

## Prompt artifacts and gate contracts

Template root: `docs/workspace/templates/plan/README.md`

Examples of template families (names may vary slightly by version):

- `PROMPT_SCHEMA.template.json`  
- `SPEC_PROMPT.template.md`  
- `SUBPHASE_PROMPT.template.md`  
- `GITHUB_GATE_MATRIX_SCHEMA.template.json`  
- `GITHUB_START_GATE.template.md` / `GITHUB_END_GATE.template.md`  
- `PRE_MERGE_GATE_CHECKLIST.template.md` / `POST_MERGE_GATE_CHECKLIST.template.md`  
- `NIGHTLY_AUTOMATION_SELF_TEST.template.md`  
- `SILENT_AUTOMATION_FAILURE_TAXONOMY.template.md` / `SILENT_AUTOMATION_FIX_MAPPING.template.md`  

---

## Supported AI clients

NEZAM keeps **`.cursor/` as canonical** and syncs generated surfaces for other tools.

| Client group | Typical entry files |
| --- | --- |
| Cursor IDE | `.cursor/**` |
| Claude Code / Claude CLI | `CLAUDE.md`, `.claude/**` |
| Codex / Copilot CLI | `AGENTS.md`, `.codex/AGENTS.md` |
| Opencode CLI | `AGENTS.md`, `.opencode/**` |
| Antigravity IDE | `.antigravity/**` |
| Gemini CLI | `GEMINI.md`, `.gemini/commands/*.toml` |
| Qwen CLI | `QWEN.md`, `.qwen/commands/*.toml` |
| Kilo Code CLI | `.kilocode/rules/**` |

Full map: [`docs/workspace/context/MULTI_TOOL_INDEX.md`](docs/workspace/context/MULTI_TOOL_INDEX.md)

---

## Context, memory, and reporting

**Core context**

- `docs/workspace/context/CONTEXT.md`  
- `docs/workspace/context/MEMORY.md`  
- `docs/workspace/context/WORKSPACE_INDEX.md`  
- `docs/reports/progress/PROGRESS_REPORT.latest.md`  

**Optional local helpers**

```sh
bash scripts/context/install-context-hooks.sh
python3 scripts/context/update-context-docs.py
```

**Reports policy:** write generated outputs under `docs/reports/<category>/` — not the repo root or unstructured `docs/` paths. See workspace rules and each category’s `README.md` under `docs/reports/`.

---

## Directory map

```text
.cursor/
  commands/          # Slash command contracts
  rules/             # Always-on governance gates
  skills/            # Reusable procedures
  agents/            # Role / persona definitions
docs/
  README.md          # Documentation hub
  assets/            # Images for specs and docs
  core/              # Required docs, architecture, versioning
  workspace/         # Plans, context, templates, governance
  reports/           # Generated reports by category
.github/workflows/ # CI, design gates, release automation
scripts/             # Checks, context updates, tooling
```

---

## Daily operating loops

**Planning loop**

1. `/GUIDE status`  
2. `/START gates`  
3. `/PLAN all`  
4. Fill missing `prompt.json` + `PROMPT.md` per active subphase  

**Development loop**

1. `/GUIDE next`  
2. `/DEVELOP start`  
3. `/DEVELOP slice` or `/DEVELOP feature <id>`  
4. `/DEVELOP test`  
5. `/SAVE commit` and `/SAVE report`  

**Hardening / release loop**

1. `/SCAN all`  
2. `/FIX triage` and `/FIX patch`  
3. `/DEPLOY rc`  
4. `/DEPLOY verify`  

---

## Troubleshooting

| Symptom | What to do |
| --- | --- |
| Hardlock: “cannot develop yet” | `/GUIDE status` — complete missing artifacts in SDD order |
| Onboarding / readiness failures | `pnpm run check:onboarding` and fix listed paths |
| Drift between Cursor and other AI clients | `pnpm ai:sync` then `pnpm ai:check` |
| Automation feels “silent” or unclear | Use taxonomy + fix-mapping templates under `docs/workspace/templates/plan/` |

---

## References

- Role map: [`.cursor/agents/README.md`](.cursor/agents/README.md)  
- Memory architecture: [`docs/workspace/context/MEMORY_ARCHITECTURE.md`](docs/workspace/context/MEMORY_ARCHITECTURE.md)  
- Companion briefing: [`docs/workspace/context/CONTEXT.md`](docs/workspace/context/CONTEXT.md)  
- Plan index: [`docs/workspace/plans/INDEX.md`](docs/workspace/plans/INDEX.md)  

---

<div align="center">

**Built for people who ship — with AI, not by accident.**

[`/command` do everything.](#nezam)

</div>
