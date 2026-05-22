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
    <div className="bg-ds-background border border-ds-border rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-ds-text-secondary">Completion Matrix</h2>
        <div className="text-sm font-medium text-ds-primary">{percent}% Complete</div>
      </div>

      <div className="w-full bg-ds-surface h-2 rounded-full overflow-hidden">
        <div className="bg-ds-primary h-full" style={{ width: `${percent}%` }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criteria.map((item) => (
          <div
            key={item.id}
            className={`p-3 border rounded-lg flex items-center justify-between ${
              item.isComplete ? 'border-ds-success/20 bg-ds-success/5' : 'border-ds-border-subtle bg-ds-background'
            }`}
          >
            <span className={`text-sm ${item.isComplete ? 'text-white' : 'text-ds-text-muted'}`}>
              {item.name}
            </span>
            {item.isComplete ? (
              <Check size={16} className="text-ds-success" />
            ) : (
              <X size={16} className="text-ds-destructive" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
