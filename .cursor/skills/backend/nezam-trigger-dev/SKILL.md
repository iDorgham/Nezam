---
skill_id: nezam-trigger-dev"
name: "nezam-trigger-dev"
description: "Architects and implements Trigger.dev for background jobs, AI agent coordination, and cron tasks."
version: 1.0.0
updated: 2026-05-12
changelog:
  - version: 1.0.0
    date: 2026-05-12
    notes: "Initial Wave 2 implementation."
owner: "backend-lead"
tier: 1
sdd_phase: "Development"
rtl_aware: false
certified: true
dependencies: ["infrastructure/observability-advanced"]
---
# Trigger.dev Background Jobs

## Purpose

Implement reliable background jobs, realtime streaming, cron tasks, and AI agent integration using Trigger.dev. Focuses on cost-saving patterns, concurrency control, and safe `triggerAndWait()` patterns.

## Trigger Conditions

- Long-running backend tasks (e.g., AI generation, video processing).
- Scheduled cron tasks.
- Complex workflows requiring concurrency control.
- Heavy webhook processing (e.g., Stripe events).

## Prerequisites

- Project connected to Trigger.dev environment.
- Environment variables configured (TRIGGER_API_KEY).

## Procedure

1. **Task Definition:** Use v3 SDK patterns. Define tasks with strict type definitions for payloads.
2. **Concurrency:** Configure concurrency limits on tasks to prevent overwhelming downstream services or APIs.
3. **AI Agents:** Use Trigger.dev realtime streaming for long-running AI workflows.
4. **Cost Optimization:** Implement wait batching, early exits, and cold-start avoidance to minimize compute costs.
5. **Safety:** When using `triggerAndWait()`, ensure robust error handling and timeout configurations to avoid blocked workflows.

## Output Artifacts

- Trigger.dev task definitions (`src/trigger/*.ts`).
- Workflow configuration (`trigger.config.ts`).
- React hooks for realtime job status updates.

## Validation Checklist

- [ ] Concurrency limits defined for external API-heavy tasks.
- [ ] Long-running AI jobs stream updates successfully.
- [ ] `triggerAndWait()` calls have appropriate timeout handling.
- [ ] Tasks are properly versioned and deployed.

## Handoff Target

`frontend/react-architecture` for UI integration of realtime task status, or `quality/testing-strategy` for workflow tests.
