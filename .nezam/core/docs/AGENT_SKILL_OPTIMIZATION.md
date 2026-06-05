# Agent & Skill Optimization Framework

> **Goal:** Reduce task execution steps by 70% and accelerate development velocity by 3–4x through smarter agent design and skill consolidation.

---

## Problem Statement

**Current State:**
- v3.2-P1 Task T-V32-1-001: 7 explicit steps
  1. Read MASTER_TASKS.md for AC
  2. Open terminal
  3. Run pnpm ai:sync
  4. Run pnpm ai:check
  5. Check results manually
  6. Read CONTRIBUTING.md for commit format
  7. Commit + push (via Silent Ops)

- Total per task: 10–15 minutes (even with Silent Ops)
- Friction points: Manual checks, format lookups, AC verification

**Goal State:**
- One command: `/develop feature T-V32-1-001`
- Agent handles everything silently
- You just code
- Total per task: 3–5 minutes

---

## Solution: Smart Agent Orchestration

### Tier 1: Task-Focused Agents (Reduce Steps)

#### **Agent: Task Context Injector** ✨
**Purpose:** Eliminate manual AC lookup + format checking

When you run: `/develop feature T-V32-1-001`

Agent automatically:
1. ✅ Reads MASTER_TASKS.md → extracts AC
2. ✅ Reads CONTRIBUTING.md → extracts commit format
3. ✅ Reads relevant code files → extracts conventions
4. ✅ Opens IDE with:
   - AC checklist in sidebar
   - Sample commit message
   - Related code samples
   - Implementation hints from ADR

**Result:** No manual lookups needed

**Implementation:**
```bash
# .cursor/agents/task-context-injector.md

on: /develop feature <TASK_ID>

steps:
  1. Parse task ID
  2. fetch task AC from MASTER_TASKS.md
  3. fetch commit format from CONTRIBUTING.md
  4. fetch related ADRs from ARCHITECTURE.md
  5. scan codebase for related files
  6. generate IDE sidebar context
  7. open IDE with context injected
  8. output: "Ready. AC: [list]. Sample commit: [format]"
```

**Time savings:** 5 min → 1 min per task (**80% faster**)

---

#### **Agent: Gate-Runner Orchestrator** ✨
**Purpose:** Run all gates in parallel, fix failures automatically

When you run: `/silent commit "..."`

Agent:
1. ✅ Stages + commits + pushes (Silent Ops)
2. ✅ Triggers all gates in **parallel** (not sequential):
   - Lint (pnpm lint --fix auto-fixes)
   - Test (pnpm test --run)
   - Security (CodeQL + secrets scan)
   - Design (YAML verify, sync check)
3. ✅ Polls results every 5s
4. ✅ **Auto-fixes common issues:**
   - Lint errors → run `pnpm lint --fix` auto-commit
   - Missing CHANGELOG → auto-generate
   - Missing tests → suggest stubs
5. ✅ Output: "✅ All gates passed" or "❌ Fix needed: [suggestion]"

**Result:** Parallel execution + auto-fixes

**Implementation:**
```bash
# .cursor/agents/gate-runner-orchestrator.md

on: /silent commit

jobs:
  lint:
    run: pnpm lint --fix
    if_fail: auto-commit fixes
  test:
    run: pnpm test --run
    if_fail: suggest stubs
  security:
    run: github codeql + secrets
    if_fail: notify + block
  design:
    run: pnpm verify:yaml + ai:check
    if_fail: auto-fix YAML

result:
  all_pass: merge ready
  some_fail: auto-fix + re-run
  critical_fail: notify + block
```

**Time savings:** Sequential gates (15 min) → parallel (3 min) (**80% faster**)

---

#### **Agent: AC Validator** ✨
**Purpose:** Automatically verify task completion before merge

When PR is ready: Agent auto-checks

```
Task: T-V32-1-001 (pnpm ai:sync)

AC Checklist:
  ✅ pnpm ai:check drift < 0.5%    (drift: 0.2%)
  ✅ Orphaned skills = 0            (found: 0)
  ✅ verify:yaml exits 0            (passed)
  ✅ Commit message semantic        (feat(...))
  ✅ Tests passing                  (32/32)

Result: ✅ All AC met. Ready to merge.
```

**Result:** No manual AC verification needed

**Implementation:**
```bash
# .cursor/agents/ac-validator.md

on: PR created

steps:
  1. extract AC from task link
  2. for each AC:
     - run verification command
     - capture result
     - compare to expected
  3. output checklist with results
  4. if all pass: comment "✅ AC verified"
  5. if any fail: comment "❌ AC not met: [details]"
```

**Time savings:** Manual verification (5 min) → automatic (0 min) (**100% faster**)

---

### Tier 2: Phase-Level Agents (Reduce Coordination)

#### **Agent: Phase-Flow Optimizer** ✨
**Purpose:** Auto-manage task sequencing, dependencies, blocking

Knows:
- Which tasks block others
- Task time estimates
- Resource allocation
- Parallel vs sequential

When P1 starts: Agent optimizes execution order

```
P1 Optimized Sequence:
  1. T-V32-1-001 (pnpm ai:sync)        [2h, blocks: 1-002]
  2. T-V32-1-002 (audit skills)        [1h, parallel: 1-003]
  3. T-V32-1-003 (verify:yaml)         [1h, parallel: 1-002]
  4. T-V32-1-004 (extend schema)       [1h, depends: 1-001]
  5. T-V32-1-005 (promote sync)        [1h, depends: 1-001]
  6. T-V32-1-006 (write runbook)       [2h, depends: 1-005]
  7. T-V32-1-007 (verify husky)        [1h, depends: 1-006]

Recommendation: Do 1 first, then 2+3 in parallel, etc.
Estimated P1 time: 7 days (vs 7 days sequential) ✅
```

**Result:** Smart task ordering, fewer blockers

---

#### **Agent: Decision-Tree Runner** ✨
**Purpose:** Auto-execute multi-step decisions

Example: Setting up CI/CD gates

Scenario:
```
ADR-0002: CI/CD Gates

Branch: feature/v3.2-p2-ci-cd
Task: T-V32-2-001

Selected: Option A (2-tier gates)

Agent automatically:
  ✅ Creates .github/workflows/fast-gates.yml (4 min lint, test)
  ✅ Creates .github/workflows/nightly.yml (extended tests)
  ✅ Updates .nezam/silent.yaml → gates: [fast, nightly]
  ✅ Commits both files + ADR lock
  ✅ Creates PR + auto-tags with T-V32-2-001

Result: "✅ Option A implemented. PR #83 ready."
```

**Result:** Decision → implementation in seconds (not hours)

---

### Tier 3: Cross-Phase Agents (Reduce Context Switching)

#### **Agent: Dependency Resolver** ✨
**Purpose:** Auto-detect & manage cross-phase dependencies

Monitors:
- P2 (CI/CD) output → needed by P5 (Obs)
- P3 (Security) config → needed by P4 (Design)
- P4 (Design) schema → needed by P6 (Docs)

When dependency needed:
```
P5 (Observability) starts:

Agent checks:
  - Is P2 (CI/CD gates) complete? YES ✅
  - Is P3 (Security) complete? NO ⏳
  - Is P4 (Design) complete? NO ⏳

Action:
  - P5 can start (P2 dependency met)
  - Wait on P3 for security config (soft blocker)
  - P4 doesn't block P5 (independent)

Output: "P5 ready to start. Waiting on P3 security config (ETA: 3h)"
```

**Result:** No manual dependency checking

---

#### **Agent: Cross-Phase Validator** ✨
**Purpose:** Catch integration issues early

When any phase completes: Agent checks for conflicts

```
P2 (CI/CD) complete:
P3 (Security) running:

Agent checks:
  - Does P2 GitHub Actions conflict with P3 secrets scanning? NO ✅
  - Does P2 release config conflict with P3 compliance? MAYBE ⚠️
    (Suggests: Add compliance gate before release)
  - Is P3 blocking P2 merge? NO ✅

Output: "✅ P2 integration clean. 1 suggestion: add compliance gate."
```

**Result:** Issues caught before they cascade

---

## Optimized Skill Structure

### Current Skill Problem
- Too many specialized skills
- Task requires loading multiple skills
- Skills don't coordinate

### Optimized Skill Design
Each skill is **ultra-focused** + **auto-loads dependencies**

#### **Skill: v3.2-p1-foundation** 📦 (CONSOLIDATED)
```
Replaces: 7 individual task skills
Includes:
  ├── Task template (all 7 AC)
  ├── Commit format enforcer
  ├── Husky pre-commit hook
  ├── Sync-drift checker
  ├── Orphaned skill auditor
  ├── YAML verifier
  ├── Agent-status schema
  └── Runbook writer

Usage:
  /skill v3.2-p1-foundation
  → Loads ALL tools for entire phase
  → No individual task skill loading needed

Benefit: Single skill load = entire phase ready
```

#### **Skill: v3.2-p2-cicd** 📦 (CONSOLIDATED)
```
Includes:
  ├── GitHub Actions template generator
  ├── semantic-release configurator
  ├── Vercel deployment setup
  ├── PR gate validator
  └── Release automation

Usage:
  /skill v3.2-p2-cicd
  → Ready to implement all 6 tasks

Benefit: No individual workflow skill loading
```

#### **Skill: phase-flow-optimizer** 🤖 (NEW AGENT SKILL)
```
Auto-invoked when phase starts

Responsibilities:
  ├── Analyze task dependencies
  ├── Suggest optimal execution order
  ├── Monitor time estimates
  ├── Flag blockers early
  └── Rebalance if issues found

Benefit: Smart task sequencing (reduce waiting)
```

---

## Step Reduction Analysis

### Baseline (Current)

**Task T-V32-1-001: pnpm ai:sync**

```
1. cd /path
2. cat MASTER_TASKS.md | grep T-V32-1-001
3. Read AC manually
4. cat CONTRIBUTING.md | grep commit format
5. Read format manually
6. pnpm ai:sync
7. pnpm ai:check (manually run)
8. Review results
9. Read commit format again
10. Compose commit message
11. git add . (or via Silent Ops)
12. git commit (or via Silent Ops)
13. Verify gates in GitHub
14. Check AC met before merge
15. PR review

Total steps: 15
Total time: 10–15 min
Friction: 8 manual steps
```

### Optimized (with Agents + Consolidated Skills)

```
1. /develop feature T-V32-1-001
   → Task Context Injector loads AC + format + samples
   → IDE opens with context sidebar

2. [You code]

3. /silent commit "T-V32-1-001: ..."
   → Gate Runner runs all gates in parallel
   → Auto-fixes lint errors
   → Suggests test stubs
   → Polls results silently

4. /silent merge
   → AC Validator auto-checks all AC
   → Silent Ops merges if all pass
   → PR auto-links to task

Total steps: 3
Total time: 3–5 min
Friction: 0 manual steps
Automation: 100%
```

**Reduction: 15 steps → 3 steps = 80% fewer steps**

---

## Smart Skill Auto-Loading

### Problem
You run: `/develop feature T-V32-2-001` (GitHub Actions setup)
- Skill v3.2-p2-cicd needs to load
- But where are the helpers it needs?
- Do you load them separately?

### Solution: Dependency Graph + Auto-Loading

```bash
# .nezam/skill-dependencies.yaml

v3.2-p1-foundation:
  depends_on:
    - agent:task-context-injector
    - agent:gate-runner-orchestrator
    - agent:ac-validator
  loads_after: [never — P1 must start first]

v3.2-p2-cicd:
  depends_on:
    - agent:gate-runner-orchestrator
    - agent:phase-flow-optimizer
    - agent:dependency-resolver
  loads_after: [v3.2-p1-foundation, adr-decision-accelerator]
  
v3.2-p3-security:
  depends_on:
    - agent:gate-runner-orchestrator
    - agent:cross-phase-validator
  loads_after: [v3.2-p1-foundation, adr-decision-accelerator]

adr-decision-accelerator:
  depends_on:
    - agent:decision-tree-runner
  loads_after: [never — can run any time]
```

**Usage:**

```bash
/develop feature T-V32-2-001
  → Agent detects P2 task
  → Auto-loads: v3.2-p2-cicd skill
  → Skill auto-loads: phase-flow-optimizer agent
  → Everything ready
  → Zero manual skill loading

vs.

/skill v3.2-p2-cicd
/agent phase-flow-optimizer
/agent dependency-resolver
(manual loading = 3 commands)
```

---

## Agent Workflow Diagram

```
User Input
  ↓
/develop feature T-V32-1-001
  ↓
┌─────────────────────────────────────────┐
│ Task Context Injector                   │
│ ─────────────────────────────────────── │
│ • Parse task ID                         │
│ • Load AC from MASTER_TASKS.md          │
│ • Load commit format from CONTRIBUTING  │
│ • Load related ADRs                     │
│ • Scan codebase for examples            │
│ • Open IDE with context sidebar         │
│ Result: "Ready. AC: [list]"             │
└─────────────────────────────────────────┘
  ↓
[You code + save]
  ↓
/silent commit "T-V32-1-001: ..."
  ↓
┌─────────────────────────────────────────┐
│ Gate Runner Orchestrator                │
│ ─────────────────────────────────────── │
│ • Stage + commit + push (Silent Ops)    │
│ • Run gates in PARALLEL:                │
│   ├─ Lint (with auto-fix)               │
│   ├─ Test                               │
│   ├─ Security                           │
│   └─ Design                             │
│ • Poll results silently (5s intervals)  │
│ • Auto-fix common failures              │
│ Result: "✅ Gates passed" or "Fix: [X]" │
└─────────────────────────────────────────┘
  ↓
/silent merge
  ↓
┌─────────────────────────────────────────┐
│ AC Validator                            │
│ ─────────────────────────────────────── │
│ • Extract AC from task                  │
│ • Verify each AC (auto):                │
│   ├─ pnpm ai:check < 0.5%               │
│   ├─ Orphaned skills = 0                │
│   ├─ Tests passing                      │
│   └─ Commit format semantic             │
│ • Output checklist with results         │
│ Result: "✅ AC verified. Ready to merge" │
└─────────────────────────────────────────┘
  ↓
✅ Merged + Released + Deployed
```

---

## Implementation Plan

### Phase A: Core Agents (3 agents, 6 hours)

**Agents to build:**
1. **Task Context Injector** (2h)
2. **Gate Runner Orchestrator** (2h)
3. **AC Validator** (2h)

**Where to save:**
```
.cursor/agents/
  ├── task-context-injector.md
  ├── gate-runner-orchestrator.md
  └── ac-validator.md
```

**Usage:**
```bash
# All 3 auto-invoked by /develop + /silent commands
# Zero manual invocation needed
```

---

### Phase B: Phase-Level Agents (2 agents, 4 hours)

**Agents to build:**
1. **Phase-Flow Optimizer** (2h)
2. **Decision-Tree Runner** (2h)

**Where to save:**
```
.cursor/agents/
  ├── phase-flow-optimizer.md
  └── decision-tree-runner.md
```

**Usage:**
```bash
# Auto-invoked by /develop phase-kickoff
# Auto-invoked by /decide ADR-X "Option Y"
```

---

### Phase C: Cross-Phase Agents (2 agents, 4 hours)

**Agents to build:**
1. **Dependency Resolver** (2h)
2. **Cross-Phase Validator** (2h)

**Where to save:**
```
.cursor/agents/
  ├── dependency-resolver.md
  └── cross-phase-validator.md
```

**Usage:**
```bash
# Auto-invoked when phase completes
# Runs in background, posts findings
```

---

### Phase D: Skill Consolidation (6 hours)

**Consolidate into phase-level skills:**
```
.cursor/skills/
  ├── v3.2-p1-foundation.md (all 7 tasks + tools)
  ├── v3.2-p2-cicd.md (all 6 tasks + tools)
  ├── v3.2-p3-security.md (all 6 tasks + tools)
  ├── v3.2-p4-design-bridge.md (all 7 tasks + tools)
  ├── v3.2-p5-obs-content.md (all 7 tasks + tools)
  └── v3.2-p6-docs-qa.md (all 8 tasks + tools)

Remove: All 38 individual task skills
Add: 6 consolidated phase skills
Result: Skill management 6x simpler
```

**Create dependency graph:**
```
.nezam/skill-dependencies.yaml
  → Auto-loads required agents + skills
  → No manual coordination needed
```

---

## Speed Gains Summary

| Metric | Before | After | Gain |
|--------|--------|-------|------|
| Steps per task | 15 | 3 | 80% fewer |
| Time per task | 10–15 min | 3–5 min | 66% faster |
| AC verification | 5 min (manual) | 0 min (auto) | 100% faster |
| Gate execution | 15 min (sequential) | 3 min (parallel) | 80% faster |
| Lint errors | 5 min (fix manually) | 30s (auto-fix) | 90% faster |
| Task setup | 5 min (read, format) | 1 min (injected) | 80% faster |
| Phase setup | 30 min (coordinate) | 5 min (auto-optimize) | 83% faster |
| Dependency check | 10 min (manual) | 0 min (auto-detect) | 100% faster |

---

## New Developer Experience

### Current Onboarding (Bad)
```
Day 1: Learn Silent Ops (1 hour)
Day 2: Learn 7 task skills (2 hours)
Day 3: Learn commit format (30 min)
Day 4: First task (read, understand, code, commit) = 15 min
Total onboarding: 3.5+ hours to do first task
```

### Optimized Onboarding (Good)
```
Day 1: Learn 3 commands (/develop, /silent commit, /silent merge) = 5 min
Day 1: First task (command runs + context injected) = 5 min
Total onboarding: 10 minutes
(7x faster onboarding)
```

---

## Parallel Phase Execution

With optimized agents, phases run truly in parallel:

```
Week 1:  P1 → 7 days (tasks 1-7)
         ↓
         At Day 3: Start P2+P3+P4 agents

Week 2:  P2 → 6 days (tasks 1-6) [Started Day 3]
         P3 → 6 days (tasks 1-6) [Started Day 3]
         P4 → 7 days (tasks 1-7) [Started Day 3]
         ↓
         At Day 10: All P2/P3/P4 complete

Week 3:  P5 → 7 days (tasks 1-7) [Depends on P2]
         P6 → 8 days (tasks 1-8) [Partial, parallel]
         ↓
         At Day 21: P5+P6 complete

Week 4:  Ship + Deploy (Day 28)

Result: 28 days (4 weeks) vs 56 days (8 weeks)
        = 50% time savings
        + Zero manual coordination
        + All gates always passing
```

---

## Implementation Checklist

### Agent Development (10 hours total)

- [ ] Task Context Injector (2h)
- [ ] Gate Runner Orchestrator (2h)
- [ ] AC Validator (2h)
- [ ] Phase-Flow Optimizer (2h)
- [ ] Decision-Tree Runner (2h)
- [ ] Dependency Resolver (2h)
- [ ] Cross-Phase Validator (2h)

### Skill Consolidation (6 hours)

- [ ] Consolidate into 6 phase skills
- [ ] Remove 38 individual task skills
- [ ] Create skill-dependencies.yaml
- [ ] Test auto-loading

### Integration (4 hours)

- [ ] Wire agents into /develop command
- [ ] Wire agents into /silent commands
- [ ] Wire agents into /decide command
- [ ] Test end-to-end workflow

---

## Next Steps

1. **Approve agent roadmap** (which agents to build first)
2. **Start with Phase A agents** (highest ROI: 80% step reduction)
3. **Build in parallel** while v3.2-P1 runs (non-blocking)
4. **Deploy Phase B agents** by Day 8
5. **Deploy Phase C agents** by Day 15

---

## Expected Outcome

✅ **80% fewer steps per task** (15 → 3)  
✅ **66% faster task execution** (10–15 min → 3–5 min)  
✅ **Zero manual AC verification** (100% automated)  
✅ **Zero manual decision implementation** (seconds, not hours)  
✅ **7x faster onboarding** (3.5h → 10 min)  
✅ **True parallel phase execution** (P2+P3+P4 simultaneous)  

**Result: v3.2 shipped in 4 weeks with 80% fewer manual steps.**

