'use client'

import { useHub } from '@/store/hub.store'

/** Global RTL preview flag (stored on `preview.rtl`). */
export function useRTL() {
  const rtl = useHub((s) => s.preview.rtl)
  const setRtl = useHub((s) => s.previewSetRtl)
  return { rtl, setRtl }
}
