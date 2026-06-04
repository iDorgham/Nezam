# SEO Research — NEZAM (Open-Source SDD Workspace)

| Field | Value |
|---|---|
| Document | SEO_RESEARCH.md |
| Status | Locked |
| Product type | Developer tool / open-source framework |
| Primary surface | GitHub README, future docs site, npm package discovery |
| Last updated | 2026-05-29 |
| PRD | `.nezam/core/plans/00-define/01-product/PRD.md` |

---

## 1. Search intent map

| Intent cluster | Example queries | User goal | NEZAM answer |
|---|---|---|---|
| **AI dev workflow** | "cursor rules for projects", "ai coding governance" | Structure AI-assisted builds | SDD pipeline + hardlocks + agent swarm |
| **Spec-driven** | "specification driven development ai", "sdd template" | Traceable specs before code | PRD → plans → specs → develop |
| **Multi-tool sync** | "cursor claude sync agents", "AGENTS.md workflow" | One contract across IDEs | `pnpm ai:sync` from `.cursor/` |
| **Design systems + AI** | "wireframe lock before development", "design tokens ci" | Prevent UI drift | Design Hub + `wireframes_locked.json` + token gates |
| **MENA / RTL** (secondary) | "arabic rtl design system cursor" | Regional product builds | Swarm 14, Masri specialists, RTL gates |

**Primary intent:** *Informational + commercial investigation* — developers evaluating whether to fork/adopt NEZAM vs raw Cursor rules.

---

## 2. Keyword clusters → page mapping

| Cluster | Target URL (future docs site) | Primary keyword | Secondary keywords |
|---|---|---|---|
| Product overview | `/` | AI specification driven development | nezam workspace, sdd framework |
| Quick start | `/docs/start` | cursor workspace template | nezam github, fork nezam |
| Commands | `/docs/commands` | nezam slash commands | /plan /develop /start |
| Design Hub | `/docs/design-hub` | wireframe lock json | design hub nezam, localhost 4000 |
| Agents & swarms | `/docs/agents` | cursor agent swarm | nezam agents yaml |
| Gates & CI | `/docs/gates` | sdd hardlock | onboarding gate prd design |
| Compare | `/docs/compare` | cursor rules vs sdd | ai governance framework |

**GitHub (now):** README H1/H2 target *"Specification-driven development workspace for Cursor and multi-AI clients"* — avoid generic "AI template".

---

## 3. Slug & URL rules (permanent)

| Rule | Policy |
|---|---|
| Docs slugs | Lowercase kebab-case, English only |
| No dates in URLs | Use `.nezam/core/plans/` versioning in repo, not public URLs |
| Command pages | `/docs/commands/<command>` mirrors slash command name |
| Anchor stability | Slug changes require redirect note in CHANGELOG |

**Locked slugs (P0):**

- `/` · `/docs/start` · `/docs/commands` · `/docs/design-hub` · `/docs/gates` · `/docs/agents`

---

## 4. Title & meta templates

| Page | Title (≤60 chars) | Meta description (≤155 chars) |
|---|---|---|
| Home | NEZAM — SDD Workspace for AI-Native Teams | Govern Cursor, Claude, and Codex with specs, design locks, agent swarms, and CI gates. Open source. |
| Start | Get Started with NEZAM \| SDD in 10 Minutes | Lock your PRD, apply a design profile, run /plan and /develop with hardlocks that block unsafe work. |
| Design Hub | Design Hub — Wireframes & Tokens \| NEZAM | Approve architecture and wireframes locally; export wireframes_locked.json before development. |
| Gates | SDD Gates & Hardlocks \| NEZAM | PRD, DESIGN.md, wireframes, and scaffold must pass before /develop. Automated in CI. |

---

## 5. Structured data (future docs site)

- **SoftwareSourceCode** on GitHub landing (via README link)
- **HowTo** for "Run NEZAM onboarding" (steps: clone → pnpm install → /START all → /plan all)
- **FAQPage** for hardlock failures (common /plan blocked messages)

---

## 6. Competitor gap analysis

| Competitor | Strength | Gap NEZAM fills |
|---|---|---|
| Raw `.cursorrules` | Fast setup | No pipeline, no memory, no multi-tool sync |
| Spec Kit / Kiro specs | Spec focus | Weak design/wireframe lock + swarm governance |
| Antigravity / generic templates | Commands | No canonical gate matrix or CI enforcement |
| Backstage / internal portals | Enterprise | Too heavy for solo AI-native builders |

**Positioning sentence (SEO):** *NEZAM is the only open-source workspace that enforces planning → locked design → scaffolded develop across every AI client you use.*

---

## 7. Content SEO priorities (P0 → P2)

| Priority | Action | Owner phase |
|---|---|---|
| P0 | README keywords + shields + deep links to `docs/start/` | Ship (done in README v2) |
| P0 | `docs/start/PRD.md` + `PROJECT_PROMPT.md` indexable on GitHub | Define |
| P1 | Dedicated docs site (Astro/Next SSG) from `.nezam/core/plans/03-content/` | Build |
| P1 | Blog/changelog entries per major gate (v2.1 Design Hub) | Ship |
| P2 | Arabic/MENA landing variant if `target_market` includes mena | Research extension |

---

## Decision Amendments

| Date | Changed field | Previous | New | Reason | Approved by |
|---|---|---|---|---|---|
| 2026-05-29 | Initial lock | — | Framework SEO, not SaaS keywords | Product is OSS governance kit | PM-01 |
