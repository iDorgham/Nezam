# DESIGN — {{PROJECT_NAME}}

## 1. Visual Theme & Atmosphere

- Product archetype: `one-page | app-shell | editorial | storefront | dashboard`.
- Tone and design philosophy:
- Density model: `airy | balanced | dense`.

## 2. Color Palette & Semantic Roles


| Role       | Token               | Value | Usage | Contrast pair |
| ---------- | ------------------- | ----- | ----- | ------------- |
| Background | `--color-bg`        |       |       |               |
| Foreground | `--color-fg`        |       |       |               |
| Accent     | `--color-accent`    |       |       |               |
| Surface    | `--color-surface-1` |       |       |               |
| Danger     | `--color-danger`    |       |       |               |


## 3. Typography Rules

### 3.1 Fluid scale


| Role    | Token            | Value     |
| ------- | ---------------- | --------- |
| Display | `--type-display` | `clamp()` |
| H1      | `--type-h1`      | `clamp()` |
| H2      | `--type-h2`      | `clamp()` |
| Body    | `--type-body`    | `clamp()` |
| Caption | `--type-caption` | `clamp()` |


### 3.2 Breakpoint and container matrix


| Tier    | Min | Max | Container rules |
| ------- | --- | --- | --------------- |
| mobile  |     |     |                 |
| tablet  |     |     |                 |
| desktop |     |     |                 |
| wide    |     |     |                 |


## 4. Component Stylings


| Component | Variants | States | Token notes |
| --------- | -------- | ------ | ----------- |
| Button    |          |        |             |
| Card      |          |        |             |
| Section   |          |        |             |


## 5. Layout Principles

- Grid strategy:
- Spacing rhythm tokens:
- Content width strategy:

## 6. Depth, Elevation, and Motion Budgets

### 6.1 Elevation


| Layer   | Token | Use case |
| ------- | ----- | -------- |
| Base    |       |          |
| Raised  |       |          |
| Overlay |       |          |


### 6.2 Motion


| Token           | Value | Use case | Reduced motion fallback |
| --------------- | ----- | -------- | ----------------------- |
| duration-fast   |       |          |                         |
| duration-base   |       |          |                         |
| easing-standard |       |          |                         |


Animation constraints:

- Prefer composited properties (`transform`, `opacity`).
- Document max simultaneous animations.

### 6.3 Progressive 3D fallback chain


| Surface        | Primary (R3F/WebGL) | Fallback A (SVG/Canvas) | Fallback B (static) |
| -------------- | ------------------- | ----------------------- | ------------------- |
| Hero           |                     |                         |                     |
| Feature visual |                     |                         |                     |


## 7. Do's and Don'ts

Do:

- Use token aliases across all UI decisions.
- Preserve semantic hierarchy and readable rhythm.

Don't:

- Hardcode primitive visual values in component styles.
- Add motion without reduced-motion parity.

## 8. Responsive Behavior

- Navigation collapse behavior:
- Component resizing rules:
- Touch target minimums:

## 9. Agent Prompt Guide and Quick References

- Primary generation prompt:
- Component refinement prompt:
- Accessibility/performance review prompt:

## 10. Example Pages (text mocks)

### Page — Home

1. Hero (SEO H1, supporting copy, primary CTA)
2. Social proof
3. Features
4. CTA

### Page — {{SECOND_ROUTE}}

