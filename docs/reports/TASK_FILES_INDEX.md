# NEZAM Release Task Files — Complete Index
## Master Reference for Pre-Release & Post-Release Work

**Release:** NEZAM v1.0.0  
**Date:** 2026-06-04  
**Status:** ✅ All task files created and ready for execution

---

## Document Overview

This index provides a quick reference to all task files created for the v1.0.0 release cycle. Use this to navigate between pre-release and post-release documentation.

### Created Task Files

1. **PRE_RELEASE_TASKS.md** — Everything to do before shipping
2. **POST_RELEASE_TASKS.md** — Everything to do after shipping
3. **AUDIT_2026-06-04_FOLLOW_UP.md** — Verification of prior audit findings
4. **RELEASE_PLAN_2026-06-04.md** — Three-milestone release roadmap (R1/R2/R3)
5. **AUDIT_SUMMARY_2026-06-04.md** — One-page audit summary
6. **TASK_FILES_INDEX.md** (this file) — Navigation guide

---

## Quick Navigation

### Pre-Release (Execute Before Tag)

**File:** `docs/reports/PRE_RELEASE_TASKS.md`  
**Duration:** ~3.5 hours  
**Sections:**
1. **Phase 1: Repository Cleanup (30 min)**
   - Remove stray git artifacts
   - Consolidate uncommitted changes
   - Validate .gitignore coverage

2. **Phase 2: Code Quality & Testing (45 min)**
   - Run full test suite
   - Validate AI contracts
   - Build Design Hub

3. **Phase 3: Version & Changelog (45 min)**
   - Determine release version (semver)
   - Create/update CHANGELOG.md
   - Create RELEASE_NOTES.md (optional)

4. **Phase 4: Git State Preparation (30 min)**
   - Final commit & branch check
   - Verify tag naming convention
   - Ensure all tests pass

5. **Phase 5: Documentation & Communication (30 min)**
   - Update README.md
   - Create release summary
   - Link all documentation

6. **Phase 6: Final Validation Checklist (15 min)**
   - Go/No-Go decision matrix
   - Pre-release sign-off template

7. **Phase 7: Execute Release**
   - Run `/GIT release` command
   - Wait for GitHub Actions

**Key deliverables:**
- ✅ CHANGELOG.md updated
- ✅ All tests passing
- ✅ Repository clean
- ✅ Documentation complete
- ✅ Release tag created (v1.0.0)

---

### Post-Release (Execute After Tag)

**File:** `docs/reports/POST_RELEASE_TASKS.md`  
**Duration:** ~8-10 hours (spread across 2 weeks)  
**Three phases:**

#### **Phase A: Immediate Stabilization (24-48 hours)**
- Monitor release health (GitHub, CI/CD, user feedback)
- Create critical hotfix process
- Create production support runbook

#### **Phase B: Performance Optimization (R2, Days 3-7)**
- **B.1** Move `references/` out of workspace (P1) → **20+ GB RAM savings**
- **B.2** Add watcherExclude (P2) → **2-3 GB RAM savings**
- **B.3** Prune unused mirrors (P3, optional)
- **B.4** Add pre-push branch-name guard (B1)
- **B.5** Document branch-protection rules (B2)
- **B.6** Measure performance improvements

#### **Phase C: Documentation & Onboarding (R3, Days 8-14)**
- **C.1** Create `/START Design` onboarding guide
- **C.2** Create phase templates & checklists
- **C.3** Document hardlock gates philosophy
- **C.4** Create video walkthrough (optional)
- **C.5** Update documentation index

#### **Phase D: Ongoing Monitoring (Week 2+)**
- Weekly health checks
- Monthly roadmap planning

**Key deliverables:**
- ✅ Production support runbook created
- ✅ Workspace size reduced by 30-50%
- ✅ Performance baseline documented
- ✅ Comprehensive onboarding guides
- ✅ Template library for all phases

---

## Release Phases Explained

### R1: Foundation Release (Ready Now)
**Status:** ✅ Ready to execute immediately  
**Duration:** ~2 hours  
**Who:** Release manager + DevOps  
**What:** Create release tag, publish to GitHub/NPM  

**Execute using:** PRE_RELEASE_TASKS.md (Phases 1-7)

---

### R2: Performance Hardening (Recommended, 1 week post-release)
**Status:** ✅ Ready to execute after R1  
**Duration:** ~4-6 hours  
**Who:** Engineering team  
**What:** Reduce RAM, optimize indexer, document policies  

**Execute using:** POST_RELEASE_TASKS.md (Phase B)

---

### R3: Onboarding Finalization (Optional, 2 weeks post-release)
**Status:** ✅ Ready to execute after R1  
**Duration:** ~4-5 hours  
**Who:** Engineering + Product team  
**What:** Create comprehensive user guides, templates, documentation  

**Execute using:** POST_RELEASE_TASKS.md (Phase C)

---

## File Locations

### Audit & Release Plans
```
docs/reports/
├── AUDIT_2026-06-04.md                    (original audit)
├── AUDIT_2026-06-04_FOLLOW_UP.md          (verification)
├── AUDIT_SUMMARY_2026-06-04.md            (one-pager)
├── RELEASE_PLAN_2026-06-04.md             (R1/R2/R3 roadmap)
├── PRE_RELEASE_TASKS.md                   (this release's tasks)
├── POST_RELEASE_TASKS.md                  (post-release work)
└── TASK_FILES_INDEX.md                    (this file)
```

### Future Artifacts (will be created)
```
docs/reports/
├── PERFORMANCE_REPORT_2026-06-04.md       (post-R2 measurements)
└── RELEASE_SUMMARY_2026-06-04.md          (executive summary)

.nezam/core/
├── docs/
│   ├── START_DESIGN_GUIDE.md              (new user guide)
│   ├── HARDLOCK_GATES.md                  (gate philosophy)
│   ├── SUPPORT_RUNBOOK.md                 (troubleshooting)
│   └── ONBOARDING_CHECKLIST.md            (step-by-step)
├── templates/phases/
│   ├── 00-define.PRD_TEMPLATE.md
│   ├── 01-research.RESEARCH_TEMPLATE.md
│   ├── 02-ia.IA_TEMPLATE.md
│   └── ... (10 templates total)
└── meta/
    └── RELEASE_SUMMARY_2026-06-04.md      (stakeholder summary)

.github/
└── HOTFIX_PROCESS.md                      (post-release hotfix guide)
```

---

## Execution Checklist

### Before Release (Day 0)
- [ ] Review PRE_RELEASE_TASKS.md completely
- [ ] Assign owner for each phase
- [ ] Block 3.5 hours of focused time
- [ ] Notify stakeholders of release timing

**Start here:** `docs/reports/PRE_RELEASE_TASKS.md` → Phase 1

### Release Day (Day 0)
Execute PRE_RELEASE_TASKS.md in order:
- [ ] Phase 1: Cleanup (30 min)
- [ ] Phase 2: QA (45 min)
- [ ] Phase 3: Version/Changelog (45 min)
- [ ] Phase 4: Git state (30 min)
- [ ] Phase 5: Documentation (30 min)
- [ ] Phase 6: Final validation (15 min)
- [ ] Phase 7: Execute release (2 hours)

### Post-Release Week 1 (Days 1-2)
Execute POST_RELEASE_TASKS.md Phase A:
- [ ] A.1 Monitor release health
- [ ] A.2 Create hotfix process
- [ ] A.3 Create support runbook

### Post-Release Week 2-3 (Days 3-7)
Execute POST_RELEASE_TASKS.md Phase B:
- [ ] B.1 Move references/ (1 h)
- [ ] B.2 Add watcherExclude (10 min)
- [ ] B.3 Prune mirrors (20 min) — optional
- [ ] B.4 Pre-push hook (15 min)
- [ ] B.5 Branch-protection doc (10 min)
- [ ] B.6 Measure perf (20 min)

### Post-Release Week 2-3 (Days 8-14)
Execute POST_RELEASE_TASKS.md Phase C:
- [ ] C.1 START Design guide (1 h)
- [ ] C.2 Phase templates (1.5 h)
- [ ] C.3 Hardlock gates doc (45 min)
- [ ] C.4 Video guide (2 h) — optional
- [ ] C.5 Documentation index (15 min)

### Post-Release Week 4+ (Days 15+)
Execute POST_RELEASE_TASKS.md Phase D:
- [ ] Weekly health checks (20 min/week)
- [ ] Monthly roadmap planning (2 h/month)

---

## Success Criteria

### R1 Release (Done When)
- ✅ Tag v1.0.0 created and pushed
- ✅ GitHub Release page populated
- ✅ All CI/CD checks green
- ✅ No uncommitted changes on main

### R2 Optimization (Done When)
- ✅ references/ moved to ~/nezam-references/
- ✅ watcherExclude added to .vscode/settings.json
- ✅ Unused mirrors pruned (optional)
- ✅ Pre-push hook installed
- ✅ Branch-protection documented
- ✅ Performance report shows 20+ GB RAM savings

### R3 Onboarding (Done When)
- ✅ START_DESIGN_GUIDE.md written (2000+ words)
- ✅ 10 phase templates created
- ✅ Hardlock gates documented (2000+ words)
- ✅ Video walkthrough published (optional)
- ✅ All docs linked from README.md

---

## Team Roles & Responsibilities

| Role | Pre-Release | Post-Release |
|------|-------------|--------------|
| **Release Manager** | Execute Phases 1-7 | Oversee A/B/C/D |
| **Engineering Lead** | QA (Phase 2) | Optimization (Phase B) |
| **DevOps** | Validate CI/CD (Phase 4) | Monitor health (Phase A) |
| **Product Manager** | Documentation (Phase 5) | Onboarding (Phase C) |
| **UX/Designer** | Design Hub QA (Phase 2) | Video guide (Phase C.4) |

---

## Timeline at a Glance

```
2026-06-04 (Release Day)
├─ 10:00 AM - Start Phase 1 (Cleanup)
├─ 10:30 AM - Start Phase 2 (QA)
├─ 11:15 AM - Start Phase 3 (Version)
├─ 12:00 PM - Start Phase 4 (Git)
├─ 12:30 PM - Start Phase 5 (Docs)
├─ 1:00 PM - Start Phase 6 (Final validation)
├─ 1:15 PM - Execute Phase 7 (/GIT release)
└─ 3:00 PM - Release published ✅

2026-06-05 to 2026-06-07 (Stabilization)
├─ Day 1: Monitor + Hotfix process
├─ Day 2: Support runbook
└─ Day 3: Ready for Phase B

2026-06-08 to 2026-06-12 (Optimization)
├─ Day 3: Move references/
├─ Day 4: watcherExclude + prune
├─ Day 5: Pre-push hook + docs
└─ Day 7: Measure performance

2026-06-13 to 2026-06-18 (Onboarding)
├─ Day 8: START Design guide
├─ Day 9: Phase templates
├─ Day 10: Hardlock gates doc
├─ Day 11-12: Video guide (optional)
└─ Day 13: Documentation index
```

---

## Key Documents to Understand First

**Before executing any work, read these in order:**

1. **AUDIT_SUMMARY_2026-06-04.md** (2 min)
   → Quick recap of what was fixed, what's left

2. **RELEASE_PLAN_2026-06-04.md** (10 min)
   → Overview of R1/R2/R3 approach and timelines

3. **PRE_RELEASE_TASKS.md** (30 min)
   → Detailed walkthrough of what you'll do before release

4. **POST_RELEASE_TASKS.md** (30 min)
   → Detailed walkthrough of what you'll do after release

Then execute in order:
- PRE_RELEASE_TASKS.md (Day 0)
- POST_RELEASE_TASKS.md Phase A (Days 1-2)
- POST_RELEASE_TASKS.md Phase B (Days 3-7)
- POST_RELEASE_TASKS.md Phase C (Days 8-14)

---

## Troubleshooting & FAQ

### Q: Can I skip Phase B (optimization)?
**A:** Technically yes, but not recommended. P1 alone saves 20+ GB RAM for desktop users. Phase B is high-impact, low-effort.

### Q: Can I do Phase C (onboarding) in parallel with Phase B?
**A:** Yes! They don't depend on each other. Different teams can work simultaneously.

### Q: What if I discover a bug during pre-release?
**A:** Fix it before Phase 7. Add a commit with clear message, re-run Phase 2 (QA), then proceed to Phase 7.

### Q: What if the release fails?
**A:** Rollback via `.github/HOTFIX_PROCESS.md`. Delete tag, revert commits, fix issue, retry.

### Q: How do I handle critical issues after release?
**A:** See `.github/HOTFIX_PROCESS.md` (created in Phase A of post-release).

### Q: Who should do what?
**A:** See "Team Roles & Responsibilities" section above. Tailor to your org.

---

## Contact & Escalation

**Release Manager:** [name]  
**Slack channel:** #engineering  
**Escalation path:** Manager → Product Lead → CTO  

For questions about these tasks:
1. Check the task file itself (detailed instructions)
2. Check this index (quick reference)
3. Ask in #engineering Slack
4. Escalate to Release Manager

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-06-04 | Initial task file suite created |
| (Future) | TBD | Updated based on actual execution |

---

**Document owner:** Release Manager  
**Last updated:** 2026-06-04  
**Next review:** After v1.0.0 release (2026-06-05)

---

## Quick Links

- 🚀 **Ready to release?** → Read PRE_RELEASE_TASKS.md
- 📊 **What was audited?** → Read AUDIT_SUMMARY_2026-06-04.md
- 📋 **Full release plan?** → Read RELEASE_PLAN_2026-06-04.md
- 🔧 **Optimization checklist?** → Read POST_RELEASE_TASKS.md Phase B
- 📚 **Onboarding guides?** → Read POST_RELEASE_TASKS.md Phase C
