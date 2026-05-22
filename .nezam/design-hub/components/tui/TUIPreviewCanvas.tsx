'use client'

import React from 'react'
import { drawTextInBox } from '@/lib/tui/box-drawing'

interface BlockInstance {
  id: string
  type: string
  name: string
  props?: Record<string, any>
}

interface TUIPreviewCanvasProps {
  blocks: BlockInstance[]
}

export default function TUIPreviewCanvas({ blocks }: TUIPreviewCanvasProps) {
  const width = 60 // Fixed width for terminal preview

  const renderedBlocks = blocks.map(block => {
    const propLines = block.props 
      ? Object.entries(block.props).map(([k, v]) => `${k}: ${v}`).join('\n')
      : 'No props'
      
    const text = `[ ${block.name} ]\nType: ${block.type}\n${propLines}`
    return drawTextInBox(text, width)
  })

  return (
    <pre className="whitespace-pre">
      {renderedBlocks.length > 0 ? (
        renderedBlocks.join('\n\n')
      ) : (
        drawTextInBox('No blocks on canvas.\nAdd blocks to see TUI preview.', width)
      )}
    </pre>
  )
}
