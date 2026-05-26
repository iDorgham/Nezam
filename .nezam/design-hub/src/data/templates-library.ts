/**
 * Page templates + full project profiles for the Architecture Templates panel.
 *
 * PageTemplate  — a set of related pages to import into the sitemap.
 * ProjectProfile — a complete project blueprint: nav structure + full sitemap,
 *                  ready to import as an entire project.
 */

// ─── Page templates ───────────────────────────────────────────────────────────

export type TemplateCategory =
  | 'dashboards'
  | 'marketing'
  | 'auth'
  | 'ecommerce'
  | 'app-shells'
  | 'settings'
  | 'docs'
  | 'admin'
  | 'blog'
  | 'social'
  | 'ai-tools'
  | 'onboarding'

export interface PageTemplate {
  id: string
  name: string
  category: TemplateCategory
  description: string
  tags: string[]
  pages: { name: string; route: string; icon?: string }[]
  gradient: string
  accent: string
  icon: string
}

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  dashboards:  'Dashboards',
  marketing:   'Marketing',
  auth:        'Auth',
  ecommerce:   'E-Commerce',
  'app-shells': 'App Shells',
  settings:    'Settings',
  docs:        'Docs',
  admin:       'Admin',
  blog:        'Blog & Content',
  social:      'Social / Community',
  'ai-tools':  'AI Tools',
  onboarding:  'Onboarding',
}

export const TEMPLATE_CATEGORY_ORDER: TemplateCategory[] = [
  'dashboards', 'app-shells', 'marketing', 'ecommerce', 'auth',
  'settings', 'docs', 'admin', 'blog', 'social', 'ai-tools', 'onboarding',
]

export const TEMPLATES: PageTemplate[] = [
  // ── Dashboards ────────────────────────────────────────────────────────────
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    category: 'dashboards',
    description: 'KPI cards, trend charts, segment tables, real-time activity.',
    tags: ['Charts', 'KPI', 'Tables'],
    pages: [
      { name: 'Overview',    route: '/dashboard', icon: 'BarChart3' },
      { name: 'Realtime',    route: '/dashboard/realtime', icon: 'Activity' },
      { name: 'Audiences',   route: '/dashboard/audiences', icon: 'Users' },
      { name: 'Conversions', route: '/dashboard/conversions', icon: 'TrendingUp' },
      { name: 'Reports',     route: '/dashboard/reports', icon: 'FileText' },
    ],
    gradient: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    accent: '#60a5fa',
    icon: 'BarChart3',
  },
  {
    id: 'crm-dashboard',
    name: 'CRM Pipeline',
    category: 'dashboards',
    description: 'Kanban deals, contact list, activity feed, forecast chart.',
    tags: ['Kanban', 'Pipeline', 'Contacts'],
    pages: [
      { name: 'Pipeline',  route: '/crm', icon: 'Kanban' },
      { name: 'Contacts',  route: '/crm/contacts', icon: 'Users' },
      { name: 'Companies', route: '/crm/companies', icon: 'Building2' },
      { name: 'Activity',  route: '/crm/activity', icon: 'Activity' },
      { name: 'Forecast',  route: '/crm/forecast', icon: 'TrendingUp' },
    ],
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
    accent: '#a78bfa',
    icon: 'Users',
  },
  {
    id: 'finance-dashboard',
    name: 'Finance Workspace',
    category: 'dashboards',
    description: 'Revenue, MRR/ARR trend, invoices table, runway timeline.',
    tags: ['Revenue', 'Invoices', 'Runway'],
    pages: [
      { name: 'Revenue',  route: '/finance', icon: 'DollarSign' },
      { name: 'Invoices', route: '/finance/invoices', icon: 'FileText' },
      { name: 'Expenses', route: '/finance/expenses', icon: 'Receipt' },
      { name: 'Runway',   route: '/finance/runway', icon: 'TrendingUp' },
      { name: 'Reports',  route: '/finance/reports', icon: 'BarChart2' },
    ],
    gradient: 'linear-gradient(135deg, #059669 0%, #14b8a6 100%)',
    accent: '#34d399',
    icon: 'TrendingUp',
  },
  {
    id: 'project-dashboard',
    name: 'Project Management',
    category: 'dashboards',
    description: 'Sprint board, Gantt timeline, backlog, team velocity.',
    tags: ['Sprints', 'Gantt', 'Backlog'],
    pages: [
      { name: 'Board',    route: '/projects', icon: 'Kanban' },
      { name: 'Timeline', route: '/projects/timeline', icon: 'CalendarDays' },
      { name: 'Backlog',  route: '/projects/backlog', icon: 'List' },
      { name: 'Members',  route: '/projects/members', icon: 'Users' },
    ],
    gradient: 'linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)',
    accent: '#22d3ee',
    icon: 'Kanban',
  },
  {
    id: 'support-dashboard',
    name: 'Support Desk',
    category: 'dashboards',
    description: 'Ticket queue, SLA tracker, customer chat, KB search.',
    tags: ['Tickets', 'SLA', 'Chat'],
    pages: [
      { name: 'Queue',    route: '/support', icon: 'Inbox' },
      { name: 'Tickets',  route: '/support/tickets', icon: 'MessageSquare' },
      { name: 'Customers',route: '/support/customers', icon: 'Users' },
      { name: 'KB',       route: '/support/kb', icon: 'BookOpen' },
      { name: 'Reports',  route: '/support/reports', icon: 'BarChart2' },
    ],
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    accent: '#fbbf24',
    icon: 'Inbox',
  },
  {
    id: 'devops-dashboard',
    name: 'DevOps Monitor',
    category: 'dashboards',
    description: 'Pipelines, deploy history, infra health, alert logs.',
    tags: ['CI/CD', 'Infra', 'Alerts'],
    pages: [
      { name: 'Pipelines', route: '/devops', icon: 'GitBranch' },
      { name: 'Deployments', route: '/devops/deploys', icon: 'Rocket' },
      { name: 'Infra',      route: '/devops/infra', icon: 'Server' },
      { name: 'Alerts',     route: '/devops/alerts', icon: 'Bell' },
    ],
    gradient: 'linear-gradient(135deg, #1e293b 0%, #0e7490 100%)',
    accent: '#38bdf8',
    icon: 'Server',
  },

  // ── App Shells ────────────────────────────────────────────────────────────
  {
    id: 'saas-app-shell',
    name: 'SaaS App Shell',
    category: 'app-shells',
    description: 'Sidebar nav, top bar, command palette, workspace switcher.',
    tags: ['Sidebar', 'Topbar', 'Search'],
    pages: [
      { name: 'Home',     route: '/', icon: 'Home' },
      { name: 'Inbox',    route: '/inbox', icon: 'Inbox' },
      { name: 'Projects', route: '/projects', icon: 'FolderOpen' },
      { name: 'Settings', route: '/settings', icon: 'Settings' },
    ],
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    accent: '#94a3b8',
    icon: 'LayoutDashboard',
  },
  {
    id: 'editor-shell',
    name: 'Editor Workbench',
    category: 'app-shells',
    description: 'Document editor with left explorer, canvas, right inspector.',
    tags: ['Editor', 'Inspector', 'Tree'],
    pages: [
      { name: 'Editor',  route: '/editor', icon: 'PenTool' },
      { name: 'Library', route: '/library', icon: 'Library' },
      { name: 'Trash',   route: '/trash', icon: 'Trash2' },
    ],
    gradient: 'linear-gradient(135deg, #0f172a 0%, #0e7490 100%)',
    accent: '#22d3ee',
    icon: 'PencilRuler',
  },
  {
    id: 'mobile-app-shell',
    name: 'Mobile App Shell',
    category: 'app-shells',
    description: 'Bottom tab bar, header, drawer menu — mobile-first layout.',
    tags: ['Mobile', 'Tabs', 'Drawer'],
    pages: [
      { name: 'Feed',    route: '/feed', icon: 'Newspaper' },
      { name: 'Explore', route: '/explore', icon: 'Compass' },
      { name: 'Profile', route: '/profile', icon: 'User' },
      { name: 'Notifications', route: '/notifications', icon: 'Bell' },
    ],
    gradient: 'linear-gradient(135deg, #be185d 0%, #f97316 100%)',
    accent: '#fb923c',
    icon: 'Smartphone',
  },

  // ── Marketing ─────────────────────────────────────────────────────────────
  {
    id: 'saas-landing',
    name: 'SaaS Landing',
    category: 'marketing',
    description: 'Hero, social proof, feature grid, pricing, FAQ, footer CTA.',
    tags: ['Hero', 'Pricing', 'FAQ'],
    pages: [
      { name: 'Home',     route: '/', icon: 'Home' },
      { name: 'Pricing',  route: '/pricing', icon: 'DollarSign' },
      { name: 'Features', route: '/features', icon: 'Zap' },
      { name: 'About',    route: '/about', icon: 'Info' },
      { name: 'Contact',  route: '/contact', icon: 'Mail' },
    ],
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    accent: '#a5b4fc',
    icon: 'Rocket',
  },
  {
    id: 'startup-landing',
    name: 'Startup Launch',
    category: 'marketing',
    description: 'Bold hero, animated metrics, founder note, beta waitlist.',
    tags: ['Hero', 'Waitlist', 'Metrics'],
    pages: [
      { name: 'Home',      route: '/', icon: 'Home' },
      { name: 'Manifesto', route: '/manifesto', icon: 'FileText' },
      { name: 'Beta',      route: '/beta', icon: 'Zap' },
    ],
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    accent: '#fbbf24',
    icon: 'Sparkles',
  },
  {
    id: 'agency-portfolio',
    name: 'Agency Portfolio',
    category: 'marketing',
    description: 'Case-study cards, services grid, team page, contact form.',
    tags: ['Case studies', 'Services', 'Team'],
    pages: [
      { name: 'Home',     route: '/', icon: 'Home' },
      { name: 'Work',     route: '/work', icon: 'Briefcase' },
      { name: 'Services', route: '/services', icon: 'Zap' },
      { name: 'Team',     route: '/team', icon: 'Users' },
      { name: 'Contact',  route: '/contact', icon: 'Mail' },
    ],
    gradient: 'linear-gradient(135deg, #be185d 0%, #7c3aed 100%)',
    accent: '#f472b6',
    icon: 'Briefcase',
  },
  {
    id: 'product-hunt-launch',
    name: 'Product Hunt Launch',
    category: 'marketing',
    description: 'Launch countdown, vote widget, maker story, roadmap.',
    tags: ['Launch', 'Votes', 'Roadmap'],
    pages: [
      { name: 'Launch',  route: '/', icon: 'Rocket' },
      { name: 'Roadmap', route: '/roadmap', icon: 'Map' },
      { name: 'Updates', route: '/updates', icon: 'Bell' },
    ],
    gradient: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
    accent: '#fb923c',
    icon: 'Rocket',
  },
  {
    id: 'open-source-site',
    name: 'Open Source Project',
    category: 'marketing',
    description: 'GitHub stats, install snippet, contributors, sponsor wall.',
    tags: ['GitHub', 'Sponsors', 'Docs'],
    pages: [
      { name: 'Home',      route: '/', icon: 'Home' },
      { name: 'Docs',      route: '/docs', icon: 'BookOpen' },
      { name: 'Changelog', route: '/changelog', icon: 'Clock' },
      { name: 'Sponsors',  route: '/sponsors', icon: 'Heart' },
    ],
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    accent: '#94a3b8',
    icon: 'Github',
  },

  // ── E-commerce ────────────────────────────────────────────────────────────
  {
    id: 'shop-storefront',
    name: 'Shop Storefront',
    category: 'ecommerce',
    description: 'Product grid, PDP, cart, checkout, order confirmation.',
    tags: ['Catalog', 'PDP', 'Checkout'],
    pages: [
      { name: 'Shop',          route: '/shop', icon: 'Store' },
      { name: 'Product',       route: '/shop/[slug]', icon: 'Package' },
      { name: 'Cart',          route: '/cart', icon: 'ShoppingCart' },
      { name: 'Checkout',      route: '/checkout', icon: 'CreditCard' },
      { name: 'Order Success', route: '/order/success', icon: 'CheckCircle' },
      { name: 'Account',       route: '/account', icon: 'User' },
    ],
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    accent: '#7dd3fc',
    icon: 'ShoppingBag',
  },
  {
    id: 'b2b-store',
    name: 'B2B Marketplace',
    category: 'ecommerce',
    description: 'Wholesale catalog, quote builder, bulk orders, net-30 billing.',
    tags: ['Wholesale', 'Quotes', 'Bulk'],
    pages: [
      { name: 'Catalog', route: '/catalog', icon: 'Grid' },
      { name: 'Quote',   route: '/quote', icon: 'FileText' },
      { name: 'Orders',  route: '/orders', icon: 'Package' },
      { name: 'Account', route: '/account', icon: 'Building2' },
    ],
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    accent: '#60a5fa',
    icon: 'Package',
  },

  // ── Auth ──────────────────────────────────────────────────────────────────
  {
    id: 'auth-flow',
    name: 'Auth Flow',
    category: 'auth',
    description: 'Sign-in, sign-up, OAuth, forgot password, MFA, magic-link.',
    tags: ['Sign-in', 'OAuth', 'MFA'],
    pages: [
      { name: 'Sign In',         route: '/sign-in', icon: 'LogIn' },
      { name: 'Sign Up',         route: '/sign-up', icon: 'UserPlus' },
      { name: 'Forgot Password', route: '/forgot', icon: 'Key' },
      { name: 'Verify',          route: '/verify', icon: 'ShieldCheck' },
      { name: 'MFA Setup',       route: '/mfa', icon: 'Smartphone' },
    ],
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
    accent: '#38bdf8',
    icon: 'Lock',
  },
  {
    id: 'passkey-auth',
    name: 'Passkey & Social',
    category: 'auth',
    description: 'WebAuthn passkeys, Google / GitHub OAuth, QR code sign-in.',
    tags: ['Passkey', 'OAuth', 'QR'],
    pages: [
      { name: 'Sign In', route: '/sign-in', icon: 'Fingerprint' },
      { name: 'Sign Up', route: '/sign-up', icon: 'UserPlus' },
      { name: 'Verify',  route: '/verify', icon: 'ShieldCheck' },
    ],
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    accent: '#a78bfa',
    icon: 'Fingerprint',
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  {
    id: 'settings-hub',
    name: 'Settings Hub',
    category: 'settings',
    description: 'Profile, billing, team members, integrations, danger zone.',
    tags: ['Profile', 'Billing', 'Team'],
    pages: [
      { name: 'Profile',      route: '/settings/profile', icon: 'User' },
      { name: 'Billing',      route: '/settings/billing', icon: 'CreditCard' },
      { name: 'Team',         route: '/settings/team', icon: 'Users' },
      { name: 'Integrations', route: '/settings/integrations', icon: 'Plug' },
      { name: 'Security',     route: '/settings/security', icon: 'Shield' },
      { name: 'API Keys',     route: '/settings/api-keys', icon: 'Key' },
    ],
    gradient: 'linear-gradient(135deg, #475569 0%, #0f172a 100%)',
    accent: '#cbd5e1',
    icon: 'Settings',
  },

  // ── Docs ──────────────────────────────────────────────────────────────────
  {
    id: 'docs-site',
    name: 'Docs Site',
    category: 'docs',
    description: 'Sidebar nav, content + ToC, search, versioned routes.',
    tags: ['Search', 'ToC', 'Versioned'],
    pages: [
      { name: 'Overview',    route: '/docs', icon: 'BookOpen' },
      { name: 'Quickstart',  route: '/docs/quickstart', icon: 'Zap' },
      { name: 'Guides',      route: '/docs/guides', icon: 'Map' },
      { name: 'API Ref',     route: '/docs/api', icon: 'Code2' },
      { name: 'Changelog',   route: '/docs/changelog', icon: 'Clock' },
      { name: 'SDK',         route: '/docs/sdk', icon: 'Package' },
    ],
    gradient: 'linear-gradient(135deg, #334155 0%, #0e7490 100%)',
    accent: '#67e8f9',
    icon: 'BookOpen',
  },
  {
    id: 'api-reference',
    name: 'API Reference',
    category: 'docs',
    description: 'Interactive endpoint explorer, schema viewer, auth tester.',
    tags: ['REST', 'Schema', 'Playground'],
    pages: [
      { name: 'Overview',     route: '/api', icon: 'BookOpen' },
      { name: 'Authentication', route: '/api/auth', icon: 'Lock' },
      { name: 'Endpoints',    route: '/api/endpoints', icon: 'Code2' },
      { name: 'Webhooks',     route: '/api/webhooks', icon: 'Zap' },
      { name: 'Playground',   route: '/api/playground', icon: 'Play' },
    ],
    gradient: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
    accent: '#34d399',
    icon: 'Code2',
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  {
    id: 'admin-console',
    name: 'Admin Console',
    category: 'admin',
    description: 'Users CRUD, audit log, feature flags, system health.',
    tags: ['CRUD', 'Audit', 'Flags'],
    pages: [
      { name: 'Users',   route: '/admin/users', icon: 'Users' },
      { name: 'Orgs',    route: '/admin/orgs', icon: 'Building2' },
      { name: 'Audit',   route: '/admin/audit', icon: 'ClipboardList' },
      { name: 'Flags',   route: '/admin/flags', icon: 'Flag' },
      { name: 'Health',  route: '/admin/health', icon: 'Activity' },
      { name: 'Billing', route: '/admin/billing', icon: 'DollarSign' },
    ],
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #9333ea 100%)',
    accent: '#fca5a5',
    icon: 'ShieldCheck',
  },

  // ── Blog & Content ────────────────────────────────────────────────────────
  {
    id: 'blog-platform',
    name: 'Blog Platform',
    category: 'blog',
    description: 'Article grid, single post, tags, author profile, newsletter.',
    tags: ['Articles', 'Tags', 'Newsletter'],
    pages: [
      { name: 'Blog',     route: '/blog', icon: 'Newspaper' },
      { name: 'Article',  route: '/blog/[slug]', icon: 'FileText' },
      { name: 'Tag',      route: '/blog/tag/[tag]', icon: 'Tag' },
      { name: 'Author',   route: '/blog/author/[id]', icon: 'User' },
      { name: 'Newsletter', route: '/newsletter', icon: 'Mail' },
    ],
    gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    accent: '#fcd34d',
    icon: 'Newspaper',
  },
  {
    id: 'content-creator',
    name: 'Creator Studio',
    category: 'blog',
    description: 'Post composer, media library, analytics, monetisation.',
    tags: ['Compose', 'Media', 'Monetise'],
    pages: [
      { name: 'Studio',    route: '/studio', icon: 'PenTool' },
      { name: 'Posts',     route: '/studio/posts', icon: 'FileText' },
      { name: 'Media',     route: '/studio/media', icon: 'Image' },
      { name: 'Analytics', route: '/studio/analytics', icon: 'BarChart3' },
      { name: 'Earnings',  route: '/studio/earnings', icon: 'DollarSign' },
    ],
    gradient: 'linear-gradient(135deg, #0369a1 0%, #7c3aed 100%)',
    accent: '#818cf8',
    icon: 'PenTool',
  },

  // ── Social / Community ────────────────────────────────────────────────────
  {
    id: 'community-platform',
    name: 'Community Forum',
    category: 'social',
    description: 'Feed, threads, upvotes, badges, moderation queue.',
    tags: ['Feed', 'Threads', 'Moderation'],
    pages: [
      { name: 'Feed',        route: '/feed', icon: 'Newspaper' },
      { name: 'Explore',     route: '/explore', icon: 'Compass' },
      { name: 'Post',        route: '/post/[id]', icon: 'MessageCircle' },
      { name: 'Profile',     route: '/user/[id]', icon: 'User' },
      { name: 'Moderation',  route: '/mod', icon: 'Shield' },
    ],
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
    accent: '#2dd4bf',
    icon: 'MessageCircle',
  },
  {
    id: 'event-platform',
    name: 'Events Platform',
    category: 'social',
    description: 'Event listing, detail page, ticketing, speaker profiles.',
    tags: ['Events', 'Tickets', 'Speakers'],
    pages: [
      { name: 'Events',   route: '/events', icon: 'CalendarDays' },
      { name: 'Event',    route: '/events/[id]', icon: 'Calendar' },
      { name: 'Tickets',  route: '/tickets', icon: 'Ticket' },
      { name: 'Speakers', route: '/speakers', icon: 'Mic' },
    ],
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    accent: '#c084fc',
    icon: 'CalendarDays',
  },

  // ── AI Tools ──────────────────────────────────────────────────────────────
  {
    id: 'ai-chat-app',
    name: 'AI Chat App',
    category: 'ai-tools',
    description: 'Conversation UI, model selector, history sidebar, prompt editor.',
    tags: ['Chat', 'Models', 'History'],
    pages: [
      { name: 'Chat',     route: '/chat', icon: 'MessageSquare' },
      { name: 'History',  route: '/chat/history', icon: 'Clock' },
      { name: 'Prompts',  route: '/prompts', icon: 'Sparkles' },
      { name: 'Settings', route: '/settings', icon: 'Settings' },
    ],
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    accent: '#a5b4fc',
    icon: 'Bot',
  },
  {
    id: 'ai-image-gen',
    name: 'AI Image Studio',
    category: 'ai-tools',
    description: 'Prompt canvas, model picker, gallery, variations, history.',
    tags: ['Generative', 'Gallery', 'Prompts'],
    pages: [
      { name: 'Studio',   route: '/studio', icon: 'Wand2' },
      { name: 'Gallery',  route: '/gallery', icon: 'Image' },
      { name: 'Explore',  route: '/explore', icon: 'Compass' },
      { name: 'Credits',  route: '/credits', icon: 'Coins' },
    ],
    gradient: 'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
    accent: '#f472b6',
    icon: 'Wand2',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  {
    id: 'saas-onboarding',
    name: 'SaaS Onboarding',
    category: 'onboarding',
    description: 'Welcome wizard, team invite, workspace setup, feature tour.',
    tags: ['Wizard', 'Invite', 'Tour'],
    pages: [
      { name: 'Welcome',   route: '/onboarding', icon: 'PartyPopper' },
      { name: 'Profile',   route: '/onboarding/profile', icon: 'User' },
      { name: 'Team',      route: '/onboarding/team', icon: 'Users' },
      { name: 'Workspace', route: '/onboarding/workspace', icon: 'Layout' },
      { name: 'Done',      route: '/onboarding/done', icon: 'CheckCircle' },
    ],
    gradient: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
    accent: '#34d399',
    icon: 'PartyPopper',
  },
]

export const TEMPLATES_BY_CATEGORY: Record<TemplateCategory, PageTemplate[]> =
  TEMPLATE_CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = TEMPLATES.filter((t) => t.category === cat)
    return acc
  }, {} as Record<TemplateCategory, PageTemplate[]>)

// ─── Project profiles ─────────────────────────────────────────────────────────

export interface ProjectProfile {
  id: string
  name: string
  description: string
  tags: string[]
  gradient: string
  accent: string
  icon: string
  /** Top-nav items (shown in the browser header) */
  navItems: string[]
  /** Sidebar sections, if applicable */
  sidebarSections?: string[]
  /** Full page list — imported as the entire sitemap */
  pages: { name: string; route: string; icon?: string; parentRoute?: string }[]
}

export const PROJECT_PROFILES: ProjectProfile[] = [
  {
    id: 'full-saas',
    name: 'SaaS Platform',
    description: 'Marketing site + auth + full app with dashboard, settings, and docs.',
    tags: ['Marketing', 'Auth', 'Dashboard', 'Settings', 'Docs'],
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
    accent: '#818cf8',
    icon: 'Rocket',
    navItems: ['Product', 'Pricing', 'Docs', 'Blog', 'Sign In'],
    sidebarSections: ['Dashboard', 'Projects', 'Team', 'Settings'],
    pages: [
      { name: 'Home',          route: '/' },
      { name: 'Pricing',       route: '/pricing' },
      { name: 'Features',      route: '/features' },
      { name: 'Blog',          route: '/blog' },
      { name: 'About',         route: '/about' },
      { name: 'Sign In',       route: '/sign-in' },
      { name: 'Sign Up',       route: '/sign-up' },
      { name: 'Forgot',        route: '/forgot' },
      { name: 'Dashboard',     route: '/app' },
      { name: 'Projects',      route: '/app/projects' },
      { name: 'Analytics',     route: '/app/analytics' },
      { name: 'Team',          route: '/app/team' },
      { name: 'Notifications', route: '/app/notifications' },
      { name: 'Profile',       route: '/settings/profile' },
      { name: 'Billing',       route: '/settings/billing' },
      { name: 'Integrations',  route: '/settings/integrations' },
      { name: 'Security',      route: '/settings/security' },
      { name: 'Docs Overview', route: '/docs' },
      { name: 'Quickstart',    route: '/docs/quickstart' },
      { name: 'API Reference', route: '/docs/api' },
    ],
  },
  {
    id: 'ecommerce-full',
    name: 'E-Commerce Store',
    description: 'Storefront, product pages, cart, checkout, account + admin.',
    tags: ['Shop', 'Checkout', 'Account', 'Admin'],
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
    accent: '#34d399',
    icon: 'ShoppingBag',
    navItems: ['Shop', 'Collections', 'About', 'Cart', 'Account'],
    sidebarSections: ['Orders', 'Products', 'Customers', 'Analytics'],
    pages: [
      { name: 'Home',          route: '/' },
      { name: 'Shop',          route: '/shop' },
      { name: 'Collections',   route: '/collections' },
      { name: 'Product',       route: '/shop/[slug]' },
      { name: 'Cart',          route: '/cart' },
      { name: 'Checkout',      route: '/checkout' },
      { name: 'Order Success', route: '/order/success' },
      { name: 'Sign In',       route: '/sign-in' },
      { name: 'Sign Up',       route: '/sign-up' },
      { name: 'Account',       route: '/account' },
      { name: 'Orders',        route: '/account/orders' },
      { name: 'Wishlist',      route: '/account/wishlist' },
      { name: 'Admin Products',route: '/admin/products' },
      { name: 'Admin Orders',  route: '/admin/orders' },
      { name: 'Admin Customers',route: '/admin/customers' },
      { name: 'Admin Analytics',route: '/admin/analytics' },
    ],
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    description: 'Open-source site, full docs, API explorer, dashboard, changelog.',
    tags: ['Open Source', 'Docs', 'API', 'Dashboard'],
    gradient: 'linear-gradient(135deg, #1e293b 0%, #0e7490 100%)',
    accent: '#22d3ee',
    icon: 'Code2',
    navItems: ['Docs', 'API', 'Pricing', 'Blog', 'GitHub', 'Sign In'],
    sidebarSections: ['Getting Started', 'Guides', 'API Reference', 'SDK'],
    pages: [
      { name: 'Home',        route: '/' },
      { name: 'Pricing',     route: '/pricing' },
      { name: 'Changelog',   route: '/changelog' },
      { name: 'Blog',        route: '/blog' },
      { name: 'Sign In',     route: '/sign-in' },
      { name: 'Sign Up',     route: '/sign-up' },
      { name: 'Docs',        route: '/docs' },
      { name: 'Quickstart',  route: '/docs/quickstart' },
      { name: 'Guides',      route: '/docs/guides' },
      { name: 'API Ref',     route: '/docs/api' },
      { name: 'SDK',         route: '/docs/sdk' },
      { name: 'Webhooks',    route: '/docs/webhooks' },
      { name: 'Dashboard',   route: '/app' },
      { name: 'API Keys',    route: '/app/keys' },
      { name: 'Usage',       route: '/app/usage' },
      { name: 'Team',        route: '/app/team' },
      { name: 'Settings',    route: '/app/settings' },
    ],
  },
  {
    id: 'content-platform',
    name: 'Content Platform',
    description: 'Blog, author profiles, newsletter, creator studio, analytics.',
    tags: ['Blog', 'Newsletter', 'Creator', 'Analytics'],
    gradient: 'linear-gradient(135deg, #d97706 0%, #ef4444 100%)',
    accent: '#fbbf24',
    icon: 'Newspaper',
    navItems: ['Read', 'Topics', 'Newsletters', 'Write', 'Sign In'],
    sidebarSections: ['My Posts', 'Drafts', 'Analytics', 'Earnings'],
    pages: [
      { name: 'Home',      route: '/' },
      { name: 'Explore',   route: '/explore' },
      { name: 'Topics',    route: '/topics' },
      { name: 'Post',      route: '/post/[slug]' },
      { name: 'Author',    route: '/author/[id]' },
      { name: 'Newsletter',route: '/newsletter' },
      { name: 'Sign In',   route: '/sign-in' },
      { name: 'Sign Up',   route: '/sign-up' },
      { name: 'Studio',    route: '/studio' },
      { name: 'Posts',     route: '/studio/posts' },
      { name: 'New Post',  route: '/studio/new' },
      { name: 'Media',     route: '/studio/media' },
      { name: 'Analytics', route: '/studio/analytics' },
      { name: 'Earnings',  route: '/studio/earnings' },
      { name: 'Settings',  route: '/studio/settings' },
    ],
  },
  {
    id: 'ai-product',
    name: 'AI Product',
    description: 'AI-powered app: chat, tools, usage dashboard, billing.',
    tags: ['AI', 'Chat', 'Tools', 'Billing'],
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    accent: '#c084fc',
    icon: 'Bot',
    navItems: ['Features', 'Pricing', 'Docs', 'API', 'Sign In'],
    sidebarSections: ['Chat', 'Tools', 'History', 'Settings'],
    pages: [
      { name: 'Home',      route: '/' },
      { name: 'Features',  route: '/features' },
      { name: 'Pricing',   route: '/pricing' },
      { name: 'Sign In',   route: '/sign-in' },
      { name: 'Sign Up',   route: '/sign-up' },
      { name: 'Chat',      route: '/app/chat' },
      { name: 'Explore',   route: '/app/explore' },
      { name: 'History',   route: '/app/history' },
      { name: 'Prompts',   route: '/app/prompts' },
      { name: 'Usage',     route: '/app/usage' },
      { name: 'Billing',   route: '/app/billing' },
      { name: 'API Keys',  route: '/app/keys' },
      { name: 'Settings',  route: '/app/settings' },
      { name: 'Docs',      route: '/docs' },
      { name: 'API Ref',   route: '/docs/api' },
    ],
  },
  {
    id: 'b2b-saas',
    name: 'B2B SaaS',
    description: 'Enterprise site, onboarding wizard, team workspace, admin panel.',
    tags: ['Enterprise', 'Onboarding', 'Admin', 'Workspace'],
    gradient: 'linear-gradient(135deg, #0369a1 0%, #1e3a8a 100%)',
    accent: '#60a5fa',
    icon: 'Building2',
    navItems: ['Solutions', 'Pricing', 'Customers', 'Docs', 'Contact Sales'],
    sidebarSections: ['Overview', 'Projects', 'Reports', 'Admin'],
    pages: [
      { name: 'Home',       route: '/' },
      { name: 'Solutions',  route: '/solutions' },
      { name: 'Pricing',    route: '/pricing' },
      { name: 'Customers',  route: '/customers' },
      { name: 'Security',   route: '/security' },
      { name: 'Contact',    route: '/contact' },
      { name: 'Sign In',    route: '/sign-in' },
      { name: 'Sign Up',    route: '/sign-up' },
      { name: 'Onboarding', route: '/onboarding' },
      { name: 'Workspace',  route: '/app' },
      { name: 'Projects',   route: '/app/projects' },
      { name: 'Reports',    route: '/app/reports' },
      { name: 'Team',       route: '/app/team' },
      { name: 'Roles',      route: '/app/roles' },
      { name: 'Profile',    route: '/settings/profile' },
      { name: 'Billing',    route: '/settings/billing' },
      { name: 'Security',   route: '/settings/security' },
      { name: 'Admin Users',route: '/admin/users' },
      { name: 'Admin Orgs', route: '/admin/orgs' },
      { name: 'Audit Log',  route: '/admin/audit' },
    ],
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Two-sided marketplace: buyer browse, seller dashboard, payments.',
    tags: ['Listings', 'Seller', 'Payments'],
    gradient: 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)',
    accent: '#34d399',
    icon: 'Store',
    navItems: ['Browse', 'Sell', 'How it Works', 'Pricing', 'Sign In'],
    sidebarSections: ['Listings', 'Orders', 'Messages', 'Analytics'],
    pages: [
      { name: 'Home',        route: '/' },
      { name: 'Browse',      route: '/browse' },
      { name: 'Category',    route: '/browse/[cat]' },
      { name: 'Listing',     route: '/listing/[id]' },
      { name: 'How it Works',route: '/how-it-works' },
      { name: 'Sign In',     route: '/sign-in' },
      { name: 'Sign Up',     route: '/sign-up' },
      { name: 'Buyer Orders',route: '/orders' },
      { name: 'Messages',    route: '/messages' },
      { name: 'Profile',     route: '/profile/[id]' },
      { name: 'Seller Dashboard', route: '/sell' },
      { name: 'Seller Listings',  route: '/sell/listings' },
      { name: 'Seller Orders',    route: '/sell/orders' },
      { name: 'Seller Analytics', route: '/sell/analytics' },
      { name: 'Seller Payouts',   route: '/sell/payouts' },
    ],
  },
  {
    id: 'community-app',
    name: 'Community App',
    description: 'Discourse-style forum with events, directory, newsletters.',
    tags: ['Forum', 'Events', 'Directory'],
    gradient: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
    accent: '#38bdf8',
    icon: 'Users',
    navItems: ['Feed', 'Explore', 'Events', 'Members', 'Sign In'],
    sidebarSections: ['Hot', 'New', 'Top', 'My Posts'],
    pages: [
      { name: 'Home',      route: '/' },
      { name: 'Feed',      route: '/feed' },
      { name: 'Explore',   route: '/explore' },
      { name: 'Post',      route: '/post/[id]' },
      { name: 'Events',    route: '/events' },
      { name: 'Event',     route: '/events/[id]' },
      { name: 'Members',   route: '/members' },
      { name: 'Profile',   route: '/user/[id]' },
      { name: 'Sign In',   route: '/sign-in' },
      { name: 'Sign Up',   route: '/sign-up' },
      { name: 'My Posts',  route: '/my/posts' },
      { name: 'Bookmarks', route: '/my/bookmarks' },
      { name: 'Settings',  route: '/settings' },
      { name: 'Mod Queue', route: '/mod' },
    ],
  },
]
