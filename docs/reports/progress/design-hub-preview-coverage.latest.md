# Design Hub Preview Coverage Matrix

Date: 2026-05-28
Scope: Preview section page-by-page craft validation for sitemap-backed pages.

## Coverage Rules

- Preview must allow selecting both `page` and `subpage` nodes.
- Unsaved pages must still render via seeded wireframe fallback.
- Saved sessions must load from `/api/pages/[pageId]` when present.

## Execution Notes

- Updated preview selection guard in `PreviewSection` to include `subpage` nodes.
- Added session source status (`loading`, `saved session`, `seeded`) in `BrowserPreview`.
- Added request cancellation via `AbortController` to avoid stale page session updates.

## Targeted QA Checklist

- [x] Selecting a `subpage` in preview tree opens device/browser rendering.
- [x] Switching pages updates rendered content without stale session bleed.
- [x] Unsaved pages render from seeded blocks.
- [x] Saved pages show `saved session` badge after load.
- [ ] Manual run-through of every live sitemap page in local UI (pending interactive pass).

## Residual Risk

- Full interactive confirmation for every sitemap node requires local manual browsing session.
