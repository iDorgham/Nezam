# NEZAM external design skills

Governed, repo-vendored design skills improve UI/UX output. They plug into **opt-in** `designSkillStack` blocks in subphase `prompt.json` files — not global always-on prompts.

## Canonical manifest

- **Manifest:** `.nezam/core/gates/design-skills.yaml`
- **Vendored skills:** `.cursor/skills/` (synced to mirrors via `pnpm ai:sync`)
- **Registry:** `.cursor/state/skills-registry.json` (generated)

## Skills

| ID | Purpose | Path |
|----|---------|------|
| `emil-design-eng` | Motion, interaction polish, performance-minded UI | `.cursor/skills/emil-design-eng/` |
| `design-taste-frontend` | Anti-slop frontend, brief inference, redesign audit | `.cursor/skills/design-taste-frontend/` |
| `stitch-design-taste` | Stitch-compatible semantic `DESIGN.md` | `.cursor/skills/stitch-design-taste/` |
| `impeccable` | Critique, audit, polish, slop detection | `.cursor/skills/impeccable/` |
| `design-intelligence-index` | Routing index (default stacks only) | `.cursor/skills/design/design-intelligence-index/` |

## Default stacks (by phase hint)

| Phase hint | Typical use |
|------------|-------------|
| `plan_design` | `/PLAN design`, design phase prompts |
| `develop_ui` | UI build slices, Design Hub, marketing pages |
| `wireframe` | Wireframe server / lock export |

## Commands

```bash
# Vendor upstream copies from ~/.claude/skills (after npx skills add …)
pnpm skills:vendor-design

# List + doctor manifest vs repo paths
pnpm skills:doctor-design

# Assemble stack JSON (stdout)
pnpm skills:assemble-design-prompt --phase develop_ui

# Write prompt.json + PROMPT.md section
pnpm skills:assemble-design-prompt --phase plan_design --write --dir docs/plan/04-design/example

# Enable/disable via workspace override
node .nezam/core/scripts/skills/design-skills-toggle.js disable emil-design-eng

# Stitch export bundle
bash .nezam/core/scripts/design/export-stitch-design-md.sh

# Impeccable slop (warn-only in CI)
bash .nezam/core/scripts/checks/check-impeccable-slop.sh .nezam/design-hub/src
```

## Cursor commands

```
/Settings skills list
/Settings skills doctor
/Settings skills update [id|all]
/Settings skills enable <id>
/Settings skills disable <id>
```

## Upstream install (first time)

```bash
npx skills add emilkowalski/skill -g -y
npx skills add Leonxlnx/taste-skill -g -y
pnpm skills:vendor-design --force
pnpm ai:sync
pnpm ai:check
```

## prompt.json

See `.nezam/templates/plan/PROMPT_SCHEMA.template.json` → `designSkillStack`. Agents load `@` paths from the stack only; do not paste full skill bodies.

## CI

- `pnpm ai:check` runs `check-design-skills.js` (manifest doctor).
- `.github/workflows/design-gates.yml` Gate 8: doctor + optional Impeccable slop (`continue-on-error`).

## Related

- Root `DESIGN.md` — SDD design contract
- `wireframes_locked.json` — develop hardlock
- Skill: `@.cursor/skills/design/nezam-design-prompt-assembler/SKILL.md`
