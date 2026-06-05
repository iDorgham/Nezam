# Silent Operations Architecture

> **Philosophy:** Branching, commits, PRs, CI/CD, merging, and deploys are not your problem. The framework owns all git/GitHub/deploy operations. You write code.

---

## Overview

```
You write code
    ↓
/silent commit "T-V32-1-001: ..."
    ↓
┌─────────────────────────────────────────────────┐
│ SILENT ORCHESTRATION MANAGER (Agent)            │
│ ─────────────────────────────────────────────── │
│ • Parse task ID from commit message             │
│ • Stage all changes                             │
│ • Commit with semantic format                   │
│ • Push to origin                                │
│ • Create PR if not exists                       │
│ • Poll GitHub Actions silently                  │
│ • Auto-merge (LITE) or wait approval            │
│ • Trigger release + deploy workflows            │
│ • Update MASTER_TASKS.md task status            │
│ • Post to Slack                                 │
│ • Log all operations                            │
└─────────────────────────────────────────────────┘
    ↓
GitHub Actions
    ├── silent-gates.yml (lint, test, security, design)
    ├── silent-auto-merge.yml (merge per tier)
    ├── silent-release.yml (semantic-release)
    └── silent-deploy.yml (Vercel + Slack)
    ↓
Master branch
    ↓
Staging ✅ → Production 🚀
```

---

## Component Architecture

### 1. **User Commands** (`.cursor/commands/silent-ops.md`)

Command interface:
```bash
/silent <action> [args]
  unlock <phase>       # Create branch
  commit "<msg>"       # Commit + push
  review               # Create/update PR
  merge                # Merge (auto or wait approval)
  ship [env]           # Deploy
  status               # Show state
  abort                # Cancel phase
  revert               # Undo last commit
  fix <gate>           # Fix + re-run
  watch                # Real-time stream
```

**Routing:**
```
/silent <action> 
  → Parsed by Cowork shell
  → Passed to silent-orchestration-manager agent
  → Agent executes git/GitHub/deploy steps
```

---

### 2. **Orchestration Agent** (`.cursor/agents/silent-orchestration-manager.md`)

Core responsibilities:

```
Parse Command
  ├── Extract task ID (T-V32-1-001)
  ├── Read tier from .nezam/silent.yaml
  └── Build operation plan

Execute
  ├── Git Operations
  │   ├── git add .
  │   ├── git commit -m "semantic [task-id]"
  │   ├── git push origin feature/...
  │   └── Monitor for conflicts
  │
  ├── GitHub Operations
  │   ├── Create PR if not exists
  │   ├── Link to task
  │   ├── Add checklist comment
  │   └── Poll gate status (every 10s)
  │
  ├── Merge Logic (Tier-aware)
  │   ├── LITE: Auto-merge when gates pass
  │   ├── STANDARD: Wait for approval, then merge
  │   └── ENTERPRISE: Multiple approvals + audit
  │
  ├── Release
  │   ├── Trigger semantic-release
  │   ├── Create GitHub release
  │   └── Tag commit
  │
  ├── Deploy
  │   ├── Trigger Vercel deploy
  │   ├── Poll build status
  │   └── Post deployment URL
  │
  └── Reporting
      ├── Update MASTER_TASKS.md
      ├── Post to Slack
      ├── Log to .nezam/logs/
      └── Only output on state change

Monitor
  └── Real-time polling (every 10s)
      ├── GitHub Actions status
      ├── PR approval status
      ├── Build/deploy status
      └── Only output when status changes
```

---

### 3. **GitHub Actions Workflows**

#### **silent-gates.yml**
Runs on: Push to feature/* or PR opened
```
Jobs:
  ├── lint (pnpm lint)
  ├── test (pnpm test)
  ├── security (CodeQL + Dependabot)
  └── design-gates (YAML verify, sync check, design check)

Output:
  → Comment on PR with results
  → Sets success/failure flag for merge gate
  → Blocked by: Any failure
```

#### **silent-auto-merge.yml**
Runs on: PR synchronize or gates.yml completed
```
Logic:
  ├── Read tier from .nezam/silent.yaml
  ├── Check if all gates passed
  │
  ├── LITE tier (auto-merge):
  │   └── Merge with squash, delete branch
  │       → Comment: "✅ Auto-merged"
  │
  └── STANDARD/ENTERPRISE (requires approval):
      └── Comment: "🟡 Waiting for approval"

Output:
  → Comment on PR
  → Update PR status
```

#### **silent-release.yml**
Runs on: Master push (after merge)
```
Steps:
  ├── semantic-release (bumps version)
  ├── Generate CHANGELOG
  ├── Create GitHub release
  ├── Tag commit
  └── Log to .nezam/logs/releases.log

Output:
  → Updated package.json (version)
  → Updated CHANGELOG.md
  → GitHub Release created
  → Tag: v3.2.0-alpha.1
```

#### **silent-deploy.yml**
Runs on: Master push (after release)
```
Staging (auto):
  ├── Vercel deploy
  ├── Wait for build
  ├── Post URL
  └── Notify Slack

Production (approval-gated):
  ├── Manual workflow_dispatch
  ├── Vercel deploy
  ├── Multi-region (us, eu)
  └── Post notification

Output:
  → Deployment URL
  → Slack message
  → Log to .nezam/logs/deployments.log
```

---

### 4. **Configuration** (`.nezam/silent.yaml`)

Controls all behavior:
```yaml
tier: standard              # lite | standard | enterprise

branching:
  prefix: feature/
  pattern: "{version}-{phase}-{desc}"

commits:
  conventional: true       # Semantic commits
  task_linking: true       # Link task IDs
  auto_format: true

pr:
  auto_create: true        # Create PR automatically
  draft_standard: true
  require_approval_standard: true

gates:
  standard: [lint, test, security, design-gates, integration]
  timeout: 600

merge:
  auto_merge_lite: true
  auto_merge_standard: false
  squash_lite: true

deploy:
  staging:
    auto: true             # Auto-deploy
  production:
    auto: false            # Approval-gated

logging:
  enabled: true
  directory: .nezam/logs
  audit_trail: true

notifications:
  slack: true
  channels:
    commits: '#dev'
    deploys: '#deploys'
    failures: '#alerts'
```

---

## Data Flow

### **Commit → PR → Merge → Deploy**

```
1. YOU: /silent commit "T-V32-1-001: pnpm ai:sync"
   ↓
2. AGENT: Stages + commits + pushes
   └── Commit: "feat(v3.2-P1): pnpm ai:sync [T-V32-1-001]"
   └── Push: origin/feature/v3.2-p1-foundation
   ↓
3. GITHUB: Webhook triggers silent-gates.yml
   ├── Job 1: lint (pnpm lint) → ✅ pass
   ├── Job 2: test (pnpm test) → ✅ pass
   ├── Job 3: security (CodeQL) → ✅ pass
   └── Job 4: design-gates → ✅ pass
   ↓
4. AGENT: Polls gates.yml (every 10s)
   └── Detects all gates passed
   └── Creates PR if not exists
   └── Comments: "✅ All gates passed"
   ↓
5. YOU: /silent merge
   ↓
6. AGENT: Merges (behavior depends on tier)
   LITE:
     └── Auto-merge with squash, delete branch
   STANDARD:
     └── Wait for approval, then merge
   ENTERPRISE:
     └── Wait for multiple approvals, then merge
   ↓
7. GITHUB: Webhook triggers silent-release.yml
   ├── semantic-release (v3.2.0-alpha.1)
   ├── Update package.json + CHANGELOG.md
   ├── Create GitHub release
   └── Tag commit
   ↓
8. GITHUB: Webhook triggers silent-deploy.yml
   ├── Vercel deploy (staging)
   ├── Wait for build (5m)
   ├── Post URL: https://design-hub-v3.vercel.app
   └── Post to Slack: #deploys
   ↓
9. YOU: /silent ship prod (optional)
   ↓
10. GITHUB: Deploy prod workflow
    ├── Vercel deploy (production)
    ├── Multi-region (us, eu)
    └── Post URL: https://design-hub.vercel.app
```

---

## Task Status Auto-Update

On each state change, MASTER_TASKS.md is updated:

```yaml
T-V32-1-001:
  task: "pnpm ai:sync + ai:check"
  
  # After /silent commit
  status: ⏳ In Review
  committed: "2026-06-05T15:24:30Z"
  commit: "abc123def456"
  
  # After PR created
  pr: "#82"
  pr_url: "https://github.com/.../pull/82"
  
  # After gates pass
  gates_passed: "2026-06-05T15:30:45Z"
  gates: [lint, test, security, design-gates]
  
  # After approval
  approved_by: dorgham
  approved_at: "2026-06-05T15:35:22Z"
  
  # After merge
  status: ✅ Done
  merged: "2026-06-05T15:36:00Z"
  release: "v3.2.0-alpha.1"
  
  # After deploy
  deployed: "2026-06-05T15:37:00Z"
  deployed_to: staging
```

---

## Tier Comparison

| Aspect | LITE | STANDARD | ENTERPRISE |
|--------|------|----------|-----------|
| **Auto-merge** | ✅ Yes | ❌ Wait approval | ❌ Wait approval |
| **Merge strategy** | Squash | Conventional | Conventional |
| **Gates** | 2 (lint, test) | 5 (+ security, design, integration) | 7 (+ a11y, perf) |
| **Approvals needed** | 0 | 1 | 2+ |
| **Deploy staging** | Auto | Auto | Auto |
| **Deploy production** | Approval | Approval | Approval + audit |
| **Regions** | US | US | US + EU |
| **Audit trail** | Basic | Basic | Full |
| **Time to ship** | ~15 min | ~30 min | ~1 hour |

---

## Silent Polling Strategy

Agent polls GitHub silently every 10 seconds for:

1. **PR status checks**
   ```
   gh pr checks [id] --watch
   ```
   → Only output if state changes (e.g., "✅ Lint passed")

2. **Approval status** (STANDARD/ENTERPRISE)
   ```
   gh pr review-requests [id]
   ```
   → Output when approved ("🟡 Approved, ready to merge")

3. **Deployment status**
   ```
   curl vercel.com/deployments/[id]
   ```
   → Output when build ready ("🚀 Staging ready")

**No spam:** Polling happens in background, output only on change.

---

## Logging & Audit

All operations logged to `.nezam/logs/`:

```
silent-ops.log:
  2026-06-05T15:24:30Z | /silent commit | T-V32-1-001 | abc123def | pushed
  2026-06-05T15:25:00Z | PR #82 created | draft=true
  2026-06-05T15:30:45Z | Gates passed | 4m 45s | [lint, test, security, design]
  2026-06-05T15:35:22Z | Approved by dorgham
  2026-06-05T15:36:00Z | Merged to Master | squashed
  2026-06-05T15:36:15Z | Released v3.2.0-alpha.1

deployments.log:
  2026-06-05T15:37:00Z | Staging | v3.2.0-alpha.1 | https://design-hub-v3.vercel.app | ✅
  2026-06-05T15:50:00Z | Production | v3.2.0-alpha.1 | https://design-hub.vercel.app | ✅

releases.log:
  2026-06-05T15:36:15Z | v3.2.0-alpha.1 | Master | 7 commits
  2026-06-05T16:45:00Z | v3.2.0-alpha.2 | Master | 3 commits
```

---

## Error Handling

On failure, agent:
1. **Identifies** which gate failed (lint/test/security/deploy)
2. **Suggests** fix command (`/silent fix lint`)
3. **Waits** for you to fix locally
4. **Auto-commits & re-runs** gates

Example:
```
❌ Lint failed
Suggestion: Run `pnpm lint --fix` locally, then push
↓
(You fix code)
↓
/silent commit "fix: lint errors [T-V32-1-001]"
↓
Gates re-run → ✅ pass
```

---

## Success Metrics

✅ **Zero manual git commands** (git add, git commit, git push are silent)  
✅ **All commits** semantic + task-linked  
✅ **All PRs** auto-created with checklists  
✅ **All merges** per tier (auto LITE, approval STANDARD, audit ENTERPRISE)  
✅ **All deployments** tracked + notified  
✅ **All tasks** auto-updated in MASTER_TASKS.md  
✅ **All logs** auditable at `.nezam/logs/`  

**Outcome:** v3.2-P1 (7 tasks) → shipped in ~2 hours with zero git commands.

