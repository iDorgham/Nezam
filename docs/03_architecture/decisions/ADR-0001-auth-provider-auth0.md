# ADR-0001 — Authentication Provider: Auth0

- **Status:** Proposed
- **Date:** 2026-05-09
- **Owners:** `auth-security-manager`, `app-security-manager`, `lead-security-officer`
- **Reviewers:** `lead-solution-architect`, `lead-backend-architect`, `lead-frontend-architect`, `mena-payments-specialist`, `rtl-specialist`, `compliance-manager`
- **Supersedes:** —

## 1. Context

NEZAM targets MENA SaaS scenarios with first-class Arabic / RTL, multi-tenant
white-labeling, payments adjacency, and explicit compliance gates (see
`docs/process/RELEASE-APPROVAL-PROTOCOL.md`, `auth-security-manager.md`,
`mena-payments-specialist.md`, `white-label-theming-specialist.md`,
`lead-ai-ethics-officer.md`). Sub-phase `04-build/04-integrations` currently has
no concrete identity solution selected. We need a decision before the SDD
hardlock allows `/DEVELOP` on user-facing surfaces.

Constraints driving this ADR:

1. Arabic-first Universal Login + RTL email templates must be supported on day one.
2. Tenant isolation: each white-label brand maps to a tenant boundary with its
   own login UI, IdP connections, and (eventually) custom domain.
3. Step-up MFA is mandatory for sensitive actions (payment management, role
   changes, data export) per `compliance-manager` and `app-security-manager`.
4. Migration off legacy/custom auth must remain possible without forcing a
   password reset wave on existing users.
5. Frontend stack is not yet locked but design/perf gates (`.lighthouserc.json`,
   Vercel-leaning tooling) make Next.js App Router the default working
   assumption; mobile (iOS/Android) is on the roadmap.

## 2. Decision

Adopt **Auth0** as the workspace-wide identity provider. Lock SDK choice per
runtime as follows; deviations require a new ADR:

| Surface | SDK | Notes |
| --- | --- | --- |
| Web app (default Next.js App Router) | `@auth0/nextjs-auth0` | Server Components, middleware-based route protection, server-action friendly. |
| Web fallback (Vue/Nuxt brand sites) | `@auth0/auth0-vue` or `@auth0/auth0-nuxt` | Only if a brand explicitly opts out of Next.js. |
| Backend APIs (Node) | `express-oauth2-jwt-bearer` | JWT Bearer validation, scope-based RBAC, optional DPoP. |
| iOS native (planned) | `Auth0.swift` | Web Auth + `CredentialsManager` with biometrics. |
| Android native (planned) | `com.auth0.android:auth0` | Web Auth + biometric-protected credential store. |
| Cross-platform mobile (if Expo) | `react-native-auth0` via Expo Config Plugin | Use `auth0-expo` flow, not bare RN. |

Multi-tenancy uses **Auth0 Organizations**: one Auth0 tenant, one Organization
per white-label brand, brand domain → Organization mapped at the proxy layer.
This keeps token issuer + JWKS uniform while isolating users, connections, and
branding per tenant.

## 3. Required Capabilities (mapped to Auth0 features)

| NEZAM requirement | Auth0 mechanism |
| --- | --- |
| Arabic Universal Login | Universal Login + locale `ar` + RTL CSS overrides; email templates per language. |
| White-label per tenant | Organizations + custom domains + per-Organization branding + connection scoping. |
| Step-up for payments / role changes | ACR-based step-up via `auth0-mfa` patterns (TOTP, push, passkeys). |
| Compliance (HIPAA/PCI tone) | MFA enforcement policies, anomaly detection, log streams to SIEM. |
| Migration off legacy auth | Lazy migration (custom DB connection) per `auth0-migration`; no forced reset. |
| Scope-based API authorization | Audience-locked access tokens validated by `express-oauth2-jwt-bearer`. |

## 4. Non-Goals

- Building a custom username/password store.
- Self-hosted Keycloak / FusionAuth (re-evaluate only if data residency rules
  later forbid Auth0 regional hosting for a specific tenant).
- Auth0 Actions for arbitrary business logic — keep them limited to identity
  concerns (claims shaping, MFA gating, anomaly hooks).

## 5. Alternatives Considered

1. **Clerk** — strong DX, weaker MENA/RTL Universal Login story and weaker
   enterprise Organizations + custom domain story for white-label.
2. **Supabase Auth** — fine for greenfield single-tenant; multi-tenant
   white-label and step-up patterns require significant custom work.
3. **Cognito** — cost-effective but Universal Login customization, MFA UX, and
   migration tooling are materially weaker.
4. **Roll-your-own** — rejected; would re-litigate every gate in
   `app-security-manager` and `lead-security-officer`.

## 6. Consequences

**Positive**

- Unblocks SDD `04-build/04-integrations` PT-03-01-* tasks once linked.
- Unifies web + mobile auth behind one issuer; backend validation is one code
  path (`express-oauth2-jwt-bearer`).
- MENA/RTL and white-label requirements satisfied without custom UI scaffolding.

**Negative / Risks**

- Vendor concentration on identity. Mitigation: keep all integration code
  behind a thin internal `@nezam/auth` package so the SDK is replaceable.
- Auth0 cost scales with MAU. Mitigation: monitor via `cost-optimization-analyst`
  and enable token caching in middleware.
- Custom domains and Organizations require Auth0 paid tier features. Mitigation:
  budgeted in infra plan; gate brand onboarding through `saas-platform-manager`.

## 7. Implementation Plan (handoff to `/DEVELOP`)

`/DEVELOP` MUST run the `auth0-quickstart` skill at integration kickoff so the
SDK install matches the locked-in stack at that moment. Required output:

1. `@nezam/auth` workspace package wrapping `@auth0/nextjs-auth0` (web) and
   `express-oauth2-jwt-bearer` (API).
2. Middleware-based protected routes; server-action helpers for sign-in/out.
3. MFA policy via `auth0-mfa`: TOTP + WebAuthn passkeys; step-up required for
   payment + admin scopes.
4. Custom DB connection stub for `auth0-migration` lazy migration if a legacy
   user store is imported later.
5. Sentry + Datadog (or chosen observability) wired to Auth0 log streams via
   `observability-specialist`.

## 8. Open Questions

- Final brand → Organization mapping rules (owned by `saas-platform-manager`).
- Whether to expose passwordless email/SMS for Egyptian and Gulf phone numbers
  (input from `mena-payments-specialist` and `khaleeji-specialist`).
- Token lifetimes and refresh strategy for long-running CMS editor sessions
  (input from `cms-manager`).

## 9. References

- Plugin skills: `auth0-quickstart`, `auth0-nextjs`, `auth0-mfa`,
  `auth0-migration`, `express-oauth2-jwt-bearer`, `auth0-swift`, `auth0-android`.
- Workspace rules: `.cursor/rules/workspace-orchestration.mdc`,
  `.cursor/rules/design-dev-gates.mdc`.
- Plans: `docs/workspace/plans/04-build/04-integrations/TASKS.md`.
