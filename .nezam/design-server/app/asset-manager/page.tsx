'use client'

import React from 'react'

export default function AssetManagerPage() {
  return (
    <div className="h-full flex flex-col bg-ds-surface text-ds-text-primary p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Asset Manager</h1>
      </div>

      <div className="flex-1 bg-black/20 rounded-lg border border-ds-border p-6">
        <div className="text-ds-text-muted">Images and media assets will be managed here.</div>
      </div>
    </div>
  )
}
