import { z } from 'zod'

export const LangSchema = z.enum(['en', 'ar'])
export const SyncStatusSchema = z.enum(['idle', 'syncing', 'synced', 'error'])
export const TabSchema = z.enum(['tokens', 'canvas', 'wireframe', 'sitemap', 'review', 'settings'])

export type Lang = z.infer<typeof LangSchema>
export type SyncStatus = z.infer<typeof SyncStatusSchema>
export type Tab = z.infer<typeof TabSchema>

// ── Design token fields ────────────────────────────────────────────────────────

export const DesignTokensSchema = z.object({
  // Brand
  primary:           z.string(),
  primaryHover:      z.string(),
  primarySubtle:     z.string(),
  primaryForeground: z.string(),
  secondary:         z.string(),
  accent:            z.string(),
  alert:             z.string(),
  alertHover:        z.string(),
  alertSubtle:       z.string(),

  // Surfaces
  background:       z.string(),
  surface:          z.string(),
  surfaceElevated:  z.string(),
  surfaceHover:     z.string(),
  surfaceSubtle:    z.string(),
  overlay:          z.string(),

  // Text
  textPrimary:   z.string(),
  textSecondary: z.string(),
  textMuted:     z.string(),
  textDisabled:  z.string(),
  textInverse:   z.string(),

  // Borders
  border:       z.string(),
  borderStrong: z.string(),
  borderSubtle: z.string(),
  borderHover:  z.string(),
  borderFocus:  z.string(),
  borderMuted:  z.string(),

  // Semantic
  interactive: z.string(),
  destructive: z.string(),
  success:     z.string(),
  warning:     z.string(),
  error:       z.string(),
  info:        z.string(),

  // Border radius
  radiusNone: z.string(),
  radiusSm:   z.string(),
  radiusMd:   z.string(),
  radiusLg:   z.string(),
  radiusXl:   z.string(),
  radius2xl:  z.string(),
  radiusFull: z.string(),
})

export type DesignTokens = z.infer<typeof DesignTokensSchema>

// ── Design preset ──────────────────────────────────────────────────────────────

export const DesignPresetSchema = z.object({
  id:        z.string(),
  name:      z.string(),
  slug:      z.string(),
  isSystem:  z.boolean().default(false),
  tokens:    DesignTokensSchema.partial(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type DesignPreset = z.infer<typeof DesignPresetSchema>
