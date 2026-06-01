---
name: design-intelligence-index
description: "Master routing table for NEZAM's design reference library. Use this skill first on any design task to identify which reference documents to load. Maps design intents, aesthetic moods, component needs, and brand targets to the correct source-of-truth files in docs/reference/."
license: MIT
metadata:
  version: "1.0.0"
  maintainer: "DESIGN-01: Design Intelligence Orchestrator"
tier: 2
version: 1.0.0
updated: 2026-05-29
breaking_changes: false
changelog:
  - version: 1.0.0
    date: 2026-05-29
    notes: "Initial NEZAM skill metadata for canonical .cursor/skills."
---

# Design Intelligence Index

This is the **first skill loaded** on any design task. It resolves the intent → the correct reference sources, preventing agents from defaulting to generic aesthetics.

## How to Use

1. Read the design request.
2. Find the matching row(s) in the routing tables below.
3. Load the referenced files **before** generating any UI code.
4. Pass the loaded context to the implementing agent.

---

## Primary Reference Map

| Reference Library | Path | Load When |
|---|---|---|
| **NEZAM DESIGN.md** | `DESIGN.md` (repo root) | Always — base token system for all NEZAM UI |
| **impeccable skill** | `.cursor/skills/impeccable/SKILL.md` | Any frontend design, critique, audit, or polish task |
| **impeccable references** | `.cursor/skills/impeccable/reference/` | Sub-commands: craft, shape, bolder, overdrive, animate, etc. |
| **emil-design-eng** | `.cursor/skills/emil-design-eng/SKILL.md` | Motion polish, component feel, design-engineering review |
| **design-taste-frontend** | `.cursor/skills/design-taste-frontend/SKILL.md` | Landing/portfolio anti-slop; brief inference before UI gen |
| **stitch-design-taste** | `.cursor/skills/stitch-design-taste/SKILL.md` | Stitch DESIGN.md export; semantic design contract for screens |
| **design skills manifest** | `.nezam/core/gates/design-skills.yaml` | Opt-in `designSkillStack` in prompt.json; vendor via `pnpm skills:vendor-design` |
| **typeui fundamentals** | `docs/reference/typeui-main/skills/fundamentals/` | Universal design law validation (ui-principles, ux-principles, typography, accessibility) |
| **frontend-design principles** | `docs/reference/skills-main/skills/frontend-design/SKILL.md` | Bold aesthetic direction, anti-AI-slop rules |
| **brand DESIGN.md library** | `docs/reference/awesome-design-md-main/design-md/` | Style matching, brand inspiration, token extraction |
| **open-design style packs** | `docs/reference/open-design-main/` | Aesthetic family selection (67 styles) |
| **shadcn/ui catalog** | `docs/reference/awesome-shadcn-ui-main/` | Component selection and shadcn integration |
| **agentic design system** | `docs/reference/awesome-design-skills-main/skills/agentic/` | AI-first, conversational UI patterns |
| **canvas design** | `docs/reference/skills-main/skills/canvas-design/SKILL.md` | Brand assets, posters, design manifesto PDFs |
| **theme factory** | `docs/reference/skills-main/skills/theme-factory/` | Presentations, reports, documentation theming |
| **impeccable DESIGN.md** | `docs/reference/impeccable-main/DESIGN.md` | Editorial sanctuary style reference |

---

## Intent → Reference Routing

### By Surface Type

| Design Surface | Primary Reference | Secondary |
|---|---|---|
| Dashboard / Admin Panel | `DESIGN.md` (NEZAM) + impeccable `reference/product.md` | typeui `ui-principles.md` |
| Landing Page / Marketing | impeccable `reference/brand.md` | open-design style picker |
| Component / UI Element | NEZAM `DESIGN.md` + shadcn catalog | typeui `ux-principles.md` |
| Design System / Tokens | NEZAM `DESIGN.md` + `frontend-design/SKILL.md` | typeui `typography-principles.md` |
| Brand Assets / Posters | `canvas-design/SKILL.md` | theme factory |
| Presentations / Docs | `theme-factory/` | brand guidelines |
| Mobile / Responsive | NEZAM `DESIGN.md` + typeui `accessibility.md` | RTL layout if Arabic |
| RTL / Arabic UI | `DESIGN.md` + RTL specialist agent | masri-content-specialist |

---

### By Aesthetic Mood

| Mood / Style Request | Brand DESIGN.md Match | Open-Design Style |
|---|---|---|
| Dark, precise, tool-like | `vercel`, `linear.app`, `warp` | `minimal`, `mono` |
| Editorial, serif, restrained | `impeccable-main/DESIGN.md` | `editorial`, `premium` |
| Luxury, cinematic, high-end | `ferrari`, `lamborghini`, `bugatti` | `luxury`, `dramatic` |
| Bold, colorful, energetic | `figma`, `framer`, `raycast` | `bold`, `colorful`, `vibrant` |
| Clean, white, product | `notion`, `cal`, `linear.app` | `clean`, `minimal`, `spacious` |
| Dark, developer, code-first | `supabase`, `warp`, `opencode.ai` | `mono`, `retro`, `codex` |
| Glassmorphic, futuristic | `cursor`, `superhuman` | `glassmorphism`, `futuristic` |
| Neobrutalist, raw | _(no brand match)_ | `neobrutalism`, `brutalism` |
| Gradient, vibrant | `lovable`, `stripe`, `cohere` | `gradient`, `colorful` |
| Cosmic, abstract | _(no brand match)_ | `cosmic`, `immersive` |
| Claymorphic, 3D soft | _(no brand match)_ | `claymorphism` |
| Bento, grid-based | _(no brand match)_ | `bento` |
| Paper, analog, organic | `starbucks`, `airbnb` | `paper`, `sketch` |
| Enterprise, corporate | `ibm`, `hashicorp` | `enterprise`, `corporate` |
| MENA / Arabic / Cairo | NEZAM `DESIGN.md` + RTL specialist | Egyptian Arabic content specialist |

---

### By Component Need

| Component Request | Primary Reference |
|---|---|
| Data tables, sorting, filtering | `awesome-shadcn-ui` DataTable + NEZAM tokens |
| Navigation (sidebar, tabs, breadcrumbs) | NEZAM `DESIGN.md` nav-item tokens + impeccable layout |
| Forms, inputs, validation | NEZAM `DESIGN.md` input tokens + typeui `ux-principles.md` |
| Charts, data visualization | analytics-chart-designer agent + data-visualization skill |
| Modals, dialogs, sheets | typeui `ux-principles.md` (modals as last resort rule) + shadcn |
| Typography system | typeui `typography-principles.md` + frontend-design font rules |
| Motion, animations | impeccable `reference/animate.md` + motion-3d skill |
| RTL layout | RTL layout specialist + typeui `accessibility.md` |
| Shadcn components | `awesome-shadcn-ui-main/` catalog |
| Empty states | impeccable `reference/onboard.md` |
| Error states | impeccable `reference/harden.md` |
| Accessibility audit | typeui `accessibility.md` + a11y-performance-auditor |

---

### By Task Type

| Task | Load These References |
|---|---|
| **Build new feature** | DESIGN.md + impeccable `craft.md` + `shape.md` |
| **Critique existing UI** | impeccable `critique.md` + `heuristics-scoring.md` + typeui principles |
| **Audit (a11y, perf, responsive)** | impeccable `audit.md` + typeui `accessibility.md` |
| **Polish / pre-ship** | impeccable `polish.md` |
| **Make bolder** | impeccable `bolder.md` + open-design vibrant/bold packs |
| **Make quieter / distill** | impeccable `quieter.md` + `distill.md` |
| **Add motion** | impeccable `animate.md` + `motion-design.md` |
| **Improve typography** | impeccable `typeset.md` + typeui `typography-principles.md` |
| **Match a brand style** | brand DESIGN.md library (exact brand) |
| **Generate visual assets** | canvas-design skill → PDF/PNG pipeline |
| **Theme a document/deck** | theme-factory skill → 10 curated themes |
| **Override AI slop** | impeccable `overdrive.md` + frontend-design anti-AI-slop rules |

---

## Conflict Resolution

When multiple references give conflicting rules, apply this priority order:

1. **NEZAM `DESIGN.md`** (project tokens always win for specific values)
2. **typeui fundamentals** (structural principles win for layout/hierarchy/accessibility)
3. **impeccable shared design laws** (absolute bans: gradient text, side-stripe borders, hero-metric template)
4. **Brand DESIGN.md / open-design style** (aesthetic direction)
5. **shadcn catalog** (component defaults)

**Accessibility is non-negotiable at every level.** typeui `accessibility.md` WCAG 2.2 rules override aesthetic preferences.

---

## Quick Lookup: Brand DESIGN.md Files

71 brand files available at `docs/reference/awesome-design-md-main/design-md/<brand>/DESIGN.md`:

```
airbnb, airtable, apple, binance, bmw, bmw-m, bugatti, cal, claude, clay,
clickhouse, cohere, coinbase, composio, cursor, elevenlabs, expo, ferrari,
figma, framer, hashicorp, ibm, intercom, kraken, lamborghini, linear.app,
lovable, mastercard, meta, minimax, mintlify, miro, mistral.ai, mongodb,
nike, notion, nvidia, ollama, opencode.ai, pinterest, playstation, posthog,
raycast, renault, replicate, resend, revolut, runwayml, sanity, sentry,
shopify, slack, spacex, spotify, starbucks, stripe, supabase, superhuman,
tesla, theverge, together.ai, uber, vercel, vodafone, voltagent, warp,
webflow, wired, wise, x.ai, zapier
```

## Quick Lookup: Open-Design Style Packs

67 styles at `docs/reference/open-design-main/<style>/`:

```
agentic, ant, application, artistic, bento, bold, brutalism, cafe, claude,
claymorphism, clean, codex, colorful, contemporary, corporate, cosmic,
creative, dashboard, dithered, doodle, dramatic, editorial, elegant,
energetic, enterprise, expressive, fantasy, fiction, flat, friendly,
futuristic, glassmorphism, gradient, immersive, impeccable, levels, lingo,
luxury, material, matrix, minimal, modern, mono, neobrutalism, neon,
neumorphism, pacman, paper, perspective, premium, professional, publication,
refined, retro, riso, sega, shadcn, simple, sketch, skeumorphism, sleek,
spacious, storytelling, terracotta, tetris, vibrant, vintage
```
