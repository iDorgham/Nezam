'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Sparkles, CornerDownLeft, Loader2 } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { generateProfile, hueFromPrompt, composeProfile } from '@/lib/ai'
import { hslToHex, hexToRgb, rgbToHsl } from '@/lib/tokens'
import { cn } from '@/lib/cn'

/* ── Quick-action chips ─────────────────────────────────────── */

const QUICK_ACTIONS = [
  { label: 'Randomize profile',  prompt: 'generate a new design system' },
  { label: 'Max rounded',        prompt: 'make everything fully rounded pill shapes' },
  { label: 'Sharp corners',      prompt: 'make all corners sharp and angular' },
  { label: 'Boost contrast',     prompt: 'increase contrast to meet wcag aaa' },
  { label: 'Dark mode',          prompt: 'switch to dark theme' },
  { label: 'Light mode',         prompt: 'switch to light theme' },
  { label: 'Reset to defaults',  prompt: 'reset all token overrides to profile defaults' },
]

/* ── Simple intent parser ───────────────────────────────────── */

/** Parse a prompt into direct token mutations, returns true if handled. */
function applyIntent(
  prompt: string,
  actions: {
    setToken: <K extends 'radius' | 'brand' | 'accent'>(k: K, v: number | string) => void
    resetOverrides: () => void
    setTheme: (t: 'light' | 'dark') => void
    applyProfile: ReturnType<typeof generateProfile> extends infer P ? (p: P) => void : never
  },
): boolean {
  const p = prompt.toLowerCase()

  if (/reset|default|clear|undo all/.test(p)) {
    actions.resetOverrides()
    return true
  }
  if (/dark mode|switch.*dark|go dark/.test(p)) {
    actions.setTheme('dark')
    return true
  }
  if (/light mode|switch.*light|go light/.test(p)) {
    actions.setTheme('light')
    return true
  }
  if (/round|pill|circular|soft corner/.test(p)) {
    actions.setToken('radius', /max|full|very|pill/.test(p) ? 999 : 20)
    return true
  }
  if (/sharp|square|no radius|angular|zero/.test(p)) {
    actions.setToken('radius', 0)
    return true
  }

  // Colour intent — map named colours to hue then compute brand
  const colorMap: Array<[RegExp, number]> = [
    [/orange|amber|tangerine/, 28],
    [/neon.orange|vivid.orange/, 22],
    [/red|crimson|scarlet/, 0],
    [/pink|rose|magenta/, 330],
    [/purple|violet|indigo|royal/, 270],
    [/blue|cobalt|sapphire|ocean/, 215],
    [/cyan|teal|turquoise/, 185],
    [/green|emerald|forest|sage/, 145],
    [/yellow|gold|amber|saffron/, 45],
    [/gray|grey|neutral/, 220],
  ]
  for (const [re, hue] of colorMap) {
    if (re.test(p)) {
      const sat = /neon|vivid|bright/.test(p) ? 92 : /muted|subtle|soft/.test(p) ? 50 : 70
      actions.setToken('brand', hslToHex(hue, sat, 50))
      return true
    }
  }

  // Hex colour
  const hexMatch = p.match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/)
  if (hexMatch) {
    actions.setToken('brand', hexMatch[0])
    return true
  }

  return false
}

/* ── Main component ─────────────────────────────────────────── */

interface CmdKBarProps {
  open: boolean
  onClose: () => void
}

export function CmdKBar({ open, onClose }: CmdKBarProps) {
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const setToken      = useHub((s) => s.setToken)
  const resetOverrides = useHub((s) => s.resetOverrides)
  const setTheme      = useHub((s) => s.setTheme)
  const applyProfile  = useHub((s) => s.applyProfile)
  const aiBusy        = useHub((s) => s.aiBusy)
  const setAiBusy     = useHub((s) => s.setAiBusy)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setInput('')
      setFlash(null)
    }
  }, [open])

  const showFlash = (msg: string) => {
    setFlash(msg)
    setTimeout(() => setFlash(null), 1800)
  }

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    // Try direct intent parsing first (instant, no API)
    const handled = applyIntent(trimmed, {
      setToken: setToken as (k: 'radius' | 'brand' | 'accent', v: number | string) => void,
      resetOverrides,
      setTheme,
      applyProfile,
    })

    if (handled) {
      showFlash('Applied ✓')
      setTimeout(onClose, 400)
      return
    }

    // Fall back to generateProfile with hue hint from prompt
    setBusy(true)
    setAiBusy(true)
    try {
      await new Promise((r) => setTimeout(r, 300)) // let UI update
      const hueHint = hueFromPrompt(trimmed)
      const profile = generateProfile({ hueHint })
      profile.name = trimmed.length < 30 ? trimmed : profile.name
      applyProfile(profile)
      showFlash(`Generated "${profile.name}" ✓`)
      setTimeout(onClose, 500)
    } finally {
      setBusy(false)
      setAiBusy(false)
    }
  }, [input, setToken, resetOverrides, setTheme, applyProfile, setAiBusy, onClose])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') onClose()
  }

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
    // Immediately execute
    const handled = applyIntent(prompt, {
      setToken: setToken as (k: 'radius' | 'brand' | 'accent', v: number | string) => void,
      resetOverrides,
      setTheme,
      applyProfile,
    })
    if (handled) {
      showFlash('Applied ✓')
      setTimeout(onClose, 400)
    } else {
      handleSubmit()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />

        {/* Panel */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-[22vh] z-50 w-full max-w-xl -translate-x-1/2',
            'rounded-2xl border border-app-border-strong bg-app-elevated shadow-app-xl',
            'data-[state=open]:animate-rise-in',
          )}
          onInteractOutside={onClose}
        >
          {/* Input row */}
          <div
            className={cn(
              'flex items-center gap-3 px-4 py-3',
              'rounded-t-2xl transition-shadow duration-200',
              'ring-2 ring-app-accent/60',
            )}
            style={{ boxShadow: '0 0 0 2px var(--app-accent), 0 0 32px -4px rgba(38,128,235,0.35)' }}
          >
            <Sparkles size={16} className="shrink-0 text-app-accent" />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Make everything rounded… change brand to coral…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-app-text placeholder:text-app-subtle focus:outline-none"
            />
            {(busy || aiBusy) ? (
              <Loader2 size={15} className="shrink-0 animate-spin text-app-accent" />
            ) : input.trim() ? (
              <button
                onClick={handleSubmit}
                className="flex shrink-0 items-center gap-1 rounded-app-sm bg-app-accent px-2 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <CornerDownLeft size={11} />
                Run
              </button>
            ) : (
              <kbd className="rounded border border-app-border px-1.5 py-0.5 text-[10px] font-mono text-app-subtle">⌘K</kbd>
            )}
          </div>

          {/* Flash message */}
          {flash && (
            <div className="border-t border-app-border/50 px-4 py-2 text-[12px] font-medium text-app-accent">
              {flash}
            </div>
          )}

          {/* Quick-action chips */}
          {!flash && (
            <div className="flex flex-wrap gap-1.5 border-t border-app-border/50 px-4 py-3">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => handleQuickAction(a.prompt)}
                  className={cn(
                    'rounded-full border border-app-border px-2.5 py-1 text-[11px] text-app-muted',
                    'transition-colors hover:border-app-accent/50 hover:bg-app-accent/8 hover:text-app-text',
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}

          {/* Footer hint */}
          <div className="flex items-center justify-between border-t border-app-border/30 px-4 py-2 text-[10px] text-app-subtle">
            <span>Describe any design change in plain language</span>
            <span><kbd className="font-mono">Esc</kbd> to dismiss</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
