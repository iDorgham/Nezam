# SDD Phase Automation Guide

Complete guide to automated GitHub branch and PR creation for every SDD phase.

## Overview

NEZAM Phase Automation creates dedicated GitHub branches and pull requests for each SDD phase, ensuring structured, gated development with complete tracking and documentation.

```
Planning → SEO/AEO → IA → Content → Design → Development → Release
   ↓         ↓       ↓      ↓        ↓          ↓            ↓
  Branch    Branch  Branch Branch  Branch     Branch       Branch
   + PR      + PR    + PR    + PR    + PR       + PR         + PR
```

## Phases

| Phase | Description | Branch Pattern | Duration |
|-------|-------------|-----------------|----------|
| **planning** | Strategy, requirements, scope | `phase/planning/YYYY-MM-DD` | 3-5 days |
| **seo-aeo** | Keyword research, content planning | `phase/seo-aeo/YYYY-MM-DD` | 2-3 days |
| **ia** | Information architecture, sitemap | `phase/ia/YYYY-MM-DD` | 2-3 days |
| **content** | Writing, copy, flows | `phase/content/YYYY-MM-DD` | 3-5 days |
| **design** | Visual design, components, tokens | `phase/design/YYYY-MM-DD` | 5-7 days |
| **development** | Code implementation, testing | `phase/development/YYYY-MM-DD` | 7-14 days |
| **release** | Deployment, monitoring, hardening | `phase/release/YYYY-MM-DD` | 2-3 days |

## Getting Started

### Option 1: Local Shell Script

Create a phase branch locally:

```bash
# Create a specific phase branch
pnpm phase:create planning

# Or use phase-specific shortcuts
pnpm phase:planning    # Planning phase
pnpm phase:seo        # SEO/AEO phase
pnpm phase:ia         # IA phase
pnpm phase:content    # Content phase
pnpm phase:design     # Design phase
pnpm phase:develop    # Development phase
pnpm phase:release    # Release phase
```

**What it does:**
1. Creates branch: `phase/<phase>/YYYY-MM-DD`
2. Generates `.cursor/state/phase-<phase>.yaml`
3. Creates `.nezam/core/plans/<phase>/progress.md`
4. Commits files with phase-specific message
5. Pushes to remote

### Option 2: GitHub Actions Workflow

Trigger via GitHub UI or CLI:

```bash
# Using GitHub CLI
gh workflow run sdd-phase-automation.yml \
  -f phase=planning

# Or visit Actions tab on GitHub
# Select "SDD Phase Automation" workflow
# Click "Run workflow"
# Select phase from dropdown
# Click "Run workflow"
```

**Automated process:**
1. GitHub creates branch with date stamp
2. Initializes phase state files
3. Creates PR with phase-specific template
4. Auto-generates tracking issue
5. Applies phase labels

## Phase State Files

Each phase has a state file tracking its status:

**Location**: `.cursor/state/phase-<phase>.yaml`

**Contents**:
```yaml
phase: planning
status: in_progress              # in_progress, testing, completed, merged
created_at: 2024-12-01T10:30:00Z
branch: phase/planning/2024-12-01
created_by: "Your Name"
email: "your.email@example.com"

requirements_checklist:
  - item: "Define requirements"
    status: pending              # pending, in_progress, completed
  - item: "Document scope"
    status: pending

git_info:
  branch: phase/planning/2024-12-01
  commit_hash: "abc123def..."
  remote_url: "https://github.com/..."
```

## Phase Progress Files

Track phase work in progress markdown:

**Location**: `.nezam/core/plans/<phase>/progress.md`

**Structure**:
- Objectives (checklist)
- Deliverables (checklist)
- Status Checklist (phase lifecycle)
- Timeline (planned vs. actual)
- Team Members
- Dependencies
- Blockers & Risks
- Notes & Updates

**Example**:
```markdown
# Planning Phase Progress

**Started**: 2024-12-01T10:30:00Z
**Branch**: phase/planning/2024-12-01

## Objectives
- [ ] Define scope
- [ ] Identify requirements
- [ ] Plan resources

## Deliverables
- [ ] Requirements document
- [ ] Project timeline
- [ ] Resource allocation

## Status Checklist
- [x] Phase started
- [ ] Work in progress
- [ ] Ready for review
- [ ] Approved
- [ ] Merged to main
```

## GitHub PR Process

### Automated PR Template

Each phase PR uses the phase-specific template: `.github/pull_request_template_phase.md`

**Key sections**:
1. **Phase Information** - Phase name, branch, related issue
2. **What Changed** - Phase objectives and deliverables
3. **Why** - Business and technical rationale
4. **Phase Gate Checklist** - Pre-merge requirements
5. **SDD Phase Transition** - Next phase preparation
6. **Metrics & Evidence** - Progress tracking
7. **Release Impact** - SemVer classification
8. **Stakeholder Sign-Off** - Approval tracking

### PR Labels

Automatically applied to phase PRs:

```
sdd-phase:planning     # Phase identifier
automation             # Bot-generated
phase-gate             # Phase gate tracking
```

### PR Status Checks

Phase PRs must pass:
- ✅ Requirements Gate (phase artifacts exist)
- ✅ Documentation Gate (progress file complete)
- ✅ Sequential Gate (phases in correct order)
- ✅ Quality Gate (state and drift checks)

## GitHub Issues

Each phase gets an auto-generated tracking issue:

**Title**: `📋 <Phase> Phase Tracking`

**Contents**:
- Phase checklist (requirements, execution, completion)
- Links to progress files
- Timeline tracking
- Team assignments
- Status updates

**Labels**:
```
sdd-phase:<phase>      # Phase identifier
tracking               # Issue type
phase                  # Category
```

## Workflows

### sdd-phase-automation.yml

**Trigger**: Manual via `workflow_dispatch`

**Steps**:
1. Validate phase input
2. Check if branch exists
3. Create phase branch
4. Generate state files
5. Create PR with template
6. Create tracking issue
7. Apply labels

### sdd-phase-gates.yml

**Trigger**: PR with phase/* branches

**Gates**:
1. **Requirements Gate** - State and progress files exist
2. **Documentation Gate** - Progress file complete
3. **Sequential Gate** - Phases in correct order
4. **Quality Gate** - AI state and drift checks

## Merging a Phase

When a phase is complete:

```bash
# 1. Ensure all checklist items are marked complete
# 2. Request final reviews on PR
# 3. Merge PR to main
git merge --squash phase/<phase>/YYYY-MM-DD

# 4. Delete phase branch
git branch -d phase/<phase>/YYYY-MM-DD
git push origin --delete phase/<phase>/YYYY-MM-DD

# 5. Update phase state
sed -i 's/status: in_progress/status: merged/' ".cursor/state/phase-<phase>.yaml"
git add ".cursor/state/phase-<phase>.yaml"
git commit -m "ci: Mark <phase> phase as merged"
git push origin main
```

## Best Practices

### Creating a Phase

✅ **Do:**
- Create phase at start of work
- Use consistent naming (lowercase, hyphens)
- Document objectives clearly
- Set team member roles
- Plan timeline realistically

❌ **Don't:**
- Manually create phase branches outside workflow
- Skip progress file updates
- Leave checklist incomplete
- Work without phase PR
- Merge without stakeholder approval

### Managing Phases

✅ **Do:**
- Update progress file regularly
- Keep checklist current
- Track blockers and risks
- Communicate delays early
- Review gates before merge

❌ **Don't:**
- Let progress file become stale
- Bypass phase gates
- Skip documentation
- Merge incomplete phases
- Work on multiple phases simultaneously

### Transitioning to Next Phase

✅ **Do:**
- Wait for current phase to merge
- Archive completed phase artifacts
- Create next phase immediately after
- Update team timeline
- Document lessons learned

❌ **Don't:**
- Start next phase before current merges
- Skip phase transition communication
- Lose phase history
- Skip overlap period
- Forget phase dependencies

## Troubleshooting

### Branch Already Exists

If phase branch already exists:

```bash
# Option 1: Continue with existing branch
git checkout phase/<phase>/YYYY-MM-DD
git pull origin

# Option 2: Create new branch with different date
pnpm phase:create <phase>  # Auto-generates new date
```

### PR Not Creating

Check:
- GitHub token permissions (needs `contents:write`, `pull-requests:write`)
- Branch exists and is pushed to remote
- No merge conflicts with main
- Labels don't exist yet

### Gates Failing

Common issues:
- State file doesn't exist → Run phase creation script
- Progress file incomplete → Update with checklists
- Previous phases not complete → Check phase order
- Drift detected → Run `pnpm ai:check`

## Automation Files

### GitHub Actions
- `.github/workflows/sdd-phase-automation.yml` - Create phase branches
- `.github/workflows/sdd-phase-gates.yml` - Enforce phase gates

### PR Templates
- `.github/pull_request_template.md` - Standard PRs
- `.github/pull_request_template_phase.md` - Phase PRs

### Scripts
- `.nezam/core/scripts/phase/create-phase-branch.sh` - Local phase creation
- Package.json scripts: `pnpm phase:*`

### State & Documentation
- `.cursor/state/phase-<phase>.yaml` - Phase state
- `.nezam/core/plans/<phase>/progress.md` - Phase progress

## Examples

### Example: Planning Phase

```bash
# Create planning phase
pnpm phase:planning

# Output:
# ✅ Phase validation passed: planning
# ✅ Branch created: phase/planning/2024-12-01
# ✅ Created phase state file: .cursor/state/phase-planning.yaml
# ✅ Created phase progress file: .nezam/core/plans/planning/progress.md
# ✅ Committed phase files
# ✅ Pushed branch: origin/phase/planning/2024-12-01
```

After creation:
1. PR auto-created on GitHub
2. Tracking issue auto-created
3. Labels automatically applied
4. Gates enforced

### Example: Design Phase

```bash
# Create design phase after completing previous phases
pnpm phase:design

# Sequential gate checks:
# ✅ planning - completed
# ✅ seo-aeo - completed
# ✅ ia - completed
# ✅ content - completed
# ✅ design - ready to start (current)
```

## Integration with Workflow

### Standard Workflow

```
1. /START all (onboarding)
   ↓
2. pnpm phase:planning (create planning branch)
   - Define requirements
   - Document scope
   - Plan timeline
   - Merge PR
   ↓
3. pnpm phase:seo (create SEO/AEO branch)
   - Research keywords
   - Plan content
   - Map strategy
   - Merge PR
   ↓
4. ... (continue through all phases)
   ↓
7. pnpm phase:release (create release branch)
   - Deploy to production
   - Monitor metrics
   - Document learnings
   - Merge PR
```

### Each Phase in GitHub

```
1. Create branch + PR (automated)
2. Review PR template
3. Update progress file with objectives
4. Work on deliverables
5. Check off items as complete
6. Request final reviews
7. Merge PR
8. Next phase starts
```

## Monitoring & Reporting

### Phase Status

View all phases:
```bash
ls -la .cursor/state/phase-*.yaml
```

Check specific phase:
```bash
cat .cursor/state/phase-planning.yaml
```

### Progress Tracking

View phase progress:
```bash
cat .nezam/core/plans/<phase>/progress.md
```

### GitHub Insights

- PR list filtered by label: `label:sdd-phase:planning`
- Issues by phase: `label:sdd-phase:design`
- Timeline view: Projects tab shows phase PRs

## Customization

### Adding New Phases

Edit valid phases list in:
- `.github/workflows/sdd-phase-automation.yml` - workflow input
- `.nezam/core/scripts/phase/create-phase-branch.sh` - script validation
- `package.json` - phase shortcuts

### Modifying Templates

Edit templates:
- `.github/pull_request_template_phase.md` - PR template
- `.nezam/core/scripts/phase/create-phase-branch.sh` - Progress file template

### Adjusting Gates

Edit gate requirements in:
- `.github/workflows/sdd-phase-gates.yml` - Gate logic
- `.cursor/state/develop_phases.yaml` - Phase configuration

---

**Learn more**: See [SDD Pipeline Documentation](.nezam/core/prd/PRD.md) for phase details.
