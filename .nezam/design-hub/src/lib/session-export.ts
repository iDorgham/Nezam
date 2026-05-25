/**
 * NEZAM Design Hub — Lock & Sync payload builders.
 * Pure functions; no side effects. The API route calls these
 * then writes the results to .nezam/design-hub/.session/
 */

import type {
  SitemapBuilderApp,
  SitemapBuilderService,
  SitemapBuilderInfra,
  ResolvedTokens,
  ArchetypeKind,
  Block,
  PageStyle,
} from '@/types'
import { tokensToCssVars } from './tokens'

/* ── 1. Sitemap JSON (DTCG-inspired topology) ─────────────────── */

export function buildSitemapJson(
  apps: SitemapBuilderApp[],
  services: SitemapBuilderService[],
  infra: SitemapBuilderInfra,
) {
  return {
    $schema: 'https://nezam.design/schema/sitemap-v1.json',
    generatedAt: new Date().toISOString(),
    infrastructure: {
      git:      infra.git,
      database: infra.database,
      platform: infra.platform,
    },
    prd: infra.prd,
    apps: apps.map((app) => ({
      id:   app.id,
      name: app.name,
      kind: app.kind,
      navMenus: app.navMenus.map((menu) => ({
        id:   menu.id,
        name: menu.name,
        kind: menu.kind,
        pages: flattenMenuPages(menu.pages),
      })),
    })),
    services: services.map((svc) => ({
      id:               svc.id,
      name:             svc.name,
      kind:             svc.kind,
      description:      svc.description,
      endpoint:         svc.endpoint,
      connectedPageIds: svc.connectedPageIds,
    })),
  }
}

function flattenMenuPages(pages: SitemapBuilderApp['navMenus'][number]['pages']): unknown[] {
  return pages.map((p) => ({
    id:              p.id,
    name:            p.name,
    url:             p.url,
    status:          p.status,
    metaTitle:       p.metaTitle,
    metaDescription: p.metaDescription,
    sections: p.sections.map((s) => ({ id: s.id, name: s.name, description: s.description })),
    subPages: p.subPages ? flattenMenuPages(p.subPages) : undefined,
  }))
}

/* ── 2. Tokens JSON (W3C/DTCG format) ────────────────────────── */

export function buildTokensJson(tokens: ResolvedTokens) {
  const cssVars = tokensToCssVars(tokens)
  return {
    $schema: 'https://nezam.design/schema/tokens-v1.json',
    generatedAt: new Date().toISOString(),
    meta: {
      format:  'DTCG-compatible',
      version: '1.0.0',
    },
    color: {
      brand:        dtcgColor(tokens.brand,       'Brand primary action'),
      brandHover:   dtcgColor(tokens.brandHover,  'Brand hover state'),
      brandSubtle:  dtcgColor(tokens.brandSubtle, 'Brand tint / subtle background'),
      onBrand:      dtcgColor(tokens.onBrand,     'Foreground on brand surfaces'),
      accent:       dtcgColor(tokens.accent,      'Accent / secondary action'),
      bg:           dtcgColor(tokens.bg,          'Page background'),
      surface:      dtcgColor(tokens.surface,     'Card / panel surface'),
      elevated:     dtcgColor(tokens.elevated,    'Elevated surface'),
      text:         dtcgColor(tokens.text,        'Primary text'),
      textMuted:    dtcgColor(tokens.textMuted,   'Secondary / muted text'),
      textSubtle:   dtcgColor(tokens.textSubtle,  'Tertiary / subtle text'),
      border:       dtcgColor(tokens.border,      'Default border'),
      borderStrong: dtcgColor(tokens.borderStrong,'Strong border'),
      success:      dtcgColor(tokens.success,     'Semantic success'),
      warning:      dtcgColor(tokens.warning,     'Semantic warning'),
      danger:       dtcgColor(tokens.danger,      'Semantic danger'),
      info:         dtcgColor(tokens.info,        'Semantic info'),
    },
    shape: {
      radius:        dtcgDimension(`${tokens.radius}px`,    'Base border radius'),
      radiusSm:      dtcgDimension(`${Math.max(0, tokens.radius - 4)}px`, 'Small border radius'),
      radiusLg:      dtcgDimension(`${tokens.radius + 6}px`, 'Large border radius'),
      radiusPill:    dtcgDimension('999px',                 'Pill / full-round radius'),
    },
    typography: {
      fontSans:     { $type: 'fontFamily', $value: tokens.fontSans,    $description: 'UI / body font' },
      fontDisplay:  { $type: 'fontFamily', $value: tokens.fontDisplay, $description: 'Display / heading font' },
    },
    density: {
      density: { $type: 'string', $value: tokens.density, $description: 'Spacing density scale' },
    },
    shadow: {
      shadow: { $type: 'string', $value: tokens.shadow, $description: 'Elevation shadow style' },
    },
    cssVariables: cssVars,
  }
}

function dtcgColor(value: string, description: string) {
  return { $type: 'color', $value: value, $description: description }
}
function dtcgDimension(value: string, description: string) {
  return { $type: 'dimension', $value: value, $description: description }
}

/* ── 3. Wireframes locked JSON ────────────────────────────────── */

export function buildWireframesJson(
  archetypeId: ArchetypeKind,
  blocks: Block[],
  pageStyle: PageStyle,
) {
  return {
    $schema: 'https://nezam.design/schema/wireframes-v1.json',
    generatedAt: new Date().toISOString(),
    archetype:   archetypeId,
    pageStyle,
    locked:      true,
    blocks: blocks.map((b) => ({
      id:    b.id,
      kind:  b.kind,
      label: b.label,
      arabicLabel: b.arabicLabel,
    })),
  }
}
