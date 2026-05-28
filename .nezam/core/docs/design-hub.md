# NEZAM Design Hub

> Human-in-the-loop design decision engine — bridges planning and development with machine-readable design contracts.

---

## Overview

The NEZAM Design Hub (`.nezam/design-hub/`) is a local Next.js 15 application running on port 4000 that serves as a **human-in-the-loop design decision engine**. It produces two artifacts that gate AI swarm development:

- **`DESIGN.md`** — Locked design contract (tokens, typography, palette, spacing, motion)
- **`wireframes_locked.json`** — Per-page block layout contract (required for P0 pages)

---

## Architecture

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 App Router |
| **Styling** | Tailwind CSS 3 |
| **State** | Zustand |
| **Port** | 4000 (configurable via `NEZAM_DESIGN_PORT`) |
| **Profiles** | 100+ design profiles in `.nezam/design-hub/design/` |

### Core Modules

1. **Sitemap Builder** — Visual page hierarchy editor; AI pre-populates from PRD
2. **Token Studio** — Live editor with CSS custom property preview (`--ds-*`)
3. **Theming** — Theme presets and token preview for the design system
4. **Preview** — Compose page previews across device frames
5. **Export Engine** — Generate multiple export artifacts from the current design state

---

## Quick Start

```bash
# Start the design server
pnpm design-hub

# Or directly from the directory
cd .nezam/design-hub && pnpm dev

# Apply a design profile (CLI fallback)
pnpm run design:apply -- minimal
pnpm run design:apply -- linear-app
```

---

## Design Profiles

NEZAM ships with 100+ brand design profiles organized by category:

| Category | Profiles |
|----------|----------|
| **Minimal / Clean** | minimal, clean, simple, contemporary |
| **Modern SaaS** | linear-app, stripe, notion, superhuman, raycast |
| **Creative / Visual** | figma, dribbble, behance, creative, vivid |
| **MENA / Arabic** | vodafone, etisalat, stc, mobinil, banki |
| **Glassmorphic** | glassmorphism, claymorphism, neomorphism |
| **Experimental** | cyberpunk, futuristic, bento, material |

```bash
# Apply a profile
pnpm run design:apply -- <brand-name>

# List available profiles
cat .nezam/design-hub/design/catalog.json
```

---

## Token System

### Current Schema

The design server token store currently supports:

```typescript
colors: {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  textPrimary: string
  textSecondary: string
  textMuted: string
}
typography: {
  fontHeading: string
  fontBody: string
  baseSize: number
  scale: number
}
spacing: {
  baseUnit: number
}
```

### Planned Expansion (Phase 1)

- Semantic token layer (interactive, destructive, success, warning, info)
- Border radius tokens
- Elevation/shadow tokens
- Motion/duration tokens
- Z-index scale
- Full type scale with named roles
- Responsive breakpoint tokens

---

## Design Gates

| Gate | Check |
|------|-------|
| **Gate 1** | Zero hardcoded design primitives |
| **Gate 2** | Fluid typography with `clamp()` |
| **Gate 3** | Dark mode parity for all tokens |
| **Gate 4** | Wireframe lock schema validation |
| **Gate 5** | RTL language support |
| **Gate 6** | Design system completeness |
| **Gate 7** | Profile-driven tokenization |

```bash
# Validate tokens locally
pnpm run check:tokens

# Full design check
pnpm run check:all
```

---

## API Endpoints

In the active v7 UI, design exports are generated **client-side** and copied/downloaded from within the hub UI.

Server-side lock APIs (`/api/lock`) and the wireframe editor are active in the current hub flow.

### Wireframe Session Mapping

- Wireframe sessions are stored by architecture node ID at `.session/pages/{archPage.id}.json`.
- Lock export still emits `PAGE-xxx` IDs in `wireframes_locked.json` to satisfy the schema contract.
- Each sitemap page now carries `arch_page_id` so lock/export can resolve sessions from stable architecture IDs.
- If a page session is empty or missing, the editor auto-seeds a draft block stack from architecture metadata; users must still click **Save session** to persist it.

### Wireframes UX (v7)

- **Page tree:** The Wireframes left rail mirrors the Architecture sitemap hierarchy (app → nav → pages). Only `page` and `subpage` nodes are selectable; containers expand/collapse only.
- **Illustrated canvas:** The center column renders token-aware CSS wireframe previews per block (not text-only rows). Blocks can be reordered via drag-and-drop inside a centered page frame.
- **Expanded palette:** The block registry ships ~27 minimal-plus blocks (navigation, hero, content, forms, data, layout). The right palette is filtered by the active architecture profile canvas mode (`web` / `saas` / `mobile`) and shows compact preview thumbnails per block.
- **Seeding:** Auto-seed heuristics pick stacks by route/profile (e.g. home → hero + features + CTA; pricing → pricing + FAQ; dashboard/sidebar → KPI row + table; login → form login).

---

## File Structure

```
.nezam/design-hub/
├── app/
│   ├── globals.css     # Hub-local base styles + design variables
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Hub shell (Architecture / Design / Theming / Preview)
├── src/
│   ├── components/     # Architecture sitemap, token editors, preview, exports
│   ├── data/           # Profiles, templates, library definitions
│   ├── store/          # Zustand stores (hub state + persistence)
│   ├── types/          # Shared type contracts for the hub
│   └── lib/            # Helpers (export formats, adapters, utilities)
├── _archive/
│   └── v1/            # Legacy wireframe + lock APIs and test suites
└── public/            # Static assets
```

---

## Build & Deployment

```bash
# Development
pnpm dev              # http://localhost:4000

# Production build
pnpm build

# Start production server
pnpm start

# Type check
pnpm type-check
```

### Build Resolution Notes

When the design server runs inside a macOS sandbox (AI agent background shell), Corepack permission restrictions may prevent port binding. To run locally:

```bash
cd .nezam/design-hub && npx next dev --port 4000
```

---

## Audit & Improvement Plan

See [`design-hub-audit.md`](design-hub-audit.md) for:

- Critical gaps (anemic token system, broken profile parser, mocked AI)
- Phase 1 foundation repair tasks
- Phase 2 feature completion tasks
- Full Antigravity implementation prompt

---

## Integration with SDD Pipeline

```
[01 Design] → Start Design Hub → /START design
              ↓
         Configure tokens, sitemap, wireframes
              ↓
         Lock design contract (/lock)
              ↓
  DESIGN.md + wireframes_locked.json created
              ↓
         Gate 4 passes → Build phase unlocked
```