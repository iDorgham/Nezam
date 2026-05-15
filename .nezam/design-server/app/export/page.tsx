'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { FileText, Download, CheckCircle } from 'lucide-react'

export default function ExportPage() {
  const { sitemap, templateConfig, addLog } = useSessionStore()

  const handleExport = async () => {
    try {
      const res = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: `nezam-cli contract export --output ./locked_contract.json` })
      })
      if (res.ok) {
        const data = await res.json()
        addLog(data.output)
      }
    } catch (e) {
      console.error('Failed to run silent CLI', e)
    }
  }

  return (
    <div className="p-4 w-full space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-white flex items-center gap-1.5">
          <FileText className="w-5 h-5 text-[#FF5701]" />
          Lock & Export Contract
        </h1>
        <p className="text-[#8a8f98] text-xs mt-0.5">Finalize your design decisions and generate the SDD contract.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Summary Card */}
        <div className="p-3 bg-[#0f1011] border border-[#ffffff14] rounded space-y-3">
          <h2 className="text-sm font-medium text-white flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Design Summary
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8a8f98]">Pages Defined:</span>
              <span className="text-white font-medium">{sitemap.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8f98]">Theme Profile:</span>
              <span className="text-white font-medium">{templateConfig.colorProfile || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8f98]">Typography:</span>
              <span className="text-white font-medium">{templateConfig.typography}</span>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="p-3 bg-[#0f1011] border border-[#ffffff14] rounded flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-medium text-white mb-1">Ready to build?</h2>
            <p className="text-[10px] text-[#8a8f98]">Exporting will lock these settings and notify the NEZAM swarm agents to begin development.</p>
          </div>
          <button
            onClick={handleExport}
            className="w-full mt-3 px-3 py-1.5 bg-[#FF5701] text-white text-xs font-medium rounded hover:bg-[#e04e00] transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Generate Contract
          </button>
        </div>
      </div>
    </div>
  )
}
