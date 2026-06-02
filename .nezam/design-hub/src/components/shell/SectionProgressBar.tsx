'use client'
import { useHub, type HubSection } from '@/store/hub.store'
import { useSession } from '@/store/session.store'
import { cn } from '@/lib/utils'

const SECTIONS: HubSection[] = ['architecture', 'wireframes', 'design', 'components', 'theming', 'preview']

export function SectionProgressBar() {
  const section = useHub((s) => s.section)
  const visitedSections = useHub((s) => s.visitedSections)
  const hintsEnabled = useSession((s) => s.hintsEnabled)

  if (!hintsEnabled) return null

  return (
    <div
      role="progressbar"
      aria-label="Section progress"
      aria-valuenow={visitedSections.length}
      aria-valuemax={6}
      className="flex h-[2px] w-full shrink-0"
    >
      {SECTIONS.map((s) => {
        const isActive = s === section
        const isVisited = visitedSections.includes(s)
        return (
          <div
            key={s}
            className={cn(
              'flex-1 transition-colors duration-200 ease-out',
              isActive ? 'bg-app-accent' : isVisited ? 'bg-white/[0.18]' : 'bg-white/[0.05]',
            )}
          />
        )
      })}
    </div>
  )
}
