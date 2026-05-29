# Information Architecture — NEZAM

| Field | Value |
|---|---|
| Document | IA_CONTENT.md |
| Status | Locked |
| Last updated | 2026-05-29 |
| PRD | `docs/plan/00-define/01-product/PRD.md` |
| Wireframe lock | `wireframes_locked.json` (PAGE-001 Home / dashboard shell) |

---

## 1. Product surfaces (two IA trees)

NEZAM is not a single consumer app. IA splits into **(A) repository/workspace** and **(B) Design Hub app**.

### A. Repository / documentation IA

```
nezam (repo)
├── README.md                    → GitHub entry, quick start
├── docs/
│   ├── start/                   → Onboarding (PRD, PROJECT_PROMPT)
│   ├── plan/                    → SDD planning artifacts (this tree)
│   └── reports/                 → Generated scans (a11y, lighthouse, …)
├── .cursor/                     → Canonical commands · agents · skills · rules
├── .nezam/
│   ├── core/                    → PRD, plans, gates, architecture, scripts
│   └── design-hub/              → Design Hub Next.js app
├── DESIGN.md                    → Locked design contract (root)
└── wireframes_locked.json       → Locked wireframe contract (root)
```

### B. Design Hub app IA (localhost:4000)

Primary nav sections (left rail — shared `LeftPanelHeader` pattern):

| Section | Purpose | Key entities |
|---|---|---|
| **Architecture** | App tree: applications, menus, pages, services | `archPageId`, microservices rack |
| **Wireframes** | Per-page block stacks, layout shells | `.session/pages/{archPageId}.json` |
| **Preview** | Pages + sections (marketing blocks) | Mirrors wireframe blocks |
| **Components** | shadcn registry browser | `shadcn-component-registry.json` |
| **Tokens / Theme** | Profile + semantic `app-*` tokens | `DESIGN.md` export path |
| **Export** | Lock → `wireframes_locked.json` | Human-in-the-loop gate |

---

## 2. URL map (Design Hub — in-app routes)

| Route | Screen | Access | Priority |
|---|---|---|---|
| `/` | Design Hub shell (section router) | Local dev | P0 |
| `/architecture` | Architecture tree + service rack | Authenticated (local) | P0 |
| `/wireframes` | Wireframe editor per arch page | Local | P0 |
| `/preview` | Section previews | Local | P0 |
| `/components` | Component catalog | Local | P1 |
| `/tokens` | Token / theme studio | Local | P1 |
| `/export` | Lock & export hub | Local | P0 |

**API routes (representative):** `/api/context`, `/api/lock`, `/api/session/save-page`, `/api/profiles`

---

## 3. URL map (future public docs site)

| URL | Label (nav) | Maps to repo path |
|---|---|---|
| `/` | Home | README narrative |
| `/docs/start` | Get started | `docs/start/` |
| `/docs/commands` | Commands | `.cursor/commands/` |
| `/docs/design-hub` | Design Hub | `.nezam/design-hub/README` |
| `/docs/gates` | Gates | `.nezam/core/gates/` |
| `/docs/agents` | Agents | `.cursor/agents/README.md` |
| `/docs/plan` | Planning | `docs/plan/` |

Nav contract: max 6 top-level items; commands grouped under `/docs/commands/*`.

---

## 4. User flows (workspace operator)

### Flow 1 — First-time onboarding

```
Clone repo → pnpm install → /START all
  → PRD locked → DESIGN profile applied → specs created
  → /plan all → planning_complete
  → /develop start (blocked until scaffold confirmed)
```

### Flow 2 — Design approval (HITL)

```
/plan ia (pages list) → open Design Hub
  → Architecture: add pages → Wireframes: stack blocks → Save session
  → Export lock → wireframes_locked.json
  → /develop unblocked for UI slices
```

### Flow 3 — Multi-tool handoff

```
Edit .cursor/ only → pnpm ai:sync → pnpm ai:check
  → Commit (pre-commit hook re-syncs mirrors)
```

---

## 5. Screen inventory (P0)

| screen_id | Title | Surface | States required |
|---|---|---|---|
| PAGE-001 | Home / Dashboard shell | Design Hub + lock file | default, loading, empty |
| WS-001 | Command palette (IDE) | Cursor | N/A (IDE) |
| DH-ARCH | Architecture panel | Design Hub | empty tree, populated, service wired |
| DH-WF | Wireframe canvas | Design Hub | empty page, seeded blocks, saved |
| DH-EXPORT | Export / lock review | Design Hub | pre-lock, locked, validation error |

*Full ASCII wireframes: `docs/plan/04-design/WIREFRAMES.md`*

---

## 6. Navigation labels (locked)

| Context | Label | Do not use |
|---|---|---|
| Primary CTA (README) | Get started with `/START all` | "Sign up" |
| Planning complete | Run `/develop start` | "Launch app" |
| Design lock | Approve wireframes in Design Hub | "Publish" |
| Repo section | Design Hub (local) | "Studio Pro" |

---

## Decision Amendments

| Date | Changed field | Previous | New | Reason | Approved by |
|---|---|---|---|---|---|
| 2026-05-29 | Initial lock | — | Dual IA (repo + Design Hub) | Matches PRD §12 | PM-01 |
