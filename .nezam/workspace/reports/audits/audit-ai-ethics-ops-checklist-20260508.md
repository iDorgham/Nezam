# AI Ethics Ops Checklist Templates (Domain-Agnostic)

Date: 2026-05-08  
Companion to: `docs/reports/audits/audit-ai-ethics-case-comparison-20260508.md`

Use these templates for AI-touching features across hiring, recommendation, credit/insurance, analytics, and decision-support systems.

---

## 1) PR Template: Ethics Checks

Copy/paste into your PR template:

```md
## Ethics Checks (Required for AI/ML-impacting changes)

### A) Scope and Risk Tier
- [ ] This change touches an AI/ML or algorithmic decision path.
- [ ] Decision impact tier assigned: `Low` / `Medium` / `High`.
- [ ] Harmed-user/protected-group risk surface documented.

### B) Data and Feature Controls
- [ ] Training/evaluation data source and time window documented.
- [ ] Representation checks run for relevant segments/groups.
- [ ] Proxy-risk review completed for features correlated to protected traits.
- [ ] Data minimization and retention constraints confirmed.

Artifacts:
- Data audit doc:
- Feature risk register:

### C) Model/Rule Behavior Validation
- [ ] Subgroup performance metrics reported (not only aggregate accuracy).
- [ ] Calibration checked where scores/probabilities are exposed or consumed.
- [ ] Fairness guardrails evaluated (for example disparity thresholds).
- [ ] Baseline comparison included (rules-based or previous model).

Artifacts:
- Evaluation pack:
- Fairness test output:

### D) Explainability and UX
- [ ] Decision rationale is available to internal reviewers.
- [ ] User-facing reason or explanation path is defined (if applicable).
- [ ] Appeals/override path is documented for high-impact outcomes.

Artifacts:
- Explanation spec:
- UX flow for appeal/override:

### E) Safety and Abuse Resistance
- [ ] Harm scenarios / misuse cases tested (red-team or adversarial checks).
- [ ] Fallback/abstain logic defined for low confidence or unsafe outputs.
- [ ] Rollback path documented and tested.

Artifacts:
- Harm test notes:
- Rollback procedure:

### F) Governance Sign-Off
- [ ] Engineering reviewer approved.
- [ ] Product owner reviewed (recommended).
- [ ] Ethics/Responsible AI reviewer approved.
- [ ] Security/Privacy reviewer approved.
- [ ] Legal/compliance reviewer approved.
- [ ] CTO/Engineering Head approved.

High-impact mandatory gate approvers (must all approve):
- [ ] Responsible AI Lead (E)
- [ ] Security & Privacy Lead (F)
- [ ] Head of Legal (D)
- [ ] CTO (A)

Sign-off summary:
- Engineering:
- Product:
- Ethics:
- Security/Privacy:
- Legal/Compliance:
- CTO/Engineering Head:

### G) Deployment and Monitoring Readiness
- [ ] Monitoring dashboard updated with subgroup/harm indicators.
- [ ] Alert thresholds defined and routed to an on-call owner.
- [ ] Incident severity rubric and response SLA linked.

Links:
- Dashboard:
- Alert policy:
- Runbook:
```

---

## 2) Release Ethics Gate Approval Form

Copy/paste into a release ticket, change request, or launch checklist:

```md
# Release Ethics Gate Approval Form

## Release Metadata
- Release name/version:
- Date:
- Service/system:
- Owner:
- Decision type: `Recommendation` / `Ranking` / `Classification` / `Scoring` / `Other`
- Impact tier: `Low` / `Medium` / `High`

## Gate Status Summary
- Gate 1: Problem Framing -> `Pass` / `Conditional` / `Fail`
- Gate 2: Data Readiness -> `Pass` / `Conditional` / `Fail`
- Gate 3: Model and Objective Design -> `Pass` / `Conditional` / `Fail`
- Gate 4: Validation and Explainability -> `Pass` / `Conditional` / `Fail`
- Gate 5: Release Governance -> `Pass` / `Conditional` / `Fail`
- Gate 6: Monitoring Readiness -> `Pass` / `Conditional` / `Fail`

Overall decision: `Approved` / `Approved with Conditions` / `Rejected`

## Evidence Package

### 1) Problem Framing
- Intended benefit:
- Potential harms:
- Affected groups:
- Human oversight model:

Evidence links:
- Risk map:
- Human override policy:

### 2) Data Readiness
- Data sources:
- Sampling window:
- Known representational limitations:
- Proxy feature risks:

Evidence links:
- Data audit report:
- Privacy/data ethics review:

### 3) Model/Logic Design
- Objective function or decision policy:
- Explicit fairness/safety constraints:
- Fallback/abstain behavior:

Evidence links:
- Design memo:
- Constraint implementation:

### 4) Validation and Explainability
- Aggregate performance:
- Subgroup performance:
- Fairness metrics:
- Calibration results:
- Explainability output quality:

Evidence links:
- Evaluation pack:
- Explanation tests:
- Harm scenario tests:

### 5) Governance and Compliance
- Applicable policy/regulatory obligations:
- Legal review outcome:
- Open exceptions:

Evidence links:
- Compliance checklist:
- Legal memo:

### 6) Monitoring and Incident Readiness
- KPIs and risk indicators:
- Alert thresholds:
- On-call owner:
- Rollback conditions:

Evidence links:
- Dashboard:
- Alert rules:
- Incident runbook:

## Open Risks and Conditions
- Risk ID:
- Description:
- Severity: `Low` / `Medium` / `High` / `Critical`
- Mitigation required before/after release:
- Owner:
- Due date:

## Approval Signatures
Mandatory high-impact approvers (A + D + E + F):
- CTO: `Approve` / `Reject` / `Conditional` - Name/Date:
- Head of Legal: `Approve` / `Reject` / `Conditional` - Name/Date:
- Responsible AI Lead: `Approve` / `Reject` / `Conditional` - Name/Date:
- Security & Privacy Lead: `Approve` / `Reject` / `Conditional` - Name/Date:

Recommended supporting reviewers (non-blocking unless local policy says otherwise):
- Engineering Lead: `Approve` / `Reject` / `Conditional` - Name/Date:
- Product Lead: `Approve` / `Reject` / `Conditional` - Name/Date:
```

---

## 3) Monitoring Thresholds + Incident Response Runbook

Copy/paste into an operational runbook:

```md
# AI Ethics Monitoring and Incident Response Runbook

## A) Monitoring Metrics and Thresholds

Define thresholds per system and baseline. Keep segmented views by relevant cohorts/proxies.

### 1. Outcome Disparity
- Metric: Difference in favorable outcome rate between reference and monitored group.
- Warning threshold: > `3%` absolute deviation from approved baseline in any weekly window.
- Critical threshold: > `5%` absolute deviation for `2` consecutive weekly windows, or `>7%` in any single window.
- Owner: Responsible AI + Analytics.

### 2. Error/Quality Disparity
- Metric: Group-level false positives/false negatives (or equivalent quality gaps).
- Warning threshold: subgroup error-rate gap exceeds `2 percentage points`.
- Critical threshold: subgroup error-rate gap exceeds `4 percentage points`, or any materially harmful class exceeds approved risk limit.
- Owner: ML Engineering + QA.

### 3. Calibration Drift (if scoring/probabilities used)
- Metric: Calibration error by segment.
- Warning threshold: expected calibration error (ECE) > `0.03` for any monitored segment.
- Critical threshold: ECE > `0.05` for high-impact segments, or sustained warning for `2` consecutive windows.
- Owner: ML Engineering.

### 4. Appeal/Complaint Signal
- Metric: Appeals per 1,000 automated decisions.
- Warning threshold: +`20%` over trailing 4-week baseline.
- Critical threshold: +`35%` over baseline in any week, or warning breach for `2` consecutive weeks.
- Owner: Product Ops + Support.

### 5. Harm Exposure (recommender/use-case specific)
- Metric: Exposure share to harmful or policy-violating content/items.
- Warning threshold: harmful exposure share > `0.8%`.
- Critical threshold: harmful exposure share > `1.5%`, or week-over-week increase > `30%`.
- Owner: Trust/Safety + Product.

### 6. Override/Rollback Health
- Metric: Manual override rate and rollback-trigger events.
- Warning threshold: override rate > `5%` of automated decisions for any high-impact workflow.
- Critical threshold: rollback triggers hit.
- Owner: On-call Engineering + Product.

## B) Alert Routing
- P1/Critical alerts -> Pager/On-call immediately.
- P2/Warning alerts -> Daily triage queue.
- All alerts must include:
  - metric name,
  - impacted segment(s),
  - time window,
  - current vs baseline,
  - linked dashboard query.

## C) Incident Severity Rubric
- `SEV-1`: Confirmed material harm/discrimination risk in high-impact decisions, or critical threshold breach with active user impact.
- `SEV-2`: Significant metric breach with plausible user harm, not yet systemic, or repeated warning breaches without containment.
- `SEV-3`: Early warning drift without confirmed user harm.
- `SEV-4`: Informational anomaly.

## D) Response Workflow

### Step 1: Detect and Triage (0-30 min for SEV-1/2)
- Confirm signal validity (data pipeline sanity check).
- Identify impacted population, scope, and duration.
- Assign incident commander.

### Step 2: Contain (within SLA)
- Apply safe fallback (human review, rules-only mode, feature disable, or rollback).
- Pause risky model path if high-impact harm is suspected.
- Log containment action timestamp and owner.
- For confirmed discrimination/safety harm in high-impact workflows, containment is mandatory before next release action.

### Step 3: Investigate
- Compare pre/post drift by segment.
- Review recent code/data/model/config changes.
- Re-run fairness and calibration suites on current data slice.
- Determine root cause category:
  - data shift,
  - feature proxy leakage,
  - objective/regression,
  - threshold/config bug,
  - monitoring gap.

### Step 4: Remediate
- Implement fix (data, model, policy, threshold, UX explanation, or routing).
- Validate with targeted subgroup tests.
- Re-approve through ethics gate sign-off before full re-enable.

### Step 5: Communicate
- Internal update cadence:
  - SEV-1: every 60 minutes
  - SEV-2: every 4 hours
  - SEV-3: daily
- Prepare external/user communication where required by policy or law.
- Mandatory notification path for SEV-1/SEV-2:
  - `#exec-oncall` (CTO escalation path)
  - `#responsible-ai`
  - `#sec-privacy`
  - `#legal-escalation`

### Step 6: Recover and Learn
- Confirm metrics return within accepted thresholds.
- Close incident only after sustained stability window (`N` periods).
- Publish post-incident review with:
  - root cause,
  - impact estimate,
  - corrective actions,
  - prevention actions,
  - control owners and deadlines.

## E) Minimum SLA Targets (Customize)
- Time to acknowledge:
  - SEV-1: 10 min
  - SEV-2: 20 min
- Time to containment:
  - SEV-1: 30 min
  - SEV-2: 2 hours
- Time to remediation plan:
  - SEV-1/2: 12 hours

## F) Required Links
- Live dashboard:
- Alert policy:
- Rollback playbook:
- Ethics gate form:
- Incident tracker:
- Post-incident template:
```

---

## Usage Guidance

- Keep thresholds contextual: set by baseline, impact tier, and legal risk.
- Enforce role-based sign-off for high-impact systems.
- Treat fairness/safety threshold breaches as release blockers when material.
- Review templates quarterly to reflect new policy and regulatory changes.
