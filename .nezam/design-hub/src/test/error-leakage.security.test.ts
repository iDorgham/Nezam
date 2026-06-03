import { afterEach, beforeEach, describe, expect, it } from 'vitest'

/** T-P5-003 — Error-envelope / secret-leakage sweep across real routes. */

import { POST as contextPOST } from '../../app/api/context/route'
import { POST as lockPOST } from '../../app/api/lock/route'
import { POST as generatePOST } from '../../app/api/ai/generate/route'

function assertSanitized(text: string) {
  // No stack frames leaked.
  expect(text).not.toMatch(/\n\s*at\s+/)
  expect(text).not.toContain('node:internal')
  // No key-like secrets leaked.
  expect(text).not.toMatch(/sk-[a-zA-Z0-9-]/)
}

function postJson(url: string, body: unknown, raw = false): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: raw ? (body as string) : JSON.stringify(body),
  })
}

describe('error/secret leakage sweep (T-P5-003)', () => {
  it('AC-001/AC-002: context unparseable JSON → controlled 500, no stack/secret', async () => {
    const res = await contextPOST(postJson('http://localhost/api/context', 'not json{', true))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(typeof body.error).toBe('string')
    assertSanitized(JSON.stringify(body))
  })

  it('AC-001/AC-002: lock invalid payload → 422 envelope, no stack/secret', async () => {
    const res = await lockPOST(postJson('http://localhost/api/lock', {}))
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(typeof body.error).toBe('string')
    assertSanitized(JSON.stringify(body))
  })

  describe('ai/generate', () => {
    let saved: string | undefined
    beforeEach(() => {
      saved = process.env.ANTHROPIC_API_KEY
    })
    afterEach(() => {
      if (saved === undefined) delete process.env.ANTHROPIC_API_KEY
      else process.env.ANTHROPIC_API_KEY = saved
    })

    it('AC-003: missing-key path → 503, no stack/secret', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-SECRET-DO-NOT-LEAK'
      // empty prompt → 400 path, still must not echo the key
      const res = await generatePOST(postJson('http://localhost/api/ai/generate', { prompt: '' }))
      const body = await res.json()
      assertSanitized(JSON.stringify(body))
      expect(JSON.stringify(body)).not.toContain('SECRET-DO-NOT-LEAK')
    })
  })
})
