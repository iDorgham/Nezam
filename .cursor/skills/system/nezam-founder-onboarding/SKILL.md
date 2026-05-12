---
name: nezam-founder-onboarding
description: Convert a plain-language founder idea into complete gate-ready project artifacts without requiring technical ceremony.
version: 1.0.0
updated: 2026-05-08
changelog: []
---
# Purpose
Convert a plain-language product idea into a complete, gate-passing artifact set without requiring the user to understand internal development frameworks, document templates, or naming conventions.

# Inputs
- Seven interview answers gathered by `/start` onboarding (interview path) or `/plan idea`.
- Existing workspace context and active repository state.
- Available design profiles under `.nezam/design/*/design.md`.

# Step-by-Step Workflow
1. Parse the seven answers and extract:
   - product category
   - target user persona
   - geography/market
   - problem statement
   - revenue model
   - timeline
   - competitive context
2. Classify product type as one of:
   - Website
   - Web Application
   - Mobile Application
   - SaaS
   - API
   - CLI
   - Other
3. Detect MENA context. If geography or wording indicates Egypt, Saudi Arabia, UAE, Jordan, Morocco, Iraq, Tunisia, Kuwait, Bahrain, Qatar, Oman, or Arabic content:
   - set MENA mode
   - flag RTL requirement
   - recommend `arabic_content_master`
   - surface `mena_payment_routing`
   - prioritize design profiles with RTL suitability
4. Generate `docs/prd/PRD.md` with sections:
   - Executive Summary
   - Problem Statement
   - Target Users
   - Jobs To Be Done
   - Product Scope
   - MVP Definition
   - Out of Scope
   - Success Metrics
   - Technical Constraints
   - Market Context
   - Risk Register (3–5 items)
   - Timeline Estimate
5. Generate aligned `docs/prd/PROJECT_PROMPT.md` with no conflicting scope framing.
6. Generate `.nezam/workspace/VERSIONING.md` (if it doesn't already exist) with:
   - release numbering rules
   - commit message policy
   - changelog policy
7. Initialize root `CHANGELOG.md` with `## [Unreleased]`.
8. Score all `.nezam/design/*/design.md` profiles against product type, geography, revenue model, and audience characteristics; return top 3 with plain-language rationale.
9. After the user chooses a profile, copy the selected design file to root `DESIGN.md`.
10. Generate companion-ready `.nezam/workspace/context/CONTEXT.md`.
11. Generate initial memory summary in `.nezam/workspace/context/MEMORY.md`.
12. Validate readiness using `/START gates` checks and report outcome in plain language only.

# Validation & Metrics
- All six generated artifacts exist and are non-template:
  - PRD
  - project prompt
  - versioning doc
  - changelog
  - context doc
  - memory doc
- PRD and project prompt are aligned in scope and intent.
- Root `DESIGN.md` is copied from a valid `.nezam/design/*/design.md` source after explicit user selection.
- Gate readiness checks pass or include clear plain-language remediation.

# Output Format
- Founder-facing output:
  - concise plain-language summary
  - top 3 design profile recommendations with one-line reasoning
  - clear next step card
- Technical diagnostic output (when needed) inside:
  - `Technical detail (for developers)` collapsible blocks only

# Integration Hooks
- Primary invoker: `/start` (onboarding) or `/plan idea`.
- Gate validation path: `/START gates`.
- Status surfacing: `/start gates`, `/guide status`, and `/GUIDE status`.
- MENA handoff: `/START mena` when regional/Arabic signals are present.

# Anti-Patterns
- Do not ask the user to manually fill templates.
- Do not expose internal file paths in default founder-facing output.
- Do not use internal jargon in plain output:
  - hardlock
  - subphase
  - prompt artifact
  - SDD
  - SemVer
- Do not skip MENA detection when region/language requires it.
- Do not overwrite `DESIGN.md` until the user confirms profile choice.

# External Reference
- Internal command contract: `.cursor/commands/start.md` and `.cursor/commands/plan.md`.
- Workspace gating contract: `.cursor/commands/start.md` (`gates`).
- Design profile source: `.nezam/design/*/design.md`.
