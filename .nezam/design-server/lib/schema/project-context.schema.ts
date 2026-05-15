/**
 * lib/schema/project-context.schema.ts
 *
 * Zod schema mirroring .nezam/templates/wireframe-server/project_context.schema.json
 * Used for runtime validation when the server reads project_context.json.
 */

import { z } from 'zod'

export const DesignSystemTokensSchema = z.object({
  color_profile: z.string().describe('Name of the suggested design profile'),
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  surface: z.string().optional(),
  text_primary: z.string().optional(),
  text_secondary: z.string().optional(),
  font_heading: z.string().optional(),
  font_body: z.string().optional(),
  font_mono: z.string().optional(),
  radius_style: z.enum(['sharp', 'subtle', 'rounded', 'pill']).optional(),
  shadow_depth: z.enum(['flat', 'subtle', 'medium', 'elevated']).optional(),
  base_size: z.number().min(12).max(24).optional(),
  rtl: z.boolean().optional(),
})

export const AINotesSchema = z.object({
  rationale: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low']).optional(),
  open_questions: z.array(z.string()).optional(),
})

export const SectionSchema = z.object({
  id: z.string(),
  block_type: z.string(),
  ai_rationale: z.string().optional(),
  props: z.record(z.unknown()).optional(),
  states: z
    .object({
      loading: z.boolean().optional(),
      empty: z.boolean().optional(),
      error: z.boolean().optional(),
      populated: z.boolean().optional(),
      offline: z.boolean().optional(),
    })
    .optional(),
})

export const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  route: z.string().startsWith('/'),
  type: z.enum(['public', 'auth', 'admin', 'modal', 'embed']),
  priority: z.enum(['P0', 'P1', 'P2']),
  show_in_nav: z.boolean().optional().default(true),
  nav_label: z.string().max(24).optional(),
  nav_icon: z.string().optional(),
  access_roles: z.array(z.string()).optional(),
  feature_ids: z.array(z.string()).optional(),
  sections: z.array(SectionSchema).optional().default([]),
  ai_notes: AINotesSchema.optional(),
})

export const NavItemSchema = z.object({
  label: z.string(),
  route: z.string(),
  icon: z.string().optional(),
  type: z.enum(['primary', 'secondary', 'user_menu', 'footer']).optional(),
})

export const SitemapSchema = z.object({
  primary_nav_type: z.enum(['topbar', 'sidebar', 'bottom-tab', 'drawer', 'hybrid']),
  mobile_nav_type: z.enum(['bottom-tab', 'drawer', 'top-sheet']).optional(),
  items: z.array(NavItemSchema).optional(),
})

export const ComponentLibrarySchema = z.object({
  primary: z.string().optional().describe('e.g. shadcn/ui, MUI, Ant Design'),
  icon_set: z.string().optional().describe('e.g. lucide-react'),
  custom_components: z.array(z.string()).optional(),
})

export const ProjectContextSchema = z.object({
  meta: z.object({
    project_name: z.string().min(1),
    project_slug: z.string().regex(/^[a-z0-9-]+$/),
    generated_at: z.string().datetime().optional(),
    generated_by: z.string().optional(),
    schema_version: z.string().optional(),
  }),

  canvas_mode: z.enum(['web-marketing', 'saas-dashboard', 'mobile-app', 'tui']),

  product_type: z
    .enum(['website', 'landing', 'webapp', 'saas', 'mobile', 'tui', 'cli'])
    .optional(),

  rtl: z.boolean().optional().default(false),

  target_market: z.string().optional(),

  sitemap: SitemapSchema,

  pages: z.array(PageSchema).min(1),

  design_system: DesignSystemTokensSchema,

  component_library: ComponentLibrarySchema.optional(),

  ai_notes: AINotesSchema.optional(),
})

export type ProjectContext = z.infer<typeof ProjectContextSchema>
export type Page = z.infer<typeof PageSchema>
export type Section = z.infer<typeof SectionSchema>
export type DesignSystemTokens = z.infer<typeof DesignSystemTokensSchema>
export type Sitemap = z.infer<typeof SitemapSchema>
