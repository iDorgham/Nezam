'use client'

import type { GenerativeMode } from '@/src/store/canvas-graph.store'

// SPEC-DS-CANVAS-001 §8.1 — Generate state machine.
// idle | validating | compressing | generating | done | error.
// canGenerate gates the click; mode drives the visual state.

interface GenerateButtonProps {
  canGenerate:  boolean
  mode:         GenerativeMode
  onClick:      () => void
  disabledHint?: string
  errorMessage?: string
  label?:       string
}

const BUSY_MODES: ReadonlySet<GenerativeMode> = new Set(['validating', 'compressing', 'generating'])

const BUSY_LABEL: Partial<Record<GenerativeMode, string>> = {
  validating:  'Validating…',
  compressing: 'Compressing context…',
  generating:  'Generating…',
}

export default function GenerateButton({
  canGenerate,
  mode,
  onClick,
  disabledHint = 'Add an attachment or directive to enable',
  errorMessage,
  label = 'Generate target',
}: GenerateButtonProps) {
  const isBusy = BUSY_MODES.has(mode)
  const isDone = mode === 'done'
  const isError = mode === 'error'
  const disabled = !canGenerate || isBusy

  const buttonLabel =
    isBusy ? (BUSY_LABEL[mode] ?? 'Generating…') :
    isDone ? 'Generated ✓' :
    isError ? 'Retry generation' :
    label

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={isBusy}
        data-state={mode}
        className={`w-full px-3 py-2 rounded-ds-sm text-ds-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:cursor-not-allowed ${
          isError
            ? 'bg-ds-destructive text-ds-destructive-foreground hover:bg-ds-destructive/90 disabled:bg-ds-interactive disabled:text-ds-text-disabled'
            : isDone
            ? 'bg-ds-success text-ds-success-foreground hover:bg-ds-success/90 disabled:bg-ds-interactive disabled:text-ds-text-disabled'
            : 'bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary-hover disabled:bg-ds-interactive disabled:text-ds-text-disabled'
        }`}
      >
        {isBusy && (
          <span
            aria-hidden="true"
            className="inline-block w-3 h-3 me-2 rounded-full border-2 border-current border-t-transparent align-middle animate-spin motion-reduce:animate-none"
          />
        )}
        {buttonLabel}
      </button>

      {!canGenerate && !isBusy && !isError && (
        <p className="text-[10px] text-ds-text-muted text-center">{disabledHint}</p>
      )}

      {isError && errorMessage && (
        <p
          role="alert"
          className="text-[10px] text-ds-destructive text-center"
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}
