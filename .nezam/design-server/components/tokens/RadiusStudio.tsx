'use client'

import React, { useState, useEffect } from 'react'
import { useTokensStore } from '@/lib/store/tokens.store'
import { useSessionStore } from '@/lib/store/session.store'
import { Sliders, RefreshCw } from 'lucide-react'

export default function RadiusStudio() {
  const { tokens, updateRadius } = useTokensStore()
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  // Helper to parse numeric value from 'Xpx' string
  const parsePx = (val: string): number => {
    const num = parseInt(val.replace('px', ''))
    return isNaN(num) ? 0 : num
  }

  const radiusSm = parsePx(tokens.radius.sm)
  const radiusMd = parsePx(tokens.radius.md)
  const radiusLg = parsePx(tokens.radius.lg)
  const radiusXl = parsePx(tokens.radius.xl)

  // We use tokens.radius.md as the base for the global proportional fluid scaler
  const [globalBase, setGlobalBase] = useState(radiusMd || 8)

  // Update base when store changes externally
  useEffect(() => {
    if (radiusMd !== globalBase) {
      setGlobalBase(radiusMd)
    }
  }, [radiusMd])

  const handleGlobalChange = (val: number) => {
    setGlobalBase(val)
    // Scale proportionally
    updateRadius('sm', `${Math.round(val * 0.5)}px`)
    updateRadius('md', `${val}px`)
    updateRadius('lg', `${Math.round(val * 1.5)}px`)
    updateRadius('xl', `${Math.round(val * 2.0)}px`)
  }

  const handleReset = () => {
    setGlobalBase(8)
    updateRadius('none', '0')
    updateRadius('sm', '4px')
    updateRadius('md', '8px')
    updateRadius('lg', '12px')
    updateRadius('xl', '16px')
    updateRadius('full', '9999px')
  }

  return (
    <div className="bg-ds-surface border border-ds-border rounded-lg p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-ds-border pb-3">
        <h2 className="text-lg font-medium text-ds-text-primary flex items-center gap-2">
          <Sliders className="w-5 h-5 text-ds-primary" />
          {t('Border Radius Studio', 'استوديو زوايا الحدود')}
        </h2>
        <button
          onClick={handleReset}
          className="text-xs text-ds-text-muted hover:text-ds-primary flex items-center gap-1.5 transition-colors"
          title={t('Reset to Defaults', 'إعادة تعيين إلى الافتراضي')}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t('Reset', 'إعادة ضبط')}
        </button>
      </div>

      {/* Proportional Fluid Scaler */}
      <div className="space-y-3 bg-ds-background/40 border border-ds-border/40 rounded-xl p-4 transition-all hover:border-ds-primary/20">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-ds-primary uppercase tracking-wider block">
              {t('Fluid Proportional Scaler', 'مقياس الزوايا النسبي المرن')}
            </span>
            <span className="text-2xs text-ds-text-muted">
              {t('Scales all border radius tokens proportionally based on a main base value.', 'بيعدل كل زوايا الحدود بنسب متناسقة بناءً على القيمة الأساسية.')}
            </span>
          </div>
          <span className="text-sm font-mono font-medium text-ds-text-primary bg-ds-surface px-2 py-0.5 rounded border border-ds-border">
            {globalBase}px
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="24"
          step="1"
          value={globalBase}
          onChange={(e) => handleGlobalChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-ds-background border border-ds-border/40 rounded-lg appearance-none cursor-pointer accent-ds-primary focus:outline-none"
        />
      </div>

      {/* Individual Token Customization */}
      <div className="space-y-4">
        <span className="text-xs font-semibold text-ds-text-muted uppercase tracking-wider block">
          {t('Individual Token Adjustments', 'تعديل الرموز الفردية')}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Small Radius */}
          <div className="space-y-2 bg-ds-background/20 border border-ds-border/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-ds-text-primary">--ds-radius-sm</span>
              <span className="text-xs font-mono font-semibold text-ds-primary">{tokens.radius.sm}</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={radiusSm}
              onChange={(e) => updateRadius('sm', `${e.target.value}px`)}
              className="w-full h-1 bg-ds-background appearance-none cursor-pointer accent-ds-primary/80"
            />
          </div>

          {/* Medium Radius */}
          <div className="space-y-2 bg-ds-background/20 border border-ds-border/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-ds-text-primary">--ds-radius-md</span>
              <span className="text-xs font-mono font-semibold text-ds-primary">{tokens.radius.md}</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={radiusMd}
              onChange={(e) => updateRadius('md', `${e.target.value}px`)}
              className="w-full h-1 bg-ds-background appearance-none cursor-pointer accent-ds-primary/80"
            />
          </div>

          {/* Large Radius */}
          <div className="space-y-2 bg-ds-background/20 border border-ds-border/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-ds-text-primary">--ds-radius-lg</span>
              <span className="text-xs font-mono font-semibold text-ds-primary">{tokens.radius.lg}</span>
            </div>
            <input
              type="range"
              min="0"
              max="48"
              value={radiusLg}
              onChange={(e) => updateRadius('lg', `${e.target.value}px`)}
              className="w-full h-1 bg-ds-background appearance-none cursor-pointer accent-ds-primary/80"
            />
          </div>

          {/* Extra Large Radius */}
          <div className="space-y-2 bg-ds-background/20 border border-ds-border/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-ds-text-primary">--ds-radius-xl</span>
              <span className="text-xs font-mono font-semibold text-ds-primary">{tokens.radius.xl}</span>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              value={radiusXl}
              onChange={(e) => updateRadius('xl', `${e.target.value}px`)}
              className="w-full h-1 bg-ds-background appearance-none cursor-pointer accent-ds-primary/80"
            />
          </div>
        </div>
      </div>

      {/* Visual Border Radius Testing Bed */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-ds-text-muted uppercase tracking-wider block">
          {t('Visual Tester', 'معاينة الأشكال الزاوية')}
        </span>
        <div className="grid grid-cols-4 gap-3">
          <div 
            className="h-14 bg-ds-primary flex items-center justify-center text-[10px] text-white font-medium border border-ds-border shadow-sm transition-all"
            style={{ borderRadius: 'var(--ds-radius-sm)' }}
          >
            SM ({tokens.radius.sm})
          </div>
          <div 
            className="h-14 bg-ds-primary flex items-center justify-center text-[10px] text-white font-medium border border-ds-border shadow-sm transition-all"
            style={{ borderRadius: 'var(--ds-radius-md)' }}
          >
            MD ({tokens.radius.md})
          </div>
          <div 
            className="h-14 bg-ds-primary flex items-center justify-center text-[10px] text-white font-medium border border-ds-border shadow-sm transition-all"
            style={{ borderRadius: 'var(--ds-radius-lg)' }}
          >
            LG ({tokens.radius.lg})
          </div>
          <div 
            className="h-14 bg-ds-primary flex items-center justify-center text-[10px] text-white font-medium border border-ds-border shadow-sm transition-all"
            style={{ borderRadius: 'var(--ds-radius-xl)' }}
          >
            XL ({tokens.radius.xl})
          </div>
        </div>
      </div>
    </div>
  )
}
