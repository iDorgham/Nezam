# SEO Research — Nezam Design Server · Ultimate UI Suite

> **Phase:** 01-Research | **Source:** PRD v2.0.0
> This is a developer tool running locally — SEO targets documentation discovery,
> GitHub repository visibility, and any future landing page or docs site.

---

## 1. Product Context for SEO

| Dimension | Value |
|---|---|
| Product type | Local developer tool (not a SaaS or website) |
| Primary discovery channel | GitHub, npm registry, developer blogs, Twitter/X |
| Secondary channel | Documentation site (if published) |
| Target audience | Frontend engineers, design system maintainers, creative directors |
| Primary market | Egypt, MENA, global English-speaking developers |

---

## 2. Keyword Research

### 2.1 Primary Keywords (High Intent)

| Keyword | Search Intent | Competition | Priority |
|---|---|---|---|
| design token editor | Tool discovery | Medium | P0 |
| tailwind design system studio | Tool discovery | Low | P0 |
| visual design token editor nextjs | Tool discovery | Very Low | P0 |
| css token live preview | Informational/Tool | Low | P0 |
| design system token management | Tool discovery | Medium | P0 |
| nezam design server | Brand | Very Low | P0 |

### 2.2 Secondary Keywords (Supporting)

| Keyword | Search Intent | Priority |
|---|---|---|
| figma alternative design tokens | Comparative | P1 |
| design token css variables generator | Tool discovery | P1 |
| tailwind token studio | Tool discovery | P1 |
| arabic rtl design system tool | MENA-specific | P1 |
| design spec to css compiler | Informational | P1 |
| local design server nextjs | Technical | P1 |

### 2.3 Long-Tail Keywords

| Keyword | Rationale |
|---|---|
| "how to edit tailwind tokens visually" | Tutorial content hook |
| "design token sync DESIGN.md" | Nezam-specific workflow term |
| "css border radius slider component" | Feature-specific discovery |
| "clamp typography scale preview" | Feature-specific discovery |
| "infinity canvas sitemap tool" | Feature-specific: F-005 |
| "rtl arabic design token tool" | MENA niche |

---

## 3. Search Intent Mapping

| Intent type | Query examples | Target content |
|---|---|---|
| **Navigational** | "nezam design server", "nezam token studio" | README, repo root, docs landing |
| **Informational** | "what is a design token editor", "how design tokens work" | Docs introduction section |
| **Commercial** | "design token tool open source", "figma token studio alternative" | README features section, comparison table |
| **Transactional** | "install design token editor", "nezam design server setup" | README installation guide |

---

## 4. URL / Slug Rules

If a documentation site or landing page is published:

| Page | Slug | Rule |
|---|---|---|
| Home | `/` | — |
| Installation | `/docs/install` | Lowercase, hyphen-separated |
| Token editor guide | `/docs/tokens` | Singular topic, no underscores |
| Canvas guide | `/docs/canvas` | — |
| Motion studio guide | `/docs/motion` | — |
| Property inspector | `/docs/inspector` | — |
| RTL guide | `/docs/rtl` | — |
| Arabic typography | `/docs/arabic-typography` | Language keyword in slug |
| Changelog | `/changelog` | Standard slug |

**Rules:**
- All slugs: lowercase + hyphens (no underscores, no camelCase)
- No dates in slugs (content rots)
- Feature pages include the primary keyword: `/docs/design-tokens` not `/docs/dt`
- Arabic docs mirror: `/ar/docs/tokens` — same slug, `lang="ar"` prefix

---

## 5. GitHub Repository SEO

| Field | Recommended value |
|---|---|
| Description | "Real-time design token editor with infinity canvas, motion studio, and CSS sync — for Next.js & Tailwind projects" |
| Topics | `design-tokens`, `tailwind`, `nextjs`, `design-system`, `rtl`, `arabic`, `token-studio`, `canvas`, `css-variables` |
| README H1 | "Nezam Design Server — Visual Design Token Studio" |
| README lead | 2-sentence elevator pitch with primary keywords |

---

## 6. Content Plan (Developer SEO)

| Content piece | Type | Keywords targeted | Priority |
|---|---|---|---|
| README.md | Repository | All primary | P0 |
| Installation guide | Docs | "install", "setup", "get started" | P0 |
| "5 reasons to use Nezam over Figma tokens" | Blog | Comparative | P1 |
| RTL/Arabic design system guide | Docs | MENA-specific | P1 |
| Video demo: token sync in 60s | YouTube/X | Visual — high share potential | P1 |
| clamp() typography deep dive | Blog | Typography scale keywords | P2 |

---

*Generated: 2026-05-18 | Next review: prior to any public documentation launch*
