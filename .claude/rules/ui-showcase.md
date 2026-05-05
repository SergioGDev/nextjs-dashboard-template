## UI section — design system docs

The `/ui` route is the living design system reference. Every new design system
component gets a dedicated page here.

**When creating a new component:**
1. Create the component in `src/components/ui/` (or the appropriate layer)
2. Create a page in `src/app/(dashboard)/ui/{categoria}/{nombre}/page.tsx`
3. Register the route in `src/config/routes.ts` under `ui.*`
4. Remove `disabled: true` from the nav item in `ui-subnav.tsx`
5. Increment the category `count` in the overview page

**Showcase components** (import from `@features/ui-showcase`):
- `ShowcaseSection` — groups demos with a heading + divider
- `ShowcaseDemo` — preview area + copyable code snippet (uses toast on copy)
- `ShowcaseGrid` — 1–3 column grid for multiple demos
- `PropsTable` — prop documentation table

**Patterns:**
- Page structure: Header → Variants (ShowcaseGrid) → edge cases → PropsTable → Methods
- Code snippets are plain strings — no syntax highlighting library
- `ShowcaseDemo` calls `toast.success('Copied to clipboard')` on copy — do NOT add extra feedback

**Reference page:** `src/app/(dashboard)/ui/toasts/page.tsx`
