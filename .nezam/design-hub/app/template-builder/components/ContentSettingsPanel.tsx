'use client'

import React, { useState } from 'react'
import { FileEdit, Globe, Calendar, Eye, Link } from 'lucide-react'
import { PT, PanelHeader, PanelSection, PanelField, PanelInput, PanelTextarea, PanelToggle, PanelSelect, PanelButton, PanelBadge } from './panel-primitives'

type PublishStatus = 'draft' | 'review' | 'published' | 'scheduled'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
]

const ROBOTS_OPTIONS = [
  { value: 'index,follow', label: 'Index, Follow' },
  { value: 'noindex,follow', label: 'No Index, Follow' },
  { value: 'index,nofollow', label: 'Index, No Follow' },
  { value: 'noindex,nofollow', label: 'No Index, No Follow' },
]

function CharCounter({ value, max, warn = 0.85 }: { value: string; max: number; warn?: number }) {
  const count = value.length
  const pct = count / max
  const color = pct >= 1 ? '#ef4444' : pct >= warn ? '#f59e0b' : 'var(--pt-text-muted, #48484a)'
  return (
    <span className="text-[8px] tabular-nums" style={{ color }}>
      {count}/{max}
    </span>
  )
}

function SlugPreview({ slug }: { slug: string }) {
  const clean = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-/]/g, '')
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-md border text-[9px]"
      style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textMuted }}>
      <Globe size={9} />
      <span className="truncate">yourdomain.com<span style={{ color: PT.textPrimary }}>{clean || '/page-slug'}</span></span>
    </div>
  )
}

export default function ContentSettingsPanel({ lang }: { lang: string }) {
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  const [title, setTitle] = useState('Getting Started Guide')
  const [slug, setSlug] = useState('/blog/getting-started')
  const [metaDesc, setMetaDesc] = useState('Learn how to get started with NEZAM in under 10 minutes.')
  const [ogTitle, setOgTitle] = useState('')
  const [ogImage, setOgImage] = useState('')
  const [canonical, setCanonical] = useState('')
  const [robots, setRobots] = useState('index,follow')
  const [isPublished, setIsPublished] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')
  const [status, setStatus] = useState<PublishStatus>('draft')
  const [saved, setSaved] = useState(false)

  function autoSlug(val: string) {
    setTitle(val)
    if (!slug || slug === '/page-slug') {
      setSlug('/' + val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const statusBadgeColor: Record<PublishStatus, 'amber' | 'default' | 'green' | 'primary'> = {
    draft: 'amber', review: 'primary', published: 'green', scheduled: 'default',
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PT.bg }}>
      <PanelHeader
        icon={<FileEdit size={12} />}
        title={t('Content Settings', 'إعدادات المحتوى')}
        subtitle={t('SEO · Publishing', 'SEO · النشر')}
        actions={
          <PanelBadge color={statusBadgeColor[status]}>
            {status}
          </PanelBadge>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Basic */}
        <PanelSection title={t('Basic', 'أساسي')} defaultOpen>
          <PanelField label={t('Title', 'العنوان')} hint={<CharCounter value={title} max={60} />} row={false}>
            <PanelInput value={title} onChange={autoSlug} placeholder={t('Page title', 'عنوان الصفحة')} />
          </PanelField>

          <PanelField label={t('Slug', 'الرابط')} row={false}>
            <PanelInput value={slug} onChange={setSlug} placeholder="/page-slug" mono />
            <div className="mt-1">
              <SlugPreview slug={slug} />
            </div>
          </PanelField>

          <PanelField label={t('Meta Description', 'وصف ميتا')} hint={<CharCounter value={metaDesc} max={155} warn={0.9} />} row={false}>
            <PanelTextarea value={metaDesc} onChange={setMetaDesc} placeholder={t('Brief page description for search engines', 'وصف مختصر للصفحة لمحركات البحث')} rows={3} />
            {/* Progress bar */}
            <div className="mt-1 h-0.5 rounded-full overflow-hidden" style={{ background: PT.border }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((metaDesc.length / 155) * 100, 100)}%`,
                  background: metaDesc.length > 155 ? '#ef4444' : metaDesc.length > 130 ? '#f59e0b' : 'var(--ds-primary)',
                }}
              />
            </div>
          </PanelField>
        </PanelSection>

        {/* SEO */}
        <PanelSection title="SEO" defaultOpen={false}>
          <PanelField label={t('OG Title', 'عنوان OG')} row={false}>
            <PanelInput value={ogTitle} onChange={setOgTitle} placeholder={t('Overrides page title on social', 'يتجاوز عنوان الصفحة على وسائل التواصل')} />
          </PanelField>

          <PanelField label={t('OG Image URL', 'رابط صورة OG')} row={false}>
            <PanelInput value={ogImage} onChange={setOgImage} placeholder="https://…/og.jpg" />
          </PanelField>

          <PanelField label={t('Canonical URL', 'الرابط الأساسي')} row={false}>
            <div className="flex items-center gap-1.5">
              <Link size={9} style={{ color: PT.textMuted, flexShrink: 0 }} />
              <PanelInput value={canonical} onChange={setCanonical} placeholder="https://…/page" />
            </div>
          </PanelField>

          <PanelField label="Robots" row={false}>
            <PanelSelect value={robots} onChange={setRobots} options={ROBOTS_OPTIONS} />
          </PanelField>
        </PanelSection>

        {/* Publishing */}
        <PanelSection title={t('Publishing', 'النشر')} defaultOpen={false}>
          <PanelField label={t('Status', 'الحالة')} row={false}>
            <PanelSelect
              value={status}
              onChange={v => setStatus(v as PublishStatus)}
              options={STATUS_OPTIONS.map(o => ({ ...o, label: t(o.label, o.label) }))}
            />
          </PanelField>

          <PanelToggle
            label={t('Published', 'منشور')}
            desc={t('Make this page publicly visible', 'اجعل هذه الصفحة مرئية للعامة')}
            checked={isPublished}
            onChange={v => { setIsPublished(v); if (v) setStatus('published') }}
          />

          <PanelField label={t('Schedule At', 'جدولة النشر')} row={false}>
            <input
              type="datetime-local"
              value={scheduleAt}
              onChange={e => { setScheduleAt(e.target.value); if (e.target.value) setStatus('scheduled') }}
              className="w-full px-2.5 py-1.5 text-[10px] rounded-md border outline-none"
              style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary, colorScheme: 'dark' }}
              aria-label={t('Schedule publish date and time', 'جدولة تاريخ ووقت النشر')}
            />
          </PanelField>

          {scheduleAt && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[9px]"
              style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.2)', color: 'var(--ds-primary)' }}>
              <Calendar size={9} />
              {t('Will publish', 'سيُنشر')}: {new Date(scheduleAt).toLocaleString()}
            </div>
          )}

          <PanelField label={t('Preview', 'معاينة')} row={false}>
            <PanelButton variant="ghost" size="xs" fullWidth icon={<Eye size={10} />}>
              {t('Open Preview', 'فتح المعاينة')}
            </PanelButton>
          </PanelField>
        </PanelSection>
      </div>

      {/* Save footer */}
      <div className="shrink-0 px-3 py-2 border-t" style={{ borderColor: PT.border }}>
        <PanelButton variant="primary" size="sm" fullWidth onClick={save}>
          {saved ? t('Saved ✓', 'تم الحفظ ✓') : t('Save Changes', 'حفظ التغييرات')}
        </PanelButton>
      </div>
    </div>
  )
}
