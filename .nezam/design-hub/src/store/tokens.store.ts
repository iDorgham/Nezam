import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { DesignPresetSchema, DesignTokensSchema } from '../types/tokens.types'
import type { DesignPreset, DesignTokens } from '../types/tokens.types'
import { injectTokens, resetInjectedTokens } from '../lib/token-injection'

// ── Schema ────────────────────────────────────────────────────────────────────

export const SyncStatusSchema = z.enum(['synchronized', 'syncing', 'failed', 'offline'])
export type SyncStatus = z.infer<typeof SyncStatusSchema>

const TokensStateSchema = z.object({
  activePresetId: z.string().nullable().default(null),
  presets:        z.array(DesignPresetSchema).default([]),
  overrides:      DesignTokensSchema.partial().default({}),
  isDirty:        z.boolean().default(false),
  syncStatus:     SyncStatusSchema.default('synchronized'),
  syncError:      z.string().nullable().default(null),
})

type TokensState = z.infer<typeof TokensStateSchema>

// ── Actions ───────────────────────────────────────────────────────────────────

interface TokensActions {
  setToken:        (key: keyof DesignTokens, value: string) => void
  applyPreset:     (preset: DesignPreset) => void
  loadPreset:      (id: string) => boolean
  resetToPreset:   () => void
  loadPresets:     (presets: DesignPreset[]) => void
  savePreset:      (name: string) => DesignPreset
  getActiveTokens: () => Partial<DesignTokens>
  setSyncStatus:   (status: SyncStatus, error?: string | null) => void
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultTokensState: TokensState = {
  activePresetId: null,
  presets:        [],
  overrides:      {},
  isDirty:        false,
  syncStatus:     'synchronized',
  syncError:      null,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mergePresetWithOverrides(
  preset: DesignPreset | undefined,
  overrides: Partial<DesignTokens>
): Partial<DesignTokens> {
  return { ...(preset?.tokens ?? {}), ...overrides }
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useTokenStore = create<TokensState & TokensActions>()(
  persist(
    (set, get) => ({
      ...defaultTokensState,

      setToken: (key, value) => {
        const overrides = { ...get().overrides, [key]: value }
        // Don't trample 'offline' — useSyncStatus owns that transition.
        const nextSync: SyncStatus =
          get().syncStatus === 'offline' ? 'offline' : 'syncing'
        set({ overrides, isDirty: true, syncStatus: nextSync, syncError: null })

        // Hot-reload: inject only the changed token — target < 16ms
        injectTokens({ [key]: value } as Partial<DesignTokens>)
      },

      applyPreset: (preset) => {
        const validated = DesignPresetSchema.parse(preset)
        set({
          activePresetId: validated.id,
          overrides:      {},
          isDirty:        false,
        })

        resetInjectedTokens()
        injectTokens(validated.tokens)
      },

      loadPreset: (id) => {
        const preset = get().presets.find((p) => p.id === id)
        if (!preset) return false
        get().applyPreset(preset)
        return true
      },

      resetToPreset: () => {
        const { activePresetId, presets } = get()
        const preset = presets.find((p) => p.id === activePresetId)

        set({ overrides: {}, isDirty: false })

        resetInjectedTokens()
        if (preset) injectTokens(preset.tokens)
      },

      loadPresets: (presets) => {
        const validated = z.array(DesignPresetSchema).parse(presets)
        const { activePresetId, overrides } = get()
        const activeStillExists =
          activePresetId !== null && validated.some((p) => p.id === activePresetId)

        if (activeStillExists) {
          // Replace array, then re-inject tokens from the fresh active preset
          // (disk may have changed since last hydrate), preserving overrides.
          set({ presets: validated })
          const fresh = validated.find((p) => p.id === activePresetId)
          if (fresh) {
            resetInjectedTokens()
            injectTokens(mergePresetWithOverrides(fresh, overrides))
          }
          return
        }

        // Active preset disappeared (deleted on disk or never matched).
        // Drop active id + overrides and clear injected vars.
        set({ presets: validated, activePresetId: null, overrides: {}, isDirty: false })
        resetInjectedTokens()
      },

      savePreset: (name) => {
        const state = get()
        const activePreset = state.presets.find((p) => p.id === state.activePresetId)
        const mergedTokens = mergePresetWithOverrides(activePreset, state.overrides)
        const now = new Date().toISOString()

        const newPreset: DesignPreset = DesignPresetSchema.parse({
          id:        crypto.randomUUID(),
          name,
          slug:      name.toLowerCase().replace(/\s+/g, '-'),
          isSystem:  false,
          tokens:    mergedTokens,
          createdAt: now,
          updatedAt: now,
        })

        set((s) => ({
          presets:        [...s.presets, newPreset],
          activePresetId: newPreset.id,
          overrides:      {},
          isDirty:        false,
        }))

        return newPreset
      },

      getActiveTokens: () => {
        const { activePresetId, presets, overrides } = get()
        const preset = presets.find((p) => p.id === activePresetId)
        return mergePresetWithOverrides(preset, overrides)
      },

      setSyncStatus: (status, error = null) => {
        set({ syncStatus: status, syncError: status === 'failed' ? error : null })
      },
    }),
    {
      name: 'nezam-ds:tokens',
      partialize: (state) => ({
        activePresetId: state.activePresetId,
        presets:        state.presets,
        overrides:      state.overrides,
      }),
      merge: (persisted, current) => {
        try {
          const validated = TokensStateSchema.partial().parse(persisted)
          return { ...current, ...validated }
        } catch {
          return { ...current, ...defaultTokensState }
        }
      },
      onRehydrateStorage: () => (state) => {
        // Re-inject active tokens on hydration
        if (!state) return
        const preset = state.presets.find((p) => p.id === state.activePresetId)
        const merged = mergePresetWithOverrides(preset, state.overrides ?? {})
        if (Object.keys(merged).length > 0) injectTokens(merged)
      },
    }
  )
)

export type { DesignPreset, DesignTokens }
