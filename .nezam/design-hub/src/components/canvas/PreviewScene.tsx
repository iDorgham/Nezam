'use client'

import { useHub } from '@/store/hub.store'
import { RenderBlock } from './blocks'

/** The preview composition — renders the active archetype's ordered blocks. */
export function PreviewScene() {
  const blocks = useHub((s) => s.blocks)
  const pageStyle = useHub((s) => s.pageStyle)

  return (
    <div
      data-anim-root
      data-node="page"
      className="mx-auto w-full"
      style={{
        maxWidth: pageStyle.width,
        padding: pageStyle.padding,
        background: pageStyle.bg,
        display: 'grid',
      }}
    >
      {blocks.map((block) => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </div>
  )
}
