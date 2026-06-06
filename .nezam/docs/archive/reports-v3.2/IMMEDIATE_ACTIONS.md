# NEZAM Post-Release — Immediate Actions (Next 72 Hours)

**Status:** First release complete ✅ | **Operational readiness:** 65/100 🟡

---

## DO THIS NOW (Next 2–3 hours)

### 1. Clean up sync drift & state files
```bash
cd /path/to/NEZAM
pnpm ai:sync          # Sync all .cursor/ mirrors
pnpm ai:check         # Check for drift
pnpm verify:yaml      # Find YAML parse errors
pnpm skills:dedup     # Remove orphaned skills (25 found)
```

**Why:** Orphaned skills + YAML errors will cascade when you start second project.

### 2. Provision auth tokens
In `.env` (or `.env.local`):
```
FIGMA_ACCESS_TOKEN=<your-token>
GITHUB_TOKEN=<your-token>
AUTH0_DOMAIN=<domain>
AUTH0_CLIENT_ID=<id>
```

**Why:** Wireframe server + CI/CD won't work without these.

### 3. Set up pre-commit hook
```bash
npx husky install
```

**Why:** Without this, sync drift accumulates silently across your team.

---

## DO THIS TODAY (Next 4–6 hours)

### 4. Test CI pipeline end-to-end
1. Create branch: `git checkout -b test/ci-validation`
2. Make a dummy change (e.g., update `README.md`)
3. Push to GitHub
4. Watch the GitHub Actions workflow
5. Document any failures in `.nezam/core/reports/CI_TEST_LOG.md`
6. Verify all gates pass (lint, type, security, perf budget, tests)

**Why:** You can't merge with confidence until CI is proven.

### 5. Validate wireframe server integration
```bash
# In Cursor or Claude Code:
/wireframe
```
Then:
1. Follow the prompts to generate `project_context.json`
2. Start the wireframe server (if applicable)
3. Verify lock→unlock cycle completes
4. Document output in `.nezam/core/reports/WIREFRAME_TEST.md`

**Why:** Design-to-code velocity depends on this working.

### 6. Run first security audit
```bash
# In Cursor:
/SCAN security
```

Then:
1. Review findings in `.nezam/core/reports/audits/`
2. Enable GitHub CodeQL + DependaBot in settings
3. Document baseline in `.nezam/core/meta/SECURITY.md`

**Why:** Can't go to production without security baseline.

---

## DO THIS WEEK (Priority 2)

### 7. Create runbooks
- **CI/CD Runbook:** How to deploy, rollback, recover from failures
- **Wireframe Server Runbook:** How to start, troubleshoot, recover
- **Sync Runbook:** How to detect + fix drift
- **Incident Response:** What to do if CI fails, sync breaks, etc.

**Files:**
- `.nezam/core/docs/RUNBOOKS.md`
- `.nezam/core/docs/TROUBLESHOOTING.md`

### 8. Team onboarding
Schedule 30-min sessions to teach:
- `/GUIDE` — where are we, what's next
- `/PLAN` — how to plan a feature
- `/DEVELOP` — how to implement
- `/SCAN` + `/FIX` — how to find + fix issues

### 9. Documentation audit
Update:
- `README.md` (post-release status)
- `.nezam/core/wiki/` (current architecture)
- `.nezam/core/tools/` (CLI guide for each AI tool)

---

## DO THIS SPRINT (Priority 3)

### 10. Performance instrumentation
```bash
/SCAN perf
```
Then:
1. Set up monitoring for your first deployed component
2. Document perf baseline
3. Create alerting thresholds in your observability stack

### 11. Content ops validation
```bash
/PLAN seo-ia-content
```
For your first real project:
1. Validate SEO strategy
2. Test Arabic RTL rendering
3. Document content quality baseline

### 12. Monthly sync discipline
Add to your calendar:
- **Weekly:** `pnpm ai:check` (5 min)
- **Monthly:** Review changelog + sync drift report (30 min)
- **Quarterly:** Security audit + architecture review (2 hrs)

---

## Critical Path Dependencies

```
Sync cleanup + YAML fixes
       ↓
Provision auth tokens
       ↓
Test CI pipeline ← BLOCKER: Can't merge without this
       ↓
Wireframe server validation
       ↓
First real feature project
       ↓
Team-wide rollout
```

**Do NOT proceed to team rollout until steps 1–6 are complete.**

---

## Success Criteria

After 72 hours, you should have:

- ✅ Zero YAML parse errors
- ✅ Sync drift < 1%
- ✅ CI pipeline tested + documented
- ✅ Auth tokens provisioned
- ✅ Husky installed on all machines
- ✅ Security baseline established
- ✅ Wireframe server tested (or documented as blocked)
- ✅ One test PR merged successfully

---

## Contact & Support

If you get stuck:
1. Check `.nezam/core/docs/TROUBLESHOOTING.md`
2. Review relevant agent (e.g., `swarm-leader.md`, `devops-manager.md`)
3. Check `.nezam/core/memory/DECISIONS.md` for context
4. Run `/GUIDE stuck` for navigation help

---

**Estimated effort:** 6–8 hours spread over 3 days  
**Estimated team coordination:** 1–2 hours  
**Risk if skipped:** 40%+ of post-release issues are preventable with these steps

---

**Next review:** 2026-06-07 (3 days post-release)
