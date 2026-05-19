'use client'

import { Plus } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'
import { useCanvasGraphStore } from '@/src/store/canvas-graph.store'

// "Add your first page" prompt centered on the canvas when no nodes exist.
// Hides automatically once the user has any node in the graph (T-F005-018).
export default function CanvasEmptyState() {
  const { lang } = useSessionStore()
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => (isRTL ? ar : en)

  const hasNodes = useCanvasGraphStore((s) => s.nodes.length > 0)
  const addNode  = useCanvasGraphStore((s) => s.addNode)

  if (hasNodes) return null

  const createSeedNode = () => {
    addNode({
      id:                 crypto.randomUUID(),
      type:               'page',
      title:              t('Home', 'الرئيسية'),
      route:              '/',
      x:                  -90,  // centered on origin: -width/2
      y:                  -40,  //                    -height/2
      width:              180,
      height:             80,
      rtlCompliant:       false,
      wcagCompliant:      false,
      hardlockFailures:   [],
      locked:             false,
      attachments:        [],
      generationStatus:   'idle',
    })
  }

  return (
    <div
      role="region"
      aria-label={t('Empty canvas', 'لوحة فارغة')}
      // pointer-events-none lets pan/zoom keep working when the prompt is
      // visible; only the button itself accepts clicks.
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div className="pointer-events-auto flex flex-col items-center gap-3 text-center">
        <p className="text-ds-sm text-ds-text-muted max-w-xs">
          {t(
            'Your canvas is empty. Add a page to start mapping your app.',
            'لوحتك فارغة. أضف صفحة لتبدأ في رسم خريطة تطبيقك.',
          )}
        </p>
        <button
          type="button"
          onClick={createSeedNode}
          className={[
            'inline-flex items-center gap-x-1.5',
            'px-4 py-2 rounded-ds-md',
            'bg-ds-primary text-ds-primary-foreground',
            'text-ds-sm font-medium',
            'border border-ds-primary',
            'hover:bg-ds-primary-hover',
            'transition-colors duration-ds-fast motion-reduce:transition-none',
            'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
          ].join(' ')}
        >
          <Plus size={14} aria-hidden="true" />
          {t('Add your first page', 'أضف أول صفحة')}
        </button>
      </div>
    </div>
  )
}
