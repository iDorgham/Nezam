# Agents Directory

All agents use `kebab-case` naming. No prefixes, no numeric codes.

## Swarm Core (5 leads)
| File | Role |
|---|---|
| swarm-leader.md | PM-01: task routing, acceptance gates, handoff sequencing |
| project-architect.md | ARCH-01: architectural governance, canonical-path enforcement |
| design-lead.md | DESIGN-01: design-system, token, a11y, motion quality |
| frontend-lead.md | FE-01: component implementation, UI library integration |
| backend-lead.md | BE-01: API contracts, data, integrations |

## Deputy & Controllers
| File | Role |
|---|---|
| deputy-swarm-leader.md | Deputy orchestration and cross-swarm coordination |
| subagent-controller.md | Subagent routing, quality gates, and execution depth |
| client-onboarding-agent.md | New client/project intake and onboarding gate owner |

## New Agents (Active)

| File | Role |
|---|---|
| spec-writer.md | Spec Writer — generates SPEC.md per feature slice |
| prompt-engineer.md | Prompt Engineer — owns prompt quality and eval |
| client-onboarding-agent.md | Client Onboarding — runs workspace intake gate |

## Archived Agents

| File | Reason | Absorbed by |
|---|---|---|
| archive/bias-fairness-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
| archive/privacy-data-ethics-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
| archive/ai-safety-misuse-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
| archive/ip-copyright-ethics-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
| archive/ai-sustainability-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
| archive/transparency-explainability-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
| archive/knowledge-sharing-agent.md | Merged into knowledge-update-manager | knowledge-update-manager |
| archive/data-engineer.md | Merged into data-pipeline-manager | data-pipeline-manager |
| archive/react-component-lead.md | Merged into frontend-framework-manager | frontend-framework-manager |
| archive/prototyping-design-system-manager.md | Merged into design-systems-token-architect | design-systems-token-architect |

## Lead Architects
All files prefixed with `lead-`: 12 senior domain architects

## Specialists
Domain specialists organized alphabetically. All use `<domain>-<role>.md` pattern.

## Adding a new agent
Run: /CREATE agent
