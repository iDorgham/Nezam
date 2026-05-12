---
name: contact-enrichment
description: Integration patterns for third-party contact data enrichment.
---

# Contact Enrichment

## Purpose
Enhances customer profiles by automatically pulling missing data (Role, LinkedIn, Company Data) from external enrichment providers.

## Inputs
- Contact identifiers (Email, Domain).
- Provider API keys and mapping requirements.

## Step-by-Step Workflow
1. Trigger enrichment request on contact creation or manual refresh.
2. Map external provider fields to the internal contact schema.
3. Handle data conflicts (e.g., "Manual entry takes priority").
4. Log enrichment success and update metadata timestamps.

## Examples
```typescript
// Enrichment mapping
const internalProfile = {
  fullName: externalData.full_name,
  jobTitle: externalData.title,
  linkedInUrl: externalData.linkedin_url,
};
```

## Validation & Metrics
- Match Rate: > 80% success for corporate email addresses.
- Accuracy: Manual audits must show > 95% data correctness.

## Output Format
- Enrichment Provider Client (TypeScript)
- Data Mapping Config

## Integration Hooks
- `/SCAN` for data quality audits.
- External API integration gate.
