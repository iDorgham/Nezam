'use client'

import { useState } from 'react'
import { Sparkles, Wand2, Loader2, ArrowUp, Lightbulb } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { PanelHeader, PanelBody, Section } from '@/components/ui/Panel'
import { generateProfile, hueFromPrompt } from '@/lib/ai'
import { rgbToHsl, hexToRgb, hslToHex } from '@/lib/tokens'
import { cn } from '@/lib/cn'
import type { Profile } from '@/types'

const SUGGESTIONS = [
  'A calm fintech dashboard, trustworthy and blue',
  'Warm Arabic editorial brand, golden and inviting',
  'Bold creative studio with sunset energy',
  'Minimal developer tool, dark and precise',
]

/** AI mode — generative profiles and contextual restyling. */
export function AIPanel() {
  const tokens = useTokens()
  const surpriseMe = useHub((s) => s.surpriseMe)
  const applyProfile = useHub((s) => s.applyProfile)
  const setToken = useHub((s) => s.setToken)
  const setAiBusy = useHub((s) => s.setAiBusy)
  const aiBusy = useHub((s) => s.aiBusy)
  const selection = useHub((s) => s.selection)

  const [prompt, setPrompt] = useState('')

  const generate = async () => {
    if (aiBusy) return
    setAiBusy(true)
    let profile: Profile | null = null
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.profile?.light && data?.profile?.dark) profile = data.profile as Profile
      }
    } catch {
      /* offline — fall through to local generation */
    }
    if (!profile) {
      profile = generateProfile({ hueHint: hueFromPrompt(prompt) })
      if (prompt.trim()) profile.name = titleCase(prompt) || profile.name
    }
    applyProfile(profile)
    setAiBusy(false)
  }

  // Contextual restyle — shifts hue/saturation/lightness of brand + accent.
  const restyle = (kind: 'bolder' | 'softer' | 'warmer' | 'cooler') => {
    const tweak = (hex: string) => {
      if (!/^#/.test(hex)) return hex
      let [h, s, l] = rgbToHsl(...hexToRgb(hex))
      if (kind === 'bolder') {
        s = Math.min(100, s + 16)
        l = Math.max(20, l - 6)
      } else if (kind === 'softer') {
        s = Math.max(8, s - 20)
        l = Math.min(86, l + 6)
      } else if (kind === 'warmer') {
        h = (h + 345) % 360
        s = Math.min(100, s + 6)
      } else {
        h = (h + 18) % 360
      }
      return hslToHex(h, s, l)
    }
    setToken('brand', tweak(tokens.brand))
    setToken('brandHover', tweak(tokens.brandHover))
    setToken('accent', tweak(tokens.accent))
  }

  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon={<Sparkles size={15} />} title="AI Co-Pilot" subtitle="Generate & restyle with intent" />
      <PanelBody>
        {/* Surprise Me */}
        <button
          onClick={surpriseMe}
          className={cn(
            'group mb-5 flex w-full items-center gap-3 overflow-hidden rounded-app-lg p-px',
            'bg-gradient-to-r from-app-accent via-[#a78bfa] to-[#4f46e5] shadow-app-glow',
            'transition-transform hover:scale-[1.015] active:scale-[0.99]',
          )}
        >
          <span className="flex w-full items-center gap-3 rounded-[13px] bg-app-surface px-4 py-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-app-sm bg-gradient-to-br from-app-accent to-[#4f46e5] text-app-on-accent">
              <Sparkles size={17} className="transition-transform group-hover:rotate-12" />
            </span>
            <span className="text-left">
              <span className="block text-[13px] font-bold text-app-text">✦ Surprise Me</span>
              <span className="block text-[11px] text-app-muted">
                Compose a complete system instantly
              </span>
            </span>
          </span>
        </button>

        {/* Generate full system */}
        <Section label="Generate full system" hint="Describe a vibe — get a full light + dark system.">
          <div
            className={cn(
              'rounded-app-lg border bg-app-inset/60 p-2.5 transition-colors',
              aiBusy ? 'border-app-accent' : 'border-app-border',
            )}
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A serene wellness app, sage green and unhurried…"
              rows={3}
              className="w-full resize-none bg-transparent text-[12px] leading-relaxed text-app-text placeholder:text-app-subtle focus:outline-none"
            />
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[10px] text-app-subtle">
                {aiBusy ? 'Composing…' : 'Gateway + offline fallback'}
              </span>
              <button
                onClick={generate}
                disabled={aiBusy}
                className={cn(
                  'focus-ring flex h-7 items-center gap-1.5 rounded-app-sm px-3 text-[11px] font-semibold transition-transform active:scale-95',
                  'bg-app-accent text-app-on-accent disabled:opacity-60',
                )}
              >
                {aiBusy ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Wand2 size={12} />
                )}
                Generate
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="focus-ring flex items-center gap-1.5 rounded-app-sm px-2 py-1.5 text-left text-[11px] text-app-muted transition-colors hover:bg-app-elevated hover:text-app-text"
              >
                <ArrowUp size={11} className="shrink-0 rotate-45 text-app-subtle" />
                {s}
              </button>
            ))}
          </div>
        </Section>

        {/* Contextual restyle */}
        <Section
          label="Quick restyle"
          hint={
            selection
              ? `Nudging the palette around "${selection.label}".`
              : 'Nudge the whole palette in one direction.'
          }
        >
          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                ['bolder', 'Bolder'],
                ['softer', 'Softer'],
                ['warmer', 'Warmer'],
                ['cooler', 'Cooler'],
              ] as const
            ).map(([kind, label]) => (
              <button
                key={kind}
                onClick={() => restyle(kind)}
                className="focus-ring flex items-center justify-center gap-1.5 rounded-app border border-app-border bg-app-inset/60 py-2 text-[11px] font-medium text-app-muted transition-all hover:border-app-accent hover:text-app-text"
              >
                <Lightbulb size={12} className="text-app-accent" />
                {label}
              </button>
            ))}
          </div>
        </Section>
      </PanelBody>
    </div>
  )
}

function titleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ')
}
