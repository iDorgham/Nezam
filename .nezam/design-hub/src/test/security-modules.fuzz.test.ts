import { describe, expect, it } from 'vitest'
import { sanitizeSvg } from '@/lib/svg-sanitizer'
import { compressContext } from '@/lib/context-compression'
import { checkHardlock } from '@/lib/hardlock-check'

/** T-P5-004 — Edge-case / fuzz hardening for security-critical modules. */

describe('svg-sanitizer fuzz (T-P5-004 · AC-001)', () => {
  const VECTORS = [
    '<svg><ScRiPt>alert(1)</ScRiPt><rect/></svg>',
    '<svg><foreignObject><foreignObject><script>x()</script></foreignObject></foreignObject><rect/></svg>',
    '<svg><a href="JaVaScRiPt:alert(1)"><rect/></a></svg>',
    '<svg><image href="data:text/html,<script>x</script>"/><rect/></svg>',
    '<svg><a href="vbscript:msgbox(1)"><rect/></a></svg>',
    '<svg onLoAd="x()"><rect/></svg>',
  ]
  it.each(VECTORS)('strips every executable vector or fails closed: %s', (payload) => {
    const out = sanitizeSvg(payload).toLowerCase()
    expect(out).not.toContain('<script')
    expect(out).not.toContain('<foreignobject')
    expect(out).not.toContain('javascript:')
    expect(out).not.toContain('vbscript:')
    expect(out).not.toMatch(/\son\w+\s*=/)
  })
})

describe('context-compression fuzz (T-P5-004 · AC-002)', () => {
  const INPUTS: string[] = [
    '',
    '   \n\t  ',
    '日本語のテキスト'.repeat(50),
    '🎉🎉🎉'.repeat(100),
    'x'.repeat(1_000_000),
  ]
  it.each([0, 1, 16, 256, 9999])('honors cap %i without throwing across inputs', (cap) => {
    for (const input of INPUTS) {
      const res = compressContext(input, { maxChars: cap })
      expect(res.text.length).toBeLessThanOrEqual(Math.max(0, cap))
      expect(res.text.length).toBeLessThanOrEqual(input.length)
    }
  })
})

describe('hardlock-check fuzz (T-P5-004 · AC-003)', () => {
  const GARBAGE: unknown[] = [
    null,
    {},
    { blocks: 'not-an-array', pages: 5 },
    { blocks: [], pages: null, meta: null },
    { blocks: [{}], pages: [{}], locked_at: 123 },
    { blocks: [{}], pages: [{}], meta: { locked_at: '' } },
  ]
  it.each(GARBAGE.map((g, i) => [i, g] as const))(
    'fails closed (no throw) for garbage shape #%i',
    (_i, lock) => {
      const run = () => checkHardlock({ lock: lock as never, planningComplete: true })
      expect(run).not.toThrow()
      const res = run()
      expect(res.ok).toBe(false)
      expect(res.violations.length).toBeGreaterThan(0)
    },
  )
})
