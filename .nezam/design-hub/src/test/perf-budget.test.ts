import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getProjectRoot } from '@/lib/paths'

/** T-P4-002 — Performance budget config + RSC-boundary guard. */

const root = getProjectRoot()
const appDir = join(root, '.nezam/design-hub/app')

describe('Lighthouse budget config (T-P4-002 · AC-001)', () => {
  const cfg = JSON.parse(readFileSync(join(root, '.lighthouserc.json'), 'utf8'))
  const assertions = cfg?.ci?.assert?.assertions ?? {}

  const numeric = (key: string): number => {
    const entry = assertions[key]
    return entry?.[1]?.maxNumericValue
  }

  it('defines a well-formed assert block', () => {
    expect(cfg?.ci?.assert?.assertions).toBeTruthy()
  })

  it('keeps Core Web Vitals budgets within sane bounds', () => {
    expect(numeric('largest-contentful-paint')).toBeLessThanOrEqual(2500)
    expect(numeric('first-contentful-paint')).toBeLessThanOrEqual(2500)
    expect(numeric('cumulative-layout-shift')).toBeLessThanOrEqual(0.1)
    expect(numeric('total-blocking-time')).toBeLessThanOrEqual(200)
  })

  it('requires a performance minScore >= 0.8', () => {
    expect(assertions['categories:performance']?.[1]?.minScore).toBeGreaterThanOrEqual(0.8)
  })
})

describe('RSC boundary guard (T-P4-002 · AC-003)', () => {
  function isClientComponent(file: string): boolean {
    const firstMeaningful = readFileSync(file, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l.length > 0)
    return firstMeaningful === `'use client'` || firstMeaningful === '"use client"'
  }

  it('keeps layout.tsx a server component', () => {
    expect(isClientComponent(join(appDir, 'layout.tsx'))).toBe(false)
  })

  it('keeps all route page.tsx entrypoints server-first', () => {
    const offenders: string[] = []
    for (const entry of readdirSync(appDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const page = join(appDir, entry.name, 'page.tsx')
      try {
        if (isClientComponent(page)) offenders.push(entry.name)
      } catch {
        /* no page.tsx in this segment */
      }
    }
    expect(offenders).toEqual([])
  })
})
