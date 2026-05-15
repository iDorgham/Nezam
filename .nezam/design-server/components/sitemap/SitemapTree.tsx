'use client'

import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSessionStore, Page } from '@/lib/store/session.store'
import { GripVertical, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

export default function SitemapTree() {
  const { sitemap, setSitemap, setSelectedPageId, selectedPageId } = useSessionStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sitemap.findIndex((item) => item.id === active.id)
      const newIndex = sitemap.findIndex((item) => item.id === over.id)

      setSitemap(arrayMove(sitemap, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sitemap.map(p => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2">
          {sitemap.map((page) => (
            <SortableItem 
              key={page.id} 
              page={page} 
              isSelected={selectedPageId === page.id}
              onClick={() => setSelectedPageId(page.id)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

function SortableItem({ page, isSelected, onClick }: { page: Page, isSelected: boolean, onClick: () => void }) {
  const { sitemap, updatePage } = useSessionStore()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Calculate depth
  let depth = 0
  let currentParentId = page.parentId
  while (currentParentId) {
    depth++
    const parent = sitemap.find(p => p.id === currentParentId)
    currentParentId = parent?.parentId
  }

  const handleIndent = (e: React.MouseEvent) => {
    e.stopPropagation()
    const index = sitemap.findIndex(p => p.id === page.id)
    if (index > 0) {
      const prevPage = sitemap[index - 1]
      updatePage(page.id, { parentId: prevPage.id })
    }
  }

  const handleOutdent = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (page.parentId) {
      const parent = sitemap.find(p => p.id === page.parentId)
      updatePage(page.id, { parentId: parent?.parentId })
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={{ ...style, marginLeft: `${depth * 20}px` }}
      className={`flex items-center justify-between p-4 ${
        isSelected 
          ? 'bg-white/[0.06] border-[#5e6ad2] shadow-[0_0_15px_rgba(94,106,210,0.1)]' 
          : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
      } border rounded-xl transition-all duration-300 cursor-pointer backdrop-blur-sm group`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-white text-ds-text-muted transition-colors"
          onClick={(e) => e.stopPropagation()} // Prevent selection when dragging
        >
          <GripVertical size={16} />
        </button>
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#5e6ad2]/20 text-[#5e6ad2]' : 'bg-white/[0.03] text-ds-text-muted group-hover:text-white'} transition-colors`}>
          <FileText size={18} />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#8a8f98] group-hover:bg-clip-text transition-all duration-300">
            {page.title || 'Untitled'}
          </span>
          <span className="text-xs text-ds-text-muted font-mono mt-0.5">{page.route}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center bg-white/[0.03] rounded-lg border border-white/[0.05] p-0.5">
          <button
            onClick={handleOutdent}
            disabled={!page.parentId}
            className="p-1.5 rounded-md hover:bg-white/[0.05] text-ds-text-muted hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ds-text-muted transition-colors"
            title="Outdent"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleIndent}
            className="p-1.5 rounded-md hover:bg-white/[0.05] text-ds-text-muted hover:text-white transition-colors"
            title="Indent"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <span className="text-xs bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-full text-ds-text-muted font-medium uppercase tracking-wider text-[10px]">
          {page.type}
        </span>
      </div>
    </li>
  )
}
