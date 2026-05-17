/WIREFRAME — Launch the NEZAM Wireframe Server (Human-in-the-Loop Design Gate)

## What this command does

Bridges the gap between planning and development. The wireframe server is a **mandatory gate** between DESIGN and SCAFFOLD phases. It converts the AI's interpretation of your PRD into a structured canvas where YOU make the final calls — then locks those decisions into a machine-readable contract that developer agents read as gospel.

**The contract:**
1. Agent writes → `project_context.json` (AI suggestions from PRD + IA + DESIGN)
2. You review → localhost:4000 (approve/adjust pages, blocks, tokens)
3. Server exports → `wireframes_locked.json` (your decisions, locked)
4. Agents read → `wireframes_locked.json` (builds exactly what you approved)

---

## Path resolution

Before any file operation, read `.nezam/gates/hardlock-paths.json` and resolve paths.

Context file output: `project_context.json` (repo root)
Lock file output: `wireframes_locked.json` (repo root)
Schema files: `.nezam/templates/wireframe-server/`
Block registry: `.nezam/templates/wireframe-server/block_registry.json`

---

## Pre-flight gate

Before running this command, verify ALL of the following exist:

| File | Gate |
|---|---|
| `docs/plan/00-define/01-product/PRD.md` | ✅ required |
| `docs/plan/00-define/01-product/PROJECT_PROMPT.md` | ✅ required |
| `DESIGN.md` | ✅ required |
| `docs/plan/02-ia/IA_CONTENT.md` | ✅ required |

If any are missing:
> ❌ Wireframe gate blocked. Missing: [list files]. Complete planning phases first.

---

## Subcommands

  /wireframe             → Generate project_context.json + start instructions
  /wireframe generate    → Generate project_context.json only (no server start)
  /wireframe validate    → Check if wireframes_locked.json exists and validates
  /wireframe status      → Show current wireframe session status

---

## Behavior: /wireframe (no subcommand)

### STEP 1 — Read all source documents

Read in this order:
1. `docs/plan/00-define/01-product/PRD.md` — full PRD
2. `docs/plan/00-define/01-product/PROJECT_PROMPT.md` — tech stack, decisions
3. `DESIGN.md` — design tokens, color profile, typography
4. `docs/plan/02-ia/IA_CONTENT.md` — sitemap, navigation structure, user flows

Extract from these documents:
- All pages with routes, types (public/auth/admin), and access controls
- Navigation structure decisions
- Design token values (colors, typography, spacing)
- Product type (website/webapp/saas/mobile)
- RTL requirement
- Feature IDs per page (from PRD Feature Registry)

---

### STEP 2 — Determine canvas_mode

| If product_type is | canvas_mode |
|---|---|
| website, landing | web-marketing |
| webapp, saas | saas-dashboard |
| mobile | mobile-app |
| tui, cli | tui |

---

### STEP 3 — Load block registry and select blocks per page

Read `.nezam/templates/wireframe-server/block_registry.json`.

For each page in the sitemap:
1. Identify the page's purpose (from PRD/IA)
2. Select appropriate blocks from the registry that match the canvas_mode
3. Order blocks logically (nav → hero/header → content sections → footer)
4. Write an `ai_rationale` for each block explaining why it was chosen
5. Suggest initial props for configurable block props

**Block selection logic:**
- Homepage / landing: Nav + Hero + Features + Social Proof + CTA + Footer
- Dashboard home: Nav_Sidebar + Dashboard_StatsRow + Dashboard_SplitPanel
- List/data page: Nav_Sidebar + Header_PageTitle + Grid_DataList
- Detail page: Nav_Sidebar + Header_PageTitle + Card_Entity + Table_Data
- Auth page: Form_Auth (centered-card, no nav)
- Settings: Nav_Sidebar + Header_PageTitle + Form_Settings
- Mobile screen: Nav_BottomTab + Header_AppBar + appropriate content blocks

---

### STEP 4 — Generate design_system suggestions

From `DESIGN.md`, extract existing token values if they exist.
For any tokens not in DESIGN.md, suggest sensible defaults based on:
- product_type
- target_market (MENA → consider Islamic design sensibilities, warm/trustworthy palettes)
- visual mood (from PRD or design spec)

Label all AI-generated tokens as "suggested" — the user will confirm or override in the server.

---

### STEP 5 — Write project_context.json

Validate against `.nezam/templates/wireframe-server/project_context.schema.json`.

Write to: `project_context.json` (repo root)

Show summary:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐  PROJECT CONTEXT GENERATED — {{PROJECT_NAME}}

Canvas mode:   {{canvas_mode}}
Pages:         {{N}} ({{N_P0}} P0 · {{N_P1}} P1 · {{N_P2}} P2)
Nav type:      {{primary_nav_type}}
Blocks mapped: {{TOTAL_BLOCKS}} across all pages
RTL:           {{YES / NO}}
Color profile: {{suggested_profile}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### STEP 6 — Start wireframe server

Tell the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  WIREFRAME SERVER READY

Start the server:
  cd apps/wireframe-server
  pnpm dev

Then open: http://localhost:4000

Your project context has been pre-loaded. The server will show you:

  1. Sitemap — approve or edit your page hierarchy
  2. Wireframes — review AI-suggested block layout per page
  3. Design Tokens — confirm or adjust colors, typography, spacing
  4. State Review — check loading/empty/error states

When you're done, click "Lock & Export" in the server.
This generates: wireframes_locked.json

Then return here and type: /wireframe validate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for user to run the server and complete their session.

---

### STEP 7 — After user types /wireframe validate

Check:
1. `wireframes_locked.json` exists at repo root
2. Validate against `.nezam/templates/wireframe-server/wireframes_locked.schema.json`
3. Verify all P0 pages have `layout_approved: true`
4. Verify `design_system` section has all required color tokens (no missing hex values)

If passes:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  WIREFRAME SESSION LOCKED — {{PROJECT_NAME}}

Pages approved:    {{N_APPROVED}} / {{N_TOTAL}}
Pages deferred:    {{N_DEFERRED}}
Design tokens:     {{N_TOKENS}} finalized
Nav structure:     {{primary_nav_type}} + {{mobile_nav_type}}
Session duration:  {{DURATION_MIN}} minutes

🔓  /SCAFFOLD → UNLOCKED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Update `.cursor/state/onboarding.yaml`:
```yaml
wireframe_complete: true
wireframe_locked_at: "<ISO_TIMESTAMP>"
```

If validation fails:
- List specific errors with field paths
- Tell user to return to the server and fix, then re-export
- Do NOT unlock /SCAFFOLD until `wireframes_locked.json` is valid

---

## Hard rule for developer agents

When developer agents are about to build any UI component:

1. Read `wireframes_locked.json`
2. Find the page and section that corresponds to what they're building
3. Use `locked_props` exactly — do not override
4. Use `navigation_map` for all nav structure — do not invent nav items
5. Use `design_system` tokens — do not hardcode colors or spacing
6. If a page is in `implementation_contract.deferred_pages` — do not scaffold it

**If `wireframes_locked.json` does not exist:**
> ❌ Developer agents are blocked. Run `/wireframe` and complete the design session before building any UI.

---

## Session Closure

Write to `HANDOFF_QUEUE.yaml`:

```yaml
session_history:
  - session_id: "<date>-wireframe-<project_slug>"
    summary: "Wireframe session complete. {{N}} pages approved, {{N}} deferred. Design tokens finalized."
    phases_advanced: ["design-wireframe"]
    artifacts_created:
      - project_context.json
      - wireframes_locked.json
    ended_at: "<ISO_TIMESTAMP>"
```
