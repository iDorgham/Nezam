# Master Branch Protection Checklist
**Date:** 2026-06-04  
**Source:** `.cursor/skills/external/nezam-git-workflow/SKILL.md`  
**Repo:** https://github.com/iDorgham/Nezam

Apply these settings at: **Settings → Branches → Branch protection rules → Master**

---

## Required Settings

| Setting | Value | Notes |
|---|---|---|
| **Require a pull request before merging** | ✅ Enabled | No direct pushes to Master |
| **Required approvals** | ≥ 1 | At least one human review |
| **Dismiss stale pull request approvals when new commits are pushed** | ✅ Enabled | Forces re-review after force-push |
| **Require status checks to pass before merging** | ✅ Enabled | Gates must be green |
| **Require branches to be up to date before merging** | ✅ Enabled | No stale merges |
| **Require linear history** | ✅ Enabled | No merge commits — squash or rebase only |
| **Do not allow bypassing the above settings** | ✅ Enabled | Applies to admins too |

## Required Status Checks

These CI jobs must pass before merge is allowed:

| Check | Workflow |
|---|---|
| `branch-name` | `nezam-pr-gates.yml` |
| `design-tokens` | `nezam-pr-gates.yml` |
| `drift-verify` | `sync-and-drift-check.yml` |
| `sdd-gate-enforcement` (if present) | `sdd-gate-enforcement.yml` |

Add each under **"Require status checks to pass"** → search by job name.

## Optional but Recommended

| Setting | Recommendation |
|---|---|
| **Require signed commits** | Enable if team uses GPG/SSH signing |
| **Restrict who can push to matching branches** | Restrict to repo admins only |
| **Lock branch** | Only if treating Master as read-only between releases |

## Verification

After applying, confirm with:
```bash
gh api repos/iDorgham/Nezam/branches/Master/protection --jq '{
  required_reviews: .required_pull_request_reviews.required_approving_review_count,
  linear_history: .required_linear_history.enabled,
  enforce_admins: .enforce_admins.enabled,
  required_checks: [.required_status_checks.contexts[]]
}'
```
