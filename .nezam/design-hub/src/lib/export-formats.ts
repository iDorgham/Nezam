import type { ArchPage } from '@/types/arch'
import type { DesignTokens } from '@/types/design'
import { buildCssVars, buildTailwindConfig } from '@/components/design/ExportPanel'

export type ExportFormatId =
  | 'css'
  | 'json'
  | 'tailwind'
  | 'nextjs'
  | 'mermaid'
  | 'sitemap_json'
  | 'rbac'
  | 'markdown_map'
  | 'shadcn'
  | 'figma'
  | 'storybook'
  | 'github_gate'

export interface ExportFormatSpec {
  id: ExportFormatId
  label: string
  extension: string
  description: string
}

export const EXPORT_FORMATS: ExportFormatSpec[] = [
  { id: 'css',           label: 'CSS Variables',        extension: 'css',  description: 'Vanilla CSS custom properties.' },
  { id: 'json',          label: 'Design Tokens JSON',  extension: 'json', description: 'W3C Design Token Community Group (DTCG) specification.' },
  { id: 'tailwind',      label: 'Tailwind Config',      extension: 'ts',   description: 'Tailwind CSS theme extensions.' },
  { id: 'nextjs',        label: 'Next.js App Router',  extension: 'txt',  description: 'Folder directory router structure for Next.js.' },
  { id: 'mermaid',       label: 'Mermaid Flowchart',   extension: 'mmd',  description: 'Interactive visual architecture flowchart code.' },
  { id: 'sitemap_json',  label: 'Sitemap Import/Export',extension: 'json', description: 'Raw NEZAM sitemap schema JSON.' },
  { id: 'rbac',          label: 'RBAC Metrics Matrix',  extension: 'md',   description: 'Page-level access control security table.' },
  { id: 'markdown_map',  label: 'Architecture Map',     extension: 'md',   description: 'Formatted sitemap outline documentation.' },
  { id: 'shadcn',        label: 'shadcn/ui Preset',     extension: 'json', description: 'Shadcn UI CLI-compatible colors system preset.' },
  { id: 'figma',         label: 'Figma Tokens Studio',  extension: 'json', description: 'Figma Tokens Studio JSON variables set.' },
  { id: 'storybook',     label: 'Storybook Stories',   extension: 'tsx',  description: 'Boilerplate component story files generator.' },
  { id: 'github_gate',   label: 'GitHub Actions Gates', extension: 'json', description: 'GitHub gate validation matrix config.' },
]

export function generateExportContent(
  id: ExportFormatId,
  pages: Record<string, ArchPage>,
  tokens: DesignTokens
): string {
  const pageList = Object.values(pages).sort((a, b) => a.order - b.order)
  
  switch (id) {
    case 'css':
      return buildCssVars(tokens)

    case 'json':
      return JSON.stringify(tokens, null, 2)

    case 'tailwind':
      return buildTailwindConfig(tokens)

    case 'nextjs': {
      const lines: string[] = ['app/']
      
      function buildFolderTree(parentId: string | null, indent: string) {
        const children = pageList.filter((p) => p.parentId === parentId)
        children.forEach((child, idx) => {
          const isLast = idx === children.length - 1
          const prefix = isLast ? '└── ' : '├── '
          const nextIndent = indent + (isLast ? '    ' : '│   ')
          
          let folderName = child.route.split('/').pop() || 'index'
          if (folderName.startsWith('[') && folderName.endsWith(']')) {
            folderName = folderName // keep [slug] format
          }
          if (child.type === 'app') {
            folderName = `(${folderName}-app)`
          } else if (child.type === 'navmenu') {
            folderName = `_components`
          }

          lines.push(`${indent}${prefix}${folderName}/`)
          if (child.type === 'page' || child.type === 'subpage') {
            lines.push(`${nextIndent}├── page.tsx`)
            lines.push(`${nextIndent}└── loading.tsx`)
          } else if (child.type === 'app') {
            lines.push(`${nextIndent}└── layout.tsx`)
          }

          buildFolderTree(child.id, nextIndent)
        })
      }
      
      buildFolderTree(null, '')
      return lines.join('\n')
    }

    case 'mermaid': {
      const lines: string[] = ['graph TD', '  %% NEZAM Sitemap Architecture Flowchart']
      
      // Node styling definitions
      lines.push('  classDef app fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#fff;')
      lines.push('  classDef nav fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:#fff;')
      lines.push('  classDef page fill:#1e293b,stroke:#475569,stroke-width:1px,color:#fff;')
      lines.push('  classDef subpage fill:#0f172a,stroke:#334155,stroke-width:1px,color:#94a3b8;')
      lines.push('  classDef sect fill:#064e3b,stroke:#10b981,stroke-width:1px,style:dashed,color:#fff;')

      pageList.forEach((pg) => {
        const safeName = pg.name.replace(/["'\[\]()]/g, '')
        let shape = `["${safeName}"]`
        if (pg.type === 'app') shape = `[/"${safeName}"/]`
        if (pg.type === 'navmenu') shape = `(("${safeName}"))`
        if (pg.type === 'section') shape = `[["${safeName}"]]`

        lines.push(`  ${pg.id}${shape}`)
        if (pg.parentId) {
          lines.push(`  ${pg.parentId} --> ${pg.id}`)
        }
        
        // Stylings
        if (pg.type === 'app') lines.push(`  class ${pg.id} app;`)
        if (pg.type === 'navmenu') lines.push(`  class ${pg.id} nav;`)
        if (pg.type === 'page') lines.push(`  class ${pg.id} page;`)
        if (pg.type === 'subpage') lines.push(`  class ${pg.id} subpage;`)
        if (pg.type === 'section') lines.push(`  class ${pg.id} sect;`)
      })
      
      return lines.join('\n')
    }

    case 'sitemap_json':
      return JSON.stringify(pageList, null, 2)

    case 'rbac': {
      const lines: string[] = [
        '# NEZAM Access Control Matrix (RBAC)',
        '',
        '| Target Route | Level | Auth Scope | Admin | Editor | Guest | Bindings |',
        '|---|---|---|---|---|---|---|'
      ]
      
      pageList.forEach((pg) => {
        const bindings = pg.services?.join(', ') || 'none'
        const authRequired = pg.navSlot === 'hidden' ? 'Auth Required' : 'Public'
        lines.push(
          `| \`${pg.route}\` | \`${pg.type}\` | ${authRequired} | Allow | ${
            pg.route.includes('admin') || pg.route.includes('settings') ? 'Deny' : 'Allow'
          } | ${
            authRequired === 'Auth Required' ? 'Deny' : 'Allow'
          } | \`${bindings}\` |`
        )
      })
      return lines.join('\n')
    }

    case 'markdown_map': {
      const lines: string[] = ['# Sitemap Architecture Map', '']
      
      function buildOutline(parentId: string | null, depth: number) {
        const children = pageList.filter((p) => p.parentId === parentId)
        children.forEach((child) => {
          const indent = '  '.repeat(depth)
          const bindingText = child.services && child.services.length > 0 ? ` [bound: ${child.services.join(', ')}]` : ''
          lines.push(`${indent}- **${child.name}** (\`${child.route}\`) — *${child.type}*${bindingText}`)
          if (child.description) {
            lines.push(`${indent}  > ${child.description}`)
          }
          buildOutline(child.id, depth + 1)
        })
      }
      
      buildOutline(null, 0)
      return lines.join('\n')
    }

    case 'shadcn': {
      const config = {
        preset: 'zinc',
        colors: {
          light: {
            background: tokens.colors.surface.bg,
            foreground: tokens.colors.text.primary,
            card: tokens.colors.surface.panel,
            border: tokens.colors.surface.border,
            primary: tokens.colors.brand['500'],
            accent: tokens.colors.accent['500'],
          },
          dark: {
            background: tokens.colors.surface.bg,
            foreground: tokens.colors.text.primary,
            card: tokens.colors.surface.panel,
            border: tokens.colors.surface.border,
            primary: tokens.colors.brand['400'] || tokens.colors.brand['500'],
            accent: tokens.colors.accent['400'] || tokens.colors.accent['500'],
          }
        }
      }
      return JSON.stringify(config, null, 2)
    }

    case 'figma': {
      const figmaTokens = {
        global: {
          brand: Object.fromEntries(Object.entries(tokens.colors.brand).map(([k, v]) => [k, { value: v, type: 'color' }])),
          accent: Object.fromEntries(Object.entries(tokens.colors.accent).map(([k, v]) => [k, { value: v, type: 'color' }])),
          neutral: Object.fromEntries(Object.entries(tokens.colors.neutral).map(([k, v]) => [k, { value: v, type: 'color' }])),
          spacing: {
            base: { value: `${tokens.spacing.base}px`, type: 'spacing' }
          }
        }
      }
      return JSON.stringify(figmaTokens, null, 2)
    }

    case 'storybook': {
      return `import type { Meta, StoryObj } from '@storybook/react'
import { DesignSystemProvider } from '@/components/providers'

// NEZAM story meta scaffolding from tokens variables
const meta: Meta<typeof DesignSystemProvider> = {
  title: 'Design System / Tokens',
  component: DesignSystemProvider,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '${tokens.colors.surface.bg}' }],
    },
  },
}

export default meta
type Story = StoryObj<typeof DesignSystemProvider>

export const CSSVariablesTheme: Story = {
  render: () => (
    <div style={{ fontFamily: '${tokens.typography.sans}', padding: '24px', color: '${tokens.colors.text.primary}' }}>
      <h3 style={{ fontSize: '${tokens.typography.scale.lg.size}' }}>Brand Presets</h3>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {Object.entries(${JSON.stringify(tokens.colors.brand)}).map(([step, color]) => (
          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: color as string }} />
            <span style={{ fontSize: '10px', marginTop: '4px', opacity: 0.6 }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}`
    }

    case 'github_gate': {
      const config = {
        workspace: {
          onboarding_gate: 'green',
          design_tokens_check: 'scripts/checks/check-design-tokens.sh',
        },
        pipeline: {
          gates: {
            define: ['PRD.md', 'CONTEXT.md'],
            design: ['DESIGN.md'],
            build: ['tests/'],
          },
          sitemap: {
            nodes_count: pageList.length,
            levels: ['app', 'navmenu', 'page', 'subpage', 'section'],
            services: pageList.reduce((acc, p) => {
              if (p.services) p.services.forEach(s => acc.add(s))
              return acc
            }, new Set<string>()).size
          }
        }
      }
      return JSON.stringify(config, (_, v) => v instanceof Set ? Array.from(v) : v, 2)
    }

    default:
      return ''
  }
}
