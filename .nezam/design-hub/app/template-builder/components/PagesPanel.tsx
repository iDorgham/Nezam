'use client'
import React, { useState } from 'react'
import {
  FileText, Plus, X, Globe, Pencil, Eye, EyeOff,
  Copy, Trash2, ChevronRight, MoreHorizontal,
  Home, BookOpen, DollarSign, Mail, Lock,
  ExternalLink, Search, ArrowUpDown, GripVertical,
} from 'lucide-react'
import {
  PanelHeader, PanelSection, PanelField, PanelInput,
  PanelSelect, PanelBadge, PanelButton, EmptyState, PanelToggle, PT,
} from './panel-primitives'

interface SitePage {
  id: string
  label: string
  labelAr?: string
  slug: string
  status: 'live' | 'draft' | 'private'
  type: 'landing' | 'blog' | 'legal' | 'custom' | 'auth'
  hasCustomSeo: boolean
  order: number
}

const DEFAULT_PAGES: SitePage[] = [
  { id: 'home',    label: 'Home',           slug: '/',         status: 'live',    type: 'landing', hasCustomSeo: true,  order: 0 },
  { id: 'about',   label: 'About Us',       slug: '/about',    status: 'live',    type: 'landing', hasCustomSeo: false, order: 1 },
  { id: 'pricing', label: 'Pricing',        slug: '/pricing',  status: 'draft',   type: 'landing', hasCustomSeo: false, order: 2 },
  { id: 'blog',    label: 'Blog',           slug: '/blog',     status: 'live',    type: 'blog',    hasCustomSeo: false, order: 3 },
  { id: 'contact', label: 'Contact',        slug: '/contact',  status: 'live',    type: 'landing', hasCustomSeo: false, order: 4 },
  { id: 'login',   label: 'Login',          slug: '/login',    status: 'private', type: 'auth',    hasCustomSeo: false, order: 5 },
]

const PAGE_ICONS: Record<string, React.ReactNode> = {
  landing: <Home size={10} />,
  blog:    <BookOpen size={10} />,
  legal:   <FileText size={10} />,
  custom:  <Globe size={10} />,
  auth:    <Lock size={10} />,
}

const STATUS_COLOR: Record<string, 'green' | 'amber' | 'default'> = {
  live: 'green', draft: 'amber', private: 'default',
}

const PAGE_TYPES = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'blog',    label: 'Blog' },
  { value: 'legal',   label: 'Legal' },
  { value: 'auth',    label: 'Auth / Login' },
  { value: 'custom',  label: 'Custom' },
]

interface PagesPanelProps {
  lang: string
  t: (en: string, ar: string) => string
}

export default function PagesPanel({ lang, t }: PagesPanelProps) {
  const [pages, setPages]           = useState<SitePage[]>(DEFAULT_PAGES)
  const [selectedId, setSelectedId] = useState<string | null>('home')
  const [searchQ, setSearchQ]       = useState('')
  const [addingNew, setAddingNew]   = useState(false)
  const [newLabel, setNewLabel]     = useState('')
  const [newSlug, setNewSlug]       = useState('')
  const [newType, setNewType]       = useState<SitePage['type']>('landing')

  const selected = pages.find(p => p.id === selectedId)

  const filteredPages = pages.filter(p =>
    p.label.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.slug.includes(searchQ.toLowerCase())
  )

  const updatePage = (id: string, patch: Partial<SitePage>) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))
  }

  const deletePage = (id: string) => {
    if (id === 'home') return
    setPages(prev => prev.filter(p => p.id !== id))
    if (selectedId === id) setSelectedId('home')
  }

  const addPage = () => {
    if (!newLabel.trim()) return
    const slug = newSlug || `/${newLabel.toLowerCase().replace(/\s+/g, '-')}`
    const id   = `page_${Date.now()}`
    setPages(prev => [...prev, { id, label: newLabel, slug, status: 'draft', type: newType, hasCustomSeo: false, order: prev.length }])
    setNewLabel(''); setNewSlug(''); setAddingNew(false); setSelectedId(id)
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: PT.bg }}>

      {/* ── Page list (left 55%) ── */}
      <div className="flex flex-col border-r" style={{ width: '52%', borderColor: PT.border }}>

        <PanelHeader
          icon={<FileText size={11} />}
          title={t('Pages', 'الصفحات')}
          subtitle={t(`${pages.length} pages`, `${pages.length} صفحة`)}
          actions={
            <button
              onClick={() => setAddingNew(v => !v)}
              className="w-6 h-6 flex items-center justify-center rounded-md transition-all hover:text-white"
              style={{ color: addingNew ? PT.primary : PT.textMuted, background: addingNew ? 'rgba(6,182,212,0.1)' : 'transparent' }}
            >
              <Plus size={11} />
            </button>
          }
        />

        {/* Search */}
        <div className="px-2 py-2 shrink-0">
          <div className="relative">
            <Search size={9} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: PT.textMuted }} />
            <input
              value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder={t('Search pages…', 'بحث…')}
              className="w-full pl-7 pr-2.5 py-1.5 text-[9px] rounded-md border outline-none transition-all"
              style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary }}
            />
          </div>
        </div>

        {/* Add new page form */}
        {addingNew && (
          <div className="mx-2 mb-2 p-2.5 rounded-lg border space-y-2" style={{ borderColor: PT.primary + '40', background: 'rgba(6,182,212,0.04)' }}>
            <PanelInput value={newLabel} onChange={setNewLabel} placeholder={t('Page name', 'اسم الصفحة')} />
            <PanelInput value={newSlug} onChange={setNewSlug} placeholder="/my-page" mono />
            <PanelSelect value={newType} onChange={v => setNewType(v as SitePage['type'])} options={PAGE_TYPES} />
            <div className="flex gap-1.5">
              <PanelButton variant="primary" size="xs" onClick={addPage} fullWidth>{t('Create', 'إنشاء')}</PanelButton>
              <PanelButton variant="ghost" size="xs" onClick={() => setAddingNew(false)}>
                <X size={9} />
              </PanelButton>
            </div>
          </div>
        )}

        {/* Page list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {filteredPages.map(page => (
            <div
              key={page.id}
              onClick={() => setSelectedId(page.id)}
              className="group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all"
              style={{
                background: selectedId === page.id ? 'rgba(6,182,212,0.08)' : 'transparent',
                border: `1px solid ${selectedId === page.id ? PT.primary + '30' : 'transparent'}`,
              }}
            >
              {/* Drag handle */}
              <GripVertical size={9} style={{ color: PT.textMuted }} className="opacity-0 group-hover:opacity-100 shrink-0" />

              {/* Status dot */}
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                page.status === 'live' ? 'bg-emerald-400' :
                page.status === 'draft' ? 'bg-amber-400' : 'bg-[#48484a]'
              }`} />

              {/* Icon + Label */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span style={{ color: selectedId === page.id ? PT.primary : PT.textMuted }}>
                  {PAGE_ICONS[page.type]}
                </span>
                <span className="text-[10px] font-medium truncate" style={{ color: selectedId === page.id ? PT.textPrimary : PT.textSecondary }}>
                  {page.label}
                </span>
              </div>

              {/* Delete */}
              {page.id !== 'home' && (
                <button
                  onClick={e => { e.stopPropagation(); deletePage(page.id) }}
                  className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded hover:text-red-400 transition-all"
                  style={{ color: PT.textMuted }}
                >
                  <X size={9} />
                </button>
              )}
            </div>
          ))}

          {filteredPages.length === 0 && (
            <EmptyState icon={<FileText size={16} />} title={t('No pages', 'لا توجد صفحات')} />
          )}
        </div>
      </div>

      {/* ── Page settings (right 45%) ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selected ? (
          <EmptyState icon={<FileText size={16} />} title={t('Select a page', 'اختر صفحة')} />
        ) : (
          <>
            {/* Mini header */}
            <div className="px-2.5 py-2.5 border-b shrink-0 flex items-center gap-1.5" style={{ borderColor: PT.border }}>
              <span className="text-[10px] font-semibold truncate flex-1" style={{ color: PT.textPrimary }}>{selected.label}</span>
              <PanelBadge color={STATUS_COLOR[selected.status]}>{selected.status}</PanelBadge>
            </div>

            <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-3">
              {/* Page name */}
              <PanelField label={t('Page Name', 'الاسم')}>
                <PanelInput
                  value={selected.label}
                  onChange={v => updatePage(selected.id, { label: v })}
                />
              </PanelField>

              {/* Slug */}
              <PanelField label={t('URL Slug', 'الرابط')} hint={t('e.g. /about', 'مثال: /about')}>
                <PanelInput
                  value={selected.slug}
                  onChange={v => updatePage(selected.id, { slug: v })}
                  mono
                />
              </PanelField>

              {/* Status */}
              <PanelField label={t('Status', 'الحالة')}>
                <PanelSelect
                  value={selected.status}
                  onChange={v => updatePage(selected.id, { status: v as SitePage['status'] })}
                  options={[
                    { value: 'live',    label: '🟢 Live' },
                    { value: 'draft',   label: '🟡 Draft' },
                    { value: 'private', label: '⚫ Private' },
                  ]}
                />
              </PanelField>

              {/* Type */}
              <PanelField label={t('Page Type', 'نوع الصفحة')}>
                <PanelSelect
                  value={selected.type}
                  onChange={v => updatePage(selected.id, { type: v as SitePage['type'] })}
                  options={PAGE_TYPES}
                />
              </PanelField>

              {/* Toggles */}
              <div className="space-y-1.5 pt-1 border-t" style={{ borderColor: PT.border }}>
                <PanelToggle
                  label={t('Show in Navigation', 'إظهار في التنقل')}
                  checked={true}
                  onChange={() => {}}
                />
                <PanelToggle
                  label={t('Index in Search', 'فهرسة في البحث')}
                  checked={selected.status === 'live'}
                  onChange={() => {}}
                />
              </div>

              {/* Actions */}
              <div className="pt-1 space-y-1.5">
                <PanelButton variant="default" size="xs" fullWidth icon={<ExternalLink size={9} />}>
                  {t('Preview Page', 'معاينة')}
                </PanelButton>
                <PanelButton variant="default" size="xs" fullWidth icon={<Copy size={9} />}>
                  {t('Duplicate', 'تكرار')}
                </PanelButton>
                {selected.id !== 'home' && (
                  <PanelButton variant="danger" size="xs" fullWidth icon={<Trash2 size={9} />}
                    onClick={() => deletePage(selected.id)}>
                    {t('Delete Page', 'حذف الصفحة')}
                  </PanelButton>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
