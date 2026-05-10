# NEZAM Wiki

**Welcome to the NEZAM knowledge base.**

NEZAM is an AI workspace orchestration system built on Specification-Driven Development (SDD). It gives every AI assistant a shared contract — so your swarm stays aligned from the first `/START` to final `/DEPLOY`.

---

## Quick Navigation

| Topic | Page |
|---|---|
| What is NEZAM? | [Architecture](./Architecture) |
| SDD delivery pipeline | [SDD Pipeline](./SDD-Pipeline) |
| Agent system | [Agent Map](./Agent-Map) |
| Design governance | [Design System](./Design-System) |
| Slash commands | [Commands](./Commands) |
| Memory & decisions | [Memory System](./Memory-System) |
| Contributing | [Contributing](./Contributing) |
| Deployment & CI | [Deployment](./Deployment) |

---

## At a Glance

```
.cursor/       ← The canonical brain (agents, rules, skills, commands)
docs/memory/   ← The workspace's long-term memory
docs/prd/      ← What we're building and why
docs/plans/    ← How we're building it, phase by phase
docs/specs/    ← What each feature must do
.github/       ← CI/CD gates that enforce the contracts
```

## Core Principle

> Every decision is captured. Every gate is enforced. Every agent reads the same contract.

---

## Getting Started

1. Clone the repo
2. Run `pnpm install`
3. Open in Cursor and type `/START`
4. Follow the SDD pipeline

See the [SDD Pipeline](./SDD-Pipeline) page for details.
