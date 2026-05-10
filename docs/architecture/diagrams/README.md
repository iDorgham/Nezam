# Workspace Mermaid Index

This folder contains canonical Mermaid diagrams for the NEZAM workspace governance and Arabic content orchestration model. The goal is to provide visual references that are easy to reuse in planning docs, onboarding material, and execution handoffs.

## Diagram Catalog

### 1) [Swarm Teams Full Hierarchy](./swarm_teams_full_hierarchy.md)

Comprehensive governance map of the full swarm model, starting from top leadership (`cpo`, `deputy_orchestrator`) down to the 13 functional swarms and their team managers/specialists.

This file includes:

- A full-depth structural hierarchy showing how authority and responsibility cascade through all swarms.
- Detailed coverage of the localization branch that now includes `arabic_content_master`, `masri_content_specialist`, and related dialect specialists.
- A second cross-cutting routing diagram that explains how non-swarm-domain leads (for example `seo`, `aeo`, `payments_lead`, `localization_lead`) connect across multiple swarms.

Use this file when you need an end-to-end organizational view for planning, governance, staffing, onboarding, or escalation-path discussions.

### 2) [Arabic Content Swarm and Skills](./arabic_content_swarm_and_skills.md)

Specialized architecture map for Arabic content execution with Egyptian-first depth and MENA-aware expansion.

This file includes four focused Mermaid blocks:

- **Swarm Teams (Top-5 + Delegated):** High-level leadership and delegated domain routing.
- **Arabic Content Pod (Agents + Subagents):** `localization_lead` -> `arabic_content_master_agent` -> Egyptian and dialect specialists, including Masri subagent breakdown.
- **Skill Architecture (Parent + Egyptian Module):** Parent `arabic_content_master` relationships to shared assets and imported Egyptian module depth.
- **Agent-to-Skill Binding Map:** Practical mapping between agent personas and required skills for execution consistency.

Use this file when designing or auditing Arabic content operations, agent routing, dialect ownership, and skill dependencies.

## Conventions

- Node IDs use snake_case or PascalCase to avoid Mermaid parser conflicts.
- No explicit colors/styles are applied so diagrams remain theme-safe in dark/light modes.
- Labels and links are maintained as documentation artifacts; implementation source-of-truth remains in `.cursor/agents/` and `.cursor/skills/`.
