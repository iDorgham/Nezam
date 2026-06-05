# Workflow Acceleration — Beyond Silent Ops

> **Goal:** Cut v3.2 execution time from ~8 weeks to ~3–4 weeks without sacrificing quality.

Silent Ops handles automation. These optimizations handle **planning, parallelization, and decision velocity**.

---

## 1. **Parallel Phase Execution** ⚡

**Current:** P1 → P2 → P3 → P4 → P5 → P6 (sequential, 6 weeks)

**Optimized:** P1 (mandatory) → P2 + P3 + P4 (parallel, 3 weeks)

### Why It Works
- **P1 (Sync + State):** Must complete first (foundational)
- **P2 (CI/CD):** No dependency on P3/P4
- **P3 (Security):** No dependency on P2/P4
- **P4 (Design bridge):** No dependency on P2/P3
- **P5 (Obs + Content):** Requires P2 done
- **P6 (Docs + QA):** Requires P1–P5 done

### Implementation
1. **Split agents by lane:**
   - **Lane A:** P1 (you) → P2 (CI/CD agent)
   - **Lane B:** P3 (Security agent)
   - **Lane C:** P4 (Design bridge agent)

2. **Non-blocking communication:**
   - Each lane posts progress to `.nezam/progress/lane-{a,b,c}.yaml`
   - No waiting for approval between lanes
   - Merge gates validate compatibility on P5 start

3. **Result:**
   ```
   Week 1: P1 (7 tasks)
   Week 2: P1 done + P2 + P3 + P4 run in parallel (20 tasks concurrent)
   Week 3: P2/P3/P4 wrap + P5 starts (7 tasks)
   Week 4: P6 cleanup (8 tasks)
   
   Total: 4 weeks vs. 6 weeks (2 weeks saved)
   ```

---

## 2. **Decision Velocity — Async ADR Approval** ⚡⚡

**Current:** You read ADR → decide → document (serial, 2 days per decision)

**Optimized:** ADR + decision options auto-generated → you pick → approved (30 min)

### How It Works

**Agent generates ADR with 3 options:**

```markdown
# ADR-0002: CI/CD Pipeline

## Decision Required
Pipeline gate strategy?

### Option A: 2-tier (Fast + Nightly)
- Fast path: lint, test (4 min)
- Nightly: extended tests
- Pros: Dev velocity ↑↑↑
- Cons: Some bugs slip to nightly
- Cost: Minimal

### Option B: All gates every PR
- All 7 gates on every PR
- Pros: Highest quality
- Cons: 15 min per PR
- Cost: Moderate

### Option C: Tiered gates (LITE/STANDARD/ENTERPRISE)
- LITE: 2 gates
- STANDARD: 5 gates
- ENTERPRISE: 7 gates
- Pros: Flexible per tier
- Cons: Configuration overhead
- Cost: High
```

**You respond in 30 seconds:**
```bash
/decide ADR-0002 "Option A: 2-tier"
```

**Agent:**
- ✅ Locks decision in ADR
- ✅ Updates ARCHITECTURE.md
- ✅ Wires gates per option
- ✅ Moves P2 forward

### Implementation
Create `.cursor/agents/adr-decision-accelerator.md`:
1. Generate ADR with 3 credible options (not just listing)
2. Include cost/benefit for each
3. Wait for `/decide ADR-{id} "Option X"` command
4. Auto-implement based on choice
5. Log decision + rationale

### Time Savings
- Per decision: 2 hours → 15 min = **1h 45m saved**
- Per phase: 3–5 decisions = **5–9 hours saved per phase**
- Total v3.2: **20–30 hours saved**

---

## 3. **Template-First Task Execution** ⚡⚡

**Current:** You read task AC → implement from scratch (variable time)

**Optimized:** Task templates auto-generate starter code/config → you complete (50% faster)

### Example: T-V32-2-001 (GitHub Actions PR gate)

**Template generates:**

```bash
.github/workflows/pr-gates.yml
├── lint job (pnpm lint template)
├── test job (vitest template)
├── security job (CodeQL template)
├── gates summary job
└── auto-comment template
```

**You then:**
1. Review generated file (2 min)
2. Add project-specific settings (5 min)
3. Test locally (5 min)
4. Commit (auto via Silent Ops)

**vs. Starting from scratch:**
- Write YAML (20 min)
- Debug syntax (10 min)
- Test (10 min)

**Savings:** 15 min per task = **2.5 hours on P2 alone**

### Implementation
Create per-phase templates in `.nezam/templates/`:
```
.nezam/templates/
├── v3.2-p1/
│   ├── sync-state-checklist.md
│   ├── yaml-schema.json
│   └── husky-pre-commit.sh
├── v3.2-p2/
│   ├── github-actions-gates.yml
│   ├── semantic-release.json
│   └── vercel-deploy.yml
├── v3.2-p3/
│   ├── codeql-config.yml
│   ├── dependabot.yml
│   └── secret-scanning.yml
└── v3.2-p4/
    ├── figma-mcp-bridge.ts
    ├── design-token-sync.sh
    └── schema-v2.json
```

### Command
```bash
/develop template T-V32-2-001
# → Generates .github/workflows/pr-gates.yml starter
# → Opens in IDE
# → Shows AC checklist inline
```

---

## 4. **Fast-Path Approvals** ⚡

**Current:** You review PR → click approve on GitHub (5 clicks)

**Optimized:** Skip GitHub; approve in-chat (1 click)

### How It Works

On `/silent review`, agent posts:

```
✅ All gates passed (4m 45s)
PR: https://github.com/.../pull/82

Ready to merge? 
[YES] [NO] [CHANGES NEEDED]
```

**You click [YES]** → Agent:
1. ✅ Approves PR on GitHub
2. ✅ Merges
3. ✅ Triggers release
4. ✅ Posts: "Merged + v3.2.0-alpha.1 released"

### Implementation
Wire `/silent review` output to show approval buttons:
```bash
# After PR created + gates pass
Agent outputs:
✅ All gates passed
[APPROVE & MERGE] [NEEDS CHANGES] [WATCH]

/approve-and-merge
  → gh pr approve [id]
  → gh pr merge [id]
```

### Time Savings
- Per merge: 5 clicks + context switch = 1 min → 10 sec
- Per phase: 6–7 merges = 5 min saved
- Total v3.2: **15 min saved**

---

## 5. **Task Status Auto-Sync to Linear/Asana** ⚡

**Current:** Commit → MASTER_TASKS.md updated (manual for Linear/Asana)

**Optimized:** Commit → auto-sync to Linear/Asana

### Implementation
On `/silent commit`, agent also:
1. Extracts task ID (T-V32-1-001)
2. Finds matching Linear issue (or creates it)
3. Updates status: `T-V32-1-001` → `In Progress`
4. On `/silent merge`: status → `Done`
5. On `/silent ship`: status → `Deployed`

### Command Setup
```yaml
# .nezam/silent.yaml
integrations:
  linear:
    enabled: true
    api_key: ${{ secrets.LINEAR_API_KEY }}
    project_id: NEZAM
    status_mapping:
      in_review: "In Review"
      merged: "Done"
      deployed: "Deployed"
```

### Time Savings
- **Eliminates:** Manual task status updates (1 min per commit)
- **Per phase:** 10 commits = 10 min saved
- **Total v3.2:** **40 min saved**

---

## 6. **Batch Context Window — Code Review in Silence** ⚡⚡

**Current:** Each PR review is a separate review (context switching)

**Optimized:** Batch review all P1 PRs together (deep review, once)

### How It Works

After Day 1 of P1 (all 7 commits):

```bash
/silent batch-review
```

Agent:
1. Collects all 7 PRs (T-V32-1-001 through T-V32-1-007)
2. Reads full context + dependencies
3. Runs unified linting + testing
4. Generates **cross-PR analysis:**
   - "Commit 5 breaks Commit 3's assumption → fix priority"
   - "Commits 1+2+4 should be squashed together"
   - "Commit 7 can run parallel with 1–6"
5. Posts recommendations
6. You approve all 7 at once

### Time Savings
- **Per commit review:** 5 min → 1 min (batched context)
- **Per phase:** 6–7 commits = 24 min saved
- **Total v3.2:** **2–3 hours saved** (deep review catches integration issues early)

---

## 7. **Health Checks on Schedule** ⚡

**Current:** You manually check `.nezam/logs/` after major milestones

**Optimized:** Auto-run health checks nightly, post summary

### Implementation
```bash
# .github/workflows/nightly-health-check.yml

on:
  schedule:
    - cron: '2 2 * * *'  # 2 AM UTC daily

jobs:
  health_check:
    - pnpm verify:yaml
    - pnpm ai:check
    - pnpm design:check
    - pnpm test --run
    - Check MASTER_TASKS.md for stale items
    - Check .nezam/logs/ for errors
    - Post to Slack #dev: "✅ Health check passed"
                   OR: "⚠️ Issues found: [list]"
```

### Time Savings
- **Catches issues early:** 1 issue caught = 30 min saved (no firefighting)
- **Per week:** 2–3 issues caught = 1 hour saved
- **Total v3.2:** **2–3 hours saved**

---

## 8. **Interactive Phase Kickoff** ⚡⚡

**Current:** You read MASTER_TASKS.md + phase description manually

**Optimized:** `/develop phase-kickoff P2` generates interactive session

### How It Works

```bash
/develop phase-kickoff v3.2-p2

# Agent generates:
# 1. Interactive task board (6 tasks, AC visible)
# 2. Dependency graph (what blocks what)
# 3. Time estimates per task
# 4. Risk flags (any unknowns?)
# 5. Quick-start checklist
# 6. One-click task start: "Begin T-V32-2-001"
```

You see:
```
╔════════════════════════════════════════╗
║ v3.2-P2: CI/CD Pipeline               ║
║ Status: 0 of 6 tasks done              ║
╠════════════════════════════════════════╣
║ T-V32-2-001  [  ] Gates strategy       ║
║              AC: 2-tier + nightly       ║
║              Est: 2h  Risk: Low         ║
║              [START] [DEFER] [BLOCK]   ║
├────────────────────────────────────────┤
║ T-V32-2-002  [  ] semantic-release     ║
║              AC: Auto-version on merge  ║
║              Est: 1h  Risk: Low         ║
║              [START] [DEFER] [BLOCK]   ║
└────────────────────────────────────────┘
```

You click **[START]** → `/silent unlock v3.2-p2-001` + opens task in IDE

### Time Savings
- **Context setup:** 10 min → 2 min
- **Per phase:** 5 min saved
- **Total v3.2:** **30 min saved**

---

## 9. **Rollback Automation** ⚡

**Current:** Deploy breaks → manual revert

**Optimized:** Auto-detect deployment failure → auto-rollback + notify

### Implementation
```bash
# .github/workflows/deployment-health-check.yml

After Vercel deploy:
1. Wait 5 min for Sentry/analytics data
2. Check error rate spike (vs. baseline)
3. If error_rate > baseline + 10%:
   → Auto-revert to previous version
   → Post to Slack: "🔄 Auto-reverted due to error spike"
   → Create incident in Linear
4. If clean: Post: "✅ Deployment healthy"
```

### Time Savings
- **Per incident:** Catch + manual rollback = 30 min → auto-rollback = 2 min
- **Risk reduction:** Issues caught in staging before prod
- **Total v3.2:** **1–2 hours saved** (prevents firefighting in prod)

---

## 10. **Time-Box Tasks with Escalation** ⚡

**Current:** Task stalls → you debug manually

**Optimized:** Task hits time estimate → escalation card + context

### How It Works

On task start:
```bash
/silent commit "T-V32-2-001: start gates strategy"

# Agent sets timer (based on MASTER_TASKS estimate: 2h)
```

After 2h (if not committed):
```
⏱️ Task T-V32-2-001 hit time estimate

Escalation options:
[EXTEND 30MIN] [EXTEND 1H] [GET HELP] [DEFER] [MARK DONE]

If [GET HELP]:
  → Posts task context to Slack #dev
  → Copies AC + blockers
  → Tags available agents
```

### Time Savings
- **Prevents rabbit holes:** Tasks that should take 2h don't become 6h
- **Per phase:** 2–3 escalations avoided = 6–9 hours saved
- **Total v3.2:** **10–15 hours saved**

---

## Summary: Combined Impact

| Optimization | Time Saved | Effort |
|---|---|---|
| Parallel phases (P2+P3+P4) | **14 days** | High (1x setup) |
| Async ADR decisions | 20–30 hours | Medium |
| Task templates | 10–15 hours | Medium |
| Fast-path approvals | 2–3 hours | Low |
| Linear/Asana sync | 1–2 hours | Low |
| Batch code review | 2–3 hours | Low |
| Health checks (nightly) | 2–3 hours | Low |
| Phase kickoff (interactive) | 1–2 hours | Low |
| Rollback automation | 1–2 hours | Low |
| Time-box escalation | 10–15 hours | Medium |

**Total Expected Savings:**
- **Serial workflow:** 8 weeks → 4 weeks (**50% time reduction**)
- **Quality gates:** All maintained (nothing skipped)
- **Risk:** Reduced (early detection of issues)

---

## Implementation Priority

### **Week 1 (Immediate)**
1. ✅ Silent Ops (already done)
2. ⚡ Parallel phases (P1 done → start P2+P3+P4 now)
3. ⚡ Task templates (create for P2–P4)

### **Week 2**
4. ⚡⚡ Async ADR decisions (accelerate P1–P5 choices)
5. ⚡ Batch code review (after all P1 commits)
6. ⚡ Health checks (nightly automation)

### **Week 3+**
7. ⚡ Linear sync (ongoing integration)
8. ⚡ Fast-path approvals (minor, but useful)
9. ⚡ Rollback automation (safety net)
10. ⚡ Time-box escalation (preventing scope creep)

---

## Go Live Sequence for v3.2

```bash
# Day 1: P1 + Parallel lanes start
/silent unlock v3.2-p1
/develop start-parallel-lanes v3.2-p2 v3.2-p3 v3.2-p4
# → You work P1, agents work P2/P3/P4

# Day 2–3: P1 done, batch review
/silent batch-review  # All 7 P1 PRs together
/decide ADR-0002 "Option A"  # Async ADR decision
/develop template T-V32-2-001  # Task template for P2

# Day 4+: P2/P3/P4 converge
/nightly-health-check  # Automated checks
/silent merge  # Auto-merge with fast-path approval

# Result: v3.2 shipped in ~3 weeks vs. 8 weeks
```

---

## Next Action

Pick **#1 (Parallel phases)** → Start P2+P3+P4 while P1 finishing.

That single change (14-day time save) requires **zero code changes** — just delegation to agents + non-blocking communication.

Want me to wire up parallel lane coordination?

