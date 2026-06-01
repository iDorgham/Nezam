import { describe, expect, it } from 'vitest'
import {
  addableToArchType,
  createArchPageDefaults,
  inferChildTypeFromParent,
  validateArchParentChild,
} from '@/lib/arch/arch-node'
import type { ArchPage } from '@/types/arch'

function page(partial: Partial<ArchPage> & Pick<ArchPage, 'id' | 'type'>): ArchPage {
  return {
    name: 'Node',
    route: '/',
    parentId: null,
    order: 0,
    navSlot: 'hidden',
    icon: 'FileText',
    description: '',
    ...partial,
  }
}

describe('arch-node validation', () => {
  it('maps addable kinds to arch types', () => {
    expect(addableToArchType('application')).toBe('app')
    expect(addableToArchType('service')).toBe('service')
  })

  it('allows service only at root', () => {
    const app = page({ id: 'app-1', type: 'app' })
    expect(validateArchParentChild(null, 'service')).toEqual({ ok: true })
    expect(validateArchParentChild(app, 'service')).toEqual({
      ok: false,
      reason: 'Services must live in the Micro Services rack (root level).',
    })
  })

  it('enforces menu under app and page under menu', () => {
    const app = page({ id: 'app-1', type: 'app' })
    const menu = page({ id: 'menu-1', type: 'navmenu', parentId: 'app-1' })
    expect(validateArchParentChild(app, 'navmenu')).toEqual({ ok: true })
    expect(validateArchParentChild(app, 'page')).toEqual({
      ok: false,
      reason: 'Under an application, add a Menu first.',
    })
    expect(validateArchParentChild(menu, 'page')).toEqual({ ok: true })
  })

  it('infers child type from parent for quick add', () => {
    expect(inferChildTypeFromParent(null)).toBe('app')
    expect(inferChildTypeFromParent(page({ id: 'a', type: 'app' }))).toBe('navmenu')
    expect(inferChildTypeFromParent(page({ id: 'm', type: 'navmenu' }))).toBe('page')
  })

  it('creates service defaults', () => {
    const svc = createArchPageDefaults('svc-1', 'service', null, 0, null)
    expect(svc.type).toBe('service')
    expect(svc.serviceKind).toBeDefined()
    expect(svc.parentId).toBeNull()
  })
})
