# Component Blueprint Contract

This document defines baseline component API standards for template-derived apps.

## Goals

- Predictable typed component APIs
- Variant-driven styling contracts
- Direction-aware behavior (`ltr`/`rtl`)
- Accessibility-first defaults

## API baseline

Every reusable UI component should support:

- `className?: string`
- `children?: React.ReactNode` when compositional
- `data-*` passthrough attributes
- ref forwarding for interactive primitives

Direction handling:

- Components inherit `dir` from parent container.
- Components with directional visuals support explicit mirrored states.

## Variant system guidance (CVA-ready)

- Use `class-variance-authority` for variant definitions.
- Keep variant names semantic and stable.
- Prefer a small, composable variant set (`size`, `intent`, `tone`, `density`, `state`).

Recommended default variant groups:

- `size`: `sm | md | lg`
- `intent`: `neutral | primary | danger | success`
- `tone`: `solid | soft | outline | ghost`
- `state`: `default | loading | disabled`

## Typed contract example

```ts
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-md)] transition",
  {
    variants: {
      size: { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-11 px-5 text-base" },
      intent: {
        neutral: "bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]",
        primary: "bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-contrast)]",
      },
      tone: { solid: "", outline: "border border-[var(--color-border-muted)]", ghost: "bg-transparent" },
    },
    defaultVariants: { size: "md", intent: "neutral", tone: "solid" },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, loading, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants(props), className)}
      data-loading={loading ? "true" : undefined}
      {...props}
    />
  )
);
Button.displayName = "Button";
```

## Accessibility contract

- Visible focus ring required for keyboard users.
- Icon-only controls require labels (`aria-label`).
- Use semantic elements first (`button`, `a`, `input`).
- Disabled and loading states must preserve clear affordances.
- Avoid color-only state signaling.

## Direction-aware UI rules

- Use logical spacing and alignment utilities where possible.
- For arrows/chevrons:
  - Mirror in RTL or use direction-neutral icons.
- For slide-in animations:
  - Use direction-aware transform tokens/classes.

## Composition guidance

- Prefer compound components for complex widgets:
  - Example: `Card.Root`, `Card.Header`, `Card.Body`, `Card.Footer`.
- Use slot patterns where parent context controls shared state.
- Keep exports tree-shakeable and avoid side-effectful entry points.
