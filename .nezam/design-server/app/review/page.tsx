'use client'

import React, { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { useTokensStore } from '@/lib/store/tokens.store'
import CompletionMatrix from '@/components/review/CompletionMatrix'
import LockingModal from '@/components/review/LockingModal'

export default function ReviewPage() {
  const { sitemap } = useSessionStore()
  const { tokens } = useTokensStore()
  const [showModal, setShowModal] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [message, setMessage] = useState('')

  const handleConfirmLock = async () => {
    setShowModal(false)
    try {
      const res = await fetch('/api/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens, sitemap })
      })
      
      const data = await res.json()
      if (data.success) {
        setIsLocked(true)
        setMessage(data.message)
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Review & Locking Gateway</h1>
          <p className="text-sm text-ds-text-muted">Verify all criteria are met before locking the design.</p>
        </div>
      </div>

      <CompletionMatrix />

      {message && (
        <div className={`p-4 rounded-lg text-sm ${
          isLocked ? 'bg-[#10b98110] border border-[#10b98124] text-[#10b981]' : 'bg-[#dc262610] border border-[#dc262624] text-[#ef4444]'
        }`}>
          {message}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={() => setShowModal(true)}
          disabled={isLocked}
          className={`px-6 py-3 rounded font-medium text-sm transition-colors ${
            isLocked
              ? 'bg-[#191a1b] text-ds-text-muted cursor-default'
              : 'bg-[#5e6ad2] text-white hover:bg-[#7170ff]'
          }`}
        >
          {isLocked ? 'Design Locked' : 'Lock & Export Contract'}
        </button>
      </div>

      {showModal && (
        <LockingModal
          onConfirm={handleConfirmLock}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
