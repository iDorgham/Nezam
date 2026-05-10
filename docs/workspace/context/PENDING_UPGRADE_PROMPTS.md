# NEZAM — Pending Upgrade Prompts (Execution Queue)
> **Single source of truth for what’s been run vs. what’s pending.**
> Full prompt text: [`MASTER_UPGRADE_PROMPTS.md`](MASTER_UPGRADE_PROMPTS.md)
> Granular task tracking: [`PENDING_UPGRADE_TASKS.md`](PENDING_UPGRADE_TASKS.md)
>
> **How to use:** Open MASTER_UPGRADE_PROMPTS.md in Cursor. Run prompts in order.
> After each completes ("DONE — [label]"), mark it ✅ below and run `pnpm ai:sync`.

---

## Pre-Execution Checklist
- [ ] Run `/SCAN agents` to capture baseline agent count
- [ ] Confirm git is clean: `git status`
- [ ] Confirm on correct branch: `git branch`

---

## QUEUE 1 — HIERARCHY_REDESIGN_PROMPTS.md (run FIRST)

| Status | # | What It Does |
|---|---|---|
| ❌ | 01 | CEO/CPO as lens-only — add activation frontmatter |
| ❌ | 02 | Archive 6 ethics sub-specialists into lead-ai-ethics-officer |
| ❌ | 03 | Archive knowledge-sharing-agent → absorb into knowledge-update-manager |
| ❌ | 04 | Archive data-engineer → absorb into data-pipeline-manager |
| ❌ | 05 | Archive react-component-lead → absorb into frontend-framework-manager |
| ❌ | 06 | Archive prototyping-design-system-manager → absorb into design-systems-token-architect |
| ❌ | 07 | Create spec-writer.md agent |
| ❌ | 08 | Create prompt-engineer.md agent |
| ❌ | 09 | Create client-onboarding-agent.md agent |
| ❌ | 10 | Update README + run pnpm ai:sync + ai:check |

---

## QUEUE 2 — MASTER_UPGRADE_PROMPTS.md Phase 1 (run SECOND)

| Status | # | What It Does |
|---|---|---|
| ❌ | 01 | Skills audit: merge 3, archive 3 |
| ❌ | 02 | Create 10 new tech stack skills (drizzle, neon, clerk, AI SDK, etc.) |
| ❌ | 03 | Wire developer-tech-stack-2026.md into agents + CONTEXT.md |
| ❌ | 04 | Upgrade memory layers v2 + Layer 0 capture protocol |
| ❌ | 05 | MCP governance: MCP_REGISTRY.md + mcp.json + MCP-first rule |
| ❌ | 06 | CLI orchestration system: skill + rule + multi-agent-handoff update |
| ❌ | 07 | Token optimization v2: per-tool strategies + TOKEN_AUDIT.md |
| ❌ | 08 | Final agent + skill alignment (wire all 10 new skills to agents) |
| ❌ | 09 | Full verification pass (10 checks) |
| ❌ | 10 | README + docs update (skills, agents, WORKSPACE_INDEX, MULTI_TOOL_INDEX) |

---

## QUEUE 3 — MASTER_UPGRADE_PROMPTS.md Phase 2 (run THIRD)

| Status | # | What It Does |
|---|---|---|
| ❌ | 11 | Wire workspace.settings.yaml into agent layer (orchestration.mdc, subagent-controller, swarm-leader) |
| ❌ | 12 | Settings-aware task tagging in /PLAN tasks (assigned_tool + fallback_tool per task) |
| ❌ | 13 | Graceful deactivation + reactivation protocol (quota, session failure, security protection) |
| ❌ | 14 | Register /Settings in help.md, CLAUDE.md, CONTEXT.md, WORKSPACE_INDEX.md |
| ❌ | 15 | End-to-end verification of tool routing system (11 checks) |

---

## QUEUE 4 — SWARM_FIX_PROMPTS.md (run LAST or parallel with Queue 3)

Recommended order within this queue: 07 → 01 → 03 → 05 → 02 → 04 → 06

| Status | # | What It Does |
|---|---|---|
| ❌ | 07 | Mode A/B/C task classifier before routing |
| ❌ | 01 | Fast-path routing in swarm-leader |
| ❌ | 03 | Agent tier audit (primary/support/specialist classification) |
| ❌ | 05 | Pre-commit auto-sync (drift check hook) |
| ❌ | 02 | PHASE_HANDOFF.md cross-agent context packet |
| ❌ | 04 | Rollback protocol for failed swarm runs |
| ❌ | 06 | Eval scorecard framework (Tier-1 agents) |

## ✅ DONE

_(Mark prompts here when complete — include date + any notes)_

---

## Source documents (crosswalk — status as of 2026-05-10)

| Source file | Purpose | Repo status (spot-check 2026-05-10) |
|-------------|---------|-------------------------------------|
| [`HIERARCHY_REDESIGN_PROMPTS.md`](HIERARCHY_REDESIGN_PROMPTS.md) | Agent hierarchy: strategic layer labels, ethics merge, archives, spec-writer / prompt-engineer / client-onboarding | **Done:** `.cursor/agents/archive/` has 10 files; `executive-director.md` has `activation: founder-lens-only`; `swarm-leader.md` has Strategic Layer Protocol; `lead-ai-ethics-officer.md` has Specialist Lenses; `README.md` lists new + archived agents; active agents include `spec-writer`, `prompt-engineer`, `client-onboarding-agent`. |
| [`NEZAM-V2-UPGRADE-PROMPT.md`](NEZAM-V2-UPGRADE-PROMPT.md) | Replace/sync `multi-tool-sync`, `/PLAN` v2 workshop, `/GUIDE` v2, `/FOUNDER`, scaffold + SDD rules | **Done (commands/rules):** `plan.md` includes Idea Workshop v2 + `/PLAN design wireframes`; `guide.md` matches v2 structure; `founder.md` has mode detection; workspace rules exist. **Optional:** Blocks 7–10 in that file are one-shot “paste to apply / diagnose / Codex start” reminders—use when onboarding a fresh clone or auditing. |
| [`CURSOR-PROMPT-SDD-V3.md`](CURSOR-PROMPT-SDD-V3.md) | Paste cards to load SDD v3 + type-specific `/PLAN` flows | **Reference only:** no repo mutation; paste when you want a fresh session to echo pipeline status. Not a backlog item. |
| [`CURSOR-PROMPT-DESIGN-WIREFRAMES.md`](CURSOR-PROMPT-DESIGN-WIREFRAMES.md) | `/PLAN design wireframes` invocation templates | **Wired:** `design-selector` + `wireframe-catalog` skills exist; `plan.md` lists `/PLAN design wireframes`. **Reference only:** use during design phase—not an unstarted upgrade. |
| [`MASTER_UPGRADE_PROMPTS.md`](MASTER_UPGRADE_PROMPTS.md) | Skills merge, 10 tech skills, tech-stack wiring, memory v2, MCP registry, CLI orchestration, token v2, alignment, verify | **Not started / partial** — evidence below |

---

## Evidence: Master Upgrade not yet executed

| Expected artifact / signal | Observed |
|-----------------------------|----------|
| `context-compressor` merged & archived | Still present at `.cursor/skills/system/context-compressor/` |
| `frontend-design-pro` archived | Still present |
| `design-system-builder` archived | Still present |
| New skills e.g. `backend/drizzle-orm/` | **Missing** (`glob` finds 0) |
| `docs/workspace/context/MCP_REGISTRY.md` | **Missing** |
| `.cursor/skills/system/cli-orchestration/` | **Missing** |
| `.cursor/rules/cli-orchestration.mdc` | **Missing** |
| `MEMORY.md` “NEZAM — Durable Project Memory” v2 template | Current file uses older shorter sections (“Decisions”) |
| `docs/reports/token-audit/TOKEN_AUDIT.md` | Not verified; created by PROMPT 07 |

---

## Optional reminders (no dedicated “prompt queue” unless you need them)

- **NEZAM-V2-UPGRADE-PROMPT.md** — Block 7 (orchestrate read + `pnpm ai:sync` / `pnpm ai:check` / `/START gates`), Blocks 8–10 (quick start, `/SCAN full`, Codex/Claude CLI intros) after any major rollback of `.cursor/`.
- **CURSOR-PROMPT-SDD-V3.md** — Paste the fenced ` ```prompt ` at top when onboarding a session on pipeline rules alone.

---

## PRIMARY BACKLOG — run in order (`MASTER_UPGRADE_PROMPTS.md` PROMPT 01–10)

The following subsection is **duplicated verbatim** from [`MASTER_UPGRADE_PROMPTS.md`](MASTER_UPGRADE_PROMPTS.md). When finished, trim this duplicate or keep that file as the single canonical playbook.

### Master Upgrade — Cursor Prompts (verbatim)

> 10 sequential prompts covering: Skills audit, Tech stack skills, Memory/Context, MCPs, Free CLI orchestration, Token optimization, and Final agent+skill alignment.
> Run in order. Each prompt ends with "DONE — [label]" before moving to the next.

---

## PROMPT 01 — Skills Audit: Merge, Archive, Consolidate

**Analysis:**
- `design/` has 13 skills — `design-system-builder` and `design-tokens` and `frontend-design-pro` overlap heavily
- `content/arabic-content` and `content/egyptian-arabic-content` duplicate dialect modules (egyptian.md exists in both)
- `frontend/` has only 1 skill (`react-architecture`) — severely under-built
- `system/context-window-manager` and `system/context-compressor` are the same job split across two files

```prompt
You are PM-01 (swarm-leader) + prompt-engineer. Execute a skills audit and consolidation pass.

CONTEXT:
- Skills live in `.cursor/skills/<category>/<name>/SKILL.md`
- All changes must be followed by `pnpm ai:sync`
- Do NOT delete any skill — archive to `.cursor/skills/archive/`

TASK — execute all steps:

### STEP 1 — Merge context-compressor into context-window-manager
1. Open `.cursor/skills/system/context-window-manager/SKILL.md`
2. Append all unique content from `context-compressor/SKILL.md` as a new section `## Compression Mode`
3. Move `.cursor/skills/system/context-compressor/` to `.cursor/skills/archive/system/context-compressor/`

### STEP 2 — Merge design-system-builder into design-tokens
Both cover token definition and design system assembly. `design-tokens` is more precisely named.
1. Open `.cursor/skills/design/design-tokens/SKILL.md`
2. Append unique "builder workflow" steps from `design-system-builder/SKILL.md` as `## System Build Mode`
3. Move `.cursor/skills/design/design-system-builder/` to `.cursor/skills/archive/design/design-system-builder/`

### STEP 3 — Merge frontend-design-pro into design-tokens
`frontend-design-pro` is a Cursor-native alias wrapping token + component patterns.
1. Open `.cursor/skills/design/design-tokens/SKILL.md`
2. Add a section `## Frontend Integration Mode` with the frontend-specific patterns from `frontend-design-pro/SKILL.md`
3. Update all agent files that reference `@nezam-frontend-design-pro` to point to `@nezam-design-tokens`
4. Move `.cursor/skills/design/frontend-design-pro/` to `.cursor/skills/archive/design/frontend-design-pro/`

### STEP 4 — Consolidate arabic-content duplicate Egyptian dialect
The `content/arabic-content/dialect_modules/egyptian.md` duplicates `content/egyptian-arabic-content/`.
1. In `content/arabic-content/SKILL.md`, replace the Egyptian dialect section with a reference: `See @nezam-egyptian-arabic-content skill for full Egyptian dialect implementation`
2. Remove `content/arabic-content/dialect_modules/egyptian.md` (the master is `egyptian-arabic-content`)
3. Keep both skill directories — they serve different activation scopes

### STEP 5 — Update skills README
Open `.cursor/skills/README.md` and update the counts table to reflect merges.

Run `pnpm ai:sync` after all steps.

OUTPUT: List of all changes made + "DONE — Skills audit complete"
```

---

## PROMPT 02 — New Skills from Tech Stack (Missing Coverage)

**Analysis from `developer-tech-stack-2026.md`:**
Critical gaps vs existing skills:
- **Neon** (serverless Postgres branching) — no skill, only Supabase covered
- **Drizzle ORM** — no skill, only Prisma covered
- **Trigger.dev / Inngest** — no background jobs skill
- **Vercel AI SDK** — no AI SDK skill, critical for LLM product building
- **Clerk** — no auth DX skill (Supabase auth covered but Clerk is primary for Next.js SaaS)
- **Sentry + PostHog** — error-tracking skill exists but no product analytics skill
- **Resend** — no transactional email skill
- **Typesense** — no search skill
- **OpenRouter** — no multi-model routing skill
- **Helicone/Langfuse** — no LLM observability skill

```prompt
You are PM-01 (swarm-leader) + lead-backend-architect. Create missing tech stack skills.
Reference: `docs/reference/developer-tech-stack-2026.md` for all service details and doc URLs.

For each skill, create a new directory and SKILL.md following this exact template:
---
name: <skill-name>
description: <one-line description>
version: 1.0.0
updated: 2026-05-10
changelog: []
---
# <Skill Title>
## Purpose
## Inputs Required
## Step-by-Step Workflow
## Validation Checks
## Output Format
## Integration Hooks (which agents use this)
## Anti-Patterns
## External References (official docs URL from tech stack)

CREATE these 10 skills:

### SKILL 1: `backend/drizzle-orm/SKILL.md`
- SQL-first ORM for TypeScript, Drizzle Kit migrations, works with Neon/Supabase/Postgres
- Integration hook: `lead-database-architect`, `data-pipeline-manager`
- Ref: https://orm.drizzle.team/docs/overview

### SKILL 2: `backend/neon-postgres/SKILL.md`
- Serverless Postgres with branching, preview DBs, scale-to-zero
- Integration hook: `lead-database-architect`, `devops-manager`
- Ref: https://neon.tech/docs

### SKILL 3: `backend/background-jobs/SKILL.md`
- Covers Trigger.dev + Inngest: durable workflows, retries, agentic async jobs
- Integration hook: `automation-manager`, `backend-lead`
- Ref: https://trigger.dev/docs + https://www.inngest.com/docs

### SKILL 4: `backend/vercel-ai-sdk/SKILL.md`
- Streaming, tool-calling, provider adapters for Claude/OpenAI/Gemini
- Integration hook: `lead-backend-architect`, `frontend-framework-manager`
- Ref: https://sdk.vercel.ai/docs

### SKILL 5: `backend/clerk-auth/SKILL.md`
- Hosted auth with React/Next.js components, B2B/org features, SSO-ready
- Integration hook: `auth-security-manager`, `frontend-framework-manager`
- Ref: https://clerk.com/docs

### SKILL 6: `backend/resend-email/SKILL.md`
- Transactional email API — auth emails, receipts, notifications
- Integration hook: `backend-lead`, `integration-specialist`
- Ref: https://resend.com/docs

### SKILL 7: `backend/typesense-search/SKILL.md`
- Typo-tolerant search engine with vector support for ecommerce/docs
- Integration hook: `search-cache-manager`, `backend-lead`
- Ref: https://typesense.org/docs/

### SKILL 8: `infrastructure/product-analytics/SKILL.md`
- PostHog: funnels, feature flags, session replay, LLM analytics
- Integration hook: `lead-analytics-architect`, `analytics-engineer`
- Ref: https://posthog.com/docs

### SKILL 9: `infrastructure/llm-observability/SKILL.md`
- Helicone + Langfuse: LLM tracing, cost debugging, prompt management, evals
- Integration hook: `observability-specialist`, `lead-ai-ethics-officer`
- Ref: https://docs.helicone.ai/ + https://langfuse.com/docs

### SKILL 10: `backend/openrouter/SKILL.md`
- Multi-model routing, provider fallbacks, cost-aware model selection
- Integration hook: `lead-backend-architect`, `prompt-engineer`
- Ref: https://openrouter.ai/docs

After creating all 10, run `pnpm ai:sync`.

OUTPUT: List of 10 new skill files created + "DONE — Tech stack skills created"
```

---

## PROMPT 03 — Add Tech Stack as Context Documentation

**Analysis:** The tech stack reference exists at `docs/reference/developer-tech-stack-2026.md` but is not referenced by any agent, skill, or rule. Agents making architecture decisions have no awareness of preferred services.

```prompt
You are lead-solution-architect + knowledge-update-manager. Wire the tech stack reference into workspace context.

TASK — do all steps:

### STEP 1 — Add to CONTEXT.md
Open `docs/workspace/context/CONTEXT.md`. In the "Core Paths" section, add:
```
- Tech stack reference: `docs/reference/developer-tech-stack-2026.md` — BaaS, AI, auth, payments, media, infra, observability catalog with CLI/MCP availability
```

### STEP 2 — Reference in lead-solution-architect
Open `.cursor/agents/lead-solution-architect.md`. Add to "Primary skills / lenses":
```
- Tech stack reference: `docs/reference/developer-tech-stack-2026.md` — consult before recommending any third-party service
```
Add rule: "Before recommending any BaaS, auth, payment, or infrastructure service, verify it is in the tech stack reference. If a required service is not listed, flag it for addition."

### STEP 3 — Reference in lead-backend-architect
Open `.cursor/agents/lead-backend-architect.md`. Add the same reference and rule.

### STEP 4 — Reference in subagent-controller
Open `.cursor/agents/subagent-controller.md`. In the "Required Inputs" section add:
```
- `tech_stack_constraints`: services that MUST come from `docs/reference/developer-tech-stack-2026.md` unless explicitly overridden by PRD
```

### STEP 5 — Add quarterly review note to tech stack file
Open `docs/reference/developer-tech-stack-2026.md`. Update the Maintenance section to add:
```
- **NEZAM policy:** Architecture agents must consult this file before recommending services. Run `pnpm ai:sync` after updating this file.
- **Review owner:** lead-solution-architect
- **Review trigger:** quarterly OR when a new service is adopted in production
```

Run `pnpm ai:sync`.

OUTPUT: Files changed + "DONE — Tech stack context wired"
```

---

## PROMPT 04 — Improve Memory Layers

**Analysis:** `MEMORY.md` is empty (no decisions logged). `CONTEXT.md` auto-snapshot is stale. `MEMORY_ARCHITECTURE.md` defines 4 layers but Layer 0 (session) has no capture protocol. The `PHASE_HANDOFF.md` we created has no connection to the memory layers.

```prompt
You are knowledge-update-manager + PM-01. Upgrade all memory layer files.

TASK — do all steps:

### STEP 1 — Upgrade MEMORY.md structure
Open `docs/workspace/context/MEMORY.md`. Replace the entire file with this upgraded structure:

```markdown
# NEZAM — Durable Project Memory
> Source of truth for decisions that must survive session resets.
> Update after every: phase gate, architecture decision, design lock, stack selection.

## Layer Reference
See `MEMORY_ARCHITECTURE.md` for the full 4-layer model.
See `PHASE_HANDOFF.md` for cross-agent context at phase boundaries.

## Active Stack Decisions
_(Append dated bullets when stack choices are locked)_
- Format: `[YYYY-MM-DD] <decision> — rationale: <why> — owner: <agent>`

## Locked Architecture Decisions
_(Append ADRs as one-liners; full ADR in docs/03_architecture/)_

## Locked Design Decisions
_(Typography scale, token names, breakpoints — anything agents must not override)_

## Accepted Tradeoffs
_(Document intentional compromises and their expiry conditions)_

## Naming Glossary
- `MT-ID`: master task identifier (format: `MT-###`)
- `PT-ID`: phase task identifier (format: `PT-<phase>-<subphase>-<seq>`)
- `Phase Gate`: final readiness control before phase transition

## Release Posture
_(Version trajectory when known)_

## Agent Scorecards (Tier-1 Eval)
_(Append after every Tier-1 agent task per EVAL_FRAMEWORK.md)_

## External Companion Notes
_(Paste strategy summaries from Grok/Qwen/Gemini sessions here)_
```

### STEP 2 — Add Layer 0 capture protocol to MEMORY_ARCHITECTURE.md
Open `docs/workspace/context/MEMORY_ARCHITECTURE.md`. Add to Layer 0:
```markdown
### Layer 0 Capture Protocol
At the end of every substantive session:
1. Run `/SAVE log` to persist session state
2. Append key decisions to `MEMORY.md` → Active Stack Decisions
3. Update `PHASE_HANDOFF.md` if a phase boundary was crossed
4. Update `CONTEXT.md` auto-snapshot if project phase changed
```

### STEP 3 — Link PHASE_HANDOFF.md into memory architecture
Open `docs/workspace/context/MEMORY_ARCHITECTURE.md`. In Layer 1 table, add row:
| `docs/workspace/context/PHASE_HANDOFF.md` | Cross-agent shared context at phase boundaries |

### STEP 4 — Add memory capture rule to workspace-orchestration.mdc
Open `.cursor/rules/workspace-orchestration.mdc`. Add a new section `## Memory Capture Protocol`:
```
## Memory Capture Protocol
- After every phase gate: update MEMORY.md + PHASE_HANDOFF.md + CONTEXT.md snapshot
- After every stack/architecture decision: append to MEMORY.md "Active Stack Decisions"
- After every design lock: append to MEMORY.md "Locked Design Decisions"
- Before starting any new session: read MEMORY.md + CONTEXT.md + PHASE_HANDOFF.md
- Session capture command: /SAVE log
```

### STEP 5 — Fix CONTEXT.md auto-snapshot
Open `docs/workspace/context/CONTEXT.md`. Update the AUTO-MANAGED section to add:
```
- Tech stack file: docs/reference/developer-tech-stack-2026.md (present: yes)
- Memory file: docs/workspace/context/MEMORY.md (present: yes)
- Phase handoff: docs/workspace/context/PHASE_HANDOFF.md (present: yes)
- Agent hierarchy: .cursor/agents/ (active agents: ~95, archived: ~15)
```

Run `pnpm ai:sync`.

OUTPUT: Files changed + "DONE — Memory layers upgraded"
```

---

## PROMPT 05 — MCP Usage Improvement

**Analysis:** MCPs with official servers exist for: Supabase, Neon, Clerk, Stripe, GitHub, Vercel, Cloudflare, PostHog, Sentry, Datadog — but no agent has explicit MCP activation rules. The system treats MCPs as invisible connectors rather than first-class tools.

```prompt
You are lead-solution-architect + devops-manager. Create an MCP governance layer.

TASK — do all steps:

### STEP 1 — Create MCP Registry
Create new file `docs/workspace/context/MCP_REGISTRY.md`:

```markdown
# NEZAM MCP Registry
> Official MCP servers available for IDE integration. Prefer MCP over CLI when both exist.
> Source: `docs/reference/developer-tech-stack-2026.md`
> Update quarterly with `developer-tech-stack-2026.md` review.

## Active MCP Servers (confirmed available)

| Service | MCP Available | Agent Owner | Activation Command | Notes |
|---|---|---|---|---|
| Supabase | ✅ Yes | lead-database-architect | auto | DB, Auth, Storage, Realtime |
| Neon | ✅ Yes | lead-database-architect | auto | Serverless Postgres branching |
| Clerk | ✅ Yes | auth-security-manager | auto | Auth + org management |
| Stripe | ✅ Yes | payments-lead | auto | Billing, subscriptions |
| GitHub | ✅ Yes | gitops-engineer | auto | PRs, issues, Actions |
| Vercel | ✅ Yes | lead-devops-performance | auto | Deployments, logs |
| Cloudflare | ✅ Yes | lead-devops-performance | auto | CDN, Workers, R2 |
| Sentry | ✅ Yes | observability-specialist | auto | Error tracking |
| PostHog | ✅ Yes | lead-analytics-architect | auto | Product analytics |
| Datadog | ✅ Yes | observability-specialist | on-demand | APM, logs |
| Firebase | ✅ Yes | lead-backend-architect | on-demand | Mobile/web BaaS |
| Auth0 | ✅ Yes | auth-security-manager | on-demand | Enterprise IAM |
| OpenRouter | ✅ Yes | prompt-engineer | auto | Multi-model routing |

## MCP-First Policy
When an agent needs to interact with a service that has an MCP server:
1. Use MCP first — never fall back to manual API calls if MCP is available
2. MCP calls are cheaper in tokens than describing API calls in prose
3. MCP results are structured — parse them directly without reformatting

## Setup Notes
- Cursor: configure MCP servers in `.cursor/mcp.json` (create if missing)
- Claude Code: configure in `~/.claude/mcp.json`
- Run `pnpm ai:sync` after adding new MCP configurations
```

### STEP 2 — Create MCP configuration file
Create `.cursor/mcp.json` if it does not exist:
```json
{
  "mcpServers": {
    "supabase": { "command": "npx", "args": ["-y", "@supabase/mcp-server-supabase@latest"], "notes": "Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars" },
    "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "notes": "Requires GITHUB_TOKEN env var" },
    "stripe": { "command": "npx", "args": ["-y", "@stripe/agent-toolkit@latest", "mcp"], "notes": "Requires STRIPE_SECRET_KEY env var" },
    "sentry": { "command": "npx", "args": ["-y", "@sentry/mcp-server@latest"], "notes": "Requires SENTRY_AUTH_TOKEN env var" },
    "cloudflare": { "command": "npx", "args": ["-y", "@cloudflare/mcp-server-cloudflare@latest"], "notes": "Requires CLOUDFLARE_API_TOKEN env var" },
    "vercel": { "command": "npx", "args": ["-y", "@vercel/mcp-adapter@latest"], "notes": "Requires VERCEL_TOKEN env var" }
  }
}
```

### STEP 3 — Add MCP-first rule to workspace-orchestration.mdc
Open `.cursor/rules/workspace-orchestration.mdc`. Add section `## MCP Usage Policy`:
```
## MCP Usage Policy
- When a registered MCP server exists for a service (see `docs/workspace/context/MCP_REGISTRY.md`), use it.
- MCP-first saves tokens: structured results < prose descriptions of API calls.
- Never write raw HTTP fetch code for a service that has an MCP.
- Exception: when MCP is unavailable in current tool context — fall back to CLI (see CLI orchestration rules).
```

### STEP 4 — Add MCP registry reference to lead agents
For each of these agents, add `docs/workspace/context/MCP_REGISTRY.md` to their "Primary skills / lenses":
- `.cursor/agents/lead-solution-architect.md`
- `.cursor/agents/lead-backend-architect.md`
- `.cursor/agents/lead-database-architect.md`
- `.cursor/agents/lead-devops-performance.md`
- `.cursor/agents/observability-specialist.md`

Run `pnpm ai:sync`.

OUTPUT: New files + modified agents + "DONE — MCP governance layer created"
```

---

## PROMPT 06 — Free CLI Orchestration (Silent Multi-Model Pipeline)

**Analysis:** Gemini CLI, OpenCode CLI, Kilocode CLI, Copilot CLI, Qwen CLI are all synced mirrors but used only as passive fallbacks. No skill or rule defines HOW to use them as active silent workers to save tokens and time.

```prompt
You are PM-01 (swarm-leader) + devops-manager. Design and implement the free CLI orchestration system.

CONTEXT:
- Available free/cheap CLIs: Gemini CLI (free tier), Qwen CLI (free), Kilocode CLI, Copilot CLI (GitHub plan), OpenCode CLI
- Cursor + Claude are the expensive primary tools — conserve their tokens
- The goal: route HEAVY but LOW-INTELLIGENCE tasks to free CLIs, keep Claude/Cursor for reasoning-heavy work

TASK — do all steps:

### STEP 1 — Create CLI Orchestration Skill
Create `.cursor/skills/system/cli-orchestration/SKILL.md`:

```markdown
---
name: cli-orchestration
description: Route tasks to the cheapest available CLI tool. Save Claude/Cursor tokens for reasoning tasks.
version: 1.0.0
updated: 2026-05-10
---

# CLI Orchestration

## The CLI Routing Matrix

| Task Type | Primary CLI | Fallback | Never Use Claude/Cursor For |
|---|---|---|---|
| File scanning / grep / audit | `kilocode` or `opencode` | Gemini CLI | Pattern searches across large codebases |
| Boilerplate generation | `opencode` or `copilot` | Gemini CLI | Scaffold files following a clear template |
| Documentation generation | `gemini` (free) | `qwen` (free) | Routine JSDoc / README from existing code |
| Translation drafts (Arabic) | `qwen` (multilingual free) | Gemini | First-pass translations before Claude review |
| Security audit scans | `kilocode` | `opencode` | Running known audit patterns across files |
| Dependency updates | `copilot` | `opencode` | Bumping package versions, changelogs |
| Test generation (unit) | `copilot` (GitHub plan) | `opencode` | Writing tests from existing function signatures |
| Lint / format fixes | `opencode` | any | Mechanical formatting corrections |
| Research / reasoning | Claude (Cursor) | Antigravity | Complex decisions, architecture, strategy |
| SPEC.md generation | Claude (Cursor) | Antigravity | Feature spec writing (requires reasoning) |

## Invocation Pattern

When dispatching to a free CLI:
1. Prepare a tight context pack (paths only, no full file content)
2. Pass the task as a single fenced prompt block
3. Review output before committing — free CLIs have no hardlock enforcement
4. Log the delegation: "Delegated to [CLI]: [task slug] [date]"

## Anti-Patterns
- Never delegate decisions to free CLIs (architecture, acceptance criteria, spec writing)
- Never let free CLI output bypass PM-01 acceptance review
- Never use free CLI for security-sensitive code (auth, payments, encryption)

## Token Savings Estimates
- File scanning 500 files: ~15k tokens saved per run vs Claude
- Boilerplate generation: ~8k tokens saved per file
- Documentation: ~3k tokens saved per function set
```

### STEP 2 — Create CLI Orchestration Rule
Create `.cursor/rules/cli-orchestration.mdc`:
```markdown
---
description: Route mechanical tasks to free CLIs to save Claude/Cursor token budget
alwaysApply: true
---

# CLI Orchestration Rule

## Routing triggers (auto-route without asking)
- "scan all files for..." → kilocode or opencode
- "generate boilerplate for..." → opencode or copilot  
- "write JSDoc/comments for..." → gemini CLI
- "translate to Arabic (first draft)..." → qwen CLI
- "run audit/lint across..." → kilocode
- "write unit tests for [function]..." → copilot CLI

## Session start protocol
When beginning any planning or development session, check which CLIs are active:
```sh
which gemini && gemini --version
which opencode && opencode --version
which kilocode && kilocode --version
```
Log available CLIs at session start in MEMORY.md session notes.

## Handoff protocol
When a free CLI completes a task:
1. Claude/Cursor REVIEWS output (not regenerates)
2. PM-01 checks against acceptance criteria
3. If passes: commit as normal
4. If fails: Claude/Cursor fixes the delta only (not rewrite from scratch)
```

### STEP 3 — Add CLI orchestration to multi-agent-handoff skill
Open `.cursor/skills/system/multi-agent-handoff/SKILL.md`. Add a section:
```markdown
## CLI Delegation Protocol
Before assigning a task to a Claude/Cursor agent, check the CLI Routing Matrix in `@nezam-cli-orchestration`.
If the task type maps to a free CLI, delegate there first. Only escalate to Claude when:
- Output requires validation against hardlock rules
- Task involves reasoning, decisions, or spec writing
- Security-sensitive code is involved
```

### STEP 4 — Update token-budget-manager skill
Open `.cursor/skills/system/token-budget-manager/SKILL.md`. Add:
```markdown
## CLI Offload Budget Strategy
Before using Claude/Cursor tokens:
1. Check CLI routing matrix (`@nezam-cli-orchestration`)
2. If task can be delegated: dispatch to free CLI
3. Only load Claude/Cursor for: review, decision, reasoning, spec writing
4. Log delegations to save baseline for token audit
```

Run `pnpm ai:sync`.

OUTPUT: New skill + new rule + updated skills + "DONE — CLI orchestration system built"
```

---

## PROMPT 07 — Token Optimization for Claude, Cursor, Antigravity, Codex

**Analysis:** Current token usage is unoptimized — no caching strategy, no context compression before expensive calls, no batching of related tasks, no reference-vs-copy discipline enforced at the tool level.

```prompt
You are PM-01 (swarm-leader) + prompt-engineer. Implement token optimization across all primary tools.

TASK — do all steps:

### STEP 1 — Upgrade token-budget-manager skill
Open `.cursor/skills/system/token-budget-manager/SKILL.md`. Replace/upgrade with:

```markdown
---
name: token-budget-manager
description: Minimize token spend across Claude, Cursor, Antigravity, and Codex through caching, compression, and routing.
version: 2.0.0
updated: 2026-05-10
---

# Token Budget Manager v2

## Tool-Specific Strategies

### Claude (Anthropic API / Cowork)
- Use prompt caching for: CLAUDE.md, MEMORY.md, CONTEXT.md, active SPEC.md (these are re-read every session)
- Cache-eligible threshold: any file read >3 times per day
- Max context trick: load file PATHS not file CONTENT for structural questions
- Use haiku-tier for: simple confirmations, status checks, non-reasoning tasks
- Use sonnet-tier for: reasoning, spec writing, architecture decisions

### Cursor (IDE)
- Pin most-referenced files: CONTEXT.md, MEMORY.md, active SPEC.md to @ references
- Use .cursorrules for globally injected context (amortized across all completions)
- Avoid pasting full file contents — use `@filename` references
- Use Cursor Tab for mechanical completions, not chat (chat costs more per token)
- Batch related edits into one chat turn instead of sequential back-and-forth

### Antigravity
- Mirror from .cursor/ — never re-explain rules that exist in mirrored rules files
- Use compact invocation prompts (the template format in each agent file)
- Tier-2 fidelity: pass only Layer 1 context (SDD docs) not Layer 2 (agent files)

### Codex CLI
- Always prefix with AGENTS.md path: `codex --context AGENTS.md "task"`
- Use for: git operations, file manipulation, test running — not reasoning tasks
- Batch: combine multiple small tasks into one codex invocation

## Universal Rules
- Reference > Repeat: never paste file content that exists at a known path
- Summarize before extending: compress old context before adding new
- Output budget: cap responses at 800 tokens unless explicitly expanded
- Cache candidates: MEMORY.md, CONTEXT.md, active SPEC.md, DESIGN.md

## Budget Tiers (unchanged)
- `tight`: shortest unblock path
- `normal`: key constraints + acceptance checks
- `expanded`: deep planning only

## Token Audit Trail
Log heavy sessions (>50k tokens) to: `docs/reports/token-audit/TOKEN_AUDIT.md`
Format: `[date] [tool] [task-slug] [approx-tokens] [could-be-delegated-to-cli: yes/no]`
```

### STEP 2 — Add prompt caching hints to CONTEXT.md
Open `docs/workspace/context/CONTEXT.md`. Add at the top (before Pipeline Contract):
```markdown
## Token Cache Hint
> These files are re-read every session and are prime candidates for prompt caching:
> 1. `docs/workspace/context/CONTEXT.md` (this file)
> 2. `docs/workspace/context/MEMORY.md`
> 3. `docs/workspace/context/PHASE_HANDOFF.md`
> 4. Active SPEC.md for current feature
> Load via path reference, not content paste.
```

### STEP 3 — Add token rules to workspace-orchestration.mdc
Open `.cursor/rules/workspace-orchestration.mdc`. Add section `## Token Economy Rules`:
```
## Token Economy Rules
- Load files by path reference (@filename) not content paste
- Compress prior session context before starting new session (use @nezam-context-window-manager)
- Use CLI delegation for mechanical tasks (see cli-orchestration.mdc)
- Use Claude Haiku / GPT-3.5 tier for: status checks, confirmations, simple transforms
- Use Claude Sonnet / GPT-4 tier for: reasoning, specs, architecture decisions
- Batch related tasks: one multi-part prompt > three sequential single prompts
- Never re-explain rules that are in .cursorrules or workspace-orchestration.mdc
```

### STEP 4 — Create token audit directory
Create `docs/reports/token-audit/TOKEN_AUDIT.md`:
```markdown
# Token Audit Log
> Track heavy sessions to identify optimization opportunities.
> Format: [date] | [tool] | [task] | [~tokens] | [CLI-delegatable: Y/N]

## Log
_(No entries yet — append after sessions >50k tokens)_
```

Run `pnpm ai:sync`.

OUTPUT: Files changed + "DONE — Token optimization complete"
```

---

## PROMPT 08 — Final Agent + Skill Alignment (Wire Everything Together)

**Analysis:** After all previous changes, agent files still reference skills by old names. The new skills have no agent references. The routing matrix in subagent-controller doesn't know about new skills.

```prompt
You are PM-01 + prompt-engineer + knowledge-update-manager. Execute final alignment pass.

TASK — do all steps:

### STEP 1 — Wire new skills to agents
For each new skill created in PROMPT 02, add the skill reference to the correct agent:

- `backend/drizzle-orm` → add to `lead-database-architect.md` skills list
- `backend/neon-postgres` → add to `lead-database-architect.md` + `devops-manager.md`
- `backend/background-jobs` → add to `automation-manager.md` + `backend-lead.md`
- `backend/vercel-ai-sdk` → add to `lead-backend-architect.md` + `frontend-framework-manager.md`
- `backend/clerk-auth` → add to `auth-security-manager.md`
- `backend/resend-email` → add to `backend-lead.md` + `integration-specialist.md`
- `backend/typesense-search` → add to `search-cache-manager.md`
- `infrastructure/product-analytics` → add to `lead-analytics-architect.md` + `analytics-engineer.md`
- `infrastructure/llm-observability` → add to `observability-specialist.md`
- `backend/openrouter` → add to `prompt-engineer.md` (new agent from HIERARCHY_REDESIGN_PROMPTS)
- `system/cli-orchestration` → add to `subagent-controller.md` + `swarm-leader.md`

Format for each skill reference: `- [.cursor/skills/<category>/<name>/SKILL.md](.cursor/skills/<category>/<name>/SKILL.md)`

### STEP 2 — Update subagent-controller routing with CLI awareness
Open `.cursor/agents/subagent-controller.md`. In "Routing Decision Criteria", add:
```
## Pre-Routing CLI Check
Before assigning any task to a Claude/Cursor agent, evaluate against `@nezam-cli-orchestration` routing matrix.
If task type = scan/boilerplate/lint/docs/translation → delegate to free CLI first.
Only route to swarm agent if: task requires reasoning, decision, or spec output.
```

### STEP 3 — Update skills README with new inventory
Open `.cursor/skills/README.md`. Update the category counts:
```markdown
| backend/ | API, DB, auth, payments, CMS, Drizzle, Neon, Clerk, AI SDK, Resend, Typesense, OpenRouter, background jobs | ~18 |
| infrastructure/ | DevOps, cloud, CDN, monitoring, product analytics, LLM observability | ~10 |
| system/ | Workspace orchestration, routing, memory, gating, CLI orchestration | ~17 |
```
Also update total skill count in description.

### STEP 4 — Update WORKSPACE_INDEX.md
Open `docs/workspace/context/WORKSPACE_INDEX.md`. Add/update:
- Total skills count (after merges and additions)
- New MCP_REGISTRY.md to key files list
- CLI_ORCHESTRATION to active rules list
- TOKEN_AUDIT.md to reports directory

### STEP 5 — Wire spec-writer to spec skill (if spec skill exists)
Check if `.cursor/skills/system/` has a spec-writing skill. If not, create `.cursor/skills/system/spec-generator/SKILL.md`:
```markdown
---
name: spec-generator
description: Generate complete SDD SPEC.md files for feature slices following the 10-field contract.
version: 1.0.0
updated: 2026-05-10
---
# Spec Generator
## Purpose
Translate approved feature briefs into gate-ready SPEC.md files.
## Required Fields (all 10 must be present)
1. Feature slug
2. Objective (one sentence, outcome-focused)
3. Acceptance criteria (measurable, binary pass/fail)
4. Data model changes
5. API contract
6. UI states (loading/empty/error/success/edge)
7. Edge cases
8. Write scope (exact file paths)
9. Dependencies
10. Agent assignment
## Validation
- All 10 fields present: PASS
- Acceptance criteria are testable: PASS
- Write scope matches swarm boundaries: PASS
## Integration Hooks
- spec-writer agent (primary)
- PM-01 acceptance review (gate)
- lead-solution-architect approval (gate)
```
Then add this skill reference to `.cursor/agents/spec-writer.md`.

Run `pnpm ai:sync`.

OUTPUT: All agent skill references updated + "DONE — Agent/skill alignment complete"
```

---

## PROMPT 09 — Verify Everything Syncs and Works

```prompt
You are PM-01 + devops-manager. Run full workspace verification.

TASK — execute in exact sequence:

1. Run `pnpm ai:sync` — sync all mirrors
2. Run `pnpm ai:check` — verify no drift
3. Run this grep to find any broken skill references in agents:
   `grep -r "@nezam-frontend-design-pro\|@nezam-design-system-builder\|@nezam-context-compressor" .cursor/agents/ .cursor/skills/ --include="*.md" -l`
   Fix any matches found.

4. Run this grep to find orphaned agent references (agents that reference archived files):
   `grep -r "knowledge-sharing-agent\|data-engineer\|react-component-lead\|prototyping-design-system-manager\|bias-fairness-specialist" .cursor/ --include="*.md" -l`
   Fix any matches found.

5. Verify all 10 new skills exist:
   `ls .cursor/skills/backend/drizzle-orm/ .cursor/skills/backend/neon-postgres/ .cursor/skills/backend/background-jobs/ .cursor/skills/backend/vercel-ai-sdk/ .cursor/skills/backend/clerk-auth/ .cursor/skills/backend/resend-email/ .cursor/skills/backend/typesense-search/ .cursor/skills/infrastructure/product-analytics/ .cursor/skills/infrastructure/llm-observability/ .cursor/skills/backend/openrouter/`

6. Verify all new agents exist:
   `ls .cursor/agents/spec-writer.md .cursor/agents/prompt-engineer.md .cursor/agents/client-onboarding-agent.md`

7. Verify MCP registry exists:
   `cat docs/workspace/context/MCP_REGISTRY.md | head -5`

8. Verify CLI orchestration skill exists:
   `cat .cursor/skills/system/cli-orchestration/SKILL.md | head -5`

9. Run final `pnpm ai:sync` + `pnpm ai:check`

10. Append to `docs/workspace/context/MEMORY.md` under "Active Stack Decisions":
    `[2026-05-10] NEZAM workspace upgraded — skills consolidated, 10 new tech stack skills, MCP registry, CLI orchestration, memory layers v2, token optimization, agent/skill alignment complete`

OUTPUT: Verification results for all 10 checks + "DONE — Full workspace verified"
```

---

## PROMPT 10 — Final README and Documentation Update

```prompt
You are knowledge-update-manager. Update all index and README files to reflect the complete upgraded state.

TASK:

1. Update `.cursor/skills/README.md`:
   - Correct all category counts
   - Add "Archive" section listing all archived skills
   - Add "New in v2" section with the 10 new tech stack skills

2. Update `.cursor/agents/README.md`:
   - Add new agents: spec-writer, prompt-engineer, client-onboarding-agent
   - Add Archived section from HIERARCHY_REDESIGN_PROMPTS
   - Update total count

3. Update `docs/workspace/context/WORKSPACE_INDEX.md`:
   - Add MCP_REGISTRY.md
   - Add TOKEN_AUDIT.md  
   - Add CLI orchestration rule
   - Update agent and skill counts

4. Update `docs/workspace/context/MULTI_TOOL_INDEX.md`:
   - Add note about CLI orchestration routing matrix
   - Add MCP-first policy reference

5. Append to `docs/workspace/context/MEMORY.md` External Companion Notes:
   ```
   [2026-05-10] Workspace v2 upgrade complete:
   - Skills: merged 3, added 10, archived 3
   - Agents: added 3 (spec-writer, prompt-engineer, client-onboarding-agent), archived 10
   - New systems: MCP registry, CLI orchestration, memory v2, token audit
   - Tech stack: all services now referenced by agents and skills
   ```

6. Run final `pnpm ai:sync` then `pnpm ai:check`

OUTPUT: All files updated + final sync clean + "DONE — Workspace v2 upgrade complete"
```

---

## Execution Order & Summary

| Prompt | What it does | Time est. |
|---|---|---|
| 01 | Skills audit — merge 3, archive 3 | 5 min |
| 02 | Create 10 new tech stack skills | 10 min |
| 03 | Wire tech stack as context to agents | 5 min |
| 04 | Upgrade memory layers v2 | 5 min |
| 05 | MCP registry + governance | 5 min |
| 06 | CLI orchestration system (free tools) | 8 min |
| 07 | Token optimization (Claude/Cursor/Antigravity/Codex) | 5 min |
| 08 | Final agent + skill alignment | 8 min |
| 09 | Full verification pass | 5 min |
| 10 | README + documentation update | 5 min |
| **Total** | **Complete workspace v2** | **~61 min** |

## Net Changes After All Prompts

| Category | Before | After |
|---|---|---|
| Active skills | ~72 | ~79 (merged 3 → 1, added 10) |
| Archived skills | 0 | 3 |
| Active agents | ~105 | ~98 |
| Archived agents | 0 | 10 |
| New agents | — | 3 (spec-writer, prompt-engineer, client-onboarding-agent) |
| MCP registry | none | 13 services documented |
| CLI orchestration | passive | active routing matrix |
| Token strategy | basic | per-tool optimization |
| Tech stack context | disconnected | wired to agents + skills |
| Memory layers | placeholder | v2 with capture protocol |
