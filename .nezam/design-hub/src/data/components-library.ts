import type React from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ComponentStatus =
  | 'stable'
  | 'beta'
  | 'caution'
  | 'early-access'
  | 'deprecated'

export type ComponentGroup =
  | 'forms'
  | 'images'
  | 'layout'
  | 'loading'
  | 'messaging'
  | 'navigation'
  | 'overlays'
  | 'status'
  | 'text-data'
  | 'primitives'
  | 'libraries'
  | 'tooling'
  | 'deprecated'

export interface ComponentDef {
  id: string
  name: string
  description: string
  group: ComponentGroup
  status: ComponentStatus
  docsUrl?: string
}

// ─── Labels & Icons ───────────────────────────────────────────────────────────

export const GROUP_LABELS: Record<ComponentGroup, string> = {
  forms:       'Forms and inputs',
  images:      'Images and icons',
  layout:      'Layout',
  loading:     'Loading indicators',
  messaging:   'Messaging',
  navigation:  'Navigation',
  overlays:    'Overlays',
  status:      'Status and metadata',
  'text-data': 'Text and data',
  primitives:  'Primitives',
  libraries:   'Libraries',
  tooling:     'Tooling',
  deprecated:  'Deprecated',
}

export const GROUP_ICONS: Record<ComponentGroup, string> = {
  forms:       'LayoutList',
  images:      'Image',
  layout:      'Layout',
  loading:     'Loader2',
  messaging:   'MessageSquare',
  navigation:  'Navigation',
  overlays:    'Layers',
  status:      'Info',
  'text-data': 'AlignLeft',
  primitives:  'Box',
  libraries:   'BookOpen',
  tooling:     'Wrench',
  deprecated:  'Archive',
}

// Ordered list for sidebar display
export const GROUP_ORDER: ComponentGroup[] = [
  'forms',
  'images',
  'layout',
  'loading',
  'messaging',
  'navigation',
  'overlays',
  'status',
  'text-data',
  'primitives',
  'libraries',
  'tooling',
  'deprecated',
]

// ─── Component Catalog ────────────────────────────────────────────────────────

export const COMPONENTS_LIBRARY: ComponentDef[] = [
  // ── Forms and inputs ──────────────────────────────────────────────────────
  {
    id: 'button',
    name: 'Button',
    description: 'Triggers an action or event, such as submitting a form or opening a dialog.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'button-group',
    name: 'Button Group',
    description: 'A set of related actions displayed side by side in a horizontal row.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Displays a month view for date selection and event awareness.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    description: 'Allows users to select one or more items from a list, or to mark something as done.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'comment-editor',
    name: 'Comment Editor',
    description: 'A rich-text editor optimised for leaving contextual comments and mentions.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'date-time-picker',
    name: 'Date / Time Picker',
    description: 'Lets users pick a date, time, or date-time range from a calendar popover.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'dropdown',
    name: 'Dropdown Menu',
    description: 'Displays a list of options or actions that appears below a trigger element.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'field-radio',
    name: 'Field Radio',
    description: 'A field wrapper that renders radio options in a group with a label and description.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'form',
    name: 'Form',
    description: 'Composable form primitives for building accessible, validated form layouts.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'input',
    name: 'Text Input',
    description: 'A single-line text input for capturing short, freeform user input.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'label',
    name: 'Label',
    description: 'Associates a visible label with a form control to improve accessibility.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'number-input',
    name: 'Number Input',
    description: 'Numeric input with increment/decrement controls and validation.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'radio-group',
    name: 'Radio Group',
    description: 'Lets users select a single option from a mutually exclusive list.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'range-slider',
    name: 'Range Slider',
    description: 'A drag-to-select control for choosing a value within a defined numeric range.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'select',
    name: 'Select',
    description: 'A styled native or custom select for choosing from a list of options.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'switch',
    name: 'Toggle / Switch',
    description: 'A binary on/off control that provides immediate visual feedback.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'textarea',
    name: 'Text Area',
    description: 'Multi-line text input that auto-expands as the user types.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'time-picker',
    name: 'Time Picker',
    description: 'Displays a clock-based picker for selecting hours and minutes.',
    group: 'forms',
    status: 'stable',
  },
  {
    id: 'token-field',
    name: 'Token Field',
    description: 'Multi-value input that converts entries into removable tokens (tags).',
    group: 'forms',
    status: 'beta',
  },

  // ── Images and icons ──────────────────────────────────────────────────────
  {
    id: 'avatar',
    name: 'Avatar',
    description: 'Represents a user or entity with an image, initials, or placeholder icon.',
    group: 'images',
    status: 'stable',
  },
  {
    id: 'avatar-group',
    name: 'Avatar Group',
    description: 'Displays a stacked cluster of avatars with an overflow count indicator.',
    group: 'images',
    status: 'stable',
  },
  {
    id: 'icon',
    name: 'Icon',
    description: 'Renders an icon from the icon library at a consistent size and color.',
    group: 'images',
    status: 'stable',
  },
  {
    id: 'image',
    name: 'Image',
    description: 'Displays a responsive image with optional lazy loading and placeholder.',
    group: 'images',
    status: 'stable',
  },
  {
    id: 'logo',
    name: 'Logo',
    description: 'Renders the product or brand logo in standard sizes and color modes.',
    group: 'images',
    status: 'stable',
  },
  {
    id: 'tile',
    name: 'Tile',
    description: 'A clickable surface tile that combines image, label, and selection state.',
    group: 'images',
    status: 'beta',
  },

  // ── Layout ────────────────────────────────────────────────────────────────
  {
    id: 'card',
    name: 'Card',
    description: 'A contained surface for grouping related content and actions.',
    group: 'layout',
    status: 'stable',
  },
  {
    id: 'divider',
    name: 'Divider / Separator',
    description: 'A thin horizontal or vertical line that separates sections of content.',
    group: 'layout',
    status: 'stable',
  },
  {
    id: 'page',
    name: 'Page',
    description: 'Top-level layout container that controls the main scrollable content area.',
    group: 'layout',
    status: 'stable',
  },
  {
    id: 'page-header',
    name: 'Page Header',
    description: 'Standardised header zone with title, actions, and optional breadcrumbs.',
    group: 'layout',
    status: 'stable',
  },
  {
    id: 'section-header',
    name: 'Section Header',
    description: 'A heading and description row that introduces a block of related content.',
    group: 'layout',
    status: 'stable',
  },
  {
    id: 'sidebar-layout',
    name: 'Sidebar Layout',
    description: 'Two-column layout with a fixed sidebar and a flexible main content pane.',
    group: 'layout',
    status: 'stable',
  },

  // ── Loading indicators ────────────────────────────────────────────────────
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    description: 'Visualises progress toward a goal as a horizontal filled bar.',
    group: 'loading',
    status: 'stable',
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    description: 'Placeholder shapes that mimic content while data is loading.',
    group: 'loading',
    status: 'stable',
  },
  {
    id: 'spinner',
    name: 'Spinner',
    description: 'Indeterminate loading indicator for operations with unknown duration.',
    group: 'loading',
    status: 'stable',
  },

  // ── Messaging ─────────────────────────────────────────────────────────────
  {
    id: 'alert',
    name: 'Alert',
    description: 'Inline contextual message to inform users about a state or event.',
    group: 'messaging',
    status: 'stable',
  },
  {
    id: 'banner',
    name: 'Banner',
    description: 'A high-visibility, full-width message for system-wide announcements.',
    group: 'messaging',
    status: 'stable',
  },
  {
    id: 'flag',
    name: 'Flag / Toast',
    description: 'Transient notification that appears in a corner and auto-dismisses.',
    group: 'messaging',
    status: 'stable',
  },
  {
    id: 'inline-message',
    name: 'Inline Message',
    description: 'Short, non-blocking status message displayed inline near its source.',
    group: 'messaging',
    status: 'stable',
  },
  {
    id: 'modal',
    name: 'Modal Dialog',
    description: 'Focused overlay that interrupts workflow to capture a decision or display critical info.',
    group: 'messaging',
    status: 'stable',
  },
  {
    id: 'section-message',
    name: 'Section Message',
    description: 'Prominent message block with icon, title, and body for page-level notices.',
    group: 'messaging',
    status: 'stable',
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Onboarding guide that highlights a specific UI element with an explanation.',
    group: 'messaging',
    status: 'stable',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  {
    id: 'breadcrumbs',
    name: 'Breadcrumbs',
    description: 'Shows the user\'s location within the app hierarchy as a clickable trail.',
    group: 'navigation',
    status: 'stable',
  },
  {
    id: 'link',
    name: 'Link',
    description: 'Styled anchor element for inline and standalone navigation.',
    group: 'navigation',
    status: 'stable',
  },
  {
    id: 'menu',
    name: 'Menu',
    description: 'Vertical list of navigation or action items with optional icons and nesting.',
    group: 'navigation',
    status: 'stable',
  },
  {
    id: 'nav-system',
    name: 'Navigation System',
    description: 'Full-featured top bar / side nav combination with product switcher.',
    group: 'navigation',
    status: 'stable',
  },
  {
    id: 'pagination',
    name: 'Pagination',
    description: 'Navigates between pages of a large data set with prev / next / page controls.',
    group: 'navigation',
    status: 'stable',
  },
  {
    id: 'steps',
    name: 'Steps / Progress Steps',
    description: 'Horizontal step indicator showing position within a multi-step workflow.',
    group: 'navigation',
    status: 'stable',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    description: 'Organises related content into switchable panels within the same view.',
    group: 'navigation',
    status: 'stable',
  },

  // ── Overlays ──────────────────────────────────────────────────────────────
  {
    id: 'blanket',
    name: 'Blanket',
    description: 'Semi-transparent overlay that obscures the page behind modals and drawers.',
    group: 'overlays',
    status: 'stable',
  },
  {
    id: 'drawer',
    name: 'Drawer',
    description: 'Side panel that slides in from the edge, used for detail views and settings.',
    group: 'overlays',
    status: 'stable',
  },
  {
    id: 'inline-dialog',
    name: 'Inline Dialog',
    description: 'Small anchored popup for quick confirmations or contextual options.',
    group: 'overlays',
    status: 'stable',
  },
  {
    id: 'popup',
    name: 'Popup',
    description: 'Positioned overlay that appears near a trigger and stays open until dismissed.',
    group: 'overlays',
    status: 'stable',
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    description: 'Brief label that appears on hover to describe an element or its action.',
    group: 'overlays',
    status: 'stable',
  },

  // ── Status and metadata ───────────────────────────────────────────────────
  {
    id: 'badge',
    name: 'Badge',
    description: 'Small count or label indicator attached to another element.',
    group: 'status',
    status: 'stable',
  },
  {
    id: 'empty-state',
    name: 'Empty State',
    description: 'Placeholder content shown when a list, table, or view contains no items.',
    group: 'status',
    status: 'stable',
  },
  {
    id: 'lozenge',
    name: 'Lozenge',
    description: 'Small status pill indicating state (e.g., success, warning, in-progress).',
    group: 'status',
    status: 'stable',
  },
  {
    id: 'progress-indicator',
    name: 'Progress Indicator',
    description: 'Circular step dots that show position in a short multi-step flow.',
    group: 'status',
    status: 'stable',
  },
  {
    id: 'progress-tracker',
    name: 'Progress Tracker',
    description: 'Detailed milestone tracker with named stages and completion states.',
    group: 'status',
    status: 'stable',
  },
  {
    id: 'tag',
    name: 'Tag',
    description: 'Compact, removable label for categorising or annotating content.',
    group: 'status',
    status: 'stable',
  },
  {
    id: 'tag-group',
    name: 'Tag Group',
    description: 'A collection of tags with overflow handling and add-new affordance.',
    group: 'status',
    status: 'stable',
  },

  // ── Text and data ─────────────────────────────────────────────────────────
  {
    id: 'code',
    name: 'Code',
    description: 'Monospace block or inline element for displaying code snippets.',
    group: 'text-data',
    status: 'stable',
  },
  {
    id: 'data-table',
    name: 'Data Table',
    description: 'Full-featured sortable, filterable table for dense structured data.',
    group: 'text-data',
    status: 'stable',
  },
  {
    id: 'dynamic-table',
    name: 'Dynamic Table',
    description: 'Sortable table with paginated data loading and row selection.',
    group: 'text-data',
    status: 'stable',
  },
  {
    id: 'heading',
    name: 'Heading',
    description: 'Semantic heading element with design-token–controlled size and weight.',
    group: 'text-data',
    status: 'stable',
  },
  {
    id: 'inline-edit',
    name: 'Inline Edit',
    description: 'Text that becomes editable on click, minimising form overhead.',
    group: 'text-data',
    status: 'stable',
  },
  {
    id: 'metric-text',
    name: 'Metric Text',
    description: 'Large numeric display optimised for KPI and dashboard readability.',
    group: 'text-data',
    status: 'stable',
  },
  {
    id: 'table',
    name: 'Table',
    description: 'Accessible HTML table primitive with standardised styling.',
    group: 'text-data',
    status: 'stable',
  },
  {
    id: 'table-tree',
    name: 'Table Tree',
    description: 'Hierarchical table that supports expandable/collapsible nested rows.',
    group: 'text-data',
    status: 'stable',
  },

  // ── Primitives ────────────────────────────────────────────────────────────
  {
    id: 'anchor',
    name: 'Anchor',
    description: 'Low-level anchor primitive that all link components are built on.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'bleed',
    name: 'Bleed',
    description: 'Utility that lets content break out of its parent padding boundary.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'box',
    name: 'Box',
    description: 'Universal layout primitive with token-based padding, color, and border props.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'flex',
    name: 'Flex',
    description: 'Flexbox container primitive with token-controlled gap and alignment.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'focusable',
    name: 'Focusable',
    description: 'Wrapper that adds a design-system focus ring to any child element.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'grid',
    name: 'Grid',
    description: 'CSS Grid container with token-aware column and gap configuration.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'inline',
    name: 'Inline',
    description: 'Horizontal stack that wraps overflowing items to the next line.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'pressable',
    name: 'Pressable',
    description: 'Touch-/click-friendly primitive with press, hover, and focus states.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'responsive',
    name: 'Responsive',
    description: 'Utility wrapper for conditionally rendering content at breakpoints.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'stack',
    name: 'Stack',
    description: 'Vertical column layout with token-controlled spacing between items.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'text-primitive',
    name: 'Text',
    description: 'Typographic primitive with semantic size and color token props.',
    group: 'primitives',
    status: 'stable',
  },
  {
    id: 'visually-hidden',
    name: 'Visually Hidden',
    description: 'Hides content visually while keeping it accessible to screen readers.',
    group: 'primitives',
    status: 'stable',
  },

  // ── Libraries ─────────────────────────────────────────────────────────────
  {
    id: 'css',
    name: 'CSS Library',
    description: 'Core stylesheet package exposing all design tokens as CSS custom properties.',
    group: 'libraries',
    status: 'stable',
  },
  {
    id: 'css-reset',
    name: 'CSS Reset',
    description: 'Opinionated cross-browser reset that normalises default element styles.',
    group: 'libraries',
    status: 'stable',
  },
  {
    id: 'design-tokens',
    name: 'Design Tokens',
    description: 'Token package exposing all values as JS constants and CSS variables.',
    group: 'libraries',
    status: 'stable',
  },
  {
    id: 'motion',
    name: 'Motion',
    description: 'Animation utilities and transition presets built on design token durations.',
    group: 'libraries',
    status: 'stable',
  },
  {
    id: 'popper',
    name: 'Popper',
    description: 'Positioning engine for popups, tooltips, and anchored overlays.',
    group: 'libraries',
    status: 'stable',
  },
  {
    id: 'portal',
    name: 'Portal',
    description: 'Renders children outside the DOM hierarchy into a document-level container.',
    group: 'libraries',
    status: 'stable',
  },
  {
    id: 'pragmatic-dnd',
    name: 'Pragmatic Drag and Drop',
    description: 'High-performance drag-and-drop library with accessible keyboard support.',
    group: 'libraries',
    status: 'stable',
  },

  // ── Tooling ───────────────────────────────────────────────────────────────
  {
    id: 'app-provider',
    name: 'App Provider',
    description: 'Root context provider that configures locale, theme, and feature flags.',
    group: 'tooling',
    status: 'stable',
  },
  {
    id: 'eslint-plugin',
    name: 'ESLint Plugin',
    description: 'Lint rules that enforce design-system usage patterns and deprecation notices.',
    group: 'tooling',
    status: 'stable',
  },
  {
    id: 'storybook-addon',
    name: 'Storybook Addon',
    description: 'Storybook integration with theme switching and token inspection panels.',
    group: 'tooling',
    status: 'stable',
  },
  {
    id: 'stylelint-plugin',
    name: 'Stylelint Plugin',
    description: 'CSS linting rules that enforce token usage and flag raw values.',
    group: 'tooling',
    status: 'stable',
  },
  {
    id: 'ui-styling-standard',
    name: 'UI Styling Standard',
    description: 'Documentation and tooling for the approved styling patterns and conventions.',
    group: 'tooling',
    status: 'stable',
  },

  // ── Deprecated ────────────────────────────────────────────────────────────
  {
    id: 'atlassian-navigation',
    name: 'Atlassian Navigation',
    description: 'Legacy global navigation bar. Replaced by Navigation System.',
    group: 'deprecated',
    status: 'deprecated',
  },
  {
    id: 'icon-object',
    name: 'Icon Object',
    description: 'Legacy icon-in-box component. Use Icon + Box primitives instead.',
    group: 'deprecated',
    status: 'deprecated',
  },
  {
    id: 'layout-grid',
    name: 'Layout Grid',
    description: 'Legacy fixed 12-column grid. Use the Grid primitive instead.',
    group: 'deprecated',
    status: 'deprecated',
  },
  {
    id: 'onboarding-spotlight',
    name: 'Onboarding Spotlight',
    description: 'Legacy onboarding component. Replaced by Spotlight.',
    group: 'deprecated',
    status: 'deprecated',
  },
  {
    id: 'page-layout',
    name: 'Page Layout (legacy)',
    description: 'Legacy full-page layout primitives. Replaced by Page and Sidebar Layout.',
    group: 'deprecated',
    status: 'deprecated',
  },
  {
    id: 'section-message-legacy',
    name: 'Section Message (legacy)',
    description: 'Old section message API. Migrated to the new Section Message component.',
    group: 'deprecated',
    status: 'deprecated',
  },
  {
    id: 'table-legacy',
    name: 'Table (legacy)',
    description: 'Old table implementation pre-dates the Data Table component.',
    group: 'deprecated',
    status: 'deprecated',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns components filtered to a specific group */
export function getComponentsByGroup(group: ComponentGroup): ComponentDef[] {
  return COMPONENTS_LIBRARY.filter((c) => c.group === group)
}

/** Returns count of components per group */
export function getGroupCounts(): Record<ComponentGroup, number> {
  return GROUP_ORDER.reduce(
    (acc, group) => {
      acc[group] = getComponentsByGroup(group).length
      return acc
    },
    {} as Record<ComponentGroup, number>,
  )
}

/** Filter by query string against name and description */
export function filterComponents(
  query: string,
  group?: ComponentGroup | null,
): ComponentDef[] {
  const q = query.toLowerCase().trim()
  return COMPONENTS_LIBRARY.filter((c) => {
    if (group && c.group !== group) return false
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.group.includes(q)
    )
  })
}

export const STATUS_LABELS: Record<ComponentStatus, string> = {
  stable:          'Stable',
  beta:            'Beta',
  caution:         'Caution',
  'early-access':  'Early Access',
  deprecated:      'Deprecated',
}

export const STATUS_COLORS: Record<ComponentStatus, string> = {
  stable:
    'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 dark:border-emerald-500/40',
  beta:
    'text-violet-700 dark:text-violet-300 bg-violet-500/10 dark:bg-violet-500/15 border-violet-500/30 dark:border-violet-500/40',
  caution:
    'text-amber-700 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30 dark:border-amber-500/40',
  'early-access':
    'text-sky-700 dark:text-sky-300 bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/30 dark:border-sky-500/40',
  deprecated:
    'text-rose-700 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/30 dark:border-rose-500/40',
}
