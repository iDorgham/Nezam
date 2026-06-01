'use client'

import { useRef } from 'react'
import { X, Download } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'
import {
  EXPORT_FORMATS,
  generateExportContent,
  type ExportFormatId,
} from '@/lib/export-formats'

function downloadFile(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ExportPanel() {
  const open = useHub((s) => s.exportPanelOpen)
  const setOpen = useHub((s) => s.setExportPanelOpen)
  const tokens = useHub((s) => s.design.tokens)
  const pages = useHub((s) => s.arch.pages)
  const overlayRef = useRef<HTMLDivElement>(null)

  if (!open) return null

  function handleExport(id: ExportFormatId) {
    const spec = EXPORT_FORMATS.find((f) => f.id === id)
    if (!spec) return
    const content = generateExportContent(id, pages, tokens)
    const mime = spec.extension === 'json' ? 'application/json' : 'text/plain'
    downloadFile(`nezam-export.${spec.extension}`, content, mime)
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) setOpen(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-panel-title"
    >
      <div className="relative w-full max-w-2xl rounded-app-lg border border-app-border bg-app-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-app-border px-5 py-4">
          <div>
            <h2 id="export-panel-title" className="text-sm font-bold text-app-text">
              Export design artifacts
            </h2>
            <p className="text-[11px] text-app-subtle mt-0.5">
              Download tokens, routes, and gate configs in your preferred format.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-app-sm p-1.5 text-app-subtle hover:bg-app-elevated hover:text-app-text"
            aria-label="Close export panel"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 max-h-[60vh] overflow-y-auto app-scroll">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format.id}
              type="button"
              onClick={() => handleExport(format.id)}
              className={cn(
                'flex flex-col items-start gap-1 rounded-app-sm border border-app-border bg-app-elevated/40',
                'px-3 py-2.5 text-left transition-colors hover:border-app-accent/50 hover:bg-app-elevated',
              )}
            >
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-app-text">
                <Download size={12} className="text-app-accent shrink-0" />
                {format.label}
              </span>
              <span className="text-[10px] text-app-subtle leading-snug">{format.description}</span>
              <span className="text-[9px] font-mono text-app-muted uppercase">.{format.extension}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
