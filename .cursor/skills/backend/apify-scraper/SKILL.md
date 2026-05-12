---
skill_id: "backend/apify-scraper"
name: "apify-scraper"
description: "Managed scraping infrastructure via Apify Actors — 55+ pre-built scrapers for social media, maps, reviews, e-commerce. Used for competitive intelligence and data pipeline tasks."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "data-pipeline-manager"
tier: 3
sdd_phase: "Development"
rtl_aware: false
certified: false
dependencies: []
---

# Apify Scraper

## Purpose

Access managed scraping infrastructure via Apify's pre-built Actor library. No infrastructure management — pay per result. Primary use cases: competitive intelligence, social media monitoring, review aggregation, real estate data, and search result analysis.

## Trigger Conditions

- Competitive research requiring data from social media or review platforms.
- Content pipeline needing structured data from specific platforms.
- Any scraping task where a pre-built Apify Actor exists for the target platform.

## Prerequisites

- `APIFY_API_TOKEN` set in environment variables.
- `npm install apify-client` installed.
- Actor selection: check pricing (pay-per-result vs compute units) before selecting.

## Procedure

### Actor Selection Matrix (Priority Subset)

**Social Media:**
| Platform | Actor | Use Case |
|---|---|---|
| Instagram | `apify/instagram-profile-scraper` | Profile data, follower counts |
| Instagram | `apify/instagram-hashtag-scraper` | Posts by hashtag |
| Instagram | `apify/instagram-comment-scraper` | Comments on posts |
| TikTok | `clockworks/tiktok-scraper` | Videos, profiles, hashtags |
| Facebook | `apify/facebook-pages-scraper` | Page data and posts |
| YouTube | `streamers/youtube-scraper` | Channel data, video metadata |

**Reviews & Local:**
| Platform | Actor | Use Case |
|---|---|---|
| Google Maps | `compass/crawler-google-places` | Business data, reviews |
| TripAdvisor | `maxcopell/tripadvisor` | Hotel/restaurant reviews |
| Trustpilot | `misceres/trustpilot-scraper` | Company reviews |
| Google Reviews | Included in Google Maps actor | Same actor |

**E-commerce & Real Estate:**
| Platform | Actor | Use Case |
|---|---|---|
| Amazon | `junglee/amazon-product-scraper` | Product data, pricing, reviews |
| Booking.com | `dtrungtin/booking-scraper` | Hotel listings, pricing |
| Zillow | `maxcopell/zillow-scraper` | Property listings |

**Search:**
| Platform | Actor | Use Case |
|---|---|---|
| Google Search | `apify/google-search-scraper` | SERP results |
| Google Shopping | `apify/google-shopping-scraper` | Product results |

### Running an Actor

```ts
import { ApifyClient } from 'apify-client'
const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN })

// Run an Actor and wait for results
const run = await client.actor('apify/instagram-profile-scraper').call({
  usernames: ['username1', 'username2'],
  resultsLimit: 10,
})

// Fetch results from the dataset
const { items } = await client.dataset(run.defaultDatasetId).listItems()
console.log(items)
```

### Pricing Check Rule

Before selecting an Actor, always check its pricing model:
- **Pay-per-result:** Best for small, predictable jobs. Check cost-per-item.
- **Compute units:** Best for large crawls. Check average CU/run.

Always set a `maxItems` or `resultsLimit` parameter to cap costs on first runs.

### Credential Storage Rule

Store all scraping credentials (session cookies, login tokens) in Apify Key-Value Store — not in environment variables or code:

```ts
const store = await client.keyValueStore('my-sessions').getOrCreate()
await store.setRecord({ key: 'instagram-session', value: { cookie: '...' } })
```

## Output Artifacts

- Scraped data in Apify Dataset (accessible via `defaultDatasetId`)
- Exported as JSON or CSV for downstream processing

## Validation Checklist

- [ ] Actor selected from the matrix above or verified to exist on Apify console
- [ ] Pricing model reviewed before running (estimate cost before production use)
- [ ] `maxItems` or `resultsLimit` set on all production runs
- [ ] API token in environment variable, never hardcoded
- [ ] Session credentials stored in Apify Key-Value Store, not env vars
- [ ] Results validated (check for empty datasets — Actor may have been blocked)

## Handoff Target

Scraped data feeds `backend/gemini-integration` (for AI analysis) or `infrastructure/vector-search` (for RAG indexing).
