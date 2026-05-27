'use client'

import { useHub } from '@/store/hub.store'
import { ComponentsSidebar } from './ComponentsSidebar'
import { ComponentCard } from './ComponentCard'
import { PreviewSubTabs } from '@/components/preview/PreviewSubTabs'
import {
  GROUP_LABELS,
  GROUP_ORDER,
  filterComponents,
  type ComponentGroup,
} from '@/data/components-library'

export function ComponentsSection() {
  const selectedGroup = useHub((s) => s.comp.selectedGroup)
  const query         = useHub((s) => s.comp.query)

  const filtered = filterComponents(query, selectedGroup)

  // Group the filtered results for section display
  const groupsToShow: ComponentGroup[] = selectedGroup
    ? [selectedGroup]
    : GROUP_ORDER.filter((g) => filtered.some((c) => c.group === g))

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <ComponentsSidebar />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <PreviewSubTabs />
        <div className="flex-1 overflow-y-auto app-scroll">
          {/* Banner */}
          <div className="mx-6 mt-6 mb-4 rounded-app-lg border border-app-border bg-app-surface p-4">
            <p className="text-sm font-semibold text-app-text mb-1">Components Library</p>
            <p className="text-xs text-app-subtle leading-relaxed max-w-2xl">
              Reusable building blocks for crafting consistent user interfaces.
              Each component is built on design tokens and follows accessibility best practices.
              {' '}Previews respond live to the active design profile.
            </p>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <p className="text-sm font-medium text-app-text mb-1">No components found</p>
              <p className="text-xs text-app-subtle">
                Try a different search term or select a different group.
              </p>
            </div>
          )}

          {/* Component groups */}
          <div className="px-6 pb-10 flex flex-col gap-8">
            {groupsToShow.map((group) => {
              const items = filtered.filter((c) => c.group === group)
              if (items.length === 0) return null

              return (
                <section key={group}>
                  <div className="flex items-baseline gap-2 mb-4">
                    <h2 className="text-sm font-semibold text-app-text">
                      {GROUP_LABELS[group]}
                    </h2>
                    <span className="text-[11px] text-app-muted">
                      {items.length} component{items.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex-1 h-px bg-app-border ml-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 xl:grid-cols-4">
                    {items.map((component) => (
                      <ComponentCard key={component.id} component={component} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
