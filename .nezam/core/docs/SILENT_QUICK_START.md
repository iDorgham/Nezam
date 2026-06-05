# Silent Operations — Quick Start

**You never touch git again.** The framework handles branching, commits, PRs, CI/CD, merging, and deploys automatically.

---

## Your Workflow (3 Commands)

```bash
# 1. Start a phase
/silent unlock v3.2-P1

# 2. Code + commit (repeat as needed)
/silent commit "T-V32-1-001: pnpm ai:sync"
/silent commit "T-V32-1-002: audit orphaned skills"

# 3. Merge & deploy (automatic)
/silent merge
/silent ship staging
```

That's it. Everything else runs silently:
- ✅ Branches created
- ✅ Changes staged & committed
- ✅ Pushed to origin
- ✅ PR auto-created
- ✅ Lint, test, security gates run
- ✅ Merged when gates pass
- ✅ Released with semantic versioning
- ✅ Deployed to staging
- ✅ Slack notified

---

## Real Example: Complete v3.2-P1 (7 tasks)

```bash
# Day 1
/silent unlock v3.2-P1
# → ✅ Unlocked on feature/v3.2-p1-foundation

/silent commit "T-V32-1-001: pnpm ai:sync"
# → ✅ Committed + gates running
# [Lint] ✅ 42s
# [Test] ✅ 13s
# [Security] ✅ 1m 2s
# [Design] ✅ 28s

/silent commit "T-V32-1-002: audit orphaned skills"
# → ✅ Committed + gates running
# [All gates] ✅ 3m 15s total

/silent commit "T-V32-1-003: pnpm verify:yaml"
# → ✅ Committed + gates running

/silent commit "T-V32-1-004: extend agent-status.yaml"
# → ✅ Committed + gates running

/silent commit "T-V32-1-005: promote sync-drift-check"
# → ✅ Committed + gates running

/silent commit "T-V32-1-006: write SYNC_RUNBOOK.md"
# → ✅ Committed + gates running

/silent commit "T-V32-1-007: verify Husky hook"
# → ✅ Committed + gates running

# Day 2 (all merged overnight for LITE tier)
/silent status
# → Branch: feature/v3.2-p1-foundation (7 commits)
#   PR: #82 (MERGED ✅)
#   Release: v3.2.0-alpha.1
#   Deploy: Staging ✅

# Ship to production
/silent ship prod
# → 🚀 Production: https://design-hub.vercel.app
```

---

## Configuration

See `.nezam/silent.yaml`:

```yaml
tier: standard  # Choose: lite | standard | enterprise

# LITE:
# - Auto-merge when gates pass
# - Single approval not required
# - Deploy staging automatically

# STANDARD:
# - Merge waits for your approval
# - 5 gates (lint, test, security, design, integration)
# - Staging auto-deploys, prod approval-gated

# ENTERPRISE:
# - All gates required
# - Multiple approvals
# - Multi-region deploy
# - Audit trail
```

---

## Commands

### Core (You'll Use These)

```bash
/silent unlock <phase>        # Start a phase (e.g., v3.2-P1)
/silent commit "<msg>"        # Commit + push
/silent merge                 # Merge when ready
/silent ship [staging|prod]   # Deploy
/silent status                # Show current state
```

### Advanced

```bash
/silent review                # Create PR manually (auto if not exists)
/silent fix lint              # Fix lint + re-run gates
/silent abort                 # Cancel phase, revert to Master
/silent revert                # Undo last commit
/silent watch                 # Real-time CI/CD stream
```

---

## What's Silent (No Output Unless Needed)

✅ **Branching** — feature branch created, no output  
✅ **Staging** — files staged automatically  
✅ **Committing** — committed with semantic format + task linkage  
✅ **Pushing** — pushed to origin  
✅ **PR Creation** — PR created with task checklist  
✅ **Gate Polling** — runs every 10s, only outputs on state change  
✅ **Auto-Merge** — merges when gates pass (LITE) or approval (STANDARD)  
✅ **Release** — semantic-release bumps version  
✅ **Deploy** — Vercel deploys + Slack notified  

---

## Notifications

You get notifications for:
- ✅ Commit succeeded (gates running)
- ✅ All gates passed (ready to merge)
- 🟡 Approval waiting (STANDARD/ENTERPRISE)
- ✅ Merged (release tagged)
- 🚀 Deployed (URL posted)
- ❌ Gates failed (fix needed)

**Slack channel:** #dev (commits, PRs) + #deploys (releases)

---

## Tier Behavior

### LITE
```
/silent unlock → /silent commit → /silent merge → auto-merge → auto-deploy staging
                    ✅ Gates run         ✅ Auto-merge if green
                    ✅ PR created auto   ✅ No approval needed
```

### STANDARD (Current)
```
/silent unlock → /silent commit → /silent merge → wait for approval → auto-merge → auto-deploy staging
                    ✅ Gates run         🟡 Waiting for 👍     ✅ Your choice
                    ✅ PR created auto   ← You click "Approve"
```

### ENTERPRISE
```
/silent unlock → /silent commit → /silent merge → approval + security review → merge → release → staging → prod approval
                    ✅ 7 gates           🔐 Multiple reviews   ✅ Multi-region
                    ✅ Audit trail       📋 Compliance checks
```

---

## Troubleshooting

**Gates failed?**
```bash
/silent fix lint          # Fix lint errors + re-run
/silent fix test          # Fix tests + re-run
```

**Need to undo a commit?**
```bash
/silent revert            # Undo last commit (if not merged)
```

**Want to abort this phase?**
```bash
/silent abort             # Go back to Master, clean up branch
```

**Want to see real-time CI/CD?**
```bash
/silent watch             # Stream gates as they run
```

---

## Logs & Audit

All operations logged to:
- `.nezam/logs/silent-ops.log` — all commands + timestamps
- `.nezam/logs/deployments.log` — deploy history + URLs
- `.nezam/logs/releases.log` — version history

Example:
```
2026-06-05T15:23:00Z | /silent unlock v3.2-P1 | feature/v3.2-p1-foundation created
2026-06-05T15:24:30Z | /silent commit "T-V32-1-001: ..." | abc123def pushed
2026-06-05T15:25:00Z | PR #82 created | draft=true
2026-06-05T15:30:45Z | All gates passed (4m 45s)
2026-06-05T15:35:22Z | Approved | ready to merge
2026-06-05T15:36:00Z | /silent merge | merged + deleted branch
2026-06-05T15:36:15Z | Release v3.2.0-alpha.1 tagged
2026-06-05T15:37:00Z | /silent ship staging | https://design-hub-v3.vercel.app
```

---

## Next: Link to Master Tasks

Each `/silent commit` automatically:
1. Extracts task ID from commit message (e.g., `T-V32-1-001`)
2. Updates MASTER_TASKS.md with status ✅ In Review
3. Links PR in task metadata
4. Moves task → Done on merge

Example (MASTER_TASKS.md after `/silent merge`):
```yaml
T-V32-1-001:
  task: "pnpm ai:sync + ai:check"
  status: ✅ Done
  pr: "#82"
  merged: "2026-06-05T15:36:00Z"
  release: "v3.2.0-alpha.1"
  deployed: "2026-06-05T15:37:00Z"
```

---

## First Time Setup

1. **Review `.nezam/silent.yaml`** — confirm tier (standard)
2. **Check GitHub Actions** — all 4 workflows should be enabled:
   - `silent-gates.yml` ✅
   - `silent-auto-merge.yml` ✅
   - `silent-release.yml` ✅
   - `silent-deploy.yml` ✅
3. **Set Secrets** (GitHub Settings → Secrets):
   - `VERCEL_TOKEN` — your Vercel token
   - `VERCEL_ORG_ID` — your org ID
   - `VERCEL_PROJECT_ID_STAGING` — staging project
   - `VERCEL_PROJECT_ID_PROD` — prod project
   - `SLACK_WEBHOOK` — Slack webhook URL (optional)
4. **Done!** Start with `/silent unlock v3.2-P1`

---

## Exit Criteria for v3.2-P1 (Using Silent Ops)

✅ All 7 tasks committed + gates pass  
✅ PR #82 merged automatically  
✅ Released as v3.2.0-alpha.1  
✅ Deployed to staging automatically  
✅ Zero manual git commands used  
✅ All operations logged  

Then: `/silent ship prod` for production deploy.

---

## Support

- 📖 Full docs: `.cursor/commands/silent-ops.md`
- 🤖 Agent: `.cursor/agents/silent-orchestration-manager.md`
- ⚙️ Config: `.nezam/silent.yaml`
- 📋 Workflows: `.github/workflows/silent-*.yml` (4 files)

**Questions?** Check `.nezam/logs/silent-ops.log` for full audit trail.

