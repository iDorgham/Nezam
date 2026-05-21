'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import {
  LayoutDashboard,
  Network,
  FileCode,
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
      { id: 'template', name: 'All-in-One Builder', nameAr: 'الباني الشامل', icon: FileCode, type: 'template', tourId: 'template', shortcut: 'G T' },
    ],
  },
]

export default function Sidebar() {
  const { openTab, activeTabId, lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <TooltipProvider delayDuration={200}>
      <nav
        className="h-10 bg-ds-surface border-t border-ds-border flex flex-row items-center px-3 shrink-0 z-40 gap-1"
        aria-label={t('Primary navigation', 'التنقّل الرئيسي')}
      >
        {/* Brand mark */}
        <div className="me-3 shrink-0">
          <div className="w-6 h-6 rounded-ds-md bg-ds-primary text-ds-text-inverse flex items-center justify-center font-bold text-[11px] shadow-ds-sm">
            N
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-ds-border me-2 shrink-0" aria-hidden />

        {/* Nav items */}
        {navGroups.map((group, gi) => (
          <React.Fragment key={group.label}>
            {gi > 0 && (
              <div className="w-px h-5 bg-ds-border mx-1 shrink-0" aria-hidden />
            )}
            {group.items.map((item) => {
              const isActive = activeTabId === item.id
              const Icon = item.icon
              return (
                <Tooltip
                  key={item.id}
                  side="top"
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
                      'relative h-7 px-2.5 flex items-center gap-1.5 rounded-ds-md text-[11px] font-medium',
                      'transition-colors duration-ds-fast ease-ds-default',
                      isActive
                        ? 'bg-ds-primary-subtle text-ds-primary'
                        : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover',
                    ].join(' ')}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute bottom-0 start-2 end-2 h-0.5 bg-ds-primary rounded-ds-full"
                      />
                    )}
                    <Icon
                      className={[
                        'w-[14px] h-[14px] stroke-[1.5]',
                        ['sitemap', 'wireframes', 'layout-designer'].includes(item.id)
                          ? 'rtl:rotate-180'
                          : '',
                      ].join(' ')}
                    />
                    <span>{t(item.name, item.nameAr)}</span>
                  </button>
                </Tooltip>
              )
            })}
          </React.Fragment>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* User profile */}
        <Tooltip
          side="top"
          content={
            <div className="flex flex-col">
              <span className="text-ds-text-primary font-medium">{t('Dorgham', 'ضرغام')}</span>
              <span className="text-[10px] text-ds-text-muted">{t('Art Director', 'مدير فني')}</span>
            </div>
          }
        >
          <button
            type="button"
            className="h-7 w-7 flex items-center justify-center rounded-ds-full text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover transition-colors"
            aria-label={t('Account menu', 'قائمة الحساب')}
          >
            <div className="w-5 h-5 rounded-ds-full bg-ds-primary text-ds-text-inverse flex items-center justify-center text-[9px] font-bold">
              D
            </div>
          </button>
        </Tooltip>
      </nav>
    </TooltipProvider>
  )
}
