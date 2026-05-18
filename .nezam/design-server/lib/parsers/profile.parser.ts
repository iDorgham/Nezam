export type ParsedProfile = {
  name: string
  category: string
  description: string
  colorProfile: any
  typography: any
  spacing: any
  borders: any
  motion: any
  confidence: 'rich' | 'partial' | 'minimal'
  rtl: boolean
}

export function parseProfile(name: string, content: string): ParsedProfile {
  let category = 'minimal'
  if (content.toLowerCase().includes('dark-mode') || content.includes('#0')) category = 'dark-mode'
  else if (content.toLowerCase().includes('dashboard') || content.toLowerCase().includes('saas')) category = 'dashboard'
  else if (content.toLowerCase().includes('mena') || content.toLowerCase().includes('rtl')) category = 'mena'

  const colorProfile: any = {}
  const typography: any = {}
  const spacing: any = {}
  const motion: any = {}
  const borders: any = {}
  
  // Section 2: Colors
  const colorSectionRegex = /## 2\. Color([\s\S]*?)(?=## \d|\n$)/
  const colorMatch = colorSectionRegex.exec(content)
  if (colorMatch) {
    const colorLinesRegex = /- \*\*(.*?):\*\* \`?#([A-Fa-f0-9]{3,8})\`?/g
    let cmatch
    while ((cmatch = colorLinesRegex.exec(colorMatch[1])) !== null) {
      const key = cmatch[1].toLowerCase().replace(/\s+/g, '_')
      const value = `#${cmatch[2]}`
      colorProfile[key] = value
    }
  }

  // Section 3: Typography
  const typoSectionRegex = /## 3\. Typography([\s\S]*?)(?=## \d|\n$)/
  const typoMatch = typoSectionRegex.exec(content)
  if (typoMatch) {
    const familiesMatch = /- \*\*Families:\*\* (.*)/.exec(typoMatch[1])
    if (familiesMatch) {
      const families = familiesMatch[1].replace(/`/g, '').split(',')
      for (const fam of families) {
        const parts = fam.split('=')
        if (parts.length === 2) {
          const k = parts[0].trim().toLowerCase()
          const v = parts[1].trim()
          if (k === 'primary') typography.fontBody = v
          if (k === 'display') typography.fontHeading = v
          if (k === 'mono') typography.fontMono = v
        }
      }
    }

    const weightsMatch = /- \*\*Weights:\*\* (.*)/.exec(typoMatch[1])
    if (weightsMatch) {
      typography.weights = weightsMatch[1]
        .split(',')
        .map(w => parseInt(w.replace(/`/g, '').trim(), 10))
        .filter(w => !isNaN(w))
    }

    let baseSize = 16
    let scale = 1.25
    const scaleMatch = /- \*\*Scale:\*\* (.*)/.exec(typoMatch[1])
    if (scaleMatch) {
      const baseMatch = /baseSize=(\d+)/i.exec(scaleMatch[1])
      if (baseMatch) baseSize = parseInt(baseMatch[1], 10)
      const scaleRatioMatch = /scale=([0-9.]+)/i.exec(scaleMatch[1])
      if (scaleRatioMatch) scale = parseFloat(scaleRatioMatch[1])
    }
    typography.baseSize = baseSize
    typography.scale = scale
  }

  // Section 4: Spacing & Grid
  const spacingSectionRegex = /## 4\. Spacing & Grid([\s\S]*?)(?=## \d|\n$)/
  const spacingMatch = spacingSectionRegex.exec(content)
  if (spacingMatch) {
    const scaleMatch = /- \*\*Spacing scale:\*\* (.*)/.exec(spacingMatch[1])
    if (scaleMatch) {
      spacing.scale = scaleMatch[1].split(/[\/,]/).map(s => {
        const num = parseInt(s.replace(/`/g, '').trim(), 10)
        return isNaN(num) ? s.replace(/`/g, '').trim() : `${num}px`
      })
    }
  }

  // Section 6: Components (Borders/Radii)
  const componentsSectionRegex = /## 6\. Components([\s\S]*?)(?=## \d|\n$)/
  const componentsMatch = componentsSectionRegex.exec(content)
  if (componentsMatch) {
    const radiiMatch = /- \*\*Radii:\*\* (.*)/.exec(componentsMatch[1])
    if (radiiMatch) {
      const radii = radiiMatch[1].replace(/`/g, '').split(',')
      for (const rad of radii) {
        const parts = rad.split('=')
        if (parts.length === 2) {
          const k = parts[0].trim().toLowerCase()
          const v = parts[1].trim()
          borders[k] = v
        }
      }
    }
  }

  // Section 7: Motion
  const motionSectionRegex = /## 7\. Motion & Interaction([\s\S]*?)(?=## \d|\n$)/
  const motionMatch = motionSectionRegex.exec(content)
  if (motionMatch) {
    const durationRangeRegex = /(\d+)\s*[-–—]\s*(\d+)\s*ms/
    const durationRangeMatch = durationRangeRegex.exec(motionMatch[1])
    if (durationRangeMatch) {
      motion.durationMin = durationRangeMatch[1] + 'ms'
      motion.durationMax = durationRangeMatch[2] + 'ms'
    } else {
      const durationRegex = /(\d+)\s*ms/
      const durationMatch = durationRegex.exec(motionMatch[1])
      if (durationMatch) {
        motion.durationNormal = durationMatch[1] + 'ms'
      }
    }
  }

  // RTL Detection
  const lowerContent = content.toLowerCase()
  const rtlKeywords = ['rtl', 'arabic', 'مناطق', 'khaleeji', 'mena', 'levantine', 'masri', 'maghrebi']
  const rtl = rtlKeywords.some(kw => lowerContent.includes(kw))

  let sectionsFound = 0
  if (Object.keys(colorProfile).length > 0) sectionsFound++
  if (Object.keys(typography).length > 0) sectionsFound++
  if (Object.keys(spacing).length > 0) sectionsFound++
  if (Object.keys(borders).length > 0) sectionsFound++
  if (Object.keys(motion).length > 0) sectionsFound++

  let confidence: 'rich' | 'partial' | 'minimal' = 'minimal'
  if (sectionsFound >= 4) confidence = 'rich'
  else if (sectionsFound >= 2) confidence = 'partial'

  return {
    name,
    category,
    description: `Parsed profile for ${name}`,
    colorProfile,
    typography,
    spacing,
    borders,
    motion,
    confidence,
    rtl
  }
}

export function profileToTokens(profile: ParsedProfile): any {
  const tokens: any = {
    colors: {},
    typography: {},
    spacing: {},
    radius: {
      none: profile.borders?.none || '0',
      sm: profile.borders?.sm || '4px',
      md: profile.borders?.md || '8px',
      lg: profile.borders?.lg || '12px',
      xl: profile.borders?.xl || '16px',
      full: profile.borders?.full || '9999px'
    },
    elevation: {
      none: 'none',
      sm: '0 1px 3px rgba(0,0,0,0.12)',
      md: '0 4px 16px rgba(0,0,0,0.16)',
      lg: '0 8px 32px rgba(0,0,0,0.24)',
      xl: '0 16px 64px rgba(0,0,0,0.32)'
    },
    motion: {},
    zIndex: {
      base: 0,
      dropdown: 100,
      sticky: 200,
      overlay: 300,
      modal: 400,
      toast: 500
    }
  }

  if (profile.colorProfile) {
    const p = profile.colorProfile
    const primary = p.primary || '#FF5701'
    
    tokens.colors.primary = primary
    tokens.colors.primaryHover = p.primary_hover || p.primary_hover_state || primary
    tokens.colors.secondary = p.secondary || '#8a8f98'
    tokens.colors.accent = p.accent || primary
    tokens.colors.interactive = p.interactive || primary
    tokens.colors.destructive = p.danger || p.destructive || '#dc2626'
    tokens.colors.success = p.success || '#10b981'
    tokens.colors.warning = p.warning || '#f59e0b'
    tokens.colors.info = p.info || p.accent || '#3b82f6'
    tokens.colors.background = p.background || '#090A0F'
    tokens.colors.surface = p.surface || '#0F111A'
    tokens.colors.surfaceElevated = p.surface_elevated || '#191a1b'
    tokens.colors.overlay = p.overlay || 'rgba(0,0,0,0.5)'
    tokens.colors.textPrimary = p.text || p.text_primary || '#F7F8F8'
    tokens.colors.textSecondary = p.text_secondary || '#d1d5db'
    tokens.colors.textMuted = p.neutral || p.text_muted || '#8A8F98'
    tokens.colors.textDisabled = p.text_disabled || '#6b7280'
    tokens.colors.textInverse = p.text_inverse || '#08090a'
    tokens.colors.border = p.border || 'rgba(255, 255, 255, 0.08)'
    tokens.colors.borderStrong = p.border_strong || 'rgba(255, 255, 255, 0.15)'
    tokens.colors.borderFocus = primary
  }

  if (profile.typography) {
    const t = profile.typography
    const baseSize = t.baseSize || 16
    const scale = t.scale || 1.25

    tokens.typography.fontHeading = t.fontHeading || 'system-ui'
    tokens.typography.fontBody = t.fontBody || 'system-ui'
    tokens.typography.fontMono = t.fontMono || 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    tokens.typography.baseSize = baseSize
    tokens.typography.scale = scale

    // Calculate fluid typography scale
    const sizes = {
      Xs: baseSize / (scale * scale),
      Sm: baseSize / scale,
      Md: baseSize,
      Lg: baseSize * scale,
      Xl: baseSize * scale * scale,
      '2xl': baseSize * scale * scale * scale,
      '3xl': baseSize * scale * scale * scale * scale,
      '4xl': baseSize * scale * scale * scale * scale * scale
    }

    const viewportFactors = {
      Xs: 0.8,
      Sm: 0.9,
      Md: 1.0,
      Lg: 1.2,
      Xl: 1.5,
      '2xl': 2.0,
      '3xl': 2.5,
      '4xl': 3.0
    }

    Object.entries(sizes).forEach(([key, val]) => {
      const min = Math.round(val * 0.8)
      const max = Math.round(val)
      const factor = viewportFactors[key as keyof typeof viewportFactors]
      const preferred = `${(val * factor * 0.08).toFixed(2)}vw + ${Math.round(val * 0.7)}px`
      tokens.typography[`size${key}` as keyof typeof tokens.typography] = `clamp(${min}px, ${preferred}, ${max}px)`
    })

    const weights = t.weights || [300, 400, 500, 600, 700]
    tokens.typography.weightLight = weights.includes(300) ? 300 : 300
    tokens.typography.weightNormal = weights.includes(400) ? 400 : 400
    tokens.typography.weightMedium = weights.includes(500) ? 500 : 500
    tokens.typography.weightSemibold = weights.includes(600) ? 600 : 600
    tokens.typography.weightBold = weights.includes(700) ? 700 : 700

    tokens.typography.lineHeightTight = '1.2'
    tokens.typography.lineHeightNormal = '1.5'
    tokens.typography.lineHeightRelaxed = '1.75'
  }

  if (profile.spacing && profile.spacing.scale) {
    const s = profile.spacing.scale
    tokens.spacing = {
      baseUnit: s[0] ? parseInt(s[0], 10) : 4,
      xs: s[0] || '4px',
      sm: s[1] || '8px',
      md: s[2] || '12px',
      lg: s[3] || '16px',
      xl: s[4] || '24px',
      '2xl': s[5] || '32px',
      '3xl': s[6] || '48px',
      '4xl': s[7] || '64px'
    }
  } else {
    tokens.spacing = {
      baseUnit: 4,
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '32px',
      '3xl': '48px',
      '4xl': '64px'
    }
  }

  if (profile.motion) {
    const m = profile.motion
    const fast = m.durationMin || '100ms'
    const slow = m.durationMax || '400ms'
    let normal = '200ms'
    if (m.durationMin && m.durationMax) {
      const minNum = parseInt(m.durationMin, 10)
      const maxNum = parseInt(m.durationMax, 10)
      normal = `${Math.round((minNum + maxNum) / 2)}ms`
    } else if (m.durationNormal) {
      normal = m.durationNormal
    }

    tokens.motion = {
      durationFast: fast,
      durationNormal: normal,
      durationSlow: slow,
      easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easingSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  } else {
    tokens.motion = {
      durationFast: '100ms',
      durationNormal: '200ms',
      durationSlow: '400ms',
      easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easingSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }

  return tokens
}

export function serializeTokensToMarkdown(name: string, tokens: any): string {
  const primary = tokens.colors.primary || '#FF5701'
  const secondary = tokens.colors.secondary || '#8a8f98'
  const success = tokens.colors.success || '#10b981'
  const warning = tokens.colors.warning || '#f59e0b'
  const danger = tokens.colors.destructive || tokens.colors.danger || '#dc2626'
  const surface = tokens.colors.surface || '#0F111A'
  const text = tokens.colors.textPrimary || '#F7F8F8'
  const background = tokens.colors.background || '#090A0F'
  
  const isDark = background === '#090A0F' || background === '#000000' || background.startsWith('#0')
  const category = isDark ? 'Modern & Dark' : 'Modern & Light'

  const fontHeading = tokens.typography.fontHeading || 'system-ui'
  const fontBody = tokens.typography.fontBody || 'system-ui'
  const fontMono = tokens.typography.fontMono || 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  const baseSize = tokens.typography.baseSize || 16
  const scale = tokens.typography.scale || 1.25

  const xsSpace = tokens.spacing.xs || '4px'
  const smSpace = tokens.spacing.sm || '8px'
  const mdSpace = tokens.spacing.md || '12px'
  const lgSpace = tokens.spacing.lg || '16px'
  const xlSpace = tokens.spacing.xl || '24px'
  const xxlSpace = tokens.spacing['2xl'] || '32px'

  const durationFast = tokens.motion.durationFast || '100ms'
  const durationSlow = tokens.motion.durationSlow || '400ms'

  const noneRadius = tokens.radius?.none || '0'
  const smRadius = tokens.radius?.sm || '4px'
  const mdRadius = tokens.radius?.md || '8px'
  const lgRadius = tokens.radius?.lg || '12px'
  const xlRadius = tokens.radius?.xl || '16px'
  const fullRadius = tokens.radius?.full || '9999px'

  return `# Design System Inspired by ${name.charAt(0).toUpperCase() + name.slice(1)}

> Category: ${category}
> Custom design system configured interactively in Nezam Token Studio.

## 1. Visual Theme & Atmosphere

Interactive design system profile generated by Nezam Token Studio.

- **Visual style:** modern, responsive, premium
- **Color stance:** primary, neutral, success, warning, danger
- **Design intent:** Keep outputs recognizable to this style family while preserving usability and readability.

## 2. Color

- **Primary:** \`${primary}\` — Token from style foundations.
- **Secondary:** \`${secondary}\` — Token from style foundations.
- **Success:** \`${success}\` — Token from style foundations.
- **Warning:** \`${warning}\` — Token from style foundations.
- **Danger:** \`${danger}\` — Token from style foundations.
- **Surface:** \`${surface}\` — Token from style foundations.
- **Text:** \`${text}\` — Token from style foundations.
- **Neutral:** \`${surface}\` — Derived from the surface token for official format compatibility.

- Favor Primary (${primary}) for CTA emphasis.
- Use Surface (${surface}) for large backgrounds and cards.
- Keep body copy on Text (${text}) for legibility.

## 3. Typography

- **Scale:** desktop-first expressive scale
- **Families:** display=${fontHeading}, primary=${fontBody}, mono=${fontMono}
- **Weights:** 300, 400, 500, 600, 700
- **Scale:** baseSize=${baseSize}, scale=${scale}
- Headings should carry the style personality; body text should optimize scanability and contrast.

## 4. Spacing & Grid

- **Spacing scale:** ${xsSpace}/${smSpace}/${mdSpace}/${lgSpace}/${xlSpace}/${xxlSpace}
- Keep vertical rhythm consistent across sections and components.
- Align columns and modules to a predictable grid; avoid ad-hoc offsets.

## 5. Layout & Composition

- Prefer clear content blocks with consistent internal padding.
- Keep hierarchy obvious: headline → support text → primary action.
- Use whitespace to separate concerns before adding borders or shadows.

## 6. Components

- **Radii:** none=${noneRadius}, sm=${smRadius}, md=${mdRadius}, lg=${lgRadius}, xl=${xlRadius}, full=${fullRadius}
- Buttons: primary action uses \`${primary}\`; secondary actions stay neutral.
- Inputs: strong focus-visible states, clear labels, and predictable error messaging.
- Cards/sections: use consistent radii, spacing, and elevation strategy across the page.

## 7. Motion & Interaction

- Use subtle transitions that emphasize Primary (${primary}) as the interaction signal.
- Default to short, purposeful transitions (${durationFast.replace('ms', '')}–${durationSlow.replace('ms', '')}ms) with stable easing.
- Ensure hover, focus-visible, active, disabled, and loading states are explicit.

## 8. Voice & Brand

- Tone should reflect the visual style: concise, confident, and product-specific.
- Keep microcopy action-oriented and avoid generic filler language.
- Preserve the style identity in headlines while keeping UI labels literal and clear.

## 9. Anti-patterns

- Do not introduce off-palette colors when an existing token can solve the problem.
- Do not flatten hierarchy by using the same type size/weight for all text.
- Do not add decorative effects that reduce readability or accessibility.
- Do not mix unrelated visual metaphors in the same interface.
`
}
