/**
 * Context compression / overflow handling (T-Q-008).
 *
 * Bounds an assembled context string to a character budget while preserving
 * required "anchor" lines. Pure and deterministic so AI-context assembly never
 * exceeds the cap. Guarantees:
 *   - output length <= maxChars  (never exceeds the cap)
 *   - output length <= input length  (never grows the input)
 *   - anchors present in the input are retained when they fit the budget
 */

export interface CompressOptions {
  /** Maximum number of characters allowed in the output. */
  maxChars: number
  /** Substrings that must survive compression when space permits. */
  anchors?: string[]
}

export interface CompressResult {
  text: string
  truncated: boolean
  originalLength: number
}

const ELLIPSIS = '\n…\n'

/**
 * Compress `input` to fit `opts.maxChars`. Passes through unchanged when within
 * budget. When over budget, keeps any matching anchors plus a head slice of the
 * remaining body, joined by an ellipsis marker, clamped to the cap.
 */
export function compressContext(input: string, opts: CompressOptions): CompressResult {
  const originalLength = input.length
  const maxChars = Math.max(0, Math.floor(opts.maxChars))

  // Passthrough: already within budget.
  if (originalLength <= maxChars) {
    return { text: input, truncated: false, originalLength }
  }

  if (maxChars === 0) {
    return { text: '', truncated: true, originalLength }
  }

  // Retain anchors that actually appear in the input, in declared order,
  // de-duplicated, only while they fit the budget.
  const retained: string[] = []
  let used = 0
  for (const anchor of opts.anchors ?? []) {
    if (!anchor || retained.includes(anchor)) continue
    if (!input.includes(anchor)) continue
    const cost = anchor.length + 1 // +1 for the joining newline
    if (used + cost > maxChars) continue
    retained.push(anchor)
    used += cost
  }

  const anchorBlock = retained.length ? retained.join('\n') + '\n' : ''
  const remaining = maxChars - anchorBlock.length
  let body = ''
  if (remaining > ELLIPSIS.length) {
    body = input.slice(0, remaining - ELLIPSIS.length) + ELLIPSIS
  } else if (remaining > 0) {
    body = input.slice(0, remaining)
  }

  // Final clamp guarantees the cap invariant regardless of rounding above.
  const text = (anchorBlock + body).slice(0, maxChars)
  return { text, truncated: true, originalLength }
}
