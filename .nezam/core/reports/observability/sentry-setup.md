# Sentry Integration Report

This document details the configuration and verification of Sentry error tracking within the NEZAM Design Hub application.

## 1. Sentry Setup

Sentry has been integrated into the `@nezam/design-hub` Next.js application.

### Configuration Files Created
1. **[sentry.client.config.ts](file:///.nezam/design-hub/sentry.client.config.ts):** Initialized Sentry for browser-side error reporting.
2. **[sentry.server.config.ts](file:///.nezam/design-hub/sentry.server.config.ts):** Initialized Sentry for Node.js API routes and server-side rendering errors.
3. **[sentry.edge.config.ts](file:///.nezam/design-hub/sentry.edge.config.ts):** Initialized Sentry for Edge runtime segments (middlewares, edge APIs).

### Build Integration
`next.config.js` is wrapped with Sentry configuration:
```javascript
const { withSentryConfig } = require('@sentry/nextjs');
```
It utilizes a fallback try/catch block to support building successfully when the Sentry package is not installed or when running in a sandboxed offline developer workspace.

---

## 2. Alerts & Triaging

- All critical and high exceptions are piped to the `#ops-alerts-nezam` Slack channel.
- Auto-resolved when commits reference the issue ID in the format `fix: sentry-ID`.
