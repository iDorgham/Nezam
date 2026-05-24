'use client'

import { useRef, useEffect } from 'react'
import { Plus, Trash2, StickyNote } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { NoteItem } from '@/types'

interface NotesEditorProps {
  notes: NoteItem[]
  onAdd: () => void
  onUpdate: (noteId: string, patch: Partial<Omit<NoteItem, 'id'>>) => void
  onDelete: (noteId: string) => void
}

/** Auto-resize textarea */
function AutoTextarea({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`
  }, [value])
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder={placeholder}
      rows={1}
      className="w-full resize-none bg-transparent text-[10px] text-app-muted outline-none placeholder:text-app-subtle/50 focus:text-app-text leading-relaxed"
    />
  )
}

export function NotesEditor({ notes, onAdd, onUpdate, onDelete }: NotesEditorProps) {
  if (notes.length === 0) {
    return (
      <div className="px-3 pb-2.5 pt-1">
        <button
          onClick={(e) => { e.stopPropagation(); onAdd() }}
          className="flex items-center gap-1 text-[9px] text-app-subtle/60 hover:text-app-accent transition-colors group"
        >
          <Plus size={9} className="group-hover:text-app-accent" />
          Note
        </button>
      </div>
    )
  }

  return (
    <div className="px-3 pb-2.5 pt-1 space-y-1.5">
      {notes.map((note) => (
        <div
          key={note.id}
          className="group relative rounded-lg border border-app-border/50 bg-app-inset/60 px-2.5 pt-2 pb-1.5"
        >
          {/* Title row */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <StickyNote size={8} className="shrink-0 text-amber-400/70" />
            <input
              value={note.title}
              onChange={(e) => onUpdate(note.id, { title: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="Note title"
              className="min-w-0 flex-1 bg-transparent text-[9px] font-semibold text-app-text outline-none placeholder:text-app-subtle/50"
            />
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(note.id) }}
              className={cn(
                'shrink-0 text-app-subtle hover:text-red-400 transition-colors',
                'opacity-0 group-hover:opacity-100',
              )}
            >
              <Trash2 size={9} />
            </button>
          </div>
          {/* Body */}
          <AutoTextarea
            value={note.body}
            onChange={(v) => onUpdate(note.id, { body: v })}
            placeholder="Add details…"
          />
        </div>
      ))}

      {/* Add another */}
      <button
        onClick={(e) => { e.stopPropagation(); onAdd() }}
        className="flex items-center gap-1 text-[9px] text-app-subtle/60 hover:text-app-accent transition-colors group"
      >
        <Plus size={9} className="group-hover:text-app-accent" />
        Note
      </button>
    </div>
  )
}
