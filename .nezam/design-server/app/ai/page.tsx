'use client'

import { useSessionStore } from '@/lib/store/session.store'
import { useState } from 'react'
import { Bot, Sparkles, Wand2 } from 'lucide-react'

export default function AIPage() {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const [prompt, setPrompt] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    
    // Mock AI response after 1.5s
    setTimeout(() => {
      setSuggestions([
        t('Add more contrast to the primary button text.', 'زود التباين في نص الزرار الأساسي.'),
        t('Consider using a grid layout for the services section.', 'فكر تستخدم تخطيط شبكي لقسم الخدمات.'),
        t('Optimize image sizes to improve page load speed.', 'حسن أحجام الصور عشان تسرع تحميل الصفحة.')
      ])
      setIsLoading(false)
    }, 1500)
  }
  
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 text-ds-text-primary">
      <div>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#FF5701]" />
          <h1 className="text-2xl font-semibold">{t('AI Assistant', 'مساعد الذكاء الاصطناعي')}</h1>
        </div>
        <p className="text-sm text-[#8a8f98] mt-1">{t('Use AI to get design suggestions and improvements via CLI.', 'استخدم الذكاء الاصطناعي عشان تاخد اقتراحات وتحسينات للتصميم.')}</p>
      </div>
      
      <div className="bg-ds-surface border border-ds-border rounded-xl p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('What do you want to improve?', 'عايز تحسن إيه؟')}</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('Ask AI for suggestions (e.g., "Review my color contrast")', 'اسأل الذكاء الاصطناعي (مثلاً: "راجع تباين الألوان")')}
            className="w-full h-32 bg-ds-background border border-ds-border rounded-lg px-3 py-2 text-sm text-ds-text-primary focus:outline-none focus:border-[#FF5701]/50 resize-none"
          />
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF5701] text-white rounded-lg hover:bg-[#e04e00] disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {isLoading ? (
            <span className="animate-spin">◌</span>
          ) : (
            <Wand2 size={16} />
          )}
          {isLoading ? t('Analyzing...', 'جاري التحليل...') : t('Generate Suggestions', 'توليد اقتراحات')}
        </button>
      </div>

      {/* Suggestions Results */}
      {suggestions.length > 0 && (
        <div className="bg-ds-surface border border-ds-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF5701]" />
            <h2 className="text-lg font-semibold">{t('AI Suggestions', 'اقتراحات الذكاء الاصطناعي')}</h2>
          </div>
          
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-ds-text-primary bg-ds-background p-3 rounded-lg border border-ds-border flex items-start gap-2">
                <span className="text-[#FF5701]">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
