# NEZAM external design skills

Governed, repo-vendored design skills improve UI/UX output. They plug into **opt-in** `designSkillStack` blocks in subphase `prompt.json` files — not global always-on prompts.

## Canonical manifest

| Artifact | Path |
|----------|------|
| Manifest | `.nezam/core/gates/design-skills.yaml` |
| Vendored skills | `.cursor/skills/` (mirrors via `pnpm ai:sync`) |
| Workspace overrides | `.nezam/core/gates/workspace.settings.yaml` → `design_skills.overrides` |
| Assembler skill | `.cursor/skills/design/nezam-design-prompt-assembler/SKILL.md` |
| Schema | `.nezam/templates/plan/PROMPT_SCHEMA.template.json` |

## Skills

| ID | Purpose | Path |
|----|---------|------|
| `emil-design-eng` | Motion, interaction polish, performance-minded UI | `.cursor/skills/emil-design-eng/` |
| `design-taste-frontend` | Anti-slop frontend, brief inference, redesign audit | `.cursor/skills/design-taste-frontend/` |
| `stitch-design-taste` | Stitch-compatible semantic `DESIGN.md` | `.cursor/skills/stitch-design-taste/` |
| `impeccable` | Critique, audit, polish, slop detection | `.cursor/skills/impeccable/` |
| `design-intelligence-index` | Routing index (included in default stacks) | `.cursor/skills/design/design-intelligence-index/` |

## Default stacks

Resolved from manifest `default_stacks`. The CLI flag is **`--phase`** (same values as `designSkillStack.phaseHint` in JSON).

| `--phase` / `phaseHint` | Skill order |
|------------------------|-------------|
| `plan_design` | design-intelligence-index → design-taste-frontend → stitch-design-taste → emil-design-eng → impeccable |
| `develop_ui` | design-intelligence-index → emil-design-eng → design-taste-frontend → impeccable |
| `wireframe` | design-intelligence-index → stitch-design-taste → impeccable |

| Typical use | Phase |
|-------------|--------|
| `/PLAN design`, design-phase prompts | `plan_design` |
| UI build slices, Design Hub, marketing pages | `develop_ui` |
| Wireframe server / lock export | `wireframe` |

## Package scripts

```bash
# Vendor upstream copies from ~/.claude/skills (after npx skills add …)
pnpm skills:vendor-design
pnpm skills:vendor-design --force   # overwrite vendored trees

# List skills + default stacks (same as /Settings skills list)
pnpm skills:list-design

# Verify manifest paths + frontmatter (also in pnpm ai:check)
pnpm skills:doctor-design

# Preview stack JSON on stdout (no files written)
pnpm skills:assemble-design-prompt --phase develop_ui

# Write prompt.json + PROMPT.md section into a subphase folder
pnpm skills:assemble-design-prompt --phase develop_ui --write --dir .nezam/core/plans/07-build/f-001-design-hub

# Enable/disable via workspace override (does not delete vendored files)
node .nezam/core/scripts/skills/design-skills-toggle.js disable emil-design-eng
node .nezam/core/scripts/skills/design-skills-toggle.js enable emil-design-eng

# Stitch export bundle (root DESIGN.md → .nezam/core/plans/design/stitch-export/)
bash .nezam/core/scripts/design/export-stitch-design-md.sh

# Impeccable slop scan (warn in CI; IMPECCABLE_SLOP_MODE=fail to hard-fail)
bash .nezam/core/scripts/checks/check-impeccable-slop.sh .nezam/design-hub/src
```

### Shell note (zsh)

Do **not** paste angle-bracket placeholders literally. In zsh, `<feature>` is input redirection.

| Wrong | Right |
|-------|--------|
| `--dir .nezam/core/plans/07-build/<feature>` | `--dir .nezam/core/plans/07-build/f-001-design-hub` |
| `--phaseHint develop_ui` | `--phase develop_ui` |

Use a real directory path. `--write` creates the folder if missing.

## Cursor commands

```
/Settings skills list
/Settings skills doctor
/Settings skills update [id|all]
/Settings skills enable <id>
/Settings skills disable <id>
```

Equivalent terminals:

```bash
pnpm skills:list-design
pnpm skills:doctor-design
pnpm skills:vendor-design --force && pnpm ai:sync
```

## Example: F-001 Design Hub build slice

After assembling the `develop_ui` stack:

| File | Role |
|------|------|
| `.nezam/core/plans/07-build/f-001-design-hub/prompt.json` | `designSkillStack` metadata for agents |
| `.nezam/core/plans/07-build/f-001-design-hub/PROMPT.md` | Human-readable stack with `@` skill paths |

Regenerate after manifest or stack changes:

```bash
pnpm skills:assemble-design-prompt --phase develop_ui --write --dir .nezam/core/plans/07-build/f-001-design-hub
```

Feature spec (requirements): `.nezam/core/plans/00-define/specs/F-001-design-hub.md`

## Upstream install (first time)

```bash
npx skills add emilkowalski/skill -g -y
npx skills add Leonxlnx/taste-skill -g -y
pnpm skills:vendor-design --force
pnpm ai:sync
pnpm ai:check
```

`impeccable` is managed in-repo under `.cursor/skills/impeccable/` — no separate vendor step.

## prompt.json contract

Optional field: `designSkillStack` (see `PROMPT_SCHEMA.template.json`).

- Set `enabled: true` and list skill IDs in `skills`, or run the assembler with `--write`.
- Agents load skills via **`@path`** references only — do not paste full `SKILL.md` bodies into prompts.
- Read `DESIGN.md` and the manifest before UI implementation when the stack is enabled.

## CI and gates

| Check | When |
|-------|------|
| `check-design-skills.js` | Every `pnpm ai:check` |
| Design-gates workflow Gate 8 | Doctor + Impeccable slop (`continue-on-error` on slop) |

## Related

| Topic | Path |
|-------|------|
| Root design contract | `DESIGN.md` |
| Wireframe develop hardlock | `wireframes_locked.json` (repo root or `.session/`) |
| Wireframe spec | `.nezam/core/plans/04-design/WIREFRAMES.md` |
| Ingest / vendor queue | `docs/INGEST_QUEUE.md` |
| Rule (agents) | `.cursor/rules/design-external-skills.mdc` |
