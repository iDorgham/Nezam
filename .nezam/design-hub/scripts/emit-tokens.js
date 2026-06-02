const fs = require('fs')
const path = require('path')

/** Walk up from __dirname until we find DESIGN.md — robust regardless of how pnpm invokes the script.
 *  Set NEZAM_ROOT env var to override (useful for testing with a mock root). */
function findRepoRoot() {
  if (process.env.NEZAM_ROOT) return process.env.NEZAM_ROOT
  let dir = __dirname
  const root = path.parse(dir).root
  while (dir !== root) {
    if (fs.existsSync(path.join(dir, 'DESIGN.md'))) return dir
    dir = path.dirname(dir)
  }
  // Fallback: 3 levels up from scripts/ = NEZAM root
  return path.resolve(__dirname, '../../..')
}

const REPO_ROOT = findRepoRoot()
const DESIGN_MD_PATH = path.join(REPO_ROOT, 'DESIGN.md')
const TOKENS_CSS_PATH = path.join(REPO_ROOT, '.nezam/design-hub/src/styles/tokens.css')
const TOKENS_JSON_PATH = path.join(REPO_ROOT, '.nezam/design-hub/design/tokens.json')

function parseDesignMd() {
  if (!fs.existsSync(DESIGN_MD_PATH)) {
    console.error(`❌ DESIGN.md not found at ${DESIGN_MD_PATH}`)
    process.exit(1)
  }

  const content = fs.readFileSync(DESIGN_MD_PATH, 'utf8')
  
  // Color Extraction
  const colors = {}
  const colorMatches = content.match(/- \*\*([A-Za-z0-9\s()]+):\*\* `(#[0-9a-fA-F]{6})`/g) || []
  colorMatches.forEach(m => {
    const parts = m.match(/- \*\*([A-Za-z0-9\s()]+):\*\* `(#[0-9a-fA-F]{6})`/)
    if (parts) {
      const name = parts[1].toLowerCase().replace(/\s+/g, '-').split('-(')[0]
      colors[name] = parts[2]
    }
  })

  // Typography Extraction
  const families = {}
  const familyMatch = content.match(/- \*\*Families:\*\* ([^\n]+)/)
  if (familyMatch) {
    const parts = familyMatch[1].split(',').map(s => s.trim())
    parts.forEach(p => {
      const kv = p.split('=')
      if (kv.length === 2) {
        families[kv[0].trim()] = kv[1].trim()
      }
    })
  }

  // Spacing Extraction
  let spacingScale = [4, 8, 12, 16, 24, 32]
  const spacingMatch = content.match(/- \*\*Spacing scale:\*\* ([^\n]+)/)
  if (spacingMatch) {
    spacingScale = spacingMatch[1].split('/').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
  }

  return {
    colors,
    typography: {
      families,
      scale: 'desktop-first expressive'
    },
    spacing: spacingScale
  }
}

function emitFiles() {
  console.log('🔄 Parsing DESIGN.md Style Tokens...')
  const tokens = parseDesignMd()

  // Generate CSS variables
  let css = `/* Generated from DESIGN.md by emit-tokens.js - DO NOT EDIT MANUALLY */\n\n:root {\n`
  
  // Colors
  Object.keys(tokens.colors).forEach(name => {
    css += `  --ds-color-${name}: ${tokens.colors[name]};\n`
  })

  // Typography
  Object.keys(tokens.typography.families).forEach(name => {
    css += `  --ds-font-${name}: ${tokens.typography.families[name]};\n`
  })

  // Spacing
  tokens.spacing.forEach((val, i) => {
    css += `  --ds-space-${i + 1}: ${val}px;\n`
  })

  css += `}\n`

  // Ensure directories exist
  const cssDir = path.dirname(TOKENS_CSS_PATH)
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true })
  }

  const jsonDir = path.dirname(TOKENS_JSON_PATH)
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true })
  }

  // Write CSS and JSON
  fs.writeFileSync(TOKENS_CSS_PATH, css, 'utf8')
  console.log(`✅ Emitted CSS variables to: ${TOKENS_CSS_PATH}`)

  const jsonContent = {
    version: '1.0.0',
    source: 'DESIGN.md',
    generated_at: new Date().toISOString().split('T')[0],
    color: Object.keys(tokens.colors).reduce((acc, cur) => {
      acc[cur] = { value: tokens.colors[cur], role: cur }
      return acc;
    }, {}),
    typography: {
      family_primary: tokens.typography.families.primary || 'Open Sans',
      family_display: tokens.typography.families.display || 'Inter',
      family_mono: tokens.typography.families.mono || 'Inconsolata',
      scale: tokens.typography.scale
    },
    spacing: {
      scale: tokens.spacing
    },
    profile: 'nezam-v3'
  }

  fs.writeFileSync(TOKENS_JSON_PATH, JSON.stringify(jsonContent, null, 2), 'utf8')
  console.log(`✅ Emitted JSON tokens to: ${TOKENS_JSON_PATH}`)
}

emitFiles()
