# NEZAM V3 Design Excellence — Implementation Plan

**Goal:** Upgrade the NEZAM workspace design layer to V3 by adding Impeccable-style design governance, MENA/RTL-native tooling, token-first quality gates, and deterministic skill execution across 10 phases.

**Architecture:** New skills, agents, rules, and state files are layered on top of the existing `.cursor/` structure without removing existing capabilities. Phase gating is enforced through `design_health.yaml` and `dashboard_health.yaml`; progression only flips when `sdd-gate-validator` returns PASS.

**Tech Stack:** YAML state files, Markdown skill/command/agent files, Bash CI scripts, Node.js scaffold script, pnpm workspace scripts (`ai:sync`, `ai:check`).

---

## Gap Summary (existing vs. what V3 adds)

| Area | Exists | Needs Adding |
|---|---|---|
| `.cursor/skills/design/` | 20+ design skills | 8 new V3 skills |
| `.cursor/skills/pm/` | nothing | `prioritize-rice` |
| `.cursor/skills/system/` | many | `sdd-gate-validator` |
| `.cursor/commands/` | plan, develop, fix… | `design.md` (new), enhanced plan/develop |
| `.cursor/rules/` | `agent-lazy-load.mdc`, `design-gates.mdc` | `design-excellence-gates.mdc`, `dashboard-design-gates.mdc`, updated lazy-load |
| `.cursor/state/` | AGENT_REGISTRY, plan_progress | `design_health.yaml`, `dashboard_health.yaml`, `workspace.settings.yaml`, updated registry + progress |
| `.cursor/agents/` | 100+ agents | 7 new V3 design-excellence agents |
| `.cursor/templates/` | nothing | `ui-ux/design/DESIGN-v2.template.md`, `DASHBOARD_SPEC.template.md` |
| `DESIGN_SYSTEM.md` | nothing | Create with chart tokens + OKLCH system |
| `.nezam/design-server/` | nothing | `docs/VISUAL_BUILDER_V2.md`, `styles/global.template.css` |
| `scripts/scaffold-nezam-v3.js` | nothing | Create |
| `scripts/checks/` | nothing | `check-design-excellence.sh`, `check-dashboard-specs.sh` |

---

## Task 1: Create 7 New Design Excellence Agent Files

**Files:**
- Create: `.cursor/agents/design-excellence-lead.md`
- Create: `.cursor/agents/cultural-design-validator.md`
- Create: `.cursor/agents/token-architect-pro.md`
- Create: `.cursor/agents/a11y-rtl-integration-engineer.md`
- Create: `.cursor/agents/motion-performance-specialist.md`
- Create: `.cursor/agents/design-debt-analyst.md`
- Create: `.cursor/agents/visual-regression-automator.md`

**Step 1: Create `.cursor/agents/design-excellence-lead.md`**

```markdown
---
id: design-excellence-lead
tier: 1
swarm: [swarm-2, swarm-14]
version: 1.0.0
created: 2026-05-22
---

# Design Excellence Lead

## Role
Orchestrate end-to-end design quality. Enforce `design-excellence-gates.mdc`. Maintain `design_health.yaml`. Approve handoffs to engineering.

## Lazy Trigger
`design|token|a11y|motion|cultural|impeccable|audit|critique|polish|distill|animate|colorize|typeset|arrange`

## Responsibilities
- Route `/DESIGN` subcommands to appropriate skill
- Enforce gate matrix before phase flip
- Update `design_health.yaml` after every audit
- Block `/DEVELOP` if `design_health.yaml` thresholds not met
- Promote approved designs to `HANDOFF_QUEUE.yaml`

## Gate Enforcement
Before any design output, validate:
1. `onboarding.yaml:phase_00_onboarding=true`
2. `plan_progress.yaml:phase_02_design` prerequisites
3. Zero hardcoded hex literals in specs
4. RTL parity documented

## Handoff Protocol
When audit passes all thresholds, append to `HANDOFF_QUEUE.yaml`:
- id: DESIGN-{{id}}
- status: approved
- type: design
- agent: design-excellence-lead
- artifact: docs/plans/05-design/DESIGN_BRIEF_{{page}}.md
```

**Step 2: Create `.cursor/agents/cultural-design-validator.md`**

```markdown
---
id: cultural-design-validator
tier: 2
swarm: swarm-14
version: 1.0.0
created: 2026-05-22
---

# Cultural Design Validator

## Role
Validate design against MENA cultural norms per dialect (Khaleeji, Masri, Levantine, Maghrebi, MSA).

## Responsibilities
- Color semantics: green=positive KSA, red=caution Levant
- Typography: Tajawal (Khaleeji), Noto Sans Arabic (formal)
- Layout: right-aligned CTAs Khaleeji, center Masri
- Iconography: avoid sensitive hand gestures
- Calendar: Hijri/Gregorian toggle if date inputs present
- Ramadan mode validation

## Invoked By
`/DESIGN localize --dialect=<khaleeji|masri|levantine|maghrebi|msa>`
```

**Step 3: Create `.cursor/agents/token-architect-pro.md`**

```markdown
---
id: token-architect-pro
tier: 2
swarm: swarm-14
version: 1.0.0
created: 2026-05-22
---

# Token Architect Pro

## Role
W3C DTCG token generation, cross-framework sync, drift detection.

## Responsibilities
- Generate W3C DTCG format JSON from DESIGN_SYSTEM.md
- Create CSS variables, React theme objects, Vue tokens, Dart types
- Detect token drift (zero literal values in output)
- Maintain CI drift detection script
- Enforce: OKLCH >= 80% of palette, tinted neutrals >= 90%

## Invoked By
`/DESIGN tokens --framework=<react|vue|flutter>`
```

**Step 4: Create `.cursor/agents/a11y-rtl-integration-engineer.md`**

```markdown
---
id: a11y-rtl-integration-engineer
tier: 2
swarm: swarm-14
version: 1.0.0
created: 2026-05-22
---

# A11y + RTL Integration Engineer

## Role
WCAG 2.2 AA compliance + MENA screen-reader patterns, RTL focus order, Arabic ARIA labels.

## Responsibilities
- Generate ARIA labels in Arabic per dialect
- Define RTL focus order (tab > arrow > escape)
- Create screen-reader data tables for all chart components
- Validate color contrast: >= 4.5:1 text, >= 3:1 UI components
- Document keyboard navigation paths
- RTL mirror snapshot validation (CI gate)

## Invoked By
`/DESIGN audit --strict`, `/DESIGN harden`, `/DESIGN localize`
```

**Step 5: Create `.cursor/agents/motion-performance-specialist.md`**

```markdown
---
id: motion-performance-specialist
tier: 2
swarm: swarm-14
version: 1.0.0
created: 2026-05-22
---

# Motion Performance Specialist

## Role
Framer Motion/GSAP code, prefers-reduced-motion, GPU hints, performance budgets.

## Responsibilities
- Entrance <= 350ms, update <= 200ms, exit <= 150ms
- Easing: cubic-bezier(0.25, 0.1, 0.25, 1.0) for data, linear for scrubbing
- GPU hints: transform, will-change, contain: layout
- prefers-reduced-motion fallback: instant-opacity-crossfade
- No JS-driven layout thrashing during transitions

## Invoked By
`/DESIGN animate`, `/DESIGN motion --budget=<60fps|30fps>`, `/DESIGN overdrive`
```

**Step 6: Create `.cursor/agents/design-debt-analyst.md`**

```markdown
---
id: design-debt-analyst
tier: 3
swarm: swarm-14
version: 1.0.0
created: 2026-05-22
---

# Design Debt Analyst

## Role
Track token drift, a11y regressions, RTL gaps. Propose /FIX design actions.

## Responsibilities
- Monitor `design_health.yaml` metrics over time
- Flag when design debt score exceeds 20/100
- Identify anti-pattern accumulation
- Generate debt reduction tickets for `HANDOFF_QUEUE.yaml`
- Report OKLCH usage drops below 80%
```

**Step 7: Create `.cursor/agents/visual-regression-automator.md`**

```markdown
---
id: visual-regression-automator
tier: 3
swarm: swarm-14
version: 1.0.0
created: 2026-05-22
---

# Visual Regression Automator

## Role
CI visual testing, LTR/RTL screenshot diff, fail on > 2px diff.

## Responsibilities
- Maintain visual baseline for all components in LTR and RTL
- Run Playwright visual diff on every PR
- Fail CI if diff > 2px in any region
- Update baselines only after explicit approval
- Report to `dashboard_health.yaml:visual_regression_status`
```

**Step 8: Run ai:sync**

```bash
pnpm ai:sync
```
Expected: completes without error, CLAUDE.md agent index updated.

**Step 9: Commit**

```bash
git add .cursor/agents/design-excellence-lead.md \
  .cursor/agents/cultural-design-validator.md \
  .cursor/agents/token-architect-pro.md \
  .cursor/agents/a11y-rtl-integration-engineer.md \
  .cursor/agents/motion-performance-specialist.md \
  .cursor/agents/design-debt-analyst.md \
  .cursor/agents/visual-regression-automator.md
git commit -m "feat(agents): add swarm-14 design excellence agent team"
```

---

## Task 2: Update AGENT_REGISTRY.yaml and agent-lazy-load.mdc

**Files:**
- Modify: `.cursor/state/AGENT_REGISTRY.yaml`
- Modify: `.cursor/rules/agent-lazy-load.mdc`

**Step 1: Append swarm-14 + new orchestrators to AGENT_REGISTRY.yaml**

At the end of `.cursor/state/AGENT_REGISTRY.yaml`, add:

```yaml
swarm-14:
  theme: design-excellence
  agents: [design-excellence-lead, cultural-design-validator, token-architect-pro, motion-performance-specialist, a11y-rtl-integration-engineer, design-debt-analyst, visual-regression-automator]

design-excellence-lead:
  tier: 1
  swarm: [swarm-2, swarm-14]
  responsibilities: "Orchestrate end-to-end design quality. Enforce design-excellence-gates.mdc. Maintain design_health.yaml. Approve handoffs to engineering."
  lazy_trigger: "design|token|a11y|motion|cultural|impeccable|audit|critique|polish|distill|animate|colorize|typeset|arrange"

dashboard-orchestrator:
  tier: 1
  swarm: [swarm-2, swarm-8]
  responsibilities: "Routes dashboard intents, enforces design/analytic gates, promotes to HANDOFF_QUEUE.yaml"
  lazy_trigger: "dashboard|analytics|chart|kpi|data-viz|motion|rtl-parity"

hybrid-pm-orchestrator:
  tier: 1
  swarm: [swarm-pm]
  responsibilities: "Scrumban workflow, WIP limits, RICE prioritization, blocked task escalation"
  lazy_trigger: "plan|develop|backlog|sprint|scrumban|rice|wip"

cultural-design-validator:
  tier: 2
  swarm: swarm-14
  domain: design-excellence
  responsibilities: "MENA cultural norms per dialect. Color semantics, typography, layout, iconography, calendar awareness"

token-architect-pro:
  tier: 2
  swarm: swarm-14
  domain: design-excellence
  responsibilities: "W3C DTCG token generation, cross-framework sync, drift detection"

a11y-rtl-integration-engineer:
  tier: 2
  swarm: swarm-14
  domain: design-excellence
  responsibilities: "WCAG 2.2 AA + MENA screen-reader patterns, RTL focus order, Arabic ARIA labels"

motion-performance-specialist:
  tier: 2
  swarm: swarm-14
  domain: design-excellence
  responsibilities: "Framer Motion/GSAP code, prefers-reduced-motion, GPU hints, perf budgets"

design-debt-analyst:
  tier: 3
  swarm: swarm-14
  responsibilities: "Track token drift, a11y regressions, RTL gaps. Propose /FIX design actions"

visual-regression-automator:
  tier: 3
  swarm: swarm-14
  responsibilities: "CI visual testing, LTR/RTL screenshot diff, fail on >2px diff"
```

**Step 2: Append V3 trigger rules to agent-lazy-load.mdc**

At the end of `.cursor/rules/agent-lazy-load.mdc`, add:

```markdown
## V3 Lazy-Load Triggers (keep session <8k tokens)
- `dashboard|analytics|chart|kpi|data-viz|rtl-parity` → load dashboard-orchestrator, swarm-8 agents
- `design|token|a11y|motion|cultural|impeccable|audit|critique|polish|distill|animate|colorize|typeset|arrange|delight|bolder|quieter|extract|adapt|onboard|harden|optimize|clarify|normalize|overdrive` → load design-excellence-lead, swarm-14 agents
- `plan|develop|backlog|sprint|scrumban|rice|wip` → load hybrid-pm-orchestrator
- Swarm 14 (Design Excellence): `design-excellence-lead`, `cultural-design-validator`, `token-architect-pro`, `a11y-rtl-integration-engineer`, `motion-performance-specialist`
- Defer non-relevant swarms. Use @ references only when invoked.
```

**Step 3: Verify**

```bash
pnpm ai:check
```
Expected: zero lint errors.

**Step 4: Commit**

```bash
git add .cursor/state/AGENT_REGISTRY.yaml .cursor/rules/agent-lazy-load.mdc
git commit -m "feat(registry): register swarm-14 design excellence agents + V3 lazy-load triggers"
```

---

## Task 3: Create 10 New Skill Files

**Files:**
- Create: `.cursor/skills/pm/prioritize-rice/SKILL.md`
- Create: `.cursor/skills/design/design-intent-inference/SKILL.md`
- Create: `.cursor/skills/design/token-synthesis-pro/SKILL.md`
- Create: `.cursor/skills/design/a11y-rtl-fusion/SKILL.md`
- Create: `.cursor/skills/design/cultural-context-validator/SKILL.md`
- Create: `.cursor/skills/design/motion-choreography-budgeted/SKILL.md`
- Create: `.cursor/skills/design/dashboard-layout-pro/SKILL.md`
- Create: `.cursor/skills/design/chart-spec-generator/SKILL.md`
- Create: `.cursor/skills/design/data-viz-motion-budget/SKILL.md`
- Create: `.cursor/skills/system/sdd-gate-validator/SKILL.md`

**Step 1: Create directory structure**

```bash
mkdir -p .cursor/skills/pm/prioritize-rice
mkdir -p .cursor/skills/design/design-intent-inference
mkdir -p .cursor/skills/design/token-synthesis-pro
mkdir -p .cursor/skills/design/a11y-rtl-fusion
mkdir -p .cursor/skills/design/cultural-context-validator
mkdir -p .cursor/skills/design/motion-choreography-budgeted
mkdir -p .cursor/skills/design/dashboard-layout-pro
mkdir -p .cursor/skills/design/chart-spec-generator
mkdir -p .cursor/skills/design/data-viz-motion-budget
```

**Step 2: Create each SKILL.md**

All 10 files follow the same frontmatter pattern:

```
---
name: <skill-name>
description: <one-line>
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---
```

Create `.cursor/skills/pm/prioritize-rice/SKILL.md`:

```markdown
---
name: prioritize-rice
description: Score backlog items using RICE and update MASTER_TASKS.md
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- `MASTER_TASKS.md` (optional Reach, Impact, Confidence, Effort per task)
- Missing fields: prompt user (1-10 Reach/Impact, 0-100% Confidence, 1-10 Effort)

## Workflow
1. Parse `MASTER_TASKS.md` — each task as `[ ]` or `[x]`
2. For each task without `RICE_SCORE`: compute `(Reach * Impact * Confidence) / Effort`
3. Append `(RICE_SCORE: <score>, PRIORITY: P?)`
4. Sort descending. Assign P0 (top 20%), P1 (30%), P2 (30%), P3 (20%)
5. Rewrite `MASTER_TASKS.md` + create `docs/plans/prioritized_backlog.md`

## Validation
- All tasks have RICE_SCORE and PRIORITY
- No duplicate priorities within same rank band

## Example
Input: `- [ ] Add dashboard filters (Reach: 8, Impact: 9, Confidence: 80%, Effort: 2)`
Output: `- [ ] Add dashboard filters (RICE_SCORE: 288, PRIORITY: P0)`
```

Create `.cursor/skills/design/design-intent-inference/SKILL.md`:

```markdown
---
name: design-intent-inference
description: Parse PRD + research to produce a structured design brief with acceptance criteria
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- `docs/prd/PRD.md` (required)
- `docs/research/user-personas.md` (optional)
- `docs/research/user-flows.md` (optional)

## Workflow
1. Extract user goals, success metrics, constraints from PRD
2. Map to design dimensions: layout, typography, color, motion, a11y, RTL
3. Generate testable acceptance criteria per dimension
4. Output brief to `docs/plans/05-design/DESIGN_BRIEF_<page>.md`

## Validation
- All PRD requirements mapped to >= 1 design dimension
- Acceptance criteria are pass/fail testable
- Cultural context identified if PRD mentions MENA

## Output Format
```json
{
  "brief_id": "BRIEF-001",
  "design_dimensions": {
    "typography": {"arabic_font": "Tajawal", "scale": "modular-8"},
    "color": {"mode": "light-dark", "system": "OKLCH"},
    "motion": {"budget": "60fps", "reduced_motion": true},
    "a11y": {"wcag_level": "AA"},
    "rtl": {"parity": "100%"}
  },
  "cultural_context": {"primary_dialect": "khaleeji", "calendar": "hijri"}
}
```
```

Create `.cursor/skills/design/token-synthesis-pro/SKILL.md`:

```markdown
---
name: token-synthesis-pro
description: Generate W3C DTCG tokens + framework bindings with drift detection
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- `DESIGN_SYSTEM.md` token definitions
- Target frameworks (CSS, React, Vue, Flutter)
- Dark/light mode requirements

## Workflow
1. Parse DESIGN_SYSTEM.md for all token definitions
2. Generate W3C DTCG format JSON
3. Create framework-specific bindings (CSS variables, React theme, Vue, Dart)
4. Add TypeScript/Dart type definitions
5. Generate drift detection config for CI

## Validation
- Zero literal values in output — all values via token references
- Type-safe bindings generated
- Drift detection script included in output

## Output Format
```json
{
  "dtcg_tokens": {"$schema": "https://design-tokens.github.io/schema"},
  "bindings": {
    "css": "styles/tokens.css",
    "react": "src/theme/tokens.ts"
  },
  "drift_check": "scripts/checks/token-drift.js"
}
```
```

Create `.cursor/skills/design/a11y-rtl-fusion/SKILL.md`:

```markdown
---
name: a11y-rtl-fusion
description: Merge accessibility + RTL logic for MENA-native UX
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- Component or chart specs
- Target dialect (khaleeji, masri, levantine, maghrebi, msa)
- WCAG level (AA/AAA)

## Workflow
1. Generate ARIA labels in Arabic per dialect
2. Define RTL focus order (tab > arrow > escape)
3. Create screen-reader data tables for charts
4. Validate color contrast for all states (hover, focus, active, disabled)
5. Document keyboard navigation paths

## Validation
- WCAG AA contrast >= 4.5:1 text, >= 3:1 UI components
- All interactive elements have defined focus order
- Screen-reader tables provided for all data viz

## Output Format
```json
{
  "aria_labels": {"ar": "...", "en": "..."},
  "focus_order": [{"element_id": "...", "direction": "rtl"}],
  "contrast_report": {"pass": [], "fail": []},
  "rtl_rules": {"axis_flip": true, "legend_anchor": "right"}
}
```
```

Create `.cursor/skills/design/cultural-context-validator/SKILL.md`:

```markdown
---
name: cultural-context-validator
description: Validate design against MENA cultural norms per dialect
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- Design specs or component library
- Target dialect and market
- PRD cultural requirements

## Workflow
1. Check color semantics (green=positive KSA, red=caution Levant)
2. Validate typography (Noto Sans Arabic vs Tajawal per dialect)
3. Check layout alignment (right-aligned CTAs Khaleeji, center Masri)
4. Review iconography (avoid sensitive hand gestures)
5. Verify calendar awareness (Ramadan mode, Hijri dates)

## Validation
- Zero culturally insensitive icons/colors
- Dialect-specific font pair enforced
- Calendar components support Hijri if date inputs present

## Output Format
```json
{
  "dialect": "khaleeji",
  "typography": {"primary": "Tajawal", "fallback": "Noto Sans Arabic"},
  "calendar": {"hijri_support": true, "ramadan_mode": true},
  "violations": [],
  "suggestions": []
}
```
```

Create `.cursor/skills/design/motion-choreography-budgeted/SKILL.md`:

```markdown
---
name: motion-choreography-budgeted
description: Animation choreography with hard perf budgets, GPU hints, reduced-motion fallbacks
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- Design or chart specs
- Target framework (Framer Motion, GSAP, CSS, Canvas)
- Perf budget (60fps desktop, 30fps mobile)

## Workflow
1. Define entrance/update/exit transitions per component type
2. Assign easing curves (cubic-bezier for data, linear for scrubbing)
3. Apply GPU compositing hints (transform, will-change, contain: layout)
4. Generate prefers-reduced-motion fallback (instant snap, opacity crossfade)
5. Output timeline spec with duration limits

## Validation
- No JS-driven layout thrashing during transitions
- All animations respect prefers-reduced-motion
- Micro <= 300ms, macro <= 600ms

## Output Format
```json
{
  "transitions": {"entrance": 350, "update": 200, "exit": 150},
  "easing": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
  "gpu_hints": ["transform", "will-change: transform"],
  "reduced_motion": {"fallback": "instant-opacity-crossfade", "duration": 50}
}
```
```

Create `.cursor/skills/design/dashboard-layout-pro/SKILL.md`:

```markdown
---
name: dashboard-layout-pro
description: Dense data layouts, KPI composition, filtering UX, responsive breakpoints, state matrices
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- PRD analytics KPIs and user roles
- Target screen sizes (mobile, tablet, desktop, ultrawide)
- Data refresh frequency (realtime, 5min, daily)

## Workflow
1. Define grid: 12-col desktop, 6-col tablet, 1-col mobile
2. Place KPI cards with progressive disclosure (value > sparkline > tooltip > drilldown)
3. Map filters: global vs local, clear-all, reset defaults, RTL alignment
4. Define states: loading (skeleton), empty (guidance), error (retry + fallback)
5. Generate responsive breakpoint matrix with container query hints

## Validation
- Max 7 primary metrics above fold
- All filters RTL-safe
- Loading skeletons match final component aspect ratio +-5%

## Output Format
```json
{
  "layout_grid": "12x6x1",
  "kpi_pattern": "progressive-disclosure",
  "responsive_breakpoints": {"desktop": "1280px", "tablet": "834px", "mobile": "390px"},
  "state_matrix": ["loading", "empty", "error", "success"]
}
```
```

Create `.cursor/skills/design/chart-spec-generator/SKILL.md`:

```markdown
---
name: chart-spec-generator
description: Framework-agnostic chart specs with a11y, RTL parity, theme token mappings
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- Data schema (dimensions, measures, time ranges)
- Target chart library (Recharts, ECharts, Chart.js, D3, Vega-Lite)
- Accessibility level (WCAG AA/AAA)

## Workflow
1. Map data to visual encoding (position, length, color, shape)
2. Apply contrast thresholds (>= 4.5:1 lines/bars, >= 3:1 backgrounds)
3. Generate RTL/LTR mirroring rules (y-axis flip, legend flip, tooltip anchor)
4. Output theme-aware token mappings (light/dark)
5. Generate ARIA data table structure for screen readers

## Validation
- Zero hardcoded hex values
- All series have distinct pattern/shape fallback
- ARIA table structure provided

## Output Format
```json
{
  "chart_type": "stacked-area",
  "encoding": {"x": "time", "y": "revenue", "color": "segment"},
  "a11y": {"aria_role": "img", "table_structure": "provided"},
  "rtl_rules": {"axis_flip": true, "legend_anchor": "right"},
  "tokens": {"series_1": "token/color/primary"}
}
```
```

Create `.cursor/skills/design/data-viz-motion-budget/SKILL.md`:

```markdown
---
name: data-viz-motion-budget
description: Animation choreography for charts/dashboards with hard perf budgets
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- Chart specs from chart-spec-generator
- Target framework (Framer Motion, GSAP, CSS, Canvas)
- Perf budget (60fps desktop, 30fps mobile)

## Workflow
1. Define entrance/update/exit transitions per chart type
2. Assign easing curves (cubic-bezier for data, linear for scrubbing)
3. Apply GPU compositing hints (transform, will-change, contain: layout)
4. Generate prefers-reduced-motion fallback
5. Output timeline spec: entrance <= 350ms, update <= 200ms, exit <= 150ms

## Validation
- No JS-driven layout thrashing during transitions
- LCP/CLS impact <= 0.1 during initial chart render
- All animations respect prefers-reduced-motion

## Output Format
```json
{
  "transitions": {"entrance": 350, "update": 200, "exit": 150},
  "easing": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
  "gpu_hints": ["transform", "will-change: transform", "contain: strict"],
  "reduced_motion": {"fallback": "instant-opacity-crossfade", "duration": 50}
}
```
```

Create `.cursor/skills/system/sdd-gate-validator/SKILL.md`:

```markdown
---
name: sdd-gate-validator
description: Deterministic gate validation for SDD phase transitions
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- Target gate file (e.g., `design-excellence-gates.mdc`, `dashboard-design-gates.mdc`)
- Current state files (`design_health.yaml`, `dashboard_health.yaml`)
- Artifact files to validate

## Workflow
1. Load gate rules as checklist
2. Evaluate each rule against artifacts deterministically
3. Compute pass/fail per category
4. Update state YAML with current metrics
5. If all required thresholds met: return PASS (allows phase flip)
6. If any required threshold failed: return FAIL (blocks progression)

## Validation
- All gate rules evaluated deterministically — no LLM discretion in pass/fail
- State YAML updated atomically

## Output Format
```json
{
  "gate": "design-excellence-gates.mdc",
  "result": "PASS|FAIL|PARTIAL",
  "metrics": {"anti_pattern_score": 95, "a11y_compliance": 98, "rtl_parity": 100, "token_drift": 0},
  "blocked_by": [],
  "phase_flip_allowed": true
}
```
```

**Step 3: Verify frontmatter passes lint**

```bash
pnpm ai:check
```
Expected: `check-skill-frontmatter.js` passes zero errors for all new skill files.

**Step 4: Commit**

```bash
git add .cursor/skills/pm/ \
  .cursor/skills/design/design-intent-inference \
  .cursor/skills/design/token-synthesis-pro \
  .cursor/skills/design/a11y-rtl-fusion \
  .cursor/skills/design/cultural-context-validator \
  .cursor/skills/design/motion-choreography-budgeted \
  .cursor/skills/design/dashboard-layout-pro \
  .cursor/skills/design/chart-spec-generator \
  .cursor/skills/design/data-viz-motion-budget \
  .cursor/skills/system/sdd-gate-validator
git commit -m "feat(skills): add 10 V3 design excellence + RICE + gate validator skills"
```

---

## Task 4: Create the /DESIGN Command

**Files:**
- Create: `.cursor/commands/design.md`

**Step 1: Create the file**

Create `.cursor/commands/design.md`:

```markdown
# /DESIGN — Design Excellence Orchestrator (Impeccable++)

## Hardlocks
- `onboarding.yaml:phase_00_onboarding=true`
- `plan_progress.yaml:phase_02_design=true`
- `design_health.yaml:baseline_exists=true`

## Subcommands

| Subcommand | Impeccable Equivalent | Purpose |
|---|---|---|
| `/DESIGN intent` | `/impeccable shape` | Generate brief from PRD |
| `/DESIGN audit` | `/impeccable audit` | Run 50+ anti-pattern checks |
| `/DESIGN critique` | `/impeccable critique` | UX review: hierarchy, clarity, resonance |
| `/DESIGN polish` | `/impeccable polish` | Final pass before handoff |
| `/DESIGN distill` | `/impeccable distill` | Strip to essence |
| `/DESIGN animate` | `/impeccable animate` | Add purposeful motion with perf budget |
| `/DESIGN colorize` | `/impeccable colorize` | Strategic color to monochromatic UIs |
| `/DESIGN typeset` | `/impeccable typeset` | Fix font choices, hierarchy, sizing |
| `/DESIGN arrange` | `/impeccable arrange` | Fix layout, spacing, visual rhythm |
| `/DESIGN bolder` | `/impeccable bolder` | Amplify safe designs |
| `/DESIGN quieter` | `/impeccable quieter` | Tone down aggressive designs |
| `/DESIGN delight` | `/impeccable delight` | Add memorable moments of joy |
| `/DESIGN extract` | `/impeccable extract` | Pull into reusable components |
| `/DESIGN adapt` | `/impeccable adapt` | Adapt for different devices/contexts |
| `/DESIGN onboard` | `/impeccable onboard` | Design onboarding flows and empty states |
| `/DESIGN harden` | `/impeccable harden` | Error handling, i18n, edge cases |
| `/DESIGN optimize` | `/impeccable optimize` | Performance improvements |
| `/DESIGN clarify` | `/impeccable clarify` | Improve unclear UX copy |
| `/DESIGN normalize` | `/impeccable normalize` | Align with design system standards |
| `/DESIGN overdrive` | `/impeccable overdrive` | Shaders, spring physics, scroll-driven |
| `/DESIGN localize --dialect=<khaleeji\|masri\|levantine\|maghrebi\|msa>` | — | Validate cultural context |
| `/DESIGN tokens --framework=<react\|vue\|flutter>` | — | Generate framework-bound tokens |
| `/DESIGN motion --budget=<60fps\|30fps>` | — | Create perf-budgeted animations |
| `/DESIGN iterate` | — | Reflection loop on design output |
| `/DESIGN migrate --from=impeccable` | — | Import Impeccable artifacts to NEZAM |
| `/DESIGN dashboard intent <page>` | — | Generate dashboard brief from PRD |
| `/DESIGN dashboard spec <page> --chart=<type> --framework=<lib>` | — | Generate chart/layout spec |
| `/DESIGN dashboard motion <page>` | — | Generate animation choreography |
| `/DESIGN dashboard audit --strict` | — | Run 40+ dashboard-specific checks |

## Execution Flow
1. Validate hardlocks via `@.cursor/rules/design-excellence-gates.mdc`
2. Load `@.cursor/agents/design-excellence-lead.md`
3. Route to skill per table below
4. Update `@.cursor/state/design_health.yaml`
5. If audit passes, promote to `HANDOFF_QUEUE.yaml` for `/DEVELOP`

## Skill Routing

| Subcommand | Skill |
|---|---|
| `intent`, `dashboard intent` | `design-intent-inference` |
| `tokens` | `token-synthesis-pro` |
| `audit`, `harden` | `a11y-rtl-fusion` |
| `localize` | `cultural-context-validator` |
| `animate`, `motion`, `overdrive` | `motion-choreography-budgeted` |
| `dashboard spec` | `dashboard-layout-pro` + `chart-spec-generator` |
| `dashboard motion` | `data-viz-motion-budget` |
| any (post-output) | `sdd-gate-validator` |
```

**Step 2: Run ai:sync**

```bash
pnpm ai:sync
```
Expected: CLAUDE.md synced command index includes `design.md`.

**Step 3: Commit**

```bash
git add .cursor/commands/design.md
git commit -m "feat(commands): add /DESIGN command with 29 Impeccable-mapped subcommands"
```

---

## Task 5: Enhance /PLAN and /DEVELOP Commands

**Files:**
- Modify: `.cursor/commands/plan.md`
- Modify: `.cursor/commands/develop.md`

**Step 1: Add V3 subcommands to plan.md**

In `.cursor/commands/plan.md`, append after the existing subcommand list:

```markdown
  /PLAN prioritize --framework=rice   -> Score backlog via RICE -> MASTER_TASKS.md with RICE_SCORE + P0..P3
  /PLAN design intent <page>          -> Design brief from PRD -> docs/plans/05-design/DESIGN_<page>.md
  /PLAN design dashboard intent <page> -> Dashboard brief -> docs/plans/05-design/DASHBOARD_<page>.md
  /PLAN design audit --strict         -> 50+ anti-pattern checks -> design_audit_report.md
  /PLAN design dashboard audit --strict -> 40+ dashboard checks -> dashboard_audit_report.md
```

And append this section:

```markdown
## RICE Execution Flow (/PLAN prioritize)
1. Load `MASTER_TASKS.md`
2. For each task without `RICE_SCORE`, invoke `.cursor/skills/pm/prioritize-rice/SKILL.md`
3. Compute: `(Reach * Impact * Confidence) / Effort`
4. Sort descending. Assign P0 (top 20%), P1 (30%), P2 (30%), P3 (20%)
5. Rewrite `MASTER_TASKS.md` + create `docs/plans/prioritized_backlog.md`
```

**Step 2: Add Scrumban WIP rules to develop.md**

In `.cursor/commands/develop.md`, append after the existing subcommands:

```markdown
## WIP Limits (Scrumban V3)
- Max 3 tasks in `in_progress` globally
- Max 1 task per agent from `HANDOFF_QUEUE.yaml`
- Blocked >2h: auto-move to `blocked`, notify `hybrid-pm-orchestrator`
- P0 blocked >1h: notify `swarm-leader`, flag `#alerts`

## Scrumban Board State
Maintained in `.cursor/state/plan_progress.yaml:scrumban_board`:
- backlog, in_progress (max 3), review, done, blocked
- wip_limit: 3
```

**Step 3: Verify and commit**

```bash
pnpm ai:sync && pnpm ai:check
git add .cursor/commands/plan.md .cursor/commands/develop.md
git commit -m "feat(commands): add V3 RICE prioritization and Scrumban WIP limits"
```

---

## Task 6: Create Gate Rule Files

**Files:**
- Create: `.cursor/rules/design-excellence-gates.mdc`
- Create: `.cursor/rules/dashboard-design-gates.mdc`

**Step 1: Create `design-excellence-gates.mdc`**

Create `.cursor/rules/design-excellence-gates.mdc`:

```markdown
---
description: Design excellence gates blocking unsafe phase progression. 50+ anti-pattern checks.
alwaysApply: false
created: 2026-05-22
version: 1.0.0
owner: design-excellence-lead
---

# Design Excellence Gates (Impeccable++)

## Anti-Pattern Hard Blocks (27 rules)
- [ ] No Inter/Arial as default font
- [ ] No purple-to-blue gradients (use OKLCH tinted neutrals)
- [ ] No gray text on colored backgrounds (>= 4.5:1 contrast)
- [ ] No cards nested in cards
- [ ] No rounded-square icon tiles above every heading
- [ ] No pure black without tinting
- [ ] No bounce easing (use cubic-bezier)
- [ ] No decorative motion without purpose
- [ ] No arbitrary spacing (use 8px baseline grid)
- [ ] No default Bootstrap/Tailwind aesthetics without token customization
- [ ] No missing focus states on interactive elements
- [ ] No missing reduced-motion fallbacks
- [ ] No unearned complexity
- [ ] No inconsistent border radius (tokenize all radii)
- [ ] No missing empty/loading/error states
- [ ] No LTR-only layouts (RTL parity required)
- [ ] No culturally insensitive colors
- [ ] No missing ARIA labels
- [ ] No hardcoded hex values (all colors via tokens)
- [ ] No missing keyboard navigation (tab > arrow > escape)
- [ ] No JS-driven layout during animations
- [ ] No animation > 600ms
- [ ] No missing dark mode tokens
- [ ] No missing container queries
- [ ] No missing screen-reader tables for data viz
- [ ] No token drift (zero literal CSS values)
- [ ] No missing optical sizing on typography

## Cultural Context Rules
- [ ] If `PRD.md:target_market=MENA`, cultural validation required
- [ ] Dialect-specific typography enforced
- [ ] Calendar-aware components if date inputs present
- [ ] RTL layout tested with mirror snapshot (CI gate)

## Performance Rules
- [ ] Motion animations have GPU acceleration hints (will-change, transform)
- [ ] Token bundle size < 15KB gzipped
- [ ] No main-thread layout thrashing during chart updates

## Thresholds (checked by sdd-gate-validator)
- `min_anti_pattern_score`: 90
- `min_a11y_compliance`: 95
- `min_rtl_parity`: 100
- `max_token_drift`: 0
- `min_oklch_usage`: 80
- `min_tinted_neutrals`: 90

## Soft Gates (warn, do not block)
- [ ] Design debt score < 20/100
- [ ] Visual regression diff < 2px
- [ ] OKLCH usage >= 80% of palette
- [ ] Tinted neutrals for all backgrounds
```

**Step 2: Create `dashboard-design-gates.mdc`**

Create `.cursor/rules/dashboard-design-gates.mdc`:

```markdown
---
description: Dashboard design SDD hardlocks for chart/layout/motion quality before /DEVELOP.
alwaysApply: false
created: 2026-05-22
version: 1.0.0
owner: dashboard-orchestrator
---

# Dashboard Design Gates (SDD Hardlocks)

## Chart & Data Viz
- [ ] All charts use token references, zero literal colors/sizes
- [ ] WCAG AA contrast: >= 4.5:1 lines/bars, >= 3:1 text
- [ ] Screen-reader data table per chart
- [ ] Keyboard navigation: tab > arrow > escape
- [ ] RTL/LTR mirroring documented for axes, legends, tooltips
- [ ] Loading/empty/error states for all async chart components

## Layout & Density
- [ ] Max 7 primary metrics above fold (desktop)
- [ ] Grid: container queries or responsive breakpoints
- [ ] Filters: consistent alignment, RTL-safe positioning
- [ ] Progressive disclosure: value > detail > drilldown

## Motion & Performance
- [ ] All animations <= 600ms total
- [ ] GPU compositing hints applied (transform, will-change)
- [ ] prefers-reduced-motion fallback implemented
- [ ] No main-thread layout thrashing during chart updates

## CI & State Promotion
- [ ] `dashboard_health.yaml` updated with current metrics
- [ ] `/PLAN design dashboard audit --strict` passed with 0 P0/P1
- [ ] Visual regression baseline for LTR and RTL
- [ ] `HANDOFF_QUEUE.yaml` contains approved design entry
- [ ] `sdd-gate-validator` confirms phase_02_design: true before /DEVELOP

## Thresholds
- `min_chart_a11y_score`: 90
- `max_animation_duration_ms`: 600
- `min_rtl_parity`: 100
- `max_token_drift`: 0
```

**Step 3: Commit**

```bash
git add .cursor/rules/design-excellence-gates.mdc .cursor/rules/dashboard-design-gates.mdc
git commit -m "feat(rules): add design-excellence and dashboard design gate files"
```

---

## Task 7: Create State Files

**Files:**
- Create: `.cursor/state/design_health.yaml`
- Create: `.cursor/state/dashboard_health.yaml`
- Create: `.cursor/state/workspace.settings.yaml`
- Modify: `.cursor/state/plan_progress.yaml` (add scrumban_board + phase_02_design)

**Step 1: Create `design_health.yaml`**

```yaml
version: 1.0
last_updated: 2026-05-22
baseline_exists: false
metrics:
  anti_pattern_score: 0
  a11y_compliance: 0
  rtl_parity: 0
  cultural_alignment: 0
  token_drift: 0
  motion_perf_budget: fail
  design_debt_items: []
  oklch_usage: 0
  tinted_neutrals: 0
thresholds:
  min_anti_pattern_score: 90
  min_a11y_compliance: 95
  min_rtl_parity: 100
  max_token_drift: 0
  min_oklch_usage: 80
  min_tinted_neutrals: 90
```

**Step 2: Create `dashboard_health.yaml`**

```yaml
version: 1.0
last_updated: 2026-05-22
baseline_exists: false
metrics:
  chart_a11y_score: 0
  animation_perf_compliance: fail
  rtl_parity: 0
  data_density_compliance: false
  token_drift: 0
  reduced_motion_coverage: 0
  visual_regression_status: baseline-missing
thresholds:
  min_chart_a11y_score: 90
  max_animation_duration_ms: 600
  min_rtl_parity: 100
  max_token_drift: 0
```

**Step 3: Create `workspace.settings.yaml`**

```yaml
pm_methodology: scrumban
features:
  analytics_builder: true
  data_viz_accessible: true
  rtl_auto_mirror: true
  design_excellence: true
  cultural_validation: true
  impeccable_integration: true
```

**Step 4: Update `plan_progress.yaml`**

In `.cursor/state/plan_progress.yaml`, add if not already present:

```yaml
scrumban_board:
  backlog: []
  in_progress: []
  review: []
  done: []
  blocked: []
  wip_limit: 3
phase_02_design: false
```

**Step 5: Commit**

```bash
git add .cursor/state/design_health.yaml .cursor/state/dashboard_health.yaml \
  .cursor/state/workspace.settings.yaml .cursor/state/plan_progress.yaml
git commit -m "feat(state): add design_health, dashboard_health, workspace settings + scrumban board"
```

---

## Task 8: Create DESIGN_SYSTEM.md and Templates

**Files:**
- Create: `DESIGN_SYSTEM.md`
- Create: `.cursor/templates/ui-ux/design/DESIGN-v2.template.md`
- Create: `.cursor/templates/ui-ux/design/DASHBOARD_SPEC.template.md`

**Step 1: Create `DESIGN_SYSTEM.md`**

Create `DESIGN_SYSTEM.md` at the project root. Content:

- OKLCH chart categorical palette (cat-1 through cat-12, light + dark variants)
- OKLCH sequential palette (seq-1 through seq-9)
- OKLCH diverging palette (div-neg-3, div-neutral, div-pos-3)
- Semantic tokens (primary, success, warning, danger)
- Tinted neutrals (bg, surface, text, subtle)
- Arabic fonts by dialect (Tajawal/Khaleeji, Cairo/Masri, Noto Sans Arabic)
- Motion budget table (micro <= 300ms, macro <= 600ms, chart entrance 350ms)
- Usage rules: zero hardcoded hex, RTL axis flip, adjacent tokens >= 3:1 contrast

**Step 2: Create template directory**

```bash
mkdir -p .cursor/templates/ui-ux/design
```

**Step 3: Create `DESIGN-v2.template.md`**

Create `.cursor/templates/ui-ux/design/DESIGN-v2.template.md` with sections:
- Intent, Tokens (OKLCH + tinted neutrals), Components, Motion (with budget table), Accessibility, RTL Parity, Cultural Context, Anti-Pattern Checklist (9 items), Handoff Checklist (7 items including `sdd-gate-validator: PASS`)

**Step 4: Create `DASHBOARD_SPEC.template.md`**

Create `.cursor/templates/ui-ux/design/DASHBOARD_SPEC.template.md` with sections:
- Intent, Layout Architecture (grid + KPI pattern + filter strategy), Chart Specifications table, Motion Timeline table, State Matrix (loading/empty/error), Handoff Checklist

**Step 5: Commit**

```bash
git add DESIGN_SYSTEM.md .cursor/templates/
git commit -m "feat(design): add DESIGN_SYSTEM.md with OKLCH tokens + V2 design templates"
```

---

## Task 9: Create Visual Builder Docs and Design Server Files

**Files:**
- Create: `.nezam/design-server/docs/VISUAL_BUILDER_V2.md`
- Create: `.nezam/design-server/styles/global.template.css`

**Step 1: Create directories**

```bash
mkdir -p .nezam/design-server/docs .nezam/design-server/styles
```

**Step 2: Create `VISUAL_BUILDER_V2.md`**

Create `.nezam/design-server/docs/VISUAL_BUILDER_V2.md` containing:
- `ChartWidgetNode` Zod schema with fields: id, type, position, size, dataSourceId, chartType, encoding, tokenPalette, a11y (ariaLabel + dataTableHtml), rtlMirror (flipAxes, legendAnchor, tooltipAnchor), motionBudget (entranceMs max 600, updateMs max 200, fallback)
- Data Source Binding section
- Rendering section (React + CSS direction + axis flip)
- Token Consumption rules (zero hardcoded hex)

**Step 3: Create `global.template.css`**

Create `.nezam/design-server/styles/global.template.css` containing:
- `:root` block with all `--token-chart-*` and `--token-color-*` and `--token-neutral-*` as OKLCH values
- `@media (prefers-color-scheme: dark)` with dark variant overrides (lightness +15%)
- `@media (prefers-reduced-motion: reduce)` with `animation-duration: 50ms !important`

**Step 4: Commit**

```bash
git add .nezam/design-server/
git commit -m "feat(design-server): add Visual Builder V2 schema + OKLCH token CSS template"
```

---

## Task 10: Create Scaffold Script and CI Checks

**Files:**
- Create: `scripts/scaffold-nezam-v3.js`
- Create: `scripts/checks/check-design-excellence.sh`
- Create: `scripts/checks/check-dashboard-specs.sh`
- Modify: `package.json`

**Step 1: Create directories**

```bash
mkdir -p scripts/checks
```

**Step 2: Create `scripts/scaffold-nezam-v3.js`**

Create `scripts/scaffold-nezam-v3.js`:

```javascript
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { execFileSync } = require('child_process');

console.log('NEZAM V3 Design Excellence scaffold check...');

const required = [
  '.cursor/agents/design-excellence-lead.md',
  '.cursor/agents/cultural-design-validator.md',
  '.cursor/agents/token-architect-pro.md',
  '.cursor/agents/a11y-rtl-integration-engineer.md',
  '.cursor/agents/motion-performance-specialist.md',
  '.cursor/agents/design-debt-analyst.md',
  '.cursor/agents/visual-regression-automator.md',
  '.cursor/skills/pm/prioritize-rice/SKILL.md',
  '.cursor/skills/design/design-intent-inference/SKILL.md',
  '.cursor/skills/design/token-synthesis-pro/SKILL.md',
  '.cursor/skills/design/a11y-rtl-fusion/SKILL.md',
  '.cursor/skills/design/cultural-context-validator/SKILL.md',
  '.cursor/skills/design/motion-choreography-budgeted/SKILL.md',
  '.cursor/skills/design/dashboard-layout-pro/SKILL.md',
  '.cursor/skills/design/chart-spec-generator/SKILL.md',
  '.cursor/skills/design/data-viz-motion-budget/SKILL.md',
  '.cursor/skills/system/sdd-gate-validator/SKILL.md',
  '.cursor/commands/design.md',
  '.cursor/rules/design-excellence-gates.mdc',
  '.cursor/rules/dashboard-design-gates.mdc',
  '.cursor/state/design_health.yaml',
  '.cursor/state/dashboard_health.yaml',
  '.cursor/state/workspace.settings.yaml',
  'DESIGN_SYSTEM.md',
  '.cursor/templates/ui-ux/design/DESIGN-v2.template.md',
  '.cursor/templates/ui-ux/design/DASHBOARD_SPEC.template.md',
  '.nezam/design-server/docs/VISUAL_BUILDER_V2.md',
];

const missing = required.filter(f => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing V3 files:');
  missing.forEach(f => console.error('  -', f));
  process.exit(1);
}
console.log(`All ${required.length} required V3 files present.`);

const progress = fs.existsSync('.cursor/state/plan_progress.yaml')
  ? fs.readFileSync('.cursor/state/plan_progress.yaml', 'utf8') : '';
if (!progress.includes('scrumban_board')) {
  console.warn('WARNING: plan_progress.yaml missing scrumban_board block');
}

try {
  execFileSync('pnpm', ['ai:sync'], { stdio: 'inherit' });
  execFileSync('pnpm', ['ai:check'], { stdio: 'inherit' });
  console.log('NEZAM V3 Design Excellence upgrade verified.');
} catch {
  console.error('ai:sync or ai:check failed — fix frontmatter errors before proceeding');
  process.exit(1);
}
```

**Step 3: Create `scripts/checks/check-design-excellence.sh`**

```bash
#!/bin/bash
set -e
echo "Running Design Excellence checks..."

if [ ! -f ".cursor/state/design_health.yaml" ]; then
  echo "FAIL: design_health.yaml missing"
  exit 1
fi

if grep -r "#[0-9a-fA-F]\{6\}" docs/plans/05-design/ 2>/dev/null; then
  echo "FAIL: Hardcoded hex values found in design specs"
  exit 1
fi

pnpm ai:check

if [ -d "tests/visual/rtl" ]; then
  npx playwright test visual-rtl --reporter=list
fi

if grep -q "target_market.*MENA" docs/prd/PRD.md 2>/dev/null; then
  if [ -f "scripts/checks/validate-cultural-design.js" ]; then
    node scripts/checks/validate-cultural-design.js
  fi
fi

echo "Design Excellence checks passed"
```

**Step 4: Create `scripts/checks/check-dashboard-specs.sh`**

```bash
#!/bin/bash
set -e
echo "Validating dashboard specs & state gates..."

if [ ! -f ".cursor/state/dashboard_health.yaml" ]; then
  echo "FAIL: dashboard_health.yaml missing"
  exit 1
fi

if grep -r "#[0-9a-fA-F]\{6\}" docs/plans/05-design/DASHBOARD_* 2>/dev/null; then
  echo "FAIL: Hardcoded hex values in dashboard specs"
  exit 1
fi

if [ -f "scripts/checks/token-drift.js" ]; then
  node scripts/checks/token-drift.js --strict
fi

pnpm ai:check
echo "Dashboard spec validation passed"
```

**Step 5: Make scripts executable**

```bash
chmod +x scripts/checks/check-design-excellence.sh scripts/checks/check-dashboard-specs.sh
```

**Step 6: Add scripts to package.json**

In `package.json` `"scripts"` section, add:

```json
"check:design-excellence": "bash scripts/checks/check-design-excellence.sh",
"check:dashboard": "bash scripts/checks/check-dashboard-specs.sh",
"scaffold:v3": "node scripts/scaffold-nezam-v3.js"
```

**Step 7: Verify scaffold runs clean**

```bash
node scripts/scaffold-nezam-v3.js
```
Expected: 28/28 files present, `ai:sync` and `ai:check` pass, exit 0.

**Step 8: Commit**

```bash
git add scripts/scaffold-nezam-v3.js scripts/checks/ package.json
git commit -m "feat(scripts): add V3 scaffold validator + CI design excellence check scripts"
```

---

## Final Verification

Run the full test suite after all 10 tasks are complete:

```bash
# 1. Scaffold check — all 28 V3 files present
node scripts/scaffold-nezam-v3.js

# 2. Sync AI tool configs
pnpm ai:sync

# 3. Full check suite (frontmatter lint, SDD integrity, skill registry)
pnpm ai:check

# 4. Design excellence CI
bash scripts/checks/check-design-excellence.sh

# 5. Dashboard CI
bash scripts/checks/check-dashboard-specs.sh
```

Expected: all commands exit 0. CLAUDE.md synced command index now includes `design.md`.

---

## Summary

| Task | Deliverable | Files | Commit |
|---|---|---|---|
| 1 | 7 agent files | `.cursor/agents/design-excellence-lead.md` + 6 more | `feat(agents): add swarm-14` |
| 2 | Registry + lazy-load | `AGENT_REGISTRY.yaml`, `agent-lazy-load.mdc` | `feat(registry): register swarm-14` |
| 3 | 10 skill files | All `SKILL.md` files across pm/design/system | `feat(skills): add 10 V3 skills` |
| 4 | /DESIGN command | `.cursor/commands/design.md` | `feat(commands): add /DESIGN` |
| 5 | Enhanced plan/develop | `plan.md`, `develop.md` | `feat(commands): V3 RICE + Scrumban` |
| 6 | Gate rule files | `design-excellence-gates.mdc`, `dashboard-design-gates.mdc` | `feat(rules): gate files` |
| 7 | State files | 3 new YAML files + updated `plan_progress.yaml` | `feat(state): health + workspace` |
| 8 | DESIGN_SYSTEM + templates | `DESIGN_SYSTEM.md` + 2 template files | `feat(design): OKLCH tokens + templates` |
| 9 | Design server | `VISUAL_BUILDER_V2.md` + `global.template.css` | `feat(design-server): Visual Builder V2` |
| 10 | Scaffold + CI | `scaffold-nezam-v3.js` + 2 shell scripts + `package.json` | `feat(scripts): scaffold + CI` |

**Total: ~40 files across 10 commits.**
