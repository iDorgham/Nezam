# NEZAM Swarm System — Cursor Fix Prompts
> One prompt per identified architectural con. Paste each into Cursor chat.
> Source contracts: `.cursor/rules/`, `.cursor/agents/`, `.cursor/rules/sdd-pipeline-v2.mdc`

---

## FIX 01 — Orchestration Overhead / Routing Bottleneck

**Problem:** `swarm-leader` → `deputy-swarm-leader` → `subagent-controller` is a 3-layer meta-stack. A single bad routing decision cascades and stalls execution.

```prompt
You are PM-01 (swarm-leader). Audit the orchestration chain defined across:
- `.cursor/agents/swarm-leader.md`
- `.cursor/agents/deputy-swarm-leader.md`
- `.cursor/agents/subagent-controller.md`

Your task:
1. Map the current 3-tier routing chain and identify every decision point where a task can stall (missing artifact, ambiguous owner, overlapping scope).
2. Define a FAST PATH rule: if a task can be completed by a single specialist with no cross-swarm dependency, route directly — skip both deputy and controller layers.
3. Define an ESCALATION THRESHOLD: only escalate to deputy when (a) two swarms claim overlapping write scope, or (b) a phase gate requires multi-swarm sign-off.
4. Add a TIMEOUT PROTOCOL: if a routing decision is not resolved in one agent turn, auto-replan with `replan` status and surface the blocker explicitly.
5. Write the updated routing logic as a new section "Fast Path Routing" in `.cursor/agents/subagent-controller.md`.
6. Do not change existing hardlock rules or gate checks.

Output: updated file diff for `subagent-controller.md` only.
```

---

## FIX 02 — Context Fragmentation Across Agents

**Problem:** Cross-domain decisions (SEO + design + content intersecting) get split across agents with no shared context protocol, producing locally correct but globally incoherent outputs.

```prompt
You are the lead-solution-architect. Review the current handoff contract at:
- `docs/workspace/context/AGENT_COMM_PROTOCOL.md` (if it exists)
- `.cursor/agents/subagent-controller.md` (Standardized Output Bundle section)
- `.cursor/rules/workspace-orchestration.mdc` (Memory layers section)

Your task:
1. Identify the 3 most common cross-domain decision points in the SDD pipeline where multiple swarms must share context simultaneously (example: SEO keyword decisions affecting both IA labels and design component naming).
2. Design a SHARED CONTEXT PACKET — a minimal JSON/Markdown structure passed between agents at phase boundaries containing: active_keywords, locked_urls, design_token_decisions, content_decisions_locked, open_questions.
3. Define WHERE this packet lives: propose `docs/workspace/context/PHASE_HANDOFF.md` as the canonical cross-agent context file, updated at every phase gate transition.
4. Add a rule to `.cursor/agents/subagent-controller.md`: "No agent may begin cross-domain work without reading the current PHASE_HANDOFF.md."
5. Create the template file at `docs/workspace/context/PHASE_HANDOFF.md` with all required fields.

Output: new file `PHASE_HANDOFF.md` + diff for `subagent-controller.md`.
```

---

## FIX 03 — Agent Sprawl (100+ agents, marginal value decay)

**Problem:** 100+ agent files exist. No invocation tracking. Maintenance cost grows linearly. Clarity degrades. The system is comprehensive on paper but unmeasured in practice.

```prompt
You are PM-01 (swarm-leader) acting as system auditor. Review the full agent list in `.cursor/agents/README.md` and all individual `.cursor/agents/*.md` files.

Your task:
1. Classify every agent into one of three tiers:
   - TIER 1 — Core (directly activated by SDD pipeline phases or slash commands)
   - TIER 2 — Specialist (activated on-demand for specific work types)
   - TIER 3 — Dormant (no clear activation trigger in any command, rule, or pipeline step)

2. For each Tier 3 agent, write a one-line justification for either:
   - ARCHIVE: move to `.cursor/agents/archive/` — not deleted, just inactive
   - PROMOTE: define an explicit activation trigger and add it to a command or rule

3. For Tier 1 agents, verify each has: role, activation trigger, output format, and at least one reference in `.cursor/commands/` or `.cursor/rules/`.

4. Produce a AGENT_AUDIT.md at `docs/workspace/context/AGENT_AUDIT.md` with:
   - Tier classification table
   - Archive list with rationale
   - Recommended activation trigger additions for any promoted agents

5. Do NOT delete or modify any agent files — classification only in this pass.

Output: `docs/workspace/context/AGENT_AUDIT.md`
```

---

## FIX 04 — Hardlock Rigidity Under Iteration

**Problem:** The SDD pipeline is linear. Real product cycles require mid-sprint rewinds (e.g., design discovery invalidates planning assumptions). Hardlocks block forward progress without providing a controlled rollback path.

```prompt
You are PM-01 (swarm-leader). Review the hardlock tables defined in:
- `.cursor/rules/workspace-orchestration.mdc` (Planning hardlock prerequisite, SDD hardlock prerequisites)
- `.cursor/rules/sdd-pipeline-v2.mdc` (all four product type hardlock tables)

Your task:
1. Add a ROLLBACK PROTOCOL section to `.cursor/rules/workspace-orchestration.mdc` that defines:
   - PARTIAL ROLLBACK: when a mid-phase discovery invalidates a specific upstream artifact only (e.g., design changes URL slugs → reopen IA step only, not full reset)
   - FULL REPLAN: when PRD scope changes — full pipeline reset, all gates re-verified
   - AMENDMENT: when a decision is refined but not reversed — append a dated decision record to the relevant artifact without re-running the full phase

2. Define the AMENDMENT LOG format: a `## Decision Amendments` section appended to any locked artifact with fields: date, changed_field, previous_value, new_value, reason, approved_by (PM-01).

3. Add an explicit rule: "Hardlocks block forward progress only — they never block backward amendment. Any phase artifact may be updated via the Amendment Protocol without triggering a full replan unless the change affects a downstream hardlock prerequisite."

4. Update the hardlock tables for all 4 product types to add a "Rollback Trigger" column specifying what change would require re-opening each phase.

Output: updated `.cursor/rules/workspace-orchestration.mdc` + updated `.cursor/rules/sdd-pipeline-v2.mdc` hardlock tables.
```

---

## FIX 05 — Multi-Tool Sync Drift (Manual `pnpm ai:sync`)

**Problem:** Syncing `.cursor/` to Claude, Kilo, OPENCODE requires a manual `pnpm ai:sync` step. Silent drift between tools is a live failure mode — one agent runs on a stale contract while another has the current version.

```prompt
You are the devops-manager and gitops-engineer working together. Review:
- `.cursor/rules/multi-tool-sync.mdc`
- The existing `pnpm ai:sync` and `pnpm ai:check` scripts (check `package.json` at repo root)

Your task:
1. Add a PRE-COMMIT HOOK that automatically runs `pnpm ai:sync` before any commit that touches files in `.cursor/commands/`, `.cursor/agents/`, `.cursor/skills/`, or `.cursor/rules/`. Use husky or a simple `.git/hooks/pre-commit` script.

2. Add a SYNC STATUS CHECK to the `/START all` command: when any tool boots with `/START all`, it should verify that the hash/timestamp of `.cursor/rules/workspace-orchestration.mdc` matches the mirror in its own tool directory (`CLAUDE.md`, `AGENTS.md`, etc.). If drift is detected, surface a warning: "⚠️ Sync drift detected — run `pnpm ai:sync` before proceeding."

3. Define a DRIFT SEVERITY SCALE in `.cursor/rules/multi-tool-sync.mdc`:
   - CRITICAL: rules or hardlock definitions differ between tools → block all commands
   - WARNING: agent descriptions differ → surface warning, allow commands
   - INFO: formatting differences only → auto-fix on next sync

4. Add a `pnpm ai:status` script that prints a one-line sync status for each tool mirror (✓ in sync / ⚠ drifted / ✗ missing).

Output: pre-commit hook file + updated `package.json` scripts section + updated `.cursor/rules/multi-tool-sync.mdc` drift severity section.
```

---

## FIX 06 — Prompt Engineering Debt (No Eval Framework)

**Problem:** Every agent file is an implicit prompt. No systematic eval exists. You don't know which agents perform vs. just exist. Quality floor is unknown.

```prompt
You are the lead-qa-architect and code-generation-supervisor working together. Review the agent file structure in `.cursor/agents/` and the subagent-controller output bundle format.

Your task:
1. Design an AGENT EVAL FRAMEWORK and write it to `.cursor/agents/EVAL_FRAMEWORK.md`. It must define:
   - EVAL DIMENSIONS: accuracy (does output match acceptance criteria?), determinism (does same input produce consistent output structure?), scope compliance (did the agent write only to its allowed_paths?), gate evidence (did it produce verifiable completion artifacts?)
   - EVAL TRIGGER: any agent completing a TIER 1 task (core pipeline) gets auto-evaluated by the code-generation-supervisor against these 4 dimensions
   - SCORING: pass/warn/fail per dimension, overall gate status

2. Add a minimal AGENT SCORECARD format — a 10-line markdown block appended to `docs/workspace/context/MEMORY.md` after each evaluated agent run:
   ```
   Agent: [name] | Task: [slug] | Date: [YYYY-MM-DD]
   Accuracy: pass/warn/fail | Determinism: pass/warn/fail
   Scope: pass/warn/fail | Evidence: pass/warn/fail
   Notes: [one line]
   ```

3. Add a rule to `.cursor/agents/subagent-controller.md`: "TIER 1 agent outputs require scorecard entry before the phase gate is marked complete."

4. Define a QUARTERLY REVIEW trigger in `.cursor/agents/EVAL_FRAMEWORK.md`: every 90 days, PM-01 reviews all scorecards and demotes any agent with >50% warn/fail rate to Tier 2 or archives it.

Output: new file `.cursor/agents/EVAL_FRAMEWORK.md` + diff for `subagent-controller.md` + scorecard format example.
```

---

## FIX 07 — Runtime Latency (Full Swarm for Single-Agent Tasks)

**Problem:** Every task spins up the full swarm pipeline even when a single specialist could handle it in one turn. No intelligence distinguishes swarm-worthy tasks from simple ones.

```prompt
You are PM-01 (swarm-leader) and subagent-controller. Review:
- `.cursor/agents/subagent-controller.md` (Routing Decision Criteria section)
- `.cursor/rules/workspace-orchestration.mdc`

Your task:
1. Define a TASK COMPLEXITY CLASSIFIER in `.cursor/agents/subagent-controller.md` with 3 execution modes:

   - MODE A — SINGLE AGENT: one specialist, one scope, no cross-swarm dependency, no phase gate transition. Examples: fix a bug in a specific file, write copy for one component, generate one API endpoint per an existing SPEC.md.
   
   - MODE B — TEAM EXECUTION: 2-4 agents, one swarm, shared context via PHASE_HANDOFF.md, no other swarms involved. Examples: design token system, build a feature slice, SEO audit of existing pages.
   
   - MODE C — FULL SWARM: multiple swarms, phase gate transition, new hardlock verification required. Examples: /PLAN all, /DEVELOP start, cross-cutting architectural change.

2. Define CLASSIFIER RULES: before routing any task, PM-01 evaluates:
   - Does it require writing to more than one swarm's directory scope? → Mode C
   - Does it require more than one specialist within one swarm? → Mode B
   - Everything else → Mode A

3. Add MODE declaration to the Standard Response Footer in `swarm-leader.md`:
   ```
   **Execution Mode**: [A / B / C]
   ```

4. Add a SPEED CONTRACT: Mode A tasks must complete in 1 agent turn. Mode B in 3 turns max. Mode C has no turn limit but requires explicit phase gate sign-off.

Output: updated `.cursor/agents/subagent-controller.md` classifier section + updated `swarm-leader.md` footer.
```

---

## Usage

Paste each prompt into Cursor chat in the order that matches your current priority.
Recommended sequence: **07 → 01 → 03 → 05 → 02 → 04 → 06**
(latency and sprawl first — they unblock the others)
