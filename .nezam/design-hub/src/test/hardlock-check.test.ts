import { describe, expect, it } from 'vitest'
import { checkHardlock, isDevelopUnlocked, type WireframeLockLike } from '@/lib/hardlock-check'

/** T-Q-009 — Hardlock / SDD gate behavior. */

const validLock: WireframeLockLike = {
  blocks: [{ block_id: 'BLK-001' }],
  pages: [{ page_id: 'PAGE-001' }],
  locked_at: '2026-06-01T07:50:00.000Z',
  meta: { locked_at: '2026-06-01T07:50:00.000Z' },
  design_decisions: { layout_direction: 'ltr' },
}

describe('checkHardlock (T-Q-009)', () => {
  it('AC-001: permits transition for a valid lock + complete planning', () => {
    const res = checkHardlock({ lock: validLock, planningComplete: true })
    expect(res.ok).toBe(true)
    expect(res.violations).toEqual([])
    expect(isDevelopUnlocked({ lock: validLock, planningComplete: true })).toBe(true)
  })

  it('AC-001: blocks when the lock is missing (fails closed)', () => {
    const res = checkHardlock({ lock: null, planningComplete: true })
    expect(res.ok).toBe(false)
    expect(res.violations).toContain('missing_wireframes_lock')
  })

  it('AC-002: reports no_blocks / no_pages for a structurally empty lock', () => {
    const res = checkHardlock({
      lock: { blocks: [], pages: [], locked_at: '' },
      planningComplete: true,
    })
    expect(res.ok).toBe(false)
    expect(res.violations).toEqual(
      expect.arrayContaining(['no_blocks', 'no_pages', 'not_locked']),
    )
  })

  it('AC-002: accepts meta.locked_at when top-level locked_at is absent', () => {
    const res = checkHardlock({
      lock: { blocks: [{}], pages: [{}], meta: { locked_at: '2026-06-01T00:00:00Z' } },
      planningComplete: true,
    })
    expect(res.violations).not.toContain('not_locked')
    expect(res.ok).toBe(true)
  })

  it('AC-003: enforces planning_complete invariant before transition', () => {
    const res = checkHardlock({ lock: validLock, planningComplete: false })
    expect(res.ok).toBe(false)
    expect(res.violations).toContain('planning_incomplete')
  })
})
