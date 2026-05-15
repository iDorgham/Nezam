'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { LayoutDashboard, Network, Palette, Component, Settings, Menu, PenTool, Bot, Layout, Image, FileCode, Paintbrush, FileJson } from 'lucide-react'

const navItems = [
  { id: 'dashboard', name: 'Dashboard', nameAr: 'لوحة التحكم', icon: LayoutDashboard, type: 'dashboard' as const },
  { id: 'sitemap', name: 'Sitemap', nameAr: 'خريطة الموقع', icon: Network, type: 'sitemap' as const },
  { id: 'menus', name: 'Menus', nameAr: 'القوائم', icon: Menu, type: 'menus' as const },
  { id: 'canvas', name: 'Canvas', nameAr: 'الكانفاس', icon: PenTool, type: 'canvas' as const },
  { id: 'template', name: 'Template', nameAr: 'القالب', icon: FileCode, type: 'template' as const },
  { id: 'wireframes', name: 'Wireframes', nameAr: 'هياكل العمل', icon: Component, type: 'wireframe' as const },
  { id: 'layout-designer', name: 'Layout Designer', nameAr: 'محرر الهيكل', icon: Layout, type: 'layout-designer' as const },
  { id: 'theme-editor', name: 'Theme Editor', nameAr: 'محرر الألوان', icon: Paintbrush, type: 'theme-editor' as const },
  { id: 'asset-manager', name: 'Asset Manager', nameAr: 'مدير الملفات', icon: Image, type: 'asset-manager' as const },
  { id: 'profile-editor', name: 'Profile Editor', nameAr: 'محرر الملفات', icon: FileJson, type: 'profile-editor' as const },
  { id: 'settings', name: 'Settings', nameAr: 'الإعدادات', icon: Settings, type: 'settings' as const },
  { id: 'ai', name: 'AI Assistant', nameAr: 'مساعد الذكاء الاصطناعي', icon: Bot, type: 'ai' as const },
]

export default function Sidebar() {
  const { openTab, activeTabId, lang } = useSessionStore()

  return (
    <div className="w-16 hover:w-56 bg-ds-surface border-e border-ds-border flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out group z-50">
      {/* Logo Area */}
      <div className="border-b border-ds-border flex items-center h-14 w-full">
        <div className="w-16 flex items-center justify-center shrink-0">
          <div className="w-6 h-6 bg-ds-primary rounded flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
        </div>
        <span className="font-semibold text-ds-text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          NEZAM Design
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-2 flex flex-col transition-all duration-300">
        {navItems.map((item) => {
          const isActive = activeTabId === item.id
          return (
            <div
              key={item.id}
              className="w-full"
              onClick={() => {
                openTab({ id: item.id, title: lang === 'ar' ? item.nameAr : item.name, type: item.type })
              }}
            >
              <div
                className={`flex items-center rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-ds-primary/10 text-ds-primary'
                    : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-white/[0.03]'
                }`}
              >
                <div className="w-12 h-10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {lang === 'ar' ? item.nameAr : item.name}
                </span>
              </div>
            </div>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-ds-border flex items-center justify-center group-hover:justify-start transition-all duration-300">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-6 h-6 bg-ds-success rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
            D
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <div className="text-xs font-medium text-ds-text-primary">Dorgham</div>
            <div className="text-[10px] text-ds-text-muted">Art Director</div>
          </div>
        </div>
      </div>
    </div>
  )
}
