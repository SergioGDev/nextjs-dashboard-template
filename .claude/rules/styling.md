---
description: Tailwind v4 setup, CSS custom properties, and theming system
paths:
  - src/app/globals.css
  - src/styles/**
  - src/components/**
---

## Tailwind v4

No `tailwind.config.js`. Configuration lives in `src/app/globals.css` via `@theme inline {}`. PostCSS handles compilation via `@tailwindcss/postcss`.

Custom tokens are mapped to Tailwind's color palette:
```css
@theme inline {
  --color-surface: var(--surface);
  --color-accent: var(--accent);
  /* etc. */
}
```

This means you can write `bg-surface` or `bg-[var(--surface)]` — both work.

## Theme System

Two things on `<html>` control the active theme, managed by next-themes + Zustand:

- **A class** — `.theme-dark` or `.theme-light` — color palette. next-themes is configured with
  `attribute="class"` and `value={{ light: 'theme-light', dark: 'theme-dark' }}` in
  `src/app/providers.tsx`. It is **not** a `data-theme` attribute.
- `data-accent="indigo | violet | emerald | rose | amber | cyan"` — accent color (this one *is*
  an attribute, set by `AccentSync` in `providers.tsx`).

Each combination has its own CSS block in **`src/styles/tokens.css`**, selected as
`.theme-dark[data-accent="indigo"]`. `globals.css` only holds `@theme inline` plus base styles
and imports `tokens.css` and `components.css`.

## Available Tokens

| Token | Usage |
|---|---|
| `--background` | Page background |
| `--surface` | Card / panel background |
| `--surface-raised` | Elevated elements, hover states |
| `--border` | Subtle borders |
| `--border-strong` | Prominent borders |
| `--text-primary` | Main body text |
| `--text-secondary` | Supporting text |
| `--text-muted` | Placeholder, disabled, captions |
| `--accent` | Primary brand color |
| `--accent-hover` | Darker accent for hover state |
| `--accent-muted` | Translucent accent (badges, highlights) |
| `--accent-foreground` | Text on accent background |
| `--success / --warning / --error / --info` | Semantic state colors |
| `*-muted` variants | Translucent background for chips/badges |

## Adding a New Accent Color

1. Add two CSS blocks in `src/styles/tokens.css` (one per theme), next to the existing accents:
   ```css
   .theme-dark[data-accent="teal"] {
     --accent: #14B8A6;
     --accent-hover: #0D9488;
     --accent-muted: rgba(20, 184, 166, 0.15);
     --accent-foreground: #FFFFFF;
   }
   .theme-light[data-accent="teal"] {
     --accent: #0D9488;
     --accent-hover: #0F766E;
     --accent-muted: rgba(13, 148, 136, 0.08);
     --accent-foreground: #FFFFFF;
   }
   ```
   The class-plus-attribute selector is not interchangeable with `[data-theme="dark"]` — that
   attribute is never set, so such a block would compile fine and never apply.
2. Add the new value to the options list in the settings form and in `useUIStore` if needed.
