# COIA

AI workspace orchestration system for **Swarm Teams**, **Specification-Driven Development (SDD)**, and **deterministic GitHub automation**.

[![Methodology: SDD](https://img.shields.io/badge/Methodology-SDD-1f6feb)](#sdd-core-model-design-first)
[![Execution: Swarm Teams](https://img.shields.io/badge/Execution-Swarm%20Teams-6f42c1)](#swarm-teams-operating-model)
[![Design Gate](https://img.shields.io/badge/Design-Gate%20Required-d97706)](#sdd-core-model-design-first)
[![Automation](https://img.shields.io/badge/Automation-Deterministic%20GitHub-0e8a16)](#deterministic-github-automation)
[![Commands](https://img.shields.io/badge/Commands-START%20PLAN%20DEVELOP-0366d6)](#command-surface)
[![Context Sync](https://img.shields.io/badge/Context-Synced%20Memory-8250df)](#context-memory-and-reporting)
[![Monorepo](https://img.shields.io/badge/Workspace-Multi%20Client-24292f)](#supported-ai-clients)
[![Package Manager](https://img.shields.io/badge/Package%20Manager-pnpm-F69220?logo=pnpm&logoColor=fff)](#most-important-pnpm-commands)

Start here: [`docs/START.md`](docs/START.md)

---

## Long Description

COIA is a governance-first workspace that turns AI-assisted delivery into a predictable system.
It is built for teams that want:

- strict sequencing from discovery to release
- design-approved implementation only (no bypassing design contracts)
- deterministic CI behavior and explicit GitHub gate policies
- swarm collaboration where each specialist role has bounded responsibilities
- cross-client compatibility (Cursor, Claude, Codex, Antigravity, Gemini, Qwen, and others)

At its core, COIA prevents random coding by enforcing a single delivery spine:

`Planning -> SEO/IA -> Content -> Design -> Development -> Hardening -> Ship`

This keeps architecture decisions auditable, design quality measurable, and automation outcomes reproducible.

---

## Table of Contents

- [Long Description](#long-description)
- [Swarm Teams Operating Model](#swarm-teams-operating-model)
- [SDD Core Model (Design First)](#sdd-core-model-design-first)
- [Deterministic GitHub Automation](#deterministic-github-automation)
- [Command Surface](#command-surface)
- [Most Important pnpm Commands](#most-important-pnpm-commands)
- [Quick Start](#quick-start)
- [Prompt Artifacts and Gate Contracts](#prompt-artifacts-and-gate-contracts)
- [Supported AI Clients](#supported-ai-clients)
- [Context, Memory, and Reporting](#context-memory-and-reporting)
- [Directory Map](#directory-map)
- [Daily Operating Loops](#daily-operating-loops)
- [Troubleshooting](#troubleshooting)
- [References](#references)

---

## Swarm Teams Operating Model

COIA supports a swarm pattern where specialized agents/roles collaborate through explicit handoffs rather than ad-hoc overlap.

### Primary leadership roles

- `PM-01-Swarm-Leader`: scope governance, prioritization, orchestration
- `ARCH-01-Project-Architect`: architecture integrity and sequencing decisions
- `DESIGN-01-UIUX-Lead`: design-system and UX contract ownership
- `FE-01-Frontend-Lead`: frontend implementation strategy and quality
- `BE-01-Backend-Lead`: backend services/data contract ownership

### Why this model works

- responsibilities are explicit, reducing duplicate work
- each phase has an owner and acceptance criteria
- handoff artifacts (`prompt.json`, `PROMPT.md`, gate checklists) create predictable transitions
- delivery can scale across multiple parallel tracks without losing governance

---

## SDD Core Model (Design First)

COIA enforces **Specification-Driven Development** as a hard contract:

1. plan and scope work
2. complete SEO/IA/content and design artifacts
3. enforce design gates
4. allow implementation only after prerequisites pass

### Hardlock prerequisites for development

Development remains locked until all required artifacts exist:

1. `docs/core/required/prd/PRD.md`
2. `docs/core/required/PROJECT_PROMPT.md`
3. `.cursor/design/<brand>/design.md` (UI-facing scopes)
4. `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`
5. every active `docs/workspace/plans/<phase>/<subphase>/` has both:
   - `prompt.json`
   - `PROMPT.md`

Current repository note:
- PRD may be tracked under `docs/reference/prd/PRD.md` during migration phases; keep `/GUIDE` and gate checks as the source of truth for readiness status.

### Design-focus quality principles

- token-first styling and governed design primitives
- fluid typography and responsive grid systems
- accessibility and reduced-motion support as defaults
- component API contracts before implementation
- measurable quality gates before merge/release

---

## Deterministic GitHub Automation

COIA treats GitHub automation as a deterministic system with visible policy and explicit guardrails.

### Core automation goals

- deterministic checks (same inputs -> same outcomes)
- no silent gate bypass
- explicit failure taxonomy and remediation mapping
- reproducible release choreography

### Primary workflow and gate assets

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `scripts/checks/check-onboarding-readiness.sh`
- `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`

### Typical enforced policies

- branch and commit hygiene
- onboarding/readiness validation
- plan artifact and prompt contract checks
- gate matrix validation
- nightly automation self-test

---

## Command Surface

| Command | Purpose |
| --- | --- |
| `/START` | Onboard repo, initialize required docs, verify readiness |
| `/PLAN` | Build SDD roadmap/phases/specs with SEO/IA/content/design sequencing |
| `/DEVELOP` | Implement only from approved specs and design contracts |
| `/GUIDE` | Explain lock state, next steps, and unblock sequence |
| `/CREATE` | Generate required docs and template-driven artifacts |
| `/SCAN` | Run quality/security/perf/a11y scans |
| `/FIX` | Triage and remediate defects systematically |
| `/SAVE` | Preserve progress, commit/report/version hygiene |
| `/DEPLOY` | Run release choreography and verification |

Aliases:

- `/START` -> `/st`
- `/PLAN` -> `/pl`
- `/DEVELOP` -> `/dv`
- `/GUIDE` -> `/gd`
- `/CREATE` -> `/cr`
- `/SCAN` -> `/sc`
- `/FIX` -> `/fx`
- `/SAVE` -> `/sv`
- `/DEPLOY` -> `/dp`

---

## Most Important pnpm Commands

These are the highest-value `pnpm` commands for day-to-day COIA workflows.

### Workspace bootstrap and validation

```sh
pnpm install
pnpm run check:onboarding
pnpm run validate
```

### AI surface sync and drift protection

```sh
pnpm ai:sync
pnpm ai:check
```

### Operational command runners (if defined in your workspace scripts)

```sh
pnpm run welcome
pnpm run tools:list
pnpm run tools:check
```

### Practical usage notes

- run `pnpm ai:sync` after editing canonical `.cursor/` commands/agents/skills/rules
- run `pnpm ai:check` before PR creation to catch sync drift early
- run `pnpm run check:onboarding` whenever readiness or hardlock state is unclear

---

## Quick Start

1. Open repository in Cursor.
2. Run onboarding:
   - `/START repo`
   - `/START docs`
3. Create required specs:
   - `/CREATE prd`
   - `/CREATE prompt`
4. Ensure gate manifest exists:
   - `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`
5. Run planning:
   - `/PLAN all`
6. Ensure each active subphase includes:
   - `prompt.json`
   - `PROMPT.md`
7. Start implementation:
   - `/DEVELOP start`

---

## Prompt Artifacts and Gate Contracts

Template root:

- `docs/workspace/templates/plan/README.md`

Key templates:

- `PROMPT_SCHEMA.template.json`
- `SPEC_PROMPT.template.md`
- `SUBPHASE_PROMPT.template.md`
- `GITHUB_GATE_MATRIX_SCHEMA.template.json`
- `GITHUB_START_GATE.template.md`
- `GITHUB_END_GATE.template.md`
- `PRE_MERGE_GATE_CHECKLIST.template.md`
- `POST_MERGE_GATE_CHECKLIST.template.md`
- `NIGHTLY_AUTOMATION_SELF_TEST.template.md`
- `SILENT_AUTOMATION_FAILURE_TAXONOMY.template.md`
- `SILENT_AUTOMATION_FIX_MAPPING.template.md`

---

## Supported AI Clients

COIA keeps `.cursor/` as canonical and syncs generated surfaces for other clients.

| Client group | Entry files |
| --- | --- |
| Cursor IDE | `.cursor/**` |
| Claude Code / Claude CLI | `CLAUDE.md`, `.claude/**` |
| Codex app / Codex CLI / Copilot CLI | `AGENTS.md`, `.codex/AGENTS.md` |
| Opencode CLI | `AGENTS.md`, `.opencode/**` |
| Antigravity IDE | `.antigravity/**` |
| Gemini CLI | `GEMINI.md`, `.gemini/commands/*.toml` |
| Qwen CLI | `QWEN.md`, `.qwen/commands/*.toml` |
| Kilo Code CLI | `.kilocode/rules/**` |

Reference index: `docs/workspace/context/MULTI_TOOL_INDEX.md`

---

## Context, Memory, and Reporting

Core context sources:

- `docs/workspace/context/CONTEXT.md`
- `docs/workspace/context/MEMORY.md`
- `docs/workspace/context/WORKSPACE_INDEX.md`
- `docs/reports/progress/PROGRESS_REPORT.latest.md`

Update helpers:

```sh
bash scripts/context/install-context-hooks.sh
python3 scripts/context/update-context-docs.py
```

Generated reports policy:

- Place generated outputs under `docs/reports/<category>/`
- Avoid writing generated reports to repository root or non-report `docs/` paths

---

## Directory Map

```text
.cursor/
  commands/          # Slash command contracts
  rules/             # Always-on governance gates
  skills/            # Reusable procedures
  agents/            # Role/persona definitions
docs/
  core/              # Required docs, architecture, versioning
  workspace/         # plans, context, templates, governance docs
  reports/           # generated reports by category
.github/workflows/   # deterministic CI/release automation
scripts/             # checks, context updates, workspace tooling
```

---

## Daily Operating Loops

### Planning loop

1. `/GUIDE status`
2. `/START gates`
3. `/PLAN all`
4. fill missing `prompt.json` + `PROMPT.md` per active subphase

### Development loop

1. `/GUIDE next`
2. `/DEVELOP start`
3. `/DEVELOP slice` or `/DEVELOP feature <id>`
4. `/DEVELOP test`
5. `/SAVE commit` and `/SAVE report`

### Hardening/release loop

1. `/SCAN all`
2. `/FIX triage` and `/FIX patch`
3. `/DEPLOY rc`
4. `/DEPLOY verify`

---

## Troubleshooting

- Hardlock active:
  - run `/GUIDE status` and complete missing artifacts in strict order
- Onboarding/readiness failure:
  - run `pnpm run check:onboarding` and resolve reported paths
- Drift between canonical and generated AI surfaces:
  - run `pnpm ai:sync` then `pnpm ai:check`
- Automation appears silent:
  - use taxonomy + fix mapping templates in `docs/workspace/templates/plan/`

---

## References

- Team role map: `.cursor/agents/README.md`
- Memory model: `docs/workspace/context/MEMORY_ARCHITECTURE.md`
- External companion context: `docs/workspace/context/CONTEXT.md`
- Plan index: `docs/workspace/plans/INDEX.md`

