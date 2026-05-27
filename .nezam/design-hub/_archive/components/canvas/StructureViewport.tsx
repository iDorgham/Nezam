import { SitemapNodeBuilder } from '@/components/sitemap/SitemapNodeBuilder'

/**
 * Thin wrapper around SitemapNodeBuilder for STRUCTURE mode.
 * Exists so DesignHub.tsx has a uniform import pattern and future
 * structure-canvas additions are isolated here.
 */
export function StructureViewport() {
  return <SitemapNodeBuilder />
}
