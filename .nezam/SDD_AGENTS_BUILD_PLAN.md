# SDD Agents Build Plan — 11 Automation Agents to Accelerate Planning

> **Timeline:** 2 weeks | **Effort:** 20 hours | **Impact:** 50% planning time reduction

---

## Agent Architecture

All agents follow this pattern:

```
Input → Parse/Extract → Generate with Context → Validate → Output
```

**Context injection rule:** Every output includes "WHY" — business rationale, technical reasoning, edge cases.

---

## Agent 1: Problem-Statement-Generator

**File:** `.cursor/agents/problem-statement-generator.md`

**Purpose:** Convert vague briefs into structured requirements

**Input:**
```
User brief: "We need user authentication"
```

**Output:** `PLANNING_BRIEF.md` with:
```yaml
For:       [Inferred: New and returning users]
Who:       [Inferred: Want secure access]
The:       [Inferred: Authentication system]
Solves:    [Inferred: Unauthorized access]
By:        [Inferred: OAuth / JWT / Session]
Expected:  [Inferred: 95%+ login success rate]
Timeline:  [Inferred: 2 weeks]
Scope:     
  In:      [Login, password reset, session management]
  Out:     [Social profile integration, multi-factor auth]

Constraints:
  Technical: PostgreSQL, Next.js, Redis (inferred from stack)
  Business:  Team of 4, 2-week deadline
  Design:    Mobile-first, WCAG AA accessibility

Clarification Needed:
  - Primary user auth method? (OAuth vs JWT vs custom?)
  - Session duration? (24h / 7d / 30d?)
  - Support 2FA initially? (Yes / No / Phase 2?)
```

**Pseudocode:**
```
on: input = user_brief

1. Extract core entities: [action], [subject], [constraint]
2. Look up standard patterns for [action]
3. Infer missing context from codebase:
   - Tech stack from package.json
   - Team size from git log
   - Deadline from MASTER_TASKS.md
4. Generate structured output
5. Identify gaps → generate clarification questions
6. Output: PLANNING_BRIEF.md
```

**Build time:** 2 hours  
**Triggers:** `/plan feature [brief]`

---

## Agent 2: ADR-Generator

**File:** `.cursor/agents/adr-generator.md`

**Purpose:** Auto-generate Architecture Decision Records with 3 credible options

**Input:** Problem statement from Agent 1  
**Output:** `ADRs.yaml` with 7-10 critical decisions

**Example:**
```yaml
ADR-002: Authentication Method

Problem:
  User needs to authenticate securely.
  Constraints: [From planning brief]
  
Options:
  A: OAuth 2.0 (Google, GitHub, etc.)
     Pros:
       - Users don't create new password
       - OAuth provider handles security
       - Reduced support (password resets)
     Cons:
       - Dependency on OAuth provider uptime
       - Some users prefer local accounts
       - GDPR data flow implications
     Cost:
       - Dev time: 1-2 days
       - Infrastructure: $0 (provider-hosted)
       - Ongoing: No password management burden
     Best for: SaaS with technical users
     
  B: JWT (JSON Web Tokens)
     Pros:
       - Stateless auth (scales horizontally)
       - Flexible claims structure
       - Works well with microservices
     Cons:
       - Token revocation harder (blacklist required)
       - Larger token size (OAuth)
       - More infrastructure to manage
     Cost:
       - Dev time: 2-3 days
       - Infrastructure: Redis for blacklist ($20/mo)
       - Ongoing: Token refresh logic maintenance
     Best for: APIs, microservices, mobile apps
       
  C: Session-based (Traditional)
     Pros:
       - Simple mental model for team
       - Easy token revocation
       - Battle-tested pattern
     Cons:
       - Requires server-side session store
       - Doesn't scale horizontally without Redis
       - More server load
     Cost:
       - Dev time: 1 day
       - Infrastructure: Redis or in-memory ($20/mo)
       - Ongoing: Session cleanup cron jobs
     Best for: Monolithic apps, internal tools

Recommendation: OAuth (Option A)
Rationale:
  - SaaS product targeting technical users
  - Reduces support burden (no password resets)
  - Faster implementation (1-2 days vs 2-3)
  - Better user experience (no new password)
  
Trade-offs Accepted:
  - Provider dependency (acceptable with fallback)
  - Will add custom login option in Phase 2 if needed
  
Security Implications:
  - OAuth provider MUST use HTTPS (ensured by standard)
  - Need CSRF protection on /authorize endpoint
  - Rate limiting on token endpoint

Decision: PENDING (awaiting team consensus)
Decision By: [person + date once locked]
Locked: false
```

**Critical ADRs to generate:**
1. Authentication method (OAuth/JWT/Session)
2. Database (SQL/NoSQL/Hybrid)
3. Frontend framework (Next.js/Remix/Astro)
4. State management (Redux/Zustand/Context)
5. Caching (Redis/In-memory/CDN)
6. Deployment (Docker/Lambda/Traditional)
7. Monitoring (Datadog/NewRelic/Self-hosted)
8. Frontend styling (Tailwind/CSS-in-JS/BEM)
9. Testing framework (Vitest/Jest/Playwright)
10. Error tracking (Sentry/Rollbar/Datadog)

**Pseudocode:**
```
on: input = problem_statement

1. Extract requirements + constraints
2. For each critical decision:
   a. Look up 3 common approaches
   b. Research pros/cons for constraint set
   c. Estimate costs (dev, infra, ongoing)
   d. Identify best fit for problem type
   e. Document security implications
3. Generate YAML with all ADRs
4. Output: ADRs.yaml
5. Note: Decisions are PENDING until locked with `/decide ADR-X "Option Y"`
```

**Build time:** 3 hours  
**Triggers:** Auto-invoked after Agent 1  
**Dependencies:** Agent 1 (Problem-Statement-Generator)

---

## Agent 3: Architecture-Diagram-Generator

**File:** `.cursor/agents/architecture-diagram-generator.md`

**Purpose:** Generate system architecture diagrams + component checklists

**Input:** Problem statement + ADR decisions  
**Output:** `ARCHITECTURE.md` with Mermaid diagrams + checklist

**Example output:**
```markdown
# System Architecture

## Component Diagram

graph TB
    User["👤 User"]
    Browser["🌐 Browser"]
    Next["Next.js App"]
    Auth["🔐 Auth Service (OAuth)"]
    API["📡 API Server"]
    DB["🗄️ PostgreSQL"]
    Cache["⚡ Redis Cache"]
    Monitor["📊 Monitoring (Datadog)"]
    
    User -->|Types in URL| Browser
    Browser -->|HTTP/S| Next
    Next -->|OAuth request| Auth
    Next -->|API calls| API
    API -->|Query| DB
    API -->|Get/Set| Cache
    API -->|Metrics| Monitor
    Auth -->|Verify token| API

## Data Flow

### User Login Flow
1. User visits /login
2. Clicks "Sign in with Google"
3. Frontend redirects to Google OAuth endpoint
4. User grants permission
5. Google redirects back with auth code
6. Frontend exchanges code for token
7. Token stored in httpOnly cookie
8. API validates token on each request
9. User sees authenticated dashboard

### Error Handling
- Network error: Exponential backoff + show "Offline" message
- Auth failure: Redirect to login + show reason
- Rate limit: Queue requests + backoff
- Server error: Retry 3x, then show error + recovery path

## Infrastructure

### Frontend
- Runtime: Node.js 20
- Framework: Next.js 14
- Deployment: Vercel (serverless)
- Build: 2 min, ~500KB gzipped
- Why: Fast, scales automatically, OAuth-friendly

### Backend
- Runtime: Node.js 20
- Framework: Express.js
- Deployment: Docker on AWS ECS
- Database: PostgreSQL 15
- Cache: Redis 7
- Why: [From ADR decisions + rationale]

### Monitoring
- Metrics: Datadog
- Error tracking: Sentry
- Logs: CloudWatch
- Alerts: Slack

## Component Checklist

- [ ] Frontend
  - [ ] Login page
  - [ ] OAuth redirect handler
  - [ ] Token storage (httpOnly cookie)
  - [ ] Token refresh logic
  - [ ] Logout handler
  
- [ ] Backend
  - [ ] OAuth exchange endpoint
  - [ ] Token validation middleware
  - [ ] User lookup service
  - [ ] Session cleanup cron
  - [ ] Rate limiting
  
- [ ] Infrastructure
  - [ ] Database schema (users, sessions)
  - [ ] Redis cache for rate limiting
  - [ ] HTTPS certificates
  - [ ] CORS configuration
  - [ ] Monitoring dashboards
  - [ ] Alert triggers
  
- [ ] Security
  - [ ] CSRF protection
  - [ ] Rate limiting (auth endpoint)
  - [ ] Password hashing (bcrypt, cost=12)
  - [ ] Token expiration (30 days)
  - [ ] Refresh token rotation
  
- [ ] Documentation
  - [ ] API endpoint spec
  - [ ] Error codes + recovery
  - [ ] OAuth flow diagram
  - [ ] Rollback procedures
```

**Pseudocode:**
```
on: input = [problem_statement, adr_decisions]

1. Extract components from problem + ADRs
2. Map data flows for each user journey
3. Generate Mermaid diagram
4. Document architecture rationale (from ADRs)
5. Generate component checklist
6. Validate: No missing components, no circular dependencies
7. Output: ARCHITECTURE.md
```

**Build time:** 1.5 hours  
**Triggers:** Auto-invoked after Agent 2

---

## Agent 4: Spec-Generator

**File:** `.cursor/agents/spec-generator.md`

**Purpose:** Generate comprehensive specification with context for every requirement

**Input:** Problem statement + ADRs + Architecture  
**Output:** `REQUIREMENTS.yaml` with acceptance criteria + context

**Key feature: Context injection**

```yaml
Acceptance Criteria:

AC-AUTH-001: User can log in via OAuth
  Given:
    - User is not logged in
    - User has valid Google account
  When:
    - User clicks "Sign in with Google"
    - User grants permission
  Then:
    - User is redirected to dashboard
    - Session token stored in httpOnly cookie
  Context: |
    Why OAuth?
      - Reduces user friction (no new password)
      - Outsources security to Google
      - Users expect OAuth in 2024
    Why httpOnly?
      - Prevents XSS access to token
      - Browser manages automatically
      - Requires CSRF token for logout
    What breaks if missing?
      - Users frustrated, try password recovery
      - Competitors offer OAuth
  Security Implications:
    - Token intercepted in transit? → HTTPS required
    - Token leaked? → 30-day expiry + refresh rotation
    - OAuth provider down? → Fallback to email/password
  Testing:
    - Unit: Verify token stored correctly
    - Integration: Call API with token, verify auth
    - E2E: Full flow through Google auth

AC-AUTH-002: Failed login rate-limited
  Given:
    - User enters wrong password 3 times
  When:
    - User attempts 4th login
  Then:
    - Request rejected with 429 (Too Many Requests)
    - User sees: "Too many attempts. Try again in 15 minutes."
  Context: |
    Why 3 failures?
      - Typical human mistake threshold
      - After 3, likely brute force
      - Users remember password by 3rd try
    Why 15 minutes?
      - Enough to deter brute force
      - Not so long users give up
      - Balances security vs UX
    What breaks if missing?
      - Brute force attacks (easy password crack)
      - Support burden (locked accounts)
      - Security incident risk
  Security Implications:
    - Rate limit key: IP + email (prevents email enumeration)
    - Store in Redis with TTL 15min
    - Monitor: Alert if > 100 rate-limited attempts/hour
  Testing:
    - Unit: Verify counter increments
    - Load: Verify 1000 concurrent attempts throttled
    - E2E: Manual test, verify cooldown

[Each AC follows this pattern - context is built in]
```

**Pseudocode:**
```
on: input = [problem_statement, adr_decisions, architecture]

1. Parse requirements from each source
2. For each requirement:
   a. Extract acceptance criteria (Given/When/Then)
   b. Add context: Why this matters, what breaks if missing
   c. Add security implications from ADRs
   d. Add testing strategy
   e. Cross-reference dependent requirements
3. Identify edge cases:
   - What if OAuth provider fails?
   - What if session expires mid-operation?
   - What if user logs in from 2 places?
4. Generate REQUIREMENTS.yaml
5. Validate: Complete spec, no contradictions, all links resolvable
```

**Build time:** 2 hours  
**Triggers:** Auto-invoked after Agent 3

---

## Agent 5: Dependency-Graph-Generator

**File:** `.cursor/agents/dependency-graph-generator.md`

**Purpose:** Auto-generate feature dependency graph + critical path + parallel schedule

**Input:** Feature list from spec  
**Output:** `DEPENDENCIES.yaml` + scheduling recommendations

**Example:**
```yaml
Features:
  AUTH:
    Duration: 2d
    Blockers: None
    Dependencies: Database schema
    Blocks: [API-CORE, USER-PROFILE, ADMIN-PANEL]
    
  API-CORE:
    Duration: 3d
    Blockers: None
    Dependencies: [AUTH, DB schema]
    Blocks: [INTEGRATION, ANALYTICS, MONITORING]
    
  USER-PROFILE:
    Duration: 2d
    Blockers: None
    Dependencies: [AUTH, API-CORE]
    Blocks: None
    
  INTEGRATION:
    Duration: 3d
    Blockers: None
    Dependencies: API-CORE
    Blocks: [DEPLOY]

Critical Path:
  AUTH (2d) → API-CORE (3d) → INTEGRATION (3d) → DEPLOY (1d) = 9 days minimum

Parallel Opportunities:
  Week 1:
    - Day 1-2: AUTH + API-CORE start (AUTH blocks API-CORE, so start together)
    - Day 1-2: USER-PROFILE starts (can run parallel with API-CORE)
    
  Week 2:
    - Day 3-5: INTEGRATION starts (depends on API-CORE milestone)
    - Day 3-5: MONITORING starts (parallel with INTEGRATION)
    
  Week 3:
    - Day 6-7: DEPLOY (after all features + testing)

Optimized Schedule (with parallelization):
  Serial baseline: 9 days
  With parallelization: 12 days (realistic with sync overhead)
  
Team assignment:
  Alice: AUTH (days 1-2)
  Bob: API-CORE (days 1-3)
  Carol: USER-PROFILE (days 1-2, then ADMIN-PANEL)
  Dave: INTEGRATION (days 3-5)
  
Sync points:
  - Day 2 (AUTH done, unblock User Profile / Admin)
  - Day 3 (API-CORE milestone, unblock Integration)
  - Day 5 (Feature complete, start testing)
  - Day 6 (Deploy to staging)
  - Day 7 (Deploy to prod)
```

**Build time:** 1 hour  
**Triggers:** Auto-invoked after Agent 4

---

## Agents 6-11: Content/Design/Release Agents

### Agent 6: SEO-Keyword-Mapper
**Purpose:** Map keywords → content pillars → SEO strategy  
**Input:** Problem statement + target audience  
**Output:** `SEO_STRATEGY.md` + keyword targets  
**Build time:** 2 hours

### Agent 7: Sitemap-Generator
**Purpose:** Generate hierarchical sitemap + user flows  
**Input:** Features + content pillars  
**Output:** `INFORMATION_ARCHITECTURE.md`  
**Build time:** 2 hours

### Agent 8: Content-Brief-Generator
**Purpose:** Generate context-injected content briefs per page  
**Input:** SEO keywords + IA + spec  
**Output:** `CONTENT_BRIEFS/` directory (one file per page)  
**Build time:** 3 hours

### Agent 9: Design-System-Applier
**Purpose:** Apply design tokens to generate component specs  
**Input:** Content briefs + design tokens  
**Output:** Component specifications + design guidance  
**Build time:** 3 hours

### Agent 10: Code-Generation-Supervisor
**Purpose:** Generate component skeletons + test stubs  
**Input:** Spec + design + testing requirements  
**Output:** Component skeleton + tests + TODO comments  
**Build time:** 4 hours

### Agent 11: Release-Plan-Generator
**Purpose:** Generate staging → canary → prod deployment plan  
**Input:** Feature spec + monitoring setup  
**Output:** `RELEASE_PLAN.md` + pre-configured dashboards  
**Build time:** 2 hours

---

## Build Schedule

### Week 1: Core Planning Agents
```
Mon-Tue:  Agent 1 (Problem-Statement-Generator)
         Agent 2 (ADR-Generator)
         
Wed-Thu:  Agent 3 (Architecture-Diagram-Generator)
         Agent 4 (Spec-Generator)
         
Fri:      Agent 5 (Dependency-Graph-Generator)
         Integration testing
```

### Week 2: Content/Design/Release Agents
```
Mon-Tue:  Agent 6 (SEO-Keyword-Mapper)
         Agent 7 (Sitemap-Generator)
         
Wed-Thu:  Agent 8 (Content-Brief-Generator)
         Agent 9 (Design-System-Applier)
         
Fri:      Agent 10 (Code-Generation-Supervisor)
         Agent 11 (Release-Plan-Generator)
         Full integration + testing
```

### Week 3: Integration + Testing
```
Mon-Wed:  Wire all agents into `/plan feature [brief]` command
         Create test feature (e.g., password reset)
         Validate output quality + completeness
         
Thu-Fri:  Refine based on real usage
         Document best practices
         Create agent usage guide
```

---

## Success Criteria

- ✅ All 11 agents deployed and tested
- ✅ `/plan feature [brief]` generates complete 4-hour plan
- ✅ Every requirement includes context (Why, edge cases, implications)
- ✅ Spec completeness: 100% (zero gaps)
- ✅ Dependency detection: Zero false negatives
- ✅ Agent output quality: Developer-ready (minimal editing)

---

## Integration with Silent Ops

These agents feed into Silent Ops workflows:

```
/plan feature "User authentication"
  → Agents 1-5 generate planning docs (4h)
  → Spec locked via `/decide` commands (15 min)
  → `/silent unlock feature-auth` begins dev

Dev team executes against spec with 50% less friction:
  → Agents 6-11 auto-generate templates
  → Code generation reduces typing
  → Context already injected (why decisions, edge cases)

Result: Dev time 16h → 8h (50% faster)
```

---

## Rollout Plan

1. **Week 1-3:** Build + test all agents
2. **Week 4:** Soft launch on non-critical feature (e.g., docs page)
3. **Week 5:** Integrate with v3.2-P1 (password reset feature)
4. **Week 6+:** Use for all v3.2 features

**Expected impact by Week 8:**
- 50% faster planning
- 50% faster development
- v3.2 ships in 3-4 weeks (instead of 8)

