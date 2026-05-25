'use client'

import { useState } from 'react'
import { ChevronRight, Plus, X } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'

interface Props {
  page: ArchPage
  allPages: Record<string, ArchPage>
  depth: number
}

export function PageTreeItem({ page, allPages, depth }: Props) {
  const selectedId     = useHub((s) => s.arch.selectedPageId)
  const archSelectPage = useHub((s) => s.archSelectPage)
  const archAddPage    = useHub((s) => s.archAddPage)
  const archDeletePage = useHub((s) => s.archDeletePage)

  const [expanded, setExpanded] = useState(true)
  const [hovered, setHovered]   = useState(false)

  const children = Object.values(allPages)
    .filter((p) => p.parentId === page.id)
    .sort((a, b) => a.order - b.order)

  const hasChildren = children.length > 0
  const isSelected  = selectedId === page.id

  const indent = depth * 16

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 h-7 pr-2 rounded-app-sm cursor-pointer select-none transition-colors duration-75',
          isSelected
            ? 'bg-app-accent-subtle text-app-text'
            : 'text-app-muted hover:bg-app-elevated hover:text-app-text',
        )}
        style={{ paddingLeft: `${8 + indent}px` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => archSelectPage(isSelected ? null : page.id)}
      >
        {/* Expand toggle */}
        <button
          className={cn(
            'flex h-4 w-4 shrink-0 items-center justify-center rounded transition-transform duration-150',
            hasChildren ? 'opacity-100' : 'opacity-0 pointer-events-none',
            expanded ? 'rotate-90' : '',
          )}
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
        >
          <ChevronRight size={11} />
        </button>

        {/* Icon */}
        <span className="shrink-0 flex items-center">
          <IconRenderer name={page.icon} size={13} />
        </span>

        {/* Name */}
        <span className="flex-1 truncate text-xs font-medium">{page.name}</span>

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
            <PageTreeItem key={child.id} page={child} allPages={allPages} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
