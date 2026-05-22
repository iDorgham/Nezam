# Product Requirements Document — {{PROJECT_NAME}}

> **This document is the single source of truth for what gets built.**
> Every feature, every screen, every data field, every edge case must be defined here
> before any planning or development begins. Vague = blocked.

---

## 0. Product Identity

| Field | Value |
|---|---|
| Product Name | {{PROJECT_NAME}} |
| Tagline | {{ONE_LINE_TAGLINE}} |
| Owner | {{OWNER_NAME}} |
| GitHub Repo | {{GITHUB_REPO_URL}} |
| Target Market | {{TARGET_MARKET}} — {{LANGUAGE}} |
| Status | Draft |
| PRD Version | 0.1.0 |
| Last Updated | {{DATE}} |

---

## 1. Problem Statement

### 1.1 The Problem
> Describe the exact pain. Who feels it, when, how often, what it costs them.

{{PROBLEM_DESCRIPTION}}

### 1.2 Why Now
> What makes this the right moment to build this? (market shift, technology unlock, regulatory change, etc.)

{{WHY_NOW}}

### 1.3 What Happens Without This Product
> Describe the status quo. What do users do today? Why is that painful or insufficient?

{{STATUS_QUO}}

---

## 2. Users & Personas

> Define every distinct user type. Each type has different needs, permissions, and flows.

### Persona 1: {{PERSONA_1_NAME}}
- **Who they are:** {{DESCRIPTION}}
- **Their job-to-be-done:** When I {{SITUATION}}, I want to {{MOTIVATION}}, so I can {{OUTCOME}}.
- **Current frustration:** {{FRUSTRATION}}
- **Success looks like:** {{SUCCESS_DEFINITION}}
- **Technical comfort:** {{LOW | MEDIUM | HIGH}}
- **Usage frequency:** {{DAILY | WEEKLY | MONTHLY | ONE_TIME}}

### Persona 2: {{PERSONA_2_NAME}}
- **Who they are:** {{DESCRIPTION}}
- **Their job-to-be-done:** When I {{SITUATION}}, I want to {{MOTIVATION}}, so I can {{OUTCOME}}.
- **Current frustration:** {{FRUSTRATION}}
- **Success looks like:** {{SUCCESS_DEFINITION}}
- **Technical comfort:** {{LOW | MEDIUM | HIGH}}
- **Usage frequency:** {{DAILY | WEEKLY | MONTHLY | ONE_TIME}}

<!-- Add more personas as needed -->

---

## 3. Success Metrics

> Define how you will know if this product is working. Be specific and measurable.

| Metric | Baseline | 30-day Target | 90-day Target | Source |
|---|---|---|---|---|
| {{METRIC_1}} | — | {{TARGET}} | {{TARGET}} | {{HOW_MEASURED}} |
| {{METRIC_2}} | — | {{TARGET}} | {{TARGET}} | {{HOW_MEASURED}} |
| {{METRIC_3}} | — | {{TARGET}} | {{TARGET}} | {{HOW_MEASURED}} |

---

## 4. Feature Registry

> Every feature that will be built. Priority: P0 = must-have for launch, P1 = important, P2 = nice-to-have.
> Each feature links to its FEATURE_SPEC file for full detail.

| ID | Feature Name | Priority | Persona | Phase | Spec File |
|---|---|---|---|---|---|
| F-001 | {{FEATURE_NAME}} | P0 | {{PERSONA}} | {{PHASE}} | `docs/plan/00-define/specs/F-001-{{slug}}.md` |
| F-002 | {{FEATURE_NAME}} | P0 | {{PERSONA}} | {{PHASE}} | `docs/plan/00-define/specs/F-002-{{slug}}.md` |
| F-003 | {{FEATURE_NAME}} | P1 | {{PERSONA}} | {{PHASE}} | `docs/plan/00-define/specs/F-003-{{slug}}.md` |

---

## 5. Core User Flows

> Describe every critical path through the product. Each flow maps to features in Section 4.
> Include the happy path AND every branch / failure state.

### Flow 1: {{FLOW_NAME}} (e.g. "New User Registration")

```
Step 1: User arrives at {{PAGE}}
  → [Happy path]: {{ACTION}} → leads to Step 2
  → [Error]: {{CONDITION}} → shows {{ERROR_MESSAGE}} → user can {{RECOVERY_ACTION}}

Step 2: {{ACTION}}
  → [Happy path]: {{RESULT}} → leads to Step 3
  → [Edge case]: {{CONDITION}} → {{HANDLING}}
  → [Error]: {{CONDITION}} → {{HANDLING}}

Step 3: {{ACTION}}
  → [Happy path]: {{RESULT}} → Flow complete
  → [Abandon]: User leaves → {{WHAT_HAPPENS_TO_PARTIAL_DATA}}
```

### Flow 2: {{FLOW_NAME}}
<!-- Repeat for every major flow -->

---

## 6. Data Model

> Every entity the product stores, reads, or transmits. Every field. Every relationship.
> No field is added during development without being defined here first.

### Entity: {{ENTITY_NAME}} (e.g. "User")

| Field | Type | Required | Unique | Default | Validation | Notes |
|---|---|---|---|---|---|---|
| id | uuid | yes | yes | auto | — | Primary key |
| {{field}} | {{type}} | {{yes/no}} | {{yes/no}} | {{default}} | {{rules}} | {{notes}} |

**Relationships:**
- `{{ENTITY}}` has many `{{OTHER_ENTITY}}` via `{{foreign_key}}`
- `{{ENTITY}}` belongs to `{{OTHER_ENTITY}}`

### Entity: {{ENTITY_NAME}}
<!-- Repeat for every entity -->

---

## 7. API Surface

> Every endpoint the system exposes or consumes. Define request/response shape before any code.

### {{GROUP_NAME}} (e.g. "Authentication")

#### `POST /api/auth/register`
- **Purpose:** {{DESCRIPTION}}
- **Auth required:** No
- **Request body:**
  ```json
  {
    "{{field}}": "{{type}} — {{description}}"
  }
  ```
- **Success response (201):**
  ```json
  {
    "{{field}}": "{{value}}"
  }
  ```
- **Error responses:**
  - `400` — {{CONDITION}}: `{"error": "{{MESSAGE}}"}`
  - `409` — {{CONDITION}}: `{"error": "{{MESSAGE}}"}`
- **Side effects:** {{e.g. "sends verification email", "creates default workspace"}}

<!-- Repeat for every endpoint -->

---

## 8. UI Screens & States

> Every screen that exists in the product. Every state each screen can be in.
> If it's not defined here, it doesn't get built.

### Screen: {{SCREEN_NAME}} (e.g. "Dashboard")

- **Route:** `{{URL_PATH}}`
- **Accessible by:** {{PERSONAS}}
- **Purpose:** {{ONE_LINE}}

**States:**

| State | Trigger | What the user sees | Action available |
|---|---|---|---|
| Loading | Page first renders | Skeleton loaders for each section | — |
| Empty | No data exists yet | Empty state illustration + CTA "{{CTA_TEXT}}" | {{ACTION}} |
| Populated | Data exists | {{DESCRIPTION_OF_CONTENT}} | {{ACTIONS}} |
| Error | API fails | "{{ERROR_MESSAGE}}" + retry button | Retry, go back |
| Offline | No connection | "{{OFFLINE_MESSAGE}}" | Retry when online |

**Components on this screen:**
- `{{ComponentName}}` — {{PURPOSE}}
- `{{ComponentName}}` — {{PURPOSE}}

<!-- Repeat for every screen -->

---

## 9. Navigation Structure

```
{{APP_NAME}}
├── {{Top-level route}} ({{PERSONA_ACCESS}})
│   ├── {{Sub-route}}
│   └── {{Sub-route}}
├── {{Top-level route}} ({{PERSONA_ACCESS}})
│   └── {{Sub-route}}
└── {{Top-level route}} (auth only)
```

**Navigation component:** {{SIDEBAR | TOP_NAV | BOTTOM_TAB | HYBRID}}
**Mobile behavior:** {{DESCRIPTION}}
**Active state:** {{HOW_ACTIVE_LINK_IS_SHOWN}}

---

## 10. Permissions & Access Control

> Who can do what. Every action. Every role. Defined before building.

| Action | {{ROLE_1}} | {{ROLE_2}} | {{ROLE_3}} | Notes |
|---|---|---|---|---|
| {{ACTION}} | ✅ | ❌ | ❌ | {{CONDITIONS}} |
| {{ACTION}} | ✅ | ✅ | ❌ | {{CONDITIONS}} |

---

## 11. Integrations & Third-Party Services

> Every external service the product depends on. Define the contract before building.

| Service | Purpose | Data Sent | Data Received | Fallback if unavailable |
|---|---|---|---|---|
| {{SERVICE}} | {{PURPOSE}} | {{DATA}} | {{DATA}} | {{FALLBACK}} |

---

## 12. Non-Functional Requirements

### 12.1 Performance
- Page load (LCP): < {{MS}}ms on 4G
- API response (p95): < {{MS}}ms
- Time to interactive: < {{MS}}ms
- Bundle size limit: < {{KB}}KB gzipped

### 12.2 Accessibility
- WCAG level: {{AA | AAA}}
- Screen reader: fully navigable
- Keyboard: all interactions reachable without mouse
- RTL support: {{YES | NO}} — {{LANGUAGES}}
- Color contrast: minimum 4.5:1

### 12.3 Security
- Auth method: {{JWT | SESSION | OAUTH}}
- Session expiry: {{DURATION}}
- Sensitive data encrypted at rest: {{YES | NO}}
- Rate limiting: {{REQUESTS}}/min per IP
- Input sanitization: required on all user inputs
- OWASP Top 10: must pass before launch

### 12.4 Scalability
- Expected users at launch: {{N}}
- Expected users at 12 months: {{N}}
- Concurrent users peak estimate: {{N}}
- Database strategy for scale: {{DESCRIPTION}}

### 12.5 Browser & Device Support
| Platform | Minimum version |
|---|---|
| Chrome | last 2 |
| Safari | last 2 |
| Firefox | last 2 |
| Mobile Safari | iOS {{VERSION}}+ |
| Android Chrome | Android {{VERSION}}+ |

---

## 13. Constraints

### 13.1 Technical Constraints
- {{CONSTRAINT}} — Reason: {{WHY}}

### 13.2 Business Constraints
- Budget: {{AMOUNT OR RANGE}}
- Timeline: {{HARD_DEADLINE IF ANY}}
- Team size: {{N}} developers

### 13.3 Legal / Compliance
- {{REGULATION}} — Impact: {{WHAT_MUST_BE_DONE}}
- Data residency: {{REGION}}
- Privacy policy required: {{YES | NO}}
- Cookie consent required: {{YES | NO}}

---

## 14. Out of Scope (v1)

> Explicitly list what is NOT being built. This prevents scope creep and sets expectations.

- ❌ {{FEATURE}} — Reason: {{WHY_EXCLUDED}}
- ❌ {{FEATURE}} — Reason: {{WHY_EXCLUDED}}

---

## 15. Open Questions

> Unresolved decisions that must be answered before planning is locked.

| # | Question | Owner | Deadline | Decision |
|---|---|---|---|---|
| Q1 | {{QUESTION}} | {{WHO}} | {{DATE}} | Pending |

---

## 16. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| {{RISK}} | High / Med / Low | High / Med / Low | {{MITIGATION}} |

---

## 17. Release Roadmap Tie-in

| Milestone | Version | Features Included | Target Date |
|---|---|---|---|
| MVP | v0.1.0 | F-001, F-002 | {{DATE}} |
| Beta | v0.5.0 | F-001 through F-00X | {{DATE}} |
| v1.0 Launch | v1.0.0 | All P0 + P1 features | {{DATE}} |

---

> **PRD Lock Checklist — before moving to /PLAN:**
> - [ ] All personas defined with JTBD
> - [ ] All P0 features listed in Feature Registry
> - [ ] All user flows documented including error states
> - [ ] Data model complete — no "TBD" fields
> - [ ] All screens listed with all states
> - [ ] Navigation structure defined
> - [ ] Non-functional requirements filled in
> - [ ] Out of scope explicitly listed
> - [ ] Open questions have owners and deadlines
