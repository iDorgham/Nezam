'use client'

import { useState } from 'react'
import {
  GitBranch,
  SwatchBook,
  LayoutDashboard,
  // Structure sub-nav
  FileStack,
  Menu,
  Server,
  Network,
  Link2,
  // Design System sub-nav
  Palette,
  Type,
  Ruler,
  BoxSelect,
  Zap,
  SlidersHorizontal,
  Shapes,
  Square,
  LayoutGrid,
  Layers2,
  ImageIcon,
  // Builder sub-nav
  LayoutTemplate,
  Rows3,
  Wand2,
  // Tools (moved from LeftToolbar)
  MousePointer2,
  Hand,
  Sparkles,
  MessageCircle,
  Pilcrow,
  Image,
  CircleDot,
  SquareStack,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/cn'
import type { BuilderMode, DesignHubMode, Tool } from '@/types'

/* ── Mode definitions ─────────────────────────────────────────── */

const MODES = [
  { id: 'STRUCTURE'    as DesignHubMode, icon: GitBranch,      label: 'Structure',     hint: 'Pages, menus & services'     },
  { id: 'DESIGN_SYSTEM' as DesignHubMode, icon: SwatchBook,   label: 'Design System', hint: 'Tokens, typography & components' },
  { id: 'BUILDER'      as DesignHubMode, icon: LayoutDashboard, label: 'Builder',     hint: 'Compose & preview pages'     },
]

/* ── Sub-nav items per mode ───────────────────────────────────── */

interface NavSection {
  label: string
  items: { id: string; label: string; icon: React.ElementType }[]
}

const STRUCTURE_NAV: NavSection[] = [
  {
    label: 'Information Architecture',
    items: [
      { id: 'pages',    label: 'Pages & Routes',    icon: FileStack },
      { id: 'menus',    label: 'Navigation Menus',  icon: Menu      },
      { id: 'services', label: 'Backend Services',  icon: Server    },
      { id: 'sitemap',  label: 'Sitemap',           icon: Network   },
      { id: 'urls',     label: 'URL & SEO Preview', icon: Link2     },
    ],
  },
]

const DESIGN_SYSTEM_NAV: NavSection[] = [
  {
    label: 'Core Tokens',
    items: [
      { id: 'colors',     label: 'Colors',        icon: Palette          },
      { id: 'typography', label: 'Typography',    icon: Type             },
      { id: 'spacing',    label: 'Spacing',       icon: Ruler            },
      { id: 'shape',      label: 'Shape & Depth', icon: BoxSelect        },
      { id: 'motion',     label: 'Motion',        icon: Zap              },
      { id: 'opacity',    label: 'Opacity',       icon: SlidersHorizontal },
    ],
  },
  {
    label: 'Components & Patterns',
    items: [
      { id: 'buttons',    label: 'Buttons & Inputs',      icon: Shapes    },
      { id: 'navigation', label: 'Navigation Primitives', icon: LayoutGrid },
      { id: 'cards',      label: 'Cards & Data Display',  icon: Square    },
      { id: 'overlays',   label: 'Overlays & Modals',     icon: Layers2   },
      { id: 'icons',      label: 'Icons & Patterns',      icon: ImageIcon },
    ],
  },
]

const BUILDER_NAV: NavSection[] = [
  {
    label: 'Content',
    items: [
      { id: 'layout-blocks', label: 'Layout Blocks',   icon: LayoutTemplate },
      { id: 'templates',     label: 'Page Templates',  icon: Rows3          },
      { id: 'themes',        label: 'Theme Variants',  icon: Wand2          },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'tool-select',    label: 'Select',       icon: MousePointer2 },
      { id: 'tool-hand',      label: 'Hand',         icon: Hand          },
      { id: 'tool-ai',        label: 'AI Adjust',    icon: Sparkles      },
      { id: 'tool-comment',   label: 'Comment',      icon: MessageCircle },
      { id: 'tool-text',      label: 'Add Heading',  icon: Type          },
      { id: 'tool-paragraph', label: 'Paragraph',    icon: Pilcrow       },
      { id: 'tool-image',     label: 'Add Image',    icon: Image         },
      { id: 'tool-icon',      label: 'Add Icon',     icon: CircleDot     },
      { id: 'tool-section',   label: 'Add Section',  icon: SquareStack   },
    ],
  },
]

const NAV_BY_MODE: Record<DesignHubMode, NavSection[]> = {
  STRUCTURE:    STRUCTURE_NAV,
  DESIGN_SYSTEM: DESIGN_SYSTEM_NAV,
  BUILDER:      BUILDER_NAV,
}

/* ── Tool mapping for builder tools ──────────────────────────── */

const TOOL_MAP: Record<string, Tool> = {
  'tool-select':    'select',
  'tool-hand':      'hand',
  'tool-ai':        'ai',
  'tool-comment':   'comment',
  'tool-text':      'text',
  'tool-paragraph': 'paragraph',
  'tool-image':     'image',
  'tool-icon':      'icon',
  'tool-section':   'section',
}

/* ── Sub-nav panel ────────────────────────────────────────────── */

/** BUILDER Content items → builderMode */
const BUILDER_CONTENT_MAP: Record<string, BuilderMode> = {
  'layout-blocks': 'layers',
  'templates':     'profiles',
  'themes':        'theme',
}

function SubNavPanel({ hubMode }: { hubMode: DesignHubMode }) {
  const activeTool        = useHub((s) => s.activeTool)
  const setTool           = useHub((s) => s.setTool)
  const setBuilderMode    = useHub((s) => s.setBuilderMode)
  const setStructureSection = useHub((s) => s.setStructureSection)
  const [activeItem, setActiveItem] = useState<string>('')

  const sections = NAV_BY_MODE[hubMode]

  const handleItem = (id: string) => {
    setActiveItem(id)

    // BUILDER tools (keyboard shortcuts shown in tooltips)
    const tool = TOOL_MAP[id]
    if (tool) { setTool(tool); return }

    // BUILDER content items → switch right panel
    if (hubMode === 'BUILDER') {
      const bm = BUILDER_CONTENT_MAP[id]
      if (bm) { setBuilderMode(bm); return }
    }

    // STRUCTURE sub-nav → filter the StructureViewport
    if (hubMode === 'STRUCTURE') {
      setStructureSection(id)
      return
    }
  }

  const isItemActive = (id: string) => {
    const tool = TOOL_MAP[id]
    return tool ? tool === activeTool : id === activeItem
  }

  return (
    <div className="app-scroll flex h-full w-48 shrink-0 flex-col overflow-y-auto border-r border-app-border bg-app-surface py-3">
      {sections.map((section) => (
        <div key={section.label} className="mb-3">
          <p className="mb-1 px-3 text-[9px] font-bold uppercase tracking-widest text-app-subtle">
            {section.label}
          </p>
          {section.items.map((item) => {
            const Icon   = item.icon
            const active = isItemActive(item.id)
            return (
              <button
                key={item.id}
                onClick={() => handleItem(item.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[12px] font-medium transition-colors duration-100',
                  active
                    ? 'bg-app-elevated text-app-text'
                    : 'text-app-subtle hover:bg-app-elevated/60 hover:text-app-muted',
                )}
              >
                <Icon size={13} className="shrink-0" />
                {item.label}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* ── Mode rail ────────────────────────────────────────────────── */

function ModeRail({ hubMode, setHubMode }: { hubMode: DesignHubMode; setHubMode: (m: DesignHubMode) => void }) {
  return (
    <div className="flex h-full w-12 shrink-0 flex-col items-center gap-1 border-r border-app-border bg-app-inset py-3">
      {MODES.map((mode) => {
        const Icon   = mode.icon
        const active = mode.id === hubMode
        return (
          <Tooltip key={mode.id} label={<span className="flex flex-col"><span className="font-semibold">{mode.label}</span><span className="text-app-subtle">{mode.hint}</span></span>} side="right">
            <button
              onClick={() => setHubMode(mode.id)}
              aria-pressed={active}
              aria-label={mode.label}
              className={cn(
                'focus-ring relative grid h-9 w-9 place-items-center rounded-app-sm transition-all duration-150 ease-smooth active:scale-90',
                active
                  ? 'bg-app-elevated text-app-text shadow-app-sm'
                  : 'text-app-subtle hover:bg-app-elevated/70 hover:text-app-text',
              )}
            >
              <Icon size={17} />
              {active && (
                <span className="absolute -left-[7px] top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-app-accent" />
              )}
            </button>
          </Tooltip>
        )
      })}
    </div>
  )
}

/* ── Public component ─────────────────────────────────────────── */

/**
 * Left sidebar: 3 top-level mode icons + mode-specific sub-navigation.
 * Sub-nav is hidden in DESIGN_SYSTEM mode — navigation there is via the
 * right panel's 5-tab strip.
 */
export function ModeSwitcher() {
  const hubMode    = useHub((s) => s.hubMode)
  const setHubMode = useHub((s) => s.setHubMode)

  return (
    <div className="flex h-full shrink-0">
      <ModeRail hubMode={hubMode} setHubMode={setHubMode} />
      {hubMode !== 'DESIGN_SYSTEM' && <SubNavPanel hubMode={hubMode} />}
    </div>
  )
}
