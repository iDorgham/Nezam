import { describe, expect, it } from 'vitest'
import {
  getCatalogProvider,
  getServiceCatalog,
  listCatalogProviders,
  searchCatalogProviders,
} from '@/lib/arch/service-catalog'

describe('service-catalog', () => {
  it('loads catalog with categories and providers', () => {
    const catalog = getServiceCatalog()
    expect(catalog.version).toBeGreaterThanOrEqual(1)
    expect(catalog.categories.length).toBeGreaterThan(10)
    expect(catalog.providers.length).toBeGreaterThanOrEqual(75)
  })

  it('every provider has integration with apiSteps and agentPrompt', () => {
    for (const p of listCatalogProviders()) {
      expect(p.integration.apiSteps.length).toBeGreaterThanOrEqual(3)
      expect(p.integration.agentPrompt.length).toBeGreaterThan(20)
      expect(p.id).toBeTruthy()
      expect(p.simpleIconSlug).toBeTruthy()
      expect(p.ownerAgent).toBeTruthy()
    }
  })

  it('resolves known providers by id', () => {
    expect(getCatalogProvider('stripe')?.name).toBe('Stripe')
    expect(getCatalogProvider('supabase')?.serviceKind).toBe('database')
    expect(getCatalogProvider('missing-provider')).toBeUndefined()
  })

  it('search filters by name', () => {
    const hits = searchCatalogProviders('vercel')
    expect(hits.some((p) => p.id === 'vercel')).toBe(true)
    expect(hits.every((p) => p.name.toLowerCase().includes('vercel') || p.id.includes('vercel'))).toBe(
      true,
    )
  })
})
