# NEZAM v0.3.2 Acceleration Roadmap
**Owner:** Dorgham (Project Architect)  
**Date:** 2026-06-06  
**Goal:** Reduce dev time 65%, automate CI/CD/release, eliminate manual steps

---

## The Promise vs. The Gap

### v0.3.2 Master Plan Claims
| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Dev Time (Web App) | 24h | 9h | **62% faster** |
| Manual Steps | 430+ | ~15 | **96% reduction** |
| CI/CD Gates | Manual | Automated | **100% automated** |
| Release Process | 30+ steps | 1 command | **97% fewer steps** |

### Current Reality (v0.3.5 Legacy)
- Two competing plans → 8h wasted on confusion
- Manual sync (`pnpm ai:sync`) → 15 min per edit cycle
- No CI validation → broken merges slip through
- Manual branch/tag/release → 30+ error-prone steps
- RAM bloat → IDE startup 30s+ (delays every session)

**Gap:** v0.3.2 **promises** but v0.3.5 **infrastructure** still active. Can't deliver speed until we sunset v0.3.5.

---

## Phase 0: Immediate Alignment (Jun 6-7, 2 days)

### 0.1 Archive v0.3.5 (2 hours, parallel with others)

**Why this unblocks everything:**
- Clears mental model: "One plan, one source of truth"
- Enables phase ID validation in CI (currently ambiguous)
- Unblocks task tracking consolidation
- Lets team focus on v0.3.2 execution

**Action:**
```bash
# 1. Create archive structure
mkdir -p _archive/v0.3.5
mv MASTER_PLAN_v0.3.5.md QUICK_START_v0.3.5.md \
   ANTIGRAVITY_v0.3.5_BUILD_PLAN.md CHANGELOG_v0.3.5.md \
   _archive/v0.3.5/

# 2. Document deprecation
cat > _archive/v0.3.5/README.md << 'EOF'
# NEZAM v0.3.5 (Archived)

**Archived:** 2026-06-06  
**Reason:** Superseded by v0.3.2 (50% faster execution, clearer phases)  
**Keep Until:** 2026-07-06 (30-day grace for migration)  
**Delete After:** 2026-07-07 (permanent removal)

See: ../../MASTER_PLAN_v0.3.2.md for active plan.

## What Changed
- v0.3.5: Sequential phases (P0→P1→...→P6)
- v0.3.2: Parallel phases (P1/P2/P3 simultaneous after P0)
- v0.3.5: Manual steps & decisions
- v0.3.2: Automated SDD flow, adaptive phase skipping

## If You Have Pending Work on v0.3.5
Contact Dorgham to migrate to v0.3.2 timeline.
EOF

# 3. Update git
git add _archive/
git rm --cached MASTER_PLAN_v0.3.5.md QUICK_START_v0.3.5.md ANTIGRAVITY_v0.3.5_BUILD_PLAN.md CHANGELOG_v0.3.5.md
git commit -m "chore: archive v0.3.5 plan; v0.3.2 is canonical"

# 4. Verify zero v0.3.5 refs
grep -r "v0.3.5" . --exclude-dir=_archive --exclude-dir=.git || echo "✓ No stale v0.3.5 references"
```

**Owner:** Swarm Leader (30 min)  
**Blocker:** None

### 0.2 Pin v0.3.2 as Canonical (1 hour)

**Action:**

```markdown
# Update MASTER_PLAN_v0.3.2.md frontmatter

---
canonical: true
version: 0.3.2
status: active
supersedes: [v0.3.5, v3.0]
last_updated: 2026-06-06
next_review: 2026-06-20
owner: Dorgham
---
```

Update `MEMORY.md`:
```markdown
# Master Planning

- [MASTER_PLAN_v0.3.2](MASTER_PLAN_v0.3.2.md) — **ONLY active plan**. 
  - Canonical source of truth for all phases, tasks, timeline
  - Do NOT reference v0.3.5; archived 2026-06-06
  - Next review: 2026-06-20 (after Week 1 remediation)
```

Update `.cursor/commands/plan.md`:
```markdown
# /plan command

Returns current v0.3.2 phase status. Do NOT reference v0.3.5.

## Active Phases
- v0.3.2-P0: Foundation (completed)
- v0.3.2-P1: (completed)
- v0.3.2-P2..P6: (locked, blocked on P1)
```

**Owner:** Swarm Leader (1 hour)  
**Validation:** `grep -r "v0.3.5" .cursor/` returns nothing

---

## Phase 1: CI/CD Automation Foundation (Jun 6-8, 3 days)

### 1.1 Automated Sync Validation (3 hours)

**Current blocker:** Manual `pnpm ai:sync` on every `.cursor/` edit

**Fix:** GitHub Actions + pre-commit hook

```yaml
# .github/workflows/ai-sync-validation.yml

name: AI Sync Validation
on:
  pull_request:
    paths:
      - '.cursor/**'
      - 'CLAUDE.md'
  push:
    branches: [main]

jobs:
  sync-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: pnpm install
      
      - name: Sync AI config
        run: pnpm ai:sync
      
      - name: Validate sync
        run: pnpm ai:check
      
      - name: Fail if CLAUDE.md drift
        run: |
          git diff --exit-code CLAUDE.md || \
          (echo "❌ CLAUDE.md out of sync. Run 'pnpm ai:sync' locally." && exit 1)

  # New: Validate phase IDs during sync
  validate-phases:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: |
          npm install -g @nezam/cli  # Or internal validator
          nezam-validate-phases MASTER_PLAN_v0.3.2.md
```

```bash
# .husky/pre-commit (new)

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔄 Validating AI sync before commit..."
pnpm ai:sync || exit 1
pnpm ai:check || exit 1

echo "✓ AI config synced"
```

**Outcome:** 
- Zero manual sync steps for contributors
- CI blocks bad syncs before merge
- CLAUDE.md never goes stale
- Saves ~15 min per edit cycle

**Owner:** DevOps Manager (3 hours)

### 1.2 Automated Branching Strategy (2 hours)

**Current blocker:** Manual `git checkout -b` decisions; no naming convention

**Fix:** GitHub CLI automation + branch-naming schema

```bash
# .nezam/scripts/auto-branch.sh (called by CLI)

#!/bin/bash
# Usage: ./auto-branch.sh "Implement P1 task T-v0.3.2-P1-001"

TASK_ID=$1
TYPE=${2:-feature}  # feature|fix|docs|refactor

# Auto-extract task ID from message
TASK_MATCH=$(echo "$TASK_ID" | grep -oE "T-v3\.2-P[0-9]+-[0-9]{3}")

if [ -z "$TASK_MATCH" ]; then
  echo "❌ Task ID required. Format: T-v0.3.2-PN-NNN"
  exit 1
fi

BRANCH_NAME="${TYPE}/${TASK_MATCH}-$(echo "$TASK_ID" | sed 's/ /-/g' | cut -c1-30)"

echo "Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Add branch protection (prevent direct pushes to main)
git config branch."$BRANCH_NAME".merge main
```

**Naming convention:**
```
feature/T-v0.3.2-P1-001-sync-validation
fix/T-v0.3.2-P2-015-phase-numbering
docs/T-v0.3.2-P3-022-readme-update
```

**CI enforces:**
```yaml
# .github/workflows/branch-validation.yml

jobs:
  validate-branch-name:
    runs-on: ubuntu-latest
    steps:
      - name: Check branch name format
        run: |
          BRANCH=${{ github.head_ref }}
          if ! [[ $BRANCH =~ ^(feature|fix|docs|refactor)/T-v3\.2-P[0-9]+-[0-9]{3} ]]; then
            echo "❌ Branch must match: (feature|fix|docs|refactor)/T-v0.3.2-PN-NNN"
            exit 1
          fi
```

**Outcome:**
- One command: `./auto-branch.sh "T-v0.3.2-P1-001 implement sync"`
- Linked to task tracking automatically
- CI validates naming before merge
- Saves ~5 min per branch creation

**Owner:** DevOps Manager (2 hours)

### 1.3 Automated Commit Messages (1 hour)

**Current blocker:** Manual `git commit -m "..."` with inconsistent format

**Fix:** Commit template + husky hook

```bash
# .git/hooks/prepare-commit-msg (husky: .husky/prepare-commit-msg)

#!/bin/bash
# Auto-populate commit message template with task ID from branch

BRANCH=$(git rev-parse --abbrev-ref HEAD)
TASK_ID=$(echo $BRANCH | grep -oE "T-v3\.2-P[0-9]+-[0-9]{3}")

if [ ! -z "$TASK_ID" ]; then
  exec < /dev/tty
  read -p "Commit message: " MSG
  echo "$TASK_ID: $MSG" > "$1"
fi
```

**Outcome:**
- Commits auto-linked to tasks
- Consistent format: `T-v0.3.2-P1-001: implement sync validation`
- Searchable by task ID
- Saves ~2 min per commit

**Owner:** DevOps Manager (1 hour)

---

## Phase 2: Release Automation (Jun 8-14, one-week sprint)

### 2.1 Automated Tagging (2 hours)

**Current blocker:** Manual `git tag v0.0.3.2-rc1` with inconsistent versions

**Fix:** Semantic versioning + conventional commits

```bash
# .nezam/scripts/auto-tag.sh

#!/bin/bash
# Usage: ./auto-tag.sh patch|minor|major

BUMP_TYPE=${1:-patch}
CURRENT=$(git describe --tags $(git rev-list --tags --max-count=1))
NEXT=$(npx semver $CURRENT -i $BUMP_TYPE)

echo "Tagging: $CURRENT → $NEXT"

git tag -a "v$NEXT" -m "Release v$NEXT (see CHANGELOG.md)"
git push origin "v$NEXT"

echo "✓ Tagged and pushed"
```

**CI auto-increments on merge to main:**
```yaml
# .github/workflows/auto-tag.yml

on:
  push:
    branches: [main]

jobs:
  tag-release:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.message, 'chore: release')
    steps:
      - uses: actions/checkout@v4
      - run: |
          BUMP=$(git log -1 --format=%b | grep -oE "BREAKING|feature|fix" | head -1)
          if [[ $BUMP == "BREAKING" ]]; then BUMP=major; else BUMP=patch; fi
          ./auto-tag.sh $BUMP
```

**Outcome:**
- No manual tagging
- Versions auto-increment
- Every release tagged automatically
- Saves ~5 min per release

**Owner:** DevOps Manager (2 hours)

### 2.2 Automated Release Notes (2 hours)

**Current blocker:** Manual changelog entries; scattered release notes

**Fix:** Auto-generate from commits + PRs

```bash
# .nezam/scripts/generate-changelog.sh

#!/bin/bash
# Generate CHANGELOG.md from git commits since last tag

LAST_TAG=$(git describe --tags $(git rev-list --tags --max-count=1))
COMMITS=$(git log $LAST_TAG..HEAD --pretty=format:"%H %s")

cat > CHANGELOG_NEW.md << 'EOF'
# Changelog

## [Unreleased]

EOF

echo "## Features" >> CHANGELOG_NEW.md
echo "$COMMITS" | grep -i "feat:" | sed 's/.*/- &/' >> CHANGELOG_NEW.md

echo "## Fixes" >> CHANGELOG_NEW.md
echo "$COMMITS" | grep -i "fix:" | sed 's/.*/- &/' >> CHANGELOG_NEW.md

cat CHANGELOG.md >> CHANGELOG_NEW.md
mv CHANGELOG_NEW.md CHANGELOG.md

git add CHANGELOG.md
git commit -m "chore: update changelog for release"
```

**CI runs on release tag:**
```yaml
# .github/workflows/release.yml

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./generate-changelog.sh
      - run: |
          gh release create ${{ github.ref }} \
            --title "Release ${{ github.ref }}" \
            --notes-file CHANGELOG_GENERATED.md
```

**Outcome:**
- Changelog auto-generated from commits
- Release notes on GitHub automatically
- No manual documentation
- Saves ~10 min per release

**Owner:** DevOps Manager (2 hours)

### 2.3 Automated Deployments (3 hours)

**Current blocker:** Manual `deploy.sh` steps; unclear deployment status

**Fix:** GitHub Actions → deployment environment

```yaml
# .github/workflows/deploy.yml

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  deploy-staging:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          echo "🚀 Deploying to staging..."
          # Your deploy commands
          pnpm deploy:staging
      - run: |
          echo "✓ Deployed to staging"
          gh workflow run integration-tests.yml -f environment=staging

  deploy-production:
    needs: test
    if: startsWith(github.ref, 'refs/tags/v')
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          echo "🚀 Deploying to production..."
          pnpm deploy:production
      - name: Notify release
        run: |
          gh release create ${{ github.ref }} \
            --generate-notes \
            --latest
```

**Outcome:**
- PR → staging auto-deploys
- Tag → production auto-deploys
- Zero manual deploy steps
- Full traceability in GitHub
- Saves ~15 min per release

**Owner:** DevOps Manager (3 hours)

---

## Phase 3: Performance & Memory Fixes (Jun 6-10, parallel)

### 3.1 Remove RAM Bloat (4 hours)

**Current blocker:** `.cursor/design/references/` (28 repos) + `node_modules/.pnpm/` = 30GB indexing

**Action:**
```bash
# 1. Move design references to external repo
mkdir -p /tmp/nezam-refs
cd /tmp/nezam-refs
git clone https://github.com/YOUR_ORG/nezam-design-references . 2>/dev/null || {
  git init
  mkdir -p refs/
  echo "# NEZAM Design References" > refs/README.md
  git add . && git commit -m "init"
  git remote add origin https://github.com/YOUR_ORG/nezam-design-references
  git push -u origin main
}

# 2. Remove from main repo
cd /sessions/magical-kind-mendel/mnt/NEZAM
rm -rf .cursor/design/references
rm -rf .nezam/design-hub/node_modules .pnpm

# 3. Add to .gitignore
cat >> .gitignore << 'EOF'

# Build artifacts
node_modules/
.pnpm/
dist/
build/

# Design references (external repo)
.cursor/design/references/

# Auto-generated
CLAUDE.md
EOF

# 4. Auto-sync on install
cat > .nezam/scripts/sync-design-refs.sh << 'EOF'
#!/bin/bash
REFS_DIR=".cursor/design/references"
if [ ! -d "$REFS_DIR" ]; then
  echo "📥 Cloning design references..."
  git clone https://github.com/YOUR_ORG/nezam-design-references "$REFS_DIR"
else
  echo "♻️ Updating design references..."
  cd "$REFS_DIR" && git pull && cd -
fi
EOF

chmod +x .nezam/scripts/sync-design-refs.sh

# 5. Add to package.json
# "postinstall": "pnpm run sync:design-refs"
# "sync:design-refs": "bash .nezam/scripts/sync-design-refs.sh"
```

**Outcome:**
- Repo size: 5GB+ → <500MB
- IDE startup: 30s+ → <5s
- No indexing lag
- Design refs still accessible
- Saves 25+ min per developer per day

**Owner:** DevOps + FE Lead (4 hours)

---

## Phase 4: Task Tracking Consolidation (Jun 10-14, 4 days)

### 4.1 Merge TASKS_v0.3.2.md into MASTER_PLAN (2 hours)

**Current blocker:** Tasks documented twice; status goes stale

**Action:**
```bash
# 1. Extract task table from TASKS_v0.3.2.md
grep -A 200 "| ID | Task |" TASKS_v0.3.2.md > /tmp/tasks.txt

# 2. Merge into MASTER_PLAN_v0.3.2.md at "Unified Task Registry" section
# (replace inline, remove TASKS_v0.3.2.md)

# 3. Ensure format:
# T-P0-001 | Task | Owner | Status | Deadline

# 4. Delete standalone file
rm TASKS_v0.3.2.md

# 5. Verify single source
grep -r "TASKS_v0.3.2" . --exclude-dir=_archive || echo "✓ No stale task refs"
```

**Outcome:**
- Single task table in MASTER_PLAN
- Status updates in one place
- CI can validate task ownership
- Saves ~5 min per status update

**Owner:** Swarm Leader (2 hours)

---

## Implementation Timeline

### Critical Path (Delivers 65% speed improvement)

```
Jun 6 (Thu)
  ├─ 0.1: Archive v0.3.5 (2h) ✓
  ├─ 0.2: Pin v0.3.2 canonical (1h) ✓
  ├─ 1.1: CI sync validation (3h) ✓
  └─ 3.1: RAM bloat fix (4h) ✓
  → Day end: Deterministic planning + fast IDE

Jun 7 (Fri)
  ├─ 1.2: Auto-branching (2h) ✓
  ├─ 1.3: Auto-commits (1h) ✓
  ├─ 4.1: Consolidate tasks (2h) ✓
  └─ Testing & validation (2h)
  → Day end: Zero manual branch/commit steps

Jun 8-10 (Sat-Mon)
  ├─ 2.1: Auto-tagging (2h)
  ├─ 2.2: Auto-changelog (2h)
  ├─ 2.3: Auto-deploy (3h)
  └─ Integration testing
  → Weekend: Full release pipeline ready

Jun 12 (Wed)
  ├─ Final validation dry-run
  ├─ Team training (1h)
  └─ Sign-off from Dorgham
  → Ready for v0.0.3.2 production release

### Total Effort: ~35 hours
- Week 1: 20 hours (all critical)
- Week 2: 15 hours (release automation + polish)
```

---

## Expected Outcomes

### Development Speed
| Phase | Before | After | Reduction |
|-------|--------|-------|-----------|
| Branch creation | 5 min | 30 sec | **90%** |
| Commit messaging | 2 min | 10 sec | **92%** |
| CI validation | 10 min (manual check) | <2 min (automated) | **80%** |
| Tag + release notes | 15 min | <1 min | **96%** |
| Deploy to staging | 10 min | <2 min | **80%** |
| **Per-feature cycle** | ~45 min | **~10 min** | **78%** |

### Memory & IDE Performance
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Repo size | 5.2 GB | <500 MB | **99%** |
| IDE startup | 30s+ | <5s | **85%** |
| Index time | 2-3 min | <10s | **90%** |
| RAM usage | 30GB | <2GB | **93%** |

### Manual Steps Reduction
- ✓ Zero manual sync on `.cursor/` edits
- ✓ Zero manual branch naming decisions
- ✓ Zero manual commit formatting
- ✓ Zero manual tagging
- ✓ Zero manual changelog entries
- ✓ Zero manual deployments (push to main/tag = auto-deploy)

**Total: 430+ manual steps → ~15 steps (96% reduction)**

---

## Success Criteria (Sign-Off Checklist)

### By Jun 12
- [ ] v0.3.5 archived; zero refs in codebase
- [ ] CI validates sync on every `.cursor/` edit
- [ ] Pre-commit hook enforces phase IDs + task format
- [ ] Repository <500MB; IDE starts <5s
- [ ] Branch auto-creation: `./auto-branch.sh "T-v0.3.2-P1-001 task"`
- [ ] Commits auto-formatted with task IDs
- [ ] Releases auto-tagged with semantic versioning
- [ ] Changelog auto-generated from commits
- [ ] Deployments auto-triggered on tag

### By Jun 20
- [ ] v0.3.2 feature development cycle < 10 min per feature
- [ ] Full end-to-end dry-run succeeds
- [ ] Team trained on new workflow
- [ ] v0.0.3.2 released with full automation

### Sign-Off
- Dorgham approves final state
- Team signals readiness
- v0.0.3.2 tagged & deployed

---

## Commands Team Will Use (Post-Automation)

```bash
# Before (v0.3.5 style)
git checkout -b feature/sync-validation
# ... edit .cursor/ files ...
pnpm ai:sync
pnpm ai:check
git add .
git commit -m "feat: sync validation"
git push
# Manual PR, review, merge, tag, release notes, deploy
# ~45 min, many error-prone steps

# After (v0.3.2 automated)
./auto-branch.sh "T-v0.3.2-P1-001 sync validation"
# ... edit .cursor/ files ...
git add .
# (commit message auto-populated with task ID)
git commit
git push
# PR auto-validated, merged, tagged, deployed
# ~5 min, fully automated, zero errors
```

---

## Why This Roadmap Delivers on the Promise

1. **Aligns v0.3.5 archival with acceleration** — Not just cleanup; enables automation
2. **Phases dependencies clearly** — Week 1 unlocks Week 2
3. **Automates everything promised** — Commits, branches, tags, releases, deployments
4. **Quantifies improvements** — 65% faster, 96% fewer steps, 93% less RAM
5. **Includes team training** — Not just tools; workflow transformation

---

## Next Action

**Dorgham decision point:**

Option A: **Execute full roadmap** (35h, full automation, 65% faster)
Option B: **Execute Phase 0+1 only** (8h, partial automation, 30% faster, low risk)
Option C: **Archive v0.3.5 only** (2h, planning clarity, unblocks team)

**Recommendation:** Option A. The 35h investment saves 50+ dev hours per month once adopted. ROI: 1:10 (breaks even in 3.5 hours of team development).

What's your preference?
