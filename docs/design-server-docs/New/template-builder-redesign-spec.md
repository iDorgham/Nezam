# Template Builder — Professional Redesign Spec
> NEZAM Design Server · `.nezam/design-server/app/template-builder/`
> Version: 2.0 · Date: 2026-05-20 · Author: Claude (Strategic Architecture Layer)

---

## 0. Executive Summary

The current Template Builder is a **single-panel preview tool** with a narrow right-panel settings column. It has good bones — design token controls, profile switching, live preview — but critically lacks:

- No dedicated canvas interactions or element-level editing
- Only 4 website types, no dashboard / photographer / news / AI-service templates
- Settings panel is a flat scrollable list with no hierarchy or sections
- No random style generator
- No drag-and-drop or element library
- Preview is a shrunk HTML mock, not a real compositional canvas
- No image or vector injection into the preview

This spec defines the complete v2 redesign: a **three-zone professional builder** modeled on the best UX patterns from Framer, Gamma, and Figma's property panel — but staying within the NEZAM Design System constraint model.

---

## 1. Product Goals

| Goal | Description |
|---|---|
| **Infinite styles** | One-click "Randomize Style" generates a never-repeating UI look every time |
| **Template breadth** | 12+ distinct site/app categories with 3+ layout variants each |
| **Professional settings panel** | Sectioned, collapsible, searchable — comparable to Framer/Webflow's right panel |
| **Element library** | Insert-ready UI blocks: forms, photo sections, shapes, icons, CTA strips |
| **Real image + vector injection** | Unsplash/SVG placeholders surfaced directly into the preview canvas |
| **Spacing & visual quality** | Every section has proper 8px-grid spacing, consistent visual weight |
| **Usable by non-developers** | Settings panel language is plain English — no token jargon exposed to user |

---

## 2. Current State Audit

### What Exists (Keep)
- `config.ts` — font, color palette, button, input, header/footer/hero option arrays
- `PreviewCanvas.tsx` — browser-chrome wrapper with live HTML preview
- `RightPanel.tsx` — icon tab rail + three tabs (Preview / Structure / Design)
- `primitives.tsx` — `Card`, `CardHeader`, `Section`, `SegmentControl`, `OptionCard`, `ToggleRow`
- Bilingual `t(en, ar)` helper
- Design System CSS variables (`--ds-primary`, `--ds-background`, etc.)

### What Must Change
| Problem | Impact | Fix |
|---|---|---|
| Only 4 website types | Builder feels like a demo | Expand to 12+ categories |
| Right panel has no LeftPanel equivalent | Settings crushed into one panel | Split into Left (library) + Right (settings) |
| No random style button | No "inspiration" path | Add `StyleRandomizer` engine |
| Preview canvas is static HTML | No real visual editing | Add click-to-highlight sections, image drop zones |
| No element/block library | Can't add new sections | New "Elements" library tab in left panel |
| Colors hardcoded orange | Palette doesn't live-update preview correctly | Wire palette to CSS variable injection |
| No images in preview | Preview looks like a wireframe | Inject Unsplash placeholder images |
| No vector/shape layer | No visual richness | Add inline SVG decorators to sections |

---

## 3. New Architecture: Three-Zone Builder

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOPBAR  [Logo]  [Template Type ▾]  [Style: Minimal]  [⚡ Randomize]  [↗ Export] │
├──────────────┬──────────────────────────────────────────┬───────────────────┤
│              │                                          │                   │
│  LEFT PANEL  │         PREVIEW CANVAS                   │   RIGHT PANEL     │
│  240px fixed │         flex-1 dark stage               │   320px fixed     │
│              │                                          │                   │
│  ┌──────────┐│  ┌──────────────────────────────────┐   │  ┌─────────────┐  │
│  │ Elements ││  │ 🌐 Browser Chrome                │   │  │ Settings    │  │
│  │ Library  ││  │ ──────────────────────────────── │   │  │ Panel       │  │
│  │          ││  │                                  │   │  │             │  │
│  │ Templates││  │   [Live website preview]         │   │  │ ▸ Template  │  │
│  │          ││  │   [Responsive at ~960px]         │   │  │ ▸ Layout    │  │
│  │ Layers   ││  │   [Click sections to select]     │   │  │ ▸ Colors    │  │
│  │          ││  │   [Drag to reorder]              │   │  │ ▸ Type      │  │
│  │ Assets   ││  │                                  │   │  │ ▸ Spacing   │  │
│  └──────────┘│  └──────────────────────────────────┘   │  │ ▸ Elements  │  │
│              │                                          │  └─────────────┘  │
│              │  [Device: Desktop ▾] [Zoom: 80% ▾]      │                   │
└──────────────┴──────────────────────────────────────────┴───────────────────┘
```

### 3.1 Top Bar

Fixed at 48px. Contains:

| Slot | Component | Behavior |
|---|---|---|
| Left | `[NEZAM Logo] > Template Builder` breadcrumb | Static |
| Center-left | `TemplateTypePicker` dropdown | Switches category + reloads content |
| Center | `StyleBadge` — shows active style name (e.g., "Bento Dark") | Read-only |
| Center | `⚡ Randomize Style` button | Triggers `StyleRandomizer` engine |
| Right | Device preview switcher: Desktop / Tablet / Mobile | Updates canvas viewport |
| Right | `↗ Export` button | Saves config to `templateConfig` store + writes `DESIGN.md` |
| Right | `Save` + `Saved ✓` button | Persists to localStorage |

### 3.2 Left Panel — Element Library & Navigation

Fixed 240px. Four tabs:

#### Tab 1: Elements
Categorized drag-and-drop block library. User clicks to append a section to the preview.

**Block categories:**

```
Navigation
  ├── Minimal Topbar
  ├── Mega Menu Bar
  ├── Sidebar Navigation
  └── Floating Nav

Hero Sections
  ├── Centered Hero
  ├── Split Hero (Text + Visual)
  ├── Video Backdrop Hero
  ├── Gradient Mesh Hero
  └── Bento Grid Hero

Content Blocks
  ├── Feature Cards (3-col)
  ├── Feature Cards (2-col)
  ├── Stats Strip
  ├── Testimonial Carousel
  ├── Pricing Table (2-col)
  ├── Pricing Table (3-col)
  ├── FAQ Accordion
  └── Team Grid

Media
  ├── Full-width Image Banner
  ├── Photo Gallery (masonry)
  ├── Video Embed Block
  └── Lightbox Grid

Forms & CTAs
  ├── Newsletter Signup
  ├── Contact Form (2-col)
  ├── Lead Capture Card
  ├── Waitlist Form
  └── CTA Strip (gradient)

Shapes & Decorators
  ├── Divider (wavy SVG)
  ├── Background Blob
  ├── Dot Grid Pattern
  ├── Gradient Orb
  └── Geometric Frame

Footers
  ├── Simple Row Footer
  ├── 3-Column Footer
  ├── 4-Column Footer
  └── Minimal Dark Footer
```

Each block card shows:
- A 60×40px miniature SVG thumbnail preview
- Block name in 11px semibold
- `+` insert button on hover

#### Tab 2: Templates
Full-page template presets. Clicking one instantly replaces the entire canvas layout.

**12 Template Categories (see Section 5 for full list)**

Each template card shows:
- Category icon
- Template name
- Short descriptor
- "Apply" button

#### Tab 3: Layers
Visual layer stack — ordered list of sections currently in the preview. Allows:
- Drag to reorder
- Click to select (highlights section in canvas)
- Eye icon to toggle visibility
- Trash icon to remove

#### Tab 4: Assets
Connected to the existing `openAssetManager`. Shows:
- Recent uploads (thumbnail grid)
- "Upload Image" button
- Unsplash search (search field → returns 6 photo suggestions inline)
- SVG library (20 pre-built decorative vectors grouped by style)

---

### 3.3 Preview Canvas

The center stage. Dark `#09090b` background with the preview at ~90% width, centered.

**Enhancements over current:**

1. **Browser chrome** — keep the existing lock icon + URL bar. Add device-switching: desktop (960px) / tablet (768px) / mobile (390px) using CSS transform scale.

2. **Section highlight** — clicking any section in the preview shows a blue selection ring + a floating action bar: `[Move ↑] [Move ↓] [Duplicate] [Delete] [Edit →]`. "Edit →" opens the section's specific settings in the Right Panel.

3. **Image drop zones** — every `<img>` placeholder and hero visual area shows a dashed drop zone on hover with "Drop image or click to choose." Dropping an image from Assets or local upload fills the slot.

4. **Vector decorators** — each section can have an optional background SVG decoration (blob, dots, geometric). A small SVG picker appears in the floating section action bar.

5. **Zoom & pan** — bottom toolbar: zoom slider 50–150%, "Fit" button, mouse-wheel zoom.

6. **Responsive toggle** — the device switcher wraps the preview in a scaled device frame (monitor outline / tablet / phone) using `transform: scale()`.

---

### 3.4 Right Panel — Professional Settings Panel

Fixed 320px. This is the most important upgrade. Currently a flat scrollable list — replacing with a **sectioned, collapsible, keyboard-searchable property panel**.

#### Panel Header

```
┌─────────────────────────────────────┐
│  ⚙ Page Settings          [? Help] │
│  ┌────────────────────────────────┐ │
│  │ 🔍 Search settings…           │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

- Search field filters all settings fields by label (fuzzy match)
- Help icon links to inline documentation tooltip per section

#### Settings Sections (all collapsible, with ▸/▾ chevron)

---

**Section 1 — Template**
```
▾ Template
  Industry Type     [SaaS ▾] ← 12 options
  Variant           [○ Standard  ○ Compact  ○ Wide]
  Language          [EN ▾ / AR ▾]
  RTL Direction     [Toggle]
```

---

**Section 2 — Announcement Bar**
```
▾ Announcement Bar
  Show Bar          [Toggle]
  Text              [────────────────────────────]
  Theme             [Brand] [Dark] [Cyan] [Custom]
  Text Align        [← Center →]
  Dismissible       [Toggle]
```

---

**Section 3 — Navigation**
```
▾ Navigation
  Nav Style    [Minimal] [Classic] [Mega Menu] [Sidebar]
  Menu Mode    [Horizontal ▾]
  Logo Align   [Left ▾]
  Menu Align   [Center ▾]
  ─────── Elements ───────
  ☑ CTA Button
  ☑ Social Links
  ☐ Phone Number
  ☐ Search Icon
  ☐ Language Toggle
  ☐ Notification Bell
```

---

**Section 4 — Hero**
```
▾ Hero
  Layout       [Centered] [Split] [Video] [Bento] [Fullscreen]
  Height       [Auto] [Full Viewport] [Custom: ── px]
  Media        [None ▾ / Image / Video / Gradient / Shape]
  Overlay      [Opacity slider: ──●──]
  Animation    [None] [Fade In] [Slide Up] [Parallax]
  ─────── Content ───────
  Show Tag Badge   [Toggle]
  Show Secondary CTA [Toggle]
  CTA Alignment    [Left ▾]
```

---

**Section 5 — Sections**
```
▾ Sections
  Feature Cards
    Layout    [3-col ▾]
    Icon Type [Emoji] [SVG] [Number]
    Card Style [Default] [Bordered] [Lifted]

  Stats Strip
    Show Stats [Toggle]
    Stat Count [3 ▾]
    Style      [Light] [Dark] [Brand]

  Testimonials
    Show       [Toggle]
    Layout     [Grid] [Carousel] [Single]

  Pricing
    Show       [Toggle]
    Columns    [2 ▾]
    Highlight  [2nd tier ▾]

  FAQ
    Show       [Toggle]
    Style      [Accordion] [Grid]
```

---

**Section 6 — Footer**
```
▾ Footer
  Style        [Simple Row] [Multi-Column]
  Columns      [3] [4] [5]   ← only if Multi-Column
  ─────── Elements ───────
  ☑ Social Icons
  ☐ Phone Number
  ☑ Newsletter Signup
  ☑ Logo
  ☐ App Store Badges
  ☐ Language Switcher
  ─────── Extras ───────
  Copyright Text [────────────]
```

---

**Section 7 — Colors**
```
▾ Colors
  Palette      [8 swatches grid, 2 rows]
  Custom Profiles [paginated 2-col grid]
  ─────── Custom Overrides ───────
  Primary      [#F97316 ■]  [Color picker popover]
  Accent       [#F59E0B ■]  [Color picker popover]
  Background   [#09090B ■]  [Color picker popover]
  Surface      [#18181B ■]  [Color picker popover]
  Mode         [○ Dark  ○ Light  ○ System]
```

---

**Section 8 — Typography**
```
▾ Typography
  Body Font      [8 font rows with specimen preview]
  Heading Font   [Same picker — can mix fonts]
  Base Size      [16px ▾]
  Scale Ratio    [1.25 ▾]  Minor Third / Major Third / Perfect Fourth
  Letter Spacing [Normal ▾]
  Line Height    [1.5 ▾]
```

---

**Section 9 — Buttons**
```
▾ Buttons
  Variant   [Solid] [Outlined] [Ghost] [Soft Tint]
             (each shows a live 40px button preview)
  Radius    [None ●──────] [Sm] [Md] [Lg] [Pill]
  Weight    [Normal] [Medium] [Semibold] [Bold]
  Size      [SM] [MD] [LG]
  Shadow    [None] [Subtle] [Lifted]
  Uppercase [Toggle]
```

---

**Section 10 — Forms**
```
▾ Forms
  Input Variant  [Outlined] [Underline] [Filled] [Soft]
  Input Size     [SM] [MD] [LG]
  Label Style    [Above] [Floating] [Inside]
  Form Layout    [Stack] [Grid]
  Error Style    [Inline] [Toast]
  Show Required  [Toggle]
```

---

**Section 11 — Spacing & Layout**
```
▾ Spacing & Layout
  Density      [Compact] [Balanced] [Spacious]
               (visual bar diagram showing gap ratios)
  Section Gap  [──●──]   32–120px slider
  Container    [Full Width ▾]
  Max Width    [1280px ▾]
  Grid Columns [12 ▾]
```

---

**Section 12 — Images & Media**
```
▾ Images & Media
  Hero Image     [Drop zone / Unsplash search]
  Image Style    [Sharp] [Rounded] [Circle for avatars]
  Aspect Ratio   [16:9 ▾]
  Background Blur [None] [Sm] [Md]
  Overlay Color  [#000 ■ 30%]
```

---

**Section 13 — Motion**
```
▾ Motion
  Animations   [None] [Subtle] [Expressive]
  Duration     [Fast] [Normal] [Slow]
  Easing       [Ease In Out ▾]
  Reduce Motion [Respect OS Toggle]
```

---

**Section 14 — Page Meta**
```
▾ Page Meta
  Page Title   [────────────]
  Description  [────────────]
  OG Image     [Upload slot]
```

---

## 4. Style Randomizer Engine

The `⚡ Randomize Style` button is the headline feature. Every click generates a visually complete, aesthetically coherent style combination.

### Algorithm

```typescript
// StyleRandomizer.ts

const PALETTES = colorPaletteOptions.map(p => p.value)      // 8 presets
const FONTS    = fontOptions.map(f => f.value)               // 8 fonts
const RADII    = radiusOptions.map(r => r.value)             // 5 values
const DENSITIES = ['compact', 'balanced', 'spacious']
const BTN_STYLES = ['solid', 'outline', 'ghost', 'soft']
const INPUT_VARS = ['outlined', 'underline', 'filled', 'soft']
const HERO_STYLES = ['centered', 'split', 'video', 'gradient', 'bento']
const NAV_STYLES  = ['minimal', 'classic', 'mega', 'sidebar']
const FOOTER_STYS = ['simple', 'big']

// Named style presets — displayed in StyleBadge
const STYLE_NAMES = [
  'Tokyo Midnight', 'Sahel Sand', 'Arctic Minimal', 'Cairo Bento',
  'Studio Noir', 'Desert Glass', 'Ocean Flat', 'Neon Grid',
  'Editorial Serif', 'Brutalist Mono', 'Soft Cream', 'Ink & Paper',
  'Glassmorphic', 'Clay UI', 'Retro Terminal', 'Luxury Dark',
  'Coral Bloom', 'Steel Blue', 'Forest Mist', 'Amber Glow',
]

export function randomizeStyle(current: RandomizerState): RandomizerState {
  // Seeded random — ensures same state never repeats consecutively
  const seed = Date.now()
  const pick = <T>(arr: T[]): T => arr[seed % arr.length]

  return {
    colorPalette: pick(PALETTES),
    bodyFont:     pick(FONTS),
    headingFont:  pick(FONTS),
    radius:       pick(RADII),
    density:      pick(DENSITIES),
    buttonStyle:  pick(BTN_STYLES),
    inputVariant: pick(INPUT_VARS),
    heroStyle:    pick(HERO_STYLES),
    navStyle:     pick(NAV_STYLES),
    footerStyle:  pick(FOOTER_STYS),
    styleName:    STYLE_NAMES[Math.floor(Math.random() * STYLE_NAMES.length)],
    showTopBar:   Math.random() > 0.5,
  }
}
```

### Constraints
- Adjacent results must differ in at least 3 properties (no micro-variations)
- Palette + font must be aesthetically compatible (curated compatibility matrix — e.g., Playfair Display always pairs with `rose`, `amber`, or `emerald`)
- Result is applied instantly with a 200ms CSS transition on the preview

---

## 5. Template Categories (12 Total)

Each category has `content`, `nav`, `hero`, `sections[]`, and `footer` presets.

| # | Category | Key Sections | Example Profile |
|---|---|---|---|
| 1 | **SaaS Platform** | Hero + Feature Cards + Pricing + CTA Strip + Footer | linear-app, stripe |
| 2 | **E-Commerce Store** | Hero Banner + Product Grid + Offers Strip + Review Strip + Footer | shopify-minimal |
| 3 | **Creative Agency** | Fullscreen Hero + Work Grid + Services + Team + Contact | dribbble-dark |
| 4 | **Real Estate** | Search Hero + Listing Cards + Map Strip + Agents + Footer | luxury-dark |
| 5 | **SaaS Dashboard** | Sidebar Nav + Stats Row + Charts Strip + Table + Activity Feed | linear-app |
| 6 | **AI Service / API** | Terminal Hero + Docs Preview + Pricing + Code Snippet + Footer | openai |
| 7 | **Photographer Gallery** | Fullscreen Grid Hero + Masonry Gallery + Bio Strip + Contact | editorial |
| 8 | **News / Magazine** | Header + Featured Article + Article Grid + Sidebar + Footer | news-minimal |
| 9 | **Portfolio** | Minimal Hero + Work Grid + Case Studies + Resume Strip + Contact | minimal |
| 10 | **Startup Landing** | Gradient Hero + Social Proof + Features + Testimonials + Pricing | bento |
| 11 | **Restaurant / F&B** | Hero + Menu Strip + Reservation Form + Gallery + Footer | luxury |
| 12 | **Admin Panel** | Top Nav + Metric Cards + Data Table + Side Filters + Action Bar | dashboard-dark |

Each category stores its content map in `config.ts`:
```typescript
export type WebsiteType = 
  'saas' | 'ecommerce' | 'agency' | 'realestate' | 
  'dashboard' | 'ai-service' | 'photography' | 'news' |
  'portfolio' | 'startup' | 'restaurant' | 'admin'
```

---

## 6. Image & Vector System

### 6.1 Image Injection

All `<img>` elements in the preview use a resolution hierarchy:

1. **User-uploaded asset** (from Asset Manager) — highest priority
2. **Unsplash placeholder** — fetched by keyword matching the template type
   - `saas` → query: "technology workspace dark"
   - `photography` → query: "photography portrait studio"
   - `restaurant` → query: "food restaurant minimal"
   - etc.
3. **Local SVG placeholder** — colored block with icon, used offline

Unsplash integration uses the free Unsplash `source.unsplash.com` URL format:
```
https://source.unsplash.com/960x540/?{keyword}&sig={Math.random()}
```
No API key required. Each randomize call refreshes the `sig` parameter.

### 6.2 Vector / SVG Decorators

20 pre-built SVG decorators organized in 4 families:

| Family | Examples |
|---|---|
| **Organic Blobs** | blob-1, blob-2, blob-3, blob-4, blob-5 |
| **Geometric** | circle-grid, hexagon-pattern, diagonal-lines, triangle-stack |
| **Gradient Mesh** | radial-burst, aurora-sweep, prism-fade |
| **Editorial** | horizontal-rule, bracket-left, dot-scatter, cross-marks |

Each decorator SVG is:
- Defined inline in a `decorators.ts` file (no external requests)
- Colorized via `currentColor` (inherits the `--ds-primary` token)
- Positioned absolutely in the section background via CSS

Section cards in the Elements library show a thumbnail of each decorator.

---

## 7. Spacing & Visual Quality Standards

All new UI must follow these standards (applies to both the builder UI itself and the preview canvas):

### Builder UI Spacing
- Base unit: **8px**
- Section padding: `p-4` (16px)
- Card gap: `gap-3` (12px)
- Label → control gap: `mb-2` (8px)
- Section header bottom margin: `mb-4` (16px)
- Divider margin: `my-3` (12px)

### Typography Scale (Builder UI)
| Role | Size | Weight | Color |
|---|---|---|---|
| Section title | 11px | 700 | `--ds-text-primary` |
| Field label | 10px | 600 uppercase | `--ds-text-muted` |
| Control value | 12px | 500 | `--ds-text-primary` |
| Description | 11px | 400 | `--ds-text-muted` |
| Badge | 10px | 700 | varies |

### Preview Canvas Spacing
- Section vertical padding: Compact = 48px / Balanced = 72px / Spacious = 96px
- Max content width: 1200px (centered)
- Grid gutter: Compact = 16px / Balanced = 24px / Spacious = 40px
- Card inner padding: 24px (desktop)

---

## 8. Component Architecture

### New File Structure

```
app/template-builder/
├── page.tsx                    ← Root layout (3-zone orchestrator)
├── components/
│   ├── TopBar.tsx              ← NEW: top action bar
│   ├── LeftPanel.tsx           ← REWRITE: tab nav + library
│   │   ├── tabs/
│   │   │   ├── ElementsTab.tsx ← NEW: block library
│   │   │   ├── TemplatesTab.tsx← NEW: 12 template presets
│   │   │   ├── LayersTab.tsx   ← NEW: section layer stack
│   │   │   └── AssetsTab.tsx   ← NEW: images + SVGs
│   ├── PreviewCanvas.tsx       ← EXTEND: add section selection + drop zones
│   ├── RightPanel.tsx          ← REWRITE: professional settings panel
│   │   ├── sections/
│   │   │   ├── TemplateSection.tsx
│   │   │   ├── AnnouncementSection.tsx
│   │   │   ├── NavigationSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── SectionsSection.tsx
│   │   │   ├── FooterSection.tsx
│   │   │   ├── ColorsSection.tsx
│   │   │   ├── TypographySection.tsx
│   │   │   ├── ButtonsSection.tsx
│   │   │   ├── FormsSection.tsx
│   │   │   ├── SpacingSection.tsx
│   │   │   ├── MediaSection.tsx
│   │   │   ├── MotionSection.tsx
│   │   │   └── PageMetaSection.tsx
│   │   └── shared/
│   │       ├── CollapsibleSection.tsx   ← NEW: animated accordion wrapper
│   │       ├── SettingsSearch.tsx       ← NEW: fuzzy search
│   │       └── ColorPickerPopover.tsx   ← NEW: inline color picker
│   ├── canvas/
│   │   ├── SectionWrapper.tsx          ← NEW: selection ring + action bar
│   │   ├── ImageDropZone.tsx           ← NEW: image slot component
│   │   └── sections/                   ← NEW: rendered section components
│   │       ├── NavSection.tsx
│   │       ├── HeroSection.tsx
│   │       ├── FeatureCardsSection.tsx
│   │       ├── StatsSection.tsx
│   │       ├── TestimonialsSection.tsx
│   │       ├── PricingSection.tsx
│   │       ├── FAQSection.tsx
│   │       ├── GallerySection.tsx
│   │       ├── FormSection.tsx
│   │       ├── CTASection.tsx
│   │       └── FooterSection.tsx
│   ├── config.ts               ← EXTEND: 12 types, decorators, style names
│   ├── decorators.ts           ← NEW: 20 inline SVG decorators
│   ├── StyleRandomizer.ts      ← NEW: randomizer engine
│   ├── templatePresets.ts      ← NEW: 12 full-page preset configs
│   └── primitives.tsx          ← EXTEND: add CollapsibleSection, ColorPicker
```

---

## 9. State Architecture

### Extended Store Shape

```typescript
// session.store.ts — additions for v2

interface TemplateBuilderState {
  // Existing
  templateConfig: TemplateConfig

  // New
  sections: SectionEntry[]         // ordered canvas sections
  selectedSectionId: string | null // currently selected section
  styleName: string                // current style badge name
  deviceMode: 'desktop' | 'tablet' | 'mobile'
  zoom: number                     // 50–150
  rightPanelSearch: string         // settings search query
  collapsedSections: string[]      // right panel collapsed section IDs
}

interface SectionEntry {
  id: string
  type: SectionType
  visible: boolean
  imageOverride?: string     // URL if user dropped an image
  decoratorId?: string       // SVG decorator key
}

type SectionType = 
  'nav' | 'hero' | 'features' | 'stats' | 'testimonials' |
  'pricing' | 'faq' | 'gallery' | 'form' | 'cta' | 'footer'
```

---

## 10. Implementation Phases

### Phase 1 — Settings Panel Upgrade (Week 1)
**Goal:** Professionalize the right panel without changing the canvas.

Tasks:
- [ ] Build `CollapsibleSection.tsx` — animated accordion with `▸/▾`
- [ ] Build `SettingsSearch.tsx` — renders filtered sections based on query
- [ ] Build `ColorPickerPopover.tsx` — hex input + hue/saturation picker (use `react-colorful`)
- [ ] Expand `NavigationSection.tsx` with 6 toggle options
- [ ] Add `HeroSection.tsx` settings with height, media, animation toggles
- [ ] Add `SectionsSection.tsx` with per-section controls
- [ ] Add `MotionSection.tsx` + `MediaSection.tsx` + `PageMetaSection.tsx`
- [ ] Wire all sections to `templateConfig` store
- [ ] Add search index (flat array of `{ sectionId, label, keywords }`)

### Phase 2 — Template Categories & Randomizer (Week 1–2)
**Goal:** 12 templates + Style Randomizer engine live.

Tasks:
- [ ] Expand `config.ts` `WebsiteType` to 12 values
- [ ] Write `templatePresets.ts` with full content map per category
- [ ] Build `StyleRandomizer.ts` engine with compatibility matrix
- [ ] Add `⚡ Randomize Style` button to `TopBar.tsx`
- [ ] Add `StyleBadge` component
- [ ] Wire randomizer output to `templateConfig` + `ds` state
- [ ] Animate transition on randomize with CSS `transition: all 200ms ease`

### Phase 3 — Left Panel Element Library (Week 2)
**Goal:** Block library with drag-to-insert.

Tasks:
- [ ] Build `ElementsTab.tsx` with `BlockCard` grid (SVG thumbnails)
- [ ] Implement `insertSection(type, position)` action in store
- [ ] Build `TemplatesTab.tsx` with 12 template preset cards
- [ ] Build `LayersTab.tsx` — ordered list with show/hide/delete
- [ ] Build `AssetsTab.tsx` — Unsplash search + SVG picker
- [ ] Wire "Apply Template" to reset `sections[]` array

### Phase 4 — Canvas Interaction & Media (Week 2–3)
**Goal:** Click-to-select sections, image drop zones, vector decorators.

Tasks:
- [ ] Build `SectionWrapper.tsx` — adds selection ring + floating action bar
- [ ] Build `ImageDropZone.tsx` — accepts drag-and-drop + file picker
- [ ] Build `decorators.ts` — 20 inline SVG shapes
- [ ] Integrate Unsplash URLs into hero image placeholder
- [ ] Add device preview switcher (CSS transform scale)
- [ ] Add zoom control (bottom toolbar)
- [ ] Build `canvas/sections/` directory with modular section renderers

### Phase 5 — Polish & Export (Week 3)
**Goal:** Production-quality output.

Tasks:
- [ ] Ensure all color palette selections live-update CSS variables in preview
- [ ] RTL support in all new sections (mirror layouts for `lang === 'ar'`)
- [ ] Keyboard shortcuts: `Cmd+S` save, `Cmd+Z` undo last change, `Space` randomize
- [ ] Add `Export` action — writes config to `DESIGN.md` + shows diff preview
- [ ] Write unit tests for `StyleRandomizer.ts` (min 20 consecutive results unique)
- [ ] Performance audit — preview canvas must render < 50ms after change

---

## 11. Design & Visual Standards for the Builder UI Itself

The builder UI must look **premium** — not a dev tool that happened to get a coat of paint. Reference: Framer Properties Panel, Linear Settings, Vercel Dashboard.

### Key Visual Rules

1. **Collapsible sections use animated chevron** — 300ms rotate transform, 200ms max-height transition
2. **Active state** — selected option shows `ring-1 ring-ds-primary/30` + `bg-ds-primary/6` (never just a border change)
3. **Hover state** — `hover:bg-ds-surface-hover` (never background + border simultaneously on hover)
4. **Control height** — all interactive controls are exactly 32px tall (SM: 28px, LG: 36px)
5. **Color swatches** — always 28×28px minimum, with `ring-2 ring-offset-2 ring-ds-primary` when selected
6. **Section dividers** — use `<Divider label="…" />` primitive, never raw `<hr>`
7. **Icons** — Lucide only, 13px in labels, 15px in tabs/buttons, always `shrink-0`
8. **Empty states** — every list/grid has an illustrated empty state (SVG + 2-line message)
9. **Disabled states** — `opacity-40 cursor-not-allowed pointer-events-none` on wrappers

### Animation Contracts

| Action | Duration | Easing |
|---|---|---|
| Accordion open/close | 200ms | `ease-in-out` |
| Palette switch | 150ms | `ease-out` |
| Style randomize | 200ms | `ease-in-out` on all tokens |
| Section insert | 300ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring) |
| Selection ring appear | 150ms | `ease-out` |
| Tooltip appear | 100ms | `ease-out` |

---

## 12. Key Design Decisions & Rationale

| Decision | Why |
|---|---|
| Keep Right Panel icon rail | It's compact and works — just expand the content depth |
| Left Panel is always visible | Block library discovery is a primary action, not secondary |
| No modal dialogs | Everything inline — settings panels, pickers, previews |
| SVG thumbnails for blocks | No external image requests, always accurate, theming respects DS variables |
| CSS transform scale for device preview | Zero layout reflow, instant switching, no iframes |
| `react-colorful` for color picker | 2.5kb gzipped, no deps, fully accessible |
| Unsplash `source.unsplash.com` for images | Free, no API key, keyword-targeted, auto-refreshes |
| Named styles ("Tokyo Midnight") | Makes randomizer feel like a creative tool, not a config roller |
| Sections are an ordered array in state | Enables layers panel, drag-reorder, and future undo stack |

---

## 13. Out of Scope (Explicitly)

- Real-time collaboration (no WebSocket for now)
- AI content generation within the builder (covered by `/ai` route separately)
- Publishing to a live URL (covered by `/export` route separately)
- Custom code injection (out of scope for v2)
- Mobile app builder (separate product surface)

---

## 14. Success Metrics

| Metric | Target |
|---|---|
| Template categories | ≥ 12 |
| Unique randomizer style names | ≥ 20 |
| Right panel settings sections | ≥ 14 |
| Element library blocks | ≥ 30 |
| SVG decorator options | ≥ 20 |
| Preview render time after setting change | < 50ms |
| Settings search response time | < 16ms |
| Adjacent randomizer outputs that differ | ≥ 3 properties |

---

## 15. Handoff Notes for Implementation Agent

### Do Not Change
- `primitives.tsx` core components (`Card`, `CardHeader`, `SegmentControl`, `OptionCard`, `ToggleRow`) — only extend
- The `session.store` `templateConfig` shape — only add new fields, never remove
- CSS variable naming (`--ds-primary`, `--ds-background`, etc.)
- Bilingual `t(en, ar)` pattern — all new UI strings must have both values
- The `STORAGE_KEY = 'nezam.ds.template-config'` persistence key

### Safe to Replace
- `LeftPanel.tsx` — full rewrite (the current one is a duplicate of RightPanel functionality)
- `RightPanel.tsx` content — same shell (icon rail), replace internal sections
- `page.tsx` — extend layout to add TopBar zone

### Dependencies to Install
```bash
pnpm add react-colorful          # Color picker
pnpm add @dnd-kit/core           # Drag-and-drop for layers panel + section insert
pnpm add @dnd-kit/sortable       # Sortable sections in layers tab
```

### Environment
- Next.js 15 App Router
- Tailwind CSS 3 (no Tailwind v4)
- Zustand state
- Lucide React icons
- Port 4000

---

*End of Spec · NEZAM Template Builder v2.0*
