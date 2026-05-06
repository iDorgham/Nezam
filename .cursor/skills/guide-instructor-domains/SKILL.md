---
name: guide-instructor-domains
description: Repo-grounded teaching map — which COIA paths to open for security, design, SEO, CI, and orchestration when explaining (not executing) workflows.
paths:
  - "docs/context/project.md"
  - "docs/context/workspace.md"
  - ".cursor/rules/"
  - ".cursor/skills/"
  - ".cursor/design/"
  - "plan/"
---

# Guide instructor domains (COIA)

Adapted from [`docs/reference/skills/guide_instructor_domains/skill.md`](../../../docs/reference/skills/guide_instructor_domains/skill.md). Use when teaching **where truth lives** in this repo — do not invent vendor APIs or paths from other workspaces.

## Domain → where to look

| Domain | COIA anchors |
| ------ | ------------- |
| Security / secrets | [`.github/workflows/`](../../../.github/workflows/), [`coi-security-hardening`](../coi-security-hardening/SKILL.md), [`coi-secret-management`](../coi-secret-management/SKILL.md) |
| Planning / SDD | [`plan/`](../../../plan/), [`docs/specs/prd/PRD.md`](../../../docs/specs/prd/PRD.md), [`plan-full`](../plan-full/SKILL.md) |
| Design / tokens | [`DESIGN.md`](../../../DESIGN.md), [`.cursor/design/<brand>/`](../../design/), [`design-md`](../design-md/SKILL.md), [`coi-pro-design-tokens`](../coi-pro-design-tokens/SKILL.md) |
| SEO / IA / content | [`seo-ia-content`](../seo-ia-content/SKILL.md), `docs/specs/sdd/SEO_RESEARCH.md` (when present) |
| GitHub / CI | [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml), [`git-workflow`](../git-workflow/SKILL.md), [`coi-github-actions-ci`](../coi-github-actions-ci/SKILL.md) |
| Deploy | [`coi-vercel-deploy`](../coi-vercel-deploy/SKILL.md), [`coi-devops-pipeline`](../coi-devops-pipeline/SKILL.md) |
| Agents / skills | [`.cursor/agents/README.md`](../../agents/README.md), [`.cursor/ORCHESTRATION_ALIASES.md`](../../ORCHESTRATION_ALIASES.md) |

## Anti-patterns

- Pointing at `factory/`, `.ai/plan/`, or Antigravity-only paths unless this repo adds them.
- Storing durable teaching state only in chat — persist in `docs/context/MEMORY.md` or specs when decisions stick.

## Reference provenance

Upstream instructor map: [`docs/reference/skills/guide_instructor_domains/skill.md`](../../../docs/reference/skills/guide_instructor_domains/skill.md).
