import { describe, it, expect } from 'vitest'
import fs from 'fs'

import { getExportWireframesPath, getProjectRoot } from '../lib/paths'

function readJson(path: string) {
  return JSON.parse(fs.readFileSync(path, 'utf8'))
}

describe('wireframes_locked.json schema contract', () => {
  it('has required top-level keys and required meta fields', () => {
    const lockPath = getExportWireframesPath()
    const schemaPath = `${getProjectRoot()}/.nezam/templates/wireframe-server/wireframes_locked.schema.json`

    const lock = readJson(lockPath)
    const schema = readJson(schemaPath)

    expect(lock).toBeTruthy()

    for (const key of schema.required as string[]) {
      expect(lock).toHaveProperty(key)
    }

    const metaRequired = (schema.properties?.meta?.required ?? []) as string[]
    for (const key of metaRequired) {
      expect(lock.meta).toHaveProperty(key)
    }

    expect(Array.isArray(lock.pages)).toBe(true)
    expect(Array.isArray(lock.blocks)).toBe(true)
    expect(lock.sitemap).toBeTruthy()
    expect(Array.isArray(lock.sitemap.pages)).toBe(true)
  })

  it('includes ISO timestamp strings for locked_at and meta.locked_by', () => {
    const lockPath = getExportWireframesPath()
    const lock = readJson(lockPath)

    expect(typeof lock.locked_at).toBe('string')
    // Simple ISO 8601 / date-time check (schema enforces format="date-time").
    expect(lock.locked_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/,
    )

    expect(typeof lock.meta.locked_by).toBe('string')
  })

  it('enforces: all P0 public pages have layout_approved: true', () => {
    const lockPath = getExportWireframesPath()
    const lock = readJson(lockPath)

    const p0Pages = (lock.sitemap?.pages ?? []).filter(
      (p: any) => p?.type === 'public' && p?.priority === 'P0',
    )

    const pagesById = new Map((lock.pages ?? []).map((p: any) => [p.page_id, p]))

    for (const p of p0Pages) {
      const out = pagesById.get(p.id) as any
      expect(out, `Missing pages[] entry for P0 page ${p.id}`).toBeTruthy()
      expect(out.layout_approved).toBe(true)
    }
  })
})

