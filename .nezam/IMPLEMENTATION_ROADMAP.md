# Implementation Roadmap — Silent Ops → Full Acceleration

> **Goal:** Go from current 8-week pipeline to 4-week production-ready v3.2.

---

## Phase 0: Foundation (Ready Now)

✅ **Status:** Complete, in place

### Files
- `.cursor/commands/silent-ops.md` — command interface
- `.cursor/agents/silent-orchestration-manager.md` — automation logic
- `.nezam/silent.yaml` — configuration
- `.github/workflows/silent-*.yml` (4 workflows)
- `.nezam/core/docs/SILENT_QUICK_START.md` — user guide

### Action
```bash
/silent unlock v3.2-p1
# Start using Silent Ops immediately
```

### Time Saved
- **Zero git commands** for entire v3.2-P1
- **2x faster** commit/PR/merge cycle

---

## Phase 1: Immediate (Days 2–3)

⚡ **Effort:** Low | **Impact:** Massive (14 days saved)

### 1A. Enable Parallel Lanes for P2+P3+P4

**File:** `.cursor/agents/parallel-lane-coordinator.md` (create)

```markdown
# Agent: Parallel Lane Coordinator

Responsibilities:
- Launch P2 (CI/CD) agent with tasks
- Launch P3 (Security) agent with tasks
- Launch P4 (Design bridge) agent with tasks
- Monitor progress via `.nezam/progress/lane-{a,b,c}.yaml`
- Block P5 until P1+P2/P3/P4 complete
- Validate no conflicting changes on P5 start
```

**Command:**
```bash
/develop start-parallel-lanes v3.2-p2 v3.2-p3 v3.2-p4
```

**Time to implement:** 2 hours  
**Time saved:** 14 days

---

### 1B. Generate Task Templates for P2–P6

**File:** `.nezam/templates/` directory structure (create)

```
.nezam/templates/
├── v3.2-p2/
│   ├── github-actions-gates.yml
│   ├── semantic-release.json
│   └── vercel-deploy.yml
├── v3.2-p3/
│   ├── codeql-config.yml
│   ├── dependabot.yml
│   └── secret-scanning.yml
├── v3.2-p4/
│   ├── figma-mcp-bridge.ts
│   ├── design-token-sync.sh
│   └── schema-v2.json
├── v3.2-p5/
│   ├── sentry-config.js
│   ├── vercel-analytics.yml
│   └── observability-setup.md
└── v3.2-p6/
    ├── qa-checklist.md
    ├── release-notes-template.md
    └── deployment-validation.sh
```

**Command:**
```bash
/develop template T-V32-2-001
# → Generates + opens GitHub Actions starter
```

**Time to implement:** 6 hours (batch all templates)  
**Time saved:** 1 day (task startup 50% faster)

---

## Phase 2: Week 1 (Days 4–7)

⚡⚡ **Effort:** Medium | **Impact:** High (1.5–2 days)

### 2A. Async ADR Decision Framework

**File:** `.cursor/agents/adr-decision-accelerator.md` (create)

```markdown
# Agent: ADR Decision Accelerator

Flow:
1. Generate ADR with 3 credible options
   - Include pros/cons/cost for each
   - Option A (recommended)
   - Option B (conservative)
   - Option C (aggressive)

2. Wait for `/decide ADR-{id} "Option X"`

3. Auto-implement:
   - Lock decision in ADR
   - Update ARCHITECTURE.md
   - Wire implementation
   - Move phase forward
   - Log decision + rationale

Example ADRs:
- ADR-0002: CI/CD gates (2-tier vs all vs tiered)
- ADR-0003: Security scanning (GitHub-native vs external)
- ADR-0004: Observability (Sentry + Vercel vs PostHog)
- ADR-0005: Design bridge (Figma MCP vs local-first)
```

**Command:**
```bash
/decide ADR-0002 "Option A: 2-tier gates"
# → Decision locked, implementation begins
```

**Time to implement:** 2 hours  
**Time saved:** 1.5 days (per-decision: 2 hours → 15 min)

---

### 2B. Nightly Health Checks

**File:** `.github/workflows/nightly-health-check.yml` (create)

```yaml
name: Nightly Health Check
on:
  schedule:
    - cron: '2 2 * * *'  # 2 AM UTC daily

jobs:
  health:
    - pnpm verify:yaml
    - pnpm ai:check
    - pnpm design:check
    - pnpm test --run
    - Check MASTER_TASKS.md for stale items
    - Check .nezam/logs/ for errors
    - Post to Slack #dev
```

**Time to implement:** 1 hour  
**Time saved:** 1 day (catch issues early)

---

## Phase 3: Week 2 (Days 8–14)

⚡ **Effort:** Medium | **Impact:** Medium (1–2 days)

### 3A. Batch Code Review (Post-P1)

**File:** `.cursor/agents/batch-code-reviewer.md` (create)

```markdown
# Agent: Batch Code Reviewer

After all P1 PRs open:

/silent batch-review

Collects all 7 PRs:
1. Reads full context + dependencies
2. Runs unified linting + testing
3. Generates cross-PR analysis:
   - Dependency conflicts
   - Squash recommendations
   - Parallel opportunities
4. Posts unified feedback
5. You approve all 7 at once
```

**Time to implement:** 1 hour  
**Time saved:** 2 days (deep review in one session)

---

### 3B. Interactive Phase Kickoff

**File:** `.cursor/commands/develop-kickoff.md` (extend)

```bash
/develop phase-kickoff v3.2-p2

Output:
╔════════════════════════════════════════╗
║ v3.2-P2: CI/CD Pipeline               ║
║ Status: 0 of 6 tasks done              ║
╠════════════════════════════════════════╣
║ T-V32-2-001  [  ] Gates strategy       ║
║              AC: 2-tier + nightly       ║
║              Est: 2h  Risk: Low         ║
║              [START] [DEFER] [BLOCK]   ║
└────────────────────────────────────────┘

Click [START] → /silent unlock + opens IDE
```

**Time to implement:** 1 hour  
**Time saved:** 0.5 day (context setup faster)

---

## Phase 4: Week 3+ (Ongoing Optimizations)

⚡ **Effort:** Low | **Impact:** Low-Medium

### 4A. Linear/Asana Auto-Sync

**File:** `.nezam/silent.yaml` extensions

```yaml
integrations:
  linear:
    enabled: true
    api_key: ${{ secrets.LINEAR_API_KEY }}
    status_mapping:
      in_review: "In Review"
      merged: "Done"
      deployed: "Deployed"
```

**Time to implement:** 2 hours  
**Time saved:** 0.5 day (eliminate manual task updates)

---

### 4B. Rollback Automation

**File:** `.github/workflows/deployment-health-check.yml` (create)

```yaml
After Vercel deploy:
1. Wait 5 min for Sentry/analytics
2. Check error rate spike
3. If error_rate > baseline + 10%:
   → Auto-revert
   → Post to Slack
   → Create incident
```

**Time to implement:** 2 hours  
**Time saved:** 1 day (auto-recovery vs manual firefighting)

---

### 4C. Time-Box Escalation

**File:** `.cursor/agents/task-watchdog.md` (create)

```markdown
# Agent: Task Watchdog

On task start, set timer (from MASTER_TASKS estimate)

After time expires (if not committed):
  Escalation card:
  [EXTEND 30MIN] [EXTEND 1H] [GET HELP] [DEFER] [MARK DONE]

If [GET HELP]:
  → Post task to #dev with context
  → Tag available agents
  → Flag as blocker
```

**Time to implement:** 2 hours  
**Time saved:** 1.5 days (prevent rabbit holes)

---

### 4D. Fast-Path Approvals

**File:** `.cursor/agents/silent-orchestration-manager.md` (extend)

When PR gates pass:

```
✅ All gates passed
PR: https://github.com/.../pull/82

[APPROVE & MERGE] [NEEDS CHANGES] [WATCH]
```

You click button → agent approves + merges on GitHub

**Time to implement:** 1 hour  
**Time saved:** 0.3 days (skip GitHub UI)

---

## Implementation Timeline

```
DAY 1:      ✅ Silent Ops ready (use immediately with P1)
            ✅ Start P1: /silent unlock v3.2-p1

DAY 2-3:    ⚡ Parallel lanes coordinator
            ⚡ Task templates (batch all 6 phases)
            → Start P2+P3+P4 agents on Day 3

DAY 4-7:    ⚡ ADR decision accelerator
            ⚡ Nightly health checks
            ✅ P1 complete (Day 7)

DAY 8-14:   ⚡ Batch code review (all P1 PRs)
            ⚡ Interactive phase kickoff
            ✅ P2/P3/P4 60% done
            → ADR decisions from Phase 1

DAY 15-21:  ⚡ Linear sync (optional)
            ⚡ Rollback automation
            ✅ P2/P3/P4 complete
            → P5 + P6 begin

DAY 22-28:  ⚡ Time-box escalation
            ⚡ Fast-path approvals
            ✅ P5 + P6 complete
            → Release candidate ready

DAY 29-30:  ✅ Ship + deploy
            ✅ v3.2 in production
```

**Total: 4–5 weeks (vs 8 weeks baseline)**

---

## Effort Breakdown

| Phase | Optimization | Setup Time | Ongoing |
|-------|---|---|---|
| 0 | Silent Ops | ✅ Done | Zero |
| 1A | Parallel lanes | 2h | Zero |
| 1B | Task templates | 6h | Zero |
| 2A | ADR accelerator | 2h | 30s per decision |
| 2B | Health checks | 1h | Fully automated |
| 3A | Batch review | 1h | 1h per phase |
| 3B | Phase kickoff | 1h | Fully automated |
| 4A | Linear sync | 2h | Fully automated |
| 4B | Rollback auto | 2h | Fully automated |
| 4C | Time-box watchdog | 2h | Fully automated |
| 4D | Fast approvals | 1h | 10s per PR |
| **Total** | **All** | **20h setup** | **Mostly automatic** |

---

## ROI Analysis

**Setup Investment:** 20 hours  
**Time Saved:** 23 days × 8 hours = 184 hours  
**ROI:** 184 / 20 = **9.2x return**

**Also saves:**
- 250+ manual git commands
- 500+ manual steps
- Context switching overhead
- Debugging firefighting (rollback automation)
- Scope creep (time-box escalation)

---

## Quick Decision Matrix

### Must Do (High ROI, Low effort)
- ✅ Silent Ops (done)
- ✅ Parallel lanes (2h → 14 days saved)
- ✅ Task templates (6h → 1 day saved)

### Should Do (Medium ROI, medium effort)
- ✅ ADR accelerator (2h → 1.5 days saved)
- ✅ Health checks (1h → 1 day saved)
- ✅ Batch review (1h → 2 days saved)

### Nice to Have (Low ROI, low effort)
- ✅ Phase kickoff (1h → 0.5 day saved)
- ✅ Linear sync (2h → 0.5 day saved)
- ✅ Rollback auto (2h → 1 day saved)
- ✅ Time-box watchdog (2h → 1.5 days saved)
- ✅ Fast approvals (1h → 0.3 day saved)

---

## Recommendation

**Implement in 3 batches:**

**Batch 1 (Days 2–3):** Parallel lanes + Templates = 8h setup, **15 days saved**

**Batch 2 (Days 4–7):** ADR accelerator + Health checks = 3h setup, **2.5 days saved**

**Batch 3 (Days 8–14):** Batch review + Phase kickoff = 2h setup, **2.5 days saved**

**Total:** 13 hours setup → **20+ days saved** → v3.2 in **4–5 weeks**

---

## Go Live Instruction

```bash
# Start now (immediately)
/silent unlock v3.2-p1

# Day 3 (after templates ready)
/develop start-parallel-lanes v3.2-p2 v3.2-p3 v3.2-p4

# Day 8 (after batch 1 PRs)
/silent batch-review

# Day 15+ (enable remaining optimizations as ready)
/decide ADR-0002 "Option A"
# (continue with phase kickoffs, auto-sync, etc.)
```

---

## Success Metrics

- [ ] v3.2-P1 shipped in ≤7 days (currently on track)
- [ ] P2+P3+P4 running in parallel by Day 3
- [ ] All 6 phases complete by Day 28 (vs 56)
- [ ] Zero manual git commands throughout
- [ ] Full audit trail (all operations logged)
- [ ] No rollbacks needed (auto-catch via health checks)

