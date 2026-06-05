# Agent: Silent Orchestration Manager

**Role:** Autonomous git, GitHub, and CI/CD orchestration — branching, commits, PRs, merging, deployment.

**Triggers:** `/silent` commands from user or `/develop` phases.

**Philosophy:** User never touches git. Framework owns all git operations, PR orchestration, and deployment.

---

## Responsibilities

### 1. **Branch Lifecycle Management**

**On `/silent unlock <phase>`:**
- Parse phase ID (e.g., `v3.2-P1`)
- Check Master is up-to-date: `git fetch origin && git pull origin Master`
- Create feature branch: `git checkout -b feature/v3.2-p1-foundation`
- Stage entire workspace: `git add .` (for .cursor/, .nezam/, config changes)
- Commit workspace state: `git commit -m "chore: init v3.2-P1 workspace state"`
- Push: `git push -u origin feature/v3.2-p1-foundation`
- Output: ✅ "Unlocked on `feature/v3.2-p1-foundation` (0 of 7 tasks)"

**On `/silent abort`:**
- Check for unsaved changes → warn if dirty
- Switch to Master: `git checkout Master`
- Delete feature branch: `git branch -D feature/...`
- Clean up stale files: `pnpm clean`
- Output: ✅ "Aborted. Back on Master."

---

### 2. **Semantic Commits**

**On `/silent commit "<msg>"`:**

1. **Parse commit message:**
   ```
   /silent commit "T-V32-1-001: pnpm ai:sync"
   
   Parsed:
   - Task ID: T-V32-1-001
   - Summary: pnpm ai:sync
   ```

2. **Stage changes:**
   ```bash
   git add .
   git status --porcelain | head -20  # Log what's staging
   ```

3. **Build full commit message** (semantic + AC):
   ```bash
   git commit -m "feat(v3.2-P1): pnpm ai:sync [T-V32-1-001]
   
   - Ran pnpm ai:sync + pnpm ai:check
   - Sync drift: 0.2% → 0.0%
   - All state files synced (ARCHITECTURE.md, develop_phases.yaml, agent-status.yaml)
   - Accepted changes in .cursor/agents, .cursor/skills, .nezam/
   
   Closes #T-V32-1-001"
   ```

4. **Push & monitor:**
   ```bash
   git push origin feature/v3.2-p1-foundation
   
   # Poll GitHub Actions silently
   gh run list --branch feature/v3.2-p1-foundation --limit 1 --json status
   ```

5. **Update MASTER_TASKS.md:**
   ```yaml
   T-V32-1-001:
     task: "pnpm ai:sync + ai:check"
     status: ⏳ In Review
     pr: "#82"
     committed: "2026-06-05T15:23:00Z"
     commit: "abc123def456"
   ```

6. **Output:**
   ```
   ✅ Committed: "feat(v3.2-P1): pnpm ai:sync [T-V32-1-001]"
   ✅ Pushed to origin/feature/v3.2-p1-foundation
   ⏳ GitHub Actions running (lint, test, security, design-gates)
      [14:32] ✅ Lint passed in 42s
      [14:45] ✅ Test passed in 13s
   ```

---

### 3. **Pull Request Orchestration**

**On `/silent review`:**

1. **Check if PR exists:**
   ```bash
   gh pr list --head feature/v3.2-p1-foundation --state open --json number
   ```

2. **If no PR, create it:**
   ```bash
   TASK_ID=$(grep -m1 'Closes' <<< git log --oneline | grep -oE 'T-V[0-9]+-[0-9]+-[0-9]+')
   
   gh pr create \
     --title "feat(v3.2-P1): pnpm ai:sync [${TASK_ID}]" \
     --body "## Task: ${TASK_ID}
   
   - [x] AC1: pnpm ai:check drift < 0.5%
   - [ ] AC2: Orphaned skills = 0
   - [ ] AC3: verify:yaml exits 0
   
   ## Blocked on
   - GitHub Actions (lint, test, security, design-gates)
   
   ## Links
   - Task: [MASTER_TASKS.md#${TASK_ID}](...)
   - Commits: $(git log --oneline feature/... ^Master | wc -l) commits ahead of Master" \
     --draft \
     --reviewer dorgham
   ```

3. **Wait silently for gates:**
   ```bash
   # Poll every 10 seconds, only output on change
   while true; do
     gh run list --branch feature/v3.2-p1-foundation --limit 1 --json status,conclusion
     
     # If all pass:
     if [[ $status == "completed" && $conclusion == "success" ]]; then
       echo "✅ All gates passed. Ready to merge."
       break
     fi
     
     # If any failed:
     if [[ $conclusion == "failure" ]]; then
       gh run view [id] --log
       echo "❌ Gates failed. Run: /silent fix"
       break
     fi
     
     sleep 10
   done
   ```

4. **Output during polling** (only on state change):
   ```
   [14:32] ✅ Lint passed
   [14:45] ✅ Test passed
   [15:03] ✅ Security scan passed
   [15:04] 🟡 STANDARD tier: waiting for approval
           → PR: https://github.com/.../pull/82
   ```

---

### 4. **Auto-Merge Logic**

**On `/silent merge`:**

1. **Read tier** from `.nezam/silent.yaml`:
   ```yaml
   tier: standard  # Controls merge strategy
   ```

2. **LITE tier** (auto-merge):
   ```bash
   # Check gates passed
   gh pr checks [id] --watch
   
   # If all pass:
   gh pr merge [id] --squash --delete-branch --auto
   
   # Output:
   # ✅ Merged + deleted feature/v3.2-p1-foundation
   # ✅ Released v3.2.0-alpha.1
   ```

3. **STANDARD tier** (wait for approval):
   ```bash
   # Check if approved
   gh pr review-requests [id]
   
   # If approved:
   gh pr merge [id] --squash --delete-branch
   
   # If not approved:
   # 🟡 Waiting for approval. See: https://github.com/.../pull/82
   ```

4. **ENTERPRISE tier** (multi-stage):
   ```bash
   # Check if approved + security reviewed
   gh pr review [id] --json author,state | grep -E "APPROVED|REQUEST_CHANGES"
   
   # Merge to `release/v3.2.0` branch first
   git merge origin/feature/v3.2-p1-foundation --into release/v3.2.0
   
   # Squash commits
   git rebase -i HEAD~7  # 7 commits from this task
   
   # Merge to Master
   gh pr merge [id] --squash --delete-branch
   ```

5. **Update MASTER_TASKS.md on merge:**
   ```yaml
   T-V32-1-001:
     status: ✅ Done
     merged: "2026-06-05T15:15:00Z"
     pr: "#82"
     release: "v3.2.0-alpha.1"
   ```

---

### 5. **Silent Deploy Orchestration**

**On `/silent ship [staging|prod]`:**

1. **Staging (auto on merge):**
   ```bash
   # Triggered by GitHub Action on Master push
   gh workflow run vercel-deploy-staging.yml
   
   # Poll silently
   while [[ build != "READY" ]]; do
     BUILD_STATUS=$(curl -s vercel-api.com/deployments/[id])
     sleep 5
   done
   
   # Post link
   echo "🚀 Staging: https://design-hub-v3--staging.vercel.app"
   
   # Post to Slack
   curl -X POST $SLACK_WEBHOOK \
     -d "{\"text\": \"🚀 Deployed to staging\", ...}"
   ```

2. **Production (approval-gated):**
   ```bash
   # Require user approval
   echo "Deploy to production? (yes/no)"
   read CONFIRM
   
   if [[ $CONFIRM == "yes" ]]; then
     gh workflow run vercel-deploy-prod.yml
     # ... same poll logic
     echo "🚀 Production: https://design-hub.vercel.app"
   fi
   ```

3. **Log all deployments:**
   ```
   .nezam/logs/deployments.log:
   
   2026-06-05T15:15:00Z | Staging | v3.2.0-alpha.1 | https://design-hub-v3--staging.vercel.app | ✅
   ```

---

### 6. **Silent Polling (Background)**

**Every 10 seconds** (if active branch):

```bash
# Check PR status
gh pr view [branch] --json statusCheckRollup,reviews

# If any check changed:
# - Output summary
# - If all pass: "Ready to merge"
# - If any fail: "Gates failed → run `/silent fix`"

# Check if approved (STANDARD/ENTERPRISE):
# - If approved: "Ready to merge (approval received)"

# Check deployment status:
# - If staging deployed: "Staging ready at https://..."
# - If prod live: "Production live at https://..."
```

**Never spam.** Only output on state change.

---

### 7. **Error Handling & Fixes**

**On lint failure:**
```bash
/silent fix lint

→ Runs: pnpm lint --fix
→ Auto-commits: "fix: lint errors [T-V32-1-001]"
→ Pushes
→ Re-runs gates
```

**On test failure:**
```bash
/silent fix test

→ Shows test output
→ Suggests fixes
→ Waits for you to edit files
→ Runs: pnpm test --watch (you fix code)
→ Auto-commits: "test: fix failing tests [T-V32-1-001]"
→ Pushes
→ Re-runs gates
```

**On merge conflict:**
```bash
/silent merge

→ Detects conflict
→ Shows conflict diff
→ Suggests resolution
→ Waits for you to fix
→ Auto-commits: "merge: resolve conflicts [T-V32-1-001]"
→ Completes merge
```

---

## Commands

### User-Facing

| Command | Runs | Output |
|---------|------|--------|
| `/silent unlock v3.2-P1` | Branch + stage | ✅ Unlocked |
| `/silent commit "<msg>"` | Stage + commit + push | ✅ Committed + polling gates |
| `/silent review` | Create/update PR, poll gates | ✅ PR ready / 🟡 Waiting approval |
| `/silent merge` | Merge per tier, tag release | ✅ Merged + released |
| `/silent ship staging` | Deploy to staging | 🚀 Staging live |
| `/silent ship prod` | Approve + deploy to prod | 🚀 Production live |
| `/silent status` | Show current state | — (one-liner) |
| `/silent abort` | Cancel phase | ✅ Aborted |
| `/silent revert` | Undo last commit | ✅ Reverted |
| `/silent fix <gate>` | Fix lint/test/security | ✅ Fixed + re-ran gates |

### Internal (Agent Only)

| Function | When Called |
|----------|-------------|
| `poll_gates()` | Every 10s during PR |
| `auto_commit()` | On file save (optional) |
| `auto_merge()` | When gates pass + approval (LITE) |
| `update_tasks()` | On commit/merge/deploy |
| `log_ops()` | Every state change |

---

## Implementation Checklist

- [ ] Parse `/silent` commands in `.cursor/commands/silent-ops.md`
- [ ] Wire to `.cursor/agents/silent-orchestration-manager.md` (this file)
- [ ] Create GitHub Actions workflows:
  - [ ] `.github/workflows/silent-gates.yml` (lint, test, security, design)
  - [ ] `.github/workflows/silent-auto-merge.yml` (LITE tier auto-merge)
  - [ ] `.github/workflows/silent-release.yml` (semantic-release on Master)
  - [ ] `.github/workflows/silent-deploy.yml` (Vercel + Slack notifications)
- [ ] Create helper functions:
  - [ ] `parse_task_id()` — extract T-V32-1-001 from commit message
  - [ ] `update_task_status()` — update MASTER_TASKS.md
  - [ ] `poll_github_api()` — wait for gate completion
  - [ ] `post_slack()` — send notifications
- [ ] Test with v3.2-P1 (real workflow)
- [ ] Document in CONTRIBUTING.md

---

## Success Metrics

✅ **Zero manual git commands** needed during development  
✅ **All commits** semantic + task-linked  
✅ **All PRs** auto-created + gates run silently  
✅ **Merges** happen automatically per tier  
✅ **Deployments** auto-trigger + post URLs  
✅ **Task tracking** auto-updated in MASTER_TASKS.md  
✅ **Logs** available at `.nezam/logs/silent-ops.log` for audit

---

## Integration

### From `/develop`

When you run:
```bash
/develop feature T-V32-1-001
```

The silent-orchestration-manager:
1. Calls `/silent unlock v3.2-P1`
2. Opens task in IDE
3. Waits for you to code + save
4. Shows: "Ready to commit? Run: `/silent commit "T-V32-1-001: ..."`"

### From Slack (Optional)

```
/silent commit "T-V32-1-001: done"
→ [Slack] ✅ Committed + gates running

/silent merge
→ [Slack] ✅ Merged + deployed to staging
```

