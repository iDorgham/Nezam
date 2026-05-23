'use client'

import { useEffect, useRef } from 'react'
import { useHub } from '@/store/hub.store'
import { useTokenVars } from '@/hooks/useTokens'
import { ensureGsap, prefersReducedMotion } from '@/lib/gsap'
import { PreviewScene } from './PreviewScene'
import { CommentLayer } from './CommentLayer'
import type { BlockKind, Tool } from '@/types'

const ADD_TOOLS: Tool[] = ['text', 'paragraph', 'image', 'icon', 'section']

/** Full-browser-width live preview of the active page design. */
export function PreviewCanvas() {
  const dir = useHub((s) => s.dir)
  const theme = useHub((s) => s.theme)
  const pulse = useHub((s) => s.pulse)
  const selection = useHub((s) => s.selection)
  const select = useHub((s) => s.select)
  const tool = useHub((s) => s.activeTool)
  const addBlock = useHub((s) => s.addBlock)
  const setTool = useHub((s) => s.setTool)
  const vars = useTokenVars()

  const containerRef = useRef<HTMLDivElement>(null)
  const scopeRef = useRef<HTMLDivElement>(null)

  const isAddTool = ADD_TOOLS.includes(tool)

  // Profile / theme / archetype cross-fade
  useEffect(() => {
    const el = scopeRef.current
    if (!el || prefersReducedMotion()) return
    const gsap = ensureGsap()
    gsap.fromTo(
      el,
      { opacity: 0.4, filter: 'blur(3px)', scale: 0.992 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.45, ease: 'power2.out' },
    )
  }, [pulse])

  const onCanvasClick = () => {
    if (isAddTool) {
      addBlock(tool as BlockKind)
      setTool('select')
    } else {
      select(null)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-y-auto"
      onClick={onCanvasClick}
    >
      <div
        ref={scopeRef}
        className="n-scope min-h-full w-full"
        dir={dir}
        data-theme={theme}
        style={vars as React.CSSProperties}
        onClick={(e) => {
          if (!isAddTool) e.stopPropagation()
        }}
      >
        <PreviewScene />
      </div>
      <CommentLayer containerRef={containerRef} />
    </div>
  )
}
