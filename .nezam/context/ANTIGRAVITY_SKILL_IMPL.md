# NEZAM Skill Upgrade Plan — Antigravity Implementation Prompts
> Run each prompt block in Antigravity in the order listed.  
> Each prompt is self-contained — no prior context needed.  
> All 24 changes follow the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md`.

---

## How to use this file

1. Open Antigravity.
2. Copy the prompt block for the current phase item.
3. Paste into Antigravity and run.
4. Move to the next block only after the current one completes.
5. After all Phase 0–5 items are done, run the final sync command.

---

## Phase 0 — Foundation Skills (run first, others depend on these)

---

### [B-1] CREATE `.cursor/skills/design/design-context-init/SKILL.md`

```
Create a new file at `.cursor/skills/design/design-context-init/SKILL.md`.

This is a brand-new NEZAM skill. Use the canonical template format found at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with the following exact content and structure:

---
skill_id: "design/design-context-init"
name: "design-context-init"
description: "Run before any design work on an unfamiliar codebase — extracts full UI context (components, layouts, routes, tokens, pages, extractable components) into 6 structured files in .cursor/context/design-init/."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release — superdesign INIT methodology adapted for NEZAM.
owner: "design-lead"
tier: 1
sdd_phase: "Design"
rtl_aware: true
certified: false
dependencies:
  - "design/design-tokens"
  - "design/css-architecture"
---

# Design Context Init

## Purpose

Collect and document the full design context of the current codebase before any design iteration begins. Produces 6 structured reference files that every subsequent design skill depends on. Without this, design work operates blind.

## Trigger Conditions

- Starting design work on a codebase for the first time.
- Any of the 6 output files are missing from `.cursor/context/design-init/`.
- Any output file is stale (source UI files have changed since the file was last written — check by comparing file modification timestamps).
- Explicitly invoked via `/START design` or `design-context-init`.

## Prerequisites

- Access to the full codebase (read all component, layout, and style files).
- `DESIGN.md` exists at the repo root (design token contract).
- Tailwind config file exists (`tailwind.config.ts` or `tailwind.config.js`).

## Procedure

1. **Create output directory** `.cursor/context/design-init/` if it does not exist.

2. **Write `components.md`**  
   - Find all UI primitive component files (Button, Input, Select, Card, Badge, Modal, etc.) — typically in `components/ui/`, `src/components/`, or `app/components/`.  
   - Write the FULL source code of each file. No excerpts. No summaries.  
   - Group by component type. Include the file path as a heading above each component's source.

3. **Write `layouts.md`**  
   - Find all shared layout files (RootLayout, PageLayout, DashboardLayout, Sidebar, Header, Footer).  
   - Write the FULL source code of each. Include file path headings.

4. **Write `routes.md`**  
   - Map every route/page entry point.  
   - Format: `route path → file path → primary components used`.  
   - Include dynamic routes (e.g., `/[id]`), API routes if relevant to UI, and layout wrappers per route.

5. **Write `theme.md`**  
   - Extract ALL CSS custom properties (variables) from `globals.css` or equivalent.  
   - Extract ALL Tailwind config values (colors, spacing, fontFamily, borderRadius, animation, etc.).  
   - Extract ALL design tokens from `DESIGN.md`.  
   - Format: section per token category (Color, Spacing, Typography, Radius, Shadow, Motion).  
   - Zero omissions — if a token exists, it is in this file.

6. **Write `pages.md`**  
   - For each key page (prioritize: home, dashboard, auth pages, most-visited):  
     - List all components imported (direct and transitive).  
     - List all tokens consumed (which CSS variables / Tailwind classes are used).  
     - Note which components are page-specific vs shared.

7. **Write `extractable-components.md`**  
   - List components that are repeated across 2+ pages but not yet in `components/ui/`.  
   - For each: current location, current prop surface (if any), recommended extraction name.  
   - Also list any components in `components/ui/` that are overly monolithic and could be split.

8. **Write timestamp** — append to each file: `> Last updated: <ISO timestamp>. Re-run if source files changed.`

## Output Artifacts

- `.cursor/context/design-init/components.md`
- `.cursor/context/design-init/layouts.md`
- `.cursor/context/design-init/routes.md`
- `.cursor/context/design-init/theme.md`
- `.cursor/context/design-init/pages.md`
- `.cursor/context/design-init/extractable-components.md`

## Validation Checklist

- [ ] All 6 files exist in `.cursor/context/design-init/`
- [ ] `components.md` contains full source, not excerpts
- [ ] `theme.md` contains every CSS variable from `globals.css` and every token from `DESIGN.md`
- [ ] `routes.md` covers all app entry points (check `app/` or `pages/` directory count matches)
- [ ] No file contains placeholder text like "TODO" or "..."
- [ ] All files have the timestamp footer

## Handoff Target

`design/design-iteration-protocol` — use the init files as ground truth for all subsequent design work. Also feeds `design/design-to-code-handoff`, `design/wireframe-pipeline`, `design/interaction-choreography`.
```

---

### [B-6] CREATE `.cursor/skills/design/design-iteration-protocol/SKILL.md`

```
Create a new file at `.cursor/skills/design/design-iteration-protocol/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this exact content:

---
skill_id: "design/design-iteration-protocol"
name: "design-iteration-protocol"
description: "Enforces the two-step design discipline: Step A pixel-perfect ground-truth reproduction → Step B exactly 2 branch variations. Applies to all design work in NEZAM."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release — adapted from superdesign two-step SOP for NEZAM.
owner: "design-lead"
tier: 1
sdd_phase: "Design"
rtl_aware: true
certified: false
dependencies:
  - "design/design-context-init"
  - "design/wireframe-pipeline"
---

# Design Iteration Protocol

## Purpose

Enforce a non-negotiable two-step discipline for all design work: first reproduce the current design at 100% fidelity (ground truth), then and only then produce exactly 2 structured variations. Prevents design drift, ensures baseline documentation, and enforces comparison-based decision making.

## Trigger Conditions

- Starting any design iteration on an existing screen or component.
- Reviewing a design before handing off to development.
- Any design work requiring stakeholder review.
- Explicitly invoked via `design-iteration-protocol`.

## Prerequisites

- `.cursor/context/design-init/` files are current (run `design-context-init` first).
- `DESIGN.md` is finalized and current.
- The target screen/component is identified.

## Procedure

### Step A — Ground Truth Reproduction (non-skippable)

1. Locate the current implementation of the target screen/component in `.cursor/context/design-init/components.md` or `pages.md`.
2. Document the exact current state as a baseline spec:
   - Exact markup structure (element hierarchy).
   - Complete class list / token usage.
   - All states (default, hover, focus, active, disabled, loading, error, empty).
   - Responsive behavior (desktop and mobile).
3. Write the baseline spec to `.cursor/context/design-init/baseline-<screen-slug>.md`.
4. **Do not interpret or improve — reproduce faithfully.** If the current design has problems, document them as annotations, not corrections.
5. Get explicit approval of the baseline before proceeding to Step B. (In solo work: write "Baseline approved" in the spec file and proceed.)

**Step A is skipped ONLY when:** The target is a fully new screen with zero existing reference. Even then, run `design-context-init` first to understand the token/component environment.

### Step B — Branch Variations (exactly 2)

1. Starting from the approved baseline, produce exactly **2 variations**. Never 1. Never 3+.
2. **Variation A — Evolutionary:** Closest to the existing design system. Changes one element only (e.g., tighten spacing, update hierarchy, improve contrast). All tokens must come from `theme.md`.
3. **Variation B — Progressive:** Pushes one design dimension deliberately. Changes one axis boldly (e.g., layout density, visual weight, interaction pattern). Must still use existing tokens — if a new token is needed, propose it explicitly.
4. Each variation spec includes:
   - What changed (one sentence).
   - Why (design rationale, one sentence).
   - Token diff (which tokens are used differently vs baseline).
   - RTL impact (if `rtl_aware: true` — note any directional changes).
5. Write variation specs to:
   - `.cursor/context/design-init/variation-<screen-slug>-A.md`
   - `.cursor/context/design-init/variation-<screen-slug>-B.md`

### Step C — Selection & Lock

1. Present both variations to the decision-maker (or self-select in solo work).
2. Document the selection in `docs/plans/design/DESIGN_CHOICES.yaml`.
3. The selected variation becomes the new baseline for the next iteration cycle.

## Output Artifacts

- `.cursor/context/design-init/baseline-<screen-slug>.md`
- `.cursor/context/design-init/variation-<screen-slug>-A.md`
- `.cursor/context/design-init/variation-<screen-slug>-B.md`
- Updated `docs/plans/design/DESIGN_CHOICES.yaml`

## Validation Checklist

- [ ] Baseline file exists and contains full current-state reproduction (not a redesign)
- [ ] Exactly 2 variations exist (not 1, not 3)
- [ ] Both variations use only tokens from `theme.md` (no hardcoded values)
- [ ] Each variation changes only one design dimension
- [ ] RTL impact is noted for each variation
- [ ] Selection is recorded in `DESIGN_CHOICES.yaml`

## Handoff Target

Selected variation spec → `design/design-to-code-handoff` → `development`.
```

---

### [A2-7] CREATE `.cursor/skills/system/adr/SKILL.md`

```
Create a new file at `.cursor/skills/system/adr/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "system/adr"
name: "adr"
description: "Creates Architecture Decision Records as executable specs for coding agents — not just documentation. Triggered whenever a technology choice, architectural pattern, or infrastructure decision is introduced."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release — Vercel ADR skill methodology adapted for NEZAM agent-executable format.
owner: "project-architect"
tier: 1
sdd_phase: "Planning"
rtl_aware: false
certified: false
dependencies:
  - "system/spec-writing"
---

# Architecture Decision Record (ADR)

## Purpose

Capture architecture decisions as executable specs that a coding agent can implement without asking follow-up questions. An ADR that cannot guide an agent to implementation is incomplete.

## Trigger Conditions

- A PR introduces a new library, framework, or infrastructure component not previously in the codebase.
- A design pattern is chosen over an alternative (e.g., REST vs GraphQL, JWT vs session auth).
- An existing architectural choice is being reversed or superseded.
- `system/spec-writing` escalates due to a technology choice within a spec.
- Explicitly invoked via `/PLAN` or `adr`.

## Prerequisites

- Existing ADRs have been reviewed (`docs/adr/` directory).
- Current tech stack is known (`package.json` reviewed).
- At least 2 alternatives have been considered.

## Procedure

### Phase 1 — Codebase Scan
1. Read all existing ADRs in `docs/adr/` to understand prior decisions.
2. Read `package.json` to map the current tech stack.
3. Identify which existing decisions are related to the current choice.
4. Assign the next sequential ADR number (e.g., if last is `0003`, next is `0004`).

### Phase 2 — Socratic Questions (answer before drafting)
Answer all 5 questions:
1. What specific problem is this decision solving? (1 sentence)
2. What are the 2–3 alternatives considered? (list)
3. What constraints eliminate the alternatives? (list per alternative)
4. What does success look like in 6 months? (1–2 sentences)
5. What would make this decision wrong? (1–2 sentences)

### Phase 3 — Write the ADR
Use this exact format:

```markdown
# ADR-XXXX: [Decision Title in Title Case]

**Status:** proposed | accepted | deprecated | superseded  
**Date:** YYYY-MM-DD  
**Supersedes:** ADR-XXXX (if applicable)  
**Superseded by:** ADR-XXXX (if applicable)

## Context

[2–3 sentences: what problem prompted this decision, what constraints exist]

## Decision

[Exactly one sentence: what was decided. Start with "We will use..." or "We will adopt..."]

## Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| [Option A] | [Reason] |
| [Option B] | [Reason] |

## Implementation Plan

1. [Concrete step an agent can execute]
2. [Concrete step an agent can execute]
3. [Concrete step an agent can execute]

## Consequences

### Positive
- [Benefit]

### Negative  
- [Trade-off]

### Risks
- [Risk + mitigation]

## Agent-Readiness Checklist

- [ ] All required packages are identified (names + versions)
- [ ] All required environment variables are named
- [ ] Breaking changes to existing code are documented
- [ ] Migration path from old approach is described (if superseding)
- [ ] Acceptance criteria are testable assertions
```

### Phase 4 — Agent-Readiness Review
Ask: "Could a coding agent implement this decision from the ADR alone, without asking questions?"  
If no → identify the gap and fill it before saving.

Save to: `docs/adr/XXXX-<kebab-case-title>.md`

Create `docs/adr/` directory if it does not exist.

## Output Artifacts

- `docs/adr/XXXX-<kebab-title>.md`

## Validation Checklist

- [ ] ADR number is sequential (no gaps)
- [ ] Status field is set (not left as placeholder)
- [ ] Implementation Plan has ≥3 concrete, agent-executable steps
- [ ] Agent-Readiness Checklist has no unchecked critical items
- [ ] Related ADRs are cross-referenced
- [ ] Saved to `docs/adr/` directory

## Handoff Target

`system/spec-writing` (if spec needs updating) or directly to the relevant development skill.
```

---

### [A2-8] CREATE `.cursor/skills/system/agents-md/SKILL.md`

```
Create a new file at `.cursor/skills/system/agents-md/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "system/agents-md"
name: "agents-md"
description: "Governs the creation, maintenance, and quality of NEZAM agent definitions in .cursor/agents/. Ensures every agent has a trigger contract, I/O contract, handoff target, and eval framework."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "swarm-leader"
tier: 1
sdd_phase: "Planning"
rtl_aware: false
certified: false
dependencies:
  - "system/multi-agent-handoff"
---

# Agents MD Governance

## Purpose

Ensure every agent in the NEZAM swarm has a complete, versioned, executable definition. Agent files are living contracts — not static role descriptions. An agent definition that cannot deterministically trigger, execute, and hand off is incomplete.

## Trigger Conditions

- Creating a new agent for the swarm.
- Modifying an existing agent's scope, trigger conditions, or handoff targets.
- Running `pnpm ai:sync` (validate before sync).
- Reviewing agent quality during sprint planning.

## Prerequisites

- `.cursor/agents/README.md` exists (agent index).
- `.cursor/agents/EVAL_FRAMEWORK.md` exists (quality measurement baseline).

## Procedure

### Creating a new agent

1. **Single-responsibility test:** Describe the agent in one sentence. If you cannot, split it.
2. **Create the file:** `.cursor/agents/<agent-slug>.md`
3. **Required sections:**
   - `# <Agent Name>` — title
   - `## Role` — one sentence
   - `## Trigger Conditions` — exact conditions that activate this agent (not vague)
   - `## Input Contract` — what the agent receives (format, source skill/agent)
   - `## Output Contract` — what the agent produces (format, destination)
   - `## Procedure` — deterministic steps
   - `## Handoff Target` — named agent or skill (never "next step" or "TBD")
   - `## Failure Mode` — what happens when it fails, and the fallback behavior
   - `## Eval Criteria` — 3–5 measurable quality signals
4. **Add changelog entry** at the bottom: `## Changelog\n- 1.0.0: Initial definition.`
5. **Register in `README.md`** — add to the agent index table.

### Modifying an existing agent

1. Read the current definition.
2. Increment the version (patch for procedure changes, minor for scope changes, major for role changes).
3. Add changelog entry with date and description.
4. If handoff target changes, update the source and destination agents to reflect the new chain.

### Quality gate (run on all agents before `pnpm ai:sync`)

Each agent must pass:
- [ ] Role describable in ≤1 sentence
- [ ] Trigger Conditions are exact (no "when needed" or "as appropriate")
- [ ] Handoff Target names a specific agent or skill (no vague targets)
- [ ] Failure Mode specifies a concrete fallback (not "log error and stop")
- [ ] Eval Criteria has ≥3 measurable signals

## Output Artifacts

- `.cursor/agents/<agent-slug>.md` (new or updated)
- Updated `.cursor/agents/README.md`

## Validation Checklist

- [ ] Single-responsibility test passed (one-sentence role)
- [ ] All 8 required sections present
- [ ] Handoff target is a named, existing agent or skill
- [ ] Failure mode has a concrete fallback
- [ ] Changelog updated with version bump
- [ ] Registered in README agent index

## Handoff Target

After agent creation/update: run `pnpm ai:sync` to propagate to `.opencode/agents/` and `.claude/agents/`.
```

---

## Phase 1 — Design Skill Upgrades

---

### [B-2] UPGRADE `.cursor/skills/design/design-to-code-handoff/SKILL.md`

```
Read the current file at `.cursor/skills/design/design-to-code-handoff/SKILL.md`.

Rewrite it completely. Keep the frontmatter name and description but upgrade the version to 2.0.0 and add the changelog entry. Replace the entire body with the upgraded content below.

Write this exact upgraded version:

---
name: design-to-code-handoff
description: "Transfers finalized design specs to development with full context: ground-truth component references, recursive import trees, token maps, and RTL verification."
version: 2.0.0
updated: 2026-05-12
changelog:
  - 2.0.0: Major upgrade — added ground-truth-first discipline, recursive import tracing, context file selection rules, large-file handling, and superdesign-informed handoff checklist.
  - 1.0.0: Initial release.
---

# Design to Code Handoff

## Purpose

Eliminate the "Lost in Translation" gap between design and development by transferring not just specs but full context: the exact existing component structure, complete token map, recursive import tree, and RTL requirements. Developers receive everything needed for 100% fidelity implementation with zero ambiguity.

## Trigger Conditions

- A design variation has been selected via `design/design-iteration-protocol`.
- `/PLAN design` phase is complete and development is ready to begin.
- A component or screen is being implemented for the first time.

## Prerequisites

- `.cursor/context/design-init/` files are current (all 6 files exist and are not stale).
- `DESIGN.md` is finalized.
- Selected variation spec exists in `.cursor/context/design-init/variation-<screen>-*.md`.
- `docs/plans/design/DESIGN_CHOICES.yaml` reflects the approved selection.

## Procedure

### 1. Ground-Truth Reference (non-skippable)

Before specifying anything new, locate the closest existing component in `.cursor/context/design-init/components.md`.

- Document the **exact current markup structure** (element hierarchy, tag names).
- Document the **complete class list** (every Tailwind class or CSS class applied).
- Document the **token usage** (which CSS variables from `theme.md` are consumed).
- The new component must match this structure unless a deliberate, documented deviation is approved. Deviations are noted in the handoff doc as: `DEVIATION: [what changed] — REASON: [why]`.

### 2. Recursive Import Tracing

For the component being handed off:

1. List all direct UI imports (components imported by this component).
2. For each direct import, list its imports (one level deeper).
3. Continue until you reach leaf components (no further UI imports).
4. Document the full tree in format:
   ```
   <TargetComponent>
   ├── <SubComponentA> (from components.md line XX)
   │   └── <LeafComponent> (from components.md line XX)
   └── <SubComponentB> (from components.md line XX)
   ```
5. **Do not hand off a partial tree.** Every node in the tree must be accounted for.

### 3. Context File Selection

Include these context files in the handoff document (reference by path, not by copying):

| Scenario | Required context files |
|---|---|
| New UI component | `theme.md` + component's own source + all direct UI imports |
| New page | `layouts.md` + `theme.md` + page's dependency tree from `pages.md` |
| Modifying existing component | `theme.md` + component source + full import tree |
| New token needed | `theme.md` + `DESIGN.md` + token proposal |

### 4. Large File Handling

For files >1000 lines:
- Extract only the relevant component section (from its opening tag/function to its closing).
- Always include the full import block at the top of that section.
- Never truncate token definitions — include the complete token map even if long.

### 5. Spec Document

Write `docs/plans/design/HANDOFF_<screen-slug>.md` containing:

```markdown
# Handoff: <Screen/Component Name>

## Ground Truth Reference
[Closest existing component path + markup structure + class list + tokens consumed]

## Deviation Log
[Any approved deviations from ground truth — EMPTY if none]

## Import Tree
[Full recursive import tree]

## Context Files
[List of files developers must read]

## Component Spec
[Spacing, typography, colors — all referenced as tokens, none hardcoded]
[All states: default, hover, focus, active, disabled, loading, error, empty]
[Responsive: desktop (1440px) + mobile (390px)]
[RTL: directional property handling if rtl_aware]

## Token Map
[Every token consumed — token name → value from theme.md]

## Acceptance Criteria
[Testable assertions for QA]
```

### 6. Asset Preparation

- Icons/images: SVG or WebP, paths documented.
- Fonts: licensed, paths provided.
- All assets follow the token naming convention.

## Output Artifacts

- `docs/plans/design/HANDOFF_<screen-slug>.md`
- `docs/plans/design/COMPONENT_INVENTORY.md` (updated)
- Updated root `DESIGN.md` (if new tokens were introduced)

## Validation Checklist

- [ ] Ground-truth reference documents the closest existing component
- [ ] Any deviation from ground truth is explicitly logged with reason
- [ ] Import tree is complete (all nodes accounted for, no partial tree)
- [ ] All token references are from `theme.md` — zero hardcoded hex/px/rem values
- [ ] All component states are specified (default, hover, focus, active, disabled, loading, error, empty)
- [ ] Responsive specs cover desktop (1440px) and mobile (390px)
- [ ] RTL mirror verified for all directional properties (if `rtl_aware: true`)
- [ ] Context file list is complete per the selection table above
- [ ] Acceptance criteria are testable assertions (not vague descriptions)

## Handoff Target

`development` — the implementing engineer or coding agent receives the HANDOFF doc and implements from it directly.
```

---

### [B-3] UPGRADE `.cursor/skills/design/wireframe-pipeline/SKILL.md`

```
Read the current file at `.cursor/skills/design/wireframe-pipeline/SKILL.md`.

Rewrite it completely. Upgrade version to 4.0.0. Preserve all existing Phase 1, 2, and 3 content but add new sections before Phase 1 and strengthen the validation rules.

Write this exact upgraded version:

---
name: wireframe-pipeline
description: "Unified wireframe generation and spec engine with mandatory pixel-perfect reproduction gate, design-system fidelity enforcement, and 2-variation discipline."
version: 4.0.0
updated: 2026-05-12
changelog:
  - 4.0.0: Major upgrade — added Phase 0 pixel-perfect reproduction gate, DESIGN.md as hard constraint, 2-variation discipline, branch vs replace mode decision logic.
  - 3.0.0: Initial merge of wireframe-catalog and wireframe-to-spec-converter.
---

# Wireframe Pipeline

## Purpose

Unified design-to-spec engine. Produces implementation-ready contracts from any source (Figma, Excalidraw, text interview). Enforces design-system fidelity as a hard constraint — not a guideline.

## Phase 0: Ground Truth Gate (mandatory — runs before any wireframe work)

**This phase cannot be skipped for existing screens. It can only be skipped for fully new greenfield screens with zero existing reference.**

1. Run `design/design-context-init` if `.cursor/context/design-init/` files are missing or stale.
2. Locate the current implementation of the target screen in `pages.md` and `components.md`.
3. Reproduce the current screen at **100% fidelity** using existing tokens and components. No improvements, no corrections — faithful reproduction only.
4. Write the reproduction as `baseline-<screen-slug>.md` in `.cursor/context/design-init/`.
5. Document any design problems found as **annotations** in the baseline (not fixes).
6. Only proceed to Phase 1 after the baseline is written and confirmed.

**DESIGN.md is a hard constraint from this point forward:**
- Every wireframe element must be expressible using tokens defined in `DESIGN.md` and `theme.md`.
- Any element that requires a value not in `DESIGN.md` is a **token gap** — flag it explicitly with `TOKEN GAP: [what is missing]`. Do not work around it with one-off values.
- Token gaps must be resolved via `design/design-token-architecture` before the wireframe is finalized.

## Phase 1: Ingestion & Analysis

Identify the source of truth for the UI design.

### Mode A: Figma MCP (Primary)
- Use Figma MCP to read frame data.
- Extract: names, components, layout constraints, auto-layout rules.
- Map to NEZAM vocabulary in `DESIGN.md`.

### Mode B: Excalidraw/Penpot JSON
- Parse element IDs, labels, groupings, and spatial arrangement.
- Infer layout intent and generate structure.

### Mode C: Text Interview (Fallback)
- Conduct structured interview to define layout goals and component placement.
- Flag output as `source: text-interview`.

## Phase 2: High-Fidelity Generation with Variation Discipline

Generate wireframes following the 2-variation rule.

**Variation discipline (non-negotiable):**
- Always produce exactly **2 variations** per wireframe iteration. Never 1. Never 3+.
- Variation A: evolutionary — closest to existing design system, changes one element.
- Variation B: progressive — pushes one design dimension deliberately.
- Never present a single wireframe as "the design."

**Iteration mode:**
- **Branch mode (default):** Variations extend from the Phase 0 baseline. Use for exploring alternatives.
- **Replace mode:** A new direction replaces the baseline entirely. Use ONLY when baseline is confirmed broken by UX research. Document the replace-mode decision in the wireframe spec header.

### Quality Standard
1. **Grid structure**: column count, named zones.
2. **Component slots**: named with variant — all from `components.md`.
3. **Content hierarchy**: H1/H2/H3/body/caption zones.
4. **All interaction states**: default, hover, focus, active, loading, empty, error.
5. **Spacing annotations**: named tokens from `theme.md` (xs/sm/md/lg/xl) — never raw px values.
6. **Responsive pair**: desktop (1440px) + mobile (390px).
7. **Accessibility map**: tab order, landmarks, ARIA roles.
8. **Token compliance**: every color, spacing, and radius value maps to a named token.

## Phase 3: Deterministic Spec Conversion

Transform wireframes into explicit component contracts.

### Output Artifacts
1. `docs/plans/design/WIREFRAMES.md`: Full wireframes and specs (both variations).
2. `docs/plans/design/DESIGN_CHOICES.yaml`: Locked selection data.
3. `docs/plans/design/COMPONENT_INVENTORY.md`: Every component, variant, and state.
4. Updated root `DESIGN.md`: New tokens if token gaps were resolved.
5. `.cursor/context/design-init/baseline-<screen-slug>.md`: Phase 0 reproduction.
6. `.cursor/context/design-init/variation-<screen-slug>-A.md` and `-B.md`.

### Component Spec Format (YAML)
```yaml
screen_id: "[id]"
layout_intent: "[purpose]"
iteration_mode: "branch | replace"
baseline_ref: ".cursor/context/design-init/baseline-[slug].md"
components:
  - name: "[Name]"
    variants: ["default", "variant"]
    states: ["default", "loading", "error", "empty"]
    props_contract: ["prop1", "prop2"]
    tokens_consumed: ["--color-primary", "--spacing-md"]
responsive_rules: ["rules"]
interaction_notes: ["notes"]
accessibility_notes: ["notes"]
direction_notes: ["rtl/ltr handling"]
token_gaps: []
```

## Validation Checklist

- [ ] Phase 0 baseline exists (or greenfield exception is documented)
- [ ] DESIGN.md was consulted — every value maps to a token
- [ ] Token gaps are explicitly flagged (not silently worked around)
- [ ] Exactly 2 variations produced
- [ ] Iteration mode (branch/replace) is documented in spec header
- [ ] Both variations differ by exactly one design dimension
- [ ] All spacing annotations use named tokens, not raw px values
- [ ] Responsive specs cover desktop (1440px) and mobile (390px)
- [ ] RTL handling is documented for all directional elements

## Trigger
- Invoked during `/PLAN design` or whenever wireframe/spec generation is required.
- Standalone activation via `wireframe-pipeline`.
```

---

### [B-4] UPGRADE `.cursor/skills/design/interaction-choreography/SKILL.md`

```
Read the current file at `.cursor/skills/design/interaction-choreography/SKILL.md`.

Rewrite it completely. Upgrade version to 2.0.0. Preserve the core Motion Principles, Micro-interactions, and Page Transitions content but add variation discipline, branch/replace logic, token enforcement, and context file requirements.

Write this exact upgraded version:

---
name: interaction-choreography
description: "Defines motion, transitions, and micro-interactions with structured 2-variation discipline, token enforcement, and branch vs replace mode decision logic."
version: 2.0.0
updated: 2026-05-12
changelog:
  - 2.0.0: Major upgrade — added structured variation count (2), branch/replace decision logic, motion token enforcement, context file requirements.
  - 1.0.0: Initial release.
---

# Interaction Choreography

## Purpose

Define how elements move and interact over time. Ensures transitions are purposeful, performant, and token-compliant. Every interaction pattern ships as a comparative pair — never a single "the animation."

## Trigger Conditions

- Designing motion for a new component or screen.
- Reviewing or updating the `MOTION_CONTRACT.md`.
- `design/wireframe-pipeline` has produced a finalized spec with interaction notes.

## Prerequisites

- `.cursor/context/design-init/theme.md` is current (contains existing motion variables).
- `.cursor/context/design-init/components.md` is current (contains components' current transition state).
- `DESIGN.md` motion section is accessible.

## Procedure

### 1. Context Read (always first)

Before defining any motion:
1. Read `.cursor/context/design-init/theme.md` — extract all existing motion tokens (duration-*, easing-*, animation-*).
2. Read the target component's current transition state from `.cursor/context/design-init/components.md`.
3. Document what motion, if any, the component currently has. This is the baseline.

### 2. Motion Principles

- Define the "Brand Physics" (e.g., snappy/energetic vs smooth/liquid) — must align with `DESIGN.md` brand section.
- Establish duration tokens: reference existing `theme.md` tokens first. Only propose new tokens if the needed duration does not exist.
- Standardize easing curves: reference existing `theme.md` easing tokens first.

**Token enforcement rule:** Motion values must reference tokens in `DESIGN.md` and `theme.md`. If a needed motion value has no token, propose the token via `design/design-token-architecture` first — do not hardcode millisecond or cubic-bezier values inline.

### 3. Micro-interactions (with 2-variation discipline)

For every interaction pattern, produce exactly **2 variations**:

- **Variation A:** Conservative — uses existing duration and easing tokens unchanged. Changes only which tokens are applied (e.g., fast vs base duration).
- **Variation B:** Progressive — adjusts one motion dimension (e.g., adds spring physics, changes easing curve, adds delay sequence).

**Iteration mode:**
- **Branch mode (default):** Both variations extend from the current transition baseline.
- **Replace mode:** A fundamentally different interaction pattern. Requires UX research justification. Documented in the motion spec header.

Define for all standard interactions:
- State transitions: buttons (hover, active, loading), inputs (focus, error).
- List animations: entry/exit.
- Feedback: success, error, warning states.

### 4. Page Transitions (with 2-variation discipline)

Same 2-variation rule applies to page-level transitions:
- Variation A: simple (fade only, or slide only).
- Variation B: enriched (shared element transition, staggered entry).

Always:
- Define loading states (shimmer/skeleton) as part of the motion sequence.
- Implement `prefers-reduced-motion` fallback for every motion definition. Reduced-motion fallback = instant (no transition) or opacity-only.

### 5. RTL Motion Considerations

For directional motion (slides, reveals, drawer open/close):
- Define LTR and RTL variants explicitly.
- Directional tokens: use `start`/`end` logical properties, not `left`/`right`.

## Output Artifacts

1. `docs/plans/design/MOTION_CONTRACT.md` — duration, easing, token map, 2-variation pairs.
2. `docs/plans/design/INTERACTION_STATES.md` — visual and motion specs for all interactive components.
3. Updated root `DESIGN.md` — motion primitives section (if new tokens proposed).
4. `.cursor/context/design-init/variation-motion-<component>-A.md` and `-B.md`.

## Validation Checklist

- [ ] All motion values reference tokens from `theme.md` — zero hardcoded ms or cubic-bezier values inline
- [ ] Every interaction pattern has exactly 2 variations (not 1, not 3+)
- [ ] Iteration mode (branch/replace) is documented for each pattern
- [ ] `prefers-reduced-motion` fallback defined for every motion
- [ ] All animations use hardware-accelerated properties (`transform`, `opacity`) — no layout-triggering props
- [ ] No layout shifts (CLS) caused by animations
- [ ] RTL directional motion uses logical properties
- [ ] Token gaps flagged and escalated to `design/design-token-architecture`

## Handoff Target

`design/design-to-code-handoff` → development implementation of motion spec.
```

---

### [B-5] UPGRADE `.cursor/skills/design/component-library-api/SKILL.md`

```
Read the current file at `.cursor/skills/design/component-library-api/SKILL.md`.

Add the following new sections to the end of the existing SKILL.md. Do NOT rewrite the entire file — only append. Before appending, increment the version to the next minor version and add a changelog entry.

Add this content at the end of the file (after the last existing section):

---

## Component Extraction Workflow

When extracting a component from an existing page into a reusable primitive, follow this exact sequence:

**Step 1 — Document current implementation**  
Read the full source from `.cursor/context/design-init/components.md` or the current page file. Copy the exact current implementation as the starting point.

**Step 2 — Separate hardcoded from configurable**  
Go through every value in the component and classify:
- **Hardcoded (must stay):** base layout structure, element hierarchy, spacing rhythm, animation trigger points.
- **Configurable (becomes a prop):** content (text, icons), visual variant (primary/secondary/ghost), size (sm/md/lg), interactive state (disabled, loading), slot content.

**Step 3 — Define the prop surface explicitly (before writing any code)**  

Document the complete API in this format:
```
Component: <Name>
Hardcoded: [list what stays fixed — layout, structure, base animation]
Props:
  - variant: 'primary' | 'secondary' | 'ghost' | 'destructive'
  - size: 'sm' | 'md' | 'lg'
  - disabled: boolean
  - loading: boolean
  - children: ReactNode
  - className?: string (for external composition only — not for overriding internals)
Slots: none | header | footer | icon-start | icon-end
Emits: onClick, onChange, onFocus (only if stateful)
Tokens consumed: [list from theme.md]
RTL: [note any directional props — use 'start'/'end' not 'left'/'right']
```

**Step 4 — Rule: layout is never a prop**  
Props control appearance and content. Layout (grid structure, flex direction, spacing between elements) is hardcoded. Passing layout values as props creates unpredictable composition — reject this pattern.

## Extraction Validation Checklist

- [ ] All visual states enumerated as variants or handled internally (default, hover, focus, disabled, loading, error)
- [ ] No layout values passed as props (layout is hardcoded)
- [ ] All token references documented in "Tokens consumed"
- [ ] Directional props use logical notation (`iconPosition: 'start' | 'end'`, not `'left' | 'right'`)
- [ ] `className?` prop is for external composition only — documented as not for internal overrides
- [ ] Component passes RTL test: works correctly when `dir="rtl"` is set on parent
- [ ] Component added to `.cursor/context/design-init/components.md` after extraction
```

---

### [B-7] UPGRADE `.cursor/skills/design/brand-visual-direction/SKILL.md`

```
Read the current file at `.cursor/skills/design/brand-visual-direction/SKILL.md`.

Add the following new sections after the existing content. Increment the version to the next minor version and add a changelog entry.

Append this content:

---

## DESIGN.md as Non-Negotiable Authority

`DESIGN.md` at the repo root is not a reference — it is the **hard constraint** for all brand decisions.

**Rule 1 — Token-first brand decisions:**  
Any brand direction (new color, new typeface, new radius system) must be expressible via named tokens in `DESIGN.md`. If a brand direction requires a value not currently in `DESIGN.md`, that value must be formally added as a token first (via `design/design-token-architecture`) before appearing in any design output or code.

**Rule 2 — No direct value usage:**  
Brand outputs (visual mockups, component specs, motion specs) never contain raw hex values, raw rem/px values, or raw cubic-bezier values. They contain token names that map to those values. The mapping lives in `DESIGN.md` — the output uses only the name.

**Rule 3 — Design-system sync gate:**  
After any brand direction update (new campaign, rebrand, seasonal variation), `DESIGN.md` must be updated in the same PR as the design change. Brand direction and design system are never allowed to diverge. A PR that updates visual brand without updating `DESIGN.md` is rejected at code review.

## Brand Drift Prevention

Run a brand audit before any major design change:

1. Read all components in `.cursor/context/design-init/components.md`.
2. Scan for any hardcoded values: hex colors, px/rem spacing not referenced via a token variable, hardcoded font sizes.
3. Flag each finding as a **drift violation** — severity HIGH.
4. Document in `docs/plans/design/BRAND_AUDIT.md`.

**Drift audit rating:**
| Finding | Severity | Action |
|---|---|---|
| Hardcoded hex color | HIGH | Replace with token before any new design work |
| Hardcoded spacing (px/rem without token) | HIGH | Replace with token |
| Missing token in DESIGN.md for value in use | MEDIUM | Add token to DESIGN.md |
| Component using deprecated token name | LOW | Schedule rename |

**Policy:** A brand audit with any HIGH findings blocks design iteration. Resolve HIGH findings before proceeding.

## Brand Audit Validation Checklist

- [ ] No hardcoded hex values found in components
- [ ] No hardcoded spacing values found (all via token variables)
- [ ] `DESIGN.md` contains all values currently in use
- [ ] Brand audit report saved to `docs/plans/design/BRAND_AUDIT.md`
- [ ] `DESIGN.md` updated in same PR as any brand direction change
```

---

## Phase 2 — Backend Core Upgrades

---

### [A1-1] UPGRADE `.cursor/skills/backend/prisma-orm/SKILL.md`

```
Read the current file at `.cursor/skills/backend/prisma-orm/SKILL.md`.

Add the following content to the existing file. Increment the version to 2.0.0 and add a changelog entry noting: "Added adapter pattern, transaction isolation levels, $queryRaw safety rule, cursor pagination as default, result extensions, and validation rule update."

Append these new sections after the existing "# Anti-Patterns" section:

---

## Advanced Patterns (Prisma 6)

### PrismaClient with Adapter (Edge/Serverless)
```ts
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })
```
Use the adapter pattern for Vercel Edge Functions, Cloudflare Workers, and any serverless environment. Do NOT use the standard PrismaClient without an adapter in edge runtimes.

### $transaction with Isolation Levels
```ts
const result = await prisma.$transaction(
  async (tx) => {
    const user = await tx.user.findUnique({ where: { id } })
    await tx.account.update({ where: { userId: id }, data: { balance: { decrement: amount } } })
    return user
  },
  {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 5000,   // ms to wait for transaction slot
    timeout: 10000,  // ms max transaction duration
  }
)
```

### $queryRaw Safety — MANDATORY RULE
**Always use the `Prisma.sql` template tag. Never concatenate strings into raw queries.**

```ts
// ✅ SAFE — parameterized via Prisma.sql
const result = await prisma.$queryRaw(
  Prisma.sql`SELECT * FROM "User" WHERE email = ${userEmail}`
)

// ❌ UNSAFE — SQL injection risk — NEVER DO THIS
const result = await prisma.$queryRaw(
  `SELECT * FROM "User" WHERE email = '${userEmail}'`
)
```

### Cursor Pagination (default over offset)
```ts
// First page
const firstPage = await prisma.post.findMany({
  take: 20,
  orderBy: { id: 'asc' },
})

// Subsequent pages — cursor is the last ID from previous page
const nextPage = await prisma.post.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastId },
  orderBy: { id: 'asc' },
})
```
**Rule:** Default to cursor pagination for all list queries. Only use offset (`skip`/`take` without cursor) for small result sets (<100 rows) where the user navigates by page number.

### Result Extensions ($extends)
```ts
const xprisma = prisma.$extends({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`
        },
      },
    },
  },
})
// Usage: const user = await xprisma.user.findUnique(...) → user.fullName available
```

## Updated Validation Rules

In addition to existing validation:
- [ ] Schema uses `adapter` flag (not deprecated `previewFeatures` for driver adapters)
- [ ] All `$queryRaw` calls use `Prisma.sql` template tag — never string concatenation
- [ ] Cursor pagination used for all list queries >20 results
- [ ] `$transaction` calls specify `isolationLevel` when operating on financial or inventory data
- [ ] Edge/serverless deployments use PrismaClient with adapter (not standard client)
```

---

### [A1-2] UPGRADE `.cursor/skills/backend/resend-email/SKILL.md`

```
Read the current file at `.cursor/skills/backend/resend-email/SKILL.md`.

Add the following content. Increment the version and add a changelog entry: "Added full delivery architecture, deliverability setup checklist, compliance matrix, idempotent send pattern, suppression check procedure."

Append after the last existing section:

---

## Email Delivery Architecture

All transactional email flows must follow this architecture:

```
User Action → Email Form/Trigger
  → Input Validation (sanitize, check format)
  → Double Opt-In Flow (for marketing — not required for transactional)
  → Suppression List Check (GET /suppressions — skip if suppressed)
  → Idempotent Send (include Idempotency-Key header)
  → Webhook Event Handler (delivered / bounced / complained / unsubscribed)
  → Suppression Update (auto-add bounces/complaints to suppression list)
```

## Deliverability Setup Checklist (mandatory before first send)

- [ ] SPF record added: `v=spf1 include:amazonses.com ~all` (Resend uses Amazon SES infrastructure)
- [ ] DKIM CNAME records from Resend dashboard added to DNS (3 records)
- [ ] DMARC policy set: `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com`
- [ ] Custom domain verified in Resend dashboard (green status)
- [ ] Test email sent and passed mail-tester.com score ≥9/10

## Compliance Matrix

| Regulation | Requirement | Implementation |
|---|---|---|
| CAN-SPAM (US) | Physical address in email footer | Add company address to all email templates |
| CAN-SPAM | One-click unsubscribe | `List-Unsubscribe` header + unsubscribe link in footer |
| GDPR (EU) | Lawful basis for processing | Store consent timestamp + IP at opt-in |
| GDPR | Right to erasure | Suppress email on delete request, delete from Resend contacts |
| CASL (CA) | Express consent required | Double opt-in mandatory for Canadian recipients |

## Idempotent Send Pattern

Always include an idempotency key for transactional emails to prevent duplicate sends on retry:

```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

const { data, error } = await resend.emails.send(
  {
    from: 'noreply@yourdomain.com',
    to: recipientEmail,
    subject: 'Your order confirmation',
    react: OrderConfirmationEmail({ orderId }),
  },
  {
    headers: {
      'Idempotency-Key': `order-confirm-${userId}-${orderId}`,
    },
  }
)
```

Key format rule: `<template-slug>-<user-id>-<unique-resource-id>` — unique per user + resource combination.

## Suppression Check (before every send)

Before sending any email, check if the recipient is suppressed:

```ts
const suppressions = await resend.contacts.list({ audienceId: process.env.RESEND_AUDIENCE_ID })
const isSuppressed = suppressions.data?.data?.some(c => c.email === recipientEmail && c.unsubscribed)
if (isSuppressed) return { skipped: true, reason: 'suppressed' }
```

For high-volume sends, cache the suppression list (TTL: 5 minutes) to avoid rate limiting.

## Updated Validation Checklist

- [ ] Deliverability setup checklist complete before first production send
- [ ] All marketing emails use double opt-in flow
- [ ] All transactional sends include `Idempotency-Key` header
- [ ] Suppression check runs before every send
- [ ] Webhook handler processes bounce/complaint events and updates suppression list
- [ ] Company address present in all email footers (CAN-SPAM)
- [ ] Unsubscribe mechanism present in all non-transactional emails
```

---

### [A1-3] UPGRADE `.cursor/skills/backend/vercel-ai-sdk/SKILL.md`

```
Read the current file at `.cursor/skills/backend/vercel-ai-sdk/SKILL.md`.

Add the following content. Increment version and add changelog entry: "Added live-model verification requirement, ToolLoopAgent pattern, streamText vs generateText decision matrix, SDK version warning."

Prepend this WARNING block at the very top of the body (after frontmatter), before any existing content:

---

> ⚠️ **CRITICAL — SDK CHANGES FREQUENTLY**  
> Everything you know about the Vercel AI SDK may be outdated. Model IDs, API signatures, and provider configurations change with each release. **Always verify against the live source before implementing:** https://github.com/vercel/ai  
> Always import from `ai` — NOT from the deprecated `@vercel/ai` package.

---

Then append these new sections after the last existing section:

---

## Live Model ID Verification (mandatory at setup time)

Never hardcode model IDs. Fetch available models before selecting:

```bash
curl https://ai-gateway.vercel.sh/v1/models | jq '.data[].id'
```

Run this during environment setup. Store the selected model ID in environment variables — never in source code.

## streamText vs generateText Decision Matrix

| Use case | Function | Key option |
|---|---|---|
| Chat UI with streaming response | `streamText` | `onChunk`, pipe to `toDataStreamResponse()` |
| Background processing | `generateText` | returns complete `text` |
| Structured/typed output | `generateObject` | `schema: z.object({...})` |
| Agent with tool loop | `generateText` | `tools`, `maxSteps: N` |
| Multi-step reasoning chain | `generateText` | `maxSteps: 10`, inspect `result.steps` |

## ToolLoopAgent Pattern

For agents that use tools iteratively until they reach a final answer:

```ts
import { generateText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const result = await generateText({
  model: openai(process.env.OPENAI_MODEL_ID!),
  tools: {
    searchWeb: tool({
      description: 'Search the web for current information',
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => { /* ... */ return results },
    }),
  },
  maxSteps: 10,  // prevents infinite loops
  system: 'You are a research assistant. Use tools to find accurate information.',
  messages,
})

// Inspect each step the agent took
result.steps.forEach((step, i) => {
  console.log(`Step ${i}:`, step.toolCalls, step.toolResults)
})
```

**Rule:** Always set `maxSteps` when using tools. Never leave it unbounded.

## Updated Anti-Patterns

- Importing from `@vercel/ai` (deprecated) instead of `ai`
- Hardcoding model ID strings (e.g., `'gpt-4o'`) — always use env var
- Using `generateText` for streaming chat UI (use `streamText` instead)
- Omitting `maxSteps` on tool-calling agents
- Not handling `result.finishReason === 'max-steps'` (agent hit the limit — handle gracefully)
```

---

### [A1-6] UPGRADE `.cursor/skills/system/spec-writing/SKILL.md`

```
Read the current file at `.cursor/skills/system/spec-writing/SKILL.md`.

Add the following new sections. Increment version and add changelog entry: "Added agent-readiness checklist, Socratic questioning gate, spec-to-ADR escalation rule."

Append after the last existing section:

---

## Agent-Readiness Checklist

Every spec must pass this checklist before handoff to a coding agent. A spec that fails any item is incomplete — revise before handing off.

- [ ] **Unambiguous decision:** The spec states exactly what to build, not what options to consider.
- [ ] **Implementation plan included:** Step-by-step sequence an agent can execute without asking follow-up questions.
- [ ] **Edge cases enumerated:** Documents what happens when key inputs are null, empty, or fail. At minimum: null input, empty list, network failure, auth failure.
- [ ] **External dependencies resolved:** All APIs, schemas, types, and environment variables referenced by the spec are defined (names, formats, sources).
- [ ] **Acceptance criteria are testable:** Each criterion maps to a specific, binary assertion (pass/fail) — not a vague description.
- [ ] **No ambiguous pronouns:** "it", "this", "they" always refer to a named entity. If the reader must guess what "it" is, rewrite.

## Socratic Questioning Gate

Before writing any spec, answer these 4 questions. If you cannot answer all 4, you do not yet have enough information to write the spec.

1. **Problem:** What specific problem does this spec solve? (1 sentence, starting with "Users cannot..." or "The system fails to...")
2. **Out of scope:** What is explicitly excluded from this spec? (list — prevents scope creep)
3. **MVP:** What is the simplest version that validates whether the solution works?
4. **Falsification:** What evidence would prove this spec is wrong or solving the wrong problem?

Write the answers to all 4 questions in the spec under a `## Scoping` section before writing the implementation plan.

## Spec-to-ADR Escalation Rule

When a spec introduces any of the following, it must escalate to an ADR (see `system/adr`):
- A new library or framework not previously in `package.json`
- A new infrastructure component (new database, new queue, new cache layer)
- A new architectural pattern (e.g., first use of event sourcing, first use of CQRS)
- A decision that affects >3 other specs or components

Escalation procedure:
1. Pause spec writing.
2. Create the ADR in `docs/adr/`.
3. Reference the ADR in the spec: `See ADR-XXXX for technology decision rationale.`
4. Reference the spec in the ADR: `See [spec name] for implementation context.`
5. Resume spec writing — the spec assumes the ADR decision is accepted.
```

---

## Phase 3 — Security & Ops Upgrades

---

### [A1-4] UPGRADE `.cursor/skills/external/git-workflow/SKILL.md`

```
Read the current file at `.cursor/skills/external/git-workflow/SKILL.md`.

Add the following new sections. Increment version and add changelog entry: "Added security scan gate in PR workflow, STRIDE-A commit tagging, branch protection rules, ADR trigger."

Append after the last existing section:

---

## Security Gate in PR Workflow

Before merging any PR, run these security checks. CI must enforce them — they are not optional:

```bash
# 1. Dependency vulnerability scan
npm audit --audit-level=high
# Block merge if any HIGH or CRITICAL vulnerabilities found

# 2. Secrets scan (no committed credentials)
git log --all -p | grep -iE "(api_key|secret|token|password|private_key|access_key)" | grep -v "test\|mock\|example\|placeholder"
# Block merge if any real secrets found
```

PR checklist additions:
- [ ] `npm audit --audit-level=high` passes with 0 HIGH/CRITICAL findings
- [ ] No secrets or credentials committed (secrets scan passes)
- [ ] If security-relevant files changed, `[SECURITY]` tag added to PR title

## Security-Relevant Commit Tagging (STRIDE-A)

Commits touching the following areas must include `[SECURITY]` in the commit message title:
- Authentication or authorization logic
- Payment processing
- Data access layer (database queries, ORM changes)
- External API integrations (new or modified)
- File upload/download handlers
- User input processing (forms, webhooks)

`[SECURITY]` tagged commits require a mandatory second review before merge.

## Branch Protection Rules

Document and enforce in GitHub repository settings:

| Branch | Rules |
|---|---|
| `main` / `production` | Require PR, require 1 approval, require passing CI, no secrets detected, no direct pushes |
| `develop` / `staging` | Require PR, require passing CI, no direct pushes |
| Feature branches | No protection — direct commits allowed |

**Direct pushes to `main` are never permitted.** Not even from repository owners.

## ADR Trigger Rule

When a PR introduces any of these, an ADR must exist and be linked in the PR description:
- A new library added to `package.json` (not a version bump — a new package)
- A new infrastructure component
- A new architectural pattern
- A reversal of a previous architectural decision

PR description format when an ADR is required:
```markdown
## Architecture Decision
This PR implements [ADR-XXXX: Title](docs/adr/XXXX-title.md).
```

PRs missing a required ADR link are blocked from merge.
```

---

### [A1-5] UPGRADE `.cursor/skills/quality/security-hardening/SKILL.md`

```
Read the current file at `.cursor/skills/quality/security-hardening/SKILL.md`.

Add the following new sections. Increment version and add changelog entry: "Added data-flow tracing procedure, STRIDE-A threat classification table, incremental baseline analysis mode, severity rating matrix with response times."

Append after the last existing section:

---

## Data-Flow Tracing (Step 1 of every security audit)

Before any other analysis, map all data flows:

1. **Identify all entry points:** HTTP endpoints, form inputs, webhook receivers, file upload handlers, scheduled job triggers, inter-service message consumers.
2. **Trace each input to its output:** Follow the data from entry point through all transformations to its final destination (database write, API call, rendered output, file write).
3. **Flag unvalidated paths:** Any input that reaches an output without explicit sanitization or validation is automatically a HIGH finding.

Document the data flow map in the security audit report as:
```
Entry: POST /api/orders (body: { userId, items, total })
  → Validation: zod schema (items required, total > 0)  ✓
  → Auth check: session.userId === body.userId  ✓
  → DB write: prisma.order.create()  ✓
  → Response: order ID only (no full order object returned)  ✓
```

## STRIDE-A Threat Classification

Classify all findings using STRIDE + Abuse:

| Category | Definition | Example Findings |
|---|---|---|
| **S**poofing | Impersonating another identity | JWT without signature verification, missing auth middleware on route |
| **T**ampering | Modifying data without authorization | Unvalidated update payloads, missing ownership check on PATCH endpoint |
| **R**epudiation | Denying an action occurred | No audit log for write operations, no request ID tracing |
| **I**nformation Disclosure | Exposing sensitive data | Stack traces in production, over-fetching in API responses, enum user IDs |
| **D**enial of Service | Making the service unavailable | No rate limiting, unbounded query results, missing pagination |
| **E**levation of Privilege | Gaining unauthorized access level | Missing RBAC check, horizontal privilege escalation (user A reads user B's data) |
| **A**buse | Exploiting legitimate features maliciously | Account enumeration via timing, credential stuffing, scraping, bulk operations without limits |

All findings in the security report must be tagged with their STRIDE-A category.

## Incremental Analysis Mode

For ongoing security reviews (not first-time audits):

**First run:** Full baseline report → save to `docs/security/baseline-YYYY-MM-DD.md`.

**Subsequent runs (on PRs or code diffs):**
1. Identify which files changed in the diff.
2. Run security analysis only on changed files and their direct dependencies.
3. Compare new findings against the baseline report.
4. Output a delta report showing:
   - **NEW** findings (not in baseline)
   - **RESOLVED** findings (were in baseline, no longer present)
   - **PERSISTING** findings (still present, unchanged from baseline)

Delta report format: `docs/security/delta-<PR-number>-YYYY-MM-DD.md`.

## Severity Rating Matrix

| Rating | Definition | Required Response |
|---|---|---|
| **CRITICAL** | Remote code execution, authentication bypass, data breach | Block deploy immediately. Fix must be merged before any production push. |
| **HIGH** | Privilege escalation, SQL injection, stored XSS, IDOR | Fix before next sprint. No new features until resolved. |
| **MEDIUM** | Reflected XSS, information leakage, weak cryptography | Fix within 2 sprints. Owner assigned at finding time. |
| **LOW** | Defense-in-depth gaps, missing security headers, verbose errors | Add to security backlog with assigned owner. Fix within quarter. |
| **INFO** | Best practice notes, non-exploitable observations | Optional. Document and close. |

**Deploy policy:** Any CRITICAL or HIGH finding blocks production deployment. No exceptions.
```

---

### [A1-7] UPGRADE `.cursor/skills/external/deployment-checklist/SKILL.md`

```
Read the current file at `.cursor/skills/external/deployment-checklist/SKILL.md`.

Add the following new sections. Increment version and add changelog entry: "Added Firebase Security Rules gate, Vercel deployment checklist, post-deploy verification steps."

Append after the last existing section:

---

## Firebase Security Rules Gate (for Firebase projects)

Before deploying any Firebase project, score the security rules using this checklist. **Minimum score: 4/5. Deploy is blocked if score is below 4.**

| Check | Points | Pass Condition |
|---|---|---|
| Update Bypass | 1 | Every `allow update` rule includes ownership check: `request.auth.uid == resource.data.userId` or equivalent |
| Authority Source | 1 | All permissions derive from `request.auth` — never from `request.resource.data` (client cannot forge permissions) |
| Storage Abuse | 1 | Storage rules include file size limit: `request.resource.size < 5 * 1024 * 1024` (5MB default) |
| Type Safety | 1 | All write rules validate field types: `request.resource.data.name is string`, etc. |
| Field-Level Access | 1 | Sensitive fields (email, role, adminFlag) are read-restricted by identity, not just document-level |

Score: ___/5. Score <4 = deploy blocked.

**Zero-tolerance rule:** No wildcard `allow read, write: if true` rules exist anywhere in production rules. One wildcard rule = automatic 0/5 = deploy blocked.

## Vercel Deployment Checklist

Before promoting any Vercel deployment to production:

- [ ] All environment variables set in Vercel dashboard (Settings → Environment Variables) — none hardcoded in source
- [ ] Edge runtime vs Node.js runtime decision is documented (`export const runtime = 'edge'` or omitted for Node.js)
- [ ] Preview deployment tested and functional before production promotion
- [ ] `vercel.json` rewrite/redirect rules reviewed — no open redirects (rules that redirect to external domains must have an allowlist)
- [ ] Build output is clean (no warnings about deprecated APIs)
- [ ] `next.config.js` `images.remotePatterns` is specific (not wildcard `**`)

## Post-Deploy Verification

Run these checks against the production URL (not preview) within 30 minutes of deploy:

- [ ] Smoke tests pass against production URL
- [ ] `curl -I https://yourdomain.com` shows `Content-Security-Policy` header present
- [ ] No development/debug routes accessible (e.g., `/debug`, `/__inspect`, `/api/test` return 404 in production)
- [ ] Rate limiting active on auth endpoints — verify by sending 10 rapid requests to `/api/auth/*` and confirming 429 response
- [ ] No unintended console.log output in production (check browser console on key pages)
- [ ] Core Web Vitals pass (LCP <2.5s, CLS <0.1, INP <200ms) — check via PageSpeed Insights

If any post-deploy check fails: **initiate rollback immediately** via Vercel dashboard → Deployments → promote previous deployment.
```

---

## Phase 4 — Net-New Infrastructure Skills

---

### [A2-1] CREATE `.cursor/skills/backend/firebase/SKILL.md`

```
Create a new file at `.cursor/skills/backend/firebase/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "backend/firebase"
name: "firebase"
description: "Firebase integration for NEZAM projects — Firestore data modeling, real-time listeners, offline persistence, Auth integration, and the Firebase vs Supabase decision matrix."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "backend-lead"
tier: 2
sdd_phase: "Development"
rtl_aware: false
certified: false
dependencies:
  - "backend/auth-workflows"
  - "backend/firebase-security-rules"
---

# Firebase Integration

## Purpose

Define correct patterns for Firebase/Firestore usage in NEZAM projects: data modeling, real-time subscriptions, offline persistence, and Auth→Firestore permission chains. Includes decision guidance on when to use Firebase vs Supabase.

## Trigger Conditions

- A project requires real-time data synchronization (chat, live collaboration, live feeds).
- A project requires offline-first mobile data persistence.
- A project uses Firebase Authentication.
- Firebase is the designated backend for a client project.

## Prerequisites

- Firebase project created and configured in Firebase Console.
- `firebase.json` and `.firebaserc` initialized (`firebase init`).
- `firebaseConfig` stored in environment variables (never in source).
- `backend/firebase-security-rules` skill reviewed.

## Procedure

### 1. Firebase vs Supabase Decision Matrix

| Requirement | Use Firebase | Use Supabase |
|---|---|---|
| Real-time sync (live collaborative) | ✅ Firestore onSnapshot | ⚠️ Requires Realtime or polling |
| Offline-first mobile | ✅ Built-in persistence | ❌ Not native |
| Complex relational queries | ❌ Firestore is document/NoSQL | ✅ PostgreSQL |
| Row-level security | ⚠️ Firestore Rules (document-level) | ✅ RLS policies |
| Full-text search | ❌ Use Typesense/Algolia alongside | ✅ pg_trgm or Typesense |
| MENA payment integration | Equal | Equal |

### 2. Firestore Data Modeling Rules

1. **Flat collections over deep nesting** — maximum 2 levels of subcollections.
   - ✅ `/users/{uid}/orders/{orderId}`
   - ❌ `/users/{uid}/carts/{cartId}/items/{itemId}/variants/{variantId}`

2. **Denormalize for reads** — if data is always read together, store it together. Firestore charges per document read, not per field.

3. **Owner field on every document** — all user-created documents must have `userId` (or equivalent) as a top-level field. This is required for security rules.

4. **Timestamps** — always add `createdAt: serverTimestamp()` and `updatedAt: serverTimestamp()` to every document.

5. **Avoid unbounded arrays** — arrays in Firestore documents cannot exceed 1MB. For collections that grow, use a subcollection.

### 3. Real-Time Listeners

```ts
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'

// Always return the unsubscribe function
const unsubscribe = onSnapshot(
  query(
    collection(db, 'messages'),
    where('channelId', '==', channelId),
    orderBy('createdAt', 'asc')
  ),
  (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setMessages(messages)
  },
  (error) => {
    console.error('Listener error:', error)
    // Handle permission errors gracefully
  }
)

// Cleanup on component unmount (React example)
useEffect(() => {
  return unsubscribe  // always cleanup
}, [channelId])
```

**Rule:** Every `onSnapshot` call must return and store its unsubscribe function. Memory leak prevention.

### 4. Offline Persistence

```ts
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'

const db = initializeFirestore(app, {
  localCache: persistentLocalCache()  // Web — IndexedDB
})
```

For mobile (React Native + Firebase SDK): offline persistence is **enabled by default** — no configuration needed.

### 5. Auth → Firestore Permission Chain

Every Firestore operation that requires authentication follows this chain:
1. Firebase Auth: `onAuthStateChanged` → `user.uid`
2. All documents owned by a user store `userId: user.uid`
3. Firestore rules use `request.auth.uid == resource.data.userId` for write authorization
4. Client reads: always filter by `where('userId', '==', currentUser.uid)` for user-owned data

```ts
// ✅ Correct — user can only read their own data
const q = query(collection(db, 'orders'), where('userId', '==', auth.currentUser!.uid))
```

## Output Artifacts

- Firestore collection schema documented in `docs/specs/firestore-schema.md`
- Security rules in `firestore.rules` (governed by `backend/firebase-security-rules`)
- Firebase config in `.env` (never committed)

## Validation Checklist

- [ ] Maximum 2 subcollection levels
- [ ] Every document has `userId` (owner field) and `createdAt` / `updatedAt` timestamps
- [ ] Every `onSnapshot` call has its unsubscribe stored and called on cleanup
- [ ] Offline persistence initialized for web and mobile (where applicable)
- [ ] Auth → Firestore permission chain follows the pattern above
- [ ] `firebaseConfig` is in `.env`, not hardcoded in source

## Handoff Target

`backend/firebase-security-rules` for rules audit before deploy. `external/deployment-checklist` for the Firebase rules gate.
```

---

### [A2-2] CREATE `.cursor/skills/backend/firebase-security-rules/SKILL.md`

```
Create a new file at `.cursor/skills/backend/firebase-security-rules/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "backend/firebase-security-rules"
name: "firebase-security-rules"
description: "Red-team audit of Firebase Security Rules before every deploy. Scores rules 1–5 on 5 critical checks. Deploy blocked if score <4."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "lead-security-officer"
tier: 1
sdd_phase: "Quality"
rtl_aware: false
certified: false
dependencies:
  - "backend/firebase"
  - "quality/security-hardening"
---

# Firebase Security Rules Audit

## Purpose

Audit Firebase Security Rules (Firestore + Storage) from a red-team perspective before every production deploy. The 5-check scoring system ensures critical security properties are enforced. A score below 4/5 blocks the deploy — no exceptions.

## Trigger Conditions

- Any change to `firestore.rules` or `storage.rules`.
- Before every Firebase project deployment.
- Part of the `external/deployment-checklist` Firebase gate.

## Prerequisites

- `firestore.rules` and `storage.rules` files are accessible.
- The Firestore data schema is documented (to understand what fields exist).

## Procedure

### Mandatory Audit Checklist (5 checks = 5 points maximum)

**Check 1 — Update Bypass (1 point)**  
Every `allow update` rule must include an ownership or identity check. The user must prove they own the resource before updating it.

```js
// ✅ PASS — ownership verified
allow update: if request.auth != null && request.auth.uid == resource.data.userId;

// ❌ FAIL — no ownership check
allow update: if request.auth != null;
```

Score 1 if ALL update rules have ownership checks. Score 0 if ANY update rule is missing ownership check.

**Check 2 — Authority Source (1 point)**  
All permissions must derive from `request.auth` (server-verified identity). Permissions must NEVER derive from `request.resource.data` alone (client-supplied data — cannot be trusted).

```js
// ✅ PASS — authority from request.auth (server-verified)
allow write: if request.auth.token.admin == true;

// ❌ FAIL — authority from client-supplied data
allow write: if request.resource.data.isAdmin == true;
```

Score 1 if no rules grant permissions based solely on client-supplied data.

**Check 3 — Storage Abuse Prevention (1 point)**  
Firebase Storage rules must enforce file size limits. Without this, any authenticated user can upload unlimited data.

```js
// ✅ PASS — size limit enforced
allow write: if request.auth != null
  && request.resource.size < 5 * 1024 * 1024  // 5MB
  && request.resource.contentType.matches('image/.*');

// ❌ FAIL — no size limit
allow write: if request.auth != null;
```

Score 1 if ALL storage write rules include `request.resource.size` limits.

**Check 4 — Type Safety (1 point)**  
All Firestore write rules must validate field types. Without type validation, clients can write unexpected data types and corrupt documents.

```js
// ✅ PASS — types validated
allow create: if request.resource.data.name is string
  && request.resource.data.age is int
  && request.resource.data.active is bool;

// ❌ FAIL — no type validation
allow create: if request.auth != null;
```

Score 1 if ALL create/update rules validate at least the required fields' types.

**Check 5 — Field-Level Access Control (1 point)**  
Sensitive fields (email, role, adminFlag, paymentInfo, phone) must be explicitly restricted at the field level — document-level read access alone is insufficient.

```js
// ✅ PASS — sensitive fields restricted
match /users/{userId} {
  allow read: if request.auth.uid == userId;  // can read own profile
  // But email field only readable by admin:
  // Implement via Cloud Function or separate /private subcollection
}

// ❌ FAIL — all fields readable by any authenticated user
allow read: if request.auth != null;
```

Score 1 if sensitive fields (email, role, adminFlag) are in a restricted subcollection or protected by identity-level checks.

### Zero-Tolerance Rule (instant 0/5)

If ANY of the following exist in production rules → **automatic score 0, deploy blocked immediately:**
- `allow read, write: if true;` (completely open)
- `allow read: if true;` on any user data collection
- `allow write: if true;` anywhere

### Scoring and Deploy Gate

| Score | Action |
|---|---|
| 5/5 | ✅ Deploy approved |
| 4/5 | ✅ Deploy approved — document the failed check as a known risk with remediation timeline |
| 3/5 or below | ❌ Deploy blocked — fix failing checks before proceeding |
| 0/5 (zero-tolerance) | ❌ Deploy blocked — critical security vulnerability |

## Output Artifacts

- Security rules audit report: `docs/security/firebase-rules-audit-YYYY-MM-DD.md`
- Score recorded in `external/deployment-checklist`

## Validation Checklist

- [ ] All 5 checks scored (no check skipped)
- [ ] Zero-tolerance rule verified (no `if true` wildcards)
- [ ] Score ≥4/5 confirmed before deploy approval
- [ ] Audit report saved with date

## Handoff Target

`external/deployment-checklist` — score feeds into the Firebase Security Rules Gate.
```

---

### [A2-3] CREATE `.cursor/skills/infrastructure/firecrawl/SKILL.md`

```
Create a new file at `.cursor/skills/infrastructure/firecrawl/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "infrastructure/firecrawl"
name: "firecrawl"
description: "Web content extraction for AI pipelines using Firecrawl — converts URLs to clean markdown or structured data for RAG ingestion, competitive research, and content pipelines."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "data-pipeline-manager"
tier: 3
sdd_phase: "Development"
rtl_aware: false
certified: false
dependencies:
  - "infrastructure/vector-search"
---

# Firecrawl — Web Content Extraction

## Purpose

Extract clean, structured content from any web URL for use in AI pipelines. Firecrawl handles JavaScript rendering, login walls (with session cookies), and converts messy HTML into clean markdown or structured JSON. Primary use cases: RAG data sourcing, competitive content research, automated content ingestion.

## Trigger Conditions

- Building a RAG pipeline that needs web content.
- Competitive research automation (scrape competitor pages on schedule).
- Content ingestion pipeline (blog posts, documentation, product pages).
- Any task requiring clean text extraction from URLs at scale.

## Prerequisites

- `FIRECRAWL_API_KEY` set in environment variables.
- Target URLs are publicly accessible, or session cookies are available for authenticated pages.
- `npm install @mendable/firecrawl-js` installed.

## Procedure

### Operation 1: Single URL Scrape

```ts
import FirecrawlApp from '@mendable/firecrawl-js'
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

const result = await app.scrapeUrl('https://example.com/page', {
  formats: ['markdown'],           // 'markdown' | 'html' | 'screenshot'
  onlyMainContent: true,           // strips nav, footer, ads — ALWAYS set to true
  waitFor: 2000,                   // ms to wait for JS rendering (increase for SPAs)
  excludeTags: ['nav', 'footer', 'aside', 'script', 'style'],
})

if (result.success) {
  const markdownContent = result.markdown
}
```

### Operation 2: Full Site Crawl

```ts
const crawlResult = await app.crawlUrl('https://docs.example.com', {
  limit: 100,                      // max pages to crawl
  maxDepth: 3,                     // link depth from start URL
  allowedDomains: ['docs.example.com'],  // prevent crawl escaping to external domains
  excludePaths: ['/blog', '/old-docs'],
  scrapeOptions: {
    formats: ['markdown'],
    onlyMainContent: true,
  },
})

// crawlResult.data is an array of scraped pages
for (const page of crawlResult.data) {
  console.log(page.url, page.markdown)
}
```

### Operation 3: LLM-Powered Structured Extraction

```ts
import { z } from 'zod'

const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  features: z.array(z.string()),
})

const result = await app.scrapeUrl('https://example.com/product', {
  formats: ['extract'],
  extract: {
    schema: ProductSchema,
    prompt: 'Extract the product name, price, description, and feature list.',
  },
})

const product = result.extract  // typed as ProductSchema
```

### NEZAM Pipeline Integration

Connect Firecrawl output to the vector search pipeline:

```
Firecrawl.scrapeUrl() → markdown content
  → chunk into 512-token segments
  → embed via OpenAI/Anthropic embedding API
  → store in vector store (via infrastructure/vector-search skill)
  → retrieve via similarity search at query time
```

## Output Artifacts

- Scraped content as markdown strings (in-memory or stored in `/data/scraped/`)
- Structured JSON if using extract mode
- Error log for failed URLs

## Validation Checklist

- [ ] `onlyMainContent: true` set on all scrape operations (prevents noise)
- [ ] `allowedDomains` set on crawl operations (prevents crawl escape)
- [ ] `waitFor` is set appropriately for JavaScript-heavy pages (SPAs need ≥2000ms)
- [ ] Rate limiting considered for large crawls (Firecrawl has per-minute limits)
- [ ] Scraped content validated for minimum length before indexing (reject empty/near-empty pages)
- [ ] API key in environment variable, never hardcoded

## Handoff Target

`infrastructure/vector-search` — scraped content feeds the embedding and retrieval pipeline.
```

---

### [A2-4] CREATE `.cursor/skills/infrastructure/browserbase/SKILL.md`

```
Create a new file at `.cursor/skills/infrastructure/browserbase/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "infrastructure/browserbase"
name: "browserbase"
description: "Cloud browser automation for adversarial UI testing, scraping requiring auth sessions, and regression testing. Uses 3-round adversarial testing protocol."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "lead-qa-architect"
tier: 3
sdd_phase: "Quality"
rtl_aware: false
certified: false
dependencies:
  - "quality/security-hardening"
---

# Browserbase — Cloud Browser Automation

## Purpose

Run browser automation in the cloud with anti-bot bypass, persistent sessions, and parallel execution. Primary use cases: adversarial UI testing, scraping behind authentication, E2E regression tests for complex user flows.

## Trigger Conditions

- UI regression testing on complex multi-step flows.
- Testing authentication flows (login, OAuth, MFA).
- Scraping sites that require JavaScript or session cookies.
- Testing against sites with bot detection that blocks headless browsers.
- Parallel test execution for large test suites.

## Prerequisites

- `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` set in environment variables.
- `npm install @browserbasehq/sdk playwright` installed.
- Target URLs identified for testing.

## Procedure

### Session Setup

```ts
import Browserbase from '@browserbasehq/sdk'
import { chromium } from 'playwright'

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! })

const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  browserSettings: {
    viewport: { width: 1440, height: 900 },
  },
})

const browser = await chromium.connectOverCDP(session.connectUrl)
const page = await browser.newPage()
```

### 3-Round Adversarial Testing Protocol

**Round 1 — Functional (happy path):**
- Test all expected inputs with valid data.
- Verify all success states, loading states, and empty states.
- Confirm all user flows complete successfully from start to finish.
- Document: what works as expected.

**Round 2 — Adversarial (break it):**
- Boundary inputs: empty strings, null values, maximum length strings, special characters, SQL injection attempts, XSS strings.
- Race conditions: double-submit forms, rapid navigation, concurrent requests.
- Auth edge cases: expired sessions, invalid tokens, unauthorized routes.
- Network conditions: offline behavior, slow network (throttle to 3G), request timeouts.
- Document: what breaks, what error state appears (or fails to appear).

**Round 3 — Coverage Gaps:**
- Explicitly list all user flows and states NOT tested in Rounds 1–2.
- For each gap: explain why it was not tested and whether it should be added to the test suite.
- Document: what is still untested and the risk level of each gap.

### Parallel Execution

For large test suites, run tests in parallel Browserbase sessions:

```ts
const testCases = ['login-flow', 'checkout-flow', 'onboarding-flow']

const results = await Promise.all(
  testCases.map(async (testCase) => {
    const session = await bb.sessions.create({ projectId: process.env.BROWSERBASE_PROJECT_ID! })
    const browser = await chromium.connectOverCDP(session.connectUrl)
    // ... run test
    await browser.close()
    return { testCase, result }
  })
)
```

**Rule:** Each parallel session is isolated — no shared state. Design tests to be stateless and independent.

### Session Cleanup

Always close sessions after tests complete to avoid unnecessary billing:

```ts
await browser.close()
// Session auto-closes, but explicit close is faster and cleaner
```

## Output Artifacts

- Round 1 report: `docs/quality/browserbase-round1-<date>.md`
- Round 2 report: `docs/quality/browserbase-round2-<date>.md`
- Round 3 gap analysis: `docs/quality/browserbase-round3-gaps-<date>.md`

## Validation Checklist

- [ ] All 3 rounds completed (no round skipped)
- [ ] Round 2 tested: empty inputs, boundary values, XSS strings, SQL injection strings
- [ ] Round 2 tested: race conditions (double-submit, concurrent requests)
- [ ] Round 3 documents all untested paths with risk assessment
- [ ] Parallel tests are stateless (no shared state between sessions)
- [ ] All sessions closed after test completion

## Handoff Target

Test reports feed `quality/regression-detector`. Critical findings from Round 2 feed `quality/security-hardening`.
```

---

## Phase 5 — Net-New Integration Skills

---

### [A2-5] CREATE `.cursor/skills/backend/apify-scraper/SKILL.md`

```
Create a new file at `.cursor/skills/backend/apify-scraper/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "backend/apify-scraper"
name: "apify-scraper"
description: "Managed scraping infrastructure via Apify Actors — 55+ pre-built scrapers for social media, maps, reviews, e-commerce. Used for competitive intelligence and data pipeline tasks."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "data-pipeline-manager"
tier: 3
sdd_phase: "Development"
rtl_aware: false
certified: false
dependencies: []
---

# Apify Scraper

## Purpose

Access managed scraping infrastructure via Apify's pre-built Actor library. No infrastructure management — pay per result. Primary use cases: competitive intelligence, social media monitoring, review aggregation, real estate data, and search result analysis.

## Trigger Conditions

- Competitive research requiring data from social media or review platforms.
- Content pipeline needing structured data from specific platforms.
- Any scraping task where a pre-built Apify Actor exists for the target platform.

## Prerequisites

- `APIFY_API_TOKEN` set in environment variables.
- `npm install apify-client` installed.
- Actor selection: check pricing (pay-per-result vs compute units) before selecting.

## Procedure

### Actor Selection Matrix (Priority Subset)

**Social Media:**
| Platform | Actor | Use Case |
|---|---|---|
| Instagram | `apify/instagram-profile-scraper` | Profile data, follower counts |
| Instagram | `apify/instagram-hashtag-scraper` | Posts by hashtag |
| Instagram | `apify/instagram-comment-scraper` | Comments on posts |
| TikTok | `clockworks/tiktok-scraper` | Videos, profiles, hashtags |
| Facebook | `apify/facebook-pages-scraper` | Page data and posts |
| YouTube | `streamers/youtube-scraper` | Channel data, video metadata |

**Reviews & Local:**
| Platform | Actor | Use Case |
|---|---|---|
| Google Maps | `compass/crawler-google-places` | Business data, reviews |
| TripAdvisor | `maxcopell/tripadvisor` | Hotel/restaurant reviews |
| Trustpilot | `misceres/trustpilot-scraper` | Company reviews |
| Google Reviews | Included in Google Maps actor | Same actor |

**E-commerce & Real Estate:**
| Platform | Actor | Use Case |
|---|---|---|
| Amazon | `junglee/amazon-product-scraper` | Product data, pricing, reviews |
| Booking.com | `dtrungtin/booking-scraper` | Hotel listings, pricing |
| Zillow | `maxcopell/zillow-scraper` | Property listings |

**Search:**
| Platform | Actor | Use Case |
|---|---|---|
| Google Search | `apify/google-search-scraper` | SERP results |
| Google Shopping | `apify/google-shopping-scraper` | Product results |

### Running an Actor

```ts
import { ApifyClient } from 'apify-client'
const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN })

// Run an Actor and wait for results
const run = await client.actor('apify/instagram-profile-scraper').call({
  usernames: ['username1', 'username2'],
  resultsLimit: 10,
})

// Fetch results from the dataset
const { items } = await client.dataset(run.defaultDatasetId).listItems()
console.log(items)
```

### Pricing Check Rule

Before selecting an Actor, always check its pricing model:
- **Pay-per-result:** Best for small, predictable jobs. Check cost-per-item.
- **Compute units:** Best for large crawls. Check average CU/run.

Always set a `maxItems` or `resultsLimit` parameter to cap costs on first runs.

### Credential Storage Rule

Store all scraping credentials (session cookies, login tokens) in Apify Key-Value Store — not in environment variables or code:

```ts
const store = await client.keyValueStore('my-sessions').getOrCreate()
await store.setRecord({ key: 'instagram-session', value: { cookie: '...' } })
```

## Output Artifacts

- Scraped data in Apify Dataset (accessible via `defaultDatasetId`)
- Exported as JSON or CSV for downstream processing

## Validation Checklist

- [ ] Actor selected from the matrix above or verified to exist on Apify console
- [ ] Pricing model reviewed before running (estimate cost before production use)
- [ ] `maxItems` or `resultsLimit` set on all production runs
- [ ] API token in environment variable, never hardcoded
- [ ] Session credentials stored in Apify Key-Value Store, not env vars
- [ ] Results validated (check for empty datasets — Actor may have been blocked)

## Handoff Target

Scraped data feeds `backend/gemini-integration` (for AI analysis) or `infrastructure/vector-search` (for RAG indexing).
```

---

### [A2-6] CREATE `.cursor/skills/backend/gemini-integration/SKILL.md`

```
Create a new file at `.cursor/skills/backend/gemini-integration/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "backend/gemini-integration"
name: "gemini-integration"
description: "Google Gemini API integration using the correct google-genai SDK. Covers multimodal input, streaming, function calling, search grounding, and file API for large documents."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "backend-lead"
tier: 2
sdd_phase: "Development"
rtl_aware: false
certified: false
dependencies:
  - "backend/vercel-ai-sdk"
---

# Gemini Integration

## Purpose

Integrate Google Gemini models for multimodal AI tasks — vision, large document processing, search-grounded responses, and function calling. Gemini is an alternate AI provider alongside OpenAI/Anthropic in the NEZAM stack.

## Trigger Conditions

- Task requires vision (image + text) input.
- Task requires large context window (Gemini 2.5 Pro: 1M tokens).
- Task requires live web search grounding in AI responses.
- Task requires large file processing (documents, PDFs, videos).
- Cost optimization: Gemini Flash is cheaper than GPT-4o for high-volume tasks.

## Prerequisites

- `GEMINI_API_KEY` set in environment variables (from Google AI Studio or Vertex AI).
- **CRITICAL:** Use the `@google/genai` package — NOT the deprecated `@google-generativeai` package.

```bash
npm install @google/genai
```

## Procedure

### CRITICAL — Correct SDK Import

```ts
// ✅ CORRECT — current SDK
import { GoogleGenAI } from '@google/genai'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// ❌ DEPRECATED — do NOT use
// import { GoogleGenerativeAI } from '@google/generative-ai'
```

### Model Selection (verify IDs at implementation time — they change)

```ts
// As of 2026-05 — ALWAYS verify current IDs before using:
// curl https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY

const model = ai.getGenerativeModel({ model: 'gemini-2.5-pro-preview-05-06' })   // best reasoning
const flashModel = ai.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' })  // fast/cheap
```

**Rule:** Never hardcode model IDs in source. Store in environment variable `GEMINI_MODEL_ID`.

### Basic Text Generation

```ts
const result = await model.generateContent('Explain quantum computing in simple terms')
console.log(result.response.text())
```

### Multimodal Input (image + text)

```ts
import { readFileSync } from 'fs'

const imageData = readFileSync('image.jpg')
const result = await model.generateContent([
  {
    inlineData: {
      data: imageData.toString('base64'),
      mimeType: 'image/jpeg',
    },
  },
  'What is shown in this image? Describe in detail.',
])
```

### Streaming Response

```ts
const stream = await model.generateContentStream('Write a detailed analysis...')

for await (const chunk of stream.stream) {
  process.stdout.write(chunk.text())
}

const finalResponse = await stream.response
```

### Function Calling (Tool Use)

```ts
const tools = [{
  functionDeclarations: [{
    name: 'get_weather',
    description: 'Get current weather for a city',
    parameters: {
      type: 'OBJECT',
      properties: {
        city: { type: 'STRING', description: 'City name' },
      },
      required: ['city'],
    },
  }],
}]

const model = ai.getGenerativeModel({ model: process.env.GEMINI_MODEL_ID!, tools })
const result = await model.generateContent('What is the weather in Cairo?')

// Check for function call in response
const functionCall = result.response.functionCalls()?.[0]
if (functionCall) {
  const { name, args } = functionCall
  // Execute the function and send result back
}
```

### Search Grounding (live web data in responses)

```ts
const model = ai.getGenerativeModel({
  model: process.env.GEMINI_MODEL_ID!,
  tools: [{ googleSearch: {} }],  // enables real-time web search
})

const result = await model.generateContent('What are the latest AI model releases in 2026?')
// Response includes citations from live web search
```

### File API (large documents)

```ts
import { GoogleGenAI, createPartFromUri } from '@google/genai'

// Upload file first
const uploadResult = await ai.files.upload({
  file: new Blob([fileContent], { type: 'application/pdf' }),
  config: { mimeType: 'application/pdf' },
})

// Use in generation
const result = await model.generateContent([
  createPartFromUri(uploadResult.file.uri, uploadResult.file.mimeType),
  'Summarize the key findings in this document.',
])
```

Use File API for files >2MB. Uploaded files expire after 48 hours.

### NEZAM Provider Integration

When using Gemini alongside OpenAI/Anthropic via `backend/vercel-ai-sdk`:

```ts
import { google } from '@ai-sdk/google'  // Vercel AI SDK Gemini provider

const result = await generateText({
  model: google(process.env.GEMINI_MODEL_ID!),
  prompt: 'Explain...',
})
```

This integrates Gemini as a drop-in provider in the Vercel AI SDK — same interface as OpenAI/Anthropic.

## Output Artifacts

- AI-generated text/structured output (in-memory or stored per use case)

## Validation Checklist

- [ ] Importing from `@google/genai` — NOT `@google-generativeai` (deprecated)
- [ ] Model ID stored in environment variable, not hardcoded
- [ ] Model ID verified against live API before use (IDs change with releases)
- [ ] Streaming used for responses >500 tokens (better UX, faster first token)
- [ ] Function calling responses handled (check `functionCalls()` before text)
- [ ] File API used for files >2MB (not inline data)
- [ ] API key in environment variable, never hardcoded

## Handoff Target

Gemini output feeds `infrastructure/vector-search` (for embedding), `backend/apify-scraper` (for analysis of scraped data), or directly to the API response layer.
```

---

### [A2-9] CREATE `.cursor/skills/frontend/shadcn-ui/SKILL.md`

```
Create a new file at `.cursor/skills/frontend/shadcn-ui/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "frontend/shadcn-ui"
name: "shadcn-ui"
description: "Correct shadcn/ui installation, token mapping, component extension, and RTL support patterns for the NEZAM stack (Next.js + Tailwind + NEZAM design tokens)."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "frontend-lead"
tier: 2
sdd_phase: "Development"
rtl_aware: true
certified: false
dependencies:
  - "design/design-tokens"
  - "design/css-architecture"
  - "design/design-context-init"
---

# shadcn/ui Integration

## Purpose

Establish correct patterns for adding, customizing, and extending shadcn/ui components in NEZAM projects — with NEZAM design token mapping, proper extension patterns, and RTL support.

## Trigger Conditions

- Adding a new UI component from shadcn/ui to the project.
- Mapping shadcn's CSS variables to NEZAM design tokens.
- Extending shadcn components with project-specific variants.
- Auditing component usage for anti-patterns.

## Prerequisites

- Next.js project initialized.
- Tailwind CSS configured (`tailwind.config.ts`).
- `DESIGN.md` exists with NEZAM token definitions.
- `design-context-init` has been run (components.md current).

## Procedure

### 1. Installation

```bash
# Initialize shadcn/ui in the project (run once)
npx shadcn@latest init

# Add individual components — ALWAYS use this command
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
# etc.
```

**Rule:** Never copy-paste shadcn component code manually. Always use the CLI. The CLI fetches the latest version and places it correctly.

After adding any component, **update `.cursor/context/design-init/components.md`** with the new component source.

### 2. NEZAM Token Mapping

shadcn/ui uses its own CSS variable names. Map them to NEZAM design tokens in `globals.css`:

```css
/* globals.css — map shadcn variables to NEZAM tokens */
:root {
  /* shadcn variable → NEZAM token */
  --background: var(--nezam-color-surface-default);
  --foreground: var(--nezam-color-text-primary);
  --primary: var(--nezam-color-brand-primary);
  --primary-foreground: var(--nezam-color-text-on-primary);
  --secondary: var(--nezam-color-surface-subtle);
  --secondary-foreground: var(--nezam-color-text-secondary);
  --muted: var(--nezam-color-surface-muted);
  --muted-foreground: var(--nezam-color-text-tertiary);
  --border: var(--nezam-color-border-default);
  --ring: var(--nezam-color-border-focus);
  --radius: var(--nezam-radius-md);
  --destructive: var(--nezam-color-status-error);
}
```

**Rule:** shadcn CSS variable values must always reference NEZAM tokens — never raw hex values.

### 3. Component Extension Pattern

Never modify shadcn components in `components/ui/` directly. Always extend via wrapper components:

```ts
// ✅ CORRECT — wrapper component in components/
// components/branded-button.tsx
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BrandedButtonProps extends ButtonProps {
  icon?: React.ReactNode
}

export function BrandedButton({ icon, children, className, ...props }: BrandedButtonProps) {
  return (
    <Button className={cn('gap-2 font-semibold', className)} {...props}>
      {icon}
      {children}
    </Button>
  )
}

// ❌ WRONG — modifying the base shadcn component directly
// Do NOT edit components/ui/button.tsx
```

### 4. RTL Support

For directional components (elements that flip in RTL):

```tsx
// Use Tailwind logical properties with RTL support
<div className="ps-4 pe-2">  {/* ps = padding-start, pe = padding-end */}
  <Icon className="me-2" />  {/* me = margin-end */}
  {label}
</div>

// For components with directional icons (arrow, chevron):
<Button>
  {direction === 'rtl' ? <ArrowRight /> : <ArrowLeft />}
  {label}
</Button>
// Better: use CSS logical properties and let direction handle it automatically
```

For `dir="rtl"` at document level, shadcn components inherit RTL correctly for most cases. Test explicitly:
- Modal/Dialog: check close button position
- Select/Dropdown: check chevron direction
- Toast: check slide direction (should slide from `inline-end`)

### 5. Import Rule

```ts
// ✅ CORRECT
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ❌ WRONG — shadcn is not a published npm package
import { Button } from 'shadcn/ui'
```

## Output Artifacts

- New component files in `components/ui/<component>.tsx`
- Updated `globals.css` with shadcn-to-NEZAM token mappings
- Updated `.cursor/context/design-init/components.md`

## Validation Checklist

- [ ] All components added via CLI (`npx shadcn@latest add`) — none manually copied
- [ ] `globals.css` maps all shadcn CSS variables to NEZAM tokens (no raw hex values)
- [ ] Imports are from `@/components/ui/<component>` — never from `shadcn/ui` directly
- [ ] Extensions are wrapper components — base `components/ui/` files are unmodified
- [ ] RTL tested on all directional components (dialog close, dropdown chevron, toast slide direction)
- [ ] `components.md` updated after adding any new component

## Handoff Target

Component usage feeds `design/component-library-api` for extraction documentation. Token mapping feeds `design/design-tokens`.
```

---

### [A2-10] CREATE `.cursor/skills/frontend/wordpress/SKILL.md`

```
Create a new file at `.cursor/skills/frontend/wordpress/SKILL.md`.

Use the canonical template at `.nezam/templates/skills/SKILL_NEZAM_CANONICAL.template.md` as the structural base.

Write the complete SKILL.md with this content:

---
skill_id: "frontend/wordpress"
name: "wordpress"
description: "Headless WordPress integration — WordPress as CMS, Next.js as frontend. WPGraphQL for content, ISR for performance, preview mode for drafts."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "frontend-lead"
tier: 3
sdd_phase: "Development"
rtl_aware: true
certified: false
dependencies:
  - "backend/cms-integration"
---

# Headless WordPress Integration

## Purpose

Connect WordPress as a content management system to a Next.js frontend using the headless architecture: WordPress manages content, Next.js handles rendering. Uses WPGraphQL for content fetching (not REST API) and ISR for performance.

## Trigger Conditions

- A client project requires WordPress content management.
- Migrating a WordPress site to a modern Next.js frontend.
- Content team requires WordPress editorial workflow with a custom frontend.

## Prerequisites

- WordPress instance running (self-hosted or WordPress.com with Business plan).
- WPGraphQL plugin installed and activated on WordPress.
- WPGraphQL for Advanced Custom Fields (if using ACF) installed.
- API user created in WordPress with minimal permissions (Editor role, no admin).

## Procedure

### 1. WordPress Setup

Required plugins:
```
WPGraphQL — https://wordpress.org/plugins/wp-graphql/
WPGraphQL for ACF — if using Advanced Custom Fields
WPGraphQL Smart Cache — for persistent query caching (performance)
Custom Post Type UI — if custom post types are needed
```

**Authentication:** Create a dedicated API user (Editor role — not admin) and generate an Application Password in WordPress:
`User Profile → Application Passwords → Add New Application Password`

Store the Application Password in environment variables — never commit.

### 2. Content Fetching via WPGraphQL

**Always use WPGraphQL over REST API.** WPGraphQL: typed, efficient, single request for related data.

```ts
// lib/wordpress.ts
const WP_API_URL = process.env.WP_GRAPHQL_URL  // e.g., https://cms.yourdomain.com/graphql

async function fetchGraphQL(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(WP_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Include auth for preview/draft content only
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },  // ISR: revalidate every 60 seconds
  })
  return res.json()
}

// Fetch published posts
export async function getPosts() {
  const data = await fetchGraphQL(`
    query GetPosts {
      posts(first: 10, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          excerpt
          featuredImage { node { sourceUrl altText } }
          date
        }
      }
    }
  `)
  return data.data.posts.nodes
}
```

**Field selection rule:** Always specify fields in GraphQL queries. Never use `*` or over-fetch.

### 3. ISR Configuration

```ts
// app/blog/[slug]/page.tsx
export const revalidate = 60  // ISR: revalidate page every 60 seconds

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

### 4. Preview Mode (Draft Content)

```ts
// app/api/preview/route.ts
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.WP_PREVIEW_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  draftMode().enable()
  return Response.redirect(new URL(`/blog/${slug}`, request.url))
}
```

When in draft mode, fetch content with authentication header to access unpublished drafts.

### 5. Custom Post Types

Register in WordPress via Custom Post Type UI plugin, then expose via WPGraphQL:
- In WPGraphQL settings, enable the custom post type
- In CPT UI, check "Show in GraphQL" when creating the post type
- Access via GraphQL: query name is the `graphqlSingleName` or `graphqlPluralName` set in CPT UI

### 6. Image Handling

```ts
// next.config.js — allow WordPress image domain
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.yourdomain.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}
```

Use `next/image` for all WordPress media — never `<img>` tags.

### 7. RTL Content

WordPress supports RTL natively via `dir` attribute. When rendering WordPress content:
- Check post language/locale from WPGraphQL
- Set `dir="rtl"` on the content container for Arabic/Hebrew content
- Ensure the font stack in `DESIGN.md` includes Arabic-compatible fonts

## Output Artifacts

- `lib/wordpress.ts` — GraphQL fetch utilities
- `app/blog/` — blog/content route handlers
- `next.config.js` — image domain allowlist
- Environment variables: `WP_GRAPHQL_URL`, `WP_APPLICATION_PASSWORD`, `WP_PREVIEW_SECRET`

## Validation Checklist

- [ ] WPGraphQL plugin installed and GraphQL endpoint accessible
- [ ] API user is Editor role (not admin), using Application Password
- [ ] Application Password stored in env var, never committed
- [ ] All GraphQL queries specify explicit fields (no over-fetching)
- [ ] ISR configured (`revalidate: 60` or appropriate interval)
- [ ] Preview mode implemented and secret stored in env var
- [ ] All WordPress images use `next/image` with `remotePatterns` configured
- [ ] `remotePatterns` uses specific hostname, not wildcard (`**`)
- [ ] RTL content tested with Arabic/Hebrew posts

## Handoff Target

Content data feeds the frontend rendering layer. Images feed `frontend/frontend-performance-manager` for optimization review.
```

---

## Final Sync Command (run after all 24 items complete)

```
After completing all skill files above, run the following in the terminal:

pnpm ai:sync

This will mirror all new and updated skill files from `.cursor/skills/` to:
- `.opencode/skills/`
- `.claude/skills/`

Then run:

pnpm ai:check

This validates that all skill files pass the canonical template requirements (skill_id, version, tier, sdd_phase, rtl_aware, certified fields present).

Fix any validation errors before closing.
```

---

## Summary Table

| # | Item | Type | Path | Phase |
|---|---|---|---|---|
| B-1 | design-context-init | NEW | `.cursor/skills/design/design-context-init/SKILL.md` | 0 |
| B-6 | design-iteration-protocol | NEW | `.cursor/skills/design/design-iteration-protocol/SKILL.md` | 0 |
| A2-7 | adr | NEW | `.cursor/skills/system/adr/SKILL.md` | 0 |
| A2-8 | agents-md | NEW | `.cursor/skills/system/agents-md/SKILL.md` | 0 |
| B-2 | design-to-code-handoff | UPGRADE | `.cursor/skills/design/design-to-code-handoff/SKILL.md` | 1 |
| B-3 | wireframe-pipeline | UPGRADE | `.cursor/skills/design/wireframe-pipeline/SKILL.md` | 1 |
| B-4 | interaction-choreography | UPGRADE | `.cursor/skills/design/interaction-choreography/SKILL.md` | 1 |
| B-5 | component-library-api | UPGRADE | `.cursor/skills/design/component-library-api/SKILL.md` | 1 |
| B-7 | brand-visual-direction | UPGRADE | `.cursor/skills/design/brand-visual-direction/SKILL.md` | 1 |
| A1-1 | prisma-orm | UPGRADE | `.cursor/skills/backend/prisma-orm/SKILL.md` | 2 |
| A1-2 | resend-email | UPGRADE | `.cursor/skills/backend/resend-email/SKILL.md` | 2 |
| A1-3 | vercel-ai-sdk | UPGRADE | `.cursor/skills/backend/vercel-ai-sdk/SKILL.md` | 2 |
| A1-6 | spec-writing | UPGRADE | `.cursor/skills/system/spec-writing/SKILL.md` | 2 |
| A1-4 | git-workflow | UPGRADE | `.cursor/skills/external/git-workflow/SKILL.md` | 3 |
| A1-5 | security-hardening | UPGRADE | `.cursor/skills/quality/security-hardening/SKILL.md` | 3 |
| A1-7 | deployment-checklist | UPGRADE | `.cursor/skills/external/deployment-checklist/SKILL.md` | 3 |
| A2-1 | firebase | NEW | `.cursor/skills/backend/firebase/SKILL.md` | 4 |
| A2-2 | firebase-security-rules | NEW | `.cursor/skills/backend/firebase-security-rules/SKILL.md` | 4 |
| A2-3 | firecrawl | NEW | `.cursor/skills/infrastructure/firecrawl/SKILL.md` | 4 |
| A2-4 | browserbase | NEW | `.cursor/skills/infrastructure/browserbase/SKILL.md` | 4 |
| A2-5 | apify-scraper | NEW | `.cursor/skills/backend/apify-scraper/SKILL.md` | 5 |
| A2-6 | gemini-integration | NEW | `.cursor/skills/backend/gemini-integration/SKILL.md` | 5 |
| A2-9 | shadcn-ui | NEW | `.cursor/skills/frontend/shadcn-ui/SKILL.md` | 5 |
| A2-10 | wordpress | NEW | `.cursor/skills/frontend/wordpress/SKILL.md` | 5 |
