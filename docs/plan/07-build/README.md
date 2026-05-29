# Build-phase planning artifacts

Per-feature subfolders hold SDD **prompt packs** for `/DEVELOP` slices: `prompt.json`, `PROMPT.md`, and optionally `SPEC.md`.

## Layout

```
docs/plan/07-build/
└── <feature-slug>/
    ├── prompt.json      # Machine-readable prompt + optional designSkillStack
    ├── PROMPT.md        # Human/agent prompt body
    └── SPEC.md          # Feature spec (when created)
```

## Active slices

| Folder | Feature | Notes |
|--------|---------|--------|
| `f-001-design-hub/` | F-001 Design Hub | `develop_ui` stack assembled; see `prompt.json` |

## Design skill stacks

External design skills are **opt-in** per subphase via `designSkillStack` in `prompt.json`.

```bash
# Example: refresh F-001 develop stack
pnpm skills:assemble-design-prompt --phase develop_ui --write --dir docs/plan/07-build/f-001-design-hub
```

Full guide: [`../design/DESIGN_SKILLS.md`](../design/DESIGN_SKILLS.md)

Spec reference: [`../00-define/specs/F-001-design-hub.md`](../00-define/specs/F-001-design-hub.md)
