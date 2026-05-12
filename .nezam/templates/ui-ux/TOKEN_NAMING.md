# Token Naming and Usage Rules

Use this as the canonical naming contract for design tokens in template-derived projects.

## Naming format

- Pattern: `--<category>-<role>-<variant>`
- Use lowercase kebab-case.
- Use semantic roles, not raw values.

Examples:

- `--color-bg-surface`
- `--color-text-primary`
- `--space-4`
- `--radius-lg`
- `--shadow-md`
- `--motion-duration-normal`

## Categories

- `color`: background, text, border, accent, status
- `font`: families only
- `font-size`, `line-height`: typographic scales
- `space`: spacing scale
- `radius`: corner radius scale
- `shadow`: elevation system
- `z`: layering roles
- `bp` and `container`: breakpoint/container sizing
- `motion`: duration and easing

## Required conventions

1. Semantic first:
   - Good: `--color-text-secondary`
   - Bad: `--color-gray-600`
2. Stable names across themes:
   - Theme changes values, not names.
3. No component-prefixed global tokens unless system-wide:
   - Avoid `--button-primary-bg` in global token files.
4. No hardcoded literals in component styles when token exists.
5. Keep aliases in one direction:
   - Semantic tokens may reference primitive tokens if used in advanced systems, but do not create cyclical references.

## RTL and direction compatibility

Token names must be direction-agnostic.

- Do not use names like `--padding-left-default`.
- Use logical meaning (`inline`, `block`) at style usage level.

## Validation checklist

- Every new style literal is reviewed for token replacement.
- New tokens include category and semantic role.
- Dark and light values are both defined for color/elevation where needed.
- Motion tokens have reduced-motion behavior.
