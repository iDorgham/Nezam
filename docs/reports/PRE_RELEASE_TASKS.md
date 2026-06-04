# Pre-Release Tasks — NEZAM v-next
## Comprehensive Checklist Before Shipping

**Target:** Complete all tasks before `/GIT release` is executed.

**Status:** Ready for execution  
**Estimated duration:** 3-4 hours  
**Owner:** Engineering team  
**Deadline:** 2026-06-04 EOD

---

## Phase 1: Repository Cleanup (30 min)

### 1.1 Remove Stray Git Artifacts

**Task:** Delete any temporary branches, orphaned refs, and merge artifacts.

**Checklist:**
- [ ] List all branches: `git branch -a`
- [ ] Delete any `temp-*`, `wip-*`, `merge-*` branches locally:
  ```bash
  git branch -D temp-merge-branch (if exists)
  git push origin --delete temp-merge-branch (if remote)
  ```
- [ ] Clean up local stale refs: `git remote prune origin`
- [ ] Verify main branch is clean: `git status` → nothing to commit
- [ ] Verify no untracked files: `git ls-files --others --exclude-standard` → empty
- [ ] Check for merge conflict markers: `grep -r "^<<<<<<< HEAD" . --include="*.js" --include="*.ts" --include="*.md" --include="*.json"` → no matches

**Success criteria:**
- ✅ `git status` shows "nothing to commit, working tree clean"
- ✅ No temporary branches in `git branch -a`
- ✅ No orphaned refs or stale tracking branches

**Commands:**
```bash
# Clean up
git branch -a | grep -E "temp|wip|merge" | xargs -I {} git branch -D {}
git remote prune origin
git gc --aggressive  # Optimize repo

# Verify
git status
git log --oneline | head -5
```

---

### 1.2 Consolidate Uncommitted Changes

**Task:** Ensure all working changes are either committed or discarded.

**Checklist:**
- [ ] Review all staged changes: `git diff --cached`
- [ ] Review all unstaged changes: `git diff`
- [ ] For each change:
  - If it's release-critical: `git add` and `git commit -m "fix: <description>"`
  - If it's non-critical (e.g., local config): `git checkout -- <file>`
- [ ] Verify all package.json changes are intentional (no local tweaks)
- [ ] Check that `.env.local` and `.env.*.local` are in `.gitignore`

**Success criteria:**
- ✅ `git status` shows "working tree clean"
- ✅ No `Changes not staged for commit` or `Untracked files`
- ✅ All intentional changes are committed with clear messages

**Commands:**
```bash
# Review changes
git diff --stat
git diff

# Commit if needed
git add <file>
git commit -m "feat: <description>"

# Discard if not release-critical
git checkout -- <file>
```

---

### 1.3 Validate .gitignore Coverage

**Task:** Ensure all build artifacts, dependencies, and secrets are ignored.

**Checklist:**
- [ ] Verify `.gitignore` includes:
  ```
  node_modules/
  .next/
  dist/
  build/
  .DS_Store
  *.env.local
  .env.*.local
  .idea/
  .vscode/launch.json
  .cursor/design/references/  (if present)
  .nezam/design-hub/node_modules/
  .nezam/design-hub/.next/
  ```
- [ ] Run `git status --ignored` to see what's being ignored
- [ ] Verify no sensitive files are in git history:
  ```bash
  git log --all --full-history --diff-filter=D --summary | grep "delete mode" | grep -E "\.key|\.pem|\.env|secrets"
  ```
- [ ] Check for large files (>10 MB) in history: `git rev-list --all --objects | sort -k2 | tail -10`

**Success criteria:**
- ✅ All build artifacts and node_modules are ignored
- ✅ No .env or secret files in git history
- ✅ No large binary files (>50 MB) in repo

**Commands:**
```bash
# Check ignored files
git status --ignored | head -20

# Check for large files
git rev-list --all --objects | sed -n '$(git rev-list --objects --all | wc -l)p' | sort -k2 | tail -10
```

---

## Phase 2: Code Quality & Testing (45 min)

### 2.1 Run Full Test Suite

**Task:** Execute all tests to verify the codebase is stable.

**Checklist:**
- [ ] Check if tests exist: `ls -la | grep -E "test|spec|jest|vitest"` or `grep "test" package.json`
- [ ] If tests exist, run full suite: `pnpm test` or `npm test`
- [ ] Review test output:
  - All tests pass: ✅
  - No warnings about missing dependencies
  - No deprecation warnings
- [ ] If CI pipeline exists, verify it would pass:
  ```bash
  # Simulate CI checks
  pnpm lint (if configured)
  pnpm type-check (if TypeScript)
  pnpm build (if build script exists)
  ```
- [ ] Document any flaky tests or known failures (add to RELEASE_NOTES.md)

**Success criteria:**
- ✅ `pnpm test` exits with code 0 (all tests pass)
- ✅ No console errors or unhandled promise rejections
- ✅ No new warnings introduced

**Commands:**
```bash
# Full validation suite
pnpm test
pnpm lint
pnpm type-check
pnpm build

# Check for warnings
pnpm test 2>&1 | grep -i "warning\|deprecated\|error"
```

---

### 2.2 Validate AI Contracts Integrity

**Task:** Ensure all `.cursor/` contracts are syntactically correct and cross-linked.

**Checklist:**
- [ ] Run AI drift check: `pnpm ai:check`
  - Expected output: "✅ All checks passed"
  - No path conflicts
  - No broken agent/skill references
- [ ] Run SDD swarm integrity check: `pnpm ai:check:sdd`
  - Verifies hardlock gates
  - Validates phase order
  - No circular dependencies
- [ ] Spot-check 3 agents for correct YAML frontmatter:
  ```bash
  head -10 .cursor/agents/swarm-leader.md
  head -10 .cursor/agents/design-lead.md
  head -10 .cursor/agents/frontend-lead.md
  ```
- [ ] Verify no legacy paths in contracts:
  ```bash
  grep -r "docs/plan" .cursor/commands .cursor/rules .cursor/skills --include="*.md" --include="*.mdc" 2>/dev/null | wc -l
  # Should return 0 (or only hits in comments/examples)
  ```

**Success criteria:**
- ✅ `pnpm ai:check` passes
- ✅ `pnpm ai:check:sdd` passes
- ✅ All agents have valid frontmatter
- ✅ No legacy paths in active contracts

**Commands:**
```bash
# Comprehensive validation
pnpm ai:sync && pnpm ai:check

# Spot-check agents
head -20 .cursor/agents/{swarm-leader,design-lead,backend-lead}.md | grep -E "^id:|^name:|^type:"
```

---

### 2.3 Validate Design Hub Build

**Task:** Ensure the Design Hub Next.js app builds without errors.

**Checklist:**
- [ ] Navigate to design-hub: `cd .nezam/design-hub`
- [ ] Clean previous build: `rm -rf .next && rm -rf dist`
- [ ] Install dependencies (if needed): `pnpm install`
- [ ] Run type check: `pnpm type-check` or `tsc --noEmit`
- [ ] Build production: `pnpm build`
  - Expected: "✓ compiled client and server successfully"
  - No build errors
  - All imports resolved
- [ ] Check build output size:
  ```bash
  du -sh .next/
  # Warn if > 1 GB (but acceptable for Next.js)
  ```
- [ ] Verify wireframes_locked.json is valid:
  ```bash
  pnpm exec -- node -e "const fs = require('fs'); JSON.parse(fs.readFileSync('wireframes_locked.json', 'utf-8')); console.log('✓ Valid JSON')"
  ```
- [ ] Return to root: `cd ../..`

**Success criteria:**
- ✅ `pnpm build` completes with no errors
- ✅ No TypeScript errors (if applicable)
- ✅ `wireframes_locked.json` is valid JSON
- ✅ Build output size is reasonable (< 1.5 GB)

**Commands:**
```bash
cd .nezam/design-hub
rm -rf .next && pnpm build
du -sh .next/
node -e "JSON.parse(require('fs').readFileSync('wireframes_locked.json'))" && echo "✓ Valid"
cd ../..
```

---

## Phase 3: Version & Changelog Management (45 min)

### 3.1 Determine Release Version

**Task:** Decide on the version number (semantic versioning).

**Checklist:**
- [ ] Check current version in `package.json`:
  ```bash
  jq '.version' package.json
  ```
- [ ] Review commit history since last tag:
  ```bash
  git log --oneline $(git describe --tags --abbrev=0)..HEAD | head -20
  ```
- [ ] Categorize commits:
  - **Breaking changes** (major): API changes, architecture changes, removed features
  - **New features** (minor): New agents, new skills, new commands
  - **Bug fixes** (patch): Critical fixes, documentation fixes
  - **Chores** (skip): Refactoring, tooling, non-user-facing changes
- [ ] Determine version bump:
  - If breaking: `major` (e.g., 1.0.0 → 2.0.0)
  - If features: `minor` (e.g., 1.0.0 → 1.1.0)
  - If fixes: `patch` (e.g., 1.0.0 → 1.0.1)
- [ ] Verify semantic versioning (semver.org): `X.Y.Z`
- [ ] Document decision in CHANGELOG.md header

**Success criteria:**
- ✅ Version number follows semver
- ✅ Version bump justified by commit history
- ✅ Decision documented in CHANGELOG

**Commands:**
```bash
# Check current version
jq '.version' package.json

# Review recent commits
git log --oneline -20

# Validate semver
node -e "const semver = require('semver'); console.log(semver.valid('1.0.0'))"
```

---

### 3.2 Create/Update CHANGELOG.md

**Task:** Document all changes in the release.

**Checklist:**
- [ ] Create or update `CHANGELOG.md` at repo root
- [ ] Use [Keep a Changelog](https://keepachangelog.com/) format:
  ```markdown
  # Changelog

  ## [1.0.0] - 2026-06-04

  ### Added
  - SDD pipeline (00-09 unified structure across website, webapp, saas, mobile)
  - Hardlock gates for phase progression
  - Design Hub integration with wireframes_locked.json
  - 169 agents + 5 defined skills
  - Multi-tool support (.cursor, .claude, .windsurf, .opencode, .antigravity, .gemini, .qwen, .kilo)
  - Comprehensive CI/CD gates (12 workflows)

  ### Fixed
  - C1: Unified plan-root path to .nezam/core/plans/
  - C2: Resolved duplicate phase numbers (04-design collision)
  - C3: Consolidated numbering schemes across product types
  - C4: Removed duplicate design skills

  ### Changed
  - Refactored .cursor/rules/sdd-pipeline-v2.mdc for clarity

  ### Performance
  - Identified 28-repo references/ tree for future optimization (P1)
  - Identified multi-tool mirror bloat for future optimization (P2)
  ```
- [ ] Add release date in ISO format (YYYY-MM-DD)
- [ ] Group changes into: Added, Fixed, Changed, Removed, Performance, Security
- [ ] Link to related issues (if applicable): `#123`, `#456`
- [ ] Keep previous releases in the file (don't delete old entries)
- [ ] Add unreleased section at the top for future changes:
  ```markdown
  ## [Unreleased]

  ### Added
  - (future items)
  ```

**Success criteria:**
- ✅ CHANGELOG.md is created/updated
- ✅ Follows Keep a Changelog format
- ✅ All major changes are documented
- ✅ Version number and date match release plan

**Commands:**
```bash
# View template
cat > CHANGELOG.md << 'EOF'
# Changelog

## [Unreleased]

### Added

### Fixed

### Changed

## [1.0.0] - 2026-06-04

### Added
- SDD pipeline...
EOF
```

---

### 3.3 Create/Update RELEASE_NOTES.md (Optional)

**Task:** Create a user-facing release notes document.

**Checklist:**
- [ ] Create `RELEASE_NOTES.md` (separate from CHANGELOG.md)
- [ ] Focus on **user-facing features and improvements** (not every commit)
- [ ] Structure:
  ```markdown
  # NEZAM v1.0.0 Release Notes

  ## Overview
  NEZAM is now production-ready with a deterministic SDD (Specification-Driven Development) pipeline.

  ## Key Features
  - **Unified SDD Pipeline**: 00-09 phase structure across website, web app, SaaS, and mobile products
  - **Hardlock Gates**: Prevents phase skipping, ensures prerequisites are met
  - **Design Hub Integration**: Wireframe-locked workflow for design-to-code handoff
  - **169 AI Agents + 5 Skills**: Comprehensive automation agents for all product types
  - **Multi-Tool Support**: Works with Cursor, Claude (Cowork), Windsurf, OpenCode, Antigravity, Gemini, Qwen, Kilo

  ## Getting Started
  1. Run `/START design` to initialize a new project
  2. Follow the interactive CLI to detect product type
  3. SDD pipeline automatically enforces phase order

  ## Known Issues
  - None in this release

  ## Performance Notes
  - Desktop app memory usage: typical for monorepo size
  - Optimization roadmap (post-release): move references/ tree, add watcherExclude

  ## Questions?
  - Read `.cursor/commands/start.md` for `/START` command
  - See `.nezam/core/plans/INDEX.md` for SDD structure
  - Run `/HELP` in CLI for command reference
  ```
- [ ] Include links to:
  - Main documentation (CLAUDE.md)
  - SDD structure (.nezam/core/plans/INDEX.md)
  - Getting started guide (.cursor/commands/start.md)

**Success criteria:**
- ✅ RELEASE_NOTES.md created (optional but recommended)
- ✅ User-facing language (not technical jargon)
- ✅ Getting started section included
- ✅ Links to docs and resources

---

## Phase 4: Git State Preparation (30 min)

### 4.1 Final Commit & Branch Check

**Task:** Ensure the git repository is in a clean, releasable state.

**Checklist:**
- [ ] Verify current branch is `main`: `git branch --show-current`
- [ ] Verify main is up-to-date: `git log origin/main..HEAD` → empty (no commits to push)
- [ ] Verify no uncommitted changes: `git status` → clean
- [ ] Check main branch protection rules are active:
  ```bash
  # Manually verify in GitHub Settings > Branches > main
  # Should require: 1+ review, required status checks, linear history
  ```
- [ ] Create final pre-release commit (if needed):
  ```bash
  git commit -m "chore(release): prepare for v1.0.0 release

  - Update CHANGELOG.md
  - Validate all contracts (pnpm ai:check passes)
  - Run full test suite
  - Build Design Hub
  - Ready for tag and publish"
  ```
- [ ] Push to origin: `git push origin main`
- [ ] Verify CI pipeline passes on GitHub (check GitHub Actions)

**Success criteria:**
- ✅ On `main` branch
- ✅ Main is up-to-date with origin
- ✅ No uncommitted changes
- ✅ GitHub Actions all green on latest commit
- ✅ Branch protection rules are active

**Commands:**
```bash
# Verify state
git branch --show-current
git status
git log origin/main..HEAD

# Push if needed
git add CHANGELOG.md
git commit -m "chore(release): prepare for v1.0.0"
git push origin main

# Wait for CI
# Check https://github.com/your-org/nezam/actions
```

---

### 4.2 Verify Tag Naming Convention

**Task:** Plan the tag name before creating it.

**Checklist:**
- [ ] Confirm tag format is: `v<major>.<minor>.<patch>` (e.g., `v1.0.0`)
- [ ] Check existing tags: `git tag --list | sort -V | tail -10`
- [ ] Verify no conflicting tags:
  ```bash
  git tag --list "v1.0.0" # Should be empty (tag doesn't exist yet)
  ```
- [ ] Plan tag message (annotated tags): `Release v1.0.0: SDD pipeline + Design Hub + 169 agents`
- [ ] Document tag command to execute during `/GIT release`:
  ```bash
  git tag -a v1.0.0 -m "Release v1.0.0: SDD pipeline + Design Hub + multi-tool support"
  ```

**Success criteria:**
- ✅ Tag format confirmed (v<semver>)
- ✅ Tag doesn't already exist
- ✅ Tag message is clear and descriptive
- ✅ Tag command ready to execute

**Commands:**
```bash
# Check existing tags
git tag --list | sort -V | tail -10

# Verify new tag doesn't exist
git tag --list "v1.0.0"

# Prepare tag command (don't execute yet)
echo 'git tag -a v1.0.0 -m "Release v1.0.0: SDD pipeline + Design Hub"'
```

---

## Phase 5: Documentation & Communication (30 min)

### 5.1 Update README.md

**Task:** Ensure README reflects the new release.

**Checklist:**
- [ ] Open `README.md`
- [ ] Update version badge (if present):
  ```markdown
  ![Version](https://img.shields.io/badge/version-1.0.0-blue)
  ```
- [ ] Update feature list to reflect v1.0.0:
  ```markdown
  ## Features
  - ✅ SDD pipeline (00-09 unified structure)
  - ✅ 169 AI agents for automation
  - ✅ Hardlock gates for phase enforcement
  - ✅ Design Hub integration
  - ✅ Multi-tool support (12 tools)
  ```
- [ ] Update getting started section:
  ```markdown
  ## Quick Start
  1. Clone the repo
  2. `pnpm install`
  3. Run `/START design` (or relevant command)
  4. Follow the interactive CLI
  ```
- [ ] Add link to CHANGELOG.md:
  ```markdown
  See [CHANGELOG.md](./CHANGELOG.md) for detailed changes.
  ```
- [ ] Verify all links are working (markdown link syntax)

**Success criteria:**
- ✅ README.md is updated with version 1.0.0
- ✅ Feature list is current
- ✅ Getting started section is clear
- ✅ All links are valid

---

### 5.2 Create Release Summary Document

**Task:** Create a one-page summary for stakeholders.

**Checklist:**
- [ ] Create `.nezam/core/meta/RELEASE_SUMMARY_2026-06-04.md`:
  ```markdown
  # NEZAM v1.0.0 Release Summary
  
  **Release Date:** 2026-06-04  
  **Status:** ✅ Production-Ready

  ## What's New
  - Deterministic SDD pipeline (00-09 phases)
  - 169 AI agents + 5 skills
  - Design Hub with wireframe locking
  - Multi-tool support

  ## Resolved Issues
  - C1: Plan-root path (✅ Fixed)
  - C2: Phase collisions (✅ Fixed)
  - C3: Numbering schemes (✅ Fixed)
  - C4: Duplicate skills (✅ Fixed)

  ## Performance (Post-Release)
  - Recommended: Move references/ tree (20+ GB savings)
  - Recommended: Add watcherExclude (2-3 GB savings)

  ## Next Steps
  1. Merge to main (done ✅)
  2. Execute /GIT release
  3. GitHub Release publishes automatically
  4. Optional: Run R2 performance optimizations
  ```
- [ ] Link this document in RELEASE_PLAN_2026-06-04.md

**Success criteria:**
- ✅ Summary created at `.nezam/core/meta/RELEASE_SUMMARY_2026-06-04.md`
- ✅ Covers what's new, resolved issues, next steps
- ✅ Linked from main release plan

---

### 5.3 Verify All Documentation is Linked

**Task:** Ensure release documentation is discoverable.

**Checklist:**
- [ ] `.nezam/core/plans/INDEX.md` references the release:
  ```markdown
  ## Latest Release
  See `docs/reports/RELEASE_PLAN_2026-06-04.md` for the current release plan.
  ```
- [ ] `docs/reports/` directory contains all audit/release docs:
  - [ ] `AUDIT_2026-06-04.md` (original)
  - [ ] `AUDIT_2026-06-04_FOLLOW_UP.md` (verification)
  - [ ] `RELEASE_PLAN_2026-06-04.md`
  - [ ] `AUDIT_SUMMARY_2026-06-04.md`
- [ ] Main `README.md` links to release notes:
  ```markdown
  [Release Notes](./RELEASE_NOTES.md) | [Changelog](./CHANGELOG.md) | [SDD Docs](./.nezam/core/plans/INDEX.md)
  ```

**Success criteria:**
- ✅ All release docs are in `docs/reports/`
- ✅ INDEX.md references the release
- ✅ README.md has links to release artifacts

---

## Phase 6: Final Validation Checklist (15 min)

### 6.1 Pre-Release Sign-Off

**Task:** Final verification before executing release.

**Checklist:**
- [ ] **Repository state:**
  - [ ] On `main` branch
  - [ ] `git status` is clean
  - [ ] No uncommitted changes
  - [ ] All commits pushed to origin

- [ ] **Tests & Validation:**
  - [ ] `pnpm test` passes (or N/A if no tests)
  - [ ] `pnpm ai:check` passes
  - [ ] `pnpm ai:check:sdd` passes
  - [ ] Design Hub builds successfully

- [ ] **Documentation:**
  - [ ] CHANGELOG.md is updated
  - [ ] RELEASE_NOTES.md exists (optional)
  - [ ] README.md is current
  - [ ] Release summary created

- [ ] **Version & Tagging:**
  - [ ] Semantic version decided (e.g., 1.0.0)
  - [ ] No conflicting tag exists
  - [ ] Tag message prepared
  - [ ] CHANGELOG entry has correct date

- [ ] **CI/CD Status:**
  - [ ] GitHub Actions all green on latest commit
  - [ ] No pending reviews or blocked PRs
  - [ ] Branch protection rules are active on `main`

- [ ] **Communication:**
  - [ ] Stakeholders notified of release timing
  - [ ] Release notes are user-friendly
  - [ ] Slack/email template ready for announcement

**Success criteria:**
- ✅ All 5 categories above have all checkboxes marked
- ✅ Ready to proceed with `/GIT release` command

---

### 6.2 Decision Point: Ready to Release?

**Evaluation:**

| Factor | Status | Decision |
|--------|--------|----------|
| All tests pass | ✅ | **GO** |
| All contracts valid | ✅ | **GO** |
| Design Hub builds | ✅ | **GO** |
| Documentation updated | ✅ | **GO** |
| Version decided | ✅ | **GO** |
| No critical issues | ✅ | **GO** |

**If all items are ✅:**
→ Proceed to `/GIT release` (Phase 7)

**If any item is ❌:**
→ Fix the issue and re-run Phase 6

---

## Phase 7: Execute Release (Immediate Next Step)

### 7.1 Run `/GIT release` Command

**Task:** Create the release tag and branch.

**Command:**
```bash
/GIT release
# Interactive prompt:
# - Confirm version bump (suggest 1.0.0)
# - Select release branch strategy (fast-forward)
# - Confirm tag message
# → Creates release/1.0.0 branch
# → Pushes annotated tag v1.0.0
# → Merges to main
```

**Expected output:**
```
✓ Created release/1.0.0 branch
✓ Bumped version in package.json
✓ Created annotated tag v1.0.0
✓ Merged to main (ff)
✓ Pushed tag and branch
```

**Wait for:** GitHub Actions to complete (`release.yml`)

---

## Sign-Off Template

```markdown
## Pre-Release Approval

**Release:** NEZAM v1.0.0  
**Date:** 2026-06-04  
**Branch:** main  
**Commit:** [git log -1 --oneline]

### Approvals
- [ ] Engineering lead approves pre-release state
- [ ] DevOps confirms CI/CD pipeline is green
- [ ] Product owner approves release notes
- [ ] Release manager (you) confirms all checklists passed

### Go/No-Go Decision
- **GO** ✅ (all approvals above + all Phase 6 items complete)
- **NO-GO** ❌ (stop, fix issues, retry)

**Decision made by:** _________________  
**Date/Time:** 2026-06-04 __:__  
```

---

## Estimated Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| 1. Repo Cleanup | 30 min | 📋 Ready |
| 2. Code Quality | 45 min | 📋 Ready |
| 3. Version/Changelog | 45 min | 📋 Ready |
| 4. Git State | 30 min | 📋 Ready |
| 5. Documentation | 30 min | 📋 Ready |
| 6. Final Validation | 15 min | 📋 Ready |
| **Total** | **~3.5 hours** | ✅ |

**Recommended execution:** Start at 10:00 AM, complete by 1:30 PM, release at 2:00 PM.

---

## Troubleshooting

### If tests fail
1. Review test output for errors
2. Fix the failing test(s)
3. Re-run: `pnpm test`
4. If unfixable, document in RELEASE_NOTES.md as "Known Issues"

### If `pnpm ai:check` fails
1. Run: `pnpm ai:sync` (regenerate mirrors)
2. Re-run: `pnpm ai:check`
3. If persistent, investigate the specific error in `.cursor/` contracts

### If Design Hub won't build
1. Delete `.next` and `node_modules` in design-hub
2. Reinstall: `cd .nezam/design-hub && pnpm install`
3. Rebuild: `pnpm build`
4. If still fails, review TypeScript errors and fix

### If tag command fails
1. Verify tag doesn't exist: `git tag --list v1.0.0`
2. Verify you're on `main`: `git branch --show-current`
3. If tag exists, increment version (e.g., v1.0.1) and try again

---

## Notes for Release Manager

- **Duration accuracy:** These estimates assume no major issues. Add 50% buffer for troubleshooting.
- **Parallel work:** Phases 1-3 can be done in parallel (different file systems).
- **Safety:** Each phase is independent; can redo a phase if issues arise.
- **Backup plan:** All changes can be reverted via `git revert <commit-hash>` if release must be rolled back.

---

**Document version:** 1.0.0  
**Last updated:** 2026-06-04  
**Next review:** After v1.0.0 ships
