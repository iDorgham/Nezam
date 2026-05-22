'use client'
import React from 'react'
import { Palette, Type, MousePointer, FormInput, Square, Check, Layers } from 'lucide-react'
import { Section, FieldLabel, SegmentControl, OptionCard, Divider } from './primitives'
import {
  colorPaletteOptions, fontOptions, buttonStyleOptions, buttonWeightOptions,
  inputVariantOptions, radiusOptions, spacingOptions,
} from './config'
import type { TemplateConfig } from '@/lib/store/session.store'
import type { RadiusScale, ButtonStyle, InputVariant, FontValue } from './config'
import type { DesignSystemState } from './LeftPanel'

interface Props {
  cfg: TemplateConfig
  update: (u: Partial<TemplateConfig>) => void
  profiles: { name: string; category: string }[]
  onProfileClick: (name: string) => void
  ds: DesignSystemState
  setDs: React.Dispatch<React.SetStateAction<DesignSystemState>>
  radius: RadiusScale
  setRadius: (v: RadiusScale) => void
  t: (en: string, ar: string) => string
  profilePage: number
  setProfilePage: (n: number) => void
  pages: number
  vis: { name: string; category: string }[]
}

export function DesignTab({ cfg, update, profiles, onProfileClick, ds, setDs, radius, setRadius, t, profilePage, setProfilePage, pages, vis }: Props) {
  return (
    <>
      {/* ── COLORS ── */}
      <Section title="Color Palette" description="Primary color and surface scheme for the design system." icon={<Palette size={13} />}>

        {/* Visual palette grid */}
        <FieldLabel>{t('Palette', 'لوحة الألوان')}</FieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {colorPaletteOptions.map(o => {
            const active = cfg.colorProfile === o.value
            return (
              <button key={o.value} onClick={() => onProfileClick(o.value)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                  active ? 'border-[var(--ds-primary)]' : 'border-transparent hover:border-ds-border'
                }`}>
                <div className="w-full h-7 rounded-lg flex overflow-hidden shadow-sm">
                  <span className="flex-1" style={{ background: o.primary }} />
                  <span className="flex-1" style={{ background: o.bg, borderLeft: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <span className="text-[8px] font-medium text-ds-text-muted text-center leading-tight truncate w-full">{o.label}</span>
                {active && <Check size={8} className="text-[var(--ds-primary)]" />}
              </button>
            )
          })}
        </div>

        {/* Workspace profiles */}
        {profiles.length > 0 && (
          <>
            <Divider label="Workspace Profiles" />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-ds-text-muted">{profiles.length} {t('profiles', 'ملف')}</span>
              {pages > 1 && (
                <div className="flex items-center gap-2 text-[9px] text-ds-text-muted">
                  <button onClick={() => setProfilePage(Math.max(0, profilePage - 1))} disabled={profilePage === 0}
                    className="disabled:opacity-30 hover:text-ds-text-primary w-4 h-4 flex items-center justify-center rounded">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span>{profilePage + 1}/{pages}</span>
                  <button onClick={() => setProfilePage(Math.min(pages - 1, profilePage + 1))} disabled={profilePage >= pages - 1}
                    className="disabled:opacity-30 hover:text-ds-text-primary w-4 h-4 flex items-center justify-center rounded">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {vis.map(p => (
                <button key={p.name} onClick={() => onProfileClick(p.name)}
                  className={`p-2.5 rounded-lg border text-start transition-all ${
                    cfg.colorProfile === p.name
                      ? 'border-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]'
                      : 'border-ds-border bg-ds-surface hover:border-ds-border-hover'
                  }`}>
                  <div className="text-[10px] font-semibold text-ds-text-primary truncate">{p.name}</div>
                  <div className="text-[9px] text-ds-text-muted mt-0.5 truncate">{p.category}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* ── TYPOGRAPHY ── */}
      <Section title="Typography" description="Font family, weight, and type scale." icon={<Type size={13} />}>
        <FieldLabel>{t('Font Family', 'الخط')}</FieldLabel>
        <div className="space-y-1">
          {fontOptions.map(f => {
            const active = ds.font === f.value
            return (
              <button key={f.value}
                onClick={() => setDs(d => ({ ...d, font: f.value as FontValue }))}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                  active ? 'border-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]' : 'border-ds-border bg-ds-surface hover:border-ds-border-hover'
                }`}>
                <div className="text-start min-w-0">
                  <div className={`text-[11px] font-semibold ${active ? 'text-[var(--ds-primary)]' : 'text-ds-text-primary'}`}
                    style={{ fontFamily: f.stack }}>
                    {f.label}
                  </div>
                  <div className="text-[9px] text-ds-text-muted mt-0.5 truncate" style={{ fontFamily: f.stack }}>
                    {f.specimen}
                  </div>
                </div>
                {active && <Check size={12} className="text-[var(--ds-primary)] shrink-0 ml-2" />}
              </button>
            )
          })}
        </div>
      </Section>

      {/* ── BUTTONS ── */}
      <Section title="Buttons" description="CTA button variant and weight used throughout the preview." icon={<MousePointer size={13} />}>
        <FieldLabel>{t('Button Style', 'نمط الزر')}</FieldLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {buttonStyleOptions.map(o => {
            const active = ds.buttonStyle === o.value
            const previewMap: Record<string, string> = {
              solid:   'bg-[var(--ds-primary)] text-white',
              outline: 'bg-transparent border-2 border-[var(--ds-primary)] text-[var(--ds-primary)]',
              ghost:   'bg-transparent text-[var(--ds-primary)]',
              soft:    'bg-[var(--ds-primary-subtle)] text-[var(--ds-primary)]',
            }
            return (
              <OptionCard key={o.value} active={active}
                onClick={() => setDs(d => ({ ...d, buttonStyle: o.value as ButtonStyle }))}
                label={o.label}
                description={o.desc}
                preview={
                  <div className="flex justify-center mb-1">
                    <span className={`px-3 py-1 text-[9px] font-semibold rounded-md ${previewMap[o.value] ?? ''}`}>
                      Button
                    </span>
                  </div>
                }
              />
            )
          })}
        </div>

        <Divider label="Font Weight" />
        <SegmentControl
          value={ds.buttonWeight}
          onChange={v => setDs(d => ({ ...d, buttonWeight: v }))}
          options={buttonWeightOptions.map(o => ({ value: o.value, label: o.label }))}
        />
      </Section>

      {/* ── FORM INPUTS ── */}
      <Section title="Form Inputs" description="Input field style applied to all form elements." icon={<FormInput size={13} />}>
        <FieldLabel>{t('Input Variant', 'نمط المدخل')}</FieldLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {inputVariantOptions.map(o => {
            const active = ds.inputVariant === o.value
            const prevMap: Record<string, string> = {
              outlined:  'border border-ds-border rounded-lg',
              underline: 'border-b border-ds-border',
              filled:    'bg-ds-surface rounded-lg',
              soft:      'bg-[var(--ds-primary-subtle)] border border-[var(--ds-primary)]/20 rounded-lg',
            }
            return (
              <OptionCard key={o.value} active={active}
                onClick={() => setDs(d => ({ ...d, inputVariant: o.value as InputVariant }))}
                label={o.label} description={o.desc}
                preview={
                  <div className={`w-full px-2 py-1 text-[9px] text-ds-text-muted mb-1 ${prevMap[o.value] ?? ''}`}>
                    Email address
                  </div>
                }
              />
            )
          })}
        </div>

        <Divider label="Global Style" />
        <SegmentControl value={cfg.formStyle}
          onChange={v => update({ formStyle: v })}
          options={[
            { value: 'minimal',  label: t('Minimal', 'بسيط') },
            { value: 'outlined', label: t('Outlined', 'محدد') },
          ]}
        />
      </Section>

      {/* ── BORDER RADIUS ── */}
      <Section title="Border Radius" description="Corner radius token applied to all components." icon={<Square size={13} />}>
        <div className="grid grid-cols-5 gap-2">
          {radiusOptions.map(o => {
            const active = radius === o.value
            return (
              <button key={o.value} onClick={() => setRadius(o.value as RadiusScale)}
                className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${
                  active ? 'border-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]' : 'border-ds-border bg-ds-surface hover:border-ds-border-hover'
                }`}>
                <div
                  className={`w-6 h-6 border-2 ${active ? 'border-[var(--ds-primary)]' : 'border-ds-border-hover'}`}
                  style={{ borderRadius: o.px >= 999 ? '50%' : `${o.px}px` }}
                />
                <span className={`text-[8px] font-semibold ${active ? 'text-[var(--ds-primary)]' : 'text-ds-text-muted'}`}>
                  {o.label}
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      {/* ── DENSITY ── */}
      <Section title="Layout Density" description="Spacing scale: padding and gutters across components." icon={<Layers size={13} />}>
        <div className="space-y-1.5">
          {spacingOptions.map(o => {
            const active = cfg.spacing === o.value
            const barW = { compact: '25%', balanced: '55%', spacious: '100%' }[o.value] ?? '55%'
            return (
              <button key={o.value} onClick={() => update({ spacing: o.value })}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                  active ? 'border-[var(--ds-primary)] bg-[var(--ds-primary-subtle)]' : 'border-ds-border bg-ds-surface hover:border-ds-border-hover'
                }`}>
                <div className="flex flex-col gap-1 shrink-0 w-8">
                  <div className={`h-1 rounded-full ${active ? 'bg-[var(--ds-primary)]' : 'bg-ds-border-hover'}`} style={{ width: barW }} />
                  <div className={`h-1 rounded-full ${active ? 'bg-[var(--ds-primary)]/40' : 'bg-ds-border/50'} w-full`} />
                </div>
                <div className="text-start flex-1 min-w-0">
                  <div className={`text-[10px] font-semibold ${active ? 'text-[var(--ds-primary)]' : 'text-ds-text-primary'}`}>{o.label}</div>
                  <div className="text-[9px] text-ds-text-muted mt-0.5 truncate">{o.desc}</div>
                </div>
                {active && <Check size={11} className="text-[var(--ds-primary)] shrink-0" />}
              </button>
            )
          })}
        </div>
      </Section>
    </>
  )
}
