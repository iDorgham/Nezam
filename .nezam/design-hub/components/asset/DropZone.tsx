'use client'

import { useCallback, useRef, useState, type DragEvent } from 'react'

// F-008 §3.3 / AC-005 / AC-006 — Drag-target surface.
// State responsibility ends at: "drag-over visual + emit onFiles". Validation,
// upload, optimistic UI all live in the parent (AssetBrowser).

interface DropZoneProps {
  /** Files dropped onto the zone. Empty drops are filtered out. */
  onFiles:  (files: File[]) => void
  /** Extension allowlist surfaced as UI hint. Not used for runtime filtering. */
  accepts:  ReadonlyArray<string>
  /** Optional caption shown above the extension list. */
  label?:   string
}

export default function DropZone({
  onFiles,
  accepts,
  label = 'Drop assets here',
}: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      setDragOver(false)
      const files = Array.from(e.dataTransfer?.files ?? [])
      if (files.length > 0) onFiles(files)
    },
    [onFiles],
  )

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handlePickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) onFiles(files)
      e.target.value = '' // allow re-picking the same file
    },
    [onFiles],
  )

  return (
    <div
      data-dropzone
      data-drag-over={dragOver}
      role="button"
      tabIndex={0}
      aria-label="Drop or click to upload assets"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPicker()
        }
      }}
      className={`flex flex-col items-center justify-center gap-2 p-6 rounded-ds-sm border-2 border-dashed cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-ds-border-focus ${
        dragOver
          ? 'border-ds-primary bg-ds-primary/5'
          : 'border-ds-border bg-ds-surface-elevated hover:border-ds-border-focus'
      }`}
    >
      <p className="text-ds-sm text-ds-text-secondary">{label}</p>
      <p
        data-accepts
        className="text-[10px] font-mono text-ds-text-muted"
      >
        {accepts.join(' · ')}
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accepts.join(',')}
        onChange={handlePickerChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}
