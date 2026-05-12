# NEZAM Wiki

**Welcome to the NEZAM knowledge base.**

For the **sidebar + footer** experience, run `pnpm docs:wiki` from the repo root (see [Wiki site shell](README.md)).

NEZAM is an AI workspace orchestration system built on Specification-Driven Development (SDD). It gives every AI assistant a shared contract — so your swarm stays aligned from the first `/START` to final `/DEPLOY`.

---

## Quick Navigation

| Topic | Page |
|---|---|
| What is NEZAM? | [Architecture](./Architecture.md) |
| SDD delivery pipeline | [SDD Pipeline](./SDD-Pipeline.md) |
| Agent system | [Agent Map](./Agent-Map.md) |
| Design governance | [Design System](./Design-System.md) |
| Slash commands | [Commands](./Commands.md) |
| Memory & decisions | [Memory System](./Memory-System.md) |
| Contributing | [Contributing](./Contributing.md) |
| Deployment & CI | [Deployment](./Deployment.md) |

---

## At a Glance

```
.cursor/       ← The canonical brain (agents, rules, skills, commands)
.nezam/memory/   ← The workspace's long-term memory
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

See the [SDD Pipeline](./SDD-Pipeline.md) page for details.
