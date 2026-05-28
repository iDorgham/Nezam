'use client'

import { Eye, Puzzle, LayoutTemplate } from 'lucide-react'
import { useHub, type PreviewSubTab } from '@/store/hub.store'
import { cn } from '@/lib/utils'
import { PREMIUM_ICON, PREMIUM_MOTION, PREMIUM_SPACE, PREMIUM_TYPE } from '@/lib/design/premium-standards'

const TABS: { id: PreviewSubTab; label: string; Icon: React.ComponentType<any> }[] = [
  { id: 'preview', label: 'Pages', Icon: Eye },
  { id: 'sections', label: 'Sections', Icon: LayoutTemplate },
]

export function PreviewSubTabs() {
  const active = useHub((s) => s.preview.subTab)
  const setTab = useHub((s) => s.previewSetSubTab)
  const activeIndex = TABS.findIndex((tab) => tab.id === active)

  function focusTab(nextIndex: number) {
    const bounded = (nextIndex + TABS.length) % TABS.length
    const next = TABS[bounded]
    setTab(next.id)
    if (typeof document === 'undefined') return
    requestAnimationFrame(() => {
      const el = document.getElementById(`preview-subtab-${next.id}`)
      el?.focus()
    })
  }

  return (
    <div className="shrink-0 flex items-center h-10 px-6 border-b border-app-border bg-app-surface select-none">
      <nav className="flex items-center gap-1.5 h-full" role="tablist" aria-label="Preview tabs">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              id={`preview-subtab-${id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`preview-subpanel-${id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setTab(id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault()
                  focusTab(activeIndex + 1)
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault()
                  focusTab(activeIndex - 1)
                } else if (e.key === 'Home') {
                  e.preventDefault()
                  focusTab(0)
                } else if (e.key === 'End') {
                  e.preventDefault()
                  focusTab(TABS.length - 1)
                }
              }}
              style={{
                height: PREMIUM_SPACE.tabHeight,
                fontSize: PREMIUM_TYPE.tabSize,
                fontWeight: PREMIUM_TYPE.tabWeight,
                transitionDuration: PREMIUM_MOTION.durationFast,
                transitionTimingFunction: PREMIUM_MOTION.easingStandard,
              }}
              className={cn(
                'relative flex items-center gap-1.5 px-3 transition-all rounded-t-md border-b-2 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
                isActive
                  ? 'border-app-accent text-app-text bg-app-elevated/40'
                  : 'border-transparent text-app-muted hover:text-app-text hover:bg-app-elevated/20',
              )}
            >
              <Icon size={PREMIUM_ICON.tab} className={isActive ? 'text-app-accent' : 'opacity-65'} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
