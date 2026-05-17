import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import {
  getExportDesignPath,
  getExportWireframesPath,
  getPagesSessionDir,
  getPageSessionPath,
} from '@/lib/paths'
import { generateDesignMarkdown } from '@/lib/locking/export-design'
import { injectTokensIntoMainAppGlobals } from '@/lib/locking/write-css-vars'
import type { DesignTokens } from '@/lib/store/tokens.store'
import type { Page } from '@/lib/store/session.store'

type LockBody = {
  tokens: DesignTokens
  sitemap: Page[]
  profileName?: string
  rtl?: boolean
}

function atomicWrite(filePath: string, content: string) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, filePath)
}

function validate(body: Partial<LockBody>): string[] {
  const errors: string[] = []
  const { tokens, sitemap } = body

  if (!tokens) return ['Missing tokens payload']
  if (!sitemap) return ['Missing sitemap payload']

  // Required tokens
  if (!tokens.colors?.primary) errors.push('Missing primary color token')
  if (!tokens.colors?.background) errors.push('Missing background color token')
  if (!tokens.colors?.textPrimary) errors.push('Missing textPrimary color token')
  if (!tokens.typography?.fontBody) errors.push('Missing body font')
  const definedColors = Object.values(tokens.colors ?? {}).filter(Boolean).length
  if (definedColors < 5) errors.push(`Token contract is incomplete — only ${definedColors} colors defined (need ≥ 5)`)

  // Sitemap must have at least one page
  if (!Array.isArray(sitemap) || sitemap.length === 0) {
    errors.push('Sitemap is empty — add at least one page')
  }

  return errors
}

function collectWireframes(sitemap: Page[]) {
  const wireframes: Record<string, unknown> = {}
  const missing: { id: string; title: string; route: string }[] = []

  for (const page of sitemap) {
    const sessionPath = getPageSessionPath(page.id)
    if (fs.existsSync(sessionPath)) {
      try {
        const raw = fs.readFileSync(sessionPath, 'utf8')
        wireframes[page.id] = JSON.parse(raw)
      } catch {
        wireframes[page.id] = { error: 'failed to parse session file' }
      }
    } else if (page.type === 'public') {
      // P0 (public) pages must have wireframes locked.
      missing.push({ id: page.id, title: page.title, route: page.route })
    } else {
      wireframes[page.id] = { blocks: [] }
    }
  }

  return { wireframes, missing }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LockBody>

    const validationErrors = validate(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Lock validation failed', errors: validationErrors },
        { status: 422 }
      )
    }

    const { tokens, sitemap, profileName, rtl } = body as LockBody

    // P0 wireframe check
    const { wireframes, missing } = collectWireframes(sitemap)
    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: 'Lock validation failed',
          errors: missing.map(
            (p) => `No wireframe saved for public page "${p.title}" (${p.route})`
          ),
        },
        { status: 422 }
      )
    }

    // Generate artifacts
    const designMd = generateDesignMarkdown(tokens, sitemap, {
      profileName: profileName ?? null,
      rtl,
    })
    const wireframesJson = JSON.stringify(
      {
        $generated: new Date().toISOString(),
        profile: profileName ?? null,
        pages: sitemap.map((p) => ({
          id: p.id,
          route: p.route,
          title: p.title,
          type: p.type,
          wireframe: wireframes[p.id] ?? { blocks: [] },
        })),
      },
      null,
      2
    )

    // Atomic writes
    const designPath = getExportDesignPath()
    const wireframesPath = getExportWireframesPath()
    atomicWrite(designPath, designMd)
    atomicWrite(wireframesPath, wireframesJson)

    // Inject CSS variables into main app globals
    const injection = injectTokensIntoMainAppGlobals(tokens)

    // Ensure the .session/pages directory exists (helps the next iteration)
    const sessionDir = getPagesSessionDir()
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })

    return NextResponse.json({
      success: true,
      message: 'Design locked and exported successfully',
      artifacts: {
        designPath,
        wireframesPath,
        cssInjection: injection,
      },
      summary: {
        pages: sitemap.length,
        colors: Object.keys(tokens.colors).length,
        profile: profileName ?? 'custom',
      },
    })
  } catch (error: any) {
    console.error('[api/lock] Error:', error)
    return NextResponse.json(
      { error: 'Failed to lock design', details: error?.message ?? String(error) },
      { status: 500 }
    )
  }
}
