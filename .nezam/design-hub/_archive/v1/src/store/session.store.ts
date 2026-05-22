import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { LangSchema, SyncStatusSchema, TabSchema } from '../types/tokens.types'
import type { Lang, SyncStatus, Tab } from '../types/tokens.types'

// ── Schema ────────────────────────────────────────────────────────────────────

const SessionStateSchema = z.object({
  lang:        LangSchema.default('en'),
  rtlMode:     z.boolean().default(false),
  activeTab:   TabSchema.default('tokens'),
  syncStatus:  SyncStatusSchema.default('idle'),
  syncMessage: z.string().nullable().default(null),
})

type SessionState = z.infer<typeof SessionStateSchema>

// ── Actions ───────────────────────────────────────────────────────────────────

interface SessionActions {
  setLang: (lang: Lang) => void
  setActiveTab: (tab: Tab) => void
  setSyncStatus: (status: SyncStatus, message?: string) => void
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultSession: SessionState = {
  lang:        'en',
  rtlMode:     false,
  activeTab:   'tokens',
  syncStatus:  'idle',
  syncMessage: null,
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      ...defaultSession,

      setLang: (lang) => {
        const rtlMode = lang === 'ar'

        // Mutate document dir synchronously — keeps RTL layout in lock-step with state
        if (typeof document !== 'undefined') {
          document.documentElement.dir = rtlMode ? 'rtl' : 'ltr'
          document.documentElement.lang = lang
        }

        set({ lang, rtlMode })
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      setSyncStatus: (status, message?) =>
        set({ syncStatus: status, syncMessage: message ?? null }),
    }),
    {
      name: 'nezam-ds:session',
      partialize: (state) => ({
        lang:      state.lang,
        rtlMode:   state.rtlMode,
        activeTab: state.activeTab,
      }),
      merge: (persisted, current) => {
        try {
          const validated = SessionStateSchema.partial().parse(persisted)
          return { ...current, ...validated }
        } catch {
          return { ...current, ...defaultSession }
        }
      },
      onRehydrateStorage: () => (state) => {
        // Re-apply dir/lang on hydration so SSR→CSR transition is consistent
        if (state && typeof document !== 'undefined') {
          document.documentElement.dir = state.rtlMode ? 'rtl' : 'ltr'
          document.documentElement.lang = state.lang
        }
      },
    }
  )
)

export type { Lang, SyncStatus, Tab }
