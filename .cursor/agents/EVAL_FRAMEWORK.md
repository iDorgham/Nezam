---
version: 1.0.0
certified: false
updated: 2026-05-12
changelog: []
---

# Agent evaluation framework (NEZAM)

Lightweight quality floor for **implicit prompts** in `.cursor/agents/*.md`. Not a replacement for human review on high-risk changes.

## Eval dimensions

| Dimension | Question |
|-----------|----------|
| **Accuracy** | Does the output satisfy stated acceptance criteria and specs? |
| **Determinism** | Does the same input class produce a **consistent** output structure (sections, tables, file lists)? |
| **Scope compliance** | Did the agent write **only** within `allowed_paths` / delegated scope (no drive-by edits)? |
| **Gate evidence** | Are completion artifacts **verifiable** (paths, commands run, scan outputs under `docs/reports/**`)? |

## Eval trigger

Any agent completing a **TIER 1** (core pipeline) task — SDD phase lead work, gate transitions, or slash-command-owned slices — is **auto-evaluated** by **code-generation-supervisor** (or PM-01 delegate) against the four dimensions **before** the phase gate is marked complete.

## Scoring (per dimension)

- **pass** (100 points) — meets bar; no material gap  
- **warn** (50 points) — usable but needs follow-up (document in Notes)  
- **fail** (0 points) — does not meet bar; gate **cannot** close until fixed or explicitly replanned  

**Overall gate status:** `open` if any dimension is `fail` (or Confidence Score < 50%); `at_risk` if any `warn` and no `fail` (Confidence Score 50%-89%); `closed` if all `pass` (Confidence Score ≥ 90%).

## Confidence Scoring Model

To provide a precise quality metric, each Tier 1 task run receives a **Confidence Score (0% - 100%)** calculated mathematically based on the weights of the four core evaluation dimensions:

$$ \text{Confidence Score} = (0.35 \times \text{Accuracy}) + (0.25 \times \text{Determinism}) + (0.20 \times \text{Scope Compliance}) + (0.20 \times \text{Gate Evidence}) $$

### Scoring Thresholds
- **Elite (🏆): 90% - 100%** (All dimension pass, or at most one minor warn on non-accuracy/non-determinism dimensions)
- **Certified (✅): 75% - 89%** (Safe to deploy, minimal warnings)
- **Provisional (⚠️): 50% - 74%** (Usable but requires manual overrides and near-term remediations)
- **Uncertified (❌): <50%** (Fails gate checks, progression strictly blocked)

## Agent scorecard (append to `.nezam/core/memory/MEMORY.md`)

After each evaluated Tier 1 run, append this **10-line block** under a `## Agent scorecards` heading (create heading once):

```text
Agent: [name] | Task: [slug] | Date: [YYYY-MM-DD]
Accuracy: pass/warn/fail | Determinism: pass/warn/fail
Scope: pass/warn/fail | Evidence: pass/warn/fail
Notes: [one line]
```

### Example

```text
Agent: lead-uiux-designer | Task: phase-05-design-lock | Date: 2026-05-10
Accuracy: pass | Determinism: pass
Scope: pass | Evidence: warn
Notes: DESIGN.md linked but no lighthouse baseline path yet — run /SCAN perf next session.
```

## Quarterly review trigger

Every **90 calendar days**, **PM-01** (`swarm-leader`):

1. Reads all scorecards under `MEMORY.md` for the window.
2. Flags any agent with **>50%** `warn` or `fail` across runs (minimum 3 evaluated runs).
3. **Demote** habitual underperformers from Tier 1 routing to Tier 2 (on-demand) or **retire** the agent file (prefer a git-tracked rename/remove in a dedicated PR) pending human review — **no silent deletion**.

Document the outcome in `.nezam/core/memory/AGENT_AUDIT.md` (next revision).

## References

- Output bundle expectations: `.cursor/agents/subagent-controller.md`
- Communication footer: `.nezam/core/memory/AGENT_COMM_PROTOCOL.md`
