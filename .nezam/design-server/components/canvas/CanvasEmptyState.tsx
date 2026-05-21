'use client'

import { Plus, Building2 } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'
import { useCanvasGraphStore } from '@/src/store/canvas-graph.store'
import { CAIROFIN_NODES, CAIROFIN_WIRES } from '@/src/lib/dummy-data/cairo-fin-hub'

// "Add your first page" prompt centered on the canvas when no nodes exist.
// Hides automatically once the user has any node in the graph (T-F005-018).
export default function CanvasEmptyState() {
  const { lang } = useSessionStore()
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => (isRTL ? ar : en)

  const hasNodes = useCanvasGraphStore((s) => s.nodes.length > 0)
  const addNode  = useCanvasGraphStore((s) => s.addNode)
  const addWire  = useCanvasGraphStore((s) => s.addWire)

  if (hasNodes) return null

  const createSeedNode = () => {
    addNode({
      id:                 crypto.randomUUID(),
      type:               'page',
      title:              t('Home', 'الرئيسية'),
      route:              '/',
      x:                  -90,
      y:                  -40,
      width:              180,
      height:             80,
      rtlCompliant:       false,
      wcagCompliant:      false,
      hardlockFailures:   [],
      locked:             false,
      attachments:        [],
      generationStatus:   'idle',
      style:              {},
    })
  }

  const loadCairoFinDemo = () => {
    CAIROFIN_NODES.forEach((n) => addNode(n))
    CAIROFIN_WIRES.forEach((w) => addWire(w))
  }

  return (
    <div
      role="region"
      aria-label={t('Empty canvas', 'لوحة فارغة')}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div className="pointer-events-auto flex flex-col items-center gap-4 text-center max-w-sm">
        <p className="text-ds-sm text-ds-text-muted">
          {t(
            'Your canvas is empty. Start blank or load a demo.',
            'لوحتك فارغة. ابدأ من الصفر أو حمّل عرضاً توضيحياً.',
          )}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={createSeedNode}
            className="inline-flex items-center gap-x-1.5 px-4 py-2 rounded-ds-md bg-ds-primary text-ds-primary-foreground text-ds-sm font-medium border border-ds-primary hover:bg-ds-primary-hover transition-colors duration-ds-fast focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2"
          >
            <Plus size={14} aria-hidden="true" />
            {t('Start blank', 'ابدأ فارغاً')}
          </button>
          <button
            type="button"
            onClick={loadCairoFinDemo}
            className="inline-flex items-center gap-x-1.5 px-4 py-2 rounded-ds-md bg-ds-surface text-ds-text-primary text-ds-sm font-medium border border-ds-border hover:border-ds-primary hover:text-ds-primary transition-colors duration-ds-fast focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2"
          >
            <Building2 size={14} aria-hidden="true" />
            {t('Load CairoFin Hub', 'حمّل كايروفن هاب')}
          </button>
        </div>
      </div>
    </div>
  )
}
