import { NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'
import { DesignPresetSchema } from '@/src/types/tokens.types'
import type { DesignTokens } from '@/src/types/tokens.types'
import { getDesignProfilesDir } from '@/lib/paths'
import { serializeTokensToMarkdown } from '@/lib/parsers/profile.parser'

// ── Request schema ────────────────────────────────────────────────────────────

const SyncRequestSchema = z.object({
  preset: DesignPresetSchema,
})

// ── Token shape adapter ───────────────────────────────────────────────────────
// serializeTokensToMarkdown() expects the nested shape profileToTokens() returns,
// but we store flat DesignTokens. This adapter bridges the gap.

function flatToProfileShape(tokens: Partial<DesignTokens>) {
  return {
    colors: {
      primary:        tokens.primary,
      primaryHover:   tokens.primaryHover,
      secondary:      tokens.secondary,
      accent:         tokens.accent,
      background:     tokens.background,
      surface:        tokens.surface,
      surfaceElevated:tokens.surfaceElevated,
      overlay:        tokens.overlay,
      textPrimary:    tokens.textPrimary,
      textSecondary:  tokens.textSecondary,
      textMuted:      tokens.textMuted,
      textDisabled:   tokens.textDisabled,
      textInverse:    tokens.textInverse,
      border:         tokens.border,
      borderStrong:   tokens.borderStrong,
      borderSubtle:   tokens.borderSubtle,
      borderHover:    tokens.borderHover,
      borderFocus:    tokens.borderFocus,
      borderMuted:    tokens.borderMuted,
      interactive:    tokens.interactive,
      destructive:    tokens.destructive,
      success:        tokens.success,
      warning:        tokens.warning,
      info:           tokens.info,
    },
    typography: {
      fontHeading: 'Geist, system-ui, sans-serif',
      fontBody:    'Geist, system-ui, sans-serif',
      fontMono:    'JetBrains Mono, ui-monospace, monospace',
      baseSize:    16,
      scale:       1.25,
      weights:     [400, 500, 600, 700],
    },
    spacing: {
      xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px',
    },
    radius: {
      none:  tokens.radiusNone  ?? '0px',
      sm:    tokens.radiusSm    ?? '4px',
      md:    tokens.radiusMd    ?? '6px',
      lg:    tokens.radiusLg    ?? '8px',
      xl:    tokens.radiusXl    ?? '12px',
      '2xl': tokens.radius2xl   ?? '16px',
      full:  tokens.radiusFull  ?? '9999px',
    },
    motion: {
      durationFast:   '100ms',
      durationNormal: '200ms',
      durationSlow:   '350ms',
    },
    elevation: {
      none: 'none',
      sm:   '0 1px 2px rgba(0,0,0,0.4)',
      md:   '0 4px 12px rgba(0,0,0,0.5)',
      lg:   '0 8px 24px rgba(0,0,0,0.6)',
      xl:   '0 8px 24px rgba(0,0,0,0.6)',
    },
    zIndex: {
      base: 0, dropdown: 50, sticky: 100, modal: 1000, toast: 9999,
    },
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Request body must be valid JSON' }, { status: 400 })
  }

  const parsed = SyncRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message ?? 'Invalid preset' },
      { status: 400 }
    )
  }

  const { preset } = parsed.data

  // System presets are read-only — prevent accidental overwrites of catalog profiles
  if (preset.isSystem) {
    return NextResponse.json(
      { error: 'READONLY', message: 'System presets cannot be overwritten. Save a copy instead.' },
      { status: 403 }
    )
  }

  const dir = getDesignProfilesDir()
  const presetDir = join(dir, preset.slug)
  const mdPath    = join(presetDir, 'design.md')

  try {
    await mkdir(presetDir, { recursive: true })
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code
    if (code !== 'EEXIST') {
      return NextResponse.json(
        { error: 'DISK_ERROR', message: 'Failed to create preset directory' },
        { status: 500 }
      )
    }
  }

  const markdown = serializeTokensToMarkdown(preset.name, flatToProfileShape(preset.tokens))

  try {
    await writeFile(mdPath, markdown, 'utf-8')
  } catch (err: unknown) {
    const isPermission = (err as NodeJS.ErrnoException).code === 'EACCES'
    return NextResponse.json(
      {
        error:   isPermission ? 'PERMISSION_DENIED' : 'DISK_ERROR',
        message: isPermission
          ? 'Sync failed: Permission denied. Check .nezam/design/ directory permissions.'
          : 'Sync failed: Could not write design.md',
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    path:    mdPath,
    slug:    preset.slug,
  })
}
