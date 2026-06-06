# Deployment & Rollback Runbook

This document details the step-by-step procedures for deploying new releases of the NEZAM visual design hub and executing rollbacks in the event of failure.

---

## 1. Deployment Procedures

### Staging Deployment
Staging deployments run automatically on every push to the `Master` branch via GitHub Actions once all pull request quality gates pass.

1. **Verify build status:**
   Ensure all CI gates in the PR are green.
2. **Review auto-deployment logs:**
   Monitor the `.github/workflows/silent-deploy.yml` run for staging.
3. **Run staging smoke tests:**
   Navigate to the staging environment and verify:
   - The homepage loads in < 1.5s.
   - Sitemap page tree loads.
   - Token check exits 0.

### Production Release (Human-Gated)
Production deployment is triggered by creating a new release or tagging the branch on Master.

1. **Create SemVer Tag:**
   ```bash
   git tag -a v3.2.0 -m "Release v3.2.0"
   git push origin v3.2.0
   ```
2. **Monitor Release Pipeline:**
   Verify that `.github/workflows/release.yml` starts and finishes cleanly.
3. **Verify CDN Caching:**
   Purge edge caches if critical assets or styling guidelines were updated.

---

## 2. Fallback & Rollback Protocol

If a production deployment introduces critical regressions (e.g., LCP > 4s, server crash, auth failure):

### Step 1: Trigger Rollback
Revert the Master branch to the last known stable tag:
```bash
git checkout v3.1.8
git tag -d v3.2.0
git push --delete origin v3.2.0
git checkout Master
git merge --strategy-option=ours v3.1.8
git push origin Master
```

### Step 2: Clear Edge Cache
Immediately trigger a CDN cache purge to invalidate any broken bundles or CSS files on edge nodes.

### Step 3: Verify Restoration
Verify that the production environment reflects the reverted version and that health metrics return to their baseline.
