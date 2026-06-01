'use client'

import { useEffect, useRef } from 'react'
import { LayoutTemplate, Pencil, Plus, Trash2 } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'

export type ArchCanvasMenuState =
  | { kind: 'page'; pageId: string; x: number; y: number }
  | { kind: 'canvas'; x: number; y: number }
  | null

type Props = {
  menu: ArchCanvasMenuState
  onClose: () => void
}

function MenuItem({
  icon: Icon,
  label,
  destructive,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  destructive?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'flex w-full items-center gap-2 rounded-app-sm px-2.5 py-2 text-left text-xs transition-colors',
        destructive
          ? 'text-app-danger hover:bg-app-danger/10'
          : 'text-app-text hover:bg-app-elevated',
      )}
      onClick={onClick}
    >
      <Icon size={14} className="shrink-0 opacity-80" />
      {label}
    </button>
  )
}

export function ArchCanvasContextMenu({ menu, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const pages = useHub((s) => s.arch.pages)
  const archAddPage = useHub((s) => s.archAddPage)
  const archDeletePage = useHub((s) => s.archDeletePage)
  const archSelectPage = useHub((s) => s.archSelectPage)
  const archUpdatePage = useHub((s) => s.archUpdatePage)
  const setSection = useHub((s) => s.setSection)

  useEffect(() => {
    if (!menu) return
    function onPointerDown(e: MouseEvent) {
      if (panelRef.current?.contains(e.target as Node)) return
      onClose()
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menu, onClose])

  if (!menu) return null

  const page = menu.kind === 'page' ? pages[menu.pageId] : null

  function run(action: () => void) {
    action()
    onClose()
  }

  const clampedX = Math.min(menu.x, typeof window !== 'undefined' ? window.innerWidth - 220 : menu.x)
  const clampedY = Math.min(menu.y, typeof window !== 'undefined' ? window.innerHeight - 280 : menu.y)

  return (
    <div
      ref={panelRef}
      role="menu"
      className="fixed z-[200] min-w-[200px] rounded-app border border-app-border bg-app-surface p-1 shadow-lg"
      style={{ left: clampedX, top: clampedY }}
    >
      {menu.kind === 'page' && page ? (
        <>
          <MenuItem
            icon={Plus}
            label="Add child page"
            onClick={() =>
              run(() => {
                archSelectPage(page.id)
                archAddPage(page.id)
              })
            }
          />
          <MenuItem
            icon={Pencil}
            label="Rename…"
            onClick={() =>
              run(() => {
                const next = window.prompt('Page name', page.name)
                if (next == null) return
                const trimmed = next.trim()
                if (trimmed) archUpdatePage(page.id, { name: trimmed })
              })
            }
          />
          <MenuItem
            icon={LayoutTemplate}
            label="Open in Wireframes"
            onClick={() =>
              run(() => {
                archSelectPage(page.id)
                setSection('wireframes')
              })
            }
          />
          <div className="my-1 h-px bg-app-border" />
          <MenuItem
            icon={Trash2}
            label="Delete page"
            destructive
            onClick={() =>
              run(() => {
                archDeletePage(page.id)
              })
            }
          />
        </>
      ) : (
        <>
          <MenuItem
            icon={Plus}
            label="Add application"
            onClick={() => run(() => archAddPage(null))}
          />
        </>
      )}
    </div>
  )
}
