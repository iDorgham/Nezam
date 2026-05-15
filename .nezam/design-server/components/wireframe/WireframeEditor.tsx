'use client'

import React, { useState, useEffect } from 'react'
import { BlockDefinition } from '@/lib/blocks/registry'
import WireframeCanvas from './WireframeCanvas'
import BlockLibraryPanel from './BlockLibraryPanel'
import PropsEditorPanel from './PropsEditorPanel'
import AICommandBar from '@/components/ai/AICommandBar'
import { useSessionStore } from '@/lib/store/session.store'

interface WireframeEditorProps {
  pageId: string
  availableBlocks: BlockDefinition[]
}

export default function WireframeEditor({ pageId, availableBlocks }: WireframeEditorProps) {
  const [blocks, setBlocks] = useState<any[]>([])
  const { addLog } = useSessionStore()
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [canvasMode, setCanvasMode] = useState<string>('web')

  useEffect(() => {
    async function fetchBlocks() {
      const res = await fetch(`/api/pages/${pageId}`)
      if (res.ok) {
        const data = await res.json()
        setBlocks(data.blocks || [])
      }
    }
    fetchBlocks()
  }, [pageId])

  const handleSave = async () => {
    const res = await fetch(`/api/pages/${pageId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks })
    })
    if (!res.ok) {
      alert('Failed to save page data')
    }
  }

  const selectedBlock = blocks.find(b => b.id === selectedBlockId)
  const blockDefinition = selectedBlock ? availableBlocks.find(def => def.type === selectedBlock.type) : undefined

  const handleAddBlock = async (type: string, name: string) => {
    const def = availableBlocks.find(d => d.type === type)
    const defaultProps: Record<string, any> = {}
    
    if (def?.props) {
      Object.entries(def.props).forEach(([propName, schema]) => {
        defaultProps[propName] = schema.default
      })
    }

    const newBlock = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      name,
      props: defaultProps
    }
    setBlocks([...blocks, newBlock])
    setSelectedBlockId(newBlock.id)

    try {
      const res = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: `gemini-cli add-block --type "${type}" --page "${pageId}"` })
      })
      if (res.ok) {
        const data = await res.json()
        addLog(data.output)
      }
    } catch (e) {
      console.error('Failed to run silent CLI', e)
    }
  }

  const handleUpdateProps = (id: string, props: Record<string, any>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, props } : b))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-120px)] w-full">
      {/* Left Sidebar: Library */}
      <div className="lg:col-span-1 h-full overflow-hidden">
        <BlockLibraryPanel availableBlocks={availableBlocks} onAddBlock={handleAddBlock} canvasMode={canvasMode} />
      </div>

      {/* Center: Canvas */}
      <div className="lg:col-span-2 h-full overflow-auto bg-ds-background border border-ds-border rounded p-4">
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-sm font-semibold text-ds-text-primary">Wireframe Canvas</h1>
              <div className="text-xs text-[#8a8f98]">Page ID: {pageId}</div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={canvasMode}
                onChange={(e) => setCanvasMode(e.target.value)}
                className="bg-ds-surface border border-ds-border rounded px-2 py-1 text-xs text-ds-text-primary focus:border-[#FF5701] focus:outline-none"
              >
                <option value="web">Web</option>
                <option value="saas">SaaS</option>
                <option value="mobile">Mobile</option>
                <option value="tui">TUI</option>
              </select>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#5e6ad2] text-white rounded text-sm hover:bg-[#7170ff] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <AICommandBar onBlocksGenerated={(newBlocks) => setBlocks([...blocks, ...newBlocks])} />
          </div>
          
          <WireframeCanvas
            pageId={pageId}
            blocks={blocks}
            setBlocks={setBlocks}
            selectedBlockId={selectedBlockId}
            setSelectedBlockId={setSelectedBlockId}
          />
        </div>
      </div>

      {/* Right Sidebar: Properties */}
      <div className="lg:col-span-1 h-full overflow-hidden">
        <PropsEditorPanel
          selectedBlock={selectedBlock}
          blockDefinition={blockDefinition}
          onUpdateProps={handleUpdateProps}
        />
      </div>
    </div>
  )
}
