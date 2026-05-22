# PROJECT_PROMPT — {{PROJECT_NAME}}

> **This file is read by every AI agent before touching any code or spec.**
> It defines the product contract, decision rules, forbidden patterns, and
> acceptance criteria. Agents that ignore this file produce incorrect output.

---

## 1. Product North Star

> One precise paragraph. Paste this verbatim into any AI tool to establish context.

{{PROJECT_NAME}} is a {{PRODUCT_TYPE}} that helps {{TARGET_PERSONA}} to {{CORE_JOB_TO_BE_DONE}}.
It differs from {{MAIN_COMPETITOR}} by {{KEY_DIFFERENTIATOR}}.
Built for {{TARGET_MARKET}} market. Primary language: {{PRIMARY_LANGUAGE}}.
Stack: {{STACK_SUMMARY}}. Repo: {{GITHUB_REPO_URL}}.

---

## 2. Project Identity

| Field | Value |
|---|---|
| Product Name | {{PROJECT_NAME}} |
| GitHub Repo | {{GITHUB_REPO_URL}} |
| Primary Language | {{PRIMARY_LANGUAGE}} |
| Target Market | {{TARGET_MARKET}} |
| PRD File | `docs/plan/00-define/01-product/PRD.md` |
| Design Contract | `DESIGN.md` |
| Architecture Spec | `docs/plan/00-define/03-architecture/ARCHITECTURE.md` |

---

## 3. Tech Stack Contract

> These decisions are locked. Do not propose alternatives without a formal ADR.

### Frontend
- Framework: {{e.g. Next.js 14 App Router}}
- Styling: {{e.g. Tailwind CSS + CSS Variables for tokens}}
- State management: {{e.g. Zustand for client state, TanStack Query for server state}}
- Component library: {{e.g. shadcn/ui — customized, not ejected}}
- Forms: {{e.g. React Hook Form + Zod}}
- Routing: {{e.g. Next.js file-based routing}}

### Backend
- Runtime: {{e.g. Node.js 20 / Edge Runtime}}
- API style: {{e.g. REST | tRPC | GraphQL}}
- Database: {{e.g. PostgreSQL via Supabase}}
- ORM: {{e.g. Prisma}}
- Auth: {{e.g. NextAuth.js v5 / Supabase Auth}}
- File storage: {{e.g. Supabase Storage / S3}}
- Email: {{e.g. Resend}}

### Infrastructure
- Hosting: {{e.g. Vercel}}
- CI/CD: {{e.g. GitHub Actions}}
- Monitoring: {{e.g. Sentry}}
- Analytics: {{e.g. PostHog}}

---

## 4. Data Architecture Summary

> Key entities and their relationships. Full schema in PRD Section 6.

```
{{ENTITY_1}} ({{primary key}})
  ├── has many {{ENTITY_2}} (via {{foreign_key}})
  └── belongs to {{ENTITY_3}} (via {{foreign_key}})

{{ENTITY_2}} ({{primary key}})
  └── has many {{ENTITY_4}}
```

**Database naming conventions:**
- Tables: `snake_case` plural (e.g. `user_profiles`)
- Columns: `snake_case` (e.g. `created_at`)
- IDs: UUID v4 everywhere
- Timestamps: always `created_at` + `updated_at`, UTC

---

## 5. Feature Spec Index

> Every feature has a spec file. Agents MUST read the relevant spec before implementing.
> Do not implement anything not listed here.

| ID | Feature | Spec File | Status |
|---|---|---|---|
| F-001 | {{FEATURE_NAME}} | `docs/plan/00-define/specs/F-001-{{slug}}.md` | {{draft/approved/built}} |
| F-002 | {{FEATURE_NAME}} | `docs/plan/00-define/specs/F-002-{{slug}}.md` | {{draft/approved/built}} |

---

## 6. Agent Decision Rules

> When faced with ambiguity, agents follow these rules in order. No exceptions.

### 6.1 Before writing ANY code
1. Read `DESIGN.md` — use design tokens, not hardcoded values
2. Read the relevant feature spec in `docs/plan/00-define/specs/`
3. Check `docs/plan/00-define/01-product/PRD.md` Section 8 for screen states
4. If the spec is missing or ambiguous — STOP and ask, do not guess

### 6.2 When uncertain, prefer
- **Simpler over cleverer** — the simplest implementation that satisfies the spec
- **Explicit over implicit** — no magic, no convention-over-configuration surprises
- **Existing patterns** — check how similar things are already done in the codebase first
- **Spec IDs in commits** — `feat(F-001): add user registration form`

### 6.3 Forbidden patterns
- ❌ Hardcoded colors, font sizes, or spacing values — use design tokens
- ❌ `any` type in TypeScript — use proper types or `unknown`
- ❌ Inline styles — use Tailwind classes or CSS modules
- ❌ Direct database calls from frontend components
- ❌ Secrets or API keys in client-side code
- ❌ `console.log` in production code — use structured logging
- ❌ Components longer than 200 lines — split them
- ❌ Implementing features not in the Feature Registry — propose first

### 6.4 When a screen state is not handled
Every screen must handle: loading, empty, error, populated, offline.
If a state is not in the spec, implement a sensible default AND flag it:
```
// TODO(spec-gap): offline state not defined in PRD F-001 — using generic fallback
```

---

## 7. UI/UX Contract

### 7.1 Design System Rules
- Design tokens live in `DESIGN.md` — source of truth
- Color variables: `var(--color-*)` — never raw hex in components
- Typography scale: defined in `DESIGN.md` — use named sizes, not `text-sm`
- Spacing: 4px base grid — use Tailwind spacing scale
- Dark mode: every component must have light + dark variant
- RTL: {{YES — all components must support dir="rtl" | NO}}

### 7.2 Navigation Rules
- Active state: {{how the active nav item is shown}}
- Mobile navigation: {{sidebar collapses to | bottom tab | hamburger}}
- Breadcrumbs: {{required on | not used}}
- Back button behavior: {{browser back | custom logic}}

### 7.3 Form Rules
- Validation: client-side on blur + server-side on submit
- Error display: inline under the field, not in a toast
- Required fields: marked with `*` and `aria-required="true"`
- Loading state: disable submit button + show spinner while submitting
- Success state: {{redirect to X | show success message | clear form}}

### 7.4 Empty States
Every list view must have an empty state with:
- Illustration or icon
- Descriptive message (not just "No items found")
- Primary CTA to create the first item

---

## 8. API Contract Rules

- All API routes live under `/api/`
- Authentication: attach `Authorization: Bearer <token>` header
- Error format: always `{"error": "human-readable message", "code": "MACHINE_CODE"}`
- Success format: always `{"data": {...}}` or `{"data": [...]}`
- Pagination: cursor-based, `{"data": [...], "nextCursor": "...", "hasMore": true}`
- Never return raw database errors to the client
- Rate limit headers: include `X-RateLimit-Remaining` on all responses

---

## 9. Acceptance Criteria Reference

> Per-feature acceptance criteria. Detailed criteria live in each feature spec.
> This is the summary that agents check before marking work done.

| Feature ID | "Done" means |
|---|---|
| F-001 | {{ACCEPTANCE_SUMMARY}} |
| F-002 | {{ACCEPTANCE_SUMMARY}} |

---

## 10. Performance Budget

| Metric | Budget | Measured by |
|---|---|---|
| LCP | < {{MS}}ms | Lighthouse |
| FID / INP | < {{MS}}ms | Core Web Vitals |
| CLS | < 0.1 | Core Web Vitals |
| JS bundle (initial) | < {{KB}}KB | next build output |
| API p95 | < {{MS}}ms | Server logs |

---

## 11. Security Checklist (pre-deploy)

- [ ] All user inputs sanitized and validated server-side
- [ ] SQL injection: impossible (parameterized queries only)
- [ ] XSS: CSP headers configured, no `dangerouslySetInnerHTML` without sanitization
- [ ] CSRF: tokens on all state-mutating requests
- [ ] Auth: JWT expiry enforced, refresh token rotation enabled
- [ ] Secrets: none in codebase, all in environment variables
- [ ] Rate limiting: applied to all auth and mutation endpoints
- [ ] OWASP Top 10: reviewed and addressed

---

## 12. Content & Voice

- **Tone:** {{e.g. professional but friendly, no jargon}}
- **Language:** {{PRIMARY_LANGUAGE}} primary, {{SECONDARY_LANGUAGE}} secondary
- **Product name in UI:** always "{{PROJECT_NAME}}" — never abbreviated
- **Error messages:** plain language, always tell user what to do next
- **Empty states:** encouraging, not just informative
- **RTL strings:** {{use i18n library | hardcoded per language}}

---

## 13. File & Folder Conventions

```
src/
├── app/              ← Next.js App Router pages
├── components/
│   ├── ui/           ← Base design system components (shadcn)
│   └── features/     ← Feature-specific components
├── lib/
│   ├── api/          ← API client functions
│   ├── db/           ← Database queries (Prisma)
│   └── utils/        ← Pure utility functions
├── hooks/            ← Custom React hooks
├── store/            ← Zustand stores
└── types/            ← Shared TypeScript types
```

**Naming conventions:**
- Components: `PascalCase.tsx`
- Hooks: `useFeatureName.ts`
- Utils: `camelCase.ts`
- API routes: `route.ts` in `app/api/` directory

---

## 14. Commit & Branch Convention

- Branch: `feat/F-001-user-registration`, `fix/F-002-booking-validation`
- Commit: `feat(F-001): add registration form with email validation`
- PR title must reference feature ID: `[F-001] User Registration`
- Never commit to `main` directly — all changes via PR

---

## 15. How to Use This File

**For planning agents:** Read Sections 3, 4, 5 before generating tasks.
**For frontend agents:** Read Sections 6, 7, 13 before writing any component.
**For backend agents:** Read Sections 3, 6.3, 8 before writing any route.
**For QA agents:** Read Sections 9, 11 to validate completion.
**For any agent:** If your task is not in Section 5, stop and ask the user first.
