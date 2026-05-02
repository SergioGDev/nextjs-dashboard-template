---
description: Component architecture, design patterns, and conventions for NexDash UI components
paths:
  - src/components/**
---

## Component Layers

Build from the bottom up — never reach across layers or skip one:

```
src/components/ui/          # Primitives: Button, Card, Input, Label, Select, etc.
src/components/forms/       # Form compositions: login-form, user-form, settings-form
src/components/charts/      # Recharts wrappers: area-chart, bar-chart, line-chart, donut-chart
src/components/layout/      # App shell: sidebar, topbar, breadcrumbs, theme-toggle
src/components/dashboard/   # Feature components: kpi-card, activity-feed, data-table
```

## Class Merging

Always use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for className composition:

```tsx
import { cn } from '@/lib/utils';
className={cn('base-classes', conditional && 'conditional-class', className)}
```

Always accept and spread a `className` prop so consumers can override styles.

## `'use client'` Directive

Required on any component that uses hooks, event handlers, or browser APIs. Layouts and static shells are server components by default — do not add `'use client'` unless needed.

## Styling Tokens

Never use hardcoded colors. Always reference CSS custom properties:

| Category | Tokens |
|---|---|
| Layout | `var(--background)`, `var(--surface)`, `var(--surface-raised)` |
| Text | `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)` |
| Borders | `var(--border)`, `var(--border-strong)` |
| Accent | `var(--accent)`, `var(--accent-hover)`, `var(--accent-muted)`, `var(--accent-foreground)` |
| Semantic | `var(--success)`, `var(--warning)`, `var(--error)`, `var(--info)` + `-muted` variants |

In Tailwind: `bg-[var(--surface)]`, `text-[var(--text-primary)]`, etc.

## Button Variants

`Button` accepts:
- `variant`: `default | secondary | ghost | outline | destructive | link`
- `size`: `sm | md | lg | icon`
- `loading`: boolean — disables the button and shows a spinner. Use this for async actions instead of manual `disabled`.

## Adding a New UI Component

1. Create in `src/components/ui/`
2. Use `cn()` for className, accept `className` prop for overrides
3. Named export only (no default exports)
4. Add `'use client'` only if the component uses hooks or event handlers
