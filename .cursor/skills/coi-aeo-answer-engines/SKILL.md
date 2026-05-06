---
name: coi-aeo-answer-engines
description: Answer Engine Optimization — concise Q&A structures and voice/assistant-ready formatting for direct answers.
---

# Purpose

Format content so answer engines (Google PAA, voice assistants, chat search) can extract concise, accurate, attributable answers. Single-responsibility: question→short-answer pairing.

# Inputs

- Keyword clusters and intent tags from `docs/specs/sdd/SEO_RESEARCH.md`.
- "People Also Ask" / Reddit / community FAQ harvest.
- Page-level outlines in `docs/specs/sdd/IA_CONTENT.md`.
- Voice/chat persona guidance from `docs/prompts/PROJECT_PROMPT.md`.

# Step-by-Step Workflow

1. Mine question variants per cluster (PAA, AlsoAsked, forums, support tickets); group by intent (definition, how-to, comparison, troubleshoot).
2. Author canonical answer per question: 40–60 word direct answer, then expansion paragraphs.
3. Use a `Q:` / `A:` or H2-question / paragraph-answer pattern that aligns with FAQ schema.
4. Front-load the answer (first sentence answers the question) for snippet eligibility.
5. Add structured data: `FAQPage`, `QAPage`, or `HowTo` per page type.
6. Maintain TTS-friendly phrasing: short sentences, avoided abbreviations, normalized numbers.
7. Validate snippet eligibility via Search Console queries and assistant test reads.

# Validation & Metrics

- Every priority page has ≥ 3 question/answer pairs aligned to its intent.
- Direct answers are 40–60 words and contain the question's core entity.
- Pages render valid `FAQPage` / `QAPage` JSON-LD (no schema warnings).
- Assistant test reads complete the answer in ≤ 12 seconds.

# Output Format

- `docs/specs/sdd/AEO_QA_MAP.md` (question, answer, intent, page slug, schema type).
- FAQ JSON-LD stubs per page.
- Voice readability checklist.
- Snippet appearance log.

# Integration Hooks

- `/PLAN seo` and `/PLAN content` populate Q&A map.
- `/SCAN seo` validates schema and answer length.
- Pairs with `@.cursor/skills/coi-geo-optimization/SKILL.md`, `@.cursor/skills/coi-structured-data-schema/SKILL.md`, `@.cursor/skills/coi-serp-feature-targeting/SKILL.md`.
- Honors `[.cursor/rules/sdd-design.mdc](.cursor/rules/sdd-design.mdc)`.

# Anti-Patterns

- Burying the answer below intro fluff (snippet algorithms penalize this).
- Using abbreviations that TTS mispronounces.
- One generic FAQ block reused across unrelated pages.
- FAQ schema that does not match visible content (Google may demote).
- Answers that depend on visual context the engine cannot see.

# External Reference

- Google Search Central: `FAQPage` & `QAPage` structured data guidelines (current).
- Schema.org `FAQPage`, `QAPage`, `HowTo` (https://schema.org/).
- Bing voice search guidelines (current).
- Closest skills.sh/official analog: answer-engine-optimization.
