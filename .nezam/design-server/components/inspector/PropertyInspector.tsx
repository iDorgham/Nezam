'use client'

import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import {
  useCanvasGraphStore,
  type CanvasNode,
  type NodeStyle,
} from '@/src/store/canvas-graph.store'
import BoxModelFields, { type BoxModelKey, type BoxModelValues } from './BoxModelFields'
import TypographyFields, { type TypographyKey, type TypographyValues } from './TypographyFields'
import A11yTab, { type A11yKey, type A11yValues } from './A11yTab'

// F-007 §3 — Property Inspector right-dock panel.
// Reads selection + node style from canvas-graph.store; pushes edits straight
// back through updateNode so the canvas re-renders on the next commit phase
// (AC-002: within 16ms). Empty / multi-select states render bespoke surfaces.

type TabId = 'layers' | 'settings' | 'css' | 'a11y'

interface Tab {
  id:    TabId
  label: string
}

const TABS: ReadonlyArray<Tab> = [
  { id: 'layers',   label: 'Layers' },
  { id: 'settings', label: 'Settings' },
  { id: 'css',      label: 'CSS' },
  { id: 'a11y',     label: 'A11y' },
]

function boxModelFrom(style: NodeStyle): BoxModelValues {
  return {
    marginInlineStart:  style.marginInlineStart  ?? 0,
    marginInlineEnd:    style.marginInlineEnd    ?? 0,
    marginBlockStart:   style.marginBlockStart   ?? 0,
    marginBlockEnd:     style.marginBlockEnd     ?? 0,
    paddingInlineStart: style.paddingInlineStart ?? 0,
    paddingInlineEnd:   style.paddingInlineEnd   ?? 0,
    paddingBlockStart:  style.paddingBlockStart  ?? 0,
    paddingBlockEnd:    style.paddingBlockEnd    ?? 0,
  }
}

function typographyFrom(style: NodeStyle): TypographyValues {
  return {
    fontFamily: style.fontFamily ?? 'Geist Sans',
    fontWeight: style.fontWeight ?? 400,
    fontSize:   style.fontSize   ?? 'clamp(1rem, 2vw, 1.25rem)',
    lineHeight: style.lineHeight ?? 1.5,
  }
}

function a11yFrom(style: NodeStyle): A11yValues {
  return {
    fgColor:  style.fgColor  ?? '#000000',
    bgColor:  style.bgColor  ?? '#ffffff',
    tabIndex: style.tabIndex ?? 0,
    ariaRole: style.ariaRole ?? '',
  }
}

// T-F007-009 — given multiple selected nodes, build a "merged" style where
// any field that differs across nodes is set to undefined, plus a set of
// keys that are mixed. The first node's value is the canonical representative
// for shared fields.
function mergeNodeStyles<T extends Record<string, unknown>>(
  styles: ReadonlyArray<T>,
): { shared: Partial<T>; mixed: Set<keyof T> } {
  if (styles.length === 0) return { shared: {}, mixed: new Set() }
  if (styles.length === 1) return { shared: styles[0], mixed: new Set() }

  const keys = new Set<keyof T>()
  for (const s of styles) for (const k of Object.keys(s)) keys.add(k as keyof T)

  const shared: Partial<T> = {}
  const mixed = new Set<keyof T>()
  for (const key of keys) {
    const first = styles[0][key]
    const allMatch = styles.every((s) => s[key] === first)
    if (allMatch) shared[key] = first
    else mixed.add(key)
  }
  return { shared, mixed }
}

export default function PropertyInspector() {
  const selectedNodeIds = useCanvasGraphStore((s) => s.selectedNodeIds)
  const nodes           = useCanvasGraphStore((s) => s.nodes)
  const updateNode      = useCanvasGraphStore((s) => s.updateNode)
  const rtlMode         = useCanvasGraphStore((s) => s.rtlMode)

  const selectedNodes = useMemo<ReadonlyArray<CanvasNode>>(
    () => selectedNodeIds
      .map((id) => nodes.find((n) => n.id === id))
      .filter((n): n is CanvasNode => Boolean(n)),
    [selectedNodeIds, nodes],
  )
  const selectedNode  = selectedNodes.length === 1 ? selectedNodes[0] : null
  const isMultiSelect = selectedNodes.length > 1
  const isEmpty       = selectedNodes.length === 0

  const [activeTab, setActiveTab] = useState<TabId>('css')
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    layers: null, settings: null, css: null, a11y: null,
  })

  // ── Style-binding helpers (T-F007-008 / T-F007-009) ──────────────────────
  // Writes go through updateNode for *every* selected node so multi-select
  // edits collapse mixed fields to the new value across the whole selection.
  const patchStyle = useCallback(
    (patch: Partial<NodeStyle>) => {
      for (const node of selectedNodes) {
        updateNode(node.id, { style: { ...node.style, ...patch } })
      }
    },
    [selectedNodes, updateNode],
  )

  const handleBoxModelChange = useCallback(
    (key: BoxModelKey, value: number) => patchStyle({ [key]: value }),
    [patchStyle],
  )
  const handleTypographyChange = useCallback(
    <K extends TypographyKey>(key: K, value: TypographyValues[K]) =>
      patchStyle({ [key]: value }),
    [patchStyle],
  )
  const handleA11yChange = useCallback(
    <K extends A11yKey>(key: K, value: A11yValues[K]) => patchStyle({ [key]: value }),
    [patchStyle],
  )

  // Roving tabindex with arrow / Home / End keyboard nav per WAI-ARIA tabs.
  const onTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const idx = TABS.findIndex((t) => t.id === activeTab)
      if (idx < 0) return

      let nextIdx = idx
      if (e.key === 'ArrowRight')      nextIdx = (idx + 1) % TABS.length
      else if (e.key === 'ArrowLeft')  nextIdx = (idx - 1 + TABS.length) % TABS.length
      else if (e.key === 'Home')       nextIdx = 0
      else if (e.key === 'End')        nextIdx = TABS.length - 1
      else return

      e.preventDefault()
      const nextId = TABS[nextIdx].id
      setActiveTab(nextId)
      tabRefs.current[nextId]?.focus()
    },
    [activeTab],
  )

  // Build merged style + mixed-key set across selected nodes. Single-select
  // and zero-select degenerate cases just produce no mixed keys.
  const { shared, mixed } = useMemo(
    () => mergeNodeStyles(selectedNodes.map((n) => n.style)),
    [selectedNodes],
  )

  const boxModel   = useMemo(() => boxModelFrom(shared),   [shared])
  const typography = useMemo(() => typographyFrom(shared), [shared])
  const a11y       = useMemo(() => a11yFrom(shared),       [shared])

  // Partition the mixed-key set by section so each child only sees its own keys.
  const mixedBoxKeys = useMemo(
    () => new Set([...mixed].filter((k): k is BoxModelKey =>
      k === 'marginInlineStart' || k === 'marginInlineEnd' ||
      k === 'marginBlockStart'  || k === 'marginBlockEnd'  ||
      k === 'paddingInlineStart' || k === 'paddingInlineEnd' ||
      k === 'paddingBlockStart'  || k === 'paddingBlockEnd')),
    [mixed],
  )
  const mixedTypoKeys = useMemo(
    () => new Set([...mixed].filter((k): k is TypographyKey =>
      k === 'fontFamily' || k === 'fontWeight' || k === 'fontSize' || k === 'lineHeight')),
    [mixed],
  )
  const mixedA11yKeys = useMemo(
    () => new Set([...mixed].filter((k): k is A11yKey =>
      k === 'fgColor' || k === 'bgColor' || k === 'tabIndex' || k === 'ariaRole')),
    [mixed],
  )

  return (
    <aside
      role="complementary"
      aria-label="Property inspector"
      className="flex flex-col bg-ds-surface border-s border-ds-border shadow-xl"
      style={{ width: 320 }}
    >
      <header className="px-4 py-3 border-b border-ds-border">
        <h2 className="text-ds-xs uppercase tracking-wider text-ds-text-muted">
          Property inspector
        </h2>
        {selectedNode && (
          <p className="text-ds-sm font-semibold text-ds-text-primary truncate">
            {selectedNode.title}
          </p>
        )}
        {isMultiSelect && (
          <p className="text-ds-sm font-semibold text-ds-text-primary">
            (multiple selected)
          </p>
        )}
      </header>

      <div
        role="tablist"
        aria-label="Inspector sections"
        onKeyDown={onTabKeyDown}
        className="flex border-b border-ds-border"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[tab.id] = el }}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 py-2 text-ds-xs font-medium focus:outline-none focus:ring-2 focus:ring-ds-border-focus ${
                isActive
                  ? 'bg-ds-surface-elevated text-ds-text-primary border-b-2 border-ds-primary'
                  : 'text-ds-text-secondary hover:bg-ds-surface-hover'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isEmpty ? (
          <EmptyState />
        ) : (
          TABS.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`tabpanel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={tab.id !== activeTab}
            >
              {tab.id === 'css' && (
                <div className="flex flex-col gap-5">
                  <BoxModelFields
                    values={boxModel}
                    onChange={handleBoxModelChange}
                    rtlMode={rtlMode}
                    mixedKeys={mixedBoxKeys}
                  />
                  <TypographyFields
                    values={typography}
                    onChange={handleTypographyChange}
                    mixedKeys={mixedTypoKeys}
                  />
                </div>
              )}
              {tab.id === 'a11y' && (
                <A11yTab
                  values={a11y}
                  onChange={handleA11yChange}
                  mixedKeys={mixedA11yKeys}
                />
              )}
              {tab.id === 'layers'   && <Placeholder label="Layers tab" />}
              {tab.id === 'settings' && <Placeholder label="Settings tab" />}
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

function EmptyState() {
  return (
    <p
      role="status"
      className="text-ds-sm text-ds-text-muted text-center py-8"
    >
      Select a component to inspect
    </p>
  )
}

function Placeholder({ label }: { label: string }) {
  return (
    <p className="text-ds-xs text-ds-text-muted italic">
      {label} — coming soon.
    </p>
  )
}
