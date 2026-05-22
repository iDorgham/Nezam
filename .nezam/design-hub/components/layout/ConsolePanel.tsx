'use client'

import React, { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react'

export default function ConsolePanel() {
  const { logs, lang } = useSessionStore()
  const [isOpen, setIsOpen] = useState(false)
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <div className={`fixed bottom-0 start-16 group-hover:start-56 end-0 bg-ds-background border-t border-ds-border transition-all duration-300 z-50 ${isOpen ? 'h-64' : 'h-10'}`}>
      {/* Header */}
      <div 
        className="h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-ds-surface-hover"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-ds-text-primary">
          <Terminal className="w-4 h-4 text-ds-primary" />
          <span>{t('Console', 'الكونسول')}</span>
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
            <div className="text-ds-text-muted/50">{t('No logs yet. Execute an action to see CLI output.', 'لا توجد سجلات بعد. قم بتنفيذ إجراء لرؤية مخرجات CLI.')}</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap border-b border-ds-border pb-1 mb-1 last:border-0">
                {log}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
