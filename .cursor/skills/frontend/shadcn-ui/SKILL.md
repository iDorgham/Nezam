---
skill_id: "frontend/shadcn-ui"
name: "nezam-shadcn-ui"
description: "Correct shadcn/ui installation, token mapping, component extension, and RTL support patterns for the NEZAM stack (Next.js + Tailwind + NEZAM design tokens)."
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release.
owner: "frontend-lead"
tier: 2
sdd_phase: "Development"
rtl_aware: true
certified: false
dependencies:
  - "design/design-tokens"
  - "design/css-architecture"
  - "design/design-context-init"
---

# shadcn/ui Integration

## Purpose

Establish correct patterns for adding, customizing, and extending shadcn/ui components in NEZAM projects — with NEZAM design token mapping, proper extension patterns, and RTL support.

## Trigger Conditions

- Adding a new UI component from shadcn/ui to the project.
- Mapping shadcn's CSS variables to NEZAM design tokens.
- Extending shadcn components with project-specific variants.
- Auditing component usage for anti-patterns.

## Prerequisites

- Next.js project initialized.
- Tailwind CSS configured (`tailwind.config.ts`).
- `DESIGN.md` exists with NEZAM token definitions.
- `design-context-init` has been run (components.md current).

## Procedure

### 1. Installation

```bash
# Initialize shadcn/ui in the project (run once)
npx shadcn@latest init

# Add individual components — ALWAYS use this command
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
# etc.
```

**Rule:** Never copy-paste shadcn component code manually. Always use the CLI. The CLI fetches the latest version and places it correctly.

After adding any component, **update `.cursor/context/design-init/components.md`** with the new component source.

### 2. NEZAM Token Mapping

shadcn/ui uses its own CSS variable names. Map them to NEZAM design tokens in `globals.css`:

```css
/* globals.css — map shadcn variables to NEZAM tokens */
:root {
  /* shadcn variable → NEZAM token */
  --background: var(--nezam-color-surface-default);
  --foreground: var(--nezam-color-text-primary);
  --primary: var(--nezam-color-brand-primary);
  --primary-foreground: var(--nezam-color-text-on-primary);
  --secondary: var(--nezam-color-surface-subtle);
  --secondary-foreground: var(--nezam-color-text-secondary);
  --muted: var(--nezam-color-surface-muted);
  --muted-foreground: var(--nezam-color-text-tertiary);
  --border: var(--nezam-color-border-default);
  --ring: var(--nezam-color-border-focus);
  --radius: var(--nezam-radius-md);
  --destructive: var(--nezam-color-status-error);
}
```

**Rule:** shadcn CSS variable values must always reference NEZAM tokens — never raw hex values.

### 3. Component Extension Pattern

Never modify shadcn components in `components/ui/` directly. Always extend via wrapper components:

```ts
// ✅ CORRECT — wrapper component in components/
// components/branded-button.tsx
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BrandedButtonProps extends ButtonProps {
  icon?: React.ReactNode
}

export function BrandedButton({ icon, children, className, ...props }: BrandedButtonProps) {
  return (
    <Button className={cn('gap-2 font-semibold', className)} {...props}>
      {icon}
      {children}
    </Button>
  )
}

// ❌ WRONG — modifying the base shadcn component directly
// Do NOT edit components/ui/button.tsx
```

### 4. RTL Support

For directional components (elements that flip in RTL):

```tsx
// Use Tailwind logical properties with RTL support
<div className="ps-4 pe-2">  {/* ps = padding-start, pe = padding-end */}
  <Icon className="me-2" />  {/* me = margin-end */}
  {label}
</div>

// For components with directional icons (arrow, chevron):
<Button>
  {direction === 'rtl' ? <ArrowRight /> : <ArrowLeft />}
  {label}
</Button>
// Better: use CSS logical properties and let direction handle it automatically
```

For `dir="rtl"` at document level, shadcn components inherit RTL correctly for most cases. Test explicitly:
- Modal/Dialog: check close button position
- Select/Dropdown: check chevron direction
- Toast: check slide direction (should slide from `inline-end`)

### 5. Import Rule

```ts
// ✅ CORRECT
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ❌ WRONG — shadcn is not a published npm package
import { Button } from 'shadcn/ui'
```

## Output Artifacts

- New component files in `components/ui/<component>.tsx`
- Updated `globals.css` with shadcn-to-NEZAM token mappings
- Updated `.cursor/context/design-init/components.md`

## Validation Checklist

- [ ] All components added via CLI (`npx shadcn@latest add`) — none manually copied
- [ ] `globals.css` maps all shadcn CSS variables to NEZAM tokens (no raw hex values)
- [ ] Imports are from `@/components/ui/<component>` — never from `shadcn/ui` directly
- [ ] Extensions are wrapper components — base `components/ui/` files are unmodified
- [ ] RTL tested on all directional components (dialog close, dropdown chevron, toast slide direction)
- [ ] `components.md` updated after adding any new component

## Handoff Target

Component usage feeds `design/component-library-api` for extraction documentation. Token mapping feeds `design/design-tokens`.
