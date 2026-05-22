'use client'

import React, { useState } from 'react'
import { Type, Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight, Copy, Clock, RotateCcw, Sparkles } from 'lucide-react'
import { PT, PanelHeader, PanelSection, PanelButton } from './panel-primitives'

type BlockType = 'h1' | 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'blockquote' | 'code' | 'divider'

interface Block {
  id: string
  type: BlockType
  content: string
}

const BLOCK_OPTS: { type: BlockType; label: string }[] = [
  { type: 'h1', label: 'H1' }, { type: 'h2', label: 'H2' }, { type: 'h3', label: 'H3' },
  { type: 'p', label: 'P' }, { type: 'ul', label: 'UL' }, { type: 'ol', label: 'OL' },
  { type: 'blockquote', label: 'BQ' }, { type: 'code', label: '</>' }, { type: 'divider', label: '—' },
]

interface HistoryEntry {
  blocks: Block[]
  savedAt: string
}

const INITIAL_BLOCKS: Block[] = [
  { id: '1', type: 'h1', content: 'Getting Started with NEZAM' },
  { id: '2', type: 'p', content: 'Welcome to the most powerful design system in the Arab tech ecosystem.' },
  { id: '3', type: 'h2', content: 'Quick Setup' },
  { id: '4', type: 'ul', content: 'Install dependencies\nConfigure tokens\nLaunch dev server' },
]

const BLOCK_STYLES: Record<BlockType, string> = {
  h1: 'text-[16px] font-bold',
  h2: 'text-[13px] font-bold',
  h3: 'text-[11px] font-bold',
  p: 'text-[10px]',
  ul: 'text-[10px] list-disc list-inside',
  ol: 'text-[10px] list-decimal list-inside',
  blockquote: 'text-[10px] italic border-s-2 ps-2',
  code: 'text-[9px] font-mono',
  divider: 'text-center text-[8px]',
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

function blocksToMarkdown(blocks: Block[]) {
  return blocks.map(b => {
    if (b.type === 'h1') return `# ${b.content}`
    if (b.type === 'h2') return `## ${b.content}`
    if (b.type === 'h3') return `### ${b.content}`
    if (b.type === 'ul') return b.content.split('\n').map(l => `- ${l}`).join('\n')
    if (b.type === 'ol') return b.content.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n')
    if (b.type === 'blockquote') return `> ${b.content}`
    if (b.type === 'code') return `\`\`\`\n${b.content}\n\`\`\``
    if (b.type === 'divider') return '---'
    return b.content
  }).join('\n\n')
}

export default function RichTextEditorPanel({ lang }: { lang: string }) {
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS)
  const [activeId, setActiveId] = useState<string | null>('1')
  const [showHistory, setShowHistory] = useState(false)
  const [versionHistory] = useState<HistoryEntry[]>([
    { blocks: INITIAL_BLOCKS, savedAt: '2 min ago' },
    { blocks: INITIAL_BLOCKS.slice(0, 2), savedAt: '15 min ago' },
    { blocks: [INITIAL_BLOCKS[0]], savedAt: '1 hr ago' },
  ])
  const [aiAction, setAiAction] = useState<string | null>(null)

  function updateBlock(id: string, content: string) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b))
  }

  function addBlock(type: BlockType) {
    const newBlock: Block = { id: Date.now().toString(), type, content: type === 'divider' ? '—' : '' }
    setBlocks(prev => [...prev, newBlock])
    setActiveId(newBlock.id)
  }

  async function runAiAction(action: string) {
    setAiAction(action)
    await new Promise(r => setTimeout(r, 900))
    setAiAction(null)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PT.bg }}>
      <PanelHeader
        icon={<Type size={12} />}
        title={t('Rich Text Editor', 'محرر النص الغني')}
        subtitle={t('Blocks · AI · Export', 'الكتل · الذكاء الاصطناعي · التصدير')}
        actions={
          <button
            onClick={() => setShowHistory(v => !v)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/[0.06] transition-colors"
            style={{ color: showHistory ? 'var(--ds-primary)' : PT.textMuted }}
            title={t('Version history', 'سجل الإصدارات')}
            aria-label={t('Toggle version history', 'تبديل سجل الإصدارات')}
          >
            <Clock size={11} />
          </button>
        }
      />

      {/* Toolbar */}
      <div className="shrink-0 border-b px-2 py-1 flex flex-wrap items-center gap-0.5" style={{ borderColor: PT.border }}>
        {[
          { icon: <Bold size={10} />, label: 'Bold' },
          { icon: <Italic size={10} />, label: 'Italic' },
          { icon: <Underline size={10} />, label: 'Underline' },
          { icon: <Link size={10} />, label: 'Link' },
        ].map(({ icon, label }) => (
          <button key={label}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/[0.06] transition-colors"
            style={{ color: PT.textMuted }}
            title={label} aria-label={label}>
            {icon}
          </button>
        ))}
        <div className="w-px h-4 mx-0.5" style={{ background: PT.border }} />
        {[
          { icon: <AlignLeft size={10} />, label: 'Align Left' },
          { icon: <AlignCenter size={10} />, label: 'Align Center' },
          { icon: <AlignRight size={10} />, label: 'Align Right' },
        ].map(({ icon, label }) => (
          <button key={label}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/[0.06] transition-colors"
            style={{ color: PT.textMuted }}
            title={label} aria-label={label}>
            {icon}
          </button>
        ))}
      </div>

      {/* AI toolbar */}
      <div className="shrink-0 border-b px-2 py-1 flex items-center gap-1" style={{ borderColor: PT.border, background: 'rgba(6,182,212,0.04)' }}>
        <Sparkles size={9} style={{ color: 'var(--ds-primary)', flexShrink: 0 }} />
        {['Continue', 'Summarize', 'Rewrite', 'SEO Optimize'].map(action => (
          <button
            key={action}
            onClick={() => runAiAction(action)}
            disabled={!!aiAction}
            className="px-2 py-0.5 text-[8px] font-medium rounded border transition-colors disabled:opacity-50"
            style={{ color: 'var(--ds-primary)', borderColor: 'rgba(6,182,212,0.25)', background: 'rgba(6,182,212,0.06)' }}
          >
            {aiAction === action ? '…' : t(action, action)}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {showHistory ? (
          /* Version history slide-over */
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold" style={{ color: PT.textPrimary }}>
                {t('Version History', 'سجل الإصدارات')}
              </span>
              <button onClick={() => setShowHistory(false)} className="text-[9px]" style={{ color: PT.textMuted }}>
                {t('Close', 'إغلاق')}
              </button>
            </div>
            {versionHistory.map((entry, i) => (
              <div key={i} className="flex items-center justify-between px-2.5 py-2 rounded-md border"
                style={{ background: PT.surface, borderColor: PT.border }}>
                <div>
                  <div className="text-[9px] font-medium" style={{ color: PT.textPrimary }}>
                    {t('Version', 'إصدار')} {versionHistory.length - i}
                  </div>
                  <div className="text-[8px]" style={{ color: PT.textMuted }}>
                    {entry.savedAt} · {entry.blocks.length} {t('blocks', 'كتل')}
                  </div>
                </div>
                <PanelButton size="xs" variant="ghost" icon={<RotateCcw size={9} />}
                  onClick={() => { setBlocks(entry.blocks); setShowHistory(false) }}>
                  {t('Restore', 'استعادة')}
                </PanelButton>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Block picker */}
            <div className="shrink-0 border-b px-2 py-1 flex flex-wrap gap-1" style={{ borderColor: PT.border }}>
              {BLOCK_OPTS.map(opt => (
                <button
                  key={opt.type}
                  onClick={() => addBlock(opt.type)}
                  className="px-1.5 py-0.5 text-[8px] font-bold rounded border transition-colors hover:bg-white/[0.04]"
                  style={{ borderColor: PT.border, color: PT.textLabel, background: PT.surface }}
                  title={`Add ${opt.type} block`}
                  aria-label={`Add ${opt.type} block`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Block editor */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {blocks.map(block => (
                <div key={block.id}
                  className="rounded-md border px-2 py-1.5 transition-colors cursor-text"
                  style={{
                    background: activeId === block.id ? PT.bgHover : PT.surface,
                    borderColor: activeId === block.id ? 'var(--ds-primary)' : PT.border,
                  }}
                  onClick={() => setActiveId(block.id)}>
                  {block.type === 'divider' ? (
                    <div className="h-px w-full" style={{ background: PT.border }} />
                  ) : (
                    <textarea
                      value={block.content}
                      onChange={e => updateBlock(block.id, e.target.value)}
                      className={`w-full bg-transparent outline-none resize-none leading-relaxed ${BLOCK_STYLES[block.type]}`}
                      style={{
                        color: PT.textPrimary,
                        borderInlineStart: block.type === 'blockquote' ? `2px solid ${PT.border}` : undefined,
                        fontFamily: block.type === 'code' ? 'ui-monospace, monospace' : undefined,
                        background: block.type === 'code' ? PT.bgElevated : undefined,
                      }}
                      rows={block.content.split('\n').length || 1}
                      aria-label={`Edit ${block.type} block`}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Export footer */}
      <div className="shrink-0 px-2 py-1.5 border-t flex items-center gap-1" style={{ borderColor: PT.border }}>
        <span className="text-[8px] me-1" style={{ color: PT.textLabel }}>{t('Export:', 'تصدير:')}</span>
        {['Markdown', 'HTML', 'JSON'].map(fmt => (
          <PanelButton key={fmt} size="xs" variant="ghost" icon={<Copy size={8} />}
            onClick={() => {
              if (fmt === 'Markdown') copyToClipboard(blocksToMarkdown(blocks))
              else if (fmt === 'JSON') copyToClipboard(JSON.stringify(blocks, null, 2))
              else copyToClipboard(blocks.map(b => `<${b.type}>${b.content}</${b.type}>`).join('\n'))
            }}>
            {fmt}
          </PanelButton>
        ))}
      </div>
    </div>
  )
}
