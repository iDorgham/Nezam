'use client'
import React, { useState } from 'react'
import {
  Navigation, Plus, X, Trash2, ExternalLink, GripVertical,
  ChevronRight, ChevronDown, Link2, Anchor, Globe, FileText,
  Smartphone, LayoutList, Settings, Copy, Eye,
} from 'lucide-react'
import {
  PanelHeader, PanelField, PanelInput, PanelSelect,
  PanelBadge, PanelButton, PanelToggle, EmptyState, PanelDivider, PT,
} from './panel-primitives'

interface NavItem {
  id: string
  label: string
  href: string
  type: 'page' | 'url' | 'anchor'
  target: '_self' | '_blank'
  children?: NavItem[]
  expanded?: boolean
}

interface NavMenu {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

const MENUS: NavMenu[] = [
  { id: 'main', label: 'Main Navigation', icon: <Navigation size={10} />, description: 'Primary header nav' },
  { id: 'footer', label: 'Footer Links', icon: <LayoutList size={10} />, description: 'Footer column links' },
  { id: 'mobile', label: 'Mobile Menu', icon: <Smartphone size={10} />, description: 'Hamburger menu items' },
]

const DEFAULT_NAV_ITEMS: Record<string, NavItem[]> = {
  main: [
    { id: '1', label: 'Home',     href: '/',        type: 'page', target: '_self', children: [] },
    { id: '2', label: 'About',    href: '/about',   type: 'page', target: '_self', children: [] },
    { id: '3', label: 'Pricing',  href: '/pricing', type: 'page', target: '_self', children: [
      { id: '3a', label: 'Monthly', href: '/pricing#monthly', type: 'anchor', target: '_self' },
      { id: '3b', label: 'Annual',  href: '/pricing#annual',  type: 'anchor', target: '_self' },
    ]},
    { id: '4', label: 'Blog',     href: '/blog',    type: 'page', target: '_self', children: [] },
    { id: '5', label: 'Contact',  href: '/contact', type: 'page', target: '_self', children: [] },
  ],
  footer: [
    { id: 'f1', label: 'Privacy Policy', href: '/privacy', type: 'page', target: '_self' },
    { id: 'f2', label: 'Terms of Service', href: '/terms', type: 'page', target: '_self' },
    { id: 'f3', label: 'Support',        href: '/support', type: 'page', target: '_self' },
  ],
  mobile: [
    { id: 'm1', label: 'Home',    href: '/',       type: 'page', target: '_self' },
    { id: 'm2', label: 'Features', href: '/features', type: 'page', target: '_self' },
    { id: 'm3', label: 'Pricing', href: '/pricing',  type: 'page', target: '_self' },
    { id: 'm4', label: 'Get Started', href: '/signup', type: 'url', target: '_self' },
  ],
}

const LINK_TYPE_ICONS: Record<string, React.ReactNode> = {
  page: <FileText size={8} />,
  url: <Globe size={8} />,
  anchor: <Anchor size={8} />,
}

interface MenusPanelProps {
  lang: string
  t: (en: string, ar: string) => string
}

export default function MenusPanel({ lang, t }: MenusPanelProps) {
  const [activeMenu, setActiveMenu] = useState('main')
  const [items, setItems]           = useState(DEFAULT_NAV_ITEMS)
  const [selectedItemId, setSelectedItemId] = useState<string | null>('1')
  const [expanded, setExpanded]     = useState<Record<string, boolean>>({})

  const currentItems = items[activeMenu] ?? []
  const selectedItem = findItem(currentItems, selectedItemId)

  function findItem(list: NavItem[], id: string | null): NavItem | null {
    if (!id) return null
    for (const item of list) {
      if (item.id === id) return item
      if (item.children) {
        const found = findItem(item.children, id)
        if (found) return found
      }
    }
    return null
  }

  const addItem = () => {
    const newItem: NavItem = {
      id: `item_${Date.now()}`, label: 'New Link', href: '/',
      type: 'page', target: '_self', children: [],
    }
    setItems(prev => ({ ...prev, [activeMenu]: [...(prev[activeMenu] ?? []), newItem] }))
    setSelectedItemId(newItem.id)
  }

  const deleteItem = (id: string) => {
    const removeFromList = (list: NavItem[]): NavItem[] =>
      list.filter(i => i.id !== id).map(i => ({ ...i, children: i.children ? removeFromList(i.children) : undefined }))
    setItems(prev => ({ ...prev, [activeMenu]: removeFromList(prev[activeMenu] ?? []) }))
    if (selectedItemId === id) setSelectedItemId(null)
  }

  const updateItem = (id: string, patch: Partial<NavItem>) => {
    const patchList = (list: NavItem[]): NavItem[] =>
      list.map(i => i.id === id ? { ...i, ...patch } : { ...i, children: i.children ? patchList(i.children) : undefined })
    setItems(prev => ({ ...prev, [activeMenu]: patchList(prev[activeMenu] ?? []) }))
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: PT.bg }}>

      {/* ── Menu selector + Item list ── */}
      <div className="flex flex-col border-r" style={{ width: '52%', borderColor: PT.border }}>

        <PanelHeader
          icon={<Navigation size={11} />}
          title={t('Menus', 'القوائم')}
          subtitle={t(`${currentItems.length} items`, `${currentItems.length} عنصر`)}
          actions={
            <button
              onClick={addItem}
              className="w-6 h-6 flex items-center justify-center rounded-md transition-all hover:text-white"
              style={{ color: PT.textMuted }}
            >
              <Plus size={11} />
            </button>
          }
        />

        {/* Menu type switcher */}
        <div className="px-2 py-2 shrink-0 space-y-0.5">
          {MENUS.map(menu => (
            <button
              key={menu.id}
              onClick={() => { setActiveMenu(menu.id); setSelectedItemId(null) }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md transition-all text-start"
              style={{
                background: activeMenu === menu.id ? 'rgba(6,182,212,0.08)' : 'transparent',
                border: `1px solid ${activeMenu === menu.id ? PT.primary + '30' : 'transparent'}`,
              }}
            >
              <span style={{ color: activeMenu === menu.id ? PT.primary : PT.textMuted }}>{menu.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-semibold" style={{ color: activeMenu === menu.id ? PT.textPrimary : PT.textSecondary }}>
                  {menu.label}
                </div>
                <div className="text-[8px]" style={{ color: PT.textMuted }}>{menu.description}</div>
              </div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: PT.bgHover, color: PT.textMuted }}>
                {(items[menu.id] ?? []).length}
              </span>
            </button>
          ))}
        </div>

        <PanelDivider label={t('Items', 'العناصر')} />

        {/* Nav items list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {currentItems.length === 0 ? (
            <EmptyState icon={<Navigation size={16} />} title={t('No items', 'لا توجد عناصر')}
              action={<PanelButton variant="primary" size="xs" onClick={addItem} icon={<Plus size={9} />}>{t('Add Item', 'إضافة')}</PanelButton>} />
          ) : currentItems.map(item => (
            <NavItemRow
              key={item.id}
              item={item}
              depth={0}
              selectedId={selectedItemId}
              onSelect={setSelectedItemId}
              onDelete={deleteItem}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          ))}
        </div>
      </div>

      {/* ── Item editor ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedItem ? (
          <EmptyState icon={<Link2 size={16} />} title={t('Select an item', 'اختر عنصرًا')} />
        ) : (
          <>
            <div className="px-2.5 py-2.5 border-b shrink-0 flex items-center gap-2" style={{ borderColor: PT.border }}>
              <span style={{ color: PT.primary }}>{LINK_TYPE_ICONS[selectedItem.type]}</span>
              <span className="text-[10px] font-semibold flex-1 truncate" style={{ color: PT.textPrimary }}>
                {selectedItem.label}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-3">
              <PanelField label={t('Label', 'التسمية')}>
                <PanelInput value={selectedItem.label} onChange={v => updateItem(selectedItem.id, { label: v })} />
              </PanelField>

              <PanelField label={t('Link / URL', 'الرابط')} hint={t('e.g. /about', '/about')}>
                <PanelInput value={selectedItem.href} onChange={v => updateItem(selectedItem.id, { href: v })} mono />
              </PanelField>

              <PanelField label={t('Link Type', 'نوع الرابط')}>
                <PanelSelect
                  value={selectedItem.type}
                  onChange={v => updateItem(selectedItem.id, { type: v as NavItem['type'] })}
                  options={[
                    { value: 'page',   label: '📄 Internal Page' },
                    { value: 'url',    label: '🌐 External URL' },
                    { value: 'anchor', label: '⚓ Anchor Link' },
                  ]}
                />
              </PanelField>

              <PanelField label={t('Open in', 'فتح في')}>
                <PanelSelect
                  value={selectedItem.target}
                  onChange={v => updateItem(selectedItem.id, { target: v as '_self' | '_blank' })}
                  options={[
                    { value: '_self',  label: 'Same Tab' },
                    { value: '_blank', label: 'New Tab' },
                  ]}
                />
              </PanelField>

              <div className="pt-1 space-y-1.5">
                <PanelButton variant="default" size="xs" fullWidth icon={<ExternalLink size={9} />}>
                  {t('Test Link', 'اختبار الرابط')}
                </PanelButton>
                <PanelButton variant="danger" size="xs" fullWidth icon={<Trash2 size={9} />}
                  onClick={() => deleteItem(selectedItem.id)}>
                  {t('Remove Item', 'حذف العنصر')}
                </PanelButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Nav Item Row ──────────────────────────────────────────────────────────────
function NavItemRow({ item, depth, selectedId, onSelect, onDelete, expanded, setExpanded }: {
  item: NavItem
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  expanded: Record<string, boolean>
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}) {
  const hasChildren = item.children && item.children.length > 0
  const isExpanded  = expanded[item.id]
  const isSelected  = selectedId === item.id

  return (
    <div>
      <div
        className="group flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-all mt-0.5"
        style={{
          paddingLeft: `${8 + depth * 14}px`,
          background: isSelected ? 'rgba(6,182,212,0.08)' : 'transparent',
          border: `1px solid ${isSelected ? PT.primary + '30' : 'transparent'}`,
        }}
        onClick={() => onSelect(item.id)}
      >
        <GripVertical size={9} style={{ color: PT.textMuted }} className="opacity-0 group-hover:opacity-100 shrink-0" />

        {hasChildren && (
          <button
            onClick={e => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] })) }}
            style={{ color: PT.textMuted }}
          >
            {isExpanded ? <ChevronDown size={9} /> : <ChevronRight size={9} />}
          </button>
        )}
        {!hasChildren && <span style={{ color: PT.textMuted, width: 9, display: 'inline-block' }} />}

        <span style={{ color: isSelected ? PT.primary : PT.textMuted }}>
          {item.type === 'url' ? <Globe size={8} /> : item.type === 'anchor' ? <Anchor size={8} /> : <FileText size={8} />}
        </span>

        <span className="flex-1 text-[9px] font-medium truncate" style={{ color: isSelected ? PT.textPrimary : PT.textSecondary }}>
          {item.label}
        </span>

        <span className="text-[8px] opacity-0 group-hover:opacity-100 truncate max-w-[60px]" style={{ color: PT.textMuted }}>
          {item.href}
        </span>

        <button
          onClick={e => { e.stopPropagation(); onDelete(item.id) }}
          className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded hover:text-red-400 transition-all"
          style={{ color: PT.textMuted }}
        >
          <X size={8} />
        </button>
      </div>

      {isExpanded && hasChildren && item.children!.map(child => (
        <NavItemRow
          key={child.id}
          item={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          onDelete={onDelete}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ))}
    </div>
  )
}
