'use client'

import { Monitor, Tablet, Smartphone, Lock, RotateCw, ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react'
import { useHub, type PreviewDevice } from '@/store/hub.store'
import { PageRenderer } from './DeviceFrame'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'

const DEVICE_WIDTH: Record<PreviewDevice, number | null> = {
  desktop: null,   // null = fill container at 100%
  tablet:  768,
  mobile:  390,
}

const DEVICE_ICONS: Record<PreviewDevice, React.FC<{ size?: number; className?: string }>> = {
  desktop: Monitor,
  tablet:  Tablet,
  mobile:  Smartphone,
}

/**
 * Browser-window preview chrome. Replaces the old standalone device toolbar.
 * - Desktop: page renders at natural 1:1 scale, fills the entire canvas area.
 *   The browser window IS the viewport (Chrome-style traffic lights + URL bar).
 * - Tablet/Mobile: page renders inside a centered fixed-width frame (768 / 390),
 *   wrapped in the same browser chrome so the device switcher stays reachable.
 */
export function BrowserPreview({ page }: { page: ArchPage }) {
  const tokens         = useHub((s) => s.design.tokens)
  const device         = useHub((s) => s.preview.device)
  const setDevice      = useHub((s) => s.previewSetDevice)
  const override       = useHub((s) => s.theme.previewOverride)
  const clearOverride  = useHub((s) => s.themeClearPreview)

  // Build shadcn CSS vars for the page container if an override is active
  const overrideStyle: React.CSSProperties | undefined = override
    ? Object.fromEntries(
        Object.entries(override[override.mode]).map(([k, v]) => [`--${k}`, v])
      ) as React.CSSProperties
    : undefined

  const targetWidth = DEVICE_WIDTH[device]
  const url = displayUrl(page)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-app-deep">
      {/* ── Browser chrome ─────────────────────────────────────────────── */}
      <div className="shrink-0 flex flex-col bg-app-surface border-b border-app-border">
        {/* Title bar — traffic lights + tab + device switcher */}
        <div className="flex items-center gap-2 h-9 px-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          </div>

          {/* Tab */}
          <div className="ml-3 flex items-center gap-1.5 h-6 max-w-[260px] px-2.5 rounded-t-md bg-app-bg border-t border-l border-r border-app-border">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--app-accent)' }} />
            <span className="text-[10.5px] text-app-text truncate">{page.name}</span>
          </div>

          {/* Theme override badge */}
          {override && (
            <div className="flex items-center gap-1 ml-3 px-2 h-5 rounded-full text-[10px] font-medium"
              style={{ background: 'var(--app-accent)', color: 'var(--app-on-accent)', opacity: 0.9 }}>
              <Sparkles size={9} />
              <span>{override.presetName}</span>
              <button onClick={clearOverride} className="ml-0.5 opacity-70 hover:opacity-100" title="Remove theme">
                <X size={9} />
              </button>
            </div>
          )}

          {/* Device switcher — embedded in title bar so the chrome IS the toolbar */}
          <div className="ml-auto flex items-center gap-0.5 p-0.5 rounded-app-sm bg-app-elevated border border-app-border">
            {(['desktop','tablet','mobile'] as const).map((d) => {
              const Icon = DEVICE_ICONS[d]
              const active = device === d
              return (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  title={d}
                  className={cn(
                    'flex items-center justify-center h-5 w-7 rounded text-[10px] transition-colors duration-100',
                    active ? 'bg-app-surface text-app-text' : 'text-app-subtle hover:text-app-text',
                  )}
                >
                  <Icon size={11} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Address bar */}
        <div className="flex items-center gap-1 h-9 px-3 border-t border-app-border bg-app-bg">
          <button className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated transition-colors" title="Back">
            <ArrowLeft size={12} />
          </button>
          <button className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated transition-colors" title="Forward">
            <ArrowRight size={12} />
          </button>
          <button className="flex items-center justify-center h-6 w-6 rounded text-app-subtle hover:bg-app-elevated transition-colors" title="Reload">
            <RotateCw size={11} />
          </button>

          <div className="flex items-center gap-1.5 flex-1 h-6 px-2.5 mx-1 rounded-full bg-app-elevated border border-app-border">
            <Lock size={10} className="text-app-subtle shrink-0" />
            <span className="text-[10.5px] text-app-muted font-mono truncate">{url}</span>
          </div>

          <span className="text-[10px] font-mono text-app-subtle px-1.5 select-none">
            {device === 'desktop' ? 'fluid' : `${targetWidth}px`}
          </span>
        </div>
      </div>

      {/* ── Render area = browser viewport ────────────────────────────── */}
      <div
        className="flex-1 min-h-0 overflow-auto app-scroll"
        style={{
          ...(device !== 'desktop' ? { background: 'var(--app-deep)' } : undefined),
          ...(overrideStyle ?? {}),
        }}
      >
        {device === 'desktop' ? (
          // Full-bleed: page fills 100% of the viewport — min-h-full so short pages still cover
          <div className="min-h-full w-full">
            <PageRenderer page={page} tokens={tokens} device="desktop" />
          </div>
        ) : (
          // Centered, fixed-width device viewport — page renders at 1:1 inside
          <div className="mx-auto my-6" style={{ width: targetWidth ?? '100%' }}>
            <div
              className="overflow-hidden bg-app-surface"
              style={{
                width: targetWidth ?? '100%',
                borderRadius: device === 'mobile' ? 24 : 12,
                border: '1px solid var(--app-border)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              }}
            >
              <PageRenderer page={page} tokens={tokens} device={device} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function displayUrl(page: ArchPage): string {
  const route = page.route?.trim() || '/'
  const cleaned = route.startsWith('/') ? route : `/${route}`
  return `https://acme.dev${cleaned}`
}
