'use client'

import { cn } from '@/lib/cn'

interface SliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label?: string
  format?: (value: number) => string
  className?: string
  /** When true, skips the stacked label row (a11y label still applied to the input). */
  hideLabel?: boolean
  /** Comfortable track + thumb for dense toolbar rows. */
  size?: 'default' | 'comfortable'
}

/** A styled range input with an accent fill and a value readout. */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  format,
  className,
  hideLabel = false,
  size = 'default',
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  const comfortable = size === 'comfortable'
  return (
    <div className={cn('w-full', className)}>
      {label && !hideLabel && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-app-muted">{label}</span>
          <span className="font-mono text-[11px] text-app-text">
            {format ? format(value) : value}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className={cn(
          'nz-slider w-full cursor-pointer appearance-none bg-transparent focus-ring rounded',
          comfortable ? 'nz-slider--comfortable h-5' : 'h-4',
        )}
        style={
          {
            '--pct': `${pct}%`,
          } as React.CSSProperties
        }
      />
      <style jsx>{`
        .nz-slider {
          background: linear-gradient(
            to right,
            var(--app-accent) 0%,
            var(--app-accent) var(--pct),
            var(--app-border) var(--pct),
            var(--app-border) 100%
          );
          border-radius: 999px;
          height: 5px;
          margin: 7px 0;
        }
        .nz-slider--comfortable {
          height: 6px;
          margin: 8px 0;
        }
        .nz-slider::-webkit-slider-thumb {
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--app-text);
          border: 3px solid var(--app-accent);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
          transition: transform 0.12s ease;
        }
        .nz-slider--comfortable::-webkit-slider-thumb {
          width: 18px;
          height: 18px;
        }
        .nz-slider::-webkit-slider-thumb:hover {
          transform: scale(1.18);
        }
        .nz-slider::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--app-text);
          border: 3px solid var(--app-accent);
        }
        .nz-slider--comfortable::-moz-range-thumb {
          width: 18px;
          height: 18px;
        }
      `}</style>
    </div>
  )
}
