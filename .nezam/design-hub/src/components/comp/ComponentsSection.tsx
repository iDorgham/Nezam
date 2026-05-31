'use client'

import { useMemo } from 'react'
import { useHub } from '@/store/hub.store'
import { ComponentsSidebar } from './ComponentsSidebar'
import { ComponentsCategoryTabs } from './ComponentsCategoryTabs'
import { ComponentsGridControls } from './ComponentsGridControls'
import { ComponentCard } from './ComponentCard'
import { LeftPanelTitleRow } from '@/components/ui/LeftPanelHeader'
import { DESIGN_PROFILES_MAP } from '@/data/design-profiles'
import {
  GROUP_LABELS,
  GROUP_ORDER,
  filterComponents,
  type ComponentGroup,
} from '@/data/components-library'

export function ComponentsSection() {
  const activeProfileId = useHub((s) => s.design.activeProfileId)
  const selectedGroup = useHub((s) => s.comp.selectedGroup)
  const query = useHub((s) => s.comp.query)
  const gridColumns = useHub((s) => s.comp.gridColumns)
  const cardScale = useHub((s) => s.comp.cardScale)
  const compSetGroup = useHub((s) => s.compSetGroup)

  const filtered = filterComponents(query, selectedGroup)

  const searchFiltered = useMemo(
    () => filterComponents(query, null),
    [query],
  )

  const visibleTabGroups = useMemo(
    () => GROUP_ORDER.filter((g) => searchFiltered.some((c) => c.group === g)),
    [searchFiltered],
  )

  const filteredGroupCounts = useMemo(() => {
    const counts = {} as Record<ComponentGroup, number>
    for (const group of GROUP_ORDER) {
      counts[group] = searchFiltered.filter((c) => c.group === group).length
    }
    return counts
  }, [searchFiltered])

  const groupsToShow: ComponentGroup[] = selectedGroup
    ? [selectedGroup]
    : GROUP_ORDER.filter((g) => filtered.some((c) => c.group === g))

  const activeProfile = activeProfileId ? DESIGN_PROFILES_MAP[activeProfileId] : null

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-1 overflow-hidden">
      <ComponentsSidebar />

      <main className="flex min-w-0 w-full flex-1 flex-col overflow-hidden">
        <LeftPanelTitleRow
          title="Components library"
          className="min-h-11 h-auto gap-3 border-b border-app-border bg-app-surface px-4 py-2 backdrop-blur-md"
          rightSlot={<ComponentsGridControls compact />}
        />
        <div className="min-w-0 w-full flex-1 overflow-y-auto app-scroll">
          {/* Banner */}
          <div className="mx-6 mt-6 mb-4 rounded-app-lg border border-app-border bg-app-surface p-4">
            <p className="text-sm font-semibold text-app-text mb-1">Components Library</p>
            <p className="text-xs text-app-subtle leading-relaxed max-w-2xl">
              Reusable building blocks for crafting consistent user interfaces.
              Each component is built on design tokens and follows accessibility best practices.
              {' '}Previews use your{' '}
              {activeProfile ? (
                <span className="font-medium text-app-text">
                  {activeProfile.emoji} {activeProfile.name}
                </span>
              ) : (
                <span className="font-medium text-app-text">active design profile</span>
              )}
              {' '}— change it under Design → Profiles or during onboarding.
            </p>
          </div>

          {searchFiltered.length > 0 && (
            <div className="sticky top-0 z-10 mx-6 mb-4 border-b border-app-border bg-app-bg/95 py-3 backdrop-blur-sm">
              <ComponentsCategoryTabs
                selectedGroup={selectedGroup}
                visibleGroups={visibleTabGroups}
                groupCounts={filteredGroupCounts}
                onSelect={compSetGroup}
              />
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6" role="status" aria-live="polite">
              <p className="text-sm font-medium text-app-text mb-1">No components found</p>
              <p className="text-xs text-app-subtle">
                Try a different search term or select a different group.
              </p>
            </div>
          )}

          {/* Component groups */}
          {filtered.length > 0 && (
            <div
              id="components-panel"
              role="tabpanel"
              aria-labelledby={selectedGroup ? `components-tab-${selectedGroup}` : 'components-tab-all'}
              className="flex w-full min-w-0 flex-col gap-8 px-4 pb-10 sm:px-6"
            >
              {groupsToShow.map((group) => {
                const items = filtered.filter((c) => c.group === group)
                if (items.length === 0) return null

                return (
                  <section key={group} className="w-full min-w-0">
                    {selectedGroup === null && (
                      <div className="flex items-baseline gap-2 mb-4">
                        <h2 className="text-sm font-semibold text-app-text">
                          {GROUP_LABELS[group]}
                        </h2>
                        <span className="text-[11px] text-app-muted">
                          {items.length} component{items.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex-1 h-px bg-app-border ml-1" />
                      </div>
                    )}
                    <div
                      className="grid w-full min-w-0 gap-4"
                      style={{
                        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
                      }}
                    >
                      {items.map((component) => (
                        <ComponentCard
                          key={component.id}
                          component={component}
                          scale={cardScale}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
