'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

interface AICommandBarProps {
  onBlocksGenerated: (blocks: any[]) => void
}

export default function AICommandBar({ onBlocksGenerated }: AICommandBarProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (res.ok) {
        const data = await res.json()
        onBlocksGenerated(data.blocks || [])
        setPrompt('')
      } else {
        alert('Failed to generate blocks')
      }
    } catch (error) {
      console.error('AI Generation error:', error)
      alert('An error occurred during generation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Ask Gemini to generate blocks... (e.g., 'Add a pricing section')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full bg-ds-surface border border-ds-border rounded-lg pl-10 pr-12 py-3 text-ds-text-primary focus:border-[#FF5701] focus:outline-none focus:ring-1 focus:ring-[#FF5701] transition-all"
        disabled={isLoading}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8a8f98]">
        <Sparkles size={18} />
      </div>
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-[#5e6ad2] text-white rounded text-sm hover:bg-[#7170ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          'Generate'
        )}
      </button>
    </form>
  )
}
