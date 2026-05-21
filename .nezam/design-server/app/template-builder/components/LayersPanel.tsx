'use client'
import React, { useState } from 'react'
import {
  Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown,
  GripVertical, Trash2, Copy, Layers,
  Layout, AlignLeft, MessageSquare, DollarSign, Users,
  BarChart3, Mail, Image, Navigation, Minus,
} from 'lucide-react'

export interface SectionLayer {
  id: string
  label: string
  labelAr: string
  icon: React.ReactNode
  visible: boolean
  locked: boolean
}

export const DEFAULT_LAYERS: SectionLayer[] = [
  { id: 'nav',          label: 'Navigation',   labelAr: 'التنقل',         icon: <Navigation size={11}/>, visible: true,  locked: true  },
  { id: 'hero',         label: 'Hero',         labelAr: 'الهيرو',         icon: <Layout     size={11}/>, visible: true,  locked: false },
  { id: 'features',     label: 'Features',     labelAr: 'الميزات',        icon: <Layers     size={11}/>, visible: true,  locked: false },
  { id: 'stats',        label: 'Stats',        labelAr: 'الإحصائيات',     icon: <BarChart3  size={11}/>, visible: false, locked: false },
  { id: 'pricing',      label: 'Pricing',      labelAr: 'الأسعار',        icon: <DollarSign size={11}/>, visible: false, locked: false },
  { id: 'testimonials', label: 'Testimonials', labelAr: 'آراء العملاء',   icon: <MessageSquare size={11}/>, visible: true, locked: false },
  { id: 'team',         label: 'Team',         labelAr: 'الفريق',         icon: <Users      size={11}/>, visible: false, locked: false },
  { id: 'form',         label: 'Contact Form', labelAr: 'نموذج التواصل',  icon: <Mail       size={11}/>, visible: true,  locked: false },
  { id: 'media',        label: 'Media Block',  labelAr: 'كتلة وسائط',     icon: <Image      size={11}/>, visible: false, locked: false },
  { id: 'divider',      label: 'Divider',      labelAr: 'فاصل',           icon: <Minus      size={11}/>, visible: false, locked: false },
  { id: 'footer',       label: 'Footer',       labelAr: 'الفوتر',         icon: <AlignLeft  size={11}/>, visible: true,  locked: true  },
]

interface LayersPanelProps {
  layers: SectionLayer[]
  setLayers: (layers: SectionLayer[]) => void
  lang: string
  t: (en: string, ar: string) => string
}

export default function LayersPanel({ layers, setLayers, lang, t }: LayersPanelProps) {
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const toggleVisible = (id: string) => {
    setLayers(layers.map(l => l.id === id && !l.locked ? { ...l, visible: !l.visible } : l))
  }

  const toggleLocked = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l))
  }

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const next = [...layers]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    setLayers(next)
  }

  const moveDown = (idx: number) => {
    if (idx === layers.length - 1) return
    const next = [...layers]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    setLayers(next)
  }

  const duplicate = (idx: number) => {
    const layer = layers[idx]
    const copy: SectionLayer = { ...layer, id: `${layer.id}_copy_${Date.now()}`, label: `${layer.label} (copy)`, labelAr: `${layer.labelAr} (نسخة)` }
    const next = [...layers]
    next.splice(idx + 1, 0, copy)
    setLayers(next)
  }

  const remove = (id: string) => {
    const layer = layers.find(l => l.id === id)
    if (layer?.locked) return
    setLayers(layers.filter(l => l.id !== id))
  }

  const onDragStart = (id: string) => setDragging(id)
  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDragOver(id)
  }
  const onDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return }
    const next = [...layers]
    const from = next.findIndex(l => l.id === dragging)
    const to   = next.findIndex(l => l.id === targetId)
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setLayers(next)
    setDragging(null)
    setDragOver(null)
  }

  const visible = layers.filter(l => l.visible).length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#2e2e30] shrink-0 flex items-center gap-2">
        <Layers size={11} className="text-ds-primary" />
        <span className="text-[10px] font-semibold text-[#a1a1a6]">{t('Layers', 'الطبقات')}</span>
        <span className="ms-auto text-[8px] text-[#48484a] bg-[#1c1c1e] border border-[#2e2e30] px-1.5 py-0.5 rounded-full">
          {visible}/{layers.length} {t('visible', 'مرئي')}
        </span>
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {layers.map((layer, idx) => (
          <div
            key={layer.id}
            draggable={!layer.locked}
            onDragStart={() => onDragStart(layer.id)}
            onDragOver={e => onDragOver(e, layer.id)}
            onDrop={() => onDrop(layer.id)}
            onDragEnd={() => { setDragging(null); setDragOver(null) }}
            onMouseEnter={() => setHoveredId(layer.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all cursor-default ${
              dragOver === layer.id ? 'ring-1 ring-ds-primary/60 bg-ds-primary/5' :
              dragging === layer.id ? 'opacity-40' :
              !layer.visible ? 'opacity-50' :
              'hover:bg-[#1a1a1b]'
            }`}
          >
            {/* Drag handle */}
            <div className={`shrink-0 cursor-grab active:cursor-grabbing text-[#3a3a3c] transition-colors ${!layer.locked ? 'group-hover:text-[#636366]' : ''}`}>
              <GripVertical size={10} />
            </div>

            {/* Icon */}
            <div className={`shrink-0 ${layer.visible ? 'text-ds-primary' : 'text-[#48484a]'}`}>
              {layer.icon}
            </div>

            {/* Label */}
            <span className={`flex-1 text-[10px] font-medium truncate ${layer.visible ? 'text-[#e1e1e6]' : 'text-[#48484a]'}`}>
              {t(layer.label, layer.labelAr)}
            </span>

            {/* Controls — always visible on hover */}
            <div className={`flex items-center gap-0.5 shrink-0 transition-opacity ${hoveredId === layer.id ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="w-4 h-4 flex items-center justify-center rounded text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c] disabled:opacity-20 transition-all"
              >
                <ChevronUp size={8} />
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === layers.length - 1}
                className="w-4 h-4 flex items-center justify-center rounded text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c] disabled:opacity-20 transition-all"
              >
                <ChevronDown size={8} />
              </button>
              <button
                onClick={() => duplicate(idx)}
                className="w-4 h-4 flex items-center justify-center rounded text-[#636366] hover:text-[#e1e1e6] hover:bg-[#2b2b2c] transition-all"
              >
                <Copy size={8} />
              </button>
              {!layer.locked && (
                <button
                  onClick={() => remove(layer.id)}
                  className="w-4 h-4 flex items-center justify-center rounded text-[#636366] hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={8} />
                </button>
              )}
            </div>

            {/* Visibility toggle */}
            <button
              onClick={() => toggleVisible(layer.id)}
              className={`w-5 h-5 flex items-center justify-center rounded transition-all shrink-0 ${
                layer.locked ? 'opacity-30 cursor-not-allowed' :
                layer.visible ? 'text-[#8e8e93] hover:text-[#e1e1e6]' : 'text-[#3a3a3c] hover:text-[#636366]'
              }`}
            >
              {layer.visible ? <Eye size={10} /> : <EyeOff size={10} />}
            </button>

            {/* Lock toggle */}
            <button
              onClick={() => toggleLocked(layer.id)}
              className={`w-5 h-5 flex items-center justify-center rounded transition-all shrink-0 ${
                layer.locked ? 'text-amber-400/70 hover:text-amber-400' : 'text-[#3a3a3c] hover:text-[#636366]'
              }`}
            >
              {layer.locked ? <Lock size={9} /> : <Unlock size={9} />}
            </button>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-[#2e2e30] shrink-0">
        <p className="text-[8px] text-[#48484a] leading-relaxed">
          {t('Drag to reorder · Eye to toggle visibility · Lock to protect layer', 'اسحب لإعادة الترتيب · العين للإخفاء · القفل للحماية')}
        </p>
      </div>
    </div>
  )
}
