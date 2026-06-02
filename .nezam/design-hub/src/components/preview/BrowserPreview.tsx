'use client'

import { Monitor, Tablet, Smartphone, Lock, RotateCw, ArrowLeft, ArrowRight, Sparkles, X, Download } from 'lucide-react'
import { memo, useState, useMemo, useEffect } from 'react'
import { useHub, type CommentPin, type PreviewDevice } from '@/store/hub.store'
import { PageRenderer } from './DeviceFrame'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'
import {
  buildSeedPageSections,
  type SeedPageSessionSection,
} from '@/lib/wireframe/seed-page-session'
import {
  getCachedPreviewSession,
  loadPreviewSession,
  type PreviewSessionSource,
} from '@/lib/preview/preview-session-cache'
import { isSidebarShellLayout } from '@/lib/wireframe/sidebar-shell-layout'

const DEVICE_WIDTH: Record<PreviewDevice, number | null> = {
  desktop: null,
  tablet: 768,
  mobile: 390,
}

const DEVICE_ICONS: Record<PreviewDevice, React.FC<{ size?: number; className?: string }>> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
}

const EMPTY_COMMENTS: CommentPin[] = []

function usePageStableKey(page: ArchPage) {
  return useMemo(
    () =>
      [
        page.id,
        page.route,
        page.name,
        page.layout ?? '',
        page.type,
        page.layoutWidth ?? '',
      ].join('|'),
    [
      page.id,
      page.route,
      page.name,
      page.layout,
      page.type,
      page.layoutWidth,
    ],
  )
}

const PreviewViewport = memo(function PreviewViewport({
  page,
  wireframeSections,
  device,
  previewRtl,
  pageComments,
  isAddingComment,
  addComment,
  setIsAdding,
}: {
  page: ArchPage
  wireframeSections: SeedPageSessionSection[]
  device: PreviewDevice
  previewRtl: boolean
  pageComments: CommentPin[]
  isAddingComment: boolean
  addComment: (pageId: string, x: number, y: number, text: string, author: string) => void
  setIsAdding: (isAdding: boolean) => void
}) {
  const tokens = useHub((s) => s.design.tokens)
  const targetWidth = DEVICE_WIDTH[device]
  const sidebarShellPreview = device === 'desktop' && isSidebarShellLayout(wireframeSections)

  const renderer = (
    <div
      dir={previewRtl ? 'rtl' : 'ltr'}
      className={cn(
        sidebarShellPreview && 'flex h-full min-h-0 flex-1 flex-col overflow-hidden',
      )}
    >
      <PageRenderer
        page={page}
        tokens={tokens}
        device={device}
        wireframeSections={wireframeSections}
        fillViewport={sidebarShellPreview}
      />
    </div>
  )

  return (
    <div
      className={cn(
        'flex-1 min-h-0',
        sidebarShellPreview ? 'flex flex-col overflow-hidden' : 'overflow-auto app-scroll',
      )}
      style={device !== 'desktop' ? { background: 'var(--app-deep)' } : undefined}
    >
      {device === 'desktop' ? (
        <div
          className={cn(
            'w-full',
            sidebarShellPreview ? 'flex h-full min-h-0 flex-1 flex-col' : 'min-h-full',
          )}
        >
          <CommentCanvasOverlay
            pageId={page.id}
            pageComments={pageComments}
            isAddingComment={isAddingComment}
            addComment={addComment}
            setIsAdding={setIsAdding}
            fillViewport={sidebarShellPreview}
          >
            {renderer}
          </CommentCanvasOverlay>
        </div>
      ) : (
        <div className="mx-auto my-6" style={{ width: targetWidth ?? '100%' }}>
          <div
            className="overflow-hidden bg-app-surface"
            style={{
              width: targetWidth ?? '100%',
              borderRadius: device === 'mobile' ? 24 : 12,
              border: '1px solid var(--app-border)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
            }}
          >
            <CommentCanvasOverlay
              pageId={page.id}
              pageComments={pageComments}
              isAddingComment={isAddingComment}
              addComment={addComment}
              setIsAdding={setIsAdding}
            >
              {renderer}
            </CommentCanvasOverlay>
          </div>
        </div>
      )}
    </div>
  )
})

/**
 * Browser-window preview chrome. Replaces the old standalone device toolbar.
 */
export function BrowserPreview({ page }: { page: ArchPage }) {
  const device = useHub((s) => s.preview.device)
  const setDevice = useHub((s) => s.previewSetDevice)
  const previewRtl = useHub((s) => s.preview.rtl)
  const setPreviewRtl = useHub((s) => s.previewSetRtl)
  const override = useHub((s) => s.theme.previewOverride)
  const clearOverride = useHub((s) => s.themeClearPreview)
  const comments = useHub((s) => s.preview.comments) || EMPTY_COMMENTS
  const isAddingComment = useHub((s) => s.preview.isAddingComment)
  const addComment = useHub((s) => s.previewAddComment)
  const setIsAdding = useHub((s) => s.previewSetIsAddingComment)
  const archProfileId = useHub((s) => s.arch.activeProfileId)

  const pageStableKey = usePageStableKey(page)

  const pageComments = useMemo(
    () => comments.filter((c) => c.pageId === page.id),
    [comments, page.id],
  )

  const seededSections = useMemo(
    () =>
      buildSeedPageSections({
        page,
        profileId: archProfileId,
      }),
    [pageStableKey, archProfileId, page],
  )

  const cachedEntry = getCachedPreviewSession(page.id, archProfileId)
  const [wireframeSections, setWireframeSections] = useState<SeedPageSessionSection[]>(
    () => cachedEntry?.sections ?? seededSections,
  )
  const [sessionSource, setSessionSource] = useState<PreviewSessionSource>(
    () => (cachedEntry ? cachedEntry.source : 'seeded'),
  )

  useEffect(() => {
    const cached = getCachedPreviewSession(page.id, archProfileId)
    if (cached) {
      setWireframeSections(cached.sections)
      setSessionSource(cached.source)
      return
    }

    setWireframeSections(seededSections)
    setSessionSource('seeded')

    const controller = new AbortController()
    void loadPreviewSession(page.id, archProfileId, seededSections, controller.signal)
      .then((entry) => {
        if (controller.signal.aborted) return
        setWireframeSections(entry.sections)
        setSessionSource(entry.source)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setWireframeSections(seededSections)
        setSessionSource('seeded')
      })

    return () => {
      controller.abort()
    }
  }, [page.id, pageStableKey, archProfileId, seededSections])

  const targetWidth = DEVICE_WIDTH[device]
  const url = displayUrl(page)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-app-deep">
      <div className="shrink-0 flex flex-col bg-app-surface border-b border-app-border">
        <div className="flex items-center gap-2 h-9 px-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          </div>

          <div className="ml-3 flex items-center gap-1.5 h-6 max-w-[260px] px-2.5 rounded-t-md bg-app-bg border-t border-l border-r border-app-border">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--app-accent)' }} />
            <span className="text-[10.5px] text-app-text truncate">{page.name}</span>
          </div>

          {override && (
            <div
              className="flex items-center gap-1 ml-3 px-2 h-5 rounded-full text-[10px] font-medium"
              style={{
                background: 'var(--app-accent)',
                color: 'var(--app-on-accent)',
                opacity: 0.9,
              }}
            >
              <Sparkles size={9} />
              <span>{override.presetName}</span>
              <button onClick={clearOverride} className="ml-0.5 opacity-70 hover:opacity-100" title="Remove theme">
                <X size={9} />
              </button>
            </div>
          )}

          <div data-spotlight="preview-device-switcher" className="ml-auto flex items-center gap-0.5 p-0.5 rounded-app-sm bg-app-elevated border border-app-border">
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => {
              const Icon = DEVICE_ICONS[d]
              const active = device === d
              return (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  title={d}
                  className={cn(
                    'flex items-center justify-center h-5 w-7 rounded text-[10px] transition-colors duration-100',
                    active ? 'bg-app-surface text-app-text' : 'text-app-subtle hover:text-app-text',
                  )}
                >
                  <Icon size={11} />
                </button>
              )
            })}

            <button
              onClick={() => setPreviewRtl(!previewRtl)}
              title={previewRtl ? 'Switch preview to LTR' : 'Switch preview to RTL'}
              className={cn(
                'flex items-center justify-center h-5 w-10 rounded text-[10px] transition-colors duration-100',
                previewRtl ? 'bg-app-surface text-app-text' : 'text-app-subtle hover:text-app-text',
              )}
            >
              {previewRtl ? 'RTL' : 'LTR'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 h-9 px-3 border-t border-app-border bg-app-bg">
          <button
            className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated transition-colors"
            title="Back"
          >
            <ArrowLeft size={12} />
          </button>
          <button
            className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated transition-colors"
            title="Forward"
          >
            <ArrowRight size={12} />
          </button>
          <button
            className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated transition-colors"
            title="Reload"
          >
            <RotateCw size={11} />
          </button>

          <div className="flex items-center gap-1.5 flex-1 h-6 px-2.5 mx-1 rounded-full bg-app-elevated border border-app-border">
            <Lock size={10} className="text-app-subtle shrink-0" />
            <span className="text-[10.5px] text-app-muted font-mono truncate">{url}</span>
          </div>

          <span className="text-[10px] font-mono text-app-subtle px-1.5 select-none">
            {device === 'desktop' ? 'fluid' : `${targetWidth}px`}
          </span>
          <span
            className={cn(
              'text-[9px] rounded-full px-1.5 py-0.5 border',
              sessionSource === 'saved'
                ? 'text-app-success border-app-success/40 bg-app-success/10'
                : 'text-app-warning border-app-warning/40 bg-app-warning/10',
            )}
            role="status"
            aria-live="polite"
          >
            {sessionSource === 'saved' ? 'saved session' : 'seeded'}
          </span>
          <button
            type="button"
            data-spotlight="preview-export-btn"
            title="Export handoff ZIP"
            className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated hover:text-app-text transition-colors"
          >
            <Download size={11} />
          </button>
        </div>
      </div>

      <PreviewViewport
        page={page}
        wireframeSections={wireframeSections}
        device={device}
        previewRtl={previewRtl}
        pageComments={pageComments}
        isAddingComment={isAddingComment}
        addComment={addComment}
        setIsAdding={setIsAdding}
      />
    </div>
  )
}

function displayUrl(page: ArchPage): string {
  const route = page.route?.trim() || '/'
  const cleaned = route.startsWith('/') ? route : `/${route}`
  return `https://acme.dev${cleaned}`
}

function CommentCanvasOverlay({
  pageId,
  pageComments,
  isAddingComment,
  addComment,
  setIsAdding,
  fillViewport,
  children,
}: {
  pageId: string
  pageComments: CommentPin[]
  isAddingComment: boolean
  addComment: (pageId: string, x: number, y: number, text: string, author: string) => void
  setIsAdding: (isAdding: boolean) => void
  /** Constrain to preview viewport height so nested overflow-y-auto regions can scroll. */
  fillViewport?: boolean
  children: React.ReactNode
}) {
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null)
  const [authorName, setAuthorName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [activePinId, setActivePinId] = useState<string | null>(null)

  function handleCanvasClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!isAddingComment) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPendingPin({ x, y })
    setCommentText('')
  }

  function handleSave() {
    if (!pendingPin || !commentText.trim()) return
    addComment(pageId, pendingPin.x, pendingPin.y, commentText, authorName || 'Guest Reviewer')
    setPendingPin(null)
    setCommentText('')
  }

  return (
    <div
      className={cn(
        'relative w-full',
        fillViewport
          ? 'flex h-full min-h-0 flex-1 flex-col overflow-hidden'
          : 'min-h-full',
        isAddingComment ? 'cursor-crosshair' : '',
      )}
      onClick={handleCanvasClick}
    >
      {children}

      {isAddingComment && <div className="absolute inset-0 bg-transparent z-40" />}

      {pageComments.map((pin, index) => {
        const isActive = activePinId === pin.id
        return (
          <div
            key={pin.id}
            className="absolute z-50 group"
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActivePinId(isActive ? null : pin.id)
              }}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold shadow-lg transition-transform active:scale-95 duration-150 ring-2 ring-white',
                isActive
                  ? 'bg-amber-500 scale-110 shadow-amber-500/50'
                  : 'bg-app-accent hover:scale-105 shadow-black/40',
              )}
            >
              {index + 1}
            </button>

            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 bottom-8 w-48 p-2.5 rounded-app-md bg-app-surface/90 backdrop-blur-md border border-app-border/80 shadow-2xl flex flex-col gap-1 select-text pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200',
                isActive
                  ? 'opacity-100 pointer-events-auto scale-100 animate-in fade-in zoom-in-95 duration-100'
                  : 'opacity-0 scale-95 origin-bottom',
              )}
            >
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-[10px] font-bold text-app-text truncate">{pin.author}</span>
                <span className="text-[8px] text-app-subtle font-mono">
                  {new Date(pin.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[9.5px] text-app-muted leading-relaxed whitespace-pre-wrap">{pin.text}</p>
            </div>
          </div>
        )
      })}

      {pendingPin && (
        <div
          className="absolute z-50 p-3 rounded-app-md bg-app-surface/95 backdrop-blur-md border border-app-border/80 shadow-2xl flex flex-col gap-2.5 w-60 animate-in zoom-in-95 duration-150 select-text"
          style={{
            left: `${pendingPin.x}%`,
            top: `${pendingPin.y}%`,
            transform: pendingPin.y > 60 ? 'translate(-50%, -105%)' : 'translate(-50%, 15px)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-black text-[10px] font-bold">
              {pageComments.length + 1}
            </span>
            <span className="text-[10.5px] font-bold text-app-text">Add Feedback Pin</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              placeholder="Your name (e.g. Reviewer)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full h-6 rounded border border-app-border bg-app-inset px-2 text-[10.5px] font-medium text-app-text focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent/30 placeholder-app-subtle"
            />
            <textarea
              placeholder="Write a comment..."
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full rounded border border-app-border bg-app-inset p-2 text-[10.5px] font-medium text-app-text focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent/30 placeholder-app-subtle resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setPendingPin(null)
                setIsAdding(false)
              }}
              className="flex-1 rounded border border-app-border bg-app-elevated px-2 py-1 text-[10px] font-medium text-app-muted hover:text-app-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!commentText.trim()}
              className={cn(
                'flex-1 rounded px-2 py-1 text-[10px] font-bold transition-all duration-100',
                commentText.trim()
                  ? 'bg-app-accent text-white hover:bg-app-accent-hover'
                  : 'bg-app-elevated border border-app-border text-app-subtle cursor-not-allowed',
              )}
            >
              Save Pin
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
