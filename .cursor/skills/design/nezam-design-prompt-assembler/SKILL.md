---
name: nezam-design-prompt-assembler
description: "Assemble opt-in designSkillStack references for prompt.json / PROMPT.md from .nezam/core/gates/design-skills.yaml. Use when prompt-engineer, /PLAN design, or /CREATE prompt needs external UI skills (Emil, Taste v2, Stitch, Impeccable) without pasting full skill bodies."
tier: 2
version: 1.0.0
updated: 2026-05-29
breaking_changes: false
changelog:
  - version: 1.0.0
    date: 2026-05-29
    notes: "Initial NEZAM assembler for designSkillStack."
---

# NEZAM Design Prompt Assembler

## When to use

- Building or updating `prompt.json` for a design-related subphase
- User enabled `designSkillStack.enabled: true` in the prompt schema
- Wiring prompt-engineer or design agents to external skills without bloating tokens

## Manifest

- **Source of truth:** `.nezam/core/gates/design-skills.yaml`
- **Template field:** `designSkillStack` in `.nezam/templates/plan/PROMPT_SCHEMA.template.json`

## Protocol

1. Read PRD (`.nezam/core/prd/PRD.md`) and root `DESIGN.md` for constraints.
2. Pick `phaseHint`: `plan_design`, `develop_ui`, or `wireframe` (defaults in manifest `default_stacks`).
3. Set `designSkillStack.enabled: true` and list skill **ids** only (not file contents).
4. Run assembler for path list:

```bash
node .nezam/core/scripts/skills/assemble-design-prompt.js --phase plan_design
node .nezam/core/scripts/skills/assemble-design-prompt.js --prompt .nezam/core/plans/04-design/prompt.json
```

5. In `PROMPT.md`, add a **Design skill stack** section with `@` path references:

```markdown
## Design skill stack (opt-in)

Load before UI work:
- @.cursor/skills/design/design-intelligence-index/SKILL.md
- @.cursor/skills/design-taste-frontend/SKILL.md
- @.cursor/skills/stitch-design-taste/SKILL.md
```

## Rules

- Never paste full vendored SKILL.md bodies into prompt.json.
- Prefer `design-intelligence-index` first, then phase-specific skills.
- Impeccable is for critique/polish passes, not initial layout generation.
- Refresh vendored skills: `pnpm skills:vendor-design` then `pnpm ai:sync`.
