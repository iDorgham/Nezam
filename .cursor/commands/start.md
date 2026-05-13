/START — Initialize a new project in this workspace

## Path resolution

Before performing any file operation, read `.nezam/gates/workspace.paths.yaml` and resolve:

- `prd` → default `.nezam/workspace/prd/PRD.md`
- `plans_root` → default `.nezam/workspace/plans`
- `reports_root` → default `docs/reports`

If the file is missing or a key is absent, fall back to the default values above.
All references to `.nezam/workspace/prd/PRD.md`, `docs/plan/`, and `docs/reports/` in this command
use these resolved paths. Users can relocate any of them with `/nezam paths set`.

## What /START does

When a user runs `/start` (with or without a subcommand), Claude scaffolds the project folder structure under `docs/` and guides the user through creating their PRD. The workspace governance files live in `.nezam/workspace/` and must not be touched.

**Pre-flight check:**

1. Read `HANDOFF_QUEUE.yaml` at workspace root.
   - If `active_session.session_id` is populated AND any queue item has status `pending` or `in_progress`, resume from that context immediately. Do not accept new work until the queue item is resolved or explicitly deferred.
   - If queue is empty or all items are `complete`, proceed normally.

---

## Subcommands

  /START             → Interactive: ask the user for their project idea, then scaffold docs/ and create a draft PRD
  /START docs        → Scaffold .nezam/workspace/prd/, docs/plan/, docs/reports/ if they don't exist, show status
  /START prd         → Open .nezam/workspace/prd/PRD.md in guided mode — ask user questions and fill it in together
  /START gates       → Run all prerequisite checks. Shows ✅/❌ per gate in plain language.
  /START repo        → Link or initialize the git repository
  /START settings    → Jump to AI tools setup (onboarding shortcut)
  /START design      → Browse `.nezam/design/<brand>/`, pick one, copy to root DESIGN.md
  /START companion   → Generate a briefing you can paste into any external AI (Claude.ai, Gemini, ChatGPT)
  /START continual-learning → Opt-in: enable transcript mining (`pnpm continual-learning:on`)
  /START all         → Run repo → settings → docs → prd → gates → design → companion in sequence

Aliases: /START check → /START gates

---

## Behavior: /START (no subcommand)

When the user runs `/start` with no subcommand, execute the onboarding flow following `docs/start.md`:

### Step 1: Initialize the Workspace
Verify that the environment is ready. Check if the required templates exist in `.nezam/templates/folders`.

### Step 2: Define Your Product (PRD)
The user must drop their `PRD.md` file into `docs/start/`.
Prompt the user:
> "Please drop your `PRD.md` file into `docs/start/` to begin. Type READY when done."

When the user types READY, verify that `docs/start/PRD.md` exists and has content.

### Step 3: Choose Your Design System
Prompt the user to select and apply a design system:
> "Please choose your design system. Run `pnpm run design:apply -- <brand>` to apply a brand design to the root `DESIGN.md`. Type READY when done."

When the user types READY, verify that `DESIGN.md` exists at the repository root.

### Step 4: Scaffold Folders
Copy the required folder templates (`plan/` and `reports/`) from `.nezam/templates/folders` to the `docs/` directory.

### Step 5: Specialize PRD & Create Project Prompt
- Read `docs/start/PRD.md`.
- Rewrite it to align with NEZAM's structured format (e.g., save it as `docs/plan/00-define/01-product/PRD.md`).
- Create `PROJECT_PROMPT.md` in `docs/plan/00-define/01-product/`.

### Step 6: Generate the Execution Plan
Inform the user that the workspace is ready for planning:
> "Workspace initialized. Run `/plan` to generate your execution roadmap."

### Step 7: Cleanup
Delete `docs/start.md` and the `docs/start/` directory as they are no longer needed.

## Behavior: /START prd

Guide the user through filling in `.nezam/workspace/prd/PRD.md` interactively:

Ask these questions one at a time (don't dump all at once):

1. What is the product name?
2. What problem does it solve in one sentence?
3. Who is the primary user and what's their job-to-be-done?
4. What are the 3 most critical requirements (P0)?
5. What is explicitly out of scope?
6. How will you know this is successful? (key metric)

After answers, write a complete PRD.md to `.nezam/workspace/prd/PRD.md` and confirm:
> "PRD saved. Run `/plan` to generate your execution roadmap."

---

## Behavior: /START docs

Check and scaffold the project folder structure (paths from `.nezam/gates/workspace.paths.yaml`):

```
docs/
├── prd/
│   └── PRD.md           ← create if missing (from .nezam/templates/sdd/PRD_TEMPLATE.md)
├── plans/
│   └── .gitkeep         ← empty folder, no README
└── reports/
    ├── progress/.gitkeep
    ├── tests/.gitkeep
    ├── audits/.gitkeep
    ├── a11y/.gitkeep
    ├── security/.gitkeep
    ├── perf/.gitkeep
    └── lighthouse/.gitkeep
```

Do NOT touch or modify anything inside `.nezam/workspace/` — that is the workspace governance layer.

Show status after:

```
✅ .nezam/workspace/prd/PRD.md exists
✅ docs/plan/ exists (empty — /plan will scaffold phases)
✅ docs/reports/ exists with 7 category folders
```

---

## Behavior: /START gates

Run these checks and report ✅ / ❌:

| Gate | Check |
|------|-------|
| PRD exists | `{prd_path}` is filled in (not a blank template) |
| Plans scaffold | `{plans_root}/` exists |
| Reports scaffold | `{reports_root}/` exists with category sub-folders |
| DESIGN.md | Root `DESIGN.md` exists |
| Git initialized | `.git/` exists |
| Workspace governance | `.nezam/workspace/` exists (NEZAM files intact) |
| Path config | `.nezam/gates/workspace.paths.yaml` exists |

If PRD gate fails: prompt user to run `/start prd`
If plans gate fails: prompt user to run `/plan` after PRD is ready

---

## Folder Separation Rule

```
.nezam/workspace/   ← NEZAM workspace governance (DO NOT MODIFY during /start)
.nezam/workspace/prd/     ← User's project PRD (default; relocatable via /nezam paths)
docs/plan/   ← User's project plans (default; relocatable via /nezam paths)
docs/reports/ ← User's project reports (default; relocatable via /nezam paths)
```

The `/start` command only creates and modifies files in:

- `{prd_path}` and its parent folder
- `{plans_root}/`
- `{reports_root}/` and its category sub-folders
- Root `DESIGN.md` (design subcommand only)

To change any of these paths: use `/nezam paths set <key> <value>`.
To modify workspace agents, rules, or templates: use `/nezam`.

---

## Multi-tool sync note

After any governance change, non-Cursor clients should verify:

- Compare `.cursor/rules/workspace-orchestration.mdc` against mirror in your tool's root
- If drift: emit `⚠️ Sync drift detected — run pnpm ai:sync before proceeding.`

---

Hard blocks: none (START is always available)
Recommendation footer: required

---

## Session Closure

[LAST STEP] Write session closure entry to `HANDOFF_QUEUE.yaml` under `session_history`:

- session_id: generate a short slug (date + topic)
- summary: 2-3 sentence description of what was accomplished
- phases_advanced: list any SDD phases that moved forward
- agents_invoked: list all agents called during the session
- artifacts_created: list all files created or materially modified
- ended_at: ISO timestamp
