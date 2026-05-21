'use client'

import { useEffect } from 'react'
import { useCanvasGraphStore } from '@/src/store/canvas-graph.store'
import { useSessionStore } from '@/lib/store/session.store'
import { useCanvasLOD } from '@/src/hooks/useCanvasLOD'

const LOD_LABEL: Record<string, { en: string; ar: string; color: string }> = {
  sitemap: { en: 'Sitemap', ar: 'خريطة الموقع', color: 'text-violet-400 border-violet-400/30 bg-violet-400/10' },
  page:    { en: 'Page',    ar: 'صفحة',         color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  section: { en: 'Section', ar: 'قسم',           color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
  element: { en: 'Element', ar: 'عنصر',          color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
}

export default function ZoomLevelBadge() {
  const scale = useCanvasGraphStore((s) => s.viewport.scale)
  const lang  = useSessionStore((s) => s.lang)
  const setCanvasMode = useSessionStore((s) => s.setCanvasMode)
  const lod   = useCanvasLOD()

  useEffect(() => {
    setCanvasMode(lod)
  }, [lod, setCanvasMode])

  const label = LOD_LABEL[lod]
  const text  = lang === 'ar' ? label.ar : label.en

  return (
    <div className="flex items-center gap-2 pointer-events-none select-none">
      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${label.color}`}>
        {text}
      </span>
      <span className="text-[10px] font-mono text-ds-text-muted">
        {Math.round(scale * 100)}%
      </span>
    </div>
  )
}
