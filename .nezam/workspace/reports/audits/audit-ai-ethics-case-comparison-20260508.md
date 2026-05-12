# AI Ethics Case Comparison (Cross-Domain Template)

Date: 2026-05-08  
Scope: Hiring/HR, recommendation systems, and credit/insurance style decision platforms  
Cases: Amazon Recruiting, Apple Card, TikTok/YouTube recommendation harms, IBM Watson for Oncology

## Purpose

Provide one reusable comparison artifact that:
- normalizes major AI ethics failures across a single schema,
- scores them using a shared ethics rubric,
- maps each failure pattern to preventive controls at each SDLC stage,
- assigns owner roles and pass/fail criteria for operational use.

## Canonical Rubric (0-10, higher is better)

Dimensions aligned to the ethics swarm roles:
- Fairness and non-discrimination (Bias and Fairness agent)
- Privacy and data ethics (Privacy/Data Ethics agent)
- Transparency and explainability (Explainability agent)
- Safety and harm prevention (Safety/Misuse Prevention agent)
- Accountability and governance (Lead Ethics + Product/Legal accountability)

Scoring bands:
- 0-3: Critical failure
- 4-6: Material risk / partial controls
- 7-8: Good controls, notable gaps remain
- 9-10: Strong controls with auditable evidence

## Normalized Case Comparison

| Case | System Purpose | Harmed Groups | Primary Failure Mode | Root Causes (Data/Objective/UX/Governance) | Detection Signals | Regulatory/Legal Exposure | Fairness | Privacy | Explainability | Safety | Accountability | Overall |
|---|---|---|---|---|---|---|---:|---:|---:|---:|---:|---:|
| Amazon Recruiting (2014-2018) | Resume screening and candidate ranking | Women applicants | Gender-discriminatory ranking via proxy features | Data: male-skewed historical resumes; Objective: optimize historical hiring patterns; UX: low reviewer visibility into model rationale; Governance: no robust pre-launch fairness gate | Term-level penalties (for example "women's"), degraded outcomes for women's colleges, internal bias findings during validation | Employment discrimination risk (EEOC-like scrutiny), reputational harm | 2 | 4 | 2 | 2 | 3 | 2.6 |
| Apple Card gender bias controversy (2019) | Credit limit and lending decisions | Women and potentially other protected cohorts | Disparate outcomes in credit limits for similar household profiles | Data: opaque bureau/financial features with proxy effects; Objective: risk optimization without explicit fairness constraints; UX: insufficient adverse-action clarity; Governance: weak explainability in customer handling | Public complaint clusters showing spousal limit disparities, inability to explain differences to affected users | Fair lending and anti-discrimination oversight; consumer protection scrutiny | 3 | 5 | 3 | 3 | 4 | 3.6 |
| TikTok/YouTube recommendation echo-chambers | Engagement optimization for content recommendations | Users vulnerable to extremity, misinformation, minors, marginalized groups | Reinforcement loops that amplify narrow or harmful content pathways | Data: feedback loops from prior engagement; Objective: maximize watch-time/CTR; UX: limited control over recommendation rationale; Governance: weak guardrails on harmful amplification | Rising concentration in narrow content clusters, increased harmful content adjacency, trust/safety incident growth | Platform safety and child-protection regulations, online safety enforcement actions | 4 | 4 | 3 | 2 | 4 | 3.4 |
| IBM Watson for Oncology | Clinical treatment recommendation support | Cancer patients and clinicians relying on outputs | Unsafe or low-quality recommendations due to weak real-world grounding | Data: limited/curated expert source bias; Objective: overfit to narrow curation and benchmark narratives; UX: confidence signaling not sufficiently calibrated for frontline use; Governance: deployment pressure and evidence gaps | Internal and partner reports of inconsistent/unsafe suggestions, poor real-world fit across hospitals | Medical device/clinical safety scrutiny, contractual and liability exposure | 4 | 6 | 4 | 2 | 3 | 3.8 |

## Standardized Case Notes (Concise)

### 1) Amazon Recruiting
- High-stakes employment pipeline where historical imbalance became model behavior.
- Attempts to remove explicit terms did not eliminate latent proxies.
- Key takeaway: fairness constraints and parity testing must be first-class release criteria.

### 2) Apple Card controversy
- Financial allocation decisions showed potentially discriminatory patterns not explainable to customers.
- Even if direct protected attributes are absent, proxy pathways can still create disparate impact.
- Key takeaway: adverse-action explainability and periodic fairness audits are mandatory in credit-like systems.

### 3) Recommendation echo-chambers
- Optimization around engagement can unintentionally reward polarizing or harmful content dynamics.
- Harm is often emergent over time, not visible in static offline metrics.
- Key takeaway: safety metrics and exposure-diversity controls must co-equal engagement KPIs.

### 4) Watson for Oncology
- Clinical recommendations had reliability concerns outside controlled narratives.
- High confidence signals with insufficient evidence calibration raise downstream safety risk.
- Key takeaway: domain-critical systems need rigorous real-world validation and explicit uncertainty communication.

## Failure Pattern to Preventive Controls Matrix

| Failure Pattern | Lifecycle Stage | Preventive Control | Required Artifact | Owner | Pass/Fail Criterion |
|---|---|---|---|---|---|
| Historical bias replay | Data prep | Representation and outcome parity audit across sensitive groups/proxies | Data ethics audit report + parity dashboard | Data Science + Ethics | Fail if any protected group violates agreed disparity threshold without approved mitigation |
| Proxy discrimination | Feature/model design | Proxy-risk review (feature importance + correlation with protected traits) | Feature risk register | ML Engineer + Privacy/Ethics | Fail if high-risk proxy features lack documented controls or removal rationale |
| Accuracy-only validation | Validation/testing | Fairness, calibration, and subgroup performance test suite | Model evaluation pack | QA + ML + Ethics | Fail if subgroup metrics breach fairness/calibration guardrails |
| Black-box rejection outcomes | Validation/testing + UX | Explainability and adverse-action reason framework | Decision explanation spec + sample outputs | Product + Legal + Eng | Fail if user-facing rationale is missing, non-actionable, or inconsistent |
| Unsafe optimization objective | Feature/model design | Multi-objective optimization including harm constraints | Objective function review memo | ML Lead + Product | Fail if optimization excludes safety/fairness constraints in high-impact decisions |
| No ethics launch gate | Deployment/release | Ethics gate as a release blocker with veto authority | Release gate checklist with sign-offs | PM + Ethics Officer + Legal | Fail if required approvals are missing or unresolved red findings remain |
| Post-launch drift and emergent harm | Monitoring | Continuous fairness/safety monitoring with alerts and rollback triggers | Monitoring dashboard + incident runbook | SRE/Analytics + Ethics | Fail if monitoring lacks subgroup segmentation, alerts, or rollback policy |

## Universal Ethics Gates (Domain-Agnostic)

Use these as sprint and release controls across hiring, recommendation, and financial systems.

### Gate 1: Problem Framing
- Decision impact tier assigned (low/medium/high stakes).
- Protected-group and vulnerable-user risk map completed.
- Human-override policy documented.

Exit condition: No unresolved high-stakes ambiguity about harm surface.

### Gate 2: Data Readiness
- Dataset provenance, sampling window, and representativeness documented.
- Proxy attribute risk review completed.
- Data minimization and retention policy approved.

Exit condition: Bias and data ethics audits pass, or exceptions are approved with mitigation.

### Gate 3: Model and Objective Design
- Objective function includes fairness/safety constraints where relevant.
- Baselines include non-ML or rules-based comparators.
- Uncertainty handling and abstain/fallback logic defined.

Exit condition: Documented rationale for objective, features, and fallback behavior.

### Gate 4: Validation and Explainability
- Subgroup metrics, calibration, and robustness tests executed.
- Explainability outputs validated for consistency and user actionability.
- Harm scenario testing (red-team style) completed.

Exit condition: No critical severity findings open.

### Gate 5: Release Governance
- Ethics, legal, and product sign-off bundle complete.
- Incident playbook and rollback triggers approved.
- User communication and appeal/escalation pathways prepared.

Exit condition: Formal gate approval with auditable sign-offs.

### Gate 6: Post-Deploy Monitoring
- Weekly fairness and harm indicators reviewed.
- Drift detection and threshold alarms active.
- Remediation SLA and ownership confirmed.

Exit condition: Stable trend within thresholds for agreed observation window.

## Weekly Leading Indicators (Operational)

Track these across domains:
- Decision outcome disparity by subgroup and relevant proxy segments.
- Appeal/complaint rate on automated decisions.
- Explanation quality score (support resolution rate, user comprehension proxy).
- Harm-adjacent exposure metrics (for recommender systems).
- Override and rollback frequency in high-impact workflows.
- Time-to-detect and time-to-mitigate ethics incidents.

## Implementation Notes for Sprint Workflow

- Add a mandatory "Ethics Checks" section to PR templates for AI-touching changes.
- Require model cards/evaluation packs to include subgroup fairness and calibration slices.
- For high-impact releases, enforce mandatory approval quartet: CTO, Head of Legal, Responsible AI Lead, Security & Privacy Lead.
- Treat Product Manager and Engineering Lead as recommended supporting reviewers unless local policy makes them blocking.
- Treat fairness/safety failures as release blockers, not backlog enhancements.
- Use strict monitoring posture by default for high-impact systems (earlier alerts, lower tolerance, faster containment/escalation SLAs).

## Recommended Next Artifact

If needed, generate a companion operational checklist with copy-paste templates for:
- PR ethics checklist,
- release ethics gate form,
- monitoring alert thresholds and incident response playbook.
