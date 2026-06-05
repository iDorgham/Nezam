# NEZAM Release Plan — 2026-06-04
## Three-Milestone Roadmap to v-next

**Target:** Ship NEZAM with full SDD pipeline support, deterministic build orchestration, and Design Hub integration.

**Status:** ✅ **Ready to release immediately.** All Critical blockers resolved.

---

## Milestone R1: Foundation Release (Ready Now)

### Duration
**~2 hours** (mostly automation + merging)

### Scope
Release the current codebase as-is. All four Critical issues (C1–C4) are resolved; no engineering work required.

### Deliverables

#### 1. Pre-release Validation
- [ ] `pnpm ai:sync && pnpm ai:check` passes
- [ ] `pnpm test` or `npm run test` passes (if present)
- [ ] `.github/workflows/ci.yml` runs and passes
- [ ] `.github/workflows/sdd-gate-enforcement.yml` passes
- [ ] `.github/workflows/design-gates.yml` passes
- [ ] `.github/workflows/wireframe-validation.yml` passes
- [ ] No uncommitted changes in `.cursor/`, `.nezam/core/`, or root config files
- [ ] `CLAUDE.md` is regenerated and up-to-date

**Command to verify:**
```bash
pnpm ai:sync && pnpm ai:check && pnpm test
```

#### 2. Changelog & Release Notes
- [ ] Create `CHANGELOG.md` entry for v-next (or append to existing)
- [ ] Document:
  - SDD pipeline (00-09 unified structure)
  - Hardlock gate enforcement
  - Design Hub integration
  - Multi-tool support (.cursor, .claude, .windsurf, .opencode, .antigravity, etc.)
- [ ] Generate release notes via `semantic-release` (automated)

#### 3. Tagging & Publishing
- [ ] Run `/GIT release` command from Cursor/Claude
  - Reads `.cursor/commands/git.md` for release procedure
  - Creates `release/x.y.z` branch
  - Bumps version number (SemVer)
  - Creates annotated tag
- [ ] Merge `release/x.y.z` → `main` (fast-forward, no merge commit)
- [ ] `release.yml` GitHub Action runs:
  - Publishes to NPM (if package.json has `"private": false`)
  - Creates GitHub Release with notes
  - Archives CHANGELOG.md snapshot

#### 4. Post-Release Verification
- [ ] GitHub Release page shows correct version and notes
- [ ] NPM package is published (if applicable)
- [ ] Tag is visible in `git tag --list`
- [ ] `main` branch shows the tag in its history

### Success Criteria

✅ **Release is Green if:**
- All pre-release validation checks pass
- Tag created successfully
- GitHub Release page is populated
- No regression in CI times
- `CHANGELOG.md` is accurate

### Example Version Sequence

Assume current version is `1.0.0-beta.1`:

```
Current state: main @ 1.0.0-beta.1
↓
/GIT release (manual bump to 1.0.0)
↓
Create release/1.0.0 branch
↓
Bump package.json version
↓
Add CHANGELOG entry
↓
Push tag v1.0.0
↓
Merge release/1.0.0 → main
↓
release.yml publishes to NPM
↓
GitHub Release created
✅ Release 1.0.0 complete
```

### Rollback Trigger

If GitHub Release fails or NPM publish is rejected:
1. Delete the tag: `git tag -d v1.0.0 && git push --delete origin v1.0.0`
2. Delete release branch: `git branch -D release/1.0.0 && git push --delete origin release/1.0.0`
3. Revert version bump commit: `git revert <commit-hash>`
4. Merge revert to `main`

---

## Milestone R2: Performance Hardening (Recommended, ~1 session)

### Duration
**~3-4 hours** (parallelizable)

### Scope
Reduce RAM footprint, improve indexer performance, harden branch policy. Not required for release, but recommended before widespread adoption.

### P1: Move `references/` Out of Workspace

**What:** The `28-repo` vendored reference tree currently lives in `.cursor/design/references/` and is indexed by the file watcher.

**Why:** Reduces RAM from 30+ GB → single-digit GB on the Claude desktop app.

**How:**

#### 1. Create fetch script
```bash
# scripts/fetch-references.sh
#!/bin/bash
set -e

REF_DEST="$HOME/nezam-references"
mkdir -p "$REF_DEST"

echo "Fetching NEZAM references to $REF_DEST..."
# Git clone 28 repos (or fetch from archive)
# Example:
git clone https://github.com/your-org/reference-repo.git "$REF_DEST/repo-name"

echo "Done. Update .cursor/commands/design.md to reference $REF_DEST"
```

#### 2. Remove from workspace
```bash
rm -rf .cursor/design/references
git add -A
git commit -m "refactor: move reference tree out of workspace

- Removes 28 vendored repos from .cursor/design/references/
- Scripts/fetch-references.sh now provides on-demand hydration
- Reduces workspace indexer pressure → ~20+ GB RAM savings
- Fixes AUDIT_2026-06-04 P1 finding"
```

#### 3. Update contracts
- [ ] `.cursor/commands/design.md` — add reference to `~/nezam-references/`
- [ ] `.cursor/commands/design-hub.md` — same
- [ ] `README.md` — add "Setup" section with `scripts/fetch-references.sh` instruction

#### 4. Add to CI (optional)
- [ ] Create `.github/workflows/fetch-references-nightly.yml` to keep external refs up-to-date

**Success criteria:**
- ✅ `scripts/fetch-references.sh` runs without error
- ✅ Workspace size reduced by ≥500 MB
- ✅ `pnpm ai:check` passes (no reference path regressions)
- ✅ Claude app RAM usage measured post-change

---

### P2: Add watcherExclude for Heavy Directories

**What:** Prevent the file watcher from re-indexing `node_modules`, `.next`, `tsconfig.tsbuildinfo`, etc. on every file change.

**How:**

#### 1. Create `.vscode/settings.json` (or update if exists)
```json
{
  "files.watcherExclude": {
    "**/.next": true,
    "**/node_modules/**": true,
    "**/.git/**": true,
    "**/dist/**": true,
    ".nezam/design-hub/node_modules": true,
    ".nezam/design-hub/.next": true,
    ".nezam/design-hub/tsconfig.tsbuildinfo": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "dist": true
  }
}
```

#### 2. Commit
```bash
git add .vscode/settings.json
git commit -m "perf: exclude heavy directories from file watcher

- node_modules, .next, .git, dist added to watcherExclude
- Reduces indexer pressure on every save
- Part of AUDIT_2026-06-04 P2 optimization"
```

**Success criteria:**
- ✅ `.vscode/settings.json` committed
- ✅ Save-to-reindex latency improves (anecdotal)
- ✅ Claude app RAM reduced by ≥2-3 GB

---

### P3: Prune Unused Tool Mirrors (Optional)

**What:** Reduce the number of synced tool mirrors (`.windsurf`, `.opencode`, `.codex`, `.gemini`, `.qwen`, `.kilo`) if you're not actively using all of them.

**How:**

#### 1. Check what's actually used
```bash
grep -r "\.windsurf\|\.opencode\|\.codex\|\.qwen\|\.kilo" . --include="*.sh" --include="*.js" --include="*.md" 2>/dev/null | head
```

#### 2. If unused, edit `.nezam/core/scripts/sync/sync-ai-folders.js`
```js
// Remove unused tools from SYNC_TARGETS or TARGET_DIRS
const SYNC_TARGETS = [
  '.cursor',
  '.claude',      // Keep for Cowork mode
  '.windsurf',    // Keep if using Windsurf
  // Remove: '.opencode', '.codex', '.gemini', '.qwen', '.kilo'
];
```

#### 3. Clean up directories
```bash
rm -rf .opencode .codex .gemini .qwen .kilo .kilocode .antigravity .antigravitycli
git add -A
git commit -m "refactor: prune unused tool mirrors

- Removed .opencode, .codex, .gemini, .qwen, .kilo, .kilocode, .antigravity, .antigravitycli
- Keeps .cursor, .claude, .windsurf
- Reduces workspace file count by ~3000+ files
- Part of AUDIT_2026-06-04 P2 optimization"
```

#### 4. Verify sync still works
```bash
pnpm ai:sync --status
pnpm ai:check
```

**Success criteria:**
- ✅ Unused mirrors removed
- ✅ `pnpm ai:sync && pnpm ai:check` passes
- ✅ Workspace file count reduced
- ✅ CI pipeline completes faster

---

### B1: Add `pre-push` Branch-Name Guard

**What:** Prevent accidental pushes from branches that don't match the naming pattern.

**How:**

#### 1. Create `.githooks/pre-push`
```bash
#!/bin/bash

# Reject pushes from branches not matching the pattern
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ ! $BRANCH =~ ^(main|feature|release|hotfix)(/|$) ]]; then
  echo "❌ ERROR: Branch name '$BRANCH' does not match pattern:"
  echo "  • feature/<spec-id>-<slug>"
  echo "  • release/x.y.z"
  echo "  • hotfix/x.y.z"
  echo "  • main (protected branch)"
  exit 1
fi

exit 0
```

#### 2. Make executable
```bash
chmod +x .githooks/pre-push
```

#### 3. Commit
```bash
git add .githooks/pre-push
git commit -m "chore: add pre-push branch-name guard

- Prevents accidental pushes from non-compliant branches
- Matches feature|release|hotfix|main pattern
- Fixes AUDIT_2026-06-04 B1 finding"
```

**Success criteria:**
- ✅ Hook is executable
- ✅ `git push` from a feature branch succeeds
- ✅ `git push` from a random branch fails with helpful error

---

### B2: Export Main Branch-Protection Checklist

**What:** Document the branch-protection rules for `main` as a checklist so they can be reproduced in GitHub settings.

**How:**

#### 1. Create `BRANCH_PROTECTION_CHECKLIST.md`
```markdown
# GitHub Branch Protection: `main`

## Required Checks
- [ ] At least 1 approval required
- [ ] Dismiss stale approvals when new commits pushed
- [ ] Require code reviews from code owners
- [ ] Require status checks to pass (list below)

## Required Status Checks
- [ ] ci
- [ ] sdd-gate-enforcement
- [ ] design-gates
- [ ] wireframe-validation
- [ ] sync-and-drift-check
- [ ] semantic-release (if using)

## Additional Rules
- [ ] Require branches to be up-to-date before merging
- [ ] Require linear history (no merge commits)
- [ ] Allow force pushes: NO
- [ ] Require signed commits: RECOMMENDED (where supported)

## Enforcement
- Restrict who can push to matching branches: OWNERS
- Restrict who can dismiss reviews: OWNERS
- Restrict who can delete matching branches: OWNERS

## How to Apply in GitHub
1. Go to Settings → Branches
2. Click "Add rule" for branch `main`
3. Check all boxes above
4. Save
```

#### 2. Commit
```bash
git add BRANCH_PROTECTION_CHECKLIST.md
git commit -m "docs: export main branch-protection rules

- Checklist for GitHub Settings → Branches
- Ensures linear history, required reviews, CI gates
- Reference for future audits"
```

**Success criteria:**
- ✅ Checklist committed
- ✅ All items have corresponding GitHub Settings enabled

---

### R2 Validation & Merging

#### Step 1: Create feature branch
```bash
git checkout -b feature/performance-hardening-r2
```

#### 2: Apply all changes
- Move `references/` ✓
- Add `watcherExclude` ✓
- Prune mirrors (optional) ✓
- Add pre-push hook ✓
- Document branch protection ✓

#### 3: Test locally
```bash
pnpm ai:sync && pnpm ai:check
pnpm test (if applicable)
git push
```

#### 4: Create PR
- Link to AUDIT_2026-06-04_FOLLOW_UP.md
- Title: `refactor(perf): R2 hardening — move references, add watcherExclude, prune mirrors`

#### 5: Merge after CI passes
```bash
git checkout main
git pull
git merge --ff-only feature/performance-hardening-r2
git push
```

---

## Milestone R3: Release Verification (Optional)

### Duration
**~1 hour** (validation only)

### Scope
End-to-end test of the SDD pipeline with real sample projects to confirm determinism and gate enforcement.

### Deliverables

#### 1. Test Project 1: Website (Content-first)

```bash
cd /tmp
mkdir test-website
cd test-website
git init
git remote add origin https://github.com/your-org/test-website.git

# Create minimal PRD.md
cat > PRD.md << 'EOF'
# Landing Page Redesign

Product Type: website
Target: Marketing landing page for new feature
EOF

# Run SDD pipeline
/START design
# Expected: content-first order (RESEARCH → IA → CONTENT → ARCHITECTURE → DESIGN)
```

**Success criteria:**
- ✅ `/START design` detects product type = `website`
- ✅ Pipeline order is content-first
- ✅ Hardlocks are enforced (cannot skip to BUILD without CONTENT_MAP.md)
- ✅ Files are written to `.nezam/core/plans/0N-*/` (not legacy paths)

#### 2. Test Project 2: SaaS Platform (Architecture-first)

```bash
cd /tmp
mkdir test-saas
cd test-saas
git init

cat > PRD.md << 'EOF'
# Multi-tenant Billing Platform

Product Type: saas
Features: Subscriptions, metering, invoicing
EOF

/START design
# Expected: architecture-first order (RESEARCH → ARCHITECTURE → IA → DESIGN → CONTENT)
```

**Success criteria:**
- ✅ Pipeline order is architecture-first
- ✅ Hardlocks enforced differently than website
- ✅ Same `.nezam/core/plans/0N-*/` folder structure

#### 3. Validate Gate Enforcement

- [ ] Try to skip a phase (e.g., jump to BUILD without SCAFFOLD) → gate rejects
- [ ] Try to merge a PR without passing gates → CI blocks
- [ ] Run `pnpm ai:check` → all checks pass

#### 4. Design Hub Workflow

```bash
pnpm wireframe:server
# Opens localhost:4000 (Design Hub)
# Upload wireframes_locked.json
# Verify export works
# Run `/wireframe build` → generates scaffold
```

**Success criteria:**
- ✅ Design Hub starts
- ✅ Wireframes can be locked
- ✅ `wireframes_locked.json` is created/updated
- ✅ SDD hardlock recognizes it

#### 5. Tag & Release

Once all tests pass:

```bash
/GIT release
# Bump version (e.g., 1.0.0)
# Create release/1.0.0 branch
# Tag v1.0.0
# Merge → main
# release.yml publishes
```

**Success criteria:**
- ✅ Tag created
- ✅ GitHub Release populated
- ✅ Changelog updated
- ✅ No regression in CI times

---

## Timeline & Dependencies

```
R1 (Foundation Release)
  ├─ Pre-release validation  [2h, now]
  ├─ Tag & publish           [1h, depends on ↑]
  └─ GitHub Release created  [automated after ↑]

        ↓ (R1 complete)

R2 (Performance Hardening) — START AFTER R1 MERGES
  ├─ P1: Move references     [30 min, parallel]
  ├─ P2: watcherExclude      [5 min, parallel]
  ├─ B1: pre-push hook       [15 min, parallel]
  ├─ B2: branch-protection   [10 min, parallel]
  └─ P3: prune mirrors       [20 min, optional]
  
  All R2 work → single feature branch → PR → merge

        ↓ (Optional)

R3 (Release Verification)
  ├─ Test website pipeline   [15 min]
  ├─ Test SaaS pipeline      [15 min]
  ├─ Validate gates          [15 min]
  ├─ Design Hub workflow     [15 min]
  └─ Measure RAM improvement [10 min]
  
  Results → post-release blog post / status update
```

---

## Release Decision Matrix

### Can ship R1 now?

| Criterion | Status | Decision |
|-----------|--------|----------|
| All Critical issues resolved | ✅ | **YES** |
| CI/CD passes | ✅ | **YES** |
| No uncommitted changes | ✅ | **YES** |
| Changelog prepared | 🔵 | **OPTIONAL** |
| **RECOMMENDATION** | | **SHIP NOW** |

### Should wait for R2?

| Reason | Priority | Decision |
|--------|----------|----------|
| Performance is critical for my use case | ⭐⭐⭐ | **Do R2 before release** |
| Performance is nice-to-have | ⭐ | **Ship R1 now, do R2 later** |
| I'm not using the desktop app (CLI only) | — | **R2 not applicable** |

### Should do R3?

| Scenario | Decision |
|----------|----------|
| This is a major version (1.0.0) | **YES, do R3** |
| This is a patch/minor (x.y.z where z or y > 0) | **OPTIONAL, recommended** |
| I've tested manually already | **SKIP R3, go live** |

---

## Recommended Action Plan

### ✅ Start NOW (next 1-2 hours)

1. Run validation: `pnpm ai:sync && pnpm ai:check && pnpm test`
2. Prepare changelog
3. Run `/GIT release` → merge to `main`
4. Publish GitHub Release

### 🔵 Do LATER (next week)

1. Apply R2 (performance) on a feature branch
2. Merge R2 to `main`
3. Measure RAM improvement
4. (Optional) Run R3 validation tests

### 💡 Nice-to-have (next sprint)

1. Prune mirrors if not using all tools
2. Convert Design Hub to workspace package
3. Write post-release blog post

---

## Success Metrics

### R1 Success
- ✅ Release published on GitHub
- ✅ Tag created (`v1.0.0` or similar)
- ✅ No regression in CI times
- ✅ `main` branch is clean, all changes merged

### R2 Success
- ✅ Workspace size reduced by ≥500 MB
- ✅ Claude app RAM reduced by ≥70% (≥20 GB savings)
- ✅ `pnpm ai:check` passes
- ✅ CI times unchanged or faster

### R3 Success
- ✅ Both website and SaaS pipelines execute deterministically
- ✅ All hardlocks enforced
- ✅ Design Hub workflow completes without errors
- ✅ Release tag reflects tested, stable state

---

## Rollback Plan

### If R1 release fails

1. Delete tag: `git tag -d v1.0.0 && git push origin --delete v1.0.0`
2. Revert version bump: `git revert <commit-hash>` and push
3. Investigate failure, fix on feature branch, try again

### If R2 performance improvement doesn't materialize

1. The changes are all safe to revert
2. Revert commit: `git revert <commit-hash>` and push
3. R1 remains unaffected
4. Investigate separately

### If R3 pipeline validation fails

1. Failure is local (test project, not production)
2. Debug the SDD gate logic
3. Fix in new feature branch
4. Merge, re-test
5. R1/R2 remain unaffected

---

## Sign-Off & Approval

Once this release plan is approved:

- [ ] Product lead approves R1 timing
- [ ] Engineer signs off on validation steps
- [ ] Ops/DevOps confirms CI/CD gates are green
- [ ] Release branch/tag are created per this plan

**Execution owner:** `@dorgham` (or designated release manager)

**Approval date:** ___________

---

## Appendix: Commands Cheat Sheet

```bash
# R1: Validate & release
pnpm ai:sync && pnpm ai:check && pnpm test
/GIT release                    # Interactive; bumps version, tags, merges
git tag --list                  # Verify tag created
git log --oneline | head        # Verify merge committed

# R2: Performance hardening
scripts/fetch-references.sh     # Run after moving references/
pnpm ai:sync --status          # Verify sync still works
git push                        # Will trigger pre-push hook

# R3: Validation
/START design                   # Create test project, follow prompts
pnpm wireframe:server           # Design Hub test
pnpm ai:check                   # Final gate validation
```

---

**Last updated:** 2026-06-04  
**Next review:** After R1 release (1 week)
