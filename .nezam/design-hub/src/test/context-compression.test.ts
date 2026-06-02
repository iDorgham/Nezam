import { describe, expect, it } from 'vitest'
import { compressContext } from '@/lib/context-compression'

/** T-Q-008 — Context compression / overflow handling. */

describe('compressContext (T-Q-008)', () => {
  it('AC-001: passes through unchanged when within budget', () => {
    const input = 'short context'
    const res = compressContext(input, { maxChars: 100 })
    expect(res.truncated).toBe(false)
    expect(res.text).toBe(input)
    expect(res.originalLength).toBe(input.length)
  })

  it('AC-001: compresses when over budget', () => {
    const input = 'x'.repeat(500)
    const res = compressContext(input, { maxChars: 100 })
    expect(res.truncated).toBe(true)
    expect(res.text.length).toBeLessThanOrEqual(100)
  })

  it('AC-001: retains anchors that fit the budget', () => {
    const anchor = 'ANCHOR_TOKEN'
    const input = `${anchor}\n` + 'body '.repeat(200)
    const res = compressContext(input, { maxChars: 80, anchors: [anchor] })
    expect(res.text).toContain(anchor)
    expect(res.text.length).toBeLessThanOrEqual(80)
  })

  it('AC-002: boundary — exactly at budget is passthrough, one over is truncated', () => {
    const at = 'a'.repeat(50)
    expect(compressContext(at, { maxChars: 50 }).truncated).toBe(false)
    const over = 'a'.repeat(51)
    expect(compressContext(over, { maxChars: 50 }).truncated).toBe(true)
  })

  it('AC-002: monotonic — output never exceeds cap nor input length', () => {
    const input = 'lorem ipsum '.repeat(100)
    for (const cap of [0, 1, 10, 50, 200, 5000]) {
      const res = compressContext(input, { maxChars: cap })
      expect(res.text.length).toBeLessThanOrEqual(Math.max(0, cap))
      expect(res.text.length).toBeLessThanOrEqual(input.length)
    }
  })

  it('AC-002: maxChars of 0 yields empty truncated output', () => {
    const res = compressContext('anything', { maxChars: 0 })
    expect(res.text).toBe('')
    expect(res.truncated).toBe(true)
  })
})
