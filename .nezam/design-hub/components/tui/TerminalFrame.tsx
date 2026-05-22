'use client'

import React from 'react'

interface TerminalFrameProps {
  children: React.ReactNode
  title?: string
}

export default function TerminalFrame({ children, title = 'bash' }: TerminalFrameProps) {
  return (
    <div className="bg-[#08090a] border border-[#ffffff14] rounded-lg overflow-hidden shadow-2xl">
      {/* Window Header */}
      <div className="bg-[#0f1011] border-b border-[#ffffff05] px-4 py-2 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#ff5f56] rounded-full"></div>
          <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
          <div className="w-3 h-3 bg-[#27c93f] rounded-full"></div>
        </div>
        <div className="text-xs text-ds-text-muted font-mono">{title}</div>
        <div className="w-12"></div> {/* Spacer to center title */}
      </div>
      
      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm text-[#00ff00] overflow-auto max-h-[500px]">
        {children}
      </div>
    </div>
  )
}
