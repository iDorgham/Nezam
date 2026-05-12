---
skill_id: "backend/neon-advanced"
name: "neon-advanced"
description: "Advanced Neon Postgres patterns: database branching, serverless pooling, egress optimization, and ephemeral environments."
version: 1.0.0
updated: 2026-05-12
changelog:
  - version: 1.0.0
    date: 2026-05-12
    notes: "Initial Wave 2 implementation."
owner: "database-design-manager"
tier: 1
sdd_phase: "Architecture"
rtl_aware: false
certified: true
dependencies: ["backend/neon-postgres", "infrastructure/devops-pipeline"]
---

# Advanced Neon Postgres

## Purpose

Implement advanced Neon Postgres architectures for serverless environments. Covers branching strategies, serverless connection pooling, egress cost optimization, and claimable Postgres instances for ephemeral testing environments.

## Trigger Conditions

- CI/CD pipeline requires database cloning for testing (Preview environments).
- Edge computing platforms (e.g., Cloudflare Workers, Vercel Edge) need database access.
- High connection concurrency issues.
- Egress costs need optimization.

## Prerequisites

- Neon project provisioned.
- `DATABASE_URL` securely configured.

## Procedure

1. **Branching Strategy:** Implement Neon's branching API in the CI/CD pipeline. Automatically create a database branch for every pull request, seeded with parent data, and drop it on merge.
2. **Serverless Pooling:** Use Neon's serverless connection string (via PgBouncer/WebSocket) when connecting from Edge functions or Serverless functions to prevent connection exhaustion.
3. **Egress Optimization:** 
   - Optimize queries to return only required columns.
   - Deploy compute endpoints in the same region as the application hosting to minimize cross-region egress costs.
   - Utilize read replicas for heavy analytical queries off the primary compute.
4. **Ephemeral DBs:** Use claimable Postgres patterns for fast, isolated integration tests without managing cleanup manually.

## Output Artifacts

- CI/CD scripts for Neon database branching.
- Database connection configuration files (Serverless driver setup).
- Architecture diagram showing compute regions and connection pools.

## Validation Checklist

- [ ] PR environments automatically provision and destroy Neon branches.
- [ ] Serverless environments use the connection pooler.
- [ ] Application and database compute are in the same region.
- [ ] Integration tests run against ephemeral, isolated databases.

## Handoff Target

`quality/github-actions-ci` for pipeline integration, or `backend/prisma-orm` / `backend/drizzle-orm` for schema management on branches.
