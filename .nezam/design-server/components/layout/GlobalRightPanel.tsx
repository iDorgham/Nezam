'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, FileText, Settings } from 'lucide-react'
import PagePropsPanel from '@/components/sitemap/PagePropsPanel'
import { useSessionStore } from '@/lib/store/session.store'

export default function GlobalRightPanel() {
  const pathname = usePathname()
  const { projectContext } = useSessionStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('properties')

  return (
    <div className={`border-l border-white/[0.05] bg-white/[0.01] backdrop-blur-md flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-12' : 'w-96'} h-screen sticky top-0`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-3 border-b border-white/[0.05] hover:bg-white/[0.02] text-[#8a8f98] hover:text-white transition-colors flex justify-center h-14 items-center"
        title={isCollapsed ? 'Expand Panel' : 'Collapse Panel'}
      >
        {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {!isCollapsed && (
        <>
          {/* Tabs Header */}
          <div className="flex border-b border-white/[0.05] bg-white/[0.02]">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'properties' ? 'text-white border-b-2 border-[#5e6ad2] bg-white/[0.02]' : 'text-[#8a8f98] hover:text-white'}`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'text-white border-b-2 border-[#5e6ad2] bg-white/[0.02]' : 'text-[#8a8f98] hover:text-white'}`}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'properties' ? (
              pathname === '/sitemap' ? (
                <PagePropsPanel />
              ) : (
                <div className="text-sm text-[#8a8f98] text-center py-8">
                  Select an item to see its properties.
                </div>
              )
            ) : (
              <div className="text-sm text-[#8a8f98] text-center py-8">
                Settings panel content goes here.
              </div>
            )}
          </div>
        </>
      )}

      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-4 space-y-4">
          <button 
            onClick={() => { setIsCollapsed(false); setActiveTab('properties'); }}
            className={`p-2 rounded-lg ${activeTab === 'properties' ? 'bg-[#5e6ad2]/20 text-[#5e6ad2]' : 'bg-white/[0.03] text-[#8a8f98] hover:text-white'} transition-colors`}
            title="Properties"
          >
            <FileText size={16} />
          </button>
          <button 
            onClick={() => { setIsCollapsed(false); setActiveTab('settings'); }}
            className={`p-2 rounded-lg ${activeTab === 'settings' ? 'bg-[#5e6ad2]/20 text-[#5e6ad2]' : 'bg-white/[0.03] text-[#8a8f98] hover:text-white'} transition-colors`}
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
