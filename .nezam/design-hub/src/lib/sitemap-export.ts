/**
 * Sitemap Export Generators
 * All format transformers for the sitemap builder data.
 */

import type {
  SitemapBuilderApp,
  SitemapBuilderNavMenu,
  SitemapBuilderPage,
  SitemapBuilderService,
  AppKind,
} from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

/** Flatten all pages (including sub-pages) in a menu. */
function flattenPages(pages: SitemapBuilderPage[], prefix = ''): Array<{ page: SitemapBuilderPage; path: string }> {
  const result: Array<{ page: SitemapBuilderPage; path: string }> = []
  for (const p of pages) {
    const path = prefix ? `${prefix}/${slugify(p.name)}` : `/${slugify(p.name)}`
    result.push({ page: p, path: p.url || path })
    if (p.subPages?.length) result.push(...flattenPages(p.subPages, p.url || path))
  }
  return result
}

/** Derive URL prefix from app kind. */
function appUrlPrefix(kind: AppKind): string {
  switch (kind) {
    case 'marketing':         return ''
    case 'dashboard-client':  return '/dashboard'
    case 'dashboard-admin':   return '/admin'
    case 'mobile':            return '/mobile'
    case 'desktop':           return '/app'
    case 'api':               return '/api'
    default:                  return ''
  }
}

/** Derive RBAC roles from app kind. */
function appRoles(kind: AppKind): string[] {
  switch (kind) {
    case 'marketing':         return ['guest', 'user']
    case 'dashboard-client':  return ['user', 'manager']
    case 'dashboard-admin':   return ['admin', 'super_admin']
    case 'mobile':            return ['user']
    case 'desktop':           return ['user', 'admin']
    case 'api':               return ['service', 'admin']
    default:                  return ['user']
  }
}

// ── Export: Full JSON ─────────────────────────────────────────────────────────

export function exportFullJSON(
  apps: SitemapBuilderApp[],
  services: SitemapBuilderService[],
): string {
  function serializePage(p: SitemapBuilderPage): object {
    return {
      id: p.id, name: p.name, url: p.url, status: p.status, notes: p.notes,
      sections: p.sections.map((s) => ({ id: s.id, name: s.name, description: s.description, notes: s.notes })),
      subPages: p.subPages?.map(serializePage),
    }
  }
  return JSON.stringify({
    $schema: 'https://nezam.design/schema/sitemap-v3.json',
    exportedAt: new Date().toISOString(),
    apps: apps.map((a) => ({
      id: a.id, name: a.name, kind: a.kind, notes: a.notes,
      navMenus: a.navMenus.map((m) => ({
        id: m.id, name: m.name, kind: m.kind, notes: m.notes,
        pages: m.pages.map(serializePage),
      })),
    })),
    services: services.map((sv) => ({
      id: sv.id, name: sv.name, kind: sv.kind,
      description: sv.description, endpoint: sv.endpoint,
      notes: sv.notes, connectedPageIds: sv.connectedPageIds,
    })),
  }, null, 2)
}

// ── Export: Folder Structure ──────────────────────────────────────────────────

export function exportFolderStructure(apps: SitemapBuilderApp[]): string {
  const lines: string[] = ['# Folder Structure', '']
  for (const app of apps) {
    lines.push(`📦 ${app.name}/`)
    for (const menu of app.navMenus) {
      if (menu.pages.length === 0) continue
      function renderPages(pages: SitemapBuilderPage[], indent: number) {
        for (const page of pages) {
          const pad = '  '.repeat(indent)
          const seg = slugify(page.name)
          lines.push(`${pad}├── ${seg}/`)
          lines.push(`${pad}│   ├── page.tsx`)
          if (page.sections.length > 0) {
            lines.push(`${pad}│   └── _sections/`)
            for (const sec of page.sections) {
              lines.push(`${pad}│       ├── ${slugify(sec.name)}.tsx`)
            }
          }
          if (page.subPages?.length) renderPages(page.subPages, indent + 1)
        }
      }
      renderPages(menu.pages, 1)
    }
    lines.push('')
  }
  return lines.join('\n')
}

// ── Export: Full URL Structure ────────────────────────────────────────────────

export function exportURLStructure(apps: SitemapBuilderApp[]): string {
  const lines: string[] = ['# Full URL Structure', '']
  for (const app of apps) {
    const prefix = appUrlPrefix(app.kind)
    lines.push(`## ${app.name} (${app.kind})`)
    for (const menu of app.navMenus) {
      if (menu.pages.length === 0) continue
      lines.push(`### ${menu.name}`)
      const flat = flattenPages(menu.pages, prefix)
      for (const { page, path } of flat) {
        const status = page.status ? ` [${page.status}]` : ''
        lines.push(`  ${path}${status}`)
        if (page.sections.length > 0) {
          lines.push(`    sections: ${page.sections.map((s) => s.name).join(', ')}`)
        }
      }
      lines.push('')
    }
  }
  return lines.join('\n')
}

// ── Export: Nav Menus ─────────────────────────────────────────────────────────

export function exportNavMenus(apps: SitemapBuilderApp[]): string {
  const lines: string[] = ['# Navigation Menus', '']
  for (const app of apps) {
    lines.push(`## ${app.name}`)
    for (const menu of app.navMenus) {
      lines.push(`### ${menu.name} (${menu.kind})`)
      for (const page of menu.pages) {
        const url = page.url || `${appUrlPrefix(app.kind)}/${slugify(page.name)}`
        lines.push(`- [${page.name}](${url})`)
        if (page.subPages?.length) {
          for (const sub of page.subPages) {
            const subUrl = sub.url || `${url}/${slugify(sub.name)}`
            lines.push(`  - [${sub.name}](${subUrl})`)
          }
        }
      }
      lines.push('')
    }
  }
  return lines.join('\n')
}

// ── Export: App Pages ─────────────────────────────────────────────────────────

export function exportAppPages(apps: SitemapBuilderApp[]): string {
  const lines: string[] = ['# App Pages', '']
  for (const app of apps) {
    const prefix = appUrlPrefix(app.kind)
    lines.push(`## ${app.name} (${app.kind})`)
    lines.push(`Base URL prefix: \`${prefix || '/'}\``)
    lines.push('')
    let pageNum = 1
    for (const menu of app.navMenus) {
      const flat = flattenPages(menu.pages, prefix)
      for (const { page, path } of flat) {
        lines.push(`### ${pageNum++}. ${page.name}`)
        lines.push(`- **Path:** \`${path}\``)
        if (page.status) lines.push(`- **Status:** ${page.status}`)
        if (page.notes) lines.push(`- **Notes:** ${page.notes}`)
        if (page.sections.length > 0) {
          lines.push(`- **Sections (${page.sections.length}):**`)
          for (const sec of page.sections) {
            lines.push(`  - ${sec.name}${sec.description ? ` — ${sec.description}` : ''}`)
          }
        }
        lines.push('')
      }
    }
  }
  return lines.join('\n')
}

// ── Export: RBAC Matrix ───────────────────────────────────────────────────────

export function exportRBACMatrix(apps: SitemapBuilderApp[]): string {
  // Collect all unique roles
  const allRoles = new Set<string>()
  for (const app of apps) appRoles(app.kind).forEach((r) => allRoles.add(r))
  // Always include base roles
  ;['guest', 'user', 'manager', 'admin', 'super_admin'].forEach((r) => allRoles.add(r))
  const roles = [...allRoles]

  const lines: string[] = ['# RBAC Matrix', '']

  // Header
  lines.push(`| Page | ${roles.join(' | ')} |`)
  lines.push(`|------|${roles.map(() => '-----').join('|')}|`)

  for (const app of apps) {
    const appAllowedRoles = new Set(appRoles(app.kind))
    const prefix = appUrlPrefix(app.kind)
    for (const menu of app.navMenus) {
      const flat = flattenPages(menu.pages, prefix)
      for (const { page, path } of flat) {
        const cells = roles.map((r) => appAllowedRoles.has(r) ? '✅' : '—')
        lines.push(`| \`${path}\` | ${cells.join(' | ')} |`)
      }
    }
  }

  lines.push('')
  lines.push('## Roles')
  lines.push('| Role | Description |')
  lines.push('|------|-------------|')
  lines.push('| guest | Unauthenticated visitor |')
  lines.push('| user | Authenticated standard user |')
  lines.push('| manager | Team manager with elevated access |')
  lines.push('| admin | Platform administrator |')
  lines.push('| super_admin | Super administrator, full access |')
  lines.push('| service | Machine-to-machine API client |')

  return lines.join('\n')
}

// ── Export: Roles & Permissions ───────────────────────────────────────────────

export function exportRolesPermissions(apps: SitemapBuilderApp[]): string {
  const lines: string[] = ['# Roles & Permissions', '']

  const rolesMap: Record<string, string[]> = {}
  for (const app of apps) {
    const roles = appRoles(app.kind)
    const prefix = appUrlPrefix(app.kind)
    for (const menu of app.navMenus) {
      const flat = flattenPages(menu.pages, prefix)
      for (const { path } of flat) {
        for (const role of roles) {
          if (!rolesMap[role]) rolesMap[role] = []
          rolesMap[role].push(path)
        }
      }
    }
  }

  for (const [role, paths] of Object.entries(rolesMap)) {
    lines.push(`## ${role}`)
    for (const p of [...new Set(paths)]) lines.push(`- ${p}`)
    lines.push('')
  }

  return lines.join('\n')
}

// ── Export: Next.js Router (App Router) ──────────────────────────────────────

export function exportNextRouter(apps: SitemapBuilderApp[]): string {
  const lines: string[] = [
    '# Next.js App Router Structure',
    '> Generated route segments for Next.js 15 App Router',
    '',
    '```',
    'app/',
  ]

  for (const app of apps) {
    const prefix = appUrlPrefix(app.kind)
    lines.push(`  # ${app.name}`)
    for (const menu of app.navMenus) {
      if (menu.pages.length === 0) continue

      function renderNextPages(pages: SitemapBuilderPage[], indent: string, parentPath: string) {
        for (const page of pages) {
          const seg = slugify(page.name)
          const path = parentPath ? `${parentPath}/${seg}` : seg
          lines.push(`${indent}${seg}/`)
          lines.push(`${indent}  page.tsx`)
          if (page.sections.length > 0) {
            lines.push(`${indent}  _sections/`)
            for (const sec of page.sections) {
              lines.push(`${indent}    ${slugify(sec.name)}.tsx`)
            }
          }
          if (page.subPages?.length) {
            renderNextPages(page.subPages, indent + '  ', path)
          }
        }
      }

      const startPath = prefix ? prefix.replace(/^\//, '') : ''
      if (startPath) {
        lines.push(`  (${slugify(app.name)})/`)
        lines.push(`    layout.tsx`)
        renderNextPages(menu.pages, '    ', startPath)
      } else {
        renderNextPages(menu.pages, '  ', '')
      }
    }
  }

  lines.push('```')
  lines.push('')
  lines.push('## Route Groups')
  for (const app of apps) {
    const prefix = appUrlPrefix(app.kind)
    if (!prefix) continue
    lines.push(`- \`(${slugify(app.name)})\` → ${prefix}/* — ${app.name}`)
  }

  return lines.join('\n')
}

// ── Export: Routes list ───────────────────────────────────────────────────────

export function exportRoutes(apps: SitemapBuilderApp[]): string {
  const lines: string[] = ['# Routes', '']

  let count = 0
  const rows: string[] = []
  for (const app of apps) {
    const prefix = appUrlPrefix(app.kind)
    for (const menu of app.navMenus) {
      const flat = flattenPages(menu.pages, prefix)
      for (const { page, path } of flat) {
        count++
        rows.push(`${count}. \`${path}\` — **${page.name}** (${app.name} / ${menu.name})${page.status ? ` [${page.status}]` : ''}`)
      }
    }
  }

  lines.push(`Total: ${count} routes`, '')
  lines.push(...rows)
  return lines.join('\n')
}

// ── Export: Services List ─────────────────────────────────────────────────────

export function exportServicesList(
  apps: SitemapBuilderApp[],
  services: SitemapBuilderService[],
): string {
  const lines: string[] = ['# Services', '']

  if (services.length === 0) {
    lines.push('No services defined yet. Add services in the canvas panel.')
    return lines.join('\n')
  }

  // Build page lookup
  const pageMap: Record<string, string> = {}
  for (const app of apps) {
    const prefix = appUrlPrefix(app.kind)
    for (const menu of app.navMenus) {
      const flat = flattenPages(menu.pages, prefix)
      for (const { page, path } of flat) pageMap[page.id] = path
    }
  }

  for (const sv of services) {
    lines.push(`## ${sv.name} (${sv.kind})`)
    if (sv.description) lines.push(sv.description)
    if (sv.endpoint) lines.push(`- **Endpoint:** \`${sv.endpoint}\``)
    if (sv.notes) lines.push(`- **Notes:** ${sv.notes}`)
    if (sv.connectedPageIds.length > 0) {
      lines.push(`- **Connected to:**`)
      for (const pid of sv.connectedPageIds) {
        lines.push(`  - \`${pageMap[pid] ?? pid}\``)
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

// ── Export: Mermaid Diagram ───────────────────────────────────────────────────

export function exportMermaid(apps: SitemapBuilderApp[]): string {
  const lines: string[] = ['```mermaid', 'flowchart TD']
  const ids: Record<string, string> = {}
  let counter = 0
  function nodeId(name: string): string {
    if (!ids[name]) ids[name] = `N${counter++}`
    return ids[name]
  }

  for (const app of apps) {
    const appId = nodeId(`app-${app.id}`)
    lines.push(`  ${appId}["📦 ${app.name}"]`)
    lines.push(`  style ${appId} fill:#1e293b,stroke:#475569,color:#e2e8f0`)

    for (const menu of app.navMenus) {
      const menuId = nodeId(`menu-${menu.id}`)
      lines.push(`  ${menuId}["🗂 ${menu.name}"]`)
      lines.push(`  ${appId} --> ${menuId}`)

      function renderMenuPages(pages: SitemapBuilderPage[], parentId: string, depth: number) {
        for (const page of pages) {
          const pgId = nodeId(`pg-${page.id}`)
          const label = page.subPages?.length ? `📁 ${page.name}` : `📄 ${page.name}`
          lines.push(`  ${pgId}["${label}"]`)
          lines.push(`  ${parentId} --> ${pgId}`)
          if (depth === 0) {
            lines.push(`  style ${pgId} fill:#0f172a,stroke:#334155,color:#94a3b8`)
          }
          if (page.subPages?.length) {
            renderMenuPages(page.subPages, pgId, depth + 1)
          }
        }
      }

      renderMenuPages(menu.pages, menuId, 0)
    }
  }

  lines.push('```')
  return lines.join('\n')
}

// ── Export: Full Context ──────────────────────────────────────────────────────

export function exportFullContext(
  apps: SitemapBuilderApp[],
  services: SitemapBuilderService[],
): string {
  const parts = [
    exportURLStructure(apps),
    '---',
    exportNextRouter(apps),
    '---',
    exportRBACMatrix(apps),
    '---',
    exportNavMenus(apps),
    '---',
    exportServicesList(apps, services),
    '---',
    exportMermaid(apps),
    '---',
    exportFolderStructure(apps),
  ]
  return [
    '# NEZAM — Full Sitemap Context',
    `> Generated: ${new Date().toLocaleString()}`,
    '',
    ...parts,
  ].join('\n')
}

// ── Export format registry ────────────────────────────────────────────────────

export type ExportFormat =
  | 'json'
  | 'folder'
  | 'url'
  | 'nav-menus'
  | 'app-pages'
  | 'rbac'
  | 'roles'
  | 'router'
  | 'routes'
  | 'services'
  | 'mermaid'
  | 'context'

export interface ExportOption {
  id: ExportFormat
  label: string
  description: string
  ext: string
  mime: string
}

export const EXPORT_OPTIONS: ExportOption[] = [
  { id: 'json',      label: 'JSON',             description: 'Full sitemap data (schema v3)',            ext: 'json',    mime: 'application/json' },
  { id: 'folder',    label: 'Folder Structure', description: 'File/folder tree for your codebase',       ext: 'md',      mime: 'text/markdown' },
  { id: 'url',       label: 'URL Structure',    description: 'All URLs with status and sections',        ext: 'md',      mime: 'text/markdown' },
  { id: 'nav-menus', label: 'Nav Menus',        description: 'Navigation structure in markdown',         ext: 'md',      mime: 'text/markdown' },
  { id: 'app-pages', label: 'App Pages',        description: 'Detailed page list per app',               ext: 'md',      mime: 'text/markdown' },
  { id: 'rbac',      label: 'RBAC Matrix',      description: 'Role × Page access matrix',               ext: 'md',      mime: 'text/markdown' },
  { id: 'roles',     label: 'Roles & Perms',    description: 'Permissions grouped by role',             ext: 'md',      mime: 'text/markdown' },
  { id: 'router',    label: 'Next.js Router',   description: 'App Router segments for Next.js 15',      ext: 'md',      mime: 'text/markdown' },
  { id: 'routes',    label: 'Routes List',      description: 'Flat numbered routes list',               ext: 'md',      mime: 'text/markdown' },
  { id: 'services',  label: 'Services List',    description: 'Backend services and connections',        ext: 'md',      mime: 'text/markdown' },
  { id: 'mermaid',   label: 'Mermaid Diagram',  description: 'Sitemap as a Mermaid flowchart',          ext: 'md',      mime: 'text/markdown' },
  { id: 'context',   label: 'Full Context',     description: 'Everything combined for AI/handoff',      ext: 'md',      mime: 'text/markdown' },
]

export function generateExport(
  format: ExportFormat,
  apps: SitemapBuilderApp[],
  services: SitemapBuilderService[],
): string {
  switch (format) {
    case 'json':      return exportFullJSON(apps, services)
    case 'folder':    return exportFolderStructure(apps)
    case 'url':       return exportURLStructure(apps)
    case 'nav-menus': return exportNavMenus(apps)
    case 'app-pages': return exportAppPages(apps)
    case 'rbac':      return exportRBACMatrix(apps)
    case 'roles':     return exportRolesPermissions(apps)
    case 'router':    return exportNextRouter(apps)
    case 'routes':    return exportRoutes(apps)
    case 'services':  return exportServicesList(apps, services)
    case 'mermaid':   return exportMermaid(apps)
    case 'context':   return exportFullContext(apps, services)
  }
}
