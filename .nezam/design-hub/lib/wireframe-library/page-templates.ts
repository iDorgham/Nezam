// ─────────────────────────────────────────────────────────────────────────────
// NEZAM Wireframe Library — Page Templates
// Pre-built block sequences for common page types
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateSlot {
  blockId: string
  variantId: string
  label: string
}

export interface PageTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: 'marketing' | 'content' | 'ecommerce' | 'app' | 'personal'
  tags: string[]
  slots: TemplateSlot[]
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  // ── MARKETING ──────────────────────────────────────────────────────────────

  {
    id: 'tpl-landing',
    name: 'Landing Page',
    description: 'Classic conversion-optimized landing page',
    icon: '🚀',
    category: 'marketing',
    tags: ['landing', 'conversion', 'product', 'marketing'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links-cta', label: 'Navbar' },
      { blockId: 'hero-centered', variantId: 'with-badge', label: 'Hero' },
      { blockId: 'content-logos', variantId: 'with-heading', label: 'Trusted By' },
      { blockId: 'content-features', variantId: 'grid-3', label: 'Features' },
      { blockId: 'content-stats', variantId: 'cards', label: 'Stats' },
      { blockId: 'content-testimonials', variantId: 'grid', label: 'Testimonials' },
      { blockId: 'content-cta', variantId: 'centered', label: 'CTA Section' },
      { blockId: 'nav-footer', variantId: 'columns', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-saas',
    name: 'SaaS Homepage',
    description: 'SaaS product homepage with social proof and pricing',
    icon: '⚡',
    category: 'marketing',
    tags: ['saas', 'software', 'product', 'pricing'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links-cta', label: 'Navbar' },
      { blockId: 'hero-saas', variantId: 'dashboard-preview', label: 'Hero' },
      { blockId: 'content-logos', variantId: 'marquee', label: 'Clients Marquee' },
      { blockId: 'content-features', variantId: 'bento', label: 'Features Bento' },
      { blockId: 'content-features', variantId: 'alternating', label: 'Feature Deep-dives' },
      { blockId: 'content-testimonials', variantId: 'masonry', label: 'Testimonials' },
      { blockId: 'content-pricing', variantId: 'cards-3', label: 'Pricing' },
      { blockId: 'content-faq', variantId: 'accordion', label: 'FAQ' },
      { blockId: 'content-cta', variantId: 'gradient', label: 'Final CTA' },
      { blockId: 'nav-footer', variantId: 'columns', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-startup',
    name: 'Startup / Product',
    description: 'Modern startup homepage',
    icon: '🌟',
    category: 'marketing',
    tags: ['startup', 'product', 'homepage'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'announcement', label: 'Announcement + Nav' },
      { blockId: 'hero-split', variantId: 'text-left', label: 'Hero Split' },
      { blockId: 'content-about', variantId: 'split-stats', label: 'About + Stats' },
      { blockId: 'content-features', variantId: 'grid-4', label: 'Features Grid' },
      { blockId: 'content-timeline', variantId: 'horizontal', label: 'How It Works' },
      { blockId: 'content-testimonials', variantId: 'carousel', label: 'Reviews' },
      { blockId: 'content-cta', variantId: 'dark', label: 'CTA' },
      { blockId: 'nav-footer', variantId: 'dark', label: 'Dark Footer' },
    ],
  },
  {
    id: 'tpl-pricing',
    name: 'Pricing Page',
    description: 'Standalone pricing page with comparison table',
    icon: '💰',
    category: 'marketing',
    tags: ['pricing', 'plans', 'subscription'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links-cta', label: 'Navbar' },
      { blockId: 'layout-page-header', variantId: 'with-description', label: 'Page Header' },
      { blockId: 'content-pricing', variantId: 'cards-3', label: 'Pricing Cards' },
      { blockId: 'content-pricing', variantId: 'table', label: 'Feature Comparison' },
      { blockId: 'content-testimonials', variantId: 'logo-wall', label: 'Social Proof' },
      { blockId: 'content-faq', variantId: 'two-col', label: 'Pricing FAQ' },
      { blockId: 'content-cta', variantId: 'centered', label: 'Get Started CTA' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-onepage',
    name: 'One-Page Website',
    description: 'Full one-page scrolling site (portfolio / agency / startup)',
    icon: '📜',
    category: 'marketing',
    tags: ['one-page', 'single page', 'scroll', 'portfolio', 'agency'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'sticky', label: 'Sticky Navbar' },
      { blockId: 'hero-centered', variantId: 'fullscreen', label: 'Hero' },
      { blockId: 'content-about', variantId: 'text-image', label: 'About' },
      { blockId: 'content-features', variantId: 'grid-3', label: 'Services' },
      { blockId: 'grid-gallery', variantId: 'uniform', label: 'Portfolio Gallery' },
      { blockId: 'content-stats', variantId: 'dark-bg', label: 'Stats' },
      { blockId: 'content-testimonials', variantId: 'carousel', label: 'Testimonials' },
      { blockId: 'team-grid', variantId: '3-col', label: 'Team' },
      { blockId: 'form-contact', variantId: 'simple', label: 'Contact' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Footer' },
    ],
  },

  // ── CONTENT ────────────────────────────────────────────────────────────────

  {
    id: 'tpl-blog-index',
    name: 'Blog Index',
    description: 'Blog listing page with sidebar and categories',
    icon: '📝',
    category: 'content',
    tags: ['blog', 'index', 'articles', 'news'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links', label: 'Navbar' },
      { blockId: 'hero-blog', variantId: 'category-header', label: 'Blog Header' },
      { blockId: 'nav-tabs', variantId: 'pill', label: 'Category Tabs' },
      { blockId: 'blog-index', variantId: 'magazine', label: 'Featured + Grid' },
      { blockId: 'nav-pagination', variantId: 'numbered', label: 'Pagination' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-blog-post',
    name: 'Blog Post',
    description: 'Full blog post article page',
    icon: '📄',
    category: 'content',
    tags: ['blog', 'article', 'post', 'reading'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links', label: 'Navbar' },
      { blockId: 'hero-blog', variantId: 'article-header', label: 'Article Header' },
      { blockId: 'blog-post', variantId: 'with-toc', label: 'Article Content + TOC' },
      { blockId: 'blog-author-bio', variantId: 'card', label: 'Author Bio' },
      { blockId: 'blog-related', variantId: '3-col', label: 'Related Posts' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-project',
    name: 'Project / Case Study',
    description: 'Project showcase and case study page',
    icon: '🎨',
    category: 'content',
    tags: ['project', 'case study', 'portfolio', 'showcase'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links', label: 'Navbar' },
      { blockId: 'hero-portfolio', variantId: 'with-photo', label: 'Project Hero' },
      { blockId: 'content-about', variantId: 'text-image', label: 'Project Overview' },
      { blockId: 'content-stats', variantId: 'row', label: 'Project Stats' },
      { blockId: 'grid-gallery', variantId: 'collage', label: 'Project Gallery' },
      { blockId: 'content-timeline', variantId: 'vertical', label: 'Process Timeline' },
      { blockId: 'content-testimonials', variantId: 'single', label: 'Client Quote' },
      { blockId: 'content-cta', variantId: 'split', label: 'Next Project CTA' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Footer' },
    ],
  },

  // ── PERSONAL ───────────────────────────────────────────────────────────────

  {
    id: 'tpl-portfolio',
    name: 'Portfolio',
    description: 'Personal portfolio / creative portfolio',
    icon: '🖼️',
    category: 'personal',
    tags: ['portfolio', 'personal', 'creative', 'work'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links', label: 'Navbar' },
      { blockId: 'hero-portfolio', variantId: 'with-photo', label: 'Intro Hero' },
      { blockId: 'content-logos', variantId: 'row', label: 'Skills / Tools' },
      { blockId: 'grid-gallery', variantId: 'collage', label: 'Work Gallery' },
      { blockId: 'content-about', variantId: 'text-image', label: 'About Me' },
      { blockId: 'content-testimonials', variantId: 'grid', label: 'Testimonials' },
      { blockId: 'form-contact', variantId: 'simple', label: 'Contact' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-team',
    name: 'Team Page',
    description: 'Company team and people page',
    icon: '👥',
    category: 'personal',
    tags: ['team', 'people', 'about', 'company'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links', label: 'Navbar' },
      { blockId: 'layout-page-header', variantId: 'with-description', label: 'Page Header' },
      { blockId: 'team-grid', variantId: 'founders', label: 'Leadership' },
      { blockId: 'el-divider', variantId: 'section-gap', label: 'Divider' },
      { blockId: 'team-grid', variantId: '4-col', label: 'Full Team Grid' },
      { blockId: 'content-about', variantId: 'split-stats', label: 'Company Values' },
      { blockId: 'content-cta', variantId: 'centered', label: 'Join Us CTA' },
      { blockId: 'nav-footer', variantId: 'columns', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-about',
    name: 'About Page',
    description: 'Company about / our story page',
    icon: '🏢',
    category: 'personal',
    tags: ['about', 'company', 'story', 'mission'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links', label: 'Navbar' },
      { blockId: 'hero-centered', variantId: 'minimal', label: 'About Hero' },
      { blockId: 'content-about', variantId: 'timeline', label: 'Our Story' },
      { blockId: 'content-stats', variantId: 'row', label: 'Company Stats' },
      { blockId: 'content-logos', variantId: 'grid', label: 'Partners' },
      { blockId: 'team-grid', variantId: '3-col', label: 'Team' },
      { blockId: 'content-cta', variantId: 'with-image', label: 'Contact CTA' },
      { blockId: 'nav-footer', variantId: 'columns', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-contact',
    name: 'Contact Page',
    description: 'Contact page with map and form',
    icon: '📬',
    category: 'personal',
    tags: ['contact', 'form', 'map', 'location'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links', label: 'Navbar' },
      { blockId: 'layout-page-header', variantId: 'with-description', label: 'Page Header' },
      { blockId: 'form-contact', variantId: 'with-map', label: 'Contact Form + Map' },
      { blockId: 'content-faq', variantId: 'two-col', label: 'FAQ' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Footer' },
    ],
  },

  // ── E-COMMERCE ─────────────────────────────────────────────────────────────

  {
    id: 'tpl-ecommerce-home',
    name: 'Shop Homepage',
    description: 'E-commerce store homepage',
    icon: '🛍️',
    category: 'ecommerce',
    tags: ['ecommerce', 'shop', 'store', 'homepage'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'with-search', label: 'Shop Navbar' },
      { blockId: 'hero-split', variantId: 'mockup', label: 'Promo Hero' },
      { blockId: 'grid-standard', variantId: '4-col', label: 'Category Grid' },
      { blockId: 'grid-standard', variantId: '4-col', label: 'Featured Products' },
      { blockId: 'content-testimonials', variantId: 'carousel', label: 'Reviews' },
      { blockId: 'form-newsletter', variantId: 'banner', label: 'Newsletter' },
      { blockId: 'nav-footer', variantId: 'columns', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-product-detail',
    name: 'Product Detail Page',
    description: 'Single product detail page',
    icon: '📦',
    category: 'ecommerce',
    tags: ['product', 'pdp', 'detail', 'ecommerce'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'with-search', label: 'Navbar' },
      { blockId: 'nav-breadcrumb', variantId: 'default', label: 'Breadcrumb' },
      { blockId: 'commerce-product-detail', variantId: 'standard', label: 'Product Detail' },
      { blockId: 'data-table', variantId: 'simple', label: 'Specifications' },
      { blockId: 'content-testimonials', variantId: 'grid', label: 'Reviews' },
      { blockId: 'grid-standard', variantId: '4-col', label: 'Related Products' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Footer' },
    ],
  },
  {
    id: 'tpl-checkout',
    name: 'Checkout Page',
    description: 'Multi-step checkout flow',
    icon: '💳',
    category: 'ecommerce',
    tags: ['checkout', 'payment', 'cart', 'order'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links', label: 'Minimal Nav' },
      { blockId: 'nav-breadcrumb', variantId: 'default', label: 'Checkout Steps' },
      { blockId: 'form-checkout', variantId: 'with-summary', label: 'Checkout Form' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Minimal Footer' },
    ],
  },

  // ── APP ────────────────────────────────────────────────────────────────────

  {
    id: 'tpl-auth',
    name: 'Auth Pages',
    description: 'Login / register / forgot password',
    icon: '🔐',
    category: 'app',
    tags: ['auth', 'login', 'register', 'sign in'],
    slots: [
      { blockId: 'form-auth', variantId: 'split', label: 'Login Page' },
    ],
  },
  {
    id: 'tpl-dashboard',
    name: 'App Dashboard',
    description: 'Admin panel / SaaS dashboard',
    icon: '📊',
    category: 'app',
    tags: ['dashboard', 'admin', 'app', 'analytics'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'sticky', label: 'App Topbar' },
      { blockId: 'layout-dashboard', variantId: 'stats-top', label: 'Stats Overview' },
      { blockId: 'data-chart', variantId: 'line', label: 'Revenue Chart' },
      { blockId: 'data-table', variantId: 'with-actions', label: 'Recent Activity Table' },
    ],
  },
  {
    id: 'tpl-coming-soon',
    name: 'Coming Soon',
    description: 'Coming soon / launch countdown page',
    icon: '⏳',
    category: 'marketing',
    tags: ['coming soon', 'countdown', 'launch', 'waitlist'],
    slots: [
      { blockId: 'hero-centered', variantId: 'fullscreen', label: 'Coming Soon Hero' },
      { blockId: 'form-newsletter', variantId: 'centered', label: 'Waitlist Form' },
    ],
  },
  {
    id: 'tpl-404',
    name: '404 Not Found',
    description: 'Error 404 page',
    icon: '🔍',
    category: 'app',
    tags: ['404', 'error', 'not found'],
    slots: [
      { blockId: 'nav-topbar', variantId: 'logo-links', label: 'Navbar' },
      { blockId: 'feedback-empty', variantId: '404', label: '404 State' },
      { blockId: 'nav-footer', variantId: 'minimal', label: 'Footer' },
    ],
  },
]

export const TEMPLATE_CATEGORIES = [
  { id: 'marketing', label: 'Marketing', icon: '📣' },
  { id: 'content', label: 'Content', icon: '📝' },
  { id: 'ecommerce', label: 'E-Commerce', icon: '🛍️' },
  { id: 'app', label: 'App / SaaS', icon: '📊' },
  { id: 'personal', label: 'Personal', icon: '👤' },
] as const
