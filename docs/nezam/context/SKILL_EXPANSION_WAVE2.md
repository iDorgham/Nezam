# NEZAM Skill Expansion — Wave 2 Audit

> **Generated:** 2026-05-12  
> **Based on:** Full enumeration of `docs/nezam/RF/skills/` (793 directories)  
> **Excludes:** 24 items already in Wave 1 (`docs/workspace/context/ANTIGRAVITY_SKILL_IMPL.md`)  
> **Excludes:** Skills already covered by existing NEZAM library  

---

## What's Already in NEZAM (do not re-create)

| Domain | Existing skills |
|--------|----------------|
| `backend/` | api-contract, api-design, api-gateway, apify-scraper ✓W1, auth-workflows, background-jobs, cache-strategies, clerk-auth, cms-integration, container-orchestration, database-optimization, drizzle-orm, firebase ✓W1, firebase-security-rules ✓W1, gemini-integration ✓W1, mena-payment-routing, neon-postgres, openrouter, prisma-orm ✓W1, queue-architecture, realtime-streaming, resend-email ✓W1, supabase-architect, typesense-search, vector-search, vercel-ai-sdk ✓W1 |
| `frontend/` | component-testing, nextjs-patterns, performance-budget, react-architecture, rtl-layout, shadcn-ui ✓W1, state-management, wordpress ✓W1 |
| `infrastructure/` | aws-infra, browserbase ✓W1, cdn-optimization, cloudflare-edge, devops-pipeline, error-tracking, firecrawl ✓W1, llm-observability, monitoring-observability, product-analytics, secret-management, vercel-deploy |
| `design/` | 21 skills (all design work covered by Wave 1 upgrades) |
| `system/` | 28 skills (adr ✓W1, agents-md ✓W1, etc.) |
| `quality/` | a11y-automation, gh-security-compliance, github-actions-ci, performance-optimization, privacy-compliance, regression-detector, scan-fix-loop, security-hardening ✓W1, testing-automation, testing-strategy |
| `external/` | api-testing, deployment-checklist ✓W1, external-ai-report, git-workflow ✓W1, guide-instructor-domains, handoff-report, plan-full |
| `research/` | aeo-answer-engines, geo-optimization, ia-taxonomy, seo-ia-content, serp-feature-targeting, structured-data-schema, topical-authority |
| `content/` | arabic-content, arabic-typography, content-modeling, editorial-workflows, egyptian-arabic-content, moroccan-darija, register-detection |

---

## Wave 2 Priority Matrix

### Tier 1 — HIGH VALUE / NEZAM CORE GAPS (implement next)

These skills fill direct gaps in the NEZAM platform stack — billing, background jobs, real-time agents, security scanning, vector DB, i18n, and analytics.

| ID | Action | NEZAM Path | RF Source | Why |
|----|--------|-----------|-----------|-----|
| **C-1** | UPGRADE | `backend/supabase-architect` | `official_supabase_supabase` + `official_supabase_supabase_postgres_best_practices` | Existing skill is thin. RF covers RLS traps, JWT security, view bypass, service-role exposure, `security_invoker`, session invalidation edge cases — all critical for NEZAM multi-tenant SaaS |
| **C-2** | CREATE | `backend/stripe` | `official_stripe_stripe_best_practices` + `official_stripe_stripe_projects` | No Stripe skill exists. Billing platform agent references it but has no spec. RF covers Checkout Sessions vs PaymentIntents decision matrix, Connect Accounts v2, subscriptions, Treasury, webhook security, restricted keys. API version: 2026-03-25.dahlia |
| **C-3** | CREATE | `backend/trigger-dev` | `official_triggerdotdev_trigger_tasks` + `official_triggerdotdev_trigger_agents` + `official_triggerdotdev_trigger_config` + `official_triggerdotdev_trigger_realtime` | NEZAM has `background-jobs` (generic) but no Trigger.dev-specific skill. RF provides SDK patterns, AI agent integration, realtime streaming, cost-saving patterns, cron, concurrency control, `triggerAndWait()` safety rules |
| **C-4** | UPGRADE | `infrastructure/product-analytics` | `official_posthog_posthog` | Existing skill is generic. RF provides PostHog-specific SDK, feature flags, session recording, A/B testing, `person_profiles`, capture API |
| **C-5** | CREATE | `quality/sast-security` | `official_semgrep_code_security` + `official_semgrep_llm_security` + `official_semgrep_semgrep` | NEZAM has `security-hardening` (STRIDE/OWASP policy) but no SAST tooling skill. RF covers 28 rule categories, language-specific priority rules, LLM-specific security (prompt injection, output validation), proactive scanning workflow |
| **C-6** | CREATE | `backend/neon-advanced` | `official_neondatabase_neon_postgres` + `official_neondatabase_neon_postgres_egress_optimizer` | NEZAM has `neon-postgres` (basic). RF adds branching strategy, serverless connection pooling, egress cost optimization, claimable Postgres for ephemeral environments |
| **C-7** | CREATE | `system/tavily-research` | `official_tavily_ai_tavily_best_practices` + `official_tavily_ai_tavily_research` + `official_tavily_ai_tavily_dynamic_search` + `official_tavily_ai_tavily_extract` | No research/RAG search skill. RF covers agentic search patterns, async client, multi-query parallelization, extract vs search decision, context-window-aware truncation |
| **C-8** | UPGRADE | `quality/github-actions-ci` | `official_callstackincubator_github_actions` | Existing skill generic. RF covers React Native CI specifics, caching strategies, matrix builds — but primary value is the CI hardening patterns applicable to all NEZAM pipelines |
| **C-9** | CREATE | `frontend/gsap-animations` | `official_github_gsap_framer_scroll_animation` | NEZAM has motion/interaction skills but no GSAP/Framer Motion implementation skill. RF covers scroll-triggered animations, timeline composition, Framer Motion variants — feeds directly into `design/motion-3d` and `design/interaction-choreography` |
| **C-10** | UPGRADE | `quality/security-hardening` (addendum) | `official_semgrep_llm_security` | LLM-specific threat patterns (prompt injection, training data poisoning, insecure output handling) — extend existing security-hardening skill with LLM threat surface, not a separate skill |

---

### Tier 2 — MEDIUM VALUE / PLATFORM EXTENSIONS (implement after Tier 1)

These expand NEZAM into domains that are planned but not yet built — voice agents, observability, GraphQL federation, React Native, vector DB.

| ID | Action | NEZAM Path | RF Source | Why |
|----|--------|-----------|-----------|-----|
| **D-1** | CREATE | `backend/graphql-federation` | `official_apollographql_apollo_federation` + `official_apollographql_apollo_router` + `official_apollographql_graphql_schema` + `official_apollographql_apollo_server` | No GraphQL skill. RF covers schema-first design, Federation v2 subgraphs, Router plugins, rover CLI, connector patterns. Needed if NEZAM scales to microservices with unified graph |
| **D-2** | CREATE | `infrastructure/voice-agents` | `official_elevenlabs_text_to_speech` + `official_elevenlabs_agents` + `official_livekit_livekit_agents` | No voice/audio skill. RF covers ElevenLabs TTS/STT, voice agent setup, LiveKit real-time agents. NEZAM has `realtime-streaming` but no voice layer |
| **D-3** | CREATE | `infrastructure/llm-tracing` | `official_langfuse_langfuse` | NEZAM has `llm-observability` (generic). RF provides Langfuse-specific: traces, spans, scores, datasets, evals, prompt management, cost tracking. Critical for NEZAM's AI orchestration quality layer |
| **D-4** | CREATE | `backend/vector-db-qdrant` | `official_github_qdrant_clients_sdk` + `official_github_qdrant_performance_optimization` + `official_github_qdrant_search_quality` + `official_github_qdrant_scaling` + `official_github_qdrant_monitoring` | NEZAM has `vector-search` (generic). RF provides Qdrant-specific: collection design, HNSW tuning, payload filtering, batch upsert, scalar quantization, monitoring |
| **D-5** | CREATE | `frontend/react-native` | `official_callstackincubator_react_native_best_practices` + `official_callstackincubator_upgrading_react_native` | No React Native skill. NEZAM has Flutter and mobile agents but no RN. RF covers architecture patterns, upgrade paths, brownfield migration |
| **D-6** | UPGRADE | `infrastructure/cloudflare-edge` | `official_cloudflare_workers_best_practices` + `official_cloudflare_durable_objects` + `official_cloudflare_agents_sdk` + `official_cloudflare_wrangler` | Existing skill is deployment-focused. RF adds Workers best practices, Durable Objects for stateful edge, Cloudflare Agents SDK for AI at edge, Wrangler CLI workflow |
| **D-7** | CREATE | `backend/redis` | `official_redis_redis_development` | NEZAM has `cache-strategies` (generic). RF provides Redis-specific: data structures, pub/sub, streams, LRU eviction, connection pooling, Lua scripting |
| **D-8** | CREATE | `frontend/react18-patterns` | `official_github_react18_batching_patterns` + `official_github_react18_lifecycle_patterns` + `official_github_react19_concurrent_patterns` + `official_github_react19_test_patterns` | NEZAM has `react-architecture` but no version-specific upgrade guidance. RF covers concurrent features, automatic batching, `useTransition`, `useDeferredValue`, new test patterns |
| **D-9** | UPGRADE | `frontend/nextjs-patterns` | `official_vercel_labs_react_best_practices` + `official_vercel_labs_composition_patterns` + `official_vercel_labs_react_view_transitions` | Existing skill covers App Router basics. RF adds Vercel-specific React composition, View Transitions API, partial prerendering patterns |
| **D-10** | CREATE | `system/feature-flags` | `official_launchdarkly_onboarding` | No feature flags skill. RF covers LaunchDarkly SDK setup, targeting rules, gradual rollout, experimentation integration. Pairs with NEZAM's `system/phase-gating-roadmap` |

---

### Tier 3 — SPECIALIST / FUTURE PHASES (implement when domain is active)

| ID | Action | NEZAM Path | RF Source | Why |
|----|--------|-----------|-----------|-----|
| **E-1** | CREATE | `backend/headless-cms` | `official_sanity_io_sanity_best_practices` + `official_sanity_io_content_modeling_best_practices` + `official_sanity_io_portable_text_serialization` | NEZAM has `cms-integration` (generic). RF covers Sanity-specific: schema design, GROQ queries, Portable Text, ISR integration, SEO/AEO patterns |
| **E-2** | CREATE | `quality/playwright-testing` | `official_github_playwright_generate_test` + `official_github_playwright_automation_fill_in_form` + `official_github_playwright_explore_website` | NEZAM has `testing-automation` (generic). RF provides Playwright-specific: test generation, form automation, site exploration. Feeds `quality/testing-strategy` |
| **E-3** | CREATE | `infrastructure/observability-advanced` | `official_axiomhq_sre` + `official_axiomhq_building_dashboards` + `official_axiomhq_query_metrics` | NEZAM has `monitoring-observability`. RF adds Axiom-specific: SRE workflows, SPL→APL query translation, dashboard-as-code, cost control |
| **E-4** | CREATE | `infrastructure/background-jobs-advanced` | `official_triggerdotdev_trigger_cost_savings` + `official_triggerdotdev_trigger_setup` | Companion to C-3. Documents cost-saving patterns: run early exit, machine sizing, wait batching, cold-start avoidance |
| **E-5** | CREATE | `frontend/i18n-next-intl` | `official_github_next_intl_add_language` | NEZAM has i18n content skills but no framework-specific routing skill. RF covers next-intl: locale routing, `getTranslations`, middleware, RTL locale config |
| **E-6** | CREATE | `backend/mastra-agents` | `official_mastra_ai_mastra` | NEZAM uses custom multi-agent patterns. RF documents Mastra agent framework: workflow graphs, tool registration, memory management, LLM provider abstraction |
| **E-7** | CREATE | `infrastructure/video-generation` | `official_runwayml_rw_generate_video` + `official_runwayml_rw_generate_image` + `official_runwayml_rw_generate_audio` + `official_runwayml_rw_recipe_full_setup` | No media generation skill. RF covers Runway Gen-3 API, image/video/audio generation, character embedding, upload pipeline |
| **E-8** | UPGRADE | `quality/gh-security-compliance` | `official_github_agent_owasp_compliance` + `official_github_agent_supply_chain` + `official_github_mcp_security_audit` + `official_github_secret_scanning` | Existing skill is basic. RF adds: OWASP agent compliance checklist, supply chain security, MCP server security audit, secret scanning patterns |
| **E-9** | CREATE | `system/conventional-commits` | `official_github_conventional_commit` | No commit convention skill. RF covers Conventional Commits spec, scopes, breaking change notation, changelog generation, semantic versioning trigger |
| **E-10** | CREATE | `system/spec-from-codebase` | `official_github_acquire_codebase_knowledge` + `official_github_create_specification` + `official_github_generate_custom_instructions_from_codebase` | Extends existing `system/spec-writing`. RF covers reverse-engineering specs from existing codebases — useful for NEZAM client onboarding |

---

### Tier 4 — DOMAIN-SPECIFIC / LOW PRIORITY (park for now)

These are high-quality RF skills for domains NEZAM does not currently serve or has deprioritized.

| Category | RF Skills | Reason to defer |
|----------|-----------|----------------|
| **Azure/Microsoft stack** | `official_microsoft_azure_*` (15+ skills), `official_github_azure_*` | NEZAM stack is Vercel/Supabase/Cloudflare — not Azure |
| **Shopify** | `official_shopify_*` (18 skills) | E-commerce not in NEZAM roadmap |
| **Flutter advanced** | `official_flutter_flutter_*` (20 skills) | NEZAM has Flutter agent; skill library coverage adequate |
| **Astronomer/Airflow** | `official_astronomer_*` (18 skills) | Data pipeline orchestration — future ML infra phase only |
| **Blockchain/Base** | `official_base_*`, `official_coinbase_*` | Web3 not in NEZAM roadmap |
| **ClickHouse** | `official_clickhouse_*` (6 skills) | Analytics DB — only relevant if NEZAM builds data warehouse |
| **HuggingFace** | `official_huggingface_*` (10 skills) | Covered by `backend/gemini-integration` + `backend/openrouter` |
| **PlanetScale** | `official_planetscale_*` (4 skills) | NEZAM uses Supabase/Neon — MySQL/Vitess not in stack |
| **Mapbox** | `official_mapbox_*` (12 skills) | Location/mapping — not in NEZAM product scope |
| **Google GTM** | `official_github_gtm_*` (9 skills) | Go-to-market strategy content — not a code skill |
| **WordPress advanced** | `official_automattic_wp_*`, `official_wordpress_*` | Already covered by Wave 1 `frontend/wordpress` |
| **Deno** | `official_denoland_deno_*` (6 skills) | NEZAM is Node/Next.js stack |
| **Browser Use** | `official_browser_use_*` (4 skills) | Covered by `infrastructure/browserbase` |
| **ElevenLabs Music/SFX** | `official_elevenlabs_music`, `official_elevenlabs_sound_effects` | Keep voice agents (D-2) but defer media generation |
| **Streamlit** | `official_streamlit_*` | Python dashboards — not NEZAM's frontend stack |

---

### NEZAM-specific non-official RF skills (re-evaluate for internalization)

These are custom skills in the RF library with no official vendor origin — several are NEZAM-adjacent and worth absorbing.

| RF Skill | NEZAM Action | Notes |
|----------|-------------|-------|
| `uiux_token_mastery` | REVIEW → may merge into `design/design-token-architecture` | Deep token-to-code mapping discipline |
| `component_architecture_pro` | REVIEW → may merge into `design/component-library-api` | Component composition patterns with NEZAM vocabulary |
| `component_deduplication` | REVIEW → may add to `system/skill-composer` | Dedup logic for component library governance |
| `mena_payment_routing` | Already in `backend/mena-payment-routing` | Confirm parity |
| `bilingual_content` | Already partially in `content/` | Check if `content/arabic-content` covers bidirectional content flows |
| `omega_convergence` | Flag only — do not import | Appears to be a meta-system skill; evaluate risk of scope creep |
| `predictive_healing_pattern` | Flag only — do not import | Interesting for `system/reflection-loop-engine` but no immediate gap |
| `workspace_audit_orchestrator` | REVIEW → may inform `system/gate-orchestrator` | Cross-skill audit protocols |
| `sovereign_deploy_router` | Flag only — review against `external/deployment-checklist` | Multi-cloud deploy routing logic |
| `auto_chain_state_machine` | Flag only — review against `system/multi-agent-handoff` | State machine patterns for agent chains |
| `skill_integration_map` | Keep as reference | Documents RF→NEZAM skill mapping topology — useful for future audits |

---

## Recommended Wave 2 Execution Order

### Phase 1 — Billing + Jobs foundation (run immediately after Wave 1)
```
C-2  CREATE backend/stripe               ← billing platform has no spec
C-3  CREATE backend/trigger-dev          ← background-jobs is too generic
C-1  UPGRADE backend/supabase-architect  ← critical RLS/JWT security gaps
```

### Phase 2 — Observability + Security
```
C-5  CREATE quality/sast-security        ← SAST tooling gap (semgrep)
C-10 UPGRADE security-hardening (LLM)    ← LLM threat surface addendum
D-3  CREATE infrastructure/llm-tracing   ← Langfuse for AI quality layer
C-4  UPGRADE infrastructure/product-analytics  ← PostHog specifics
```

### Phase 3 — Search + Vector + Research
```
C-7  CREATE system/tavily-research       ← RAG/agentic search patterns
D-4  CREATE backend/vector-db-qdrant     ← Qdrant-specific (vector-search is generic)
C-6  CREATE backend/neon-advanced        ← branching + cost optimization
```

### Phase 4 — Frontend + Motion
```
C-9  CREATE frontend/gsap-animations     ← feeds motion/interaction-choreography
D-8  CREATE frontend/react18-patterns    ← concurrent mode patterns
D-9  UPGRADE frontend/nextjs-patterns    ← Vercel-specific composition
E-5  CREATE frontend/i18n-next-intl      ← locale routing for RTL/bilingual
```

### Phase 5 — Platform extensions
```
D-1  CREATE backend/graphql-federation   ← if microservices path chosen
D-2  CREATE infrastructure/voice-agents  ← ElevenLabs + LiveKit
D-6  UPGRADE infrastructure/cloudflare-edge  ← Durable Objects + Agents SDK
D-7  CREATE backend/redis                ← cache strategies needs Redis specifics
D-10 CREATE system/feature-flags         ← LaunchDarkly
```

### Phase 6 — Specialist / long-tail
```
E-1  CREATE backend/headless-cms         ← Sanity (if CMS client active)
E-2  CREATE quality/playwright-testing   ← E2E test skill
E-3  CREATE infrastructure/observability-advanced  ← Axiom SRE
E-6  CREATE backend/mastra-agents        ← if Mastra adopted
E-7  CREATE infrastructure/video-generation  ← Runway (if media feature active)
E-8  UPGRADE quality/gh-security-compliance  ← OWASP + supply chain
E-9  CREATE system/conventional-commits  ← commit standards
E-10 CREATE system/spec-from-codebase    ← client onboarding tool
```

---

## Summary Counts

| Tier | Count | Action |
|------|-------|--------|
| Tier 1 — HIGH (core gaps) | 10 | Implement in next Antigravity run |
| Tier 2 — MEDIUM (platform extensions) | 10 | Implement after Tier 1 |
| Tier 3 — SPECIALIST | 10 | Implement when domain is active |
| Tier 4 — DEFERRED | ~25 categories | Park until NEZAM enters those domains |
| NEZAM non-official review | 11 | Manual review before absorbing |
| **Wave 2 total** | **30 actionable** | Across 3 tiers |

---

## Implementation Notes

1. **Run `pnpm ai:sync` after each phase** — mirrors `.cursor/skills/` to `.opencode/skills/` and `.claude/skills/`
2. **Run `pnpm ai:check` before marking a phase complete** — validates NEZAM canonical template compliance
3. **All new skills require frontmatter** from `.cursor/templates/skills/SKILL_NEZAM_CANONICAL.template.md`: `skill_id`, `name`, `description`, `version`, `updated`, `changelog`, `owner`, `tier`, `sdd_phase`, `rtl_aware`, `certified`, `dependencies`
4. **RTL flag:** Any skill touching UI, content, or typography must set `rtl_aware: true`
5. **Tier 1 skills map to SDD phases:** Stripe → Release, Trigger.dev → Development, Supabase/Semgrep → Quality, Tavily → Planning/Research

---

*Next action: Pass this file to Antigravity with instruction to execute Phase 1 (C-1, C-2, C-3).*
