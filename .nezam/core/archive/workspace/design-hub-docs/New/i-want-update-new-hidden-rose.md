# Plan: NEZAM Workspace Restructure

## Context

The user wants 4 structural improvements to the NEZAM workspace:

1. **All templates → `.cursor/templates/`** — consolidate governance in `.cursor/`
2. **Lean project-facing docs** — `docs/prd/` keeps a minimal PRD.md placeholder; `docs/plans/` becomes empty (no README); `docs/reports/` gets category subfolders, no README
3. **Configurable paths file** — users can redirect where their PRD file and plans folder live
4. **`/nezam` command** — the only authorized way to adjust NEZAM internals (agents, skills, rules, templates, scripts); all other commands stay project-scoped

---

## Part 1 — Template Migration

### Source → Destination

All templates currently in `docs/nezam/templates/` move to `.cursor/templates/` preserving sub-folder structure:

| Old path | New path |
|---|---|
| `docs/nezam/templates/ai-client/` | `.cursor/templates/ai-client/` |
| `docs/nezam/templates/plan/` | `.cursor/templates/plan/` |
| `docs/nezam/templates/sdd/` | `.cursor/templates/sdd/` |
| `docs/nezam/templates/specs/` | `.cursor/templates/specs/` |
| `docs/nezam/templates/ui-ux/` | `.cursor/templates/ui-ux/` |
| `docs/nezam/plans/templates/` | `.cursor/templates/swarm/` |
| `docs/nezam/workspace/templates/research-design/` | `.cursor/templates/research-design/` |
| `docs/nezam/workspace/templates/specs/` | merge into `.cursor/templates/specs/` |

**After copy:** delete the old `docs/nezam/templates/` tree and `docs/nezam/workspace/templates/` tree.

### New file: `.cursor/templates/README.md`
Explain:
- This is the canonical template library for all NEZAM-generated artifacts
- Edit any template file to permanently customize its output
- Use `/nezam templates` to browse and edit interactively
- Template variables use `{{VARIABLE_NAME}}` syntax
- After editing: run `pnpm ai:sync` so all AI clients stay aligned
- To reset a template to NEZAM defaults: see instructions in the template file header or run `/nezam templates reset <name>`

---

## Part 2 — Project-Facing Docs Cleanup

### `docs/prd/PRD.md` — keep, simplify
Replace the current verbose template with a minimal ~15-line placeholder:
```md
# Product Requirements Document

> Status: Draft — run `/start prd` for guided creation, or fill in below.

## Vision
<!-- One sentence: what you're building and for whom -->

## Problem
<!-- What problem does this solve? -->

## Users
<!-- Who uses this? Their job-to-be-done? -->

## Key Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| R-01 | | P0 |

## Success Metrics
| Metric | Target |
|--------|--------|
| | |

> Once complete → run `/plan` to generate your execution roadmap.
```

### `docs/plans/` — empty folder, no README
- Delete `docs/plans/README.md`
- Add `docs/plans/.gitkeep` so Git tracks the empty folder
- The `/start docs` command already creates this folder; `.gitkeep` just ensures it's committed

### `docs/reports/` — category folders, no README
- Delete `docs/reports/README.md`
- Create these subfolders with `.gitkeep`:
  ```
  docs/reports/
  ├── progress/.gitkeep
  ├── tests/.gitkeep
  ├── audits/.gitkeep
  ├── a11y/.gitkeep
  ├── security/.gitkeep
  ├── perf/.gitkeep
  └── lighthouse/.gitkeep
  ```
- The existing `docs-layout-policy.sh` already validates these exact category names — no script change needed
- Remove the `README.md` exception from `docs-layout-policy.sh` (it currently skips README; remove that skip so the check is fully strict about loose files)

---

## Part 3 — Configurable Paths File

### New file: `.cursor/workspace.paths.yaml`

```yaml
# NEZAM Workspace Path Configuration
# ─────────────────────────────────────────────────────────────────────────────
# Edit paths here to relocate key project files/folders.
# After any change: run  pnpm ai:sync
#
# Used by: /start, /plan, /check gates, check-onboarding-readiness.sh
# ─────────────────────────────────────────────────────────────────────────────

project:
  # Your project's PRD file. Change this if you keep your PRD elsewhere.
  prd: "docs/prd/PRD.md"

  # Your project's plans root folder. /plan will scaffold sub-phase folders here.
  plans_root: "docs/plans"

  # Your project's reports root folder. Execution outputs go here by category.
  reports_root: "docs/reports"

# ─────────────────────────────────────────────────────────────────────────────
# NEZAM workspace internals — only change if you are restructuring the workspace
# itself (use /nezam to do this safely).
# ─────────────────────────────────────────────────────────────────────────────
workspace:
  nezam_root: "docs/nezam"
  templates_root: ".cursor/templates"
  hardlock_paths: "docs/nezam/core/hardlock-paths.json"
```

**Commands that must read this file** (grep for hardcoded paths + update):
- `.cursor/commands/start.md` — `docs/prd/PRD.md`, `docs/plans/`, `docs/reports/`
- `.cursor/commands/plan.md` — `docs/core/required/PRD.md` (old path), `docs/plans/`
- `.cursor/commands/check.md` — gate paths for PRD, plans

**Rule added to commands**: Before resolving any project path, read `.cursor/workspace.paths.yaml` → `project.*`. Fall back to the default values above if the file is missing.

### Fix `docs/nezam/core/hardlock-paths.json`

Currently points at paths that don't exist. Update to match reality:

```json
{
  "$schemaVersion": "1.0.0",
  "notes": [
    "Single source of truth for hardlock-critical file locations.",
    "For user-adjustable project paths see .cursor/workspace.paths.yaml"
  ],
  "intake": {
    "prd": "docs/prd/PRD.md",
    "projectPrompt": "docs/nezam/core/required/PROJECT_PROMPT.md"
  },
  "planning": {
    "changelog": "CHANGELOG.md",
    "versioning": "docs/nezam/core/VERSIONING.md",
    "gateManifest": "docs/nezam/plans/gates/GITHUB_GATE_MATRIX.json"
  },
  "design": {
    "designSpec": "DESIGN.md"
  },
  "subphasePrompts": {
    "plansRoot": "docs/nezam/plans",
    "taskFileGlob": "**/*/*/TASKS.md",
    "requiredFiles": ["prompt.json", "PROMPT.md"]
  }
}
```

Also update the identical copy at `docs/nezam/specs/hardlock-paths.json`.

### Fix `scripts/checks/check-onboarding-readiness.sh`

Currently hardcodes `hardlock_paths_file="docs/core/hardlock-paths.json"` which doesn't exist. Change to:
```bash
hardlock_paths_file="docs/nezam/core/hardlock-paths.json"
```

---

## Part 4 — New `/nezam` Command

### New file: `.cursor/commands/nezam.md`

**Philosophy**: This is the only command that touches NEZAM workspace internals. All other commands (`/start`, `/plan`, `/develop`, `/check`, `/scan`, `/guide`, `/git`, `/deploy`, `/settings`) operate on the **user's project only**.

**Subcommand surface**:

```
/nezam                    → Status dashboard: NEZAM version, sync state, active paths
/nezam templates          → Browse all templates in .cursor/templates/
/nezam templates <cat>    → List templates in a category (ai-client, plan, sdd, specs, ui-ux, swarm)
/nezam templates edit <n> → Open and edit a specific template with guided prompts
/nezam templates reset <n>→ Restore a template to the NEZAM default (from docs/nezam/ reference backup)
/nezam agents             → List all agents in .cursor/agents/ with descriptions
/nezam agents edit <name> → Edit an agent's system prompt / role definition
/nezam agents add <name>  → Create a new custom agent from template
/nezam agents remove <n>  → Remove a custom agent (with confirmation + ai:sync)
/nezam skills             → List all skills by category
/nezam skills edit <name> → Edit a skill's SKILL.md
/nezam rules              → List all rules in .cursor/rules/
/nezam rules edit <name>  → Edit a .mdc rule file
/nezam scripts            → List scripts/ with descriptions
/nezam paths              → Show current workspace.paths.yaml
/nezam paths set <k> <v>  → Change a path value (e.g. /nezam paths set project.prd src/PRD.md)
/nezam sync               → Run pnpm ai:sync + pnpm ai:check, show result
/nezam check              → Validate workspace integrity (drift, skill frontmatter, SDD swarm)
/nezam upgrade            → Instructions for pulling a newer NEZAM workspace version
/nezam customize          → Interactive wizard: pick what to adjust (templates / agents / rules / scripts)
```

**Hard rule in command doc**:
> ⚠️ Never edit `.cursor/agents/`, `.cursor/skills/`, `.cursor/rules/`, `.cursor/templates/`, `docs/nezam/`, or `scripts/` outside of `/nezam`. Changes made without `/nezam` won't get proper validation or sync.

**Always shows after any change**:
```
✅ Change applied → .cursor/<path>
→ Run pnpm ai:sync to propagate to all AI clients
→ Run /nezam check to validate workspace integrity
```

---

## Part 5 — Update `/start` Command

Changes to `.cursor/commands/start.md`:
1. Add: "Read project paths from `.cursor/workspace.paths.yaml` before resolving any doc path."
2. Change scaffold behavior for `docs/reports/`: create category folders with `.gitkeep` instead of a `README.md`
3. Change scaffold behavior for `docs/plans/`: create empty folder (or `.gitkeep`), no `README.md`
4. Update gate check table to reflect new paths structure
5. Update status display after scaffolding:
   ```
   ✅ docs/prd/PRD.md          → ready (fill in your requirements)
   ✅ docs/plans/              → ready (waiting for PRD)
   ✅ docs/reports/progress/   → ready
   ✅ docs/reports/tests/      → ready
   ✅ docs/reports/audits/     → ready
   ✅ docs/reports/a11y/       → ready
   ✅ docs/reports/security/   → ready
   ✅ docs/reports/perf/       → ready
   ✅ docs/reports/lighthouse/ → ready
   ```

---

## Part 6 — Update CLAUDE.md Source

The CLAUDE.md is generated by `pnpm ai:sync`. Its source comes from `.cursor/`. After the changes above, run `pnpm ai:sync` and the generated CLAUDE.md will automatically:
- Add `nezam.md` to the synced command index
- Reference `.cursor/templates/` instead of `docs/nezam/templates/`

Update the "Canonical source" section in the CLAUDE.md template to add:
```
- `.cursor/templates/`  ← all artifact templates (edit here to customize)
- `.cursor/workspace.paths.yaml`  ← project path overrides
```

---

## Execution Order

Execute in this exact order to avoid broken states:

1. **Create `.cursor/workspace.paths.yaml`** (step 3 above)
2. **Create `.cursor/templates/` tree** — copy all template files from `docs/nezam/templates/` etc.
3. **Create `.cursor/templates/README.md`**
4. **Delete old template locations** — `docs/nezam/templates/`, `docs/nezam/workspace/templates/` (after verifying copy is complete)
5. **Update `docs/prd/PRD.md`** — replace with minimal placeholder
6. **Delete `docs/plans/README.md`** → create `docs/plans/.gitkeep`
7. **Delete `docs/reports/README.md`** → create 7 category `.gitkeep` files
8. **Fix `docs/nezam/core/hardlock-paths.json`** and `docs/nezam/specs/hardlock-paths.json`
9. **Fix `scripts/checks/check-onboarding-readiness.sh`** — update hardlock_paths_file path
10. **Update `scripts/checks/docs-layout-policy.sh`** — remove README.md exception (strict mode)
11. **Create `.cursor/commands/nezam.md`**
12. **Update `.cursor/commands/start.md`** — path config reading + new reports scaffold
13. **Update `.cursor/commands/plan.md`** — path config reading
14. **Update `.cursor/commands/check.md`** — path config reading
15. **Run `pnpm ai:sync`** — regenerates CLAUDE.md, syncs nezam.md to `.antigravity/commands/`, etc.
16. **Run `pnpm ai:check`** — validate no drift
17. **Run `pnpm check:onboarding`** — verify readiness check still passes

---

## Files Created / Modified Summary

| Action | File |
|--------|------|
| CREATE | `.cursor/templates/` (all 50+ template files copied) |
| CREATE | `.cursor/templates/README.md` |
| CREATE | `.cursor/workspace.paths.yaml` |
| CREATE | `.cursor/commands/nezam.md` |
| CREATE | `docs/plans/.gitkeep` |
| CREATE | `docs/reports/progress/.gitkeep` |
| CREATE | `docs/reports/tests/.gitkeep` |
| CREATE | `docs/reports/audits/.gitkeep` |
| CREATE | `docs/reports/a11y/.gitkeep` |
| CREATE | `docs/reports/security/.gitkeep` |
| CREATE | `docs/reports/perf/.gitkeep` |
| CREATE | `docs/reports/lighthouse/.gitkeep` |
| MODIFY | `docs/prd/PRD.md` — minimal placeholder |
| MODIFY | `docs/nezam/core/hardlock-paths.json` — fix all paths |
| MODIFY | `docs/nezam/specs/hardlock-paths.json` — fix all paths |
| MODIFY | `scripts/checks/check-onboarding-readiness.sh` — fix hardlock file path |
| MODIFY | `scripts/checks/docs-layout-policy.sh` — remove README.md exception |
| MODIFY | `.cursor/commands/start.md` — paths config + reports scaffold |
| MODIFY | `.cursor/commands/plan.md` — paths config reference |
| MODIFY | `.cursor/commands/check.md` — paths config reference |
| DELETE | `docs/plans/README.md` |
| DELETE | `docs/reports/README.md` |
| DELETE | `docs/nezam/templates/` (entire tree — 50+ files) |
| DELETE | `docs/nezam/workspace/templates/` (entire tree) |
| DELETE | `docs/nezam/plans/templates/` (entire tree — moved to `.cursor/templates/swarm/`) |
| GENERATED | `CLAUDE.md` — via pnpm ai:sync |
| GENERATED | `.antigravity/commands/nezam.md` — via pnpm ai:sync |

---

## Verification

```bash
# 1. Template files exist in new location
ls .cursor/templates/

# 2. Old template locations are gone
ls docs/nezam/templates/ 2>&1   # should: "No such file or directory"

# 3. Project docs structure is correct
ls docs/prd/      # PRD.md only
ls docs/plans/    # .gitkeep only
ls docs/reports/  # 7 category folders, no README.md

# 4. Paths config exists
cat .cursor/workspace.paths.yaml

# 5. Hardlock paths point at real files
cat docs/nezam/core/hardlock-paths.json

# 6. Scripts pass
pnpm ai:sync
pnpm ai:check
pnpm check:onboarding
bash scripts/checks/docs-layout-policy.sh

# 7. /nezam command is synced to all clients
grep "nezam" CLAUDE.md
ls .antigravity/commands/nezam.md
```
