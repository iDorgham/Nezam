// F-007 §4 Hardlock Enforcement — block directional CSS and fixed font-size
// at the *input* level so the value cannot be committed. Pure functions only;
// no React, no DOM, no store. Consumed by PropertyInspector inputs and the
// CSS raw-edit tab.

export type HardlockCode =
  | 'directional-margin'
  | 'directional-padding'
  | 'fixed-font-size'

export type HardlockResult =
  | { ok: true }
  | {
      ok:         false
      code:       HardlockCode
      message:    string
      suggestion: string
    }

const DIRECTIONAL_MARGIN  = /^margin-(left|right|top|bottom)$/i
const DIRECTIONAL_PADDING = /^padding-(left|right|top|bottom)$/i
const FIXED_NUMERIC       = /^\s*\d+(\.\d+)?\s*(px|rem|em)?\s*$/i

const LOGICAL_MARGIN_SUGGESTION  = 'margin-inline-start / margin-inline-end / margin-block-start / margin-block-end'
const LOGICAL_PADDING_SUGGESTION = 'padding-inline-start / padding-inline-end / padding-block-start / padding-block-end'

// Property-name guard. Blocks `margin-left`, `padding-top`, etc. — any time a
// user attempts to commit a non-logical box-model property name, surface a
// hardlock with the inline-equivalent suggestion.
export function checkPropertyName(propertyName: string): HardlockResult {
  if (DIRECTIONAL_MARGIN.test(propertyName)) {
    return {
      ok:         false,
      code:       'directional-margin',
      message:    `Use logical properties: ${LOGICAL_MARGIN_SUGGESTION}`,
      suggestion: 'margin-inline-start',
    }
  }
  if (DIRECTIONAL_PADDING.test(propertyName)) {
    return {
      ok:         false,
      code:       'directional-padding',
      message:    `Use logical properties: ${LOGICAL_PADDING_SUGGESTION}`,
      suggestion: 'padding-inline-start',
    }
  }
  return { ok: true }
}

// Value guard for font-size. Reject bare numbers and fixed px/rem/em; accept
// `clamp(...)`, `var(--...)`, and other dynamic expressions.
export function checkFontSize(value: string): HardlockResult {
  const trimmed = value.trim()
  if (trimmed.length === 0) return { ok: true } // user hasn't typed anything yet
  if (trimmed.startsWith('var('))   return { ok: true }
  if (trimmed.includes('clamp('))   return { ok: true }
  if (FIXED_NUMERIC.test(trimmed)) {
    return {
      ok:         false,
      code:       'fixed-font-size',
      message:    'Use clamp() for fluid type — fixed px/rem/em font-size is blocked.',
      suggestion: 'clamp(1rem, 2vw, 1.25rem)',
    }
  }
  return { ok: true }
}

// Raw CSS line guard. Parses `property: value` shape and runs both checks.
// Used by the CSS-raw tab (T-F007-008's raw editor surface).
export function checkCssDeclaration(line: string): HardlockResult {
  const colonAt = line.indexOf(':')
  if (colonAt < 0) return { ok: true } // not a declaration, ignore
  const property = line.slice(0, colonAt).trim()
  const value    = line.slice(colonAt + 1).replace(/;$/, '').trim()

  const nameResult = checkPropertyName(property)
  if (!nameResult.ok) return nameResult

  if (property.toLowerCase() === 'font-size') {
    return checkFontSize(value)
  }
  return { ok: true }
}
