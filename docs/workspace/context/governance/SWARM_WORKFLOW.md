# NEZAM Swarm Workflow Governance

## Swarm Hierarchy & Tiers

| Tier | Role | Responsibilities |
|------|------|------------------|
| 1 | Executive/Strategic | CPO (Chief Product Officer). Final approval on scope, vision, and high-impact AI releases. |
| 2 | Orchestration/Lead | Swarm Leader, Deputy Swarm Leader, Lead Architects. Coordination across swarms, integrity checks, and SDD pipeline enforcement. |
| 3 | Manager | Swarm Managers (Frontend Manager, Backend Manager, etc.). Task assignment, spec verification, and local gatekeeping. |
| 4 | Specialist/Support | Specialist Agents (CSS Specialist, SQL Expert, etc.). Execution of specific tasks within their domain. |

## Execution Protocol

### 1. Planning Phase
- Every task begins with `/PLAN`.
- Swarm Leader (Tier 2) defines the objective and assigns the active swarm.
- MEMORY.md is updated with the `active_swarm`.

### 2. Design & Spec Phase
- Design agents (Tier 2/3) produce design tokens and specs.
- Specs must follow `SPEC_TEMPLATE.md` and include `spec_version`, `status`, and `spec_id`.
- `status` must be `approved` before development starts.

### 3. Development Phase
- Specialist agents (Tier 4) implement code based on approved specs.
- All code must be token-first (Gate 1).
- Hardlocks enforced via `.cursor/rules/workspace-orchestration.mdc`.

### 4. Verification & Handoff
- Every output is scored via `/CHECK output`.
- Phase boundaries require a `PHASE_HANDOFF.md` packet.
- Deputy Swarm Leader (Tier 2) validates the handoff.

## Escalation Matrix

- **Technical Blockers:** Specialist (Tier 4) → Manager (Tier 3).
- **Scope Ambiguity:** Manager (Tier 3) → Lead Architect (Tier 2).
- **Architecture Conflict:** Lead Architect (Tier 2) → Swarm Leader (Tier 2).
- **Executive Decision:** Swarm Leader (Tier 2) → CPO (Tier 1).

## Handoff Packet Format
Refer to `docs/workspace/context/PHASE_HANDOFF.md` for the required structure.

---
> [!NOTE]
> All decisions must be logged in `docs/workspace/decisions/SWARM_DECISION_LOG.md`.
