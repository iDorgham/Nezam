'use client'

import { useSessionStore } from '@/lib/store/session.store'
import { useState, useEffect } from 'react'

export default function ProfileEditorPage() {
  const { lang, profiles, fetchProfiles } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const [primaryColor, setPrimaryColor] = useState('#FF5701')
  const [surfaceColor, setSurfaceColor] = useState('#0f1011')
  const [selectedProfile, setSelectedProfile] = useState('')
  
  useEffect(() => {
    if (profiles.length === 0) fetchProfiles()
  }, [fetchProfiles, profiles.length])

  const handleClone = (profileName: string) => {
    setSelectedProfile(profileName)
    const profile = profiles.find((p) => p.name === profileName)
    if (profile) {
      // Mock colors based on profile name since parser is minimal
      if (profileName === 'airbnb') {
        setPrimaryColor('#FF5A5F')
        setSurfaceColor('#FFFFFF')
      } else if (profileName === 'agentic') {
        setPrimaryColor('#5e6ad2')
        setSurfaceColor('#0f1011')
      } else if (profileName === 'apple') {
        setPrimaryColor('#000000')
        setSurfaceColor('#F5F5F7')
      } else {
        // Fallback random colors or default
        setPrimaryColor('#FF5701')
        setSurfaceColor('#0f1011')
      }
    }
  }

  const handleExport = () => {
    const profileData = {
      name: selectedProfile ? `${selectedProfile}-clone` : 'custom-profile',
      colors: {
        primary: primaryColor,
        surface: surfaceColor,
      }
    }
    
    // Create a blob and download it
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profileData.name}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert(t('Profile exported as JSON!', 'تم تصدير الملف كـ JSON!'))
  }
  
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 text-ds-text-primary">
      <div>
        <h1 className="text-2xl font-semibold">{t('Profile Editor', 'محرر الملفات الشخصية')}</h1>
        <p className="text-sm text-ds-text-muted">{t('Clone an existing profile to customize and export.', 'انسخ ملف موجود عشان تخصصه وتصدره.')}</p>
      </div>
      
      <div className="bg-ds-surface border border-ds-border rounded-xl p-6 space-y-6">
        {/* Clone Profile Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('Clone Profile', 'نسخ ملف شخصي')}</label>
          <select
            value={selectedProfile}
            onChange={(e) => handleClone(e.target.value)}
            className="w-full bg-ds-background border border-ds-border rounded-lg px-3 py-2 text-sm text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
          >
            <option value="">{t('Select a profile to clone...', 'اختر ملف للنسخ...')}</option>
            {profiles.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('Primary Color', 'اللون الأساسي')}</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 bg-ds-background border border-ds-border rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 bg-ds-background border border-ds-border rounded-lg px-3 py-2 text-sm text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
              />
            </div>
          </div>

          {/* Surface Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('Surface Color', 'لون الأسطح')}</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={surfaceColor}
                onChange={(e) => setSurfaceColor(e.target.value)}
                className="w-10 h-10 bg-ds-background border border-ds-border rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={surfaceColor}
                onChange={(e) => setSurfaceColor(e.target.value)}
                className="flex-1 bg-ds-background border border-ds-border rounded-lg px-3 py-2 text-sm text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="mt-6">
          <label className="text-sm font-medium mb-2 block">{t('Live Preview', 'معاينة مباشرة')}</label>
          <div 
            className="p-6 rounded-xl border border-ds-border transition-colors"
            style={{ backgroundColor: surfaceColor }}
          >
            <h3 className="text-lg font-semibold mb-2 transition-colors" style={{ color: primaryColor }}>
              {t('Sample Header', 'عنوان عينة')}
            </h3>
            <p className="text-sm text-ds-text-muted mb-4">
              {t('This is a preview of how your profile style will look on components.', 'دي معاينة لشكل ملف التصميم بتاعك على العناصر.')}
            </p>
            <button 
              className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              {t('Sample Button', 'زر عينة')}
            </button>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-ds-primary text-white rounded-lg hover:bg-ds-primary/90 text-sm font-medium transition-colors"
          >
            {t('Save & Export', 'حفظ وتصدير')}
          </button>
        </div>
      </div>
    </div>
  )
}

