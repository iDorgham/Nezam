'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, FileJson, FileText, Sparkles, Check, ChevronDown, Copy } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import {
  downloadFile,
  exportDesignMd,
  exportGsapCode,
  exportTokenJSON,
} from '@/lib/export'
import { cn } from '@/lib/cn'

/** Top-bar export dropdown — token JSON, DESIGN.md, and GSAP code. */
export function ExportMenu() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const getProfile = useHub((s) => s.getProfile)
  const theme = useHub((s) => s.theme)
  const timeline = useHub((s) => s.timeline)
  const tokens = useTokens()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const flash = (id: string) => {
    setDone(id)
    setTimeout(() => setDone((d) => (d === id ? null : d)), 1400)
  }

  const profile = getProfile()
  const json = () => exportTokenJSON(profile, tokens, theme)
  const md = () => exportDesignMd(profile, tokens, theme)
  const gsap = () => exportGsapCode(timeline)

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      flash(id)
    } catch {
      /* clipboard unavailable */
    }
  }

  const items: Array<{
    id: string
    icon: typeof FileJson
    label: string
    sub: string
    onCopy: () => void
    onDownload: () => void
  }> = [
    {
      id: 'json',
      icon: FileJson,
      label: 'Token JSON',
      sub: 'tokens.json',
      onCopy: () => copy('json', json()),
      onDownload: () => downloadFile('tokens.json', json(), 'application/json'),
    },
    {
      id: 'md',
      icon: FileText,
      label: 'DESIGN.md',
      sub: 'Design contract',
      onCopy: () => copy('md', md()),
      onDownload: () => downloadFile('DESIGN.md', md(), 'text/markdown'),
    },
    {
      id: 'gsap',
      icon: Sparkles,
      label: 'GSAP timeline',
      sub: 'animation.ts',
      onCopy: () => copy('gsap', gsap()),
      onDownload: () => downloadFile('animation.ts', gsap(), 'text/typescript'),
    },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'focus-ring flex h-8 items-center gap-1.5 rounded-app-sm border px-2.5 text-xs font-medium transition-colors',
          open
            ? 'border-app-border-strong bg-app-elevated text-app-text'
            : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text',
        )}
      >
        <Download size={14} />
        Export
        <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 animate-rise-in rounded-app-lg border border-app-border-strong bg-app-elevated p-1.5 shadow-app-lg">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <div
                key={it.id}
                className="flex items-center gap-2 rounded-app-sm px-2 py-1.5 hover:bg-app-surface"
              >
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-app-sm bg-app-accent-subtle text-app-accent">
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-app-text">{it.label}</div>
                  <div className="truncate text-[10px] text-app-subtle">{it.sub}</div>
                </div>
                <button
                  onClick={it.onCopy}
                  aria-label={`Copy ${it.label}`}
                  className="focus-ring grid h-7 w-7 place-items-center rounded-app-sm text-app-muted hover:bg-app-inset hover:text-app-text"
                >
                  {done === it.id ? <Check size={13} className="text-app-accent" /> : <Copy size={13} />}
                </button>
                <button
                  onClick={it.onDownload}
                  aria-label={`Download ${it.label}`}
                  className="focus-ring grid h-7 w-7 place-items-center rounded-app-sm text-app-muted hover:bg-app-inset hover:text-app-text"
                >
                  <Download size={13} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
