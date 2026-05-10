# NEZAM Master Upgrade — Cursor Prompts
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

---

# PHASE 2 UPGRADES — Tool Activation, Settings & Smart Routing
> Run AFTER Phase 1 (Prompts 01–10) completes.
> These prompts implement: onboarding tool selection, persistent settings, /Settings command,
> SDD planning agents with tool-awareness, and graceful deactivation handling.

---

## PROMPT 11 — Wire workspace.settings.yaml into the Agent Layer

**Context:** `workspace.settings.yaml` and `CLI_TOOLS_CONTEXT.md` now exist.
Planning agents and the subagent-controller need to READ settings before routing tasks.

```prompt
You are PM-01 (swarm-leader) + knowledge-update-manager. Wire workspace.settings.yaml into the agent routing layer.

CONTEXT FILES (read these first):
- `.cursor/workspace.settings.yaml` — active tool registry + routing config
- `docs/workspace/context/CLI_TOOLS_CONTEXT.md` — tool profiles and routing matrix

TASK — execute all steps:

### STEP 1 — Update workspace-orchestration.mdc
Open `.cursor/rules/workspace-orchestration.mdc`. Add a new section `## Settings-Driven Routing`:

```markdown
## Settings-Driven Routing

Before any task assignment, agents MUST:
1. Read `.cursor/workspace.settings.yaml` → check `tools.<name>.active` for each tool
2. Read `docs/workspace/context/CLI_TOOLS_CONTEXT.md` → get routing matrix
3. Only route tasks to ACTIVE tools (active: true in settings)
4. If assigned tool is inactive → apply deactivation chain from CLI_TOOLS_CONTEXT.md
5. Security-tagged tasks (security: true) NEVER route to free CLIs regardless of policy
6. Log routing decision when verbose_routing: true in settings

Tool activation state is the source of truth. Never assume a tool is available without checking settings.
```

### STEP 2 — Update subagent-controller.md
Open `.cursor/agents/subagent-controller.md`. In the "Pre-Routing CLI Check" section (added in PROMPT 08), REPLACE with:

```markdown
## Settings-Aware Pre-Routing Protocol

Before routing ANY task to a swarm agent or CLI:

1. Load tool state: read `.cursor/workspace.settings.yaml → tools`
2. Load routing matrix: reference `docs/workspace/context/CLI_TOOLS_CONTEXT.md`
3. Check task metadata:
   - `assigned_tool`: use this if already tagged (from MASTER_TASKS.md)
   - `security: true`: force claude — no exceptions
   - `type`: match against routing matrix if no assigned_tool
4. Verify assigned_tool is active in settings
5. If inactive: apply deactivation chain → assign first active fallback
6. If no active tool in chain: flag task `status: blocked | reason: NO_ACTIVE_TOOL`
7. Log delegation when `tools.routing.verbose_routing: true`

Routing decision output format (when verbose):
`→ [task-slug] assigned to [tool] ([reason: matrix-match|fallback|security-override])`
```

### STEP 3 — Update swarm-leader.md (PM-01)
Open `.cursor/agents/swarm-leader.md`. Add to the "Session Start Protocol":

```markdown
## Session Start Protocol
At the start of every session:
1. Read `.cursor/workspace.settings.yaml` — load active tool list
2. Read `docs/workspace/context/MEMORY.md` — load durable decisions
3. Read `docs/workspace/context/PHASE_HANDOFF.md` — load last session state
4. Check `onboarding.complete` in settings — if false, prompt user to run `/Settings ai-tools setup`
5. Run activation checks for any tool with `active: true` but not verified this session:
   - Run the `activation_check` command from CLI_TOOLS_CONTEXT.md for each active tool
   - If a check fails: warn user, temporarily mark tool inactive for this session
```

### STEP 4 — Update client-onboarding-agent.md
Open `.cursor/agents/client-onboarding-agent.md`. Add step after workspace init:

```markdown
## Onboarding Step 2: Tool Selection
After workspace init is confirmed, trigger:
`/Settings ai-tools setup`

This is REQUIRED before any planning can begin. Without knowing which tools are active,
planning agents cannot generate properly-tagged task lists.

Gate: `onboarding.tools_selected` must be `true` in workspace.settings.yaml before
the onboarding agent marks the workspace as ready.
```

### STEP 5 — Add /Settings to /START all sequence
Open `.cursor/commands/start.md`. In the `/START all` subcommand description, update the sequence to include:
```
/START all sequence:
  1. /START repo
  2. /Settings ai-tools setup   ← ADDED: tool selection during onboarding
  3. /START docs
  4. /START gates
  5. /START design
  6. /START companion
```

Also add to the subcommand list:
```
/START settings   → Jump directly to /Settings ai-tools setup (shortcut during onboarding)
```

Run `pnpm ai:sync`.

OUTPUT: Files changed + "DONE — Settings wired into agent layer"
```

---

## PROMPT 12 — Settings-Aware Planning: Task Tool Tagging in MASTER_TASKS.md

**Context:** When `/PLAN tasks` runs, it generates `MASTER_TASKS.md`. Currently tasks have no
`assigned_tool` field. Planning agents need to read active tools + routing matrix and tag
every task before writing the file.

```prompt
You are PM-01 + spec-writer + prompt-engineer. Upgrade the /PLAN tasks command to produce tool-tagged task lists.

CONTEXT FILES (read first):
- `.cursor/workspace.settings.yaml` → active tools
- `docs/workspace/context/CLI_TOOLS_CONTEXT.md` → routing matrix
- `.cursor/commands/plan.md` → current /PLAN tasks behavior

TASK — execute all steps:

### STEP 1 — Update /PLAN tasks behavior in plan.md
Open `.cursor/commands/plan.md`. Find the `/PLAN tasks` subcommand section. Add:

```markdown
### Task Tool Tagging (auto-applied when tools.routing.auto_assign_tasks: true)

After generating the task list, before writing MASTER_TASKS.md:

1. Read `.cursor/workspace.settings.yaml → tools` to get active tool list
2. Read `docs/workspace/context/CLI_TOOLS_CONTEXT.md → Task-to-Tool Routing Matrix`
3. For each task, determine `assigned_tool` by:
   - Match task `type` against routing matrix
   - Verify `assigned_tool` is `active: true` in settings
   - If not active → apply deactivation chain → assign first active fallback
   - If task is security-tagged → always assign `claude`
4. Add `fallback_tool` from deactivation chain (first active tool after primary)
5. Write both fields into every task entry

MASTER_TASKS.md task format (add these fields to existing schema):
```yaml
- id: MT-###
  title: "..."
  type: <task-type>          # documentation | scan | boilerplate | architecture-decision | etc.
  assigned_tool: <tool>      # from routing matrix — the tool that runs this task
  fallback_tool: <tool>      # from deactivation chain — used if assigned_tool goes inactive
  security: <true|false>     # if true: assigned_tool is always claude, no exceptions
  swarm: <swarm-name>
  agent: <agent-name>
  phase: <phase-number>
  status: pending
```

After writing MASTER_TASKS.md, show a routing summary:
```
Task Routing Summary (18 tasks)
  claude:     5 tasks  (architecture decisions, specs, security code)
  gemini:     7 tasks  (docs, summaries, readme)
  opencode:   4 tasks  (boilerplate, scaffold, lint)
  copilot:    2 tasks  (unit tests)

  ⚠️ qwen not active — 3 Arabic tasks reassigned to gemini (fallback)
  → Activate qwen for better Arabic output: /Settings ai-tools on qwen
```
```

### STEP 2 — Add deactivation re-routing to task management
Create new section in `.cursor/commands/plan.md` for task re-routing on deactivation:

```markdown
### Task Re-routing on Tool Deactivation

When `/Settings ai-tools off <tool>` is called:
1. Scan MASTER_TASKS.md for tasks with `assigned_tool: <tool>`
2. For each matched task:
   - Check deactivation chain in CLI_TOOLS_CONTEXT.md
   - Find first active tool in chain
   - Update `assigned_tool` to fallback
   - Keep original in: `original_tool: <old-tool>` (for audit trail)
3. Tasks with `security: true` that lose their tool → set `status: blocked | reason: SECURITY_TOOL_INACTIVE`
4. Output re-routing summary (same format as above)
5. Save changes to MASTER_TASKS.md
```

### STEP 3 — Update create.md for /CREATE task command
Open `.cursor/commands/create.md`. In the `/CREATE task` subcommand, add the tool-tagging logic:
- When creating a single task, ask user or auto-detect task type
- Apply routing matrix to set assigned_tool
- Verify tool is active; apply fallback if not
- Write with full schema including assigned_tool + fallback_tool

Run `pnpm ai:sync`.

OUTPUT: Commands updated + "DONE — Task tool tagging implemented"
```

---

## PROMPT 13 — Graceful Deactivation: What Happens When a Tool Goes Inactive

**Context:** We have the routing logic. Now define the full deactivation behavior
across the workspace — not just task re-routing, but also: session warnings,
unattended run safety, and reactivation procedure.

```prompt
You are PM-01 + devops-manager. Implement full deactivation and reactivation handling.

TASK — execute all steps:

### STEP 1 — Create deactivation rule in workspace-orchestration.mdc
Open `.cursor/rules/workspace-orchestration.mdc`. Add section `## Tool Deactivation Protocol`:

```markdown
## Tool Deactivation Protocol

### When a tool is deactivated (/Settings ai-tools off <tool>):
1. Update workspace.settings.yaml: `tools.<tool>.active: false`
2. Re-route all MASTER_TASKS.md tasks (see PROMPT 12 behavior)
3. Warn if any tasks could not be re-routed (security tasks that need Claude)
4. Log deactivation: `[date] [tool] deactivated — reason: [user-provided|quota-exhausted|check-failed]`

### During a session (tool fails mid-session):
If an active tool fails its activation check during a session:
1. Temporarily mark `active: false` for this session only (do not write to settings)
2. Re-route remaining in-session tasks to fallback
3. Show warning: `⚠️ [tool] unavailable this session — [N] tasks re-routed to [fallback]`
4. At session end: ask user if they want to permanently deactivate or just skip for now

### Quota exhaustion (Gemini 1500/day hit):
1. Auto-fall back to qwen (if active) → then opencode
2. Log: `[date] gemini quota exhausted — fell back to [next] — tasks affected: [count]`
3. Resume gemini automatically at UTC 00:00 next day

### Security task protection:
- Tasks tagged `security: true` NEVER auto-reroute to free CLIs
- If Claude becomes inactive (rare): task gets `status: blocked | reason: SECURITY_CLAUDE_INACTIVE`
- User must manually activate a primary tool before security tasks resume

### Reactivation (/Settings ai-tools on <tool>):
1. Run activation check
2. If passes: set `active: true` in settings
3. Scan MASTER_TASKS.md for tasks with `original_tool: <tool>` → restore them to `assigned_tool: <tool>`
4. Show: `✅ [tool] reactivated — [N] tasks restored to primary assignment`
5. Run pnpm ai:sync
```

### STEP 2 — Add reactivation restore to /Settings ai-tools on
Open `.cursor/commands/settings.md`. In the `/Settings ai-tools on <tool>` section, add:

```markdown
### Reactivation Restore
When reactivating a tool:
1. Run activation check
2. If passes: mark active in workspace.settings.yaml
3. Scan MASTER_TASKS.md for `original_tool: <tool>` entries
4. Restore `assigned_tool` from fallback back to original
5. Clear `original_tool` field (cleanup)
6. Show restoration summary:
   ✅ gemini reactivated
   Restored: 14 tasks back to gemini (from opencode fallback)
   Quota reset: 1500/day available
```

### STEP 3 — Add session start tool verification to workspace-orchestration.mdc
In the `## Memory Capture Protocol` section (added in PROMPT 04), add before the existing rules:

```markdown
## Session Start Checklist (run automatically at session open)
1. Load workspace.settings.yaml → active tool list
2. Run activation checks for all tools marked active: true
3. Report: ✅ [tool] verified / ⚠️ [tool] check failed — temporarily inactive
4. Check quota status for free-tier tools (gemini, qwen)
5. Warn if any primary tool (claude, cursor) is inactive: "⚠️ Primary tool unavailable — check settings"
6. If onboarding.complete: false → show: "→ Run /Settings ai-tools setup to complete onboarding"
```

Run `pnpm ai:sync`.

OUTPUT: Rules + commands updated + "DONE — Deactivation protocol complete"
```

---

## PROMPT 14 — Register /Settings in Help, Start, and CLAUDE.md

**Context:** `/Settings` is a new command. It needs to appear in /HELP reference,
the /START onboarding sequence, and be registered in CLAUDE.md synced command index.

```prompt
You are knowledge-update-manager + prompt-engineer. Register /Settings command across all command surfaces.

TASK — execute all steps:

### STEP 1 — Add /Settings to help.md
Open `.cursor/commands/help.md`. In the QUICK REFERENCE section, add:
```
/Settings  workspace|plan|project|ai-tools|memory|github|automations|mcp|guide|status|reset|export
```

In the WORKFLOW ORDER section, add after Step 1 (/START all):
```
  1.5. /Settings ai-tools setup  → Select your AI tools and CLIs (runs inside /START all)
```

### STEP 2 — Register in CLAUDE.md synced command index
Open `CLAUDE.md`. In the `## Synced command index` section, add:
```
- `settings.md`
```

### STEP 3 — Add CLI_TOOLS_CONTEXT.md to CONTEXT.md core paths
Open `docs/workspace/context/CONTEXT.md`. In the "Core Paths" section, add:
```
- AI tools context: `docs/workspace/context/CLI_TOOLS_CONTEXT.md` — tool profiles, routing matrix, deactivation chains
- Workspace settings: `.cursor/workspace.settings.yaml` — active tool registry, persistent config
```

### STEP 4 — Update WORKSPACE_INDEX.md
Open `docs/workspace/context/WORKSPACE_INDEX.md`. Add to key files section:
- `docs/workspace/context/CLI_TOOLS_CONTEXT.md` — AI tool profiles and routing matrix
- `.cursor/workspace.settings.yaml` — persistent workspace settings (all sections)
- `.cursor/commands/settings.md` — /Settings command (workspace control plane)

### STEP 5 — Add to MULTI_TOOL_INDEX.md
Open `docs/workspace/context/MULTI_TOOL_INDEX.md`. Add note:
```
## Settings Sync Note
After any /Settings change, run `pnpm ai:sync` to propagate workspace.settings.yaml
state to all 11 AI client mirrors. The settings file is canonical — never edit
mirror files directly.
```

Run `pnpm ai:sync`.

OUTPUT: Files updated + "DONE — /Settings command registered everywhere"
```

---

## PROMPT 15 — Final Verification: Tool Routing System End-to-End

```prompt
You are PM-01 + devops-manager. Verify the complete tool activation and routing system works end-to-end.

TASK — execute verification sequence:

1. Verify workspace.settings.yaml exists and is valid YAML:
   `cat .cursor/workspace.settings.yaml | head -20`

2. Verify CLI_TOOLS_CONTEXT.md exists:
   `cat docs/workspace/context/CLI_TOOLS_CONTEXT.md | head -10`

3. Verify /Settings command file exists:
   `cat .cursor/commands/settings.md | head -5`

4. Verify settings.md is in CLAUDE.md command index:
   `grep "settings.md" CLAUDE.md`

5. Verify workspace-orchestration.mdc has Settings-Driven Routing section:
   `grep "Settings-Driven Routing" .cursor/rules/workspace-orchestration.mdc`

6. Verify subagent-controller has Settings-Aware Pre-Routing Protocol:
   `grep "Settings-Aware" .cursor/agents/subagent-controller.md`

7. Verify swarm-leader has Session Start Protocol:
   `grep "Session Start Protocol" .cursor/agents/swarm-leader.md`

8. Verify /HELP shows /Settings:
   `grep "Settings" .cursor/commands/help.md`

9. Run a simulated routing decision:
   Read workspace.settings.yaml → check which tools are active.
   For these 3 task types, state which tool they'd route to given current active tools:
   - type: documentation → routes to: [answer]
   - type: architecture-decision → routes to: [answer]
   - type: arabic-translation → routes to: [answer]

10. Run final sync:
    `pnpm ai:sync && pnpm ai:check`

11. Append to MEMORY.md under "Active Stack Decisions":
    `[2026-05-10] Phase 2 upgrades complete — tool activation system, /Settings command,
    settings-aware routing, CLI_TOOLS_CONTEXT.md, workspace.settings.yaml, deactivation protocol`

OUTPUT: Verification results for all 11 checks + "DONE — Phase 2 complete"
```

---

## Updated Execution Order (All 15 Prompts)

| Prompt | What it does | Phase |
|---|---|---|
| 01–10 | Phase 1: Skills, agents, memory, MCP, CLI routing, tokens | v2 Upgrade |
| 11 | Wire settings into agent layer | Phase 2 |
| 12 | Settings-aware task tagging in /PLAN tasks | Phase 2 |
| 13 | Graceful deactivation + reactivation protocol | Phase 2 |
| 14 | Register /Settings in help, start, CLAUDE.md | Phase 2 |
| 15 | End-to-end verification | Phase 2 |

## Updated Net Changes (After All 15 Prompts)

| Category | Before | After |
|---|---|---|
| Active skills | ~72 | ~79 |
| Active agents | ~105 | ~98 |
| New commands | — | /Settings (11 subcommands) |
| New config files | — | workspace.settings.yaml, CLI_TOOLS_CONTEXT.md |
| Routing | passive matrix | settings-driven, persistent, per-session verified |
| Task tagging | none | every task tagged with assigned_tool + fallback_tool |
| Deactivation | undefined behavior | graceful re-routing + reactivation restore |
| Onboarding | file init only | tool selection wizard integrated into /START all |
| Settings control | none | full /Settings control plane (9 subcommands) |
