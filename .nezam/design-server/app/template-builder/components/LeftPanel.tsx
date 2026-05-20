'use client'
import React, { useState } from 'react'
import {
  Check, Images, Save, Monitor, Globe, Layers, Type, Square, MousePointer,
  FormInput, AlignLeft, AlignCenter, Phone, Share2, ChevronLeft, ChevronRight
} from 'lucide-react'
import {
  Section, FieldLabel, SegmentControl, OptionCard, ToggleRow,
  Select, Input, Divider
} from './primitives'
import {
  fontOptions, colorPaletteOptions, buttonStyleOptions, buttonWeightOptions,
  inputVariantOptions, headerStyleOptions, menuModeOptions, positionOptions,
  footerStyleOptions, footerColumnOptions, heroStyleOptions, spacingOptions,
  radiusOptions, topBarThemeOptions, websiteTypeOptions,
} from './config'
import type { TemplateConfig } from '@/lib/store/session.store'
import type { WebsiteType, RadiusScale, TopBarTheme, ButtonStyle, InputVariant, FontValue, ColorPalette } from './config'

// ── Local design system state (not persisted to templateConfig) ───────────────
export interface DesignSystemState {
  font: FontValue
  colorPalette: ColorPalette
  buttonStyle: ButtonStyle
  buttonWeight: string
  inputVariant: InputVariant
  inputSize: string
}

interface Props {
  templateConfig: TemplateConfig
  update: (u: Partial<TemplateConfig>) => void
  profiles: { name: string; category: string }[]
  onProfileClick: (name: string) => void
  lang: string
  t: (en: string, ar: string) => string
  saving: boolean; saved: boolean; onSave: () => void
  openAssetManager: () => void
  // preview state
  websiteType: WebsiteType; setWebsiteType: (v: WebsiteType) => void
  showTopBar: boolean; setShowTopBar: (v: boolean) => void
  topBarText: string; setTopBarText: (v: string) => void
  topBarTheme: TopBarTheme; setTopBarTheme: (v: TopBarTheme) => void
  radius: RadiusScale; setRadius: (v: RadiusScale) => void
  // design system state
  ds: DesignSystemState; setDs: React.Dispatch<React.SetStateAction<DesignSystemState>>
}

type Tab = 'preview' | 'structure' | 'design' | 'tokens'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'preview',   label: 'Preview',   icon: <Monitor size={12} /> },
  { id: 'structure', label: 'Structure', icon: <Layers size={12} /> },
  { id: 'design',    label: 'Design',    icon: <Square size={12} /> },
  { id: 'tokens',    label: 'Tokens',    icon: <Type size={12} /> },
]

export default function LeftPanel(props: Props) {
  const { templateConfig: cfg, update, ds, setDs, t, saving, saved, onSave, openAssetManager } = props
  const [tab, setTab] = useState<Tab>('preview')
  const [profilePage, setProfilePage] = useState(0)
  const PER = 6
  const pages = Math.ceil(props.profiles.length / PER)
  const vis = props.profiles.slice(profilePage * PER, profilePage * PER + PER)

  return (
    <div className="flex flex-col h-full bg-ds-surface border-r border-ds-border">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ds-border bg-ds-background shrink-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-[12px] font-semibold text-ds-text-primary">Design Studio</h1>
          <p className="text-[10px] text-ds-text-muted truncate">{t('Template Builder', 'باني القوالب')}</p>
        </div>
        <button onClick={openAssetManager} title="Assets" className="p-2 rounded-lg border border-ds-border hover:bg-ds-surface-hover text-ds-text-muted hover:text-ds-text-primary transition-all">
          <Images size={13} />
        </button>
        <button onClick={onSave} disabled={saving}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold text-white transition-all ${saved ? 'bg-emerald-600' : 'bg-[var(--ds-primary)] hover:opacity-90 active:scale-95'}`}>
          {saved ? <Check size={12} /> : <Save size={12} />}
          {saving ? '…' : saved ? t('Saved', 'تم') : t('Save', 'حفظ')}
        </button>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex border-b border-ds-border bg-ds-background shrink-0 px-2 pt-2 gap-1">
        {TABS.map(({ id, label, icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold rounded-t-lg border-b-2 transition-all -mb-px ${
              tab === id
                ? 'border-[var(--ds-primary)] text-[var(--ds-primary)] bg-ds-surface'
                : 'border-transparent text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface/60'
            }`}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-ds-background">

        {/* ──────────────────────── TAB: PREVIEW ──────────────────────── */}
        {tab === 'preview' && (
          <>
            <Section title="Website Industry" description="Changes preview content, nav links, and announcement copy." icon={<Globe size={13} />}>
              <div className="grid grid-cols-2 gap-2">
                {websiteTypeOptions.map(opt => (
                  <OptionCard key={opt.value}
                    active={props.websiteType === opt.value}
                    onClick={() => props.setWebsiteType(opt.value as WebsiteType)}
                    label={t(opt.label, opt.labelAr)}
                  />
                ))}
              </div>
            </Section>

            <Section title="Announcement Bar" icon={<AlignCenter size={13} />}>
              <ToggleRow active={props.showTopBar} onClick={() => props.setShowTopBar(!props.showTopBar)}
                label={t('Show Top Bar', 'إظهار شريط الإعلان')} description={t('Sits above the main navigation','يظهر أعلى شريط التنقل')} />
              {props.showTopBar && (
                <>
                  <Divider />
                  <FieldLabel>{t('Theme', 'اللون')}</FieldLabel>
                  <div className="flex gap-2">
                    {topBarThemeOptions.map(o => (
                      <button key={o.value} onClick={() => props.setTopBarTheme(o.value as TopBarTheme)}
                        className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg border transition-all ${
                          props.topBarTheme === o.value ? 'border-[var(--ds-primary)] text-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]' : 'border-ds-border text-ds-text-muted hover:border-ds-border-hover'
                        }`}>{o.label}</button>
                    ))}
                  </div>
                  <FieldLabel>{t('Announcement Text', 'نص الإعلان')}</FieldLabel>
                  <Input value={props.topBarText} onChange={props.setTopBarText} placeholder="Enter announcement…" />
                </>
              )}
            </Section>
          </>
        )}

        {/* ──────────────────────── TAB: STRUCTURE ──────────────────────── */}
        {tab === 'structure' && (
          <>
            {/* Header */}
            <Section title="Header Layout" description="Navigation bar style, menu mode, and alignment." icon={<AlignLeft size={13} />}>
              <FieldLabel>{t('Header Style', 'نوع الهيدر')}</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {headerStyleOptions.map(o => (
                  <OptionCard key={o.value} active={cfg.headerStyle === o.value}
                    onClick={() => update({ headerStyle: o.value })}
                    label={o.label} description={o.desc} />
                ))}
              </div>

              <Divider label="Menu" />
              <FieldLabel>{t('Menu Mode', 'نوع القائمة')}</FieldLabel>
              <SegmentControl value={cfg.headerMenuMode} onChange={v => update({ headerMenuMode: v as any })}
                options={menuModeOptions.map(o => ({ value: o.value, label: o.label }))} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>{t('Logo Align', 'اللوجو')}</FieldLabel>
                  <Select value={cfg.headerLogoPosition} onChange={v => update({ headerLogoPosition: v as any })}
                    options={positionOptions.map(o => ({ value: o.value, label: o.label }))} />
                </div>
                <div>
                  <FieldLabel>{t('Menu Align', 'القائمة')}</FieldLabel>
                  <Select value={cfg.headerMenuPosition} onChange={v => update({ headerMenuPosition: v as any })}
                    options={positionOptions.map(o => ({ value: o.value, label: o.label }))} />
                </div>
              </div>

              <Divider label="Extras" />
              <div className="space-y-1 divide-y divide-ds-border/40">
                <ToggleRow active={cfg.headerShowCta} onClick={() => update({ headerShowCta: !cfg.headerShowCta })}
                  icon={<MousePointer size={13} />} label={t('CTA Button', 'زر الإجراء')} description={t('Primary call-to-action in header', 'زر الدعوة للإجراء في الهيدر')} />
                <ToggleRow active={cfg.headerShowSocials} onClick={() => update({ headerShowSocials: !cfg.headerShowSocials })}
                  icon={<Share2 size={13} />} label={t('Social Links', 'روابط التواصل')} description={t('Social icons in navigation bar', 'أيقونات التواصل في الهيدر')} />
                <ToggleRow active={cfg.headerShowPhone} onClick={() => update({ headerShowPhone: !cfg.headerShowPhone })}
                  icon={<Phone size={13} />} label={t('Phone Number', 'رقم الهاتف')} description={t('Direct contact line in header', 'خط تواصل مباشر في الهيدر')} />
              </div>
            </Section>

            {/* Hero */}
            <Section title="Hero Section" description="Landing page first-fold layout style." icon={<Monitor size={13} />}>
              <div className="space-y-2">
                {heroStyleOptions.map(o => (
                  <OptionCard key={o.value} active={cfg.heroStyle === o.value}
                    onClick={() => update({ heroStyle: o.value })}
                    label={o.label} description={o.desc} />
                ))}
              </div>
            </Section>

            {/* Footer */}
            <Section title="Footer Structure" icon={<AlignLeft size={13} />}>
              <div className="grid grid-cols-2 gap-2">
                {footerStyleOptions.map(o => (
                  <OptionCard key={o.value} active={cfg.footerStyle === o.value}
                    onClick={() => update({ footerStyle: o.value })}
                    label={o.label} description={o.desc} />
                ))}
              </div>
              {cfg.footerStyle === 'big' && (
                <>
                  <Divider label="Columns" />
                  <SegmentControl value={cfg.footerColumns}
                    onChange={v => update({ footerColumns: Number(v) as any })}
                    options={footerColumnOptions.map(o => ({ value: o.value, label: o.label }))} />
                </>
              )}
              <Divider label="Elements" />
              <div className="space-y-1 divide-y divide-ds-border/40">
                <ToggleRow active={cfg.footerShowSocials} onClick={() => update({ footerShowSocials: !cfg.footerShowSocials })}
                  icon={<Share2 size={13} />} label={t('Social Icons', 'أيقونات التواصل')} />
                <ToggleRow active={cfg.footerShowPhone} onClick={() => update({ footerShowPhone: !cfg.footerShowPhone })}
                  icon={<Phone size={13} />} label={t('Phone Number', 'رقم الهاتف')} />
              </div>
            </Section>
          </>
        )}

        {/* ──────────────────────── TAB: DESIGN ──────────────────────── */}
        {tab === 'design' && (
          <>
            {/* Color Palette */}
            <Section title="Color Palette" description="Primary brand color and background scheme." icon={<Square size={13} />}>
              <div className="grid grid-cols-4 gap-2">
                {colorPaletteOptions.map(o => (
                  <button key={o.value} onClick={() => update({ colorProfile: o.value })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                      cfg.colorProfile === o.value ? 'border-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]' : 'border-ds-border hover:border-ds-border-hover'
                    }`}>
                    <div className="flex gap-1">
                      <span className="w-4 h-4 rounded-sm shadow" style={{ background: o.primary }} />
                      <span className="w-4 h-4 rounded-sm" style={{ background: o.bg, border: '1px solid #ffffff18' }} />
                    </div>
                    <span className="text-[8px] text-ds-text-muted text-center leading-tight w-full truncate">{o.label}</span>
                    {cfg.colorProfile === o.value && <Check size={8} className="text-[var(--ds-primary)]" />}
                  </button>
                ))}
              </div>

              <Divider label="Workspace Profiles" />
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-ds-text-muted font-medium">{props.profiles.length} {t('custom profiles', 'ملف مخصص')}</span>
                {pages > 1 && (
                  <div className="flex items-center gap-1 text-[9px] text-ds-text-muted">
                    <button onClick={() => setProfilePage(p => Math.max(0, p - 1))} disabled={profilePage === 0} className="disabled:opacity-30 hover:text-ds-text-primary p-0.5 rounded" aria-label="Previous page">
                      <ChevronLeft size={12} />
                    </button>
                    <span>{profilePage + 1}/{pages}</span>
                    <button onClick={() => setProfilePage(p => Math.min(pages - 1, p + 1))} disabled={profilePage >= pages - 1} className="disabled:opacity-30 hover:text-ds-text-primary p-0.5 rounded" aria-label="Next page">
                      <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </div>
              {vis.length > 0 ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {vis.map(p => (
                    <button key={p.name} onClick={() => props.onProfileClick(p.name)}
                      className={`p-2.5 rounded-lg border text-start transition-all ${
                        cfg.colorProfile === p.name ? 'border-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]' : 'border-ds-border bg-ds-surface hover:border-ds-border-hover'
                      }`}>
                      <div className="text-[10px] font-semibold text-ds-text-primary truncate">{p.name}</div>
                      <div className="text-[9px] text-ds-text-muted mt-0.5 truncate">{p.category}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[9px] text-ds-text-muted py-2 text-center">{t('No custom profiles found', 'لا توجد ملفات مخصصة')}</p>
              )}
            </Section>

            {/* Button System */}
            <Section title="Button System" description="Visual style and weight for all CTA buttons." icon={<MousePointer size={13} />}>
              <FieldLabel>{t('Button Style', 'نمط الزر')}</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {buttonStyleOptions.map(o => {
                  const active = ds.buttonStyle === o.value
                  const previewCls = {
                    solid:   'bg-[var(--ds-primary)] text-white',
                    outline: 'bg-transparent border border-[var(--ds-primary)] text-[var(--ds-primary)]',
                    ghost:   'bg-transparent text-[var(--ds-primary)] hover:bg-[var(--ds-primary-subtle)]',
                    soft:    'bg-[var(--ds-primary-subtle)] text-[var(--ds-primary)]',
                  }[o.value]
                  return (
                    <OptionCard key={o.value} active={active}
                      onClick={() => setDs(d => ({ ...d, buttonStyle: o.value as ButtonStyle }))}
                      label={o.label} description={o.desc}
                      preview={
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 text-[9px] font-semibold rounded-md pointer-events-none ${previewCls}`}>Button</span>
                        </div>
                      } />
                  )
                })}
              </div>

              <Divider label="Weight" />
              <FieldLabel>{t('Font Weight', 'وزن الخط')}</FieldLabel>
              <SegmentControl value={ds.buttonWeight}
                onChange={v => setDs(d => ({ ...d, buttonWeight: v }))}
                options={buttonWeightOptions.map(o => ({ value: o.value, label: o.label }))} />
            </Section>

            {/* Form Inputs */}
            <Section title="Form Inputs" description="Input field visual style used across all forms." icon={<FormInput size={13} />}>
              <FieldLabel>{t('Input Variant', 'نمط المدخل')}</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {inputVariantOptions.map(o => {
                  const active = ds.inputVariant === o.value
                  const prevCls = {
                    outlined:  'border border-ds-border rounded-lg',
                    underline: 'border-b border-ds-border rounded-none',
                    filled:    'bg-ds-surface rounded-lg border-0',
                    soft:      'bg-[var(--ds-primary-subtle)] border border-[var(--ds-primary)]/20 rounded-lg',
                  }[o.value]
                  return (
                    <OptionCard key={o.value} active={active}
                      onClick={() => setDs(d => ({ ...d, inputVariant: o.value as InputVariant }))}
                      label={o.label} description={o.desc}
                      preview={
                        <div className={`w-full px-2 py-1 text-[9px] text-ds-text-muted ${prevCls}`}>
                          Email address
                        </div>
                      } />
                  )
                })}
              </div>

              <Divider label="Form Style" />
              <FieldLabel>{t('Global Form Style', 'نمط النموذج العام')}</FieldLabel>
              <SegmentControl value={cfg.formStyle}
                onChange={v => update({ formStyle: v })}
                options={[
                  { value: 'minimal',  label: t('Minimal',  'بسيط') },
                  { value: 'outlined', label: t('Outlined', 'محدد') },
                ]} />
            </Section>
          </>
        )}

        {/* ──────────────────────── TAB: TOKENS ──────────────────────── */}
        {tab === 'tokens' && (
          <>
            {/* Typography */}
            <Section title="Typography" description="Font family applied globally to all text elements." icon={<Type size={13} />}>
              <FieldLabel>{t('Font Family', 'الخط')}</FieldLabel>
              <div className="space-y-1.5">
                {fontOptions.map(f => {
                  const active = ds.font === f.value
                  return (
                    <button key={f.value} onClick={() => setDs(d => ({ ...d, font: f.value as FontValue }))}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                        active ? 'border-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]' : 'border-ds-border hover:border-ds-border-hover bg-ds-surface'
                      }`}>
                      <div className="text-start">
                        <div className={`text-[11px] font-semibold leading-none ${active ? 'text-[var(--ds-primary)]' : 'text-ds-text-primary'}`} style={{ fontFamily: f.stack }}>
                          {f.label}
                        </div>
                        <div className="text-[9px] text-ds-text-muted mt-1" style={{ fontFamily: f.stack }}>{f.specimen}</div>
                      </div>
                      {active && <Check size={12} className="text-[var(--ds-primary)] shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* Border Radius Tokens */}
            <Section title="Border Radius" description="Corner radius token applied to cards, buttons, and inputs." icon={<Square size={13} />}>
              <div className="grid grid-cols-5 gap-2">
                {radiusOptions.map(o => {
                  const active = props.radius === o.value
                  return (
                    <button key={o.value} onClick={() => props.setRadius(o.value as RadiusScale)}
                      className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${
                        active ? 'border-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]' : 'border-ds-border bg-ds-surface hover:border-ds-border-hover'
                      }`}>
                      <div className={`w-7 h-7 border-2 ${active ? 'border-[var(--ds-primary)]' : 'border-ds-border-hover'}`}
                        style={{ borderRadius: o.px >= 999 ? '50%' : `${o.px}px` }} />
                      <span className={`text-[8px] font-semibold ${active ? 'text-[var(--ds-primary)]' : 'text-ds-text-muted'}`}>{o.label}</span>
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* Layout Density */}
            <Section title="Layout Density" description="Spacing scale applied to padding and gutters." icon={<Layers size={13} />}>
              <div className="space-y-2">
                {spacingOptions.map(o => {
                  const active = cfg.spacing === o.value
                  const barW = { compact: 'w-1/4', balanced: 'w-1/2', spacious: 'w-full' }[o.value] || 'w-1/2'
                  return (
                    <button key={o.value} onClick={() => update({ spacing: o.value })}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                        active ? 'border-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]' : 'border-ds-border bg-ds-surface hover:border-ds-border-hover'
                      }`}>
                      <div className="flex flex-col gap-1 shrink-0 w-8">
                        <div className={`h-1 rounded-full ${active ? 'bg-[var(--ds-primary)]' : 'bg-ds-border-hover'} ${barW}`} />
                        <div className={`h-1 rounded-full ${active ? 'bg-[var(--ds-primary)]/50' : 'bg-ds-border/60'} w-full`} />
                      </div>
                      <div className="text-start">
                        <div className={`text-[10px] font-semibold ${active ? 'text-[var(--ds-primary)]' : 'text-ds-text-primary'}`}>{o.label}</div>
                        <div className="text-[9px] text-ds-text-muted mt-0.5">{o.desc}</div>
                      </div>
                      {active && <Check size={12} className="text-[var(--ds-primary)] ml-auto shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
