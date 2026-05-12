/GUIDE — Intelligent project navigator. Always available. Never hardlocked.

Subcommands:
  /GUIDE                → defaults to /GUIDE status
  /GUIDE status         → full pipeline status: done / active / blocked / next
  /GUIDE next           → single recommended next action only
  /GUIDE phase          → deep dive on the current active phase
  /GUIDE full           → complete project health across all phases
  /GUIDE explain        → zero-jargon plain English summary
  /GUIDE help           → usage reference
  /GUIDE prompt         → generate a ready-to-use prompt for the next step
  /GUIDE terminal       → generate the next terminal command to run

Aliases: `/GUIDE` → `/GUIDE status`

Hard blocks: none — `/GUIDE` is always available  
Recommendation footer: required (workspace-orchestration)

---

## Philosophy

`/GUIDE` is the user's co-pilot throughout the entire project lifecycle.
It always knows where the user is, what they should do next, and why.
It never gives vague suggestions. Every response ends with something
the user can act on in under 30 seconds — a slash command, a ready-to-paste
prompt, or a terminal command.

For beginners (`tone: friendly` in `.cursor/state/onboarding.yaml`), `/GUIDE` explains concepts without jargon.
For teams (`tone: structured`), it shows governance detail and agent assignments.

---

## Read order (all `/GUIDE` subcommands that need state)

Before responding, read these files in order when they exist:

1. `.cursor/state/onboarding.yaml` — `prd_locked`, `design_locked`, `planning_complete`, `user_mode`, `tone`
2. `.cursor/state/plan_progress.yaml` — which plan phases are done
3. `.cursor/state/develop_phases.yaml` — which dev phases are done or locked
4. `.cursor/state/agent-status.yaml` — last active agent and output (if exists)
5. `docs/prd/PRD.md` — product name and type (resolve path via `.cursor/workspace.paths.yaml` `project.prd` if relocated)
6. `DESIGN.md` (repo root) — design profile / contract cues

---

## /GUIDE status — Full Pipeline Status

Output sections in this exact order:

### Section 0 — Session Resume Card (only if `agent-status.yaml` has active handoff or resume content)

```
┌─────────────────────────────────────────────────┐
│  📍 Resuming: [agent] on [active task]          │
│  📦 Last output: [summary] — [status]           │
│  🔄 Handoff pending: [from] → [to]              │
│  ❌ Blockers: [list or "none"]                  │
└─────────────────────────────────────────────────┘
```

If no active session → skip this section entirely.

### Section 1 — Pipeline Progress Bar

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Project: [product name from PRD]
  Mode: [Solo / Team from user_mode]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Pipeline  ████████░░░░░░░░░░░░░░░░  3/8 phases
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ 1 · Onboarding    ✅ 2 · Planning    ⚡ 3 · Build
  🔒 4 · Polish        🔒 5 · Harden      🔒 6 · Ship
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Legend: ✅ complete · ⚡ active · 🔒 locked · ○ not started  
Derive segment states from onboarding + plan_progress + develop_phases (map planning to “Planning”, scaffold+plan flags to phases as appropriate).

### Section 2 — Where You Are (2 sentences max)

- Sentence 1: plain English — what stage you're in  
- Sentence 2: what you need to do to advance  

**Friendly tone:** short, no internal jargon.  
**Structured tone:** may name phases, artifacts, and gates.

### Section 3 — Active Phase Detail

```
┌─────────────────────────────────────────────────┐
│  Phase: [name]                                  │
│  Progress: ████████░░░░  4 of 6 steps done      │
│                                                 │
│  ✅ Step 1: [done]                              │
│  ✅ Step 2: [done]                              │
│  ✅ Step 3: [done]                              │
│  ✅ Step 4: [done]                              │
│  ⏳ Step 5: [in progress or pending]           │
│  🔒 Step 6: [locked until step 5 done]          │
└─────────────────────────────────────────────────┘
```

### Section 4 — Blockers (only if any exist)

```
❌ [plain English description of what's missing]
   Why it matters: [one sentence]
   Fix:
```

Then show the fix using the correct action block type from **Response Style System** (workspace-orchestration): PROMPT, TERMINAL, or SLASH COMMAND.  
If no blockers → `✅ No blockers — ready to proceed.`

### Section 5 — Next Action (always last, always actionable)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ▶  YOUR NEXT STEP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [What this does in one plain sentence]
```

Then one fenced action block (PROMPT / TERMINAL / COMMAND) per workspace rules.

---

## /GUIDE next — Single Action Mode

Read state files → determine the single best next action → output **ONLY**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Phase [X/8] · [Phase Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [One plain sentence — what this action does and why now]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then show the action in the correct fenced block.  
**Nothing else.** No extra headers, no explanation, no duplicate sections.

---

## /GUIDE phase — Active Phase Deep Dive

Show:

1. Phase name and goal (one sentence)  
2. Required artifacts — what must exist when this phase is done  
3. Each artifact status: ✅ complete · ⚠️ incomplete · ❌ missing  
4. Steps to complete this phase (numbered; each step shows exact command)  
5. What unlocks when this phase completes  
6. Next action block (same format as `/GUIDE next`)

---

## /GUIDE full — Complete Project Health

Everything from `/GUIDE status` **plus** a full phases table:

```
┌──────────────┬──────────┬──────────────┬───────────────────────┐
│ Phase        │ Status   │ Artifacts    │ Next Action           │
├──────────────┼──────────┼──────────────┼───────────────────────┤
│ 1 Onboarding │ ✅ Done  │ PRD + DESIGN │ —                     │
│ 2 Planning   │ ⚡ Active│ 3/6 done     │ /plan arch            │
│ 3 Build P1   │ 🔒 Locked│ 0/4 done     │ Complete planning     │
│ 4 Build P2   │ 🔒 Locked│ —            │ Complete Phase 1      │
│ 5 Build P3   │ 🔒 Locked│ —            │ Complete Phase 2      │
│ 6 Polish     │ 🔒 Locked│ —            │ Complete Phase 3      │
│ 7 Harden     │ 🔒 Locked│ —            │ Complete Polish       │
│ 8 Ship       │ 🔒 Locked│ —            │ Complete Hardening    │
└──────────────┴──────────┴──────────────┴───────────────────────┘
```

If `docs/nezam/plans/MASTER_TASKS.md` exists, also show open task counts by phase and any blocked tasks with reason.

---

## /GUIDE explain — Zero Jargon Mode

Rules:

- No file paths (say “your requirements doc” not `docs/prd/PRD.md`)  
- No gate names, hardlock, SDD, artifact, subphase, prompt artifact  
- No agent names or internal routing  
- No version numbers  

Format:

```
  Where you are:   [plain sentence]
  What's done:     [bullet list]
  What's next:     [one sentence + action]
  What's blocking: [plain sentence + fix]
```

---

## /GUIDE prompt — Generate Next Step Prompt

Read state → determine next step → emit a **self-contained** prompt the user can paste into any AI tool.

The prompt must:

- Have no placeholders — fill from state + PRD  
- Include exact paths the AI should read/write  
- State what good output looks like  
- End with acceptance criteria  

Use a **PROMPT** fenced block per workspace Response Style System.

---

## /GUIDE terminal — Generate Next Terminal Command

Read state → output the exact next shell command in a **TERMINAL** fenced block per workspace Response Style System.  
One sentence above the block explaining what it does.

---

## /GUIDE help

```
Usage: /GUIDE <subcommand>

Subcommands:
  status    → full pipeline status (default)
  next      → one next action only
  phase     → deep dive on active phase
  full      → full health + phases table
  explain   → plain English, no jargon
  help      → this message
  prompt    → paste-ready prompt for next step
  terminal  → next shell command to run

Examples:
  /GUIDE
  /GUIDE status
  /GUIDE next
```
