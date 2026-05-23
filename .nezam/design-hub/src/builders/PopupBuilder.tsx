'use client'

/**
 * SPEC-DS-VISUAL-001 — Popup / modal section builder.
 * Trigger, size, animation, and content-slot configuration.
 */

import { useState } from 'react'
import { cn } from '@/lib/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

type PopupTrigger = 'click' | 'scroll' | 'exit-intent' | 'delay' | 'none'
type PopupSize   = 'sm' | 'md' | 'lg' | 'full'
type PopupAnim   = 'fade' | 'slide-up' | 'scale' | 'none'
type PopupSlot   = 'form' | 'image' | 'video' | 'text' | 'cta'

export interface PopupConfig {
  trigger: PopupTrigger
  triggerDelay: number     // seconds (for 'delay' trigger)
  triggerScroll: number    // % page scrolled (for 'scroll' trigger)
  size: PopupSize
  animation: PopupAnim
  showOverlay: boolean
  closeOnOverlay: boolean
  slots: PopupSlot[]
  showCloseButton: boolean
}

const DEFAULT_CONFIG: PopupConfig = {
  trigger: 'click',
  triggerDelay: 5,
  triggerScroll: 50,
  size: 'md',
  animation: 'fade',
  showOverlay: true,
  closeOnOverlay: true,
  slots: ['text', 'cta'],
  showCloseButton: true,
}

// ── Size preview SVGs ─────────────────────────────────────────────────────────

const SIZE_PREVIEWS: Record<PopupSize, React.ReactNode> = {
  sm: (
    <svg viewBox="0 0 48 32" className="h-full w-full text-app-text">
      <rect x="1" y="1" width="46" height="30" rx="2" fill="currentColor" opacity=".04" />
      <rect x="16" y="9" width="16" height="14" rx="2" fill="currentColor" opacity=".2" />
    </svg>
  ),
  md: (
    <svg viewBox="0 0 48 32" className="h-full w-full text-app-text">
      <rect x="1" y="1" width="46" height="30" rx="2" fill="currentColor" opacity=".04" />
      <rect x="10" y="7" width="28" height="18" rx="2" fill="currentColor" opacity=".2" />
    </svg>
  ),
  lg: (
    <svg viewBox="0 0 48 32" className="h-full w-full text-app-text">
      <rect x="1" y="1" width="46" height="30" rx="2" fill="currentColor" opacity=".04" />
      <rect x="4" y="5" width="40" height="22" rx="2" fill="currentColor" opacity=".2" />
    </svg>
  ),
  full: (
    <svg viewBox="0 0 48 32" className="h-full w-full text-app-text">
      <rect x="1" y="1" width="46" height="30" rx="2" fill="currentColor" opacity=".2" />
    </svg>
  ),
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-medium uppercase tracking-widest text-app-subtle">{label}</p>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2">
      <span className="text-xs text-app-text">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-4 w-7 rounded-full transition-colors', checked ? 'bg-app-brand' : 'bg-app-border')}
      >
        <span className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-3.5' : 'translate-x-0.5')} />
      </button>
    </label>
  )
}

function Chip<T extends string>({
  value, current, onChange, label,
}: { value: T; current: T; onChange: (v: T) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(value)}
      className={cn(
        'rounded-md px-2.5 py-1 text-[11px] transition-colors',
        current === value ? 'bg-app-brand text-app-on-brand' : 'bg-app-surface text-app-subtle hover:text-app-text',
      )}
    >
      {label}
    </button>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export interface PopupBuilderProps {
  value?: Partial<PopupConfig>
  onChange?: (cfg: PopupConfig) => void
}

export function PopupBuilder({ value, onChange }: PopupBuilderProps) {
  const [cfg, setCfg] = useState<PopupConfig>({ ...DEFAULT_CONFIG, ...value })

  const update = <K extends keyof PopupConfig>(key: K, val: PopupConfig[K]) => {
    const next = { ...cfg, [key]: val }
    setCfg(next)
    onChange?.(next)
  }

  const toggleSlot = (slot: PopupSlot) => {
    const has = cfg.slots.includes(slot)
    update('slots', has ? cfg.slots.filter((s) => s !== slot) : [...cfg.slots, slot])
  }

  const ALL_SLOTS: PopupSlot[] = ['form', 'image', 'video', 'text', 'cta']

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Trigger */}
      <Section label="Trigger">
        <div className="flex flex-wrap gap-1">
          {(['click', 'scroll', 'exit-intent', 'delay', 'none'] as PopupTrigger[]).map((t) => (
            <Chip key={t} value={t} current={cfg.trigger} onChange={(v) => update('trigger', v)} label={t} />
          ))}
        </div>
        {cfg.trigger === 'delay' && (
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-app-subtle">Delay</span>
            <input
              type="range" min={1} max={30} step={1}
              value={cfg.triggerDelay}
              onChange={(e) => update('triggerDelay', Number(e.target.value))}
              className="h-1.5 flex-1 accent-app-brand"
            />
            <span className="w-10 text-right text-xs tabular-nums text-app-subtle">{cfg.triggerDelay}s</span>
          </div>
        )}
        {cfg.trigger === 'scroll' && (
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-app-subtle">Scroll %</span>
            <input
              type="range" min={10} max={100} step={5}
              value={cfg.triggerScroll}
              onChange={(e) => update('triggerScroll', Number(e.target.value))}
              className="h-1.5 flex-1 accent-app-brand"
            />
            <span className="w-10 text-right text-xs tabular-nums text-app-subtle">{cfg.triggerScroll}%</span>
          </div>
        )}
      </Section>

      {/* Size */}
      <Section label="Size">
        <div className="grid grid-cols-4 gap-1.5">
          {(['sm', 'md', 'lg', 'full'] as PopupSize[]).map((s) => (
            <button
              key={s}
              onClick={() => update('size', s)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md p-1 transition-all',
                cfg.size === s
                  ? 'bg-app-brand/10 text-app-brand ring-1 ring-app-brand'
                  : 'text-app-text hover:bg-app-surface',
              )}
              aria-label={s}
            >
              <div className="h-10 w-full">{SIZE_PREVIEWS[s]}</div>
              <span className="text-[9px] uppercase">{s}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Animation */}
      <Section label="Animation">
        <div className="flex flex-wrap gap-1">
          {(['fade', 'slide-up', 'scale', 'none'] as PopupAnim[]).map((a) => (
            <Chip key={a} value={a} current={cfg.animation} onChange={(v) => update('animation', v)} label={a} />
          ))}
        </div>
      </Section>

      {/* Content slots */}
      <Section label="Content slots">
        <div className="flex flex-wrap gap-1">
          {ALL_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => toggleSlot(slot)}
              className={cn(
                'rounded-md px-2.5 py-1 text-[11px] transition-colors',
                cfg.slots.includes(slot)
                  ? 'bg-app-brand text-app-on-brand'
                  : 'bg-app-surface text-app-subtle hover:text-app-text',
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </Section>

      {/* Options */}
      <Section label="Options">
        <div className="flex flex-col gap-2.5">
          <Toggle checked={cfg.showOverlay} onChange={(v) => update('showOverlay', v)} label="Show overlay" />
          <Toggle checked={cfg.closeOnOverlay} onChange={(v) => update('closeOnOverlay', v)} label="Close on overlay click" />
          <Toggle checked={cfg.showCloseButton} onChange={(v) => update('showCloseButton', v)} label="Close button" />
        </div>
      </Section>
    </div>
  )
}
