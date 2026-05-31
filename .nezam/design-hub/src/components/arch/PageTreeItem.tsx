'use client'

import { useState } from 'react'
import { ChevronRight, Plus, X } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'
import { PREMIUM_ICON, PREMIUM_MOTION, PREMIUM_SPACE, PREMIUM_TYPE } from '@/lib/design/premium-standards'
import { getSortedChildren } from '@/lib/arch/page-tree'
import { menuPlacementLabel } from '@/lib/arch/migrate-legacy-nav-menus'

interface Props {
  page: ArchPage
  allPages: Record<string, ArchPage>
  depth: number
  searchQuery?: string
}

export function PageTreeItem({ page, allPages, depth, searchQuery = '' }: Props) {
  const selectedId     = useHub((s) => s.arch.selectedPageId)
  const archSelectPage = useHub((s) => s.archSelectPage)
  const archAddPage    = useHub((s) => s.archAddPage)
  const archDeletePage = useHub((s) => s.archDeletePage)

  const [expanded, setExpanded] = useState(true)
  const [hovered, setHovered]   = useState(false)

  const children = getSortedChildren(page.id, allPages, searchQuery)

  const hasChildren = children.length > 0
  const isSelected  = selectedId === page.id

  const indent = depth * 16

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 pr-2 rounded-app-sm cursor-pointer select-none transition-colors motion-reduce:transition-none',
          isSelected
            ? 'bg-app-accent-subtle text-app-text'
            : 'text-app-muted hover:bg-app-elevated hover:text-app-text',
        )}
        style={{
          height: PREMIUM_SPACE.rowHeight,
          paddingLeft: `${8 + indent}px`,
          transitionDuration: PREMIUM_MOTION.durationFast,
          transitionTimingFunction: PREMIUM_MOTION.easingStandard,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => archSelectPage(isSelected ? null : page.id)}
      >
        {/* Expand toggle */}
        <button
          className={cn(
            'flex h-4 w-4 shrink-0 items-center justify-center rounded transition-transform motion-reduce:transition-none',
            hasChildren ? 'opacity-100' : 'opacity-0 pointer-events-none',
            expanded ? 'rotate-90' : '',
          )}
          style={{
            transitionDuration: PREMIUM_MOTION.durationBase,
            transitionTimingFunction: PREMIUM_MOTION.easingStandard,
          }}
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
        >
          <ChevronRight size={PREMIUM_ICON.control} />
        </button>

        {/* Icon */}
        <span className="shrink-0 flex items-center">
          <IconRenderer name={page.icon} size={PREMIUM_ICON.row} />
        </span>

        {/* Name */}
        <span
          className="flex flex-1 min-w-0 items-center gap-1 truncate"
          style={{
            fontSize: PREMIUM_TYPE.rowSize,
            fontWeight: PREMIUM_TYPE.rowWeight,
            lineHeight: PREMIUM_TYPE.lineHeightTight,
          }}
        >
          <span className="truncate">{page.name}</span>
          {page.type === 'navmenu' ? (
            <span className="shrink-0 text-[9px] font-medium text-violet-600/80 dark:text-violet-400/90">
              ({menuPlacementLabel(page.menuPlacement)})
            </span>
          ) : null}
        </span>

        {/* Route pill */}
        <span className={cn(
          'shrink-0 text-[10px] text-app-subtle font-mono',
          'hidden group-hover:block',
        )}>
          {page.route.length > 16 ? '…' + page.route.slice(-12) : page.route}
        </span>

        {/* Actions — shown on hover */}
        {hovered && (
          <div className="flex items-center gap-0.5 ml-1">
            <button
              className="flex h-4 w-4 items-center justify-center rounded hover:bg-app-border text-app-subtle hover:text-app-text"
              title="Add child page"
              onClick={(e) => {
                e.stopPropagation()
                archAddPage(page.id)
                setExpanded(true)
              }}
            >
              <Plus size={10} />
            </button>
            <button
              className="flex h-4 w-4 items-center justify-center rounded hover:bg-red-500/15 text-app-subtle hover:text-red-400"
              title="Delete page"
              onClick={(e) => {
                e.stopPropagation()
                archDeletePage(page.id)
              }}
            >
              <X size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {children.map((child) => (
            <PageTreeItem key={child.id} page={child} allPages={allPages} depth={depth + 1} searchQuery={searchQuery} />
          ))}
        </div>
      )}
    </div>
  )
}
