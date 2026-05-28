import catalogJson from '@/data/design-hub/developer-services-catalog.json'
import type { CatalogProvider, ServiceCatalog } from './types'

const catalog = catalogJson as ServiceCatalog

const byId = new Map<string, CatalogProvider>(
  catalog.providers.map((p) => [p.id, p]),
)

export function getServiceCatalog(): ServiceCatalog {
  return catalog
}

export function getCatalogProvider(id: string): CatalogProvider | undefined {
  return byId.get(id)
}

export function listCatalogProviders(): CatalogProvider[] {
  return catalog.providers
}

export function listCatalogCategories(): ServiceCatalog['categories'] {
  return catalog.categories
}

export function searchCatalogProviders(query: string): CatalogProvider[] {
  const q = query.trim().toLowerCase()
  if (!q) return catalog.providers
  return catalog.providers.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.id.includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  )
}

export function providersByCategory(): Map<string, CatalogProvider[]> {
  const map = new Map<string, CatalogProvider[]>()
  for (const p of catalog.providers) {
    const list = map.get(p.categoryId) ?? []
    list.push(p)
    map.set(p.categoryId, list)
  }
  return map
}

export type { CatalogProvider, ServiceCatalog, ServiceIntegration } from './types'
