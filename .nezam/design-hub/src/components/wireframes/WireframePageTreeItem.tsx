'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { IconRenderer } from '@/lib/icons'
import { getSortedChildren } from '@/lib/arch/page-tree'
import { isEligibleArchPage } from '@/lib/wireframe/arch-page-map'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'
import { PREMIUM_ICON, PREMIUM_MOTION, PREMIUM_SPACE, PREMIUM_TYPE } from '@/lib/design/premium-standards'

type PageStatus = 'empty' | 'draft' | 'ready'

interface Props {
  page: ArchPage
  allPages: Record<string, ArchPage>
  depth: number
  searchQuery?: string
  selectedArchPageId: string | null
  lockIdByArchId: Record<string, string>
  onSelect: (archPageId: string) => void
  getPageStatus: (archPageId: string) => PageStatus
  getStatusPillClasses: (status: PageStatus) => string
  getSavedCount: (archPageId: string) => number
}

export function WireframePageTreeItem({
  page,
  allPages,
  depth,
  searchQuery = '',
  selectedArchPageId,
  lockIdByArchId,
  onSelect,
  getPageStatus,
  getStatusPillClasses,
  getSavedCount,
}: Props) {
  const [expanded, setExpanded] = useState(true)

  const children = getSortedChildren(page.id, allPages, searchQuery)
  const hasChildren = children.length > 0
  const selectable = isEligibleArchPage(page)
  const isSelected = selectable && selectedArchPageId === page.id
  const indent = depth * 16
  const lockId = lockIdByArchId[page.id]
  const status = selectable ? getPageStatus(page.id) : null

  function handleRowClick() {
    if (selectable) {
      onSelect(page.id)
      return
    }
    if (hasChildren) setExpanded((v) => !v)
  }

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 py-0.5 pr-2 rounded-app-sm select-none transition-colors motion-reduce:transition-none',
          selectable ? 'cursor-pointer' : 'cursor-default',
          isSelected
            ? 'bg-app-accent-subtle text-app-text'
            : selectable
              ? 'text-app-muted hover:bg-app-elevated hover:text-app-text'
              : 'text-app-subtle/80',
        )}
        style={{
          minHeight: PREMIUM_SPACE.rowHeight,
          paddingLeft: `${8 + indent}px`,
          transitionDuration: PREMIUM_MOTION.durationFast,
          transitionTimingFunction: PREMIUM_MOTION.easingStandard,
        }}
        onClick={handleRowClick}
        title={page.route}
      >
        <button
          type="button"
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

        <span className="shrink-0 flex items-center">
          <IconRenderer name={page.icon} size={PREMIUM_ICON.row} />
        </span>

        <span
          className="flex-1 truncate"
          style={{
            fontSize: PREMIUM_TYPE.rowSize,
            fontWeight: PREMIUM_TYPE.rowWeight,
            lineHeight: PREMIUM_TYPE.lineHeightTight,
          }}
        >
          {page.name}
        </span>

        {selectable && status ? (
          <span
            className={cn(
              'shrink-0 px-1 py-0.5 rounded border text-[8px] font-semibold uppercase',
              getStatusPillClasses(status),
            )}
          >
            {status}
          </span>
        ) : null}
      </div>

      {selectable && lockId ? (
        <div
          className="flex items-center justify-between gap-2 pr-2 pb-1 text-[9px] text-app-subtle/90 font-mono"
          style={{ paddingLeft: `${28 + indent}px` }}
        >
          <span className="truncate">{page.route}</span>
          <span className="shrink-0">
            {lockId} · {getSavedCount(page.id)} blk
          </span>
        </div>
      ) : null}

      {hasChildren && expanded ? (
        <div>
          {children.map((child) => (
            <WireframePageTreeItem
              key={child.id}
              page={child}
              allPages={allPages}
              depth={depth + 1}
              searchQuery={searchQuery}
              selectedArchPageId={selectedArchPageId}
              lockIdByArchId={lockIdByArchId}
              onSelect={onSelect}
              getPageStatus={getPageStatus}
              getStatusPillClasses={getStatusPillClasses}
              getSavedCount={getSavedCount}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
