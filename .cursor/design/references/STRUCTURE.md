---
title: Design References — Folder & File Structure
path: .cursor/design/references/
generated: 2026-05-29
---

# Design references — structure index

Local vendored design libraries, skills, UI kits, and tooling used by NEZAM Design Hub and `.cursor/skills/design/design-intelligence-index`.

> **Note:** `.git/` and `node_modules/` are excluded from counts and trees below.

## Block pattern sources (Design Hub palette)

Reference kits mined for net-new block types and migration patterns (paths only; no vendored copy in app code).

| Block type | Category | Primary reference |
|------------|----------|-------------------|
| `Content_PricingToggle` | content | `ShadcnVaults-main/` — pricing tiers + billing toggle |
| `Content_FeatureBento` | content | `ShadcnVaults-main/`, `tail-kit-main/` — asymmetric feature grids |
| `Hero_GradientMesh` | hero | `tail-kit-main/` — mesh-style hero backgrounds (token `color-mix` only) |
| `Form_SplitAuth` | forms | `shadcn-studio-main/` — split-panel auth layouts |
| `Art_Section_Marquee` | artistic | `awesome-shadcn-ui-main/` — horizontal logo/quote strips |

Registry: `.nezam/templates/wireframe-server/block_registry.json` (77 types). Renderers: `.nezam/design-hub/src/components/preview/`.

## Summary

| Package | Files | Directories | Total entries |
|---------|------:|------------:|--------------:|
| `BMAD-METHOD-main/` | 560 | 151 | 711 |
| `Framely-main/` | 87 | 26 | 113 |
| `ShadcnVaults-main/` | 169 | 31 | 200 |
| `Silex-main/` | 27 | 30 | 57 |
| `VvvebJs-master/` | 458 | 86 | 544 |
| `awesome-design-md-main/` | 147 | 74 | 221 |
| `awesome-design-skills-main/` | 137 | 68 | 205 |
| `awesome-shadcn-ui-main/` | 147 | 24 | 171 |
| `builder-main/` | 3885 | 1207 | 5092 |
| `chadnext-main/` | 187 | 53 | 240 |
| `impeccable-main/` | 1691 | 461 | 2152 |
| `masri-design-assets/` | 1 | 0 | 1 |
| `next-shadcn-admin-dashboard-main/` | 235 | 74 | 309 |
| `next-shadcn-dashboard-starter-main/` | 598 | 149 | 747 |
| `open-design-main/` | 4793 | 1321 | 6114 |
| `react-starter-kit-main/` | 341 | 95 | 436 |
| `ruflo-main/` | 4504 | 1405 | 5909 |
| `shadcn-admin-main/` | 272 | 68 | 340 |
| `shadcn-studio-main/` | 1645 | 182 | 1827 |
| `sketch-plugin-master/` | 275 | 44 | 319 |
| `skills-main/` | 394 | 85 | 479 |
| `tail-kit-main/` | 361 | 106 | 467 |
| `tailwindcss-main/` | 540 | 111 | 651 |
| `taste-skill-main/` | 39 | 22 | 61 |
| `tremor-npm-main/` | 331 | 93 | 424 |
| `typeui-main/` | 43 | 12 | 55 |
| **TOTAL** | **21867** | **5978** | **27845** |

## Complete file listing

Every file path (flat list): [`STRUCTURE.full.txt`](./STRUCTURE.full.txt)

## Top-level layout

```
BMAD-METHOD-main/
Framely-main/
ShadcnVaults-main/
Silex-main/
VvvebJs-master/
awesome-design-md-main/
awesome-design-skills-main/
awesome-shadcn-ui-main/
builder-main/
chadnext-main/
impeccable-main/
masri-design-assets/
next-shadcn-admin-dashboard-main/
next-shadcn-dashboard-starter-main/
open-design-main/
react-starter-kit-main/
ruflo-main/
shadcn-admin-main/
shadcn-studio-main/
sketch-plugin-master/
skills-main/
tail-kit-main/
tailwindcss-main/
taste-skill-main/
tremor-npm-main/
typeui-main/
```

## `BMAD-METHOD-main/`

- **Files:** 560 · **Directories:** 151
- **Entry:** `README.md`

```
BMAD-METHOD-main/
├── .augment/
    └── code_review_guidelines.yaml
├── .claude-plugin/
    └── marketplace.json
├── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug-report.yaml
    │   ├── config.yaml
    │   ├── documentation.yaml
    │   ├── feature-request.md
    │   └── issue.md
    ├── scripts/
    │   └── discord-helpers.sh
    ├── workflows/
    │   ├── coderabbit-review.yaml
    │   ├── discord.yaml
    │   ├── docs.yaml
    │   ├── publish.yaml
    │   └── quality.yaml
    ├── CODE_OF_CONDUCT.md
    ├── FUNDING.yaml
    └── PULL_REQUEST_TEMPLATE.md
├── .husky/
    └── pre-commit
├── .vscode/
    └── settings.json
├── docs/
    ├── cs/
    │   ├── explanation/
    │   │   ├── advanced-elicitation.md
    │   │   ├── adversarial-review.md
    │   │   ├── analysis-phase.md
    │   │   ├── brainstorming.md
    │   │   ├── established-projects-faq.md
    │   │   ├── party-mode.md
    │   │   ├── preventing-agent-conflicts.md
    │   │   ├── project-context.md
    │   │   ├── quick-dev.md
    │   │   └── why-solutioning-matters.md
    │   ├── how-to/
    │   │   ├── customize-bmad.md
    │   │   ├── established-projects.md
    │   │   ├── get-answers-about-bmad.md
    │   │   ├── install-bmad.md
    │   │   ├── non-interactive-installation.md
    │   │   ├── project-context.md
    │   │   ├── quick-fixes.md
    │   │   ├── shard-large-documents.md
    │   │   └── upgrade-to-v6.md
    │   ├── reference/
    │   │   ├── agents.md
    │   │   ├── commands.md
    │   │   ├── core-tools.md
    │   │   ├── modules.md
    │   │   ├── testing.md
    │   │   └── workflow-map.md
    │   ├── tutorials/
    │   │   └── getting-started.md
    │   ├── 404.md
    │   ├── _STYLE_GUIDE.md
    │   ├── index.md
    │   └── roadmap.mdx
    ├── explanation/
    │   ├── advanced-elicitation.md
    │   ├── adversarial-review.md
    │   ├── analysis-phase.md
    │   ├── brainstorming.md
    │   ├── checkpoint-preview.md
    │   ├── established-projects-faq.md
    │   ├── forensic-investigation.md
    │   ├── named-agents.md
    │   ├── party-mode.md
    │   ├── preventing-agent-conflicts.md
    │   ├── project-context.md
    │   ├── quick-dev.md
    │   ├── web-bundles.md
    │   └── why-solutioning-matters.md
    ├── fr/
    │   ├── explanation/
    │   │   ├── advanced-elicitation.md
    │   │   ├── adversarial-review.md
    │   │   ├── analysis-phase.md
    │   │   ├── brainstorming.md
    │   │   ├── checkpoint-preview.md
    │   │   ├── established-projects-faq.md
    │   │   ├── forensic-investigation.md
    │   │   ├── party-mode.md
    │   │   ├── preventing-agent-conflicts.md
    │   │   ├── project-context.md
    │   │   ├── quick-dev.md
    │   │   └── why-solutioning-matters.md
    │   ├── how-to/
    │   │   ├── customize-bmad.md
    │   │   ├── established-projects.md
    │   │   ├── get-answers-about-bmad.md
    │   │   ├── install-bmad.md
    │   │   ├── non-interactive-installation.md
    │   │   ├── project-context.md
    │   │   ├── quick-fixes.md
    │   │   ├── shard-large-documents.md
    │   │   └── upgrade-to-v6.md
    │   ├── reference/
    │   │   ├── agents.md
    │   │   ├── commands.md
    │   │   ├── core-tools.md
    │   │   ├── modules.md
    │   │   ├── testing.md
    │   │   └── workflow-map.md
    │   ├── tutorials/
    │   │   └── getting-started.md
    │   ├── 404.md
    │   ├── _STYLE_GUIDE.md
    │   ├── index.md
    │   └── roadmap.mdx
    ├── how-to/
    │   ├── customize-bmad.md
    │   ├── established-projects.md
    │   ├── expand-bmad-for-your-org.md
    │   ├── get-answers-about-bmad.md
    │   ├── install-bmad.md
    │   ├── install-custom-modules.md
    │   ├── non-interactive-installation.md
    │   ├── project-context.md
    │   ├── quick-fixes.md
    │   ├── shard-large-documents.md
    │   ├── upgrade-to-v6.md
    │   └── use-web-bundles.md
    ├── reference/
    │   ├── agents.md
    │   ├── commands.md
    │   ├── core-tools.md
    │   ├── modules.md
    │   ├── testing.md
    │   └── workflow-map.md
    ├── tutorials/
    │   └── getting-started.md
    ├── vi-vn/
    │   ├── explanation/
    │   │   ├── advanced-elicitation.md
    │   │   ├── adversarial-review.md
    │   │   ├── analysis-phase.md
    │   │   ├── brainstorming.md
    │   │   ├── checkpoint-preview.md
    │   │   ├── established-projects-faq.md
    │   │   ├── named-agents.md
    │   │   ├── party-mode.md
    │   │   ├── preventing-agent-conflicts.md
    │   │   ├── project-context.md
    │   │   ├── quick-dev.md
    │   │   └── why-solutioning-matters.md
    │   ├── how-to/
    │   │   ├── customize-bmad.md
    │   │   ├── established-projects.md
    │   │   ├── expand-bmad-for-your-org.md
    │   │   ├── get-answers-about-bmad.md
    │   │   ├── install-bmad.md
    │   │   ├── install-custom-modules.md
    │   │   ├── non-interactive-installation.md
    │   │   ├── project-context.md
    │   │   ├── quick-fixes.md
    │   │   ├── shard-large-documents.md
    │   │   └── upgrade-to-v6.md
    │   ├── reference/
    │   │   ├── agents.md
    │   │   ├── commands.md
    │   │   ├── core-tools.md
    │   │   ├── modules.md
    │   │   ├── testing.md
    │   │   └── workflow-map.md
    │   ├── tutorials/
    │   │   └── getting-started.md
    │   ├── 404.md
    │   ├── _STYLE_GUIDE.md
    │   ├── bmad-developer-guide.md
    │   ├── index.md
    │   └── roadmap.mdx
    ├── zh-cn/
    │   ├── explanation/
    │   │   ├── advanced-elicitation.md
    │   │   ├── adversarial-review.md
    │   │   ├── analysis-phase.md
    │   │   ├── brainstorming.md
    │   │   ├── checkpoint-preview.md
    │   │   ├── established-projects-faq.md
    │   │   ├── named-agents.md
    │   │   ├── party-mode.md
    │   │   ├── preventing-agent-conflicts.md
    │   │   ├── project-context.md
    │   │   ├── quick-dev.md
    │   │   └── why-solutioning-matters.md
    │   ├── how-to/
    │   │   ├── customize-bmad.md
    │   │   ├── established-projects.md
    │   │   ├── expand-bmad-for-your-org.md
    │   │   ├── get-answers-about-bmad.md
    │   │   ├── install-bmad.md
    │   │   ├── install-custom-modules.md
    │   │   ├── non-interactive-installation.md
    │   │   ├── project-context.md
    │   │   ├── quick-fixes.md
    │   │   ├── shard-large-documents.md
    │   │   └── upgrade-to-v6.md
    │   ├── reference/
    │   │   ├── agents.md
    │   │   ├── commands.md
    │   │   ├── core-tools.md
    │   │   ├── modules.md
    │   │   ├── testing.md
    │   │   └── workflow-map.md
    │   ├── tutorials/
    │   │   └── getting-started.md
    │   ├── 404.md
    │   ├── _STYLE_GUIDE.md
    │   ├── index.md
    │   └── roadmap.mdx
    ├── 404.md
    ├── _STYLE_GUIDE.md
    ├── index.md
    └── roadmap.mdx
├── evals/
    └── bmm-skills/
    │   └── bmad-product-brief/
    │       ├── evals.json
    │       └── triggers.json
├── src/
    ├── bmm-skills/
    │   ├── module-help.csv
    │   └── module.yaml
    ├── core-skills/
    │   ├── bmad-advanced-elicitation/
    │   │   ├── SKILL.md
    │   │   └── methods.csv
    │   ├── bmad-brainstorming/
    │   │   ├── SKILL.md
    │   │   ├── brain-methods.csv
    │   │   ├── template.md
    │   │   └── workflow.md
    │   ├── bmad-customize/
    │   │   └── SKILL.md
    │   ├── bmad-editorial-review-prose/
    │   │   └── SKILL.md
    │   ├── bmad-editorial-review-structure/
    │   │   └── SKILL.md
    │   ├── bmad-help/
    │   │   └── SKILL.md
    │   ├── bmad-index-docs/
    │   │   └── SKILL.md
    │   ├── bmad-party-mode/
    │   │   └── SKILL.md
    │   ├── bmad-review-adversarial-general/
    │   │   └── SKILL.md
    │   ├── bmad-review-edge-case-hunter/
    │   │   └── SKILL.md
    │   ├── bmad-shard-doc/
    │   │   └── SKILL.md
    │   ├── bmad-spec/
    │   │   ├── SKILL.md
    │   │   └── customize.toml
    │   ├── module-help.csv
    │   └── module.yaml
    └── scripts/
    │   ├── tests/
    │       └── test_resolve_customization.py
    │   ├── resolve_config.py
    │   └── resolve_customization.py
├── test/
    ├── adversarial-review-tests/
    │   ├── README.md
    │   ├── sample-content.md
    │   └── test-cases.yaml
    ├── README.md
    ├── test-file-refs-csv.js
    ├── test-installation-components.js
    ├── test-installer-channels.js
    ├── test-parse-source-urls.js
    ├── test-rehype-plugins.mjs
    └── test-workflow-path-regex.js
├── tools/
    ├── docs/
    │   ├── _prompt-external-modules-page.md
    │   ├── fix-refs.md
    │   └── native-skills-migration-checklist.md
    ├── installer/
    │   ├── commands/
    │   │   ├── install.js
    │   │   ├── status.js
    │   │   └── uninstall.js
    │   ├── core/
    │   │   ├── config.js
    │   │   ├── existing-install.js
    │   │   ├── install-paths.js
    │   │   ├── installer.js
    │   │   ├── legacy-warnings.js
    │   │   ├── manifest-generator.js
    │   │   └── manifest.js
    │   ├── ide/
    │   │   ├── _config-driven.js
    │   │   ├── manager.js
    │   │   ├── platform-codes.js
    │   │   └── platform-codes.yaml
    │   ├── modules/
    │   │   ├── channel-plan.js
    │   │   ├── channel-resolver.js
    │   │   ├── custom-module-manager.js
    │   │   ├── external-manager.js
    │   │   ├── module-help-schema.js
    │   │   ├── official-modules.js
    │   │   ├── plugin-resolver.js
    │   │   └── version-resolver.js
    │   ├── README.md
    │   ├── bmad-cli.js
    │   ├── cli-utils.js
    │   ├── file-ops.js
    │   ├── fs-native.js
    │   ├── install-messages.yaml
    │   ├── list-options.js
    │   ├── message-loader.js
    │   ├── project-root.js
    │   ├── prompts.js
    │   ├── set-overrides.js
    │   ├── ui.js
    │   └── yaml-format.js
    ├── build-docs.mjs
    ├── bundle-web-bundles.js
    ├── fix-doc-links.js
    ├── format-workflow-md.js
    ├── javascript-conventions.md
    ├── migrate-custom-module-paths.js
    ├── skill-validator.md
    ├── validate-doc-links.js
    ├── validate-file-refs.js
    ├── validate-sidebar-order.js
    ├── validate-skills.js
    └── validate-svg-changes.sh
├── web-bundles/
    ├── brainstorming-coach/
    │   ├── INSTRUCTIONS.md
    │   ├── SKILL.md
    │   └── brain-methods.csv
    ├── market-and-industry-research/
    │   ├── INSTRUCTIONS.md
    │   └── SKILL.md
    ├── prd-coach/
    │   ├── INSTRUCTIONS.md
    │   ├── SKILL.md
    │   ├── prd-template.md
    │   └── prd-validation-checklist.md
    ├── prfaq-coach/
    │   ├── INSTRUCTIONS.md
    │   └── SKILL.md
    ├── product-brief-coach/
    │   ├── INSTRUCTIONS.md
    │   └── SKILL.md
    ├── ux-coach/
    │   ├── INSTRUCTIONS.md
    │   ├── SKILL.md
    │   └── ux-validation.md
    ├── README.md
    └── bundles.json
├── website/
    ├── public/
    │   ├── diagrams/
    │   │   ├── checkpoint-preview-diagram-fr.webp
    │   │   ├── checkpoint-preview-diagram.png
    │   │   ├── quick-dev-diagram-fr.webp
    │   │   └── quick-dev-diagram.png
    │   ├── img/
    │   │   ├── bmad-dark.png
    │   │   └── bmad-light.png
    │   ├── favicon.ico
    │   ├── workflow-map-diagram-fr.html
    │   └── workflow-map-diagram.html
    ├── src/
    │   ├── components/
    │   │   ├── Banner.astro
    │   │   ├── Header.astro
    │   │   └── MobileMenuFooter.astro
    │   ├── content/
    │   │   └── config.ts
    │   ├── lib/
    │   │   ├── locales.mjs
    │   │   └── site-url.mjs
    │   ├── pages/
    │   │   ├── 404.astro
    │   │   └── robots.txt.ts
    │   ├── styles/
    │   │   └── custom.css
    │   ├── rehype-base-paths.js
    │   └── rehype-markdown-links.js
    ├── README.md
    └── astro.config.mjs
├── .coderabbit.yaml
├── .gitignore
├── .markdownlint-cli2.yaml
├── .npmignore
├── .npmrc
├── .nvmrc
├── .prettierignore
├── AGENTS.md
├── CHANGELOG.md
├── CNAME
├── CONTRIBUTING.md
├── CONTRIBUTORS.md
├── LICENSE
├── README.md
├── README_CN.md
├── README_VN.md
├── SECURITY.md
├── TRADEMARK.md
├── Wordmark.png
├── banner-bmad-method.png
├── bmad-modules.yaml
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── prettier.config.mjs
└── removals.txt
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `Framely-main/`

- **Files:** 87 · **Directories:** 26
- **Entry:** `README.md`

```
Framely-main/
├── prisma/
    └── schema.prisma
├── public/
    ├── demo.gif
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── thumbnail.png
    ├── vercel.svg
    └── window.svg
├── src/
    ├── app/
    │   ├── [domain]/
    │   │   ├── not-found.tsx
    │   │   └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── providers/
    │   │   ├── editor-actions.tsx
    │   │   └── editor-provider.tsx
    │   ├── globals.css
    │   ├── icon.png
    │   └── layout.tsx
    ├── components/
    │   └── ui/
    │   │   ├── accordion.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── color-picker.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── popover.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   └── tooltip.tsx
    ├── hooks/
    │   └── use-mobile.tsx
    ├── lib/
    │   ├── actions/
    │   │   └── page.ts
    │   ├── validations/
    │   │   └── page.ts
    │   ├── constants.ts
    │   ├── db.ts
    │   ├── forward-ref.tsx
    │   ├── getLink.ts
    │   ├── theme-provider.tsx
    │   └── utils.ts
    └── middleware.ts
├── .env.example
├── .gitignore
├── DEVELOPER.md
├── LICENSE
├── README.md
├── bun.lockb
├── components.json
├── docker-compose.yaml
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `ShadcnVaults-main/`

- **Files:** 169 · **Directories:** 31
- **Entry:** `README.md`

```
ShadcnVaults-main/
├── .vscode/
    └── settings.json
├── public/
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── og-image.png
    ├── vercel.svg
    └── window.svg
├── src/
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── homepage/
    │   │   └── hero-section.tsx
    │   ├── layout/
    │   │   ├── block-buttons.tsx
    │   │   ├── blocks-section.tsx
    │   │   ├── header.tsx
    │   │   ├── sidebar-layout.tsx
    │   │   └── sidebar.tsx
    │   ├── ui/
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── morphing-dialog.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── project-video.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   └── tooltip.tsx
    │   ├── block-component-not-found.tsx
    │   ├── block-details-client.tsx
    │   ├── codeblock.tsx
    │   ├── command-palette-navigation.tsx
    │   ├── copy.tsx
    │   ├── dots-background.tsx
    │   ├── license.tsx
    │   ├── responsive-preview.tsx
    │   ├── theme-provider.tsx
    │   └── theme-toggle.tsx
    ├── hooks/
    │   ├── use-click-outside.tsx
    │   └── use-mobile.ts
    └── lib/
    │   ├── block-utils.ts
    │   ├── getBaseURL.ts
    │   ├── icons_data.tsx
    │   ├── static-block-data.ts
    │   └── utils.ts
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── LICENSE.components
├── README.md
├── RESPONSIVE_PREVIEW_GUIDE.md
├── components.json
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `Silex-main/`

- **Files:** 27 · **Directories:** 30
- **Entry:** `README.md`

```
Silex-main/
├── .github/
    └── workflows/
    │   └── release.yml
├── .husky/
    └── pre-commit
├── scripts/
    ├── build-packages.js
    ├── check-internal-deps.js
    ├── ensure-yarn.js
    ├── exec.js
    ├── generate-changelog.sh
    ├── generate-contributors-doc.js
    ├── generate-submodules-doc.js
    ├── insert-in-readme.js
    ├── release.sh
    ├── sort-internal-deps.js
    └── update-colors.sh
├── .gitattributes
├── .gitignore
├── .gitmodules
├── .nvmrc
├── .prettierrc
├── AGENTS.md
├── CONTRIBUTING.md
├── Cargo.lock
├── Cargo.toml
├── LICENSE
├── README.md
├── package-lock.json
├── package.json
└── yarn.lock
```

## `VvvebJs-master/`

- **Files:** 458 · **Directories:** 86
- **Entry:** `README.md`

```
VvvebJs-master/
├── .github/
    ├── FUNDING.yml
    ├── lock.yml
    └── no-response.yml
├── css/
    ├── editor.css
    └── vvvebjs-editor-helpers.css
├── demo/
    ├── album/
    │   └── index.html
    ├── blog/
    │   ├── blog.css
    │   └── index.html
    ├── carousel/
    │   ├── carousel.css
    │   └── index.html
    ├── narrow-jumbotron/
    │   ├── index.html
    │   └── narrow-jumbotron.css
    ├── offcanvas/
    │   ├── index.html
    │   ├── offcanvas.css
    │   └── offcanvas.js
    ├── pricing/
    │   ├── index.html
    │   └── pricing.css
    └── product/
    │   ├── index.html
    │   └── product.css
├── fonts/
    ├── ionicons/
    │   ├── ionicons.svg
    │   ├── ionicons.ttf
    │   └── ionicons.woff
    └── line-awesome/
    │   ├── la-brands-400.eot
    │   ├── la-brands-400.svg
    │   ├── la-brands-400.ttf
    │   ├── la-brands-400.woff
    │   ├── la-brands-400.woff2
    │   ├── la-regular-400.eot
    │   ├── la-regular-400.svg
    │   ├── la-regular-400.ttf
    │   ├── la-regular-400.woff
    │   ├── la-regular-400.woff2
    │   ├── la-solid-900.eot
    │   ├── la-solid-900.svg
    │   ├── la-solid-900.ttf
    │   ├── la-solid-900.woff
    │   └── la-solid-900.woff2
├── img/
    └── logo.png
├── js/
    ├── bootstrap.min.js
    └── popper.min.js
├── libs/
    ├── aos/
    │   ├── aos.css
    │   └── aos.js
    ├── autocomplete/
    │   ├── autocomplete.gif
    │   └── autocomplete.js
    ├── bootstrap-colorpicker/
    │   ├── css/
    │   │   ├── bootstrap-colorpicker.min.css
    │   │   └── bootstrap-colorpicker.min.css.map
    │   └── js/
    │   │   ├── bootstrap-colorpicker.min.js
    │   │   └── bootstrap-colorpicker.min.js.map
    ├── builder/
    │   ├── icons/
    │   │   ├── accordion.svg
    │   │   ├── alert.svg
    │   │   ├── archives.svg
    │   │   ├── arrow-down.svg
    │   │   ├── arrow-right.svg
    │   │   ├── audio.svg
    │   │   ├── badge.svg
    │   │   ├── bell.svg
    │   │   ├── blockquote.svg
    │   │   ├── breadcrumbs.svg
    │   │   ├── button.svg
    │   │   ├── button_group.svg
    │   │   ├── button_toolbar.svg
    │   │   ├── calendar.svg
    │   │   ├── carousel.svg
    │   │   ├── cart.svg
    │   │   ├── categories.svg
    │   │   ├── chart.svg
    │   │   ├── checkbox.svg
    │   │   ├── checkout.svg
    │   │   ├── chevron-down.svg
    │   │   ├── chevron-right.svg
    │   │   ├── code.svg
    │   │   ├── container.svg
    │   │   ├── currency.svg
    │   │   ├── dots_three.svg
    │   │   ├── envelope.svg
    │   │   ├── facebook.svg
    │   │   ├── factory.svg
    │   │   ├── file-manager-layout.svg
    │   │   ├── file.svg
    │   │   ├── file_text.svg
    │   │   ├── filters.svg
    │   │   ├── flag.svg
    │   │   ├── flipbox.svg
    │   │   ├── folder.svg
    │   │   ├── form.svg
    │   │   ├── grid_column.svg
    │   │   ├── grid_row.svg
    │   │   ├── heading.svg
    │   │   ├── hr.svg
    │   │   ├── icon-list.svg
    │   │   ├── icon.svg
    │   │   ├── image-compare.svg
    │   │   ├── image.svg
    │   │   ├── images.svg
    │   │   ├── instagram.svg
    │   │   ├── jumbotron.svg
    │   │   ├── label.svg
    │   │   ├── left-column-layout.svg
    │   │   ├── link.svg
    │   │   ├── list.svg
    │   │   ├── list_group.svg
    │   │   ├── logo.svg
    │   │   ├── lottie.svg
    │   │   ├── mail.svg
    │   │   ├── manufacturers.svg
    │   │   ├── map.svg
    │   │   ├── maps.png
    │   │   ├── menu.svg
    │   │   ├── minus_round.svg
    │   │   ├── navbar.svg
    │   │   ├── pagination.svg
    │   │   ├── panel.svg
    │   │   ├── paragraph.svg
    │   │   ├── paypal.svg
    │   │   ├── play-button.svg
    │   │   ├── plus_round.svg
    │   │   ├── plus_square.svg
    │   │   ├── post.svg
    │   │   ├── posts.svg
    │   │   ├── posts2.svg
    │   │   ├── price-table.svg
    │   │   ├── product.svg
    │   │   ├── product_gallery.svg
    │   │   ├── products.svg
    │   │   ├── progressbar.svg
    │   │   ├── radio.svg
    │   │   ├── rating.svg
    │   │   ├── reviews.svg
    │   │   ├── right-column-layout.svg
    │   │   ├── search.svg
    │   │   ├── section.svg
    │   │   ├── select_input.svg
    │   │   ├── separator.svg
    │   │   ├── slider.svg
    │   │   ├── social-icons.svg
    │   │   ├── star.svg
    │   │   ├── stopwatch.svg
    │   │   ├── stream-solid.svg
    │   │   ├── symbol.svg
    │   │   ├── table.svg
    │   │   ├── tabs.svg
    │   │   ├── tags.svg
    │   │   ├── testimonial.svg
    │   │   ├── text_area.svg
    │   │   ├── text_input.svg
    │   │   ├── twitter.svg
    │   │   ├── user.svg
    │   │   ├── vendor.svg
    │   │   ├── video.svg
    │   │   ├── well.svg
    │   │   └── youtube.svg
    │   ├── blocks-bootstrap4.js
    │   ├── builder.js
    │   ├── components-bootstrap4.js
    │   ├── components-bootstrap5.js
    │   ├── components-common.js
    │   ├── components-elements.js
    │   ├── components-embeds.js
    │   ├── components-html.js
    │   ├── components-server.js
    │   ├── components-widgets.js
    │   ├── inputs.js
    │   ├── oembed.js
    │   ├── plugin-ai-assistant.js
    │   ├── plugin-aos.js
    │   ├── plugin-bootstrap-colorpicker.js
    │   ├── plugin-ckeditor.js
    │   ├── plugin-codemirror.js
    │   ├── plugin-coloris.js
    │   ├── plugin-google-fonts.js
    │   ├── plugin-jszip.js
    │   ├── plugin-media.js
    │   ├── plugin-tinymce.js
    │   ├── section.js
    │   ├── sections-bootstrap4.js
    │   └── undo.js
    ├── codemirror/
    │   ├── lib/
    │   │   ├── clike.js
    │   │   ├── codemirror.css
    │   │   ├── codemirror.js
    │   │   ├── css.js
    │   │   ├── formatting.js
    │   │   ├── htmlmixed.js
    │   │   ├── search.js
    │   │   ├── searchcursor.js
    │   │   └── xml.js
    │   └── theme/
    │   │   ├── duotone-dark.css
    │   │   └── material.css
    ├── coloris/
    │   ├── coloris.css
    │   ├── coloris.js
    │   ├── coloris.min.css
    │   └── coloris.min.js
    ├── jszip/
    │   ├── filesaver.js
    │   ├── filesaver.min.js
    │   ├── jszip.js
    │   └── jszip.min.js
    ├── media/
    │   ├── media.css
    │   ├── media.js
    │   └── openverse.js
    └── swiper/
    │   ├── swiper-bundle.min.css
    │   └── swiper-bundle.min.js
├── media/
    ├── mountains/
    │   ├── 1.jpg
    │   ├── 12.jpg
    │   └── 3.jpg
    ├── 15.jpg
    ├── 2.jpg
    ├── 4.jpg
    ├── 5.jpg
    ├── 6.jpg
    ├── 7.jpg
    ├── sample.webm
    └── sample.webp
├── resources/
    ├── google-fonts.json
    └── line-awesome.html
├── scss/
    ├── bootstrap/
    │   ├── forms/
    │   │   ├── _floating-labels.scss
    │   │   ├── _form-check.scss
    │   │   ├── _form-control.scss
    │   │   ├── _form-range.scss
    │   │   ├── _form-select.scss
    │   │   ├── _form-text.scss
    │   │   ├── _input-group.scss
    │   │   ├── _labels.scss
    │   │   └── _validation.scss
    │   ├── helpers/
    │   │   ├── _clearfix.scss
    │   │   ├── _color-bg.scss
    │   │   ├── _colored-links.scss
    │   │   ├── _focus-ring.scss
    │   │   ├── _icon-link.scss
    │   │   ├── _position.scss
    │   │   ├── _ratio.scss
    │   │   ├── _stacks.scss
    │   │   ├── _stretched-link.scss
    │   │   ├── _text-truncation.scss
    │   │   ├── _visually-hidden.scss
    │   │   └── _vr.scss
    │   ├── mixins/
    │   │   ├── _alert.scss
    │   │   ├── _backdrop.scss
    │   │   ├── _banner.scss
    │   │   ├── _border-radius.scss
    │   │   ├── _box-shadow.scss
    │   │   ├── _breakpoints.scss
    │   │   ├── _buttons.scss
    │   │   ├── _caret.scss
    │   │   ├── _clearfix.scss
    │   │   ├── _color-mode.scss
    │   │   ├── _color-scheme.scss
    │   │   ├── _container.scss
    │   │   ├── _deprecate.scss
    │   │   ├── _forms.scss
    │   │   ├── _gradients.scss
    │   │   ├── _grid.scss
    │   │   ├── _image.scss
    │   │   ├── _list-group.scss
    │   │   ├── _lists.scss
    │   │   ├── _pagination.scss
    │   │   ├── _reset-text.scss
    │   │   ├── _resize.scss
    │   │   ├── _table-variants.scss
    │   │   ├── _text-truncate.scss
    │   │   ├── _transition.scss
    │   │   ├── _utilities.scss
    │   │   └── _visually-hidden.scss
    │   ├── tests/
    │   │   └── jasmine.js
    │   ├── utilities/
    │   │   └── _api.scss
    │   ├── vendor/
    │   │   └── _rfs.scss
    │   ├── _accordion.scss
    │   ├── _alert.scss
    │   ├── _badge.scss
    │   ├── _breadcrumb.scss
    │   ├── _button-group.scss
    │   ├── _buttons.scss
    │   ├── _card.scss
    │   ├── _carousel.scss
    │   ├── _close.scss
    │   ├── _containers.scss
    │   ├── _dropdown.scss
    │   ├── _forms.scss
    │   ├── _functions.scss
    │   ├── _grid.scss
    │   ├── _helpers.scss
    │   ├── _images.scss
    │   ├── _list-group.scss
    │   ├── _maps.scss
    │   ├── _mixins.scss
    │   ├── _modal.scss
    │   ├── _nav.scss
    │   ├── _navbar.scss
    │   ├── _offcanvas.scss
    │   ├── _pagination.scss
    │   ├── _placeholders.scss
    │   ├── _popover.scss
    │   ├── _progress.scss
    │   ├── _reboot.scss
    │   ├── _root.scss
    │   ├── _spinners.scss
    │   ├── _tables.scss
    │   ├── _toasts.scss
    │   ├── _tooltip.scss
    │   ├── _transitions.scss
    │   ├── _type.scss
    │   ├── _utilities.scss
    │   ├── _variables-dark.scss
    │   ├── _variables.scss
    │   ├── bootstrap-grid.scss
    │   ├── bootstrap-reboot.scss
    │   ├── bootstrap-utilities.scss
    │   └── bootstrap.scss
    ├── components/
    │   └── gallery.scss
    ├── line-awesome/
    │   ├── _bordered_pulled.scss
    │   ├── _core.scss
    │   ├── _fixed-width.scss
    │   ├── _icons.scss
    │   ├── _larger.scss
    │   ├── _list.scss
    │   ├── _mixins.scss
    │   ├── _path.scss
    │   ├── _rotated-flipped.scss
    │   ├── _screen-reader.scss
    │   ├── _stacked.scss
    │   ├── _variables.scss
    │   └── line-awesome.scss
    ├── _autocomplete.scss
    ├── _bootstrap-css-vars.scss
    ├── _builder.scss
    ├── _csstree.scss
    ├── editor.scss
    ├── ionicons.css
    └── vvvebjs-editor-helpers.scss
├── .dockerignore
├── .gitattributes
├── .gitignore
├── .gitmodules
├── Credits.md
├── Dockerfile
├── LICENSE
├── README.md
├── docker-compose.yml
├── editor.html
├── editor.php
├── favicon.ico
├── gulpfile.js
├── new-page-blank-template.html
├── package-lock.json
├── package.json
├── save.js
├── save.php
├── scan.php
└── upload.php
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `awesome-design-md-main/`

- **Files:** 147 · **Directories:** 74
- **Entry:** `README.md`

```
awesome-design-md-main/
├── .github/
    ├── ISSUE_TEMPLATE/
    │   └── design-md-request.yml
    └── FUNDING.yml
├── design-md/
    ├── airbnb/
    │   ├── DESIGN.md
    │   └── README.md
    ├── airtable/
    │   ├── DESIGN.md
    │   └── README.md
    ├── apple/
    │   ├── DESIGN.md
    │   └── README.md
    ├── binance/
    │   ├── DESIGN.md
    │   └── README.md
    ├── bmw/
    │   ├── DESIGN.md
    │   └── README.md
    ├── bmw-m/
    │   ├── DESIGN.md
    │   └── README.md
    ├── bugatti/
    │   ├── DESIGN.md
    │   └── README.md
    ├── cal/
    │   ├── DESIGN.md
    │   └── README.md
    ├── claude/
    │   ├── DESIGN.md
    │   └── README.md
    ├── clay/
    │   ├── DESIGN.md
    │   └── README.md
    ├── clickhouse/
    │   ├── DESIGN.md
    │   └── README.md
    ├── cohere/
    │   ├── DESIGN.md
    │   └── README.md
    ├── coinbase/
    │   ├── DESIGN.md
    │   └── README.md
    ├── composio/
    │   ├── DESIGN.md
    │   └── README.md
    ├── cursor/
    │   ├── DESIGN.md
    │   └── README.md
    ├── elevenlabs/
    │   ├── DESIGN.md
    │   └── README.md
    ├── expo/
    │   ├── DESIGN.md
    │   └── README.md
    ├── ferrari/
    │   ├── DESIGN.md
    │   └── README.md
    ├── figma/
    │   ├── DESIGN.md
    │   └── README.md
    ├── framer/
    │   ├── DESIGN.md
    │   └── README.md
    ├── hashicorp/
    │   ├── DESIGN.md
    │   └── README.md
    ├── ibm/
    │   ├── DESIGN.md
    │   └── README.md
    ├── intercom/
    │   ├── DESIGN.md
    │   └── README.md
    ├── kraken/
    │   ├── DESIGN.md
    │   └── README.md
    ├── lamborghini/
    │   ├── DESIGN.md
    │   └── README.md
    ├── linear.app/
    │   ├── DESIGN.md
    │   └── README.md
    ├── lovable/
    │   ├── DESIGN.md
    │   └── README.md
    ├── mastercard/
    │   ├── DESIGN.md
    │   └── README.md
    ├── meta/
    │   ├── DESIGN.md
    │   └── README.md
    ├── minimax/
    │   ├── DESIGN.md
    │   └── README.md
    ├── mintlify/
    │   ├── DESIGN.md
    │   └── README.md
    ├── miro/
    │   ├── DESIGN.md
    │   └── README.md
    ├── mistral.ai/
    │   ├── DESIGN.md
    │   └── README.md
    ├── mongodb/
    │   ├── DESIGN.md
    │   └── README.md
    ├── nike/
    │   ├── DESIGN.md
    │   └── README.md
    ├── notion/
    │   ├── DESIGN.md
    │   └── README.md
    ├── nvidia/
    │   ├── DESIGN.md
    │   └── README.md
    ├── ollama/
    │   ├── DESIGN.md
    │   └── README.md
    ├── opencode.ai/
    │   ├── DESIGN.md
    │   └── README.md
    ├── pinterest/
    │   ├── DESIGN.md
    │   └── README.md
    ├── playstation/
    │   ├── DESIGN.md
    │   └── README.md
    ├── posthog/
    │   ├── DESIGN.md
    │   └── README.md
    ├── raycast/
    │   ├── DESIGN.md
    │   └── README.md
    ├── renault/
    │   ├── DESIGN.md
    │   └── README.md
    ├── replicate/
    │   ├── DESIGN.md
    │   └── README.md
    ├── resend/
    │   ├── DESIGN.md
    │   └── README.md
    ├── revolut/
    │   ├── DESIGN.md
    │   └── README.md
    ├── runwayml/
    │   ├── DESIGN.md
    │   └── README.md
    ├── sanity/
    │   ├── DESIGN.md
    │   └── README.md
    ├── sentry/
    │   ├── DESIGN.md
    │   └── README.md
    ├── shopify/
    │   ├── DESIGN.md
    │   └── README.md
    ├── slack/
    │   └── DESIGN.md
    ├── spacex/
    │   ├── DESIGN.md
    │   └── README.md
    ├── spotify/
    │   ├── DESIGN.md
    │   └── README.md
    ├── starbucks/
    │   ├── DESIGN.md
    │   └── README.md
    ├── stripe/
    │   ├── DESIGN.md
    │   └── README.md
    ├── supabase/
    │   ├── DESIGN.md
    │   └── README.md
    ├── superhuman/
    │   ├── DESIGN.md
    │   └── README.md
    ├── tesla/
    │   ├── DESIGN.md
    │   └── README.md
    ├── theverge/
    │   ├── DESIGN.md
    │   └── README.md
    ├── together.ai/
    │   ├── DESIGN.md
    │   └── README.md
    ├── uber/
    │   ├── DESIGN.md
    │   └── README.md
    ├── vercel/
    │   ├── DESIGN.md
    │   └── README.md
    ├── vodafone/
    │   ├── DESIGN.md
    │   └── README.md
    ├── voltagent/
    │   ├── DESIGN.md
    │   └── README.md
    ├── warp/
    │   ├── DESIGN.md
    │   └── README.md
    ├── webflow/
    │   ├── DESIGN.md
    │   └── README.md
    ├── wired/
    │   ├── DESIGN.md
    │   └── README.md
    ├── wise/
    │   ├── DESIGN.md
    │   └── README.md
    ├── x.ai/
    │   ├── DESIGN.md
    │   └── README.md
    └── zapier/
    │   ├── DESIGN.md
    │   └── README.md
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## `awesome-design-skills-main/`

- **Files:** 137 · **Directories:** 68
- **Entry:** `README.md`

```
awesome-design-skills-main/
├── skills/
    ├── agentic/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── ant/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── application/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── artistic/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── bento/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── bold/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── brutalism/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── cafe/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── claude/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── claymorphism/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── clean/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── codex/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── colorful/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── contemporary/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── corporate/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── cosmic/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── creative/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── dashboard/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── dithered/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── doodle/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── dramatic/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── editorial/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── elegant/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── energetic/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── enterprise/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── expressive/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── fantasy/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── fiction/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── flat/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── friendly/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── futuristic/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── glassmorphism/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── gradient/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── immersive/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── impeccable/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── levels/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── lingo/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── luxury/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── material/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── matrix/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── minimal/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── modern/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── mono/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── neobrutalism/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── neon/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── neumorphism/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── pacman/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── paper/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── perspective/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── premium/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── professional/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── publication/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── refined/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── retro/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── riso/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── sega/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── shadcn/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── simple/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── sketch/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── skeumorphism/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── sleek/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── spacious/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── storytelling/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── terracotta/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── tetris/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── vibrant/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── vintage/
    │   ├── DESIGN.md
    │   └── SKILL.md
    └── index.json
├── LICENSE
└── README.md
```

## `awesome-shadcn-ui-main/`

- **Files:** 147 · **Directories:** 24
- **Entry:** `README.md`

```
awesome-shadcn-ui-main/
├── .github/
    ├── workflows/
    │   ├── add-dates.yml
    │   ├── format-readme.yml
    │   └── link-check.yml
    ├── FUNDING.yml
    └── pull_request_template.md
├── public/
    ├── sponsors/
    │   ├── shadcnblocks.svg
    │   ├── shadcnstudio.svg
    │   └── shadcnuikit.svg
    ├── logo-mobile.svg
    ├── logo.png
    ├── logo.svg
    └── seo.png
├── scripts/
    ├── add-dates.js
    ├── backfill-dates.js
    ├── format-readme.js
    └── normalize-dates.js
├── src/
    ├── app/
    │   ├── [...not-found]/
    │   │   └── page.tsx
    │   ├── bookmarks/
    │   │   ├── error.tsx
    │   │   ├── loading.tsx
    │   │   └── page.tsx
    │   ├── categories/
    │   │   ├── error.tsx
    │   │   ├── loading.tsx
    │   │   └── page.tsx
    │   ├── error.tsx
    │   ├── favicon.ico
    │   ├── global-error.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   └── page.tsx
    ├── components/
    │   ├── layout/
    │   │   ├── footer.tsx
    │   │   ├── header.tsx
    │   │   └── page-header.tsx
    │   ├── sponsors/
    │   │   ├── shadcn-blocks-logo.tsx
    │   │   ├── shadcn-studio-logo.tsx
    │   │   ├── shadcn-ui-kit-logo.tsx
    │   │   └── sponsors.tsx
    │   ├── ui/
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button-group.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── combobox.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── direction.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── empty.tsx
    │   │   ├── field.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-group.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── item.tsx
    │   │   ├── kbd.tsx
    │   │   ├── label.tsx
    │   │   ├── marquee.tsx
    │   │   ├── menubar.tsx
    │   │   ├── multi-select.tsx
    │   │   ├── native-select.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── spinner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   └── tooltip.tsx
    │   ├── category-page-content.tsx
    │   ├── cta-submit.tsx
    │   ├── github-stars.tsx
    │   ├── hero.tsx
    │   ├── home-content.tsx
    │   ├── item-card.tsx
    │   ├── item-grid.tsx
    │   ├── item-page-content.tsx
    │   ├── items-list.tsx
    │   ├── logo.tsx
    │   ├── pagination-controls.tsx
    │   ├── pr-submission-dialog.tsx
    │   ├── search-filter-controls.tsx
    │   ├── sort.tsx
    │   ├── sponsor-card.tsx
    │   ├── sponsorship.tsx
    │   ├── theme-toggle.tsx
    │   └── website-preview.tsx
    ├── hooks/
    │   ├── use-bookmark.ts
    │   ├── use-debounce.ts
    │   ├── use-github-auth.ts
    │   ├── use-mobile.ts
    │   ├── use-pr-submission.ts
    │   ├── use-readme.ts
    │   └── use-website-preview.ts
    ├── lib/
    │   ├── compose-refs.ts
    │   ├── config.ts
    │   ├── slugs.ts
    │   └── utils.ts
    └── providers/
    │   ├── providers.tsx
    │   └── theme-provider.tsx
├── .env.example
├── .gitignore
├── DEVELOPMENT.md
├── LICENSE
├── README.md
├── components.json
├── next.config.mjs
├── open-next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tsconfig.json
└── wrangler.jsonc
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `builder-main/`

- **Files:** 3885 · **Directories:** 1207
- **Entry:** `README.md`

```
builder-main/
├── .changeset/
    └── config.json
├── .github/
    ├── actions/
    │   └── yarn-nm-install/
    │   │   └── action.yml
    ├── ISSUE_TEMPLATE/
    │   ├── config.yml
    │   ├── technical-discussion.md
    │   └── technical_discussion.md
    └── workflows/
    │   ├── ci.yml
    │   ├── issue-close-bot.yml
    │   ├── lint-and-commit.yml
    │   ├── publish-sdks.yml
    │   └── react-native-sdk-test-remote.yml
├── .yarn/
    ├── patches/
    │   └── react-native-builder-bob-npm-0.21.3-71f7168ad6.patch
    ├── plugins/
    │   └── @yarnpkg/
    │   │   ├── plugin-version.cjs
    │   │   └── plugin-workspace-tools.cjs
    ├── releases/
    │   └── yarn-3.6.1.cjs
    └── versions/
    │   ├── 01a29cc3.yml
    │   ├── 1395ea14.yml
    │   ├── 19ed842b.yml
    │   ├── 2d966ec2.yml
    │   ├── 34df0a2e.yml
    │   ├── 4595bda1.yml
    │   ├── 5145eaac.yml
    │   ├── 57f7f014.yml
    │   ├── 7168a159.yml
    │   ├── 73878229.yml
    │   ├── 7564b793.yml
    │   ├── 83439e9a.yml
    │   ├── 92b83d3e.yml
    │   ├── 9825a286.yml
    │   ├── acd84b1f.yml
    │   ├── c8781759.yml
    │   ├── e1c04aa4.yml
    │   ├── e58c2965.yml
    │   ├── f4280de6.yml
    │   ├── fb72a15d.yml
    │   └── fea605a1.yml
├── examples/
    ├── angular-gen1/
    │   ├── e2e/
    │   │   ├── app.e2e-spec.ts
    │   │   ├── app.po.ts
    │   │   └── tsconfig.e2e.json
    │   ├── src/
    │   │   ├── favicon.ico
    │   │   ├── index.html
    │   │   ├── main.ts
    │   │   ├── polyfills.ts
    │   │   ├── styles.css
    │   │   ├── test.ts
    │   │   ├── tsconfig.app.json
    │   │   ├── tsconfig.spec.json
    │   │   └── typings.d.ts
    │   ├── .browserslistrc
    │   ├── .gitignore
    │   ├── .tool-versions
    │   ├── README.md
    │   ├── angular.json
    │   ├── karma.conf.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── protractor.conf.js
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── angular-gen2/
    │   ├── public/
    │   │   └── favicon.ico
    │   ├── src/
    │   │   ├── index.html
    │   │   ├── main.ts
    │   │   └── styles.css
    │   ├── .editorconfig
    │   ├── .gitignore
    │   ├── README.md
    │   ├── angular.json
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   └── tsconfig.spec.json
    ├── angular-universal/
    │   ├── src/
    │   │   ├── favicon.ico
    │   │   ├── index.html
    │   │   ├── main.server.ts
    │   │   ├── main.ts
    │   │   ├── polyfills.ts
    │   │   ├── styles.css
    │   │   ├── test.ts
    │   │   ├── tsconfig.app.json
    │   │   ├── tsconfig.server.json
    │   │   ├── tsconfig.spec.json
    │   │   └── typings.d.ts
    │   ├── .browserslistrc
    │   ├── .gitignore
    │   ├── README.md
    │   ├── angular.json
    │   ├── karma.conf.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── protractor.conf.js
    │   ├── server.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── astro-solidjs/
    │   ├── public/
    │   │   └── favicon.ico
    │   ├── .gitignore
    │   ├── .npmrc
    │   ├── README.md
    │   ├── astro.config.mjs
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tailwind.config.cjs
    │   └── tsconfig.json
    ├── embed-starter-kit/
    │   ├── admin/
    │   │   ├── .env.template
    │   │   ├── .gitignore
    │   │   ├── .prettierignore
    │   │   ├── README.md
    │   │   ├── next-env.d.ts
    │   │   ├── next.config.js
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── types.d.ts
    │   ├── plugin/
    │   │   ├── .gitignore
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   ├── tslint.json
    │   │   └── webpack.config.js
    │   ├── site/
    │   │   ├── .env.template
    │   │   ├── .gitignore
    │   │   ├── .prettierignore
    │   │   ├── README.md
    │   │   ├── next-env.d.ts
    │   │   ├── next.config.js
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   └── tsconfig.json
    │   ├── .editorconfig
    │   ├── .gitignore
    │   ├── .prettierignore
    │   ├── Readme.md
    │   ├── package-lock.json
    │   └── package.json
    ├── gatsby/
    │   └── README.md
    ├── gatsby-minimal-starter/
    │   ├── .gitignore
    │   ├── README.md
    │   ├── gatsby-config.js
    │   ├── package-lock.json
    │   └── package.json
    ├── material-ui/
    │   └── README.md
    ├── next-js/
    │   └── Readme.md
    ├── next-js-amp/
    │   ├── builder/
    │   │   └── settings.json
    │   ├── components/
    │   │   └── BuilderPageWrapper.js
    │   ├── pages/
    │   │   ├── [[...path]].js
    │   │   └── preview.js
    │   ├── public/
    │   │   ├── favicon.ico
    │   │   └── vercel.svg
    │   ├── .gitignore
    │   ├── README.md
    │   ├── next.config.js
    │   ├── package-lock.json
    │   └── package.json
    ├── next-js-app-router/
    │   ├── app/
    │   │   ├── favicon.ico
    │   │   ├── globals.css
    │   │   └── layout.tsx
    │   ├── components/
    │   │   └── builder.tsx
    │   ├── public/
    │   │   ├── next.svg
    │   │   └── vercel.svg
    │   ├── README.md
    │   ├── next.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── tailwind.config.js
    │   └── tsconfig.json
    ├── next-js-builder-site/
    │   ├── .babelrc
    │   ├── .commitlintrc.json
    │   ├── .editorconfig
    │   ├── .gitignore
    │   ├── .npmrc
    │   ├── .prettierignore
    │   ├── .prettierrc
    │   ├── CHANGELOG.md
    │   ├── README.md
    │   ├── next-env.d.ts
    │   ├── next.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── renovate.json
    │   └── tsconfig.json
    ├── next-js-cms-blog/
    │   ├── builder/
    │   │   └── settings.json
    │   ├── components/
    │   │   ├── avatar.js
    │   │   ├── builder-image.js
    │   │   ├── container.js
    │   │   ├── cover-image.js
    │   │   ├── footer.js
    │   │   ├── header.js
    │   │   ├── intro.js
    │   │   ├── layout.js
    │   │   ├── meta.js
    │   │   ├── post-body.js
    │   │   ├── post-card.js
    │   │   ├── post-header.js
    │   │   └── post-title.js
    │   ├── pages/
    │   │   ├── _app.js
    │   │   └── index.js
    │   ├── styles/
    │   │   └── index.css
    │   ├── .env
    │   ├── .gitignore
    │   ├── README.md
    │   ├── jsconfig.json
    │   ├── next.config.js
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── tailwind.config.js
    │   └── yarn.lock
    ├── next-js-headless-shopify/
    │   └── README.md
    ├── next-js-localized/
    │   ├── components/
    │   │   └── Heading.tsx
    │   ├── config/
    │   │   └── builder.ts
    │   ├── pages/
    │   │   ├── [[...page]].tsx
    │   │   └── _app.tsx
    │   ├── .env.development
    │   ├── .env.production
    │   ├── .env.template
    │   ├── .gitignore
    │   ├── .prettierignore
    │   ├── README.md
    │   ├── next-env.d.ts
    │   ├── next.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── next-js-on-demand-isr/
    │   ├── config/
    │   │   └── builder.js
    │   ├── pages/
    │   │   ├── [[...page]].jsx
    │   │   └── _app.jsx
    │   ├── .env
    │   ├── .gitignore
    │   ├── .prettierignore
    │   ├── README.md
    │   ├── next-env.d.ts
    │   ├── next.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── next-js-sdk-gen-2-experimental-app-directory/
    │   ├── .eslintrc.json
    │   ├── .gitignore
    │   ├── .nvmrc
    │   ├── README.md
    │   ├── next.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── vercel.json
    ├── next-js-simple/
    │   ├── config/
    │   │   └── builder.ts
    │   ├── pages/
    │   │   ├── [[...page]].tsx
    │   │   └── _app.tsx
    │   ├── .env.development
    │   ├── .env.production
    │   ├── .env.template
    │   ├── .gitignore
    │   ├── .prettierignore
    │   ├── README.md
    │   ├── next-env.d.ts
    │   ├── next.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── next-js-theme-ui/
    │   ├── assets/
    │   │   ├── base.css
    │   │   └── main.css
    │   ├── builder/
    │   │   └── settings.json
    │   ├── config/
    │   │   ├── builder.ts
    │   │   ├── env.ts
    │   │   ├── seo.json
    │   │   └── theme.ts
    │   ├── docs/
    │   │   └── ROADMAP.md
    │   ├── lib/
    │   │   ├── get-layout-props.ts
    │   │   └── resolve-builder-content.ts
    │   ├── pages/
    │   │   ├── [[...path]].tsx
    │   │   ├── _app.tsx
    │   │   └── _document.tsx
    │   ├── public/
    │   │   ├── bg-products.svg
    │   │   ├── cursor-left.png
    │   │   ├── cursor-right.png
    │   │   ├── flag-en-us.svg
    │   │   ├── flag-es-ar.svg
    │   │   ├── flag-es-co.svg
    │   │   ├── flag-es.svg
    │   │   ├── icon-144x144.png
    │   │   ├── icon-192x192.png
    │   │   ├── icon-512x512.png
    │   │   ├── icon.png
    │   │   ├── jacket.png
    │   │   ├── site.webmanifest
    │   │   ├── slider-arrows.png
    │   │   └── vercel.svg
    │   ├── .editorconfig
    │   ├── .env.development
    │   ├── .env.production
    │   ├── .env.template
    │   ├── .gitignore
    │   ├── .prettierignore
    │   ├── README.md
    │   ├── global.d.ts
    │   ├── license.md
    │   ├── next-env.d.ts
    │   ├── next.config.js
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── yarn.lock
    ├── nextjs-app-dir-v2/
    │   ├── public/
    │   │   ├── next.svg
    │   │   └── vercel.svg
    │   ├── .eslintrc.json
    │   ├── .gitignore
    │   ├── README.md
    │   ├── next.config.mjs
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── vercel.json
    ├── nextjs-pages-dir-v2/
    │   ├── public/
    │   │   ├── favicon.ico
    │   │   ├── next.svg
    │   │   └── vercel.svg
    │   ├── .eslintrc.json
    │   ├── .gitignore
    │   ├── README.md
    │   ├── next.config.mjs
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── vercel.json
    ├── node-express/
    │   ├── README.md
    │   ├── index.js
    │   └── package.json
    ├── plain-js/
    │   ├── src/
    │   │   ├── index.css
    │   │   └── index.js
    │   ├── README.md
    │   ├── index.html
    │   └── package.json
    ├── qwik/
    │   ├── public/
    │   │   ├── favicon.svg
    │   │   ├── manifest.json
    │   │   └── robots.txt
    │   ├── src/
    │   │   ├── entry.dev.tsx
    │   │   ├── entry.preview.tsx
    │   │   ├── entry.ssr.tsx
    │   │   ├── entry.vercel-edge.tsx
    │   │   ├── global.css
    │   │   └── root.tsx
    │   ├── .eslintignore
    │   ├── .eslintrc.cjs
    │   ├── .gitignore
    │   ├── .prettierignore
    │   ├── README.md
    │   ├── module-augmentations.d.ts
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vercel.json
    │   └── vite.config.ts
    ├── react/
    │   ├── public/
    │   │   └── index.html
    │   ├── src/
    │   │   ├── index.css
    │   │   └── index.js
    │   ├── README.md
    │   ├── index.html
    │   ├── package-lock.json
    │   └── package.json
    ├── react-design-system/
    │   ├── builder/
    │   │   └── settings.json
    │   ├── public/
    │   │   └── index.html
    │   ├── src/
    │   │   ├── builder-settings.js
    │   │   ├── index.css
    │   │   └── index.js
    │   ├── .gitignore
    │   ├── README.md
    │   ├── package-lock.json
    │   └── package.json
    ├── react-js/
    │   ├── public/
    │   │   └── react.svg
    │   ├── src/
    │   │   ├── index.css
    │   │   └── main.jsx
    │   ├── .gitignore
    │   ├── README.md
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   └── vite.config.js
    ├── react-multipage-funnel/
    │   ├── builder/
    │   │   └── settings.json
    │   ├── public/
    │   │   └── index.html
    │   ├── src/
    │   │   ├── index.css
    │   │   └── index.js
    │   ├── .env
    │   ├── README.md
    │   ├── index.html
    │   ├── package-lock.json
    │   └── package.json
    ├── react-native/
    │   ├── .expo-shared/
    │   │   └── assets.json
    │   ├── android/
    │   │   ├── .gitignore
    │   │   ├── build.gradle
    │   │   ├── gradle.properties
    │   │   ├── gradlew
    │   │   ├── gradlew.bat
    │   │   └── settings.gradle
    │   ├── app/
    │   │   ├── [page].jsx
    │   │   ├── _layout.jsx
    │   │   └── index.jsx
    │   ├── assets/
    │   │   ├── adaptive-icon.png
    │   │   ├── favicon.png
    │   │   ├── icon.png
    │   │   └── splash.png
    │   ├── ios/
    │   │   ├── .gitignore
    │   │   ├── .xcode.env
    │   │   ├── Podfile
    │   │   ├── Podfile.lock
    │   │   └── Podfile.properties.json
    │   ├── scripts/
    │   │   ├── add-resolutions.sh
    │   │   └── remove-resolutions.sh
    │   ├── .gitignore
    │   ├── .nvmrc
    │   ├── README.md
    │   ├── app.json
    │   ├── babel.config.js
    │   ├── package-lock.json
    │   └── package.json
    ├── react-v2/
    │   ├── src/
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── .gitignore
    │   ├── README.md
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   └── vite.config.ts
    ├── remix-gen2/
    │   ├── app/
    │   │   └── root.tsx
    │   ├── .eslintrc.cjs
    │   ├── .gitignore
    │   ├── .tool-versions
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vercel.json
    │   └── vite.config.ts
    ├── remix-minimal-starter/
    │   ├── app/
    │   │   ├── entry.client.tsx
    │   │   ├── entry.server.tsx
    │   │   └── root.tsx
    │   ├── public/
    │   │   └── favicon.ico
    │   ├── screenshots/
    │   │   ├── faq draft.png
    │   │   ├── faq live.png
    │   │   └── home.png
    │   ├── .eslintrc.js
    │   ├── .gitignore
    │   ├── README.md
    │   ├── builderConfig.json
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── remix.config.js
    │   ├── remix.env.d.ts
    │   ├── server.js
    │   └── tsconfig.json
    ├── solid-js/
    │   ├── src/
    │   │   ├── App.jsx
    │   │   ├── App.module.css
    │   │   ├── index.css
    │   │   ├── index.jsx
    │   │   └── logo.svg
    │   ├── .gitignore
    │   ├── README.md
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   └── vite.config.js
    ├── storybook/
    │   ├── .storybook/
    │   │   ├── main.js
    │   │   └── preview.js
    │   ├── public/
    │   │   └── index.html
    │   ├── src/
    │   │   ├── builder-settings.js
    │   │   ├── index.css
    │   │   └── index.js
    │   ├── .gitignore
    │   ├── README.md
    │   ├── package-lock.json
    │   └── package.json
    ├── svelte/
    │   ├── localized-sveltekit/
    │   │   ├── .eslintignore
    │   │   ├── .eslintrc.cjs
    │   │   ├── .gitignore
    │   │   ├── .npmrc
    │   │   ├── .prettierignore
    │   │   ├── .prettierrc
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── svelte.config.js
    │   │   └── vite.config.js
    │   ├── svelte-vite/
    │   │   ├── .eslintrc.cjs
    │   │   ├── .gitignore
    │   │   ├── .npmrc
    │   │   ├── .prettierrc
    │   │   ├── README.md
    │   │   ├── index.html
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── svelte.config.js
    │   │   ├── tsconfig.json
    │   │   ├── vercel.json
    │   │   └── vite.config.ts
    │   └── sveltekit/
    │   │   ├── .gitignore
    │   │   ├── .npmrc
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── svelte.config.js
    │   │   ├── tsconfig.json
    │   │   ├── vercel.json
    │   │   └── vite.config.ts
    ├── svelte-design-system/
    │   ├── src/
    │   │   ├── app.css
    │   │   ├── app.d.ts
    │   │   ├── app.html
    │   │   └── hooks.ts
    │   ├── static/
    │   │   ├── favicon.png
    │   │   ├── robots.txt
    │   │   ├── smui.css
    │   │   ├── svelte-welcome.png
    │   │   └── svelte-welcome.webp
    │   ├── .eslintignore
    │   ├── .eslintrc.cjs
    │   ├── .gitignore
    │   ├── .npmrc
    │   ├── .prettierignore
    │   ├── .prettierrc
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── svelte.config.js
    │   └── tsconfig.json
    ├── swift/
    │   ├── iOS/
    │   │   └── Info.plist
    │   ├── macOS/
    │   │   ├── Info.plist
    │   │   └── macOS.entitlements
    │   ├── Shared/
    │   │   ├── ContentView.swift
    │   │   ├── HeroComponent.swift
    │   │   ├── NavigationViews.swift
    │   │   └── testingApp.swift
    │   ├── SwiftExample.xcodeproj/
    │   │   └── project.pbxproj
    │   ├── SwiftExample.xcworkspace/
    │   │   └── contents.xcworkspacedata
    │   ├── Tests iOS/
    │   │   ├── Info.plist
    │   │   └── Tests_iOS.swift
    │   ├── Tests macOS/
    │   │   ├── Info.plist
    │   │   └── Tests_macOS.swift
    │   └── Package.resolved
    ├── tanstack-start/
    │   ├── app/
    │   │   ├── builder_registry.ts
    │   │   ├── client.tsx
    │   │   ├── routeTree.gen.ts
    │   │   ├── router.tsx
    │   │   └── ssr.tsx
    │   ├── .gitignore
    │   ├── .prettierignore
    │   ├── app.config.ts
    │   ├── package.json
    │   ├── readme.md
    │   └── tsconfig.json
    ├── vue/
    │   ├── nuxt-2/
    │   │   └── README.md
    │   ├── nuxt-2-old-sdk/
    │   │   └── README.md
    │   ├── nuxt-3/
    │   │   ├── .gitignore
    │   │   ├── .npmrc
    │   │   ├── README.md
    │   │   ├── app.vue
    │   │   ├── nuxt.config.ts
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   └── tsconfig.json
    │   ├── nuxt-3-catchall/
    │   │   ├── .gitignore
    │   │   ├── .npmrc
    │   │   ├── README.md
    │   │   ├── app.vue
    │   │   ├── nuxt.config.ts
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   └── tsconfig.json
    │   ├── vue-2/
    │   │   └── README.md
    │   ├── vue-3/
    │   │   ├── .eslintrc.cjs
    │   │   ├── .gitignore
    │   │   ├── README.md
    │   │   ├── env.d.ts
    │   │   ├── index.html
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.app.json
    │   │   ├── tsconfig.config.json
    │   │   ├── tsconfig.json
    │   │   ├── tsconfig.node.json
    │   │   └── vite.config.ts
    │   └── vue-storefront-2/
    │   │   ├── .babelrc
    │   │   ├── .editorconfig
    │   │   ├── .gitignore
    │   │   ├── .nvmrc
    │   │   ├── README.md
    │   │   ├── jest.config.js
    │   │   ├── middleware.config.js
    │   │   ├── mockedSearchProducts.json
    │   │   ├── nuxt.config.js
    │   │   ├── package.json
    │   │   ├── shims-builder.d.ts
    │   │   ├── shims-vue.d.ts
    │   │   ├── shims-webpack.d.ts
    │   │   ├── themeConfig.js
    │   │   ├── tsconfig.json
    │   │   └── yarn.lock
    └── CONTRIBUTING.md
├── packages/
    ├── admin-sdk/
    │   ├── src/
    │   │   └── index.ts
    │   ├── .gitignore
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── android/
    │   ├── sdk/
    │   │   ├── .gitignore
    │   │   ├── build.gradle
    │   │   ├── gradle.properties
    │   │   ├── gradlew
    │   │   ├── gradlew.bat
    │   │   └── settings.gradle
    │   └── README.md
    ├── angular/
    │   ├── e2e/
    │   │   ├── app.e2e-spec.ts
    │   │   ├── app.po.ts
    │   │   └── tsconfig.e2e.json
    │   ├── scripts/
    │   │   └── set-sdk-version.sh
    │   ├── src/
    │   │   ├── express.tokens.ts
    │   │   ├── favicon.ico
    │   │   ├── index.html
    │   │   ├── main.server.ts
    │   │   ├── main.ts
    │   │   ├── polyfills.ts
    │   │   ├── public_api.ts
    │   │   ├── styles.css
    │   │   ├── test.ts
    │   │   ├── tsconfig.app.json
    │   │   ├── tsconfig.spec.json
    │   │   └── typings.d.ts
    │   ├── .gitignore
    │   ├── .prettierrc
    │   ├── CHANGELOG.md
    │   ├── README.md
    │   ├── angular.json
    │   ├── browserslist
    │   ├── karma.conf.js
    │   ├── ng-package.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── protractor.conf.js
    │   ├── server.ts
    │   ├── server.ts.bak
    │   ├── tsconfig.json
    │   ├── tsconfig.lib.json
    │   └── tslint.json
    ├── app-context/
    │   ├── README.md
    │   ├── index.d.ts
    │   ├── index.js
    │   ├── package-lock.json
    │   └── package.json
    ├── cli/
    │   ├── src/
    │   │   ├── admin-sdk.ts
    │   │   ├── index.test.ts
    │   │   ├── index.ts
    │   │   ├── integrate.ts
    │   │   └── utils.ts
    │   ├── .gitignore
    │   ├── .prettierrc
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── core/
    │   ├── scripts/
    │   │   ├── cleanup-generated-docs.js
    │   │   └── set-sdk-version.sh
    │   ├── src/
    │   │   ├── builder.class.test.ts
    │   │   ├── builder.class.ts
    │   │   ├── sdk-version.ts
    │   │   ├── url.test.ts
    │   │   └── url.ts
    │   ├── .gitignore
    │   ├── .npmignore
    │   ├── .tool-versions
    │   ├── .yarnrc.yml
    │   ├── CHANGELOG.md
    │   ├── Earthfile
    │   ├── README.md
    │   ├── index.ts
    │   ├── jest.config.ts
    │   ├── package.json
    │   ├── project.json
    │   ├── rollup.config.js
    │   ├── tsconfig.json
    │   ├── typedoc.js
    │   └── types.d.ts
    ├── create-builder.io/
    │   ├── src/
    │   │   ├── cli.ts
    │   │   ├── create-app.ts
    │   │   ├── download.ts
    │   │   ├── index.ts
    │   │   ├── init.ts
    │   │   ├── interactive.ts
    │   │   ├── login.ts
    │   │   ├── open.ts
    │   │   ├── starters.ts
    │   │   ├── texts.ts
    │   │   ├── unzip.ts
    │   │   └── utils.ts
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.js
    │   └── tsconfig.json
    ├── fiddle/
    │   ├── src/
    │   │   ├── builder-fiddle-lite.ts
    │   │   ├── builder-fiddle.ts
    │   │   ├── core.ts
    │   │   ├── elements.ts
    │   │   ├── react.tsx
    │   │   └── typings.d.ts
    │   ├── test/
    │   │   └── builder-fiddle.test.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .editorconfig
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── code-of-conduct.md
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── figma/
    │   ├── src/
    │   │   └── .gitkeep
    │   └── README.md
    ├── gatsby/
    │   ├── src/
    │   │   ├── constants.js
    │   │   ├── gatsby-node.js
    │   │   ├── index.js
    │   │   └── transforms.js
    │   ├── .babelrc
    │   ├── .gitignore
    │   ├── .npmignore
    │   ├── CHANGELOG.md
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── json-schema/
    │   ├── src/
    │   │   └── index.ts
    │   ├── .gitignore
    │   ├── Makefile
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── yarn.lock
    ├── native/
    │   └── .gitkeep
    ├── personalization-utils/
    │   ├── configurator/
    │   │   ├── .gitignore
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   └── tsconfig.json
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── next.ts
    │   │   ├── personalized-url.ts
    │   │   ├── trim-html.test.ts
    │   │   ├── type.d.ts
    │   │   └── utils.ts
    │   ├── .gitignore
    │   ├── README.md
    │   ├── jest.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── plugin-loader/
    │   ├── src/
    │   │   ├── content-loader.tsx
    │   │   ├── plugin-loader.ts
    │   │   ├── polyfills.ts
    │   │   └── types.d.ts
    │   ├── test/
    │   │   └── plugin-loader.test.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .editorconfig
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── code-of-conduct.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── plugin-tools/
    │   ├── src/
    │   │   ├── commerce.tsx
    │   │   ├── data.ts
    │   │   ├── index.ts
    │   │   └── typings.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   └── tsconfig.json
    ├── react/
    │   ├── lib/
    │   │   └── on-change.js
    │   ├── scripts/
    │   │   ├── fix-core-version.sh
    │   │   └── set-sdk-version.sh
    │   ├── src/
    │   │   ├── builder-react-lite.ts
    │   │   ├── builder-react.ts
    │   │   ├── sdk-version.ts
    │   │   └── to-error.ts
    │   ├── test/
    │   │   ├── basic.test.tsx
    │   │   ├── image.test.tsx
    │   │   └── setupTests.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .npmignore
    │   ├── .npmrc
    │   ├── .prettierignore
    │   ├── .travis.yml
    │   ├── .yarnrc.yml
    │   ├── CHANGELOG.md
    │   ├── CONTRIBUTING.md
    │   ├── PUBLISHING.md
    │   ├── README.md
    │   ├── code-of-conduct.md
    │   ├── internal-types.d.ts
    │   ├── jest.config.js
    │   ├── lite.d.ts
    │   ├── lite.js
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── typedoc.js
    ├── react-tests/
    │   ├── next14-pages/
    │   │   ├── .gitignore
    │   │   ├── next.config.js
    │   │   ├── package.json
    │   │   └── tsconfig.json
    │   ├── next15-app/
    │   │   ├── next-env.d.ts
    │   │   ├── next.config.ts
    │   │   ├── package.json
    │   │   └── tsconfig.json
    │   ├── react-remix/
    │   │   ├── .eslintrc.js
    │   │   ├── .gitignore
    │   │   ├── package.json
    │   │   ├── remix.config.js
    │   │   ├── remix.env.d.ts
    │   │   └── tsconfig.json
    │   ├── react-vite/
    │   │   ├── .gitignore
    │   │   ├── index.html
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   ├── tsconfig.node.json
    │   │   └── vite.config.ts
    │   └── .gitignore
    ├── sdks/
    │   ├── docs/
    │   │   ├── ARCHITECTURE.md
    │   │   ├── CONTENT_STATE.md
    │   │   ├── DEVELOP.md
    │   │   ├── PERSONALIZATION_CONTAINER.md
    │   │   └── SSR_AB_TEST.md
    │   ├── output/
    │   │   └── .gitignore
    │   ├── output-generation/
    │   │   ├── build-inline-fns.mjs
    │   │   └── index.js
    │   ├── scripts/
    │   │   ├── add-resolutions.sh
    │   │   ├── loop-command.sh
    │   │   ├── remove-resolutions.sh
    │   │   ├── set-sdk-version.sh
    │   │   └── upgrade-example.sh
    │   ├── src/
    │   │   ├── index.ts
    │   │   └── server-index.ts
    │   ├── typings/
    │   │   └── augmentations.d.ts
    │   ├── .eslintignore
    │   ├── .eslintrc.cjs
    │   ├── .gitignore
    │   ├── .ignore
    │   ├── .prettierignore
    │   ├── .prettierrc
    │   ├── PUBLISHING.md
    │   ├── README.md
    │   ├── globalSetup.js
    │   ├── mitosis.config.cjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── vitest.config.ts
    ├── sdks-tests/
    │   ├── embedder/
    │   │   └── index.js
    │   ├── scripts/
    │   │   └── build-servers.sh
    │   ├── src/
    │   │   └── index.ts
    │   ├── .eslintrc.cjs
    │   ├── .gitignore
    │   ├── .yarnrc.yml
    │   ├── README.md
    │   ├── package.json
    │   ├── playwright.config.ts
    │   └── tsconfig.json
    ├── shopify/
    │   ├── js/
    │   │   └── index.ts
    │   ├── react/
    │   │   ├── index.d.ts
    │   │   ├── index.js
    │   │   └── react.ts
    │   ├── track/
    │   │   └── track.ts
    │   ├── .gitignore
    │   ├── .npmignore
    │   ├── README.md
    │   ├── babel.config.js
    │   ├── index.ts
    │   ├── jest.config.js
    │   ├── js.d.ts
    │   ├── js.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.js
    │   ├── track.d.ts
    │   ├── tsconfig.json
    │   └── types.d.ts
    ├── swift/
    │   ├── .gitignore
    │   └── README.md
    ├── utils/
    │   ├── src/
    │   │   ├── extend-async-props.test.ts
    │   │   ├── extend-async-props.ts
    │   │   ├── get-async-props.test.ts
    │   │   ├── get-async-props.ts
    │   │   ├── index.ts
    │   │   ├── set-pixel-properties.test.ts
    │   │   ├── set-pixel-properties.ts
    │   │   ├── transform-components.test.ts
    │   │   ├── transform-components.ts
    │   │   ├── translation-helpers.test.ts
    │   │   └── translation-helpers.ts
    │   ├── .gitignore
    │   ├── README.md
    │   ├── jest.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── vue/
    │   └── README.md
    ├── webcomponents/
    │   ├── src/
    │   │   ├── builder-webcomponents-lite.ts
    │   │   ├── builder-webcomponents.ts
    │   │   ├── core.ts
    │   │   ├── elements.ts
    │   │   ├── lazy-test.ts
    │   │   └── typings.d.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   ├── make-unpkg-dist.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .npmignore
    │   ├── .travis.yml
    │   ├── CHANGELOG.md
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── bootstrap.js
    │   ├── code-of-conduct.md
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── widgets/
    │   ├── src/
    │   │   ├── builder-widgets-async.tsx
    │   │   └── builder-widgets.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .npmignore
    │   ├── .travis.yml
    │   ├── README.md
    │   ├── async.d.ts
    │   ├── async.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── wordpress/
    │   └── .gitkeep
    └── package.json
├── plugins/
    ├── algolia/
    │   ├── src/
    │   │   ├── constants.ts
    │   │   ├── create-web-hook.tsx
    │   │   ├── plugin.tsx
    │   │   ├── sync-to-algolia.tsx
    │   │   └── typings.d.ts
    │   ├── tools/
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── async-dropdown/
    │   ├── __tests__/
    │   │   ├── dropdownPropsExtractor.test.ts
    │   │   ├── dynamicDropdown.test.tsx
    │   │   ├── mapperEvaluator.test.ts
    │   │   └── selectionsOrchestrator.test.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── jest.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── webpack.config.js
    ├── bigcommerce/
    │   ├── src/
    │   │   ├── data-plugin.ts
    │   │   └── plugin.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── bynder-example/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   ├── types.d.ts
    │   │   ├── typings.d.ts
    │   │   ├── ui.tsx
    │   │   └── utils.ts
    │   ├── .gitignore
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── webpack.config.js
    ├── cloudinary/
    │   ├── __tests__/
    │   │   ├── TestConstants.ts
    │   │   ├── cloudinaryCredentialsDialog.test.tsx
    │   │   ├── cloudinaryImageEditor.test.tsx
    │   │   └── cloudinaryMediaLibraryDialog.test.tsx
    │   ├── src/
    │   │   ├── CloudinaryCredentialsDialog.tsx
    │   │   ├── CloudinaryImageEditor.tsx
    │   │   ├── CloudinaryMediaLibraryDialog.tsx
    │   │   └── setupEnzyme.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── jest.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── commercejs/
    │   ├── src/
    │   │   └── plugin.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── commercelayer/
    │   ├── src/
    │   │   ├── data-plugin.ts
    │   │   ├── plugin.ts
    │   │   ├── service.ts
    │   │   └── typings.d.ts
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   └── tsconfig.json
    ├── commercetools/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   ├── service.ts
    │   │   └── typings.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── contentful/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   └── typing.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CHANGELOG.md
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── contentstack/
    │   ├── src/
    │   │   └── plugin.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── screenshot.jpg
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── elasticpath/
    │   ├── patches/
    │   │   └── @moltin+sdk+8.8.1.patch
    │   ├── src/
    │   │   └── plugin.ts
    │   ├── tools/
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── elasticpath-pcm/
    │   ├── patches/
    │   │   └── @moltin+sdk+11.8.4.patch
    │   ├── src/
    │   │   └── plugin.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── emporix/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   └── typing.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CHANGELOG.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── example/
    │   └── README.md
    ├── example-action-plugin/
    │   ├── src/
    │   │   └── plugin.tsx
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── Readme.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── example-app-campaign-builder/
    │   ├── src/
    │   │   └── plugin.ts
    │   ├── test/
    │   │   └── plugin.test.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── webpack.config.js
    ├── example-app-simple/
    │   ├── src/
    │   │   └── plugin.ts
    │   ├── test/
    │   │   └── plugin.test.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── webpack.config.js
    ├── example-data-plugin/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   └── typing.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── example-seo-review/
    │   ├── src/
    │   │   ├── plugin.tsx
    │   │   ├── type.d.ts
    │   │   └── utils.tsx
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── jodit-html-editor/
    │   ├── images/
    │   │   ├── add-plugin.gif
    │   │   ├── jodit.png
    │   │   └── quill.png
    │   ├── src/
    │   │   └── plugin.tsx
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── webpack.config.js
    ├── kibo-commerce/
    │   ├── src/
    │   │   └── plugin.ts
    │   ├── utils/
    │   │   └── kibo-client.ts
    │   ├── .babelrc
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── webpack.config.js
    ├── kontent-ai/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   └── typing.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── localized-preview/
    │   ├── src/
    │   │   ├── constants.ts
    │   │   └── plugin.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── webpack.config.js
    ├── magento2/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   ├── service.ts
    │   │   └── typings.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── multi-cloudinary/
    │   ├── __tests__/
    │   │   ├── TestConstants.ts
    │   │   ├── cloudinaryCredentialsDialog.test.tsx
    │   │   ├── cloudinaryImageEditor.test.tsx
    │   │   └── cloudinaryMediaLibraryDialog.test.tsx
    │   ├── src/
    │   │   ├── CloudinaryCredentialsDialog.tsx
    │   │   ├── CloudinaryImageEditor.tsx
    │   │   ├── CloudinaryMediaLibraryDialog.tsx
    │   │   └── setupEnzyme.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── jest.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── phrase-conector/
    │   ├── src/
    │   │   ├── phrase.ts
    │   │   ├── plugin-helpers.ts
    │   │   ├── plugin.tsx
    │   │   ├── snackbar-utils.tsx
    │   │   └── type.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── range-input/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   └── rangeInput.tsx
    │   ├── .gitignore
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── webpack.config.js
    ├── rich-text/
    │   ├── src/
    │   │   └── plugin.tsx
    │   ├── test/
    │   │   └── plugin.test.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tslint.json
    │   └── webpack.config.js
    ├── salesforce-commerce-api-plugin/
    │   ├── src/
    │   │   ├── api.ts
    │   │   ├── plugin.ts
    │   │   └── types.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── salesforce-einstein-api/
    │   ├── src/
    │   │   ├── api.ts
    │   │   ├── plugin.ts
    │   │   └── types.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── sfcc-headless/
    │   ├── src/
    │   │   ├── CategoriesPicker.tsx
    │   │   ├── ProductsPicker.tsx
    │   │   ├── data-provider.ts
    │   │   ├── plugin.tsx
    │   │   └── typings.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── sfcc-sync/
    │   ├── src/
    │   │   ├── create-web-hook.tsx
    │   │   ├── on-editor-load.ts
    │   │   ├── plugin.ts
    │   │   ├── sync-to-sfcc.ts
    │   │   ├── typings.d.ts
    │   │   └── utils.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CHANGELOG.md
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── shopify/
    │   ├── src/
    │   │   ├── data-plugin.ts
    │   │   ├── plugin.ts
    │   │   └── typings.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── shopify-demo/
    │   ├── src/
    │   │   ├── plugin.tsx
    │   │   └── typings.d.ts
    │   ├── tools/
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .tool-versions
    │   ├── .travis.yml
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── smartling/
    │   ├── src/
    │   │   ├── model-template.ts
    │   │   ├── plugin-helpers.ts
    │   │   ├── plugin.tsx
    │   │   ├── smartling-configuration-editor.tsx
    │   │   ├── smartling.ts
    │   │   ├── snackbar-utils.tsx
    │   │   └── type.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── swell/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   └── typings.d.ts
    │   ├── tools/
    │   │   ├── gh-pages-publish.ts
    │   │   └── semantic-release-prepare.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── virtocommerce/
    │   ├── src/
    │   │   ├── categories-search.query.ts
    │   │   ├── category.query.ts
    │   │   ├── plugin.ts
    │   │   ├── product.query.ts
    │   │   └── products-search.query.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── vtex/
    │   ├── src/
    │   │   ├── plugin.ts
    │   │   └── typings.d.ts
    │   ├── .gitignore
    │   ├── .travis.yml
    │   ├── CONTRIBUTING.md
    │   ├── LICENSE
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── rollup.config.ts
    │   ├── tsconfig.json
    │   └── tslint.json
    ├── README.md
    └── contributing.md
├── scripts/
    ├── check-is-husky-ready-dir.mjs
    ├── clean-dependabot-merger.mjs
    ├── merge-dependabot-prs.mjs
    └── update-npm-dependency.mjs
├── starters/
    └── create-builder/
    │   ├── create-react-app/
    │       ├── .gitignore
    │       ├── README.md
    │       ├── package-lock.json
    │       ├── package.json
    │       ├── tsconfig.json
    │       └── yarn.lock
    │   └── nextjs/
    │       ├── .eslintrc.json
    │       ├── .gitignore
    │       ├── .prettierignore
    │       ├── README.md
    │       ├── next-env.d.ts
    │       ├── next.config.js
    │       ├── package-lock.json
    │       ├── package.json
    │       ├── tsconfig.json
    │       └── yarn.lock
├── .easignore
├── .gitattributes
├── .gitignore
├── .nvmrc
├── .nxignore
├── .prettierignore
├── .prettierrc
├── .tool-versions
├── .yarnrc.yml
├── CODEOWNERS
├── LICENSE
├── README.md
├── SECURITY.md
├── nx.json
├── package.json
├── pull_request_template.md
├── tslint.json
└── yarn.lock
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `chadnext-main/`

- **Files:** 187 · **Directories:** 53
- **Entry:** `README.md`

```
chadnext-main/
├── .claude/
    └── settings.local.json
├── .cursor/
    ├── environment.json
    └── mcp.json
├── .github/
    ├── FUNDING.yml
    └── dependabot.yml
├── .husky/
    ├── pre-commit
    └── prepare-commit-msg
├── emails/
    ├── thanks.tsx
    └── verification.tsx
├── prisma/
    └── schema.prisma
├── public/
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    ├── apple-touch-icon.png
    ├── chad-next.png
    ├── chadnext-homepage.png
    ├── favicon-16x16.png
    └── favicon.ico
├── src/
    ├── app/
    │   ├── [locale]/
    │   │   ├── actions.ts
    │   │   ├── layout.tsx
    │   │   ├── not-found.tsx
    │   │   └── page.tsx
    │   ├── global-error.tsx
    │   ├── globals.css
    │   ├── manifest.json
    │   ├── robots.ts
    │   ├── sitemap.ts
    │   └── sw.ts
    ├── assets/
    │   └── fonts/
    │   │   ├── CalSans-SemiBold.ttf
    │   │   ├── CalSans-SemiBold.woff
    │   │   └── CalSans-SemiBold.woff2
    ├── components/
    │   ├── layout/
    │   │   ├── auth-form.tsx
    │   │   ├── cancel-confirm-modal.tsx
    │   │   ├── footer.tsx
    │   │   ├── image-upload-modal.tsx
    │   │   ├── login-modal.tsx
    │   │   └── sidebar-nav.tsx
    │   ├── sections/
    │   │   ├── cta.tsx
    │   │   ├── faq.tsx
    │   │   ├── features.tsx
    │   │   ├── hero.tsx
    │   │   ├── open-source.tsx
    │   │   ├── pricing.tsx
    │   │   └── testimonials.tsx
    │   ├── shared/
    │   │   ├── brand-icons.tsx
    │   │   ├── icons.tsx
    │   │   ├── locale-toggler.tsx
    │   │   ├── logout-button.tsx
    │   │   ├── theme-provider.tsx
    │   │   └── theme-toggle.tsx
    │   ├── ui/
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toast.tsx
    │   │   ├── toaster.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   └── tooltip.tsx
    │   ├── OGImgEl.tsx
    │   ├── announcement-banner.tsx
    │   ├── billing-form.tsx
    │   ├── copy-button.tsx
    │   └── go-back.tsx
    ├── config/
    │   ├── site.ts
    │   └── subscription.ts
    ├── content/
    │   ├── about/
    │   │   ├── 1tech-stack.md
    │   │   └── 2inspiration.md
    │   └── changelog/
    │   │   ├── change-01.md
    │   │   ├── change-02.md
    │   │   ├── change-03.md
    │   │   ├── change-04.md
    │   │   ├── change-05.md
    │   │   ├── change-06.md
    │   │   └── change-07.md
    ├── hooks/
    │   ├── use-mobile.tsx
    │   ├── use-scroll.ts
    │   └── use-toast.ts
    ├── lib/
    │   ├── client/
    │   │   ├── safe-action.ts
    │   │   └── uploadthing.ts
    │   ├── server/
    │   │   ├── db.ts
    │   │   ├── mail.ts
    │   │   ├── payment.ts
    │   │   └── upload.ts
    │   └── utils.ts
    ├── locales/
    │   ├── client.ts
    │   ├── en.ts
    │   ├── fr.ts
    │   └── server.ts
    ├── types/
    │   └── index.ts
    └── middleware.ts
├── .env.vault
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── .release-it.json
├── .windsurfrules
├── LICENSE
├── README.md
├── components.json
├── example.env
├── lefthook.yml
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── velite.config.ts
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `impeccable-main/`

- **Files:** 1691 · **Directories:** 461
- **Entry:** `README.md`

```
impeccable-main/
├── .agents/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .claude/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .claude-plugin/
    ├── marketplace.json
    └── plugin.json
├── .codex/
    └── agents/
    │   └── impeccable_asset_producer.toml
├── .cursor/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .gemini/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    ├── skills/
    │   └── impeccable/
    │   │   └── SKILL.md
    ├── workflows/
    │   └── ci.yml
    ├── CODEOWNERS
    └── PULL_REQUEST_TEMPLATE.md
├── .impeccable/
    ├── live/
    │   └── config.json
    └── design.json
├── .kiro/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .opencode/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .pi/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .qoder/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .rovodev/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .trae/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── .trae-cn/
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── cli/
    ├── bin/
    │   ├── commands/
    │   │   └── skills.mjs
    │   └── cli.js
    ├── engine/
    │   ├── cli/
    │   │   └── main.mjs
    │   ├── node/
    │   │   └── file-system.mjs
    │   ├── profile/
    │   │   └── profiler.mjs
    │   ├── registry/
    │   │   └── antipatterns.mjs
    │   ├── rules/
    │   │   └── checks.mjs
    │   ├── shared/
    │   │   ├── color.mjs
    │   │   ├── constants.mjs
    │   │   └── page.mjs
    │   ├── detect-antipatterns-browser.js
    │   ├── detect-antipatterns.mjs
    │   └── findings.mjs
    └── lib/
    │   └── download-providers.js
├── demos/
    └── landing-demo/
    │   ├── classic/
    │       └── index.html
    │   ├── DESIGN.json
    │   ├── DESIGN.md
    │   ├── PRODUCT.md
    │   ├── index.html
    │   └── package.json
├── extension/
    ├── background/
    │   └── service-worker.js
    ├── content/
    │   └── content-script.js
    ├── devtools/
    │   ├── devtools.html
    │   ├── devtools.js
    │   ├── panel.css
    │   ├── panel.html
    │   ├── panel.js
    │   ├── sidebar.css
    │   ├── sidebar.html
    │   └── sidebar.js
    ├── icons/
    │   ├── icon-128.png
    │   ├── icon-16.png
    │   ├── icon-32.png
    │   ├── icon-48.png
    │   ├── icon.svg
    │   └── promo-small.png
    ├── popup/
    │   ├── popup.css
    │   ├── popup.html
    │   └── popup.js
    ├── STORE_LISTING.md
    └── manifest.json
├── notes/
    ├── plans/
    │   └── 2026-04-28-001-feat-live-session-recovery-plan.md
    └── adr-live-variant-mode.md
├── plugin/
    ├── .claude-plugin/
    │   └── plugin.json
    └── skills/
    │   └── impeccable/
    │       └── SKILL.md
├── scripts/
    ├── lib/
    │   ├── transformers/
    │   │   ├── factory.js
    │   │   ├── index.js
    │   │   └── providers.js
    │   ├── sub-pages-data.js
    │   ├── utils.js
    │   └── zip.js
    ├── benchmark-detector.mjs
    ├── build-browser-detector.js
    ├── build-extension.js
    ├── build.js
    ├── generate-extension-icons.js
    ├── generate-og-image.js
    ├── generate-promo-tile.js
    ├── release.mjs
    └── screenshot-antipatterns.js
├── site/
    ├── components/
    │   ├── Footer.astro
    │   └── Header.astro
    ├── content/
    │   ├── skills/
    │   │   ├── adapt.md
    │   │   ├── animate.md
    │   │   ├── audit.md
    │   │   ├── bolder.md
    │   │   ├── clarify.md
    │   │   ├── colorize.md
    │   │   ├── craft.md
    │   │   ├── critique.md
    │   │   ├── delight.md
    │   │   ├── distill.md
    │   │   ├── document.md
    │   │   ├── extract.md
    │   │   ├── harden.md
    │   │   ├── impeccable.md
    │   │   ├── layout.md
    │   │   ├── live.md
    │   │   ├── onboard.md
    │   │   ├── optimize.md
    │   │   ├── overdrive.md
    │   │   ├── polish.md
    │   │   ├── quieter.md
    │   │   ├── shape.md
    │   │   ├── teach.md
    │   │   └── typeset.md
    │   └── tutorials/
    │   │   ├── brand-vs-product.md
    │   │   ├── critique-with-overlay.md
    │   │   ├── getting-started.md
    │   │   └── iterate-live.md
    ├── data/
    │   ├── anti-patterns-catalog.js
    │   └── sub-pages-data.ts
    ├── layouts/
    │   ├── Base.astro
    │   └── Doc.astro
    ├── pages/
    │   ├── cases/
    │   │   └── neo-mirai.astro
    │   ├── designing/
    │   │   └── index.astro
    │   ├── detector/
    │   │   └── index.astro
    │   ├── docs/
    │   │   ├── [...slug].astro
    │   │   └── index.astro
    │   ├── live-mode/
    │   │   └── index.astro
    │   ├── slop/
    │   │   └── index.astro
    │   ├── tutorials/
    │   │   ├── [...slug].astro
    │   │   └── index.astro
    │   ├── index.astro
    │   └── privacy.astro
    ├── public/
    │   ├── antipattern-examples/
    │   │   ├── bad-contrast.html
    │   │   ├── cardocalypse.html
    │   │   ├── inter-everywhere.html
    │   │   ├── layout-templates.html
    │   │   ├── lazy-cool.html
    │   │   ├── lazy-impact.html
    │   │   ├── massive-icons.html
    │   │   ├── modal-abuse.html
    │   │   ├── new-slop-2026.html
    │   │   ├── old-slop-2022.html
    │   │   ├── purple-gradients.html
    │   │   ├── redundant-ux-writing.html
    │   │   ├── thick-border-cards.html
    │   │   └── visual-mode-demo.html
    │   ├── antipattern-images/
    │   │   ├── bad-contrast.png
    │   │   ├── cardocalypse.png
    │   │   ├── inter-everywhere.png
    │   │   ├── layout-templates.png
    │   │   ├── lazy-cool.png
    │   │   ├── lazy-impact.png
    │   │   ├── massive-icons.png
    │   │   ├── modal-abuse.png
    │   │   ├── purple-gradients.png
    │   │   ├── redundant-ux-writing.png
    │   │   └── thick-border-cards.png
    │   ├── assets/
    │   │   ├── antigravity-logo.png
    │   │   ├── claude-logo.png
    │   │   ├── cursor-logo.png
    │   │   ├── dashboard.after.webp
    │   │   ├── dashboard.before.webp
    │   │   ├── diamond.svg
    │   │   ├── extension-detection.png
    │   │   ├── form.after.webp
    │   │   ├── form.before.webp
    │   │   ├── gemini-logo.png
    │   │   ├── github-logo.png
    │   │   ├── kiro-logo.png
    │   │   ├── landing.after.webp
    │   │   ├── landing.before.webp
    │   │   ├── newsletter-icon.png
    │   │   ├── newsletter-icon.svg
    │   │   ├── openai-logo.png
    │   │   ├── openai_image_2_brand.jpg
    │   │   ├── openai_image_2_hifi.jpg
    │   │   ├── opencode-logo.png
    │   │   └── pi-logo.svg
    │   ├── neo-mirai/
    │   │   ├── index.html
    │   │   ├── script.js
    │   │   └── styles.css
    │   ├── apple-touch-icon.png
    │   ├── favicon.svg
    │   ├── og-image.jpg
    │   ├── robots.txt
    │   └── sitemap.xml
    ├── scripts/
    │   ├── components/
    │   │   ├── art-gallery.js
    │   │   ├── foundation-animations.js
    │   │   ├── foundation-grid.js
    │   │   ├── framework-viz.js
    │   │   ├── glass-terminal.js
    │   │   ├── lens.js
    │   │   ├── live-demo.js
    │   │   └── section-nav.js
    │   ├── demos/
    │   │   └── index.js
    │   ├── effects/
    │   │   ├── hero-shader.js
    │   │   ├── liquid-canvas.js
    │   │   └── split-compare.js
    │   ├── generated/
    │   │   └── counts.js
    │   ├── utils/
    │   │   ├── reveal.js
    │   │   ├── scroll.js
    │   │   └── theme.js
    │   ├── app.js
    │   ├── data.js
    │   ├── demo-renderer.js
    │   └── demo-toggles.js
    ├── styles/
    │   ├── detector-lab.css
    │   ├── docs-visuals.css
    │   ├── footer.css
    │   ├── gallery.css
    │   ├── live-mode.css
    │   ├── main.css
    │   ├── problem-section.css
    │   ├── skill-demos.css
    │   ├── sub-pages.css
    │   ├── tokens.css
    │   └── workflow.css
    └── content.config.ts
├── skill/
    ├── agents/
    │   └── impeccable-asset-producer.md
    ├── reference/
    │   ├── adapt.md
    │   ├── animate.md
    │   ├── audit.md
    │   ├── bolder.md
    │   ├── brand.md
    │   ├── clarify.md
    │   ├── codex.md
    │   ├── cognitive-load.md
    │   ├── color-and-contrast.md
    │   ├── colorize.md
    │   ├── craft.md
    │   ├── critique.md
    │   ├── delight.md
    │   ├── distill.md
    │   ├── document.md
    │   ├── extract.md
    │   ├── harden.md
    │   ├── heuristics-scoring.md
    │   ├── interaction-design.md
    │   ├── layout.md
    │   ├── live.md
    │   ├── motion-design.md
    │   ├── onboard.md
    │   ├── optimize.md
    │   ├── overdrive.md
    │   ├── personas.md
    │   ├── polish.md
    │   ├── product.md
    │   ├── quieter.md
    │   ├── responsive-design.md
    │   ├── shape.md
    │   ├── spatial-design.md
    │   ├── teach.md
    │   ├── typeset.md
    │   ├── typography.md
    │   └── ux-writing.md
    ├── scripts/
    │   ├── cleanup-deprecated.mjs
    │   ├── command-metadata.json
    │   ├── critique-storage.mjs
    │   ├── design-parser.mjs
    │   ├── detect-csp.mjs
    │   ├── detect.mjs
    │   ├── impeccable-paths.mjs
    │   ├── is-generated.mjs
    │   ├── live-accept.mjs
    │   ├── live-browser-session.js
    │   ├── live-browser.js
    │   ├── live-complete.mjs
    │   ├── live-completion.mjs
    │   ├── live-inject.mjs
    │   ├── live-poll.mjs
    │   ├── live-resume.mjs
    │   ├── live-server.mjs
    │   ├── live-session-store.mjs
    │   ├── live-status.mjs
    │   ├── live-wrap.mjs
    │   ├── live.mjs
    │   ├── load-context.mjs
    │   ├── modern-screenshot.umd.js
    │   └── pin.mjs
    └── SKILL.md
├── tests/
    ├── fixtures/
    │   └── antipatterns/
    │   │   ├── body-text-viewport-edge.html
    │   │   ├── border-baseline.html
    │   │   ├── color.html
    │   │   ├── cramped-padding.html
    │   │   ├── cssinjs-should-flag.tsx
    │   │   ├── cssinjs-should-pass.tsx
    │   │   ├── external-styles.css
    │   │   ├── glow.html
    │   │   ├── hero-eyebrow-chip.html
    │   │   ├── icon-tile-stack.html
    │   │   ├── italic-serif-display.html
    │   │   ├── jsx-should-flag.jsx
    │   │   ├── jsx-should-pass.jsx
    │   │   ├── layout.html
    │   │   ├── legitimate-borders.html
    │   │   ├── linked-stylesheet.html
    │   │   ├── modern-color-borders.html
    │   │   ├── motion.html
    │   │   ├── overlay-positioning.html
    │   │   ├── partial-component.html
    │   │   ├── quality.html
    │   │   ├── repeated-section-kickers.html
    │   │   ├── should-flag.html
    │   │   ├── should-pass.html
    │   │   ├── svelte-should-flag.svelte
    │   │   ├── svelte-should-pass.svelte
    │   │   ├── typography-should-flag.html
    │   │   ├── typography-should-pass.html
    │   │   ├── typography.html
    │   │   ├── visual-contrast.html
    │   │   ├── vue-should-flag.vue
    │   │   └── vue-should-pass.vue
    ├── framework-fixtures/
    │   ├── astro/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── astro-vite7/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── multipage-with-generator/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── nextjs-app/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── nextjs-app-router/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── nextjs-inline-csp/
    │   │   ├── expected-after-patch.js
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── nextjs-turborepo/
    │   │   ├── expected-after-patch.ts
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── nuxt-csp/
    │   │   ├── expected-after-patch.ts
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── nuxt-vite7/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── sveltekit/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── sveltekit-csp/
    │   │   ├── expected-after-patch.js
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite-react/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-https/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-base-path/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-csp-meta/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-css-modules/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-emotion/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-mapped-list/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-modal/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-plain/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-radix-dialog/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-router-spa/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-styled-components/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-tabs/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-tailwindv3/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-tailwindv4/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-ts/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-tsx-repeated-aside/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-unocss/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-react-vanilla-extract/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   ├── vite8-sveltekit/
    │   │   ├── fixture.json
    │   │   └── gitignore.txt
    │   └── README.md
    ├── lib/
    │   ├── transformers/
    │   │   ├── factory.test.js
    │   │   ├── provider-blocks.test.js
    │   │   └── providers.test.js
    │   ├── detector-bundle.test.js
    │   ├── provider-blocks.test.js
    │   └── utils.test.js
    ├── live-e2e/
    │   ├── agents/
    │   │   └── llm-agent.mjs
    │   ├── agent.mjs
    │   ├── cli-options.mjs
    │   ├── session.mjs
    │   └── ui.mjs
    ├── build.test.js
    ├── cleanup-deprecated.test.mjs
    ├── critique-storage.test.mjs
    ├── design-parser.test.mjs
    ├── detect-antipatterns-browser.test.mjs
    ├── detect-antipatterns-fixtures.test.mjs
    ├── detect-antipatterns.test.js
    ├── framework-fixtures.test.mjs
    ├── impeccable-paths.test.mjs
    ├── live-accept.test.mjs
    ├── live-browser-regression.test.mjs
    ├── live-browser-session.test.mjs
    ├── live-browser-source.test.mjs
    ├── live-completion.test.mjs
    ├── live-e2e-agent-output.test.mjs
    ├── live-e2e-cli-options.test.mjs
    ├── live-e2e-llm-agent.test.mjs
    ├── live-e2e.test.mjs
    ├── live-inject.test.mjs
    ├── live-poll.test.mjs
    ├── live-recovery-commands.test.mjs
    ├── live-reference.test.mjs
    ├── live-server.test.mjs
    ├── live-session-store.test.mjs
    ├── live-wrap.test.mjs
    ├── load-context.test.mjs
    ├── skills-cli.test.js
    └── windows-path-fix.test.js
├── tools/
    └── live-loop.mjs
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── DESIGN.md
├── DEVELOP.md
├── HARNESSES.md
├── LICENSE
├── NOTICE.md
├── PRODUCT.md
├── README.md
├── README.npm.md
├── STYLE.md
├── astro.config.mjs
├── biome.json
├── bun.lock
├── package.json
├── pnpm-lock.yaml
├── skills-lock.json
└── wrangler.toml
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `masri-design-assets/`

- **Files:** 1 · **Directories:** 0
- **Entry:** `README.md`

```
masri-design-assets/
└── README.md
```

## `next-shadcn-admin-dashboard-main/`

- **Files:** 235 · **Directories:** 74
- **Entry:** `README.md`

```
next-shadcn-admin-dashboard-main/
├── .husky/
    └── pre-commit
├── media/
    └── dashboard.png
├── src/
    ├── app/
    │   ├── (external)/
    │   │   └── page.tsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── not-found.tsx
    ├── components/
    │   ├── ui/
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button-group.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── combobox.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── direction.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── empty.tsx
    │   │   ├── field.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-group.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── item.tsx
    │   │   ├── kbd.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── native-select.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── spinner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   └── tooltip.tsx
    │   ├── date-range-picker.tsx
    │   └── simple-icon.tsx
    ├── config/
    │   └── app-config.ts
    ├── data/
    │   └── users.ts
    ├── hooks/
    │   └── use-mobile.ts
    ├── lib/
    │   ├── fonts/
    │   │   └── registry.ts
    │   ├── preferences/
    │   │   ├── layout-utils.ts
    │   │   ├── layout.ts
    │   │   ├── preferences-config.ts
    │   │   ├── preferences-storage.ts
    │   │   ├── theme-utils.ts
    │   │   └── theme.ts
    │   ├── cookie.client.ts
    │   ├── local-storage.client.ts
    │   └── utils.ts
    ├── navigation/
    │   └── sidebar/
    │   │   └── sidebar-items.ts
    ├── scripts/
    │   ├── generate-theme-presets.ts
    │   └── theme-boot.tsx
    ├── server/
    │   └── server-actions.ts
    ├── stores/
    │   └── preferences/
    │   │   ├── preferences-provider.tsx
    │   │   └── preferences-store.ts
    ├── styles/
    │   ├── flag-icons/
    │   │   └── flags.css
    │   └── presets/
    │   │   ├── brutalist.css
    │   │   ├── soft-pop.css
    │   │   └── tangerine.css
    └── proxy.disabled.ts
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── biome.json
├── components.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── tsconfig.scripts.json
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `next-shadcn-dashboard-starter-main/`

- **Files:** 598 · **Directories:** 149
- **Entry:** `README.md`

```
next-shadcn-dashboard-starter-main/
├── .agents/
    └── skills/
    │   ├── find-skills/
    │       └── SKILL.md
    │   ├── frontend-design/
    │       ├── LICENSE.txt
    │       └── SKILL.md
    │   ├── kiranism-shadcn-dashboard/
    │       └── SKILL.md
    │   ├── next-best-practices/
    │       ├── SKILL.md
    │       ├── async-patterns.md
    │       ├── bundling.md
    │       ├── data-patterns.md
    │       ├── debug-tricks.md
    │       ├── directives.md
    │       ├── error-handling.md
    │       ├── file-conventions.md
    │       ├── font.md
    │       ├── functions.md
    │       ├── hydration-error.md
    │       ├── image.md
    │       ├── metadata.md
    │       ├── parallel-routes.md
    │       ├── route-handlers.md
    │       ├── rsc-boundaries.md
    │       ├── runtime-selection.md
    │       ├── scripts.md
    │       ├── self-hosting.md
    │       └── suspense-boundaries.md
    │   ├── shadcn/
    │       ├── SKILL.md
    │       ├── cli.md
    │       ├── customization.md
    │       └── mcp.md
    │   ├── skill-creator/
    │       ├── LICENSE.txt
    │       └── SKILL.md
    │   ├── tanstack-form/
    │       └── SKILL.md
    │   ├── tanstack-query/
    │       ├── SKILL.md
    │       └── skill-rules-fragment.json
    │   ├── vercel-composition-patterns/
    │       ├── AGENTS.md
    │       ├── README.md
    │       └── SKILL.md
    │   ├── vercel-react-best-practices/
    │       ├── AGENTS.md
    │       ├── README.md
    │       └── SKILL.md
    │   └── web-design-guidelines/
    │       └── SKILL.md
├── .claude/
    └── skills/
    │   ├── find-skills/
    │       └── SKILL.md
    │   ├── frontend-design/
    │       ├── LICENSE.txt
    │       └── SKILL.md
    │   ├── kiranism-shadcn-dashboard/
    │       └── SKILL.md
    │   ├── next-best-practices/
    │       ├── SKILL.md
    │       ├── async-patterns.md
    │       ├── bundling.md
    │       ├── data-patterns.md
    │       ├── debug-tricks.md
    │       ├── directives.md
    │       ├── error-handling.md
    │       ├── file-conventions.md
    │       ├── font.md
    │       ├── functions.md
    │       ├── hydration-error.md
    │       ├── image.md
    │       ├── metadata.md
    │       ├── parallel-routes.md
    │       ├── route-handlers.md
    │       ├── rsc-boundaries.md
    │       ├── runtime-selection.md
    │       ├── scripts.md
    │       ├── self-hosting.md
    │       └── suspense-boundaries.md
    │   ├── shadcn/
    │       ├── SKILL.md
    │       ├── cli.md
    │       ├── customization.md
    │       └── mcp.md
    │   ├── skill-creator/
    │       ├── LICENSE.txt
    │       └── SKILL.md
    │   ├── vercel-composition-patterns/
    │       ├── AGENTS.md
    │       ├── README.md
    │       └── SKILL.md
    │   ├── vercel-react-best-practices/
    │       ├── AGENTS.md
    │       ├── README.md
    │       └── SKILL.md
    │   └── web-design-guidelines/
    │       └── SKILL.md
├── .github/
    └── FUNDING.yml
├── .husky/
    ├── pre-commit
    └── pre-push
├── .vscode/
    └── launch.json
├── docs/
    ├── clerk_setup.md
    ├── forms.md
    ├── nav-rbac.md
    └── themes.md
├── public/
    ├── assets/
    │   └── sentry.svg
    ├── next.svg
    ├── robots.txt
    ├── shadcn-dashboard.png
    └── vercel.svg
├── scripts/
    ├── cleanup.js
    └── postinstall.js
├── src/
    ├── app/
    │   ├── about/
    │   │   └── page.tsx
    │   ├── auth/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── dashboard/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── privacy-policy/
    │   │   └── page.tsx
    │   ├── terms-of-service/
    │   │   └── page.tsx
    │   ├── favicon.ico
    │   ├── global-error.tsx
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   └── page.tsx
    ├── components/
    │   ├── forms/
    │   │   └── demo-form.tsx
    │   ├── kbar/
    │   │   ├── index.tsx
    │   │   ├── render-result.tsx
    │   │   ├── result-item.tsx
    │   │   └── use-theme-switching.tsx
    │   ├── layout/
    │   │   ├── app-sidebar.tsx
    │   │   ├── cta-github.tsx
    │   │   ├── header.tsx
    │   │   ├── info-sidebar.tsx
    │   │   ├── page-container.tsx
    │   │   ├── providers.tsx
    │   │   ├── query-provider.tsx
    │   │   └── user-nav.tsx
    │   ├── modal/
    │   │   └── alert-modal.tsx
    │   ├── themes/
    │   │   ├── active-theme.tsx
    │   │   ├── font.config.ts
    │   │   ├── theme-mode-toggle.tsx
    │   │   ├── theme-provider.tsx
    │   │   ├── theme-selector.tsx
    │   │   └── theme.config.ts
    │   ├── ui/
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button-group.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── field.tsx
    │   │   ├── file-preview.tsx
    │   │   ├── form-context.tsx
    │   │   ├── frame.tsx
    │   │   ├── heading.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── info-button.tsx
    │   │   ├── infobar.tsx
    │   │   ├── input-group.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── kanban.tsx
    │   │   ├── kbd.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── modal.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── notification-card.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── spinner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── tanstack-form.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   └── tooltip.tsx
    │   ├── breadcrumbs.tsx
    │   ├── file-uploader.tsx
    │   ├── form-card-skeleton.tsx
    │   ├── github-stars-button.tsx
    │   ├── icons.tsx
    │   ├── nav-main.tsx
    │   ├── nav-projects.tsx
    │   ├── nav-user.tsx
    │   ├── org-switcher.tsx
    │   ├── search-input.tsx
    │   └── user-avatar-profile.tsx
    ├── config/
    │   ├── data-table.ts
    │   ├── infoconfig.ts
    │   └── nav-config.ts
    ├── constants/
    │   ├── mock-api-users.ts
    │   └── mock-api.ts
    ├── features/
    │   ├── react-query-demo/
    │   │   └── info-content.ts
    │   └── users/
    │   │   └── info-content.ts
    ├── hooks/
    │   ├── use-breadcrumbs.tsx
    │   ├── use-callback-ref.tsx
    │   ├── use-controllable-state.tsx
    │   ├── use-data-table.ts
    │   ├── use-debounce.tsx
    │   ├── use-debounced-callback.ts
    │   ├── use-media-query.ts
    │   ├── use-mobile.tsx
    │   ├── use-nav.ts
    │   └── use-stepper.tsx
    ├── lib/
    │   ├── api-client.ts
    │   ├── compose-refs.ts
    │   ├── data-table.ts
    │   ├── format.ts
    │   ├── parsers.ts
    │   ├── query-client.ts
    │   ├── searchparams.ts
    │   └── utils.ts
    ├── styles/
    │   ├── themes/
    │   │   ├── astro-vista.css
    │   │   ├── claude.css
    │   │   ├── light-green.css
    │   │   ├── mono.css
    │   │   ├── neobrutualism.css
    │   │   ├── notebook.css
    │   │   ├── supabase.css
    │   │   ├── vercel.css
    │   │   ├── whatsapp.css
    │   │   └── zen.css
    │   ├── globals.css
    │   └── theme.css
    ├── types/
    │   ├── data-table.ts
    │   └── index.ts
    ├── instrumentation-client.ts
    ├── instrumentation.ts
    └── proxy.ts
├── .dockerignore
├── .gitignore
├── .npmrc
├── .nvmrc
├── .oxfmtrc.json
├── .oxlintrc.json
├── .vercelignore
├── AGENTS.md
├── CLAUDE.md
├── Dockerfile
├── Dockerfile.bun
├── LICENSE
├── README.md
├── bun.lock
├── components.json
├── env.example.txt
├── next.config.ts
├── package.json
├── postcss.config.js
├── skills-lock.json
└── tsconfig.json
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `open-design-main/`

- **Files:** 4793 · **Directories:** 1321
- **Entry:** `README.md`

```
open-design-main/
├── .github/
    ├── actions/
    │   ├── setup-playwright/
    │   │   └── action.yml
    │   ├── setup-workspace/
    │   │   └── action.yml
    │   └── visual-screenshot/
    │   │   └── action.yml
    ├── ISSUE_TEMPLATE/
    │   ├── bug-report.yml
    │   ├── config.yml
    │   ├── feature-request.yml
    │   └── preview-v0.8.0-feedback.yml
    ├── screenshots/
    │   ├── copy-button-copied.png
    │   ├── copy-button-hover.png
    │   ├── copy-prompt-button.png
    │   └── issue-6-fix.png
    ├── scripts/
    │   ├── agent-pr-explore-local.sh
    │   └── agent-pr-explore-sandbox.sh
    ├── workflows/
    │   ├── actionlint.yml
    │   ├── agent-pr-explore-sandbox.yml
    │   ├── agent-pr-explore.lock.yml
    │   ├── blog-3day-report.yml
    │   ├── blog-indexing-monitor.yml
    │   ├── blog-indexing-on-deploy.yml
    │   ├── ci.yml
    │   ├── contributor-card-bot.yml
    │   ├── critique-conformance.yml
    │   ├── discord-resolved.yml
    │   ├── docker-image.yml
    │   ├── fork-pr-workflow-approval.yml
    │   ├── landing-page-ci.yml
    │   ├── landing-page-production.yml
    │   ├── landing-page-staging.yml
    │   ├── metrics.yml
    │   ├── nix-check.yml
    │   ├── nix-hash-autofix.yml
    │   ├── pr-author-inactivity.yml
    │   ├── refresh-contributors-wall.yml
    │   ├── release-beta.yml
    │   ├── release-preview.yml
    │   ├── release-stable.yml
    │   ├── seo-daily-report.yml
    │   ├── stale-issues.yml
    │   ├── visual-baseline.yml
    │   ├── visual-pr-capture.yml
    │   ├── visual-pr-comment.yml
    │   └── visual-pr-verify.yml
    ├── actionlint.yaml
    └── pull_request_template.md
├── .vaunt/
    ├── icons/
    │   ├── beacon.png
    │   ├── node.png
    │   ├── nova.png
    │   ├── signal.png
    │   └── spark.png
    └── config.yaml
├── apps/
    ├── daemon/
    │   ├── src/
    │   │   ├── acp.ts
    │   │   ├── active-context-routes.ts
    │   │   ├── agents.ts
    │   │   ├── analytics.ts
    │   │   ├── app-config.ts
    │   │   ├── app-version.ts
    │   │   ├── artifact-create.ts
    │   │   ├── artifact-manifest.ts
    │   │   ├── artifact-publication-guard.ts
    │   │   ├── artifact-stub-guard.ts
    │   │   ├── artifacts-cli.ts
    │   │   ├── automation-ingestions.ts
    │   │   ├── automation-proposals.ts
    │   │   ├── automation-routine-evolution.ts
    │   │   ├── automation-templates.ts
    │   │   ├── browser-open.ts
    │   │   ├── byok-tools.ts
    │   │   ├── chat-routes.ts
    │   │   ├── claude-design-import.ts
    │   │   ├── claude-diagnostics.ts
    │   │   ├── claude-stream.ts
    │   │   ├── cli.ts
    │   │   ├── codex-pets.ts
    │   │   ├── community-pets-sync.ts
    │   │   ├── connectionTest.ts
    │   │   ├── constants.ts
    │   │   ├── copilot-stream.ts
    │   │   ├── craft.ts
    │   │   ├── cwd-aliases.ts
    │   │   ├── daemon-startup.ts
    │   │   ├── daemon-url.ts
    │   │   ├── db.ts
    │   │   ├── deploy-routes.ts
    │   │   ├── deploy.ts
    │   │   ├── design-system-generation-jobs.ts
    │   │   ├── design-system-github-import.ts
    │   │   ├── design-system-import.ts
    │   │   ├── design-system-preview.ts
    │   │   ├── design-system-rename-args.ts
    │   │   ├── design-system-showcase.ts
    │   │   ├── design-system-source-context.ts
    │   │   ├── design-system-tool-routes.ts
    │   │   ├── design-systems-cli-help.ts
    │   │   ├── design-systems.ts
    │   │   ├── desktop-auth.ts
    │   │   ├── diagnostics-export.ts
    │   │   ├── document-preview.ts
    │   │   ├── elevenlabs-voices.ts
    │   │   ├── finalize-design.ts
    │   │   ├── frontmatter.ts
    │   │   ├── google-models.ts
    │   │   ├── handoff-cli.ts
    │   │   ├── handoff-design.ts
    │   │   ├── handoff-routes.ts
    │   │   ├── home-expansion.ts
    │   │   ├── host-tools-routes.ts
    │   │   ├── import-export-routes.ts
    │   │   ├── inline-assets.ts
    │   │   ├── installation.ts
    │   │   ├── json-event-stream.ts
    │   │   ├── langfuse-bridge.ts
    │   │   ├── langfuse-trace.ts
    │   │   ├── legacy-data-migrator.ts
    │   │   ├── library-install.ts
    │   │   ├── linked-dirs.ts
    │   │   ├── lint-artifact.ts
    │   │   ├── live-artifact-routes.ts
    │   │   ├── mcp-config.ts
    │   │   ├── mcp-install-info.ts
    │   │   ├── mcp-live-artifacts-server.ts
    │   │   ├── mcp-oauth.ts
    │   │   ├── mcp-routes.ts
    │   │   ├── mcp-tokens.ts
    │   │   ├── mcp.ts
    │   │   ├── media-config.ts
    │   │   ├── media-models.ts
    │   │   ├── media-routes.ts
    │   │   ├── media-tasks.ts
    │   │   ├── media.ts
    │   │   ├── memory-connectors.ts
    │   │   ├── memory-extractions.ts
    │   │   ├── memory-llm.ts
    │   │   ├── memory.ts
    │   │   ├── native-folder-dialog.ts
    │   │   ├── openai-chat-token-params.ts
    │   │   ├── orbit-agent-summary.ts
    │   │   ├── orbit.ts
    │   │   ├── origin-validation.ts
    │   │   ├── pdf-export.ts
    │   │   ├── pi-rpc.ts
    │   │   ├── project-ignored-dirs.ts
    │   │   ├── project-routes.ts
    │   │   ├── project-watchers.ts
    │   │   ├── projects.ts
    │   │   ├── prompt-templates.ts
    │   │   ├── providerModels.ts
    │   │   ├── qoder-stream.ts
    │   │   ├── redact.ts
    │   │   ├── route-context-contract.ts
    │   │   ├── routine-routes.ts
    │   │   ├── routines.ts
    │   │   ├── run-artifacts.ts
    │   │   ├── run-result.ts
    │   │   ├── runs.ts
    │   │   ├── server-context.ts
    │   │   ├── server.ts
    │   │   ├── skills.ts
    │   │   ├── static-resource-routes.ts
    │   │   ├── swift-colors.ts
    │   │   ├── tool-tokens.ts
    │   │   ├── tools-connectors-cli.ts
    │   │   ├── tools-design-systems-cli.ts
    │   │   ├── tools-live-artifacts-cli.ts
    │   │   ├── transcript-export.ts
    │   │   ├── update-apply-observations.ts
    │   │   ├── xai-credentials.ts
    │   │   ├── xai-oauth-server.ts
    │   │   ├── xai-oauth.ts
    │   │   ├── xai-routes.ts
    │   │   └── xai-tokens.ts
    │   ├── tests/
    │   │   ├── acp-timeout-env.test.ts
    │   │   ├── acp.test.ts
    │   │   ├── active-context-routes.test.ts
    │   │   ├── agent-runtime-env.test.ts
    │   │   ├── agui-route.test.ts
    │   │   ├── api-token-guard.test.ts
    │   │   ├── app-config.test.ts
    │   │   ├── app-version.test.ts
    │   │   ├── artifact-create.test.ts
    │   │   ├── artifact-manifest.test.ts
    │   │   ├── artifact-publication-guard.test.ts
    │   │   ├── artifact-stub-guard.test.ts
    │   │   ├── artifacts-cli.test.ts
    │   │   ├── automation-ingestions.test.ts
    │   │   ├── automation-proposals.test.ts
    │   │   ├── automation-routine-evolution.test.ts
    │   │   ├── automation-templates.test.ts
    │   │   ├── aws-sigv4.test.ts
    │   │   ├── browser-open.test.ts
    │   │   ├── byok-tools.test.ts
    │   │   ├── chat-attachments.test.ts
    │   │   ├── chat-route.test.ts
    │   │   ├── chat-run-artifact-quiet-period.test.ts
    │   │   ├── claude-design-import.test.ts
    │   │   ├── claude-diagnostics.test.ts
    │   │   ├── cli-startup.test.ts
    │   │   ├── comment-attachments.test.ts
    │   │   ├── composio-config.test.ts
    │   │   ├── composio-descriptions.test.ts
    │   │   ├── connection-test.test.ts
    │   │   ├── connectors-routes.test.ts
    │   │   ├── connectors-service.test.ts
    │   │   ├── craft-route.test.ts
    │   │   ├── craft.test.ts
    │   │   ├── critique-adapter-degraded.test.ts
    │   │   ├── critique-artifact-endpoint.test.ts
    │   │   ├── critique-artifact-writer.test.ts
    │   │   ├── critique-authority.test.ts
    │   │   ├── critique-boot-reconcile.test.ts
    │   │   ├── critique-composer.test.ts
    │   │   ├── critique-config.test.ts
    │   │   ├── critique-conformance-history.test.ts
    │   │   ├── critique-conformance.test.ts
    │   │   ├── critique-interrupt-endpoint.test.ts
    │   │   ├── critique-lifecycle.test.ts
    │   │   ├── critique-orchestrator.test.ts
    │   │   ├── critique-panel-prompt.test.ts
    │   │   ├── critique-persistence.test.ts
    │   │   ├── critique-ratchet.test.ts
    │   │   ├── critique-rollout.test.ts
    │   │   ├── critique-run-registry.test.ts
    │   │   ├── critique-spawn-inputs.test.ts
    │   │   ├── critique-spawn-wiring.test.ts
    │   │   ├── critique-transcript.test.ts
    │   │   ├── cwd-aliases.test.ts
    │   │   ├── daemon-lifecycle.test.ts
    │   │   ├── daemon-url.test.ts
    │   │   ├── db-message-events.test.ts
    │   │   ├── db-pre-turn-file-names.test.ts
    │   │   ├── deploy-routes.test.ts
    │   │   ├── deploy.test.ts
    │   │   ├── design-file-score.test.ts
    │   │   ├── design-system-assets.test.ts
    │   │   ├── design-system-generation-jobs.test.ts
    │   │   ├── design-system-github-import.test.ts
    │   │   ├── design-system-import.test.ts
    │   │   ├── design-system-rename-args.test.ts
    │   │   ├── design-system-showcase.test.ts
    │   │   ├── design-system-source-context.test.ts
    │   │   ├── design-system-tool-routes.test.ts
    │   │   ├── design-systems-cli-help.test.ts
    │   │   ├── design-systems-frontmatter.test.ts
    │   │   ├── design-systems.test.ts
    │   │   ├── desktop-import-token-gate.test.ts
    │   │   ├── diagnostics-export.test.ts
    │   │   ├── elevenlabs-voices.test.ts
    │   │   ├── export-inline-route.test.ts
    │   │   ├── finalize-design.test.ts
    │   │   ├── finalize-route-abort.test.ts
    │   │   ├── folder-import-projects.test.ts
    │   │   ├── folder-import-route.test.ts
    │   │   ├── frame-runtime.test.ts
    │   │   ├── handoff-cli.test.ts
    │   │   ├── handoff-design.test.ts
    │   │   ├── handoff-route-abort.test.ts
    │   │   ├── handoff-route.test.ts
    │   │   ├── installation.test.ts
    │   │   ├── json-event-stream.test.ts
    │   │   ├── langfuse-bridge.test.ts
    │   │   ├── langfuse-trace.test.ts
    │   │   ├── legacy-data-migrator.test.ts
    │   │   ├── linked-dirs.test.ts
    │   │   ├── lint-artifact.test.ts
    │   │   ├── live-artifacts-routes.test.ts
    │   │   ├── live-artifacts-schema.test.ts
    │   │   ├── live-artifacts-store.test.ts
    │   │   ├── mcp-config.test.ts
    │   │   ├── mcp-create-artifact.test.ts
    │   │   ├── mcp-extract-refs.test.ts
    │   │   ├── mcp-get-artifact.test.ts
    │   │   ├── mcp-get-file.test.ts
    │   │   ├── mcp-get-project.test.ts
    │   │   ├── mcp-install-info.test.ts
    │   │   ├── mcp-oauth.test.ts
    │   │   ├── mcp-resolve-project.test.ts
    │   │   ├── mcp-spawn.test.ts
    │   │   ├── mcp-tokens.test.ts
    │   │   ├── mcp-write-tools.test.ts
    │   │   ├── media-alias-capability.test.ts
    │   │   ├── media-config.test.ts
    │   │   ├── media-elevenlabs.test.ts
    │   │   ├── media-grok-tts.test.ts
    │   │   ├── media-nanobanana.test.ts
    │   │   ├── media-openai-compatible-providers.test.ts
    │   │   ├── media-senseaudio-image.test.ts
    │   │   ├── media-senseaudio.test.ts
    │   │   ├── media-tasks-persistence.test.ts
    │   │   ├── media-tasks-routes.test.ts
    │   │   ├── memory-config-route.test.ts
    │   │   ├── memory-connectors.test.ts
    │   │   ├── memory-routes.test.ts
    │   │   ├── memory-tree.test.ts
    │   │   ├── message-delimiter-safety.test.ts
    │   │   ├── native-folder-dialog.test.ts
    │   │   ├── orbit-agent-summary.test.ts
    │   │   ├── orbit.test.ts
    │   │   ├── origin-validation.test.ts
    │   │   ├── parser.test.ts
    │   │   ├── pdf-export.test.ts
    │   │   ├── pi-rpc.test.ts
    │   │   ├── pitch-deck-manifest-required-inputs.test.ts
    │   │   ├── plugins-apply.test.ts
    │   │   ├── plugins-asset-route.test.ts
    │   │   ├── plugins-atom-bodies.test.ts
    │   │   ├── plugins-atom-registry.test.ts
    │   │   ├── plugins-atoms-info.test.ts
    │   │   ├── plugins-auto-surfaces.test.ts
    │   │   ├── plugins-build-test.test.ts
    │   │   ├── plugins-bundled-atom-prompts-default.test.ts
    │   │   ├── plugins-bundled-atoms-roster.test.ts
    │   │   ├── plugins-bundled-scenarios-roster.test.ts
    │   │   ├── plugins-bundled.test.ts
    │   │   ├── plugins-canon.test.ts
    │   │   ├── plugins-code-import.test.ts
    │   │   ├── plugins-code-migration-e2e.test.ts
    │   │   ├── plugins-connector-gate.test.ts
    │   │   ├── plugins-design-extract.test.ts
    │   │   ├── plugins-diff-review-genui-bridge.test.ts
    │   │   ├── plugins-diff-review.test.ts
    │   │   ├── plugins-diff.test.ts
    │   │   ├── plugins-discovery-question-form-contract.test.ts
    │   │   ├── plugins-doctor-route.test.ts
    │   │   ├── plugins-dod-e2e.test.ts
    │   │   ├── plugins-e2e-fixture.test.ts
    │   │   ├── plugins-events-buffer.test.ts
    │   │   ├── plugins-events-producers.test.ts
    │   │   ├── plugins-events-purge.test.ts
    │   │   ├── plugins-events-stats.test.ts
    │   │   ├── plugins-export.test.ts
    │   │   ├── plugins-figma-extract.test.ts
    │   │   ├── plugins-figma-migration-e2e.test.ts
    │   │   ├── plugins-genui-component.test.ts
    │   │   ├── plugins-genui-spec-enrichment.test.ts
    │   │   ├── plugins-handoff-persist.test.ts
    │   │   ├── plugins-handoff-pipeline.test.ts
    │   │   ├── plugins-handoff.test.ts
    │   │   ├── plugins-headless-run.test.ts
    │   │   ├── plugins-installer-archive.test.ts
    │   │   ├── plugins-installer.test.ts
    │   │   ├── plugins-local-skill.test.ts
    │   │   ├── plugins-lockfile.test.ts
    │   │   ├── plugins-marketplace-doctor.test.ts
    │   │   ├── plugins-marketplaces.test.ts
    │   │   ├── plugins-pack.test.ts
    │   │   ├── plugins-patch-edit-atomic.test.ts
    │   │   ├── plugins-patch-edit.test.ts
    │   │   ├── plugins-pipeline-runner.test.ts
    │   │   ├── plugins-preview-fallback.test.ts
    │   │   ├── plugins-preview-route.test.ts
    │   │   ├── plugins-publish.test.ts
    │   │   ├── plugins-rewrite-plan.test.ts
    │   │   ├── plugins-scaffold.test.ts
    │   │   ├── plugins-scenario-fallback.test.ts
    │   │   ├── plugins-search.test.ts
    │   │   ├── plugins-simulate.test.ts
    │   │   ├── plugins-snapshot-diff.test.ts
    │   │   ├── plugins-snapshot-gc.test.ts
    │   │   ├── plugins-snapshots.test.ts
    │   │   ├── plugins-stats.test.ts
    │   │   ├── plugins-token-map.test.ts
    │   │   ├── plugins-tool-token-gate.test.ts
    │   │   ├── plugins-trust.test.ts
    │   │   ├── plugins-until.test.ts
    │   │   ├── plugins-upgrade.test.ts
    │   │   ├── plugins-validate.test.ts
    │   │   ├── plugins-verify.test.ts
    │   │   ├── project-archive.test.ts
    │   │   ├── project-classifiers.test.ts
    │   │   ├── project-design-system-routes.test.ts
    │   │   ├── project-file-range.test.ts
    │   │   ├── project-file-rename.test.ts
    │   │   ├── project-plugin-manifest.test.ts
    │   │   ├── project-status.test.ts
    │   │   ├── project-watchers.test.ts
    │   │   ├── projects-routes.test.ts
    │   │   ├── projects-stub-guard.test.ts
    │   │   ├── proxy-routes.test.ts
    │   │   ├── qa-cta-hierarchy.test.ts
    │   │   ├── qoder-stream.test.ts
    │   │   ├── redact.test.ts
    │   │   ├── registry-backends.test.ts
    │   │   ├── research-cli.test.ts
    │   │   ├── research-contract.test.ts
    │   │   ├── research.test.ts
    │   │   ├── resolve-data-dir.test.ts
    │   │   ├── routine-routes.test.ts
    │   │   ├── routines.test.ts
    │   │   ├── run-artifacts.test.ts
    │   │   ├── run-result.test.ts
    │   │   ├── runs.test.ts
    │   │   ├── sanitize-name.test.ts
    │   │   ├── server-cors.test.ts
    │   │   ├── server-keepalive.test.ts
    │   │   ├── server-paths.test.ts
    │   │   ├── setup.ts
    │   │   ├── sidecar-server.test.ts
    │   │   ├── sidecar-startup.test.ts
    │   │   ├── sidecar-status-snapshot.test.ts
    │   │   ├── skill-asset-rewrite.test.ts
    │   │   ├── skill-id-aliases.test.ts
    │   │   ├── skills-delete-route.test.ts
    │   │   ├── skills.test.ts
    │   │   ├── sse-response.test.ts
    │   │   ├── static-resource-routes.test.ts
    │   │   ├── static-spa-fallback.test.ts
    │   │   ├── storage-db-inspect.test.ts
    │   │   ├── storage-db-verify.test.ts
    │   │   ├── storage.test.ts
    │   │   ├── structured-streams.test.ts
    │   │   ├── swift-colors.test.ts
    │   │   ├── system-prompt-template.test.ts
    │   │   ├── telemetry-message-finalization.test.ts
    │   │   ├── tool-tokens.test.ts
    │   │   ├── tools-connectors-cli.test.ts
    │   │   ├── tools-live-artifacts-cli.test.ts
    │   │   ├── transcript-export.test.ts
    │   │   ├── uncaught-fatal-shutdown.test.ts
    │   │   ├── update-apply-observations.test.ts
    │   │   ├── version-route.test.ts
    │   │   ├── xai-credentials.test.ts
    │   │   ├── xai-oauth-server.test.ts
    │   │   ├── xai-oauth.test.ts
    │   │   ├── xai-routes.test.ts
    │   │   └── xai-tokens.test.ts
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsconfig.tests.json
    │   └── vitest.config.ts
    ├── desktop/
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsconfig.tests.json
    │   └── vitest.config.ts
    ├── landing-page/
    │   ├── app/
    │   │   ├── content-i18n.ts
    │   │   ├── content.config.ts
    │   │   ├── env.d.ts
    │   │   ├── globals.css
    │   │   ├── home-page-i18n.ts
    │   │   ├── i18n.ts
    │   │   ├── image-assets.ts
    │   │   ├── info-page-i18n.ts
    │   │   ├── landing-ui-i18n.ts
    │   │   ├── page.tsx
    │   │   ├── plugin-registry.ts
    │   │   └── sub-pages.css
    │   ├── public/
    │   │   ├── 96b0928121e24fd7b4ef85ae0f8bf1d8.txt
    │   │   ├── _headers
    │   │   ├── _redirects
    │   │   ├── android-chrome-192x192.png
    │   │   ├── android-chrome-512x512.png
    │   │   ├── apple-touch-icon.png
    │   │   ├── favicon-16x16.png
    │   │   ├── favicon-32x32.png
    │   │   ├── favicon.ico
    │   │   ├── favicon.png
    │   │   ├── favicon.svg
    │   │   ├── llms.txt
    │   │   ├── logo.png
    │   │   ├── logo.webp
    │   │   ├── robots.txt
    │   │   └── site.webmanifest
    │   ├── scripts/
    │   │   ├── copy-example-html.ts
    │   │   ├── fallback-preview-card.ts
    │   │   ├── generate-previews.ts
    │   │   └── seo-daily-report.ts
    │   ├── AGENTS.md
    │   ├── astro.config.ts
    │   ├── package.json
    │   └── tsconfig.json
    ├── packaged/
    │   ├── src/
    │   │   ├── config.ts
    │   │   ├── errors.ts
    │   │   ├── headless.ts
    │   │   ├── identity.ts
    │   │   ├── index.ts
    │   │   ├── launch.ts
    │   │   ├── logging.ts
    │   │   ├── paths.ts
    │   │   ├── protocol.ts
    │   │   └── sidecars.ts
    │   ├── tests/
    │   │   ├── desktop-pick-and-import.test.ts
    │   │   ├── desktop-project-root-gate.test.ts
    │   │   ├── desktop-url-allowlist.test.ts
    │   │   ├── identity.test.ts
    │   │   ├── launch.test.ts
    │   │   ├── logging.test.ts
    │   │   ├── paths.test.ts
    │   │   ├── protocol.test.ts
    │   │   └── sidecars.test.ts
    │   ├── AGENTS.md
    │   ├── README.md
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsconfig.tests.json
    │   └── vitest.config.ts
    ├── telemetry-worker/
    │   ├── src/
    │   │   └── index.ts
    │   ├── tests/
    │   │   └── index.test.ts
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vitest.config.ts
    │   └── wrangler.toml
    ├── web/
    │   ├── app/
    │   │   └── layout.tsx
    │   ├── public/
    │   │   ├── app-icon.png
    │   │   ├── app-icon.svg
    │   │   ├── avatar.png
    │   │   ├── brand-icon.svg
    │   │   ├── logo.png
    │   │   ├── logo.svg
    │   │   └── od-notifications-sw.js
    │   ├── sidecar/
    │   │   ├── index.ts
    │   │   └── server.ts
    │   ├── src/
    │   │   ├── App.tsx
    │   │   ├── api-attachment-context.ts
    │   │   ├── comments.ts
    │   │   ├── design-system-auto-prompt.ts
    │   │   ├── index.css
    │   │   ├── quickSwitcherRecents.ts
    │   │   ├── router.ts
    │   │   └── types.ts
    │   ├── tests/
    │   │   ├── App.test.ts
    │   │   ├── analytics-app-version.test.tsx
    │   │   ├── analytics-configure-globals.test.ts
    │   │   ├── analytics-identity.test.ts
    │   │   ├── analytics-scrub.test.ts
    │   │   ├── api-attachment-context.test.ts
    │   │   ├── comments.test.ts
    │   │   ├── host-boundary.test.ts
    │   │   ├── quickSwitcherRecents.test.ts
    │   │   ├── router-marketplace.test.ts
    │   │   ├── router.test.ts
    │   │   └── sidecar-proxy.test.ts
    │   ├── next-env.d.ts
    │   ├── next.config.ts
    │   ├── package.json
    │   ├── postcss.config.mjs
    │   ├── tsconfig.json
    │   ├── tsconfig.sidecar.json
    │   └── vitest.config.ts
    └── AGENTS.md
├── assets/
    ├── community-pets/
    │   ├── clippit/
    │   │   ├── pet.json
    │   │   └── spritesheet.webp
    │   ├── dario/
    │   │   ├── pet.json
    │   │   └── spritesheet.webp
    │   ├── dentist/
    │   │   ├── pet.json
    │   │   └── spritesheet.webp
    │   ├── nyako-shigure/
    │   │   ├── pet.json
    │   │   └── spritesheet.webp
    │   ├── slavik/
    │   │   ├── pet.json
    │   │   └── spritesheet.webp
    │   ├── tux/
    │   │   ├── pet.json
    │   │   └── spritesheet.webp
    │   ├── yelling-dario/
    │   │   ├── pet.json
    │   │   └── spritesheet.webp
    │   └── yorha-sit-2b/
    │   │   ├── pet.json
    │   │   └── spritesheet.webp
    ├── frames/
    │   ├── README.md
    │   ├── android-pixel.html
    │   ├── browser-chrome.html
    │   ├── ipad-pro.html
    │   ├── iphone-15-pro.html
    │   └── macbook.html
    └── prompt-templates/
    │   ├── image/
    │       ├── game-screenshot-anime-fighting-game-captain-ryuuga-vs-kaze-renshin.jpg
    │       ├── game-screenshot-three-kingdoms-guanyu-slaying-yanliang.jpg
    │       ├── game-screenshot-three-kingdoms-lyubu-yuanmen-archery.jpg
    │       ├── game-screenshot-three-kingdoms-zhaoyun-cradle-escape.jpg
    │       ├── game-ui-ancient-china-open-world-mmo-hud.jpg
    │       ├── illustration-crayon-kid-drawing-rework.jpg
    │       ├── infographic-otaku-dance-choreography-breakdown-gokurakujodo-16-panels.jpg
    │       └── social-media-post-sensational-girl-dance-storyboard-8-shots.jpg
    │   └── video/
    │       ├── video-seedance-three-kingdoms-guanyu-slaying-yanliang-poster.jpg
    │       ├── video-seedance-three-kingdoms-guanyu-slaying-yanliang.mp4
    │       ├── video-seedance-three-kingdoms-lyubu-yuanmen-archery-poster.jpg
    │       ├── video-seedance-three-kingdoms-lyubu-yuanmen-archery.mp4
    │       ├── video-seedance-three-kingdoms-zhaoyun-cradle-escape-poster.jpg
    │       └── video-seedance-three-kingdoms-zhaoyun-cradle-escape.mp4
├── charts/
    └── open-design/
    │   ├── templates/
    │       ├── _helpers.tpl
    │       ├── configmap.yaml
    │       ├── deployment.yaml
    │       ├── hpa.yaml
    │       ├── ingress.yaml
    │       ├── proxy-configmap.yaml
    │       ├── pvc.yaml
    │       ├── secret.yaml
    │       └── service.yaml
    │   ├── .helmignore
    │   ├── Chart.yaml
    │   ├── README.md
    │   └── values.yaml
├── craft/
    ├── README.md
    ├── accessibility-baseline.md
    ├── animation-discipline.md
    ├── anti-ai-slop.md
    ├── color.md
    ├── form-validation.md
    ├── laws-of-ux.md
    ├── rtl-and-bidi.md
    ├── state-coverage.md
    ├── typography-hierarchy-editorial.md
    ├── typography-hierarchy.md
    └── typography.md
├── data/
    ├── cards/
    │   ├── 522700967-wq-spark-1779808643996.svg
    │   ├── AmyShang-alt-signal-1779807197303.svg
    │   ├── alchemistklk-signal-1779814803277.svg
    │   ├── ashleyashli-spark-1779799491524.svg
    │   ├── ashleyashli-spark-1779799735875.svg
    │   ├── ashleytheash-spark-1779799311384.svg
    │   ├── ashleytheash-spark-1779800077793.svg
    │   ├── ashleytheash-spark-1779800343996.svg
    │   ├── ashleytheash-spark-1779800739588.svg
    │   ├── jinmeihong0201-gif-signal-1779804080602.svg
    │   ├── lefarcen-signal-1779800669367.svg
    │   ├── leno23-signal-1779807904177.svg
    │   ├── mturac-signal-1779808381915.svg
    │   ├── xiaobinHub-spark-1779805441673.svg
    │   └── xxiaoxiong-spark-1779805356349.svg
    ├── contributors.json
    └── events.jsonl
├── deploy/
    ├── scripts/
    │   ├── install.sh
    │   ├── prepare-colima-build-swap.sh
    │   ├── publish-images.sh
    │   ├── uninstall.sh
    │   ├── update.sh
    │   ├── verify-image-manifest.sh
    │   └── verify-image.sh
    ├── tests/
    │   ├── install.test.ts
    │   └── prepare-colima-build-swap.test.ts
    ├── .env.example
    ├── .gitignore
    ├── Dockerfile
    ├── README.md
    └── docker-compose.yml
├── design-systems/
    ├── _schema/
    │   ├── AGENTS.md
    │   ├── defaults.css
    │   ├── manifest.schema.ts
    │   └── tokens.schema.ts
    ├── agentic/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── airbnb/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── airtable/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── ant/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── apple/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── application/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── arc/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── artistic/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── atelier-zero/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── bento/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── binance/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── bmw/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── bmw-m/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── bold/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── brutalism/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── bugatti/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── cafe/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── cal/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── canva/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── cisco/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── claude/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── clay/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── claymorphism/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── clean/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── clickhouse/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── cohere/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── coinbase/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── colorful/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── composio/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── contemporary/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── corporate/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── cosmic/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── creative/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── cursor/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── dashboard/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── default/
    │   ├── preview/
    │   │   ├── app.html
    │   │   ├── colors.html
    │   │   ├── components-buttons.html
    │   │   ├── components-inputs.html
    │   │   ├── spacing.html
    │   │   └── typography.html
    │   ├── DESIGN.md
    │   ├── USAGE.md
    │   ├── components.html
    │   ├── components.manifest.json
    │   ├── manifest.json
    │   └── tokens.css
    ├── discord/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── dithered/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── doodle/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── dramatic/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── duolingo/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── editorial/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── elegant/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── elevenlabs/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── energetic/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── enterprise/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── expo/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── expressive/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── fantasy/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── ferrari/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── figma/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── flat/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── framer/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── friendly/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── futuristic/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── github/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── glassmorphism/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── gradient/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── hashicorp/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── hud/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── huggingface/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── ibm/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── intercom/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── kami/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── kraken/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── lamborghini/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── levels/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── linear-app/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── lingo/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── loom/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── lovable/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── luxury/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── mastercard/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── material/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── meta/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── minimal/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── minimax/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── mintlify/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── miro/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── mission-control/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── mistral-ai/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── modern/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── mongodb/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── mono/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── neobrutalism/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── neon/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── neumorphism/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── nike/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── notion/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── nvidia/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── ollama/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── openai/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── opencode-ai/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── pacman/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── paper/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── perplexity/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── perspective/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── pinterest/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── playstation/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── posthog/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── premium/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── professional/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── publication/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── raycast/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── refined/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── renault/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── replicate/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── resend/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── retro/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── revolut/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── runwayml/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── sanity/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── sentry/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── shadcn/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── shopify/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── simple/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── skeumorphism/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── slack/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── sleek/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── spacex/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── spacious/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── spotify/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── starbucks/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── storytelling/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── stripe/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── supabase/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── superhuman/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── tesla/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── tetris/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── theverge/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── together-ai/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── totality-festival/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── trading-terminal/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── uber/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── urdu/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── vercel/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── vibrant/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── vintage/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── vodafone/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── voltagent/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── warm-editorial/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── warp/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── webex/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── webflow/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── wechat/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── wired/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── wise/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── x-ai/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── xiaohongshu/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    ├── zapier/
    │   ├── DESIGN.md
    │   ├── components.html
    │   └── tokens.css
    └── README.md
├── design-templates/
    ├── audio-jingle/
    │   ├── SKILL.md
    │   └── example.html
    ├── blog-post/
    │   ├── SKILL.md
    │   └── example.html
    ├── clinical-case-report/
    │   ├── examples/
    │   │   └── example-stemi.html
    │   ├── references/
    │   │   ├── case-formats.md
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── critique/
    │   ├── SKILL.md
    │   └── example.html
    ├── dashboard/
    │   ├── SKILL.md
    │   └── example.html
    ├── dating-web/
    │   ├── SKILL.md
    │   └── example.html
    ├── dcf-valuation/
    │   ├── references/
    │   │   └── sector-wacc.md
    │   └── SKILL.md
    ├── digital-eguide/
    │   ├── SKILL.md
    │   └── example.html
    ├── docs-page/
    │   ├── SKILL.md
    │   └── example.html
    ├── email-marketing/
    │   ├── SKILL.md
    │   └── example.html
    ├── eng-runbook/
    │   ├── SKILL.md
    │   └── example.html
    ├── finance-report/
    │   ├── SKILL.md
    │   └── example.html
    ├── flowai-live-dashboard-template/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── gamified-app/
    │   ├── SKILL.md
    │   └── example.html
    ├── github-dashboard/
    │   ├── references/
    │   │   ├── README.md
    │   │   ├── artifact-example.json
    │   │   ├── example-data.json
    │   │   ├── provenance-example.json
    │   │   └── template.html
    │   ├── SKILL.md
    │   └── example.html
    ├── guizang-ppt/
    │   ├── assets/
    │   │   ├── example-slides.html
    │   │   └── template.html
    │   ├── references/
    │   │   ├── checklist.md
    │   │   ├── components.md
    │   │   ├── layouts.md
    │   │   ├── styles.md
    │   │   └── themes.md
    │   ├── LICENSE
    │   ├── README.en.md
    │   ├── README.md
    │   ├── README.pt-BR.md
    │   └── SKILL.md
    ├── hr-onboarding/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt/
    │   ├── assets/
    │   │   ├── base.css
    │   │   ├── fonts.css
    │   │   └── runtime.js
    │   ├── references/
    │   │   ├── animations.md
    │   │   ├── authoring-guide.md
    │   │   ├── full-decks.md
    │   │   ├── layouts.md
    │   │   ├── presenter-mode.md
    │   │   └── themes.md
    │   ├── scripts/
    │   │   ├── new-deck.sh
    │   │   └── render.sh
    │   ├── templates/
    │   │   ├── animation-showcase.html
    │   │   ├── deck.html
    │   │   ├── full-decks-index.html
    │   │   ├── layout-showcase.html
    │   │   └── theme-showcase.html
    │   ├── .clawscan-allow
    │   ├── LICENSE
    │   ├── README.md
    │   ├── README.pt-BR.md
    │   ├── README.zh-CN.md
    │   └── SKILL.md
    ├── html-ppt-course-module/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-dir-key-nav-minimal/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-graphify-dark-graph/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-hermes-cyber-terminal/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-knowledge-arch-blueprint/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-obsidian-claude-gradient/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-pitch-deck/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-presenter-mode-reveal/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-product-launch/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-taste-brutalist/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-taste-editorial/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-tech-sharing/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-testing-safety-alert/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-weekly-report/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-xhs-pastel-card/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-xhs-post/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-xhs-white-editorial/
    │   ├── SKILL.md
    │   └── example.html
    ├── html-ppt-zhangzara-8-bit-orbit/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-biennale-yellow/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-block-frame/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-blue-professional/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-bold-poster/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-broadside/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-capsule/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-cartesian/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-cobalt-grid/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-coral/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-creative-mode/
    │   ├── assets/
    │   │   └── deck-stage.js
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-daisy-days/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-editorial-tri-tone/
    │   ├── assets/
    │   │   └── deck-stage.js
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-grove/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-long-table/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-mat/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-monochrome/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-neo-grid-bold/
    │   ├── assets/
    │   │   └── deck-stage.js
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-peoples-platform/
    │   ├── assets/
    │   │   └── deck-stage.js
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-pin-and-paper/
    │   ├── assets/
    │   │   ├── deck-stage.js
    │   │   └── styles.css
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-pink-script/
    │   ├── assets/
    │   │   └── deck-stage.js
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-playful/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-raw-grid/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-retro-windows/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-retro-zine/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-sakura-chroma/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-scatterbrain/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-signal/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-soft-editorial/
    │   ├── assets/
    │   │   └── deck-stage.js
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-stencil-tablet/
    │   ├── assets/
    │   │   └── deck-stage.js
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-studio/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── html-ppt-zhangzara-vellum/
    │   ├── LICENSE
    │   ├── SKILL.md
    │   ├── example.html
    │   └── template.json
    ├── hyperframes/
    │   ├── palettes/
    │   │   ├── bold-energetic.md
    │   │   ├── clean-corporate.md
    │   │   ├── dark-premium.md
    │   │   ├── jewel-rich.md
    │   │   ├── monochrome.md
    │   │   ├── nature-earth.md
    │   │   ├── neon-electric.md
    │   │   ├── pastel-soft.md
    │   │   └── warm-editorial.md
    │   ├── references/
    │   │   ├── audio-reactive.md
    │   │   ├── captions.md
    │   │   ├── css-patterns.md
    │   │   ├── dynamic-techniques.md
    │   │   ├── html-in-canvas.md
    │   │   ├── motion-principles.md
    │   │   ├── transcript-guide.md
    │   │   ├── transitions.md
    │   │   ├── tts.md
    │   │   └── typography.md
    │   ├── scripts/
    │   │   ├── animation-map.mjs
    │   │   ├── contrast-report.mjs
    │   │   └── package-loader.mjs
    │   ├── SKILL.md
    │   ├── data-in-motion.md
    │   ├── house-style.md
    │   ├── patterns.md
    │   └── visual-styles.md
    ├── ib-pitch-book/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   ├── attribution.md
    │   │   ├── checklist.md
    │   │   ├── compliance.md
    │   │   └── conventions.md
    │   ├── SKILL.md
    │   └── example.html
    ├── image-poster/
    │   ├── SKILL.md
    │   └── example.html
    ├── invoice/
    │   ├── SKILL.md
    │   └── example.html
    ├── kami-deck/
    │   ├── README.md
    │   ├── SKILL.md
    │   └── example.html
    ├── kami-landing/
    │   ├── README.md
    │   ├── SKILL.md
    │   └── example.html
    ├── kanban-board/
    │   ├── SKILL.md
    │   └── example.html
    ├── last30days/
    │   ├── references/
    │   │   └── save-html-brief.md
    │   ├── scripts/
    │   │   ├── briefing.py
    │   │   ├── last30days.py
    │   │   ├── store.py
    │   │   └── watchlist.py
    │   ├── LICENSE
    │   └── SKILL.md
    ├── live-artifact/
    │   ├── examples/
    │   │   ├── baby-health-live.html
    │   │   ├── competitor-radar-live.html
    │   │   ├── crm-table-live.html
    │   │   ├── crypto-dashboard.html
    │   │   ├── monday-operator-live.html
    │   │   └── stock-dashboard.html
    │   ├── references/
    │   │   ├── artifact-schema.md
    │   │   ├── connector-policy.md
    │   │   └── refresh-contract.md
    │   └── SKILL.md
    ├── live-dashboard/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   ├── checklist.md
    │   │   ├── components.md
    │   │   ├── connectors.md
    │   │   └── layouts.md
    │   ├── SKILL.md
    │   └── example.html
    ├── magazine-poster/
    │   ├── SKILL.md
    │   └── example.html
    ├── meeting-notes/
    │   ├── SKILL.md
    │   └── example.html
    ├── mobile-app/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   ├── checklist.md
    │   │   └── layouts.md
    │   ├── SKILL.md
    │   └── example.html
    ├── mobile-onboarding/
    │   ├── SKILL.md
    │   └── example.html
    ├── motion-frames/
    │   ├── SKILL.md
    │   └── example.html
    ├── open-design-landing/
    │   ├── assets/
    │   │   ├── about.png
    │   │   ├── capabilities.png
    │   │   ├── cta.png
    │   │   ├── hero.png
    │   │   ├── image-manifest.json
    │   │   ├── imagegen-prompts.md
    │   │   ├── lab-1.png
    │   │   ├── lab-2.png
    │   │   ├── lab-3.png
    │   │   ├── lab-4.png
    │   │   ├── lab-5.png
    │   │   ├── method-1.png
    │   │   ├── method-2.png
    │   │   ├── method-3.png
    │   │   ├── method-4.png
    │   │   ├── testimonial.png
    │   │   ├── work-1.png
    │   │   └── work-2.png
    │   ├── scripts/
    │   │   ├── compose.ts
    │   │   ├── imagegen.ts
    │   │   └── placeholder.ts
    │   ├── README.md
    │   ├── SKILL.md
    │   ├── example.html
    │   ├── inputs.example.json
    │   ├── schema.ts
    │   └── styles.css
    ├── open-design-landing-deck/
    │   ├── scripts/
    │   │   └── compose.ts
    │   ├── README.md
    │   ├── SKILL.md
    │   ├── example.html
    │   ├── inputs.example.json
    │   └── schema.ts
    ├── orbit-general/
    │   ├── SKILL.md
    │   └── example.html
    ├── orbit-github/
    │   ├── SKILL.md
    │   └── example.html
    ├── orbit-gmail/
    │   ├── SKILL.md
    │   └── example.html
    ├── orbit-linear/
    │   ├── SKILL.md
    │   └── example.html
    ├── orbit-notion/
    │   ├── SKILL.md
    │   └── example.html
    ├── pm-spec/
    │   ├── SKILL.md
    │   └── example.html
    ├── pricing-page/
    │   ├── SKILL.md
    │   └── example.html
    ├── replit-deck/
    │   ├── assets/
    │   │   └── template.html
    │   ├── examples/
    │   │   ├── README.md
    │   │   ├── example-atlas.html
    │   │   ├── example-bluehouse.html
    │   │   ├── example-helix.html
    │   │   └── example-holm.html
    │   ├── references/
    │   │   ├── checklist.md
    │   │   ├── components.md
    │   │   ├── layouts.md
    │   │   └── themes.md
    │   └── SKILL.md
    ├── saas-landing/
    │   ├── SKILL.md
    │   └── example.html
    ├── simple-deck/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   ├── checklist.md
    │   │   └── layouts.md
    │   ├── SKILL.md
    │   └── example.html
    ├── social-carousel/
    │   ├── SKILL.md
    │   └── example.html
    ├── social-media-dashboard/
    │   ├── .preview/
    │   │   └── hero.png
    │   ├── SKILL.md
    │   └── example.html
    ├── social-media-matrix-tracker-template/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── sprite-animation/
    │   ├── SKILL.md
    │   └── example.html
    ├── team-okrs/
    │   ├── SKILL.md
    │   └── example.html
    ├── trading-analysis-dashboard-template/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── tweaks/
    │   ├── assets/
    │   │   └── wrap.html
    │   ├── SKILL.md
    │   └── example.html
    ├── video-shortform/
    │   ├── SKILL.md
    │   └── example.html
    ├── waitlist-page/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── web-prototype/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   ├── checklist.md
    │   │   └── layouts.md
    │   ├── SKILL.md
    │   └── example.html
    ├── web-prototype-taste-brutalist/
    │   ├── SKILL.md
    │   └── example.html
    ├── web-prototype-taste-editorial/
    │   ├── SKILL.md
    │   └── example.html
    ├── web-prototype-taste-soft/
    │   ├── SKILL.md
    │   └── example.html
    ├── weekly-update/
    │   ├── SKILL.md
    │   └── example.html
    ├── wireframe-sketch/
    │   ├── SKILL.md
    │   └── example.html
    ├── x-research/
    │   └── SKILL.md
    └── AGENTS.md
├── docs/
    ├── adr/
    │   └── 0001-centralize-daemon-startup.md
    ├── assets/
    │   ├── _cover/
    │   │   ├── banner.html
    │   │   ├── library.html
    │   │   └── star.html
    │   ├── banner.png
    │   ├── banner.svg
    │   ├── design-systems-library.png
    │   ├── design-systems-library.svg
    │   ├── github-metrics.svg
    │   ├── logo.png
    │   └── star-us.png
    ├── deployment/
    │   └── docker.md
    ├── examples/
    │   ├── saas-landing-skill/
    │   │   └── SKILL.md
    │   └── DESIGN.sample.md
    ├── plans/
    │   ├── manual-edit-mode-implementation.md
    │   ├── plugin-registry.md
    │   └── plugins-implementation.md
    ├── rfc-drafts/
    │   └── dev-server-auto-detect.md
    ├── schemas/
    │   ├── open-design.marketplace.v1.json
    │   └── open-design.plugin.v1.json
    ├── screenshots/
    │   ├── skills/
    │   │   ├── dating-web.png
    │   │   ├── deck-guizang-editorial.png
    │   │   ├── deck-swiss-international.png
    │   │   ├── digital-eguide.png
    │   │   ├── doc-kami-parchment.png
    │   │   ├── email-marketing.png
    │   │   ├── flowai-live-dashboard-template.png
    │   │   ├── frame-glitch-title.png
    │   │   ├── frame-logo-outro.png
    │   │   ├── gamified-app.png
    │   │   ├── github-dashboard.png
    │   │   ├── live-dashboard.png
    │   │   ├── magazine-poster.png
    │   │   ├── mobile-onboarding.png
    │   │   ├── motion-frames.png
    │   │   ├── research-decision-room.png
    │   │   ├── social-carousel.png
    │   │   ├── sprite-animation.png
    │   │   ├── vfx-text-cursor.png
    │   │   ├── video-hyperframes.png
    │   │   └── waitlist-page.png
    │   ├── 01-entry-view.png
    │   ├── 01-entry-view.svg
    │   ├── 02-question-form.png
    │   ├── 02-question-form.svg
    │   ├── 03-direction-picker.png
    │   ├── 03-direction-picker.svg
    │   ├── 04-todo-progress.png
    │   ├── 04-todo-progress.svg
    │   ├── 05-preview-iframe.png
    │   ├── 05-preview-iframe.svg
    │   ├── 06-design-systems-library.png
    │   ├── 06-design-systems-library.svg
    │   ├── 07-magazine-deck.png
    │   ├── 07-magazine-deck.svg
    │   ├── 08-mobile-app.png
    │   └── 08-mobile-app.svg
    ├── superpowers/
    │   └── plans/
    │   │   └── 2026-05-10-linux-client-parity.md
    ├── testing/
    │   ├── e2e-coverage/
    │   │   ├── README.md
    │   │   ├── desktop.md
    │   │   ├── entry.md
    │   │   ├── project-management.md
    │   │   ├── settings.md
    │   │   ├── status.md
    │   │   └── workspace.md
    │   ├── home-entry-coverage-summary.zh-CN.md
    │   ├── html-preview-coverage-summary.zh-CN.md
    │   ├── plugin-registry-eval-cases.md
    │   └── plugin-system-test-suite.md
    ├── agent-adapters.md
    ├── architecture.md
    ├── atoms.md
    ├── blog-indexing-automation.md
    ├── blog-indexing-status.json
    ├── blog-indexing-status.md
    ├── blog-traffic-digest.md
    ├── code-review-guidelines.md
    ├── codex-pets.md
    ├── critique-theater.md
    ├── design-systems.md
    ├── install-guide.md
    ├── modes.md
    ├── new-agent-runtime-acp.md
    ├── notebooklm.md
    ├── plugins-spec.md
    ├── plugins-spec.zh-CN.md
    ├── publishing-a-plugin.md
    ├── publishing-a-plugin.zh-CN.md
    ├── references.md
    ├── roadmap.md
    ├── self-hosting-a-registry.md
    ├── seo-daily-report.md
    ├── skills-contributing.md
    ├── skills-protocol.md
    ├── spec.md
    ├── v0.8.0-announcement.md
    ├── v0.8.0-announcement.zh-CN.md
    └── windows-troubleshooting.md
├── e2e/
    ├── lib/
    │   ├── desktop/
    │   │   └── desktop-test-helpers.ts
    │   ├── playwright/
    │   │   ├── fake-agents.ts
    │   │   ├── mock-factory.ts
    │   │   ├── resources.ts
    │   │   └── visual.ts
    │   ├── vitest/
    │   │   ├── artifacts.ts
    │   │   ├── http.ts
    │   │   ├── live-artifacts.ts
    │   │   ├── messages.ts
    │   │   ├── mock-openai.ts
    │   │   ├── orbit.ts
    │   │   ├── packaged-release-version.ts
    │   │   ├── packaged-report.ts
    │   │   ├── packaged-update-scenario.ts
    │   │   ├── packaged-win-identity.ts
    │   │   ├── pets.ts
    │   │   ├── report.ts
    │   │   ├── runs.ts
    │   │   ├── smoke-suite.ts
    │   │   └── tools-dev.ts
    │   ├── fake-agents.ts
    │   ├── linux-helpers.ts
    │   └── timeouts.ts
    ├── resources/
    │   └── playwright.ts
    ├── scripts/
    │   ├── playwright.ts
    │   ├── release-smoke.ts
    │   └── visual-report.ts
    ├── specs/
    │   ├── dialog/
    │   │   └── main.spec.ts
    │   ├── namespace/
    │   │   └── main.spec.ts
    │   ├── orbit/
    │   │   └── run.spec.ts
    │   ├── pet/
    │   │   └── main.spec.ts
    │   ├── linux.spec.ts
    │   ├── mac.spec.ts
    │   └── win.spec.ts
    ├── tests/
    │   ├── dialog/
    │   │   ├── artifact-consistency.test.ts
    │   │   ├── retry-after-stop.test.ts
    │   │   └── stop-reconciles-message.test.ts
    │   ├── frames/
    │   │   └── screen-resolution.test.ts
    │   ├── packaged/
    │   │   └── update-scenario.test.ts
    │   ├── report/
    │   │   └── lifecycle.test.ts
    │   ├── tools-dev/
    │   │   └── inspect.test.ts
    │   ├── critique-coverage.test.ts
    │   ├── linux-helpers.test.ts
    │   ├── localized-content.test.ts
    │   ├── packaged-release-version.test.ts
    │   ├── packaged-smoke-workflow.test.ts
    │   ├── packaged-win-identity.test.ts
    │   └── visual-report.test.ts
    ├── ui/
    │   ├── api-empty-response.test.ts
    │   ├── app-design-files.test.ts
    │   ├── app-manual-edit.test.ts
    │   ├── app-restoration.test.ts
    │   ├── app.test.ts
    │   ├── chat-todo-autoscroll.test.ts
    │   ├── critical-smoke.test.ts
    │   ├── critique-theater.test.ts
    │   ├── entry-chrome-flows.test.ts
    │   ├── entry-configuration-flows.test.ts
    │   ├── entry-topbar.test.ts
    │   ├── home-hero-rail.test.ts
    │   ├── project-management-flows.test.ts
    │   ├── real-daemon-run.test.ts
    │   ├── settings-api-protocol.test.ts
    │   ├── settings-connectors-auth-happy-path.test.ts
    │   ├── settings-connectors-auth-recovery.test.ts
    │   ├── settings-hover-contrast.test.ts
    │   ├── settings-local-cli-codex-fallback.test.ts
    │   ├── settings-media-providers.test.ts
    │   ├── settings-memory-routines.test.ts
    │   ├── visual-home.test.ts
    │   └── workspace-keyboard-flows.test.ts
    ├── AGENTS.md
    ├── package.json
    ├── playwright.config.ts
    ├── playwright.visual.config.ts
    ├── tsconfig.json
    └── vitest.config.ts
├── nix/
    ├── README.md
    ├── home-manager.nix
    ├── module-common.nix
    ├── nixos.nix
    ├── package-daemon.nix
    ├── package-web.nix
    └── pnpm-deps.nix
├── packages/
    ├── agui-adapter/
    │   ├── src/
    │   │   ├── encode.ts
    │   │   ├── index.ts
    │   │   └── types.ts
    │   ├── tests/
    │   │   └── encode.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    ├── contracts/
    │   ├── src/
    │   │   ├── common.ts
    │   │   ├── critique.ts
    │   │   ├── errors.ts
    │   │   ├── examples.ts
    │   │   ├── index.ts
    │   │   └── tasks.ts
    │   ├── tests/
    │   │   ├── analytics-design-system-helpers.test.ts
    │   │   ├── atom-block.test.ts
    │   │   ├── automations.test.ts
    │   │   ├── components-manifest.test.ts
    │   │   ├── connection-test.test.ts
    │   │   ├── critique.test.ts
    │   │   ├── handoff-contract.test.ts
    │   │   ├── package-runtime.test.ts
    │   │   ├── plugins-manifest.test.ts
    │   │   ├── scenario-defaults.test.ts
    │   │   ├── system-prompt-active-design-system.test.ts
    │   │   ├── system-prompt-api-mode.test.ts
    │   │   ├── system-prompt-audio-voices.test.ts
    │   │   └── system-prompt.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    ├── diagnostics/
    │   ├── src/
    │   │   ├── contract.ts
    │   │   ├── index.ts
    │   │   ├── manifest.ts
    │   │   ├── redaction.ts
    │   │   ├── sources.ts
    │   │   └── zip.ts
    │   ├── tests/
    │   │   ├── redaction.test.ts
    │   │   └── zip.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── vitest.config.ts
    ├── download/
    │   ├── src/
    │   │   └── index.ts
    │   ├── tests/
    │   │   └── index.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    ├── host/
    │   ├── src/
    │   │   ├── index.ts
    │   │   └── testing.ts
    │   ├── tests/
    │   │   └── index.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    ├── platform/
    │   ├── src/
    │   │   └── index.ts
    │   ├── tests/
    │   │   └── index.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    ├── plugin-runtime/
    │   ├── src/
    │   │   ├── digest.ts
    │   │   ├── index.ts
    │   │   ├── merge.ts
    │   │   ├── pipeline-fallback.ts
    │   │   ├── resolve.ts
    │   │   └── validate.ts
    │   ├── tests/
    │   │   ├── adapter-agent-skill.test.ts
    │   │   ├── digest.test.ts
    │   │   ├── merge.test.ts
    │   │   ├── parsers.test.ts
    │   │   ├── pipeline-fallback.test.ts
    │   │   └── validate.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    ├── registry-protocol/
    │   ├── src/
    │   │   ├── backend.ts
    │   │   ├── index.ts
    │   │   └── schemas.ts
    │   ├── tests/
    │   │   └── backend.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    ├── sidecar/
    │   ├── src/
    │   │   └── index.ts
    │   ├── tests/
    │   │   └── index.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    ├── sidecar-proto/
    │   ├── src/
    │   │   └── index.ts
    │   ├── tests/
    │   │   └── index.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    └── AGENTS.md
├── plugins/
    ├── community/
    │   ├── import-smoke-test/
    │   │   ├── README.md
    │   │   ├── SKILL.md
    │   │   └── open-design.json
    │   └── registry-starter/
    │   │   ├── SKILL.md
    │   │   └── open-design.json
    ├── registry/
    │   ├── community/
    │   │   └── open-design-marketplace.json
    │   └── official/
    │   │   └── open-design-marketplace.json
    ├── spec/
    │   ├── examples/
    │   │   ├── README.md
    │   │   ├── README.zh-CN.md
    │   │   └── open-design-marketplace.json
    │   ├── templates/
    │   │   ├── README.template.md
    │   │   ├── README.template.zh-CN.md
    │   │   ├── SKILL.template.md
    │   │   ├── evals.template.json
    │   │   └── open-design.template.json
    │   ├── AGENT-DEVELOPMENT.md
    │   ├── AGENT-DEVELOPMENT.zh-CN.md
    │   ├── CONTRIBUTING.md
    │   ├── CONTRIBUTING.zh-CN.md
    │   ├── PUBLISHING-REGISTRIES.md
    │   ├── PUBLISHING-REGISTRIES.zh-CN.md
    │   ├── README.md
    │   ├── README.zh-CN.md
    │   ├── SPEC.md
    │   └── SPEC.zh-CN.md
    ├── AGENTS.md
    ├── README.md
    └── README.zh-CN.md
├── prompt-templates/
    ├── image/
    │   ├── 3d-stone-staircase-evolution-infographic.json
    │   ├── anime-martial-arts-battle-illustration.json
    │   ├── e-commerce-live-stream-ui-mockup.json
    │   ├── game-screenshot-anime-fighting-game-captain-ryuuga-vs-kaze-renshin.json
    │   ├── game-screenshot-three-kingdoms-guanyu-slaying-yanliang.json
    │   ├── game-screenshot-three-kingdoms-lyubu-yuanmen-archery.json
    │   ├── game-screenshot-three-kingdoms-zhaoyun-cradle-escape.json
    │   ├── game-ui-ancient-china-open-world-mmo-hud.json
    │   ├── illustrated-city-food-map.json
    │   ├── illustration-crayon-kid-drawing-rework.json
    │   ├── infographic-otaku-dance-choreography-breakdown-gokurakujodo-16-panels.json
    │   ├── momotaro-explainer-slide-in-hybrid-style.json
    │   ├── notion-team-dashboard-live-artifact.json
    │   ├── notion-team-dashboard-live-artifact.preview.png
    │   ├── profile-avatar-anime-girl-to-cinematic-photo.json
    │   ├── profile-avatar-casual-fashion-grid-photoshoot.json
    │   ├── profile-avatar-cinematic-south-asian-male-portrait-with-vultures.json
    │   ├── profile-avatar-cyberpunk-anime-portrait-with-neon-face-text.json
    │   ├── profile-avatar-elegant-fantasy-girl-in-violet-garden.json
    │   ├── profile-avatar-ethereal-blue-haired-fantasy-portrait.json
    │   ├── profile-avatar-glamorous-woman-in-black-portrait.json
    │   ├── profile-avatar-hyper-realistic-selfie-texture-prompts.json
    │   ├── profile-avatar-lavender-fantasy-mage-portrait.json
    │   ├── profile-avatar-monochrome-studio-portrait.json
    │   ├── profile-avatar-old-photo-restoration-to-dslr-portrait.json
    │   ├── profile-avatar-poetic-woman-in-garden-portrait.json
    │   ├── profile-avatar-professional-identity-portrait-wallpaper.json
    │   ├── profile-avatar-realistically-imperfect-ai-selfie.json
    │   ├── profile-avatar-signed-marker-portrait-on-shikishi.json
    │   ├── profile-avatar-snow-rabbit-empress-portrait.json
    │   ├── profile-avatar-snow-rabbit-mask-hanfu-portrait.json
    │   ├── profile-avatar-snowy-rabbit-hanfu-portrait.json
    │   ├── profile-avatar-snowy-rabbit-spirit-portrait.json
    │   ├── profile-avatar-song-dynasty-hanfu-portrait.json
    │   ├── social-media-post-anime-pokemon-shop-outfit-teaser-poster.json
    │   ├── social-media-post-cinematic-elevator-scene.json
    │   ├── social-media-post-confused-elf-girl-at-pastel-desk.json
    │   ├── social-media-post-editorial-fashion-photography.json
    │   ├── social-media-post-fashion-editorial-collage.json
    │   ├── social-media-post-psg-transfer-announcement-poster.json
    │   ├── social-media-post-sensational-girl-dance-storyboard-8-shots.json
    │   ├── social-media-post-showa-day-retro-culture-magazine-cover.json
    │   ├── social-media-post-social-media-fashion-outfit-generation.json
    │   ├── social-media-post-travel-snapshot-collage-prompt.json
    │   ├── social-media-post-vintage-sign-painter-sketch.json
    │   └── vr-headset-exploded-view-poster.json
    └── video/
    │   ├── 3d-animated-boy-building-lego.json
    │   ├── a-decade-of-refinement-glow-up.json
    │   ├── ancient-guardian-dragon-rescue.json
    │   ├── ancient-indian-kingdom-fpv-video.json
    │   ├── animation-transfer-and-camera-tracking-prompt.json
    │   ├── beat-synced-outfit-transformation-dance.json
    │   ├── character-intro-motion-graphics-sequence.json
    │   ├── cinematic-birthday-celebration-sequence.json
    │   ├── cinematic-dragon-interaction-flight.json
    │   ├── cinematic-east-asian-woman-hand-dance.json
    │   ├── cinematic-emotional-face-close-up.json
    │   ├── cinematic-marine-biologist-exploration.json
    │   ├── cinematic-music-podcast-and-guitar-technique.json
    │   ├── cinematic-route-navigation-guide.json
    │   ├── cinematic-street-racing-sequence-for-seedance-2.json
    │   ├── cinematic-vampire-alley-fight-sequence.json
    │   ├── crimson-horizon-sci-fi-cinematic-sequence.json
    │   ├── cyberpunk-game-trailer-script.json
    │   ├── forbidden-city-cat-satire.json
    │   ├── hollywood-haute-couture-fantasy-video-prompt.json
    │   ├── hunched-character-animation.json
    │   ├── hyperframes-app-showcase-three-phones.json
    │   ├── hyperframes-brand-sizzle-reel.json
    │   ├── hyperframes-data-bar-chart-race.json
    │   ├── hyperframes-flight-map-route.json
    │   ├── hyperframes-html-in-canvas-iphone-device.json
    │   ├── hyperframes-html-in-canvas-liquid-background.json
    │   ├── hyperframes-html-in-canvas-liquid-glass.json
    │   ├── hyperframes-html-in-canvas-magnetic.json
    │   ├── hyperframes-html-in-canvas-portal-reveal.json
    │   ├── hyperframes-html-in-canvas-shatter.json
    │   ├── hyperframes-html-in-canvas-text-cursor.json
    │   ├── hyperframes-logo-outro-cinematic.json
    │   ├── hyperframes-money-counter-hype.json
    │   ├── hyperframes-product-reveal-minimal.json
    │   ├── hyperframes-saas-product-promo-30s.json
    │   ├── hyperframes-social-overlay-stack.json
    │   ├── hyperframes-tiktok-karaoke-talking-head.json
    │   ├── hyperframes-website-to-video-promo.json
    │   ├── live-action-anime-adaptation-water-vs-thunder-breathing-duel.json
    │   ├── luxury-supercar-cinematic-narrative.json
    │   ├── magical-academy-storyboard-sequence.json
    │   ├── modern-rural-aesthetics-healing-short-film-video-prompt.json
    │   ├── nightclub-flyer-atmospheric-animation.json
    │   ├── retro-hk-wuxia-film-aesthetic.json
    │   ├── seedance-2-0-15-second-cinematic-japanese-romance-short-film.json
    │   ├── seedance-2-0-80-year-old-rapper-mv.json
    │   ├── sequence-and-movement-instruction-for-martial-arts-video.json
    │   ├── soul-switching-mirror-magic-sequence.json
    │   ├── toaster-rocket-jumpscare.json
    │   ├── traditional-dance-performance.json
    │   ├── video-seedance-three-kingdoms-guanyu-slaying-yanliang.json
    │   ├── video-seedance-three-kingdoms-lyubu-yuanmen-archery.json
    │   ├── video-seedance-three-kingdoms-zhaoyun-cradle-escape.json
    │   ├── vintage-disney-style-pirate-crocodile-animation.json
    │   ├── viral-k-pop-dance-choreography.json
    │   └── wasteland-factory-chase.json
├── scripts/
    ├── migrate-to-plugins/
    │   ├── design-system.ts
    │   ├── example.test.ts
    │   ├── example.ts
    │   ├── image-template.ts
    │   ├── lib.ts
    │   └── main.ts
    ├── approve-fork-pr-workflows.test.ts
    ├── approve-fork-pr-workflows.ts
    ├── bake-community-pets.ts
    ├── bake-html-ppt-examples.mjs
    ├── batch-design-system-test.test.ts
    ├── batch-design-system-test.ts
    ├── check-components-fixtures.ts
    ├── check-components-manifest-extraction.ts
    ├── check-design-system-flag-parity.ts
    ├── check-design-system-manifests.test.ts
    ├── check-design-system-manifests.ts
    ├── check-design-system-package-quality.test.ts
    ├── check-design-system-package-quality.ts
    ├── check-tokens-fixture-sync.ts
    ├── extract-components-manifest.ts
    ├── guard.ts
    ├── i18n-check.ts
    ├── i18n-coverage-report.ts
    ├── import-prompt-templates.mjs
    ├── normalize-plugin-scenarios.ts
    ├── notebooklm-export-github.ts
    ├── postinstall.mjs
    ├── release-beta.ts
    ├── release-preview.ts
    ├── release-stable.ts
    ├── scaffold-html-ppt-skills.mjs
    ├── seed-curated-design-skills.ts
    ├── seed-test-projects.ts
    ├── style-policy.test.ts
    ├── style-policy.ts
    ├── sync-community-pets.ts
    ├── sync-design-systems.ts
    ├── sync-hyperframes-skill.mjs
    ├── sync-litellm-models.ts
    ├── tsconfig.json
    ├── update-nix-pnpm-deps-hash.ts
    └── verify-media-models.mjs
├── skills/
    ├── 8-bit-orbit-video-template/
    │   ├── assets/
    │   │   ├── default-showcase.mp4
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── ad-creative/
    │   └── SKILL.md
    ├── after-hours-editorial-template/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── agent-browser/
    │   └── SKILL.md
    ├── ai-music-album/
    │   └── SKILL.md
    ├── algorithmic-art/
    │   └── SKILL.md
    ├── apple-hig/
    │   └── SKILL.md
    ├── article-magazine/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── artifacts-builder/
    │   └── SKILL.md
    ├── brainstorming/
    │   └── SKILL.md
    ├── brand-guidelines/
    │   └── SKILL.md
    ├── canvas-design/
    │   └── SKILL.md
    ├── card-twitter/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── card-xiaohongshu/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── color-expert/
    │   └── SKILL.md
    ├── competitive-ads-extractor/
    │   └── SKILL.md
    ├── copywriting/
    │   └── SKILL.md
    ├── creative-director/
    │   └── SKILL.md
    ├── d3-visualization/
    │   └── SKILL.md
    ├── data-report/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── deck-guizang-editorial/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── deck-open-slide-canvas/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── deck-swiss-international/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── design-brief/
    │   └── SKILL.md
    ├── design-consultation/
    │   └── SKILL.md
    ├── design-md/
    │   └── SKILL.md
    ├── design-review/
    │   └── SKILL.md
    ├── digits-fintech-swiss-template/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── doc/
    │   └── SKILL.md
    ├── doc-kami-parchment/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── docx/
    │   └── SKILL.md
    ├── domain-name-brainstormer/
    │   └── SKILL.md
    ├── editorial-burgundy-principles-template/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── enhance-prompt/
    │   └── SKILL.md
    ├── fal-3d/
    │   └── SKILL.md
    ├── fal-generate/
    │   └── SKILL.md
    ├── fal-image-edit/
    │   └── SKILL.md
    ├── fal-kling-o3/
    │   └── SKILL.md
    ├── fal-lip-sync/
    │   └── SKILL.md
    ├── fal-realtime/
    │   └── SKILL.md
    ├── fal-restore/
    │   └── SKILL.md
    ├── fal-train/
    │   └── SKILL.md
    ├── fal-tryon/
    │   └── SKILL.md
    ├── fal-upscale/
    │   └── SKILL.md
    ├── fal-video-edit/
    │   └── SKILL.md
    ├── fal-vision/
    │   └── SKILL.md
    ├── faq-page/
    │   ├── SKILL.md
    │   └── example.html
    ├── field-notes-editorial-template/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── figma-code-connect-components/
    │   └── SKILL.md
    ├── figma-create-design-system-rules/
    │   └── SKILL.md
    ├── figma-create-new-file/
    │   └── SKILL.md
    ├── figma-generate-design/
    │   └── SKILL.md
    ├── figma-generate-library/
    │   └── SKILL.md
    ├── figma-implement-design/
    │   └── SKILL.md
    ├── figma-use/
    │   └── SKILL.md
    ├── flutter-animating-apps/
    │   └── SKILL.md
    ├── frame-data-chart-nyt/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── frame-flowchart-sticky/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── frame-glitch-title/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── frame-light-leak-cinema/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── frame-liquid-bg-hero/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── frame-logo-outro/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── frame-macos-notification/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── frontend-design/
    │   └── SKILL.md
    ├── frontend-dev/
    │   └── SKILL.md
    ├── frontend-skill/
    │   └── SKILL.md
    ├── frontend-slides/
    │   └── SKILL.md
    ├── full-page-screenshot/
    │   └── SKILL.md
    ├── gif-sticker-maker/
    │   └── SKILL.md
    ├── gsap-core/
    │   └── SKILL.md
    ├── gsap-react/
    │   └── SKILL.md
    ├── gsap-scrolltrigger/
    │   └── SKILL.md
    ├── gsap-timeline/
    │   └── SKILL.md
    ├── hand-drawn-diagrams/
    │   └── SKILL.md
    ├── hatch-pet/
    │   ├── agents/
    │   │   └── openai.yaml
    │   ├── references/
    │   │   ├── animation-rows.md
    │   │   ├── codex-pet-contract.md
    │   │   └── qa-rubric.md
    │   ├── scripts/
    │   │   ├── compose_atlas.py
    │   │   ├── derive_running_left_from_running_right.py
    │   │   ├── extract_strip_frames.py
    │   │   ├── finalize_pet_run.py
    │   │   ├── generate_pet_images.py
    │   │   ├── inspect_frames.py
    │   │   ├── make_contact_sheet.py
    │   │   ├── package_custom_pet.py
    │   │   ├── pet_job_status.py
    │   │   ├── prepare_pet_run.py
    │   │   ├── queue_pet_repairs.py
    │   │   ├── record_imagegen_result.py
    │   │   ├── render_animation_videos.py
    │   │   ├── render_animation_videos.sh
    │   │   ├── test_generate_pet_images.py
    │   │   └── validate_atlas.py
    │   ├── LICENSE.txt
    │   ├── README.md
    │   └── SKILL.md
    ├── html-ppt-retro-quarterly-review/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── image-enhancer/
    │   └── SKILL.md
    ├── imagegen/
    │   └── SKILL.md
    ├── imagen/
    │   └── SKILL.md
    ├── login-flow/
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── marketing-psychology/
    │   └── SKILL.md
    ├── minimax-docx/
    │   └── SKILL.md
    ├── minimax-pdf/
    │   └── SKILL.md
    ├── mockup-device-3d/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── nanobanana-ppt/
    │   └── SKILL.md
    ├── paywall-upgrade-cro/
    │   └── SKILL.md
    ├── pdf/
    │   └── SKILL.md
    ├── pixelbin-media/
    │   └── SKILL.md
    ├── plan-design-review/
    │   └── SKILL.md
    ├── platform-design/
    │   └── SKILL.md
    ├── poster-hero/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── ppt-keynote/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── pptx/
    │   └── SKILL.md
    ├── pptx-generator/
    │   └── SKILL.md
    ├── pptx-html-fidelity-audit/
    │   ├── references/
    │   │   ├── audit-table-template.md
    │   │   ├── font-discipline.md
    │   │   └── layout-discipline.md
    │   ├── scripts/
    │   │   ├── .gitignore
    │   │   ├── extract_pptx.py
    │   │   └── verify_layout.py
    │   └── SKILL.md
    ├── release-notes-one-pager/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   ├── checklist.md
    │   │   └── layouts.md
    │   ├── SKILL.md
    │   └── example.html
    ├── remotion/
    │   └── SKILL.md
    ├── replicate/
    │   └── SKILL.md
    ├── research-decision-room/
    │   ├── references/
    │   │   ├── checklist.md
    │   │   └── evidence-model.md
    │   ├── SKILL.md
    │   └── example.html
    ├── resume-modern/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── screenshot/
    │   └── SKILL.md
    ├── screenshots-marketing/
    │   └── SKILL.md
    ├── shadcn-ui/
    │   └── SKILL.md
    ├── shader-dev/
    │   └── SKILL.md
    ├── slack-gif-creator/
    │   └── SKILL.md
    ├── slides/
    │   └── SKILL.md
    ├── social-reddit-card/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── social-spotify-card/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── social-x-post-card/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── sora/
    │   └── SKILL.md
    ├── speech/
    │   └── SKILL.md
    ├── stitch-loop/
    │   └── SKILL.md
    ├── swiftui-design/
    │   └── SKILL.md
    ├── swiss-creative-mode-template/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── swiss-user-research-video-template/
    │   ├── assets/
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── taste-skill/
    │   └── SKILL.md
    ├── theme-factory/
    │   └── SKILL.md
    ├── threejs/
    │   └── SKILL.md
    ├── ui-skills/
    │   └── SKILL.md
    ├── ui-ux-pro-max/
    │   └── SKILL.md
    ├── venice-audio-music/
    │   └── SKILL.md
    ├── venice-audio-speech/
    │   └── SKILL.md
    ├── venice-image-edit/
    │   └── SKILL.md
    ├── venice-image-generate/
    │   └── SKILL.md
    ├── venice-video/
    │   └── SKILL.md
    ├── vfx-text-cursor/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── video-downloader/
    │   └── SKILL.md
    ├── video-hyperframes/
    │   ├── SKILL.md
    │   ├── example.html
    │   └── example.md
    ├── web-artifacts-builder/
    │   └── SKILL.md
    ├── web-design-guidelines/
    │   └── SKILL.md
    ├── weread-year-in-review-video-template/
    │   ├── assets/
    │   │   ├── default-showcase.mp4
    │   │   └── template.html
    │   ├── references/
    │   │   └── checklist.md
    │   ├── SKILL.md
    │   └── example.html
    ├── wpds/
    │   └── SKILL.md
    ├── youtube-clipper/
    │   └── SKILL.md
    ├── AGENTS.md
    └── README.md
├── specs/
    ├── 2026-04-29-live-artifacts/
    │   ├── checklist.md
    │   └── spec.md
    ├── change/
    │   ├── 20260430-implement-maintainability-w2-w3/
    │   │   └── spec.md
    │   ├── 20260509-agents-ts-split/
    │   │   └── spec.md
    │   ├── 20260509-token-first-tailwind/
    │   │   ├── phase1-notes.md
    │   │   ├── phase2-notes.md
    │   │   ├── phase3-notes.md
    │   │   ├── phase4-notes.md
    │   │   ├── phase5-notes.md
    │   │   ├── phase6-notes.md
    │   │   ├── spec.md
    │   │   └── token.md
    │   ├── 20260511-default-english-resource-i18n-fallback/
    │   │   └── spec.md
    │   ├── 20260511-issue-138-conversation-run-isolation/
    │   │   └── spec.md
    │   ├── 20260511-issue-145-unit-test-reproduction/
    │   │   └── spec.md
    │   ├── 20260511-issue-564-claude-diagnostics/
    │   │   └── spec.md
    │   ├── 20260513-optional-content-i18n/
    │   │   └── spec.md
    │   └── 20260522-pr-explore-agent/
    │   │   └── spec.md
    └── current/
    │   ├── architecture-boundaries.md
    │   ├── automation-self-evolution.md
    │   ├── critique-theater-plan.md
    │   ├── critique-theater.md
    │   ├── daemon-http-adapter.md
    │   ├── design-system-import-project.md
    │   ├── maintainability-roadmap.md
    │   ├── manual-edit-mode-requirements.md
    │   ├── plugin-authoring-flow-plan.md
    │   ├── plugin-driven-flow-plan.md
    │   ├── plugin-registry-strategy-plan.md
    │   ├── research-feature.md
    │   ├── run.md
    │   ├── runtime-adapter.md
    │   ├── skills-and-design-templates.md
    │   └── status.md
├── story/
    ├── STORY.md
    └── STORY.zh-CN.md
├── templates/
    ├── live-artifacts/
    │   └── otd-operations-brief/
    │   │   ├── DESIGN.md
    │   │   ├── README.md
    │   │   ├── artifact.json
    │   │   ├── data.json
    │   │   ├── index.html
    │   │   ├── preview.png
    │   │   ├── provenance.json
    │   │   └── template.html
    ├── deck-framework.html
    └── kami-deck.html
├── tools/
    ├── dev/
    │   ├── bin/
    │   │   └── tools-dev.mjs
    │   ├── dashboards/
    │   │   └── critique.json
    │   ├── src/
    │   │   ├── config.ts
    │   │   ├── desktop-auth-gate.ts
    │   │   ├── diagnostics.ts
    │   │   ├── index.ts
    │   │   ├── shared-ports.ts
    │   │   └── sidecar-client.ts
    │   ├── tests/
    │   │   ├── desktop-auth-gate.test.ts
    │   │   ├── diagnostics.test.ts
    │   │   └── shared-ports.test.ts
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   └── tsconfig.json
    ├── pack/
    │   ├── bin/
    │   │   └── tools-pack.mjs
    │   ├── resources/
    │   │   └── web-standalone-after-pack.cjs
    │   ├── src/
    │   │   ├── cache.ts
    │   │   ├── config.ts
    │   │   ├── index.ts
    │   │   ├── linux.ts
    │   │   ├── lock.ts
    │   │   ├── mac-prebundle.ts
    │   │   ├── package-source-hash.ts
    │   │   ├── resources.ts
    │   │   ├── versions.ts
    │   │   ├── web-sourcemaps.ts
    │   │   ├── win-prebundle.ts
    │   │   └── workspace-build.ts
    │   ├── tests/
    │   │   ├── cache.test.ts
    │   │   ├── config.test.ts
    │   │   ├── desktop-package-runtime.test.ts
    │   │   ├── linux.test.ts
    │   │   ├── mac-identity.test.ts
    │   │   ├── mac-lifecycle.test.ts
    │   │   ├── mac-prebundle.test.ts
    │   │   ├── mac.test.ts
    │   │   ├── package-source-hash.test.ts
    │   │   ├── resources.test.ts
    │   │   ├── versions.test.ts
    │   │   ├── web-sourcemaps.test.ts
    │   │   ├── web-standalone-after-pack.test.ts
    │   │   ├── win-app.test.ts
    │   │   ├── win-builder.test.ts
    │   │   ├── win-identity.test.ts
    │   │   ├── win-prebundle.test.ts
    │   │   ├── win-resources.test.ts
    │   │   ├── win-size-index.test.ts
    │   │   ├── win-targets.test.ts
    │   │   └── workspace-build.test.ts
    │   ├── AGENTS.md
    │   ├── README.md
    │   ├── docker-compose.yml
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsconfig.tests.json
    ├── serve/
    │   ├── bin/
    │   │   └── tools-serve.mjs
    │   ├── src/
    │   │   ├── index.ts
    │   │   └── updater-fixture.ts
    │   ├── tests/
    │   │   └── updater-fixture.test.ts
    │   ├── AGENTS.md
    │   ├── esbuild.config.mjs
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsconfig.tests.json
    │   └── vitest.config.ts
    └── AGENTS.md
├── .dockerignore
├── .gitignore
├── .node-version
├── AGENTS.md
├── CHANGELOG.md
├── CLAUDE.md
├── CONTEXT.md
├── CONTRIBUTING.de.md
├── CONTRIBUTING.fr.md
├── CONTRIBUTING.ja-JP.md
├── CONTRIBUTING.md
├── CONTRIBUTING.pt-BR.md
├── CONTRIBUTING.zh-CN.md
├── LICENSE
├── MAINTAINERS.de.md
├── MAINTAINERS.fr.md
├── MAINTAINERS.ja-JP.md
├── MAINTAINERS.md
├── MAINTAINERS.pt-BR.md
├── MAINTAINERS.zh-CN.md
├── PRIVACY.md
├── QUICKSTART.de.md
├── QUICKSTART.fr.md
├── QUICKSTART.ja-JP.md
├── QUICKSTART.md
├── QUICKSTART.pt-BR.md
├── QUICKSTART.zh-CN.md
├── QUICKSTART.zh-TW.md
├── README.ar.md
├── README.de.md
├── README.es.md
├── README.fr.md
├── README.ja-JP.md
├── README.ko.md
├── README.md
├── README.pt-BR.md
├── README.ru.md
├── README.tr.md
├── README.uk.md
├── README.zh-CN.md
├── README.zh-TW.md
├── TRANSLATIONS.md
├── edited_image.png
├── flake.lock
├── flake.nix
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── vercel.json
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `react-starter-kit-main/`

- **Files:** 341 · **Directories:** 95
- **Entry:** `README.md`

```
react-starter-kit-main/
├── .claude/
    └── commands/
    │   ├── migrate-to-d1.md
    │   ├── review-better-auth.md
    │   ├── review-terraform.md
    │   └── validate-auth-schema.md
├── .gemini/
    └── settings.json
├── .github/
    ├── workflows/
    │   ├── ci.yml
    │   ├── conventional-commits.yml
    │   └── deploy.yml
    ├── CODE_OF_CONDUCT.md
    ├── CONTRIBUTING.md
    ├── FUNDING.yml
    ├── SECURITY.md
    ├── copilot-instructions.md
    └── dependabot.yml
├── .husky/
    ├── .gitignore
    └── pre-commit
├── .vscode/
    ├── extensions.json
    ├── mcp.json
    └── settings.json
├── apps/
    ├── api/
    │   ├── lib/
    │   │   ├── ai.ts
    │   │   ├── app.ts
    │   │   ├── auth.ts
    │   │   ├── context.ts
    │   │   ├── db.ts
    │   │   ├── email.ts
    │   │   ├── env.ts
    │   │   ├── loaders.ts
    │   │   ├── middleware.ts
    │   │   ├── plans.ts
    │   │   ├── stripe.ts
    │   │   └── trpc.ts
    │   ├── routers/
    │   │   ├── billing.test.ts
    │   │   ├── billing.ts
    │   │   ├── organization.ts
    │   │   └── user.ts
    │   ├── AGENTS.md
    │   ├── Dockerfile
    │   ├── README.md
    │   ├── dev.ts
    │   ├── index.ts
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vitest.config.ts
    │   ├── worker.ts
    │   └── wrangler.jsonc
    ├── app/
    │   ├── components/
    │   │   ├── index.ts
    │   │   ├── not-found.tsx
    │   │   └── user-menu.tsx
    │   ├── lib/
    │   │   ├── auth-config.ts
    │   │   ├── auth.ts
    │   │   ├── errors.test.ts
    │   │   ├── errors.ts
    │   │   ├── query.ts
    │   │   ├── routeTree.gen.ts
    │   │   ├── store.ts
    │   │   ├── trpc.ts
    │   │   └── utils.ts
    │   ├── public/
    │   │   ├── favicon.ico
    │   │   ├── logo192.png
    │   │   ├── logo512.png
    │   │   ├── robots.txt
    │   │   └── site.manifest
    │   ├── routes/
    │   │   └── __root.tsx
    │   ├── styles/
    │   │   └── globals.css
    │   ├── AGENTS.md
    │   ├── README.md
    │   ├── components.json
    │   ├── global.d.ts
    │   ├── index.html
    │   ├── index.tsx
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── tailwind.config.css
    │   ├── tsconfig.json
    │   ├── vite.config.ts
    │   ├── vitest.setup.ts
    │   └── wrangler.jsonc
    ├── email/
    │   ├── assets/
    │   │   └── logo.svg
    │   ├── components/
    │   │   └── BaseTemplate.tsx
    │   ├── emails/
    │   │   ├── email-verification.tsx
    │   │   ├── otp-password-reset.tsx
    │   │   ├── otp-sign-in.tsx
    │   │   ├── otp-verification.tsx
    │   │   └── password-reset.tsx
    │   ├── templates/
    │   │   ├── email-verification.tsx
    │   │   ├── otp-email.tsx
    │   │   └── password-reset.tsx
    │   ├── utils/
    │   │   └── render.ts
    │   ├── README.md
    │   ├── index.ts
    │   ├── package.json
    │   └── tsconfig.json
    └── web/
    │   ├── layouts/
    │       └── BaseLayout.astro
    │   ├── lib/
    │       └── utils.ts
    │   ├── pages/
    │       ├── about.astro
    │       ├── features.astro
    │       ├── index.astro
    │       └── pricing.astro
    │   ├── public/
    │       ├── favicon.ico
    │       ├── logo192.png
    │       ├── logo512.png
    │       ├── robots.txt
    │       └── site.manifest
    │   ├── styles/
    │       └── globals.css
    │   ├── .env.example
    │   ├── README.md
    │   ├── _headers
    │   ├── astro.config.mjs
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── tailwind.config.css
    │   ├── tsconfig.json
    │   ├── worker.ts
    │   └── wrangler.jsonc
├── db/
    ├── backups/
    │   └── .gitignore
    ├── migrations/
    │   ├── meta/
    │   │   ├── 0000_snapshot.json
    │   │   └── _journal.json
    │   └── 0000_init.sql
    ├── schema/
    │   ├── id.ts
    │   ├── index.ts
    │   ├── invitation.ts
    │   ├── organization.ts
    │   ├── passkey.ts
    │   ├── subscription.ts
    │   └── user.ts
    ├── scripts/
    │   ├── export.ts
    │   ├── generate-auth-schema.ts
    │   └── seed.ts
    ├── seeds/
    │   └── users.ts
    ├── AGENTS.md
    ├── README.md
    ├── drizzle.config.ts
    ├── index.ts
    ├── package.json
    └── tsconfig.json
├── docs/
    ├── .vitepress/
    │   ├── public/
    │   │   └── robots.txt
    │   ├── theme/
    │   │   ├── index.ts
    │   │   └── style.css
    │   └── config.ts
    ├── adr/
    │   ├── 000-template.md
    │   └── 001-auth-hint-cookie.md
    ├── api/
    │   ├── context.md
    │   ├── index.md
    │   ├── procedures.md
    │   └── validation-errors.md
    ├── architecture/
    │   ├── edge.md
    │   └── index.md
    ├── auth/
    │   ├── email-otp.md
    │   ├── index.md
    │   ├── organizations.md
    │   ├── passkeys.md
    │   ├── sessions.md
    │   └── social-providers.md
    ├── billing/
    │   ├── checkout.md
    │   ├── index.md
    │   ├── plans.md
    │   └── webhooks.md
    ├── database/
    │   ├── index.md
    │   ├── migrations.md
    │   ├── queries.md
    │   ├── schema.md
    │   └── seeding.md
    ├── deployment/
    │   ├── ci-cd.md
    │   ├── cloudflare.md
    │   ├── index.md
    │   ├── monitoring.md
    │   └── production-database.md
    ├── frontend/
    │   ├── forms.md
    │   ├── routing.md
    │   ├── state.md
    │   └── ui.md
    ├── getting-started/
    │   ├── environment-variables.md
    │   ├── index.md
    │   ├── project-structure.md
    │   └── quick-start.md
    ├── public/
    │   └── CNAME
    ├── recipes/
    │   ├── file-uploads.md
    │   ├── new-page.md
    │   ├── new-procedure.md
    │   ├── new-table.md
    │   ├── teams.md
    │   └── websockets.md
    ├── security/
    │   ├── checklist.md
    │   ├── incident-playbook.md
    │   └── policy-template.md
    ├── specs/
    │   ├── auth-form.md
    │   ├── billing.md
    │   ├── infra-terraform.md
    │   └── prefixed-ids.md
    ├── email.md
    ├── index.md
    └── testing.md
├── infra/
    ├── stacks/
    │   ├── edge/
    │   │   ├── main.tf
    │   │   ├── outputs.tf
    │   │   └── variables.tf
    │   └── hybrid/
    │   │   ├── main.tf
    │   │   ├── outputs.tf
    │   │   └── variables.tf
    ├── templates/
    │   ├── backend-gcs.example.hcl
    │   └── backend-r2.example.hcl
    ├── .gitignore
    └── README.md
├── packages/
    ├── core/
    │   ├── README.md
    │   ├── index.ts
    │   ├── package.json
    │   └── tsconfig.json
    ├── typescript-config/
    │   ├── README.md
    │   ├── base.jsonc
    │   ├── cloudflare.jsonc
    │   ├── node.jsonc
    │   ├── package.json
    │   └── react.jsonc
    ├── ui/
    │   ├── components/
    │   │   ├── avatar.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── dialog.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── switch.tsx
    │   │   └── textarea.tsx
    │   ├── hooks/
    │   │   └── index.ts
    │   ├── lib/
    │   │   └── utils.ts
    │   ├── scripts/
    │   │   ├── add.ts
    │   │   ├── essentials.ts
    │   │   ├── format-utils.ts
    │   │   ├── list.ts
    │   │   └── update.ts
    │   ├── README.md
    │   ├── components.json
    │   ├── index.ts
    │   ├── package.json
    │   ├── styles.css
    │   └── tsconfig.json
    └── ws-protocol/
    │   ├── README.md
    │   ├── example.ts
    │   ├── index.ts
    │   ├── messages.ts
    │   ├── package.json
    │   ├── router.ts
    │   └── tsconfig.json
├── scripts/
    ├── mcp.ts
    ├── package.json
    ├── post-install.ts
    └── tsconfig.json
├── .editorconfig
├── .env
├── .gitattributes
├── .gitignore
├── .prettierignore
├── AGENTS.md
├── CLAUDE.md
├── LICENSE
├── README.md
├── bun.lock
├── eslint.config.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `ruflo-main/`

- **Files:** 4504 · **Directories:** 1405
- **Entry:** `README.md`

```
ruflo-main/
├── .agents/
    ├── skills/
    │   ├── agent-adaptive-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-agent/
    │   │   └── SKILL.md
    │   ├── agent-agentic-payments/
    │   │   └── SKILL.md
    │   ├── agent-analyze-code-quality/
    │   │   └── SKILL.md
    │   ├── agent-app-store/
    │   │   └── SKILL.md
    │   ├── agent-arch-system-design/
    │   │   └── SKILL.md
    │   ├── agent-architecture/
    │   │   └── SKILL.md
    │   ├── agent-authentication/
    │   │   └── SKILL.md
    │   ├── agent-automation-smart-agent/
    │   │   └── SKILL.md
    │   ├── agent-base-template-generator/
    │   │   └── SKILL.md
    │   ├── agent-benchmark-suite/
    │   │   └── SKILL.md
    │   ├── agent-byzantine-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-challenges/
    │   │   └── SKILL.md
    │   ├── agent-code-analyzer/
    │   │   └── SKILL.md
    │   ├── agent-code-goal-planner/
    │   │   └── SKILL.md
    │   ├── agent-code-review-swarm/
    │   │   └── SKILL.md
    │   ├── agent-coder/
    │   │   └── SKILL.md
    │   ├── agent-collective-intelligence-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-consensus-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-coordination/
    │   │   └── SKILL.md
    │   ├── agent-coordinator-swarm-init/
    │   │   └── SKILL.md
    │   ├── agent-crdt-synchronizer/
    │   │   └── SKILL.md
    │   ├── agent-data-ml-model/
    │   │   └── SKILL.md
    │   ├── agent-dev-backend-api/
    │   │   └── SKILL.md
    │   ├── agent-docs-api-openapi/
    │   │   └── SKILL.md
    │   ├── agent-github-modes/
    │   │   └── SKILL.md
    │   ├── agent-github-pr-manager/
    │   │   └── SKILL.md
    │   ├── agent-goal-planner/
    │   │   └── SKILL.md
    │   ├── agent-gossip-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-hierarchical-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-implementer-sparc-coder/
    │   │   └── SKILL.md
    │   ├── agent-issue-tracker/
    │   │   └── SKILL.md
    │   ├── agent-load-balancer/
    │   │   └── SKILL.md
    │   ├── agent-matrix-optimizer/
    │   │   └── SKILL.md
    │   ├── agent-memory-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-mesh-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-migration-plan/
    │   │   └── SKILL.md
    │   ├── agent-multi-repo-swarm/
    │   │   └── SKILL.md
    │   ├── agent-neural-network/
    │   │   └── SKILL.md
    │   ├── agent-ops-cicd-github/
    │   │   └── SKILL.md
    │   ├── agent-orchestrator-task/
    │   │   └── SKILL.md
    │   ├── agent-pagerank-analyzer/
    │   │   └── SKILL.md
    │   ├── agent-payments/
    │   │   └── SKILL.md
    │   ├── agent-performance-analyzer/
    │   │   └── SKILL.md
    │   ├── agent-performance-benchmarker/
    │   │   └── SKILL.md
    │   ├── agent-performance-monitor/
    │   │   └── SKILL.md
    │   ├── agent-performance-optimizer/
    │   │   └── SKILL.md
    │   ├── agent-planner/
    │   │   └── SKILL.md
    │   ├── agent-pr-manager/
    │   │   └── SKILL.md
    │   ├── agent-production-validator/
    │   │   └── SKILL.md
    │   ├── agent-project-board-sync/
    │   │   └── SKILL.md
    │   ├── agent-pseudocode/
    │   │   └── SKILL.md
    │   ├── agent-queen-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-quorum-manager/
    │   │   └── SKILL.md
    │   ├── agent-raft-manager/
    │   │   └── SKILL.md
    │   ├── agent-refinement/
    │   │   └── SKILL.md
    │   ├── agent-release-manager/
    │   │   └── SKILL.md
    │   ├── agent-release-swarm/
    │   │   └── SKILL.md
    │   ├── agent-repo-architect/
    │   │   └── SKILL.md
    │   ├── agent-researcher/
    │   │   └── SKILL.md
    │   ├── agent-resource-allocator/
    │   │   └── SKILL.md
    │   ├── agent-reviewer/
    │   │   └── SKILL.md
    │   ├── agent-safla-neural/
    │   │   └── SKILL.md
    │   ├── agent-sandbox/
    │   │   └── SKILL.md
    │   ├── agent-scout-explorer/
    │   │   └── SKILL.md
    │   ├── agent-security-manager/
    │   │   └── SKILL.md
    │   ├── agent-sona-learning-optimizer/
    │   │   └── SKILL.md
    │   ├── agent-sparc-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-spec-mobile-react-native/
    │   │   └── SKILL.md
    │   ├── agent-specification/
    │   │   └── SKILL.md
    │   ├── agent-swarm/
    │   │   └── SKILL.md
    │   ├── agent-swarm-issue/
    │   │   └── SKILL.md
    │   ├── agent-swarm-memory-manager/
    │   │   └── SKILL.md
    │   ├── agent-swarm-pr/
    │   │   └── SKILL.md
    │   ├── agent-sync-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-tdd-london-swarm/
    │   │   └── SKILL.md
    │   ├── agent-test-long-runner/
    │   │   └── SKILL.md
    │   ├── agent-tester/
    │   │   └── SKILL.md
    │   ├── agent-topology-optimizer/
    │   │   └── SKILL.md
    │   ├── agent-trading-predictor/
    │   │   └── SKILL.md
    │   ├── agent-user-tools/
    │   │   └── SKILL.md
    │   ├── agent-v3-integration-architect/
    │   │   └── SKILL.md
    │   ├── agent-v3-memory-specialist/
    │   │   └── SKILL.md
    │   ├── agent-v3-performance-engineer/
    │   │   └── SKILL.md
    │   ├── agent-v3-queen-coordinator/
    │   │   └── SKILL.md
    │   ├── agent-v3-security-architect/
    │   │   └── SKILL.md
    │   ├── agent-worker-specialist/
    │   │   └── SKILL.md
    │   ├── agent-workflow/
    │   │   └── SKILL.md
    │   ├── agent-workflow-automation/
    │   │   └── SKILL.md
    │   ├── agentdb-advanced/
    │   │   └── SKILL.md
    │   ├── agentdb-learning/
    │   │   └── SKILL.md
    │   ├── agentdb-memory-patterns/
    │   │   └── SKILL.md
    │   ├── agentdb-optimization/
    │   │   └── SKILL.md
    │   ├── agentdb-vector-search/
    │   │   └── SKILL.md
    │   ├── agentic-jujutsu/
    │   │   └── SKILL.md
    │   ├── claims/
    │   │   └── SKILL.md
    │   ├── embeddings/
    │   │   └── SKILL.md
    │   ├── flow-nexus-neural/
    │   │   └── SKILL.md
    │   ├── flow-nexus-platform/
    │   │   └── SKILL.md
    │   ├── flow-nexus-swarm/
    │   │   └── SKILL.md
    │   ├── github-automation/
    │   │   └── SKILL.md
    │   ├── github-code-review/
    │   │   └── SKILL.md
    │   ├── github-multi-repo/
    │   │   └── SKILL.md
    │   ├── github-project-management/
    │   │   └── SKILL.md
    │   ├── github-release-management/
    │   │   └── SKILL.md
    │   ├── github-workflow-automation/
    │   │   └── SKILL.md
    │   ├── hive-mind/
    │   │   └── SKILL.md
    │   ├── hive-mind-advanced/
    │   │   └── SKILL.md
    │   ├── hooks-automation/
    │   │   └── SKILL.md
    │   ├── memory-management/
    │   │   └── SKILL.md
    │   ├── neural-training/
    │   │   └── SKILL.md
    │   ├── pair-programming/
    │   │   └── SKILL.md
    │   ├── performance-analysis/
    │   │   └── SKILL.md
    │   ├── reasoningbank-agentdb/
    │   │   └── SKILL.md
    │   ├── reasoningbank-intelligence/
    │   │   └── SKILL.md
    │   ├── security-audit/
    │   │   └── SKILL.md
    │   ├── skill-builder/
    │   │   └── SKILL.md
    │   ├── sparc-methodology/
    │   │   └── SKILL.md
    │   ├── stream-chain/
    │   │   └── SKILL.md
    │   ├── swarm-advanced/
    │   │   └── SKILL.md
    │   ├── swarm-orchestration/
    │   │   └── SKILL.md
    │   ├── v3-cli-modernization/
    │   │   └── SKILL.md
    │   ├── v3-core-implementation/
    │   │   └── SKILL.md
    │   ├── v3-ddd-architecture/
    │   │   └── SKILL.md
    │   ├── v3-integration-deep/
    │   │   └── SKILL.md
    │   ├── v3-mcp-optimization/
    │   │   └── SKILL.md
    │   ├── v3-memory-unification/
    │   │   └── SKILL.md
    │   ├── v3-performance-optimization/
    │   │   └── SKILL.md
    │   ├── v3-security-overhaul/
    │   │   └── SKILL.md
    │   ├── v3-swarm-coordination/
    │   │   └── SKILL.md
    │   ├── verification-quality/
    │   │   └── SKILL.md
    │   ├── worker-benchmarks/
    │   │   └── SKILL.md
    │   ├── worker-integration/
    │   │   └── SKILL.md
    │   └── workflow-automation/
    │   │   └── SKILL.md
    ├── README.md
    └── config.toml
├── .claude/
    ├── agents/
    │   ├── analysis/
    │   │   ├── analyze-code-quality.md
    │   │   └── code-analyzer.md
    │   ├── consensus/
    │   │   ├── byzantine-coordinator.md
    │   │   ├── crdt-synchronizer.md
    │   │   ├── gossip-coordinator.md
    │   │   ├── performance-benchmarker.md
    │   │   ├── quorum-manager.md
    │   │   ├── raft-manager.md
    │   │   └── security-manager.md
    │   ├── core/
    │   │   ├── coder.md
    │   │   ├── planner.md
    │   │   ├── researcher.md
    │   │   ├── reviewer.md
    │   │   └── tester.md
    │   ├── custom/
    │   │   └── test-long-runner.md
    │   ├── development/
    │   │   └── dev-backend-api.md
    │   ├── dual-mode/
    │   │   ├── codex-coordinator.md
    │   │   ├── codex-worker.md
    │   │   └── dual-orchestrator.md
    │   ├── flow-nexus/
    │   │   ├── app-store.md
    │   │   ├── authentication.md
    │   │   ├── challenges.md
    │   │   ├── neural-network.md
    │   │   ├── payments.md
    │   │   ├── sandbox.md
    │   │   ├── swarm.md
    │   │   ├── user-tools.md
    │   │   └── workflow.md
    │   ├── github/
    │   │   ├── code-review-swarm.md
    │   │   ├── github-modes.md
    │   │   ├── issue-tracker.md
    │   │   ├── multi-repo-swarm.md
    │   │   ├── pr-manager.md
    │   │   ├── project-board-sync.md
    │   │   ├── release-manager.md
    │   │   ├── release-swarm.md
    │   │   ├── repo-architect.md
    │   │   ├── swarm-issue.md
    │   │   ├── swarm-pr.md
    │   │   ├── sync-coordinator.md
    │   │   └── workflow-automation.md
    │   ├── goal/
    │   │   ├── agent.md
    │   │   ├── code-goal-planner.md
    │   │   └── goal-planner.md
    │   ├── hive-mind/
    │   │   ├── collective-intelligence-coordinator.md
    │   │   ├── queen-coordinator.md
    │   │   ├── scout-explorer.md
    │   │   ├── swarm-memory-manager.md
    │   │   └── worker-specialist.md
    │   ├── neural/
    │   │   └── safla-neural.md
    │   ├── optimization/
    │   │   ├── benchmark-suite.md
    │   │   ├── load-balancer.md
    │   │   ├── performance-monitor.md
    │   │   ├── resource-allocator.md
    │   │   └── topology-optimizer.md
    │   ├── payments/
    │   │   └── agentic-payments.md
    │   ├── reasoning/
    │   │   ├── agent.md
    │   │   └── goal-planner.md
    │   ├── sona/
    │   │   └── sona-learning-optimizer.md
    │   ├── sparc/
    │   │   ├── architecture.md
    │   │   ├── pseudocode.md
    │   │   ├── refinement.md
    │   │   └── specification.md
    │   ├── sublinear/
    │   │   ├── consensus-coordinator.md
    │   │   ├── matrix-optimizer.md
    │   │   ├── pagerank-analyzer.md
    │   │   ├── performance-optimizer.md
    │   │   └── trading-predictor.md
    │   ├── swarm/
    │   │   ├── adaptive-coordinator.md
    │   │   ├── hierarchical-coordinator.md
    │   │   └── mesh-coordinator.md
    │   ├── templates/
    │   │   ├── automation-smart-agent.md
    │   │   ├── coordinator-swarm-init.md
    │   │   ├── github-pr-manager.md
    │   │   ├── implementer-sparc-coder.md
    │   │   ├── memory-coordinator.md
    │   │   ├── migration-plan.md
    │   │   ├── orchestrator-task.md
    │   │   ├── performance-analyzer.md
    │   │   └── sparc-coordinator.md
    │   ├── testing/
    │   │   ├── production-validator.md
    │   │   └── tdd-london-swarm.md
    │   ├── v3/
    │   │   ├── database-specialist.md
    │   │   ├── project-coordinator.md
    │   │   ├── python-specialist.md
    │   │   ├── test-architect.md
    │   │   ├── typescript-specialist.md
    │   │   ├── v3-integration-architect.md
    │   │   ├── v3-memory-specialist.md
    │   │   ├── v3-performance-engineer.md
    │   │   ├── v3-queen-coordinator.md
    │   │   └── v3-security-architect.md
    │   ├── MIGRATION_SUMMARY.md
    │   ├── base-template-generator.md
    │   ├── database-specialist.md
    │   ├── project-coordinator.md
    │   ├── python-specialist.md
    │   ├── security-auditor.md
    │   └── typescript-specialist.md
    ├── checkpoints/
    │   └── 1767754460.json
    ├── commands/
    │   ├── agents/
    │   │   ├── README.md
    │   │   ├── agent-capabilities.md
    │   │   ├── agent-coordination.md
    │   │   ├── agent-spawning.md
    │   │   └── agent-types.md
    │   ├── analysis/
    │   │   ├── COMMAND_COMPLIANCE_REPORT.md
    │   │   ├── README.md
    │   │   ├── bottleneck-detect.md
    │   │   ├── performance-bottlenecks.md
    │   │   ├── performance-report.md
    │   │   ├── token-efficiency.md
    │   │   └── token-usage.md
    │   ├── automation/
    │   │   ├── README.md
    │   │   ├── auto-agent.md
    │   │   ├── self-healing.md
    │   │   ├── session-memory.md
    │   │   ├── smart-agents.md
    │   │   ├── smart-spawn.md
    │   │   └── workflow-select.md
    │   ├── coordination/
    │   │   ├── README.md
    │   │   ├── agent-spawn.md
    │   │   ├── init.md
    │   │   ├── orchestrate.md
    │   │   ├── spawn.md
    │   │   ├── swarm-init.md
    │   │   └── task-orchestrate.md
    │   ├── flow-nexus/
    │   │   ├── app-store.md
    │   │   ├── challenges.md
    │   │   ├── login-registration.md
    │   │   ├── neural-network.md
    │   │   ├── payments.md
    │   │   ├── sandbox.md
    │   │   ├── swarm.md
    │   │   ├── user-tools.md
    │   │   └── workflow.md
    │   ├── github/
    │   │   ├── README.md
    │   │   ├── code-review-swarm.md
    │   │   ├── code-review.md
    │   │   ├── github-modes.md
    │   │   ├── github-swarm.md
    │   │   ├── issue-tracker.md
    │   │   ├── issue-triage.md
    │   │   ├── multi-repo-swarm.md
    │   │   ├── pr-enhance.md
    │   │   ├── pr-manager.md
    │   │   ├── project-board-sync.md
    │   │   ├── release-manager.md
    │   │   ├── release-swarm.md
    │   │   ├── repo-analyze.md
    │   │   ├── repo-architect.md
    │   │   ├── swarm-issue.md
    │   │   ├── swarm-pr.md
    │   │   ├── sync-coordinator.md
    │   │   └── workflow-automation.md
    │   ├── hive-mind/
    │   │   ├── README.md
    │   │   ├── hive-mind-consensus.md
    │   │   ├── hive-mind-init.md
    │   │   ├── hive-mind-memory.md
    │   │   ├── hive-mind-metrics.md
    │   │   ├── hive-mind-resume.md
    │   │   ├── hive-mind-sessions.md
    │   │   ├── hive-mind-spawn.md
    │   │   ├── hive-mind-status.md
    │   │   ├── hive-mind-stop.md
    │   │   ├── hive-mind-wizard.md
    │   │   └── hive-mind.md
    │   ├── hooks/
    │   │   ├── README.md
    │   │   ├── overview.md
    │   │   ├── post-edit.md
    │   │   ├── post-task.md
    │   │   ├── pre-edit.md
    │   │   ├── pre-task.md
    │   │   ├── session-end.md
    │   │   └── setup.md
    │   ├── memory/
    │   │   ├── README.md
    │   │   ├── memory-persist.md
    │   │   ├── memory-search.md
    │   │   ├── memory-usage.md
    │   │   └── neural.md
    │   ├── monitoring/
    │   │   ├── README.md
    │   │   ├── agent-metrics.md
    │   │   ├── agents.md
    │   │   ├── real-time-view.md
    │   │   ├── status.md
    │   │   └── swarm-monitor.md
    │   ├── optimization/
    │   │   ├── README.md
    │   │   ├── auto-topology.md
    │   │   ├── cache-manage.md
    │   │   ├── parallel-execute.md
    │   │   ├── parallel-execution.md
    │   │   └── topology-optimize.md
    │   ├── pair/
    │   │   ├── README.md
    │   │   ├── commands.md
    │   │   ├── config.md
    │   │   ├── examples.md
    │   │   ├── modes.md
    │   │   ├── session.md
    │   │   └── start.md
    │   ├── sparc/
    │   │   ├── analyzer.md
    │   │   ├── architect.md
    │   │   ├── ask.md
    │   │   ├── batch-executor.md
    │   │   ├── code.md
    │   │   ├── coder.md
    │   │   ├── debug.md
    │   │   ├── debugger.md
    │   │   ├── designer.md
    │   │   ├── devops.md
    │   │   ├── docs-writer.md
    │   │   ├── documenter.md
    │   │   ├── innovator.md
    │   │   ├── integration.md
    │   │   ├── mcp.md
    │   │   ├── memory-manager.md
    │   │   ├── optimizer.md
    │   │   ├── orchestrator.md
    │   │   ├── post-deployment-monitoring-mode.md
    │   │   ├── refinement-optimization-mode.md
    │   │   ├── researcher.md
    │   │   ├── reviewer.md
    │   │   ├── security-review.md
    │   │   ├── sparc-modes.md
    │   │   ├── sparc.md
    │   │   ├── spec-pseudocode.md
    │   │   ├── supabase-admin.md
    │   │   ├── swarm-coordinator.md
    │   │   ├── tdd.md
    │   │   ├── tester.md
    │   │   ├── tutorial.md
    │   │   └── workflow-manager.md
    │   ├── stream-chain/
    │   │   ├── pipeline.md
    │   │   └── run.md
    │   ├── swarm/
    │   │   ├── README.md
    │   │   ├── analysis.md
    │   │   ├── development.md
    │   │   ├── examples.md
    │   │   ├── maintenance.md
    │   │   ├── optimization.md
    │   │   ├── research.md
    │   │   ├── swarm-analysis.md
    │   │   ├── swarm-background.md
    │   │   ├── swarm-init.md
    │   │   ├── swarm-modes.md
    │   │   ├── swarm-monitor.md
    │   │   ├── swarm-spawn.md
    │   │   ├── swarm-status.md
    │   │   ├── swarm-strategies.md
    │   │   ├── swarm.md
    │   │   └── testing.md
    │   ├── training/
    │   │   ├── README.md
    │   │   ├── model-update.md
    │   │   ├── neural-patterns.md
    │   │   ├── neural-train.md
    │   │   ├── pattern-learn.md
    │   │   └── specialization.md
    │   ├── truth/
    │   │   └── start.md
    │   ├── verify/
    │   │   ├── check.md
    │   │   └── start.md
    │   ├── workflows/
    │   │   ├── README.md
    │   │   ├── development.md
    │   │   ├── research.md
    │   │   ├── workflow-create.md
    │   │   ├── workflow-execute.md
    │   │   └── workflow-export.md
    │   ├── claude-flow-help.md
    │   ├── claude-flow-memory.md
    │   ├── claude-flow-swarm.md
    │   └── sparc.md
    ├── config/
    │   ├── v3-dependency-optimization.json
    │   └── v3-performance-targets.json
    ├── helpers/
    │   ├── README.md
    │   ├── adr-compliance.sh
    │   ├── aggressive-microcompact.mjs
    │   ├── auto-commit.sh
    │   ├── auto-memory-hook.mjs
    │   ├── checkpoint-manager.sh
    │   ├── context-persistence-hook.mjs
    │   ├── daemon-manager.sh
    │   ├── ddd-tracker.sh
    │   ├── github-safe.js
    │   ├── github-setup.sh
    │   ├── guidance-hook.sh
    │   ├── guidance-hooks.sh
    │   ├── health-monitor.sh
    │   ├── hook-handler.cjs
    │   ├── intelligence.cjs
    │   ├── learning-hooks.sh
    │   ├── learning-optimizer.sh
    │   ├── learning-service.mjs
    │   ├── memory.cjs
    │   ├── metrics-db.mjs
    │   ├── patch-aggressive-prune.mjs
    │   ├── pattern-consolidator.sh
    │   ├── perf-worker.sh
    │   ├── quick-start.sh
    │   ├── router.cjs
    │   ├── security-scanner.sh
    │   ├── session.cjs
    │   ├── setup-mcp.sh
    │   ├── standard-checkpoint-hooks.sh
    │   ├── statusline.cjs
    │   ├── swarm-comms.sh
    │   ├── swarm-hooks.sh
    │   ├── swarm-monitor.sh
    │   ├── sync-v3-metrics.sh
    │   ├── update-v3-progress.sh
    │   ├── v3-quick-status.sh
    │   ├── v3.sh
    │   ├── validate-v3-config.sh
    │   └── worker-manager.sh
    ├── skills/
    │   ├── agentdb-advanced/
    │   │   └── SKILL.md
    │   ├── agentdb-learning/
    │   │   └── SKILL.md
    │   ├── agentdb-memory-patterns/
    │   │   └── SKILL.md
    │   ├── agentdb-optimization/
    │   │   └── SKILL.md
    │   ├── agentdb-vector-search/
    │   │   └── SKILL.md
    │   ├── agentic-jujutsu/
    │   │   └── SKILL.md
    │   ├── browser/
    │   │   └── SKILL.md
    │   ├── dual-mode/
    │   │   ├── README.md
    │   │   ├── dual-collect.md
    │   │   ├── dual-coordinate.md
    │   │   └── dual-spawn.md
    │   ├── flow-nexus-neural/
    │   │   └── SKILL.md
    │   ├── flow-nexus-platform/
    │   │   └── SKILL.md
    │   ├── flow-nexus-swarm/
    │   │   └── SKILL.md
    │   ├── github-code-review/
    │   │   └── SKILL.md
    │   ├── github-multi-repo/
    │   │   └── SKILL.md
    │   ├── github-project-management/
    │   │   └── SKILL.md
    │   ├── github-release-management/
    │   │   └── SKILL.md
    │   ├── github-workflow-automation/
    │   │   └── SKILL.md
    │   ├── hive-mind-advanced/
    │   │   └── SKILL.md
    │   ├── hooks-automation/
    │   │   └── SKILL.md
    │   ├── pair-programming/
    │   │   └── SKILL.md
    │   ├── performance-analysis/
    │   │   └── SKILL.md
    │   ├── reasoningbank-agentdb/
    │   │   └── SKILL.md
    │   ├── reasoningbank-intelligence/
    │   │   └── SKILL.md
    │   ├── skill-builder/
    │   │   └── SKILL.md
    │   ├── sparc-methodology/
    │   │   └── SKILL.md
    │   ├── stream-chain/
    │   │   └── SKILL.md
    │   ├── swarm-advanced/
    │   │   └── SKILL.md
    │   ├── swarm-orchestration/
    │   │   └── SKILL.md
    │   ├── v3-cli-modernization/
    │   │   └── SKILL.md
    │   ├── v3-core-implementation/
    │   │   └── SKILL.md
    │   ├── v3-ddd-architecture/
    │   │   └── SKILL.md
    │   ├── v3-integration-deep/
    │   │   └── SKILL.md
    │   ├── v3-mcp-optimization/
    │   │   └── SKILL.md
    │   ├── v3-memory-unification/
    │   │   └── SKILL.md
    │   ├── v3-performance-optimization/
    │   │   └── SKILL.md
    │   ├── v3-security-overhaul/
    │   │   └── SKILL.md
    │   ├── v3-swarm-coordination/
    │   │   └── SKILL.md
    │   ├── verification-quality/
    │   │   └── SKILL.md
    │   ├── worker-benchmarks/
    │   │   └── SKILL.md
    │   └── worker-integration/
    │   │   └── SKILL.md
    ├── mcp.json
    ├── scheduled_tasks.lock
    ├── settings.json
    ├── settings.json.bak
    ├── statusline-command.sh
    ├── statusline.mjs
    └── statusline.sh
├── .claude-plugin/
    ├── docs/
    │   ├── INSTALLATION.md
    │   ├── PLUGIN_SUMMARY.md
    │   ├── QUICKSTART.md
    │   └── STRUCTURE.md
    ├── hooks/
    │   └── hooks.json
    ├── scripts/
    │   ├── install.sh
    │   ├── ruflo-hook.cjs
    │   ├── ruflo-hook.sh
    │   ├── uninstall.sh
    │   └── verify.sh
    ├── README.md
    ├── marketplace.json
    └── plugin.json
├── .githooks/
    └── pre-commit
├── .github/
    ├── ISSUE_TEMPLATE/
    │   └── rollback-incident.md
    ├── issues/
    │   └── alpha-89-telemetry-implementation.md
    ├── supply-chain/
    │   ├── README.md
    │   ├── accepted-findings.json
    │   ├── allowed-deps.json
    │   └── follow-ups.md
    ├── workflows/
    │   ├── ci.yml
    │   ├── clone-tracker.yml
    │   ├── codex-integration-audit.yml
    │   ├── cost-tracker-smoke.yml
    │   ├── federation-peer-rust.yml
    │   ├── integration-tests.yml
    │   ├── neural-trader-smoke.yml
    │   ├── pages.yml
    │   ├── rollback-manager.yml
    │   ├── ruflo-agent-smoke.yml
    │   ├── status-badges.yml
    │   ├── v3-ci.yml
    │   ├── validate-marketplace.yml
    │   └── verification-pipeline.yml
    ├── CODEOWNERS
    ├── ISSUE_PATTERN_PERSISTENCE.md
    └── dependabot.yml
├── bin/
    ├── cli.js
    ├── npx-repair.js
    └── npx-safe-launch.js
├── data/
    ├── clone-data.ledger.json
    ├── clone-data.proof.json
    └── clone-data.rvf
├── docs/
    ├── benchmarks/
    │   ├── runs/
    │   │   ├── gaia-l1-iter48-verification.json
    │   │   ├── gaia-l1-iter53a-t2-narrowed.json
    │   │   ├── gaia-l1-iter53b-attachment-tools.json
    │   │   ├── gaia-l1-iter56-codeagent.json
    │   │   ├── gaia-l1-iter60-combined.json
    │   │   ├── gaia-l1-iter61b-hybrid-only.json
    │   │   └── gaia-l1-iter63b-convergence-n2.json
    │   ├── guidance-baseline.json
    │   ├── guidance-phase-1.json
    │   ├── guidance-quantization-m4.json
    │   ├── guidance-retriever-scale-baseline-filtered.json
    │   ├── guidance-retriever-scale-baseline.json
    │   ├── guidance-retriever-scale-m4.json
    │   ├── guidance-retriever-scale-phase-1.json
    │   ├── guidance-retriever-scale-phase-3-m3.json
    │   ├── guidance-retriever-scale-phase-3-m3v2-filtered.json
    │   ├── guidance-retriever-scale-phase-3-m3v2.json
    │   └── rvagent-baseline.json
    ├── federation/
    │   ├── README.md
    │   └── phase7-mesh-bringup.md
    ├── validation/
    │   └── README.md
    ├── IMPROVEMENT-ROADMAP.md
    ├── QUALITY-SWEEP.md
    ├── STATUS.md
    ├── TEAM-GATEWAY-CHECKLIST.md
    ├── USERGUIDE.md
    ├── _config.yml
    └── index.md
├── plugin/
    ├── .claude-plugin/
    │   └── plugin.json
    ├── hooks/
    │   └── hooks.json
    └── scripts/
    │   ├── ruflo-hook.cjs
    │   └── ruflo-hook.sh
├── plugins/
    ├── ruflo-adr/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── adr-architect.md
    │   ├── commands/
    │   │   └── adr.md
    │   ├── scripts/
    │   │   ├── import.mjs
    │   │   ├── smoke.sh
    │   │   └── verify.mjs
    │   ├── README.md
    │   └── REFERENCE.md
    ├── ruflo-agent/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── wasm-specialist.md
    │   ├── commands/
    │   │   ├── managed-agent.md
    │   │   └── wasm.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-agentdb/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── agentdb-specialist.md
    │   ├── commands/
    │   │   ├── agentdb.md
    │   │   └── embeddings.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-aidefence/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── safety-specialist.md
    │   ├── commands/
    │   │   └── aidefence.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-autopilot/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── autopilot-coordinator.md
    │   ├── commands/
    │   │   ├── autopilot-status.md
    │   │   └── autopilot.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-browser/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── browser-agent.md
    │   ├── commands/
    │   │   └── ruflo-browser.md
    │   ├── scripts/
    │   │   ├── SITES.txt
    │   │   ├── replay-spike.sh
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-core/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   ├── coder.md
    │   │   ├── researcher.md
    │   │   ├── reviewer.md
    │   │   └── witness-curator.md
    │   ├── commands/
    │   │   ├── ruflo-status.md
    │   │   └── witness.md
    │   ├── hooks/
    │   │   └── hooks.json
    │   ├── scripts/
    │   │   ├── ruflo-hook.cjs
    │   │   ├── ruflo-hook.sh
    │   │   ├── smoke.sh
    │   │   ├── test-cli-no-crash.mjs
    │   │   ├── test-consensus-transport.mjs
    │   │   ├── test-hooks.mjs
    │   │   ├── test-mcp-protocol.mjs
    │   │   ├── test-mcp-roundtrips.mjs
    │   │   └── test-memory-import.mjs
    │   └── README.md
    ├── ruflo-cost-tracker/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── cost-analyst.md
    │   ├── bench/
    │   │   └── booster-corpus.json
    │   ├── commands/
    │   │   └── ruflo-cost.md
    │   ├── scripts/
    │   │   ├── bench.mjs
    │   │   ├── budget.mjs
    │   │   ├── compact.mjs
    │   │   ├── conversation.mjs
    │   │   ├── export.mjs
    │   │   ├── federation.mjs
    │   │   ├── outcome.mjs
    │   │   ├── smoke.sh
    │   │   ├── summary.mjs
    │   │   ├── track.mjs
    │   │   └── trend.mjs
    │   ├── README.md
    │   └── REFERENCE.md
    ├── ruflo-daa/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── daa-specialist.md
    │   ├── commands/
    │   │   └── daa.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-ddd/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── domain-modeler.md
    │   ├── commands/
    │   │   └── ddd.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   ├── README.md
    │   └── REFERENCE.md
    ├── ruflo-docs/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── docs-writer.md
    │   ├── commands/
    │   │   └── ruflo-docs.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-federation/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── federation-coordinator.md
    │   ├── commands/
    │   │   └── federation.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-goals/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   ├── deep-researcher.md
    │   │   ├── dossier-investigator.md
    │   │   ├── goal-planner.md
    │   │   └── horizon-tracker.md
    │   ├── commands/
    │   │   └── goals.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-graph-intelligence/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── src/
    │   │   └── index.ts
    │   ├── tests/
    │   │   ├── adapter-registry.test.ts
    │   │   ├── browser-causal-adapter.test.ts
    │   │   ├── mcp-tools.test.ts
    │   │   ├── phase3-adapters.test.ts
    │   │   ├── phase4-adapters.test.ts
    │   │   ├── phase5-portfolio.test.ts
    │   │   ├── phase6-adapters.test.ts
    │   │   ├── phase6_5-streaming.test.ts
    │   │   ├── phase7-signed-artifact.test.ts
    │   │   ├── phase8-federation.test.ts
    │   │   └── solver-bridge.test.ts
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── vitest.config.ts
    ├── ruflo-intelligence/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── intelligence-specialist.md
    │   ├── commands/
    │   │   ├── intelligence.md
    │   │   └── neural.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-iot-cognitum/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   ├── device-coordinator.md
    │   │   ├── fleet-manager.md
    │   │   ├── telemetry-analyzer.md
    │   │   └── witness-auditor.md
    │   ├── commands/
    │   │   └── iot.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   ├── README.md
    │   └── REFERENCE.md
    ├── ruflo-jujutsu/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── git-specialist.md
    │   ├── commands/
    │   │   └── jujutsu.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-knowledge-graph/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── graph-navigator.md
    │   ├── commands/
    │   │   └── kg.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-loop-workers/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── loop-worker-coordinator.md
    │   ├── commands/
    │   │   ├── ruflo-loop.md
    │   │   └── ruflo-schedule.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-market-data/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── data-engineer.md
    │   ├── commands/
    │   │   └── market.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-migrations/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── migration-engineer.md
    │   ├── commands/
    │   │   └── migrate.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-neural-trader/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   ├── backtest-engineer.md
    │   │   ├── market-analyst.md
    │   │   ├── risk-analyst.md
    │   │   └── trading-strategist.md
    │   ├── benchmarks/
    │   │   ├── backtest-throughput.bench.mjs
    │   │   ├── memory-recall.bench.mjs
    │   │   ├── portfolio-cg.bench.mjs
    │   │   └── signal-generation.bench.mjs
    │   ├── commands/
    │   │   └── trader.md
    │   ├── docs/
    │   │   ├── aidefence-wiring.md
    │   │   ├── perf-notes.md
    │   │   └── security-audit-2026-05-20.md
    │   ├── scripts/
    │   │   ├── runtime-smoke.sh
    │   │   └── smoke.sh
    │   ├── src/
    │   │   ├── pipeline-messages.ts
    │   │   ├── signed-artifact.mjs
    │   │   ├── signed-artifact.ts
    │   │   ├── signed-attribution.mjs
    │   │   ├── signed-attribution.ts
    │   │   ├── sublinear-adapter.mjs
    │   │   └── sublinear-adapter.ts
    │   └── README.md
    ├── ruflo-observability/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── observability-engineer.md
    │   ├── commands/
    │   │   └── observe.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-plugin-creator/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── plugin-developer.md
    │   ├── commands/
    │   │   └── create-plugin.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-rag-memory/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── memory-specialist.md
    │   ├── commands/
    │   │   ├── recall.md
    │   │   └── ruflo-memory.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-ruvector/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── vector-engineer.md
    │   ├── commands/
    │   │   └── vector.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-ruvllm/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── llm-specialist.md
    │   ├── commands/
    │   │   └── ruvllm.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-rvf/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── session-specialist.md
    │   ├── commands/
    │   │   └── rvf.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-security-audit/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── security-auditor.md
    │   ├── commands/
    │   │   └── audit.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-sparc/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── sparc-orchestrator.md
    │   ├── commands/
    │   │   └── ruflo-sparc.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-swarm/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   ├── architect.md
    │   │   └── coordinator.md
    │   ├── commands/
    │   │   ├── swarm.md
    │   │   └── watch.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-testgen/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   └── tester.md
    │   ├── commands/
    │   │   └── testgen.md
    │   ├── scripts/
    │   │   └── smoke.sh
    │   └── README.md
    ├── ruflo-workflows/
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── agents/
    │   │   ├── gaia-benchmark-runner.md
    │   │   ├── gaia-submission-coordinator.md
    │   │   └── workflow-specialist.md
    │   ├── commands/
    │   │   ├── gaia-cost.md
    │   │   ├── gaia-history.md
    │   │   ├── gaia-leaderboard.md
    │   │   ├── gaia-run.md
    │   │   ├── gaia-submit.md
    │   │   ├── gaia-validate.md
    │   │   ├── gaia.md
    │   │   └── workflow.md
    │   ├── scripts/
    │   │   ├── smoke-gaia.sh
    │   │   └── smoke.sh
    │   └── README.md
    └── README.md
├── ruflo/
    ├── assets/
    │   ├── ruFlo.png
    │   └── ruflo-small.jpeg
    ├── bin/
    │   └── ruflo.js
    ├── docs/
    │   ├── adr/
    │   │   ├── ADR-001-EXTENSION-ARCHITECTURE.md
    │   │   ├── ADR-002-WASM-CORE-PACKAGE.md
    │   │   ├── ADR-011-cloud-run-extension-architecture.md
    │   │   ├── ADR-014-CHAT-SYSTEM-ARCHITECTURE.md
    │   │   ├── ADR-018-E2E-TESTING-ARCHITECTURE.md
    │   │   ├── ADR-028-OPENAI-GPT5-INTEGRATION-COPY-BUTTON.md
    │   │   ├── ADR-029-HUGGINGFACE-CHAT-UI-CLOUD-RUN.md
    │   │   ├── ADR-030-MCP-TOOL-GAP-ANALYSIS.md
    │   │   ├── ADR-031-HF-CHAT-HISTORY-PERSISTENCE.md
    │   │   ├── ADR-032-RVF-PRIVATE-MCP-TUNNEL.md
    │   │   ├── ADR-033-RUVECTOR-RUFLO-MCP-INTEGRATION.md
    │   │   ├── ADR-033-RUVOCAL-WASM-MCP-INTEGRATION.md
    │   │   ├── ADR-034-OPTIONAL-MCP-BACKENDS.md
    │   │   ├── ADR-035-MCP-TOOL-GROUPS.md
    │   │   ├── ADR-036-SERVO-RUST-BROWSER-MCP.md
    │   │   └── ADR-037-AUTOPILOT-CHAT-MODE.md
    │   ├── AUTH.md
    │   ├── DOCKER.md
    │   ├── MODELS.md
    │   └── TOOLS.md
    ├── src/
    │   ├── chat-ui/
    │   │   ├── Dockerfile
    │   │   └── patch-mcp-url-safety.sh
    │   ├── config/
    │   │   └── config.example.json
    │   ├── mcp-bridge/
    │   │   ├── Dockerfile
    │   │   ├── index.js
    │   │   ├── mcp-stdio-kernel.js
    │   │   ├── package.json
    │   │   └── test-harness.js
    │   ├── nginx/
    │   │   ├── Dockerfile
    │   │   └── nginx.conf
    │   ├── ruvocal/
    │   │   ├── .dockerignore
    │   │   ├── .eslintignore
    │   │   ├── .eslintrc.cjs
    │   │   ├── .gcloudignore
    │   │   ├── .gitignore
    │   │   ├── .npmrc
    │   │   ├── .prettierignore
    │   │   ├── .prettierrc
    │   │   ├── CLAUDE.md
    │   │   ├── Dockerfile
    │   │   ├── LICENSE
    │   │   ├── PRIVACY.md
    │   │   ├── README.md
    │   │   ├── cloudbuild.yaml
    │   │   ├── docker-compose.yml
    │   │   ├── entrypoint.sh
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── postcss.config.js
    │   │   ├── rvf.manifest.json
    │   │   ├── svelte.config.js
    │   │   ├── tailwind.config.cjs
    │   │   ├── tsconfig.json
    │   │   └── vite.config.ts
    │   ├── scripts/
    │   │   ├── deploy.sh
    │   │   ├── generate-config.js
    │   │   ├── generate-welcome.js
    │   │   └── package-rvf.sh
    │   └── .gitignore
    ├── .env.example
    ├── README.md
    ├── docker-compose.yml
    ├── package.json
    └── rvf.manifest.json
├── scripts/
    ├── __tests__/
    │   └── audit-supply-chain.test.mjs
    ├── audit-cli-mcp-tools.mjs
    ├── audit-codex-integration.mjs
    ├── audit-env-var-precedence.mjs
    ├── audit-fix-invariants.mjs
    ├── audit-hook-commands.mjs
    ├── audit-hook-handler-prompt.mjs
    ├── audit-neural-trader-safety.mjs
    ├── audit-package-dep-overlap.mjs
    ├── audit-plugin-hooks-cross-platform.mjs
    ├── audit-plugin-packages.mjs
    ├── audit-supply-chain.mjs
    ├── audit-tool-descriptions.mjs
    ├── audit-umbrella-version-lockstep.mjs
    ├── audit-vector-dim.mjs
    ├── audit-wrapper-dep-ranges.mjs
    ├── benchmark-graph.mjs
    ├── bulk-fix-tool-descriptions.mjs
    ├── cleanup-v3.sh
    ├── install.sh
    ├── inventory-capabilities.mjs
    ├── regen-witness.mjs
    ├── sign-witness-from-inventory.mjs
    ├── smoke-agent-execute-providers.mjs
    ├── smoke-attribution-opt-in.mjs
    ├── smoke-browser-rvf-create-flags.mjs
    ├── smoke-cli-npx-install.mjs
    ├── smoke-deprecated-actions.mjs
    ├── smoke-github-actions-pins.mjs
    ├── smoke-github-safe-injection.mjs
    ├── smoke-graph-pathfinder.mjs
    ├── smoke-graph-plugin-adapter.mjs
    ├── smoke-graph-query-dispatch.mjs
    ├── smoke-graph-schema-migration.mjs
    ├── smoke-init-bundle-invariants.mjs
    ├── smoke-kg-extract-type-imports.mjs
    ├── smoke-memory-db-path.mjs
    ├── smoke-memory-no-stray-db.mjs
    ├── smoke-memory-stats-legacy-db.mjs
    ├── smoke-neural-trader-backtest-signing.mjs
    ├── smoke-neural-trader-feature-attribution.mjs
    ├── smoke-neural-trader-pipeline.mjs
    ├── smoke-neural-trader-portfolio-cg.mjs
    ├── smoke-plugin-registry-signature.mjs
    ├── smoke-pre-bash-hook.mjs
    ├── smoke-ruflo-hook-cjs.mjs
    ├── smoke-ruvllm-wasm-auto-init.mjs
    ├── smoke-statusline-generator-delegation.mjs
    ├── smoke-tool-output-guardrail.mjs
    ├── smoke-trajectory-graph-edges.mjs
    ├── smoke-wasm-gallery-crud.mjs
    ├── smoke-wasm-plugin-bridge.mjs
    ├── smoke-wasm-provider-bridge.mjs
    ├── smoke-wasm-rvf-compose.mjs
    ├── smoke-windows-hook-execution.mjs
    ├── smoke-windows-init-hooks.mjs
    ├── smoke-witness-marker-drift.mjs
    ├── smoke-witness-verify-precondition.mjs
    ├── track-clones.mjs
    ├── verify-appliance.sh
    └── verify-federation-plugin.sh
├── tests/
    ├── docker-regression/
    │   ├── fixtures/
    │   │   ├── sample-code.ts
    │   │   └── sample-patterns.json
    │   ├── scripts/
    │   │   ├── run-all-tests.sh
    │   │   ├── run-benchmark-tests.sh
    │   │   ├── run-integration-tests.sh
    │   │   ├── run-security-tests.sh
    │   │   ├── run-unit-tests.sh
    │   │   ├── test-agents.sh
    │   │   ├── test-cli-commands.sh
    │   │   ├── test-hooks.sh
    │   │   ├── test-mcp-server.sh
    │   │   ├── test-memory.sh
    │   │   ├── test-performance.sh
    │   │   ├── test-plugins.sh
    │   │   ├── test-security.sh
    │   │   ├── test-swarm.sh
    │   │   ├── test-utils.sh
    │   │   └── test-workers.sh
    │   ├── Dockerfile
    │   ├── Makefile
    │   ├── README.md
    │   └── docker-compose.yml
    ├── context-persistence-hook.test.mjs
    ├── rvf-backend.test.ts
    ├── rvf-capability-verify.test.ts
    ├── rvf-embeddings.test.ts
    ├── rvf-event-log.test.ts
    ├── rvf-integration.test.ts
    ├── rvf-learning-store.test.ts
    └── rvf-migration.test.ts
├── v3/
    ├── __tests__/
    │   ├── appliance/
    │   │   ├── gguf-engine.test.ts
    │   │   ├── rvfa-builder.test.ts
    │   │   ├── rvfa-distribution.test.ts
    │   │   ├── rvfa-format.test.ts
    │   │   └── rvfa-signing.test.ts
    │   ├── features/
    │   │   └── feature-gaps.test.ts
    │   ├── honesty/
    │   │   └── tool-honesty.test.ts
    │   ├── integration/
    │   │   ├── QUICK_START.md
    │   │   ├── README.md
    │   │   ├── TEST_SUMMARY.md
    │   │   ├── fixtures.ts
    │   │   ├── index.ts
    │   │   ├── mcp-integration.test.ts
    │   │   ├── memory-integration.test.ts
    │   │   ├── plugin-integration.test.ts
    │   │   ├── setup.ts
    │   │   ├── swarm-integration.test.ts
    │   │   └── workflow-integration.test.ts
    │   └── setup.ts
    ├── .agentic-flow/
    │   └── intelligence.json
    ├── @claude-flow/
    │   ├── agents/
    │   │   ├── architect.yaml
    │   │   ├── coder.yaml
    │   │   ├── reviewer.yaml
    │   │   ├── security-architect.yaml
    │   │   └── tester.yaml
    │   ├── aidefence/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── browser/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── claims/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── cli/
    │   │   ├── .eslintrc.json
    │   │   ├── CLAUDE.md
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── cli-core/
    │   │   ├── MIGRATION.md
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   └── tsconfig.json
    │   ├── codex/
    │   │   ├── .gitignore
    │   │   ├── AGENTS.md
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── deployment/
    │   │   ├── QUICK_START.md
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── embeddings/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── guidance/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── hooks/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── integration/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── mcp/
    │   │   ├── CLAUDE.md
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── pnpm-lock.yaml
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── memory/
    │   │   ├── .gitignore
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   ├── verify-cross-platform.ts
    │   │   ├── vitest.bench.config.ts
    │   │   ├── vitest.config.ts
    │   │   └── vitest.setup.ts
    │   ├── neural/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── performance/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── plugin-agent-federation/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── plugin-iot-cognitum/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── plugins/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── providers/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── security/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── shared/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   └── tsconfig.json
    │   ├── swarm/
    │   │   ├── MIGRATION.md
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── testing/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   └── tmp.json
    ├── agents/
    │   ├── architect.yaml
    │   ├── coder.yaml
    │   ├── reviewer.yaml
    │   ├── security-architect.yaml
    │   └── tester.yaml
    ├── crates/
    │   └── ruflo-federation-peer/
    │   │   ├── .gitignore
    │   │   ├── Cargo.lock
    │   │   └── Cargo.toml
    ├── docs/
    │   ├── adr/
    │   │   ├── ADR-085-issue-1425-comprehensive-remediation.md
    │   │   ├── ADR-086-ruvllm-native-intelligence-backend.md
    │   │   ├── ADR-087-graph-node-native-backend.md
    │   │   ├── ADR-088-longmemeval-benchmark.md
    │   │   ├── ADR-092-mcp-tool-validation-bugfixes.md
    │   │   ├── ADR-093-mcp-audit-may-2026-remediation.md
    │   │   ├── ADR-094-xenova-to-huggingface-transformers-migration.md
    │   │   ├── ADR-095-architectural-gaps-from-april-audit.md
    │   │   ├── ADR-096-encryption-at-rest.md
    │   │   ├── ADR-097-federation-budget-circuit-breaker.md
    │   │   ├── ADR-098-plugin-capability-sync-and-optimization.md
    │   │   ├── ADR-099-dossier-investigator-recursive-parallel-research.md
    │   │   ├── ADR-100-cli-core-split-lazy-load.md
    │   │   ├── ADR-101-federated-claims.md
    │   │   ├── ADR-102-plugin-hook-cli-flag-regression-ci-guard.md
    │   │   ├── ADR-103-witness-temporal-history.md
    │   │   ├── ADR-104-federation-wire-transport.md
    │   │   ├── ADR-105-federation-v1-state-snapshot.md
    │   │   ├── ADR-106-peer-discovery.md
    │   │   ├── ADR-107-federation-tls.md
    │   │   ├── ADR-108-native-quic-binding.md
    │   │   ├── ADR-109-receive-side-dispatch.md
    │   │   ├── ADR-110-production-spend-reporter.md
    │   │   ├── ADR-111-federation-wg-mesh.md
    │   │   ├── ADR-112-mcp-tool-discoverability.md
    │   │   ├── ADR-114-dspy-ts-plugin.md
    │   │   ├── ADR-115-managed-agents-rvagent-backend.md
    │   │   ├── ADR-117-neural-trader-managed-agent-backtests.md
    │   │   ├── ADR-118-aidefence-2.3.0-upgrade.md
    │   │   ├── ADR-119-midstreamer-adoption-assessment.md
    │   │   ├── ADR-120-midstream-quic-from-agentic-flow.md
    │   │   ├── ADR-122-browser-beyond-sota.md
    │   │   ├── ADR-123-sublinear-integration.md
    │   │   ├── ADR-124-agentic-flow-xenova-optional.md
    │   │   ├── ADR-126-neural-trader-substrate-integration.md
    │   │   ├── ADR-127-github-stack-modernization.md
    │   │   ├── ADR-128-init-bundle-reduce-refactor.md
    │   │   ├── ADR-129-rvagent-full-integration.md
    │   │   ├── ADR-130-graph-intelligence-integration.md
    │   │   ├── ADR-131-tool-output-guardrail.md
    │   │   └── README.md
    │   ├── assets/
    │   │   ├── RuFlo-agentic-appliance.png
    │   │   ├── goal.png
    │   │   ├── ruFlo-Summit.jpg
    │   │   ├── ruVocal-welcome.png
    │   │   ├── ruVocal.png
    │   │   └── ruflo_summit_budapest.md
    │   ├── benchmarks/
    │   │   └── cli-core-cold-cache.json
    │   ├── security/
    │   │   └── owasp-agents-2026-mapping.md
    │   └── CLAUDE-FLOW-VS-TEAMMATE-TOOL-COMPARISON.md
    ├── goal_ui/
    │   ├── docs/
    │   │   ├── DEPLOYMENT.md
    │   │   ├── WIDGET-INTEGRATION.md
    │   │   └── WIDGET_SETUP.md
    │   ├── public/
    │   │   ├── _headers
    │   │   ├── _redirects
    │   │   ├── favicon.svg
    │   │   ├── og-image.png
    │   │   ├── robots.txt
    │   │   └── widget-embed.html
    │   ├── src/
    │   │   ├── App.css
    │   │   ├── App.tsx
    │   │   ├── index.css
    │   │   ├── main.tsx
    │   │   ├── vite-env.d.ts
    │   │   └── widget.tsx
    │   ├── supabase/
    │   │   └── config.toml
    │   ├── .gitignore
    │   ├── README.md
    │   ├── build-widget.sh
    │   ├── components.json
    │   ├── eslint.config.js
    │   ├── example.env
    │   ├── index.html
    │   ├── netlify.toml
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── tailwind.config.ts
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   └── vite.config.ts
    ├── helpers/
    │   ├── docs/
    │   │   └── installation.md
    │   ├── templates/
    │   │   ├── config-validator.sh
    │   │   ├── progress-manager.ps1
    │   │   ├── progress-manager.sh
    │   │   └── status-display.sh
    │   ├── README.md
    │   ├── claude-flow-v3.ps1
    │   └── claude-flow-v3.sh
    ├── implementation/
    │   ├── adrs/
    │   │   ├── ADR-001-AGENT-IMPLEMENTATION.md
    │   │   ├── ADR-002-DDD-STRUCTURE.md
    │   │   ├── ADR-003-CONSOLIDATION-COMPLETE.md
    │   │   ├── ADR-003-implementation-status.md
    │   │   ├── ADR-004-PLUGIN-ARCHITECTURE.md
    │   │   ├── ADR-005-implementation-summary.md
    │   │   ├── ADR-006-UNIFIED-MEMORY.md
    │   │   ├── ADR-007-EVENT-SOURCING.md
    │   │   ├── ADR-008-VITEST.md
    │   │   ├── ADR-009-IMPLEMENTATION.md
    │   │   ├── ADR-010-NODE-ONLY.md
    │   │   ├── ADR-011-llm-provider-system.md
    │   │   ├── ADR-012-mcp-security-features.md
    │   │   ├── ADR-013-core-security-module.md
    │   │   ├── ADR-014-workers-system.md
    │   │   ├── ADR-015-unified-plugin-system.md
    │   │   ├── ADR-015-v2-unified-plugin-system.md
    │   │   ├── ADR-016-collaborative-issue-claims.md
    │   │   ├── ADR-017-ruvector-integration.md
    │   │   ├── ADR-018-claude-code-integration.md
    │   │   ├── ADR-019-headless-runtime-package.md
    │   │   ├── ADR-020-headless-worker-integration.md
    │   │   ├── ADR-021-transfer-hook-ipfs-pattern-sharing.md
    │   │   ├── ADR-022-aidefence-integration.md
    │   │   ├── ADR-023-onnx-hyperbolic-embeddings-init.md
    │   │   ├── ADR-024-embeddings-mcp-tools.md
    │   │   ├── ADR-025-auto-update-system.md
    │   │   ├── ADR-026-agent-booster-model-routing.md
    │   │   ├── ADR-027-GAPS.md
    │   │   ├── ADR-027-codex-ddd.md
    │   │   ├── ADR-027-codex-integration.md
    │   │   ├── ADR-027-codex-package-analysis.md
    │   │   ├── ADR-027-codex-templates.md
    │   │   ├── ADR-027-ruvector-postgresql-integration.md
    │   │   ├── ADR-027-teammate-tool-integration.md
    │   │   ├── ADR-028-neural-attention-mechanisms.md
    │   │   ├── ADR-029-gnn-integration.md
    │   │   ├── ADR-030-agentic-qe-integration.md
    │   │   ├── ADR-031-prime-radiant-integration.md
    │   │   ├── ADR-032-healthcare-clinical-plugin.md
    │   │   ├── ADR-033-financial-risk-plugin.md
    │   │   ├── ADR-034-legal-contract-plugin.md
    │   │   ├── ADR-035-code-intelligence-plugin.md
    │   │   ├── ADR-036-test-intelligence-plugin.md
    │   │   ├── ADR-037-performance-optimization-plugin.md
    │   │   ├── ADR-038-multi-agent-coordination-plugin.md
    │   │   ├── ADR-039-cognitive-kernel-plugin.md
    │   │   ├── ADR-040-quantum-inspired-plugin.md
    │   │   ├── ADR-041-hyperbolic-reasoning-plugin.md
    │   │   ├── ADR-042-gas-town-analysis.md
    │   │   ├── ADR-043-gastown-bridge-plugin.md
    │   │   ├── ADR-044-ipfs-plugin-registry.md
    │   │   ├── ADR-045-guidance-system-v31-integration.md
    │   │   ├── ADR-046-ruflo-rebrand.md
    │   │   ├── ADR-047-fast-mode-integration.md
    │   │   ├── ADR-048-auto-memory-integration.md
    │   │   ├── ADR-049-self-learning-memory-gnn.md
    │   │   ├── ADR-050-intelligence-loop.md
    │   │   ├── ADR-051-infinite-context-compaction-bridge.md
    │   │   ├── ADR-052-statusline-observability-system.md
    │   │   ├── ADR-053-agentdb-v3-controller-activation.md
    │   │   ├── ADR-054-rvf-powered-plugin-marketplace.md
    │   │   ├── ADR-055-agentdb-controller-bug-remediation.md
    │   │   ├── ADR-056-agentic-flow-v3-integration.md
    │   │   ├── ADR-057-rvf-native-storage-backend.md
    │   │   ├── ADR-058-self-contained-ruflo-rvf-appliance.md
    │   │   ├── ADR-059-bug-triage-2026-03.md
    │   │   ├── ADR-059-rvagent-wasm-integration.md
    │   │   ├── ADR-060-remaining-bugs-2026-03.md
    │   │   ├── ADR-061-deep-audit-findings-2026-03.md
    │   │   ├── ADR-062-cross-platform-hook-commands-2026-03.md
    │   │   ├── ADR-063-deep-capability-audit-v3519.md
    │   │   ├── ADR-064-stub-remediation-v3522.md
    │   │   ├── ADR-065-external-pr-review-v3523.md
    │   │   ├── ADR-066-v3524-audit-remediation.md
    │   │   ├── ADR-067-critical-issue-remediation-v3543.md
    │   │   ├── ADR-067-ruvector-wasm-utilization.md
    │   │   ├── ADR-070-rvagent-wasm-completion.md
    │   │   ├── ADR-071-guidance-tools-mcp-fixes.md
    │   │   ├── ADR-072-autopilot-persistent-completion.md
    │   │   ├── ADR-073-stub-tool-honesty-real-predictions.md
    │   │   ├── ADR-075-wire-learning-pipeline.md
    │   │   ├── ADR-076-claude-code-memory-bridge.md
    │   │   ├── ADR-077-diskann-vector-backend.md
    │   │   ├── ADR-078-agent-llm-federation-plugin.md
    │   │   ├── ADR-079-iot-cognitum-plugin.md
    │   │   ├── ADR-STATUS-SUMMARY.md
    │   │   ├── README.md
    │   │   ├── SECURITY-REVIEW-SUMMARY.md
    │   │   └── v3-adrs.md
    │   ├── architecture/
    │   │   ├── AGENTIC-FLOW-INTEGRATION-ANALYSIS.md
    │   │   ├── SDK-ARCHITECTURE-ANALYSIS.md
    │   │   └── v3-assessment.md
    │   ├── hooks/
    │   │   ├── CLI-REFERENCE.md
    │   │   ├── MCP-TOOLS.md
    │   │   ├── README.md
    │   │   └── STATUSLINE-DAEMONS.md
    │   ├── init/
    │   │   ├── API.md
    │   │   ├── COMPONENTS.md
    │   │   ├── CONFIGURATION.md
    │   │   ├── HOOKS.md
    │   │   └── README.md
    │   ├── integration/
    │   │   ├── AGENTS-SKILLS-COMMANDS-HOOKS.md
    │   │   └── HOOKS-LEARNING-INTEGRATION.md
    │   ├── migration/
    │   │   ├── MIGRATION-GUIDE.md
    │   │   └── v3-migration-roadmap.md
    │   ├── optimization/
    │   │   └── V3-OPTIMIZATION-ROADMAP.md
    │   ├── planning/
    │   │   ├── CLAUDE-FLOW-V3-MASTER-PLAN.md
    │   │   ├── LEARNING-OPTIMIZED-PLAN.md
    │   │   └── V3-OPTIMIZED-PLAN.md
    │   ├── plugins/
    │   │   └── README.md
    │   ├── reports/
    │   │   └── V2-COMPATIBILITY-REPORT.md
    │   ├── research/
    │   │   ├── better-sqlite3-usage-inventory.md
    │   │   ├── sqljs-implementation-guide.md
    │   │   ├── windows-sqlite-sqljs-migration.md
    │   │   └── windows-support-summary.md
    │   ├── security/
    │   │   ├── SECURITY_AUDIT_REPORT.md
    │   │   ├── SECURITY_FIXES_CHECKLIST.md
    │   │   └── SECURITY_SUMMARY.md
    │   ├── swarm-plans/
    │   │   ├── AGENT-SPECIFICATIONS.md
    │   │   ├── BENCHMARK-OPTIMIZATION.md
    │   │   ├── DEPLOYMENT-PLAN.md
    │   │   ├── GITHUB-ISSUE-TRACKING.md
    │   │   ├── SWARM-OVERVIEW.md
    │   │   └── TDD-LONDON-SCHOOL-PLAN.md
    │   ├── v3-migration/
    │   │   ├── BACKWARD-COMPATIBILITY.md
    │   │   ├── CAPABILITY-GAP-ANALYSIS.md
    │   │   ├── CLI-MIGRATION.md
    │   │   ├── HIVE-MIND-MIGRATION.md
    │   │   ├── HOOKS-MIGRATION.md
    │   │   ├── MCP-TOOLS-MIGRATION.md
    │   │   ├── MEMORY-NEURAL-MIGRATION.md
    │   │   ├── MIGRATION.md
    │   │   └── README.md
    │   ├── PLUGIN_INTEGRATION.md
    │   └── README.md
    ├── mcp/
    │   ├── __tests__/
    │   │   ├── session-tools.test.ts
    │   │   ├── system-tools.test.ts
    │   │   └── task-tools.test.ts
    │   ├── tools/
    │   │   ├── IMPLEMENTATION.md
    │   │   ├── README.md
    │   │   ├── agent-tools.d.ts
    │   │   ├── agent-tools.d.ts.map
    │   │   ├── agent-tools.js
    │   │   ├── agent-tools.js.map
    │   │   ├── agent-tools.ts
    │   │   ├── config-tools.d.ts
    │   │   ├── config-tools.d.ts.map
    │   │   ├── config-tools.js
    │   │   ├── config-tools.js.map
    │   │   ├── config-tools.ts
    │   │   ├── federation-tools.d.ts
    │   │   ├── federation-tools.d.ts.map
    │   │   ├── federation-tools.js
    │   │   ├── federation-tools.js.map
    │   │   ├── federation-tools.ts
    │   │   ├── hooks-tools.d.ts
    │   │   ├── hooks-tools.d.ts.map
    │   │   ├── hooks-tools.js
    │   │   ├── hooks-tools.js.map
    │   │   ├── hooks-tools.ts
    │   │   ├── index.d.ts
    │   │   ├── index.d.ts.map
    │   │   ├── index.js
    │   │   ├── index.js.map
    │   │   ├── index.ts
    │   │   ├── memory-tools.d.ts
    │   │   ├── memory-tools.d.ts.map
    │   │   ├── memory-tools.js
    │   │   ├── memory-tools.js.map
    │   │   ├── memory-tools.ts
    │   │   ├── session-tools.d.ts
    │   │   ├── session-tools.d.ts.map
    │   │   ├── session-tools.js
    │   │   ├── session-tools.js.map
    │   │   ├── session-tools.ts
    │   │   ├── sona-tools.d.ts
    │   │   ├── sona-tools.d.ts.map
    │   │   ├── sona-tools.js
    │   │   ├── sona-tools.js.map
    │   │   ├── sona-tools.ts
    │   │   ├── swarm-tools.d.ts
    │   │   ├── swarm-tools.d.ts.map
    │   │   ├── swarm-tools.js
    │   │   ├── swarm-tools.js.map
    │   │   ├── swarm-tools.ts
    │   │   ├── system-tools.d.ts
    │   │   ├── system-tools.d.ts.map
    │   │   ├── system-tools.js
    │   │   ├── system-tools.js.map
    │   │   ├── system-tools.ts
    │   │   ├── task-tools.d.ts
    │   │   ├── task-tools.d.ts.map
    │   │   ├── task-tools.js
    │   │   ├── task-tools.js.map
    │   │   ├── task-tools.ts
    │   │   ├── v2-compat-tools.d.ts
    │   │   ├── v2-compat-tools.d.ts.map
    │   │   ├── v2-compat-tools.js
    │   │   ├── v2-compat-tools.js.map
    │   │   ├── v2-compat-tools.ts
    │   │   ├── worker-tools.d.ts
    │   │   ├── worker-tools.d.ts.map
    │   │   ├── worker-tools.js
    │   │   ├── worker-tools.js.map
    │   │   └── worker-tools.ts
    │   ├── transport/
    │   │   ├── connection-pool.ts
    │   │   ├── http.ts
    │   │   ├── index.ts
    │   │   ├── stdio.ts
    │   │   └── websocket.ts
    │   ├── connection-pool.ts
    │   ├── index.ts
    │   ├── server-entry.ts
    │   ├── server.ts
    │   ├── session-manager.ts
    │   ├── tmp.json
    │   ├── tool-registry.ts
    │   ├── types.d.ts.map
    │   ├── types.js
    │   ├── types.js.map
    │   └── types.ts
    ├── plugins/
    │   ├── agentic-qe/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── plugin.yaml
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── code-intelligence/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── cognitive-kernel/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── financial-risk/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── gastown-bridge/
    │   │   ├── .size-limit.json
    │   │   ├── Cargo.toml
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   ├── tsup.config.ts
    │   │   └── vitest.config.ts
    │   ├── healthcare-clinical/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── hyperbolic-reasoning/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── legal-contracts/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── neural-coordination/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── perf-optimizer/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── prime-radiant/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── plugin.yaml
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── quantum-optimizer/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── ruvector-upstream/
    │   │   ├── README.md
    │   │   ├── package.json
    │   │   └── tsconfig.json
    │   ├── teammate-plugin/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tmp.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   ├── test-intelligence/
    │   │   ├── README.md
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   └── vitest.config.ts
    │   └── SECURITY-AUDIT.md
    ├── scripts/
    │   ├── prepare-publish.js
    │   ├── quick-benchmark.mjs
    │   ├── start-mcp.cmd
    │   └── start-mcp.sh
    ├── src/
    │   ├── mcp/
    │   │   └── index.ts
    │   └── index.ts
    ├── CHANGELOG.md
    ├── CLAUDE.md
    ├── README.md
    ├── bunfig.toml
    ├── index.ts
    ├── package-lock.json
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── swarm.config.ts
    ├── tmp.json
    ├── tsconfig.base.json
    ├── tsconfig.json
    ├── tsconfig.vitest-temp.json
    └── vitest.config.ts
├── verification/
    ├── linux/
    │   ├── history.jsonl
    │   ├── manifest.md.json
    │   └── performance.jsonl
    ├── macos/
    │   ├── history.jsonl
    │   ├── manifest.md.json
    │   └── performance.jsonl
    ├── windows/
    │   ├── history.jsonl
    │   ├── manifest.md.json
    │   └── performance.jsonl
    ├── CAPABILITIES.md
    ├── README.md
    ├── cli-mcp-tool-baseline.json
    ├── inventory.json
    ├── mcp-tool-baseline.json
    ├── results.md
    └── witness-fixes.json
├── .gitignore
├── .npmignore
├── AGENTS.md
├── CHANGELOG.md
├── CLAUDE.local.md
├── CLAUDE.md
├── LICENSE
├── README.md
├── SECURITY.md
├── agentdb.rvf
├── agentdb.rvf.lock
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── ruflo-plugins.gif
└── tsconfig.json
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `shadcn-admin-main/`

- **Files:** 272 · **Directories:** 68
- **Entry:** `README.md`

```
shadcn-admin-main/
├── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── config.yml
    │   ├── ✨-feature-request.md
    │   └── 🐞-bug-report.md
    ├── workflows/
    │   ├── ci.yml
    │   └── stale.yml
    ├── CODE_OF_CONDUCT.md
    ├── CONTRIBUTING.md
    ├── FUNDING.yml
    └── PULL_REQUEST_TEMPLATE.md
├── .vscode/
    ├── extensions.json
    └── settings.json
├── public/
    └── images/
    │   ├── favicon.png
    │   ├── favicon.svg
    │   ├── favicon_light.png
    │   ├── favicon_light.svg
    │   └── shadcn-admin.png
├── src/
    ├── assets/
    │   ├── brand-icons/
    │   │   ├── icon-discord.tsx
    │   │   ├── icon-docker.tsx
    │   │   ├── icon-facebook.tsx
    │   │   ├── icon-figma.tsx
    │   │   ├── icon-github.tsx
    │   │   ├── icon-gitlab.tsx
    │   │   ├── icon-gmail.tsx
    │   │   ├── icon-medium.tsx
    │   │   ├── icon-notion.tsx
    │   │   ├── icon-skype.tsx
    │   │   ├── icon-slack.tsx
    │   │   ├── icon-stripe.tsx
    │   │   ├── icon-telegram.tsx
    │   │   ├── icon-trello.tsx
    │   │   ├── icon-whatsapp.tsx
    │   │   ├── icon-zoom.tsx
    │   │   └── index.ts
    │   ├── custom/
    │   │   ├── icon-dir.tsx
    │   │   ├── icon-layout-compact.tsx
    │   │   ├── icon-layout-default.tsx
    │   │   ├── icon-layout-full.tsx
    │   │   ├── icon-sidebar-floating.tsx
    │   │   ├── icon-sidebar-inset.tsx
    │   │   ├── icon-sidebar-sidebar.tsx
    │   │   ├── icon-theme-dark.tsx
    │   │   ├── icon-theme-light.tsx
    │   │   └── icon-theme-system.tsx
    │   ├── clerk-full-logo.tsx
    │   ├── clerk-logo.tsx
    │   └── logo.tsx
    ├── components/
    │   ├── data-table/
    │   │   ├── bulk-actions.tsx
    │   │   ├── column-header.tsx
    │   │   ├── faceted-filter.tsx
    │   │   ├── index.ts
    │   │   ├── pagination.tsx
    │   │   ├── toolbar.tsx
    │   │   └── view-options.tsx
    │   ├── layout/
    │   │   ├── app-sidebar.tsx
    │   │   ├── app-title.tsx
    │   │   ├── authenticated-layout.tsx
    │   │   ├── header.tsx
    │   │   ├── main.tsx
    │   │   ├── nav-group.tsx
    │   │   ├── nav-user.tsx
    │   │   ├── team-switcher.tsx
    │   │   ├── top-nav.tsx
    │   │   └── types.ts
    │   ├── ui/
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── popover.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   └── tooltip.tsx
    │   ├── coming-soon.tsx
    │   ├── command-menu.tsx
    │   ├── config-drawer.test.tsx
    │   ├── config-drawer.tsx
    │   ├── confirm-dialog.test.tsx
    │   ├── confirm-dialog.tsx
    │   ├── date-picker.tsx
    │   ├── learn-more.tsx
    │   ├── long-text.tsx
    │   ├── navigation-progress.tsx
    │   ├── password-input.test.tsx
    │   ├── password-input.tsx
    │   ├── profile-dropdown.tsx
    │   ├── search.tsx
    │   ├── select-dropdown.tsx
    │   ├── sign-out-dialog.test.tsx
    │   ├── sign-out-dialog.tsx
    │   ├── skip-to-main.tsx
    │   └── theme-switch.tsx
    ├── config/
    │   └── fonts.ts
    ├── context/
    │   ├── direction-provider.tsx
    │   ├── font-provider.tsx
    │   ├── layout-provider.tsx
    │   ├── search-provider.test.tsx
    │   ├── search-provider.tsx
    │   └── theme-provider.tsx
    ├── features/
    │   ├── apps/
    │   │   └── index.tsx
    │   ├── auth/
    │   │   └── auth-layout.tsx
    │   ├── chats/
    │   │   └── index.tsx
    │   ├── dashboard/
    │   │   └── index.tsx
    │   ├── errors/
    │   │   ├── forbidden.tsx
    │   │   ├── general-error.tsx
    │   │   ├── maintenance-error.tsx
    │   │   ├── not-found-error.tsx
    │   │   └── unauthorized-error.tsx
    │   ├── settings/
    │   │   └── index.tsx
    │   ├── tasks/
    │   │   └── index.tsx
    │   └── users/
    │   │   └── index.tsx
    ├── hooks/
    │   ├── use-dialog-state.tsx
    │   ├── use-mobile.tsx
    │   ├── use-table-url-state.test.ts
    │   └── use-table-url-state.ts
    ├── lib/
    │   ├── cookies.test.ts
    │   ├── cookies.ts
    │   ├── handle-server-error.test.ts
    │   ├── handle-server-error.ts
    │   ├── show-submitted-data.tsx
    │   ├── utils.test.ts
    │   └── utils.ts
    ├── routes/
    │   ├── _authenticated/
    │   │   ├── index.tsx
    │   │   └── route.tsx
    │   ├── (auth)/
    │   │   ├── forgot-password.tsx
    │   │   ├── otp.tsx
    │   │   ├── sign-in-2.tsx
    │   │   ├── sign-in.tsx
    │   │   └── sign-up.tsx
    │   ├── (errors)/
    │   │   ├── 401.tsx
    │   │   ├── 403.tsx
    │   │   ├── 404.tsx
    │   │   ├── 500.tsx
    │   │   └── 503.tsx
    │   ├── clerk/
    │   │   └── route.tsx
    │   └── __root.tsx
    ├── stores/
    │   ├── auth-store.test.ts
    │   └── auth-store.ts
    ├── styles/
    │   ├── index.css
    │   └── theme.css
    ├── test-utils/
    │   ├── cookies.ts
    │   └── tanstack-table.ts
    ├── main.tsx
    ├── routeTree.gen.ts
    ├── tanstack-table.d.ts
    └── vite-env.d.ts
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── CHANGELOG.md
├── LICENSE
├── README.md
├── components.json
├── cz.yaml
├── eslint.config.js
├── index.html
├── knip.config.ts
├── netlify.toml
├── package.json
├── pnpm-lock.yaml
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `shadcn-studio-main/`

- **Files:** 1645 · **Directories:** 182
- **Entry:** `README.md`

```
shadcn-studio-main/
├── .vscode/
    ├── extensions.json
    └── settings.json
├── public/
    └── r/
    │   ├── about-us-page-01.json
    │   ├── accordion-01.json
    │   ├── accordion-02.json
    │   ├── accordion-03.json
    │   ├── accordion-04.json
    │   ├── accordion-05.json
    │   ├── accordion-06.json
    │   ├── accordion-07.json
    │   ├── accordion-08.json
    │   ├── accordion-09.json
    │   ├── accordion-10.json
    │   ├── accordion-11.json
    │   ├── accordion-12.json
    │   ├── accordion-13.json
    │   ├── accordion-14.json
    │   ├── accordion-15.json
    │   ├── accordion-16.json
    │   ├── alert-01.json
    │   ├── alert-02.json
    │   ├── alert-03.json
    │   ├── alert-04.json
    │   ├── alert-05.json
    │   ├── alert-06.json
    │   ├── alert-07.json
    │   ├── alert-08.json
    │   ├── alert-09.json
    │   ├── alert-10.json
    │   ├── alert-11.json
    │   ├── alert-12.json
    │   ├── alert-13.json
    │   ├── alert-14.json
    │   ├── alert-15.json
    │   ├── alert-16.json
    │   ├── alert-17.json
    │   ├── alert-18.json
    │   ├── alert-19.json
    │   ├── alert-20.json
    │   ├── alert-21.json
    │   ├── alert-22.json
    │   ├── alert-23.json
    │   ├── alert-24.json
    │   ├── alert-25.json
    │   ├── alert-26.json
    │   ├── alert-27.json
    │   ├── alert-28.json
    │   ├── alert-29.json
    │   ├── alert-30.json
    │   ├── app-integration-01.json
    │   ├── application-shell-01.json
    │   ├── art-deco.json
    │   ├── avatar-01.json
    │   ├── avatar-02.json
    │   ├── avatar-03.json
    │   ├── avatar-04.json
    │   ├── avatar-05.json
    │   ├── avatar-06.json
    │   ├── avatar-07.json
    │   ├── avatar-08.json
    │   ├── avatar-09.json
    │   ├── avatar-10.json
    │   ├── avatar-11.json
    │   ├── avatar-12.json
    │   ├── avatar-13.json
    │   ├── avatar-14.json
    │   ├── avatar-15.json
    │   ├── avatar-16.json
    │   ├── avatar-17.json
    │   ├── avatar-18.json
    │   ├── avatar-19.json
    │   ├── avatar-20.json
    │   ├── avatar-21.json
    │   ├── badge-01.json
    │   ├── badge-02.json
    │   ├── badge-03.json
    │   ├── badge-04.json
    │   ├── badge-05.json
    │   ├── badge-06.json
    │   ├── badge-07.json
    │   ├── badge-08.json
    │   ├── badge-09.json
    │   ├── badge-10.json
    │   ├── badge-11.json
    │   ├── badge-12.json
    │   ├── badge-13.json
    │   ├── badge-14.json
    │   ├── badge-15.json
    │   ├── badge-16.json
    │   ├── badge-17.json
    │   ├── badge-18.json
    │   ├── badge-19.json
    │   ├── badge-20.json
    │   ├── badge-21.json
    │   ├── badge-22.json
    │   ├── badge-23.json
    │   ├── badge-24.json
    │   ├── blog-component-01.json
    │   ├── breadcrumb-01.json
    │   ├── breadcrumb-02.json
    │   ├── breadcrumb-03.json
    │   ├── breadcrumb-04.json
    │   ├── breadcrumb-05.json
    │   ├── breadcrumb-06.json
    │   ├── breadcrumb-07.json
    │   ├── breadcrumb-08.json
    │   ├── button-01.json
    │   ├── button-02.json
    │   ├── button-03.json
    │   ├── button-04.json
    │   ├── button-05.json
    │   ├── button-06.json
    │   ├── button-07.json
    │   ├── button-08.json
    │   ├── button-09.json
    │   ├── button-10.json
    │   ├── button-11.json
    │   ├── button-12.json
    │   ├── button-13.json
    │   ├── button-14.json
    │   ├── button-15.json
    │   ├── button-16.json
    │   ├── button-17.json
    │   ├── button-18.json
    │   ├── button-19.json
    │   ├── button-20.json
    │   ├── button-21.json
    │   ├── button-22.json
    │   ├── button-23.json
    │   ├── button-24.json
    │   ├── button-25.json
    │   ├── button-26.json
    │   ├── button-27.json
    │   ├── button-28.json
    │   ├── button-29.json
    │   ├── button-30.json
    │   ├── button-31.json
    │   ├── button-32.json
    │   ├── button-33.json
    │   ├── button-34.json
    │   ├── button-35.json
    │   ├── button-36.json
    │   ├── button-37.json
    │   ├── button-38.json
    │   ├── button-39.json
    │   ├── button-40.json
    │   ├── button-41.json
    │   ├── button-42.json
    │   ├── button-43.json
    │   ├── button-44.json
    │   ├── button-45.json
    │   ├── button-46.json
    │   ├── button-47.json
    │   ├── button-group-01.json
    │   ├── button-group-02.json
    │   ├── button-group-03.json
    │   ├── button-group-04.json
    │   ├── button-group-05.json
    │   ├── button-group-06.json
    │   ├── button-group-07.json
    │   ├── button-group-08.json
    │   ├── button-group-09.json
    │   ├── button-group-10.json
    │   ├── button-group-11.json
    │   ├── button-group-12.json
    │   ├── button-group-13.json
    │   ├── button-group-14.json
    │   ├── button-group-15.json
    │   ├── button-group-16.json
    │   ├── caffeine.json
    │   ├── calendar-01.json
    │   ├── calendar-02.json
    │   ├── calendar-03.json
    │   ├── calendar-04.json
    │   ├── calendar-05.json
    │   ├── calendar-06.json
    │   ├── calendar-07.json
    │   ├── calendar-08.json
    │   ├── calendar-09.json
    │   ├── calendar-10.json
    │   ├── calendar-11.json
    │   ├── calendar-12.json
    │   ├── calendar-13.json
    │   ├── calendar-14.json
    │   ├── calendar-15.json
    │   ├── calendar-16.json
    │   ├── calendar-17.json
    │   ├── calendar-18.json
    │   ├── calendar-19.json
    │   ├── calendar-20.json
    │   ├── calendar-21.json
    │   ├── calendar-22.json
    │   ├── calendar-23.json
    │   ├── calendar-24.json
    │   ├── calendar-25.json
    │   ├── card-01.json
    │   ├── card-02.json
    │   ├── card-03.json
    │   ├── card-04.json
    │   ├── card-05.json
    │   ├── card-06.json
    │   ├── card-07.json
    │   ├── card-08.json
    │   ├── card-09.json
    │   ├── card-10.json
    │   ├── card-11.json
    │   ├── card-12.json
    │   ├── card-13.json
    │   ├── card-14.json
    │   ├── card-15.json
    │   ├── card-16.json
    │   ├── card-17.json
    │   ├── chart-component-01.json
    │   ├── checkbox-01.json
    │   ├── checkbox-02.json
    │   ├── checkbox-03.json
    │   ├── checkbox-04.json
    │   ├── checkbox-05.json
    │   ├── checkbox-06.json
    │   ├── checkbox-07.json
    │   ├── checkbox-08.json
    │   ├── checkbox-09.json
    │   ├── checkbox-10.json
    │   ├── checkbox-11.json
    │   ├── checkbox-12.json
    │   ├── checkbox-13.json
    │   ├── checkbox-14.json
    │   ├── checkbox-15.json
    │   ├── checkbox-16.json
    │   ├── checkbox-17.json
    │   ├── checkbox-18.json
    │   ├── checkbox-19.json
    │   ├── claude.json
    │   ├── clean-slate.json
    │   ├── collapsible-01.json
    │   ├── collapsible-02.json
    │   ├── collapsible-03.json
    │   ├── collapsible-04.json
    │   ├── collapsible-05.json
    │   ├── collapsible-06.json
    │   ├── collapsible-07.json
    │   ├── collapsible-08.json
    │   ├── collapsible-09.json
    │   ├── collapsible-10.json
    │   ├── combobox-01.json
    │   ├── combobox-02.json
    │   ├── combobox-03.json
    │   ├── combobox-04.json
    │   ├── combobox-05.json
    │   ├── combobox-06.json
    │   ├── combobox-07.json
    │   ├── combobox-08.json
    │   ├── combobox-09.json
    │   ├── combobox-10.json
    │   ├── combobox-11.json
    │   ├── combobox-12.json
    │   ├── combobox-13.json
    │   ├── combobox-14.json
    │   ├── contact-us-page-01.json
    │   ├── corporate.json
    │   ├── cta-section-01.json
    │   ├── dashboard-dialog-01.json
    │   ├── dashboard-dropdown-01.json
    │   ├── dashboard-dropdown-02.json
    │   ├── dashboard-footer-01.json
    │   ├── dashboard-header-01.json
    │   ├── dashboard-shell-01.json
    │   ├── dashboard-sidebar-01.json
    │   ├── data-table-01.json
    │   ├── data-table-02.json
    │   ├── data-table-03.json
    │   ├── data-table-04.json
    │   ├── data-table-05.json
    │   ├── data-table-06.json
    │   ├── data-table-07.json
    │   ├── data-table-08.json
    │   ├── data-table-09.json
    │   ├── data-table-10.json
    │   ├── data-table-11.json
    │   ├── data-table-12.json
    │   ├── data-table-13.json
    │   ├── date-picker-01.json
    │   ├── date-picker-02.json
    │   ├── date-picker-03.json
    │   ├── date-picker-04.json
    │   ├── date-picker-05.json
    │   ├── date-picker-06.json
    │   ├── date-picker-07.json
    │   ├── date-picker-08.json
    │   ├── date-picker-09.json
    │   ├── date-picker-10.json
    │   ├── date-picker-11.json
    │   ├── date-picker-12.json
    │   ├── date-picker-13.json
    │   ├── dialog-01.json
    │   ├── dialog-02.json
    │   ├── dialog-03.json
    │   ├── dialog-04.json
    │   ├── dialog-05.json
    │   ├── dialog-06.json
    │   ├── dialog-07.json
    │   ├── dialog-08.json
    │   ├── dialog-09.json
    │   ├── dialog-10.json
    │   ├── dialog-11.json
    │   ├── dialog-12.json
    │   ├── dialog-13.json
    │   ├── dialog-14.json
    │   ├── dialog-15.json
    │   ├── dialog-16.json
    │   ├── dialog-17.json
    │   ├── dialog-18.json
    │   ├── dialog-19.json
    │   ├── dialog-20.json
    │   ├── dialog-21.json
    │   ├── dialog-22.json
    │   ├── dialog-23.json
    │   ├── dialog-24.json
    │   ├── dialog-25.json
    │   ├── dialog-26.json
    │   ├── dropdown-menu-01.json
    │   ├── dropdown-menu-02.json
    │   ├── dropdown-menu-03.json
    │   ├── dropdown-menu-04.json
    │   ├── dropdown-menu-05.json
    │   ├── dropdown-menu-06.json
    │   ├── dropdown-menu-07.json
    │   ├── dropdown-menu-08.json
    │   ├── dropdown-menu-09.json
    │   ├── dropdown-menu-10.json
    │   ├── dropdown-menu-11.json
    │   ├── dropdown-menu-12.json
    │   ├── dropdown-menu-13.json
    │   ├── dropdown-menu-14.json
    │   ├── dropdown-menu-15.json
    │   ├── dropdown-menu-16.json
    │   ├── elegant-luxury.json
    │   ├── error-page-01.json
    │   ├── faq-component-01.json
    │   ├── features-section-01.json
    │   ├── footer-component-01.json
    │   ├── forgot-password-01.json
    │   ├── form-01.json
    │   ├── form-02.json
    │   ├── form-03.json
    │   ├── form-04.json
    │   ├── form-05.json
    │   ├── form-06.json
    │   ├── form-07.json
    │   ├── form-08.json
    │   ├── form-09.json
    │   ├── form-10.json
    │   ├── gallery-component-01.json
    │   ├── ghibli-studio.json
    │   ├── hero-section-01.json
    │   ├── input-01.json
    │   ├── input-02.json
    │   ├── input-03.json
    │   ├── input-04.json
    │   ├── input-05.json
    │   ├── input-06.json
    │   ├── input-07.json
    │   ├── input-08.json
    │   ├── input-09.json
    │   ├── input-10.json
    │   ├── input-11.json
    │   ├── input-12.json
    │   ├── input-13.json
    │   ├── input-14.json
    │   ├── input-15.json
    │   ├── input-16.json
    │   ├── input-17.json
    │   ├── input-18.json
    │   ├── input-19.json
    │   ├── input-20.json
    │   ├── input-21.json
    │   ├── input-22.json
    │   ├── input-23.json
    │   ├── input-24.json
    │   ├── input-25.json
    │   ├── input-26.json
    │   ├── input-27.json
    │   ├── input-28.json
    │   ├── input-29.json
    │   ├── input-30.json
    │   ├── input-31.json
    │   ├── input-32.json
    │   ├── input-33.json
    │   ├── input-34.json
    │   ├── input-35.json
    │   ├── input-36.json
    │   ├── input-37.json
    │   ├── input-38.json
    │   ├── input-39.json
    │   ├── input-40.json
    │   ├── input-41.json
    │   ├── input-42.json
    │   ├── input-43.json
    │   ├── input-44.json
    │   ├── input-45.json
    │   ├── input-46.json
    │   ├── input-mask-01.json
    │   ├── input-mask-02.json
    │   ├── input-mask-03.json
    │   ├── input-mask-04.json
    │   ├── input-mask-05.json
    │   ├── input-mask-06.json
    │   ├── input-otp-01.json
    │   ├── input-otp-02.json
    │   ├── input-otp-03.json
    │   ├── input-otp-04.json
    │   ├── input-otp-05.json
    │   ├── input-otp-06.json
    │   ├── input-otp-07.json
    │   ├── input-otp-08.json
    │   ├── input-otp-09.json
    │   ├── input-otp-10.json
    │   ├── login-page-01.json
    │   ├── logo-cloud-01.json
    │   ├── marshmallow.json
    │   ├── marvel.json
    │   ├── material-design.json
    │   ├── midnight-bloom.json
    │   ├── modern-minimal.json
    │   ├── nature.json
    │   ├── navbar-component-01.json
    │   ├── neo-brutalism.json
    │   ├── pagination-01.json
    │   ├── pagination-02.json
    │   ├── pagination-03.json
    │   ├── pagination-04.json
    │   ├── pagination-05.json
    │   ├── pagination-06.json
    │   ├── pagination-07.json
    │   ├── pagination-08.json
    │   ├── pagination-09.json
    │   ├── pagination-10.json
    │   ├── pagination-11.json
    │   ├── pagination-12.json
    │   ├── pagination-13.json
    │   ├── pagination-14.json
    │   ├── pagination-15.json
    │   ├── pastel-dreams.json
    │   ├── perplexity.json
    │   ├── popover-01.json
    │   ├── popover-02.json
    │   ├── popover-03.json
    │   ├── popover-04.json
    │   ├── popover-05.json
    │   ├── popover-06.json
    │   ├── popover-07.json
    │   ├── popover-08.json
    │   ├── popover-09.json
    │   ├── popover-10.json
    │   ├── popover-11.json
    │   ├── popover-12.json
    │   ├── popover-13.json
    │   ├── popover-14.json
    │   ├── popover-15.json
    │   ├── portfolio-01.json
    │   ├── pricing-component-01.json
    │   ├── product-list-01.json
    │   ├── radio-group-01.json
    │   ├── radio-group-02.json
    │   ├── radio-group-03.json
    │   ├── radio-group-04.json
    │   ├── radio-group-05.json
    │   ├── radio-group-06.json
    │   ├── radio-group-07.json
    │   ├── radio-group-08.json
    │   ├── radio-group-09.json
    │   ├── radio-group-10.json
    │   ├── radio-group-11.json
    │   ├── radio-group-12.json
    │   ├── radio-group-13.json
    │   ├── radio-group-14.json
    │   ├── radio-group-15.json
    │   ├── register-01.json
    │   ├── registry.json
    │   ├── reset-password-01.json
    │   ├── select-01.json
    │   ├── select-02.json
    │   ├── select-03.json
    │   ├── select-04.json
    │   ├── select-05.json
    │   ├── select-06.json
    │   ├── select-07.json
    │   ├── select-08.json
    │   ├── select-09.json
    │   ├── select-10.json
    │   ├── select-11.json
    │   ├── select-12.json
    │   ├── select-13.json
    │   ├── select-14.json
    │   ├── select-15.json
    │   ├── select-16.json
    │   ├── select-17.json
    │   ├── select-18.json
    │   ├── select-19.json
    │   ├── select-20.json
    │   ├── select-21.json
    │   ├── select-22.json
    │   ├── select-23.json
    │   ├── select-24.json
    │   ├── select-25.json
    │   ├── select-26.json
    │   ├── select-27.json
    │   ├── select-28.json
    │   ├── select-29.json
    │   ├── select-30.json
    │   ├── select-31.json
    │   ├── select-32.json
    │   ├── select-33.json
    │   ├── select-34.json
    │   ├── select-35.json
    │   ├── select-36.json
    │   ├── select-37.json
    │   ├── select-38.json
    │   ├── sheet-01.json
    │   ├── sheet-02.json
    │   ├── sheet-03.json
    │   ├── sheet-04.json
    │   ├── sheet-05.json
    │   ├── sheet-06.json
    │   ├── sheet-07.json
    │   ├── slack.json
    │   ├── social-proof-01.json
    │   ├── sonner-01.json
    │   ├── sonner-02.json
    │   ├── sonner-03.json
    │   ├── sonner-04.json
    │   ├── sonner-05.json
    │   ├── sonner-06.json
    │   ├── sonner-07.json
    │   ├── sonner-08.json
    │   ├── sonner-09.json
    │   ├── sonner-10.json
    │   ├── sonner-11.json
    │   ├── sonner-12.json
    │   ├── sonner-13.json
    │   ├── sonner-14.json
    │   ├── sonner-15.json
    │   ├── sonner-16.json
    │   ├── sonner-17.json
    │   ├── sonner-18.json
    │   ├── sonner-19.json
    │   ├── sonner-20.json
    │   ├── spotify.json
    │   ├── statistics-component-01.json
    │   ├── summer.json
    │   ├── sunset-horizon.json
    │   ├── switch-01.json
    │   ├── switch-02.json
    │   ├── switch-03.json
    │   ├── switch-04.json
    │   ├── switch-05.json
    │   ├── switch-06.json
    │   ├── switch-07.json
    │   ├── switch-08.json
    │   ├── switch-09.json
    │   ├── switch-10.json
    │   ├── switch-11.json
    │   ├── switch-12.json
    │   ├── switch-13.json
    │   ├── switch-14.json
    │   ├── switch-15.json
    │   ├── switch-16.json
    │   ├── switch-17.json
    │   ├── switch-18.json
    │   ├── switch-19.json
    │   ├── switch-20.json
    │   ├── table-01.json
    │   ├── table-02.json
    │   ├── table-03.json
    │   ├── table-04.json
    │   ├── table-05.json
    │   ├── table-06.json
    │   ├── table-07.json
    │   ├── table-08.json
    │   ├── table-09.json
    │   ├── table-10.json
    │   ├── table-11.json
    │   ├── table-12.json
    │   ├── table-13.json
    │   ├── table-14.json
    │   ├── table-15.json
    │   ├── table-16.json
    │   ├── tabs-01.json
    │   ├── tabs-02.json
    │   ├── tabs-03.json
    │   ├── tabs-04.json
    │   ├── tabs-05.json
    │   ├── tabs-06.json
    │   ├── tabs-07.json
    │   ├── tabs-08.json
    │   ├── tabs-09.json
    │   ├── tabs-10.json
    │   ├── tabs-11.json
    │   ├── tabs-12.json
    │   ├── tabs-13.json
    │   ├── tabs-14.json
    │   ├── tabs-15.json
    │   ├── tabs-16.json
    │   ├── tabs-17.json
    │   ├── tabs-18.json
    │   ├── tabs-19.json
    │   ├── tabs-20.json
    │   ├── tabs-21.json
    │   ├── tabs-22.json
    │   ├── tabs-23.json
    │   ├── tabs-24.json
    │   ├── tabs-25.json
    │   ├── tabs-26.json
    │   ├── tabs-27.json
    │   ├── tabs-28.json
    │   ├── tabs-29.json
    │   ├── team-section-01.json
    │   ├── testimonials-component-01.json
    │   ├── textarea-01.json
    │   ├── textarea-02.json
    │   ├── textarea-03.json
    │   ├── textarea-04.json
    │   ├── textarea-05.json
    │   ├── textarea-06.json
    │   ├── textarea-07.json
    │   ├── textarea-08.json
    │   ├── textarea-09.json
    │   ├── textarea-10.json
    │   ├── textarea-11.json
    │   ├── textarea-12.json
    │   ├── textarea-13.json
    │   ├── textarea-14.json
    │   ├── textarea-15.json
    │   ├── textarea-16.json
    │   ├── textarea-17.json
    │   ├── textarea-18.json
    │   ├── textarea-19.json
    │   ├── textarea-20.json
    │   ├── textarea-21.json
    │   ├── tooltip-01.json
    │   ├── tooltip-02.json
    │   ├── tooltip-03.json
    │   ├── tooltip-04.json
    │   ├── tooltip-05.json
    │   ├── tooltip-06.json
    │   ├── tooltip-07.json
    │   ├── tooltip-08.json
    │   ├── tooltip-09.json
    │   ├── tooltip-10.json
    │   ├── tooltip-11.json
    │   ├── tooltip-12.json
    │   ├── tooltip-13.json
    │   ├── tooltip-14.json
    │   ├── tooltip-15.json
    │   ├── tooltip-16.json
    │   ├── tooltip-17.json
    │   ├── two-factor-authentication-01.json
    │   ├── valorant.json
    │   ├── verify-email-01.json
    │   ├── vs-code.json
    │   ├── widget-component-01.json
    │   └── widget-component-02.json
├── src/
    ├── app/
    │   ├── (blank)/
    │   │   └── layout.tsx
    │   ├── (front)/
    │   │   └── layout.tsx
    │   ├── (pages)/
    │   │   └── layout.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   ├── robots.txt
    │   └── sitemap.ts
    ├── assets/
    │   ├── data/
    │   │   ├── blocks-index.tsx
    │   │   ├── faqs.ts
    │   │   ├── features.tsx
    │   │   └── search.ts
    │   └── svg/
    │   │   ├── 404.tsx
    │   │   ├── AllShadCN.tsx
    │   │   ├── AllUtilityCSS.tsx
    │   │   ├── Discord.tsx
    │   │   ├── FlyonUI.tsx
    │   │   ├── Google.tsx
    │   │   ├── Jetship.tsx
    │   │   ├── MoreComponents.tsx
    │   │   ├── PixInvent.tsx
    │   │   ├── ThemeSelection.tsx
    │   │   ├── X.tsx
    │   │   ├── accordion.tsx
    │   │   ├── alert.tsx
    │   │   ├── auth-background-shape.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button-group.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── combobox.tsx
    │   │   ├── data-table.tsx
    │   │   ├── datepicker.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown.tsx
    │   │   ├── form.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── logo.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── ratings-card-svg.tsx
    │   │   ├── select.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   └── tooltip.tsx
    ├── components/
    │   ├── customizer/
    │   │   ├── CssImportDialog.tsx
    │   │   ├── HoldToSaveTheme.tsx
    │   │   ├── ShadowControl.tsx
    │   │   ├── SliderWithInput.tsx
    │   │   ├── ThemeColorPanel.tsx
    │   │   ├── ThemeControlPanel.tsx
    │   │   ├── ThemeFontSelect.tsx
    │   │   ├── ThemePresetSelect.tsx
    │   │   ├── ThemeVariablesDialog.tsx
    │   │   ├── index.tsx
    │   │   └── shepherd.css
    │   ├── layout/
    │   │   ├── BlankLayout.tsx
    │   │   ├── CommandMenu.tsx
    │   │   ├── Footer.tsx
    │   │   ├── FrontContent.tsx
    │   │   ├── FrontLayout.tsx
    │   │   ├── FrontMenuToggle.tsx
    │   │   ├── Header.tsx
    │   │   ├── ModeToggle.tsx
    │   │   ├── NavMenu.tsx
    │   │   ├── PagesContent.tsx
    │   │   ├── PagesLayout.tsx
    │   │   ├── ScrollToTop.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── logo.tsx
    │   ├── ui/
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── bounce-button.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button-group.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── empty.tsx
    │   │   ├── field.tsx
    │   │   ├── form.tsx
    │   │   ├── global-tooltip.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-group.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── item.tsx
    │   │   ├── kbd.tsx
    │   │   ├── label.tsx
    │   │   ├── magnetic-button.tsx
    │   │   ├── menubar.tsx
    │   │   ├── motion-checkbox.tsx
    │   │   ├── motion-highlight.tsx
    │   │   ├── motion-radio-group.tsx
    │   │   ├── motion-switch.tsx
    │   │   ├── motion-tabs.tsx
    │   │   ├── motion-tooltip.tsx
    │   │   ├── multi-select.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── rainbow-button.tsx
    │   │   ├── rating.tsx
    │   │   ├── resizable.tsx
    │   │   ├── ripple-button.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select-native.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── shimmer-button.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── spinner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   └── tooltip.tsx
    │   ├── CodeBlock.tsx
    │   ├── CodeBlockMultipleView.tsx
    │   ├── ComponentCard.tsx
    │   ├── ComponentCli.tsx
    │   ├── ComponentDetails.tsx
    │   ├── ComponentLoader.tsx
    │   ├── ComponentsGrid.tsx
    │   ├── CopyButton.tsx
    │   └── DocsNavigation.tsx
    ├── config/
    │   ├── components.tsx
    │   └── theme.ts
    ├── contexts/
    │   └── settingsContext.tsx
    ├── hooks/
    │   ├── use-mobile.ts
    │   ├── use-pagination.ts
    │   ├── useCopy.ts
    │   ├── useLocalStorage.ts
    │   ├── useObjectCookie.ts
    │   ├── useSettings.tsx
    │   └── useShiki.ts
    ├── lib/
    │   └── utils.ts
    ├── providers/
    │   ├── NextProvider.tsx
    │   └── ThemesProvider.tsx
    ├── types/
    │   ├── blocks.ts
    │   ├── components.ts
    │   └── theme.ts
    └── utils/
    │   ├── blocks.ts
    │   ├── color-converter.ts
    │   ├── components.ts
    │   ├── parse-css-input.ts
    │   ├── serverHelpers.ts
    │   ├── shadows.ts
    │   ├── theme-fonts.ts
    │   ├── theme-presets.ts
    │   ├── theme-style-generator.ts
    │   └── toast.tsx
├── .editorconfig
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .prettierrc.json
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE.md
├── README.md
├── components.json
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── registry.json
├── tsconfig.json
└── vercel.json
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `sketch-plugin-master/`

- **Files:** 275 · **Directories:** 44
- **Entry:** `README.md`

```
sketch-plugin-master/
├── .github/
    └── workflows/
    │   ├── build.yml
    │   └── release.yml
├── .vscode/
    ├── extensions.json
    ├── settings.json
    ├── snippets.code-snippets
    └── tasks.json
├── assets/
    ├── data/
    │   ├── bitbucket/
    │   │   ├── branches.json
    │   │   ├── commits.json
    │   │   ├── pullRequests.json
    │   │   └── repositories.json
    │   ├── confluence/
    │   │   ├── globalSpaces.json
    │   │   └── pages.json
    │   ├── jira/
    │   │   ├── components.json
    │   │   ├── issues.json
    │   │   └── projects.json
    │   ├── project-avatar/
    │   │   ├── project-avatar-0.png
    │   │   ├── project-avatar-1.png
    │   │   ├── project-avatar-10.png
    │   │   ├── project-avatar-11.png
    │   │   ├── project-avatar-12.png
    │   │   ├── project-avatar-13.png
    │   │   ├── project-avatar-14.png
    │   │   ├── project-avatar-15.png
    │   │   ├── project-avatar-16.png
    │   │   ├── project-avatar-17.png
    │   │   ├── project-avatar-18.png
    │   │   ├── project-avatar-19.png
    │   │   ├── project-avatar-2.png
    │   │   ├── project-avatar-20.png
    │   │   ├── project-avatar-21.png
    │   │   ├── project-avatar-22.png
    │   │   ├── project-avatar-23.png
    │   │   ├── project-avatar-24.png
    │   │   ├── project-avatar-25.png
    │   │   ├── project-avatar-3.png
    │   │   ├── project-avatar-4.png
    │   │   ├── project-avatar-5.png
    │   │   ├── project-avatar-6.png
    │   │   ├── project-avatar-7.png
    │   │   ├── project-avatar-8.png
    │   │   └── project-avatar-9.png
    │   └── user/
    │   │   ├── heroes.json
    │   │   ├── humans.json
    │   │   └── meeple.json
    ├── font/
    │   └── roboto/
    │   │   ├── LICENSE
    │   │   ├── Roboto-Black.ttf
    │   │   ├── Roboto-BlackItalic.ttf
    │   │   ├── Roboto-Bold.ttf
    │   │   ├── Roboto-BoldItalic.ttf
    │   │   ├── Roboto-Italic.ttf
    │   │   ├── Roboto-Light.ttf
    │   │   ├── Roboto-LightItalic.ttf
    │   │   ├── Roboto-Medium.ttf
    │   │   ├── Roboto-MediumItalic.ttf
    │   │   ├── Roboto-Regular.ttf
    │   │   ├── Roboto-Thin.ttf
    │   │   └── Roboto-ThinItalic.ttf
    ├── symbol-palette/
    │   ├── preview/
    │   │   ├── Avatar (Container).png
    │   │   ├── Avatar (Person).png
    │   │   ├── Avatar grid.png
    │   │   ├── Avatar stack.png
    │   │   ├── Badge (Double digits).png
    │   │   ├── Badge (Max digits).png
    │   │   ├── Badge (Single digit).png
    │   │   ├── Banner.png
    │   │   ├── Breadcrumbs (With icons).png
    │   │   ├── Breadcrumbs.png
    │   │   ├── Button (Compact).png
    │   │   ├── Button (Full width).png
    │   │   ├── Button (Icon).png
    │   │   ├── Button (Primary).png
    │   │   ├── Button (Split).png
    │   │   ├── Button (Standard).png
    │   │   ├── Button (With icon).png
    │   │   ├── Button group.png
    │   │   ├── Checkbox group.png
    │   │   ├── Checkbox.png
    │   │   ├── Cursor (Hand).png
    │   │   ├── Cursor (Pointer).png
    │   │   ├── Date picker.png
    │   │   ├── Datetime picker (Calendar).png
    │   │   ├── Datetime picker (Time).png
    │   │   ├── Datetime picker.png
    │   │   ├── Dropdown menu (Compact).png
    │   │   ├── Dropdown menu.png
    │   │   ├── Flag (With actions).png
    │   │   ├── Flag.png
    │   │   ├── Global navigation.png
    │   │   ├── Inline edit (With icon).png
    │   │   ├── Inline edit.png
    │   │   ├── Lozenge.png
    │   │   ├── Mention.png
    │   │   ├── Modal dialog.png
    │   │   ├── Navigation next.png
    │   │   ├── Page header (Bottom bar).png
    │   │   ├── Page header (Full).png
    │   │   ├── Page header (Title with actions).png
    │   │   ├── Page header (Title).png
    │   │   ├── Pagination (10 pages).png
    │   │   ├── Pagination (100 pages).png
    │   │   ├── Pagination (3 pages).png
    │   │   ├── Progress tracker.png
    │   │   ├── Quick search item.png
    │   │   ├── Quick search.png
    │   │   ├── Radio group.png
    │   │   ├── Range.png
    │   │   ├── Section message (No title).png
    │   │   ├── Section message (With title).png
    │   │   ├── Select (32px).png
    │   │   ├── Select (40px).png
    │   │   ├── Select menu.png
    │   │   ├── Spinner.png
    │   │   ├── Spotlight (With cover).png
    │   │   ├── Spotlight.png
    │   │   ├── Table (40px rows).png
    │   │   ├── Table (48px rows).png
    │   │   ├── Tabs.png
    │   │   ├── Tag (Avatar).png
    │   │   ├── Tag (Avatar, removable).png
    │   │   ├── Tag (Removable).png
    │   │   ├── Tag.png
    │   │   ├── Text area.png
    │   │   ├── Text field (32px with helper).png
    │   │   ├── Text field (32px).png
    │   │   ├── Text field (40px with helper).png
    │   │   ├── Text field (40px).png
    │   │   ├── Text field (Search).png
    │   │   ├── Time picker.png
    │   │   ├── Toggle (16px, checked).png
    │   │   ├── Toggle (16px, unchecked).png
    │   │   ├── Toggle (20px, checked).png
    │   │   ├── Toggle (20px, unchecked).png
    │   │   ├── Tooltip.png
    │   │   └── User benefit modal.png
    │   └── symbols.json
    └── logo.png
├── scripts/
    ├── gui-pack/
    │   ├── icon.png
    │   └── publish.js
    ├── plugin/
    │   ├── generateRss.js
    │   └── version.js
    └── .eslintrc
├── src/
    ├── sketch/
    │   ├── util/
    │   │   ├── downloadFile.js
    │   │   ├── manifest.js
    │   │   ├── random.js
    │   │   └── settings.js
    │   ├── .eslintrc
    │   └── manifest.json
    └── webview/
    │   ├── symbol-palette/
    │       ├── SymbolPalette.js
    │       ├── index-devtools.html
    │       ├── index.html
    │       └── index.js
    │   └── .eslintrc.json
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
├── package.json
├── webpack.skpm.config.js
└── yarn.lock
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `skills-main/`

- **Files:** 394 · **Directories:** 85
- **Entry:** `README.md`

```
skills-main/
├── .claude-plugin/
    └── marketplace.json
├── skills/
    ├── algorithmic-art/
    │   ├── templates/
    │   │   ├── generator_template.js
    │   │   └── viewer.html
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── brand-guidelines/
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── canvas-design/
    │   ├── canvas-fonts/
    │   │   ├── ArsenalSC-OFL.txt
    │   │   ├── ArsenalSC-Regular.ttf
    │   │   ├── BigShoulders-Bold.ttf
    │   │   ├── BigShoulders-OFL.txt
    │   │   ├── BigShoulders-Regular.ttf
    │   │   ├── Boldonse-OFL.txt
    │   │   ├── Boldonse-Regular.ttf
    │   │   ├── BricolageGrotesque-Bold.ttf
    │   │   ├── BricolageGrotesque-OFL.txt
    │   │   ├── BricolageGrotesque-Regular.ttf
    │   │   ├── CrimsonPro-Bold.ttf
    │   │   ├── CrimsonPro-Italic.ttf
    │   │   ├── CrimsonPro-OFL.txt
    │   │   ├── CrimsonPro-Regular.ttf
    │   │   ├── DMMono-OFL.txt
    │   │   ├── DMMono-Regular.ttf
    │   │   ├── EricaOne-OFL.txt
    │   │   ├── EricaOne-Regular.ttf
    │   │   ├── GeistMono-Bold.ttf
    │   │   ├── GeistMono-OFL.txt
    │   │   ├── GeistMono-Regular.ttf
    │   │   ├── Gloock-OFL.txt
    │   │   ├── Gloock-Regular.ttf
    │   │   ├── IBMPlexMono-Bold.ttf
    │   │   ├── IBMPlexMono-OFL.txt
    │   │   ├── IBMPlexMono-Regular.ttf
    │   │   ├── IBMPlexSerif-Bold.ttf
    │   │   ├── IBMPlexSerif-BoldItalic.ttf
    │   │   ├── IBMPlexSerif-Italic.ttf
    │   │   ├── IBMPlexSerif-Regular.ttf
    │   │   ├── InstrumentSans-Bold.ttf
    │   │   ├── InstrumentSans-BoldItalic.ttf
    │   │   ├── InstrumentSans-Italic.ttf
    │   │   ├── InstrumentSans-OFL.txt
    │   │   ├── InstrumentSans-Regular.ttf
    │   │   ├── InstrumentSerif-Italic.ttf
    │   │   ├── InstrumentSerif-Regular.ttf
    │   │   ├── Italiana-OFL.txt
    │   │   ├── Italiana-Regular.ttf
    │   │   ├── JetBrainsMono-Bold.ttf
    │   │   ├── JetBrainsMono-OFL.txt
    │   │   ├── JetBrainsMono-Regular.ttf
    │   │   ├── Jura-Light.ttf
    │   │   ├── Jura-Medium.ttf
    │   │   ├── Jura-OFL.txt
    │   │   ├── LibreBaskerville-OFL.txt
    │   │   ├── LibreBaskerville-Regular.ttf
    │   │   ├── Lora-Bold.ttf
    │   │   ├── Lora-BoldItalic.ttf
    │   │   ├── Lora-Italic.ttf
    │   │   ├── Lora-OFL.txt
    │   │   ├── Lora-Regular.ttf
    │   │   ├── NationalPark-Bold.ttf
    │   │   ├── NationalPark-OFL.txt
    │   │   ├── NationalPark-Regular.ttf
    │   │   ├── NothingYouCouldDo-OFL.txt
    │   │   ├── NothingYouCouldDo-Regular.ttf
    │   │   ├── Outfit-Bold.ttf
    │   │   ├── Outfit-OFL.txt
    │   │   ├── Outfit-Regular.ttf
    │   │   ├── PixelifySans-Medium.ttf
    │   │   ├── PixelifySans-OFL.txt
    │   │   ├── PoiretOne-OFL.txt
    │   │   ├── PoiretOne-Regular.ttf
    │   │   ├── RedHatMono-Bold.ttf
    │   │   ├── RedHatMono-OFL.txt
    │   │   ├── RedHatMono-Regular.ttf
    │   │   ├── Silkscreen-OFL.txt
    │   │   ├── Silkscreen-Regular.ttf
    │   │   ├── SmoochSans-Medium.ttf
    │   │   ├── SmoochSans-OFL.txt
    │   │   ├── Tektur-Medium.ttf
    │   │   ├── Tektur-OFL.txt
    │   │   ├── Tektur-Regular.ttf
    │   │   ├── WorkSans-Bold.ttf
    │   │   ├── WorkSans-BoldItalic.ttf
    │   │   ├── WorkSans-Italic.ttf
    │   │   ├── WorkSans-OFL.txt
    │   │   ├── WorkSans-Regular.ttf
    │   │   ├── YoungSerif-OFL.txt
    │   │   └── YoungSerif-Regular.ttf
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── claude-api/
    │   ├── csharp/
    │   │   └── claude-api.md
    │   ├── curl/
    │   │   ├── examples.md
    │   │   └── managed-agents.md
    │   ├── go/
    │   │   └── claude-api.md
    │   ├── java/
    │   │   └── claude-api.md
    │   ├── php/
    │   │   └── claude-api.md
    │   ├── ruby/
    │   │   └── claude-api.md
    │   ├── shared/
    │   │   ├── agent-design.md
    │   │   ├── error-codes.md
    │   │   ├── live-sources.md
    │   │   ├── managed-agents-api-reference.md
    │   │   ├── managed-agents-client-patterns.md
    │   │   ├── managed-agents-core.md
    │   │   ├── managed-agents-environments.md
    │   │   ├── managed-agents-events.md
    │   │   ├── managed-agents-memory.md
    │   │   ├── managed-agents-multiagent.md
    │   │   ├── managed-agents-onboarding.md
    │   │   ├── managed-agents-outcomes.md
    │   │   ├── managed-agents-overview.md
    │   │   ├── managed-agents-self-hosted-sandboxes.md
    │   │   ├── managed-agents-tools.md
    │   │   ├── managed-agents-webhooks.md
    │   │   ├── model-migration.md
    │   │   ├── models.md
    │   │   ├── prompt-caching.md
    │   │   └── tool-use-concepts.md
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── doc-coauthoring/
    │   └── SKILL.md
    ├── docx/
    │   ├── scripts/
    │   │   ├── __init__.py
    │   │   ├── accept_changes.py
    │   │   └── comment.py
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── frontend-design/
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── internal-comms/
    │   ├── examples/
    │   │   ├── 3p-updates.md
    │   │   ├── company-newsletter.md
    │   │   ├── faq-answers.md
    │   │   └── general-comms.md
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── mcp-builder/
    │   ├── reference/
    │   │   ├── evaluation.md
    │   │   ├── mcp_best_practices.md
    │   │   ├── node_mcp_server.md
    │   │   └── python_mcp_server.md
    │   ├── scripts/
    │   │   ├── connections.py
    │   │   ├── evaluation.py
    │   │   ├── example_evaluation.xml
    │   │   └── requirements.txt
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── pdf/
    │   ├── scripts/
    │   │   ├── check_bounding_boxes.py
    │   │   ├── check_fillable_fields.py
    │   │   ├── convert_pdf_to_images.py
    │   │   ├── create_validation_image.py
    │   │   ├── extract_form_field_info.py
    │   │   ├── extract_form_structure.py
    │   │   ├── fill_fillable_fields.py
    │   │   └── fill_pdf_form_with_annotations.py
    │   ├── LICENSE.txt
    │   ├── SKILL.md
    │   ├── forms.md
    │   └── reference.md
    ├── pptx/
    │   ├── scripts/
    │   │   ├── __init__.py
    │   │   ├── add_slide.py
    │   │   ├── clean.py
    │   │   └── thumbnail.py
    │   ├── LICENSE.txt
    │   ├── SKILL.md
    │   ├── editing.md
    │   └── pptxgenjs.md
    ├── skill-creator/
    │   ├── agents/
    │   │   ├── analyzer.md
    │   │   ├── comparator.md
    │   │   └── grader.md
    │   ├── assets/
    │   │   └── eval_review.html
    │   ├── eval-viewer/
    │   │   ├── generate_review.py
    │   │   └── viewer.html
    │   ├── references/
    │   │   └── schemas.md
    │   ├── scripts/
    │   │   ├── __init__.py
    │   │   ├── aggregate_benchmark.py
    │   │   ├── generate_report.py
    │   │   ├── improve_description.py
    │   │   ├── package_skill.py
    │   │   ├── quick_validate.py
    │   │   ├── run_eval.py
    │   │   ├── run_loop.py
    │   │   └── utils.py
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── slack-gif-creator/
    │   ├── core/
    │   │   ├── easing.py
    │   │   ├── frame_composer.py
    │   │   ├── gif_builder.py
    │   │   └── validators.py
    │   ├── LICENSE.txt
    │   ├── SKILL.md
    │   └── requirements.txt
    ├── theme-factory/
    │   ├── themes/
    │   │   ├── arctic-frost.md
    │   │   ├── botanical-garden.md
    │   │   ├── desert-rose.md
    │   │   ├── forest-canopy.md
    │   │   ├── golden-hour.md
    │   │   ├── midnight-galaxy.md
    │   │   ├── modern-minimalist.md
    │   │   ├── ocean-depths.md
    │   │   ├── sunset-boulevard.md
    │   │   └── tech-innovation.md
    │   ├── LICENSE.txt
    │   ├── SKILL.md
    │   └── theme-showcase.pdf
    ├── web-artifacts-builder/
    │   ├── scripts/
    │   │   ├── bundle-artifact.sh
    │   │   ├── init-artifact.sh
    │   │   └── shadcn-components.tar.gz
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── webapp-testing/
    │   ├── examples/
    │   │   ├── console_logging.py
    │   │   ├── element_discovery.py
    │   │   └── static_html_automation.py
    │   ├── scripts/
    │   │   └── with_server.py
    │   ├── LICENSE.txt
    │   └── SKILL.md
    └── xlsx/
    │   ├── scripts/
    │       └── recalc.py
    │   ├── LICENSE.txt
    │   └── SKILL.md
├── spec/
    └── agent-skills-spec.md
├── template/
    └── SKILL.md
├── .gitignore
├── README.md
└── THIRD_PARTY_NOTICES.md
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `tail-kit-main/`

- **Files:** 361 · **Directories:** 106
- **Entry:** `README.md`

```
tail-kit-main/
├── .github/
    └── FUNDING.yml
├── .vscode/
    └── settings.json
├── components/
    ├── kit/
    │   ├── components/
    │   │   └── .DS_Store
    │   └── .DS_Store
    ├── layout/
    │   ├── AppLayout.tsx
    │   ├── ComponentLayout.tsx
    │   └── HomeLayout.tsx
    ├── site/
    │   ├── DropDown/
    │   │   └── DropD.tsx
    │   ├── header/
    │   │   ├── AppHeader.tsx
    │   │   ├── SectionHeader.tsx
    │   │   └── header.tsx
    │   ├── home/
    │   │   └── HomeComps.tsx
    │   ├── section/
    │   │   └── SectionDesc.tsx
    │   └── Meta.tsx
    └── .DS_Store
├── lib/
    └── gtag.js
├── pages/
    ├── components/
    │   ├── alert/
    │   │   └── index.tsx
    │   ├── avatar/
    │   │   └── index.tsx
    │   ├── badges/
    │   │   └── index.tsx
    │   ├── blog/
    │   │   └── index.tsx
    │   ├── buttons/
    │   │   └── index.tsx
    │   ├── cta/
    │   │   └── index.tsx
    │   ├── data/
    │   │   └── index.tsx
    │   ├── ddm/
    │   │   └── index.tsx
    │   ├── faq/
    │   │   └── index.tsx
    │   ├── feature/
    │   │   └── index.tsx
    │   ├── footer/
    │   │   └── index.tsx
    │   ├── form/
    │   │   └── index.tsx
    │   ├── header/
    │   │   └── index.tsx
    │   ├── inputselect/
    │   │   └── index.tsx
    │   ├── inputtext/
    │   │   └── index.tsx
    │   ├── list/
    │   │   └── index.tsx
    │   ├── pricing/
    │   │   └── index.tsx
    │   ├── profile/
    │   │   └── index.tsx
    │   ├── progress/
    │   │   └── index.tsx
    │   ├── shopping/
    │   │   └── index.tsx
    │   ├── sidebar/
    │   │   └── index.tsx
    │   ├── skeleton/
    │   │   └── index.tsx
    │   ├── table/
    │   │   └── index.tsx
    │   ├── tabs/
    │   │   └── index.tsx
    │   ├── team/
    │   │   └── index.tsx
    │   ├── testimonial/
    │   │   └── index.tsx
    │   ├── toggle/
    │   │   └── index.tsx
    │   └── index.tsx
    ├── request/
    │   └── index.tsx
    ├── started/
    │   └── index.tsx
    ├── templates/
    │   ├── dashboard/
    │   │   └── index.tsx
    │   ├── datadashboard/
    │   │   └── index.tsx
    │   ├── errors404/
    │   │   └── index.tsx
    │   ├── folio/
    │   │   └── index.tsx
    │   ├── getStarted/
    │   │   └── index.tsx
    │   ├── simpleHome/
    │   │   └── index.tsx
    │   └── index.tsx
    ├── _app.tsx
    ├── _document.tsx
    └── index.tsx
├── public/
    ├── icons/
    │   ├── .DS_Store
    │   ├── check-circle.svg
    │   ├── check.svg
    │   ├── cookie.svg
    │   ├── rocket.png
    │   └── rocket.svg
    ├── images/
    │   ├── blog/
    │   │   ├── .DS_Store
    │   │   ├── 1.jpg
    │   │   ├── 2.jpg
    │   │   ├── 3.jpg
    │   │   ├── 4.jpg
    │   │   ├── 5.jpg
    │   │   └── 6.jpg
    │   ├── car/
    │   │   ├── .DS_Store
    │   │   ├── 1.jpg
    │   │   └── 2.jpg
    │   ├── food/
    │   │   ├── .DS_Store
    │   │   ├── 1.jpg
    │   │   ├── 2.jpg
    │   │   └── 3.jpg
    │   ├── illustrations/
    │   │   └── 1.svg
    │   ├── landscape/
    │   │   ├── .DS_Store
    │   │   ├── 1.jpg
    │   │   ├── 2.jpg
    │   │   ├── 3.jpg
    │   │   ├── 4.jpg
    │   │   ├── 5.svg
    │   │   ├── 6.svg
    │   │   ├── 7.svg
    │   │   └── 8.svg
    │   ├── object/
    │   │   ├── .DS_Store
    │   │   ├── 1.png
    │   │   ├── 10.png
    │   │   ├── 11.svg
    │   │   ├── 12.svg
    │   │   ├── 2.png
    │   │   ├── 3.png
    │   │   ├── 4.jpg
    │   │   ├── 5.png
    │   │   ├── 5.webp
    │   │   ├── 6.png
    │   │   ├── 7.png
    │   │   ├── 8.jpg
    │   │   └── 9.jpg
    │   ├── person/
    │   │   ├── .DS_Store
    │   │   ├── 1.jpg
    │   │   ├── 10.jpg
    │   │   ├── 11.webp
    │   │   ├── 2.jpeg
    │   │   ├── 3.jpg
    │   │   ├── 4.jpg
    │   │   ├── 5.jpg
    │   │   ├── 6.jpg
    │   │   ├── 7.jpg
    │   │   ├── 8.jpg
    │   │   └── 9.jpg
    │   ├── sections/
    │   │   ├── .DS_Store
    │   │   ├── 404.png
    │   │   ├── alerte.png
    │   │   ├── avatar.png
    │   │   ├── badges.png
    │   │   ├── blog.png
    │   │   ├── button.png
    │   │   ├── coming.gif
    │   │   ├── cta.png
    │   │   ├── dashboard.png
    │   │   ├── data.png
    │   │   ├── datadashboard.png
    │   │   ├── ddm.png
    │   │   ├── faq.png
    │   │   ├── feature.png
    │   │   ├── folio.png
    │   │   ├── folio.webp
    │   │   ├── footer.png
    │   │   ├── header.png
    │   │   ├── homePage.png
    │   │   ├── homePage.webp
    │   │   ├── homePage2.png
    │   │   ├── homePage2.webp
    │   │   ├── homePage3.png
    │   │   ├── homePage3.webp
    │   │   ├── homePage4.png
    │   │   ├── homePage4.webp
    │   │   ├── homePage5.png
    │   │   ├── homePage5.webp
    │   │   ├── input.png
    │   │   ├── list.png
    │   │   ├── login.png
    │   │   ├── pricing.png
    │   │   ├── profile.png
    │   │   ├── progress.png
    │   │   ├── select.png
    │   │   ├── shopping.png
    │   │   ├── sidebar.png
    │   │   ├── skeleton.png
    │   │   ├── table.png
    │   │   ├── tabs.png
    │   │   ├── team.png
    │   │   ├── testimonial.png
    │   │   └── toggle.png
    │   └── .DS_Store
    ├── .DS_Store
    ├── ads.txt
    ├── banner.jpg
    ├── dashboard.png
    ├── demo.gif
    ├── home.png
    ├── pub.mp4
    ├── request.png
    ├── robots.txt
    ├── sitemap.htm
    ├── sitemap.xml
    ├── template.png
    └── template2.png
├── utils/
    └── Utils.ts
├── .DS_Store
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .prettierrc.js
├── CONTRIBUTING.md
├── LICENCE.md
├── README.md
├── editorTheme.tsx
├── global.css
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── pull_request_template.md
├── tailwind.config.js
├── tsconfig.json
└── yarn.lock
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `tailwindcss-main/`

- **Files:** 540 · **Directories:** 111
- **Entry:** `README.md`

```
tailwindcss-main/
├── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug-report.md
    │   └── config.yml
    ├── workflows/
    │   ├── ci.yml
    │   ├── integration-tests.yml
    │   ├── prepare-release.yml
    │   └── release.yml
    ├── CODEOWNERS
    ├── CONTRIBUTING.md
    ├── FUNDING.yml
    ├── PULL_REQUEST_TEMPLATE.md
    ├── logo-dark.svg
    └── logo-light.svg
├── crates/
    ├── classification-macros/
    │   ├── src/
    │   │   └── lib.rs
    │   └── Cargo.toml
    ├── ignore/
    │   ├── examples/
    │   │   └── walk.rs
    │   ├── src/
    │   │   ├── default_types.rs
    │   │   ├── dir.rs
    │   │   ├── gitignore.rs
    │   │   ├── lib.rs
    │   │   ├── overrides.rs
    │   │   ├── pathutil.rs
    │   │   ├── types.rs
    │   │   └── walk.rs
    │   ├── tests/
    │   │   ├── gitignore_matched_path_or_any_parents_tests.gitignore
    │   │   ├── gitignore_matched_path_or_any_parents_tests.rs
    │   │   ├── gitignore_skip_bom.gitignore
    │   │   └── gitignore_skip_bom.rs
    │   ├── COPYING
    │   ├── Cargo.toml
    │   ├── LICENSE-MIT
    │   ├── README.md
    │   └── UNLICENSE
    ├── node/
    │   ├── .cargo/
    │   │   └── config.toml
    │   ├── scripts/
    │   │   └── move-artifacts.mjs
    │   ├── src/
    │   │   ├── lib.rs
    │   │   └── utf16.rs
    │   ├── .gitignore
    │   ├── .npmignore
    │   ├── Cargo.toml
    │   ├── build.rs
    │   ├── package.json
    │   └── rustfmt.toml
    └── oxide/
    │   ├── fuzz/
    │       ├── .gitignore
    │       ├── Cargo.lock
    │       └── Cargo.toml
    │   ├── src/
    │       ├── cursor.rs
    │       ├── fast_skip.rs
    │       ├── glob.rs
    │       ├── lib.rs
    │       ├── main.rs
    │       ├── paths.rs
    │       └── throughput.rs
    │   ├── tests/
    │       └── scanner.rs
    │   └── Cargo.toml
├── integrations/
    ├── cli/
    │   ├── config.test.ts
    │   ├── index.test.ts
    │   ├── plugins.test.ts
    │   └── standalone.test.ts
    ├── oxide/
    │   ├── wasm.test.ts
    │   └── workers.test.ts
    ├── postcss/
    │   ├── config.test.ts
    │   ├── core-as-postcss-plugin.test.ts
    │   ├── index.test.ts
    │   ├── multi-root.test.ts
    │   ├── next.test.ts
    │   ├── plugins.test.ts
    │   ├── source.test.ts
    │   └── url-rewriting.test.ts
    ├── upgrade/
    │   ├── index.test.ts
    │   ├── js-config.test.ts
    │   └── upgrade-errors.test.ts
    ├── vite/
    │   ├── astro.test.ts
    │   ├── config.test.ts
    │   ├── css-modules.test.ts
    │   ├── html-style-blocks.test.ts
    │   ├── ignored-packages.test.ts
    │   ├── index.test.ts
    │   ├── multi-root.test.ts
    │   ├── nuxt.test.ts
    │   ├── other-transforms.test.ts
    │   ├── qwik.test.ts
    │   ├── react-router.test.ts
    │   ├── resolvers.test.ts
    │   ├── solidstart.test.ts
    │   ├── source-maps.test.ts
    │   ├── ssr.test.ts
    │   ├── svelte.test.ts
    │   ├── sveltekit.test.ts
    │   ├── url-rewriting.test.ts
    │   ├── virtual-modules.test.ts
    │   └── vue.test.ts
    ├── webpack/
    │   ├── index.test.ts
    │   └── loader.test.ts
    ├── package.json
    ├── utils.ts
    └── vitest.config.ts
├── packages/
    ├── @tailwindcss-browser/
    │   ├── src/
    │   │   ├── assets.ts
    │   │   ├── index.ts
    │   │   ├── instrumentation.ts
    │   │   └── types.d.ts
    │   ├── tests/
    │   │   └── ui.spec.ts
    │   ├── README.md
    │   ├── package.json
    │   ├── playwright.config.ts
    │   ├── tsconfig.json
    │   ├── tsup.config.ts
    │   └── vitest.config.ts
    ├── @tailwindcss-cli/
    │   ├── src/
    │   │   └── index.ts
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsup.config.ts
    ├── @tailwindcss-node/
    │   ├── src/
    │   │   ├── compile.ts
    │   │   ├── env.ts
    │   │   ├── esm-cache.loader.mts
    │   │   ├── get-module-dependencies.ts
    │   │   ├── index.cts
    │   │   ├── index.ts
    │   │   ├── instrumentation.test.ts
    │   │   ├── instrumentation.ts
    │   │   ├── normalize-path.ts
    │   │   ├── optimize.ts
    │   │   ├── require-cache.cts
    │   │   ├── require-cache.ts
    │   │   ├── source-maps.test.ts
    │   │   ├── source-maps.ts
    │   │   ├── urls.test.ts
    │   │   └── urls.ts
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsup.config.ts
    ├── @tailwindcss-postcss/
    │   ├── src/
    │   │   ├── ast.test.ts
    │   │   ├── ast.ts
    │   │   ├── index.cts
    │   │   ├── index.test.ts
    │   │   └── index.ts
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsup.config.ts
    ├── @tailwindcss-standalone/
    │   ├── scripts/
    │   │   └── build.ts
    │   ├── src/
    │   │   ├── index.ts
    │   │   └── types.d.ts
    │   ├── package.json
    │   └── tsconfig.json
    ├── @tailwindcss-upgrade/
    │   ├── src/
    │   │   ├── index.test.ts
    │   │   ├── index.ts
    │   │   └── stylesheet.ts
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsup.config.ts
    ├── @tailwindcss-vite/
    │   ├── src/
    │   │   └── index.ts
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsup.config.ts
    ├── @tailwindcss-webpack/
    │   ├── src/
    │   │   ├── index.cts
    │   │   └── index.ts
    │   ├── README.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── tsup.config.ts
    ├── internal-example-plugin/
    │   ├── index.js
    │   └── package.json
    ├── tailwindcss/
    │   ├── src/
    │   │   ├── apply.ts
    │   │   ├── ast.bench.ts
    │   │   ├── ast.test.ts
    │   │   ├── ast.ts
    │   │   ├── at-import.test.ts
    │   │   ├── at-import.ts
    │   │   ├── attribute-selector-parser.bench.ts
    │   │   ├── attribute-selector-parser.test.ts
    │   │   ├── attribute-selector-parser.ts
    │   │   ├── candidate.bench.ts
    │   │   ├── candidate.test.ts
    │   │   ├── candidate.ts
    │   │   ├── canonicalize-calc-expressions.test.ts
    │   │   ├── canonicalize-calc-expressions.ts
    │   │   ├── canonicalize-candidates.test.ts
    │   │   ├── canonicalize-candidates.ts
    │   │   ├── cartesian.ts
    │   │   ├── compile.ts
    │   │   ├── constant-fold-declaration.test.ts
    │   │   ├── constant-fold-declaration.ts
    │   │   ├── css-functions.test.ts
    │   │   ├── css-functions.ts
    │   │   ├── css-parser.bench.ts
    │   │   ├── css-parser.test.ts
    │   │   ├── css-parser.ts
    │   │   ├── design-system.ts
    │   │   ├── expand-declaration.test.ts
    │   │   ├── expand-declaration.ts
    │   │   ├── feature-flags.ts
    │   │   ├── important.test.ts
    │   │   ├── index.bench.ts
    │   │   ├── index.cts
    │   │   ├── index.test.ts
    │   │   ├── index.ts
    │   │   ├── intellisense.bench.ts
    │   │   ├── intellisense.test.ts
    │   │   ├── intellisense.ts
    │   │   ├── node.d.ts
    │   │   ├── plugin.cts
    │   │   ├── plugin.test.ts
    │   │   ├── plugin.ts
    │   │   ├── prefix.test.ts
    │   │   ├── property-order.ts
    │   │   ├── selector-parser.test.ts
    │   │   ├── selector-parser.ts
    │   │   ├── sort.bench.ts
    │   │   ├── sort.test.ts
    │   │   ├── sort.ts
    │   │   ├── theme.ts
    │   │   ├── types.ts
    │   │   ├── utilities.test.ts
    │   │   ├── utilities.ts
    │   │   ├── value-parser.test.ts
    │   │   ├── value-parser.ts
    │   │   ├── variants.test.ts
    │   │   ├── variants.ts
    │   │   ├── walk.test.ts
    │   │   └── walk.ts
    │   ├── tests/
    │   │   └── ui.spec.ts
    │   ├── README.md
    │   ├── index.css
    │   ├── package.json
    │   ├── playwright.config.ts
    │   ├── preflight.css
    │   ├── theme.css
    │   ├── tsconfig.json
    │   ├── tsup.config.ts
    │   ├── utilities.css
    │   └── vitest.config.ts
    └── tsconfig.base.json
├── patches/
    ├── @parcel__watcher@2.5.1.patch
    └── lightningcss@1.32.0.patch
├── playgrounds/
    ├── nextjs/
    │   ├── app/
    │   │   ├── favicon.ico
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   ├── page.module.css
    │   │   └── page.tsx
    │   ├── public/
    │   │   ├── next.svg
    │   │   └── vercel.svg
    │   ├── .eslintrc.json
    │   ├── .gitignore
    │   ├── README.md
    │   ├── next.config.mjs
    │   ├── package.json
    │   ├── postcss.config.js
    │   └── tsconfig.json
    ├── v3/
    │   ├── app/
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── scripts/
    │   │   └── upgrade.mjs
    │   ├── .eslintrc.json
    │   ├── .gitignore
    │   ├── next.config.mjs
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── tailwind.config.js
    │   └── tsconfig.json
    └── vite/
    │   ├── src/
    │       ├── app.tsx
    │       ├── index.css
    │       ├── index.html
    │       └── main.tsx
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── vite.config.ts
├── scripts/
    ├── lock-pre-release-versions.mjs
    ├── pack-packages.mjs
    ├── pre-publish-optimizations.mjs
    ├── release-channel.js
    ├── release-notes.mjs
    └── version-packages.mjs
├── .gitignore
├── .prettierignore
├── CHANGELOG.md
├── Cargo.lock
├── Cargo.toml
├── LICENSE
├── README.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── rust-toolchain.toml
├── turbo.json
└── vitest.config.ts
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `taste-skill-main/`

- **Files:** 39 · **Directories:** 22
- **Entry:** `README.md`

```
taste-skill-main/
├── .github/
    ├── FUNDING.yml
    └── copilot-instructions.md
├── assets/
    ├── .gitkeep
    ├── readme-banner.png
    └── taste-skill-logo.webp
├── examples/
    ├── floria-bottom.webp
    ├── floria-full.webp
    └── floria-top.webp
├── research/
    ├── laziness/
    │   ├── findings/
    │   │   ├── empirical-results.md
    │   │   └── references.md
    │   ├── remediation/
    │   │   ├── architectural-patterns.md
    │   │   ├── parameter-tuning.md
    │   │   ├── prompt-engineering.md
    │   │   └── reference-prompts.md
    │   ├── root-causes/
    │   │   ├── cognitive-shortcuts.md
    │   │   ├── output-limits.md
    │   │   ├── rlhf-and-compute.md
    │   │   └── training-data-bias.md
    │   └── README.md
    └── README.md
├── skills/
    ├── brandkit/
    │   └── SKILL.md
    ├── brutalist-skill/
    │   └── SKILL.md
    ├── gpt-tasteskill/
    │   └── SKILL.md
    ├── image-to-code-skill/
    │   └── SKILL.md
    ├── imagegen-frontend-mobile/
    │   └── SKILL.md
    ├── imagegen-frontend-web/
    │   └── SKILL.md
    ├── minimalist-skill/
    │   └── SKILL.md
    ├── output-skill/
    │   └── SKILL.md
    ├── redesign-skill/
    │   └── SKILL.md
    ├── soft-skill/
    │   └── SKILL.md
    ├── stitch-skill/
    │   ├── DESIGN.md
    │   └── SKILL.md
    ├── taste-skill/
    │   └── SKILL.md
    ├── taste-skill-v1/
    │   └── SKILL.md
    └── llms.txt
├── CHANGELOG.md
├── LICENSE
├── README.md
└── skill.sh
```

## `tremor-npm-main/`

- **Files:** 331 · **Directories:** 93
- **Entry:** `README.md`

```
tremor-npm-main/
├── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug-report.yaml
    │   ├── config.yaml
    │   └── feature-request.yaml
    ├── workflows/
    │   ├── build.yaml
    │   ├── lint.yaml
    │   └── release.yaml
    └── pull_request_template.md
├── .storybook/
    ├── main.js
    ├── manager.js
    ├── preview.js
    └── tremorTheme.js
├── images/
    ├── banner-github-readme.png
    ├── example-dark.png
    ├── example-light.png
    ├── tremor-logo-dark.svg
    └── tremor-logo-light.svg
├── src/
    ├── assets/
    │   ├── ArrowDownHeadIcon.tsx
    │   ├── ArrowDownIcon.tsx
    │   ├── ArrowDownRightIcon.tsx
    │   ├── ArrowLeftHeadIcon.tsx
    │   ├── ArrowRightHeadIcon.tsx
    │   ├── ArrowRightIcon.tsx
    │   ├── ArrowUpHeadIcon.tsx
    │   ├── ArrowUpIcon.tsx
    │   ├── ArrowUpRightIcon.tsx
    │   ├── CalendarIcon.tsx
    │   ├── ChevronLeftFill.tsx
    │   ├── ChevronRightFill.tsx
    │   ├── DoubleArrowLeftHeadIcon.tsx
    │   ├── DoubleArrowRightHeadIcon.tsx
    │   ├── ExclamationFilledIcon.tsx
    │   ├── EyeIcon.tsx
    │   ├── EyeOffIcon.tsx
    │   ├── LoadingSpinner.tsx
    │   ├── MinusIcon.tsx
    │   ├── PlusIcon.tsx
    │   ├── SearchIcon.tsx
    │   ├── XCircleIcon.tsx
    │   ├── XIcon.tsx
    │   └── index.ts
    ├── components/
    │   ├── chart-elements/
    │   │   └── index.ts
    │   ├── icon-elements/
    │   │   └── index.ts
    │   ├── input-elements/
    │   │   ├── BaseInput.tsx
    │   │   ├── index.ts
    │   │   └── selectUtils.ts
    │   ├── layout-elements/
    │   │   └── index.ts
    │   ├── list-elements/
    │   │   └── index.ts
    │   ├── spark-elements/
    │   │   └── index.ts
    │   ├── text-elements/
    │   │   └── index.ts
    │   ├── util-elements/
    │   │   └── index.ts
    │   ├── vis-elements/
    │   │   └── index.ts
    │   └── index.ts
    ├── contexts/
    │   ├── BaseColorContext.tsx
    │   ├── IndexContext.tsx
    │   ├── RootStylesContext.tsx
    │   ├── SelectedValueContext.tsx
    │   └── index.ts
    ├── hooks/
    │   ├── index.ts
    │   ├── useInternalState.tsx
    │   └── useOnWindowResize.tsx
    ├── lib/
    │   ├── constants.ts
    │   ├── index.ts
    │   ├── inputTypes.ts
    │   ├── theme.ts
    │   ├── tremorTwMerge.ts
    │   └── utils.tsx
    ├── stories/
    │   ├── assets/
    │   │   ├── code-brackets.svg
    │   │   ├── colors.svg
    │   │   ├── comments.svg
    │   │   ├── direction.svg
    │   │   ├── flow.svg
    │   │   ├── plugin.svg
    │   │   ├── repo.svg
    │   │   └── stackalt.svg
    │   ├── chart-elements/
    │   │   ├── AreaChart.stories.tsx
    │   │   ├── BarChart.stories.tsx
    │   │   ├── DonutChart.stories.tsx
    │   │   ├── FunnelChart.stories.tsx
    │   │   ├── LineChart.stories.tsx
    │   │   └── ScatterChart.stories.tsx
    │   ├── icon-elements/
    │   │   ├── Badge.stories.tsx
    │   │   ├── BadgeDelta.stories.tsx
    │   │   └── Icon.stories.tsx
    │   ├── input-elements/
    │   │   ├── Button.stories.tsx
    │   │   ├── DatePicker.stories.tsx
    │   │   ├── DateRangePicker.stories.tsx
    │   │   ├── MultiSelect.stories.tsx
    │   │   ├── NumberInput.stories.tsx
    │   │   ├── SearchSelect.stories.tsx
    │   │   ├── Select.stories.tsx
    │   │   ├── Switch.stories.tsx
    │   │   ├── Tabs.stories.tsx
    │   │   ├── TextArea.stories.tsx
    │   │   └── TextInput.stories.tsx
    │   ├── layout-elements/
    │   │   ├── Accordion.stories.tsx
    │   │   ├── AccordionList.stories.tsx
    │   │   ├── Card.stories.tsx
    │   │   ├── Dialog.stories.tsx
    │   │   ├── Divider.stories.tsx
    │   │   ├── Flex.stories.tsx
    │   │   └── Grid.stories.tsx
    │   ├── list-elements/
    │   │   ├── List.stories.tsx
    │   │   └── Table.stories.tsx
    │   ├── spark-elements/
    │   │   ├── SparkAreaChart.stories.tsx
    │   │   ├── SparkBarChart.stories.tsx
    │   │   └── SparkLineChart.stories.tsx
    │   ├── text-elements/
    │   │   ├── Callout.stories.tsx
    │   │   ├── Legend.stories.tsx
    │   │   ├── Metric.stories.tsx
    │   │   ├── Subtitle.stories.tsx
    │   │   ├── Text.stories.tsx
    │   │   ├── TextElements.stories.tsx
    │   │   └── Title.stories.tsx
    │   └── vis-elements/
    │   │   ├── BarList.stories.tsx
    │   │   ├── CategoryBar.stories.tsx
    │   │   ├── DeltaBar.stories.tsx
    │   │   ├── MarkerBar.stories.tsx
    │   │   ├── ProgressBar.stories.tsx
    │   │   ├── ProgressCircle.stories.tsx
    │   │   └── Tracker.stories.tsx
    ├── tests/
    │   ├── chart-elements/
    │   │   ├── AreaChart.test.tsx
    │   │   └── BarChart.test.tsx
    │   ├── icon-elements/
    │   │   ├── Badge.test.tsx
    │   │   ├── BadgeDelta.test.tsx
    │   │   └── Icon.test.tsx
    │   ├── input-elements/
    │   │   ├── Button.test.tsx
    │   │   ├── DatePicker.test.tsx
    │   │   ├── DateRangePicker.test.tsx
    │   │   ├── MultiSelect.test.tsx
    │   │   ├── NumberInput.test.tsx
    │   │   ├── SearchSelect.test.tsx
    │   │   ├── Select.test.tsx
    │   │   ├── Switch.text.tsx
    │   │   ├── Tabs.test.tsx
    │   │   ├── TextInput.test.tsx
    │   │   └── Textarea.test.tsx
    │   ├── layout-elements/
    │   │   ├── Accordion.test.tsx
    │   │   ├── AccordionList.test.tsx
    │   │   ├── Card.test.tsx
    │   │   ├── Dialog.test.tsx
    │   │   ├── Divider.test.tsx
    │   │   ├── Flex.test.tsx
    │   │   └── Grid.test.tsx
    │   ├── list-elements/
    │   │   ├── List.test.tsx
    │   │   └── Table.test.tsx
    │   ├── spark-elements/
    │   │   └── SparkAreaChart.test.tsx
    │   ├── text-elements/
    │   │   ├── Callout.test.tsx
    │   │   ├── Legend.test.tsx
    │   │   ├── Metric.test.tsx
    │   │   ├── Subtitle.test.tsx
    │   │   ├── Text.test.tsx
    │   │   └── Title.test.tsx
    │   └── vis-elements/
    │   │   ├── BarList.test.tsx
    │   │   ├── CategoryBar.test.tsx
    │   │   ├── DeltaBar.test.tsx
    │   │   ├── MarkerBar.test.tsx
    │   │   ├── ProgressBar.test.tsx
    │   │   ├── ProgressCircle.text.tsx
    │   │   └── Tracker.test.tsx
    ├── index.ts
    └── styles.css
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .prettierrc.json
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── License
├── README.md
├── babel.config.js
├── jest.config.js
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── rollup.config.js
├── setupTests.js
├── tailwind.config.js
└── tsconfig.json
…
(tree truncated at depth 4; see STRUCTURE.full.txt for all paths)
```

## `typeui-main/`

- **Files:** 43 · **Directories:** 12
- **Entry:** `README.md`

```
typeui-main/
├── skills/
    ├── cli/
    │   └── SKILL.md
    └── fundamentals/
    │   ├── SKILL.md
    │   ├── accessibility.md
    │   ├── typography-principles.md
    │   ├── ui-principles.md
    │   └── ux-principles.md
├── src/
    ├── domain/
    │   └── designSystemSchema.ts
    ├── generation/
    │   ├── existingDesignSystem.ts
    │   ├── randomDesignSystem.ts
    │   ├── runDesignGeneration.ts
    │   ├── runGeneration.ts
    │   └── runPull.ts
    ├── io/
    │   └── updateSkillFile.ts
    ├── prompts/
    │   ├── designSystem.ts
    │   └── registry.ts
    ├── registry/
    │   └── registryClient.ts
    ├── renderers/
    │   ├── claudeRenderer.ts
    │   ├── codexRenderer.ts
    │   ├── cursorRenderer.ts
    │   ├── index.ts
    │   ├── openCodeRenderer.ts
    │   └── shared.ts
    ├── ui/
    │   └── banner.ts
    ├── cli.ts
    ├── config.ts
    ├── skillMetadata.ts
    └── types.ts
├── test/
    ├── existingDesignSystem.test.ts
    ├── randomDesignSystem.test.ts
    ├── registryClient.test.ts
    ├── renderers.test.ts
    ├── runDesignGeneration.test.ts
    ├── runPull.test.ts
    ├── skillMetadata.test.ts
    └── updateSkillFile.test.ts
├── .gitignore
├── DESIGN.md
├── LICENSE.md
├── README.md
├── REGISTRY.md
├── package-lock.json
├── package.json
└── tsconfig.json
```

## Package purposes (quick map)

- **BMAD-METHOD-main** — BMAD method / agent workflow methodology
- **Framely-main** — Framely — visual page builder (Next.js)
- **ShadcnVaults-main** — shadcn/ui block vault & previews
- **Silex-main** — Silex — open visual website editor (GrapesJS monorepo)
- **VvvebJs-master** — VvvebJs — drag-and-drop HTML builder
- **awesome-design-md-main** — Curated brand DESIGN.md examples (Stitch-style)
- **awesome-design-skills-main** — Curated design aesthetic skills (minimal, glassmorphism, etc.)
- **awesome-shadcn-ui-main** — Awesome shadcn/ui resource catalog site
- **builder-main** — Builder.io SDK monorepo
- **chadnext-main** — ChadNext — Next.js SaaS starter (shadcn)
- **impeccable-main** — Impeccable — UI critique/polish skill + reference
- **masri-design-assets** — NEZAM Masri / MENA design asset notes
- **next-shadcn-admin-dashboard-main** — Next.js shadcn admin dashboard template
- **next-shadcn-dashboard-starter-main** — Next.js shadcn dashboard starter (Kiranism)
- **open-design-main** — Open Design — AI design system / craft monorepo
- **react-starter-kit-main** — React Starter Kit monorepo
- **ruflo-main** — Ruflo — agent orchestration reference
- **shadcn-admin-main** — shadcn-admin — Vite React admin template
- **shadcn-studio-main** — shadcn/studio component registry
- **sketch-plugin-master** — Sketch design-tokens plugin
- **skills-main** — Anthropic agent skills repo (xlsx, docx, pdf, …)
- **tail-kit-main** — Tail-Kit — Tailwind component kit (Pages router)
- **tailwindcss-main** — Tailwind CSS source monorepo
- **taste-skill-main** — design-taste-frontend (anti-slop) skill
- **tremor-npm-main** — Tremor — React dashboard/chart components
- **typeui-main** — TypeUI — typography/UI design system skill + CLI

## Maintenance

- Regenerate: run the generator from repo root or re-request structure doc update.
- Do not commit upstream `.git` folders; keep vendored copies as read-only references.
- Cross-reference: `.cursor/skills/design/design-intelligence-index/SKILL.md`