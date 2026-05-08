'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { ShowcaseSection, ShowcaseGrid } from '@features/ui-showcase';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Select } from '@components/ui/select';
import { Button } from '@components/ui/button';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import { toast } from '@components/feedback/toast';
import { createLoginSchema } from '@/lib/validators/auth.schema';
import { createProfileSettingsSchema } from '@/lib/validators/settings.schema';
import { createUserSchema } from '@/lib/validators/user.schema';
import type { LoginFormValues } from '@/lib/validators/auth.schema';
import type { ProfileSettingsValues } from '@/lib/validators/settings.schema';
import type { UserFormValues } from '@/lib/validators/user.schema';

// ---------------------------------------------------------------------------
// Demo sub-components — local, no-op submit, no real mutations
// ---------------------------------------------------------------------------

function DemoLoginForm() {
  const t = useTranslations('forms');

  const schema = createLoginSchema({
    emailRequired: t('demos.validation.emailRequired'),
    emailInvalid: t('demos.validation.emailInvalid'),
    passwordRequired: t('demos.validation.passwordRequired'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(_data: LoginFormValues) {
    await new Promise((r) => setTimeout(r, 600));
    toast.success(t('demos.login.toast'));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
      {/* Placeholder server-error block — always shown in demo so the layout is visible */}
      <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-sm text-[var(--text-muted)]">
        <AlertCircle size={15} className="mt-0.5 shrink-0" />
        <span>Invalid credentials (demo error block)</span>
      </div>

      <Input
        label={t('demos.login.emailLabel')}
        type="email"
        placeholder={t('demos.login.emailPlaceholder')}
        leftIcon={<Mail size={14} />}
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label={t('demos.login.passwordLabel')}
        type="password"
        placeholder={t('demos.login.passwordPlaceholder')}
        leftIcon={<Lock size={14} />}
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" className="w-full mt-2" loading={isSubmitting} size="lg">
        {isSubmitting ? t('demos.login.submitting') : t('demos.login.submit')}
      </Button>
    </form>
  );
}

function DemoSettingsForm() {
  const t = useTranslations('forms');

  const schema = createProfileSettingsSchema({
    nameMin: t('demos.validation.nameMin'),
    emailInvalid: t('demos.validation.emailInvalid'),
    bioMax: t('demos.validation.bioMax'),
    websiteInvalid: t('demos.validation.websiteInvalid'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileSettingsValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: 'Jane Smith', email: 'jane@nexdash.com', bio: '', website: '' },
  });

  async function onSubmit(_data: ProfileSettingsValues) {
    await new Promise((r) => setTimeout(r, 600));
    toast.success(t('demos.settings.toast'));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('demos.settings.nameLabel')}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label={t('demos.settings.emailLabel')}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <Textarea
        label={t('demos.settings.bioLabel')}
        placeholder={t('demos.settings.bioPlaceholder')}
        error={errors.bio?.message}
        {...register('bio')}
      />
      <Input
        label={t('demos.settings.websiteLabel')}
        placeholder={t('demos.settings.websitePlaceholder')}
        error={errors.website?.message}
        {...register('website')}
      />
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          {isSubmitting ? t('demos.settings.saving') : t('demos.settings.save')}
        </Button>
      </div>
    </form>
  );
}

function DemoUserForm() {
  const t = useTranslations('forms');

  const schema = createUserSchema({
    nameRequired: t('demos.validation.nameRequired'),
    nameTooLong: t('demos.validation.nameTooLong'),
    emailRequired: t('demos.validation.emailRequired'),
    emailInvalid: t('demos.validation.emailInvalid'),
    roleRequired: t('demos.validation.roleRequired'),
    statusRequired: t('demos.validation.statusRequired'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', role: 'viewer' },
  });

  async function onSubmit(_data: UserFormValues) {
    await new Promise((r) => setTimeout(r, 600));
    toast.success(t('demos.user.toast'));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t('demos.user.nameLabel')}
        placeholder={t('demos.user.namePlaceholder')}
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label={t('demos.user.emailLabel')}
        type="email"
        placeholder={t('demos.user.emailPlaceholder')}
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select label={t('demos.user.roleLabel')} error={errors.role?.message} {...register('role')}>
          <option value="admin">{t('demos.user.roleAdmin')}</option>
          <option value="manager">{t('demos.user.roleManager')}</option>
          <option value="editor">{t('demos.user.roleEditor')}</option>
          <option value="viewer">{t('demos.user.roleViewer')}</option>
        </Select>
        <Select label={t('demos.user.statusLabel')} error={errors.status?.message} {...register('status')}>
          <option value="active">{t('demos.user.statusActive')}</option>
          <option value="inactive">{t('demos.user.statusInactive')}</option>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? t('demos.user.submitting') : t('demos.user.submit')}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function FormsContent() {
  const t = useTranslations('forms');
  const tNote = useTranslations('uiShowcase.localizationNote');

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('header.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
      </div>

      {/* Gallery */}
      <ShowcaseSection
        title={t('gallery.title')}
        description={t('gallery.description')}
      >
        {/* Login form */}
        <div className="space-y-2">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">{t('gallery.login.title')}</h3>
            <p className="text-xs text-[var(--text-muted)]">{t('gallery.login.description')}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <DemoLoginForm />
          </div>
          <p className="text-xs text-[var(--text-muted)] italic px-1">{t('gallery.login.note')}</p>
        </div>

        {/* Settings form */}
        <div className="space-y-2 mt-8">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">{t('gallery.settings.title')}</h3>
            <p className="text-xs text-[var(--text-muted)]">{t('gallery.settings.description')}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <DemoSettingsForm />
          </div>
          <p className="text-xs text-[var(--text-muted)] italic px-1">{t('gallery.settings.note')}</p>
        </div>

        {/* User form */}
        <div className="space-y-2 mt-8">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">{t('gallery.user.title')}</h3>
            <p className="text-xs text-[var(--text-muted)]">{t('gallery.user.description')}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <DemoUserForm />
          </div>
          <p className="text-xs text-[var(--text-muted)] italic px-1">{t('gallery.user.note')}</p>
        </div>
      </ShowcaseSection>

      {/* Patterns */}
      <ShowcaseSection title={t('patterns.title')}>
        <ShowcaseGrid columns={2}>
          {/* Schema with i18n factory */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2">
            <h3 className="text-sm font-medium">{t('patterns.schema.title')}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t('patterns.schema.description')}
            </p>
          </div>

          {/* Validation timing */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2">
            <h3 className="text-sm font-medium">{t('patterns.timing.title')}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t('patterns.timing.description')}
            </p>
          </div>

          {/* Server errors */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2">
            <h3 className="text-sm font-medium">{t('patterns.errors.title')}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t('patterns.errors.description')}
            </p>
          </div>

          {/* Form state */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2">
            <h3 className="text-sm font-medium">{t('patterns.state.title')}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t('patterns.state.description')}
            </p>
          </div>

          {/* Async submit */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2">
            <h3 className="text-sm font-medium">{t('patterns.async.title')}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t('patterns.async.description')}
            </p>
          </div>

          {/* Field-level errors */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2">
            <h3 className="text-sm font-medium">{t('patterns.field.title')}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t('patterns.field.description')}
            </p>
          </div>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Working with AI */}
      <ShowcaseSection title={t('ai.title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {t('ai.description')}
          </p>
        </div>
      </ShowcaseSection>

      {/* Localization */}
      <ShowcaseSection title={tNote('title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{tNote('description')}</p>
          <Link
            href={routes.ui.i18n}
            className="inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {tNote('linkLabel')}
          </Link>
        </div>
      </ShowcaseSection>
    </div>
  );
}
