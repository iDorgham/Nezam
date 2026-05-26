'use client'

import { Eye, Puzzle, LayoutTemplate } from 'lucide-react'
import { useHub, type PreviewSubTab } from '@/store/hub.store'
import { cn } from '@/lib/utils'

const TABS: { id: PreviewSubTab; label: string; Icon: React.ComponentType<any> }[] = [
  { id: 'preview',    label: 'Pages',      Icon: Eye },
  { id: 'components', label: 'Components', Icon: Puzzle },
  { id: 'sections',   label: 'Sections',   Icon: LayoutTemplate },
]

export function PreviewSubTabs() {
  const active = useHub((s) => s.preview.subTab)
  const setTab = useHub((s) => s.previewSetSubTab)

  return (
    <div className="shrink-0 flex items-center h-10 px-6 border-b border-app-border bg-app-surface select-none">
      <nav className="flex items-center gap-1.5 h-full">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'relative flex items-center gap-1.5 h-full px-3 text-[11.5px] font-bold transition-all duration-100 rounded-t-md border-b-2',
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
