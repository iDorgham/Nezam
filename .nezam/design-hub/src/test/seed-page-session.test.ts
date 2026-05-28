import { describe, expect, it } from 'vitest'

import { buildSeedPageSections } from '../lib/wireframe/seed-page-session'
import type { ArchPage } from '../types/arch'

function page(overrides: Partial<ArchPage>): ArchPage {
  return {
    id: overrides.id ?? 'page',
    name: overrides.name ?? 'Page',
    route: overrides.route ?? '/page',
    parentId: overrides.parentId ?? null,
    order: overrides.order ?? 0,
    type: overrides.type ?? 'page',
    navSlot: overrides.navSlot ?? 'sidebar',
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

  it('seeds dashboard-like pages with sidebar data stack', () => {
    const seeded = buildSeedPageSections({
      page: page({ id: 'analytics', name: 'Analytics', route: '/analytics', layout: 'sidebar' }),
      profileId: 'analytics',
    })

    expect(seeded.map((s) => s.block_type)).toEqual([
      'Nav_Sidebar',
      'Layout_PageHeader',
      'Data_KPI_Row',
      'Data_Table',
      'Data_Chart',
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
})
