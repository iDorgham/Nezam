import { describe, expect, it } from 'vitest'
import { PREMIUM_ICON, PREMIUM_MOTION, PREMIUM_SPACE, PREMIUM_TYPE } from '@/lib/design/premium-standards'

describe('premium standards contract', () => {
  it('enforces typography rhythm and spacing baselines', () => {
    expect(PREMIUM_TYPE.tabWeight).toBeGreaterThanOrEqual(600)
    expect(PREMIUM_TYPE.lineHeightTight).toBeLessThanOrEqual(1.25)
    expect(PREMIUM_SPACE.rowHeight).toBeGreaterThanOrEqual(28)
    expect(PREMIUM_SPACE.controlSize).toBeGreaterThanOrEqual(20)
  })

  it('enforces motion timing and icon consistency', () => {
    expect(PREMIUM_MOTION.durationFast).toMatch(/ms$/)
    expect(PREMIUM_MOTION.durationBase).toMatch(/ms$/)
    expect(PREMIUM_MOTION.durationSlow).toMatch(/ms$/)
    expect(PREMIUM_ICON.tab).toBe(12)
    expect(PREMIUM_ICON.control).toBeLessThan(PREMIUM_ICON.row)
  })
})
