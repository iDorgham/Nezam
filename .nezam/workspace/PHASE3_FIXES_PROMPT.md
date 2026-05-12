# NEZAM — Phase 3: Fix Weaknesses · Add Missing Systems · Expand Multi-Tool Support
## PRD Path Fix · Agent/Skill Versioning · State Validation · Sync Automation · Tool Entrypoints · Dev Method Overlays

**For:** Cursor (primary) · Claude Code · Antigravity · any AI tool with file access  
**Run after:** PHASE2_ENHANCEMENT_PROMPT.md has been implemented  
**Scope:** Fixes 6 weaknesses, adds 5 missing systems, expands multi-tool support to 10+ tools, adds 3 dev method overlays

---

## Context for the AI

You are working inside the NEZAM workspace — a Specification-Driven Development (SDD) governance
system. Previous prompts have:
- Restructured `docs/` so `.nezam/workspace/` is governance and `docs/prd|plans|reports/` is user project
- Redesigned `/start` into a full onboarding flow with hardlock gates
- Removed `/founder`, rewrote `/guide`, added `/check` gate validation
- Added 3 state files: `onboarding.yaml`, `plan_progress.yaml`, `develop_phases.yaml`
- Added skills: `sdd-gate-validator`, `progress-narrator`, `wireframe-catalog`

**This prompt handles:** fixing critical path conflicts, hardening the state layer, adding versioning,
expanding multi-tool support, and adding flexible development method overlays.

**Do NOT touch:**
- `.nezam/design/` — all 150+ design profiles, catalog.json, README.md
- `.nezam/workspace/` — workspace governance docs (read-only from user projects)
- `docs/prd/PRD.md` — user's active project file
- `DESIGN.md` at repo root — user's chosen design (if exists)
- `.cursor/state/*.yaml` — do not reset values already set by user

---

## TASK 1 — Fix PRD Path Conflict (CRITICAL — fix first)

### The Problem

`workspace-orchestration.mdc` contains a legacy section that references the old path
`docs/prd/PRD.md`. All new commands and state files use `docs/prd/PRD.md`.
This conflict causes gate failures that no command can resolve.

### 1A. Fix workspace-orchestration.mdc

**File:** `.cursor/rules/workspace-orchestration.mdc`

Find and replace the entire `## Planning hardlock prerequisite` section (lines 14–25).
Replace with this corrected version:

```markdown
## Planning hardlock prerequisite (legacy — superseded)

> **Note:** This section is preserved for reference only.
> Active hardlock enforcement reads `.cursor/state/onboarding.yaml` (see SDD hardlock section below).
> The canonical PRD path is `docs/prd/PRD.md` (configurable via `docs/gates/workspace.paths.yaml`).
> Do NOT use `docs/prd/PRD.md` — that path no longer exists.
```

Then find every other occurrence of `docs/prd/PRD.md` in the file.
Replace each with `docs/prd/PRD.md`.

Also find `docs/prd/PROJECT_PROMPT.md` and replace with:
`docs/prd/PROJECT_PROMPT.md` (note: this file is optional, not hardlocked).

Also find `docs/core/VERSIONING.md` and replace with:
`.nezam/workspace/VERSIONING.md` (governance file, not user project file).

Also find `docs/prd/sdd/WIREFRAMES.md` (appears in sdd-gate-validator skill).
Replace with `docs/plans/design/WIREFRAMES.md`.

### 1B. Fix sdd-gate-validator SKILL.md

**File:** `.cursor/skills/system/sdd-gate-validator/SKILL.md`

Find Gate 1 → 2 artifact paths. Replace:

```
  - `design_wireframes: true` → (`docs/plans/04-design/DESIGN_CHOICES.yaml` **or** `docs/plans/04-design/DESIGN_CHOICES.md`) **and** `docs/prd/sdd/WIREFRAMES.md` exist
```

With:

```
  - `design_wireframes: true` → (`docs/plans/04-design/DESIGN_CHOICES.yaml` **or** `docs/plans/04-design/DESIGN_CHOICES.md`) **and** `docs/plans/design/WIREFRAMES.md` exist
```

### 1C. Fix health-score SKILL.md

**File:** `.cursor/skills/system/health-score/SKILL.md`

Find:
```
- Required planning and design artifacts in `docs/prd/` and root docs.
```

Replace with:
```
- Required planning artifacts in `docs/plans/` and design artifacts at root `DESIGN.md`.
- PRD artifact at `docs/prd/PRD.md` (or path from `docs/gates/workspace.paths.yaml`).
```

### 1D. Verify — do a final search

After making all edits, search every file under `.cursor/` for the string `docs/core/required`.
If any remaining occurrence is found that is NOT inside a comment or `> Note:` block → fix it.

---

## TASK 2 — Add Agent / Skill Versioning System

### Why

Without versioning, NEZAM cannot be distributed as a public template. Breaking changes
to agents or skills silently break projects using older versions. Versioning + changelogs
create trust and an upgrade path.

### 2A. Add version frontmatter standard to all agents

Every agent `.md` file in `.cursor/agents/` must have this frontmatter block.

Check each agent file. If it already has `version:` in frontmatter → skip it.
If it does NOT have `version:` → add the following frontmatter fields:

```yaml
version: 1.0.0
certified: false
updated: 2026-05-12
changelog: []
```

Add these fields inside the existing `---` frontmatter block, after any existing fields.
Do not remove or change existing frontmatter (role, code-name, subagents, etc.).

**Apply to these agents at minimum (others already have version in their skill files):**

```
swarm-leader.md
deputy-swarm-leader.md
subagent-controller.md
executive-director.md
product-officer.md
product-manager.md
project-architect.md
design-lead.md
frontend-lead.md
backend-lead.md
qa-test-lead.md
devops-manager.md
```

### 2B. Verify skills already have version frontmatter

All `.cursor/skills/**/SKILL.md` files written in Phase 1 and Phase 2 already have
`version: 1.0.0` in frontmatter. Verify the following exist:

- `.cursor/skills/system/sdd-gate-validator/SKILL.md` → has `version:` ✅
- `.cursor/skills/system/progress-narrator/SKILL.md` → has `version:` ✅
- `.cursor/skills/system/health-score/SKILL.md` → has `version:` ✅

For any skill that is MISSING `version:` → add:
```yaml
version: 1.0.0
updated: 2026-05-12
changelog: []
```
inside the existing `---` frontmatter block.

### 2C. Update AGENT_REGISTRY.yaml to track versions

**File:** `.cursor/state/AGENT_REGISTRY.yaml`

Add these fields at the top level (after the existing `created` and `version` fields):

```yaml
nezam_version: "3.0.0"           # NEZAM workspace version (bump on breaking changes)
last_sync: ""                     # set by pnpm ai:sync
certified_agents: []              # agents that have passed EVAL_FRAMEWORK review
```

In the `registry.always_load` section, add `version` to each entry:

```yaml
registry:
  always_load:
    - name: swarm-leader
      tier: tier-0
      swarm: cpo
      version: "1.0.0"
      summary: Chief orchestration and go/no-go authority.
    - name: deputy-swarm-leader
      tier: tier-0
      swarm: coordination
      version: "1.0.0"
      summary: Cross-swarm coordination and handoff governance.
```

In `agents_catalog`, add `version: "1.0.0"` to every agent entry that does not already
have it. Use bulk replace — every agent in the catalog gets `version: "1.0.0"`.

### 2D. Create VERSIONING.md in .nezam/workspace/

**File:** `.nezam/workspace/VERSIONING.md`
**Action:** Create this file.

```markdown
# NEZAM Versioning Policy

## Workspace Version (nezam_version in AGENT_REGISTRY.yaml)

NEZAM follows SemVer for the workspace itself:

| Change | Version bump |
|--------|-------------|
| Breaking change to any gate, hardlock, or state file schema | MAJOR (e.g. 2.x → 3.0) |
| New agent, skill, command, or rule added | MINOR (e.g. 3.0 → 3.1) |
| Bug fix, path correction, content improvement | PATCH (e.g. 3.1.0 → 3.1.1) |

Current version: **3.0.0** (set in `.cursor/state/AGENT_REGISTRY.yaml` → `nezam_version`)

## Agent / Skill Version (version: in frontmatter)

Each agent and skill has its own `version:` field in frontmatter.

| Change | Version bump |
|--------|-------------|
| Changed behavior, new gate, new required input | MINOR |
| Typo, wording improvement, doc update | PATCH |
| Complete rewrite of responsibilities or routing logic | MAJOR |

## Certification

An agent is `certified: true` when it has:
1. Passed the EVAL_FRAMEWORK.md criteria at Tier 1 or above
2. Been reviewed against its acceptance criteria by swarm-leader
3. Run on at least one real project without producing a blocking failure

Certified agents are listed in `AGENT_REGISTRY.yaml` → `certified_agents`.

## Upgrade Path

When updating NEZAM after initial setup:
1. Check `.nezam/workspace/CHANGELOG.md` for breaking changes
2. Run `pnpm ai:sync` to propagate all changes to mirrors
3. Run `/check gates` to verify state files are compatible
4. If MAJOR bump: re-run `/start gates` to confirm onboarding state is still valid

## NEZAM Changelog

See `.nezam/workspace/CHANGELOG.md`.
```

### 2E. Create .nezam/workspace/CHANGELOG.md

**File:** `.nezam/workspace/CHANGELOG.md`
**Action:** Create this file.

```markdown
# NEZAM Changelog

## [3.0.0] — 2026-05-12

### Breaking Changes
- PRD path changed from `docs/prd/PRD.md` to `docs/prd/PRD.md`
- WIREFRAMES path changed from `docs/prd/sdd/WIREFRAMES.md` to `docs/plans/design/WIREFRAMES.md`
- `/founder` command removed — functionality absorbed by `/start`

### Added
- `/start` full onboarding flow with 4 PRD modes + 2 design paths
- Solo/team mode (`user_mode` in `onboarding.yaml`)
- State files: `onboarding.yaml`, `plan_progress.yaml`, `develop_phases.yaml`
- New skills: `sdd-gate-validator`, `progress-narrator`
- `/guide` rewritten as intelligent project navigator with 7 subcommands
- Response Style System: 3 action block types (PROMPT / TERMINAL / COMMAND)
- Agent versioning: `version:` frontmatter on all agents and skills

### Fixed
- Legacy PRD path references in workspace-orchestration.mdc
- Hardlock gate enforcement now reads state YAML files instead of raw file existence

## [2.0.0] — 2026-05-10

### Added
- NEZAM restructured as workspace template
- `.nezam/workspace/` created as governance layer
- `docs/prd/`, `docs/plans/`, `docs/reports/` as clean user project scaffold
- 150+ design profiles in `.nezam/design/`
- Phase 2 enhancement: `swarm-leader.md` gate enforcement, `subagent-controller.md` state routing

## [1.0.0] — Initial Release

- SDD pipeline: Onboarding → Planning → 6 Build Phases → Ship
- 100+ specialized agents across 13 swarms
- 85+ skills across 8 categories
- 12 rules files including `workspace-orchestration.mdc`
- Multi-tool sync: Cursor → Antigravity, Codex, Claude Code, Kilo, OpenCode
```

---

## TASK 3 — Add State Schema Validation + Auto-Repair

### Why

The 3 state YAML files can become corrupted by partial writes or manual edits.
There is no validation or repair mechanism. A corrupted file can break every gate.

### 3A. Create state schema definitions

**File:** `.cursor/state/schemas/onboarding.schema.yaml`
**Action:** Create this file (and the `schemas/` directory).

```yaml
# Schema for .cursor/state/onboarding.yaml
# Used by sdd-gate-validator and /check gates for validation

required_fields:
  user_mode:
    type: string
    allowed: ["", "solo", "team"]
    default: ""
  tone:
    type: string
    allowed: ["", "friendly", "structured"]
    default: ""
  prd_locked:
    type: boolean
    default: false
  prd_path:
    type: string
    default: "docs/prd/PRD.md"
  prd_locked_at:
    type: string
    default: ""
  design_locked:
    type: boolean
    default: false
  design_profile:
    type: string
    default: ""
  design_locked_at:
    type: string
    default: ""
  planning_complete:
    type: boolean
    default: false
  planning_completed_at:
    type: string
    default: ""
  current_phase:
    type: integer
    min: 0
    max: 6
    default: 0

repair_rules:
  - if: "prd_locked is missing" → set to false
  - if: "design_locked is missing" → set to false
  - if: "planning_complete is missing" → set to false
  - if: "current_phase is missing" → set to 0
  - if: "user_mode not in allowed values" → reset to ""
  - if: "tone not in allowed values" → reset to ""
```

**File:** `.cursor/state/schemas/plan_progress.schema.yaml`
**Action:** Create this file.

```yaml
# Schema for .cursor/state/plan_progress.yaml

required_fields:
  seo:
    type: boolean
    default: false
  ia:
    type: boolean
    default: false
  content:
    type: boolean
    default: false
  arch:
    type: boolean
    default: false
  design_wireframes:
    type: boolean
    default: false
  scaffold:
    type: boolean
    default: false
  planning_complete:
    type: boolean
    default: false

repair_rules:
  - if: any required field is missing → set to false
  - if: planning_complete is true but any phase flag is false → set planning_complete to false
```

**File:** `.cursor/state/schemas/develop_phases.schema.yaml`
**Action:** Create this file.

```yaml
# Schema for .cursor/state/develop_phases.yaml

required_phases: [phase_1, phase_2, phase_3, phase_4, phase_5, phase_6]

phase_required_fields:
  name:
    type: string
  status:
    type: string
    allowed: ["locked", "unlocked", "in_progress", "testing", "complete"]
    default: "locked"
  testing_passed:
    type: boolean
    default: false
  depends_on:
    type: string   # phase name or null
  unlocked_at:
    type: string
    default: ""
  completed_at:
    type: string
    default: ""

sequence_rules:
  - phase_1 is always "unlocked" or later (never "locked") after onboarding
  - phase_N cannot be "complete" unless phase_N-1 is "complete"
  - phase_N cannot be "unlocked" unless phase_N-1 is "complete"
  - testing_passed cannot be true if status is "locked" or "unlocked"

repair_rules:
  - if: any phase is missing → recreate with defaults
  - if: status value not in allowed list → reset to "locked"
  - if: sequence violated (e.g. phase_3 complete but phase_2 not) → reset violating phases
```

### 3B. Add validation step to sdd-gate-validator SKILL.md

**File:** `.cursor/skills/system/sdd-gate-validator/SKILL.md`

Add this section BEFORE the existing `## Gate Definitions` section:

```markdown
## Pre-Gate: State File Validation

Before checking any gate, validate all 3 state files against their schemas.
Schema files are in `.cursor/state/schemas/`.

**Validation steps:**
1. Read `onboarding.yaml` → check all required fields exist and have allowed values
2. Read `plan_progress.yaml` → check all boolean flags exist, check planning_complete consistency
3. Read `develop_phases.yaml` → check all 6 phases exist, check sequence rules

**If validation fails:**
- For missing fields: auto-repair by writing default values → continue gate check
- For invalid values: auto-repair by resetting to default → continue gate check
- For broken sequences: surface as WARNING, do not auto-repair (requires user confirmation)
- Report all repairs made at the end of the gate check output

**Repair report format:**
```
⚠️  State file repairs applied:
   - onboarding.yaml: added missing field `user_mode_set_at: ""`
   - develop_phases.yaml: reset phase_4.status from "xyz" to "locked"
Run /check gates to confirm state is now valid.
```
```

### 3C. Add `/check repair` subcommand to check.md

**File:** `.cursor/commands/check.md`

Add this subcommand after the existing `/CHECK gates` section:

```markdown
## /CHECK repair

Validates and auto-repairs all 3 state YAML files.

Steps:
1. Read schemas from `.cursor/state/schemas/`
2. Read current state files
3. For each file: compare against schema
4. Apply auto-repair for all missing/invalid non-sequence fields
5. Report what was repaired
6. Warn about any sequence violations that require manual review
7. Write repaired values back to state files
8. Run `/check gates` after repair to show current gate status

Use when: state files were manually edited, tool crashed mid-write,
or gate checks return unexpected failures.
```

---

## TASK 4 — Add Git Pre-Commit Hook for Auto-Sync

### Why

The current `pnpm ai:sync` is a manual step. Developers forget it. Mirrors drift.
Drift causes non-Cursor tools to run stale commands. A git hook prevents this at source.

### 4A. Create the pre-commit hook script

**File:** `.git/hooks/pre-commit` (note: `.git/` directory, not tracked)
**Action:** Create this file and make it executable.

```bash
#!/bin/bash
# NEZAM — Auto-sync AI mirrors on commit if .cursor/ changed
# Prevents mirror drift. Runs pnpm ai:sync only when needed.

set -e

# Check if any .cursor/ files are staged
CURSOR_CHANGED=$(git diff --cached --name-only | grep "^\.cursor/" | head -1)

if [ -n "$CURSOR_CHANGED" ]; then
  echo "⚡ NEZAM: .cursor/ files changed — syncing AI mirrors..."
  
  if command -v pnpm &> /dev/null; then
    pnpm ai:sync --quiet
    echo "✅ NEZAM: Mirrors synced. Review changes and re-stage if needed."
    # Stage the updated mirror files
    git add CLAUDE.md AGENTS.md GEMINI.md .claude/ .antigravity/ .codex/ .kilocode/ .opencode/ 2>/dev/null || true
  else
    echo "⚠️  NEZAM: pnpm not found. Run 'pnpm ai:sync' manually before pushing."
    echo "   Mirror drift detected. CI will fail if mirrors are out of sync."
  fi
fi
```

### 4B. Create setup script for the hook

Since `.git/hooks/` is not tracked by git, new clones need to install the hook.
Create a tracked script that users run after cloning.

**File:** `scripts/setup-hooks.sh`
**Action:** Create this file.

```bash
#!/bin/bash
# NEZAM — Install git hooks
# Run once after cloning: bash scripts/setup-hooks.sh

set -e

HOOKS_DIR=".git/hooks"
SCRIPTS_DIR="scripts/hooks"

if [ ! -d "$HOOKS_DIR" ]; then
  echo "❌ Not a git repository. Run 'git init' first."
  exit 1
fi

# Copy pre-commit hook
if [ -f "$SCRIPTS_DIR/pre-commit" ]; then
  cp "$SCRIPTS_DIR/pre-commit" "$HOOKS_DIR/pre-commit"
  chmod +x "$HOOKS_DIR/pre-commit"
  echo "✅ pre-commit hook installed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NEZAM git hooks installed."
echo "  .cursor/ changes will auto-sync mirrors on commit."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**File:** `scripts/hooks/pre-commit` (tracked version of the hook)
**Action:** Create with the same content as `.git/hooks/pre-commit` above.

### 4C. Update multi-tool-sync.mdc with hook setup instruction

**File:** `.cursor/rules/multi-tool-sync.mdc`

Add this section after `## Sync Rules (enforced)`:

```markdown
## Automated Sync (Git Hook)

A pre-commit hook auto-runs `pnpm ai:sync` whenever `.cursor/` files are staged.

**Install after cloning:**
```bash
bash scripts/setup-hooks.sh
```

**What it does:**
- Detects if any `.cursor/` file is staged for commit
- Runs `pnpm ai:sync --quiet` automatically
- Re-stages updated mirror files (CLAUDE.md, AGENTS.md, .claude/, etc.)
- If pnpm not found → warns but does not block commit

**Manual sync (fallback):**
```bash
pnpm ai:sync      # sync all mirrors
pnpm ai:check     # verify no drift
pnpm ai:status    # quick drift survey
```
```

---

## TASK 5 — Expand Multi-Tool Support to First-Class

### 5A. Expand multi-tool-sync.mdc mirror table

**File:** `.cursor/rules/multi-tool-sync.mdc`

Replace the existing `## Canonical Source of Truth` mirror table with:

```markdown
## Canonical Source of Truth

The `.cursor/` directory is the SINGLE canonical source. All other tool
directories are GENERATED MIRRORS. Never edit mirrors directly.

| Mirror / Root file   | Target tool                | Priority | Sync method    |
|----------------------|----------------------------|----------|----------------|
| `.claude/`           | Claude Code CLI            | Tier 1   | `pnpm ai:sync` |
| `.antigravity/`      | Antigravity IDE            | Tier 1   | `pnpm ai:sync` |
| `.codex/`            | Codex App + Codex CLI      | Tier 1   | `pnpm ai:sync` |
| `.cursor/`           | Cursor IDE (canonical)     | Tier 1   | source         |
| `.kilocode/`         | Kilo IDE                   | Tier 2   | `pnpm ai:sync` |
| `.opencode/`         | OpenCode                   | Tier 2   | `pnpm ai:sync` |
| `.qwen/`             | Qwen CLI / Qwen Studio     | Tier 2   | `pnpm ai:sync` |
| `.gemini/`           | Gemini CLI                 | Tier 2   | `pnpm ai:sync` |
| `.windsurf/`         | Windsurf IDE               | Tier 2   | `pnpm ai:sync` |
| `.roo/`              | Roo Code (VS Code ext.)    | Tier 2   | `pnpm ai:sync` |
| `CLAUDE.md`          | Claude Code (root marker)  | Tier 1   | `pnpm ai:sync` |
| `AGENTS.md`          | Codex CLI (root marker)    | Tier 1   | `pnpm ai:sync` |
| `GEMINI.md`          | Gemini CLI (root marker)   | Tier 2   | `pnpm ai:sync` |
| `WINDSURF.md`        | Windsurf (root marker)     | Tier 2   | `pnpm ai:sync` |

**Tier 1:** Actively maintained and tested. Breakage is a blocking bug.
**Tier 2:** Best-effort. Sync runs but tool-specific behavior may differ slightly.
```

### 5B. Expand Tool-Specific Entrypoints table

**File:** `.cursor/rules/multi-tool-sync.mdc`

Replace the existing `## Tool-Specific Entrypoints` table with:

```markdown
## Tool-Specific Entrypoints

| Tool              | Boot instruction                        | Start command          | Guide command       |
|-------------------|-----------------------------------------|------------------------|---------------------|
| **Cursor IDE**    | Open project folder in Cursor           | `/START all`           | `/GUIDE status`     |
| **Claude Code**   | `claude` in project root                | `/START all`           | `/GUIDE status`     |
| **Antigravity**   | Open project in Antigravity             | `/START all`           | `/GUIDE status`     |
| **Codex App**     | Open project in Codex app               | `/START all`           | `/GUIDE status`     |
| **Codex CLI**     | `codex` in project root                 | `codex "/START all"`   | `codex "/GUIDE"`    |
| **Kilo**          | Open project in Kilo                    | `/START all`           | `/GUIDE status`     |
| **OpenCode**      | `opencode` in project root              | `/START all`           | `/GUIDE status`     |
| **Windsurf**      | Open project in Windsurf                | `/START all`           | `/GUIDE status`     |
| **Roo Code**      | Open project in VS Code + Roo extension | `/START all`           | `/GUIDE status`     |
| **Gemini CLI**    | `gemini` in project root                | `/START all`           | `/GUIDE status`     |
| **Qwen**          | `qwen` in project root                  | `/START all`           | `/GUIDE status`     |
| **Any tool**      | Point tool at project root + CLAUDE.md  | `/START all`           | `/GUIDE status`     |

**Universal fallback:** Any AI tool that reads a root markdown file can load NEZAM via `CLAUDE.md`
or `AGENTS.md`. These files contain the full command index and required behavior block.
```

### 5C. Create tool-specific GETTING_STARTED files

Create one getting-started file per Tier 1 tool. These go in `.nezam/workspace/tools/`.

**File:** `.nezam/workspace/tools/CLAUDE_CODE.md`
**Action:** Create this file.

```markdown
# NEZAM with Claude Code

## Setup (one time)

```bash
# 1. Clone or copy NEZAM to your project
git clone <your-nezam-fork> my-project
cd my-project

# 2. Install git hooks
bash scripts/setup-hooks.sh

# 3. Start Claude Code in the project root
claude
```

## How NEZAM loads in Claude Code

Claude Code reads `CLAUDE.md` at the project root automatically.
This file is generated by `pnpm ai:sync` from `.cursor/` — it contains the
full command index, required behavior rules, and SDD pipeline contract.

## Starting a new project

In Claude Code chat, type:
```
/START all
```

This runs the full onboarding: solo/team selection → PRD creation → design selection → gate check.

## Key commands

| Command | What it does |
|---------|-------------|
| `/START all` | Full onboarding (first time) |
| `/guide status` | See where you are in the pipeline |
| `/guide next` | Get your single next action |
| `/plan [subcommand]` | Planning phase (after onboarding) |
| `/develop [subcommand]` | Build phases (after planning) |
| `/check gates` | Validate all hardlock prerequisites |
| `/check repair` | Fix corrupted state files |
| `/scan all` | Security + accessibility + performance audit |

## Switching from Cursor to Claude Code mid-project

```bash
# In Cursor (before switching):
/SAVE log    # saves session state

# In terminal:
pnpm ai:sync  # ensure mirrors are current

# In Claude Code:
claude
/guide status  # confirms state loaded correctly
```

## Notes

- All slash commands work identically in Claude Code and Cursor
- State files in `.cursor/state/` persist between sessions
- If commands seem wrong, run `pnpm ai:sync` and restart Claude Code
```

**File:** `.nezam/workspace/tools/ANTIGRAVITY.md`
**Action:** Create this file.

```markdown
# NEZAM with Antigravity

## Setup (one time)

Open your project folder in Antigravity. NEZAM loads via `.antigravity/` mirror directory.

```bash
# If mirror doesn't exist yet:
pnpm ai:sync
```

## Known difference: /guide response style

Antigravity has its own `/guide` rules defined in `docs/rules/guide-response-style.mdc`
and `guide-handoff-footer.mdc`. These are **not activated** globally in NEZAM because they
conflict with the unified Response Style System in `workspace-orchestration.mdc`.

**Resolution:** Use NEZAM's `/guide` as-is. If you need Antigravity-parity format,
maintain a separate `antigravity-guide.md` command file and activate it only when
working in Antigravity by setting `tool: antigravity` in your project config.

## Starting a project

```
/START all
```

## All other commands work identically to Cursor.
```

**File:** `.nezam/workspace/tools/CODEX.md`
**Action:** Create this file.

```markdown
# NEZAM with Codex (App + CLI)

## Codex App

Open your project folder in the Codex app. NEZAM loads via `.codex/` mirror.
All slash commands work identically to Cursor.

```
/START all
```

## Codex CLI

```bash
# Start in project root:
codex

# Run NEZAM commands:
codex "/START all"
codex "/guide status"
codex "/plan seo"
```

## Root marker

`AGENTS.md` at the project root is the Codex CLI entry point.
It is generated by `pnpm ai:sync` and contains the full command + agent index.

## Notes

- `AGENTS.md` format may not support all slash command types natively
- For full feature parity, use the Codex App (not CLI)
- State files work identically across all tools
```

**File:** `.nezam/workspace/tools/CURSOR.md`
**Action:** Create this file.

```markdown
# NEZAM with Cursor IDE (Canonical Tool)

Cursor is the canonical authoring environment for NEZAM.
All commands, agents, skills, and rules are authored in `.cursor/` and synced to other tools.

## Setup

Open your project folder in Cursor. No additional setup needed.

## Starting a project

```
/START all
```

## Editing NEZAM workspace governance

All edits to NEZAM itself must happen in `.cursor/` — never in mirrors.

```bash
# After any edit to .cursor/:
pnpm ai:sync    # sync to all mirrors
pnpm ai:check   # verify no drift
```

## Design profiles

`.nezam/design/` contains 150+ design profiles.
Apply one with: `/START design` or `pnpm run design:apply -- <brand>`
```

### 5D. Add Windsurf and Roo mirror directories

**Action:** Create these mirror directory entries in the sync system.

Add to the `scripts/sync-ai-folders.js` sync script (or document as manual until script updated):

```markdown
# Manual mirror setup for Windsurf and Roo Code

Until pnpm ai:sync script is updated, manually create mirrors:

For Windsurf:
mkdir -p .windsurf/commands .windsurf/agents .windsurf/skills .windsurf/rules
cp .cursor/commands/*.md .windsurf/commands/
cp .cursor/agents/*.md .windsurf/agents/
cp -r .cursor/skills/ .windsurf/skills/
cp .cursor/rules/*.mdc .windsurf/rules/

For Roo Code:
mkdir -p .roo/commands .roo/agents .roo/skills .roo/rules
cp .cursor/commands/*.md .roo/commands/
cp .cursor/agents/*.md .roo/agents/
cp -r .cursor/skills/ .roo/skills/
cp .cursor/rules/*.mdc .roo/rules/

Create root markers:
cp CLAUDE.md WINDSURF.md
cp CLAUDE.md ROO.md
```

---

## TASK 6 — Add Development Method Overlays

### Philosophy

SDD is the structure. Method overlays modify HOW phases are executed without
changing the gate sequence. User picks one overlay during `/start` (step 2.5,
after S/T but before PRD menu).

The overlay is stored in `onboarding.yaml` as `build_mode`.

### 6A. Add build_mode to onboarding.yaml state file

**File:** `.cursor/state/onboarding.yaml`

Add these fields AFTER the `tone:` field (before `prd_locked:`):

```yaml
# Build method overlay — controls how develop phases are executed
# Set during /start (between S/T question and PRD menu)
build_mode: ""          # "sdd" | "lean" | "tdd" | "api-first"
build_mode_set_at: ""
```

Also add to the schema file `.cursor/state/schemas/onboarding.schema.yaml`:

```yaml
  build_mode:
    type: string
    allowed: ["", "sdd", "lean", "tdd", "api-first"]
    default: ""
  build_mode_set_at:
    type: string
    default: ""
```

### 6B. Add build mode selection to /start command

**File:** `.cursor/commands/start.md`

In Step 2 (PRD Creation), add this question BETWEEN the S/T question and the PRD menu.
Show it only after user selects S or T:

```markdown
### Step 2.5: Build Method Selection

After user types S or T, show:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  How do you want to build?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [1] SDD — Specification-Driven (default)
      Plan fully first, then build phase by phase.
      Best for most products. Prevents AI drift.

  [2] Lean — MVP-First
      Compress 6 phases to 2: build core → ship.
      Best for founders who need speed over governance.
      You can upgrade to full SDD later.

  [3] TDD — Test-Driven
      SDD + write failing tests before each feature.
      Best for teams who want quality-first builds.
      Adds a test-first gate to each dev phase.

  [4] API-First
      Start from API spec or event schema, not PRD.
      Best for backend teams or API products.
      Reverses SDD: spec → design → plan.

Type 1, 2, 3, or 4 (press Enter for 1):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Save choice to `onboarding.yaml` → `build_mode`:
- 1 → `sdd`
- 2 → `lean`
- 3 → `tdd`
- 4 → `api-first`

Then proceed to PRD menu (Step 2 / PRD mode selection).
```

### 6C. Create build method overlays as skills

**File:** `.cursor/skills/system/build-modes/SKILL.md`
**Action:** Create this file.

```markdown
---
name: build-modes
version: 1.0.0
updated: 2026-05-12
changelog: []
---

# Build Mode Overlays Skill

## Purpose

Modify how NEZAM executes development phases based on the `build_mode` in `onboarding.yaml`.
All modes use the same gate structure. Overlays change what happens inside each phase.

## Mode: SDD (Default)

**Description:** Full Specification-Driven Development. Plan completely, then build phase by phase.

**Phase behavior:**
- All 6 planning phases complete before development starts
- 6 build phases execute sequentially with testing gates
- WCAG, Lighthouse, security gates enforced at every phase
- Design tokens required from phase 1

**PRD requirement:** Full PRD with all sections populated
**Who it's for:** Most projects, teams, anything with more than 2 months of development

---

## Mode: Lean MVP

**Description:** Compress the pipeline for speed. Build core → ship. Governance is lighter.

**Phase behavior:**
- Planning compressed to 2 phases only:
  - Phase A: PRD + rough IA + rough design direction (no wireframes required)
  - Phase B: Scaffold + tasks
- Build compressed to 2 phases:
  - Build 1: Core product (combines Foundation + Core Features)
  - Build 2: Polish + Ship (combines Polish + Harden + Ship)
- Gates still enforced but with lower thresholds:
  - `/check output` threshold: 50% (not 70%)
  - WCAG: AA on critical paths only (not all surfaces)
  - Tests: happy path only (not full coverage)

**PRD requirement:** Minimum PRD — Vision, Users, 3 requirements, 1 success metric
**Who it's for:** Solo founders, hackathons, 0→1 MVPs, validation experiments

**Upgrade path:** Lean → SDD is always available. Run `/nezam upgrade sdd` to
re-open skipped phases and complete them. No rebuild needed.

---

## Mode: TDD (Test-Driven)

**Description:** SDD + test-first discipline. Write failing tests before writing features.

**Adds to every SDD phase:**
1. Before each feature: write test specs (acceptance tests, unit test outlines)
2. Tests are committed before implementation begins
3. Phase gate: implementation only passes when tests it was written for are green

**Additional gates per phase:**
- `tests_written_before_code: true` in develop_phases.yaml (add this field)
- Test file exists before any implementation file for that feature
- `/check output` for TDD: must include test coverage ≥ 60% from phase 1

**PRD requirement:** Same as SDD + acceptance criteria on every P0/P1 requirement
**Who it's for:** Teams prioritizing quality, products where regression cost is high

---

## Mode: API-First

**Description:** Start from OpenAPI spec or event schema. Design and plan follow spec.

**Pipeline reorder:**
1. Define API spec first (`docs/plans/api/API_SPEC.yaml` or `API_SPEC.json`)
2. Generate data model from spec
3. Generate IA from spec endpoints
4. Design follows data structure
5. PRD is filled in from spec (reverse of SDD)

**PRD requirement:** Minimum Vision + Users section. Requirements derived from spec.
**Spec requirement:** OpenAPI 3.x or AsyncAPI 2.x format
**Who it's for:** Backend-first teams, API products, headless products, teams starting from existing specs

**Additional phase gates:**
- `api_spec_complete: true` — required before architecture phase
- All endpoints in spec must have at least one test in TDD gate (if combined with TDD)

## Mode Switching Mid-Project

Allowed upgrades:
- lean → sdd: run `/nezam upgrade sdd` — re-opens skipped phases
- sdd → tdd: run `/nezam upgrade tdd` — adds test-first gates to remaining phases
- api-first → sdd: always compatible (api-first is SDD with different phase 1)

Not allowed (without full replan):
- sdd → lean (would skip completed gates — use only at start)
- tdd → sdd (downgrade removes quality gates — use only at start)
```

### 6D. Update swarm-leader.md to respect build_mode

**File:** `.cursor/agents/swarm-leader.md`

In the `## Session Start Protocol` section, add after step 2:

```markdown
2b. Read `onboarding.yaml` → `build_mode`:
    - `""` or `"sdd"` → standard SDD pipeline
    - `"lean"` → compressed 2+2 phase pipeline (see build-modes skill)
    - `"tdd"` → SDD + test-first gates (see build-modes skill)
    - `"api-first"` → reversed planning pipeline (see build-modes skill)
    Load `build-modes` skill for any mode other than `"sdd"`.
```

In the `## Gate Enforcement (every command)` section, add:

```markdown
2b. Check `build_mode` from onboarding.yaml:
    - lean mode: phase gate thresholds are lower (50% not 70%, WCAG critical paths only)
    - tdd mode: add `tests_written_before_code` check to each phase gate
    - api-first mode: check `api_spec_complete` before architecture gate
    Apply the correct thresholds from the build-modes skill.
```

---

## TASK 7 — Add Output Scoring Engine

### Why

Agents produce outputs but there is no mechanism to measure quality over time.
Adding a lightweight scoring engine closes the feedback loop.

### 7A. Upgrade health-score SKILL.md

**File:** `.cursor/skills/system/health-score/SKILL.md`

Replace the `## Inputs` section with:

```markdown
## Inputs

**Required:**
- Current repository file tree (check required artifact presence)
- `.cursor/state/onboarding.yaml` — gate 0 status
- `.cursor/state/plan_progress.yaml` — gate 1 status
- `.cursor/state/develop_phases.yaml` — current build phase status

**Optional (enhance score if available):**
- `docs/reports/security/SECURITY_AUDIT.md`
- `docs/reports/perf/LIGHTHOUSE_REPORT.md`
- `docs/reports/tests/COVERAGE_REPORT.md`
- `docs/reports/a11y/A11Y_AUDIT.md`
- `DESIGN.md` at root — detect if design contract exists and is non-template
- `docs/prd/PRD.md` — detect if PRD is non-template

## Score Dimensions (updated)

Six dimensions, each 0–100:

1. **Spec completeness** — PRD filled + planning phases done
   - PRD non-template: +40 pts
   - Each planning phase flag true: +10 pts each (60 max)

2. **Design contract** — DESIGN.md quality
   - DESIGN.md exists: +30 pts
   - DESIGN.md has token definitions (look for CSS custom properties or token tables): +40 pts
   - DESIGN.md has component list: +30 pts

3. **Security posture** — based on SECURITY_AUDIT.md or phase_5 status
   - phase_5 started: +20 pts
   - SECURITY_AUDIT.md exists: +40 pts
   - SECURITY_AUDIT.md has no critical findings: +40 pts
   - If no data: 0 (not penalized before hardening phase)

4. **Performance budget** — based on Lighthouse report or phase_4 status
   - phase_4 started: +20 pts
   - LIGHTHOUSE_REPORT.md exists: +40 pts
   - LCP <2.5s + CLS <0.1 + INP <200ms: +40 pts

5. **Test coverage** — based on COVERAGE_REPORT.md or phase testing_passed flags
   - Any phase with testing_passed: true: +15 pts each (max 60)
   - COVERAGE_REPORT.md shows ≥80%: +40 pts

6. **Pipeline progress** — where in the overall SDD pipeline
   - Onboarding complete: +20 pts
   - Planning complete: +30 pts
   - Each build phase complete: +10 pts each (max 50)
```

### 7B. Add /check score subcommand to check.md

**File:** `.cursor/commands/check.md`

Add this subcommand:

```markdown
## /CHECK score

Runs the health-score skill and outputs a 0–100 project health score.

Steps:
1. Run `nezam-health-score` skill
2. Show scorecard table with all 6 dimensions
3. Show overall score with status icon
4. Show the single most impactful next action
5. Write/update `HEALTH.md` at repo root

Output format: exactly as defined in health-score SKILL.md.

Use after completing each planning phase or development phase to track progress.
```

---

## TASK 8 — Sync All Changes

After implementing all 7 tasks above:

```bash
# Sync all .cursor/ changes to mirrors
pnpm ai:sync

# Verify no drift
pnpm ai:check

# Install git hooks (if not already done)
bash scripts/setup-hooks.sh
```

If pnpm scripts don't exist yet, manually copy the updated rule files:

```bash
cp .cursor/rules/workspace-orchestration.mdc .claude/rules/
cp .cursor/rules/multi-tool-sync.mdc .claude/rules/
cp .cursor/commands/check.md .claude/commands/
cp .cursor/commands/start.md .claude/commands/
cp .cursor/agents/swarm-leader.md .claude/agents/
```

---

## Implementation Order

Execute in this exact sequence. Verify each step before starting the next.

| Step | Task | File(s) | Verify |
|------|------|---------|--------|
| 1 | Fix PRD path in workspace-orchestration.mdc | `.cursor/rules/workspace-orchestration.mdc` | No `docs/core/required` outside comments |
| 2 | Fix PRD path in sdd-gate-validator | `.cursor/skills/system/sdd-gate-validator/SKILL.md` | Gate 1 shows `docs/plans/design/WIREFRAMES.md` |
| 3 | Fix path in health-score skill | `.cursor/skills/system/health-score/SKILL.md` | No `docs/core/required` in file |
| 4 | Add version frontmatter to 12 agents | `.cursor/agents/*.md` | `version: 1.0.0` in frontmatter |
| 5 | Update AGENT_REGISTRY.yaml | `.cursor/state/AGENT_REGISTRY.yaml` | `nezam_version: "3.0.0"` present |
| 6 | Create .nezam/workspace/VERSIONING.md | `.nezam/workspace/VERSIONING.md` | File exists with semver policy |
| 7 | Create .nezam/workspace/CHANGELOG.md | `.nezam/workspace/CHANGELOG.md` | File exists with v3.0.0 entry |
| 8 | Create 3 schema files | `.cursor/state/schemas/*.schema.yaml` | 3 files exist |
| 9 | Update sdd-gate-validator with pre-gate validation | `.cursor/skills/system/sdd-gate-validator/SKILL.md` | Has `## Pre-Gate: State File Validation` section |
| 10 | Add /check repair to check.md | `.cursor/commands/check.md` | `/CHECK repair` subcommand exists |
| 11 | Create pre-commit hook + setup script | `scripts/setup-hooks.sh`, `scripts/hooks/pre-commit` | Files exist + executable |
| 12 | Update multi-tool-sync.mdc | `.cursor/rules/multi-tool-sync.mdc` | New mirror table has 14 rows, Windsurf + Roo added |
| 13 | Create 4 tool GETTING_STARTED files | `.nezam/workspace/tools/*.md` | 4 files exist |
| 14 | Add build_mode to onboarding.yaml | `.cursor/state/onboarding.yaml` | `build_mode: ""` field present |
| 15 | Add build_mode schema | `.cursor/state/schemas/onboarding.schema.yaml` | Schema has build_mode entry |
| 16 | Add Step 2.5 to start.md | `.cursor/commands/start.md` | Has build mode selection before PRD menu |
| 17 | Create build-modes SKILL.md | `.cursor/skills/system/build-modes/SKILL.md` | File exists with 4 mode definitions |
| 18 | Update swarm-leader.md for build_mode | `.cursor/agents/swarm-leader.md` | Has step 2b in Session Start Protocol |
| 19 | Upgrade health-score SKILL.md | `.cursor/skills/system/health-score/SKILL.md` | Has updated 6 score dimensions |
| 20 | Add /check score to check.md | `.cursor/commands/check.md` | `/CHECK score` subcommand exists |
| 21 | Run pnpm ai:sync | — | No drift reported by pnpm ai:check |

---

## Validation Checklist

After all 21 steps, verify these scenarios work correctly:

**PRD path fix:**
- [ ] `/check gates` with no PRD shows: "Missing: docs/prd/PRD.md" (not docs/core/required)
- [ ] `workspace-orchestration.mdc` contains zero references to `docs/prd/PRD.md` outside the preserved legacy note comment
- [ ] sdd-gate-validator Gate 1 lists `docs/plans/design/WIREFRAMES.md` (not docs/core/required)

**Versioning:**
- [ ] `AGENT_REGISTRY.yaml` shows `nezam_version: "3.0.0"`
- [ ] `swarm-leader.md` frontmatter has `version: 1.0.0`
- [ ] `.nezam/workspace/CHANGELOG.md` exists with v3.0.0 entry
- [ ] `.nezam/workspace/VERSIONING.md` exists with SemVer policy

**State validation:**
- [ ] 3 schema files exist in `.cursor/state/schemas/`
- [ ] `/check repair` command exists in check.md
- [ ] sdd-gate-validator has `## Pre-Gate: State File Validation` section

**Git hook:**
- [ ] `scripts/setup-hooks.sh` exists and is executable
- [ ] `scripts/hooks/pre-commit` exists
- [ ] After running setup-hooks.sh, `.git/hooks/pre-commit` exists and is executable
- [ ] Staging a `.cursor/` file then attempting commit triggers the hook

**Multi-tool:**
- [ ] `multi-tool-sync.mdc` mirror table has 14 rows including Windsurf, Roo, Qwen, Gemini
- [ ] 4 tool files exist in `.nezam/workspace/tools/`
- [ ] Tool-Specific Entrypoints table has 12 rows

**Build modes:**
- [ ] `/start` Step 2.5 shows 4 build mode options before PRD menu
- [ ] Choosing option 2 sets `build_mode: "lean"` in onboarding.yaml
- [ ] `.cursor/skills/system/build-modes/SKILL.md` has all 4 mode definitions
- [ ] swarm-leader.md Session Start Protocol has step 2b

**Scoring:**
- [ ] `/check score` subcommand exists in check.md
- [ ] health-score SKILL.md has 6 updated score dimensions with point breakdowns

---

## What NOT to Change

- `.nezam/design/` — all design profiles and catalog.json
- `.cursor/state/develop_phases.yaml` — do not reset if phases already in progress
- `.cursor/state/onboarding.yaml` — do not reset `prd_locked`, `design_locked`, or any `_at` fields
- `docs/prd/PRD.md` — user's active project PRD
- `docs/plans/` — user's active planning artifacts (if any)
- `DESIGN.md` at repo root — user's chosen design
- Any files inside `.nezam/workspace/` EXCEPT creating new files (VERSIONING.md, CHANGELOG.md, tools/)
