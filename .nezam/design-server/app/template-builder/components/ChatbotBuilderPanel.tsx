'use client'

import React, { useState, useRef } from 'react'
import { Bot, GripVertical, Upload, Copy, Send, CheckCircle, XCircle, Clock } from 'lucide-react'
import { PT, PanelHeader, PanelSection, PanelField, PanelInput, PanelToggle, PanelButton, PanelBadge } from './panel-primitives'

type NodeType = 'welcome' | 'intent' | 'fallback' | 'handoff' | 'close'

interface BotNode {
  id: string
  type: NodeType
  label: string
  message: string
}

const NODE_COLORS: Record<NodeType, string> = {
  welcome:  'var(--ds-primary)',
  intent:   '#a78bfa',
  fallback: '#f59e0b',
  handoff:  '#22c55e',
  close:    '#71717a',
}

const INITIAL_NODES: BotNode[] = [
  { id: 'n1', type: 'welcome',  label: 'Welcome',  message: 'Hi there! How can I help you today?' },
  { id: 'n2', type: 'intent',   label: 'Intent',   message: 'Let me look into that for you.' },
  { id: 'n3', type: 'fallback', label: 'Fallback', message: "I'm not sure about that. Let me connect you." },
  { id: 'n4', type: 'handoff',  label: 'Handoff',  message: 'Connecting you to a human agent now.' },
  { id: 'n5', type: 'close',    label: 'Close',    message: 'Thanks for reaching out! Have a great day.' },
]

type KBStatus = 'synced' | 'syncing' | 'error'

const KB_STATUS_ICON: Record<KBStatus, React.ReactNode> = {
  synced:  <CheckCircle size={10} style={{ color: '#22c55e' }} />,
  syncing: <Clock size={10} style={{ color: '#f59e0b' }} />,
  error:   <XCircle size={10} style={{ color: '#ef4444' }} />,
}

const MOCK_API_ENDPOINT = 'https://api.nezam.io/chatbot/v1/widget'
const MOCK_API_KEY = 'nzm_sk_' + 'a1b2c3d4e5f6'.repeat(2)
const SNIPPET = `<script src="https://cdn.nezam.io/chatbot.js"
  data-key="${MOCK_API_KEY}"
  data-theme="dark">
</script>`

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

export default function ChatbotBuilderPanel({ lang }: { lang: string }) {
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en
  const [nodes, setNodes] = useState<BotNode[]>(INITIAL_NODES)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [kbStatus, setKbStatus] = useState<KBStatus>('synced')
  const [kbChunks] = useState(248)
  const [privacy, setPrivacy] = useState(true)
  const [testInput, setTestInput] = useState('')
  const [testResponse, setTestResponse] = useState('')
  const [testing, setTesting] = useState(false)
  const [snippetCopied, setSnippetCopied] = useState(false)
  const [keyCopied, setKeyCopied] = useState(false)
  const dragOver = useRef<number | null>(null)

  function onDragStart(idx: number) { setDragIdx(idx) }
  function onDragEnter(idx: number) { dragOver.current = idx }
  function onDragEnd() {
    if (dragIdx !== null && dragOver.current !== null && dragIdx !== dragOver.current) {
      const next = [...nodes]
      const [moved] = next.splice(dragIdx, 1)
      next.splice(dragOver.current, 0, moved)
      setNodes(next)
    }
    setDragIdx(null)
    dragOver.current = null
  }

  async function runTest() {
    if (!testInput.trim() || testing) return
    setTesting(true)
    setTestResponse('')
    await new Promise(r => setTimeout(r, 600))
    const node = nodes.find(n => testInput.toLowerCase().includes(n.type)) ?? nodes[0]
    setTestResponse(node.message)
    setTesting(false)
  }

  function syncKB() {
    setKbStatus('syncing')
    setTimeout(() => setKbStatus('synced'), 1800)
  }

  function copySnippet() {
    copyToClipboard(SNIPPET)
    setSnippetCopied(true)
    setTimeout(() => setSnippetCopied(false), 2000)
  }
  function copyKey() {
    copyToClipboard(MOCK_API_KEY)
    setKeyCopied(true)
    setTimeout(() => setKeyCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PT.bg }}>
      <PanelHeader
        icon={<Bot size={12} />}
        title={t('Chatbot Builder', 'مُنشئ المحادثة')}
        subtitle={t('Flow · KB · Deploy', 'التدفق · قاعدة المعرفة · النشر')}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Node Flow */}
        <PanelSection title={t('Conversation Flow', 'تدفق المحادثة')} defaultOpen>
          <div className="space-y-1">
            {nodes.map((node, idx) => (
              <div
                key={node.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragEnter={() => onDragEnter(idx)}
                onDragEnd={onDragEnd}
                onDragOver={e => e.preventDefault()}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md border cursor-grab active:cursor-grabbing transition-colors"
                style={{
                  background: dragIdx === idx ? 'rgba(6,182,212,0.08)' : PT.surface,
                  borderColor: dragIdx === idx ? 'var(--ds-primary)' : PT.border,
                  opacity: dragIdx === idx ? 0.6 : 1,
                }}
              >
                <GripVertical size={10} style={{ color: PT.textMuted, flexShrink: 0 }} />
                <span className="w-1.5 h-4 rounded-sm shrink-0" style={{ background: NODE_COLORS[node.type] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium" style={{ color: PT.textPrimary }}>{node.label}</div>
                  <div className="text-[8px] truncate" style={{ color: PT.textMuted }}>{node.message}</div>
                </div>
                <span className="text-[8px] font-bold uppercase px-1.5 py-px rounded border"
                  style={{ color: NODE_COLORS[node.type], borderColor: NODE_COLORS[node.type] + '40', background: NODE_COLORS[node.type] + '15' }}>
                  {node.type}
                </span>
              </div>
            ))}
          </div>
        </PanelSection>

        {/* Knowledge Base */}
        <PanelSection title={t('Knowledge Base', 'قاعدة المعرفة')} defaultOpen={false}>
          <div className="flex items-center justify-between px-2.5 py-2 rounded-md border"
            style={{ background: PT.bgElevated, borderColor: PT.border }}>
            <div className="flex items-center gap-2">
              {KB_STATUS_ICON[kbStatus]}
              <div>
                <div className="text-[10px] font-medium" style={{ color: PT.textPrimary }}>
                  {kbChunks} {t('chunks indexed', 'جزء مُفهرس')}
                </div>
                <div className="text-[8px]" style={{ color: PT.textMuted }}>
                  {t('Last sync: 2 min ago', 'آخر مزامنة: منذ دقيقتين')}
                </div>
              </div>
            </div>
            <PanelButton size="xs" variant="ghost" icon={<Upload size={9} />} onClick={syncKB}>
              {kbStatus === 'syncing' ? t('Syncing…', 'مزامنة…') : t('Sync', 'مزامنة')}
            </PanelButton>
          </div>
          <PanelBadge color={kbStatus === 'synced' ? 'green' : kbStatus === 'error' ? 'red' : 'amber'}>
            {kbStatus}
          </PanelBadge>
        </PanelSection>

        {/* Live Test */}
        <PanelSection title={t('Live Test', 'اختبار مباشر')} defaultOpen={false}>
          <div className="space-y-2">
            <div className="flex gap-1.5">
              <PanelInput value={testInput} onChange={setTestInput} placeholder={t('Type a test message…', 'اكتب رسالة اختبار…')} />
              <button
                onClick={runTest}
                disabled={testing || !testInput.trim()}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md border transition-colors"
                style={{ background: 'var(--ds-primary)', borderColor: 'var(--ds-primary)', color: '#fff', opacity: !testInput.trim() ? 0.4 : 1 }}
                aria-label={t('Send test message', 'إرسال رسالة اختبار')}
              >
                <Send size={10} />
              </button>
            </div>
            {testResponse && (
              <div
                className="rounded-md border p-2.5 text-[10px] leading-relaxed"
                style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary }}
                aria-live="polite"
              >
                <span className="text-[8px] font-bold block mb-1" style={{ color: PT.textLabel }}>
                  {t('Bot response', 'رد الروبوت')}
                </span>
                {testResponse}
              </div>
            )}
          </div>
        </PanelSection>

        {/* Deploy */}
        <PanelSection title={t('Deploy', 'النشر')} defaultOpen={false}>
          <PanelField label={t('API Endpoint', 'نقطة API')} row={false}>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[9px] font-mono"
              style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textMuted }}>
              {MOCK_API_ENDPOINT}
            </div>
          </PanelField>

          <PanelField label={t('API Key', 'مفتاح API')} row={false}>
            <div className="flex gap-1.5">
              <div className="flex-1 flex items-center px-2.5 py-1.5 rounded-md border text-[9px] font-mono overflow-hidden"
                style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textMuted }}>
                <span className="truncate">{MOCK_API_KEY.slice(0, 20)}…</span>
              </div>
              <PanelButton size="xs" variant="ghost" icon={<Copy size={9} />} onClick={copyKey}>
                {keyCopied ? '✓' : t('Copy', 'نسخ')}
              </PanelButton>
            </div>
          </PanelField>

          <PanelField label={t('JS Snippet', 'كود JS')} row={false}>
            <pre className="text-[8px] font-mono leading-relaxed rounded-md border p-2 overflow-x-auto"
              style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textSecondary }}>
              {SNIPPET}
            </pre>
            <PanelButton size="xs" variant="ghost" fullWidth icon={<Copy size={9} />} onClick={copySnippet}>
              {snippetCopied ? t('Copied ✓', 'تم النسخ ✓') : t('Copy Snippet', 'نسخ الكود')}
            </PanelButton>
          </PanelField>

          <PanelToggle
            label={t('Privacy Disclaimer', 'إخلاء مسؤولية الخصوصية')}
            desc={t('Show data collection notice to users', 'إظهار إشعار جمع البيانات للمستخدمين')}
            checked={privacy}
            onChange={setPrivacy}
          />
        </PanelSection>
      </div>
    </div>
  )
}
