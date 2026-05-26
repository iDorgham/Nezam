'use client'

import { useHub } from '@/store/hub.store'
import { IconRenderer } from '@/lib/icons'
import { useSidebarResize } from '@/lib/useSidebarResize'
import {
  GROUP_LABELS,
  GROUP_ICONS,
  GROUP_ORDER,
  getGroupCounts,
  type ComponentGroup,
} from '@/data/components-library'

const COUNTS = getGroupCounts()

export function ComponentsSidebar() {
  const { width, startResize } = useSidebarResize()
  const selectedGroup = useHub((s) => s.comp.selectedGroup)
  const query         = useHub((s) => s.comp.query)
  const setGroup      = useHub((s) => s.compSetGroup)
  const setQuery      = useHub((s) => s.compSetQuery)

  return (
    <aside
      style={{ width }}
      className="relative flex shrink-0 flex-col border-r border-app-border bg-app-surface overflow-hidden select-none"
    >
      {/* Search */}
      <div className="p-3 border-b border-app-border">
        <input
          type="search"
          placeholder="Search components…"
          className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Group list */}
      <nav className="flex-1 overflow-y-auto app-scroll py-2">
        {/* All components shortcut */}
        <button
          onClick={() => setGroup(null)}
          className={`
            w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors
            ${selectedGroup === null && !query
              ? 'bg-app-elevated text-app-text'
              : 'text-app-muted hover:text-app-text hover:bg-app-elevated/50'
            }
          `}
        >
          <IconRenderer name="Grid3x3" size={13} className="shrink-0" />
          <span className="text-[12px] font-medium flex-1">All Components</span>
          <span className="text-[10px] text-app-muted">{COUNTS ? Object.values(COUNTS).reduce((a, b) => a + b, 0) : ''}</span>
        </button>

        <div className="h-px bg-app-border mx-3 my-1" />

        {GROUP_ORDER.map((group) => {
          const count = COUNTS[group] ?? 0
          const isActive = selectedGroup === group

          return (
            <button
              key={group}
              onClick={() => setGroup(group)}
              className={`
                w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors
                ${isActive
                  ? 'bg-app-elevated text-app-text'
                  : 'text-app-muted hover:text-app-text hover:bg-app-elevated/50'
                }
              `}
            >
              <IconRenderer
                name={GROUP_ICONS[group] ?? 'Box'}
                size={13}
                className="shrink-0"
              />
              <span className="text-[12px] flex-1 truncate">{GROUP_LABELS[group]}</span>
              <span className="text-[10px] text-app-muted tabular-nums">{count}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-app-border px-3 py-2">
        <p className="text-[10px] text-app-muted leading-relaxed">
          {Object.values(COUNTS).reduce((a, b) => a + b, 0)} components across{' '}
          {GROUP_ORDER.length} groups
        </p>
      </div>

      {/* Resizer Handle */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-app-accent/30 active:bg-app-accent transition-colors z-50 select-none"
      />
    </aside>
  )
}
