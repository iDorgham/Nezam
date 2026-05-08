---
name: skills-agents-ux-upgrade
overview: Audit current skills/agents against the provided registry, then close high-impact governance and UI/UX motion gaps while preserving existing COIA hardlocks and architecture.
todos:
  - id: build-coverage-matrix
    content: Create registry-to-current coverage matrix with covered/partial/missing statuses
    status: pending
  - id: add-reliability-skills
    content: Add and wire missing reliability skills (context/token/reflection/regression routing contracts)
    status: pending
  - id: standardize-design-source
    content: Create root DESIGN.md from selected profile and extend with professional animation system
    status: pending
  - id: sync-and-verify-governance
    content: Run sync/check and produce final audit report under docs/reports/audits
    status: pending
isProject: false
---

# Skills, Agents, and UI/UX Upgrade Plan

## Goals
- Reduce orchestration mistakes and inconsistency by tightening skill/agent governance and execution pathways.
- Improve UI/UX quality and motion outcomes by making `DESIGN.md` the single enforced source for design + animation specs.
- Add only missing high-value skills from your shared registry (avoid duplicates under different names).

## Current-State Findings (from repo scan)
- Strong baseline already exists in `.cursor/agents` and `.cursor/skills`, including architecture, UI/UX, motion, security, QA, SEO/AEO, and orchestration coverage.
- Many registry concepts already map to existing assets with different names (example: planning/design/security/perf/QA domains).
- Design hardlocks already require `DESIGN.md`/`docs/DESIGN.md`, but neither file currently exists in the workspace root/docs.
- Command surface is compact and aligned to your governance (`/start`, `/plan`, `/develop`, `/scan`, `/fix`, `/save`, `/deploy`, `/guide`, `/sync`).

## Priority Gap Map (Add/Upgrade)

### 1) Reliability and fewer mistakes (highest priority)
- Add a dedicated **token/context control layer** (from registry intent):
  - `context-window-manager`
  - `token-budget-manager`
  - `context-compressor` (if kept distinct from existing memory tooling)
- Add a strict **reflection/quality guard**:
  - `reflection-loop-engine` with confidence + max-iteration policy
- Add an explicit **regression detector** workflow in QA to complement existing testing skills.
- Strengthen `slash-command-router` behavior as a reusable skill contract (currently distributed mostly in command docs/rules).

### 2) UI/UX and professional animation (highest product impact)
- Create/standardize root `DESIGN.md` from selected profile under `.cursor/design/*/design.md` and treat it as authoritative.
- Add/upgrade explicit design execution skills:
  - `user-flow-mapper`
  - `design-system-builder` (token governance, a11y, dark/light)
  - `micro-interaction-designer` (motion spec, easing system, reduced-motion, performance budgets)
- Ensure motion specs are enforceable in `/DEVELOP animate` and cross-checked by scan/fix flows.

### 3) Lower-priority additions (only if needed after metrics)
- Add missing specialized skills only where there is actual workload demand (e.g., `export-report-generator`, `app-store-optimizer`, advanced SaaS billing variants).
- Avoid adding full registry breadth now; prefer phased adoption to prevent maintenance overhead.

## Implementation Approach

### Phase A — Mapping and canonicalization
- Build a compatibility matrix: `registry-skill-id -> existing skill/agent/command -> status (covered/partial/missing)`.
- Store it under [`docs/reports/audits/`](docs/reports/audits/) as generated audit output.
- Decide canonical names and aliases to prevent duplicate behavior across skills.

### Phase B — Governance upgrades (mistake reduction)
- Add missing governance skills to `.cursor/skills/` with strict frontmatter contracts and deterministic triggers.
- Wire command/rule references so the new skills are invoked during `/plan`, `/develop`, `/fix`, `/save`.
- Add measurable acceptance checks (token budget, confidence threshold, retry ceilings, no-bypass gate checks).

### Phase C — Design and motion system upgrade
- Select one design profile from `.cursor/design/*/design.md` and copy to root `DESIGN.md`.
- Extend `DESIGN.md` with production motion spec sections (durations, easing tokens, trigger rules, reduced-motion alternatives, perf constraints).
- Align design-related skills so they consume and enforce the same `DESIGN.md` contract.

### Phase D — Validation and hardening
- Run governance checks for drift (`ai:sync` / `ai:check`) after updates.
- Verify command routing still honors current compact command surface.
- Produce final audit delta report: what was added, what was aliased, and expected impact on error rate + design quality.

## Files to touch
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/skills/`](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/skills/)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/agents/`](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/agents/)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/`](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/rules/`](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/rules/)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/DESIGN.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/DESIGN.md)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/reports/audits/`](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/reports/audits/)

## Success Criteria
- Registry coverage matrix completed with no duplicate canonical skills.
- New reliability skills active and referenced by command/rule flow.
- `DESIGN.md` exists and includes enforceable professional motion system.
- Clear reduction in orchestration ambiguity (fewer fallback/unclear routing cases).
- Audit report generated with prioritized next-wave candidates.