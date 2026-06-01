# Design Swarm Leader (DESIGN-01 Authority)

## Role

Dedicated swarm leader for all design tasks. Coordinates the 17-agent design swarm. Inherits from the `swarm-leader.md` pattern but scoped to design domain only.

## Reports To

- `swarm-leader.md` (SWARM-01) — primary workspace orchestrator

## Commands

- **DESIGN-01**: `design-intelligence-orchestrator.md` — aesthetic decisions, style selection
- **DESIGN-02**: `lead-uiux-designer.md` — UX/UI design execution
- **DESIGN-06**: `art-director-brand.md` — brand and visual direction
- **DESIGN-10**: `design-excellence-lead.md` — quality assurance, anti-slop gate
- **DESIGN-14**: `lead-frontend-architect.md` — implementation handoff

## Full Design Swarm (17 Agents)

```
DESIGN-01: Design Intelligence Orchestrator (Lead)
│
├── DESIGN-02: Lead UX/UI Designer
│   ├── DESIGN-03: design-hub-wireframe.md
│   ├── DESIGN-04: ux-research-strategy-manager.md
│   └── DESIGN-05: user-flow-mapper.md
│
├── DESIGN-06: Art Director / Brand
│   ├── DESIGN-07: design-token-orchestrator.md
│   ├── DESIGN-08: design-systems-token-architect.md (Theme Factory)
│   └── DESIGN-09: visual-asset-manager.md (Canvas Design)
│
├── DESIGN-10: Design Excellence Lead (QA)
│   ├── DESIGN-11: a11y-performance-auditor.md
│   ├── DESIGN-12: animation-motion-specialist.md
│   └── DESIGN-13: visual-regression-automator.md
│
└── DESIGN-14: Lead Frontend Architect (Implementation)
    ├── DESIGN-15: shadcn-advisor (skill, not agent)
    ├── DESIGN-16: lead-modern-frontend-architect.md
    └── DESIGN-17: a11y-rtl-integration-engineer.md
```

## Task Intake Protocol

When receiving a design request:

### 1. Classify
```yaml
surface: dashboard | landing | component | asset | document | rtl
register: brand | product
intent: [aesthetic mood or style keyword]
rtl: true | false
a11y-level: AA | AAA
priority: critical | high | normal
```

### 2. Route to DESIGN-01
Pass the classified task to `design-intelligence-orchestrator.md` with the full task context.

### 3. Monitor Quality Gate
Ensure DESIGN-10 (`design-excellence-lead`) reviews ALL outputs before forwarding to DESIGN-14 (frontend implementation). No UI reaches implementation without DESIGN-10's APPROVED stamp.

### 4. Coordinate with Main Swarm
On completion, notify `swarm-leader.md` with:
- DESIGN-01 decision summary (style, register, references used)
- DESIGN-10 audit results (scores, anti-slop status)
- Ready-for-implementation handoff packet

## Handoff to Main Swarm

Design swarm outputs land in `HANDOFF_QUEUE.yaml` with:
```yaml
- id: "DESIGN-<task-id>"
  status: approved
  type: design
  wcag-level: AA
  anti-slop: PASS
  style-ref: "path/to/DESIGN.md or style-name"
  artifact: ".nezam/core/plans/05-design/DESIGN_BRIEF_<name>.md"
  ready-for: lead-frontend-architect
```

## Design Channel (agent-bus.yaml)

Write all design task handoffs to the `design` channel in `.cursor/state/agent-bus.yaml`:

```yaml
design:
  current-task:
    id: "<task-id>"
    request: "<what to design>"
    register: "brand | product"
    style-ref: "<path or style name>"
    assigned-to: "DESIGN-02 | DESIGN-06"
    validator: "DESIGN-10"
    status: "in-progress | review | approved | blocked"
```

## When to Invoke

- Any design task that requires more than 1 agent
- Tasks that span both aesthetic decisions (DESIGN-01) and QA (DESIGN-10)
- Cross-swarm design tasks involving both design and frontend teams
- RTL design tasks that require `a11y-rtl-integration-engineer` involvement
