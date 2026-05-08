## Performance and Accessibility Hardening Contract

### Core budgets (release gate)

| Metric | Target | Stop condition |
| ------ | ------ | -------------- |
| LCP | `< 2.5s` | Any representative flow exceeds target in baseline environment |
| CLS | `< 0.1` | Layout instability exceeds target on key pages |
| INP | `< 200ms` | Interaction latency exceeds target for critical actions |
| WCAG contrast | `2.2 AA` | Any unresolved contrast violation in core routes |
| Reduced motion | Required | Any non-essential motion lacks reduced-motion alternative |

### Measurement protocol

1. Run `/SCAN a11y perf` on major route templates and high-traffic screens.
2. Capture before/after values for LCP, CLS, INP and record in this file.
3. Validate keyboard focus order, landmarks, and visible focus indicators.
4. Validate `prefers-reduced-motion` behavior for all animated surfaces.

### Evidence log

| Date | Scope | LCP | CLS | INP | A11y summary | Owner |
| ---- | ----- | --- | --- | --- | ------------ | ----- |
|      |       |     |     |     |              |       |

### Regression response

- If any budget fails, halt release progression and run `/FIX` before re-testing.
- For motion-related regressions, rollback to reduced-motion-safe presets first.
- For layout shift regressions, prioritize token/grid/container-query corrections.

### Release sign-off checklist

- [ ] Core budgets pass on representative environments.
- [ ] Reduced-motion behavior verified for non-essential animations.
- [ ] Landmark and focus navigation checks pass.
- [ ] Evidence log updated with latest scan results.
