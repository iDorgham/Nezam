'use client'

import { useEffect } from 'react'
import { useHub } from '@/store/hub.store'
import type { ArchPageType, NavSlot } from '@/types/arch'

/** Rehydrate persisted hub state and import project context once per session. */
export function useInitHub() {
  const archPages = useHub((s) => s.arch.pages)
  const archHydratePages = useHub((s) => s.archHydratePages)

  useEffect(() => {
    void useHub.persist.rehydrate()
  }, [])

  useEffect(() => {
    async function importProjectContextIfNeeded() {
      const hasHydrated =
        typeof (useHub.persist as { hasHydrated?: () => boolean }).hasHydrated === 'function'
          ? (useHub.persist as { hasHydrated: () => boolean }).hasHydrated()
          : true
      if (!hasHydrated) return

      if (Object.keys(archPages).length > 0) return

      const res = await fetch('/api/context').catch(() => null)
      if (!res || !res.ok) return

      const data = (await res.json().catch(() => ({}))) as {
        exists?: boolean
        data?: { pages?: unknown[] }
      }
      if (!data?.exists || !Array.isArray(data?.data?.pages) || data.data.pages.length === 0) {
        return
      }

      const ctxPages = data.data.pages

      const toArchType = (raw: unknown): ArchPageType => {
        const t = String(raw ?? '').toLowerCase()
        if (t === 'subpage') return 'subpage'
        if (t === 'page') return 'page'
        if (t === 'section') return 'section'
        if (t === 'modal') return 'modal'
        if (t === 'app') return 'app'
        if (t === 'navmenu') return 'navmenu'
        if (t === 'service') return 'service'
        return 'page'
      }

      const iconFor = (type: ArchPageType) => {
        const def = (
          {
            app: 'Layers',
            navmenu: 'Menu',
            page: 'FileText',
            subpage: 'CornerDownRight',
            section: 'LayoutGrid',
            modal: 'Layers',
            redirect: 'CornerDownRight',
            group: 'FolderOpen',
            redirect_: 'CornerDownRight',
            service: 'Server',
          } as Record<string, string | undefined>
        )[type]
        return def ?? 'FileText'
      }

      const mapped = ctxPages.map((p, idx) => {
        const row = p as Record<string, unknown>
        const type = toArchType(row?.type ?? row?.kind ?? row?.level)
        return {
          id: `ctx-${String(idx + 1).padStart(3, '0')}`,
          name: String(row?.name ?? row?.title ?? row?.nav_label ?? `Imported Page ${idx + 1}`),
          route: String(row?.route ?? row?.path ?? row?.slug ?? '/'),
          parentId: null,
          order: idx,
          type,
          navSlot: (type === 'app' || type === 'navmenu' ? 'hidden' : 'sidebar') as NavSlot,
          icon: row?.icon ? String(row.icon) : iconFor(type),
          description: String(row?.description ?? row?.summary ?? ''),
          services: undefined,
        }
      })

      archHydratePages(mapped)
    }

    void importProjectContextIfNeeded()
  }, [archPages, archHydratePages])
}
