'use client'

import { useSessionStore } from '@/lib/store/session.store'
import { X } from 'lucide-react'

export default function TabHeader() {
  const { tabs, activeTabId, setActiveTabId, closeTab } = useSessionStore()

  return (
    <div className="flex bg-[#000000] border-b border-[#ffffff14] overflow-x-auto h-10 shrink-0">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            className={`flex items-center h-full px-4 border-r border-[#ffffff14] cursor-pointer group transition-colors ${
              isActive ? 'bg-[#121420] text-white border-t-2 border-[#7c3aed]' : 'text-[#8a8f98] hover:bg-white/[0.02] hover:text-white'
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span className="text-xs font-medium whitespace-nowrap">{tab.title}</span>
            {tab.id !== 'dashboard' && ( // Don't allow closing dashboard
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="ml-2 p-0.5 rounded-full hover:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
