# Silent Operations — Cheat Sheet

**TL;DR:** Three commands. Everything else silent.

---

## Three Commands (That's All)

```bash
/silent unlock v3.2-P1              # Start a phase
/silent commit "T-V32-1-001: msg"   # Commit + push
/silent merge                       # Merge (auto or approval)
```

---

## What's Silent (You Don't Type)

```
✅ git add .
✅ git commit (semantic format + task ID)
✅ git push origin feature/...
✅ PR auto-created + checklists
✅ Lint, test, security gates run
✅ Auto-merge (LITE) or approval-gated (STANDARD)
✅ Release tag + version bump
✅ Deploy to staging
✅ Slack notification
✅ MASTER_TASKS.md updated
```

---

## Real Workflow (v3.2-P1, 7 tasks)

```bash
# Start
/silent unlock v3.2-P1
# → ✅ Unlocked on feature/v3.2-p1-foundation

# Task 1
/silent commit "T-V32-1-001: pnpm ai:sync"
# → ✅ Committed + gates running
# [Lint] ✅ [Test] ✅ [Security] ✅ [Design] ✅

# Task 2–7 (same pattern)
/silent commit "T-V32-1-002: audit skills"
/silent commit "T-V32-1-003: ..."
... (4 more)

# Merge when ready
/silent merge
# → STANDARD tier: Wait for approval (click PR link)
# → LITE tier: Auto-merges when gates pass

# Result
# ✅ 7 tasks merged
# ✅ Released v3.2.0-alpha.1
# ✅ Deployed to staging
# ✅ 0 git commands typed
```

---

## Tier Behavior

| Tier | Auto-merge | Gates | Time |
|------|-----------|-------|------|
| **LITE** | ✅ Yes | 2 (lint, test) | ~15 min |
| **STANDARD** | ❌ Wait approval | 5 | ~30 min |
| **ENTERPRISE** | ❌ Multi-approval | 7 + audit | ~1 hour |

Current: **STANDARD** (configured in `.nezam/silent.yaml`)

---

## Other Commands

```bash
/silent status              # Show current state
/silent review              # Create PR manually (auto if not exists)
/silent abort               # Cancel phase, revert to Master
/silent revert              # Undo last commit
/silent fix lint            # Fix lint + re-run gates
/silent ship staging        # Deploy to staging (auto on merge)
/silent ship prod           # Deploy to production (approval-gated)
/silent watch               # Real-time CI/CD stream
```

---

## Task Linking (Automatic)

When you run:
```bash
/silent commit "T-V32-1-001: pnpm ai:sync"
```

Automatically:
1. Creates PR with title: `feat(v3.2-P1): pnpm ai:sync [T-V32-1-001]`
2. Adds task checklist to PR body
3. Updates MASTER_TASKS.md: `status: ⏳ In Review`
4. On merge: `status: ✅ Done`
5. On deploy: `deployed: 2026-06-05T15:37:00Z`

---

## Silent Polling (No Output Unless Needed)

Every 10 seconds:
```
[14:32] ✅ Lint passed (42s)
[14:45] ✅ Test passed (13s)
[15:03] ✅ Security passed (1m)
[15:04] 🟡 Waiting for your approval
        → PR: https://github.com/.../pull/82
```

Only outputs on state change. No spam. ✨

---

## Files You Need to Know

| File | Purpose |
|------|---------|
| `.cursor/commands/silent-ops.md` | Full documentation |
| `.cursor/agents/silent-orchestration-manager.md` | Agent logic |
| `.nezam/silent.yaml` | Configuration (tier, gates, etc.) |
| `.github/workflows/silent-*.yml` | 4 workflows (gates, merge, release, deploy) |
| `.nezam/logs/silent-ops.log` | Audit trail (after first use) |

---

## Setup Checklist

- [ ] Read `.nezam/core/docs/SILENT_QUICK_START.md` (one page)
- [ ] Confirm `.nezam/silent.yaml` tier = `standard`
- [ ] Verify 4 GitHub Actions exist + enabled
- [ ] Add GitHub secrets (VERCEL_TOKEN, etc.)
- [ ] Test: `/silent unlock v3.2-P1` → `/silent commit "test"`
- [ ] Start v3.2-P1 with `/silent unlock v3.2-P1`

---

## Logs & Monitoring

After `/silent commit`, check:
```bash
cat .nezam/logs/silent-ops.log           # All operations
cat .nezam/logs/deployments.log          # Deploy history
cat .nezam/logs/releases.log             # Version history
```

Example:
```
2026-06-05T15:24:30Z | /silent commit "T-V32-1-001" | abc123def pushed
2026-06-05T15:30:45Z | All gates passed (4m 45s)
2026-06-05T15:36:00Z | Merged to Master + released v3.2.0-alpha.1
2026-06-05T15:37:00Z | Deployed to staging
```

---

## Slack Notifications

You get posts in:
- **#dev** — commits, PRs, merges
- **#deploys** — staging/prod deployments
- **#alerts** — failures (if configured)

Example:
```
✅ T-V32-1-001 committed (gates running)
✅ All gates passed, ready to merge
✅ Merged to Master → v3.2.0-alpha.1
🚀 Deployed to staging → https://design-hub-v3.vercel.app
```

---

## Troubleshooting

**Gates failed?**
```bash
/silent fix lint              # Fix lint + re-run
/silent fix test              # Fix tests + re-run
```

**Need to undo?**
```bash
/silent revert                # Undo last commit (if not merged)
/silent abort                 # Cancel phase, go back to Master
```

**Want to see CI/CD in real-time?**
```bash
/silent watch                 # Stream gates as they run
```

---

## Metrics

### Before Silent Ops
- v3.2-P1 (7 tasks): **6+ hours**
- Git commands: **50+**
- Manual steps: **150+**

### After Silent Ops
- v3.2-P1 (7 tasks): **~2 hours**
- Git commands: **0**
- Manual steps: **3** (/silent unlock, /silent commit × 7, /silent merge)

**Result:** 3x faster, zero git overhead, full audit trail 📋

---

## Next: Go Live on v3.2-P1

```bash
# Day 1 Morning
/silent unlock v3.2-P1
/silent commit "T-V32-1-001: pnpm ai:sync"
/silent commit "T-V32-1-002: audit skills"
# ... repeat for 7 tasks

# Day 1 Afternoon (after approval)
/silent merge
# → Auto-merges, releases, deploys to staging

# Day 2 (optional: production)
/silent ship prod
# → Deploys to production
```

**Total time:** ~2 hours (end-to-end)  
**Total git commands:** 0  
**Outcome:** v3.2 shipped + in production 🚀

---

## Quick Links

- 📖 Full docs: `.cursor/commands/silent-ops.md`
- ⚙️ Config: `.nezam/silent.yaml`
- 🤖 Agent: `.cursor/agents/silent-orchestration-manager.md`
- 📋 Quick start: `.nezam/core/docs/SILENT_QUICK_START.md`
- 🏗️ Architecture: `.nezam/core/docs/SILENT_ARCHITECTURE.md`
- 📊 Status: `.SILENT_OPS_DELIVERY.md` (this package)

