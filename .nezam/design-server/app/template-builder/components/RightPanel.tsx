'use client'
import React, { useState } from 'react'
import {
  Check, Save, Images, Monitor, Layers, Palette,
  AlignLeft, Globe, LayoutTemplate, Megaphone,
  MousePointer, Phone, Share2, ChevronLeft, ChevronRight,
} from 'lucide-react'
import {
  Card, CardHeader, FieldLabel, SegmentControl, OptionCard,
  ToggleRow, Select, Input, Divider, Badge,
} from './primitives'
import {
  headerStyleOptions, menuModeOptions, positionOptions,
  footerStyleOptions, footerColumnOptions, heroStyleOptions,
  websiteTypeOptions, topBarThemeOptions, colorPaletteOptions,
  fontOptions, buttonStyleOptions, buttonWeightOptions,
  inputVariantOptions, radiusOptions, spacingOptions,
} from './config'
import type { TemplateConfig } from '@/lib/store/session.store'
import type { WebsiteType, RadiusScale, TopBarTheme, ButtonStyle, InputVariant, FontValue } from './config'
import type { DesignSystemState } from './LeftPanel'

type Tab = 'preview' | 'structure' | 'design'

interface Props {
  templateConfig: TemplateConfig
  update: (u: Partial<TemplateConfig>) => void
  profiles: { name: string; category: string }[]
  onProfileClick: (name: string) => void
  lang: string; t: (en: string, ar: string) => string
  saving: boolean; saved: boolean; onSave: () => void
  openAssetManager: () => void
  websiteType: WebsiteType; setWebsiteType: (v: WebsiteType) => void
  showTopBar: boolean; setShowTopBar: (v: boolean) => void
  topBarText: string; setTopBarText: (v: string) => void
  topBarTheme: TopBarTheme; setTopBarTheme: (v: TopBarTheme) => void
  radius: RadiusScale; setRadius: (v: RadiusScale) => void
  ds: DesignSystemState; setDs: React.Dispatch<React.SetStateAction<DesignSystemState>>
}

const TABS = [
  { id: 'preview'  as Tab, icon: <Monitor  size={15} />, label: 'Preview'   },
  { id: 'structure'as Tab, icon: <Layers   size={15} />, label: 'Structure' },
  { id: 'design'   as Tab, icon: <Palette  size={15} />, label: 'Design'    },
]

export default function RightPanel(props: Props) {
  const { templateConfig: cfg, update, t, saving, saved, onSave, openAssetManager, ds, setDs } = props
  const [tab, setTab] = useState<Tab>('preview')
  const [profilePage, setProfilePage] = useState(0)
  const PER = 6
  const pages = Math.ceil(props.profiles.length / PER)
  const vis = props.profiles.slice(profilePage * PER, profilePage * PER + PER)

  return (
    <div className="flex h-full border-l border-ds-border overflow-hidden bg-ds-background">

      {/* ── Icon tab rail ── */}
      <div className="w-12 shrink-0 flex flex-col items-center py-3 gap-1.5 bg-ds-surface border-r border-ds-border">
        {TABS.map(({ id, icon, label }) => (
          <button key={id} title={label} onClick={() => setTab(id)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              tab === id
                ? 'bg-ds-primary text-white shadow-sm'
                : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover'
            }`}>
            {icon}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={openAssetManager} title="Asset Manager"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-ds-text-muted hover:text-ds-primary hover:bg-ds-primary/10 transition-all">
          <Images size={15} />
        </button>
        <button onClick={onSave} title={saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
            saved ? 'bg-emerald-600 text-white' : 'text-ds-text-muted hover:text-ds-primary hover:bg-ds-primary/10'
          }`}>
          {saved ? <Check size={15} /> : <Save size={15} />}
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab heading */}
        <div className="px-4 pt-4 pb-3 border-b border-ds-border shrink-0">
          <div className="text-sm font-semibold text-ds-text-primary">
            {tab === 'preview' ? 'Preview Context' : tab === 'structure' ? 'Page Structure' : 'Design System'}
          </div>
          <p className="text-xs text-ds-text-muted mt-0.5">
            {tab === 'preview' ? 'Industry type & announcement bar' : tab === 'structure' ? 'Header, hero, and footer layout' : 'Colors, typography, buttons & forms'}
          </p>
        </div>

        {/* Scrollable sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ════════ PREVIEW TAB ════════ */}
          {tab === 'preview' && (
            <>
              <Card>
                <CardHeader title={t('Industry Type', 'نوع الصناعة')} description={t('Swaps preview content, nav links, hero copy, and announcement.', 'يغير محتوى المعاينة والقائمة.')} icon={<Globe size={14} />} />
                <div className="grid grid-cols-2 gap-2">
                  {websiteTypeOptions.map(opt => (
                    <OptionCard key={opt.value}
                      active={props.websiteType === opt.value}
                      onClick={() => props.setWebsiteType(opt.value as WebsiteType)}
                      label={t(opt.label, opt.labelAr)} />
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title={t('Announcement Bar', 'شريط الإعلانات')} icon={<Megaphone size={14} />} />
                <ToggleRow active={props.showTopBar} onClick={() => props.setShowTopBar(!props.showTopBar)}
                  label={t('Show top announcement bar', 'إظهار شريط الإعلان العلوي')}
                  description={t('Displays above the main navigation header', 'يظهر فوق شريط التنقل الرئيسي')} />
                {props.showTopBar && (
                  <>
                    <Divider label={t('Theme', 'اللون')} />
                    <div className="grid grid-cols-3 gap-1.5">
                      {topBarThemeOptions.map(o => (
                        <button key={o.value} onClick={() => props.setTopBarTheme(o.value as TopBarTheme)}
                          className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                            props.topBarTheme === o.value
                              ? 'border-ds-primary bg-ds-primary/5 text-ds-primary ring-1 ring-ds-primary/20'
                              : 'border-ds-border text-ds-text-muted hover:border-ds-border-hover'
                          }`}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                    <Divider label={t('Copy', 'النص')} />
                    <Input value={props.topBarText} onChange={props.setTopBarText} placeholder="Enter announcement text…" />
                  </>
                )}
              </Card>
            </>
          )}

          {/* ════════ STRUCTURE TAB ════════ */}
          {tab === 'structure' && (
            <>
              {/* Header */}
              <Card>
                <CardHeader title={t('Header', 'الهيدر')} description={t('Navigation bar style, menu mode, and alignment.', 'نمط شريط التنقل ووضع القائمة.')} icon={<AlignLeft size={14} />} />
                <FieldLabel>{t('Header Style', 'نمط الهيدر')}</FieldLabel>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {headerStyleOptions.map(o => (
                    <OptionCard key={o.value} active={cfg.headerStyle === o.value}
                      onClick={() => update({ headerStyle: o.value })}
                      label={o.label} description={o.desc} />
                  ))}
                </div>

                <FieldLabel>{t('Menu Mode', 'وضع القائمة')}</FieldLabel>
                <SegmentControl value={cfg.headerMenuMode} onChange={v => update({ headerMenuMode: v as any })}
                  options={menuModeOptions.map(o => ({ value: o.value, label: o.label }))} />

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <FieldLabel>{t('Logo Position', 'موضع اللوجو')}</FieldLabel>
                    <Select value={cfg.headerLogoPosition} onChange={v => update({ headerLogoPosition: v as any })}
                      options={positionOptions.map(o => ({ value: o.value, label: o.label }))} />
                  </div>
                  <div>
                    <FieldLabel>{t('Menu Position', 'موضع القائمة')}</FieldLabel>
                    <Select value={cfg.headerMenuPosition} onChange={v => update({ headerMenuPosition: v as any })}
                      options={positionOptions.map(o => ({ value: o.value, label: o.label }))} />
                  </div>
                </div>

                <Divider label={t('Extra Elements', 'العناصر الإضافية')} />
                <div className="divide-y divide-ds-border/50">
                  <ToggleRow active={cfg.headerShowCta} icon={<MousePointer size={13} />} onClick={() => update({ headerShowCta: !cfg.headerShowCta })} label={t('CTA Button', 'زر الإجراء')} description={t('Primary call-to-action in header', 'زر الدعوة للإجراء في الهيدر')} />
                  <ToggleRow active={cfg.headerShowSocials} icon={<Share2 size={13} />} onClick={() => update({ headerShowSocials: !cfg.headerShowSocials })} label={t('Social Links', 'روابط التواصل')} />
                  <ToggleRow active={cfg.headerShowPhone} icon={<Phone size={13} />} onClick={() => update({ headerShowPhone: !cfg.headerShowPhone })} label={t('Phone Number', 'رقم الهاتف')} />
                </div>
              </Card>

              {/* Hero */}
              <Card>
                <CardHeader title={t('Hero Section', 'قسم الهيرو')} description={t('First-fold landing page layout.', 'تخطيط الصفحة الأولى.')} icon={<LayoutTemplate size={14} />} />
                <div className="space-y-2">
                  {heroStyleOptions.map(o => (
                    <OptionCard key={o.value} active={cfg.heroStyle === o.value}
                      onClick={() => update({ heroStyle: o.value })}
                      label={o.label} description={o.desc} />
                  ))}
                </div>
              </Card>

              {/* Footer */}
              <Card>
                <CardHeader title={t('Footer', 'الفوتر')} icon={<AlignLeft size={14} />} />
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {footerStyleOptions.map(o => (
                    <OptionCard key={o.value} active={cfg.footerStyle === o.value}
                      onClick={() => update({ footerStyle: o.value })}
                      label={o.label} description={o.desc} />
                  ))}
                </div>
                {cfg.footerStyle === 'big' && (
                  <>
                    <FieldLabel>{t('Column Count', 'عدد الأعمدة')}</FieldLabel>
                    <SegmentControl value={cfg.footerColumns}
                      onChange={v => update({ footerColumns: Number(v) as any })}
                      options={footerColumnOptions.map(o => ({ value: o.value, label: o.label }))} />
                  </>
                )}
                <Divider label={t('Elements', 'العناصر')} />
                <div className="divide-y divide-ds-border/50">
                  <ToggleRow active={cfg.footerShowSocials} icon={<Share2 size={13} />} onClick={() => update({ footerShowSocials: !cfg.footerShowSocials })} label={t('Social Icons', 'أيقونات التواصل')} />
                  <ToggleRow active={cfg.footerShowPhone} icon={<Phone size={13} />} onClick={() => update({ footerShowPhone: !cfg.footerShowPhone })} label={t('Phone Number', 'رقم الهاتف')} />
                </div>
              </Card>
            </>
          )}

          {/* ════════ DESIGN TAB ════════ */}
          {tab === 'design' && (
            <>
              {/* Colors */}
              <Card>
                <CardHeader title={t('Color Palette', 'لوحة الألوان')} description={t('Primary brand color and surface scheme.', 'لون العلامة التجارية وخطط الخلفية.')} icon={<Palette size={14} />} />
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {colorPaletteOptions.map(o => {
                    const active = cfg.colorProfile === o.value
                    return (
                      <button key={o.value} onClick={() => props.onProfileClick(o.value)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                          active ? 'border-ds-primary' : 'border-transparent hover:border-ds-border'
                        }`}>
                        <div className="w-full h-6 rounded-md flex overflow-hidden shadow-sm">
                          <span className="flex-1" style={{ background: o.primary }} />
                          <span className="flex-1" style={{ background: o.bg, borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
                        </div>
                        <span className="text-[8px] font-medium text-ds-text-muted text-center leading-tight w-full truncate">{o.label}</span>
                        {active && <Check size={8} className="text-ds-primary" />}
                      </button>
                    )
                  })}
                </div>

                {props.profiles.length > 0 && (
                  <>
                    <Divider label={t('Workspace Profiles', 'ملفات مساحة العمل')} />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-ds-text-muted">{props.profiles.length} {t('custom profiles', 'ملف مخصص')}</span>
                      {pages > 1 && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setProfilePage(p => Math.max(0, p - 1))} disabled={profilePage === 0}
                            className="w-6 h-6 flex items-center justify-center rounded border border-ds-border text-ds-text-muted hover:text-ds-text-primary disabled:opacity-30 transition-all">
                            <ChevronLeft size={11} />
                          </button>
                          <span className="text-[10px] text-ds-text-muted px-1">{profilePage + 1}/{pages}</span>
                          <button onClick={() => setProfilePage(p => Math.min(pages - 1, p + 1))} disabled={profilePage >= pages - 1}
                            className="w-6 h-6 flex items-center justify-center rounded border border-ds-border text-ds-text-muted hover:text-ds-text-primary disabled:opacity-30 transition-all">
                            <ChevronRight size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {vis.map(p => (
                        <button key={p.name} onClick={() => props.onProfileClick(p.name)}
                          className={`p-2.5 rounded-lg border text-start transition-all ${
                            cfg.colorProfile === p.name
                              ? 'border-ds-primary bg-ds-primary/5 ring-1 ring-ds-primary/20'
                              : 'border-ds-border bg-ds-background hover:border-ds-border-hover'
                          }`}>
                          <div className="text-xs font-semibold text-ds-text-primary truncate">{p.name}</div>
                          <div className="text-[10px] text-ds-text-muted mt-0.5 truncate">{p.category}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </Card>

              {/* Typography */}
              <Card>
                <CardHeader title={t('Typography', 'الخطوط')} description={t('Font family applied globally across all preview text.', 'عائلة الخط المطبقة على كل النصوص.')} />
                <div className="space-y-1">
                  {fontOptions.map(f => {
                    const active = ds.font === f.value
                    return (
                      <button key={f.value} onClick={() => setDs(d => ({ ...d, font: f.value as FontValue }))}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                          active ? 'border-ds-primary bg-ds-primary/5 ring-1 ring-ds-primary/20' : 'border-ds-border bg-ds-background hover:border-ds-border-hover hover:bg-ds-surface'
                        }`}>
                        <div className="text-start min-w-0">
                          <div className={`text-xs font-semibold ${active ? 'text-ds-primary' : 'text-ds-text-primary'}`} style={{ fontFamily: f.stack }}>{f.label}</div>
                          <div className="text-[10px] text-ds-text-muted mt-0.5 truncate" style={{ fontFamily: f.stack }}>{f.specimen}</div>
                        </div>
                        {active && <Check size={12} className="text-ds-primary shrink-0 ml-2" />}
                      </button>
                    )
                  })}
                </div>
              </Card>

              {/* Buttons */}
              <Card>
                <CardHeader title={t('Button System', 'نظام الأزرار')} description={t('Visual style and weight applied to all CTA buttons.', 'نمط ووزن أزرار الإجراء في المعاينة.')} />
                <FieldLabel>{t('Button Variant', 'نوع الزر')}</FieldLabel>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {buttonStyleOptions.map(o => {
                    const active = ds.buttonStyle === o.value
                    const previewMap: Record<string, string> = {
                      solid:   'bg-ds-primary text-white',
                      outline: 'border-2 border-ds-primary text-ds-primary bg-transparent',
                      ghost:   'bg-transparent text-ds-primary',
                      soft:    'bg-ds-primary/10 text-ds-primary',
                    }
                    return (
                      <OptionCard key={o.value} active={active}
                        onClick={() => setDs(d => ({ ...d, buttonStyle: o.value as ButtonStyle }))}
                        label={o.label} description={o.desc}
                        preview={
                          <div className="flex justify-center mb-1">
                            <span className={`px-3 py-1 text-[10px] font-semibold rounded-md ${previewMap[o.value] ?? ''}`}>Button</span>
                          </div>
                        } />
                    )
                  })}
                </div>
                <FieldLabel>{t('Font Weight', 'وزن الخط')}</FieldLabel>
                <SegmentControl value={ds.buttonWeight}
                  onChange={v => setDs(d => ({ ...d, buttonWeight: v }))}
                  options={buttonWeightOptions.map(o => ({ value: o.value, label: o.label }))} />
              </Card>

              {/* Form Inputs */}
              <Card>
                <CardHeader title={t('Form Inputs', 'حقول النماذج')} description={t('Input field style applied across all form elements.', 'نمط الحقول في جميع النماذج.')} />
                <FieldLabel>{t('Input Variant', 'نمط الحقل')}</FieldLabel>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {inputVariantOptions.map(o => {
                    const active = ds.inputVariant === o.value
                    const prevMap: Record<string, string> = {
                      outlined:  'border border-ds-border rounded-lg',
                      underline: 'border-b border-ds-border rounded-none',
                      filled:    'bg-ds-surface-elevated rounded-lg',
                      soft:      'bg-ds-primary/8 border border-ds-primary/25 rounded-lg',
                    }
                    return (
                      <OptionCard key={o.value} active={active}
                        onClick={() => setDs(d => ({ ...d, inputVariant: o.value as InputVariant }))}
                        label={o.label} description={o.desc}
                        preview={
                          <div className={`w-full px-2 py-1 text-[10px] text-ds-text-muted ${prevMap[o.value] ?? ''}`}>Email address</div>
                        } />
                    )
                  })}
                </div>
                <FieldLabel>{t('Global Style', 'النمط العام')}</FieldLabel>
                <SegmentControl value={cfg.formStyle} onChange={v => update({ formStyle: v })}
                  options={[{ value: 'minimal', label: t('Minimal', 'بسيط') }, { value: 'outlined', label: t('Outlined', 'محدد') }]} />
              </Card>

              {/* Border Radius */}
              <Card>
                <CardHeader title={t('Border Radius', 'انحناء الحواف')} description={t('Corner radius token applied to all components.', 'رمز انحناء الزوايا المطبق على المكونات.')} />
                <div className="grid grid-cols-5 gap-2">
                  {radiusOptions.map(o => {
                    const active = props.radius === o.value
                    return (
                      <button key={o.value} onClick={() => props.setRadius(o.value as RadiusScale)}
                        className={`flex flex-col items-center gap-2 p-2.5 rounded-lg border transition-all ${
                          active ? 'border-ds-primary bg-ds-primary/5 ring-1 ring-ds-primary/20' : 'border-ds-border bg-ds-background hover:border-ds-border-hover'
                        }`}>
                        <div className={`w-6 h-6 border-2 ${active ? 'border-ds-primary' : 'border-ds-border-hover'}`}
                          style={{ borderRadius: o.px >= 999 ? '50%' : `${o.px}px` }} />
                        <span className={`text-[9px] font-semibold ${active ? 'text-ds-primary' : 'text-ds-text-muted'}`}>{o.label}</span>
                      </button>
                    )
                  })}
                </div>
              </Card>

              {/* Density */}
              <Card>
                <CardHeader title={t('Layout Density', 'كثافة التخطيط')} description={t('Spacing scale for padding and gutters.', 'مقياس المسافات للحشو والأعمدة.')} />
                <div className="space-y-2">
                  {spacingOptions.map(o => {
                    const active = cfg.spacing === o.value
                    const w = { compact: '28%', balanced: '56%', spacious: '100%' }[o.value] ?? '56%'
                    return (
                      <button key={o.value} onClick={() => update({ spacing: o.value })}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                          active ? 'border-ds-primary bg-ds-primary/5 ring-1 ring-ds-primary/20' : 'border-ds-border bg-ds-background hover:border-ds-border-hover hover:bg-ds-surface'
                        }`}>
                        <div className="flex flex-col gap-1 shrink-0 w-8">
                          <div className={`h-1 rounded-full ${active ? 'bg-ds-primary' : 'bg-ds-border-hover'}`} style={{ width: w }} />
                          <div className={`h-1 rounded-full ${active ? 'bg-ds-primary/40' : 'bg-ds-border/50'} w-full`} />
                        </div>
                        <div className="text-start flex-1 min-w-0">
                          <div className={`text-xs font-semibold ${active ? 'text-ds-primary' : 'text-ds-text-primary'}`}>{o.label}</div>
                          <div className="text-[10px] text-ds-text-muted mt-0.5">{o.desc}</div>
                        </div>
                        {active && <Check size={12} className="text-ds-primary shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
