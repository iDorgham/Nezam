import { DesignTokens } from '../store/tokens.store'
import { Page } from '../store/session.store'

export function generateDesignMarkdown(tokens: DesignTokens, sitemap: Page[]): string {
  let md = `# DESIGN CONTRACT\n\n`
  
  md += `## Design Tokens\n\n`
  
  md += `### Colors\n\n`
  Object.entries(tokens.colors).forEach(([key, value]) => {
    md += `- **${key}**: \`${value}\`\n`
  })
  
  md += `\n### Typography\n\n`
  md += `- **Heading Font**: ${tokens.typography.fontHeading}\n`
  md += `- **Body Font**: ${tokens.typography.fontBody}\n`
  md += `- **Base Size**: ${tokens.typography.baseSize}px\n`
  md += `- **Scale Ratio**: ${tokens.typography.scale}\n`

  md += `\n### Spacing\n\n`
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    md += `- **${key}**: \`${value}\`\n`
  })

  md += `\n### Radius\n\n`
  Object.entries(tokens.radius).forEach(([key, value]) => {
    md += `- **${key}**: \`${value}\`\n`
  })

  md += `\n### Elevation\n\n`
  Object.entries(tokens.elevation).forEach(([key, value]) => {
    md += `- **${key}**: \`${value}\`\n`
  })

  md += `\n### Motion\n\n`
  Object.entries(tokens.motion).forEach(([key, value]) => {
    md += `- **${key}**: \`${value}\`\n`
  })

  md += `\n### Z-Index\n\n`
  Object.entries(tokens.zIndex).forEach(([key, value]) => {
    md += `- **${key}**: \`${value}\`\n`
  })
  
  md += `\n## Sitemap\n\n`
  sitemap.forEach((page) => {
    md += `### ${page.title}\n`
    md += `- **Route**: \`${page.route}\`\n`
    md += `- **Type**: ${page.type}\n`
    if (page.navLabel) md += `- **Nav Label**: ${page.navLabel}\n`
    if (page.navIcon) md += `- **Nav Icon**: ${page.navIcon}\n`
    md += `\n`
  })
  
  return md
}
