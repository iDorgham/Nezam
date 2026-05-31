'use client'

import { useEffect, useState } from 'react'
import { useHub, type HubSection } from '@/store/hub.store'
import { HUB_SECTION_SHORTCUTS, isEditableTarget } from '@/lib/design-hub/keyboard'

const SECTION_BY_INDEX = Object.fromEntries(
  HUB_SECTION_SHORTCUTS.map((s) => [s.index, s.id]),
) as Record<number, HubSection>

export function useDesignHubShortcuts() {
  const setSection = useHub((s) => s.setSection)
  const setExportModalOpen = useHub((s) => s.setExportModalOpen)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target)) return

      const mod = e.metaKey || e.ctrlKey

      if (e.key === '?' && !mod && !e.altKey) {
        e.preventDefault()
        setShortcutsOpen(true)
        return
      }

      if (mod && !e.altKey && !e.shiftKey) {
        const index = Number.parseInt(e.key, 10)
        if (index >= 1 && index <= 6 && SECTION_BY_INDEX[index]) {
          e.preventDefault()
          setSection(SECTION_BY_INDEX[index])
          return
        }
        if (e.key.toLowerCase() === 'e') {
          e.preventDefault()
          setExportModalOpen(true)
          return
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setSection, setExportModalOpen])

  return { shortcutsOpen, setShortcutsOpen }
}
