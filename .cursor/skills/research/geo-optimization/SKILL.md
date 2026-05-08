---
name: coi-geo-optimization
description: Generative Engine Optimization — entity mapping, topical depth, and AI-citation readiness for LLM-powered search.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose

Make content reliably discoverable, cite-worthy, and faithfully reproducible by generative engines (ChatGPT, Perplexity, Google AI Overviews, Gemini). Single-responsibility: entity-grade content structure for LLM citation.

# Inputs

- `docs/core/required/sdd/SEO_RESEARCH.md` keyword and entity tables.
- `docs/core/required/sdd/IA_CONTENT.md` page-level outlines.
- Brand glossary, canonical entity list (people, products, places, concepts).
- Existing structured data drafts and `@.cursor/skills/coi-structured-data-schema/SKILL.md` outputs.

# Step-by-Step Workflow

1. Build entity inventory: subject, type, canonical URL, authoritative external links (Wikipedia, Wikidata, OSM, official sites).
2. For each priority page, enumerate primary entity + supporting entities; map each to a paragraph or section.
3. Add disambiguation cues (full name on first mention, role, time-bound facts) so LLMs can resolve identity without context drift.
4. Increase topical depth: cover sub-questions LLMs are likely to retrieve (definitions, comparisons, criteria, exceptions, FAQs).
5. Reinforce factual claims with on-page citations and `<cite>` or footnote-style references LLMs can extract.
6. Emit JSON-LD `@id` URIs that match canonical URLs; align with `coi-structured-data-schema`.
7. Validate against AI overviews tooling and capture appearance evidence in `docs/workspace/context/`.

# Validation & Metrics

- Every priority page covers ≥ 1 primary entity and ≥ 3 supporting entities with disambiguation.
- Factual claims have on-page citations or schema evidence.
- JSON-LD `@id` resolves to a stable canonical URL.
- Spot-check via at least 2 AI engines: content surfaces accurately when prompted with the page topic.

# Output Format

- `docs/core/required/sdd/ENTITY_INVENTORY.md` (entity → URL → external authority).
- Per-page entity mapping table.
- Citation/footnote scaffolding rules.
- AI-overview appearance log (queries tested, engines, citation outcome).

# Integration Hooks

- `/PLAN seo` and `/PLAN content` consume entity inventory.
- `/SCAN seo` validates entity coverage and citation density.
- Pairs with `@.cursor/skills/coi-aeo-answer-engines/SKILL.md`, `@.cursor/skills/coi-structured-data-schema/SKILL.md`, `@.cursor/skills/coi-topical-authority/SKILL.md`.
- Honors `[.cursor/rules/sdd-design.mdc](.cursor/rules/sdd-design.mdc)` SEO/AEO/GEO sequencing.

# Anti-Patterns

- Vague pronouns and missing first-mention full names that confuse entity resolution.
- Stuffing entities for SEO without semantic relationships.
- Dynamic content rendered only client-side (LLMs may miss it).
- JSON-LD `@id` values that change across deploys.
- Treating GEO as a duplicate of SEO instead of a distinct LLM-citation discipline.

# External Reference

- Schema.org current vocabulary (https://schema.org/) — current.
- Google "AI Overviews" guidance and `Quality Rater Guidelines` (current).
- Wikidata as canonical entity reference (https://www.wikidata.org/).
- Bing/Perplexity attribution & citation conventions (current docs).
- Closest skills.sh/official analog: generative-engine-optimization.
