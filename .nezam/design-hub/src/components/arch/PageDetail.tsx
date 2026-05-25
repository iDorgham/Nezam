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

export function PageDetail({ onClose }: Props) {
  const selectedId     = useHub((s) => s.arch.selectedPageId)
  const pages          = useHub((s) => s.arch.pages)
  const archUpdatePage = useHub((s) => s.archUpdatePage)
  const archDeletePage = useHub((s) => s.archDeletePage)

  const page = selectedId ? pages[selectedId] : null
  if (!page) return null

  const parentPage = page.parentId ? pages[page.parentId] : null

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

        {/* Parent */}
        {parentPage && (
          <div>
            <p className="text-[11px] text-app-muted font-medium uppercase tracking-wide mb-1">Parent</p>
            <div className="flex items-center gap-1.5 h-7 px-2.5 rounded-app-sm bg-app-inset border border-app-border text-xs text-app-muted">
              <IconRenderer name={parentPage.icon} size={12} />
              <span>{parentPage.name}</span>
              <span className="ml-1 font-mono text-[10px]">{parentPage.route}</span>
            </div>
          </div>
        )}

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
