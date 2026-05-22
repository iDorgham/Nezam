# Feature Spec — F-008: Asset Browser & Import Terminal

---

## Meta

| Field | Value |
|---|---|
| Feature ID | F-008 |
| Feature Name | Asset Browser & Import Terminal |
| Priority | P1 |
| Personas affected | Amina, Rami |
| PRD section | Section 4 (Row 8) · Screen 5 · §10.4 |
| Status | approved |
| Last updated | 2026-05-19 |
| spec_version | 0.1.0 |
| built_at_version | Unreleased (root CHANGELOG.md) |
| Working spec sources | PRD §7 (Asset APIs) · ARCHITECTURE.md §4 (AssetItem) · §8 (Asset Pipeline) · §11 (Security) |

---

## 1. User Story

**As a** designer or frontend lead,
**I want to** drop image, font, and structured-data files into the workspace,
**so that** they appear in the asset grid as cleaned, vision-checked, optimized artefacts I can attach to canvas nodes — with text-bearing SVGs and unsupported MIME types rejected at ingest.

---

## 2. Acceptance Criteria

- [ ] **AC-001:** Given the user drops `image/svg+xml` containing a `<text>` element at any nesting depth, when the upload route processes it, then the response is `422` with `code: "text-element"` and the asset card surfaces a red ✗ "Text layer detected — blocked" overlay.
- [ ] **AC-002:** Given the user drops a MIME type outside the allowlist (`image/svg+xml`, `image/png`, `image/jpeg`, `image/webp`, `font/woff2`, `application/json`, `text/yaml`), when ingest runs, then the response is `422` with `code: "unsupported-mime-type"` and the file does not reach storage.
- [ ] **AC-003:** Given a clean PNG or JPEG is uploaded, when the asset is stored, then it is converted to WebP (quality 85) by the optimizer and the AssetItem `optimizedUrl` points at the converted blob.
- [ ] **AC-004:** Given an image asset is stored, when the upload response is sent, then the Vision Gate runs in the background via `waitUntil()` and updates the AssetItem's `visionStatus` from `pending` to `valid` or `rejected` without blocking the response.
- [ ] **AC-005:** Given the Asset Browser has no assets, when it renders, then the drop zone shows the supported-extension list and the empty-state copy "Drop assets here".
- [ ] **AC-006:** Given a file is mid-upload, when the user opens the asset browser, then an `UploadProgress` bar shows per-file progress and exposes a Cancel control.
- [ ] **AC-007:** Given the asset list is populated, when the user inspects a card, then the card displays a thumbnail (or type icon for non-image), original filename, MIME badge, and (for rejected assets) the rejection reason overlay.

### 2.1 Out of Scope

- ❌ Bulk import of large folders (>100 files) — Phase 3
- ❌ Asset tagging / search — Phase 3
- ❌ External CDN sources (URL paste) — Phase 3
- ❌ Asset version history — out of scope for v1

---

## 3. UI Specification

### 3.1 Surface

- **Location:** Left dock, secondary tab (after the Page List / Widget Library / Service List)
- **Layout:** Toolbar (40px) + breadcrumb path (32px) + drop zone (collapses when populated) + asset grid (`grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))`)

### 3.2 Card states

| State | Trigger | Visual |
|---|---|---|
| Empty | No assets | Centered drop zone with extension list, dashed `border-ds-border` |
| Uploading | File dropped | `UploadProgress` row, animated bar, Cancel button |
| Populated | Assets exist | `AssetCard` grid, type icons, MIME badge in corner |
| Rejected | `text-element` or vision rejection | Red ✗ overlay, message under thumbnail, replace CTA |

### 3.3 Component contract

- `AssetCard({ asset })` — pure rendering of an `AssetItem`. No fetch, no store wiring.
- `DropZone({ onFiles, accepts })` — drag-over visual + accept list rendering; emits `onFiles(File[])` on drop.
- `UploadProgress({ name, percent, onCancel })` — per-file progress row.
- `AssetBrowser` — orchestrates the above + reads/writes the asset store.

---

## 4. Hardlock Enforcement

| Rule | Where enforced | Code |
|---|---|---|
| Zero `<text>` in SVG (any depth) | `src/lib/svg-sanitizer.ts` → upload route | `text-element` → 422 |
| MIME allowlist | `src/lib/asset-schema.ts` Zod enum → upload route | `unsupported-mime-type` → 422 |
| Filename path traversal | `path.basename()` + uuid rename in storage | (internal) |
| CSS injection via SVG attributes | DOMParser + allowlist (future) | (deferred to T-Q-006) |

---

## 5. Edge Cases

- **Empty SVG** (`<svg/>`) — accepted, vision gate skipped.
- **Mid-upload network drop** — `UploadProgress` shows error state, retry CTA.
- **WebP source already** — optimizer no-ops conversion, keeps original bytes.
- **WOFF2 / JSON / YAML** — skip Vision Gate (no image), mark `visionStatus: 'valid'` immediately.
- **Vision Gate timeout (>3s)** — retry once; on second timeout mark `visionStatus: 'rejected'` with `reason: 'vision-timeout'`.

---

## 6. Definition of Done

- [ ] All 7 ACs pass with vitest tests in `app/api/assets/upload/*.test.ts`, `src/lib/asset-optimizer.test.ts`, `src/lib/svg-sanitizer.test.ts`, and `components/asset/*.test.tsx`.
- [ ] `pnpm type-check` clean.
- [ ] Zero TODO / FIXME in `app/api/assets/**` and `components/asset/**`.
- [ ] All tokens used; no hex / px / rem literals in component markup.
- [ ] axe-core CI scan covers the Asset Browser surface (deferred to T-Q-001).
- [ ] RTL audit (T-Q-002) verifies dock placement mirrors in `dir="rtl"`.

---

*Generated 2026-05-19 from PRD v2.0.0 · ARCHITECTURE.md §4/§8/§11 · scaffold notes.*
