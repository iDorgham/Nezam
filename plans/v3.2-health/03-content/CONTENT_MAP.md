# Content Map — NEZAM

| Field | Value |
|---|---|
| Document | CONTENT_MAP.md |
| Status | Locked |
| Voice | Clear, technical, confident — no hype |
| Audience | AI-native developers, technical leads |
| Last updated | 2026-05-29 |

---

## 1. Voice & tone

| Attribute | Guideline |
|---|---|
| Register | Professional builder-to-builder |
| Sentence length | Short; one idea per sentence |
| Jargon | SDD, hardlock, canonical, mirror — define once then reuse |
| Avoid | "Revolutionary", "10x", emoji in specs |
| Commands | Always fenced: `/START`, `/plan all`, `/develop` |

---

## 2. README (GitHub home) — locked copy blocks

### Hero

**Headline:** Specification-driven development for AI-native teams

**Subhead:** NEZAM governs Cursor, Claude, Codex, and more with one pipeline: plan → lock design → scaffold → develop — with hardlocks that block unsafe work.

**Primary CTA:** Get started — run `/START all` in Cursor

**Secondary CTA:** Browse commands · Open Design Hub locally

### Value pillars (3-up)

1. **Governed pipeline** — PRD, plans, specs, and gates before code.
2. **Design Hub** — Approve architecture and wireframes; export `wireframes_locked.json`.
3. **Multi-client sync** — Edit `.cursor/` once; `pnpm ai:sync` updates every mirror.

---

## 3. Per-page content briefs

### `/` (future docs home)

| Zone | Copy direction |
|---|---|
| Hero | Same as README hero |
| Proof | GitHub stars, CI badges, "Open source" |
| How it works | 4-step: Define → Plan → Lock design → Develop |
| CTA | Clone template · Read PRD |

### `/docs/start`

| Section | Content |
|---|---|
| H1 | Start here |
| Lead | Complete onboarding in one pass with `/START all`. |
| Steps | 1. Install deps 2. Lock PRD 3. Apply design profile 4. Create P0 specs 5. Run readiness script |
| Warning | Do not edit generated `AGENTS.md` or `.claude/` — edit `.cursor/` and sync. |

### `/docs/commands/plan`

| Element | Copy |
|---|---|
| H1 | `/plan` — Planning |
| Lead | Run the SDD planning sequence: SEO, IA, content, architecture, design wireframes, scaffold, tasks. |
| Hardlock note | Blocked until PRD, PROJECT_PROMPT, DESIGN.md, and at least one feature spec exist. |

### `/docs/design-hub`

| Element | Copy |
|---|---|
| H1 | Design Hub |
| Lead | Local Next.js app on port 4000. Architecture tree drives wireframe sessions 1:1. |
| Command | `pnpm design-hub` or `pnpm --filter design-hub dev` |
| Gate | Export produces `wireframes_locked.json` required for `/develop`. |

### `/docs/gates`

| Gate | User-facing explanation |
|---|---|
| `/plan` | Planning requires a filled PRD and locked design profile. |
| `/develop` | Development requires completed planning, scaffold, and wireframe lock for UI work. |
| Token gate | No hardcoded colors/spacing in components — use design tokens. |

---

## 4. Microcopy (Design Hub UI)

| Location | Default | Empty | Error |
|---|---|---|---|
| Architecture tree | Add application, menu, or page | No pages yet — add an application to begin | Could not load architecture |
| Wireframe save | Save session | Add blocks from the palette | Save failed — check dev server logs |
| Export lock | Lock wireframes for development | Complete wireframes for all P0 pages | Lock validation failed — see export log |
| Service picker | Wire a service | No services in catalog | Service unavailable |

---

## 5. Error & gate messages (IDE / agent)

| Trigger | Message |
|---|---|
| `/plan` blocked | **Hardlock:** `/plan` needs a completed PRD, PROJECT_PROMPT, root `DESIGN.md`, and at least one spec in `.nezam/core/plans/00-define/specs/`. Run `/START all` first. |
| `/develop` blocked | **Hardlock:** Planning or scaffold incomplete. Run `/plan scaffold` and confirm `PROJECT_SCAFFOLD.md`. |
| Missing wireframes | **Hardlock:** `wireframes_locked.json` missing. Run Design Hub export or `/wireframe`. |
| ai:check fail | **Sync drift:** Run `pnpm ai:sync` then `pnpm ai:check`. Do not edit mirror folders by hand. |

---

## 6. Email / social (optional P2)

Not in scope for v2.1. If added: single announcement template for GitHub Releases only.

---

## Decision Amendments

| Date | Changed field | Previous | New | Reason | Approved by |
|---|---|---|---|---|---|
| 2026-05-29 | Initial lock | — | Framework copy, not SaaS pricing | Product type | PM-01 |
