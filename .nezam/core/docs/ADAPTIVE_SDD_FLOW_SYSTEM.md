# Adaptive SDD Flow System — Application-Specific Development Pipelines

> **Vision:** One methodology, infinite flows. Adapt SDD to your project type. Ship faster.

---

## Core Principle: Adaptive SDD

Standard SDD: **Planning → SEO → IA → Content → Design → Development → Release**

**Problem:** Not all applications need all phases.
- CLI app doesn't need SEO/Content/Design
- Website needs SEO/IA/Content but minimal backend
- Mobile app needs Design/Development but no SEO/IA
- CMS extension needs minimal planning

**Solution:** Detect project type → Auto-select optimal flow → Skip irrelevant phases

---

## Application Types & Optimal Flows

### 1. **Web Application** (SaaS, Admin Dashboards, Internal Tools)

**Characteristics:**
- Multi-page, complex state
- User authentication required
- Database-backed
- Performance-critical

**SDD Flow:**
```
Planning → API Design → Frontend Architecture → Design → Development → Release

Phases:
  Planning:          (3h) Requirements + tech stack + ADRs
  API Design:        (1h) API endpoints + contracts (skip SEO/IA/Content)
  Frontend Arch:     (1h) Component hierarchy + state management
  Design:            (2h) UI components + interactions
  Development:       (6h) Backend + frontend
  Release:           (0.5h) Deploy to staging/prod

Total: 13.5h (vs 23h standard SDD)
```

**Skip phases:** SEO (not search-indexed), Content (minimal copy), IA (navigation simple)

**Auto-detect trigger:** Multi-page + auth required + database

---

### 2. **Marketing/Content Website**

**Characteristics:**
- Search-engine discovery critical
- Content-first architecture
- Static/semi-dynamic
- Multiple content types

**SDD Flow:**
```
Planning → SEO Strategy → IA → Content → Design → Development → Release

Phases:
  Planning:          (2h) Brand + audience + content pillars
  SEO Strategy:      (2h) Keyword mapping + targeting
  IA:                (1h) Sitemap + content hierarchy
  Content:           (4h) Copy + metadata
  Design:            (2h) Template system
  Development:       (3h) Build pages + optimize
  Release:           (0.5h) Deploy + monitor rankings

Total: 14.5h (full standard SDD needed)
```

**Keep all phases:** SEO is primary driver, content is core asset

**Auto-detect trigger:** Marketing domain + content-first positioning

---

### 3. **Mobile Application** (iOS/Android)

**Characteristics:**
- Touch-first interface
- Offline support often needed
- Performance on limited hardware
- App store distribution

**SDD Flow:**
```
Planning → Design → Development → Release

Phases:
  Planning:          (2h) User flows + feature list + tech stack
  Design:            (3h) Mobile screens + interactions + accessibility
  Development:       (8h) Native/cross-platform build
  Release:           (1h) App store submission + monitoring

Total: 14h (vs 23h standard)
```

**Skip phases:** SEO (not web-indexed), IA (mobile nav implicit), Content (minimal copy)

**Auto-detect trigger:** Mobile-first or app distribution

---

### 4. **CLI Tool / Command-Line Utility**

**Characteristics:**
- Text-based interface
- Minimal UI
- Developer-focused
- Performance critical

**SDD Flow:**
```
Planning → API Design → Development → Release

Phases:
  Planning:          (1h) Command surface + flags + behavior spec
  API Design:        (0.5h) Command contracts + exit codes
  Development:       (4h) Build + test coverage
  Release:           (0.5h) Package + distribute

Total: 6h (minimal phases)
```

**Skip phases:** Everything except planning + dev (no design needed)

**Auto-detect trigger:** CLI library or tool

---

### 5. **Browser Extension / Add-on**

**Characteristics:**
- Limited surface area
- Host page context integration
- Minimal independent UI
- Distribution via store

**SDD Flow:**
```
Planning → Design → Development → Release

Phases:
  Planning:          (1h) Functionality spec + permissions required
  Design:            (1h) Popup/options UI mockups
  Development:       (4h) Content scripts + background logic
  Release:           (0.5h) Store submission

Total: 6.5h (minimal flow)
```

**Skip phases:** SEO (not indexed), IA (minimal navigation), Content (minimal copy)

**Auto-detect trigger:** Browser target + extension manifest

---

### 6. **Backend Service / API / Microservice**

**Characteristics:**
- No UI
- Service-to-service integration
- High availability critical
- Documentation is "UI"

**SDD Flow:**
```
Planning → API Design → Development → Release

Phases:
  Planning:          (2h) Service boundaries + contracts
  API Design:        (1h) Endpoint specs + error handling
  Development:       (6h) Implementation + tests
  Release:           (1h) Deployment strategy + monitoring

Total: 10h
```

**Skip phases:** Design (no UI), SEO (not web), Content (docs separate)

**Auto-detect trigger:** No frontend + API-first architecture

---

### 7. **Batch Job / Cron / Script**

**Characteristics:**
- Single purpose
- Time-scheduled
- Minimal UI (maybe status endpoint)
- Integration with existing systems

**SDD Flow:**
```
Planning → Development → Release

Phases:
  Planning:          (0.5h) Job spec + inputs/outputs + schedule
  Development:       (2h) Implementation + error handling + logging
  Release:           (0.5h) Deploy to scheduler

Total: 3h (minimal)
```

**Skip phases:** Design (no UI), SEO, IA, Content, API Design (internal only)

**Auto-detect trigger:** Time-based + single-purpose

---

### 8. **npm Package / Library / SDK**

**Characteristics:**
- Code is the product
- Documentation critical
- No UI
- Version management important

**SDD Flow:**
```
Planning → Design (API) → Development → Release

Phases:
  Planning:          (1h) Public API spec + usage patterns
  Design (API):      (1h) Function signatures + types + examples
  Development:       (4h) Implementation + tests + docs
  Release:           (0.5h) Publish + version bump

Total: 6.5h
```

**Skip phases:** SEO (no web presence yet), IA, Content (handled separately)

**Auto-detect trigger:** npm/package registry target

---

### 9. **CMS Content / Plugin / Template**

**Characteristics:**
- Content-based customization
- Extends existing platform
- Re-usable across instances
- Quick deployment

**SDD Flow:**
```
Planning → Content Architecture → Content → Design → Development → Release

Phases:
  Planning:          (1h) Content model + use cases
  Content Arch:      (0.5h) Field structure + relationships
  Content:           (2h) Content templates + examples
  Design:            (1h) Theme/styling (optional)
  Development:       (2h) Plugin code + content loader
  Release:           (0.5h) Distribution

Total: 7h
```

**Skip phases:** SEO (platform-specific), IA (CMS provides)

**Auto-detect trigger:** CMS target + content-first

---

### 10. **Data Pipeline / ETL / Analytics**

**Characteristics:**
- Data transformation focus
- Monitoring/alerting critical
- Minimal user interface
- Reliability essential

**SDD Flow:**
```
Planning → Design (Data) → Development → Release

Phases:
  Planning:          (1h) Data flow spec + requirements
  Design (Data):     (1h) Schema + transformations + error handling
  Development:       (4h) Pipeline implementation + testing
  Release:           (1h) Deploy + monitoring setup

Total: 7h
```

**Skip phases:** SEO, IA, Content, traditional Design

**Auto-detect trigger:** Data source + ETL pattern

---

## Flow Selection Matrix

| Application Type | Planning | SEO | IA | Content | Design | Dev | Release | Time |
|---|---|---|---|---|---|---|---|---|
| Web App | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | 13.5h |
| Website | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 14.5h |
| Mobile | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | 14h |
| CLI | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | 6h |
| Extension | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | 6.5h |
| Backend | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | 10h |
| Batch | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | 3h |
| Package | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | 6.5h |
| CMS | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | 7h |
| ETL | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | 7h |

**Legend:** ✅ = Required | ❌ = Skip

---

## Adaptive Planning Phase

**Single entry point:** `/plan [app-type] [brief]`

### Step 1: Auto-Detect Application Type

```yaml
Detect by:
  - Keywords: "cli", "extension", "batch", "cron", "npm", "package"
  - Configuration: package.json (npm), manifest.json (extension), etc.
  - Repo structure: existing project type indicators
  - Explicit: User specifies `/plan web-app` or `/plan cli`

Example:
  Input: "Build a login feature for our SaaS platform"
  Detected: Web App (SaaS keyword + login implies auth)
  Flow: Planning → API → Frontend → Design → Dev → Release
```

### Step 2: Adaptive SDD Agents

Generate only relevant phase specs:

```
Web App → Planning Agent → API Design Agent → Frontend Arch Agent → Design Agent
          ↓
          Skip SEO/IA/Content agents (auto-disabled)
          ↓
          Output: Adaptive spec
```

### Step 3: Locked Flow Document

Output includes:

```yaml
# Adaptive SDD Flow — Web App

Type: Web Application
DetectedVia: SaaS + authentication keywords
Phases: [Planning, API Design, Frontend Architecture, Design, Development, Release]
Skipped: [SEO, IA, Content] (not applicable to web apps)

Timeline:
  Planning:        3h
  API Design:      1h
  Frontend Arch:   1h
  Design:          2h
  Development:     6h
  Release:         0.5h
  TOTAL:          13.5h

Why Skipped:
  SEO: Web apps not typically search-indexed, user-login required
  IA: Navigation implicit in app structure
  Content: Minimal copy, handled in UI design
```

---

## Phase-by-Phase Flow Optimization

### Planning (Always First)

**Adaptive planning: 0.5h - 3h depending on type**

```yaml
# CLI Tool
Brief: "Create a CLI for managing database migrations"
Planning:
  Problem statement:    (5 min)
  Command surface:      (10 min)
  Exit codes + behavior: (10 min)
  ADRs (minimal):       (5 min)
  Spec:                 (15 min)
Total: 45 min

---

# Web App
Brief: "Add user authentication to SaaS platform"
Planning:
  Problem statement:    (15 min)
  Architecture:         (30 min)
  ADRs (auth, cache):   (45 min)
  Requirements spec:    (45 min)
  Dependency graph:     (15 min)
Total: 2.5h
```

**Agents used:** All adaptive-planning agents (subset based on type)

---

### SEO (Web/Website/CMS only)

**Skip for:** Web App, Mobile, CLI, Extension, Backend, Batch, Package, ETL

**Time:** 2h (Website) or 0.5h (CMS)

**Agents:** SEO-Keyword-Mapper, Content-Pillar-Generator

---

### IA (Website/CMS only)

**Skip for:** Web App, Mobile, CLI, Extension, Backend, Batch, Package, ETL

**Time:** 1h (Website) or 0.5h (CMS)

**Agents:** Sitemap-Generator, User-Flow-Generator

---

### Content (Website/CMS only, optional for Mobile/Web App)

**Skip for:** CLI, Backend, Batch, Package, ETL, Extension

**Time:** 4h (Website) or 2h (CMS) or 1h (Web App minimal)

**Agents:** Content-Brief-Generator, Copy-Template-Generator

---

### Design (All except CLI, Backend, Batch, ETL)

**Skip for:** CLI, Backend, Batch, ETL

**Variants:**
- **UI Design:** Web App, Website, Mobile, Extension, CMS (2-3h)
- **API Design:** Backend, Package, Service, Web App (1h)
- **Data Design:** ETL, Pipeline (1h)

**Agents:** Design-System-Applier, API-Contract-Generator, Data-Schema-Designer

---

### Development (Always)

**Time varies by type:**
- CLI: 4h
- Batch: 2h
- Backend: 6h
- Web App: 6h
- Mobile: 8h
- Package: 4h
- CMS: 2h
- Extension: 4h
- ETL: 4h

**Agents:** Code-Generation-Supervisor, Test-Generator, Doc-Generator

---

### Release (Always)

**Time:** 0.5h - 1h (consistent across types)

**Agents:** Release-Plan-Generator, Monitoring-Setup-Generator

---

## Silent Ops Integration by Application Type

### Web Application
```
/silent unlock web-feature-[name]
  ↓
/silent commit "[feat] [feature-name]"
  ↓
Gates: [lint, test, security, design, integration]
  ↓
/silent merge
  ↓
/silent release [version]
```

### CLI Tool
```
/silent unlock cli-feature-[name]
  ↓
/silent commit "[feat] [feature-name]"
  ↓
Gates: [lint, test, security] (skip design)
  ↓
/silent merge
  ↓
/silent publish npm (or equivalent)
```

### Mobile App
```
/silent unlock mobile-feature-[name]
  ↓
/silent commit "[feat] [feature-name]"
  ↓
Gates: [lint, test, security, e2e-mobile]
  ↓
/silent merge
  ↓
/silent release-app [ios|android|both]
```

### Batch/Cron
```
/silent unlock batch-[job-name]
  ↓
/silent commit "[feat] [job-name]"
  ↓
Gates: [lint, test, integration] (quick)
  ↓
/silent merge
  ↓
/silent schedule [cron-expression]
```

**Principle:** Same Silent Ops framework, adapted gates per type

---

## Workflow Acceleration by Type

### Web Application (Parallelizable)

```
Week 1:
  Days 1-2: Planning (3h)
  Days 2-5: Design + Development parallel (3h + 6h)
  Days 5-7: Testing + Release (3h)

Result: 7 days (vs 13.5h sequential)
```

### Website (Content-first)

```
Week 1:
  Days 1-2: Planning + SEO parallel (2h + 2h)
  Days 2-3: IA + Content parallel (1h + 4h)
  Days 3-5: Design + Development parallel (2h + 3h)
  Days 5-7: Testing + Release (3h)

Result: 7 days (vs 14.5h sequential)
```

### CLI Tool (Fast)

```
Days 1:
  Morning: Planning (0.75h)
  Afternoon: Development (4h)
  Evening: Testing + Release (1.25h)

Result: 1 day (vs 6h sequential)
```

### Batch Job (Fastest)

```
Morning: Planning (0.5h) + Development (2h) + Release (0.5h)

Result: 3h (same day)
```

---

## Command Shortcuts by Application Type

### Web App
```
/plan web-app "User authentication"
  → Generates: Planning + API Design + Frontend Arch + Design specs (3h)

/develop web-auth
  → Context loads: Requirements + API spec + Design tokens
  → Auto-creates: Feature branch + component skeleton + tests

/gates web-auth
  → Runs: [lint, test, security, design, integration] (parallel)

/review web-auth
  → Runs: AC validator + code review + accessibility check

/ship web-auth
  → Merges + deploys to staging + monitors
```

### CLI Tool
```
/plan cli "Database migration CLI"
  → Generates: Planning + API design (1h)

/develop cli-migrate
  → Context loads: Command specs + exit codes
  → Auto-creates: CLI skeleton + arg parser + test suite

/gates cli-migrate
  → Runs: [lint, test, security] (no design)

/ship cli-migrate
  → Merges + publishes to npm + updates version
```

### Mobile App
```
/plan mobile "Push notification feature"
  → Generates: Planning + Design (2.5h)

/develop mobile-notifications
  → Context loads: User flows + design specs + platform APIs
  → Auto-creates: Screen skeletons + permission handling + tests

/gates mobile-notifications
  → Runs: [lint, test, security, e2e-mobile, a11y]

/ship mobile-notifications
  → Merges + triggers app store submission
```

### Batch Job
```
/plan batch "Nightly sync job"
  → Generates: Planning (0.5h)

/develop batch-sync
  → Context loads: Job spec + schedule
  → Auto-creates: Cron handler + error recovery + logging

/gates batch-sync
  → Runs: [lint, test] (quick)

/ship batch-sync
  → Merges + deploys to scheduler
```

---

## Comprehensive Metrics by Type

### Web Application
| Metric | Before | After | Gain |
|--------|--------|-------|------|
| Planning time | 8h | 3h | 62% faster |
| Development time | 16h | 6h | 62% faster |
| Total time | 48h | 13.5h | 72% faster |
| Manual steps | 150+ | 3-5 | 96% fewer |
| Rework rate | 20% | 2% | 90% less |
| Decision time | 4h | 0h | Eliminated |

### CLI Tool
| Metric | Before | After | Gain |
|--------|--------|-------|------|
| Planning time | 2h | 0.75h | 62% faster |
| Development time | 6h | 4h | 33% faster |
| Total time | 12h | 6h | 50% faster |
| Manual steps | 80 | 2-3 | 97% fewer |
| Rework rate | 15% | 1% | 93% less |

### Batch Job
| Metric | Before | After | Gain |
|--------|--------|-------|------|
| Planning time | 1h | 0.5h | 50% faster |
| Development time | 3h | 2h | 33% faster |
| Total time | 6h | 3h | 50% faster |
| Manual steps | 40 | 2 | 95% fewer |

**Pattern:** Smaller projects gain more % savings (core automation scales)

---

## Flow Detection Algorithm

```
Input: Project brief + optional context

1. Extract Keywords
   Keywords = ["cli", "web", "mobile", "api", "batch", "extension", "npm"]
   Match = [word for word in brief.lower().split() if word in Keywords]

2. Inspect Configuration Files
   has_package_json? → npm package likely
   has_manifest_json? → extension likely
   has_podfile/gradle? → mobile likely
   has_dockerfile? → backend/service likely

3. Detect from User Signals
   /plan cli → explicit
   /plan web-app → explicit
   /plan [app-type] [brief] → explicit

4. Infer from Brief Semantics
   "login" + "saas" → web app
   "command-line" → cli
   "android"/"ios" → mobile
   "scheduled" + "sync" → batch
   "extract"/"transform"/"load" → etl

5. Select Optimal Flow
   type = Match highest confidence type
   flow = SDD_FLOWS[type]
   agents = filter(agents, flow.phases)
   timeline = sum(flow.phase_times)

6. Output
   Return: (type, flow, timeline, agents_to_run)
```

---

## Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1)

```
1. Implement flow detection algorithm
   - Keywords → Type detection
   - Config inspection
   - Inferred type classifier

2. Create adaptive agent launcher
   - Load only relevant agents
   - Skip inapplicable phases
   - Validate phase dependencies

3. Build adaptive CLI commands
   - `/plan [type] [brief]`
   - `/develop [project]`
   - `/gates [project]`
   - `/ship [project]`
```

### Phase 2: Application-Specific Agents (Week 2)

```
1. Web App agents
   - API-Design-Generator
   - Frontend-Architecture-Agent

2. CLI agents
   - Command-Surface-Generator
   - Exit-Code-Specifier

3. Mobile agents
   - Mobile-Flow-Designer
   - Platform-API-Mapper

4. Backend agents
   - Service-Boundary-Designer
   - API-Contract-Generator

5. [Others as priority dictates]
```

### Phase 3: Integration (Week 3)

```
1. Wire to Silent Ops
   - Adaptive gates per type
   - Type-specific release processes

2. Integrate with Workflow Acceleration
   - Parallel schedules by type
   - Type-specific milestone tracking

3. Integrate with Agent Optimization
   - Type-aware context injection
   - Phase-specific validation rules
```

### Phase 4: Testing & Refinement (Week 4)

```
1. Test each flow with real projects
2. Benchmark against baseline
3. Refine detection algorithm
4. Document best practices per type
```

---

## Real-World Examples

### Example 1: Building a CLI Tool

```
Command: /plan cli "Postgres migration manager"

Auto-Detection:
  Keywords: "cli", "manager", "postgres"
  Type: CLI Tool (confidence: 95%)
  
Adaptive Flow:
  Planning → Development → Release
  Skipped: SEO, IA, Content, Design (standard), API Design
  
Generated Spec:
  PLANNING_BRIEF.md
    - Purpose: Manage database migrations
    - Commands: init, create, up, down, status
    - Exit codes: 0=success, 1=error, 2=migration conflict
    
  COMMAND_SPEC.yaml
    - [CLI command specs for each command]
    
  REQUIREMENTS.yaml
    - [All acceptance criteria]

Timeline: 45 min (vs 2h manual)

Next: /develop cli-migrations
  → Skeleton generated
  → arg-parser configured
  → Tests stubbed
  → Ready to code

Development: 4h (vs 8h manual)
Result: CLI tool in 4.75h (vs 10h before)
```

### Example 2: Building a SaaS Feature

```
Command: /plan web-app "User authentication with OAuth"

Auto-Detection:
  Keywords: "user", "authentication", "oauth"
  Config: Next.js + PostgreSQL
  Type: Web Application (confidence: 98%)

Adaptive Flow:
  Planning → API Design → Frontend Architecture → Design → Development → Release
  Skipped: SEO (internal app), IA (app nav implicit), Content (minimal copy)
  
Generated Spec:
  PLANNING_BRIEF.md
  API_DESIGN.yaml
  FRONTEND_ARCHITECTURE.md
  DESIGN_SPECS.md
  REQUIREMENTS.yaml (full context)

Timeline: 3h (vs 6h manual)

Next: /develop web-oauth
  → API endpoints generated
  → Frontend component skeleton
  → Design tokens applied
  → Tests for all AC
  → Ready to code

Development: 6h (vs 12h manual)
Result: Feature in 9h (vs 18h before)
```

### Example 3: Building a Batch Job

```
Command: /plan batch "Nightly analytics aggregation"

Auto-Detection:
  Keywords: "nightly", "batch", "aggregation"
  Type: Batch Job (confidence: 92%)

Adaptive Flow:
  Planning → Development → Release
  Skipped: All UI/content phases

Generated Spec:
  PLANNING_BRIEF.md
    - Schedule: 2 AM UTC daily
    - Input: Raw events table
    - Output: aggregated_events table
    - Error handling: Slack notification + retry logic
    
  JOB_SPEC.yaml
    - [Detailed job spec]

Timeline: 30 min

Next: /develop batch-analytics
  → Cron handler skeleton
  → Error recovery handlers
  → Logging configured
  → Monitoring alerts

Development: 2h
Result: Batch job in 2.5h (vs 6h before)
```

---

## Success Criteria

### By Application Type

| Type | Planning | Dev | Total | Reduction |
|---|---|---|---|---|
| Web App | 3h | 6h | 9h | 62% |
| Website | 5h | 3h | 8h | 45% |
| Mobile | 2.5h | 8h | 10.5h | 54% |
| CLI | 0.75h | 4h | 4.75h | 60% |
| Backend | 2h | 6h | 8h | 20% |
| Batch | 0.5h | 2h | 2.5h | 58% |
| Package | 1h | 4h | 5h | 23% |
| Extension | 1h | 4h | 5h | 23% |
| CMS | 1h | 2h | 3h | 57% |
| ETL | 1h | 4h | 5h | 29% |

**Baseline:** Assumes 20-24h for typical project

---

## Usage: Three-Command Development Cycle

### Command 1: Plan
```bash
/plan [app-type] [brief]
  ↓
Generates adaptive spec (0.5h - 3h)
Locks decisions via ADRs
Ready for development
```

### Command 2: Develop
```bash
/develop [feature-name]
  ↓
Loads context (spec + design + tests)
Generates skeleton (50% code pre-filled)
Ready to code
```

### Command 3: Ship
```bash
/ship [feature-name]
  ↓
Auto-runs gates (parallel)
Auto-merges if passing
Auto-releases (type-aware)
```

**Total developer steps: 3** (vs 100+ manual)

---

## Integrated System Architecture

```
┌─ Adaptive SDD Flow System
│  ├─ Flow Detection
│  │  ├─ Keywords
│  │  ├─ Config Inspection
│  │  └─ Semantic Inference
│  │
│  ├─ Adaptive Agents
│  │  ├─ Planning Agents (universal)
│  │  ├─ Type-Specific Agents
│  │  └─ Development Agents (universal)
│  │
│  └─ Phase Selection
│     └─ Render only relevant phases
│
├─ Silent Ops (Git Automation)
│  ├─ `/silent unlock` → Type-aware branch
│  ├─ `/silent commit` → Type-aware gates
│  ├─ `/silent merge` → Type-aware merge
│  └─ `/silent release` → Type-aware publish
│
├─ Workflow Acceleration
│  ├─ Parallel phase scheduling
│  ├─ Phase-aware dependencies
│  └─ Type-specific milestones
│
└─ Agent Optimization
   ├─ Context injection (type-aware)
   ├─ Gate running (type-specific)
   └─ AC validation (phase-aware)
```

---

## Migration from Standard SDD

**For existing v3.2-P1 (Web App):**
```
Old: Planning → SEO → IA → Content → Design → Development → Release
New: Planning → API Design → Frontend Arch → Design → Development → Release

Time saved: Skip 3 phases (SEO, IA, Content)
Impact: Already running? No change. Next features use adaptive flow.
```

**For v3.2-P2-P6:**
```
Apply adaptive flow to each feature
Estimate time by type
Parallelize non-blocking phases
```

---

## Conclusion

**One system, infinite configurations.**

- CLI tool? Skip design, get spec in 45 min, ship in 4.75h
- SaaS feature? Full flow, get spec in 3h, ship in 9h
- Batch job? Minimal flow, get spec in 30 min, ship in 2.5h
- Website? Full flow, prioritize SEO/content, ship in 8h

**Result:** Every project type gets optimal development pipeline. No wasted phases. No missing specs. Fastest possible execution for each context.

