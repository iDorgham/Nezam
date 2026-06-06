# NEZAM Sync & Drift Recovery Runbook

This runbook describes the workflow and maintenance procedures for keeping client IDE mirrors (`.claude/`, `.windsurf/`, etc.) in sync with the canonical `.cursor/` configuration, identifying sync drift, and recovering from state file corruption.

---

## 1. When to Sync

Mirrors must be kept in perfect synchronization to ensure all local AI agents are operating on the same design system guidelines and commands.

- **On Every Commit:** You must run `pnpm ai:sync` before pushing. A pre-commit hook is configured to handle this automatically on local commits.
- **After Adding or Modifying Agents/Skills:** Any changes to `.cursor/agents/`, `.cursor/skills/`, `.cursor/rules/`, or `.cursor/commands/` require running `pnpm ai:sync` to propagate modifications to all tool client mirrors.
- **On Pulling Main:** When pulling changes from remote, run `pnpm ai:sync` to ensure your local workspace mirrors are updated.

---

## 2. Validation Checks

Running `pnpm ai:check` performs an automated audit and reports on the following five core metrics:

1. **Mirror File Drift:** Asserts that all generated files in mirrored client trees match the canonical source of truth exactly.
2. **SDD Swarm Integrity:** Validates that the active swarm configuration does not contain circular dependencies or missing target agents.
3. **Skill Frontmatter Validity:** Checks that every `SKILL.md` contains proper `version:`, `updated:`, and valid `tier:` declarations (must be exactly 1, 2, or 3).
4. **Design Skills Parity:** Verifies that all design skills declared in `.nezam/core/gates/design-skills.yaml` exist and are correctly vendored.
5. **YAML State Syntax:** Running `pnpm verify:yaml` ensures all system state configurations are well-formed and parseable.

---

## 3. Resolving Common Drift Issues

### Issue: "Mirror drift detected" in CI
**Cause:** Changes were committed to `.cursor/` files directly without running `pnpm ai:sync`.
**Solution:**
1. Pull the branch locally.
2. Run `pnpm ai:sync` to regenerate the mirrors.
3. Stage and commit the changed mirror files.
4. Push to remote.

### Issue: "Missing SKILL.md" or "Design skill not vendored"
**Cause:** An external design skill is listed in `.nezam/core/gates/design-skills.yaml` but missing from the local workspace.
**Solution:**
1. Run `pnpm skills:vendor-design` to re-vendor external skills.
2. Run `pnpm ai:sync` to update client mirrors.
3. Re-run `pnpm ai:check` to verify.

---

## 4. Recovery Steps for State File Corruption

If state files under `.cursor/state/` (e.g. `plan_progress.yaml` or `agent-status.yaml`) become corrupted or unparseable:

1. **Verify parse errors:**
   ```bash
   pnpm verify:yaml
   ```
2. **Restore from Git:**
   If the corruption is local and uncommitted, revert the state files to the last known good commit:
   ```bash
   git restore .cursor/state/plan_progress.yaml .cursor/state/agent-status.yaml
   ```
3. **Run state recovery script:**
   If the state was broken during an interactive session, run the repair script:
   ```bash
   bash .nezam/core/scripts/checks/repair-sdd-state.sh
   ```
4. **Check state integrity:**
   Confirm the restored files match their schemas:
   ```bash
   pnpm check:state
   ```

---

## 5. Escalation Procedure

If you encounter persistent sync issues or validation failures that cannot be resolved:
1. Open a Slack thread in **#engineering-nezam** with the stdout output of `pnpm ai:check`.
2. Attach the generated log from `.cursor/state/skills-registry.json`.
3. Contact the **DevOps / Quality Lead** (`@devops-lead`) for manual pipeline overrides.
