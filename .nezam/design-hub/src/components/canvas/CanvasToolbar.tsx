'use client'

import { Smartphone, Tablet, Monitor, Sun, Moon, Minus, Plus, Languages } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { Segmented } from '@/components/ui/Segmented'
import { IconButton } from '@/components/ui/IconButton'
import type { Device } from '@/types'

/** Floating canvas controls: device, theme, direction, zoom. */
export function CanvasToolbar() {
  const device = useHub((s) => s.device)
  const setDevice = useHub((s) => s.setDevice)
  const theme = useHub((s) => s.theme)
  const toggleTheme = useHub((s) => s.toggleTheme)
  const dir = useHub((s) => s.dir)
  const toggleDir = useHub((s) => s.toggleDir)
  const zoom = useHub((s) => s.zoom)
  const setZoom = useHub((s) => s.setZoom)

  return (
    <div className="flex items-center gap-2 rounded-app-lg border border-app-border bg-app-surface/95 p-1.5 shadow-app-lg backdrop-blur">
      <Segmented<Device>
        value={device}
        onChange={setDevice}
        options={[
          { value: 'mobile', label: <Smartphone size={14} />, tooltip: 'Mobile · 390px' },
          { value: 'tablet', label: <Tablet size={14} />, tooltip: 'Tablet · 834px' },
          { value: 'desktop', label: <Monitor size={14} />, tooltip: 'Desktop · 1280px' },
        ]}
      />

      <div className="h-5 w-px bg-app-border" />

      <IconButton
        label={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
        size="sm"
        onClick={toggleTheme}
      >
        {theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
      </IconButton>

      <IconButton
        label={dir === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
        size="sm"
        active={dir === 'rtl'}
        onClick={toggleDir}
      >
        <Languages size={15} />
      </IconButton>

      <div className="h-5 w-px bg-app-border" />

      <div className="flex items-center gap-0.5">
        <IconButton label="Zoom out" size="sm" onClick={() => setZoom(zoom - 0.1)}>
          <Minus size={14} />
        </IconButton>
        <button
          onClick={() => setZoom(1)}
          className="focus-ring h-7 w-12 rounded-app-sm text-center font-mono text-[11px] text-app-muted hover:bg-app-elevated hover:text-app-text"
        >
          {Math.round(zoom * 100)}%
        </button>
        <IconButton label="Zoom in" size="sm" onClick={() => setZoom(zoom + 0.1)}>
          <Plus size={14} />
        </IconButton>
      </div>
    </div>
  )
}
