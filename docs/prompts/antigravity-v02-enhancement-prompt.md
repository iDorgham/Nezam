# NEZAM v0.2 Enhancement Prompt — Antigravity
> Paste this entire document into Antigravity as your working brief.
> Execute each phase sequentially. Do not skip gates.

---

## Context & Mission

You are working inside the **NEZAM workspace** — an AI orchestration kit for specification-driven development.

NEZAM's core value proposition is a **hardlock pipeline**: no implementation without a locked spec, no spec without a locked design, no design without a locked PRD. This system is currently incomplete because the state files that enforce the pipeline never get written to during command execution. The result is that all hardlocks are theoretical — they check YAML that never updates.

Your mission is to fix the foundational infrastructure gaps that make NEZAM's governance system real, then add the three highest-impact features that differentiate NEZAM from every competitor in the 2026 market.

**Canonical source for all files:** `.cursor/` — never edit `.claude/`, `.antigravity/`, `.gemini/`, `.opencode/`, `.qwen/` directly. After all changes, run `pnpm ai:sync` then `pnpm ai:check`.

**State writer tool:** `node .nezam/scripts/state/write-state.js --file <path> --key <key> --value <value>`

---

## Phase 1 — State Auto-Capture (Fix the Hardlock System)

### Problem
`.cursor/state/onboarding.yaml` has all the right fields but every field defaults to `false` / `""` forever. Commands like `/start`, `/plan`, and `/develop` instruct the AI to update YAML manually — but this never reliably happens. The hardlock system reads state it can never trust.

### What to build

**1A. Wire `state:set` into every command hook**

Edit the following files in `.cursor/commands/`. At the end of each command's success path, add an explicit `state:set` instruction block:

`start.md` — after PRD creation is confirmed:
```
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key prd_locked --value true
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key prd_locked_at --value "[ISO timestamp]"
```

`start.md` — after user_mode is selected (S = solo, T = team):
```
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key user_mode --value "solo" (or "team")
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key tone --value "friendly" (or "structured")
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key user_mode_set_at --value "[ISO timestamp]"
```

`start.md` — after design profile is locked:
```
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key design_locked --value true
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key design_profile --value "[brand name]"
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key design_locked_at --value "[ISO timestamp]"
```

`start.md` — after target_market is confirmed:
```
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key target_market --value "mena" (or "global")
```
If target_market is `mena` or `ar`, also announce:
```
⚠️  MENA HARDLOCK ACTIVE — arabic-seo-aeo-specialist MUST complete docs/seo/arabic-seo-brief.md before RESEARCH phase can advance.
```

`plan.md` — after all 6 planning phases complete:
```
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key planning_complete --value true
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/onboarding.yaml --key planning_completed_at --value "[ISO timestamp]"
```

`develop.md` — after each phase N completes and testing passes:
```
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/develop_phases.yaml --key phase_[N].status --value "complete"
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/develop_phases.yaml --key phase_[N].testing_passed --value true
Run: node .nezam/scripts/state/write-state.js --file .cursor/state/develop_phases.yaml --key phase_[N+1].status --value "unlocked"
```

**1B. Add a `/check gates` auto-read step**

Edit `.cursor/commands/check.md`. At the top of every `/check` or `/check gates` invocation, add a pre-flight that reads and displays the current `onboarding.yaml` state before running any gate logic:

```
PRE-FLIGHT: Read .cursor/state/onboarding.yaml and show current values for:
  user_mode, target_market, prd_locked, design_locked, planning_complete, current_phase, build_mode
Then run gate checks against these actual values — never assume.
```

**1C. Create `.cursor/state/schemas/` with default templates**

Create the following files so the gate-orchestrator can restore corrupt state:

`.cursor/state/schemas/onboarding.schema.yaml` — copy the current blank `onboarding.yaml` structure as the restore default.

`.cursor/state/schemas/develop_phases.schema.yaml` — if `.cursor/state/develop_phases.yaml` does not already exist, create it with phases 0–5 each having `status: "locked"` and `testing_passed: false`. Phase 0 should default to `status: "unlocked"`.

After creating schemas, update `.cursor/skills/system/nezam-gate-orchestrator/SKILL.md` — in the `STATE_ERROR` recovery block, replace the placeholder path `[filename without .yaml].schema.yaml` with the actual path `.cursor/state/schemas/`.

---

## Phase 2 — Real HANDOFF_QUEUE (Persistent Swarm Checkpointing)

### Problem
`.nezam/memory/HANDOFF_QUEUE.yaml` exists but nothing writes to it mid-session. When a long-running swarm workflow hits a session reset, all agent progress is lost. The 2026 market has converged on persistent agent state as the critical infrastructure gap.

### What to build

**2A. Formalize the HANDOFF_QUEUE schema**

Edit `.nezam/memory/HANDOFF_QUEUE.yaml`. Replace any placeholder content with this enforced schema:

```yaml
# NEZAM Handoff Queue — persistent swarm checkpoint
# Written by: swarm-leader, deputy-swarm-leader, subagent-controller
# Read by: swarm-super-orchestrator on every session start

version: "2.0"

active_session:
  session_id: ""           # Set by /start on first command of session
  started_at: ""
  resumed_from: ""         # Previous session_id if resuming

queue: []
# Each entry follows this shape:
# - id: "task-slug-001"
#   status: "pending" | "in_progress" | "blocked" | "complete" | "deferred"
#   phase: 0
#   owner_agent: "agent-code-name"
#   objective: "one sentence"
#   last_checkpoint: ""     # ISO timestamp of last write
#   checkpoint_summary: ""  # What was completed before this write
#   blocking_reason: ""     # Only if status = blocked
#   next_action: ""         # What the next agent should do to resume
#   artifacts_produced:
#     - ""
#   artifacts_required:
#     - ""
#   handoff_packet_path: "" # Path to full handoff-packet-v2.yaml if exists

completed: []
# Entries move here when status = complete, so queue stays lean
```

**2B. Wire queue writes into swarm-leader and subagent-controller**

Edit `.cursor/agents/swarm-leader.md`. In the **Session Start Protocol** section, add:

```
0. Read .nezam/memory/HANDOFF_QUEUE.yaml.
   - If active_session.session_id is empty → write a new session_id (format: session-YYYYMMDD-HHMMSS) and started_at timestamp.
   - If active_session.session_id is populated AND any queue entry has status "pending" or "in_progress" → announce resumption:
     "⚡ Resuming session [session_id]. [N] tasks in queue. Showing next action for in_progress items first."
     Then display each in_progress item's next_action before accepting new commands.
   - If all queue entries are "complete" → proceed normally.
```

Edit `.cursor/agents/subagent-controller.md`. After every task delegation, add a checkpoint write instruction:

```
After delegating each task: write a queue entry to .nezam/memory/HANDOFF_QUEUE.yaml with:
  - id: the task_id from the handoff packet
  - status: "in_progress"
  - owner_agent: the assigned specialist
  - objective: from the handoff packet
  - last_checkpoint: current timestamp
  - next_action: the first instruction the agent must execute

After each task completes: update its entry:
  - status: "complete"
  - checkpoint_summary: one sentence of what was delivered
  - artifacts_produced: list of file paths changed
  Then move the entry from queue[] to completed[].
```

**2C. Update gate-orchestrator to validate queue health**

Edit `.cursor/skills/system/nezam-gate-orchestrator/SKILL.md`. In the `Required state files` section, confirm `.nezam/memory/HANDOFF_QUEUE.yaml` is listed. Add this check to the pre-gate validation:

```
HANDOFF_QUEUE check:
  - If any entry has status "in_progress" AND last_checkpoint is older than 4 hours → flag as STALE
  - Stale in_progress entries must be resolved (resumed or explicitly deferred) before new phase gates open
  - If queue is unreachable or corrupt → STATE_ERROR, restore from .cursor/state/schemas/
```

---

## Phase 3 — Living Spec Engine (Spec Drift Detection + Auto-Patch)

### Problem
When an agent modifies implementation mid-task, `SPEC.md` stays frozen at the original intent. Every SDD tool in the market (BMAD, GitHub Spec-Kit, Kiro) has this same gap. A delta-diff layer between spec and code — surfaced as a structured patch proposal — is the feature that makes NEZAM categorically different.

### What to build

**3A. Create the Living Spec skill**

Create `.cursor/skills/system/nezam-living-spec/SKILL.md` with the following content:

```markdown
---
name: "nezam-living-spec"
description: Detects drift between SPEC.md acceptance criteria and committed implementation. Surfaces structured patch proposals — never silently overwrites specs.
version: 1.0.0
updated: [today's date]
changelog: []
---
# Living Spec Engine

## Purpose
Keep SPEC.md truthful by detecting when implementation diverges from the original acceptance criteria,
and surfacing a structured patch proposal for human review before any spec update is committed.

## Drift Detection Trigger
Run this skill automatically when:
- A /develop phase completes
- An agent modifies files listed in SPEC.md's `write_scope`
- /scan is called with `--spec` flag
- A PR is opened touching files in `docs/specs/`

## Step-by-Step Workflow

### 1. Load the active spec
Read the SPEC.md for the current phase from `docs/specs/` (path from develop_phases.yaml).
Parse these fields: objective, acceptance_criteria, write_scope, api_contract, data_model_changes.

### 2. Diff against implementation
For each file in write_scope:
  - If file exists: read its current state and compare against the spec's expected API contract and acceptance criteria
  - If file was renamed or moved: flag as SCOPE_DRIFT
  - If a new file was created outside write_scope: flag as SCOPE_EXPANSION
  - If an acceptance criterion has no corresponding implementation evidence: flag as AC_GAP

### 3. Classify each deviation
| Type | Label | Severity |
|------|-------|----------|
| Implementation matches spec exactly | ALIGNED | — |
| Implementation exceeds spec scope | SCOPE_EXPANSION | warn |
| Implementation modified outside write_scope | SCOPE_DRIFT | block |
| Acceptance criterion has no implementation evidence | AC_GAP | block |
| API contract changed from spec | API_DRIFT | block |
| Data model changed from spec | MODEL_DRIFT | block |

### 4. Generate patch proposal
If any deviation is found, write to `docs/specs/patches/SPEC_PATCH_[slug]-[timestamp].md`:

```markdown
# Spec Patch Proposal — [feature-slug]
Generated: [ISO timestamp]
Triggered by: [agent name] after [task description]

## Deviations Found

| Field | Original Spec | Actual Implementation | Type |
|-------|--------------|-----------------------|------|
| [field] | [spec value] | [impl value] | [label] |

## Proposed Spec Updates
[For each deviation, show the exact diff — old value → new value]

## Human Decision Required
[ ] Accept patch → Run: /spec accept [slug]
[ ] Reject patch → Implementation must be rolled back to match spec
[ ] Escalate → Route to lead-solution-architect for ADR

## Auto-accept conditions (only if ALL true)
- Deviation type is SCOPE_EXPANSION only (no blocks)
- Expansion is additive (no existing AC removed)
- PM-01 confidence score ≥ 0.90
```

### 5. Block gate if patch is unresolved
If any `block`-severity deviation exists AND no patch decision has been recorded:
  → SPEC_DRIFT_BLOCK: Phase gate cannot close.
  → Tell user: "Spec drift detected. Review docs/specs/patches/ and run /spec accept or /spec reject [slug]."

## Slash Command Integration
Add to /scan: running `/scan --spec` triggers this skill for all active phase specs.
Add to /develop: after each phase completion, this skill runs automatically before gate closes.

## Patch Decision Commands
Add these to .cursor/commands/develop.md:
  /spec accept [slug]  → copies approved patch into the SPEC.md, commits as docs: update spec [slug]
  /spec reject [slug]  → marks patch as rejected, logs to docs/specs/patches/REJECTED/
  /spec diff [slug]    → shows current drift without triggering gate block
```

**3B. Register the skill**

Edit `.cursor/skills/README.md` (or the skills index). Add `nezam-living-spec` under the `system` category with description: "Spec drift detection and structured patch proposals."

**3C. Wire into develop.md and scan.md**

Edit `.cursor/commands/develop.md`. After the phase completion block, add:
```
After phase N completes:
  1. Run nezam-living-spec skill against the phase's SPEC.md
  2. If SPEC_DRIFT_BLOCK → halt gate. Show patch proposals from docs/specs/patches/
  3. If all ALIGNED or SCOPE_EXPANSION only and auto-accept conditions met → gate proceeds
```

Edit `.cursor/commands/scan.md`. Add `--spec` flag documentation:
```
/scan --spec   → Run nezam-living-spec on all active phase specs. Report alignment status per spec.
```

---

## Phase 4 — Real Swarm Cost Report

### Problem
`swarm-cost-report.js` reads from `agent-bus.yaml` and `AGENT_REGISTRY.yaml` but produces no actionable output. There is no per-session, per-phase, or per-task token/cost visibility. Solo founders burn through API budget blindly.

### What to build

**4A. Complete `swarm-cost-report.js`**

Edit `.nezam/scripts/reports/swarm-cost-report.js`. The file already reads the agent bus and registry. Complete the report generation by adding:

After the swarm aggregation loop, write a markdown report to `docs/reports/ai/SWARM_COST_REPORT.md`:

```javascript
// After swarm aggregation loop, add:

const reportLines = [
  `# Swarm Cost Report`,
  `Generated: ${new Date().toISOString()}`,
  ``,
  `## Summary`,
  `| Metric | Value |`,
  `|--------|-------|`,
  `| Total tasks tracked | ${totalTasks} |`,
  `| Active swarms | ${Object.keys(swarms).length} |`,
  `| Mode A tasks (autonomous) | ${Object.values(swarms).reduce((s, sw) => s + sw.A, 0)} |`,
  `| Mode B tasks (supervised) | ${Object.values(swarms).reduce((s, sw) => s + sw.B, 0)} |`,
  `| Mode C tasks (manual) | ${Object.values(swarms).reduce((s, sw) => s + sw.C, 0)} |`,
  ``,
  `## Per-Swarm Breakdown`,
  `| Swarm | Tasks | Mode A | Mode B | Mode C | Load % |`,
  `|-------|-------|--------|--------|--------|--------|`,
];

for (const [swarm, data] of Object.entries(swarms).sort((a, b) => b[1].tasks - a[1].tasks)) {
  const loadPct = totalTasks > 0 ? ((data.tasks / totalTasks) * 100).toFixed(1) : '0.0';
  reportLines.push(`| ${swarm} | ${data.tasks} | ${data.A} | ${data.B} | ${data.C} | ${loadPct}% |`);
}

// Heavy swarm warnings
const heavySwarms = Object.entries(swarms)
  .filter(([_, d]) => totalTasks > 0 && (d.tasks / totalTasks) > 0.3)
  .map(([name]) => name);

if (heavySwarms.length > 0) {
  reportLines.push(``, `## ⚠️ Overloaded Swarms (>30% of total load)`);
  heavySwarms.forEach(s => reportLines.push(`- ${s}: consider splitting tasks across sub-specialties`));
}

reportLines.push(``, `## Budget Guidance`);
reportLines.push(`- Mode A (autonomous) tasks carry the highest token cost.`);
reportLines.push(`- If Mode A > 60% of total, review agent assignments for over-delegation.`);
reportLines.push(`- Check docs/specs/ai/AI_CONFIG.yaml to set daily/monthly budget alerts.`);

const reportPath = path.join(reportDir, 'ai', 'SWARM_COST_REPORT.md');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf8');
console.log(`Report written to: ${reportPath}`);
```

**4B. Add cost report to `/scan`**

Edit `.cursor/commands/scan.md`. Add to the scan output section:
```
/scan all → also runs: node .nezam/scripts/reports/swarm-cost-report.js
            and links to: docs/reports/ai/SWARM_COST_REPORT.md
/scan cost → runs swarm cost report only, opens result
```

**4C. Add `report:cost` script to package.json**

Edit `package.json`. In the `scripts` block, add:
```json
"report:cost": "node .nezam/scripts/reports/swarm-cost-report.js"
```

---

## Phase 5 — Living Spec Engine (Dashboard + Design Pipeline)

### 5A — Visual Workspace Dashboard

Create `.nezam/workspace/dashboard/NEZAM_DASHBOARD.html`.

This is a single self-contained HTML file that reads no external data — it renders the workspace state from static snapshots that agents update. It must work by opening the file directly in a browser (no server required).

Structure:

```html
<!DOCTYPE html>
<!-- NEZAM Workspace Dashboard -->
<!-- Agents update the STATE_SNAPSHOT object below after each gate event -->
<html>
<head>
  <title>NEZAM — Workspace Status</title>
  <!-- All CSS inline. Dark theme. Font: system-ui. -->
</head>
<body>
<script>
// ── AGENT-MANAGED SNAPSHOT ─────────────────────────────────────
// Update this object via: /scan --dashboard
// Do not edit manually.
const STATE_SNAPSHOT = {
  updated_at: "",
  version: "0.1.0",
  phase: {
    current: 0,
    name: "Not started",
    prd_locked: false,
    design_locked: false,
    planning_complete: false,
    build_mode: ""
  },
  gates: [
    // { name: "PRD locked", status: "pass|fail|pending", detail: "" },
  ],
  swarms: [
    // { name: "swarm-name", tasks_total: 0, tasks_complete: 0, status: "idle|active|blocked" },
  ],
  spec_health: [
    // { slug: "feature-slug", aligned: true, open_patches: 0 },
  ],
  handoff_queue: {
    active_tasks: 0,
    stale_tasks: 0,
    completed_tasks: 0
  },
  last_agent_action: ""
};
// ── END SNAPSHOT ────────────────────────────────────────────────
</script>
<!-- Render STATE_SNAPSHOT as visual cards:
  Row 1: Phase indicator (progress bar across 7 SDD phases)
  Row 2: Gate matrix (pass/fail/pending chips for each gate)
  Row 3: Swarm health (mini cards per swarm with task count + status dot)
  Row 4: Spec health (per-spec alignment status, open patch count)
  Row 5: Handoff queue summary (active / stale / completed counts)
  Footer: last updated timestamp + last agent action
-->
</body>
</html>
```

After creating the file, add a `/scan --dashboard` path to `.cursor/commands/scan.md` that:
1. Reads all state files (`onboarding.yaml`, `develop_phases.yaml`, `HANDOFF_QUEUE.yaml`, `docs/specs/patches/`)
2. Updates `STATE_SNAPSHOT` in `NEZAM_DASHBOARD.html` with current values
3. Reports: "Dashboard updated → open `.nezam/workspace/dashboard/NEZAM_DASHBOARD.html`"

### 5B — Design Profile → Code Pipeline

Create `.nezam/scripts/design/generate-tokens.sh`.

This script runs after `design:apply` and converts the active `DESIGN.md` into implementation-ready files.

```bash
#!/usr/bin/env bash
# Generate implementation tokens from DESIGN.md
# Usage: bash .nezam/scripts/design/generate-tokens.sh
# Runs automatically after: pnpm run design:apply -- <brand>
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DESIGN="$ROOT/DESIGN.md"

if [[ ! -f "$DESIGN" ]]; then
  echo "Error: DESIGN.md not found at repo root. Run: pnpm run design:apply -- <brand>" >&2
  exit 1
fi

echo "Generating implementation tokens from DESIGN.md..."

# Parse color tokens from DESIGN.md
# Expects: - **Primary:** `#XXXXXX` format (from design profile structure)
PRIMARY=$(grep -oP '(?<=\*\*Primary:\*\* `)[^`]+' "$DESIGN" | head -1 || echo "#000000")
SECONDARY=$(grep -oP '(?<=\*\*Secondary:\*\* `)[^`]+' "$DESIGN" | head -1 || echo "#555555")
SUCCESS=$(grep -oP '(?<=\*\*Success:\*\* `)[^`]+' "$DESIGN" | head -1 || echo "#16A34A")
WARNING=$(grep -oP '(?<=\*\*Warning:\*\* `)[^`]+' "$DESIGN" | head -1 || echo "#D97706")
DANGER=$(grep -oP '(?<=\*\*Danger:\*\* `)[^`]+' "$DESIGN" | head -1 || echo "#DC2626")
SURFACE=$(grep -oP '(?<=\*\*Surface:\*\* `)[^`]+' "$DESIGN" | head -1 || echo "#F9FAFB")
TEXT=$(grep -oP '(?<=\*\*Text:\*\* `)[^`]+' "$DESIGN" | head -1 || echo "#111827")

# Parse typography tokens
FONT_PRIMARY=$(grep -oP '(?<=primary=)[^,\n]+' "$DESIGN" | head -1 || echo "Inter")
FONT_DISPLAY=$(grep -oP '(?<=display=)[^,\n]+' "$DESIGN" | head -1 || echo "Inter")
FONT_MONO=$(grep -oP '(?<=mono=)[^,\n]+' "$DESIGN" | head -1 || echo "monospace")

# Parse spacing scale
SPACING=$(grep -oP '(?<=\*\*Spacing scale:\*\* )[^\n]+' "$DESIGN" | head -1 || echo "4/8/12/16/24/32")

echo "Parsed: Primary=$PRIMARY Secondary=$SECONDARY Surface=$SURFACE Text=$TEXT"
echo "Parsed: Fonts: $FONT_PRIMARY / $FONT_DISPLAY / $FONT_MONO"
echo "Parsed: Spacing: $SPACING"

# ── Output 1: CSS Variables ──────────────────────────────────────
CSS_OUT="$ROOT/src/styles/design-tokens.css"
mkdir -p "$(dirname "$CSS_OUT")"
cat > "$CSS_OUT" << EOF
/* Auto-generated by NEZAM design pipeline — do not edit */
/* Source: DESIGN.md | Regenerate: pnpm run design:tokens */
:root {
  --color-primary: ${PRIMARY};
  --color-secondary: ${SECONDARY};
  --color-success: ${SUCCESS};
  --color-warning: ${WARNING};
  --color-danger: ${DANGER};
  --color-surface: ${SURFACE};
  --color-text: ${TEXT};

  --font-primary: '${FONT_PRIMARY}', system-ui, sans-serif;
  --font-display: '${FONT_DISPLAY}', system-ui, sans-serif;
  --font-mono: '${FONT_MONO}', monospace;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
}
[data-theme="dark"] {
  --color-surface: color-mix(in srgb, ${PRIMARY} 95%, white);
  --color-text: color-mix(in srgb, ${SURFACE} 90%, white);
  --color-primary: color-mix(in srgb, ${PRIMARY} 80%, white);
}
EOF
echo "✓ CSS variables → $CSS_OUT"

# ── Output 2: Tailwind Config Extension ─────────────────────────
TW_OUT="$ROOT/design-tokens.tailwind.js"
cat > "$TW_OUT" << EOF
// Auto-generated by NEZAM design pipeline — do not edit
// Merge into tailwind.config.js: spread require('./design-tokens.tailwind')
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${PRIMARY}',
        secondary: '${SECONDARY}',
        success: '${SUCCESS}',
        warning: '${WARNING}',
        danger: '${DANGER}',
        surface: '${SURFACE}',
      },
      fontFamily: {
        sans: ['${FONT_PRIMARY}', 'system-ui', 'sans-serif'],
        display: ['${FONT_DISPLAY}', 'system-ui', 'sans-serif'],
        mono: ['${FONT_MONO}', 'monospace'],
      },
      spacing: {
        '1': '4px', '2': '8px', '3': '12px',
        '4': '16px', '6': '24px', '8': '32px',
      },
    },
  },
};
EOF
echo "✓ Tailwind extension → $TW_OUT"

# ── RTL scaffold if target_market is mena ───────────────────────
ONBOARDING="$ROOT/.cursor/state/onboarding.yaml"
TARGET_MARKET=""
if [[ -f "$ONBOARDING" ]]; then
  TARGET_MARKET=$(grep 'target_market:' "$ONBOARDING" | awk '{print $2}' | tr -d '"')
fi

if [[ "$TARGET_MARKET" == "mena" || "$TARGET_MARKET" == "ar" ]]; then
  RTL_OUT="$ROOT/src/styles/rtl-tokens.css"
  cat > "$RTL_OUT" << EOF
/* Auto-generated RTL overrides — MENA market active */
/* Source: NEZAM design pipeline | target_market: ${TARGET_MARKET} */
[dir="rtl"] {
  --font-primary: 'Cairo', 'Tajawal', '${FONT_PRIMARY}', system-ui, sans-serif;
  --font-display: 'Tajawal', 'Cairo', system-ui, sans-serif;
  direction: rtl;
  text-align: right;
}
[dir="rtl"] .ltr-only { display: none; }
[dir="ltr"] .rtl-only { display: none; }
EOF
  echo "✓ RTL tokens → $RTL_OUT (MENA market active)"
fi

echo ""
echo "Design token pipeline complete."
echo "Next steps:"
echo "  1. Merge design-tokens.tailwind.js into your tailwind.config.js"
echo "  2. Import src/styles/design-tokens.css in your app entry point"
if [[ "$TARGET_MARKET" == "mena" || "$TARGET_MARKET" == "ar" ]]; then
  echo "  3. Import src/styles/rtl-tokens.css and add dir=\"rtl\" to <html> for MENA"
fi
```

**Add `design:tokens` script to package.json:**
```json
"design:tokens": "bash .nezam/scripts/design/generate-tokens.sh",
"design:apply:full": "bash .nezam/scripts/design/copy-profile-to-design-md.sh $npm_config_brand && pnpm run design:tokens"
```

**Update `copy-profile-to-design-md.sh`** — at the end of the file, after the `echo "Next:"` block, add:
```bash
echo "  → Run: pnpm run design:tokens (auto-generates CSS vars + Tailwind extension)"
echo "  → Or:  pnpm run design:apply:full -- <brand>  (copies + generates in one step)"
```

---

## Phase 6 — After All Changes

### Sync and validate

Run these commands in order:

```bash
pnpm ai:sync
pnpm ai:check
pnpm run check:all
```

Fix any drift errors before committing.

### Commit message

```
feat(workspace): v0.2 infrastructure — state persistence, living spec, cost report, design pipeline

- Phase 1: state auto-capture wired into start/plan/develop commands
- Phase 2: HANDOFF_QUEUE formalized with checkpoint schema + swarm-leader integration
- Phase 3: nezam-living-spec skill — spec drift detection + structured patch proposals
- Phase 4: swarm-cost-report.js completed — per-swarm breakdown + budget guidance
- Phase 5a: NEZAM_DASHBOARD.html — visual workspace state artifact
- Phase 5b: design:tokens pipeline — DESIGN.md → CSS vars + Tailwind extension + RTL scaffold

Closes: P0 state persistence gap, P0 handoff queue gap, P0 spec drift gap
Adds: Living Spec Engine, Visual Dashboard, Design→Code pipeline
```

### Update `release-roadmap.json`

Mark `v0.2.0` milestone scope as:
```json
"scope": "State auto-capture, HANDOFF_QUEUE persistence, Living Spec Engine, design:tokens pipeline, Visual Dashboard, real swarm cost report"
```

Run `pnpm prd:roadmap` to regenerate the roadmap table in PRD.md.

---

## Verification Checklist

Before declaring this work complete, confirm every item:

- [ ] `onboarding.yaml` gets written after `/start all` completes — fields are no longer all blank
- [ ] `HANDOFF_QUEUE.yaml` has proper schema with `active_session` + `queue[]` + `completed[]`
- [ ] swarm-leader.md reads HANDOFF_QUEUE on session start and surfaces in_progress tasks
- [ ] `nezam-living-spec/SKILL.md` exists and `/scan --spec` is documented in scan.md
- [ ] `docs/specs/patches/` directory scaffolded (add `.gitkeep`)
- [ ] `swarm-cost-report.js` produces a real markdown report in `docs/reports/ai/`
- [ ] `pnpm run report:cost` runs without error
- [ ] `NEZAM_DASHBOARD.html` renders in browser with all STATE_SNAPSHOT sections visible
- [ ] `pnpm run design:tokens` generates `design-tokens.tailwind.js` and `src/styles/design-tokens.css`
- [ ] RTL tokens file generates when `target_market: mena` is set in `onboarding.yaml`
- [ ] `pnpm ai:sync && pnpm ai:check` passes with zero drift
- [ ] `pnpm run check:all` passes

---

*NEZAM v0.2 — governance that actually runs.*
