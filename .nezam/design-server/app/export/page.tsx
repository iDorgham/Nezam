'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { FileText, Download, CheckCircle } from 'lucide-react'

export default function ExportPage() {
  const { sitemap, templateConfig, addLog, lang } = useSessionStore()
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  const handleExport = async () => {
    try {
      const res = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: `nezam-cli contract export --output ./locked_contract.json` })
      })
      if (res.ok) {
        const data = await res.json()
        addLog(data.output)
      }
    } catch (e) {
      console.error('Failed to run silent CLI', e)
    }
  }

  return (
    <div className="p-4 w-full space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ds-text-primary flex items-center gap-1.5">
          <FileText className="w-5 h-5 text-ds-primary" />
          {t('Lock & Export Contract', 'قفل وتصدير العقد')}
        </h1>
        <p className="text-ds-text-muted text-xs mt-0.5">
          {t('Finalize your design decisions and generate the SDD contract.', 'أكد قرارات التصميم بتاعك واستخرج عقد الـ SDD.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Summary Card */}
        <div className="p-3 bg-ds-surface border border-ds-border rounded space-y-3">
          <h2 className="text-sm font-medium text-ds-text-primary flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-green-500" />
            {t('Design Summary', 'ملخص التصميم')}
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ds-text-muted">{t('Pages Defined:', 'الصفحات المعرفة:')}</span>
              <span className="text-ds-text-primary font-medium">{sitemap.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ds-text-muted">{t('Theme Profile:', 'ملف السمة:')}</span>
              <span className="text-ds-text-primary font-medium">{templateConfig.colorProfile || t('Not selected', 'لم يتم الاختيار')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ds-text-muted">{t('Typography:', 'الخطوط:')}</span>
              <span className="text-ds-text-primary font-medium">{templateConfig.typography}</span>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="p-3 bg-ds-surface border border-ds-border rounded flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-medium text-ds-text-primary mb-1">{t('Ready to build?', 'جاهز للبرمجة؟')}</h2>
            <p className="text-[10px] text-ds-text-muted">
              {t('Exporting will lock these settings and notify the NEZAM swarm agents to begin development.', 'التصدير هيقفل الإعدادات دي وهيدي إشعار لوكلاء نظام (NEZAM) عشان يبدأوا تطوير.')}
            </p>
          </div>
          <button
            onClick={handleExport}
            className="w-full mt-3 px-3 py-1.5 bg-ds-primary text-white text-xs font-medium rounded hover:bg-ds-primary/90 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            {t('Generate Contract', 'استخراج العقد')}
          </button>
        </div>
      </div>
    </div>
  )
}
