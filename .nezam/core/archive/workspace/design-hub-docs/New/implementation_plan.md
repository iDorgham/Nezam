# Refined Template Builder UI and Flat shadow system

Improve the NEZAM Design Server by modernizing the design aesthetics (flat shadow system) and completely rewriting the Template Builder into a high-end, dual-pane interactive visual editor. 

## Goal Description
1. **Flatter Premium Aesthetic (Less Shadows)**: Update the design server's global shadow variables to match high-end modern layout standards—replacing dark heavy shadow casting with extremely soft, flat elevation layers that emphasize borders and container queries.
2. **Refined Dual-Pane Editor**: Transform the Template Builder from a cluttered single-column vertical list into a professional **split-screen interactive studio**:
   - **Left Control Panel (40% width)**: Structured, highly refined configuration controls (Tabs & collapsible Accordions) utilizing clean, border-first elements without heavy drop shadows.
   - **Right Live Studio (60% width)**: Real-time visual canvas simulating the generated sitemap header, hero section, interactive forms, and footer based on the active config selections.
3. **Painless Copy-Paste Installation**: Add a developer-oriented "Code Installer" utility. It will generate fully completed, production-ready React + Tailwind components matching the selected configurations, allowing developers to import, copy, and install the layout in their own project instantly.
4. **Modularity**: Extract settings and preview layers into single-responsibility React sub-components under a dedicated `components/template-builder/` directory, keeping the main page code extremely simple, clean, and clean to extend.

---

## Proposed Changes

### 1. Global Elevation System
#### [MODIFY] [globals.css](file:///Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server/app/globals.css)
- Reduce shadows to a flat, modern, minimalist standard by adjusting the `--ds-elevation-*` variables in both light and dark modes.
- Replace heavy casting colors (`rgba(0, 0, 0, 0.32–0.65)`) with highly transparent, subtle boundaries (`rgba(0, 0, 0, 0.02–0.12)`).

---

### 2. Modularity & Installation Directory (`components/template-builder/`)

We will introduce a modular set of components that splits the template builder logic into atomic pieces. This ensures that the system is extremely easy to maintain and copy-paste into other sites:

#### [NEW] [ProfileSelector.tsx](file:///Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server/components/template-builder/ProfileSelector.tsx)
- Implements the Base Profile grid with beautiful flat cards, current theme snapshots, and seamless pagination for design profiles.

#### [NEW] [HeaderSettings.tsx](file:///Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server/components/template-builder/HeaderSettings.tsx)
- Manages the main menu mode (top bar/sidebar), logo and menu positions (left/center/right), and toggles for active header extras (CTA, social links, contact number).

#### [NEW] [FooterSettings.tsx](file:///Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server/components/template-builder/FooterSettings.tsx)
- Manages the simple vs. big footer formats, number of navigation columns (3 to 5), and footer extra items (social icons, contact details).

#### [NEW] [LivePreview.tsx](file:///Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server/components/template-builder/LivePreview.tsx)
- The visual star of the builder! Renders a fully functioning, beautiful mock dashboard page showing the exact header, hero banner, interactive form style, and footer chosen.
- Fully supports dark/light mode parity and real-time Arabic (RTL) vs English (LTR) rendering transitions.

#### [NEW] [CodeInstaller.tsx](file:///Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server/components/template-builder/CodeInstaller.tsx)
- Generates copyable, highly clean production-ready React component code (Tailwind CSS) representing the selected layout.
- Provides simple tabs to copy **"Header Component"**, **"Footer Component"**, or **"Page Layout"** instantly.

---

### 3. Page Orchestrator
#### [MODIFY] [page.tsx](file:///Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server/app/template-builder/page.tsx)
- Clean up the main entry file by replacing the monolithic page structure with imports from the newly created modular sub-components.
- Orchestrate the page structure as a gorgeous split-screen visual designer: Controls on the Left, Live Studio/Installer on the Right.

---

## Verification Plan

### Automated Tests
- Validate that the Next.js server compiles correctly:
  ```bash
  cd .nezam/design-server && pnpm build
  ```
- Run linter to ensure no code formatting issues.

### Manual Verification
- Deploy and interact with the new **Template Builder UI**.
- Verify that changing options (e.g. Simple vs Mega menu, 3 columns vs 4, compact vs spacious padding) instantly updates the right-side Live Preview.
- Toggle language between Arabic and English, verifying perfect RTL/LTR transitions.
- Click the **"Code Installer"** tab, verify that copyable production component code is rendered, and test the copy-to-clipboard actions.
- Confirm all shadows are soft and minimal in dark/light modes.
