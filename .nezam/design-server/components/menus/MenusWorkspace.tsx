'use client'

/**
 * MenusWorkspace — full professional 3-panel visual menu builder
 *
 * Left panel   : Menu list (main, footer, side, mega, mobile, utility)
 * Center panel : Visual menu tree editor with drag-and-drop indicators
 * Right panel  : Item inspector (title, link type, icon, target, badge)
 */

import React, { useState, useCallback } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import type { Page } from '@/lib/store/session.store'
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Link2,
  Globe,
  Hash,
  Phone,
  Mail,
  ExternalLink,
  Home,
  Settings,
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  ArrowUp,
  ArrowDown,
  Layers,
  Navigation,
  Menu,
  LayoutGrid,
  Smartphone,
  Star,
  Check,
  X,
  Search,
  FileText,
  ChevronUp,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type LinkType = 'page' | 'url' | 'anchor' | 'tel' | 'email' | 'nolink'

interface MenuItem {
  id: string
  label: string
  linkType: LinkType
  pageId?: string
  url?: string
  anchor?: string
  target?: '_self' | '_blank'
  icon?: string
  badge?: string
  badgeColor?: string
  visible: boolean
  children: MenuItem[]
  description?: string
}

interface MenuConfig {
  id: string
  name: string
  description: string
  placement: 'header' | 'footer' | 'sidebar' | 'mega' | 'mobile' | 'utility'
  maxDepth: number
  items: MenuItem[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).substring(2, 10)

const PLACEMENT_META: Record<MenuConfig['placement'], { icon: React.FC<any>; color: string; label: string }> = {
  header:  { icon: Navigation,  color: '#3b82f6', label: 'Header'  },
  footer:  { icon: Layers,      color: '#6b7280', label: 'Footer'  },
  sidebar: { icon: Menu,        color: '#8b5cf6', label: 'Sidebar' },
  mega:    { icon: LayoutGrid,  color: '#f59e0b', label: 'Mega'    },
  mobile:  { icon: Smartphone,  color: '#10b981', label: 'Mobile'  },
  utility: { icon: Settings,    color: '#ef4444', label: 'Utility' },
}

const LINK_TYPE_META: Record<LinkType, { icon: React.FC<any>; label: string; placeholder: string }> = {
  page:    { icon: FileText,     label: 'Page',    placeholder: 'Select a page'  },
  url:     { icon: Globe,        label: 'URL',     placeholder: 'https://...'    },
  anchor:  { icon: Hash,         label: 'Anchor',  placeholder: '#section-id'    },
  tel:     { icon: Phone,        label: 'Phone',   placeholder: 'tel:+1234567'   },
  email:   { icon: Mail,         label: 'Email',   placeholder: 'mailto:...'     },
  nolink:  { icon: X,            label: 'No Link', placeholder: '—'              },
}

const ICON_OPTIONS = ['🏠','📄','⚙️','💡','🔗','📊','🛒','👤','📞','📧','🔍','⭐','🎯','🚀','💬','📁','🔒','🌐','📱','🖥️']

const DEFAULT_MENUS: MenuConfig[] = [
  {
    id: 'main-nav',
    name: 'Main Navigation',
    description: 'Primary header navigation',
    placement: 'header',
    maxDepth: 2,
    items: [],
  },
  {
    id: 'footer-nav',
    name: 'Footer Navigation',
    description: 'Footer links grid',
    placement: 'footer',
    maxDepth: 1,
    items: [],
  },
  {
    id: 'sidebar-nav',
    name: 'Sidebar Menu',
    description: 'Collapsible sidebar',
    placement: 'sidebar',
    maxDepth: 3,
    items: [],
  },
  {
    id: 'mega-nav',
    name: 'Mega Menu',
    description: 'Rich dropdown with columns',
    placement: 'mega',
    maxDepth: 2,
    items: [],
  },
  {
    id: 'mobile-nav',
    name: 'Mobile Menu',
    description: 'Drawer navigation for small screens',
    placement: 'mobile',
    maxDepth: 2,
    items: [],
  },
  {
    id: 'utility-nav',
    name: 'Utility Bar',
    description: 'Quick access links (login, cart, etc.)',
    placement: 'utility',
    maxDepth: 1,
    items: [],
  },
]

// ─── Recursive helpers ────────────────────────────────────────────────────────

function updateItemInTree(items: MenuItem[], id: string, updates: Partial<MenuItem>): MenuItem[] {
  return items.map(item => {
    if (item.id === id) return { ...item, ...updates }
    return { ...item, children: updateItemInTree(item.children, id, updates) }
  })
}

function removeItemFromTree(items: MenuItem[], id: string): MenuItem[] {
  return items
    .filter(item => item.id !== id)
    .map(item => ({ ...item, children: removeItemFromTree(item.children, id) }))
}

function addChildToItem(items: MenuItem[], parentId: string, child: MenuItem): MenuItem[] {
  return items.map(item => {
    if (item.id === parentId) return { ...item, children: [...item.children, child] }
    return { ...item, children: addChildToItem(item.children, parentId, child) }
  })
}

function moveItem(items: MenuItem[], id: string, direction: 'up' | 'down'): MenuItem[] {
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) {
    return items.map(item => ({
      ...item,
      children: moveItem(item.children, id, direction),
    }))
  }
  const newItems = [...items]
  if (direction === 'up' && idx > 0) {
    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]]
  } else if (direction === 'down' && idx < items.length - 1) {
    [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]]
  }
  return newItems
}

function flattenTree(items: MenuItem[]): MenuItem[] {
  return items.flatMap(item => [item, ...flattenTree(item.children)])
}

// ─── Left: Menu list panel ────────────────────────────────────────────────────

function MenuListPanel({
  menus,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
}: {
  menus: MenuConfig[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="w-[220px] min-w-[220px] bg-ds-surface border-e border-ds-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ds-border flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-semibold text-ds-text-primary">Menus</span>
        <button
          onClick={onAdd}
          className="p-1 rounded-lg bg-ds-primary/10 text-ds-primary hover:bg-ds-primary/20 transition-colors"
          title="Create menu"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Menu list */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {menus.map(menu => {
          const meta = PLACEMENT_META[menu.placement]
          const Icon = meta.icon
          const isSelected = selectedId === menu.id
          const itemCount = flattenTree(menu.items).length

          return (
            <div
              key={menu.id}
              className={`group flex items-center gap-2 px-2 py-2.5 rounded-xl cursor-pointer transition-colors mb-0.5 ${
                isSelected
                  ? 'bg-ds-primary/10 text-ds-text-primary'
                  : 'text-ds-text-muted hover:bg-ds-surface-hover hover:text-ds-text-primary'
              }`}
              onClick={() => onSelect(menu.id)}
            >
              {/* Placement icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${meta.color}20` }}
              >
                <Icon size={13} style={{ color: meta.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{menu.name}</div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[9px] font-semibold uppercase"
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[9px] text-ds-text-muted">{itemCount} items</span>
                </div>
              </div>

              <button
                onClick={e => { e.stopPropagation(); onDelete(menu.id) }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-ds-surface-hover text-ds-text-muted hover:text-[#ef4444] transition-all"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Stats footer */}
      <div className="px-4 py-2.5 border-t border-ds-border text-[10px] text-ds-text-muted flex-shrink-0">
        {menus.length} menus · {menus.reduce((acc, m) => acc + flattenTree(m.items).length, 0)} total items
      </div>
    </div>
  )
}

// ─── Center: Visual menu tree ─────────────────────────────────────────────────

interface MenuItemNodeProps {
  item: MenuItem
  depth: number
  maxDepth: number
  menuId: string
  selectedItemId: string | null
  onSelect: (id: string) => void
  onAddChild: (parentId: string) => void
  onRemove: (id: string) => void
  onMove: (id: string, dir: 'up' | 'down') => void
  expandedIds: Set<string>
  toggleExpanded: (id: string) => void
  sitemap: Page[]
}

function MenuItemNode({
  item, depth, maxDepth, menuId, selectedItemId, onSelect,
  onAddChild, onRemove, onMove, expandedIds, toggleExpanded, sitemap,
}: MenuItemNodeProps) {
  const isSelected = selectedItemId === item.id
  const hasChildren = item.children.length > 0
  const isExpanded = expandedIds.has(item.id)
  const canHaveChildren = depth < maxDepth - 1
  const linkMeta = LINK_TYPE_META[item.linkType]
  const LinkedIcon = linkMeta.icon

  // Resolve display URL
  const displayHref = item.linkType === 'page'
    ? (sitemap.find(p => p.id === item.pageId)?.route ?? '—')
    : (item.url ?? item.anchor ?? '—')

  return (
    <div>
      <div
        className={`group flex items-center gap-1.5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors mb-0.5 ${
          isSelected
            ? 'bg-ds-primary/10 border border-ds-primary/20 text-ds-text-primary'
            : 'text-ds-text-muted hover:bg-ds-surface-hover hover:text-ds-text-primary border border-transparent'
        }`}
        style={{ marginLeft: `${depth * 20}px` }}
        onClick={() => onSelect(item.id)}
      >
        {/* Grip */}
        <GripVertical size={12} className="text-ds-text-muted flex-shrink-0 cursor-grab" />

        {/* Expand toggle */}
        <button
          className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-ds-text-muted hover:text-ds-text-muted"
          onClick={e => { e.stopPropagation(); if (hasChildren) toggleExpanded(item.id) }}
        >
          {hasChildren
            ? (isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />)
            : <span className="w-1.5 h-1.5 rounded-full bg-ds-surface-hover inline-block" />}
        </button>

        {/* Icon */}
        {item.icon && (
          <span className="text-sm flex-shrink-0">{item.icon}</span>
        )}

        {/* Label */}
        <span className="flex-1 text-xs font-medium truncate">{item.label}</span>

        {/* Badge */}
        {item.badge && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0"
            style={{ background: `${item.badgeColor ?? '#FF5701'}20`, color: item.badgeColor ?? '#FF5701' }}
          >
            {item.badge}
          </span>
        )}

        {/* Link type + href */}
        <div className="flex items-center gap-1 text-[9px] text-ds-text-muted flex-shrink-0">
          <LinkedIcon size={9} />
          <span className="font-mono truncate max-w-[80px]">{displayHref}</span>
        </div>

        {/* Visibility */}
        {!item.visible && (
          <EyeOff size={10} className="text-ds-text-muted flex-shrink-0" />
        )}

        {/* External target */}
        {item.target === '_blank' && (
          <ExternalLink size={9} className="text-ds-text-muted flex-shrink-0" />
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ms-1">
          {canHaveChildren && (
            <button
              onClick={e => { e.stopPropagation(); onAddChild(item.id) }}
              className="p-0.5 rounded hover:bg-ds-surface-hover text-ds-text-muted hover:text-ds-primary"
              title="Add child item"
            >
              <Plus size={10} />
            </button>
          )}
          <button
            onClick={e => { e.stopPropagation(); onMove(item.id, 'up') }}
            className="p-0.5 rounded hover:bg-ds-surface-hover text-ds-text-muted hover:text-ds-text-primary"
          >
            <ArrowUp size={9} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onMove(item.id, 'down') }}
            className="p-0.5 rounded hover:bg-ds-surface-hover text-ds-text-muted hover:text-ds-text-primary"
          >
            <ArrowDown size={9} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onRemove(item.id) }}
            className="p-0.5 rounded hover:bg-ds-surface-hover text-ds-text-muted hover:text-[#ef4444]"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-2 w-px bg-ds-surface-hover rounded-full"
            style={{ left: `${depth * 20 + 19}px` }}
          />
          {item.children.map(child => (
            <MenuItemNode
              key={child.id}
              item={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              menuId={menuId}
              selectedItemId={selectedItemId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onRemove={onRemove}
              onMove={onMove}
              expandedIds={expandedIds}
              toggleExpanded={toggleExpanded}
              sitemap={sitemap}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function MenuEditor({
  menu,
  selectedItemId,
  onSelectItem,
  onUpdateMenu,
}: {
  menu: MenuConfig
  selectedItemId: string | null
  onSelectItem: (id: string | null) => void
  onUpdateMenu: (updated: MenuConfig) => void
}) {
  const { sitemap } = useSessionStore()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const meta = PLACEMENT_META[menu.placement]

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const addRootItem = () => {
    const newItem: MenuItem = {
      id: uid(), label: 'New Item', linkType: 'page',
      visible: true, children: [],
    }
    onUpdateMenu({ ...menu, items: [...menu.items, newItem] })
    onSelectItem(newItem.id)
  }

  const addChildItem = (parentId: string) => {
    const newItem: MenuItem = {
      id: uid(), label: 'Child Item', linkType: 'page',
      visible: true, children: [],
    }
    onUpdateMenu({ ...menu, items: addChildToItem(menu.items, parentId, newItem) })
    setExpandedIds(prev => new Set(prev).add(parentId))
    onSelectItem(newItem.id)
  }

  const removeItem = (id: string) => {
    onUpdateMenu({ ...menu, items: removeItemFromTree(menu.items, id) })
    if (selectedItemId === id) onSelectItem(null)
  }

  const moveItem_ = (id: string, dir: 'up' | 'down') => {
    onUpdateMenu({ ...menu, items: moveItem(menu.items, id, dir) })
  }

  const filtered = search
    ? menu.items.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
    : menu.items

  const totalItems = flattenTree(menu.items).length

  // Build a nav preview
  const NavPreviewItem = ({ item, depth }: { item: MenuItem; depth: number }) => {
    const href = item.linkType === 'page'
      ? (sitemap.find(p => p.id === item.pageId)?.route ?? '#')
      : (item.url ?? item.anchor ?? '#')
    return (
      <div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
            item.visible ? 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover' : 'text-ds-text-muted line-through'
          }`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          {item.icon && <span className="text-sm">{item.icon}</span>}
          <span>{item.label}</span>
          {item.badge && (
            <span
              className="ms-auto text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ background: `${item.badgeColor ?? '#FF5701'}30`, color: item.badgeColor ?? '#FF5701' }}
            >
              {item.badge}
            </span>
          )}
          {item.target === '_blank' && <ExternalLink size={9} className="ms-auto text-ds-text-muted" />}
        </div>
        {item.children.map(c => <NavPreviewItem key={c.id} item={c} depth={depth + 1} />)}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="h-11 border-b border-ds-border bg-ds-surface flex items-center px-4 gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <meta.icon size={14} style={{ color: meta.color }} />
          <span className="text-sm font-semibold text-ds-text-primary">{menu.name}</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: `${meta.color}20`, color: meta.color }}
          >
            {meta.label}
          </span>
        </div>

        <div className="w-px h-4 bg-ds-surface-hover" />

        <span className="text-[11px] text-ds-text-muted">{totalItems} items · max depth {menu.maxDepth}</span>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <Search size={11} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ds-text-muted" />
          <input
            type="text"
            placeholder="Search items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-40 bg-ds-surface border border-ds-border rounded-lg ps-7 pe-3 py-1.5 text-[11px] text-ds-text-primary placeholder-[#3A3E4F] focus:outline-none focus:border-ds-primary/50"
          />
        </div>

        <button
          onClick={addRootItem}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-ds-primary text-ds-text-primary hover:bg-ds-primary/90 transition-colors"
        >
          <Plus size={13} />
          Add Item
        </button>
      </div>

      {/* Content split: tree + preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tree */}
        <div className="flex-1 overflow-y-auto p-4">
          {menu.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-ds-surface border border-ds-border flex items-center justify-center mx-auto mb-4">
                <Navigation size={22} className="text-ds-primary" />
              </div>
              <p className="text-sm text-ds-text-primary font-medium mb-1">{menu.name}</p>
              <p className="text-xs text-ds-text-muted mb-5 max-w-xs">{menu.description}. No items yet.</p>
              <button
                onClick={addRootItem}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ds-primary text-ds-text-primary text-xs font-semibold hover:bg-ds-primary/90 transition-colors"
              >
                <Plus size={13} />
                Add First Item
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map(item => (
                <MenuItemNode
                  key={item.id}
                  item={item}
                  depth={0}
                  maxDepth={menu.maxDepth}
                  menuId={menu.id}
                  selectedItemId={selectedItemId}
                  onSelect={onSelectItem}
                  onAddChild={addChildItem}
                  onRemove={removeItem}
                  onMove={moveItem_}
                  expandedIds={expandedIds}
                  toggleExpanded={toggleExpanded}
                  sitemap={sitemap}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Preview */}
        {menu.items.length > 0 && (
          <div className="w-[200px] min-w-[200px] border-s border-ds-border bg-[#080A12] flex flex-col">
            <div className="px-3 py-2 border-b border-ds-border flex-shrink-0">
              <span className="text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider">Live Preview</span>
            </div>
            <div className="flex-1 overflow-y-auto py-2 px-1">
              {menu.items.map(item => <NavPreviewItem key={item.id} item={item} depth={0} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Right: Item inspector ────────────────────────────────────────────────────

function ItemInspector({
  item,
  menu,
  onUpdateItem,
}: {
  item: MenuItem | null
  menu: MenuConfig | null
  onUpdateItem: (id: string, updates: Partial<MenuItem>) => void
}) {
  const { sitemap } = useSessionStore()
  const [showIconPicker, setShowIconPicker] = useState(false)

  if (!item || !menu) {
    return (
      <div className="w-[260px] min-w-[260px] bg-ds-surface border-s border-ds-border flex flex-col items-center justify-center h-full">
        <Navigation size={22} className="text-[#2A2E3F] mb-2" />
        <p className="text-xs text-ds-text-muted text-center px-4">Select an item to configure it</p>
      </div>
    )
  }

  const update = (updates: Partial<MenuItem>) => onUpdateItem(item.id, updates)

  return (
    <div className="w-[260px] min-w-[260px] bg-ds-surface border-s border-ds-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ds-border flex-shrink-0">
        <div className="flex items-center gap-2">
          {item.icon && <span className="text-base">{item.icon}</span>}
          <span className="text-xs font-semibold text-ds-text-primary truncate flex-1">{item.label}</span>
          <button
            onClick={() => update({ visible: !item.visible })}
            className={`p-1 rounded transition-colors ${item.visible ? 'text-[#10b981]' : 'text-ds-text-muted'}`}
            title={item.visible ? 'Visible' : 'Hidden'}
          >
            {item.visible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Label */}
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
            Label
          </label>
          <input
            type="text"
            value={item.label}
            onChange={e => update({ label: e.target.value })}
            className="w-full bg-ds-surface border border-ds-border rounded-lg px-3 py-2 text-xs text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
            Description <span className="text-ds-text-muted normal-case font-normal">(tooltip/subtitle)</span>
          </label>
          <input
            type="text"
            value={item.description ?? ''}
            onChange={e => update({ description: e.target.value || undefined })}
            placeholder="Optional subtitle or tooltip text"
            className="w-full bg-ds-surface border border-ds-border rounded-lg px-3 py-2 text-xs text-ds-text-primary placeholder-[#3A3E4F] focus:outline-none focus:border-ds-primary/50"
          />
        </div>

        {/* Icon picker */}
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
            Icon (emoji)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="w-10 h-10 rounded-lg bg-ds-surface border border-ds-border flex items-center justify-center text-xl hover:border-ds-primary/50 transition-colors"
            >
              {item.icon ?? '➕'}
            </button>
            {item.icon && (
              <button
                onClick={() => update({ icon: undefined })}
                className="text-[10px] text-ds-text-muted hover:text-[#ef4444] transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          {showIconPicker && (
            <div className="mt-2 grid grid-cols-7 gap-1 p-2 bg-ds-surface border border-ds-border rounded-xl">
              {ICON_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => { update({ icon: emoji }); setShowIconPicker(false) }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ds-surface-hover text-base transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Link type */}
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
            Link Type
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(Object.keys(LINK_TYPE_META) as LinkType[]).map(type => {
              const m = LINK_TYPE_META[type]
              const MIcon = m.icon
              return (
                <button
                  key={type}
                  onClick={() => update({ linkType: type })}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all border ${
                    item.linkType === type
                      ? 'border-ds-primary bg-ds-primary/10 text-ds-text-primary'
                      : 'border-ds-border bg-ds-surface text-ds-text-muted hover:border-ds-border hover:text-ds-text-muted'
                  }`}
                >
                  <MIcon size={12} />
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Link target input */}
        {item.linkType === 'page' && (
          <div>
            <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
              Target Page
            </label>
            <select
              value={item.pageId ?? ''}
              onChange={e => update({ pageId: e.target.value || undefined })}
              className="w-full bg-ds-surface border border-ds-border rounded-lg px-3 py-2 text-xs text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
            >
              <option value="">Select a page…</option>
              {sitemap.map(page => (
                <option key={page.id} value={page.id}>
                  {page.title} — {page.route}
                </option>
              ))}
            </select>
          </div>
        )}

        {(item.linkType === 'url' || item.linkType === 'tel' || item.linkType === 'email') && (
          <div>
            <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
              {LINK_TYPE_META[item.linkType].label}
            </label>
            <input
              type="text"
              value={item.url ?? ''}
              onChange={e => update({ url: e.target.value })}
              placeholder={LINK_TYPE_META[item.linkType].placeholder}
              className="w-full bg-ds-surface border border-ds-border rounded-lg px-3 py-2 text-xs text-ds-text-primary placeholder-[#3A3E4F] font-mono focus:outline-none focus:border-ds-primary/50"
            />
          </div>
        )}

        {item.linkType === 'anchor' && (
          <div>
            <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
              Anchor ID
            </label>
            <input
              type="text"
              value={item.anchor ?? ''}
              onChange={e => update({ anchor: e.target.value })}
              placeholder="#section-id"
              className="w-full bg-ds-surface border border-ds-border rounded-lg px-3 py-2 text-xs text-ds-text-primary placeholder-[#3A3E4F] font-mono focus:outline-none focus:border-ds-primary/50"
            />
          </div>
        )}

        {/* Open in new tab */}
        {item.linkType !== 'nolink' && item.linkType !== 'anchor' && (
          <button
            onClick={() => update({ target: item.target === '_blank' ? '_self' : '_blank' })}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
              item.target === '_blank'
                ? 'border-[#3b82f6]/40 bg-[#3b82f6]/5 text-[#3b82f6]'
                : 'border-ds-border bg-ds-surface text-ds-text-muted'
            }`}
          >
            <ExternalLink size={12} />
            {item.target === '_blank' ? 'Opens in new tab' : 'Same tab'}
          </button>
        )}

        {/* Badge */}
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
            Badge
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={item.badge ?? ''}
              onChange={e => update({ badge: e.target.value || undefined })}
              placeholder="New / Hot / 3"
              className="flex-1 bg-ds-surface border border-ds-border rounded-lg px-3 py-2 text-xs text-ds-text-primary placeholder-[#3A3E4F] focus:outline-none focus:border-ds-primary/50"
            />
            {item.badge && (
              <input
                type="color"
                value={item.badgeColor ?? '#FF5701'}
                onChange={e => update({ badgeColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-ds-border bg-ds-surface cursor-pointer"
                title="Badge color"
              />
            )}
          </div>
          {item.badge && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[10px] text-ds-text-muted">Preview:</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: `${item.badgeColor ?? '#FF5701'}20`, color: item.badgeColor ?? '#FF5701' }}
              >
                {item.badge}
              </span>
            </div>
          )}
        </div>

        {/* Visibility */}
        <button
          onClick={() => update({ visible: !item.visible })}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
            item.visible
              ? 'border-[#10b981]/30 bg-[#10b981]/5 text-[#10b981]'
              : 'border-ds-border bg-ds-surface text-ds-text-muted'
          }`}
        >
          {item.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          {item.visible ? 'Visible in menu' : 'Hidden from menu'}
        </button>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function MenusWorkspace() {
  const [menus, setMenus] = useState<MenuConfig[]>(DEFAULT_MENUS)
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>('main-nav')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const handleUpdateMenu = useCallback((updated: MenuConfig) => {
    setMenus(prev => prev.map(m => m.id === updated.id ? updated : m))
  }, [])

  const handleAddMenu = () => {
    const newMenu: MenuConfig = {
      id: uid(),
      name: 'New Menu',
      description: 'Custom navigation menu',
      placement: 'header',
      maxDepth: 2,
      items: [],
    }
    setMenus(prev => [...prev, newMenu])
    setSelectedMenuId(newMenu.id)
    setSelectedItemId(null)
  }

  const handleDeleteMenu = (id: string) => {
    setMenus(prev => prev.filter(m => m.id !== id))
    if (selectedMenuId === id) {
      setSelectedMenuId(menus.filter(m => m.id !== id)[0]?.id ?? null)
      setSelectedItemId(null)
    }
  }

  const handleUpdateItem = useCallback((itemId: string, updates: Partial<MenuItem>) => {
    setMenus(prev =>
      prev.map(m =>
        m.id === selectedMenuId
          ? { ...m, items: updateItemInTree(m.items, itemId, updates) }
          : m
      )
    )
  }, [selectedMenuId])

  const activeMenu = menus.find(m => m.id === selectedMenuId) ?? null

  // Find selected item across tree
  const selectedItem = activeMenu
    ? flattenTree(activeMenu.items).find(i => i.id === selectedItemId) ?? null
    : null

  return (
    <div className="flex h-[calc(100vh-40px)] overflow-hidden bg-ds-surface">
      {/* Left: menu list */}
      <MenuListPanel
        menus={menus}
        selectedId={selectedMenuId}
        onSelect={id => { setSelectedMenuId(id); setSelectedItemId(null) }}
        onAdd={handleAddMenu}
        onDelete={handleDeleteMenu}
      />

      {/* Center: menu editor */}
      {activeMenu ? (
        <MenuEditor
          menu={activeMenu}
          selectedItemId={selectedItemId}
          onSelectItem={setSelectedItemId}
          onUpdateMenu={handleUpdateMenu}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-ds-surface">
          <div className="text-center">
            <Navigation size={28} className="mx-auto text-ds-primary mb-3" />
            <p className="text-sm text-ds-text-primary font-medium mb-1">Select a Menu</p>
            <p className="text-xs text-ds-text-muted">Choose a menu from the left panel to start editing</p>
          </div>
        </div>
      )}

      {/* Right: item inspector */}
      <ItemInspector
        item={selectedItem}
        menu={activeMenu}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  )
}
