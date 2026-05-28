import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

import {
  getExportDesignPath,
  getExportWireframesPath,
  getPagesSessionDir,
  getPageSessionPath,
} from '@/lib/paths'
import { generateDesignMarkdown } from '@/lib/locking/export-design'
import { validateP0Wireframes } from '@/lib/locking/validate-p0-wireframes'
import { readSessionForSitemapPage } from '@/lib/locking/session-resolver'
import type { DesignTokens } from '@/types/design'

type CanvasMode = 'web-marketing' | 'saas-dashboard' | 'mobile-app' | 'tui'

type LockSitemapPageType = 'public' | 'auth' | 'admin' | 'modal' | 'embed'

type LockSitemapPage = {
  id: string
  arch_page_id?: string
  title: string
  route: string
  type: LockSitemapPageType
  access: string[]
  status: 'approved' | 'deferred' | 'removed'
  parent_id?: string
  children?: string[]
  feature_ids?: string[]
  nav_label?: string
  nav_icon?: string
  show_in_nav?: boolean
  nav_position?: number
  breadcrumb_trail?: string[]
  priority?: 'P0' | 'P1' | 'P2' | string
  user_comment?: string
}

type LockBody = {
  tokens: DesignTokens
  sitemap: LockSitemapPage[]
  profileName?: string
  rtl?: boolean

  // Optional metadata — the wireframe server can supply these.
  projectName?: string
  sessionId?: string
  lockedBy?: string
  canvasMode?: CanvasMode
}

function atomicWrite(filePath: string, content: string) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, filePath)
}

function readJsonIfExists(filePath: string): unknown | null {
  try {
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function parsePx(value: string | number | undefined): number {
  if (typeof value === 'number') return value
  if (!value) return 0
  const match = String(value).match(/-?\d+(\.\d+)?/)
  if (!match) return 0
  return Number(match[0] ?? 0)
}

function buildDesignSystem(tokens: DesignTokens, rtl: boolean, profileName?: string | null) {
  const primary = tokens.colors.brand['500']
  const secondary = tokens.colors.neutral['500']
  const accent = tokens.colors.accent['500']

  const baseSizePx = Math.round(parsePx(tokens.typography.scale.base.size))
  const lineHeight = (() => {
    const raw = tokens.typography.scale.base.lineHeight
    const match = raw.match(/-?\d+(\.\d+)?/)
    return match ? Number(match[0] ?? 0) : 0
  })()

  const densityMode = tokens.density.mode
  const density =
    densityMode === 'compact' ? 'compact' : densityMode === 'spacious' ? 'comfortable' : 'default'

  const radiusMd = parsePx(tokens.radius.md)
  const radius_style = radiusMd <= 4 ? 'sharp' : radiusMd <= 10 ? 'subtle' : radiusMd <= 20 ? 'rounded' : 'pill'

  const typographyScaleHint = (() => {
    const base = parsePx(tokens.typography.scale.base.size)
    // Best-effort: map typical scales to human-readable names.
    if (!base) return 'default'
    return 'custom'
  })()

  return {
    color_profile: {
      profile_name: profileName ?? 'custom',
      primary,
      secondary,
      accent,
      background: tokens.colors.surface.bg,
      surface: tokens.colors.surface.panel,
      text_primary: tokens.colors.text.primary,
      text_secondary: tokens.colors.text.secondary,
      text_muted: tokens.colors.text.muted,
      text_on_primary: tokens.colors.text.primary,
      success: tokens.colors.semantic.success,
      warning: tokens.colors.semantic.warning,
      error: tokens.colors.semantic.error,
      border: tokens.colors.surface.border,
      border_strong: tokens.colors.surface.border,
      primary_hover: tokens.colors.brand['600'],
      surface_raised: tokens.elevation.surface.raised ?? tokens.colors.surface.panel,
      dark_mode_overrides: rtl ? {} : undefined,
    },
    typography: {
      heading_font: tokens.typography.display,
      body_font: tokens.typography.sans,
      mono_font: tokens.typography.mono,
      arabic_font: tokens.typography.sans,
      base_size_px: baseSizePx || 16,
      scale_ratio: typographyScaleHint,
      scale_ratio_value: Number((parsePx(tokens.typography.scale.lg.size) || 18) / (parsePx(tokens.typography.scale.base.size) || 16)),
      line_height: lineHeight || 1.5,
      font_load_strategy: 'system-stack',
    },
    spacing: {
      base_unit_px: tokens.spacing.base === 4 ? 4 : 8,
      density,
      scale: {
        xs: Math.round(tokens.spacing.base * 0.5),
        sm: tokens.spacing.base,
        md: tokens.spacing.base * 2,
        lg: tokens.spacing.base * 3,
        xl: tokens.spacing.base * 4,
        '2xl': tokens.spacing.base * 6,
        '3xl': tokens.spacing.base * 8,
      },
    },
    borders: {
      radius_style,
      radius_values: {
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
        full: tokens.radius.full,
      },
      shadow_depth: 'subtle',
      shadow_values: {
        sm: tokens.shadows.sm,
        md: tokens.shadows.md,
        lg: tokens.shadows.lg,
        xl: tokens.shadows.xl,
      },
      border_width_default: Math.max(0, Math.round(parsePx(tokens.borders.width) || 1)),
    },
  }
}

function normalizeSectionsFromSession(session: any): any[] {
  if (!session || typeof session !== 'object') return []

  if (Array.isArray(session.sections)) return session.sections
  if (Array.isArray(session.block_sections)) return session.block_sections

  if (Array.isArray(session.blocks)) {
    return session.blocks.map((b: any, idx: number) => ({
      section_id: b.section_id ?? `sec-${idx}`,
      block_type: b.block_type ?? b.type ?? 'UnknownBlock',
      order: typeof b.order === 'number' ? b.order : idx,
      approved: typeof b.approved === 'boolean' ? b.approved : !!b.locked,
      locked_props: b.locked_props ?? {},
      flexible_props: b.flexible_props ?? {},
      content_slots: b.content_slots,
      states: b.states,
    }))
  }

  // If session is already a wireframe-like structure, try a best-effort conversion.
  if (Array.isArray(session.wireframes)) return []

  return []
}

function inferLayoutApprovedFromSession(session: any, sections: any[]) {
  if (session && typeof session === 'object' && typeof session.layout_approved === 'boolean') {
    return session.layout_approved
  }
  if (session && typeof session === 'object' && typeof session.approved === 'boolean') return session.approved
  if (sections.length === 0) return false
  return sections.every((s) => typeof s.approved === 'boolean' ? s.approved : false)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LockBody>
    const { tokens, sitemap, rtl, profileName } = body

    if (!tokens) {
      return NextResponse.json({ error: 'Missing tokens payload' }, { status: 422 })
    }
    if (!Array.isArray(sitemap) || sitemap.length === 0) {
      return NextResponse.json({ error: 'Missing sitemap payload' }, { status: 422 })
    }

    const lockedAt = new Date().toISOString()
    const canvasMode: CanvasMode = body.canvasMode ?? 'saas-dashboard'

    // Ensure session dirs exist for Phase 2 / future iteration.
    const sessionDir = getPagesSessionDir()
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })

    // Read user-approved wireframes from `.session/pages/{pageId}.json`.
    const pagesOut = sitemap.map((p) => {
      const { session, sessionPageId } = readSessionForSitemapPage(
        p,
        (pageId) => readJsonIfExists(getPageSessionPath(pageId))
      )
      const sections = normalizeSectionsFromSession(session)
      const layout_approved = inferLayoutApprovedFromSession(session, sections)

      return {
        page_id: p.id,
        arch_page_id: p.arch_page_id,
        session_page_id: sessionPageId,
        title: p.title,
        route: p.route,
        canvas_mode: canvasMode,
        layout_approved,
        sections,
      }
    })

    const { errors: p0Errors } = validateP0Wireframes({
      sitemap,
      pagesOut: pagesOut.map((p) => ({
        page_id: p.page_id,
        title: p.title,
        route: p.route,
        sections: p.sections,
      })),
    })

    if (p0Errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Lock validation failed',
          errors: p0Errors,
        },
        { status: 422 }
      )
    }

    const blocks = pagesOut.flatMap((pg) =>
      pg.sections.map((s: any, idx: number) => ({
        id: `block-${pg.page_id}-${idx}`,
        section_id: s.section_id ?? `sec-${idx}`,
        page_id: pg.page_id,
        block_type: s.block_type ?? s.type ?? 'UnknownBlock',
        order: typeof s.order === 'number' ? s.order : idx,
        approved: typeof s.approved === 'boolean' ? s.approved : false,
      }))
    )

    const designSystem = buildDesignSystem(tokens, !!rtl, profileName ?? null)
    const designMd = generateDesignMarkdown(tokens, sitemap, { profileName: profileName ?? null, rtl: !!rtl })

    const projectName = body.projectName ?? 'NEZAM'
    const sessionId = body.sessionId ?? crypto.randomUUID()
    const lockedBy = body.lockedBy ?? 'unknown'

    const wireframesLocked = {
      // Extra fields for CI gate compatibility.
      blocks,
      meta: {
        project_name: projectName,
        project_slug: projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        session_id: sessionId,
        locked_at: lockedAt,
        generatedAt: lockedAt,
        profile: profileName ?? 'custom',
        canvas_mode: canvasMode,
        nezam_version: 'v7',
        locked_by: lockedBy,
        source_context: getProjectContextPathHint(),
      },
      locked_at: lockedAt,
      design_decisions: {
        layout_direction: rtl ? 'rtl' : 'ltr',
        color_mode: 'auto',
        motion_level: 'standard',
      },
      sitemap: {
        pages: sitemap,
      },
      pages: pagesOut,
      design_system: designSystem,
    }

    atomicWrite(getExportDesignPath(), designMd)
    atomicWrite(getExportWireframesPath(), JSON.stringify(wireframesLocked, null, 2))

    return NextResponse.json({
      success: true,
      artifacts: {
        designPath: getExportDesignPath(),
        wireframesPath: getExportWireframesPath(),
      },
      summary: {
        pages: pagesOut.length,
        blocks: blocks.length,
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

function getProjectContextPathHint() {
  // The wireframe server seeds this file at repo root. We don't resolve the exact repo path here
  // because `getProjectRoot()` already handles it in Phase 1 paths.
  return 'project_context.json'
}

