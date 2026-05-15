'use client'

import { useEffect } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import SitemapTree from '@/components/sitemap/SitemapTree'
import NavPreview from '@/components/sitemap/NavPreview'
import { useAutosave } from '@/lib/autosave'

export default function SitemapPage() {
  const { projectContext, isLoading, error, fetchContext, sitemap, setSitemap, addLog, lang } = useSessionStore()
  
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  useAutosave()

  useEffect(() => {
    fetchContext()
  }, [fetchContext])

  return (
    <div className="flex h-[calc(100vh-40px)] overflow-hidden bg-ds-surface text-ds-text-primary">
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-ds-surface border border-ds-border p-5 rounded-2xl shadow-2xl">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-ds-text-primary to-[#8a8f98] bg-clip-text text-transparent">{t('Sitemap Builder', 'باني خريطة الموقع')}</h1>
            <p className="text-xs text-[#8a8f98] mt-1">{t('Design and organize your application structure', 'صمم ونظم هيكل تطبيقك')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-[#8a8f98] bg-white/[0.03] px-3 py-1.5 rounded-full border border-ds-border">
              {sitemap.length} {t('Pages', 'صفحات')}
            </div>
            <button
              onClick={async () => {
                const newPage: any = {
                  id: Math.random().toString(36).substring(2, 9),
                  title: 'New Page',
                  route: '/new-page',
                  type: 'public'
                }
                setSitemap([...sitemap, newPage])
                
                try {
                  const res = await fetch('/api/cli', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: `nezam-cli sitemap create-node --title "New Page" --route "/new-page"` })
                  })
                  if (res.ok) {
                    const data = await res.json()
                    addLog(data.output)
                  }
                } catch (e) {
                  console.error('Failed to run silent CLI', e)
                }
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FF5701] to-[#FF8A00] text-white rounded-xl text-sm font-medium hover:from-[#e04e00] hover:to-[#e07b00] shadow-[0_0_15px_rgba(255,87,1,0.2)] hover:shadow-[0_0_25px_rgba(255,87,1,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {t('Create Page', 'إنشاء صفحة')}
            </button>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <div className="text-[#8a8f98] text-sm animate-pulse">{t('Loading context...', 'جاري التحميل...')}</div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 backdrop-blur-sm">
            Error: {error}
          </div>
        )}

        {projectContext && (
          <>
            <div className="bg-ds-surface border border-ds-border p-6 rounded-2xl shadow-2xl">
              <h2 className="text-lg font-semibold text-ds-text-primary mb-4">{t('Page Hierarchy', 'ترتيب الصفحات')}</h2>
              {sitemap.length > 0 ? (
                <SitemapTree />
              ) : (
                <div className="text-sm text-[#8a8f98] p-8 bg-white/[0.01] border border-ds-border rounded-xl text-center backdrop-blur-sm">
                  {t('No pages found. Click "Create Page" to start.', 'مفيش أي صفحات هنا. دوس على "إنشاء صفحة" عشان تبدأ.')}
                </div>
              )}
            </div>
            
            <div className="bg-ds-surface border border-ds-border p-6 rounded-2xl shadow-2xl">
              <h2 className="text-lg font-semibold text-ds-text-primary mb-4">{t('Navigation Preview', 'معاينة المنيو')}</h2>
              <NavPreview />
            </div>
          </>
        )}
      </div>


    </div>
  )
}
