import { NextResponse } from 'next/server'
import { readdir, stat, readFile } from 'fs/promises'
import { join } from 'path'
import { getDesignProfilesDir } from '@/lib/paths'
import { parseProfile, profileToTokens } from '@/lib/parsers/profile.parser'
import type { DesignPreset, DesignTokens } from '@/src/types/tokens.types'

const SKIP = new Set(['catalog.json', 'README.md'])

async function loadCatalogSlugs(dir: string): Promise<Set<string>> {
  try {
    const raw = await readFile(join(dir, 'catalog.json'), 'utf-8')
    const catalog = JSON.parse(raw)
    const slugs = new Set<string>()
    if (Array.isArray(catalog.providers)) {
      catalog.providers.forEach((p: { provider: string }) => slugs.add(p.provider))
    }
    return slugs
  } catch {
    return new Set()
  }
}

function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Maps the complex profileToTokens() output to the flat DesignTokens shape.
// Undefined values are omitted so the client merges cleanly with defaults.
function mapToDesignTokens(rawTokens: ReturnType<typeof profileToTokens>): Partial<DesignTokens> {
  const c = rawTokens.colors ?? {}
  const r = rawTokens.radius ?? {}

  const entries: [keyof DesignTokens, string | undefined][] = [
    ['primary',           c.primary],
    ['primaryHover',      c.primaryHover],
    ['primarySubtle',     c.primarySubtle],
    ['primaryForeground', c.textInverse],
    ['secondary',         c.secondary],
    ['accent',            c.accent],
    ['background',        c.background],
    ['surface',           c.surface],
    ['surfaceElevated',   c.surfaceElevated],
    ['surfaceHover',      c.surfaceHover],
    ['surfaceSubtle',     c.surfaceSubtle],
    ['overlay',           c.overlay],
    ['textPrimary',       c.textPrimary],
    ['textSecondary',     c.textSecondary],
    ['textMuted',         c.textMuted],
    ['textDisabled',      c.textDisabled],
    ['textInverse',       c.textInverse],
    ['border',            c.border],
    ['borderStrong',      c.borderStrong],
    ['borderSubtle',      c.borderSubtle],
    ['borderHover',       c.borderHover],
    ['borderFocus',       c.borderFocus],
    ['borderMuted',       c.borderMuted],
    ['interactive',       c.interactive],
    ['destructive',       c.destructive],
    ['success',           c.success],
    ['warning',           c.warning],
    ['error',             c.destructive],
    ['info',              c.info],
    ['radiusNone',        r.none],
    ['radiusSm',          r.sm],
    ['radiusMd',          r.md],
    ['radiusLg',          r.lg],
    ['radiusXl',          r.xl],
    ['radius2xl',         r['2xl']],
    ['radiusFull',        r.full],
  ]

  return Object.fromEntries(
    entries.filter(([, v]) => v !== undefined && v !== '')
  ) as Partial<DesignTokens>
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase()
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '40', 10), 100)
  const systemOnly = searchParams.get('system') === 'true'
  const userOnly = searchParams.get('user') === 'true'

  const dir = getDesignProfilesDir()
  const catalogSlugs = await loadCatalogSlugs(dir)

  let entries: string[] = []
  try {
    entries = await readdir(dir)
  } catch {
    return NextResponse.json([])
  }

  const candidates = entries.filter((slug) => {
    if (SKIP.has(slug)) return false
    const isSystem = catalogSlugs.has(slug)
    if (systemOnly && !isSystem) return false
    if (userOnly && isSystem) return false
    if (query) {
      const nameMatch = slugToName(slug).toLowerCase().includes(query)
      const slugMatch = slug.includes(query)
      if (!nameMatch && !slugMatch) return false
    }
    return true
  })

  // User-synced presets first, then system presets (alphabetical within each group)
  const userSlugs = candidates.filter((s) => !catalogSlugs.has(s)).sort()
  const systemSlugs = candidates.filter((s) => catalogSlugs.has(s)).sort()
  const ordered = [...userSlugs, ...systemSlugs].slice(0, limit)

  const results = await Promise.all(
    ordered.map(async (slug): Promise<DesignPreset | null> => {
      const mdPath = join(dir, slug, 'design.md')
      try {
        const s = await stat(mdPath)
        if (!s.isFile()) return null

        const content = await readFile(mdPath, 'utf-8')
        const parsed = parseProfile(slug, content)
        const rawTokens = profileToTokens(parsed)
        const tokens = mapToDesignTokens(rawTokens)
        const now = new Date().toISOString()

        return {
          id: `${catalogSlugs.has(slug) ? 'system' : 'user'}-${slug}`,
          name: slugToName(slug),
          slug,
          isSystem: catalogSlugs.has(slug),
          tokens,
          createdAt: s.birthtime?.toISOString() ?? now,
          updatedAt: s.mtime.toISOString(),
        }
      } catch {
        return null
      }
    })
  )

  const presets = results.filter((p): p is DesignPreset => p !== null)
  return NextResponse.json(presets)
}
