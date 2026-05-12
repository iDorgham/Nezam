---
name: "nezam-neon-postgres"
description: Serverless Postgres operations with branching and preview-safe workflows.
version: 1.0.0
updated: 2026-05-10
changelog: []
---

# Neon Postgres
## Purpose
Guide safe Neon Postgres adoption for branch-based database workflows and scalable production environments.

## Inputs Required
- Neon project and environment mapping (dev, preview, prod).
- Branching strategy for feature and release workflows.
- Migration plan and schema ownership details.
- Connection security requirements.

## Step-by-Step Workflow
1. Define branch strategy aligned to git workflow.
2. Provision branch-specific connection strings for app environments.
3. Apply and verify migrations on preview branches before production.
4. Validate performance and query behavior under expected load.
5. Promote approved schema changes through release gates.
6. Document operational runbook for branch lifecycle and cleanup.

## Validation Checks
- Preview branches map cleanly to pull request lifecycle.
- Migration sequence is reproducible across branches.
- Production credentials are isolated from preview contexts.
- Rollback path exists for schema regressions.

## Output Format
- Environment and branch mapping matrix.
- Migration execution and validation log.
- Operational checklist for release promotion.

## Integration Hooks (which agents use this)
- `lead-database-architect`
- `devops-manager`

## Anti-Patterns
- Reusing production credentials in preview branches.
- Long-lived stale branches without cleanup ownership.
- Applying schema changes directly in production first.

## External References (official docs URL from tech stack)
- https://neon.tech/docs
