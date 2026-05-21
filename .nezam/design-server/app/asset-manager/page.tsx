'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { designAssets, type DesignAsset } from '@/lib/assets'

function AssetCard({ asset }: { asset: DesignAsset }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-ds-border bg-ds-surface p-3 hover:border-ds-primary/50 transition-colors cursor-pointer">
      <div className="flex h-14 items-center justify-center rounded-lg bg-ds-background text-ds-text-muted text-xs font-mono uppercase">
        {asset.type}
      </div>
      <p className="truncate text-xs font-medium text-ds-text-primary">{asset.name}</p>
      <p className="text-[10px] text-ds-text-muted">{asset.size}</p>
    </div>
  )
}

export default function AssetManagerPage() {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <div className="h-full flex flex-col bg-ds-background text-ds-text-primary p-6 space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('Asset Manager', 'مدير الملفات')}</h1>
          <p className="text-xs text-ds-text-muted mt-1">
            {t('Manage your images, videos, and fonts for all projects.', 'إدارة الصور والوسائط والخطوط لجميع المشاريع.')}
          </p>
        </div>
        <button className="px-4 py-2 bg-ds-primary text-white text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-2">
          <span>{t('Upload New', 'رفع جديد')}</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div className="p-8 bg-ds-surface border-2 border-dashed border-ds-border rounded-xl flex flex-col items-center justify-center space-y-3 hover:border-ds-primary/50 transition-colors cursor-pointer group">
        <div className="w-12 h-12 rounded-full bg-ds-primary/10 flex items-center justify-center text-ds-primary group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">{t('Click or drag to upload assets', 'اضغط أو اسحب لرفع الملفات')}</p>
          <p className="text-xs text-ds-text-muted mt-1">{t('Support images, SVGs, and fonts (Max 50MB)', 'يدعم الصور، SVG، والخطوط (بحد أقصى 50 ميجابايت)')}</p>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {designAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  )
}
