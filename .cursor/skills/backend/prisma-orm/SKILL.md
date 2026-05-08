---
name: coi-prisma-orm
description: Prisma 6 schema, migrations, type-safe client, seeding, and relations for typed database access.
version: 1.0.0
updated: 2026-05-08
breaking_changes: false
changelog:
  - version: 1.0.0
    date: 2026-05-08
    notes: "Initial version metadata added with Prisma 6 note."
compatible_with:
  - react: ">=18"
  - next: ">=14"
  - node: ">=20"
---

# Purpose

Specify the Prisma 6 schema, migration policy, seeding strategy, and client usage so the database is the typed source of truth. Single-responsibility: ORM schema + migration discipline.

# Inputs

- Domain model + entity inventory from `docs/core/required/sdd/` and `@.cursor/skills/coi-content-modeling/SKILL.md`.
- API contract from `@.cursor/skills/coi-api-design/SKILL.md`.
- Performance constraints from `@.cursor/skills/coi-database-optimization/SKILL.md`.
- Hosting target (Postgres, MySQL, SQLite, MongoDB) and Prisma 6 capabilities.

# Step-by-Step Workflow

1. Author `prisma/schema.prisma` with datasource, generator, models, enums, indexes, relations.
2. Use Prisma 6 features: typed JSON, multi-file schema, optimized client (`prismaClientExtensions`), driver adapters where appropriate.
3. Add explicit `@@index`, `@@unique`, `@relation` references; avoid implicit n:m without justification.
4. Create migrations: `prisma migrate dev` locally; `prisma migrate deploy` in CI for production.
5. Seed strategy: `prisma db seed` with deterministic fixtures per environment; never seed prod.
6. Generate client: `prisma generate`; commit types or rely on postinstall.
7. Define query patterns: select narrow fields, use `findMany` with cursor pagination, batch with `$transaction`.

# Validation & Metrics

- Schema validates: `prisma validate` (zero errors).
- Migration history is linear; squashed migrations only at major boundaries.
- Generated client up-to-date with schema in CI.
- Slow-query log shows no Prisma N+1 patterns.
- Seed scripts idempotent and environment-aware.

# Output Format

- `prisma/schema.prisma`.
- `prisma/migrations/*` (versioned).
- `prisma/seed.ts` (procedure spec).
- Query pattern guide (markdown).
- ER diagram (mermaid or `prisma-erd-generator`).

# Integration Hooks

- `/PLAN db` consumes schema.
- `/DEVELOP` runs migrations and queries (without writing app code here).
- `/SCAN perf security` audits queries and exposure.
- Pairs with `@.cursor/skills/coi-database-optimization/SKILL.md`, `@.cursor/skills/coi-api-design/SKILL.md`.
- Honors `[.cursor/rules/workspace-orchestration.mdc](.cursor/rules/workspace-orchestration.mdc)`.

# Anti-Patterns

- Schema drift between dev DB and migrations.
- N+1 queries via nested `include` chains without selection.
- `findFirst` used as `findUnique` (loses index hint).
- Seeding production from `prisma db seed`.
- Editing applied migrations after they shipped.

# External Reference

- Prisma 6 docs (https://www.prisma.io/docs) — current.
- Prisma migration guide (https://www.prisma.io/docs/orm/prisma-migrate) — current.
- Prisma Optimize / Pulse (where applicable, current).
- Closest skills.sh/official analog: prisma-orm / database-orm.
