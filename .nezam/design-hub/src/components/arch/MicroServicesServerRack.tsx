'use client'

import { useState } from 'react'
import { Plus, Server } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BrandIcon } from '@/components/arch/BrandIcon'
import { ServiceCatalogPicker } from '@/components/arch/ServiceCatalogPicker'
import { getCatalogProvider } from '@/lib/arch/service-catalog'
import { getServiceRoots } from '@/lib/arch/page-tree'
import type { ArchPage, ServiceKind } from '@/types/arch'

const SERVICE_STYLES: Record<
  ServiceKind,
  { border: string; bg: string; dot: string; label: string }
> = {
  api: {
    border: 'border-sky-500/40',
    bg: 'bg-sky-500/10',
    dot: 'bg-sky-500',
    label: 'API',
  },
  auth: {
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/10',
    dot: 'bg-violet-500',
    label: 'Auth',
  },
  payment: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    dot: 'bg-amber-500',
    label: 'Payment',
  },
  database: {
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-500',
    label: 'Database',
  },
}

function ServiceCard({
  page,
  selected,
  onSelect,
}: {
  page: ArchPage
  selected: boolean
  onSelect: () => void
}) {
  const kind = page.serviceKind ?? 'api'
  const style = SERVICE_STYLES[kind]
  const provider = page.serviceProviderId
    ? getCatalogProvider(page.serviceProviderId)
    : undefined

  return (
    <button
      type="button"
      data-service-id={page.id}
      onClick={onSelect}
      className={cn(
        'flex min-w-[140px] flex-col gap-1 rounded-app border px-3 py-2 text-left transition-all',
        style.border,
        style.bg,
        selected && 'ring-2 ring-app-accent ring-offset-1 ring-offset-app-bg',
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn('h-2 w-2 rounded-full shrink-0', style.dot)} />
        {provider ? (
          <BrandIcon slug={provider.simpleIconSlug} size={14} />
        ) : null}
        <span className="text-[11px] font-semibold text-app-text truncate">{page.name}</span>
      </div>
      <span className="text-[9px] font-mono text-app-subtle truncate">{page.route}</span>
      <span className="text-[8px] uppercase tracking-wider text-app-subtle">
        {provider?.categoryLabel ?? style.label}
      </span>
    </button>
  )
}

interface Props {
  onSelectPage?: () => void
}

export function MicroServicesServerRack({ onSelectPage }: Props) {
  const pages = useHub((s) => s.arch.pages)
  const selectedServiceId = useHub((s) => s.arch.selectedServiceId)
  const archSelectService = useHub((s) => s.archSelectService)
  const archAddServiceFromCatalog = useHub((s) => s.archAddServiceFromCatalog)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ tone: 'error' | 'success'; message: string } | null>(null)
  const services = getServiceRoots(pages)

  return (
    <>
      <div className="mb-8 w-full rounded-app-lg border border-app-border bg-app-elevated/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-app-accent" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-app-text">
                Micro Services Server Rack
              </p>
              <p className="text-[9px] text-app-subtle">
                Catalog-backed services — select a card for the integration guide.
              </p>
            </div>
          </div>
          <Button variant="outline" size="xs" onClick={() => setPickerOpen(true)}>
            <Plus size={11} className="mr-0.5" />
            Service
          </Button>
        </div>
        {services.length === 0 ? (
          <p className="text-[10px] text-app-subtle py-2">
            No services yet. Add from the developer services catalog.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {services.map((page) => (
              <ServiceCard
                key={page.id}
                page={page}
                selected={selectedServiceId === page.id}
                onSelect={() => {
                  archSelectService(page.id)
                  onSelectPage?.()
                }}
              />
            ))}
          </div>
        )}
        {feedback ? (
          <div role="status" aria-live="polite" className="mt-3 rounded-app-sm border border-app-border bg-app-surface px-2.5 py-1.5 text-[10px]">
            <span className={feedback.tone === 'error' ? 'text-app-danger' : 'text-app-success'}>
              {feedback.message}
            </span>
          </div>
        ) : null}
      </div>

      <ServiceCatalogPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(providerId) => {
          const result = archAddServiceFromCatalog(providerId)
          if (!result.ok) {
            setFeedback({ tone: 'error', message: result.reason })
          } else {
            setFeedback({ tone: 'success', message: 'Service added from catalog.' })
            onSelectPage?.()
          }
        }}
      />
    </>
  )
}
