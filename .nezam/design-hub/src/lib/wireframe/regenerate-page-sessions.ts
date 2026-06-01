import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { ARCH_PROFILES } from '@/data/arch-profiles'
import { buildArchToLockMap, getEligibleArchPages } from '@/lib/wireframe/arch-page-map'
import { buildSeedPageSections, clearSeedPageSectionsCache } from '@/lib/wireframe/seed-page-session'
import { getPagesSessionDir } from '@/lib/paths'
import type { ArchProfileId } from '@/types/arch'

export type RegeneratePageSessionsOptions = {
  wipe?: boolean
}

export type RegeneratePageSessionsResult = {
  sessionDir: string
  removed: number
  written: number
  byProfile: Record<string, number>
}

function atomicWrite(filePath: string, content: string) {
  const dir = path.dirname(filePath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`
  writeFileSync(tmp, content, 'utf8')
  writeFileSync(filePath, content, 'utf8')
  try {
    unlinkSync(tmp)
  } catch {
    // noop
  }
}

function wipeSessionDir(dir: string) {
  if (!existsSync(dir)) return 0
  let removed = 0
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json')) continue
    unlinkSync(path.join(dir, file))
    removed += 1
  }
  return removed
}

export function regeneratePageSessions(
  options: RegeneratePageSessionsOptions = {},
): RegeneratePageSessionsResult {
  clearSeedPageSectionsCache()

  const sessionDir = getPagesSessionDir()
  const wipe = options.wipe === true
  const removed = wipe ? wipeSessionDir(sessionDir) : 0

  let written = 0
  const byProfile: Record<string, number> = {}

  for (const profile of ARCH_PROFILES) {
    const profileId = profile.id as ArchProfileId
    const eligible = getEligibleArchPages(
      Object.fromEntries(profile.pages.map((p) => [p.id, p])),
    )
    const lockMap = buildArchToLockMap(eligible)

    for (const page of eligible) {
      const sections = buildSeedPageSections({ page, profileId })
      const outPath = path.join(sessionDir, `${page.id}.json`)
      atomicWrite(
        outPath,
        JSON.stringify(
          {
            arch_page_id: page.id,
            lock_page_id: lockMap[page.id],
            layout_approved: true,
            sections,
            updated_at: new Date().toISOString(),
          },
          null,
          2,
        ),
      )
      written += 1
      byProfile[profileId] = (byProfile[profileId] ?? 0) + 1
    }
  }

  return { sessionDir, removed, written, byProfile }
}

export function logRegeneratePageSessionsResult(result: RegeneratePageSessionsResult, wipe: boolean) {
  console.log(`Session dir: ${result.sessionDir}`)
  if (wipe) console.log(`Removed ${result.removed} old session file(s)`)
  console.log(`Wrote ${result.written} page session(s) across ${ARCH_PROFILES.length} profile(s)`)
  for (const [id, count] of Object.entries(result.byProfile).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`  ${id}: ${count}`)
  }
}
