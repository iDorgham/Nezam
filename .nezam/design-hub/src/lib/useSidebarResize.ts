import { useCallback, useRef } from 'react'
import { useHub } from '@/store/hub.store'

export function useSidebarResize() {
  const setWidth = useHub((s) => s.setSidebarWidth)
  const width = useHub((s) => s.sidebarWidth ?? 240)
  const isResizing = useRef(false)

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true

    const doResize = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return
      // Clamp sidebar width between 200px and 450px
      const newWidth = Math.max(200, Math.min(450, moveEvent.clientX))
      setWidth(newWidth)
    }

    const stopResize = () => {
      isResizing.current = false
      window.removeEventListener('mousemove', doResize)
      window.removeEventListener('mouseup', stopResize)
    }

    window.addEventListener('mousemove', doResize)
    window.addEventListener('mouseup', stopResize)
  }, [setWidth])

  return { width, startResize }
}
