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
    const colorLinesRegex = /- \*\*(.*?):\*\* `#(.*?)`/g
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
      const families = familiesMatch[1].split(',')
      for (const fam of families) {
        const [k, v] = fam.split('=').map(s => s.trim())
        if (k === 'primary') typography.fontBody = v
        if (k === 'display') typography.fontHeading = v
        if (k === 'mono') typography.fontMono = v
      }
    }
  }

  // Section 4: Spacing & Grid
  const spacingSectionRegex = /## 4\. Spacing & Grid([\s\S]*?)(?=## \d|\n$)/
  const spacingMatch = spacingSectionRegex.exec(content)
  if (spacingMatch) {
    const scaleMatch = /- \*\*Spacing scale:\*\* (.*)/.exec(spacingMatch[1])
    if (scaleMatch) {
      spacing.scale = scaleMatch[1].split(',').map(s => s.trim())
    }
  }

  // Section 7: Motion
  const motionSectionRegex = /## 7\. Motion & Interaction([\s\S]*?)(?=## \d|\n$)/
  const motionMatch = motionSectionRegex.exec(content)
  if (motionMatch) {
    const hintMatch = /\[(.*?)\]/.exec(motionMatch[1])
    if (hintMatch) {
      motion.durationHint = hintMatch[1]
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
  if (Object.keys(motion).length > 0) sectionsFound++

  let confidence: 'rich' | 'partial' | 'minimal' = 'minimal'
  if (sectionsFound === 4) confidence = 'rich'
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
    motion: {}
  }

  if (profile.colorProfile) {
    const p = profile.colorProfile
    if (p.primary) tokens.colors.primary = p.primary
    if (p.secondary) tokens.colors.secondary = p.secondary
    if (p.accent) tokens.colors.accent = p.accent
    if (p.surface) tokens.colors.surface = p.surface
    if (p.background) tokens.colors.background = p.background
    if (p.text) tokens.colors.textPrimary = p.text
    if (p.danger) tokens.colors.destructive = p.danger
    if (p.success) tokens.colors.success = p.success
    if (p.warning) tokens.colors.warning = p.warning
    if (p.neutral) tokens.colors.textMuted = p.neutral
  }

  if (profile.typography) {
    if (profile.typography.fontBody) tokens.typography.fontBody = profile.typography.fontBody
    if (profile.typography.fontHeading) tokens.typography.fontHeading = profile.typography.fontHeading
    if (profile.typography.fontMono) tokens.typography.fontMono = profile.typography.fontMono
  }

  // Not directly mapping spacing/motion from array to detailed object since parser only extracted hints,
  // but if needed we could implement parsing logic for those properties.
  
  return tokens
}
