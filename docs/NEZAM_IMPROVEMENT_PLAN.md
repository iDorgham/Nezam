# NEZAM & Design Hub — Comprehensive Improvement Plan

> **Document Status:** Draft v1.0  
> **Prepared:** 2026-06-01  
> **Owner:** Dorgham  
> **Scope:** Full workspace audit → prioritized improvement roadmap  
> **Pipeline position:** Pre-Phase 2 (run before Core Features build begins)

---

## Executive Summary

NEZAM is a governance-first AI workspace orchestration system. Its architecture is
fundamentally sound — SDD pipeline, hardlock gates, multi-tool sync, swarm
coordination — but has accumulated structural debt that creates silent failure modes
as the system scales. The Design Hub (`.nezam/design-hub/`) is the primary
user-facing deliverable and has its own set of critical path issues.

This plan organizes all findings into **4 tracks**, executed across **3 phases**:

- **Track A** — Critical Infrastructure Fixes (blockers, broken paths, state integrity)
- **Track B** — Design Hub Completion (the product)
- **Track C** — Workspace Debt Reduction (agent bloat, rule conflicts, metadata)
- **Track D** — Governance Hardening (enforcement, CI, certification)

**Total effort estimate:** ~3–4 focused work sessions.

---

## Current State Snapshot

| Area | Status | Risk |
|---|---|---|
| SDD Pipeline (rules) | ✅ Solid | Low |
| Multi-tool sync infrastructure | ✅ Solid (pre-commit hook exists) | Low |
| CI workflow coverage | ✅ Good (11 workflows) | Low |
| `onboarding.yaml` state | ✅ All gates locked | Low |
| `develop_phases.yaml` Phase 1 | 🟡 `testing` / `testing_passed: false` | Medium |
| Design Hub `design/` directory | 🔴 Missing — path in `workspace.paths.yaml` broken | Critical |
| `wireframes_locked.json` blocks | 🔴 `blocks: []` — no actual wireframe data | Critical |
| Agent count (169) | 🟡 Undiscoverable at scale | Medium |
| Skill duplicates (323 entries, ~160 are `nezam-` mirrors) | 🟡 Context pollution | Medium |
| Design gate rule duplication | 🟡 Two files, overlapping Gate 1 | Medium |
| `CLAUDE_POLISH_PROMPT.md` in Design Hub root | 🟠 Misplaced artifact | Low |
| Agent certification coverage (7/169 certified) | 🟠 Misleading metadata | Low |

---

## Phase 0 — Diagnostics (Do First, ~30 min)

Run these before touching anything. Establish the true baseline.

```bash
# 1. Sync status across all tool mirrors
pnpm ai:status

# 2. Full check suite
pnpm check:all

# 3. Token integrity
pnpm run check:tokens

# 4. SDD swarm integrity
pnpm ai:check:sdd

# 5. Agent bus health
pnpm run check:agent-bus

# 6. Skill frontmatter
pnpm ai:check

# 7. Wireframe lock integrity
node .nezam/core/scripts/checks/check-wireframes-lock.js

# 8. SDD gate state
bash .nezam/core/scripts/checks/sdd-gate-validator.sh
```

Save the output to `.nezam/core/reports/2026-06-01-baseline-audit.md` before making changes.

---

## Track A — Critical Infrastructure Fixes

> **Why first:** These are broken paths and state inconsistencies that silently corrupt
> downstream work. Nothing in Track B or D is reliable until these are resolved.

---

### A-1 — Fix broken `design/tokens.json` path

**Problem:** `workspace.paths.yaml` declares `design_tokens_file: ".nezam/design-hub/design/tokens.json"` but `.nezam/design-hub/design/` does not exist. Any agent or script resolving this path fails silently.

**Fix:**

```bash
# Create the directory and seed from DESIGN.md
mkdir -p .nezam/design-hub/design
```

Then create `.nezam/design-hub/design/tokens.json` as the canonical token export — either:
- Run `pnpm run design:tokens:emit` once it exists (Task T-F-002 deliverable), OR
- Seed it manually from the color/typography/spacing values in root `DESIGN.md`

Seed structure:
```json
{
  "version": "1.0.0",
  "source": "DESIGN.md",
  "generated_at": "2026-06-01",
  "color": {
    "primary":   { "value": "#0F172A", "role": "structural" },
    "secondary": { "value": "#4F46E5", "role": "navigation" },
    "accent":    { "value": "#F43F5E", "role": "interactive" },
    "neutral":   { "value": "#FAF9F6", "role": "surface" },
    "success":   { "value": "#10B981" },
    "warning":   { "value": "#F59E0B" },
    "danger":    { "value": "#EF4444" },
    "text":      { "value": "#0F172A" }
  },
  "typography": {
    "family_primary":  "Open Sans",
    "family_display":  "Inter",
    "family_mono":     "Inconsolata",
    "scale":           "desktop-first expressive"
  },
  "spacing": {
    "scale": [4, 8, 12, 16, 24, 32]
  },
  "profile": "nezam-v3"
}
```

**Also:** Split `workspace.paths.yaml` path entry into two distinct keys:

```yaml
# Current (ambiguous):
design_hub_folder: ".nezam/design-hub"

# Replace with:
design_hub_app_folder: ".nezam/design-hub"          # The Next.js app
design_hub_artifacts_folder: ".nezam/design-hub/design"  # Tokens, locked contracts
```

After editing `workspace.paths.yaml`, run `pnpm ai:sync` to propagate.

**Acceptance:** `node -e "require('./.nezam/design-hub/design/tokens.json')"` exits 0.

---

### A-2 — Fix `wireframes_locked.json` — empty blocks array

**Problem:** `wireframes_locked.json` has `"blocks": []` — the sitemap exists (6 pages defined) but no actual block contracts were ever generated. Every downstream check that reads blocks will silently pass on an empty array, giving false confidence.

**Fix:**

Option A (preferred): Re-run the Design Hub wireframe session properly:
```bash
pnpm wireframe:server
# Open localhost:4000, go through each page, assign blocks, export
```

Option B (expedient for Phase 1 unblock): Populate minimum viable blocks for each page in `wireframes_locked.json` based on the block catalog in `.nezam/core/plans/design/ART_BLOCK_CATALOG.md`. The 6 v3 blocks from T-F-003 (`Nav_TopBar`, `Hero_Centered`, `Content_Logos`, `Content_Features`, `Content_CTA`, `Nav_Footer`) should map to `PAGE-001` (Home) at minimum.

**Acceptance:**
```bash
node .nezam/core/scripts/checks/check-wireframes-lock.js
# Must report > 0 blocks
```

---

### A-3 — Resolve `plan_progress.yaml` parse error

**Problem:** `plan_progress.yaml` line 4 contains `ooroo seo_completed_at:` — a corruption artifact that will cause any YAML parser to fail on that file.

**Fix:**
```bash
# Open .cursor/state/plan_progress.yaml
# Remove "ooroo " prefix from line 4
# Line should read: seo_completed_at: "2026-05-29T12:30:00Z"
```

**Acceptance:** `node -e "const y=require('js-yaml'); y.load(require('fs').readFileSync('.cursor/state/plan_progress.yaml','utf8'))"` exits 0.

---

### A-4 — Verify pre-commit hook is installed

**Problem:** The hook script exists at `.nezam/core/scripts/hooks/pre-commit` and the `multi-tool-sync.mdc` rule documents it — but there is no evidence it is installed in `.git/hooks/pre-commit` in this workspace.

**Fix:**
```bash
bash .nezam/core/scripts/hooks/setup-hooks.sh
# Then verify:
cat .git/hooks/pre-commit
```

If `setup-hooks.sh` doesn't install to `.git/hooks/`, inspect the script and fix the destination path. The hook must call `pnpm ai:sync` when `.cursor/` files are staged.

**Acceptance:** Stage a `.cursor/` file and confirm `pnpm ai:sync` runs automatically on commit.

---

### A-5 — Unify `workspace.paths.yaml` path reference in rules

**Problem:** `workspace-orchestration.mdc` references the paths file as both `.nezam/core/gates/workspace.paths.yaml` and `.nezam/workspace.paths.yaml`. The canonical location is the root `.nezam/workspace.paths.yaml`.

**Fix:** Search and replace all references:
```bash
grep -r "core/gates/workspace.paths.yaml" .cursor/rules/ .cursor/agents/ .cursor/commands/
# Replace all found instances with: .nezam/workspace.paths.yaml
# Then: pnpm ai:sync
```

**Acceptance:** `grep -r "core/gates/workspace.paths" .cursor/` returns 0 results.

---

### A-6 — Fix Phase 1 testing gate

**Problem:** `develop_phases.yaml` shows Phase 1 status `testing` with `testing_passed: false`. This blocks Phase 2 per the hardlock rules but Phase 2 is marked `unlocked` — a contradiction.

**Action:** Do not manually patch the YAML. Instead:
1. Run the Phase 1 acceptance test suite (T-Q tasks from MASTER_TASKS.md)
2. When tests pass, set via the state command: `pnpm run state:set -- phase_1.testing_passed true phase_1.status complete`
3. If tests are genuinely blocked, create explicit blocker tasks for each failing test

This is a build task, not a workspace fix — but it needs to be acknowledged as unresolved before Phase 2 begins.

---

## Track B — Design Hub Completion

> **Context:** The Design Hub is NEZAM's primary product — a Next.js 14 app at
> `.nezam/design-hub/` that enables visual wireframing, token configuration,
> and design contract locking. Phase 1 tasks (T-F-001 through T-F-007) are its
> foundation. These items are improvements and completions beyond the base scaffold.

---

### B-1 — Implement `design:tokens:emit` script (T-F-002 dependency)

**Problem:** MASTER_TASKS T-F-002 AC-1 requires `pnpm run design:tokens:emit` to parse `DESIGN.md` and emit `src/tokens.css`. This script is referenced but does not exist yet.

**Implementation:**

Create `.nezam/design-hub/scripts/emit-tokens.js`:
```js
// Reads DESIGN.md → parses §2 Color, §3 Typography, §4 Spacing
// Emits src/tokens.css with :root { --ds-* } variables
// Also writes .nezam/design-hub/design/tokens.json
```

Add to `.nezam/design-hub/package.json`:
```json
"scripts": {
  "design:tokens:emit": "node scripts/emit-tokens.js"
}
```

Token naming convention (enforce via script):
- Colors: `--ds-color-primary`, `--ds-color-accent`, etc.
- Typography: `--ds-font-primary`, `--ds-font-display`, `--ds-font-mono`
- Spacing: `--ds-space-1` (4px) through `--ds-space-6` (32px)
- Dark mode: `[data-theme="dark"] { --ds-color-neutral: #0F172A; ... }`

**Acceptance:** `pnpm run design:tokens:emit && pnpm run check:tokens` both pass.

---

### B-2 — Populate wireframe block contracts for all 6 pages

After fixing A-2, ensure all pages in `wireframes_locked.json` have explicit block assignments, not just PAGE-001. Required pages from the sitemap:

| Page ID | Route | Minimum blocks |
|---|---|---|
| PAGE-001 | / (Home) | Nav_TopBar, Hero_Centered, Content_Logos, Content_Features, Content_CTA, Nav_Footer |
| PAGE-002 | /dashboard | Nav_TopBar, [Dashboard shell blocks], Nav_Footer |
| PAGE-003 | /wireframe | Nav_TopBar, [Wireframe editor blocks] |
| PAGE-004 | /design | Nav_TopBar, [Token configurator blocks] |
| PAGE-005 | /export | Nav_TopBar, [Export/lock blocks] |
| PAGE-006 | /sign-in | [Auth form block] |

Each block entry must include: `block_id`, `component`, `props_schema`, `states[]`, `accessibility_notes`.

---

### B-3 — Add Design Hub to monorepo workspace

**Problem:** `.nezam/design-hub/` is a standalone Next.js app with its own `node_modules/` and `pnpm-lock.yaml` — it is not wired into the root `pnpm-workspace.yaml`. This means:
- `pnpm install` at root doesn't install Design Hub dependencies
- CI can't run `pnpm --filter design-hub` commands without a separate install step
- Version drift between root dependencies and Design Hub dependencies

**Fix:**

1. Check root `pnpm-workspace.yaml` (or `package.json` workspaces field) — add:
```yaml
packages:
  - '.nezam/design-hub'
```

2. Move `.nezam/design-hub/pnpm-lock.yaml` management to root lockfile.

3. Update `.github/workflows/ci.yml` to remove any separate `cd .nezam/design-hub && pnpm install` steps.

**Acceptance:** `pnpm --filter design-hub dev` works from repo root after root `pnpm install`.

---

### B-4 — Clean Design Hub root artifacts

**Items to address in `.nezam/design-hub/`:**

| File/Dir | Action | Reason |
|---|---|---|
| `CLAUDE_POLISH_PROMPT.md` | Move to `.cursor/commands/polish.md` or `.nezam/core/prompts/design-polish.md` | It's a command prompt, not a Design Hub config file |
| `_archive/` | Delete (keep in git history) | Archive belongs in git, not live workspace |
| `next-env.d.ts`, `tsconfig.tsbuildinfo` | Add to `.nezam/design-hub/.gitignore` | Build artifacts |

After moving `CLAUDE_POLISH_PROMPT.md`, run `pnpm ai:sync` if it becomes a new command.

---

### B-5 — Add Design Hub health check to CI

Current `ci.yml` T-F-007 covers typecheck and build. Add:

```yaml
- name: Design Hub token check
  run: pnpm --filter design-hub run design:tokens:emit && pnpm run check:tokens

- name: Wireframe lock integrity
  run: node .nezam/core/scripts/checks/check-wireframes-lock.js
```

This ensures the token → CSS pipeline never silently breaks.

---

## Track C — Workspace Debt Reduction

> **Why this track exists:** 169 agents and 323 skill entries create context
> pollution that degrades routing accuracy. The `nezam-` prefix duplication
> pattern alone contributes ~160 redundant entries.

---

### C-1 — Remove `nezam-` prefixed skill duplicates

**Problem:** Every skill in `.agents/skills/backend/`, `.agents/skills/frontend/`, etc. exists in two forms:
- `api-design/` (clean name)
- `nezam-api-design/` (prefixed mirror)

The `multi-tool-sync.mdc` documents this pattern: `nezam-*` entries are the Antigravity CLI skill format. They are generated mirrors — they should not be manually maintained separately.

**Action:**

1. Audit which `nezam-*` dirs are genuinely generated vs. have custom content:
```bash
# Find nezam- dirs that differ from their non-prefixed counterpart
for dir in $(find .agents/skills -type d -name "nezam-*"); do
  base="${dir/nezam-/}"
  if [ -d "$base" ]; then
    diff -rq "$dir" "$base" && echo "IDENTICAL: $dir" || echo "DIFFERS: $dir"
  fi
done
```

2. For identical pairs: delete the `nezam-*` copy — let `pnpm ai:sync` regenerate it.
3. For differing pairs: merge custom content into the canonical (non-prefixed) version, then delete the `nezam-*` copy.
4. Verify `pnpm ai:sync` regenerates `nezam-*` correctly after cleanup.

**Expected result:** ~160 fewer directories. Actual skill count drops from 323 to ~163.

---

### C-2 — Consolidate the two design gate rule files

**Problem:** Both `design-gates.mdc` and `design-hub-gates.mdc` define a "Gate 1: Wireframe Lock." `design-hub-gates.mdc` is a 20-line subset of `design-gates.mdc` Gate 7.

**Action:**

1. Copy `design-hub-gates.mdc` Gate 2 (Token Consistency) into `design-gates.mdc` as an addendum under Gate 2 — it adds one sentence about `wireframes_locked.json` token compliance.
2. Delete `.cursor/rules/design-hub-gates.mdc`.
3. Run `pnpm ai:sync`.

**Acceptance:** `ls .cursor/rules/ | grep design` returns only `design-gates.mdc` and `design-excellence-gates.mdc`.

---

### C-3 — Remove conflicting legacy rule files

**Problem:** `workspace-orchestration.mdc` explicitly states that `guide-response-style.mdc` and `guide-handoff-footer.mdc` in `docs/rules/` conflict with its Recommendation footer contract.

**Action:**

```bash
# Move to legacy folder instead of deleting (preserve for Antigravity-parity reference)
mkdir -p docs/rules/legacy
mv docs/rules/guide-response-style.mdc docs/rules/legacy/
mv docs/rules/guide-handoff-footer.mdc docs/rules/legacy/
```

Add a `docs/rules/legacy/README.md` note: "These files are preserved for reference only. They are NOT active rules. Do not activate globally — they conflict with workspace-orchestration.mdc."

---

### C-4 — Clean `.nezam/sessions/` stale data

**Problem:** `.nezam/sessions/` holds session state that persists across workspace restarts. Stale sessions accumulate and the canonical session state lives in `.cursor/state/` anyway.

**Action:**

1. Review `.nezam/sessions/` contents.
2. If purely ephemeral (timestamped temp files), delete all entries older than 30 days.
3. If any session files contain decisions not captured in `.nezam/core/memory/MEMORY.md`, extract them first.
4. Add `.nezam/sessions/` to the nightly cleanup job (if `nezam-nightly.yml` runs cleanup tasks, add a `find .nezam/sessions -mtime +30 -delete` step).

---

### C-5 — Standardize agent metadata across all agents

**Problem:** Only 7 of 169 agents are certified. Most agents have no `last_eval_score`, empty `changelog`, and `certified: false` with no path to certification. This makes the `AGENT_REGISTRY.yaml` misleading.

**Two options — pick one:**

**Option A (Lean):** Remove `certified`, `last_eval_score`, and `changelog` fields from all non-certified agents. Keep those fields only on agents that have actually been evaluated. Update `AGENT_REGISTRY.yaml` certification program note to say "Certification is earned, not default."

**Option B (Invest):** Run the eval framework on the 13 swarm lead agents (one per swarm) as a first pass. Use `.nezam/evals/cases/` for eval inputs. This is the right long-term path but requires dedicated time per agent.

**Recommendation:** Do Option A now (quick, honest), schedule Option B as a quarterly process.

Script for Option A:
```bash
# Strip uncertified metadata from agent files
node .nezam/core/scripts/skills/normalize-skill-ids.js
# (or write a one-off script targeting .cursor/agents/*.md frontmatter)
```

---

## Track D — Governance Hardening

> **Why this track:** NEZAM's governance model (hardlocks, gates, state files) is
> only as strong as its enforcement. Several enforcement mechanisms are
> documented but not fully wired.

---

### D-1 — Add state file integrity validator

**Problem:** `.cursor/state/*.yaml` files (gates' source of truth) can drift from actual filesystem state. A phase can be `status: complete` while its required artifact files don't exist.

**Create:** `.nezam/core/scripts/checks/check-state-integrity.js`

Logic:
```
For each phase in develop_phases.yaml:
  if status == "complete":
    → verify all required artifact files from SDD pipeline exist on disk
    → if any missing: report INTEGRITY_VIOLATION

For plan_progress.yaml:
  if seo == true:
    → verify docs/start/SEO_RESEARCH.md exists (or equivalent from workspace.paths.yaml)
  if scaffold == true:
    → verify PROJECT_SCAFFOLD.md exists
  [etc. for all 8 phases]
```

Add to `check:all` script:
```json
"check:state": "node .nezam/core/scripts/checks/check-state-integrity.js",
"check:all": "... && npm run check:state"
```

---

### D-2 — Add SPEC.md acceptance criteria schema validation

**Problem:** The Hyper-Rigorous Feature Spec Protocol requires machine-readable AC-IDs but there's no schema enforcing their format. Specs pass validation even if ACs are missing or malformed.

**Create:** `.nezam/core/schemas/spec-ac.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "Feature Spec Acceptance Criteria",
  "type": "object",
  "required": ["spec_id", "feature", "acceptance_criteria"],
  "properties": {
    "spec_id": { "type": "string", "pattern": "^SPEC-[A-Z]+-[0-9]{3}(-v[0-9]+\\.[0-9]+\\.[0-9]+)?$" },
    "feature": { "type": "string" },
    "acceptance_criteria": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "description"],
        "properties": {
          "id": { "type": "string", "pattern": "^AC-[0-9]{3}$" },
          "description": { "type": "string", "minLength": 10 }
        }
      }
    }
  }
}
```

Update `check:specs` script to validate against this schema:
```bash
# check-spec-versions.sh — add schema validation step
find .nezam/core/plans -name "SPEC.md" -exec node .nezam/core/scripts/checks/validate-spec-schema.js {} \;
```

---

### D-3 — Add `check:state` to CI sdd-gate-enforcement workflow

Current `sdd-gate-enforcement.yml` runs gate checks. Add `check:state` step so state integrity is verified on every PR — not just locally.

```yaml
# In .github/workflows/sdd-gate-enforcement.yml
- name: State integrity check
  run: pnpm run check:state
```

---

### D-4 — Add skill deprecation tracking

**Problem:** Skills accumulate without a formal deprecation path. Dead skills pollute context and mislead agents.

**Create:** `.agents/skills/DEPRECATED.md`

```markdown
# Deprecated Skills

Skills listed here are scheduled for removal. Do not reference in new agent definitions.

| Skill | Deprecated | Removal Date | Replacement |
|---|---|---|---|
| (add as identified) | | | |
```

Add a `check:deprecated` script that warns if any `.cursor/agents/*.md` references a deprecated skill path.

---

### D-5 — Structured Confidence Score template for PM-01

**Problem:** PM-01's Confidence Score is prose-only self-assessment. Replace with a structured output format that is auditable.

**Add to `.cursor/agents/swarm-leader.md`** under "Anti-Hallucination & Self-Reflection Protocol":

```markdown
### Required Confidence Score Output Format

Before every gated action, output this table:

| Dimension | Score (0-12.5) | Evidence |
|---|---|---|
| Path Integrity | _ | Files verified: [list] |
| Zero-Primitive Styling | _ | Token check: pass/fail |
| Evidence Log | _ | Output paths: [list] |
| Spec Compliance | _ | AC-IDs referenced: [list] |
| **Total** | **/50** | |

Threshold: Certified ≥ 37.5 (75%), Elite ≥ 45 (90%).
Below threshold → refine output before proceeding.
```

---

## Execution Sequence

```
Phase 0 (30 min)      → Run diagnostics, save baseline report

Phase 1 (2–3 hrs)     → All Track A items (critical fixes)
  A-3 → A-5 → A-4     (quick wins: YAML fix, path canonicalize, hook verify)
  A-1 → A-2           (design directory, wireframe blocks)
  A-6                  (acknowledge Phase 1 gate status — don't patch)

Phase 2 (2–3 hrs)     → Track B + C together (Design Hub + debt)
  B-3                  (monorepo wiring — do first, unblocks B-1)
  B-1 → B-2           (token emit script, wireframe blocks)
  B-4 → B-5           (Design Hub cleanup, CI additions)
  C-1                  (remove nezam- duplicates — biggest single cleanup)
  C-2 → C-3           (rule consolidation, legacy removal)
  C-4 → C-5           (sessions cleanup, agent metadata)

Phase 3 (2 hrs)       → Track D (governance hardening)
  D-1                  (state integrity validator — most valuable)
  D-2 → D-3           (spec schema + CI wiring)
  D-4 → D-5           (deprecation tracking, PM-01 template)

After each phase:     → pnpm check:all && pnpm ai:sync
```

---

## Summary Table

| ID | Item | Track | Effort | Impact | Priority |
|---|---|---|---|---|---|
| A-1 | Fix broken `design/tokens.json` path | A | 30 min | 🔴 Critical | P0 |
| A-2 | Populate `wireframes_locked.json` blocks | A | 1 hr | 🔴 Critical | P0 |
| A-3 | Fix YAML parse error in `plan_progress.yaml` | A | 5 min | 🔴 Critical | P0 |
| A-4 | Verify pre-commit hook installed | A | 15 min | 🟠 High | P0 |
| A-5 | Canonicalize `workspace.paths.yaml` references | A | 15 min | 🟠 High | P0 |
| A-6 | Resolve Phase 1 testing gate properly | A | Build work | 🟠 High | P1 |
| B-1 | Implement `design:tokens:emit` script | B | 2 hrs | 🟠 High | P1 |
| B-2 | Populate wireframe blocks for all 6 pages | B | 1 hr | 🟠 High | P1 |
| B-3 | Wire Design Hub into monorepo | B | 1 hr | 🟠 High | P1 |
| B-4 | Clean Design Hub root artifacts | B | 15 min | 🟡 Medium | P2 |
| B-5 | Add Design Hub health checks to CI | B | 30 min | 🟡 Medium | P2 |
| C-1 | Remove `nezam-` duplicate skills (~160 entries) | C | 1 hr | 🟠 High | P1 |
| C-2 | Consolidate two design gate rule files | C | 20 min | 🟡 Medium | P2 |
| C-3 | Remove conflicting legacy rule files | C | 10 min | 🟡 Medium | P2 |
| C-4 | Clean `.nezam/sessions/` stale data | C | 15 min | 🟢 Low | P3 |
| C-5 | Standardize agent metadata (Option A) | C | 30 min | 🟢 Low | P3 |
| D-1 | State file integrity validator | D | 2 hrs | 🟠 High | P1 |
| D-2 | SPEC.md acceptance criteria schema | D | 1 hr | 🟡 Medium | P2 |
| D-3 | Wire `check:state` into CI | D | 20 min | 🟡 Medium | P2 |
| D-4 | Skill deprecation tracking | D | 15 min | 🟢 Low | P3 |
| D-5 | PM-01 structured Confidence Score template | D | 30 min | 🟡 Medium | P2 |

---

## Definition of Done (for the whole plan)

- [ ] `pnpm check:all` exits 0 with no warnings
- [ ] `.nezam/design-hub/design/tokens.json` exists and is valid JSON
- [ ] `wireframes_locked.json` blocks array has > 0 entries for all pages
- [ ] `.cursor/state/plan_progress.yaml` is valid YAML
- [ ] Pre-commit hook installed and verified
- [ ] Skill count under 180 (all `nezam-` duplicates regenerated by sync, not hand-maintained)
- [ ] Single design gate file (`design-gates.mdc` only)
- [ ] `check:state` script exists and is wired into CI
- [ ] `pnpm ai:sync` runs clean with no drift warnings

---

*This document should be committed to the repo and tracked as a living plan.*  
*Update the Summary Table checkboxes as items complete.*
*Owner: Dorgham | Review: after Phase 2 build completes*
