'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { MousePointer, Eye, Focus, Sparkles, AlertCircle } from 'lucide-react'

const CURSORS = [
  { key: 'interactive', label: 'Interactive (Buttons)', value: 'pointer', desc: 'Used for links and clickables' },
  { key: 'text', label: 'Text Insertion', value: 'text', desc: 'Used for text inputs and code blocks' },
  { key: 'disabled', label: 'Disabled Block', value: 'not-allowed', desc: 'Indicates non-actionable actions' },
  { key: 'drag', label: 'Draggable Node', value: 'grab', desc: 'Indicates floating panes or items' },
] as const

const FOCUS_STYLES = ['solid', 'dashed', 'dotted', 'double'] as const

export function CursorEditor() {
  const cursor = useHub((s) => s.design.tokens.cursor)
  const setToken = useHub((s) => s.designSetToken)
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <MousePointer className="h-5 w-5 text-app-accent" />
            Cursor & Focus Rings
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">
            Fine-tune pointer behaviors and keyboard outline focus rings to ensure seamless interactions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Focus Rings Section */}
        <div className="col-span-3 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
          <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
            <Focus className="h-4 w-4 text-app-accent" />
            Focus Ring Geometry
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Width</span>
              <input
                type="text"
                value={cursor.focusRingWidth}
                onChange={(e) => setToken('cursor.focusRingWidth', e.target.value)}
                className="h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono font-bold text-app-text focus:outline-none focus:border-app-accent"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Offset</span>
              <input
                type="text"
                value={cursor.focusRingOffset}
                onChange={(e) => setToken('cursor.focusRingOffset', e.target.value)}
                className="h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono font-bold text-app-text focus:outline-none focus:border-app-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Color & Tint</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cursor.focusRingColor}
                  onChange={(e) => setToken('cursor.focusRingColor', e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border border-app-border bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={cursor.focusRingColor}
                  onChange={(e) => setToken('cursor.focusRingColor', e.target.value)}
                  className="flex-1 h-8 rounded-lg border border-app-border bg-app-elevated px-2.5 text-xs font-mono font-bold text-app-accent focus:outline-none focus:border-app-accent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Style</span>
              <div className="flex gap-1.5">
                {FOCUS_STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setToken('cursor.focusRingStyle', s)}
                    className={`flex-1 h-8 rounded-lg border text-xs font-medium transition-all ${
                      cursor.focusRingStyle === s
                        ? 'border-app-accent bg-app-accent/15 text-app-accent font-semibold shadow-sm'
                        : 'border-app-border bg-app-elevated/40 text-app-muted hover:border-app-border hover:bg-app-elevated'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Focus Ring Live Preview Box */}
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-app-accent" />
              Focus Ring Test Sandbox
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Focus the sample button below to preview outline rendering, custom margins, offsets, and styles.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 bg-app-elevated border border-app-border/50 rounded-xl relative overflow-hidden">
            <button
              className="px-6 py-2.5 rounded-lg bg-app-inset border border-app-border text-xs font-bold text-app-text transition-all duration-200"
              style={{
                outline: `${cursor.focusRingWidth} ${cursor.focusRingStyle} ${cursor.focusRingColor}`,
                outlineOffset: cursor.focusRingOffset,
              }}
            >
              Interactive Focus Sandbox
            </button>
          </div>
        </div>
      </div>

      {/* Cursor Types Grid */}
      <div className="p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm">
        <h3 className="text-xs font-semibold text-app-text mb-4 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-app-accent" />
          Cursor Type Mapping & Sandbox
        </h3>
        
        <div className="grid grid-cols-4 gap-4">
          {CURSORS.map(({ key, label, value, desc }) => {
            const isActive = cursor[key] === value
            return (
              <div
                key={key}
                onMouseEnter={() => setHoveredDemo(key)}
                onMouseLeave={() => setHoveredDemo(null)}
                onClick={() => setToken(`cursor.${key}`, value)}
                className={`flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer text-left select-none min-h-[140px] ${
                  isActive
                    ? 'bg-app-elevated border-app-accent shadow-sm'
                    : 'bg-app-elevated/40 border-app-border/60 hover:border-app-border hover:bg-app-elevated/80'
                }`}
                style={{ cursor: value }}
              >
                <div>
                  <span className="text-xs font-bold text-app-text block">{label}</span>
                  <span className="text-[9px] text-app-muted leading-relaxed block mt-1">{desc}</span>
                </div>
                <div className="flex justify-between items-center mt-4 border-t border-app-border/30 pt-3">
                  <span className="text-[9px] font-mono text-app-accent font-semibold">{value}</span>
                  <div className="h-6 w-12 rounded bg-app-inset border border-app-border flex items-center justify-center text-[9px] text-app-muted font-bold">
                    Test
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
