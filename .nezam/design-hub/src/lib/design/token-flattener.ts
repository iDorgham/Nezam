import type { DesignTokens, TokenCategory } from '@/types/design'
import { TOKEN_CATEGORY_LABELS } from '@/types/design'

const VALID_CATEGORIES = new Set(Object.keys(TOKEN_CATEGORY_LABELS))

/** Map a flattened token path to a navigable token category (first segment). */
export function pathToTokenCategory(path: string): TokenCategory | null {
  const first = path.split('.')[0]
  if (VALID_CATEGORIES.has(first)) {
    return first as TokenCategory
  }
  return null
}

export interface FlatToken {
  key: string
  path: string
  category: string
  value: string
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix: string,
  category: string,
  out: FlatToken[],
) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (isPlainObject(value)) {
      flattenObject(value, path, category, out)
    } else if (value !== undefined && value !== null) {
      out.push({
        key: path,
        path,
        category,
        value: String(value),
      })
    }
  }
}

/** Flatten design tokens into searchable rows with category labels. */
export function flattenTokens(tokens: DesignTokens): FlatToken[] {
  const out: FlatToken[] = []
  flattenObject(tokens.colors as unknown as Record<string, unknown>, 'colors', 'Colors', out)
  flattenObject(
    tokens.typography as unknown as Record<string, unknown>,
    'typography',
    'Typography',
    out,
  )
  flattenObject(tokens.spacing as unknown as Record<string, unknown>, 'spacing', 'Spacing', out)
  flattenObject(tokens.radius as unknown as Record<string, unknown>, 'radius', 'Radius', out)
  flattenObject(tokens.borders as unknown as Record<string, unknown>, 'borders', 'Borders', out)
  flattenObject(tokens.shadows as unknown as Record<string, unknown>, 'shadows', 'Shadows', out)
  flattenObject(tokens.motion as unknown as Record<string, unknown>, 'motion', 'Motion', out)
  return out
}

export interface TokenDiffEntry {
  key: string
  category: string
  before: string | null
  after: string | null
}

export interface TokenDiff {
  changed: TokenDiffEntry[]
  added: TokenDiffEntry[]
  removed: TokenDiffEntry[]
}

function indexFlat(flat: FlatToken[]): Map<string, FlatToken> {
  return new Map(flat.map((t) => [t.path, t]))
}

/** Diff two token snapshots for profile apply / compare flows. */
export function diffFlatTokens(before: FlatToken[], after: FlatToken[]): TokenDiff {
  const beforeMap = indexFlat(before)
  const afterMap = indexFlat(after)
  const changed: TokenDiffEntry[] = []
  const added: TokenDiffEntry[] = []
  const removed: TokenDiffEntry[] = []

  for (const [path, token] of afterMap) {
    const prev = beforeMap.get(path)
    if (!prev) {
      added.push({ key: path, category: token.category, before: null, after: token.value })
    } else if (prev.value !== token.value) {
      changed.push({
        key: path,
        category: token.category,
        before: prev.value,
        after: token.value,
      })
    }
  }

  for (const [path, token] of beforeMap) {
    if (!afterMap.has(path)) {
      removed.push({ key: path, category: token.category, before: token.value, after: null })
    }
  }

  return { changed, added, removed }
}
