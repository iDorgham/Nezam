---
name: "nezam-system/skill-composer"
description: Resolve natural-language feature requests into an ordered NEZAM skill stack with MENA-aware routing.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose
Translate a user task description into the correct ordered skill stack automatically, so users do not need to know internal skill names.

# Inputs
- Natural-language task description.
- Detected product and domain context from active specs/context docs.
- Regional signals (MENA/Arabic/RTL and country mentions).

# Step-by-Step Workflow
1. Parse task text and extract:
   - domain signals (frontend, backend, design, SEO, security, data, content)
   - geography signals (MENA, RTL, Arabic, country/region mentions)
   - product signals (auth, payments, CMS, analytics, mobile, 3D)
2. Match extracted signals against the composition matrix:

| Signal | Primary skill | Secondary skills |
|--------|---------------|------------------|
| add login / auth / sign in | nezam-auth-workflows | nezam-api-design, nezam-security-hardening |
| payments / stripe / checkout | nezam-api-design | nezam-auth-workflows, mena_payment_routing (if MENA) |
| MENA payments / fawry / paymob / tabby | mena_payment_routing | nezam-api-design, nezam-auth-workflows |
| database / schema / migrations | nezam-supabase-architect OR nezam-prisma-orm | nezam-database-optimization |
| design system / tokens / components | nezam-pro-design-tokens | token-grid-typography, nezam-component-library-api |
| animation / motion / 3D | nezam-motion-3d-progressive | nezam-a11y-automation |
| SEO / ranking / search | seo-ia-content | nezam-structured-data-schema, nezam-topical-authority |
| Arabic content / MENA content | arabic_content_master OR egyptian_arabic_content_master | nezam-aeo-answer-engines |
| deploy / hosting / vercel | nezam-vercel-deploy | nezam-devops-pipeline, nezam-cdn-optimization |
| security / scan / harden | nezam-security-hardening | nezam-gh-security-compliance, nezam-secret-management |
| performance / speed / lighthouse | nezam-performance-optimization | nezam-cdn-optimization, nezam-cache-strategies |
| dashboard / analytics / charts | nezam-dashboard-patterns | nezam-monitoring-observability |
| CMS / content management / headless | nezam-cms-integration | nezam-editorial-workflows, nezam-content-modeling |
| test / testing / coverage | nezam-testing-strategy | nezam-testing-automation |
| plan / roadmap / phases | nezam-strategic-planning | nezam-phase-gating-roadmap, plan-full |

3. Build execution stack in dependency-safe order.
4. If MENA signals are present, force `mena_mode: true` and include regional payment/content handling.
5. Output resolved stack as YAML plan including reasons per step.
6. Execute skills sequentially in stack order.

# Validation & Metrics
- Every resolved stack includes at least one primary skill.
- Ordering is dependency-safe (upstream contract skills before implementation skills).
- MENA mode is applied when geographic/language signals indicate it.
- No parallel execution for overlapping write scopes.

# Output Format
Return:

```yaml
task: "<original task>"
detected_signals: [signal1, signal2]
mena_mode: true|false
skill_stack:
  - step: 1
    skill: skill-name
    reason: "plain-language reason"
execute: "Proceeding with steps in order..."
```

# Integration Hooks
- `/DEVELOP feature <description>` must route through this skill before implementation.
- `/START mena` should bias routing toward MENA-aware skills.
- Pairs with command router and hardlock manager checks.

# Anti-Patterns
- Do not require users to name skills explicitly.
- Do not run overlapping write-scope skills in parallel.
- Do not skip MENA detection for relevant geographies/languages.
- Do not emit unresolved stack ambiguities without a best-guess primary path.

# External Reference
- `.cursor/commands/develop.md`
- `.cursor/commands/start.md`
- `.cursor/rules/workspace-orchestration.mdc`
