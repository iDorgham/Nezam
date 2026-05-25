'use client'

import { useState } from 'react'
import {
  Network,
  LayoutDashboard,
  Focus,
  Layers,
  MessageCircle,
  Wand2,
  Film,
  Sparkles,
  // DS group sub-icons
  Shapes,
  Palette,
  Type,
  Ruler,
  BoxSelect,
  LayoutGrid,
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

/** Primary tools above the DS group. */
const TOP_BEFORE: ModeDef[] = [
  { id: 'sitemap', label: 'Structure', icon: Network },
]

/** Primary tools below the DS group. */
const TOP_AFTER: ModeDef[] = [
  { id: 'layout',    label: 'Layout',    icon: LayoutDashboard },
  { id: 'inspector', label: 'Inspector', icon: Focus           },
  { id: 'layers',    label: 'Layers',    icon: Layers          },
  { id: 'comments',  label: 'Comments',  icon: MessageCircle   },
  { id: 'theme',     label: 'Theme',     icon: Wand2           },
]

/** Bottom utility tools. */
const BOTTOM_MODES: ModeDef[] = [
  { id: 'interactions', label: 'Interactions', icon: Film     },
  { id: 'ai',           label: 'AI Co-Pilot',  icon: Sparkles },
]

/** Design System group sub-items. Each maps to a builderMode + optional dsSection. */
const DS_SUB_ITEMS: { id: BuilderMode; label: string; icon: typeof Palette; section?: string }[] = [
  { id: 'brand',      label: 'Colors',     icon: Palette,    section: 'colors'     },
  { id: 'typography', label: 'Typography', icon: Type,       section: 'typography' },
  { id: 'spacing',    label: 'Spacing',    icon: Ruler,      section: 'spacing'    },
  { id: 'styles',     label: 'Shape',      icon: BoxSelect,  section: 'shape'      },
  { id: 'profiles',   label: 'Profiles',   icon: LayoutGrid                        },
]

/** Vertical icon rail on the builder's leading edge. */
export function IconTabBar() {
  const builderMode       = useHub((s) => s.builderMode)
  const setBuilderMode    = useHub((s) => s.setBuilderMode)
  const setDsActiveSection = useHub((s) => s.setDsActiveSection)
  const hasSelection      = useHub((s) => !!s.selection)
  const openComments      = useHub((s) => s.comments.filter((c) => !c.resolved).length)

  const [dsExpanded, setDsExpanded] = useState(false)

  // Determine if a DS sub-item is active
  const dsSubActive = DS_SUB_ITEMS.some((i) => i.id === builderMode)
  // Treat the DS group header as active when any sub-item is active
  const dsGroupActive = dsSubActive || dsExpanded

  const RailButton = ({
    mode,
    label,
    forceActive,
  }: {
    mode: BuilderMode
    label: string
    forceActive?: boolean
  }) => {
    const icons: Record<string, typeof Palette> = {
      sitemap: Network, layout: LayoutDashboard, inspector: Focus, layers: Layers,
      comments: MessageCircle, theme: Wand2, interactions: Film, ai: Sparkles,
      brand: Palette, typography: Type, spacing: Ruler, styles: BoxSelect, profiles: LayoutGrid,
    }
    const Icon     = icons[mode] ?? Focus
    const active   = forceActive ?? (mode === builderMode)
    const isAi     = mode === 'ai'
    const liveDot  = mode === 'inspector' && hasSelection && !active
    const badge    = mode === 'comments' && openComments > 0 ? openComments : null

    return (
      <Tooltip label={label} side="left">
        <button
          onClick={() => setBuilderMode(mode)}
          aria-pressed={active}
          aria-label={label}
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
      {/* Items above DS group */}
      {TOP_BEFORE.map((m) => (
        <RailButton key={m.id} mode={m.id} label={m.label} />
      ))}

      {/* ── Design System group ─────────────────────────── */}
      <Tooltip label="Design System" side="left">
        <button
          onClick={() => setDsExpanded((v) => !v)}
          aria-pressed={dsGroupActive}
          aria-label="Design System"
          className={cn(
            'focus-ring relative grid h-9 w-9 place-items-center rounded-app-sm transition-all duration-150 ease-smooth active:scale-90',
            dsGroupActive
              ? 'bg-app-elevated text-app-text shadow-app-sm'
              : 'text-app-subtle hover:bg-app-elevated/70 hover:text-app-muted',
          )}
        >
          <Shapes size={16} />
          {dsGroupActive && (
            <span className="absolute -left-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-app-accent" />
          )}
        </button>
      </Tooltip>

      {/* DS sub-items — visible when expanded */}
      {dsExpanded && (
        <div className="relative flex flex-col items-center gap-0.5">
          {/* Left accent line connecting sub-items */}
          <div className="absolute -left-0.5 top-0 bottom-0 w-0.5 rounded-full bg-app-accent/40" />
          {DS_SUB_ITEMS.map((sub) => {
            const Icon   = sub.icon
            const active = sub.id === builderMode
            return (
              <Tooltip key={sub.id} label={sub.label} side="left">
                <button
                  onClick={() => {
                    setBuilderMode(sub.id)
                    if (sub.section) setDsActiveSection(sub.section)
                  }}
                  aria-pressed={active}
                  aria-label={sub.label}
                  className={cn(
                    'focus-ring relative grid h-8 w-8 place-items-center rounded-app-sm transition-all duration-150 ease-smooth active:scale-90',
                    active
                      ? 'bg-app-elevated text-app-text shadow-app-sm'
                      : 'text-app-subtle hover:bg-app-elevated/70 hover:text-app-muted',
                  )}
                >
                  <Icon size={14} />
                  {active && (
                    <span className="absolute -left-2 top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-app-accent" />
                  )}
                </button>
              </Tooltip>
            )
          })}
        </div>
      )}

      {/* Items below DS group */}
      {TOP_AFTER.map((m) => (
        <RailButton key={m.id} mode={m.id} label={m.label} />
      ))}

      <div className="flex-1" />
      <div className="my-1 h-px w-6 bg-app-border" />

      {BOTTOM_MODES.map((m) => (
        <RailButton key={m.id} mode={m.id} label={m.label} />
      ))}
    </div>
  )
}
