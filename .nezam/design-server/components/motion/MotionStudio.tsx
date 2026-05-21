'use client'

import { useCallback } from 'react'
import { useMotionStore } from '@/src/store/motion.store'
import Timeline from './Timeline'
import TrackList from './TrackList'
import ReducedMotionBanner from './ReducedMotionBanner'

// F-006 T-F006-001 — Motion Studio bottom dock shell.
// Collapsible, default expanded height 240px. Header carries the transport
// controls (play / pause / stop) + duration readout. Body is left empty for
// now; T-F006-002 lands the Timeline ruler, T-F006-003 the TrackList, etc.

function formatMs(ms: number): string {
  const seconds = ms / 1000
  return `${seconds.toFixed(2)}s`
}

export default function MotionStudio() {
  const collapsed       = useMotionStore((s) => s.collapsed)
  const heightPx        = useMotionStore((s) => s.heightPx)
  const isPlaying       = useMotionStore((s) => s.isPlaying)
  const currentTimeMs   = useMotionStore((s) => s.currentTimeMs)
  const durationMs      = useMotionStore((s) => s.durationMs)
  const toggleCollapsed = useMotionStore((s) => s.toggleCollapsed)
  const togglePlay      = useMotionStore((s) => s.togglePlay)
  const setCurrentTime  = useMotionStore((s) => s.setCurrentTime)

  const handleStop = useCallback(() => {
    setCurrentTime(0)
    useMotionStore.getState().setIsPlaying(false)
  }, [setCurrentTime])

  return (
    <section
      aria-label="Motion Studio"
      data-collapsed={collapsed || undefined}
      className="border-t border-ds-border bg-ds-surface flex flex-col"
      style={{ height: collapsed ? undefined : heightPx }}
    >
      <header className="flex items-center gap-3 px-3 py-2 border-b border-ds-border bg-ds-surface-elevated">
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-controls="motion-studio-body"
          aria-label={collapsed ? 'Expand Motion Studio' : 'Collapse Motion Studio'}
          className="w-5 h-5 flex items-center justify-center rounded-ds-sm text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover focus:outline-none focus:ring-2 focus:ring-ds-border-focus"
        >
          <span aria-hidden="true" className="text-ds-xs">
            {collapsed ? '▴' : '▾'}
          </span>
        </button>

        <h2 className="text-ds-xs font-semibold uppercase tracking-wider text-ds-text-secondary">
          Motion Studio
        </h2>

        <div className="flex items-center gap-1">
          <TransportButton
            label={isPlaying ? 'Pause' : 'Play'}
            icon={isPlaying ? '❚❚' : '▶'}
            onClick={togglePlay}
            aria-pressed={isPlaying}
            data-state={isPlaying ? 'playing' : 'paused'}
          />
          <TransportButton label="Stop" icon="■" onClick={handleStop} />
        </div>

        <div className="ms-auto flex items-center gap-3 text-ds-xs font-mono text-ds-text-muted">
          <span aria-label="current time">{formatMs(currentTimeMs)}</span>
          <span aria-hidden="true">/</span>
          <span aria-label="duration">{formatMs(durationMs)}</span>
        </div>
      </header>

      {!collapsed && (
        <div
          id="motion-studio-body"
          aria-label="Motion timeline"
          className="flex-1 min-h-0 overflow-hidden flex flex-col"
        >
          <ReducedMotionBanner />
          <div className="flex-1 min-h-0 flex">
            <Timeline>
              <TrackList />
            </Timeline>
          </div>
        </div>
      )}
    </section>
  )
}

interface TransportButtonProps {
  label:    string
  icon:     string
  onClick:  () => void
  'aria-pressed'?: boolean
  'data-state'?:   string
}

function TransportButton({
  label,
  icon,
  onClick,
  'aria-pressed': pressed,
  'data-state':    dataState,
}: TransportButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      data-state={dataState}
      onClick={onClick}
      className="w-6 h-6 flex items-center justify-center rounded-ds-sm border border-ds-border text-ds-xs text-ds-text-secondary hover:bg-ds-surface-hover hover:text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus"
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}

