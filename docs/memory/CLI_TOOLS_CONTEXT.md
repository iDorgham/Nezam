# NEZAM — AI Tools & CLI Context Reference
> **Source of truth for tool routing decisions.**
> All planning agents and the subagent-controller read this file before assigning any task.
> Loaded from: `docs/memory/CLI_TOOLS_CONTEXT.md`
> Active tool registry: `.cursor/workspace.settings.yaml` → `tools.active[]`

---

## How This File Is Used

1. **Onboarding** — user selects active tools via `/Settings ai-tools` or `/START all` → stored in `workspace.settings.yaml`
2. **Planning agents** — read `workspace.settings.yaml` to know which tools are active, then tag each task in `MASTER_TASKS.md` with `assigned_tool`
3. **Subagent-controller** — before routing any task, checks `assigned_tool` field + active tool list → dispatches accordingly
4. **Deactivation** — when a tool is marked inactive, the routing fallback chain in this file determines the next best tool automatically

---

## Tool Profiles

### 1. Claude (Anthropic — via Cursor / Cowork / API)
```
tier:         primary-reasoning
cost:         high (tokens billed)
free_quota:   none (pay-per-token or subscription)
best_at:
  - Architecture decisions and technical strategy
  - SDD spec writing (SPEC.md, ARCHITECTURE.md, PRD.md)
  - Complex reasoning, trade-off analysis
  - Code review requiring judgment (not pattern-matching)
  - Security-sensitive code (auth, payments, encryption)
  - Agent orchestration and routing decisions
  - Natural language content requiring quality judgment
never_use_for:
  - File scanning or grep patterns across large codebases
  - Boilerplate generation from clear templates
  - Mechanical JSDoc or README from existing code
  - First-pass translation drafts
  - Lint/format fixes
  - Dependency version bumps
fallback_when_inactive: antigravity → then opencode
model_tiers:
  haiku: status checks, simple confirmations, non-reasoning
  sonnet: reasoning, specs, architecture decisions
```

### 2. Cursor (IDE AI — Composer + Chat + Tab)
```
tier:         primary-ide
cost:         subscription (amortized)
free_quota:   plan-dependent
best_at:
  - In-editor file creation and editing
  - Multi-file refactors with codebase awareness
  - @ reference resolution (loads only what's needed)
  - Cursor Tab for mechanical completions (cheapest path)
  - Running slash commands from this workspace
  - Reading .cursorrules and workspace context automatically
never_use_for:
  - Long-form reasoning (use Claude API instead)
  - Tasks that can be batched across files by a free CLI
  - Translation (no multilingual strength)
token_discipline:
  - Always @filename — never paste file contents
  - Use Cursor Tab for completions, not Chat
  - Batch multi-file edits in one turn
fallback_when_inactive: claude-api → then opencode
```

### 3. Antigravity
```
tier:         primary-secondary
cost:         subscription (separate)
free_quota:   plan-dependent
best_at:
  - Parallel task execution (true multi-agent)
  - Running multiple swarm agents simultaneously
  - Long multi-step build sequences without context loss
  - Applying workspace rules without needing Cursor open
  - Overnight / unattended runs
never_use_for:
  - Initial spec writing (needs Claude reasoning first)
  - Security audit decisions
  - Design direction choices
context_loading:
  - Pass Layer 1 SDD docs only (not full agent files)
  - Use compact invocation format from each agent file
fallback_when_inactive: cursor → then claude-api
```

### 4. Gemini CLI (Google — free tier)
```
tier:         free-worker
cost:         free (within quota)
free_quota:   ~1500 requests/day (Gemini 1.5 Flash)
best_at:
  - Large codebase summarization (2M context window)
  - Documentation generation from existing code
  - README and JSDoc writing
  - Research synthesis from multiple sources
  - Multimodal input (screenshots, diagrams → text)
  - Long context analysis (entire repo in one pass)
never_use_for:
  - Security-sensitive code generation
  - Spec or architecture decisions
  - Tasks requiring hardlock enforcement
quota_exhaustion_fallback: qwen → then opencode
activation_check: which gemini && gemini --version
task_tags: [docs, summarize, readme, research, jsdoc]
```

### 5. Qwen CLI (Alibaba — free)
```
tier:         free-worker
cost:         free
free_quota:   generous (cloud API, rate-limited not quota-capped)
best_at:
  - Arabic language — first-pass translation drafts
  - Multilingual content generation (Arabic dialects)
  - Code generation with Chinese/MENA market context
  - Supplementing Gemini when quota is exhausted
  - Long context tasks (128k+ context)
never_use_for:
  - Final Arabic content (always Claude-reviewed after)
  - Any client-facing copy without Claude review pass
  - Security code
quota_exhaustion_fallback: gemini
activation_check: which qwen && qwen --version
task_tags: [arabic, translation, multilingual, dialect]
```

### 6. Kilocode CLI
```
tier:         free-worker
cost:         free (OSS)
best_at:
  - Codebase scanning and auditing (pattern matching)
  - Security audit pattern checks (known vulnerability patterns)
  - Dependency graph analysis
  - File-level grep and structural analysis
  - Large-scale find-and-replace operations
  - Running audit rules across hundreds of files
never_use_for:
  - Any reasoning or decision task
  - Spec or architecture work
  - Content generation
quota_exhaustion_fallback: opencode
activation_check: which kilocode && kilocode --version
task_tags: [scan, audit, grep, security-check, analyze]
```

### 7. OpenCode CLI
```
tier:         free-worker
cost:         free (OSS, routes to configured providers)
best_at:
  - Boilerplate generation from clear templates
  - Scaffold file creation
  - Lint and format fixes
  - Unit test generation from function signatures
  - Git operations (commit, branch, PR description)
  - Delta-only fixes after free CLI produces imperfect output
  - General-purpose fallback when other CLIs are unavailable
never_use_for:
  - Architecture decisions
  - Spec writing
  - Security-sensitive code
quota_exhaustion_fallback: copilot
activation_check: which opencode && opencode --version
task_tags: [boilerplate, scaffold, lint, format, git, test-gen]
```

### 8. GitHub Copilot CLI
```
tier:         free-worker
cost:         free (GitHub plan inclusion)
best_at:
  - Unit test generation (GitHub-trained on test patterns)
  - Git command suggestions and explanations
  - PR description generation
  - Shell command suggestions
  - Code completion for well-known patterns
never_use_for:
  - Architecture or reasoning tasks
  - Non-GitHub-standard patterns
quota_exhaustion_fallback: opencode
activation_check: which gh && gh copilot --version
task_tags: [test-gen, git, pr, shell]
```

### 9. Codex CLI (OpenAI)
```
tier:         paid-worker
cost:         low (API tokens, cheaper than Claude)
best_at:
  - Code generation with OpenAI models
  - Multi-file operations with AGENTS.md context
  - Batching multiple small code tasks in one invocation
  - Fill-in-the-middle code completion
  - Paired with AGENTS.md for workspace-aware generation
invocation_pattern: codex --context AGENTS.md "<task>"
never_use_for:
  - Reasoning or spec tasks
  - Arabic or multilingual content
quota_exhaustion_fallback: opencode
activation_check: which codex && codex --version
task_tags: [code-gen, batch, fill-in]
```

---

## Task-to-Tool Routing Matrix

> Used by planning agents to assign `assigned_tool` in MASTER_TASKS.md
> Used by subagent-controller for pre-routing CLI check

| Task Type | Primary Tool | First Fallback | Second Fallback | Never Delegate |
|---|---|---|---|---|
| Architecture decision | claude/cursor | antigravity | — | free CLIs |
| Spec writing (SPEC.md) | claude/cursor | antigravity | — | free CLIs |
| Security code (auth/payments) | claude/cursor | — | — | all CLIs |
| Code review (judgment) | claude/cursor | antigravity | — | free CLIs |
| Codebase scan / audit | kilocode | opencode | gemini | claude (wasteful) |
| Boilerplate / scaffold | opencode | copilot | codex | claude (wasteful) |
| Documentation / JSDoc | gemini | opencode | qwen | claude (wasteful) |
| Arabic translation (first draft) | qwen | gemini | — | — |
| Arabic content (final) | qwen (draft) + claude (review) | — | — | — |
| Unit test generation | copilot | opencode | codex | — |
| Lint / format fix | opencode | kilocode | — | claude (wasteful) |
| Git operations | codex | copilot | opencode | — |
| Dependency updates | copilot | opencode | — | — |
| Large codebase summarize | gemini | — | — | claude (context cost) |
| PR description | copilot | codex | opencode | — |
| Research synthesis | gemini | claude | — | — |
| Parallel task batches | antigravity | — | — | — |
| Multi-agent swarm run | antigravity | cursor | — | — |

---

## Deactivation Fallback Chains

When a tool is marked `active: false` in `workspace.settings.yaml`, the following chains apply:

```yaml
deactivation_chains:
  claude:       [antigravity, cursor, opencode]      # escalate or degrade gracefully
  cursor:       [claude-api, antigravity, opencode]
  antigravity:  [cursor, claude-api]
  gemini:       [qwen, opencode, claude]             # use free → then paid
  qwen:         [gemini, claude]
  kilocode:     [opencode, gemini]
  opencode:     [copilot, codex, kilocode]
  copilot:      [opencode, codex]
  codex:        [opencode, copilot]
```

**Deactivation behavior rules:**
1. Tasks already in-flight for a deactivated tool get re-tagged to first available fallback
2. If ALL fallbacks in chain are also inactive → task flagged `⚠️ NO TOOL AVAILABLE` in MASTER_TASKS.md
3. Planning agents show a warning in their output: `⚠️ [tool] inactive — task re-routed to [fallback]`
4. Security-tagged tasks (`security: true`) NEVER fall through to free CLIs — they escalate to Claude or block

---

## Quota Tracking

Daily quotas reset at UTC 00:00. Track usage in `workspace.settings.yaml → tools.quotas`:

```yaml
# Example — updated automatically by cli-orchestration skill
tools:
  gemini:
    daily_quota: 1500
    used_today: 0
    reset_at: "UTC 00:00"
  qwen:
    daily_quota: unlimited
    rate_limit: "60 req/min"
```

When a tool hits quota:
1. Automatically fall back to next in chain (no manual intervention needed)
2. Log: `[date] [tool] quota exhausted — fell back to [next_tool]` in TOKEN_AUDIT.md
3. Resume primary tool next day automatically

---

## Project-Level Overrides

Some projects require stricter or looser tool policies. Set in `workspace.settings.yaml → projects.<name>.tool_policy`:

```yaml
projects:
  client-facing-saas:
    tool_policy: strict          # Claude/Cursor only — no free CLIs for any output
  internal-tools:
    tool_policy: cost-optimized  # aggressive free CLI use, Claude for decisions only
  arabic-content-site:
    tool_policy: arabic-heavy    # Qwen primary, Claude review gate required
```

---

## Adding a New Tool

1. Add profile block above following the existing schema
2. Add to routing matrix (which task types it handles)
3. Add to deactivation chain of any tools it can replace
4. Add activation check command
5. Run `/Settings ai-tools register <tool-name>` to add to workspace registry
6. Run `pnpm ai:sync`
