# 🚀 Phase Automation Quick Start

Create GitHub branches and PRs for every SDD phase in seconds.

## Create a Phase (3 Options)

### Option 1: Local Command (Fastest)
```bash
pnpm phase:create planning    # Generic: pass any phase name
pnpm phase:planning           # Shortcut: planning phase
pnpm phase:seo                # Shortcut: seo-aeo phase
pnpm phase:ia                 # Shortcut: ia phase
pnpm phase:content            # Shortcut: content phase
pnpm phase:design             # Shortcut: design phase
pnpm phase:develop            # Shortcut: development phase
pnpm phase:release            # Shortcut: release phase
```

### Option 2: GitHub Actions (Automated)
1. Go to **Actions** tab
2. Select **SDD Phase Automation** workflow
3. Click **Run workflow**
4. Select phase from dropdown
5. Click **Run workflow**

### Option 3: GitHub CLI
```bash
gh workflow run sdd-phase-automation.yml \
  -f phase=planning
```

## What Gets Created

✅ **Branch**: `phase/<phase>/YYYY-MM-DD`
✅ **PR**: Phase-specific with template
✅ **Issue**: Phase tracking with checklist
✅ **State File**: `.cursor/state/phase-<phase>.yaml`
✅ **Progress**: `.nezam/core/plans/<phase>/progress.md`
✅ **Labels**: `sdd-phase:<phase>`, `automation`, `phase-gate`

## Phase Workflow

```
1. Create phase (branch + PR)
   ↓
2. Update progress file with objectives
   ↓
3. Work on deliverables
   ↓
4. Check off completed items
   ↓
5. Request reviews on PR
   ↓
6. Merge PR → Next phase starts
```

## Phase Sequence

**Must complete in order:**
1. 📋 **Planning** - Define scope & requirements
2. 🔍 **SEO/AEO** - Keyword research & content planning  
3. 🗂️ **IA** - Information architecture & sitemap
4. 📝 **Content** - Writing & copy
5. 🎨 **Design** - Visual design & components
6. 💻 **Development** - Code implementation
7. 🚀 **Release** - Deployment & monitoring

## Files to Know

| File | Purpose |
|------|---------|
| `.cursor/state/phase-<phase>.yaml` | Phase status & metadata |
| `.nezam/core/plans/<phase>/progress.md` | Phase progress tracking |
| `.github/pull_request_template_phase.md` | PR template |
| `.github/workflows/sdd-phase-automation.yml` | Create phase workflow |
| `.github/workflows/sdd-phase-gates.yml` | Enforce phase gates |

## Phase Gates

**Automatic checks** on phase PRs:
- ✅ State file exists
- ✅ Progress file exists
- ✅ Documentation complete
- ✅ Sequential order maintained
- ✅ Quality checks pass

**All gates must pass** before merge.

## Useful Commands

```bash
# View phase status
cat .cursor/state/phase-planning.yaml

# View phase progress
cat .nezam/core/plans/planning/progress.md

# List all phase branches
git branch -a | grep "phase/"

# Switch to phase branch
git checkout phase/planning/2024-12-01

# Check git log for phase
git log --oneline --graph phase/planning/2024-12-01

# View phase PR status (requires gh CLI)
gh pr list --head phase/planning/2024-12-01
```

## Quick Checklist

- [ ] Phase created (branch + PR)
- [ ] PR has correct template
- [ ] Progress file has objectives
- [ ] Team members assigned
- [ ] Timeline planned
- [ ] Dependencies identified
- [ ] Work started
- [ ] Progress updated regularly
- [ ] Deliverables completed
- [ ] Reviews requested
- [ ] Blockers resolved
- [ ] PR approved
- [ ] Merged to main

## Common Tasks

### Update Progress During Phase
```bash
# Edit progress file
nano .nezam/core/plans/planning/progress.md

# Mark items complete
# Change: - [ ] to - [x]

# Commit
git add .nezam/core/plans/planning/progress.md
git commit -m "docs: Update planning phase progress"
git push origin phase/planning/2024-12-01
```

### Mark Phase Complete
```bash
# Update state file
sed -i 's/status: in_progress/status: testing/' .cursor/state/phase-planning.yaml

# Or edit manually
nano .cursor/state/phase-planning.yaml
# Change: status: in_progress → status: testing

# Commit and push
git add .cursor/state/phase-planning.yaml
git commit -m "ci: Mark planning phase as testing"
git push origin phase/planning/2024-12-01
```

### Merge Phase to Main
```bash
# 1. Visit PR on GitHub
# 2. Request final reviews
# 3. Address any feedback
# 4. Click "Merge pull request"
# 5. Confirm merge
# 6. Delete branch (auto-offered)
```

### Start Next Phase
```bash
# Only after current phase is merged!
pnpm phase:seo  # Next phase after planning
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Branch already exists | Use existing branch, or create with different date |
| PR not created | Check GitHub token permissions in Actions |
| Gate failing | Ensure all required files exist and are complete |
| Can't merge | Fix failing checks, get approvals |
| Lost progress | Check git history: `git log` |

## Resources

- 📖 [Full Documentation](../docs/PHASE_AUTOMATION.md)
- 📋 [SDD Specification](.nezam/core/prd/PRD.md)
- 🔗 [PR Template](.github/pull_request_template_phase.md)
- ⚙️ [Workflow Config](.github/workflows/sdd-phase-automation.yml)

## Support

- 🐛 [Report Issue](https://github.com/iDorgham/Nezam/issues)
- 💬 [Discussions](https://github.com/iDorgham/Nezam/discussions)
- 📧 [Contact](mailto:yasser.dorgham@gmail.com)

---

**Pro Tip**: Pin the phase PR to the repo for quick access during phase work!
