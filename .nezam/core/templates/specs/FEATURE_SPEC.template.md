# Feature Spec — {{FEATURE_ID}}: {{FEATURE_NAME}}

> **Agents must read this entire file before writing a single line of code for this feature.**
> Implementation that doesn't match this spec is a bug, not a feature.

---

## Meta

| Field | Value |
|---|---|
| Feature ID | {{FEATURE_ID}} (e.g. F-001) |
| Feature Name | {{FEATURE_NAME}} |
| Priority | {{P0 / P1 / P2}} |
| Personas affected | {{PERSONA_NAMES}} |
| PRD section | Section 4, Row {{N}} |
| Status | {{draft / approved / in-progress / done}} |
| Spec author | {{NAME}} |
| Last updated | {{DATE}} |

---

## 1. User Story

> The "why" — written from the user's perspective.

**As a** {{PERSONA}},
**I want to** {{ACTION}},
**so that** {{OUTCOME}}.

### 1.1 Detailed Narrative
> Describe the full context. What is the user doing before this feature? What problem are they solving? What does success feel like?

{{DETAILED_NARRATIVE}}

---

## 2. Acceptance Criteria

> These are the pass/fail tests. Every criterion must be verifiable.
> Format: **Given** [context] **When** [action] **Then** [outcome]

- [ ] **AC-001:** Given {{CONTEXT}}, when {{ACTION}}, then {{EXPECTED_OUTCOME}}
- [ ] **AC-002:** Given {{CONTEXT}}, when {{ACTION}}, then {{EXPECTED_OUTCOME}}
- [ ] **AC-003:** Given {{CONTEXT}}, when {{ACTION}}, then {{EXPECTED_OUTCOME}}

### 2.1 Out of Scope for This Feature
> What this feature explicitly does NOT do (to prevent scope creep).

- ❌ {{NOT_IN_SCOPE}} — tracked as {{FUTURE_FEATURE_ID or "future work"}}
- ❌ {{NOT_IN_SCOPE}}

---

## 3. UI Specification

### 3.1 Screens Involved

| Screen | Route | New or Modified |
|---|---|---|
| {{SCREEN_NAME}} | `{{ROUTE}}` | {{New / Modified}} |

### 3.2 Screen States

> Every state every screen can be in. No state left undefined.

#### Screen: {{SCREEN_NAME}}

**Loading state**
- Trigger: page/section is fetching data
- Show: skeleton loaders matching the populated layout
- Duration: show spinner if > 300ms
- Cancel: user can navigate away

**Empty state**
- Trigger: {{CONDITION}} (e.g. "no records exist yet")
- Headline: "{{EMPTY_STATE_HEADLINE}}"
- Body: "{{EMPTY_STATE_BODY}}"
- CTA: "{{CTA_LABEL}}" → {{ACTION}}
- Illustration: {{ICON or ILLUSTRATION_DESCRIPTION}}

**Populated state**
- Trigger: {{CONDITION}}
- Layout: {{DESCRIPTION}}
- Items per page: {{N}}
- Sort default: {{FIELD}} {{ASC/DESC}}
- Interactions: {{CLICK → ..., HOVER → ..., LONG_PRESS → ...}}

**Error state**
- Trigger: API returns error or network fails
- Message: "{{ERROR_MESSAGE}}" (plain language, not a stack trace)
- Recovery: {{RETRY_BUTTON | GO_BACK | CONTACT_SUPPORT}}
- Log to: {{Sentry / console.error}}

**Offline state**
- Trigger: network unavailable
- Message: "{{OFFLINE_MESSAGE}}"
- Recovery: auto-retry on reconnect

### 3.3 Component Inventory

> Every component needed for this feature. Reference existing components where possible.

| Component | Type | Source | Props | States | Notes |
|---|---|---|---|---|---|
| `{{ComponentName}}` | {{New / Existing / Modified}} | `{{FILE_PATH}}` | `{{KEY_PROPS}}` | default/hover/focus/disabled/loading | {{NOTES}} |

### 3.4 Interaction Specification

> Describe every interactive element's behavior precisely.

#### {{ELEMENT_NAME}} (e.g. "Submit Button")
- **Default:** {{APPEARANCE}}
- **Hover:** {{APPEARANCE}}
- **Active (click):** {{APPEARANCE}}
- **Disabled:** {{CONDITION that disables it}} → {{APPEARANCE}}
- **Loading:** {{APPEARANCE while async action in progress}}
- **Keyboard:** Tab focus → Enter triggers action
- **Accessible label:** `aria-label="{{LABEL}}"`

#### {{ELEMENT_NAME}} (e.g. "Search Input")
- **Debounce:** {{MS}}ms
- **Min characters:** {{N}} before triggering search
- **Clear button:** appears when input has value
- **Placeholder:** "{{PLACEHOLDER_TEXT}}"
- **Error state:** shown when {{CONDITION}}

### 3.5 Responsive Behavior

| Breakpoint | Layout changes |
|---|---|
| Mobile (< 640px) | {{DESCRIPTION}} |
| Tablet (640–1024px) | {{DESCRIPTION}} |
| Desktop (> 1024px) | {{DESCRIPTION}} |

### 3.6 Motion & Reduced-Motion Contract

| Interaction | Animation | Duration | Reduced-motion fallback |
|---|---|---|---|
| {{INTERACTION}} | {{ANIMATION_TYPE}} | {{MS}}ms | instant / fade only |

---

## 4. Data Specification

### 4.1 Data Required

> What data does this feature read and write?

**Reads:**
- `{{ENTITY.FIELD}}` — used for {{PURPOSE}}
- `{{ENTITY.FIELD}}` — used for {{PURPOSE}}

**Writes:**
- `{{ENTITY.FIELD}}` — set when {{ACTION}}

### 4.2 Validation Rules

> Server-side validation. Client mirrors these but server always re-validates.

| Field | Rule | Error message shown to user |
|---|---|---|
| `{{FIELD}}` | required, max {{N}} chars | "{{USER_FACING_MESSAGE}}" |
| `{{FIELD}}` | {{RULE}} | "{{USER_FACING_MESSAGE}}" |

### 4.3 Data Transformations

- `{{FIELD}}`: stored as {{RAW_FORMAT}} → displayed as {{DISPLAY_FORMAT}}
- `{{FIELD}}`: {{TRANSFORMATION}}

---

## 5. API Specification

> Every endpoint this feature calls or creates. No endpoint gets built without being here first.

### `{{METHOD}} {{ENDPOINT}}`

- **Purpose:** {{DESCRIPTION}}
- **Auth required:** {{YES / NO}}
- **Request:**
  ```json
  {
    "{{field}}": "{{type}} — {{description}}"
  }
  ```
- **Success ({{STATUS_CODE}}):**
  ```json
  {
    "data": {
      "{{field}}": "{{value}}"
    }
  }
  ```
- **Errors:**

  | Code | Condition | Response body |
  |---|---|---|
  | 400 | {{CONDITION}} | `{"error": "{{MESSAGE}}", "code": "{{CODE}}"}` |
  | 401 | Not authenticated | `{"error": "Unauthorized", "code": "UNAUTHORIZED"}` |
  | 403 | Insufficient permissions | `{"error": "Forbidden", "code": "FORBIDDEN"}` |
  | 404 | {{CONDITION}} | `{"error": "{{MESSAGE}}", "code": "NOT_FOUND"}` |
  | 409 | {{CONDITION}} | `{"error": "{{MESSAGE}}", "code": "CONFLICT"}` |
  | 422 | Validation failed | `{"error": "{{MESSAGE}}", "fields": {"{{field}}": "{{message}}"}}` |
  | 500 | Unexpected error | `{"error": "Something went wrong", "code": "INTERNAL_ERROR"}` |

- **Side effects:** {{e.g. sends email, updates related record, emits analytics event}}
- **Rate limit:** {{N}} requests/minute per user

---

## 6. Business Logic

> The rules the system enforces. If it's not written here, it doesn't get coded.

### 6.1 Core Rules

1. **{{RULE_NAME}}:** {{DESCRIPTION}} — enforced in {{server / client / both}}
2. **{{RULE_NAME}}:** {{DESCRIPTION}} — enforced in {{where}}

### 6.2 Edge Cases

> Every unusual situation. If it's not in this table, agents must ask before handling it.

| Situation | Expected behavior |
|---|---|
| {{EDGE_CASE}} | {{WHAT_SHOULD_HAPPEN}} |
| {{EDGE_CASE}} | {{WHAT_SHOULD_HAPPEN}} |
| User submits form twice rapidly | Deduplicate — ignore second request if identical within 2s |
| Session expires mid-flow | Save progress → redirect to login → restore after re-auth |
| Network drops mid-upload | Show partial progress → offer retry → do not corrupt partial data |
| Large dataset | Paginate — never load all at once — show count |
| Empty required field on submit | Highlight field, focus it, show inline error |

### 6.3 Permissions

| Action | {{ROLE_1}} | {{ROLE_2}} | {{ROLE_3}} | Notes |
|---|---|---|---|---|
| {{ACTION}} | ✅ | ❌ | ❌ | {{CONDITIONS}} |
| {{ACTION}} | ✅ | ✅ | ❌ | {{CONDITIONS}} |

---

## 7. Notifications & Side Effects

| Trigger | Side effect | Channel | Recipient | Template |
|---|---|---|---|---|
| {{ACTION}} | {{EFFECT}} | {{EMAIL / PUSH / IN_APP}} | {{WHO}} | `{{TEMPLATE_NAME}}` |

---

## 8. Analytics Events

| Event Name | Trigger | Properties | Notes |
|---|---|---|---|
| `{{feature_name}}_{{action}}` | {{WHEN}} | `{userId, {{PROPS}}}` | {{NOTES}} |

---

## 9. Implementation Notes

### 9.1 Recommended Approach
{{IMPLEMENTATION_GUIDANCE — patterns, libraries, reference implementations in codebase}}

### 9.2 Dependencies

- **Depends on:** {{FEATURE_ID}} — must be completed first
- **Blocks:** {{FEATURE_ID}} — cannot start until this is done
- **Shares components with:** {{FEATURE_ID}}

### 9.3 Known Risks & Gotchas

- **{{RISK}}** — mitigation: {{HOW_TO_HANDLE}}

---

## 10. Testing Requirements

### Unit Tests
- [ ] {{FUNCTION_OR_COMPONENT}} — verify {{BEHAVIOR}}
- [ ] All validation rules — reject invalid inputs with correct messages
- [ ] Business logic rules (Section 6.1) — each rule has a test

### Integration Tests
- [ ] `{{ENDPOINT}}` happy path — returns correct shape and status
- [ ] `{{ENDPOINT}}` auth rejection — returns 401
- [ ] `{{ENDPOINT}}` validation failure — returns 422 with field errors
- [ ] `{{ENDPOINT}}` {{ERROR_CONDITION}} — returns {{STATUS}}

### E2E Tests
- [ ] Happy path: {{FULL_FLOW_DESCRIPTION}}
- [ ] Error path: {{ERROR_FLOW}}
- [ ] Edge case: {{EDGE_CASE_FLOW}}

### Accessibility Tests
- [ ] All interactive elements reachable by keyboard alone
- [ ] Screen reader announces loading, empty, and error states
- [ ] Color contrast ≥ 4.5:1 in both light and dark mode
- [ ] No focus traps outside modals

---

## 11. Definition of Done

> This feature is complete when ALL of the following are true. No exceptions.

- [ ] All acceptance criteria in Section 2 pass
- [ ] All screen states in Section 3.2 implemented and visually verified
- [ ] Loading, empty, error states exist on every list/data view
- [ ] All validation rules in Section 4.2 enforced server-side
- [ ] All API error codes in Section 5 return correct format
- [ ] All edge cases in Section 6.2 handled
- [ ] Analytics events in Section 8 firing and verified
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Accessibility checklist passed
- [ ] Code reviewed and approved
- [ ] `tsc --noEmit` passes — zero TypeScript errors
- [ ] No `any` types introduced
- [ ] No hardcoded colors, spacing, or font values
- [ ] CHANGELOG.md updated

---

## 12. Decision Log

| Date | Decision | Reason | Alternatives rejected |
|---|---|---|---|
| {{DATE}} | {{DECISION}} | {{REASON}} | {{ALTERNATIVES}} |
