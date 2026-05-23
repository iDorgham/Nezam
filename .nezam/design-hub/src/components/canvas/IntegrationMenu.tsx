'use client'

import { Database, ShieldCheck, Zap, Globe, Sparkles, Plus, X } from 'lucide-react'
import { useCanvasGraph } from '@/store/canvas-graph.store'
import type { NodeType } from '@/store/canvas-graph.store'

interface IntegrationDef {
  type: NodeType
  label: string
  description: string
  color: string
  icon: typeof Database
}

const INTEGRATIONS: IntegrationDef[] = [
  { type: 'neon',         label: 'Neon DB',      description: 'Serverless Postgres',  color: '#3b82f6', icon: Database    },
  { type: 'better-auth', label: 'Better Auth',   description: 'Full-stack auth',      color: '#a78bfa', icon: ShieldCheck },
  { type: 'redis',        label: 'Redis',         description: 'In-memory cache',      color: 'var(--app-danger)', icon: Zap },
  { type: 'cf-workers',  label: 'CF Workers',    description: 'Edge compute',          color: '#f97316', icon: Globe       },
  { type: 'gemini',       label: 'Gemini LLM',   description: 'AI inference layer',   color: 'var(--app-success)', icon: Sparkles },
]

/**
 * Right-click context menu for the infinite canvas.
 * Spawns a new node at the world position where the menu was opened.
 * Positioned in screen space (position: fixed) so it sits above the camera transform.
 */
export function IntegrationMenu() {
  const contextMenu = useCanvasGraph((s) => s.contextMenu)
  const closeContextMenu = useCanvasGraph((s) => s.closeContextMenu)
  const addNode = useCanvasGraph((s) => s.addNode)
  const selectNode = useCanvasGraph((s) => s.selectNode)

  if (!contextMenu) return null

  const handleAdd = (type: NodeType, label: string) => {
    const id = addNode({
      type,
      label,
      x: contextMenu.worldX,
      y: contextMenu.worldY,
      width: 180,
      height: 80,
    })
    selectNode(id)
    closeContextMenu()
  }

  return (
    <>
      {/* Invisible backdrop captures any click to close */}
      <div className="fixed inset-0 z-50" onPointerDown={closeContextMenu} />

      <div
        className="fixed z-50 w-52 overflow-hidden rounded-[6px] border border-app-border bg-app-elevated shadow-app-lg"
        style={{
          left: contextMenu.screenX,
          top: contextMenu.screenY,
          animationName: 'context-menu-in',
          animationDuration: '0.13s',
          animationTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
          animationFillMode: 'both',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-app-border px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-app-subtle">
            Add Node
          </span>
          <button
            className="grid h-5 w-5 place-items-center rounded text-app-subtle hover:bg-app-surface hover:text-app-text active:scale-90 transition-all"
            onClick={closeContextMenu}
            aria-label="Close menu"
          >
            <X size={11} />
          </button>
        </div>

        {/* Page node option */}
        <div className="border-b border-app-border p-1">
          <button
            className="flex w-full items-center gap-2.5 rounded px-2 py-2 text-start transition-colors duration-100 hover:bg-app-surface"
            onClick={() => handleAdd('page', 'New Page')}
          >
            <div
              className="grid h-7 w-7 shrink-0 place-items-center rounded"
              style={{
                background: 'color-mix(in srgb, var(--app-accent) 15%, transparent)',
                color: 'var(--app-accent)',
              }}
            >
              <Plus size={13} />
            </div>
            <div>
              <p className="text-[12px] font-medium text-app-text">New Page</p>
              <p className="text-[10px] text-app-subtle">Blank page node</p>
            </div>
          </button>
        </div>

        {/* Services */}
        <div className="p-1">
          <p className="px-2 pb-1 pt-0.5 text-[9px] font-semibold uppercase tracking-widest text-app-subtle">
            Services
          </p>
          {INTEGRATIONS.map(({ type, label, description, color, icon: Icon }) => (
            <button
              key={type}
              className="flex w-full items-center gap-2.5 rounded px-2 py-2 text-start transition-colors duration-100 hover:bg-app-surface"
              onClick={() => handleAdd(type, label)}
            >
              <div
                className="grid h-7 w-7 shrink-0 place-items-center rounded"
                style={{
                  background: `color-mix(in srgb, ${color} 15%, transparent)`,
                  color,
                }}
              >
                <Icon size={13} />
              </div>
              <div>
                <p className="text-[12px] font-medium text-app-text">{label}</p>
                <p className="text-[10px] text-app-subtle">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
