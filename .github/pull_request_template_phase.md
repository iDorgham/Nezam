<!-- 
This is the PHASE-SPECIFIC PR template.
Use for all SDD phase branches (phase/*).
Standard PRs use: .github/pull_request_template.md
-->

## 🚀 Phase Information

**Phase**: _(e.g., Planning, Design, Development)_
**Branch Format**: `phase/<phase-name>/YYYY-MM-DD`
**Related Issue**: Closes #___

---

## 📋 What Changed

### Phase Objectives Addressed
- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

### Key Deliverables
- [ ] Deliverable 1
- [ ] Deliverable 2
- [ ] Deliverable 3

### Files Modified
- 
- 
- 

---

## 🎯 Why These Changes

**Business Rationale**:
- 

**Technical Rationale**:
- 

**Impact**:
- 

---

## ✅ Phase Gate Checklist

### Pre-Merge Requirements
- [ ] All phase objectives completed
- [ ] Documentation updated in progress file
- [ ] Team reviews approved
- [ ] No blocking issues
- [ ] Phase state file updated

### Design Excellence (if applicable)
- [ ] Design tokens verified
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness checked
- [ ] RTL (if applicable) verified

### Code Quality (if applicable)
- [ ] TypeScript strict mode passes
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Linting passes (`pnpm lint`)
- [ ] Type generation complete (`pnpm run design:tokens:emit`)

### CI/CD Status
- [ ] All workflows passing
- [ ] No merge conflicts
- [ ] Branch is up to date with main
- [ ] Pre-commit hooks pass

---

## 🔄 SDD Phase Transition

### Current Phase Completion
**Phase**: _Phase Name_
**Status**: Ready to close and transition

### Next Phase Preparation
**Next Phase**: _Next Phase Name_
- [ ] New branch will be created
- [ ] Next phase state file prepared
- [ ] Team notified of transition
- [ ] Resources allocated for next phase

---

## 📊 Metrics & Evidence

### Phase Progress
- **Started**: _Date_
- **Completed**: _Date_
- **Duration**: _Days_
- **Team Members**: _Names_

### Key Metrics
- **Lines Changed**: _(auto-filled by GitHub)_
- **Files Modified**: _(auto-filled by GitHub)_
- **Commits**: _(auto-filled by GitHub)_

### Documentation Links
- [Phase Progress File](.nezam/core/plans/PHASE_NAME/progress.md)
- [Phase State](.cursor/state/phase-PHASE_NAME.yaml)
- [SDD Specification](.nezam/core/prd/PRD.md)

---

## 🎓 Release Impact

### SemVer Classification
- [ ] MAJOR (breaking changes)
- [ ] MINOR (new features)
- [ ] PATCH (bug fixes)
- [ ] N/A (no release impact)

### Release Planning
- **Target Version**: _vX.Y.Z_ (or TBD)
- **Release Notes**: _(Link or text)_
- **Hotfix Capable**: Yes / No
- **Rollback Path**: _(Describe if needed)_

---

## 🔍 Review Guidelines

### What to Review
1. Phase objectives completeness
2. Adherence to SDD requirements
3. Quality gate compliance
4. Documentation accuracy
5. Team sign-off status

### Reviewers
- **Phase Lead**: @___
- **Tech Lead**: @___
- **Design Lead**: @___ (if applicable)
- **Stakeholder**: @___

---

## 📝 Notes for Maintainers

### Merge Strategy
- **Method**: Squash / Merge / Rebase
- **Delete Branch**: Yes / No
- **Require CI**: Yes

### Post-Merge Actions
- [ ] Archive phase documentation
- [ ] Update project timeline
- [ ] Create next phase branch
- [ ] Close phase tracking issue
- [ ] Notify team of completion

---

## 🤝 Stakeholder Sign-Off

- [ ] Product Owner approved
- [ ] Tech Lead approved
- [ ] Design Lead approved (if applicable)
- [ ] QA approved
- [ ] Ready for merge

---

<div align="center">

**Phase**: _Phase Name_ • **Status**: 🟡 In Review • **Gate**: ⏳ Pending Approval

_Generated for NEZAM SDD Phase Workflow_

</div>
