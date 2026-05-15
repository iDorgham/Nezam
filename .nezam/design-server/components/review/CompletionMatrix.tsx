'use client'

import React from 'react'
import { Check, X } from 'lucide-react'

interface Criteria {
  id: string
  name: string
  isComplete: boolean
}

export default function CompletionMatrix() {
  // Mock criteria based on phases
  const criteria: Criteria[] = [
    { id: '1', name: 'Phase 1: Project Context Loaded', isComplete: true },
    { id: '2', name: 'Phase 2: Sitemap Built & Validated', isComplete: true },
    { id: '3', name: 'Phase 3: Design Profile Selected', isComplete: true },
    { id: '4', name: 'Phase 4: Design Tokens Finalized', isComplete: true },
    { id: '5', name: 'Phase 5: Wireframes Approved (All Pages)', isComplete: false },
    { id: '6', name: 'Phase 6: TUI Previews Generated', isComplete: true },
  ]

  const completeCount = criteria.filter(c => c.isComplete).length
  const totalCount = criteria.length
  const percent = Math.round((completeCount / totalCount) * 100)

  return (
    <div className="bg-[#0f1011] border border-[#ffffff14] rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-[#d0d6e0]">Completion Matrix</h2>
        <div className="text-sm font-medium text-[#5e6ad2]">{percent}% Complete</div>
      </div>

      <div className="w-full bg-[#191a1b] h-2 rounded-full overflow-hidden">
        <div className="bg-[#5e6ad2] h-full" style={{ width: `${percent}%` }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criteria.map((item) => (
          <div
            key={item.id}
            className={`p-3 border rounded-lg flex items-center justify-between ${
              item.isComplete ? 'border-[#10b98124] bg-[#10b98105]' : 'border-[#ffffff0a] bg-[#08090a]'
            }`}
          >
            <span className={`text-sm ${item.isComplete ? 'text-white' : 'text-ds-text-muted'}`}>
              {item.name}
            </span>
            {item.isComplete ? (
              <Check size={16} className="text-[#10b981]" />
            ) : (
              <X size={16} className="text-[#dc2626]" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
