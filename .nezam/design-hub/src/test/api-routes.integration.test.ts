import { existsSync, rmSync } from 'node:fs'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** T-Q-004 — API route integration tests. */

// Redirect the context route's write target to a tmp file so the suite never
// overwrites the repo-root project_context.json.
const { TMP_CTX } = vi.hoisted(() => {
  // Use require() here: hoisted factories run before ESM import bindings exist.
  const nodePath = require('node:path') as typeof import('node:path')
  const nodeOs = require('node:os') as typeof import('node:os')
  return { TMP_CTX: nodePath.join(nodeOs.tmpdir(), `nezam-ctx-${process.pid}-${Date.now()}.json`) }
})
vi.mock('@/lib/paths', async (importActual) => {
  const actual = await importActual<typeof import('@/lib/paths')>()
  return { ...actual, getProjectContextPath: () => TMP_CTX }
})

import { GET as canvasGET, POST as canvasPOST } from '../../app/api/canvas/route'
import { POST as canvasNodePOST } from '../../app/api/canvas/node/route'
import { POST as uploadPOST } from '../../app/api/assets/upload/route'
import { GET as presetsGET, POST as presetsPOST } from '../../app/api/presets/route'
import { POST as presetsSavePOST } from '../../app/api/presets/save/route'
import { GET as contextGET, POST as contextPOST } from '../../app/api/context/route'
import { POST as lockPOST } from '../../app/api/lock/route'

function jsonRequest(url: string, body: unknown, raw = false): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: raw ? (body as string) : JSON.stringify(body),
  })
}

describe('reserved placeholder routes (T-Q-004 · AC-001)', () => {
  const cases: Array<[string, () => Promise<Response>]> = [
    ['canvas GET', () => canvasGET()],
    ['canvas POST', () => canvasPOST()],
    ['canvas/node POST', () => canvasNodePOST()],
    ['assets/upload POST', () => uploadPOST()],
    ['presets GET', () => presetsGET()],
    ['presets POST', () => presetsPOST()],
    ['presets/save POST', () => presetsSavePOST()],
  ]
  it.each(cases)('%s returns a controlled 501 not_implemented', async (_label, call) => {
    const res = await call()
    expect(res.status).toBe(501)
    const body = await res.json()
    expect(body.error).toBe('not_implemented')
  })
})

describe('lock route validation (T-Q-004 · AC-002, no writes)', () => {
  it('returns 422 when tokens are missing', async () => {
    const res = await lockPOST(jsonRequest('http://localhost/api/lock', { sitemap: [{ id: 'p1' }] }))
    expect(res.status).toBe(422)
    expect((await res.json()).error).toMatch(/tokens/i)
  })

  it('returns 422 when sitemap is empty', async () => {
    const res = await lockPOST(jsonRequest('http://localhost/api/lock', { tokens: {}, sitemap: [] }))
    expect(res.status).toBe(422)
    expect((await res.json()).error).toMatch(/sitemap/i)
  })
})

describe('context route (T-Q-004 · AC-002/AC-003, tmp-mocked)', () => {
  beforeEach(() => {
    if (existsSync(TMP_CTX)) rmSync(TMP_CTX)
  })
  afterEach(() => {
    if (existsSync(TMP_CTX)) rmSync(TMP_CTX)
  })
  afterAll(() => {
    if (existsSync(TMP_CTX)) rmSync(TMP_CTX)
  })

  it('GET reports exists:false when the file is absent', async () => {
    const res = await contextGET()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ exists: false, data: null })
  })

  it('POST writes a coerced safe shape and round-trips via GET', async () => {
    const res = await contextPOST(
      jsonRequest('http://localhost/api/context', {
        pages: [{ id: 'PAGE-001' }],
        sections: [],
        design_tokens: { brand: '#000' },
        sitemap: [],
        // unknown extra keys must be dropped by parseProjectContext
        rogue: 'drop-me',
      }),
    )
    expect(res.status).toBe(200)
    expect((await res.json()).success).toBe(true)

    const get = await contextGET()
    const body = await get.json()
    expect(body.exists).toBe(true)
    expect(body.data).not.toHaveProperty('rogue')
    expect(body.data.pages).toHaveLength(1)
  })

  it('POST coerces malformed-but-valid JSON (non-object) to an empty shape', async () => {
    const res = await contextPOST(jsonRequest('http://localhost/api/context', 42))
    expect(res.status).toBe(200)
    const get = await contextGET()
    expect((await get.json()).data).toEqual({ pages: [], sections: [], design_tokens: {}, sitemap: [] })
  })

  it('POST returns a controlled 500 envelope on unparseable JSON (no crash)', async () => {
    const res = await contextPOST(jsonRequest('http://localhost/api/context', 'this is not json{', true))
    expect(res.status).toBe(500)
    expect((await res.json()).error).toBeTruthy()
  })
})
