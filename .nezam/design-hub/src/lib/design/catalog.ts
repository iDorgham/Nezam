import type { DesignTokens } from '@/types/design'
import layoutCatalogJson from '@/data/design-hub/layout-catalog.json'
import typographyRolesJson from '@/data/design-hub/typography-roles.json'
import buttonVariantsJson from '@/data/design-hub/button-variants.json'
import shadcnRegistryJson from '@/data/design-hub/shadcn-component-registry.json'

export interface LayoutPresetTitle {
  scale: string
  align: 'start' | 'center' | 'end'
  maxLines: number
}

export interface LayoutPresetButtons {
  primaryVariant: string
  secondaryVariant: string
  size: string
}

export interface LayoutCatalogPreset {
  id: string
  label: string
  description: string
  layout: DesignTokens['layout']
  title: LayoutPresetTitle
  buttons: LayoutPresetButtons
}

export interface TypographyRole {
  id: string
  label: string
  className: string
}

export interface ButtonVariantEntry {
  id: string
  label: string
  shadcn: string
}

export interface ButtonSizeEntry {
  id: string
  label: string
}

export interface ShadcnRegistryEntry {
  id: string
  label: string
  group: string
  importPath: string
}

const layoutCatalog = layoutCatalogJson as { presets: LayoutCatalogPreset[] }
const typographyRoles = typographyRolesJson as { roles: TypographyRole[] }
const buttonVariants = buttonVariantsJson as {
  variants: ButtonVariantEntry[]
  sizes: ButtonSizeEntry[]
}
const shadcnRegistry = shadcnRegistryJson as { components: ShadcnRegistryEntry[] }

export function getLayoutPresets(): LayoutCatalogPreset[] {
  return layoutCatalog.presets
}

export function getLayoutPresetById(id: string): LayoutCatalogPreset | undefined {
  return layoutCatalog.presets.find((p) => p.id === id)
}

export function getTypographyRoles(): TypographyRole[] {
  return typographyRoles.roles
}

export function getButtonVariants(): ButtonVariantEntry[] {
  return buttonVariants.variants
}

export function getButtonSizes(): ButtonSizeEntry[] {
  return buttonVariants.sizes
}

export function getShadcnRegistry(): ShadcnRegistryEntry[] {
  return shadcnRegistry.components
}
