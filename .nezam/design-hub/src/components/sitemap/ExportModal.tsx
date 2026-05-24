'use client'

import { useState, useCallback } from 'react'
import { X, Download, Copy, Check, ChevronRight } from 'lucide-react'
import { useSitemapBuilder } from '@/store/sitemap-builder.store'
import {
  EXPORT_OPTIONS, generateExport,
  type ExportFormat,
} from '@/lib/sitemap-export'
import { cn } from '@/lib/cn'

interface ExportModalProps {
  onClose: () => void
}

export function ExportModal({ onClose }: ExportModalProps) {
  const apps     = useSitemapBuilder((s) => s.apps)
  const services = useSitemapBuilder((s) => s.services)

  const [selected, setSelected] = useState<ExportFormat>('json')
  const [copied, setCopied] = useState(false)

  const content = useCallback(
    () => generateExport(selected, apps, services),
    [selected, apps, services],
  )

  const handleDownload = () => {
    const opt   = EXPORT_OPTIONS.find((o) => o.id === selected)!
    const text  = content()
    const blob  = new Blob([text], { type: opt.mime })
    const url   = URL.createObjectURL(blob)
    const a     = document.createElement('a')
    a.href     = url
    a.download = `sitemap-${selected}.${opt.ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const opt = EXPORT_OPTIONS.find((o) => o.id === selected)!

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative flex h-[80vh] w-[900px] max-w-[96vw] overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-app-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="flex w-56 shrink-0 flex-col border-e border-app-border bg-app-inset">
          <div className="flex items-center gap-2 border-b border-app-border px-4 py-3">
            <span className="text-[12px] font-semibold text-app-text">Export</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {EXPORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={cn(
                  'flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors',
                  selected === opt.id
                    ? 'bg-app-accent/10 text-app-accent'
                    : 'text-app-text hover:bg-app-elevated',
                )}
              >
                <span className="flex-1 text-[12px] font-medium">{opt.label}</span>
                {selected === opt.id && <ChevronRight size={12} className="text-app-accent" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-app-border px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-app-text">{opt.label}</div>
              <div className="text-[11px] text-app-subtle">{opt.description}</div>
            </div>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-app-border bg-app-elevated px-2.5 py-1.5 text-[11px] font-medium text-app-text transition-colors hover:border-app-border-strong"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-app-accent px-2.5 py-1.5 text-[11px] font-semibold text-app-on-accent transition-opacity hover:opacity-90"
            >
              <Download size={12} />
              Download .{opt.ext}
            </button>
            <button onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-app-subtle hover:bg-app-elevated hover:text-app-text"
            ><X size={14} /></button>
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-auto bg-app-deep p-4">
            <pre className="min-h-full whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-app-muted">
              {content()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
