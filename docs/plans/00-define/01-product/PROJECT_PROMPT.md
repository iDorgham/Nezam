# PROJECT_PROMPT — Nezam Design Server · Ultimate UI Suite

> **This file is read by every AI agent before touching any code or spec.**
> It defines the product contract, decision rules, forbidden patterns, and
> acceptance criteria. Agents that ignore this file produce incorrect output.

---

## 1. Product North Star

Nezam Design Server — Ultimate UI Suite is a local SPA developer tool that helps frontend engineers and creative directors visually edit design tokens, compose page architecture on an infinity canvas, scrub motion timelines, and inspect CSS properties — all inside a single obsidian-dark shell. It differs from tools like Figma or Framer by being entirely workspace-local (no cloud, no accounts) and operating as a direct link between `DESIGN.md` spec files and live Next.js CSS output. Built for the Egyptian & global developer market. Primary language: English (with RTL/Arabic preview support). Stack: Next.js 15 App Router + Zustand + Zod + Tailwind CSS. Repo: iDorgham/Nezam.

---

## 2. Project Identity

| Field | Value |
|---|---|
| Product Name | Nezam Design Server · Ultimate UI Suite |
| GitHub Repo | iDorgham/Nezam |
| Design Server Path | `.nezam/design-server/` |
| Primary Language | English |
| RTL Support | Required — Arabic preview, logical properties throughout |
| Target Market | Egyptian & global developer/designer market |
| PRD File | `docs/plans/00-define/01-product/PRD.md` |
| Design Contract | `DESIGN.md` (repo root) |
| Canvas Spec | `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md` |

---

## 3. Tech Stack Contract

> These decisions are locked. Do not propose alternatives without a formal ADR.

### Frontend
- **Framework:** Next.js 15 App Router (`app/` directory)
- **Styling:** Tailwind CSS v4 + CSS custom properties (`ds-*` semantic token layer)
- **State management:** Zustand 5 (multiple stores — `session.store`, `tokens.store`, `canvas-graph.store`)
- **Schema validation:** Zod 3 — all state mutations validated at store boundary
- **Component library:** Custom `ds-*` component system (no external UI library dependency)
- **Forms:** React Hook Form + Zod resolvers
- **Animation:** Motion.dev (or Framer Motion) — all animations behind `prefers-reduced-motion` guard
- **Canvas rendering:** Phase 1 — CSS `transform: matrix()` affine transform. Phase 3 — WebGL (deferred)

### Backend (local Next.js API routes)
- **Runtime:** Node.js 24 LTS (local dev server)
- **API style:** REST — Next.js Route Handlers (`app/api/*/route.ts`)
- **File system:** Node.js `fs` module — writes to `.nezam/` and `.session/` directories
- **AI integration:** Anthropic SDK — `claude-haiku-4-5` for Vision Gate and node generation
- **Storage:** `localStorage` (client presets) + local filesystem (disk sync)

### TypeScript
- **Strict mode:** `strict: true` in tsconfig — no `any` without explicit justification
- **Path aliases:** `@/` maps to `.nezam/design-server/`

---

## 4. Data Architecture

### Stores (Zustand + Zod)

| Store | Path | Purpose |
|---|---|---|
| `useSessionStore` | `lib/store/session.store.ts` | Project context, sitemap pages, active tabs, lang/theme |
| `useTokensStore` | `lib/store/tokens.store.ts` | Design token values, profiles |
| `useCanvasGraphStore` | `src/store/canvas-graph.store.ts` | Canvas nodes, wires, viewport, generative pipeline |

### Entities

- **DesignPreset:** `{ id, name, colors, borderRadius, typography, isCustom, updatedAt }`
- **CanvasNode:** `{ id, type, title, route, x, y, width, height, rtlCompliant, wcagCompliant, generationStatus }`
- **CanvasWire:** `{ id, fromNodeId, toNodeId, type, contextPayload, attachments, annotativeDirectives }`
- **MotionTrack:** `{ id, componentId, property, keyframes, reducedMotionFallback }`
- **AssetItem:** `{ id, name, mimeType, optimizedUrl, altText, visionStatus }`

### Context Payload (LLM generation)

`ContextPayload` max size: **32,000 tokens**. Compression tiers:
1. Drop AST block prop details (keep type/name)
2. Drop `prd-note` attachments first, then `content-source`
3. Truncate directives to 3

---

## 5. Feature Index

| ID | Name | Priority | Spec |
|---|---|---|---|
| F-001 | Design Profile Persistence Layer | P0 | `docs/plans/00-define/specs/F-001-profile-persistence.md` |
| F-002 | UI CSS Sync Status Indicators | P0 | `docs/plans/00-define/specs/F-002-css-sync-status.md` |
| F-003 | Border Radius Custom Token Editors | P0 | `docs/plans/00-define/specs/F-003-border-radius.md` |
| F-004 | Typography Scale Visualizer Grid | P0 | `docs/plans/00-define/specs/F-004-typo-scale-preview.md` |
| F-005 | Infinity Canvas & Sitemap Graph Shell | P0 | `docs/plans/00-define/specs/F-005-infinity-canvas.md` |
| F-006 | Motion Studio — Timeline & Keyframe Tracker | P1 | `docs/plans/00-define/specs/F-006-motion-studio.md` |
| F-007 | Property Inspector — CSS Layer Panel | P0 | `docs/plans/00-define/specs/F-007-property-inspector.md` |
| F-008 | Asset Browser & Import Terminal | P1 | `docs/plans/00-define/specs/F-008-asset-browser.md` |

---

## 6. Decision Rules

When uncertain, prefer these:

1. **Token over primitive:** If a value can be expressed as a design token, it must be. No hardcoded hex, px, or rem in markup or component styles.

2. **Logical properties over directional:** `margin-inline-start` beats `margin-left` every time. Never write `left`, `right`, `ml-`, or `pr-` in component code.

3. **Zod parse at store boundary:** All state mutations go through Zod `.parse()`. Invalid input throws — never silently ignored.

4. **Reduced-motion first:** Before adding any animation, write the static state. The animated state is an enhancement, not the baseline.

5. **Local before AI:** Prefer local computation (token compilation, CSS generation) over LLM calls. LLM is only used for Vision Gate scanning and node generation.

6. **Fail visible:** Design gate failures (contrast, spacing, localization) must surface as visible UI errors — never silent fallbacks. Blocked operations show exactly why they are blocked.

7. **Phase 1 scope:** If a feature requires WebGL, Worker threads, or cloud storage — it is deferred. Build Phase 1 using CSS transforms, main-thread Zustand, and localStorage only.

---

## 7. UI/UX Contract

### Token Rules
- All colors from `ds-*` CSS custom property namespace
- Canvas-specific tokens use `dv-*` prefix
- No Tailwind color utilities (e.g. `bg-blue-500`) — use `bg-ds-*` or `bg-[var(--dv-*)]`
- Typography: every font-size uses `clamp()` — no fixed steps

### Navigation Rules
- Tab system managed by `useSessionStore` `tabs` array + `activeTabId`
- Opening a page in Wireframe Editor = `openTab({ id: pageId, type: 'wireframe', contentId: pageId })`
- No imperative router.push without updating tab store

### Form Rules
- All inputs: `bg-ds-surface border-ds-border` base styling
- Focus: `focus:border-ds-primary focus:outline-none`
- Error state: `border-ds-destructive` + inline error message below field
- Never disable submit until after first validation attempt

### Empty State Rules
- Every list/grid must have an explicit empty state component
- Empty state: centered, muted icon + primary text + optional CTA
- Canvas empty: centered "Add your first page" node prompt

### Canvas Interaction Rules
- Pan: mouse drag on canvas background (not nodes)
- Zoom: scroll wheel or pinch
- Node select: single click
- Wire: activate wiring mode (W key) → drag from port to port
- RTL mode: negate pan delta X, swap source/target port X positions

### Property Inspector Rules
- All property values shown in logical property form (even if underlying CSS differs)
- Never show `margin-left` — always `margin-inline-start`
- Token label shown alongside raw value: `24px (space.lg)`

---

## 8. API Contract

### Error Format (all routes)

```json
{ "error": "<human-readable message>", "code": "<SNAKE_CASE_CODE>", "field"?: "<field name>" }
```

### Auth

None — design server is local-only. No authentication layer in v1.

### Canvas generation hardlock order

1. Vision Gate — all wire attachments must be `visionStatus: 'valid'`
2. RTL parity — source node `rtlCompliant: true`
3. WCAG AA — source node `wcagCompliant: true`
4. Context compression — payload ≤ 32,000 tokens
5. LLM call — only after all 4 above pass

### AI response shape

```json
{
  "blocks": [{ "type": "string", "name": "string", "props": {} }],
  "spec": "<COMPONENT_SPEC.md content string>"
}
```

---

## 9. Acceptance Criteria Summary (P0 Features)

| Feature | Definition of Done |
|---|---|
| F-001 | User saves preset by name; reload page; preset loads from storage |
| F-002 | "CSS Synchronized" pill visible within 50ms of token edit |
| F-003 | Border-radius slider updates all component previews live |
| F-004 | Typography scale grid shows clamp() formula + live text at each step |
| F-005 | Canvas renders 50 nodes at 60fps; bezier wires animate; RTL mode mirrors correctly |
| F-007 | Inspector shows logical property values; hardcoded directional values blocked |

---

## 10. Forbidden Patterns

These are code review blocking issues — never merge:

```
❌ Any hardcoded hex value in JSX/TSX: bg-[#5e6ad2], style={{color:'#fff'}}
❌ margin-left / margin-right / padding-left / padding-right in any component
❌ text-left / text-right Tailwind classes
❌ Any <text> element inside SVG placeholder art
❌ Animation without prefers-reduced-motion guard
❌ Direct DOM manipulation bypassing Zustand store
❌ fetch() calls to external URLs from canvas-graph.store (use API routes)
❌ Zod schema mutations without .parse() validation
❌ console.log in production code (use addLog from session.store)
```

---

## 11. File & Folder Conventions

```
.nezam/design-server/
├── app/                    ← Next.js App Router pages & API routes
│   ├── api/
│   │   ├── ai/
│   │   │   ├── vision-gate/route.ts
│   │   │   └── generate-node/route.ts
│   │   ├── presets/        ← save, list, sync-to-disk
│   │   ├── canvas/         ← node + wire CRUD
│   │   └── assets/         ← upload + optimize
│   └── (pages)/
├── components/
│   ├── canvas/             ← CanvasWorkspace, CanvasNode, CanvasWire
│   ├── motion/             ← MotionStudio, TimelineRuler, KeyframeDiamond
│   ├── inspector/          ← PropertyInspector tabs
│   ├── assets/             ← AssetBrowser, DropZone
│   └── wireframe/          ← PropsEditorPanel, WireframePageEditor
├── lib/
│   ├── store/              ← session.store, tokens.store
│   └── parsers/
└── src/
    └── store/              ← canvas-graph.store (SPEC-DS-CANVAS-001)
```
