'use client'

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import {
  useCanvasGraphStore,
  type AttachmentPayload,
  type WireType,
} from '@/src/store/canvas-graph.store'
import VisionGateBadge from './VisionGateBadge'
import GenerateButton from './GenerateButton'

// SPEC-DS-CANVAS-001 §5 Flow 1 Step 4 — wire type selector + drop zone +
// directive textarea + Generate button. AC-007.
//
// Generate button is enabled when the wire has either ≥1 valid attachment
// OR ≥1 non-empty directive. Vision Gate scanning (T-F005-012) and the
// standalone GenerateButton state machine (T-F005-014) land separately.

const WIRE_TYPES: { value: WireType; label: string; colorVar: string }[] = [
  { value: 'navigational', label: 'Navigation', colorVar: 'var(--dv-wire-navigational)' },
  { value: 'data',         label: 'Data',       colorVar: 'var(--dv-wire-data)' },
  { value: 'auth',         label: 'Auth',       colorVar: 'var(--dv-wire-auth)' },
  { value: 'conditional',  label: 'Conditional', colorVar: 'var(--dv-wire-conditional)' },
]

const ACCEPTED_TYPES = 'image/*,text/markdown,.md,text/plain,application/pdf'

function attachmentTypeFromFile(file: File): AttachmentPayload['type'] {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type === 'application/pdf') return 'pdf'
  if (file.name.endsWith('.md') || file.type === 'text/markdown') return 'markdown'
  return 'text'
}

export default function WireInspector() {
  const selectedWireId = useCanvasGraphStore((s) => s.selectedWireId)
  const wire           = useCanvasGraphStore((s) =>
    s.selectedWireId ? s.wires.find((w) => w.id === s.selectedWireId) ?? null : null
  )

  const updateWire        = useCanvasGraphStore((s) => s.updateWire)
  const attachAsset       = useCanvasGraphStore((s) => s.attachAsset)
  const setSelectedWireId = useCanvasGraphStore((s) => s.setSelectedWireId)
  const triggerGeneration = useCanvasGraphStore((s) => s.triggerGeneration)
  const generativeMode    = useCanvasGraphStore((s) => s.generativeMode)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [directiveDraft, setDirectiveDraft] = useState('')

  const canGenerate = useMemo(() => {
    if (!wire) return false
    const hasValidAttachment = wire.attachments.some((a) => a.visionStatus === 'valid')
    const hasDirective = wire.annotativeDirectives.some((d) => d.trim().length > 0)
    const draftHasContent = directiveDraft.trim().length > 0
    return hasValidAttachment || hasDirective || draftHasContent
  }, [wire, directiveDraft])

  const handleTypeChange = useCallback(
    (type: WireType) => {
      if (!wire) return
      updateWire(wire.id, { type })
    },
    [wire, updateWire],
  )

  const ingestFiles = useCallback(
    (files: FileList | File[]) => {
      if (!wire) return
      Array.from(files).forEach((file) => {
        attachAsset(wire.id, 'wire', {
          id:            crypto.randomUUID(),
          parentId:      wire.id,
          parentType:    'wire',
          type:          attachmentTypeFromFile(file),
          content:       file.name,
          visionStatus:  'pending',
          role:          'style-reference',
          createdAt:     new Date().toISOString(),
        })
      })
    },
    [wire, attachAsset],
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) ingestFiles(e.dataTransfer.files)
    },
    [ingestFiles],
  )

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) ingestFiles(e.target.files)
      e.target.value = ''
    },
    [ingestFiles],
  )

  const handleDirectiveCommit = useCallback(() => {
    if (!wire) return
    const trimmed = directiveDraft.trim()
    if (!trimmed) return
    updateWire(wire.id, {
      annotativeDirectives: [...wire.annotativeDirectives, trimmed],
    })
    setDirectiveDraft('')
  }, [wire, directiveDraft, updateWire])

  const handleRemoveDirective = useCallback(
    (index: number) => {
      if (!wire) return
      updateWire(wire.id, {
        annotativeDirectives: wire.annotativeDirectives.filter((_, i) => i !== index),
      })
    },
    [wire, updateWire],
  )

  const handleGenerate = useCallback(() => {
    if (!wire || !canGenerate) return
    // Persist any uncommitted directive before firing.
    if (directiveDraft.trim().length > 0) handleDirectiveCommit()
    void triggerGeneration(wire.id)
  }, [wire, canGenerate, directiveDraft, handleDirectiveCommit, triggerGeneration])

  if (!selectedWireId || !wire) return null

  return (
    <aside
      role="complementary"
      aria-label="Wire inspector"
      className="absolute top-0 end-0 bottom-0 w-80 max-w-[90vw] z-20 flex flex-col bg-ds-surface border-s border-ds-border shadow-xl"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-ds-border">
        <div className="flex flex-col">
          <span className="text-ds-xs uppercase tracking-wider text-ds-text-muted">
            Wire
          </span>
          <span className="text-ds-sm font-semibold text-ds-text-primary">
            {wire.fromNodeId} → {wire.toNodeId}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSelectedWireId(null)}
          className="text-ds-text-muted hover:text-ds-text-primary text-ds-sm px-2 py-1 rounded-ds-sm hover:bg-ds-surface-hover focus:outline-none focus:ring-2 focus:ring-ds-border-focus"
          aria-label="Close inspector"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        {/* Wire type selector */}
        <section aria-labelledby="wire-type-label">
          <label
            id="wire-type-label"
            className="block text-ds-xs font-medium text-ds-text-secondary mb-2"
          >
            Wire type
          </label>
          <div role="radiogroup" aria-labelledby="wire-type-label" className="grid grid-cols-2 gap-1.5">
            {WIRE_TYPES.map((opt) => {
              const isActive = wire.type === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => handleTypeChange(opt.value)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-ds-sm text-ds-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-ds-border-focus ${
                    isActive
                      ? 'bg-ds-surface-elevated border-ds-border-strong text-ds-text-primary'
                      : 'bg-ds-surface border-ds-border text-ds-text-secondary hover:bg-ds-surface-hover'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: opt.colorVar }}
                  />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* Attachment drop zone */}
        <section aria-labelledby="wire-attachments-label">
          <div className="flex items-center justify-between mb-2">
            <label
              id="wire-attachments-label"
              className="text-ds-xs font-medium text-ds-text-secondary"
            >
              Attachments
            </label>
            <span className="text-ds-xs text-ds-text-muted">{wire.attachments.length}</span>
          </div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            aria-label="Drop attachments or click to upload"
            className={`flex flex-col items-center justify-center gap-1 px-3 py-6 rounded-ds-md border border-dashed cursor-pointer focus:outline-none focus:ring-2 focus:ring-ds-border-focus transition-colors ${
              dragOver
                ? 'border-ds-primary bg-ds-primary-subtle text-ds-primary'
                : 'border-ds-border text-ds-text-muted hover:border-ds-border-strong hover:text-ds-text-secondary'
            }`}
          >
            <span className="text-ds-sm font-medium">Drop files here</span>
            <span className="text-ds-xs">Images, markdown, or text</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES}
              onChange={handleFileSelect}
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          {wire.attachments.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {wire.attachments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-2 px-2 py-1 rounded-ds-sm bg-ds-surface-elevated text-ds-xs"
                >
                  <VisionGateBadge status={a.visionStatus} reason={a.altText} />
                  <span className="flex-1 truncate text-ds-text-secondary">
                    {a.content ?? a.url ?? a.id}
                  </span>
                  <span className="uppercase text-[10px] text-ds-text-muted">{a.type}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Directives */}
        <section aria-labelledby="wire-directive-label">
          <label
            id="wire-directive-label"
            htmlFor="wire-directive-input"
            className="block text-ds-xs font-medium text-ds-text-secondary mb-2"
          >
            Directives
          </label>

          {wire.annotativeDirectives.length > 0 && (
            <ul className="mb-2 flex flex-col gap-1">
              {wire.annotativeDirectives.map((d, i) => (
                <li
                  key={`${i}-${d.slice(0, 12)}`}
                  className="flex items-start gap-2 px-2 py-1.5 rounded-ds-sm bg-ds-surface-elevated text-ds-xs text-ds-text-primary"
                >
                  <span className="flex-1 whitespace-pre-wrap">{d}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDirective(i)}
                    aria-label="Remove directive"
                    className="text-ds-text-muted hover:text-ds-destructive focus:outline-none focus:ring-2 focus:ring-ds-border-focus rounded-ds-sm"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <textarea
            id="wire-directive-input"
            value={directiveDraft}
            onChange={(e) => setDirectiveDraft(e.target.value)}
            onBlur={handleDirectiveCommit}
            placeholder="Describe what should be generated…"
            rows={3}
            className="w-full px-2.5 py-2 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:ring-2 focus:ring-ds-border-focus focus:border-ds-border-focus resize-y"
          />
          <p className="mt-1 text-[10px] text-ds-text-muted">
            Press Tab or blur to add. Multiple directives stack.
          </p>
        </section>
      </div>

      {/* Footer — Generate */}
      <footer className="px-4 py-3 border-t border-ds-border">
        <GenerateButton
          canGenerate={canGenerate}
          mode={generativeMode}
          onClick={handleGenerate}
        />
      </footer>
    </aside>
  )
}
