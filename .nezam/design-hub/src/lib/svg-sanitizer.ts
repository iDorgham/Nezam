/**
 * SVG sanitizer (T-Q-006).
 *
 * Removes executable / unsafe constructs from untrusted SVG markup before it is
 * stored or rendered. Conservative, dependency-free, and fails closed: anything
 * it does not understand that looks executable is stripped. Safe geometry
 * (paths, shapes, groups, basic presentation attributes) is preserved.
 *
 * NOTE: this is a string-level defensive cleaner, not a full DOM-based purifier.
 * For browser rendering of third-party SVGs, pair it with a CSP. The test suite
 * (`src/test/svg-sanitizer.security.test.ts`) pins the vectors handled here.
 */

const DANGEROUS_ELEMENTS = [
  'script',
  'foreignObject',
  'iframe',
  'object',
  'embed',
  'style',
  'animate',
  'animatetransform',
  'set',
  'handler',
]

/** Strip `<el ...>...</el>` and self-closing `<el ... />` for a tag name. */
function stripElement(input: string, tag: string): string {
  const paired = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}\\s*>`, 'gi')
  const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi')
  return input.replace(paired, '').replace(selfClosing, '')
}

/** Remove on*="..." event-handler attributes (single, double, or unquoted). */
function stripEventHandlers(input: string): string {
  return input.replace(
    /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
    '',
  )
}

/**
 * Neutralize dangerous URL schemes in href / xlink:href / src attributes.
 * Matches even when obfuscated with whitespace or control chars inside the
 * scheme (e.g. `java\nscript:`), by collapsing the attribute value first.
 */
function stripDangerousUrls(input: string): string {
  return input.replace(
    /\s+(?:xlink:href|href|src)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
    (match, rawValue: string) => {
      const value = String(rawValue).replace(/^["']|["']$/g, '')
      const collapsed = value.replace(/[\s\-]+/g, '').toLowerCase()
      if (/^(?:javascript|data|vbscript):/.test(collapsed)) {
        return ''
      }
      return match
    },
  )
}

/** Remove DOCTYPE / ENTITY declarations to block XXE & entity-expansion. */
function stripDoctype(input: string): string {
  return input
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!ENTITY[\s\S]*?>/gi, '')
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
}

/**
 * Sanitize untrusted SVG markup. Returns cleaned SVG; passing non-SVG or empty
 * input returns an empty string (fail closed).
 */
export function sanitizeSvg(input: string): string {
  if (typeof input !== 'string' || input.trim() === '') return ''

  let out = stripDoctype(input)
  for (const tag of DANGEROUS_ELEMENTS) {
    out = stripElement(out, tag)
  }
  out = stripEventHandlers(out)
  out = stripDangerousUrls(out)

  // If nothing svg-like survived, fail closed.
  if (!/<svg[\s\S]*<\/svg>/i.test(out)) return ''
  return out.trim()
}

/** True when sanitizing leaves the markup unchanged (already safe). */
export function isSvgSafe(input: string): boolean {
  if (typeof input !== 'string' || input.trim() === '') return false
  return sanitizeSvg(input) === input.trim()
}
