# Memory System

NEZAM uses a 4-layer memory architecture to ensure critical decisions, context, and protocols survive session resets and agent handoffs.

## The Problem It Solves

AI assistants have no persistent memory. Without a governed memory system:
- Architectural decisions are re-debated every session
- Design choices get overridden by agents who weren't present for the original decision
- Context about what phase you're in and what's been decided is lost
- New agents have no briefing document

## The 4 Layers

### Layer 0 — Session Runtime (Ephemeral)

| What | Where | Lifetime |
|---|---|---|
| Active chat context | Cursor chat window | Until session ends |
| Temporary assumptions | In-message reasoning | Until cleared |
| Open file buffers | Editor | Until closed |

**Practice:** Before ending a session, run `/SCAN` and persist anything important to Layer 1.

---

### Layer 1 — Project SDD Truth (Durable, Committed to Git)

The primary source of truth for all project-level facts.

| File | Purpose |
|---|---|
| `docs/memory/MEMORY.md` | Durable project facts, decisions, scorecards |
| `docs/memory/CONTEXT.md` | Current project context and active priorities |
| `docs/memory/WORKSPACE_INDEX.md` | Static workspace capability map |
| `docs/memory/PHASE_HANDOFF.md` | Agent briefing at phase boundaries |
| `docs/memory/DECISIONS.md` | Plain-language decision log |
| `docs/memory/SKILL_CHANGELOG.md` | History of skill additions/changes |
| `docs/plans/INDEX.md` | Current phase, task status, gate state |
| `docs/reports/progress/PROGRESS_REPORT.latest.md` | Latest progress snapshot |

**Capture protocol:** Agents must persist to this layer before ending any phase gate reply.

| Trigger | Persist to |
|---|---|
| Stack/library choice locked | `MEMORY.md` → Active Stack Decisions |
| Architecture pattern chosen | `MEMORY.md` → Locked Architecture Decisions |
| Design token/grid locked | `MEMORY.md` → Locked Design Decisions |
| Intentional compromise | `MEMORY.md` → Accepted Tradeoffs |
| Agent evaluation completed | `MEMORY.md` → Agent Scorecards |
| Phase boundary crossed | `PHASE_HANDOFF.md` |

---

### Layer 2 — Team Behavior Contracts (Versioned)

Defines how agents behave, interact, and route tasks.

| File | Purpose |
|---|---|
| `.cursor/agents/*.md` | Individual agent role definitions |
| `.cursor/rules/*.mdc` | Governance rules (hardlock, SDD, design gates) |
| `.cursor/skills/` | Skill packs for each domain |
| `docs/memory/AGENT_COMM_PROTOCOL.md` | Inter-agent communication standards |
| `docs/memory/ORCHESTRATION_ALIASES.md` | Command shorthand aliases |
| `docs/memory/ERROR_HANDLING_PROTOCOL.md` | Error classification and response |

---

### Layer 3 — Workspace Governance (Root Level)

The outermost layer: what every AI reads when it opens this repo.

| File | Purpose |
|---|---|
| `CLAUDE.md` | Claude workspace contract |
| `AGENTS.md` | Codex/AGENTS workspace contract |
| `GEMINI.md` | Gemini workspace contract |
| `QWEN.md` | Qwen workspace contract |
| `docs/memory/MEMORY_ARCHITECTURE.md` | This document's source |
| `docs/memory/MCP_REGISTRY.md` | MCP tool registry and usage |
| `docs/memory/CLI_TOOLS_CONTEXT.md` | CLI tool reference |
| `docs/memory/MULTI_TOOL_INDEX.md` | Cross-tool capability map |

---

## Memory Files Reference

### `docs/memory/MEMORY.md`

The most critical memory file. Contains:
- Session state (active swarm, active agent)
- Active stack decisions (dated)
- Locked architecture decisions
- Locked design decisions
- Accepted tradeoffs
- Agent scorecards
- Tooling notes

**Update this file** after every phase gate or major decision.

### `docs/memory/CONTEXT.md`

The current project context. Includes:
- What phase the project is in
- What was just completed
- What is currently in progress
- What's blocked and why
- Next priorities

### `docs/memory/PHASE_HANDOFF.md`

Written at the end of each phase. Provides the next agent/session with:
- What was completed in this phase
- Key decisions made
- Files changed
- Outstanding items
- What to start next

---

## Best Practices

1. **Always read `docs/memory/MEMORY.md` at session start** (the `/START` command does this automatically)
2. **Update `MEMORY.md` before ending any phase gate** — don't let decisions live only in chat
3. **Use `CONTEXT.md` for current state** — what's happening right now, not the full history
4. **Write `PHASE_HANDOFF.md` at every phase boundary** — this is your handoff note to future-you
5. **Commit memory files with the feature/change they record** — keeps git history honest
