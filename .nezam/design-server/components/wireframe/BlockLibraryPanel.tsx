'use client'

import React, { useState } from 'react'
import { BlockDefinition } from '@/lib/blocks/registry'
import { Plus } from 'lucide-react'

interface BlockLibraryPanelProps {
  availableBlocks: BlockDefinition[]
  onAddBlock: (type: string, name: string) => void
  canvasMode: string
}

export default function BlockLibraryPanel({ availableBlocks, onAddBlock, canvasMode }: BlockLibraryPanelProps) {
  const [search, setSearch] = useState('')

  const filteredBlocks = availableBlocks.filter(block =>
    (block.name.toLowerCase().includes(search.toLowerCase()) ||
     block.type.toLowerCase().includes(search.toLowerCase())) &&
    block.canvas_modes.includes(canvasMode)
  )

  return (
    <div className="bg-ds-surface border border-ds-border rounded-lg p-4 h-full flex flex-col">
      <h2 className="text-lg font-medium text-ds-text-primary mb-4">Block Library</h2>
      
      <input
        type="text"
        placeholder="Search blocks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-ds-background border border-ds-border rounded px-3 py-2 text-ds-text-primary focus:border-[#FF5701] focus:outline-none mb-4"
      />
      
      <div className="flex-1 overflow-auto space-y-2">
        {filteredBlocks.map((block) => (
          <div
            key={block.type}
            className="p-3 bg-ds-background border border-ds-border rounded-lg hover:border-[#FF5701] transition-colors group flex justify-between items-center cursor-pointer"
            onClick={() => onAddBlock(block.type, block.name)}
          >
            <div>
              <div className="text-sm font-medium text-white">{block.name}</div>
              <div className="text-xs text-[#8a8f98] font-mono">{block.type}</div>
            </div>
            <button className="text-[#8a8f98] group-hover:text-white transition-colors">
              <Plus size={16} />
            </button>
          </div>
        ))}
        
        {filteredBlocks.length === 0 && (
          <div className="text-center py-4 text-[#8a8f98] text-sm">
            No blocks found.
          </div>
        )}
      </div>
    </div>
  )
}
