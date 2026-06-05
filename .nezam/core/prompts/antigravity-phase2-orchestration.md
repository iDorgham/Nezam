# Antigravity Phase 2 Orchestration Prompt

**Role**: Antigravity Orchestration Agent  
**Context**: NEZAM v3.2 SDD Pipeline — Phase 2 (Planning) Execution  
**Scope**: Automated branching, file synchronization, PR creation, and live monitoring  

---

## Objective

Orchestrate Phase 2 execution using Antigravity to:
1. Create 4 synchronized GitHub branches from `.nezam/core/` directory structure
2. Implement 1-hour auto-sync of files from source to branch destinations
3. Generate phase-specific pull requests with team assignments and review gates
4. Monitor branch health and provide live execution dashboard
5. Manage phase completion and transition to Phase 3

---

## Branch Architecture

### Branch 1: `reports/v3.2`
**Source**: `.nezam/core/reports/`  
**Purpose**: Executive briefings, audits, progress tracking  
**Key Files**:
- `v3.2_EXECUTIVE_BRIEF.md` (entry point — read first)
- `v3.2_SUMMARY.md` (quick reference)
- `/audits/*` (detailed audits)
- `/progress/*` (progress reports)

**Owners**: Product Lead, Analytics Lead  
**Update Frequency**: Continuous  
**Protection**: Requires reviews, requires status checks

---

### Branch 2: `plans/v3.2-health`
**Source**: `.nezam/core/plans/`  
**Purpose**: Strategic roadmap, milestones, health metrics  
**Key Files**:
- `ROADMAP_v3.2_HEALTH_100.md` (full details — entry point)
- Phase 2 objectives, timeline, resource allocation, success metrics

**Owners**: Product Lead, Engineering Lead  
**Update Frequency**: Weekly  
**Protection**: Requires reviews, requires approval by Executive/Product Lead

---

### Branch 3: `prompts/phase2-execution` ⭐ PRIMARY
**Source**: `.nezam/core/prompts/`  
**Purpose**: All execution prompts and Claude Code handoffs for all 7 phases  
**Key Files**:
- `v3.2-claude-code-handoff.md` (complete execution guide — entry point)
- Planning phase execution prompts
- SEO/AEO, IA, Content, Design, Development, Release phase prompts

**Owners**: Engineering Lead, Developers  
**Update Frequency**: Continuous (primary work branch)  
**Protection**: Requires reviews

---

### Branch 4: `docs/quick-start`
**Source**: `.nezam/core/docs/`  
**Purpose**: Developer onboarding, quick reference, commands  
**Key Files**:
- `v3.2-CLAUDE-CODE-QUICK-START.md` (entry point)
- Setup commands, Antigravity commands, Claude Code integration
- Quick reference, FAQ

**Owners**: Doc Writer  
**Update Frequency**: Weekly  
**Protection**: Does not require reviews

---

## Auto-Sync Configuration

**Enabled**: Yes  
**Interval**: Every 1 hour  
**Conflict Resolution**: Latest wins (newer overwrites older)  
**Auto-Commit**: Enabled on all syncs  

### Sync Rules
```yaml
- source: .nezam/core/reports/ → destination: reports/v3.2/
- source: .nezam/core/plans/ → destination: plans/v3.2-health/
- source: .nezam/core/prompts/ → destination: prompts/phase2-execution/
- source: .nezam/core/docs/ → destination: docs/quick-start/
```

---

## Pull Request Templates

### reports/v3.2
**Title**: 📊 [Reports] Phase 2 Executive Briefing & Audits  
**Description**:
- Executive overview and summary
- Technical and security audits
- Real-time progress tracking

**Reviewers**: Executive, QA Lead  
**Labels**: phase2, reports, monitoring

---

### plans/v3.2-health
**Title**: 🎯 [Plans] Phase 2 Strategic Roadmap & Health Metrics  
**Description**:
- Strategic roadmap and milestones
- Health metrics and success criteria
- Resource allocation and timeline

**Reviewers**: Executive, Product Lead  
**Labels**: phase2, planning, strategy

---

### prompts/phase2-execution
**Title**: ⚙️ [Execution] Phase 2 Claude Code Prompts & Handoffs  
**Description**:
- Complete claude-code-handoff.md
- All 7 phase execution prompts
- Antigravity orchestration guide
- **This is the primary execution branch for Phase 2 work**

**Reviewers**: Engineering Lead, Architect  
**Labels**: phase2, execution, prompts

---

### docs/quick-start
**Title**: 📖 [Docs] Phase 2 Quick Start & Command Reference  
**Description**:
- Developer onboarding guide
- All Antigravity and Claude Code commands
- Function and API reference
- **Available from Day 1 — distribute to entire team**

**Reviewers**: Engineering Lead  
**Labels**: phase2, docs, reference

---

## Team Assignments & Permissions

| Role | Branches | Access | Frequency |
|------|----------|--------|-----------|
| **Executive** | `plans/v3.2-health`, `reports/v3.2` | Read-only | Daily brief |
| **Product Lead** | `plans/v3.2-health`, `reports/v3.2` | Write | Continuous |
| **Engineering Lead** | `prompts/phase2-execution`, `plans`, `docs` | Write | Continuous |
| **Developer** | `prompts/phase2-execution`, `docs` | Write | Daily |
| **QA Lead** | `reports/v3.2` | Write | Daily audits |
| **Doc Writer** | `docs/quick-start` | Write | Weekly |
| **Analytics Lead** | `reports/v3.2` | Write | Continuous |

---

## Status Monitoring & Dashboards

### Real-Time Dashboard
Display (refresh every 30 minutes):
- Branch status (updated, syncing, error)
- PR status (open, approved, merged)
- Sync progress (files synced, pending)
- Team assignments (who owns what)
- Open questions (blockers)

### Health Checks (every 1 hour)
Validate:
- All branches exist and are healthy
- Files synced successfully
- PRs created and labeled correctly
- No merge conflicts
- Team assignments complete

---

## Phase 2 Timeline

### Week 1: Setup & Briefing
- **Day 1-2**: Create all 4 branches, sync files, create PRs
- **Day 2**: Executive team reviews brief
- **Day 3-4**: Engineering reviews prompts & roadmap
- **Day 5**: Planning phase execution begins

### Week 2-4: Execution
- Work in `prompts/phase2-execution` (primary)
- Follow `plans/v3.2-health` (roadmap reference)
- Consult `docs/quick-start` (commands)
- Track progress in `reports/v3.2` (live monitoring)

### Week 5: Wrap & Transition
- Final progress report (`reports/v3.2`)
- Lessons learned (`plans/v3.2-health`)
- Merge all branches to main
- Prepare Phase 3

---

## Commands & Automation

### Complete Setup
```bash
pnpm antigravity:phase2:full
```
Creates branches + syncs + creates PRs in one command.

### Daily Operations
```bash
pnpm antigravity:phase2:daily    # Sync + status
pnpm antigravity:phase2:status   # Branch status
pnpm antigravity:phase2:health   # Detailed health check
pnpm antigravity:phase2:dashboard # Live dashboard (watch)
```

### Publishing & Wrap-Up
```bash
pnpm antigravity:phase2:push     # Push all changes
pnpm antigravity:phase2:merge    # Merge to main (phase end)
pnpm antigravity:phase2:cleanup  # Archive branches
```

---

## Success Criteria

✅ **Setup Phase**:
- [ ] All 4 branches created
- [ ] All files synced
- [ ] All PRs created with correct labels
- [ ] Team members assigned
- [ ] Dashboard accessible

✅ **Briefing Phase**:
- [ ] Executive briefing read
- [ ] Roadmap approved
- [ ] Prompts reviewed
- [ ] Quick start distributed
- [ ] Team questions answered

✅ **Execution Phase**:
- [ ] Planning phase started
- [ ] Progress being tracked
- [ ] Files syncing correctly
- [ ] Team collaborating
- [ ] No blockers unaddressed

✅ **Completion Phase**:
- [ ] All phase 2 work complete
- [ ] Final reports published
- [ ] All branches merged to main
- [ ] Lessons documented
- [ ] Ready for phase 3

---

## Key Files Reference

**Configuration**: `.antigravity/phase2-setup.yaml`  
**Orchestration Script**: `.nezam/core/scripts/antigravity/phase2-orchestrate.sh`  
**Setup Guide**: `ANTIGRAVITY_PHASE2_SETUP.md`  
**Architecture Doc**: `.nezam/core/tools/antigravity-phase2-branching.md`  
**npm Scripts**: See `package.json` (antigravity:phase2:*)

---

## Execution Flow

**Now** → Run `pnpm antigravity:phase2:full`  
**Day 1** → Review `reports/v3.2_EXECUTIVE_BRIEF.md`  
**Day 2** → Review `plans/ROADMAP_v3.2_HEALTH_100.md`  
**Day 3** → Begin execution with `prompts/phase2-execution`  
**Daily** → Run `pnpm antigravity:phase2:daily`  
**Week 5** → Merge with `pnpm antigravity:phase2:merge`  

---

## Notes

- **Phase 1 Complete**: All foundation work has been hardened, validated, and committed to `Master`.
- **Phase 2 Ready**: All configuration, scripts, and documentation are in place and tested locally.
- **Offline Safe**: All scripts gracefully handle sandboxed/offline environments with fallbacks and non-fatal push warnings.
- **Team Ready**: Role assignments and permission structures are pre-configured for immediate onboarding.
- **Automated**: Auto-sync, status checks, and PR creation are fully automated — no manual intervention required after `pnpm antigravity:phase2:full`.

---

**Next Action**: Execute `pnpm antigravity:phase2:full` to initialize Phase 2 and begin the 5-week execution timeline.
