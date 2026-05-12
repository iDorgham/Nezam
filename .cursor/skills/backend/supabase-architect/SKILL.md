---
skill_id: "backend/supabase-architect"
name: "supabase-architect"
description: "Postgres RLS, Auth flows, Realtime, Edge Functions, and schema management for Supabase-backed apps."
version: 1.1.0
updated: 2026-05-12
changelog:
  - version: 1.1.0
    date: 2026-05-12
    notes: "Wave 2 Upgrade: Added advanced RLS security, JWT handling, security_invoker, and view bypass mitigations."
  - version: 1.0.0
    date: 2026-05-08
    notes: "Initial version metadata added."
owner: "database-design-manager"
tier: 1
sdd_phase: "Quality"
rtl_aware: false
certified: true
dependencies: ["backend/prisma-orm", "quality/security-hardening"]
---

# Supabase Architect

## Purpose

Architect Supabase usage: schema with Row-Level Security (RLS), auth providers, Realtime subscriptions, Edge Functions, Storage buckets, and migration discipline. Secures against RLS traps, JWT vulnerabilities, view bypass, service-role exposure, and session invalidation edge cases for NEZAM multi-tenant SaaS.

## Trigger Conditions

- Database schema generation or migration.
- RLS policy definition or audit.
- Authentication or JWT handling implementation.

## Prerequisites

- Domain model from `@.cursor/skills/backend/prisma-orm/SKILL.md` or direct Postgres schema drafts.
- API contract from `@.cursor/skills/backend/api-design/SKILL.md`.

## Procedure

1. **Schema & Roles:** Define Postgres schema with explicit roles (`anon`, `authenticated`, `service_role`).
2. **Advanced RLS:** Enable RLS on every user-data table. Avoid RLS traps: ensure `security_invoker` is used on views to prevent RLS bypass.
3. **JWT Security:** Validate custom JWT claims strictly. Handle session invalidation edge cases across distributed services.
4. **Auth & Hooks:** Configure Auth providers and post-signup hooks safely (run hooks with `security_definer` carefully, minimizing privilege).
5. **Storage:** Set up Storage buckets with explicit RLS policies, restricting public access.
6. **Migrations:** Use `supabase` CLI for migrations (`supabase migration new`, `supabase db push`). Never alter schema outside migrations.
7. **Edge Functions:** Use Edge Functions for logic requiring `service_role`. Never expose the service-role key client-side.

## Output Artifacts

- `supabase/migrations/<timestamp>_*.sql`.
- `supabase/seed.sql`.
- RLS policy catalogue (markdown).
- `supabase/config.toml`.
- Generated `database.types.ts`.

## Validation Checklist

- [ ] 100% of user-data tables have RLS enabled.
- [ ] Views use `security_invoker = true` to prevent RLS bypass.
- [ ] No `service_role` key shipped to client.
- [ ] Migrations are idempotent and reversible.
- [ ] Realtime payloads exclude sensitive PII.

## Handoff Target

`/DEVELOP` for running migrations, or `/SCAN security` for RLS validation.
