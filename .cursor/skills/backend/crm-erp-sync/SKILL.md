---
name: crm-erp-sync
description: Design and implementation of data synchronization between CRM and ERP systems.
---

# CRM-ERP Sync

## Purpose
Ensures financial and customer data consistency between the CRM (Sales) and ERP (Operations/Accounting) systems.

## Inputs
- ERP API documentation (SAP, Oracle, Odoo, etc.).
- Field mapping requirements and conflict resolution rules.

## Step-by-Step Workflow
1. Define bi-directional mapping between CRM 'Accounts' and ERP 'Customers'.
2. Implement change-detection triggers in both systems.
3. Handle sync conflicts (e.g., "ERP is the master for financial data").
4. Log all sync operations and handle network/API failures with retries.

## Examples
```typescript
// Conflict resolution rule
if (source === 'ERP' || crmRecord.updatedAt < erpRecord.updatedAt) {
  return applyUpdate(crmRecord, erpRecord);
}
```

## Validation & Metrics
- Consistency: Weekly audits must show < 0.1% data drift.
- Reliability: 0 permanent sync failures (all must eventually resolve or alert).

## Output Format
- Sync Logic Implementation
- Field Mapping Matrix (CSV/JSON)

## Integration Hooks
- `/SCAN` for cross-system data consistency.
- External system authentication gate.
