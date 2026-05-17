'use client'

import { useMemo, useState } from 'react'
import { X, Search, Upload, GripVertical } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'
import { designAssets } from '@/lib/assets'
import AssetCard from './AssetCard'

export default function AssetManagerOverlay() {
  const { isAssetManagerOpen, closeAssetManager, lang } = useSessionStore()
  const [search, setSearch] = useState('')
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return designAssets

    return designAssets.filter((asset) =>
      `${asset.name} ${asset.type}`.toLowerCase().includes(query),
    )
  }, [search])

  if (!isAssetManagerOpen) return null

  return (
    <div className="fixed inset-0 z-[1100] bg-ds-overlay/80 backdrop-blur-sm p-4 md:p-6">
      <div className="mx-auto flex h-full max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-ds-border bg-ds-surface-elevated shadow-2xl">
        <div className="flex items-center justify-between border-b border-ds-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ds-primary/12 text-ds-primary">
              <GripVertical size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ds-text-primary">{t('Asset Manager', 'مدير الملفات')}</h2>
              <p className="text-xs text-ds-text-muted">
                {t('Drag assets from this window and drop them into your active workspace.', 'اسحب الملفات من النافذة دي وحطها جوه مساحة العمل اللي فاتحة.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl bg-ds-primary px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90">
              <Upload size={14} />
              <span>{t('Upload New', 'رفع جديد')}</span>
            </button>
            <button
              onClick={closeAssetManager}
              className="rounded-xl border border-ds-border bg-ds-background p-2 text-ds-text-muted transition-colors hover:text-ds-text-primary"
              aria-label={t('Close asset manager', 'إغلاق مدير الملفات')}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="border-b border-ds-border px-5 py-4">
          <label className="relative block">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ds-text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('Search assets, file types, and filenames', 'دور على الأصول أو النوع أو اسم الملف')}
              className="w-full rounded-2xl border border-ds-border bg-ds-background py-3 ps-10 pe-4 text-sm text-ds-text-primary outline-none transition-colors placeholder:text-ds-text-muted focus:border-ds-primary/50"
            />
          </label>
        </div>

        <div className="flex-1 overflow-auto px-5 py-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="flex h-48 items-center justify-center rounded-3xl border border-dashed border-ds-border bg-ds-background text-sm text-ds-text-muted">
              {t('No assets matched your search.', 'مفيش ملفات مطابقة للبحث.')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
