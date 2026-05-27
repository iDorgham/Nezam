# NEZAM Design Skills & Agents — Reference Audit & Upgrade Plan

**Goal:** Audited `docs/reference/` (7 archives, ~7,500 files, 260MB+ of design reference material), mapped gaps against our 32 design skills + 27 design agents, and produced a prioritized upgrade plan.

**Methodology:**
1. Deep-scanned all 7 reference archives
2. Read all 32 `.cursor/skills/design/` SKILL.md files and 27 design-related agents
3. Read the 2 global design skills (`impeccable`, `superdesign`)
4. Mapped gaps, bugs, and upgrade opportunities

---

## Reference Inventory (what we have in docs/reference/)

| Archive | Size | What It Contains | Usability |
|---------|------|-----------------|-----------|
| **open-design-main** | 260MB | 135 functional skills, 152 brand design systems (full tokens.css + DESIGN.md + components.html + manifests), schema governance (DTCG-like token taxonomy), production daemon + web UI | **Highest value** — full brand token systems we can adopt directly |
| **impeccable-main** | 43MB | 39 design reference files (typography, color, motion, interaction, critique, audit, live browser), 30+ operational scripts, anti-pattern detection engine | **High value** — reference docs are best-in-class, detection scripts are production-grade |
| **awesome-design-skills-main** | 596KB | 67 design system skill pairs (SKILL.md + DESIGN.md) for different aesthetics | **Medium value** — template pattern is useful, specific brand specs are thin |
| **skills-main** (Anthropic Official) | 11MB | 17 skills including canvas-design, frontend-design, theme-factory (10 themes), docx/pptx/pdf production skills, claude-api, mcp-builder | **Medium value** — theme-factory themes and frontend-design anti-patterns are useful |
| **awesome-shadcn-ui-main** | 1.8MB | Next.js 15 website with 50+ Radix UI components, shadcn/ui resource directory | **Low value** — reference site, not directly usable as skills |
| **typeui-main** | 532KB | TypeUI CLI + canonical blueprint for SKILL.md authoring | **Medium value** — the DESIGN.md blueprint is a good quality standard |
| **sketch-plugin-master** | 15MB | Atlassian Sketch plugin (2019, deprecated) | **Low value** — outdated platform-specific plugin |

---

## Critical Bugs Found in Existing Skills

| Skill | Bug | Severity |
|-------|-----|----------|
| `nezam-design-selector` | Double `nezam-` prefix: `"nezam-"nezam-[option name]"` instead of `"nezam-[option name]"` | **High** — produces malformed IDs |
| `nezam-design-selector` | Hardcoded ASCII wireframes duplicating `wireframe-catalog` instead of calling it | **Medium** — bloated 558 lines, violates DRY |
| `nezam-design-selector` | DESIGN_CHOICES.md template includes ALL product type blocks regardless of detected type | **Medium** — generates messy output |
| `nezam-token-synthesis-pro` | References `DESIGN_SYSTEM.md` (non-existent file) instead of `DESIGN.md` or `theme.md` | **High** — skill references wrong input |
| `nezam-token-synthesis-pro` | Only 29 lines — no DTCG format, no output examples, no drift detection implementation | **High** — essentially a stub |
| `nezam-design-hub` | Only 21 lines — describes Design Hub but provides zero actionable guidance | **High** — stub with no value |
| `nezam-design-md` | Only 32 lines — checklist with no workflow, no examples, no migration path | **Medium** — underdeveloped |
| `nezam-visual-canvas-engine` | Only 51 lines — no anti-patterns, no library decision criteria, no touch/gesture support | **Medium** — thin for Tier 3 |
| `nezam-brand-visual-direction` | References `docs/DESIGN.md` but other skills reference root `DESIGN.md` | **Medium** — path inconsistency |
| Cross-skill | DESIGN.md path: `DESIGN.md` (root) vs `docs/DESIGN.md` vs `.nezam/core/plans/04-design/DESIGN.md` | **High** — path inconsistency |
| Cross-skill | DESIGN_CHOICES path: `.nezam/core/plans/04-design/DESIGN_CHOICES.md` vs `docs/plan/design/DESIGN_CHOICES.yaml` | **High** — path inconsistency |
| Cross-skill | `screen_id` format in wireframe-pipeline has `nezam-"[id]"` double nesting bug | **Medium** |

## Gap Analysis — Skills We Should Create

| Gap | Priority | Rationale |
|-----|----------|-----------|
| **Design Review/QA skill** | P0 | No skill for reviewing completed designs against spec, doing visual regression, or quality-gating handoff. Impeccable's `critique` + `audit` references show what this should be. |
| **Color System & OKLCH skill** | P0 | We have token-synthesis but no skill explaining _how_ to build a color system. Open-design's `color-expert` (286K words) and impeccable's `color-and-contrast.md` are references. Critical for the OKLCH mandate. |
| **Figma integration skill** | P0 | The wireframe-pipeline lists "Figma MCP" as primary ingestion mode but we have no Figma skill. Open-design has 5 Figma skills we can learn from. |
| **Design System Documentation / Storybook skill** | P1 | No skill for creating pattern libraries, component usage guides, or Storybook stories from design tokens. |
| **Responsive Design Patterns skill** | P1 | Responsive logic is scattered across 4 skills. Needs a dedicated skill. Impeccable's `adapt.md` and `responsive-design.md` are excellent references. |
| **Design System Migration skill** | P1 | No skill for breaking changes, version bumps, brand migrations, or token rename/restructure operations. |
| **DesignOps / Workflow Automation skill** | P2 | No skill for design toolchain management, design asset governance, or workflow automation. |
| **Cross-platform Design Parity skill** | P2 | No skill for ensuring visual parity across web, iOS, Android, email. |
| **Conversational UI / Voice Design skill** | P2 | No skill for chatbot UI patterns, voice interfaces, conversational UX. |
| **Design Sprint / Workshop Facilitation skill** | P2 | No skill for design studios, collaborative workshops, design sprints. |
| **Iconography / Illustration Systems skill** | P3 | No dedicated skill for icon library management, illustration style guides, SVG asset pipelines. |
| **3D / WebGL Design Patterns skill** | P3 | motion-3d covers progressive fallbacks but no dedicated 3D scene design patterns skill. |

## Gap Analysis — Agents We Should Create

| Agent | Priority | Rationale |
|-------|----------|-----------|
| **figma-integration-specialist** | P0 | Bridge between design specs and Figma — component extraction, token sync, MCP operations. |
| **design-qa-reviewer** | P0 | Dedicated review agent that verifies completed designs against DESIGN.md specs, runs anti-pattern checks, and gates handoff. |
| **color-system-architect** | P1 | Specialized in OKLCH color system design, palette generation, contrast optimization, and color token governance. |
| **storybook-documentation-agent** | P1 | Generates Storybook stories, component usage guides, and pattern library documentation from token specs. |
| **responsive-design-specialist** | P1 | Dedicated responsive design agent focused on breakpoint strategies, container queries, and cross-device parity. |
| **design-system-migration-agent** | P2 | Plans and executes design system migrations, brand changes, and token refactoring. |
| **designops-engineer** | P2 | Design toolchain management, design asset governance, workflow automation. |
| **cross-platform-parity-agent** | P2 | Ensures visual parity across web, iOS, Android, and email. |
| **conversational-ui-designer** | P3 | Chatbot UI patterns, voice interface design, conversational flows. |

## Improvements to Existing Agents

| Agent | Improvement | Priority |
|-------|-------------|----------|
| **design-excellence-lead** | Add routing for new skills (color-system, design-qa, responsive) | P0 |
| **design-systems-token-architect** | Add Figma sync responsibility, reference open-design token schema | P0 |
| **lead-uiux-designer** | Add design review gate step before handoff approval | P1 |
| **lead-styling-theming-architect** | Add color system governance and OKLCH enforcement | P1 |
| **visual-regression-automator** | Integrate with Playwright, add RTL baseline management | P1 |
| **design-debt-analyst** | Add color drift detection, token usage degradation monitoring | P2 |

---

## Immediate Action Items (P0 — Next Session)

### Fix 1: `nezam-design-hub` — Rewrite from stub to functional skill
- Reference: open-design-main daemon API patterns
- Add: API endpoint catalog, CRUD for sitemaps/wireframes/tokens, integration hooks
- Target: 80+ lines with working examples

### Fix 2: `nezam-token-synthesis-pro` — Full rewrite
- Reference: open-design-main `_schema/tokens.schema.ts`, typeui-main DESIGN.md, W3C DTCG spec
- Add: DTCG JSON format examples, framework-specific bindings (CSS/React/Vue/Flutter), drift detection implementation, validation checklist
- Target: 120+ lines with real code examples

### Fix 3: `nezam-design-selector` — Bug fixes
- Remove hardcoded ASCII art (delegate to wireframe-catalog)
- Fix double `nezam-` prefix in DESIGN_CHOICES.md template
- Fix DESIGN_CHOICES.md to only include relevant product type blocks
- Fix inline path inconsistencies

### Fix 4: Cross-skill path unification
- Audit all 32 skills for `DESIGN.md`, `DESIGN_CHOICES`, `theme.md` path references
- Unify to canonical paths per AGENTS.md
- Fix `design-md` and `brand-visual-direction` path inconsistencies

### Fix 5: Create `color-system-architect` skill + agent
- Reference: open-design-main `color-expert` skill (286K words), impeccable `color-and-contrast.md`
- Covers: OKLCH/OKLAB, palette generation, WCAG contrast, dark/light modes, tinted neutrals, cultural color semantics
- Output: production `DESIGN_SYSTEM.md` with complete color token system

### Fix 6: Create `design-qa-reviewer` skill + agent
- Reference: impeccable `critique.md`, `audit.md`, `heuristics-scoring.md`, `polish.md`
- Covers: spec compliance verification, anti-pattern detection, visual regression, a11y audit, RTL parity check
- Integrates with `design_health.yaml` and `sdd-gate-validator`

---

## Medium-Term Actions (P1 — Next 2 Sessions)

### Fix 7: Create `figma-integration-specialist` agent + skill
- Reference: open-design-main `figma-use`, `figma-generate-design`, `figma-code-connect-components`, `figma-create-design-system-rules`
- Covers: Figma MCP operations, component extraction, design token sync, file management
- Integrates with: wireframe-pipeline ingestion phase

### Fix 8: Create responsive design dedicated skill
- Reference: impeccable `adapt.md`, `responsive-design.md`, `spatial-design.md`
- Consolidate responsive logic from: dashboard-layout-pro, css-architecture, wireframe-pipeline

### Fix 9: Create `storybook-documentation-agent` skill + agent
- Reference: open-design-main `component-library-api` patterns
- Covers: Storybook story generation, component usage documentation, prop table generation, visual regression baselines

### Fix 10: Create design system migration skill
- Covers: breaking change management, version bumps, brand migrations, token rename/restructure, migration guide generation
- Integrates with: design-debt-analyst agent

---

## Strategic Asset Adoption (from docs/reference/)

### Adopt ASAP:
1. **open-design-main `_schema/` token governance** — 4-layer token taxonomy (A1-identity, A1-structure, A2, B-slot, C-extension) with promotion paths. This is a proven production pattern.
2. **open-design-main `default/` design system** — Complete production-quality design system with DESIGN.md + tokens.css + components.html + components.manifest.json. Use as our baseline design system template.
3. **impeccable `scripts/` anti-pattern detection engine** — The `detect-antipatterns-browser.js` (167KB) and `rules/checks.mjs` (83KB) are production-grade. Consider wrapping as a NEZAM check script.

### Study & Apply Patterns From:
1. **open-design-main `design-brief/` skill** — The I-Lang protocol (8 validated dimensions, closed vocabularies, symbolic-to-concrete token resolution tables) is a superior alternative to our current intent-inference approach.
2. **open-design-main brand token systems** — 152 complete design systems with normalized token naming. Extract naming conventions for our token standardization.
3. **impeccable 39 reference files** — Best-in-class reference material for typography, spatial design, motion, interaction design, color science. Use as quality standards.

### Reference Only (Not Directly Adoptable):
1. **sketch-plugin-master** — Outdated platform-specific plugin. Not useful.
2. **awesome-shadcn-ui-main** — Reference registry website. Not directly usable as skills.
3. **awesome-design-skills** 67 skills — Template pattern is useful but individual skills are thin (2 files, <100 lines each). Better to use open-design's normalized versions.

---

## Summary

| Category | Count |
|----------|-------|
| Critical bugs to fix | 12 |
| New skills to create | 12 (6 P0, 4 P1, 2 P2) |
| New agents to create | 9 (2 P0, 3 P1, 3 P2, 1 P3) |
| Existing agents to improve | 6 |
| Reference assets to adopt | 3 direct, 4 pattern-study |
| Total estimated sessions | 3-4 sessions of work |

## Recommended Execution Order

1. **Session 1:** Fix bugs (Fix 1-4) + Create color-system-architect (Fix 5)
2. **Session 2:** Create design-qa-reviewer (Fix 6) + Create figma-integration-specialist (Fix 7)
3. **Session 3:** Responsive skill (Fix 8) + Storybook agent (Fix 9) + Migration skill (Fix 10)
4. **Session 4:** Adopt open-design token schema, improve existing agents, P2 items
