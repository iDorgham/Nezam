import type { ArchPage, ArchProfile, MenuPlacement } from '@/types/arch'

function archMenu(
  profileKey: string,
  parentId: string,
  placement: MenuPlacement,
  order: number,
): ArchPage {
  const p = pageBuilder(profileKey)
  const meta: Record<
    MenuPlacement,
    { name: string; route: string; desc: string }
  > = {
    main: {
      name: 'Main Navigation',
      route: '/main-nav',
      desc: 'Primary nav — top bar (dropdown) and sidebar (tree) via nav slot',
    },
    footer: {
      name: 'Footer Navigation',
      route: '/footer-nav',
      desc: 'Footer / secondary nav links (nav slot: footer)',
    },
    widget: {
      name: 'Widget Navigation',
      route: '/widget-nav',
      desc: 'Utility / widget nav links',
    },
  }
  const m = meta[placement]
  const page = p(m.name, m.route, parentId, order, 'hidden', 'navmenu', 'Menu', m.desc)
  return {
    ...page,
    menuPlacement: placement,
    menuHasIcons: true,
    menuPresentation: placement === 'main' ? 'dropdown' : 'dropdown',
    menuSidebarPresentation: placement === 'main' ? 'tree' : 'flat',
  }
}

function slugifyPart(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[\[\]]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_') || 'x'
  )
}

function stablePageId(profileKey: string, route: string, name: string): string {
  return `pg_${profileKey}_${slugifyPart(route)}_${slugifyPart(name)}`.slice(0, 96)
}

type PageLayoutOpts = Pick<ArchPage, 'layout' | 'layoutWidth'>

function pageBuilder(profileKey: string) {
  return function p(
    name: string,
    route: string,
    parentId: string | null,
    order: number,
    navSlot: ArchPage['navSlot'] = 'sidebar',
    type: ArchPage['type'] = 'page',
    icon = 'FileText',
    description = '',
    layoutOpts?: PageLayoutOpts,
  ): ArchPage {
    return {
      id: stablePageId(profileKey, route, name),
      name,
      route,
      parentId,
      order,
      type,
      navSlot,
      icon,
      description,
      ...layoutOpts,
    }
  }
}

// ─── CMS ────────────────────────────────────────────────────────────────────

function buildCmsProfile(): ArchProfile {
  const p = pageBuilder('cms')
  const rootApp = p('CMS App', '/cms-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('cms', rootApp.id, 'main', 0)
  const footerMenu = archMenu('cms', rootApp.id, 'footer', 1)

  const home    = p('Home',          '/',                  mainMenu.id, 0, 'topnav',  'page',  'Home',            'Landing page')
  const about   = p('About',         '/about',             mainMenu.id, 1, 'topnav',  'page',  'Info',            'Company info')
  const pricing = p('Pricing',       '/pricing',           mainMenu.id, 2, 'topnav',  'page',  'DollarSign',      'Plans & pricing')
  const contact = p('Contact',       '/contact',           mainMenu.id, 3, 'topnav',  'page',  'Mail',            'Contact form')
  const login   = p('Login',         '/login',             mainMenu.id, 4, 'hidden',  'page',  'Key',             'Sign in')
  const signup  = p('Sign Up',       '/signup',            mainMenu.id, 5, 'hidden',  'page',  'UserPlus',        'Create account')
  const dash    = p('Dashboard',     '/dashboard',         mainMenu.id, 0, 'sidebar', 'group', 'LayoutDashboard', 'CMS dashboard root')
  const content = p('Content',       '/dashboard/content', dash.id, 0, 'sidebar', 'page', 'FileEdit',   'Manage content')
  const pages   = p('Pages',         '/dashboard/pages',   dash.id, 1, 'sidebar', 'page', 'FileText',   'Manage site pages')
  const media   = p('Media',         '/dashboard/media',   dash.id, 2, 'sidebar', 'page', 'Image',      'Media library')
  const users   = p('Users',         '/dashboard/users',   dash.id, 3, 'sidebar', 'page', 'Users',      'User management')
  const roles   = p('Roles',         '/dashboard/roles',   dash.id, 4, 'sidebar', 'page', 'Shield',     'Roles & permissions')
  const activity= p('Activity Log',  '/dashboard/activity',dash.id, 5, 'sidebar', 'page', 'History',    'Audit & activity')
  const settings= p('Settings',      '/dashboard/settings',dash.id, 6, 'sidebar', 'page', 'Settings',   'App settings')
  const editor  = p('Content Editor','/dashboard/content/editor', content.id, 0, 'sidebar', 'page', 'PenLine', 'Rich content editor', { layout: 'tabs', layoutWidth: 'fullwidth' })
  const builder = p('Page Builder',  '/dashboard/pages/builder', pages.id, 0, 'sidebar', 'page', 'LayoutTemplate', 'Visual page builder', { layout: 'tabs', layoutWidth: 'fullwidth' })

  return {
    id: 'cms',
    name: 'CMS',
    description: 'Content management system with marketing site + admin dashboard',
    icon: 'LayoutGrid',
    pages: [rootApp, mainMenu, footerMenu, home, about, pricing, contact, login, signup, dash, content, editor, pages, builder, media, users, roles, activity, settings],
  }
}

// ─── SaaS ─────────────────────────────────────────────────────────────────────

function buildSaasProfile(): ArchProfile {
  const p = pageBuilder('saas')
  const rootApp = p('SaaS App', '/saas-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('saas', rootApp.id, 'main', 0)
  const footerMenu = archMenu('saas', rootApp.id, 'footer', 1)

  const home     = p('Home',          '/',                       mainMenu.id,  0, 'topnav',  'page',  'Home',            'Marketing homepage')
  const features = p('Features',      '/features',               mainMenu.id,  1, 'topnav',  'page',  'Zap',             'Product features')
  const pricing  = p('Pricing',       '/pricing',                mainMenu.id,  2, 'topnav',  'page',  'DollarSign',      'Pricing plans')
  const blog     = p('Blog',          '/blog',                   mainMenu.id,  3, 'topnav',  'page',  'BookOpen',        'Company blog')
  const contact  = p('Contact',       '/contact',                footerMenu.id,  4, 'footer',  'page',  'Mail',            'Contact')
  const login    = p('Login',         '/login',                  mainMenu.id,  5, 'hidden',  'page',  'Key',             'Sign in')
  const signup   = p('Sign Up',       '/signup',                 mainMenu.id,  6, 'hidden',  'page',  'UserPlus',        'Create account')
  const forgot   = p('Forgot Pwd',    '/forgot',                 mainMenu.id,  7, 'hidden',  'page',  'Unlock',          'Reset password')
  const app      = p('App',           '/app',                    mainMenu.id, 8, 'sidebar', 'group', 'LayoutDashboard', 'SaaS app root')
  const overview = p('Overview',      '/app',                    app.id,      0, 'sidebar', 'page',  'BarChart2',       'Dashboard overview')
  const projects = p('Projects',      '/app/projects',           app.id,      1, 'sidebar', 'page',  'FolderOpen',      'All projects')
  const team     = p('Team',          '/app/team',               app.id,      2, 'sidebar', 'page',  'Users',           'Team members')
  const billing  = p('Billing',       '/app/billing',            app.id,      3, 'sidebar', 'page',  'CreditCard',      'Subscription & billing')
  const settings = p('Settings',      '/app/settings',           app.id,      4, 'sidebar', 'group', 'Settings',        'App settings')
  const profile  = p('Profile',       '/app/settings/profile',   settings.id, 0, 'sidebar', 'page',  'User',            'Profile settings')
  const security = p('Security',      '/app/settings/security',  settings.id, 1, 'sidebar', 'page',  'Lock',            'Security settings')
  const notifs   = p('Notifications', '/app/settings/notifications', settings.id, 2, 'sidebar', 'page', 'Bell',          'Notification prefs')
  const apiAccess= p('API Access',    '/app/settings/api',       settings.id, 3, 'sidebar', 'page', 'Code2',         'API keys & webhooks')
  const workspaces=p('Workspaces',    '/app/workspaces',         app.id,      5, 'sidebar', 'page', 'Building2',     'Org workspaces')
  const usage    = p('Usage',         '/app/usage',              app.id,      6, 'sidebar', 'page', 'BarChart3',     'Usage & quotas', { layout: 'tabs' })
  const audit    = p('Audit Log',     '/app/audit',              app.id,      7, 'sidebar', 'page', 'ScrollText',    'Security audit trail')
  const integr   = p('Integrations',  '/app/integrations',       app.id,      8, 'sidebar', 'page', 'Plug',          'Connected apps')
  const metrics  = p('Metrics',       '/app/metrics',            app.id,      9, 'sidebar', 'page', 'Activity',      'Product metrics', { layout: 'tabs' })
  const admin    = p('Admin',         '/app/admin',              app.id,      10,'sidebar', 'group', 'Shield',        'Org admin')
  const members  = p('Members',       '/app/admin/members',      admin.id,    0, 'sidebar', 'page', 'UserCog',       'Member access')

  return {
    id: 'saas',
    name: 'SaaS',
    description: 'Software-as-a-service with marketing site, auth flow, and app dashboard',
    icon: 'Zap',
    pages: [rootApp, mainMenu, footerMenu, home, features, pricing, blog, contact, login, signup, forgot, app, overview, projects, team, billing, workspaces, usage, audit, integr, metrics, admin, members, settings, profile, security, notifs, apiAccess],
  }
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

function buildBlogProfile(): ArchProfile {
  const p = pageBuilder('blog')
  const rootApp = p('Blog App', '/blog-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('blog', rootApp.id, 'main', 0)
  const footerMenu = archMenu('blog', rootApp.id, 'footer', 1)

  const home   = p('Home',       '/',             mainMenu.id,     0, 'topnav',  'page',  'Home',     'Blog homepage')
  const blog   = p('Blog',       '/blog',         mainMenu.id,     1, 'topnav',  'page',  'BookOpen', 'All posts')
  const post   = p('[slug]',     '/blog/[slug]',  blog.id,  0, 'hidden',  'page',  'FileText', 'Individual post')
  const about  = p('About',      '/about',        mainMenu.id,     2, 'topnav',  'page',  'Info',     'About the author')
  const newsl  = p('Newsletter', '/newsletter',   mainMenu.id,     3, 'topnav',  'page',  'Mail',     'Newsletter signup')
  const tags   = p('Tags',       '/tags',         mainMenu.id,     4, 'topnav',  'page',  'Tag',      'Browse by tag')
  const tag    = p('[tag]',      '/tags/[tag]',   tags.id,  0, 'hidden',  'page',  'FileText', 'Tag page')
  const admin  = p('Admin',      '/admin',        mainMenu.id, 5, 'sidebar', 'group', 'Wrench',   'Blog admin')
  const posts  = p('Posts',      '/admin/posts',  admin.id, 0, 'sidebar', 'page',  'FileEdit', 'Manage posts')
  const cats   = p('Categories', '/admin/categories', admin.id, 1, 'sidebar', 'page', 'FolderOpen', 'Post categories')
  const media  = p('Media',      '/admin/media',  admin.id, 2, 'sidebar', 'page',  'Image',    'Media library')
  const admSet = p('Settings',   '/admin/settings', admin.id, 3, 'sidebar', 'page', 'Settings', 'Blog settings')

  return {
    id: 'blog',
    name: 'Blog',
    description: 'Content blog with reader-facing site and editor admin panel',
    icon: 'BookOpen',
    pages: [rootApp, mainMenu, footerMenu, home, blog, post, about, newsl, tags, tag, admin, posts, cats, media, admSet],
  }
}

// ─── Task Manager ────────────────────────────────────────────────────────────

function buildTaskManagerProfile(): ArchProfile {
  const p = pageBuilder('task-manager')
  const rootApp = p('Task Manager App', '/task-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('task-manager', rootApp.id, 'main', 0)
  const footerMenu = archMenu('task-manager', rootApp.id, 'footer', 1)

  const home     = p('Home',         '/',                         mainMenu.id,          0, 'topnav',  'page',  'Home',            'Marketing homepage')
  const pricing  = p('Pricing',      '/pricing',                  mainMenu.id,          1, 'topnav',  'page',  'DollarSign',      'Plans')
  const login    = p('Login',        '/login',                    mainMenu.id,          2, 'hidden',  'page',  'Key',             'Sign in')
  const signup   = p('Sign Up',      '/signup',                   mainMenu.id,          3, 'hidden',  'page',  'UserPlus',        'Register')
  const app      = p('App',          '/app',                      mainMenu.id,          4, 'sidebar', 'group', 'LayoutDashboard', 'App root')
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
  const kanban   = p('Kanban',       '/app/kanban',                 app.id,        7, 'sidebar', 'page',  'Columns',         'Board view', { layout: 'tabs', layoutWidth: 'fullwidth' })
  const automations=p('Automations','/app/automations',            app.id,        8, 'sidebar', 'page',  'Workflow',        'Workflow rules')

  return {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Productivity app with personal tasks, projects, team, and reporting',
    icon: 'CheckSquare',
    pages: [rootApp, mainMenu, footerMenu, home, pricing, login, signup, app, myTasks, inbox, projects, project, calendar, team, reports, kanban, automations, settings, profile, workspace, integr],
  }
}

// ─── E-Commerce ──────────────────────────────────────────────────────────────

function buildEcommerceProfile(): ArchProfile {
  const p = pageBuilder('ecommerce')
  const rootApp = p('E-Commerce App', '/shop-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('ecommerce', rootApp.id, 'main', 0)
  const footerMenu = archMenu('ecommerce', rootApp.id, 'footer', 1)

  const home    = p('Home',          '/',                        mainMenu.id,       0, 'topnav',  'page',  'Home',        'Store homepage')
  const prods   = p('Products',      '/products',                mainMenu.id,       1, 'topnav',  'page',  'ShoppingBag', 'Product catalog')
  const catPage = p('[category]',    '/products/[category]',     prods.id,   0, 'hidden',  'page',  'Tag',         'Category listing')
  const prodDet = p('[slug]',        '/products/[cat]/[slug]',   catPage.id, 0, 'hidden',  'page',  'Package',     'Product detail')
  const cart    = p('Cart',          '/cart',                    mainMenu.id,       2, 'hidden',  'page',  'ShoppingCart','Shopping cart')
  const checkout= p('Checkout',      '/checkout',                mainMenu.id,       3, 'hidden',  'group', 'CreditCard',  'Checkout flow')
  const success = p('Order Confirm', '/checkout/success',        checkout.id,0, 'hidden',  'page',  'CheckCircle', 'Order confirmation')
  const account = p('Account',       '/account',                 mainMenu.id,       4, 'sidebar', 'group', 'User',        'Customer account')
  const orders  = p('Orders',        '/account/orders',          account.id, 0, 'sidebar', 'page',  'ClipboardList','Order history')
  const wishlist= p('Wishlist',      '/account/wishlist',        account.id, 1, 'sidebar', 'page',  'Heart',       'Saved items')
  const acctProf= p('Profile',       '/account/profile',         account.id, 2, 'sidebar', 'page',  'Settings',    'Account settings')
  const login   = p('Login',         '/login',                   mainMenu.id,       5, 'hidden',  'page',  'Key',         'Sign in')
  const signup  = p('Sign Up',       '/signup',                  mainMenu.id,       6, 'hidden',  'page',  'UserPlus',    'Create account')
  const analytics=p('Store Analytics','/admin/analytics',        mainMenu.id,       7, 'sidebar', 'page',  'BarChart2',   'Sales analytics', { layout: 'tabs' })
  const inventory=p('Inventory',    '/admin/inventory',        mainMenu.id,       8, 'sidebar', 'page',  'Package',     'Stock & SKUs')
  const promotions=p('Promotions',  '/admin/promotions',       mainMenu.id,       9, 'sidebar', 'page',  'Percent',     'Discounts & campaigns')

  return {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Online store with product catalog, cart, checkout, and account area',
    icon: 'ShoppingBag',
    pages: [rootApp, mainMenu, footerMenu, home, prods, catPage, prodDet, cart, checkout, success, account, orders, wishlist, acctProf, login, signup, analytics, inventory, promotions],
  }
}

// ─── Mobile App ──────────────────────────────────────────────────────────────

function buildMobileAppProfile(): ArchProfile {
  const p = pageBuilder('mobile-app')
  const rootApp = p('Mobile App', '/mobile-root', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('mobile-app', rootApp.id, 'main', 0)
  const footerMenu = archMenu('mobile-app', rootApp.id, 'footer', 1)

  const onboarding = p('Onboarding',  '/onboarding',              mainMenu.id,          0, 'hidden',  'group', 'Sparkles',  'Onboarding flow')
  const welcome    = p('Welcome',     '/onboarding/welcome',      onboarding.id, 0, 'hidden',  'page',  'Home',      'Welcome screen')
  const feat       = p('Features',    '/onboarding/features',     onboarding.id, 1, 'hidden',  'page',  'Zap',       'Feature highlights')
  const perms      = p('Permissions', '/onboarding/permissions',  onboarding.id, 2, 'hidden',  'page',  'Shield',    'Permission prompts')

  const tabs     = p('Tabs',          '/tabs',                    mainMenu.id,          1, 'hidden',  'group', 'LayoutDashboard', 'Main tab navigation')
  const tabHome  = p('Home',          '/home',                    tabs.id,       0, 'sidebar', 'page',  'Home',      'Home feed')
  const explore  = p('Explore',       '/explore',                 tabs.id,       1, 'sidebar', 'page',  'Compass',   'Discovery / search')
  const notifs   = p('Notifications', '/notifications',           tabs.id,       2, 'sidebar', 'page',  'Bell',      'Activity notifications')
  const profile  = p('Profile',       '/profile',                 tabs.id,       3, 'sidebar', 'page',  'User',      'User profile')

  const settings = p('Settings',      '/settings',                mainMenu.id,          2, 'hidden',  'group', 'Settings',  'App settings')
  const account  = p('Account',       '/settings/account',        settings.id,   0, 'sidebar', 'page',  'User',      'Account settings')
  const privacy  = p('Privacy',       '/settings/privacy',        settings.id,   1, 'sidebar', 'page',  'Lock',      'Privacy & security')
  const help     = p('Help',          '/settings/help',           settings.id,   2, 'sidebar', 'page',  'HelpCircle','Help & support')

  return {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Mobile app with onboarding, tab navigation, and settings',
    icon: 'Smartphone',
    pages: [rootApp, mainMenu, footerMenu, onboarding, welcome, feat, perms, tabs, tabHome, explore, notifs, profile, settings, account, privacy, help],
  }
}

// ─── Analytics Dashboard ─────────────────────────────────────────────────────

function buildAnalyticsProfile(): ArchProfile {
  const p = pageBuilder('analytics')
  const rootApp = p('Analytics App', '/analytics-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('analytics', rootApp.id, 'main', 0)
  const footerMenu = archMenu('analytics', rootApp.id, 'footer', 1)

  const overview = p('Overview',       '/',                         mainMenu.id,      0, 'sidebar', 'page',  'BarChart2',  'Executive overview')
  const reports  = p('Reports',        '/reports',                  mainMenu.id,      1, 'sidebar', 'group', 'FileText',   'Reports hub')
  const custom   = p('Custom',         '/reports/custom',           reports.id,0, 'sidebar', 'page',  'FilePlus',   'Custom report builder')
  const dataExpl = p('Data Explorer',  '/data-explorer',            mainMenu.id,      2, 'sidebar', 'page',  'Database',   'Raw data exploration')
  const alerts   = p('Alerts',         '/alerts',                   mainMenu.id,      3, 'sidebar', 'page',  'Bell',       'Alert rules & history')
  const integrations = p('Integrations','/integrations',            mainMenu.id,      4, 'sidebar', 'page',  'Plug',       'Data source integrations')
  const team     = p('Team',           '/team',                     mainMenu.id,      5, 'sidebar', 'page',  'Users',      'Workspace members')
  const settings = p('Settings',       '/settings',                 mainMenu.id,      6, 'sidebar', 'group', 'Settings',   'Workspace settings')
  const sources  = p('Data Sources',   '/settings/sources',         settings.id, 0, 'sidebar', 'page', 'Database',  'Manage data sources')
  const settNotif= p('Notifications',  '/settings/notifications',   settings.id, 1, 'sidebar', 'page', 'Bell',      'Notification settings')
  const segments = p('Segments',       '/segments',                 mainMenu.id,      7, 'sidebar', 'page',  'PieChart',   'Audience segments', { layout: 'tabs' })
  const funnels  = p('Funnels',        '/funnels',                  mainMenu.id,      8, 'sidebar', 'page',  'Filter',     'Conversion funnels', { layout: 'tabs' })
  const cohorts  = p('Cohorts',        '/cohorts',                  mainMenu.id,      9, 'sidebar', 'page',  'Users',      'Cohort analysis', { layout: 'tabs', layoutWidth: 'fullwidth' })
  const realtime = p('Real-time',      '/realtime',                 mainMenu.id,      10,'sidebar', 'page',  'Radio',      'Live event stream', { layout: 'tabs', layoutWidth: 'fullwidth' })
  const goals    = p('Goals',          '/goals',                    mainMenu.id,      11,'sidebar', 'page',  'Target',     'North-star goals', { layout: 'tabs' })
  const command  = p('Command Center', '/command',                  mainMenu.id,      12,'sidebar', 'page',  'LayoutDashboard','Ops command center', { layout: 'tabs', layoutWidth: 'fullwidth' })

  return {
    id: 'analytics',
    name: 'Analytics',
    description: 'Analytics dashboard with reports, data explorer, and alerts',
    icon: 'BarChart2',
    pages: [rootApp, mainMenu, footerMenu, overview, reports, custom, dataExpl, alerts, integrations, team, settings, sources, settNotif, segments, funnels, cohorts, realtime, goals, command],
  }
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

function buildPortfolioProfile(): ArchProfile {
  const p = pageBuilder('portfolio')
  const rootApp = p('Portfolio App', '/portfolio-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('portfolio', rootApp.id, 'main', 0)
  const footerMenu = archMenu('portfolio', rootApp.id, 'footer', 1)

  const home    = p('Home',    '/',           mainMenu.id,    0, 'topnav', 'page',   'Home',     'Portfolio homepage')
  const work    = p('Work',    '/work',       mainMenu.id,    1, 'topnav', 'group',  'Briefcase','Project showcase')
  const proj    = p('[project]','/work/[slug]',work.id, 0, 'hidden', 'page',  'FolderOpen','Case study detail')
  const about   = p('About',   '/about',      mainMenu.id,    2, 'topnav', 'page',   'Info',     'About me')
  const contact = p('Contact', '/contact',    mainMenu.id,    3, 'topnav', 'page',   'Mail',     'Contact form')
  const resume  = p('Resume',  '/resume',     mainMenu.id,    4, 'topnav', 'page',   'FileText', 'Downloadable resume')

  return {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Personal portfolio with project showcase, about, and contact',
    icon: 'Briefcase',
    pages: [rootApp, mainMenu, footerMenu, home, work, proj, about, contact, resume],
  }
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function buildLandingPageProfile(): ArchProfile {
  const p = pageBuilder('landing-page')
  const rootApp = p('Landing Page App', '/landing-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('landing-page', rootApp.id, 'main', 0)
  const footerMenu = archMenu('landing-page', rootApp.id, 'footer', 1)

  const hero     = p('Home',      '/',          mainMenu.id, 0, 'topnav', 'page',    'Home',       'Hero + CTA')
  const features = p('Features',  '/features',  mainMenu.id, 1, 'topnav', 'page',    'Zap',        'Feature highlights')
  const pricing  = p('Pricing',   '/pricing',   mainMenu.id, 2, 'topnav', 'page',    'DollarSign', 'Pricing tiers')
  const faq      = p('FAQ',       '/faq',       footerMenu.id, 3, 'footer', 'page',    'HelpCircle', 'Frequently asked questions')
  const about    = p('About',     '/about',     footerMenu.id, 4, 'footer', 'page',    'Info',       'Company/product story')
  const contact  = p('Contact',   '/contact',   footerMenu.id, 5, 'footer', 'page',    'Mail',       'Contact form')
  const privacy  = p('Privacy',   '/privacy',   footerMenu.id, 6, 'footer', 'page',    'Shield',     'Privacy policy')
  const terms    = p('Terms',     '/terms',     footerMenu.id, 7, 'footer', 'page',    'FileText',   'Terms of service')

  return {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Marketing landing page with features, pricing, FAQ, and legal pages',
    icon: 'Globe',
    pages: [rootApp, mainMenu, footerMenu, hero, features, pricing, faq, about, contact, privacy, terms],
  }
}

// ─── Documentation ────────────────────────────────────────────────────────────

function buildDocumentationProfile(): ArchProfile {
  const p = pageBuilder('documentation')
  const rootApp = p('Docs App', '/docs-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('documentation', rootApp.id, 'main', 0)
  const footerMenu = archMenu('documentation', rootApp.id, 'footer', 1)

  const home      = p('Home',        '/',              mainMenu.id,       0, 'topnav',  'page',  'Home',      'Docs landing')
  const gettingS  = p('Getting Started', '/getting-started', mainMenu.id, 1, 'sidebar', 'group', 'BookOpen',  'Quickstart guides')
  const intro     = p('Introduction', '/getting-started/intro',  gettingS.id, 0, 'sidebar', 'page', 'FileText', 'What is this?')
  const install   = p('Installation', '/getting-started/install',gettingS.id, 1, 'sidebar', 'page', 'Download', 'Installation guide')
  const guides    = p('Guides',      '/guides',         mainMenu.id,       2, 'sidebar', 'group', 'BookMarked','How-to guides')
  const guide1    = p('Core Concepts','/guides/concepts',guides.id, 0, 'sidebar', 'page',  'Layers',    'Core concepts')
  const guide2    = p('Configuration','/guides/config',  guides.id, 1, 'sidebar', 'page',  'Settings',  'Configuration options')
  const apiRef    = p('API Reference','/api',            mainMenu.id,       3, 'sidebar', 'group', 'Code',      'API reference')
  const apiRest   = p('REST API',    '/api/rest',        apiRef.id,  0, 'sidebar', 'page',  'Globe',     'REST endpoints')
  const apiSdk    = p('SDK',         '/api/sdk',         apiRef.id,  1, 'sidebar', 'page',  'Package',   'SDK reference')
  const changelog = p('Changelog',   '/changelog',       mainMenu.id,       4, 'sidebar', 'page',  'Clock',     'Release history')
  const community = p('Community',   '/community',       footerMenu.id,       5, 'footer',  'page',  'Users',     'Community links')

  return {
    id: 'documentation',
    name: 'Documentation',
    description: 'Docs site with guides, API reference, getting started, and changelog',
    icon: 'BookOpen',
    pages: [rootApp, mainMenu, footerMenu, home, gettingS, intro, install, guides, guide1, guide2, apiRef, apiRest, apiSdk, changelog, community],
  }
}

// ─── News / Media ─────────────────────────────────────────────────────────────

function buildNewsMediaProfile(): ArchProfile {
  const p = pageBuilder('news-media')
  const rootApp = p('News App', '/news-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('news-media', rootApp.id, 'main', 0)
  const footerMenu = archMenu('news-media', rootApp.id, 'footer', 1)

  const home     = p('Home',       '/',                  mainMenu.id,       0, 'topnav',  'page',  'Home',       'News homepage')
  const cat1     = p('Technology', '/technology',        mainMenu.id,       1, 'topnav',  'group', 'Cpu',        'Tech category')
  const article  = p('[article]',  '/technology/[slug]', cat1.id,    0, 'hidden',  'page',  'FileText',   'Article detail')
  const cat2     = p('Business',   '/business',          mainMenu.id,       2, 'topnav',  'group', 'Briefcase',  'Business category')
  const article2 = p('[article]',  '/business/[slug]',   cat2.id,    0, 'hidden',  'page',  'FileText',   'Article detail')
  const cat3     = p('Science',    '/science',           mainMenu.id,       3, 'topnav',  'group', 'FlaskConical','Science category')
  const article3 = p('[article]',  '/science/[slug]',    cat3.id,    0, 'hidden',  'page',  'FileText',   'Article detail')
  const search   = p('Search',     '/search',            mainMenu.id,       4, 'topnav',  'page',  'Search',     'Search results')
  const authors  = p('Authors',    '/authors',           footerMenu.id,       5, 'footer',  'page',  'Users',      'Author directory')
  const author   = p('[author]',   '/authors/[slug]',    authors.id, 0, 'hidden',  'page',  'User',       'Author profile')
  const subscribe= p('Subscribe',  '/subscribe',         footerMenu.id,       6, 'footer',  'page',  'Bell',       'Newsletter subscription')

  return {
    id: 'news-media',
    name: 'News & Media',
    description: 'Editorial site with categories, articles, authors, and subscriptions',
    icon: 'Newspaper',
    pages: [rootApp, mainMenu, footerMenu, home, cat1, article, cat2, article2, cat3, article3, search, authors, author, subscribe],
  }
}

// ─── Fintech App ──────────────────────────────────────────────────────────────

function buildFintechProfile(): ArchProfile {
  const p = pageBuilder('fintech')
  const rootApp = p('Fintech App', '/fintech-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('fintech', rootApp.id, 'main', 0)
  const footerMenu = archMenu('fintech', rootApp.id, 'footer', 1)

  const dashboard = p('Dashboard',   '/app',                 mainMenu.id,          0, 'sidebar', 'page',  'LayoutDashboard','Overview')
  const accounts  = p('Accounts',    '/app/accounts',        mainMenu.id,          1, 'sidebar', 'group', 'CreditCard',     'Bank accounts')
  const acctDetail= p('[account]',   '/app/accounts/[id]',   accounts.id,   0, 'hidden',  'page',  'FileText',       'Account detail')
  const txns      = p('Transactions','/app/transactions',    mainMenu.id,          2, 'sidebar', 'page',  'ArrowLeftRight', 'Transaction history')
  const payments  = p('Payments',    '/app/payments',        mainMenu.id,          3, 'sidebar', 'group', 'Send',           'Send & receive')
  const send      = p('Send Money',  '/app/payments/send',   payments.id,   0, 'sidebar', 'page',  'ArrowUpRight',   'Send payment')
  const request   = p('Request',     '/app/payments/request',payments.id,   1, 'sidebar', 'page',  'ArrowDownLeft',  'Request payment')
  const cards     = p('Cards',       '/app/cards',           mainMenu.id,          4, 'sidebar', 'page',  'CreditCard',     'Manage cards')
  const invest    = p('Invest',      '/app/invest',          mainMenu.id,          5, 'sidebar', 'page',  'TrendingUp',     'Investment portfolio')
  const settings  = p('Settings',    '/app/settings',        mainMenu.id,          6, 'sidebar', 'group', 'Settings',       'Account settings')
  const profile   = p('Profile',     '/app/settings/profile',settings.id,   0, 'sidebar', 'page',  'User',           'Personal info')
  const security  = p('Security',    '/app/settings/security',settings.id,  1, 'sidebar', 'page',  'Shield',         '2FA & security')
  const notif     = p('Notifications','/app/settings/notifications',settings.id,2,'sidebar','page','Bell',           'Alert preferences')
  const budget    = p('Budget',       '/app/budget',                 mainMenu.id,          7, 'sidebar', 'page',  'Wallet',         'Budget planner', { layout: 'tabs' })
  const insights  = p('Insights',     '/app/insights',               mainMenu.id,          8, 'sidebar', 'page',  'Lightbulb',      'Spending insights', { layout: 'tabs', layoutWidth: 'fullwidth' })

  return {
    id: 'fintech',
    name: 'Fintech App',
    description: 'Banking/fintech app with accounts, transactions, payments, and cards',
    icon: 'TrendingUp',
    pages: [rootApp, mainMenu, footerMenu, dashboard, accounts, acctDetail, txns, payments, send, request, cards, invest, budget, insights, settings, profile, security, notif],
  }
}

// ─── Enterprise Portal ────────────────────────────────────────────────────────

function buildEnterpriseProfile(): ArchProfile {
  const p = pageBuilder('enterprise')
  const rootApp = p('Enterprise App', '/portal-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('enterprise', rootApp.id, 'main', 0)
  const footerMenu = archMenu('enterprise', rootApp.id, 'footer', 1)

  const home      = p('Home',        '/portal',               mainMenu.id,       0, 'sidebar', 'page',  'Home',           'Portal dashboard')
  const workspace = p('Workspace',   '/portal/workspace',     mainMenu.id,       1, 'sidebar', 'group', 'LayoutGrid',     'Workspace area')
  const projects  = p('Projects',    '/portal/workspace/projects', workspace.id, 0, 'sidebar', 'page', 'FolderOpen','Projects overview')
  const tasks     = p('Tasks',       '/portal/workspace/tasks',    workspace.id, 1, 'sidebar', 'page', 'CheckSquare','Task tracker')
  const docs      = p('Documents',   '/portal/documents',     mainMenu.id,       2, 'sidebar', 'page',  'FileText',       'Document management')
  const people    = p('People',      '/portal/people',        mainMenu.id,       3, 'sidebar', 'group', 'Users',          'HR directory')
  const directory = p('Directory',   '/portal/people/directory', people.id, 0, 'sidebar', 'page', 'BookOpen',     'Employee directory')
  const orgChart  = p('Org Chart',   '/portal/people/org-chart', people.id, 1, 'sidebar', 'page', 'Network',      'Org structure')
  const analytics = p('Analytics',   '/portal/analytics',     mainMenu.id,       4, 'sidebar', 'page',  'BarChart2',      'Business metrics')
  const admin     = p('Admin',       '/portal/admin',         mainMenu.id,       5, 'sidebar', 'group', 'Shield',         'Admin section')
  const users     = p('User Management','/portal/admin/users',admin.id,   0, 'sidebar', 'page',  'Users',          'Manage users')
  const roles     = p('Roles',       '/portal/admin/roles',   admin.id,   1, 'sidebar', 'page',  'Key',            'Role management')
  const audit     = p('Audit Log',   '/portal/admin/audit',   admin.id,   2, 'sidebar', 'page',  'ClipboardList',  'Audit trail')
  const command   = p('Command Center','/portal/command',   mainMenu.id,       6, 'sidebar', 'page',  'LayoutDashboard','Executive command center', { layout: 'tabs', layoutWidth: 'fullwidth' })
  const settings  = p('Settings',    '/portal/settings',      mainMenu.id,       7, 'sidebar', 'page',  'Settings',       'Portal settings')

  return {
    id: 'enterprise',
    name: 'Enterprise Portal',
    description: 'Internal enterprise portal with workspace, HR, analytics, and admin',
    icon: 'Building2',
    pages: [rootApp, mainMenu, footerMenu, home, workspace, projects, tasks, docs, people, directory, orgChart, analytics, admin, users, roles, audit, command, settings],
  }
}

// ─── Social Network ───────────────────────────────────────────────────────────

function buildSocialNetworkProfile(): ArchProfile {
  const p = pageBuilder('social-network')
  const rootApp = p('Social App', '/social-root', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('social-network', rootApp.id, 'main', 0)
  const footerMenu = archMenu('social-network', rootApp.id, 'footer', 1)

  const feed     = p('Feed',       '/home',              mainMenu.id,       0, 'sidebar', 'page',  'Home',         'Activity feed')
  const explore  = p('Explore',    '/explore',           mainMenu.id,       1, 'sidebar', 'page',  'Compass',      'Discover content')
  const profile  = p('Profile',    '/[username]',        mainMenu.id,       2, 'topnav',  'page',  'User',         'User profile')
  const post     = p('[post]',     '/[username]/[id]',   profile.id, 0, 'hidden',  'page',  'MessageSquare','Post detail')
  const messages = p('Messages',   '/messages',          mainMenu.id,       3, 'sidebar', 'page',  'MessageCircle','Direct messages')
  const thread   = p('[thread]',   '/messages/[id]',     messages.id,0, 'hidden',  'page',  'MessageSquare','Message thread')
  const notif    = p('Notifications','/notifications',   mainMenu.id,       4, 'sidebar', 'page',  'Bell',         'Notification center')
  const search   = p('Search',     '/search',            mainMenu.id,       5, 'topnav',  'page',  'Search',       'Search people & posts')
  const settings = p('Settings',   '/settings',          mainMenu.id,       6, 'sidebar', 'group', 'Settings',     'Account settings')
  const privacy  = p('Privacy',    '/settings/privacy',  settings.id,0, 'sidebar', 'page',  'Shield',       'Privacy controls')
  const account  = p('Account',    '/settings/account',  settings.id,1, 'sidebar', 'page',  'User',         'Account settings')

  return {
    id: 'social-network',
    name: 'Social Network',
    description: 'Social platform with feed, explore, profiles, messaging, and notifications',
    icon: 'Users',
    pages: [rootApp, mainMenu, footerMenu, feed, explore, profile, post, messages, thread, notif, search, settings, privacy, account],
  }
}

// ─── Marketplace ─────────────────────────────────────────────────────────────

function buildMarketplaceProfile(): ArchProfile {
  const p = pageBuilder('marketplace')
  const rootApp = p('Marketplace App', '/market-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('marketplace', rootApp.id, 'main', 0)
  const footerMenu = archMenu('marketplace', rootApp.id, 'footer', 1)

  const home    = p('Home',         '/',                    mainMenu.id,       0, 'topnav',  'page',  'Home',         'Marketplace homepage')
  const browse  = p('Browse',       '/browse',              mainMenu.id,       1, 'topnav',  'group', 'LayoutGrid',   'Browse listings')
  const category= p('[category]',   '/browse/[cat]',        browse.id,  0, 'hidden',  'page',  'Tag',          'Category page')
  const listing = p('[listing]',    '/listing/[id]',        mainMenu.id,       2, 'hidden',  'page',  'Package',      'Product/listing detail')
  const cart    = p('Cart',         '/cart',                mainMenu.id,       3, 'topnav',  'page',  'ShoppingCart', 'Shopping cart')
  const checkout= p('Checkout',     '/checkout',            mainMenu.id,       4, 'hidden',  'page',  'CreditCard',   'Checkout flow')
  const seller  = p('Seller Portal','/seller',              mainMenu.id,       5, 'sidebar', 'group', 'Store',        'Seller dashboard')
  const selDash = p('Dashboard',    '/seller/dashboard',    seller.id,  0, 'sidebar', 'page',  'BarChart2',    'Sales dashboard')
  const listings= p('My Listings',  '/seller/listings',     seller.id,  1, 'sidebar', 'page',  'Package',      'Manage listings')
  const orders  = p('Orders',       '/seller/orders',       seller.id,  2, 'sidebar', 'page',  'ShoppingBag',  'Order management')
  const payouts = p('Payouts',      '/seller/payouts',      seller.id,  3, 'sidebar', 'page',  'DollarSign',   'Payout history')
  const account = p('My Account',   '/account',             mainMenu.id,       6, 'hidden',  'page',  'User',         'Buyer account')
  const purchases=p('Purchases',    '/account/purchases',   account.id, 0, 'hidden',  'page',  'ShoppingBag',  'Purchase history')

  return {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Two-sided marketplace with browse, listings, cart, and seller portal',
    icon: 'Store',
    pages: [rootApp, mainMenu, footerMenu, home, browse, category, listing, cart, checkout, seller, selDash, listings, orders, payouts, account, purchases],
  }
}

// ─── Booking Platform ─────────────────────────────────────────────────────────

function buildBookingProfile(): ArchProfile {
  const p = pageBuilder('booking')
  const rootApp = p('Booking App', '/book-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('booking', rootApp.id, 'main', 0)
  const footerMenu = archMenu('booking', rootApp.id, 'footer', 1)

  const home    = p('Home',        '/',                   mainMenu.id,       0, 'topnav',  'page',  'Home',         'Search & discovery')
  const search  = p('Search',      '/search',             mainMenu.id,       1, 'topnav',  'page',  'Search',       'Search results + filters')
  const listing = p('[listing]',   '/listing/[id]',       mainMenu.id,       2, 'hidden',  'page',  'MapPin',       'Listing detail + calendar')
  const book    = p('Book',        '/book/[id]',          listing.id, 0, 'hidden',  'page',  'Calendar',     'Booking form')
  const confirm = p('Confirmation','/booking/[id]',       mainMenu.id,       3, 'hidden',  'page',  'CheckCircle',  'Booking confirmation')
  const trips   = p('Trips',       '/trips',              mainMenu.id,       4, 'topnav',  'page',  'Briefcase',    'My bookings')
  const wishlist= p('Wishlist',    '/wishlist',           mainMenu.id,       5, 'topnav',  'page',  'Heart',        'Saved listings')
  const messages= p('Messages',    '/messages',           mainMenu.id,       6, 'topnav',  'page',  'MessageCircle','Guest-host messaging')
  const host    = p('Host Portal', '/host',               mainMenu.id,       7, 'sidebar', 'group', 'Home',         'Host dashboard')
  const hostDash= p('Dashboard',   '/host/dashboard',     host.id,    0, 'sidebar', 'page',  'BarChart2',    'Host overview')
  const calendar= p('Calendar',    '/host/calendar',      host.id,    1, 'sidebar', 'page',  'Calendar',     'Availability calendar')
  const reviews = p('Reviews',     '/host/reviews',       host.id,    2, 'sidebar', 'page',  'Star',         'Guest reviews')

  return {
    id: 'booking',
    name: 'Booking Platform',
    description: 'Hospitality/booking platform with search, listings, reservations, and host portal',
    icon: 'Calendar',
    pages: [rootApp, mainMenu, footerMenu, home, search, listing, book, confirm, trips, wishlist, messages, host, hostDash, calendar, reviews],
  }
}

// ─── AI Assistant ────────────────────────────────────────────────────────────

function buildAiAssistantProfile(): ArchProfile {
  const p = pageBuilder('ai-assistant')
  const rootApp = p('AI Assistant App', '/ai-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('ai-assistant', rootApp.id, 'main', 0)
  const footerMenu = archMenu('ai-assistant', rootApp.id, 'footer', 1)

  const home    = p('Home',      '/',               mainMenu.id,     0, 'topnav',  'page',  'Home',         'Marketing landing page')
  const pricing = p('Pricing',   '/pricing',        mainMenu.id,     1, 'topnav',  'page',  'DollarSign',   'Plans & credits')
  const login   = p('Sign In',   '/sign-in',        mainMenu.id,     2, 'hidden',  'page',  'LogIn',        'Authentication')
  const signup  = p('Sign Up',   '/sign-up',        mainMenu.id,     3, 'hidden',  'page',  'UserPlus',     'Create account')
  const docs    = p('Docs',      '/docs',           mainMenu.id,     4, 'topnav',  'page',  'BookOpen',     'Developer documentation')
  const app     = p('App',       '/app',            mainMenu.id, 5, 'sidebar', 'group', 'LayoutDashboard','AI workspace')
  const overview= p('Overview',  '/app',            app.id,         0, 'sidebar', 'page',  'BarChart2',    'Usage & activity overview')
  const chat    = p('Chat',      '/app/chat',       app.id,         1, 'sidebar', 'page',  'MessageSquare','Main chat interface', { layoutWidth: 'fullwidth' })
  const history = p('History',   '/app/history',    app.id,         2, 'sidebar', 'page',  'Clock',        'Conversation history')
  const prompts = p('Prompts',   '/app/prompts',    app.id,         3, 'sidebar', 'page',  'Sparkles',     'Prompt library')
  const models  = p('Models',    '/app/models',     app.id,         4, 'sidebar', 'group', 'Cpu',          'Model catalog')
  const modelCat= p('Catalog',   '/app/models/catalog', models.id, 0, 'sidebar', 'page',  'List',         'All models')
  const agents  = p('Agents',    '/app/agents',     app.id,         5, 'sidebar', 'group', 'Bot',          'Custom agents')
  const agentB  = p('Agent Builder','/app/agents/builder', agents.id,0,'sidebar','page',  'Wand2',        'Build an agent', { layout: 'tabs', layoutWidth: 'fullwidth' })
  const knowledge=p('Knowledge', '/app/knowledge',  app.id,         6, 'sidebar', 'page',  'BookMarked',   'RAG knowledge base')
  const memory  = p('Memory',    '/app/memory',     app.id,         7, 'sidebar', 'page',  'Brain',        'Long-term memory')
  const workflows=p('Workflows', '/app/workflows',  app.id,         8, 'sidebar', 'page',  'Workflow',     'Automation flows')
  const evals   = p('Evals',     '/app/evals',      app.id,         9, 'sidebar', 'page',  'FlaskConical', 'Evaluation suites', { layout: 'tabs' })
  const guard   = p('Guardrails','/app/guardrails', app.id,        10, 'sidebar', 'page',  'ShieldAlert',  'Safety policies')
  const tools   = p('Tools',     '/app/tools',      app.id,        11, 'sidebar', 'group', 'Wrench',       'AI tool catalog')
  const imgGen  = p('Image Gen', '/app/tools/image',tools.id,       0, 'sidebar', 'page',  'Image',        'Image generation', { layout: 'tabs' })
  const codeGen = p('Code',      '/app/tools/code', tools.id,       1, 'sidebar', 'page',  'Code2',        'Code assistant', { layout: 'tabs' })
  const playground=p('Playground','/app/playground', app.id,      12, 'sidebar', 'page',  'FlaskConical', 'Model playground', { layout: 'tabs', layoutWidth: 'fullwidth' })
  const compare = p('Compare',   '/app/compare',    app.id,        13, 'sidebar', 'page',  'GitCompare',   'Model comparison', { layout: 'tabs' })
  const usage   = p('Usage',     '/app/usage',      app.id,        14, 'sidebar', 'page',  'BarChart3',    'Token & credit usage', { layout: 'tabs' })
  const team    = p('Team',      '/app/team',       app.id,        15, 'sidebar', 'page',  'Users',        'Workspace members')
  const settings= p('Settings',  '/app/settings',   app.id,        16, 'sidebar', 'group', 'Settings',     'Workspace settings')
  const apiKeys = p('API Keys',  '/app/settings/api', settings.id, 0, 'sidebar', 'page',  'Key',          'API keys & limits')
  const billing = p('Billing',   '/app/settings/billing', settings.id,1,'sidebar','page',  'CreditCard',   'Plans & invoices')

  return {
    id: 'ai-assistant',
    name: 'AI Assistant',
    description: 'AI chat + tools product with marketing site, model selector, usage dashboard, and billing',
    icon: 'Bot',
    pages: [
      rootApp, mainMenu, footerMenu, home, pricing, login, signup, docs,
      app, overview, chat, history, prompts, models, modelCat, agents, agentB,
      knowledge, memory, workflows, evals, guard, tools, imgGen, codeGen,
      playground, compare, usage, team, settings, apiKeys, billing,
    ],
  }
}

// ─── Developer Console ───────────────────────────────────────────────────────

function buildDevConsoleProfile(): ArchProfile {
  const p = pageBuilder('developer-console')
  const rootApp = p('Dev Console App', '/console-root', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('developer-console', rootApp.id, 'main', 0)
  const footerMenu = archMenu('developer-console', rootApp.id, 'footer', 1)

  const home    = p('Home',        '/',                  mainMenu.id,       0, 'topnav',  'page',  'Home',         'Product landing')
  const pricing = p('Pricing',     '/pricing',           mainMenu.id,       1, 'topnav',  'page',  'DollarSign',   'Plans')
  const login   = p('Sign In',     '/sign-in',           mainMenu.id,       2, 'hidden',  'page',  'LogIn',        'Auth')
  const signup  = p('Sign Up',     '/sign-up',           mainMenu.id,       3, 'hidden',  'page',  'UserPlus',     'Register')
  const dash    = p('Overview',    '/console',           mainMenu.id,       4, 'sidebar', 'page',  'LayoutDashboard','Console home')
  const projects= p('Projects',    '/console/projects',  mainMenu.id,       5, 'sidebar', 'group', 'FolderOpen',   'Projects')
  const project = p('Project',     '/console/projects/[id]', projects.id, 0, 'sidebar', 'page', 'FolderOpen', 'Project detail')
  const apis    = p('API Keys',    '/console/keys',      mainMenu.id,       6, 'sidebar', 'page',  'Key',          'Manage API keys')
  const logs    = p('Logs',        '/console/logs',      mainMenu.id,       7, 'sidebar', 'page',  'ScrollText',   'Request logs')
  const usage   = p('Usage',       '/console/usage',     mainMenu.id,       8, 'sidebar', 'page',  'BarChart3',    'Usage & billing')
  const team    = p('Team',        '/console/team',      mainMenu.id,       9, 'sidebar', 'page',  'Users',        'Members & roles')
  const webhooks= p('Webhooks',    '/console/webhooks',  mainMenu.id,       10,'sidebar', 'page',  'Zap',          'Webhook endpoints')
  const docs    = p('Docs',        '/docs',              mainMenu.id,       11,'topnav',  'page',  'BookOpen',     'Documentation')
  const apiref  = p('API Ref',     '/docs/api',          docs.id,    0, 'sidebar', 'page',  'Code2',        'API reference')
  const sdk     = p('SDK',         '/docs/sdk',          docs.id,    1, 'sidebar', 'page',  'Package',      'SDK guides')
  const changelog = p('Changelog', '/changelog',         mainMenu.id,       12,'topnav',  'page',  'Clock',        'Release notes')
  const environments=p('Environments','/console/environments',mainMenu.id,11,'sidebar','page','Server',      'Staging & production')
  const deployments=p('Deployments','/console/deployments',mainMenu.id,12,'sidebar','page','Rocket',       'Deploy history', { layout: 'tabs', layoutWidth: 'fullwidth' })
  const observability=p('Observability','/console/observability',mainMenu.id,13,'sidebar','page','Activity',  'Traces & metrics', { layout: 'tabs' })

  return {
    id: 'developer-console',
    name: 'Developer Console',
    description: 'API platform console with project management, keys, logs, usage, webhooks, and docs',
    icon: 'Terminal',
    pages: [rootApp, mainMenu, footerMenu, home, pricing, login, signup, dash, projects, project, apis, logs, usage, team, webhooks, environments, deployments, observability, docs, apiref, sdk, changelog],
  }
}

// ─── Events Platform ─────────────────────────────────────────────────────────

function buildEventsPlatformProfile(): ArchProfile {
  const p = pageBuilder('events-platform')
  const rootApp = p('Events App', '/events-app', null, 0, 'hidden', 'group', 'Layers', 'Root Application Node')
  const mainMenu = archMenu('events-platform', rootApp.id, 'main', 0)
  const footerMenu = archMenu('events-platform', rootApp.id, 'footer', 1)

  const home     = p('Home',       '/',              mainMenu.id,       0, 'topnav',  'page',  'Home',         'Platform landing')
  const discover = p('Discover',   '/discover',      mainMenu.id,       1, 'topnav',  'page',  'Compass',      'Browse events')
  const login    = p('Sign In',    '/sign-in',       mainMenu.id,       2, 'hidden',  'page',  'LogIn',        'Auth')
  const signup   = p('Sign Up',    '/sign-up',       mainMenu.id,       3, 'hidden',  'page',  'UserPlus',     'Create account')
  const event    = p('Event',      '/events/[id]',   mainMenu.id,       4, 'hidden',  'page',  'Calendar',     'Event detail page')
  const ticket   = p('Tickets',    '/tickets',       mainMenu.id,       5, 'topnav',  'page',  'Ticket',       'My tickets')
  const checkout = p('Checkout',   '/checkout',      mainMenu.id,       6, 'hidden',  'page',  'CreditCard',   'Purchase flow')
  const confirm  = p('Confirmed',  '/confirmed/[id]',mainMenu.id,       7, 'hidden',  'page',  'CheckCircle',  'Ticket confirmation')
  const organizer= p('Organize',   '/organize',      mainMenu.id,       8, 'topnav',  'group', 'CalendarPlus', 'Organizer portal')
  const create   = p('Create Event','/organize/new', organizer.id,0,'sidebar', 'page',  'Plus',         'New event wizard')
  const myEvents = p('My Events',  '/organize/events',organizer.id,1,'sidebar','page',  'Calendar',     'Event management')
  const attendees= p('Attendees',  '/organize/attendees',organizer.id,2,'sidebar','page','Users',       'Attendee list')
  const analytics= p('Analytics',  '/organize/analytics',organizer.id,3,'sidebar','page','BarChart3',   'Event analytics', { layout: 'tabs', layoutWidth: 'fullwidth' })
  const checkIn  = p('Check-in',   '/organize/check-in',  organizer.id,4,'sidebar','page','QrCode',      'Door check-in', { layout: 'tabs' })
  const speakers = p('Speakers',   '/speakers',      mainMenu.id,       9, 'topnav',  'page',  'Mic',          'Speaker directory')
  const profile  = p('Profile',    '/profile/[id]',  mainMenu.id,       10,'hidden',  'page',  'User',         'User profile')

  return {
    id: 'events-platform',
    name: 'Events Platform',
    description: 'Event ticketing and discovery platform with organizer portal, attendee management, and analytics',
    icon: 'CalendarDays',
    pages: [rootApp, mainMenu, footerMenu, home, discover, login, signup, event, ticket, checkout, confirm, organizer, create, myEvents, attendees, analytics, checkIn, speakers, profile],
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
