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
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={cn('w-full', className)}>
      {label && (
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
        className="nz-slider h-4 w-full cursor-pointer appearance-none bg-transparent focus-ring rounded"
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
      `}</style>
    </div>
  )
}
