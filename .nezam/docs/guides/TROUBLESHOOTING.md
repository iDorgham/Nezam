# NEZAM Troubleshooting & FAQ Guide

This guide contains resolution pathways for 20+ common developer, designer, and operator scenarios.

---

## 1. Multi-Client Sync & Drift Issues

### Scenario 1.1: `ai:check` reports drift of skill files
- **Symptom:** Git pre-commit hooks fail indicating that synced files under `.gemini/`, `.claude/`, or `.vscode/` do not match `.cursor/`.
- **Solution:** Run the sync script manually to restage:
  ```bash
  pnpm ai:sync
  ```

### Scenario 1.2: Stale skill symlinks cause sync failure (ENOENT)
- **Symptom:** `pnpm ai:sync` fails with `ENOENT` or broken symlink errors.
- **Solution:** Clean up broken symlinks in the target mirror directories, then run:
  ```bash
  pnpm skills:normalize
  pnpm ai:sync
  ```

### Scenario 1.3: Husky hook blocked by uncommitted files
- **Symptom:** Committing files is blocked because Husky runs `ai:check` which detects stray generated files.
- **Solution:** Ensure you did not edit mirror directories directly. Always make changes in `.cursor/` and sync.

---

## 2. Design System & Token Audit Failures

### Scenario 2.1: `check:tokens` fails on raw colors
- **Symptom:** The token audit block logs: `Gate 1 FAIL: Hardcoded design primitives found` with a CSS `#ffffff` color violation.
- **Solution:** Replace the hardcoded hex value with its corresponding design token defined in `DESIGN.md` (e.g., `var(--color-background)`).

### Scenario 2.2: Hardcoded font sizes (`px` values) blocked in components
- **Symptom:** A TSX component fails token validation due to `font-size: 16px`.
- **Solution:** Replace with standard typography utility tokens (e.g., dynamic text classes or `var(--font-size-base)`).

### Scenario 2.3: Z-index values failing audit
- **Symptom:** Build fails because of `z-index: 9999` in styling files.
- **Solution:** Map the z-index to a designated token z-layer (e.g., `var(--z-index-overlay)`).

---

## 3. Wireframes & Schema v2.0 Validation

### Scenario 3.1: `check-wireframe-schema-v2.js` reports missing version
- **Symptom:** Validation gate fails with `Error: "$schemaVersion" is missing at root`.
- **Solution:** Open `wireframes_locked.json` and verify the first line has `"$schemaVersion": "2.0.0"`.

### Scenario 3.2: Missing `"validated_at"` in wireframes lock file
- **Symptom:** Validation fails with `Error: "meta.validated_at" is missing`.
- **Solution:** Verify the lock file contains a valid ISO 8601 timestamp for `"validated_at"` inside the `"meta"` object block.

### Scenario 3.3: Missing `"arch_page_id"` on sitemap pages
- **Symptom:** Pre-merge check logs: `Error: sitemap.pages[X] is missing "arch_page_id"`.
- **Solution:** Regenerate the sitemap session in Design Hub, ensuring all pages are cross-referenced to stable architecture IDs.

---

## 4. Observability & Telemetry Endpoints

### Scenario 4.1: Sentry build errors in Next.js
- **Symptom:** `next build` fails with Sentry errors when the `@sentry/nextjs` package is missing or environment variables are unset.
- **Solution:** Ensure `next.config.js` is wrapped in the Sentry try/catch block for graceful fallback.

### Scenario 4.2: Web Vitals payload fails to deliver
- **Symptom:** Console warnings: `Failed to report web vitals` or `/api/vitals` returns 400.
- **Solution:** Check the structure of the JSON payload sent by `vitals.tsx` and verify it matches the parameter schemas parsed by the API route.

### Scenario 4.3: High CLS (layout shift) in Lighthouse reports
- **Symptom:** PR is blocked because cumulative layout shifts exceed 0.1.
- **Solution:** Set explicit aspect ratios or size bounds on images, hero badges, and custom preview blocks.

---

## 5. Content Ops & Markdown Templates

### Scenario 5.1: Markdown brief has template placeholders
- **Symptom:** CI build fails Gate 7 indicating `DESIGN.md contains placeholder content`.
- **Solution:** Search the markdown files for the keywords `TODO`, `PLACEHOLDER`, or template markers and replace them with actual values.

### Scenario 5.2: Missing SEO description on new routes
- **Symptom:** Audit warns about missing route-level meta description.
- **Solution:** Verify the route has a corresponding description tag or YAML frontmatter of 150-160 characters.

### Scenario 5.3: RTL layout shifts on Arabic context switch
- **Symptom:** Text alignment or icon positions are incorrect when layout dir changes to RTL.
- **Solution:** Ensure layout styling uses logical properties (e.g., `margin-inline-start` instead of `margin-left`).

---

## 6. GitHub Actions & CI Gates

### Scenario 6.1: DAST scan fails in CI
- **Symptom:** ZAP baseline scan fails indicating security vulnerabilities.
- **Solution:** Review the scan report under `docs/reports/security/` and ensure SVG file uploads are properly sanitized.

### Scenario 6.2: CodeQL analysis times out
- **Symptom:** CI run for CodeQL runs out of memory or times out.
- **Solution:** Verify that heavy build targets and directories like `.next` are excluded from the scanned source files.

### Scenario 6.3: LHCI fails due to poor FCP
- **Symptom:** PR checks fail on performance budgets.
- **Solution:** Optimize critical CSS delivery and ensure React components use dynamic lazy loading for non-critical assets.
