'use client'

import { X } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconRenderer, PAGE_ICON_NAMES } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
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

        {/* Name */}
        <Input
          label="Page Name"
          value={page.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Page name"
        />

        {/* Route */}
        <Input
          label="Route / URL"
          value={page.route}
          onChange={(e) => update({ route: e.target.value })}
          placeholder="/your-route"
          className="font-mono"
        />

        {/* Parent Selector */}
        <Select
          label="Parent Page"
          value={page.parentId ?? 'none'}
          onChange={(e) => {
            const val = e.target.value
            update({ parentId: val === 'none' ? null : val })
          }}
          options={parentOptions}
        />

        {/* Type */}
        <Select
          label="Page Type"
          value={page.type}
          onChange={(e) => update({ type: e.target.value as ArchPage['type'] })}
          options={Object.entries(PAGE_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
        />

        {/* Nav slot */}
        <Select
          label="Navigation Slot"
          value={page.navSlot}
          onChange={(e) => update({ navSlot: e.target.value as ArchPage['navSlot'] })}
          options={Object.entries(NAV_SLOT_LABELS).map(([v, l]) => ({ value: v, label: l }))}
        />

        {/* Page Layout */}
        <Select
          label="Page Layout"
          value={page.layout ?? 'standard'}
          onChange={(e) => update({ layout: e.target.value as any })}
          options={[
            { value: 'standard', label: 'Standard (Header + Footer)' },
            { value: 'sidebar', label: 'Sidebar Layout' },
            { value: 'blank', label: 'Blank / Landing Page' },
            { value: 'tabs', label: 'Tabbed Layout' },
          ]}
        />

        {/* Layout Width */}
        <Select
          label="Layout Width"
          value={page.layoutWidth ?? 'boxed'}
          onChange={(e) => update({ layoutWidth: e.target.value as any })}
          options={[
            { value: 'boxed', label: 'Boxed (Max-width container)' },
            { value: 'fullwidth', label: 'Full Width (Fluid edge-to-edge)' },
          ]}
        />


        {/* Backend service bindings checklist */}
        <div>
          <p className="text-[10px] text-app-muted font-bold uppercase tracking-wider mb-1.5">
            Backend Microservices
          </p>
          <div className="flex flex-col gap-1 rounded-lg border border-app-border bg-app-elevated/40 p-2">
            {Object.entries({
              api:      'API Endpoints',
              auth:     'Auth / Security',
              payment:  'Billing / Payments',
              database: 'Database Sync',
            }).map(([kind, label]) => {
              const activeServices = page.services || []
              const isChecked = activeServices.includes(kind as any)
              
              function handleToggle() {
                const next = isChecked
                  ? activeServices.filter((s) => s !== kind)
                  : [...activeServices, kind as any]
                update({ services: next })
              }

              return (
                <label
                  key={kind}
                  className="flex items-center justify-between cursor-pointer rounded px-2 py-1.5 hover:bg-app-elevated/70 transition-colors select-none"
                >
                  <span className="text-[11px] font-medium text-app-text">{label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleToggle}
                    className="h-3.5 w-3.5 rounded border-app-border bg-app-elevated text-app-accent focus:ring-1 focus:ring-app-accent/30 transition-all cursor-pointer"
                  />
                </label>
              )
            })}
          </div>
        </div>

        {/* Description */}
        <Textarea
          label="Description"
          value={page.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Brief description of this page's purpose…"
          rows={3}
        />
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
