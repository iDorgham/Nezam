'use client'

import React from 'react'

interface ProfileSearchProps {
  search: string
  setSearch: (search: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const categories = ['All', 'SaaS', 'Dashboard', 'Marketing', 'Minimal', 'Dark', 'Branded', 'MENA']

export default function ProfileSearch({ search, setSearch, selectedCategory, setSelectedCategory }: ProfileSearchProps) {
  return (
    <div className="space-y-4 mb-6">
      <input
        type="text"
        placeholder="Search profiles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#0f1011] border border-[#ffffff14] rounded px-4 py-2 text-white focus:border-[#5e6ad2] focus:outline-none"
      />
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-[#5e6ad2] text-white'
                : 'bg-[#0f1011] text-[#8a8f98] hover:bg-[#191a1b] hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
