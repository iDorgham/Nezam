'use client'

import React from 'react'
import type { ParsedProfile } from '@/lib/parsers/profile.parser'
import { useSessionStore } from '@/lib/store/session.store'

interface ProfileCardProps {
  profile: ParsedProfile
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
}

export default function ProfileCard({ profile, isSelected, onSelect, onPreview }: ProfileCardProps) {
  const visualColors = [
    profile.colorProfile?.primary || '#FF5701',
    profile.colorProfile?.surface || '#0F111A',
    profile.colorProfile?.background || '#090A0F'
  ]

  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <div className={`bg-ds-surface border ${
      isSelected ? 'border-ds-primary' : 'border-ds-border'
    } rounded-xl overflow-hidden flex flex-col hover:border-ds-border/50 transition-colors`}>
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-ds-text-primary">{profile.name}</h3>
          <span className="text-xs bg-ds-background px-2 py-0.5 rounded text-ds-text-muted">
            {profile.category}
          </span>
        </div>
        <p className="text-xs text-ds-text-muted mb-4">{profile.description}</p>
        
        {/* Mini Preview Strip */}
        <div className={`flex items-center space-x-2 mb-2 ${lang === 'ar' ? 'space-x-reverse' : ''}`}>
          {visualColors.map((color, i) => (
            <div key={i} className="w-6 h-6 rounded-full border border-ds-border" style={{ backgroundColor: color }} />
          ))}
          <span className="text-xs text-ds-text-muted ms-2">Aa</span>
        </div>
      </div>
      
      <div className="border-t border-ds-border p-3 flex justify-between bg-ds-background">
        <button
          onClick={onPreview}
          className="text-xs text-ds-text-muted hover:text-ds-text-primary transition-colors"
        >
          {t('Preview', 'معاينة')}
        </button>
        <button
          onClick={onSelect}
          className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
            isSelected
              ? 'bg-ds-border text-ds-text-muted cursor-default'
              : 'bg-ds-primary text-white hover:bg-ds-primary/90'
          }`}
        >
          {isSelected ? t('Selected', 'تم الاختيار') : t('Select', 'اختر')}
        </button>
      </div>
    </div>
  )
}
