---
name: coi-cdn-optimization
description: Image optimization, prefetch/preload, cache tags, and edge routing for fast global delivery.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose

Optimize delivery at the CDN/edge: image pipelines, asset prefetch/preload, cache-tag strategy, edge routing, and origin protection. Single-responsibility: edge delivery contract.

# Inputs

- Cache strategy from `@.cursor/skills/coi-cache-strategies/SKILL.md`.
- Hosting target from `@.cursor/skills/coi-vercel-deploy/SKILL.md`, `@.cursor/skills/coi-aws-infra/SKILL.md`, or `@.cursor/skills/coi-cloudflare-edge/SKILL.md`.
- Performance budget from `@.cursor/skills/coi-performance-optimization/SKILL.md`.
- IA + URL hierarchy from `@.cursor/skills/coi-ia-taxonomy/SKILL.md`.

# Step-by-Step Workflow

1. Image pipeline: AVIF/WebP with JPEG/PNG fallback; responsive `srcset`; on-the-fly resizing via Vercel Image Optimization, Cloudflare Images, or AWS Lambda@Edge.
2. Set far-future cache (`Cache-Control: public, max-age=31536000, immutable`) for content-hashed assets; short TTL for HTML.
3. Use `<link rel="preload">` for LCP-critical assets, `<link rel="preconnect">` for early DNS/TLS, `<link rel="prefetch">` for next-route bundles.
4. Cache-tag every cacheable response; document tag namespace (`page:`, `entity:`, `feed:`).
5. Edge routing: geo-aware redirects, A/B traffic splits, language negotiation; respect `Vary` correctly.
6. Origin protection: signed URLs for private content, hotlink rules, OAC/OAI for S3, allowlist origins on CDN.
7. Track hit-rate, p99, and cache key cardinality; eliminate accidental key explosion.

# Validation & Metrics

- LCP < 2.5s on priority pages (synthetic + RUM).
- Edge cache hit ratio ≥ 90% for static and ≥ 70% for HTML where applicable.
- Image weight reduced ≥ 50% vs raw originals.
- No origin egress spikes during traffic peaks.
- Cache-key cardinality stays under documented threshold.

# Output Format

- `docs/core/required/sdd/CDN_OPTIMIZATION.md` (image, headers, prefetch, tags).
- Cache-tag namespace document.
- Edge routing matrix (geo, A/B, language).
- Origin protection policy.

# Integration Hooks

- `/SCAN perf` validates LCP and hit ratio.
- `/DEVELOP` consumes presets (without writing app code here).
- Pairs with `@.cursor/skills/coi-cache-strategies/SKILL.md`, `@.cursor/skills/coi-performance-optimization/SKILL.md`, `@.cursor/skills/coi-vercel-deploy/SKILL.md`, `@.cursor/skills/coi-cloudflare-edge/SKILL.md`, `@.cursor/skills/coi-aws-infra/SKILL.md`.
- Honors `[.cursor/rules/coia-design-gates-pro.mdc](.cursor/rules/coia-design-gates-pro.mdc)` Gate 6.

# Anti-Patterns

- Serving raw uploaded images without resizing pipeline.
- Cache keys that include cookies or query strings unnecessarily (cardinality blowup).
- `<link rel="preload">` on assets the page rarely needs.
- Hot-linkable private assets without signed URLs.
- Long TTL on HTML without revalidation strategy.

# External Reference

- web.dev: Optimize images / Resource hints (current).
- RFC 9111 HTTP Caching (https://www.rfc-editor.org/rfc/rfc9111).
- Vercel Image Optimization (https://vercel.com/docs/image-optimization) — current.
- Cloudflare Images / Polish / Mirage (current).
- Closest skills.sh/official analog: cdn-optimization / edge-delivery.
