# External Skills Index

> **External skills** are standalone capabilities that can be used independently from the SDD pipeline,
> typically invoked from slash commands, CI automation, or agent handoffs.
> They interact with external tools, services, and team workflows.

Last updated: 2026-05-12

---

## Skills

| Skill | Description | Primary Trigger | Status |
|-------|-------------|-----------------|--------|
| [api-testing](api-testing/SKILL.md) | Contract testing, integration scaffolding, Bruno collections, mock servers, CI integration | `/SCAN api`, `qa-test-lead` agent | ✅ Active |
| [deployment-checklist](deployment-checklist/SKILL.md) | Pre/post deployment gates, rollback plan, observability confirmation, go/no-go decision | `/DEPLOY`, `devops-manager` agent | ✅ Active |
| [external-ai-report](external-ai-report/SKILL.md) | Progress reports for browser-based AI companions (Grok/Qwen/Gemini) with upload reminders | `/SAVE report` | ✅ Active |
| [git-workflow](git-workflow/SKILL.md) | Branching, conventional commits, annotated tags, PR checks, branch protection, Dependabot | `/SAVE branch|commit|tagplan`, `/DEPLOY tag` | ✅ Active |
| [guide-instructor-domains](guide-instructor-domains/SKILL.md) | Repo-grounded teaching map for explaining NEZAM paths (security, design, SEO, CI, orchestration) | `/GUIDE explain`, teaching context | ✅ Active |
| [handoff-report](handoff-report/SKILL.md) | Structured session/agent/human transition documentation with state capture and next-action briefs | `/SAVE log`, `deputy-swarm-leader` agent | ✅ Active |
| [plan-full](plan-full/SKILL.md) | Full SDD planning spine — roadmap, phases, specs, docs scaffolding with acceptance criteria matrices | `/PLAN full`, `product-manager` agent | ✅ Active |

---

## Categories

### Developer Workflow
- `git-workflow` — Source control hygiene, branching, PR gates
- `api-testing` — API contract and integration testing
- `deployment-checklist` — Release readiness and go/no-go

### Collaboration & Handoff
- `external-ai-report` — Cross-tool AI progress reports
- `handoff-report` — Session and agent transition documentation
- `guide-instructor-domains` — Teaching and explanation scaffolding

### Planning
- `plan-full` — SDD planning spine

---

## Adding New External Skills

1. Create directory: `.cursor/skills/external/<skill-name>/`
2. Create `SKILL.md` with required frontmatter (`name`, `description`, `paths`, `version`, `updated`, `changelog`).
3. Add entry to this index table (alphabetical by skill name).
4. Run `pnpm ai:sync` to propagate to mirrors.
5. Update `.nezam/workspace/meta/SKILLS_CHANGELOG.md` with the new addition.

---

## Audit Log

| Date | Action | Skills Affected |
|------|--------|----------------|
| 2026-05-12 | Initial index created | All 7 external skills documented |
| 2026-05-12 | Added `api-testing`, `deployment-checklist`, `handoff-report` | 3 new skills |
