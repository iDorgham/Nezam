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
| **Profiles** | 100+ design profiles in `.nezam/design/` |

### Core Modules

1. **Sitemap Builder** — Visual page hierarchy editor; AI pre-populates from PRD
2. **Wireframe Editor** — Per-page block canvas (Hero, CTA, Cards, Features, etc.)
3. **Token Studio** — Live editor with CSS custom property preview (`--ds-*`)
4. **Profile Browser** — Browse & apply 100+ brand profiles from `.nezam/design/`
5. **State Review** — Review loading/empty/error/populated states per section

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
cat .nezam/design/catalog.json
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

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/context` | GET | Fetch current project context |
| `/api/profiles` | GET | List available design profiles |
| `/api/profiles/[name]` | POST | Save custom design profile |
| `/api/lock` | POST | Export `DESIGN.md` and `wireframes_locked.json` |
| `/api/ai/generate` | POST | AI-powered wireframe generation |
| `/api/pages/[page_id]` | GET/PUT | Page session persistence |
| `/api/tui/[page_id]` | GET | Terminal UI preview |

---

## File Structure

```
.nezam/design-hub/
├── app/
│   ├── api/           # API routes
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Dashboard
├── components/
│   ├── tokens/        # Token Studio, Color Studio, Radius Studio
│   ├── sitemap/       # Sitemap builder, tree view
│   ├── wireframe/     # Wireframe editor workspace
│   ├── profiles/      # Profile grid, card, search
│   └── layout/        # Sidebar, top nav, console
├── lib/
│   ├── store/         # Zustand stores (tokens, session, wireframe)
│   ├── parsers/       # Profile parser, context parser
│   ├── locking/       # Design export logic
│   └── wireframe-library/  # Block registry, templates
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