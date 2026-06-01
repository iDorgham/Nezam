import { describe, it, expect } from 'vitest'

import type { LockSitemapPage } from '../lib/locking/build-lock-payload'
import { validateP0Wireframes } from '../lib/locking/validate-p0-wireframes'

describe('validateP0Wireframes', () => {
  it('returns an error when a P0 public page has no saved wireframe sections', () => {
    const sitemap: LockSitemapPage[] = [
      {
        id: 'PAGE-001',
        title: 'Home',
        route: '/',
        type: 'public',
        access: ['anon'],
        status: 'approved',
        priority: 'P0',
      },
      {
        id: 'PAGE-002',
        title: 'About',
        route: '/about',
        type: 'public',
        access: ['anon'],
        status: 'approved',
        priority: 'P1',
      },
    ]

    const pagesOut = [
      { page_id: 'PAGE-001', title: 'Home', route: '/', sections: [] },
      { page_id: 'PAGE-002', title: 'About', route: '/about', sections: [] },
    ]

    const { errors } = validateP0Wireframes({ sitemap, pagesOut })

    expect(errors).toHaveLength(1)
    expect(errors[0]).toMatch(/No P0 wireframe saved for "Home"/)
  })

  it('does not error when a P0 public page has at least one saved section', () => {
    const sitemap: LockSitemapPage[] = [
      {
        id: 'PAGE-001',
        title: 'Home',
        route: '/',
        type: 'public',
        access: ['anon'],
        status: 'approved',
        priority: 'P0',
      },
    ]

    const pagesOut = [
      { page_id: 'PAGE-001', title: 'Home', route: '/', sections: [{ approved: true }] },
    ]

    const { errors } = validateP0Wireframes({ sitemap, pagesOut })
    expect(errors).toHaveLength(0)
  })
})

