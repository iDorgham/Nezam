---
skill_id: "infrastructure/product-analytics"
name: "product-analytics"
description: "Product analytics instrumentation and governance using PostHog patterns, feature flags, and session recording."
version: 1.1.0
updated: 2026-05-12
changelog:
  - version: 1.1.0
    date: 2026-05-12
    notes: "Wave 2 Upgrade: Added PostHog-specific SDK usage, feature flags, session recording, and A/B testing."
  - version: 1.0.0
    date: 2026-05-10
    notes: "Initial version metadata added."
owner: "lead-analytics-architect"
tier: 1
sdd_phase: "Development"
rtl_aware: false
certified: true
dependencies: ["infrastructure/monitoring-observability"]
---

# Product Analytics with PostHog

## Purpose

Establish a robust product analytics practice with PostHog for event capture, funnel analysis, feature flags, A/B testing, session recording, and unified user profiles.

## Trigger Conditions

- New product features require telemetry and success tracking.
- Rollout of A/B tests or controlled feature releases.
- Diagnosis of user friction points via session replays.

## Prerequisites

- PostHog project created and client keys available.
- Event taxonomy and naming conventions defined.

## Procedure

1. **SDK Setup:** Integrate the PostHog SDK (client-side and server-side) with standard capture APIs.
2. **Event Taxonomy:** Instrument events at critical user journey points using a consistent taxonomy. Validate properties.
3. **Profiles:** Link anonymous sessions to authenticated users using PostHog `person_profiles` identification strategies.
4. **Feature Flags:** Implement feature flags for safe deployments and targeted rollouts.
5. **Experimentation:** Configure A/B tests, linking exposure events to core product metrics.
6. **Session Replay:** Enable session recording selectively, ensuring privacy-sensitive fields are masked or excluded.

## Output Artifacts

- Instrumentation matrix (event, trigger, properties, owner).
- PostHog provider and hook wrappers in the codebase.
- Feature flag mapping and experiment definitions.

## Validation Checklist

- [ ] Events are complete, consistent, and correctly attributed to user profiles.
- [ ] Feature flag evaluations are fast and fail-safe.
- [ ] Session replays mask all PII and sensitive inputs.
- [ ] Experiments have stable exposure and metric events.

## Handoff Target

`frontend/react-architecture` for UI integration, or `quality/testing-automation` for verifying analytics payloads.
