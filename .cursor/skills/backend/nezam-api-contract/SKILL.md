---
skill_id: nezam-api-contract
name: "nezam-api-contract"
description: OpenAPI 3.1, contract-first vs code-first, versioning, Zod→OpenAPI, error envelopes, pagination, rate limits, Arabic/i18n errors.
version: 1.0.0
updated: 2026-05-12
changelog: []
owner: api-logic-manager
tier: 3
sdd_phase: Development
rtl_aware: true
certified: false
dependencies: []
---
# API contract (backend/api-contract)

## Purpose

Govern HTTP APIs from **Planning** (contract freeze) through **Development** (handler fidelity): **OpenAPI 3.1** authoring, **contract-first** vs **code-first**, **versioning** (`/v1/`, `/v2/`), **breaking change** detection, **Zod → OpenAPI** generation where applicable, **error envelope** standardization, **pagination** (cursor vs offset), **rate limit** response headers, and **Arabic / i18n** error message structure.

## Trigger Conditions

- New public or partner API surface; major version bump; mobile + web consumers need stable types.
- Contract drift between server and clients detected in CI.

## Prerequisites

- Domain nouns and error taxonomy agreed with product/security.
- Auth scheme (Bearer, cookies, mTLS) fixed for documented security schemes.

## Procedure

1. **OpenAPI 3.1**
   - Single source of truth (`openapi.yaml` or generated from Zod); components for reusable schemas.
2. **Contract-first vs code-first**
   - **Contract-first** for multi-consumer or regulated APIs; review before codegen.
   - **Code-first** only with enforced codegen of OpenAPI in CI (fail on diff).
3. **Versioning**
   - URI prefix `/v{n}/` or explicit gateway routing; deprecation headers and sunset dates in spec extensions.
4. **Breaking changes**
   - Semver policy: additive optional fields OK; removing/renaming requires new major or compatibility window.
5. **Zod → OpenAPI**
   - Share runtime validation with generated types; document nullable vs optional distinctions.
6. **Error envelope**
   - Prefer RFC 9457 `application/problem+json` with stable `type` URIs; map domain codes to HTTP status consistently.
7. **Pagination**
   - **Cursor** for large/unbounded sets (opaque cursor, stable sort key); **offset** only for small admin lists.
8. **Rate limits**
   - Return `Retry-After`, `RateLimit-*` headers where supported; document burst vs sustained.
9. **Arabic / i18n errors**
   - Machine-readable `code` + locale-negotiated `detail`; **RTL-safe** rendering: avoid embedding LTR technical tokens inside Arabic without isolates; provide `locale` query or `Accept-Language` behavior in spec.

## Output Artifacts

- OpenAPI bundle under repo-standard path (e.g. `docs/specs/api/` or `packages/api/`) and changelog entry.

## Validation Checklist

- [ ] Spectral (or equivalent) passes with zero blocking rules
- [ ] Every route lists security requirement and error responses
- [ ] i18n: error payload schema allows Arabic without breaking clients (UTF-8, length limits)

## Handoff Target

- `lead-backend-architect` for cross-cutting API standards.
- `backend/api-design` skill for deeper REST/GraphQL pattern work where both apply, keep contracts synchronized.
