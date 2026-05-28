import { describe, expect, it } from 'vitest'

import { readSessionForSitemapPage } from '../lib/locking/session-resolver'

describe('readSessionForSitemapPage', () => {
  it('prefers arch_page_id and falls back to legacy PAGE-xxx id', () => {
    const sessions: Record<string, unknown> = {
      'PAGE-001': { sections: [{ section_id: 's1' }] },
    }
    const readSession = (pageId: string) => sessions[pageId] ?? null

    const fallback = readSessionForSitemapPage(
      { id: 'PAGE-001', arch_page_id: 'home' },
      readSession
    )
    expect(fallback.sessionPageId).toBe('PAGE-001')
    expect((fallback.session as any).sections).toHaveLength(1)

    sessions.home = { sections: [{ section_id: 's2' }] }
    const primary = readSessionForSitemapPage(
      { id: 'PAGE-001', arch_page_id: 'home' },
      readSession
    )
    expect(primary.sessionPageId).toBe('home')
    expect((primary.session as any).sections[0].section_id).toBe('s2')
  })
})
