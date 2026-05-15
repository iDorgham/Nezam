'use client'

import React, { useState } from 'react'
import * as Icons from 'lucide-react'
import { LucideIcon } from 'lucide-react'

// A small subset of common navigation icons to avoid rendering 1000+ icons
const commonIcons = [
  'Home', 'Settings', 'User', 'FileText', 'BarChart2', 'Bell', 
  'Calendar', 'Camera', 'Clipboard', 'Clock', 'Cloud', 'CreditCard',
  'Database', 'Download', 'Edit', 'ExternalLink', 'Folder', 'Globe',
  'Heart', 'Image', 'Inbox', 'Key', 'Layers', 'Link', 'Lock',
  'Mail', 'Map', 'Menu', 'MessageSquare', 'Moon', 'Music', 'Package',
  'Phone', 'PieChart', 'Plus', 'Search', 'Server', 'Shield', 'ShoppingBag',
  'ShoppingCart', 'Star', 'Sun', 'Tag', 'Trash', 'Upload', 'Video', 'Zap'
]

interface IconPickerProps {
  currentIcon?: string
  onSelect: (iconName: string) => void
}

export default function IconPicker({ currentIcon, onSelect }: IconPickerProps) {
  const [search, setSearch] = useState('')

  const filteredIcons = commonIcons.filter(name => 
    name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#191a1b] border border-[#ffffff14] rounded p-3">
      <input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#08090a] border border-[#ffffff14] rounded px-3 py-1.5 text-sm text-white focus:border-[#5e6ad2] focus:outline-none mb-3"
      />
      
      <div className="grid grid-cols-6 gap-2 max-h-40 overflow-auto">
        {filteredIcons.map((iconName) => {
          const Icon = (Icons as any)[iconName] as LucideIcon
          if (!Icon) return null
          
          return (
            <button
              key={iconName}
              onClick={() => onSelect(iconName)}
              className={`p-2 rounded flex items-center justify-center hover:bg-[#ffffff0a] transition-colors ${
                currentIcon === iconName ? 'bg-[#5e6ad2] text-white' : 'text-ds-text-muted'
              }`}
              title={iconName}
            >
              <Icon size={16} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
