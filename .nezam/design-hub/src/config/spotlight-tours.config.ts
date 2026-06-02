export interface SpotlightTourStep {
  id: string
  targetAttr: string
  title: string
  body: string
  side: 'top' | 'bottom' | 'left' | 'right'
  cta?: { label: string; action: 'dismiss-tour' }
}

export const SPOTLIGHT_TOURS: Record<string, SpotlightTourStep[]> = {
  architecture: [
    {
      id: 'arch-left-panel',
      targetAttr: 'arch-left-panel',
      title: 'Your sitemap',
      body: 'Pages from your template appear here. Use + to add subpages, groups, or microservice links.',
      side: 'right',
    },
    {
      id: 'arch-canvas',
      targetAttr: 'arch-sitemap-canvas',
      title: 'Pan and inspect',
      body: 'Middle-click or two-finger scroll to pan. Click any card to open its properties on the right.',
      side: 'bottom',
    },
    {
      id: 'arch-profiles',
      targetAttr: 'arch-profiles-picker',
      title: 'Wrong template?',
      body: "Swap blueprints here. Custom edits you've made are preserved unless you pick a new template.",
      side: 'right',
    },
    {
      id: 'arch-right-rail',
      targetAttr: 'arch-right-rail',
      title: 'Edit page details',
      body: 'Route, type, icon, and microservice wires are here. Changes sync to the wireframe tree immediately.',
      side: 'left',
      cta: { label: 'Got it', action: 'dismiss-tour' },
    },
  ],
  wireframes: [
    {
      id: 'wf-page-tree',
      targetAttr: 'wireframes-page-tree',
      title: 'One canvas per page',
      body: 'Each sitemap page has its own wireframe. Select a page here to start composing its blocks.',
      side: 'right',
    },
    {
      id: 'wf-palette',
      targetAttr: 'wireframes-block-palette',
      title: 'Block library',
      body: 'Drag any block into the canvas. Start every page with a Nav_TopBar block at the top.',
      side: 'right',
    },
    {
      id: 'wf-lock-button',
      targetAttr: 'wireframes-lock-btn',
      title: 'Lock to unblock dev',
      body: 'Once every P0 page has blocks, this activates. Locking writes wireframes_locked.json and starts the SDD pipeline.',
      side: 'top',
      cta: { label: 'Got it', action: 'dismiss-tour' },
    },
  ],
  design: [
    {
      id: 'ds-token-nav',
      targetAttr: 'design-token-nav',
      title: 'Tokens by category',
      body: 'Colors, typography, spacing, radius — each has its own editor. Every edit reflects in Preview instantly.',
      side: 'right',
    },
    {
      id: 'ds-color-editor',
      targetAttr: 'design-color-editor',
      title: 'Roles, not raw values',
      body: 'Each color maps to a semantic role. Your swarm agents read these roles and never hardcode hex.',
      side: 'bottom',
    },
    {
      id: 'ds-export',
      targetAttr: 'design-export-panel',
      title: 'Export writes DESIGN.md',
      body: "This generates the root DESIGN.md — the contract every agent builds from. Run it when tokens are final.",
      side: 'left',
      cta: { label: 'Got it', action: 'dismiss-tour' },
    },
  ],
  components: [
    {
      id: 'comp-tabs',
      targetAttr: 'components-category-tabs',
      title: '80+ components',
      body: 'Filter by type. Every component shows all 7 states: default, hover, focus, active, disabled, loading, error.',
      side: 'bottom',
    },
    {
      id: 'comp-copy',
      targetAttr: 'components-copy-button',
      title: 'Token-aware code',
      body: 'Copy outputs Tailwind using your current tokens — not hardcoded values. Ready to paste into any component.',
      side: 'left',
      cta: { label: 'Got it', action: 'dismiss-tour' },
    },
  ],
  theming: [
    {
      id: 'theme-presets',
      targetAttr: 'theming-presets-panel',
      title: 'Presets layer on top',
      body: "Presets apply aesthetic themes on top of your token values — they don't replace them.",
      side: 'right',
    },
    {
      id: 'theme-preview',
      targetAttr: 'theming-preview-pane',
      title: 'Live preview',
      body: 'This panel renders your components in real time as you adjust. What you see here is what agents build.',
      side: 'left',
      cta: { label: 'Got it', action: 'dismiss-tour' },
    },
  ],
  preview: [
    {
      id: 'preview-devices',
      targetAttr: 'preview-device-switcher',
      title: 'All breakpoints',
      body: 'Switch between mobile (375px), tablet (768px), and desktop (1440px). Fluid tokens adapt to each.',
      side: 'bottom',
    },
    {
      id: 'preview-export',
      targetAttr: 'preview-export-btn',
      title: 'Download for handoff',
      body: 'Exports a ZIP with tokens.css, DESIGN.md, and wireframes_locked.json — everything agents need.',
      side: 'left',
      cta: { label: 'Done', action: 'dismiss-tour' },
    },
  ],
}
