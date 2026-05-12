---
name: saas-billing-orchestration
description: Subscription management, usage metering, and billing lifecycle logic.
---

# SaaS Billing Orchestration

## Purpose
Manages the end-to-end billing lifecycle for SaaS tenants, including subscription tiers, usage-based metering, and payment gateway sync.

## Inputs
- Pricing model (Fixed, Usage-based, Tiered).
- Payment gateway API (Stripe, etc.).

## Step-by-Step Workflow
1. Map application feature flags to billing subscription tiers.
2. Implement usage metering collectors for billable events.
3. Coordinate subscription status sync with the payment provider.
4. Handle payment failure flows (Grace periods, Dunning, Suspension).

## Examples
```typescript
// Metered usage reporting
const reportUsage = async (tenantId, metric, amount) => {
  await stripe.subscriptionItems.createUsageRecord(
    subscriptionItemMap[tenantId][metric],
    { quantity: amount }
  );
};
```

## Validation & Metrics
- Accuracy: 100% match between internal usage logs and provider billing.
- Reliability: 0 missed usage reporting events.

## Output Format
- Billing Client (TypeScript/Node.js)
- Subscription Mapping Config

## Integration Hooks
- `/SCAN` for billing data consistency.
- External payment provider gate.
