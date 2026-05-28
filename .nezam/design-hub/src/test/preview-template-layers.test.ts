import { describe, expect, it } from 'vitest'
import { detectTemplate, resolveTemplateLayerOrder } from '@/lib/preview/templates'

describe('preview template helpers', () => {
  it('detects page templates from route and name', () => {
    expect(
      detectTemplate({ id: '1', name: 'Pricing', route: '/pricing', parentId: null, order: 0, type: 'page', navSlot: 'topnav', icon: 'FileText', description: '', services: [] }),
    ).toBe('pricing')
    expect(
      detectTemplate({ id: '2', name: 'Login', route: '/auth/login', parentId: null, order: 0, type: 'page', navSlot: 'topnav', icon: 'FileText', description: '', services: [] }),
    ).toBe('auth-login')
  })

  it('keeps unknown layers out while preserving known order', () => {
    const base = ['A', 'B', 'C', 'D']
    const requested = ['C', 'x-unknown', 'A']
    expect(resolveTemplateLayerOrder(base, requested)).toEqual(['C', 'A', 'B', 'D'])
  })
})
