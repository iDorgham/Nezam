'use client'

import { useState } from 'react'
import { Plus, X, Edit2, Link, Save } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { PanelBody, Section, ControlCard } from '@/components/ui/Panel'

export function MenusPanel() {
  const menus = useHub((s) => s.menus)
  const updateMenus = useHub((s) => s.updateMenus)

  // Header link editing states
  const [newHeaderLink, setNewHeaderLink] = useState('')
  const [editingHeaderIdx, setEditingHeaderIdx] = useState<number | null>(null)
  const [editingHeaderVal, setEditingHeaderVal] = useState('')

  const handleAddHeaderLink = () => {
    if (newHeaderLink.trim()) {
      const links = [...menus.headerLinks, newHeaderLink.trim()]
      updateMenus({ headerLinks: links })
      setNewHeaderLink('')
    }
  }

  const handleRemoveHeaderLink = (index: number) => {
    const links = menus.headerLinks.filter((_, idx) => idx !== index)
    updateMenus({ headerLinks: links })
  }

  const handleStartEditHeader = (index: number, val: string) => {
    setEditingHeaderIdx(index)
    setEditingHeaderVal(val)
  }

  const handleSaveEditHeader = (index: number) => {
    if (editingHeaderVal.trim()) {
      const links = [...menus.headerLinks]
      links[index] = editingHeaderVal.trim()
      updateMenus({ headerLinks: links })
    }
    setEditingHeaderIdx(null)
  }

  return (
    <PanelBody className="p-3">
      {/* Header Navigation Links */}
      <Section
        label="Header navigation"
        hint="Header links are displayed in the main Navigation bar component."
      >
        <ControlCard className="space-y-2">
          {menus.headerLinks.map((link, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 border border-app-border bg-app-inset/30 rounded-md px-2.5 py-1.5"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Link size={12} className="text-app-subtle shrink-0" />
                {editingHeaderIdx === idx ? (
                  <input
                    value={editingHeaderVal}
                    onChange={(e) => setEditingHeaderVal(e.target.value)}
                    onBlur={() => handleSaveEditHeader(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEditHeader(idx)
                      if (e.key === 'Escape') setEditingHeaderIdx(null)
                    }}
                    className="flex-1 bg-app-inset border border-app-accent rounded px-1 py-0.5 text-xs text-app-text focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="text-xs font-medium text-app-text truncate">{link}</span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {editingHeaderIdx !== idx ? (
                  <button
                    onClick={() => handleStartEditHeader(idx, link)}
                    className="focus-ring grid h-5 w-5 place-items-center rounded hover:bg-app-elevated text-app-subtle hover:text-app-text"
                  >
                    <Edit2 size={11} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSaveEditHeader(idx)}
                    className="focus-ring grid h-5 w-5 place-items-center rounded hover:bg-app-elevated text-app-accent"
                  >
                    <Save size={11} />
                  </button>
                )}
                <button
                  onClick={() => handleRemoveHeaderLink(idx)}
                  className="focus-ring grid h-5 w-5 place-items-center rounded hover:bg-app-elevated text-app-subtle hover:text-app-danger"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          ))}

          {/* Add input */}
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-app-border/40">
            <input
              placeholder="e.g. Blog, Contact"
              value={newHeaderLink}
              onChange={(e) => setNewHeaderLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddHeaderLink()}
              className="flex-1 bg-app-inset border border-app-border rounded-md px-2.5 py-1 text-xs text-app-text focus:outline-none focus:border-app-border-strong focus:ring-1 focus:ring-app-border-strong"
            />
            <button
              onClick={handleAddHeaderLink}
              className="focus-ring flex h-7 items-center justify-center rounded-md bg-app-elevated hover:bg-app-border/40 text-app-text px-2.5 text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </ControlCard>
      </Section>

      {/* Footer Navigation Columns Info */}
      <Section
        label="Footer columns"
        hint="Footer column links can be modified directly in the footer section element using the inspector panel."
      >
        <div className="space-y-2">
          {menus.footerColumns.map((col, cIdx) => (
            <ControlCard key={cIdx}>
              <div className="text-[10px] font-bold text-app-text uppercase tracking-wide border-b border-app-border/40 pb-1 mb-2">
                {col.title}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {col.links.map((link, lIdx) => (
                  <span
                    key={lIdx}
                    className="inline-flex items-center bg-app-inset border border-app-border rounded-full px-2 py-0.5 text-[10px] font-medium text-app-muted"
                  >
                    {link}
                  </span>
                ))}
              </div>
            </ControlCard>
          ))}
        </div>
      </Section>
    </PanelBody>
  )
}
