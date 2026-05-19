'use client'

import React, { useState } from 'react'
import { Palette, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import type { ParsedProfile } from '@/lib/parsers/profile.parser'

interface ProfileSelectorProps {
  profiles: ParsedProfile[]
  selectedProfile: string
  onSelectProfile: (name: string) => void
  lang: string
}

export default function ProfileSelector({
  profiles,
  selectedProfile,
  onSelectProfile,
  lang,
}: ProfileSelectorProps) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6
  
  const totalPages = Math.ceil(profiles.length / itemsPerPage)
  const paginatedProfiles = profiles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-ds-primary" />
          <h3 className="text-sm font-semibold text-ds-text-primary">
            {t('Base Profile', 'الملف الشخصي الأساسي')}
          </h3>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 border border-ds-border rounded-lg p-0.5 bg-ds-surface-subtle">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1 rounded text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title={t('Previous Page', 'الصفحة السابقة')}
            >
              <ChevronLeft size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
            </button>
            <span className="text-[10px] font-medium text-ds-text-muted px-1.5">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="p-1 rounded text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title={t('Next Page', 'الصفحة التالية')}
            >
              <ChevronRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {paginatedProfiles.map((profile) => {
          const isSelected = selectedProfile === profile.name
          
          return (
            <button
              key={profile.name}
              onClick={() => onSelectProfile(profile.name)}
              className={`group flex flex-col items-start text-start p-3 rounded-xl border text-xs transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-ds-primary bg-ds-primary-subtle text-ds-text-primary'
                  : 'border-ds-border bg-ds-surface hover:border-ds-border-strong hover:bg-ds-surface-hover text-ds-text-muted'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`font-semibold transition-colors ${isSelected ? 'text-ds-primary' : 'text-ds-text-primary group-hover:text-ds-primary'}`}>
                  {profile.name}
                </span>
                {isSelected && (
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ds-primary/20 text-ds-primary border border-ds-primary/30 scale-90">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
              <span className="mt-1 text-[10px] text-ds-text-muted line-clamp-1">
                {profile.category || t('Design Tokens Profile', 'بروفايل رموز التصميم')}
              </span>
              
              {/* Profile colors snapshot preview */}
              <div className="mt-2.5 flex items-center gap-1">
                {(profile as any).colorProfile && Object.entries((profile as any).colorProfile).slice(0, 5).map(([key, val]: any) => {
                  const colorVal = typeof val === 'string' ? val : val?.value || '#3ECF8E'
                  return (
                    <span
                      key={key}
                      className="w-3 h-3 rounded-full border border-ds-border-strong inline-block"
                      style={{ backgroundColor: colorVal }}
                    />
                  )
                })}
              </div>
            </button>
          )
        })}

        {profiles.length === 0 && (
          <div className="col-span-2 text-center text-ds-text-muted text-xs py-8 border border-dashed border-ds-border rounded-xl">
            {t('No profiles available.', 'لا توجد بروفايلات متاحة.')}
          </div>
        )}
      </div>
    </div>
)
}
