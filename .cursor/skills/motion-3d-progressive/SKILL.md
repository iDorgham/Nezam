# Purpose
Design and implement motion plus optional 3D interactions as progressive enhancements with strict accessibility and performance guardrails.

# Activation & precedence
- Activate during `/PLAN design` for motion-heavy UI, or before `/DEVELOP` when animations/3D are introduced.
- This skill defines deterministic implementation and validation artifacts.
- If guidance conflicts, follow `.cursor/rules/design-dev-gates.mdc` first, then this skill.

# Inputs
- `DESIGN.md` motion language and interaction narratives.
- Token definitions for duration, easing, and depth tiers.
- Component specs and state diagrams.
- Device/power constraints and reduced-motion requirements.
- Existing animation library choices (Framer Motion, GSAP, CSS).

# Step-by-Step Workflow
1. Categorize motion intents: navigation, emphasis, feedback, transitions, and ambient.
2. Define timing/easing tokens and map each motion category to allowable ranges.
3. Choose implementation path:
   - CSS transitions/keyframes for simple state changes.
   - Framer Motion for declarative React state transitions.
   - GSAP only for complex timeline choreography requiring sequence control.
4. Restrict animated properties to `transform` and `opacity`; reject layout-triggering properties.
5. Add `@media (prefers-reduced-motion: reduce)` alternatives for every non-essential animation.
6. For 3D:
   - Build React Three Fiber scenes behind `Suspense`.
   - Detect low-power / constrained environments.
   - Provide fallback chain: R3F -> SVG/Canvas snapshot -> static illustration.
7. Scope `will-change` to active interactions only; remove after completion.
8. Define scene budgets (draw calls, texture sizes, poly count) and lazy-load 3D bundles.
9. Document choreography and fallback behavior in `DESIGN.md` and component stories.

# Validation & Metrics
- Smoothness target: sustained 60fps on representative hardware.
- Core Web Vitals: LCP `< 2.5s`, CLS `< 0.1`, INP `< 200ms`.
- Accessibility: full reduced-motion coverage and keyboard-safe interactions.
- Bundle budgets: animation + 3D deps remain within agreed threshold.
- Runtime checks: no long tasks introduced by animation orchestration.
- Fallback integrity: every 3D surface has verified non-WebGL rendering path.

# Deterministic completion checklist
- Every animation maps to declared timing/easing tokens.
- Reduced-motion behavior is specified for each non-essential motion path.
- Animated properties are limited to `transform` and `opacity`, or exceptions are documented.
- Each 3D surface documents fallback chain: `R3F -> SVG/Canvas -> static`.
- Scene budgets (draw calls/textures/poly count) are documented with acceptance limits.

# Output Format
- `motion/timings.json` (durations, easings, categories)
- `motion/presets.ts` (library-agnostic motion presets)
- `motion/reduced-motion.css` (global reduced-motion overrides)
- `motion/r3f-fallbacks.md` (scene fallback chain)
- `components/*/motion.config.ts` (component-specific choreography)

# Integration Hooks
- `/PLAN design`: validate motion narrative and budget before build.
- `/DEVELOP feature`: enforce per-component motion specs.
- `/SCAN perf` and `/SCAN a11y`: verify jank/reduced-motion compliance.
- CI: block merges on missing reduced-motion or budget violations.
- `DESIGN.md`: keep motion and fallback sections synchronized.
