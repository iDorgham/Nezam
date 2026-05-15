'use client'

import React from 'react'
import { useSessionStore, Page } from '@/lib/store/session.store'
import IconPicker from '@/components/sitemap/IconPicker'
import * as Icons from 'lucide-react'

export default function PagePropsPanel() {
  const { sitemap, selectedPageId, updatePage } = useSessionStore()
  
  const selectedPage = sitemap.find(p => p.id === selectedPageId)

  const isDescendant = (candidateId: string, ancestorId: string): boolean => {
    let current = sitemap.find(p => p.id === candidateId)
    let depth = 0 // Prevent infinite loops
    while (current && depth < 20) {
      if (current.parentId === ancestorId) return true
      const parentId: string | undefined = current.parentId
      current = parentId ? sitemap.find(p => p.id === parentId) : undefined
      depth++
    }
    return false
  }

  if (!selectedPage) {
    return (
      <div className="text-sm text-[#8a8f98] text-center py-8">
        Select a page to edit properties
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updatePage(selectedPage.id, { [name]: value })
  }

  const CurrentIcon = selectedPage.navIcon ? (Icons as any)[selectedPage.navIcon] : null

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs text-[#8a8f98] uppercase font-medium tracking-wider block mb-1.5">Title</label>
        <input
          type="text"
          name="title"
          value={selectedPage.title || ''}
          onChange={handleChange}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]/30 focus:outline-none transition-all duration-300"
        />
      </div>
      
      <div>
        <label className="text-xs text-[#8a8f98] uppercase font-medium tracking-wider block mb-1.5">Route</label>
        <input
          type="text"
          name="route"
          value={selectedPage.route || ''}
          onChange={handleChange}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]/30 focus:outline-none transition-all duration-300"
        />
      </div>
      
      <div>
        <label className="text-xs text-[#8a8f98] uppercase font-medium tracking-wider block mb-1.5">Type</label>
        <select
          name="type"
          value={selectedPage.type}
          onChange={handleChange}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]/30 focus:outline-none transition-all duration-300"
        >
          <option value="public" className="bg-[#08090a]">Public</option>
          <option value="auth" className="bg-[#08090a]">Auth</option>
          <option value="admin" className="bg-[#08090a]">Admin</option>
          <option value="modal" className="bg-[#08090a]">Modal</option>
          <option value="embed" className="bg-[#08090a]">Embed</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-[#8a8f98] uppercase font-medium tracking-wider block mb-1.5">Parent Page</label>
        <select
          name="parentId"
          value={selectedPage.parentId || ''}
          onChange={(e) => updatePage(selectedPage.id, { parentId: e.target.value || undefined })}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]/30 focus:outline-none transition-all duration-300"
        >
          <option value="" className="bg-[#08090a]">None (Root)</option>
          {sitemap
            .filter(p => p.id !== selectedPage.id && !isDescendant(p.id, selectedPage.id))
            .map((page) => (
              <option key={page.id} value={page.id} className="bg-[#08090a]">
                {page.title || 'Untitled'} ({page.route})
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-[#8a8f98] uppercase font-medium tracking-wider block mb-1.5">Nav Label</label>
        <input
          type="text"
          name="navLabel"
          value={selectedPage.navLabel || ''}
          onChange={handleChange}
          placeholder={selectedPage.title}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]/30 focus:outline-none transition-all duration-300"
        />
      </div>

      <div>
        <label className="text-xs text-[#8a8f98] uppercase font-medium tracking-wider block mb-1.5">Icon</label>
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center text-white shadow-inner">
            {CurrentIcon ? <CurrentIcon size={20} /> : <Icons.FileText size={20} className="text-[#8a8f98]" />}
          </div>
          <span className="text-sm font-medium text-white">{selectedPage.navIcon || 'Default'}</span>
        </div>
        <IconPicker 
          currentIcon={selectedPage.navIcon} 
          onSelect={(iconName) => updatePage(selectedPage.id, { navIcon: iconName })}
        />
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <input
          type="checkbox"
          id="showInNav"
          name="showInNav"
          checked={selectedPage.showInNav ?? true}
          onChange={(e) => updatePage(selectedPage.id, { showInNav: e.target.checked })}
          className="rounded-md border-white/[0.08] bg-white/[0.03] text-[#5e6ad2] focus:ring-[#5e6ad2]/30 focus:ring-offset-0 transition-colors"
        />
        <label htmlFor="showInNav" className="text-sm font-medium text-[#d0d6e0]">Show in navigation</label>
      </div>
      
      <div className="pt-4 border-t border-white/[0.05]">
        <label className="text-xs text-[#8a8f98] uppercase font-medium tracking-wider block mb-3">Wiring (Links to)</label>
        <div className="space-y-2 max-h-40 overflow-auto bg-white/[0.01] border border-white/[0.05] rounded-xl p-3 shadow-inner">
          {sitemap.filter(p => p.id !== selectedPage.id).map((page) => (
            <div key={page.id} className="flex items-center space-x-3 hover:bg-white/[0.02] p-1.5 rounded-lg transition-colors">
              <input
                type="checkbox"
                id={`link-${page.id}`}
                checked={(selectedPage.linkedPageIds || []).includes(page.id)}
                onChange={(e) => {
                  const currentLinks = selectedPage.linkedPageIds || []
                  const newLinks = e.target.checked
                    ? [...currentLinks, page.id]
                    : currentLinks.filter(id => id !== page.id)
                  updatePage(selectedPage.id, { linkedPageIds: newLinks })
                }}
                className="rounded-md border-white/[0.08] bg-white/[0.03] text-[#5e6ad2] focus:ring-[#5e6ad2]/30 focus:ring-offset-0 transition-colors"
              />
              <label htmlFor={`link-${page.id}`} className="text-sm text-[#d0d6e0] cursor-pointer">
                <span className="font-medium text-white">{page.title || 'Untitled'}</span>
                <span className="text-xs text-[#8a8f98] font-mono ml-1.5">({page.route})</span>
              </label>
            </div>
          ))}
          {sitemap.length <= 1 && (
            <div className="text-xs text-[#8a8f98] text-center py-2">
              No other pages to link to.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
