'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type HubSection =
  | 'architecture' | 'wireframes' | 'design'
  | 'components'   | 'theming'    | 'preview'

interface SessionState {
  dismissedSpotlights: string[]
  sectionsEntered: HubSection[]
  hintsEnabled: boolean
  firstLaunchAt: string | null
  dismissSpotlight(id: string): void
  dismissTourForSection(section: HubSection): void
  resetAllSpotlights(): void
  markSectionEntered(section: HubSection): void
  setHintsEnabled(v: boolean): void
  markFirstLaunch(): void
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      dismissedSpotlights: [],
      sectionsEntered: [],
      hintsEnabled: true,
      firstLaunchAt: null,
      dismissSpotlight: (id) =>
        set((s) => ({ dismissedSpotlights: [...new Set([...s.dismissedSpotlights, id])] })),
      dismissTourForSection: (section) => {
        const ids = SECTION_SPOT_IDS[section] ?? []
        set((s) => ({ dismissedSpotlights: [...new Set([...s.dismissedSpotlights, ...ids])] }))
      },
      resetAllSpotlights: () => set({ dismissedSpotlights: [], sectionsEntered: [], hintsEnabled: true, firstLaunchAt: null }),
      markSectionEntered: (s) =>
        set((st) => ({ sectionsEntered: [...new Set([...st.sectionsEntered, s])] })),
      setHintsEnabled: (v) => set({ hintsEnabled: v }),
      markFirstLaunch: () => {
        if (!get().firstLaunchAt) set({ firstLaunchAt: new Date().toISOString() })
      },
    }),
    { name: 'nezam-dh-session', version: 1 },
  ),
)

export const SECTION_SPOT_IDS: Record<HubSection, string[]> = {
  architecture: ['arch-left-panel', 'arch-canvas', 'arch-profiles', 'arch-right-rail'],
  wireframes:   ['wf-page-tree', 'wf-palette', 'wf-lock-button'],
  design:       ['ds-token-nav', 'ds-color-editor', 'ds-export'],
  components:   ['comp-tabs', 'comp-copy'],
  theming:      ['theme-presets', 'theme-preview'],
  preview:      ['preview-devices', 'preview-export'],
}
