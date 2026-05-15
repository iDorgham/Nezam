'use client'

import React, { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react'

export default function ConsolePanel() {
  const { logs } = useSessionStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`fixed bottom-0 start-56 end-0 bg-[#000000] border-t border-[#ffffff14] transition-all z-50 ${isOpen ? 'h-64' : 'h-10'}`}>
      {/* Header */}
      <div 
        className="h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-[#ffffff05]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-white">
          <Terminal className="w-4 h-4 text-ds-primary" />
          <span>Console</span>
          <span className="text-ds-text-muted">({logs.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4 text-ds-text-muted" /> : <ChevronUp className="w-4 h-4 text-ds-text-muted" />}
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-4 h-[calc(100%-40px)] overflow-auto font-mono text-xs text-ds-text-muted space-y-1">
          {logs.length === 0 ? (
            <div className="text-[#ffffff50]">No logs yet. Execute an action to see CLI output.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap border-b border-[#ffffff05] pb-1 mb-1 last:border-0">
                {log}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
