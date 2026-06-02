'use client'

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useHub } from '@/store/hub.store'
import { DESIGN_PROFILES_MAP } from '@/data/design-profiles'
import { useDesignPreviewScopeStyle } from '@/lib/use-design-preview-scope'
import {
  countPaletteBlocks,
  formatPaletteCategoryLabel,
  getPaletteByCategory,
  type WireframeBlockDescriptor,
} from '@/lib/wireframe/blockRegistry'
import { inferCanvasMode } from '@/lib/wireframe/canvas-mode'
import { PaletteCategorySection } from './PaletteCategorySection'
import { buildSeedPageSections } from '@/lib/wireframe/seed-page-session'
import { isSidebarShellLayout, splitSidebarShellSections } from '@/lib/wireframe/sidebar-shell-layout'
import { buildArchToLockMap, getEligibleArchPages, toLockPageId } from '@/lib/wireframe/arch-page-map'
import { WireframePageTree } from './WireframePageTree'
import { WireframeBlockSlot } from './WireframeBlockSlot'
import { Input } from '@/components/ui/input'
import { LeftPanelSearchRow, LeftPanelTitleRow } from '@/components/ui/LeftPanelHeader'
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
      className={cn('rounded-app-sm border px-3 py-2 text-[11px] leading-snug', classes)}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {children}
    </div>
  )
}

export function WireframesSection() {
  const section = useHub((s) => s.section)
  const archSelectedPageId = useHub((s) => s.arch.selectedPageId)
  const archPages = useHub((s) => s.arch.pages)
  const archProfileId = useHub((s) => s.arch.activeProfileId)
  const designProfileId = useHub((s) => s.design.activeProfileId)
  const hubTheme = useHub((s) => s.hubTheme)
  const pagePreviewScopeStyle = useDesignPreviewScopeStyle({ fillHeight: true, matchHubChrome: true })
  const wireframeCanvasStyle = useMemo(
    () => ({
      ...pagePreviewScopeStyle,
      backgroundColor: hubTheme === 'dark' ? '#0C0D0F' : '#F4F5F7',
    }),
    [pagePreviewScopeStyle, hubTheme],
  )

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
  const [showAllCanvasModes, setShowAllCanvasModes] = useState(false)
  const [paletteCategoryFilter, setPaletteCategoryFilter] = useState<string>('all')
  const [collapsedPaletteCategories, setCollapsedPaletteCategories] = useState<Record<string, boolean>>(
    {},
  )

  const wireframePagesRef = useRef(wireframePages)
  wireframePagesRef.current = wireframePages

  const archPageIdsKey = useMemo(
    () => wireframePages.map((wp) => wp.page.id).join('|'),
    [wireframePages],
  )

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
    if (section !== 'wireframes') return
    if (!archSelectedPageId) return
    if (!wireframePages.some((wp) => wp.page.id === archSelectedPageId)) return
    setSelectedArchPageId(archSelectedPageId)
  }, [section, archSelectedPageId, wireframePages])

  useEffect(() => {
    if (archPageIdsKey.length === 0) {
      setSavedSessions({})
      return
    }

    let cancelled = false
    const pages = wireframePagesRef.current

    async function indexSavedSessions() {
      const entries = await Promise.all(
        pages.map(async ({ page }) => {
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
      if (!cancelled) {
        setSavedSessions(Object.fromEntries(entries))
      }
    }

    const run = () => {
      if (!cancelled) void indexSavedSessions()
    }

    const idleHandle =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(run, { timeout: 2500 })
        : window.setTimeout(run, 16)

    return () => {
      cancelled = true
      if (typeof requestIdleCallback !== 'undefined') {
        cancelIdleCallback(idleHandle as number)
      } else {
        clearTimeout(idleHandle as number)
      }
    }
  }, [archPageIdsKey])

  useEffect(() => {
    async function loadSession(archPageId: string) {
      setLoadingSession(true)
      setSessionError(null)
      setSaveSuccess(null)
      try {
        const selected = wireframePagesRef.current.find((wp) => wp.page.id === archPageId)
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
  }, [selectedArchPageId, archProfileId])

  const palette = useMemo(
    () => getPaletteByCategory(archProfileId, { includeAllModes: showAllCanvasModes }),
    [archProfileId, showAllCanvasModes],
  )

  const paletteBlockCount = useMemo(
    () => countPaletteBlocks(archProfileId, { includeAllModes: showAllCanvasModes }),
    [archProfileId, showAllCanvasModes],
  )

  const canvasModeLabel = inferCanvasMode(archProfileId)

  const sidebarCanvasLayout = useMemo(() => isSidebarShellLayout(sections), [sections])
  const sidebarCanvasSplit = useMemo(() => splitSidebarShellSections(sections), [sections])

  const filteredPalette = useMemo(() => {
    const q = paletteSearch.trim().toLowerCase()
    let next = palette
    if (q) {
      next = palette
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
    }
    if (paletteCategoryFilter === 'all') return next
    return next.filter((cat) => cat.category === paletteCategoryFilter)
  }, [palette, paletteSearch, paletteCategoryFilter])

  const visiblePaletteBlockCount = useMemo(
    () => filteredPalette.reduce((sum, cat) => sum + cat.blocks.length, 0),
    [filteredPalette],
  )

  const paletteCategoryFilters = useMemo(() => {
    const withBlocks = palette.filter((cat) => cat.blocks.length > 0)
    return [{ id: 'all', label: 'All', count: paletteBlockCount }, ...withBlocks.map((cat) => ({
      id: cat.category,
      label: formatPaletteCategoryLabel(cat.category),
      count: cat.blocks.length,
    }))]
  }, [palette, paletteBlockCount])

  const togglePaletteCategory = useCallback((category: string) => {
    setCollapsedPaletteCategories((prev) => {
      if (prev[category] === true) {
        const next = { ...prev }
        delete next[category]
        return next
      }
      return { ...prev, [category]: true }
    })
  }, [])

  const addBlock = useCallback((block: WireframeBlockDescriptor) => {
    setSessionError(null)
    setSaveSuccess(null)

    const next: PageSessionSection = {
      section_id: crypto.randomUUID(),
      block_type: block.type,
      order: 0,
      approved: true,
      locked_props: {},
      flexible_props: {},
      content_slots: {},
      states: {},
    }

    setSections((prev) => [...prev, { ...next, order: prev.length }])
  }, [])

  const removeSection = useCallback((sectionId: string) => {
    setSessionError(null)
    setSaveSuccess(null)
    setSections((prev) => {
      const next = prev.filter((s) => s.section_id !== sectionId)
      return next.map((s, idx) => ({ ...s, order: idx }))
    })
  }, [])

  const toggleApproved = useCallback((sectionId: string, nextApproved: boolean) => {
    setSessionError(null)
    setSaveSuccess(null)
    setSections((prev) =>
      prev.map((s) => (s.section_id === sectionId ? { ...s, approved: nextApproved } : s)),
    )
  }, [])

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

  const activeDesignProfile = designProfileId ? DESIGN_PROFILES_MAP[designProfileId] : null

  const profileLabel = activeDesignProfile ? (
    <span className="font-medium text-app-text">
      {activeDesignProfile.emoji} {activeDesignProfile.name}
    </span>
  ) : (
    <span className="font-medium text-app-text">design profile</span>
  )

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <aside className="flex w-72 shrink-0 flex-col overflow-hidden border-r border-app-border bg-app-surface">
        <WireframePageTree
          bleed={false}
          pages={archPages}
          selectedArchPageId={selectedArchPageId}
          lockIdByArchId={lockIdByArchId}
          onSelect={setSelectedArchPageId}
          getPageStatus={getPageStatus}
          getStatusPillClasses={getStatusPillClasses}
          getSavedCount={getSavedCount}
          title="Wireframe pages"
        />
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-app-bg/40">
        <header className="shrink-0 border-b border-app-border bg-app-surface/90 px-6 py-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold text-app-text">
                  {selectedRow ? selectedRow.page.name : 'Select a page'}
                </h2>
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
              {selectedRow ? (
                <p className="font-mono text-[10px] text-app-subtle">
                  {selectedRow.page.route} · {selectedRow.lockId}
                </p>
              ) : null}
              <p className="max-w-xl text-xs leading-relaxed text-app-subtle">
                Reorder blocks on the canvas. Previews follow {profileLabel}; save before lock and export.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={resetToTemplate}
                disabled={loadingSession || !selectedArchPageId}
                className={cn(
                  'h-8 rounded-app-sm border px-3 text-xs transition-colors select-none',
                  loadingSession || !selectedArchPageId
                    ? 'cursor-not-allowed border-app-border bg-app-bg text-app-muted'
                    : 'border-app-border bg-app-bg text-app-text hover:bg-app-elevated',
                )}
              >
                Reset to template
              </button>
              <button
                type="button"
                data-spotlight="wireframes-lock-btn"
                onClick={saveSession}
                disabled={saveBusy || loadingSession || !selectedArchPageId}
                className={cn(
                  'h-8 rounded-app-sm border px-4 text-xs transition-colors select-none',
                  saveBusy || loadingSession || !selectedArchPageId
                    ? 'cursor-not-allowed border-app-border bg-app-bg text-app-muted'
                    : 'border-transparent bg-app-accent text-app-on-accent hover:bg-app-accent-hover',
                )}
              >
                {saveBusy ? 'Saving…' : 'Save session'}
              </button>
            </div>
          </div>

          {(loadingSession || sessionError || saveSuccess) ? (
            <div className="flex flex-col gap-2 border-t border-app-border/60 pt-3">
              {loadingSession ? <InlineNotice tone="info">Loading session…</InlineNotice> : null}
              {sessionError ? <InlineNotice tone="error">{sessionError}</InlineNotice> : null}
              {saveSuccess ? <InlineNotice tone="success">{saveSuccess}</InlineNotice> : null}
            </div>
          ) : null}
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            className="wf-page-canvas relative z-[1] flex min-h-0 flex-1 flex-col"
            style={wireframeCanvasStyle}
          >
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext
                items={sections.map((s) => s.section_id)}
                strategy={verticalListSortingStrategy}
              >
                {sidebarCanvasLayout && sidebarCanvasSplit.sidebar ? (
                  <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[15rem_1fr]">
                    <div className="flex min-h-0 flex-col overflow-hidden border-b border-app-border px-3 pt-3 pb-3 md:h-full md:border-b-0 md:border-r">
                      <WireframeBlockSlot
                        section={sidebarCanvasSplit.sidebar}
                        onRemove={removeSection}
                        onToggleApproved={toggleApproved}
                        sidebarColumn
                      />
                    </div>
                    <div className="min-h-0 overflow-y-auto overscroll-contain app-scroll px-4 pt-4 pb-6">
                      {sidebarCanvasSplit.main.length === 0 ? (
                        <div className="py-12 text-center">
                          <p className="text-sm font-medium text-app-text">No main blocks yet</p>
                          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-app-subtle">
                            Add blocks from the palette to the main column.
                          </p>
                        </div>
                      ) : (
                        sidebarCanvasSplit.main.map((section) => (
                          <WireframeBlockSlot
                            key={section.section_id}
                            section={section}
                            onRemove={removeSection}
                            onToggleApproved={toggleApproved}
                          />
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain app-scroll px-4 pt-4 pb-6">
                    {sections.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-sm font-medium text-app-text">No blocks yet</p>
                        <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-app-subtle">
                          Add from the palette, or reset to the architecture template, then save the session.
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
                )}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </main>

      <aside className="flex w-96 shrink-0 flex-col overflow-hidden border-l border-app-border bg-app-surface">
        <LeftPanelTitleRow title="Block palette" />
        <div className="shrink-0 space-y-2 border-b border-app-border px-3 py-3">
          <p className="text-[11px] leading-relaxed text-app-subtle">
            Click or drag to add. Previews use {profileLabel}. Showing{' '}
            <span className="font-medium text-app-text">{visiblePaletteBlockCount}</span> of{' '}
            <span className="font-medium text-app-text">{paletteBlockCount}</span> blocks for{' '}
            <span className="font-medium text-app-text">{canvasModeLabel}</span> canvas
            {showAllCanvasModes ? ' (all modes)' : ''}.
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-[11px] text-app-subtle">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-app-border accent-app-accent"
              checked={showAllCanvasModes}
              onChange={(e) => setShowAllCanvasModes(e.target.checked)}
            />
            Show blocks for all canvas modes (mobile, SaaS, web)
          </label>
        </div>
        <LeftPanelSearchRow className="bg-app-surface">
          <Input
            placeholder="Search name, type, or description…"
            value={paletteSearch}
            onChange={(e) => setPaletteSearch(e.target.value)}
            className="h-8 text-xs"
            aria-label="Search block palette"
          />
        </LeftPanelSearchRow>

        <div className="shrink-0 border-b border-app-border px-3 py-2">
          <div className="app-scroll flex gap-2 overflow-x-auto pb-1">
            {paletteCategoryFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setPaletteCategoryFilter(filter.id)}
                className={cn(
                  'shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors',
                  paletteCategoryFilter === filter.id
                    ? 'border-app-accent/50 bg-app-accent/15 text-app-text'
                    : 'border-app-border bg-app-bg text-app-muted hover:bg-app-elevated hover:text-app-text',
                )}
              >
                {filter.label}
                <span className="ml-1 tabular-nums text-app-subtle">({filter.count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="app-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-4">
            {filteredPalette.length === 0 ? (
              <p className="text-xs text-app-subtle">
                No blocks match your search. Try clearing the filter or enabling all canvas modes.
              </p>
            ) : null}
            {filteredPalette.map((cat) => (
              <PaletteCategorySection
                key={cat.category}
                category={cat.category}
                blocks={cat.blocks}
                expanded={collapsedPaletteCategories[cat.category] !== true}
                onToggle={() => togglePaletteCategory(cat.category)}
                onAdd={addBlock}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
