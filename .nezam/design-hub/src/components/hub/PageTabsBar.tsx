'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, Edit2, Copy, Trash2 } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/cn'
import type { PageTab } from '@/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function PageTabsBar() {
  const pages = useHub((s) => s.pages)
  const activePageId = useHub((s) => s.activePageId)
  const setActivePage = useHub((s) => s.setActivePage)
  const addPage = useHub((s) => s.addPage)
  const closePage = useHub((s) => s.closePage)
  const closeOtherPages = useHub((s) => s.closeOtherPages)
  const renamePage = useHub((s) => s.renamePage)
  const duplicatePage = useHub((s) => s.duplicatePage)
  const reorderPages = useHub((s) => s.reorderPages)

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{
    pageId: string
    x: number
    y: number
  } | null>(null)

  // Renaming state
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Don't trigger drag on simple clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id)
      const newIndex = pages.findIndex((p) => p.id === over.id)
      reorderPages(arrayMove(pages, oldIndex, newIndex))
    }
  }

  // Handle outside click to close context menu
  useEffect(() => {
    const handleOutsideClick = () => {
      setContextMenu(null)
    }
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [])

  // Auto focus rename input
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [renamingId])

  const startRename = (id: string, name: string) => {
    setRenamingId(id)
    setRenameValue(name)
  }

  const finishRename = () => {
    if (renamingId) {
      renamePage(renamingId, renameValue)
      setRenamingId(null)
    }
  }

  return (
    <div className="relative flex h-10 w-full shrink-0 items-center justify-between border-b border-app-border bg-app-inset px-4 select-none">
      {/* Tabs container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={pages.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex min-w-0 flex-1 items-end gap-1.5 overflow-x-auto scrollbar-none pt-2 pr-4">
            {pages.map((page) => (
              <SortableTab
                key={page.id}
                page={page}
                active={page.id === activePageId}
                renaming={renamingId === page.id}
                renameValue={renameValue}
                setRenameValue={setRenameValue}
                renameInputRef={renameInputRef}
                onRenameBlur={finishRename}
                onRenameKeyDown={(e) => {
                  if (e.key === 'Enter') finishRename()
                  if (e.key === 'Escape') setRenamingId(null)
                }}
                onClick={() => setActivePage(page.id)}
                onClose={(e) => {
                  e.stopPropagation()
                  closePage(page.id)
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setContextMenu({
                    pageId: page.id,
                    x: e.clientX,
                    y: e.clientY,
                  })
                }}
              />
            ))}

            {/* Plus add page button */}
            <button
              onClick={() => addPage()}
              className="focus-ring flex h-6 w-6 mb-1 shrink-0 items-center justify-center rounded-md text-app-subtle hover:bg-app-elevated hover:text-app-text transition-all duration-150 active:scale-90"
              title="Add new page"
            >
              <Plus size={14} />
            </button>
          </div>
        </SortableContext>
      </DndContext>

      {/* Floating custom right-click context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[150px] overflow-hidden rounded-app border border-app-border bg-app-surface/95 p-1 shadow-app-lg backdrop-blur animate-in fade-in zoom-in-95 duration-100 ease-out"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <ContextMenuItem
            icon={<Edit2 size={12} />}
            label="Rename"
            onClick={() => {
              const p = pages.find((page) => page.id === contextMenu.pageId)
              if (p) startRename(p.id, p.name)
              setContextMenu(null)
            }}
          />
          <ContextMenuItem
            icon={<Copy size={12} />}
            label="Duplicate"
            onClick={() => {
              duplicatePage(contextMenu.pageId)
              setContextMenu(null)
            }}
          />
          <div className="my-1 border-t border-app-border" />
          <ContextMenuItem
            icon={<X size={12} />}
            label="Close"
            disabled={pages.length <= 1}
            onClick={() => {
              closePage(contextMenu.pageId)
              setContextMenu(null)
            }}
          />
          <ContextMenuItem
            icon={<Trash2 size={12} />}
            label="Close Others"
            disabled={pages.length <= 1}
            onClick={() => {
              closeOtherPages(contextMenu.pageId)
              setContextMenu(null)
            }}
          />
        </div>
      )}
    </div>
  )
}

interface SortableTabProps {
  page: PageTab
  active: boolean
  renaming: boolean
  renameValue: string
  setRenameValue: (val: string) => void
  renameInputRef: React.RefObject<HTMLInputElement | null>
  onRenameBlur: () => void
  onRenameKeyDown: (e: React.KeyboardEvent) => void
  onClick: () => void
  onClose: (e: React.MouseEvent) => void
  onContextMenu: (e: React.MouseEvent) => void
}

function SortableTab({
  page,
  active,
  renaming,
  renameValue,
  setRenameValue,
  renameInputRef,
  onRenameBlur,
  onRenameKeyDown,
  onClick,
  onClose,
  onContextMenu,
}: SortableTabProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page.id,
    disabled: renaming, // Disable drag when typing rename
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 40 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onContextMenu={onContextMenu}
      onClick={onClick}
      {...attributes}
      {...listeners}
      className={cn(
        'group relative flex h-7 items-center gap-2 rounded-t-app px-3 text-xs transition-all duration-150 cursor-default outline-none select-none shrink-0 border-t border-x',
        active
          ? 'bg-app-surface text-app-text border-app-border font-semibold shadow-sm'
          : 'text-app-muted border-transparent hover:text-app-text hover:bg-app-surface/40'
      )}
    >
      {/* Active Indicator bar */}
      {active && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-app-accent rounded-t-full animate-pulse" />
      )}

      {/* Renaming Input vs Label Text */}
      {renaming ? (
        <input
          ref={renameInputRef}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onBlur={onRenameBlur}
          onKeyDown={onRenameKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="w-20 bg-app-inset border border-app-accent rounded px-1 py-0.5 text-[11px] text-app-text focus:outline-none focus:ring-1 focus:ring-app-accent font-normal"
        />
      ) : (
        <span className="truncate max-w-[100px]">{page.name}</span>
      )}

      {/* Unsaved indicator dot */}
      {page.isUnsaved && !renaming && (
        <span className="h-1.5 w-1.5 rounded-full bg-app-accent shrink-0 animate-ping" />
      )}

      {/* Close tab button */}
      <button
        onClick={onClose}
        disabled={renaming}
        className={cn(
          'focus-ring flex h-3.5 w-3.5 items-center justify-center rounded-full text-app-subtle hover:bg-app-elevated hover:text-app-text transition-colors duration-150',
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        <X size={10} />
      </button>
    </div>
  )
}

function ContextMenuItem({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-app-text transition-colors duration-100',
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'hover:bg-app-elevated/80 active:scale-[0.98]'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
