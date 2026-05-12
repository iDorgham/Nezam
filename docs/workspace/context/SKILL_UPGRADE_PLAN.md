# NEZAM Skill Upgrade & Expansion Plan
> Generated: 2026-05-12  
> Source analysis: `docs/nezam/RF/skills/` × `.cursor/skills/` × superdesign methodology  
> Scope: 7 upgrades + 10 new skills + 7 design improvements = **24 total changes**

---

## Overview

Three parallel streams, executed in the order below:

| Stream | Type | Count | Primary Source |
|--------|------|-------|----------------|
| B | Design methodology improvements | 7 items (2 new, 5 upgrades) | `docs/nezam/RF/skills/superdesign/` |
| A1 | RF vendor skill upgrades | 7 upgrades to existing skills | `docs/nezam/RF/skills/official_*/` |
| A2 | RF net-new skills | 10 new skills | `docs/nezam/RF/skills/official_*/` |

**Design stream (B) goes first** — it establishes ground-truth discipline and context-extraction methodology that all subsequent development work depends on.

---

## Stream B — Superdesign-Informed Design Skill Improvements

> Principle: extract the **methodology** from superdesign's SOP. Do not replicate the CLI tool or its proprietary commands. The value is in the *discipline* — ground truth before iteration, fidelity enforcement, recursive import tracing, structured variation count.

### B-1 NEW: `design/design-context-init` *(net-new)*

**Path:** `.cursor/skills/design/design-context-init/SKILL.md`  
**Source:** `docs/nezam/RF/skills/superdesign/INIT.md`  
**SDD Phase:** design (prerequisite gate for all design work on unfamiliar codebases)

**What to build:**  
A structured repo-analysis skill that collects full design context before any design work begins. Mirrors superdesign's INIT protocol without the tool dependency.

**Procedure to encode:**
1. **components.md** — full source code of all UI primitive components (Button, Input, Card, etc.). No excerpts — full files.
2. **layouts.md** — full source of all shared layout components and wrappers.
3. **routes.md** — route-to-page-component mapping (all entry points).
4. **theme.md** — complete CSS variables, Tailwind config, design tokens. Every color, spacing, font definition.
5. **pages.md** — per key-page dependency trees (which components are imported, which tokens consumed).
6. **extractable-components.md** — components that are ready for extraction/reuse, with current prop surface.

**Rule:** All 6 files must exist before any design iteration begins. If any is missing or stale (>48h since last change to source files), re-run the init.

**Output artifacts:** `.cursor/context/design-init/` directory containing the 6 files.  
**Dependencies:** `design/design-tokens`, `design/css-architecture`

---

### B-2 UPGRADE: `design/design-to-code-handoff`

**Path:** `.cursor/skills/design/design-to-code-handoff/SKILL.md` (currently 44 lines — thin)  
**Source:** `docs/nezam/RF/skills/superdesign/SUPERDESIGN.md` §§ pixel-perfect reproduction, context file discipline  
**SDD Phase:** design → development gate

**What to add:**

1. **Ground-truth-first rule:** Before writing any new component, locate the closest existing component in `design-init/components.md`. Document exact markup structure, class list, and token usage. The new component must be structurally identical until a deliberate deviation is approved.

2. **Recursive import tracing:** When handing off a component, trace all UI-touching imports recursively. Document the full dependency chain (component → sub-component → token → CSS variable). Do not hand off a partial tree.

3. **Context file selection rules:**  
   - Always include `theme.md` (token definitions).  
   - Always include the component's own file plus all direct UI imports.  
   - For pages: include `layouts.md` + the page's dependency tree from `pages.md`.

4. **1000+ line file handling:** For files >1000 lines, extract only the relevant component section plus its full import block. Never truncate token definitions.

5. **Handoff checklist additions:**
   - [ ] Component matches `components.md` structure or deviation is documented
   - [ ] All token references are from `theme.md`, none hardcoded
   - [ ] Import tree is complete (no missing sub-component context)
   - [ ] RTL mirror verified if `rtl_aware: true`

---

### B-3 UPGRADE: `design/wireframe-pipeline`

**Path:** `.cursor/skills/design/wireframe-pipeline/SKILL.md`  
**Source:** `docs/nezam/RF/skills/superdesign/SUPERDESIGN.md` §§ pixel-perfect reproduction step, design-system.md fidelity  
**SDD Phase:** design

**What to add:**

1. **Step 0 — Pixel-perfect reproduction gate (new mandatory first step):**  
   Before any new wireframe is created, reproduce the closest existing screen/component at 100% fidelity using only existing tokens. This is non-negotiable. It serves as the ground-truth baseline. Only after this baseline is documented can iteration (variations/branches) begin.

2. **Design-system.md as hard constraint:**  
   - `DESIGN.md` (repo root) is not a reference — it is a **hard constraint**.  
   - Any wireframe element that cannot be expressed in existing tokens must be flagged as a token gap, not worked around with one-off values.  
   - Wireframe review checklist must include: "Every color, spacing, and radius value maps to a token in DESIGN.md."

3. **Variation discipline:**  
   - Default: **2 variations** per wireframe iteration.  
   - Variation A: conservative (closest to existing design system).  
   - Variation B: progressive (pushes one design dimension — layout, hierarchy, or density).  
   - Never present a single variation as "the design."

4. **Iteration mode decision:**  
   - **Branch mode** (default): variations extend from the baseline — use when exploring alternatives.  
   - **Replace mode**: a new direction replaces the baseline — use only when baseline is confirmed broken by UX research.  
   - Document which mode is active in the wireframe spec header.

---

### B-4 UPGRADE: `design/interaction-choreography`

**Path:** `.cursor/skills/design/interaction-choreography/SKILL.md` (currently 44 lines — thin)  
**Source:** `docs/nezam/RF/skills/superdesign/SUPERDESIGN.md` §§ branch mode, variation count  
**SDD Phase:** design

**What to add:**

1. **Structured variation count:** Every interaction pattern must ship with exactly 2 motion variations (easing A vs easing B, or duration A vs duration B). A single "the animation" is not an output — a comparative pair is.

2. **Branch vs replace decision logic:**  
   - Branch: same interaction trigger, different execution (e.g., spring vs ease-out, 200ms vs 350ms).  
   - Replace: new interaction pattern entirely (e.g., slide → fade). Requires UX research justification.

3. **Fidelity check before shipping motion:**  
   - Motion values must reference the motion tokens defined in `DESIGN.md` (duration-fast, duration-base, easing-standard, etc.).  
   - If no motion token exists for the needed value, create the token first via `design/design-token-architecture` — do not hardcode.

4. **Context file requirement:**  
   - When writing interaction specs, always reference `design-init/theme.md` for existing motion variables.  
   - Always reference `design-init/components.md` for the component's current transition state.

---

### B-5 UPGRADE: `design/component-library-api`

**Path:** `.cursor/skills/design/component-library-api/SKILL.md`  
**Source:** `docs/nezam/RF/skills/superdesign/SUPERDESIGN.md` §§ Petite-Vue component extraction template  
**SDD Phase:** design → development

**What to add:**

1. **Component extraction workflow:**  
   When extracting a component from an existing page into a reusable primitive:
   - Step 1: Document the full current implementation from `design-init/components.md`.
   - Step 2: Identify what is hardcoded (must stay hardcoded — layout, base structure) vs what becomes a prop (content, variant, state).
   - Step 3: Define the prop surface explicitly before writing any code: `{ variant, size, disabled, children, className? }`.
   - Step 4: The hardcoded structure is the component skeleton — props only control appearance/content, never layout.

2. **Petite-Vue-style extraction template (framework-agnostic principle):**
   ```
   Component: <Name>
   Hardcoded: base layout, spacing structure, animation trigger
   Props: variant (primary|secondary|ghost), size (sm|md|lg), disabled, children
   Slots: none | header | footer
   Emits: onClick, onChange (if stateful)
   Tokens consumed: [list from theme.md]
   ```

3. **API completeness checklist:**
   - [ ] All visual states (default, hover, focus, disabled, loading) are enumerated as variants or handled internally
   - [ ] No layout values are passed as props (layout is hardcoded)
   - [ ] All token references documented in "Tokens consumed"
   - [ ] RTL mirror considered for directional props (e.g., `iconPosition: start|end`, not `left|right`)

---

### B-6 NEW: `design/design-iteration-protocol` *(net-new)*

**Path:** `.cursor/skills/design/design-iteration-protocol/SKILL.md`  
**Source:** `docs/nezam/RF/skills/superdesign/SUPERDESIGN.md` §§ Step 3a + 3b workflow  
**SDD Phase:** design

**What to build:**  
A standalone skill that encodes the two-step iteration workflow applicable to any design work in NEZAM.

**The protocol:**

**Step A — Ground Truth Reproduction (mandatory, non-skippable):**
- Reproduce the current design at 100% fidelity using only existing tokens and components.
- Output: a "baseline spec" document in `.cursor/context/design-init/baseline-<screen>.md`.
- This step has no variations. It is a faithful capture, not an interpretation.
- Acceptance: baseline is approved (or explicitly waived with documented reason) before Step B begins.

**Step B — Branch Variations:**
- Starting from the approved baseline, produce exactly 2 variations.
- Each variation must change only one design dimension (not everything at once):
  - Variation A: closest to current system (evolutionary)
  - Variation B: one deliberate push (revolutionary on one axis)
- Each variation must pass the token-fidelity check (no hardcoded values).
- Output: two variation specs in `.cursor/context/design-init/variation-<screen>-A.md` and `-B.md`.

**When to skip Step A:**  
Only when designing a brand-new screen with zero existing reference (greenfield). In this case, `design-context-init` must still be run to understand the token/component environment.

**Dependencies:** `design/design-context-init`, `design/wireframe-pipeline`

---

### B-7 UPGRADE: `design/brand-visual-direction`

**Path:** `.cursor/skills/design/brand-visual-direction/SKILL.md`  
**Source:** `docs/nezam/RF/skills/superdesign/SUPERDESIGN.md` §§ design-system.md as hard constraint, drift prevention  
**SDD Phase:** design

**What to add:**

1. **DESIGN.md as non-negotiable authority:**  
   All brand decisions must be expressible via tokens in `DESIGN.md`. If a brand direction requires a color not in the palette, that color must be added to the token system *first* (via `design/design-token-architecture`) before being used in any design output.

2. **Drift prevention rules:**
   - A brand audit must be run before any major design change. The audit compares current token usage across all components against `DESIGN.md` as ground truth.
   - Any component found using hardcoded values (hex, px without token backing) is a drift violation — flagged as HIGH in the audit report.
   - Design direction that cannot be implemented without hardcoding is rejected at this stage and sent back to token architecture.

3. **Design-system.md sync gate:**  
   After any brand direction update, `DESIGN.md` must be updated to reflect new/changed tokens within the same PR. Brand direction and design system are always in sync — they are never allowed to diverge.

---

## Stream A1 — RF Vendor Skill Upgrades (Existing Skills)

### A1-1 UPGRADE: `backend/prisma-orm`

**Path:** `.cursor/skills/backend/prisma-orm/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_prisma/skill.md`  
**Key additions:**

1. **PrismaClient initialization with adapter pattern:**
   ```ts
   import { PrismaClient } from '@prisma/client'
   import { PrismaNeon } from '@prisma/adapter-neon'
   const adapter = new PrismaNeon(pool)
   const prisma = new PrismaClient({ adapter })
   ```

2. **$transaction with isolation levels:**
   ```ts
   await prisma.$transaction(async (tx) => { ... }, {
     isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
     maxWait: 5000,
     timeout: 10000,
   })
   ```

3. **$queryRaw safety rule:** Always use `Prisma.sql` template tag, never string concatenation. Add explicit anti-pattern example showing the unsafe vs safe form.

4. **Cursor pagination pattern** (replacing offset pagination as default):
   ```ts
   findMany({ take: 20, cursor: { id: lastId }, skip: 1, orderBy: { id: 'asc' } })
   ```

5. **Result extensions** — add `$extends` pattern for computed fields (e.g., `fullName` from `firstName + lastName`).

6. **Validation rule update:** Add check — "schema.prisma uses `adapter` flag, not deprecated `previewFeatures`."

---

### A1-2 UPGRADE: `backend/resend-email`

**Path:** `.cursor/skills/backend/resend-email/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_resend/skill.md`  
**Key additions:**

1. **Full email delivery architecture** to document in the skill:
   ```
   User → Email Form → Input Validation → Double Opt-In Flow
   → Suppression List Check → Idempotent Send (idempotency-key header)
   → Webhook Event Handler (delivered/bounced/complained/unsubscribed)
   ```

2. **Deliverability setup checklist** (add as mandatory prerequisite):
   - [ ] SPF record: `include:amazonses.com` (Resend uses SES infrastructure)
   - [ ] DKIM: CNAME records from Resend dashboard added to DNS
   - [ ] DMARC: `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com`
   - [ ] Custom domain verified in Resend dashboard before first send

3. **Compliance matrix** (add as procedure section):
   | Regulation | Requirement | Implementation |
   |---|---|---|
   | CAN-SPAM | Unsubscribe link | One-click unsubscribe header + list-unsubscribe |
   | GDPR | Consent record | Store consent timestamp + IP at opt-in |
   | CASL | Express consent | Double opt-in flow mandatory for CA recipients |

4. **Idempotent send pattern:**
   ```ts
   resend.emails.send({ ... }, {
     headers: { 'Idempotency-Key': `email-${userId}-${templateId}-${dateISO}` }
   })
   ```

5. **Suppression check** — always query Resend suppression list before sending transactional emails. Add `GET /suppressions` call to procedure.

---

### A1-3 UPGRADE: `backend/vercel-ai-sdk`

**Path:** `.cursor/skills/backend/vercel-ai-sdk/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_vercel/skill.md` (use_ai_sdk variant)  
**Key additions:**

1. **CRITICAL warning to add at top of skill:**  
   > "Everything you know about the Vercel AI SDK may be outdated. Always verify against the live source at `https://github.com/vercel/ai` before implementing. Model IDs change frequently."

2. **Live model ID verification step** — add to Prerequisites:
   ```bash
   curl https://ai-gateway.vercel.sh/v1/models | jq '.data[].id'
   ```
   Never hardcode model IDs. Always fetch at setup time.

3. **ToolLoopAgent pattern** — add as a core pattern:
   ```ts
   const result = await generateText({
     model, tools, maxSteps: 10,
     system: '...',
     messages,
   })
   // result.steps[] contains each tool call + result
   ```

4. **streamText vs generateText decision matrix:**
   | Use case | Function |
   |---|---|
   | Chat UI with streaming | `streamText` |
   | Background processing | `generateText` |
   | Structured output | `generateObject` |
   | Tool loop (agent) | `generateText` with `maxSteps` |

5. **Add validation rule:** Check that import is from `ai` not `@vercel/ai` (old package).

---

### A1-4 UPGRADE: `external/git-workflow`

**Path:** `.cursor/skills/external/git-workflow/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_github/` (security_review + threat_model variants)  
**Key additions:**

1. **Security scan gate in PR workflow** — before merge, run:
   - Dependency audit: `npm audit --audit-level=high`
   - Secrets scan: `git log --all -p | grep -E "(api_key|secret|token|password)" --ignore-case`
   - Add to PR checklist: "No HIGH/CRITICAL vulnerabilities in `npm audit`"

2. **Commit classification rule** — add STRIDE-A annotation for security-relevant commits:
   - Commits touching auth, payments, data access, or external API calls must include `[SECURITY]` tag in commit message.
   - These commits trigger mandatory security review before merge.

3. **Branch protection enforcement rules** to document:
   - `main`/`production`: require PR + 1 approval + passing CI + no secrets detected
   - `develop`: require PR + passing CI
   - Direct pushes to `main` are never permitted.

4. **ADR trigger rule** — when a PR introduces a technology choice (new library, new pattern, new infrastructure), an ADR must be created. Link the ADR in the PR description. (Connects to A2-7 `system/adr`.)

---

### A1-5 UPGRADE: `quality/security-hardening`

**Path:** `.cursor/skills/quality/security-hardening/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_github/` (security_review + threat_model_analyst)  
**Key additions:**

1. **Data-flow tracing procedure** — add as Step 1:
   - Map all data entry points (HTTP endpoints, form inputs, webhook receivers, file uploads).
   - Trace each input to its output (database write, API call, rendered output).
   - Any input that reaches an output without explicit sanitization/validation is a HIGH finding.

2. **STRIDE-A threat classification** (STRIDE + Abuse cases):
   | Category | Examples |
   |---|---|
   | Spoofing | JWT without signature verification, missing auth middleware |
   | Tampering | Unvalidated update payloads, missing ownership checks |
   | Repudiation | No audit log for write operations |
   | Information Disclosure | Stack traces in production, over-fetching in API responses |
   | Denial of Service | No rate limiting, unbounded queries |
   | Elevation of Privilege | Missing RBAC, horizontal privilege escalation |
   | **Abuse** | Account enumeration, credential stuffing, scraping |

3. **Incremental analysis mode** — add to procedure:
   - First run: full baseline security report → stored at `docs/security/baseline-<date>.md`.
   - Subsequent runs on code diffs: only analyze changed files, compare against baseline, output delta report showing new/resolved/persisting findings.

4. **CRITICAL/HIGH/MEDIUM/LOW/INFO rating matrix** — add explicit definitions and required response times:
   | Rating | Definition | Response |
   |---|---|---|
   | CRITICAL | RCE, auth bypass, data breach | Block deploy, fix before merge |
   | HIGH | Privilege escalation, injection | Fix before next sprint |
   | MEDIUM | Information leakage, weak crypto | Fix within 2 sprints |
   | LOW | Defense-in-depth gaps | Backlog with owner |
   | INFO | Best practice notes | Optional |

---

### A1-6 UPGRADE: `system/spec-writing`

**Path:** `.cursor/skills/system/spec-writing/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_vercel/` (adr_skill variant — "ADR as executable spec")  
**Key additions:**

1. **Agent-readiness checklist** — every spec must pass before handoff to a coding agent:
   - [ ] Unambiguous decision: spec states what to build, not what to consider
   - [ ] Implementation plan included: step-by-step sequence an agent can execute
   - [ ] Edge cases enumerated: what happens when X is null, Y is empty, Z fails
   - [ ] No external dependencies unresolved: all APIs, schemas, env vars defined
   - [ ] Acceptance criteria are testable: each criterion maps to a specific assertion

2. **Socratic questioning gate** — before writing any spec, answer:
   - What problem does this solve? (1 sentence)
   - What is explicitly out of scope? (list)
   - What is the simplest version that validates the hypothesis?
   - What would make this spec wrong?

3. **Spec-to-ADR escalation rule:** When a spec introduces a technology choice or architectural pattern not already in the codebase, it must escalate to an ADR (see A2-7). The spec references the ADR; the ADR references the spec.

---

### A1-7 UPGRADE: `external/deployment-checklist`

**Path:** `.cursor/skills/external/deployment-checklist/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_vercel/` + `official_firebase/`  
**Key additions:**

1. **Firebase Security Rules gate** (for projects using Firebase):
   - [ ] Rules scored ≥4/5 using the Firebase Security Rules Auditor checklist
   - [ ] No wildcard `allow read, write: if true` rules
   - [ ] All write rules have ownership check: `request.auth.uid == resource.data.userId`
   - [ ] Type safety enforced: `request.resource.data.keys().hasOnly([...])` on all writes

2. **Vercel deployment checklist additions:**
   - [ ] All environment variables set in Vercel dashboard (not hardcoded)
   - [ ] Edge runtime vs Node runtime decision documented
   - [ ] Preview deployment tested before production promotion
   - [ ] `vercel.json` rewrite/redirect rules reviewed for security (no open redirects)

3. **Post-deploy verification steps:**
   - Run smoke tests against production URL (not preview)
   - Verify `Content-Security-Policy` header is present
   - Check that no development/debug routes are accessible in production
   - Confirm rate limiting is active on all auth endpoints

---

## Stream A2 — RF Net-New Skills

### A2-1 NEW: `backend/firebase` *(net-new)*

**Path:** `.cursor/skills/backend/firebase/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_firebase/skill.md`  
**SDD Phase:** development  
**Tier:** 2

**Scope:** Firestore data modeling, real-time listeners, offline persistence, Firebase Auth integration patterns, Callable Functions vs HTTP Functions decision, and the NEZAM-specific Firebase + Supabase hybrid pattern (when to use which).

**Key procedures:**
- Collection design: favor flat collections over deep nesting (max 2 levels)
- Real-time listener cleanup: always return unsubscribe function from `onSnapshot`
- Offline persistence: `enableIndexedDbPersistence()` for web, automatic on mobile
- Auth → Firestore permission chain: always use `request.auth.uid` as document owner field

---

### A2-2 NEW: `backend/firebase-security-rules` *(net-new)*

**Path:** `.cursor/skills/backend/firebase-security-rules/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_firebase/` (security_rules_auditor variant)  
**SDD Phase:** development → deployment gate  
**Tier:** 1 (security-critical)

**Core audit checklist (mandatory, run before every deploy):**

| Check | Rule | Risk if failed |
|---|---|---|
| Update Bypass | No `allow update` without ownership check | User A modifies User B's data |
| Authority Source | All permissions derive from `request.auth`, never from request data | Client can forge permissions |
| Storage Abuse | Storage rules have size limits: `request.resource.size < 5 * 1024 * 1024` | Unlimited file upload |
| Type Safety | All writes validate field types: `request.resource.data.name is string` | Schema corruption |
| Field-Level | Sensitive fields (email, role) are read-restricted by identity | Data leakage |

**Scoring:** 1–5. Deploy blocked if score <4.

---

### A2-3 NEW: `infrastructure/firecrawl` *(net-new)*

**Path:** `.cursor/skills/infrastructure/firecrawl/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_firecrawl/skill.md`  
**SDD Phase:** development  
**Tier:** 3

**Scope:** Web content extraction for AI pipelines. Firecrawl converts any URL to clean markdown/structured data — used in NEZAM for content ingestion, competitive research pipelines, and RAG data sourcing.

**Key patterns:**
- `scrape` — single URL to markdown
- `crawl` — full site crawl with depth/path filters
- `extract` — LLM-powered structured extraction with schema
- Always set `onlyMainContent: true` to strip navigation/ads
- Use `waitFor` selector when page requires JavaScript rendering

**NEZAM integration point:** Connects to `infrastructure/vector-search` (firecrawl → chunk → embed → store).

---

### A2-4 NEW: `infrastructure/browserbase` *(net-new)*

**Path:** `.cursor/skills/infrastructure/browserbase/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_browserbase/skill.md`  
**SDD Phase:** development / quality  
**Tier:** 3

**Scope:** Cloud browser automation for UI testing and web scraping requiring JavaScript execution, auth sessions, and anti-bot bypass.

**Adversarial testing protocol (3 rounds — from RF source):**
- Round 1 — **Functional:** Happy path, expected inputs, normal user flow
- Round 2 — **Adversarial:** Boundary inputs, invalid states, race conditions, auth edge cases
- Round 3 — **Coverage gaps:** What did rounds 1–2 miss? Explicitly document untested paths

**Parallel sub-agent execution:** For large test suites, spawn parallel Browserbase sessions. Each session is isolated — no shared state between parallel runs.

**NEZAM integration:** Used in `quality/regression-detector` for full browser regression tests. Upgrades the current thin regression-detector skill.

---

### A2-5 NEW: `backend/apify-scraper` *(net-new)*

**Path:** `.cursor/skills/backend/apify-scraper/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_apify/skill.md`  
**SDD Phase:** development  
**Tier:** 3

**Scope:** Managed scraping infrastructure via Apify Actors. Used for NEZAM's competitive intelligence, content research, and data pipeline tasks.

**Actor catalog to document (55+ available — priority subset):**
- Instagram: profile scraper, hashtag scraper, comment scraper
- Facebook: page scraper, group scraper, ad library
- TikTok: profile, hashtag, sound scrapers
- Google: Maps scraper, Search SERP, Shopping
- Reviews: TripAdvisor, Trustpilot, Google Maps reviews
- Real estate: Booking.com, Airbnb, Zillow

**Key procedure:** Always check Actor pricing (pay-per-result vs compute units) before selecting. Store credentials in Apify Key-Value Store, not env vars.

---

### A2-6 NEW: `backend/gemini-integration` *(net-new)*

**Path:** `.cursor/skills/backend/gemini-integration/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_google_gemini/skill.md`  
**SDD Phase:** development  
**Tier:** 2

**CRITICAL notice to add at top:**
> Use SDK `google-genai` (NOT the deprecated `google-generativeai` package). Import: `import { GoogleGenAI } from '@google/genai'`

**Current model IDs (verify at implementation time):**
- `gemini-2.5-pro-preview-05-06` — best reasoning
- `gemini-2.5-flash-preview-04-17` — fast/cheap

**Key patterns:**
- Multimodal input (image + text in same request)
- Streaming responses via `generateContentStream`
- Function calling (tools) with automatic loop
- Grounding with Google Search (live web data in responses)
- File API for large document processing (>2MB)

**NEZAM integration:** Connects to `backend/vercel-ai-sdk` via provider pattern — Gemini can be used as an alternate provider alongside OpenAI/Anthropic.

---

### A2-7 NEW: `system/adr` *(net-new)*

**Path:** `.cursor/skills/system/adr/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_vercel/` (adr_skill variant)  
**SDD Phase:** planning  
**Tier:** 1

**Core concept:** ADR (Architecture Decision Record) as an executable spec for coding agents, not just documentation.

**4-phase procedure:**

**Phase 1 — Codebase Scan:**  
Before writing anything, scan: existing ADRs in `docs/adr/`, current tech stack in `package.json`, existing patterns in `.cursor/skills/`. Understand what decisions have already been made.

**Phase 2 — Socratic Questions:**  
Answer before drafting:
1. What is the problem being solved?
2. What are the alternative solutions considered?
3. What are the trade-offs of each?
4. What constraints eliminate alternatives?
5. What does success look like in 6 months?

**Phase 3 — ADR Draft (agent-executable format):**
```markdown
# ADR-XXXX: [Decision Title]
Status: proposed | accepted | deprecated | superseded
Date: YYYY-MM-DD

## Context
[1-2 paragraphs: problem + constraints]

## Decision
[Exactly what was decided — one clear sentence]

## Implementation Plan
1. [Step an agent can execute]
2. [Step an agent can execute]
...

## Consequences
### Positive
### Negative
### Risks

## Agent-Readiness Checklist
- [ ] All dependencies available
- [ ] All env vars defined
- [ ] Breaking changes documented
- [ ] Migration path clear
```

**Phase 4 — Agent-readiness review:**  
Could a coding agent implement this decision from the ADR alone, without asking questions? If no — the ADR is incomplete.

**Storage:** `docs/adr/XXXX-<kebab-title>.md` (sequential numbering)

---

### A2-8 NEW: `system/agents-md` *(net-new)*

**Path:** `.cursor/skills/system/agents-md/SKILL.md`  
**RF Source:** Cross-synthesis from RF agent architecture patterns  
**SDD Phase:** planning  
**Tier:** 1

**Scope:** The discipline of maintaining `AGENTS.md` (or `.cursor/agents/*.md`) as living, executable agent definitions — not static role descriptions.

**Key procedures:**
- Agent definitions must include: trigger conditions (exact), input contract, output contract, handoff targets, failure modes
- Agent files are versioned: changes require a changelog entry
- Every agent must have an `EVAL_FRAMEWORK.md` counterpart defining how its output quality is measured
- When adding a new agent to the swarm, run `pnpm ai:sync` to propagate to `.opencode/` and `.claude/`

**Quality gates:**  
- Agent description must be completable in one sentence (if not, it's doing too much)
- Handoff target must be a named agent or skill (no "pass to next step")
- Failure mode must specify fallback behavior, not just "log error"

---

### A2-9 NEW: `frontend/shadcn-ui` *(net-new)*

**Path:** `.cursor/skills/frontend/shadcn-ui/SKILL.md`  
**RF Source:** Cross-synthesis from `official_vercel`, `official_prisma` patterns (component architecture)  
**SDD Phase:** development  
**Tier:** 2

**Scope:** Correct shadcn/ui installation, customization, and composition patterns in the NEZAM stack (Next.js + Tailwind + design tokens).

**Key rules:**
- Always run `npx shadcn@latest add <component>` — never copy-paste components manually
- After adding a component, update `design-init/components.md` with the new component source
- All shadcn components live in `components/ui/` — never modify them in place; extend via wrapper components
- Token mapping: connect shadcn CSS variables (`--primary`, `--background`, etc.) to NEZAM design tokens via `globals.css`
- RTL support: add `dir="rtl"` class variants for all directional components

**Anti-patterns to document:**
- Never import from `shadcn/ui` directly — always from `@/components/ui/<component>`
- Never override shadcn styles with hardcoded values — always via CSS variables
- Never use the default shadcn color palette directly — always remap to NEZAM tokens

---

### A2-10 NEW: `frontend/wordpress` *(net-new)*

**Path:** `.cursor/skills/frontend/wordpress/SKILL.md`  
**RF Source:** `docs/nezam/RF/skills/official_wordpress/skill.md`  
**SDD Phase:** development  
**Tier:** 3

**Scope:** Headless WordPress integration — WordPress as CMS, Next.js as frontend. Used in NEZAM client projects requiring WordPress content management.

**Key patterns:**
- WPGraphQL for content fetching (not REST API — too verbose)
- ISR (Incremental Static Regeneration) for WordPress pages: `revalidate: 60`
- Preview mode for draft content via WordPress preview URLs
- Custom Post Types → GraphQL types via WPGraphQL Custom Post Type UI
- ACF (Advanced Custom Fields) → WPGraphQL for structured content

**Authentication:** WordPress Application Passwords for API access. Never use admin credentials — create a dedicated API user with minimal permissions.

**Performance rules:**
- Always use `fields` in GraphQL queries (never `*`)
- Enable WPGraphQL Smart Cache for persistent query caching
- Images: use `next/image` with WordPress media URLs, set `remotePatterns` in `next.config.js`

---

## Execution Order

### Phase 0 — Foundation (Week 1)
> Design context infrastructure that everything else depends on

1. **B-1** Create `design/design-context-init` skill
2. **B-6** Create `design/design-iteration-protocol` skill
3. **A2-7** Create `system/adr` skill
4. **A2-8** Create `system/agents-md` skill

### Phase 1 — Design Skill Upgrades (Week 1–2)
> Improve existing design skills with superdesign methodology

5. **B-2** Upgrade `design/design-to-code-handoff`
6. **B-3** Upgrade `design/wireframe-pipeline`
7. **B-4** Upgrade `design/interaction-choreography`
8. **B-5** Upgrade `design/component-library-api`
9. **B-7** Upgrade `design/brand-visual-direction`

### Phase 2 — Backend Core Upgrades (Week 2)
> High-impact upgrades to frequently-used backend skills

10. **A1-1** Upgrade `backend/prisma-orm`
11. **A1-2** Upgrade `backend/resend-email`
12. **A1-3** Upgrade `backend/vercel-ai-sdk`
13. **A1-6** Upgrade `system/spec-writing`

### Phase 3 — Security & Ops Upgrades (Week 2–3)
> Strengthen the security and deployment posture

14. **A1-4** Upgrade `external/git-workflow`
15. **A1-5** Upgrade `quality/security-hardening`
16. **A1-7** Upgrade `external/deployment-checklist`

### Phase 4 — Net-New Infrastructure Skills (Week 3)
> Add missing infrastructure capabilities

17. **A2-1** Create `backend/firebase`
18. **A2-2** Create `backend/firebase-security-rules`
19. **A2-3** Create `infrastructure/firecrawl`
20. **A2-4** Create `infrastructure/browserbase`

### Phase 5 — Net-New Integration Skills (Week 3–4)
> Add AI and data pipeline capabilities

21. **A2-5** Create `backend/apify-scraper`
22. **A2-6** Create `backend/gemini-integration`
23. **A2-9** Create `frontend/shadcn-ui`
24. **A2-10** Create `frontend/wordpress`

---

## Dependency Map

```
design-context-init (B-1)
  ↓ required by
  design-to-code-handoff (B-2)
  wireframe-pipeline (B-3)
  interaction-choreography (B-4)
  component-library-api (B-5)
  design-iteration-protocol (B-6)
  brand-visual-direction (B-7)

system/adr (A2-7)
  ↓ referenced by
  system/spec-writing (A1-6)
  external/git-workflow (A1-4)

firebase (A2-1)
  ↓ prerequisite for
  firebase-security-rules (A2-2)
  deployment-checklist upgrade (A1-7)

browserbase (A2-4)
  ↓ upgrades
  quality/regression-detector (existing thin skill)

gemini-integration (A2-6)
  ↓ connects to
  backend/vercel-ai-sdk (A1-3) [as alternate provider]
```

---

## Quality Gates (Post-Execution)

After all 24 changes are made:

1. **Template compliance check:** Run `pnpm ai:check` — all upgraded/new skills must pass the canonical template validation (skill_id, version, tier, sdd_phase, rtl_aware, certified fields present).

2. **Sync check:** Run `pnpm ai:sync` — all skills must be mirrored to `.opencode/skills/` and `.claude/skills/`.

3. **Cross-reference check:** Every new skill must be registered in the relevant domain's skill index (e.g., `backend/` skills indexed in `docs/workspace/context/`).

4. **Gate compliance:** All skills touching design must pass the 5 design-dev gates in `.cursor/rules/design-dev-gates.mdc`.

---

## Notes

- **Superdesign CLI is NOT referenced** in any output skill. The methodology is extracted, the tool is not.
- **RF source files remain read-only** — they are reference material, not targets for editing.
- **All new skills use the NEZAM canonical template** from `.cursor/templates/skills/SKILL_NEZAM_CANONICAL.template.md`.
- **RTL-aware flag** must be set to `true` for all design skills (NEZAM serves MENA market).
- **WordPress skill is Tier 3** (optional/client-specific) — not activated by default in all projects.
