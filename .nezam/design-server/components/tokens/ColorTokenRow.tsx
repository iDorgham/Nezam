'use client'

import React, { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorTokenRowProps {
  label: string
  value: string
  onChange: (color: string) => void
}

export default function ColorTokenRow({ label, value, onChange }: ColorTokenRowProps) {
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-between p-2 hover:bg-[#ffffff05] rounded transition-colors">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-6 h-6 rounded border border-[#ffffff14] cursor-pointer"
            style={{ backgroundColor: value }}
            title="Pick color"
          />
          {showPicker && (
            <div ref={pickerRef} className="absolute start-0 mt-2 z-50">
              <HexColorPicker color={value} onChange={onChange} />
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-ds-text-primary">{label}</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#191a1b] border border-[#ffffff14] rounded px-2 py-1 text-xs text-ds-text-primary font-mono w-24 text-end focus:border-[#5e6ad2] focus:outline-none"
      />
    </div>
  )
}
