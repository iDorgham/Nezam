'use client'

import React from 'react'

interface ScaleRatioSelectorProps {
  baseSize: number
  scale: number
}

export default function ScaleRatioSelector({ baseSize, scale }: ScaleRatioSelectorProps) {
  const sizes = [
    { name: 'xs', val: baseSize / scale / scale },
    { name: 'sm', val: baseSize / scale },
    { name: 'md', val: baseSize },
    { name: 'lg', val: baseSize * scale },
    { name: 'xl', val: baseSize * scale * scale },
    { name: '2xl', val: baseSize * scale * scale * scale },
  ]

  return (
    <div className="bg-[#191a1b] border border-[#ffffff14] rounded p-4">
      <h3 className="text-xs text-[#8a8f98] uppercase mb-3">Computed Type Scale</h3>
      <div className="space-y-2">
        {sizes.map((size) => (
          <div key={size.name} className="flex items-center justify-between text-sm">
            <span className="text-[#8a8f98] font-mono">{size.name}</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-white" style={{ fontSize: `${size.val}px` }}>Preview</span>
              <span className="text-xs text-[#8a8f98] font-mono">{Math.round(size.val)}px</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
