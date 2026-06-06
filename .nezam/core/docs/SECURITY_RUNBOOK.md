# NEZAM Security Runbook & Credentials Rotation Schedule

> **Version:** 1.0.0  
> **Last Updated:** 2026-06-06  
> **Owner:** Lead Security Officer  

---

## 1. Secrets Rotation Schedule

To maintain a secure posture, credentials must be rotated on a predefined schedule, or immediately following key events (such as developer offboarding or a suspected leak).

| Credential Type | Scope | Rotation Cadence | Action Steps |
|---|---|---|---|
| **Auth0 Keys / Secrets** | OAuth integration | Quarterly (90 days) | Generate new key pair in Auth0 Dashboard -> Update GitHub Secrets -> Deploy -> Revoke old key. |
| **GitHub Access Tokens** | CI/CD, GHA workflows | Yearly (365 days) | Generate new Fine-Grained Personal Access Token (PAT) with minimal permissions -> Update Repository Secrets. |
| **Vercel / Hosting API Keys**| Deployment, Preview integration | Yearly or on team change | Revoke key in Vercel settings -> Create new key -> Update repository configuration. |
| **Developer Git Hooks** | Local commit security | On-boarding / Re-key | Re-run `pnpm install` and Husky setup to ensure local secret-scanning rules are active. |

---

## 2. GitHub Secret Scanning & Push Protection

GitHub's native **Secret Scanning** and **Push Protection** are active on the repository level. 

### Push Protection Block Mitigation
If a commit contains a suspected credential, GitHub will block the push with an error message:

```text
remote: error: GH009: Secrets detected!
remote: - Secret detected: Auth0 Client Secret (High Entropy)
```

**How to Remediate:**
1. **Remove the Secret:** Reword the commit or use `git reset HEAD~1` to remove the secret from history.
2. **Apply Environment Variables:** Ensure the secret is loaded from environment variables (`process.env`) instead of hardcoding.
3. **If False Positive:** Only bypass with explicit authorization using the GitHub bypass URL provided in the terminal output.

---

## 3. Incident Response for Leaked Credentials

In the event of a credential leak (e.g., secret pushed to a public repository or exposed in build logs):

### Step 1: Revocation (Immediate)
Within **15 minutes** of detection, the security lead must revoke the leaked key at the provider console (e.g., Auth0, GitHub, Vercel, or Stripe).

### Step 2: Audit Logs
Check the provider's audit logs to determine if the leaked credential was abused:
- Inspect API call timestamps.
- Validate request IP addresses.

### Step 3: Rotation & Deployment
1. Generate a replacement secret.
2. Update the secret in GitHub Settings under **Security > Secrets and variables > Actions**.
3. Re-run the deployment pipeline to propagate the new secret.

### Step 4: Git History Cleansing (If Applicable)
If the secret was committed to the git history:
- Use `git-filter-repo` or BFG Repo-Cleaner to permanently purge the file/commit from history.
- **Do not** just make a follow-up commit deleting the file, as it remains in history.
