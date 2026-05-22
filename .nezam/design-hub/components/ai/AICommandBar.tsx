'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Sparkles, Loader2, X } from 'lucide-react'
import { useCanvasGraphStore } from '@/src/store/canvas-graph.store'
import { useSessionStore } from '@/lib/store/session.store'
import type { CanvasNode } from '@/src/store/canvas-graph.store'

type AIBlock = { id: string; type: string; name: string; props: Record<string, unknown> }

function blocksToNodes(
  blocks: AIBlock[],
  viewport: { x: number; y: number; scale: number },
  screenW: number,
  screenH: number,
): CanvasNode[] {
  const centerWorldX = (screenW / 2 - viewport.x) / viewport.scale
  const centerWorldY = (screenH / 2 - viewport.y) / viewport.scale
  const W = 220
  const H = 100
  const GAP = 24

  return blocks.map((b, i) => ({
    id:                 `ai-${b.id}-${Date.now()}`,
    type:               'page' as const,
    title:              b.name,
    route:              `/${b.type.toLowerCase().replace(/_/g, '-')}`,
    x:                  centerWorldX - W / 2,
    y:                  centerWorldY + i * (H + GAP) - (blocks.length * (H + GAP)) / 2,
    width:              W,
    height:             H,
    rtlCompliant:       false,
    wcagCompliant:      false,
    hardlockFailures:   [],
    locked:             false,
    attachments:        [],
    generationStatus:   'idle' as const,
    style:              {},
  }))
}

export default function AICommandBar() {
  const [open,      setOpen]    = useState(false)
  const [prompt,    setPrompt]  = useState('')
  const [streaming, setStreaming] = useState(false)
  const [status,    setStatus]  = useState('')
  const inputRef  = useRef<HTMLInputElement>(null)
  const abortRef  = useRef<AbortController | null>(null)

  const viewport  = useCanvasGraphStore((s) => s.viewport)
  const addNode   = useCanvasGraphStore((s) => s.addNode)
  const lodLevel  = useSessionStore((s) => s.canvasMode)
  const lang      = useSessionStore((s) => s.lang)
  const isRTL     = lang === 'ar'

  // Cmd+K opens; Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
        abortRef.current?.abort()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const handleSubmit = useCallback(async () => {
    const text = prompt.trim()
    if (!text || streaming) return

    abortRef.current = new AbortController()
    setStreaming(true)
    setStatus(isRTL ? 'جارٍ التوليد…' : 'Generating…')

    try {
      const res = await fetch('/api/ai/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ prompt: text, lodLevel }),
        signal:  abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const dec    = new TextDecoder()
      let raw = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        raw += dec.decode(value, { stream: true })
      }

      const json: AIBlock[] = JSON.parse(raw)
      if (!Array.isArray(json) || json.length === 0) throw new Error('Empty result')

      const nodes = blocksToNodes(json, viewport, window.innerWidth, window.innerHeight)
      nodes.forEach((n) => addNode(n))
      setStatus(isRTL ? `تمت إضافة ${nodes.length} عناصر` : `Added ${nodes.length} block${nodes.length !== 1 ? 's' : ''}`)
      setPrompt('')
      setTimeout(() => { setStatus(''); setOpen(false) }, 1500)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setStatus(isRTL ? 'فشل التوليد' : 'Generation failed')
        setTimeout(() => setStatus(''), 2000)
      }
    } finally {
      setStreaming(false)
    }
  }, [prompt, streaming, lodLevel, viewport, addNode, isRTL])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-label={isRTL ? 'شريط أوامر الذكاء الاصطناعي' : 'AI command bar'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
    >
      <div className="rounded-ds-lg border border-ds-border bg-ds-surface shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Sparkles size={15} className="text-ds-primary shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={isRTL ? 'صف الصفحة أو القسم المطلوب توليده…' : 'Describe a page or section to generate…'}
            disabled={streaming}
            className="flex-1 bg-transparent text-ds-sm text-ds-text-primary placeholder:text-ds-text-muted outline-none min-w-0"
          />
          {streaming ? (
            <Loader2 size={15} className="animate-spin text-ds-primary shrink-0" />
          ) : (
            <button
              type="button"
              onClick={() => { setOpen(false); abortRef.current?.abort() }}
              className="text-ds-text-muted hover:text-ds-text-primary transition-colors"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {status && (
          <div className="px-3 py-1.5 border-t border-ds-border bg-ds-background text-ds-xs text-ds-text-muted">
            {status}
          </div>
        )}

        <div className="px-3 py-1.5 border-t border-ds-border bg-ds-background flex items-center justify-between text-ds-xs text-ds-text-muted">
          <span>{isRTL ? 'اضغط Enter للتوليد · Esc للإغلاق' : 'Enter to generate · Esc to close'}</span>
          <span className="capitalize opacity-60">{lodLevel}</span>
        </div>
      </div>
    </div>
  )
}
