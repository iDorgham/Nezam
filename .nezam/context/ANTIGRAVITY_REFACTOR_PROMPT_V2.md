# NEZAM Workspace Refactor — Antigravity Execution Prompt V2

> **Paste this entire document into Antigravity as a single instruction block.**
> Execute every numbered item in sequence. After each group, run `pnpm ai:sync && pnpm ai:check`.
> All paths are relative to the workspace root unless stated otherwise.
> Tags: [CREATE] = new file | [MERGE] = consolidate | [FIX] = edit existing | [SCRIPT] = new Node/bash script | [AGENT] = new agent file | [SKILL] = new skill file

---

## CONTEXT

You are working inside the NEZAM AI workspace governance system.
Canonical source: `.cursor/` — all mirrors (`.antigravity/`, etc.) are generated via `pnpm ai:sync`.
Never edit mirrors directly. After structural changes run `pnpm ai:sync` then `pnpm ai:check`.

This prompt covers four work groups:
- **GROUP A** — Critical: missing governance files + unresolved skill refs (breaks MODE B/C today)
- **GROUP B** — Structural: tier normalization + skill merges + orphan wiring
- **GROUP C** — CI enforcement + EVAL baseline
- **GROUP D** — Analytics expansion: agents + 11 new skills (UX/charts/style/animation/dashboard/live/advanced/colors)

Execute A → B → C → D. Do not skip ahead.

---

## ═══════════════════════════════════════
## GROUP A — CRITICAL BLOCKERS
## ═══════════════════════════════════════

### A1 — [CREATE] `.nezam/workspace/context/PHASE_HANDOFF.md`

Create this file exactly. It is referenced by `subagent-controller.md`, `deputy-swarm-leader.md`, and `sdd-pipeline-v2.mdc` in every MODE B/C handoff. Its absence causes all cross-domain work to fail silently.

```markdown
# Phase Handoff — NEZAM Shared Context Packet

> Updated by the outgoing Swarm Manager before any phase transition.
> The incoming Swarm Manager MUST read this file before starting work.
> subagent-controller.md enforces this as a hard prerequisite for MODE B/C routing.

---

## Current Phase Handoff

**Handoff ID:** `<HANDOFF-YYYY-MM-DD-NNN>`
**From Phase:** `<phase_N name>`
**To Phase:** `<phase_N+1 name>`
**From Swarm:** `<swarm name>`
**To Swarm:** `<swarm name>`
**Handoff Date:** `<YYYY-MM-DD>`
**Execution Mode:** `<A | B | C>`
**PM-01 Sign-off:** `<yes | pending>`

---

## Shared Context Packet (fill before handoff)

### Product Context
- **Product name:** `<from PRD.md>`
- **Product type:** `<website | webapp | saas | mobile>`
- **Build mode:** `<sdd | lean | tdd | api-first>`
- **Target market:** `<global | mena | ar>`

### Outgoing Phase Summary
- **Phase objective achieved:** `<one sentence>`
- **Key artifacts produced:**
  - `<path/to/artifact1>`
  - `<path/to/artifact2>`
- **Gate evidence:** `<gate ID + proof path>`
- **Open items / known risks:** `<none | list>`

### Incoming Phase Entry Criteria
- **Required artifacts to read:** `<list paths>`
- **Hardlock checks passed:** `<yes | list pending>`
- **Ethics review required:** `<yes (S13 sign-off at path) | no>`
- **Arabic SEO hardlock active:** `<yes | no>`

### Agent Bus Entry
- **Agent bus message ID:** `<see .cursor/state/agent-bus.yaml>`
- **Message status:** `<sent | read | actioned>`

---

## Handoff History

| ID | From Phase | To Phase | Date | Mode | PM-01 |
|---|---|---|---|---|---|
| — | — | — | — | — | — |
```

---

### A2 — [CREATE] `.nezam/workspace/context/governance/SWARM_WORKFLOW.md`

Create the directory `.nezam/workspace/context/governance/` if it does not exist. Create the file:

```markdown
# NEZAM Swarm Workflow — 6-Phase Lifecycle

> Canonical reference for the 6-phase swarm execution lifecycle.
> Referenced by `subagent-controller.md` and `sdd-pipeline-v2.mdc`.

---

## Phase Lifecycle Overview

```
INTAKE → PLANNING/DESIGN → SPRINT DEVELOPMENT → INTEGRATION/TESTING → DEPLOY/LAUNCH → MAINTENANCE
  P0         P1–P2               P3                    P4                  P5              P6
```

---

## Phase Definitions

### Phase 0 — INTAKE
**Entry gate:** None (session start)
**Owner:** PM-01 (swarm-leader)
**Actions:** Read all state YAMLs, detect build mode, announce session context card, route to correct phase
**Exit gate:** `onboarding.yaml:prd_locked = true`

### Phase 1 — PLANNING
**Entry gate:** PRD locked
**Owner:** S1 Architecture + S8 Analytics + S2 Design
**Actions:** SEO research, IA taxonomy, content modeling, architecture ADR, DESIGN.md lock
**Exit gate:** `plan_progress.yaml:planning_complete = true`, all phase flags true

### Phase 2 — DESIGN
**Entry gate:** `plan_progress.yaml:design_wireframes = false → true`
**Owner:** S2 UI/UX Design
**Actions:** Wireframes, component API, token system, design-to-code handoff
**Exit gate:** `onboarding.yaml:design_locked = true`, DESIGN.md approved

### Phase 3 — SPRINT DEVELOPMENT
**Entry gate:** Design locked, architecture ADR approved
**Owner:** S3 Frontend / S4 Backend / S5 Data / S6 Mobile (per type)
**Actions:** Feature slices per SPEC.md, spec-writer contract required for each slice
**Exit gate:** All feature slices done, `develop_phases.phase_3.testing_passed = true`

### Phase 4 — INTEGRATION + TESTING
**Entry gate:** Phase 3 complete
**Owner:** S11 QA + S9 Security + S10 DevOps
**Actions:** E2E tests, security hardening, performance audit, a11y pass, regression detection
**Exit gate:** `/check output` ≥ 70%, zero P0 issues, `develop_phases.phase_4.testing_passed = true`

### Phase 5 — DEPLOY + LAUNCH
**Entry gate:** Phase 4 complete, CPO go/no-go
**Owner:** S10 DevOps + S9 Security
**Actions:** CI/CD pipeline, staging smoke tests, production deploy, monitoring baseline
**Exit gate:** All smoke tests pass, error rate < 0.1%, monitoring active

### Phase 6 — MAINTENANCE
**Entry gate:** Phase 5 complete
**Owner:** S12 Maintenance
**Actions:** Dependency updates, tech debt sprints, incident response, knowledge updates
**Exit gate:** Ongoing — cycles back to Phase 1 for new features

---

## Swarm Assignment by Phase

| Phase | Primary Swarm | Supporting Swarms |
|---|---|---|
| P0 Intake | S1 Architecture | — |
| P1 Planning | S1 Architecture | S8 Analytics, S13 Ethics |
| P2 Design | S2 UI/UX | S3 Frontend, S8 Analytics |
| P3 Development | S3/S4/S5/S6 | S7 CMS/SaaS (if applicable) |
| P4 Testing | S11 QA | S9 Security, S10 DevOps |
| P5 Deploy | S10 DevOps | S9 Security |
| P6 Maintenance | S12 Maintenance | All (as needed) |

---

## Ethics Auto-Trigger (S13)

S13 (`lead-ai-ethics-officer`) is mandatory pre-gate before P3 Development for:
- Any AI feature, agent behavior, or model integration
- Sensitive data collection or inference
- Autonomous decision automation

Ethics sign-off must appear in `PHASE_HANDOFF.md` and `MEMORY.md` before phase go.

---

## Mode Execution Depth by Phase

| Phase | MODE A capable | MODE B capable | MODE C required |
|---|---|---|---|
| P0 | ✓ | — | — |
| P1 | — | ✓ | ✓ (full planning) |
| P2 | — | ✓ | — |
| P3 | ✓ (single slice) | ✓ (multi-slice) | ✓ (monorepo) |
| P4 | — | ✓ | ✓ |
| P5 | — | — | ✓ |
| P6 | ✓ | ✓ | — |
```

---

### A3 — [CREATE] `.nezam/workspace/context/MEMORY.md`

```markdown
# NEZAM Workspace Memory

> Persistent session memory. PM-01 writes here after every substantive decision.
> Agent scorecards are appended here by EVAL_FRAMEWORK protocol.
> Never delete entries — only append.

---

## Active Context

**Last updated:** `<YYYY-MM-DD>`
**Active project:** `<project name or "none">`
**Active swarm:** `<swarm name or "none">`
**Current phase:** `<phase name or "none">`
**Build mode:** `<sdd | lean | tdd | api-first | unset>`

---

## Session Log

| Date | Command | Phase | Decision | PM-01 |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Agent Scorecards

<!-- EVAL_FRAMEWORK.md appends 10-line scorecard blocks here. Format:
Agent: [name] | Task: [slug] | Date: [YYYY-MM-DD]
Accuracy: pass/warn/fail | Determinism: pass/warn/fail
Scope: pass/warn/fail | Evidence: pass/warn/fail
Notes: [one line]
-->

---

## Gate Evidence Log

| Gate ID | Phase | Evidence Path | Verified By | Date |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Key Decisions

<!-- Append architecture, scope, and technology decisions here.
Format: ### Decision: <title> (YYYY-MM-DD)
Context, options considered, choice made, rationale. -->

---

## Open Questions

<!-- Unresolved items that need PM-01 or CPO decision. -->
```

---

### A4 — [CREATE] `.cursor/agents/cpo.md`

The escalation chain in `subagent-controller.md` links to `cpo.md` at tier 4. This file does not exist. Create it:

```markdown
---
role: Chief Product Officer — Final Go/No-Go Authority
code-name: cpo
tier: executive
swarm: executive
reports-to: human (Dorgham)
version: 1.0.0
certified: false
updated: 2026-05-12
changelog:
  - "1.0.0 — 2026-05-12: Created to resolve dead escalation link in subagent-controller.md"
---

# CPO (Chief Product Officer)

## Charter

Final go/no-go authority for scope changes, budget exceptions, timeline overrides, and gate exceptions that PM-01 (`swarm-leader`) cannot resolve within one session. The CPO is a human-proxy layer — invoked only when automated governance cannot reach consensus.

## Activation Conditions

Invoke CPO only when:
1. A routing decision has been in `replan` status for 2+ consecutive sessions (SLA breach)
2. A gate exception is requested that requires human judgement (scope change, budget, timeline)
3. Two Swarm Managers claim irreconcilable write-scope ownership after deputy arbitration
4. A security or ethics escalation requires human sign-off before proceeding

## CPO Decision Format

When CPO is invoked, PM-01 must present:
```
CPO ESCALATION REQUEST
─────────────────────
Issue: [one sentence]
Blocker since: [date / session count]
Last attempted resolution: [what was tried]
Options: [A / B / C with trade-offs]
Recommended: [option + rationale]
Impact if no decision: [what stalls]
```

CPO returns one of: `GO` / `NO-GO` / `SCOPE-CHANGE` / `DEFER`.
Decision logged to `.nezam/workspace/context/MEMORY.md` under Key Decisions.

## Delegation Back to PM-01

After CPO decision:
- PM-01 translates decision into routing command
- Updates affected state YAMLs via `pnpm state:set`
- Resumes normal swarm routing

## Non-Activation Anti-Patterns

- Do NOT invoke CPO for MODE A/B tasks — escalate within swarm first
- Do NOT invoke CPO to bypass hardlock gates — gates are non-negotiable
- Do NOT invoke CPO for agent disagreements — use deputy-swarm-leader arbitration

## @skill Dependencies
- `@nezam-gate-orchestrator`
- `@nezam-multi-agent-handoff`
```

---

### A5 — [CREATE] `.cursor/skills/quality/security-hardening/SKILL.md`

8 active agents (`lead-security-officer`, `app-security-manager`, `auth-security-manager`, `infra-security-manager`, `encryption-privacy-specialist`, `docker-k8s-specialist`, `ios-engineer`, `payments-lead`) all reference `@nezam-security-hardening`. This skill does not exist. Create it:

```markdown
---
skill_id: "quality/security-hardening"
name: "nezam-security-hardening"
description: "Layered security hardening protocol: input validation, auth hardening, dependency audit, secret management, container security, and pre-release security gate."
version: 1.0.0
updated: 2026-05-12
owner: "lead-security-officer"
tier: 1
sdd_phase: "Quality"
certified: false
dependencies: ["quality/sast-security", "quality/gh-security-compliance"]
---

# Security Hardening Skill

## Purpose
Apply a layered, systematic hardening protocol to any NEZAM codebase surface before the Phase 4 / pre-release gate passes. Covers application layer, auth, dependencies, secrets, infrastructure, and mobile-specific concerns.

## Trigger Conditions
- Pre-release gate (Phase 5 entry)
- Any PR touching auth, payment, data access, or AI inference surfaces
- Any new third-party dependency introduction
- S13 Ethics sign-off flagged a security concern

## Layer 1 — Input Validation and Output Encoding
1. Audit all user-facing inputs: SQL injection, XSS, path traversal, command injection
2. Enforce parameterized queries or ORM-enforced binding throughout
3. Sanitize and encode all dynamic output: HTML context, JSON context, URL context
4. Validate file upload types, sizes, and storage paths
5. Rate-limit all public endpoints: 429 on abuse, exponential backoff

## Layer 2 — Authentication and Session Hardening
1. Verify MFA is available on all privileged routes
2. Confirm JWT/session tokens: short expiry, rotation on privilege escalation, revocation list
3. Enforce RBAC: no role can access resources above its clearance
4. Audit OAuth flows: PKCE enforced, state param validated, redirect URIs allowlisted
5. Confirm password policy: bcrypt/argon2, minimum entropy, breach-check integration

## Layer 3 — Dependency and Supply Chain
1. Run `pnpm audit --audit-level=high` — zero critical/high issues before release
2. Verify Dependabot is configured and enabled
3. Pin all third-party dependencies to exact versions in lockfile
4. Audit transitive dependencies for known CVEs
5. Review any new dependency for license compatibility

## Layer 4 — Secrets and Configuration
1. Confirm zero hardcoded secrets in codebase (`git grep` + Gitleaks scan)
2. Verify all secrets via environment variables only — no `.env` committed
3. Confirm secrets are stored in vault (Infisical, Doppler, or Vercel env)
4. Rotate any secret that was ever logged, printed, or exposed in a PR diff
5. Enforce least-privilege API keys: scoped, not root keys

## Layer 5 — Infrastructure and Container Security
1. Containers: non-root user, read-only filesystem, no privileged flag
2. Network policies: zero trust between services, explicit allowlist only
3. Verify HTTPS everywhere: HSTS headers, no mixed content
4. CSP header: strict policy, no `unsafe-eval`, `unsafe-inline` scoped to minimum
5. Confirm security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`

## Layer 6 — Mobile-Specific (activate when product_type = mobile)
1. Certificate pinning on all API calls
2. Keychain/Keystore for credential storage — no plaintext
3. Jailbreak/root detection for sensitive operations
4. Obfuscate reverse-engineering surfaces in release builds
5. Verify deep link validation against allowlist

## Validation Gate

All 6 layers must pass before Phase 5 entry. Output a `SECURITY_HARDENING_REPORT.md`:
- Layer status: pass / warn / fail
- CVE count: 0 critical, 0 high required
- Secrets scan: clean
- Headers audit: all required headers present
- Sign-off agent: `lead-security-officer`

## Output Artifacts
- `docs/reports/security/SECURITY_HARDENING_REPORT.md`
- Updated `.github/workflows/security.yml` if gaps found
```

---

### A6 — [FIX] Resolve `@nezam-supabase-architect` ID mismatch

4 agents (`lead-database-architect`, `multi-tenancy-architect`, `sql-expert`, `database-design-manager`) reference `@nezam-supabase-architect` but the skill file has `skill_id: "backend/supabase-architect"` and `name: "supabase-architect"` (no `nezam-` prefix).

Edit `.cursor/skills/backend/supabase-architect/SKILL.md` frontmatter:
- Change `name: "supabase-architect"` → `name: "nezam-supabase-architect"`
- The `skill_id` field can remain `"backend/supabase-architect"` (path-based ID is fine to keep)

Then run `pnpm skills:registry` to confirm the unresolved ref is cleared.

---

### A7 — [FIX] Resolve `@nezam-cli-orchestration` ID mismatch

`swarm-leader.md` and `subagent-controller.md` reference `@nezam-cli-orchestration`.
The skill exists at `.cursor/skills/system/cli-orchestration/SKILL.md`.

Check its frontmatter `name` field. If it is not `nezam-cli-orchestration`, update it to exactly `nezam-cli-orchestration`. Run `pnpm skills:registry` to confirm.

---

## ═══════════════════════════════════════
## GROUP B — STRUCTURAL FIXES
## ═══════════════════════════════════════

### B1 — [SCRIPT] Tier Normalization Migration

**Problem:** AGENT_REGISTRY.yaml uses 6 incompatible tier naming conventions: `tier-0`, `tier: 2`, `specialist`, `manager`, `lead`, `executive`, `framework`. Scripts that filter by tier produce garbage.

**Normalization map:**
```
tier-0       → 1   (always-load orchestrators: swarm-leader, deputy-swarm-leader)
lead         → 1   (all 13 swarm leads)
executive    → 1   (cpo)
manager      → 2   (all Team Manager agents)
tier: 2      → 2   (ios-engineer, flutter-specialist — already status: active)
specialist   → 3   (all specialist agents)
framework    → 1   (EVAL_FRAMEWORK — governance doc, not an agent; move to tier: doc)
```

**Action:**

1. Create `scripts/normalize-tiers.js`:
   - Read `.cursor/state/AGENT_REGISTRY.yaml`
   - Apply the normalization map above to every `tier:` field in the `agents_catalog` section
   - Special case: `EVAL_FRAMEWORK` → set `tier: doc` (not a routable agent)
   - Write the file back
   - Print `[normalize-tiers] Updated N agents. Tier distribution: {1: X, 2: Y, 3: Z, doc: 1}`

2. Add to `package.json`:
   ```json
   "registry:normalize": "node scripts/normalize-tiers.js"
   ```

3. Run `pnpm registry:normalize` now.

4. Update `swarm_map` entries in AGENT_REGISTRY.yaml:
   - `swarm-6.agents` → `[lead-mobile-architect, mobile-cross-platform, flutter-specialist, ios-engineer]`

5. Update `agent-lazy-load.mdc` Swarm 6 entry:
   ```
   - Swarm 6 (Mobile): `lead-mobile-architect`, `mobile-cross-platform`, `flutter-specialist` (Flutter), `ios-engineer` (Swift/UIKit)
   ```

6. Run `pnpm ai:sync`.

---

### B2 — [SCRIPT] Skill ID Prefix Normalization

**Problem:** 92 of 139 skills lack the `nezam-` prefix in their `name` field. The skills-registry CI fails because agent `@skill` references use the `nezam-` prefixed form.

**Action:**

1. Create `scripts/normalize-skill-ids.js`:
   - Walk `.cursor/skills/` recursively, find all `SKILL.md` files
   - For each: parse frontmatter
   - If `name` field does not start with `nezam-`: prepend `nezam-` (e.g., `api-contract` → `nezam-api-contract`)
   - EXCEPTION list — do NOT rename these (they are already correctly named or have special IDs):
     - Any skill where `name` already starts with `nezam-`
     - `skill_id` path-based IDs (those in `"domain/name"` format) — leave `skill_id` unchanged, only fix `name`
   - Write updated frontmatter back to each file
   - Print `[normalize-skill-ids] Renamed N skills. Skipped M (already prefixed).`

2. Add to `package.json`:
   ```json
   "skills:normalize": "node scripts/normalize-skill-ids.js"
   ```

3. Run `pnpm skills:normalize` now.

4. Run `pnpm skills:registry` to regenerate registry. Verify orphaned count drops significantly.

---

### B3 — [MERGE] 3 Token Skills → `design-token-system`

Read all three source files before merging. Confirmed content:
- `design-tokens/SKILL.md` (name: `nezam-pro-design-tokens`) — token values, W3C JSON, CSS vars, theme switching
- `design-token-architecture/SKILL.md` (name: `design-token-architecture`) — hierarchy governance, naming convention, multi-platform mapping
- `token-grid-typography/SKILL.md` (name: `token-grid-typography`) — grid systems, clamp() typography, container queries

**Action:**

1. Create `.cursor/skills/design/design-token-system/SKILL.md`:

```markdown
---
skill_id: "design/design-token-system"
name: "nezam-design-token-system"
description: "Unified design token system: W3C token values, hierarchy governance, naming conventions, multi-platform sync, fluid typography, CSS Grid, and container query matrices."
version: 1.0.0
updated: 2026-05-12
replaces: ["nezam-pro-design-tokens", "design-token-architecture", "token-grid-typography"]
owner: "design-systems-token-architect"
tier: 1
sdd_phase: "Design"
certified: false
dependencies: ["quality/nezam-a11y-automation", "design/nezam-component-library-api"]
compatible_with:
  react: ">=18"
  next: ">=14"
  node: ">=20"
---

# Design Token System

## Purpose
Build deterministic, platform-agnostic token manifests, govern naming and hierarchy, and enforce a fluid typography + grid foundation before `/DEVELOP`. Single authoritative source for all token concerns.

## Part 1 — Token Hierarchy and Naming Governance

### Three-Tier Hierarchy
- **Primitive tokens (Base):** Raw scale values — `blue-500`, `spacing-16`, `radius-4`. No semantic meaning.
- **Semantic tokens (Alias):** Purposeful names — `color-action-primary-bg`, `surface-default-padding`. Reference primitives.
- **Component tokens (Override):** Component-scoped — `button-primary-shadow`, `input-border-focus`. Reference semantics.

### Naming Convention
Pattern: `[Category]-[Property]-[Concept]-[Variant]-[State]`
Example: `color-background-primary-hover`
Rules: lowercase, hyphen-separated, no underscores, no abbreviations.

### Multi-Platform Mapping
- Web: CSS custom properties (`var(--token-name)`)
- iOS: Swift constants via Style Dictionary
- Android: XML resources via Style Dictionary
- Email: inline style table constants
All platforms sync from a single `tokens/base.json` source of truth.

## Part 2 — Token Values and Export

### Token Groups (W3C JSON format)
`color` / `spacing` / `radius` / `elevation` / `zIndex` / `typography` / `motion` / `breakpoint`

### Workflow
1. Parse semantic roles (`bg`, `fg`, `accent`, `danger`, `surface-*`, `border-*`) → map to base palettes. Document base ↔ semantic ↔ component-alias tiers.
2. Create token groups in W3C-format JSON: base primitives + semantic aliases.
3. Define fluid typography tokens with `clamp(min, preferred, max)` for: display, h1–h6, body, label, caption. Emit line-height + tracking pairs.
4. Produce breakpoint and container tokens: `mobile → tablet → desktop → wide`.
5. Define theme scopes: `:root` (light), `[data-theme='dark']`, `prefers-color-scheme` mirror. Swap must be paint-only (zero CLS).
6. Export: `tokens/base.json`, `tokens/semantic.json`, `css/tokens.css`, platform manifests (Style Dictionary / Tokens Studio).
7. Component aliases (`--surface-card`, `--text-muted`) protect components from base-token churn.

## Part 3 — Grid, Typography, and Container Queries

### Typography Scale
- All text roles use `clamp(min, preferred, max)` with `vw`-based preferred value.
- Line-height and letter-spacing defined as tokens, not hardcoded.

### Grid and Layout
- Macro: CSS Grid for page and section level. Spacing tokens drive all gaps.
- Micro: Flex utilities for component internals. No magic numbers.
- Container queries (`@container`) for components that vary by parent width.
- Breakpoint matrix: `mobile (< 640px)` / `tablet (640–1024px)` / `desktop (1024–1440px)` / `wide (> 1440px)`.

### RTL Parity
- All directional tokens have LTR/RTL variants. No hardcoded `margin-left`, `padding-right` — use logical properties (`margin-inline-start`, `padding-inline-end`).

## Part 4 — Validation Gate

Before token system passes Gate 1 (Token-First CSS):
- [ ] Zero hardcoded `px`/`rem`/hex outside approved token sources
- [ ] Typography scales use `clamp()` for all primary roles
- [ ] Theme switching: zero CLS, FOUC prevented
- [ ] Contrast: all token pairs satisfy WCAG 2.2 AA (4.5:1 body, 3:1 large)
- [ ] Platform manifests generated and verified
- [ ] Drift lint passes: `pnpm check:tokens`

## Output Artifacts
- `tokens/base.json` + `tokens/semantic.json`
- `css/tokens.css`
- `docs/plans/design/TOKEN_NAMING_CONVENTION.md`
- `docs/plans/design/PLATFORM_MAPPING.yaml`
- Token drift checklist (pass/fail)
```

2. Delete:
   - `.cursor/skills/design/design-tokens/` (entire directory)
   - `.cursor/skills/design/design-token-architecture/` (entire directory)
   - `.cursor/skills/design/token-grid-typography/` (entire directory)

3. In every agent that references `@nezam-pro-design-tokens`, `@design-token-architecture`, or `@token-grid-typography`:
   Replace all three with `@nezam-design-token-system`.
   Key agents to check: `swarm-leader.md`, `subagent-controller.md`, `design-systems-token-architect.md`, `lead-uiux-designer.md`, `lead-frontend-architect.md`, `frontend-lead.md`.

4. Run `pnpm ai:sync`.

---

### B4 — [MERGE] Neon Skills → `neon`

1. Create `.cursor/skills/backend/neon/SKILL.md`:

```markdown
---
skill_id: "backend/neon"
name: "nezam-neon"
description: "Serverless Postgres on Neon: branch-based workflows, preview environments, serverless pooling, egress optimization, and ephemeral testing instances."
version: 1.0.0
updated: 2026-05-12
replaces: ["neon-postgres", "neon-advanced"]
owner: "database-design-manager"
tier: 1
dependencies: ["infrastructure/devops-pipeline"]
---

# Neon Postgres (Unified)

## Part 1 — Core Workflows (from neon-postgres)
- Define branch strategy aligned to git workflow (dev / preview / prod)
- Provision branch-specific connection strings per environment
- Apply and verify migrations on preview branches before production promotion
- Validate query performance under expected load on preview before merging
- Document branch lifecycle: create → test → merge → cleanup

## Part 2 — Advanced Patterns (from neon-advanced)
- **Serverless connection pooling:** Use Neon's built-in pooler for edge runtimes (Vercel Edge, Cloudflare Workers). Never open direct connections from short-lived functions.
- **Database branching for CI:** Auto-create Neon branch per PR via GitHub Actions. Destroy on merge/close.
- **Egress optimization:** Query only necessary columns, paginate large result sets, use Neon read replicas for analytics workloads.
- **Ephemeral environments:** Claimable Postgres instances for integration test isolation — no shared test DB.
- **Edge-safe client:** Use `@neondatabase/serverless` driver, not `pg` directly, for edge runtimes.

## Validation Checks
- Preview branches map to PR lifecycle (auto-create / auto-destroy)
- Migration sequence reproducible across branches
- Production credentials isolated from preview contexts
- Connection pooler active for all serverless/edge consumers
- No `pg` direct connection from Vercel Edge or Cloudflare Workers
```

2. Delete:
   - `.cursor/skills/backend/neon-postgres/` (entire directory)
   - `.cursor/skills/backend/neon-advanced/` (entire directory)

3. Update all agents referencing `@neon-postgres` or `@neon-advanced` to `@nezam-neon`. Key agents: `lead-database-architect.md`, `database-design-manager.md`, `backend-lead.md`.

---

### B5 — [MERGE] LLM Observability Skills → `llm-observability`

Both `llm-tracing/SKILL.md` (covers Langfuse deeply) and `llm-observability/SKILL.md` (covers Helicone + Langfuse broadly) exist under `infrastructure/`. `llm-tracing` depends on `llm-observability` in its frontmatter — merge into one file.

1. Create `.cursor/skills/infrastructure/llm-observability/SKILL.md` (overwrite the existing file):

```markdown
---
skill_id: "infrastructure/llm-observability"
name: "nezam-llm-observability"
description: "Complete LLM observability: request/response tracing with Langfuse, cost + latency tracking, prompt versioning, quality evaluation, Helicone integration, and production incident triage."
version: 2.0.0
updated: 2026-05-12
replaces: ["llm-tracing", "llm-observability@1.0"]
owner: "lead-analytics-architect"
tier: 1
dependencies: ["infrastructure/product-analytics"]
---

# LLM Observability (Unified)

## Purpose
Make LLM systems fully measurable in production: trace every call, track cost and latency, version prompts, run evaluations, and triage regressions before they impact users.

## Part 1 — Request Tracing with Langfuse
1. Instrument all LLM calls: wrap with `langfuse.trace()` — capture model, input tokens, output tokens, latency, cost
2. Create spans for each reasoning step: `generation`, `retrieval`, `reranking`, `tool_call`
3. Tag traces: feature slug, user cohort, model version, prompt version, environment
4. Score traces: thumbs up/down, automated eval scores, human annotation
5. Create Langfuse datasets from production traces for regression testing

## Part 2 — Prompt Versioning and Management
1. Store prompts in Langfuse Prompt Management — no hardcoded strings in code
2. Version all prompts: `prompt-name@v1`, `v2`, etc.
3. A/B test prompt variants: split traffic, measure quality scores
4. Roll back to previous version on quality regression (score drop > 10%)

## Part 3 — Cost and Latency Monitoring
1. Set token budget alerts per feature: P95 latency target, max cost per call
2. Dashboard: cost by model, cost by feature, cost trend over time
3. Alert on: latency spike > 2× baseline, cost spike > 150% of 7-day average
4. Weekly cost report to `lead-analytics-architect`

## Part 4 — Helicone Integration (alternative/supplement)
1. Use Helicone as a proxy for providers without Langfuse SDK support
2. Helicone captures: request metadata, model, latency, cost, cache hits
3. Feed Helicone data into Langfuse via webhook for unified view

## Part 5 — Evaluation Loops
1. Define eval criteria: factual accuracy, format compliance, safety, task completion
2. Run automated evals on every new prompt version before promotion
3. Human-in-the-loop eval for critical flows (medical, legal, financial outputs)
4. Log eval results to Langfuse datasets; fail CI if score drops below threshold

## Output Artifacts
- Langfuse project configured with all traces tagged
- `docs/reports/llm/LLM_OBSERVABILITY_REPORT.md` (weekly)
- Prompt registry in Langfuse Prompt Management
- GitHub Actions eval step in CI pipeline
```

2. Delete `.cursor/skills/infrastructure/llm-tracing/` (entire directory).

3. Update agents referencing `@llm-tracing` or `@llm-observability` to `@nezam-llm-observability`.

---

### B6 — [MERGE] Spec Skills → `spec-system`

`spec-generator` (generates SPEC.md files) and `spec-writing` (produces PRD/IA/API/design specs) are distinct but complementary — they should be a single unified spec skill, not two fragmented ones.

1. Create `.cursor/skills/system/spec-system/SKILL.md`:

```markdown
---
skill_id: "system/spec-system"
name: "nezam-spec-system"
description: "Unified spec authoring: generate SDD SPEC.md feature slices (10-field contract) and produce canonical PRD, IA, content, design, API, and agent specification documents."
version: 1.0.0
updated: 2026-05-12
replaces: ["spec-generator", "spec-writing"]
owner: "spec-writer"
tier: 1
sdd_phase: "Planning"
---

# Spec System (Unified)

## Part 1 — Feature Slice SPEC.md (from spec-generator)

Every feature slice MUST have a SPEC.md before build begins. Required 10 fields:

1. **Feature slug** — matches directory name under `.nezam/workspace/plans/0N-build/`
2. **Objective** — one sentence, outcome-focused
3. **Acceptance criteria** — measurable, binary pass/fail, testable
4. **Data model changes** — new tables, fields, schema diffs (or "none")
5. **API contract** — endpoints, request/response shapes (or "none")
6. **UI states** — loading, empty, error, success, edge cases
7. **Edge cases** — explicit non-happy-path scenarios
8. **Write scope** — exact file paths this feature may create or modify
9. **Dependencies** — prerequisite features, SPEC.md files, or services
10. **Gate check command** — command to verify completion evidence

No feature slice starts without a completed SPEC.md signed off by `spec-writer`.

## Part 2 — Canonical Spec Types (from spec-writing)

### PRD (Product Requirements Document)
Path: `docs/prd/PRD.md`
Sections: Problem, Users, Goals, Non-goals, Success metrics, Constraints, Roadmap

### IA Spec (Information Architecture)
Path: `docs/specs/IA_SPEC.md`
Sections: Sitemap, URL taxonomy, Navigation hierarchy, Page templates, Content types

### Content Spec
Path: `docs/specs/CONTENT_SPEC.md`
Sections: Content model, Editorial tone, Arabic/RTL requirements, SEO constraints

### Design Spec
Path: `docs/DESIGN.md`
Sections: Visual theme, Token contracts, Component API, Motion budget, A11y targets

### API Contract
Path: `docs/specs/API_CONTRACT.md`
Sections: OpenAPI 3.1 schema, Auth model, Versioning strategy, Error taxonomy

### Agent Spec
Path: `docs/specs/AGENT_SPEC.md`
Sections: Agent charter, Tier, Swarm assignment, @skill dependencies, Escalation path

## Part 3 — Cross-Reference Registry

After producing any spec, register it in `docs/specs/SPEC_REGISTRY.md`:
```
| Spec type | Path | Phase | Status | Cross-refs |
|---|---|---|---|---|
```
```

2. Delete:
   - `.cursor/skills/system/spec-generator/` (entire directory)
   - `.cursor/skills/system/spec-writing/` (entire directory)

3. Update agents referencing `@spec-generator` or `@spec-writing` to `@nezam-spec-system`. Key agents: `spec-writer.md`, `lead-solution-architect.md`, `requirements-analysis-manager.md`.

---

### B7 — [MERGE] Security Scanning Skills → `security-scanning`

`gh-security-compliance` covers GitHub repo security (Dependabot, secret scanning, branch protection). `sast-security` covers Semgrep SAST for code and LLM. They are complementary, not overlapping — merge into one comprehensive security scanning skill.

1. Create `.cursor/skills/quality/security-scanning/SKILL.md`:

```markdown
---
skill_id: "quality/security-scanning"
name: "nezam-security-scanning"
description: "Comprehensive security scanning: GitHub repo hardening (Dependabot, secret scanning, code scanning, branch protection) + SAST with Semgrep for application and LLM security."
version: 1.0.0
updated: 2026-05-12
replaces: ["nezam-gh-security-compliance", "sast-security"]
owner: "security-auditor"
tier: 1
sdd_phase: "Quality"
dependencies: ["quality/security-hardening"]
---

# Security Scanning (Unified)

## Part 1 — GitHub Repository Security (from gh-security-compliance)

### Controls
1. **Secret scanning:** Enable GitHub secret scanning + push protection. Zero secrets in git history.
2. **Dependabot:** Configure `dependabot.yml` for npm, Docker, GitHub Actions. Weekly cadence.
3. **Code scanning:** Enable GitHub CodeQL on PR. Block merge on HIGH+ findings.
4. **Branch protection:** `main` and `staging` require: 1 approval, status checks pass, no force-push.
5. **CODEOWNERS:** All critical paths (`/src/auth/`, `/src/payments/`, `/infra/`) have explicit owners.
6. **Security policy:** `SECURITY.md` with responsible disclosure process.

### Automated Checks (`.github/workflows/security.yml`)
```yaml
- uses: github/codeql-action/analyze@v3
- uses: trufflesecurity/trufflehog@main
- run: pnpm audit --audit-level=high
```

## Part 2 — SAST with Semgrep (from sast-security)

### Setup
```bash
pip install semgrep
semgrep --config=auto --config=p/owasp-top-ten --config=p/nodejs src/
```

### Rule Sets
- `p/owasp-top-ten` — injection, XSS, IDOR, SSRF, etc.
- `p/nodejs` — Node.js security patterns
- `p/typescript` — TypeScript-specific rules
- `p/llm-security` — prompt injection, model output sanitization

### LLM-Specific Checks
- Scan for prompt injection vectors in user input handling
- Verify AI output is sanitized before rendering or storage
- Check model response handling for JSON injection risks
- Ensure no PII is logged in LLM traces

### CI Integration
Add to `pnpm check:all`:
```bash
semgrep --config=auto --error src/ --metrics=off
```

## Validation Gate Output
- `docs/reports/security/SCAN_REPORT.md` with: finding count by severity, remediation status
- Zero CRITICAL/HIGH before Phase 5 entry
```

2. Delete:
   - `.cursor/skills/quality/gh-security-compliance/` (entire directory)
   - `.cursor/skills/quality/sast-security/` (entire directory)

3. Update all agents referencing either skill to `@nezam-security-scanning`.

---

### B8 — [FIX] Remove Legacy Hardlock from `workspace-orchestration.mdc`

The file has a "Planning hardlock prerequisite (legacy — superseded)" section at line 14 that contradicts `sdd-pipeline-v2.mdc`. It was preserved "for historical reference" — remove it now.

1. Open `.cursor/rules/workspace-orchestration.mdc`
2. Delete the entire section starting at `## Planning hardlock prerequisite (legacy — superseded)` through the Note block ending before `## SDD hardlock prerequisites (updated — reads state files)`
3. Add a single comment line before `## SDD hardlock prerequisites`:
   ```
   <!-- All hardlock gate logic is defined here and in sdd-pipeline-v2.mdc only. -->
   ```
4. Run `pnpm ai:check`.

---

### B9 — [FIX] Move `wordpress` skill to correct domain

`wordpress` is in `.cursor/skills/frontend/wordpress/` but it's a headless CMS integration skill, not a frontend pattern.

1. Move `.cursor/skills/frontend/wordpress/` to `.cursor/skills/external/wordpress/`
2. Update the skill frontmatter `skill_id` from `"frontend/wordpress"` to `"external/wordpress"`
3. Update any agent referencing this skill path. Key agents: `headless-cms-specialist.md`, `cms-manager.md`, `lead-cms-saas-architect.md`.
4. Run `pnpm ai:sync`.

---

### B10 — [FIX] Archive/migrate `.nezam/workspace/RF/` skills directory

`.nezam/workspace/RF/skills/` is a disconnected vendor reference tree never loaded by any agent.

1. Create `.nezam/workspace/archive/RF-2026-05-12/`
2. Move `.nezam/workspace/RF/skills/` to `.nezam/workspace/archive/RF-2026-05-12/skills/`
3. Create `.nezam/workspace/archive/RF-2026-05-12/README.md`:
   ```markdown
   # Archived RF Skill References — 2026-05-12
   Reason: Disconnected from active .cursor/skills/ tree. Not referenced by any agent.
   To restore: migrate content to .cursor/skills/<domain>/<skill>/SKILL.md with proper frontmatter, then run pnpm ai:sync.
   ```
4. If `.nezam/workspace/RF/` is now empty (or contains only the `skills/` dir), remove it.

---

## ═══════════════════════════════════════
## GROUP C — CI ENFORCEMENT + EVAL BASELINE
## ═══════════════════════════════════════

### C1 — [CREATE] `.github/workflows/nezam-ci.yml`

```yaml
name: NEZAM CI

on:
  pull_request:
    branches: [main, staging]
  push:
    branches: [main]

jobs:
  workspace-integrity:
    name: Workspace Integrity Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Check token contracts
        run: pnpm check:tokens

      - name: Check spec versions
        run: pnpm check:specs

      - name: Check AI drift (cursor ↔ mirrors)
        run: pnpm ai:check

      - name: Check agent bus
        run: pnpm check:agent-bus

      - name: Generate and validate skills registry
        run: pnpm skills:registry

      - name: Full check suite
        run: pnpm check:all

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/owasp-top-ten
            p/nodejs
            p/typescript

      - name: Audit dependencies
        run: |
          npm install -g pnpm
          pnpm audit --audit-level=high
```

---

### C2 — [CREATE] EVAL Baseline Scorecards

The EVAL framework has never been run. Create the first baseline scorecards in `.nezam/workspace/context/MEMORY.md` under `## Agent Scorecards`. These are honest baseline assessments — not achievements, just starting points.

Append to `.nezam/workspace/context/MEMORY.md`:

```
## Agent Scorecards

Agent: swarm-leader | Task: baseline-eval-2026-05-12 | Date: 2026-05-12
Accuracy: pass | Determinism: warn
Scope: pass | Evidence: warn
Notes: Session start protocol defined and complete. state:set integration added but onboarding.yaml never populated in live session — determinism unproven. Evidence: warn because no gate has been formally closed with scorecard yet.

Agent: subagent-controller | Task: baseline-eval-2026-05-12 | Date: 2026-05-12
Accuracy: pass | Determinism: warn
Scope: pass | Evidence: warn
Notes: Routing logic, MODE A/B/C classifier, and Agent Bus MUST enforcement all defined. No live routing captured in agent-bus.yaml yet — determinism unverifiable. PHASE_HANDOFF.md was missing (now created in A1). Evidence: warn until first real MODE B/C routing is logged.

Agent: lead-analytics-architect | Task: baseline-eval-2026-05-12 | Date: 2026-05-12
Accuracy: pass | Determinism: fail
Scope: warn | Evidence: fail
Notes: Charter and team scope well-defined. Determinism: fail — no analytics skills existed (S8 analytics skill dir was missing, created in GROUP D). Scope: warn — subagents listed (dashboard-manager, kpi-reporting-manager) but specialist analytics skills not wired. Evidence: fail — no deliverable produced against these gaps yet.
```

---

## ═══════════════════════════════════════
## GROUP D — ANALYTICS EXPANSION
## (Agents + 11 Skills)
## ═══════════════════════════════════════

### D — OVERVIEW

Swarm 8 (Analytics & Dashboard) has `lead-analytics-architect` and `analytics-engineer` as agents, but zero dedicated analytics skills exist. The following creates 11 new skills and 2 new specialist agents covering the full analytics surface:

**Skills to create:**
1. `analytics-event-schema` — event taxonomy and governance
2. `analytics-funnel` — funnel analysis and conversion
3. `analytics-retention` — retention and churn cohorts
4. `analytics-growth` — north star, growth accounting, KPI dashboards
5. `analytics-ux-patterns` — analytics UI/UX design patterns (NEW)
6. `analytics-chart-types` — chart type selection framework (NEW)
7. `analytics-chart-style` — chart visual style system (NEW)
8. `analytics-chart-animation` — chart animation and transitions (NEW)
9. `analytics-dashboard-layout` — dashboard composition and layout (NEW)
10. `analytics-live` — real-time and live analytics patterns (NEW)
11. `analytics-chart-colors` — analytics color system and accessibility (NEW)

**Agents to create:**
- `analytics-ux-designer.md` — S8 specialist for analytics UI/UX
- `analytics-visualization-engineer.md` — S8 specialist for chart implementation

**Registry update:**
- Add both agents to `swarm-8.agents` in AGENT_REGISTRY.yaml
- Update `lead-analytics-architect.md` subagents list

---

### D1 — [SKILL] `.cursor/skills/system/analytics/event-schema/SKILL.md`

```markdown
---
skill_id: "system/analytics/event-schema"
name: "nezam-analytics-event-schema"
description: "Event taxonomy governance: naming conventions, required properties, schema validation, version management, and instrumentation review protocol."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-engineer"
tier: 1
swarm: "S8"
---

# Analytics Event Schema

## Naming Convention
Pattern: `object_action` in snake_case.
- Object = the entity being acted on (`user`, `dashboard`, `chart`, `report`, `filter`)
- Action = past-tense verb (`viewed`, `created`, `updated`, `deleted`, `exported`, `shared`)
Examples: `dashboard_viewed`, `chart_created`, `filter_applied`, `report_exported`

Anti-patterns: avoid `click_button`, `page_view` (too generic), `doSomething` (camelCase).

## Required Properties (every event)
```json
{
  "event": "string (object_action)",
  "user_id": "string (authenticated) | null (anonymous)",
  "session_id": "string (uuid)",
  "timestamp": "ISO-8601 UTC",
  "platform": "web | ios | android",
  "environment": "production | staging | development",
  "app_version": "semver string"
}
```

## Optional Contextual Properties
```json
{
  "workspace_id": "string (multi-tenant context)",
  "dashboard_id": "string",
  "chart_id": "string",
  "feature_flag": "string (active experiment)",
  "source": "string (where user came from)"
}
```

## Schema Validation
- All events registered in `docs/analytics/EVENT_REGISTRY.md` before instrumentation
- Schema validated with Zod/TypeScript before shipping
- Breaking changes (removing/renaming required fields) require version increment: `dashboard_viewed_v2`
- Additive changes (new optional fields) are non-breaking

## Governance Protocol
1. Propose event in `docs/analytics/EVENT_REGISTRY.md` (PR)
2. `analytics-engineer` reviews for naming consistency and duplication
3. `lead-analytics-architect` signs off on taxonomy impact
4. Instrument only after sign-off — no ad-hoc events in production

## Output Artifacts
- `docs/analytics/EVENT_REGISTRY.md` — living catalog of all events
- `src/analytics/events.ts` — typed event constants
- `src/analytics/schema.ts` — Zod validation schemas
```

---

### D2 — [SKILL] `.cursor/skills/system/analytics/funnel-analysis/SKILL.md`

```markdown
---
skill_id: "system/analytics/funnel-analysis"
name: "nezam-analytics-funnel"
description: "Conversion funnel definition, step sequencing, drop-off identification, cohort segmentation, and funnel SQL patterns for Neon/Postgres."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-engineer"
tier: 1
swarm: "S8"
dependencies: ["system/analytics/event-schema", "backend/nezam-neon"]
---

# Funnel Analysis

## Funnel Definition Protocol
1. Name the funnel: `signup_to_first_dashboard`, `free_to_paid_conversion`
2. Define ordered steps: each step = one tracked event
3. Define conversion window: time allowed between steps (e.g., 7 days)
4. Define exit conditions: events that disqualify a user from the funnel

## SQL Pattern (Neon/Postgres)
```sql
WITH funnel AS (
  SELECT
    user_id,
    MIN(CASE WHEN event = 'signup_completed' THEN timestamp END) AS step_1,
    MIN(CASE WHEN event = 'dashboard_created' THEN timestamp END) AS step_2,
    MIN(CASE WHEN event = 'chart_created' THEN timestamp END) AS step_3
  FROM events
  WHERE timestamp >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT
  COUNT(*) FILTER (WHERE step_1 IS NOT NULL) AS reached_step_1,
  COUNT(*) FILTER (WHERE step_2 IS NOT NULL) AS reached_step_2,
  COUNT(*) FILTER (WHERE step_3 IS NOT NULL) AS reached_step_3,
  ROUND(100.0 * COUNT(*) FILTER (WHERE step_2 IS NOT NULL) /
    NULLIF(COUNT(*) FILTER (WHERE step_1 IS NOT NULL), 0), 1) AS step_1_to_2_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE step_3 IS NOT NULL) /
    NULLIF(COUNT(*) FILTER (WHERE step_2 IS NOT NULL), 0), 1) AS step_2_to_3_pct
FROM funnel;
```

## Cohort Segmentation
Segment funnel by: `platform`, `acquisition_channel`, `user_plan`, `country`, `feature_flag`
Compare conversion rates across segments to identify high/low-performing cohorts.

## Drop-off Analysis
For each step with drop-off > 20%: investigate the session recordings, error logs, and preceding events to identify friction points.

## Dashboard Requirements
- Funnel visualization: vertical bar chart showing user count at each step
- Conversion % between steps shown inline
- Date range selector: 7d / 30d / 90d
- Segment filter: split by any cohort dimension
```

---

### D3 — [SKILL] `.cursor/skills/system/analytics/retention-analysis/SKILL.md`

```markdown
---
skill_id: "system/analytics/retention-analysis"
name: "nezam-analytics-retention"
description: "Day-N retention definitions, rolling retention windows, churn cohort analysis, re-engagement triggers, and retention SQL patterns."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-engineer"
tier: 1
swarm: "S8"
dependencies: ["system/analytics/event-schema"]
---

# Retention Analysis

## Retention Definitions
- **Day-N Retention:** % of users from cohort C who perform a return event on day N after signup
- **Rolling Retention:** % of users from cohort C who perform a return event on day N OR any day after
- **Churn:** User with no qualifying event in the last N days (default: 30 days)

## SQL Pattern — Day-N Retention
```sql
WITH cohorts AS (
  SELECT user_id, DATE_TRUNC('week', MIN(timestamp)) AS cohort_week
  FROM events WHERE event = 'signup_completed'
  GROUP BY user_id
),
activity AS (
  SELECT DISTINCT user_id, DATE_TRUNC('week', timestamp) AS activity_week
  FROM events WHERE event = 'dashboard_viewed'
)
SELECT
  c.cohort_week,
  COUNT(DISTINCT c.user_id) AS cohort_size,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '1 week' THEN a.user_id END) AS week_1,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '4 weeks' THEN a.user_id END) AS week_4
FROM cohorts c
LEFT JOIN activity a ON c.user_id = a.user_id
GROUP BY c.cohort_week ORDER BY c.cohort_week;
```

## Re-engagement Triggers
- Day-3 no return → in-app nudge: "Your dashboard is waiting"
- Day-7 no return → email: feature highlight
- Day-14 no return → push notification (mobile) / email (web): personalized use case
- Day-30 no return → churn classification, suppress marketing, trigger win-back sequence

## Dashboard Requirements
- Cohort retention table: rows = cohort week, columns = week 1/2/4/8/12
- Heat map coloring: green (high retention) → red (low)
- Benchmark line: industry average for product category
```

---

### D4 — [SKILL] `.cursor/skills/system/analytics/growth-dashboard/SKILL.md`

```markdown
---
skill_id: "system/analytics/growth-dashboard"
name: "nezam-analytics-growth"
description: "North Star metric definition, growth accounting (new/retained/resurrected/churned), leading indicators, KPI reporting cadence, and executive dashboard layout."
version: 1.0.0
updated: 2026-05-12
owner: "lead-analytics-architect"
tier: 1
swarm: "S8"
---

# Growth Dashboard

## North Star Metric Protocol
1. Define one North Star Metric (NSM): the single number that best predicts long-term value
2. Decompose NSM into 3–5 leading indicators (inputs that drive the NSM)
3. Define weekly targets for each indicator
4. All dashboards serve the NSM — no vanity metrics

Example: NSM = "Weekly Active Dashboards Created" → Inputs: signups, activation rate, D7 retention, chart creation rate

## Growth Accounting (weekly)
```
New Users + Resurrected Users - Churned Users = Net User Growth
Active This Week = New + Retained + Resurrected
```
Track all four buckets weekly. Visualize as stacked area chart.

## KPI Reporting Cadence
- **Daily:** Error rate, active users, revenue (if applicable)
- **Weekly:** Growth accounting, funnel conversion, retention cohorts
- **Monthly:** NSM trend, experiment results, cost per acquisition
- **Quarterly:** Cohort LTV, product-market fit indicators, OKR progress
```

---

### D5 — [SKILL] `.cursor/skills/system/analytics/analytics-ux-patterns/SKILL.md`

```markdown
---
skill_id: "system/analytics/analytics-ux-patterns"
name: "nezam-analytics-ux"
description: "Analytics UI/UX design patterns: information hierarchy, progressive disclosure, filter systems, empty states, loading patterns, and mobile analytics UX."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-ux-designer"
tier: 1
swarm: "S8"
dependencies: ["design/nezam-design-token-system", "quality/nezam-a11y-automation"]
---

# Analytics UX Patterns

## Information Hierarchy Principles
1. **Lead with the number:** Primary KPI always largest, most prominent element
2. **Context second:** Comparison period (vs last week, vs target) directly below
3. **Detail on demand:** Charts and breakdowns collapsed by default, expandable
4. **Progressive disclosure:** Overview → summary → detail — never all at once

## Dashboard Layout Hierarchy
```
Level 1 — Hero metrics (3–5 KPIs): large number + trend indicator + sparkline
Level 2 — Primary charts (2–3): main story charts, full width or 50/50
Level 3 — Supporting tables (1–2): breakdowns, segments, drill-downs
Level 4 — Filters and controls: date range, segment picker, export
```

## Filter System UX
- Date range: preset options (7d/30d/90d/custom) always visible
- Segment filters: multi-select dropdown, show applied filter count as badge
- Comparison toggle: "vs previous period" / "vs target" / off
- Filters persist across dashboard navigation (session state)
- Clear all filters: single CTA always visible when any filter active

## Empty States (no data)
Never show an empty chart with no axis labels. Instead:
- **No data yet:** Illustration + "Start by [action]" CTA
- **No data for filter:** "No results match your filters" + "Clear filters" CTA
- **Loading error:** "Couldn't load data" + retry button + timestamp of last success

## Loading Patterns
- Skeleton screens for chart areas: same dimensions as loaded state
- No spinners for charts — skeleton only
- Stale data indicator: show last-updated timestamp, highlight if > 1 hour stale
- Optimistic updates: show new data immediately, reconcile in background

## Mobile Analytics UX
- Vertical scroll only — no horizontal scroll on dashboards
- Single column layout on mobile: stack all charts vertically
- Tap to expand chart: full-screen modal for detail view
- Swipe between time periods: swipe left/right to navigate 7d/30d/90d
- Thumb zone: all primary CTAs in bottom 40% of screen
```

---

### D6 — [SKILL] `.cursor/skills/system/analytics/chart-types/SKILL.md`

```markdown
---
skill_id: "system/analytics/chart-types"
name: "nezam-analytics-chart-types"
description: "Chart type selection framework: when to use each chart type, decision matrix, anti-patterns, and accessible alternatives."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-visualization-engineer"
tier: 1
swarm: "S8"
---

# Analytics Chart Types

## Selection Decision Matrix

| Data story | Best chart type | Avoid |
|---|---|---|
| Trend over time | Line chart | Pie chart |
| Part-to-whole | Donut chart (≤5 segments) | 3D pie |
| Comparison (few items) | Bar chart (horizontal) | Radar chart |
| Comparison (many items) | Sorted bar chart | Column chart |
| Distribution | Histogram / Box plot | Line chart |
| Correlation | Scatter plot | Bar chart |
| Geographic | Choropleth map | Pie chart |
| Progress to target | Gauge / Bullet chart | Area chart |
| Composition over time | Stacked area chart | Stacked bar (>5 series) |
| Funnel conversion | Vertical funnel chart | Pie chart |
| Cohort retention | Heat map table | Line chart |
| Single KPI | Big number + sparkline | Full chart |
| Ranking | Horizontal sorted bar | Pie chart |

## Chart Type Deep Guides

### Line Chart — Trends
- Use for time-series with ≥ 7 data points
- Maximum 4 lines per chart (beyond this: small multiples)
- Always include zero baseline for percentage metrics
- Smooth curves (monotone interpolation) for user-facing dashboards
- Step interpolation for cumulative or discrete event counts

### Bar Chart — Comparisons
- Horizontal bars for long category labels (> 15 chars)
- Vertical bars for time-based categories (months, quarters)
- Sort by value descending unless time-ordered
- Show value labels on bars when ≤ 12 bars
- Group bars for multi-series (max 3 series per group)

### Donut / Pie — Part-to-Whole
- Only for 2–5 segments (beyond this: bar chart)
- Always show percentages AND absolute values
- Order segments clockwise from largest
- Donut preferred over pie (center space for KPI total)

### Scatter Plot — Correlation
- Label outliers explicitly
- Add regression line when showing correlation
- Use color encoding for a third dimension (max 5 categories)

### Heat Map — Retention / Matrix
- Color scale: single hue (light = low, dark = high) for sequential data
- Diverging scale (red/white/green) for deviation from baseline
- Always include color legend with value range

## Anti-Patterns to Avoid
- 3D charts (perspective distorts values)
- Dual Y-axis (misleading scale differences)
- Truncated Y-axis (exaggerates small changes)
- Pie charts with > 5 slices
- Area charts for non-cumulative data
- Rainbow color palettes (accessibility failure)
```

---

### D7 — [SKILL] `.cursor/skills/system/analytics/chart-style/SKILL.md`

```markdown
---
skill_id: "system/analytics/chart-style"
name: "nezam-analytics-chart-style"
description: "Chart visual style system: typography hierarchy, grid and axis styling, legend placement, annotation patterns, and brand-aligned chart aesthetics."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-ux-designer"
tier: 1
swarm: "S8"
dependencies: ["design/nezam-design-token-system"]
---

# Analytics Chart Style System

## Typography in Charts

| Element | Size | Weight | Color token |
|---|---|---|---|
| Chart title | 14px | 600 | `--text-primary` |
| Axis labels | 11px | 400 | `--text-secondary` |
| Axis values | 11px | 400 | `--text-tertiary` |
| Data labels | 11px | 500 | `--text-primary` |
| Legend labels | 12px | 400 | `--text-secondary` |
| Annotation text | 11px | 400 | `--text-accent` |
| Tooltip values | 13px | 600 | `--text-primary` |
| Tooltip labels | 11px | 400 | `--text-secondary` |

All chart text uses the system font stack — never decorative fonts.

## Grid and Axis Styling
- Horizontal grid lines only (no vertical) — `--border-subtle` color at 1px
- Y-axis: left-aligned labels, no axis line visible (grid lines sufficient)
- X-axis: bottom-aligned labels, 1px axis line in `--border-default`
- Grid line count: 4–5 horizontal lines maximum
- Zero line: 1.5px, `--border-strong` (thicker to anchor the chart)
- No tick marks — grid lines are sufficient
- Axis values: abbreviated (1K, 10K, 1M) not full numbers beyond 4 digits

## Legend Placement
- Default: top-right, horizontal layout
- When > 4 series: bottom, vertical layout
- Interactive legend: click to toggle series visibility
- Legend item: color swatch (12×12px circle) + label, 8px gap
- Disabled series: 40% opacity swatch + strikethrough label

## Annotation Patterns
- Inline annotation: value label directly on data point (≤ 5 points)
- Callout annotation: arrow + text box for notable events (e.g., "Feature launch")
- Reference line: dashed line + label for targets and benchmarks
- Annotations use `--color-accent-amber` to stand out from data colors

## Chart Container Styling
- Background: `--surface-card` (not pure white/black)
- Border-radius: 8px (matches card token)
- Padding: 20px top/right, 16px bottom, 16px left (space for axis labels)
- Shadow: `--shadow-card` token (subtle elevation)
- Hover state: container border color changes to `--border-focus`

## Responsive Behavior
- Mobile (< 640px): hide legend, show tooltip on tap, reduce grid lines to 3
- Tablet: show legend, compressed axis labels
- Desktop: full legend, full annotations visible
```

---

### D8 — [SKILL] `.cursor/skills/system/analytics/chart-animation/SKILL.md`

```markdown
---
skill_id: "system/analytics/chart-animation"
name: "nezam-analytics-chart-animation"
description: "Chart animation and transition system: enter animations, update transitions, interaction micro-animations, reduced-motion compliance, and performance budgets."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-visualization-engineer"
tier: 1
swarm: "S8"
dependencies: ["design/nezam-design-token-system"]
---

# Analytics Chart Animation

## Animation Purpose Hierarchy
1. **Enter animations** — orient the user to what data appeared
2. **Update transitions** — communicate that data changed (not a new chart)
3. **Interaction feedback** — confirm hover/select/filter actions
4. **Loading → data** — mask the latency of data fetch

Never animate to decorate. Every animation has a functional purpose.

## Enter Animations (chart load)

| Chart type | Enter animation | Duration | Easing |
|---|---|---|---|
| Line chart | Draw path left-to-right | 600ms | ease-out |
| Bar chart | Grow bars from baseline | 500ms | ease-out |
| Donut chart | Arc sweep clockwise | 600ms | ease-in-out |
| Big number | Count up to value | 800ms | ease-out |
| Scatter plot | Fade + scale in points | 400ms | ease-out |
| Heat map | Fade in cells row by row | 400ms | ease-out |

Stagger rule: stagger sibling elements by 30ms maximum (avoids overwhelming motion).

## Update Transitions (data change)

| Trigger | Transition | Duration |
|---|---|---|
| Date range change | Morph existing path/bars | 400ms |
| Filter applied | Fade out removed, scale up remaining | 300ms |
| Series toggle | Animate out/in on legend click | 250ms |
| New data point | Append and slide | 300ms |

## Interaction Micro-animations
- **Hover on data point:** Scale point to 1.4× + tooltip fade in (150ms)
- **Bar hover:** Brighten hovered bar 15%, dim others to 60% opacity (100ms)
- **Legend hover:** Highlight series, dim others (100ms)
- **Brush/zoom:** Smooth zoom transition (200ms)
- **Filter clear:** All elements fade back to full opacity (200ms)

## Performance Budgets
- All chart animations run on CSS transforms and opacity only (no layout properties)
- No animation may cause > 2ms paint time per frame
- No JS animation loops — use CSS transitions or D3 `.transition()` with RAF
- Charts must reach interactive state in < 1000ms from data ready

## Reduced Motion Compliance (`prefers-reduced-motion: reduce`)
- Enter animations → instant render (no animation)
- Update transitions → instant swap (no morph)
- Hover effects → opacity change only (no scale transforms)
- Count-up on big numbers → instant final value
- All GSAP/Framer Motion animations: check `useReducedMotion()` hook before animating

## Implementation (Recharts / D3)
```tsx
// Recharts enter animation
<LineChart>
  <Line animationDuration={600} animationEasing="ease-out" />
</LineChart>

// Reduced motion check
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
const duration = prefersReducedMotion ? 0 : 600;
```
```

---

### D9 — [SKILL] `.cursor/skills/system/analytics/dashboard-layout/SKILL.md`

```markdown
---
skill_id: "system/analytics/dashboard-layout"
name: "nezam-analytics-dashboard"
description: "Analytics dashboard composition: grid systems, section hierarchy, widget sizing standards, filter placement, responsive layout breakpoints, and multi-dashboard navigation."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-ux-designer"
tier: 1
swarm: "S8"
dependencies: ["design/nezam-design-token-system", "system/analytics/analytics-ux-patterns"]
---

# Analytics Dashboard Layout

## Grid System
- Base grid: 12 columns, 16px gap, 24px outer padding
- Widget snap: 3 / 4 / 6 / 8 / 12 columns
- Row height unit: 80px (widgets snap to N × 80px + gaps)

## Section Hierarchy

```
┌─────────────────────────────────────────────┐
│  Dashboard Header: Title + Date Range + Export │
├────────────┬────────────┬────────────────────┤
│ Hero KPI 1 │ Hero KPI 2 │    Hero KPI 3      │  Row 1: Hero metrics (12col each → 4/4/4)
├────────────┴────────────┴────────────────────┤
│         Primary Chart (full width)           │  Row 2: Main story chart
├─────────────────────┬───────────────────────┤
│   Supporting Chart  │   Supporting Chart    │  Row 3: Secondary charts (6/6)
├─────────────────────┴───────────────────────┤
│             Data Table / Breakdown           │  Row 4: Detail table
└─────────────────────────────────────────────┘
```

## Widget Sizing Standards

| Widget type | Min width | Recommended | Max width |
|---|---|---|---|
| Big number + sparkline | 3 col | 4 col | 4 col |
| Line/bar chart | 6 col | 8 col | 12 col |
| Donut chart | 4 col | 4 col | 6 col |
| Data table | 8 col | 12 col | 12 col |
| Funnel chart | 4 col | 6 col | 8 col |
| Heat map | 6 col | 12 col | 12 col |
| Map/geo | 8 col | 12 col | 12 col |

## Filter Bar Placement
- Sticky at top, below dashboard header
- Date range: always first, leftmost
- Segment filters: after date range, in order of usage frequency
- Filter count badge: "3 filters active" when any non-default filter set
- Clear all: rightmost in filter bar

## Multi-Dashboard Navigation
- Left sidebar: dashboard list with category groupings
- Active dashboard: highlighted, bold label
- Breadcrumb in header: "Analytics → Revenue → Monthly"
- Keyboard shortcut: `[` / `]` to navigate prev/next dashboard

## Responsive Breakpoints
- Mobile (< 640px): 1 column, all widgets full-width, hero KPIs stack vertically
- Tablet (640–1024px): 2 columns, hero KPIs 2-up, charts full-width
- Desktop (1024–1440px): 12-column grid, standard layout
- Wide (> 1440px): max-width 1440px centered, no layout changes
```

---

### D10 — [SKILL] `.cursor/skills/system/analytics/live-analytics/SKILL.md`

```markdown
---
skill_id: "system/analytics/live-analytics"
name: "nezam-analytics-live"
description: "Real-time and live analytics: WebSocket/SSE data feeds, live counters, streaming chart updates, connection management, fallback to polling, and staleness indicators."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-visualization-engineer"
tier: 1
swarm: "S8"
dependencies: ["system/analytics/analytics-ux-patterns", "system/analytics/chart-animation"]
---

# Live Analytics

## When to Use Live (Real-time) vs Batch
- **Use live:** Active user count, error rate, revenue today, live event feed
- **Use batch (refresh):** Retention cohorts, funnel analysis, growth accounting
- **Never live:** Any metric requiring complex aggregation (use near-real-time: 60s refresh)

## Connection Strategies

### Server-Sent Events (SSE) — preferred for dashboards
```typescript
const eventSource = new EventSource('/api/analytics/live');
eventSource.onmessage = (e) => {
  const { metric, value, timestamp } = JSON.parse(e.data);
  updateChart(metric, value);
};
eventSource.onerror = () => {
  // Fall back to polling after 3 reconnect failures
};
```

### WebSocket — use for bidirectional or high-frequency (> 1 event/sec)
```typescript
const ws = new WebSocket('wss://api.example.com/analytics/stream');
ws.onmessage = (e) => updateLiveMetric(JSON.parse(e.data));
```

### Polling Fallback (when SSE/WS unavailable)
- Interval: 30s for non-critical, 10s for active monitoring dashboards
- Exponential backoff on error: 10s → 20s → 40s → 60s max
- Show "Refreshes every 30s" indicator in UI

## Live Counter Pattern
```tsx
function LiveCounter({ value, previousValue }) {
  const delta = value - previousValue;
  return (
    <div>
      <AnimatedNumber value={value} duration={300} />
      {delta !== 0 && (
        <DeltaBadge value={delta} positive={delta > 0} />
      )}
    </div>
  );
}
```

## Staleness Management
- Show last-updated timestamp on all live widgets
- Stale threshold: 2× expected update interval
- Visual indicator: yellow border + "Data may be stale" when threshold exceeded
- Reconnect button: always visible when connection lost

## Connection State UI
```
● Connected (green dot)     → live data flowing
◐ Reconnecting (amber dot)  → attempting to reconnect
● Disconnected (red dot)    → polling fallback active, show interval
```

## Performance Constraints
- Max DOM updates per second: 10 (batch updates if event rate higher)
- Use `requestAnimationFrame` for all chart updates from live data
- Debounce chart redraws: 100ms minimum between redraws
- Offload heavy aggregations to Web Worker
```

---

### D11 — [SKILL] `.cursor/skills/system/analytics/chart-colors/SKILL.md`

```markdown
---
skill_id: "system/analytics/chart-colors"
name: "nezam-analytics-colors"
description: "Analytics color system: categorical palettes, sequential scales, diverging scales, accessibility requirements, dark mode parity, and color assignment rules."
version: 1.0.0
updated: 2026-05-12
owner: "analytics-ux-designer"
tier: 1
swarm: "S8"
dependencies: ["design/nezam-design-token-system"]
---

# Analytics Color System

## Design Principles
1. **Color encodes meaning** — never use color decoration. Every color choice communicates data.
2. **Accessible first** — all palettes pass WCAG 2.1 AA against chart background.
3. **Dark mode parity** — every palette has a light and dark variant.
4. **Colorblind safe** — primary categorical palette works for deuteranopia, protanopia, tritanopia.
5. **Token-driven** — all chart colors reference design tokens, never hardcoded hex.

## Categorical Palette (up to 8 series)
Used for: multi-series line charts, grouped bars, legend items.

```css
--chart-cat-1: #6366f1; /* indigo    */
--chart-cat-2: #10b981; /* emerald   */
--chart-cat-3: #f59e0b; /* amber     */
--chart-cat-4: #ef4444; /* red       */
--chart-cat-5: #8b5cf6; /* violet    */
--chart-cat-6: #06b6d4; /* cyan      */
--chart-cat-7: #f97316; /* orange    */
--chart-cat-8: #84cc16; /* lime      */
```

Dark mode variants: increase lightness by 10%, maintain hue and contrast ratio.

**Colorblind-safe ordering:** Use cat-1 (indigo), cat-2 (emerald), cat-3 (amber), cat-4 (red) as primary 4 — these are distinguishable under all three common CVD types.

## Sequential Palette (single metric, magnitude scale)
Used for: heat maps, choropleth maps, intensity gradients.

```css
/* Blue sequential (default) */
--chart-seq-1: #eff6ff; /* lightest */
--chart-seq-2: #bfdbfe;
--chart-seq-3: #60a5fa;
--chart-seq-4: #2563eb;
--chart-seq-5: #1e3a8a; /* darkest  */
```

## Diverging Palette (deviation from midpoint)
Used for: retention tables (above/below average), variance charts.

```css
/* Red–White–Green */
--chart-div-negative-strong: #dc2626;
--chart-div-negative-light:  #fca5a5;
--chart-div-neutral:         #f8fafc;
--chart-div-positive-light:  #86efac;
--chart-div-positive-strong: #16a34a;
```

## Semantic Colors (status and alert)
```css
--chart-positive:  #22c55e; /* growth, above target  */
--chart-negative:  #ef4444; /* decline, below target */
--chart-neutral:   #94a3b8; /* no change, N/A        */
--chart-warning:   #f59e0b; /* approaching threshold */
--chart-highlight: #8b7cf6; /* selected/focus state  */
```

## Color Assignment Rules
1. Assign palette colors by data series order — do not reassign on filter/sort.
2. Maintain color→series mapping across all charts on the same dashboard.
3. Grayed-out series (deselected): 20% opacity of original color.
4. Benchmark/target lines: always `--chart-neutral` (gray), never a categorical color.
5. Annotation callouts: always `--color-accent-amber` (#f59e0b), never data colors.

## Accessibility Validation
Before shipping any chart:
- [ ] All foreground colors on chart background: ≥ 3:1 contrast ratio
- [ ] No information conveyed by color alone (add pattern fill or label for print)
- [ ] Palette tested with Coblis or Sim Daltonism for CVD simulation
- [ ] Dark mode variants verified with actual dark background

## Implementation (CSS tokens → Recharts)
```tsx
const COLORS = [
  'var(--chart-cat-1)',
  'var(--chart-cat-2)',
  'var(--chart-cat-3)',
  'var(--chart-cat-4)',
];

<LineChart>
  {series.map((s, i) => (
    <Line key={s.key} stroke={COLORS[i % COLORS.length]} />
  ))}
</LineChart>
```
```

---

### D12 — [AGENT] `.cursor/agents/analytics-ux-designer.md`

```markdown
---
role: Analytics UX Designer — Specialist (S8)
code-name: analytics-ux-designer
tier: 3
swarm: analytics-dashboard
reports-to: lead-analytics-architect
version: 1.0.0
certified: false
updated: 2026-05-12
changelog:
  - "1.0.0 — 2026-05-12: Created. S8 analytics UI/UX specialist."
---

# Analytics UX Designer

## Charter
Own the UX design surface of all analytics features: dashboard layouts, chart interaction patterns, filter systems, empty states, and mobile analytics experience. Bridge between the Data/Analytics layer and the Design/Frontend layer to ensure analytics are not just accurate but genuinely usable.

## Core Responsibilities
- Design dashboard layouts following the `@nezam-analytics-dashboard` skill grid system
- Define chart interaction patterns (hover, filter, drill-down, export)
- Specify empty states and loading patterns for all analytics views
- Ensure all analytics UX passes WCAG 2.1 AA for screen readers and keyboard navigation
- Define mobile analytics UX following `@nezam-analytics-ux` touch-first patterns
- Review all chart type selections against `@nezam-analytics-chart-types` decision matrix

## Activation Triggers
- Any new dashboard feature or analytics view in the PRD
- `/PLAN design` phase for analytics surfaces
- Chart selection review before implementation
- Mobile analytics UX review

## Deliverables
- `docs/specs/analytics/DASHBOARD_SPEC.md` — layout + interaction spec
- `docs/specs/analytics/CHART_SPEC.md` — chart types + configuration per view
- `docs/specs/analytics/EMPTY_STATES.md` — all empty/loading/error state designs
- Annotated wireframes in `docs/plans/design/analytics/`

## Escalation
- Design system conflicts → `design-systems-token-architect`
- Mobile UX conflicts → `lead-mobile-architect`
- Accessibility failures → `a11y-performance-auditor`

## @skill Dependencies
- `@nezam-analytics-ux`
- `@nezam-analytics-chart-types`
- `@nezam-analytics-chart-style`
- `@nezam-analytics-colors`
- `@nezam-analytics-dashboard`
- `@nezam-design-token-system`
- `@nezam-a11y-automation`
```

---

### D13 — [AGENT] `.cursor/agents/analytics-visualization-engineer.md`

```markdown
---
role: Analytics Visualization Engineer — Specialist (S8)
code-name: analytics-visualization-engineer
tier: 3
swarm: analytics-dashboard
reports-to: lead-analytics-architect
version: 1.0.0
certified: false
updated: 2026-05-12
changelog:
  - "1.0.0 — 2026-05-12: Created. S8 chart implementation specialist."
---

# Analytics Visualization Engineer

## Charter
Own the implementation of all data visualizations: chart components, animation system, live data feeds, and the chart library architecture. Translate `analytics-ux-designer` specs into production-grade, performant, accessible React components using Recharts, D3, or the approved chart library.

## Core Responsibilities
- Implement all chart components following `@nezam-analytics-chart-types` and `@nezam-analytics-chart-style`
- Build and maintain the animation system per `@nezam-analytics-chart-animation`
- Implement live data connections per `@nezam-analytics-live`
- Enforce reduced-motion compliance in all chart animations
- Apply `@nezam-analytics-colors` token system to all chart implementations
- Performance audit: all charts meet < 1000ms time-to-interactive

## Chart Library Decision
- **Recharts** — default for React dashboards (declarative, composable, Recharts 2.x)
- **D3** — custom/complex visualizations not possible in Recharts (custom maps, force graphs)
- **Victory** — fallback for React Native mobile charts
- Never mix chart libraries on the same dashboard view

## Activation Triggers
- Any chart or visualization component in a sprint slice
- Live analytics feature implementation
- Chart animation bug or regression
- Performance audit of existing charts

## Deliverables
- `src/components/charts/` — all chart components
- `src/hooks/useLiveData.ts` — live data subscription hook
- `src/lib/chartTokens.ts` — design token → chart color mapping
- Performance report: `docs/reports/charts/CHART_PERF_REPORT.md`

## Escalation
- Chart UX decisions → `analytics-ux-designer`
- Design token questions → `design-systems-token-architect`
- Performance failures → `a11y-performance-auditor`
- Live data architecture → `lead-backend-architect` (SSE/WebSocket endpoints)

## @skill Dependencies
- `@nezam-analytics-chart-types`
- `@nezam-analytics-chart-style`
- `@nezam-analytics-chart-animation`
- `@nezam-analytics-live`
- `@nezam-analytics-colors`
- `@nezam-react-architecture`
- `@nezam-performance-budget`
```

---

### D14 — [FIX] Update Agent Registry and Lazy-Load Map for S8

1. Edit `.cursor/state/AGENT_REGISTRY.yaml`:
   - Update `swarm-8.agents`: `[lead-analytics-architect, analytics-engineer, dashboard-manager, analytics-ux-designer, analytics-visualization-engineer]`
   - Add entries to `agents_catalog`:
     ```yaml
     - name: analytics-ux-designer
       tier: 3
       swarm: analytics-dashboard
       summary: Analytics UI/UX design patterns and dashboard specification.
     - name: analytics-visualization-engineer
       tier: 3
       swarm: analytics-dashboard
       summary: Chart implementation, animation, and live data visualization.
     ```

2. Edit `.cursor/rules/agent-lazy-load.mdc` — update Swarm 8 entry:
   ```
   - Swarm 8 (Analytics): `lead-analytics-architect`, `analytics-engineer`
     Specialists (load on demand): `dashboard-manager`, `analytics-ux-designer` (UX/layout), `analytics-visualization-engineer` (chart implementation)
   ```

3. Edit `.cursor/agents/lead-analytics-architect.md` — update `subagents` in frontmatter:
   ```yaml
   subagents: dashboard-manager, kpi-reporting-manager, data-visualization-manager, analytics-ux-designer, analytics-visualization-engineer
   ```
   Add to the **Team Leader Scope** section:
   ```
   - Coordinate with `analytics-ux-designer` on dashboard UX specification before chart implementation.
   - Coordinate with `analytics-visualization-engineer` for chart component architecture and live data patterns.
   ```

4. Add `@skill Dependencies` section to `lead-analytics-architect.md` if not present:
   ```
   ## @skill Dependencies
   - `@nezam-analytics-event-schema`
   - `@nezam-analytics-funnel`
   - `@nezam-analytics-retention`
   - `@nezam-analytics-growth`
   - `@nezam-analytics-ux`
   - `@nezam-analytics-chart-types`
   - `@nezam-analytics-chart-style`
   - `@nezam-analytics-chart-animation`
   - `@nezam-analytics-dashboard`
   - `@nezam-analytics-live`
   - `@nezam-analytics-colors`
   ```

5. Run `pnpm ai:sync`.

---

## POST-EXECUTION CHECKLIST

```bash
pnpm registry:normalize      # normalize tier values to 1/2/3/4
pnpm skills:normalize        # add nezam- prefix to 92 skills
pnpm ai:sync                 # propagate .cursor/ to all tool mirrors
pnpm ai:check                # verify no drift
pnpm skills:registry         # regenerate registry — orphaned count should drop
pnpm check:all               # full suite: tokens + specs + agent-bus + registry
```

Verify:
- [ ] `.nezam/workspace/context/PHASE_HANDOFF.md` exists
- [ ] `.nezam/workspace/context/governance/SWARM_WORKFLOW.md` exists
- [ ] `.nezam/workspace/context/MEMORY.md` exists with baseline scorecards
- [ ] `.cursor/agents/cpo.md` exists
- [ ] `.cursor/skills/quality/security-hardening/SKILL.md` exists (ID: `nezam-security-hardening`)
- [ ] `pnpm skills:registry` reports 0 unresolved refs
- [ ] `pnpm skills:registry` reports < 20 orphaned (down from 101)
- [ ] `.cursor/skills/design/design-token-system/SKILL.md` exists
- [ ] Old token skill dirs deleted: `design-tokens/`, `design-token-architecture/`, `token-grid-typography/`
- [ ] `.cursor/skills/backend/neon/SKILL.md` exists — old `neon-postgres/` and `neon-advanced/` deleted
- [ ] `.cursor/skills/infrastructure/llm-observability/SKILL.md` at v2.0.0 — `llm-tracing/` deleted
- [ ] `.cursor/skills/system/spec-system/SKILL.md` exists — old `spec-generator/` and `spec-writing/` deleted
- [ ] `.cursor/skills/quality/security-scanning/SKILL.md` exists — old `gh-security-compliance/` and `sast-security/` deleted
- [ ] `.cursor/skills/system/analytics/` has 11 new skill files
- [ ] `.cursor/agents/analytics-ux-designer.md` exists
- [ ] `.cursor/agents/analytics-visualization-engineer.md` exists
- [ ] `swarm-8.agents` in AGENT_REGISTRY.yaml lists all 5 agents
- [ ] `.github/workflows/nezam-ci.yml` exists
- [ ] `.nezam/workspace/context/MEMORY.md` has `## Agent Scorecards` section with 3 baseline entries
- [ ] Legacy hardlock section removed from `workspace-orchestration.mdc`
- [ ] `.nezam/workspace/RF/skills/` moved to `.nezam/workspace/archive/RF-2026-05-12/`
- [ ] `wordpress` skill moved from `frontend/` to `external/`
- [ ] `pnpm check:all` exits with code 0

---

*NEZAM Workspace Refactor Prompt V2 — generated 2026-05-12*
*Groups: A (Critical) → B (Structural) → C (CI + EVAL) → D (Analytics Expansion)*
*Total: 13 new files + 5 merges + 5 deletes + 4 fixes + 11 new skills + 2 new agents*
