---
skill_id: nezam-i18n-next-intl"
name: "nezam-i18n-next-intl"
description: "Implements locale routing, translations, middleware, and RTL config using next-intl."
version: 1.0.0
updated: 2026-05-12
changelog:
  - version: 1.0.0
    date: 2026-05-12
    notes: "Initial Wave 2 implementation."
owner: "i18n-engineer"
tier: 3
sdd_phase: "Development"
rtl_aware: true
certified: true
dependencies: ["frontend/nextjs-patterns", "content/arabic-content"]
---
# i18n Next-Intl Architecture

## Purpose

Implement robust internationalization in Next.js App Router applications using `next-intl`. Covers locale routing, server/client translation fetching, middleware negotiation, and RTL (Right-to-Left) layout configuration.

## Trigger Conditions

- Application requires multi-language support (e.g., English + Arabic).
- Setup of locale-based URL routing (`/en/about` vs `/ar/about`).
- Dynamic directionality (LTR/RTL) switching based on locale.

## Prerequisites

- Next.js App Router initialized.
- Supported locales and default locale defined.

## Procedure

1. **Middleware Setup:** Configure `next-intl/middleware` to handle locale detection, redirects, and URL prefixing strategies (always prefix vs. as-needed).
2. **Routing Structure:** Move all pages into a `[locale]` dynamic route folder to ensure locale is available to all Server Components.
3. **Translation Retrieval:**
   - Server Components: Use `getTranslations('Namespace')`.
   - Client Components: Use `useTranslations('Namespace')`. Keep namespaces small to optimize client bundle size.
4. **RTL Configuration:** Dynamically inject the `dir` attribute (e.g., `dir={locale === 'ar' ? 'rtl' : 'ltr'}`) on the root `<html>` tag based on the matched locale.
5. **Metadata:** Use `getTranslations` within `generateMetadata` for localized SEO titles and descriptions.

## Output Artifacts

- `i18n.ts` and `middleware.ts` configuration.
- Base dictionary files (e.g., `en.json`, `ar.json`).
- Root layout configured for dynamic `lang` and `dir`.

## Validation Checklist

- [ ] Middleware correctly detects and redirects based on user preference.
- [ ] Root HTML tag sets `dir="rtl"` for Arabic/Hebrew locales.
- [ ] Server and Client components fetch translations without hydration mismatches.
- [ ] Metadata is properly localized for SEO.

## Handoff Target

`content/arabic-content` for dictionary population, or `frontend/rtl-layout` for CSS logical property auditing.
