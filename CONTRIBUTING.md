# Contributing to NEZAM

Thank you for contributing. This guide covers everything you need to set up your environment, make changes safely, and get your code merged.

---

## 1. Setup

```bash
# Clone and install
git clone https://github.com/iDorgham/Nezam.git
cd Nezam
pnpm install

# Install the git pre-commit hook
pnpm hooks:install
```

Verify the hook is active:
```bash
ls -la .husky/pre-commit
# Should show the file exists and is executable
```

---

## 2. The Pre-commit Hook

Every `git commit` runs three things automatically:

1. **`pnpm ai:sync`** — rebuilds all AI tool mirrors from `.cursor/`
2. **Stages changed mirrors** — adds `.claude/`, `.gemini/`, `AGENTS.md`, `CLAUDE.md`, etc. to the commit automatically
3. **`pnpm ai:check`** — validates everything is consistent

If the check fails, the commit is blocked:
```
❌ COMMIT BLOCKED: AI check suite failed.
```

Fix it:
```bash
pnpm ai:check    # see which check failed
pnpm ai:sync     # rebuild mirrors if that is the issue
pnpm verify:yaml # check YAML state files if that is the issue
```

Then commit again normally.

> **Emergency only:** `git commit --no-verify` skips the hook. Use this only if the hook itself is broken. Always follow up with `pnpm ai:sync && pnpm ai:check` on your next commit.

---

## 3. The Rule: Edit `.cursor/` Only

NEZAM uses `.cursor/` as the single source of truth. All other tool folders (`.claude/`, `.gemini/`, `AGENTS.md`, etc.) are generated mirrors.

**Never edit mirror files directly.** They are overwritten by `pnpm ai:sync`.

If you want to change how Claude or Gemini behaves → edit the file in `.cursor/`, then run `pnpm ai:sync`.

---

## 4. Syncing

| Command | What It Does |
|:---|:---|
| `pnpm ai:sync` | Rebuild all mirrors from `.cursor/` |
| `pnpm ai:sync --target=claude` | Sync one tool only |
| `pnpm ai:status` | Check sync status without writing anything |
| `pnpm ai:check` | Full validation (drift + integrity + frontmatter) |

---

## 5. Adding or Changing Agents and Skills

**To add or change an agent:**
1. Edit or create the file in `.cursor/agents/`
2. Run `pnpm ai:sync` to push it to all mirrors
3. Run `pnpm ai:check` to confirm no broken references

**To add a skill:**
1. Create `.cursor/skills/<category>/<skill-id>/SKILL.md`
2. Add frontmatter with `version`, `updated`, and `tier` (1, 2, or 3)
3. Run `pnpm ai:sync && pnpm ai:check`

**To retire a skill:**
1. Move it to `.cursor/skills/archive/<category>/<skill-id>/`
2. Add an entry to `.cursor/skills/archive/DEPRECATED.md` with the replacement skill
3. Update any agent files that referenced the old skill ID
4. Run `pnpm ai:sync && pnpm ai:check` — confirm zero unresolved refs

---

## 6. Branches and PRs

Branch naming — the CI will reject any branch that does not follow this format:

| Type | Pattern | Example |
|:---|:---|:---|
| Feature | `feature/<slug>` | `feature/add-arabic-locale` |
| Fix | `fix/<slug>` | `fix/sidebar-rtl-padding` |
| Release | `release/<x.y.z>` | `release/0.3.7` |
| Hotfix | `hotfix/<x.y.z>` | `hotfix/0.3.6.1` |
| Docs | `docs/<slug>` | `docs/update-onboarding` |

Before opening a PR, run:
```bash
pnpm check:all
```

All gates must pass. PRs that touch `.cursor/`, `.claude/`, `.gemini/`, or `AGENTS.md` also trigger a CI sync-drift check.

---

## 7. Commit Message Format

```
<type>(<scope>): <short description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
```
feat(agents): add arabic-content-master agent
fix(design-hub): correct RTL padding in sidebar
docs(onboarding): simplify setup steps
chore(release): T-V32-6-008: cut v0.3.6 tag
```

If your commit is part of a tracked task, include the task ID:
```
feat(ci): T-V32-2-005: configure weekly ci-health-check cron
```

---

## 8. Need Help?

- See [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) for common issues
- See [`docs/RUNBOOKS.md`](docs/RUNBOOKS.md) for operational guides
- [Open an issue](https://github.com/iDorgham/Nezam/issues) on GitHub
