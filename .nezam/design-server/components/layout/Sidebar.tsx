'use client'

import React, { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { LayoutDashboard, Network, Menu, PenTool, FileCode, Component, Layout, Paintbrush, FileJson, Settings, Bot } from 'lucide-react'

const navGroups = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', name: 'Dashboard', nameAr: 'لوحة التحكم', icon: LayoutDashboard, type: 'dashboard' as const },
      { id: 'sitemap', name: 'Sitemap', nameAr: 'خريطة الموقع', icon: Network, type: 'sitemap' as const },
      { id: 'menus', name: 'Menus', nameAr: 'القوائم', icon: Menu, type: 'menus' as const },
      { id: 'canvas', name: 'Canvas', nameAr: 'الكانفاس', icon: PenTool, type: 'canvas' as const },
    ],
  },
  {
    label: 'Build',
    items: [
      { id: 'template', name: 'Template', nameAr: 'القالب', icon: FileCode, type: 'template' as const },
      { id: 'wireframes', name: 'Wireframes', nameAr: 'هياكل العمل', icon: Component, type: 'wireframe' as const },
      { id: 'layout-designer', name: 'Layout Designer', nameAr: 'محرر الهيكل', icon: Layout, type: 'layout-designer' as const },
    ],
  },
  {
    label: 'Design',
    items: [
      { id: 'theme-editor', name: 'Theme Editor', nameAr: 'محرر الألوان', icon: Paintbrush, type: 'theme-editor' as const },
      { id: 'profile-editor', name: 'Profile Editor', nameAr: 'محرر الملفات', icon: FileJson, type: 'profile-editor' as const },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'settings', name: 'Settings', nameAr: 'الإعدادات', icon: Settings, type: 'settings' as const },
      { id: 'ai', name: 'AI Assistant', nameAr: 'مساعد الذكاء الاصطناعي', icon: Bot, type: 'ai' as const },
    ],
  },
]

export default function Sidebar() {
  const { openTab, activeTabId, lang } = useSessionStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <div className="w-14 group hover:w-18 bg-ds-primary border-e border-ds-border flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-50">
      {/* Logo Area */}
      <div className="border-b border-ds-border flex items-center h-14 w-full">
        <div className="w-12 flex items-center justify-center shrink-0">
          <div className="w-6 h-6 bg-ds-surface text-ds-primary rounded flex items-center justify-center font-bold text-sm">
            N
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-1.5 flex flex-col gap-1 transition-all duration-300">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-2 py-1.5 text-[9px] font-semibold text-white/60 uppercase tracking-wider select-none">
              {t(group.label, group.label === 'Main' ? 'رئيسي' : group.label === 'Build' ? 'بناء' : group.label === 'Design' ? 'تصميم' : 'أدوات')}
            </div>
            {group.items.map((item) => {
              const isActive = activeTabId === item.id
              return (
                <div
                  key={item.id}
                  className="w-full"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    openTab({ id: item.id, title: lang === 'ar' ? item.nameAr : item.name, type: item.type })
                  }}
                >
                  <div
                    className={`relative flex items-center rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="w-10 h-9 flex items-center justify-center shrink-0">
                      <item.icon className={`w-4 h-4 stroke-[1.5] ${['sitemap', 'wireframes', 'layout-designer'].includes(item.id) ? 'rtl:rotate-180' : ''}`} />
                    </div>
                    {/* Floating label on hover */}
                    <span
                      className={`absolute left-full top-1/2 -translate-y-1/2 ml-1.5 px-2 py-0.5 text-xs font-medium whitespace-nowrap rounded-md transition-all duration-200 pointer-events-none ${
                        hoveredId === item.id
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-1'
                      } ${
                        isActive
                          ? 'bg-ds-surface text-ds-text-primary'
                          : 'bg-ds-surface text-ds-primary border border-ds-border'
                      }`}
                    >
                      {lang === 'ar' ? item.nameAr : item.name}
                    </span>
                  </div>
                </div>
              )
            })}
            {/* Group separator */}
            <div className="h-px bg-white/15 mx-2 my-1" />
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-2 border-t border-ds-border flex items-center justify-center group-hover:justify-start transition-all duration-300">
        <div className="flex items-center gap-2 px-1.5 py-1">
          <div className="w-5 h-5 bg-ds-surface text-ds-primary rounded-full flex items-center justify-center font-bold text-[9px] shrink-0">
            D
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            <div className="text-[10px] font-medium text-white">{t('Dorgham', 'ضرغام')}</div>
            <div className="text-[9px] text-white/60">{t('Art Director', 'مدير فني')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
