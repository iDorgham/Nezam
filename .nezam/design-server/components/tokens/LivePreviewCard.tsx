'use client'

import React from 'react'

export default function LivePreviewCard() {
  return (
    <div 
      className="border rounded-lg p-6 space-y-4 shadow-sm"
      style={{ 
        backgroundColor: 'var(--ds-background)', 
        borderColor: 'var(--ds-border)',
        color: 'var(--ds-text-primary)',
        fontFamily: 'var(--ds-font-body)'
      }}
    >
      <div className="space-y-1">
        <h2 
          style={{ 
            fontFamily: 'var(--ds-font-heading)', 
            fontSize: 'var(--ds-text-xl)',
            fontWeight: 'bold',
            color: 'var(--ds-text-primary)'
          }}
        >
          Live Preview Component
        </h2>
        <p style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-muted)' }}>
          This card updates in real-time as you tweak tokens.
        </p>
      </div>

      <div 
        className="p-4 rounded border"
        style={{ backgroundColor: 'var(--ds-surface)', borderColor: 'var(--ds-border)' }}
      >
        <p style={{ fontSize: 'var(--ds-text-md)' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
        </p>
      </div>

      <div className="flex space-x-2">
        <button 
          className="px-4 py-2 rounded font-medium text-sm transition-colors"
          style={{ 
            backgroundColor: 'var(--ds-primary)', 
            color: '#ffffff' // Assuming text on primary is white for now
          }}
        >
          Primary Action
        </button>
        <button 
          className="px-4 py-2 rounded font-medium text-sm border transition-colors"
          style={{ 
            backgroundColor: 'transparent', 
            borderColor: 'var(--ds-border)',
            color: 'var(--ds-text-primary)'
          }}
        >
          Secondary
        </button>
      </div>
    </div>
  )
}
