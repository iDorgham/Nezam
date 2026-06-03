import { existsSync, readdirSync, rmSync } from 'node:fs'
import { afterAll, describe, expect, it, vi } from 'vitest'

/** T-P5-001 — Path-traversal hardening for app/api/pages/[pageId]. */

// Redirect the session dir to a tmp dir so a valid PUT never writes into the repo.
const { TMP_DIR } = vi.hoisted(() => {
  const os = require('node:os') as typeof import('node:os')
  const fs = require('node:fs') as typeof import('node:fs')
  const path = require('node:path') as typeof import('node:path')
  return { TMP_DIR: fs.mkdtempSync(path.join(os.tmpdir(), 'nezam-pages-')) }
})
vi.mock('@/lib/paths', async (importActual) => {
  const actual = await importActual<typeof import('@/lib/paths')>()
  const path = require('node:path') as typeof import('node:path')
  return {
    ...actual,
    getPagesSessionDir: () => TMP_DIR,
    getPageSessionPath: (id: string) => path.join(TMP_DIR, `${id}.json`),
  }
})

import { GET, PUT } from '../../app/api/pages/[pageId]/route'

const ctx = (pageId: string) => ({ params: Promise.resolve({ pageId }) })
const req = (body?: unknown) =>
  new Request('http://localhost/api/pages/x', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

const TRAVERSAL = [
  '../secret',
  '../../package.json',
  '..%2f..%2fetc%2fpasswd',
  '/etc/passwd',
  '..',
  '.',
  'a/b',
  'foo.bar',
  '%2e%2e',
  'with space',
]

afterAll(() => {
  if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true })
})

describe('pages/[pageId] traversal guard (T-P5-001)', () => {
  it.each(TRAVERSAL)('AC-001: GET rejects "%s" with 400', async (bad) => {
    const res = await GET(new Request('http://localhost/api/pages/x'), ctx(bad))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/invalid pageid/i)
  })

  it.each(TRAVERSAL)('AC-001: PUT rejects "%s" with 400 (before any write)', async (bad) => {
    const res = await PUT(req({ sections: [] }), ctx(bad))
    expect(res.status).toBe(400)
  })

  it('AC-001: no traversal payload created any file outside the session dir', () => {
    // Only legitimately-named files (if any) may exist in TMP_DIR; nothing escaped it.
    const entries = existsSync(TMP_DIR) ? readdirSync(TMP_DIR) : []
    expect(entries.every((f) => /^[A-Za-z0-9_-]+\.json$/.test(f))).toBe(true)
  })

  it('AC-002: accepts a valid pageId on GET', async () => {
    const res = await GET(new Request('http://localhost/api/pages/x'), ctx('PAGE-001'))
    expect(res.status).toBe(200)
    expect((await res.json()).pageId).toBe('PAGE-001')
  })

  it('AC-002: a valid PUT writes only within the (mocked) session dir', async () => {
    const res = await PUT(req({ sections: [] }), ctx('PAGE-OK_1'))
    expect(res.status).toBe(200)
    expect(existsSync(`${TMP_DIR}/PAGE-OK_1.json`)).toBe(true)
  })
})
