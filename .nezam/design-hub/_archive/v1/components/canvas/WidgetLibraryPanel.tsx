'use client'

import { useState, useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  Menu, Layers, LayoutGrid, FormInput, Type, AlignEndHorizontal,
  Search, ChevronDown, ChevronRight, LayoutList, Grid3X3,
  PanelLeft, Star, Columns2, Video, Mail, LogIn, UserPlus,
  Square, Grid2x2, Table, SidebarOpen, Tags,
  Megaphone, BarChart2, Users, Quote,
} from 'lucide-react'
import { WIDGET_CATEGORIES, WIDGETS, type WidgetDef, type WidgetCategory } from '@/lib/widgets/catalog'
import { useSessionStore } from '@/lib/store/session.store'

type ViewMode = 'list' | 'grid' | 'compact'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Menu, Layers, LayoutGrid, FormInput, Type, AlignEndHorizontal,
  PanelLeft, Star, Columns2, Video, Mail, LogIn, UserPlus,
  Square, Grid2x2, Table, SidebarOpen, Tags,
  Megaphone, BarChart2, Users, Quote, Search,
}

function WidgetIcon({ name, size = 13 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name] ?? Square
  return <Icon size={size} />
}

function DraggableWidget({
  widget, lang, view,
}: {
  widget: WidgetDef; lang: string; view: ViewMode
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `widget:${widget.type}`,
    data: { type: 'widget', widget },
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }
    : undefined

  const label = lang === 'ar' ? widget.nameAr : widget.name

  if (view === 'grid') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        title={widget.description}
        className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-transparent bg-transparent hover:bg-[#232324] hover:border-[#3a3a3c] cursor-grab active:cursor-grabbing transition-all duration-100 select-none group"
      >
        <div className="w-8 h-8 rounded-md bg-[#232324] group-hover:bg-[#2c2c2e] flex items-center justify-center text-[#8e8e93] group-hover:text-[#e1e1e6] transition-colors shrink-0">
          <WidgetIcon name={widget.icon} size={14} />
        </div>
        <span className="text-[10px] font-medium text-[#8e8e93] group-hover:text-[#e1e1e6] text-center leading-tight line-clamp-2 transition-colors w-full">
          {label}
        </span>
      </div>
    )
  }

  if (view === 'compact') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        title={`${label} — ${widget.description}`}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-grab active:cursor-grabbing hover:bg-[#232324] text-[#8e8e93] hover:text-[#e1e1e6] transition-all duration-100 select-none"
      >
        <WidgetIcon name={widget.icon} size={11} />
        <span className="text-[10px] truncate leading-none">{label}</span>
      </div>
    )
  }

  // list
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      title={widget.description}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-[#232324] border border-transparent hover:border-[#3a3a3c] transition-all duration-100 select-none group"
    >
      <div className="w-6 h-6 rounded flex items-center justify-center text-[#636366] group-hover:text-[#a1a1a6] shrink-0 transition-colors">
        <WidgetIcon name={widget.icon} size={12} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium text-[#a1a1a6] group-hover:text-[#e1e1e6] truncate transition-colors leading-tight">
          {label}
        </div>
        <div className="text-[9px] text-[#636366] truncate leading-tight mt-0.5">
          {widget.description}
        </div>
      </div>
    </div>
  )
}

interface CategorySectionProps {
  label:   string
  labelAr: string
  iconName: string
  widgets: WidgetDef[]
  lang:    string
  view:    ViewMode
  open:    boolean
  onToggle: () => void
}

function CategorySection({ label, labelAr, iconName, widgets, lang, view, open, onToggle }: CategorySectionProps) {
  const title = lang === 'ar' ? labelAr : label

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#636366] hover:text-[#a1a1a6] transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <WidgetIcon name={iconName} size={10} />
          {title}
          <span className="ml-1 font-normal normal-case tracking-normal text-[9px] text-[#48484a]">
            {widgets.length}
          </span>
        </span>
        {open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
      </button>

      {open && (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-3 gap-0.5 px-1 pb-2'
              : view === 'compact'
              ? 'grid grid-cols-2 gap-0 pb-2'
              : 'flex flex-col gap-0.5 px-1 pb-2'
          }
        >
          {widgets.map((w) => (
            <DraggableWidget key={w.type} widget={w} lang={lang} view={view} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function WidgetLibraryPanel({ lang: langProp }: { lang?: string }) {
  const storeLang = useSessionStore((s) => s.lang)
  const lang = langProp ?? storeLang
  const isRTL = lang === 'ar'

  const [query,    setQuery]    = useState('')
  const [view,     setView]     = useState<ViewMode>('list')
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(['navigation', 'hero']))

  const toggle = (id: string) =>
    setOpenCats((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const filtered = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return WIDGETS.filter(
      (w) => w.name.toLowerCase().includes(q) || w.nameAr.includes(q) || w.type.toLowerCase().includes(q),
    )
  }, [query])

  const VIEW_BUTTONS: { mode: ViewMode; icon: React.ReactNode; title: string }[] = [
    { mode: 'list',    icon: <LayoutList size={11} />, title: 'List view'    },
    { mode: 'grid',    icon: <LayoutGrid size={11} />, title: 'Grid view'    },
    { mode: 'compact', icon: <Grid3X3   size={11} />, title: 'Compact view' },
  ]

  return (
    <div
      className="h-full flex flex-col bg-[#181819] border-e border-[#2e2e30] overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-2.5 shrink-0 border-b border-[#2e2e30] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#636366]">
            {isRTL ? 'مكتبة الأدوات' : 'Components'}
          </span>
          <div className="flex items-center gap-0.5">
            {VIEW_BUTTONS.map(({ mode, icon, title }) => (
              <button
                key={mode}
                title={title}
                onClick={() => setView(mode)}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                  view === mode
                    ? 'bg-[#2c2c2e] text-[#e1e1e6]'
                    : 'text-[#636366] hover:text-[#a1a1a6] hover:bg-[#232324]'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search size={11} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-[#48484a] pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isRTL ? 'بحث في الأدوات…' : 'Search components…'}
            className="w-full bg-[#232324] border border-[#2e2e30] rounded-lg text-[11px] ps-7 pe-2 py-1.5 text-[#e1e1e6] placeholder:text-[#48484a] focus:outline-none focus:border-[#636366] transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1">
        {filtered ? (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-3 gap-0.5 px-1 pt-1'
                : view === 'compact'
                ? 'grid grid-cols-2 gap-0 pt-1'
                : 'flex flex-col gap-0.5 px-1 pt-1'
            }
          >
            {filtered.length === 0 ? (
              <p className="col-span-3 text-center text-[11px] text-[#48484a] py-8 px-4">
                {isRTL ? 'لا نتائج مطابقة' : 'No components found'}
              </p>
            ) : (
              filtered.map((w) => <DraggableWidget key={w.type} widget={w} lang={lang} view={view} />)
            )}
          </div>
        ) : (
          WIDGET_CATEGORIES.map((cat) => (
            <CategorySection
              key={cat.id}
              label={cat.label}
              labelAr={cat.labelAr}
              iconName={cat.icon}
              widgets={WIDGETS.filter((w) => w.category === cat.id)}
              lang={lang}
              view={view}
              open={openCats.has(cat.id)}
              onToggle={() => toggle(cat.id)}
            />
          ))
        )}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-[#2e2e30] shrink-0">
        <p className="text-[9px] text-[#48484a] text-center">
          {isRTL ? 'اسحب الأداة على اللوحة لإضافتها' : 'Drag a component onto the canvas'}
        </p>
      </div>
    </div>
  )
}
