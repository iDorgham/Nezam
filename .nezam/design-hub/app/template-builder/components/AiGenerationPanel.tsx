'use client'

import React, { useState, useRef } from 'react'
import { Sparkles, Copy, BookMarked, ArrowRight, StopCircle, AlertTriangle } from 'lucide-react'
import { PT, PanelHeader, PanelSection, PanelField, PanelTextarea, PanelSelect, PanelButton, PanelToggle } from './panel-primitives'

const TEMPLATE_OPTS = [
  { value: 'blog',    label: 'Blog Post' },
  { value: 'product', label: 'Product Page' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'email',   label: 'Email Campaign' },
]
const TONE_OPTS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual',       label: 'Casual' },
  { value: 'friendly',     label: 'Friendly' },
  { value: 'formal',       label: 'Formal' },
]
const LENGTH_OPTS = [
  { value: 'short',  label: 'Short (~150w)' },
  { value: 'medium', label: 'Medium (~400w)' },
  { value: 'long',   label: 'Long (~800w)' },
]
const MODEL_OPTS = [
  { value: 'anthropic/claude-haiku-4.5', label: 'Claude Haiku 4.5 (fast)' },
  { value: 'google/gemini-2.5-flash',    label: 'Gemini 2.5 Flash' },
]

const BLOCKED_KEYWORDS = ['spam', 'scam', 'illegal', 'malware', 'phishing']

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

export default function AiGenerationPanel({ lang }: { lang: string }) {
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  const [template, setTemplate] = useState('blog')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [model, setModel] = useState('anthropic/claude-haiku-4.5')
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [savedToLibrary, setSavedToLibrary] = useState(false)
  const [insertedToPage, setInsertedToPage] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  async function generate() {
    if (!prompt.trim() || streaming) return
    const lower = prompt.toLowerCase()
    if (BLOCKED_KEYWORDS.some(kw => lower.includes(kw))) {
      setBlocked(true)
      return
    }
    setBlocked(false)
    setOutput('')
    setStreaming(true)

    const fullPrompt = `Write a ${length} ${template} with a ${tone} tone.\n\n${prompt}`

    abortRef.current = new AbortController()
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, model }),
        signal: abortRef.current.signal,
      })
      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: d } = await reader.read()
        done = d
        if (value) setOutput(prev => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setOutput(t('Generation failed. Please try again.', 'فشل التوليد. الرجاء المحاولة مرة أخرى.'))
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  function stop() {
    abortRef.current?.abort()
    setStreaming(false)
  }

  function saveToLibrary() {
    setSavedToLibrary(true)
    setTimeout(() => setSavedToLibrary(false), 2000)
  }

  function insertToPage() {
    setInsertedToPage(true)
    setTimeout(() => setInsertedToPage(false), 2000)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PT.bg }}>
      <PanelHeader
        icon={<Sparkles size={12} />}
        title={t('AI Generation', 'توليد الذكاء الاصطناعي')}
        subtitle={t('Content · Copy · SEO', 'محتوى · نصوص · SEO')}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Template */}
        <PanelSection title={t('Template', 'القالب')} defaultOpen>
          <div className="grid grid-cols-2 gap-1">
            {TEMPLATE_OPTS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTemplate(opt.value)}
                className="px-2 py-1.5 rounded-md border text-[9px] font-medium transition-all"
                style={{
                  background: template === opt.value ? 'rgba(6,182,212,0.12)' : PT.surface,
                  borderColor: template === opt.value ? 'var(--ds-primary)' : PT.border,
                  color: template === opt.value ? 'var(--ds-primary)' : PT.textSecondary,
                }}
                aria-pressed={template === opt.value}
              >
                {t(opt.label, opt.label)}
              </button>
            ))}
          </div>
        </PanelSection>

        {/* Options */}
        <PanelSection title={t('Options', 'الخيارات')} defaultOpen>
          <PanelField label={t('Tone', 'النبرة')} row={false}>
            <PanelSelect value={tone} onChange={setTone} options={TONE_OPTS} />
          </PanelField>
          <PanelField label={t('Length', 'الطول')} row={false}>
            <PanelSelect value={length} onChange={setLength} options={LENGTH_OPTS} />
          </PanelField>
          <PanelField label={t('Model', 'النموذج')} row={false}>
            <PanelSelect value={model} onChange={setModel} options={MODEL_OPTS} />
          </PanelField>
        </PanelSection>

        {/* Prompt */}
        <PanelSection title={t('Prompt', 'الطلب')} defaultOpen>
          <PanelTextarea
            value={prompt}
            onChange={v => { setPrompt(v); setBlocked(false) }}
            placeholder={t('Describe what you want to generate…', 'صف ما تريد توليده…')}
            rows={4}
          />
          {streaming ? (
            <PanelButton variant="danger" size="sm" fullWidth icon={<StopCircle size={10} />} onClick={stop}>
              {t('Stop', 'إيقاف')}
            </PanelButton>
          ) : (
            <PanelButton
              variant="primary" size="sm" fullWidth
              icon={<ArrowRight size={10} />}
              onClick={generate}
            >
              {t('Generate', 'توليد')}
            </PanelButton>
          )}
        </PanelSection>

        {/* Blocked state */}
        {blocked && (
          <div className="mx-3 mb-3 flex items-start gap-2 px-3 py-2.5 rounded-md border"
            style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)', color: '#f59e0b' }}>
            <AlertTriangle size={12} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] font-bold">{t('Blocked', 'محظور')}</p>
              <p className="text-[8px] mt-0.5" style={{ color: PT.textMuted }}>
                {t('Prompt contains restricted content.', 'يحتوي الطلب على محتوى محظور.')}
              </p>
            </div>
          </div>
        )}

        {/* Output */}
        {(output || streaming) && (
          <PanelSection title={t('Output', 'الناتج')} defaultOpen>
            <div
              className="rounded-md border p-2.5 text-[10px] leading-relaxed whitespace-pre-wrap min-h-[60px]"
              style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textPrimary }}
            >
              {output}
              {streaming && (
                <span className="inline-block w-1.5 h-3 rounded-sm animate-pulse ml-0.5" style={{ background: 'var(--ds-primary)' }} />
              )}
            </div>

            {!streaming && output && (
              <div className="flex gap-1.5 mt-2">
                <PanelButton size="xs" variant="ghost" icon={<Copy size={9} />} onClick={() => copyToClipboard(output)}>
                  {t('Copy', 'نسخ')}
                </PanelButton>
                <PanelButton size="xs" variant="ghost" icon={<BookMarked size={9} />} onClick={saveToLibrary}>
                  {savedToLibrary ? t('Saved ✓', 'محفوظ ✓') : t('Save', 'حفظ')}
                </PanelButton>
                <PanelButton size="xs" variant="primary" icon={<ArrowRight size={9} />} onClick={insertToPage}>
                  {insertedToPage ? t('Inserted ✓', 'أُدرج ✓') : t('Insert', 'إدراج')}
                </PanelButton>
              </div>
            )}
          </PanelSection>
        )}
      </div>
    </div>
  )
}
