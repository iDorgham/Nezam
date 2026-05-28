'use client'

import { Eye, MessageSquare, Plus, Trash, Search, Layers3, GripVertical, EyeOff, Lock, Unlock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DndContext, PointerSensor, type DragEndEvent, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import dynamic from 'next/dynamic'
import { useHub, type CommentPin } from '@/store/hub.store'
import type { ArchPage } from '@/types/arch'
import { cn } from '@/lib/utils'
import { LeftPanelTabsRow, LeftPanelTitleRow } from '@/components/ui/LeftPanelHeader'
import { useSidebarResize } from '@/lib/useSidebarResize'
import { WireframePageTree } from '@/components/wireframes/WireframePageTree'
import { BrowserPreview } from './BrowserPreview'
import { PreviewSubTabs } from './PreviewSubTabs'
import { detectTemplate, TEMPLATE_INFO, resolveTemplateLayerOrder } from '@/lib/preview/templates'
import { PREMIUM_ICON, PREMIUM_MOTION, PREMIUM_SPACE, PREMIUM_TYPE } from '@/lib/design/premium-standards'

const SectionsSection = dynamic(
  () => import('@/components/design/SectionsSection').then((m) => ({ default: m.SectionsSection })),
  { ssr: false },
)

const EMPTY_COMMENTS: CommentPin[] = []

function resolveTemplateLayers(page: ArchPage, overrideOrder: string[]): string[] {
  const base = TEMPLATE_INFO[detectTemplate(page)]?.layers ?? []
  return resolveTemplateLayerOrder(base, overrideOrder)
}

function isPreviewableNode(page: ArchPage | null | undefined): page is ArchPage {
  if (!page) return false
  return page.type === 'page' || page.type === 'subpage'
}

function SortableLayerRow({
  id,
  hidden,
  locked,
  onToggleHidden,
  onToggleLocked,
}: {
  id: string
  hidden: boolean
  locked: boolean
  onToggleHidden: () => void
  onToggleLocked: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: locked,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group flex items-center gap-2 h-7 px-2.5 rounded-app-sm border border-app-border bg-app-elevated/20 text-[11px] hover:bg-app-elevated/35 transition-colors',
        hidden ? 'opacity-45' : 'opacity-100',
        isDragging && 'shadow-md bg-app-surface',
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={locked}
        className={cn(
          'h-5 w-5 shrink-0 rounded border border-app-border/80 flex items-center justify-center text-app-subtle bg-app-surface/50',
          locked ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing hover:text-app-text',
        )}
        title={locked ? 'Layer locked' : 'Drag to reorder layer'}
      >
        <GripVertical size={11} />
      </button>

      <span className="flex-1 truncate text-app-text font-medium leading-none">{id}</span>

      <button
        type="button"
        onClick={onToggleHidden}
        className="h-5 w-5 rounded border border-app-border/80 bg-app-surface/50 flex items-center justify-center text-app-subtle hover:text-app-text"
        title={hidden ? 'Show layer' : 'Hide layer'}
      >
        {hidden ? <EyeOff size={11} /> : <Eye size={11} />}
      </button>

      <button
        type="button"
        onClick={onToggleLocked}
        className="h-5 w-5 rounded border border-app-border/80 bg-app-surface/50 flex items-center justify-center text-app-subtle hover:text-app-text"
        title={locked ? 'Unlock layer' : 'Lock layer'}
      >
        {locked ? <Lock size={11} /> : <Unlock size={11} />}
      </button>
    </div>
  )
}

function PagesLayersPanel({
  pages,
  selectedPageId,
  onSelectPage,
}: {
  pages: Record<string, ArchPage>
  selectedPageId: string | null
  onSelectPage: (id: string) => void
}) {
  const { width, startResize } = useSidebarResize()
  const [activeTab, setActiveTab] = useState<'pages' | 'comments'>('pages')
  const [search, setSearch] = useState('')

  const comments = useHub((s) => s.preview.comments) || EMPTY_COMMENTS
  const isAddingComment = useHub((s) => s.preview.isAddingComment)
  const deleteComment = useHub((s) => s.previewDeleteComment)
  const setIsAdding = useHub((s) => s.previewSetIsAddingComment)
  const layerStateByPage = useHub((s) => s.preview.layerStateByPage) ?? {}
  const setLayerOrder = useHub((s) => s.previewSetLayerOrder)
  const toggleLayerHidden = useHub((s) => s.previewToggleLayerHidden)
  const toggleLayerLocked = useHub((s) => s.previewToggleLayerLocked)

  const sortedPages = useMemo(() => Object.values(pages).sort((a, b) => a.order - b.order), [pages])
  const resolvedSelectedId =
    selectedPageId && isPreviewableNode(pages[selectedPageId])
      ? selectedPageId
      : sortedPages.find((p) => isPreviewableNode(p))?.id ?? null

  const selectedPage = resolvedSelectedId ? pages[resolvedSelectedId] : null

  const pageComments = useMemo(
    () => comments.filter((c) => c.pageId === resolvedSelectedId),
    [comments, resolvedSelectedId],
  )
  const filteredComments = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return pageComments
    return pageComments.filter((c) => c.text.toLowerCase().includes(q) || c.author.toLowerCase().includes(q))
  }, [pageComments, search])

  const layerState = resolvedSelectedId ? layerStateByPage[resolvedSelectedId] : undefined
  const layers = selectedPage ? resolveTemplateLayers(selectedPage, layerState?.order ?? []) : []
  const hidden = new Set(layerState?.hidden ?? [])
  const locked = new Set(layerState?.locked ?? [])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const handleLayerDragEnd = (e: DragEndEvent) => {
    if (!resolvedSelectedId || !e.over?.id || e.active.id === e.over.id) return
    const oldIdx = layers.findIndex((id) => id === String(e.active.id))
    const nextIdx = layers.findIndex((id) => id === String(e.over?.id))
    if (oldIdx < 0 || nextIdx < 0) return
    setLayerOrder(resolvedSelectedId, arrayMove(layers, oldIdx, nextIdx))
  }

  const getPageStatus = (archPageId: string) =>
    archPageId === resolvedSelectedId ? ('ready' as const) : ('empty' as const)
  const getStatusPillClasses = (status: 'empty' | 'draft' | 'ready') =>
    status === 'ready'
      ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-500/40'
      : 'bg-app-bg text-app-subtle border-app-border'

  return (
    <aside
      style={{ width }}
      className="relative flex shrink-0 flex-col border-r border-app-border bg-app-surface/95 overflow-hidden select-none"
    >
      <LeftPanelTitleRow
        title="Preview panel"
        rightSlot={
          <span className="text-[9.5px] font-mono text-app-subtle">
            {activeTab === 'pages' ? `${Object.keys(pages).length} nodes` : `${pageComments.length} notes`}
          </span>
        }
      />
      <LeftPanelTabsRow className="px-2 py-1" role="tablist" aria-label="Preview panel tabs">
        <PanelTabBtn
          id="preview-panel-tab-pages"
          controls="preview-panel-pages"
          label="Pages"
          Icon={Eye}
          active={activeTab === 'pages'}
          onClick={() => {
            setActiveTab('pages')
            setSearch('')
          }}
        />
        <PanelTabBtn
          id="preview-panel-tab-comments"
          controls="preview-panel-comments"
          label="Comments"
          Icon={MessageSquare}
          active={activeTab === 'comments'}
          onClick={() => {
            setActiveTab('comments')
            setSearch('')
          }}
        />
      </LeftPanelTabsRow>

      {activeTab === 'comments' && (
        <div className="px-3 pb-3 pt-2.5 border-b border-app-border shrink-0 bg-app-surface/40">
          <div className="relative flex items-center h-8 bg-app-elevated/70 border border-app-border rounded-app-sm px-2.5">
            <Search size={11} className="text-app-subtle mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Search comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[11px] text-app-text outline-none placeholder:text-app-subtle"
            />
          </div>
        </div>
      )}

      {activeTab === 'pages' && (
        <div id="preview-panel-pages" role="tabpanel" aria-labelledby="preview-panel-tab-pages" className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-4">
            <WireframePageTree
              pages={pages}
              selectedArchPageId={resolvedSelectedId}
              lockIdByArchId={{}}
              onSelect={onSelectPage}
              getPageStatus={getPageStatus}
              getStatusPillClasses={getStatusPillClasses}
              getSavedCount={() => 0}
              searchPlaceholder="Search preview pages..."
              showTitle={false}
            />
          </div>

          {selectedPage && (
            <div className="shrink-0 border-t border-app-border px-3 pt-2.5 pb-3 bg-app-bg/40">
              <div className="flex items-center justify-between gap-1.5 px-0.5 pb-2">
                <div className="flex items-center gap-1.5">
                <Layers3 size={12} className="text-app-accent" />
                <span className="text-[11px] font-semibold text-app-text">Layers</span>
                </div>
                <span className="text-[10px] font-mono text-app-subtle">{layers.length}</span>
              </div>

              <DndContext sensors={sensors} onDragEnd={handleLayerDragEnd}>
                <SortableContext items={layers} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-1.5 max-h-56 overflow-auto app-scroll pr-0.5 pl-0.5">
                    {layers.map((layerId) => (
                      <SortableLayerRow
                        key={layerId}
                        id={layerId}
                        hidden={hidden.has(layerId)}
                        locked={locked.has(layerId)}
                        onToggleHidden={() => resolvedSelectedId && toggleLayerHidden(resolvedSelectedId, layerId)}
                        onToggleLocked={() => resolvedSelectedId && toggleLayerLocked(resolvedSelectedId, layerId)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div id="preview-panel-comments" role="tabpanel" aria-labelledby="preview-panel-tab-comments" className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-app-border shrink-0 bg-app-surface/50">
            <button
              onClick={() => setIsAdding(!isAddingComment)}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 h-8 rounded-app-sm text-[11px] font-semibold transition-all duration-100',
                isAddingComment
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-app-accent text-white hover:bg-app-accent-hover active:scale-[0.98]',
              )}
            >
              <Plus size={12} />
              {isAddingComment ? 'Click canvas to drop pin...' : 'Add Pin Comment'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto app-scroll px-3 py-3 flex flex-col gap-2.5 min-h-0">
            {filteredComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-3 text-center gap-2 animate-in fade-in duration-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-app-accent/8 border border-app-accent/15 opacity-50">
                  <MessageSquare size={16} className="text-app-accent" />
                </div>
                <p className="text-[11px] text-app-subtle font-semibold">No comments yet</p>
                <p className="text-[10px] text-app-subtle leading-relaxed opacity-80 max-w-[180px]">
                  Click "Add Pin Comment" and click anywhere on the viewport to leave feedback.
                </p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="group/comment p-2.5 rounded-app-sm border border-app-border bg-app-elevated/25 hover:bg-app-elevated/65 transition-colors flex flex-col gap-1.5 relative select-text animate-in fade-in duration-150"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-app-accent text-white text-[10px] font-bold">
                      {pageComments.indexOf(comment) + 1}
                    </span>
                    <span className="text-[11px] font-bold text-app-text truncate">{comment.author}</span>
                    <span className="text-[9px] text-app-subtle ml-auto font-mono shrink-0">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-app-muted leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="absolute top-2.5 right-2 h-5 w-5 rounded items-center justify-center hidden group-hover/comment:flex hover:bg-red-500/15 text-app-subtle hover:text-red-400 transition-colors"
                    title="Delete comment"
                  >
                    <Trash size={10} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-app-accent/30 active:bg-app-accent transition-colors z-50 select-none"
      />
    </aside>
  )
}

export function PreviewSection() {
  const pages = useHub((s) => s.arch.pages)
  const selectedPageId = useHub((s) => s.preview.selectedPageId)
  const selectPage = useHub((s) => s.previewSelectPage)
  const subTab = useHub((s) => s.preview.subTab)

  const sortedPages = Object.values(pages).sort((a, b) => a.order - b.order)
  const selectedPage =
    selectedPageId && isPreviewableNode(pages[selectedPageId])
      ? pages[selectedPageId]
      : sortedPages.find((p) => isPreviewableNode(p)) ?? null

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {subTab === 'preview' && (
        <PagesLayersPanel pages={pages} selectedPageId={selectedPageId} onSelectPage={selectPage} />
      )}

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col">
          {subTab === 'preview' && (
            <>
              <PreviewSubTabs />
              <div id="preview-subpanel-preview" role="tabpanel" aria-labelledby="preview-subtab-preview" className="flex min-h-0 flex-1">
                {selectedPage ? (
                  <BrowserPreview page={selectedPage} />
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center h-full">
                    <Eye size={40} className="text-app-border" />
                    <p className="text-sm font-medium text-app-text">Select a page to preview</p>
                    <p className="text-xs text-app-subtle">Add pages in the Architecture section first.</p>
                  </div>
                )}
              </div>
            </>
          )}
          {(subTab === 'sections' ||
            (subTab as string) === 'components') && (
            <div id="preview-subpanel-sections" role="tabpanel" aria-labelledby="preview-subtab-sections" className="flex min-h-0 flex-1">
              <SectionsSection />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function PanelTabBtn({
  id,
  controls,
  label,
  Icon,
  active,
  onClick,
}: {
  id: string
  controls: string
  label: string
  Icon: React.FC<{ size?: number; className?: string }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      id={id}
      role="tab"
      aria-controls={controls}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      style={{
        height: PREMIUM_SPACE.controlSize + 8,
        fontSize: '11px',
        fontWeight: PREMIUM_TYPE.rowWeight,
        transitionDuration: PREMIUM_MOTION.durationFast,
        transitionTimingFunction: PREMIUM_MOTION.easingStandard,
      }}
      className={cn(
        'flex-1 flex items-center justify-center gap-1 rounded-app-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
        active ? 'bg-app-surface text-app-text border border-app-border' : 'text-app-subtle hover:text-app-muted hover:bg-app-elevated/40',
      )}
    >
      <Icon size={PREMIUM_ICON.control} className={active ? 'text-app-accent' : ''} />
      {label}
    </button>
  )
}
