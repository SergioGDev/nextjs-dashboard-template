---
description: React Hook Form + Zod + i18n pattern for all forms in this project
paths:
  - src/components/forms/**
  - src/lib/validators/**
  - src/features/auth/schemas/**
  - src/features/users/schemas/**
---

# Forms — Reglas

## Patrón canónico (paso a paso)

**1. Schema en `lib/validators/{name}.schema.ts`**

O en `features/{feature}/schemas/` si es exclusivo de un dominio.
Siempre una **factory** que recibe los mensajes localizados como parámetros:

```ts
// lib/validators/auth.schema.ts
export function createLoginSchema(messages: {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}) {
  return z.object({
    email: z.string().min(1, messages.emailRequired).email(messages.emailInvalid),
    password: z.string().min(1, messages.passwordRequired),
  });
}
```

**2. En el componente (client) — instanciar schema + form:**

```ts
'use client';
const t = useTranslations('auth');
const schema = createLoginSchema({
  emailRequired: t('login.validation.emailRequired'),
  emailInvalid:  t('login.validation.emailInvalid'),
  passwordRequired: t('login.validation.passwordRequired'),
});
const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } =
  useForm<LoginFormValues>({ resolver: zodResolver(schema) });
```

**3. Render — usar la prop `label` y `error` del wrapper:**

```tsx
<Input
  label={t('login.form.emailLabel')}
  type="email"
  error={errors.email?.message}
  {...register('email')}
/>
```

NO usar `<label>` suelto. Los wrappers (Input, Textarea, Select, Checkbox, Switch,
RadioGroup, Slider) renderizan su propio `<label>` via la prop `label`.
El componente `Label` fue eliminado (0 consumers, YAGNI).

**4. Submit handler:**

```ts
async function onSubmit(data: LoginFormValues) {
  try {
    await mutateAsync(data);
    toast.success(t('toasts.success'));
  } catch {
    toast.error(t('toasts.error'));
  }
}
// En el form:
<form onSubmit={handleSubmit(onSubmit)}>
```

## Errors: inline vs toast

- **Validation errors** → siempre inline (`error={errors.X?.message}`). Nunca toast.
- **Server/API errors** → `toast.error`, EXCEPTO en **login**: inline (`ApiError` →
  mensaje mapeado en el formulario). Razón: el toast desaparece antes de que el usuario
  pueda releer / reintentar en una pantalla de autenticación.
- Ver `.claude/rules/feedback.md` → "Mutations and toasts" para la regla completa.

## Form state

```tsx
<Button type="submit" loading={isSubmitting} disabled={!isDirty}>
  {isSubmitting ? t('actions.saving') : t('actions.save')}
</Button>
```

- `isSubmitting` → prop `loading` en Button (spinner integrado).
- `isDirty` → para formularios de **edición** (settings). No usar en creación.
- `isValid` → evitar como único guard; puede mostrar errores prematuramente.

## mutateAsync vs mutate

- `mutateAsync` + try/catch → cuando necesitas cerrar dialog solo en éxito.
- `mutate(data, { onSuccess, onError })` → fire-and-forget.
- El toast vive en el **componente**, nunca en el hook.
- Ver `.claude/rules/feedback.md` → "Mutations and toasts".

## Anti-patrones — NO hacer

- ❌ Validar a mano con `if (!email.includes('@'))` — usar siempre Zod.
- ❌ `useState` para campo de form — usar siempre RHF `register`.
- ❌ Mensajes hardcodeados en el schema (`z.string().min(1, 'Required')`) — siempre factory.
- ❌ Toast para errores de validación — siempre inline.
- ❌ `'use client'` en el schema — el schema es agnóstico; solo el componente es client.
- ❌ `<label>` suelto junto a un wrapper que ya tiene prop `label` — duplica el label accesible.
- ❌ Llamar mutaciones reales desde una demo de showcase — demos usan submit no-op + toast.

## Receta: añadir un formulario nuevo

1. **Schema** → `lib/validators/{name}.schema.ts` con `createXxxSchema(messages)` factory.
2. **Types** → exportar `XxxFormValues` del schema o del feature.
3. **Component** → `src/components/forms/{name}-form.tsx` (o en el feature si es privado).
4. **i18n** → labels, placeholders, mensajes de validación en `en.json` + `es.json`.
5. **Mutation hook** (si aplica) → en `features/{feature}/api/use-{feature}.ts`.

## Referencias cruzadas

- `.claude/rules/i18n.md` → "Zod schemas con mensajes traducidos"
- `.claude/rules/feedback.md` → "Mutations and toasts", "Validation errors go inline"
- `.claude/rules/components.md` → capas de componentes

## Deuda técnica reconocida

`lib/validators/settings.schema.ts` y `lib/validators/user.schema.ts` están en
`lib/validators/` pero según `architecture.md` deberían vivir en
`features/{settings,users}/schemas/`. No se mueve en B6f — fuera de scope.
Pendiente para un bloque de cleanup futuro.
