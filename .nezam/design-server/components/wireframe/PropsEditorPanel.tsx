'use client'

import React from 'react'
import { BlockDefinition } from '@/lib/blocks/registry'

interface PropsEditorPanelProps {
  selectedBlock: { id: string, type: string, name: string, props?: Record<string, any> } | null
  blockDefinition?: BlockDefinition
  onUpdateProps: (id: string, props: Record<string, any>) => void
}

export default function PropsEditorPanel({ selectedBlock, blockDefinition, onUpdateProps }: PropsEditorPanelProps) {
  if (!selectedBlock) {
    return (
      <div className="bg-ds-surface border border-ds-border rounded-lg p-4 text-center py-8 text-ds-text-muted text-sm">
        Select a block to edit its properties.
      </div>
    )
  }

  const propsSchema = blockDefinition?.props || {}
  const currentProps = selectedBlock.props || {}

  const handleChange = (name: string, value: any) => {
    onUpdateProps(selectedBlock.id, { ...currentProps, [name]: value })
  }

  return (
    <div className="bg-ds-surface border border-ds-border rounded-lg p-4 space-y-4">
      <div>
        <h2 className="text-lg font-medium text-[#d0d6e0]">{selectedBlock.name}</h2>
        <div className="text-xs text-ds-text-muted font-mono">{selectedBlock.type}</div>
      </div>

      <div className="space-y-3 pt-2 border-t border-[#ffffff14]">
        {Object.entries(propsSchema).map(([propName, schema]) => {
          return (
            <div key={propName}>
              <label className="text-xs text-ds-text-muted uppercase block mb-1">
                {propName.replace(/_/g, ' ')}
              </label>
              
              {schema.type === 'string' && (
                <input
                  type="text"
                  value={currentProps[propName] ?? schema.default ?? ''}
                  onChange={(e) => handleChange(propName, e.target.value)}
                  className="w-full bg-[#191a1b] border border-[#ffffff14] rounded px-3 py-1.5 text-sm text-white focus:border-[#5e6ad2] focus:outline-none"
                />
              )}

              {schema.type === 'boolean' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`prop-${propName}`}
                    checked={currentProps[propName] ?? schema.default ?? false}
                    onChange={(e) => handleChange(propName, e.target.checked)}
                    className="rounded border-[#ffffff14] bg-[#191a1b] text-[#5e6ad2]"
                  />
                  <label htmlFor={`prop-${propName}`} className="text-sm text-[#d0d6e0]">
                    Enabled
                  </label>
                </div>
              )}

              {schema.type === 'enum' && (
                <select
                  value={currentProps[propName] ?? schema.default ?? ''}
                  onChange={(e) => handleChange(propName, e.target.value)}
                  className="w-full bg-[#191a1b] border border-[#ffffff14] rounded px-3 py-1.5 text-sm text-white focus:border-[#5e6ad2] focus:outline-none"
                >
                  {schema.values?.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              )}

              {schema.type === 'integer' && (
                <input
                  type="number"
                  value={currentProps[propName] ?? schema.default ?? 0}
                  onChange={(e) => handleChange(propName, parseInt(e.target.value))}
                  className="w-full bg-[#191a1b] border border-[#ffffff14] rounded px-3 py-1.5 text-sm text-white focus:border-[#5e6ad2] focus:outline-none"
                />
              )}

              {schema.description && (
                <div className="text-xs text-ds-text-muted mt-1">{schema.description}</div>
              )}
            </div>
          )
        })}

        {Object.keys(propsSchema).length === 0 && (
          <div className="text-sm text-ds-text-muted text-center py-4">
            No configurable properties for this block.
          </div>
        )}
      </div>
    </div>
  )
}
