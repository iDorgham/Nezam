'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import type { DesignTokens } from '@/types/design'

type ExportFormat = 'css' | 'json' | 'tailwind'

function buildCssVars(tokens: DesignTokens): string {
  const t = tokens
  const lines: string[] = [':root {']

  // Colors - brand
  Object.entries(t.colors.brand).forEach(([step, val]) => {
    lines.push(`  --color-brand-${step}: ${val};`)
  })
  Object.entries(t.colors.accent).forEach(([step, val]) => {
    lines.push(`  --color-accent-${step}: ${val};`)
  })
  Object.entries(t.colors.neutral).forEach(([step, val]) => {
    lines.push(`  --color-neutral-${step}: ${val};`)
  })

  // Semantic
  lines.push(`  --color-success: ${t.colors.semantic.success};`)
  lines.push(`  --color-warning: ${t.colors.semantic.warning};`)
  lines.push(`  --color-error: ${t.colors.semantic.error};`)
  lines.push(`  --color-info: ${t.colors.semantic.info};`)

  // Surface
  lines.push(`  --color-bg: ${t.colors.surface.bg};`)
  lines.push(`  --color-panel: ${t.colors.surface.panel};`)
  lines.push(`  --color-border: ${t.colors.surface.border};`)

  // Text
  lines.push(`  --color-text: ${t.colors.text.primary};`)
  lines.push(`  --color-text-2: ${t.colors.text.secondary};`)
  lines.push(`  --color-muted: ${t.colors.text.muted};`)

  // Typography
  lines.push(`  --font-sans: ${t.typography.sans};`)
  lines.push(`  --font-mono: ${t.typography.mono};`)
  lines.push(`  --font-display: ${t.typography.display};`)

  // Type scale
  Object.entries(t.typography.scale).forEach(([step, val]) => {
    lines.push(`  --text-${step}: ${val.size};`)
    lines.push(`  --leading-${step}: ${val.lineHeight};`)
  })

  // Spacing
  const sp = t.spacing.base
  ;[1,2,3,4,5,6,8,10,12,16,20,24,32].forEach((m) => {
    lines.push(`  --space-${m}: ${m * sp}px;`)
  })

  // Radius
  Object.entries(t.radius).forEach(([k, v]) => {
    lines.push(`  --radius-${k}: ${v};`)
  })

  // Shadows
  Object.entries(t.shadows).forEach(([k, v]) => {
    lines.push(`  --shadow-${k}: ${v};`)
  })

  // Motion
  lines.push(`  --duration-fast: ${t.motion.duration.fast};`)
  lines.push(`  --duration-base: ${t.motion.duration.base};`)
  lines.push(`  --duration-slow: ${t.motion.duration.slow};`)
  lines.push(`  --easing-default: ${t.motion.easing.default};`)
  lines.push(`  --easing-bounce: ${t.motion.easing.bounce};`)
  lines.push(`  --easing-smooth: ${t.motion.easing.smooth};`)

  lines.push('}')
  return lines.join('\n')
}

function buildTokensJson(tokens: DesignTokens): string {
  return JSON.stringify(tokens, null, 2)
}

function buildTailwindConfig(tokens: DesignTokens): string {
  const t = tokens
  const sp = t.spacing.base
  const spacingScale: Record<string, string> = {}
  ;[1,2,3,4,5,6,8,10,12,16,20,24,32].forEach((m) => {
    spacingScale[String(m)] = `${m * sp}px`
  })

  const config = {
    theme: {
      extend: {
        colors: {
          brand:   Object.fromEntries(Object.entries(t.colors.brand).map(([k,v]) => [k, v])),
          accent:  Object.fromEntries(Object.entries(t.colors.accent).map(([k,v]) => [k, v])),
          neutral: Object.fromEntries(Object.entries(t.colors.neutral).map(([k,v]) => [k, v])),
          success: t.colors.semantic.success,
          warning: t.colors.semantic.warning,
          error:   t.colors.semantic.error,
        },
        fontFamily: {
          sans:    [t.typography.sans],
          mono:    [t.typography.mono],
          display: [t.typography.display],
        },
        borderRadius: Object.fromEntries(
          Object.entries(t.radius).map(([k, v]) => [k, v])
        ),
        boxShadow: Object.fromEntries(
          Object.entries(t.shadows).map(([k, v]) => [k, v])
        ),
        spacing: spacingScale,
        transitionDuration: {
          fast: t.motion.duration.fast,
          base: t.motion.duration.base,
          slow: t.motion.duration.slow,
        },
        transitionTimingFunction: {
          default: t.motion.easing.default,
          bounce:  t.motion.easing.bounce,
          smooth:  t.motion.easing.smooth,
        },
      },
    },
  }
  return `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(config, null, 2)}`
}

export function ExportPanel() {
  const tokens    = useHub((s) => s.design.tokens)
  const arch      = useHub((s) => s.arch)

  const [format, setFormat]   = useState<ExportFormat>('css')
  const [copied, setCopied]   = useState(false)

  const content =
    format === 'css'      ? buildCssVars(tokens)
    : format === 'json'   ? buildTokensJson(tokens)
    : buildTailwindConfig(tokens)

  const setExportModalOpen = useHub((s) => s.setExportModalOpen)

  async function copy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setExportModalOpen(true)
    }, 1000)
  }

  const pageCount = Object.keys(arch.pages).length

  return (
    <div className="border-t border-app-border">
      <div className="px-3 py-2.5">
        <p className="text-[10px] font-semibold text-app-muted uppercase tracking-wide mb-2">Export</p>

        {/* Stats */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 rounded-app-sm bg-app-elevated border border-app-border p-2 text-center">
            <p className="text-base font-bold text-app-text">{pageCount}</p>
            <p className="text-[10px] text-app-subtle">pages</p>
          </div>
          <div className="flex-1 rounded-app-sm bg-app-elevated border border-app-border p-2 text-center">
            <p className="text-base font-bold text-app-text">
              {Object.keys(tokens.colors.brand).length * 3}
            </p>
            <p className="text-[10px] text-app-subtle">colors</p>
          </div>
        </div>

        {/* Format tabs */}
        <div className="flex gap-0.5 rounded-app-sm border border-app-border p-0.5 mb-2">
          {(['css','json','tailwind'] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={[
                'flex-1 h-5 rounded text-[10px] font-medium transition-all',
                format === f ? 'bg-app-elevated text-app-text' : 'text-app-subtle hover:text-app-muted',
              ].join(' ')}
            >
              {f === 'css' ? 'CSS' : f === 'json' ? 'JSON' : 'TW'}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={copy}
          className={[
            'w-full h-7 rounded-app-sm text-xs font-medium transition-all',
            copied
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-app-accent text-app-on-accent hover:bg-app-accent-hover',
          ].join(' ')}
        >
          {copied ? '✓ Copied!' : `Copy ${format.toUpperCase()}`}
        </button>
      </div>
    </div>
  )
}
