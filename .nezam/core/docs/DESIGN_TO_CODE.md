# NEZAM Design-to-Code Workflow Guide

This guide details the process of translating locked wireframe contracts (`wireframes_locked.json`) into high-quality, token-compliant frontend code without pixel-guessing.

---

## 📐 1. The Wireframe-to-Code Pipeline

When a visual design session is locked in the Design Hub, it exports a structured contract at `wireframes_locked.json` (or `.session/wireframes_locked.json`). This file acts as the immutable layout contract.

```
┌──────────────────────┐      ┌────────────────────────┐      ┌──────────────────────┐
│  Figma / Design Hub  │ ───> │ wireframes_locked.json │ ───> │ React/TS Components  │
│  (Visual Layouts)    │      │ (Component Contracts)  │      │ (Production Code)    │
└──────────────────────┘      └────────────────────────┘      └──────────────────────┘
```

---

## 🧩 2. Developer Tasks

### Component Extraction
1. Open `wireframes_locked.json` and examine the `pages` and `blocks` arrays.
2. For each block on a target page, identify:
   - The block type (e.g. `HeroSection`, `ComponentsGridControls`, `ArchStep`).
   - Its structural placement (parent container, row order, slot index).
   - Its property values (`props` and `styleOverride` tokens).

### Props Mapping
All properties defined in the wireframe JSON map directly to component props:
- **Locked properties**: Static values that must be implemented exactly (e.g., specific labels, icons, or visual themes).
- **Flexible properties**: Parameterized values, ranges, or optional features (e.g., alignment selections, collapsible states).
- **Content slots**: Empty containers mapped to `React.ReactNode` children in React.

---

## 🎨 3. Naming & Styling Conventions

### Component Naming
- Use **PascalCase** matching the registered block type names in `block_registry.json`.
- Keep component files under `src/components/` organized by sitemap scope.

### Token Compliance
- **No hardcoded HEX/RGB values**: Always use theme CSS variables (e.g., `var(--color-primary)`, `var(--color-secondary)`) or Tailwind utility classes mapped to system tokens.
- **No raw pixel measurements**: Layout padding, spacing, and heights must map to spacing scale values (e.g., `p-4`, `m-6`, `gap-8`) or responsive percentages.

---

## 📱 4. Responsive Breakpoints

All layouts must follow the desktop-first or mobile-first breakpoints mapped in `tailwind.config.ts` or CSS variables:

| Breakpoint | Width Target | CSS Utility | Target Layout State |
|---|---|---|---|
| **sm** | `640px` | `sm:` | Mobile columns, stacked blocks |
| **md** | `768px` | `md:` | Tablet view, collapsible sidebars |
| **lg** | `1024px` | `lg:` | Compact desktop layouts |
| **xl** | `1280px` | `xl:` | Default desktop view (full sidebars) |

---

## 🎬 5. Animation & Motion Implementation

- All animations must adhere to the design system motion budgets.
- **Transitions**: Limit durations to `150ms` to `250ms` with stable easing curves (`cubic-bezier(0.4, 0, 0.2, 1)` or `ease-in-out`).
- **Interactive States**: Explicit transitions on hover, focus-visible, active, loading, and disabled states are mandatory.

---

## 📝 6. Practical Implementation Example

Below is an example of mapping a locked block item in the wireframe JSON to a React component.

### The Locked JSON Definition
```json
{
  "id": "block-001",
  "type": "HeroSection",
  "props": {
    "title": "Build with AI, Remain in Control",
    "ctaText": "Get Started",
    "theme": "dark",
    "alignment": "center"
  }
}
```

### The Compliant React Implementation
```tsx
import React from 'react';

interface HeroSectionProps {
  title: string;
  ctaText: string;
  theme?: 'light' | 'dark';
  alignment?: 'left' | 'center' | 'right';
  children?: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  ctaText,
  theme = 'light',
  alignment = 'center',
  children
}) => {
  const isDark = theme === 'dark';
  
  return (
    <section 
      className={`
        w-full py-16 px-6 flex flex-col items-center justify-center transition-colors duration-200
        ${isDark ? 'bg-slate-900 text-white' : 'bg-alabaster text-slate-900'}
      `}
    >
      <div 
        className={`
          max-w-4xl w-full mx-auto
          ${alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left'}
        `}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 font-display">
          {title}
        </h1>
        
        {children && <div className="mt-4 mb-8">{children}</div>}
        
        <button
          className={`
            px-6 py-3 rounded-md font-semibold text-sm transition-all duration-150
            hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2
            ${isDark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}
          `}
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
};
```
