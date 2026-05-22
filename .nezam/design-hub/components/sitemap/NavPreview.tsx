'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { FileText } from 'lucide-react'

export default function NavPreview() {
  const { sitemap, lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const navItems = sitemap.filter(page => page.showInNav !== false)

  return (
    <div className="bg-ds-surface border border-ds-border rounded-xl p-4">
      <h2 className="text-sm font-medium text-ds-text-muted uppercase mb-4">{t('Navigation Preview', 'معاينة المنيو')}</h2>
      
      <div className="border border-ds-border rounded-lg overflow-hidden bg-ds-background flex">
        {/* Mini Sidebar */}
        <div className="w-16 border-e border-ds-border p-2 flex flex-col items-center space-y-4 bg-ds-surface">
          <div className="w-8 h-8 bg-ds-primary rounded-md flex items-center justify-center font-bold text-white text-xs">N</div>
          <div className="w-8 h-8 bg-ds-border rounded-md"></div>
          <div className="w-8 h-8 bg-ds-border rounded-md"></div>
        </div>
        
        {/* Mini Content area with topbar */}
        <div className="flex-1 flex flex-col">
          <div className="h-10 border-b border-ds-border px-3 flex items-center justify-between bg-ds-surface">
            <div className="text-xs font-medium text-ds-text-primary">{t('Project App', 'تطبيق المشروع')}</div>
            <div className="w-6 h-6 bg-ds-border rounded-full"></div>
          </div>
          
          <div className="flex-1 p-3">
            <div className="text-xs text-ds-text-muted mb-2">{t('Main Navigation Links:', 'روابط المنيو الرئيسية:')}</div>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id} className={`flex items-center space-x-2 text-xs text-ds-text-primary p-1.5 hover:bg-ds-background rounded ${lang === 'ar' ? 'space-x-reverse' : ''}`}>
                  <FileText size={12} className="text-ds-text-muted" />
                  <span>{item.navLabel || item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
