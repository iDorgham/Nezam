'use client'

import type { HardlockResult } from '@/src/lib/hardlock-check'

// F-007 §4 / AC-003 — Inline blocked-input message paired with an offending
// CSS field. Always renders the suggestion (the logical-property name the
// user *should* type instead) so the fix is one click away.

interface HardlockErrorProps {
  result:      HardlockResult
  /** Optional click handler — pass a setter for the field this error decorates. */
  onUseSuggestion?: (suggestion: string) => void
}

export default function HardlockError({ result, onUseSuggestion }: HardlockErrorProps) {
  if (result.ok) return null

  return (
    <div
      role="alert"
      data-hardlock-code={result.code}
      className="mt-1 flex items-start gap-1.5 text-[10px] text-ds-destructive"
    >
      <span aria-hidden="true" className="font-bold leading-none">⚠</span>
      <span className="flex-1">
        <span className="block">{result.message}</span>
        {onUseSuggestion && (
          <button
            type="button"
            onClick={() => onUseSuggestion(result.suggestion)}
            className="mt-0.5 underline decoration-dotted underline-offset-2 hover:text-ds-destructive/80 focus:outline-none focus:ring-2 focus:ring-ds-border-focus rounded-ds-sm font-mono"
          >
            Use {result.suggestion}
          </button>
        )}
        {!onUseSuggestion && (
          <span className="font-mono">Try: {result.suggestion}</span>
        )}
      </span>
    </div>
  )
}
