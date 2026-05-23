'use client'

import { useEffect } from 'react'
import { useHub } from '@/store/hub.store'
import { TopBar } from './TopBar'
import { PageTabsBar } from './PageTabsBar'
import { ResizeHandle } from './ResizeHandle'
import { LeftToolbar } from './LeftToolbar'
import { PreviewCanvas } from '@/components/canvas/PreviewCanvas'
import { CanvasWorkspace } from '@/components/canvas/CanvasWorkspace'
import { RightBuilder } from '@/components/builder/RightBuilder'
import { AnimationTimeline } from '@/components/timeline/AnimationTimeline'
import type { Tool } from '@/types'

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
  const rightW = useHub((s) => s.rightW)
  const setRightW = useHub((s) => s.setRightW)
  const builderMode = useHub((s) => s.builderMode)
  const undo = useHub((s) => s.undo)
  const redo = useHub((s) => s.redo)
  const setTool = useHub((s) => s.setTool)

  const timelineOpen = builderMode === 'interactions'

  // Rehydrate persisted state from localStorage after mount.
  // skipHydration:true in the store means SSR renders the default state,
  // avoiding a server/client text mismatch on profile name and other
  // localStorage-dependent values.
  useEffect(() => {
    useHub.persist.rehydrate()
  }, [])

  // Global keyboard shortcuts — history + tool selection.
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
      if (!mod) {
        const tool = TOOL_KEYS[e.key.toLowerCase()]
        if (tool) {
          e.preventDefault()
          setTool(tool)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, setTool])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-app-bg">
      <TopBar />
      <PageTabsBar />

      <div className="flex min-h-0 flex-1">
        {/* Left tool rail */}
        <LeftToolbar />

        {/* Center */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            {builderMode === 'sitemap' ? <CanvasWorkspace /> : <PreviewCanvas />}
          </div>
          <div
            className="shrink-0 overflow-hidden border-t border-app-border bg-app-surface transition-[height] duration-300 ease-smooth"
            style={{ height: timelineOpen ? 256 : 0 }}
          >
            <AnimationTimeline />
          </div>
        </main>

        {/* Right builder */}
        <ResizeHandle edge="right" value={rightW} onChange={setRightW} />
        <aside
          style={{ width: rightW }}
          className="shrink-0 overflow-hidden border-l border-app-border bg-app-surface"
        >
          <RightBuilder />
        </aside>
      </div>
    </div>
  )
}
