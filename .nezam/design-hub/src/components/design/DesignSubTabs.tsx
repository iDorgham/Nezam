'use client'

import { Layers, Puzzle, Palette, LayoutTemplate } from 'lucide-react'
import { useHub, type DesignSubTab } from '@/store/hub.store'
import { cn } from '@/lib/utils'

const SUB_TABS: { id: DesignSubTab; label: string; Icon: React.FC<{ size?: number; className?: string }>; desc: string }[] = [
  { id: 'tokens',     label: 'Tokens',     Icon: Layers,         desc: 'Foundational design tokens' },
  { id: 'components', label: 'Components', Icon: Puzzle,         desc: 'Live UI component library' },
  { id: 'sections',   label: 'Sections',   Icon: LayoutTemplate, desc: 'Page section library with live previews' },
  { id: 'theming',    label: 'Theming',    Icon: Palette,        desc: 'Adjust colors, fonts & CSS export' },
]

export function DesignSubTabs() {
  const subTab    = useHub((s) => s.design.subTab)
  const setSubTab = useHub((s) => s.designSetSubTab)

  return (
    <div className="shrink-0 flex items-center gap-1 px-4 h-10 border-b border-app-border bg-app-surface">
      {SUB_TABS.map(({ id, label, Icon, desc }) => {
        const active = subTab === id
        return (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            title={desc}
            className={cn(
              'relative flex items-center gap-1.5 h-full px-3 text-[11px] font-medium transition-colors duration-100 select-none',
              active ? 'text-app-text' : 'text-app-muted hover:text-app-text',
            )}
          >
            <Icon size={12} className={active ? 'text-app-accent' : ''} />
            {label}
            {active && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-app-accent" />
            )}
          </button>
        )
      })}
    </div>
  )
}
