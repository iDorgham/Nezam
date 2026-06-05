# Contributing to NEZAM

Welcome to the NEZAM workspace kit. Follow these guidelines to set up your environment, keep AI tool mirrors in sync, and ensure contributions pass all gates before merging.

---

## 1. Initial Setup

```bash
# Install all dependencies
pnpm install

# Install Husky pre-commit hook (one-time per machine)
npx husky install

# Install NEZAM context and auto-memory hooks
pnpm hooks:install
```

After `npx husky install`, the pre-commit hook at `.husky/pre-commit` will activate automatically on every `git commit`.

Verify the hook is wired:
```bash
cat .git/hooks/pre-commit
# Should show the Husky runner, not the raw script
```

---

## 2. Pre-commit Hook

The Husky pre-commit hook at `.husky/pre-commit` enforces mirror consistency on every commit.

### What it does

Every `git commit` triggers this sequence:

1. **Sync** — runs `pnpm ai:sync` to regenerate all AI tool mirrors from canonical `.cursor/`
2. **Stage mirrors** — automatically stages any changed mirror files so they are included in the commit:
   `.claude/`, `.gemini/`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and other tool root files
3. **Validate** — runs `pnpm ai:check` (drift + SDD integrity + skill frontmatter + design skills)
4. **Block or pass** — if `ai:check` exits non-zero, the commit is blocked with an error message

### What triggers the sync

The hook runs on every commit regardless of which files are staged. This is intentional — it ensures mirrors can never fall behind even on unrelated commits.

### When the hook blocks a commit

```
❌ COMMIT BLOCKED: AI check suite failed.
   Please fix any remaining validation issues before committing.
```

**Debug steps:**
```bash
# Run the check suite manually to see which check failed
pnpm ai:check

# Re-run sync if mirrors are the issue
pnpm ai:sync

# Verify YAML state files are valid
pnpm verify:yaml
```

See `.nezam/core/docs/SYNC_RUNBOOK.md` for detailed failure recovery.

### Emergency bypass (use sparingly)

If you need to commit without running the hook (e.g., fixing a broken hook script itself):

```bash
git commit --no-verify -m "chore: emergency fix — hook bypassed"
```

Always follow up with a `pnpm ai:sync && pnpm ai:check` pass on the next commit.

### Troubleshooting: hook not running

If commits pass without triggering the hook:

```bash
# Confirm the hook file is executable
ls -la .husky/pre-commit

# Re-install if missing
npx husky install
```

### Troubleshooting: `pnpm not found` in hook

The hook gracefully skips sync if `pnpm` is not on PATH and prints a warning:
```
⚠️  pnpm not found — skipping sync.
```

Fix: add `pnpm` to your shell PATH. On macOS: `export PATH="$HOME/.local/share/pnpm:$PATH"`.

---

## 3. Syncing AI Mirrors

NEZAM mirrors the canonical `.cursor/` configuration to every supported AI tool:

| Tool | Mirror location |
|---|---|
| Claude Code | `.claude/` |
| Gemini | `.gemini/` |
| GitHub Copilot | `AGENTS.md` |
| Codex / OpenCode | `AGENTS.md`, `CLAUDE.md` |

The pre-commit hook handles sync automatically. For manual sync or targeted updates:

```bash
# Sync all tool mirrors
pnpm ai:sync

# Sync one tool only (faster)
pnpm ai:sync --target=claude
pnpm ai:sync --target=gemini

# Check sync status without writing
pnpm ai:status
```

**Never edit mirror files directly** — they are overwritten on next sync.

---

## 4. Validation Checks

Before pushing, all three suites must pass:

```bash
# 1. YAML state file syntax
pnpm verify:yaml

# 2. Mirror drift + swarm integrity + skill frontmatter + design skills
pnpm ai:check

# 3. Run both together (same as CI gate)
pnpm ai:check && pnpm verify:yaml
```

The CI workflows `sync-drift-check.yml` and `sync-and-drift-check.yml` enforce these as blocking gates on every PR that touches `.cursor/`, `.claude/`, `.gemini/`, or `AGENTS.md`.

---

## 5. Working with Agents and Skills

### Adding or modifying an agent

1. Edit (or create) the agent file in `.cursor/agents/`
2. `pnpm ai:sync` — propagates to all tool mirrors
3. `pnpm ai:check` — confirms no orphaned refs or frontmatter issues

### Adding a skill

1. Create the skill directory at `.cursor/skills/<category>/<skill-id>/SKILL.md`
2. Ensure frontmatter has `version`, `updated`, and `tier` (1, 2, or 3)
3. `pnpm ai:sync && pnpm ai:check`

### Archiving a deprecated skill

1. Move to `.cursor/skills/archive/<category>/<skill-id>/`
2. Add an entry to `.cursor/skills/archive/DEPRECATED.md` with the active replacement
3. Update all agent files referencing the archived skill ID
4. `pnpm ai:sync && pnpm ai:check` — confirm zero unresolved refs

---

## 6. Branch and PR Conventions

- Branch names: `feature/<description>`, `fix/<description>`, `chore/<description>`
- PRs targeting `Master` must pass all CI gates: sync drift, YAML, lint, typecheck, design gates
- State file changes (`.cursor/state/`) must keep all YAML valid (`pnpm verify:yaml`)
- Never commit generated mirror files without first running `pnpm ai:sync`

For full sync failure recovery and rollback procedures, see `.nezam/core/docs/SYNC_RUNBOOK.md`.
