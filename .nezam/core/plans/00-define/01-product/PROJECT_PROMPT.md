# NEZAM — Project Prompt

> **Every AI agent reads this file before code or spec work.**
> Product contract, decision rules, and acceptance boundaries for the NEZAM workspace framework.

---

## 1. Product North Star

NEZAM is an open-source **Specification-Driven Development (SDD)** workspace for AI-native teams. It turns ad-hoc AI coding into a governed pipeline: PRD → plans → locked design and wireframes → feature specs → implementation → harden → ship. It differs from generic agent templates by **hardlocks**, a **150+ agent swarm**, **multi-client sync** (`.cursor/` canonical), and a **Design Hub** that must approve layouts before `/DEVELOP`. Built for global developers; primary language English. Stack: Node 20+, pnpm, Next.js (Design Hub), YAML/Markdown contracts. Repo: https://github.com/iDorgham/Nezam

---

## 2. Project Identity

| Field | Value |
|---|---|
| Product Name | NEZAM |
| GitHub Repo | https://github.com/iDorgham/Nezam |
| Primary Language | English |
| Target Market | Global |
| PRD File | `docs/start/PRD.md` |
| Design Contract | `DESIGN.md` (profile: `nezam-v3`) |
| Architecture Spec | `.nezam/core/architecture/ARCHITECTURE.md` |
| Gate Matrix | `.nezam/core/gates/GITHUB_GATE_MATRIX.json` |

---

## 3. Tech Stack Contract

### Framework / tooling
- **Monorepo root:** pnpm workspaces, Node ≥ 20
- **Design Hub:** Next.js App Router (`.nezam/design-hub/`), port 4000
- **Contracts:** Markdown + YAML under `.nezam/core/`, `.cursor/`
- **Sync:** `pnpm ai:sync` / `pnpm ai:check` — never edit generated mirrors by hand

### Backend (product apps built *with* NEZAM)
- Not fixed by NEZAM itself; user projects choose stack per PRD
- NEZAM ships validation scripts (Node), not a production API

### Infrastructure
- **CI:** GitHub Actions (onboarding, design gates, wireframe schema, AI drift)
- **Hosting:** Design Hub local dev; consumer apps deploy per their PRD

---

## 4. Data Architecture Summary

NEZAM is primarily **file-based state**, not a single app database:

```
.cursor/state/onboarding.yaml     → prd_locked, design_locked, phases
.cursor/state/agent-bus.yaml      → handoffs
.nezam/core/plans/                 → SDD phase artifacts
wireframes_locked.json            → approved UI contract
DESIGN.md                           → token + component contract
```

**Naming:** kebab-case dirs; `F-###` feature spec IDs; semver in `CHANGELOG.md`

---

## 5. Feature Index (P0)

| ID | Feature | Spec path |
|---|---|---|
| F-001 | Design Hub wireframe lock pipeline | `docs/plan/00-define/specs/F-001-design-hub.md` |
| F-002 | Multi-client AI sync (`pnpm ai:sync`) | `docs/plan/00-define/specs/F-002-ai-sync.md` |
| F-003 | SDD slash commands & hardlock gates | `docs/plan/00-define/specs/F-003-sdd-gates.md` |

---

## 6. Decision Rules

1. **Canonical source is `.cursor/`** — commands, agents, skills, rules. Run `pnpm ai:sync` after edits.
2. **No `/DEVELOP` on UI** without `wireframes_locked.json` and root `DESIGN.md`.
3. **No `/plan`** without `prd_locked` and `design_locked` in `onboarding.yaml`.
4. **Reports** only under `docs/reports/<category>/` — never repo root or `.nezam/core/` for generated scans.
5. **MENA content** → Egyptian Arabic (Masri) default when Arabic is required; RTL parity mandatory.
6. When uncertain on design tokens → use CSS variables from `DESIGN.md`; never hardcode hex/spacing in components.

---

## 7. UI/UX Contract (Design Hub + consumers)

- **Tokens:** semantic `app-*` and design-system variables; map in `tailwind.config.ts`
- **Theme:** `document.documentElement` class for light/dark
- **Wireframes:** Architecture page IDs are source of truth; sessions at `.session/pages/{archPageId}.json`
- **Accessibility:** WCAG 2.2 AA target; reduced-motion alternatives for non-essential motion
- **Empty states:** every screen documents loading / empty / error / success in feature specs

---

## 8. API Contract (Design Hub app)

- Next.js route handlers under `.nezam/design-hub/src/app/api/`
- JSON in/out for project context, wireframe sessions, export formats
- Errors: `{ error: string, code?: string }` with HTTP 4xx/5xx
- Auth: local dev only unless extended by deploy profile

---

## 9. Acceptance Criteria (P0 summary)

| Feature | Done when |
|---|---|
| F-001 | User can run `pnpm design-hub`, approve wireframes, export `wireframes_locked.json`; CI validates schema |
| F-002 | `pnpm ai:check` passes after `.cursor/` edits; no CRITICAL rule drift |
| F-003 | `/START gates` and onboarding script pass; `/plan` respects hardlocks |

---

## 10. Forbidden Patterns

- Editing `CLAUDE.md`, `AGENTS.md`, `.claude/` as source of truth
- Skipping wireframe lock for screen-level UI
- Hardcoded colors/spacing outside token files
- Generated audit output in repo root or `.nezam/core/` (use `docs/reports/`)
- Placeholder `{{TOKENS}}` left in committed PRD or PROJECT_PROMPT

---

## 11. Agent Routing Hints

| Domain | Lead agents |
|---|---|
| Planning | `swarm-leader`, `project-architect` |
| Design | `lead-uiux-designer`, `design-hub-specialist` |
| Frontend | `lead-frontend-architect`, `frontend-lead` |
| Gates / QA | `lead-qa-architect`, `a11y-performance-auditor` |

Use `agent-bus.yaml` for MODE B/C handoffs.

---

## 12. File & Folder Conventions

```
.cursor/          ← edit here
.nezam/core/      ← PRD, plans, gates, scripts
.nezam/design-hub/ ← Design Hub app
docs/start/       ← intake PRD + PROJECT_PROMPT
docs/plan/        ← user project phase docs
docs/reports/     ← generated outputs only
DESIGN.md         ← active design contract
```

---

## 13. Versioning

- SemVer for NEZAM releases; entries in root `CHANGELOG.md`
- PRD version tracked in PRD header (currently v2.1)
- Run `pnpm prd:roadmap` after PRD milestone table changes
