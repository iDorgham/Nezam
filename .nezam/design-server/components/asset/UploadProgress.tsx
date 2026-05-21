// F-008 §3.3 / AC-006 — Per-file progress row. Pure render: parent owns the
// fetch lifecycle and supplies (name, percent, onCancel). Cancel is hidden at
// completion since there's nothing left to abort.

interface UploadProgressProps {
  name:     string
  /** 0..100. Out-of-range values are clamped. */
  percent:  number
  onCancel: () => void
}

const clamp = (n: number) => Math.max(0, Math.min(100, n))

export default function UploadProgress({ name, percent, onCancel }: UploadProgressProps) {
  const clamped  = clamp(percent)
  const rounded  = Math.round(clamped)
  const complete = clamped >= 100

  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded-ds-sm bg-ds-surface-elevated border border-ds-border"
    >
      <span className="flex-1 truncate text-ds-xs text-ds-text-primary" title={name}>
        {name}
      </span>

      <div className="flex-[2] h-1.5 rounded-full bg-ds-surface overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={rounded}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Uploading ${name}`}
          className="h-full bg-ds-primary transition-[width] duration-150"
          style={{ width: `${clamped}%` }}
        />
      </div>

      <span className="text-[10px] font-mono text-ds-text-muted tabular-nums w-9 text-end">
        {rounded}%
      </span>

      {!complete && (
        <button
          type="button"
          aria-label="Cancel upload"
          onClick={onCancel}
          className="text-ds-xs text-ds-text-muted hover:text-ds-destructive focus:outline-none focus:ring-2 focus:ring-ds-border-focus rounded-ds-sm px-1"
        >
          ✕
        </button>
      )}
    </div>
  )
}
