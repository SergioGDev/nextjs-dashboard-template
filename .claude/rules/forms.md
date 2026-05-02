---
description: Form patterns using React Hook Form and Zod validation
paths:
  - src/components/forms/**
  - src/lib/validators/**
---

## Pattern

Forms follow a strict separation: schema in `src/lib/validators/`, form component in `src/components/forms/`.

### 1. Schema — `src/lib/validators/<entity>.schema.ts`

```ts
import { z } from 'zod';

export const entitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'editor', 'viewer']),
});

export type EntityFormValues = z.infer<typeof entitySchema>;
```

### 2. Form component — `src/components/forms/<entity>-form.tsx`

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entitySchema, EntityFormValues } from '@/lib/validators/entity.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EntityFormProps {
  defaultValues?: Partial<EntityFormValues>;
  onSubmit: (values: EntityFormValues) => Promise<void>;
}

export function EntityForm({ defaultValues, onSubmit }: EntityFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EntityFormValues>({
    resolver: zodResolver(entitySchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name" error={errors.name?.message} {...register('name')} />
      <Button type="submit" loading={isSubmitting}>Save</Button>
    </form>
  );
}
```

## UI Components

Use `Input` and `Select` from `@/components/ui/`:
- `label` prop — renders an accessible label above the field
- `error` prop — renders the validation message inline below the field
- Spread `{...register('fieldName')}` directly on the component

No wrapper `FormField`, `FormControl`, or `FormItem` abstraction exists — wire RHF directly to the UI primitives.

## Enum Fields

Use `<Select>` with `{...register('field')}` and `<option>` children. Define allowed values as `z.enum([...])` in the schema.
