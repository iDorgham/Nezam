'use client'

import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useHub } from '@/store/hub.store'
import { getPaletteByCategory, type WireframeBlockDescriptor } from '@/lib/wireframe/blockRegistry'
import { buildSeedPageSections } from '@/lib/wireframe/seed-page-session'
import { buildArchToLockMap, getEligibleArchPages, toLockPageId } from '@/lib/wireframe/arch-page-map'
import { WireframePageTree } from './WireframePageTree'
import { WireframeBlockSlot } from './WireframeBlockSlot'
import { WireframeBlockPreview } from './WireframeBlockPreview'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type PageSessionSection = {
  section_id: string
  block_type: string
  order: number
  approved: boolean
  locked_props?: Record<string, unknown>
  flexible_props?: Record<string, unknown>
  content_slots?: Record<string, unknown>
  states?: Record<string, unknown>
  [key: string]: unknown
}

type PageSession = {
  arch_page_id?: string
  lock_page_id?: string
  layout_approved?: boolean
  sections?: PageSessionSection[]
}

type SavedSessionSummary = {
  hasSavedSession: boolean
  sectionsCount: number
  layoutApproved: boolean
}

function InlineNotice({
  tone,
  children,
}: {
  tone: 'error' | 'success' | 'info'
  children: ReactNode
}) {
  const classes =
    tone === 'error'
      ? 'border-app-danger/30 bg-app-danger/10 text-app-danger'
      : tone === 'success'
        ? 'border-app-success/30 bg-app-success/10 text-app-success'
        : 'border-app-border bg-app-bg text-app-subtle'

  return (
    <div
      className={cn('mt-4 rounded-app-sm border px-3 py-2 text-[10.5px]', classes)}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {children}
    </div>
  )
}

export function WireframesSection() {
  const archPages = useHub((s) => s.arch.pages)
  const archProfileId = useHub((s) => s.arch.activeProfileId)

  const eligiblePages = useMemo(() => getEligibleArchPages(archPages), [archPages])
  const archToLockMap = useMemo(() => buildArchToLockMap(eligiblePages), [eligiblePages])

  const wireframePages = useMemo(
    () =>
      eligiblePages.map((p, idx) => ({
        lockId: toLockPageId(idx),
        page: p,
      })),
    [eligiblePages],
  )

  const lockIdByArchId = useMemo(() => {
    const map: Record<string, string> = {}
    for (const { page, lockId } of wireframePages) {
      map[page.id] = lockId
    }
    return map
  }, [wireframePages])

  const [selectedArchPageId, setSelectedArchPageId] = useState<string | null>(null)
  const [sections, setSections] = useState<PageSessionSection[]>([])
  const [loadingSession, setLoadingSession] = useState(false)
  const [saveBusy, setSaveBusy] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [savedSessions, setSavedSessions] = useState<Record<string, SavedSessionSummary>>({})
  const [lastLoadedSignature, setLastLoadedSignature] = useState<string>('[]')
  const [paletteSearch, setPaletteSearch] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  useEffect(() => {
    if (wireframePages.length === 0) return
    setSelectedArchPageId((prev) =>
      prev && wireframePages.some((wp) => wp.page.id === prev) ? prev : wireframePages[0].page.id,
    )
  }, [wireframePages])

  useEffect(() => {
    async function indexSavedSessions() {
      const entries = await Promise.all(
        wireframePages.map(async ({ page }) => {
          try {
            const res = await fetch(`/api/pages/${encodeURIComponent(page.id)}`)
            const data = await res.json().catch(() => ({}))
            const nextSections = Array.isArray(data?.session?.sections) ? data.session.sections : []
            return [
              page.id,
              {
                hasSavedSession: !!data?.session,
                sectionsCount: nextSections.length,
                layoutApproved:
                  typeof data?.session?.layout_approved === 'boolean'
                    ? data.session.layout_approved
                    : nextSections.length > 0 &&
                      nextSections.every((s: PageSessionSection) => s.approved),
              } satisfies SavedSessionSummary,
            ] as const
          } catch {
            return [
              page.id,
              { hasSavedSession: false, sectionsCount: 0, layoutApproved: false } satisfies SavedSessionSummary,
            ] as const
          }
        }),
      )
      setSavedSessions(Object.fromEntries(entries))
    }

    if (wireframePages.length === 0) {
      setSavedSessions({})
      return
    }
    void indexSavedSessions()
  }, [wireframePages])

  useEffect(() => {
    async function loadSession(archPageId: string) {
      setLoadingSession(true)
      setSessionError(null)
      setSaveSuccess(null)
      try {
        const selected = wireframePages.find((wp) => wp.page.id === archPageId)
        const res = await fetch(`/api/pages/${encodeURIComponent(archPageId)}`)
        const data = await res.json().catch(() => ({}))
        const loadedSections = Array.isArray(data?.session?.sections) ? data.session.sections : []
        const nextSections =
          loadedSections.length > 0
            ? loadedSections
            : selected
              ? buildSeedPageSections({ page: selected.page, profileId: archProfileId })
              : []

        setSections(nextSections)
        setLastLoadedSignature(JSON.stringify(loadedSections))
        if (loadedSections.length === 0 && nextSections.length > 0) {
          setSaveSuccess('Template seeded for this architecture page. Click Save session to persist.')
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load page session.'
        setSessionError(message)
        setSections([])
        setLastLoadedSignature('[]')
      } finally {
        setLoadingSession(false)
      }
    }

    if (!selectedArchPageId) return
    void loadSession(selectedArchPageId)
  }, [selectedArchPageId, wireframePages, archProfileId])

  const palette = useMemo(() => getPaletteByCategory(archProfileId), [archProfileId])

  const filteredPalette = useMemo(() => {
    const q = paletteSearch.trim().toLowerCase()
    if (!q) return palette
    return palette
      .map((cat) => ({
        ...cat,
        blocks: cat.blocks.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.type.toLowerCase().includes(q) ||
            (b.description?.toLowerCase().includes(q) ?? false),
        ),
      }))
      .filter((cat) => cat.blocks.length > 0)
  }, [palette, paletteSearch])

  function addBlock(block: WireframeBlockDescriptor) {
    setSessionError(null)
    setSaveSuccess(null)

    const next: PageSessionSection = {
      section_id: crypto.randomUUID(),
      block_type: block.type,
      order: sections.length,
      approved: true,
      locked_props: {},
      flexible_props: {},
      content_slots: {},
      states: {},
    }

    setSections((prev) => [...prev, next])
  }

  function removeSection(sectionId: string) {
    setSessionError(null)
    setSaveSuccess(null)
    setSections((prev) => {
      const next = prev.filter((s) => s.section_id !== sectionId)
      return next.map((s, idx) => ({ ...s, order: idx }))
    })
  }

  function toggleApproved(sectionId: string, nextApproved: boolean) {
    setSessionError(null)
    setSaveSuccess(null)
    setSections((prev) =>
      prev.map((s) => (s.section_id === sectionId ? { ...s, approved: nextApproved } : s)),
    )
  }

  function handleDragEnd(e: DragEndEvent) {
    const activeId = String(e.active.id)
    const overId = e.over?.id ? String(e.over.id) : null
    if (!overId || activeId === overId) return

    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.section_id === activeId)
      const newIndex = prev.findIndex((s) => s.section_id === overId)
      if (oldIndex < 0 || newIndex < 0) return prev
      return arrayMove(prev, oldIndex, newIndex).map((s, idx) => ({ ...s, order: idx }))
    })
  }

  async function saveSession() {
    if (!selectedArchPageId) return
    setSaveBusy(true)
    setSessionError(null)
    setSaveSuccess(null)
    try {
      const lockPageId = archToLockMap[selectedArchPageId] ?? null
      const payload: PageSession = {
        arch_page_id: selectedArchPageId,
        lock_page_id: lockPageId ?? undefined,
        layout_approved: sections.length > 0 && sections.every((s) => s.approved),
        sections,
      }

      const res = await fetch(`/api/pages/${encodeURIComponent(selectedArchPageId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setSessionError(data?.error ? String(data.error) : 'Save failed.')
        return
      }

      setSaveSuccess('Saved session to .session/pages/. Lock & export can now validate this page.')
      const signature = JSON.stringify(sections)
      setLastLoadedSignature(signature)
      setSavedSessions((prev) => ({
        ...prev,
        [selectedArchPageId]: {
          hasSavedSession: true,
          sectionsCount: sections.length,
          layoutApproved: sections.length > 0 && sections.every((s) => s.approved),
        },
      }))
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unexpected save error.'
      setSessionError(message)
    } finally {
      setSaveBusy(false)
    }
  }

  const selectedRow = useMemo(() => {
    if (!selectedArchPageId) return null
    return wireframePages.find((wp) => wp.page.id === selectedArchPageId) ?? null
  }, [selectedArchPageId, wireframePages])

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(sections) !== lastLoadedSignature,
    [sections, lastLoadedSignature],
  )

  function getPageStatus(archPageId: string): 'empty' | 'draft' | 'ready' {
    if (selectedArchPageId === archPageId && hasUnsavedChanges) return 'draft'
    const summary = savedSessions[archPageId]
    if (!summary || !summary.hasSavedSession || summary.sectionsCount === 0) return 'empty'
    return summary.layoutApproved ? 'ready' : 'draft'
  }

  const selectedPageStatus = selectedArchPageId ? getPageStatus(selectedArchPageId) : 'empty'

  function getStatusPillClasses(status: 'empty' | 'draft' | 'ready') {
    if (status === 'ready') {
      return 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-500/40'
    }
    if (status === 'draft') {
      return 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 dark:border-amber-500/40'
    }
    return 'bg-app-bg text-app-subtle border-app-border'
  }

  function getSavedCount(archPageId: string): number {
    if (selectedArchPageId === archPageId) return sections.length
    return savedSessions[archPageId]?.sectionsCount ?? 0
  }

  function resetToTemplate() {
    if (!selectedRow) return
    setSessionError(null)
    setSaveSuccess(null)
    const seeded = buildSeedPageSections({ page: selectedRow.page, profileId: archProfileId })
    setSections(seeded)
  }

  function statusLabel(status: 'empty' | 'draft' | 'ready') {
    if (status === 'ready') return 'Ready'
    if (status === 'draft') return 'Draft'
    return 'Empty'
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="w-80 shrink-0 border-r border-app-border bg-app-surface flex flex-col min-h-0 overflow-hidden p-4">
        <WireframePageTree
          pages={archPages}
          selectedArchPageId={selectedArchPageId}
          lockIdByArchId={lockIdByArchId}
          onSelect={setSelectedArchPageId}
          getPageStatus={getPageStatus}
          getStatusPillClasses={getStatusPillClasses}
          getSavedCount={getSavedCount}
          title="Wireframe pages"
        />
      </div>

      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-sm font-bold text-app-text">
                  Blocks for {selectedRow ? selectedRow.page.name : '—'}
                </div>
                {selectedArchPageId ? (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                      getStatusPillClasses(selectedPageStatus),
                    )}
                  >
                    {statusLabel(selectedPageStatus)}
                  </span>
                ) : null}
              </div>
              <div className="text-[10px] text-app-subtle mt-1">
                Drag to reorder illustrated blocks. Save this page session before locking.
              </div>
              {selectedRow ? (
                <div className="text-[10px] text-app-subtle mt-1 font-mono">
                  {selectedRow.page.route} · {selectedRow.lockId}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetToTemplate}
                disabled={loadingSession || !selectedArchPageId}
                className={cn(
                  'h-8 px-3 rounded-app-sm border transition-colors select-none',
                  loadingSession || !selectedArchPageId
                    ? 'border-app-border bg-app-bg text-app-muted cursor-not-allowed'
                    : 'border-app-border bg-app-bg text-app-text hover:bg-app-elevated',
                )}
              >
                Reset to template
              </button>
              <button
                type="button"
                onClick={saveSession}
                disabled={saveBusy || loadingSession || !selectedArchPageId}
                className={cn(
                  'h-8 px-4 rounded-app-sm border transition-colors select-none',
                  saveBusy || loadingSession || !selectedArchPageId
                    ? 'border-app-border bg-app-bg text-app-muted cursor-not-allowed'
                    : 'border-transparent bg-app-accent text-app-on-accent hover:bg-app-accent-hover',
                )}
              >
                {saveBusy ? 'Saving…' : 'Save session'}
              </button>
            </div>
          </div>

          {loadingSession ? <InlineNotice tone="info">Loading session…</InlineNotice> : null}
          {sessionError ? <InlineNotice tone="error">{sessionError}</InlineNotice> : null}
          {saveSuccess ? <InlineNotice tone="success">{saveSuccess}</InlineNotice> : null}

          <div className="mt-4 max-w-4xl mx-auto wf-page-frame px-6 py-7">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext
                items={sections.map((s) => s.section_id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3">
                  {sections.length === 0 ? (
                    <div className="relative z-[1] rounded-app-md border border-app-border bg-app-surface px-4 py-5 text-center">
                      <p className="text-[11px] font-medium text-app-text">No blocks on this page yet</p>
                      <p className="text-[10px] text-app-subtle mt-1 max-w-sm mx-auto">
                        Pick blocks from the palette on the right, or use Reset to template. Save session before lock
                        and export.
                      </p>
                    </div>
                  ) : null}

                  {sections.map((section) => (
                    <WireframeBlockSlot
                      key={section.section_id}
                      section={section}
                      onRemove={removeSection}
                      onToggleApproved={toggleApproved}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      <div className="w-96 shrink-0 border-l border-app-border bg-app-surface overflow-auto p-4 flex flex-col min-h-0">
        <div className="text-sm font-bold text-app-text">Block palette</div>
        <div className="text-[10px] text-app-subtle mt-1">
          Click a block to add it to the selected page. Filtered for your profile canvas mode.
        </div>

        <div className="mt-3">
          <Input
            placeholder="Search blocks…"
            value={paletteSearch}
            onChange={(e) => setPaletteSearch(e.target.value)}
            className="h-8 text-xs"
            aria-label="Search block palette"
          />
        </div>

        <div className="mt-4 flex flex-col gap-4 flex-1 min-h-0">
          {filteredPalette.length === 0 ? (
            <p className="text-[10px] text-app-subtle">No blocks match your search.</p>
          ) : null}
          {filteredPalette.map((cat, catIndex) => (
            <div key={cat.category}>
              {catIndex > 0 ? <Separator className="mb-4 bg-app-border" /> : null}
              <Badge variant="muted" className="uppercase tracking-wide text-[9px]">
                {cat.category}
              </Badge>
              <div className="mt-2 flex flex-col gap-2">
                {cat.blocks.map((block) => (
                  <button
                    key={block.type}
                    type="button"
                    onClick={() => addBlock(block)}
                    className="text-left rounded-app-md border border-app-border bg-app-bg p-2 min-h-[108px] hover:bg-app-elevated hover:border-app-accent/30 transition-colors select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                    title={block.description ?? block.type}
                  >
                    <WireframeBlockPreview blockType={block.type} compact showCaption={false} />
                    <div className="mt-2 px-0.5">
                      <div className="text-[11px] font-semibold text-app-text truncate">{block.name}</div>
                      <div className="text-[9.5px] text-app-subtle/90 font-mono truncate">{block.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
