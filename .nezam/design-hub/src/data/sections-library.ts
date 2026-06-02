/**
 * NEZAM Design Hub — Page Sections Library
 *
 * Each section is a named, categorised UI region with a live inline
 * preview rendered via CSS variables from the active design profile.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type SectionCategory =
  | 'navigation'
  | 'hero'
  | 'features'
  | 'social-proof'
  | 'pricing'
  | 'cta'
  | 'content'
  | 'auth'
  | 'dashboard'
  | 'footer'
  | 'empty-states'
  | 'banners'
  | 'tables'
  | 'forms'

export interface SectionDef {
  id: string
  name: string
  category: SectionCategory
  description: string
  tags: string[]
  complexity: 'simple' | 'medium' | 'complex'
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export const SECTION_CATEGORY_LABELS: Record<SectionCategory, string> = {
  navigation:    'Navigation',
  hero:          'Hero',
  features:      'Features',
  'social-proof': 'Social Proof',
  pricing:       'Pricing',
  cta:           'Call to Action',
  content:       'Content',
  auth:          'Auth',
  dashboard:     'Dashboard',
  footer:        'Footer',
  'empty-states': 'Empty States',
  banners:       'Banners',
  tables:        'Tables',
  forms:         'Forms',
}

export const SECTION_CATEGORY_ORDER: SectionCategory[] = [
  'navigation', 'hero', 'features', 'social-proof', 'pricing',
  'cta', 'content', 'auth', 'dashboard', 'footer',
  'empty-states', 'banners', 'tables', 'forms',
]

// ─── Section definitions ──────────────────────────────────────────────────────

export const SECTIONS_LIBRARY: SectionDef[] = [

  // ── Navigation ────────────────────────────────────────────────────────────
  {
    id: 'navbar-centered',
    name: 'Centered Navbar',
    category: 'navigation',
    description: 'Logo left, links centred, CTA button right. Sticky on scroll.',
    tags: ['navbar', 'sticky', 'marketing'],
    complexity: 'simple',
  },
  {
    id: 'navbar-saas',
    name: 'SaaS Navbar',
    category: 'navigation',
    description: 'Logo, mega-menu with product tabs, user avatar and notification bell.',
    tags: ['navbar', 'mega-menu', 'app'],
    complexity: 'complex',
  },
  {
    id: 'sidebar-app',
    name: 'App Sidebar',
    category: 'navigation',
    description: 'Collapsible vertical nav with icon + label, active state, and a bottom user card.',
    tags: ['sidebar', 'app', 'dashboard'],
    complexity: 'medium',
  },
  {
    id: 'sidebar-minimal',
    name: 'Icon-only Sidebar',
    category: 'navigation',
    description: 'Compact icon rail with tooltips — ideal for data-dense dashboards.',
    tags: ['sidebar', 'minimal', 'icons'],
    complexity: 'simple',
  },
  {
    id: 'breadcrumbs',
    name: 'Breadcrumb Trail',
    category: 'navigation',
    description: 'Multi-level path trail with separator glyphs and truncation at depth.',
    tags: ['breadcrumbs', 'navigation'],
    complexity: 'simple',
  },
  {
    id: 'tab-bar',
    name: 'Tab Bar',
    category: 'navigation',
    description: 'Horizontal tab switcher with underline active state and optional icon badges.',
    tags: ['tabs', 'filter', 'navigation'],
    complexity: 'simple',
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  {
    id: 'hero-split',
    name: 'Split Hero',
    category: 'hero',
    description: 'Headline and CTA left, product screenshot or illustration right.',
    tags: ['hero', 'split', 'marketing'],
    complexity: 'medium',
  },
  {
    id: 'hero-centered',
    name: 'Centered Hero',
    category: 'hero',
    description: 'Full-width centered headline, subtext, and dual CTA buttons above a product visual.',
    tags: ['hero', 'centered', 'marketing'],
    complexity: 'simple',
  },
  {
    id: 'hero-gradient',
    name: 'Gradient Hero',
    category: 'hero',
    description: 'Bold gradient background with animated blob shapes, eyebrow badge and large headline.',
    tags: ['hero', 'gradient', 'animated'],
    complexity: 'medium',
  },
  {
    id: 'hero-video',
    name: 'Video Hero',
    category: 'hero',
    description: 'Autoplay muted background video with overlay text and a play-button modal trigger.',
    tags: ['hero', 'video', 'fullscreen'],
    complexity: 'medium',
  },
  {
    id: 'hero-app',
    name: 'App Hero',
    category: 'hero',
    description: 'SaaS hero with a live product UI preview inside a browser-chrome frame.',
    tags: ['hero', 'app', 'SaaS'],
    complexity: 'complex',
  },
  {
    id: 'hero-announcement',
    name: 'Announcement Bar + Hero',
    category: 'hero',
    description: 'Sticky top announcement strip above a minimal centered hero section.',
    tags: ['hero', 'announcement', 'marketing'],
    complexity: 'simple',
  },

  // ── Features ──────────────────────────────────────────────────────────────
  {
    id: 'features-grid-3',
    name: 'Feature Grid (3-col)',
    category: 'features',
    description: 'Icon + title + body in a 3-column responsive card grid.',
    tags: ['features', 'grid', 'icons'],
    complexity: 'simple',
  },
  {
    id: 'features-alternating',
    name: 'Alternating Features',
    category: 'features',
    description: 'Full-width alternating image-left / image-right feature rows.',
    tags: ['features', 'alternating', 'detail'],
    complexity: 'medium',
  },
  {
    id: 'features-tabs',
    name: 'Tabbed Features',
    category: 'features',
    description: 'Horizontal tab switcher reveals a screenshot + bullet list per feature.',
    tags: ['features', 'tabs', 'interactive'],
    complexity: 'medium',
  },
  {
    id: 'features-comparison',
    name: 'Feature Comparison',
    category: 'features',
    description: 'Two-column before/after or old/new comparison with check/cross icons.',
    tags: ['features', 'comparison'],
    complexity: 'medium',
  },
  {
    id: 'bento-grid',
    name: 'Bento Grid',
    category: 'features',
    description: 'Asymmetric card grid (bento-box layout) showcasing product capabilities.',
    tags: ['features', 'bento', 'modern'],
    complexity: 'complex',
  },

  // ── Social Proof ──────────────────────────────────────────────────────────
  {
    id: 'testimonials-grid',
    name: 'Testimonials Grid',
    category: 'social-proof',
    description: 'Three-column card grid of user quotes with avatar and role.',
    tags: ['testimonials', 'grid', 'social-proof'],
    complexity: 'simple',
  },
  {
    id: 'testimonials-carousel',
    name: 'Testimonial Carousel',
    category: 'social-proof',
    description: 'Auto-scrolling full-width testimonial slider with pagination dots.',
    tags: ['testimonials', 'carousel', 'social-proof'],
    complexity: 'medium',
  },
  {
    id: 'logos-bar',
    name: 'Logo Bar',
    category: 'social-proof',
    description: 'Scrolling or static strip of trusted customer logos in greyscale.',
    tags: ['logos', 'trust', 'social-proof'],
    complexity: 'simple',
  },
  {
    id: 'stats-strip',
    name: 'Stats Strip',
    category: 'social-proof',
    description: 'Horizontal row of large numeric stats with labels and subtle separators.',
    tags: ['stats', 'numbers', 'social-proof'],
    complexity: 'simple',
  },
  {
    id: 'case-study-card',
    name: 'Case Study Card',
    category: 'social-proof',
    description: 'Before/after metric cards linking to a detailed case study page.',
    tags: ['case-study', 'results', 'social-proof'],
    complexity: 'medium',
  },

  // ── Pricing ───────────────────────────────────────────────────────────────
  {
    id: 'pricing-3-tiers',
    name: 'Three-Tier Pricing',
    category: 'pricing',
    description: 'Starter / Pro / Enterprise cards with feature list and a highlighted "popular" plan.',
    tags: ['pricing', 'tiers', 'SaaS'],
    complexity: 'medium',
  },
  {
    id: 'pricing-toggle',
    name: 'Monthly / Annual Toggle',
    category: 'pricing',
    description: 'Toggle switch that animates between monthly and annual pricing with savings badge.',
    tags: ['pricing', 'toggle', 'billing'],
    complexity: 'medium',
  },
  {
    id: 'pricing-comparison-table',
    name: 'Pricing Comparison Table',
    category: 'pricing',
    description: 'Full-width feature matrix table comparing all tiers row by row.',
    tags: ['pricing', 'table', 'comparison'],
    complexity: 'complex',
  },
  {
    id: 'pricing-enterprise',
    name: 'Enterprise CTA',
    category: 'pricing',
    description: 'Single-row enterprise card with custom pricing CTA and features list.',
    tags: ['pricing', 'enterprise', 'contact'],
    complexity: 'simple',
  },

  // ── CTA ───────────────────────────────────────────────────────────────────
  {
    id: 'cta-centered',
    name: 'Centered CTA',
    category: 'cta',
    description: 'Bold headline, subtext, email input and primary button centered on a coloured background.',
    tags: ['cta', 'email', 'conversion'],
    complexity: 'simple',
  },
  {
    id: 'cta-split',
    name: 'Split CTA',
    category: 'cta',
    description: 'Left-side headline + body text, right-side form or button group.',
    tags: ['cta', 'split', 'conversion'],
    complexity: 'simple',
  },
  {
    id: 'cta-banner',
    name: 'Sticky Bottom Banner',
    category: 'cta',
    description: 'Fixed-bottom bar with offer text and a dismiss button.',
    tags: ['cta', 'banner', 'sticky'],
    complexity: 'simple',
  },
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    category: 'cta',
    description: 'Minimal email-capture section with privacy note and social proof count.',
    tags: ['newsletter', 'email', 'cta'],
    complexity: 'simple',
  },

  // ── Content ───────────────────────────────────────────────────────────────
  {
    id: 'blog-grid',
    name: 'Blog Card Grid',
    category: 'content',
    description: 'Three-column grid of article cards with cover image, tag, title, and read-time.',
    tags: ['blog', 'cards', 'content'],
    complexity: 'medium',
  },
  {
    id: 'article-body',
    name: 'Article Body',
    category: 'content',
    description: 'Markdown-style article body with reading progress bar and table of contents.',
    tags: ['article', 'blog', 'reading'],
    complexity: 'medium',
  },
  {
    id: 'faq-accordion',
    name: 'FAQ Accordion',
    category: 'content',
    description: 'Animated accordion list of question/answer pairs with a search input.',
    tags: ['faq', 'accordion', 'support'],
    complexity: 'medium',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    category: 'content',
    description: 'Vertical event timeline with date stamps, icons, and brief descriptions.',
    tags: ['timeline', 'history', 'about'],
    complexity: 'medium',
  },
  {
    id: 'team-grid',
    name: 'Team Grid',
    category: 'content',
    description: 'Responsive grid of team member cards with photo, name, role, and social links.',
    tags: ['team', 'about', 'people'],
    complexity: 'medium',
  },

  // ── Auth ──────────────────────────────────────────────────────────────────
  {
    id: 'auth-login-card',
    name: 'Login Card',
    category: 'auth',
    description: 'Centered card with email/password fields, "remember me", and social OAuth buttons.',
    tags: ['auth', 'login', 'form'],
    complexity: 'medium',
  },
  {
    id: 'auth-signup-card',
    name: 'Sign-up Card',
    category: 'auth',
    description: 'Multi-field registration card with password strength indicator and TOS checkbox.',
    tags: ['auth', 'signup', 'form'],
    complexity: 'medium',
  },
  {
    id: 'auth-split-panel',
    name: 'Auth Split Panel',
    category: 'auth',
    description: 'Left brand panel with marketing copy, right panel with login/signup form.',
    tags: ['auth', 'split', 'brand'],
    complexity: 'complex',
  },
  {
    id: 'auth-otp',
    name: 'OTP Verification',
    category: 'auth',
    description: '6-digit one-time password input with auto-focus and resend timer.',
    tags: ['auth', 'otp', '2fa'],
    complexity: 'medium',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  {
    id: 'kpi-cards-row',
    name: 'KPI Cards Row',
    category: 'dashboard',
    description: 'Four metric cards with icon, value, delta badge and sparkline.',
    tags: ['dashboard', 'kpi', 'metrics'],
    complexity: 'medium',
  },
  {
    id: 'chart-area',
    name: 'Area Chart Section',
    category: 'dashboard',
    description: 'Full-width area chart with legend, date-range picker, and export button.',
    tags: ['dashboard', 'chart', 'analytics'],
    complexity: 'complex',
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'dashboard',
    description: 'Sortable, paginated table with row selection, search, and column filters.',
    tags: ['table', 'data', 'dashboard'],
    complexity: 'complex',
  },
  {
    id: 'activity-feed',
    name: 'Activity Feed',
    category: 'dashboard',
    description: 'Chronological list of system events with user avatars and relative timestamps.',
    tags: ['activity', 'feed', 'dashboard'],
    complexity: 'medium',
  },
  {
    id: 'dashboard-header',
    name: 'Dashboard Header',
    category: 'dashboard',
    description: 'Page-level header with title, subtitle, date picker, and action buttons.',
    tags: ['dashboard', 'header', 'actions'],
    complexity: 'simple',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  {
    id: 'footer-multi-column',
    name: 'Multi-Column Footer',
    category: 'footer',
    description: 'Four-column links footer with logo, newsletter, and social icons.',
    tags: ['footer', 'links', 'marketing'],
    complexity: 'medium',
  },
  {
    id: 'footer-minimal',
    name: 'Minimal Footer',
    category: 'footer',
    description: 'Single-row footer with copyright, links row, and theme toggle.',
    tags: ['footer', 'minimal'],
    complexity: 'simple',
  },
  {
    id: 'footer-dark',
    name: 'Dark Brand Footer',
    category: 'footer',
    description: 'Full-width dark footer with brand gradient, links, and app store badges.',
    tags: ['footer', 'dark', 'brand'],
    complexity: 'medium',
  },

  // ── Empty States ──────────────────────────────────────────────────────────
  {
    id: 'empty-no-data',
    name: 'No Data',
    category: 'empty-states',
    description: 'Illustration with heading and a primary action button for first-time empty state.',
    tags: ['empty', 'illustration', 'onboarding'],
    complexity: 'simple',
  },
  {
    id: 'empty-search',
    name: 'No Search Results',
    category: 'empty-states',
    description: 'Empty state for zero search results with a clear-search suggestion.',
    tags: ['empty', 'search', 'results'],
    complexity: 'simple',
  },
  {
    id: 'empty-error-500',
    name: 'Server Error',
    category: 'empty-states',
    description: 'Error page with status code, message, retry action and support link.',
    tags: ['error', '500', 'empty'],
    complexity: 'simple',
  },

  // ── Banners ───────────────────────────────────────────────────────────────
  {
    id: 'alert-banner',
    name: 'Alert Banner',
    category: 'banners',
    description: 'Top-of-page alert strip with info/warning/error variants and dismiss button.',
    tags: ['alert', 'banner', 'notification'],
    complexity: 'simple',
  },
  {
    id: 'cookie-consent',
    name: 'Cookie Consent',
    category: 'banners',
    description: 'Bottom-positioned GDPR cookie banner with accept/reject/customise options.',
    tags: ['cookie', 'gdpr', 'legal'],
    complexity: 'simple',
  },
  {
    id: 'upgrade-prompt',
    name: 'Upgrade Prompt',
    category: 'banners',
    description: 'Inline banner prompting free users to upgrade with a plan comparison.',
    tags: ['upgrade', 'upsell', 'billing'],
    complexity: 'medium',
  },

  // ── Tables ────────────────────────────────────────────────────────────────
  {
    id: 'simple-table',
    name: 'Simple Table',
    category: 'tables',
    description: 'Striped table with header row, hover states, and a total row.',
    tags: ['table', 'simple', 'data'],
    complexity: 'simple',
  },
  {
    id: 'transaction-table',
    name: 'Transaction Table',
    category: 'tables',
    description: 'Financial transaction list with status badges, amounts, and row actions.',
    tags: ['table', 'transactions', 'finance'],
    complexity: 'medium',
  },

  // ── Forms ─────────────────────────────────────────────────────────────────
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'forms',
    description: 'Name, email, subject, message textarea, and a CAPTCHA-aware submit button.',
    tags: ['form', 'contact', 'marketing'],
    complexity: 'medium',
  },
  {
    id: 'settings-form',
    name: 'Settings Form',
    category: 'forms',
    description: 'Profile settings form with avatar upload, form groups, and a save state.',
    tags: ['form', 'settings', 'profile'],
    complexity: 'complex',
  },
  {
    id: 'onboarding-stepper',
    name: 'Onboarding Stepper',
    category: 'forms',
    description: 'Multi-step wizard with progress indicator, back/next navigation, and skip option.',
    tags: ['form', 'wizard', 'onboarding'],
    complexity: 'complex',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function filterSections(query?: string | null, category?: string | null) {
  const q = (query || '').toLowerCase().trim()
  return SECTIONS_LIBRARY.filter((s) => {
    const matchCat = !category || s.category === category
    const matchQ   = !q || s.name.toLowerCase().includes(q) ||
                     s.description.toLowerCase().includes(q) ||
                     s.tags.some((t) => t.toLowerCase().includes(q))
    return matchCat && matchQ
  })
}
