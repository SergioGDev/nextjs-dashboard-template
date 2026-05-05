'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/i18n/navigation';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { createLoginSchema, LoginFormValues } from '@/lib/validators/auth.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLogin } from '@features/auth';
import { ApiError } from '@lib/api/errors';
import { routes } from '@config/routes';
import { env } from '@config/env';
import { toast } from '@components/feedback/toast';

export function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  const schema = createLoginSchema({
    emailRequired: t('login.validation.emailRequired'),
    emailInvalid: t('login.validation.emailInvalid'),
    passwordRequired: t('login.validation.passwordRequired'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(schema) });

  function getErrorMessage(err: unknown): string {
    if (!ApiError.is(err)) return t('login.errors.generic');
    if (err.status === 401) return t('login.errors.invalidCredentials');
    if (err.code === 'VALIDATION_ERROR') return t('login.errors.validationError');
    if (err.status === 0) return t('login.errors.connectionError');
    return t('login.errors.generic');
  }

  function onSubmit(data: LoginFormValues) {
    login(data, {
      onSuccess: (session) => {
        toast.success(t('login.welcomeBack', { name: session.user.name }));
        router.push(routes.dashboard);
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-[var(--error)] bg-[var(--error-muted)] px-3 py-2.5 text-sm text-[var(--error)]">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{getErrorMessage(error)}</span>
        </div>
      )}

      <Input
        label={t('login.form.emailLabel')}
        type="email"
        placeholder={t('login.form.emailPlaceholder')}
        leftIcon={<Mail size={14} />}
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label={t('login.form.passwordLabel')}
        type="password"
        placeholder={t('login.form.passwordPlaceholder')}
        leftIcon={<Lock size={14} />}
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" className="w-full mt-2" loading={isPending} size="lg">
        {isPending ? t('login.form.submitting') : t('login.form.submit')}
      </Button>

      {env.NEXT_PUBLIC_USE_MOCKS && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-xs text-[var(--text-muted)] space-y-1">
          <p className="font-medium text-[var(--text-secondary)]">{t('login.demo.title')}</p>
          <p>admin@nexdash.com / admin123</p>
          <p>user@nexdash.com / user123</p>
        </div>
      )}
    </form>
  );
}
