'use client'

import React, { useEffect, useState, use } from 'react'
import TerminalFrame from '@/components/tui/TerminalFrame'

export default function TUIPage({ params }: { params: Promise<{ page_id: string }> }) {
  const { page_id } = use(params)
  const [tuiText, setTuiText] = useState('Loading TUI...')

  useEffect(() => {
    async function fetchTUI() {
      const res = await fetch(`/api/tui/${page_id}`)
      if (res.ok) {
        const text = await res.text()
        setTuiText(text)
      } else {
        setTuiText('Failed to load TUI.')
      }
    }
    fetchTUI()
  }, [page_id])

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">TUI Preview</h1>
      <p className="text-sm text-ds-text-muted">This is the terminal representation of the page.</p>
      
      <TerminalFrame title={`tui-preview — ${page_id}`}>
        <pre className="whitespace-pre">{tuiText}</pre>
      </TerminalFrame>
    </div>
  )
}
