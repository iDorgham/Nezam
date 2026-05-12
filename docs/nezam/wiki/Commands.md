# Commands Reference

NEZAM uses slash commands to trigger governed workflows. Commands are defined in `.cursor/commands/` and synced to all AI clients.

## Command Index

| Command | File | Purpose |
|---|---|---|
| `/START` | `start.md` | Initialize or resume the workspace |
| `/PLAN` | `plan.md` | Build and populate phase plans |
| `/DEVELOP` | `develop.md` | Start a feature development slice |
| `/CHECK` | `check.md` | Run workspace readiness checks |
| `/FIX` | `fix.md` | Diagnose and repair issues |
| `/SCAN` | `scan.md` | Full workspace health audit |
| `/DEPLOY` | `deploy.md` | Trigger release/deploy pipeline |
| `/GIT` | `git.md` | Conventional commits + PR workflow |
| `/CREATE` | `create.md` | Create new specs, agents, skills |
| `/GUIDE` | `guide.md` | Get contextual help |
| `/HELP` | `help.md` | List all commands |
| `/SETTINGS` | `settings.md` | Configure workspace settings |
| `/FOUNDER` | `founder.md` | Founder-mode strategic prompt |

---

## `/START`

Initializes the workspace for a session. Loads context, checks prerequisites, and orients the AI.

**What it does:**
1. Reads `docs/memory/CONTEXT.md` and `docs/memory/MEMORY.md`
2. Checks `docs/prd/PRD.md` exists
3. Identifies the current SDD phase from `docs/plans/INDEX.md`
4. Loads the relevant agents for that phase
5. Reports current workspace health

**Usage:** Type `/START` in Cursor chat to begin any session.

---

## `/PLAN`

Builds or updates the phase execution plan.

**What it does:**
1. Reviews PRD requirements
2. Creates or updates `docs/plans/` task files
3. Maps requirements to PT-IDs
4. Sets gate prerequisites
5. Updates `docs/plans/INDEX.md`

---

## `/DEVELOP`

Starts a feature development slice.

**Prerequisites (hardlocked):**
- `DESIGN.md` must exist and pass token check
- Test matrix must be defined for this feature
- Phase 02 (design) gate must be passed

**What it does:**
1. Reads the feature spec
2. Loads domain-appropriate agents
3. Begins implementation with spec-first approach

---

## `/CHECK`

Runs all readiness checks.

```bash
# What runs:
scripts/checks/check-onboarding-readiness.sh
scripts/checks/check-design-tokens.sh
pnpm ai:check
```

---

## `/FIX`

Diagnoses workspace issues and proposes fixes.

Modes:
- `/FIX` — auto-detect issues
- `/FIX agents` — repair agent routing
- `/FIX sync` — repair AI client sync
- `/FIX gates` — repair broken gate matrix
- `/FIX design` — repair design contract issues

---

## `/SCAN`

Full workspace audit. Outputs a structured health report covering:
- Documentation completeness
- Agent coverage gaps
- Skill coverage gaps
- Memory freshness
- Gate matrix integrity
- Multi-client sync status

---

## `/DEPLOY`

Triggers the release pipeline:
1. Runs full test suite
2. Generates CHANGELOG via semantic-release
3. Creates release tag
4. Deploys to staging, then production

---

## `/GIT`

Conventional commits workflow:
1. Stages changes
2. Suggests commit message following Conventional Commits spec
3. Optionally creates PR with description

Commit format: `type(scope): description`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

---

## Creating Custom Commands

Add a new `.md` file to `.cursor/commands/`. Then run `pnpm ai:sync` to distribute to all clients.

Template in `docs/templates/ai-client/CLAUDE.md.template.md`.
