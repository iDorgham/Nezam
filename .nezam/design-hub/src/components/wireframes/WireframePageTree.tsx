'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTreeRoots, matchesArchPageSearch } from '@/lib/arch/page-tree'
import { WireframePageTreeItem } from './WireframePageTreeItem'
import type { ArchPage } from '@/types/arch'
import { PREMIUM_MOTION, PREMIUM_SPACE, PREMIUM_TYPE } from '@/lib/design/premium-standards'

type PageStatus = 'empty' | 'draft' | 'ready'

interface Props {
  pages: Record<string, ArchPage>
  selectedArchPageId: string | null
  lockIdByArchId: Record<string, string>
  onSelect: (archPageId: string) => void
  getPageStatus: (archPageId: string) => PageStatus
  getStatusPillClasses: (status: PageStatus) => string
  getSavedCount: (archPageId: string) => number
  title?: string
  description?: string
  searchPlaceholder?: string
  showTitle?: boolean
  /** When true, negative margins bleed into a parent with `p-4` (Preview sidebar). */
  bleed?: boolean
}

export function WireframePageTree({
  pages,
  selectedArchPageId,
  lockIdByArchId,
  onSelect,
  getPageStatus,
  getStatusPillClasses,
  getSavedCount,
  title = 'Wireframe pages',
  description,
  searchPlaceholder = 'Search pages...',
  showTitle = true,
  bleed = true,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('')

  const roots = getTreeRoots(pages).filter((root) => matchesArchPageSearch(root, pages, searchQuery))
  const isEmpty = roots.length === 0

  return (
    <div
      data-spotlight="wireframes-page-tree"
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-hidden',
        bleed && '-mx-4 -mt-4',
      )}
    >
      {showTitle ? (
        <div className="h-10 px-4 border-b border-app-border shrink-0 flex items-center">
          <div className="text-xs font-semibold text-app-text">{title}</div>
        </div>
      ) : null}

      {description ? (
        <div className="shrink-0 border-b border-app-border px-4 py-2">
          <div
            className="text-app-subtle"
            style={{ fontSize: PREMIUM_TYPE.metaSize, fontWeight: PREMIUM_TYPE.metaWeight }}
          >
            {description}
          </div>
        </div>
      ) : null}

      <div className="px-2 pb-2 pt-2 border-b border-app-border shrink-0">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            height: PREMIUM_SPACE.rowHeight,
            fontSize: '11px',
            fontWeight: PREMIUM_TYPE.rowWeight,
            transitionDuration: PREMIUM_MOTION.durationFast,
            transitionTimingFunction: PREMIUM_MOTION.easingStandard,
          }}
          className="w-full rounded-app-sm border border-app-border bg-app-elevated px-2 py-1 text-app-text focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent/30 placeholder-app-subtle transition-colors motion-reduce:transition-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto app-scroll py-1 min-h-0 px-1">
        {isEmpty ? (
          <div className="px-3 py-6 text-center flex flex-col items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl opacity-50 bg-app-accent-subtle border border-app-accent/20">
              <FileText size={16} className="text-app-accent" />
            </div>
            <p className="text-[11px] text-app-subtle">No pages in sitemap.</p>
            <p className="text-[10px] text-app-subtle leading-relaxed opacity-80">
              Add pages in Architecture or apply an onboarding profile.
            </p>
          </div>
        ) : (
          roots.map((root) => (
            <WireframePageTreeItem
              key={root.id}
              page={root}
              allPages={pages}
              depth={0}
              searchQuery={searchQuery}
              selectedArchPageId={selectedArchPageId}
              lockIdByArchId={lockIdByArchId}
              onSelect={onSelect}
              getPageStatus={getPageStatus}
              getStatusPillClasses={getStatusPillClasses}
              getSavedCount={getSavedCount}
            />
          ))
        )}
      </div>
    </div>
  )
}
