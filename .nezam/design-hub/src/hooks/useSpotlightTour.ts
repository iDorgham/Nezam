'use client'
import { useEffect } from 'react'
import { useSession, type HubSection } from '@/store/session.store'
import { SPOTLIGHT_TOURS } from '@/config/spotlight-tours.config'

interface SpotlightTourState {
  activeSpotId: string | null
  activeStep: number      // 1-based
  totalSteps: number
  advance(): void
  skipTour(): void
}

export function useSpotlightTour(section: HubSection): SpotlightTourState {
  const dismissedSpotlights = useSession((s) => s.dismissedSpotlights)
  const hintsEnabled = useSession((s) => s.hintsEnabled)
  const markSectionEntered = useSession((s) => s.markSectionEntered)
  const dismissSpotlight = useSession((s) => s.dismissSpotlight)
  const dismissTourForSection = useSession((s) => s.dismissTourForSection)

  useEffect(() => {
    markSectionEntered(section)
  }, [section, markSectionEntered])

  const steps = SPOTLIGHT_TOURS[section] ?? []
  const totalSteps = steps.length

  if (!hintsEnabled || totalSteps === 0) {
    return { activeSpotId: null, activeStep: 0, totalSteps, advance: () => {}, skipTour: () => {} }
  }

  const activeIndex = steps.findIndex((step) => !dismissedSpotlights.includes(step.id))

  if (activeIndex === -1) {
    return { activeSpotId: null, activeStep: totalSteps, totalSteps, advance: () => {}, skipTour: () => {} }
  }

  const activeSpotId = steps[activeIndex].id
  const activeStep = activeIndex + 1

  function advance() {
    dismissSpotlight(activeSpotId)
  }

  function skipTour() {
    dismissTourForSection(section)
  }

  return { activeSpotId, activeStep, totalSteps, advance, skipTour }
}
