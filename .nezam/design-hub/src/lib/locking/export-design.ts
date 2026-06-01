import type { DesignTokens } from '@/types/design'

export type LockSitemapPageType = 'public' | 'auth' | 'admin' | 'modal' | 'embed'

export type LockSitemapPage = {
  id: string
  title: string
  route: string
  type: LockSitemapPageType
  access?: string[]
  status?: 'approved' | 'deferred' | 'removed'
  priority?: 'P0' | 'P1' | 'P2' | string
}

type GenerateOptions = {
  profileName?: string | null
  rtl?: boolean
}

function nowIso() {
  return new Date().toISOString()
}

function hexish(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim())
}

export function generateDesignMarkdown(
  tokens: DesignTokens,
  sitemap: LockSitemapPage[],
  opts: GenerateOptions = {}
): string {
  const profile = opts.profileName ?? 'custom'
  const rtl = opts.rtl ?? false

  const colors = tokens.colors
  const typography = tokens.typography
  const spacingBase = tokens.spacing.base

  const lineFromTypeStep = (step: { lineHeight: string; size: string }) => {
    const lh = Number(step.lineHeight.replace(/[^\d.]/g, '')) || 0
    const sz = Number(step.size.replace(/[^\d.]/g, '')) || 0
    return { lh, sz }
  }

  const baseStep = typography.scale.base
  const base = lineFromTypeStep({ lineHeight: baseStep.lineHeight, size: baseStep.size })

  // Keep DESIGN.md deterministic and compact enough to review.
  // Gate checks ensure non-template content, not full token completeness.
  const md: string[] = []

  md.push('# DESIGN CONTRACT')
  md.push('')
  md.push(`> Generated: ${nowIso()}`)
  md.push(`> Profile: ${profile}`)
  md.push(`> RTL: ${rtl ? 'true' : 'false'}`)
  md.push('')
  md.push('This file is the **locked design contract** for the NEZAM AI swarm.')
  md.push('Do not edit by hand — regenerate from the design hub lock flow.')
  md.push('')

  md.push('## 1. Token System (Source of Truth)')
  md.push('')
  md.push('### 1.1 Colors')
  md.push('')
  md.push(`- Primary (brand 500): \`${colors.brand['500']}\``)
  md.push(`- Accent (accent 500): \`${colors.accent['500']}\``)
  md.push(`- Surface background: \`${colors.surface.bg}\``)
  md.push(`- Panel surface: \`${colors.surface.panel}\``)
  md.push(`- Border: \`${colors.surface.border}\``)
  md.push(`- Text primary: \`${colors.text.primary}\``)
  md.push(`- Text muted: \`${colors.text.muted}\``)
  md.push('')

  md.push('### 1.2 Typography')
  md.push('')
  md.push(`- Sans font: \`${typography.sans}\``)
  md.push(`- Mono font: \`${typography.mono}\``)
  md.push(`- Display font: \`${typography.display}\``)
  md.push(`- Base size: \`${base.sz || typography.scale.base.size}\``)
  md.push(`- Base line-height: \`${base.lh || typography.scale.base.lineHeight}\``)
  md.push('')

  md.push('### 1.3 Spacing')
  md.push('')
  md.push(`- Base unit: \`${spacingBase}px\``)
  md.push('')

  md.push('### 1.4 Radius / Shadows / Motion')
  md.push('')
  md.push(`- Radius (md): \`${tokens.radius.md}\``)
  md.push(`- Shadows (md): \`${tokens.shadows.md}\``)
  md.push(`- Motion duration fast: \`${tokens.motion.duration.fast}\``)
  md.push('')

  md.push('## 2. Sitemap (Derived)')
  md.push('')
  if (!Array.isArray(sitemap) || sitemap.length === 0) {
    md.push('_No pages defined._')
  } else {
    md.push('| Route | Title | Type | Priority |')
    md.push('|------|-------|------|----------|')
    for (const p of sitemap) {
      md.push(`| \`${p.route}\` | ${p.title} | ${p.type} | ${p.priority ?? '—'} |`)
    }
  }

  md.push('')
  md.push('## 3. RTL Requirements')
  md.push('')
  if (rtl) {
    md.push('- Mirror layout direction (`dir="rtl"`)')
    md.push('- Use logical CSS properties (`margin-inline-*`, `padding-inline-*`, `border-inline-*`)')
    md.push('- Validate Arabic typography and directional icons')
  } else {
    md.push('- Standard LTR layout applies.')
  }

  // Optional sanity notes for humans; does not affect gates.
  md.push('')
  md.push('---')
  md.push('')
  md.push('Notes:')
  md.push(`- Hex token sanity: ${hexish(colors.brand['500']) ? 'ok' : 'check tokens'}`)
  md.push(`- Locked sitemap entries: ${sitemap.length}`)

  md.push('')

  return md.join('\n')
}

