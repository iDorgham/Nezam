import { describe, expect, it } from 'vitest'

import { buildArchToLockMap, getEligibleArchPages, resolveArchPageId, toLockPageId } from '../lib/wireframe/arch-page-map'
import type { ArchPage } from '../types/arch'

function makePage(overrides: Partial<ArchPage>): ArchPage {
  return {
    id: overrides.id ?? 'id',
    name: overrides.name ?? 'Name',
    route: overrides.route ?? '/name',
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

describe('arch-page-map', () => {
  it('keeps deterministic lock IDs and supports reverse lookup', () => {
    const pages = {
      b: makePage({ id: 'b', route: '/b', order: 2 }),
      a: makePage({ id: 'a', route: '/a', order: 1 }),
      c: makePage({ id: 'c', route: '/c', order: 2 }),
      app: makePage({ id: 'app', route: '/', type: 'app', order: 0 }),
    }

    const eligible = getEligibleArchPages(pages)
    expect(eligible.map((p) => p.id)).toEqual(['a', 'b', 'c'])

    const map = buildArchToLockMap(eligible)
    expect(map).toEqual({ a: 'PAGE-001', b: 'PAGE-002', c: 'PAGE-003' })
    expect(resolveArchPageId('PAGE-002', eligible)).toBe('b')
    expect(resolveArchPageId('PAGE-999', eligible)).toBeNull()
    expect(toLockPageId(0)).toBe('PAGE-001')
  })
})
