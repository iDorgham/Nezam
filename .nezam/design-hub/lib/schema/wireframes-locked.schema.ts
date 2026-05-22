/**
 * lib/schema/wireframes-locked.schema.ts
 *
 * Zod schema for the server's export output: wireframes_locked.json
 * Developer agents read this before building any UI component.
 *
 * Key constraint: locked_props are user-set and MUST NOT be overridden.
 * flexible_props are AI defaults — agents have discretion within design tokens.
 */

import { z } from 'zod'

const HexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a 6-digit hex value like #5e6ad2')

export const LockedDesignSystemSchema = z.object({
  color_profile: z.string(),
  primary: HexColorSchema,
  secondary: HexColorSchema,
  accent: HexColorSchema,
  background: HexColorSchema,
  surface: HexColorSchema,
  text_primary: HexColorSchema,
  text_secondary: HexColorSchema,
  font_heading: z.string(),
  font_body: z.string(),
  font_mono: z.string(),
  radius_style: z.enum(['sharp', 'subtle', 'rounded', 'pill']),
  shadow_depth: z.enum(['flat', 'subtle', 'medium', 'elevated']),
  base_size: z.number(),
  rtl: z.boolean(),
})

export const ContentSlotSchema = z.object({
  id: z.string(),
  label: z.string(),
  placeholder: z.string(),
  locked: z.boolean().describe('If true, content was user-set. Agents must not AI-generate it.'),
  value: z.string().optional(),
})

export const StateSpecSchema = z.object({
  approved: z.boolean(),
  headline: z.string().optional(),
  body: z.string().optional(),
  cta_label: z.string().optional(),
  cta_action: z.string().optional(),
})

export const LockedSectionSchema = z.object({
  id: z.string(),
  block_type: z.string(),
  approved: z.boolean(),
  locked_props: z.record(z.unknown()).describe('User-set. Agents must use exactly.'),
  flexible_props: z
    .record(z.unknown())
    .describe('AI defaults. Agents have discretion within design tokens.'),
  content_slots: z.array(ContentSlotSchema).optional(),
  states: z
    .object({
      loading: StateSpecSchema.optional(),
      empty: StateSpecSchema.optional(),
      error: StateSpecSchema.optional(),
      populated: StateSpecSchema.optional(),
      offline: StateSpecSchema.optional(),
    })
    .optional(),
})

export const LockedPageSchema = z.object({
  id: z.string(),
  title: z.string(),
  route: z.string(),
  type: z.enum(['public', 'auth', 'admin', 'modal', 'embed']),
  priority: z.enum(['P0', 'P1', 'P2']),
  layout_approved: z.boolean(),
  sections: z.array(LockedSectionSchema),
})

export const NavigationMapSchema = z.object({
  primary_nav_type: z.enum(['topbar', 'sidebar', 'bottom-tab', 'drawer', 'hybrid']),
  mobile_nav_type: z.enum(['bottom-tab', 'drawer', 'top-sheet']).optional(),
  primary_items: z.array(
    z.object({
      label: z.string(),
      route: z.string(),
      icon: z.string().optional(),
    })
  ),
  secondary_items: z
    .array(
      z.object({
        label: z.string(),
        route: z.string(),
        icon: z.string().optional(),
      })
    )
    .optional(),
  user_menu_items: z
    .array(
      z.object({
        label: z.string(),
        action: z.string(),
        icon: z.string().optional(),
      })
    )
    .optional(),
})

export const ImplementationContractSchema = z.object({
  must_implement: z
    .array(z.string())
    .describe('Explicit requirements agents must satisfy'),
  must_not_implement: z
    .array(z.string())
    .describe('Hard constraints — agents must not deviate from these'),
  deferred_pages: z
    .array(z.string())
    .describe('Page IDs excluded from this sprint. Do not scaffold.'),
})

export const WireframesLockedSchema = z.object({
  meta: z.object({
    project_name: z.string(),
    project_slug: z.string(),
    locked_at: z.string().datetime(),
    schema_version: z.string().optional(),
    canvas_mode: z.enum(['web-marketing', 'saas-dashboard', 'mobile-app', 'tui']),
    session_id: z.string(),
  }),

  design_system: LockedDesignSystemSchema,

  pages: z.array(LockedPageSchema),

  navigation_map: NavigationMapSchema,

  implementation_contract: ImplementationContractSchema,

  session_stats: z.object({
    total_pages: z.number(),
    approved_pages: z.number(),
    deferred_pages: z.number(),
    total_sections: z.number(),
    approved_sections: z.number(),
    locked_props_count: z.number(),
    flexible_props_count: z.number(),
    session_duration_minutes: z.number().optional(),
  }),
})

export type WireframesLocked = z.infer<typeof WireframesLockedSchema>
export type LockedPage = z.infer<typeof LockedPageSchema>
export type LockedSection = z.infer<typeof LockedSectionSchema>
export type LockedDesignSystem = z.infer<typeof LockedDesignSystemSchema>
export type NavigationMap = z.infer<typeof NavigationMapSchema>
