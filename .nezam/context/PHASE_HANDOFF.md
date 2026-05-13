# Phase Handoff Template

## 1. Purpose
The purpose of this document is to facilitate smooth transitions between project phases, ensuring all relevant context, decisions, and artifacts are transferred effectively between agents and human supervisors.

## 2. When used
This template is used at the end of every SDD phase (e.g., Research, Design, Development) and before triggering MODE B/C handoffs.

## 3. Inputs
- Current phase artifacts (specs, code, docs)
- Previous phase handoff packet
- Decision logs and open questions

## 4. Outputs
- Completed handoff checklist
- Updated shared context
- Readiness signal for the next phase

## 5. Roles/Owners
- **Sender**: Active agent completing the phase.
- **Receiver**: Next active agent or human supervisor.
- **Approver**: Swarm leader or project architect.

## 6. Handoff checklist
- [ ] All deliverables for the current phase are completed.
- [ ] Tests and verifications have passed.
- [ ] Open questions are documented with owners.
- [ ] Shared context JSON is updated.
- [ ] Sign-off obtained from required domains.

## 7. Example
```markdown
### Example Handoff
- **From**: `research-agent`
- **To**: `design-lead`
- **Phase**: 01-research -> 02-design
- **Status**: Ready
```
