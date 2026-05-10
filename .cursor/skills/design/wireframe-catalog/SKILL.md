---
name: wireframe-catalog
description: Present ASCII wireframe options per UI element type and let the user choose their preferred style. Used during /PLAN design to give the user full visual control before any code is written.
version: 1.0.0
updated: 2026-05-10
---

# Wireframe Catalog Skill

## Purpose

Present multiple layout options for each major UI element as ASCII wireframes.
The user picks one per element. Their choices are saved to `docs/workspace/plans/04-design/DESIGN_CHOICES.md`.
The final DESIGN.md is generated FROM their confirmed choices — not the other way around.

## Trigger

Runs automatically during `/PLAN design` after brand direction is confirmed.
Can also be triggered standalone: `/PLAN design wireframes`

## Output

- Wireframe options rendered in chat (ASCII art, clearly labeled)
- User picks one option per element
- `DESIGN_CHOICES.md` written with all confirmed choices
- DESIGN.md updated to reflect choices

---

## ═══════════════════════════════════════
## WEBSITE ELEMENT CATALOG
## ═══════════════════════════════════════

### ELEMENT 1: HEADER / MAIN NAVIGATION

Present all 5 options. Ask: "Which header style fits your project? (1–5)"

---

**Option 1 — Centered Logo, Horizontal Nav**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ◆ BRAND NAME                                 │
│         Home    About    Work    Services    Contact            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
Best for: portfolios, agencies, creative studios
Tone: elegant, symmetrical, editorial

---

**Option 2 — Left Logo, Right Nav + CTA**
```
┌─────────────────────────────────────────────────────────────────┐
│  ◆ Brand       Home   About   Work   Pricing        [Get Started]│
└─────────────────────────────────────────────────────────────────┘
```
Best for: SaaS marketing sites, product landing pages, startups
Tone: clean, conversion-focused, modern

---

**Option 3 — Full-Width Transparent Overlay (Hero integrated)**
```
┌─────────────────────────────────────────────────────────────────┐
│  ◆ Brand       Home   About   Work   Blog              [Contact]│
│─────────────────────────────────────────────────────────────────│
│                                                                 │
│              ░░░░ HERO IMAGE / VIDEO BEHIND ░░░░                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
Best for: photography, film, luxury brands, immersive experiences
Tone: bold, visual-first, cinematic

---

**Option 4 — Sticky Minimal Bar (collapses on scroll)**
```
┌─────────────────────────────────────────────────────────────────┐
│  ◆                                              ≡ Menu          │
└─────────────────────────────────────────────────────────────────┘
  [expands to full nav on click]
```
Best for: content-heavy sites, blogs, editorial, minimal portfolios
Tone: minimal, focused, typography-driven

---

**Option 5 — Split Layout (logo center, nav split left/right)**
```
┌─────────────────────────────────────────────────────────────────┐
│   Work    About    ◆ BRAND    Services    Contact               │
└─────────────────────────────────────────────────────────────────┘
```
Best for: fashion, luxury, art direction, high-end agencies
Tone: premium, fashion-forward, dramatic

---

### ELEMENT 2: PORTFOLIO / PROJECTS GRID

Present all 5 options. Ask: "Which grid style fits your projects? (1–5)"

---

**Option 1 — Equal 3-Column Grid**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │          │  │          │  │          │                   │
│  │  Image   │  │  Image   │  │  Image   │                   │
│  │          │  │          │  │          │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│  Project Name  Project Name  Project Name                    │
│  Category      Category      Category                        │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  Image   │  │  Image   │  │  Image   │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└──────────────────────────────────────────────────────────────┘
```
Best for: uniform media (all photos, all videos), order-focused portfolios
Tone: structured, professional, gallery-like

---

**Option 2 — Masonry / Staggered Heights**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │          │  │          │  │  Image   │                   │
│  │  Tall    │  │  Image   │  │          │                   │
│  │  Image   │  │          │  └──────────┘                   │
│  │          │  └──────────┘  ┌──────────┐                   │
│  │          │  ┌──────────┐  │  Image   │                   │
│  └──────────┘  │  Image   │  │  tall    │                   │
│                └──────────┘  └──────────┘                   │
└──────────────────────────────────────────────────────────────┘
```
Best for: mixed media (photos, videos, case studies of varying depth)
Tone: dynamic, editorial, Pinterest-style, creative

---

**Option 3 — Featured + Grid (hero project + supporting)**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────┐  ┌──────────┐  ┌──────────┐   │
│  │                          │  │          │  │          │   │
│  │   FEATURED PROJECT       │  │  Image   │  │  Image   │   │
│  │   Large Image            │  │          │  │          │   │
│  │                          │  └──────────┘  └──────────┘   │
│  │   Title  /  Category     │  ┌──────────┐  ┌──────────┐   │
│  └──────────────────────────┘  │  Image   │  │  Image   │   │
│                                └──────────┘  └──────────┘   │
└──────────────────────────────────────────────────────────────┘
```
Best for: highlighting signature work, case study portfolios
Tone: confident, curated, hierarchy-driven

---

**Option 4 — Full-Width Scroll List (one project per row)**
```
┌──────────────────────────────────────────────────────────────┐
│  01  ──────────────────  Project Name A  ──  Category  →     │
│  ──────────────────────────────────────────────────────      │
│  02  ──────────────────  Project Name B  ──  Category  →     │
│  ──────────────────────────────────────────────────────      │
│  03  ──────────────────  Project Name C  ──  Category  →     │
└──────────────────────────────────────────────────────────────┘
  [hover reveals thumbnail]
```
Best for: large project volumes, agencies, text-first portfolios
Tone: editorial, minimal, type-driven, Awwwards-style

---

**Option 5 — Bento Box (asymmetric blocks, varying sizes)**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────┐  ┌──────────┐                        │
│  │                    │  │          │                        │
│  │   Large Block      │  │  Small   │                        │
│  │   2×2              │  │  1×1     │                        │
│  │                    │  └──────────┘                        │
│  │                    │  ┌──────────┐  ┌──────────┐          │
│  └────────────────────┘  │  1×1     │  │  1×1     │          │
│  ┌──────────┐ ┌─────────────────────┘  └──────────┘          │
│  │  1×1     │ │    Wide Block  2×1                │          │
│  └──────────┘ └───────────────────────────────────┘          │
└──────────────────────────────────────────────────────────────┘
```
Best for: SaaS dashboards, product portfolios, feature showcases
Tone: modern, grid-playful, tech-forward

---

### ELEMENT 3: PROJECT / CASE STUDY PAGE

Present all 4 options. Ask: "Which project page layout fits your work? (1–4)"

---

**Option 1 — Full-Width Scroll (immersive narrative)**
```
┌──────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░  FULL-WIDTH HERO IMAGE  ░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                              │
│         Project Title                                        │
│         Client · Year · Category                             │
│                                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                              │
│         The Challenge                                        │
│         ─────────────────────────────────                    │
│         [body copy]                                          │
│                                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                              │
│         [ ← Previous ]              [ Next Project → ]      │
└──────────────────────────────────────────────────────────────┘
```
Best for: creative agencies, UX case studies, brand work
Tone: immersive, cinematic, narrative-driven

---

**Option 2 — Split Layout (image left, content right, sticky)**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌─────────────────────┐  │  Project Title                   │
│  │                     │  │  ────────────────────────        │
│  │   Scrolling         │  │  Client · Year                   │
│  │   Media Gallery     │  │                                  │
│  │                     │  │  Brief                           │
│  │   (images change    │  │  [copy]                          │
│  │    as user scrolls) │  │                                  │
│  │                     │  │  Deliverables                    │
│  │                     │  │  [copy]                          │
│  └─────────────────────┘  │                                  │
│                            │  [View Live →]                  │
└──────────────────────────────────────────────────────────────┘
```
Best for: design portfolios, product design, UX work
Tone: structured, detailed, professional

---

**Option 3 — Minimal Text + Full-Bleed Images**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Project Title                           Year · Category   │
│   ─────────────────────────────────────────────────────      │
│                                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░  FULL BLEED IMAGE  ░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                              │
│   [one paragraph of copy]                                   │
│                                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────────────────────────────────────────┘
```
Best for: photography portfolios, visual-first work, art direction
Tone: minimal, images-speak, editorial silence

---

**Option 4 — Card-Based Case Study (structured sections)**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐    │
│  │  ░░░░░░░░░░░░░░  HERO IMAGE  ░░░░░░░░░░░░░░░░░░░░░░ │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ The Brief│  │ Process  │  │ Solution │  │  Result  │    │
│  │  [copy]  │  │  [copy]  │  │  [copy]  │  │  [copy]  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  ░░░░░░░░░░░░░░░  GALLERY  ░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```
Best for: structured case studies, UX/product design, consulting
Tone: methodical, detail-rich, trust-building

---

### ELEMENT 4: FOOTER

Present all 4 options. Ask: "Which footer style? (1–4)"

---

**Option 1 — Minimal Single Line**
```
┌──────────────────────────────────────────────────────────────┐
│  ◆ Brand Name        Work · About · Contact        © 2025   │
└──────────────────────────────────────────────────────────────┘
```
Best for: portfolios, minimal sites, creative studios

---

**Option 2 — Multi-Column (links + contact + social)**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ◆ Brand Name        Pages          Contact                  │
│  Tagline             Home           hello@brand.com          │
│                      About          +1 555 000 0000          │
│                      Work                                    │
│                      Blog           ⬡ ⬡ ⬡                   │
│                      Contact        Social links             │
│                                                              │
│  ─────────────────────────────────────────────               │
│  © 2025 Brand Name · Privacy · Terms                         │
└──────────────────────────────────────────────────────────────┘
```
Best for: content-rich sites, SaaS marketing pages, agencies

---

**Option 3 — Large CTA Footer (statement + contact)**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                  Let's Work Together                         │
│                                                              │
│                   [Get In Touch →]                           │
│                                                              │
│  ─────────────────────────────────────────────               │
│  ◆ Brand     Work · About · Contact        © 2025            │
└──────────────────────────────────────────────────────────────┘
```
Best for: portfolios, freelancers, agencies, conversion-driven sites

---

**Option 4 — Editorial Full-Width (large type statement)**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░  LARGE DISPLAY TYPE — BRAND STATEMENT  ░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                              │
│  Work  About  Contact  Blog                     © 2025      │
└──────────────────────────────────────────────────────────────┘
```
Best for: bold brand identity, fashion, luxury, creative impact

---

### ELEMENT 5: CONTACT PAGE

Present all 4 options. Ask: "Which contact page layout? (1–4)"

---

**Option 1 — Split: Form Left, Info Right**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────────┐  ┌────────────────────────┐      │
│  │  Name  _______________  │  │  Let's Talk            │      │
│  │  Email _______________  │  │                        │      │
│  │  Subject _____________  │  │  hello@brand.com       │      │
│  │                         │  │  +1 555 000 0000       │      │
│  │  Message                │  │                        │      │
│  │  ┌─────────────────┐    │  │  Based in Cairo 🌍     │      │
│  │  │                 │    │  │                        │      │
│  │  └─────────────────┘    │  │  ⬡ LinkedIn            │      │
│  │  [Send Message →]       │  │  ⬡ Instagram           │      │
│  └─────────────────────────┘  └────────────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

---

**Option 2 — Full-Width Minimal Form**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              Get In Touch                                    │
│              ─────────────────────────────────               │
│                                                              │
│   Name  ________________________________________________     │
│   Email ________________________________________________     │
│   Message _______________________________________________     │
│            _______________________________________________     │
│            _______________________________________________     │
│                                                              │
│                      [Send →]                                │
└──────────────────────────────────────────────────────────────┘
```

---

**Option 3 — Conversational / Chatbot Style**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Hi! What's your name?                                      │
│   ┌────────────────────────┐                                 │
│   │ Type here...           │  [→]                           │
│   └────────────────────────┘                                 │
│                                                              │
│   [after name entered]                                       │
│   Nice to meet you, Ahmed! What's your email?               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
Best for: personality-driven brands, creative studios, memorable UX

---

**Option 4 — No Form — Direct Channels**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              Want to work together?                          │
│                                                              │
│   ┌──────────────────┐   ┌──────────────────┐               │
│   │  📧  Email Me    │   │  💼  LinkedIn    │               │
│   └──────────────────┘   └──────────────────┘               │
│   ┌──────────────────┐   ┌──────────────────┐               │
│   │  📅  Book a Call │   │  📱  WhatsApp    │               │
│   └──────────────────┘   └──────────────────┘               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
Best for: high-demand professionals, consultants, speakers

---

## ═══════════════════════════════════════
## APP / DASHBOARD ELEMENT CATALOG
## ═══════════════════════════════════════

### ELEMENT 6: APP NAVIGATION / SIDEBAR

Present all 4 options. Ask: "Which app navigation pattern? (1–4)"

---

**Option 1 — Left Sidebar (icon + label, collapsible)**
```
┌────────────┬──────────────────────────────────────────────┐
│ ◆ Brand    │                                              │
│ ────────── │   Page Title                                 │
│ 🏠 Home   │   ─────────────────────────────────          │
│ 📊 Dash   │                                              │
│ 👤 Users  │   [Content area]                             │
│ ⚙️ Settings│                                              │
│            │                                              │
│            │                                              │
│ ────────── │                                              │
│ 👤 Account │                                              │
└────────────┴──────────────────────────────────────────────┘
```
Best for: SaaS apps, admin panels, feature-rich dashboards
Tone: professional, dense-feature, efficient

---

**Option 2 — Top Navigation Bar (horizontal)**
```
┌──────────────────────────────────────────────────────────────┐
│  ◆ Brand   Dashboard   Projects   Team   Reports   [👤 You] │
│  ──────────────────────────────────────────────────────────── │
│                                                              │
│   Page content                                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
Best for: simple apps, limited navigation items (≤6), product-first tools
Tone: clean, focused, low-cognitive-load

---

**Option 3 — Icon-Only Rail + Contextual Panel**
```
┌───┬──────────────┬──────────────────────────────────────────┐
│ ◆ │  ─ Section  │                                          │
│   │  Item 1     │   Main Content Area                      │
│ 🏠 │  Item 2     │                                          │
│ 📊 │  Item 3     │                                          │
│ 👤 │  ────────── │                                          │
│ ⚙️ │  Sub Item   │                                          │
│   │  Sub Item   │                                          │
└───┴──────────────┴──────────────────────────────────────────┘
```
Best for: complex apps needing space efficiency (VSCode-style, Notion-style)
Tone: power-user, dense, keyboard-navigable

---

**Option 4 — Mobile-First Bottom Tab Bar**
```
┌──────────────────────────────────────────────────────────────┐
│   Page Title                                          [≡]    │
│   ──────────────────────────────────────────────────────      │
│                                                              │
│   [Content area]                                             │
│                                                              │
│                                                              │
│  ────────────────────────────────────────────────────────     │
│  🏠 Home    📊 Dash    ➕ Add    👤 Profile    ⚙️ More       │
└──────────────────────────────────────────────────────────────┘
```
Best for: mobile apps, responsive SaaS, PWAs
Tone: mobile-native, thumb-friendly, touch-first

---

### ELEMENT 7: DASHBOARD / DATA OVERVIEW

Present all 4 options. Ask: "Which dashboard layout? (1–4)"

---

**Option 1 — KPI Cards + Chart Row + Table**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  1,234   │  │  $56K    │  │  89%     │  │  +12%    │    │
│  │  Users   │  │ Revenue  │  │ Uptime   │  │  Growth  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  ┌────────────────────────────┐  ┌────────────────────────┐  │
│  │  ▁▂▃▄▅▆▇█  Revenue Chart  │  │  ●  Donut / Pie Chart  │  │
│  └────────────────────────────┘  └────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Recent Activity Table                               │    │
│  │  Name  │  Status  │  Date  │  Amount  │  Actions    │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```
Best for: analytics dashboards, SaaS, admin panels
Tone: data-dense, professional, information-first

---

**Option 2 — Activity Feed + Stats Right**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────┐  ┌──────────────────────┐  │
│  │  Recent Activity             │  │  ┌──────┐ ┌──────┐   │  │
│  │  ─────────────────────────   │  │  │  42  │ │  7   │   │  │
│  │  ● User signed up   2m ago   │  │  │ Tasks│ │ Due  │   │  │
│  │  ● Payment received 5m ago   │  │  └──────┘ └──────┘   │  │
│  │  ● Report generated 1h ago   │  │                      │  │
│  │  ● New comment      3h ago   │  │  ▁▂▃▄▅▆▇  Activity  │  │
│  │  ● File uploaded    5h ago   │  │                      │  │
│  └──────────────────────────────┘  └──────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```
Best for: project management tools, collaboration apps, task managers
Tone: live, flowing, context-rich

---

**Option 3 — Bento Dashboard (asymmetric data blocks)**
```
┌──────────────────────────────────────────────────────────────┐
│  ┌─────────────────────┐  ┌──────────┐  ┌──────────┐        │
│  │  ▁▂▃▄▅▆▇█           │  │  $56K    │  │  1,234   │        │
│  │  Main Chart  2×2    │  │  Rev 1×1 │  │  Users   │        │
│  │                     │  └──────────┘  └──────────┘        │
│  │                     │  ┌────────────────────────┐        │
│  └─────────────────────┘  │  Activity Feed  2×1    │        │
│  ┌──────────┐ ┌──────────┐│                        │        │
│  │ Status   │ │  Map /   ││  ● event  ● event      │        │
│  │ 89% 1×1  │ │  Geo 1×1 │└────────────────────────┘        │
│  └──────────┘ └──────────┘                                   │
└──────────────────────────────────────────────────────────────┘
```
Best for: modern SaaS, product analytics, fintech
Tone: modern, spatial, visually rich

---

**Option 4 — Minimal Command-Palette Style**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Good morning, Ahmed                    Monday, May 2025     │
│  ────────────────────────────────────────────────────────    │
│                                                              │
│  ● 3 tasks due today                                         │
│  ● 2 unread messages                                         │
│  ● System: all green                                         │
│                                                              │
│  Quick Actions                                               │
│  [ + New Task ]   [ + Invite ]   [ ↑ Upload ]               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
Best for: productivity tools, personal dashboards, focus-mode apps
Tone: minimal, text-first, distraction-free

---

## AFTER ALL CHOICES ARE MADE

Save all user selections to:
`docs/workspace/plans/04-design/DESIGN_CHOICES.md`

Format:
```yaml
project_type: [website / webapp / saas / mobile]
design_choices:
  header:         Option [N] — [name]
  portfolio_grid: Option [N] — [name]   # website only
  project_page:   Option [N] — [name]   # website only
  footer:         Option [N] — [name]
  contact:        Option [N] — [name]   # website only
  app_navigation: Option [N] — [name]   # app/saas/mobile
  dashboard:      Option [N] — [name]   # app/saas
confirmed: false
```

After file is written, show summary:
```
Your Design Choices:
  Header:     [chosen option name]
  Grid:       [chosen option name]
  Project pg: [chosen option name]
  Footer:     [chosen option name]
  Contact:    [chosen option name]

Type YES to confirm and generate DESIGN.md
Type CHANGE [element] to revise a specific choice
```

On YES → set `confirmed: true` → trigger DESIGN.md generation from choices.
