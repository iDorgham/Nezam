'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import {
  LayoutDashboard,
  Network,
  Menu,
  PenTool,
  FileCode,
  Component,
  Layout,
  Paintbrush,
  FileJson,
  Settings,
  Bot,
  Boxes,
} from 'lucide-react'
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip'

type NavItem = {
  id: string
  name: string
  nameAr: string
  icon: React.ComponentType<{ className?: string }>
  type:
    | 'dashboard'
    | 'sitemap'
    | 'template'
    | 'sections'
    | 'page-builder'
    | 'settings'
  tourId?: string
  shortcut?: string
}

const navGroups: { label: string; labelAr: string; items: NavItem[] }[] = [
  {
    label: 'Workspace',
    labelAr: 'مساحة العمل',
    items: [
      { id: 'dashboard', name: 'Onboarding', nameAr: 'التهيئة والترحيب', icon: LayoutDashboard, type: 'dashboard', shortcut: 'G D' },
      { id: 'sitemap', name: 'Sitemap Canvas', nameAr: 'مخطط الصفحات', icon: Network, type: 'sitemap', tourId: 'sitemap', shortcut: 'G S' },
    ],
  },
  {
    label: 'Builders',
    labelAr: 'أدوات البناء',
    items: [
      { id: 'template', name: 'Template Builder', nameAr: 'باني القوالب', icon: FileCode, type: 'template', tourId: 'template', shortcut: 'G T' },
      { id: 'sections', name: 'Sections Builder', nameAr: 'باني الأقسام', icon: Boxes, type: 'sections', shortcut: 'G K' },
      { id: 'page-builder', name: 'Page Builder', nameAr: 'باني الصفحات', icon: Component, type: 'page-builder', tourId: 'page-builder', shortcut: 'G W' },
    ],
  },
]

export default function Sidebar() {
  const { openTab, activeTabId, lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className="w-14 bg-ds-surface border-e border-ds-border flex flex-col h-screen sticky top-0 z-40"
        aria-label={t('Primary navigation', 'التنقّل الرئيسي')}
      >
        {/* Brand */}
        <div className="h-14 flex items-center justify-center border-b border-ds-border shrink-0">
          <div className="w-8 h-8 rounded-ds-md bg-ds-primary text-ds-text-inverse flex items-center justify-center font-bold text-sm shadow-ds-sm">
            N
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-1.5">
          {navGroups.map((group, gi) => (
            <div key={group.label} className="mb-2">
              {gi > 0 && (
                <div className="h-px bg-ds-border my-2 mx-1" aria-hidden />
              )}
              <ul className="space-y-0.5" role="list">
                {group.items.map((item) => {
                  const isActive = activeTabId === item.id
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <Tooltip
                        side="right"
                        align="center"
                        shortcut={item.shortcut}
                        content={
                          <div className="flex flex-col">
                            <span>{t(item.name, item.nameAr)}</span>
                            <span className="text-[10px] text-ds-text-muted">
                              {t(group.label, group.labelAr)}
                            </span>
                          </div>
                        }
                      >
                        <button
                          type="button"
                          data-tour={item.tourId ? `sidebar-${item.tourId}` : undefined}
                          onClick={() =>
                            openTab({
                              id: item.id,
                              title: lang === 'ar' ? item.nameAr : item.name,
                              type: item.type,
                            })
                          }
                          aria-label={t(item.name, item.nameAr)}
                          aria-current={isActive ? 'page' : undefined}
                          className={[
                            'relative w-full h-9 flex items-center justify-center rounded-ds-md',
                            'transition-colors duration-ds-fast ease-ds-default',
                            isActive
                              ? 'bg-ds-primary-subtle text-ds-primary'
                              : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover',
                          ].join(' ')}
                        >
                          {isActive && (
                            <span
                              aria-hidden
                              className="absolute start-0 top-1.5 bottom-1.5 w-0.5 bg-ds-primary rounded-ds-full"
                            />
                          )}
                          <Icon
                            className={[
                              'w-[18px] h-[18px] stroke-[1.5]',
                              ['sitemap', 'wireframes', 'layout-designer'].includes(item.id)
                                ? 'rtl:rotate-180'
                                : '',
                            ].join(' ')}
                          />
                        </button>
                      </Tooltip>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-ds-border p-2 shrink-0">
          <Tooltip
            side="right"
            content={
              <div className="flex flex-col">
                <span className="text-ds-text-primary font-medium">{t('Dorgham', 'ضرغام')}</span>
                <span className="text-[10px] text-ds-text-muted">{t('Art Director', 'مدير فني')}</span>
              </div>
            }
          >
            <button
              type="button"
              className="w-full h-9 flex items-center justify-center rounded-ds-md text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover transition-colors"
              aria-label={t('Account menu', 'قائمة الحساب')}
            >
              <div className="w-6 h-6 rounded-ds-full bg-ds-primary text-ds-text-inverse flex items-center justify-center text-[10px] font-bold">
                D
              </div>
            </button>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
