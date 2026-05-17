# Product Requirements Document — Nezam Design Server Token Studio

> **This document is the single source of truth for what gets built.**
> Every feature, every screen, every data field, every edge case must be defined here
> before any planning or development begins.

---

## 0. Product Identity

| Field | Value |
|---|---|
| Product Name | Nezam Design Server Token Studio |
| Tagline | Real-time visual token editing, brand persistence, and instant CSS compilation |
| Owner | Nezam Platform Team |
| GitHub Repo | iDorgham/Nezam |
| Target Market | Developers & Designers in the Egyptian & Global Web ecosystem |
| Status | Approved & Locked |
| PRD Version | 1.0.0 |
| Last Updated | 2026-05-17 |

---

## 1. Problem Statement

### 1.1 The Problem
Visual theme alignment between design specifications (`DESIGN.md` design contract) and frontend styles is traditionally manual, error-prone, and disconnected. Developers have to constantly copy-paste color hex codes, line-heights, and border-radii between design mockups and Tailwind/CSS configurations. The Nezam Design Server was built to bridge this gap, but it lacks several critical capabilities:
- **No Persistence Layer:** Custom visually-edited design profiles are lost on server reload. There is no way to save a unique visual brand preset or reload it.
- **Silent Compilation:** Synchronization of design tokens to visual layout components is silent. Users have no visual indicator in the UI of whether the compiled output succeeded, failed, or is out-of-sync with the file system.
- **Incomplete Shape Surface:** Shape tokens are missing crucial custom inputs for element corner roundness (border-radius), leaving buttons and cards looking generic.
- **Typographic Blind Spot:** The typography scale is represented as numbers only. Users cannot visually appreciate or test fluid typographical hierarchies before generating their design systems.

### 1.2 Why Now
Visual-first developer tools like Lovable, v0, and Bolt are setting a new standard for high-speed prototyping. A real-time Design Server that links spec files (like `DESIGN.md`) directly with responsive visual mockups gives our engineering pipeline a major velocity boost and locks down design token compliance automatically.

### 1.3 What Happens Without This Product
The status quo requires developers to hand-tweak CSS values, resulting in styling drifts, broken alignments, and custom values that bypass our strict design gates. Without brand persistence and status indicators, developers have to rebuild themes from scratch on every design iteration.

---

## 2. Users & Personas

### Persona 1: Amina — Senior Frontend Engineer
- **Who they are:** Amina is a lead UI developer who implements pixel-perfect screens and maintains design system integrity across Nezam apps.
- **Their job-to-be-done:** When I update or prototype a brand layout, I want to tweak tokens visually and see them sync instantly, so I can ensure all pages adhere perfectly to our target design token values.
- **Current frustration:** Having to double-check custom CSS or copy-paste hex values between different files. If a design server breaks or doesn't sync properly, she spends hours hunting down style discrepancies.
- **Success looks like:** A simple status indicator that confirms "CSS Synchronized", with one-click saving of brand profiles so she can swap between dark/light and custom partner styles.
- **Technical comfort:** High
- **Usage frequency:** Daily

### Persona 2: Tarek — Creative Director
- **Who they are:** Tarek directs the aesthetic feeling, spacing, and typographic quality across products.
- **Their job-to-be-done:** When I test a brand theme, I want to preview typographic sizes side-by-side with border-radius configurations, so I can guarantee the layout looks premium, readable, and perfectly balanced.
- **Current frustration:** Needs to ask a developer to compile and build the site just to see if a font size or corner radius fits the brand's luxury aesthetic.
- **Success looks like:** A Typographic Scale visualizer that displays fluid `clamp()` text alongside cards with customizable border radius sliders.
- **Technical comfort:** Medium
- **Usage frequency:** Weekly

---

## 3. Success Metrics

| Metric | Baseline | 30-day Target | 90-day Target | Source |
|---|---|---|---|---|
| Profile Save/Load Reliability | 0% (unsupported) | 100% (zero lost profiles) | 100% | UI Integration Tests / LocalStorage |
| Token Synchronization Speed | — | < 50ms compile time | < 25ms | Chrome Performance Audit |
| Design Drift Incidents | 12 per sprint | < 2 per sprint | 0 | PR Code Reviews & Design Gate Audits |
| User Visual Satisfaction Score | 3.2 / 5.0 | > 4.8 / 5.0 | 4.95 / 5.0 | Developer NPS & Empathy Surveys |

---

## 4. Feature Registry

| ID | Feature Name | Priority | Persona | Phase | Spec File |
|---|---|---|---|---|---|
| F-001 | Design Profile Persistence Layer | P0 | Amina, Tarek | Build | `docs/specs/features/F-001-profile-persistence.md` |
| F-002 | UI CSS Sync Status Indicators | P0 | Amina | Build | `docs/specs/features/F-002-css-sync-status.md` |
| F-003 | Border Radius Custom Token Editors | P0 | Tarek | Build | `docs/specs/features/F-003-border-radius.md` |
| F-004 | Typography Scale Visualizer Grid | P0 | Tarek | Build | `docs/specs/features/F-004-typo-scale-preview.md` |

---

## 5. Core User Flows

### Flow 1: Save and Apply Custom Brand Profile (F-001, F-002)
```
Step 1: User opens Nezam Design Server Token Studio.
  → [Happy path]: App loads current profile from local state and highlights "CSS Synchronized" pill in header.

Step 2: User tweaks primary color gradient, changes border-radius to "12px", and increases typography base size.
  → [Happy path]: Sync pill updates to "Syncing..." and then quickly resolves to "CSS Synchronized" (F-002).
  → [Error]: Disk/write error → shows "Sync Failed" badge with a tooltip error and a retry button.

Step 3: User enters name "Sahel Sunset" in Profile Input and clicks "Save Preset".
  → [Happy path]: App saves preset to local persistence list. Dropdown updates showing "Sahel Sunset" as active.
  → [Validation error]: User leaves name empty → Input borders glow red with message "Preset name required".
```

### Flow 2: Configure Shape and Typography Scale (F-003, F-004)
```
Step 1: User navigates to the "Shape & Typo" tab in Token Studio.
  → [Happy path]: Scale visualization grid renders live text previews of XS, SM, MD, LG, XL, 2XL scales.

Step 2: User drags the "Border Radius" slider from "4px" (Sharp) to "16px" (Soft).
  → [Happy path]: Element previews on the main canvas (Buttons, Dialogs, Cards) instantly animate to the new corner rounding.

Step 3: User changes font family from "Inter" to "Outfit" and increases scaling ratio.
  → [Happy path]: Typography scale grid adjusts automatically. User hovers over XL text to view detailed pixel metrics.
```

---

## 6. Data Model

### Entity: `DesignPreset`

| Field | Type | Required | Unique | Default | Validation | Notes |
|---|---|---|---|---|---|---|
| id | string (uuid) | yes | yes | auto | uuid | Primary Key |
| name | string | yes | yes | — | min Length: 1 | Preset display name |
| colors | object | yes | no | default colors | valid CSS hex/hsl | Map of primary, secondary, neutral, bg |
| borderRadius | string | yes | no | "8px" | CSS length unit | Element corner radius |
| typography | object | yes | no | default fonts | font size definitions | Fonts, base size, and scale multiplier |
| isCustom | boolean | yes | no | true | — | Custom user-made preset vs core brand |
| updatedAt | string (date) | yes | no | auto | ISO string | Last edit timestamp |

---

## 7. API Surface (Local Operations)

Since the Design Server runs as a local web application on the developer's machine, the API surface handles saving files directly to the project's local workspace.

#### `GET /api/presets`
- **Purpose:** Fetch all stored custom and system design presets.
- **Request body:** None
- **Success response (200):**
  ```json
  [
    {
      "id": "sahel-sunset",
      "name": "Sahel Sunset",
      "colors": { "primary": "#ff7e5f", "secondary": "#feb47b", "bg": "#121214" },
      "borderRadius": "12px",
      "typography": { "fontFamily": "Outfit", "baseSize": "16px", "scale": 1.25 },
      "isCustom": true
    }
  ]
  ```

#### `POST /api/presets/save`
- **Purpose:** Write a custom preset to local storage/disk.
- **Request body:**
  ```json
  {
    "name": "Sahel Sunset",
    "colors": { "primary": "#ff7e5f", "secondary": "#feb47b", "bg": "#121214" },
    "borderRadius": "12px",
    "typography": { "fontFamily": "Outfit", "baseSize": "16px", "scale": 1.25 }
  }
  ```
- **Success response (200):**
  ```json
  { "success": true, "presetId": "sahel-sunset" }
  ```

---

## 8. UI Screens & States

### Screen: Token Studio Dashboard

- **Route:** `/` (Main Design Server Page)
- **Accessible by:** All users
- **Purpose:** Single-page visual design workspace with collapsible panels for Colors, Shapes, Typography, and live Interactive Previews.

**States:**

| State | Trigger | What the user sees | Action available |
|---|---|---|---|
| Loading | App initializes | Sleek dark-mode skeleton screens with glassmorphism gradients | — |
| Empty | No custom presets | Sidebar loaded with "Default" & "Agentic" system profiles | "Create Preset" CTA |
| Populated | Presets loaded | Sidebar with profiles list, color selectors, border-radius slider, typographic scale preview grid, and a live Interactive Component Playground | Apply presets, Edit custom values, Export CSS |
| Error | Local write failure | Toast notification: "Failed to write DESIGN.md: Permission Denied" | Retry sync button |

---

## 9. Navigation Structure

```
Nezam Design Server
├── Dashboard (/)
│   ├── Color Palette Selector
│   ├── Shape Editor (Border Radius)
│   └── Typographic Scale Grid
├── Presets Manager (Sidebar Panel)
└── Documentation Wiki (/docs)
```

---

## 10. Non-Functional Requirements

### 10.1 Performance
- **Hot-Reload Sync Latency:** CSS custom properties update in < 16ms (instantaneous fluid updates using CSS variables in standard DOM runtime).
- **Disk Compilation:** Writing token configurations to disk is synchronous and completes in < 35ms.
- **Client Frame Rate:** Steady 60fps animations during color gradient transitions and slider adjustments.

### 10.2 Accessibility
- **WCAG Level:** AA compliance. Contrast ratios on all interactive buttons are audited to be at least 4.5:1.
- **Colorblind Support:** Distinct shapes and borders, not just color codes, to represent visual state changes.
- **RTL Readiness:** Layout supports side-by-side Arabic typography preview utilizing Egyptian Arabic (Masri) baseline scripts.

### 10.3 Security & Sandbox Integrity
- **Local Isolation:** Storage is confined to standard browser LocalStorage and dedicated project directories.
- **Strict Input Validation:** Hex code text inputs sanitise color strings to prevent CSS injection.

---

## 11. Constraints

- **Single-Page Application Context:** The design server is constructed to run smoothly as a standalone frontend dashboard that reads and compiles standard design assets inside the user's localized workspace without introducing external telemetry or database cloud dependencies.

---

## 12. Out of Scope (v1)
- ❌ **Cloud preset sharing:** Storing user themes on a centralized cloud database (postponed to v2). All presets are strictly workspace-local.
- ❌ **Third-party component library compiler:** Support for compiling presets to external UI frameworks (e.g. Radix, MUI, DaisyUI). Focused strictly on Next.js standard vanilla CSS properties and Tailwind variables.

---

## 13. Open Questions

| # | Question | Owner | Deadline | Decision |
|---|---|---|---|---|
| Q1 | Should presets be stored as separate files in `.nezam/design/` or in LocalStorage? | ARCH-01 | 2026-05-18 | Combined: save to LocalStorage for quick client sessions, with "Sync to Disk" to write directly to a local config file so it commits nicely. |

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Browser sandbox block writing files | Low | High | Standard node-based Next.js API routes run locally and handle filesystem updates safely on the local host. |
| Incompatible font selections breaking preview | Medium | Low | Restrict typeface dropdown to verified system typefaces and modern typography loaded from Google Fonts (Outfit, Inter, Roboto). |
