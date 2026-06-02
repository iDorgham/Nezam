import { describe, expect, it } from 'vitest'
import { sanitizeSvg, isSvgSafe } from '@/lib/svg-sanitizer'

/** T-Q-006 — Security: untrusted SVG sanitization. */

const MALICIOUS: Array<[string, string]> = [
  ['inline script', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect/></svg>'],
  ['onload handler', '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><circle/></svg>'],
  ['javascript href', '<svg><a href="javascript:alert(1)"><rect/></a></svg>'],
  ['obfuscated js href', '<svg><a href="java script:alert(1)"><rect/></a></svg>'],
  ['foreignObject', '<svg><foreignObject><body onload="x()"/></foreignObject><path d="M0 0"/></svg>'],
  ['doctype entity', '<!DOCTYPE svg [<!ENTITY x "y">]><svg><rect/></svg>'],
  ['animate set', '<svg><set attributeName="onload" to="alert(1)"/><rect/></svg>'],
]

describe('sanitizeSvg (T-Q-006)', () => {
  it.each(MALICIOUS)('AC-001/AC-003: strips executable vectors — %s', (_label, payload) => {
    const out = sanitizeSvg(payload)
    expect(out.toLowerCase()).not.toContain('<script')
    expect(out.toLowerCase()).not.toMatch(/\son\w+\s*=/)
    expect(out.toLowerCase()).not.toContain('javascript:')
    expect(out.toLowerCase()).not.toContain('<foreignobject')
    expect(out.toLowerCase()).not.toContain('<!entity')
    expect(out.toLowerCase()).not.toContain('<!doctype')
  })

  it('AC-001: preserves safe geometry', () => {
    const safe = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L10 10"/><rect width="4" height="4"/><circle r="2"/></svg>'
    const out = sanitizeSvg(safe)
    expect(out).toContain('<path')
    expect(out).toContain('<rect')
    expect(out).toContain('<circle')
    expect(isSvgSafe(safe)).toBe(true)
  })

  it('AC-003: fails closed on empty / non-svg input', () => {
    expect(sanitizeSvg('')).toBe('')
    expect(sanitizeSvg('not svg at all')).toBe('')
    // @ts-expect-error — defensive: non-string input
    expect(sanitizeSvg(null)).toBe('')
    expect(isSvgSafe('<svg onload="x()"><rect/></svg>')).toBe(false)
  })
})
