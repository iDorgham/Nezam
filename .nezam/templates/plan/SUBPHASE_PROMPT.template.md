# SUBPHASE Prompt

## Scope
- Phase: `XX-name`
- Sub-phase: `YY-name`

## Required Artifacts
- `prompt.json` based on `PROMPT_SCHEMA.template.json`
- `PROMPT.md` based on this template

## Design skill stack (opt-in)

When `prompt.json` includes `designSkillStack.enabled: true`:

- Phase hint: `{{PHASE_HINT}}` (e.g. `plan_design`, `develop_ui`, `wireframe`)
- Manifest: `.nezam/core/gates/design-skills.yaml`
- Load skills by `@` path only — see `skills` array in `prompt.json`
- Regenerate: `pnpm skills:assemble-design-prompt --phase {{PHASE_HINT}} --write --dir <this-folder>`

See `docs/plan/design/DESIGN_SKILLS.md`.

## Checklist
- [ ] Dependencies satisfied
- [ ] Prompt artifacts complete
- [ ] `designSkillStack` populated when UI scope (optional)
- [ ] GitHub start gate passed
- [ ] GitHub end gate passed
