'use client'

import { useMemo } from 'react'
import { useHub } from '@/store/hub.store'
import type { PreviewDevice } from '@/store/hub.store'
import type { ArchPage } from '@/types/arch'
import type { DesignTokens } from '@/types/design'
import { composePage } from './PageComposer'
import { WireframeBlocksPage } from './WireframeBlocksPage'
import { detectTemplate, TEMPLATE_INFO, resolveTemplateLayerOrder } from '@/lib/preview/templates'

// ─── Build override CSS vars from a previewOverride record ────────────────────
function buildOverrideVars(override: NonNullable<ReturnType<typeof useHub.getState>['theme']['previewOverride']>): React.CSSProperties {
  const v = override[override.mode]
  if (!v) return {}
  return {
    '--bg-surface':     v.background   ?? undefined,
    '--panel':          v.card         ?? undefined,
    '--border':         v.border       ?? undefined,
    '--text':           v.foreground   ?? undefined,
    '--text-secondary': v['card-foreground'] ?? v['muted-foreground'] ?? undefined,
    '--text-muted':     v['muted-foreground'] ?? undefined,
    '--brand':          v.primary      ?? undefined,
    '--brand-hover':    v.primary      ?? undefined,
    '--brand-subtle':   v.secondary    ?? undefined,
    '--brand-deep':     v.primary      ?? undefined,
    '--accent':         v.accent       ?? undefined,
    '--neutral-100':    v.secondary    ?? undefined,
    '--neutral-200':    v.muted        ?? undefined,
    '--error':          v.destructive  ?? undefined,
    '--radius-md':      v.radius       ?? undefined,
    '--radius-lg':      v.radius       ?? undefined,
  } as React.CSSProperties
}

// ─── Device sizes ─────────────────────────────────────────────────────────────

interface Props { device: PreviewDevice; page: ArchPage }

const DEVICE_SIZES: Record<PreviewDevice, { width: number; label: string }> = {
  desktop: { width: 1280, label: '1280px' },
  tablet:  { width: 768,  label: '768px' },
  mobile:  { width: 390,  label: '390px' },
}
const DISPLAY_WIDTHS: Record<PreviewDevice, string> = {
  desktop: '920px',
  tablet:  '560px',
  mobile:  '320px',
}
const SCALE: Record<PreviewDevice, number> = {
  desktop: 0.72,
  tablet:  0.86,
  mobile:  0.95,
}

// ─── Token → CSS vars ─────────────────────────────────────────────────────────

function buildVars(t: DesignTokens): React.CSSProperties {
  return {
    '--brand':          t.colors.brand['500'],
    '--brand-hover':    t.colors.brand['400'],
    '--brand-subtle':   t.colors.brand['100'],
    '--brand-deep':     t.colors.brand['700'],
    '--bg-surface':     t.colors.surface.bg,
    '--panel':          t.colors.surface.panel,
    '--border':         t.colors.surface.border,
    '--text':           t.colors.text.primary,
    '--text-secondary': t.colors.text.secondary,
    '--text-muted':     t.colors.text.muted,
    '--text-disabled':  t.colors.text.disabled,
    '--success':        t.colors.semantic.success,
    '--warning':        t.colors.semantic.warning,
    '--error':          t.colors.semantic.error,
    '--accent':         t.colors.accent['500'],
    '--radius-sm':      t.radius.sm,
    '--radius-md':      t.radius.md,
    '--radius-lg':      t.radius.lg,
    '--radius-xl':      t.radius.xl,
    '--radius-full':    t.radius.full,
    '--shadow-sm':      t.shadows.sm,
    '--shadow-md':      t.shadows.md,
    '--shadow-lg':      t.shadows.lg,
    '--font-sans':      t.typography.sans,
    '--font-display':   t.typography.display,
    '--font-mono':      t.typography.mono,
    '--motion-duration': t.motion.duration.base,
    '--motion-easing':  t.motion.easing.default,
    '--border-width':   t.borders.width,
    '--border-style':   t.borders.style,
    '--neutral-100':    t.colors.neutral['100'],
    '--neutral-200':    t.colors.neutral['200'],
    '--neutral-300':    t.colors.neutral['300'],
    '--spacing-base':   `${t.spacing.base}px`,
  } as React.CSSProperties
}

// ─── Master dispatcher ─────────────────────────────────────────────────────────

export function PageRenderer({
  page,
  tokens,
  device,
  forcedVisibleLayers,
  wireframeSections,
}: {
  page: ArchPage
  tokens: DesignTokens
  device: PreviewDevice
  forcedVisibleLayers?: string[]
  wireframeSections?: Array<{ section_id?: string; block_type?: string; order?: number }>
}) {
  const vars           = useMemo(() => buildVars(tokens), [tokens])
  const previewOverride = useHub((s) => s.theme.previewOverride)
  const overrideVars   = useMemo(
    () => previewOverride ? buildOverrideVars(previewOverride) : {},
    [previewOverride],
  )
  const isMobile = device === 'mobile'
  const isTablet  = device === 'tablet'
  const template  = detectTemplate(page)
  const layerState = useHub((s) => s.preview.layerStateByPage?.[page.id])
  const allLayers = TEMPLATE_INFO[template]?.layers ?? []
  const orderedLayers = resolveTemplateLayerOrder(allLayers, layerState?.order ?? [])
  const visibleLayers = forcedVisibleLayers ?? orderedLayers.filter((id) => !(layerState?.hidden ?? []).includes(id))

  const wrapStyle: React.CSSProperties = { ...vars, ...overrideVars, minHeight: '100%' }

  return (
    <div style={wrapStyle}>
      {wireframeSections && wireframeSections.length > 0 ? (
        <WireframeBlocksPage page={page} sections={wireframeSections} device={device} />
      ) : (
        composePage(template, page, isMobile, isTablet, visibleLayers)
      )}
    </div>
  )
}

// ─── Device frame ─────────────────────────────────────────────────────────────

export function DeviceFrame({ device, page }: Props) {
  const tokens          = useHub((s) => s.design.tokens)
  const previewOverride = useHub((s) => s.theme.previewOverride)
  const bgColor  = previewOverride ? previewOverride[previewOverride.mode]?.background  ?? tokens.colors.surface.bg    : tokens.colors.surface.bg
  const panelColor = previewOverride ? previewOverride[previewOverride.mode]?.card ?? tokens.colors.surface.panel : tokens.colors.surface.panel
  const textSecondary = previewOverride ? previewOverride[previewOverride.mode]?.['muted-foreground'] ?? tokens.colors.text.secondary : tokens.colors.text.secondary
  const textMuted = previewOverride ? previewOverride[previewOverride.mode]?.['muted-foreground'] ?? tokens.colors.text.muted : tokens.colors.text.muted
  const { width, label } = DEVICE_SIZES[device]
  const displayW = DISPLAY_WIDTHS[device]
  const scale    = SCALE[device]
  const radius   = device === 'mobile' ? '36px' : device === 'tablet' ? '22px' : '10px'

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[11px] text-app-subtle font-mono tracking-wider">
        {label} · {width}px
      </p>
      <div
        style={{
          width: displayW,
          borderRadius: radius,
          border: `${device === 'mobile' ? '6px' : device === 'tablet' ? '5px' : '2px'} solid var(--app-border, #2a2a2a)`,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          backgroundColor: bgColor,
        }}
      >
        {device === 'desktop' && (
          <div style={{ height: '26px', backgroundColor: '#1c1c1e', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '6px' }}>
            {['#ff5f57','#febc2e','#28c840'].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
            ))}
            <div style={{ flex: 1, marginLeft: '10px', height: '14px', backgroundColor: '#2c2c2e', borderRadius: '3px' }} />
          </div>
        )}
        {device === 'mobile' && (
          <div style={{ height: '30px', backgroundColor: panelColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: textSecondary, fontFamily: tokens.typography.sans }}>9:41</span>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <div style={{ width: 12, height: 7, borderRadius: '1px', border: `1.5px solid ${textMuted}`, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '1px', right: '2px', backgroundColor: textMuted, borderRadius: '1px' }} />
              </div>
            </div>
          </div>
        )}
        {device === 'tablet' && (
          <div style={{ height: '24px', backgroundColor: panelColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: textSecondary }}>9:41</span>
            <span style={{ fontSize: '10px', color: textMuted }}>● ● ●</span>
          </div>
        )}
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${Math.round(100 / scale)}%`,
        }}>
          <PageRenderer page={page} tokens={tokens} device={device} />
        </div>
      </div>
    </div>
  )
}
