'use client'

import { X } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconRenderer, PAGE_ICON_NAMES } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { getServiceRoots } from '@/lib/arch/page-tree'
import { BrandIcon } from '@/components/arch/BrandIcon'
import { getCatalogProvider } from '@/lib/arch/service-catalog'
import { NAV_SLOT_LABELS, PAGE_TYPE_LABELS, type ArchPage } from '@/types/arch'

interface Props {
  onClose: () => void
}

function getDescendantIds(pages: Record<string, ArchPage>, id: string): string[] {
  const result: string[] = []
  const stack = [id]
  while (stack.length > 0) {
    const cur = stack.pop()!
    result.push(cur)
    Object.values(pages)
      .filter((p) => p.parentId === cur)
      .forEach((p) => stack.push(p.id))
  }
  return result
}

export function PageDetail({ onClose }: Props) {
  const selectedId     = useHub((s) => s.arch.selectedPageId)
  const pages          = useHub((s) => s.arch.pages)
  const archUpdatePage = useHub((s) => s.archUpdatePage)
  const archDeletePage = useHub((s) => s.archDeletePage)
  const archTogglePageServiceWire = useHub((s) => s.archTogglePageServiceWire)
  const archSelectService = useHub((s) => s.archSelectService)

  const page = selectedId ? pages[selectedId] : null
  if (!page) return null

  const descendants = getDescendantIds(pages, page.id)
  const possibleParents = Object.values(pages).filter((p) => !descendants.includes(p.id))
  const parentOptions = [
    { value: 'none', label: 'None (Root Page)' },
    ...possibleParents.map((p) => ({
      value: p.id,
      label: `${p.name} (${p.route})`,
    })),
  ]

  function update(patch: Parameters<typeof archUpdatePage>[1]) {
    if (selectedId) archUpdatePage(selectedId, patch)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <IconRenderer name={page.icon} size={15} className="text-app-muted shrink-0" />
          <span className="text-xs font-semibold text-app-text truncate max-w-[140px]">{page.name}</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center rounded text-app-subtle hover:text-app-text transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto app-scroll p-4 flex flex-col gap-4">
        {/* Icon picker */}
        <div>
          <p className="text-[11px] text-app-muted font-medium uppercase tracking-wide mb-1.5">Icon</p>
          <div className="flex flex-wrap gap-1">
            {PAGE_ICON_NAMES.map((iconName) => (
              <button
                key={iconName}
                onClick={() => update({ icon: iconName })}
                title={iconName}
                className={[
                  'flex h-7 w-7 items-center justify-center rounded transition-all',
                  page.icon === iconName
                    ? 'bg-app-accent-subtle border border-app-accent text-app-text'
                    : 'hover:bg-app-elevated border border-transparent text-app-muted hover:text-app-text',
                ].join(' ')}
              >
                <IconRenderer name={iconName} size={14} />
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Name"
          value={page.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Display name"
        />

        <Textarea
          label="Description"
          value={page.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Purpose, audience, or constraints…"
          rows={2}
        />

        {page.type === 'app' && (
          <>
            <Input
              label="Domain"
              value={page.domain ?? ''}
              onChange={(e) => update({ domain: e.target.value })}
              placeholder="app.example.com"
            />
            <label className="flex items-center justify-between rounded-app-sm border border-app-border px-2.5 py-2 cursor-pointer">
              <span className="text-[11px] text-app-text">Has authentication</span>
              <input
                type="checkbox"
                checked={page.hasAuth ?? false}
                onChange={(e) => update({ hasAuth: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-app-border"
              />
            </label>
            <Select
              label="Stack"
              value={page.stackKind ?? 'fullstack'}
              onChange={(e) => update({ stackKind: e.target.value as ArchPage['stackKind'] })}
              options={[
                { value: 'frontend', label: 'Frontend' },
                { value: 'backend', label: 'Backend' },
                { value: 'fullstack', label: 'Full stack' },
              ]}
            />
            <Select
              label="Main layout"
              value={page.layout ?? 'standard'}
              onChange={(e) => update({ layout: e.target.value as ArchPage['layout'] })}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'sidebar', label: 'Sidebar' },
                { value: 'blank', label: 'Blank' },
                { value: 'tabs', label: 'Tabs' },
              ]}
            />
            <Select
              label="Layout width"
              value={page.layoutWidth ?? 'boxed'}
              onChange={(e) => update({ layoutWidth: e.target.value as ArchPage['layoutWidth'] })}
              options={[
                { value: 'boxed', label: 'Boxed' },
                { value: 'fullwidth', label: 'Full width' },
              ]}
            />
            <label className="flex items-center justify-between rounded-app-sm border border-app-border px-2.5 py-2 cursor-pointer">
              <span className="text-[11px] text-app-text">AI / LLM integration</span>
              <input
                type="checkbox"
                checked={page.hasAi ?? false}
                onChange={(e) => update({ hasAi: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-app-border"
              />
            </label>
            <label className="flex items-center justify-between rounded-app-sm border border-app-border px-2.5 py-2 cursor-pointer">
              <span className="text-[11px] text-app-text">Billing / payments</span>
              <input
                type="checkbox"
                checked={page.hasBilling ?? false}
                onChange={(e) => update({ hasBilling: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-app-border"
              />
            </label>
            <label className="flex items-center justify-between rounded-app-sm border border-app-border px-2.5 py-2 cursor-pointer">
              <span className="text-[11px] text-app-text">Microservices enabled</span>
              <input
                type="checkbox"
                checked={page.microservicesEnabled ?? true}
                onChange={(e) => update({ microservicesEnabled: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-app-border"
              />
            </label>
          </>
        )}

        {page.type === 'navmenu' && (
          <>
            <Select
              label="Menu placement"
              value={page.menuPlacement ?? 'main'}
              onChange={(e) => update({ menuPlacement: e.target.value as ArchPage['menuPlacement'] })}
              options={[
                { value: 'main', label: 'Main navigation' },
                { value: 'footer', label: 'Footer navigation' },
                { value: 'widget', label: 'Widget / utility' },
              ]}
            />
            <label className="flex items-center justify-between rounded-app-sm border border-app-border px-2.5 py-2 cursor-pointer">
              <span className="text-[11px] text-app-text">Show icons</span>
              <input
                type="checkbox"
                checked={page.menuHasIcons ?? true}
                onChange={(e) => update({ menuHasIcons: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-app-border"
              />
            </label>
            <Select
              label="Presentation"
              value={page.menuPresentation ?? 'dropdown'}
              onChange={(e) =>
                update({ menuPresentation: e.target.value as ArchPage['menuPresentation'] })
              }
              options={[
                { value: 'dropdown', label: 'Dropdown' },
                { value: 'mega', label: 'Mega menu' },
              ]}
            />
          </>
        )}

        {page.type === 'service' && (
          <>
            <Select
              label="Service kind"
              value={page.serviceKind ?? 'api'}
              onChange={(e) => update({ serviceKind: e.target.value as ArchPage['serviceKind'] })}
              options={[
                { value: 'api', label: 'API' },
                { value: 'auth', label: 'Auth' },
                { value: 'payment', label: 'Payment' },
                { value: 'database', label: 'Database' },
              ]}
            />
            <Input
              label="Endpoint (optional)"
              value={page.serviceEndpoint ?? ''}
              onChange={(e) => update({ serviceEndpoint: e.target.value })}
              placeholder="https://api.example.com"
              className="font-mono text-[11px]"
            />
          </>
        )}

        {(page.type === 'page' ||
          page.type === 'subpage' ||
          page.type === 'section') && (
          <>
            <Input
              label="Route / URL"
              value={page.route}
              onChange={(e) => update({ route: e.target.value })}
              placeholder="/your-route"
              className="font-mono"
            />
            {page.type !== 'section' && (
              <Select
                label="Parent"
                value={page.parentId ?? 'none'}
                onChange={(e) => {
                  const val = e.target.value
                  update({ parentId: val === 'none' ? null : val })
                }}
                options={parentOptions}
              />
            )}
            <Select
              label="Navigation slot"
              value={page.navSlot}
              onChange={(e) => update({ navSlot: e.target.value as ArchPage['navSlot'] })}
              options={Object.entries(NAV_SLOT_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            />
            <Select
              label="Page layout"
              value={page.layout ?? 'standard'}
              onChange={(e) => update({ layout: e.target.value as ArchPage['layout'] })}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'sidebar', label: 'Sidebar' },
                { value: 'blank', label: 'Blank' },
                { value: 'tabs', label: 'Tabs' },
              ]}
            />
            <Select
              label="Layout width"
              value={page.layoutWidth ?? 'boxed'}
              onChange={(e) => update({ layoutWidth: e.target.value as ArchPage['layoutWidth'] })}
              options={[
                { value: 'boxed', label: 'Boxed' },
                { value: 'fullwidth', label: 'Full width' },
              ]}
            />
            <div>
              <p className="text-[10px] text-app-muted font-bold uppercase tracking-wider mb-1.5">
                Wire to rack services
              </p>
              <div className="flex flex-col gap-1 rounded-app border border-app-border bg-app-elevated/40 p-2">
                {getServiceRoots(pages).length === 0 ? (
                  <p className="text-[10px] text-app-subtle px-2 py-1">
                    Add services from the rack catalog first.
                  </p>
                ) : (
                  getServiceRoots(pages).map((svc) => {
                    const wired = page.wiredServiceIds ?? []
                    const isChecked = wired.includes(svc.id)
                    const provider = svc.serviceProviderId
                      ? getCatalogProvider(svc.serviceProviderId)
                      : undefined
                    return (
                      <div
                        key={svc.id}
                        className="flex items-center justify-between gap-2 rounded px-2 py-1.5 hover:bg-app-elevated/70"
                      >
                        <label className="flex items-center gap-2 cursor-pointer min-w-0 flex-1">
                          {provider ? (
                            <BrandIcon slug={provider.simpleIconSlug} size={14} />
                          ) : null}
                          <span className="text-[11px] font-medium text-app-text truncate">
                            {svc.name}
                          </span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => archTogglePageServiceWire(page.id, svc.id)}
                            className="h-3.5 w-3.5 rounded border-app-border ml-auto shrink-0"
                          />
                        </label>
                        <button
                          type="button"
                          className="text-[9px] text-app-accent hover:underline shrink-0"
                          onClick={() => archSelectService(svc.id)}
                        >
                          Setup
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-app-border p-3">
        <Button
          variant="danger"
          size="sm"
          className="w-full"
          onClick={() => {
            archDeletePage(page.id)
            onClose()
          }}
        >
          Delete page
        </Button>
      </div>
    </div>
  )
}
