'use client'

import { Layers, Puzzle, LayoutTemplate, Palette } from 'lucide-react'
import { useHub, type DesignSubTab } from '@/store/hub.store'
import { cn } from '@/lib/utils'

const TABS: { id: DesignSubTab; label: string; Icon: React.ComponentType<any> }[] = [
  { id: 'tokens',     label: 'Tokens',     Icon: Layers },
]

export function DesignSubTabs() {
  const active = useHub((s) => s.design.subTab)
  const setTab = useHub((s) => s.designSetSubTab)

  return (
    <div className="shrink-0 flex items-center h-11 px-6 border-b border-app-border bg-app-surface select-none">
      <nav className="flex items-center gap-1.5 h-full" role="tablist" aria-label="Design view tabs">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`design-subpanel-${id}`}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                'relative flex items-center gap-1.5 h-full px-3 text-[11.5px] font-bold transition-all duration-100 rounded-t-md border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
                isActive
                  ? 'border-app-accent text-app-text bg-app-elevated/40'
                  : 'border-transparent text-app-muted hover:text-app-text hover:bg-app-elevated/20',
              )}
            >
              <Icon size={12} className={isActive ? 'text-app-accent' : 'opacity-65'} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
