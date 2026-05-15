'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import ProfileGrid from '@/components/profiles/ProfileGrid'

export default function ProfilesPage() {
  const { profiles, isLoading, error, fetchProfiles, lang } = useSessionStore()
  const [previewProfile, setPreviewProfile] = useState<string | null>(null)
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 text-ds-text-primary">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{t('Design Profiles', 'ملفات التصميم')}</h1>
          <p className="text-sm text-ds-text-muted">{t('Select a profile to seed your design system tokens.', 'اختر ملف عشان تبدأ بيه رموز نظام التصميم بتاعك.')}</p>
        </div>
        <div className="text-sm text-ds-text-muted">
          {profiles.length} {t('Profiles Available', 'ملف متاح')}
        </div>
      </div>
      
      {isLoading && <div className="text-ds-text-muted">{t('Loading profiles...', 'بتحمل الملفات...')}</div>}
      
      {error && (
        <div className="bg-[#dc2626] text-white p-4 rounded mb-6">
          Error: {error}
        </div>
      )}

      {!isLoading && !error && (
        <ProfileGrid onPreview={(name) => setPreviewProfile(name)} />
      )}

      {/* Basic Modal for Preview */}
      {previewProfile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-ds-surface border border-ds-border rounded-lg max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-ds-text-primary">{t('Preview:', 'معاينة:')} {previewProfile}</h2>
              <button 
                onClick={() => setPreviewProfile(null)}
                className="text-ds-text-muted hover:text-ds-text-primary"
              >
                ✕
              </button>
            </div>
            
            <div className="h-64 bg-ds-background rounded border border-ds-border flex items-center justify-center text-ds-text-muted">
              {t('Live preview content will be rendered here in later phases.', 'المعاينة الحية هتظهر هنا في المراحل الجاية.')}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setPreviewProfile(null)}
                className="px-4 py-2 text-sm text-ds-text-muted hover:text-ds-text-primary"
              >
                {t('Close', 'إغلاق')}
              </button>
              <button
                onClick={() => {
                  useSessionStore.getState().setSelectedProfile(previewProfile)
                  setPreviewProfile(null)
                }}
                className="px-4 py-2 text-sm bg-ds-primary text-white rounded hover:bg-ds-primary/90"
              >
                {t('Select Profile', 'اختر الملف')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
