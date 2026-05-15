'use client'

import React, { useEffect } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import Link from 'next/link'

export default function Home() {
  const {
    sitemap,
    profiles,
    fetchProfiles,
    fetchContext,
    templateConfig,
    addLog,
    logs,
    openTab,
    lang,
  } = useSessionStore()

  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  useEffect(() => {
    if (profiles.length === 0) fetchProfiles()
    if (sitemap.length === 0) fetchContext()
  }, [fetchProfiles, fetchContext, profiles.length, sitemap.length])

  const steps = [
    {
      id: 'sitemap',
      type: 'sitemap' as const,
      name: t('Sitemap', 'خريطة الموقع'),
      desc: t('Define page hierarchy', 'حدد هيكل الصفحات'),
      completed: sitemap.length > 0,
    },
    {
      id: 'template',
      type: 'template' as const,
      name: t('Template', 'القالب'),
      desc: t('Choose styles & colors', 'اختر الأنماط والألوان'),
      completed: !!templateConfig.colorProfile && templateConfig.colorProfile !== 'dark',
    },
    {
      id: 'wireframes',
      type: 'wireframe' as const,
      name: t('Wireframes', 'الواير فريمز'),
      desc: t('Layout pages with blocks', 'خطط الصفحات بالبلوكات'),
      completed: false,
    },
    {
      id: 'export',
      type: 'export' as const,
      name: t('Review & Lock', 'المراجعة والقفل'),
      desc: t('Lock & export contract', 'قفل وتصدير العقد'),
      completed: false,
    },
  ]

  const handleStepClick = async (step: typeof steps[0]) => {
    try {
      const res = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: `nezam-cli start-step --name "${step.name}"` }),
      })
      if (res.ok) {
        const data = await res.json()
        addLog(data.output)
      }
    } catch {
      // silent — CLI is optional
    }
    openTab({ id: step.id, title: step.name, type: step.type })
  }

  return (
    <div className="p-6 w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ds-text-primary mb-1">
          {t('NEZAM Design Server', 'سيرفر تصميم نظام')}
        </h1>
        <p className="text-ds-text-muted text-sm">
          {t(
            'Human-in-the-loop design decision engine for SDD pipelines.',
            'محرك قرار التصميم للمطوّر — طريقك من الفكرة للكود بدقة.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-ds-surface border border-ds-border rounded-lg">
              <div className="text-xs text-ds-text-muted mb-1">{t('Active Pages', 'الصفحات الشغالة')}</div>
              <div className="text-2xl font-bold text-ds-text-primary">{sitemap.length}</div>
            </div>
            <div className="p-4 bg-ds-surface border border-ds-border rounded-lg">
              <div className="text-xs text-ds-text-muted mb-1">{t('Available Profiles', 'البروفايلات المتاحة')}</div>
              <div className="text-2xl font-bold text-ds-text-primary">{profiles.length}</div>
            </div>
            <div className="p-4 bg-ds-surface border border-ds-border rounded-lg">
              <div className="text-xs text-ds-text-muted mb-1">{t('Active Profile', 'البروفايل المختار')}</div>
              <div className="text-xl font-bold text-ds-primary truncate">
                {templateConfig.colorProfile || t('None', 'لا شيء')}
              </div>
            </div>
          </div>

          {/* Guided Workflow Steps */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-ds-text-primary">
              {t('Guided Workflow', 'سير العمل الموجه')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step)}
                  className="p-3 bg-ds-surface border border-ds-border rounded-lg hover:border-ds-primary/40 transition-colors cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-medium text-ds-text-muted">
                        {t(`Step 0${index + 1}`, `الخطوة 0${index + 1}`)}
                      </span>
                      {step.completed && (
                        <span className="w-1.5 h-1.5 bg-ds-success rounded-full" />
                      )}
                    </div>
                    <div className="text-sm font-semibold text-ds-text-primary mb-0.5">{step.name}</div>
                    <div className="text-[10px] text-ds-text-muted">{step.desc}</div>
                  </div>
                  <div className="mt-3 text-[10px] text-ds-primary font-medium flex items-center gap-0.5">
                    {t('Open', 'افتح')}
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lock CTA Banner */}
          <div className="p-4 bg-ds-surface border border-ds-border rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-ds-text-primary mb-1">
                {t('Ready to lock your design?', 'جاهز لقفل تصميمك؟')}
              </h2>
              <p className="text-xs text-ds-text-muted max-w-md">
                {t(
                  'Complete the workflow, then export your contract and let the NEZAM swarm build it.',
                  'خلص الشغل، صدّر العقد وسيب سرب نظام يبنيهولك.'
                )}
              </p>
            </div>
            <button
              onClick={() => openTab({ id: 'export', title: t('Export', 'تصدير'), type: 'export' as const })}
              className="px-4 py-2 bg-ds-primary text-white text-xs font-medium rounded hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {t('Lock & Export', 'قفل وتصدير')}
            </button>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <div className="p-4 bg-ds-surface border border-ds-border rounded-lg space-y-3">
            <h3 className="text-sm font-semibold text-ds-text-primary">{t('Quick Actions', 'إجراءات سريعة')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sitemap',   type: 'sitemap' as const,   label: t('Sitemap', 'خريطة الموقع') },
                { id: 'canvas',    type: 'canvas' as const,    label: t('Canvas', 'الكانفاس') },
                { id: 'menus',     type: 'menus' as const,     label: t('Menus', 'القوائم') },
                { id: 'template',  type: 'template' as const,  label: t('Template', 'القالب') },
                { id: 'profiles',  type: 'profiles' as const,  label: t('Profiles', 'البروفايلات') },
                { id: 'ai',        type: 'ai' as const,        label: t('AI', 'الذكاء الاصطناعي') },
              ].map((action) => (
                <button
                  key={action.id}
                  onClick={() => openTab({ id: action.id, title: action.label, type: action.type })}
                  className="p-2 bg-ds-surface-subtle hover:bg-ds-surface-hover border border-ds-border rounded-lg text-xs text-ds-text-primary text-center transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="p-4 bg-ds-surface border border-ds-border rounded-lg space-y-3">
            <h3 className="text-sm font-semibold text-ds-text-primary">{t('Recent Activity', 'النشاط الأخير')}</h3>
            <div className="space-y-2 max-h-64 overflow-auto">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="text-[11px] text-ds-text-muted bg-ds-surface-subtle p-2 rounded border border-ds-border"
                >
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-xs text-ds-text-muted text-center py-4">
                  {t('No recent activity.', 'لا توجد أنشطة أخيرة.')}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
