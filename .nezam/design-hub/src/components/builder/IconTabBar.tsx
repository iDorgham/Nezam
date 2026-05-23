'use client'

import { Focus, Layers, Network, Menu, Settings } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { Tooltip } from '@/components/ui/Tooltip'
import type { BuilderMode } from '@/types'
import { cn } from '@/lib/cn'

interface ModeDef {
  id: BuilderMode
  label: string
  icon: typeof Focus
}

const TABS: ModeDef[] = [
  { id: 'inspector', label: 'Inspector', icon: Focus },
  { id: 'pages', label: 'Pages', icon: Layers },
  { id: 'sitemap', label: 'Sitemaps', icon: Network },
  { id: 'menus', label: 'Menus', icon: Menu },
  { id: 'settings', label: 'Settings', icon: Settings },
]

/** Vertical tab icon rail on the right side of the workspace. */
export function IconTabBar() {
  const builderMode = useHub((s) => s.builderMode)
  const setBuilderMode = useHub((s) => s.setBuilderMode)
  const hasSelection = useHub((s) => !!s.selection)
  const openComments = useHub((s) => s.comments.filter((c) => !c.resolved).length)

  const RailButton = ({ mode }: { mode: ModeDef }) => {
    const Icon = mode.icon
    const active = mode.id === builderMode
    const liveDot = mode.id === 'inspector' && hasSelection && !active
    const badge = mode.id === 'menus' && openComments > 0 ? openComments : null

    return (
      <Tooltip label={mode.label} side="left">
        <button
          onClick={() => setBuilderMode(mode.id)}
          aria-pressed={active}
          aria-label={mode.label}
          className={cn(
            'focus-ring relative grid h-9 w-9 place-items-center rounded-app-sm transition-all duration-150 ease-smooth active:scale-90',
            active
              ? 'bg-app-elevated text-app-text shadow-app-sm border border-app-border'
              : 'text-app-subtle hover:bg-app-elevated/70 hover:text-app-muted'
          )}
        >
          <Icon size={16} />
          {active && (
            <span className="absolute -left-[3px] top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-app-accent animate-pulse" />
          )}
          {liveDot && (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-app-accent animate-ping" />
          )}
        </button>
      </Tooltip>
    )
  }

  return (
    <div className="flex w-12 shrink-0 flex-col items-center gap-2 border-r border-app-border bg-app-inset py-3 shadow-inner">
      {TABS.map((m) => (
        <RailButton key={m.id} mode={m} />
      ))}
    </div>
  )
}
