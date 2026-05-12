---
name: omnichannel-routing
description: Unified routing and logging for multi-channel customer communications.
---

# Omnichannel Routing

## Purpose
Routes incoming communications (Email, WhatsApp, SMS) to the correct CRM contact and account, maintaining a unified interaction timeline.

## Inputs
- Webhook payloads from communication providers (Twilio, SendGrid, etc.).
- Contact lookup logic and matching rules.

## Step-by-Step Workflow
1. Parse incoming webhook payload for sender identifier (Phone/Email).
2. Lookup matching contact in the CRM database.
3. Route the message to the contact's interaction timeline.
4. Trigger notifications for the account owner or assigned agent.

## Examples
```typescript
// Lookup and route
const contact = await db.contacts.findByPhone(payload.from);
if (contact) {
  await db.interactions.create({
    contactId: contact.id,
    type: 'SMS',
    body: payload.body,
  });
}
```

## Validation & Metrics
- Reliability: 100% of incoming messages must be logged or held in a retry queue.
- Latency: Interaction logging < 500ms from webhook receipt.

## Output Format
- Webhook Handlers (TypeScript/Node.js)
- Routing Logic Configuration

## Integration Hooks
- `/SCAN` for communication log integrity.
- External service configuration gate.
