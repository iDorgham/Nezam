# NEZAM Wireframe Server: Architectural Blueprint

To achieve a **Professional, Enterprise-Grade Visual Wireframe Server** with a massive library of components, we need an architecture that is highly scalable and deeply integrated into the NEZAM SDD JSON workflow. 

Instead of building a drag-and-drop math engine from scratch, we will leverage a powerful React-based visual editor engine and inject our massive component libraries into it.

## 1. The Core Engine: `Puck` or `Craft.js`
We will use **Puck** (or **Craft.js**) as the underlying engine. 
* **Why?** Both are open-source React visual builders explicitly designed to output structured JSON trees rather than messy HTML. 
* **How it fits:** When the agent generates `wireframes_draft.json`, the engine parses it directly into a visual drag-and-drop canvas. When you click "Save", the engine serializes the canvas back into `wireframes_locked.json`.

## 1.5 The JSON Data Flow Contract (Agent ↔ Server)
The absolute core of this architecture is the two-way JSON communication between the AI Agents and this visual server:
1. **Agent Output (The Input):** Before the server is even booted, the Planning Agent analyzes your PRD and generates a highly structured `project_context.json` and `wireframes_draft.json`. The server *reads* this to instantly know your project name, required pages, and initial AI component selections.
2. **User Interaction (The Server):** The server boots up *using* that JSON as its database. You visually edit, choose, or create new wireframes.
3. **Server Output (The Export):** When you are done, the server exports a pristine `wireframes_locked.json`. This file is not raw HTML; it is a strict object (e.g., `{"type": "Hero_Split", "props": {"headline": "Welcome"}}`). 
4. **Agent Consumption:** The Developer Agent reads the exported JSON and knows *exactly* which React components to render and what props to pass to them, eliminating all guesswork.

## 2. The Local Server Environment
The wireframe server will run as a standalone Next.js or Vite application strictly for local development.
* **Boot Command:** `pnpm run nezam:wireframe`
* **Backend:** A lightweight local API route (`/api/sync`) that reads/writes directly to your local file system (`docs/plans/04-design/wireframes_locked.json`).
* **Frontend:** A beautiful dark-mode canvas resembling Webflow or Framer, running on `localhost:4000`.

## 3. Multi-Platform Canvas & The "Huge Library" Architecture
To provide a massive, professional library immediately, the server will utilize **Canvas Contexts**. You aren't just building websites; you can toggle the entire editor environment based on the product type.

### The Four Canvas Modes:
1. **Websites & Marketing:** Standard ultra-wide canvas for landing pages and blogs.
2. **SaaS & Dashboards:** Viewports locked to app shells, with sidebars, data tables, and modal overlays.
3. **Mobile Apps:** Canvas restricted to mobile device frames (iOS/Android) with safe-area overlays. The component library swaps to mobile primitives (Tab bars, stack navigators, bottom sheets).
4. **TUI (Terminal User Interface):** A specialized monospaced, grid-locked canvas. Components are rendered as ASCII/ANSI boxes, text menus, and CLI progress bars. 

### Categorized Block Registry (Per Platform):
* **Web/SaaS Blocks:** `Nav_MegaMenu`, `Hero_Split`, `Pricing_Tiers`, `Dashboard_Sidebar`, `Data_Table`.
* **Mobile Blocks:** `BottomTabBar`, `Mobile_Header`, `Swipeable_List`, `Card_Carousel`.
* **TUI Blocks:** `CLI_Window`, `ASCII_Table`, `Terminal_Prompt`, `Log_Viewer`.

### Integrated Free-Drawing Tool (`tldraw` / `excalidraw`)
Sometimes structured drag-and-drop isn't enough. The server will feature a **"Sketch Mode"** tab embedding a native whiteboard (like `tldraw`).
* You can freehand draw arrows, annotate layouts, or sketch custom bespoke components.
* **The Magic:** Your freehand vectors are serialized into SVG strings and saved directly inside the exported `wireframes_locked.json` alongside the structured components, giving the AI total context of your custom ideas.

## 4. Visual Sitemap & Menu Builder
A great product needs strong Information Architecture (IA). Before diving into screen design, you can switch to the **"Sitemap Builder"** tab.
* **Node-Based UI:** Visually map out your entire app's hierarchy using an interactive tree or node graph (similar to Miro or FigJam).
* **Menu Generator:** Drag pages under other pages to define Parent-Child relationships. This automatically generates the data structure for your `Nav_MegaMenu` and Sidebar links.
* **The Magic:** The hierarchy you build here is saved into `sitemap_locked.json`. The AI Planning Agent reads this to instantly scaffold the correct folder routes (e.g., `src/app/dashboard/settings/page.tsx`) and hardcode your navigation links flawlessly.

## 5. Global Design System & Layout Builder
We won't just offer drag-and-drop blocks; the server will feature a **Global Theme & Layout Configurator** in the sidebar. This gives you god-level control over the design system:

* **Website & Page Types:** Select predefined architectural structures. Choose a Website Type (e.g., E-commerce, SaaS, Portfolio, Fintech) and a Page Type (Landing, Checkout, Article). The engine will automatically recommend specific component libraries.
* **Grid Systems & Grid Types:** Control the mathematical backbone of your layout. Choose between a classic 12-Column Grid, Flexbox Layouts, Masonry Grids, or Asymmetric CSS Grids. You can visually toggle grid overlays on the canvas.
* **Typography Style Builder:** Don't just use default text. Select Google Fonts or custom font pairings. Set your Base Font Size and visually adjust the Heading Scale (e.g., Major Third, Perfect Fourth) which calculates `h1` through `h6` automatically.
* **Spacing Adjustments:** Visually tweak the mathematical spacing scale. Adjust the baseline grid multiplier (e.g., 4px or 8px baseline) to instantly expand or compress padding and margins across the entire website.
* **Website Style Builder (Colors & Borders):** Select global Color Profiles (e.g., *SaaS Minimalist*, *Egyptian Fintech*). Control border radiuses (sharp, rounded, pill) and shadow depths globally.
* **The Magic:** Everything—your typography scales, spacing multipliers, 12-column grid preferences, and color profiles—is saved into the `wireframes_locked.json` as a "Design Tokens" object. The AI Developer agent reads this and automatically perfectly configures your `tailwind.config.ts` and `globals.css`!

## 6. The Workflow (Advanced HitL & Creation Loop)
The server acts as a full internal mini-SaaS for your wireframing, not just a simple previewer.

1. **The Dashboard (Wireframe Manager):** When you boot the server (`pnpm run nezam:wireframe`), you land on a dashboard listing all project pages. You can see which are "AI Drafts", which are "Locked", and you have a massive button to **"Create New Blank Wireframe"**.
2. **AI-Assisted Mode:** You open an AI-generated `wireframes_draft.json`. You can completely tear it apart, rearrange sections, and deeply edit properties (e.g., changing headlines, toggling feature icons on/off) via the right-hand properties sidebar.
3. **Blank Canvas Mode (Create New):** You start from scratch. You drag a `Nav_Standard`, drop a `Hero_Split`, and assemble your layout manually using the Huge Library panel.
4. **Export & Handoff:** Whether edited from a draft or built from scratch, clicking "Save" writes the final layout to `wireframes_locked.json`. The AI developer agents blindly trust this locked file as the absolute source of truth to write the Next.js code.

---
**Next Step:** To make this a reality, we need to bootstrap the standalone `apps/wireframe-server` inside your workspace and install the visual engine (Puck). Shall we begin scaffolding the local server?
