'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useHub } from '@/store/hub.store'
import { TopBar } from './TopBar'
import { PageTabsBar } from './PageTabsBar'
import { ResizeHandle } from './ResizeHandle'
import { ModeSwitcher } from './ModeSwitcher'
import { StructureViewport } from '@/components/canvas/StructureViewport'
import { PreviewCanvas } from '@/components/canvas/PreviewCanvas'
import { RightBuilder } from '@/components/builder/RightBuilder'
import { AnimationTimeline } from '@/components/timeline/AnimationTimeline'
import type { Tool } from '@/types'

// Lazy-load the token grid — it imports colour math and heavy DOM trees.
const DesignSystemViewport = dynamic(
  () =>
    import('@/components/canvas/DesignSystemViewport').then((m) => ({
      default: m.DesignSystemViewport,
    })),
  { ssr: false },
)

const TOOL_KEYS: Record<string, Tool> = {
  v: 'select',
  h: 'hand',
  a: 'ai',
  t: 'text',
  i: 'image',
  c: 'icon',
  s: 'section',
}

/** The three-panel design workspace shell. */
export function DesignHub() {
  const rightW      = useHub((s) => s.rightW)
  const setRightW   = useHub((s) => s.setRightW)
  const hubMode     = useHub((s) => s.hubMode)
  const builderMode = useHub((s) => s.builderMode)
  const undo        = useHub((s) => s.undo)
  const redo        = useHub((s) => s.redo)
  const setTool     = useHub((s) => s.setTool)

  const isBuilder     = hubMode === 'BUILDER'
  const timelineOpen  = isBuilder && builderMode === 'interactions'

  // Rehydrate persisted state from localStorage after mount.
  useEffect(() => {
    useHub.persist.rehydrate()
  }, [])

  // Global keyboard shortcuts — history + tool selection (only in BUILDER mode).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, [contenteditable="true"]')) return
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        e.shiftKey ? redo() : undo()
        return
      }
      if (!mod && isBuilder) {
        const tool = TOOL_KEYS[e.key.toLowerCase()]
        if (tool) {
          e.preventDefault()
          setTool(tool)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, setTool, isBuilder])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-app-bg">
      <TopBar />

      <div className="flex min-h-0 flex-1">
        {/* Left: mode switcher (always) */}
        <ModeSwitcher />

        {/* Center column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Page tabs bar — BUILDER only */}
          {isBuilder && <PageTabsBar />}

          <main className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">
              {hubMode === 'STRUCTURE'     && <StructureViewport />}
              {hubMode === 'DESIGN_SYSTEM' && <DesignSystemViewport />}
              {hubMode === 'BUILDER'       && <PreviewCanvas />}
            </div>

            {/* Animation timeline — BUILDER only */}
            {isBuilder && (
              <div
                className="shrink-0 overflow-hidden border-t border-app-border bg-app-surface transition-[height] duration-300 ease-smooth"
                style={{ height: timelineOpen ? 256 : 0 }}
              >
                <AnimationTimeline />
              </div>
            )}
          </main>
        </div>

        {/* Right builder — BUILDER mode only */}
        {isBuilder && (
          <>
            <ResizeHandle edge="right" value={rightW} onChange={setRightW} />
            <aside
              style={{ width: rightW }}
              className="shrink-0 overflow-hidden border-l border-app-border bg-app-surface"
            >
              <RightBuilder />
            </aside>
          </>
        )}
      </div>
    </div>
  )
}
