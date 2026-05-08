/DEPLOY — Ship, verify, and monitor releases

Subcommands:
  /DEPLOY staging   → Deploy to staging environment, run smoke tests
  /DEPLOY prod      → Deploy to production (requires staging sign-off)
  /DEPLOY verify    → Post-deploy verification: health checks, error rates, performance
  /DEPLOY rollback  → Revert to last known-good deployment with one command
  /DEPLOY monitor   → Show live deployment metrics and error dashboard
  /DEPLOY rc        → Create a release candidate build for QA sign-off
  /DEPLOY notes     → Generate human-readable release notes from CHANGELOG

Pre-flight: staging sign-off required before /DEPLOY prod.
All deploy events logged to CHANGELOG.md automatically.
Recommendation footer: required
