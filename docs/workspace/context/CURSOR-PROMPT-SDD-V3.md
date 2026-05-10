# Cursor Prompt — SDD Pipeline v3
# Paste this into Cursor chat (Cmd+L) to activate the full upgrade.

---

```prompt
You are operating inside the NEZAM workspace. Read and apply these rules immediately before doing anything else:

1. .cursor/rules/sdd-pipeline-v2.mdc         ← SDD v3 pipeline (all 4 product types)
2. .cursor/rules/workspace-orchestration.mdc  ← hardlocks, memory, recommendation footer
3. .cursor/rules/plan-phase-scaffold.mdc      ← scaffold gate before development
4. .cursor/rules/multi-tool-sync.mdc          ← cross-tool sync contract

Confirm you have read all four files, then output this status card:

---
NEZAM v3 Rules Loaded

Pipeline types supported:
  website  → Content-first: Idea→Validate→Research→IA→Content→Arch→Design→Scaffold→Build→Harden→Ship
  webapp   → Arch-first:    Idea→Validate→Research→Arch→IA→Design→Content→Scaffold→Build→Harden→Ship
  saas     → Billing-first: Idea→Validate→Research→Arch→IA→Design→Content→SEO→Scaffold→Build→Harden→Ship
  mobile   → Offline-first: Idea→Validate→Research→Arch→IA→Design→Content→Scaffold→Build→Harden→Ship

Monorepo:  Supported (TurboRepo structure + shared packages)
Scaffold:  Hardlocked gate before BUILD for all types

Type /PLAN idea to start a new project.
Type /GUIDE status to check an existing project.
---
```

---

## HOW THE PIPELINE WORKS PER TYPE

### Starting a new project

```prompt
/PLAN idea

My project is: [describe your idea]

Detect the product type automatically (website / webapp / saas / mobile).
If it's a monorepo (multiple apps), flag that too.
Run the correct pipeline order for the detected type.
Show me the pipeline steps before we begin.
```

---

### Starting a Website

```prompt
/PLAN idea

I want to build a website for [describe].

This is a WEBSITE type project. Apply the content-first pipeline:
  Research → IA (nav from keywords) → Content → Architecture → Design → Scaffold → Build

Before we touch design, I need:
1. SEO keyword research done
2. Every page and its URL slug locked
3. Every page's copy brief written

Do not let me start design until those three are complete.
Run /PLAN seo first.
```

---

### Starting a Web Application

```prompt
/PLAN idea

I want to build a web application: [describe].

This is a WEBAPP type project. Apply the architecture-first pipeline:
  Research → Architecture (data model + auth + roles) → IA (flows) → Design → Content → Scaffold → Build

Before we touch any screen design, I need:
1. Full data model locked (entities, relations, constraints)
2. Auth model locked (roles, permissions, session strategy)
3. API contract outlined (endpoints, request/response shapes)

Run /PLAN arch first after the PRD is locked.
```

---

### Starting a SaaS Platform

```prompt
/PLAN idea

I want to build a SaaS platform: [describe].

This is a SAAS type project. Apply the billing-first pipeline:
  Research → Architecture + Multi-tenancy + Billing model → IA → Design → Content → SEO → Scaffold → Build

Critical locks before any code:
1. Multi-tenancy model locked (schema-per-tenant vs row isolation — this determines the database structure)
2. Billing model locked (plans, limits, upgrade/downgrade flow — this cannot change mid-build)
3. Auth model locked (roles: owner / admin / member / viewer)

The SaaS has TWO separate UI contexts:
- The authenticated app (architecture-first)
- The public marketing site (content-first, SEO-driven)

Plan both. Start with the architecture.
Run /PLAN arch first.
```

---

### Starting a Mobile Application

```prompt
/PLAN idea

I want to build a mobile app: [describe].

This is a MOBILE type project. Apply the offline-first pipeline:
  Research → Architecture (offline sync + push + native APIs) → IA (navigation pattern) → Design → Content → Scaffold → Build

Critical locks before any screen design:
1. Offline strategy locked (what works offline, sync model, conflict resolution)
2. Navigation pattern locked (tab bar / stack / drawer — cannot change mid-build)
3. Platform confirmed (iOS only / Android only / both — affects architecture)
4. Native API requirements listed (camera, location, biometrics, push)

Run /PLAN arch first. Flag all native API requirements in the architecture doc.
```

---

### Starting a Monorepo / TurboRepo Project

```prompt
/PLAN idea

I want to build a project with multiple apps: [describe — e.g., marketing website + SaaS app + mobile app].

This is a MONOREPO project. After PRD and architecture are locked, create MONOREPO.md defining:

1. App packages (apps/):
   - apps/web    → marketing website (website pipeline)
   - apps/app    → web application or SaaS (webapp/saas pipeline)
   - apps/mobile → mobile app (mobile pipeline)
   - apps/api    → backend API (api pipeline)

2. Shared packages (packages/):
   - packages/ui      → shared component library
   - packages/types   → shared TypeScript types
   - packages/utils   → shared utility functions
   - packages/config  → shared tsconfig, eslint, tailwind configs
   - packages/db      → shared database client + Prisma/Drizzle schema

3. TurboRepo pipeline config (turbo.json)

4. pnpm workspace config (pnpm-workspace.yaml)

Apply the correct pipeline ORDER per app inside the monorepo.
The website follows content-first. The SaaS app follows billing-first.
Generate the FULL monorepo scaffold before any app development begins.

Run /PLAN arch first to define the system-wide architecture.
Then run /PLAN scaffold to generate the full TurboRepo tree.
```

---

## SCAFFOLD COMMAND (all types)

Run this after all planning docs are complete, before writing any code:

```prompt
/PLAN scaffold

Generate the complete project file tree for a [website / webapp / saas / mobile / monorepo] project.

Read these planning documents:
- docs/workspace/plans/00-define/PRD.md
- docs/workspace/plans/02-architecture/ARCHITECTURE.md (or the correct path for this type)
- docs/workspace/plans/04-design/DESIGN.md (or equivalent)
- docs/workspace/plans/03-ia/IA_CONTENT.md (or equivalent)

Then produce:
1. docs/workspace/plans/0N-scaffold/PROJECT_SCAFFOLD.md
   - Full annotated directory tree (every folder and file)
   - Each file: purpose + owner agent + which SDD phase creates it
   - Config files: env, tsconfig, package.json, CI configs
   - Test file locations mirroring source structure

2. scripts/scaffold.sh
   - Idempotent bash script (mkdir -p + touch)
   - Safe to run multiple times
   - Creates all directories and empty stub files

Show me the full tree in chat before running the script.
Ask me to confirm before executing scripts/scaffold.sh.
```

---

## GUIDE STATUS (check any project)

```prompt
/GUIDE status

Detect the product type from docs/workspace/plans/00-define/PRD.md.
Show the correct pipeline order for that type.
Show which steps are complete vs missing.
Show the next action I should take — as an exact command, terminal command, or copy-ready prompt.
```

---

## DIAGNOSTIC: Fix an existing project

```prompt
/SCAN full

Audit this project against NEZAM v3 SDD standards.

1. What product type is this? (website / webapp / saas / mobile / monorepo)
2. Is the pipeline order correct for that type?
   - Website: is Content before Design? Is SEO before IA?
   - SaaS: is multi-tenancy model and billing model locked before any code?
   - Mobile: is offline strategy and navigation pattern locked before design?
3. Are all SDD planning docs present for this type?
4. Is PROJECT_SCAFFOLD.md confirmed before development started?
5. Does the folder structure match the correct type scaffold?
6. For Monorepo: is MONOREPO.md defined? Is turbo.json configured?

Output a prioritized fix list:
  🔴 Critical  → blocks development
  🟡 Important → will cause drift later
  🟢 Nice to have → quality improvement
```
