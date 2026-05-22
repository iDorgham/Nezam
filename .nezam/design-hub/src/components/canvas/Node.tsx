'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { useHub } from '@/store/hub.store'
import type { NodeRole, NodeStyle } from '@/types'
import { cn } from '@/lib/cn'

interface NodeProps {
  id: string
  blockId: string
  label: string
  role: NodeRole
  /** Inline-editable text. When true, double-click turns the node into a text input. */
  editable?: boolean
  /** Default text shown when no content override exists. */
  fallback?: string
  /** Base font size used by the curated `fontScale` multiplier. */
  baseFontSize?: string
  /** Wrapping element tag. */
  as?: 'div' | 'span' | 'section' | 'article' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'button' | 'a' | 'li' | 'ul' | 'footer' | 'nav'
  className?: string
  style?: CSSProperties
  children?: ReactNode
  /** Optional override for the GSAP timeline data-anim key. Defaults to role. */
  animKey?: string
  /** Click should select the parent block (section) instead of this node. */
  selectsSection?: boolean
}

/**
 * The editable + selectable primitive. Wraps any node in the preview scene
 * with selection, inline text editing, comment-pin anchoring, and live styling.
 */
export function Node({
  id,
  blockId,
  label,
  role,
  editable,
  fallback,
  baseFontSize,
  as = 'div',
  className,
  style,
  children,
  animKey,
  selectsSection,
}: NodeProps) {
  const selection = useHub((s) => s.selection)
  const select = useHub((s) => s.select)
  const tool = useHub((s) => s.activeTool)
  const nodeStyle = useHub((s) => s.nodeStyles[id])
  const content = useHub((s) => s.contentOverrides[id])
  const editingId = useHub((s) => s.editingNodeId)
  const beginEdit = useHub((s) => s.beginEdit)
  const endEdit = useHub((s) => s.endEdit)
  const setContent = useHub((s) => s.setContent)
  const addComment = useHub((s) => s.addComment)
  const setBuilderMode = useHub((s) => s.setBuilderMode)
  const setTool = useHub((s) => s.setTool)

  const editing = editingId === id

  const targetId = selectsSection ? blockId : id
  const selectedHere =
    selection?.scope === (selectsSection ? 'section' : 'element') &&
    (selectsSection ? selection?.blockId : selection?.nodeId) === targetId

  const isAddTool =
    tool === 'text' || tool === 'paragraph' || tool === 'image' || tool === 'icon' || tool === 'section'
  const ignoreClick = tool === 'hand' || isAddTool

  const handleClick = (e: React.MouseEvent) => {
    if (ignoreClick) return
    e.stopPropagation()
    if (tool === 'comment') {
      addComment(targetId, blockId, label)
      setBuilderMode('comments')
      select({
        scope: selectsSection ? 'section' : 'element',
        blockId,
        nodeId: targetId,
        label,
        role,
      })
      return
    }
    select(
      selectedHere
        ? null
        : {
            scope: selectsSection ? 'section' : 'element',
            blockId,
            nodeId: targetId,
            label,
            role,
          },
    )
  }

  const handleDouble = (e: React.MouseEvent) => {
    if (!editable || ignoreClick) return
    e.stopPropagation()
    beginEdit(id)
  }

  const mergedStyle = combineStyle(style, nodeStyle, baseFontSize)

  // Editable rendering — contentEditable when actively editing.
  if (editable) {
    const text = content ?? fallback ?? ''
    return (
      <EditableText
        as={as}
        id={id}
        text={text}
        editing={editing}
        onCommit={(t) => {
          setContent(id, t)
          endEdit()
        }}
        onCancel={endEdit}
        onClick={handleClick}
        onDoubleClick={handleDouble}
        className={cn('n-pick', className)}
        style={mergedStyle}
        dataAnim={animKey ?? role}
        dataNode={id}
        dataSelected={selectedHere}
      />
    )
  }

  const Comp = (as ?? 'div') as React.ElementType
  return (
    <Comp
      data-anim={animKey ?? role}
      data-node={id}
      data-selected={selectedHere}
      className={cn('n-pick', className)}
      style={mergedStyle}
      onClick={handleClick}
      onDoubleClick={handleDouble}
    >
      {children}
    </Comp>
  )
}

/* ── editable text element ──────────────────────────────────── */

function EditableText({
  as,
  id,
  text,
  editing,
  onCommit,
  onCancel,
  onClick,
  onDoubleClick,
  className,
  style,
  dataAnim,
  dataNode,
  dataSelected,
}: {
  as: NodeProps['as']
  id: string
  text: string
  editing: boolean
  onCommit: (t: string) => void
  onCancel: () => void
  onClick: (e: React.MouseEvent) => void
  onDoubleClick: (e: React.MouseEvent) => void
  className?: string
  style?: CSSProperties
  dataAnim?: string
  dataNode?: string
  dataSelected?: boolean
}) {
  const ref = useRef<HTMLElement>(null)

  // Focus + caret on enter-edit.
  useEffect(() => {
    if (!editing) return
    const el = ref.current
    if (!el) return
    el.textContent = text
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [editing, text])

  const onBlur = () => {
    if (!editing) return
    const next = ref.current?.textContent ?? ''
    if (next === text) onCancel()
    else onCommit(next)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).blur()
    }
  }

  const Comp = (as ?? 'div') as React.ElementType
  return (
    <Comp
      ref={ref as never}
      data-anim={dataAnim}
      data-node={dataNode}
      data-selected={dataSelected}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={editing}
      className={className}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      {editing ? null : text}
    </Comp>
  )
}

/* ── style merging ──────────────────────────────────────────── */

function combineStyle(
  inline: CSSProperties | undefined,
  ns: NodeStyle | undefined,
  baseFontSize: string | undefined,
): CSSProperties {
  const out: CSSProperties = { ...(inline ?? {}) }
  if (!ns) return out

  // typography
  if (ns.fontFamily) out.fontFamily = ns.fontFamily
  if (ns.fontScale != null && ns.fontScale !== 1 && baseFontSize) {
    out.fontSize = `calc(${baseFontSize} * ${ns.fontScale})`
  }
  if (ns.weight != null) out.fontWeight = ns.weight
  if (ns.align) out.textAlign = ns.align
  if (ns.letterSpacing != null) out.letterSpacing = `${ns.letterSpacing}em`
  if (ns.lineHeight != null) out.lineHeight = ns.lineHeight
  if (ns.textColor) out.color = ns.textColor
  if (ns.textTransform) out.textTransform = ns.textTransform
  if (ns.textDecoration) out.textDecoration = ns.textDecoration

  // fill / background
  if (ns.bgFill === 'gradient') {
    out.background = `linear-gradient(135deg, ${ns.bg ?? 'var(--n-surface)'}, ${ns.bgTo ?? ns.bg ?? 'var(--n-surface)'})`
  } else if (ns.bgFill === 'image' && ns.bgImage) {
    out.backgroundImage = `url("${ns.bgImage}")`
    out.backgroundSize = 'cover'
    out.backgroundPosition = 'center'
    if (ns.bgScroll === 'fixed') out.backgroundAttachment = 'fixed'
  } else if (ns.bg) {
    out.background = ns.bg
  }

  // box
  if (ns.padding != null) out.padding = ns.padding
  if (ns.margin != null) out.margin = ns.margin
  if (ns.gap != null) out.gap = ns.gap
  if (ns.minHeight != null) out.minHeight = ns.minHeight
  if (ns.radius != null) out.borderRadius = ns.radius
  if (ns.borderWidth != null) out.borderWidth = ns.borderWidth
  if (ns.borderColor != null) out.borderColor = ns.borderColor
  if (ns.opacity != null) out.opacity = ns.opacity

  // raw escape hatch — last so it overrides anything above
  if (ns.css) {
    for (const [k, v] of Object.entries(ns.css)) {
      const key = k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) as keyof CSSProperties
      ;(out as Record<string, string>)[key as string] = v
    }
  }

  return out
}
