import { DesignTokens } from '../store/tokens.store'
import { Page } from '../store/session.store'
import { buildTokenCssBlock } from './write-css-vars'

type GenerateOptions = {
  profileName?: string | null
  rtl?: boolean
}

const TYPE_TO_COMPONENTS: Record<Page['type'], string[]> = {
  public: ['Nav_TopBar', 'Hero_*', 'Section_*', 'Footer_Simple'],
  auth: ['Form_Login', 'Form_SignUp', 'OAuth_Provider', 'Alert_Banner'],
  admin: ['Nav_Sidebar', 'Table_DataGrid', 'Filter_Bar', 'Modal_Dialog'],
  modal: ['Modal_Dialog', 'Form_*', 'Button_Group'],
  embed: ['Embed_Frame', 'Content_Card'],
}

export function generateDesignMarkdown(
  tokens: DesignTokens,
  sitemap: Page[],
  opts: GenerateOptions = {}
): string {
  const now = new Date().toISOString()
  const profile = opts.profileName ?? 'custom'
  const rtl = opts.rtl ?? sitemap.some((p) => p.navLabel?.match(/[؀-ۿ]/))

  const c = tokens.colors
  const tp = tokens.typography
  const sp = tokens.spacing
  const r = tokens.radius
  const e = tokens.elevation
  const m = tokens.motion
  const z = tokens.zIndex

  const md: string[] = []

  md.push('# DESIGN CONTRACT')
  md.push('')
  md.push(`> Generated: ${now}`)
  md.push(`> Profile: ${profile}`)
  md.push(`> RTL: ${rtl ? 'true (Arabic / MENA dialect support required)' : 'false'}`)
  md.push('')
  md.push('This file is the **locked design contract** for the NEZAM AI swarm.')
  md.push('Do not edit by hand — regenerate from the design server.')
  md.push('')

  // ---- Section 1: Token system ----
  md.push('## 1. Token System')
  md.push('')

  md.push('### 1.1 Color Tokens')
  md.push('')
  md.push('| Token | Value |')
  md.push('|-------|-------|')
  for (const [key, val] of Object.entries(c)) {
    md.push(`| \`--ds-${camelToKebab(key)}\` | \`${val}\` |`)
  }
  md.push('')

  md.push('### 1.2 Typography Scale')
  md.push('')
  md.push(`- **Heading font:** \`${tp.fontHeading}\``)
  md.push(`- **Body font:** \`${tp.fontBody}\``)
  md.push(`- **Mono font:** \`${tp.fontMono}\``)
  md.push(`- **Base size:** ${tp.baseSize}px · **Scale ratio:** ${tp.scale}`)
  md.push('')
  md.push('| Role | Size | Weight | Line Height |')
  md.push('|------|------|--------|-------------|')
  md.push(`| Caption | ${tp.sizeXs} | ${tp.weightNormal} | ${tp.lineHeightNormal} |`)
  md.push(`| Label   | ${tp.sizeSm} | ${tp.weightMedium} | ${tp.lineHeightNormal} |`)
  md.push(`| Body    | ${tp.sizeMd} | ${tp.weightNormal} | ${tp.lineHeightNormal} |`)
  md.push(`| Lead    | ${tp.sizeLg} | ${tp.weightNormal} | ${tp.lineHeightRelaxed} |`)
  md.push(`| H4      | ${tp.sizeXl} | ${tp.weightSemibold} | ${tp.lineHeightTight} |`)
  md.push(`| H3      | ${tp.size2xl} | ${tp.weightSemibold} | ${tp.lineHeightTight} |`)
  md.push(`| H2      | ${tp.size3xl} | ${tp.weightBold} | ${tp.lineHeightTight} |`)
  md.push(`| H1 / Display | ${tp.size4xl} | ${tp.weightBold} | ${tp.lineHeightTight} |`)
  md.push('')

  md.push('### 1.3 Spacing Scale')
  md.push('')
  md.push('| Step | Value |')
  md.push('|------|-------|')
  for (const [key, val] of Object.entries(sp)) {
    md.push(`| \`${key}\` | \`${val}\` |`)
  }
  md.push('')

  md.push('### 1.4 Radius')
  md.push('')
  for (const [key, val] of Object.entries(r)) md.push(`- \`${key}\`: \`${val}\``)
  md.push('')

  md.push('### 1.5 Elevation')
  md.push('')
  for (const [key, val] of Object.entries(e)) md.push(`- \`${key}\`: \`${val}\``)
  md.push('')

  md.push('### 1.6 Motion')
  md.push('')
  md.push(`- \`durationFast\`: ${m.durationFast}`)
  md.push(`- \`durationNormal\`: ${m.durationNormal}`)
  md.push(`- \`durationSlow\`: ${m.durationSlow}`)
  md.push(`- \`easingDefault\`: \`${m.easingDefault}\``)
  md.push(`- \`easingSpring\`: \`${m.easingSpring}\``)
  md.push('')

  md.push('### 1.7 Z-Index Scale')
  md.push('')
  for (const [key, val] of Object.entries(z)) md.push(`- \`${key}\`: ${val}`)
  md.push('')

  // ---- Section 2: CSS variable export ----
  md.push('## 2. CSS Variable Export')
  md.push('')
  md.push('Copy this block into your application stylesheet to enable the tokens:')
  md.push('')
  md.push('```css')
  md.push(buildTokenCssBlock(tokens))
  md.push('```')
  md.push('')

  // ---- Section 3: Sitemap ----
  md.push('## 3. Sitemap & Page Inventory')
  md.push('')
  if (sitemap.length === 0) {
    md.push('_No pages defined._')
  } else {
    md.push('| Route | Title | Type | Nav Label | Nav Position |')
    md.push('|-------|-------|------|-----------|--------------|')
    sitemap.forEach((page) => {
      md.push(
        `| \`${page.route}\` | ${page.title} | ${page.type} | ${page.navLabel ?? '—'} | ${page.navPosition ?? '—'} |`
      )
    })
  }
  md.push('')

  // ---- Section 4: Component inventory ----
  md.push('## 4. Component Inventory (Derived)')
  md.push('')
  const componentSet = new Set<string>()
  sitemap.forEach((p) => TYPE_TO_COMPONENTS[p.type]?.forEach((c) => componentSet.add(c)))
  if (componentSet.size === 0) {
    md.push('_Add pages to the sitemap to derive a component inventory._')
  } else {
    Array.from(componentSet).sort().forEach((c) => md.push(`- ${c}`))
  }
  md.push('')

  // ---- Section 5: RTL requirements ----
  md.push('## 5. RTL Requirements')
  md.push('')
  if (rtl) {
    md.push('RTL is **required**. The swarm must:')
    md.push('- Mirror layout direction on `dir="rtl"`')
    md.push('- Use logical CSS properties (`margin-inline-*`, `padding-inline-*`, `border-inline-*`)')
    md.push('- Mirror directional icons (chevrons, arrows) using `rtl:rotate-180`')
    md.push('- Validate Arabic typography (Cairo, Tajawal, IBM Plex Arabic, or system Arabic stack)')
  } else {
    md.push('RTL is **not required** for this contract. Standard LTR layout applies.')
  }
  md.push('')

  // ---- Section 6: Gate compliance ----
  md.push('## 6. Gate Compliance Checklist')
  md.push('')
  md.push('- [x] Token contract complete (colors, typography, spacing, radius, elevation, motion, z-index)')
  md.push('- [x] Typography scale defined (caption → display)')
  md.push('- [x] Motion budget defined (fast / normal / slow)')
  md.push(`- [${rtl ? 'x' : ' '}] RTL validated`)
  md.push(`- [${sitemap.length > 0 ? 'x' : ' '}] Sitemap populated (${sitemap.length} pages)`)
  md.push('- [ ] Wireframes locked (see `wireframes_locked.json`)')
  md.push('')

  return md.join('\n')
}

function camelToKebab(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
