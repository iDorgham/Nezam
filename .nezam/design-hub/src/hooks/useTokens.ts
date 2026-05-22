'use client'

import { useMemo } from 'react'
import { useHub } from '@/store/hub.store'
import { PROFILES } from '@/data/profiles'
import { resolveTokens, tokensToCssVars } from '@/lib/tokens'
import type { ResolvedTokens } from '@/types'

/** Reactively resolve the active design tokens for the current theme. */
export function useTokens(): ResolvedTokens {
  const profileId = useHub((s) => s.profileId)
  const overrides = useHub((s) => s.overrides)
  const theme = useHub((s) => s.theme)
  const generated = useHub((s) => s.generated)

  return useMemo(() => {
    const profile =
      PROFILES.find((p) => p.id === profileId) ||
      generated.find((p) => p.id === profileId) ||
      PROFILES[0]
    return resolveTokens(profile, theme, overrides)
  }, [profileId, overrides, theme, generated])
}

/** Resolved tokens as a ready-to-spread CSS-variable style object. */
export function useTokenVars(): Record<string, string> {
  const tokens = useTokens()
  return useMemo(() => tokensToCssVars(tokens), [tokens])
}
