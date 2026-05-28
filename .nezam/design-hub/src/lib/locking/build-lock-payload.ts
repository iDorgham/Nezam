import type { ArchPage } from '@/types/arch'
import type { DesignTokens } from '@/types/design'
import { getEligibleArchPages, toLockPageId } from '@/lib/wireframe/arch-page-map'

type CanvasMode = 'web-marketing' | 'saas-dashboard' | 'mobile-app' | 'tui'

type LockSitemapPageType = 'public' | 'auth' | 'admin' | 'modal' | 'embed'

export type LockSitemapPage = {
  id: string
  arch_page_id?: string
  title: string
  route: string
  type: LockSitemapPageType
  access: string[]
  status: 'approved' | 'deferred' | 'removed'
  priority?: 'P0' | 'P1' | 'P2' | string
}

export type LockBody = {
  tokens: DesignTokens
  sitemap: LockSitemapPage[]
  profileName?: string
  rtl?: boolean
  canvasMode?: CanvasMode
  // Optional metadata (future Phase 3 integration).
  projectName?: string
  sessionId?: string
  lockedBy?: string
}

export function buildLockPayload(params: {
  tokens: DesignTokens
  archPages: Record<string, ArchPage>
  profileName?: string
  rtl?: boolean
  canvasMode?: CanvasMode
}): LockBody {
  const { tokens, archPages, profileName, rtl, canvasMode } = params

  // Deterministic ordering: by `order`, then by id.
  const eligible = getEligibleArchPages(archPages)

  const sitemap: LockSitemapPage[] = eligible.map((p, idx) => ({
    id: toLockPageId(idx),
    arch_page_id: p.id,
    title: p.name,
    route: p.route,
    type: 'public',
    access: ['anon'],
    status: 'approved',
    priority: 'P0',
  }))

  return {
    tokens,
    sitemap,
    profileName,
    rtl,
    canvasMode,
  }
}

