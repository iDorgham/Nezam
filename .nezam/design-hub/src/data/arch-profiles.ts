import { uid } from '@/lib/utils'
import type { ArchPage, ArchProfile } from '@/types/arch'

function p(
  name: string,
  route: string,
  parentId: string | null,
  order: number,
  navSlot: ArchPage['navSlot'] = 'sidebar',
  type: ArchPage['type'] = 'page',
  icon = 'FileText',
  description = '',
): ArchPage {
  return { id: uid('pg'), name, route, parentId, order, type, navSlot, icon, description }
}

// ─── CMS ────────────────────────────────────────────────────────────────────

function buildCmsProfile(): ArchProfile {
  const home    = p('Home',          '/',                  null, 0, 'topnav',  'page',  'Home',            'Landing page')
  const about   = p('About',         '/about',             null, 1, 'topnav',  'page',  'Info',            'Company info')
  const pricing = p('Pricing',       '/pricing',           null, 2, 'topnav',  'page',  'DollarSign',      'Plans & pricing')
  const contact = p('Contact',       '/contact',           null, 3, 'topnav',  'page',  'Mail',            'Contact form')
  const login   = p('Login',         '/login',             null, 4, 'hidden',  'page',  'Key',             'Sign in')
  const signup  = p('Sign Up',       '/signup',            null, 5, 'hidden',  'page',  'UserPlus',        'Create account')
  const dash    = p('Dashboard',     '/dashboard',         null, 6, 'sidebar', 'group', 'LayoutDashboard', 'CMS dashboard root')
  const content = p('Content',       '/dashboard/content', dash.id, 0, 'sidebar', 'page', 'FileEdit',   'Manage content')
  const pages   = p('Pages',         '/dashboard/pages',   dash.id, 1, 'sidebar', 'page', 'FileText',   'Manage site pages')
  const media   = p('Media',         '/dashboard/media',   dash.id, 2, 'sidebar', 'page', 'Image',      'Media library')
  const users   = p('Users',         '/dashboard/users',   dash.id, 3, 'sidebar', 'page', 'Users',      'User management')
  const settings= p('Settings',      '/dashboard/settings',dash.id, 4, 'sidebar', 'page', 'Settings',   'App settings')

  return {
    id: 'cms',
    name: 'CMS',
    description: 'Content management system with marketing site + admin dashboard',
    icon: 'LayoutGrid',
    pages: [home, about, pricing, contact, login, signup, dash, content, pages, media, users, settings],
  }
}

// ─── SaaS ─────────────────────────────────────────────────────────────────────

function buildSaasProfile(): ArchProfile {
  const home     = p('Home',          '/',                       null,        0, 'topnav',  'page',  'Home',            'Marketing homepage')
  const features = p('Features',      '/features',               null,        1, 'topnav',  'page',  'Zap',             'Product features')
  const pricing  = p('Pricing',       '/pricing',                null,        2, 'topnav',  'page',  'DollarSign',      'Pricing plans')
  const blog     = p('Blog',          '/blog',                   null,        3, 'topnav',  'page',  'BookOpen',        'Company blog')
  const contact  = p('Contact',       '/contact',                null,        4, 'footer',  'page',  'Mail',            'Contact')
  const login    = p('Login',         '/login',                  null,        5, 'hidden',  'page',  'Key',             'Sign in')
  const signup   = p('Sign Up',       '/signup',                 null,        6, 'hidden',  'page',  'UserPlus',        'Create account')
  const forgot   = p('Forgot Pwd',    '/forgot',                 null,        7, 'hidden',  'page',  'Unlock',          'Reset password')
  const app      = p('App',           '/app',                    null,        8, 'sidebar', 'group', 'LayoutDashboard', 'SaaS app root')
  const overview = p('Overview',      '/app',                    app.id,      0, 'sidebar', 'page',  'BarChart2',       'Dashboard overview')
  const projects = p('Projects',      '/app/projects',           app.id,      1, 'sidebar', 'page',  'FolderOpen',      'All projects')
  const team     = p('Team',          '/app/team',               app.id,      2, 'sidebar', 'page',  'Users',           'Team members')
  const billing  = p('Billing',       '/app/billing',            app.id,      3, 'sidebar', 'page',  'CreditCard',      'Subscription & billing')
  const settings = p('Settings',      '/app/settings',           app.id,      4, 'sidebar', 'group', 'Settings',        'App settings')
  const profile  = p('Profile',       '/app/settings/profile',   settings.id, 0, 'sidebar', 'page',  'User',            'Profile settings')
  const security = p('Security',      '/app/settings/security',  settings.id, 1, 'sidebar', 'page',  'Lock',            'Security settings')
  const notifs   = p('Notifications', '/app/settings/notifications', settings.id, 2, 'sidebar', 'page', 'Bell',          'Notification prefs')

  return {
    id: 'saas',
    name: 'SaaS',
    description: 'Software-as-a-service with marketing site, auth flow, and app dashboard',
    icon: 'Zap',
    pages: [home, features, pricing, blog, contact, login, signup, forgot, app, overview, projects, team, billing, settings, profile, security, notifs],
  }
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

function buildBlogProfile(): ArchProfile {
  const home   = p('Home',       '/',             null,     0, 'topnav',  'page',  'Home',     'Blog homepage')
  const blog   = p('Blog',       '/blog',         null,     1, 'topnav',  'page',  'BookOpen', 'All posts')
  const post   = p('[slug]',     '/blog/[slug]',  blog.id,  0, 'hidden',  'page',  'FileText', 'Individual post')
  const about  = p('About',      '/about',        null,     2, 'topnav',  'page',  'Info',     'About the author')
  const newsl  = p('Newsletter', '/newsletter',   null,     3, 'topnav',  'page',  'Mail',     'Newsletter signup')
  const tags   = p('Tags',       '/tags',         null,     4, 'topnav',  'page',  'Tag',      'Browse by tag')
  const tag    = p('[tag]',      '/tags/[tag]',   tags.id,  0, 'hidden',  'page',  'FileText', 'Tag page')
  const admin  = p('Admin',      '/admin',        null,     5, 'sidebar', 'group', 'Wrench',   'Blog admin')
  const posts  = p('Posts',      '/admin/posts',  admin.id, 0, 'sidebar', 'page',  'FileEdit', 'Manage posts')
  const cats   = p('Categories', '/admin/categories', admin.id, 1, 'sidebar', 'page', 'FolderOpen', 'Post categories')
  const media  = p('Media',      '/admin/media',  admin.id, 2, 'sidebar', 'page',  'Image',    'Media library')
  const admSet = p('Settings',   '/admin/settings', admin.id, 3, 'sidebar', 'page', 'Settings', 'Blog settings')

  return {
    id: 'blog',
    name: 'Blog',
    description: 'Content blog with reader-facing site and editor admin panel',
    icon: 'BookOpen',
    pages: [home, blog, post, about, newsl, tags, tag, admin, posts, cats, media, admSet],
  }
}

// ─── Task Manager ────────────────────────────────────────────────────────────

function buildTaskManagerProfile(): ArchProfile {
  const home     = p('Home',         '/',                         null,          0, 'topnav',  'page',  'Home',            'Marketing homepage')
  const pricing  = p('Pricing',      '/pricing',                  null,          1, 'topnav',  'page',  'DollarSign',      'Plans')
  const login    = p('Login',        '/login',                    null,          2, 'hidden',  'page',  'Key',             'Sign in')
  const signup   = p('Sign Up',      '/signup',                   null,          3, 'hidden',  'page',  'UserPlus',        'Register')
  const app      = p('App',          '/app',                      null,          4, 'sidebar', 'group', 'LayoutDashboard', 'App root')
  const myTasks  = p('My Tasks',     '/app/tasks',                app.id,        0, 'sidebar', 'page',  'CheckSquare',     'Personal task list')
  const inbox    = p('Inbox',        '/app/inbox',                app.id,        1, 'sidebar', 'page',  'Inbox',           'Notifications inbox')
  const projects = p('Projects',     '/app/projects',             app.id,        2, 'sidebar', 'group', 'FolderOpen',      'All projects')
  const project  = p('[project]',    '/app/projects/[id]',        projects.id,   0, 'hidden',  'page',  'ClipboardList',   'Project detail')
  const calendar = p('Calendar',     '/app/calendar',             app.id,        3, 'sidebar', 'page',  'Calendar',        'Calendar view')
  const team     = p('Team',         '/app/team',                 app.id,        4, 'sidebar', 'page',  'Users',           'Team overview')
  const reports  = p('Reports',      '/app/reports',              app.id,        5, 'sidebar', 'page',  'BarChart2',       'Productivity reports')
  const settings = p('Settings',     '/app/settings',             app.id,        6, 'sidebar', 'group', 'Settings',        'Settings')
  const profile  = p('Profile',      '/app/settings/profile',     settings.id,   0, 'sidebar', 'page',  'User',            'Profile')
  const workspace= p('Workspace',    '/app/settings/workspace',   settings.id,   1, 'sidebar', 'page',  'Building2',       'Workspace')
  const integr   = p('Integrations', '/app/settings/integrations',settings.id,   2, 'sidebar', 'page',  'Plug',            'Integrations')

  return {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Productivity app with personal tasks, projects, team, and reporting',
    icon: 'CheckSquare',
    pages: [home, pricing, login, signup, app, myTasks, inbox, projects, project, calendar, team, reports, settings, profile, workspace, integr],
  }
}

// ─── E-Commerce ──────────────────────────────────────────────────────────────

function buildEcommerceProfile(): ArchProfile {
  const home    = p('Home',          '/',                        null,       0, 'topnav',  'page',  'Home',        'Store homepage')
  const prods   = p('Products',      '/products',                null,       1, 'topnav',  'page',  'ShoppingBag', 'Product catalog')
  const catPage = p('[category]',    '/products/[category]',     prods.id,   0, 'hidden',  'page',  'Tag',         'Category listing')
  const prodDet = p('[slug]',        '/products/[cat]/[slug]',   catPage.id, 0, 'hidden',  'page',  'Package',     'Product detail')
  const cart    = p('Cart',          '/cart',                    null,       2, 'hidden',  'page',  'ShoppingCart','Shopping cart')
  const checkout= p('Checkout',      '/checkout',                null,       3, 'hidden',  'group', 'CreditCard',  'Checkout flow')
  const success = p('Order Confirm', '/checkout/success',        checkout.id,0, 'hidden',  'page',  'CheckCircle', 'Order confirmation')
  const account = p('Account',       '/account',                 null,       4, 'sidebar', 'group', 'User',        'Customer account')
  const orders  = p('Orders',        '/account/orders',          account.id, 0, 'sidebar', 'page',  'ClipboardList','Order history')
  const wishlist= p('Wishlist',      '/account/wishlist',        account.id, 1, 'sidebar', 'page',  'Heart',       'Saved items')
  const acctProf= p('Profile',       '/account/profile',         account.id, 2, 'sidebar', 'page',  'Settings',    'Account settings')
  const login   = p('Login',         '/login',                   null,       5, 'hidden',  'page',  'Key',         'Sign in')
  const signup  = p('Sign Up',       '/signup',                  null,       6, 'hidden',  'page',  'UserPlus',    'Create account')

  return {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Online store with product catalog, cart, checkout, and account area',
    icon: 'ShoppingBag',
    pages: [home, prods, catPage, prodDet, cart, checkout, success, account, orders, wishlist, acctProf, login, signup],
  }
}

// ─── Mobile App ──────────────────────────────────────────────────────────────

function buildMobileAppProfile(): ArchProfile {
  const onboarding = p('Onboarding',  '/onboarding',              null,          0, 'hidden',  'group', 'Sparkles',  'Onboarding flow')
  const welcome    = p('Welcome',     '/onboarding/welcome',      onboarding.id, 0, 'hidden',  'page',  'Home',      'Welcome screen')
  const feat       = p('Features',    '/onboarding/features',     onboarding.id, 1, 'hidden',  'page',  'Zap',       'Feature highlights')
  const perms      = p('Permissions', '/onboarding/permissions',  onboarding.id, 2, 'hidden',  'page',  'Shield',    'Permission prompts')

  const tabs     = p('Tabs',          '/tabs',                    null,          1, 'hidden',  'group', 'LayoutDashboard', 'Main tab navigation')
  const tabHome  = p('Home',          '/home',                    tabs.id,       0, 'sidebar', 'page',  'Home',      'Home feed')
  const explore  = p('Explore',       '/explore',                 tabs.id,       1, 'sidebar', 'page',  'Compass',   'Discovery / search')
  const notifs   = p('Notifications', '/notifications',           tabs.id,       2, 'sidebar', 'page',  'Bell',      'Activity notifications')
  const profile  = p('Profile',       '/profile',                 tabs.id,       3, 'sidebar', 'page',  'User',      'User profile')

  const settings = p('Settings',      '/settings',                null,          2, 'hidden',  'group', 'Settings',  'App settings')
  const account  = p('Account',       '/settings/account',        settings.id,   0, 'sidebar', 'page',  'User',      'Account settings')
  const privacy  = p('Privacy',       '/settings/privacy',        settings.id,   1, 'sidebar', 'page',  'Lock',      'Privacy & security')
  const help     = p('Help',          '/settings/help',           settings.id,   2, 'sidebar', 'page',  'HelpCircle','Help & support')

  return {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Mobile app with onboarding, tab navigation, and settings',
    icon: 'Smartphone',
    pages: [onboarding, welcome, feat, perms, tabs, tabHome, explore, notifs, profile, settings, account, privacy, help],
  }
}

// ─── Analytics Dashboard ─────────────────────────────────────────────────────

function buildAnalyticsProfile(): ArchProfile {
  const overview = p('Overview',       '/',                         null,      0, 'sidebar', 'page',  'BarChart2',  'Executive overview')
  const reports  = p('Reports',        '/reports',                  null,      1, 'sidebar', 'group', 'FileText',   'Reports hub')
  const custom   = p('Custom',         '/reports/custom',           reports.id,0, 'sidebar', 'page',  'FilePlus',   'Custom report builder')
  const dataExpl = p('Data Explorer',  '/data-explorer',            null,      2, 'sidebar', 'page',  'Database',   'Raw data exploration')
  const alerts   = p('Alerts',         '/alerts',                   null,      3, 'sidebar', 'page',  'Bell',       'Alert rules & history')
  const integrations = p('Integrations','/integrations',            null,      4, 'sidebar', 'page',  'Plug',       'Data source integrations')
  const team     = p('Team',           '/team',                     null,      5, 'sidebar', 'page',  'Users',      'Workspace members')
  const settings = p('Settings',       '/settings',                 null,      6, 'sidebar', 'group', 'Settings',   'Workspace settings')
  const sources  = p('Data Sources',   '/settings/sources',         settings.id, 0, 'sidebar', 'page', 'Database',  'Manage data sources')
  const settNotif= p('Notifications',  '/settings/notifications',   settings.id, 1, 'sidebar', 'page', 'Bell',      'Notification settings')

  return {
    id: 'analytics',
    name: 'Analytics',
    description: 'Analytics dashboard with reports, data explorer, and alerts',
    icon: 'BarChart2',
    pages: [overview, reports, custom, dataExpl, alerts, integrations, team, settings, sources, settNotif],
  }
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

function buildPortfolioProfile(): ArchProfile {
  const home    = p('Home',    '/',           null,    0, 'topnav', 'page',   'Home',     'Portfolio homepage')
  const work    = p('Work',    '/work',       null,    1, 'topnav', 'group',  'Briefcase','Project showcase')
  const proj    = p('[project]','/work/[slug]',work.id, 0, 'hidden', 'page',  'FolderOpen','Case study detail')
  const about   = p('About',   '/about',      null,    2, 'topnav', 'page',   'Info',     'About me')
  const contact = p('Contact', '/contact',    null,    3, 'topnav', 'page',   'Mail',     'Contact form')
  const resume  = p('Resume',  '/resume',     null,    4, 'topnav', 'page',   'FileText', 'Downloadable resume')

  return {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Personal portfolio with project showcase, about, and contact',
    icon: 'Briefcase',
    pages: [home, work, proj, about, contact, resume],
  }
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function buildLandingPageProfile(): ArchProfile {
  const hero     = p('Home',      '/',          null, 0, 'topnav', 'page',    'Home',       'Hero + CTA')
  const features = p('Features',  '/features',  null, 1, 'topnav', 'page',    'Zap',        'Feature highlights')
  const pricing  = p('Pricing',   '/pricing',   null, 2, 'topnav', 'page',    'DollarSign', 'Pricing tiers')
  const faq      = p('FAQ',       '/faq',       null, 3, 'footer', 'page',    'HelpCircle', 'Frequently asked questions')
  const about    = p('About',     '/about',     null, 4, 'footer', 'page',    'Info',       'Company/product story')
  const contact  = p('Contact',   '/contact',   null, 5, 'footer', 'page',    'Mail',       'Contact form')
  const privacy  = p('Privacy',   '/privacy',   null, 6, 'footer', 'page',    'Shield',     'Privacy policy')
  const terms    = p('Terms',     '/terms',     null, 7, 'footer', 'page',    'FileText',   'Terms of service')

  return {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Marketing landing page with features, pricing, FAQ, and legal pages',
    icon: 'Globe',
    pages: [hero, features, pricing, faq, about, contact, privacy, terms],
  }
}

// ─── Documentation ────────────────────────────────────────────────────────────

function buildDocumentationProfile(): ArchProfile {
  const home      = p('Home',        '/',              null,       0, 'topnav',  'page',  'Home',      'Docs landing')
  const gettingS  = p('Getting Started', '/getting-started', null, 1, 'sidebar', 'group', 'BookOpen',  'Quickstart guides')
  const intro     = p('Introduction', '/getting-started/intro',  gettingS.id, 0, 'sidebar', 'page', 'FileText', 'What is this?')
  const install   = p('Installation', '/getting-started/install',gettingS.id, 1, 'sidebar', 'page', 'Download', 'Installation guide')
  const guides    = p('Guides',      '/guides',         null,       2, 'sidebar', 'group', 'BookMarked','How-to guides')
  const guide1    = p('Core Concepts','/guides/concepts',guides.id, 0, 'sidebar', 'page',  'Layers',    'Core concepts')
  const guide2    = p('Configuration','/guides/config',  guides.id, 1, 'sidebar', 'page',  'Settings',  'Configuration options')
  const apiRef    = p('API Reference','/api',            null,       3, 'sidebar', 'group', 'Code',      'API reference')
  const apiRest   = p('REST API',    '/api/rest',        apiRef.id,  0, 'sidebar', 'page',  'Globe',     'REST endpoints')
  const apiSdk    = p('SDK',         '/api/sdk',         apiRef.id,  1, 'sidebar', 'page',  'Package',   'SDK reference')
  const changelog = p('Changelog',   '/changelog',       null,       4, 'sidebar', 'page',  'Clock',     'Release history')
  const community = p('Community',   '/community',       null,       5, 'footer',  'page',  'Users',     'Community links')

  return {
    id: 'documentation',
    name: 'Documentation',
    description: 'Docs site with guides, API reference, getting started, and changelog',
    icon: 'BookOpen',
    pages: [home, gettingS, intro, install, guides, guide1, guide2, apiRef, apiRest, apiSdk, changelog, community],
  }
}

// ─── News / Media ─────────────────────────────────────────────────────────────

function buildNewsMediaProfile(): ArchProfile {
  const home     = p('Home',       '/',                  null,       0, 'topnav',  'page',  'Home',       'News homepage')
  const cat1     = p('Technology', '/technology',        null,       1, 'topnav',  'group', 'Cpu',        'Tech category')
  const article  = p('[article]',  '/technology/[slug]', cat1.id,    0, 'hidden',  'page',  'FileText',   'Article detail')
  const cat2     = p('Business',   '/business',          null,       2, 'topnav',  'group', 'Briefcase',  'Business category')
  const article2 = p('[article]',  '/business/[slug]',   cat2.id,    0, 'hidden',  'page',  'FileText',   'Article detail')
  const cat3     = p('Science',    '/science',           null,       3, 'topnav',  'group', 'FlaskConical','Science category')
  const article3 = p('[article]',  '/science/[slug]',    cat3.id,    0, 'hidden',  'page',  'FileText',   'Article detail')
  const search   = p('Search',     '/search',            null,       4, 'topnav',  'page',  'Search',     'Search results')
  const authors  = p('Authors',    '/authors',           null,       5, 'footer',  'page',  'Users',      'Author directory')
  const author   = p('[author]',   '/authors/[slug]',    authors.id, 0, 'hidden',  'page',  'User',       'Author profile')
  const subscribe= p('Subscribe',  '/subscribe',         null,       6, 'footer',  'page',  'Bell',       'Newsletter subscription')

  return {
    id: 'news-media',
    name: 'News & Media',
    description: 'Editorial site with categories, articles, authors, and subscriptions',
    icon: 'Newspaper',
    pages: [home, cat1, article, cat2, article2, cat3, article3, search, authors, author, subscribe],
  }
}

// ─── Fintech App ──────────────────────────────────────────────────────────────

function buildFintechProfile(): ArchProfile {
  const dashboard = p('Dashboard',   '/app',                 null,          0, 'sidebar', 'page',  'LayoutDashboard','Overview')
  const accounts  = p('Accounts',    '/app/accounts',        null,          1, 'sidebar', 'group', 'CreditCard',     'Bank accounts')
  const acctDetail= p('[account]',   '/app/accounts/[id]',   accounts.id,   0, 'hidden',  'page',  'FileText',       'Account detail')
  const txns      = p('Transactions','/app/transactions',    null,          2, 'sidebar', 'page',  'ArrowLeftRight', 'Transaction history')
  const payments  = p('Payments',    '/app/payments',        null,          3, 'sidebar', 'group', 'Send',           'Send & receive')
  const send      = p('Send Money',  '/app/payments/send',   payments.id,   0, 'sidebar', 'page',  'ArrowUpRight',   'Send payment')
  const request   = p('Request',     '/app/payments/request',payments.id,   1, 'sidebar', 'page',  'ArrowDownLeft',  'Request payment')
  const cards     = p('Cards',       '/app/cards',           null,          4, 'sidebar', 'page',  'CreditCard',     'Manage cards')
  const invest    = p('Invest',      '/app/invest',          null,          5, 'sidebar', 'page',  'TrendingUp',     'Investment portfolio')
  const settings  = p('Settings',    '/app/settings',        null,          6, 'sidebar', 'group', 'Settings',       'Account settings')
  const profile   = p('Profile',     '/app/settings/profile',settings.id,   0, 'sidebar', 'page',  'User',           'Personal info')
  const security  = p('Security',    '/app/settings/security',settings.id,  1, 'sidebar', 'page',  'Shield',         '2FA & security')
  const notif     = p('Notifications','/app/settings/notifications',settings.id,2,'sidebar','page','Bell',           'Alert preferences')

  return {
    id: 'fintech',
    name: 'Fintech App',
    description: 'Banking/fintech app with accounts, transactions, payments, and cards',
    icon: 'TrendingUp',
    pages: [dashboard, accounts, acctDetail, txns, payments, send, request, cards, invest, settings, profile, security, notif],
  }
}

// ─── Enterprise Portal ────────────────────────────────────────────────────────

function buildEnterpriseProfile(): ArchProfile {
  const home      = p('Home',        '/portal',               null,       0, 'sidebar', 'page',  'Home',           'Portal dashboard')
  const workspace = p('Workspace',   '/portal/workspace',     null,       1, 'sidebar', 'group', 'LayoutGrid',     'Workspace area')
  const projects  = p('Projects',    '/portal/workspace/projects', workspace.id, 0, 'sidebar', 'page', 'FolderOpen','Projects overview')
  const tasks     = p('Tasks',       '/portal/workspace/tasks',    workspace.id, 1, 'sidebar', 'page', 'CheckSquare','Task tracker')
  const docs      = p('Documents',   '/portal/documents',     null,       2, 'sidebar', 'page',  'FileText',       'Document management')
  const people    = p('People',      '/portal/people',        null,       3, 'sidebar', 'group', 'Users',          'HR directory')
  const directory = p('Directory',   '/portal/people/directory', people.id, 0, 'sidebar', 'page', 'BookOpen',     'Employee directory')
  const orgChart  = p('Org Chart',   '/portal/people/org-chart', people.id, 1, 'sidebar', 'page', 'Network',      'Org structure')
  const analytics = p('Analytics',   '/portal/analytics',     null,       4, 'sidebar', 'page',  'BarChart2',      'Business metrics')
  const admin     = p('Admin',       '/portal/admin',         null,       5, 'sidebar', 'group', 'Shield',         'Admin section')
  const users     = p('User Management','/portal/admin/users',admin.id,   0, 'sidebar', 'page',  'Users',          'Manage users')
  const roles     = p('Roles',       '/portal/admin/roles',   admin.id,   1, 'sidebar', 'page',  'Key',            'Role management')
  const audit     = p('Audit Log',   '/portal/admin/audit',   admin.id,   2, 'sidebar', 'page',  'ClipboardList',  'Audit trail')
  const settings  = p('Settings',    '/portal/settings',      null,       6, 'sidebar', 'page',  'Settings',       'Portal settings')

  return {
    id: 'enterprise',
    name: 'Enterprise Portal',
    description: 'Internal enterprise portal with workspace, HR, analytics, and admin',
    icon: 'Building2',
    pages: [home, workspace, projects, tasks, docs, people, directory, orgChart, analytics, admin, users, roles, audit, settings],
  }
}

// ─── Social Network ───────────────────────────────────────────────────────────

function buildSocialNetworkProfile(): ArchProfile {
  const feed     = p('Feed',       '/home',              null,       0, 'sidebar', 'page',  'Home',         'Activity feed')
  const explore  = p('Explore',    '/explore',           null,       1, 'sidebar', 'page',  'Compass',      'Discover content')
  const profile  = p('Profile',    '/[username]',        null,       2, 'topnav',  'page',  'User',         'User profile')
  const post     = p('[post]',     '/[username]/[id]',   profile.id, 0, 'hidden',  'page',  'MessageSquare','Post detail')
  const messages = p('Messages',   '/messages',          null,       3, 'sidebar', 'page',  'MessageCircle','Direct messages')
  const thread   = p('[thread]',   '/messages/[id]',     messages.id,0, 'hidden',  'page',  'MessageSquare','Message thread')
  const notif    = p('Notifications','/notifications',   null,       4, 'sidebar', 'page',  'Bell',         'Notification center')
  const search   = p('Search',     '/search',            null,       5, 'topnav',  'page',  'Search',       'Search people & posts')
  const settings = p('Settings',   '/settings',          null,       6, 'sidebar', 'group', 'Settings',     'Account settings')
  const privacy  = p('Privacy',    '/settings/privacy',  settings.id,0, 'sidebar', 'page',  'Shield',       'Privacy controls')
  const account  = p('Account',    '/settings/account',  settings.id,1, 'sidebar', 'page',  'User',         'Account settings')

  return {
    id: 'social-network',
    name: 'Social Network',
    description: 'Social platform with feed, explore, profiles, messaging, and notifications',
    icon: 'Users',
    pages: [feed, explore, profile, post, messages, thread, notif, search, settings, privacy, account],
  }
}

// ─── Marketplace ─────────────────────────────────────────────────────────────

function buildMarketplaceProfile(): ArchProfile {
  const home    = p('Home',         '/',                    null,       0, 'topnav',  'page',  'Home',         'Marketplace homepage')
  const browse  = p('Browse',       '/browse',              null,       1, 'topnav',  'group', 'LayoutGrid',   'Browse listings')
  const category= p('[category]',   '/browse/[cat]',        browse.id,  0, 'hidden',  'page',  'Tag',          'Category page')
  const listing = p('[listing]',    '/listing/[id]',        null,       2, 'hidden',  'page',  'Package',      'Product/listing detail')
  const cart    = p('Cart',         '/cart',                null,       3, 'topnav',  'page',  'ShoppingCart', 'Shopping cart')
  const checkout= p('Checkout',     '/checkout',            null,       4, 'hidden',  'page',  'CreditCard',   'Checkout flow')
  const seller  = p('Seller Portal','/seller',              null,       5, 'sidebar', 'group', 'Store',        'Seller dashboard')
  const selDash = p('Dashboard',    '/seller/dashboard',    seller.id,  0, 'sidebar', 'page',  'BarChart2',    'Sales dashboard')
  const listings= p('My Listings',  '/seller/listings',     seller.id,  1, 'sidebar', 'page',  'Package',      'Manage listings')
  const orders  = p('Orders',       '/seller/orders',       seller.id,  2, 'sidebar', 'page',  'ShoppingBag',  'Order management')
  const payouts = p('Payouts',      '/seller/payouts',      seller.id,  3, 'sidebar', 'page',  'DollarSign',   'Payout history')
  const account = p('My Account',   '/account',             null,       6, 'hidden',  'page',  'User',         'Buyer account')
  const purchases=p('Purchases',    '/account/purchases',   account.id, 0, 'hidden',  'page',  'ShoppingBag',  'Purchase history')

  return {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Two-sided marketplace with browse, listings, cart, and seller portal',
    icon: 'Store',
    pages: [home, browse, category, listing, cart, checkout, seller, selDash, listings, orders, payouts, account, purchases],
  }
}

// ─── Booking Platform ─────────────────────────────────────────────────────────

function buildBookingProfile(): ArchProfile {
  const home    = p('Home',        '/',                   null,       0, 'topnav',  'page',  'Home',         'Search & discovery')
  const search  = p('Search',      '/search',             null,       1, 'topnav',  'page',  'Search',       'Search results + filters')
  const listing = p('[listing]',   '/listing/[id]',       null,       2, 'hidden',  'page',  'MapPin',       'Listing detail + calendar')
  const book    = p('Book',        '/book/[id]',          listing.id, 0, 'hidden',  'page',  'Calendar',     'Booking form')
  const confirm = p('Confirmation','/booking/[id]',       null,       3, 'hidden',  'page',  'CheckCircle',  'Booking confirmation')
  const trips   = p('Trips',       '/trips',              null,       4, 'topnav',  'page',  'Briefcase',    'My bookings')
  const wishlist= p('Wishlist',    '/wishlist',           null,       5, 'topnav',  'page',  'Heart',        'Saved listings')
  const messages= p('Messages',    '/messages',           null,       6, 'topnav',  'page',  'MessageCircle','Guest-host messaging')
  const host    = p('Host Portal', '/host',               null,       7, 'sidebar', 'group', 'Home',         'Host dashboard')
  const hostDash= p('Dashboard',   '/host/dashboard',     host.id,    0, 'sidebar', 'page',  'BarChart2',    'Host overview')
  const calendar= p('Calendar',    '/host/calendar',      host.id,    1, 'sidebar', 'page',  'Calendar',     'Availability calendar')
  const reviews = p('Reviews',     '/host/reviews',       host.id,    2, 'sidebar', 'page',  'Star',         'Guest reviews')

  return {
    id: 'booking',
    name: 'Booking Platform',
    description: 'Hospitality/booking platform with search, listings, reservations, and host portal',
    icon: 'Calendar',
    pages: [home, search, listing, book, confirm, trips, wishlist, messages, host, hostDash, calendar, reviews],
  }
}

// ─── AI Assistant ────────────────────────────────────────────────────────────

function buildAiAssistantProfile(): ArchProfile {
  const home    = p('Home',      '/',               null,     0, 'topnav',  'page',  'Home',         'Marketing landing page')
  const pricing = p('Pricing',   '/pricing',        null,     1, 'topnav',  'page',  'DollarSign',   'Plans & credits')
  const login   = p('Sign In',   '/sign-in',        null,     2, 'hidden',  'page',  'LogIn',        'Authentication')
  const signup  = p('Sign Up',   '/sign-up',        null,     3, 'hidden',  'page',  'UserPlus',     'Create account')
  const chat    = p('Chat',      '/app/chat',       null,     4, 'sidebar', 'page',  'MessageSquare','Main chat interface')
  const history = p('History',   '/app/history',    null,     5, 'sidebar', 'page',  'Clock',        'Conversation history')
  const prompts = p('Prompts',   '/app/prompts',    null,     6, 'sidebar', 'page',  'Sparkles',     'Prompt library')
  const tools   = p('Tools',     '/app/tools',      null,     7, 'sidebar', 'group', 'Wrench',       'AI tool catalog')
  const imgGen  = p('Image Gen', '/app/tools/image',tools.id, 0, 'sidebar', 'page',  'Image',        'Image generation')
  const codeGen = p('Code',      '/app/tools/code', tools.id, 1, 'sidebar', 'page',  'Code2',        'Code assistant')
  const usage   = p('Usage',     '/app/usage',      null,     8, 'sidebar', 'page',  'BarChart2',    'Token & credit usage')
  const settings= p('Settings',  '/app/settings',   null,     9, 'sidebar', 'page',  'Settings',     'API keys, model prefs')
  const docs    = p('Docs',      '/docs',           null,     10,'topnav',  'page',  'BookOpen',     'Developer documentation')

  return {
    id: 'ai-assistant',
    name: 'AI Assistant',
    description: 'AI chat + tools product with marketing site, model selector, usage dashboard, and billing',
    icon: 'Bot',
    pages: [home, pricing, login, signup, chat, history, prompts, tools, imgGen, codeGen, usage, settings, docs],
  }
}

// ─── Developer Console ───────────────────────────────────────────────────────

function buildDevConsoleProfile(): ArchProfile {
  const home    = p('Home',        '/',                  null,       0, 'topnav',  'page',  'Home',         'Product landing')
  const pricing = p('Pricing',     '/pricing',           null,       1, 'topnav',  'page',  'DollarSign',   'Plans')
  const login   = p('Sign In',     '/sign-in',           null,       2, 'hidden',  'page',  'LogIn',        'Auth')
  const signup  = p('Sign Up',     '/sign-up',           null,       3, 'hidden',  'page',  'UserPlus',     'Register')
  const dash    = p('Overview',    '/console',           null,       4, 'sidebar', 'page',  'LayoutDashboard','Console home')
  const projects= p('Projects',    '/console/projects',  null,       5, 'sidebar', 'group', 'FolderOpen',   'Projects')
  const project = p('Project',     '/console/projects/[id]', projects.id, 0, 'sidebar', 'page', 'FolderOpen', 'Project detail')
  const apis    = p('API Keys',    '/console/keys',      null,       6, 'sidebar', 'page',  'Key',          'Manage API keys')
  const logs    = p('Logs',        '/console/logs',      null,       7, 'sidebar', 'page',  'ScrollText',   'Request logs')
  const usage   = p('Usage',       '/console/usage',     null,       8, 'sidebar', 'page',  'BarChart3',    'Usage & billing')
  const team    = p('Team',        '/console/team',      null,       9, 'sidebar', 'page',  'Users',        'Members & roles')
  const webhooks= p('Webhooks',    '/console/webhooks',  null,       10,'sidebar', 'page',  'Zap',          'Webhook endpoints')
  const docs    = p('Docs',        '/docs',              null,       11,'topnav',  'page',  'BookOpen',     'Documentation')
  const apiref  = p('API Ref',     '/docs/api',          docs.id,    0, 'sidebar', 'page',  'Code2',        'API reference')
  const sdk     = p('SDK',         '/docs/sdk',          docs.id,    1, 'sidebar', 'page',  'Package',      'SDK guides')
  const changelog = p('Changelog', '/changelog',         null,       12,'topnav',  'page',  'Clock',        'Release notes')

  return {
    id: 'developer-console',
    name: 'Developer Console',
    description: 'API platform console with project management, keys, logs, usage, webhooks, and docs',
    icon: 'Terminal',
    pages: [home, pricing, login, signup, dash, projects, project, apis, logs, usage, team, webhooks, docs, apiref, sdk, changelog],
  }
}

// ─── Events Platform ─────────────────────────────────────────────────────────

function buildEventsPlatformProfile(): ArchProfile {
  const home     = p('Home',       '/',              null,       0, 'topnav',  'page',  'Home',         'Platform landing')
  const discover = p('Discover',   '/discover',      null,       1, 'topnav',  'page',  'Compass',      'Browse events')
  const login    = p('Sign In',    '/sign-in',       null,       2, 'hidden',  'page',  'LogIn',        'Auth')
  const signup   = p('Sign Up',    '/sign-up',       null,       3, 'hidden',  'page',  'UserPlus',     'Create account')
  const event    = p('Event',      '/events/[id]',   null,       4, 'hidden',  'page',  'Calendar',     'Event detail page')
  const ticket   = p('Tickets',    '/tickets',       null,       5, 'topnav',  'page',  'Ticket',       'My tickets')
  const checkout = p('Checkout',   '/checkout',      null,       6, 'hidden',  'page',  'CreditCard',   'Purchase flow')
  const confirm  = p('Confirmed',  '/confirmed/[id]',null,       7, 'hidden',  'page',  'CheckCircle',  'Ticket confirmation')
  const organizer= p('Organize',   '/organize',      null,       8, 'topnav',  'group', 'CalendarPlus', 'Organizer portal')
  const create   = p('Create Event','/organize/new', organizer.id,0,'sidebar', 'page',  'Plus',         'New event wizard')
  const myEvents = p('My Events',  '/organize/events',organizer.id,1,'sidebar','page',  'Calendar',     'Event management')
  const attendees= p('Attendees',  '/organize/attendees',organizer.id,2,'sidebar','page','Users',       'Attendee list')
  const analytics= p('Analytics',  '/organize/analytics',organizer.id,3,'sidebar','page','BarChart3',   'Event analytics')
  const speakers = p('Speakers',   '/speakers',      null,       9, 'topnav',  'page',  'Mic',          'Speaker directory')
  const profile  = p('Profile',    '/profile/[id]',  null,       10,'hidden',  'page',  'User',         'User profile')

  return {
    id: 'events-platform',
    name: 'Events Platform',
    description: 'Event ticketing and discovery platform with organizer portal, attendee management, and analytics',
    icon: 'CalendarDays',
    pages: [home, discover, login, signup, event, ticket, checkout, confirm, organizer, create, myEvents, attendees, analytics, speakers, profile],
  }
}

// ─── Profile groups for UI ────────────────────────────────────────────────────

export const ARCH_PROFILE_GROUPS: Array<{ label: string; ids: ArchProfile['id'][] }> = [
  {
    label: 'Website & Marketing',
    ids: ['cms', 'saas', 'blog', 'portfolio', 'landing-page', 'documentation', 'news-media'],
  },
  {
    label: 'Application',
    ids: ['task-manager', 'analytics', 'mobile-app', 'fintech', 'enterprise', 'social-network', 'ai-assistant', 'developer-console'],
  },
  {
    label: 'Commerce',
    ids: ['ecommerce', 'marketplace', 'booking', 'events-platform'],
  },
]

// ─── Export ──────────────────────────────────────────────────────────────────

export const ARCH_PROFILES: ArchProfile[] = [
  buildCmsProfile(),
  buildSaasProfile(),
  buildBlogProfile(),
  buildTaskManagerProfile(),
  buildEcommerceProfile(),
  buildMobileAppProfile(),
  buildAnalyticsProfile(),
  buildPortfolioProfile(),
  buildLandingPageProfile(),
  buildDocumentationProfile(),
  buildNewsMediaProfile(),
  buildFintechProfile(),
  buildEnterpriseProfile(),
  buildSocialNetworkProfile(),
  buildMarketplaceProfile(),
  buildBookingProfile(),
  buildAiAssistantProfile(),
  buildDevConsoleProfile(),
  buildEventsPlatformProfile(),
]

export const ARCH_PROFILES_MAP = Object.fromEntries(
  ARCH_PROFILES.map((p) => [p.id, p]),
) as Record<string, ArchProfile>
