'use client'

import { Monitor, Tablet, Smartphone, Lock, RotateCw, ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useHub, type CommentPin, type PreviewDevice } from '@/store/hub.store'
import { PageRenderer } from './DeviceFrame'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'
import { buildSeedPageSections } from '@/lib/wireframe/seed-page-session'

const DEVICE_WIDTH: Record<PreviewDevice, number | null> = {
  desktop: null,   // null = fill container at 100%
  tablet:  768,
  mobile:  390,
}

const DEVICE_ICONS: Record<PreviewDevice, React.FC<{ size?: number; className?: string }>> = {
  desktop: Monitor,
  tablet:  Tablet,
  mobile:  Smartphone,
}

const EMPTY_COMMENTS: CommentPin[] = []

type WireframeSession = {
  sections?: Array<{ section_id?: string; block_type?: string; order?: number }>
}

function extractWireframeSections(session: WireframeSession | null): WireframeSession['sections'] {
  const sections = session?.sections ?? []
  if (!sections.length) return undefined
  return [...sections].sort((a, b) => {
    const ao = Number(a.order ?? 0)
    const bo = Number(b.order ?? 0)
    return ao - bo
  })
}

/**
 * Browser-window preview chrome. Replaces the old standalone device toolbar.
 * - Desktop: page renders at natural 1:1 scale, fills the entire canvas area.
 *   The browser window IS the viewport (Chrome-style traffic lights + URL bar).
 * - Tablet/Mobile: page renders inside a centered fixed-width frame (768 / 390),
 *   wrapped in the same browser chrome so the device switcher stays reachable.
 */
export function BrowserPreview({ page }: { page: ArchPage }) {
  const tokens         = useHub((s) => s.design.tokens)
  const device         = useHub((s) => s.preview.device)
  const setDevice      = useHub((s) => s.previewSetDevice)
  const previewRtl     = useHub((s) => s.preview.rtl)
  const setPreviewRtl  = useHub((s) => s.previewSetRtl)
  const override       = useHub((s) => s.theme.previewOverride)
  const clearOverride  = useHub((s) => s.themeClearPreview)

  const comments        = useHub((s) => s.preview.comments) || EMPTY_COMMENTS
  const isAddingComment = useHub((s) => s.preview.isAddingComment)
  const addComment      = useHub((s) => s.previewAddComment)
  const setIsAdding     = useHub((s) => s.previewSetIsAddingComment)
  const activeProfileId = useHub((s) => s.arch.activeProfileId)

  const pageComments = useMemo(() => {
    return comments.filter((c) => c.pageId === page.id)
  }, [comments, page.id])
  const [wireframeSections, setWireframeSections] = useState<WireframeSession['sections']>()
  const [sessionSource, setSessionSource] = useState<'loading' | 'saved' | 'seeded'>('loading')

  useEffect(() => {
    const controller = new AbortController()
    async function loadSession() {
      setSessionSource('loading')
      try {
        const res = await fetch(`/api/pages/${encodeURIComponent(page.id)}`, {
          signal: controller.signal,
        })
        const data = await res.json().catch(() => ({}))
        const loaded = extractWireframeSections(data?.session ?? null)
        if (loaded && loaded.length > 0) {
          setWireframeSections(loaded)
          setSessionSource('saved')
          return
        }

        // Fallback for unsaved pages: still render from seeded wireframe blocks
        // so preview reflects sitemap presets immediately.
        const seeded = buildSeedPageSections({
          page,
          profileId: activeProfileId,
        })
        setWireframeSections(seeded)
        setSessionSource('seeded')
      } catch {
        if (controller.signal.aborted) return
        const seeded = buildSeedPageSections({
          page,
          profileId: activeProfileId,
        })
        setWireframeSections(seeded)
        setSessionSource('seeded')
      }
    }
    void loadSession()
    return () => {
      controller.abort()
    }
  }, [page, activeProfileId])

  // overrideStyle is no longer needed on the parent — PageRenderer merges
  // override vars directly into its wrapStyle as the final layer.
  // We keep `override` only to show the theme badge and the clear button.

  const targetWidth = DEVICE_WIDTH[device]
  const url = displayUrl(page)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-app-deep">
      {/* ── Browser chrome ─────────────────────────────────────────────── */}
      <div className="shrink-0 flex flex-col bg-app-surface border-b border-app-border">
        {/* Title bar — traffic lights + tab + device switcher */}
        <div className="flex items-center gap-2 h-9 px-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          </div>

          {/* Tab */}
          <div className="ml-3 flex items-center gap-1.5 h-6 max-w-[260px] px-2.5 rounded-t-md bg-app-bg border-t border-l border-r border-app-border">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--app-accent)' }} />
            <span className="text-[10.5px] text-app-text truncate">{page.name}</span>
          </div>

          {/* Theme override badge */}
          {override && (
            <div className="flex items-center gap-1 ml-3 px-2 h-5 rounded-full text-[10px] font-medium"
              style={{ background: 'var(--app-accent)', color: 'var(--app-on-accent)', opacity: 0.9 }}>
              <Sparkles size={9} />
              <span>{override.presetName}</span>
              <button onClick={clearOverride} className="ml-0.5 opacity-70 hover:opacity-100" title="Remove theme">
                <X size={9} />
              </button>
            </div>
          )}

          {/* Device switcher — embedded in title bar so the chrome IS the toolbar */}
          <div className="ml-auto flex items-center gap-0.5 p-0.5 rounded-app-sm bg-app-elevated border border-app-border">
            {(['desktop','tablet','mobile'] as const).map((d) => {
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

            {/* RTL/LTR toggle (affects preview + drives lock payload) */}
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

        {/* Address bar */}
        <div className="flex items-center gap-1 h-9 px-3 border-t border-app-border bg-app-bg">
          <button className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated transition-colors" title="Back">
            <ArrowLeft size={12} />
          </button>
          <button className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated transition-colors" title="Forward">
            <ArrowRight size={12} />
          </button>
          <button className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated transition-colors" title="Reload">
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
                : sessionSource === 'loading'
                  ? 'text-app-subtle border-app-border bg-app-elevated'
                  : 'text-app-warning border-app-warning/40 bg-app-warning/10',
            )}
            role="status"
            aria-live="polite"
          >
            {sessionSource === 'saved' ? 'saved session' : sessionSource === 'loading' ? 'loading' : 'seeded'}
          </span>
        </div>
      </div>

      {/* ── Render area = browser viewport ────────────────────────────── */}
      <div
        className="flex-1 min-h-0 overflow-auto app-scroll"
        style={{
          ...(device !== 'desktop' ? { background: 'var(--app-deep)' } : undefined),
        }}
      >
        {device === 'desktop' ? (
          // Full-bleed: page fills 100% of the viewport — min-h-full so short pages still cover
          <div className="min-h-full w-full">
            <CommentCanvasOverlay
              pageId={page.id}
              pageComments={pageComments}
              isAddingComment={isAddingComment}
              addComment={addComment}
              setIsAdding={setIsAdding}
            >
              <div dir={previewRtl ? 'rtl' : 'ltr'}>
                <PageRenderer
                  page={page}
                  tokens={tokens}
                  device="desktop"
                  wireframeSections={wireframeSections ?? undefined}
                />
              </div>
            </CommentCanvasOverlay>
          </div>
        ) : (
          // Centered, fixed-width device viewport — page renders at 1:1 inside
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
                  <div dir={previewRtl ? 'rtl' : 'ltr'}>
                    <PageRenderer
                      page={page}
                      tokens={tokens}
                      device={device}
                      wireframeSections={wireframeSections ?? undefined}
                    />
                  </div>
              </CommentCanvasOverlay>
            </div>
          </div>
        )}
      </div>
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
  children,
}: {
  pageId: string
  pageComments: any[]
  isAddingComment: boolean
  addComment: (pageId: string, x: number, y: number, text: string, author: string) => void
  setIsAdding: (isAdding: boolean) => void
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
      className={cn("relative min-h-full w-full", isAddingComment ? "cursor-crosshair" : "")}
      onClick={handleCanvasClick}
    >
      {/* RENDER VIEWPORT CONTENT */}
      {children}

      {/* CLICK INTERCEPTOR OVERLAY */}
      {isAddingComment && (
        <div className="absolute inset-0 bg-transparent z-40" />
      )}

      {/* RENDER PINS */}
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
            {/* Circle badge with pulsing shadow */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActivePinId(isActive ? null : pin.id)
              }}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold shadow-lg transition-transform active:scale-95 duration-150 ring-2 ring-white",
                isActive
                  ? "bg-amber-500 scale-110 shadow-amber-500/50"
                  : "bg-app-accent hover:scale-105 shadow-black/40"
              )}
            >
              {index + 1}
            </button>

            {/* Premium Glassmorphic Tooltip */}
            <div className={cn(
              "absolute left-1/2 -translate-x-1/2 bottom-8 w-48 p-2.5 rounded-app-md bg-app-surface/90 backdrop-blur-md border border-app-border/80 shadow-2xl flex flex-col gap-1 select-text pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200",
              isActive ? "opacity-100 pointer-events-auto scale-100 animate-in fade-in zoom-in-95 duration-100" : "opacity-0 scale-95 origin-bottom"
            )}>
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-[10px] font-bold text-app-text truncate">{pin.author}</span>
                <span className="text-[8px] text-app-subtle font-mono">{new Date(pin.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-[9.5px] text-app-muted leading-relaxed whitespace-pre-wrap">{pin.text}</p>
            </div>
          </div>
        )
      })}

      {/* FLOATING COMMENT DIALOG MODAL ON CANVAS */}
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
                "flex-1 rounded px-2 py-1 text-[10px] font-bold transition-all duration-100",
                commentText.trim()
                  ? "bg-app-accent text-white hover:bg-app-accent-hover"
                  : "bg-app-elevated border border-app-border text-app-subtle cursor-not-allowed"
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
