# Design skill ingest queue

Tracks external design references and vendoring work for the NEZAM design skills platform.

**Active guide:** [`.nezam/core/plans/plans-design/DESIGN_SKILLS.md`](../.nezam/core/plans/plans-design/DESIGN_SKILLS.md)

## Status

| Skill ID | Upstream | Vendored in repo | Notes |
|----------|----------|------------------|--------|
| `emil-design-eng` | [emilkowal.ski/skill](https://emilkowal.ski/skill) | `.cursor/skills/emil-design-eng/` | `npx skills add emilkowalski/skill -g -y` then `pnpm skills:vendor-design` |
| `design-taste-frontend` | [tasteskill.dev](https://www.tasteskill.dev/) | `.cursor/skills/design-taste-frontend/` | `npx skills add Leonxlnx/taste-skill -g -y` then vendor |
| `stitch-design-taste` | [Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/cli/) | `.cursor/skills/stitch-design-taste/` | Includes extra `DESIGN.md` in skill folder |
| `impeccable` | [impeccable.style](https://impeccable.style/) | `.cursor/skills/impeccable/` | Managed in-repo; `impeccable@^2.1.9` for CLI detect |

## Refresh workflow

```bash
pnpm skills:vendor-design --force
pnpm skills:doctor-design
pnpm ai:sync
pnpm ai:check
```

## Not in scope (this queue)

- Always-on global skill injection in every agent prompt
- Replacing NEZAM design-gates with Impeccable-only enforcement
- Open Design daemon / live style-selector integration
