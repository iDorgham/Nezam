import { useHub } from '@/store/hub.store'
import { SitemapNodeBuilder } from '@/components/sitemap/SitemapNodeBuilder'

/**
 * STRUCTURE mode canvas. Reads `structureSection` from the hub store and
 * passes it to SitemapNodeBuilder so only the matching accordion section
 * is expanded/visible.
 */
export function StructureViewport() {
  const structureSection = useHub((s) => s.structureSection)
  return <SitemapNodeBuilder focusSection={structureSection} />
}
