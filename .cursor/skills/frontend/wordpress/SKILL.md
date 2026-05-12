---
skill_id: "frontend/wordpress"
name: "nezam-wordpress"
description: "Headless WordPress integration — WordPress as CMS, Next.js as frontend. WPGraphQL for content, ISR for performance, preview mode for drafts."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "frontend-lead"
tier: 3
sdd_phase: "Development"
rtl_aware: true
certified: false
dependencies:
  - "backend/cms-integration"
---

# Headless WordPress Integration

## Purpose

Connect WordPress as a content management system to a Next.js frontend using the headless architecture: WordPress manages content, Next.js handles rendering. Uses WPGraphQL for content fetching (not REST API) and ISR for performance.

## Trigger Conditions

- A client project requires WordPress content management.
- Migrating a WordPress site to a modern Next.js frontend.
- Content team requires WordPress editorial workflow with a custom frontend.

## Prerequisites

- WordPress instance running (self-hosted or WordPress.com with Business plan).
- WPGraphQL plugin installed and activated on WordPress.
- WPGraphQL for Advanced Custom Fields (if using ACF) installed.
- API user created in WordPress with minimal permissions (Editor role, no admin).

## Procedure

### 1. WordPress Setup

Required plugins:
```
WPGraphQL — https://wordpress.org/plugins/wp-graphql/
WPGraphQL for ACF — if using Advanced Custom Fields
WPGraphQL Smart Cache — for persistent query caching (performance)
Custom Post Type UI — if custom post types are needed
```

**Authentication:** Create a dedicated API user (Editor role — not admin) and generate an Application Password in WordPress:
`User Profile → Application Passwords → Add New Application Password`

Store the Application Password in environment variables — never commit.

### 2. Content Fetching via WPGraphQL

**Always use WPGraphQL over REST API.** WPGraphQL: typed, efficient, single request for related data.

```ts
// lib/wordpress.ts
const WP_API_URL = process.env.WP_GRAPHQL_URL  // e.g., https://cms.yourdomain.com/graphql

async function fetchGraphQL(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(WP_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Include auth for preview/draft content only
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },  // ISR: revalidate every 60 seconds
  })
  return res.json()
}

// Fetch published posts
export async function getPosts() {
  const data = await fetchGraphQL(`
    query GetPosts {
      posts(first: 10, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          excerpt
          featuredImage { node { sourceUrl altText } }
          date
        }
      }
    }
  `)
  return data.data.posts.nodes
}
```

**Field selection rule:** Always specify fields in GraphQL queries. Never use `*` or over-fetch.

### 3. ISR Configuration

```ts
// app/blog/[slug]/page.tsx
export const revalidate = 60  // ISR: revalidate page every 60 seconds

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

### 4. Preview Mode (Draft Content)

```ts
// app/api/preview/route.ts
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.WP_PREVIEW_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  draftMode().enable()
  return Response.redirect(new URL(`/blog/${slug}`, request.url))
}
```

When in draft mode, fetch content with authentication header to access unpublished drafts.

### 5. Custom Post Types

Register in WordPress via Custom Post Type UI plugin, then expose via WPGraphQL:
- In WPGraphQL settings, enable the custom post type
- In CPT UI, check "Show in GraphQL" when creating the post type
- Access via GraphQL: query name is the `graphqlSingleName` or `graphqlPluralName` set in CPT UI

### 6. Image Handling

```ts
// next.config.js — allow WordPress image domain
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.yourdomain.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}
```

Use `next/image` for all WordPress media — never `<img>` tags.

### 7. RTL Content

WordPress supports RTL natively via `dir` attribute. When rendering WordPress content:
- Check post language/locale from WPGraphQL
- Set `dir="rtl"` on the content container for Arabic/Hebrew content
- Ensure the font stack in `DESIGN.md` includes Arabic-compatible fonts

## Output Artifacts

- `lib/wordpress.ts` — GraphQL fetch utilities
- `app/blog/` — blog/content route handlers
- `next.config.js` — image domain allowlist
- Environment variables: `WP_GRAPHQL_URL`, `WP_APPLICATION_PASSWORD`, `WP_PREVIEW_SECRET`

## Validation Checklist

- [ ] WPGraphQL plugin installed and GraphQL endpoint accessible
- [ ] API user is Editor role (not admin), using Application Password
- [ ] Application Password stored in env var, never committed
- [ ] All GraphQL queries specify explicit fields (no over-fetching)
- [ ] ISR configured (`revalidate: 60` or appropriate interval)
- [ ] Preview mode implemented and secret stored in env var
- [ ] All WordPress images use `next/image` with `remotePatterns` configured
- [ ] `remotePatterns` uses specific hostname, not wildcard (`**`)
- [ ] RTL content tested with Arabic/Hebrew posts

## Handoff Target

Content data feeds the frontend rendering layer. Images feed `frontend/frontend-performance-manager` for optimization review.
