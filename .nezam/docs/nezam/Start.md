# START

Welcome. You are about to turn your product idea into a build-ready plan.

This document is your friendly path from "new workspace" to "ready to develop" using the project hardlocks in a safe order.

## What success looks like

You are ready when:

- `/PLAN` is unlocked
- planning files are complete and aligned
- `/DEVELOP start` passes hardlocks

## Big picture flow

1. Connect repo to GitHub
2. Add real PRD + project prompt
3. Validate onboarding gates
4. Run planning
5. Prepare architecture + design
6. Start development with confidence

## Step 1 — Connect to GitHub (first hardlock)

Make sure your local repo is connected and pushed online.

```sh
git remote -v
git push -u origin <branch>
```

If no remote is set, add your GitHub repo link first.  
If branch is not pushed, planning and development should remain blocked.

## Step 2 — Add your real intake docs

Create and complete:

- `.nezam/core/prd/PRD.md`
- `.nezam/core/prd/PROJECT_PROMPT.md`

Important:

- PRD must be real content (not template/placeholder text)
- PRD and prompt must describe the same product scope and intent
- Preferred intake flow is file-first: add `.nezam/core/prd/PRD.md` directly.
- Optional helper flow: run `/CREATE prd` if you want guided brainstorming and PRD drafting support.

Tip: write clearly in simple language and focus on user outcomes.

## Step 3 — Ensure gate manifest exists

Required file:

- `.nezam/core/gates/GITHUB_GATE_MATRIX.json`

## Step 4 — Check onboarding readiness

Run this command:

```sh
pnpm run check:onboarding
```

If it fails, follow the printed errors one-by-one.  
When it passes, your planning hardlock is unlocked.

## Step 5 — Build your plan

Recommended order:

1. `/START gates`
2. `/PLAN all`
3. Confirm active subphases include:
   - `prompt.json`
   - `PROMPT.md`

At this stage, your product plan should be clear and actionable.

## Step 6 — Get development-ready

Before `/DEVELOP`:

- Architecture doc exists:
  - `.nezam/core/architecture/ARCHITECTURE.md` (preferred), or
  - `.nezam/core/architecture/ARCHITECTURE.md` (legacy)
- Design contracts locked:
  - Run `/DESIGN` or `/START design` to launch the **NEZAM Design Hub** on port `4000`.
  - Map your project's Information Architecture with the **5-Level Sitemap Hierarchy** (`App` → `NavMenu` → `Page` → `Sub-page` → `Section`) and define backend API service bindings.
  - Tune typography, layout scales, and color semantical custom properties in the `ThemePanel` and `DesignSystemPanel`.
  - Click **"Lock & Sync"** in the Design Hub to compile and write:
    - **`DESIGN.md`** at the repository root.
    - **`wireframes_locked.json`** at the repository root.
  - Alternately, you can apply a pre-made design profile from the catalog via terminal: `pnpm run design:apply -- <brand-name>`

## Quick commands

```sh
pnpm run check:onboarding
pnpm ai:sync
pnpm ai:check
```

## Final note

You are building a real product, not just files.  
Use hardlocks as your quality safety net, and keep moving step by step.

