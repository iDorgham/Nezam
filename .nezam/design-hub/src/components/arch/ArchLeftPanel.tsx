'use client'

import { useState } from 'react'
import { ServiceCatalogPicker } from '@/components/arch/ServiceCatalogPicker'
import { ChevronDown, FileText, Layers, Menu, Plus, Server } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { PageTreeItem } from './PageTreeItem'
import { Button } from '@/components/ui/button'
import { LeftPanelSearchRow, LeftPanelTitleRow } from '@/components/ui/LeftPanelHeader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getAppRoots, getServiceRoots, matchesArchPageSearch } from '@/lib/arch/page-tree'
import { ADDABLE_TYPE_LABELS, type AddableArchType, type ArchPage } from '@/types/arch'
import { cn } from '@/lib/utils'
import { useSidebarResize } from '@/lib/useSidebarResize'

function SitemapSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pt-2 pb-0.5 text-[9px] font-bold uppercase tracking-wider text-app-subtle">
      {children}
    </div>
  )
}

function ServiceTreeRow({ page }: { page: ArchPage }) {
  const selectedId = useHub((s) => s.arch.selectedPageId)
  const archSelectPage = useHub((s) => s.archSelectPage)
  const isSelected = selectedId === page.id

  return (
    <button
      type="button"
      onClick={() => archSelectPage(isSelected ? null : page.id)}
      className={cn(
        'flex w-full items-center gap-2 rounded-app-sm px-2 text-left text-[11px] font-medium transition-colors',
        'h-7',
        isSelected
          ? 'bg-app-accent-subtle text-app-text'
          : 'text-app-muted hover:bg-app-elevated hover:text-app-text',
      )}
    >
      <Server size={12} className="shrink-0 opacity-70" />
      <span className="truncate">{page.name}</span>
    </button>
  )
}

function PagesPanel() {
  const pages = useHub((s) => s.arch.pages)
  const [searchQuery, setSearchQuery] = useState('')

  const services = getServiceRoots(pages).filter((root) =>
    matchesArchPageSearch(root, pages, searchQuery),
  )
  const apps = getAppRoots(pages).filter((root) =>
    matchesArchPageSearch(root, pages, searchQuery),
  )
  const isEmpty = services.length === 0 && apps.length === 0

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden -mx-4 -mt-4">
      <LeftPanelSearchRow className="px-2 py-1">
        <input
          id="sitemap-search-input"
          type="text"
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 py-1 text-[11px] font-medium text-app-text focus:outline-none focus:border-app-accent focus:ring-2 focus:ring-app-accent-subtle placeholder-app-subtle transition-colors"
        />
      </LeftPanelSearchRow>
      <div className="flex-1 overflow-y-auto app-scroll py-1 min-h-0 px-1">
        {isEmpty ? (
          <div className="px-3 py-6 text-center flex flex-col items-center gap-2">
            <FileText size={16} className="text-app-subtle opacity-50" />
            <p className="text-[11px] text-app-subtle">No applications yet.</p>
            <p className="text-[10px] text-app-subtle leading-relaxed opacity-80">
              Use + Add → Application, or pick a blueprint during onboarding.
            </p>
          </div>
        ) : (
          <>
            {services.length > 0 ? (
              <div className="mb-1">
                <SitemapSectionLabel>Server rack</SitemapSectionLabel>
                {services.map((svc) => (
                  <ServiceTreeRow key={svc.id} page={svc} />
                ))}
              </div>
            ) : null}
            {apps.length > 0 ? (
              <div>
                <SitemapSectionLabel>Applications</SitemapSectionLabel>
                {apps.map((root) => (
                  <PageTreeItem
                    key={root.id}
                    page={root}
                    allPages={pages}
                    depth={0}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

function ArchAddDropdown({ onFeedback }: { onFeedback: (message: string, tone: 'error' | 'success') => void }) {
  const archAddNode = useHub((s) => s.archAddNode)
  const archAddServiceFromCatalog = useHub((s) => s.archAddServiceFromCatalog)
  const selectedId = useHub((s) => s.arch.selectedPageId)
  const pages = useHub((s) => s.arch.pages)
  const [servicePickerOpen, setServicePickerOpen] = useState(false)

  const parentId =
    selectedId && pages[selectedId] && pages[selectedId].type !== 'service'
      ? selectedId
      : null

  const items: { kind: AddableArchType; Icon: typeof Layers }[] = [
    { kind: 'application', Icon: Layers },
    { kind: 'menu', Icon: Menu },
    { kind: 'page', Icon: FileText },
    { kind: 'service', Icon: Server },
  ]

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="xs">
            <Plus size={11} className="mr-0.5" />
            Add
            <ChevronDown size={10} className="ml-0.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {items.map(({ kind, Icon }) => (
            <DropdownMenuItem
              key={kind}
              onClick={() => {
                if (kind === 'service') {
                  setServicePickerOpen(true)
                  return
                }
                const result = archAddNode(
                  kind,
                  kind === 'application' ? null : parentId,
                )
                if (!result.ok) {
                  onFeedback(result.reason, 'error')
                } else {
                  onFeedback(`${ADDABLE_TYPE_LABELS[kind]} added.`, 'success')
                }
              }}
            >
              <Icon size={12} className="mr-2 opacity-70" />
              {ADDABLE_TYPE_LABELS[kind]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ServiceCatalogPicker
        open={servicePickerOpen}
        onOpenChange={setServicePickerOpen}
        onPick={(providerId) => {
          const result = archAddServiceFromCatalog(providerId)
          if (!result.ok) {
            onFeedback(result.reason, 'error')
          } else {
            onFeedback('Service added from catalog.', 'success')
          }
        }}
      />
    </>
  )
}

export function ArchLeftPanel() {
  const { width, startResize } = useSidebarResize()
  const [feedback, setFeedback] = useState<{ message: string; tone: 'error' | 'success' } | null>(null)

  return (
    <aside
      style={{ width }}
      className="relative flex shrink-0 flex-col border-r border-app-border bg-app-surface overflow-hidden select-none"
    >
      <LeftPanelTitleRow
        title="Sitemap"
        rightSlot={
          <ArchAddDropdown
            onFeedback={(message, tone) => {
              setFeedback({ message, tone })
            }}
          />
        }
      />
      {feedback ? (
        <div className="mx-3 mt-2 rounded-app-sm border px-2.5 py-1.5 text-[10px] font-medium bg-app-surface"
          role="status"
          aria-live="polite"
        >
          <span className={feedback.tone === 'error' ? 'text-app-danger' : 'text-app-success'}>
            {feedback.message}
          </span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden p-4">
        <PagesPanel />
      </div>
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-app-accent/30 active:bg-app-accent transition-colors z-50"
      />
    </aside>
  )
}
