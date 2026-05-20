'use client'

import InfinityCanvas from '@/components/canvas/InfinityCanvas'
import PropertyInspector from '@/components/inspector/PropertyInspector'
import { useCanvasGraphStore } from '@/src/store/canvas-graph.store'
import { useSessionStore } from '@/lib/store/session.store'

export default function CanvasPage() {
  const { lang } = useSessionStore()
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => (isRTL ? ar : en)

  const rtlMode    = useCanvasGraphStore((s) => s.rtlMode)
  const setRTLMode = useCanvasGraphStore((s) => s.setRTLMode)
  const setViewport = useCanvasGraphStore((s) => s.setViewport)
  const scale      = useCanvasGraphStore((s) => s.viewport.scale)

  // F-007 T-F007-007 — Right-dock auto-opens when a single node is selected.
  // Empty + multi-select states are handled inside PropertyInspector itself,
  // but the dock collapses entirely when nothing is selected so the canvas
  // reclaims the full viewport.
  const selectedCount = useCanvasGraphStore((s) => s.selectedNodeIds.length)
  const dockOpen      = selectedCount > 0

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col text-ds-text-primary">
      {/* Top bar — RTL toggle + zoom readout. Sync pill from F-002 will
          eventually live here too once we have a shared TopNav. */}
      <header className="flex items-center justify-between gap-x-3 px-4 py-2 border-b border-ds-border bg-ds-surface">
        <h1 className="text-ds-sm font-semibold">
          {t('Infinity Canvas', 'لوحة لانهائية')}
        </h1>

        <div className="flex items-center gap-x-3">
          <span className="text-ds-xs font-mono text-ds-text-muted">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={() => setViewport(0, 0, 1)}
            className={[
              'text-ds-xs font-medium px-2.5 py-1 rounded-ds-sm border',
              'border-ds-border text-ds-text-muted hover:border-ds-border-hover hover:text-ds-text-primary',
              'transition-colors duration-ds-fast motion-reduce:transition-none',
              'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
            ].join(' ')}
          >
            {t('Reset', 'إعادة')}
          </button>

          <button
            type="button"
            onClick={() => setRTLMode(!rtlMode)}
            aria-pressed={rtlMode}
            className={[
              'text-ds-xs font-medium px-2.5 py-1 rounded-ds-sm border',
              'transition-colors duration-ds-fast motion-reduce:transition-none',
              'focus-visible:outline-2 focus-visible:outline-ds-primary focus-visible:outline-offset-2',
              rtlMode
                ? 'border-ds-primary bg-ds-primary-subtle text-ds-primary'
                : 'border-ds-border text-ds-text-muted hover:border-ds-border-hover hover:text-ds-text-primary',
            ].join(' ')}
          >
            {t('RTL', 'يمين-يسار')}
          </button>
        </div>
      </header>

      {/* Canvas + right-docked Property Inspector. */}
      <main className="flex-1 min-h-0 relative flex">
        <div className="flex-1 min-w-0 relative">
          <InfinityCanvas />
        </div>
        {dockOpen && <PropertyInspector />}
      </main>
    </div>
  )
}
