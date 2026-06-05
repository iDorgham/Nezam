# Agent Building Plan — Reducing Steps & Accelerating Development

> **Timeline:** 20 hours total | **Parallel with v3.2 execution** | **ROI: 80% step reduction**

---

## Phase A: Core Task Agents (High Impact, Build First)

### Agent 1: Task Context Injector
**File:** `.cursor/agents/task-context-injector.md`

**What it does:**
- You run: `/develop feature T-V32-1-001`
- Agent loads AC + commit format + code samples + related ADRs
- IDE opens with context sidebar
- Result: No more manual lookups

**Build time:** 2 hours

**Pseudocode:**
```
on: /develop feature <TASK_ID>

1. Parse task ID (T-V32-1-001)
2. Query MASTER_TASKS.md for task + AC
3. Query CONTRIBUTING.md for commit format
4. Query ARCHITECTURE.md for related ADRs
5. Scan codebase for related files
6. Extract code patterns from related tasks
7. Generate sidebar context:
   {
     AC: [list of acceptance criteria],
     CommitFormat: "feat(v3.2-P1): ...",
     RelatedADRs: [ADR-0001, ADR-0002],
     RelatedFiles: [file1, file2, ...],
     CodeSamples: [pattern1, pattern2, ...]
   }
8. Open IDE with context
9. Output: "Ready. AC: [X]. Sample commit: [Y]"
```

**Integration:**
- Wired to `/develop feature` command
- Auto-invokes on task start
- No manual invocation needed

**Time savings:** 5 min → 1 min per task

---

### Agent 2: Gate Runner Orchestrator
**File:** `.cursor/agents/gate-runner-orchestrator.md`

**What it does:**
- You run: `/silent commit "T-V32-1-001: ..."`
- Agent runs ALL gates in **parallel** (not sequential)
- Auto-fixes common issues (lint, missing files)
- Polls silently, outputs only on state change
- Result: 80% faster gate execution

**Build time:** 2 hours

**Pseudocode:**
```
on: /silent commit "<MSG>"

1. Stage + commit + push (Silent Ops)
2. Launch parallel gate jobs:
   
   Job: Lint
     run: pnpm lint --fix
     on_fail:
       - auto-fix
       - re-run
       - if still fail: notify
   
   Job: Test
     run: pnpm test --run
     on_fail:
       - suggest test stubs
       - notify
   
   Job: Security
     run: github codeql + secret-scanning
     on_fail:
       - notify + block
   
   Job: Design
     run: pnpm verify:yaml && pnpm ai:check
     on_fail:
       - auto-fix YAML if possible
       - notify

3. Poll all 4 jobs every 5 seconds
4. Track state changes
5. Output only on change:
   - "✅ Lint passed (1m 3s)"
   - "✅ Test passed (2m 14s)"
   - "✅ Security passed (1m 45s)"
   - "✅ Design passed (38s)"
   - "✅ All gates passed. Ready to merge."

6. If any fail:
   - Show which failed
   - Suggest fix
   - Auto-retry if auto-fixable
   - Output: "❌ Lint failed. Ran auto-fix. Re-running..."
```

**Integration:**
- Wired to `/silent commit` command
- Triggers after Silent Ops commit
- Parallel execution (vs GitHub Actions sequential)

**Time savings:** Sequential (15 min) → parallel (3 min)

---

### Agent 3: AC Validator
**File:** `.cursor/agents/ac-validator.md`

**What it does:**
- Automatically verifies all acceptance criteria before merge
- No manual AC checking
- Shows checklist with results
- Blocks merge if AC not met

**Build time:** 2 hours

**Pseudocode:**
```
on: PR ready / before /silent merge

1. Extract task ID from PR title
2. Query MASTER_TASKS.md for task AC
3. For each AC criterion:
   
   AC: "pnpm ai:check drift < 0.5%"
     - run: pnpm ai:check
     - capture: drift percentage
     - verify: drift < 0.5%
     - result: ✅ PASS (0.2%) or ❌ FAIL (1.2%)
   
   AC: "Orphaned skills = 0"
     - run: grep -r "skill:" .cursor/
     - count unused skills
     - result: ✅ PASS (0) or ❌ FAIL (3)
   
   AC: "Commit message semantic"
     - check: commit msg matches "feat(...)" or "fix(...)"
     - result: ✅ PASS or ❌ FAIL
   
   AC: "Tests passing"
     - run: pnpm test --run
     - result: ✅ PASS (32/32) or ❌ FAIL (1 failing)

4. Generate checklist:
   ✅ AC1: pnpm ai:check drift < 0.5% (0.2%)
   ✅ AC2: Orphaned skills = 0 (0 found)
   ✅ AC3: verify:yaml exits 0 (passed)
   ✅ AC4: Commit message semantic (feat(...))
   ✅ AC5: Tests passing (32/32)
   
5. If all pass:
   - Comment on PR: "✅ AC verified. Ready to merge."
   - Allow merge
   
6. If any fail:
   - Comment on PR: "❌ AC not met: [which ones]"
   - Block merge
   - Suggest fixes
```

**Integration:**
- Wired to `/silent merge` command
- Runs before merge allowed
- Blocks if AC not met

**Time savings:** Manual AC verification (5 min) → 0 min

---

## Phase B: Phase-Level Agents (Coordination)

### Agent 4: Phase-Flow Optimizer
**File:** `.cursor/agents/phase-flow-optimizer.md`

**What it does:**
- Analyzes task dependencies
- Suggests optimal execution order
- Monitors time estimates
- Flags blockers early
- Rebalances if issues

**Build time:** 2 hours

**Pseudocode:**
```
on: /develop phase-kickoff v3.2-p<N>

1. Read MASTER_TASKS.md for phase tasks
2. Build dependency graph:
   T-V32-1-001 (pnpm ai:sync)
     - duration: 2h
     - blocks: T-V32-1-002, T-V32-1-004, T-V32-1-005
   
   T-V32-1-002 (audit skills)
     - duration: 1h
     - depends_on: [T-V32-1-001]
     - parallel: T-V32-1-003
   
   ... (all 7 tasks in P1)

3. Compute critical path:
   T-V32-1-001 (2h) → T-V32-1-004 (1h) → T-V32-1-006 (2h)
   Total: 5h
   
   Parallel: T-V32-1-002 (1h), T-V32-1-003 (1h), T-V32-1-005 (1h)
   Total: 1h
   
   Critical path: 5h
   Optimized: Do 1 first, then 2+3 in parallel

4. Output recommendations:
   "Recommended sequence:
    1. T-V32-1-001 (2h) — blocks 3 others
    2. T-V32-1-002 + T-V32-1-003 (parallel, 1h each)
    3. T-V32-1-004 (1h) — depends on 1
    4. T-V32-1-005 (1h) — depends on 1
    5. T-V32-1-006 (2h) — depends on 5
    6. T-V32-1-007 (1h) — depends on 6
    
    Estimated P1 time: 7 days (critical path)
    (vs naive 7 days sequential)"

5. Monitor progress:
   - Track task completions
   - If task X is blocking Y and takes longer: adjust
   - If task can start early: suggest
   - Flag if on critical path + at risk

6. Output: "✅ P1 on track. 3 tasks parallel. ETA: Day 7."
```

**Integration:**
- Wired to `/develop phase-kickoff` command
- Runs when phase starts
- Continues monitoring throughout

**Time savings:** Manual coordination (30 min) → suggestions only

---

### Agent 5: Decision-Tree Runner
**File:** `.cursor/agents/decision-tree-runner.md`

**What it does:**
- Implements decisions immediately
- ADR selected → code generated + committed
- No manual implementation step

**Build time:** 2 hours

**Pseudocode:**
```
on: /decide ADR-<ID> "<OPTION>"

1. Load ADR from ARCHITECTURE.md (e.g., ADR-0002)
2. Find selected option (e.g., "Option A: 2-tier gates")
3. Look up implementation steps for this option
4. Execute implementation:
   
   For ADR-0002 Option A (2-tier gates):
   
   Step 1: Generate .github/workflows/fast-gates.yml
     - Template: .nezam/templates/github-actions-2tier.yml
     - Variables: {project: NEZAM, timeout: 600}
     - Output: .github/workflows/fast-gates.yml
   
   Step 2: Generate .github/workflows/nightly.yml
     - Template: .nezam/templates/github-actions-nightly.yml
     - Variables: {cron: "2 2 * * *"}
     - Output: .github/workflows/nightly.yml
   
   Step 3: Update .nezam/silent.yaml
     - Field: gates.standard
     - Value: [lint, test, security, design-gates, integration]
     - Also add: gates.nightly = [extended tests]
   
   Step 4: Lock ADR
     - Update ARCHITECTURE.md
     - Add: "ADR-0002 Decision: LOCKED (Option A selected by {user})"
     - Add: "Implementation date: {now}"
   
   Step 5: Commit
     - Message: "feat(v3.2-P2): CI/CD gates 2-tier [T-V32-2-001]"
     - Files: [.github/workflows/fast-gates.yml, nightly.yml, .nezam/silent.yaml, ARCHITECTURE.md]
   
   Step 6: Create PR
     - Title: "feat(v3.2-P2): CI/CD gates 2-tier [ADR-0002]"
     - Auto-tag: T-V32-2-001
     - Auto-link: ADR-0002

5. Output:
   "✅ ADR-0002 Option A implemented.
    Files generated:
      - .github/workflows/fast-gates.yml
      - .github/workflows/nightly.yml
    Updated:
      - .nezam/silent.yaml
      - ARCHITECTURE.md
    PR: #83 created"
```

**Integration:**
- Wired to `/decide ADR-<ID> "<OPTION>"` command
- Decision → implementation in seconds

**Time savings:** Decision + manual implementation (2 hours) → 2 minutes

---

## Phase C: Cross-Phase Agents (Integration)

### Agent 6: Dependency Resolver
**File:** `.cursor/agents/dependency-resolver.md`

**What it does:**
- Detects when dependencies are met
- Blocks phases that have unmet dependencies
- Suggests when dependent phases can start

**Build time:** 2 hours

**Usage:**
- Runs automatically when any phase completes
- Checks dependency graph
- Outputs: "P5 ready to start" or "P5 blocked waiting on [X]"

---

### Agent 7: Cross-Phase Validator
**File:** `.cursor/agents/cross-phase-validator.md`

**What it does:**
- Catches integration issues early
- Detects conflicts between phases
- Suggests fixes before they cascade

**Build time:** 2 hours

**Usage:**
- Runs automatically when phase completes
- Checks for conflicts
- Outputs: "✅ P2 integration clean" or "⚠️ Warning: [conflict]"

---

## Skill Consolidation (Phase D)

### Current State
```
38 individual task skills
+
7 phase coordination skills
+
Multiple helper skills
= Complex, hard to manage
```

### Optimized State
```
6 consolidated phase skills:
  - v3.2-p1-foundation.md (all 7 task tools)
  - v3.2-p2-cicd.md (all 6 task tools)
  - v3.2-p3-security.md (all 6 task tools)
  - v3.2-p4-design-bridge.md (all 7 task tools)
  - v3.2-p5-obs-content.md (all 7 task tools)
  - v3.2-p6-docs-qa.md (all 8 task tools)

+

1 dependency graph:
  - .nezam/skill-dependencies.yaml

= Simple, auto-coordinated
```

**Build time:** 6 hours

---

## Complete Agent Building Roadmap

### Week 1 (Days 1–7): v3.2-P1 + Phase A Agents
```
Mon–Fri (Days 1–5):
  - v3.2-P1 running (7 tasks)
  - Parallel: Build Agent 1 (Task Context Injector)

Sat–Sun (Days 6–7):
  - v3.2-P1 complete
  - Build Agent 2 (Gate Runner Orchestrator)
```

### Week 2 (Days 8–14): P2+P3+P4 + Phase B Agents
```
Mon–Wed (Days 8–10):
  - P2+P3+P4 running in parallel
  - Build Agent 3 (AC Validator)
  - Build Agent 4 (Phase-Flow Optimizer)

Thu–Fri (Days 11–12):
  - Build Agent 5 (Decision-Tree Runner)
  - Test all Phase A + B agents

Sat–Sun (Days 13–14):
  - Deploy Phase A agents to /develop + /silent
  - Deploy Phase B agents to /develop phase-kickoff + /decide
```

### Week 3 (Days 15–21): P5+P6 + Phase C Agents
```
Mon–Tue (Days 15–16):
  - P5 + P6 running
  - Build Agent 6 (Dependency Resolver)
  - Build Agent 7 (Cross-Phase Validator)

Wed–Fri (Days 17–19):
  - Deploy Phase C agents
  - Run skill consolidation
  - Test end-to-end

Sat–Sun (Days 20–21):
  - QA all agents
  - Polish documentation
```

### Week 4 (Days 22–28): Ship
```
Mon–Wed (Days 22–24):
  - P5 + P6 complete
  - Deploy Phase C agents
  - Final QA

Thu (Day 25):
  - Release candidate ready
  - Full testing

Fri–Sun (Days 26–28):
  - Ship v3.2 to production
  - Monitor agents
  - Celebrate 🎉
```

---

## Success Metrics

- [ ] **Agent 1 (Task Context Injector):** 80% step reduction per task
- [ ] **Agent 2 (Gate Runner Orchestrator):** 80% faster gate execution (parallel)
- [ ] **Agent 3 (AC Validator):** 100% automated AC verification
- [ ] **Agent 4 (Phase-Flow Optimizer):** Smart task sequencing
- [ ] **Agent 5 (Decision-Tree Runner):** Decision → implementation in seconds
- [ ] **Agent 6 (Dependency Resolver):** Zero manual dependency checking
- [ ] **Agent 7 (Cross-Phase Validator):** Early detection of integration issues
- [ ] **v3.2 execution:** 4 weeks (vs 8 weeks baseline)
- [ ] **All phases:** Running with zero manual coordination

---

## Approval Checklist

- [ ] Approve Agent roadmap (Phase A → B → C)
- [ ] Approve Phase A agent builds (start immediately)
- [ ] Approve skill consolidation plan
- [ ] Approve parallel execution with agents
- [ ] Approve Week 1–4 timeline

**Ready to build?**

