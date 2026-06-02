'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import type { DesignTokens } from '@/types/design'

type ExportFormat = 'css' | 'json' | 'tailwind' | 'figma' | 'style-dictionary'

export function buildCssVars(tokens: DesignTokens): string {
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

  // Semantic scales
  if (t.colors.successScale) {
    Object.entries(t.colors.successScale).forEach(([step, val]) => {
      lines.push(`  --color-success-${step}: ${val};`)
    })
    Object.entries(t.colors.warningScale).forEach(([step, val]) => {
      lines.push(`  --color-warning-${step}: ${val};`)
    })
    Object.entries(t.colors.errorScale).forEach(([step, val]) => {
      lines.push(`  --color-error-${step}: ${val};`)
    })
    Object.entries(t.colors.infoScale).forEach(([step, val]) => {
      lines.push(`  --color-info-${step}: ${val};`)
    })
  }

  // Surface
  lines.push(`  --color-bg: ${t.colors.surface.bg};`)
  lines.push(`  --color-panel: ${t.colors.surface.panel};`)
  lines.push(`  --color-border: ${t.colors.surface.border};`)
  if (t.colors.surface.overlay) lines.push(`  --color-overlay: ${t.colors.surface.overlay};`)
  if (t.colors.darkSurface) {
    lines.push(`  --color-bg-dark: ${t.colors.darkSurface.bg};`)
    lines.push(`  --color-panel-dark: ${t.colors.darkSurface.panel};`)
    lines.push(`  --color-border-dark: ${t.colors.darkSurface.border};`)
  }

  // Text
  lines.push(`  --color-text: ${t.colors.text.primary};`)
  lines.push(`  --color-text-2: ${t.colors.text.secondary};`)
  lines.push(`  --color-muted: ${t.colors.text.muted};`)
  if (t.colors.darkText) {
    lines.push(`  --color-text-dark: ${t.colors.darkText.primary};`)
    lines.push(`  --color-text-2-dark: ${t.colors.darkText.secondary};`)
    lines.push(`  --color-muted-dark: ${t.colors.darkText.muted};`)
  }

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
  if (t.motion.spring) {
    Object.entries(t.motion.spring).forEach(([k, v]) => {
      lines.push(`  --spring-${k}: ${v};`)
    })
  }

  // Cursor & Focus
  if (t.cursor) {
    Object.entries(t.cursor).forEach(([k, v]) => {
      lines.push(`  --cursor-${k}: ${v};`)
    })
  }

  // Scrollbar
  if (t.scrollbar) {
    Object.entries(t.scrollbar).forEach(([k, v]) => {
      lines.push(`  --scrollbar-${k}: ${v};`)
    })
  }

  // Glass
  if (t.glass) {
    Object.entries(t.glass).forEach(([k, v]) => {
      if (typeof v === 'number') {
        lines.push(`  --glass-${k}: ${v};`)
      } else {
        lines.push(`  --glass-${k}: ${v};`)
      }
    })
  }

  // Gradients
  if (t.gradients) {
    Object.entries(t.gradients).forEach(([k, v]) => {
      lines.push(`  --gradient-${k}: ${v};`)
    })
  }

  // Grid
  if (t.grid) {
    lines.push(`  --grid-gutter: ${t.grid.gutter};`)
    Object.entries(t.grid.columns).forEach(([bp, count]) => {
      lines.push(`  --grid-columns-${bp}: ${count};`)
    })
  }

  // Content
  if (t.content) {
    Object.entries(t.content).forEach(([k, v]) => {
      lines.push(`  --content-${k}: ${v};`)
    })
  }

  // Density
  if (t.density) {
    Object.entries(t.density).forEach(([k, v]) => {
      if (typeof v === 'number') {
        lines.push(`  --density-${k}: ${v};`)
      } else {
        lines.push(`  --density-${k}: ${v};`)
      }
    })
  }

  // Borders
  lines.push(`  --border-width: ${t.borders.width};`)
  lines.push(`  --border-style: ${t.borders.style};`)
  if (t.borders.widthScale) {
    Object.entries(t.borders.widthScale).forEach(([k, v]) => {
      lines.push(`  --border-width-${k}: ${v};`)
    })
  }

  // Opacity
  if (t.opacity) {
    Object.entries(t.opacity).forEach(([k, v]) => {
      if (typeof v === 'number') {
        lines.push(`  --opacity-${k}: ${v};`)
      } else {
        lines.push(`  --opacity-${k}: ${v};`)
      }
    })
  }

  // Z-index
  Object.entries(t.zIndex).forEach(([k, v]) => {
    lines.push(`  --z-${k}: ${String(v)};`)
  })

  // Breakpoints
  if (t.breakpoints) {
    Object.entries(t.breakpoints).forEach(([k, v]) => {
      lines.push(`  --bp-${k}: ${v};`)
    })
  }

  // Layout
  if (t.layout) {
    Object.entries(t.layout).forEach(([k, v]) => {
      lines.push(`  --layout-${k}: ${v};`)
    })
  }

  lines.push('}')
  return lines.join('\n')
}

export function buildTokensJson(tokens: DesignTokens): string {
  return JSON.stringify(tokens, null, 2)
}

export function buildFigmaTokens(tokens: DesignTokens): string {
  const figmaTokens: Record<string, any> = {}

  function add(path: string[], value: string | number) {
    const key = path.join('.')
    figmaTokens[key] = { value }
  }

  // Colors
  Object.entries(tokens.colors.brand).forEach(([step, val]) => add(['color', 'brand', step], val))
  Object.entries(tokens.colors.accent).forEach(([step, val]) => add(['color', 'accent', step], val))
  Object.entries(tokens.colors.neutral).forEach(([step, val]) => add(['color', 'neutral', step], val))
  Object.entries(tokens.colors.semantic).forEach(([k, v]) => add(['color', 'semantic', k], v))
  if (tokens.colors.successScale) {
    Object.entries(tokens.colors.successScale).forEach(([step, val]) => add(['color', 'success', step], val))
    Object.entries(tokens.colors.warningScale).forEach(([step, val]) => add(['color', 'warning', step], val))
    Object.entries(tokens.colors.errorScale).forEach(([step, val]) => add(['color', 'error', step], val))
    Object.entries(tokens.colors.infoScale).forEach(([step, val]) => add(['color', 'info', step], val))
  }
  Object.entries(tokens.colors.surface).forEach(([k, v]) => add(['color', 'surface', k], v))
  Object.entries(tokens.colors.text).forEach(([k, v]) => add(['color', 'text', k], v))

  // Typography
  add(['font', 'sans'], tokens.typography.sans)
  add(['font', 'mono'], tokens.typography.mono)
  add(['font', 'display'], tokens.typography.display)
  Object.entries(tokens.typography.scale).forEach(([step, val]) => {
    add(['type', step, 'fontSize'], val.size)
    add(['type', step, 'lineHeight'], val.lineHeight)
    if (val.letterSpacing) add(['type', step, 'letterSpacing'], val.letterSpacing)
  })

  // Spacing
  const sp = tokens.spacing.base
  ;[1,2,3,4,5,6,8,10,12,16,20,24,32].forEach((m) => {
    add(['spacing', String(m)], `${m * sp}px`)
  })

  // Radius
  Object.entries(tokens.radius).forEach(([k, v]) => add(['borderRadius', k], v))

  // Shadows
  Object.entries(tokens.shadows).forEach(([k, v]) => add(['boxShadow', k], v))

  // Motion
  Object.entries(tokens.motion.duration).forEach(([k, v]) => add(['duration', k], v))
  Object.entries(tokens.motion.easing).forEach(([k, v]) => add(['easing', k], v))

  // New categories
  if (tokens.cursor) Object.entries(tokens.cursor).forEach(([k, v]) => add(['cursor', k], v))
  if (tokens.scrollbar) Object.entries(tokens.scrollbar).forEach(([k, v]) => add(['scrollbar', k], v))
  if (tokens.glass) Object.entries(tokens.glass).forEach(([k, v]) => add(['glass', k], String(v)))
  if (tokens.gradients) Object.entries(tokens.gradients).forEach(([k, v]) => {
    if (typeof v === 'string') add(['gradient', k], v)
  })
  if (tokens.grid) {
    add(['grid', 'gutter'], tokens.grid.gutter)
    Object.entries(tokens.grid.columns).forEach(([bp, count]) => add(['grid', 'columns', bp], count))
  }
  if (tokens.content) Object.entries(tokens.content).forEach(([k, v]) => add(['content', k], v))
  if (tokens.density) Object.entries(tokens.density).forEach(([k, v]) => add(['density', k], String(v)))

  return JSON.stringify({ $themes: [{ id: 'default', name: 'Default', selectedTokenSets: {} }], values: figmaTokens }, null, 2)
}

export function buildStyleDictionary(tokens: DesignTokens): string {
  const sd: Record<string, any> = {}

  function add(path: string[], value: string | number, type: string) {
    let cur = sd
    path.forEach((seg, i) => {
      if (i === path.length - 1) {
        cur[seg] = { value, type }
      } else {
        cur[seg] = cur[seg] || {}
        cur = cur[seg]
      }
    })
  }

  // Colors
  Object.entries(tokens.colors.brand).forEach(([step, val]) => add(['color', 'brand', step], val, 'color'))
  Object.entries(tokens.colors.accent).forEach(([step, val]) => add(['color', 'accent', step], val, 'color'))
  Object.entries(tokens.colors.neutral).forEach(([step, val]) => add(['color', 'neutral', step], val, 'color'))
  Object.entries(tokens.colors.semantic).forEach(([k, v]) => add(['color', 'semantic', k], v, 'color'))
  if (tokens.colors.successScale) {
    Object.entries(tokens.colors.successScale).forEach(([step, val]) => add(['color', 'success', step], val, 'color'))
    Object.entries(tokens.colors.warningScale).forEach(([step, val]) => add(['color', 'warning', step], val, 'color'))
    Object.entries(tokens.colors.errorScale).forEach(([step, val]) => add(['color', 'error', step], val, 'color'))
    Object.entries(tokens.colors.infoScale).forEach(([step, val]) => add(['color', 'info', step], val, 'color'))
  }
  Object.entries(tokens.colors.surface).forEach(([k, v]) => add(['color', 'surface', k], v, 'color'))
  Object.entries(tokens.colors.text).forEach(([k, v]) => add(['color', 'text', k], v, 'color'))
  if (tokens.colors.darkSurface) Object.entries(tokens.colors.darkSurface).forEach(([k, v]) => add(['color', 'darkSurface', k], v, 'color'))
  if (tokens.colors.darkText) Object.entries(tokens.colors.darkText).forEach(([k, v]) => add(['color', 'darkText', k], v, 'color'))

  // Typography
  add(['font', 'sans'], tokens.typography.sans, 'fontFamily')
  add(['font', 'mono'], tokens.typography.mono, 'fontFamily')
  add(['font', 'display'], tokens.typography.display, 'fontFamily')
  Object.entries(tokens.typography.scale).forEach(([step, val]) => {
    add(['type', step, 'fontSize'], val.size, 'dimension')
    add(['type', step, 'lineHeight'], val.lineHeight, 'dimension')
  })

  // Spacing
  const sp = tokens.spacing.base
  ;[1,2,3,4,5,6,8,10,12,16,20,24,32].forEach((m) => {
    add(['spacing', String(m)], `${m * sp}px`, 'dimension')
  })

  // Radius
  Object.entries(tokens.radius).forEach(([k, v]) => add(['borderRadius', k], v, 'dimension'))

  // Shadows
  Object.entries(tokens.shadows).forEach(([k, v]) => add(['boxShadow', k], v, 'shadow'))

  // Motion
  Object.entries(tokens.motion.duration).forEach(([k, v]) => add(['duration', k], v, 'duration'))
  Object.entries(tokens.motion.easing).forEach(([k, v]) => add(['easing', k], v, 'cubicBezier'))

  // Z-index
  Object.entries(tokens.zIndex).forEach(([k, v]) => add(['zIndex', k], v, 'number'))

  // New categories
  if (tokens.cursor) Object.entries(tokens.cursor).forEach(([k, v]) => add(['cursor', k], v, 'string'))
  if (tokens.scrollbar) Object.entries(tokens.scrollbar).forEach(([k, v]) => add(['scrollbar', k], v, 'string'))
  if (tokens.glass) Object.entries(tokens.glass).forEach(([k, v]) => add(['glass', k], String(v), 'string'))
  if (tokens.gradients) {
    Object.entries(tokens.gradients).forEach(([k, v]) => {
      if (typeof v === 'string') {
        add(['gradient', k], v, 'string')
      }
    })
  }
  if (tokens.grid) {
    add(['grid', 'gutter'], tokens.grid.gutter, 'dimension')
    Object.entries(tokens.grid.columns).forEach(([bp, count]) => add(['grid', 'columns', bp], count, 'number'))
  }
  if (tokens.content) Object.entries(tokens.content).forEach(([k, v]) => add(['content', k], v, 'string'))
  if (tokens.density) Object.entries(tokens.density).forEach(([k, v]) => {
    if (typeof v === 'string') {
      add(['density', k], v, 'string')
    } else {
      add(['density', k], v, 'number')
    }
  })

  return JSON.stringify(sd, null, 2)
}

export function buildTailwindConfig(tokens: DesignTokens): string {
  const t = tokens
  const sp = t.spacing.base
  const spacingScale: Record<string, string> = {}
  ;[1,2,3,4,5,6,8,10,12,16,20,24,32].forEach((m) => {
    spacingScale[String(m)] = `${m * sp}px`
  })

  const config: Record<string, any> = {
    theme: {
      extend: {
        colors: {
          brand:   Object.fromEntries(Object.entries(t.colors.brand).map(([k,v]) => [k, v])),
          accent:  Object.fromEntries(Object.entries(t.colors.accent).map(([k,v]) => [k, v])),
          neutral: Object.fromEntries(Object.entries(t.colors.neutral).map(([k,v]) => [k, v])),
          surface: { ...t.colors.surface },
          text:    { ...t.colors.text },
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

  // New categories
  if (t.cursor) config.theme.extend.cursor = { ...t.cursor }
  if (t.glass) config.theme.extend.backdropBlur = { DEFAULT: t.glass.blur }
  if (t.grid) config.theme.extend.gridColumn = t.grid.columns
  if (t.density) config.theme.extend.spacing = { ...config.theme.extend.spacing, ...Object.fromEntries(Object.entries(t.density).filter(([_, v]) => typeof v === 'string').map(([k, v]) => [k, v])) }

  return `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(config, null, 2)}`
}

export function ExportPanel() {
  const tokens    = useHub((s) => s.design.tokens)
  const arch      = useHub((s) => s.arch)

  const [format, setFormat]   = useState<ExportFormat>('css')
  const [copied, setCopied]   = useState(false)

  const content =
    format === 'css'              ? buildCssVars(tokens)
    : format === 'json'           ? buildTokensJson(tokens)
    : format === 'figma'          ? buildFigmaTokens(tokens)
    : format === 'style-dictionary' ? buildStyleDictionary(tokens)
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
    <div data-spotlight="design-export-panel" className="border-t border-app-border">
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
          {(['css','json','tailwind','figma','style-dictionary'] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={[
                'flex-1 h-5 rounded text-[9px] font-medium transition-all',
                format === f ? 'bg-app-elevated text-app-text' : 'text-app-subtle hover:text-app-muted',
              ].join(' ')}
            >
              {f === 'css' ? 'CSS' : f === 'json' ? 'JSON' : f === 'tailwind' ? 'TW' : f === 'figma' ? 'Figma' : 'SD'}
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
