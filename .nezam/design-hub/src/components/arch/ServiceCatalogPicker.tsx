'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BrandIcon } from '@/components/arch/BrandIcon'
import {
  listCatalogCategories,
  listCatalogProviders,
  type CatalogProvider,
} from '@/lib/arch/service-catalog'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPick: (providerId: string) => void
}

function ProviderRow({
  provider,
  onPick,
}: {
  provider: CatalogProvider
  onPick: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(provider.id)}
      className="flex w-full items-start gap-3 rounded-app border border-app-border bg-app-elevated/40 px-3 py-2.5 text-left transition-colors hover:border-app-accent/40 hover:bg-app-accent-subtle/10"
    >
      <BrandIcon slug={provider.simpleIconSlug} size={20} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-app-text">{provider.name}</span>
          <span className="rounded px-1.5 py-0.5 text-[8px] uppercase tracking-wide bg-app-bg text-app-subtle">
            {provider.serviceKind}
          </span>
        </div>
        <p className="text-[10px] text-app-subtle line-clamp-2 mt-0.5">{provider.description}</p>
        <p className="text-[9px] text-app-muted mt-1">{provider.pricing}</p>
      </div>
    </button>
  )
}

export function ServiceCatalogPicker({ open, onOpenChange, onPick }: Props) {
  const [query, setQuery] = useState('')
  const categories = listCatalogCategories()
  const providers = listCatalogProviders()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return providers
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.includes(q) ||
        p.categoryLabel.toLowerCase().includes(q),
    )
  }, [query, providers])

  const byCategory = useMemo(() => {
    const map = new Map<string, CatalogProvider[]>()
    for (const p of filtered) {
      const list = map.get(p.categoryId) ?? []
      list.push(p)
      map.set(p.categoryId, list)
    }
    return map
  }, [filtered])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm">Developer services catalog</DialogTitle>
        </DialogHeader>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-app-subtle" />
          <input
            type="search"
            placeholder="Search providers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-8 rounded-app-sm border border-app-border bg-app-elevated pl-8 pr-2 text-[11px] text-app-text placeholder:text-app-subtle focus:outline-none focus:border-app-accent"
          />
        </div>
        <div className="flex-1 overflow-y-auto app-scroll space-y-4 pr-1">
          {categories.map((cat) => {
            const items = byCategory.get(cat.id)
            if (!items?.length) return null
            return (
              <section key={cat.id}>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-app-muted mb-2">
                  {cat.label}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {items.map((p) => (
                    <ProviderRow
                      key={p.id}
                      provider={p}
                      onPick={(id) => {
                        onPick(id)
                        onOpenChange(false)
                        setQuery('')
                      }}
                    />
                  ))}
                </div>
              </section>
            )
          })}
          {filtered.length === 0 && (
            <p className={cn('text-center text-[11px] text-app-subtle py-8')}>No providers match.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
