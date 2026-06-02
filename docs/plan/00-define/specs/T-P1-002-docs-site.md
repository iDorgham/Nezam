---
feature_id: T-P1-002
spec_version: 0.1.0
status: approved
built_at_version: "[Unreleased]"
owner: content-strategist + frontend-lead
created: "2026-06-02"
last_updated: "2026-06-02"
---

# Feature Spec — T-P1-002: Public docs site

## Meta

| Field | Value |
|---|---|
| Task ID | T-P1-002 |
| Feature Name | Public docs site from `docs/plan/03-content/CONTENT_MAP.md` |
| Phase | Phase 2 (P1) |
| Effort | L |
| Priority | P1 |
| Status | approved |

## Problem

`CONTENT_MAP.md` holds locked copy for the marketing/docs site, but there is no rendered destination. New visitors and contributors have no public landing page that explains NEZAM's value pillars, gates, or commands.

## Solution

A statically generated Nextra v4 docs site at `.nezam/docs-site/`. Content lives in MDX under `content/`. The site builds to fully static HTML — deployable to any CDN.

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | `pnpm docs-site:build` exits 0 |
| AC-2 | Build emits the 5 routes defined in CONTENT_MAP: `/`, `/start`, `/commands/plan`, `/design-hub`, `/gates` |
| AC-3 | All content matches CONTENT_MAP locked copy (hero, value pillars, gate messages) |
| AC-4 | `pnpm docs-site` runs the dev server on port 4100 |
| AC-5 | Site is part of pnpm workspace at `.nezam/docs-site` |
| AC-6 | Site uses Nextra v4 on Next.js App Router (per architecture decision 2026-06-02) |

## Out of scope (deferred)

- Custom theme matching DESIGN.md tokens (Phase 4 polish)
- Search indexing / Algolia / Inkeep AI (Phase 4)
- Multilingual / RTL (Phase 4 — see T-P2-001)
- Email + social templates (CONTENT_MAP §6 explicitly marks P2)
- Deployment pipeline (Phase 6 ship)

## Implementation

```
.nezam/docs-site/
├── package.json              # next, nextra, nextra-theme-docs
├── next.config.mjs           # withNextra() wrapper
├── tsconfig.json
├── mdx-components.tsx        # re-export of theme components
├── app/
│   ├── layout.tsx            # Layout + Navbar + Footer
│   └── [[...mdxPath]]/
│       └── page.tsx          # dynamic MDX router
└── content/                  # MDX content tree
    ├── _meta.ts
    ├── index.mdx
    ├── start.mdx
    ├── design-hub.mdx
    ├── gates.mdx
    └── commands/
        ├── _meta.ts
        └── plan.mdx
```

Root entries: `pnpm docs-site` (dev) · `pnpm docs-site:build` (build)

## Test coverage

- `src/test/docs-site-build.test.ts` — smoke test that `pnpm docs-site:build` exits 0 (skipped in CI quick-run; enabled in nightly)
- Content parity verified manually against CONTENT_MAP §2–§5
