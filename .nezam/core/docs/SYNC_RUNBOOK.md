# NEZAM Sync & Drift Recovery Runbook

**Owner:** docs-hygiene · **ADR:** ADR-0002 · **Last updated:** 2026-06-05

This runbook covers keeping all AI tool mirrors in sync with canonical `.cursor/` configuration, detecting drift, recovering from failures, and rolling back bad sync states.

---

## 1. Mirror Architecture

The `.cursor/` folder is the **canonical source of truth** for all NEZAM workspace contracts (agents, skills, commands, rules). `pnpm ai:sync` generates read-only mirror copies for every supported AI tool:

| Tool ID | Mirror location | Files mirrored |
|---|---|---|
| `claude` | `.claude/` | commands, agents, skills, rules |
| `gemini` | `.gemini/` | commands, agents, skills |
| `copilot` | (root) | `AGENTS.md` |
| `codex` | (root) | `AGENTS.md` |
| `opencode` | (root) | `CLAUDE.md`, `AGENTS.md` |
| `antigravity` | `.antigravity/` | commands, skills |
| `qwen` | (root) | `AGENTS.md` |
| `kilo` | (root) | `AGENTS.md` |

Never edit mirror files directly — changes are overwritten on next `pnpm ai:sync`.

---

## 2. When to Sync

Run `pnpm ai:sync` whenever any of these paths change:

| Changed path | Reason |
|---|---|
| `.cursor/agents/` | Agent definitions propagate to all tool mirrors |
| `.cursor/skills/` | Skill SKILL.md files mirror to tool skill directories |
| `.cursor/commands/` | Command prompt files mirror to tool command directories |
| `.cursor/rules/` | Rules propagate to CLAUDE.md and other root contracts |
| `.cursor/state/` | State YAML consumed by `ai:check` on next run |
| `package.json` | Sync script version/config may have changed |

The Husky pre-commit hook (`.husky/pre-commit`) runs `pnpm ai:sync` automatically on staged `.cursor/` changes. On CI, `sync-drift-check.yml` and `sync-and-drift-check.yml` both enforce this as a blocking gate.

---

## 3. Daily Commands Reference

```bash
# Regenerate all mirrors from .cursor/ (standard sync)
pnpm ai:sync

# Check sync status without writing — exits 1 if any tool is drifted
pnpm ai:status

# Sync only one tool mirror (faster for targeted fixes)
pnpm ai:sync --target=claude
pnpm ai:sync --target=gemini

# Run full check suite: drift + SDD integrity + skill frontmatter + design skills
pnpm ai:check

# Verify all governance YAML files parse cleanly
pnpm verify:yaml

# Run all checks together (used by CI)
pnpm ai:check && pnpm verify:yaml
```

---

## 4. Diagnosing Drift

### Step 1 — Identify what drifted

```bash
pnpm ai:status
# Output: per-tool ✓ / ⚠ status with file counts
# Exit 1 if any tool is drifted
```

### Step 2 — Run full check

```bash
pnpm ai:check
# Reports:
# 1. Mirror file drift (files out of sync with .cursor/)
# 2. SDD swarm integrity (no circular deps, no missing agents)
# 3. Skill frontmatter validity (version/updated/tier fields)
# 4. Design skills parity (.nezam/core/gates/design-skills.yaml)
```

### Step 3 — Verify YAML integrity

```bash
pnpm verify:yaml
# Scans: .cursor/state/ (strict), .github/workflows/ (warn-only), .nezam/core/ (strict)
# Exit 1 on any strict parse error
```

---

## 5. Recovery — Common Failures

### "Mirror drift detected" in CI (`sync-and-drift-check.yml` or `sync-drift-check.yml`)

```
❌ Mirror drift detected — X% of managed files out of sync.
   Run `pnpm ai:sync` locally and commit the diff.
```

**Resolution:**
1. Pull the branch
2. `pnpm ai:sync`
3. `git add .claude .gemini AGENTS.md CLAUDE.md GEMINI.md`
4. `git commit -m "chore: sync AI mirrors after .cursor/ changes"`
5. Push — CI will re-run and pass

### "YAML parse error" in `.cursor/state/`

**Resolution:**
1. `pnpm verify:yaml` — identifies the specific file and line
2. Open the file and fix the YAML syntax error
3. Re-run `pnpm verify:yaml` until exit 0
4. If the file is a critical state file and the error is not obvious, restore from git (see Section 6)

### "Skill frontmatter invalid"

```
❌ .cursor/skills/design/nezam-some-skill/SKILL.md — missing field: tier
```

**Resolution:**
1. Open the flagged SKILL.md
2. Ensure the frontmatter has all three required fields:
   ```yaml
   ---
   version: "1.0.0"
   updated: "2026-06-05"
   tier: 2
   ---
   ```
3. `tier` must be exactly `1`, `2`, or `3` — no strings, no decimals
4. Re-run `pnpm ai:check`

### "Design skill not vendored"

**Resolution:**
1. Check `.nezam/core/gates/design-skills.yaml` to find the expected skill path
2. Confirm the skill exists at the listed path
3. If missing, either restore from git or re-vendor:
   ```bash
   pnpm skills:vendor-design
   ```
4. `pnpm ai:sync` → `pnpm ai:check`

### "Unresolved skill refs" in `skills-registry.json`

These appear when agent files reference a skill ID that has no corresponding `SKILL.md`:

1. Check `.cursor/state/skills-registry.json` → `unresolved_skill_refs` array
2. For each unresolved ID, check `.cursor/skills/archive/DEPRECATED.md` to find the active replacement
3. Update the agent file(s) that reference the stale ID
4. `pnpm ai:sync && pnpm ai:check`

---

## 6. Rollback Procedures

### Rollback — Single state file (local, uncommitted corruption)

```bash
# Restore a single state file to last committed version
git restore .cursor/state/agent-status.yaml
git restore .cursor/state/plan_progress.yaml
git restore .cursor/state/develop_phases.yaml
```

### Rollback — All state files (full state reset)

```bash
# Restore all .cursor/state/ files to last committed version
git restore .cursor/state/
```

### Rollback — Mirror files only (re-sync from canonical)

```bash
# Discard all mirror changes and re-generate from .cursor/
git restore .claude/ .gemini/ AGENTS.md CLAUDE.md GEMINI.md 2>/dev/null; true
pnpm ai:sync
```

### Rollback — Full workspace to a known-good commit

```bash
# Find the last green commit (check CI for last passing run)
git log --oneline --all | head -20

# Create a recovery branch from the last known-good commit
git checkout -b fix/workspace-recovery <commit-sha>

# Verify the recovery branch is clean
pnpm ai:check && pnpm verify:yaml
```

### Rollback — After a bad `pnpm ai:sync --write` in CI

If a CI run committed bad mirror files to the branch:
1. `git revert HEAD --no-edit` — creates a revert commit undoing the sync
2. Fix the root issue in `.cursor/` (bad agent/skill/rule)
3. `pnpm ai:sync` locally
4. `git add .claude .gemini AGENTS.md CLAUDE.md GEMINI.md && git commit -m "chore: re-sync after revert"`

---

## 7. Responding to the Drift > 1% Slack Alert

When `sync-drift-check.yml` fires the "🚨 NEZAM Sync Drift Alert — drift exceeded 1% threshold" Slack message:

1. Open the linked Actions run URL in the alert
2. Expand the **Compute sync drift** step — it shows the diff stat (which files drifted)
3. Pull the `Master`/`main` branch locally
4. `pnpm ai:sync` — this regenerates all mirrors from `.cursor/`
5. Inspect the diff: `git diff --stat -- ':!pnpm-lock.yaml'`
6. If the diff looks expected (someone merged a `.cursor/` change without syncing):
   - `git add .claude .gemini AGENTS.md CLAUDE.md GEMINI.md && git commit -m "chore: sync AI mirrors after drift detected by weekly check"`
   - Push to `Master`
7. If the diff looks unexpected (unknown source of drift):
   - Do NOT push — escalate to **#engineering-nezam**
   - Attach the Actions run output and `git diff` output

The soft alert ("⚠️ Weekly check failing") indicates YAML or `ai:check` failures, not file drift. Follow Section 5 diagnosis steps.

---

## 8. Certified Agents Audit

`agent-status.yaml` maintains `certified_agents` — the list of agent IDs confirmed present and schema-valid in `.cursor/agents/`. This list is updated by the `swarm-leader` after any agent modification cycle.

To verify the list is accurate:

```bash
# List all actual agent files
ls .cursor/agents/*.md | xargs -I{} basename {} .md | sort

# Compare against certified_agents in agent-status.yaml
grep -A 20 "certified_agents" .cursor/state/agent-status.yaml
```

If the lists diverge, update `agent-status.yaml:certified_agents` to match the actual agent files and run `pnpm ai:sync`.

---

## 9. Archived Skills Management

Skills are archived (not deleted) to preserve history. The active archive registry is:

```
.cursor/skills/archive/DEPRECATED.md
```

This file lists every archived skill with its replacement. Before removing any `@skill-id` reference from an agent, check `DEPRECATED.md` to confirm the correct active replacement.

To archive a skill:
1. Move the skill directory to `.cursor/skills/archive/<category>/<skill-id>/`
2. Add an entry to `DEPRECATED.md` with: ID, category, reason, active replacement, archived-at
3. Update all agent files referencing the old skill ID → new replacement
4. `pnpm ai:check` — confirm `unresolved_skill_refs` is empty

---

## 10. Escalation

If the above steps do not resolve the issue:

1. Open a thread in **#engineering-nezam** with:
   - Output of `pnpm ai:check`
   - Output of `pnpm verify:yaml`
   - `git diff --stat`
2. Tag `@devops-lead` for pipeline overrides
3. For schema corruption that `git restore` cannot fix: tag `@swarm-leader` for manual state repair
