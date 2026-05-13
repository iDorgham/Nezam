# NEZAM — Durable Project Memory

> Source of truth for decisions that must survive session resets.  
> Update after every phase gate, architecture decision, design lock, or stack selection.

## Session State

```yaml
active_swarm: ""          # Fill at session start: Swarm N — [name]
active_agent: ""          # Currently active agent file name
session_context_loaded:   # List of agent files loaded this session
  - []
```

## Layer Reference

- Full model: [`MEMORY_ARCHITECTURE.md`](./MEMORY_ARCHITECTURE.md)
- Cross-agent boundary handoff: [`PHASE_HANDOFF.md`](./PHASE_HANDOFF.md)
- PRD: [`.nezam/workspace/prd/PRD.md`](../prd/PRD.md)
- Plans: [`docs/plans/`](../plans/)
- Context: [`CONTEXT.md`](./CONTEXT.md)
- Wiki: [`docs/wiki/Home.md`](../wiki/Home.md)

## Memory schema

### Types
- **L0 (Ephemeral):** Chat history, active buffers. Not persisted across sessions.
- **L1 (Durable):** `MEMORY.md`, `PHASE_HANDOFF.md`, `DECISIONS.md`. Source of truth for decisions.
- **L2 (Contracts):** `.cursor/agents/`, `.cursor/rules/`, `.cursor/skills/`. Define behavior.
- **L3 (Governance):** `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`. Root level contracts.

### Retention
- **L0:** Cleared on session reset.
- **L1:** Persisted in git. Permanent record of decisions.
- **L2:** Versioned with code. Updated as team evolves.
- **L3:** Root level, rarely changed.

## Access patterns
- **Read:** Agents must read `MEMORY.md` and `PHASE_HANDOFF.md` at session start.
- **Write:** Agents append to `MEMORY.md` when stack, architecture, or design choices are locked.
- **Sync:** Run `pnpm ai:sync` to broadcast L2/L3 changes to all clients.

## Where agents read/write
- **Read from:** `.nezam/workspace/prd/PRD.md`, `docs/plans/**`, `.nezam/memory/**`.
- **Write to:** `.nezam/memory/MEMORY.md` (decisions), `.nezam/memory/PHASE_HANDOFF.md` (phase gates).

## Example entries
- `[2026-05-10] NEZAM workspace upgraded — rationale: execute v2 governance — owner: PM-01`
- `[2026-05-12] Added PHASE_HANDOFF schema — rationale: comply with P1 request — owner: Antigravity`

## Active Stack Decisions


_(Append dated bullets when stack choices are locked.)_

- Format: `[YYYY-MM-DD] <decision> — rationale: <why> — owner: <agent>`
- [2026-05-10] NEZAM workspace upgraded — skills consolidated, 10 new tech stack skills, MCP registry, CLI orchestration, memory layers v2, token optimization, agent/skill alignment complete — rationale: execute v2 governance and routing upgrade baseline — owner: PM-01
- [2026-05-10] Phase 2 upgrades complete — settings-driven tool activation, `/Settings` command surface wiring, task routing fallback protocol, and end-to-end verification closed — rationale: finish PU-11..PU-15 routing system rollout — owner: PM-01
- [2026-05-10] Workspace full reorganization complete — docs/ restructured with memory/, prd/, wiki/, architecture/, specs/, plans/, templates/ folders; PRD v2 written; GitHub Wiki (9 pages) created; README rewritten with premium GitHub styling; all path references updated across CLAUDE.md, AGENTS.md, GEMINI.md, QWEN.md, rules, commands, scripts — rationale: clean slate for template-ready release — owner: Dorgham

## Locked Architecture Decisions

_(Append ADRs as one-liners; full ADRs live under [`docs/03_architecture/`](../architecture/) or documented architecture paths.)_

## Locked Design Decisions

_(Typography scale, token names, breakpoints — anything agents must not override without an amendment trail.)_

## Accepted Tradeoffs

_(Intentional compromises and when to revisit.)_

## Naming Glossary

- **MT-ID**: master task identifier (format: `MT-###`)
- **PT-ID**: phase task identifier (format: `PT-<phase>-<subphase>-<seq>`)
- **Phase gate**: readiness control before a phase transition
- **PU-ID**: pending upgrade checklist item (`PU-01` … in `PENDING_UPGRADE_TASKS.md`)

## Release Posture

_(SemVer trajectory, ship criteria, rollout notes when known.)_

## Agent Scorecards (Tier-1 Eval)

_(After Tier-1 agent work, append summaries per [EVAL_FRAMEWORK.md](../../.cursor/agents/EVAL_FRAMEWORK.md).)_

Agent: swarm-leader | Task: baseline-eval | Date: 2026-05-12
Accuracy: pass | Determinism: pass
Scope: pass | Evidence: pass
Notes: Baseline evaluation passed for swarm-leader.

Agent: subagent-controller | Task: baseline-eval | Date: 2026-05-12
Accuracy: pass | Determinism: pass
Scope: pass | Evidence: pass
Notes: Baseline evaluation passed for subagent-controller.

## Tooling

- **Drift recovery:** run `pnpm ai:sync`; verify with `pnpm ai:check` before relying on routed commands across clients.
- **Agent evaluation:** [EVAL_FRAMEWORK.md](../../.cursor/agents/EVAL_FRAMEWORK.md) — tiered personas, confidence thresholds, remediation triggers.

## External Companion Notes

_(Strategy summaries pasted from companion sessions.)_

- [2026-05-10] Workspace v2 upgrade complete:
  - Skills: merged 3, added 10, archived 3.
  - Agents: added spec-writer, prompt-engineer, client-onboarding-agent; archived 10 legacy specialists.
  - Systems: MCP registry, CLI orchestration, memory layers v2, token audit process.
  - Tech stack references are now wired through primary agent and skill lanes.

When using external chats (Grok/Qwen/Gemini/etc.), keep rolling progress suitable for uploads in [`docs/reports/progress/PROGRESS_REPORT.latest.md`](../../reports/progress/PROGRESS_REPORT.latest.md) and brief companions from [`CONTEXT.md`](./CONTEXT.md).

- **Companion chat pattern:** Paste `CONTEXT.md` + `MEMORY.md` (this file) + `PRD.md` excerpts + current phase prompt for continuity.
- 2026-05-10T15:02:40Z — commit: chore(workspace): complete PU-11 to PU-15 routing and docs refresh (files changed: 338)
- 2026-05-10T15:02:45Z — commit: chore(workspace): complete PU-11 to PU-15 routing and docs refresh (files changed: 338)
- 2026-05-10T15:02:51Z — commit: chore(workspace): complete PU-11 to PU-15 routing and docs refresh (files changed: 338)
- 2026-05-10T15:10:26Z — commit: chore(workspace): finalize phase-2 routing and README polish (files changed: 3)
- 2026-05-10T15:10:32Z — commit: chore(workspace): finalize phase-2 routing and README polish (files changed: 3)
- 2026-05-10T15:10:41Z — commit: chore(workspace): finalize phase-2 routing and README polish (files changed: 3)
