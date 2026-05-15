'use client'

import React, { useState, useEffect } from 'react'

interface LockingModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export default function LockingModal({ onConfirm, onCancel }: LockingModalProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f1011] border border-[#ffffff14] rounded-lg max-w-md w-full p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Lock & Export Design</h2>
          <p className="text-sm text-ds-text-muted">
            This will generate `DESIGN.md` and lock your wireframes. This action is final and will commit the changes to Git.
          </p>
        </div>

        <div className="bg-[#dc262610] border border-[#dc262624] p-4 rounded-lg text-sm text-[#ef4444]">
          Warning: Ensure all stakeholders have reviewed the wireframes before proceeding.
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-ds-text-muted hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={countdown > 0}
            className={`px-4 py-2 text-sm rounded font-medium transition-colors ${
              countdown > 0
                ? 'bg-[#191a1b] text-ds-text-muted cursor-not-allowed'
                : 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
            }`}
          >
            {countdown > 0 ? `Wait (${countdown}s)` : 'Confirm Lock & Export'}
          </button>
        </div>
      </div>
    </div>
  )
}
