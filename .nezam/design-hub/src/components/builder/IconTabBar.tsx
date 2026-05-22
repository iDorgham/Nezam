'use client'

import {
  Network,
  LayoutGrid,
  Palette,
  SlidersHorizontal,
  LayoutDashboard,
  Focus,
  Layers,
  MessageCircle,
  Film,
  Sparkles,
  Bookmark,
  History,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { Tooltip } from '@/components/ui/Tooltip'
import type { BuilderMode } from '@/types'
import { cn } from '@/lib/cn'

interface ModeDef {
  id: BuilderMode
  label: string
  icon: typeof Palette
}

// Sitemap first; Profiles sits directly above Brand.
const TOP_MODES: ModeDef[] = [
  { id: 'sitemap', label: 'Sitemap', icon: Network },
  { id: 'profiles', label: 'Profiles', icon: LayoutGrid },
  { id: 'brand', label: 'Brand', icon: Palette },
  { id: 'styles', label: 'Styles', icon: SlidersHorizontal },
  { id: 'layout', label: 'Layout', icon: LayoutDashboard },
  { id: 'inspector', label: 'Inspector', icon: Focus },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'comments', label: 'Comments', icon: MessageCircle },
  { id: 'interactions', label: 'Interactions', icon: Film },
  { id: 'ai', label: 'AI Co-Pilot', icon: Sparkles },
]

// Library tabs live at the bottom of the rail.
const BOTTOM_MODES: ModeDef[] = [
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'history', label: 'History', icon: History },
]

/** Vertical icon rail on the builder's leading edge (Webflow / Elementor style). */
export function IconTabBar() {
  const builderMode = useHub((s) => s.builderMode)
  const setBuilderMode = useHub((s) => s.setBuilderMode)
  const hasSelection = useHub((s) => !!s.selection)
  const openComments = useHub((s) => s.comments.filter((c) => !c.resolved).length)

  const RailButton = ({ mode }: { mode: ModeDef }) => {
    const Icon = mode.icon
    const active = mode.id === builderMode
    const isAi = mode.id === 'ai'
    const liveDot = mode.id === 'inspector' && hasSelection && !active
    const badge = mode.id === 'comments' && openComments > 0 ? openComments : null
    return (
      <Tooltip label={mode.label} side="left">
        <button
          onClick={() => setBuilderMode(mode.id)}
          aria-pressed={active}
          aria-label={mode.label}
          className={cn(
            'focus-ring relative grid h-9 w-9 place-items-center rounded-app-sm transition-all duration-150 ease-smooth active:scale-90',
            active
              ? isAi
                ? 'bg-gradient-to-br from-app-accent to-[#4f46e5] text-app-on-accent shadow-app-glow'
                : 'bg-app-elevated text-app-text shadow-app-sm'
              : 'text-app-subtle hover:bg-app-elevated/70 hover:text-app-muted',
          )}
        >
          <Icon size={16} />
          {active && (
            <span className="absolute -left-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-app-accent" />
          )}
          {liveDot && (
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-app-accent" />
          )}
          {badge != null && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-app-accent px-1 text-[9px] font-bold text-app-on-accent">
              {badge}
            </span>
          )}
        </button>
      </Tooltip>
    )
  }

  return (
    <div className="app-scroll flex w-12 shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-app-border bg-app-inset py-2">
      {TOP_MODES.map((m) => (
        <RailButton key={m.id} mode={m} />
      ))}
      <div className="flex-1" />
      <div className="my-1 h-px w-6 bg-app-border" />
      {BOTTOM_MODES.map((m) => (
        <RailButton key={m.id} mode={m} />
      ))}
    </div>
  )
}
