'use client'

import { STATUS_LABELS, STATUS_COLORS, type ComponentStatus } from '@/data/components-library'

interface StatusBadgeProps {
  status: ComponentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'stable') return null   // stable = no badge per Atlassian pattern

  return (
    <span
      className={`
        inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border leading-none
        ${STATUS_COLORS[status]}
      `}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
