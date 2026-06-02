import { beforeEach, describe, expect, it } from 'vitest'
import { useSession, SECTION_SPOT_IDS } from '@/store/session.store'

/** T-Q-005 — Unit coverage for the real session store. */

describe('useSession store (T-Q-005)', () => {
  beforeEach(() => {
    useSession.getState().resetAllSpotlights()
  })

  it('AC-002: dismissSpotlight de-duplicates ids', () => {
    const { dismissSpotlight } = useSession.getState()
    dismissSpotlight('arch-canvas')
    dismissSpotlight('arch-canvas')
    expect(useSession.getState().dismissedSpotlights).toEqual(['arch-canvas'])
  })

  it('AC-002: dismissTourForSection adds all section spotlight ids', () => {
    useSession.getState().dismissTourForSection('wireframes')
    expect(useSession.getState().dismissedSpotlights).toEqual(
      expect.arrayContaining(SECTION_SPOT_IDS.wireframes),
    )
  })

  it('AC-002: markSectionEntered records sections once', () => {
    const { markSectionEntered } = useSession.getState()
    markSectionEntered('design')
    markSectionEntered('design')
    expect(useSession.getState().sectionsEntered).toEqual(['design'])
  })

  it('AC-002: setHintsEnabled toggles the flag', () => {
    useSession.getState().setHintsEnabled(false)
    expect(useSession.getState().hintsEnabled).toBe(false)
  })

  it('AC-002: markFirstLaunch sets the timestamp only once', () => {
    const { markFirstLaunch } = useSession.getState()
    markFirstLaunch()
    const first = useSession.getState().firstLaunchAt
    expect(first).not.toBeNull()
    markFirstLaunch()
    expect(useSession.getState().firstLaunchAt).toBe(first)
  })

  it('AC-003: resetAllSpotlights restores defaults', () => {
    const s = useSession.getState()
    s.dismissSpotlight('x')
    s.markSectionEntered('preview')
    s.resetAllSpotlights()
    expect(useSession.getState().dismissedSpotlights).toEqual([])
    expect(useSession.getState().sectionsEntered).toEqual([])
    expect(useSession.getState().hintsEnabled).toBe(true)
  })
})
