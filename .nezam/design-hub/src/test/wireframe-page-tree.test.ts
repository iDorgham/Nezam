import { describe, expect, it } from 'vitest'

import { getSortedChildren, getTreeRoots } from '../lib/arch/page-tree'
import { isEligibleArchPage } from '../lib/wireframe/arch-page-map'
import type { ArchPage } from '../types/arch'

function archPage(overrides: Partial<ArchPage> & { id: string }): ArchPage {
  return {
    name: overrides.name ?? overrides.id,
    route: overrides.route ?? `/${overrides.id}`,
    parentId: overrides.parentId ?? null,
    order: overrides.order ?? 0,
    type: overrides.type ?? 'page',
    navSlot: overrides.navSlot ?? 'sidebar',
    icon: overrides.icon ?? 'FileText',
    description: overrides.description ?? '',
    services: overrides.services ?? [],
    layout: overrides.layout,
    layoutWidth: overrides.layoutWidth,
    ...overrides,
  }
}

describe('wireframe page tree', () => {
  it('marks only page and subpage nodes as wireframe-eligible', () => {
    const pages: Record<string, ArchPage> = {
      app: archPage({ id: 'app', type: 'app', name: 'CMS App' }),
      nav: archPage({ id: 'nav', type: 'navmenu', parentId: 'app', name: 'Top Nav' }),
      home: archPage({ id: 'home', type: 'page', parentId: 'nav', name: 'Home', route: '/' }),
      section: archPage({ id: 'section', type: 'section', parentId: 'home', name: 'Hero' }),
    }

    expect(isEligibleArchPage(pages.app)).toBe(false)
    expect(isEligibleArchPage(pages.nav)).toBe(false)
    expect(isEligibleArchPage(pages.home)).toBe(true)
    expect(isEligibleArchPage(pages.section)).toBe(false)
  })

  it('preserves architecture hierarchy via tree roots and children', () => {
    const pages: Record<string, ArchPage> = {
      app: archPage({ id: 'app', type: 'app', order: 0 }),
      nav: archPage({ id: 'nav', type: 'navmenu', parentId: 'app', order: 0 }),
      home: archPage({ id: 'home', type: 'page', parentId: 'nav', order: 0, route: '/' }),
      pricing: archPage({ id: 'pricing', type: 'subpage', parentId: 'nav', order: 1, route: '/pricing' }),
    }

    const roots = getTreeRoots(pages)
    expect(roots.map((p) => p.id)).toEqual(['app'])

    const navChildren = getSortedChildren('app', pages)
    expect(navChildren.map((p) => p.id)).toEqual(['nav'])

    const leafChildren = getSortedChildren('nav', pages)
    expect(leafChildren.map((p) => p.id)).toEqual(['home', 'pricing'])
    expect(leafChildren.filter(isEligibleArchPage).map((p) => p.id)).toEqual(['home', 'pricing'])
  })
})
