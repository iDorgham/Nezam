import { describe, it, expect } from 'vitest'

import { buildLockPayload } from '../lib/locking/build-lock-payload'
import type { DesignTokens } from '../types/design'

describe('buildLockPayload', () => {
  it('builds deterministic PAGE-xxx sitemap IDs with stable sorting', () => {
    const tokens = {} as unknown as DesignTokens

    const archPages = {
      // Same `order`, tie-breaker should be by `id.localeCompare()`.
      pB: {
        id: 'b',
        name: 'B',
        route: '/b',
        parentId: null,
        order: 0,
        type: 'page',
        navSlot: 'sidebar',
        icon: 'FileText',
        description: '',
        services: [],
      },
      pA: {
        id: 'a',
        name: 'A',
        route: '/a',
        parentId: null,
        order: 0,
        type: 'page',
        navSlot: 'sidebar',
        icon: 'FileText',
        description: '',
        services: [],
      },
      s1: {
        id: 'c',
        name: 'C',
        route: '/c',
        parentId: 'pA',
        order: 1,
        type: 'subpage',
        navSlot: 'sidebar',
        icon: 'CornerDownRight',
        description: '',
        services: [],
      },
      // Not eligible: should be excluded from the sitemap.
      app1: {
        id: 'root',
        name: 'Root',
        route: '/',
        parentId: null,
        order: -1,
        type: 'app',
        navSlot: 'hidden',
        icon: 'Layers',
        description: '',
        services: [],
      },
    } as any

    const payload = buildLockPayload({
      tokens,
      archPages,
      profileName: 'minimal',
      rtl: true,
      canvasMode: 'saas-dashboard',
    })

    expect(payload.tokens).toBe(tokens)
    expect(payload.profileName).toBe('minimal')
    expect(payload.rtl).toBe(true)
    expect(payload.canvasMode).toBe('saas-dashboard')

    expect(payload.sitemap.map((p) => p.id)).toEqual(['PAGE-001', 'PAGE-002', 'PAGE-003'])
    expect(payload.sitemap.map((p) => p.arch_page_id)).toEqual(['a', 'b', 'c'])
    expect(payload.sitemap.map((p) => p.title)).toEqual(['A', 'B', 'C'])
    expect(payload.sitemap.map((p) => p.route)).toEqual(['/a', '/b', '/c'])

    for (const page of payload.sitemap) {
      expect(page.type).toBe('public')
      expect(page.access).toEqual(['anon'])
      expect(page.status).toBe('approved')
      expect(page.priority).toBe('P0')
    }
  })
})

