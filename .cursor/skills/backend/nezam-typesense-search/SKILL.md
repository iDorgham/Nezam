---
name: "nezam-typesense-search"
description: Typo-tolerant and vector-aware search implementation using Typesense.
version: 1.0.0
updated: 2026-05-10
changelog: []
---
# Typesense Search
## Purpose
Implement performant user-facing search with Typesense, including schema design, indexing, and relevance tuning.

## Inputs Required
- Search use cases and ranking expectations.
- Data sources for indexing and update cadence.
- Relevance rules (typo tolerance, filters, faceting, vector needs).
- Latency and scaling targets.

## Step-by-Step Workflow
1. Define search schema and searchable fields.
2. Design indexing pipeline and update triggers.
3. Configure ranking, filters, and typo-tolerance behavior.
4. Integrate query APIs with pagination and faceting.
5. Validate relevance using representative user queries.
6. Add monitoring for index freshness and query latency.

## Validation Checks
- Search schema covers required fields and filters.
- Index updates are timely and observable.
- Relevance quality meets agreed acceptance examples.
- Query latency is within target under expected load.

## Output Format
- Search schema and ranking policy summary.
- Indexing workflow definition.
- Relevance and performance validation report.

## Integration Hooks (which agents use this)
- `search-cache-manager`
- `backend-lead`

## Anti-Patterns
- Indexing without ownership for freshness and backfills.
- Overly broad searchable fields that hurt relevance.
- Shipping search without test queries and quality baselines.

## External References (official docs URL from tech stack)
- https://typesense.org/docs/
