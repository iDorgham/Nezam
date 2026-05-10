/DEVELOP — Build, implement, and iterate on features

Subcommands:
  /DEVELOP start    → Session kickoff: confirm branch, spec, design profile, env keys
  /DEVELOP ui       → Build frontend components, pages, layouts (uses design tokens, RSC)
  /DEVELOP api      → Build backend routes, services, data access layer
  /DEVELOP db       → Schema migrations, Supabase RLS, Prisma models
  /DEVELOP feature  → Implement a full vertical feature slice end-to-end
  /DEVELOP cms      → Headless CMS integration and content modeling
  /DEVELOP auth     → Authentication and authorization flows
  /DEVELOP payments → Payment gateway integration (Stripe, MENA regional providers)
  /DEVELOP animate  → Motion and micro-interaction implementation
  /DEVELOP review   → Pre-merge readiness check against DESIGN.md + acceptance criteria
  /DEVELOP audit    → Lightweight implementation audit: TODOs, debt, env assumptions

Aliases: /DEVELOP fe → /DEVELOP ui | /DEVELOP be → /DEVELOP api | /DEVELOP slice → /DEVELOP feature

Hard block: All 10 SDD prerequisites must pass (PRD, PROJECT_PROMPT, CHANGELOG, VERSIONING,
            ARCHITECTURE, DESIGN.md, GATE_MATRIX, subphase prompt artifacts).
Gate failure → /GUIDE status shows exact unlock steps.
Recommendation footer: required

### Spec Version Check (runs before every /DEVELOP feature)
1. Read the `SPEC.md` for the target feature.
2. Confirm `status: approved` — if `draft`, halt and ask user to approve first.
3. Record `built_at_version` in `SPEC.md` from current `CHANGELOG.md` top version.
4. Bump `spec_version` patch on any amendment (e.g. 0.1.0 → 0.1.1).
5. Bump `spec_version` minor on acceptance criteria changes (e.g. 0.1.0 → 0.2.0).
6. Bump `spec_version` major on scope changes that require design rework (e.g. 0.1.0 → 1.0.0).
