# Post-Release Tasks — NEZAM v1.0.0
## Detailed Roadmap for Production Stabilization & Optimization

**Target:** Execute in 1-2 weeks after v1.0.0 ships.

**Status:** Planned for execution after R1 release  
**Estimated duration:** 8-10 hours (spread across week)  
**Owner:** Engineering + DevOps team  
**Timeline:** 2026-06-11 to 2026-06-18

---

## Overview

After NEZAM v1.0.0 ships, three categories of work follow:

1. **Immediate Stabilization (Day 1-2)** — Monitor production, address critical issues
2. **Performance Optimization (R2, Day 3-7)** — Reduce RAM, improve indexing
3. **Documentation & Onboarding (R3, Day 8-14)** — Set up `/START` flow, create guides

---

## Phase A: Immediate Stabilization (24-48 hours)

### A.1 Monitor Release Health

**Task:** Track early adoption issues and crash reports.

**Checklist:**
- [ ] **GitHub Monitoring:**
  - [ ] Check GitHub Issues for new bug reports: https://github.com/your-org/nezam/issues
  - [ ] Look for issues tagged `bug` or `release:v1.0.0`
  - [ ] Respond to issues within 1 hour if production-blocking
  - [ ] Categorize: critical, high, medium, low

- [ ] **CI/CD Health:**
  - [ ] Verify `release.yml` completed successfully
  - [ ] Check for any failed post-release workflows
  - [ ] Confirm NPM package published (if applicable):
    ```bash
    npm view @your-org/nezam@1.0.0
    ```
  - [ ] Verify GitHub Release page is populated:
    https://github.com/your-org/nezam/releases/tag/v1.0.0

- [ ] **Performance Baseline:**
  - [ ] Collect RAM usage reports from early users (ask via Slack/email)
  - [ ] Benchmark CI pipeline time (should be < 10 min):
    ```bash
    # Check latest CI run time in GitHub Actions
    ```
  - [ ] Note any slow-down since release

- [ ] **User Feedback:**
  - [ ] Check Slack #engineering for questions/issues
  - [ ] Review first 10 users' `/START design` executions
  - [ ] Identify any stuck hardlock gates (users unable to progress)

**Success criteria:**
- ✅ No critical issues identified
- ✅ GitHub Release shows successful deployment
- ✅ Performance baseline collected
- ✅ Early feedback documented

**Commands:**
```bash
# Check GitHub Release
curl -s https://api.github.com/repos/your-org/nezam/releases/tags/v1.0.0 | jq '.name, .published_at'

# Check NPM (if published)
npm view @your-org/nezam@1.0.0 | head -20

# Monitor CI time
# (Manual: check GitHub Actions latest run)
```

---

### A.2 Create Critical Hotfix Process

**Task:** Document how to create and ship hotfixes for v1.0.0.

**Checklist:**
- [ ] Create `.github/HOTFIX_PROCESS.md`:
  ```markdown
  # Hotfix Process for NEZAM v1.0.0

  ## When to hotfix
  - Production-blocking bugs (hardlock gates fail, `/START` crashes)
  - Security issues
  - Data loss issues

  ## Hotfix branch naming
  ```bash
  git checkout -b hotfix/1.0.1-<issue-name>
  # Example: hotfix/1.0.1-sdd-gate-crash
  ```

  ## Process
  1. Fix the bug on hotfix branch
  2. Increment patch version: 1.0.0 → 1.0.1
  3. Update CHANGELOG.md
  4. Create PR, get 1+ review
  5. Merge to main
  6. Run `/GIT release` (will create v1.0.1)

  ## Example
  ```bash
  git checkout main
  git pull origin main
  git checkout -b hotfix/1.0.1-gate-fix
  # ... fix code ...
  git commit -m "fix(hardlock): resolve gate validation crash"
  git push origin hotfix/1.0.1-gate-fix
  # Create PR on GitHub
  ```
  ```
- [ ] Add hotfix trigger to `.github/workflows/ci.yml`:
  ```yaml
  on:
    pull_request:
      branches:
        - main
        - hotfix/**  # Include hotfix branches
  ```
- [ ] Test hotfix process with a non-critical fix (optional)

**Success criteria:**
- ✅ HOTFIX_PROCESS.md created
- ✅ CI/CD includes hotfix branches
- ✅ Team is aware of process

---

### A.3 Create Production Support Runbook

**Task:** Document how to support users running v1.0.0.

**Checklist:**
- [ ] Create `.nezam/core/docs/SUPPORT_RUNBOOK.md`:
  ```markdown
  # NEZAM v1.0.0 Support Runbook

  ## Common Issues & Solutions

  ### Issue: `/START design` hangs or times out
  **Symptom:** CLI prompt appears but no response after selecting product type
  **Solution:**
  1. Kill the process: `Ctrl+C`
  2. Clear cache: `rm -rf .nezam/core/cache/*` (if exists)
  3. Retry: `/START design`
  4. If persists, report to #engineering with OS and Node version

  ### Issue: Hardlock gate rejects valid input
  **Symptom:** Cannot proceed to next phase despite meeting requirements
  **Solution:**
  1. Verify file exists: `ls .nezam/core/plans/0N-*/*.md`
  2. Check file content is valid: `head -20 <file.md>`
  3. Run validation: `pnpm ai:check:sdd`
  4. If gate still rejects, it may be a bug—report with file contents

  ### Issue: Design Hub won't start
  **Symptom:** `pnpm wireframe:server` fails or times out
  **Solution:**
  1. Kill any existing process: `pkill -f "node.*design-hub"`
  2. Clean build: `cd .nezam/design-hub && rm -rf .next && pnpm build`
  3. Start fresh: `pnpm wireframe:server`
  4. Access: http://localhost:4000

  ## Escalation
  If issue persists after troubleshooting:
  1. Gather logs: `pnpm ai:check 2>&1 > /tmp/nezam-debug.log`
  2. Attach log to GitHub issue
  3. Include: OS, Node version, NEZAM version
  ```
- [ ] Add link to runbook in README.md:
  ```markdown
  [Support Runbook](./.nezam/core/docs/SUPPORT_RUNBOOK.md)
  ```

**Success criteria:**
- ✅ Runbook created with 3-5 common issues
- ✅ Solutions are clear and testable
- ✅ Escalation process documented

---

## Phase B: Performance Optimization (R2, Days 3-7)

### B.1 Move `references/` Out of Workspace (P1)

**Task:** Remove 28-repo vendor tree from workspace to save 20+ GB RAM.

**Duration:** ~1 hour  
**Risk:** Low (references are read-only, not in history)

**Checklist:**
- [ ] **Create fetch script:**
  ```bash
  mkdir -p scripts/setup
  cat > scripts/setup/fetch-references.sh << 'EOF'
  #!/bin/bash
  set -e

  REF_DEST="$HOME/nezam-references"
  NEZAM_REFS=".cursor/design/references"

  echo "📦 Fetching NEZAM reference materials..."
  mkdir -p "$REF_DEST"

  # Clone/sync reference repos
  # Option A: From GitHub (fastest)
  if [ -d "$REF_DEST/open-design-main" ]; then
    echo "  ✓ References already present at $REF_DEST"
    exit 0
  fi

  # Option B: Copy from archive or clone repos
  echo "  Cloning reference repos to $REF_DEST..."
  git clone https://github.com/penpot/penpot-design-main.git "$REF_DEST/open-design-main" --depth=1 2>/dev/null || echo "  ⚠ Could not clone, manual setup required"

  echo "✅ Done. Update .cursor/commands/design.md to reference $REF_DEST"
  EOF
  chmod +x scripts/setup/fetch-references.sh
  ```

- [ ] **Test fetch script:**
  ```bash
  scripts/setup/fetch-references.sh
  # Expected: References fetched to $HOME/nezam-references/
  ```

- [ ] **Remove references from workspace:**
  ```bash
  rm -rf .cursor/design/references
  git add -A
  git commit -m "perf(r2): move references tree out of workspace

  - Removed .cursor/design/references/ (28 repos)
  - Scripts/setup/fetch-references.sh now provides on-demand hydration
  - Reduces workspace file indexer pressure
  - Expected RAM savings: 20+ GB
  - Fixes AUDIT_2026-06-04 P1 finding"
  git push origin main
  ```

- [ ] **Update contracts to reference external location:**
  - [ ] Edit `.cursor/commands/design.md`:
    ```markdown
    # Reference Files
    See $HOME/nezam-references/ for design reference materials.
    Run scripts/setup/fetch-references.sh to download.
    ```
  - [ ] Edit `.cursor/commands/design-hub.md` similarly
  - [ ] Update `README.md` setup section

- [ ] **Add to CI (optional):**
  Create `.github/workflows/update-references-nightly.yml`:
  ```yaml
  name: Update References (Nightly)
  on:
    schedule:
      - cron: '0 2 * * *'  # 2 AM UTC daily

  jobs:
    update:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Fetch references
          run: scripts/setup/fetch-references.sh
        - name: Commit if changed
          run: |
            git config user.name "Bot"
            git config user.email "bot@example.com"
            git add -A
            git commit -m "chore: update reference materials" || echo "No changes"
            git push
  ```

- [ ] **Verify workspace is cleaner:**
  ```bash
  # Should show significant reduction in .cursor size
  du -sh .cursor/
  du -sh .nezam/
  ```

**Success criteria:**
- ✅ `scripts/setup/fetch-references.sh` exists and runs
- ✅ `.cursor/design/references/` is removed
- ✅ Contracts updated with new location
- ✅ Workspace size reduced by ≥500 MB

**Commands:**
```bash
# Full sequence
chmod +x scripts/setup/fetch-references.sh
scripts/setup/fetch-references.sh
rm -rf .cursor/design/references
git add -A && git commit -m "perf(r2): move references tree out of workspace"
git push origin main
du -sh .cursor/  # Verify size reduction
```

---

### B.2 Add watcherExclude for Heavy Directories (P2)

**Task:** Prevent file watcher from re-indexing node_modules, .next, etc.

**Duration:** ~10 minutes  
**Risk:** None (config-only, no code changes)

**Checklist:**
- [ ] Create `.vscode/settings.json` (or update if exists):
  ```json
  {
    "files.watcherExclude": {
      "**/.next": true,
      "**/.gatsby": true,
      "**/node_modules/**": true,
      "**/.git/**": true,
      "**/.idea/**": true,
      "**/dist/**": true,
      "**/build/**": true,
      ".nezam/design-hub/node_modules": true,
      ".nezam/design-hub/.next": true,
      ".nezam/design-hub/tsconfig.tsbuildinfo": true
    },
    "search.exclude": {
      "**/node_modules": true,
      "**/.next": true,
      "dist": true,
      "build": true
    }
  }
  ```

- [ ] Create `.editorconfig` for consistency (optional):
  ```ini
  root = true

  [*]
  charset = utf-8
  end_of_line = lf
  insert_final_newline = true
  trim_trailing_whitespace = true

  [*.{js,ts,tsx,jsx,json}]
  indent_style = space
  indent_size = 2

  [*.md]
  trim_trailing_whitespace = false
  ```

- [ ] Commit:
  ```bash
  git add .vscode/settings.json .editorconfig
  git commit -m "perf(r2): exclude heavy directories from file watcher

  - Added watcherExclude for node_modules, .next, .git, dist, build
  - Added search.exclude for common build artifacts
  - Reduces indexer pressure on every file save
  - Expected RAM savings: 2-3 GB
  - Part of AUDIT_2026-06-04 P2 optimization"
  git push origin main
  ```

- [ ] Notify team to reload VSCode:
  ```markdown
  Push notification to Slack:
  "✅ watcherExclude added to .vscode/settings.json
  Please reload VSCode for changes to take effect.
  This should improve performance when saving files."
  ```

**Success criteria:**
- ✅ `.vscode/settings.json` committed
- ✅ watcherExclude includes node_modules, .next, .git
- ✅ Team is notified to reload editors

**Commands:**
```bash
# Create settings
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "files.watcherExclude": { ... }
}
EOF

# Commit
git add .vscode/settings.json
git commit -m "perf(r2): exclude heavy directories from file watcher"
git push origin main
```

---

### B.3 Prune Unused Tool Mirrors (P3, Optional)

**Task:** Remove unused tool mirrors to reduce workspace file count by 3000+ files.

**Duration:** ~20 minutes  
**Risk:** Very low (can be regenerated anytime with `pnpm ai:sync`)

**Checklist:**
- [ ] **Inventory active tools:**
  ```bash
  # Check which tools are actually used in documentation
  grep -r "\.windsurf\|\.opencode\|\.codex\|\.gemini\|\.qwen\|\.kilo\|\.kiro\|\.antigravity" . \
    --include="*.md" --include="*.sh" --include="*.js" 2>/dev/null | cut -d: -f1 | sort -u
  ```

- [ ] **Decision matrix:**
  | Tool | Used? | Keep? | Notes |
  |------|-------|-------|-------|
  | `.cursor` | ✅ | YES | Primary source |
  | `.claude` | ✅ | YES | Cowork mode |
  | `.windsurf` | ? | If using | IDE extension |
  | `.opencode` | ? | If using | (Determine) |
  | `.codex` | ❌ | NO | Prune |
  | `.gemini` | ❌ | NO | Prune |
  | `.qwen` | ❌ | NO | Prune |
  | `.kilo` / `.kilocode` | ❌ | NO | Prune |
  | `.antigravity` / `.antigravitycli` | ❌ | NO | Prune |
  | `.kiro` | ❌ | NO | Prune |

- [ ] **Edit sync config to match decision:**
  Edit `.nezam/core/scripts/sync/sync-ai-folders.js`:
  ```js
  const SYNC_TARGETS = [
    '.cursor',        // Keep: source
    '.claude',        // Keep: Cowork
    '.windsurf',      // Keep: if using
    // Remove everything else
  ];
  ```

- [ ] **Remove unused mirrors:**
  ```bash
  rm -rf .opencode .codex .gemini .qwen .kilo .kilocode .kiro .antigravity .antigravitycli
  git add -A
  git commit -m "refactor(r2): prune unused tool mirrors

  - Removed .opencode, .codex, .gemini, .qwen, .kilo, .kilocode, .kiro, .antigravity
  - Kept .cursor, .claude, .windsurf
  - Reduces workspace file count by 3000+ files
  - File watcher will process changes faster
  - Part of AUDIT_2026-06-04 P2 optimization"
  git push origin main
  ```

- [ ] **Verify sync still works:**
  ```bash
  pnpm ai:sync --status
  pnpm ai:check
  # Both should pass without errors
  ```

- [ ] **Measure impact:**
  ```bash
  # Count files before/after
  find . -type f | wc -l
  # Should show reduction of 3000+ files
  ```

**Success criteria:**
- ✅ Unused mirrors removed
- ✅ `pnpm ai:sync && pnpm ai:check` passes
- ✅ File count reduced by 3000+
- ✅ CI pipeline time unchanged or faster

**Commands:**
```bash
# Decision: which to keep?
grep -r "\.windsurf\|\.opencode\|\.codex" . --include="*.md" --include="*.sh" 2>/dev/null | wc -l

# Remove unused
rm -rf .opencode .codex .gemini .qwen .kilo .kilocode
git add -A && git commit -m "refactor(r2): prune unused tool mirrors"
git push origin main

# Verify
pnpm ai:sync && pnpm ai:check
du -sh .  # Verify workspace size reduced
```

---

### B.4 Add `pre-push` Branch-Name Guard (B1)

**Task:** Prevent accidental pushes from non-compliant branch names.

**Duration:** ~15 minutes  
**Risk:** None (safety feature, doesn't affect normal workflow)

**Checklist:**
- [ ] **Create pre-push hook:**
  ```bash
  mkdir -p .githooks
  cat > .githooks/pre-push << 'EOF'
  #!/bin/bash

  # Pre-push hook: Enforce branch naming convention
  # Allowed: feature/<spec-id>-<slug>, release/x.y.z, hotfix/x.y.z, main

  BRANCH=$(git rev-parse --abbrev-ref HEAD)

  if [[ ! $BRANCH =~ ^(main|feature|release|hotfix)(/|$) ]]; then
    echo ""
    echo "❌ ERROR: Branch name '$BRANCH' does not match NEZAM naming convention"
    echo ""
    echo "Allowed patterns:"
    echo "  ✓ main                          (protected branch)"
    echo "  ✓ feature/<spec-id>-<slug>     (e.g., feature/f-001-auth)"
    echo "  ✓ release/x.y.z                (e.g., release/1.0.0)"
    echo "  ✓ hotfix/x.y.z                 (e.g., hotfix/1.0.1)"
    echo ""
    echo "Rename your branch before pushing:"
    echo "  git branch -m <new-name>"
    echo ""
    exit 1
  fi

  exit 0
  EOF
  chmod +x .githooks/pre-push
  ```

- [ ] **Configure git to use hooks:**
  ```bash
  git config core.hooksPath .githooks
  # Verify
  git config core.hooksPath
  # Should show: .githooks
  ```

- [ ] **Test hook:**
  ```bash
  # Create a test branch with bad name
  git checkout -b temp-test
  # Try to push (should be rejected)
  git push origin temp-test
  # Expected: ❌ ERROR: Branch name 'temp-test' does not match...

  # Clean up
  git checkout main
  git branch -D temp-test
  ```

- [ ] **Commit the hook:**
  ```bash
  git add .githooks/pre-push
  git commit -m "chore(git): add pre-push branch-name guard

  - Prevents pushes from branches not matching NEZAM naming convention
  - Allowed: feature/<spec-id>-<slug>, release/x.y.z, hotfix/x.y.z, main
  - Helpful error message guides users to fix
  - Fixes AUDIT_2026-06-04 B1 finding"
  git push origin main
  ```

- [ ] **Notify team:**
  ```markdown
  Slack announcement:
  "🔒 New: Pre-push branch-name guard added
  Your local repo will now validate branch names before pushing.
  This ensures we follow NEZAM's naming convention.
  Run `git config core.hooksPath` to verify hooks are enabled."
  ```

**Success criteria:**
- ✅ `.githooks/pre-push` created and executable
- ✅ `git config core.hooksPath` shows `.githooks`
- ✅ Test push from bad branch name is rejected
- ✅ Hook is committed and documented

**Commands:**
```bash
# Setup
mkdir -p .githooks
cat > .githooks/pre-push << 'EOF'
#!/bin/bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ ! $BRANCH =~ ^(main|feature|release|hotfix)(/|$) ]]; then
  echo "❌ ERROR: Branch name '$BRANCH' does not match convention"
  exit 1
fi
exit 0
EOF
chmod +x .githooks/pre-push
git config core.hooksPath .githooks

# Test
git checkout -b temp-test && git push origin temp-test  # Should fail
git checkout main && git branch -D temp-test

# Commit
git add .githooks/pre-push && git commit -m "chore(git): add pre-push guard"
```

---

### B.5 Create & Document Main Branch-Protection Rules (B2)

**Task:** Export current branch-protection rules as a checklist.

**Duration:** ~10 minutes  
**Risk:** None (documentation-only)

**Checklist:**
- [ ] **Visit GitHub Settings:**
  Go to: Settings → Branches → main → Edit rule

- [ ] **Document current rules:**
  Create `BRANCH_PROTECTION_CHECKLIST.md`:
  ```markdown
  # GitHub Branch Protection Rules: `main`

  ## Status: ✅ ACTIVE

  This document reflects the branch protection settings for the `main` branch.
  Use this as a reference for audits and as a guide for applying similar rules to other branches.

  ### Access Control
  - [ ] **Require a pull request before merging**
    - ✅ Required approvals: 1
    - ✅ Dismiss stale pull request approvals when new commits are pushed
    - ✅ Require review from Code Owners

  ### Status Checks
  - [ ] **Require status checks to pass before merging**
    - ✅ Require branches to be up-to-date before merging
    - Specific checks required:
      - [ ] ci (main test + lint pipeline)
      - [ ] sdd-gate-enforcement (SDD hardlock validation)
      - [ ] design-gates (design spec validation)
      - [ ] wireframe-validation (wireframes_locked.json validation)
      - [ ] sync-and-drift-check (multi-tool mirror sync)

  ### Restrictions
  - [ ] **Restrict who can push to matching branches**
    - Restrict pushes to: OWNERS only
    - Allow force pushes: ❌ NO
  - [ ] **Restrict who can dismiss pull request reviews**
    - Restrict to: OWNERS only
  - [ ] **Restrict who can delete matching branches**
    - Restrict to: OWNERS only

  ### Additional Rules
  - [ ] **Require signed commits**
    - Status: RECOMMENDED (enforce if team uses GPG/SSH signing)
  - [ ] **Require conversation resolution**
    - Status: OPTIONAL (implement if code review discussions are lengthy)

  ---

  ## How to Apply (if resetting from scratch)

  1. Go to GitHub repo Settings → Branches
  2. Click "Add rule" for branch `main`
  3. Check all boxes above
  4. Save rule

  ## Last Verified
  - **Date:** 2026-06-04
  - **Verified by:** [Your name]
  - **Next audit:** 2026-09-04 (quarterly)

  ## Related Documents
  - [HOTFIX_PROCESS.md](.github/HOTFIX_PROCESS.md)
  - [Pre-Release Tasks](./docs/reports/PRE_RELEASE_TASKS.md)
  ```

- [ ] **Verify rules in GitHub UI:**
  - [ ] Go to Settings → Branches → main
  - [ ] Screenshot current state (for audit trail)
  - [ ] Cross-check with checklist

- [ ] **Commit checklist:**
  ```bash
  git add BRANCH_PROTECTION_CHECKLIST.md
  git commit -m "docs(branch-policy): export main protection rules as checklist

  - Documents required approvals: 1+
  - Documents required status checks: 5 CI workflows
  - Documents access restrictions: OWNERS only
  - Serves as reference for audits and replication
  - Fixes AUDIT_2026-06-04 B2 finding"
  git push origin main
  ```

**Success criteria:**
- ✅ BRANCH_PROTECTION_CHECKLIST.md created
- ✅ All rules documented
- ✅ Matches current GitHub Settings
- ✅ Committed to repo

---

### B.6 Measure Performance Improvements

**Task:** Quantify RAM/performance gains from R2 optimizations.

**Duration:** ~20 minutes  
**Risk:** None (measurement-only)

**Checklist:**
- [ ] **Baseline measurement:**
  Document pre-optimization state (from A.1):
  ```markdown
  ## Performance Baseline — Pre-R2

  - **Workspace size:** `du -sh .`  → [result]
  - **Indexer files:** `find . -type f | wc -l` → [result]
  - **AI contracts:** `find .cursor -type f | wc -l` → [result]
  - **Design Hub deps:** `du -sh .nezam/design-hub/node_modules/` → [result]
  - **Claude app RAM:** [User-reported baseline] → [result]
  - **CI pipeline time:** [GitHub Actions log] → [result]
  ```

- [ ] **Post-R2 measurement (after all R2 tasks complete):**
  ```bash
  # Workspace size
  du -sh .  # Target: 30-50% reduction if P1+P2 complete

  # File count
  find . -type f | wc -l  # Target: 3000+ fewer files

  # Build time
  time pnpm ai:sync  # Target: same or faster
  time pnpm ai:check  # Target: same or faster

  # Design Hub size (if optimized)
  du -sh .nezam/design-hub/  # Should be 200-400 MB if node_modules pruned
  ```

- [ ] **User feedback:**
  - [ ] Send anonymous survey to early adopters:
    ```markdown
    "How's the performance?
     - Great, no issues
     - Okay, minor lag
     - Slow, noticeable delays
     - Very slow, affects productivity

     Optional: Describe your setup (OS, RAM, SSD?)
    ```
  - [ ] Collect responses over 3-5 days
  - [ ] Analyze common themes

- [ ] **Document results:**
  Create `docs/reports/PERFORMANCE_REPORT_2026-06-04.md`:
  ```markdown
  # NEZAM v1.0.0 Performance Report

  ## Pre-R2 (Baseline)
  - Workspace size: X GB
  - Files indexed: Y thousand
  - Claude app RAM: Z GB
  - CI time: A minutes

  ## Post-R2 (After optimization)
  - Workspace size: X' GB (reduction: (X-X')/X * 100%)
  - Files indexed: Y' thousand
  - Claude app RAM: Z' GB (reduction: (Z-Z')/Z * 100%)
  - CI time: A' minutes

  ## Improvements
  - ✅ Moved references/ tree (P1): saved ~20 GB
  - ✅ Added watcherExclude (P2): saved ~2-3 GB
  - ✅ Pruned mirrors (P3): reduced files by 3000+

  ## Feedback from users
  - [Summary of survey responses]

  ## Remaining optimization opportunities
  - [Design Hub as workspace package (future)]
  - [Further mirror optimization (if needed)]
  ```

- [ ] **Commit results:**
  ```bash
  git add docs/reports/PERFORMANCE_REPORT_2026-06-04.md
  git commit -m "docs(perf): post-R2 performance measurements

  - Baseline vs. post-optimization comparison
  - P1, P2, P3 results quantified
  - User feedback summary
  - Identifies remaining optimization opportunities"
  git push origin main
  ```

**Success criteria:**
- ✅ Baseline measurements documented
- ✅ Post-R2 measurements collected
- ✅ At least 20% reduction in workspace size or RAM
- ✅ Performance report published

---

## Phase C: Documentation & Onboarding (R3, Days 8-14)

### C.1 Create `/START Design` Onboarding Guide

**Task:** Document how to use the `/START design` command for new users.

**Duration:** ~1 hour  
**Audience:** New users, first-time SDD users

**Checklist:**
- [ ] **Create `.nezam/core/docs/START_DESIGN_GUIDE.md`:**
  ```markdown
  # Getting Started: `/START Design`

  The `/START design` command initializes a new NEZAM project with the correct SDD phase structure.

  ## What it does
  1. Detects your product type (website, webapp, saas, mobile, or monorepo)
  2. Creates `.nezam/core/plans/` with the appropriate phase folders
  3. Sets up hardlock gates to enforce phase progression
  4. Creates a checklist of deliverables per phase

  ## Running the command

  ### Basic usage
  ```bash
  /START design
  ```

  ### What you'll see
  ```
  🚀 Initializing NEZAM SDD Pipeline...

  1. Product Type Detection
     What are you building? (select one)
     → website / marketing landing
     → web application (SaaS lite)
     → SaaS platform (multi-tenant, billing)
     → mobile app (iOS/Android)
     → monorepo (multiple apps)

  2. Project Configuration
     Project name: [default: current-dir-name]
     Team size: [small | medium | large]
     Target markets: [default: global]
  ```

  ### After `/START design` completes
  Your `.nezam/core/plans/` folder is set up:
  ```
  .nezam/core/plans/
  ├── 00-define/          ← Start here: create PRD.md
  ├── 01-research/        ← Phase locked until 00-define is complete
  ├── 02-ia/
  ├── 03-content/
  ├── 04-architecture/
  ├── 05-design/
  ├── 06-scaffold/
  ├── 07-build/
  ├── 08-harden/
  └── 09-ship/
  ```

  ## Phase Progression

  Each phase requires a specific deliverable to unlock the next phase.

  ### Phase 00-define (Start)
  **Deliverable:** `PRD.md`
  **What to do:**
  1. Write a product requirements document
  2. Include: product type, target users, success metrics, timeline
  3. Save to `.nezam/core/plans/00-define/PRD.md`

  **Check:** Is PRD.md complete?
  → Yes: Run `pnpm ai:check:sdd` → Unlocks phase 01-research

  ### Phase 01-research (Content-First or Architecture-First)
  **For websites (content-first):**
  - Deliverable: `SEO_RESEARCH.md`
  - Find: keyword clusters, search intent, competitor gaps
  - Output: Keyword map → Page list → URL structure

  **For SaaS (architecture-first):**
  - Deliverable: `MARKET_RESEARCH.md`
  - Find: competitor features, market gaps, user personas
  - Output: Features list → Data model design

  ### Phase 02-ia (Information Architecture)
  **Deliverable:** `IA_CONTENT.md`
  **What to do:**
  - Map pages/screens (from phase 01)
  - Create navigation labels
  - Plan URL slugs
  - Create sitemap

  ### Phase 03-content
  **Deliverable:** `CONTENT_MAP.md`
  **What to do:**
  - Write copy per page/screen
  - Define CTAs, headlines, microcopy
  - Add metadata (title tags, descriptions)

  ### Phase 04-architecture
  **Deliverable:** `ARCHITECTURE.md`
  **What to do:**
  - Choose tech stack
  - Design data model
  - Plan API routes
  - Choose hosting/CMS

  ### Phase 05-design
  **Deliverable:** `DESIGN.md` + design tokens
  **What to do:**
  - Create design tokens (colors, typography, spacing)
  - Design component library
  - Create wireframes (next phase feeds into design hub)

  ### Phase 06-scaffold
  **Deliverable:** `PROJECT_SCAFFOLD.md`
  **What to do:**
  - Define folder structure
  - Configure build tools
  - Set up CI/CD
  - Create `scaffold.sh` to auto-generate folders

  ### Phase 07-build
  **Deliverable:** `SPEC.md` per feature/page
  **What to do:**
  - Create detailed specs for each page/feature
  - Link to design tokens
  - Include acceptance criteria

  ### Phase 08-harden
  **Deliverable:** Performance, SEO, a11y, security audits
  **What to do:**
  - Run Lighthouse audit
  - Check SEO (schema, canonical, hreflang)
  - Test accessibility (WCAG)
  - Security audit (dependencies, secrets)

  ### Phase 09-ship
  **Deliverable:** Deployment checklist + monitoring setup
  **What to do:**
  - Configure production environment
  - Set up monitoring (errors, performance)
  - Plan rollback strategy
  - Deploy!

  ## Checking Progress

  To see which phases are complete and which are locked:
  ```bash
  pnpm ai:check:sdd
  ```

  Output:
  ```
  ✓ Phase 00-define: COMPLETE (PRD.md present)
  ✓ Phase 01-research: COMPLETE (SEO_RESEARCH.md present)
  → Phase 02-ia: READY (01-research complete)
  ✗ Phase 03-content: LOCKED (requires 02-ia complete first)
  ```

  ## Hardlock Gates Explained

  A **hardlock gate** prevents you from proceeding to the next phase until prerequisites are met.

  **Example:** You cannot enter phase 03-content until 02-ia is complete, because:
  - Phase 02-ia produces: page list + URLs
  - Phase 03-content needs: those URLs (for internal links, metadata)
  - Without them: content is incomplete or invalid

  **If a gate rejects you:**
  1. Run `pnpm ai:check:sdd` to see what's missing
  2. Complete the previous phase's deliverable
  3. Re-run the check
  4. Gate should unlock

  ## Common Questions

  ### Q: Can I skip a phase?
  **A:** No. Hardlock gates prevent skipping. Each phase builds on the previous one.

  ### Q: Can I work on multiple phases in parallel?
  **A:** You can *draft* in parallel, but you can't *unlock* until prerequisites are complete.

  ### Q: How long does each phase take?
  **A:** Depends on project size:
  - Small (1 page): 00-09 in 1-2 weeks
  - Medium (10-20 pages): 2-4 weeks
  - Large (50+ pages + complex features): 6-8 weeks

  ### Q: What if I get stuck on a phase?
  **A:** Run `/HELP <phase-name>` for guidance. Or escalate to #engineering.

  ## Next Steps
  1. Run `/START design`
  2. Create `PRD.md` in `.nezam/core/plans/00-define/`
  3. Run `pnpm ai:check:sdd` to verify
  4. Proceed to phase 01-research

  Good luck! 🚀
  ```

- [ ] **Create interactive CLI help:**
  Edit `.cursor/commands/start.md` to include:
  ```markdown
  # Getting Started with SDD

  See [START_DESIGN_GUIDE.md](./.nezam/core/docs/START_DESIGN_GUIDE.md) for detailed walkthrough.

  **Quick start:**
  ```bash
  /START design         # Initialize new project
  pnpm ai:check:sdd    # Check phase progress
  /HELP <phase>        # Get help on a specific phase
  ```

- [ ] **Add to README.md:**
  Link to the guide in the main README

**Success criteria:**
- ✅ START_DESIGN_GUIDE.md created (2000+ words)
- ✅ Covers all 10 phases with examples
- ✅ Explains hardlock gates and why they exist
- ✅ Includes FAQ and troubleshooting
- ✅ Linked from README.md and .cursor/commands/start.md

---

### C.2 Create Phase Templates & Checklists

**Task:** Provide templates for each phase deliverable.

**Duration:** ~1.5 hours  
**Files to create:** 10 templates (one per phase)

**Checklist:**
- [ ] **Create `.nezam/core/templates/phases/` directory:**
  ```bash
  mkdir -p .nezam/core/templates/phases
  ```

- [ ] **Phase 00-define template:**
  ```bash
  cat > .nezam/core/templates/phases/00-define.PRD_TEMPLATE.md << 'EOF'
  # Product Requirements Document (PRD)

  ## Product Overview
  - **Name:** [Project name]
  - **Type:** [website | webapp | saas | mobile]
  - **Status:** [idea | planning | design | development | launched]

  ## Problem Statement
  What problem does this product solve?
  [Describe the user problem and why it matters]

  ## Target Users
  - **Primary:** [User persona 1]
  - **Secondary:** [User persona 2]
  - **Tertiary:** [User persona 3]

  ## Success Metrics
  - **Key metric 1:** [measurement] by [date]
  - **Key metric 2:** [measurement] by [date]

  ## Timeline
  - **Phase 1:** [dates] — [deliverable]
  - **Phase 2:** [dates] — [deliverable]

  ## Constraints
  - Technical: [e.g., must use Next.js]
  - Budget: [e.g., <$50k]
  - Time: [e.g., ship by 2026-06-30]
  - Compliance: [e.g., GDPR, HIPAA]

  ## Risks & Assumptions
  - Risk: [risk description] → Mitigation: [action]
  - Assumption: [assumption] → Validation: [how to test]

  ---
  **Approved by:** [name]  
  **Date:** [date]  
  **Last updated:** [date]
  EOF
  ```

- [ ] **Phase 01-research template:**
  ```bash
  cat > .nezam/core/templates/phases/01-research.RESEARCH_TEMPLATE.md << 'EOF'
  # Research Summary

  ## For Websites: SEO Research
  - **Primary keywords:** [list 10-20]
  - **Search intent:** [transactional | informational | navigational | commercial]
  - **Competitor analysis:** [top 3 competitors]
  - **Keyword clusters:**
    - Cluster 1: [keywords] → Target page: [page name]
    - Cluster 2: ...

  ## For SaaS: Market Research
  - **Market size:** [TAM, SAM, SOM]
  - **Competitor landscape:** [direct | indirect competitors]
  - **Differentiation:** [what makes us unique]
  - **Feature gaps:** [what competitors lack]

  ---
  **Researcher:** [name]  
  **Date:** [date]
  EOF
  ```

- [ ] **Phase 02-ia template:**
  ```bash
  cat > .nezam/core/templates/phases/02-ia.IA_TEMPLATE.md << 'EOF'
  # Information Architecture

  ## Site/App Structure
  - **Home** `/`
    - **About** `/about`
    - **Features** `/features`
    - **Blog** `/blog`
      - **[slug]** `/blog/[slug]`
    - **Contact** `/contact`

  ## Navigation Labels
  - Primary nav: [label 1] | [label 2] | [label 3]
  - Footer: [link 1] | [link 2] | ...

  ## Sitemap
  [ASCII sitemap or visual diagram]

  ---
  **Architect:** [name]  
  **Date:** [date]
  EOF
  ```

- [ ] **Repeat for phases 03-09** (similar templates)

- [ ] **Create `.nezam/core/templates/phases/README.md`:**
  ```markdown
  # Phase Templates

  Each template provides a starting point for deliverables.

  Copy the relevant template into `.nezam/core/plans/0N-<phase>/` and fill in:
  ```bash
  cp .nezam/core/templates/phases/00-define.PRD_TEMPLATE.md \
     .nezam/core/plans/00-define/PRD.md
  # Edit and complete PRD.md
  ```

  **Templates included:**
  - 00-define: PRD.md
  - 01-research: SEO_RESEARCH.md or MARKET_RESEARCH.md
  - 02-ia: IA_CONTENT.md
  - ...
  - 09-ship: DEPLOY_CHECKLIST.md
  ```

- [ ] **Commit:**
  ```bash
  git add .nezam/core/templates/phases/
  git commit -m "docs(templates): add phase deliverable templates

  - 10 templates (one per phase)
  - Provides structure and examples
  - Users copy and fill in project-specific details
  - Speeds up onboarding and maintains consistency"
  git push origin main
  ```

**Success criteria:**
- ✅ All 10 phase templates created
- ✅ Templates include examples and guidance
- ✅ README in templates/ explains usage
- ✅ Committed to repo

---

### C.3 Create Hardlock Gates Documentation

**Task:** Explain why each hardlock gate exists and what it requires.

**Duration:** ~45 minutes  
**Audience:** Users, engineers understanding SDD philosophy

**Checklist:**
- [ ] **Create `.nezam/core/docs/HARDLOCK_GATES.md`:**
  ```markdown
  # Hardlock Gates: Why & How

  A **hardlock gate** prevents phase progression until prerequisites are met.

  ## Philosophy
  SDD is deterministic. Each phase must be complete to ensure the next phase has valid inputs.

  **Example:** You can't write copy (phase 03) for URLs that don't exist yet (phase 02).

  ## Gate-by-Gate Breakdown

  ### Gate: 00-define → 01-research
  **Requires:** `PRD.md` exists and is non-empty  
  **Why:** Research needs product context. Without a PRD, research has no focus.

  ### Gate: 01-research → 02-ia
  **Requires:** `SEO_RESEARCH.md` (website) or `MARKET_RESEARCH.md` (saas) exists  
  **Why:** IA (navigation, page list, URLs) is built from research findings.
  Without research, information architecture is guesswork.

  ### Gate: 02-ia → 03-content
  **Requires:** `IA_CONTENT.md` with complete page/screen list and URLs  
  **Why:** Content (copy, CTAs, metadata) is written for specific pages and URLs.
  Without URLs, metadata is incomplete and internal links are broken.

  ### Gate: 03-content → 04-architecture
  **Requires:** `CONTENT_MAP.md` with page count, complexity, and content volume  
  **Why:** Architecture (tech stack, CMS choice, API design) is chosen based on content needs.
  A simple marketing site needs different architecture than a complex SaaS.

  ### Gate: 04-architecture → 05-design
  **Requires:** `ARCHITECTURE.md` with tech stack, data model, and API contracts  
  **Why:** Design tokens and component specs depend on technical constraints.
  Design must align with what the architecture can support.

  ### Gate: 05-design → 06-scaffold
  **Requires:** `DESIGN.md` with tokens, components, wireframes, and design system  
  **Why:** Project scaffold (folder structure) mirrors the design system.
  Component hierarchies in design drive folder structure.

  ### Gate: 06-scaffold → 07-build
  **Requires:** `PROJECT_SCAFFOLD.md` and generated folder structure  
  **Why:** Build specs (individual page/feature specs) go into the scaffold folders.
  Without scaffold, specs have no home.

  ### Gate: 07-build → 08-harden
  **Requires:** All `SPEC.md` files complete and pages built  
  **Why:** Hardening (audits, optimization) needs real pages to test.
  You can't audit performance on pages that don't exist.

  ### Gate: 08-harden → 09-ship
  **Requires:** All audits passing (performance, SEO, a11y, security)  
  **Why:** Shipping requires sign-off from all disciplines.
  A fast but inaccessible site is a failure.

  ## Checking Gate Status

  ```bash
  pnpm ai:check:sdd
  ```

  Output indicates which gates are locked/unlocked:
  ```
  ✓ Phase 00-define: COMPLETE
  ✓ Phase 01-research: COMPLETE
  → Phase 02-ia: READY (unlock by completing 01-research)
  ✗ Phase 03-content: LOCKED (requires 02-ia completion first)
  ```

  ## If a Gate Rejects You

  1. **Identify what's missing:**
    ```bash
    pnpm ai:check:sdd  # Shows detailed error
    ```

  2. **Read the error message:**
    Example: "IA_CONTENT.md missing page list"

  3. **Complete the missing deliverable:**
    ```bash
    # Edit the required file
    nano .nezam/core/plans/02-ia/IA_CONTENT.md
    ```

  4. **Re-check:**
    ```bash
    pnpm ai:check:sdd  # Should now unlock
    ```

  ## Why Hardlock Gates Matter

  **Without gates:**
  - Users skip phases (e.g., jump straight to design without architecture)
  - Deliverables are incomplete (e.g., content written without knowing the URLs)
  - Projects fail to stay deterministic

  **With gates:**
  - SDD is predictable
  - Quality is enforced
  - Users understand the "why" of each phase

  ## Customizing Gates (Advanced)

  If your project needs a different phase order:
  1. Fork the SDD pipeline: create a custom variant of `.cursor/rules/sdd-pipeline-v2.mdc`
  2. Adjust phase order but KEEP the gates
  3. Document your customization

  ---
  **Note:** Hardlock gates are non-negotiable for production use. For experimental projects,
  you can bypass gates (at your own risk) by manually creating deliverable files.
  ```

- [ ] **Link from main documentation:**
  Add to `.nezam/core/plans/INDEX.md`:
  ```markdown
  ## Understanding the SDD Pipeline
  - [Hardlock Gates](../../docs/HARDLOCK_GATES.md) — Why each phase is required
  - [START Design Guide](../.../docs/START_DESIGN_GUIDE.md) — Walkthrough for new users
  ```

- [ ] **Commit:**
  ```bash
  git add .nezam/core/docs/HARDLOCK_GATES.md
  git commit -m "docs: document hardlock gates philosophy and implementation

  - Explains why each gate exists
  - Shows gate-by-gate requirements
  - Provides troubleshooting for locked gates
  - Links to related docs"
  git push origin main
  ```

**Success criteria:**
- ✅ HARDLOCK_GATES.md created (2000+ words)
- ✅ Explains philosophy and gate-by-gate logic
- ✅ Includes troubleshooting and advanced customization
- ✅ Linked from main documentation

---

### C.4 Create Video/Screencast Guide (Optional)

**Task:** Create a 5-10 minute video walkthrough of `/START design`.

**Duration:** ~2 hours (recording + editing)  
**Audience:** Visual learners, new users  
**Tools:** Screen recording (OBS, Loom) + editing (CapCut, Premiere)

**Checklist:**
- [ ] **Plan video outline:**
  1. Intro (30 sec): "What is NEZAM? What is SDD?"
  2. `/START design` command (1 min): Run the command, show questions
  3. Phase overview (2 min): Show .nezam/core/plans structure, explain 00-09
  4. Phase 00-define (1 min): Create PRD.md, show structure
  5. Hardlock gate (1 min): Run pnpm ai:check:sdd, show gate logic
  6. Outro (30 sec): "Next steps: follow the guide, ask for help"

- [ ] **Record screencast:**
  ```bash
  # Use OBS or Loom
  # Screen 1: Terminal showing `/START design`
  # Screen 2: VS Code showing created files
  # Narrate the process
  ```

- [ ] **Edit and publish:**
  - Add captions
  - Add timestamps
  - Add music (optional)
  - Export to MP4
  - Upload to YouTube (unlisted or private)

- [ ] **Create thumbnail image:**
  - "NEZAM: SDD in 5 minutes"
  - Clear, branded thumbnail

- [ ] **Link from documentation:**
  Add to `.nezam/core/docs/START_DESIGN_GUIDE.md`:
  ```markdown
  ## Video Walkthrough
  [Watch: Getting Started with SDD (5 min)](https://youtu.be/...)
  ```

**Success criteria (if completed):**
- ✅ Video uploaded and linked
- ✅ Captions included
- ✅ Clear and easy to follow

**Note:** This is optional but highly recommended for user adoption.

---

### C.5 Update Main Documentation Index

**Task:** Ensure all new documentation is discoverable.

**Duration:** ~15 minutes  
**Files to update:** README.md, .nezam/core/plans/INDEX.md

**Checklist:**
- [ ] **Update `.nezam/core/plans/INDEX.md`:**
  ```markdown
  # NEZAM SDD Documentation

  ## Getting Started
  - [Quick Start](../../README.md#quick-start)
  - [START Design Guide](../../.nezam/core/docs/START_DESIGN_GUIDE.md)
  - [Video Walkthrough (optional)](...)

  ## Understanding SDD
  - [Hardlock Gates Philosophy](../../.nezam/core/docs/HARDLOCK_GATES.md)
  - [Phase-by-Phase Breakdown](../../.nezam/core/rules/sdd-pipeline-v2.mdc)
  - [Phase Templates](../../.nezam/core/templates/phases/README.md)

  ## Phase Folders
  - 00-define: Create your PRD
  - 01-research: Market/SEO research
  - 02-ia: Information architecture
  - ...
  - 09-ship: Deploy and monitor

  ## Troubleshooting
  - [Support Runbook](../../.nezam/core/docs/SUPPORT_RUNBOOK.md)
  - [HOTFIX Process](./.github/HOTFIX_PROCESS.md)
  ```

- [ ] **Update root `README.md`:**
  ```markdown
  ## Documentation

  **New to NEZAM?**
  - [Quick Start](./docs/reports/START_DESIGN_GUIDE.md)
  - [Video Walkthrough](./docs/videos/start-design.md) (optional)

  **Learn SDD:**
  - [Hardlock Gates Explained](./.nezam/core/docs/HARDLOCK_GATES.md)
  - [Phase Templates](./././.nezam/core/templates/phases/)

  **Having trouble?**
  - [Support Runbook](./.nezam/core/docs/SUPPORT_RUNBOOK.md)
  - [Troubleshooting](https://github.com/your-org/nezam/issues?q=label%3Aquestion)

  ## Releases
  - [v1.0.0 Release Notes](./RELEASE_NOTES.md)
  - [Changelog](./CHANGELOG.md)
  - [v1.0.0 Audit Report](./docs/reports/AUDIT_2026-06-04_FOLLOW_UP.md)
  ```

- [ ] **Add section to README for onboarding:**
  ```markdown
  ## Onboarding Checklist

  First time using NEZAM? Follow this:
  - [ ] Read [START_DESIGN_GUIDE.md](./.nezam/core/docs/START_DESIGN_GUIDE.md)
  - [ ] Watch video (optional)
  - [ ] Run `/START design` in your project
  - [ ] Complete phase 00-define (create PRD.md)
  - [ ] Join #engineering on Slack for questions
  ```

- [ ] **Commit:**
  ```bash
  git add README.md .nezam/core/plans/INDEX.md
  git commit -m "docs(onboarding): link all documentation from main index

  - README.md has quick-start and troubleshooting links
  - Plans/INDEX.md has full documentation map
  - New users have clear path to getting started"
  git push origin main
  ```

**Success criteria:**
- ✅ All documentation is linked and discoverable
- ✅ Clear hierarchy: Quick Start → Detailed → Troubleshooting
- ✅ README has onboarding checklist

---

## Phase D: Post-Release Monitoring (Days 14+)

### D.1 Weekly Health Checks

**Task:** Monitor production health and user adoption.

**Frequency:** Weekly for first month, then biweekly  
**Owner:** DevOps / Engineering  
**Duration:** ~20 minutes per week

**Checklist:**
- [ ] **GitHub metrics:**
  - [ ] Issues opened/closed this week
  - [ ] PRs merged (track activity level)
  - [ ] Stars/forks (community interest)

- [ ] **CI/CD health:**
  - [ ] Pipeline pass rate (target: >95%)
  - [ ] Average pipeline duration (track trends)
  - [ ] Failed workflow runs (investigate if >5%)

- [ ] **User feedback:**
  - [ ] Check Slack #engineering for questions
  - [ ] Review GitHub Discussions (if enabled)
  - [ ] Survey users: "How's the v1.0.0 experience?"

- [ ] **Performance metrics:**
  - [ ] RAM usage reports (is P1/P2 working?)
  - [ ] File indexer performance (is watcherExclude helping?)
  - [ ] Build times (compare to baseline)

**Document weekly:**
```markdown
## Weekly Health Report — Week of 2026-06-11

### GitHub
- Issues: 2 opened, 1 closed
- PRs: 3 merged
- Activity level: ✅ Normal

### CI/CD
- Pass rate: 98% ✅
- Avg duration: 7.5 min (↓ from 8 min) ✅
- Failed runs: 1 (expected timeout) ✅

### User Feedback
- Slack questions: 3 (all resolved)
- Performance reports: "RAM usage improved" ✅

### Next week
- Monitor for bugs in phase 01-research
- Collect more performance data
```

---

### D.2 Monthly Roadmap Planning

**Task:** Plan next features and improvements.

**Frequency:** Monthly (1st week of month)  
**Owner:** Product / Engineering  
**Duration:** ~2 hours

**Checklist:**
- [ ] Review feedback from past month
- [ ] Prioritize next features:
  - Critical bugs (ship immediately)
  - High-impact features (plan for next sprint)
  - Nice-to-haves (backlog)
- [ ] Create issues for top 5 priorities
- [ ] Link issues to milestone (e.g., v1.1.0)

---

## Summary & Timeline

| Phase | Duration | Target dates | Status |
|-------|----------|--------------|--------|
| **A. Stabilization** | 24-48 h | Day 1-2 | 📋 Ready |
| **B. Optimization (R2)** | 4-6 h | Day 3-7 | 📋 Ready |
| B.1 Move references/ | 1 h | Day 3 | 📋 |
| B.2 Add watcherExclude | 10 min | Day 4 | 📋 |
| B.3 Prune mirrors | 20 min | Day 4 | 📋 |
| B.4 Pre-push hook | 15 min | Day 5 | 📋 |
| B.5 Branch-protection | 10 min | Day 5 | 📋 |
| B.6 Measure perf | 20 min | Day 7 | 📋 |
| **C. Onboarding (R3)** | 4-5 h | Day 8-14 | 📋 Ready |
| C.1 START Design guide | 1 h | Day 8 | 📋 |
| C.2 Phase templates | 1.5 h | Day 9 | 📋 |
| C.3 Hardlock gates | 45 min | Day 10 | 📋 |
| C.4 Video guide | 2 h | Day 11-12 | 📋 Optional |
| C.5 Documentation index | 15 min | Day 13 | 📋 |
| **D. Monitoring** | Ongoing | Week 2+ | 📋 Ready |

**Total effort:** ~10-12 hours (can be done by 2-3 people in parallel)

---

## Sign-Off Template

```markdown
## Post-Release Sign-Off

**Release:** NEZAM v1.0.0  
**Post-Release Period:** 2026-06-05 to 2026-06-18  

### Phase A: Stabilization
- [ ] Week 1 monitoring complete
- [ ] Critical issues addressed
- [ ] Performance baseline collected

### Phase B: Optimization (R2)
- [ ] References/ moved out (P1) ✅
- [ ] watcherExclude added (P2) ✅
- [ ] Unused mirrors pruned (P3) ✅
- [ ] Pre-push hook added (B1) ✅
- [ ] Branch-protection documented (B2) ✅
- [ ] Performance improvements measured ✅

### Phase C: Onboarding (R3)
- [ ] START Design guide created ✅
- [ ] Phase templates created ✅
- [ ] Hardlock gates documented ✅
- [ ] Video walkthrough (optional) ✅
- [ ] Documentation linked ✅

### Phase D: Monitoring
- [ ] Weekly health checks scheduled ✅
- [ ] Monthly roadmap planning scheduled ✅

### Overall Status
- **R1 Release:** ✅ Shipped
- **R2 Optimization:** ✅ Complete
- **R3 Onboarding:** ✅ Complete

**Signed off by:** [name]  
**Date:** [date]
```

---

**Document version:** 1.0.0  
**Last updated:** 2026-06-04  
**Next phase:** After v1.0.0 ships (2026-06-04)
