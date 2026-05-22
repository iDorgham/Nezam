// ─────────────────────────────────────────────────────────────────────────────
// NEZAM Wireframe Library — Comprehensive Block Catalog
// 120+ blocks across 15 categories
// ─────────────────────────────────────────────────────────────────────────────

export type WireframeCategory =
  | 'elements'
  | 'navigation'
  | 'hero'
  | 'content'
  | 'cards'
  | 'menus'
  | 'grids'
  | 'forms'
  | 'media'
  | 'data'
  | 'commerce'
  | 'team'
  | 'blog'
  | 'feedback'
  | 'layout'

export interface WireframeVariant {
  id: string
  label: string
  description: string
  height: number // px on canvas at 1x zoom
}

export interface WireframeBlock {
  id: string
  name: string
  description: string
  category: WireframeCategory
  tags: string[]
  variants: WireframeVariant[]
  defaultHeight: number
  svgCategory: string // maps to SVG renderer key
}

// ── Elements ─────────────────────────────────────────────────────────────────

const ELEMENTS: WireframeBlock[] = [
  {
    id: 'el-button',
    name: 'Button',
    description: 'CTA and action buttons in all variants',
    category: 'elements',
    tags: ['button', 'cta', 'action', 'primary', 'secondary'],
    defaultHeight: 56,
    svgCategory: 'element-button',
    variants: [
      { id: 'primary', label: 'Primary', description: 'Filled primary button', height: 56 },
      { id: 'secondary', label: 'Secondary', description: 'Outlined secondary button', height: 56 },
      { id: 'ghost', label: 'Ghost', description: 'Ghost/text button', height: 56 },
      { id: 'icon-left', label: 'Icon + Label', description: 'Button with leading icon', height: 56 },
      { id: 'button-group', label: 'Button Group', description: 'Horizontal button group', height: 56 },
    ],
  },
  {
    id: 'el-badge',
    name: 'Badge',
    description: 'Status and label badges',
    category: 'elements',
    tags: ['badge', 'tag', 'label', 'status', 'chip'],
    defaultHeight: 40,
    svgCategory: 'element-badge',
    variants: [
      { id: 'default', label: 'Default', description: 'Standard badge', height: 40 },
      { id: 'dot', label: 'Dot Badge', description: 'Badge with status dot', height: 40 },
      { id: 'counter', label: 'Counter', description: 'Numeric badge', height: 40 },
      { id: 'tag-group', label: 'Tag Group', description: 'Multiple tags in a row', height: 40 },
    ],
  },
  {
    id: 'el-input',
    name: 'Input Field',
    description: 'Text input and form field variants',
    category: 'elements',
    tags: ['input', 'text', 'field', 'form', 'search'],
    defaultHeight: 60,
    svgCategory: 'element-input',
    variants: [
      { id: 'default', label: 'Default', description: 'Standard text input', height: 60 },
      { id: 'with-label', label: 'With Label', description: 'Input with label above', height: 80 },
      { id: 'with-icon', label: 'Icon Input', description: 'Input with leading icon', height: 60 },
      { id: 'search', label: 'Search', description: 'Search input with icon', height: 60 },
      { id: 'error', label: 'Error State', description: 'Input with error message', height: 90 },
    ],
  },
  {
    id: 'el-textarea',
    name: 'Textarea',
    description: 'Multi-line text input',
    category: 'elements',
    tags: ['textarea', 'text', 'multiline', 'form'],
    defaultHeight: 120,
    svgCategory: 'element-textarea',
    variants: [
      { id: 'default', label: 'Default', description: 'Standard textarea', height: 120 },
      { id: 'with-label', label: 'With Label', description: 'Textarea with label', height: 148 },
      { id: 'with-counter', label: 'With Counter', description: 'Textarea with char counter', height: 148 },
    ],
  },
  {
    id: 'el-select',
    name: 'Select / Dropdown',
    description: 'Select menus and dropdowns',
    category: 'elements',
    tags: ['select', 'dropdown', 'picker', 'form'],
    defaultHeight: 60,
    svgCategory: 'element-select',
    variants: [
      { id: 'default', label: 'Default', description: 'Standard select', height: 60 },
      { id: 'multi', label: 'Multi Select', description: 'Multi-select with chips', height: 72 },
      { id: 'with-label', label: 'With Label', description: 'Select with label', height: 84 },
    ],
  },
  {
    id: 'el-toggle',
    name: 'Toggle / Switch',
    description: 'Toggle switches and checkboxes',
    category: 'elements',
    tags: ['toggle', 'switch', 'checkbox', 'radio', 'form'],
    defaultHeight: 48,
    svgCategory: 'element-toggle',
    variants: [
      { id: 'toggle', label: 'Toggle Switch', description: 'On/off toggle', height: 48 },
      { id: 'checkbox', label: 'Checkbox', description: 'Checkbox with label', height: 40 },
      { id: 'radio', label: 'Radio Group', description: 'Radio button group', height: 100 },
      { id: 'checkbox-group', label: 'Checkbox Group', description: 'Multiple checkboxes', height: 120 },
    ],
  },
  {
    id: 'el-avatar',
    name: 'Avatar',
    description: 'User avatars and profile pictures',
    category: 'elements',
    tags: ['avatar', 'profile', 'user', 'image'],
    defaultHeight: 64,
    svgCategory: 'element-avatar',
    variants: [
      { id: 'circle', label: 'Circle', description: 'Circular avatar', height: 64 },
      { id: 'with-name', label: 'Avatar + Name', description: 'Avatar with username', height: 64 },
      { id: 'group', label: 'Avatar Group', description: 'Stacked avatar group', height: 64 },
      { id: 'initials', label: 'Initials', description: 'Avatar with initials fallback', height: 64 },
    ],
  },
  {
    id: 'el-divider',
    name: 'Divider / Separator',
    description: 'Section dividers and separators',
    category: 'elements',
    tags: ['divider', 'separator', 'hr', 'section'],
    defaultHeight: 32,
    svgCategory: 'element-divider',
    variants: [
      { id: 'line', label: 'Line', description: 'Simple horizontal line', height: 32 },
      { id: 'with-text', label: 'With Text', description: 'Divider with center text', height: 32 },
      { id: 'dotted', label: 'Dotted', description: 'Dotted divider', height: 32 },
      { id: 'section-gap', label: 'Section Gap', description: 'Large vertical spacer', height: 64 },
    ],
  },
  {
    id: 'el-skeleton',
    name: 'Skeleton Loader',
    description: 'Loading skeleton placeholders',
    category: 'elements',
    tags: ['skeleton', 'loading', 'placeholder', 'shimmer'],
    defaultHeight: 120,
    svgCategory: 'element-skeleton',
    variants: [
      { id: 'text', label: 'Text Skeleton', description: 'Text line skeletons', height: 80 },
      { id: 'card', label: 'Card Skeleton', description: 'Card loading skeleton', height: 180 },
      { id: 'list', label: 'List Skeleton', description: 'List item skeletons', height: 200 },
      { id: 'table', label: 'Table Skeleton', description: 'Table row skeletons', height: 240 },
    ],
  },
  {
    id: 'el-tooltip',
    name: 'Tooltip / Popover',
    description: 'Contextual help and popover overlays',
    category: 'elements',
    tags: ['tooltip', 'popover', 'hint', 'hover'],
    defaultHeight: 80,
    svgCategory: 'element-tooltip',
    variants: [
      { id: 'tooltip', label: 'Tooltip', description: 'Simple text tooltip', height: 80 },
      { id: 'popover', label: 'Popover', description: 'Rich content popover', height: 140 },
      { id: 'info-card', label: 'Info Card', description: 'Detailed info tooltip', height: 160 },
    ],
  },
  {
    id: 'el-progress',
    name: 'Progress / Loading',
    description: 'Progress bars and loading indicators',
    category: 'elements',
    tags: ['progress', 'bar', 'loading', 'spinner', 'indicator'],
    defaultHeight: 48,
    svgCategory: 'element-progress',
    variants: [
      { id: 'bar', label: 'Progress Bar', description: 'Linear progress bar', height: 24 },
      { id: 'bar-labeled', label: 'Labeled Bar', description: 'Bar with percentage label', height: 48 },
      { id: 'spinner', label: 'Spinner', description: 'Circular loading spinner', height: 64 },
      { id: 'steps', label: 'Step Indicator', description: 'Multi-step progress', height: 64 },
      { id: 'skill-bars', label: 'Skill Bars', description: 'Multiple labeled bars', height: 180 },
    ],
  },
  {
    id: 'el-alert',
    name: 'Alert / Banner',
    description: 'Alert messages and notification banners',
    category: 'elements',
    tags: ['alert', 'banner', 'notification', 'warning', 'error', 'success'],
    defaultHeight: 64,
    svgCategory: 'element-alert',
    variants: [
      { id: 'info', label: 'Info', description: 'Information alert', height: 64 },
      { id: 'success', label: 'Success', description: 'Success message', height: 64 },
      { id: 'warning', label: 'Warning', description: 'Warning alert', height: 64 },
      { id: 'error', label: 'Error', description: 'Error message', height: 64 },
      { id: 'toast', label: 'Toast', description: 'Floating toast notification', height: 72 },
    ],
  },
]

// ── Navigation ────────────────────────────────────────────────────────────────

const NAVIGATION: WireframeBlock[] = [
  {
    id: 'nav-topbar',
    name: 'Top Navigation Bar',
    description: 'Horizontal navigation bars',
    category: 'navigation',
    tags: ['navbar', 'header', 'navigation', 'top', 'menu'],
    defaultHeight: 72,
    svgCategory: 'nav-topbar',
    variants: [
      { id: 'logo-links', label: 'Logo + Links', description: 'Logo left, nav links center/right', height: 72 },
      { id: 'logo-links-cta', label: 'Logo + Links + CTA', description: 'With primary CTA button', height: 72 },
      { id: 'centered', label: 'Centered Logo', description: 'Centered logo, links on sides', height: 72 },
      { id: 'dark', label: 'Dark Navbar', description: 'Dark background navbar', height: 72 },
      { id: 'transparent', label: 'Transparent', description: 'Transparent over hero', height: 72 },
      { id: 'sticky', label: 'Sticky + Shadow', description: 'Sticky navbar with border', height: 72 },
      { id: 'with-search', label: 'With Search', description: 'Nav with inline search', height: 72 },
      { id: 'announcement', label: 'Announcement Bar', description: 'Top bar + nav combined', height: 112 },
    ],
  },
  {
    id: 'nav-sidebar',
    name: 'Sidebar Navigation',
    description: 'Vertical sidebar nav variants',
    category: 'navigation',
    tags: ['sidebar', 'vertical', 'navigation', 'dashboard', 'drawer'],
    defaultHeight: 480,
    svgCategory: 'nav-sidebar',
    variants: [
      { id: 'full', label: 'Full Sidebar', description: 'Full-height sidebar with sections', height: 480 },
      { id: 'icons', label: 'Icon Sidebar', description: 'Collapsed icon-only sidebar', height: 480 },
      { id: 'nested', label: 'Nested Nav', description: 'Sidebar with sub-menus', height: 480 },
      { id: 'mobile-drawer', label: 'Mobile Drawer', description: 'Full-screen mobile drawer', height: 480 },
    ],
  },
  {
    id: 'nav-tabs',
    name: 'Tabs',
    description: 'Tab navigation components',
    category: 'navigation',
    tags: ['tabs', 'navigation', 'switcher', 'segment'],
    defaultHeight: 56,
    svgCategory: 'nav-tabs',
    variants: [
      { id: 'underline', label: 'Underline Tabs', description: 'Classic underline style', height: 56 },
      { id: 'pill', label: 'Pill Tabs', description: 'Rounded pill tabs', height: 56 },
      { id: 'boxed', label: 'Boxed Tabs', description: 'Boxed/card tabs', height: 56 },
      { id: 'vertical', label: 'Vertical Tabs', description: 'Left-aligned vertical tabs', height: 280 },
      { id: 'scrollable', label: 'Scrollable', description: 'Horizontally scrollable tabs', height: 56 },
    ],
  },
  {
    id: 'nav-breadcrumb',
    name: 'Breadcrumb',
    description: 'Breadcrumb navigation trails',
    category: 'navigation',
    tags: ['breadcrumb', 'trail', 'navigation', 'path'],
    defaultHeight: 40,
    svgCategory: 'nav-breadcrumb',
    variants: [
      { id: 'default', label: 'Default', description: 'Simple breadcrumb trail', height: 40 },
      { id: 'with-home', label: 'With Home Icon', description: 'Home icon + breadcrumb', height: 40 },
    ],
  },
  {
    id: 'nav-footer',
    name: 'Footer',
    description: 'Site footer navigation',
    category: 'navigation',
    tags: ['footer', 'bottom', 'navigation', 'links', 'copyright'],
    defaultHeight: 280,
    svgCategory: 'nav-footer',
    variants: [
      { id: 'minimal', label: 'Minimal', description: 'Logo + copyright + links', height: 100 },
      { id: 'columns', label: 'Multi-column', description: '4-column links footer', height: 280 },
      { id: 'with-newsletter', label: 'Newsletter', description: 'Footer with email subscribe', height: 320 },
      { id: 'dark', label: 'Dark Footer', description: 'Full dark footer', height: 280 },
      { id: 'app-footer', label: 'App Footer', description: 'Footer with app store badges', height: 200 },
    ],
  },
  {
    id: 'nav-pagination',
    name: 'Pagination',
    description: 'Page navigation controls',
    category: 'navigation',
    tags: ['pagination', 'pages', 'navigation', 'next', 'previous'],
    defaultHeight: 56,
    svgCategory: 'nav-pagination',
    variants: [
      { id: 'numbered', label: 'Numbered', description: 'Numbered page links', height: 56 },
      { id: 'prev-next', label: 'Prev / Next', description: 'Simple prev/next buttons', height: 56 },
      { id: 'load-more', label: 'Load More', description: 'Load more button', height: 72 },
      { id: 'infinite', label: 'Infinite Hint', description: 'Scroll to load indicator', height: 72 },
    ],
  },
]

// ── Hero Sections ─────────────────────────────────────────────────────────────

const HERO: WireframeBlock[] = [
  {
    id: 'hero-centered',
    name: 'Hero Centered',
    description: 'Full-width centered hero sections',
    category: 'hero',
    tags: ['hero', 'centered', 'headline', 'cta', 'landing'],
    defaultHeight: 480,
    svgCategory: 'hero-centered',
    variants: [
      { id: 'minimal', label: 'Minimal', description: 'Headline + subtitle + CTA', height: 400 },
      { id: 'with-image', label: 'With Image', description: 'Hero with illustration/mockup below', height: 560 },
      { id: 'with-badge', label: 'With Badge', description: 'Badge + headline + CTA', height: 440 },
      { id: 'fullscreen', label: 'Fullscreen', description: '100vh centered hero', height: 640 },
      { id: 'with-video', label: 'Video Background', description: 'Video BG with overlay content', height: 560 },
      { id: 'gradient', label: 'Gradient', description: 'Gradient background hero', height: 480 },
      { id: 'particles', label: 'Animated', description: 'Hero with animation hint', height: 520 },
    ],
  },
  {
    id: 'hero-split',
    name: 'Hero Split',
    description: 'Two-column split hero sections',
    category: 'hero',
    tags: ['hero', 'split', 'two-column', 'image', 'landing'],
    defaultHeight: 480,
    svgCategory: 'hero-split',
    variants: [
      { id: 'text-left', label: 'Text Left', description: 'Content left, image right', height: 480 },
      { id: 'text-right', label: 'Text Right', description: 'Image left, content right', height: 480 },
      { id: 'dark-side', label: 'Dark/Light Split', description: 'Dark left, light right', height: 480 },
      { id: 'form-right', label: 'Form Right', description: 'Headline left, form right', height: 480 },
      { id: 'mockup', label: 'App Mockup', description: 'Text + app screenshot', height: 520 },
    ],
  },
  {
    id: 'hero-saas',
    name: 'Hero SaaS',
    description: 'SaaS-optimized hero with social proof',
    category: 'hero',
    tags: ['hero', 'saas', 'social proof', 'logos', 'cta'],
    defaultHeight: 560,
    svgCategory: 'hero-saas',
    variants: [
      { id: 'with-logos', label: 'With Client Logos', description: 'Hero + trusted-by logos', height: 560 },
      { id: 'with-stats', label: 'With Stats', description: 'Hero + key metrics strip', height: 560 },
      { id: 'with-avatars', label: 'With Reviews', description: 'Hero + avatar + star rating', height: 520 },
      { id: 'dashboard-preview', label: 'Dashboard Preview', description: 'Hero + dashboard screenshot below', height: 640 },
    ],
  },
  {
    id: 'hero-blog',
    name: 'Blog Hero / Header',
    description: 'Blog and article page headers',
    category: 'hero',
    tags: ['hero', 'blog', 'article', 'title', 'author'],
    defaultHeight: 320,
    svgCategory: 'hero-blog',
    variants: [
      { id: 'article-header', label: 'Article Header', description: 'Title + author + date + category', height: 320 },
      { id: 'category-header', label: 'Category Header', description: 'Category name + description', height: 200 },
      { id: 'featured-hero', label: 'Featured Post', description: 'Full-width image + title overlay', height: 400 },
    ],
  },
  {
    id: 'hero-portfolio',
    name: 'Portfolio Hero',
    description: 'Personal and portfolio hero sections',
    category: 'hero',
    tags: ['hero', 'portfolio', 'personal', 'intro', 'about'],
    defaultHeight: 480,
    svgCategory: 'hero-portfolio',
    variants: [
      { id: 'name-role', label: 'Name + Role', description: 'Name, role, bio, social links', height: 480 },
      { id: 'with-photo', label: 'With Photo', description: 'Photo + name + role', height: 480 },
      { id: 'dark-minimal', label: 'Dark Minimal', description: 'Dark background, minimal text', height: 400 },
    ],
  },
]

// ── Content Sections ──────────────────────────────────────────────────────────

const CONTENT: WireframeBlock[] = [
  {
    id: 'content-features',
    name: 'Features Section',
    description: 'Product features and benefits',
    category: 'content',
    tags: ['features', 'benefits', 'icons', 'section'],
    defaultHeight: 400,
    svgCategory: 'content-features',
    variants: [
      { id: 'grid-3', label: '3-col Grid', description: 'Icon + title + desc × 3', height: 360 },
      { id: 'grid-4', label: '4-col Grid', description: 'Feature cards × 4', height: 360 },
      { id: 'alternating', label: 'Alternating', description: 'Left/right alternating rows', height: 560 },
      { id: 'centered-list', label: 'Centered List', description: 'Centered icon list', height: 400 },
      { id: 'comparison', label: 'Comparison', description: 'Before/after or A vs B', height: 400 },
      { id: 'bento', label: 'Bento Grid', description: 'Asymmetric bento layout', height: 480 },
    ],
  },
  {
    id: 'content-about',
    name: 'About / Mission',
    description: 'About sections and company story',
    category: 'content',
    tags: ['about', 'mission', 'story', 'company'],
    defaultHeight: 400,
    svgCategory: 'content-about',
    variants: [
      { id: 'text-image', label: 'Text + Image', description: 'About text + image side by side', height: 360 },
      { id: 'centered', label: 'Centered', description: 'Centered about text', height: 280 },
      { id: 'split-stats', label: 'With Stats', description: 'Text + key stat numbers', height: 360 },
      { id: 'timeline', label: 'Timeline', description: 'Company history timeline', height: 560 },
    ],
  },
  {
    id: 'content-testimonials',
    name: 'Testimonials',
    description: 'Customer reviews and social proof',
    category: 'content',
    tags: ['testimonials', 'reviews', 'social proof', 'quotes'],
    defaultHeight: 360,
    svgCategory: 'content-testimonials',
    variants: [
      { id: 'single', label: 'Single Quote', description: 'Large featured quote', height: 280 },
      { id: 'grid', label: 'Grid', description: 'Testimonial card grid', height: 400 },
      { id: 'carousel', label: 'Carousel', description: 'Sliding testimonials', height: 280 },
      { id: 'masonry', label: 'Masonry', description: 'Masonry testimonial layout', height: 480 },
      { id: 'logo-wall', label: 'Logo + Reviews', description: 'Stars + client logos', height: 280 },
    ],
  },
  {
    id: 'content-cta',
    name: 'CTA Section',
    description: 'Call-to-action sections',
    category: 'content',
    tags: ['cta', 'call to action', 'conversion', 'banner'],
    defaultHeight: 240,
    svgCategory: 'content-cta',
    variants: [
      { id: 'centered', label: 'Centered CTA', description: 'Headline + CTA centered', height: 240 },
      { id: 'split', label: 'Split CTA', description: 'Text left, CTA right', height: 160 },
      { id: 'dark', label: 'Dark CTA', description: 'Dark bg CTA section', height: 240 },
      { id: 'gradient', label: 'Gradient CTA', description: 'Gradient bg CTA', height: 280 },
      { id: 'with-image', label: 'With Image', description: 'CTA with decorative image', height: 320 },
    ],
  },
  {
    id: 'content-faq',
    name: 'FAQ Section',
    description: 'Frequently asked questions',
    category: 'content',
    tags: ['faq', 'accordion', 'questions', 'help'],
    defaultHeight: 480,
    svgCategory: 'content-faq',
    variants: [
      { id: 'accordion', label: 'Accordion', description: 'Expandable question list', height: 480 },
      { id: 'two-col', label: 'Two-column', description: 'Questions in two columns', height: 400 },
      { id: 'with-contact', label: 'With Contact', description: 'FAQ + contact CTA', height: 560 },
    ],
  },
  {
    id: 'content-logos',
    name: 'Logo Wall / Partners',
    description: 'Client logos and partner brands',
    category: 'content',
    tags: ['logos', 'clients', 'partners', 'trust', 'brands'],
    defaultHeight: 160,
    svgCategory: 'content-logos',
    variants: [
      { id: 'row', label: 'Logo Row', description: 'Single row of logos', height: 120 },
      { id: 'grid', label: 'Logo Grid', description: 'Grid of logos', height: 200 },
      { id: 'marquee', label: 'Scrolling Marquee', description: 'Infinite scroll logos', height: 100 },
      { id: 'with-heading', label: 'With Heading', description: '"Trusted by" + logos', height: 160 },
    ],
  },
  {
    id: 'content-stats',
    name: 'Stats / Numbers',
    description: 'Key metrics and statistics display',
    category: 'content',
    tags: ['stats', 'numbers', 'metrics', 'kpi', 'counters'],
    defaultHeight: 200,
    svgCategory: 'content-stats',
    variants: [
      { id: 'row', label: 'Stats Row', description: '3-4 stats in a row', height: 160 },
      { id: 'cards', label: 'Stat Cards', description: 'Individual stat cards', height: 200 },
      { id: 'dark-bg', label: 'Dark Background', description: 'Stats on dark bg', height: 200 },
      { id: 'with-icons', label: 'With Icons', description: 'Icon + stat + label', height: 200 },
    ],
  },
  {
    id: 'content-pricing',
    name: 'Pricing Section',
    description: 'Pricing plans and tiers',
    category: 'content',
    tags: ['pricing', 'plans', 'subscription', 'tiers'],
    defaultHeight: 520,
    svgCategory: 'content-pricing',
    variants: [
      { id: 'cards-3', label: '3 Plans', description: 'Free / Pro / Enterprise', height: 520 },
      { id: 'cards-2', label: '2 Plans', description: 'Monthly / Annual toggle + 2 plans', height: 520 },
      { id: 'table', label: 'Comparison Table', description: 'Feature comparison table', height: 600 },
      { id: 'simple', label: 'Simple', description: 'Minimal pricing section', height: 320 },
    ],
  },
  {
    id: 'content-timeline',
    name: 'Timeline / Process',
    description: 'Step-by-step process and timeline',
    category: 'content',
    tags: ['timeline', 'process', 'steps', 'how it works'],
    defaultHeight: 400,
    svgCategory: 'content-timeline',
    variants: [
      { id: 'horizontal', label: 'Horizontal Steps', description: 'Numbered horizontal steps', height: 240 },
      { id: 'vertical', label: 'Vertical Timeline', description: 'Vertical timeline with dots', height: 480 },
      { id: 'alternating', label: 'Alternating', description: 'Left/right alternating steps', height: 560 },
      { id: 'numbered', label: 'Numbered Steps', description: 'Large numbered steps', height: 400 },
    ],
  },
  {
    id: 'content-map',
    name: 'Map / Location',
    description: 'Map embeds and location sections',
    category: 'content',
    tags: ['map', 'location', 'contact', 'address'],
    defaultHeight: 320,
    svgCategory: 'content-map',
    variants: [
      { id: 'full-width', label: 'Full Width Map', description: 'Full-width map placeholder', height: 320 },
      { id: 'split', label: 'Map + Info', description: 'Map + contact details side by side', height: 360 },
    ],
  },
]

// ── Cards ─────────────────────────────────────────────────────────────────────

const CARDS: WireframeBlock[] = [
  {
    id: 'card-feature',
    name: 'Feature Card',
    description: 'Feature and benefit cards',
    category: 'cards',
    tags: ['feature', 'card', 'icon', 'benefit'],
    defaultHeight: 200,
    svgCategory: 'card-feature',
    variants: [
      { id: 'icon-top', label: 'Icon Top', description: 'Icon + title + description', height: 200 },
      { id: 'icon-left', label: 'Icon Left', description: 'Inline icon + text', height: 120 },
      { id: 'numbered', label: 'Numbered', description: 'Large number + feature', height: 180 },
      { id: 'bordered', label: 'Bordered', description: 'Card with border', height: 200 },
    ],
  },
  {
    id: 'card-pricing',
    name: 'Pricing Card',
    description: 'Individual pricing plan cards',
    category: 'cards',
    tags: ['pricing', 'plan', 'card', 'subscription'],
    defaultHeight: 400,
    svgCategory: 'card-pricing',
    variants: [
      { id: 'standard', label: 'Standard', description: 'Plan name + price + features', height: 400 },
      { id: 'featured', label: 'Featured', description: 'Highlighted popular plan', height: 440 },
      { id: 'enterprise', label: 'Enterprise', description: 'Custom pricing card', height: 360 },
    ],
  },
  {
    id: 'card-product',
    name: 'Product Card',
    description: 'E-commerce product cards',
    category: 'cards',
    tags: ['product', 'card', 'ecommerce', 'shop', 'image'],
    defaultHeight: 320,
    svgCategory: 'card-product',
    variants: [
      { id: 'default', label: 'Default', description: 'Image + name + price + CTA', height: 320 },
      { id: 'horizontal', label: 'Horizontal', description: 'Image left + info right', height: 180 },
      { id: 'with-badge', label: 'With Badge', description: 'Product with sale/new badge', height: 340 },
      { id: 'minimal', label: 'Minimal', description: 'Minimal product card', height: 280 },
    ],
  },
  {
    id: 'card-article',
    name: 'Article / Blog Card',
    description: 'Blog post and article cards',
    category: 'cards',
    tags: ['article', 'blog', 'post', 'card', 'news'],
    defaultHeight: 360,
    svgCategory: 'card-article',
    variants: [
      { id: 'with-image', label: 'With Image', description: 'Cover image + title + excerpt', height: 360 },
      { id: 'horizontal', label: 'Horizontal', description: 'Image left + content right', height: 200 },
      { id: 'minimal', label: 'Minimal', description: 'Category + title + author', height: 200 },
      { id: 'featured', label: 'Featured', description: 'Large featured article card', height: 440 },
      { id: 'compact', label: 'Compact', description: 'Compact list-style article', height: 100 },
    ],
  },
  {
    id: 'card-profile',
    name: 'Profile / Team Card',
    description: 'Team member and user profile cards',
    category: 'cards',
    tags: ['profile', 'team', 'member', 'bio', 'avatar'],
    defaultHeight: 280,
    svgCategory: 'card-profile',
    variants: [
      { id: 'default', label: 'Default', description: 'Photo + name + role + bio', height: 280 },
      { id: 'minimal', label: 'Minimal', description: 'Avatar + name + role', height: 200 },
      { id: 'social', label: 'With Socials', description: 'Profile + social links', height: 300 },
      { id: 'horizontal', label: 'Horizontal', description: 'Photo left + info right', height: 140 },
    ],
  },
  {
    id: 'card-testimonial',
    name: 'Testimonial Card',
    description: 'Customer review cards',
    category: 'cards',
    tags: ['testimonial', 'review', 'quote', 'rating', 'customer'],
    defaultHeight: 240,
    svgCategory: 'card-testimonial',
    variants: [
      { id: 'quote', label: 'Quote Card', description: 'Quote + author + avatar', height: 240 },
      { id: 'with-stars', label: 'With Stars', description: 'Stars + quote + reviewer', height: 260 },
      { id: 'company', label: 'Company', description: 'Logo + quote + person', height: 280 },
      { id: 'minimal', label: 'Minimal', description: 'Compact quote card', height: 180 },
    ],
  },
  {
    id: 'card-stat',
    name: 'Stat Card',
    description: 'Metric and KPI stat cards',
    category: 'cards',
    tags: ['stat', 'metric', 'kpi', 'number', 'dashboard'],
    defaultHeight: 140,
    svgCategory: 'card-stat',
    variants: [
      { id: 'simple', label: 'Simple', description: 'Label + big number', height: 120 },
      { id: 'with-icon', label: 'With Icon', description: 'Icon + label + number', height: 140 },
      { id: 'with-trend', label: 'With Trend', description: 'Number + trend arrow + delta', height: 160 },
      { id: 'with-chart', label: 'Mini Chart', description: 'Stat with sparkline', height: 180 },
    ],
  },
  {
    id: 'card-event',
    name: 'Event Card',
    description: 'Event and calendar item cards',
    category: 'cards',
    tags: ['event', 'calendar', 'date', 'time', 'venue'],
    defaultHeight: 240,
    svgCategory: 'card-event',
    variants: [
      { id: 'default', label: 'Default', description: 'Date + title + description', height: 240 },
      { id: 'compact', label: 'Compact', description: 'Compact event list item', height: 100 },
      { id: 'with-image', label: 'With Image', description: 'Event image + details', height: 320 },
    ],
  },
]

// ── Menus ─────────────────────────────────────────────────────────────────────

const MENUS: WireframeBlock[] = [
  {
    id: 'menu-dropdown',
    name: 'Dropdown Menu',
    description: 'Dropdown and context menus',
    category: 'menus',
    tags: ['dropdown', 'menu', 'navigation', 'popup'],
    defaultHeight: 200,
    svgCategory: 'menu-dropdown',
    variants: [
      { id: 'simple', label: 'Simple List', description: 'Basic dropdown list', height: 200 },
      { id: 'with-icons', label: 'With Icons', description: 'Dropdown with icons', height: 240 },
      { id: 'with-sections', label: 'With Sections', description: 'Grouped dropdown sections', height: 280 },
      { id: 'context', label: 'Context Menu', description: 'Right-click context menu', height: 200 },
    ],
  },
  {
    id: 'menu-mega',
    name: 'Mega Menu',
    description: 'Full-width mega navigation menus',
    category: 'menus',
    tags: ['mega menu', 'navigation', 'wide', 'multi-column'],
    defaultHeight: 360,
    svgCategory: 'menu-mega',
    variants: [
      { id: 'columns', label: 'Multi-column', description: '3-4 column mega menu', height: 360 },
      { id: 'with-featured', label: 'With Featured', description: 'Links + featured article', height: 400 },
      { id: 'product-nav', label: 'Product Nav', description: 'Product category mega menu', height: 440 },
    ],
  },
  {
    id: 'menu-command',
    name: 'Command Palette',
    description: 'Keyboard-driven command search palette',
    category: 'menus',
    tags: ['command', 'palette', 'search', 'keyboard', 'shortcut'],
    defaultHeight: 400,
    svgCategory: 'menu-command',
    variants: [
      { id: 'default', label: 'Default', description: 'Search input + result list', height: 400 },
      { id: 'with-categories', label: 'With Categories', description: 'Grouped command categories', height: 480 },
    ],
  },
  {
    id: 'menu-mobile',
    name: 'Mobile Menu',
    description: 'Mobile navigation and hamburger menus',
    category: 'menus',
    tags: ['mobile', 'hamburger', 'drawer', 'responsive', 'navigation'],
    defaultHeight: 480,
    svgCategory: 'menu-mobile',
    variants: [
      { id: 'bottom-nav', label: 'Bottom Nav', description: 'Mobile bottom navigation bar', height: 80 },
      { id: 'drawer', label: 'Side Drawer', description: 'Full-height side drawer', height: 480 },
      { id: 'fullscreen', label: 'Fullscreen', description: 'Full-screen mobile menu overlay', height: 560 },
    ],
  },
]

// ── Grid Styles ───────────────────────────────────────────────────────────────

const GRIDS: WireframeBlock[] = [
  {
    id: 'grid-standard',
    name: 'Content Grid',
    description: 'Standard content grid layouts',
    category: 'grids',
    tags: ['grid', 'columns', 'cards', 'layout'],
    defaultHeight: 480,
    svgCategory: 'grid-standard',
    variants: [
      { id: '2-col', label: '2 Column', description: '2-column equal grid', height: 400 },
      { id: '3-col', label: '3 Column', description: '3-column card grid', height: 400 },
      { id: '4-col', label: '4 Column', description: '4-column tight grid', height: 360 },
      { id: '5-col', label: '5 Column', description: '5-column wide grid', height: 360 },
    ],
  },
  {
    id: 'grid-masonry',
    name: 'Masonry Grid',
    description: 'Pinterest-style masonry layout',
    category: 'grids',
    tags: ['masonry', 'pinterest', 'gallery', 'variable height'],
    defaultHeight: 560,
    svgCategory: 'grid-masonry',
    variants: [
      { id: '2-col', label: '2-col Masonry', description: '2-column masonry grid', height: 480 },
      { id: '3-col', label: '3-col Masonry', description: '3-column masonry grid', height: 560 },
    ],
  },
  {
    id: 'grid-bento',
    name: 'Bento Grid',
    description: 'Asymmetric bento box layout',
    category: 'grids',
    tags: ['bento', 'asymmetric', 'featured', 'mixed'],
    defaultHeight: 480,
    svgCategory: 'grid-bento',
    variants: [
      { id: '2x2-featured', label: 'Featured + 4', description: '1 large + 4 small bento', height: 480 },
      { id: 'mixed', label: 'Mixed Sizes', description: 'Various sized bento boxes', height: 560 },
      { id: 'horizontal-featured', label: 'Wide + Columns', description: 'Wide top + columns below', height: 520 },
    ],
  },
  {
    id: 'grid-gallery',
    name: 'Image Gallery',
    description: 'Photo gallery grid layouts',
    category: 'grids',
    tags: ['gallery', 'photos', 'images', 'portfolio'],
    defaultHeight: 480,
    svgCategory: 'grid-gallery',
    variants: [
      { id: 'uniform', label: 'Uniform', description: 'Equal-size image grid', height: 400 },
      { id: 'collage', label: 'Collage', description: 'Mixed-size collage layout', height: 480 },
      { id: 'full-bleed', label: 'Full Bleed', description: 'Edge-to-edge image grid', height: 480 },
    ],
  },
  {
    id: 'grid-blog',
    name: 'Blog Grid',
    description: 'Blog post listing layouts',
    category: 'grids',
    tags: ['blog', 'posts', 'articles', 'listing', 'feed'],
    defaultHeight: 560,
    svgCategory: 'grid-blog',
    variants: [
      { id: 'card-grid', label: 'Card Grid', description: '3-col blog card grid', height: 560 },
      { id: 'list', label: 'List View', description: 'Horizontal list with image', height: 480 },
      { id: 'featured-top', label: 'Featured Top', description: 'Large featured + 2-col grid', height: 640 },
      { id: 'magazine', label: 'Magazine', description: 'Asymmetric magazine layout', height: 640 },
      { id: 'minimal-list', label: 'Minimal List', description: 'Title + date list', height: 400 },
    ],
  },
]

// ── Forms ─────────────────────────────────────────────────────────────────────

const FORMS: WireframeBlock[] = [
  {
    id: 'form-auth',
    name: 'Auth Forms',
    description: 'Login, register, and auth forms',
    category: 'forms',
    tags: ['login', 'register', 'auth', 'sign in', 'sign up'],
    defaultHeight: 480,
    svgCategory: 'form-auth',
    variants: [
      { id: 'login', label: 'Login', description: 'Email + password + submit', height: 400 },
      { id: 'register', label: 'Register', description: 'Full registration form', height: 520 },
      { id: 'forgot', label: 'Forgot Password', description: 'Email recovery form', height: 320 },
      { id: 'otp', label: 'OTP / 2FA', description: 'One-time code input', height: 320 },
      { id: 'split', label: 'Split Layout', description: 'Image left + form right', height: 480 },
      { id: 'social-auth', label: 'Social Auth', description: 'SSO buttons + divider + form', height: 480 },
    ],
  },
  {
    id: 'form-contact',
    name: 'Contact Form',
    description: 'Contact and inquiry forms',
    category: 'forms',
    tags: ['contact', 'form', 'inquiry', 'message'],
    defaultHeight: 480,
    svgCategory: 'form-contact',
    variants: [
      { id: 'simple', label: 'Simple', description: 'Name + email + message', height: 400 },
      { id: 'detailed', label: 'Detailed', description: 'Full contact details form', height: 560 },
      { id: 'with-map', label: 'With Map', description: 'Form + embedded map', height: 480 },
      { id: 'floating-card', label: 'Floating Card', description: 'Contact form as card', height: 440 },
    ],
  },
  {
    id: 'form-newsletter',
    name: 'Newsletter / Subscribe',
    description: 'Email subscription forms',
    category: 'forms',
    tags: ['newsletter', 'subscribe', 'email', 'capture', 'lead'],
    defaultHeight: 160,
    svgCategory: 'form-newsletter',
    variants: [
      { id: 'inline', label: 'Inline', description: 'Email + subscribe button inline', height: 80 },
      { id: 'centered', label: 'Centered', description: 'Centered subscribe section', height: 200 },
      { id: 'with-perks', label: 'With Benefits', description: 'Subscribe + benefit list', height: 280 },
      { id: 'banner', label: 'Banner', description: 'Full-width subscribe banner', height: 200 },
    ],
  },
  {
    id: 'form-checkout',
    name: 'Checkout Form',
    description: 'E-commerce checkout and payment forms',
    category: 'forms',
    tags: ['checkout', 'payment', 'order', 'billing', 'cart'],
    defaultHeight: 560,
    svgCategory: 'form-checkout',
    variants: [
      { id: 'single-page', label: 'Single Page', description: 'One-page checkout', height: 640 },
      { id: 'multi-step', label: 'Multi-step', description: 'Shipping + payment + review', height: 560 },
      { id: 'with-summary', label: 'With Order Summary', description: 'Form + order details sidebar', height: 640 },
    ],
  },
  {
    id: 'form-multistep',
    name: 'Multi-step Form',
    description: 'Wizard-style multi-step forms',
    category: 'forms',
    tags: ['wizard', 'multi-step', 'onboarding', 'survey'],
    defaultHeight: 480,
    svgCategory: 'form-multistep',
    variants: [
      { id: 'progress-top', label: 'Progress Top', description: 'Step indicator + form', height: 480 },
      { id: 'sidebar-steps', label: 'Sidebar Steps', description: 'Left step nav + form content', height: 520 },
      { id: 'numbered', label: 'Numbered Steps', description: 'Numbered wizard steps', height: 480 },
    ],
  },
  {
    id: 'form-settings',
    name: 'Settings Form',
    description: 'Application settings and profile forms',
    category: 'forms',
    tags: ['settings', 'profile', 'account', 'preferences'],
    defaultHeight: 560,
    svgCategory: 'form-settings',
    variants: [
      { id: 'general', label: 'General Settings', description: 'Profile fields + save button', height: 560 },
      { id: 'with-sidebar', label: 'With Nav Sidebar', description: 'Settings nav + form panel', height: 600 },
      { id: 'notification-prefs', label: 'Notifications', description: 'Toggle-based preferences', height: 480 },
    ],
  },
]

// ── Media ─────────────────────────────────────────────────────────────────────

const MEDIA: WireframeBlock[] = [
  {
    id: 'media-image',
    name: 'Image Block',
    description: 'Image and figure components',
    category: 'media',
    tags: ['image', 'photo', 'figure', 'caption'],
    defaultHeight: 320,
    svgCategory: 'media-image',
    variants: [
      { id: 'full-width', label: 'Full Width', description: 'Edge-to-edge image block', height: 320 },
      { id: 'with-caption', label: 'With Caption', description: 'Image + caption below', height: 360 },
      { id: 'rounded', label: 'Rounded Card', description: 'Rounded image with shadow', height: 280 },
    ],
  },
  {
    id: 'media-video',
    name: 'Video Block',
    description: 'Video player and embed components',
    category: 'media',
    tags: ['video', 'player', 'embed', 'youtube', 'media'],
    defaultHeight: 360,
    svgCategory: 'media-video',
    variants: [
      { id: 'player', label: 'Video Player', description: 'Video player with controls', height: 360 },
      { id: 'embed', label: 'Embed', description: 'YouTube/Vimeo embed frame', height: 360 },
      { id: 'with-overlay', label: 'Play Overlay', description: 'Thumbnail with play button', height: 360 },
    ],
  },
]

// ── Data ──────────────────────────────────────────────────────────────────────

const DATA: WireframeBlock[] = [
  {
    id: 'data-table',
    name: 'Data Table',
    description: 'Tables for listing and comparing data',
    category: 'data',
    tags: ['table', 'data', 'list', 'rows', 'columns'],
    defaultHeight: 400,
    svgCategory: 'data-table',
    variants: [
      { id: 'simple', label: 'Simple', description: 'Basic data table', height: 320 },
      { id: 'with-actions', label: 'With Actions', description: 'Table + action buttons per row', height: 400 },
      { id: 'sortable', label: 'Sortable', description: 'Table with sort headers', height: 400 },
      { id: 'striped', label: 'Striped', description: 'Alternating row stripes', height: 360 },
    ],
  },
  {
    id: 'data-list',
    name: 'List / Feed',
    description: 'Structured list views',
    category: 'data',
    tags: ['list', 'feed', 'items', 'rows', 'entries'],
    defaultHeight: 360,
    svgCategory: 'data-list',
    variants: [
      { id: 'icon-list', label: 'Icon List', description: 'Icon + text list items', height: 280 },
      { id: 'avatar-list', label: 'Avatar List', description: 'Avatar + name + meta list', height: 360 },
      { id: 'numbered', label: 'Numbered List', description: 'Numbered ranking list', height: 320 },
      { id: 'check-list', label: 'Check List', description: 'Checklist items', height: 280 },
    ],
  },
  {
    id: 'data-chart',
    name: 'Chart / Graph',
    description: 'Data visualization chart placeholders',
    category: 'data',
    tags: ['chart', 'graph', 'visualization', 'bar', 'line', 'pie'],
    defaultHeight: 280,
    svgCategory: 'data-chart',
    variants: [
      { id: 'bar', label: 'Bar Chart', description: 'Bar/column chart', height: 280 },
      { id: 'line', label: 'Line Chart', description: 'Line/area chart', height: 280 },
      { id: 'pie', label: 'Pie / Donut', description: 'Pie or donut chart', height: 280 },
      { id: 'sparkline', label: 'Sparkline', description: 'Mini inline chart', height: 80 },
    ],
  },
]

// ── Commerce ──────────────────────────────────────────────────────────────────

const COMMERCE: WireframeBlock[] = [
  {
    id: 'commerce-cart',
    name: 'Cart / Basket',
    description: 'Shopping cart and order summary',
    category: 'commerce',
    tags: ['cart', 'basket', 'order', 'checkout'],
    defaultHeight: 480,
    svgCategory: 'commerce-cart',
    variants: [
      { id: 'sidebar-cart', label: 'Sidebar Cart', description: 'Sliding cart drawer', height: 480 },
      { id: 'full-page', label: 'Cart Page', description: 'Full cart page layout', height: 560 },
      { id: 'mini-cart', label: 'Mini Cart', description: 'Dropdown mini cart', height: 320 },
    ],
  },
  {
    id: 'commerce-product-detail',
    name: 'Product Detail',
    description: 'Product detail and PDP page sections',
    category: 'commerce',
    tags: ['product', 'detail', 'pdp', 'gallery', 'add to cart'],
    defaultHeight: 560,
    svgCategory: 'commerce-product',
    variants: [
      { id: 'standard', label: 'Standard', description: 'Image gallery + info + CTA', height: 560 },
      { id: 'minimal', label: 'Minimal', description: 'Clean product layout', height: 480 },
      { id: 'with-reviews', label: 'With Reviews', description: 'Product + review section', height: 800 },
    ],
  },
]

// ── Team ──────────────────────────────────────────────────────────────────────

const TEAM: WireframeBlock[] = [
  {
    id: 'team-grid',
    name: 'Team Grid',
    description: 'Team member grid sections',
    category: 'team',
    tags: ['team', 'people', 'staff', 'grid', 'profiles'],
    defaultHeight: 480,
    svgCategory: 'team-grid',
    variants: [
      { id: '3-col', label: '3-col Grid', description: 'Team in 3 columns', height: 480 },
      { id: '4-col', label: '4-col Grid', description: 'Team in 4 columns', height: 480 },
      { id: 'list', label: 'List View', description: 'Team in horizontal list', height: 400 },
      { id: 'founders', label: 'Founders', description: 'Large founder highlight section', height: 400 },
    ],
  },
  {
    id: 'team-bio',
    name: 'Bio / Detail Section',
    description: 'Individual team member bio sections',
    category: 'team',
    tags: ['bio', 'profile', 'team member', 'person', 'detail'],
    defaultHeight: 360,
    svgCategory: 'team-bio',
    variants: [
      { id: 'photo-left', label: 'Photo Left', description: 'Photo + bio side by side', height: 360 },
      { id: 'photo-top', label: 'Photo Top', description: 'Photo + bio stacked', height: 400 },
      { id: 'with-socials', label: 'With Socials', description: 'Bio + social media links', height: 400 },
    ],
  },
]

// ── Blog ──────────────────────────────────────────────────────────────────────

const BLOG: WireframeBlock[] = [
  {
    id: 'blog-index',
    name: 'Blog Index',
    description: 'Blog listing page sections',
    category: 'blog',
    tags: ['blog', 'index', 'listing', 'posts', 'archive'],
    defaultHeight: 640,
    svgCategory: 'blog-index',
    variants: [
      { id: 'grid', label: 'Card Grid', description: '3-col post card grid', height: 640 },
      { id: 'list', label: 'List', description: 'Post list with thumbnail', height: 520 },
      { id: 'magazine', label: 'Magazine', description: 'Featured + grid hybrid', height: 720 },
      { id: 'with-sidebar', label: 'With Sidebar', description: 'Posts + sidebar', height: 640 },
    ],
  },
  {
    id: 'blog-post',
    name: 'Blog Post Content',
    description: 'Article body and post content',
    category: 'blog',
    tags: ['blog', 'post', 'article', 'content', 'body'],
    defaultHeight: 560,
    svgCategory: 'blog-post',
    variants: [
      { id: 'content', label: 'Article Body', description: 'Typography + images', height: 640 },
      { id: 'with-toc', label: 'With TOC', description: 'Sticky table of contents + content', height: 640 },
      { id: 'with-sidebar', label: 'With Sidebar', description: 'Content + sidebar widgets', height: 640 },
    ],
  },
  {
    id: 'blog-related',
    name: 'Related Posts',
    description: 'Related article suggestions',
    category: 'blog',
    tags: ['related', 'posts', 'articles', 'suggestions'],
    defaultHeight: 360,
    svgCategory: 'blog-related',
    variants: [
      { id: '3-col', label: '3 Related', description: '3 related article cards', height: 360 },
      { id: '2-col', label: '2 Related', description: '2 related article cards', height: 360 },
    ],
  },
  {
    id: 'blog-author-bio',
    name: 'Author Bio',
    description: 'Post author bio section',
    category: 'blog',
    tags: ['author', 'bio', 'writer', 'profile', 'post'],
    defaultHeight: 180,
    svgCategory: 'blog-author',
    variants: [
      { id: 'card', label: 'Bio Card', description: 'Author card at post end', height: 180 },
      { id: 'minimal', label: 'Minimal', description: 'Avatar + name + date', height: 72 },
    ],
  },
]

// ── Feedback ──────────────────────────────────────────────────────────────────

const FEEDBACK: WireframeBlock[] = [
  {
    id: 'feedback-modal',
    name: 'Modal / Dialog',
    description: 'Modal and dialog overlays',
    category: 'feedback',
    tags: ['modal', 'dialog', 'popup', 'overlay'],
    defaultHeight: 320,
    svgCategory: 'feedback-modal',
    variants: [
      { id: 'confirm', label: 'Confirm Dialog', description: 'Confirmation modal', height: 240 },
      { id: 'form', label: 'Form Modal', description: 'Modal with form content', height: 400 },
      { id: 'full-page', label: 'Full Page', description: 'Full-page overlay modal', height: 480 },
      { id: 'sheet', label: 'Bottom Sheet', description: 'Mobile bottom sheet', height: 360 },
    ],
  },
  {
    id: 'feedback-empty',
    name: 'Empty State',
    description: 'Empty and error state illustrations',
    category: 'feedback',
    tags: ['empty', 'state', 'no data', 'placeholder', 'error'],
    defaultHeight: 320,
    svgCategory: 'feedback-empty',
    variants: [
      { id: 'no-results', label: 'No Results', description: 'No search results state', height: 280 },
      { id: 'no-data', label: 'No Data', description: 'Empty data state', height: 280 },
      { id: '404', label: '404 Error', description: 'Page not found', height: 360 },
      { id: 'success', label: 'Success State', description: 'Task completed confirmation', height: 280 },
    ],
  },
]

// ── Layout Structures ─────────────────────────────────────────────────────────

const LAYOUT: WireframeBlock[] = [
  {
    id: 'layout-section-header',
    name: 'Section Header',
    description: 'Section title and subtitle blocks',
    category: 'layout',
    tags: ['section', 'header', 'title', 'subtitle', 'heading'],
    defaultHeight: 120,
    svgCategory: 'layout-section-header',
    variants: [
      { id: 'centered', label: 'Centered', description: 'Centered title + subtitle', height: 120 },
      { id: 'left-aligned', label: 'Left Aligned', description: 'Left title + subtitle', height: 100 },
      { id: 'with-badge', label: 'With Badge', description: 'Badge + title + subtitle', height: 140 },
      { id: 'with-cta', label: 'With CTA', description: 'Title + subtitle + action', height: 120 },
    ],
  },
  {
    id: 'layout-page-header',
    name: 'Page Header',
    description: 'Inner page headers with breadcrumb',
    category: 'layout',
    tags: ['page header', 'inner page', 'breadcrumb', 'title'],
    defaultHeight: 160,
    svgCategory: 'layout-page-header',
    variants: [
      { id: 'minimal', label: 'Minimal', description: 'Breadcrumb + page title', height: 120 },
      { id: 'with-description', label: 'With Description', description: 'Title + subtitle + breadcrumb', height: 160 },
      { id: 'dark-bg', label: 'Dark Background', description: 'Dark bg page header', height: 200 },
    ],
  },
  {
    id: 'layout-sidebar',
    name: 'Content + Sidebar',
    description: 'Main content area with sidebar layout',
    category: 'layout',
    tags: ['sidebar', 'layout', 'content', 'two-column', 'aside'],
    defaultHeight: 640,
    svgCategory: 'layout-sidebar',
    variants: [
      { id: 'right-sidebar', label: 'Right Sidebar', description: '70/30 content + sidebar', height: 640 },
      { id: 'left-sidebar', label: 'Left Sidebar', description: '30/70 sidebar + content', height: 640 },
    ],
  },
  {
    id: 'layout-dashboard',
    name: 'Dashboard Layout',
    description: 'Admin and app dashboard layout',
    category: 'layout',
    tags: ['dashboard', 'admin', 'app', 'layout', 'sidebar'],
    defaultHeight: 640,
    svgCategory: 'layout-dashboard',
    variants: [
      { id: 'sidebar-content', label: 'Sidebar + Content', description: 'Sidebar nav + main content area', height: 640 },
      { id: 'stats-top', label: 'Stats + Charts', description: 'Stat cards + chart grid', height: 560 },
      { id: 'kanban', label: 'Kanban Board', description: 'Column-based kanban layout', height: 560 },
    ],
  },
]

// ── Aggregate Library ─────────────────────────────────────────────────────────

export const WIREFRAME_LIBRARY: WireframeBlock[] = [
  ...ELEMENTS,
  ...NAVIGATION,
  ...HERO,
  ...CONTENT,
  ...CARDS,
  ...MENUS,
  ...GRIDS,
  ...FORMS,
  ...MEDIA,
  ...DATA,
  ...COMMERCE,
  ...TEAM,
  ...BLOG,
  ...FEEDBACK,
  ...LAYOUT,
]

export const WIREFRAME_CATEGORIES: { id: WireframeCategory; label: string; count: number }[] = [
  { id: 'elements', label: 'Elements', count: ELEMENTS.length },
  { id: 'navigation', label: 'Navigation', count: NAVIGATION.length },
  { id: 'hero', label: 'Hero', count: HERO.length },
  { id: 'content', label: 'Content', count: CONTENT.length },
  { id: 'cards', label: 'Cards', count: CARDS.length },
  { id: 'menus', label: 'Menus', count: MENUS.length },
  { id: 'grids', label: 'Grids', count: GRIDS.length },
  { id: 'forms', label: 'Forms', count: FORMS.length },
  { id: 'media', label: 'Media', count: MEDIA.length },
  { id: 'data', label: 'Data', count: DATA.length },
  { id: 'commerce', label: 'Commerce', count: COMMERCE.length },
  { id: 'team', label: 'Team', count: TEAM.length },
  { id: 'blog', label: 'Blog', count: BLOG.length },
  { id: 'feedback', label: 'Feedback', count: FEEDBACK.length },
  { id: 'layout', label: 'Layout', count: LAYOUT.length },
]

export function searchBlocks(query: string): WireframeBlock[] {
  const q = query.toLowerCase().trim()
  if (!q) return WIREFRAME_LIBRARY
  return WIREFRAME_LIBRARY.filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.description.toLowerCase().includes(q) ||
    b.tags.some(t => t.includes(q))
  )
}

export function getBlockById(id: string): WireframeBlock | undefined {
  return WIREFRAME_LIBRARY.find(b => b.id === id)
}
