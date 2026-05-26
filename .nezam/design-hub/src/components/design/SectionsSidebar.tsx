'use client'

import { useMemo } from 'react'
import { useHub } from '@/store/hub.store'
import { IconRenderer } from '@/lib/icons'
import { useSidebarResize } from '@/lib/useSidebarResize'
import {
  SECTIONS_LIBRARY,
  SECTION_CATEGORY_LABELS,
  SECTION_CATEGORY_ORDER,
  type SectionCategory,
} from '@/data/sections-library'
import { 
  Compass, Layers, LayoutTemplate, MessageSquare, DollarSign, Sparkles, 
  BookOpen, Lock, BarChart2, Dock, Inbox, Flag, Table, FileText, Grid3x3 
} from 'lucide-react'

// Match category keys with explicit icons
const CATEGORY_ICONS: Record<SectionCategory, React.ComponentType<any>> = {
  navigation: Compass,
  hero: Layers,
  features: LayoutTemplate,
  'social-proof': MessageSquare,
  pricing: DollarSign,
  cta: Sparkles,
  content: BookOpen,
  auth: Lock,
  dashboard: BarChart2,
  footer: Dock,
  'empty-states': Inbox,
  banners: Flag,
  tables: Table,
  forms: FileText,
}

export function SectionsSidebar() {
  const { width, startResize } = useSidebarResize()
  const selectedCategory = useHub((s) => s.sectionsCategory)
  const query            = useHub((s) => s.sectionsQuery)
  const setCategory      = useHub((s) => s.setSectionsCategory)
  const setQuery          = useHub((s) => s.setSectionsQuery)

  // Dynamically calculate group counts
  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    SECTIONS_LIBRARY.forEach((s) => {
      map[s.category] = (map[s.category] ?? 0) + 1
    })
    return map
  }, [])

  const totalCount = SECTIONS_LIBRARY.length

  return (
    <aside
      style={{ width }}
      className="relative flex shrink-0 flex-col border-r border-app-border bg-app-surface overflow-hidden select-none"
    >
      {/* Unified Search Location */}
      <div className="p-3 border-b border-app-border">
        <input
          type="search"
          placeholder="Search sections…"
          className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Category List */}
      <nav className="flex-1 overflow-y-auto app-scroll py-2">
        {/* All sections shortcut */}
        <button
          onClick={() => setCategory(null)}
          className={`
            w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors
            ${selectedCategory === null && !query
              ? 'bg-app-elevated text-app-text'
              : 'text-app-muted hover:text-app-text hover:bg-app-elevated/50'
            }
          `}
        >
          <Grid3x3 size={13} className="shrink-0" />
          <span className="text-[12px] font-medium flex-1">All Sections</span>
          <span className="text-[10px] text-app-muted">{totalCount}</span>
        </button>

        <div className="h-px bg-app-border mx-3 my-1" />

        {SECTION_CATEGORY_ORDER.map((cat) => {
          const count = counts[cat] ?? 0
          const isActive = selectedCategory === cat
          const Icon = CATEGORY_ICONS[cat] || Grid3x3

          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors
                ${isActive
                  ? 'bg-app-elevated text-app-text'
                  : 'text-app-muted hover:text-app-text hover:bg-app-elevated/50'
                }
              `}
            >
              <Icon size={13} className="shrink-0" />
              <span className="text-[12px] flex-1 truncate">{SECTION_CATEGORY_LABELS[cat]}</span>
              <span className="text-[10px] text-app-muted tabular-nums">{count}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-app-border px-3 py-2">
        <p className="text-[10px] text-app-muted leading-relaxed">
          {totalCount} sections across {SECTION_CATEGORY_ORDER.length} categories
        </p>
      </div>

      {/* Drag resizing handle */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-app-accent/30 active:bg-app-accent transition-colors z-50 select-none"
      />
    </aside>
  )
}
