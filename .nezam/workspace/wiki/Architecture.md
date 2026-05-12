# Architecture

## Overview

NEZAM is a **workspace orchestration layer** — not an application. It sits between the developer/founder and their AI assistants, providing the governance structure that makes AI-native development reliable and traceable.

## System Layers

```
┌─────────────────────────────────────────────────────┐
│                    DEVELOPER                         │
│              (Cursor / IDE / Terminal)               │
└───────────────────────┬─────────────────────────────┘
                        │ /commands
┌───────────────────────▼─────────────────────────────┐
│                  NEZAM CORE                          │
│     .cursor/ rules · agents · skills · commands     │
│     Slash commands → SDD pipeline enforcement        │
└──────────┬──────────────────────────┬───────────────┘
           │                          │
┌──────────▼──────────┐  ┌────────────▼───────────────┐
│   SWARM SYSTEM       │  │   MEMORY SYSTEM             │
│  swarm-leader        │  │  .nezam/memory/               │
│  subagent-controller │  │  Layer 0: ephemeral         │
│  100+ agents         │  │  Layer 1: durable (git)     │
│  lazy-loaded         │  │  Layer 2: team contracts    │
└──────────┬──────────┘  │  Layer 3: workspace govern. │
           │              └────────────────────────────┘
┌──────────▼──────────────────────────────────────────┐
│               MULTI-CLIENT SYNC                      │
│  .cursor → .claude → .gemini → .opencode → .codex   │
│             pnpm ai:sync / pnpm ai:check             │
└──────────────────────────────────────────────────────┘
```

## Canonical Source

`.cursor/` is the **single source of truth**. All other AI client folders (`.claude/`, `.gemini/`, `.opencode/`, etc.) are derived via `pnpm ai:sync`.

**Never edit** `.claude/`, `.gemini/`, `.opencode/` directly. Always edit `.cursor/` then sync.

## Key Directories

| Path | Purpose |
|---|---|
| `.cursor/agents/` | 100+ specialized agent definitions |
| `.cursor/commands/` | Slash command definitions (`/START`, `/PLAN`, etc.) |
| `.cursor/skills/` | Domain skill packs (10 domains) |
| `.cursor/rules/` | Governance rules (hardlock, SDD, design gates) |
| `.nezam/design/` | Brand/design profiles |
| `.nezam/memory/` | Durable AI memory (decisions, context, protocols) |
| `docs/prd/` | Product Requirements Document |
| `docs/plans/` | Phase execution plans + gate matrix |
| `docs/specs/` | Feature specs + SDD artifacts |
| `docs/architecture/` | ADRs + diagrams |
| `scripts/` | Automation scripts (checks, sync, design, release) |
| `.github/workflows/` | CI/CD gate enforcement |

## Design Philosophy

See [Design System](./Design-System) for the full token-first approach.

## ADR Index

Architecture Decision Records live in `docs/architecture/decisions/`. Each follows:

```
# ADR-XXXX: [Title]
Status: [Proposed | Accepted | Deprecated | Superseded]
Context: Why this decision was needed
Decision: What was decided
Consequences: Trade-offs and follow-ups
```
