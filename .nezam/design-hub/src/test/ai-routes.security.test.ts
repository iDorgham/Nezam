import { afterEach, beforeEach, describe, expect, it } from 'vitest'

/** T-Q-007 — Security: AI route hardening + secret hygiene. */

import { POST as generatePOST } from '../../app/api/ai/generate/route'
import { GET as genNodeGET, POST as genNodePOST } from '../../app/api/ai/generate-node/route'
import { GET as visionGET, POST as visionPOST } from '../../app/api/ai/vision-gate/route'

const FAKE_KEY = 'sk-ant-THIS-MUST-NEVER-LEAK-0000'

function postJson(url: string, body: unknown): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('ai/generate hardening (T-Q-007)', () => {
  let savedKey: string | undefined

  beforeEach(() => {
    savedKey = process.env.ANTHROPIC_API_KEY
  })
  afterEach(() => {
    if (savedKey === undefined) delete process.env.ANTHROPIC_API_KEY
    else process.env.ANTHROPIC_API_KEY = savedKey
  })

  it('AC-003: returns 400 for a missing prompt before any model dispatch', async () => {
    process.env.ANTHROPIC_API_KEY = FAKE_KEY // present, yet we must still 400 first
    const res = await generatePOST(postJson('http://localhost/api/ai/generate', {}))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/prompt/i)
  })

  it('AC-002/AC-003: returns 503 when the key is missing, before dispatch', async () => {
    delete process.env.ANTHROPIC_API_KEY
    const res = await generatePOST(
      postJson('http://localhost/api/ai/generate', { prompt: 'a hero and a footer' }),
    )
    expect(res.status).toBe(503)
    const text = JSON.stringify(await res.json())
    expect(text).toContain('ANTHROPIC_API_KEY not set')
  })

  it('AC-001: never echoes the key value into the response', async () => {
    process.env.ANTHROPIC_API_KEY = FAKE_KEY
    // Empty prompt → 400 path, response is built without referencing the key.
    const res = await generatePOST(postJson('http://localhost/api/ai/generate', { prompt: '' }))
    const text = JSON.stringify(await res.json())
    expect(text).not.toContain(FAKE_KEY)
    expect(text).not.toMatch(/sk-ant-/)
  })
})

describe('reserved AI routes (T-Q-007 · AC-002)', () => {
  it('generate-node POST returns a controlled 501', async () => {
    const res = await genNodePOST()
    expect(res.status).toBe(501)
    expect((await res.json()).error).toBe('not_implemented')
  })

  it('generate-node GET returns 405 method_not_allowed', async () => {
    const res = await genNodeGET()
    expect(res.status).toBe(405)
  })

  it('vision-gate GET/POST return a controlled 501', async () => {
    expect((await visionGET()).status).toBe(501)
    expect((await visionPOST()).status).toBe(501)
  })
})
