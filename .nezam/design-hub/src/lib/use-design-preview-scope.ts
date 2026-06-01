'use client'

import { useMemo } from 'react'
import type { CSSProperties } from 'react'

import { mergePreviewScopeVars } from '@/lib/preview-scope-vars'
import { useHub } from '@/store/hub.store'

/** Scoped CSS vars from the active design profile (+ optional theme preview override). */
export function useDesignPreviewScopeStyle(options?: {
  fillHeight?: boolean
  /** Wireframes editor: previews follow hub light/dark toggle, not profile-only light surfaces. */
  matchHubChrome?: boolean
}): CSSProperties {
  const tokens = useHub((s) => s.design.tokens)
  const previewOverride = useHub((s) => s.theme.previewOverride)
  const hubTheme = useHub((s) => s.hubTheme)
  const fillHeight = options?.fillHeight !== false
  const matchHubChrome = options?.matchHubChrome === true

  return useMemo(
    () =>
      mergePreviewScopeVars(tokens, previewOverride, {
        fillHeight,
        matchHubChrome,
        hubTheme,
      }),
    [tokens, previewOverride, fillHeight, matchHubChrome, hubTheme],
  )
}
