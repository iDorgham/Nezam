import type { ArchPage, ArchProfileId } from '@/types/arch'
import { inferCanvasMode } from '@/lib/wireframe/canvas-mode'

export type SeedBlockType =
  | 'Nav_TopBar'
  | 'Nav_Sidebar'
  | 'Nav_Mobile'
  | 'Nav_Breadcrumb'
  | 'Nav_Subnav'
  | 'Nav_Footer'
  | 'Layout_StickyCTA'
  | 'Hero_Simple'
  | 'Hero_Centered'
  | 'Hero_Split'
  | 'Content_Text'
  | 'Content_Card'
  | 'Content_Features'
  | 'Content_FeatureBento'
  | 'Content_Pricing'
  | 'Content_FAQ'
  | 'Content_CTA'
  | 'Content_Stats'
  | 'Content_Testimonials'
  | 'Content_Logos'
  | 'Form_Login'
  | 'Form_Contact'
  | 'Form_Newsletter'
  | 'Form_Search'
  | 'Form_Signup'
  | 'Content_BlogGrid'
  | 'Layout_EmptyState'
  | 'Data_KPI_Row'
  | 'Data_Table'
  | 'Data_Chart'
  | 'Data_FilterBar'
  | 'Data_UserTable'
  | 'Data_AnalyticsToolbar'
  | 'Data_AnalyticsOverview'
  | 'Data_AnalyticsChartGrid'
  | 'Content_ContactChannels'
  | 'Content_ContactSplit'
  | 'Content_UserInvite'
  | 'Content_ProfileHeader'
  | 'Content_AboutHero'
  | 'Content_AboutValues'
  | 'Content_AboutTimeline'
  | 'Content_DangerZone'
  | 'Form_ProfileDetails'
  | 'Form_SettingsSections'
  | 'Layout_ProfileTabs'
  | 'Layout_SettingsShell'
  | 'Layout_PageHeader'
  | 'Layout_TwoColumn'
  | 'Layout_AuthSplit'
  | 'Art_Hero_Cinematic'
  | 'Art_Hero_Bento'
  | 'Art_Hero_StatsFloat'
  | 'Art_BentoGrid_4'
  | 'Art_BentoGrid_6'
  | 'Art_Feature_Zigzag'
  | 'Art_Feature_IconMatrix'
  | 'Art_Pricing_Spotlight'
  | 'Art_Testimonial_Spotlight'
  | 'Art_Testimonial_Masonry'
  | 'Art_Logos_Marquee'
  | 'Art_Stats_BigNumber'
  | 'Art_Team_Portraits'
  | 'Art_CaseStudy_Row'
  | 'Art_Gallery_Masonry'
  | 'Art_Media_SplitCinematic'
  | 'Art_Comparison_Matrix'
  | 'Art_CTA_Band'
  | 'Art_Newsletter_Card'
  | 'Art_FAQ_Split'
  | 'Art_Blog_Featured'
  | 'Art_Integrations_Wall'
  | 'Art_Process_Timeline'
  | 'Art_Product_Highlight'
  | 'Art_AppPreview_Frame'

export type SeedPageSessionSection = {
  section_id: string
  block_type: SeedBlockType
  order: number
  approved: boolean
  locked_props: Record<string, unknown>
  flexible_props: Record<string, unknown>
  content_slots: Record<string, unknown>
  states: Record<string, unknown>
}

/** Appends shared chrome (breadcrumb, subnav, CTAs, footers) without rewriting curated stacks. */
function polishSeedStack(stack: SeedBlockType[], page: ArchPage): SeedBlockType[] {
  if (stack.length === 0) return stack
  if (stack.length === 1 && (stack[0] === 'Layout_AuthSplit' || stack[0] === 'Hero_Centered')) {
    return stack
  }

  const route = page.route.toLowerCase()
  const result = [...stack]
  const hasSidebar = result.includes('Nav_Sidebar')
  const hasTopBar = result.includes('Nav_TopBar')
  const hasMobile = result.includes('Nav_Mobile')
  const hasSettingsShell = result.includes('Layout_SettingsShell')
  const toolbarLead = result[1] === 'Data_AnalyticsToolbar'
  const heroSecond =
    result[1]?.startsWith('Art_Hero') ||
    result[1]?.startsWith('Content_About') ||
    result[1] === 'Hero_Centered'

  const insertAfter = (types: SeedBlockType[], after: SeedBlockType) => {
    const idx = result.indexOf(after)
    if (idx < 0) return
    let at = idx + 1
    for (const t of types) {
      if (!result.includes(t)) {
        result.splice(at, 0, t)
        at += 1
      }
    }
  }

  const appendUnique = (...types: SeedBlockType[]) => {
    for (const t of types) {
      if (!result.includes(t)) result.push(t)
    }
  }

  const insertBefore = (types: SeedBlockType[], before: SeedBlockType) => {
    const idx = result.indexOf(before)
    const at = idx >= 0 ? idx : result.length
    for (let i = types.length - 1; i >= 0; i--) {
      const t = types[i]!
      if (!result.includes(t)) result.splice(at, 0, t)
    }
  }

  if (hasSidebar && !hasSettingsShell) {
    if (!result.includes('Layout_PageHeader') && !toolbarLead) {
      const sideIdx = result.indexOf('Nav_Sidebar')
      result.splice(sideIdx + 1, 0, 'Layout_PageHeader')
    }
    const chromeAnchor: SeedBlockType = result.includes('Layout_PageHeader')
      ? 'Layout_PageHeader'
      : toolbarLead
        ? 'Data_AnalyticsToolbar'
        : 'Nav_Sidebar'
    insertAfter(['Nav_Breadcrumb'], chromeAnchor)

    const wantsSubnav =
      result.includes('Layout_ProfileTabs') ||
      /\/(workspaces|members|settings|tabs|segments|reports)/.test(route) ||
      page.name.toLowerCase().includes('settings')
    if (wantsSubnav && !result.includes('Nav_Subnav')) {
      insertAfter(['Nav_Subnav'], 'Nav_Breadcrumb')
    }

    if (
      result.length >= 4 &&
      !result.includes('Content_CTA') &&
      !result.includes('Form_Newsletter') && !result.includes('Art_Newsletter_Card')
    ) {
      if (
        !result.includes('Content_Stats') &&
        (result.includes('Data_Table') || result.includes('Data_KPI_Row'))
      ) {
        appendUnique('Content_Stats')
      }
      appendUnique('Content_CTA')
    }
  }

  if (hasTopBar || hasMobile) {
    if (hasTopBar && !result.includes('Layout_PageHeader') && !heroSecond) {
      insertAfter(['Layout_PageHeader'], 'Nav_TopBar')
    }
    if (
      !result.includes('Art_CTA_Band') &&
      !result.includes('Content_CTA') &&
      !result.includes('Form_Newsletter') &&
      !result.includes('Art_Newsletter_Card') &&
      !route.includes('/checkout') &&
      !route.includes('/cart')
    ) {
      insertBefore(['Art_CTA_Band'], 'Nav_Footer')
      if (!result.includes('Nav_Footer')) appendUnique('Art_CTA_Band')
    }
    if (!result.includes('Layout_StickyCTA')) {
      insertBefore(['Layout_StickyCTA'], 'Nav_Footer')
      if (!result.includes('Nav_Footer')) appendUnique('Layout_StickyCTA')
    }
    if ((hasTopBar || hasMobile) && !result.includes('Nav_Footer')) {
      appendUnique('Nav_Footer')
    }
  }

  return result
}

function buildStack(params: {
  page: ArchPage
  profileId: ArchProfileId | null
}): SeedBlockType[] {
  return polishSeedStack(buildStackCore(params), params.page)
}

function buildStackCore(params: {
  page: ArchPage
  profileId: ArchProfileId | null
}): SeedBlockType[] {
  const { page, profileId } = params
  const mode = inferCanvasMode(profileId)
  const route = page.route.toLowerCase()
  const name = page.name.toLowerCase()
  const sidebarLayout = page.layout === 'sidebar' || page.navSlot === 'sidebar'
  const isAnalyticsProfile = profileId === 'analytics'

  const isHome =
    !isAnalyticsProfile &&
    (route === '/' || route === '/home' || name.includes('home'))
  const isPricing = route.includes('pricing') || name.includes('pricing')
  const isLogin =
    route.includes('login') ||
    route.includes('sign-in') ||
    route.includes('forgot') ||
    name.includes('login') ||
    name.includes('sign in') ||
    name.includes('forgot')
  const isSignup =
    route.includes('signup') ||
    route.includes('sign-up') ||
    route.includes('register') ||
    name.includes('sign up') ||
    name.includes('signup')
  const isContact = route.includes('contact') || name.includes('contact')
  const isDocs = route.includes('docs') || route.includes('guide') || name.includes('docs')
  const isBlogListing =
    (route === '/blog' || route.endsWith('/blog')) &&
    !route.includes('[slug]') &&
    !route.includes('/admin') &&
    !route.includes('/dashboard')
  const isBlogHome = profileId === 'blog' && isHome
  const isPortfolioProject = route.includes('/work/') || name === '[project]'
  const isWorkGallery = route === '/work' || name === 'work'
  const isProductSlug = route.includes('/products/') && route.includes('[slug]')
  const isArticle =
    !isPortfolioProject &&
    !isProductSlug &&
    (route.includes('/article') ||
      name.includes('article') ||
      (route.includes('[slug]') &&
        (route.includes('/blog') || route.includes('/news') || name === '[slug]')))
  const isCheckout = route.includes('checkout') || name.includes('checkout')
  const isCart = route.includes('cart') || route.includes('basket') || name.includes('cart')
  const isOrderSuccess = route.includes('success') || route.includes('thank') || name.includes('success')
  const isApiKeys =
    route.includes('api-keys') ||
    route.includes('/keys') ||
    name.includes('api key') ||
    name === 'api keys'
  const isWebhooks = route.includes('webhook') || name.includes('webhook')
  const isLogs = route.includes('/logs') || name === 'logs' || name.includes('log stream')
  const isApiDocs =
    (route.includes('api') || name.includes('api')) &&
    !isApiKeys &&
    !isWebhooks &&
    !isLogs
  const isMediaLibrary =
    (route.includes('/media') || name === 'media') &&
    (route.includes('/dashboard') || route.includes('/admin'))
  const isInbox = route.includes('/inbox') || name === 'inbox'
  const isNotifications =
    !isInbox &&
    (route.includes('notification') || name.includes('notification'))
  const isTeamApp =
    (route.includes('/team') || name === 'team') &&
    (sidebarLayout || route.includes('/app') || route.includes('/dashboard'))
  const isTeamMarketing =
    (route.includes('team') || name.includes('team')) && !isTeamApp
  const isAbout = route.includes('/about') || (name.includes('about') && !name.includes('dashboard'))
  const isUsers =
    (route.includes('/users') ||
      route.includes('user-management') ||
      name === 'users' ||
      name.includes('user list')) &&
    !isTeamApp &&
    !route.includes('profile')
  const isSettings =
    (route.includes('settings') || name.includes('settings')) &&
    !route.includes('profile') &&
    !name.includes('profile')
  const isProfile =
    (route.includes('profile') || name.includes('profile')) && !isSettings
  const isAnalytics =
    isAnalyticsProfile ||
    (route.includes('analytics') && sidebarLayout)
  const isOnboarding = route.includes('onboarding') || name.includes('onboarding') || name.includes('welcome')
  const isErrorPage = route.includes('404') || route.includes('not-found') || name.includes('404')
  const isProductList =
    route === '/products' ||
    route.endsWith('/products') ||
    route.includes('shop') ||
    route.includes('catalog') ||
    name.includes('product list') ||
    name === 'products'
  const isProductDetail =
    (route.includes('product') || route.includes('/item') || isProductSlug) &&
    !isProductList
  const isFeatures = route.includes('/features') || name === 'features'
  const isFaq = route.includes('/faq') || name === 'faq'
  const isNewsletter = route.includes('newsletter') || name === 'newsletter'
  const isLegal =
    route.includes('/legal') ||
    route.includes('/privacy') ||
    route.includes('/terms') ||
    name.includes('privacy') ||
    name.includes('terms')
  const isChangelog = route.includes('changelog') || name.includes('changelog')
  const isSearch = route.includes('/search') || name === 'search'
  const isCmsContent =
    (route.includes('/dashboard/content') &&
      !route.includes('/editor') &&
      !route.includes('/builder')) ||
    (name === 'content' && route.includes('/dashboard'))
  const isCmsPages =
    route.includes('/dashboard/pages') || (name === 'pages' && route.includes('/dashboard'))
  const isAdminPosts =
    route.includes('/admin/posts') ||
    route.includes('/dashboard/posts') ||
    (route.includes('/posts') && sidebarLayout && route.includes('/admin'))
  const isAdminCategories =
    route.includes('/admin/categories') ||
    (route.includes('/categories') && sidebarLayout && route.includes('/admin'))
  const isBilling =
    route.includes('/billing') || name === 'billing' || name.includes('subscription')
  const isIntegrations = route.includes('integration') || name.includes('integration')
  const isReports =
    route.includes('/reports') || name === 'reports' || name.includes('report')
  const isCustomReport = route.includes('/reports/custom') || name.includes('custom report')
  const isDataExplorer =
    route.includes('data-explorer') ||
    route.includes('/explorer') ||
    name.includes('data explorer')
  const isAlerts = route.includes('/alerts') || name === 'alerts'
  const isProjectsList =
    (route.includes('/projects') && !route.includes('[id]') && !route.includes('[slug]')) ||
    name === 'projects'
  const isProjectDetail =
    route.includes('/projects/') &&
    (route.includes('[id]') || route.includes('[slug]'))
  const isTasks = route.includes('/tasks') || name === 'my tasks' || name === 'tasks'
  const isCalendar = route.includes('/calendar') || name === 'calendar'
  const isOrders = route.includes('/orders') || name === 'orders'
  const isWishlist = route.includes('wishlist') || name.includes('wishlist')
  const isDiscover =
    route.includes('/discover') ||
    route.includes('/browse') ||
    name === 'discover' ||
    name === 'browse'
  const isSellerDashboard =
    route.includes('/seller') || name.includes('seller') || name.includes('host dashboard')
  const isResume = route.includes('/resume') || name === 'resume'
  const isTagsListing = route === '/tags' || name === 'tags'
  const isTagPage = route.includes('/tags/') || name === '[tag]'
  const isSecurity =
    route.includes('/security') || name === 'security' || name.includes('security settings')
  const isDashboard =
    !isAnalytics &&
    (route.includes('dashboard') ||
      route.includes('/app') ||
      name.includes('dashboard'))
  const isTabLayout = page.layout === 'tabs'
  const isContentEditor =
    route.includes('/editor') ||
    route.includes('/builder') ||
    name.includes('content editor') ||
    name.includes('page builder')
  const isRoles =
    route.includes('/roles') || name === 'roles' || name.includes('roles & permissions')
  const isActivityLog = route.includes('/activity') || name.includes('activity log')
  const isAuditLog =
    (route.includes('/audit') || name.includes('audit log')) && !isActivityLog
  const isWorkspaces = route.includes('/workspaces') || name === 'workspaces'
  const isUsagePage =
    (route.endsWith('/usage') || name === 'usage') &&
    sidebarLayout &&
    !route.includes('/docs')
  const isSegments = route.includes('/segments') || name === 'segments'
  const isFunnels = route.includes('/funnels') || name === 'funnels'
  const isCohorts = route.includes('/cohorts') || name === 'cohorts'
  const isKanban = route.includes('/kanban') || name === 'kanban'
  const isAutomations = route.includes('/automation') || name === 'automations'
  const isInventory = route.includes('/inventory') || name === 'inventory'
  const isPromotions = route.includes('/promotion') || name === 'promotions'
  const isBudget = route.includes('/budget') || name === 'budget'
  const isInsights = route.includes('/insights') || name === 'insights'
  const isEnvironments = route.includes('/environments') || name === 'environments'
  const isDeployments = route.includes('/deployments') || name === 'deployments'
  const isObservability = route.includes('/observability') || name === 'observability'
  const isPlayground = route.includes('/playground') || name === 'playground'
  const isCompareModels =
    route.includes('/compare') && (route.includes('/app') || sidebarLayout)
  const isCheckIn = route.includes('/check-in') || name.includes('check-in')
  const isApiAccess =
    route.includes('/settings/api') || name.includes('api access')
  const isOverview =
    name === 'overview' ||
    route.endsWith('/overview') ||
    (route === '/app' && name === 'overview')
  const isAiProfile = profileId === 'ai-assistant'
  const isAiChat =
    isAiProfile && (route.includes('/chat') || name === 'chat')
  const isAiHistory =
    isAiProfile && (route.includes('/history') || name === 'history')
  const isAiPrompts =
    isAiProfile && (route.includes('/prompts') || name === 'prompts')
  const isAiToolsHub =
    isAiProfile &&
    (route === '/app/tools' || (name === 'tools' && route.endsWith('/tools')))
  const isAiImageTool =
    isAiProfile &&
    (route.includes('/tools/image') || name.includes('image gen'))
  const isAiCodeTool =
    isAiProfile && (route.includes('/tools/code') || name === 'code')
  const isAiModelCatalog =
    isAiProfile &&
    (route.includes('/models/catalog') ||
      (name === 'catalog' && route.includes('/models')))
  const isAiAgentBuilder =
    isAiProfile &&
    (route.includes('/agents/builder') || name.includes('agent builder'))
  const isAiAgents =
    isAiProfile &&
    (route.includes('/agents') || name === 'agents') &&
    !isAiAgentBuilder
  const isAiKnowledge =
    isAiProfile && (route.includes('/knowledge') || name === 'knowledge')
  const isAiMemory =
    isAiProfile && (route.includes('/memory') || name === 'memory')
  const isAiWorkflows =
    isAiProfile && (route.includes('/workflow') || name === 'workflows')
  const isAiEvals =
    isAiProfile && (route.includes('/eval') || name === 'evals')
  const isAiGuardrails =
    isAiProfile && (route.includes('/guardrail') || name === 'guardrails')
  const isProductMetrics =
    sidebarLayout && (route.includes('/metrics') || name === 'metrics')
  const isMembersPage =
    sidebarLayout && (route.includes('/members') || name === 'members')
  const isRealtime =
    isAnalyticsProfile &&
    (route.includes('/realtime') || name.includes('real-time'))
  const isGoals =
    isAnalyticsProfile && (route.includes('/goals') || name === 'goals')
  const isCommandCenter =
    (route.includes('/command') || name.includes('command center')) && sidebarLayout

  const advancedSidebarDashboard: SeedBlockType[] = [
    'Nav_Sidebar',
    'Layout_PageHeader',
    'Nav_Breadcrumb',
    'Data_KPI_Row',
    'Data_FilterBar',
    'Data_AnalyticsOverview',
    'Data_AnalyticsChartGrid',
    'Data_Table',
    'Content_Stats',
    'Content_CTA',
  ]

  if (mode === 'mobile') {
    return [
      'Nav_Mobile',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Content_Features',
      'Content_Card',
      'Content_CTA',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isLogin || isSignup) {
    return ['Layout_AuthSplit']
  }

  if (isContact) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Content_ContactSplit',
      'Content_ContactChannels',
      'Nav_Footer',
    ]
  }

  if (isAbout) {
    return [
      'Nav_TopBar',
      'Content_AboutHero',
      'Content_AboutValues',
      'Content_AboutTimeline',
      'Art_Team_Portraits',
      'Nav_Footer',
    ]
  }

  if (isDocs && sidebarLayout) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Layout_TwoColumn', 'Content_Text', 'Data_Table', 'Content_FAQ']
  }

  if (isDocs) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Layout_TwoColumn',
      'Content_Text',
      'Data_Table',
      'Content_FAQ',
      'Nav_Footer',
    ]
  }

  if (isPortfolioProject) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Art_CaseStudy_Row',
      'Art_Gallery_Masonry',
      'Content_CTA',
      'Nav_Footer',
    ]
  }

  if (isWorkGallery) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Art_Gallery_Masonry',
      'Art_CaseStudy_Row',
      'Content_CTA',
      'Art_CTA_Band',
      'Layout_StickyCTA',
      'Nav_Footer',
    ]
  }

  if (isArticle) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Content_Text', 'Content_CTA', 'Nav_Footer']
  }

  if (isBlogListing) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Art_Blog_Featured',
      'Content_BlogGrid',
      'Content_CTA',
      'Nav_Footer',
    ]
  }

  if (isBlogHome) {
    return [
      'Nav_TopBar',
      'Art_Blog_Featured',
      'Content_BlogGrid',
      'Art_Newsletter_Card',
      'Nav_Footer',
    ]
  }

  if (isFeatures) {
    return [
      'Nav_TopBar',
      'Art_Hero_Cinematic',
      'Content_FeatureBento',
      'Art_Feature_Zigzag',
      'Art_AppPreview_Frame',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isFaq) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Art_FAQ_Split', 'Content_CTA', 'Nav_Footer']
  }

  if (isNewsletter) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Art_Newsletter_Card',
      'Form_Newsletter',
      'Content_CTA',
      'Nav_Footer',
    ]
  }

  if (isLegal || isChangelog) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Content_Text',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isSearch) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Form_Search',
      'Content_BlogGrid',
      'Content_CTA',
      'Nav_Footer',
    ]
  }

  if (isCheckout) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Layout_TwoColumn',
      'Form_Contact',
      'Data_Table',
      'Content_CTA',
      'Layout_StickyCTA',
      'Nav_Footer',
    ]
  }

  if (isCart) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Data_Table',
      'Content_Stats',
      'Content_CTA',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isOrderSuccess) {
    return [
      'Nav_TopBar',
      'Layout_PageHeader',
      'Content_Text',
      'Content_Stats',
      'Content_CTA',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isApiKeys) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_Table', 'Content_DangerZone']
  }

  if (isWebhooks) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_Table', 'Form_Contact']
  }

  if (isLogs) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Data_FilterBar',
      'Data_Table',
      'Data_Chart',
      'Content_CTA',
    ]
  }

  if (isApiDocs) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Layout_TwoColumn', 'Data_Table', 'Data_Chart']
  }

  if (isMediaLibrary || isAdminPosts || isAdminCategories) {
    if (isCmsPages || isAdminPosts) {
      return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_FilterBar', 'Data_Table', 'Layout_EmptyState']
    }
    if (isAdminCategories) {
      return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_Table', 'Content_Card']
    }
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_FilterBar', 'Art_Gallery_Masonry']
  }

  if (isCmsContent) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_FilterBar', 'Data_Table', 'Content_Card']
  }

  if (isCmsPages) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_Table', 'Layout_EmptyState']
  }

  if (isInbox) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_FilterBar', 'Data_Table']
  }

  if (isNotifications) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_Table', 'Content_Stats']
  }

  if (isTeamMarketing) {
    return [
      'Nav_TopBar',
      'Art_Hero_Cinematic',
      'Art_Team_Portraits',
      'Art_Testimonial_Spotlight',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isTeamApp) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Art_Team_Portraits', 'Data_UserTable']
  }

  if (isUsers) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Content_UserInvite', 'Data_UserTable']
  }

  if (isProfile) {
    const nav: SeedBlockType = sidebarLayout ? 'Nav_Sidebar' : 'Nav_TopBar'
    return [nav, 'Content_ProfileHeader', 'Layout_ProfileTabs', 'Form_ProfileDetails']
  }

  if (isSecurity) {
    return ['Nav_Sidebar', 'Layout_SettingsShell', 'Form_SettingsSections', 'Content_DangerZone']
  }

  if (isSettings) {
    return [
      'Nav_Sidebar',
      'Layout_SettingsShell',
      'Form_SettingsSections',
      'Content_DangerZone',
    ]
  }

  if (isBilling) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Content_Pricing', 'Data_Table']
  }

  if (isIntegrations) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Art_Integrations_Wall', 'Data_Table']
  }

  if (isCustomReport) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_FilterBar', 'Data_Chart', 'Form_Contact']
  }

  if (isReports) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_Table', 'Data_Chart']
  }

  if (isDataExplorer) {
    return ['Nav_Sidebar', 'Data_AnalyticsToolbar', 'Data_FilterBar', 'Data_Table', 'Data_Chart']
  }

  if (isAlerts) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_Table', 'Content_FAQ']
  }

  if (isContentEditor) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_TwoColumn',
      'Data_FilterBar',
      'Content_Text',
      'Data_Table',
      'Layout_EmptyState',
    ]
  }

  if (isRoles) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Data_UserTable',
      'Data_Table',
      'Content_DangerZone',
    ]
  }

  if (isActivityLog || isAuditLog) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Data_Table',
      'Data_Chart',
      'Content_Stats',
    ]
  }

  if (isApiAccess) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_Table',
      'Content_DangerZone',
      'Data_FilterBar',
    ]
  }

  if (isWorkspaces) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_KPI_Row',
      'Content_Card',
      'Data_UserTable',
    ]
  }

  if (isUsagePage) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_KPI_Row',
      'Data_AnalyticsChartGrid',
      'Data_Table',
      'Content_Pricing',
    ]
  }

  if (isProductMetrics) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_ProfileTabs',
      'Data_KPI_Row',
      'Data_AnalyticsChartGrid',
      'Data_Table',
      'Data_AnalyticsOverview',
    ]
  }

  if (isMembersPage) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Data_Table',
      'Content_Card',
      'Data_KPI_Row',
    ]
  }

  if (isRealtime || isCommandCenter) {
    return [
      'Nav_Sidebar',
      'Data_AnalyticsToolbar',
      'Data_KPI_Row',
      'Data_AnalyticsOverview',
      'Data_AnalyticsChartGrid',
      'Data_Table',
      'Data_FilterBar',
    ]
  }

  if (isGoals) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_ProfileTabs',
      'Data_KPI_Row',
      'Data_AnalyticsChartGrid',
      'Data_Table',
    ]
  }

  if (isSegments || isFunnels || isCohorts) {
    return [
      'Nav_Sidebar',
      'Data_AnalyticsToolbar',
      'Data_FilterBar',
      'Data_AnalyticsOverview',
      'Data_AnalyticsChartGrid',
      'Data_Table',
      'Data_Chart',
    ]
  }

  if (isKanban) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Layout_TwoColumn',
      'Content_Card',
      'Data_Table',
    ]
  }

  if (isAutomations) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Data_Table',
      'Content_Features',
      'Content_DangerZone',
    ]
  }

  if (isInventory) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Data_KPI_Row',
      'Data_Table',
      'Layout_EmptyState',
    ]
  }

  if (isPromotions) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Data_Table',
      'Content_Pricing',
      'Content_Stats',
    ]
  }

  if (isBudget || isInsights) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_KPI_Row',
      'Data_AnalyticsChartGrid',
      'Data_Chart',
      'Content_Stats',
    ]
  }

  if (isEnvironments) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_Table',
      'Content_Card',
      'Content_DangerZone',
    ]
  }

  if (isDeployments || isObservability) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_KPI_Row',
      'Data_FilterBar',
      'Data_AnalyticsChartGrid',
      'Data_Table',
      'Data_Chart',
    ]
  }

  if (isAiChat) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_TwoColumn',
      'Art_AppPreview_Frame',
      'Content_Text',
      'Content_Card',
      'Data_FilterBar',
    ]
  }

  if (isAiHistory) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Data_Table',
      'Content_Card',
      'Layout_EmptyState',
    ]
  }

  if (isAiPrompts) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Content_Card',
      'Data_Table',
      'Content_Features',
    ]
  }

  if (isAiToolsHub) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Content_Features',
      'Art_Integrations_Wall',
      'Content_Card',
      'Data_Table',
    ]
  }

  if (isAiImageTool) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_TwoColumn',
      'Art_Gallery_Masonry',
      'Data_FilterBar',
      'Content_Text',
      'Content_CTA',
    ]
  }

  if (isAiCodeTool) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_TwoColumn',
      'Art_AppPreview_Frame',
      'Content_Text',
      'Data_FilterBar',
      'Data_Table',
    ]
  }

  if (isAiModelCatalog) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Data_Table',
      'Art_Comparison_Matrix',
      'Content_Card',
    ]
  }

  if (isAiAgentBuilder) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_ProfileTabs',
      'Layout_TwoColumn',
      'Art_AppPreview_Frame',
      'Data_FilterBar',
      'Content_Text',
    ]
  }

  if (isAiAgents) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Content_Card',
      'Data_Table',
      'Layout_TwoColumn',
    ]
  }

  if (isAiKnowledge) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_TwoColumn',
      'Data_FilterBar',
      'Data_Table',
      'Content_Text',
      'Content_FAQ',
    ]
  }

  if (isAiMemory) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Content_Card',
      'Data_Table',
      'Content_Text',
      'Data_FilterBar',
    ]
  }

  if (isAiWorkflows) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Layout_TwoColumn',
      'Content_Features',
      'Data_Table',
    ]
  }

  if (isAiEvals) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_ProfileTabs',
      'Data_FilterBar',
      'Data_AnalyticsChartGrid',
      'Data_Table',
    ]
  }

  if (isAiGuardrails) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_Table',
      'Content_DangerZone',
      'Content_FAQ',
      'Data_FilterBar',
    ]
  }

  if (isPlayground) {
    if (isAiProfile) {
      return [
        'Nav_Sidebar',
        'Layout_PageHeader',
        'Layout_ProfileTabs',
        'Layout_TwoColumn',
        'Art_AppPreview_Frame',
        'Data_FilterBar',
        'Content_Text',
        'Data_Table',
      ]
    }
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_TwoColumn',
      'Content_Text',
      'Data_FilterBar',
      'Content_CTA',
    ]
  }

  if (isCompareModels) {
    if (isAiProfile) {
      return [
        'Nav_Sidebar',
        'Layout_PageHeader',
        'Layout_ProfileTabs',
        'Art_Comparison_Matrix',
        'Data_FilterBar',
        'Data_AnalyticsChartGrid',
        'Data_Table',
      ]
    }
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_TwoColumn',
      'Data_FilterBar',
      'Data_AnalyticsChartGrid',
      'Data_Table',
    ]
  }

  if (isCheckIn) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_FilterBar',
      'Data_Table',
      'Data_KPI_Row',
      'Content_Stats',
    ]
  }

  if (isTabLayout && sidebarLayout) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Layout_ProfileTabs',
      'Data_FilterBar',
      'Data_KPI_Row',
      'Data_AnalyticsChartGrid',
      'Data_Table',
    ]
  }

  if (isAnalytics) {
    return [
      'Nav_Sidebar',
      'Data_AnalyticsToolbar',
      'Data_AnalyticsOverview',
      'Data_AnalyticsChartGrid',
      'Data_Table',
    ]
  }

  if (isOnboarding) {
    return ['Layout_PageHeader', 'Content_Text', 'Form_Signup', 'Content_CTA']
  }

  if (isErrorPage) {
    return ['Layout_EmptyState', 'Content_CTA']
  }

  if (isProjectDetail) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_KPI_Row', 'Data_Chart', 'Data_Table']
  }

  if (isProjectsList) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_FilterBar', 'Content_Card', 'Data_Table']
  }

  if (isTasks) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_FilterBar', 'Data_Table']
  }

  if (isCalendar) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Layout_TwoColumn', 'Content_Card']
  }

  if (isOrders || isWishlist) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Content_Card', 'Data_Table']
  }

  if (isDiscover) {
    return ['Nav_TopBar', 'Form_Search', 'Data_FilterBar', 'Content_Card', 'Nav_Footer']
  }

  if (isSellerDashboard) {
    return ['Nav_Sidebar', 'Layout_PageHeader', 'Data_KPI_Row', 'Data_Table', 'Data_Chart']
  }

  if (isResume) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Content_Text', 'Art_Process_Timeline', 'Nav_Footer']
  }

  if (isTagsListing || isTagPage) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Content_BlogGrid', 'Nav_Footer']
  }

  if (isProductDetail) {
    return [
      'Nav_TopBar',
      'Art_Product_Highlight',
      'Layout_TwoColumn',
      'Art_Comparison_Matrix',
      'Content_CTA',
      'Nav_Footer',
    ]
  }

  if (isProductList) {
    return ['Nav_TopBar', 'Layout_PageHeader', 'Form_Search', 'Content_Card', 'Nav_Footer']
  }

  if (isHome) {
    return [
      'Nav_TopBar',
      'Art_Hero_Bento',
      'Art_Logos_Marquee',
      'Art_Feature_IconMatrix',
      'Art_Stats_BigNumber',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isPricing) {
    return [
      'Nav_TopBar',
      'Art_Hero_StatsFloat',
      'Art_Pricing_Spotlight',
      'Art_Comparison_Matrix',
      'Art_FAQ_Split',
      'Art_CTA_Band',
      'Nav_Footer',
    ]
  }

  if (isOverview && sidebarLayout) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_KPI_Row',
      'Data_FilterBar',
      'Data_Table',
      'Data_Chart',
    ]
  }

  if (sidebarLayout || (mode === 'saas' && isDashboard)) {
    return advancedSidebarDashboard
  }

  if (isDashboard) {
    return [
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_KPI_Row',
      'Data_FilterBar',
      'Data_Chart',
      'Data_Table',
    ]
  }

  return [
    'Nav_TopBar',
    'Layout_PageHeader',
    'Nav_Breadcrumb',
    'Content_Text',
    'Content_Features',
    'Art_CTA_Band',
    'Layout_StickyCTA',
    'Nav_Footer',
  ]
}

function createSection(block_type: SeedBlockType, order: number): SeedPageSessionSection {
  return {
    section_id: `seed-${block_type}-${order + 1}`,
    block_type,
    order,
    approved: true,
    locked_props: {},
    flexible_props: {},
    content_slots: {},
    states: {},
  }
}

const SEED_SECTIONS_CACHE = new Map<string, SeedPageSessionSection[]>()

export function seedPageSectionsCacheKey(
  page: ArchPage,
  profileId: ArchProfileId | null,
): string {
  return [
    profileId ?? 'null',
    page.id,
    page.route,
    page.name,
    page.layout ?? '',
    page.navSlot ?? '',
    page.type,
    page.layoutWidth ?? '',
  ].join('|')
}

export function clearSeedPageSectionsCache(): void {
  SEED_SECTIONS_CACHE.clear()
}

export function warmSeedPageSectionsCache(
  pages: ArchPage[],
  profileId: ArchProfileId | null,
): void {
  for (const page of pages) {
    if (page.type !== 'page' && page.type !== 'subpage') continue
    buildSeedPageSections({ page, profileId })
  }
}

export function warmSeedPageSectionsCacheForProfiles(
  pages: ArchPage[],
  profileIds: ArchProfileId[],
): void {
  for (const profileId of profileIds) {
    warmSeedPageSectionsCache(pages, profileId)
  }
}

export function buildSeedPageSections(params: {
  page: ArchPage
  profileId: ArchProfileId | null
}): SeedPageSessionSection[] {
  const key = seedPageSectionsCacheKey(params.page, params.profileId)
  const hit = SEED_SECTIONS_CACHE.get(key)
  if (hit) return hit

  const stack = buildStack(params)
  const result = stack.map((blockType, idx) => createSection(blockType, idx))
  SEED_SECTIONS_CACHE.set(key, result)
  return result
}
