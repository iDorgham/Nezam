# Design System Inspired by Minimal

> Category: Modern & Minimal
> Stripped-back design emphasizing whitespace, clean typography, and restrained color for maximum clarity and focus.

## 1. Visual Theme & Atmosphere

Stripped-back design emphasizing whitespace, clean typography, and restrained color for maximum clarity and focus.

- **Visual style:** minimal, clean, bold
- **Color stance:** primary, neutral, success, warning, danger
- **Design intent:** Keep outputs recognizable to this style family while preserving usability and readability.

## 2. Color

- **Primary (Main):** `#0F172A` (Slate 900) — Deep obsidian-slate that commands presence and provides solid layout structure.
- **Secondary:** `#4F46E5` (Indigo 600) — Vibrant, premium royal indigo that anchors menus, headers, and secondary actions.
- **Accent:** `#F43F5E` (Rose 500) — High-vibrancy coral-rose used for focused highlights, active states, and interactive sparks.
- **Neutral (Surface):** `#FAF9F6` (Alabaster) — Extremely premium, warm off-white that replaces default gray for surfaces and backgrounds.
- **Success:** `#10B981` (Emerald 500) — Elegant, fresh mint-emerald for success states.
- **Warning:** `#F59E0B` (Amber 500) — Warm, amber-gold for warning alerts.
- **Danger:** `#EF4444` (Red 500) — Curated deep crimson-red for destructive actions.
- **Text:** `#0F172A` (Slate 900) — Matches Primary for absolute visual consistency and legibility.

- **Orchestration Guidelines:**
  - **Dominance (Primary):** Apply `#0F172A` for typography headers, layout boundaries, and key structural divisions.
  - **Support (Secondary):** Apply `#4F46E5` to draw guided focus to navigation nodes, tabs, and stable interfaces.
  - **Spark (Accent):** Use `#F43F5E` selectively (under the 60-30-10 rule) to elevate CTAs, hovered indicators, and key user actions.
  - **Canvas (Neutral):** Rely on `#FAF9F6` as the background canvas, preserving breathing room and layout breathing space.

## 3. Typography

- **Scale:** desktop-first expressive scale
- **Families:** primary=Open Sans, display=Inter, mono=Inconsolata
- **Weights:** 100, 200, 300, 400, 500, 600, 700, 800, 900
- Headings should carry the style personality; body text should optimize scanability and contrast.

## 4. Spacing & Grid

- **Spacing scale:** 4/8/12/16/24/32
- Keep vertical rhythm consistent across sections and components.
- Align columns and modules to a predictable grid; avoid ad-hoc offsets.

## 5. Layout & Composition

- Prefer clear content blocks with consistent internal padding.
- Keep hierarchy obvious: headline → support text → primary action.
- Use whitespace to separate concerns before adding borders or shadows.

## 6. Components

- Buttons: primary action uses `#0F172A` (Primary); accent actions use `#F43F5E` (Accent); secondary actions stay neutral.
- Inputs: strong focus-visible states, clear labels, and predictable error messaging.
- Cards/sections: use consistent radii, spacing, and elevation strategy across the page.

## 7. Motion & Interaction

- Use subtle transitions that emphasize Accent (#F43F5E) or Primary (#0F172A) as the interaction signal.
- Default to short, purposeful transitions (150–250ms) with stable easing.
- Ensure hover, focus-visible, active, disabled, and loading states are explicit.

## 8. Voice & Brand

- Tone should reflect the visual style: concise, confident, and product-specific.
- Keep microcopy action-oriented and avoid generic filler language.
- Preserve the style identity in headlines while keeping UI labels literal and clear.

## 9. Anti-patterns

- Do not introduce off-palette colors when an existing token can solve the problem.
- Do not flatten hierarchy by using the same type size/weight for all text.
- Do not add decorative effects that reduce readability or accessibility.
- Do not mix unrelated visual metaphors in the same interface.
