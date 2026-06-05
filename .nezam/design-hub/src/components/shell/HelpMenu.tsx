'use client'
import { CircleHelp, RotateCcw, Keyboard, PlayCircle, EyeOff, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useHub } from '@/store/hub.store'
import { useSession, SECTION_SPOT_IDS } from '@/store/session.store'

export function HelpMenu({ onOpenShortcuts }: { onOpenShortcuts(): void }) {
  const section = useHub((s) => s.section)
  const onboardingReset = useHub((s) => s.onboardingReset)
  const hintsEnabled = useSession((s) => s.hintsEnabled)
  const setHintsEnabled = useSession((s) => s.setHintsEnabled)
  const resetAllSpotlights = useSession((s) => s.resetAllSpotlights)

  function handleRestartSetup() {
    onboardingReset()
    resetAllSpotlights()
  }

  function handleReplaySectionTour() {
    const sectionIds = SECTION_SPOT_IDS[section] ?? []
    // Re-enable dismissed spots for this section only by removing them from dismissed list
    const allDismissed = useSession.getState().dismissedSpotlights
    const keepDismissed = allDismissed.filter((id) => !sectionIds.includes(id))
    useSession.setState({ dismissedSpotlights: keepDismissed })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Help menu"
          className="flex items-center justify-center h-6 w-6 rounded-app-sm text-app-subtle hover:text-app-muted hover:bg-app-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent transition-colors"
        >
          <CircleHelp size={12} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={handleRestartSetup}>
          <RotateCcw size={13} className="mr-2" />
          Restart setup
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenShortcuts}>
          <Keyboard size={13} className="mr-2" />
          Keyboard shortcuts
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleReplaySectionTour}>
          <PlayCircle size={13} className="mr-2" />
          Replay this section&apos;s tour
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setHintsEnabled(!hintsEnabled)}>
          {hintsEnabled ? <EyeOff size={13} className="mr-2" /> : <Eye size={13} className="mr-2" />}
          {hintsEnabled ? 'Hide all hints' : 'Show hints'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
