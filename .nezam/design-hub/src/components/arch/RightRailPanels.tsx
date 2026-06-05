'use client'

import { useState } from 'react'
import { Sparkles, SlidersHorizontal, Type, Grid, CircleHelp, Sun, Moon } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { THEME_PRESETS } from '@/components/theming/theme-presets'
import { Button } from '@/components/ui/button'

export function RightRailPanels() {
  const [activeTab, setActiveTab] = useState<'theme' | 'design'>('theme')
  const theme = useHub((s) => s.theme)
  const design = useHub((s) => s.design)
  const themeApplyToPreview = useHub((s) => s.themeApplyToPreview)
  const themeClearPreview = useHub((s) => s.themeClearPreview)
  const designApplyProfile = useHub((s) => s.designApplyProfile)
  
  const [activePreset, setActivePreset] = useState('neutral')
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const [radius, setRadius] = useState('0.5rem')
  const [typeScale, setTypeScale] = useState(1.2)
  const [baseSpacing, setBaseSpacing] = useState(4)

  function applyPreset(presetId: string, currentMode = mode) {
    const preset = THEME_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setActivePreset(presetId)

    const override = {
      light: preset.light as any,
      dark: preset.dark as any,
      mode: currentMode,
      fontSans: 'Inter',
      fontMono: 'ui-monospace',
      radius,
      presetName: preset.name,
    }
    themeApplyToPreview(override)
  }

  function handleModeToggle(nextMode: 'light' | 'dark') {
    setMode(nextMode)
    applyPreset(activePreset, nextMode)
  }

  return (
    <div className="flex h-full flex-col select-none">
      {/* Tab bar */}
      <div className="shrink-0 flex items-center gap-0.5 px-2 py-1.5 border-b border-app-border bg-app-bg">
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 flex items-center justify-center gap-1.5 h-7 rounded text-[11px] font-semibold transition-all duration-100 ${
            activeTab === 'theme'
              ? 'bg-app-surface text-app-text border border-app-border shadow-sm'
              : 'text-app-subtle hover:text-app-muted hover:bg-app-elevated/40'
          }`}
        >
          <Sparkles size={11} className={activeTab === 'theme' ? 'text-app-accent' : ''} />
          Theme Preset
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 flex items-center justify-center gap-1.5 h-7 rounded text-[11px] font-semibold transition-all duration-100 ${
            activeTab === 'design'
              ? 'bg-app-surface text-app-text border border-app-border shadow-sm'
              : 'text-app-subtle hover:text-app-muted hover:bg-app-elevated/40'
          }`}
        >
          <SlidersHorizontal size={11} className={activeTab === 'design' ? 'text-app-accent' : ''} />
          Design Tokens
        </button>
      </div>

      {/* Body container */}
      <div className="flex-1 overflow-y-auto app-scroll p-4 flex flex-col gap-5 min-h-0">
        {activeTab === 'theme' && (
          <>
            {/* Dark / Light Toggle */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-app-subtle uppercase tracking-wider">
                Interface Mode
              </span>
              <div className="grid grid-cols-2 gap-1 rounded-lg border border-app-border p-0.5 bg-app-bg/50">
                <button
                  onClick={() => handleModeToggle('light')}
                  className={`flex h-7 items-center justify-center gap-1.5 rounded text-[11px] font-medium transition-all ${
                    mode === 'light'
                      ? 'bg-app-surface text-app-text border border-app-border shadow-sm'
                      : 'text-app-subtle hover:text-app-text'
                  }`}
                >
                  <Sun size={12} />
                  Light
                </button>
                <button
                  onClick={() => handleModeToggle('dark')}
                  className={`flex h-7 items-center justify-center gap-1.5 rounded text-[11px] font-medium transition-all ${
                    mode === 'dark'
                      ? 'bg-app-surface text-app-text border border-app-border shadow-sm'
                      : 'text-app-subtle hover:text-app-text'
                  }`}
                >
                  <Moon size={12} />
                  Dark
                </button>
              </div>
            </div>

            {/* Presets List */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-app-subtle uppercase tracking-wider">
                Theme Presets
              </span>
              <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto app-scroll pr-1">
                {THEME_PRESETS.map((preset) => {
                  const isActive = activePreset === preset.id
                  return (
                    <div
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`rounded-xl border p-2.5 cursor-pointer flex items-center justify-between gap-3 transition-all duration-100 ${
                        isActive
                          ? 'border-app-accent bg-app-accent-subtle/10'
                          : 'border-app-border bg-app-elevated/40 hover:border-app-accent/40'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-app-text truncate">{preset.name}</p>
                        <p className="text-[9.5px] text-app-subtle leading-normal mt-0.5">{preset.description}</p>
                      </div>
                      <div
                        className="h-5 w-5 rounded-full border border-black/40 shadow-sm shrink-0"
                        style={{ backgroundColor: preset.swatch }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Clear Theme action */}
            <div className="border-t border-app-border/40 pt-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-[11px]"
                onClick={() => {
                  themeClearPreview()
                  setActivePreset('neutral')
                }}
              >
                Reset to Default Presets
              </Button>
            </div>
          </>
        )}

        {activeTab === 'design' && (
          <>
            {/* Fluid Spacing Scale Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-app-subtle uppercase tracking-wider flex items-center gap-1">
                  <Grid size={11} /> Spacing Base ({baseSpacing}px)
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={baseSpacing}
                onChange={(e) => setBaseSpacing(Number(e.target.value))}
                className="w-full h-1 bg-app-border rounded-lg appearance-none cursor-pointer accent-app-accent"
              />
              <div className="flex justify-between text-[9px] font-mono text-app-subtle">
                <span>Scale: {baseSpacing}px .. {baseSpacing * 16}px</span>
              </div>
            </div>

            {/* Typography Step Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-app-subtle uppercase tracking-wider flex items-center gap-1">
                  <Type size={11} /> Typography Step ({typeScale})
                </span>
              </div>
              <input
                type="range"
                min="1.1"
                max="1.4"
                step="0.05"
                value={typeScale}
                onChange={(e) => setTypeScale(Number(e.target.value))}
                className="w-full h-1 bg-app-border rounded-lg appearance-none cursor-pointer accent-app-accent"
              />
              <div className="flex flex-col gap-1 text-[9.5px] font-mono text-app-subtle rounded border border-app-border/60 bg-app-bg/50 p-2 leading-relaxed">
                <span className="text-app-text font-semibold mb-0.5">Scale Previews:</span>
                <span>Base (H5): 16.0px</span>
                <span>Sub (H4): {(16 * typeScale).toFixed(1)}px</span>
                <span>Title (H3): {(16 * typeScale * typeScale).toFixed(1)}px</span>
                <span>Large (H2): {(16 * typeScale * typeScale * typeScale).toFixed(1)}px</span>
                <span>Display (H1): {(16 * typeScale * typeScale * typeScale * typeScale).toFixed(1)}px</span>
              </div>
            </div>

            {/* Token Blueprint Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-app-subtle uppercase tracking-wider flex items-center gap-1">
                <SlidersHorizontal size={11} /> Tokens System Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {['minimal', 'glassmorphism', 'playful', 'terminal'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => designApplyProfile(preset as any)}
                    className="h-8 rounded-lg border border-app-border bg-app-elevated/40 hover:border-app-accent/30 text-[10.5px] font-semibold text-app-text transition-all capitalize"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom CSS Variable mapper info */}
            <div className="rounded-xl border border-app-accent/20 bg-app-accent-subtle/5 p-3 flex flex-col gap-2">
              <p className="text-[10.5px] font-bold text-app-accent flex items-center gap-1">
                <CircleHelp size={12} /> Design System Mapper
              </p>
              <p className="text-[10px] text-app-subtle leading-relaxed">
                Tokens automatically map fluid scales to CSS variables:
              </p>
              <code className="text-[9px] font-mono text-slate-400 bg-app-bg p-1.5 rounded leading-relaxed border border-app-border/40">
                --space-base: {baseSpacing}px;<br />
                --type-scale: {typeScale};<br />
                --radius-base: {radius};
              </code>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
