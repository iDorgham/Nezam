'use client'

import {
  MousePointer2,
  Hand,
  Sparkles,
  MessageCircle,
  Type,
  Pilcrow,
  Image as ImageIcon,
  Shapes,
  SquareStack,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { Tooltip } from '@/components/ui/Tooltip'
import type { Tool } from '@/types'
import { cn } from '@/lib/cn'

interface ToolDef {
  id: Tool
  label: string
  kbd: string
  icon: typeof MousePointer2
  hint: string
}

const NAV_TOOLS: ToolDef[] = [
  { id: 'select', label: 'Select', kbd: 'V', icon: MousePointer2, hint: 'Click any element to edit it' },
  { id: 'hand', label: 'Hand', kbd: 'H', icon: Hand, hint: 'Drag to pan the canvas' },
  { id: 'ai', label: 'AI Adjust', kbd: 'A', icon: Sparkles, hint: 'Select a part, then prompt the AI' },
  { id: 'comment', label: 'Comment', kbd: 'M', icon: MessageCircle, hint: 'Drop a comment for AI agents' },
]

const INSERT_TOOLS: ToolDef[] = [
  { id: 'text', label: 'Add Heading', kbd: 'T', icon: Type, hint: 'Click the canvas to drop a heading' },
  { id: 'paragraph', label: 'Add Paragraph', kbd: 'P', icon: Pilcrow, hint: 'Click the canvas to drop a paragraph' },
  { id: 'image', label: 'Add Image', kbd: 'I', icon: ImageIcon, hint: 'Click the canvas to drop an image' },
  { id: 'icon', label: 'Add Icon', kbd: 'C', icon: Shapes, hint: 'Click the canvas to drop an icon' },
  { id: 'section', label: 'Add Section', kbd: 'S', icon: SquareStack, hint: 'Click the canvas to drop a section' },
]

/** Photoshop-style vertical tool rail on the workspace's leading edge. */
export function LeftToolbar() {
  const activeTool = useHub((s) => s.activeTool)
  const setTool = useHub((s) => s.setTool)

  const ToolButton = ({ tool }: { tool: ToolDef }) => {
    const Icon = tool.icon
    const active = tool.id === activeTool
    const isAi = tool.id === 'ai'
    return (
      <Tooltip
        side="right"
        kbd={tool.kbd}
        label={
          <span className="flex flex-col">
            <span className="font-semibold">{tool.label}</span>
            <span className="text-app-subtle">{tool.hint}</span>
          </span>
        }
      >
        <button
          onClick={() => setTool(tool.id)}
          aria-label={tool.label}
          aria-pressed={active}
          className={cn(
            'focus-ring relative grid h-10 w-10 place-items-center rounded-app-sm transition-all duration-150 ease-smooth active:scale-90',
            active
              ? isAi
                ? 'bg-gradient-to-br from-app-accent to-[#1473e6] text-app-on-accent shadow-app-glow'
                : 'bg-app-elevated text-app-text shadow-app-sm'
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
  }

  return (
    <div className="flex h-full w-14 flex-col items-center gap-1 border-r border-app-border bg-app-inset py-3">
      {NAV_TOOLS.map((t) => (
        <ToolButton key={t.id} tool={t} />
      ))}

      <div className="my-1.5 h-px w-7 bg-app-border" />

      {INSERT_TOOLS.map((t) => (
        <ToolButton key={t.id} tool={t} />
      ))}

      <div className="flex-1" />

      <span className="rounded-app-sm bg-app-surface px-1.5 py-1 text-center font-mono text-[8px] uppercase tracking-wide text-app-subtle">
        {activeTool}
      </span>
    </div>
  )
}
