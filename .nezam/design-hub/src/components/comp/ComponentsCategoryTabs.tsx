'use client'

import { useCallback, useRef } from 'react'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import {
  GROUP_ICONS,
  GROUP_LABELS,
  GROUP_ORDER,
  type ComponentGroup,
} from '@/data/components-library'
import { PREMIUM_MOTION, PREMIUM_SPACE, PREMIUM_TYPE } from '@/lib/design/premium-standards'

type Props = {
  selectedGroup: ComponentGroup | null
  /** Groups that have at least one visible component after search. */
  visibleGroups: ComponentGroup[]
  /** Count per group for badge display (respects search). */
  groupCounts: Record<ComponentGroup, number>
  onSelect: (group: ComponentGroup | null) => void
}

export function ComponentsCategoryTabs({
  selectedGroup,
  visibleGroups,
  groupCounts,
  onSelect,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const tabs: (ComponentGroup | null)[] = [null, ...visibleGroups]
      const idx = tabs.indexOf(selectedGroup)
      if (idx < 0) return

      let next = idx
      if (e.key === 'ArrowRight') next = Math.min(idx + 1, tabs.length - 1)
      else if (e.key === 'ArrowLeft') next = Math.max(idx - 1, 0)
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = tabs.length - 1
      else return

      e.preventDefault()
      onSelect(tabs[next] ?? null)
      const btn = listRef.current?.querySelector<HTMLButtonElement>(
        `[data-group-tab="${tabs[next] ?? 'all'}"]`,
      )
      btn?.focus()
    },
    [onSelect, selectedGroup, visibleGroups],
  )

  const allCount = visibleGroups.reduce((sum, g) => sum + (groupCounts[g] ?? 0), 0)

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Component categories"
      onKeyDown={onKeyDown}
      className="flex gap-1 overflow-x-auto app-scroll pb-0.5 -mb-0.5"
    >
      <CategoryTab
        id="components-tab-all"
        panelId="components-panel"
        dataKey="all"
        label="All"
        iconName="Grid3x3"
        count={allCount}
        active={selectedGroup === null}
        onClick={() => onSelect(null)}
      />
      {GROUP_ORDER.filter((g) => visibleGroups.includes(g)).map((group) => (
        <CategoryTab
          key={group}
          id={`components-tab-${group}`}
          panelId="components-panel"
          dataKey={group}
          label={GROUP_LABELS[group]}
          iconName={GROUP_ICONS[group] ?? 'Box'}
          count={groupCounts[group] ?? 0}
          active={selectedGroup === group}
          onClick={() => onSelect(group)}
        />
      ))}
    </div>
  )
}

function CategoryTab({
  id,
  panelId,
  dataKey,
  label,
  iconName,
  count,
  active,
  onClick,
}: {
  id: string
  panelId: string
  dataKey: string
  label: string
  iconName: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      data-group-tab={dataKey}
      aria-controls={panelId}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      style={{
        height: PREMIUM_SPACE.tabHeight,
        fontSize: '11px',
        fontWeight: PREMIUM_TYPE.rowWeight,
        transitionDuration: PREMIUM_MOTION.durationFast,
        transitionTimingFunction: PREMIUM_MOTION.easingStandard,
      }}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-app-sm px-3 transition-colors motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
        active
          ? 'bg-app-surface text-app-text border border-app-border shadow-sm'
          : 'text-app-subtle hover:text-app-muted hover:bg-app-elevated/50 border border-transparent',
      )}
    >
      <IconRenderer
        name={iconName}
        size={13}
        className={cn('shrink-0', active && 'text-app-accent')}
      />
      <span className="whitespace-nowrap">{label}</span>
      <span
        className={cn(
          'min-w-[1.25rem] rounded-app-xs px-1 py-px text-center text-[9px] font-mono tabular-nums',
          active ? 'bg-app-accent/15 text-app-accent' : 'bg-app-elevated text-app-subtle',
        )}
      >
        {count}
      </span>
    </button>
  )
}
