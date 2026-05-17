# NEZAM Design Server — Full Audit + Improvement Plan + Antigravity Prompt

> Audited: 2026-05-15  
> Auditor: Claude (Strategic Architecture Layer)  
> Scope: `.nezam/design-server/` — full source scan

---

## Part 1: What the Design Server Is

The NEZAM Design Server is a **local Next.js 15 app** (running on port 4000) that serves as a **human-in-the-loop design decision engine**. It sits between design intent and code generation, producing two primary artifacts:

- `DESIGN.md` — the locked design contract (tokens, typography, palette)
- `wireframes_locked.json` — the locked page/block structure that gates AI swarm development

### Architecture Overview

| Layer | What exists |
|---|---|
| **UI** | Next.js 15 App Router, Tailwind CSS 3, Zustand state |
| **Pages** | Dashboard, Sitemap, Menus, Canvas, Template Builder, Wireframes, Profile Editor, Theme Editor, Asset Manager, Layout Designer, Settings, AI Assistant |
| **API Routes** | `/api/context`, `/api/profiles`, `/api/profiles/[name]`, `/api/lock`, `/api/cli`, `/api/ai/generate`, `/api/pages/[page_id]`, `/api/tui/[page_id]` |
| **Token System** | `tokens.store.ts` — Zustand store with 8 color tokens, 4 typography tokens, 1 spacing token |
| **Design Profiles** | 100+ `.nezam/design/<brand>/design.md` files (minimal, linear-app, apple, openai, etc.) |
| **Locking** | `export-design.ts` → writes `DESIGN.md`; `wireframes_locked.json` via wireframe editor |
| **Gates** | `design-gates.mdc` (7 gates), `design-server-gates.mdc` (wireframe lock gate) |

---

## Part 2: What's Good

### ✅ Strengths

1. **Architecture concept is correct.** A dedicated local design server that locks decisions before AI generation is exactly right for SDD. The gate system (`wireframes_locked.json` must exist before `/DEVELOP`) is architecturally sound.

2. **100+ design profiles catalog.** Having `minimal`, `linear-app`, `apple`, `openai`, `bento`, `editorial`, `luxury` etc. as selectable profiles is a strong differentiator. The markdown-based format is readable by AI agents.

3. **Bilingual (EN/AR) from day one.** RTL-awareness is baked into the UI via `lang` state and `t(en, ar)` helper. This aligns with MENA market requirements.

4. **Token CSS variables are defined and scoped.** `globals.css` correctly uses CSS custom properties (`--ds-primary`, `--ds-background`, etc.) with dark/light theme via `[data-theme="light"]`.

5. **Clean component separation.** `Sidebar`, `ConsolePanel`, `ThemeLanguageToggles`, `WireframesWorkspace`, `TokenStudio` are properly isolated.

6. **Session autosave architecture.** `autosave.ts` + `.session/` directory shows intent for persistence between sessions.

7. **TUI mode.** Terminal UI preview (`/pages/[id]/tui`) is a unique feature for CLI-first AI workflows.

---

## Part 3: Critical Gaps & Problems

### 🔴 CRITICAL — Token System is Anemic

**Problem:** `tokens.store.ts` defines only 8 color slots + 4 typography slots + 1 spacing slot. This is far too thin for a professional design system.

What's missing:
- No semantic token layer (no `--color-interactive`, `--color-destructive`, `--color-success`)
- No elevation/shadow tokens
- No border-radius tokens
- No motion/duration tokens
- No z-index scale
- No full type scale (only `baseSize` + `scale` ratio — no named roles like `heading-1`, `label`, `caption`)
- No responsive breakpoint tokens

**Impact:** The export (`DESIGN.md`) produced is skeletal — it can't drive deterministic code generation. The Antigravity/Kilo AI will have insufficient design signal.

---

### 🔴 CRITICAL — Profile Parser is Broken

**Problem:** `profile.parser.ts` uses a brittle regex (`/- \*\*(.*?):\*\* \`#(.*?)\`/g`) to extract color tokens from markdown. It:
- Only captures hex colors with the exact `- **Key:** \`#VALUE\`` syntax
- Returns empty `typography: {}`, `spacing: {}`, `borders: {}`, `motion: {}` — always
- Category detection is heuristic guesswork based on keyword presence
- Confidence is always `'partial'` or `'minimal'` — never `'rich'`

**Impact:** 100+ design profiles are largely unreadable by the server. Profile selection has no actual effect on the generated token set.

---

### 🔴 CRITICAL — AI Generate Route is Mocked

**Problem:** `/api/ai/generate/route.ts` is a pure keyword-matching mock with hardcoded `setTimeout(1000)`. It does not call any AI model.

**Impact:** The AI wireframe generation feature doesn't function. This is a major gap for an "AI-native design server."

---

### 🟡 HIGH — Token Store Disconnected from Profile Selection

**Problem:** When a user selects a design profile (e.g., `linear-app`), the `tokens.store.ts` is not updated. There's no bridge between `selectedProfile` in `session.store.ts` and the token values in `tokens.store.ts`.

**Impact:** Profile selection is cosmetic — choosing "Linear" vs "Apple" produces identical token output.

---

### 🟡 HIGH — Export is Incomplete

**Problem:** `generateDesignMarkdown()` in `export-design.ts` exports:
- Only 8 color values
- Only 4 typography values
- No spacing, radius, motion, elevation, shadows, breakpoints, component variants
- No RTL/LTR behavior documented
- No component inventory
- No interaction states

**Impact:** The `DESIGN.md` contract it writes cannot drive deterministic AI implementation. Agents reading this file will have insufficient signal and will hallucinate missing decisions.

---

### 🟡 HIGH — Hardcoded Colors in Components

**Problem:** Multiple components bypass the token system with hardcoded hex values:
- `#FF5701` appears directly in JSX (Sidebar, page.tsx, WireframesWorkspace, etc.)
- `#8a8f98` is hardcoded throughout instead of using `text-ds-text-muted`
- `#27a644` hardcoded for user avatar
- `text-[#FF57011a]` — arbitrary Tailwind opacity hack

This violates **Gate 1** of `design-gates.mdc` (zero hardcoded design primitives).

---

### 🟡 HIGH — No Fluid Typography / Type Scale

**Problem:** The design server builds a design system but applies no fluid typography to itself. `globals.css` has no `@layer base` type scale, no `clamp()` definitions, no named type roles. Gate 2 of `design-gates.mdc` is violated by the server's own UI.

---

### 🟠 MEDIUM — No Wireframe-to-Token Binding

**Problem:** Wireframe blocks in the editor have no token-aware props. Block definitions in the registry define `props` but they're not connected to the active token set. You can't configure a block's background using `--color-surface` from the token store.

---

### 🟠 MEDIUM — No Validation on Lock

**Problem:** The lock API (`/api/lock`) does a simple `fs.writeFileSync` with no schema validation. It doesn't check if required tokens are populated, if sitemap has at least one page, or if wireframes exist for P0 pages.

**Impact:** You can lock an empty/invalid design contract, which defeats the purpose of the gate system.

---

### 🟠 MEDIUM — Sidebar Has Duplicate Icons

**Problem:** In `Sidebar.tsx`, both `theme-editor` and `profile-editor` and `template` use `Palette` icon from Lucide — 3 identical icons in the nav. This is a UX regression that makes navigation confusing.

---

### 🟠 MEDIUM — No Token Injection to Main App

**Problem:** `token-injector.ts` exists but isn't wired to any export flow. After locking design, there's no automated injection of CSS variables into the main app's `globals.css`. The locked tokens stay inside the design server only.

---

### 🟡 LOW — Missing: Component Preview System

**Problem:** There's a `LivePreviewCard` component in tokens but no component preview surface that shows how actual NEZAM UI components render with the active token set. You're editing tokens in the dark.

---

## Part 4: Improvement Plan (Prioritized)

### Phase 1 — Foundation Repair (Critical, do first)

| # | Task | Impact |
|---|---|---|
| 1 | **Expand token schema** — add semantic layer, radius, elevation, z-index, motion, full type scale | Unlocks deterministic AI export |
| 2 | **Fix profile parser** — use proper structured markdown parsing, populate all token categories | Makes profile selection functional |
| 3 | **Wire profile → tokens** — when profile selected, parse and hydrate `tokens.store.ts` | Profile selection has real effect |
| 4 | **Expand export/lock** — `DESIGN.md` must include full token table, type scale, spacing, radius, motion, component inventory, RTL notes | AI agents get complete signal |
| 5 | **Replace hardcoded colors** — purge all `#FF5701`, `#8a8f98` etc. from JSX; use `var(--ds-*)` or Tailwind token classes | Dogfood Gate 1 compliance |

### Phase 2 — Feature Completion (High value)

| # | Task | Impact |
|---|---|---|
| 6 | **Wire AI generate route** — connect to Claude API (or Gemini via gemini-cli) with proper system prompt | AI wireframe generation actually works |
| 7 | **Token-aware block props** — block registry props reference token variables | Wireframes are semantically correct |
| 8 | **Lock validation** — pre-lock checklist: token completeness, sitemap populated, wireframes exist for P0 pages | Gate integrity |
| 9 | **Token injector pipeline** — post-lock, auto-write CSS variables to `../../src/app/globals.css` or wherever the main app's stylesheet is | Design actually flows into app |
| 10 | **Fix Sidebar icons** — use distinct icons per section (e.g., `Brush` for Theme Editor, `Layers` for Profile Editor) | Basic UX clarity |

### Phase 3 — Premium Capabilities (Strategic)

| # | Task | Impact |
|---|---|---|
| 11 | **Component preview surface** — render actual shadcn/Radix primitives with active token set inside design server | Real-time design feedback |
| 12 | **Fluid typography engine** — `clamp()` calculator built into Typography tab, output CSS ready to paste | Meets Gate 2 |
| 13 | **Dark/light parity validator** — automated check that all `--ds-*` tokens have both light and dark values | No missing theme states |
| 14 | **Profile comparison view** — side-by-side token diff between two profiles | Faster design decision-making |
| 15 | **Git integration on lock** — auto-commit `DESIGN.md` + `wireframes_locked.json` on lock confirmation | Audit trail |

---

## Part 5: Antigravity Implementation Prompt

> Copy this prompt and run it in Antigravity to implement Phase 1 + Phase 2.

---

```
TASK: Improve the NEZAM Design Server — Phase 1 (Foundation Repair) + Phase 2 (Feature Completion)

CONTEXT:
You are working inside the NEZAM monorepo. The Design Server lives at `.nezam/design-server/`. It is a Next.js 15 App Router project using Tailwind CSS 3 and Zustand. Its purpose is to be a human-in-the-loop design decision engine that produces two artifacts: DESIGN.md (design token contract) and wireframes_locked.json (page layout contract). These artifacts gate AI swarm development.

The following files are the critical ones you will modify:
- `.nezam/design-server/lib/store/tokens.store.ts` — token state
- `.nezam/design-server/lib/parsers/profile.parser.ts` — profile markdown parser
- `.nezam/design-server/lib/locking/export-design.ts` — DESIGN.md generator
- `.nezam/design-server/lib/token-injector.ts` — CSS variable injector
- `.nezam/design-server/lib/paths.ts` — file path helpers
- `.nezam/design-server/app/globals.css` — design server's own CSS tokens
- `.nezam/design-server/app/api/lock/route.ts` — lock endpoint
- `.nezam/design-server/app/api/ai/generate/route.ts` — AI wireframe generator
- `.nezam/design-server/components/layout/Sidebar.tsx` — navigation
- `.nezam/design-server/lib/store/session.store.ts` — session state (profile selection)

CONSTRAINTS (DO NOT VIOLATE):
- Do not introduce any new dependencies beyond what is already in package.json unless absolutely necessary
- Do not change the API route signatures (URLs must remain the same)
- Do not change the Zustand store interface structure — only extend it
- Preserve the bilingual (lang === 'ar') pattern everywhere in UI components
- All CSS values in components must use `var(--ds-*)` CSS variables or existing Tailwind token classes — zero raw hex values in JSX className strings
- Keep the existing file structure — do not reorganize directories

---

TASK 1: Expand Token Schema in tokens.store.ts

Current `DesignTokens` interface has only:
- colors: 8 keys
- typography: 4 keys  
- spacing: 1 key

Replace with this expanded schema:

```typescript
export interface DesignTokens {
  colors: {
    // Brand
    primary: string
    primaryHover: string
    secondary: string
    accent: string
    // Semantic
    interactive: string
    destructive: string
    success: string
    warning: string
    info: string
    // Surface
    background: string
    surface: string
    surfaceElevated: string
    overlay: string
    // Text
    textPrimary: string
    textSecondary: string
    textMuted: string
    textDisabled: string
    textInverse: string
    // Border
    border: string
    borderStrong: string
    borderFocus: string
  }
  typography: {
    fontHeading: string
    fontBody: string
    fontMono: string
    baseSize: number
    scale: number
    // Named type scale (px values derived from baseSize * scale^n)
    sizeXs: string       // clamp(10px, ...)
    sizeSm: string       // clamp(12px, ...)
    sizeMd: string       // clamp(14px, ...)  
    sizeLg: string       // clamp(16px, ...)
    sizeXl: string       // clamp(20px, ...)
    size2xl: string      // clamp(24px, ...)
    size3xl: string      // clamp(30px, ...)
    size4xl: string      // clamp(36px, ...)
    lineHeightTight: string    // '1.2'
    lineHeightNormal: string   // '1.5'
    lineHeightRelaxed: string  // '1.75'
    weightLight: number        // 300
    weightNormal: number       // 400
    weightMedium: number       // 500
    weightSemibold: number     // 600
    weightBold: number         // 700
  }
  spacing: {
    baseUnit: number
    xs: string   // 4px
    sm: string   // 8px
    md: string   // 16px
    lg: string   // 24px
    xl: string   // 32px
    '2xl': string  // 48px
    '3xl': string  // 64px
    '4xl': string  // 96px
  }
  radius: {
    none: string   // '0'
    sm: string     // '4px'
    md: string     // '8px'
    lg: string     // '12px'
    xl: string     // '16px'
    full: string   // '9999px'
  }
  elevation: {
    none: string   // 'none'
    sm: string     // '0 1px 3px rgba(0,0,0,0.12)'
    md: string     // '0 4px 16px rgba(0,0,0,0.16)'
    lg: string     // '0 8px 32px rgba(0,0,0,0.24)'
    xl: string     // '0 16px 64px rgba(0,0,0,0.32)'
  }
  motion: {
    durationFast: string    // '100ms'
    durationNormal: string  // '200ms'
    durationSlow: string    // '400ms'
    easingDefault: string   // 'cubic-bezier(0.4, 0, 0.2, 1)'
    easingSpring: string    // 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
  zIndex: {
    base: number       // 0
    dropdown: number   // 100
    sticky: number     // 200
    overlay: number    // 300
    modal: number      // 400
    toast: number      // 500
  }
}
```

Provide sensible defaults for a dark-mode SaaS product (NEZAM's own profile). The primary orange is `#FF5701`.

Update the `updateColor`, `updateTypography` methods to handle the new keys. Add `updateRadius`, `updateElevation`, `updateMotion`, `updateSpacing` methods following the same pattern.

---

TASK 2: Fix profile.parser.ts

The current parser only extracts hex colors via brittle regex. Replace with a proper structured parser.

The design profile markdown format is:
```
# Design System Inspired by [Name]
> Category: [category]
> [description]

## 2. Color
- **Primary:** `#HEXVALUE`
- **Secondary:** `#HEXVALUE`
- **Surface:** `#HEXVALUE`
...

## 3. Typography
- **Scale:** [description]
- **Families:** primary=[fontname], display=[fontname], mono=[fontname]
- **Weights:** [comma-separated numbers]

## 4. Spacing & Grid
- **Spacing scale:** [comma-separated sizes]

## 7. Motion & Interaction
- Default to short, purposeful transitions ([Xms–Yms])
```

Write a parser that:
1. Extracts all named colors (primary, secondary, accent, surface, text, neutral, danger, success, warning) from Section 2
2. Extracts font families from Section 3 (parse `primary=`, `display=`, `mono=` from the Families line)
3. Extracts the spacing scale from Section 4
4. Extracts motion duration hint from Section 7 (parse the ms range if present)
5. Detects RTL requirement if content includes "rtl", "arabic", "مناطق", "khaleeji", "mena", "levantine", "masri", "maghrebi"
6. Returns confidence: 'rich' if all 4 sections parsed successfully, 'partial' if 2-3 sections, 'minimal' if < 2

Update `ParsedProfile` type to include the new fields. Export a `profileToTokens(profile: ParsedProfile): Partial<DesignTokens>` function that maps profile data to token store values.

---

TASK 3: Wire Profile Selection → Token Store

In `session.store.ts`, when `setSelectedProfile(name)` is called, the session store should:
1. Fetch the profile by name from the `profiles` array
2. Call `profileToTokens()` from the profile parser
3. Call `useTokensStore.getState().setTokens(merged)` — merge with defaults, don't clobber

Add a new action `applyProfileToTokens(name: string)` to `SessionState`.

Call this from the Profile selection UI.

---

TASK 4: Expand export-design.ts (DESIGN.md Generator)

Replace the current minimal `generateDesignMarkdown()` with a comprehensive generator that outputs a structured contract. The output must include:

```markdown
# DESIGN CONTRACT
> Generated: [ISO timestamp]
> Profile: [active profile name]

## 1. Token System

### 1.1 Color Tokens
| Token | Light | Dark |
|-------|-------|------|
| --color-primary | ... | ... |
...

### 1.2 Typography Scale
| Role | Size | Weight | Line Height | Font |
|------|------|--------|-------------|------|
| Display | clamp(36px, 4vw, 48px) | 700 | 1.2 | [heading font] |
...

### 1.3 Spacing Scale
[4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px]

### 1.4 Radius
[none, sm, md, lg, xl, full]

### 1.5 Elevation
[none, sm, md, lg, xl shadows]

### 1.6 Motion
[duration and easing values]

### 1.7 Z-Index
[scale values]

## 2. CSS Variable Export
\`\`\`css
:root {
  --color-primary: [value];
  ...
}
[data-theme="light"] {
  ...
}
\`\`\`

## 3. Sitemap & Page Inventory
[page table: route, type, nav label, nav position]

## 4. Component Inventory
[list of page types → implied component needs]

## 5. RTL Requirements
[true/false, dialect notes if MENA profile]

## 6. Gate Compliance Checklist
- [ ] Token contract complete
- [ ] Typography scale defined
- [ ] Motion budget defined
- [ ] RTL validated
- [ ] Wireframes locked
```

---

TASK 5: Fix Hardcoded Colors in Components

Scan all `.tsx` files in `.nezam/design-server/` for direct hex usage in className strings. Replace:

- `text-[#8a8f98]` → `text-ds-text-muted` (add Tailwind mapping in `tailwind.config.ts`)
- `bg-[#FF5701]` → `bg-ds-primary`
- `text-[#FF5701]` → `text-ds-primary`
- `border-[#FF5701]` → `border-ds-primary`
- `bg-[#FF57011a]` → `bg-ds-primary/10`
- `text-[#ffffff30]` → `text-white/20`
- `bg-[#27a644]` → either add `--ds-user-avatar` token or use Tailwind `bg-green-600`

Add the following to `tailwind.config.ts` theme.extend.colors:
```js
'ds-primary': 'var(--ds-primary)',
'ds-background': 'var(--ds-background)',
'ds-surface': 'var(--ds-surface)',
'ds-text-primary': 'var(--ds-text-primary)',
'ds-text-muted': 'var(--ds-text-muted)',
'ds-border': 'var(--ds-border)',
'ds-accent': 'var(--ds-accent)',
```

---

TASK 6: Wire AI Generate Route to Real AI

Replace the mock keyword-matching in `/api/ai/generate/route.ts` with a real implementation.

Use the Anthropic API (claude-haiku-4-5-20251001 for speed) with this system prompt:

```
You are a wireframe block layout generator for the NEZAM Design Server.
Given a natural language description of a page section, return a JSON array of block objects.
Each block must have: { id: string, type: string, name: string, props: Record<string,any> }
Valid block types from the registry include: Nav_TopBar, Hero_Simple, Hero_Split, Content_Text, Content_Card, Content_Grid, Form_Contact, Footer_Simple, Section_Features, Section_Testimonials, Section_CTA, Section_Pricing.
Return ONLY valid JSON. No markdown. No explanation.
```

Read the block registry from the file system first using `getBlockRegistry()` to get valid block types dynamically.

Use streaming if the API supports it; otherwise use standard fetch. Respect the ANTHROPIC_API_KEY environment variable.

---

TASK 7: Add Lock Validation

Before writing files in `/api/lock/route.ts`, add a validation step:

```typescript
const errors: string[] = []

if (!tokens.colors.primary) errors.push('Missing primary color token')
if (!tokens.typography.fontBody) errors.push('Missing body font')
if (!sitemap || sitemap.length === 0) errors.push('Sitemap is empty — add at least one page')

// Check wireframes exist for P0 pages
const p0Pages = sitemap.filter(p => p.type === 'public')
for (const page of p0Pages) {
  const sessionPath = getPageSessionPath(page.id)
  if (!fs.existsSync(sessionPath)) {
    errors.push(`No wireframe saved for page: ${page.title} (${page.route})`)
  }
}

if (errors.length > 0) {
  return NextResponse.json({ error: 'Lock validation failed', errors }, { status: 422 })
}
```

Also update the lock route to write BOTH `DESIGN.md` and `wireframes_locked.json` atomically.

---

TASK 8: Fix Sidebar Icon Duplication

In `Sidebar.tsx`, replace icons so each section has a distinct icon:
- Dashboard → `LayoutDashboard`
- Sitemap → `Network`
- Menus → `Menu`
- Canvas → `PenTool`
- Template Builder → `Layers` (import from lucide-react)
- Wireframes → `Component`
- Layout Designer → `Layout`
- Theme Editor → `Brush` (import from lucide-react)
- Asset Manager → `Image`
- Profile Editor → `BookOpen` (import from lucide-react)
- Settings → `Settings`
- AI Assistant → `Bot`

---

TASK 9: Add CSS Variable Export to globals.css

After `tokens.store.ts` is updated, expand `globals.css` to include ALL new token CSS variables, mapping them from the expanded token schema. Both `:root` (dark) and `[data-theme="light"]` blocks must be complete.

Update the `--ds-` prefix to `--color-`, `--type-`, `--space-`, `--radius-`, `--shadow-`, `--motion-`, `--z-` prefixes following W3C Design Token format for clarity.

---

EXECUTION ORDER:
1. tokens.store.ts (schema first, everything depends on it)
2. profile.parser.ts + profileToTokens()
3. session.store.ts applyProfileToTokens()
4. tailwind.config.ts theme extensions
5. globals.css expansion
6. Sidebar.tsx icon fix
7. All .tsx files — replace hardcoded colors
8. export-design.ts (expanded generator)
9. /api/lock/route.ts (validation + atomic write)
10. /api/ai/generate/route.ts (real AI)

After each file, verify TypeScript compiles with `pnpm tsc --noEmit` from the design-server directory.
```
