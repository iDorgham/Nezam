import type { SeedBlockType, SeedPageSessionSection } from '@/lib/wireframe/seed-page-session'
import { scheduleIdleWork } from '@/lib/preview/schedule-idle'

export type PreviewSessionSource = 'saved' | 'seeded'

export type PreviewSessionEntry = {
  sections: SeedPageSessionSection[]
  source: PreviewSessionSource
}

type WireframeSession = {
  sections?: Array<Partial<SeedPageSessionSection> & { block_type?: string }>
}

const sessionCache = new Map<string, PreviewSessionEntry>()
const inflight = new Map<string, Promise<PreviewSessionEntry>>()

export function previewSessionCacheKey(pageId: string, profileId: string | null): string {
  return `${pageId}|${profileId ?? 'null'}`
}

export function getCachedPreviewSession(
  pageId: string,
  profileId: string | null,
): PreviewSessionEntry | undefined {
  return sessionCache.get(previewSessionCacheKey(pageId, profileId))
}

export function clearPreviewSessionCache(pageId?: string, profileId?: string | null): void {
  if (pageId && profileId !== undefined) {
    sessionCache.delete(previewSessionCacheKey(pageId, profileId ?? null))
    return
  }
  if (pageId) {
    for (const key of sessionCache.keys()) {
      if (key.startsWith(`${pageId}|`)) sessionCache.delete(key)
    }
    return
  }
  sessionCache.clear()
}

export function extractWireframeSections(
  session: WireframeSession | null,
): SeedPageSessionSection[] | undefined {
  const sections = session?.sections ?? []
  if (!sections.length) return undefined
  const normalized = [...sections]
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    .map((section, index) => ({
      section_id: section.section_id ?? `saved-${section.block_type ?? 'section'}-${index}`,
      block_type: (section.block_type ?? 'Content_Text') as SeedBlockType,
      order: Number(section.order ?? index),
      approved: section.approved ?? false,
      locked_props: section.locked_props ?? {},
      flexible_props: section.flexible_props ?? {},
      content_slots: section.content_slots ?? {},
      states: section.states ?? {},
    }))
  return normalized
}

async function fetchPreviewSessionOnce(
  pageId: string,
  seededSections: SeedPageSessionSection[],
  signal?: AbortSignal,
): Promise<PreviewSessionEntry> {
  const res = await fetch(`/api/pages/${encodeURIComponent(pageId)}`, { signal })
  const data = await res.json().catch(() => ({}))
  const loaded = extractWireframeSections(data?.session ?? null)
  if (loaded && loaded.length > 0) {
    return { sections: loaded, source: 'saved' }
  }
  return { sections: seededSections, source: 'seeded' }
}

export async function loadPreviewSession(
  pageId: string,
  profileId: string | null,
  seededSections: SeedPageSessionSection[],
  signal?: AbortSignal,
): Promise<PreviewSessionEntry> {
  const key = previewSessionCacheKey(pageId, profileId)
  const cached = sessionCache.get(key)
  if (cached) return cached

  const pending = inflight.get(key)
  if (pending) return pending

  const promise = fetchPreviewSessionOnce(pageId, seededSections, signal)
    .then((entry) => {
      sessionCache.set(key, entry)
      return entry
    })
    .finally(() => {
      inflight.delete(key)
    })

  inflight.set(key, promise)
  return promise
}

export function prefetchPreviewSessions(
  pageIds: string[],
  profileId: string | null,
  getSeededSections: (pageId: string) => SeedPageSessionSection[],
): void {
  scheduleIdleWork(() => {
    for (const pageId of pageIds) {
      const key = previewSessionCacheKey(pageId, profileId)
      if (sessionCache.has(key) || inflight.has(key)) continue
      void loadPreviewSession(pageId, profileId, getSeededSections(pageId))
    }
  })
}
