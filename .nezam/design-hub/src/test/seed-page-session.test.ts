import { describe, expect, it } from 'vitest'

import { ARCH_PROFILES } from '../data/arch-profiles'
import {
  buildSeedPageSections,
  clearSeedPageSectionsCache,
  seedPageSectionsCacheKey,
  warmSeedPageSectionsCache,
} from '../lib/wireframe/seed-page-session'
import type { ArchPage } from '../types/arch'

function findCmsPage(name: string): ArchPage {
  const profile = ARCH_PROFILES.find((p) => p.id === 'cms')
  const match = profile?.pages.find((p) => p.name === name && p.type === 'page')
  if (!match) throw new Error(`CMS page not found: ${name}`)
  return match
}

function findAnalyticsOverview(): ArchPage {
  const profile = ARCH_PROFILES.find((p) => p.id === 'analytics')
  const match = profile?.pages.find((p) => p.name === 'Overview' && p.route === '/')
  if (!match) throw new Error('Analytics Overview page not found')
  return match
}

function findSaasOverview(): ArchPage {
  const profile = ARCH_PROFILES.find((p) => p.id === 'saas')
  const match = profile?.pages.find((p) => p.name === 'Overview' && p.route === '/app')
  if (!match) throw new Error('SaaS Overview page not found')
  return match
}

function findCmsDashboardPage(name: string): ArchPage {
  const profile = ARCH_PROFILES.find((p) => p.id === 'cms')
  const match = profile?.pages.find(
    (p) => p.name === name && p.route.startsWith('/dashboard/'),
  )
  if (!match) throw new Error(`CMS dashboard page not found: ${name}`)
  return match
}

function page(overrides: Partial<ArchPage>): ArchPage {
  return {
    id: overrides.id ?? 'page',
    name: overrides.name ?? 'Page',
    route: overrides.route ?? '/page',
    parentId: overrides.parentId ?? null,
    order: overrides.order ?? 0,
    type: overrides.type ?? 'page',
    navSlot: overrides.navSlot ?? 'topnav',
    icon: overrides.icon ?? 'FileText',
    description: overrides.description ?? '',
    services: overrides.services ?? [],
    layout: overrides.layout,
    layoutWidth: overrides.layoutWidth,
  }
}

describe('buildSeedPageSections', () => {
  it('seeds a home page with marketing stack', () => {
    const seeded = buildSeedPageSections({
      page: page({ id: 'home', name: 'Home', route: '/' }),
      profileId: 'landing-page',
    })

    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_TopBar',
      'Art_Hero_Bento',
      'Art_Logos_Marquee',
      'Art_Feature_IconMatrix',
      'Art_Stats_BigNumber',
      'Art_CTA_Band',
      'Layout_StickyCTA',
      'Nav_Footer',
    ])
    expect(seeded.every((s, idx) => s.order === idx)).toBe(true)
  })

  it('seeds pricing routes with pricing blocks', () => {
    const seeded = buildSeedPageSections({
      page: page({ id: 'pricing', name: 'Pricing', route: '/pricing' }),
      profileId: 'saas',
    })

    expect(seeded.map((s) => s.block_type)).toContain('Art_Pricing_Spotlight')
    expect(seeded.map((s) => s.block_type)).toContain('Art_FAQ_Split')
  })

  it('seeds analytics profile pages with analytics stack', () => {
    const seeded = buildSeedPageSections({
      page: page({ id: 'analytics', name: 'Analytics', route: '/analytics', layout: 'sidebar' }),
      profileId: 'analytics',
    })

    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_Sidebar',
      'Data_AnalyticsToolbar',
      'Nav_Breadcrumb',
      'Data_AnalyticsOverview',
      'Data_AnalyticsChartGrid',
      'Data_Table',
      'Content_Stats',
      'Content_CTA',
    ])
  })

  it('seeds generic saas dashboard pages with advanced sidebar stack', () => {
    const seeded = buildSeedPageSections({
      page: page({ id: 'dir', name: 'Directory', route: '/app/directory', layout: 'sidebar' }),
      profileId: 'saas',
    })

    expect(seeded.map((s) => s.block_type)).toEqual([
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
    ])
  })

  it('seeds CMS Contact with contact-specific blocks', () => {
    const seeded = buildSeedPageSections({
      page: findCmsPage('Contact'),
      profileId: 'cms',
    })
    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_TopBar',
      'Layout_PageHeader',
      'Content_ContactSplit',
      'Content_ContactChannels',
      'Art_CTA_Band',
      'Layout_StickyCTA',
      'Nav_Footer',
    ])
  })

  it('seeds CMS About with about-specific blocks', () => {
    const seeded = buildSeedPageSections({
      page: findCmsPage('About'),
      profileId: 'cms',
    })
    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_TopBar',
      'Content_AboutHero',
      'Content_AboutValues',
      'Content_AboutTimeline',
      'Art_Team_Portraits',
      'Art_CTA_Band',
      'Layout_StickyCTA',
      'Nav_Footer',
    ])
  })

  it('seeds CMS Users with admin user-management stack', () => {
    const seeded = buildSeedPageSections({
      page: findCmsPage('Users'),
      profileId: 'cms',
    })
    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Content_UserInvite',
      'Data_UserTable',
      'Content_CTA',
    ])
  })

  it('seeds CMS Settings with settings shell stack', () => {
    const seeded = buildSeedPageSections({
      page: findCmsPage('Settings'),
      profileId: 'cms',
    })
    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_Sidebar',
      'Layout_SettingsShell',
      'Form_SettingsSections',
      'Content_DangerZone',
    ])
  })

  it('seeds Analytics Overview with analytics stack (not generic KPI dashboard)', () => {
    const seeded = buildSeedPageSections({
      page: findAnalyticsOverview(),
      profileId: 'analytics',
    })
    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_Sidebar',
      'Data_AnalyticsToolbar',
      'Nav_Breadcrumb',
      'Data_AnalyticsOverview',
      'Data_AnalyticsChartGrid',
      'Data_Table',
      'Content_Stats',
      'Content_CTA',
    ])
    expect(seeded.map((s) => s.block_type)).not.toContain('Content_Text')
  })

  it('seeds SaaS Overview at /app with overview stack (not analytics stack)', () => {
    const seeded = buildSeedPageSections({
      page: findSaasOverview(),
      profileId: 'saas',
    })
    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Data_KPI_Row',
      'Data_FilterBar',
      'Data_Table',
      'Data_Chart',
      'Content_Stats',
      'Content_CTA',
    ])
    expect(seeded.map((s) => s.block_type)).not.toContain('Data_AnalyticsToolbar')
  })

  it('seeds CMS Content Editor with editor stack', () => {
    const seeded = buildSeedPageSections({
      page: findCmsPage('Content Editor'),
      profileId: 'cms',
    })
    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Layout_TwoColumn',
      'Data_FilterBar',
      'Content_Text',
      'Data_Table',
      'Layout_EmptyState',
      'Content_Stats',
      'Content_CTA',
    ])
  })

  it('seeds analytics Segments with analytics exploration stack', () => {
    const profile = ARCH_PROFILES.find((p) => p.id === 'analytics')
    const segments = profile?.pages.find((p) => p.name === 'Segments')
    if (!segments) throw new Error('Analytics Segments page not found')

    const seeded = buildSeedPageSections({ page: segments, profileId: 'analytics' })
    expect(seeded.map((s) => s.block_type)).toContain('Data_AnalyticsToolbar')
    expect(seeded.map((s) => s.block_type)).toContain('Data_AnalyticsChartGrid')
    expect(seeded.length).toBeGreaterThanOrEqual(6)
  })

  it('seeds task-manager Kanban with board-oriented stack', () => {
    const profile = ARCH_PROFILES.find((p) => p.id === 'task-manager')
    const kanban = profile?.pages.find((p) => p.name === 'Kanban')
    if (!kanban) throw new Error('Kanban page not found')

    const seeded = buildSeedPageSections({ page: kanban, profileId: 'task-manager' })
    expect(seeded.map((s) => s.block_type)).toContain('Layout_TwoColumn')
    expect(seeded.map((s) => s.block_type)).toContain('Content_Card')
    expect(seeded.length).toBeGreaterThanOrEqual(6)
  })

  it('seeds CMS dashboard content/pages/media with admin stacks', () => {
    const content = buildSeedPageSections({
      page: findCmsDashboardPage('Content'),
      profileId: 'cms',
    })
    expect(content.map((s) => s.block_type)).toContain('Data_FilterBar')
    expect(content.map((s) => s.block_type)).toContain('Data_Table')

    const pages = buildSeedPageSections({
      page: findCmsDashboardPage('Pages'),
      profileId: 'cms',
    })
    expect(pages.map((s) => s.block_type)).toEqual([
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Data_Table',
      'Layout_EmptyState',
      'Content_Stats',
      'Content_CTA',
    ])

    const media = buildSeedPageSections({
      page: findCmsDashboardPage('Media'),
      profileId: 'cms',
    })
    expect(media.map((s) => s.block_type)).toContain('Art_Gallery_Masonry')
    expect(media.map((s) => s.block_type)).toContain('Data_FilterBar')
  })

  it('seeds blog admin posts with table stack (not public blog listing)', () => {
    const profile = ARCH_PROFILES.find((p) => p.id === 'blog')
    const posts = profile?.pages.find((p) => p.route === '/admin/posts')
    if (!posts) throw new Error('Blog admin posts page not found')

    const seeded = buildSeedPageSections({ page: posts, profileId: 'blog' })
    expect(seeded.map((s) => s.block_type)).toContain('Data_Table')
    expect(seeded.map((s) => s.block_type)).not.toContain('Art_Blog_Featured')
    expect(seeded.map((s) => s.block_type)).not.toContain('Nav_Footer')
  })

  it('seeds task-manager inbox with filter table (not notifications stack)', () => {
    const profile = ARCH_PROFILES.find((p) => p.id === 'task-manager')
    const inbox = profile?.pages.find((p) => p.route === '/app/inbox')
    if (!inbox) throw new Error('Task manager inbox not found')

    const seeded = buildSeedPageSections({ page: inbox, profileId: 'task-manager' })
    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Nav_Breadcrumb',
      'Data_FilterBar',
      'Data_Table',
      'Content_Stats',
      'Content_CTA',
    ])
  })

  it('seeds auth routes with split-screen layout (no nav blocks)', () => {
    const login = buildSeedPageSections({
      page: page({ id: 'login', name: 'Login', route: '/login' }),
      profileId: 'saas',
    })
    const signup = buildSeedPageSections({
      page: page({ id: 'signup', name: 'Sign up', route: '/signup' }),
      profileId: 'saas',
    })

    expect(login.map((s) => s.block_type)).toEqual(['Layout_AuthSplit'])
    expect(signup.map((s) => s.block_type)).toEqual(['Layout_AuthSplit'])
    expect(login.map((s) => s.block_type)).not.toContain('Nav_TopBar')
    expect(login.map((s) => s.block_type)).not.toContain('Nav_Sidebar')
  })

  it('seeds AI assistant app routes with product-specific stacks', () => {
    const profile = ARCH_PROFILES.find((p) => p.id === 'ai-assistant')
    if (!profile) throw new Error('AI assistant profile not found')

    const findRoute = (route: string) => {
      const match = profile.pages.find((p) => p.route === route && p.type === 'page')
      if (!match) throw new Error(`AI page not found: ${route}`)
      return match
    }

    const chat = buildSeedPageSections({ page: findRoute('/app/chat'), profileId: 'ai-assistant' })
    expect(chat.map((s) => s.block_type)).toContain('Art_AppPreview_Frame')
    expect(chat.length).toBeGreaterThanOrEqual(6)

    const catalog = buildSeedPageSections({
      page: findRoute('/app/models/catalog'),
      profileId: 'ai-assistant',
    })
    expect(catalog.map((s) => s.block_type)).toContain('Art_Comparison_Matrix')

    const playground = buildSeedPageSections({
      page: findRoute('/app/playground'),
      profileId: 'ai-assistant',
    })
    expect(playground.map((s) => s.block_type)).toContain('Layout_ProfileTabs')
    expect(playground.map((s) => s.block_type)).toContain('Art_AppPreview_Frame')

    const docs = buildSeedPageSections({ page: findRoute('/docs'), profileId: 'ai-assistant' })
    expect(docs.map((s) => s.block_type)).toEqual([
      'Nav_TopBar',
      'Layout_PageHeader',
      'Layout_TwoColumn',
      'Content_Text',
      'Data_Table',
      'Content_FAQ',
      'Art_CTA_Band',
      'Layout_StickyCTA',
      'Nav_Footer',
    ])

    const signIn = buildSeedPageSections({
      page: findRoute('/sign-in'),
      profileId: 'ai-assistant',
    })
    expect(signIn.map((s) => s.block_type)).toEqual(['Layout_AuthSplit'])
  })

  it('seeds SaaS integrations, metrics, and admin members', () => {
    const profile = ARCH_PROFILES.find((p) => p.id === 'saas')
    if (!profile) throw new Error('SaaS profile not found')

    const integrations = profile.pages.find((p) => p.route === '/app/integrations')
    const metrics = profile.pages.find((p) => p.route === '/app/metrics')
    const members = profile.pages.find((p) => p.route === '/app/admin/members')
    if (!integrations || !metrics || !members) {
      throw new Error('SaaS advanced pages missing')
    }

    const intSeeded = buildSeedPageSections({ page: integrations, profileId: 'saas' })
    expect(intSeeded.map((s) => s.block_type)).toContain('Art_Integrations_Wall')

    const metricsSeeded = buildSeedPageSections({ page: metrics, profileId: 'saas' })
    expect(metricsSeeded.map((s) => s.block_type)).toContain('Layout_ProfileTabs')
    expect(metricsSeeded.map((s) => s.block_type)).toContain('Data_AnalyticsChartGrid')

    const membersSeeded = buildSeedPageSections({ page: members, profileId: 'saas' })
    expect(membersSeeded.map((s) => s.block_type)).toContain('Data_Table')
    expect(membersSeeded.map((s) => s.block_type)).toContain('Data_KPI_Row')
    expect(membersSeeded.length).toBeGreaterThanOrEqual(5)
  })

  it('seeds analytics command center and realtime with ops dashboard stack', () => {
    const profile = ARCH_PROFILES.find((p) => p.id === 'analytics')
    if (!profile) throw new Error('Analytics profile not found')

    const realtime = profile.pages.find((p) => p.route === '/realtime')
    const command = profile.pages.find((p) => p.route === '/command')
    if (!realtime || !command) throw new Error('Analytics ops pages missing')

    for (const target of [realtime, command]) {
      const seeded = buildSeedPageSections({ page: target, profileId: 'analytics' })
      expect(seeded.map((s) => s.block_type)).toContain('Data_AnalyticsToolbar')
      expect(seeded.map((s) => s.block_type)).toContain('Data_AnalyticsChartGrid')
      expect(seeded.length).toBeGreaterThanOrEqual(6)
    }
  })
})

describe('seed page sections cache', () => {
  it('returns cached sections for the same page and profile key', () => {
    clearSeedPageSectionsCache()
    const target = page({ id: 'home', name: 'Home', route: '/' })

    const first = buildSeedPageSections({ page: target, profileId: 'landing-page' })
    const second = buildSeedPageSections({ page: target, profileId: 'landing-page' })

    expect(first).toBe(second)
    expect(seedPageSectionsCacheKey(target, 'landing-page')).toContain('home')
  })

  it('warms cache for all previewable pages in a profile', () => {
    clearSeedPageSectionsCache()
    const pages = [
      page({ id: 'home', name: 'Home', route: '/' }),
      page({ id: 'pricing', name: 'Pricing', route: '/pricing' }),
      page({ id: 'app-shell', name: 'App', route: '/app', type: 'app' }),
    ]

    warmSeedPageSectionsCache(pages, 'saas')

    const home = buildSeedPageSections({ page: pages[0], profileId: 'saas' })
    const pricing = buildSeedPageSections({ page: pages[1], profileId: 'saas' })

    expect(home.length).toBeGreaterThan(0)
    expect(pricing.map((s) => s.block_type)).toContain('Art_Pricing_Spotlight')
  })
})
