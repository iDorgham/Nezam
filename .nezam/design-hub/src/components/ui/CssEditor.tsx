'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CssEditorProps {
  value: Record<string, string>
  onChange: (next: Record<string, string>) => void
}

/** Raw CSS key/value escape hatch — overrides curated controls. */
export function CssEditor({ value, onChange }: CssEditorProps) {
  const entries = Object.entries(value ?? {})
  const [newKey, setNewKey] = useState('')
  const [newVal, setNewVal] = useState('')

  const set = (key: string, val: string) => {
    onChange({ ...value, [key]: val })
  }
  const removeKey = (key: string) => {
    const next = { ...value }
    delete next[key]
    onChange(next)
  }
  const addEntry = () => {
    const k = newKey.trim()
    const v = newVal.trim()
    if (!k) return
    set(k, v)
    setNewKey('')
    setNewVal('')
  }

  return (
    <div className="rounded-app-sm border border-app-border bg-app-inset/60 p-2 font-mono text-[11px]">
      {entries.length === 0 && (
        <div className="px-1 pb-1.5 text-[10px] italic text-app-subtle">
          No raw overrides. Add a property below.
        </div>
      )}
      <div className="space-y-1">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <input
              value={k}
              onChange={(e) => {
                const next = { ...value }
                delete next[k]
                next[e.target.value] = v
                onChange(next)
              }}
              className={cn(
                'focus-ring w-32 truncate rounded-sm border border-app-border bg-app-bg px-1.5 py-1 text-app-accent',
              )}
            />
            <span className="text-app-subtle">:</span>
            <input
              value={v}
              onChange={(e) => set(k, e.target.value)}
              className="focus-ring flex-1 rounded-sm border border-app-border bg-app-bg px-1.5 py-1 text-app-text"
            />
            <button
              onClick={() => removeKey(k)}
              aria-label={`Remove ${k}`}
              className="grid h-5 w-5 place-items-center rounded-sm text-app-subtle hover:bg-app-elevated hover:text-app-danger"
            >
              <X size={11} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 border-t border-app-border pt-2">
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="property"
          className="focus-ring w-32 rounded-sm border border-app-border bg-app-bg px-1.5 py-1 text-app-muted placeholder:text-app-subtle"
          onKeyDown={(e) => e.key === 'Enter' && addEntry()}
        />
        <span className="text-app-subtle">:</span>
        <input
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          placeholder="value"
          className="focus-ring flex-1 rounded-sm border border-app-border bg-app-bg px-1.5 py-1 text-app-muted placeholder:text-app-subtle"
          onKeyDown={(e) => e.key === 'Enter' && addEntry()}
        />
        <button
          onClick={addEntry}
          aria-label="Add property"
          className="focus-ring grid h-6 w-6 place-items-center rounded-sm border border-app-border text-app-muted hover:border-app-accent hover:text-app-accent"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  )
}
